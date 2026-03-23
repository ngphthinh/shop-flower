import api from "./api";

export const authService = {
  /**
   * Đăng nhập
   */
  async login(email, password) {
    try {
      const response = await api.post("/api/auth/login", { email, password });
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      }

      return { token, user };
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
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      throw error;
    }
  },

  /**
   * Đăng ký
   */
  async register(userData) {
    try {
      const response = await api.post("/api/auth/register", userData);
      return response.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * Lấy thông tin user hiện tại
   */
  async getCurrentUser() {
    try {
      const response = await api.get("/api/auth/me");
      return response.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * Lấy token từ localStorage
   */
  getToken() {
    return localStorage.getItem("token");
  },

  /**
   * Lấy user từ localStorage
   */
  getUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  /**
   * Kiểm tra user đã login hay chưa
   */
  isAuthenticated() {
    return !!this.getToken();
  },
};
