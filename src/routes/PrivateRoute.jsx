import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { PATH } from "./path";

/**
 * PrivateRoute - Bảo vệ route cho người dùng đã đăng nhập
 * Nếu chưa đăng nhập → redirect /login
 */
export default function PrivateRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to={PATH.login} replace />;
  }

  return children;
}
