import React from 'react'
import './Policy.css'

const FAQ = () => {
  return (
    <div className='policy-page'>
      <div className='policy-container'>
        <h1>Câu hỏi thường gặp</h1>
        
        <div className='policy-content'>
          <div className='faq-item'>
            <h3>1. Tôi có thể hủy đơn hàng đã đặt không?</h3>
            <p>Quý khách có thể hủy đơn hàng khi đơn hàng chưa được chuyển sang trạng thái "Đang giao hàng". Vui lòng liên hệ hotline hoặc vào phần quản lý đơn hàng để thực hiện hủy.</p>
          </div>

          <div className='faq-item'>
            <h3>2. Bao lâu tôi nhận được hàng?</h3>
            <p>Thời gian giao hàng thông thường từ 2-5 ngày làm việc tùy thuộc vào địa chỉ nhận hàng của quý khách. Đối với nội thành TP.HCM, thời gian giao hàng có thể nhanh hơn (1-2 ngày).</p>
          </div>

          <div className='faq-item'>
            <h3>3. Sản phẩm có chính hãng không?</h3>
            <p>HealthyCare cam kết 100% sản phẩm bán ra là hàng chính hãng, có nguồn gốc xuất xứ rõ ràng. Chúng tôi sẵn sàng đền bù nếu phát hiện hàng giả, hàng nhái.</p>
          </div>

          <div className='faq-item'>
            <h3>4. Tôi có thể thanh toán khi nhận hàng không?</h3>
            <p>Có, chúng tôi hỗ trợ phương thức thanh toán khi nhận hàng (COD) cho tất cả các đơn hàng trên toàn quốc.</p>
          </div>

          <div className='faq-item'>
            <h3>5. Phí vận chuyển được tính như thế nào?</h3>
            <p>Phí vận chuyển sẽ được tính dựa trên khoảng cách và khối lượng đơn hàng. Miễn phí vận chuyển cho đơn hàng từ 500.000đ trở lên.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQ
