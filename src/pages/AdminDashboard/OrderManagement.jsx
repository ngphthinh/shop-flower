import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaEye, FaSearch } from "react-icons/fa";

// Import components dùng chung của bạn
import Button from "../../components/Button/Button";
import Modal from "../../components/Modal/Modal";
import LoadingSpinner from "../../components/LoadingSpinner";
import { formatDate } from "../../utils/formatDate"; // Bạn đã gửi file này
import "../AdminDashboard/AdminDashboard.css";
// Giả định bạn sẽ tạo orderService.js tương tự productService.js
// import * as orderService from "../../services/orderService";

export default function OrderManagement() {
  const [orders, setOrders] = useState([
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
      items: [{ name: "Lẵng hoa khai trương", quantity: 1, price: 450000 }],
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");

  // Hàm chuyển đổi nhãn trạng thái để hiển thị
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

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      // Gọi API: await orderService.updateOrderStatus(orderId, newStatus);
      setOrders(
        orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
      toast.success(`Đã cập nhật đơn hàng ${orderId} thành ${newStatus}`);
      if (selectedOrder) setIsModalOpen(false);
    } catch (error) {
      toast.error("Cập nhật trạng thái thất bại!");
    }
  };

  const filteredOrders = orders.filter(
    (o) => filterStatus === "" || o.status === filterStatus,
  );

  return (
    <div className="product-section p-4 bg-white rounded shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 style={{ color: "var(--primary-dark)", fontWeight: "bold" }}>
          Quản lý đơn hàng
        </h3>
        <select
          className="form-select w-auto"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
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
              {filteredOrders.map((order) => {
                const statusInfo = getStatusLabel(order.status);
                return (
                  <tr key={order.id}>
                    <td className="fw-bold text-primary">{order.id}</td>
                    <td>{order.customerName}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td className="fw-bold">
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
                        onClick={() => handleViewDetail(order)}
                      >
                        <FaEye /> Chi tiết
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal xem chi tiết và cập nhật trạng thái */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Chi tiết đơn hàng ${selectedOrder?.id}`}
      >
        {selectedOrder && (
          <div>
            <h6>
              Khách hàng: <strong>{selectedOrder.customerName}</strong>
            </h6>
            <hr />
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th className="text-center">SL</th>
                  <th className="text-end">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.name}</td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-end">
                      {(item.price * item.quantity).toLocaleString()}đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-end mt-2">
              <h5>
                Tổng cộng:{" "}
                <span className="text-danger">
                  {selectedOrder.totalPrice.toLocaleString()}đ
                </span>
              </h5>
            </div>

            <div className="mt-4 p-3 bg-light rounded">
              <h6>Cập nhật trạng thái đơn hàng:</h6>
              <div className="d-flex gap-2 mt-2">
                <Button
                  variant="outline"
                  className="btn-sm"
                  onClick={() =>
                    handleUpdateStatus(selectedOrder.id, "SHIPPING")
                  }
                >
                  Đang giao
                </Button>
                <Button
                  variant="success"
                  className="btn-sm"
                  onClick={() =>
                    handleUpdateStatus(selectedOrder.id, "DELIVERED")
                  }
                >
                  Đã giao
                </Button>
                <Button
                  variant="danger"
                  className="btn-sm"
                  onClick={() =>
                    handleUpdateStatus(selectedOrder.id, "CANCELLED")
                  }
                >
                  Hủy đơn
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
