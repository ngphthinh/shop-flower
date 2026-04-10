import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useParams, useSearchParams } from "react-router-dom";
import { PATH } from "../../routes/path";
import { adminDashboardService } from "../../services/adminDashboardService";
import "./StatisticsDetail.css";

const TITLES = {
  revenue: "Thống kê doanh thu",
  orders: "Thống kê đơn hàng",
  products: "Thống kê sản phẩm",
  customers: "Thống kê khách hàng",
};

const TAB_LINKS = [
  { key: "revenue", label: "Doanh thu", to: PATH.statisticsRevenue },
  { key: "orders", label: "Đơn hàng", to: PATH.statisticsOrders },
  { key: "products", label: "Sản phẩm", to: PATH.statisticsProducts },
  { key: "customers", label: "Khách hàng", to: PATH.statisticsCustomers },
];

const STATUS_LABEL_TO_KEY = {
  "Đang xử lý": "pending",
  "Đang giao": "shipping",
  "Hoàn tất": "done",
};

const STATUS_KEY_TO_LABEL = {
  pending: "Đang xử lý",
  shipping: "Đang giao",
  done: "Hoàn tất",
};

const formatCurrencyVND = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value ?? 0);

const today = new Date().toISOString().split("T")[0];
const sevenDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
  .toISOString()
  .split("T")[0];

