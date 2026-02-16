const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Public routes
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);

// Protected routes
router.get('/organizer/my-events', auth, roleCheck('organizer', 'admin'), eventController.getOrganizerEvents);
router.get('/dashboard/stats', auth, roleCheck('admin', 'organizer'), eventController.getDashboardStats);
router.post('/', auth, roleCheck('organizer', 'admin'), eventController.createEvent);
router.put('/:id', auth, roleCheck('organizer', 'admin'), eventController.updateEvent);
router.delete('/:id', auth, roleCheck('organizer', 'admin'), eventController.deleteEvent);

module.exports = router;
