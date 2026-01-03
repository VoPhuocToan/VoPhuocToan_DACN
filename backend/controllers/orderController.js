import Order from '../models/Order.js'
import Product from '../models/Product.js'
import Promotion from '../models/Promotion.js'
import asyncHandler from '../utils/asyncHandler.js'

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
    promotionCode,
    discountAmount
  } = req.body

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Không có sản phẩm trong đơn hàng'
    })
  }

  // Handle Promotion
  let promotionId = null;
  if (promotionCode) {
    const promotion = await Promotion.findOne({ code: promotionCode.toUpperCase(), isActive: true });
    
    if (promotion) {
      // Check date
      const now = new Date();
      if (now < new Date(promotion.startDate) || now > new Date(promotion.endDate)) {
         return res.status(400).json({ success: false, message: 'Mã khuyến mãi không trong thời gian áp dụng' });
      }

      // Check usage limit
      if (promotion.usageLimit !== null && promotion.usedCount >= promotion.usageLimit) {
         return res.status(400).json({ success: false, message: 'Mã khuyến mãi đã hết lượt sử dụng' });
      }

      // Increment usedCount
      promotion.usedCount = (promotion.usedCount || 0) + 1;
      await promotion.save();
      promotionId = promotion._id;
    } else {
        return res.status(400).json({ success: false, message: 'Mã khuyến mãi không hợp lệ' });
    }
  }

  // Update product stock
  for (const item of orderItems) {
    const product = await Product.findById(item.product)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy sản phẩm: ${item.name}`
      })
    }

    if (product.stock < item.quantity) {
      return res.status(400).json({
        success: false,
        message: `Sản phẩm ${item.name} không đủ số lượng. Tồn kho: ${product.stock}`
      })
    }

    product.stock -= item.quantity
    if (product.stock === 0) {
      product.inStock = false
    }
    await product.save()
  }

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
    promotion: promotionId,
    discountAmount: discountAmount || 0,
    // Set isPaid based on payment method
    // COD and PayOS are not paid immediately upon order creation
    isPaid: !['cod', 'payos'].includes(paymentMethod),
    paidAt: !['cod', 'payos'].includes(paymentMethod) ? Date.now() : null
  })

  res.status(201).json({
    success: true,
    data: order
  })
})

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('orderItems.product', 'name image')

  res.json({
    success: true,
    count: orders.length,
    data: orders
  })
})

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email').populate('orderItems.product', 'name image')

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Không tìm thấy đơn hàng'
    })
  }

  // Make sure user owns order or is admin
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(401).json({
      success: false,
      message: 'Không có quyền truy cập đơn hàng này'
    })
  }

  res.json({
    success: true,
    data: order
  })
})

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Không tìm thấy đơn hàng'
    })
  }

  // Make sure user owns order or is admin
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(401).json({
      success: false,
      message: 'Không có quyền cập nhật đơn hàng này'
    })
  }

  order.isPaid = true
  order.paidAt = Date.now()
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.email_address
  }
  order.status = 'processing'

  const updatedOrder = await order.save()

  res.json({
    success: true,
    data: updatedOrder
  })
})

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Không tìm thấy đơn hàng'
    })
  }

  order.isDelivered = true
  order.deliveredAt = Date.now()
  order.status = 'delivered'
  
  // Auto update payment status to paid when delivered
  order.isPaid = true
  order.paidAt = Date.now()

  const updatedOrder = await order.save()

  res.json({
    success: true,
    data: updatedOrder
  })
})

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 10
  const page = Number(req.query.page) || 1
  const { status, period, category, startDate, endDate } = req.query

  let filter = {}
  if (status && status !== 'all') {
    filter.status = status
  }

  // Date filter
  if (startDate && endDate) {
    filter.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  } else if (period && period !== 'all') {
    const now = new Date()
    let start = new Date()
    
    switch(period) {
      case 'day':
        start.setHours(0,0,0,0)
        break
      case 'week':
        // Get Monday of current week
        const day = start.getDay()
        const diff = start.getDate() - day + (day === 0 ? -6 : 1)
        start.setDate(diff)
        start.setHours(0,0,0,0)
        break
      case 'month':
        start.setDate(1)
        start.setHours(0,0,0,0)
        break
      case 'year':
        start.setMonth(0, 1)
        start.setHours(0,0,0,0)
        break
    }
    filter.createdAt = { $gte: start }
  }

  // Category filter
  if (category && category !== 'all') {
    const products = await Product.find({ category: category }).select('_id')
    const productIds = products.map(p => p._id)
    filter['orderItems.product'] = { $in: productIds }
  }

  const count = await Order.countDocuments(filter)
  const orders = await Order.find(filter)
    .populate('user', 'name email')
    .sort('-createdAt')
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({
    success: true,
    count,
    page,
    pages: Math.ceil(count / pageSize),
    data: orders
  })
})

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private/Admin
export const getOrderStats = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments()
  const pendingOrders = await Order.countDocuments({ status: 'pending' })
  const processingOrders = await Order.countDocuments({ status: 'processing' })
  const shippedOrders = await Order.countDocuments({ status: 'shipped' })
  const deliveredOrders = await Order.countDocuments({ status: 'delivered' })
  const cancelledOrders = await Order.countDocuments({ status: 'cancelled' })

  // Calculate today's revenue
  const today = new Date()
  today.setHours(0, 0, 0, 0)

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

  const todayRevenue = todayRevenueData.length > 0 ? todayRevenueData[0].todayRevenue : 0
  const todayOrdersCount = todayRevenueData.length > 0 ? todayRevenueData[0].count : 0

  // Calculate total revenue (only from delivered orders for accurate revenue)
  const revenueData = await Order.aggregate([
    {
      $match: { status: 'delivered' }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' }
      }
    }
  ])

  const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0

  // Get revenue by month (last 6 months)
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const monthlyRevenue = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo },
        status: 'delivered'
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        revenue: { $sum: '$totalPrice' },
        orders: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    }
  ])

  // Get revenue by day (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const dailyRevenue = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: thirtyDaysAgo },
        status: 'delivered'
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        },
        revenue: { $sum: '$totalPrice' },
        orders: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
    }
  ])

  res.json({
    success: true,
    data: {
      summary: {
        total: totalOrders,
        pending: pendingOrders,
        processing: processingOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders,
        totalRevenue,
        todayRevenue,
        todayOrdersCount
      },
      monthlyRevenue,
      dailyRevenue
    }
  })
})

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body

  const order = await Order.findById(req.params.id)

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Không tìm thấy đơn hàng'
    })
  }

  order.status = status

  if (status === 'delivered') {
    order.isDelivered = true
    order.deliveredAt = Date.now()
  }

  const updatedOrder = await order.save()

  res.json({
    success: true,
    data: updatedOrder
  })
})

// @desc    Cancel order (user only, only when status is pending)
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Không tìm thấy đơn hàng'
    })
  }

  // Make sure user owns the order
  if (order.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({
      success: false,
      message: 'Không có quyền hủy đơn hàng này'
    })
  }

  // Check payment method - PayOS orders cannot be cancelled by user
  if (order.paymentMethod === 'payos') {
    return res.status(400).json({
      success: false,
      message: 'Đơn hàng thanh toán chuyển khoản (PayOS) không thể tự hủy. Vui lòng liên hệ bộ phận chăm sóc khách hàng để được hỗ trợ.'
    })
  }

  // Only allow cancellation when order is pending
  if (order.status !== 'pending') {
    return res.status(400).json({
      success: false,
      message: `Không thể hủy đơn hàng ở trạng thái "${order.status}". Chỉ có thể hủy đơn hàng khi đang ở trạng thái "Chờ xác nhận"`
    })
  }

  // Restore product stock
  for (const item of order.orderItems) {
    const product = await Product.findById(item.product)
    if (product) {
      product.stock += item.quantity
      if (product.stock > 0) {
        product.inStock = true
      }
      await product.save()
    }
  }

  // Restore promotion usage
  if (order.promotion) {
    const promotion = await Promotion.findById(order.promotion);
    if (promotion) {
      promotion.usedCount = Math.max(0, (promotion.usedCount || 0) - 1);
      await promotion.save();
    }
  }

  // Update order status to cancelled
  order.status = 'cancelled'
  const updatedOrder = await order.save()

  res.json({
    success: true,
    message: 'Đã hủy đơn hàng thành công',
    data: updatedOrder
  })
})

// @desc    Get revenue statistics with filters
// @route   GET /api/orders/revenue-stats
// @access  Private/Admin
export const getRevenueStats = asyncHandler(async (req, res) => {
  const { filter = 'month', startDate, endDate } = req.query

  let dateFilter = {}
  let groupBy = {}
  let dateFormat = '%Y-%m-%d'

  const now = new Date()

  switch (filter) {
    case 'day':
      // Last 30 days
      dateFilter = {
        createdAt: {
          $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        }
      }
      groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
      break

    case 'week':
      // Last 12 weeks
      dateFilter = {
        createdAt: {
          $gte: new Date(now.getTime() - 84 * 24 * 60 * 60 * 1000)
        }
      }
      groupBy = {
        $concat: [
          { $toString: { $year: '$createdAt' } },
          '-W',
          { $toString: { $week: '$createdAt' } }
        ]
      }
      break

    case 'month':
      // Last 12 months
      dateFilter = {
        createdAt: {
          $gte: new Date(now.getFullYear() - 1, now.getMonth(), 1)
        }
      }
      groupBy = { $dateToString: { format: '%Y-%m', date: '$createdAt' } }
      break

    case 'year':
      // Last 5 years
      dateFilter = {
        createdAt: {
          $gte: new Date(now.getFullYear() - 5, 0, 1)
        }
      }
      groupBy = { $dateToString: { format: '%Y', date: '$createdAt' } }
      break

    case 'custom':
      if (startDate && endDate) {
        dateFilter = {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))
          }
        }
        groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
      }
      break
  }

  // Get delivered orders only
  const orders = await Order.find({
    ...dateFilter,
    status: 'delivered'
  }).populate('user', 'name email').populate('orderItems.product', 'name')

  // Calculate chart data
  const chartData = {}
  orders.forEach(order => {
    let dateKey
    if (filter === 'week') {
      const year = order.createdAt.getFullYear()
      const week = getWeekNumber(order.createdAt)
      dateKey = `${year}-W${week}`
    } else if (filter === 'month') {
      dateKey = order.createdAt.toISOString().substring(0, 7)
    } else if (filter === 'year') {
      dateKey = order.createdAt.getFullYear().toString()
    } else {
      dateKey = order.createdAt.toISOString().substring(0, 10)
    }

    if (!chartData[dateKey]) {
      chartData[dateKey] = { date: dateKey, revenue: 0, orders: 0 }
    }
    chartData[dateKey].revenue += order.totalPrice
    chartData[dateKey].orders += 1
  })

  const chartDataArray = Object.values(chartData).sort((a, b) => 
    a.date.localeCompare(b.date)
  )

  // Calculate payment methods distribution
  const paymentMethods = {}
  orders.forEach(order => {
    const method = order.paymentMethod || 'cod'
    if (!paymentMethods[method]) {
      paymentMethods[method] = { name: getPaymentMethodName(method), value: 0 }
    }
    paymentMethods[method].value += order.totalPrice
  })

  // Calculate top products
  const productRevenue = {}
  orders.forEach(order => {
    order.orderItems.forEach(item => {
      const productId = item.product?._id?.toString() || 'unknown'
      const productName = item.name
      if (!productRevenue[productId]) {
        productRevenue[productId] = {
          name: productName,
          quantity: 0,
          revenue: 0
        }
      }
      productRevenue[productId].quantity += item.quantity
      productRevenue[productId].revenue += item.price * item.quantity
    })
  })

  const topProducts = Object.values(productRevenue)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  // Calculate summary
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0)
  const totalOrders = orders.length
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  res.json({
    success: true,
    data: {
      summary: {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        period: getPeriodLabel(filter, startDate, endDate),
        growth: 0 // Can be calculated by comparing with previous period
      },
      chartData: chartDataArray,
      paymentMethods: Object.values(paymentMethods),
      topProducts
    }
  })
})

// Helper function to get week number
function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}

// Helper function to get payment method name
function getPaymentMethodName(method) {
  const names = {
    'cod': 'COD',
    'bank': 'Chuyển khoản',
    'momo': 'MoMo',
    'vnpay': 'VNPay'
  }
  return names[method] || method
}

// Helper function to get period label
function getPeriodLabel(filter, startDate, endDate) {
  switch (filter) {
    case 'day':
      return '30 ngày gần nhất'
    case 'week':
      return '12 tuần gần nhất'
    case 'month':
      return '12 tháng gần nhất'
    case 'year':
      return '5 năm gần nhất'
    case 'custom':
      return `Từ ${startDate} đến ${endDate}`
    default:
      return 'Tất cả'
  }
}

