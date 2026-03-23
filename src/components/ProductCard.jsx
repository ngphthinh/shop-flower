import { Link } from "react-router-dom";
import { FaPlus, FaStar } from "react-icons/fa6";

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}

export default function ProductCard({ product }) {
  const imageSrc = product.thumbnail || product.images?.[0] || product.image;
  const displayPrice = product.discountPrice || product.price;

  return (
    <div className="col-12 col-md-6 col-xl-3 mb-4">
      <div className="card flower-card h-100">
        <div className="flower-card__media">
          {product.category?.name && (
            <span className="flower-card__badge">{product.category.name}</span>
          )}
          {product.rating && (
            <span className="flower-card__rating">
              <FaStar /> {product.rating}
            </span>
          )}
          <img
            src={imageSrc}
            className="card-img-top flower-card__image"
            alt={product.name}
          />
        </div>
        <div className="card-body d-flex flex-column">
          <h5 className="card-title flower-card__title" title={product.name}>
            {product.name}
          </h5>
          <p className="card-text flower-card__price mb-3">
            {formatCurrency(displayPrice)}
          </p>
          {product.discountPrice && product.discountPrice < product.price && (
            <p className="text-muted text-decoration-line-through small mb-2">
              {formatCurrency(product.price)}
            </p>
          )}
          <p className="card-text text-muted small mb-4">
            {product.description}
          </p>

          <p className="flower-card__sold mb-3">Đã bán: {product.sold || 0}</p>

          <Link
            to={`/product/${product.id}`}
            className="btn flower-card__btn mt-auto d-inline-flex align-items-center justify-content-between">
            Giỏ hàng
            <span className="flower-card__btn-icon">
              <FaPlus />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
