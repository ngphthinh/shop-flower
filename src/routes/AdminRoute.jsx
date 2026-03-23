import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { PATH } from "./path";

/**
 * AdminRoute - Bảo vệ route cho admin
 * Nếu không phải admin → redirect /
 */
export default function AdminRoute({ children }) {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  if (!isAuthenticated || role !== "ADMIN") {
    return <Navigate to={PATH.home} replace />;
  }

  return children;
}
