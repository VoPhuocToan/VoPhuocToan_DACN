# 🔌 HealthyCare API Endpoints Reference

## Base URL
```
http://localhost:5000/api
```

## Authentication Endpoints

### Login
```
POST /api/auth/login
Content-Type: application/json

Body:
{
  "email": "admin@healthycare.com",
  "password": "123456"
}

Response (Success):
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "Admin HealthyCare",
    "email": "admin@healthycare.com",
    "phone": "0123456789",
    "role": "admin",
    "avatar": null,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Register
```
POST /api/auth/register
Content-Type: application/json

Body:
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "123456",
  "phone": "0912345678"
}

Response (Success):
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "user@example.com",
    "phone": "0912345678",
    "role": "user",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Get Current User
```
GET /api/auth/me
Authorization: Bearer {token}

Response (Success):
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "Admin HealthyCare",
    "email": "admin@healthycare.com",
    "role": "admin",
    ...
  }
}
```

### Logout
```
GET /api/auth/logout
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Đăng xuất thành công"
}
```

---

## Product Endpoints

### Get All Products
```
GET /api/products?page=1&pageSize=10&search=vitamin&category=Vitamin
Content-Type: application/json

Query Parameters:
- page (optional): Trang hiện tại
- pageSize (optional): Số sản phẩm/trang
- search (optional): Tìm kiếm theo tên
- category (optional): Lọc theo danh mục

Response:
{
  "success": true,
  "count": 10,
  "totalCount": 50,
  "data": [
    {
      "_id": "product_id",
      "name": "Vitamin D3 + K2",
      "brand": "Nature's Way",
      "price": 350000,
      "originalPrice": 420000,
      "category": "Vitamin & Khoáng chất",
      "images": ["url1", "url2"],
      "description": "...",
      "ingredients": "...",
      "usage": "...",
      "stock": 100,
      "inStock": true,
      "rating": 4.5,
      "numReviews": 128,
      "isActive": true,
      "createdAt": "2025-11-17T...",
      "updatedAt": "2025-11-17T..."
    },
    ...
  ]
}
```

### Get Single Product
```
GET /api/products/:id
Content-Type: application/json

Response:
{
  "success": true,
  "data": { ... }  # Same as above
}
```

### Search Products
```
GET /api/products/search?q=vitamin&category=Vitamin
Content-Type: application/json

Query Parameters:
- q: Từ khóa tìm kiếm
- category: Danh mục (optional)

Response:
{
  "success": true,
  "count": 5,
  "data": [ ... ]
}
```

### Create Product (Admin Only)
```
POST /api/products
Content-Type: application/json
Authorization: Bearer {admin_token}

Body:
{
  "name": "New Product",
  "brand": "Brand Name",
  "price": 299000,
  "originalPrice": 350000,
  "images": ["https://url1.jpg", "https://url2.jpg"],
  "category": "Vitamin & Khoáng chất",
  "description": "Product description",
  "ingredients": "Ingredient list",
  "usage": "Usage instructions",
  "note": "Special notes",
  "stock": 50,
  "inStock": true
}

Response:
{
  "success": true,
  "data": {
    "_id": "new_product_id",
    ...
  }
}
```

### Update Product (Admin Only)
```
PUT /api/products/:id
Content-Type: application/json
Authorization: Bearer {admin_token}

Body: (Same as Create - gửi các field muốn update)
{
  "price": 299000,
  "stock": 75,
  ...
}

Response:
{
  "success": true,
  "data": { ... }
}
```

### Delete Product (Admin Only - Soft Delete)
```
DELETE /api/products/:id
Content-Type: application/json
Authorization: Bearer {admin_token}

Response:
{
  "success": true,
  "message": "Xóa sản phẩm thành công"
}
```

---

## Category Endpoints

### Get All Categories
```
GET /api/categories
Content-Type: application/json

Response:
{
  "success": true,
  "count": 8,
  "data": [
    {
      "_id": "category_id",
      "name": "Vitamin & Khoáng chất",
      "description": "Bổ sung vitamin và khoáng chất thiết yếu",
      "icon": "💊",
      "productCount": 5,
      "isActive": true,
      "createdAt": "2025-11-17T...",
      "updatedAt": "2025-11-17T..."
    },
    ...
  ]
}
```

### Get Single Category
```
GET /api/categories/:id
Content-Type: application/json

Response:
{
  "success": true,
  "data": { ... }
}
```

### Create Category (Admin Only)
```
POST /api/categories
Content-Type: application/json
Authorization: Bearer {admin_token}

Body:
{
  "name": "New Category",
  "description": "Category description",
  "icon": "🏥"
}

Response:
{
  "success": true,
  "data": {
    "_id": "category_id",
    ...
  }
}
```

