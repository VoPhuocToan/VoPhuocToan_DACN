# 📋 Hướng Dẫn Hệ Thống Quản Lý Liên Hệ (Contact Management System)

## 🎯 Tổng Quan

Hệ thống quản lý liên hệ hoàn chỉnh cho phép khách hàng gửi tin nhắn liên hệ từ website và quản trị viên quản lý các liên hệ từ panel admin.

**Flow Hoàn Chỉnh:**
```
Khách Hàng (Frontend)
    ↓ Điền Form Liên Hệ
    ↓ POST /api/contact
Backend (Express + Node.js)
    ↓ Lưu vào MongoDB
    ↓ Trả response thành công
Admin Panel
    ↓ Xem danh sách liên hệ
    ↓ Xem chi tiết từng liên hệ
    ↓ Trả lời liên hệ
    ↓ Đóng/Xóa liên hệ
```

---

## 🛠️ Cấu Trúc Backend

### 1. **Model - Contact.js**
**Đường dẫn:** `backend/models/Contact.js`

**Schema:**
```javascript
{
  name: String (required),        // Tên khách hàng
  email: String (required),       // Email khách hàng
  phone: String,                  // Số điện thoại
  subject: String (required),     // Tiêu đề vấn đề
  message: String (required),     // Nội dung tin nhắn
  status: String (default: 'new'), // Trạng thái: new, read, replied, closed
  reply: String,                  // Nội dung trả lời từ admin
  repliedAt: Date,               // Thời gian trả lời
  createdAt: Date,               // Thời gian tạo
  updatedAt: Date                // Thời gian cập nhật
}
```

**Trạng Thái:**
- `new` - Liên hệ mới chưa xem
- `read` - Đã xem nhưng chưa trả lời
- `replied` - Đã trả lời
- `closed` - Đã đóng

### 2. **Controller - contactController.js**
**Đường dẫn:** `backend/controllers/contactController.js`

**Các Functions:**

| Function | Endpoint | Method | Mô Tả |
|----------|----------|--------|-------|
| `sendContactMessage` | `/api/contact` | POST | Khách hàng gửi liên hệ (Public) |
| `getAllContacts` | `/api/contact` | GET | Lấy tất cả liên hệ (Admin) |
| `getContactDetail` | `/api/contact/:id` | GET | Xem chi tiết liên hệ (Admin) |
| `replyContact` | `/api/contact/:id/reply` | PUT | Trả lời liên hệ (Admin) |
| `closeContact` | `/api/contact/:id/close` | PUT | Đóng liên hệ (Admin) |
| `deleteContact` | `/api/contact/:id` | DELETE | Xóa liên hệ (Admin) |
| `getContactStats` | `/api/contact/stats/count` | GET | Lấy thống kê liên hệ (Admin) |

### 3. **Routes - contact.js**
**Đường dẫn:** `backend/routes/contact.js`

**Public Endpoints:**
```
POST   /api/contact                    - Gửi liên hệ
```

**Protected Endpoints (Admin):**
```
GET    /api/contact                    - Lấy danh sách liên hệ
GET    /api/contact/stats/count        - Lấy thống kê
GET    /api/contact/:id                - Xem chi tiết
PUT    /api/contact/:id/reply          - Trả lời
PUT    /api/contact/:id/close          - Đóng liên hệ
DELETE /api/contact/:id                - Xóa liên hệ
```

---

## 🎨 Cấu Trúc Frontend

### 1. **Trang Liên Hệ - Contact.jsx**
**Đường dẫn:** `frontend/src/pages/Contact.jsx`

**Tính Năng:**
- Form liên hệ với các trường:
  - Họ và tên (required)
  - Email (required)
  - Số điện thoại
  - Tiêu đề (required)
  - Nội dung (required)
- Validation dữ liệu
- Hiển thị thông báo thành công/lỗi
- Gửi dữ liệu POST đến `/api/contact`

**Status Response:**
```javascript
// Thành công (201)
{
  success: true,
  message: "Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể!",
  data: { ...contact }
}

// Lỗi
{
  success: false,
  message: "Vui lòng điền đầy đủ thông tin..."
}
```

---

## 👨‍💼 Cấu Trúc Admin Panel

