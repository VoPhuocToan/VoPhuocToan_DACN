import dotenv from 'dotenv'

dotenv.config()

console.log('=== Environment Variables ===')
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID || 'NOT FOUND')
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET || 'NOT FOUND')
console.log('BACKEND_URL:', process.env.BACKEND_URL || 'NOT FOUND')
console.log('FRONTEND_URL:', process.env.FRONTEND_URL || 'NOT FOUND')
console.log('=============================')
