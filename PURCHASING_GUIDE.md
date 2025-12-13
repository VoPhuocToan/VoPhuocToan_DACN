# 🛒 Hệ Thống Đặt Mua Sản Phẩm - Hướng Dẫn Sử Dụng

## ✨ Các Tính Năng Mới Được Thêm

### 1. **Trang Thanh Toán (Checkout Page)**
**File**: `frontend/src/pages/Checkout.jsx` & `Checkout.css`

#### Tính Năng:
- ✅ **Form Giao Hàng Hoàn Chỉnh**
  - Nhập họ tên, số điện thoại, email
  - Địa chỉ giao hàng: Số nhà, tên đường
  - Lựa chọn: Thành phố/Tỉnh, Quận/Huyện, Phường/Xã
  - Ghi chú đơn hàng (tùy chọn)

- ✅ **Xác Thực Form (Validation)**
  - Kiểm tra tất cả trường bắt buộc
  - Validate định dạng email
  - Validate số điện thoại Việt Nam (bắt đầu 0 hoặc 84)
  - Hiển thị thông báo lỗi chi tiết

- ✅ **Phương Thức Thanh Toán**
  - 💵 Thanh toán khi nhận hàng (COD)
  - 🏦 Chuyển khoản ngân hàng
  - 📱 Ví MoMo
  - 💳 VNPay

- ✅ **Tóm Tắt Đơn Hàng**
  - Hiển thị danh sách sản phẩm
  - Tính toán tổng tiền
  - Tính phí vận chuyển (30k, miễn phí >500k)
  - Sticky summary panel

- ✅ **Xử Lý Đơn Hàng**
  - Tạo đơn hàng trên backend
  - Xóa giỏ hàng sau đặt hàng thành công
  - Redirect tới trang chi tiết đơn hàng
  - Hiển thị thông báo thành công

#### URL: `http://localhost:5173/checkout`

---

### 2. **Cải Tiến Trang Giỏ Hàng (Cart Page)**
**File**: `frontend/src/pages/Cart.jsx`

#### Cập Nhật:
- ✅ Nút "Tiến hành thanh toán" bây giờ điều hướng tới trang `/checkout`
- ✅ Kiểm tra đăng nhập trước khi thanh toán
- ✅ Tính tự động phí vận chuyển

---

### 3. **Trang Quản Lý Đơn Hàng Nâng Cao (Orders Page)**
**File**: `frontend/src/pages/Orders.jsx` & `Orders.css`

#### Tính Năng Mới:
- ✅ **Bộ Lọc Trạng Thái**
  - Tất cả, Chờ xác nhận, Đang xử lý, Đang giao, Hoàn thành
  - Hiển thị số lượng đơn hàng mỗi trạng thái

- ✅ **Danh Sách Đơn Hàng Cải Tiến**
  - Mã đơn hàng, ngày tạo
  - Trạng thái đơn hàng + trạng thái thanh toán
  - Xem trước sản phẩm (2 sản phẩm + "X sản phẩm khác")
  - Tên người nhận, tổng tiền
  - Có thể click để xem chi tiết

- ✅ **Modal Chi Tiết Đơn Hàng**
  - **Timeline Trạng Thái**: Hiển thị quá trình xử lý
    - Chờ xác nhận
    - Đang xử lý
    - Đang giao hàng
    - Đã giao hàng
  
  - **Danh Sách Sản Phẩm**: Chi tiết đầy đủ
    - Tên, số lượng, giá tiền
    - Tính toán tổng giá
  
  - **Thông Tin Giao Hàng**
    - Tên người nhận
    - Số điện thoại
    - Địa chỉ đầy đủ
  
  - **Tóm Tắt Đơn Hàng**
    - Tổng tiền hàng
    - Phí vận chuyển
    - Phương thức thanh toán
    - Tổng cộng

#### URL: `http://localhost:5173/don-hang`

---

### 4. **Routing (App.jsx)**
**Thêm Route**:
```jsx
<Route path='/checkout' element={<Checkout />} />
```

---

## 🔄 Quy Trình Đặt Mua Sản Phẩm

### Bước 1: Duyệt Sản Phẩm
- Truy cập `http://localhost:5173/thuc-pham-chuc-nang`
- Lựa chọn sản phẩm cần mua
- Click "Thêm vào giỏ hàng"

### Bước 2: Kiểm Tra Giỏ Hàng
- Truy cập `http://localhost:5173/gio-hang`
- Xem danh sách sản phẩm
- Điều chỉnh số lượng
- Xem tóm tắt đơn hàng

