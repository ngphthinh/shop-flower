import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "../../redux/slices/cartSlice";
import { PATH } from "../../routes/path";

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}

export default function Cart() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + (item.discountPrice || item.price) * item.quantity,
        0,
      ),
    [items],
  );

  const onIncrease = (id) => {
    dispatch(increaseQuantity(id));
    toast.info("Đã tăng số lượng.");
  };

  const onDecrease = (id) => {
    dispatch(decreaseQuantity(id));
    toast.info("Đã giảm số lượng.");
  };

  const onRemove = (id) => {
    dispatch(removeFromCart(id));
    toast.warning("Đã xóa sản phẩm khỏi giỏ.");
  };

  return (
    <div className="container py-4 py-md-5 cart-page">
      <h1 className="h3 mb-4">Giỏ hàng</h1>

      {items.length === 0 ? (
        <div className="alert alert-light border">
          Giỏ hàng của bạn đang trống.
          <br />
          <Link to={PATH.home} className="btn btn-primary mt-3">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <>
          <div className="table-responsive cart-table-wrap">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th className="text-center">Số lượng</th>
                  <th className="text-end">Đơn giá</th>
                  <th className="text-end">Thành tiền</th>
                  <th className="text-end">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={item.thumbnail || item.images?.[0] || item.image}
                          alt={item.name}
                          width="64"
                          height="64"
                          className="rounded"
                          style={{ objectFit: "cover" }}
                        />
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex justify-content-center align-items-center gap-2">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => onDecrease(item.id)}>
                          -
                        </button>
                        <span className="fw-semibold">{item.quantity}</span>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => onIncrease(item.id)}>
                          +
                        </button>
                      </div>
                    </td>
                    <td className="text-end">
                      {formatCurrency(item.discountPrice || item.price)}
                    </td>
                    <td className="text-end fw-semibold">
                      {formatCurrency(
                        (item.discountPrice || item.price) * item.quantity,
                      )}
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => onRemove(item.id)}>
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-4 gap-3">
            <Link to={PATH.home} className="btn btn-outline-secondary">
              ← Tiếp tục mua sắm
            </Link>

            <div className="card border-0 shadow-sm cart-summary-card">
              <div className="card-body">
                <p className="mb-1 text-muted">Tổng tiền</p>
                <p className="h4 text-danger mb-0">{formatCurrency(total)}</p>
              </div>
            </div>

            <Link to={PATH.checkout} className="btn btn-success btn-lg">
              Thanh toán →
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
