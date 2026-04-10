import api from "./api";

const DEFAULT_GROUP_BY = "day";
const DEFAULT_STATUS = ["Đang xử lý", "Đang giao", "Hoàn tất"];
const MOCK_DATE_RANGE = {
  startDate: "2026-04-01",
  endDate: "2026-04-07",
};

const MOCK_REVENUE = {
  summary: {
    totalRevenue: 78400000,
    previousPeriodRevenue: 70200000,
    growthPct: 11.68,
    totalOrders: 142,
    averageOrderValue: 552113,
  },
  filters: {
    startDate: MOCK_DATE_RANGE.startDate,
    endDate: MOCK_DATE_RANGE.endDate,
    type: "day",
  },
  series: [
    { label: "T2", value: 8.2, revenue: 8200000, orders: 16 },
    { label: "T3", value: 10.6, revenue: 10600000, orders: 21 },
    { label: "T4", value: 7.4, revenue: 7400000, orders: 14 },
    { label: "T5", value: 12.1, revenue: 12100000, orders: 24 },
    { label: "T6", value: 15.2, revenue: 15200000, orders: 28 },
    { label: "T7", value: 13.7, revenue: 13700000, orders: 23 },
    { label: "CN", value: 11.2, revenue: 11200000, orders: 16 },
  ],
};

const MOCK_ORDERS = {
  items: [
    {
      id: "OD-20411",
      customer: "Ngọc Anh",
      total: 650000,
      status: "Đang xử lý",
      time: "10:12",
      createdAt: "2026-04-07T10:12:00+07:00",
    },
    {
      id: "OD-20410",
      customer: "Minh Khang",
      total: 890000,
      status: "Đang giao",
      time: "09:48",
      createdAt: "2026-04-07T09:48:00+07:00",
    },
    {
      id: "OD-20409",
      customer: "Thùy Linh",
      total: 420000,
      status: "Hoàn tất",
      time: "09:02",
      createdAt: "2026-04-07T09:02:00+07:00",
    },
    {
      id: "OD-20408",
      customer: "Hoàng Nam",
      total: 1250000,
      status: "Hoàn tất",
      time: "Hôm qua",
      createdAt: "2026-04-06T17:10:00+07:00",
    },
    {
      id: "OD-20407",
      customer: "Khánh Vy",
      total: 780000,
      status: "Đang giao",
      time: "Hôm qua",
      createdAt: "2026-04-06T15:32:00+07:00",
    },
    {
      id: "OD-20406",
      customer: "Bảo Trân",
      total: 540000,
      status: "Đang xử lý",
      time: "Hôm qua",
      createdAt: "2026-04-06T13:50:00+07:00",
    },
  ],
  pagination: {
    page: 1,
    pageSize: 10,
    totalItems: 46,
    totalPages: 5,
    hasNextPage: true,
    hasPrevPage: false,
  },
  filters: {
    status: "",
    customerKeyword: "",
  },
};

const MOCK_PRODUCTS = {
  items: [
    {
      rank: 1,
      productId: "P-ROSE-001",
      name: "Bó hoa hồng đỏ premium",
      sold: 34,
      revenue: 18700000,
      avgSellingPrice: 550000,
    },
    {
      rank: 2,
      productId: "P-LILY-002",
      name: "Hoa ly trắng Đà Lạt",
      sold: 28,
      revenue: 12600000,
      avgSellingPrice: 450000,
    },
    {
      rank: 3,
      productId: "P-SUN-003",
      name: "Bó hướng dương năng lượng",
      sold: 25,
      revenue: 11250000,
      avgSellingPrice: 450000,
    },
    {
      rank: 4,
      productId: "P-BDAY-004",
      name: "Lẵng hoa sinh nhật pastel",
      sold: 18,
      revenue: 15300000,
      avgSellingPrice: 850000,
    },
    {
      rank: 5,
      productId: "P-BABY-005",
      name: "Bó baby trắng tinh khôi",
      sold: 15,
      revenue: 5250000,
      avgSellingPrice: 350000,
    },
  ],
  summary: {
    totalRevenue: 63100000,
    totalSold: 120,
  },
};

