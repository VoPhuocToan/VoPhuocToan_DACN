import Promotion from '../models/Promotion.js'
import asyncHandler from '../utils/asyncHandler.js'

// @desc    Get all promotions
// @route   GET /api/promotions
// @access  Public
export const getPromotions = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 20
  const page = Number(req.query.page) || 1

  const count = await Promotion.countDocuments()
  const promotions = await Promotion.find()
    .sort('-createdAt')
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({
    success: true,
    count,
    page,
    pages: Math.ceil(count / pageSize),
    data: promotions
  })
})

// @desc    Get single promotion
// @route   GET /api/promotions/:id
// @access  Public
export const getPromotion = asyncHandler(async (req, res) => {
  const promotion = await Promotion.findById(req.params.id)

  if (!promotion) {
    return res.status(404).json({
      success: false,
      message: 'Không tìm thấy khuyến mãi'
    })
  }

  res.json({
    success: true,
    data: promotion
  })
})

// @desc    Validate promotion code
// @route   POST /api/promotions/validate
// @access  Public
export const validatePromotion = asyncHandler(async (req, res) => {
  const { code, orderValue } = req.body

  const promotion = await Promotion.findOne({ code: code.toUpperCase() })

  if (!promotion) {
    return res.status(404).json({
      success: false,
      message: 'Mã khuyến mãi không tồn tại'
    })
  }

  if (!promotion.isValid()) {
    return res.status(400).json({
      success: false,
      message: 'Mã khuyến mãi không còn hiệu lực'
    })
  }

  if (orderValue < promotion.minOrderValue) {
    return res.status(400).json({
      success: false,
      message: `Đơn hàng tối thiểu ${promotion.minOrderValue.toLocaleString()}đ để sử dụng mã này`
    })
  }

  let discountAmount = 0
  if (promotion.discountType === 'percentage') {
    discountAmount = (orderValue * promotion.discountValue) / 100
    if (promotion.maxDiscount && discountAmount > promotion.maxDiscount) {
      discountAmount = promotion.maxDiscount
    }
  } else {
    discountAmount = promotion.discountValue
  }

  res.json({
    success: true,
    data: {
      promotion,
      discountAmount,
      finalPrice: orderValue - discountAmount
    }
  })
})

// @desc    Create promotion
// @route   POST /api/promotions
// @access  Private/Admin
export const createPromotion = asyncHandler(async (req, res) => {
  console.log('Create Promotion Body:', req.body)
  try {
    const promotion = await Promotion.create(req.body)

    res.status(201).json({
      success: true,
      data: promotion
    })
  } catch (error) {
    console.error('Create Promotion Error:', error)
    res.status(400)
    throw new Error(error.message)
  }
})

// @desc    Update promotion
// @route   PUT /api/promotions/:id
// @access  Private/Admin
export const updatePromotion = asyncHandler(async (req, res) => {
  console.log('Update Promotion Body:', req.body)
  let promotion = await Promotion.findById(req.params.id)

  if (!promotion) {
    return res.status(404).json({
      success: false,
      message: 'Không tìm thấy khuyến mãi'
    })
  }

  promotion = await Promotion.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  res.json({
    success: true,
    data: promotion
  })
})

// @desc    Delete promotion
// @route   DELETE /api/promotions/:id
// @access  Private/Admin
export const deletePromotion = asyncHandler(async (req, res) => {
  const promotion = await Promotion.findById(req.params.id)

  if (!promotion) {
    return res.status(404).json({
      success: false,
      message: 'Không tìm thấy khuyến mãi'
    })
  }

  await promotion.deleteOne()

  res.json({
    success: true,
    message: 'Xóa khuyến mãi thành công'
  })
})
