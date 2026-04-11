import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaSearch,
  FaUserPlus,
  FaEdit,
  FaTrash,
  FaLock,
  FaLockOpen,
  FaChartBar,
  FaBox,
  FaShoppingCart,
  FaHeadset,
} from "react-icons/fa";
import { PATH } from "../../routes/path";

import Button from "../../components/Button/Button";
import Modal from "../../components/Modal/Modal";
import LoadingSpinner from "../../components/LoadingSpinner";
import "../AdminDashboard/AdminDashboard.css";

const LOCAL_STORAGE_KEY = "shopflower_users";

export default function UserManagement() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
    status: "ACTIVE",
  });

  const loadUsers = () => {
    setIsLoading(true);
    try {
      const storedUsers = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      } else {
        const initialData = [
          {
            id: 1,
            name: "Admin Trưởng",
            email: "admin@shopflower.com",
            role: "ADMIN",
            status: "ACTIVE",
          },
          {
            id: 2,
            name: "Nguyễn Văn Khách",
            email: "khachhang1@gmail.com",
            role: "USER",
            status: "ACTIVE",
          },
          {
            id: 3,
            name: "Trần Thị Cấm",
            email: "spammer@yahoo.com",
            role: "USER",
            status: "LOCKED",
          },
        ];
        setUsers(initialData);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialData));
      }
    } catch (error) {
      toast.error("Lỗi khi tải dữ liệu người dùng!");
    } finally {
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole === "" || user.role === filterRole;
    return matchSearch && matchRole;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openAddModal = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "USER",
      status: "ACTIVE",
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setFormData({ ...user, password: "" });
    setEditingId(user.id);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      let updatedUsers;

      if (editingId) {
        updatedUsers = users.map((u) =>
          u.id === editingId ? { ...formData, id: editingId } : u,
        );
        toast.success("Cập nhật thông tin người dùng thành công!");
      } else {
        const newUser = { ...formData, id: Date.now() };
        updatedUsers = [...users, newUser];
        toast.success("Đã thêm người dùng mới!");
      }

      setUsers(updatedUsers);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedUsers));
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handleToggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === "ACTIVE" ? "LOCKED" : "ACTIVE";
    const updatedUsers = users.map((u) =>
      u.id === id ? { ...u, status: newStatus } : u,
    );

    setUsers(updatedUsers);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedUsers));

    toast.info(
      `Tài khoản đã được ${newStatus === "ACTIVE" ? "mở khóa" : "khóa"}.`,
    );
  };

  const handleDelete = (id) => {
    const userToDeleteData = users.find((u) => u.id === id);
    setUserToDelete(userToDeleteData);
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      const updatedUsers = users.filter((u) => u.id !== userToDelete.id);
      setUsers(updatedUsers);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedUsers));
      toast.success("Đã xóa tài khoản!");
      setShowConfirmModal(false);
      setUserToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setUserToDelete(null);
  };

  return (
    <div className="product-section p-4 bg-white rounded shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3
          style={{
            color: "var(--primary-dark)",
            fontWeight: "bold",
            margin: 0,
          }}
        >
          Quản lý người dùng
        </h3>
        <Button
          variant="primary"
          onClick={openAddModal}
          className="d-flex align-items-center gap-2"
        >
          <FaUserPlus /> Thêm người dùng
        </Button>
      </div>

      <div className="admin-nav-menu">
        <button
          type="button"
          className="admin-nav-btn"
          onClick={() => navigate(PATH.adminDashboard)}
          title="Dashboard"
        >
          <FaChartBar /> Dashboard
        </button>
        <button
          type="button"
          className="admin-nav-btn"
          onClick={() => navigate(PATH.adminProducts)}
          title="Quản lý sản phẩm"
        >
          <FaBox /> Sản phẩm
        </button>
        <button
          type="button"
          className="admin-nav-btn"
          onClick={() => navigate(PATH.adminOrders)}
          title="Quản lý đơn hàng"
        >
          <FaShoppingCart /> Đơn hàng
        </button>
        <button
          type="button"
          className="admin-nav-btn"
          onClick={() => navigate(PATH.adminSupport)}
          title="Support"
        >
          <FaHeadset /> Support
        </button>
      </div>

      <div className="d-flex gap-3 mb-4">
        <div className="input-group" style={{ maxWidth: "400px" }}>
          <span className="input-group-text bg-light border-end-0">
            <FaSearch color="#888" />
          </span>
          <input
            type="text"
            className="form-control border-start-0 ps-0"
            placeholder="Tìm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="form-select"
          style={{ maxWidth: "200px" }}
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="">Tất cả vai trò</option>
          <option value="ADMIN">Quản trị viên (ADMIN)</option>
          <option value="USER">Khách hàng (USER)</option>
        </select>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle border">
            <thead className="table-light">
              <tr>
                <th className="text-center">ID</th>
                <th>Họ và Tên</th>
                <th>Email</th>
                <th className="text-center">Vai trò</th>
                <th className="text-center">Trạng thái</th>
                <th className="text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="text-center text-muted fw-semibold">
                      {user.id}
                    </td>
                    <td className="fw-bold">{user.name}</td>
                    <td>{user.email}</td>
                    <td className="text-center">
                      <span
                        className={`badge ${user.role === "ADMIN" ? "bg-danger" : "bg-primary"}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="text-center">
                      <span
                        className={`badge ${user.status === "ACTIVE" ? "bg-success" : "bg-secondary"}`}
                      >
                        {user.status === "ACTIVE" ? "Hoạt động" : "Đã khóa"}
                      </span>
                    </td>
                    <td className="text-center">
                      <Button
                        variant={
                          user.status === "ACTIVE" ? "warning" : "success"
                        }
                        className="btn-sm me-2 text-white"
                        onClick={() => handleToggleStatus(user.id, user.status)}
                        title={
                          user.status === "ACTIVE"
                            ? "Khóa tài khoản"
                            : "Mở khóa"
                        }
                      >
                        {user.status === "ACTIVE" ? <FaLock /> : <FaLockOpen />}
                      </Button>
                      <Button
                        variant="outline"
                        className="btn-sm me-2"
                        onClick={() => openEditModal(user)}
                        title="Sửa"
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() => handleDelete(user.id)}
                        title="Xóa"
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    Không tìm thấy người dùng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-bottom">
                <h5 className="modal-title text-danger fw-bold">
                  <FaTrash className="me-2" /> Xác nhận xóa
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={cancelDelete}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p className="mb-0">
                  Bạn có chắc chắn muốn xóa tài khoản của <strong>{userToDelete?.name}</strong> vĩnh viễn?
                </p>
                <p className="text-muted small mt-2 mb-0">
                  Email: <code>{userToDelete?.email}</code>
                </p>
              </div>
              <div className="modal-footer border-top">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={cancelDelete}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmDelete}
                >
                  <FaTrash className="me-2" /> Xóa vĩnh viễn
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Sửa thông tin người dùng" : "Thêm người dùng mới"}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Họ và Tên <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Email <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={!!editingId}
            />
            {editingId && (
              <small className="text-muted">
                Không thể thay đổi email sau khi tạo.
              </small>
            )}
          </div>

          {!editingId && (
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Mật khẩu <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Vai trò</label>
              <select
                className="form-select"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
              >
                <option value="USER">Khách hàng (USER)</option>
                <option value="ADMIN">Quản trị viên (ADMIN)</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Trạng thái</label>
              <select
                className="form-select"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="ACTIVE">Hoạt động</option>
                <option value="LOCKED">Khóa</option>
              </select>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Hủy
            </Button>
            <Button type="submit" variant="primary">
              {editingId ? "Cập nhật" : "Lưu người dùng"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
