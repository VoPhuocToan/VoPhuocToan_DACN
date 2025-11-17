import React, { useEffect, useState } from 'react'
import './admin.css'

const AdminDashboard = () => {
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
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const token = localStorage.getItem('token')

      const [productsRes, categoriesRes, ordersRes] = await Promise.all([
        fetch(`${apiUrl}/api/products?pageSize=1`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${apiUrl}/api/categories`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${apiUrl}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` }
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
    <div className='admin-dashboard'>
      <div className='admin-header'>
        <h1>Bảng Điều Khiển Admin</h1>
        <p>Chào mừng quay trở lại! Đây là tổng quan về dự án của bạn.</p>
      </div>

      {loading ? (
        <p>Đang tải thống kê...</p>
      ) : (
        <div className='stats-grid'>
          <div className='stat-card'>
            <div className='stat-icon products'>
              <i className='fi fi-rr-package'></i>
            </div>
            <div className='stat-content'>
              <h3>Sản phẩm</h3>
              <p className='stat-value'>{stats.totalProducts}</p>
              <span className='stat-label'>Tổng sản phẩm</span>
            </div>
          </div>

          <div className='stat-card'>
            <div className='stat-icon categories'>
              <i className='fi fi-rr-list'></i>
            </div>
            <div className='stat-content'>
              <h3>Danh mục</h3>
              <p className='stat-value'>{stats.totalCategories}</p>
              <span className='stat-label'>Tổng danh mục</span>
            </div>
          </div>

          <div className='stat-card'>
            <div className='stat-icon orders'>
              <i className='fi fi-rr-shopping-cart'></i>
            </div>
            <div className='stat-content'>
              <h3>Đơn hàng</h3>
              <p className='stat-value'>{stats.totalOrders}</p>
              <span className='stat-label'>Tổng đơn hàng</span>
            </div>
          </div>

          <div className='stat-card'>
            <div className='stat-icon revenue'>
              <i className='fi fi-rr-money'></i>
            </div>
            <div className='stat-content'>
              <h3>Doanh thu</h3>
              <p className='stat-value'>{(stats.totalRevenue / 1000000).toFixed(1)}M</p>
              <span className='stat-label'>Tổng doanh thu</span>
            </div>
          </div>
        </div>
      )}

      <div className='admin-section'>
        <h2>Hướng dẫn sử dụng</h2>
        <div className='guide-cards'>
          <div className='guide-card'>
            <i className='fi fi-rr-cube'></i>
            <h3>Quản lý sản phẩm</h3>
            <p>Thêm, sửa, xóa sản phẩm từ bảng điều khiển</p>
          </div>
          <div className='guide-card'>
            <i className='fi fi-rr-folder'></i>
            <h3>Quản lý danh mục</h3>
            <p>Tạo và quản lý các danh mục sản phẩm</p>
          </div>
          <div className='guide-card'>
            <i className='fi fi-rr-document'></i>
            <h3>Quản lý đơn hàng</h3>
            <p>Theo dõi và cập nhật trạng thái đơn hàng</p>
          </div>
          <div className='guide-card'>
            <i className='fi fi-rr-info'></i>
            <h3>Hỗ trợ</h3>
            <p>Liên hệ với đội hỗ trợ nếu cần trợ giúp</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
