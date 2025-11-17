# Hướng dẫn tạo file .env cho Frontend

Tạo file `.env` trong thư mục `frontend/` với nội dung sau:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000
```

## Hướng dẫn nhanh

1. Mở terminal trong thư mục `frontend/`
2. Tạo file `.env`:
   ```bash
   # Windows
   type nul > .env
   
   # Linux/Mac
   touch .env
   ```
3. Copy nội dung ở trên vào file `.env`

Lưu ý: Nếu backend chạy trên port khác, hãy thay đổi URL tương ứng.

