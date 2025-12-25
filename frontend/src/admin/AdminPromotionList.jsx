import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './admin.css'

const AdminPromotionList = () => {
  const navigate = useNavigate()
  const [promotions, setPromotions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchPromotions()
  }, [])

  const fetchPromotions = async () => {
    try {
      const token = localStorage.getItem('token')
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      
      const response = await fetch(`${apiUrl}/api/promotions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.success) {
        setPromotions(data.data)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Không thể tải danh sách khuyến mãi')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token')
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      
      const response = await fetch(`${apiUrl}/api/promotions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      })

      const data = await response.json()

      if (data.success) {
        fetchPromotions()
      } else {
        alert(data.message || 'Không thể cập nhật trạng thái')
      }
    } catch (err) {
      console.error(err)
      alert('Lỗi kết nối')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khuyến mãi này?')) {
      try {
        const token = localStorage.getItem('token')
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
        
        const response = await fetch(`${apiUrl}/api/promotions/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        const data = await response.json()

        if (data.success) {
          fetchPromotions()
        } else {
          alert(data.message || 'Không thể xóa khuyến mãi')
        }
      } catch (err) {
        console.error(err)
        alert('Lỗi khi xóa khuyến mãi')
      }
    }
  }

  // Calculate stats
  const now = new Date()
  const stats = {
    total: promotions.length,
    active: promotions.filter(p => p.isActive && new Date(p.startDate) <= now && new Date(p.endDate) >= now).length,
    upcoming: promotions.filter(p => new Date(p.startDate) > now).length,
    paused: promotions.filter(p => !p.isActive).length,
    expired: promotions.filter(p => new Date(p.endDate) < now).length
  }

  const filteredPromotions = promotions.filter(p => 
    p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <div className="admin-loading">Đang tải...</div>
  if (error) return <div className="admin-error">{error}</div>

  return (
    <div className="admin-content">
      <div className="admin-header">
        <h1>Quản lý Khuyến mãi</h1>
        <Link to="/admin/promotions/new" className="btn" style={{ textDecoration: 'none' }}>
          <i className="fi fi-rr-plus"></i> Thêm khuyến mãi
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e0e7ff', color: '#4f46e5' }}>
            <i className="fi fi-rr-apps"></i>
          </div>
          <div className="stat-content">
            <h3>TỔNG SỐ</h3>
            <div className="stat-value">{stats.total}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#d1fae5', color: '#059669' }}>
            <i className="fi fi-rr-check"></i>
          </div>
          <div className="stat-content">
            <h3>ĐANG HOẠT ĐỘNG</h3>
            <div className="stat-value">{stats.active}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
            <i className="fi fi-rr-hourglass-end"></i>
          </div>
          <div className="stat-content">
            <h3>SẮP DIỄN RA</h3>
            <div className="stat-value">{stats.upcoming}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>
            <i className="fi fi-rr-pause"></i>
          </div>
          <div className="stat-content">
            <h3>TẠM DỪNG</h3>
            <div className="stat-value">{stats.paused}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fee2e2', color: '#dc2626' }}>
            <i className="fi fi-rr-alarm-clock"></i>
          </div>
          <div className="stat-content">
            <h3>ĐÃ HẾT HẠN</h3>
            <div className="stat-value">{stats.expired}</div>
          </div>
        </div>
      </div>

      <div className="admin-filters">
        <div className="filter-group" style={{ flex: 1 }}>
          <i className="fi fi-rr-search" style={{ color: '#9ca3af' }}></i>
          <input
            type="text"
            placeholder="Tìm kiếm mã hoặc mô tả..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px' }}
          />
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã khuyến mãi</th>
              <th>Mô tả</th>
              <th>Loại giảm</th>
              <th>Giá trị</th>
              <th>Thời gian</th>
              <th>Đã dùng</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredPromotions.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center" style={{ padding: '20px', color: '#666' }}>
                  {searchTerm ? 'Không tìm thấy khuyến mãi phù hợp' : 'Chưa có khuyến mãi nào'}
                </td>
              </tr>
            ) : (
              filteredPromotions.map(promo => {
                const isExpired = new Date(promo.endDate) < now
                const isUpcoming = new Date(promo.startDate) > now
                
                let statusClass = 'delivered'
                let statusText = 'Đang hoạt động'
                
                if (!promo.isActive) {
                  statusClass = 'cancelled' // Using cancelled style for paused
                  statusText = 'Tạm dừng'
                } else if (isExpired) {
                  statusClass = 'cancelled'
                  statusText = 'Đã hết hạn'
                } else if (isUpcoming) {
                  statusClass = 'pending'
                  statusText = 'Sắp diễn ra'
                }

                return (
                  <tr key={promo._id}>
                    <td>
                      <span style={{ 
                        color: '#059669', 
                        background: '#d1fae5', 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        fontWeight: '600',
                        fontSize: '13px'
                      }}>
                        {promo.code}
                      </span>
                    </td>
                    <td>{promo.description}</td>
                    <td>
                      <span className="status-badge" style={{ background: '#f3f4f6', color: '#4b5563' }}>
                        {promo.discountType === 'percentage' ? 'Phần trăm' : 'Cố định'}
                      </span>
                    </td>
                    <td style={{ color: '#dc2626', fontWeight: 'bold' }}>
                      {promo.discountType === 'percentage' 
                        ? `${promo.discountValue}%` 
                        : `${promo.discountValue.toLocaleString()}đ`}
                    </td>
                    <td>
                      <div className="date-range" style={{ fontSize: '13px', color: '#4b5563' }}>
                        <div>{new Date(promo.startDate).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
                        <div>{new Date(promo.endDate).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
                      </div>
                    </td>
                    <td>
                      <span style={{ color: '#2563eb' }}>{promo.usedCount}</span>
                      <span style={{ color: '#9ca3af' }}> / {promo.usageLimit || '∞'}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${statusClass}`}>
                        {statusText}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons" style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          className="btn-icon"
                          onClick={() => handleToggleStatus(promo._id, promo.isActive)}
                          title={promo.isActive ? "Tạm dừng" : "Kích hoạt"}
                          style={{ 
                            background: '#fef3c7', 
                            color: '#d97706',
                            border: 'none',
                            padding: '6px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          <i className={`fi fi-rr-${promo.isActive ? 'pause' : 'play'}`}></i>
                        </button>
                        <button 
                          className="btn-icon"
                          onClick={() => navigate(`/admin/promotions/${promo._id}`)}
                          title="Sửa"
                          style={{ 
                            background: '#fef3c7', 
                            color: '#d97706',
                            border: 'none',
                            padding: '6px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          <i className="fi fi-rr-edit"></i>
                        </button>
                        <button 
                          className="btn-icon"
                          onClick={() => handleDelete(promo._id)}
                          title="Xóa"
                          style={{ 
                            background: '#f3f4f6', 
                            color: '#6b7280',
                            border: 'none',
                            padding: '6px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          <i className="fi fi-rr-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminPromotionList
