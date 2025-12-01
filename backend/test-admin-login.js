import dotenv from 'dotenv'

dotenv.config()

const testAdminLogin = async () => {
  try {
    console.log('🧪 Testing admin login...')
    console.log('API URL: http://localhost:5000/api/auth/login')
    
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@healthycare.com',
        password: '123456'
      })
    })

    console.log('Response status:', response.status)
    
    const data = await response.json()
    console.log('Response data:', JSON.stringify(data, null, 2))

    if (data.success) {
      console.log('\n✅ Login successful!')
      console.log('User:', data.data.name)
      console.log('Email:', data.data.email)
      console.log('Role:', data.data.role)
      console.log('Token:', data.data.token.substring(0, 20) + '...')
    } else {
      console.log('\n❌ Login failed:', data.message)
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

testAdminLogin()
