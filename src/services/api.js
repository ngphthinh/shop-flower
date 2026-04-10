import axios from "axios";

const api = axios.create({
  baseURL: "/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Lấy auth data từ localStorage - nếu cần token, sỞf thêm ở đây
    const auth = localStorage.getItem("auth");
    if (auth) {
      try {
        const parsed = JSON.parse(auth);
        // Nếu backend cần JWT, thêm: config.headers.Authorization = `Bearer ${parsed.token}`;
      } catch (e) {
        // ignore
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);
  (error) => Promise.reject(error),
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
