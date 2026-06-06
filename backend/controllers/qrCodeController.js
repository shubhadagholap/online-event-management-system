const QRCode = require('qrcode');
const db = require('../config/db');

// Generate QR code for UPI payment
exports.generatePaymentQR = async (req, res) => {
  try {
    const { amount, bookingId, eventId, payerName, upiId } = req.body;
    
    // UPI Payment URL format: upi://pay?pa=merchant@upi&pn=MerchantName&am=100&cu=INR&tn=PaymentDescription
    const merchantUPI = process.env.MERCHANT_UPI || 'eventmanagement@paytm';
    const merchantName = process.env.MERCHANT_NAME || 'Event Management System';
    
    const upiPaymentUrl = `upi://pay?pa=${merchantUPI}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Payment for Booking ${bookingId} Event ${eventId}`)}`;
    
    // Generate QR code as base64 image
    const qrCodeImage = await QRCode.toDataURL(upiPaymentUrl, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 256
    });
    
    res.json({
      success: true,
      qrCode: qrCodeImage,
      upiUrl: upiPaymentUrl,
      paymentDetails: {
        merchant: merchantName,
        amount: amount,
        currency: 'INR',
        description: `Payment for Booking ${bookingId}`
      }
    });
    
  } catch (error) {
    console.error('QR code generation error:', error);
    res.status(500).json({ message: 'Failed to generate QR code' });
  }
};

// Generate QR code for payment verification/receipt
exports.generatePaymentReceiptQR = async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    // Get payment details
    const [payment] = await db.query(`
      SELECT p.*, e.title as event_title, u.name as user_name
      FROM payments p
      JOIN events e ON p.event_id = e.id
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `, [paymentId]);
    
    if (payment.length === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    const paymentData = payment[0];
    
    // Create verification URL or payment receipt data
    const receiptData = JSON.stringify({
      transactionId: paymentData.transaction_id,
      amount: paymentData.amount,
      event: paymentData.event_title,
      payer: paymentData.user_name,
      date: paymentData.payment_date,
      status: paymentData.status
    });
    
    // Generate QR code for payment receipt
    const receiptQR = await QRCode.toDataURL(receiptData, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      width: 200
    });
    
    res.json({
      success: true,
      qrCode: receiptQR,
      paymentData: paymentData
    });
    
  } catch (error) {
    console.error('Receipt QR generation error:', error);
    res.status(500).json({ message: 'Failed to generate receipt QR code' });
  }
};

// Generate bulk payment QR codes for multiple transactions
exports.generateBulkPaymentQR = async (req, res) => {
  try {
    const { payments } = req.body; // Array of payment requests
    
    if (!Array.isArray(payments) || payments.length === 0) {
      return res.status(400).json({ message: 'Invalid payments array' });
    }
    
    const qrCodes = [];
    const merchantUPI = process.env.MERCHANT_UPI || 'eventmanagement@paytm';
    const merchantName = process.env.MERCHANT_NAME || 'Event Management System';
    
    for (let payment of payments) {
      const { amount, bookingId, eventId } = payment;
      
      const upiPaymentUrl = `upi://pay?pa=${merchantUPI}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Payment for Booking ${bookingId}`)}`;
      
      const qrCodeImage = await QRCode.toDataURL(upiPaymentUrl, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        width: 200
      });
      
      qrCodes.push({
        bookingId,
        eventId,
        amount,
        qrCode: qrCodeImage,
        upiUrl: upiPaymentUrl
      });
    }
    
    res.json({
      success: true,
      qrCodes: qrCodes
    });
    
  } catch (error) {
    console.error('Bulk QR generation error:', error);
    res.status(500).json({ message: 'Failed to generate bulk QR codes' });
  }
};

// Get QR code for existing transaction
exports.getTransactionQR = async (req, res) => {
  try {
    const { transactionId } = req.params;
    
    const [payment] = await db.query(
      'SELECT * FROM payments WHERE transaction_id = ?',
      [transactionId]
    );
    
    if (payment.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    const paymentData = payment[0];
    
    // Generate QR for transaction verification
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/verify/${transactionId}`;
    
    const qrCodeImage = await QRCode.toDataURL(verificationUrl, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      width: 200
    });
    
    res.json({
      success: true,
      qrCode: qrCodeImage,
      verificationUrl: verificationUrl,
      transaction: paymentData
    });
    
  } catch (error) {
    console.error('Transaction QR generation error:', error);
    res.status(500).json({ message: 'Failed to generate transaction QR code' });
  }
};