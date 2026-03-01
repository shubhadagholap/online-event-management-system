const db = require('../config/db');

// Get admin dashboard analytics
exports.getAdminAnalytics = async (req, res) => {
  try {
    const { from_date, to_date } = req.query;
    let dateFilter = '';
    const params = [];

    if (from_date && to_date) {
      dateFilter = ' AND DATE(e.date) BETWEEN ? AND ? ';
      params.push(from_date, to_date);
    }

    // Total revenue
    const [revenue] = await db.query(
      `SELECT COALESCE(SUM(p.amount), 0) as total_revenue FROM payments p
       WHERE p.status = 'completed' AND DATE(p.payment_date) >= DATE_SUB(NOW(), INTERVAL 30 DAY)`
    );

    // Total bookings
    const [bookings] = await db.query(
      `SELECT COUNT(*) as total_bookings, 
        SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
      FROM bookings WHERE DATE(booking_date) >= DATE_SUB(NOW(), INTERVAL 30 DAY)`
    );

    // Total events
    const [events] = await db.query(
      `SELECT COUNT(*) as total_events,
        SUM(CASE WHEN status = 'upcoming' THEN 1 ELSE 0 END) as upcoming,
        SUM(CASE WHEN status = 'ongoing' THEN 1 ELSE 0 END) as ongoing,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
      FROM events WHERE DATE(created_at) >= DATE_SUB(NOW(), INTERVAL 30 DAY)`
    );

    // User registrations
    const [users] = await db.query(
      `SELECT COUNT(*) as total_users FROM users WHERE DATE(created_at) >= DATE_SUB(NOW(), INTERVAL 30 DAY)`
    );

    // Top events by bookings
    const [topEvents] = await db.query(
      `SELECT e.id, e.title, COUNT(b.id) as booking_count, SUM(p.amount) as revenue
      FROM events e
      LEFT JOIN bookings b ON e.id = b.event_id
      LEFT JOIN payments p ON b.id = p.booking_id AND p.status = 'completed'
      WHERE DATE(e.date) >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY e.id, e.title
      ORDER BY booking_count DESC
      LIMIT 10`
    );

    res.json({
      revenue: revenue[0],
      bookings: bookings[0],
      events: events[0],
      users: users[0],
      topEvents
    });
  } catch (error) {
    console.error('Get admin analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get organizer analytics
exports.getOrganizerAnalytics = async (req, res) => {
  try {
    const organizer_id = req.user.id;

    // Total events
    const [myEvents] = await db.query(
      `SELECT COUNT(*) as total_events FROM events WHERE organizer_id = ?`,
      [organizer_id]
    );

    // Total bookings
    const [myBookings] = await db.query(
      `SELECT COUNT(*) as total_bookings,
        SUM(CASE WHEN b.status = 'confirmed' THEN 1 ELSE 0 END) as confirmed
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      WHERE e.organizer_id = ?`,
      [organizer_id]
    );

    // Total revenue
    const [myRevenue] = await db.query(
      `SELECT COALESCE(SUM(p.amount), 0) as total_revenue FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN events e ON b.event_id = e.id
      WHERE e.organizer_id = ? AND p.status = 'completed'`,
      [organizer_id]
    );

    // Event-wise analytics
    const [eventAnalytics] = await db.query(
      `SELECT e.id, e.title, e.date,
        COUNT(DISTINCT b.id) as booking_count,
        SUM(CASE WHEN b.status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_bookings,
        SUM(p.amount) as revenue,
        AVG(f.rating) as average_rating
      FROM events e
      LEFT JOIN bookings b ON e.id = b.event_id
      LEFT JOIN payments p ON b.id = p.booking_id AND p.status = 'completed'
      LEFT JOIN feedback f ON e.id = f.event_id
      WHERE e.organizer_id = ?
      GROUP BY e.id, e.title, e.date
      ORDER BY e.date DESC`,
      [organizer_id]
    );

    res.json({
      myEvents: myEvents[0],
      myBookings: myBookings[0],
      myRevenue: myRevenue[0],
      eventAnalytics
    });
  } catch (error) {
    console.error('Get organizer analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get analytics for a specific event (organizer/admin)
exports.getEventAnalytics = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Registration stats
    const [registrationStats] = await db.query(
      `SELECT
        COUNT(*) as total_bookings,
        SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_bookings,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_bookings,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_bookings
      FROM bookings
      WHERE event_id = ?`,
      [eventId]
    );

    // Attendance stats
    const [attendanceStats] = await db.query(
      `SELECT COUNT(*) as total_attendees
      FROM attendee_profiles
      WHERE event_id = ? AND attendance_status = 'checked_in'`,
      [eventId]
    );

    // Session attendance
    const [sessionStats] = await db.query(
      `SELECT es.session_title, COUNT(sa.id) as attendee_count
      FROM session_attendance sa
      JOIN event_schedules es ON sa.schedule_id = es.id
      WHERE es.event_id = ?
      GROUP BY es.session_title`,
      [eventId]
    );

    // Engagement (poll responses + feedback count)
    const [engagementStats] = await db.query(
      `SELECT 'polls' as type, COUNT(pr.id) as count
      FROM event_polls ep
      LEFT JOIN poll_responses pr ON ep.id = pr.poll_id
      WHERE ep.event_id = ?
      UNION ALL
      SELECT 'feedback' as type, COUNT(ef.id) as count
      FROM event_feedback ef
      WHERE ef.event_id = ?`,
      [eventId, eventId]
    );

    // Revenue
    const [revenueStats] = await db.query(
      `SELECT COALESCE(SUM(p.amount),0) as revenue
      FROM payments p
      WHERE p.event_id = ? AND p.status = 'completed'`,
      [eventId]
    );

    res.json({
      registration: registrationStats[0],
      attendance: attendanceStats[0],
      sessions: sessionStats,
      engagement: engagementStats,
      revenue: revenueStats[0]
    });
  } catch (error) {
    console.error('Get event analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Generate reports
exports.generateReport = async (req, res) => {
  try {
    const { report_type, from_date, to_date } = req.body;
    const organizer_id = req.user.role === 'admin' ? null : req.user.id;

    let queryData = {
      total_revenue: 0,
      total_registrations: 0,
      total_attendees: 0,
      total_events: 0
    };

    if (report_type === 'revenue') {
      const [data] = await db.query(
        `SELECT COALESCE(SUM(p.amount), 0) as total_revenue
        FROM payments p
        WHERE p.status = 'completed'
        AND DATE(p.payment_date) BETWEEN ? AND ?`,
        [from_date, to_date]
      );
      queryData.total_revenue = data[0].total_revenue;
    }

    if (report_type === 'registrations') {
      const [data] = await db.query(
        `SELECT COUNT(*) as total_registrations
        FROM bookings
        WHERE DATE(booking_date) BETWEEN ? AND ?`,
        [from_date, to_date]
      );
      queryData.total_registrations = data[0].total_registrations;
    }

    if (report_type === 'attendance') {
      const [data] = await db.query(
        `SELECT COUNT(*) as total_attendees
        FROM bookings
        WHERE status = 'confirmed'
        AND DATE(booking_date) BETWEEN ? AND ?`,
        [from_date, to_date]
      );
      queryData.total_attendees = data[0].total_attendees;
    }

    if (report_type === 'performance') {
      const [data] = await db.query(
        `SELECT COUNT(*) as total_events FROM events WHERE DATE(date) BETWEEN ? AND ?`,
        [from_date, to_date]
      );
      queryData.total_events = data[0].total_events;
    }

    // Save report
    const [result] = await db.query(
      `INSERT INTO reports (report_type, organizer_id, start_date, end_date, total_revenue, total_registrations, total_attendees, total_events)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [report_type, organizer_id, from_date, to_date, queryData.total_revenue, queryData.total_registrations, queryData.total_attendees, queryData.total_events]
    );

    res.json({
      message: 'Report generated successfully',
      reportId: result.insertId,
      data: queryData
    });
  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get reports
exports.getReports = async (req, res) => {
  try {
    const organizer_id = req.user.role === 'admin' ? null : req.user.id;

    let query = `SELECT * FROM reports `;
    const params = [];

    if (organizer_id) {
      query += `WHERE organizer_id = ? `;
      params.push(organizer_id);
    }

    query += `ORDER BY created_at DESC`;

    const [reports] = await db.query(query, params);
    res.json(reports);
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Revenue by payment method
exports.getRevenueByPaymentMethod = async (req, res) => {
  try {
    const [data] = await db.query(
      `SELECT payment_method, COUNT(*) as transaction_count, SUM(amount) as total_amount
      FROM payments
      WHERE status = 'completed'
      GROUP BY payment_method`
    );
    res.json(data);
  } catch (error) {
    console.error('Get revenue by payment method error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Revenue monthly chart data
exports.getMonthlyRevenue = async (req, res) => {
  try {
    const [data] = await db.query(
      `SELECT DATE_FORMAT(payment_date, '%Y-%m') as month, SUM(amount) as revenue, COUNT(*) as transactions
      FROM payments
      WHERE status = 'completed'
      AND payment_date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(payment_date, '%Y-%m')
      ORDER BY month ASC`
    );
    res.json(data);
  } catch (error) {
    console.error('Get monthly revenue error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Real-time Event Metrics
exports.getRealTimeMetrics = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Current attendees (checked in)
    const [currentAttendees] = await db.query(`
      SELECT COUNT(*) as count
      FROM attendee_profiles 
      WHERE event_id = ? AND attendance_status = 'checked_in'
    `, [eventId]);

    // Active virtual participants
    const [virtualParticipants] = await db.query(`
      SELECT COUNT(DISTINCT va.user_id) as count
      FROM virtual_rooms vr
      JOIN virtual_attendance va ON vr.id = va.room_id
      WHERE vr.event_id = ? AND va.left_at IS NULL
    `, [eventId]);

    // Recent activity (last hour)
    const [recentActivity] = await db.query(`
      SELECT 
        activity_type,
        COUNT(*) as count
      FROM user_activity_logs 
      WHERE event_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
      GROUP BY activity_type
      ORDER BY count DESC
    `, [eventId]);

    // Active polls
    const [activePolls] = await db.query(`
      SELECT COUNT(*) as count
      FROM event_polls 
      WHERE event_id = ? AND is_active = TRUE 
      AND (start_time IS NULL OR start_time <= NOW())
      AND (end_time IS NULL OR end_time >= NOW())
    `, [eventId]);

    res.json({
      current_attendees: currentAttendees[0].count,
      virtual_participants: virtualParticipants[0].count,
      recent_activity: recentActivity,
      active_polls: activePolls[0].count,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Get real-time metrics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// User Activity Tracking
exports.logUserActivity = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { activity_type, activity_data } = req.body;
    const userId = req.user.id;

    await db.query(
      'INSERT INTO user_activity_logs (user_id, event_id, activity_type, activity_data) VALUES (?, ?, ?, ?)',
      [userId, eventId, activity_type, JSON.stringify(activity_data)]
    );

    res.json({ message: 'Activity logged successfully' });
  } catch (error) {
    console.error('Log user activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Export Analytics Data
exports.exportAnalyticsData = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { format = 'json' } = req.query;
    
    // Get comprehensive analytics data
    const [eventInfo] = await db.query('SELECT * FROM events WHERE id = ?', [eventId]);
    
    const [attendees] = await db.query(`
      SELECT 
        ap.*,
        u.name,
        u.email,
        u.company,
        u.job_title
      FROM attendee_profiles ap
      JOIN users u ON ap.user_id = u.id
      WHERE ap.event_id = ?
    `, [eventId]);

    const [sessionAttendance] = await db.query(`
      SELECT 
        es.session_title,
        sa.feedback_rating,
        sa.feedback_comment,
        u.name as attendee_name
      FROM session_attendance sa
      JOIN event_schedules es ON sa.schedule_id = es.id
      JOIN users u ON sa.user_id = u.id
      WHERE es.event_id = ?
    `, [eventId]);

    const [feedback] = await db.query(`
      SELECT 
        ef.*,
        u.name as user_name
      FROM event_feedback ef
      JOIN users u ON ef.user_id = u.id
      WHERE ef.event_id = ?
    `, [eventId]);

    const analyticsData = {
      event: eventInfo[0],
      attendees: attendees,
      session_attendance: sessionAttendance,
      feedback: feedback,
      exported_at: new Date()
    };

    if (format === 'csv') {
      // Convert to CSV format (simplified)
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="event-${eventId}-analytics.csv"`);
      
      // Basic CSV export (you might want to use a proper CSV library)
      let csv = 'Type,Name,Email,Status,Rating,Comments\n';
      attendees.forEach(attendee => {
        csv += `Attendee,"${attendee.name}","${attendee.email}","${attendee.attendance_status}",,\n`;
      });
      
      res.send(csv);
    } else {
      res.json(analyticsData);
    }
  } catch (error) {
    console.error('Export analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Custom Reports
exports.generateCustomReport = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { metrics, filters, groupBy } = req.body;
    
    // This is a simplified version - in a real implementation,
    // you'd build dynamic queries based on the requested metrics and filters
    
    let query = 'SELECT ';
    let joins = '';
    let where = `WHERE e.id = ${eventId}`;
    
    // Build dynamic query based on requested metrics
    if (metrics.includes('registrations')) {
      query += 'COUNT(DISTINCT ap.id) as total_registrations, ';
      joins += 'LEFT JOIN attendee_profiles ap ON e.id = ap.event_id ';
    }
    
    if (metrics.includes('revenue')) {
      query += 'SUM(b.total_amount) as total_revenue, ';
      joins += 'LEFT JOIN bookings b ON e.id = b.event_id ';
    }
    
    // Remove trailing comma
    query = query.slice(0, -2);
    
    query += ` FROM events e ${joins} ${where}`;
    
    if (groupBy) {
      query += ` GROUP BY ${groupBy}`;
    }
    
    const [results] = await db.query(query);
    
    res.json({
      report_name: 'Custom Report',
      generated_at: new Date(),
      filters: filters,
      data: results
    });
  } catch (error) {
    console.error('Generate custom report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Store Analytics Metrics (for historical tracking)
exports.storeMetric = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { metric_name, metric_value, additional_data } = req.body;
    
    await db.query(
      'INSERT INTO event_analytics (event_id, metric_name, metric_value, metric_date, additional_data) VALUES (?, ?, ?, CURDATE(), ?)',
      [eventId, metric_name, metric_value, JSON.stringify(additional_data)]
    );

    res.json({ message: 'Metric stored successfully' });
  } catch (error) {
    console.error('Store metric error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};