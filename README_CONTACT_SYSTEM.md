# Contact Management System - README

## 📋 Giới Thiệu

Đây là một hệ thống quản lý liên hệ hoàn chỉnh cho website Healthycare, cho phép khách hàng gửi tin nhắn liên hệ và quản trị viên quản lý các liên hệ từ admin panel.

## 🎯 Mục Tiêu

```
User → Submit Contact Form → Backend saves to MongoDB → Admin views & replies
```

## 🏗️ Kiến Trúc

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                     │
│  - Contact.jsx (Form)                                       │
└─────────────────┬───────────────────────────────────────────┘
                  │ POST /api/contact
                  ↓
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Express.js)                     │
│  - contactController.js (7 CRUD functions)                 │
│  - Contact.js (MongoDB Model)                              │
│  - contact.js (Routes with auth)                           │
└─────────────────┬───────────────────────────────────────────┘
                  │ Save/Read/Update/Delete
                  ↓
┌─────────────────────────────────────────────────────────────┐
│                   MongoDB Atlas (Cloud)                     │
│  - Contact collection with 4+ documents                     │
└─────────────────────────────────────────────────────────────┘
                  │
                  ↓ GET /api/contact
┌─────────────────────────────────────────────────────────────┐
│                    Admin Panel (React)                      │
│  - ContactList.jsx (Dashboard)                              │
│  - ContactDetail.jsx (Detail & Reply)                       │
└─────────────────────────────────────────────────────────────┘
```

## 📂 Cấu Trúc File

```
📦 Healthycare/
├── 📁 backend/
│   ├── models/Contact.js                (✅ Schema)
│   ├── controllers/contactController.js  (✅ CRUD Logic)
│   ├── routes/contact.js                 (✅ Endpoints)
│   ├── test-contact-api.js               (✅ Test Suite)
│   └── server.js                         (✅ Updated)
│
├── 📁 frontend/
│   └── src/pages/Contact.jsx             (✅ Form)
│
├── 📁 Admin/vite-project/
│   ├── src/pages/ContactList.jsx         (✅ List View)
│   ├── src/pages/ContactDetail.jsx       (✅ Detail View)
│   ├── src/components/Sidebar.jsx        (✅ Updated)
│   ├── src/styles/Contact.css            (✅ Styling)
│   └── src/App.jsx                       (✅ Routes)
│
└── 📄 CONTACT_SYSTEM_GUIDE.md            (✅ Documentation)
    CONTACT_IMPLEMENTATION_COMPLETE.md    (✅ Summary)
```

## 🚀 Quick Start

### 1. Start Backend
```bash
cd backend
npm start
# Backend runs on http://localhost:5000
```

### 2. Start Admin Panel
```bash
cd Admin/vite-project
npm run dev
# Admin runs on http://localhost:5175
```

### 3. Start Frontend (Optional)
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

## 🧪 Testing

### Run Full Test Suite
```bash
cd backend
node test-contact-api.js
```

### Expected Output
```
✅ 1. Gửi liên hệ mới              [201 Created]
✅ 2. Admin login                   [200 OK]
✅ 3. Lấy danh sách liên hệ        [200 OK]
✅ 4. Lấy thống kê                  [200 OK]
✅ 5. Xem chi tiết (auto update)    [200 OK]
✅ 6. Trả lời liên hệ               [200 OK]
✅ 7. Đóng liên hệ                  [200 OK]
✅ Tất cả test hoàn thành!
```

## 👥 User Scenarios

### 👤 Khách Hàng
1. Truy cập `http://localhost:5173/contact`
2. Điền form liên hệ
3. Nhấn "Gửi tin nhắn"
4. Nhận thông báo thành công

### 👨‍💼 Quản Trị Viên
1. Truy cập `http://localhost:5175`
2. Đăng nhập: `admin@healthycare.com` / `123456`
3. Nhấn "💬 Quản Lý Liên Hệ"
4. Xem danh sách liên hệ
5. Nhấn "Xem" để xem chi tiết
6. Nhập trả lời và "Gửi Trả Lời"
7. Status tự động thành "Đã trả lời"

## 📊 API Endpoints

### Public
```
POST /api/contact
├── Body: { name, email, phone?, subject, message }
└── Response: { success, message, data }
```

