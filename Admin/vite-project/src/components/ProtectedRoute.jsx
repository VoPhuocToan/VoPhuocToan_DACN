import React from 'react'
import { Navigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useStore()

  if (loading) return <div>Loading...</div>

  if (!isAuthenticated || !user || user.role !== 'admin') {
    return <Navigate to='/login' replace />
  }

  return children
}

export default ProtectedRoute
