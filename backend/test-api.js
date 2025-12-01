// Test login API
const testLoginAPI = async () => {
  try {
    console.log('🔐 Testing Login API...\n')
    
    // Test with admin account
    console.log('1️⃣ Testing with Admin account:')
    const adminResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@healthycare.com',
        password: 'admin123'
      })
    })
    
    const adminData = await adminResponse.json()
    console.log('Response:', adminData)
    
    if (adminData.success) {
      console.log('✅ Admin login successful!')
      console.log('   Name:', adminData.data.name)
      console.log('   Email:', adminData.data.email)
      console.log('   Role:', adminData.data.role)
      console.log('   Token:', adminData.data.token.substring(0, 20) + '...')
    } else {
      console.log('❌ Admin login failed:', adminData.message)
    }
    
    console.log('\n2️⃣ Testing with User account:')
    const userResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'thienchau160504@gmail.com',
        password: 'test123' // Try common password
      })
    })
    
    const userData = await userResponse.json()
    console.log('Response:', userData)
    
    if (userData.success) {
      console.log('✅ User login successful!')
    } else {
      console.log('❌ User login failed:', userData.message)
      console.log('   (Bạn cần biết mật khẩu đúng của user này)')
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

testLoginAPI()
