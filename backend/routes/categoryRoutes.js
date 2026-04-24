const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Public routes
router.get('/', categoryController.getAllCategories);

// Protected routes (Admin only) - MUST come before /:id to avoid route collision
router.get('/export', auth, roleCheck('admin'), categoryController.exportCategoriesCSV);
router.post('/', auth, roleCheck('admin'), categoryController.createCategory);

// Dynamic routes - MUST come last
router.get('/:id', categoryController.getCategoryById);
router.put('/:id', auth, roleCheck('admin'), categoryController.updateCategory);
router.delete('/:id', auth, roleCheck('admin'), categoryController.deleteCategory);

module.exports = router;