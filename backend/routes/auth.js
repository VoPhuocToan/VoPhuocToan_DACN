import express from 'express'
import {
  register,
  login,
  getMe,
  logout,
  updateProfile
} from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'
import passport from 'passport'

// Social auth endpoints (Google & Facebook)
// GET /api/auth/google
// GET /api/auth/google/callback
// GET /api/auth/facebook
// GET /api/auth/facebook/callback

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)
router.get('/me', protect, getMe)
router.put('/profile', protect, updateProfile)

// Start Google OAuth flow
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

// Google callback
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: (process.env.FRONTEND_URL || 'http://localhost:5174') + '/dang-nhap' }), (req, res) => {
  try {
    if (!req.user) return res.redirect((process.env.FRONTEND_URL || 'http://localhost:5174') + '/dang-nhap')
    const token = req.user.getSignedJwtToken()
    const frontend = process.env.FRONTEND_URL || 'http://localhost:5174'
    return res.redirect(`${frontend}/auth/success?token=${token}`)
  } catch (err) {
    return res.redirect((process.env.FRONTEND_URL || 'http://localhost:5174') + '/dang-nhap')
  }
})

export default router

