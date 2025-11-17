import Category from '../models/Category.js'
import Product from '../models/Product.js'
import asyncHandler from '../utils/asyncHandler.js'

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort('name')

  // Update product count for each category
  for (const category of categories) {
    const count = await Product.countDocuments({ 
      category: category.name,
      isActive: true 
    })
    category.productCount = count
  }

  res.json({
    success: true,
    count: categories.length,
    data: categories
  })
})

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
export const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id)

  if (!category || !category.isActive) {
    return res.status(404).json({
      success: false,
      message: 'Không tìm thấy danh mục'
    })
  }

  const productCount = await Product.countDocuments({ 
    category: category.name,
    isActive: true 
  })
  category.productCount = productCount

  res.json({
    success: true,
    data: category
  })
})

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body)

  res.status(201).json({
    success: true,
    data: category
  })
})

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = asyncHandler(async (req, res) => {
  let category = await Category.findById(req.params.id)

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Không tìm thấy danh mục'
    })
  }

  category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  res.json({
    success: true,
    data: category
  })
})

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id)

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Không tìm thấy danh mục'
    })
  }

  // Check if category has products
  const productCount = await Product.countDocuments({ 
    category: category.name,
    isActive: true 
  })

  if (productCount > 0) {
    return res.status(400).json({
      success: false,
      message: `Không thể xóa danh mục này vì có ${productCount} sản phẩm`
    })
  }

  // Soft delete
  category.isActive = false
  await category.save()

  res.json({
    success: true,
    message: 'Xóa danh mục thành công'
  })
})

