import express from 'express'
import {
  createOrder,
  getMyOrders,
  getOrder,
  updateOrderToPaid,
  updateOrderToDelivered,
  getAllOrders,
  getOrderStats,
  updateOrderStatus,
  cancelOrder,
  getRevenueStats
} from '../controllers/orderController.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

// Stats route must come before /:id routes
router.get('/stats', protect, authorize('admin'), getOrderStats)
router.get('/revenue-stats', protect, authorize('admin'), getRevenueStats)
router.get('/myorders', protect, getMyOrders)
router.post('/', protect, createOrder)

// Specific routes with /:id must come before generic /:id route
router.put('/:id/pay', protect, updateOrderToPaid)
router.put('/:id/cancel', protect, cancelOrder)
router.put('/:id/deliver', protect, authorize('admin'), updateOrderToDelivered)
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus)
router.get('/:id', protect, getOrder)

// Generic routes (must be last)
router.get('/', protect, authorize('admin'), getAllOrders)

export default router

