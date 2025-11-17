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
  const { userId, productId, quantity = 1 } = req.body

  if (!userId || !productId) {
    return res.status(400).json({
      success: false,
      message: 'User ID và Product ID là bắt buộc'
    })
  }

  // Get product details
  const product = await Product.findById(productId)
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Sản phẩm không tồn tại'
    })
  }

  let cart = await Cart.findOne({ userId })
  if (!cart) {
    cart = new Cart({ userId, items: [] })
  }

  // Check if item already in cart
  const existingItem = cart.items.find(item => item.productId.toString() === productId)

  if (existingItem) {
    existingItem.quantity += parseInt(quantity)
  } else {
    cart.items.push({
      productId,
      name: product.name,
      price: product.price,
      image: product.image,
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
  const { userId, productId, quantity } = req.body

  if (!userId || !productId || !quantity) {
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

  const item = cart.items.find(item => item.productId.toString() === productId)
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
  const { userId, productId } = req.body

  if (!userId || !productId) {
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

  cart.items = cart.items.filter(item => item.productId.toString() !== productId)
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
