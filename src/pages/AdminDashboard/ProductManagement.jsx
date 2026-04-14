import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaSearch, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { PATH } from "../../routes/path";
import Modal from "../../components/Modal/Modal.jsx";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import Button from "../../components/Button/Button";

import "./ProductManagement.css";
import hoaNaiveImg from "../../assets/naivie.jpg";
import hoaBoHoaCucImg from "../../assets/bo-hoa-cuc-tana-little-tana.jpg";
import no_image from "../../assets/no_image.png";

const LOCAL_STORAGE_KEY = "shopflower_products";

export default function ProductManagement() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    imageUrl: "",
  });

  const loadProducts = () => {
    setIsLoading(true);
    try {
      const storedProducts = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      } else {
        const initialData = [
          {
            id: 1712800000000,
            name: "Naive",
            price: 460000,
            category: "Hoa bó",
            stock: 15,
            imageUrl: hoaNaiveImg,
          },
          {
            id: 1712800000001,
            name: "Little Tana",
            price: 350000,
            category: "Hoa lẵng",
            stock: 8,
            imageUrl: hoaBoHoaCucImg,
          },
        ];
        setProducts(initialData);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialData));
      }
    } catch (error) {
      toast.error("Lỗi khi tải dữ liệu từ hệ thống!");
    } finally {
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchCategory =
      filterCategory === "" || product.category === filterCategory;
    return matchSearch && matchCategory;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.warning("Vui lòng chọn ảnh có kích thước dưới 2MB!");
        e.target.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      let updatedProducts;
      if (editingId) {
        updatedProducts = products.map((p) =>
          p.id === editingId ? { ...formData, id: editingId } : p,
        );
        toast.success("Cập nhật sản phẩm thành công!");
      } else {
        const newProduct = { ...formData, id: Date.now() };
        updatedProducts = [...products, newProduct];
        toast.success("Thêm sản phẩm thành công!");
      }
      setProducts(updatedProducts);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedProducts));
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lưu dữ liệu. Vui lòng thử lại!");
    }
  };

  const handleDelete = (id) => {
    const product = products.find((p) => p.id === id);
    setProductToDelete(product);
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      try {
        const updatedProducts = products.filter(
          (p) => p.id !== productToDelete.id,
        );
        setProducts(updatedProducts);
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify(updatedProducts),
        );
        toast.success("Đã xóa sản phẩm!");
        setShowConfirmModal(false);
        setProductToDelete(null);
      } catch (error) {
        toast.error("Không thể xóa sản phẩm lúc này!");
      }
    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setProductToDelete(null);
  };

  return (
    <div className="product-management-container p-4 bg-white rounded shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="page-title">Quản lý sản phẩm</h3>
        <Button
          variant="primary"
          onClick={openAddModal}
          className="d-flex align-items-center gap-2">
          <FaPlus /> Thêm sản phẩm
        </Button>
      </div>

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
          onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="">Tất cả danh mục</option>
          <option value="Hoa bó">Hoa bó</option>
          <option value="Hoa lẵng">Hoa lẵng</option>
          <option value="Hoa giỏ">Hoa giỏ</option>
          <option value="Lan hồ điệp">Lan hồ điệp</option>
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
                      #{String(product.id).slice(-5)}
                    </td>
                    <td className="text-center">
                      <img
                        src={product.imageUrl || no_image}
                        alt={product.name}
                        className="product-table-img"
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
                        className={`badge ${
                          product.stock > 10 ? "bg-success" : "bg-warning"
                        }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="text-center">
                      <Button
                        variant="outline"
                        className="btn-sm me-2"
                        onClick={() => openEditModal(product)}
                        title="Sửa">
                        <FaEdit />
                      </Button>
                      <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() => handleDelete(product.id)}
                        title="Xóa">
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

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
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
                  aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <p className="mb-2">
                  Bạn có chắc chắn muốn xóa sản phẩm{" "}
                  <strong>{productToDelete?.name}</strong>?
                </p>
                <p className="text-muted small mb-0">
                  Hành động này không thể hoàn tác.
                </p>
              </div>
              <div className="modal-footer border-top">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={cancelDelete}>
                  Hủy
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmDelete}>
                  <FaTrash className="me-2" /> Xóa sản phẩm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}>
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
            <label className="form-label fw-semibold">Hình ảnh sản phẩm</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleImageUpload}
              key={isModalOpen ? "open" : "closed"}
            />
            {formData.imageUrl && (
              <div className="mt-3 text-center">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="product-image-preview"
                />
              </div>
            )}
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
              required>
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
              onClick={() => setIsModalOpen(false)}>
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
