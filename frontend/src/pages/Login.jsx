import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError(null)
  }

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Vui lòng điền đầy đủ email và mật khẩu')
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

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setError(null)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
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
          avatar: data.data.avatar,
          role: data.data.role
        }))

        // Dispatch event to notify other components
        window.dispatchEvent(new Event('userLogin'))

        // Redirect to home
        navigate('/')
      } else {
        setError(data.message || 'Đăng nhập thất bại')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Không thể kết nối đến server. Vui lòng thử lại sau.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    // Redirect browser to backend OAuth endpoint which will redirect back with token
    window.location.href = `${apiUrl}/api/auth/${provider}`
  }

  return (
    <div className='login-page'>
      <div className='login-container'>
        <div className='login-card'>
          <div className='login-header'>
            <h1>Đăng Nhập</h1>
            <p>Chào mừng trở lại HealthyCare</p>
          </div>

          {error && (
            <div className='error-message'>
              <i className='fi fi-rr-exclamation'></i>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className='login-form'>
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
            </div>

            <div className='form-options'>
              <label className='remember-me'>
                <input type='checkbox' disabled={isLoading} />
                <span>Nhớ tôi</span>
              </label>
              <Link to='#' className='forgot-password'>
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type='submit'
              className='login-btn'
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className='spinner'></span>
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  <i className='fi fi-rr-login'></i>
                  Đăng Nhập
                </>
              )}
            </button>
          </form>

          <div className='divider'>
            <span>hoặc</span>
          </div>

          <div className='social-login'>
            <button className='social-btn google-full' disabled={isLoading} onClick={() => handleSocialLogin('google')}>
              <i className='fi fi-brands-google'></i>
              Đăng nhập với Google
            </button>
          </div>

          <div className='login-footer'>
            <p>Chưa có tài khoản? <Link to='/dang-ky'>Đăng ký ngay</Link></p>
          </div>
        </div>

        <div className='login-illustration'>
          <div className='illustration-content'>
            <div className='illustration-icon'>
              <i className='fi fi-rr-user'></i>
            </div>
            <h2>Quản Lý Sức Khỏe</h2>
            <p>Đăng nhập để theo dõi các sản phẩm yêu thích, lịch sử mua hàng và nhận ưu đãi độc quyền.</p>
            
            <div className='benefits-list'>
              <div className='benefit-item'>
                <i className='fi fi-rr-check'></i>
                <span>Quản lý đơn hàng dễ dàng</span>
              </div>
              <div className='benefit-item'>
                <i className='fi fi-rr-check'></i>
                <span>Nhận khuyến mãi độc quyền</span>
              </div>
              <div className='benefit-item'>
                <i className='fi fi-rr-check'></i>
                <span>Lưu địa chỉ giao hàng</span>
              </div>
              <div className='benefit-item'>
                <i className='fi fi-rr-check'></i>
                <span>Tư vấn cá nhân từ AI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
