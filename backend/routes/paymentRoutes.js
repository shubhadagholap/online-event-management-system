const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Protected routes - All require authentication
router.use(auth);

// User routes
router.post('/', paymentController.createPayment);
router.get('/my-payments', paymentController.getUserPayments);

// Admin routes
router.get('/', roleCheck('admin'), paymentController.getAllPayments);
router.get('/export', roleCheck('admin'), paymentController.exportPaymentsCSV);
router.get('/:id', paymentController.getPaymentById);
router.put('/:id/refund', roleCheck('admin'), paymentController.refundPayment);
router.delete('/:id', roleCheck('admin'), paymentController.deletePayment);

module.exports = router;
