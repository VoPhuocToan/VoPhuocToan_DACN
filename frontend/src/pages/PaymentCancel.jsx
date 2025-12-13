import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import './PaymentResult.css'

const PaymentCancel = () => {
  const [searchParams] = useSearchParams()
  const orderCode = searchParams.get('orderCode')

  return (
    <div className="payment-result-container cancel">
      <div className="result-card">
        <div className="icon-wrapper">
          <i className="fi fi-rr-cross-circle"></i>
        </div>
        <h1>Thanh toán đã bị hủy</h1>
        <p>Bạn đã hủy giao dịch thanh toán. Đơn hàng của bạn vẫn chưa được thanh toán.</p>
        {orderCode && <p className="order-ref">Mã giao dịch: {orderCode}</p>}
        
        <div className="actions">
          <Link to="/checkout" className="btn-primary">
            Thử lại
          </Link>
          <Link to="/gio-hang" className="btn-secondary">
            Về giỏ hàng
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PaymentCancel
