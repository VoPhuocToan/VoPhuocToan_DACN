import payOS from '../config/payos.js';
import Order from '../models/Order.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Create PayOS payment link
// @route   POST /api/payment/payos/create
// @access  Private
export const createPayOSPayment = asyncHandler(async (req, res) => {
  const { orderId, amount, description } = req.body;

  if (!orderId || !amount) {
    return res.status(400).json({
      success: false,
      message: 'Thiếu thông tin orderId hoặc amount'
    });
  }

  try {
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền truy cập đơn hàng này'
      });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    // Prepare items for PayOS
    const items = order.orderItems.map(item => ({
      name: item.name.substring(0, 50), // Limit name length
      quantity: item.quantity,
      price: Math.round(item.price)
    }));

    // Add shipping fee if exists
    if (order.shippingPrice > 0) {
      items.push({
        name: 'Phí vận chuyển',
        quantity: 1,
        price: Math.round(order.shippingPrice)
      });
    }

    const paymentData = {
      orderCode: Number(String(Date.now()).slice(-13)), // Use full timestamp to ensure uniqueness
      amount: Math.round(amount),
      description: `Thanh toan DH ${orderId.slice(-6)}`, // Short description, no special chars
      returnUrl: `${baseUrl}/api/payment/payos/return`,
      cancelUrl: `${baseUrl}/api/payment/payos/return`,
      items: items,
      buyerName: order.user?.name || 'Khách hàng',
      buyerEmail: order.user?.email || '',
      buyerPhone: order.shippingAddress?.phone || '',
      buyerAddress: order.shippingAddress?.address || ''
    };

    console.log('PayOS Payment Data:', JSON.stringify(paymentData, null, 2));

    const paymentLinkResponse = await payOS.paymentRequests.create(paymentData);

    // Save payment info to order
    order.paymentResult = {
      orderCode: paymentData.orderCode,
      checkoutUrl: paymentLinkResponse.checkoutUrl,
      status: 'pending'
    };
    await order.save();

    res.json({
      success: true,
      data: {
        checkoutUrl: paymentLinkResponse.checkoutUrl,
        orderCode: paymentData.orderCode,
        qrCode: paymentLinkResponse.qrCode
      }
    });
  } catch (error) {
    console.error('PayOS Error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo link thanh toán PayOS',
      error: error.message
    });
  }
});

// @desc    Get PayOS payment info
// @route   GET /api/payment/payos/:orderCode
// @access  Private
export const getPayOSPaymentInfo = asyncHandler(async (req, res) => {
  const { orderCode } = req.params;

  try {
    const paymentInfo = await payOS.paymentRequests.get(orderCode);

    res.json({
      success: true,
      data: paymentInfo
    });
  } catch (error) {
    console.error('PayOS Error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin thanh toán',
      error: error.message
    });
  }
});

// @desc    Cancel PayOS payment
// @route   POST /api/payment/payos/cancel/:orderCode
// @access  Private
export const cancelPayOSPayment = asyncHandler(async (req, res) => {
  const { orderCode } = req.params;
  const { cancellationReason } = req.body;

  try {
    const cancelResponse = await payOS.paymentRequests.cancel(
      orderCode,
      cancellationReason || 'Khách hàng hủy thanh toán'
    );

    res.json({
      success: true,
      data: cancelResponse
    });
  } catch (error) {
    console.error('PayOS Error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi hủy thanh toán',
      error: error.message
    });
  }
});

// @desc    PayOS webhook handler
// @route   POST /api/payment/payos/webhook
// @access  Public
export const handlePayOSWebhook = asyncHandler(async (req, res) => {
  const webhookData = req.body;

  try {
    // Verify webhook signature
    const isValid = payOS.verifyPaymentWebhookData(webhookData);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook signature'
      });
    }

    // Find order by orderCode
    const order = await Order.findOne({
      'paymentResult.orderCode': webhookData.data.orderCode
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update order payment status
    if (webhookData.data.code === '00') {
      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentResult.status = 'success';
      order.paymentResult.transactionId = webhookData.data.transactionDateTime;
    } else {
      order.paymentResult.status = 'failed';
    }

    await order.save();

    res.json({
      success: true,
      message: 'Webhook processed successfully'
    });
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed',
      error: error.message
    });
  }
});

// @desc    Confirm PayOS payment return
// @route   GET /api/payment/payos/return
// @access  Public
export const handlePayOSReturn = asyncHandler(async (req, res) => {
  const { code, id, cancel, status, orderCode } = req.query;

  try {
    if (cancel === 'true' || status === 'CANCELLED') {
      return res.redirect(`${process.env.FRONTEND_URL}/payment/cancel?orderCode=${orderCode}`);
    }

    // Get payment info to verify
    const paymentInfo = await payOS.paymentRequests.get(orderCode);

    // Find and update order
    const order = await Order.findOne({
      'paymentResult.orderCode': Number(orderCode)
    });

    if (order && paymentInfo.status === 'PAID') {
      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentResult.status = 'success';
      await order.save();

      return res.redirect(`${process.env.FRONTEND_URL}/payment/success?orderId=${order._id}`);
    }

    res.redirect(`${process.env.FRONTEND_URL}/orders`);
  } catch (error) {
    console.error('Return Handler Error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/payment/error`);
  }
});
