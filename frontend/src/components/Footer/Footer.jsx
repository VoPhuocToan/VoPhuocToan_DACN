import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const [showZaloQR, setShowZaloQR] = useState(false)

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
            <a href='https://www.facebook.com/phuoctoan1103/' target='_blank' rel='noopener noreferrer' className='social-link' title='Facebook'>
              <i className='fi fi-brands-facebook'></i>
            </a>
            <a href='https://www.instagram.com/phuoc.toan.52090/' target='_blank' rel='noopener noreferrer' className='social-link' title='Instagram'>
              <i className='fi fi-brands-instagram'></i>
            </a>
            <button onClick={() => setShowZaloQR(true)} className='social-link social-btn' title='Zalo'>
              <span style={{fontSize: '1.2rem'}}>💬</span>
            </button>
          </div>
        </div>

        {/* Products Section */}
        <div className='footer-section'>
          <h4 className='footer-title'>Sản phẩm</h4>
          <ul className='footer-links'>
            <li><Link to='/thuc-pham-chuc-nang'>Tất cả sản phẩm</Link></li>
            <li><Link to='/thuc-pham-chuc-nang?category=Vitamin %26 Khoáng chất'>Vitamin & Khoáng chất</Link></li>
            <li><Link to='/thuc-pham-chuc-nang?category=Hỗ trợ tiêu hóa'>Hỗ trợ tiêu hóa</Link></li>
            <li><Link to='/thuc-pham-chuc-nang?category=Sức khỏe tim mạch'>Hỗ trợ Tim mạch</Link></li>
            <li><Link to='/thuc-pham-chuc-nang?category=Hỗ trợ điều trị'>Hỗ trợ Xương khớp</Link></li>
            <li><Link to='/thuc-pham-chuc-nang?category=Hỗ trợ làm đẹp'>Hỗ trợ Làm đẹp</Link></li>
          </ul>
        </div>

        {/* Customer Service Section */}
        <div className='footer-section'>
          <h4 className='footer-title'>Hỗ trợ khách hàng</h4>
          <ul className='footer-links'>
            <li><Link to='/lien-he'>Liên hệ chúng tôi</Link></li>
            <li><Link to='/dieu-khoan-su-dung'>Điều khoản sử dụng</Link></li>
            <li><Link to='/huong-dan-mua-hang'>Hướng dẫn mua hàng</Link></li>
            <li><Link to='/chinh-sach-doi-tra'>Chính sách đổi trả</Link></li>
            <li><Link to='/cau-hoi-thuong-gap'>Câu hỏi thường gặp</Link></li>
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
                <p className='contact-value'>0355671458</p>
              </div>
            </div>
            <div className='contact-item'>
              <i className='fi fi-rr-envelope'></i>
              <div>
                <p className='contact-label'>Email</p>
                <p className='contact-value'>tonvo1103@gmail.com</p>
              </div>
            </div>
            <div className='contact-item'>
              <i className='fi fi-rr-marker'></i>
              <div>
                <p className='contact-label'>Địa chỉ</p>
                <p className='contact-value'>Số 145, Đường Đồng Khởi, Khóm 1, Phường 9, Thành Phố Trà Vinh, Tỉnh Vĩnh Long</p>
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

      {/* Zalo QR Code Modal */}
      {showZaloQR && (
        <div className='zalo-qr-modal' onClick={() => setShowZaloQR(false)}>
          <div className='zalo-qr-content' onClick={(e) => e.stopPropagation()}>
            <button className='close-modal' onClick={() => setShowZaloQR(false)}>
              <i className='fi fi-rr-cross'></i>
            </button>
            <h3>Quét mã QR để chat Zalo</h3>
            <div className='qr-code-container'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
                <rect width="200" height="200" fill="white"/>
                <rect x="10" y="10" width="30" height="30" fill="black"/>
                <rect x="160" y="10" width="30" height="30" fill="black"/>
                <rect x="10" y="160" width="30" height="30" fill="black"/>
                <rect x="50" y="20" width="10" height="10" fill="black"/>
                <rect x="70" y="20" width="10" height="10" fill="black"/>
                <rect x="90" y="20" width="10" height="10" fill="black"/>
                <rect x="20" y="50" width="10" height="10" fill="black"/>
                <rect x="20" y="70" width="10" height="10" fill="black"/>
                <rect x="20" y="90" width="10" height="10" fill="black"/>
                <rect x="170" y="50" width="10" height="10" fill="black"/>
                <rect x="170" y="70" width="10" height="10" fill="black"/>
                <text x="100" y="105" fontSize="14" textAnchor="middle" fill="black">ZALO</text>
              </svg>
            </div>
            <p className='qr-note'>Vui lòng tải hình QR code từ Zalo và thay thế trong code</p>
            <p className='qr-instruction'>Hoặc liên hệ: 0355671458</p>
          </div>
        </div>
      )}
    </footer>
  )
}

export default Footer
