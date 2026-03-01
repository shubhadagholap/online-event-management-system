const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Protected routes
router.use(auth);

// User feedback routes
router.post('/', feedbackController.submitFeedback);
router.get('/my-feedback', feedbackController.getUserFeedback);

// Event feedback routes (public/protected)
router.get('/event/:event_id', feedbackController.getEventFeedback);
router.get('/event/:event_id/rating', feedbackController.getEventRating);

// Organizer feedback routes
router.get('/organizer/feedback', roleCheck('organizer', 'admin'), feedbackController.getOrganizerFeedback);
router.get('/organizer/ratings', roleCheck('organizer', 'admin'), feedbackController.getOrganizerRatings);

module.exports = router;
