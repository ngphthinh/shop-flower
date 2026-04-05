import { useState } from "react";

const ProductManagement = () => {
  // 1. Dữ liệu giả lập ban đầu (Sau này bạn sẽ thay bằng gọi API fetch từ backend)
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Bó Hoa Hồng Tình Yêu",
      price: 500000,
      category: "Hoa bó",
      stock: 15,
    },
    {
      id: 2,
      name: "Lẵng Hoa Hướng Dương",
      price: 650000,
      category: "Hoa lẵng",
      stock: 8,
    },
    {
      id: 3,
      name: "Hoa Tulip Hà Lan",
      price: 120000,
      category: "Hoa lẻ",
      stock: 50,
    },
  ]);

  // Các state quản lý Form và Modal
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
  });

  // 2. Xử lý nhập liệu form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 3. Mở form Thêm mới
  const handleAddClick = () => {
    setFormData({ name: "", price: "", category: "", stock: "" });
    setEditingId(null);
    setShowForm(true);
  };

  // 4. Mở form Chỉnh sửa
  const handleEditClick = (product) => {
    setFormData(product);
    setEditingId(product.id);
    setShowForm(true);
  };

  // 5. Xử lý Xóa
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  // 6. Xử lý Lưu (Create & Update)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      // Cập nhật (Update)
      setProducts(
        products.map((p) =>
          p.id === editingId ? { ...formData, id: editingId } : p,
        ),
      );
    } else {
      // Thêm mới (Create)
      const newProduct = { ...formData, id: Date.now() }; // Tạo ID ngẫu nhiên
      setProducts([...products, newProduct]);
    }
    setShowForm(false);
  };

  return (
    <div className="container py-4">
      {/* Bao bọc bằng class product-section từ index.css của bạn */}
      <div className="product-section">
        <div className="d-flex justify-content-between align-items-center mb-4 section-heading">
          <h2 style={{ color: "var(--primary)", margin: 0 }}>
            Quản lý sản phẩm
          </h2>
          <button className="btn btn-success" onClick={handleAddClick}>
            + Thêm sản phẩm
          </button>
        </div>

        {/* Bảng hiển thị danh sách sản phẩm */}
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên sản phẩm</th>
                <th>Danh mục</th>
                <th>Giá (VNĐ)</th>
                <th>Tồn kho</th>
                <th className="text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td className="fw-bold" style={{ color: "var(--text)" }}>
                      {product.name}
                    </td>
                    <td>{product.category}</td>
                    <td>{Number(product.price).toLocaleString()}đ</td>
                    <td>{product.stock}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-outline-secondary btn-sm me-2"
                        onClick={() => handleEditClick(product)}
                      >
                        Sửa
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(product.id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    Chưa có sản phẩm nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal/Form Popup đơn giản */}
      {showForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1050,
          }}
        >
          {/* Sử dụng class product-detail-panel cho box shadow và border radius */}
          <div
            className="product-detail-panel"
            style={{ width: "100%", maxWidth: "500px" }}
          >
            <h4 className="mb-4" style={{ color: "var(--primary-dark)" }}>
              {editingId ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
            </h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Tên sản phẩm</label>
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
                <label className="form-label">Danh mục</label>
                <select
                  className="form-select form-control"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Chọn danh mục --</option>
                  <option value="Hoa bó">Hoa bó</option>
                  <option value="Hoa lẵng">Hoa lẵng</option>
                  <option value="Hoa lẻ">Hoa lẻ</option>
                  <option value="Hoa sự kiện">Hoa sự kiện</option>
                </select>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Giá (VNĐ)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Tồn kho</label>
                  <input
                    type="number"
                    className="form-control"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="btn btn-success">
                  {editingId ? "Cập nhật" : "Lưu sản phẩm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
