// Environment variables are preloaded by start.js
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import errorHandler from './middleware/errorHandler.js'
import passport from './config/passport.js'

// Import Routes
import productRoutes from './routes/products.js'
import userRoutes from './routes/users.js'
import authRoutes from './routes/auth.js'
import chatRoutes from './routes/chat.js'
import orderRoutes from './routes/orders.js'
import categoryRoutes from './routes/categories.js'
import cartRoutes from './routes/cart.js'
import contactRoutes from './routes/contact.js'
import promotionRoutes from './routes/promotions.js'
import favoriteRoutes from './routes/favorites.js'
import paymentRoutes from './routes/payment.js'

// Connect to MongoDB with better error handling
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthycare'

const connectWithRetry = async (retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`🔄 Attempting to connect to MongoDB... (Attempt ${i + 1}/${retries})`)
      const conn = await mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 60000,
        socketTimeoutMS: 75000,
        maxPoolSize: 10,
        minPoolSize: 2,
      })
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
      console.log(`📊 Database: ${conn.connection.name}`)
      console.log(`📦 Connection ready state: ${conn.connection.readyState}`)
      
      return conn
    } catch (error) {
      console.error(`❌ MongoDB connection attempt ${i + 1} failed:`, error.message)
      if (i === retries - 1) {
        console.error('⚠️  All connection attempts failed. Please check:')
        console.error('   1. Internet connection is stable')
        console.error('   2. MongoDB Atlas IP whitelist includes your IP (or 0.0.0.0/0)')
        console.error('   3. MongoDB URI in .env file is correct')
        console.error('   4. MongoDB Atlas cluster is running')
        console.error('🔴 Server will start but database operations will fail!')
      } else {
        console.log(`⏳ Waiting 3 seconds before retry...`)
        await new Promise(resolve => setTimeout(resolve, 3000))
      }
    }
  }
}

// Start connection
connectWithRetry()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5174',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175', // Admin app
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175'
]

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve static files (uploaded images)
import { fileURLToPath } from 'url'
import path from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')))

// Initialize passport (for social login)
app.use(passport.initialize())

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'HealthyCare API Server',
    version: '1.0.0',
    status: 'running'
  })
})

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/promotions', promotionRoutes)
app.use('/api/favorites', favoriteRoutes)
app.use('/api/payment', paymentRoutes)

// Error Handler Middleware (must be last)
app.use(errorHandler)

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`📡 API URL: http://localhost:${PORT}`)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err)
  // Close server & exit process
  // server.close(() => process.exit(1))
})

