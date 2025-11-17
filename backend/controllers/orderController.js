import Order from '../models/Order.js'
import Product from '../models/Product.js'
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
    totalPrice
  } = req.body

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Không có sản phẩm trong đơn hàng'
    })
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
    totalPrice
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

  const count = await Order.countDocuments()
  const orders = await Order.find()
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

