import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import Product from '../models/Product.js'
import User from '../models/User.js'

dotenv.config()

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthycare'

const reviewsData = [
  {
    rating: 5,
    comment: 'Sản phẩm rất tốt, đóng gói cẩn thận. Giao hàng nhanh chóng, sẽ ủng hộ shop dài dài.'
  },
  {
    rating: 4,
    comment: 'Chất lượng ổn trong tầm giá. Tư vấn nhiệt tình. Tuy nhiên giao hàng hơi chậm một chút.'
  }
]

const addReviews = async () => {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('✅ Connected to MongoDB')

    // 1. Create dummy users if not exist
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash('123456', salt)

    const users = []
    
    let user1 = await User.findOne({ email: 'review_user1@example.com' })
    if (!user1) {
      user1 = await User.create({
        name: 'Nguyễn Văn An',
        email: 'review_user1@example.com',
        password: hashedPassword,
        role: 'user'
      })
      console.log('Created user: Nguyễn Văn An')
    }
    users.push(user1)

    let user2 = await User.findOne({ email: 'review_user2@example.com' })
    if (!user2) {
      user2 = await User.create({
        name: 'Trần Thị Bình',
        email: 'review_user2@example.com',
        password: hashedPassword,
        role: 'user'
      })
      console.log('Created user: Trần Thị Bình')
    }
    users.push(user2)

    // 2. Add reviews to all products
    const products = await Product.find({})
    console.log(`Found ${products.length} products`)

    for (const product of products) {
      // Clear existing reviews to avoid duplicates if run multiple times
      product.reviews = []

      // Add review 1
      product.reviews.push({
        user: users[0]._id,
        name: users[0].name,
        rating: reviewsData[0].rating,
        comment: reviewsData[0].comment,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) // 2 days ago
      })

      // Add review 2
      product.reviews.push({
        user: users[1]._id,
        name: users[1].name,
        rating: reviewsData[1].rating,
        comment: reviewsData[1].comment,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1) // 1 day ago
      })

      // Update stats
      product.numReviews = product.reviews.length
      product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

      await product.save()
      // console.log(`Updated reviews for: ${product.name}`)
    }

    console.log('🎉 Successfully added 2 reviews to all products')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

addReviews()
