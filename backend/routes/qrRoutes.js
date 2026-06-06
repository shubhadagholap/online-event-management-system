const express = require('express');
const router = express.Router();
const qrCodeController = require('../controllers/qrCodeController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Generate payment QR code (for payment requests)
router.post('/payment/generate', auth, qrCodeController.generatePaymentQR);

// Generate QR code for payment receipt/verification
router.get('/payment/receipt/:paymentId', auth, qrCodeController.generatePaymentReceiptQR);

// Generate bulk payment QR codes (admin only)
router.post('/payment/bulk', auth, roleCheck('admin'), qrCodeController.generateBulkPaymentQR);

// Get QR code for existing transaction
router.get('/transaction/:transactionId', auth, qrCodeController.getTransactionQR);

module.exports = router;