const db = require('../config/db');

// Create or update feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { event_id, rating, comment } = req.body;
    const user_id = req.user.id;

    if (!event_id || rating === undefined || (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: 'Event ID and rating (1-5) are required' });
    }

    // Check if feedback already exists
    const [existing] = await db.query(
      'SELECT id FROM feedback WHERE event_id = ? AND user_id = ?',
      [event_id, user_id]
    );

    if (existing.length > 0) {
      // Update existing feedback
      await db.query(
        'UPDATE feedback SET rating = ?, comment = ?, updated_at = NOW() WHERE event_id = ? AND user_id = ?',
        [rating, comment || null, event_id, user_id]
      );
      return res.json({ message: 'Feedback updated successfully' });
    }

    // Create new feedback
    const [result] = await db.query(
      `INSERT INTO feedback (event_id, user_id, rating, comment)
       VALUES (?, ?, ?, ?)`,
      [event_id, user_id, rating, comment || null]
    );

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedbackId: result.insertId
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get feedback for event
exports.getEventFeedback = async (req, res) => {
  try {
    const event_id = req.params.event_id;

    const [feedbacks] = await db.query(
      `SELECT f.*, u.name as user_name FROM feedback f
       JOIN users u ON f.user_id = u.id
       WHERE f.event_id = ?
       ORDER BY f.created_at DESC`,
      [event_id]
    );

    res.json(feedbacks);
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get event rating summary
exports.getEventRating = async (req, res) => {
  try {
    const event_id = req.params.event_id;

    const [ratings] = await db.query(
      `SELECT 
        COUNT(*) as total_ratings,
        AVG(rating) as average_rating,
        SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
        SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
        SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
        SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
        SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
      FROM feedback
      WHERE event_id = ?`,
      [event_id]
    );

    res.json({
      event_id,
      ...ratings[0],
      average_rating: Math.round(ratings[0].average_rating * 10) / 10
    });
  } catch (error) {
    console.error('Get rating error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user feedback
exports.getUserFeedback = async (req, res) => {
  try {
    const user_id = req.user.id;

    const [feedbacks] = await db.query(
      `SELECT f.*, e.title as event_title FROM feedback f
       JOIN events e ON f.event_id = e.id
       WHERE f.user_id = ?
       ORDER BY f.created_at DESC`,
      [user_id]
    );

    res.json(feedbacks);
  } catch (error) {
    console.error('Get user feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Organizer can view all feedback for their events
exports.getOrganizerFeedback = async (req, res) => {
  try {
    const organizer_id = req.user.id;

    const [feedbacks] = await db.query(
      `SELECT f.*, e.title as event_title, u.name as user_name FROM feedback f
       JOIN events e ON f.event_id = e.id
       JOIN users u ON f.user_id = u.id
       WHERE e.organizer_id = ?
       ORDER BY f.created_at DESC`,
      [organizer_id]
    );

    res.json(feedbacks);
  } catch (error) {
    console.error('Get organizer feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get organizer's event ratings summary
exports.getOrganizerRatings = async (req, res) => {
  try {
    const organizer_id = req.user.id;

    const [ratings] = await db.query(
      `SELECT e.id, e.title,
        COUNT(f.id) as total_ratings,
        AVG(f.rating) as average_rating
      FROM events e
      LEFT JOIN feedback f ON e.id = f.event_id
      WHERE e.organizer_id = ?
      GROUP BY e.id, e.title
      ORDER BY average_rating DESC`,
      [organizer_id]
    );

    res.json(ratings);
  } catch (error) {
    console.error('Get organizer ratings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
