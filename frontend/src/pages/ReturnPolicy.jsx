import React from 'react'
import './Policy.css'

const ReturnPolicy = () => {
  return (
    <div className='policy-page'>
      <div className='policy-container'>
        <h1>Chính sách đổi trả</h1>
        
        <div className='policy-content'>
          <section>
            <h2>1. Điều kiện đổi trả</h2>
            <p>Quý khách hàng cần kiểm tra tình trạng hàng hóa và có thể đổi hàng/trả lại hàng ngay tại thời điểm giao/nhận hàng trong những trường hợp sau:</p>
            <ul>
              <li>Hàng không đúng chủng loại, mẫu mã trong đơn hàng đã đặt hoặc như trên website tại thời điểm đặt hàng.</li>
              <li>Không đủ số lượng, không đủ bộ như trong đơn hàng.</li>
              <li>Tình trạng bên ngoài bị ảnh hưởng như rách bao bì, bong tróc, bể vỡ…</li>
            </ul>
            <p>Khách hàng có trách nhiệm trình giấy tờ liên quan chứng minh sự thiếu sót trên để hoàn thành việc hoàn trả/đổi trả hàng hóa.</p>
          </section>

          <section>
            <h2>2. Quy định về thời gian thông báo và gửi sản phẩm đổi trả</h2>
            <ul>
              <li><strong>Thời gian thông báo đổi trả:</strong> trong vòng 48h kể từ khi nhận sản phẩm đối với trường hợp sản phẩm thiếu phụ kiện, quà tặng hoặc bể vỡ.</li>
              <li><strong>Thời gian gửi chuyển trả sản phẩm:</strong> trong vòng 14 ngày kể từ khi nhận sản phẩm.</li>
              <li><strong>Địa điểm đổi trả sản phẩm:</strong> Khách hàng có thể mang hàng trực tiếp đến văn phòng/cửa hàng của chúng tôi hoặc chuyển qua đường bưu điện.</li>
            </ul>
          </section>

          <section>
            <h2>3. Trường hợp không được đổi trả</h2>
            <ul>
              <li>Sản phẩm đã qua sử dụng, không còn nguyên vẹn bao bì, tem mác.</li>
              <li>Sản phẩm hư hỏng do lỗi của khách hàng (bảo quản không đúng cách, làm rơi vỡ...).</li>
              <li>Quá thời hạn đổi trả quy định.</li>
            </ul>
          </section>

          <section>
            <h2>4. Phương thức hoàn tiền</h2>
            <p>Tùy theo lí do hoàn trả sản phẩm và kết quả đánh giá chất lượng tại kho, chúng tôi sẽ hoàn tiền theo phương thức chuyển khoản hoặc tiền mặt (tại cửa hàng) trong vòng 7-15 ngày làm việc.</p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default ReturnPolicy
