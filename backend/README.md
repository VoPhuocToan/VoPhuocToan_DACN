# HealthyCare Backend API

Backend API server cho dự án HealthyCare - Nhà thuốc thực phẩm chức năng.

## Cấu trúc dự án

```
backend/
├── config/          # Cấu hình database
├── controllers/     # Logic xử lý request
├── middleware/      # Middleware (auth, error handler)
├── models/          # Mongoose models
├── routes/          # API routes
├── utils/           # Utility functions
├── server.js        # Entry point
└── package.json
```

## Cài đặt

1. **Cài đặt dependencies:**
```bash
npm install
```

2. **Tạo file `.env` từ `.env.example`:**
```bash
cp .env.example .env
```

3. **Cấu hình `.env`:**
- Thêm MongoDB connection string
- Thêm JWT secret
- Thêm OpenAI API key (nếu có)

4. **Khởi động server:**
```bash
# Development mode (với nodemon)
npm run dev

# Production mode
npm start
```

## API Endpoints

### Products
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/search?q=keyword` - Tìm kiếm sản phẩm
- `GET /api/products/category/:category` - Lấy sản phẩm theo danh mục
- `GET /api/products/:id` - Lấy chi tiết sản phẩm
- `POST /api/products` - Tạo sản phẩm mới (Admin)
- `PUT /api/products/:id` - Cập nhật sản phẩm (Admin)
- `DELETE /api/products/:id` - Xóa sản phẩm (Admin)

### Categories
- `GET /api/categories` - Lấy danh sách danh mục
- `GET /api/categories/:id` - Lấy chi tiết danh mục
- `POST /api/categories` - Tạo danh mục mới (Admin)
- `PUT /api/categories/:id` - Cập nhật danh mục (Admin)
- `DELETE /api/categories/:id` - Xóa danh mục (Admin)

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user hiện tại (Private)
- `GET /api/auth/logout` - Đăng xuất (Private)
- `PUT /api/auth/profile` - Cập nhật profile (Private)

### Orders
- `POST /api/orders` - Tạo đơn hàng (Private)
- `GET /api/orders/myorders` - Lấy đơn hàng của user (Private)
- `GET /api/orders/:id` - Lấy chi tiết đơn hàng (Private)
- `PUT /api/orders/:id/pay` - Cập nhật trạng thái thanh toán (Private)
- `PUT /api/orders/:id/deliver` - Cập nhật trạng thái giao hàng (Admin)
- `GET /api/orders` - Lấy tất cả đơn hàng (Admin)

### Chat AI
- `POST /api/chat` - Chat với AI

### Users (Admin only)
- `GET /api/users` - Lấy danh sách users
- `GET /api/users/:id` - Lấy chi tiết user
- `PUT /api/users/:id` - Cập nhật user
- `DELETE /api/users/:id` - Xóa user

## Authentication

Sử dụng JWT Bearer Token. Thêm vào header:
```
Authorization: Bearer <token>
```

## Seed Data

Để thêm dữ liệu mẫu vào database:

```bash
node scripts/seed.js
```

## Environment Variables

Xem file `.env.example` để biết các biến môi trường cần thiết.

## MongoDB Connection

Cấu hình MongoDB connection string trong file `.env`:

```
MONGODB_URI=mongodb://localhost:27017/healthycare
```

Hoặc MongoDB Atlas:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/healthycare?retryWrites=true&w=majority
```

