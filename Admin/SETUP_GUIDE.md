# Admin Panel - Complete Setup & Testing Guide

## ✅ Rebuild Complete

The Admin panel has been completely rebuilt with the following improvements:

1. **Updated Context**: Changed from `AuthContext` to `StoreContext` with debug logging
2. **Updated Components**: Created `Sidebar.jsx` with proper styling and navigation
3. **Updated All Pages**: Login, Dashboard, ProductList, ProductForm, Categories
4. **Consistent API URLs**: All components now use `API_URL` from StoreContext
5. **Better Error Handling**: All fetch calls include proper error logging

---

## 📁 Folder Structure

```
Admin/vite-project/
├── src/
│   ├── components/
│   │   ├── ProtectedRoute.jsx       (Route protection with role checking)
│   │   └── Sidebar.jsx               (Main navigation sidebar)
│   ├── context/
│   │   └── StoreContext.jsx          (Global state management with login function)
│   ├── pages/
│   │   ├── Dashboard.jsx             (Stats dashboard)
│   │   ├── ProductList.jsx           (Product table with CRUD)
│   │   ├── ProductForm.jsx           (Add/Edit product form)
│   │   ├── Categories.jsx            (Category management)
│   │   └── Login.jsx                 (Admin login page)
│   ├── styles/
│   │   ├── index.css                 (Global styles)
│   │   ├── Login.css                 (Login page styles)
│   │   ├── Sidebar.css               (Sidebar styles)
│   │   ├── Dashboard.css             (Dashboard styles)
│   │   ├── Products.css              (Products page styles)
│   │   ├── ProductForm.css           (Product form styles)
│   │   └── Categories.css            (Categories page styles)
│   ├── App.jsx                       (Main app with routing)
│   └── main.jsx                      (Entry point)
├── package.json
├── vite.config.js
├── index.html
└── README.md
```

---

## 🚀 Running the Admin Panel

### Option 1: From Admin folder
```powershell
cd Admin\vite-project
npm install  # Only first time
npm run dev
```

### Option 2: From project root
```powershell
cd Admin\vite-project
npm run dev
```

The admin panel will start on:
- **http://localhost:5174** (if port available)
- **http://localhost:5175+** (if 5174 is in use)

---

## 🔐 Login Credentials

**Email**: `admin@healthycare.com`  
**Password**: `123456`

---

## ✨ How It Works

### 1. **StoreContext** (Global State Management)
   - Manages `user`, `token`, `isAuthenticated`, `loading`, `error`
   - Provides `login(email, password)` function
   - Sets `API_URL = 'http://localhost:5000/api'`
   - Stores token in localStorage for persistence

### 2. **Login Flow**
   1. User fills email and password on `/login` page
   2. Calls `login()` function from `StoreContext`
   3. Function sends POST to `http://localhost:5000/api/auth/login`
   4. On success: saves token, sets user, redirects to dashboard
   5. On error: displays error message with detailed debug logs

### 3. **Protected Routes**
   - `ProtectedRoute` component checks `isAuthenticated`
   - Checks if user role is `'admin'`
   - Redirects non-authenticated users to `/login`

### 4. **API Integration**
   - All components use `useStore()` hook
   - Access `API_URL` and `token` from context
   - All fetch requests include `Authorization: Bearer {token}` header
   - Proper error handling and loading states

---

## 🧪 Testing Checklist

### Backend Status
- ✅ Backend running on `http://localhost:5000`
- ✅ MongoDB connected (Atlas)
- ✅ Admin user in database: `admin@healthycare.com` / `123456`
- ✅ All CRUD endpoints working

### Frontend Testing

#### 1. Test Login
```
1. Navigate to http://localhost:5174 (or 5175)
2. Enter: admin@healthycare.com
3. Enter: 123456
4. Click "Đăng Nhập"
5. Should redirect to Dashboard
6. Check browser console for [DEBUG] logs
```

#### 2. Test Dashboard
```
1. After login, should see Dashboard with:
   - Total Products count
   - Total Categories count
   - Total Orders count
   - Total Revenue
2. Sidebar shows navigation menu
```

#### 3. Test Products Page
```
1. Click "🛍️ Products" in sidebar
2. Should display table with all products
3. Try "Sửa" (Edit) - should load product form
4. Try "Xóa" (Delete) - should prompt and delete
5. Click "➕ Add Product" to create new product
```

