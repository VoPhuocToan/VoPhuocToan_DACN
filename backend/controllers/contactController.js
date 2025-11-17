import Contact from '../models/Contact.js'
import asyncHandler from '../utils/asyncHandler.js'

// @desc    Gửi liên hệ mới
// @route   POST /api/contact
// @access  Public
export const sendContactMessage = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body

  // Validation
  if (!name || !email || !phone || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng điền đầy đủ thông tin: Tên, Email, Số điện thoại, Tiêu đề, Nội dung'
    })
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Email không hợp lệ'
    })
  }

  // Phone validation
  if (phone && phone.trim() && !/^[\d\s\-\+\(\)]+$/.test(phone)) {
    return res.status(400).json({
      success: false,
      message: 'Số điện thoại không hợp lệ'
    })
  }

  try {
    // Lưu vào MongoDB
    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      subject: subject.trim(),
      message: message.trim(),
      status: 'new'
    })

    console.log('✅ Liên hệ mới được lưu:', contact._id)

    // Send success response
    res.status(201).json({
      success: true,
      message: 'Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể!',
      data: contact
    })
  } catch (error) {
    console.error('❌ Lỗi lưu liên hệ:', error)
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.'
    })
  }
})

// @desc    Lấy tất cả liên hệ (Admin)
// @route   GET /api/contact
// @access  Private/Admin
export const getAllContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 })

  res.status(200).json({
    success: true,
    data: contacts,
    count: contacts.length
  })
})

// @desc    Lấy chi tiết liên hệ (Admin)
// @route   GET /api/contact/:id
// @access  Private/Admin
export const getContactDetail = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id)

  if (!contact) {
    return res.status(404).json({
      success: false,
      error: 'Liên hệ không tồn tại'
    })
  }

  // Cập nhật status thành 'read' khi admin xem
  if (contact.status === 'new') {
    contact.status = 'read'
    await contact.save()
  }

  res.status(200).json({
    success: true,
    data: contact
  })
})

// @desc    Trả lời liên hệ (Admin)
// @route   PUT /api/contact/:id/reply
// @access  Private/Admin
export const replyContact = asyncHandler(async (req, res) => {
  const { reply } = req.body

  if (!reply) {
    return res.status(400).json({
      success: false,
      error: 'Vui lòng nhập nội dung trả lời'
    })
  }

  const contact = await Contact.findById(req.params.id)

  if (!contact) {
    return res.status(404).json({
      success: false,
      error: 'Liên hệ không tồn tại'
    })
  }

  contact.reply = reply
  contact.status = 'replied'
  contact.repliedAt = new Date()
  await contact.save()

  res.status(200).json({
    success: true,
    data: contact,
    message: 'Trả lời liên hệ thành công'
  })
})

// @desc    Đóng liên hệ (Admin)
// @route   PUT /api/contact/:id/close
// @access  Private/Admin
export const closeContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id)

  if (!contact) {
    return res.status(404).json({
      success: false,
      error: 'Liên hệ không tồn tại'
    })
  }

  contact.status = 'closed'
  await contact.save()

  res.status(200).json({
    success: true,
    data: contact,
    message: 'Đóng liên hệ thành công'
  })
})

// @desc    Xóa liên hệ (Admin)
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id)

  if (!contact) {
    return res.status(404).json({
      success: false,
      error: 'Liên hệ không tồn tại'
    })
  }

  res.status(200).json({
    success: true,
    data: contact,
    message: 'Xóa liên hệ thành công'
  })
})

// @desc    Lấy thống kê liên hệ (Admin - Dashboard)
// @route   GET /api/contact/stats/count
// @access  Private/Admin
export const getContactStats = asyncHandler(async (req, res) => {
  const total = await Contact.countDocuments()
  const newCount = await Contact.countDocuments({ status: 'new' })
  const readCount = await Contact.countDocuments({ status: 'read' })
  const repliedCount = await Contact.countDocuments({ status: 'replied' })

  res.status(200).json({
    success: true,
    data: {
      total,
      new: newCount,
      read: readCount,
      replied: repliedCount
    }
  })
})
