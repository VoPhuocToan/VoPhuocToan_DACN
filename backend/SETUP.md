# Hướng dẫn Setup Backend

## Bước 1: Cài đặt Dependencies

```bash
cd backend
npm install
```

## Bước 2: Cấu hình Environment Variables

Tạo file `.env` trong thư mục `backend/`:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Frontend URL
FRONTEND_URL=http://localhost:5173

# MongoDB Connection
# THAY THẾ bằng MongoDB connection string của bạn
MONGODB_URI=mongodb://localhost:27017/healthycare

# Hoặc nếu dùng MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/healthycare?retryWrites=true&w=majority

# JWT Secret (tạo một chuỗi ngẫu nhiên bất kỳ)
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d

# OpenAI API Key (cho chat AI - tùy chọn)
OPENAI_API_KEY=your_openai_api_key_here
```

## Bước 3: Kết nối MongoDB

### Option 1: MongoDB Local
- Cài đặt MongoDB trên máy local
- Connection string: `mongodb://localhost:27017/healthycare`

### Option 2: MongoDB Atlas (Recommended)
1. Truy cập https://www.mongodb.com/cloud/atlas
2. Tạo tài khoản miễn phí
3. Tạo cluster mới
4. Lấy connection string
5. Thay thế username, password trong connection string
6. Dán vào `MONGODB_URI` trong file `.env`

## Bước 4: Chạy Server

```bash
# Development mode (tự động restart khi code thay đổi)
npm run dev

# Production mode
npm start
```

Server sẽ chạy tại: `http://localhost:5000`

## Bước 5: Seed Dữ liệu (Tùy chọn)

Để thêm dữ liệu mẫu vào database:

```bash
npm run seed
```

Script này sẽ:
- Xóa dữ liệu cũ (nếu có)
- Thêm 8 danh mục
- Thêm 8 sản phẩm mẫu

## Kiểm tra Server

Mở trình duyệt hoặc dùng Postman:

```
GET http://localhost:5000/
```

Sẽ trả về:
```json
{
  "message": "HealthyCare API Server",
  "version": "1.0.0",
  "status": "running"
}
```

## API Documentation

Xem file `README.md` để biết danh sách đầy đủ các API endpoints.

## Troubleshooting

### Lỗi kết nối MongoDB
- Kiểm tra MongoDB connection string trong `.env`
- Đảm bảo MongoDB đang chạy (nếu dùng local)
- Kiểm tra network và firewall (nếu dùng Atlas)

### Port đã được sử dụng
- Thay đổi `PORT` trong file `.env`
- Hoặc đóng ứng dụng đang sử dụng port 5000

### Lỗi JWT Secret
- Đảm bảo `JWT_SECRET` đã được cấu hình trong `.env`
- Nên dùng chuỗi ngẫu nhiên dài và phức tạp trong production

