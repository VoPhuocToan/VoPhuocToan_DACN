# Hướng Dẫn Cấu Hình Google Login

## ✅ Đã Hoàn Thành

- ✅ Bỏ nút đăng nhập Facebook
- ✅ Nút Google login hiển thị toàn bộ chiều rộng
- ✅ Sửa lỗi redirect URL (5173 thay vì 5174)
- ✅ Backend đã khởi động lại với cấu hình mới

## 🔧 Cấu Hình Google Cloud Console

### Bước 1: Truy cập Google Cloud Console

1. Mở trình duyệt và truy cập: https://console.cloud.google.com
2. Đăng nhập bằng tài khoản Google của bạn
3. Chọn project hiện tại hoặc tạo project mới

### Bước 2: Cấu hình OAuth 2.0 Credentials

1. Ở menu bên trái, chọn **"APIs & Services"** > **"Credentials"**
2. Tìm OAuth 2.0 Client ID đã tạo (tên: Web client)
3. Click vào biểu tượng **"Edit"** (bút chì)

### Bước 3: Thêm Authorized Redirect URIs

Trong phần **"Authorized redirect URIs"**, thêm 2 URL sau:

```
http://localhost:5000/api/auth/google/callback
http://localhost:5173/auth/success
```

**Lưu ý:** 
- Phải thêm CHÍNH XÁC 2 URL này
- Không có dấu `/` ở cuối URL
- Port phải đúng (5000 cho backend, 5173 cho frontend)

4. Click **"Save"** để lưu
5. Đợi 5-10 giây để Google cập nhật cấu hình

## 🧪 Test Google Login

### Các bước test:

1. Mở trình duyệt và truy cập: http://localhost:5173/dang-nhap
2. Click nút **"Đăng nhập với Google"** (màu xanh Google)
3. Chọn tài khoản Google muốn đăng nhập
4. Cho phép ứng dụng truy cập thông tin cơ bản
5. Sau khi xác nhận, bạn sẽ được redirect về trang chủ
6. Kiểm tra góc trên cùng màn hình, sẽ hiện tên người dùng

### Kiểm tra đăng nhập thành công:

- ✅ Tên người dùng hiển thị ở góc trên cùng
- ✅ Avatar Google hiển thị
- ✅ Có thể thêm sản phẩm vào giỏ hàng
- ✅ Có thể thanh toán

## ⚠️ Xử Lý Lỗi Thường Gặp

### Lỗi: "redirect_uri_mismatch"

**Nguyên nhân:** URL callback không khớp với Google Console

**Giải pháp:**
1. Kiểm tra lại URL đã thêm vào Google Console
2. Đảm bảo không có dấu cách, ký tự thừa
3. Port phải chính xác (5000 và 5173)

### Lỗi: "localhost refused to connect"

**Nguyên nhân:** Backend hoặc Frontend không chạy

**Giải pháp:**
1. Kiểm tra backend: http://localhost:5000
2. Kiểm tra frontend: http://localhost:5173
3. Khởi động lại nếu cần

### Lỗi: "Không thể đăng nhập"

**Nguyên nhân:** Token không hợp lệ hoặc API lỗi

**Giải pháp:**
1. Xóa cache trình duyệt
2. Xóa localStorage: F12 > Application > Local Storage > Clear
3. Thử lại

## 📝 Thông Tin Kỹ Thuật

### Flow đăng nhập Google:

```
1. User click "Đăng nhập với Google"
   ↓
2. Redirect đến: http://localhost:5000/api/auth/google
   ↓
3. Backend redirect đến Google OAuth
   ↓
4. User chọn tài khoản Google
   ↓
5. Google redirect về: http://localhost:5000/api/auth/google/callback
   ↓
6. Backend tạo/tìm user, tạo JWT token
   ↓
7. Backend redirect về: http://localhost:5173/auth/success?token=xxx
   ↓
8. Frontend lưu token, fetch user info
   ↓
9. Redirect về trang chủ (/)
```

### API Endpoints:

- **Start OAuth:** `GET /api/auth/google`
- **Callback:** `GET /api/auth/google/callback`
- **Get User Info:** `GET /api/auth/me` (với Bearer token)

### Environment Variables:

Backend `.env`:
```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
```

**Note:** Thay thế `your_google_client_id_here` và `your_google_client_secret_here` bằng credentials thực tế từ Google Cloud Console.

## 🎯 Checklist Hoàn Thành

- [ ] Đã thêm 2 Redirect URIs vào Google Console
- [ ] Backend đang chạy (port 5000)
- [ ] Frontend đang chạy (port 5173)
- [ ] Đã test đăng nhập Google thành công
- [ ] Tên người dùng hiển thị sau khi đăng nhập
- [ ] Có thể thêm sản phẩm vào giỏ hàng

## 📞 Hỗ Trợ

Nếu gặp vấn đề:
1. Kiểm tra console log (F12 > Console)
2. Kiểm tra Network tab để xem request/response
3. Đảm bảo tất cả service đang chạy

---

**Cập nhật lần cuối:** 30/11/2025
