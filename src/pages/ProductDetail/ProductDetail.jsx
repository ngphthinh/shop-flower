import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addToCart } from "../../redux/slices/cartSlice";
import { fetchProducts } from "../../redux/slices/productSlice";
import { PATH } from "../../routes/path";

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: products, loading } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const product = useMemo(
    () => products.find((item) => item.id === Number(id)),
    [products, id],
  );

  const imageSrc = product?.thumbnail || product?.images?.[0] || product?.image;

  const handleAdd = () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
      navigate(PATH.login);
      return;
    }

    if (!product) {
      return;
    }
    dispatch(addToCart(product));
    toast.success("Đã thêm sản phẩm vào giỏ hàng.");
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div
          className="spinner-border text-success"
          role="status"
          aria-hidden="true"
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <h2 className="mb-3">Không tìm thấy sản phẩm</h2>
        <Link to={PATH.home} className="btn btn-success">
          Quay về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4 py-md-5 product-detail-page">
      <div className="row g-4 align-items-start product-detail-panel">
        <div className="col-12 col-lg-6">
          <img
            src={imageSrc}
            alt={product.name}
            className="img-fluid rounded shadow-sm w-100 product-detail-image"
            style={{ maxHeight: "460px", objectFit: "cover" }}
          />
        </div>

        <div className="col-12 col-lg-6 product-detail-content">
          <h1 className="h3 mb-3">{product.name}</h1>
          <p className="h4 text-danger mb-2">
            {formatCurrency(product.discountPrice || product.price)}
          </p>
          {product.discountPrice && product.discountPrice < product.price && (
            <p className="text-muted text-decoration-line-through mb-3">
              {formatCurrency(product.price)}
            </p>
          )}
          <p className="mb-2 text-secondary">
            Danh mục: {product.category?.name}
          </p>
          <p className="mb-2 text-secondary">
            Đánh giá: {product.rating}/5 ({product.reviewCount} đánh giá)
          </p>
          <p className="mb-3 text-secondary">
            Còn lại: {product.stock} | Đã bán: {product.sold}
          </p>
          <p className="text-secondary mb-4">{product.description}</p>

          <ul className="list-group list-group-flush mb-4 border rounded">
            <li className="list-group-item">
              Màu sắc: {product.details?.color}
            </li>
            <li className="list-group-item">
              Kích thước: {product.details?.size}
            </li>
            <li className="list-group-item">
              Chất liệu: {product.details?.material}
            </li>
            <li className="list-group-item">
              Xuất xứ: {product.details?.origin}
            </li>
          </ul>

          <button onClick={handleAdd} className="btn btn-success btn-lg">
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
}
