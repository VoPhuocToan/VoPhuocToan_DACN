import mongoose from 'mongoose'

const promotionSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Vui lòng nhập mã khuyến mãi'],
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Vui lòng nhập mô tả']
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true,
    default: 'percentage'
  },
  discountValue: {
    type: Number,
    required: [true, 'Vui lòng nhập giá trị giảm giá']
  },
  minOrderValue: {
    type: Number,
    default: 0
  },
  maxDiscount: {
    type: Number,
    default: null
  },
  usageLimit: {
    type: Number,
    default: null
  },
  usedCount: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  applicableCategories: [{
    type: String
  }]
}, {
  timestamps: true
})

// Method to check if promotion is valid
promotionSchema.methods.isValid = function() {
  const now = new Date()
  return (
    this.isActive &&
    this.startDate <= now &&
    this.endDate >= now &&
    (this.usageLimit === null || this.usedCount < this.usageLimit)
  )
}

const Promotion = mongoose.model('Promotion', promotionSchema)

export default Promotion
