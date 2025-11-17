import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import '../styles/Login.css'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useStore()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      setError('Vui lòng điền đầy đủ email và mật khẩu')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await login(formData.email, formData.password)
      
      if (result.success) {
        navigate('/')
      } else {
        setError(result.error || 'Đăng nhập thất bại')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Không thể kết nối đến server')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='login-page'>
      <div className='login-container'>
        <div className='login-card'>
          <h1>Admin Panel</h1>
          <p>Đăng nhập để quản lý dự án</p>

          {error && <div className='error-message'>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className='form-group'>
              <label>Email</label>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                placeholder='admin@healthycare.com'
                disabled={isLoading}
              />
            </div>

            <div className='form-group'>
              <label>Mật khẩu</label>
              <input
                type='password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                placeholder='••••••••'
                disabled={isLoading}
              />
            </div>

            <button type='submit' disabled={isLoading}>
              {isLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
            </button>
          </form>

          <div className='login-hint'>
            <p><strong>Demo Account:</strong></p>
            <p>Email: admin@healthycare.com</p>
            <p>Password: 123456</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
