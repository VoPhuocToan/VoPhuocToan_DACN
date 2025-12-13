import React, { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [token, setToken] = useState(null)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (savedToken && savedUser) {
      try {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setIsLoading(false)
  }, [])

  // Auto logout after 1 minute of inactivity
  useEffect(() => {
    if (!token) return

    let timeoutId

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        logout()
        alert('Phiên đăng nhập đã hết hạn do không hoạt động')
        window.location.href = '/login'
      }, 60000) // 1 minute
    }

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    events.forEach(event => {
      document.addEventListener(event, resetTimer, true)
    })

    resetTimer() // Start timer

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      events.forEach(event => {
        document.removeEventListener(event, resetTimer, true)
      })
    }
  }, [token])

  // Listen for login events
  useEffect(() => {
    const handleLogin = () => {
      const savedToken = localStorage.getItem('token')
      const savedUser = localStorage.getItem('user')

      if (savedToken && savedUser) {
        try {
          setToken(savedToken)
          setUser(JSON.parse(savedUser))
        } catch (error) {
          console.error('Error parsing saved user:', error)
        }
      }
    }

    window.addEventListener('userLogin', handleLogin)
    return () => window.removeEventListener('userLogin', handleLogin)
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('userId')
    setUser(null)
    setToken(null)
  }

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
