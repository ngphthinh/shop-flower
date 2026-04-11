import {
  FaEnvelope,
  FaPhone,
  FaMapPin,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLeaf,
  FaStore,
  FaCircleInfo,
  FaCreditCard,
  FaHeart,
  FaX,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import { PATH } from "../routes/path";

export default function SiteFooter() {
  return (
    <footer className="site-footer mt-5">
      <div className="footer-stripe" />
      <div className="container py-5">
        <div className="row g-4">
          {/* About Section */}
          <div className="col-12 col-lg-4">
            <div className="footer-about">
              <h3 className="footer-logo mb-2">
                <FaLeaf className="me-2" />
                Beautiful Flowers
              </h3>
              <p className="footer-tagline">Hoa tươi mỗi ngày</p>
              <p className="footer-description">
                Cửa hàng hoa online với những bó hoa tươi đẹp, giao hàng nhanh
                chóng. Phù hợp tặng sinh nhật, kỷ niệm, khai trương và tất cả
                những dịp đặc biệt trong cuộc sống.
              </p>
              <div className="social-links mt-3">
                <a
                  href="https://www.facebook.com/"
                  className="social-link"
                  title="Facebook">
                  <FaFacebook />
                </a>
                <a href="#" className="social-link" title="Instagram">
                  <FaInstagram />
                </a>
                <a href="#" className="social-link" title="Twitter">
                  <FaX />
                </a>
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div className="col-6 col-lg-2">
            <h5 className="footer-title">
              <FaStore className="me-2" />
              Cửa hàng
            </h5>
            <ul className="list-unstyled footer-links">
              <li>
                <Link
                  to={PATH.home}
                  className="footer-link-btn">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  to={PATH.home}
                  className="footer-link-btn">
                  Bó hoa
                </Link>
              </li>
              <li>
                <Link
                  to={PATH.home}
                  className="footer-link-btn">
                  Khuyến mãi
                </Link>
              </li>
              <li>
                <Link
                  to={PATH.home}
                  className="footer-link-btn">
                  Hoa chậu
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-6 col-lg-2">
            <h5 className="footer-title">
              <FaCircleInfo className="me-2" />
              Thông tin
            </h5>
            <ul className="list-unstyled footer-links">
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  data-bs-toggle="modal"
                  data-bs-target="#footerAboutModal">
                  Giới thiệu
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  data-bs-toggle="modal"
                  data-bs-target="#footerPrivacyModal">
                  Chính sách bảo mật
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  data-bs-toggle="modal"
                  data-bs-target="#footerTermsModal">
                  Điều khoản dịch vụ
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  data-bs-toggle="modal"
                  data-bs-target="#footerGuideModal">
                  Hướng dẫn mua
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="col-12 col-lg-4">
            <h5 className="footer-title">
              <FaPhone className="me-2" />
              Liên hệ
            </h5>
            <div className="contact-items">
              <div className="contact-item">
                <FaMapPin className="contact-icon" />
                <div>
                  <span className="contact-label">Địa chỉ</span>
                  <p>12 Nguyễn Văn Bảo, Phường Hạnh Thông, TPHCM</p>
                  <a
                    className="text-decoration-none text-dark fw-medium"
                    href="https://maps.app.goo.gl/KAhttzrSBLeuS7y57"
                    target="_blank"
                    rel="noreferrer">
                    Mở Google Maps
                  </a>
                </div>
              </div>
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <div>
                  <span className="contact-label">Điện thoại</span>
                  <p>1800 1143 | +84 938 123 456</p>
                </div>
              </div>
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <div>
                  <span className="contact-label">Email</span>
                  <p>support@beautifulflowers.com</p>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <div className="ratio ratio-16x9 rounded-3 overflow-hidden border bg-light">
                <iframe
                  title="Beautiful Flowers - Google Map"
                  src="https://www.google.com/maps?q=12%20Nguy%E1%BB%85n%20V%C4%83n%20B%E1%BA%A3o%2C%20TPHCM&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  style={{ border: 0 }}
                  allowFullScreen
                />
              </div>
            </div>
            <div className="payment-row mt-4">
              <span>
                <FaCreditCard className="me-1" />
                Vietcombank
              </span>
              <span>
                <FaCreditCard className="me-1" />
                VIB
              </span>
              <span>
                <FaCreditCard className="me-1" />
                HDBank
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="footer-divider my-4" />

        {/* Bottom Section */}
        <div className="footer-bottom-content">
          <div className="row align-items-center">
            <div className="col-12 col-md-6 text-center text-md-start mb-3 mb-md-0">
              <p className="footer-copyright">
                © 2026 <strong>Beautiful Flowers</strong>. Bảo lưu mọi quyền.
              </p>
            </div>
           
          </div>
        </div>
      </div>

      {/* Modals: Thông tin */}
      <div
        className="modal fade"
        id="footerAboutModal"
        tabIndex={-1}
        aria-labelledby="footerAboutModalLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <div className="d-flex align-items-center gap-2">
                  <span
                    className="d-inline-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: 36,
                      height: 36,
                      background: "rgba(240,125,174,0.15)",
                      color: "#f07dae",
                    }}>
                    <FaLeaf />
                  </span>
                  <h5 className="modal-title mb-0" id="footerAboutModalLabel">
                    Giới thiệu
                  </h5>
                </div>
                <div className="small text-muted mt-1">
                  Về Beautiful Flowers và trải nghiệm mua hoa.
                </div>
              </div>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="p-3 rounded-3 border bg-light-subtle mb-3">
                <div className="fw-semibold mb-1">Sứ mệnh</div>
                <div className="text-muted">
                  Mang đến trải nghiệm tặng hoa tinh tế, đặt nhanh, giao đúng
                  hẹn và chăm sóc tận tâm.
                </div>
              </div>

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <div className="border rounded-3 p-3 h-100">
                    <div className="fw-semibold mb-2">Điểm nổi bật</div>
                    <ul className="mb-0">
                      <li>Hoa tươi chọn lọc mỗi ngày</li>
                      <li>Thiết kế theo dịp (sinh nhật, kỷ niệm, khai trương)</li>
                      <li>Tư vấn theo ngân sách và thông điệp</li>
                      <li>Đóng gói cẩn thận, giao nhanh nội thành</li>
                    </ul>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="border rounded-3 p-3 h-100">
                    <div className="fw-semibold mb-2">Cam kết dịch vụ</div>
                    <ul className="mb-0">
                      <li>Minh bạch thông tin sản phẩm</li>
                      <li>Hỗ trợ trước và sau khi nhận hàng</li>
                      <li>Phản hồi nhanh khi có sự cố giao nhận</li>
                      <li>Ưu tiên trải nghiệm khách hàng</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal">
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="footerPrivacyModal"
        tabIndex={-1}
        aria-labelledby="footerPrivacyModalLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <div className="d-flex align-items-center gap-2">
                  <span
                    className="d-inline-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: 36,
                      height: 36,
                      background: "rgba(240,125,174,0.15)",
                      color: "#f07dae",
                    }}>
                    <FaCircleInfo />
                  </span>
                  <h5 className="modal-title mb-0" id="footerPrivacyModalLabel">
                    Chính sách bảo mật
                  </h5>
                </div>
                <div className="small text-muted mt-1">
                  Cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu.
                </div>
              </div>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="alert alert-light border" role="alert">
                Chúng tôi chỉ sử dụng dữ liệu để xử lý đơn hàng, liên hệ giao
                nhận và chăm sóc khách hàng. Bạn có thể yêu cầu chỉnh sửa hoặc
                xóa dữ liệu theo quy định.
              </div>

              <div className="accordion" id="privacyAccordion">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="privacyHeadingOne">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#privacyCollapseOne"
                      aria-expanded="true"
                      aria-controls="privacyCollapseOne">
                      Dữ liệu chúng tôi thu thập
                    </button>
                  </h2>
                  <div
                    id="privacyCollapseOne"
                    className="accordion-collapse collapse show"
                    aria-labelledby="privacyHeadingOne"
                    data-bs-parent="#privacyAccordion">
                    <div className="accordion-body">
                      <ul className="mb-0">
                        <li>Họ tên, số điện thoại, địa chỉ nhận hàng</li>
                        <li>Email đăng ký và thông tin tài khoản</li>
                        <li>Ghi chú giao hàng và lịch sử đơn hàng</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="accordion-item">
                  <h2 className="accordion-header" id="privacyHeadingTwo">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#privacyCollapseTwo"
                      aria-expanded="false"
                      aria-controls="privacyCollapseTwo">
                      Mục đích sử dụng
                    </button>
                  </h2>
                  <div
                    id="privacyCollapseTwo"
                    className="accordion-collapse collapse"
                    aria-labelledby="privacyHeadingTwo"
                    data-bs-parent="#privacyAccordion">
                    <div className="accordion-body">
                      <ul className="mb-0">
                        <li>Xác nhận đơn, giao nhận, hỗ trợ đổi/trả</li>
                        <li>Thông báo trạng thái đơn hàng</li>
                        <li>Cải thiện trải nghiệm và chất lượng dịch vụ</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="accordion-item">
                  <h2 className="accordion-header" id="privacyHeadingThree">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#privacyCollapseThree"
                      aria-expanded="false"
                      aria-controls="privacyCollapseThree">
                      Chia sẻ dữ liệu & bảo mật
                    </button>
                  </h2>
                  <div
                    id="privacyCollapseThree"
                    className="accordion-collapse collapse"
                    aria-labelledby="privacyHeadingThree"
                    data-bs-parent="#privacyAccordion">
                    <div className="accordion-body">
                      <ul className="mb-0">
                        <li>
                          Không chia sẻ cho bên thứ ba ngoài mục đích giao nhận
                          hoặc khi có yêu cầu hợp pháp.
                        </li>
                        <li>
                          Bảo mật thông tin đăng nhập theo chuẩn hệ thống.
                        </li>
                        <li>
                          Hạn chế truy cập nội bộ theo nguyên tắc tối thiểu.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal">
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="footerTermsModal"
        tabIndex={-1}
        aria-labelledby="footerTermsModalLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <div className="d-flex align-items-center gap-2">
                  <span
                    className="d-inline-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: 36,
                      height: 36,
                      background: "rgba(240,125,174,0.15)",
                      color: "#f07dae",
                    }}>
                    <FaCircleInfo />
                  </span>
                  <h5 className="modal-title mb-0" id="footerTermsModalLabel">
                    Điều khoản dịch vụ
                  </h5>
                </div>
                <div className="small text-muted mt-1">
                  Các quy định khi sử dụng dịch vụ của Beautiful Flowers.
                </div>
              </div>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-12">
                  <div className="border rounded-3 p-3">
                    <div className="fw-semibold mb-2">Sản phẩm & hình ảnh</div>
                    <ul className="mb-0">
                      <li>
                        Ảnh sản phẩm mang tính minh họa; có thể chênh lệch nhỏ do
                        hoa tự nhiên và phụ kiện theo ngày.
                      </li>
                      <li>
                        Giá và tình trạng sản phẩm có thể thay đổi theo mùa vụ và
                        tồn kho.
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="border rounded-3 p-3 h-100">
                    <div className="fw-semibold mb-2">Giao hàng</div>
                    <ul className="mb-0">
                      <li>
                        Thời gian giao hàng phụ thuộc khu vực và điều kiện vận
                        chuyển.
                      </li>
                      <li>
                        Vui lòng cung cấp địa chỉ, số điện thoại chính xác để
                        tránh chậm trễ.
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="border rounded-3 p-3 h-100">
                    <div className="fw-semibold mb-2">Đổi/Trả & hỗ trợ</div>
                    <ul className="mb-0">
                      <li>
                        Nếu phát sinh lỗi giao nhận, chúng tôi hỗ trợ xử lý theo
                        mức độ phù hợp.
                      </li>
                      <li>
                        Giữ lại hình ảnh/biên nhận để hỗ trợ nhanh hơn khi cần.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal">
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="footerGuideModal"
        tabIndex={-1}
        aria-labelledby="footerGuideModalLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <div className="d-flex align-items-center gap-2">
                  <span
                    className="d-inline-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: 36,
                      height: 36,
                      background: "rgba(240,125,174,0.15)",
                      color: "#f07dae",
                    }}>
                    <FaLeaf />
                  </span>
                  <h5 className="modal-title mb-0" id="footerGuideModalLabel">
                    Hướng dẫn mua
                  </h5>
                </div>
                <div className="small text-muted mt-1">
                  5 bước đặt hoa nhanh và theo dõi đơn.
                </div>
              </div>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-12">
                  <div className="p-3 rounded-3 border bg-light-subtle">
                    <div className="fw-semibold mb-1">Mẹo nhanh</div>
                    <div className="text-muted">
                      Nhập đúng số điện thoại và địa chỉ để shop giao nhanh hơn.
                      Nếu bạn tặng người khác, hãy thêm ghi chú “Người nhận” ở
                      phần ghi chú đơn hàng.
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="list-group">
                    <div className="list-group-item">
                      <div className="fw-semibold">1) Chọn mẫu hoa</div>
                      <div className="text-muted small">
                        Vào trang chi tiết để xem mô tả và giá.
                      </div>
                    </div>
                    <div className="list-group-item">
                      <div className="fw-semibold">2) Thêm vào giỏ</div>
                      <div className="text-muted small">
                        Kiểm tra số lượng và sản phẩm đã chọn.
                      </div>
                    </div>
                    <div className="list-group-item">
                      <div className="fw-semibold">3) Đăng nhập</div>
                      <div className="text-muted small">
                        Đăng nhập/đăng ký để tiến hành thanh toán.
                      </div>
                    </div>
                    <div className="list-group-item">
                      <div className="fw-semibold">4) Thanh toán</div>
                      <div className="text-muted small">
                        Nhập địa chỉ, ghi chú giao hàng, xác nhận đơn.
                      </div>
                    </div>
                    <div className="list-group-item">
                      <div className="fw-semibold">5) Theo dõi đơn</div>
                      <div className="text-muted small">
                        Vào mục “Đơn hàng” để xem trạng thái.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal">
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
