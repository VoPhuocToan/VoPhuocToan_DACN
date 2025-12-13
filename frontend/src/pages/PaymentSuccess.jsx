import React, { useEffect, useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import './PaymentResult.css'

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const orderId = searchParams.get('orderId')
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    const redirect = setTimeout(() => {
      navigate('/')
    }, 5000)

    return () => {
      clearInterval(timer)
      clearTimeout(redirect)
    }
  }, [navigate, orderId])

  return (
    <div className="payment-result-container success">
      <div className="result-card">
        <div className="icon-wrapper">
          <i className="fi fi-rr-check-circle"></i>
        </div>
        <h1>Thanh toán thành công!</h1>
        <p>Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được thanh toán thành công.</p>
        {orderId && <p className="order-ref">Mã đơn hàng: #{orderId.slice(-8).toUpperCase()}</p>}
        
        <div className="actions">
          <Link to="/" className="btn-primary">
            Về trang chủ
          </Link>
          <Link to="/don-hang" className="btn-secondary">
            Xem đơn hàng
          </Link>
        </div>
        
        <p className="redirect-text">Tự động chuyển hướng sau {countdown}s...</p>
      </div>
    </div>
  )
}

export default PaymentSuccess
