# Hướng dẫn cấu hình Google OAuth

## ✅ Thông tin cần cấu hình

**Client ID:** `your_google_client_id_here`

**Client Secret:** `your_google_client_secret_here`

**Lưu ý:** Lấy thông tin này từ Google Cloud Console (xem hướng dẫn bên dưới)

## 📋 Các bước cấu hình trên Google Cloud Console

### 1. Truy cập Google Cloud Console
- Đi tới: https://console.cloud.google.com/
- Đăng nhập bằng tài khoản Google của bạn

### 2. Tạo hoặc chọn Project
- Click vào dropdown project ở góc trên bên trái
- Tạo project mới hoặc chọn project hiện tại

### 3. Kích hoạt Google+ API
- Đi tới **APIs & Services** > **Library**
- Tìm và kích hoạt **Google+ API**

### 4. Cấu hình OAuth Consent Screen
- Đi tới **APIs & Services** > **OAuth consent screen**
- Chọn **External** (cho phép tất cả người dùng Google đăng nhập)
- Điền thông tin:
  - **App name:** HealthyCare
  - **User support email:** Email của bạn
  - **Developer contact email:** Email của bạn
- Click **Save and Continue**

### 5. Cấu hình Authorized Redirect URIs

**Quan trọng:** Bạn cần thêm các URL sau vào **Authorized redirect URIs**:

```
http://localhost:5000/api/auth/google/callback
http://localhost:5174/auth/success
```

**Các bước thêm Redirect URIs:**
1. Đi tới **APIs & Services** > **Credentials**
2. Click vào OAuth 2.0 Client ID của bạn
3. Trong phần **Authorized redirect URIs**, click **+ ADD URI**
4. Thêm từng URL ở trên
5. Click **Save**

### 6. (Tùy chọn) Thêm Authorized JavaScript Origins

Nếu cần, thêm các domain được phép:

```
http://localhost:5174
http://localhost:5000
```

## 🔧 Cấu hình trong project

### Backend (.env)
File `.env` cần được cấu hình với:

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
```

**Lưu ý:** Thay thế placeholders bằng credentials thực tế từ Google Cloud Console.

### Passport Strategy
File `backend/config/passport.js` đã cấu hình Google Strategy với:
- Scope: `profile`, `email`
- Callback URL: `http://localhost:5000/api/auth/google/callback`

### Routes
File `backend/routes/auth.js` có các endpoint:
- `GET /api/auth/google` - Bắt đầu OAuth flow
- `GET /api/auth/google/callback` - Xử lý callback từ Google

### Frontend
File `frontend/src/pages/Login.jsx` có nút đăng nhập Google:
- Click nút → Chuyển đến `http://localhost:5000/api/auth/google`
- Google xác thực → Redirect về `/auth/success?token=...`
- OAuthCallback component xử lý token và đăng nhập

## 🧪 Test đăng nhập Google

1. **Khởi động server:**
   ```bash
   # Backend
   cd backend
   node server.js

   # Frontend
   cd frontend
   npm run dev
   ```

2. **Truy cập trang đăng nhập:**
   - Mở: http://localhost:5174/dang-nhap

3. **Click nút "Google":**
   - Trang sẽ chuyển đến Google OAuth
   - Chọn tài khoản Google
   - Cấp quyền cho app
   - Tự động redirect về trang chủ và đăng nhập thành công

## 📝 Flow hoạt động

```
User clicks "Google" button
    ↓
Frontend redirects to → http://localhost:5000/api/auth/google
    ↓
Backend redirects to → Google OAuth Consent Screen
    ↓
User authorizes app
    ↓
Google redirects to → http://localhost:5000/api/auth/google/callback
    ↓
Backend processes user data → Creates/finds user → Generates JWT token
    ↓
Backend redirects to → http://localhost:5174/auth/success?token=xxx
    ↓
OAuthCallback component → Saves token → Fetches user info → Redirects to home
    ↓
User is logged in ✅
```

## ⚠️ Lưu ý quan trọng

1. **Redirect URIs phải khớp chính xác:**
   - Trong Google Console: `http://localhost:5000/api/auth/google/callback`
   - Trong code: Phải giống hệt (bao gồm cả port)

2. **Frontend URL:**
   - Cập nhật `FRONTEND_URL` trong `.env` nếu port thay đổi
   - Hiện tại: `http://localhost:5174`

3. **Production:**
   - Khi deploy, thêm domain production vào Authorized redirect URIs
   - VD: `https://yourdomain.com/api/auth/google/callback`
   - Cập nhật BACKEND_URL và FRONTEND_URL trong .env

4. **Bảo mật:**
   - Không commit file `.env` lên Git
   - Client Secret phải được giữ bí mật
   - Trong production, sử dụng HTTPS

## 🐛 Troubleshooting

### Lỗi: "redirect_uri_mismatch"
- Kiểm tra Authorized redirect URIs trong Google Console
- Phải khớp chính xác với callback URL trong code

### Lỗi: "invalid_client"
- Kiểm tra Client ID và Client Secret trong `.env`
- Đảm bảo đã copy đúng từ Google Console

### User không được tạo/đăng nhập
- Kiểm tra MongoDB connection
- Xem logs trong backend console
- Đảm bảo Google trả về email trong profile

## 📚 Tài liệu tham khảo

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Passport Google OAuth20 Strategy](http://www.passportjs.org/packages/passport-google-oauth20/)
