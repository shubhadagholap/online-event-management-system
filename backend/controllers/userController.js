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

    query += ' ORDER BY created_at DESC';

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
  try {
    const userId = req.params.id;

    // Check if user exists
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    await db.query('DELETE FROM users WHERE id = ?', [userId]);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
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
