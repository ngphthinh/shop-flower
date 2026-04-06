import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../routes/path";
import { adminDashboardService } from "../../services/adminDashboardService";
import "./AdminDashboard.css";

const formatCurrencyVND = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value ?? 0);

function QuickStats({ cards, onNavigate }) {
  return (
    <div className="admin-quick-grid">
      {cards.map((card) => (
        <div
          key={card.key}
          className={`admin-mini-card ${card.to ? "admin-mini-card--clickable" : ""}`}
          role={card.to ? "button" : undefined}
          tabIndex={card.to ? 0 : undefined}
          onClick={() => card.to && onNavigate(card.to)}
          onKeyDown={(event) => {
            if (!card.to) return;
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onNavigate(card.to);
            }
          }}>
          <div className="admin-mini-card__title">
            <span className="admin-mini-card__icon">{card.icon}</span>
            {card.title}
          </div>
          <div className="admin-mini-card__value">
            {card.type === "currency" ? formatCurrencyVND(card.value) : card.value}
          </div>
          <div className="admin-mini-card__note">{card.note}</div>
        </div>
      ))}
    </div>
  );
}

function RevenueChart({ series }) {
  const maxRevenue = Math.max(...series.map((x) => x.value), 1);
  const Y_STEP_MILLION = 5;
  const yMax =
    Math.ceil(maxRevenue / Y_STEP_MILLION) * Y_STEP_MILLION || Y_STEP_MILLION;
  const yAxisTicks = Array.from(
    { length: Math.floor(yMax / Y_STEP_MILLION) + 1 },
    (_, i) => yMax - i * Y_STEP_MILLION,
  );

  return (
    <div className="admin-chart-card">
      <div className="admin-subtitle">Doanh thu theo ngày</div>
      <div className="admin-chart-layout">
        <div className="admin-y-axis" aria-hidden="true">
          <div className="admin-y-axis__unit">VNĐ</div>
          {yAxisTicks.map((tick) => (
            <div className="admin-y-axis__tick" key={tick}>
              {tick}tr
            </div>
          ))}
        </div>
        <div className="admin-bar-chart">
          <div className="admin-bar-chart__plot" aria-label="Biểu đồ doanh thu theo thời gian">
            {series.map((point) => (
              <div className="admin-bar" key={point.label}>
                <div className="admin-bar__value">
                  {formatCurrencyVND(point.value * 1000000)}
                </div>
                <div
                  className="admin-bar__fill"
                  style={{
                    height: `${Math.round((point.value / yMax) * 100)}%`,
                  }}
                  title={`${point.label}: ${formatCurrencyVND(point.value * 1000000)}`}
                />
              </div>
            ))}
          </div>
          <div className="admin-x-axis" aria-hidden="true">
            {series.map((point) => (
              <div className="admin-x-axis__label" key={point.label}>
                {point.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TopProductsCard({ products, onClick }) {
  return (
    <div
      role="button"
      tabIndex={0}
      className="admin-top-card admin-panel-link"
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
      aria-label="Đi tới thống kê top sản phẩm">
      <div className="admin-subtitle">Top sản phẩm</div>
      <div className="admin-top-list">
        {products.length > 0 ? (
          products.map((product, index) => (
            <div className="admin-top-row" key={product.name}>
              <div className="admin-top-rank">{index + 1}</div>
              <div className="admin-top-name">{product.name}</div>
              <div className="admin-top-sold">
                {product.sold} <span className="admin-top-sold__label">đã bán</span>
              </div>
            </div>
          ))
        ) : (
          <div className="admin-empty">Chưa có dữ liệu sản phẩm.</div>
        )}
      </div>
    </div>
  );
}

function statusClassName(status) {
  if (status === "Hoàn tất") return "done";
  if (status === "Đang giao") return "ship";
  return "pending";
}

function RecentOrdersTable({ orders, onClick }) {
  return (
    <div
      role="button"
      tabIndex={0}
      className="admin-table-card admin-panel-link"
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
      aria-label="Đi tới thống kê đơn hàng">
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách</th>
              <th>Thời gian</th>
              <th>Tổng</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id}>
                  <td className="admin-mono">{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.time}</td>
                  <td>{formatCurrencyVND(order.total)}</td>
                  <td>
                    <span className={`admin-pill admin-pill--${statusClassName(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="admin-empty admin-empty--row">
                  Chưa có dữ liệu đơn hàng gần nhất.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [apiReport, setApiReport] = useState(null);

  const defaultReport = useMemo(
    () => ({
      quickCards: [
        {
          key: "revenueToday",
          title: "Doanh thu hôm nay",
          icon: "💰",
          value: 0,
          type: "currency",
          note: "Đang cập nhật dữ liệu",
          to: PATH.statisticsRevenue,
        },
        {
          key: "ordersToday",
          title: "Số đơn hôm nay",
          icon: "📦",
          value: 0,
          type: "number",
          note: "Đang cập nhật dữ liệu",
          to: `${PATH.statisticsOrders}?status=pending`,
        },
        {
          key: "newCustomers",
          title: "Khách mới",
          icon: "👤",
          value: 0,
          type: "number",
          note: "Đang cập nhật dữ liệu",
        },
      ],
      revenueSeries: [],
      topProducts: [],
      recentOrders: [],
    }),
    [],
  );

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      setLoading(true);
      setError("");
      try {
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 6);
        const startDate = sevenDaysAgo.toISOString().slice(0, 10);
        const endDate = today.toISOString().slice(0, 10);

        const data = await adminDashboardService.getDetailedStatistics({
          revenueFilter: { startDate, endDate, type: "day" },
          ordersFilter: { page: 1, pageSize: 6 },
          productsFilter: { startDate, endDate, limit: 5 },
          customersFilter: { startDate, endDate, limit: 10 },
        });

        if (!mounted) return;
        const normalized = data?.report || {};
        setApiReport({
          quickCards: [
            {
              ...(normalized.quickCards?.[0] || defaultReport.quickCards[0]),
              key: "revenueToday",
              title: "Doanh thu hôm nay",
              to: PATH.statisticsRevenue,
            },
            {
              ...(normalized.quickCards?.[1] || defaultReport.quickCards[1]),
              key: "ordersToday",
              title: "Số đơn hôm nay",
              to: `${PATH.statisticsOrders}?status=pending`,
            },
            {
              ...(normalized.quickCards?.[2] || defaultReport.quickCards[2]),
              key: "newCustomers",
              title: "Khách mới",
            },
          ],
          revenueSeries: normalized.revenueSeries || [],
          topProducts: normalized.topProducts || [],
          recentOrders: normalized.recentOrders || [],
        });
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || "Không thể tải dữ liệu Dashboard.");
        setApiReport(defaultReport);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadDashboard();
    return () => {
      mounted = false;
    };
  }, [defaultReport]);

  const report = apiReport || defaultReport;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Dashboard</h1>
        <p>Tổng quan doanh thu, đơn hàng và khách hàng</p>
      </div>

      <div className="admin-grid">
        <div className="admin-card admin-card--report">
          {loading && (
            <div className="admin-state admin-state--loading">Đang tải dữ liệu Dashboard...</div>
          )}
          {!loading && !!error && (
            <div className="admin-state admin-state--error">
              {error}. Đang hiển thị dữ liệu mặc định.
            </div>
          )}
          <div className="admin-report" aria-label="Báo cáo thống kê của admin">
            <div className="admin-report__section">
              <QuickStats cards={report.quickCards} onNavigate={navigate} />
            </div>

            <div className="admin-report__section">
              <div className="admin-section-title">Biểu đồ</div>
              <div className="admin-report-bottom">
                <RevenueChart series={report.revenueSeries} />
                <TopProductsCard
                  products={report.topProducts}
                  onClick={() => navigate(PATH.statisticsProducts)}
                />
              </div>
            </div>

            <div className="admin-report__section">
              <button
                type="button"
                className="admin-section-title admin-section-title--link"
                onClick={() => navigate(PATH.statisticsOrders)}>
                Đơn hàng gần nhất
              </button>
              <RecentOrdersTable
                orders={report.recentOrders}
                onClick={() => navigate(PATH.statisticsOrders)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
