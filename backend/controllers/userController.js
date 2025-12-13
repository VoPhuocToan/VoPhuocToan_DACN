import User from '../models/User.js'
import asyncHandler from '../utils/asyncHandler.js'

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 10
  const page = Number(req.query.page) || 1
  
  // Build query filters
  let query = {}
  
  // Filter by role
  if (req.query.role) {
    query.role = req.query.role
  }
  
  // Filter by isActive status
  if (req.query.isActive !== undefined && req.query.isActive !== '') {
    query.isActive = req.query.isActive === 'true'
  }
  
  // Search by name, email, phone
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i')
    query.$or = [
      { name: searchRegex },
      { email: searchRegex },
      { phone: searchRegex }
    ]
  }

  const count = await User.countDocuments(query)
  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({
    success: true,
    count,
    page,
    pages: Math.ceil(count / pageSize),
    pagination: {
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    },
    data: users
  })
})

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Không tìm thấy người dùng'
    })
  }

  res.json({
    success: true,
    data: user
  })
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Không tìm thấy người dùng'
    })
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).select('-password')

  res.json({
    success: true,
    data: updatedUser
  })
})

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Không tìm thấy người dùng'
    })
  }

  // Soft delete
  user.isActive = false
  await user.save()

  res.json({
    success: true,
    message: 'Xóa người dùng thành công'
  })
})

