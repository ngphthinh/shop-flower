import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import {
  FaCartShopping,
  FaHeadset,
  FaStore,
  FaUser,
  FaArrowRightFromBracket,
} from "react-icons/fa6";
import { FiPhoneCall, FiMapPin, FiSearch } from "react-icons/fi";
import { logout } from "../redux/slices/authSlice";
import { PATH } from "../routes/path";
import "./Navbar.css";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const cartItems = useSelector((state) => state.cart.items);
  const { isAuthenticated, user, role } = useSelector((state) => state.auth);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    dispatch(logout());
    navigate(PATH.home);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`${PATH.search}?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const handleSearchInputKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  return (
    <header className="site-header sticky-top bg-white">
      <div className="topbar py-2">
        <div className="container d-flex justify-content-between align-items-center small text-white">
          <div></div>
          <div className="d-none d-md-flex gap-4 align-items-center">
            <span className="d-flex align-items-center gap-1">
              <FaStore /> Tin nổi bật
            </span>

            <span className="d-flex align-items-center gap-1">
              <FaHeadset /> Hỗ trợ
            </span>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="auth-user">
                <FaUser className="me-2" />
                <span className="me-3">{user?.name}</span>
                {role === "ADMIN" && (
                  <Link to={PATH.adminDashboard} className="admin-badge">
                    Admin
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
                className="form-control border-0"
                placeholder="Tìm kiếm hoa, bó hoa, hoa chậu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchInputKeyPress}
              />
              <button
                className="btn btn-search"
                type="submit"
                aria-label="search">
                <FiSearch />
              </button>
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
        {role === "ADMIN" && (
          <NavLink
            to={PATH.adminDashboard}
            className="header-nav__item admin-link">
            Admin
          </NavLink>
        )}
      </div>
    </header>
  );
}
