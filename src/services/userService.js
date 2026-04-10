import api from "./api";

function readLocalProfile() {
  try {
    const authRaw = localStorage.getItem("auth");
    if (authRaw) {
      const auth = JSON.parse(authRaw);
      return auth?.user ?? null;
    }
  } catch {
    // ignore
  }

  try {
    const userRaw = localStorage.getItem("user");
    return userRaw ? JSON.parse(userRaw) : null;
  } catch {
    return null;
  }
}

function writeLocalProfile(updatedUser) {
  // Keep both storage styles in sync for this project.
  try {
    const authRaw = localStorage.getItem("auth");
    if (authRaw) {
      const auth = JSON.parse(authRaw);
      localStorage.setItem(
        "auth",
        JSON.stringify({ ...auth, user: updatedUser }),
      );
    }
  } catch {
    // ignore
  }

  try {
    localStorage.setItem("user", JSON.stringify(updatedUser));
  } catch {
    // ignore
  }
}

export const userService = {
  /**
   * Lấy profile user
   */
  async getProfile() {
    try {
      const response = await api.get("/api/users/profile");
      return response.data;
    } catch (error) {
      const status = error?.response?.status;
      // When running FE-only (no backend/proxy), fall back to local profile.
      if (status === 404 || status === 0 || !error?.response) {
        const local = readLocalProfile();
        if (local) return local;
      }
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
      const status = error?.response?.status;
      if (status === 404 || status === 0 || !error?.response) {
        const current = readLocalProfile() || {};
        const updated = { ...current, ...userData, updatedAt: new Date().toISOString() };
        writeLocalProfile(updated);
        return updated;
      }
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
