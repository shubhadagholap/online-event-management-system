const express = require('express');
const router = express.Router();
const speakerController = require('../controllers/speakerController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Public routes (no auth required)
router.get('/', speakerController.getAllSpeakers);
router.get('/:speakerId', speakerController.getSpeakerById);
router.get('/:speakerId/availability', speakerController.getSpeakerAvailability);

// Protected routes
router.use(auth);

// Speaker Management (Admin/Organizer only)
router.post('/', roleCheck('organizer', 'admin'), speakerController.createSpeaker);
router.put('/:speakerId', roleCheck('organizer', 'admin'), speakerController.updateSpeaker);
router.delete('/:speakerId', roleCheck('admin'), speakerController.deleteSpeaker);

// Presentations
router.get('/:speakerId/presentations', speakerController.getSpeakerPresentations);
router.post('/presentations', roleCheck('organizer', 'admin'), speakerController.createPresentation);
router.put('/presentations/:presentationId/status', roleCheck('organizer', 'admin'), speakerController.updatePresentationStatus);

// Analytics
router.get('/:speakerId/analytics', roleCheck('organizer', 'admin'), speakerController.getSpeakerAnalytics);
router.put('/:speakerId/rating', roleCheck('organizer', 'admin'), speakerController.updateSpeakerRating);

module.exports = router;