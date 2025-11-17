# Admin Panel - Quick Start Guide

## Quick Setup (3 Steps)

### Step 1: Start Backend
```powershell
cd backend
node .\server.js
```
Expected output: `🚀 Server is running on port 5000` + `✅ MongoDB Connected`

### Step 2: Start Admin Panel  
Open a new terminal:
```powershell
cd Admin\vite-project
npm run dev
```
Expected: `VITE v5.4.21 ready in ...ms` + `Local: http://localhost:5174` or `5175`

### Step 3: Test Login
1. Open http://localhost:5174 or http://localhost:5175
2. Enter: **admin@healthycare.com**
3. Enter: **123456**
4. Click **Đăng Nhập**
5. Should see Dashboard with data

---

## ✅ Full System Status

| Component | Port | Status | Required |
|-----------|------|--------|----------|
| Backend (Express) | 5000 | ✅ Running | Yes |
| MongoDB (Atlas) | - | ✅ Connected | Yes |
| Admin Panel (Vite) | 5174/5175 | ✅ Running | Yes |
| Frontend (Vite) | 5173 | Optional | No |

---

## 🔑 Login Credentials

```
Email:    admin@healthycare.com
Password: 123456
```

---

## 📱 Admin Features

- ✅ **Dashboard**: View stats (products, categories, orders, revenue)
- ✅ **Products**: List, Add, Edit, Delete products
- ✅ **Categories**: List, Add, Delete categories  
- ✅ **Navigation**: Sidebar menu for quick access
- ✅ **Logout**: Clear session and return to login

---

## 🐛 Troubleshooting

### "Cannot connect to server"
- Make sure Backend is running on port 5000
- Check MongoDB connection in backend logs
- Try refreshing the page

### "Port already in use"
- Admin: Will auto-switch to 5175, 5176, etc.
- Backend: Kill process: `Get-Process node | Stop-Process -Force`

### "Login fails"
- Check credentials: admin@healthycare.com / 123456
- Check backend logs for errors
- Open DevTools Console for [DEBUG] logs

### "Cannot see products/categories"
- Make sure seed was run: `cd backend; npm run seed`
- Check MongoDB has data: Check Atlas console

---

## 🚀 Full URLs Reference

| What | URL |
|------|-----|
| Admin Panel | http://localhost:5174 |
| Backend API | http://localhost:5000 |
| Login Endpoint | http://localhost:5000/api/auth/login |
| Products API | http://localhost:5000/api/products |
| Categories API | http://localhost:5000/api/categories |

---

For detailed setup and testing guide, see `SETUP_GUIDE.md`
