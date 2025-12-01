import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from './models/User.js'

dotenv.config()

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthycare'

const createTestUser = async () => {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('✅ Connected to MongoDB')

    // Delete existing test user if any
    await User.deleteOne({ email: 'test@test.com' })
    
    // Create new test user
    const testUser = await User.create({
      name: 'Test User',
      email: 'test@test.com',
      password: '123456',
      phone: '0123456789',
      role: 'user'
    })
    
    console.log('\n✅ Test user created successfully!')
    console.log('📧 Email: test@test.com')
    console.log('🔑 Password: 123456')
    console.log('👤 Name:', testUser.name)
    console.log('🆔 Role:', testUser.role)
    
    // Verify admin account
    const admin = await User.findOne({ email: 'admin@healthycare.com' })
    if (admin) {
      console.log('\n✅ Admin account exists!')
      console.log('📧 Email: admin@healthycare.com')
      console.log('🔑 Password: admin123')
      console.log('👤 Name:', admin.name)
    }
    
    console.log('\n🎯 Bạn có thể đăng nhập với:')
    console.log('   1. test@test.com / 123456 (User)')
    console.log('   2. admin@healthycare.com / admin123 (Admin)')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

createTestUser()
