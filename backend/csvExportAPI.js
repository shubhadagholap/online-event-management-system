// Additional CSV export endpoints for enhanced functionality
const express = require('express');
const router = express.Router();
const db = require('./config/db');
const auth = require('./middleware/auth');
const roleCheck = require('./middleware/roleCheck');

// All routes require admin authentication
router.use(auth);
router.use(roleCheck('admin'));

// Get available export endpoints
router.get('/endpoints', (req, res) => {
  const endpoints = [
    {
      name: 'users',
      description: 'Export all users data',
      url: '/api/users/export',
      filters: ['search', 'role']
    },
    {
      name: 'events',
      description: 'Export all events data',
      url: '/api/events/export',
      filters: ['category', 'search', 'status']
    },
    {
      name: 'bookings',
      description: 'Export all bookings data',
      url: '/api/bookings/export',
      filters: ['search', 'status', 'payment']
    },
    {
      name: 'categories',
      description: 'Export all categories data',
      url: '/api/categories/export',
      filters: ['search']
    },
    {
      name: 'payments',
      description: 'Export all payments data',
      url: '/api/payments/export',
      filters: ['search', 'status', 'from_date', 'to_date']
    }
  ];
  
  res.json(endpoints);
});

// Export statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = {};
    
    // Get record counts for each exportable entity
    const [userCount] = await db.query('SELECT COUNT(*) as count FROM users');
    const [eventCount] = await db.query('SELECT COUNT(*) as count FROM events');
    const [bookingCount] = await db.query('SELECT COUNT(*) as count FROM bookings');
    const [categoryCount] = await db.query('SELECT COUNT(*) as count FROM categories');
    const [paymentCount] = await db.query('SELECT COUNT(*) as count FROM payments');
    
    stats.users = userCount[0].count;
    stats.events = eventCount[0].count;
    stats.bookings = bookingCount[0].count;
    stats.categories = categoryCount[0].count;
    stats.payments = paymentCount[0].count;
    stats.total = stats.users + stats.events + stats.bookings + stats.categories + stats.payments;
    
    res.json(stats);
  } catch (error) {
    console.error('Get export stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Bulk export (zip file with all CSVs)
router.get('/bulk', async (req, res) => {
  try {
    const archiver = require('archiver');
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=bulk_export.zip');
    
    archive.pipe(res);
    
    // Add each CSV to the archive
    const endpoints = ['users', 'events', 'bookings', 'categories', 'payments'];
    
    for (const endpoint of endpoints) {
      try {
        // Get the CSV data (you'd need to call the respective export functions)
        // This is a simplified version - in practice, you'd call the actual export functions
        const csvData = await generateCSVForEndpoint(endpoint);
        archive.append(csvData, { name: `${endpoint}.csv` });
      } catch (error) {
        console.error(`Error adding ${endpoint} to archive:`, error);
      }
    }
    
    archive.finalize();
  } catch (error) {
    console.error('Bulk export error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to generate CSV for an endpoint
async function generateCSVForEndpoint(endpoint) {
  // This would call the respective controller functions
  // For now, return a placeholder
  return `${endpoint.toUpperCase()} CSV Data\nPlaceholder content`;
}

module.exports = router;