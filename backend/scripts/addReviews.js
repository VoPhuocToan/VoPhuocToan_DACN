import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Product from '../models/Product.js'
import User from '../models/User.js'

// Load env variables
dotenv.config()

// Sample review comments
const reviewComments = [
  'Sản phẩm rất tốt, tôi đã sử dụng được 2 tháng và thấy hiệu quả rõ rệt. Đóng gói cẩn thận, giao hàng nhanh.',
  'Chất lượng sản phẩm tốt, giá cả hợp lý. Tôi sẽ tiếp tục mua lại sản phẩm này trong tương lai.',
  'Sản phẩm đúng như mô tả, hiệu quả sau 1 tuần sử dụng. Nhân viên tư vấn nhiệt tình, giao hàng đúng hẹn.',
  'Tôi rất hài lòng với sản phẩm này. Chất lượng tốt, giá cả phải chăng. Sẽ giới thiệu cho bạn bè.',
  'Sản phẩm tốt, đóng gói chắc chắn. Tuy nhiên cần cải thiện thêm về thời gian giao hàng.',
  'Chất lượng ổn, giá cả hợp lý. Sản phẩm đúng như quảng cáo. Tôi sẽ mua lại lần sau.',
  'Sản phẩm chất lượng tốt, hiệu quả rõ rệt sau khi sử dụng. Đóng gói cẩn thận, giao hàng nhanh.',
  'Tôi đã sử dụng nhiều sản phẩm tương tự nhưng sản phẩm này là tốt nhất. Rất hài lòng với chất lượng.',
  'Sản phẩm đúng như mô tả, chất lượng tốt. Nhân viên tư vấn nhiệt tình, giao hàng đúng hẹn.',
  'Chất lượng sản phẩm tốt, giá cả hợp lý. Tôi sẽ tiếp tục ủng hộ cửa hàng trong tương lai.',
  'Sản phẩm rất tốt, hiệu quả sau 2 tuần sử dụng. Đóng gói cẩn thận, giao hàng nhanh chóng.',
  'Tôi rất hài lòng với sản phẩm này. Chất lượng tốt, giá cả phải chăng. Sẽ mua lại.',
  'Sản phẩm chất lượng tốt, đúng như quảng cáo. Nhân viên tư vấn nhiệt tình, giao hàng đúng hẹn.',
  'Chất lượng ổn, giá cả hợp lý. Sản phẩm đúng như mô tả. Tôi sẽ giới thiệu cho người thân.',
  'Sản phẩm tốt, hiệu quả rõ rệt. Đóng gói chắc chắn, giao hàng nhanh. Rất hài lòng.',
]

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/healthycare'
    const options = {
      serverSelectionTimeoutMS: 60000,
      socketTimeoutMS: 75000,
      maxPoolSize: 10,
      minPoolSize: 2,
    }
    
    const conn = await mongoose.connect(mongoUri, options)
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    console.log(`📊 Database: ${conn.connection.name}`)
    return conn
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`)
    process.exit(1)
  }
}

// Generate random rating (mostly positive, 4-5 stars)
const getRandomRating = () => {
  const rand = Math.random()
  if (rand < 0.1) return 3 // 10% chance for 3 stars
  if (rand < 0.2) return 4 // 10% chance for 4 stars
  return 5 // 80% chance for 5 stars
}

// Get random comment
const getRandomComment = () => {
  return reviewComments[Math.floor(Math.random() * reviewComments.length)]
}

// Add reviews to all products
const addReviewsToProducts = async () => {
  try {
    await connectDB()

    // Get all products
    const products = await Product.find({ isActive: true })
    console.log(`Found ${products.length} products`)

    // Get all users (we'll use them as reviewers)
    const users = await User.find()
    console.log(`Found ${users.length} users`)

    if (users.length === 0) {
      console.log('No users found. Please create users first.')
      process.exit(1)
    }

    let totalReviewsAdded = 0

    for (const product of products) {
      // Get existing reviewer IDs to avoid duplicates
      const existingReviewerIds = new Set()
      if (product.reviews && product.reviews.length > 0) {
        product.reviews.forEach(review => {
          if (review.user) {
            existingReviewerIds.add(review.user.toString())
          }
        })
      }

      // Calculate how many reviews we need to add
      const currentReviewCount = product.reviews?.length || 0
      const reviewsToAdd = Math.max(0, 3 - currentReviewCount)

      if (reviewsToAdd === 0) {
        console.log(`Product "${product.name}" already has ${currentReviewCount} reviews. Skipping...`)
        continue
      }

      // Get available users (not already reviewed this product)
      const availableUsers = users.filter(
        user => !existingReviewerIds.has(user._id.toString())
      )

      if (availableUsers.length === 0) {
        console.log(`⚠️  No available users for "${product.name}". Skipping...`)
        continue
      }

      // Shuffle and take needed users
      const shuffledUsers = [...availableUsers].sort(() => Math.random() - 0.5)
      const selectedUsers = shuffledUsers.slice(0, Math.min(reviewsToAdd, shuffledUsers.length))

      // Add reviews
      for (const reviewer of selectedUsers) {
        const rating = getRandomRating()
        const comment = getRandomComment()
        
        // Create review with random date in the past 30 days
        const reviewDate = new Date()
        reviewDate.setDate(reviewDate.getDate() - Math.floor(Math.random() * 30))

        product.reviews.push({
          user: reviewer._id,
          rating: rating,
          comment: comment,
          createdAt: reviewDate
        })

        totalReviewsAdded++
      }

      // Calculate average rating
      if (product.reviews && product.reviews.length > 0) {
        const avgRating = product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        product.rating = Math.round(avgRating * 10) / 10
        product.numReviews = product.reviews.length
      }

      await product.save()
      console.log(`✓ Added ${selectedUsers.length} reviews to "${product.name}" (Total: ${product.reviews.length}, Rating: ${product.rating})`)
    }

    console.log(`\n✅ Successfully added ${totalReviewsAdded} reviews to products`)
    process.exit(0)
  } catch (error) {
    console.error('Error adding reviews:', error)
    process.exit(1)
  }
}

// Run the script
console.log('🚀 Starting to add reviews to products...\n')
addReviewsToProducts().catch(error => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})
