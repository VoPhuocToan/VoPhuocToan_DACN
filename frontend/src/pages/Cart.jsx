import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Cart.css'

// Import all images from assets folder
const images = import.meta.glob('../assets/*.{jpg,jpeg,png,gif,webp}', { eager: true, import: 'default' })

const resolveImageSrc = (img) => {
  if (!img) return ''
  const imgStr = String(img)
  
  // If it's already a full URL, return it
  if (imgStr.startsWith('http://') || imgStr.startsWith('https://')) {
    return imgStr
  }
  
  // If it's a server upload path (starts with /uploads), prepend API URL
  if (imgStr.startsWith('/uploads')) {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    return `${apiUrl}${imgStr}`
  }
  
  // Look for the image in our imported images
  const imagePath = `../assets/${imgStr}`
  if (images[imagePath]) {
    return images[imagePath]
  }
  
  // If not found, return a placeholder or the original string
  console.warn(`Image not found: ${imgStr}`)
  return imgStr
}

const Cart = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [userId] = useState(localStorage.getItem('userId') || `guest_${Date.now()}`)

  // Load cart on mount
  useEffect(() => {
    loadCart()
    // Save userId for future use
    if (!localStorage.getItem('userId')) {
      localStorage.setItem('userId', userId)
    }
  }, [])

  const loadCart = async () => {
    setIsLoading(true)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const userIdToUse = localStorage.getItem('userId') || userId
      
      const response = await fetch(`${apiUrl}/api/cart/${userIdToUse}`)
      const data = await response.json()

      if (data.success && data.data.items) {
        setCartItems(data.data.items)
      }
    } catch (error) {
      console.error('Error loading cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuantity = async (productId, newQuantity, clientProductId = null) => {
    if (newQuantity <= 0) {
      removeItem(productId)
      return
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const userIdToUse = localStorage.getItem('userId') || userId

      const response = await fetch(`${apiUrl}/api/cart/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userIdToUse,
          productId: (typeof productId === 'object' && productId?._id) ? productId._id : (typeof productId === 'string' ? productId : undefined),
          clientProductId: clientProductId || (typeof productId === 'string' ? productId : null),
          quantity: newQuantity
        })
      })

      const data = await response.json()
      if (data.success) {
        loadCart()
      }
    } catch (error) {
      console.error('Error updating cart:', error)
    }
  }

  const removeItem = async (productId, clientProductId = null) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const userIdToUse = localStorage.getItem('userId') || userId

      const response = await fetch(`${apiUrl}/api/cart/remove`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userIdToUse,
          productId: (typeof productId === 'object' && productId?._id) ? productId._id : (typeof productId === 'string' ? productId : undefined),
          clientProductId: clientProductId || (typeof productId === 'string' ? productId : null)
        })
      })

      const data = await response.json()
      if (data.success) {
        loadCart()
      }
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  const clearCart = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm?')) return

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const userIdToUse = localStorage.getItem('userId') || userId

      const response = await fetch(`${apiUrl}/api/cart/clear`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userIdToUse
        })
      })

      const data = await response.json()
      if (data.success) {
        loadCart()
      }
    } catch (error) {
      console.error('Error clearing cart:', error)
    }
  }

  const handleCheckout = () => {
    // Kiểm tra đăng nhập
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để tiến hành thanh toán')
      navigate('/login')
      return
    }
    
    // Thực hiện thanh toán
    alert('Chức năng thanh toán đang được phát triển')
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className='cart-page'>
      <div className='cart-header'>
        <h1>Giỏ Hàng</h1>
        <p>{totalItems} sản phẩm trong giỏ</p>
      </div>

      <div className='cart-container'>
        {cartItems.length === 0 ? (
          <div className='empty-cart'>
            <div className='empty-icon'>
              <i className='fi fi-rr-shopping-cart'></i>
            </div>
            <h2>Giỏ hàng trống</h2>
            <p>Hãy thêm sản phẩm yêu thích của bạn</p>
            <Link to='/thuc-pham-chuc-nang' className='continue-shopping-btn'>
              <i className='fi fi-rr-arrow-left'></i>
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <>
            <div className='cart-content'>
              <div className='cart-items'>
                <div className='items-header'>
                  <h2>Chi tiết đơn hàng</h2>
                  {cartItems.length > 0 && (
                    <button className='clear-cart-btn' onClick={clearCart}>
                      <i className='fi fi-rr-trash'></i>
                      Xóa tất cả
                    </button>
                  )}
                </div>

                <div className='items-list'>
                  {cartItems.map(item => (
                    <div key={item._id || item.clientProductId || item.productId} className='cart-item'>
                      <div className='item-image'>
                        <img src={resolveImageSrc(item.image)} alt={item.name} />
                      </div>

                      <div className='item-details'>
                        <h3 className='item-name'>{item.name}</h3>
                        <p className='item-price'>{item.price.toLocaleString('vi-VN')} ₫</p>
                      </div>

                      <div className='item-quantity'>
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity - 1, item.clientProductId)}
                          className='qty-btn'
                        >
                          <i className='fi fi-rr-minus'></i>
                        </button>
                        <input 
                          type='number' 
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1, item.clientProductId)}
                          min='1'
                        />
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity + 1, item.clientProductId)}
                          className='qty-btn'
                        >
                          <i className='fi fi-rr-plus'></i>
                        </button>
                      </div>

                      <div className='item-total'>
                        {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                      </div>

                      <button 
                        onClick={() => removeItem(item.productId, item.clientProductId)}
                        className='remove-btn'
                        title='Xóa sản phẩm'
                      >
                        <i className='fi fi-rr-trash'></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className='order-summary'>
                <h2>Tóm tắt đơn hàng</h2>

                <div className='summary-row'>
                  <span>Tổng tiền hàng:</span>
                  <span>{totalPrice.toLocaleString('vi-VN')} ₫</span>
                </div>

                <div className='summary-row'>
                  <span>Phí vận chuyển:</span>
                  <span className='shipping-fee'>
                    {totalPrice > 500000 ? 'Miễn phí' : '30,000 ₫'}
                  </span>
                </div>

                <div className='summary-row'>
                  <span>Giảm giá:</span>
                  <span className='discount'>0 ₫</span>
                </div>

                <div className='summary-divider'></div>

                <div className='summary-row total'>
                  <span>Tổng cộng:</span>
                  <span>
                    {(totalPrice > 500000 ? totalPrice : totalPrice + 30000).toLocaleString('vi-VN')} ₫
                  </span>
                </div>

                <button className='checkout-btn' onClick={handleCheckout}>
                  <i className='fi fi-rr-credit-card'></i>
                  Tiến hành thanh toán
                </button>

                <Link to='/thuc-pham-chuc-nang' className='continue-btn'>
                  <i className='fi fi-rr-arrow-left'></i>
                  Tiếp tục mua sắm
                </Link>

                <div className='benefits'>
                  <p>
                    <i className='fi fi-rr-truck'></i>
                    Miễn phí vận chuyển cho đơn hàng trên 500,000 ₫
                  </p>
                  <p>
                    <i className='fi fi-rr-shield-check'></i>
                    Bảo vệ người mua 100%
                  </p>
                  <p>
                    <i className='fi fi-rr-check'></i>
                    Hàng chính hãng 100%
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Cart
