import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  console.log('\n🔍 TESTING MONGODB CONNECTION...\n');
  
  const uri = process.env.MONGODB_URI;
  console.log('MongoDB URI:', uri ? uri.substring(0, 40) + '...' : 'NOT FOUND');
  
  if (!uri) {
    console.error('❌ MONGODB_URI not found in .env file');
    process.exit(1);
  }
  
  try {
    console.log('\n⏳ Connecting to MongoDB Atlas...');
    
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ MongoDB Connected Successfully!');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('🌍 Host:', mongoose.connection.host);
    
    // Test a simple query
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📁 Collections:', collections.map(c => c.name).join(', '));
    
    // Count products
    const Product = mongoose.connection.collection('products');
    const count = await Product.countDocuments();
    console.log('📦 Products count:', count);
    
    if (count === 0) {
      console.log('\n⚠️  Database is empty. Run seed script:');
      console.log('   npm run seed');
    }
    
    await mongoose.disconnect();
    console.log('\n✅ Test completed successfully!\n');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ MongoDB Connection Failed!');
    console.error('Error:', error.message);
    
    if (error.message.includes('querySrv ENOTFOUND')) {
      console.log('\n💡 DNS Resolution failed. Possible causes:');
      console.log('   • Internet connection issue');
      console.log('   • Firewall blocking MongoDB');
    } else if (error.message.includes('ECONNREFUSED') || error.message.includes('timed out')) {
      console.log('\n💡 Connection timeout. Possible causes:');
      console.log('   • MongoDB Atlas IP Whitelist not configured');
      console.log('   • Firewall blocking port 27017');
      console.log('\n🔧 Fix:');
      console.log('   1. Go to https://cloud.mongodb.com');
      console.log('   2. Select your cluster → Network Access');
      console.log('   3. Add IP Address → Allow Access from Anywhere (0.0.0.0/0)');
      console.log('   4. Wait 2-3 minutes and try again');
    } else if (error.message.includes('Authentication failed')) {
      console.log('\n💡 Authentication failed. Check:');
      console.log('   • Username and password in MONGODB_URI');
      console.log('   • Special characters are URL encoded');
    }
    
    process.exit(1);
  }
};

testConnection();
