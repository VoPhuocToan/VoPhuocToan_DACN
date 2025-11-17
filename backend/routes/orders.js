import express from 'express'
import {
  createOrder,
  getMyOrders,
  getOrder,
  updateOrderToPaid,
  updateOrderToDelivered,
  getAllOrders
} from '../controllers/orderController.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

router.post('/', protect, createOrder)
router.get('/myorders', protect, getMyOrders)
router.get('/:id', protect, getOrder)
router.put('/:id/pay', protect, updateOrderToPaid)
router.put('/:id/deliver', protect, authorize('admin'), updateOrderToDelivered)
router.get('/', protect, authorize('admin'), getAllOrders)

export default router

