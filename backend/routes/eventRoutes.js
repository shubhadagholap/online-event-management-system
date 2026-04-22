const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Public routes
router.get('/', eventController.getAllEvents);

// Protected routes - specific paths MUST come before /:id
router.get('/export', auth, roleCheck('admin'), eventController.exportEventsCSV); // admin CSV
router.get('/organizer/my-events', auth, roleCheck('organizer', 'admin'), eventController.getOrganizerEvents);
router.get('/dashboard/stats', auth, roleCheck('admin', 'organizer'), eventController.getDashboardStats);

// Dynamic route - MUST come after specific paths
router.get('/:id', eventController.getEventById);
router.post('/', auth, roleCheck('organizer', 'admin'), eventController.createEvent);
router.put('/:id', auth, roleCheck('organizer', 'admin'), eventController.updateEvent);
router.delete('/:id', auth, roleCheck('organizer', 'admin'), eventController.deleteEvent);

module.exports = router;
