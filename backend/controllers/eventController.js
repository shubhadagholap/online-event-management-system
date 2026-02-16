const db = require('../config/db');

// Get all events with filters
exports.getAllEvents = async (req, res) => {
  try {
    const { category, search, status } = req.query;
    let query = `
      SELECT e.*, c.name as category_name, u.name as organizer_name 
      FROM events e 
      LEFT JOIN categories c ON e.category_id = c.id 
      LEFT JOIN users u ON e.organizer_id = u.id 
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      query += ' AND e.category_id = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (e.title LIKE ? OR e.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (status) {
      query += ' AND e.status = ?';
      params.push(status);
    }

    query += ' ORDER BY e.date DESC';

    const [events] = await db.query(query, params);
    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const [events] = await db.query(`
      SELECT e.*, c.name as category_name, u.name as organizer_name, u.email as organizer_email
      FROM events e 
      LEFT JOIN categories c ON e.category_id = c.id 
      LEFT JOIN users u ON e.organizer_id = u.id 
      WHERE e.id = ?
    `, [req.params.id]);

    if (events.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(events[0]);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get events by organizer
exports.getOrganizerEvents = async (req, res) => {
  try {
    const [events] = await db.query(`
      SELECT e.*, c.name as category_name 
      FROM events e 
      LEFT JOIN categories c ON e.category_id = c.id 
      WHERE e.organizer_id = ?
      ORDER BY e.date DESC
    `, [req.user.id]);

    res.json(events);
  } catch (error) {
    console.error('Get organizer events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create event (Organizer/Admin only)
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, location, capacity, price, category_id, image_url } = req.body;

    if (!title || !date || !location) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const [result] = await db.query(
      `INSERT INTO events (title, description, date, location, capacity, available_seats, price, organizer_id, category_id, image_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, date, location, capacity || 100, capacity || 100, price || 0, req.user.id, category_id, image_url]
    );

    res.status(201).json({ 
      message: 'Event created successfully',
      eventId: result.insertId 
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update event (Organizer/Admin only)
exports.updateEvent = async (req, res) => {
  try {
    const { title, description, date, location, capacity, price, category_id, status, image_url } = req.body;
    const eventId = req.params.id;

    // Check if event exists and user has permission
    const [events] = await db.query('SELECT * FROM events WHERE id = ?', [eventId]);
    if (events.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is organizer of this event or admin
    if (req.user.role !== 'admin' && events[0].organizer_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    await db.query(
      `UPDATE events SET title = ?, description = ?, date = ?, location = ?, capacity = ?, 
       price = ?, category_id = ?, status = ?, image_url = ? WHERE id = ?`,
      [title, description, date, location, capacity, price, category_id, status, image_url, eventId]
    );

    res.json({ message: 'Event updated successfully' });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete event (Organizer/Admin only)
exports.deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    // Check if event exists and user has permission
    const [events] = await db.query('SELECT * FROM events WHERE id = ?', [eventId]);
    if (events.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is organizer of this event or admin
    if (req.user.role !== 'admin' && events[0].organizer_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await db.query('DELETE FROM events WHERE id = ?', [eventId]);

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get dashboard stats (Admin/Organizer)
exports.getDashboardStats = async (req, res) => {
  try {
    let stats = {};

    if (req.user.role === 'admin') {
      // Admin dashboard
      const [totalEvents] = await db.query('SELECT COUNT(*) as count FROM events');
      const [totalUsers] = await db.query('SELECT COUNT(*) as count FROM users');
      const [totalBookings] = await db.query('SELECT COUNT(*) as count FROM bookings');
      const [totalRevenue] = await db.query('SELECT SUM(total_amount) as revenue FROM bookings WHERE payment_status = "paid"');

      stats = {
        totalEvents: totalEvents[0].count,
        totalUsers: totalUsers[0].count,
        totalBookings: totalBookings[0].count,
        totalRevenue: totalRevenue[0].revenue || 0
      };
    } else if (req.user.role === 'organizer') {
      // Organizer dashboard
      const [myEvents] = await db.query('SELECT COUNT(*) as count FROM events WHERE organizer_id = ?', [req.user.id]);
      const [myBookings] = await db.query(
        'SELECT COUNT(*) as count FROM bookings b JOIN events e ON b.event_id = e.id WHERE e.organizer_id = ?',
        [req.user.id]
      );
      const [myRevenue] = await db.query(
        'SELECT SUM(b.total_amount) as revenue FROM bookings b JOIN events e ON b.event_id = e.id WHERE e.organizer_id = ? AND b.payment_status = "paid"',
        [req.user.id]
      );

      stats = {
        myEvents: myEvents[0].count,
        myBookings: myBookings[0].count,
        myRevenue: myRevenue[0].revenue || 0
      };
    }

    res.json(stats);
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
