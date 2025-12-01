import Product from '../models/Product.js'
import asyncHandler from '../utils/asyncHandler.js'

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

  // Build query
  const query = { isActive: true }
  
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

