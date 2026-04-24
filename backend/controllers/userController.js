const bcrypt = require('bcrypt');
const db = require('../config/db');

// Get all users (Admin only) with optional filters
exports.getAllUsers = async (req, res) => {
  try {
    const { search, role } = req.query;
    let query = 'SELECT id, name, email, role, phone, created_at FROM users WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (role && role !== 'all') {
      query += ' AND role = ?';
      params.push(role);
    }

    query += ' ORDER BY id ASC, created_at DESC';

    const [users] = await db.query(query, params);
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, name, email, role, phone, created_at FROM users WHERE id = ?',
      [req.params.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create user (Admin only)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Check if user exists
    const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, role || 'user', phone]
    );

    res.status(201).json({ 
      message: 'User created successfully',
      userId: result.insertId 
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user (Admin only)
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, phone } = req.body;
    const userId = req.params.id;

    // Check if user exists
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    await db.query(
      'UPDATE users SET name = ?, email = ?, role = ?, phone = ? WHERE id = ?',
      [name, email, role, phone, userId]
    );

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user (Admin only)
exports.deleteUser = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const userId = req.params.id;

    // Check if user exists
    const [users] = await connection.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];

    // Prevent deleting yourself
    if (req.user.id === parseInt(userId)) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    // Start transaction
    await connection.beginTransaction();

    try {
      // Delete related records in order (respecting foreign keys)
      console.log(`Starting cascading delete for user ${userId}...`);
      
      // 1. Delete chat messages (both sent and received)
      await connection.query('DELETE FROM chat_messages WHERE user_id = ? OR recipient_id = ?', [userId, userId]);
      
      // 2. Delete virtual attendance
      await connection.query('DELETE FROM virtual_attendance WHERE user_id = ?', [userId]);
      
      // 3. Delete poll responses
      await connection.query('DELETE FROM poll_responses WHERE user_id = ?', [userId]);
      
      // 4. Delete event feedback
      await connection.query('DELETE FROM event_feedback WHERE user_id = ?', [userId]);
      
      // 5. Delete session attendance
      await connection.query('DELETE FROM session_attendance WHERE user_id = ?', [userId]);
      
      // 6. Delete attendee profiles
      await connection.query('DELETE FROM attendee_profiles WHERE user_id = ?', [userId]);
      
      // 7. Delete networking matches
      await connection.query('DELETE FROM networking_matches WHERE user1_id = ? OR user2_id = ?', [userId, userId]);
      
      // 8. Delete email tracking
      await connection.query('DELETE FROM email_tracking WHERE user_id = ?', [userId]);
      
      // 9. Delete user activity logs
      await connection.query('DELETE FROM user_activity_logs WHERE user_id = ?', [userId]);
      
      // 10. Delete certificates
      await connection.query('DELETE FROM certificates WHERE user_id = ?', [userId]);
      
      // 11. Delete feedback (old table)
      await connection.query('DELETE FROM feedback WHERE user_id = ?', [userId]);
      
      // 12. Delete notifications
      await connection.query('DELETE FROM notifications WHERE user_id = ?', [userId]);
      
      // 13. Delete tickets for user's bookings
      await connection.query('DELETE FROM tickets WHERE booking_id IN (SELECT id FROM bookings WHERE user_id = ?)', [userId]);
      
      // 14. Delete bookings
      await connection.query('DELETE FROM bookings WHERE user_id = ?', [userId]);
      
      // 15. Delete payments
      await connection.query('DELETE FROM payments WHERE user_id = ?', [userId]);
      
      // 16. Update event tasks assigned to this user (set to NULL instead of delete)
      await connection.query('UPDATE event_tasks SET assigned_to = NULL WHERE assigned_to = ?', [userId]);
      
      // 17. Update event schedules with this speaker (set to NULL)
      await connection.query('UPDATE event_schedules SET speaker_id = NULL WHERE speaker_id = ?', [userId]);
      
      // 18. Delete speaker profile if exists
      await connection.query('DELETE FROM speakers WHERE user_id = ?', [userId]);
      
      // 19. If user is organizer, handle their events
      if (user.role === 'organizer') {
        console.log(`User is organizer, deleting their events...`);
        // Get organizer's events
        const [events] = await connection.query('SELECT id FROM events WHERE organizer_id = ?', [userId]);
        console.log(`Found ${events.length} events to delete`);
        
        for (const event of events) {
          // Delete all event-related data
          await connection.query('DELETE FROM chat_messages WHERE room_id IN (SELECT id FROM virtual_rooms WHERE event_id = ?)', [event.id]);
          await connection.query('DELETE FROM virtual_attendance WHERE room_id IN (SELECT id FROM virtual_rooms WHERE event_id = ?)', [event.id]);
          await connection.query('DELETE FROM virtual_rooms WHERE event_id = ?', [event.id]);
          await connection.query('DELETE FROM poll_responses WHERE poll_id IN (SELECT id FROM event_polls WHERE event_id = ?)', [event.id]);
          await connection.query('DELETE FROM event_polls WHERE event_id = ?', [event.id]);
          await connection.query('DELETE FROM event_feedback WHERE event_id = ?', [event.id]);
          await connection.query('DELETE FROM session_attendance WHERE schedule_id IN (SELECT id FROM event_schedules WHERE event_id = ?)', [event.id]);
          await connection.query('DELETE FROM presentations WHERE schedule_id IN (SELECT id FROM event_schedules WHERE event_id = ?)', [event.id]);
          await connection.query('DELETE FROM event_schedules WHERE event_id = ?', [event.id]);
          await connection.query('DELETE FROM attendee_profiles WHERE event_id = ?', [event.id]);
          await connection.query('DELETE FROM networking_matches WHERE event_id = ?', [event.id]);
          await connection.query('DELETE FROM networking_sessions WHERE event_id = ?', [event.id]);
          await connection.query('DELETE FROM email_tracking WHERE campaign_id IN (SELECT id FROM email_campaigns WHERE event_id = ?)', [event.id]);
          await connection.query('DELETE FROM email_campaigns WHERE event_id = ?', [event.id]);
          await connection.query('DELETE FROM social_media_posts WHERE event_id = ?', [event.id]);
          await connection.query('DELETE FROM event_analytics WHERE event_id = ?', [event.id]);
          await connection.query('DELETE FROM user_activity_logs WHERE event_id = ?', [event.id]);
          await connection.query('DELETE FROM event_resources WHERE event_id = ?', [event.id]);
          await connection.query('DELETE FROM event_tasks WHERE event_id = ?', [event.id]);
          await connection.query('DELETE FROM registration_forms WHERE event_id = ?', [event.id]);
          await connection.query('DELETE FROM certificates WHERE event_id = ?', [event.id]);
          await connection.query('DELETE FROM feedback WHERE event_id = ?', [event.id]);
          await connection.query('DELETE FROM tickets WHERE booking_id IN (SELECT id FROM bookings WHERE event_id = ?)', [event.id]);
          await connection.query('DELETE FROM bookings WHERE event_id = ?', [event.id]);
        }
        
        // Delete events
        await connection.query('DELETE FROM events WHERE organizer_id = ?', [userId]);
      }
      
      // 20. Delete event templates created by user
      await connection.query('DELETE FROM event_templates WHERE created_by = ?', [userId]);
      
      // 21. Finally, delete the user
      await connection.query('DELETE FROM users WHERE id = ?', [userId]);
      
      console.log(`Successfully deleted user ${userId} and all related data`);

      await connection.commit();
      
      res.json({ 
        message: 'User and all related data deleted successfully',
        deletedUser: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
      
    } catch (error) {
      await connection.rollback();
      throw error;
    }
    
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ 
      message: 'Failed to delete user',
      error: error.message 
    });
  } finally {
    connection.release();
  }
};

// Export users to CSV (Admin only)
exports.exportUsersCSV = async (req, res) => {
  try {
    const { search, role } = req.query;
    let query = 'SELECT id, name, email, role, phone, created_at FROM users WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (role && role !== 'all') {
      query += ' AND role = ?';
      params.push(role);
    }

    query += ' ORDER BY created_at DESC';
    const [users] = await db.query(query, params);

    const header = 'ID,Name,Email,Role,Phone,CreatedAt\n';
    const rows = users
      .map(u => [u.id, u.name, u.email, u.role, u.phone || '', u.created_at]
        .map(v => `"${v}"`).join(','))
      .join('\n');

    res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
    res.setHeader('Content-Type', 'text/csv');
    res.send(header + rows);
  } catch (error) {
    console.error('Export users csv error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
