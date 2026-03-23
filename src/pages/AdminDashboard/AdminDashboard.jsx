import { useSelector } from "react-redux";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);

  const formatCurrencyVND = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value ?? 0);


  const report = {
    quickCards: [
      {
        key: "revenueToday",
        title: "Doanh thu hôm nay",
        icon: "💰",
        value: 15650000,
        type: "currency",
        note: "+8.2% so với hôm qua",
      },
      {
        key: "ordersToday",
        title: "Số đơn hôm nay",
        icon: "📦",
        value: 18,
        type: "number",
        note: "Mục tiêu 25 đơn",
      },
      {
        key: "newCustomers",
        title: "Khách mới",
        icon: "👤",
        value: 6,
        type: "number",
        note: "Trong 24 giờ gần nhất",
      },
    ],
    revenueSeries: [
      { label: "T2", value: 8.2 },
      { label: "T3", value: 10.6 },
      { label: "T4", value: 7.4 },
      { label: "T5", value: 12.1 },
      { label: "T6", value: 15.2 },
      { label: "T7", value: 13.7 },
      { label: "CN", value: 16.4 },
    ],
    topProducts: [
      { name: "Bó hoa hồng đỏ", sold: 12 },
      { name: "Hoa ly trắng", sold: 9 },
      { name: "Bó hướng dương", sold: 8 },
      { name: "Lẵng hoa sinh nhật", sold: 6 },
      { name: "Bó baby", sold: 5 },
    ],
    recentOrders: [
      {
        id: "OD-10231",
        customer: "Ngọc Anh",
        total: 650000,
        status: "Đang xử lý",
        time: "10:12",
      },
      {
        id: "OD-10230",
        customer: "Minh Khang",
        total: 890000,
        status: "Đang giao",
        time: "09:48",
      },
      {
        id: "OD-10229",
        customer: "Thuỳ Linh",
        total: 420000,
        status: "Hoàn tất",
        time: "09:02",
      },
      {
        id: "OD-10228",
        customer: "Hoàng Nam",
        total: 1250000,
        status: "Hoàn tất",
        time: "Hôm qua",
      },
    ],
  };

  const maxRevenue = Math.max(...report.revenueSeries.map((x) => x.value), 1);
  const Y_STEP_MILLION = 5;
  const yMax =
    Math.ceil(maxRevenue / Y_STEP_MILLION) * Y_STEP_MILLION || Y_STEP_MILLION;
  const yAxisTicks = Array.from(
    { length: Math.floor(yMax / Y_STEP_MILLION) + 1 },
    (_, i) => yMax - i * Y_STEP_MILLION,
  );

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Báo cáo thống kê</h1>
        <p>Tổng quan doanh thu, đơn hàng và khách hàng</p>
      </div>

      <div className="admin-grid">
        <div className="admin-card admin-card--report">

          <div className="admin-report" aria-label="Báo cáo thống kê của admin">
            <div className="admin-report__section">
              <div className="admin-quick-grid">
                {report.quickCards.map((c) => (
                  <div className="admin-mini-card" key={c.key}>
                    <div className="admin-mini-card__title">
                      <span className="admin-mini-card__icon">{c.icon}</span>
                      {c.title}
                    </div>
                    <div className="admin-mini-card__value">
                      {c.type === "currency"
                        ? formatCurrencyVND(c.value)
                        : c.value}
                    </div>
                    <div className="admin-mini-card__note">{c.note}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-report__section">
              <div className="admin-section-title">Biểu đồ</div>
              <div className="admin-report-bottom">
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
                      <div
                        className="admin-bar-chart__plot"
                        aria-label="Biểu đồ doanh thu theo thời gian">
                        {report.revenueSeries.map((p) => (
                          <div className="admin-bar" key={p.label}>
                            <div className="admin-bar__value">
                              {formatCurrencyVND(p.value * 1000000)}
                            </div>
                            <div
                              className="admin-bar__fill"
                              style={{
                                height: `${Math.round((p.value / yMax) * 100)}%`,
                              }}
                              title={`${p.label}: ${formatCurrencyVND(p.value * 1000000)}`}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="admin-x-axis" aria-hidden="true">
                        {report.revenueSeries.map((p) => (
                          <div className="admin-x-axis__label" key={p.label}>
                            {p.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="admin-top-card">
                  <div className="admin-subtitle">Top sản phẩm</div>
                  <div className="admin-top-list">
                    {report.topProducts.map((p, idx) => (
                      <div className="admin-top-row" key={p.name}>
                        <div className="admin-top-rank">{idx + 1}</div>
                        <div className="admin-top-name">{p.name}</div>
                        <div className="admin-top-sold">
                          {p.sold}{" "}
                          <span className="admin-top-sold__label">đã bán</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-report__section">
              <div className="admin-section-title">Đơn hàng gần nhất</div>
              <div className="admin-table-card">
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
                      {report.recentOrders.map((o) => (
                        <tr key={o.id}>
                          <td className="admin-mono">{o.id}</td>
                          <td>{o.customer}</td>
                          <td>{o.time}</td>
                          <td>{formatCurrencyVND(o.total)}</td>
                          <td>
                            <span
                              className={`admin-pill admin-pill--${o.status === "Hoàn tất" ? "done" : o.status === "Đang giao" ? "ship" : "pending"}`}>
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
