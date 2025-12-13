# Mô hình Dữ liệu Quan niệm (ERD) - Healthycare

Tài liệu này mô tả mô hình thực thể kết hợp (ERD) cho dự án Healthycare, dựa trên các schema Mongoose hiện có trong backend.

## Sơ đồ ERD (Mermaid)

```mermaid
erDiagram
    USER ||--o{ ORDER : "places"
    USER ||--o{ CART : "has"
    USER ||--o{ FAVORITE : "likes"
    USER ||--o{ REVIEW : "writes"
    
    PRODUCT ||--o{ ORDER_ITEM : "contained in"
    PRODUCT ||--o{ CART_ITEM : "contained in"
    PRODUCT ||--o{ FAVORITE : "is liked"
    PRODUCT ||--o{ REVIEW : "has"
    PRODUCT }|--|| CATEGORY : "belongs to"
    
    ORDER ||--|{ ORDER_ITEM : "contains"
    CART ||--|{ CART_ITEM : "contains"
    
    PROMOTION }|--|{ PRODUCT : "applies to"
    
    USER {
        ObjectId _id PK
        string name
        string email
        string password
        string phone
        string address
        string city
        string district
        string ward
        string role "user/admin"
        string avatar
        boolean isActive
        date createdAt
        date updatedAt
    }

    PRODUCT {
        ObjectId _id PK
        string name
        string brand
        number price
        number originalPrice
        string[] images
        string image
        string category FK
        string description
        string ingredients
        string usage
        string note
        number rating
        number numReviews
        number stock
        boolean inStock
        boolean isActive
        number views
        date createdAt
        date updatedAt
    }

    CATEGORY {
        ObjectId _id PK
        string name
        string slug
        string description
        string icon
        boolean isActive
        number productCount
        date createdAt
        date updatedAt
    }

    ORDER {
        ObjectId _id PK
        ObjectId user FK
        object shippingAddress
        string paymentMethod
        object paymentResult
        number itemsPrice
        number shippingPrice
        number totalPrice
        boolean isPaid
        date paidAt
        boolean isDelivered
        date deliveredAt
        string status
        date createdAt
        date updatedAt
    }

    ORDER_ITEM {
        ObjectId product FK
        string name
        string image
        number price
        number quantity
    }

    CART {
        ObjectId _id PK
        string userId "User ID or Guest ID"
        number totalAmount
        number totalItems
        date createdAt
        date updatedAt
    }

    CART_ITEM {
        ObjectId productId FK
        string clientProductId
        string name
        number price
        number quantity
        string image
    }

    FAVORITE {
        ObjectId _id PK
        ObjectId user FK
        ObjectId product FK
        date createdAt
        date updatedAt
    }

    PROMOTION {
        ObjectId _id PK
        string code
        string description
        string discountType
        number discountValue
        number minOrderValue
        number maxDiscount
        number usageLimit
        number usedCount
        date startDate
        date endDate
        boolean isActive
        ObjectId[] applicableProducts FK
        string[] applicableCategories
        date createdAt
        date updatedAt
    }

    CONTACT {
        ObjectId _id PK
        string name
        string email
        string phone
        string subject
        string message
        string status
        string reply
        date repliedAt
        date createdAt
    }

    REVIEW {
        ObjectId user FK
        number rating
        string comment
        object reply
        date createdAt
    }
```

## Chi tiết các Thực thể

### 1. User (Người dùng)
Lưu trữ thông tin tài khoản người dùng và quản trị viên.
- **Quan hệ**:
    - 1 User có thể có nhiều Order.
    - 1 User có thể có 1 Cart (hoặc nhiều phiên cart theo thời gian).
    - 1 User có thể có nhiều Favorite.
    - 1 User có thể viết nhiều Review cho các Product khác nhau.

### 2. Product (Sản phẩm)
Lưu trữ thông tin chi tiết về sản phẩm.
- **Quan hệ**:
    - Thuộc về 1 Category (thông qua trường `category` lưu tên hoặc slug, tuy nhiên trong thiết kế chuẩn nên là ObjectId reference).
    - Có thể nằm trong nhiều Order (thông qua OrderItem).
    - Có thể nằm trong nhiều Cart (thông qua CartItem).
    - Có thể được nhiều User yêu thích (Favorite).
    - Có thể có nhiều Review từ User (Review được nhúng trong Product document).
    - Có thể được áp dụng nhiều Promotion.

### 3. Category (Danh mục)
Phân loại sản phẩm.
- **Quan hệ**:
    - Chứa nhiều Product.

### 4. Order (Đơn hàng)
Lưu trữ thông tin đơn hàng đã đặt.
- **Quan hệ**:
    - Thuộc về 1 User.
    - Chứa danh sách OrderItem (nhúng).

### 5. Cart (Giỏ hàng)
Lưu trữ giỏ hàng tạm thời của người dùng hoặc khách vãng lai.
- **Quan hệ**:
    - Liên kết với User (hoặc guest ID).
    - Chứa danh sách CartItem (nhúng).

### 6. Favorite (Yêu thích)
Lưu trữ danh sách sản phẩm yêu thích của người dùng.
- **Quan hệ**:
    - Liên kết User và Product (bảng trung gian).

### 7. Promotion (Khuyến mãi)
Lưu trữ thông tin mã giảm giá và chương trình khuyến mãi.
- **Quan hệ**:
    - Có thể áp dụng cho danh sách Product cụ thể hoặc Category cụ thể.

### 8. Contact (Liên hệ)
Lưu trữ tin nhắn liên hệ từ khách hàng.
- **Quan hệ**: Độc lập, không có khóa ngoại bắt buộc, nhưng có thể liên kết logic với User qua email.

### Ghi chú về thiết kế NoSQL (MongoDB)
- **Review**: Được thiết kế dưới dạng Embedded Document (nhúng) bên trong `Product` thay vì một collection riêng biệt, giúp tối ưu hóa việc đọc dữ liệu sản phẩm kèm đánh giá.
- **Order Items & Cart Items**: Cũng được nhúng trực tiếp vào `Order` và `Cart` để truy xuất nhanh.
- **Category trong Product**: Hiện tại schema `Product` lưu `category` dưới dạng String. Trong mô hình quan hệ chặt chẽ, đây thường là Reference (ObjectId) tới collection `Category`.
