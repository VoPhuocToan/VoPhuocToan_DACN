# 📊 Mô Hình Dữ Liệu - Dự Án Healthycare

## 1. MÔ HÌNH DỮ LIỆU MỨC KHÁI NIỆM (Conceptual Data Model)

### 1.1 Sơ Đồ Thực Thể - Mối Quan Hệ (ER Diagram)

```
┌─────────────────────────────────────────────────────────────┐
│                    HEALTHYCARE DATABASE                     │
└─────────────────────────────────────────────────────────────┘

                         ┌──────────────┐
                         │    User      │
                         ├──────────────┤
                         │ _id (PK)     │
                         │ name         │
                         │ email        │
                         │ password     │
                         │ role         │
                         │ avatar       │
                         │ phone        │
                         │ address      │
                         │ createdAt    │
                         │ updatedAt    │
                         └──────────────┘
                              │
                 ┌────────────┼────────────┐
                 │            │            │
          1:N    │      1:N    │      1:N   │
                 ↓            ↓            ↓
         ┌──────────────┐ ┌────────┐ ┌─────────┐
         │    Order     │ │ Contact│ │ Review  │
         ├──────────────┤ ├────────┤ ├─────────┤
         │ _id (PK)     │ │ _id(PK)│ │ _id(PK) │
         │ userId (FK)  │ │ userId │ │ userId  │
         │ totalAmount  │ │ name   │ │ rating  │
         │ status       │ │ email  │ │ comment │
         │ items[]      │ │ phone  │ │ helpful │
         │ shippingAddr │ │subject │ │ product │
         │ createdAt    │ │message │ │ created │
         │ updatedAt    │ │reply   │ │ updated │
         └──────────────┘ │status  │ └─────────┘
              │           │repliedAt│
              │ N:M        │createdAt│
              │            │updatedAt│
              ↓            └────────┘
         ┌──────────────┐
         │   Product    │◄─────────┐
         ├──────────────┤          │
         │ _id (PK)     │          │
         │ name         │          │
         │ brand        │          │  1:N
         │ price        │          │
         │ category(FK) │──────────┤
         │ description  │          │
         │ image        │    ┌──────────────┐
         │ stock        │    │  Category    │
         │ rating       │    ├──────────────┤
         │ reviews[]    │    │ _id (PK)     │
         │ createdAt    │    │ name         │
         │ updatedAt    │    │ description  │
         └──────────────┘    │ createdAt    │
                             │ updatedAt    │
                             └──────────────┘
```

### 1.2 Danh Sách Các Thực Thể (Entities)

| Thực Thể | Mô Tả |
|----------|-------|
| **User** | Khách hàng và quản trị viên của hệ thống |
| **Product** | Sản phẩm thực phẩm chức năng |
| **Category** | Danh mục sản phẩm |
| **Order** | Đơn hàng của khách hàng |
| **Contact** | Tin nhắn liên hệ từ khách hàng |
| **Review** | Đánh giá sản phẩm |

### 1.3 Mối Quan Hệ Giữa Các Thực Thể

```
User (1) ──── N (Order)        : Một người dùng có nhiều đơn hàng
User (1) ──── N (Contact)      : Một người dùng gửi nhiều tin liên hệ
User (1) ──── N (Review)       : Một người dùng viết nhiều đánh giá

Category (1) ──── N (Product)  : Một danh mục có nhiều sản phẩm
Product (N) ──── M (Order)     : Sản phẩm có trong nhiều đơn hàng
Product (1) ──── N (Review)    : Một sản phẩm có nhiều đánh giá
```

---

## 2. MÔ HÌNH DỮ LIỆU MỨC LOGIC (Logical Data Model)

### 2.1 Bảng User

```
┌─────────────────────────────────────────────────────┐
│                      User                           │
├─────────────────────────────────────────────────────┤
│ Column         │ Type      │ Constraint              │
├────────────────┼───────────┼─────────────────────────┤
│ _id            │ ObjectId  │ PRIMARY KEY             │
│ name           │ String    │ NOT NULL                │
│ email          │ String    │ NOT NULL, UNIQUE        │
│ password       │ String    │ NOT NULL (hashed)       │
│ role           │ String    │ DEFAULT 'customer'      │
│                │           │ ENUM: [customer,admin]  │
│ avatar         │ String    │ OPTIONAL                │
│ phone          │ String    │ OPTIONAL                │
│ address        │ String    │ OPTIONAL                │
│ createdAt      │ Date      │ DEFAULT: now()          │
│ updatedAt      │ Date      │ DEFAULT: now()          │
│ __v            │ Number    │ VERSION CONTROL         │
└────────────────┴───────────┴─────────────────────────┘

Indexes:
  - _id (Primary)
  - email (Unique)
  - role
```

