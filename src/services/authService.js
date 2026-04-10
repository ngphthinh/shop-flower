import api from "./api";

export const authService = {
  /**
   * Đăng nhập - kiểm tra thông tin
   */
  async login(email, password) {
    try {
      const response = await api.post("/api/auth/login", { email, password });
      return response.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * Đăng xuất
   */
  async logout() {
    try {
      await api.post("/api/auth/logout");
    } catch (error) {
      // Ignore errors, clear local state anyway
    }
  },
};
