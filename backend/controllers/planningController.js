const db = require('../config/db');

// Event Templates Management
exports.getEventTemplates = async (req, res) => {
  try {
    const [templates] = await db.query(`
      SELECT et.*, c.name as category_name, u.name as creator_name
      FROM event_templates et
      LEFT JOIN categories c ON et.category_id = c.id
      LEFT JOIN users u ON et.created_by = u.id
      ORDER BY et.created_at DESC
    `);
    res.json(templates);
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createEventTemplate = async (req, res) => {
  try {
    const { name, description, category_id, default_capacity, default_duration, template_data } = req.body;
    
    const [result] = await db.query(
      'INSERT INTO event_templates (name, description, category_id, default_capacity, default_duration, template_data, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, description, category_id, default_capacity, default_duration, JSON.stringify(template_data), req.user.id]
    );

    res.status(201).json({ 
      message: 'Template created successfully',
      templateId: result.insertId 
    });
  } catch (error) {
    console.error('Create template error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Event Schedules Management
exports.getEventSchedule = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const [schedules] = await db.query(`
      SELECT es.*, s.name as speaker_name, s.title as speaker_title, s.company as speaker_company
      FROM event_schedules es
      LEFT JOIN speakers s ON es.speaker_id = s.id
      WHERE es.event_id = ?
      ORDER BY es.start_time ASC
    `, [eventId]);

    res.json(schedules);
  } catch (error) {
    console.error('Get schedule error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createScheduleSession = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { session_title, description, start_time, end_time, location, speaker_id, session_type, max_attendees } = req.body;

    const [result] = await db.query(
      'INSERT INTO event_schedules (event_id, session_title, description, start_time, end_time, location, speaker_id, session_type, max_attendees) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [eventId, session_title, description, start_time, end_time, location, speaker_id, session_type, max_attendees]
    );

    res.status(201).json({ 
      message: 'Session created successfully',
      sessionId: result.insertId 
    });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateScheduleSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { session_title, description, start_time, end_time, location, speaker_id, session_type, max_attendees } = req.body;

    await db.query(
      'UPDATE event_schedules SET session_title = ?, description = ?, start_time = ?, end_time = ?, location = ?, speaker_id = ?, session_type = ?, max_attendees = ? WHERE id = ?',
      [session_title, description, start_time, end_time, location, speaker_id, session_type, max_attendees, sessionId]
    );

    res.json({ message: 'Session updated successfully' });
  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteScheduleSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    await db.query('DELETE FROM event_schedules WHERE id = ?', [sessionId]);

    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Event Tasks Management
exports.getEventTasks = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const [tasks] = await db.query(`
      SELECT et.*, u.name as assigned_to_name, u.email as assigned_to_email
      FROM event_tasks et
      LEFT JOIN users u ON et.assigned_to = u.id
      WHERE et.event_id = ?
      ORDER BY et.due_date ASC, et.priority DESC
    `, [eventId]);

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createEventTask = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { task_title, description, assigned_to, priority, due_date } = req.body;

    const [result] = await db.query(
      'INSERT INTO event_tasks (event_id, task_title, description, assigned_to, priority, due_date) VALUES (?, ?, ?, ?, ?, ?)',
      [eventId, task_title, description, assigned_to, priority, due_date]
    );

    res.status(201).json({ 
      message: 'Task created successfully',
      taskId: result.insertId 
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const completed_at = status === 'completed' ? new Date() : null;

    await db.query(
      'UPDATE event_tasks SET status = ?, completed_at = ? WHERE id = ?',
      [status, completed_at, taskId]
    );

    res.json({ message: 'Task status updated successfully' });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Event Resources Management
exports.getEventResources = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const [resources] = await db.query(
      'SELECT * FROM event_resources WHERE event_id = ? ORDER BY resource_type, resource_name',
      [eventId]
    );

    res.json(resources);
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createEventResource = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { resource_name, resource_type, description, quantity, cost, supplier_info, notes } = req.body;

    const [result] = await db.query(
      'INSERT INTO event_resources (event_id, resource_name, resource_type, description, quantity, cost, supplier_info, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [eventId, resource_name, resource_type, description, quantity, cost, JSON.stringify(supplier_info), notes]
    );

    res.status(201).json({ 
      message: 'Resource created successfully',
      resourceId: result.insertId 
    });
  } catch (error) {
    console.error('Create resource error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateResourceStatus = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const { booking_status, notes } = req.body;

    await db.query(
      'UPDATE event_resources SET booking_status = ?, notes = ? WHERE id = ?',
      [booking_status, notes, resourceId]
    );

    res.json({ message: 'Resource status updated successfully' });
  } catch (error) {
    console.error('Update resource error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};