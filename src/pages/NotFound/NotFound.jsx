import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container py-5 text-center">
      <h1 className="display-6">404 - Không tìm thấy trang</h1>
      <p className="text-muted mb-4">Đường dẫn bạn truy cập không tồn tại.</p>
      <Link to="/" className="btn btn-success">
        Về trang chủ
      </Link>
    </div>
  );
}
