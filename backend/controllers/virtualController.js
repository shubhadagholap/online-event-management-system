const db = require('../config/db');

// Virtual Rooms Management
exports.getVirtualRooms = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const [rooms] = await db.query(
      'SELECT * FROM virtual_rooms WHERE event_id = ? ORDER BY room_type, room_name',
      [eventId]
    );

    res.json(rooms);
  } catch (error) {
    console.error('Get virtual rooms error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createVirtualRoom = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { room_name, room_type, platform, room_url, access_code, max_participants } = req.body;

    const [result] = await db.query(
      'INSERT INTO virtual_rooms (event_id, room_name, room_type, platform, room_url, access_code, max_participants) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [eventId, room_name, room_type, platform, room_url, access_code, max_participants]
    );

    res.status(201).json({ 
      message: 'Virtual room created successfully',
      roomId: result.insertId 
    });
  } catch (error) {
    console.error('Create virtual room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.joinVirtualRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;

    // Record attendance
    const [result] = await db.query(
      'INSERT INTO virtual_attendance (room_id, user_id) VALUES (?, ?)',
      [roomId, userId]
    );

    // Get room details
    const [room] = await db.query('SELECT * FROM virtual_rooms WHERE id = ?', [roomId]);

    res.json({ 
      message: 'Joined room successfully',
      attendanceId: result.insertId,
      room: room[0]
    });
  } catch (error) {
    console.error('Join virtual room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.leaveVirtualRoom = async (req, res) => {
  try {
    const { attendanceId } = req.params;

    await db.query(
      'UPDATE virtual_attendance SET left_at = NOW(), duration_minutes = TIMESTAMPDIFF(MINUTE, joined_at, NOW()) WHERE id = ?',
      [attendanceId]
    );

    res.json({ message: 'Left room successfully' });
  } catch (error) {
    console.error('Leave virtual room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Chat Management
exports.getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    
    const [messages] = await db.query(`
      SELECT cm.*, u.name as user_name, u.profile_image
      FROM chat_messages cm
      JOIN users u ON cm.user_id = u.id
      WHERE cm.room_id = ? AND cm.is_private = FALSE
      ORDER BY cm.sent_at DESC
      LIMIT ? OFFSET ?
    `, [roomId, parseInt(limit), parseInt(offset)]);

    res.json(messages.reverse()); // Return in chronological order
  } catch (error) {
    console.error('Get room messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.sendChatMessage = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { message, message_type = 'text', is_private = false, recipient_id } = req.body;
    const userId = req.user.id;

    const [result] = await db.query(
      'INSERT INTO chat_messages (room_id, user_id, message, message_type, is_private, recipient_id) VALUES (?, ?, ?, ?, ?, ?)',
      [roomId, userId, message, message_type, is_private, recipient_id]
    );

    // Get the created message with user info
    const [newMessage] = await db.query(`
      SELECT cm.*, u.name as user_name, u.profile_image
      FROM chat_messages cm
      JOIN users u ON cm.user_id = u.id
      WHERE cm.id = ?
    `, [result.insertId]);

    res.status(201).json({ 
      message: 'Message sent successfully',
      chatMessage: newMessage[0]
    });
  } catch (error) {
    console.error('Send chat message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Virtual Attendance Analytics
exports.getVirtualAttendanceStats = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const [roomStats] = await db.query(`
      SELECT 
        vr.room_name,
        vr.room_type,
        COUNT(va.id) as total_joins,
        COUNT(DISTINCT va.user_id) as unique_attendees,
        AVG(va.duration_minutes) as avg_duration,
        MAX(va.duration_minutes) as max_duration
      FROM virtual_rooms vr
      LEFT JOIN virtual_attendance va ON vr.id = va.room_id
      WHERE vr.event_id = ?
      GROUP BY vr.id, vr.room_name, vr.room_type
      ORDER BY total_joins DESC
    `, [eventId]);

    const [overallStats] = await db.query(`
      SELECT 
        COUNT(DISTINCT va.user_id) as total_virtual_attendees,
        AVG(va.duration_minutes) as avg_session_duration,
        SUM(va.duration_minutes) as total_engagement_minutes
      FROM virtual_rooms vr
      JOIN virtual_attendance va ON vr.id = va.room_id
      WHERE vr.event_id = ?
    `, [eventId]);

    res.json({
      overall: overallStats[0],
      rooms: roomStats
    });
  } catch (error) {
    console.error('Get virtual attendance stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Screen Sharing and Presentation Controls
exports.updateRoomSettings = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { is_active, room_url, access_code } = req.body;

    await db.query(
      'UPDATE virtual_rooms SET is_active = ?, room_url = ?, access_code = ? WHERE id = ?',
      [is_active, room_url, access_code, roomId]
    );

    res.json({ message: 'Room settings updated successfully' });
  } catch (error) {
    console.error('Update room settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRoomParticipants = async (req, res) => {
  try {
    const { roomId } = req.params;
    
    const [participants] = await db.query(`
      SELECT 
        va.id as attendance_id,
        va.joined_at,
        va.left_at,
        va.duration_minutes,
        u.name,
        u.email,
        u.profile_image,
        u.company,
        u.job_title
      FROM virtual_attendance va
      JOIN users u ON va.user_id = u.id
      WHERE va.room_id = ? AND va.left_at IS NULL
      ORDER BY va.joined_at ASC
    `, [roomId]);

    res.json(participants);
  } catch (error) {
    console.error('Get room participants error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};