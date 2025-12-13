import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên sản phẩm'],
    trim: true,
    index: true
  },
  brand: {
    type: String,
    required: [true, 'Vui lòng nhập thương hiệu'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Vui lòng nhập giá'],
    min: [0, 'Giá phải lớn hơn 0']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Giá gốc phải lớn hơn 0']
  },
  images: [{
    type: String
  }],
  image: {
    type: String
  },
  category: {
    type: String,
    required: [true, 'Vui lòng chọn danh mục'],
    index: true
  },
  description: {
    type: String,
    required: [true, 'Vui lòng nhập mô tả sản phẩm']
  },
  ingredients: {
    type: String,
    required: [true, 'Vui lòng nhập thành phần']
  },
  usage: {
    type: String,
    required: [true, 'Vui lòng nhập hướng dẫn sử dụng']
  },
  note: {
    type: String
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String
    },
    reply: {
      comment: { type: String },
      createdAt: { type: Date, default: Date.now }
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  stock: {
    type: Number,
    required: [true, 'Vui lòng nhập số lượng tồn kho'],
    default: 0,
    min: [0, 'Số lượng tồn kho không được âm']
  },
  inStock: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// Index for search
productSchema.index({ name: 'text', description: 'text', brand: 'text' })

// Pre-save hook: Tự động sync inStock với stock
productSchema.pre('save', function(next) {
  // Nếu stock = 0 hoặc stock < 0, set inStock = false
  // Nếu stock > 0, set inStock = true
  if (this.stock !== undefined) {
    this.inStock = this.stock > 0
  }
  next()
})

// Pre-update hook: Tự động sync inStock với stock khi update
productSchema.pre(['updateOne', 'findOneAndUpdate', 'updateMany'], function(next) {
  // Nếu có update stock, tự động sync inStock
  const update = this.getUpdate()
  if (update && update.$set && update.$set.stock !== undefined) {
    update.$set.inStock = update.$set.stock > 0
  } else if (update && update.stock !== undefined) {
    // Handle direct update (not $set)
    if (!update.$set) update.$set = {}
    update.$set.inStock = update.stock > 0
  }
  next()
})

const Product = mongoose.model('Product', productSchema)

export default Product

