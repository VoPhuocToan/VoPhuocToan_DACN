import React from 'react'
import './Policy.css'

const ShoppingGuide = () => {
  return (
    <div className='policy-page'>
      <div className='policy-container'>
        <h1>Hướng dẫn mua hàng</h1>
        
        <div className='policy-content'>
          <section>
            <h2>Bước 1: Tìm kiếm sản phẩm</h2>
            <p>Quý khách có thể tìm kiếm sản phẩm theo 2 cách:</p>
            <ul>
              <li>Gõ tên sản phẩm vào thanh tìm kiếm.</li>
              <li>Tìm theo danh mục sản phẩm trên thanh menu (Vitamin, Thực phẩm chức năng, v.v.).</li>
            </ul>
          </section>

          <section>
            <h2>Bước 2: Thêm vào giỏ hàng</h2>
            <p>Khi đã tìm được sản phẩm mong muốn, quý khách bấm vào hình hoặc tên sản phẩm để vào trang chi tiết. Tại đây:</p>
            <ul>
              <li>Kiểm tra thông tin sản phẩm, giá, thông tin khuyến mãi.</li>
              <li>Chọn số lượng mong muốn.</li>
              <li>Bấm nút "Thêm vào giỏ hàng".</li>
            </ul>
          </section>

          <section>
            <h2>Bước 3: Kiểm tra giỏ hàng và đặt hàng</h2>
            <p>Sau khi đã chọn đủ sản phẩm, quý khách bấm vào biểu tượng giỏ hàng ở góc phải màn hình:</p>
            <ul>
              <li>Kiểm tra lại danh sách sản phẩm, số lượng.</li>
              <li>Bấm nút "Thanh toán".</li>
            </ul>
          </section>

          <section>
            <h2>Bước 4: Điền thông tin giao hàng</h2>
            <p>Quý khách điền đầy đủ thông tin giao hàng:</p>
            <ul>
              <li>Họ tên, số điện thoại, email.</li>
              <li>Địa chỉ nhận hàng (Tỉnh/Thành, Quận/Huyện, Phường/Xã, Số nhà).</li>
              <li>Ghi chú (nếu có).</li>
            </ul>
          </section>

          <section>
            <h2>Bước 5: Chọn phương thức thanh toán và hoàn tất</h2>
            <p>Chọn phương thức thanh toán phù hợp (COD, Chuyển khoản, PayOS, v.v.) và bấm "Đặt hàng". Hệ thống sẽ gửi email xác nhận đơn hàng cho quý khách.</p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default ShoppingGuide
