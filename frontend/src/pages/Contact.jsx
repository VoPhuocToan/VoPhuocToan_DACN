import React, { useState } from 'react'
import './Contact.css'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setSubmitStatus(null)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSubmitStatus({
          type: 'success',
          message: data.message
        })
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        })
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.message || 'Có lỗi xảy ra, vui lòng thử lại'
        })
      }
    } catch (error) {
      console.error('Contact form error:', error)
      setSubmitStatus({
        type: 'error',
        message: 'Không thể kết nối đến server. Vui lòng thử lại sau.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='contact-page'>
      <div className='contact-header'>
        <h1>Liên Hệ Với Chúng Tôi</h1>
        <p>Chúng tôi luôn sẵn sàng lắng nghe ý kiến của bạn</p>
      </div>

      <div className='contact-container'>
        {/* Contact Info */}
        <div className='contact-info-section'>
          <div className='info-card'>
            <div className='info-icon'>
              <i className='fi fi-rr-phone-call'></i>
            </div>
            <div className='info-content'>
              <h3>Gọi cho chúng tôi</h3>
              <p className='info-text'>
                <strong>Hotline:</strong> 1800 6928
              </p>
              <p className='info-text'>
                <strong>Giờ làm việc:</strong> 8:00 - 22:00 (T2-CN)
              </p>
            </div>
          </div>

          <div className='info-card'>
            <div className='info-icon'>
              <i className='fi fi-rr-envelope'></i>
            </div>
            <div className='info-content'>
              <h3>Gửi email cho chúng tôi</h3>
              <p className='info-text'>
                support@healthycare.vn
              </p>
              <p className='info-text'>
                info@healthycare.vn
              </p>
            </div>
          </div>

          <div className='info-card'>
            <div className='info-icon'>
              <i className='fi fi-rr-marker'></i>
            </div>
            <div className='info-content'>
              <h3>Địa chỉ</h3>
              <p className='info-text'>
                123 Đường Nguyễn Huệ, Quận 1,
              </p>
              <p className='info-text'>
                Thành phố Hồ Chí Minh, Việt Nam
              </p>
            </div>
          </div>

          <div className='info-card'>
            <div className='info-icon'>
              <i className='fi fi-brands-facebook'></i>
            </div>
            <div className='info-content'>
              <h3>Theo dõi chúng tôi</h3>
              <div className='social-links'>
                <a href='#' title='Facebook'>Facebook</a>
                <a href='#' title='Instagram'>Instagram</a>
                <a href='#' title='YouTube'>YouTube</a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className='contact-form-section'>
          <h2>Gửi tin nhắn cho chúng tôi</h2>
          <p className='form-subtitle'>Vui lòng điền đầy đủ thông tin để chúng tôi có thể phục vụ bạn tốt hơn</p>

          {submitStatus && (
            <div className={`status-message ${submitStatus.type}`}>
              <i className={`fi ${submitStatus.type === 'success' ? 'fi-rr-check' : 'fi-rr-exclamation'}`}></i>
              <p>{submitStatus.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className='contact-form'>
            <div className='form-group'>
              <label htmlFor='name'>Họ và Tên *</label>
              <input
                type='text'
                id='name'
                name='name'
                value={formData.name}
                onChange={handleChange}
                placeholder='Nhập tên của bạn'
                required
                disabled={isLoading}
              />
            </div>

            <div className='form-row'>
              <div className='form-group'>
                <label htmlFor='email'>Email *</label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='your@email.com'
                  required
                  disabled={isLoading}
                />
              </div>

              <div className='form-group'>
                <label htmlFor='phone'>Số điện thoại</label>
                <input
                  type='tel'
                  id='phone'
                  name='phone'
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder='0901234567'
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className='form-group'>
              <label htmlFor='subject'>Tiêu đề *</label>
              <input
                type='text'
                id='subject'
                name='subject'
                value={formData.subject}
                onChange={handleChange}
                placeholder='Vấn đề của bạn'
                required
                disabled={isLoading}
              />
            </div>

            <div className='form-group'>
              <label htmlFor='message'>Nội dung tin nhắn *</label>
              <textarea
                id='message'
                name='message'
                value={formData.message}
                onChange={handleChange}
                placeholder='Vui lòng mô tả chi tiết vấn đề của bạn...'
                rows='6'
                required
                disabled={isLoading}
              ></textarea>
            </div>

            <button 
              type='submit' 
              className='submit-btn'
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className='spinner'></span>
                  Đang gửi...
                </>
              ) : (
                <>
                  <i className='fi fi-rr-paper-plane'></i>
                  Gửi tin nhắn
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Map Section */}
      <div className='contact-map'>
        <h2>Vị trí của chúng tôi</h2>
        <iframe
          src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.248179346126!2d106.68299!3d10.772619!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3a5b5a5b5b%3A0x5b5b5b5b5b5b5b5b!2s123%20Nguyen%20Hue%20Boulevard%2C%20District%201%2C%20Ho%20Chi%20Minh%20City!5e0!3m2!1sen!2s!4v1234567890'
          width='100%'
          height='400'
          style={{ border: 0, borderRadius: '8px' }}
          allowFullScreen=''
          loading='lazy'
          referrerPolicy='no-referrer-when-downgrade'
        ></iframe>
      </div>
    </div>
  )
}

export default Contact
