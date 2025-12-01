// Preload environment variables before starting the server
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env file
dotenv.config({ path: join(__dirname, '.env') })

console.log('🔧 Preloading environment variables...')
console.log('   - GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? `Found (${process.env.GOOGLE_CLIENT_ID.substring(0, 20)}...)` : 'MISSING')
console.log('   - GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'Found ✓' : 'MISSING')

// Now import and start the server
await import('./server.js')
