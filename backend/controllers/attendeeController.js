const db = require('../config/db');

// Registration Forms Management
exports.getRegistrationForm = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const [forms] = await db.query(
      'SELECT * FROM registration_forms WHERE event_id = ? AND is_active = TRUE',
      [eventId]
    );

    if (forms.length === 0) {
      return res.status(404).json({ message: 'Registration form not found' });
    }

    res.json(forms[0]);
  } catch (error) {
    console.error('Get registration form error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createRegistrationForm = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { form_fields } = req.body;

    // Deactivate existing forms
    await db.query('UPDATE registration_forms SET is_active = FALSE WHERE event_id = ?', [eventId]);

    const [result] = await db.query(
      'INSERT INTO registration_forms (event_id, form_fields) VALUES (?, ?)',
      [eventId, JSON.stringify(form_fields)]
    );

    res.status(201).json({ 
      message: 'Registration form created successfully',
      formId: result.insertId 
    });
  } catch (error) {
    console.error('Create registration form error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Attendee Profiles Management
exports.getEventAttendees = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const [attendees] = await db.query(`
      SELECT ap.*, u.name, u.email, u.phone, u.company, u.job_title
      FROM attendee_profiles ap
      JOIN users u ON ap.user_id = u.id
      WHERE ap.event_id = ?
      ORDER BY ap.created_at DESC
    `, [eventId]);

    res.json(attendees);
  } catch (error) {
    console.error('Get attendees error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.registerAttendee = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { registration_data, dietary_requirements, accessibility_needs, networking_preferences } = req.body;
    const userId = req.user.id;

    // Check if already registered
    const [existing] = await db.query(
      'SELECT id FROM attendee_profiles WHERE user_id = ? AND event_id = ?',
      [userId, eventId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    const [result] = await db.query(
      'INSERT INTO attendee_profiles (user_id, event_id, registration_data, dietary_requirements, accessibility_needs, networking_preferences) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, eventId, JSON.stringify(registration_data), dietary_requirements, accessibility_needs, JSON.stringify(networking_preferences)]
    );

    res.status(201).json({ 
      message: 'Registration successful',
      attendeeId: result.insertId 
    });
  } catch (error) {
    console.error('Register attendee error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.checkInAttendee = async (req, res) => {
  try {
    const { attendeeId } = req.params;

    await db.query(
      'UPDATE attendee_profiles SET attendance_status = "checked_in", check_in_time = NOW() WHERE id = ?',
      [attendeeId]
    );

    res.json({ message: 'Attendee checked in successfully' });
  } catch (error) {
    console.error('Check in attendee error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateAttendeeProfile = async (req, res) => {
  try {
    const { attendeeId } = req.params;
    const { registration_data, dietary_requirements, accessibility_needs, networking_preferences } = req.body;

    await db.query(
      'UPDATE attendee_profiles SET registration_data = ?, dietary_requirements = ?, accessibility_needs = ?, networking_preferences = ? WHERE id = ?',
      [JSON.stringify(registration_data), dietary_requirements, accessibility_needs, JSON.stringify(networking_preferences), attendeeId]
    );

    res.json({ message: 'Attendee profile updated successfully' });
  } catch (error) {
    console.error('Update attendee profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Session Attendance Management
exports.recordSessionAttendance = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const userId = req.user.id;

    // Check if already recorded
    const [existing] = await db.query(
      'SELECT id FROM session_attendance WHERE schedule_id = ? AND user_id = ?',
      [scheduleId, userId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Attendance already recorded' });
    }

    const [result] = await db.query(
      'INSERT INTO session_attendance (schedule_id, user_id) VALUES (?, ?)',
      [scheduleId, userId]
    );

    res.status(201).json({ 
      message: 'Attendance recorded successfully',
      attendanceId: result.insertId 
    });
  } catch (error) {
    console.error('Record attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.submitSessionFeedback = async (req, res) => {
  try {
    const { attendanceId } = req.params;
    const { feedback_rating, feedback_comment } = req.body;

    await db.query(
      'UPDATE session_attendance SET feedback_rating = ?, feedback_comment = ? WHERE id = ?',
      [feedback_rating, feedback_comment, attendanceId]
    );

    res.json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Attendee Analytics
exports.getAttendeeStats = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total_registered,
        SUM(CASE WHEN attendance_status = 'checked_in' THEN 1 ELSE 0 END) as checked_in,
        SUM(CASE WHEN attendance_status = 'attended' THEN 1 ELSE 0 END) as attended,
        SUM(CASE WHEN attendance_status = 'no_show' THEN 1 ELSE 0 END) as no_shows
      FROM attendee_profiles 
      WHERE event_id = ?
    `, [eventId]);

    const [sessionStats] = await db.query(`
      SELECT 
        es.session_title,
        COUNT(sa.id) as attendance_count,
        AVG(sa.feedback_rating) as avg_rating
      FROM event_schedules es
      LEFT JOIN session_attendance sa ON es.id = sa.schedule_id
      WHERE es.event_id = ?
      GROUP BY es.id, es.session_title
      ORDER BY attendance_count DESC
    `, [eventId]);

    res.json({
      overall: stats[0],
      sessions: sessionStats
    });
  } catch (error) {
    console.error('Get attendee stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};