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

// Connect to MongoDB (use connection string from .env)
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthycare'

mongoose.connect(MONGO_URI)
  .then((conn) => {
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    console.log(`📊 Database: ${conn.connection.name}`)
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message || error)
    process.exit(1)
  })

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

