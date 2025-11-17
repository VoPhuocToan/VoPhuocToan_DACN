# 📋 Hướng Dẫn Sử Dụng - Trang Liên Hệ & Giỏ Hàng

## 🎯 Tổng Quan

Dự án HealthyCare đã được bổ sung 2 trang mới:
- **Trang Liên Hệ** (`/lien-he`) - Cho phép khách hàng gửi tin nhắn
- **Trang Giỏ Hàng** (`/gio-hang`) - Quản lý sản phẩm trong giỏ

---

## 📱 Trang Liên Hệ

### Chức Năng:
- ✅ Form liên hệ với các trường: Tên, Email, Số điện thoại, Tiêu đề, Nội dung
- ✅ Validation dữ liệu phía client
- ✅ Validation Email
- ✅ Gửi dữ liệu lên backend
- ✅ Hiển thị thông báo thành công/lỗi
- ✅ Thông tin liên hệ: Hotline, Email, Địa chỉ
- ✅ Biểu đồ Google Maps nhúng
- ✅ Social media links

### Cách Truy Cập:
```
Frontend: http://localhost:5173/lien-he
Navbar: Click "Liên hệ"
Footer: Click "Liên hệ chúng tôi"
```

### API Backend:
```
POST /api/contact
Content-Type: application/json

{
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "phone": "0901234567", // Optional
  "subject": "Câu hỏi về sản phẩm",
  "message": "Tôi muốn hỏi về..."
}

Response:
{
  "success": true,
  "message": "Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể!"
}
```

---

## 🛒 Trang Giỏ Hàng

### Chức Năng:
- ✅ Xem danh sách sản phẩm trong giỏ
- ✅ Cập nhật số lượng (tăng/giảm)
- ✅ Xóa sản phẩm khỏi giỏ
- ✅ Xóa tất cả sản phẩm
- ✅ Tính tổng tiền
- ✅ Tính phí vận chuyển (miễn phí nếu > 500,000₫)
- ✅ Hiển thị tóm tắt đơn hàng
- ✅ Nút thanh toán & tiếp tục mua

### Cách Truy Cập:
```
Frontend: http://localhost:5173/gio-hang
Navbar: Click "Giỏ hàng"
```

### Quản Lý Cart:
Giỏ hàng được lưu trữ theo `userId` (guest user nếu không đăng nhập):
```javascript
const userId = localStorage.getItem('userId') || `guest_${Date.now()}`;
localStorage.setItem('userId', userId);
```

### API Backend:

#### 1. Lấy giỏ hàng
```
GET /api/cart/:userId

Response:
{
  "success": true,
  "data": {
    "_id": "...",
    "userId": "guest_...",
    "items": [
      {
        "productId": "...",
        "name": "Vitamin C 1000mg",
        "price": 150000,
        "quantity": 2,
        "image": "..."
      }
    ],
    "totalAmount": 300000,
    "totalItems": 2
  }
}
```

#### 2. Thêm sản phẩm vào giỏ
```
POST /api/cart/add
Content-Type: application/json

{
  "userId": "guest_...",
  "productId": "64a1b2c3d4e5f6g7h8i9j0k1",
  "quantity": 1
}

Response:
{
  "success": true,
  "message": "Thêm vào giỏ hàng thành công",
  "data": { ...cart }
}
```

#### 3. Cập nhật số lượng
```
PUT /api/cart/update
Content-Type: application/json

{
  "userId": "guest_...",
  "productId": "64a1b2c3d4e5f6g7h8i9j0k1",
  "quantity": 3
}

Response:
{
  "success": true,
  "message": "Cập nhật số lượng thành công",
  "data": { ...cart }
}
```

#### 4. Xóa sản phẩm
```
DELETE /api/cart/remove
Content-Type: application/json

{
  "userId": "guest_...",
  "productId": "64a1b2c3d4e5f6g7h8i9j0k1"
}

Response:
{
  "success": true,
  "message": "Xóa sản phẩm khỏi giỏ hàng thành công",
  "data": { ...cart }
}
```

#### 5. Xóa tất cả sản phẩm
```
DELETE /api/cart/clear
Content-Type: application/json

{
  "userId": "guest_..."
}

Response:
{
  "success": true,
  "message": "Xóa tất cả sản phẩm trong giỏ hàng thành công",
  "data": { ...cart }
}
```

---

## 🗂️ Cấu Trúc Thư Mục

### Backend:
```
backend/
├── controllers/
│   ├── contactController.js    ✨ NEW
│   └── cartController.js       ✨ NEW
├── models/
│   └── Cart.js                 ✨ NEW
├── routes/
│   ├── contact.js              ✨ NEW
│   └── cart.js                 ✨ NEW
└── server.js                   (updated)
```

### Frontend:
```
frontend/src/
├── pages/
│   ├── Contact.jsx             ✨ NEW
│   ├── Contact.css             ✨ NEW
│   ├── Cart.jsx                ✨ NEW
│   └── Cart.css                ✨ NEW
└── App.jsx                     (updated)
```

---

## ⚙️ Cài Đặt & Khởi Chạy

### 1. Backend
```bash
cd backend
npm install
npm start
```

Backend sẽ chạy tại: `http://localhost:5000`

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

---

## 🔗 Liên Kết Các Trang

| Trang | Đường dẫn | Navbar | Footer |
|-------|----------|--------|--------|
| Trang Chủ | `/` | Logo | - |
| Sản Phẩm | `/thuc-pham-chuc-nang` | - | ✅ |
| Chi Tiết SP | `/thuc-pham-chuc-nang/:id` | - | - |
| **Liên Hệ** | `/lien-he` | ✅ | ✅ |
| **Giỏ Hàng** | `/gio-hang` | ✅ | - |

---

## 🎨 Thiết Kế

### Màu Sắc Chính:
- **Primary Green**: `#4ade80` (hover)
- **Dark Green**: `#1a472a` (text, background)
- **Light Green**: `#e8f5e9` (background)
- **White**: `#ffffff`

### Responsive:
- 📱 Mobile (< 480px)
- 📱 Tablet (< 968px)
- 💻 Desktop (>= 1200px)

---

## 📝 Ghi Chú Quan Trọng

### Trang Liên Hệ:
1. **Email validation** được kiểm tra cả phía client và server
2. **Phone validation** là tùy chọn nhưng nếu có phải theo định dạng số
3. Tin nhắn được ghi vào console backend (để implement nodemailer sau)
4. Map Google hiện thị vị trí quán phía backend

### Trang Giỏ Hàng:
1. **Guest User**: Nếu chưa đăng nhập, giỏ hàng được lưu với ID `guest_[timestamp]`
2. **LocalStorage**: UserID được lưu để duy trì giỏ hàng
3. **Tính toán tự động**: Tổng tiền, phí vận chuyển được tính tự động khi cập nhật
4. **Vận chuyển miễn phí**: Nếu tổng tiền > 500,000₫

---

## 🚀 Các Tính Năng Sắp Tới

- [ ] Thanh toán Online (Stripe/Momo)
- [ ] Email confirmation khi gửi form liên hệ
- [ ] Login & Save Cart cho registered users
- [ ] Coupon/Promo code support
- [ ] Order history

---

## 📞 Hỗ Trợ

Nếu gặp lỗi, kiểm tra:
1. Backend server đã chạy? (`npm start` ở folder backend)
2. MongoDB đã chạy?
3. API URL có đúng không? (check `.env`)
4. Network tab ở DevTools để xem request/response

---

**Created with ❤️ for HealthyCare**
