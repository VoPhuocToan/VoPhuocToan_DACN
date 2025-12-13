import express from 'express'
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsByCategory,
  getProductReviews,
  createProductReview,
  getAllReviews,
  replyToReview,
  deleteReview
} from '../controllers/productController.js'
import { protect, authorize } from '../middleware/auth.js'
import upload from '../middleware/upload.js'

const router = express.Router()

// Admin routes for reviews
router.get('/admin/reviews', protect, authorize('admin'), getAllReviews)
router.put('/:id/reviews/:reviewId/reply', protect, authorize('admin'), replyToReview)
router.delete('/:id/reviews/:reviewId', protect, authorize('admin'), deleteReview)

router.get('/', getProducts)
router.get('/search', searchProducts)
router.get('/category/:category', getProductsByCategory)
router.get('/:id/reviews', getProductReviews)
router.post('/', protect, authorize('admin'), upload.array('images', 5), createProduct)
router.put('/:id', protect, authorize('admin'), upload.array('images', 5), updateProduct)
router.delete('/:id', protect, authorize('admin'), deleteProduct)
router.post('/:id/reviews', protect, createProductReview)
router.get('/:id', getProduct)

// Upload image endpoint
router.post('/upload', protect, authorize('admin'), upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Không có file được upload' })
  }
  
  const imageUrl = `/uploads/${req.file.filename}`
  res.json({ 
    success: true, 
    data: { 
      url: imageUrl,
      filename: req.file.filename 
    } 
  })
})

export default router