### Bước 3: Thanh Toán
- Click nút "Tiến hành thanh toán"
- Sẽ yêu cầu đăng nhập nếu chưa
- Điều hướng tới `/checkout`

### Bước 4: Nhập Thông Tin Giao Hàng
- Nhập họ tên, số điện thoại
- Nhập email
- Nhập địa chỉ giao hàng
- Chọn thành phố, quận/huyện, phường/xã
- Chọn phương thức thanh toán
- (Tùy chọn) Nhập ghi chú

### Bước 5: Xác Nhận Đặt Hàng
- Click "Đặt hàng ngay"
- Hệ thống xác thực dữ liệu
- Tạo đơn hàng trên backend
- Hiển thị thông báo thành công
- Tự động chuyển sang chi tiết đơn hàng

### Bước 6: Theo Dõi Đơn Hàng
- Truy cập `http://localhost:5173/don-hang`
- Xem danh sách tất cả đơn hàng
- Lọc theo trạng thái
- Click đơn hàng để xem chi tiết
- Xem timeline quá trình xử lý

---

## 📱 Responsive Design
- ✅ Desktop (>1024px): Layout 2 cột (form + summary)
- ✅ Tablet (768px-1024px): Responsive grid
- ✅ Mobile (<768px): Stack layout, full width

---

## 🔐 Bảo Mật & Xác Thực
- ✅ Kiểm tra JWT token
- ✅ Require login trước thanh toán
- ✅ Validate dữ liệu trên cả client & server
- ✅ Protect routes với authentication

---

## 💾 Dữ Liệu Backend (API Endpoints)

### Tạo Đơn Hàng
```
POST /api/orders
Headers: Authorization: Bearer {token}
Body: {
  orderItems: Array,
  shippingAddress: Object,
  paymentMethod: string,
  itemsPrice: number,
  shippingPrice: number,
  totalPrice: number
}
```

### Lấy Đơn Hàng Của Người Dùng
```
GET /api/orders/myorders
Headers: Authorization: Bearer {token}
```

### Cập Nhật Trạng Thái (Admin)
```
PUT /api/orders/{id}/pay
PUT /api/orders/{id}/deliver
```

---

## 🎨 UI/UX Improvements
- ✅ **Gradients & Modern Design**: Linear gradients trên headers
- ✅ **Form Validation**: Real-time error messages
- ✅ **Status Badges**: Color-coded status indicators
- ✅ **Timeline UI**: Visual representation của order progress
- ✅ **Smooth Animations**: Slide, fade, scale effects
- ✅ **Accessibility**: Proper labels, semantic HTML
- ✅ **Mobile Optimization**: Touch-friendly buttons

---

## 📊 Trạng Thái Đơn Hàng (Order Status)
- **pending**: ⏳ Chờ xác nhận
- **processing**: 🔄 Đang xử lý
- **shipped**: 🚚 Đang giao
- **delivered**: ✅ Đã giao
- **cancelled**: ❌ Đã hủy

---

## ✅ Test Checklist
- [ ] Thêm sản phẩm vào giỏ
- [ ] Điều chỉnh số lượng trong giỏ
- [ ] Xem tóm tắt đơn hàng
- [ ] Click "Tiến hành thanh toán"
- [ ] Kiểm tra redirect tới checkout
- [ ] Nhập thông tin giao hàng
- [ ] Validate form (thử trống/sai định dạng)
- [ ] Chọn phương thức thanh toán
- [ ] Click "Đặt hàng ngay"
- [ ] Xem thông báo thành công
- [ ] Redirect tới trang chi tiết đơn hàng
- [ ] Xem timeline trạng thái
- [ ] Truy cập trang "Đơn hàng"
- [ ] Lọc theo trạng thái
- [ ] Click để xem chi tiết
- [ ] Test responsive trên mobile

---

## 🚀 Tính Năng Có Thể Thêm Tiếp
- [ ] Tích hợp thanh toán VNPay/MoMo
- [ ] Tracking number theo dõi vận chuyển
- [ ] Email notification cho mỗi stage
- [ ] SMS notification
- [ ] Review/Rating sản phẩm sau khi nhận hàng
- [ ] Hóa đơn PDF download
- [ ] Hỗ trợ chat với support
- [ ] Hoàn lại hàng (return/refund)
- [ ] Mã giảm giá/Coupon
- [ ] Loyalty points