### Protected (Requires JWT Token + Admin Role)
```
GET /api/contact
├── Returns: Array of contacts, count

GET /api/contact/stats/count
├── Returns: { total, new, read, replied }

GET /api/contact/:id
├── Returns: Single contact (status updates to 'read')

PUT /api/contact/:id/reply
├── Body: { reply }
├── Returns: Updated contact (status becomes 'replied')

PUT /api/contact/:id/close
├── Returns: Updated contact (status becomes 'closed')

DELETE /api/contact/:id
├── Returns: Deleted contact
```

## 🔐 Authentication

All admin endpoints use:
- **Header:** `Authorization: Bearer <token>`
- **Middleware:** `protect` (checks JWT)
- **Middleware:** `authorize('admin')` (checks role)

## 💾 Database Schema

```javascript
{
  _id: ObjectId,
  name: String,              // Tên khách hàng
  email: String,             // Email (validation)
  phone: String,             // Optional
  subject: String,           // Tiêu đề vấn đề
  message: String,           // Nội dung
  status: String,            // new | read | replied | closed
  reply: String,             // Admin's reply
  repliedAt: Date,           // Reply timestamp
  createdAt: Date,           // Submission timestamp
  updatedAt: Date            // Last update
}
```

## 📈 Status Flow

```
new
 ↓ (Admin views detail)
read
 ↓ (Admin sends reply)
replied
 ↓ (Admin closes)
closed
```

## 🎨 UI Components

### ContactList
- Data table with 8 columns
- Filter buttons (5 status options)
- Statistics dashboard
- Action buttons (View, Delete)
- Responsive table design

### ContactDetail
- Customer information display
- Contact message display
- Reply section (conditional)
- Reply form (conditional)
- Action buttons (Reply, Close, Delete)
- Responsive card layout

## 📱 Responsive Design

- ✅ Desktop (1024px+)
- ✅ Tablet (768-1023px)
- ✅ Mobile (480-767px)
- ✅ Small Mobile (<480px)

## 🔧 Configuration

### Backend .env
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret
PORT=5000
NODE_ENV=development
```

### Frontend .env (Optional)
```env
VITE_API_URL=http://localhost:5000
```

### Admin .env (Optional)
```env
VITE_API_URL=http://localhost:5000
```

## 📚 Documentation Files

1. **CONTACT_SYSTEM_GUIDE.md** - Complete guide with examples
2. **CONTACT_IMPLEMENTATION_COMPLETE.md** - Implementation summary & test results
3. **test-contact-api.js** - Automated test suite with 7 scenarios

## ✅ Status Indicators

| Component | Status | Notes |
|-----------|--------|-------|
| Backend API | ✅ Working | All 7 endpoints tested |
| Frontend Form | ✅ Working | Ready to submit |
| Admin Panel | ✅ Working | Full CRUD operations |
| Database | ✅ Working | 4+ sample contacts |
| Auth | ✅ Working | JWT + role-based |
| Responsive Design | ✅ Working | Mobile optimized |

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Contact not saving | Check MongoDB connection |
| Admin can't see list | Verify JWT token, check admin role |
| Port already in use | Change port in vite.config.js |
| CORS error | Check backend CORS headers |
| Form validation fails | Check required fields |

## 🎓 Learning Resources

- See `CONTACT_SYSTEM_GUIDE.md` for detailed API documentation
- See `test-contact-api.js` for example requests/responses
- Check backend logs: `npm start` shows all requests
- Check browser console for frontend errors

## 🚢 Deployment Checklist

- [ ] Backend running on production server
- [ ] MongoDB Atlas cluster whitelisted
- [ ] Environment variables configured
- [ ] CORS headers set correctly
- [ ] JWT secret is strong & secure
- [ ] SSL/HTTPS enabled
- [ ] Email notifications configured (optional)
- [ ] Rate limiting implemented (optional)
- [ ] Backup strategy in place

## 📞 Support

For issues:
1. Check backend logs: `npm start`
2. Check browser console: F12
3. Check network tab: XHR responses
4. Read documentation files
5. Run test suite: `node test-contact-api.js`

## 📝 Changelog

### v1.0 - Initial Release
- ✅ Contact form on frontend
- ✅ Backend API with 7 endpoints
- ✅ Admin panel with list & detail views
- ✅ Status management
- ✅ Reply functionality
- ✅ Complete documentation
- ✅ Test suite included

## 📄 License

Part of Healthycare project

## 👨‍💻 Author

Created for Healthycare e-commerce platform

---

**Status:** ✅ Production Ready  
**Last Updated:** 2025-01-15  
**Version:** 1.0
