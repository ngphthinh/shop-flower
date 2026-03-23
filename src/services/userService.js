import api from "./api";

export const userService = {
  /**
   * Lấy profile user
   */
  async getProfile() {
    try {
      const response = await api.get("/api/users/profile");
      return response.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * Cập nhật profile user
   */
  async updateProfile(userData) {
    try {
      const response = await api.put("/api/users/profile", userData);
      return response.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * Lấy danh sách đơn hàng của user
   */
  async getOrders() {
    try {
      const response = await api.get("/api/users/orders");
      return response.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * Lấy chi tiết đơn hàng
   */
  async getOrder(orderId) {
    try {
      const response = await api.get(`/api/users/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * Tạo đơn hàng mới
   */
  async createOrder(orderData) {
    try {
      const response = await api.post("/api/users/orders", orderData);
      const result = response.data;

      // Persist created order to localStorage mock list so Orders page can show it
      try {
        const stored = localStorage.getItem("mock_orders");
        const orders = stored ? JSON.parse(stored) : [];
        // normalize saved order shape
        const savedOrder = {
          id: result.id || result._id || Date.now(),
          products: result.products || result.items || orderData.products || orderData.items || [],
          shippingAddress: result.shippingAddress || result.shipping || orderData.shippingAddress || {},
          paymentMethod: result.paymentMethod || orderData.paymentMethod || "cod",
          total: result.total || orderData.total || 0,
          status: result.status || orderData.status || (orderData.paymentMethod === "bank" ? "paid" : "pending"),
          createdAt: result.createdAt || result.created_at || new Date().toISOString(),
        };
        orders.push(savedOrder);
        localStorage.setItem("mock_orders", JSON.stringify(orders));
      } catch (e) {
        // ignore localStorage errors
      }

      return result;
    } catch (error) {
      // Nếu backend không khả dụng hoặc trả lỗi server, dùng fallback mock (localStorage)
      const status = error?.response?.status;
  // Nếu backend không khả dụng (no status) hoặc lỗi server (5xx) hoặc endpoint không tồn tại (404)
  // Hoặc lỗi xác thực (401/403) trong môi trường dev → dùng mock để phát triển UX
  if (!status || status >= 500 || status === 404 || status === 401 || status === 403) {
        try {
          const stored = localStorage.getItem("mock_orders");
          const orders = stored ? JSON.parse(stored) : [];
          const newOrder = {
            id: Date.now(),
            products: orderData.products || orderData.items || [],
            shippingAddress: orderData.shippingAddress || orderData.shipping || {},
            paymentMethod: orderData.paymentMethod || "cod",
            total: orderData.total || 0,
            // allow client to set initial status (e.g., 'paid' for bank transfers)
            status: orderData.status || "pending",
            createdAt: new Date().toISOString(),
          };
          orders.push(newOrder);
          localStorage.setItem("mock_orders", JSON.stringify(orders));
          return newOrder;
        } catch (e) {
          // nếu mock cũng lỗi, trả về lỗi gốc
          throw error?.response?.data || error;
        }
      }

      throw error?.response?.data || error;
    }
  },

  /**
   * Hủy đơn hàng
   */
  async cancelOrder(orderId) {
    try {
      const response = await api.post(`/api/users/orders/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },
};