export default function StatisticsDetail() {
  const { type = "revenue" } = useParams();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [revenueFilter, setRevenueFilter] = useState({
    startDate: sevenDaysAgo,
    endDate: today,
    type: "day",
  });
  const [ordersFilter, setOrdersFilter] = useState({
    page: 1,
    pageSize: 10,
    status: "",
    customerKeyword: "",
  });
  const [productsFilter, setProductsFilter] = useState({
    startDate: sevenDaysAgo,
    endDate: today,
    limit: 10,
  });
  const [customersFilter, setCustomersFilter] = useState({
    startDate: sevenDaysAgo,
    endDate: today,
    limit: 10,
  });

  const [revenueData, setRevenueData] = useState(null);
  const [ordersData, setOrdersData] = useState(null);
  const [productsData, setProductsData] = useState(null);
  const [customersData, setCustomersData] = useState(null);

  const title = TITLES[type] || "Thống kê chi tiết";
  const status = searchParams.get("status");

  const normalizedStatus = useMemo(() => {
    if (status === "pending") return STATUS_KEY_TO_LABEL.pending;
    if (status === "shipping") return STATUS_KEY_TO_LABEL.shipping;
    if (status === "done") return STATUS_KEY_TO_LABEL.done;
    return null;
  }, [status]);

  useEffect(() => {
    if (type === "orders" && normalizedStatus) {
      setOrdersFilter((prev) => ({ ...prev, status: normalizedStatus, page: 1 }));
    }
  }, [type, normalizedStatus]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        if (type === "revenue") {
          const res = await adminDashboardService.getRevenueStats(revenueFilter);
          if (isMounted) setRevenueData(res);
        } else if (type === "orders") {
          const res = await adminDashboardService.getOrdersStats(ordersFilter);
          if (isMounted) setOrdersData(res);
        } else if (type === "products") {
          const res = await adminDashboardService.getTopProductsStats(productsFilter);
          if (isMounted) setProductsData(res);
        } else if (type === "customers") {
          const res = await adminDashboardService.getCustomerStats(customersFilter);
          if (isMounted) setCustomersData(res);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || "Không thể tải dữ liệu thống kê.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [type, revenueFilter, ordersFilter, productsFilter, customersFilter]);

  const renderRevenue = () => (
    <div className="stats-panel">
      <div className="stats-filter-grid">
        <label>
          Từ ngày
          <input
            type="date"
            value={revenueFilter.startDate}
            onChange={(e) =>
              setRevenueFilter((prev) => ({ ...prev, startDate: e.target.value }))
            }
          />
        </label>
        <label>
          Đến ngày
          <input
            type="date"
            value={revenueFilter.endDate}
            onChange={(e) =>
              setRevenueFilter((prev) => ({ ...prev, endDate: e.target.value }))
            }
          />
        </label>
        <label>
          Loại thống kê
          <select
            value={revenueFilter.type}
            onChange={(e) =>
              setRevenueFilter((prev) => ({ ...prev, type: e.target.value }))
            }>
            <option value="day">Theo ngày</option>
            <option value="week">Theo tuần</option>
            <option value="month">Theo tháng</option>
          </select>
        </label>
      </div>

      <div className="stats-summary-grid">
        <div className="stats-summary-card">
          <span>Tổng doanh thu</span>
          <strong>{formatCurrencyVND(revenueData?.summary?.totalRevenue)}</strong>
        </div>
        <div className="stats-summary-card">
          <span>Kỳ trước</span>
          <strong>{formatCurrencyVND(revenueData?.summary?.previousPeriodRevenue)}</strong>
        </div>
        <div className="stats-summary-card">
          <span>Tăng trưởng</span>
          <strong>{revenueData?.summary?.growthPct ?? 0}%</strong>
        </div>
      </div>

      <table className="stats-table">
        <thead>
          <tr>
            <th>Mốc thời gian</th>
            <th>Doanh thu</th>
            <th>Số đơn</th>
          </tr>
        </thead>
        <tbody>
          {(revenueData?.series || []).map((row) => (
            <tr key={row.label}>
              <td>{row.label}</td>
              <td>{formatCurrencyVND(row.revenue)}</td>
              <td>{row.orders}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderOrders = () => (
    <div className="stats-panel">
      <div className="stats-filter-grid">
        <label>
          Trạng thái
          <select
            value={ordersFilter.status}
            onChange={(e) =>
              setOrdersFilter((prev) => ({ ...prev, status: e.target.value, page: 1 }))
            }>
            <option value="">Tất cả</option>
            <option value="Đang xử lý">Đang xử lý</option>
            <option value="Đang giao">Đang giao</option>
            <option value="Hoàn tất">Hoàn tất</option>
          </select>
        </label>
        <label>
          Tìm khách hàng
          <input
            type="text"
            placeholder="Tên khách hàng..."
            value={ordersFilter.customerKeyword}
            onChange={(e) =>
              setOrdersFilter((prev) => ({
                ...prev,
                customerKeyword: e.target.value,
                page: 1,
              }))
            }
          />
        </label>
        <label>
          Mỗi trang
          <select
            value={ordersFilter.pageSize}
            onChange={(e) =>
              setOrdersFilter((prev) => ({
                ...prev,
                pageSize: Number(e.target.value),
                page: 1,
              }))
            }>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </label>
      </div>

      <table className="stats-table">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Khách hàng</th>
            <th>Thời gian</th>
            <th>Tổng</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {(ordersData?.items || []).map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer}</td>
              <td>{order.time || order.createdAt}</td>
              <td>{formatCurrencyVND(order.total)}</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="stats-pagination">
        <button
          type="button"
          disabled={!ordersData?.pagination?.hasPrevPage}
          onClick={() =>
            setOrdersFilter((prev) => ({ ...prev, page: Math.max(prev.page - 1, 1) }))
          }>
          Trước
        </button>
        <span>
          Trang {ordersData?.pagination?.page || 1} /{" "}
          {ordersData?.pagination?.totalPages || 1}
        </span>
        <button
          type="button"
          disabled={!ordersData?.pagination?.hasNextPage}
          onClick={() =>
            setOrdersFilter((prev) => ({ ...prev, page: prev.page + 1 }))
          }>
          Sau
        </button>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="stats-panel">
      <div className="stats-filter-grid">
        <label>
          Từ ngày
          <input
            type="date"
            value={productsFilter.startDate}
            onChange={(e) =>
              setProductsFilter((prev) => ({ ...prev, startDate: e.target.value }))
            }
          />
        </label>
        <label>
          Đến ngày
          <input
            type="date"
            value={productsFilter.endDate}
            onChange={(e) =>
              setProductsFilter((prev) => ({ ...prev, endDate: e.target.value }))
            }
          />
        </label>
        <label>
          Top
          <input
            type="number"
            min={1}
            max={50}
            value={productsFilter.limit}
            onChange={(e) =>
              setProductsFilter((prev) => ({
                ...prev,
                limit: Number(e.target.value) || 10,
              }))
            }
          />
        </label>
      </div>

      <table className="stats-table">
        <thead>
          <tr>
            <th>Hạng</th>
            <th>Sản phẩm</th>
            <th>Số lượng bán</th>
            <th>Doanh thu</th>
            <th>Giá bán TB</th>
          </tr>
        </thead>
        <tbody>
          {(productsData?.items || []).map((item) => (
            <tr key={item.productId || `${item.rank}-${item.name}`}>
              <td>{item.rank}</td>
              <td>{item.name}</td>
              <td>{item.sold}</td>
              <td>{formatCurrencyVND(item.revenue)}</td>
              <td>{formatCurrencyVND(item.avgSellingPrice)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderCustomers = () => (
    <div className="stats-panel">
      <div className="stats-filter-grid">
        <label>
          Từ ngày
          <input
            type="date"
            value={customersFilter.startDate}
            onChange={(e) =>
              setCustomersFilter((prev) => ({ ...prev, startDate: e.target.value }))
            }
          />
        </label>
        <label>
          Đến ngày
          <input
            type="date"
            value={customersFilter.endDate}
            onChange={(e) =>
              setCustomersFilter((prev) => ({ ...prev, endDate: e.target.value }))
            }
          />
        </label>
        <label>
          Số lượng
          <input
            type="number"
            min={1}
            max={100}
            value={customersFilter.limit}
            onChange={(e) =>
              setCustomersFilter((prev) => ({
                ...prev,
                limit: Number(e.target.value) || 10,
              }))
            }
          />
        </label>
      </div>

      <div className="stats-summary-grid">
        <div className="stats-summary-card">
          <span>Khách mới</span>
          <strong>{customersData?.summary?.newCustomersCount || 0}</strong>
        </div>
        <div className="stats-summary-card">
          <span>Khách hoạt động</span>
          <strong>{customersData?.summary?.activeCustomersCount || 0}</strong>
        </div>
        <div className="stats-summary-card">
          <span>Tần suất mua TB/tháng</span>
          <strong>{customersData?.summary?.averageFrequencyPerMonth || 0}</strong>
        </div>
      </div>

      <div className="stats-two-col">
        <div>
          <h4>Khách hàng mới</h4>
          <table className="stats-table">
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Ngày tham gia</th>
                <th>Tổng chi tiêu</th>
              </tr>
            </thead>
            <tbody>
              {(customersData?.newCustomers || []).map((customer) => (
                <tr key={customer.customerId}>
                  <td>{customer.name}</td>
                  <td>{customer.joinedAt}</td>
                  <td>{formatCurrencyVND(customer.totalSpent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h4>Tần suất mua hàng</h4>
          <table className="stats-table">
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Số đơn</th>
                <th>Lần/tháng</th>
                <th>Đơn gần nhất</th>
              </tr>
            </thead>
            <tbody>
              {(customersData?.purchaseFrequency || []).map((item) => (
                <tr key={item.customerId}>
                  <td>{item.customer}</td>
                  <td>{item.orders}</td>
                  <td>{item.frequencyPerMonth}</td>
                  <td>{item.lastOrderAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="stats-container">
      <div className="stats-header">
        <h2>{title}</h2>
        <p>Thống kê chi tiết theo từng mảng dữ liệu quản trị.</p>
      </div>

      <div className="stats-tabs">
        {TAB_LINKS.map((tab) => (
          <NavLink key={tab.key} to={tab.to} className="stats-tab-link">
            {tab.label}
          </NavLink>
        ))}
      </div>

      {normalizedStatus && (
        <div className="stats-alert" role="alert">
          Filter từ Dashboard: trạng thái <strong>{normalizedStatus}</strong>
        </div>
      )}

      {loading && <div className="stats-state">Đang tải dữ liệu...</div>}
      {!!error && <div className="stats-state stats-state--error">{error}</div>}

      {!loading && !error && type === "revenue" && renderRevenue()}
      {!loading && !error && type === "orders" && renderOrders()}
      {!loading && !error && type === "products" && renderProducts()}
      {!loading && !error && type === "customers" && renderCustomers()}

      <div className="stats-actions">
        {/* <Link to={PATH.adminDashboard} className="stats-back-btn">
          Quay lại Dashboard
        </Link> */}
        {type === "orders" && ordersFilter.status && (
          <span className="stats-filter-pill">
            status={STATUS_LABEL_TO_KEY[ordersFilter.status]}
          </span>
        )}
      </div>
    </div>
  );
}
