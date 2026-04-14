import "./Checkout.css";
import { useMemo, useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PATH } from "../../routes/path";
import { clearCart } from "../../redux/slices/cartSlice";
import { userService } from "../../services/userService";
import qrImage from "../../assets/qr.png"; 

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((state) => state.cart.items);
  const authUser = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [nameTouched, setNameTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [addressTouched, setAddressTouched] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const total = useMemo(() => {
    return items.reduce((sum, it) => {
      const price = it.discountPrice || it.price || 0;
      return sum + price * (it.quantity || 1);
    }, 0);
  }, [items]);

  const nameValid = name.trim().length > 0;
  // Accept Vietnamese mobile prefixes: 03,05,07,08,09 and total 10 digits
  const phoneValid = /^(0(3|5|7|8|9))[0-9]{8}$/.test(phone.trim());
  const addressValid = address.trim().length > 0;
  const isFormValid = nameValid && phoneValid && addressValid && items.length > 0;

  const BANK_NAME = "Ngân hàng ABC";
  const BANK_ACCOUNT = "0123456789";
  const BANK_BENEFICIARY = "Cửa hàng Shop Flower";

  const googleChartQr = useMemo(() => {
    const text = `${BANK_NAME}|${BANK_ACCOUNT}|${BANK_BENEFICIARY}|${total}`;
    return `https://chart.googleapis.com/chart?chs=400x400&cht=qr&chl=${encodeURIComponent(text)}`;
  }, [total]);

  const [qrSrc, setQrSrc] = useState(qrImage);
  const autoBankTimerRef = useRef(null);
  const submittingRef = useRef(false);

  function buildPayload() {
    return {
      products: items.map((it) => ({ id: it.id, quantity: it.quantity })),
      items: items.map((it) => ({ id: it.id, quantity: it.quantity })), 
      shippingAddress: {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        note: note.trim(),
      },
      paymentMethod: paymentMethod,
      status: paymentMethod === "bank" ? "paid" : "pending",
      total,
    };
  }

  useEffect(() => {
    if (authUser) {
      if (!name) setName(authUser.name || "");
      if (!phone) setPhone(authUser.phone || "");
      if (!address) setAddress(authUser.address || "");
    }
  }, [authUser]);

  async function handleSubmit(e) {
    e.preventDefault();
    setNameTouched(true);
    setPhoneTouched(true);
    setAddressTouched(true);

    if (submittingRef.current) return;
    if (autoBankTimerRef.current) {
      clearTimeout(autoBankTimerRef.current);
      autoBankTimerRef.current = null;
    }

    if (!isFormValid) {
      toast.error("Vui lòng kiểm tra lại thông tin người nhận và giỏ hàng.");
      return;
    }

    if (!paymentMethod) {
      toast.info("Vui lòng chọn phương thức thanh toán.");
      return;
    }

  setIsProcessing(true);
  submittingRef.current = true;
    try {
      const payload = buildPayload();
      const result = await userService.createOrder(payload);

      if (result && (result.id || result._id)) {
        toast.success("Tạo đơn hàng thành công.");
        dispatch(clearCart());
        navigate(PATH.orders);
        return;
      }

      toast.success("Đã gửi yêu cầu tạo đơn. Vui lòng kiểm tra trang Đơn hàng.");
      dispatch(clearCart());
      navigate(PATH.orders);
    } catch (err) {
      console.error("createOrder error", err);
      toast.error(err?.message || "Không thể tạo đơn hàng. Vui lòng thử lại sau.");
    } finally {
      setIsProcessing(false);
      submittingRef.current = false;
      if (autoBankTimerRef.current) {
        clearTimeout(autoBankTimerRef.current);
        autoBankTimerRef.current = null;
      }
    }
  }

  useEffect(() => {
    if (autoBankTimerRef.current) {
      clearTimeout(autoBankTimerRef.current);
      autoBankTimerRef.current = null;
    }

    if (paymentMethod === "bank" && isFormValid && !isProcessing) {
      autoBankTimerRef.current = setTimeout(async () => {
        if (paymentMethod !== "bank" || !isFormValid) return;
        if (submittingRef.current) return;
        setIsProcessing(true);
        submittingRef.current = true;
        toast.info("Đang xử lý thanh toán qua QR...");
        try {
          const payload = buildPayload();
          const result = await userService.createOrder(payload);
          if (result && (result.id || result._id)) {
            toast.success("Thanh toán bằng QR thành công. Đơn hàng đã được tạo.");
          } else {
            toast.success("Thanh toán bằng QR: yêu cầu tạo đơn đã được gửi.");
          }
          dispatch(clearCart());
          navigate(PATH.orders);
        } catch (err) {
          console.error("auto createOrder error", err);
          toast.error(err?.message || "Không thể tạo đơn hàng tự động. Vui lòng thử lại.");
        } finally {
          setIsProcessing(false);
          submittingRef.current = false;
          if (autoBankTimerRef.current) {
            clearTimeout(autoBankTimerRef.current);
            autoBankTimerRef.current = null;
          }
        }
      }, 10000);
    }

    return () => {
      if (autoBankTimerRef.current) {
        clearTimeout(autoBankTimerRef.current);
        autoBankTimerRef.current = null;
      }
    };
  }, [paymentMethod, isFormValid]);
  return (
    <div className="container py-4 py-md-5 checkout-container">
      <h1 className="h3 mb-4">Thanh Toán</h1>

      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="mb-3">Thông tin người nhận</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Họ và tên</label>
                  <input
                    className={`form-control ${nameTouched && !nameValid ? "is-invalid" : ""}`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => setNameTouched(true)}
                  />
                  {nameTouched && !nameValid && (
                    <div className="invalid-feedback">Vui lòng nhập họ và tên.</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Số điện thoại</label>
                  <input
                    className={`form-control ${phoneTouched && !phoneValid ? "is-invalid" : ""}`}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onBlur={() => setPhoneTouched(true)}
                  />
                  {phoneTouched && !phoneValid && (
                    <div className="invalid-feedback">Số điện thoại không hợp lệ (đầu số 03/05/07/08/09 và 10 chữ số).</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Địa chỉ</label>
                  <input
                    className={`form-control ${addressTouched && !addressValid ? "is-invalid" : ""}`}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onBlur={() => setAddressTouched(true)}
                  />
                  {addressTouched && !addressValid && (
                    <div className="invalid-feedback">Vui lòng nhập địa chỉ giao hàng.</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Ghi chú</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>

                <h6 className="mb-2">Phương thức thanh toán</h6>
                <div className="mb-3 form-check">
                  <input
                    type="radio"
                    id="cod"
                    name="payment"
                    className="form-check-input"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    disabled={!isFormValid}
                  />
                  <label htmlFor="cod" className={`form-check-label ${!isFormValid ? "text-muted" : ""}`}>
                    Thanh toán khi nhận hàng (COD)
                  </label>
                </div>

                <div className="mb-3 form-check">
                  <input
                    type="radio"
                    id="bank"
                    name="payment"
                    className="form-check-input"
                    checked={paymentMethod === "bank"}
                    onChange={() => setPaymentMethod("bank")}
                    disabled={!isFormValid}
                  />
                  <label htmlFor="bank" className={`form-check-label ${!isFormValid ? "text-muted" : ""}`}>
                    Chuyển khoản ngân hàng
                  </label>
                </div>

                {paymentMethod === "bank" && (
                  <div className="card mb-3 p-3 border-info">
                    <h6>Thông tin chuyển khoản</h6>
                    <p className="mb-1">Ngân hàng: <strong>{BANK_NAME}</strong></p>
                    <p className="mb-1">Số tài khoản: <strong>{BANK_ACCOUNT}</strong></p>
                    <p className="mb-1">Chủ tài khoản: <strong>{BANK_BENEFICIARY}</strong></p>
                    <p className="mb-1">Số tiền cần chuyển: <strong>{formatCurrency(total)}</strong></p>
                    <p className="small text-muted">Quét mã QR bên cạnh bằng ứng dụng ngân hàng để thanh toán nhanh.</p>
                  </div>
                )}

                <div className="d-flex justify-content-between align-items-center mt-4">
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() => navigate(PATH.cart)}
                    disabled={isProcessing}>
                    ← Quay lại giỏ hàng
                  </button>

                  {paymentMethod === "bank" ? (
                    <div className="text-end">
                      <div className="small text-info">Bạn đã chọn chuyển khoản. Hệ thống sẽ tự động xác nhận thanh toán trong vài giây sau khi quét mã QR.</div>
                    </div>
                  ) : (
                    <button
                      className="btn btn-success"
                      type="submit"
                      disabled={!isFormValid || !paymentMethod || isProcessing}
                    >
                      {isProcessing
                        ? "Đang xử lý..."
                        : !paymentMethod
                        ? "Chọn phương thức thanh toán"
                        : `Thanh toán ${formatCurrency(total)}`}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="mb-3">Tóm tắt đơn hàng</h5>
              {items.map((it) => (
                <div key={it.id} className="d-flex justify-content-between mb-2">
                  <div>
                    <div className="fw-semibold">{it.name}</div>
                    <div className="text-muted small">Số lượng: {it.quantity}</div>
                  </div>
                  <div className="text-end">
                    <div>{formatCurrency((it.discountPrice || it.price) * it.quantity)}</div>
                  </div>
                </div>
              ))}

              <hr />
              <div className="d-flex justify-content-between align-items-center">
                <div className="fw-semibold">Tổng cộng</div>
                <div className="h5 text-danger mb-0">{formatCurrency(total)}</div>
              </div>
              {paymentMethod === "bank" && (
                <div className="mt-4 d-flex gap-3 align-items-center">
                  <div>
                    <img
                      src={qrSrc}
                      alt="QR chuyển khoản"
                      width={200}
                      height={200}
                      onError={(e) => {
                        e.currentTarget.src = googleChartQr;
                      }}
                    />
                    <div className="small text-muted">Quét mã QR để thanh toán</div>
                  </div>
                  <div>
                    <p className="mb-1">Ngân hàng: <strong>{BANK_NAME}</strong></p>
                    <p className="mb-1">Số tài khoản: <strong>{BANK_ACCOUNT}</strong></p>
                    <p className="mb-1">Chủ TK: <strong>{BANK_BENEFICIARY}</strong></p>
                    <p className="mb-1">Số tiền: <strong>{formatCurrency(total)}</strong></p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

