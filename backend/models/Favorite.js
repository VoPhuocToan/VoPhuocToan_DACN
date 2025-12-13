import mongoose from 'mongoose'

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }
}, {
  timestamps: true
})

// Đảm bảo mỗi user chỉ có thể thích một sản phẩm một lần
favoriteSchema.index({ user: 1, product: 1 }, { unique: true })

const Favorite = mongoose.model('Favorite', favoriteSchema)

export default Favorite


