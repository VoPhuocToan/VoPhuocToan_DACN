import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const options = {
      serverSelectionTimeoutMS: 60000,
      socketTimeoutMS: 75000,
      maxPoolSize: 10,
      minPoolSize: 2,
    }
    
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/healthycare',
      options
    )
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    console.log(`📊 Database: ${conn.connection.name}`)
    console.log(`📦 Ready State: ${conn.connection.readyState}`)
    
    // Listen for connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err)
    })
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected')
    })
    
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected')
    })
    
    return conn
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message)
    console.error('Stack:', error.stack)
    throw error
  }
}

export default connectDB

