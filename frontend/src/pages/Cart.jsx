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
  const [selectedItems, setSelectedItems] = useState([])

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
        // Filter out items with null productId (deleted products)
        const validItems = data.data.items.filter(item => item.productId)
        setCartItems(validItems)
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

  const removeItem = async (productId, clientProductId = null, productName = '') => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa "${productName || 'sản phẩm này'}" khỏi giỏ hàng?`)) {
      return
    }

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
        // Remove from selected items if it was selected
        const idToRemove = (typeof productId === 'object' && productId?._id) ? productId._id : productId
        setSelectedItems(prev => prev.filter(id => id !== idToRemove))
      } else {
        alert(data.message || 'Không thể xóa sản phẩm khỏi giỏ hàng')
      }
    } catch (error) {
      console.error('Error removing item:', error)
      alert('Lỗi khi xóa sản phẩm khỏi giỏ hàng')
    }
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = cartItems
        .filter(item => item.productId)
        .map(item => item.productId._id || item.productId)
      setSelectedItems(allIds)
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(prev => prev.filter(itemId => itemId !== id))
    } else {
      setSelectedItems(prev => [...prev, id])
    }
  }

  const handleCheckout = () => {
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để tiến hành thanh toán')
      navigate('/dang-nhap')
      return
    }

    if (selectedItems.length === 0) {
      alert('Vui lòng chọn sản phẩm để thanh toán')
      return
    }
    
    // Filter cart items to only include selected ones for checkout
    // In a real app, you might pass selected items to checkout page via state or context
    navigate('/checkout', { state: { selectedItems } })
  }

  // Calculate totals based on SELECTED items
  const selectedCartItems = cartItems.filter(item => {
    if (!item.productId) return false
    const id = item.productId._id || item.productId
    return selectedItems.includes(id)
  })

  const totalPrice = selectedCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const totalSelectedCount = selectedCartItems.length

  return (
    <div className='cart-page-new'>
      <div className='cart-container-new'>
        <h1 className='cart-title'>Giỏ hàng của bạn</h1>

        <div className='cart-layout'>
          {/* Left Column: Product List */}
          <div className='cart-list-section'>
            {/* Select All Header */}
            {cartItems.length > 0 && (
              <div className='cart-header-row'>
                <label className='checkbox-label'>
                  <input 
                    type='checkbox' 
                    checked={cartItems.length > 0 && selectedItems.length === cartItems.length}
                    onChange={handleSelectAll}
                  />
                  <span>Chọn tất cả ({selectedItems.length}/{cartItems.length})</span>
                </label>
              </div>
            )}

            {/* Product Items */}
            {cartItems.length === 0 ? (
              <div className='empty-cart-message'>
                <p>Giỏ hàng của bạn đang trống</p>
                <Link to='/thuc-pham-chuc-nang'>Mua sắm ngay</Link>
              </div>
            ) : (
              <div className='cart-items-list'>
                {cartItems.map(item => {
                  if (!item.productId) return null
                  const itemId = item.productId._id || item.productId
                  return (
                    <div key={itemId} className='cart-item-card'>
                      <div className='item-checkbox'>
                        <input 
                          type='checkbox' 
                          checked={selectedItems.includes(itemId)}
                          onChange={() => handleSelectItem(itemId)}
                        />
                      </div>
                      
                      <div className='item-image-box'>
                        <img src={resolveImageSrc(item.image)} alt={item.name} />
                      </div>

                      <div className='item-info-box'>
                        <div className='item-main-info'>
                          <h3 className='item-name'>{item.name}</h3>
                          <p className='item-sku'>SKU: {item.sku || itemId.substring(0, 8).toUpperCase()}</p>
                          <p className='item-price-highlight'>{item.price.toLocaleString('vi-VN')} ₫</p>
                        </div>

                        <div className='item-actions'>
                          <div className='quantity-control'>
                            <button 
                              onClick={() => updateQuantity(item.productId, item.quantity - 1, item.clientProductId)}
                              disabled={item.quantity <= 1}
                            >−</button>
                            <input 
                              type='text' 
                              value={item.quantity} 
                              readOnly 
                            />
                            <button 
                              onClick={() => updateQuantity(item.productId, item.quantity + 1, item.clientProductId)}
                            >+</button>
                          </div>
                          
                          <div className='item-subtotal'>
                            {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                          </div>

                          <button 
                            className='delete-btn'
                            onClick={() => removeItem(item.productId, item.clientProductId, item.name)}
                          >
                            <i className='fi fi-rr-trash'></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Right Column: Order Summary */}
          <div className='cart-summary-section'>
            <div className='summary-card'>
              <h2>Tổng đơn hàng</h2>
              
              <div className='summary-row'>
                <span>Tạm tính ({totalSelectedCount} sản phẩm):</span>
                <span>{totalPrice.toLocaleString('vi-VN')} ₫</span>
              </div>
              
              <div className='summary-row'>
                <span>Phí vận chuyển:</span>
                <span>Miễn phí</span>
              </div>
              
              <div className='summary-divider'></div>
              
              <div className='summary-row total'>
                <span>Tổng cộng:</span>
                <span className='total-price'>{totalPrice.toLocaleString('vi-VN')} ₫</span>
              </div>
              
              <button className='checkout-button' onClick={handleCheckout}>
                <i className='fi fi-rr-credit-card'></i> Thanh toán ({totalSelectedCount})
              </button>
              
              <Link to='/thuc-pham-chuc-nang' className='continue-shopping-button'>
                ← Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
