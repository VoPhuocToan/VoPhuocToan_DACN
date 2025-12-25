import React, { useEffect, useState } from 'react'
import { useStore } from '../context/StoreContext'
import { useNavigate } from 'react-router-dom'
import '../styles/Dashboard.css'

const Dashboard = () => {
  const { token, API_URL, fetchWithAuth } = useStore()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalRevenue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      fetchStats()
    }
  }, [token])

  const fetchStats = async () => {
    if (!token) return
    
    try {
      const [productsRes, categoriesRes, ordersStatsRes] = await Promise.all([
        fetch(`${API_URL}/products?pageSize=1000`),
        fetch(`${API_URL}/categories`),
        fetchWithAuth(`${API_URL}/orders/stats`)
      ])

      if (!ordersStatsRes) return; // Auth failed

      const productsData = await productsRes.json()
      const categoriesData = await categoriesRes.json()
      const ordersStatsData = await ordersStatsRes.json()

      const orderStats = ordersStatsData.data?.summary || {}

      setStats({
        totalProducts: productsData.data?.length || 0,
        totalCategories: categoriesData.data?.length || 0,
        totalOrders: orderStats.total || 0,
        totalRevenue: orderStats.totalRevenue || 0,
        pendingOrders: orderStats.pending || 0,
        processingOrders: orderStats.processing || 0,
        deliveredOrders: orderStats.delivered || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='dashboard'>
      {/* Header Section */}
      <div className='dashboard-header'>
        <div className='header-content'>
          <div className='welcome-section'>
            <h1>👋 Chào mừng trở lại!</h1>
            <p className='dashboard-subtitle'>Tổng quan hoạt động kinh doanh hôm nay</p>
          </div>
          <div className='header-actions'>
            <button className='btn-action btn-revenue' onClick={() => navigate('/revenue')}>
              <span className='btn-icon'>💰</span>
              <span>Xem doanh thu</span>
            </button>
            <button className='btn-action btn-orders' onClick={() => navigate('/orders')}>
              <span className='btn-icon'>📦</span>
              <span>Quản lý đơn hàng</span>
            </button>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className='loading-state'>
          <div className='spinner'></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          {/* KPI Cards - Top Priority (Góc trên trái) */}
          <div className='kpi-section'>
            <div className='kpi-grid'>
              {/* Card 1: Tổng doanh thu - Quan trọng nhất */}
              <div className='kpi-card card-primary'>
                <div className='kpi-header'>
                  <div className='kpi-icon revenue-icon'>
                    <span>💰</span>
                  </div>
                  <div className='kpi-trend positive'>
                    <span className='trend-icon'>↗</span>
                    <span className='trend-value'>+12%</span>
                  </div>
                </div>
                <div className='kpi-content'>
                  <h3 className='kpi-label'>Tổng doanh thu</h3>
                  <p className='kpi-value'>{(stats.totalRevenue / 1000000).toFixed(1)}M đ</p>
                  <p className='kpi-subtitle'>TB: {stats.totalOrders > 0 ? Math.round(stats.totalRevenue / stats.totalOrders / 1000) : 0}k đ/đơn</p>
                </div>
              </div>

              {/* Card 2: Tổng đơn hàng */}
              <div className='kpi-card card-success'>
                <div className='kpi-header'>
                  <div className='kpi-icon orders-icon'>
                    <span>🛒</span>
                  </div>
                  <div className='kpi-trend positive'>
                    <span className='trend-icon'>↗</span>
                    <span className='trend-value'>+8%</span>
                  </div>
                </div>
                <div className='kpi-content'>
                  <h3 className='kpi-label'>Tổng đơn hàng</h3>
                  <p className='kpi-value'>{stats.totalOrders}</p>
                  <p className='kpi-subtitle'>{stats.pendingOrders || 0} đơn chờ xác nhận</p>
                </div>
              </div>

              {/* Card 3: Sản phẩm */}
              <div className='kpi-card card-info'>
                <div className='kpi-header'>
                  <div className='kpi-icon products-icon'>
                    <span>📦</span>
                  </div>
                  <div className='kpi-trend neutral'>
                    <span className='trend-icon'>→</span>
                    <span className='trend-value'>0%</span>
                  </div>
                </div>
                <div className='kpi-content'>
                  <h3 className='kpi-label'>Sản phẩm</h3>
                  <p className='kpi-value'>{stats.totalProducts}</p>
                  <p className='kpi-subtitle'>{stats.totalCategories} danh mục</p>
                </div>
              </div>

              {/* Card 4: Doanh thu hôm nay */}
              <div className='kpi-card card-warning'>
                <div className='kpi-header'>
                  <div className='kpi-icon today-icon'>
                    <span>📈</span>
                  </div>
                  <div className='kpi-trend neutral'>
                    <span className='trend-icon'>→</span>
                    <span className='trend-value'>0%</span>
                  </div>
                </div>
                <div className='kpi-content'>
                  <h3 className='kpi-label'>Doanh thu hôm nay</h3>
                  <p className='kpi-value'>0 đ</p>
                  <p className='kpi-subtitle'>Chưa có đơn hôm nay</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className='charts-container'>
            <div className='chart-row'>
              {/* Revenue & Orders Trend Chart */}
              <div className='chart-card chart-large'>
                <div className='chart-header'>
                  <div className='chart-title'>
                    <span className='chart-icon'>📊</span>
                    <h3>Xu hướng doanh thu & đơn hàng</h3>
                  </div>
                  <div className='chart-filters'>
                    <button className='filter-btn active'>7 ngày</button>
                    <button className='filter-btn'>30 ngày</button>
                    <button className='filter-btn'>90 ngày</button>
                  </div>
                </div>
                <div className='chart-body'>
                  <div className='chart-placeholder'>
                    <div className='chart-empty-state'>
                      <span className='empty-icon'>📈</span>
                      <p>Biểu đồ xu hướng sẽ hiển thị ở đây</p>
                      <small>Dữ liệu được cập nhật theo thời gian thực</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Brands Chart */}
              <div className='chart-card chart-small'>
                <div className='chart-header'>
                  <div className='chart-title'>
                    <span className='chart-icon'>🏆</span>
                    <h3>Top thương hiệu</h3>
                  </div>
                </div>
                <div className='chart-body'>
                  <div className='brands-list'>
                    <div className='brand-item'>
                      <div className='brand-info'>
                        <span className='brand-rank'>1</span>
                        <span className='brand-name'>Blackmores</span>
                      </div>
                      <div className='brand-stats'>
                        <span className='brand-value'>24.5%</span>
                      </div>
                    </div>
                    <div className='brand-item'>
                      <div className='brand-info'>
                        <span className='brand-rank'>2</span>
                        <span className='brand-name'>Nature Made</span>
                      </div>
                      <div className='brand-stats'>
                        <span className='brand-value'>18.3%</span>
                      </div>
                    </div>
                    <div className='brand-item'>
                      <div className='brand-info'>
                        <span className='brand-rank'>3</span>
                        <span className='brand-name'>GNC</span>
                      </div>
                      <div className='brand-stats'>
                        <span className='brand-value'>15.7%</span>
                      </div>
                    </div>
                    <div className='brand-item'>
                      <div className='brand-info'>
                        <span className='brand-rank'>4</span>
                        <span className='brand-name'>Swisse</span>
                      </div>
                      <div className='brand-stats'>
                        <span className='brand-value'>12.1%</span>
                      </div>
                    </div>
                    <div className='brand-item'>
                      <div className='brand-info'>
                        <span className='brand-rank'>5</span>
                        <span className='brand-name'>Khác</span>
                      </div>
                      <div className='brand-stats'>
                        <span className='brand-value'>29.4%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className='activity-card'>
              <div className='activity-header'>
                <div className='activity-title'>
                  <span className='activity-icon'>🔔</span>
                  <h3>Hoạt động gần đây</h3>
                </div>
                <button className='view-all-btn'>Xem tất cả</button>
              </div>
              <div className='activity-list'>
                <div className='activity-item'>
                  <div className='activity-dot success'></div>
                  <div className='activity-content'>
                    <p className='activity-text'>Đơn hàng mới <strong>#ORD-{String(Date.now()).slice(-6)}</strong> đã được tạo</p>
                    <span className='activity-time'>5 phút trước</span>
                  </div>
                </div>
                <div className='activity-item'>
                  <div className='activity-dot info'></div>
                  <div className='activity-content'>
                    <p className='activity-text'>Sản phẩm <strong>Vitamin C 1000mg</strong> đã được cập nhật</p>
                    <span className='activity-time'>1 giờ trước</span>
                  </div>
                </div>
                <div className='activity-item'>
                  <div className='activity-dot warning'></div>
                  <div className='activity-content'>
                    <p className='activity-text'>Sản phẩm <strong>Omega-3</strong> sắp hết hàng</p>
                    <span className='activity-time'>2 giờ trước</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard
