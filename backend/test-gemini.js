import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

dotenv.config()

const apiKey = process.env.GEMINI_API_KEY

console.log('🔑 API Key:', apiKey ? `${apiKey.substring(0, 20)}...` : 'NOT FOUND')

if (!apiKey) {
  console.error('❌ GEMINI_API_KEY not found in .env')
  process.exit(1)
}

const genAI = new GoogleGenerativeAI(apiKey)

async function testGemini() {
  try {
    console.log('\n📋 Fetching available models from API...\n')
    
    // Try to list models using REST API
    const fetch = (await import('node-fetch')).default
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    )
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Available models:')
      data.models?.forEach(model => {
        console.log(`   - ${model.name}`)
        console.log(`     Supported: ${model.supportedGenerationMethods?.join(', ')}`)
      })
      
      // Try first available model
      if (data.models && data.models.length > 0) {
        const firstModel = data.models[0].name.replace('models/', '')
        console.log(`\n🧪 Testing with first available model: ${firstModel}`)
        
        const genModel = genAI.getGenerativeModel({ model: firstModel })
        const result = await genModel.generateContent('Xin chào')
        const text = (await result.response).text()
        console.log(`✅ Response: ${text}`)
      }
    } else {
      console.log('❌ Failed to fetch models:', response.status, response.statusText)
      const errorText = await response.text()
      console.log('Error details:', errorText)
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error('Full error:', error)
  }
}

testGemini()
