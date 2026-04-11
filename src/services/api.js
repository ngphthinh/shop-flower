import axios from "axios";

const api = axios.create({
  baseURL: "/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// <<<<<<< HEAD
// // Request interceptor
// api.interceptors.request.use(
//   (config) => {
//     // Lấy auth data từ localStorage - nếu cần token, sỞf thêm ở đây
//     const auth = localStorage.getItem("auth");
//     if (auth) {
//       try {
//         const parsed = JSON.parse(auth);
//         // Nếu backend cần JWT, thêm: config.headers.Authorization = `Bearer ${parsed.token}`;
//       } catch (e) {
//         // ignore
//       }
function getStoredToken() {
  // Preferred storage (per authSlice): localStorage["auth"] = { user, token, role }
  try {
    const authRaw = localStorage.getItem("auth");
    if (authRaw) {
      const auth = JSON.parse(authRaw);
      if (auth?.token) return auth.token;
    }
  } catch {
    // ignore
  }

  // Fallback for older storage keys
  return localStorage.getItem("token");
}

// Request interceptor để add token nếu có
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("auth");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
