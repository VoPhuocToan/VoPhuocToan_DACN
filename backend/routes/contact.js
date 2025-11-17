import express from 'express'
import {
  sendContactMessage,
  getAllContacts,
  getContactDetail,
  replyContact,
  closeContact,
  deleteContact,
  getContactStats
} from '../controllers/contactController.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

// Public routes
router.post('/', sendContactMessage)

// Admin routes (protected)
router.get('/', protect, authorize('admin'), getAllContacts)
router.get('/stats/count', protect, authorize('admin'), getContactStats)
router.get('/:id', protect, authorize('admin'), getContactDetail)
router.put('/:id/reply', protect, authorize('admin'), replyContact)
router.put('/:id/close', protect, authorize('admin'), closeContact)
router.delete('/:id', protect, authorize('admin'), deleteContact)

export default router
