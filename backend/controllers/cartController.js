import asyncHandler from '../utils/asyncHandler.js'
import Cart from '../models/Cart.js'
import Product from '../models/Product.js'
import Promotion from '../models/Promotion.js'

// Helper to calculate product price with flash sale
const calculateProductPrice = async (product) => {
  let finalPrice = product.price
  try {
    const now = new Date()
    const activeFlashSales = await Promotion.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
      $or: [
        { code: { $regex: 'FLASH', $options: 'i' } },
        { description: { $regex: 'flash sale', $options: 'i' } }
      ]
    })

    for (const sale of activeFlashSales) {
      let isApplicable = false
      const hasApplicableProducts = sale.applicableProducts && sale.applicableProducts.length > 0
      const hasApplicableCategories = sale.applicableCategories && sale.applicableCategories.length > 0
      
      if (hasApplicableProducts || hasApplicableCategories) {
         const inProducts = hasApplicableProducts && sale.applicableProducts.includes(product._id)
         const inCategories = hasApplicableCategories && sale.applicableCategories.includes(product.category)
         isApplicable = inProducts || inCategories
      } else {
         // Fallback logic: check if product is in top 6 (sorted by createdAt asc to match frontend)
         const top6 = await Product.find({ isActive: true }).sort({ createdAt: 1 }).limit(6)
         const top6Ids = top6.map(p => p._id.toString())
         if (top6Ids.includes(product._id.toString())) {
            isApplicable = true
         }
      }
      
      if (isApplicable) {
         finalPrice = Math.round(product.price * (100 - sale.discountValue) / 100 / 1000) * 1000
         break 
      }
    }
  } catch (err) {
    console.error('Error calculating flash sale price:', err)
  }
  return finalPrice
}

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
  } else {
    // Clean up items where product no longer exists
    const validItems = cart.items.filter(item => item.productId != null)
    
    if (validItems.length < cart.items.length) {
      cart.items = validItems
      await cart.save()
    }

    // Update prices based on current flash sales
    let priceChanged = false
    for (const item of cart.items) {
      if (item.productId) {
        const currentPrice = await calculateProductPrice(item.productId)
        if (item.price !== currentPrice) {
          item.price = currentPrice
          priceChanged = true
        }
      }
    }

    if (priceChanged) {
      await cart.save()
    }
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

  // If product exists in DB, check stock
  if (product) {
    if (!product.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Sản phẩm không còn hoạt động'
      })
    }

    if (!product.inStock || product.stock === 0) {
      return res.status(400).json({
        success: false,
        message: 'Sản phẩm đã hết hàng'
      })
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
    if (product && item.productId && item.productId.toString() === product._id.toString()) return true
    if (item.clientProductId && clientId && item.clientProductId === clientId) return true
    if (!product && productData && item.name === productData.name) return true
    return false
  })

  const quantityToAdd = parseInt(quantity) || 1
  const newQuantity = existingItem ? existingItem.quantity + quantityToAdd : quantityToAdd

  // Check stock if product exists
  if (product && newQuantity > product.stock) {
    return res.status(400).json({
      success: false,
      message: `Số lượng vượt quá tồn kho. Chỉ còn ${product.stock} sản phẩm`
    })
  }

  // Calculate final price (check for Flash Sale)
  let finalPrice = product ? await calculateProductPrice(product) : productData.price

  if (existingItem) {
    existingItem.quantity = newQuantity
    existingItem.price = finalPrice
  } else {
    cart.items.push({
      productId: product ? product._id : null,
      clientProductId: clientId,
      name: product ? product.name : productData.name,
      price: finalPrice,
      image: product ? (product.image || (product.images && product.images[0])) : productData.image,
      quantity: quantityToAdd
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