#### 4. Test Categories Page
```
1. Click "📑 Categories" in sidebar
2. Should display all categories
3. Try "Thêm danh mục" to add new category
4. Try "Xóa" to delete category
```

#### 5. Test Logout
```
1. Click "🚪 Logout" button in sidebar footer
2. Should redirect to login page
3. Token should be cleared from localStorage
```

---

## 🔧 Environment Variables

No `.env` file needed for Admin panel. Everything is hardcoded:
- **API_URL**: `http://localhost:5000/api`
- **Auth Endpoint**: `{API_URL}/auth/login`

To change the API URL, edit `src/context/StoreContext.jsx` line 13:
```javascript
const API_URL = 'http://localhost:5000/api';  // Change this
```

---

## 📊 Key Endpoints Used

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/auth/login` | POST | No | Admin login |
| `/api/products` | GET | No | List all products |
| `/api/products` | POST | Yes | Create product |
| `/api/products/{id}` | PUT | Yes | Update product |
| `/api/products/{id}` | DELETE | Yes | Delete product |
| `/api/categories` | GET | No | List all categories |
| `/api/categories` | POST | Yes | Create category |
| `/api/categories/{id}` | DELETE | Yes | Delete category |
| `/api/orders` | GET | Yes | List all orders |

---

## 🐛 Debugging

### Check Backend Logs
Look for: `[DEBUG]` messages in browser console when testing

### If Login Fails
1. Check backend is running: `Get-Process node`
2. Test endpoint directly:
```powershell
$body = @{email="admin@healthycare.com";password="123456"} | ConvertTo-Json
Invoke-WebRequest -Uri http://localhost:5000/api/auth/login -Method POST -Body $body -Headers @{"Content-Type"="application/json"} | Select -ExpandProperty Content
```
3. Check MongoDB is connected
4. Check token is saved in localStorage

### Browser Console
- Open DevTools (F12)
- Go to Console tab
- Look for [DEBUG] logs from StoreContext
- Check Network tab for API calls

---

## 📝 Files Modified

From Old Structure to New Structure:

| Old File | New File | Changes |
|----------|----------|---------|
| `context/AuthContext.jsx` | `context/StoreContext.jsx` | Renamed, added debug logs |
| `components/Layout.jsx` | `components/Sidebar.jsx` | Recreated as standalone sidebar |
| `pages/Login.jsx` | `pages/Login.jsx` | Updated to use StoreContext |
| `pages/Dashboard.jsx` | `pages/Dashboard.jsx` | Updated to use StoreContext |
| `pages/ProductList.jsx` | `pages/ProductList.jsx` | Updated API_URL references |
| `pages/ProductForm.jsx` | `pages/ProductForm.jsx` | Updated API_URL references |
| `pages/Categories.jsx` | `pages/Categories.jsx` | Updated API_URL references |
| `src/App.jsx` | `src/App.jsx` | Updated routing and imports |

---

## ✅ Verification Steps

Run these after starting the admin panel:

1. **Check frontend loads**: http://localhost:5174 or http://localhost:5175
2. **See login page**: Should display login form with demo credentials
3. **Click login**: Should see [DEBUG] logs in console
4. **Check token**: Open DevTools → Application → LocalStorage → should have `adminToken`
5. **Navigate pages**: Should work smoothly without "Cannot connect" errors

---

## 🎉 Success Indicators

You'll know everything is working when:
- ✅ Login page loads without errors
- ✅ Can login with admin@healthycare.com / 123456
- ✅ Redirects to Dashboard after login
- ✅ Sidebar appears with navigation
- ✅ Can view products, categories, orders
- ✅ Can add, edit, delete items
- ✅ Logout clears session and redirects to login
- ✅ Browser console shows no connection errors

---

## 🚀 Next Steps

If you encounter any issues:

1. **Check Backend Running**:
   ```powershell
   curl.exe -I http://localhost:5000
   ```

2. **Restart Admin Panel**:
   ```powershell
   cd Admin\vite-project
   npm run dev
   ```

3. **Clear Cache & Restart**:
   - Close browser
   - Delete localStorage: DevTools → Application → LocalStorage → Clear All
   - Refresh page

4. **Check Seed Data**:
   ```powershell
   cd backend
   npm run seed
   ```

---

**Last Updated**: After complete Admin folder rebuild with StoreContext and Sidebar components
**Status**: ✅ Ready for Production Testing
