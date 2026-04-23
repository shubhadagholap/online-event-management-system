const db = require('../config/db');

// Create payment
exports.createPayment = async (req, res) => {
  try {
    const { booking_id, event_id, amount, payment_method, payer_name, upi_id } = req.body;
    const user_id = req.user.id;

    // Basic validation
    if (!booking_id || !event_id || !amount || !payment_method) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    // verify booking exists
    const [bookingRows] = await db.query('SELECT * FROM bookings WHERE id = ?', [booking_id]);
    if (bookingRows.length === 0) {
      return res.status(400).json({ message: 'Booking not found' });
    }

    // verify event exists
    const [eventRows] = await db.query('SELECT * FROM events WHERE id = ?', [event_id]);
    if (eventRows.length === 0) {
      return res.status(400).json({ message: 'Event not found' });
    }

    const transaction_id = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const confirmation_number = `CONF-${Date.now()}`;

    const [result] = await db.query(
      `INSERT INTO payments (booking_id, user_id, event_id, amount, payment_method, payer_name, upi_id, transaction_id, confirmation_number, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'completed')`,
      [booking_id, user_id, event_id, amount, payment_method, payer_name || null, upi_id || null, transaction_id, confirmation_number]
    );

    // Update booking payment status
    await db.query(
      'UPDATE bookings SET payment_status = "paid" WHERE id = ?',
      [booking_id]
    );

    res.status(201).json({
      message: 'Payment processed successfully',
      paymentId: result.insertId,
      transaction_id,
      confirmation_number
    });
  } catch (error) {
    console.error('Create payment error:', error);
    // detect foreign key / constraint errors and return a clear message
    if (error && error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ message: 'Invalid booking or event reference' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const [payments] = await db.query(
      `SELECT p.*, e.title as event_title, u.name as user_name, u.email as user_email, p.payer_name, p.upi_id
       FROM payments p
       JOIN events e ON p.event_id = e.id
       JOIN users u ON p.user_id = u.id
       WHERE p.id = ?`,
      [req.params.id]
    );

    if (payments.length === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(payments[0]);
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all payments for user
exports.getUserPayments = async (req, res) => {
  try {
    const [payments] = await db.query(
      `SELECT p.*, e.title as event_title, p.payer_name, p.upi_id
       FROM payments p
       JOIN events e ON p.event_id = e.id
       WHERE p.user_id = ?
       ORDER BY p.payment_date DESC`,
      [req.user.id]
    );
    res.json(payments);
  } catch (error) {
    console.error('Get user payments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all payments (Admin)
exports.getAllPayments = async (req, res) => {
  try {
    const { search, status, from_date, to_date } = req.query;
    let query = `SELECT p.*, e.title as event_title, u.name as user_name, p.payer_name, p.upi_id FROM payments p
           JOIN events e ON p.event_id = e.id
           JOIN users u ON p.user_id = u.id WHERE 1=1`;
    const params = [];

    if (search) {
      query += ` AND (u.name LIKE ? OR u.email LIKE ? OR e.title LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (status) {
      query += ` AND p.status = ?`;
      params.push(status);
    }
    if (from_date) {
      query += ` AND DATE(p.payment_date) >= ?`;
      params.push(from_date);
    }
    if (to_date) {
      query += ` AND DATE(p.payment_date) <= ?`;
      params.push(to_date);
    }

    query += ` ORDER BY p.payment_date DESC`;
    const [payments] = await db.query(query, params);
    res.json(payments);
  } catch (error) {
    console.error('Get all payments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Export payments CSV (Admin)
exports.exportPaymentsCSV = async (req, res) => {
  try {
    const { search, status, from_date, to_date } = req.query;
    let query = `SELECT p.*, e.title as event_title, u.name as user_name, p.payer_name, p.upi_id FROM payments p
           JOIN events e ON p.event_id = e.id
           JOIN users u ON p.user_id = u.id WHERE 1=1`;
    const params = [];

    if (search) {
      query += ` AND (u.name LIKE ? OR u.email LIKE ? OR e.title LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (status) {
      query += ` AND p.status = ?`;
      params.push(status);
    }

    query += ` ORDER BY p.payment_date DESC`;
    const [payments] = await db.query(query, params);

    const header = 'ID,TransactionID,Amount,Method,Status,Event,User,PayerName,UPI,Date\n';
    const rows = payments.map(p => [p.id, p.transaction_id, p.amount, p.payment_method, p.status, p.event_title, p.user_name, p.payer_name || '', p.upi_id || '', p.payment_date]
      .map(v => `"${v}"`).join(',')).join('\n');

    res.setHeader('Content-Disposition', 'attachment; filename=payments.csv');
    res.setHeader('Content-Type', 'text/csv');
    res.send(header + rows);
  } catch (error) {
    console.error('Export payments csv error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Refund payment
exports.refundPayment = async (req, res) => {
  try {
    const paymentId = req.params.id;

    const [payment] = await db.query('SELECT * FROM payments WHERE id = ?', [paymentId]);
    if (payment.length === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    await db.query('UPDATE payments SET status = "refunded" WHERE id = ?', [paymentId]);
    await db.query('UPDATE bookings SET payment_status = "refunded" WHERE id = ?', [payment[0].booking_id]);

    res.json({ message: 'Payment refunded successfully' });
  } catch (error) {
    console.error('Refund payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Delete payment (Admin only)
exports.deletePayment = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const paymentId = req.params.id;

    // Check if payment exists
    const [payments] = await connection.query('SELECT * FROM payments WHERE id = ?', [paymentId]);
    if (payments.length === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    const payment = payments[0];

    await connection.beginTransaction();

    try {
      // Update booking payment status back to pending
      await connection.query(
        'UPDATE bookings SET payment_status = "pending" WHERE id = ?',
        [payment.booking_id]
      );

      // Delete the payment
      await connection.query('DELETE FROM payments WHERE id = ?', [paymentId]);

      await connection.commit();

      res.json({ 
        message: 'Payment deleted successfully',
        deletedPayment: {
          id: payment.id,
          transaction_id: payment.transaction_id,
          amount: payment.amount
        }
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Delete payment error:', error);
    res.status(500).json({ 
      message: 'Failed to delete payment',
      error: error.message 
    });
  } finally {
    connection.release();
  }
};
