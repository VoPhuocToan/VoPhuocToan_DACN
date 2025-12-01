import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from './models/User.js'

dotenv.config()

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthycare'

const testLogin = async () => {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('✅ Connected to MongoDB')

    // Check if users exist
    const userCount = await User.countDocuments()
    console.log(`📊 Total users in database: ${userCount}`)

    // List all users
    const users = await User.find().select('name email role isActive')
    console.log('\n👥 Users in database:')
    users.forEach(user => {
      console.log(`- Email: ${user.email}, Name: ${user.name}, Role: ${user.role}, Active: ${user.isActive}`)
    })

    // Create a test user if no users exist
    if (userCount === 0) {
      console.log('\n🔧 Creating test user...')
      const testUser = await User.create({
        name: 'Test User',
        email: 'test@test.com',
        password: '123456',
        phone: '0123456789',
        role: 'user'
      })
      console.log('✅ Test user created:')
      console.log(`   Email: ${testUser.email}`)
      console.log(`   Password: 123456`)
    }

    // Create admin user if none exists
    const adminExists = await User.findOne({ role: 'admin' })
    if (!adminExists) {
      console.log('\n🔧 Creating admin user...')
      const adminUser = await User.create({
        name: 'Admin',
        email: 'admin@healthycare.com',
        password: 'admin123',
        phone: '0987654321',
        role: 'admin'
      })
      console.log('✅ Admin user created:')
      console.log(`   Email: ${adminUser.email}`)
      console.log(`   Password: admin123`)
    }

    console.log('\n✅ Done!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

testLogin()
