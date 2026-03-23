import axios from "axios";

const api = axios.create({
  baseURL: "/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor để add token nếu có
api.interceptors.request.use(
  (config) => {
    // Hỗ trợ nhiều cách lưu token trong localStorage để tránh mismatch giữa các module
    let token = localStorage.getItem("token");
    if (!token) {
      const authRaw = localStorage.getItem("auth");
      if (authRaw) {
        try {
          const parsed = JSON.parse(authRaw);
          token = parsed?.token || token;
        } catch (e) {
          // ignore
        }
      }
    }

    if (!token) {
      // một số nơi lưu user riêng, có thể chứa token
      const userRaw = localStorage.getItem("user");
      if (userRaw) {
        try {
          const parsedUser = JSON.parse(userRaw);
          token = parsedUser?.token || token;
        } catch (e) {
          // ignore
        }
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor để xử lý lỗi global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