### Update Category (Admin Only)
```
PUT /api/categories/:id
Content-Type: application/json
Authorization: Bearer {admin_token}

Body:
{
  "name": "Updated Category",
  "description": "New description",
  "icon": "🩺"
}

Response:
{
  "success": true,
  "data": { ... }
}
```

### Delete Category (Admin Only - Soft Delete)
```
DELETE /api/categories/:id
Content-Type: application/json
Authorization: Bearer {admin_token}

Response (Success - no products):
{
  "success": true,
  "message": "Xóa danh mục thành công"
}

Response (Error - has products):
{
  "success": false,
  "message": "Không thể xóa danh mục này vì có 5 sản phẩm"
}
```

---

## Order Endpoints

### Get All Orders (Admin)
```
GET /api/orders
Authorization: Bearer {admin_token}

Response:
{
  "success": true,
  "count": 10,
  "data": [ ... ]
}
```

### Get Single Order
```
GET /api/orders/:id
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": { ... }
}
```

### Create Order
```
POST /api/orders
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  "items": [
    {
      "productId": "product_id",
      "quantity": 2,
      "price": 350000
    }
  ],
  "totalPrice": 700000,
  "shippingAddress": "123 Main St",
  "status": "pending"
}

Response:
{
  "success": true,
  "data": { ... }
}
```

### Update Order Status (Admin Only)
```
PUT /api/orders/:id
Content-Type: application/json
Authorization: Bearer {admin_token}

Body:
{
  "status": "shipped"  # pending, processing, shipped, delivered, cancelled
}

Response:
{
  "success": true,
  "data": { ... }
}
```

---

## Cart Endpoints

### Get Cart
```
GET /api/cart
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "items": [ ... ],
    "totalPrice": 1000000
  }
}
```

### Add to Cart
```
POST /api/cart
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  "productId": "product_id",
  "quantity": 2
}

Response:
{
  "success": true,
  "data": { ... }
}
```

### Update Cart Item
```
PUT /api/cart/:itemId
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  "quantity": 3
}

Response:
{
  "success": true,
  "data": { ... }
}
```

### Remove from Cart
```
DELETE /api/cart/:itemId
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Xóa khỏi giỏ thành công"
}
```

---

## Contact Endpoints

### Submit Contact Form
```
POST /api/contact
Content-Type: application/json

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "0912345678",
  "subject": "Product Inquiry",
  "message": "I have a question about..."
}

Response:
{
  "success": true,
  "message": "Cảm ơn bạn. Chúng tôi sẽ liên hệ sớm!"
}
```

### Get All Contacts (Admin Only)
```
GET /api/contact
Authorization: Bearer {admin_token}

Response:
{
  "success": true,
  "count": 10,
  "data": [ ... ]
}
```

---

## Chat Endpoints

### Send Message to Chat
```
POST /api/chat
Content-Type: application/json
Authorization: Bearer {token} (optional)

Body:
{
  "message": "What is the best vitamin?",
  "userId": "user_id" (optional if not authenticated)
}

Response:
{
  "success": true,
  "data": {
    "userMessage": "What is the best vitamin?",
    "aiResponse": "The best vitamin depends on...",
    "timestamp": "2025-11-17T..."
  }
}
```

---

## User Endpoints

### Get All Users (Admin Only)
```
GET /api/users
Authorization: Bearer {admin_token}

Response:
{
  "success": true,
  "count": 50,
  "data": [ ... ]
}
```

### Get User Profile
```
GET /api/users/:id
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": { ... }
}
```

### Update User Profile
```
PUT /api/auth/profile
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  "name": "New Name",
  "email": "newemail@example.com",
  "phone": "0987654321",
  "address": "New Address"
}

Response:
{
  "success": true,
  "data": { ... }
}
```

---

## Error Responses

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Vui lòng đăng nhập"
}
```

### Forbidden (403)
```json
{
  "success": false,
  "message": "Bạn không có quyền truy cập"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Không tìm thấy"
}
```

### Bad Request (400)
```json
{
  "success": false,
  "message": "Email đã được sử dụng"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Lỗi server"
}
```

---

## Headers Required

### For Protected Routes (Admin)
```
Authorization: Bearer {token}
Content-Type: application/json
```

### Example Request
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Product Name",
    "price": 299000
  }'
```

---

## Testing with Postman

1. **Set up environment variable**
   - Variable name: `token`
   - Value: Token từ login response

2. **Use token in requests**
   - Header: `Authorization: Bearer {{token}}`

3. **Auto-update token**
   - In Tests tab: 
   ```javascript
   var jsonData = pm.response.json();
   pm.environment.set("token", jsonData.data.token);
   ```

---

**API Version**: 1.0  
**Last Updated**: 17/11/2025  
**Status**: ✅ Complete