const MOCK_CUSTOMERS = {
  newCustomers: [
    {
      customerId: "CUS-1001",
      name: "Thanh Hà",
      joinedAt: "2026-04-05",
      firstOrderAt: "2026-04-05",
      totalSpent: 960000,
    },
    {
      customerId: "CUS-1002",
      name: "Gia Bảo",
      joinedAt: "2026-04-06",
      firstOrderAt: "2026-04-06",
      totalSpent: 450000,
    },
    {
      customerId: "CUS-1003",
      name: "Linh Chi",
      joinedAt: "2026-04-07",
      firstOrderAt: "2026-04-07",
      totalSpent: 780000,
    },
  ],
  purchaseFrequency: [
    {
      customerId: "CUS-0901",
      customer: "Nguyễn Hồng Minh",
      orders: 8,
      frequencyPerMonth: 2.7,
      lastOrderAt: "2026-04-06",
    },
    {
      customerId: "CUS-0912",
      customer: "Trần Khánh Vy",
      orders: 6,
      frequencyPerMonth: 2,
      lastOrderAt: "2026-04-07",
    },
    {
      customerId: "CUS-0930",
      customer: "Phạm Mai Anh",
      orders: 5,
      frequencyPerMonth: 1.7,
      lastOrderAt: "2026-04-05",
    },
  ],
  summary: {
    newCustomersCount: 3,
    activeCustomersCount: 29,
    averageFrequencyPerMonth: 1.9,
  },
};

const safeNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const safeString = (value, fallback = "") =>
  typeof value === "string" ? value : fallback;

const hasData = (value) => Array.isArray(value) && value.length > 0;

const normalizeRevenueResponse = (payload = {}) => {
  const data = payload?.data || payload;
  return {
    summary: {
      totalRevenue: safeNumber(data?.summary?.totalRevenue),
      previousPeriodRevenue: safeNumber(data?.summary?.previousPeriodRevenue),
      growthPct: safeNumber(data?.summary?.growthPct),
      totalOrders: safeNumber(data?.summary?.totalOrders),
      averageOrderValue: safeNumber(data?.summary?.averageOrderValue),
    },
    filters: {
      startDate: safeString(data?.filters?.startDate),
      endDate: safeString(data?.filters?.endDate),
      type: safeString(data?.filters?.type, DEFAULT_GROUP_BY),
    },
    series: Array.isArray(data?.series)
      ? data.series.map((item) => ({
          label: safeString(item?.label),
          value: safeNumber(item?.value),
          revenue: safeNumber(item?.revenue, safeNumber(item?.value)),
          orders: safeNumber(item?.orders),
        }))
      : [],
  };
};

const normalizeOrdersResponse = (payload = {}) => {
  const data = payload?.data || payload;
  const pagination = data?.pagination || {};
  return {
    items: Array.isArray(data?.items)
      ? data.items.map((order) => ({
          id: safeString(order?.id),
          customer: safeString(order?.customer),
          total: safeNumber(order?.total),
          status: safeString(order?.status),
          time: safeString(order?.time),
          createdAt: safeString(order?.createdAt),
        }))
      : [],
    pagination: {
      page: safeNumber(pagination?.page, 1),
      pageSize: safeNumber(pagination?.pageSize, 10),
      totalItems: safeNumber(pagination?.totalItems),
      totalPages: safeNumber(pagination?.totalPages),
      hasNextPage: Boolean(pagination?.hasNextPage),
      hasPrevPage: Boolean(pagination?.hasPrevPage),
    },
    filters: {
      status: safeString(data?.filters?.status),
      customerKeyword: safeString(data?.filters?.customerKeyword),
    },
  };
};

const normalizeProductsResponse = (payload = {}) => {
  const data = payload?.data || payload;
  return {
    items: Array.isArray(data?.items)
      ? data.items.map((product, index) => ({
          rank: safeNumber(product?.rank, index + 1),
          productId: safeString(product?.productId),
          name: safeString(product?.name),
          sold: safeNumber(product?.sold),
          revenue: safeNumber(product?.revenue),
          avgSellingPrice: safeNumber(product?.avgSellingPrice),
        }))
      : [],
    summary: {
      totalRevenue: safeNumber(data?.summary?.totalRevenue),
      totalSold: safeNumber(data?.summary?.totalSold),
    },
  };
};

