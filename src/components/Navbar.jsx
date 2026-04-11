import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  FaCartShopping,
  FaHeadset,
  FaStore,
  FaUser,
  FaArrowRightFromBracket,
} from "react-icons/fa6";
import { FiPhoneCall, FiMapPin, FiSearch } from "react-icons/fi";
import { fetchProducts } from "../redux/slices/productSlice";
import { logout } from "../redux/slices/authSlice";
import { PATH } from "../routes/path";
import "./Navbar.css";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const cartItems = useSelector((state) => state.cart.items);
  const { isAuthenticated, user, role } = useSelector((state) => state.auth);
  const { items, loading: productsLoading } = useSelector((state) => state.products);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    dispatch(logout());
    navigate(PATH.home);
  };

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, items.length]);

  const suggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    return items
      .filter((product) => {
        const name = product.name?.toLowerCase() || "";
        const category = product.category?.name?.toLowerCase() || "";
        return name.includes(q) || category.includes(q);
      })
      .slice(0, 6);
  }, [items, searchQuery]);

  const categorySuggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    const seen = new Map();
    for (const product of items) {
      const cat = product?.category;
      if (!cat?.id || !cat?.name) continue;
      if (seen.has(cat.id)) continue;
      const name = String(cat.name).toLowerCase();
      if (name.includes(q)) {
        seen.set(cat.id, { id: cat.id, name: cat.name });
      }
    }
    return Array.from(seen.values()).slice(0, 4);
  }, [items, searchQuery]);

  const handleSearch = (e, query = searchQuery) => {
    e.preventDefault();
    const cleaned = query.trim();
    if (!cleaned) return;

    navigate(`${PATH.search}?q=${encodeURIComponent(cleaned)}`);
    setSearchQuery("");
    setOpen(false);
    setActiveIndex(-1);
  };

  const handleCategoryClick = (category) => {
    if (!category?.id) return;
    navigate(`/category/${category.id}`);
    setSearchQuery("");
    setOpen(false);
    setActiveIndex(-1);
  };

  const handleSearchInputKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((idx) => Math.min(idx + 1, suggestions.length - 1));
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((idx) => Math.max(idx - 1, -1));
      return;
    }

    if (e.key === "Enter") {
      if (open && activeIndex >= 0 && suggestions[activeIndex]) {
        handleSearch(e, suggestions[activeIndex].name);
        return;
      }
      handleSearch(e);
    }

    if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <header className="site-header sticky-top bg-white">
      <div className="topbar py-2">
        <div className="container d-flex justify-content-between align-items-center small text-white">
          <div></div>
          <div className="d-none d-md-flex gap-4 align-items-center">
        
            {role === "ADMIN" ? (
              <Link
                to={PATH.adminSupport}
                className="d-flex align-items-center gap-1 text-white text-decoration-none">
                <FaHeadset /> Hỗ trợ
              </Link>
            ) : (
              <span className="d-flex align-items-center gap-1">
                <FaHeadset /> Hỗ trợ
              </span>
            )}

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="auth-user">
                <FaUser className="me-2" />
                <Link
                  to={PATH.profile}


                  className="me-3"
                  style={{ color: "white", textDecoration: "none" }}>
                  {user?.name || user?.email || "Tài khoản"}

                </Link>
                {role === "ADMIN" && (
                  <Link to={PATH.adminDashboard} className="admin-badge">
                    Thống kê
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="logout-btn"
                  title="Đăng xuất">
                  <FaArrowRightFromBracket />
                </button>
              </div>
            ) : (
              <div className="auth-links">
                <Link to={PATH.login} className="me-3">
                  Đăng nhập
                </Link>
                <Link to={PATH.register}>Đăng ký</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container py-3">
        <div className="row align-items-center g-3">
          <div className="col-12 col-lg-3">
            <Link className="brand-name" to="/">
              Beautiful Flowers
              <span>Hoa tươi mỗi ngày</span>
            </Link>
          </div>

          <div className="col-12 col-lg-5">
            <form className="search-wrap" onSubmit={handleSearch}>
              <input
                ref={inputRef}
                className="form-control border-0"
                placeholder="Tìm kiếm theo tên hoa, danh mục hoa..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                onBlur={() => setTimeout(() => setOpen(false), 120)}
                onKeyDown={handleSearchInputKeyDown}
                aria-autocomplete="list"
                aria-expanded={open}
                aria-controls="navbar-search-suggestions"
              />
              <button
                className="btn btn-search"
                type="submit"
                aria-label="search">
                <FiSearch />
              </button>

              {open && suggestions.length > 0 && (
                <div
                  className="navbar-search-suggestions"
                  role="listbox"
                  id="navbar-search-suggestions">
                  {categorySuggestions.length > 0 && (
                    <>
                      <div className="navbar-search-suggestions__title">
                        Danh mục
                      </div>
                      {categorySuggestions.map((cat) => (
                        <button
                          key={`cat-${cat.id}`}
                          type="button"
                          className="navbar-search-suggestion"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleCategoryClick(cat)}>
                          <span className="navbar-search-suggestion__name">
                            {cat.name}
                          </span>
                          <small className="navbar-search-suggestion__meta">
                            Xem danh mục
                          </small>
                        </button>
                      ))}
                      <div className="navbar-search-suggestions__divider" />
                    </>
                  )}

                  <div className="navbar-search-suggestions__title">
                    Sản phẩm
                  </div>
                  {suggestions.map((product, index) => (
                    <button
                      key={product.id ?? `${product.name}-${index}`}
                      type="button"
                      className={`navbar-search-suggestion ${index === activeIndex ? "is-active" : ""}`}
                      onMouseEnter={() => setActiveIndex(index)}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() =>
                        handleSearch({ preventDefault: () => {} }, product.name)
                      }
                      aria-selected={index === activeIndex}>
                      <span className="navbar-search-suggestion__name">
                        {product.name}
                      </span>
                      {product.category?.name && (
                        <small className="navbar-search-suggestion__meta">
                          {product.category.name}
                        </small>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {open &&
                searchQuery.trim() &&
                suggestions.length === 0 && (
                  <div
                    className="navbar-search-suggestions"
                    role="listbox"
                    id="navbar-search-suggestions">
                    <div className="navbar-search-suggestion navbar-search-suggestion--empty">
                      <span className="navbar-search-suggestion__name">
                        {productsLoading
                          ? "Đang tải dữ liệu sản phẩm…"
                          : "Không có gợi ý phù hợp"}
                      </span>
                      <small className="navbar-search-suggestion__meta">
                        Nhấn Enter hoặc bấm kính lúp để tìm “{searchQuery.trim()}”
                      </small>
                    </div>
                  </div>
                )}
            </form>
          </div>

          <div className="col-6 col-lg-2 text-lg-center">
            <div className="header-info">
              {/* <FiMapPin /> */}
              <div>
                {/* <small>Giao từ</small>
                <div>2 giờ</div> */}
              </div>
            </div>
          </div>

          <div className="col-6 col-lg-2 d-flex justify-content-end align-items-center gap-3">
            <div className="header-info d-none d-md-flex">
              <FiPhoneCall />
              <div>
                <small>Hotline</small>
                <div>1800 1143</div>
              </div>
            </div>

            <NavLink to={PATH.cart} className="cart-pill">
              <FaCartShopping />
              <span>{totalItems}</span>
            </NavLink>
          </div>
        </div>
      </div>

      <div className="header-nav container pb-2 d-flex align-items-center gap-3">
        <NavLink to={PATH.home} end className="header-nav__item">
          Trang chủ
        </NavLink>
        <NavLink to={PATH.cart} className="header-nav__item">
          Giỏ hàng
        </NavLink>
        {isAuthenticated && (
          <NavLink to={PATH.orders} className="header-nav__item">
            Đơn hàng
          </NavLink>
        )}
        {isAuthenticated && (
          <NavLink to={PATH.profile} className="header-nav__item">
            Tài khoản
          </NavLink>
        )}
        {role === "ADMIN" && (
          <>
            <NavLink to={PATH.adminDashboard} className="header-nav__item">
              Dashboard
            </NavLink>
            <div className="header-nav__dropdown">
              <span className="header-nav__item">Thống kê</span>
              <div className="header-nav__dropdown-menu">
                <NavLink
                  to={PATH.statisticsRevenue}
                  className="header-nav__dropdown-item">
                  Doanh thu
                </NavLink>
                <NavLink
                  to={PATH.statisticsOrders}
                  className="header-nav__dropdown-item">
                  Đơn hàng
                </NavLink>
                <NavLink
                  to={PATH.statisticsProducts}
                  className="header-nav__dropdown-item">
                  Sản phẩm
                </NavLink>
                <NavLink
                  to={PATH.statisticsCustomers}
                  className="header-nav__dropdown-item">
                  Khách hàng
                </NavLink>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
