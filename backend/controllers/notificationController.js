const db = require('../config/db');
const nodemailer = require('nodemailer');

// setup transporter if SMTP configured
let transporter;
if (process.env.SMTP_HOST) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}


// Send notification to user
exports.sendNotification = async (req, res) => {
  try {
    const { user_id, event_id, type, subject, message } = req.body;

    if (!user_id || !subject || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const [result] = await db.query(
      `INSERT INTO notifications (user_id, event_id, type, subject, message)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, event_id || null, type || 'email', subject, message]
    );

    // attempt to send email or sms if configured
    if (type === 'email' && transporter) {
      // fetch user email
      const [users] = await db.query('SELECT email FROM users WHERE id = ?', [user_id]);
      if (users.length > 0) {
        const email = users[0].email;
        transporter.sendMail({
          from: process.env.SMTP_FROM || 'no-reply@example.com',
          to: email,
          subject,
          text: message,
        }).catch(err => console.error('Email send error', err));
      }
    }
    if (type === 'sms') {
      // placeholder: integrate Twilio or other service
      console.log(`SMS would be sent to user ${user_id}: ${message}`);
    }

    res.status(201).json({
      message: 'Notification created successfully',
      notificationId: result.insertId
    });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user notifications
exports.getUserNotifications = async (req, res) => {
  try {
    const [notifications] = await db.query(
      `SELECT n.*, e.title as event_title FROM notifications n
       LEFT JOIN events e ON n.event_id = e.id
       WHERE n.user_id = ?
       ORDER BY n.created_at DESC`,
      [req.user.id]
    );
    res.json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;

    await db.query('UPDATE notifications SET is_read = TRUE WHERE id = ?', [notificationId]);

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create announcement (Admin only)
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, content, expires_at } = req.body;
    const admin_id = req.user.id;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const [result] = await db.query(
      `INSERT INTO announcements (admin_id, title, content, expires_at)
       VALUES (?, ?, ?, ?)`,
      [admin_id, title, content, expires_at || null]
    );

    res.status(201).json({
      message: 'Announcement created successfully',
      announcementId: result.insertId
    });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get active announcements
exports.getAnnouncements = async (req, res) => {
  try {
    const [announcements] = await db.query(
      `SELECT a.*, u.name as admin_name FROM announcements a
       JOIN users u ON a.admin_id = u.id
       WHERE a.is_active = TRUE AND (a.expires_at IS NULL OR a.expires_at > NOW())
       ORDER BY a.created_at DESC`
    );
    res.json(announcements);
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Broadcast announcement to all users
exports.broadcastAnnouncement = async (req, res) => {
  try {
    const announcementId = req.params.id;

    // Get announcement
    const [announcements] = await db.query(
      'SELECT * FROM announcements WHERE id = ?',
      [announcementId]
    );

    if (announcements.length === 0) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    const announcement = announcements[0];

    // Get all users
    const [users] = await db.query('SELECT id FROM users WHERE role IN ("user", "organizer")');

    // Send notification to each user
    for (const user of users) {
      await db.query(
        `INSERT INTO notifications (user_id, type, subject, message)
         VALUES (?, ?, ?, ?)`,
        [user.id, 'email', announcement.title, announcement.content]
      );
    }

    res.json({ message: `Announcement broadcasted to ${users.length} users` });
  } catch (error) {
    console.error('Broadcast announcement error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete announcement
exports.deleteAnnouncement = async (req, res) => {
  try {
    const announcementId = req.params.id;

    await db.query('UPDATE announcements SET is_active = FALSE WHERE id = ?', [announcementId]);

    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
