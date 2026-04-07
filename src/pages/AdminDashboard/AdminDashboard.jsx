import { useSelector } from "react-redux";
import { FaBox, FaClipboardList, FaUsers } from "react-icons/fa6";
import "./AdminDashboard.css";
import { Link } from "react-router-dom";
import { PATH } from "../../routes/path";
export default function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Chào mừng, {user?.name}!</p>
      </div>

      <div className="admin-grid">
        <Link
          to={PATH.adminProducts}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div className="admin-card">
            <h3>
              <FaBox className="me-2" />
              Quản lý sản phẩm
            </h3>
            <p>CRUD sản phẩm (Create, Read, Update, Delete)</p>
          </div>
        </Link>
        <div className="admin-card">
          <h3>
            <FaBox className="me-2" />
            Quản lý sản phẩm
          </h3>
          <p>CRUD sản phẩm (Create, Read, Update, Delete)</p>
        </div>
        <Link
          to={PATH.adminOrders}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div className="admin-card">
            <h3>
              <FaClipboardList className="me-2" />
              Quản lý đơn hàng
            </h3>
            <p>Xem và cập nhật trạng thái đơn hàng</p>
          </div>
        </Link>
        <Link
          to={PATH.adminUsers}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div className="admin-card">
            <h3>
              {" "}
              <FaClipboardList className="me-2" />
              👥 Quản lý người dùng
            </h3>
            <p>Quản lý tài khoản người dùng</p>
          </div>
        </Link>
        <div className="admin-card">
          <h3>📊 Báo cáo &amp; Thống kê</h3>
          <p>Xem doanh thu, lợi nhuận, xu hướng bán hàng</p>
        </div>
      </div>
    </div>
  );
}
