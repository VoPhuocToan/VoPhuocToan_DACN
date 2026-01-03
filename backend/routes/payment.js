import express from 'express';
import {
  createPayOSPayment,
  getPayOSPaymentInfo,
  cancelPayOSPayment,
  handlePayOSWebhook,
  handlePayOSReturn
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// PayOS routes
router.post('/payos/create', protect, createPayOSPayment);
router.get('/payos/return', handlePayOSReturn);
router.post('/payos/webhook', handlePayOSWebhook);
router.get('/payos/:orderCode', protect, getPayOSPaymentInfo);
router.post('/payos/cancel/:orderCode', protect, cancelPayOSPayment);

export default router;
