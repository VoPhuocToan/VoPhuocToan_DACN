import asyncHandler from '../utils/asyncHandler.js'
import Cart from '../models/Cart.js'
import Product from '../models/Product.js'

// @desc    Get cart by user ID
// @route   GET /api/cart/:userId
// @access  Public
export const getCart = asyncHandler(async (req, res) => {
  const { userId } = req.params

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'User ID là bắt buộc'
    })
  }

  let cart = await Cart.findOne({ userId }).populate('items.productId')

  if (!cart) {
    cart = new Cart({ userId, items: [] })
    await cart.save()
  }

  res.json({
    success: true,
    data: cart
  })
})

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Public
export const addToCart = asyncHandler(async (req, res) => {
  const { userId, productId, quantity = 1, productData = null, clientProductId = null } = req.body

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'User ID là bắt buộc'
    })
  }

  // Try to load product from DB if productId provided
  let product = null
  if (productId) {
    try {
      product = await Product.findById(productId)
    } catch (err) {
      product = null
    }
  }

  // If no product in DB, ensure we have productData from client
  if (!product && !productData) {
    return res.status(400).json({
      success: false,
      message: 'Sản phẩm không tồn tại và không có dữ liệu sản phẩm'
    })
  }

  let cart = await Cart.findOne({ userId })
  if (!cart) {
    cart = new Cart({ userId, items: [] })
  }

  // Determine a client identifier for matching (fallback to provided clientProductId)
  const clientId = clientProductId || (productData && productData.clientProductId) || null

  // Check if item already in cart (match by productId if exists, otherwise by clientProductId or name)
  const existingItem = cart.items.find(item => {
    if (product && item.productId && item.productId.toString() === product.id) return true
    if (item.clientProductId && clientId && item.clientProductId === clientId) return true
    if (!product && productData && item.name === productData.name) return true
    return false
  })

  if (existingItem) {
    existingItem.quantity += parseInt(quantity)
  } else {
    cart.items.push({
      productId: product ? product._id : null,
      clientProductId: clientId,
      name: product ? product.name : productData.name,
      price: product ? product.price : productData.price,
      image: product ? product.image : productData.image,
      quantity: parseInt(quantity)
    })
  }

  await cart.save()

  res.json({
    success: true,
    message: 'Thêm vào giỏ hàng thành công',
    data: cart
  })
})

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Public
export const updateCartItem = asyncHandler(async (req, res) => {
  const { userId, productId, quantity, clientProductId = null } = req.body

  if (!userId || !productId && !clientProductId || quantity === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng cung cấp đầy đủ thông tin'
    })
  }

  if (quantity <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Số lượng phải lớn hơn 0'
    })
  }

  const cart = await Cart.findOne({ userId })
  if (!cart) {
    return res.status(404).json({
      success: false,
      message: 'Giỏ hàng không tồn tại'
    })
  }

  const item = cart.items.find(it => {
    if (it.productId && productId && it.productId.toString() === productId) return true
    if (it.clientProductId && clientProductId && it.clientProductId === clientProductId) return true
    return false
  })
  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Sản phẩm không có trong giỏ hàng'
    })
  }

  item.quantity = parseInt(quantity)
  await cart.save()

  res.json({
    success: true,
    message: 'Cập nhật số lượng thành công',
    data: cart
  })
})

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove
// @access  Public
export const removeFromCart = asyncHandler(async (req, res) => {
  const { userId, productId, clientProductId = null } = req.body

  if (!userId || (!productId && !clientProductId)) {
    return res.status(400).json({
      success: false,
      message: 'User ID và Product ID là bắt buộc'
    })
  }

  const cart = await Cart.findOne({ userId })
  if (!cart) {
    return res.status(404).json({
      success: false,
      message: 'Giỏ hàng không tồn tại'
    })
  }

  cart.items = cart.items.filter(item => {
    if (productId && item.productId) return item.productId.toString() !== productId
    if (clientProductId && item.clientProductId) return item.clientProductId !== clientProductId
    return true
  })
  await cart.save()

  res.json({
    success: true,
    message: 'Xóa sản phẩm khỏi giỏ hàng thành công',
    data: cart
  })
})

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Public
export const clearCart = asyncHandler(async (req, res) => {
  const { userId } = req.body

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'User ID là bắt buộc'
    })
  }

  const cart = await Cart.findOne({ userId })
  if (!cart) {
    return res.status(404).json({
      success: false,
      message: 'Giỏ hàng không tồn tại'
    })
  }

  cart.items = []
  await cart.save()

  res.json({
    success: true,
    message: 'Xóa tất cả sản phẩm trong giỏ hàng thành công',
    data: cart
  })
})
