# Hướng dẫn khắc phục lỗi Chatbox AI

## Lỗi "Failed to fetch"

Lỗi này thường xảy ra khi frontend không thể kết nối đến backend. Hãy kiểm tra các bước sau:

### 1. Kiểm tra Backend đã chạy chưa

```bash
cd backend
npm run dev
```

Bạn sẽ thấy:
```
🚀 Server is running on port 5000
🌍 Environment: development
📡 API URL: http://localhost:5000
✅ Chat route registered: POST /api/chat
```

Nếu không thấy, có thể:
- Port 5000 đã được sử dụng → Thay đổi PORT trong `.env`
- Có lỗi khi khởi động → Kiểm tra console để xem lỗi

### 2. Kiểm tra file .env

**Backend** (`backend/.env`):
```env
PORT=5000
FRONTEND_URL=http://localhost:5173
OPENAI_API_KEY=sk-proj-...
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000
```

### 3. Kiểm tra CORS

Mở browser console (F12) và xem có lỗi CORS không:
- Nếu có lỗi CORS → Kiểm tra `FRONTEND_URL` trong backend `.env`
- Đảm bảo frontend chạy trên đúng port (thường là 5173)

### 4. Test API trực tiếp

Mở terminal và chạy:

```bash
# Test backend có chạy không
curl http://localhost:5000/

# Test chat API
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Xin chào"}]}'
```

### 5. Kiểm tra Console Logs

**Frontend Console** (F12):
- Xem có log: "Sending request to: http://localhost:5000/api/chat"
- Xem response status và data

**Backend Console**:
- Xem có log: "📨 Chat request received"
- Xem có lỗi gì không

### 6. Kiểm tra Network Tab

1. Mở Browser DevTools (F12)
2. Vào tab "Network"
3. Gửi tin nhắn trong chatbox
4. Xem request đến `/api/chat`:
   - Status code là gì?
   - Request có được gửi không?
   - Response là gì?

### 7. Các lỗi thường gặp

#### Lỗi: "OpenAI API key chưa được cấu hình"
- **Giải pháp**: Kiểm tra file `backend/.env` có `OPENAI_API_KEY` chưa

#### Lỗi: "Cannot connect to MongoDB"
- **Giải pháp**: 
  - Kiểm tra MongoDB connection string trong `.env`
  - Đảm bảo MongoDB đang chạy (nếu local)
  - Hoặc kiểm tra MongoDB Atlas connection

#### Lỗi: CORS
- **Giải pháp**: 
  - Kiểm tra `FRONTEND_URL` trong backend `.env`
  - Đảm bảo frontend chạy trên đúng URL

### 8. Restart cả Frontend và Backend

Đôi khi cần restart lại:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### 9. Kiểm tra Firewall/Antivirus

Một số firewall có thể chặn kết nối localhost. Hãy tạm thời tắt để test.

### 10. Kiểm tra Port

Đảm bảo:
- Backend chạy trên port 5000 (hoặc port trong `.env`)
- Frontend chạy trên port 5173 (hoặc port mặc định của Vite)
- Không có ứng dụng khác đang dùng các port này

## Debug Steps

1. ✅ Backend đang chạy?
2. ✅ File `.env` đã được tạo và cấu hình đúng?
3. ✅ OpenAI API key có trong `.env`?
4. ✅ Frontend `.env` có `VITE_API_URL`?
5. ✅ Không có lỗi trong console?
6. ✅ Network request có được gửi không?
7. ✅ CORS có vấn đề không?

Nếu vẫn lỗi, hãy:
- Copy toàn bộ error message từ console
- Copy log từ backend
- Kiểm tra Network tab trong DevTools

