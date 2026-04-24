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

    if (category && category !== 'all') {
      query += ' AND e.category_id = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (e.title LIKE ? OR e.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (status && status !== 'all') {
      query += ' AND e.status = ?';
      params.push(status);
    }

    query += ' ORDER BY e.date ASC, e.created_at DESC';

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
      ORDER BY e.date ASC, e.created_at DESC
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
  const connection = await db.getConnection();
  
  try {
    const eventId = req.params.id;

    // Check if event exists and user has permission
    const [events] = await connection.query('SELECT * FROM events WHERE id = ?', [eventId]);
    if (events.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const event = events[0];

    // Check if user is organizer of this event or admin
    if (req.user.role !== 'admin' && event.organizer_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await connection.beginTransaction();

    try {
      // Delete all related data in order
      
      // 1. Delete certificates for this event
      await connection.query('DELETE FROM certificates WHERE event_id = ?', [eventId]);
      
      // 2. Delete feedback for this event
      await connection.query('DELETE FROM feedback WHERE event_id = ?', [eventId]);
      
      // 3. Delete tickets for bookings of this event
      await connection.query(
        'DELETE FROM tickets WHERE booking_id IN (SELECT id FROM bookings WHERE event_id = ?)',
        [eventId]
      );
      
      // 4. Delete payments for this event
      await connection.query('DELETE FROM payments WHERE event_id = ?', [eventId]);
      
      // 5. Delete bookings for this event
      await connection.query('DELETE FROM bookings WHERE event_id = ?', [eventId]);
      
      // 6. Delete attendees
      await connection.query('DELETE FROM attendees WHERE event_id = ?', [eventId]);
      
      // 7. Delete speakers
      await connection.query('DELETE FROM speakers WHERE event_id = ?', [eventId]);
      
      // 8. Delete schedule sessions
      await connection.query('DELETE FROM schedule_sessions WHERE event_id = ?', [eventId]);
      
      // 9. Delete tasks
      await connection.query('DELETE FROM tasks WHERE event_id = ?', [eventId]);
      
      // 10. Delete marketing campaigns
      await connection.query('DELETE FROM marketing_campaigns WHERE event_id = ?', [eventId]);
      
      // 11. Finally, delete the event
      await connection.query('DELETE FROM events WHERE id = ?', [eventId]);

      await connection.commit();

      res.json({ 
        message: 'Event and all related data deleted successfully',
        deletedEvent: {
          id: event.id,
          title: event.title,
          organizer_id: event.organizer_id
        }
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ 
      message: 'Failed to delete event',
      error: error.message 
    });
  } finally {
    connection.release();
  }
};

// Export events CSV (Admin only)
exports.exportEventsCSV = async (req, res) => {
  try {
    const { category, search, status } = req.query;
    let query = `
      SELECT e.id, e.title, e.date, e.location, e.capacity, e.price, e.status,
             c.name as category_name, u.name as organizer_name
      FROM events e
      LEFT JOIN categories c ON e.category_id = c.id
      LEFT JOIN users u ON e.organizer_id = u.id
      WHERE 1=1
    `;
    const params = [];
    if (category && category !== 'all') {
      query += ' AND e.category_id = ?';
      params.push(category);
    }
    if (search) {
      query += ' AND (e.title LIKE ? OR e.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (status && status !== 'all') {
      query += ' AND e.status = ?';
      params.push(status);
    }
    query += ' ORDER BY e.date DESC';

    const [rows] = await db.query(query, params);
    const header = 'ID,Title,Date,Location,Capacity,Price,Status,Category,Organizer\n';
    const csv = rows
      .map(r => [r.id, r.title, r.date, r.location, r.capacity, r.price, r.status, r.category_name, r.organizer_name]
      .map(v => `"${v}"`).join(',')).join('\n');

    res.setHeader('Content-Disposition','attachment; filename=events.csv');
    res.setHeader('Content-Type','text/csv');
    res.send(header + csv);
  } catch (err) {
    console.error('Export events csv error:', err);
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
