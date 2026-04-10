import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/slices/authSlice";
import { userService } from "../../services/userService";
import { PATH } from "../../routes/path";

function getProfileCacheKey(email) {
  return email ? `profile_cache_${String(email).toLowerCase()}` : null;
}

function getIdentityEmail() {
  try {
    const identity = localStorage.getItem("auth_identity_email");
    return identity ? String(identity).toLowerCase() : null;
  } catch {
    return null;
  }
}

function writeProfileCache(userLike) {
  // Cache should follow the login identity so email edits won't "lose" data.
  const identityEmail = getIdentityEmail();
  const key = getProfileCacheKey(identityEmail || userLike?.email);
  if (!key) return;
  try {
    localStorage.setItem(key, JSON.stringify(userLike));
  } catch {
    // ignore
  }
}

export default function Profile() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, role, token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profile, setProfile] = useState(null);
  const [ordersCount, setOrdersCount] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const greetingName = useMemo(() => {
    return form.name || user?.name || user?.email || "bạn";
  }, [form.name, user?.email, user?.name]);

  useEffect(() => {
    let cancelled = false;

    const isSameUser = (a, b) => {
      const pick = (u) => ({
        id: u?.id ?? u?.userId ?? u?._id ?? null,
        name: u?.name ?? "",
        email: u?.email ?? "",
        phone: u?.phone ?? "",
        address: u?.address ?? "",
        role: u?.role ?? null,
        status: u?.status ?? null,
        updatedAt: u?.updatedAt ?? null,
      });
      const pa = pick(a);
      const pb = pick(b);
      return (
        pa.id === pb.id &&
        pa.name === pb.name &&
        pa.email === pb.email &&
        pa.phone === pb.phone &&
        pa.address === pb.address &&
        pa.role === pb.role &&
        pa.status === pb.status &&
        pa.updatedAt === pb.updatedAt
      );
    };

    const hydrateFromAuth = () => {
      setForm((prev) => ({
        ...prev,
        name: user?.name ?? prev.name ?? "",
        email: user?.email ?? prev.email ?? "",
        phone: user?.phone ?? prev.phone ?? "",
        address: user?.address ?? prev.address ?? "",
      }));
    };

    const hydrateFromApi = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await userService.getProfile();
        if (cancelled) return;
        const mergedUser = { ...(user || {}), ...(data || {}) };
        setProfile(mergedUser ?? null);
        setForm({
          name: mergedUser?.name ?? "",
          email: mergedUser?.email ?? "",
          phone: mergedUser?.phone ?? "",
          address: mergedUser?.address ?? "",
        });

        // Persist latest profile to storage so re-open keeps data.
        if (!isSameUser(user, mergedUser)) {
          dispatch(
            setUser({
              user: mergedUser,
              token,
              role: role ?? mergedUser?.role ?? null,
            }),
          );
          try {
            localStorage.setItem(
              "auth",
              JSON.stringify({
                user: mergedUser,
                token,
                role: role ?? mergedUser?.role ?? null,
              }),
            );
          } catch {
            // ignore
          }
          writeProfileCache(mergedUser);
        }
      } catch (e) {
        if (!cancelled) {
          setError(
            e?.message ||
              e?.error ||
              "Không thể tải thông tin hồ sơ. Vui lòng thử lại.",
          );
          hydrateFromAuth();
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    hydrateFromAuth();
    if (isAuthenticated) {
      hydrateFromApi();
    }

    return () => {
      cancelled = true;
    };
  }, [dispatch, isAuthenticated, role, token, user]);

  useEffect(() => {
    let cancelled = false;
    const loadOrdersCount = async () => {
      if (!isAuthenticated) return;
      try {
        const orders = await userService.getOrders();
        if (cancelled) return;
        const list = Array.isArray(orders) ? orders : orders?.items || orders?.data;
        if (Array.isArray(list)) setOrdersCount(list.length);
      } catch {
        // ignore: profile page shouldn't break if orders endpoint differs
      }
    };
    loadOrdersCount();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const onChange = (key) => (e) => {
    setSuccess("");
    setError("");
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (!isAuthenticated) {
      setError("Vui lòng đăng nhập để cập nhật hồ sơ.");
      return;
    }

    const payload = {
      name: form.name?.trim(),
      phone: form.phone?.trim(),
      address: form.address?.trim(),
    };

    setSaving(true);
    try {
      const updated = await userService.updateProfile(payload);
      const mergedUser = { ...(user || {}), ...(updated || {}), ...payload };
      setProfile(mergedUser);
      setForm({
        name: mergedUser?.name ?? "",
        email: mergedUser?.email ?? "",
        phone: mergedUser?.phone ?? "",
        address: mergedUser?.address ?? "",
      });

      // Keep redux + localStorage in sync so Navbar/topbar updates immediately.
      dispatch(setUser({ user: mergedUser, token, role: role ?? mergedUser?.role ?? null }));
      try {
        localStorage.setItem(
          "auth",
          JSON.stringify({ user: mergedUser, token, role: role ?? mergedUser?.role ?? null }),
        );
      } catch {
        // ignore
      }
      writeProfileCache(mergedUser);
      setSuccess("Cập nhật hồ sơ thành công.");
      setActiveTab("overview");
    } catch (e2) {
      setError(
        e2?.message ||
          e2?.error ||
          "Cập nhật thất bại. Vui lòng kiểm tra lại thông tin.",
      );
    } finally {
      setSaving(false);
    }
  };

  const effectiveProfile = profile || user || null;

  const accountInfo = useMemo(() => {
    const u = effectiveProfile;
    if (!u) return [];

    const rows = [];
    const push = (label, value) => {
      if (value === undefined || value === null || value === "") return;
      rows.push({ label, value });
    };

    push("Mã người dùng", u.id ?? u.userId ?? u._id);
    push("Email", u.email);
    push("Vai trò", role ?? u.role);
    push("Trạng thái", u.status);
    push("Ngày tạo", u.createdAt);
    push("Cập nhật", u.updatedAt);
    return rows;
  }, [effectiveProfile, role]);

  const initials = useMemo(() => {
    const name = (form.name || effectiveProfile?.name || "").trim();
    if (!name) return "U";
    const parts = name.split(/\s+/).filter(Boolean);
    const a = parts[0]?.[0] || "U";
    const b = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
    return (a + b).toUpperCase();
  }, [effectiveProfile?.name, form.name]);

  return (
    <div className="container py-4 py-md-5">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <div className="text-muted small">Tài khoản</div>
          <h1 className="h4 mb-0">Trang cá nhân</h1>
        </div>
        <div className="d-flex gap-2">
          <Link to={PATH.home} className="btn btn-outline-secondary">
            Tiếp tục mua sắm
          </Link>
          <Link to={PATH.orders} className="btn btn-outline-primary">
            Đơn hàng
          </Link>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center"
                  style={{
                    width: 56,
                    height: 56,
                    background: "rgba(240,125,174,0.15)",
                    color: "#d84f8f",
                    fontWeight: 800,
                    letterSpacing: 1,
                  }}>
                  {initials}
                </div>
                <div className="flex-grow-1">
                  <div className="fw-semibold">{effectiveProfile?.name || "Người dùng"}</div>
                  <div className="text-muted small">
                    {effectiveProfile?.email || "—"}
                  </div>
                </div>
              </div>

              <div className="text-muted mt-3">
                Xin chào <strong>{greetingName}</strong>
              </div>

              {!isAuthenticated ? (
                <div className="alert alert-warning mb-0" role="alert">
                  Bạn chưa đăng nhập.{" "}
                  <Link to={PATH.login} className="alert-link">
                    Đăng nhập
                  </Link>{" "}
                  để xem và cập nhật hồ sơ.
                </div>
              ) : (
                <>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    <span className="badge text-bg-primary">Đang đăng nhập</span>
                    {(role || effectiveProfile?.role) && (
                      <span className="badge text-bg-light border">
                        {role || effectiveProfile?.role}
                      </span>
                    )}
                    {typeof ordersCount === "number" && (
                      <span className="badge text-bg-light border">
                        {ordersCount} đơn hàng
                      </span>
                    )}
                  </div>

                  <div className="d-grid gap-2">
                    <Link to={PATH.orders} className="btn btn-outline-primary">
                      Xem đơn hàng
                    </Link>
                    <Link to={PATH.home} className="btn btn-outline-secondary">
                      Tiếp tục mua sắm
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>

          {isAuthenticated && accountInfo.length > 0 && (
            <div className="card shadow-sm mt-3">
              <div className="card-body">
                <h2 className="h6 mb-3">Thông tin tài khoản</h2>
                <div className="vstack gap-2 small">
                  {accountInfo.map((row) => (
                    <div
                      key={row.label}
                      className="d-flex justify-content-between gap-3">
                      <span className="text-muted">{row.label}</span>
                      <span className="text-end fw-medium">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="col-12 col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                <h2 className="h5 mb-0">Quản lý hồ sơ</h2>
                {isAuthenticated && (
                  <div className="nav nav-pills gap-2">
                    <button
                      type="button"
                      className={`btn btn-sm ${activeTab === "overview" ? "btn-primary" : "btn-outline-primary"}`}
                      onClick={() => setActiveTab("overview")}>
                      Tổng quan
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${activeTab === "edit" ? "btn-primary" : "btn-outline-primary"}`}
                      onClick={() => setActiveTab("edit")}>
                      Cập nhật
                    </button>
                  </div>
                )}
              </div>

              {loading && (
                <div className="alert alert-info" role="alert">
                  Đang tải hồ sơ...
                </div>
              )}

              {!!error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {!!success && (
                <div className="alert alert-success" role="alert">
                  {success}
                </div>
              )}

              {!isAuthenticated ? (
                <div className="alert alert-warning mb-0" role="alert">
                  Bạn cần đăng nhập để xem thông tin cá nhân.
                </div>
              ) : activeTab === "overview" ? (
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <div className="border rounded-3 p-3 h-100">
                      <div className="text-muted small">Họ và tên</div>
                      <div className="fw-semibold">
                        {effectiveProfile?.name || form.name || "—"}
                      </div>
                      <div className="text-muted small mt-2">Số điện thoại</div>
                      <div className="fw-semibold">
                        {effectiveProfile?.phone || form.phone || "—"}
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="border rounded-3 p-3 h-100">
                      <div className="text-muted small">Địa chỉ</div>
                      <div className="fw-semibold">
                        {effectiveProfile?.address || form.address || "—"}
                      </div>
                      <div className="text-muted small mt-2">Email</div>
                      <div className="fw-semibold">
                        {effectiveProfile?.email || form.email || "—"}
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="p-3 rounded-3 border bg-light-subtle">
                      <div className="fw-semibold mb-1">Gợi ý</div>
                      <div className="text-muted">
                        Hãy cập nhật đầy đủ họ tên, số điện thoại và địa chỉ để
                        quá trình giao hoa nhanh và chính xác hơn.
                      </div>
                      <button
                        type="button"
                        className="btn btn-primary mt-3"
                        onClick={() => setActiveTab("edit")}>
                        Cập nhật thông tin
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={onSubmit}>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label">Họ và tên</label>
                      <input
                        className="form-control"
                        value={form.name}
                        onChange={onChange("name")}
                        placeholder="Nhập họ và tên"
                        disabled={!isAuthenticated || saving}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label">Email</label>
                      <input
                        className="form-control"
                        value={form.email}
                        placeholder="Email"
                      disabled
                      readOnly
                      />
                    <div className="form-text">
                      Email là định danh tài khoản nên không thể thay đổi.
                    </div>
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label">Số điện thoại</label>
                      <input
                        className="form-control"
                        value={form.phone}
                        onChange={onChange("phone")}
                        placeholder="Nhập số điện thoại"
                        disabled={!isAuthenticated || saving}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label">Địa chỉ</label>
                      <input
                        className="form-control"
                        value={form.address}
                        onChange={onChange("address")}
                        placeholder="Nhập địa chỉ"
                        disabled={!isAuthenticated || saving}
                      />
                    </div>
                  </div>

                  <div className="d-flex gap-2 mt-4">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={!isAuthenticated || saving}>
                      {saving ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setActiveTab("overview")}
                      disabled={saving}>
                      Quay lại
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

