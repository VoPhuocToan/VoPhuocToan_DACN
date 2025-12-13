import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './admin.css'

const AdminOrderList = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([])
  
  // Filters
  const [filters, setFilters] = useState({
    period: 'all',
    category: 'all',
    status: 'all'
  })

  const fetchCategories = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const res = await fetch(`${apiUrl}/api/categories`)
      const data = await res.json()
      if (data.success) setCategories(data.data)
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const token = localStorage.getItem('token')
      
      const queryParams = new URLSearchParams({
        pageSize: 100, // Fetch more for now
        ...filters
      })

      const res = await fetch(`${apiUrl}/api/orders?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) setOrders(data.data)
      else setError(data.message || 'Lỗi khi lấy đơn hàng')
    } catch (err) {
      console.error(err)
      setError('Không thể kết nối tới server')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [filters])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': 'Chờ xử lý',
      'processing': 'Đang xử lý',
      'shipping': 'Đang giao',
      'delivered': 'Đã giao',
      'cancelled': 'Đã hủy'
    }
    return <span className={`status-badge ${status}`}>{statusMap[status] || status}</span>
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
    <div>
      <div className='admin-header'>
        <h1>Quản lý đơn hàng</h1>
      </div>

      <div className='admin-filters'>
        <div className='filter-group'>
          <label>Thời gian:</label>
          <select name="period" value={filters.period} onChange={handleFilterChange}>
            <option value="all">Tất cả</option>
            <option value="day">Hôm nay</option>
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="year">Năm nay</option>
          </select>
        </div>

        <div className='filter-group'>
          <label>Danh mục:</label>
          <select name="category" value={filters.category} onChange={handleFilterChange}>
            <option value="all">Tất cả</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className='filter-group'>
          <label>Trạng thái:</label>
          <select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="all">Tất cả</option>
            <option value="pending">Chờ xử lý</option>
            <option value="processing">Đang xử lý</option>
            <option value="shipping">Đang giao</option>
            <option value="delivered">Đã giao</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p className='error'>{error}</p>
      ) : (
        <table className='admin-table'>
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Ngày đặt</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order._id.substring(order._id.length - 6).toUpperCase()}</td>
                <td>{order.user?.name || 'N/A'}</td>
                <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                <td>{order.totalPrice?.toLocaleString('vi-VN')} ₫</td>
                <td>{getStatusBadge(order.status)}</td>
                <td>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <Link to={`/admin/orders/${order._id}`} className='btn small'>Chi tiết</Link>
                    <button 
                      onClick={() => handleExportInvoice(order)} 
                      className='btn small'
                      style={{ backgroundColor: '#10b981' }}
                      title="Xuất hóa đơn"
                    >
                      <i className="fi fi-rr-print"></i> In
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default AdminOrderList
