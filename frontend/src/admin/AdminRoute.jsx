import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) return <div>Loading...</div>

  if (!isAuthenticated || !user || user.role !== 'admin') {
    return <Navigate to='/dang-nhap' replace />
  }

  return children
}

export default AdminRoute
