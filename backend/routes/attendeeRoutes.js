const express = require('express');
const router = express.Router();
const attendeeController = require('../controllers/attendeeController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// All routes require authentication
router.use(auth);

// Registration Forms
router.get('/:eventId/registration-form', attendeeController.getRegistrationForm);
router.post('/:eventId/registration-form', roleCheck('organizer', 'admin'), attendeeController.createRegistrationForm);

// Attendee Management
router.get('/:eventId/attendees', roleCheck('organizer', 'admin'), attendeeController.getEventAttendees);
router.post('/:eventId/register', attendeeController.registerAttendee);
router.put('/attendees/:attendeeId/checkin', roleCheck('organizer', 'admin'), attendeeController.checkInAttendee);
router.put('/attendees/:attendeeId', attendeeController.updateAttendeeProfile);

// Session Attendance
router.post('/sessions/:scheduleId/attend', attendeeController.recordSessionAttendance);
router.put('/attendance/:attendanceId/feedback', attendeeController.submitSessionFeedback);

// Analytics
router.get('/:eventId/stats', roleCheck('organizer', 'admin'), attendeeController.getAttendeeStats);

module.exports = router;