### 1. **Danh Sách Liên Hệ - ContactList.jsx**
**Đường dẫn:** `Admin/vite-project/src/pages/ContactList.jsx`

**Tính Năng:**
- 📊 **Thống kê:**
  - Tổng số liên hệ
  - Số liên hệ mới
  - Số liên hệ đã xem
  - Số liên hệ đã trả lời

- 🔍 **Lọc theo trạng thái:**
  - Tất cả
  - Mới
  - Đã xem
  - Đã trả lời
  - Đóng

- 📋 **Bảng danh sách:**
  - STT
  - Tên
  - Email
  - Số điện thoại
  - Tiêu đề
  - Trạng thái (badge)
  - Ngày gửi
  - Hành động (Xem, Xóa)

- ⚙️ **Hành động:**
  - Xem chi tiết
  - Xóa liên hệ

### 2. **Chi Tiết Liên Hệ - ContactDetail.jsx**
**Đường dẫn:** `Admin/vite-project/src/pages/ContactDetail.jsx`

**Tính Năng:**
- 👤 **Thông tin khách hàng:**
  - Tên
  - Email (clickable mailto)
  - Số điện thoại (clickable tel)
  - Ngày gửi

- 📝 **Nội dung liên hệ:**
  - Tiêu đề
  - Nội dung tin nhắn

- 💬 **Trả lời:**
  - Hiển thị câu trả lời nếu đã có
  - Form gửi trả lời (nếu chưa trả lời)
  - Ngày trả lời

- ⚙️ **Hành động:**
  - Gửi trả lời (nếu chưa trả lời)
  - Đóng liên hệ
  - Xóa liên hệ

- 🔄 **Tự động:**
  - Status tự động thay đổi thành "read" khi admin xem
  - Status thành "replied" khi admin gửi trả lời
  - Status thành "closed" khi admin đóng

### 3. **Navigation - Sidebar.jsx**
**Đường dẫn:** `Admin/vite-project/src/components/Sidebar.jsx`

**Cập nhật:**
- Thêm link "💬 Quản Lý Liên Hệ" trỏ đến `/contact`

### 4. **Styles - Contact.css**
**Đường dẫn:** `Admin/vite-project/src/styles/Contact.css`

**Bao Gồm:**
- Styles cho ContactList
- Styles cho ContactDetail
- Responsive design cho mobile

---

## 🚀 Hướng Dẫn Sử Dụng

### Khách Hàng - Gửi Liên Hệ

1. Truy cập trang Liên Hệ từ menu website
2. Điền form với:
   - ✅ Họ tên
   - ✅ Email
   - ✅ Tiêu đề
   - ✅ Nội dung
   - (Tùy chọn) Số điện thoại
3. Nhấn "Gửi tin nhắn"
4. Xem thông báo thành công

**Ví Dụ Request:**
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nguyễn Văn A",
    "email": "nvan.a@gmail.com",
    "phone": "0901234567",
    "subject": "Hỏi về sản phẩm",
    "message": "Tôi muốn hỏi về công dụng..."
  }'
```

### Admin - Quản Lý Liên Hệ

#### 1️⃣ Xem Danh Sách Liên Hệ
1. Login vào Admin Panel (`http://localhost:5175`)
2. Nhấn "💬 Quản Lý Liên Hệ" trên Sidebar
3. Xem danh sách tất cả liên hệ

#### 2️⃣ Lọc Liên Hệ
- Nhấn các nút filter: "Tất cả", "Mới", "Đã xem", "Đã trả lời", "Đóng"
- Bảng sẽ cập nhật theo filter

#### 3️⃣ Xem Chi Tiết & Trả Lời
1. Nhấn nút "Xem" bên cạnh liên hệ cần xem
2. Xem thông tin chi tiết
3. Nhấn nút "Gửi Trả Lời"
4. Nhập nội dung trả lời
5. Nhấn "Gửi Trả Lời"
6. Status tự động thay đổi thành "Đã trả lời"

#### 4️⃣ Đóng Liên Hệ
- Trong trang chi tiết, nhấn "Đóng Liên Hệ"
- Status thành "Đóng"

#### 5️⃣ Xóa Liên Hệ
- Có thể xóa từ danh sách hoặc chi tiết
- Click nút "Xóa"
- Xác nhận xóa

