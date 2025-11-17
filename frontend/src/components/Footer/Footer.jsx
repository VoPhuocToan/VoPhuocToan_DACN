import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className='footer'>
      <div className='footer-container'>
        {/* About Section */}
        <div className='footer-section'>
          <h4 className='footer-title'>Về HealthyCare</h4>
          <p className='footer-description'>
            HealthyCare là nhà thuốc chuyên cung cấp các sản phẩm thực phẩm chức năng, 
            vitamin, khoáng chất chất lượng cao, giúp bạn nâng cao sức khỏe và chất lượng cuộc sống.
          </p>
          <div className='footer-social'>
            <a href='#' className='social-link' title='Facebook'>
              <i className='fi fi-brands-facebook'></i>
            </a>
            <a href='#' className='social-link' title='Instagram'>
              <i className='fi fi-brands-instagram'></i>
            </a>
            <a href='#' className='social-link' title='YouTube'>
              <i className='fi fi-brands-youtube'></i>
            </a>
            <a href='#' className='social-link' title='Zalo'>
              <i className='fi fi-brands-linkedin'></i>
            </a>
          </div>
        </div>

        {/* Products Section */}
        <div className='footer-section'>
          <h4 className='footer-title'>Sản phẩm</h4>
          <ul className='footer-links'>
            <li><Link to='/thuc-pham-chuc-nang'>Tất cả sản phẩm</Link></li>
            <li><a href='#'>Vitamin & Khoáng chất</a></li>
            <li><a href='#'>Hỗ trợ tiêu hóa</a></li>
            <li><a href='#'>Hỗ trợ Tim mạch</a></li>
            <li><a href='#'>Hỗ trợ Xương khớp</a></li>
            <li><a href='#'>Hỗ trợ Làm đẹp</a></li>
          </ul>
        </div>

        {/* Customer Service Section */}
        <div className='footer-section'>
          <h4 className='footer-title'>Hỗ trợ khách hàng</h4>
          <ul className='footer-links'>
            <li><a href='/lien-he'>Liên hệ chúng tôi</a></li>
            <li><a href='#'>Chính sách bảo mật</a></li>
            <li><a href='#'>Điều khoản sử dụng</a></li>
            <li><a href='#'>Hướng dẫn mua hàng</a></li>
            <li><a href='#'>Chính sách đổi trả</a></li>
            <li><a href='#'>Câu hỏi thường gặp</a></li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className='footer-section'>
          <h4 className='footer-title'>Liên hệ</h4>
          <div className='contact-info'>
            <div className='contact-item'>
              <i className='fi fi-rr-phone-call'></i>
              <div>
                <p className='contact-label'>Hotline</p>
                <p className='contact-value'>1800 6928</p>
              </div>
            </div>
            <div className='contact-item'>
              <i className='fi fi-rr-envelope'></i>
              <div>
                <p className='contact-label'>Email</p>
                <p className='contact-value'>support@healthycare.vn</p>
              </div>
            </div>
            <div className='contact-item'>
              <i className='fi fi-rr-marker'></i>
              <div>
                <p className='contact-label'>Địa chỉ</p>
                <p className='contact-value'>123 Đường Nguyễn Huệ, Q.1, TP.HCM</p>
              </div>
            </div>
            <div className='contact-item'>
              <i className='fi fi-rr-clock'></i>
              <div>
                <p className='contact-label'>Giờ làm việc</p>
                <p className='contact-value'>8:00 - 22:00 (T2-CN)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className='footer-bottom'>
        <div className='footer-bottom-content'>
          <p className='copyright'>
            &copy; {currentYear} HealthyCare. Bảo lưu mọi quyền.
          </p>
          <div className='payment-methods'>
            <span className='payment-label'>Phương thức thanh toán:</span>
            <div className='payment-icons'>
              <span title='Visa'><i className='fi fi-brands-visa'></i></span>
              <span title='Mastercard'><i className='fi fi-brands-mastercard'></i></span>
              <span title='Momo'>💳</span>
              <span title='Bank Transfer'>🏦</span>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button 
        className='back-to-top' 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        title='Về đầu trang'
      >
        <i className='fi fi-rr-arrow-up'></i>
      </button>
    </footer>
  )
}

export default Footer
