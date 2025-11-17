import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Register.css'

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError(null)
  }

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc')
      return false
    }

    if (formData.name.length < 3) {
      setError('Tên phải có ít nhất 3 ký tự')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Email không hợp lệ')
      return false
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      return false
    }

    if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      setError('Số điện thoại không hợp lệ')
      return false
    }

    if (!agreeTerms) {
      setError('Vui lòng chấp nhận Điều khoản sử dụng')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setError(null)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          password: formData.password
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Save token & user info
        localStorage.setItem('token', data.data.token)
        localStorage.setItem('user', JSON.stringify({
          _id: data.data._id,
          name: data.data.name,
          email: data.data.email,
          phone: data.data.phone,
          role: data.data.role
        }))

        // Dispatch event to notify other components
        window.dispatchEvent(new Event('userLogin'))

        // Redirect to home
        navigate('/')
      } else {
        setError(data.message || 'Đăng ký thất bại')
      }
    } catch (error) {
      console.error('Register error:', error)
      setError('Không thể kết nối đến server. Vui lòng thử lại sau.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='register-page'>
      <div className='register-container'>
        <div className='register-illustration'>
          <div className='illustration-content'>
            <div className='illustration-icon'>
              <i className='fi fi-rr-user-add'></i>
            </div>
            <h2>Tham Gia HealthyCare</h2>
            <p>Mở khóa các lợi ích độc quyền và trở thành một phần của cộng đồng sức khỏe.</p>
            
            <div className='benefits-list'>
              <div className='benefit-item'>
                <i className='fi fi-rr-check'></i>
                <span>Mua hàng nhanh chóng</span>
              </div>
              <div className='benefit-item'>
                <i className='fi fi-rr-check'></i>
                <span>Ưu đãi thành viên</span>
              </div>
              <div className='benefit-item'>
                <i className='fi fi-rr-check'></i>
                <span>Hỗ trợ 24/7</span>
              </div>
              <div className='benefit-item'>
                <i className='fi fi-rr-check'></i>
                <span>Tích điểm thưởng</span>
              </div>
            </div>
          </div>
        </div>

        <div className='register-card'>
          <div className='register-header'>
            <h1>Đăng Ký</h1>
            <p>Tạo tài khoản mới để bắt đầu</p>
          </div>

          {error && (
            <div className='error-message'>
              <i className='fi fi-rr-exclamation'></i>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className='register-form'>
            <div className='form-group'>
              <label htmlFor='name'>
                <i className='fi fi-rr-user'></i>
                Họ và Tên
              </label>
              <input
                type='text'
                id='name'
                name='name'
                value={formData.name}
                onChange={handleChange}
                placeholder='Nhập tên của bạn'
                disabled={isLoading}
              />
            </div>

            <div className='form-group'>
              <label htmlFor='email'>
                <i className='fi fi-rr-envelope'></i>
                Email
              </label>
              <input
                type='email'
                id='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                placeholder='your@email.com'
                disabled={isLoading}
              />
            </div>

            <div className='form-group'>
              <label htmlFor='phone'>
                <i className='fi fi-rr-phone-call'></i>
                Số Điện Thoại (Tùy chọn)
              </label>
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

            <div className='form-group'>
              <label htmlFor='password'>
                <i className='fi fi-rr-lock'></i>
                Mật Khẩu
              </label>
              <div className='password-input-wrapper'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id='password'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  placeholder='••••••••'
                  disabled={isLoading}
                />
                <button
                  type='button'
                  className='toggle-password'
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex='-1'
                >
                  <i className={`fi fi-rr-${showPassword ? 'eye' : 'eye-crossed'}`}></i>
                </button>
              </div>
              <span className='password-hint'>
                Ít nhất 6 ký tự
              </span>
            </div>

            <div className='form-group'>
              <label htmlFor='confirmPassword'>
                <i className='fi fi-rr-lock'></i>
                Xác Nhận Mật Khẩu
              </label>
              <div className='password-input-wrapper'>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id='confirmPassword'
                  name='confirmPassword'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder='••••••••'
                  disabled={isLoading}
                />
                <button
                  type='button'
                  className='toggle-password'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex='-1'
                >
                  <i className={`fi fi-rr-${showConfirmPassword ? 'eye' : 'eye-crossed'}`}></i>
                </button>
              </div>
            </div>

            <label className='agree-terms'>
              <input
                type='checkbox'
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                disabled={isLoading}
              />
              <span>
                Tôi đồng ý với <Link to='#'>Điều khoản sử dụng</Link> và <Link to='#'>Chính sách bảo mật</Link>
              </span>
            </label>

            <button
              type='submit'
              className='register-btn'
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className='spinner'></span>
                  Đang đăng ký...
                </>
              ) : (
                <>
                  <i className='fi fi-rr-user-add'></i>
                  Đăng Ký
                </>
              )}
            </button>
          </form>

          <div className='register-footer'>
            <p>Đã có tài khoản? <Link to='/dang-nhap'>Đăng nhập ngay</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
