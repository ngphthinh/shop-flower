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
      return response.data;
    } catch (error) {
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
