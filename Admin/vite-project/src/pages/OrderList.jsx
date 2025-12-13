import React, { useState, useEffect } from 'react'
import { useStore } from '../context/StoreContext'
import '../styles/OrderList.css'

const OrderList = () => {
  const { token, API_URL } = useStore()
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [periodFilter, setPeriodFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [categories, setCategories] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showDetail, setShowDetail] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/categories`)
        const data = await res.json()
        if (data.success) setCategories(data.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchCategories()
  }, [API_URL])

  useEffect(() => {
    if (token) {
      fetchStats()
      fetchOrders()
    }
  }, [statusFilter, periodFilter, categoryFilter, token])

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/orders/stats`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchOrders = async () => {
    try {
      setLoading(true)
      let url = `${API_URL}/orders?pageSize=50`
      if (statusFilter !== 'all') url += `&status=${statusFilter}`
      if (periodFilter !== 'all') url += `&period=${periodFilter}`
      if (categoryFilter !== 'all') url += `&category=${categoryFilter}`
      
      const response = await fetch(url, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      if (data.success) {
        setOrders(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await response.json();
      if (data.success) {
        fetchOrders();
        fetchStats();
        alert('Cập nhật trạng thái thành công!');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Lỗi khi cập nhật trạng thái');
    }
  }

  const viewOrderDetail = async (orderId) => {
    try {
      if (!token) return;
      
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      setSelectedOrder(data.data);
      setShowDetail(true);
    } catch (error) {
      console.error('Error fetching order detail:', error);
      alert('Lỗi khi tải chi tiết đơn hàng');
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      processing: '#3b82f6',
      shipping: '#8b5cf6',
      delivered: '#10b981',
      cancelled: '#ef4444'
    }
    return colors[status] || '#6b7280'
  }

  const getStatusText = (status) => {
    const texts = {
      pending: 'Chờ xử lý',
      processing: 'Đang xử lý',
      shipping: 'Đang giao',
      delivered: 'Đã giao',
      cancelled: 'Đã hủy'
    }
    return texts[status] || status
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleExportInvoice = (order) => {
    const invoiceWindow = window.open('', '_blank')
    const invoiceContent = `
      <html>
        <head>
          <title>Hóa đơn #${order._id}</title>
          <style>
            body { font-family: 'Arial', sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
            .store-name { font-size: 24px; font-weight: bold; color: #2563eb; }
            .invoice-title { font-size: 20px; margin: 10px 0; font-weight: bold; }
            .info-section { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .info-group h3 { font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 10px; }
            .info-group p { margin: 5px 0; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #eee; }
            th { background-color: #f8f9fa; font-weight: 600; }
            .total-section { text-align: right; margin-top: 20px; }
            .total-row { margin: 5px 0; }
            .final-total { font-size: 18px; font-weight: bold; color: #d32f2f; margin-top: 10px; }
            .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #666; }
            @media print {
              .no-print { display: none; }
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="store-name">HEALTHY CARE</div>
            <div class="invoice-title">HÓA ĐƠN BÁN HÀNG</div>
            <div>Mã đơn hàng: #${order._id.toUpperCase()}</div>
            <div>Ngày đặt: ${new Date(order.createdAt).toLocaleDateString('vi-VN')}</div>
          </div>

          <div class="info-section">
            <div class="info-group" style="width: 48%">
              <h3>Thông tin khách hàng</h3>
              <p><strong>Họ tên:</strong> ${order.shippingAddress?.fullName || order.user?.name}</p>
              <p><strong>Số điện thoại:</strong> ${order.shippingAddress?.phone || 'N/A'}</p>
              <p><strong>Địa chỉ:</strong> ${order.shippingAddress?.address}, ${order.shippingAddress?.ward}, ${order.shippingAddress?.district}, ${order.shippingAddress?.city}</p>
            </div>
            <div class="info-group" style="width: 48%">
              <h3>Thông tin thanh toán</h3>
              <p><strong>Phương thức:</strong> ${order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : order.paymentMethod.toUpperCase()}</p>
              <p><strong>Trạng thái:</strong> ${order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Sản phẩm</th>
                <th>Đơn giá</th>
                <th>SL</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${order.orderItems.map((item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.name}</td>
                  <td>${item.price.toLocaleString('vi-VN')} ₫</td>
                  <td>${item.quantity}</td>
                  <td>${(item.price * item.quantity).toLocaleString('vi-VN')} ₫</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="total-section">
            <div class="total-row">Tạm tính: ${order.itemsPrice?.toLocaleString('vi-VN')} ₫</div>
            <div class="total-row">Phí vận chuyển: ${order.shippingPrice?.toLocaleString('vi-VN')} ₫</div>
            <div class="total-row final-total">Tổng cộng: ${order.totalPrice?.toLocaleString('vi-VN')} ₫</div>
          </div>

          <div class="footer">
            <p>Cảm ơn quý khách đã mua hàng tại Healthy Care!</p>
            <p>Hotline: 1900 xxxx - Website: www.healthycare.vn</p>
          </div>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `
    invoiceWindow.document.write(invoiceContent)
    invoiceWindow.document.close()
  }

  return (
    <div className="order-management">
      <div className="page-header">
        <h1>📦 Quản Lý Đơn Hàng</h1>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card total" onClick={() => setStatusFilter('all')}>
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>Tổng đơn hàng</h3>
              <p className="stat-number" title={stats.summary.total}>{stats.summary.total}</p>
            </div>
          </div>

          <div className="stat-card pending" onClick={() => setStatusFilter('pending')}>
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>Chờ xử lý</h3>
              <p className="stat-number" title={stats.summary.pending}>{stats.summary.pending}</p>
            </div>
          </div>

          <div className="stat-card processing" onClick={() => setStatusFilter('processing')}>
            <div className="stat-icon">⚙️</div>
            <div className="stat-info">
              <h3>Đang xử lý</h3>
              <p className="stat-number" title={stats.summary.processing}>{stats.summary.processing}</p>
            </div>
          </div>

          <div className="stat-card shipping" onClick={() => setStatusFilter('shipping')}>
            <div className="stat-icon">🚚</div>
            <div className="stat-info">
              <h3>Đang giao</h3>
              <p className="stat-number" title={stats.summary.shipping}>{stats.summary.shipping}</p>
            </div>
          </div>

          <div className="stat-card delivered" onClick={() => setStatusFilter('delivered')}>
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>Đã giao</h3>
              <p className="stat-number" title={stats.summary.delivered}>{stats.summary.delivered}</p>
            </div>
          </div>

          <div className="stat-card revenue">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>Doanh thu</h3>
              <p className="stat-number" title={formatCurrency(stats.summary.totalRevenue)}>{formatCurrency(stats.summary.totalRevenue)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Thời gian:</label>
          <select 
            value={periodFilter} 
            onChange={(e) => setPeriodFilter(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="day">Hôm nay</option>
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="year">Năm nay</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Danh mục:</label>
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">Tất cả</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>Trạng thái:</label>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="pending">Chờ xử lý</option>
            <option value="processing">Đang xử lý</option>
            <option value="shipping">Đang giao</option>
            <option value="delivered">Đã giao</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="orders-table-container">
        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : orders.length === 0 ? (
          <div className="no-data">Không có đơn hàng nào</div>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Ngày đặt</th>
                <th>Sản phẩm</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="order-id">#{order._id.slice(-8)}</td>
                  <td>
                    <div className="customer-info">
                      <strong>{order.user?.name || 'N/A'}</strong>
                      <small>{order.user?.email || ''}</small>
                    </div>
                  </td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>{order.orderItems.length} sản phẩm</td>
                  <td className="price">{formatCurrency(order.totalPrice)}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      className="btn-view"
                      onClick={() => viewOrderDetail(order._id)}
                    >
                      <i className="fi fi-rr-eye"></i> Xem
                    </button>
                    <button
                      className="btn-print"
                      onClick={() => handleExportInvoice(order)}
                      title="In hóa đơn"
                      style={{
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginLeft: '5px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <i className="fi fi-rr-print"></i> In
                    </button>
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <select
                        className="status-select"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      >
                        <option value="pending">Chờ xử lý</option>
                        <option value="processing">Đang xử lý</option>
                        <option value="shipping">Đang giao</option>
                        <option value="delivered">Đã giao</option>
                        <option value="cancelled">Hủy đơn</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Order Detail Modal */}
      {showDetail && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowDetail(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <h2>Chi tiết đơn hàng #{selectedOrder._id.slice(-8)}</h2>
                <button 
                  onClick={() => handleExportInvoice(selectedOrder)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <i className="fi fi-rr-print"></i> In hóa đơn
                </button>
              </div>
              <button className="close-btn" onClick={() => setShowDetail(false)}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="order-detail-grid">
                {/* Customer Info */}
                <div className="detail-section">
                  <h3>👤 Thông tin khách hàng</h3>
                  <p><strong>Tên:</strong> {selectedOrder.user?.name}</p>
                  <p><strong>Email:</strong> {selectedOrder.user?.email}</p>
                  <p><strong>Điện thoại:</strong> {selectedOrder.shippingAddress?.phone || 'N/A'}</p>
                </div>

                {/* Shipping Address */}
                <div className="detail-section">
                  <h3>📍 Địa chỉ giao hàng</h3>
                  <p>{selectedOrder.shippingAddress?.address}</p>
                  <p>{selectedOrder.shippingAddress?.ward}, {selectedOrder.shippingAddress?.district}</p>
                  <p>{selectedOrder.shippingAddress?.city}</p>
                </div>

                {/* Order Info */}
                <div className="detail-section">
                  <h3>📦 Thông tin đơn hàng</h3>
                  <p><strong>Ngày đặt:</strong> {formatDate(selectedOrder.createdAt)}</p>
                  <p><strong>Phương thức TT:</strong> {selectedOrder.paymentMethod}</p>
                  <p>
                    <strong>Trạng thái:</strong>{' '}
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(selectedOrder.status) }}
                    >
                      {getStatusText(selectedOrder.status)}
                    </span>
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="detail-section">
                <h3>🛍️ Sản phẩm đã đặt</h3>
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Giá</th>
                      <th>Số lượng</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.orderItems.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>{formatCurrency(item.price)}</td>
                        <td>{item.quantity}</td>
                        <td>{formatCurrency(item.price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Price Summary */}
              <div className="price-summary">
                <div className="summary-row">
                  <span>Tạm tính:</span>
                  <span>{formatCurrency(selectedOrder.itemsPrice)}</span>
                </div>
                <div className="summary-row">
                  <span>Phí vận chuyển:</span>
                  <span>{formatCurrency(selectedOrder.shippingPrice)}</span>
                </div>
                <div className="summary-row total">
                  <span>Tổng cộng:</span>
                  <span>{formatCurrency(selectedOrder.totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderList
