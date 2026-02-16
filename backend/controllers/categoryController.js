const db = require('../config/db');

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories ORDER BY name');
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories WHERE id = ?', [req.params.id]);

    if (categories.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(categories[0]);
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create category (Admin only)
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const [result] = await db.query(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [name, description]
    );

    res.status(201).json({ 
      message: 'Category created successfully',
      categoryId: result.insertId 
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update category (Admin only)
exports.updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const categoryId = req.params.id;

    const [categories] = await db.query('SELECT * FROM categories WHERE id = ?', [categoryId]);
    if (categories.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await db.query(
      'UPDATE categories SET name = ?, description = ? WHERE id = ?',
      [name, description, categoryId]
    );

    res.json({ message: 'Category updated successfully' });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete category (Admin only)
exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const [categories] = await db.query('SELECT * FROM categories WHERE id = ?', [categoryId]);
    if (categories.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await db.query('DELETE FROM categories WHERE id = ?', [categoryId]);

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
