import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaSearch, FaTrash } from "react-icons/fa";
import { PATH } from "../../routes/path";
import Modal from "../../components/Modal/Modal";
import LoadingSpinner from "../../components/LoadingSpinner";
import { formatDate } from "../../utils/formatDate";
import "../AdminDashboard/AdminDashboard.css";

const LOCAL_STORAGE_KEY = "shopflower_orders";

export default function OrderManagement() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [showConfirmRemoveModal, setShowConfirmRemoveModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  const loadOrders = () => {
    setIsLoading(true);
    try {
      const storedOrders = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      } else {
        const initialData = [
          {
            id: "ORD001",
            customerName: "Nguyễn Văn A",
            totalPrice: 1250000,
            status: "PENDING",
            createdAt: "2024-03-20T10:30:00Z",
            items: [
              { name: "Bó Hồng Đỏ", quantity: 2, price: 500000 },
              { name: "Hoa Hướng Dương", quantity: 1, price: 250000 },
            ],
          },
          {
            id: "ORD002",
            customerName: "Trần Thị B",
            totalPrice: 450000,
            status: "SHIPPING",
            createdAt: "2024-03-19T15:20:00Z",
            items: [
              { name: "Lẵng hoa khai trương", quantity: 1, price: 450000 },
            ],
          },
        ];
        setOrders(initialData);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialData));
      }
    } catch (error) {
      toast.error("Lỗi khi tải dữ liệu đơn hàng!");
    } finally {
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const getStatusLabel = (status) => {
    switch (status) {
      case "PENDING":
        return { text: "Chờ xác nhận", class: "bg-warning" };
      case "SHIPPING":
        return { text: "Đang giao", class: "bg-info" };
      case "DELIVERED":
        return { text: "Đã giao", class: "bg-success" };
      case "CANCELLED":
        return { text: "Đã hủy", class: "bg-danger" };
      default:
        return { text: status, class: "bg-secondary" };
    }
  };

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const saveOrderChanges = (updatedOrder) => {
    const updatedOrders = orders.map((o) =>
      o.id === updatedOrder.id ? updatedOrder : o,
    );
    setOrders(updatedOrders);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedOrders));
    setSelectedOrder(updatedOrder);
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    try {
      const orderToUpdate = orders.find((o) => o.id === orderId);
      saveOrderChanges({ ...orderToUpdate, status: newStatus });
      const statusText = getStatusLabel(newStatus).text;
      toast.success(`Đã cập nhật đơn hàng thành "${statusText}"`);
    } catch (error) {
      toast.error("Cập nhật trạng thái thất bại!");
    }
  };

  const handleQuantityChange = (orderId, itemIndex, delta) => {
    const orderToUpdate = orders.find((o) => o.id === orderId);
    if (!orderToUpdate) return;

    const updatedItems = [...orderToUpdate.items];
    const newQuantity = updatedItems[itemIndex].quantity + delta;

    if (newQuantity < 1) {
      toast.info(
        "Số lượng tối thiểu là 1. Sử dụng nút Xóa nếu muốn bỏ sản phẩm.",
      );
      return;
    }

    updatedItems[itemIndex].quantity = newQuantity;

    const newTotalPrice = updatedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    saveOrderChanges({
      ...orderToUpdate,
      items: updatedItems,
      totalPrice: newTotalPrice,
    });
  };

  const handleRemoveItem = (orderId, itemIndex) => {
    const orderToUpdate = orders.find((o) => o.id === orderId);
    if (!orderToUpdate) return;

    if (orderToUpdate.items.length === 1) {
      toast.warning(
        "Đơn hàng phải có ít nhất 1 sản phẩm. Hãy chọn 'Hủy đơn' nếu khách không mua nữa!",
      );
      return;
    }

    setItemToRemove({
      orderId,
      itemIndex,
      itemName: orderToUpdate.items[itemIndex].name,
    });
    setShowConfirmRemoveModal(true);
  };

  const confirmRemoveItem = () => {
    if (itemToRemove) {
      const orderToUpdate = orders.find((o) => o.id === itemToRemove.orderId);
      if (orderToUpdate) {
        const updatedItems = orderToUpdate.items.filter(
          (_, idx) => idx !== itemToRemove.itemIndex,
        );
        const newTotalPrice = updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );

        saveOrderChanges({
          ...orderToUpdate,
          items: updatedItems,
          totalPrice: newTotalPrice,
        });
        toast.success("Đã xóa sản phẩm khỏi đơn.");
        setShowConfirmRemoveModal(false);
        setItemToRemove(null);
      }
    }
  };

  const cancelRemoveItem = () => {
    setShowConfirmRemoveModal(false);
    setItemToRemove(null);
  };

  const filteredOrders = orders.filter(
    (o) => filterStatus === "" || o.status === filterStatus,
  );

  return (
    <div className="product-section p-4 bg-white rounded shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3
          style={{
            color: "var(--primary-dark)",
            fontWeight: "bold",
            margin: 0,
          }}>
          Quản lý đơn hàng
        </h3>
      </div>

      <div className="mb-4">
        <select
          className="form-select w-auto"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">Tất cả trạng thái</option>
          <option value="PENDING">Chờ xác nhận</option>
          <option value="SHIPPING">Đang giao</option>
          <option value="DELIVERED">Đã giao</option>
          <option value="CANCELLED">Đã hủy</option>
        </select>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle border">
            <thead className="table-light">
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Ngày đặt</th>
                <th>Tổng tiền</th>
                <th className="text-center">Trạng thái</th>
                <th className="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const statusInfo = getStatusLabel(order.status);
                  return (
                    <tr key={order.id}>
                      <td className="fw-bold text-primary">{order.id}</td>
                      <td>{order.customerName}</td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td className="fw-bold text-danger">
                        {order.totalPrice.toLocaleString()}đ
                      </td>
                      <td className="text-center">
                        <span className={`badge ${statusInfo.class} p-2`}>
                          {statusInfo.text}
                        </span>
                      </td>
                      <td className="text-center">
                        <Button
                          variant="outline"
                          className="btn-sm"
                          onClick={() => handleViewDetail(order)}>
                          <FaEye /> Chi tiết
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    Không có đơn hàng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Chi Tiết */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Chi tiết đơn hàng ${selectedOrder?.id}`}>
        {selectedOrder && (
          <div>
            <h6>
              Khách hàng: <strong>{selectedOrder.customerName}</strong>
            </h6>
            <hr />
            <div className="table-responsive">
              <table className="table table-sm table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Sản phẩm</th>
                    <th className="text-center" style={{ width: "120px" }}>
                      Số lượng
                    </th>
                    <th className="text-end">Thành tiền</th>
                    <th className="text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.name}</td>

                      {/* KHU VỰC THAY ĐỔI SỐ LƯỢNG */}
                      <td className="text-center">
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          <button
                            className="btn btn-sm btn-outline-secondary py-0 px-2 fw-bold"
                            onClick={() =>
                              handleQuantityChange(selectedOrder.id, idx, -1)
                            }>
                            -
                          </button>
                          <span
                            style={{ minWidth: "20px" }}
                            className="fw-bold">
                            {item.quantity}
                          </span>
                          <button
                            className="btn btn-sm btn-outline-secondary py-0 px-2 fw-bold"
                            onClick={() =>
                              handleQuantityChange(selectedOrder.id, idx, 1)
                            }>
                            +
                          </button>
                        </div>
                      </td>

                      <td className="text-end fw-semibold">
                        {(item.price * item.quantity).toLocaleString()}đ
                      </td>

                      {/* NÚT XÓA */}
                      <td className="text-center">
                        <Button
                          variant="danger"
                          className="btn-sm py-1 px-2"
                          title="Xóa sản phẩm"
                          onClick={() =>
                            handleRemoveItem(selectedOrder.id, idx)
                          }>
                          <FaTrash size={12} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-end mt-3">
              <h4 className="fw-bold">
                Tổng cộng:{" "}
                <span className="text-danger">
                  {selectedOrder.totalPrice.toLocaleString()}đ
                </span>
              </h4>
            </div>

            <div className="mt-4 p-3 bg-light rounded border">
              <h6 className="mb-3 fw-bold">Cập nhật trạng thái đơn hàng:</h6>
              <div className="d-flex flex-wrap gap-2">
                <Button
                  variant="warning"
                  className="btn-sm text-dark"
                  onClick={() =>
                    handleUpdateStatus(selectedOrder.id, "PENDING")
                  }>
                  Chờ xác nhận
                </Button>
                <Button
                  variant="info"
                  className="btn-sm text-white"
                  onClick={() =>
                    handleUpdateStatus(selectedOrder.id, "SHIPPING")
                  }>
                  Đang giao
                </Button>
                <Button
                  variant="success"
                  className="btn-sm"
                  onClick={() =>
                    handleUpdateStatus(selectedOrder.id, "DELIVERED")
                  }>
                  Đã giao
                </Button>
                <Button
                  variant="danger"
                  className="btn-sm"
                  onClick={() =>
                    handleUpdateStatus(selectedOrder.id, "CANCELLED")
                  }>
                  Hủy đơn
                </Button>
              </div>
            </div>

            <div className="d-flex justify-content-end mt-4 pt-3 border-top">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Đóng cửa sổ
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirmation Modal for Removing Item */}
      {showConfirmRemoveModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-bottom">
                <h5 className="modal-title text-warning fw-bold">
                  <FaTrash className="me-2" /> Xác nhận xóa sản phẩm
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={cancelRemoveItem}
                  aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <p className="mb-0">
                  Bạn có chắc muốn xóa <strong>{itemToRemove?.itemName}</strong>{" "}
                  khỏi đơn hàng?
                </p>
              </div>
              <div className="modal-footer border-top">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={cancelRemoveItem}>
                  Hủy
                </button>
                <button
                  type="button"
                  className="btn btn-warning text-dark"
                  onClick={confirmRemoveItem}>
                  <FaTrash className="me-2" /> Xóa sản phẩm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
