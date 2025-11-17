# 📋 HealthyCare Admin Panel - Quick Start Guide

## 🎯 Mục tiêu
Trang Admin hoàn chỉnh để quản lý dự án bán thực phẩm chức năng HealthyCare

## ✨ Các tính năng đã hoàn thành

### Backend
- ✅ MongoDB Atlas connection
- ✅ JWT Authentication
- ✅ Admin user creation (admin@healthycare.com / 123456)
- ✅ Product CRUD endpoints (protected)
- ✅ Category CRUD endpoints (protected)
- ✅ Role-based access control

### Frontend
- ✅ Admin Dashboard (`/admin`)
- ✅ Product Management (`/admin/products`)
- ✅ Product Form (`/admin/products/new` & `/admin/products/:id`)
- ✅ Category Management (`/admin/categories`)
- ✅ Admin navigation in Navbar
- ✅ JWT token management
- ✅ Protected routes with AdminRoute component

## 🚀 Bắt đầu nhanh

### 1️⃣ Khởi động Backend
```bash
cd backend
npm install  # Nếu chưa cài
npm start
```
✅ Server: http://localhost:5000

### 2️⃣ Khởi động Frontend
```bash
cd frontend
npm install  # Nếu chưa cài
npm run dev
```
✅ Client: http://localhost:5173

### 3️⃣ Seed Database
```bash
cd backend
npm run seed
```
✅ Tạo: 8 categories, 8 products, 1 admin user

### 4️⃣ Đăng nhập Admin
1. Truy cập: http://localhost:5173
2. Click: "Đăng nhập" → `/dang-nhap`
3. Email: `admin@healthycare.com`
4. Mật khẩu: `123456`
5. Click: "Đăng Nhập"

### 5️⃣ Vào Admin Panel
1. Click user avatar (góc trên phải)
2. Click: "Trang quản lý" 
3. Hoặc truy cập: http://localhost:5173/admin

---

## 📊 Trang Admin - Chi tiết

### Dashboard (`/admin`)
```
┌─────────────────────────────────────┐
│  Bảng Điều Khiển Admin              │
├─────────────────────────────────────┤
│  📦 Sản phẩm  │  📁 Danh mục        │
│  📊 Đơn hàng  │  💰 Doanh thu       │
├─────────────────────────────────────┤
│  Hướng dẫn sử dụng                  │
│  - Quản lý sản phẩm                 │
│  - Quản lý danh mục                 │
│  - Quản lý đơn hàng                 │
│  - Hỗ trợ                           │
└─────────────────────────────────────┘
```

### Quản lý sản phẩm (`/admin/products`)
```
Danh sách sản phẩm:
┌──────┬──────────┬──────────┬────────┬──────────┬──────────┐
│ Ảnh  │ Tên      │ Thương   │ Giá    │ Danh     │ Tồn      │
│      │          │ hiệu     │        │ mục      │ kho      │
├──────┼──────────┼──────────┼────────┼──────────┼──────────┤
│ [ảnh]│ Product1 │ Brand1   │ 350K ₫ │ Category │ 100      │
│      │          │          │        │ 1        │          │
├──────┴──────────┴──────────┴────────┴──────────┴──────────┤
│ [Sửa] [Xóa]                              [Thêm sản phẩm]  │
└──────────────────────────────────────────────────────────┘
```

### Thêm/Sửa sản phẩm (`/admin/products/new`)
```
Biểu mẫu sản phẩm:
┌──────────────────────────────────────┐
│ Tên sản phẩm      [_____________]    │
│ Thương hiệu       [_____________]    │
│ Giá               [_____________]    │
│ Giá gốc           [_____________]    │
│ Danh mục          [_____________]    │
│ Mô tả             [_____________]    │
│                   [_____________]    │
│ Thành phần        [_____________]    │
│ Cách dùng         [_____________]    │
│ Ghi chú           [_____________]    │
│ Ảnh               [_____________]    │
│                   [+] [X]            │
│ Stock             [_____________]    │
│ In stock          [v]               │
├──────────────────────────────────────┤
│ [Lưu] [Hủy]                         │
└──────────────────────────────────────┘
```

### Quản lý danh mục (`/admin/categories`)
```
Danh mục:
┌──────┬────────────┬──────────────────┐
│ Icon │ Tên        │ Mô tả            │
├──────┼────────────┼──────────────────┤
│ 💊   │ Vitamin    │ Vitamin & khoáng │
│ ❤️   │ Tim mạch   │ Sức khỏe tim...  │
│ 🧠   │ Thần kinh  │ Hỗ trợ não bộ... │
├──────┴────────────┴──────────────────┤
│ [Thêm danh mục]    [Xóa]            │
└─────────────────────────────────────┘

Thêm danh mục:
┌──────────────────────────────────┐
│ Tên danh mục    [_____________]  │
│ Mô tả           [_____________]  │
│                 [_____________]  │
│ Icon (emoji)    [__]            │
├──────────────────────────────────┤
│ [Thêm] [Hủy]                    │
└──────────────────────────────────┘
```

