import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const OAuthCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handle = async () => {
      const params = new URLSearchParams(window.location.search)
      const token = params.get('token')
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'

      if (!token) {
        navigate('/dang-nhap')
        return
      }

      try {
        localStorage.setItem('token', token)
        // Fetch user profile using token
        const res = await fetch(`${apiUrl}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const data = await res.json()
        if (res.ok && data.success) {
          localStorage.setItem('user', JSON.stringify(data.data))
          window.dispatchEvent(new Event('userLogin'))
          navigate('/')
        } else {
          // If profile fetch fails, still navigate to login
          navigate('/dang-nhap')
        }
      } catch (err) {
        console.error('OAuth callback error', err)
        navigate('/dang-nhap')
      }
    }

    handle()
  }, [navigate])

  return (
    <div style={{ padding: 40 }}>
      <h3>Đang xử lý đăng nhập...</h3>
    </div>
  )
}

export default OAuthCallback