---

## 🔐 Authentication & Authorization

Tất cả endpoint admin được bảo vệ bởi middleware:
```javascript
@protect              // Kiểm tra JWT token
@authorize('admin')   // Kiểm tra quyền admin
```

**Yêu cầu Header:**
```
Authorization: Bearer <token>
```

---

## 📊 Thống Kê & Bảng Điều Khiển

**Endpoint Stats:**
```
GET /api/contact/stats/count
Response:
{
  success: true,
  data: {
    total: 15,      // Tổng liên hệ
    new: 3,         // Liên hệ mới
    read: 5,        // Đã xem
    replied: 7      // Đã trả lời
  }
}
```

**Hiển thị trên Dashboard:**
```
┌────────────────────────────────┐
│    Quản Lý Liên Hệ             │
├────────────────────────────────┤
│ Tổng cộng: 15                  │
│ Mới: 3  | Đã xem: 5 | Đã trả: 7│
└────────────────────────────────┘
```

---

## 🧪 Testing

### 1. Test Gửi Liên Hệ (Frontend)
```bash
# Từ browser, truy cập http://localhost:5173/contact
# Điền form và gửi
```

### 2. Test API Backend
```bash
# Gửi liên hệ
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@gmail.com",
    "subject": "Test",
    "message": "Test message"
  }'

# Lấy danh sách (với token)
curl -X GET http://localhost:5000/api/contact \
  -H "Authorization: Bearer <token>"

# Trả lời liên hệ
curl -X PUT http://localhost:5000/api/contact/<id>/reply \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"reply": "Cảm ơn câu hỏi của bạn..."}'
```

### 3. Test Admin Panel
1. Truy cập `http://localhost:5175/login`
2. Đăng nhập: `admin@healthycare.com` / `123456`
3. Click "💬 Quản Lý Liên Hệ"
4. Xem danh sách, filter, xem chi tiết, trả lời

---

## 📁 File Structure

```
backend/
├── models/
│   └── Contact.js              ✅ Contact schema
├── controllers/
│   └── contactController.js    ✅ 7 functions
├── routes/
│   └── contact.js              ✅ All endpoints
└── middleware/
    └── auth.js                 ✅ Protection middleware

Admin/vite-project/
├── src/
│   ├── pages/
│   │   ├── ContactList.jsx     ✅ List & filter
│   │   └── ContactDetail.jsx   ✅ Detail & reply
│   ├── components/
│   │   └── Sidebar.jsx         ✅ Nav link added
│   ├── styles/
│   │   └── Contact.css         ✅ Full styling
│   └── App.jsx                 ✅ Routes added
└── vite.config.js              ✅ Port 5175

frontend/
└── src/
    └── pages/
        └── Contact.jsx         ✅ Form ready
```

---

## ⚙️ Environment Setup

### Backend .env
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret
PORT=5000
NODE_ENV=development
```

### Admin .env (if needed)
```env
VITE_API_URL=http://localhost:5000
```

### Frontend .env (if needed)
```env
VITE_API_URL=http://localhost:5000
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Contact không lưu vào DB | Kiểm tra MongoDB connection |
| Admin không thấy danh sách | Kiểm tra JWT token, roles |
| Form submit lỗi 401 | Backend route chưa public |
| Port 5175 bị dùng | Thay port trong vite.config.js |
| Email không gửi | Nodemailer chưa config (optional) |

---

## 📝 Ghi Chú

1. **Email Notification:** Hiện tại chỉ lưu vào DB, có thể thêm nodemailer để gửi email cho admin khi có liên hệ mới
2. **Reply Email:** Có thể gửi email cho khách hàng khi admin trả lời
3. **Pagination:** Nếu liên hệ quá nhiều, có thể thêm pagination
4. **Export:** Có thể thêm tính năng export liên hệ ra file Excel
5. **Archive:** Có thể thêm trạng thái "archived" thay vì xóa

---

## 📞 Liên Hệ & Hỗ Trợ

Nếu có vấn đề, kiểm tra:
- Backend logs: `npm start`
- Browser console: F12
- Network tab: Xem API response
- MongoDB Atlas: Kiểm tra data

---

**Last Updated:** `2025-01-15`
**Status:** ✅ Fully Functional
