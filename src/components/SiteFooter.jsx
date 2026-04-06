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
  const mapQuery = encodeURIComponent(
    "12 Nguyễn Văn Bảo, Phường Hạnh Thông, TP.HCM",
  );

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
                <Link to={PATH.home}>Trang chủ</Link>
              </li>
              <li>
                <Link to={PATH.home}>Bó hoa</Link>
              </li>
              <li>
                <Link to={PATH.home}>Khuyến mãi</Link>
              </li>
              <li>
                <Link to={PATH.home}>Hoa chậu</Link>
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
                <Link to={PATH.about}>Giới thiệu</Link>
              </li>
              <li>
                <Link to={PATH.privacy}>Chính sách bảo mật</Link>
              </li>
              <li>
                <Link to={PATH.terms}>Điều khoản dịch vụ</Link>
              </li>
              <li>
                <Link to={PATH.buyingGuide}>Hướng dẫn mua</Link>
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
                  <p>+84 345749384</p>
                </div>
              </div>
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <div>
                  <span className="contact-label">Email</span>
                  <p>phamminhthinh2005@gmail.com</p>
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
            <div className="map-wrap mt-4">
              <iframe
                title="Google Map - vị trí cửa hàng"
                className="map-embed"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              />
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
            <div className="col-12 col-md-6 text-center text-md-end">
              <p className="footer-credit">
                Made with{" "}
                <FaHeart className="heart" style={{ display: "inline" }} />{" "}
                for flower lovers
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
