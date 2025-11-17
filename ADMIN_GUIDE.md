# HealthyCare Admin Panel - Hướng Dẫn

## 📖 Giới thiệu

Trang Admin của dự án HealthyCare được xây dựng với React + Vite, kết nối với MongoDB thông qua backend Express.js.

## 🔐 Tài khoản Admin

- **Email**: `admin@healthycare.com`
- **Mật khẩu**: `123456`

## 🚀 Cách sử dụng

### 1. Đăng nhập vào trang admin
- Truy cập trang đăng nhập: `/dang-nhap`
- Nhập email: `admin@healthycare.com`
- Nhập mật khẩu: `123456`
- Sau khi đăng nhập, bạn sẽ thấy link "Trang quản lý" trong menu user

### 2. Truy cập trang admin
- Sau khi đăng nhập, nhấp vào "Trang quản lý" hoặc truy cập trực tiếp: `/admin`

### 3. Các chức năng admin

#### Dashboard (📊)
- Xem tổng quan các thống kê: Sản phẩm, Danh mục, Đơn hàng, Doanh thu

#### Quản lý sản phẩm (📦)
- **Xem danh sách**: `/admin/products` - Xem tất cả sản phẩm
- **Thêm sản phẩm**: `/admin/products/new` - Tạo sản phẩm mới
- **Sửa sản phẩm**: `/admin/products/:id` - Cập nhật thông tin sản phẩm
- **Xóa sản phẩm**: Xóa mềm (soft delete, đặt `isActive=false`)

#### Quản lý danh mục (📁)
- Xem danh sách các danh mục
- Thêm danh mục mới
- Xóa danh mục (nếu không có sản phẩm nào thuộc danh mục đó)

## 📁 Cấu trúc file

```
frontend/src/admin/
├── index.jsx                  # Export các components
├── AdminRoute.jsx             # Route protector (kiểm tra role admin)
├── AdminLayout.jsx            # Layout chính (sidebar + main)
├── AdminDashboard.jsx         # Trang dashboard
├── AdminProductList.jsx       # Danh sách sản phẩm
├── AdminProductForm.jsx       # Form thêm/sửa sản phẩm
├── AdminCategoryList.jsx      # Danh sách danh mục
└── admin.css                  # Styles cho admin
```

## 🔧 Thông tin kỹ thuật

### Backend endpoints

#### Authentication
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user hiện tại

#### Products (Admin protected)
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Lấy chi tiết sản phẩm
- `POST /api/products` - Tạo sản phẩm mới (require admin)
- `PUT /api/products/:id` - Cập nhật sản phẩm (require admin)
- `DELETE /api/products/:id` - Xóa sản phẩm (require admin)

#### Categories (Admin protected)
- `GET /api/categories` - Lấy danh sách danh mục
- `GET /api/categories/:id` - Lấy chi tiết danh mục
- `POST /api/categories` - Tạo danh mục mới (require admin)
- `PUT /api/categories/:id` - Cập nhật danh mục (require admin)
- `DELETE /api/categories/:id` - Xóa danh mục (require admin)

### Middleware xác thực
- `protect`: Kiểm tra JWT token hợp lệ
- `authorize('admin')`: Kiểm tra người dùng có role admin

### Frontend flow
1. Đăng nhập → Token lưu vào `localStorage.token`
2. Mỗi request admin gửi header: `Authorization: Bearer {token}`
3. Backend xác thực token và kiểm tra role
4. Nếu role = 'admin', cho phép thực hiện action

## 🛠️ Tính năng

### Quản lý sản phẩm
- ✅ Xem danh sách sản phẩm
- ✅ Thêm sản phẩm mới (với nhiều ảnh)
- ✅ Sửa thông tin sản phẩm
- ✅ Xóa sản phẩm (soft delete)
- ✅ Lọc theo danh mục
- ✅ Tìm kiếm sản phẩm

### Quản lý danh mục
- ✅ Xem danh sách danh mục
- ✅ Thêm danh mục mới
- ✅ Xóa danh mục

### Dashboard
- ✅ Thống kê số lượng sản phẩm
- ✅ Thống kê số lượng danh mục
- ✅ Thống kê số lượng đơn hàng
- ✅ Thống kê doanh thu

## ⚙️ Cấu hình

### Environment variables (`.env`)

Frontend (`frontend/.env`):
```
VITE_API_URL=http://localhost:5000
```

Backend (`backend/.env`):
```
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
OPENAI_API_KEY=your_key
```

## 🔐 Bảo mật

- Admin routes được bảo vệ bằng JWT token
- Chỉ user có `role: 'admin'` mới có thể truy cập trang admin
- Token được lưu trong `localStorage` và gửi trong header `Authorization`
- Password admin được hash bằng bcryptjs

## 🚨 Lưu ý

- Đừng chia sẻ tài khoản admin
- Thay đổi mật khẩu admin sau khi triển khai production
- Bảo mật `.env` files (chứa sensitive information)
- Kiểm tra MongoDB connection trước khi sử dụng

## 📞 Support

Nếu gặp lỗi, kiểm tra:
1. Backend server đang chạy: `npm start` ở folder `backend/`
2. Frontend dev server: `npm run dev` ở folder `frontend/`
3. MongoDB connection hoạt động
4. Token hợp lệ trong `localStorage`
5. CORS settings trong `backend/server.js`

---

**Tạo ngày**: 17/11/2025
**Version**: 1.0
