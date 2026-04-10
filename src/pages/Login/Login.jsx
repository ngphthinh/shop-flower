import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { login } from "../../redux/slices/authSlice";
import { PATH } from "../../routes/path";
import "./Login.css";

// Mock dữ liệu user
const MOCK_USERS = [
  {
    email: "admin@gmail.com",
    password: "123456",
    role: "ADMIN",
    name: "Admin User",
  },
  {
    email: "user@gmail.com",
    password: "123456",
    role: "USER",
    name: "Regular User",
  },
];

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Giả lập API call
    setTimeout(() => {
      const user = MOCK_USERS.find(
        (u) => u.email === formData.email && u.password === formData.password,
      );

      if (user) {
        // Giả lập JWT token
        const token = `jwt_token_${Date.now()}_${Math.random()}`;
        try {
          // Identity used for per-account profile cache (do not clear on logout).
          localStorage.setItem("auth_identity_email", String(user.email).toLowerCase());
        } catch {
          // ignore
        }
        const cacheKey = `profile_cache_${String(user.email).toLowerCase()}`;
        let cachedProfile = null;
        try {
          const raw = localStorage.getItem(cacheKey);
          cachedProfile = raw ? JSON.parse(raw) : null;
        } catch {
          cachedProfile = null;
        }

        dispatch(
          login({
            user: {
              email: user.email,
              name: cachedProfile?.name ?? user.name,
              phone: cachedProfile?.phone,
              address: cachedProfile?.address,
            },
            token,
            role: user.role,
          }),
        );

        toast.success("Đăng nhập thành công!");
        navigate(PATH.home);
      } else {
        toast.error("Email hoặc mật khẩu không chính xác");
      }

      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Đăng Nhập</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu:</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Đăng Nhập"}
          </button>
        </form>

        <div className="mock-credentials">
          <p className="text-muted">Mock Credentials:</p>
          <ul className="small">
            <li>
              <strong>Admin:</strong> admin@gmail.com / 123456
            </li>
            <li>
              <strong>User:</strong> user@gmail.com / 123456
            </li>
          </ul>
        </div>

        <p className="register-link">
          Chưa có tài khoản? <a href={PATH.register}>Đăng ký ngay</a>
        </p>
      </div>
    </div>
  );
}
