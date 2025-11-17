# 🔐 Hướng Dẫn Đăng Nhập & Đăng Ký - HealthyCare

## 📋 Tổng Quan

Dự án HealthyCare đã được bổ sung hệ thống **Authentication** đầy đủ với:
- ✅ Trang Đăng Nhập (`/dang-nhap`)
- ✅ Trang Đăng Ký (`/dang-ky`)
- ✅ JWT Token Management
- ✅ Auth Context (Global State)
- ✅ User Dropdown Menu
- ✅ Protected Routes Ready

---

## 🔑 Trang Đăng Nhập

### Chức Năng:
- 📧 Đăng nhập với Email & Mật khẩu
- 👁️ Toggle hiển thị/ẩn mật khẩu
- ☑️ Nhớ tôi (Ready for implementation)
- 🔗 Liên kết "Quên mật khẩu"
- 👥 Social Login (Google, Facebook - skeleton)
- 📱 Responsive Design
- ✅ Validation đầy đủ
- 🎯 Redirect sau đăng nhập thành công

### Validation Rules:
```javascript
- Email: Bắt buộc, định dạng hợp lệ
- Password: Bắt buộc, ít nhất 6 ký tự
```

### API Call:
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Nguyễn Văn A",
    "email": "user@example.com",
    "phone": "0901234567",
    "avatar": "...",
    "role": "user",
    "token": "eyJhbGciOiJIUzI1NiIs..." 
  }
}
```

### Truy Cập:
```
http://localhost:5173/dang-nhap
Navbar: Click "Đăng nhập" (khi chưa đăng nhập)
```

---

## 📝 Trang Đăng Ký

### Chức Năng:
- 👤 Nhập Họ Tên
- 📧 Nhập Email
- 📱 Nhập Số Điện Thoại (Tùy chọn)
- 🔐 Nhập Mật Khẩu
- ✔️ Xác Nhận Mật Khẩu
- 📋 Chấp nhận Điều khoản
- 👁️ Toggle hiển thị mật khẩu
- 🎯 Validation hàng loạt

### Validation Rules:
```javascript
- Name: Bắt buộc, ít nhất 3 ký tự
- Email: Bắt buộc, định dạng hợp lệ
- Phone: Tùy chọn, nếu có phải định dạng số
- Password: Bắt buộc, ít nhất 6 ký tự
- Confirm Password: Phải khớp với Password
- Terms: Bắt buộc phải chấp nhận
```

### API Call:
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "phone": "0901234567", // Optional
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Nguyễn Văn A",
    "email": "user@example.com",
    "phone": "0901234567",
    "role": "user",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Truy Cập:
```
http://localhost:5173/dang-ky
Footer/Login page: Click "Đăng ký"
```

---

## 🔐 Auth Context & State Management

### File: `src/context/AuthContext.jsx`

Quản lý trạng thái đăng nhập toàn app:

```javascript
import { useAuth } from './context/AuthContext'

// Sử dụng trong component:
const MyComponent = () => {
  const { user, token, isAuthenticated, isLoading, logout } = useAuth()

  if (isAuthenticated) {
    return <div>Welcome {user.name}!</div>
  }
}
```

### Các thuộc tính:
| Thuộc tính | Kiểu | Mô tả |
|-----------|------|-------|
| `user` | Object/null | Thông tin user |
| `token` | String/null | JWT Token |
| `isAuthenticated` | Boolean | Đã đăng nhập? |
| `isLoading` | Boolean | Đang load? |
| `logout()` | Function | Đăng xuất |

### Lưu trữ:
- **Token**: `localStorage.token`
- **User Info**: `localStorage.user` (JSON)
- **UserID (Cart)**: `localStorage.userId`

---

## 👤 User Dropdown Menu

### Hiển thị khi Đăng Nhập:
```
┌─────────────────┐
│ Avatar  Tên ▼   │
└─────────────────┘
        ↓
