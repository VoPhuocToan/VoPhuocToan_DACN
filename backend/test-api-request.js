import axios from 'axios'

const API_URL = 'http://localhost:5000/api/cart/add'

const testApi = async () => {
  try {
    console.log('🚀 Sending request to:', API_URL)
    const payload = {
      userId: '693e2fd8d3fe7e0fb103bd78',
      productId: '6932da236bc5f193e086aa0a',
      quantity: 1
    }
    console.log('📦 Payload:', payload)

    const response = await axios.post(API_URL, payload)
    console.log('✅ Response Status:', response.status)
    console.log('✅ Response Data:', JSON.stringify(response.data, null, 2))
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Connection Refused! Is the server running on port 5000?')
    } else {
      console.error('❌ Error:', error.response ? error.response.data : error.message)
    }
  }
}

testApi()
