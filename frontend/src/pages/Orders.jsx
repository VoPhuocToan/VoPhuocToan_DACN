import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link, useParams } from 'react-router-dom'
import './Orders.css'

const Orders = () => {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { id: orderId } = useParams()
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [reviewModal, setReviewModal] = useState({ isOpen: false, product: null })
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/dang-nhap')
      return
    }
    fetchOrders()
  }, [isAuthenticated, navigate])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      
      const response = await fetch(`${apiUrl}/api/orders/myorders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.success) {
        const ordersList = data.data || []
        setOrders(ordersList)
        
        // If there's an order ID in URL, select it
        if (orderId) {
          const order = ordersList.find(o => o._id === orderId)
          if (order) {
            setSelectedOrder(order)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenReview = (product) => {
    setReviewModal({ isOpen: true, product })
    setReviewForm({ rating: 5, comment: '' })
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!reviewModal.product) return

    setSubmittingReview(true)
    try {
      const token = localStorage.getItem('token')
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      
      const response = await fetch(`${apiUrl}/api/products/${reviewModal.product.product._id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewForm)
      })

      const data = await response.json()

      if (response.ok) {
        alert('Cảm ơn bạn đã đánh giá sản phẩm!')
        setReviewModal({ isOpen: false, product: null })
      } else {
        alert(data.message || 'Có lỗi xảy ra khi gửi đánh giá')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Không thể kết nối đến server')
    } finally {
      setSubmittingReview(false)
    }
  }

  const getStatusInfo = (status) => {
    const statusMap = {
      'pending': { text: 'Chờ xác nhận', color: '#f59e0b', icon: '⏳', description: 'Đơn hàng đã được tạo và chờ xác nhận từ cửa hàng' },
      'processing': { text: 'Đang xử lý', color: '#3b82f6', icon: '🔄', description: 'Cửa hàng đang chuẩn bị hàng để gửi' },
      'shipped': { text: 'Đang giao', color: '#8b5cf6', icon: '🚚', description: 'Đơn hàng đã được giao cho đơn vị vận chuyển' },
      'delivered': { text: 'Đã giao', color: '#10b981', icon: '✅', description: 'Bạn đã nhận được đơn hàng' },
      'cancelled': { text: 'Đã hủy', color: '#ef4444', icon: '❌', description: 'Đơn hàng đã bị hủy' }
    }
    return statusMap[status] || statusMap['pending']
  }

  const getPaymentStatus = (isPaid, status) => {
    if (status === 'delivered') {
      return { text: 'Đã thanh toán', color: '#10b981', icon: '✓' }
    }
    return isPaid 
      ? { text: 'Đã thanh toán', color: '#10b981', icon: '✓' }
      : { text: 'Chưa thanh toán', color: '#f59e0b', icon: '⏳' }
  }

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus)

  const handleCancelOrder = async (orderId, e) => {
    e.stopPropagation() // Prevent opening order detail modal
    
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể hoàn tác.')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      
      const response = await fetch(`${apiUrl}/api/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.success) {
        alert('Đã hủy đơn hàng thành công')
        // Refresh orders list
        fetchOrders()
        // Close detail modal if open
        if (selectedOrder?._id === orderId) {
          setSelectedOrder(null)
        }
      } else {
        alert(data.message || 'Không thể hủy đơn hàng')
      }
    } catch (error) {
      console.error('Error cancelling order:', error)
      alert('Lỗi khi hủy đơn hàng')
    }
  }

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải đơn hàng...</p>
      </div>
    )
  }

  return (
    <div className="orders-container">
      <div className="orders-wrapper">
        <div className="orders-header">
          <div>
            <h1>Đơn hàng của tôi</h1>
            <p>Quản lý và theo dõi tất cả đơn hàng của bạn</p>
          </div>
          <Link to="/thuc-pham-chuc-nang" className="shop-link">
            <i className="fi fi-rr-shopping-bag"></i>
            Tiếp tục mua sắm
          </Link>
        </div>

        {/* Status Filter */}
        <div className="status-filter">
          <button 
            className={`filter-btn ${selectedStatus === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('all')}
          >
            <span className="badge">{orders.length}</span>
            Tất cả
          </button>
          <button 
            className={`filter-btn ${selectedStatus === 'pending' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('pending')}
          >
            <span className="badge">{orders.filter(o => o.status === 'pending').length}</span>
            ⏳ Chờ xác nhận
          </button>
          <button 
            className={`filter-btn ${selectedStatus === 'processing' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('processing')}
          >
            <span className="badge">{orders.filter(o => o.status === 'processing').length}</span>
            🔄 Đang xử lý
          </button>
          <button 
            className={`filter-btn ${selectedStatus === 'shipped' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('shipped')}
          >
            <span className="badge">{orders.filter(o => o.status === 'shipped').length}</span>
            🚚 Đang giao
          </button>
          <button 
            className={`filter-btn ${selectedStatus === 'delivered' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('delivered')}
          >
            <span className="badge">{orders.filter(o => o.status === 'delivered').length}</span>
            ✅ Hoàn thành
          </button>
          <button 
            className={`filter-btn ${selectedStatus === 'cancelled' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('cancelled')}
          >
            <span className="badge">{orders.filter(o => o.status === 'cancelled').length}</span>
            ❌ Đã hủy
          </button>
        </div>

        {/* Orders List */}
        <div className="orders-list">
          {filteredOrders.length === 0 ? (
            <div className="no-orders">
              <div className="no-orders-icon">📦</div>
              <h3>Chưa có đơn hàng nào</h3>
              <p>Bạn chưa có đơn hàng nào {selectedStatus !== 'all' ? `ở trạng thái "${getStatusInfo(selectedStatus).text}"` : ''}</p>
              <Link to="/thuc-pham-chuc-nang" className="shop-now-btn">
                <i className="fi fi-rr-shopping-bag"></i>
                Mua sắm ngay
              </Link>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status)
              const paymentStatus = getPaymentStatus(order.isPaid, order.status)
              return (
                <div 
                  key={order._id}  
                  className={`order-card ${selectedOrder?._id === order._id ? 'selected' : ''}`}
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="order-header">
                    <div className="order-id">
                      <span className="label">Mã:</span>
                      <span className="value">#{order._id.slice(-8).toUpperCase()}</span>
                    </div>
                    <div className="order-date">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>

                  <div className="order-status-row">
                    <span 
                      className="status-badge"
                      style={{ background: statusInfo.color }}
                      title={statusInfo.description}
                    >
                      {statusInfo.icon} {statusInfo.text}
                    </span>
                    <span 
                      className="payment-badge"
                      style={{ background: paymentStatus.color }}
                      title={paymentStatus.text}
                    >
                      {paymentStatus.icon} {paymentStatus.text}
                    </span>
                  </div>

                  <div className="order-items-preview">
                    {order.orderItems?.slice(0, 2).map((item, index) => (
                      <div key={index} className="order-item-preview">
                        <span className="item-name">{item.name}</span>
                        <span className="item-qty">x{item.quantity}</span>
                      </div>
                    ))}
                    {order.orderItems?.length > 2 && (
                      <div className="more-items">+{order.orderItems.length - 2} sản phẩm khác</div>
                    )}
                  </div>

                  <div className="order-footer">
                    <div className="shipping-address">
                      <i className="fi fi-rr-marker"></i>
                      <span>{order.shippingAddress?.fullName}</span>
                    </div>
                    <div className="order-total">
                      <span className="total-amount">
                        {order.totalPrice?.toLocaleString('vi-VN')} ₫
                      </span>
                    </div>
                  </div>

                  {/* Cancel button - only show for pending orders */}
                  {order.status === 'pending' && (
                    <div className="order-actions">
                      <button 
                        className="cancel-order-btn"
                        onClick={(e) => handleCancelOrder(order._id, e)}
                        title="Hủy đơn hàng"
                      >
                        <i className="fi fi-rr-cross"></i>
                        Hủy đơn hàng
                      </button>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="order-detail-modal">
          <div className="modal-overlay" onClick={() => setSelectedOrder(null)}></div>
          <div className="modal-content">
            <button className="modal-close" onClick={() => setSelectedOrder(null)}>
              <i className="fi fi-rr-cross"></i>
            </button>

            <div className="detail-header">
              <h2>Chi tiết đơn hàng</h2>
              <span className="order-id-detail">#{selectedOrder._id.slice(-8).toUpperCase()}</span>
            </div>

            <div className="detail-body">
              {/* Status Timeline */}
              <div className="status-timeline">
                <div className={`timeline-item ${['pending', 'processing', 'shipped', 'delivered'].includes(selectedOrder.status) ? 'completed' : ''}`}>
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <h4>Chờ xác nhận</h4>
                    <p>{new Date(selectedOrder.createdAt).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>

                <div className={`timeline-item ${['processing', 'shipped', 'delivered'].includes(selectedOrder.status) ? 'completed' : ''}`}>
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <h4>Đang xử lý</h4>
                    <p>Cửa hàng đang chuẩn bị hàng</p>
                  </div>
                </div>

                <div className={`timeline-item ${['shipped', 'delivered'].includes(selectedOrder.status) ? 'completed' : ''}`}>
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <h4>Đang giao hàng</h4>
                    <p>Hàng đang trên đường đến bạn</p>
                  </div>
                </div>

                <div className={`timeline-item ${selectedOrder.status === 'delivered' ? 'completed' : ''}`}>
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <h4>Đã giao hàng</h4>
                    <p>{selectedOrder.deliveredAt ? new Date(selectedOrder.deliveredAt).toLocaleDateString('vi-VN') : 'Chưa giao'}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="detail-section">
                <h3>Sản phẩm</h3>
                <div className="items-detail">
                  {selectedOrder.orderItems?.map((item, index) => (
                    <div key={index} className="item-detail-row">
                      <div className="item-info-col">
                        <span className="item-name">{item.name}</span>
                        <span className="item-qty">x{item.quantity}</span>
                        <span className="item-price">
                          {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                        </span>
                      </div>
                      {selectedOrder.status === 'delivered' && (
                        <button 
                          className="btn-review-product"
                          onClick={() => handleOpenReview(item)}
                        >
                          ⭐ Đánh giá
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="detail-section">
                <h3>Địa chỉ giao hàng</h3>
                <div className="address-info">
                  <p><strong>{selectedOrder.shippingAddress?.fullName}</strong></p>
                  <p>{selectedOrder.shippingAddress?.phone}</p>
                  <p>{selectedOrder.shippingAddress?.address}</p>
                  <p>{selectedOrder.shippingAddress?.ward}, {selectedOrder.shippingAddress?.district}, {selectedOrder.shippingAddress?.city}</p>
                </div>
              </div>

              {/* Order Summary */}
              <div className="detail-section">
                <h3>Tóm tắt đơn hàng</h3>
                <div className="summary-detail">
                  <div className="summary-row">
                    <span>Tổng tiền hàng:</span>
                    <span>{selectedOrder.itemsPrice?.toLocaleString('vi-VN')} ₫</span>
                  </div>
                  <div className="summary-row">
                    <span>Phí vận chuyển:</span>
                    <span>{selectedOrder.shippingPrice === 0 ? 'Miễn phí' : `${selectedOrder.shippingPrice?.toLocaleString('vi-VN')} ₫`}</span>
                  </div>
                  <div className="summary-row">
                    <span>Phương thức thanh toán:</span>
                    <span className="payment-method">
                      {selectedOrder.paymentMethod === 'cod' && 'Thanh toán khi nhận hàng'}
                      {selectedOrder.paymentMethod === 'bank' && 'Chuyển khoản ngân hàng'}
                      {selectedOrder.paymentMethod === 'momo' && 'Ví MoMo'}
                      {selectedOrder.paymentMethod === 'vnpay' && 'VNPay'}
                    </span>
                  </div>
                  <div className="summary-divider"></div>
                  <div className="summary-row total">
                    <span>Tổng cộng:</span>
                    <span>{selectedOrder.totalPrice?.toLocaleString('vi-VN')} ₫</span>
                  </div>
                </div>
              </div>

              {/* Cancel Order Button - only show for pending orders */}
              {selectedOrder.status === 'pending' && (
                <div className="detail-actions">
                  <button 
                    className="cancel-order-btn-detail"
                    onClick={() => handleCancelOrder(selectedOrder._id, { stopPropagation: () => {} })}
                  >
                    <i className="fi fi-rr-cross"></i>
                    Hủy đơn hàng
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Review Modal */}
      {reviewModal.isOpen && (
        <div className="modal-overlay" onClick={() => setReviewModal({ ...reviewModal, isOpen: false })}>
          <div className="modal-content review-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Đánh giá sản phẩm</h3>
              <button className="close-btn" onClick={() => setReviewModal({ ...reviewModal, isOpen: false })}>×</button>
            </div>
            <div className="modal-body">
              <div className="product-review-info">
                <h4>{reviewModal.productName}</h4>
              </div>
              
              <div className="rating-select">
                <label>Đánh giá của bạn:</label>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${star <= reviewForm.rating ? 'filled' : ''}`}
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      style={{ cursor: 'pointer', fontSize: '24px', color: star <= reviewForm.rating ? '#ffc107' : '#e4e5e9' }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Nhận xét:</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                  rows="4"
                  style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ddd' }}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-cancel"
                onClick={() => setReviewModal({ ...reviewModal, isOpen: false })}
                style={{ marginRight: '10px', padding: '8px 16px', border: '1px solid #ddd', background: '#fff', borderRadius: '4px', cursor: 'pointer' }}
              >
                Hủy
              </button>
              <button 
                className="btn-submit"
                onClick={handleSubmitReview}
                disabled={!reviewForm.comment.trim()}
                style={{ padding: '8px 16px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: !reviewForm.comment.trim() ? 0.7 : 1 }}
              >
                Gửi đánh giá
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders
