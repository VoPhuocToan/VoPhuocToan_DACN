import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Order from './models/Order.js'

dotenv.config()

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

const debugRevenue = async () => {
  await connectDB()

  console.log('Current Server Time (new Date()):', new Date())
  console.log('Current Server Time (ISO):', new Date().toISOString())

  // 1. Fetch latest orders
  const latestOrders = await Order.find().sort({ createdAt: -1 }).limit(5)
  console.log('\n--- Latest 5 Orders ---')
  latestOrders.forEach(o => {
    console.log(`ID: ${o._id}, Status: ${o.status}, Total: ${o.totalPrice}, CreatedAt: ${o.createdAt} (${o.createdAt.toLocaleString()})`)
  })

  // 2. Run the aggregation logic
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  console.log('\n--- Aggregation Logic ---')
  console.log('Filter "today" (server local 00:00):', today)
  console.log('Filter "today" (ISO):', today.toISOString())

  const todayRevenueData = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: today },
        status: { $ne: 'cancelled' }
      }
    },
    {
      $group: {
        _id: null,
        todayRevenue: { $sum: '$totalPrice' },
        count: { $sum: 1 }
      }
    }
  ])

  console.log('Aggregation Result:', JSON.stringify(todayRevenueData, null, 2))

  // 3. Try with UTC+7 adjustment logic simulation
  // If we want "Today in Vietnam", we need to find the start of the day in UTC+7.
  // Current time in UTC
  const now = new Date();
  // Convert to Vietnam time string
  const vnTimeStr = now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" });
  const vnDate = new Date(vnTimeStr);
  
  // Start of day in Vietnam
  const startOfVnDay = new Date(vnDate);
  startOfVnDay.setHours(0, 0, 0, 0);
  
  // But we need to compare this against the stored UTC dates in Mongo.
  // Wait, if I construct a date object for "2024-01-02 00:00:00 Vietnam Time", 
  // I need to convert that back to a UTC Date object to query Mongo.
  
  // Alternative:
  // Get current date in VN
  const nowUTC = new Date();
  const offset = 7 * 60 * 60 * 1000; // UTC+7 in milliseconds
  const nowVN = new Date(nowUTC.getTime() + offset);
  
  const startOfTodayVN = new Date(nowVN);
  startOfTodayVN.setUTCHours(0,0,0,0); // This sets it to 00:00 of the VN date, but treated as UTC... wait.
  
  // Correct way to get start of day in VN, represented as UTC timestamp:
  // 1. Get current time
  // 2. Add 7 hours
  // 3. Floor to day
  // 4. Subtract 7 hours
  
  const startOfTodayVN_UTC = new Date(nowUTC.getTime() + offset);
  startOfTodayVN_UTC.setUTCHours(0,0,0,0);
  const queryDate = new Date(startOfTodayVN_UTC.getTime() - offset);
  
  console.log('\n--- Vietnam Time Logic ---')
  console.log('Now UTC:', nowUTC.toISOString());
  console.log('Now VN (approx):', nowVN.toISOString());
  console.log('Start of Today VN (in UTC):', queryDate.toISOString());

  const vnRevenueData = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: queryDate },
        status: { $ne: 'cancelled' }
      }
    },
    {
      $group: {
        _id: null,
        todayRevenue: { $sum: '$totalPrice' },
        count: { $sum: 1 }
      }
    }
  ])
  
  console.log('VN Aggregation Result:', JSON.stringify(vnRevenueData, null, 2))

  process.exit()
}

debugRevenue()
