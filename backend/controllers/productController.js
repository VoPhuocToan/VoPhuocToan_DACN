import Product from '../models/Product.js'
import Order from '../models/Order.js'
import asyncHandler from '../utils/asyncHandler.js'
import mongoose from 'mongoose'

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 12
  const page = Number(req.query.page) || 1
  const category = req.query.category
  const minPrice = req.query.minPrice
  const maxPrice = req.query.maxPrice
  const sortBy = req.query.sortBy || 'createdAt'
  const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1
  const ids = req.query.ids

  // Build query
  const query = { isActive: true }
  
  if (ids) {
    const idList = ids.split(',').filter(id => mongoose.Types.ObjectId.isValid(id))
    if (idList.length > 0) {
      query._id = { $in: idList }
    }
  }
  
  if (category && category !== 'Tất cả') {
    query.category = category
  }

  if (minPrice || maxPrice) {
    query.price = {}
    if (minPrice) query.price.$gte = Number(minPrice)
    if (maxPrice) query.price.$lte = Number(maxPrice)
  }

  const count = await Product.countDocuments(query)
  const products = await Product.find(query)
    .sort({ [sortBy]: sortOrder })
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({
    success: true,
    count,
    page,
    pages: Math.ceil(count / pageSize),
    data: products
  })
})

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: 'ID sản phẩm không hợp lệ'
    })
  }

  const product = await Product.findById(req.params.id)

  if (!product || !product.isActive) {
    return res.status(404).json({
      success: false,
      message: 'Không tìm thấy sản phẩm'
    })
  }

  // Increment views
  product.views += 1
  await product.save()

  res.json({
    success: true,
    data: product
  })
})

// @desc    Get reviews for a product (max 5)
// @route   GET /api/products/:id/reviews
// @access  Public
export const getProductReviews = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: 'ID sản phẩm không hợp lệ'
    })
  }

  const product = await Product.findById(req.params.id)
    .populate('reviews.user', 'name email')

  if (!product || !product.isActive) {
    return res.status(404).json({
      success: false,
      message: 'Không tìm thấy sản phẩm'
    })
  }

  const limitedReviews = product.reviews.slice(0, 5)

  res.json({
    success: true,
    rating: product.rating,
    count: product.numReviews,
    data: limitedReviews
  })
})

// @desc    Create or update product review (max 5 reviews per product)
// @route   POST /api/products/:id/reviews
// @access  Private
export const addProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body

  if (!rating) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng chọn mức đánh giá'
    })
  }

  if (Number(rating) < 1 || Number(rating) > 5) {
    return res.status(400).json({
      success: false,
      message: 'Mức đánh giá phải nằm trong khoảng 1-5'
    })
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: 'ID sản phẩm không hợp lệ'
    })
  }

  const product = await Product.findById(req.params.id)
    .populate('reviews.user', 'name email')

  if (!product || !product.isActive) {
    return res.status(404).json({
      success: false,
      message: 'Không tìm thấy sản phẩm'
    })
  }

  const userId = req.user.id
  const existingReview = product.reviews.find(
    review => review.user.toString() === userId
  )

  if (!existingReview && product.reviews.length >= 5) {
    return res.status(400).json({
      success: false,
      message: 'Sản phẩm đã đạt tối đa 5 đánh giá'
    })
  }

  if (existingReview) {
    existingReview.rating = Number(rating)
    existingReview.comment = comment || ''
    existingReview.createdAt = new Date()
  } else {
    product.reviews.push({
      user: userId,
      rating: Number(rating),
      comment: comment || ''
    })
  }

  product.numReviews = product.reviews.length

  if (product.reviews.length > 0) {
    const avgRating =
      product.reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
      product.reviews.length
    product.rating = Math.round(avgRating * 10) / 10
  } else {
    product.rating = 0
  }

  await product.save()
  await product.populate('reviews.user', 'name email')

  res.status(existingReview ? 200 : 201).json({
    success: true,
    message: existingReview
      ? 'Đã cập nhật đánh giá của bạn'
      : 'Cảm ơn bạn đã đánh giá sản phẩm',
    rating: product.rating,
    count: product.numReviews,
    data: product.reviews.slice(0, 5)
  })
})

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
export const searchProducts = asyncHandler(async (req, res) => {
  const { q } = req.query

  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng nhập từ khóa tìm kiếm'
    })
  }

  const products = await Product.find({
    $text: { $search: q },
    isActive: true
  }).limit(20)

  res.json({
    success: true,
    count: products.length,
    data: products
  })
})

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
export const getProductsByCategory = asyncHandler(async (req, res) => {
  const products = await Product.find({
    category: req.params.category,
    isActive: true
  })

  res.json({
    success: true,
    count: products.length,
    data: products
  })
})

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const productData = { ...req.body }
  
  // Handle uploaded images
  if (req.files && req.files.length > 0) {
    productData.images = req.files.map(file => `/uploads/${file.filename}`)
  } else if (!productData.images || productData.images.length === 0) {
    // If no files uploaded, use image URLs from body (if any)
    if (productData.image) {
      productData.images = [productData.image]
    }
  }

  // Tự động sync inStock với stock
  if (productData.stock !== undefined) {
    const stock = Number(productData.stock)
    productData.inStock = stock > 0
  }

  const product = await Product.create(productData)

  res.status(201).json({
    success: true,
    data: product
  })
})

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id)

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Không tìm thấy sản phẩm'
    })
  }

  const updateData = { ...req.body }
  
  // Handle uploaded images
  if (req.files && req.files.length > 0) {
    const newImages = req.files.map(file => `/uploads/${file.filename}`)
    // Append new images to existing ones or replace
    if (updateData.keepOldImages === 'true') {
      updateData.images = [...(product.images || []), ...newImages]
    } else {
      updateData.images = newImages
    }
  }

  // Tự động sync inStock với stock
  if (updateData.stock !== undefined) {
    const stock = Number(updateData.stock)
    updateData.inStock = stock > 0
  }

  product = await Product.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true
  })

  res.json({
    success: true,
    data: product
  })
})

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Không tìm thấy sản phẩm'
    })
  }

  // Soft delete
  product.isActive = false
  await product.save()

  res.json({
    success: true,
    message: 'Xóa sản phẩm thành công'
  })
})

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body
  const product = await Product.findById(req.params.id)

  if (product) {
    // Check if user has purchased and received the product
    const hasPurchased = await Order.findOne({
      user: req.user._id,
      'orderItems.product': req.params.id,
      $or: [{ status: 'delivered' }, { isDelivered: true }]
    })

    if (!hasPurchased) {
      return res.status(400).json({ 
        message: 'Bạn cần mua và nhận hàng thành công sản phẩm này để có thể đánh giá' 
      })
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    )

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Bạn đã đánh giá sản phẩm này rồi' })
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    }

    product.reviews.push(review)
    product.numReviews = product.reviews.length
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length

    await product.save()
    res.status(201).json({ message: 'Đánh giá đã được thêm' })
  } else {
    res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
  }
})

