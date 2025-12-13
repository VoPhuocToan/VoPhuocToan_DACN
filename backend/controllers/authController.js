import User from '../models/User.js'
import asyncHandler from '../utils/asyncHandler.js'

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body

  // Check if user exists
  const userExists = await User.findOne({ email })
  if (userExists) {
    return res.status(400).json({
      success: false,
      message: 'Email đã được sử dụng'
    })
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    phone
  })

  if (user) {
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: user.getSignedJwtToken()
      }
    })
  } else {
    res.status(400).json({
      success: false,
      message: 'Đăng ký thất bại'
    })
  }
})

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Validate email & password
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng nhập email và mật khẩu'
    })
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password')

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({
      success: false,
      message: 'Email hoặc mật khẩu không đúng'
    })
  }

  // Check if user is active
  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Tài khoản đã bị khóa'
    })
  }

  res.json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      token: user.getSignedJwtToken()
    }
  })
})

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)

  res.json({
    success: true,
    data: user
  })
})

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Đăng xuất thành công'
  })
})

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    city: req.body.city,
    district: req.body.district,
    ward: req.body.ward
  }

  // Remove undefined fields
  Object.keys(fieldsToUpdate).forEach(key =>
    fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
  )

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  })

  res.json({
    success: true,
    data: user
  })
})

