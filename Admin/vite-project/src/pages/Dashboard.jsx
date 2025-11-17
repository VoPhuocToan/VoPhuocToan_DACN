import React, { useEffect, useState } from 'react'
import { useStore } from '../context/StoreContext'
import '../styles/Dashboard.css'

const Dashboard = () => {
  const { token, API_URL } = useStore()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalRevenue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [productsRes, categoriesRes, ordersRes] = await Promise.all([
        fetch(`${API_URL}/products?pageSize=1000`),
        fetch(`${API_URL}/categories`),
        fetch(`${API_URL}/orders`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      const productsData = await productsRes.json()
      const categoriesData = await categoriesRes.json()
      const ordersData = await ordersRes.json()

      setStats({
        totalProducts: productsData.data?.length || 0,
        totalCategories: categoriesData.data?.length || 0,
        totalOrders: ordersData.data?.length || 0,
        totalRevenue: ordersData.data?.reduce((sum, order) => sum + (order.totalPrice || 0), 0) || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='dashboard'>
      <h1>Bảng Điều Khiển</h1>
      
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className='stats-grid'>
          <div className='stat-card'>
            <h3>📦 Sản phẩm</h3>
            <p className='stat-value'>{stats.totalProducts}</p>
          </div>
          <div className='stat-card'>
            <h3>📁 Danh mục</h3>
            <p className='stat-value'>{stats.totalCategories}</p>
          </div>
          <div className='stat-card'>
            <h3>🛒 Đơn hàng</h3>
            <p className='stat-value'>{stats.totalOrders}</p>
          </div>
          <div className='stat-card'>
            <h3>💰 Doanh thu</h3>
            <p className='stat-value'>{(stats.totalRevenue / 1000000).toFixed(1)}M</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
