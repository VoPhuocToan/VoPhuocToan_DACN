import express from 'express'
import { chatWithAI } from '../controllers/chatController.js'

const router = express.Router()

// Log route registration
console.log('✅ Chat route registered: POST /api/chat')

router.post('/', chatWithAI)

export default router

