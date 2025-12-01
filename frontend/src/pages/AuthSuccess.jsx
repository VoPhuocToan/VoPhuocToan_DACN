import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const AuthSuccess = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')
    
    if (token) {
      // Decode token to get user info
      try {
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))
        
        const payload = JSON.parse(jsonPayload)
        
        // Save token
        localStorage.setItem('token', token)
        
        // Fetch user details from API
        fetchUserDetails(token)
      } catch (error) {
        console.error('Error decoding token:', error)
        navigate('/dang-nhap')
      }
    } else {
      navigate('/dang-nhap')
    }
  }, [searchParams, navigate])

  const fetchUserDetails = async (token) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const response = await fetch(`${apiUrl}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      
      if (data.success && data.data) {
        // Save user info
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
        navigate('/dang-nhap')
      }
    } catch (error) {
      console.error('Error fetching user details:', error)
      navigate('/dang-nhap')
    }
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #0056d2',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p style={{ fontSize: '18px', color: '#666' }}>Đang đăng nhập...</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default AuthSuccess
