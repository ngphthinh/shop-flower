import "./Orders.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { userService } from "../../services/userService";
import { productService } from "../../services/productService";
import LoadingSpinner from "../../components/LoadingSpinner";
import { formatDate } from "../../utils/formatDate";

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value || 0);
}

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [productsMap, setProductsMap] = useState({});

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const prods = await productService.getProducts();
        const prodArray = Array.isArray(prods) ? prods : [];
        const map = prodArray.reduce((acc, p) => {
          acc[p.id] = p;
          return acc;
        }, {});
        if (!mounted) return;
        setProductsMap(map);

        try {
          const data = await userService.getOrder(id);
          if (!mounted) return;
          setOrder(data);
        } catch (err) {
          const stored = localStorage.getItem("mock_orders");
          const mock = stored ? JSON.parse(stored) : [];
          const found = (mock || []).find((o) => String(o.id) === String(id) || String(o._id) === String(id));
          if (mounted) setOrder(found || null);
        }
      } catch (err) {
        console.error("OrderDetail load error", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return <LoadingSpinner />;

  if (!order) {
    return (
      <div className="container py-4">
        <div className="card p-4">Không tìm thấy đơn hàng.</div>
        <button className="btn btn-link mt-3" onClick={() => navigate(-1)}>← Quay lại</button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">Chi tiết đơn hàng</h1>
      <div className="card p-3 mb-3">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <div className="fw-semibold">Mã đơn: {order.id || order._id}</div>
            <div className="text-muted small">{formatDate(order.createdAt || order.created_at)}</div>
          </div>
          <div className={`badge ${order.status === "paid" ? "bg-success" : "bg-warning text-dark"}`}>
            {order.status === "paid" ? "Đã thanh toán" : "Chờ thanh toán"}
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <h6>Người nhận</h6>
            {(() => {
              const s = order.shippingAddress || order.shipping || order.receiver || order.address || order.customer || {};
              return (
                <div>
                  <div className="fw-semibold">{s.name || s.fullName || order.recipientName || order.name || "(Chưa có tên)"}</div>
                  <div className="small text-muted">SĐT: {s.phone || order.phone || order.recipientPhone || "(Chưa có)"}</div>
                  <div className="small text-muted">Địa chỉ: {s.address || s.addressLine || s.street || order.address || order.shippingAddress?.address || "(Chưa có)"}</div>
                  {s.note && <div className="small text-muted">Ghi chú: {s.note}</div>}
                </div>
              );
            })()}
          </div>

          <div className="col-md-6">
            <h6>Thông tin đơn</h6>
            <div className="small text-muted">Phương thức: {order.paymentMethod || order.payment || "COD"}</div>
            <div className="small text-muted">Trạng thái: {order.status || "pending"}</div>
            <div className="small text-muted">Mã giao dịch: {order.transactionId || order.txnId || order.paymentId || "-"}</div>
            <div className="small text-muted">Ngày tạo: {formatDate(order.createdAt || order.created_at)}</div>
          </div>
        </div>

        <div>
          <h6>Sản phẩm</h6>
          <div className="table-responsive">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th> Sản phẩm </th>
                  <th className="text-end">Đơn giá</th>
                  <th className="text-center">Số lượng</th>
                  <th className="text-end">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {(order.products || order.items || []).map((p, idx) => {
                  const itemId = p.id ?? p.productId ?? p._id ?? p.product_id ?? (p.product && (p.product.id || p.product._id));
                  const prod = productsMap[itemId] || p.product || p.productSnapshot || {};
                  const name = prod.name || p.name || `Sản phẩm #${itemId ?? idx}`;
                  const thumbnail = prod.thumbnail || prod.image || p.thumbnail || p.image || prod.thumb;
                  const unitPrice = prod.discountPrice ?? prod.price ?? p.price ?? p.unitPrice ?? 0;
                  const qty = p.quantity ?? p.qty ?? (p.product && p.product.quantity) ?? 1;
                  const subtotal = unitPrice * (qty || 1);
                  const key = itemId ?? `${idx}`;
                  return (
                    <tr key={key}>
                      <td>
                        <div className="d-flex align-items-center">
                          {thumbnail && (
                            <img src={thumbnail} alt={name} style={{ width: 56, height: 56, objectFit: "cover" }} className="me-2" />
                          )}
                          <div>
                            <div className="fw-semibold">{name}</div>
                            <div className="small text-muted">{prod.description && prod.description.substring(0, 80)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-end">{formatCurrency(unitPrice)}</td>
                      <td className="text-center">{qty}</td>
                      <td className="text-end">{formatCurrency(subtotal)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <hr />
        <div className="d-flex justify-content-end">
          <div style={{ minWidth: 260 }}>
            <div className="d-flex justify-content-between small text-muted">
              <div>Tạm tính</div>
              <div>{formatCurrency(order.subtotal ?? order.itemsTotal ?? order.total_before_shipping ?? (order.total ? order.total - (order.shippingFee || 0) : 0))}</div>
            </div>
            <div className="d-flex justify-content-between small text-muted">
              <div>Phí vận chuyển</div>
              <div>{formatCurrency(order.shippingFee ?? order.shipping_cost ?? 0)}</div>
            </div>
            {order.discount && (
              <div className="d-flex justify-content-between small text-muted">
                <div>Giảm giá</div>
                <div>-{formatCurrency(order.discount)}</div>
              </div>
            )}
            <div className="d-flex justify-content-between fw-semibold mt-2">
              <div>Tổng thanh toán</div>
              <div>{formatCurrency(order.total ?? 0)}</div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>← Quay lại</button>
      </div>
    </div>
  );
}