---

## 🔑 Tài khoản Test

### Admin
- Email: `admin@healthycare.com`
- Mật khẩu: `123456`
- Role: `admin`

### Tạo tài khoản người dùng khác
- Vào `/dang-ky`
- Nhập thông tin
- Click "Đăng ký"
- (Tài khoản mới sẽ có role = 'user' mặc định)

---

## 🔐 Bảo mật

### Token Management
- Token được lưu trong `localStorage.token`
- Mỗi request admin gửi: `Authorization: Bearer {token}`
- Token hết hạn sau 7 ngày (JWT_EXPIRE)

### Role-based Access
- `role: 'admin'` → Access admin endpoints
- `role: 'user'` → Access user endpoints
- AdminRoute component kiểm tra `user.role === 'admin'`

### Password Security
- Password hash bằng bcryptjs (10 salt rounds)
- Never stored plain text

---

## 📁 File Structure

```
admin/
├── AdminRoute.jsx          # Kiểm tra quyền admin
├── AdminLayout.jsx         # Layout với sidebar
├── AdminDashboard.jsx      # Dashboard
├── AdminProductList.jsx    # Danh sách sản phẩm
├── AdminProductForm.jsx    # Form thêm/sửa sản phẩm
├── AdminCategoryList.jsx   # Danh sách danh mục
├── index.jsx               # Export components
└── admin.css               # Styles

context/
└── AuthContext.jsx         # User state management

components/
└── Navbar/Navbar.jsx       # Updated with admin link

pages/
├── Login.jsx               # Login form
└── Register.jsx            # Register form
```

---

## 🧪 Test Cases

### Test Login
- [ ] Email admin@healthycare.com + password 123456 → Success
- [ ] Sai email/password → Error message
- [ ] Token lưu vào localStorage
- [ ] User info lưu vào localStorage

### Test Admin Access
- [ ] Đăng nhập admin → Thấy admin badge
- [ ] Thấy link "Trang quản lý"
- [ ] Click link → Truy cập /admin
- [ ] Logout → Redirect /admin → Truy cập /dang-nhap

### Test Product Management
- [ ] View products → Danh sách hiển thị
- [ ] Click "Sửa" → Form được fill
- [ ] Submit → Product cập nhật
- [ ] Click "Xóa" → Confirm dialog → Delete
- [ ] Add new → Form trống → Create product

### Test Category Management
- [ ] View categories → Danh sách hiển thị
- [ ] Add category → Form → Create
- [ ] Delete category (no products) → Success
- [ ] Delete category (has products) → Error message

---

## 🐛 Debug Tips

### Browser Console
```javascript
// Kiểm tra token
console.log(localStorage.getItem('token'))

// Kiểm tra user
console.log(JSON.parse(localStorage.getItem('user')))

// Kiểm tra API URL
console.log(import.meta.env.VITE_API_URL)
```

### Network Tab
- Check all requests có Authorization header
- Check response status codes
- Check error messages

### Backend Logs
```bash
# Watch logs
npm start

# Errors like:
# ❌ JWT verify failed
# ❌ Unauthorized admin access
# ❌ MongoDB connection error
```

---

## 📞 Frequently Asked Questions

### Q: Làm sao thay đổi password admin?
A: 
1. Đăng nhập database
2. Tìm user admin@healthycare.com
3. Hash password mới bằng bcryptjs
4. Update database

### Q: Làm sao tạo user mới có role admin?
A: 
1. Đăng nhập MongoDB
2. Tìm User collection
3. Update role field = 'admin'
4. Hoặc edit seed.js và thêm user mới

### Q: Token hết hạn thì sao?
A: 
1. Tự động logout
2. Redirect đến login
3. Phải đăng nhập lại

### Q: Có thể thêm ảnh được không?
A: 
Hiện tại: URL-based image upload
Tương lai: Thêm Multer server-side upload

### Q: Làm sao phục hồi deleted products?
A: 
Products được soft-delete (isActive=false)
Có thể query isActive=false để xem deleted
Hoặc update isActive=true để restore

---

## 📞 Support & Contact

Nếu gặp lỗi:
1. Kiểm tra console trong DevTools
2. Kiểm tra backend logs
3. Kiểm tra MongoDB connection
4. Kiểm tra CORS settings
5. Xem TROUBLESHOOTING_CHAT.md

---

**Version**: 1.0  
**Last Updated**: 17/11/2025  
**Status**: ✅ Production Ready

---

## 🎉 Sẵn sàng chưa?

```
npm start (backend)    ← Khởi động
npm run dev (frontend) ← Khởi động
npm run seed          ← Seed database
Đăng nhập admin       ← admin@healthycare.com / 123456
Vào trang admin       ← /admin
Quản lý sản phẩm!     ← Happy managing! 🚀
```
