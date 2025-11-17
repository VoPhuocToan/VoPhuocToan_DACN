# 🚀 HealthyCare - Hướng dẫn chạy toàn bộ dự án

## 📋 Cấu trúc dự án

```
Healthycare/
├── backend/               # Node.js + Express + MongoDB
├── frontend/              # React Vite (main website)
└── Admin/vite-project/    # React Vite (admin panel)
```

---

## 🚀 Bước 1: Khởi động Backend

```bash
cd backend
npm install
npm start
```

✅ Backend chạy trên: **http://localhost:5000**

---

## 🚀 Bước 2: Khởi động Frontend (Main Website)

**Mở terminal mới:**

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend chạy trên: **http://localhost:5173**

---

## 🚀 Bước 3: Khởi động Admin Panel

**Mở terminal mới:**

```bash
cd Admin/vite-project
npm install
npm run dev
```

✅ Admin panel chạy trên: **http://localhost:5174**

---

## 🗄️ Bước 4: Seed Database (nếu chưa có)

**Quay lại terminal backend:**

```bash
npm run seed
```

✅ Tạo: 8 categories, 8 products, admin user

---

## 🔐 Đăng nhập Admin

### Admin Panel
1. Truy cập: **http://localhost:5174**
2. Email: `admin@healthycare.com`
3. Mật khẩu: `123456`
4. Click "Đăng Nhập"

### Main Website
1. Truy cập: **http://localhost:5173**
2. Click "Đăng nhập"
3. Email: `admin@healthycare.com`
4. Mật khẩu: `123456`

---

## 📊 Admin Panel Features

| Route | Chức năng |
|-------|----------|
| `/` | Dashboard - Thống kê |
| `/products` | Danh sách sản phẩm |
| `/products/new` | Thêm sản phẩm |
| `/products/:id` | Sửa sản phẩm |
| `/categories` | Quản lý danh mục |

---

## 🖥️ Screenshots

```
┌──────────────────────────────────────────────────┐
│ Admin Panel (http://localhost:5174)              │
├──────────────┬──────────────────────────────────┤
│              │                                  │
│ 🏥 Admin     │     Dashboard                    │
│              │     📊 📦 📁 💰                   │
│ 📊 Dashboard │                                  │
│ 📦 Sản phẩm  │                                  │
│ ➕ Thêm SP   │                                  │
│ 📁 Danh mục  │                                  │
│              │                                  │
│ Admin User   │                                  │
│ [Đăng xuất]  │                                  │
│              │                                  │
└──────────────┴──────────────────────────────────┘
```

---

## 🧪 Test Checklist

- [ ] Backend chạy port 5000
- [ ] Frontend chạy port 5173
- [ ] Admin panel chạy port 5174
- [ ] MongoDB connected
- [ ] Seed script chạy thành công
- [ ] Đăng nhập admin (5174) thành công
- [ ] Dashboard tải thành công
- [ ] Có thể xem danh sách sản phẩm
- [ ] Có thể thêm/sửa/xóa sản phẩm
- [ ] Có thể quản lý danh mục

---

## 🐛 Troubleshooting

### Backend không kết nối MongoDB
```
Kiểm tra:
1. MongoDB Atlas đang online
2. .env có MONGODB_URI
3. IP whitelist trong Atlas
```

### Admin panel không tải
```
Kiểm tra:
1. npm install hoàn tất
2. npm run dev chạy (port 5174)
3. Backend chạy (port 5000)
```

### Đăng nhập không được
```
Kiểm tra:
1. Admin user đã seed (npm run seed)
2. Backend chạy
3. Email: admin@healthycare.com
4. Mật khẩu: 123456
```

---

## 📝 File chính

| File | Mô tả |
|------|-------|
| `backend/server.js` | Backend entry point |
| `backend/.env` | Environment variables |
| `frontend/src/App.jsx` | Frontend main app |
| `Admin/vite-project/src/App.jsx` | Admin panel main app |

---

## 💡 Lưu ý

1. **3 terminals cần chạy cùng lúc**:
   - Terminal 1: Backend (5000)
   - Terminal 2: Frontend (5173)
   - Terminal 3: Admin (5174)

2. **Admin panel độc lập** - Không liên quan đến frontend main website

3. **Cùng backend API** - Admin & Frontend đều dùng backend trên port 5000

4. **MongoDB Atlas** - Đảm bảo connection string đúng trong `.env`

---

**✅ Tất cả sẵn sàng!**

Chạy 3 commands này ở 3 terminal khác nhau:
```bash
npm start              # Terminal 1 (backend)
npm run dev            # Terminal 2 (frontend)
npm run dev            # Terminal 3 (Admin)
```

Sau đó vào:
- Admin: http://localhost:5174
- Website: http://localhost:5173
- Backend: http://localhost:5000

Enjoy! 🚀