┌──────────────────────┐
│ email@example.com    │
├──────────────────────┤
│ 👤 Tài khoản của tôi │
│ 📄 Đơn hàng của tôi   │
│ ❤️ Sản phẩm yêu thích  │
├──────────────────────┤
│ 🚪 Đăng xuất        │
└──────────────────────┘
```

### Features:
- Hiển thị tên người dùng
- Avatar (nếu có)
- Menu dropdown khi click
- Logout button
- Click anywhere để đóng

---

## 🔄 Luồng Đăng Nhập/Đăng Ký

```
┌──────────┐
│ Register │ ──> Email validation ──> Server ──> Token saved
└──────────┘                           ✓
                                       │
                         ┌─────────────┴─────────────┐
                         │   localStorage.token      │
                         │   localStorage.user       │
                         └─────────────┬─────────────┘
                                       │
                    ┌──────────────────┴──────────────────┐
                    │ AuthContext updated                 │
                    │ - user & token state updated        │
                    │ - isAuthenticated = true            │
                    └──────────────────┬──────────────────┘
                                       │
                    ┌──────────────────┴──────────────────┐
                    │ Navbar updated                      │
                    │ - Hiển thị User Avatar & Menu       │
                    │ - Ẩn Login/Register buttons         │
                    └──────────────────┬──────────────────┘
                                       │
                    ┌──────────────────┴──────────────────┐
                    │ Redirect to Home (/)               │
                    └────────────────────────────────────┘
```

---

## 🧪 Test Đăng Ký & Đăng Nhập

### Tài khoản Test:
**Nếu backend có seed data sẵn:**
```
Email: test@example.com
Password: password123
```

### Tạo Tài Khoản Mới:
1. Go to http://localhost:5173/dang-ky
2. Điền đầy đủ thông tin
3. Click "Đăng Ký"
4. Tự động redirect to Home
5. Xem Avatar & Name ở Navbar

### Đăng Nhập:
1. Go to http://localhost:5173/dang-nhap
2. Nhập Email & Password
3. Click "Đăng Nhập"
4. Tự động redirect to Home

### Logout:
1. Click Avatar ở Navbar
2. Click "Đăng xuất"
3. Redirect to Home (không xác thực)

---

## 📁 Cấu Trúc File

### Backend:
```
backend/
├── controllers/
│   └── authController.js    (register, login, getMe, logout, updateProfile)
├── routes/
│   └── auth.js              (Router)
└── middleware/
    └── auth.js              (JWT verification)
```

### Frontend:
```
frontend/src/
├── pages/
│   ├── Login.jsx
│   ├── Login.css
│   ├── Register.jsx
│   └── Register.css
├── context/
│   └── AuthContext.jsx      (useAuth hook)
├── components/
│   └── Navbar/
│       └── Navbar.jsx       (Updated with user menu)
└── App.jsx                  (AuthProvider wrapper)
```

---

## 🛡️ Protected Routes (Sắp tới)

Tạo PrivateRoute component:

```javascript
import { Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <div>Loading...</div>
  
  return isAuthenticated ? children : <Navigate to='/dang-nhap' />
}

// Sử dụng:
<Route path='/checkout' element={<PrivateRoute><Checkout /></PrivateRoute>} />
```

---

## 🔗 API Endpoints

### Auth Routes (Backend):
```
POST   /api/auth/register     - Đăng ký user mới
POST   /api/auth/login        - Đăng nhập
GET    /api/auth/me           - Lấy info user hiện tại (Private)
GET    /api/auth/logout       - Đăng xuất (Private)
PUT    /api/auth/profile      - Cập nhật profile (Private)
```

---

## 📝 Notes

1. **Token Expiry**: Mặc định 7 ngày (JWT_EXPIRE=7d)
2. **Password Hashing**: Sử dụng bcryptjs (tự động)
3. **Token Storage**: Lưu ở localStorage (có thể chuyển sang httpOnly cookie)
4. **CORS**: Đã cấu hình cho frontend URL
5. **Email Validation**: Kiểm tra regex đơn giản, có thể tăng cường

---

## ⚙️ Cài Đặt Thêm

### Bảo mật Token (Nâng cao):
```javascript
// Thay localStorage bằng httpOnly cookie:
// Backend: res.cookie('token', token, { httpOnly: true })
// Frontend: Tự động gửi kèm headers
```

### Forgot Password:
```javascript
// Sắp tới: POST /api/auth/forgot-password
// Gửi email reset link
```

### Social Login:
```javascript
// Skeleton code đã sẵn sàng
// Cần integrate: Google OAuth, Facebook SDK
```

---

## 🚀 Tóm Tắt

✅ **Hoàn thành:**
- Login & Register pages
- Form validation
- JWT authentication
- Auth Context (global state)
- User dropdown menu
- Navbar integration

🔜 **Sắp tới:**
- Protected routes
- Forgot password
- Social login
- Email verification
- 2-factor authentication

---

**Created with ❤️ for HealthyCare**
