import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaSearch, FaPlus, FaEdit, FaTrash } from "react-icons/fa";

// Import components của bạn
import Button from "../../components/Button/Button.jsx";
import Modal from "../../components/Modal/Modal.jsx";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";

// Giả định bạn có productService và productSlice
import * as productService from "../../services/productService.js";
// import { fetchProducts } from "../../redux/productSlice"; // Mở cmt nếu bạn dùng thunk

export default function ProductManagement() {
  const dispatch = useDispatch();

  // Lấy state từ Redux (Nếu bạn lưu danh sách ở Redux)
  // const { products, loading } = useSelector((state) => state.product);

  // Tạm thời dùng local state để quản lý danh sách lấy từ API cho dễ hình dung
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter & Search states (Giống trong ảnh thiết kế của bạn)
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    imageUrl: "", // Thêm trường hình ảnh như trong bảng
  });

  // --- 1. LẤY DỮ LIỆU (READ) ---
  const loadProducts = async () => {
    try {
      setIsLoading(true);
      // Nếu dùng Redux Thunk: dispatch(fetchProducts())
      const response = await productService.getAllProducts();
      setProducts(response.data || response); // Tùy cấu trúc trả về của API
    } catch (error) {
      toast.error("Không thể tải danh sách sản phẩm!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // --- XỬ LÝ LỌC & TÌM KIẾM ---
  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchCategory =
      filterCategory === "" || product.category === filterCategory;
    return matchSearch && matchCategory;
  });

  // --- 2. XỬ LÝ FORM ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openAddModal = () => {
    setFormData({ name: "", category: "", price: "", stock: "", imageUrl: "" });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setFormData(product);
    setEditingId(product.id);
    setIsModalOpen(true);
  };

  // --- 3. THÊM & SỬA (CREATE & UPDATE) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Cập nhật
        await productService.updateProduct(editingId, formData);
        toast.success("Cập nhật sản phẩm thành công!");
      } else {
        // Thêm mới
        await productService.createProduct(formData);
        toast.success("Thêm sản phẩm thành công!");
      }
      setIsModalOpen(false);
      loadProducts(); // Refresh lại bảng
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!",
      );
    }
  };

  // --- 4. XÓA (DELETE) ---
  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.",
      )
    ) {
      try {
        await productService.deleteProduct(id);
        toast.success("Đã xóa sản phẩm!");
        loadProducts(); // Refresh lại bảng
      } catch (error) {
        toast.error("Không thể xóa sản phẩm lúc này!");
      }
    }
  };

  return (
    <div className="product-management-container p-4 bg-white rounded shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3
          style={{
            color: "var(--primary-dark)",
            margin: 0,
            fontWeight: "bold",
          }}
        >
          Quản lý sản phẩm
        </h3>
        <Button
          variant="primary"
          onClick={openAddModal}
          className="d-flex align-items-center gap-2"
        >
          <FaPlus /> Thêm sản phẩm
        </Button>
      </div>

      {/* Bộ lọc và Tìm kiếm (Theo đúng ảnh mẫu) */}
      <div className="d-flex gap-3 mb-4">
        <div className="input-group" style={{ maxWidth: "400px" }}>
          <span className="input-group-text bg-light border-end-0">
            <FaSearch color="#888" />
          </span>
          <input
            type="text"
            className="form-control border-start-0 ps-0"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="form-select"
          style={{ maxWidth: "200px" }}
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">Tất cả danh mục</option>
          <option value="Hoa bó">Hoa bó</option>
          <option value="Hoa lẵng">Hoa lẵng</option>
          <option value="Hoa giỏ">Hoa giỏ</option>
          <option value="Lan hồ điệp">Lan hồ điệp</option>
        </select>
      </div>

      {/* Bảng Dữ Liệu */}
      {isLoading ? (
        <div className="d-flex justify-content-center py-5">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle border">
            <thead className="table-light">
              <tr>
                <th className="text-center">ID</th>
                <th className="text-center">Hình ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Danh mục</th>
                <th>Giá</th>
                <th className="text-center">Tồn kho</th>
                <th className="text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="text-center text-muted fw-semibold">
                      #{product.id}
                    </td>
                    <td className="text-center">
                      <img
                        src={
                          product.imageUrl || "https://via.placeholder.com/50"
                        }
                        alt={product.name}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    </td>
                    <td className="fw-bold" style={{ color: "var(--text)" }}>
                      {product.name}
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {product.category}
                      </span>
                    </td>
                    <td className="text-danger fw-bold">
                      {Number(product.price).toLocaleString()}đ
                    </td>
                    <td className="text-center">
                      <span
                        className={`badge ${product.stock > 10 ? "bg-success" : "bg-warning"}`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="text-center">
                      <Button
                        variant="outline"
                        className="btn-sm me-2"
                        onClick={() => openEditModal(product)}
                        title="Sửa"
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() => handleDelete(product.id)}
                        title="Xóa"
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    Không tìm thấy sản phẩm nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Thêm/Sửa */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Tên sản phẩm <span className="text-danger">*</span>
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
              Link Hình ảnh (URL)
            </label>
            <input
              type="text"
              className="form-control"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              placeholder="https://..."
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Danh mục <span className="text-danger">*</span>
            </label>
            <select
              className="form-select"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">-- Chọn danh mục --</option>
              <option value="Hoa bó">Hoa bó</option>
              <option value="Hoa lẵng">Hoa lẵng</option>
              <option value="Hoa giỏ">Hoa giỏ</option>
              <option value="Lan hồ điệp">Lan hồ điệp</option>
            </select>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">
                Giá (VNĐ) <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className="form-control"
                name="price"
                min="0"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">
                Tồn kho <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className="form-control"
                name="stock"
                min="0"
                value={formData.stock}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Hủy bỏ
            </Button>
            <Button type="submit" variant="primary">
              {editingId ? "Cập nhật sản phẩm" : "Lưu sản phẩm"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
