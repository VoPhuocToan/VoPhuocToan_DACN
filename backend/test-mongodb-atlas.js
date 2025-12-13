import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import mongoose from 'mongoose'
import dns from 'dns'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '.env') })

const MONGODB_URI = process.env.MONGODB_URI

console.log('🔍 MongoDB Atlas Connection Diagnostics\n')
console.log('📋 Configuration:')
console.log('   MONGODB_URI:', MONGODB_URI ? `${MONGODB_URI.substring(0, 50)}...` : 'NOT SET')
console.log('   NODE_ENV:', process.env.NODE_ENV)

if (!MONGODB_URI) {
  console.error('\n❌ MONGODB_URI not found in .env file')
  process.exit(1)
}

// Extract hostname from MongoDB URI
const match = MONGODB_URI.match(/mongodb\+srv:\/\/[^:]+:[^@]+@([^/?]+)/)
const hostname = match ? match[1] : null

console.log('\n🌐 Hostname extracted:', hostname)

if (hostname) {
  console.log('\n🔎 Testing DNS resolution...')
  dns.resolve(hostname, (err, addresses) => {
    if (err) {
      console.error('❌ DNS resolution failed:', err.message)
    } else {
      console.log('✅ DNS resolution successful:')
      addresses.forEach((addr, i) => console.log(`   ${i + 1}. ${addr}`))
    }
    
    testConnection()
  })
} else {
  testConnection()
}

async function testConnection() {
  console.log('\n🔌 Testing MongoDB connection...')
  
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 10000,
      maxPoolSize: 1,
    })
    
    console.log('✅ Connection successful!')
    console.log('   Host:', mongoose.connection.host)
    console.log('   Database:', mongoose.connection.name)
    console.log('   Ready State:', mongoose.connection.readyState)
    
    // Try to list collections
    const collections = await mongoose.connection.db.listCollections().toArray()
    console.log('\n📦 Collections in database:')
    collections.forEach((col, i) => {
      console.log(`   ${i + 1}. ${col.name}`)
    })
    
    await mongoose.connection.close()
    console.log('\n✅ Connection closed successfully')
  } catch (error) {
    console.error('\n❌ Connection failed!')
    console.error('   Error:', error.message)
    console.error('   Code:', error.code)
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\n💡 Hint: Connection refused - MongoDB might not be running at localhost')
      console.error('   Make sure you\'re using MongoDB Atlas connection string')
    } else if (error.message.includes('getaddrinfo')) {
      console.error('\n💡 Hint: DNS/Network error - check internet connection and hostname')
    } else if (error.message.includes('authentication')) {
      console.error('\n💡 Hint: Authentication error - check username/password in connection string')
    } else if (error.message.includes('timed out') || error.message.includes('timeout')) {
      console.error('\n💡 Hint: Connection timeout - check:')
      console.error('      1. MongoDB Atlas cluster is running')
      console.error('      2. Your IP is whitelisted in MongoDB Atlas')
      console.error('      3. Internet connection is stable')
    }
  }
  
  process.exit(0)
}
