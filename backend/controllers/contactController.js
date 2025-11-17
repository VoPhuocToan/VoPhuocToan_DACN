import asyncHandler from '../utils/asyncHandler.js'
import nodemailer from 'nodemailer'

// @desc    Send contact message
// @route   POST /api/contact
// @access  Public
export const sendContactMessage = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body

  // Validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng điền đầy đủ thông tin: Tên, Email, Tiêu đề, Nội dung'
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

  // Phone validation (optional but if provided, must be valid)
  if (phone && phone.trim() && !/^[\d\s\-\+\(\)]+$/.test(phone)) {
    return res.status(400).json({
      success: false,
      message: 'Số điện thoại không hợp lệ'
    })
  }

  try {
    // TODO: Implement email sending with nodemailer
    // For now, just log the message
    console.log('📧 New Contact Message:')
    console.log({
      name,
      email,
      phone: phone || 'Không cung cấp',
      subject,
      message,
      receivedAt: new Date().toISOString()
    })

    // Send success response
    res.json({
      success: true,
      message: 'Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể!'
    })
  } catch (error) {
    console.error('❌ Error sending contact message:', error)
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.'
    })
  }
})
