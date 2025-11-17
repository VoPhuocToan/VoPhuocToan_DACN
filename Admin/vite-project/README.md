# HealthyCare Admin Panel

**Admin Panel riêng biệt** chuyên dụng để quản lý dự án bán thực phẩm chức năng HealthyCare.

## 🚀 Khởi động

```bash
cd Admin/vite-project
npm install
npm run dev
```

Admin panel sẽ chạy tại: **http://localhost:5174**

## 📖 Cấu trúc

```
Admin/vite-project/
├── src/
│   ├── components/
│   │   ├── Layout.jsx          # Sidebar + main layout
│   │   └── ProtectedRoute.jsx  # Route protector
│   ├── context/
│   │   └── AuthContext.jsx     # Auth state
│   ├── pages/
│   │   ├── Login.jsx           # Login page
│   │   ├── Dashboard.jsx       # Dashboard
│   │   ├── ProductList.jsx     # Danh sách sản phẩm
│   │   ├── ProductForm.jsx     # Thêm/sửa sản phẩm
│   │   └── Categories.jsx      # Quản lý danh mục
│   ├── styles/
│   │   ├── index.css
│   │   ├── Login.css
│   │   ├── Layout.css
│   │   ├── Dashboard.css
│   │   ├── Products.css
│   │   ├── ProductForm.css
│   │   └── Categories.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## 🔐 Tài khoản Admin

- **Email**: admin@healthycare.com
- **Mật khẩu**: 123456

## 📊 Tính năng

- ✅ Dashboard với thống kê
- ✅ Quản lý sản phẩm (CRUD)
- ✅ Quản lý danh mục
- ✅ JWT Authentication
- ✅ Responsive design
- ✅ Protected routes

## 🔗 API Connection

Admin panel kết nối với backend tại: **http://localhost:5000**

---

Chạy `npm install` rồi `npm run dev` để bắt đầu!
