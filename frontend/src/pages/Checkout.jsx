import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Checkout.css'

const Checkout = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [userId] = useState(localStorage.getItem('userId') || `guest_${Date.now()}`)

  // Form state
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    city: user?.city || '',
    district: user?.district || '',
    ward: user?.ward || '',
    paymentMethod: 'cod',
    notes: '',
    transferAmount: '',
    transferNote: ''
  })

  const [formErrors, setFormErrors] = useState({})

  // Promotion state
  const [promotionCode, setPromotionCode] = useState('')
  const [discountAmount, setDiscountAmount] = useState(0)
  const [appliedPromotion, setAppliedPromotion] = useState(null)
  const [promotionError, setPromotionError] = useState('')

  // Address state
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])

  // Fetch provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch('https://provinces.open-api.vn/api/?depth=1')
        const data = await response.json()
        setProvinces(data)
      } catch (error) {
        console.error('Error fetching provinces:', error)
      }
    }
    fetchProvinces()
  }, [])

  // Load districts and wards if user has saved address
  useEffect(() => {
    const loadAddressData = async () => {
      if (formData.city && provinces.length > 0) {
        const selectedProvince = provinces.find(p => p.name === formData.city)
        if (selectedProvince) {
          try {
            const response = await fetch(`https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`)
            const data = await response.json()
            setDistricts(data.districts)

            if (formData.district) {
              const selectedDistrict = data.districts.find(d => d.name === formData.district)
              if (selectedDistrict) {
                const responseWard = await fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`)
                const dataWard = await responseWard.json()
                setWards(dataWard.wards)
              }
            }
          } catch (error) {
            console.error('Error loading address data:', error)
          }
        }
      }
    }
    
    if (user && provinces.length > 0) {
        loadAddressData()
    }
  }, [user, provinces, formData.city, formData.district])

  const handleCityChange = async (e) => {
    const cityName = e.target.value
    setFormData(prev => ({
      ...prev,
      city: cityName,
      district: '',
      ward: ''
    }))
    setDistricts([])
    setWards([])

    const selectedProvince = provinces.find(p => p.name === cityName)
    if (selectedProvince) {
      try {
        const response = await fetch(`https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`)
        const data = await response.json()
        setDistricts(data.districts)
      } catch (error) {
        console.error('Error fetching districts:', error)
      }
    }
  }

  const handleDistrictChange = async (e) => {
    const districtName = e.target.value
    setFormData(prev => ({
      ...prev,
      district: districtName,
      ward: ''
    }))
    setWards([])

    const selectedDistrict = districts.find(d => d.name === districtName)
    if (selectedDistrict) {
      try {
        const response = await fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`)
        const data = await response.json()
        setWards(data.wards)
      } catch (error) {
        console.error('Error fetching wards:', error)
      }
    }
  }

  const handleWardChange = (e) => {
    const wardName = e.target.value
    setFormData(prev => ({
      ...prev,
      ward: wardName
    }))
  }

  // Load cart on mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/dang-nhap')
      return
    }
    loadCart()
  }, [isAuthenticated])

  const loadCart = async () => {
    setIsLoading(true)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const response = await fetch(`${apiUrl}/api/cart/${userId}`)
      const data = await response.json()

      if (data.success && data.data.items) {
        // Filter out items where productId is null (deleted products)
        const validItems = data.data.items.filter(item => item.productId)
        setCartItems(validItems)
      } else {
        setCartItems([])
      }
    } catch (error) {
      console.error('Error loading cart:', error)
      setCartItems([])
    } finally {
      setIsLoading(false)
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.fullName.trim()) {
      errors.fullName = 'Vui lòng nhập họ và tên'
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Vui lòng nhập số điện thoại'
    } else if (!/^(0|84)[0-9]{9,10}$/.test(formData.phone.replace(/\s+/g, ''))) {
      errors.phone = 'Số điện thoại không hợp lệ'
    }

    if (!formData.email.trim()) {
      errors.email = 'Vui lòng nhập email'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email không hợp lệ'
    }

    if (!formData.address.trim()) {
      errors.address = 'Vui lòng nhập địa chỉ'
    }

    if (!formData.city) {
      errors.city = 'Vui lòng chọn thành phố'
    }

    if (!formData.district) {
      errors.district = 'Vui lòng chọn quận/huyện'
    }

    if (!formData.ward) {
      errors.ward = 'Vui lòng chọn phường/xã'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }



  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shippingPrice = totalPrice > 500000 ? 0 : 30000
  const finalTotal = totalPrice + shippingPrice - discountAmount

  const handleApplyPromotion = async () => {
    if (!promotionCode.trim()) return

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const response = await fetch(`${apiUrl}/api/promotions/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: promotionCode,
          orderValue: totalPrice
        })
      })

      const data = await response.json()

      if (data.success) {
        setAppliedPromotion(data.data.promotion)
        setDiscountAmount(data.data.discountAmount)
        setPromotionError('')
        // alert('Áp dụng mã giảm giá thành công!')
      } else {
        setAppliedPromotion(null)
        setDiscountAmount(0)
        setPromotionError(data.message)
      }
    } catch (error) {
      console.error('Error validating promotion:', error)
      setPromotionError('Lỗi khi kiểm tra mã giảm giá')
    }
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (cartItems.length === 0) {
      alert('Giỏ hàng trống. Vui lòng thêm sản phẩm.')
      return
    }

    setIsLoading(true)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const token = localStorage.getItem('token')

      // Prepare order items
      const orderItems = cartItems.map(item => {
        const price = Number(item.price) || 0
        const quantity = Number(item.quantity) || 1
        return {
          product: (item.productId && item.productId._id) ? item.productId._id : (item.productId || item._id),
          name: item.name || 'Sản phẩm',
          image: item.image || 'https://placehold.co/50',
          price: price,
          quantity: quantity
        }
      })

      // Calculate prices
      const itemsPrice = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const shippingPrice = itemsPrice > 500000 ? 0 : 30000
      const totalPrice = itemsPrice + shippingPrice - discountAmount

      const orderData = {
        orderItems,
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          district: formData.district,
          ward: formData.ward
        },
        paymentMethod: formData.paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
        notes: formData.notes,
        promotionCode: appliedPromotion ? appliedPromotion.code : null,
        discountAmount: discountAmount
      }

      const response = await fetch(`${apiUrl}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      })

      const data = await response.json()

      if (data.success) {
        const orderId = data.data._id

        // If PayOS or MoMo payment, create payment link
        if (formData.paymentMethod === 'payos' || formData.paymentMethod === 'momo') {
          const paymentResponse = await fetch(`${apiUrl}/api/payment/payos/create`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              orderId: orderId,
              amount: totalPrice,
              description: `Thanh toán đơn hàng #${orderId.slice(-8)}`
            })
          })

          const paymentData = await paymentResponse.json()

          if (paymentData.success && paymentData.data.checkoutUrl) {
            // Redirect to PayOS payment page
            window.location.href = paymentData.data.checkoutUrl
            return
          } else {
            alert('Không thể tạo link thanh toán. Vui lòng thử lại.')
            setIsLoading(false)
            return
          }
        }

        // Clear cart after successful order
        await fetch(`${apiUrl}/api/cart/clear`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId })
        })

        setOrderPlaced(true)
        setTimeout(() => {
          navigate(`/orders/${data.data._id}`, { state: { orderPlaced: true } })
        }, 2000)
      } else {
        console.error('Order creation failed:', data)
        alert(`Lỗi: ${data.message || 'Không thể tạo đơn hàng'}`)
      }
    } catch (error) {
      console.error('Error placing order:', error)
      alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  if (orderPlaced) {
    return (
      <div className='checkout-success'>
        <div className='success-content'>
          <div className='success-icon'>
            <i className='fi fi-rr-checkbox'></i>
          </div>
          <h2>Đặt hàng thành công!</h2>
          <p>Đơn hàng của bạn đã được tạo thành công.</p>
          <p>Chúng tôi sẽ sớm liên hệ để xác nhận thông tin giao hàng.</p>
        </div>
      </div>
    )
  }

  return (
    <div className='checkout-page'>
      <div className='checkout-header'>
        <h1>Thanh Toán</h1>
        <p>Hoàn thành đặt hàng của bạn</p>
      </div>

      <div className='checkout-container'>
        <div className='checkout-form-section'>
          <form onSubmit={handlePlaceOrder} className='checkout-form'>
            {/* Shipping Information */}
            <div className='form-section'>
              <h2>Thông Tin Giao Hàng</h2>

              <div className='form-row'>
                <div className='form-group'>
                  <label htmlFor='fullName'>Họ và tên *</label>
                  <input
                    type='text'
                    id='fullName'
                    name='fullName'
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder='Nhập họ và tên'
                    className={formErrors.fullName ? 'error' : ''}
                  />
                  {formErrors.fullName && <span className='error-message'>{formErrors.fullName}</span>}
                </div>

                <div className='form-group'>
                  <label htmlFor='phone'>Số điện thoại *</label>
                  <input
                    type='tel'
                    id='phone'
                    name='phone'
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder='0XXX XXX XXX'
                    className={formErrors.phone ? 'error' : ''}
                  />
                  {formErrors.phone && <span className='error-message'>{formErrors.phone}</span>}
                </div>
              </div>

              <div className='form-row'>
                <div className='form-group'>
                  <label htmlFor='email'>Email *</label>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder='example@email.com'
                    className={formErrors.email ? 'error' : ''}
                  />
                  {formErrors.email && <span className='error-message'>{formErrors.email}</span>}
                </div>
              </div>

              <div className='form-row'>
                <div className='form-group'>
                  <label htmlFor='address'>Địa chỉ *</label>
                  <input
                    type='text'
                    id='address'
                    name='address'
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder='Số nhà, tên đường'
                    className={formErrors.address ? 'error' : ''}
                  />
                  {formErrors.address && <span className='error-message'>{formErrors.address}</span>}
                </div>
              </div>

              <div className='form-row three-col'>
                <div className='form-group'>
                  <label htmlFor='city'>Thành phố/Tỉnh *</label>
                  <select
                    id='city'
                    name='city'
                    value={formData.city}
                    onChange={handleCityChange}
                    className={formErrors.city ? 'error' : ''}
                  >
                    <option value="">Chọn Tỉnh/Thành</option>
                    {provinces.map(province => (
                      <option key={province.code} value={province.name}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.city && <span className='error-message'>{formErrors.city}</span>}
                </div>

                <div className='form-group'>
                  <label htmlFor='district'>Quận/Huyện *</label>
                  <select
                    id='district'
                    name='district'
                    value={formData.district}
                    onChange={handleDistrictChange}
                    className={formErrors.district ? 'error' : ''}
                    disabled={!formData.city}
                  >
                    <option value="">Chọn Quận/Huyện</option>
                    {districts.map(district => (
                      <option key={district.code} value={district.name}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.district && <span className='error-message'>{formErrors.district}</span>}
                </div>

                <div className='form-group'>
                  <label htmlFor='ward'>Phường/Xã *</label>
                  <select
                    id='ward'
                    name='ward'
                    value={formData.ward}
                    onChange={handleWardChange}
                    className={formErrors.ward ? 'error' : ''}
                    disabled={!formData.district}
                  >
                    <option value="">Chọn Phường/Xã</option>
                    {wards.map(ward => (
                      <option key={ward.code} value={ward.name}>
                        {ward.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.ward && <span className='error-message'>{formErrors.ward}</span>}
                </div>
              </div>

              <div className='form-row'>
                <div className='form-group'>
                  <label htmlFor='notes'>Ghi chú (tùy chọn)</label>
                  <textarea
                    id='notes'
                    name='notes'
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder='Ghi chú thêm về đơn hàng...'
                    rows='3'
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className='form-section'>
              <h2>Phương Thức Thanh Toán</h2>

              <div className='payment-methods'>
                <label className='payment-option'>
                  <input
                    type='radio'
                    name='paymentMethod'
                    value='cod'
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                  />
                  <span className='payment-label'>
                    <i className='fi fi-rr-truck'></i>
                    <div>
                      <strong>Thanh toán khi nhận hàng (COD)</strong>
                      <small>Thanh toán trực tiếp với shipper</small>
                    </div>
                  </span>
                </label>

                <label className='payment-option'>
                  <input
                    type='radio'
                    name='paymentMethod'
                    value='payos'
                    checked={formData.paymentMethod === 'payos'}
                    onChange={handleInputChange}
                  />
                  <span className='payment-label'>
                    <i className='fi fi-rr-bank'></i>
                    <div>
                      <strong>Thanh toán PayOS</strong>
                      <small>Thanh toán qua cổng PayOS</small>
                    </div>
                  </span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='form-actions'>
              <button
                type='button'
                className='btn-cancel'
                onClick={() => navigate('/cart')}
              >
                Quay lại giỏ hàng
              </button>
              <button
                type='submit'
                className='btn-submit'
                disabled={isLoading || cartItems.length === 0}
              >
                {isLoading ? 'Đang xử lý...' : 'Đặt hàng ngay'}
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className='order-summary-section'>
          <div className='order-summary-sticky'>
            <h2>Đơn hàng của bạn</h2>

            <div className='summary-items'>
              {cartItems.length === 0 ? (
                <p className='empty-message'>Giỏ hàng trống</p>
              ) : (
                cartItems.map(item => (
                  <div key={item._id || item.clientProductId} className='summary-item'>
                    <div className='item-info'>
                      <span className='item-name'>{item.name}</span>
                      <span className='item-qty'>x{item.quantity}</span>
                    </div>
                    <span className='item-price'>
                      {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className='promotion-section'>
              <div className='promotion-input-group'>
                <input
                  type='text'
                  placeholder='Nhập mã giảm giá'
                  value={promotionCode}
                  onChange={(e) => setPromotionCode(e.target.value)}
                  disabled={!!appliedPromotion}
                />
                {appliedPromotion ? (
                  <button type='button' className='btn-remove-promo' onClick={() => {
                    setAppliedPromotion(null)
                    setDiscountAmount(0)
                    setPromotionCode('')
                  }}>Xóa</button>
                ) : (
                  <button type='button' className='btn-apply-promo' onClick={handleApplyPromotion}>Áp dụng</button>
                )}
              </div>
              {promotionError && <p className='promotion-error'>{promotionError}</p>}
              {appliedPromotion && <p className='promotion-success'>Đã áp dụng mã: {appliedPromotion.code}</p>}
            </div>

            <div className='summary-row'>
              <span>Tổng tiền hàng:</span>
              <span>{totalPrice.toLocaleString('vi-VN')} ₫</span>
            </div>

            <div className='summary-row'>
              <span>Phí vận chuyển:</span>
              <span>{shippingPrice === 0 ? 'Miễn phí' : `${shippingPrice.toLocaleString('vi-VN')} ₫`}</span>
            </div>

            {discountAmount > 0 && (
              <div className='summary-row discount'>
                <span>Giảm giá:</span>
                <span>-{discountAmount.toLocaleString('vi-VN')} ₫</span>
              </div>
            )}

            <div className='summary-row total'>
              <span>Tổng cộng:</span>
              <span className='total-amount'>
                {finalTotal.toLocaleString('vi-VN')} ₫
              </span>
            </div>

            <div className='benefits'>
              <div className='benefit-item'>
                <i className='fi fi-rr-truck'></i>
                <span>Miễn phí vận chuyển trên 500k</span>
              </div>
              <div className='benefit-item'>
                <i className='fi fi-rr-shield-check'></i>
                <span>Bảo vệ người mua 100%</span>
              </div>
              <div className='benefit-item'>
                <i className='fi fi-rr-check'></i>
                <span>Hàng chính hãng 100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
