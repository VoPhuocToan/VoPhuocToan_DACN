import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      default: () => 'guest_' + Date.now() // Guest user cart
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          // optional: may be null for client-side mock products
        },
        clientProductId: {
          type: String,
          default: null
        },
        name: String,
        price: Number,
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        image: String
      }
    ],
    totalAmount: {
      type: Number,
      default: 0
    },
    totalItems: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
)

// Calculate total before saving
cartSchema.pre('save', function (next) {
  this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0)
  this.totalAmount = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  next()
})

export default mongoose.model('Cart', cartSchema)