const normalizeCustomersResponse = (payload = {}) => {
  const data = payload?.data || payload;
  return {
    newCustomers: Array.isArray(data?.newCustomers)
      ? data.newCustomers.map((customer) => ({
          customerId: safeString(customer?.customerId),
          name: safeString(customer?.name),
          joinedAt: safeString(customer?.joinedAt),
          firstOrderAt: safeString(customer?.firstOrderAt),
          totalSpent: safeNumber(customer?.totalSpent),
        }))
      : [],
    purchaseFrequency: Array.isArray(data?.purchaseFrequency)
      ? data.purchaseFrequency.map((item) => ({
          customerId: safeString(item?.customerId),
          customer: safeString(item?.customer),
          orders: safeNumber(item?.orders),
          frequencyPerMonth: safeNumber(item?.frequencyPerMonth),
          lastOrderAt: safeString(item?.lastOrderAt),
        }))
      : [],
    summary: {
      newCustomersCount: safeNumber(data?.summary?.newCustomersCount),
      activeCustomersCount: safeNumber(data?.summary?.activeCustomersCount),
      averageFrequencyPerMonth: safeNumber(data?.summary?.averageFrequencyPerMonth),
    },
  };
};

const withRevenueFilters = (data, filter) => ({
  ...data,
  filters: {
    ...data.filters,
    startDate: filter?.startDate || data.filters.startDate,
    endDate: filter?.endDate || data.filters.endDate,
    type: filter?.type || data.filters.type,
  },
});

const applyOrdersFilter = (data, filter = {}) => {
  const page = safeNumber(filter.page, 1);
  const pageSize = safeNumber(filter.pageSize, 10);
  const status = safeString(filter.status);
  const keyword = safeString(filter.customerKeyword).trim().toLowerCase();

  let filtered = data.items;
  if (status) filtered = filtered.filter((item) => item.status === status);
  if (keyword) {
    filtered = filtered.filter((item) =>
      item.customer.toLowerCase().includes(keyword),
    );
  }

  const totalItems = filtered.length;
  const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);
  const normalizedPage = Math.min(Math.max(page, 1), totalPages);
  const start = (normalizedPage - 1) * pageSize;
  const end = start + pageSize;

  return {
    items: filtered.slice(start, end),
    pagination: {
      page: normalizedPage,
      pageSize,
      totalItems,
      totalPages,
      hasNextPage: normalizedPage < totalPages,
      hasPrevPage: normalizedPage > 1,
    },
    filters: {
      status,
      customerKeyword: safeString(filter.customerKeyword),
    },
  };
};

const applyProductsFilter = (data, filter = {}) => {
  const limit = safeNumber(filter.limit, data.items.length);
  return {
    ...data,
    items: data.items.slice(0, Math.max(limit, 1)),
  };
};

const applyCustomersFilter = (data, filter = {}) => {
  const limit = safeNumber(filter.limit, 10);
  return {
    ...data,
    newCustomers: data.newCustomers.slice(0, Math.max(limit, 1)),
    purchaseFrequency: data.purchaseFrequency.slice(0, Math.max(limit, 1)),
  };
};

const formatGrowthNote = (growthPct) => {
  const growth = safeNumber(growthPct);
  if (growth > 0) return `+${growth}% so với kỳ trước`;
  if (growth < 0) return `${growth}% so với kỳ trước`;
  return "Không đổi so với kỳ trước";
};

