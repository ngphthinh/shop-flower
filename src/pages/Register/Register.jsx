import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { PATH } from "../../routes/path";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.passwordConfirm) {
      toast.error("Mật khẩu không khớp!");
      return;
    }

    setIsLoading(true);

    // Giả lập API call
    setTimeout(() => {
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate(PATH.login);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Đăng Ký</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Tên:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập tên của bạn"
              required
            />
          </div>

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

          <div className="form-group">
            <label htmlFor="passwordConfirm">Xác nhận mật khẩu:</label>
            <div className="password-input-wrapper">
              <input
                type={showPasswordConfirm ? "text" : "password"}
                id="passwordConfirm"
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleChange}
                placeholder="Xác nhận mật khẩu"
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                title={showPasswordConfirm ? "Ẩn mật khẩu" : "Hiện mật khẩu"}>
                {showPasswordConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="register-btn" disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Đăng Ký"}
          </button>
        </form>

        <p className="login-link">
          Đã có tài khoản? <a href={PATH.login}>Đăng nhập ngay</a>
        </p>
      </div>
    </div>
  );
}
