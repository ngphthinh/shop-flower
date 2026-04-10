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
                <a href="/">Trang chủ</a>
              </li>
              <li>
                <a href="/">Bó hoa</a>
              </li>
              <li>
                <a href="/">Khuyến mãi</a>
              </li>
              <li>
                <a href="/">Hoa chậu</a>
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
                <a href="/">Giới thiệu</a>
              </li>
              <li>
                <a href="/">Chính sách bảo mật</a>
              </li>
              <li>
                <a href="/">Điều khoản dịch vụ</a>
              </li>
              <li>
                <a href="/">Hướng dẫn mua</a>
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
    </footer>
  );
}
