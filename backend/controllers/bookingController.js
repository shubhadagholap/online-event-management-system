const db = require('../config/db');

// Get all bookings (Admin only)
exports.getAllBookings = async (req, res) => {
  try {
    const [bookings] = await db.query(`
      SELECT b.*, e.title as event_title, u.name as user_name, u.email as user_email
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      JOIN users u ON b.user_id = u.id
      ORDER BY b.booking_date DESC
    `);
    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's bookings
exports.getUserBookings = async (req, res) => {
  try {
    const [bookings] = await db.query(`
      SELECT b.*, e.title as event_title, e.date as event_date, e.location as event_location,
             c.name as category_name, t.ticket_number
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      LEFT JOIN categories c ON e.category_id = c.id
      LEFT JOIN tickets t ON b.id = t.booking_id
      WHERE b.user_id = ?
      ORDER BY b.booking_date DESC
    `, [req.user.id]);

    res.json(bookings);
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get organizer's event bookings
exports.getOrganizerBookings = async (req, res) => {
  try {
    const [bookings] = await db.query(`
      SELECT b.*, e.title as event_title, u.name as user_name, u.email as user_email
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      JOIN users u ON b.user_id = u.id
      WHERE e.organizer_id = ?
      ORDER BY b.booking_date DESC
    `, [req.user.id]);

    res.json(bookings);
  } catch (error) {
    console.error('Get organizer bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const [bookings] = await db.query(`
      SELECT b.*, e.title as event_title, e.date as event_date, e.location as event_location,
             u.name as user_name, u.email as user_email, t.ticket_number
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      JOIN users u ON b.user_id = u.id
      LEFT JOIN tickets t ON b.id = t.booking_id
      WHERE b.id = ?
    `, [req.params.id]);

    if (bookings.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user has permission to view this booking
    if (req.user.role !== 'admin' && bookings[0].user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(bookings[0]);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create booking
exports.createBooking = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const { event_id } = req.body;
    const user_id = req.user.id;

    // Check if event exists and has available seats
    const [events] = await connection.query('SELECT * FROM events WHERE id = ?', [event_id]);
    if (events.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Event not found' });
    }

    const event = events[0];

    if (event.available_seats <= 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'No seats available for this event' });
    }

    // Check if user already booked this event
    const [existingBooking] = await connection.query(
      'SELECT * FROM bookings WHERE user_id = ? AND event_id = ? AND status != "cancelled"',
      [user_id, event_id]
    );

    if (existingBooking.length > 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'You have already booked this event' });
    }

    // Create booking
    const [bookingResult] = await connection.query(
      'INSERT INTO bookings (user_id, event_id, total_amount, status, payment_status) VALUES (?, ?, ?, ?, ?)',
      [user_id, event_id, event.price, 'confirmed', 'pending']
    );

    const bookingId = bookingResult.insertId;

    // Generate ticket number
    const ticketNumber = `TKT-${Date.now()}-${bookingId}`;

    // Create ticket
    await connection.query(
      'INSERT INTO tickets (booking_id, ticket_number) VALUES (?, ?)',
      [bookingId, ticketNumber]
    );

    // Update available seats
    await connection.query(
      'UPDATE events SET available_seats = available_seats - 1 WHERE id = ?',
      [event_id]
    );

    await connection.commit();

    res.status(201).json({ 
      message: 'Booking created successfully',
      bookingId,
      ticketNumber
    });
  } catch (error) {
    await connection.rollback();
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    connection.release();
  }
};

// Update booking status (Admin/Organizer)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, payment_status } = req.body;
    const bookingId = req.params.id;

    const [bookings] = await db.query('SELECT * FROM bookings WHERE id = ?', [bookingId]);
    if (bookings.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await db.query(
      'UPDATE bookings SET status = ?, payment_status = ? WHERE id = ?',
      [status, payment_status, bookingId]
    );

    res.json({ message: 'Booking status updated successfully' });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const bookingId = req.params.id;

    // Get booking details
    const [bookings] = await connection.query('SELECT * FROM bookings WHERE id = ?', [bookingId]);
    if (bookings.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Booking not found' });
    }

    const booking = bookings[0];

    // Check if user has permission
    if (req.user.role !== 'admin' && booking.user_id !== req.user.id) {
      await connection.rollback();
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    // Update booking status
    await connection.query(
      'UPDATE bookings SET status = "cancelled" WHERE id = ?',
      [bookingId]
    );

    // Restore available seats
    await connection.query(
      'UPDATE events SET available_seats = available_seats + 1 WHERE id = ?',
      [booking.event_id]
    );

    await connection.commit();

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    connection.release();
  }
};