// @desc    Get all reviews (Admin)
// @route   GET /api/products/admin/reviews
// @access  Private/Admin
export const getAllReviews = asyncHandler(async (req, res) => {
  // Fetch all products with reviews, populate user info
  const products = await Product.find({ 'reviews.0': { $exists: true } })
    .select('name reviews')
    .populate('reviews.user', 'name email')
  
  // Flatten to list of reviews
  let allReviews = []
  products.forEach(product => {
    product.reviews.forEach(review => {
      allReviews.push({
        _id: review._id,
        productId: product._id,
        productName: product.name,
        user: review.user,
        rating: review.rating,
        comment: review.comment,
        reply: review.reply,
        createdAt: review.createdAt
      })
    })
  })

  // Sort by newest
  allReviews.sort((a, b) => b.createdAt - a.createdAt)

  res.json({
    success: true,
    count: allReviews.length,
    data: allReviews
  })
})

// @desc    Reply to review
// @route   PUT /api/products/:id/reviews/:reviewId/reply
// @access  Private/Admin
export const replyToReview = asyncHandler(async (req, res) => {
  const { comment } = req.body
  const product = await Product.findById(req.params.id)

  if (product) {
    const review = product.reviews.id(req.params.reviewId)
    if (review) {
      review.reply = {
        comment,
        createdAt: Date.now()
      }
      await product.save()
      res.json({ message: 'Đã trả lời bình luận' })
    } else {
      res.status(404).json({ message: 'Không tìm thấy bình luận' })
    }
  } else {
    res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
  }
})

// @desc    Delete review
// @route   DELETE /api/products/:id/reviews/:reviewId
// @access  Private/Admin
export const deleteReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    // Filter out the review to delete
    const initialLength = product.reviews.length
    product.reviews = product.reviews.filter(
      (r) => r._id.toString() !== req.params.reviewId
    )

    if (product.reviews.length === initialLength) {
      return res.status(404).json({ message: 'Không tìm thấy bình luận' })
    }

    // Recalculate rating
    product.numReviews = product.reviews.length
    product.rating =
      product.reviews.length > 0
        ? product.reviews.reduce((acc, item) => item.rating + acc, 0) /
          product.reviews.length
        : 0

    await product.save()
    res.json({ message: 'Đã xóa bình luận' })
  } else {
    res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
  }
})

