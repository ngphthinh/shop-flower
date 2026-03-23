import { useEffect, useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import { fetchProducts } from "../../redux/slices/productSlice";
import ProductCard from "../../components/ProductCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import { PATH } from "../../routes/path";
import "./Search.css";

const ITEMS_PER_PAGE = 12;
const Pagination = ReactPaginate.default ?? ReactPaginate;

export default function Search() {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.products);
  const [selectedPage, setSelectedPage] = useState(0);

  const query = searchParams.get("q") || "";

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, items.length]);

  // Filter products by search query
  const filteredItems = useMemo(() => {
    if (!query.trim()) {
      return [];
    }

    const lowerQuery = query.toLowerCase();
    return items.filter(
      (product) =>
        product.name.toLowerCase().includes(lowerQuery) ||
        product.description?.toLowerCase().includes(lowerQuery) ||
        product.category?.name.toLowerCase().includes(lowerQuery),
    );
  }, [items, query]);

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

  return (
    <div className="container py-4 py-md-5">
      {/* Breadcrumb */}
      <div className="breadcrumb-nav mb-4">
        <Link to={PATH.home} className="breadcrumb-link">
          Trang chủ
        </Link>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">Tìm kiếm</span>
      </div>

      {/* Header */}
      <div className="search-header mb-5">
        <div className="search-header__content">
          <h1 className="search-header__title">
            🔍 Kết quả tìm kiếm: "{query}"
          </h1>
          {filteredItems.length > 0 && (
            <p className="search-header__desc">
              Tìm thấy <strong>{filteredItems.length}</strong> kết quả
            </p>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* No Results */}
      {!query.trim() ? (
        <div className="alert alert-info text-center" role="alert">
          <p className="mb-0">Vui lòng nhập từ khóa để tìm kiếm</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">✿</div>
          <h2 className="empty-state__title">Không tìm thấy kết quả</h2>
          <p className="empty-state__desc">
            Không tìm thấy sản phẩm nào phù hợp với từ khóa "{query}"
          </p>
          <div className="empty-state__suggestions">
            <p className="small text-muted mb-3">Gợi ý:</p>
            <ul className="small text-muted">
              <li>✓ Kiểm tra chính tả của từ khóa</li>
              <li>✓ Thử tìm kiếm với từ khóa khác</li>
              <li>✓ Thử xem các danh mục sản phẩm</li>
            </ul>
          </div>
          <Link to={PATH.home} className="btn btn-primary mt-3">
            Quay về trang chủ
          </Link>
        </div>
      ) : (
        <>
          {/* Filter Bar */}
          <div className="filter-bar mb-4">
            <div className="filter-bar__info">
              Hiển thị {paginatedItems.length} trên {filteredItems.length} sản
              phẩm
            </div>
          </div>

          {/* Products Grid */}
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