### 2.2 Bảng Product

```
┌──────────────────────────────────────────────────────┐
│                     Product                          │
├──────────────────────────────────────────────────────┤
│ Column         │ Type      │ Constraint               │
├────────────────┼───────────┼──────────────────────────┤
│ _id            │ ObjectId  │ PRIMARY KEY              │
│ name           │ String    │ NOT NULL                 │
│ brand          │ String    │ NOT NULL                 │
│ price          │ Number    │ NOT NULL                 │
│ originalPrice  │ Number    │ OPTIONAL                 │
│ category       │ ObjectId  │ FK → Category._id        │
│ description    │ String    │ NOT NULL                 │
│ ingredients    │ String    │ OPTIONAL                 │
│ usage          │ String    │ OPTIONAL                 │
│ image          │ String    │ OPTIONAL                 │
│ stock          │ Number    │ DEFAULT: 0              │
│ rating         │ Number    │ DEFAULT: 0              │
│ reviews        │ Array     │ Array of review IDs      │
│ inStock        │ Boolean   │ DEFAULT: true           │
│ createdAt      │ Date      │ DEFAULT: now()          │
│ updatedAt      │ Date      │ DEFAULT: now()          │
│ __v            │ Number    │ VERSION CONTROL         │
└────────────────┴───────────┴──────────────────────────┘

Indexes:
  - _id (Primary)
  - category
  - name
  - brand
```

### 2.3 Bảng Category

```
┌──────────────────────────────────────────────────┐
│                    Category                      │
├──────────────────────────────────────────────────┤
│ Column         │ Type      │ Constraint           │
├────────────────┼───────────┼──────────────────────┤
│ _id            │ ObjectId  │ PRIMARY KEY          │
│ name           │ String    │ NOT NULL, UNIQUE     │
│ description    │ String    │ OPTIONAL             │
│ createdAt      │ Date      │ DEFAULT: now()       │
│ updatedAt      │ Date      │ DEFAULT: now()       │
│ __v            │ Number    │ VERSION CONTROL      │
└────────────────┴───────────┴──────────────────────┘

Indexes:
  - _id (Primary)
  - name (Unique)
```

### 2.4 Bảng Order

```
┌──────────────────────────────────────────────────┐
│                     Order                        │
├──────────────────────────────────────────────────┤
│ Column         │ Type      │ Constraint           │
├────────────────┼───────────┼──────────────────────┤
│ _id            │ ObjectId  │ PRIMARY KEY          │
│ userId         │ ObjectId  │ FK → User._id        │
│ items          │ Array     │ NOT NULL             │
│ items[].product│ ObjectId  │ FK → Product._id     │
│ items[].qty    │ Number    │ NOT NULL             │
│ items[].price  │ Number    │ NOT NULL             │
│ totalAmount    │ Number    │ NOT NULL             │
│ status         │ String    │ ENUM: [pending,      │
│                │           │  processing,         │
│                │           │  shipped,delivered]  │
│ shippingAddr   │ String    │ NOT NULL             │
│ paymentMethod  │ String    │ OPTIONAL             │
│ trackingNo     │ String    │ OPTIONAL             │
│ createdAt      │ Date      │ DEFAULT: now()       │
│ updatedAt      │ Date      │ DEFAULT: now()       │
│ __v            │ Number    │ VERSION CONTROL      │
└────────────────┴───────────┴──────────────────────┘

Indexes:
  - _id (Primary)
  - userId
  - status
  - createdAt
```

### 2.5 Bảng Contact

```
┌──────────────────────────────────────────────────┐
│                    Contact                       │
├──────────────────────────────────────────────────┤
│ Column         │ Type      │ Constraint           │
├────────────────┼───────────┼──────────────────────┤
│ _id            │ ObjectId  │ PRIMARY KEY          │
│ name           │ String    │ NOT NULL             │
│ email          │ String    │ NOT NULL             │
│ phone          │ String    │ OPTIONAL             │
│ subject        │ String    │ NOT NULL             │
│ message        │ String    │ NOT NULL             │
│ status         │ String    │ ENUM: [new, read,    │
│                │           │  replied, closed]    │
│ reply          │ String    │ OPTIONAL             │
│ repliedAt      │ Date      │ OPTIONAL             │
│ createdAt      │ Date      │ DEFAULT: now()       │
│ updatedAt      │ Date      │ DEFAULT: now()       │
│ __v            │ Number    │ VERSION CONTROL      │
└────────────────┴───────────┴──────────────────────┘

Indexes:
  - _id (Primary)
  - status
  - email
  - createdAt
```

