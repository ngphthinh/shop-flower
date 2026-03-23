import { useEffect, useMemo, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FaTruckFast,
  FaRegCircleCheck,
  FaLeaf,
  FaGift,
  FaSeedling,
  FaHeart,
  FaHandsHoldingCircle,
  FaBox,
} from "react-icons/fa6";
import ProductCard from "../../components/ProductCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import { fetchProducts } from "../../redux/slices/productSlice";
import {
  setCategoryFilter,
  clearCategoryFilter,
} from "../../redux/slices/filterSlice";
import { PATH } from "../../routes/path";

const ITEMS_PER_PAGE = 12;
const Pagination = ReactPaginate.default ?? ReactPaginate;

const commitments = [
  { icon: <FaGift />, title: "Cam kết", desc: "Giá cả hợp lý" },
  { icon: <FaTruckFast />, title: "Giao nhanh", desc: "Nội thành" },
  { icon: <FaRegCircleCheck />, title: "Đảm bảo", desc: "Sạch, tươi, mới" },
  { icon: <FaLeaf />, title: "Thân thiện", desc: "Môi trường sống" },
];

export default function Home() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.products);
  const { selectedCategoryId, selectedCategoryName } = useSelector(
    (state) => state.filter,
  );
  const [selectedPage, setSelectedPage] = useState(0);

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, items.length]);

  // Extract unique categories from products
  const categories = useMemo(() => {
    const uniqueCategories = {};
    items.forEach((product) => {
      if (product.category && !uniqueCategories[product.category.id]) {
        uniqueCategories[product.category.id] = {
          id: product.category.id,
          name: product.category.name,
        };
      }
    });
    return Object.values(uniqueCategories);
  }, [items]);

  // Filter products based on selected category
  const filteredItems = useMemo(() => {
    if (!selectedCategoryId) {
      return items;
    }
    return items.filter(
      (product) => product.category?.id === selectedCategoryId,
    );
  }, [items, selectedCategoryId]);

  const pageCount = useMemo(
    () => Math.ceil(filteredItems.length / ITEMS_PER_PAGE),
    [filteredItems.length],
  );

  const paginatedItems = useMemo(() => {
    const start = selectedPage * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredItems.slice(start, end);
  }, [filteredItems, selectedPage]);

  const handleCategoryClick = (categoryId, categoryName) => {
    if (selectedCategoryId === categoryId) {
      // Toggle: if already selected, deselect it
      dispatch(clearCategoryFilter());
      setSelectedPage(0);
    } else {
      // Select new category
      dispatch(setCategoryFilter({ id: categoryId, name: categoryName }));
      setSelectedPage(0);
    }
  };

  const handlePageChange = ({ selected }) => {
    setSelectedPage(selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container py-4">
      <section className="home-hero mb-5">
        <div className="row g-3">
          <div className="col-12 col-xl-3">
            <aside className="category-box h-100">
              <div className="category-box__title">Danh mục</div>
              <ul className="list-unstyled mb-0">
                <li>
                  <button
                    type="button"
                    className={`category-item ${!selectedCategoryId ? "active" : ""}`}
                    onClick={() => {
                      dispatch(clearCategoryFilter());
                      setSelectedPage(0);
                    }}>
                    <FaBox className="category-icon" />
                    Tất cả sản phẩm
                  </button>
                </li>
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      type="button"
                      className={`category-item ${selectedCategoryId === category.id ? "active" : ""}`}
                      onClick={() =>
                        handleCategoryClick(category.id, category.name)
                      }>
                      <FaLeaf className="category-icon" />
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>
          </div>

          <div className="col-12 col-xl-9">
            <div className="hero-panel">
              <div className="hero-panel__banner">
                <div>
                  <p className="hero-kicker">Bộ sưu tập mới 2026</p>
                  <h2>Hoa tặng tinh tế, giao nhanh trong ngày</h2>
                  <p>
                    Chọn bó hoa phù hợp cho sinh nhật, kỷ niệm, khai trương và
                    mọi dịp đặc biệt.
                  </p>
                </div>
              </div>

              <div className="row g-3 mt-1">
                {commitments.map((item) => (
                  <div key={item.title} className="col-6 col-lg-3">
                    <div className="commit-card">
                      <div className="commit-card__icon">{item.icon}</div>
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="product-section">
        <div className="section-heading mb-4">
          {selectedCategoryName ? (
            <div>
              <button
                type="button"
                onClick={() => {
                  dispatch(clearCategoryFilter());
                  setSelectedPage(0);
                }}
                className="clear-filter-link"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}>
                ← Tất cả sản phẩm
              </button>
              <h1 className="mb-1">
                <FaLeaf className="me-2" style={{ color: "#f07dae" }} />{" "}
                {selectedCategoryName}
              </h1>
              <p>Tìm thấy {filteredItems.length} sản phẩm</p>
            </div>
          ) : (
            <>
              <h1 className="mb-1">Hoa tặng & hoa dịch vụ</h1>
              <p>Mẫu hoa được yêu thích nhất tại cửa hàng</p>
            </>
          )}
        </div>

        {loading && <LoadingSpinner />}

        {!loading && error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && filteredItems.length === 0 && (
          <div className="alert alert-info text-center" role="alert">
            <p className="mb-0">Không có sản phẩm nào trong danh mục này</p>
            <Link to={PATH.home} className="btn btn-sm btn-primary mt-2">
              Xem tất cả sản phẩm
            </Link>
          </div>
        )}

        {!loading && !error && filteredItems.length > 0 && (
          <>
            <div className="row">
              {paginatedItems.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {pageCount > 1 && (
              <div className="d-flex justify-content-center mt-3">
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
      </section>
    </div>
  );
}
