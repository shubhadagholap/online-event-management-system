const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// All routes require authentication
router.use(auth);

// Admin / Organizer level analytics
router.get('/admin', roleCheck('admin'), analyticsController.getAdminAnalytics);
router.get('/organizer', roleCheck('organizer', 'admin'), analyticsController.getOrganizerAnalytics);
router.post('/reports', roleCheck('organizer', 'admin'), analyticsController.generateReport);
router.get('/reports', roleCheck('organizer', 'admin'), analyticsController.getReports);
router.get('/revenue/monthly', roleCheck('organizer', 'admin'), analyticsController.getMonthlyRevenue);
router.get('/revenue/by-method', roleCheck('organizer', 'admin'), analyticsController.getRevenueByPaymentMethod);

// Event Analytics (Organizer/Admin only)
router.get('/:eventId/analytics', roleCheck('organizer', 'admin'), analyticsController.getEventAnalytics);
router.get('/:eventId/realtime', roleCheck('organizer', 'admin'), analyticsController.getRealTimeMetrics);
router.get('/:eventId/export', roleCheck('organizer', 'admin'), analyticsController.exportAnalyticsData);
router.post('/:eventId/custom-report', roleCheck('organizer', 'admin'), analyticsController.generateCustomReport);
router.post('/:eventId/metrics', roleCheck('organizer', 'admin'), analyticsController.storeMetric);

// User Activity Tracking (All authenticated users)
router.post('/:eventId/activity', analyticsController.logUserActivity);

module.exports = router;