### 2.6 Bảng Review (Optional)

```
┌──────────────────────────────────────────────────┐
│                    Review                        │
├──────────────────────────────────────────────────┤
│ Column         │ Type      │ Constraint           │
├────────────────┼───────────┼──────────────────────┤
│ _id            │ ObjectId  │ PRIMARY KEY          │
│ userId         │ ObjectId  │ FK → User._id        │
│ productId      │ ObjectId  │ FK → Product._id     │
│ rating         │ Number    │ NOT NULL (1-5)       │
│ comment        │ String    │ NOT NULL             │
│ helpful        │ Number    │ DEFAULT: 0           │
│ createdAt      │ Date      │ DEFAULT: now()       │
│ updatedAt      │ Date      │ DEFAULT: now()       │
│ __v            │ Number    │ VERSION CONTROL      │
└────────────────┴───────────┴──────────────────────┘

Indexes:
  - _id (Primary)
  - userId
  - productId
  - rating
  - createdAt
```

---

## 3. MAPA QUAN HỆ BẢNG (Table Relationship Map)

```
┌─────────────────────────────────────────────────────────────┐
│                     Database Schema                         │
└─────────────────────────────────────────────────────────────┘

                      ┌─────────────┐
                      │   User      │
                      │  (Entities) │
                      └──────┬──────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
         1:N  │         1:N  │         1:N  │
              ↓              ↓              ↓
        ┌──────────┐  ┌─────────┐  ┌──────────┐
        │  Order   │  │ Contact │  │  Review  │
        └────┬─────┘  └─────────┘  └──────┬───┘
             │                            │
        N:M  │                       1:N  │
             ↓                            ↓
        ┌──────────┐◄──────────────────┬──────────┐
        │ Product  │                   │  Product │
        └────┬─────┘                   └──────────┘
             │
        N:1  │
             ↓
        ┌──────────┐
        │ Category │
        └──────────┘
```

---

## 4. BẢNG KIỂU DỮ LIỆU & RÀNG BUỘC

### 4.1 Kiểu Dữ Liệu Chính

| Kiểu | Mô Tả | Ví Dụ |
|------|-------|-------|
| ObjectId | ID duy nhất của MongoDB | `507f1f77bcf86cd799439011` |
| String | Chuỗi ký tự | `"Vitamin D3"` |
| Number | Số nguyên hoặc thập phân | `350000`, `4.5` |
| Boolean | Giá trị true/false | `true` |
| Date | Ngày giờ | `2025-01-15T13:12:03.329Z` |
| Array | Mảng các phần tử | `[{...}, {...}]` |

### 4.2 Ràng Buộc Dữ Liệu

```
User:
  - email: UNIQUE, REQUIRED, Validate Email Format
  - password: REQUIRED, Min 6 characters, Hashed
  - role: REQUIRED, ENUM ['customer', 'admin']

Product:
  - name: REQUIRED, Min 5 characters
  - price: REQUIRED, > 0
  - category: REQUIRED, Must exist in Category
  - stock: >= 0

Category:
  - name: REQUIRED, UNIQUE

Order:
  - userId: REQUIRED, Foreign Key
  - items: REQUIRED, Array of products
  - status: REQUIRED, ENUM values
  - totalAmount: REQUIRED, > 0

Contact:
  - name: REQUIRED
  - email: REQUIRED, Valid email
  - subject: REQUIRED
  - message: REQUIRED
  - status: ENUM ['new','read','replied','closed']

Review:
  - rating: REQUIRED, ENUM [1,2,3,4,5]
  - userId: REQUIRED, Foreign Key
  - productId: REQUIRED, Foreign Key
```

---

## 5. QUY TRÌNH TRUY VẤN DỮ LIỆU

### 5.1 Luồng Dữ Liệu Chính

```
CREATE (Tạo):
  User → (POST /api/auth/register) → Validate → Hash Password → Save DB
  
READ (Đọc):
  GET /api/products → Query DB → Filter → Sort → Return JSON
  
UPDATE (Cập nhật):
  PUT /api/products/:id → Validate → Update DB → Return Updated
  
DELETE (Xóa):
  DELETE /api/products/:id → Delete DB Record → Return Confirmation
```

### 5.2 Ví Dụ Truy Vấn

```javascript
// Lấy tất cả sản phẩm theo danh mục
db.Product.find({ category: categoryId })
  .populate('category')
  .sort({ createdAt: -1 })

// Lấy đơn hàng của user với chi tiết sản phẩm
db.Order.find({ userId: userId })
  .populate('items.product')
  .sort({ createdAt: -1 })

// Lấy danh sách liên hệ chưa trả lời
db.Contact.find({ status: 'new' })
  .sort({ createdAt: -1 })

// Thống kê sản phẩm theo danh mục
db.Product.aggregate([
  { $group: { _id: '$category', count: { $sum: 1 } } }
])
```

