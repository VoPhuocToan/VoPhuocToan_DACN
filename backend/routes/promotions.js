import express from 'express'
import {
  getPromotions,
  getPromotion,
  validatePromotion,
  createPromotion,
  updatePromotion,
  deletePromotion
} from '../controllers/promotionController.js'
import { protect, admin } from '../middleware/auth.js'

const router = express.Router()

router.route('/')
  .get(getPromotions)
  .post(protect, admin, createPromotion)

router.post('/validate', validatePromotion)

router.route('/:id')
  .get(getPromotion)
  .put(protect, admin, updatePromotion)
  .delete(protect, admin, deletePromotion)

export default router