export const adminDashboardService = {
  /**
   * API Doanh thu
   * GET /api/admin/dashboard/revenue?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&type=day|week|month
   */
  async getRevenueStats({
    startDate,
    endDate,
    type = DEFAULT_GROUP_BY,
  } = {}) {
    try {
      const response = await api.get("/api/admin/dashboard/revenue", {
        params: { startDate, endDate, type },
      });
      const normalized = normalizeRevenueResponse(response.data);
      if (hasData(normalized.series)) return normalized;
      return withRevenueFilters(MOCK_REVENUE, { startDate, endDate, type });
    } catch (error) {
      return withRevenueFilters(MOCK_REVENUE, { startDate, endDate, type });
    }
  },

  /**
   * API Đơn hàng
   * GET /api/admin/dashboard/orders?page=1&pageSize=10&status=Đang xử lý|Đang giao|Hoàn tất&customerKeyword=abc
   */
  async getOrdersStats({
    page = 1,
    pageSize = 10,
    status,
    customerKeyword,
  } = {}) {
    try {
      const response = await api.get("/api/admin/dashboard/orders", {
        params: { page, pageSize, status, customerKeyword },
      });
      const normalized = normalizeOrdersResponse(response.data);
      if (hasData(normalized.items)) return normalized;
      return applyOrdersFilter(MOCK_ORDERS, {
        page,
        pageSize,
        status,
        customerKeyword,
      });
    } catch (error) {
      return applyOrdersFilter(MOCK_ORDERS, {
        page,
        pageSize,
        status,
        customerKeyword,
      });
    }
  },

  /**
   * API Sản phẩm
   * GET /api/admin/dashboard/products/top?limit=5&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
   */
  async getTopProductsStats({ limit = 5, startDate, endDate } = {}) {
    try {
      const response = await api.get("/api/admin/dashboard/products/top", {
        params: { limit, startDate, endDate },
      });
      const normalized = normalizeProductsResponse(response.data);
      if (hasData(normalized.items)) return normalized;
      return applyProductsFilter(MOCK_PRODUCTS, { limit, startDate, endDate });
    } catch (error) {
      return applyProductsFilter(MOCK_PRODUCTS, { limit, startDate, endDate });
    }
  },

  /**
   * API Khách hàng
   * GET /api/admin/dashboard/customers?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&limit=10
   */
  async getCustomerStats({ startDate, endDate, limit = 10 } = {}) {
    try {
      const response = await api.get("/api/admin/dashboard/customers", {
        params: { startDate, endDate, limit },
      });
      const normalized = normalizeCustomersResponse(response.data);
      if (hasData(normalized.newCustomers) || hasData(normalized.purchaseFrequency)) {
        return normalized;
      }
      return applyCustomersFilter(MOCK_CUSTOMERS, { startDate, endDate, limit });
    } catch (error) {
      return applyCustomersFilter(MOCK_CUSTOMERS, { startDate, endDate, limit });
    }
  },

  /**
   * Gọi đồng thời 4 API thống kê chi tiết và trả về report đúng cấu trúc Dashboard
   */
  async getDetailedStatistics({
    revenueFilter = {},
    ordersFilter = {},
    productsFilter = {},
    customersFilter = {},
  } = {}) {
    const [revenue, orders, products, customers] = await Promise.all([
      this.getRevenueStats(revenueFilter),
      this.getOrdersStats(ordersFilter),
      this.getTopProductsStats(productsFilter),
      this.getCustomerStats(customersFilter),
    ]);

    return {
      revenue,
      orders,
      products,
      customers,
      report: this.toDashboardReport({ revenue, orders, products, customers }),
    };
  },

  /**
   * Tổng hợp dữ liệu để map ngược vào Dashboard hiện tại
   */
  toDashboardReport({
    revenue,
    orders,
    products,
    customers,
  } = {}) {
    const safeRevenue = normalizeRevenueResponse(revenue);
    const safeOrders = normalizeOrdersResponse(orders);
    const safeProducts = normalizeProductsResponse(products);
    const safeCustomers = normalizeCustomersResponse(customers);

    return {
      quickCards: [
        {
          key: "revenueRange",
          title: "Doanh thu",
          icon: "💰",
          value: safeRevenue.summary.totalRevenue,
          type: "currency",
          note: formatGrowthNote(safeRevenue.summary.growthPct),
        },
        {
          key: "ordersCount",
          title: "Số đơn",
          icon: "📦",
          value: safeRevenue.summary.totalOrders,
          type: "number",
          note: `Đang lọc: ${safeRevenue.filters.type || DEFAULT_GROUP_BY}`,
        },
        {
          key: "newCustomers",
          title: "Khách mới",
          icon: "👤",
          value: safeCustomers.summary.newCustomersCount,
          type: "number",
          note: `Khách active: ${safeCustomers.summary.activeCustomersCount}`,
        },
      ],
      revenueSeries: safeRevenue.series.map((item) => ({
        label: item.label,
        value: safeNumber(item.value),
      })),
      topProducts: safeProducts.items.map((item) => ({
        name: item.name,
        sold: item.sold,
        revenue: item.revenue,
      })),
      recentOrders: safeOrders.items.map((item) => ({
        id: item.id,
        customer: item.customer,
        total: item.total,
        status: DEFAULT_STATUS.includes(item.status)
          ? item.status
          : "Đang xử lý",
        time: item.time || item.createdAt,
      })),
      customerStats: {
        newCustomers: safeCustomers.newCustomers,
        purchaseFrequency: safeCustomers.purchaseFrequency,
      },
    };
  },
};