---

## 6. LUẬT TOÀN VẸN DỮ LIỆU (Data Integrity Rules)

### 6.1 Ràng Buộc Toàn Vẹn Tham Chiếu (Referential Integrity)

```
1. Product.category → Category._id
   - Khi xóa Category, cần xử lý các Product liên quan
   
2. Order.userId → User._id
   - Khi xóa User, cần xử lý các Order liên quan
   
3. Order.items[].product → Product._id
   - Sản phẩm trong đơn hàng phải tồn tại
   
4. Review.userId → User._id
   - Người viết review phải tồn tại
   
5. Review.productId → Product._id
   - Sản phẩm được review phải tồn tại
```

### 6.2 Ràng Buộc Miền (Domain Constraints)

```
Price: > 0
Rating: 1 ≤ rating ≤ 5
Stock: >= 0
Status: ∈ {pending, processing, shipped, delivered}
Role: ∈ {customer, admin}
```

---

## 7. LIÊN KẾT GIỮA MODEL VÀ DATABASE

### 7.1 Mongoose Schemas (Backend)

```javascript
// User Model
UserSchema {
  name: String,
  email: String (unique),
  password: String,
  role: String (enum),
  ...
}

// Product Model
ProductSchema {
  name: String,
  category: ObjectId (ref: 'Category'),
  price: Number,
  ...
}

// Order Model
OrderSchema {
  userId: ObjectId (ref: 'User'),
  items: [{
    product: ObjectId (ref: 'Product'),
    qty: Number,
    ...
  }],
  ...
}

// Contact Model
ContactSchema {
  name: String,
  email: String,
  status: String (enum),
  ...
}
```

### 7.2 Collections trong MongoDB

```
Database: test
├── users (User collection)
├── products (Product collection)
├── categories (Category collection)
├── orders (Order collection)
├── contacts (Contact collection)
└── reviews (Review collection)
```

---

## 8. BIỂU ĐỒ THỰC THỂ - MỐI QUAN HỆ CHI TIẾT

```
┌─────────────────────────────────────────────────────────────┐
│                    CONCEPTUAL MODEL                         │
├─────────────────────────────────────────────────────────────┤

USER ────── HAS ────── ORDER
│            1:N        │
│                       │
│                    CONTAINS
│                       │
│                       N:M
│                       │
│                    PRODUCT ────── BELONGS TO ────── CATEGORY
│                       │            1:N
│                       │
│                    HAS REVIEW
│                       │
│                       1:N
│                       │
│                    REVIEW

CONTACTS ───── SENT BY ───── USER
         1:N


ATTRIBUTES:
User: ID, Name, Email, Password, Role, Avatar, Phone, Address
Product: ID, Name, Brand, Price, Category, Description, Stock, Rating
Category: ID, Name, Description
Order: ID, UserID, Items[], TotalAmount, Status, Address
Contact: ID, Name, Email, Subject, Message, Status, Reply
```

---

## 9. ĐỀ XUẤT TỐI ƯU HÓA

### 9.1 Indexing Strategy

```
Primary Indexes:
  - User._id (Primary)
  - Product._id (Primary)
  - Order._id (Primary)

Foreign Key Indexes:
  - Product.category
  - Order.userId
  - Review.userId
  - Review.productId

Search Indexes:
  - Product.name (text search)
  - Product.brand
  - Category.name
  - Contact.email

Performance Indexes:
  - Order.status (frequent filtering)
  - Contact.status (frequent filtering)
  - Order.createdAt (sorting)
  - Product.rating (sorting)
```

### 9.2 Denormalization (Lưu trữ dữ liệu lặp lại có chọn lọc)

```
Có thể lưu trữ thêm để tối ưu:
  - Product.totalReviews (tổng số review)
  - Product.averageRating (đánh giá trung bình)
  - Order.userEmail (email người dùng)
  - Order.productNames (tên sản phẩm)
```

---

## 10. TỔNG KẾT THỐNG KÊ

| Thành Phần | Số Lượng |
|-----------|---------|
| Entities | 6 |
| Attributes | 50+ |
| Relationships | 6 |
| Collections | 6 |
| Indexes | 15+ |
| Constraints | 20+ |

---

**Ngày cập nhật:** 2025-01-15  
**Phiên bản:** 1.0  
**Trạng thái:** ✅ Hoàn thành
