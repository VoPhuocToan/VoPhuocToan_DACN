import express from 'express'
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsByCategory
} from '../controllers/productController.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

router.get('/', getProducts)
router.get('/search', searchProducts)
router.get('/category/:category', getProductsByCategory)
router.get('/:id', getProduct)
router.post('/', protect, authorize('admin'), createProduct)
router.put('/:id', protect, authorize('admin'), updateProduct)
router.delete('/:id', protect, authorize('admin'), deleteProduct)

export default router

