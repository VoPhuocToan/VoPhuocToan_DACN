# Hướng dẫn tạo file .env cho Backend

Tạo file `.env` trong thư mục `backend/` với nội dung sau:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Frontend URL
FRONTEND_URL=http://localhost:5173

# MongoDB Connection
# Thay thế bằng MongoDB connection string của bạn
MONGODB_URI=mongodb://localhost:27017/healthycare

# JWT Secret
JWT_SECRET=healthycare_jwt_secret_key_2024_change_in_production
JWT_EXPIRE=7d

# OpenAI API Key (cho chat AI)
# Lấy từ https://platform.openai.com/api-keys
OPENAI_API_KEY=your_openai_api_key_here
```

## Hướng dẫn nhanh

1. Mở terminal trong thư mục `backend/`
2. Tạo file `.env`:
   ```bash
   # Windows
   type nul > .env
   
   # Linux/Mac
   touch .env
   ```
3. Copy nội dung ở trên vào file `.env`
4. Cập nhật `MONGODB_URI` với connection string của bạn

