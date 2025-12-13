import express from 'express'
import {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  checkFavorite
} from '../controllers/favoriteController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// All routes require authentication
router.use(protect)

router.get('/', getFavorites)
router.post('/', addToFavorites)
router.get('/check/:productId', checkFavorite)
router.delete('/:productId', removeFromFavorites)

export default router


