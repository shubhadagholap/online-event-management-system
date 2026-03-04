const express = require('express');
const router = express.Router();
const engagementController = require('../controllers/engagementController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// All routes require authentication
router.use(auth);

// Networking Sessions
router.get('/:eventId/networking', engagementController.getNetworkingSessions);
router.post('/:eventId/networking', roleCheck('organizer', 'admin'), engagementController.createNetworkingSession);

// Networking Matches
router.get('/:eventId/matches', engagementController.getNetworkingMatches);
router.put('/matches/:matchId', engagementController.updateMatchStatus);

// Event Polls
router.get('/:eventId/polls', engagementController.getEventPolls);
router.post('/:eventId/polls', roleCheck('organizer', 'admin'), engagementController.createEventPoll);
router.post('/polls/:pollId/respond', engagementController.submitPollResponse);
router.get('/polls/:pollId/results', engagementController.getPollResults);

// Event Feedback
router.post('/:eventId/feedback', engagementController.submitEventFeedback);
router.get('/:eventId/feedback', roleCheck('organizer', 'admin'), engagementController.getEventFeedback);

module.exports = router;