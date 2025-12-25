# TÀI LIỆU THAM KHẢO VÀ ĐẶC TẢ API (API REFERENCES)

Tài liệu này liệt kê các nguồn tham khảo kỹ thuật và công nghệ được sử dụng để xây dựng hệ thống API cho dự án HealthyCare, trình bày theo chuẩn trích dẫn IEEE.

## 1. Tài liệu tham khảo công nghệ (References)

### Backend Framework & Runtime
[1] OpenJS Foundation, "Node.js Documentation," 2025. [Online]. Available: https://nodejs.org/en/docs/. [Accessed: Dec. 14, 2025].

[2] Express.js Contributors, "Express - Fast, unopinionated, minimalist web framework for Node.js," 2025. [Online]. Available: https://expressjs.com/. [Accessed: Dec. 14, 2025].

### Database & ODM
[3] MongoDB, Inc., "MongoDB Manual," 2025. [Online]. Available: https://www.mongodb.com/docs/manual/. [Accessed: Dec. 14, 2025].

[4] Automattic, "Mongoose v8.0.3 Documentation," 2025. [Online]. Available: https://mongoosejs.com/docs/. [Accessed: Dec. 14, 2025].

### Authentication & Security
[5] Internet Engineering Task Force (IETF), "RFC 7519: JSON Web Token (JWT)," May 2015. [Online]. Available: https://datatracker.ietf.org/doc/html/rfc7519. [Accessed: Dec. 14, 2025].

[6] J. Hanson, "Passport.js Documentation," 2025. [Online]. Available: https://www.passportjs.org/docs/. [Accessed: Dec. 14, 2025].

[7] dcodeIO, "bcrypt.js - Optimized bcrypt in JavaScript with zero dependencies," 2025. [Online]. Available: https://github.com/dcodeIO/bcrypt.js. [Accessed: Dec. 14, 2025].

### Payment Gateway
[8] PayOS, "Tài liệu tích hợp PayOS," 2025. [Online]. Available: https://payos.vn/docs/. [Accessed: Dec. 14, 2025].

### AI & Third-party Services
[9] Google, "Gemini API Documentation," Google AI for Developers, 2025. [Online]. Available: https://ai.google.dev/docs. [Accessed: Dec. 14, 2025].

[10] Nodemailer Contributors, "Nodemailer :: The Node.js Email Engine," 2025. [Online]. Available: https://nodemailer.com/. [Accessed: Dec. 14, 2025].

---

## 2. Danh sách các API Endpoint của dự án (Project API Endpoints)

Dưới đây là danh sách tóm tắt các API endpoint được phát triển trong dự án, tham chiếu đến mã nguồn.

### Authentication (`/api/auth`)
*   `POST /register`: Đăng ký tài khoản mới.
*   `POST /login`: Đăng nhập và lấy JWT token.
*   `GET /me`: Lấy thông tin người dùng hiện tại.
*   `POST /logout`: Đăng xuất.

### Products (`/api/products`)
*   `GET /`: Lấy danh sách sản phẩm (có phân trang, lọc).
*   `GET /:id`: Lấy chi tiết sản phẩm.
*   `POST /`: Thêm sản phẩm mới (Admin).
*   `PUT /:id`: Cập nhật sản phẩm (Admin).
*   `DELETE /:id`: Xóa sản phẩm (Admin).

### Cart (`/api/cart`)
*   `GET /:userId`: Xem giỏ hàng.
*   `POST /add`: Thêm sản phẩm vào giỏ.
*   `PUT /update`: Cập nhật số lượng.
*   `DELETE /remove`: Xóa sản phẩm khỏi giỏ.
*   `DELETE /clear`: Xóa toàn bộ giỏ hàng.

### Orders (`/api/orders`)
*   `POST /`: Tạo đơn hàng mới.
*   `GET /myorders`: Xem lịch sử đơn hàng của tôi.
*   `GET /:id`: Xem chi tiết đơn hàng.
*   `PUT /:id/cancel`: Hủy đơn hàng.
*   `PUT /:id/status`: Cập nhật trạng thái đơn hàng (Admin).

### Payment (`/api/payment`)
*   `POST /create-payment-link`: Tạo link thanh toán PayOS.
*   `POST /receive-hook`: Webhook nhận kết quả thanh toán từ PayOS.

### Chat (`/api/chat`)
*   `POST /`: Gửi tin nhắn chat (AI hoặc Admin).
*   `GET /history`: Lấy lịch sử chat.

### Users (`/api/users`)
*   `GET /`: Lấy danh sách người dùng (Admin).
*   `GET /:id`: Lấy chi tiết người dùng (Admin).
*   `PUT /:id`: Cập nhật thông tin người dùng (Admin).
*   `DELETE /:id`: Xóa người dùng (Admin).

### Categories (`/api/categories`)
*   `GET /`: Lấy danh sách danh mục.
*   `POST /`: Tạo danh mục mới (Admin).
*   `PUT /:id`: Cập nhật danh mục (Admin).
*   `DELETE /:id`: Xóa danh mục (Admin).
