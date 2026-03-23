import { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaLeaf } from "react-icons/fa6";
import ReactPaginate from "react-paginate";
import { fetchProducts } from "../../redux/slices/productSlice";
import { clearCategoryFilter } from "../../redux/slices/filterSlice";
import ProductCard from "../../components/ProductCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import { PATH } from "../../routes/path";
import "./Category.css";

const ITEMS_PER_PAGE = 12;
const Pagination = ReactPaginate.default ?? ReactPaginate;

export default function Category() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.products);
  const [selectedPage, setSelectedPage] = useState(0);

  const handleBackToAllProducts = () => {
    dispatch(clearCategoryFilter());
    navigate(PATH.home);
  };

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, items.length]);

  // Get category info
  const category = useMemo(() => {
    const categoryId = Number(id);
    const products = items.filter((p) => p.category?.id === categoryId);
    if (products.length === 0) return null;

    return {
      id: categoryId,
      name: products[0].category.name,
    };
  }, [items, id]);

  // Filter products by category
  const filteredItems = useMemo(() => {
    const categoryId = Number(id);
    return items.filter((product) => product.category?.id === categoryId);
  }, [items, id]);

  const pageCount = useMemo(
    () => Math.ceil(filteredItems.length / ITEMS_PER_PAGE),
    [filteredItems.length],
  );

  const paginatedItems = useMemo(() => {
    const start = selectedPage * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredItems.slice(start, end);
  }, [filteredItems, selectedPage]);

  const handlePageChange = ({ selected }) => {
    setSelectedPage(selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!category) {
    return (
      <div className="container py-5 text-center">
        <h2 className="mb-3">Không tìm thấy danh mục</h2>
        <p className="text-muted mb-4">Danh mục bạn tìm kiếm không tồn tại</p>
        <Link to={PATH.home} className="btn btn-primary">
          Quay về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4 py-md-5">
      {/* Breadcrumb */}
      <div className="breadcrumb-nav mb-4">
        <Link to={PATH.home} className="breadcrumb-link">
          Trang chủ
        </Link>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">{category.name}</span>
      </div>

      {/* Header */}
      <div className="category-header mb-5">
        <div className="category-header__content">
          <button
            type="button"
            onClick={handleBackToAllProducts}
            className="clear-filter-link mb-3 d-inline-block"
            style={{ background: "none", border: "none", cursor: "pointer" }}>
            ← Tất cả sản phẩm
          </button>
          <h1 className="category-header__title">
            <FaLeaf className="me-2" style={{ color: "#f07dae" }} />
            {category.name}
          </h1>
          <p className="category-header__desc">
            Tìm thấy <strong>{filteredItems.length}</strong> sản phẩm
          </p>
        </div>
      </div>

      {/* Filter/Sort Bar */}
      <div className="filter-bar mb-4">
        <div className="filter-bar__info">
          Hiển thị {paginatedItems.length} trên {filteredItems.length} sản phẩm
        </div>
      </div>

      {/* Products Grid */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {filteredItems.length === 0 ? (
        <div className="alert alert-info text-center" role="alert">
          <p className="mb-0">Không có sản phẩm nào trong danh mục này</p>
        </div>
      ) : (
        <>
          <div className="row mb-4">
            {paginatedItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {pageCount > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination
                breakLabel="..."
                nextLabel=">"
                previousLabel="<"
                onPageChange={handlePageChange}
                pageRangeDisplayed={3}
                marginPagesDisplayed={1}
                pageCount={pageCount}
                containerClassName="pagination"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakClassName="page-item"
                breakLinkClassName="page-link"
                activeClassName="active"
                forcePage={selectedPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
