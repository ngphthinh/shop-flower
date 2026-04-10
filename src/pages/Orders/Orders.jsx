import "./Orders.css";
import { useEffect, useState } from "react";
import { userService } from "../../services/userService";
import { productService } from "../../services/productService";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../routes/path";
import { formatDate } from "../../utils/formatDate";
import { toast } from "react-toastify";

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value || 0);
}

export default function Orders() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [productsMap, setProductsMap] = useState({});

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      try {
        // load products to map ids -> product
        const prods = await productService.getProducts();
        const prodArray = Array.isArray(prods) ? prods : [];
        const map = prodArray.reduce((acc, p) => {
          acc[p.id] = p;
          return acc;
        }, {});
        if (!mounted) return;
        setProductsMap(map);

        const stored = localStorage.getItem("mock_orders");
        const mock = stored ? JSON.parse(stored) : [];
        if (Array.isArray(mock) && mock.length > 0) {
          setOrders(mock.slice().reverse());
        } else {
          try {
            const data = await userService.getOrders();
            if (!mounted) return;
            if (Array.isArray(data)) {
              setOrders(data);
            } else if (data && Array.isArray(data.orders)) {
              setOrders(data.orders);
            } else if (data) {
              setOrders([data]);
            } else {
              setOrders([]);
            }
          } catch (err) {
            const stored2 = localStorage.getItem("mock_orders");
            const mock2 = stored2 ? JSON.parse(stored2) : [];
            setOrders(Array.isArray(mock2) ? mock2.reverse() : []);
          }
        }
      } catch (err) {
        console.error("Orders load error", err);
        toast.error("Không thể tải danh sách sản phẩm hoặc đơn hàng.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <LoadingSpinner />;
  const safeOrders = Array.isArray(orders) ? orders : orders ? [orders] : [];

  return (
    <div className="orders-container container py-4">
      <h1 className="mb-4">Lịch Sử Đơn Hàng</h1>
      {safeOrders.length === 0 ? (
        <div className="card p-4">
          <p className="mb-0">Bạn chưa có đơn hàng nào.</p>
        </div>
      ) : (
        safeOrders.map((order) => (
          <div key={order.id || order._id} className="card mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <div className="fw-semibold">Mã đơn: {order.id || order._id}</div>
                  <div className="text-muted small">{formatDate(order.createdAt || order.created_at)}</div>
                </div>
                <div className="text-end">
                  <div className={`badge ${order.status === "paid" ? "bg-success" : "bg-warning text-dark"}`}>
                    {order.status === "paid" ? "Đã thanh toán" : "Chờ thanh toán"}
                  </div>
                </div>
              </div>
              <div className="mb-2 text-end">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => {
                    const id = order.id || order._id;
                    if (id) navigate(PATH.orderDetail.replace(":id", id));
                  }}
                >
                  Xem chi tiết
                </button>
              </div>

              <div className="mb-2">
                {(order.products || order.items || []).map((p, idx) => {
                  const itemId = p.id ?? p.productId ?? p._id ?? p.product_id ?? (p.product && (p.product.id || p.product._id));
                  const prod = productsMap[itemId] || {};
                  const name = prod.name || p.name || `Sản phẩm #${itemId ?? idx}`;
                  const qty = p.quantity ?? p.qty ?? (p.product && p.product.quantity) ?? 1;
                  const price = prod.price ?? p.price ?? p.unitPrice ?? (p.product && p.product.price) ?? 0;
                  const key = itemId ?? `${idx}`;
                  return (
                    <div key={key} className="d-flex justify-content-between mb-1">
                      <div>
                        <div className="fw-semibold">{name}</div>
                        <div className="text-muted small">Số lượng: {qty}</div>
                      </div>
                      <div className="text-end">
                        <div>{formatCurrency(price * (qty || 1))}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <hr />
              <div className="d-flex justify-content-between align-items-center">
                <div className="small text-muted">Phương thức: {order.paymentMethod || "COD"}</div>
                <div className="fw-semibold">Tổng: {formatCurrency(order.total || 0)}</div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
