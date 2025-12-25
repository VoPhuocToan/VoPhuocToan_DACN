import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Cart from './models/Cart.js'
import Product from './models/Product.js'
import User from './models/User.js'

dotenv.config()

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthycare'

const debugCart = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(MONGO_URI)
    console.log('✅ Connected')

    // 1. Get a user
    let user = await User.findOne({ email: 'test@test.com' })
    if (!user) {
      console.log('Creating test user...')
      user = await User.create({
        name: 'Test User',
        email: 'test@test.com',
        password: '123456',
        phone: '0123456789',
        role: 'user'
      })
    }
    const userId = user._id.toString()
    console.log('User ID:', userId)

    // 2. Get a product
    const product = await Product.findOne({ isActive: true })
    if (!product) {
      console.error('❌ No active product found')
      process.exit(1)
    }
    console.log('Product ID:', product._id)
    console.log('Product Stock:', product.stock)

    // 3. Simulate Add to Cart Logic
    console.log('\n--- Simulating Add to Cart ---')
    
    let cart = await Cart.findOne({ userId })
    if (!cart) {
      console.log('Creating new cart for user')
      cart = new Cart({ userId, items: [] })
    } else {
      console.log('Found existing cart')
    }

    const quantityToAdd = 1
    
    // Check stock
    if (quantityToAdd > product.stock) {
      console.error(`❌ Stock insufficient. Request: ${quantityToAdd}, Stock: ${product.stock}`)
      return
    }

    const existingItem = cart.items.find(item => 
      item.productId && item.productId.toString() === product._id.toString()
    )

    if (existingItem) {
      console.log('Item exists in cart, updating quantity...')
      existingItem.quantity += quantityToAdd
    } else {
      console.log('Item not in cart, adding new item...')
      cart.items.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image || (product.images && product.images[0]),
        quantity: quantityToAdd
      })
    }

    console.log('Saving cart...')
    try {
      await cart.save()
      console.log('✅ Cart saved successfully!')
      console.log('Cart Items:', JSON.stringify(cart.items, null, 2))
    } catch (saveError) {
      console.error('❌ Error saving cart:', saveError)
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  } finally {
    await mongoose.disconnect()
    console.log('🔌 Disconnected')
  }
}

debugCart()
