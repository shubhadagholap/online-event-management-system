const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// All routes require authentication
router.use(auth);

// User routes
router.get('/my-bookings', bookingController.getUserBookings);
router.post('/', bookingController.createBooking);
router.delete('/:id/cancel', bookingController.cancelBooking);

// Admin routes
router.get('/all', roleCheck('admin'), bookingController.getAllBookings);

// Organizer routes
router.get('/organizer/bookings', roleCheck('organizer', 'admin'), bookingController.getOrganizerBookings);

// Common routes
router.get('/:id', bookingController.getBookingById);
router.put('/:id/status', roleCheck('admin', 'organizer'), bookingController.updateBookingStatus);

module.exports = router;
