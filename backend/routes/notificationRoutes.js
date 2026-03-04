const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Protected routes
router.use(auth);

// User notification routes
router.get('/', notificationController.getUserNotifications);
router.put('/:id/read', notificationController.markAsRead);

// Admin announcement routes
router.post('/announcements', roleCheck('admin'), notificationController.createAnnouncement);
router.get('/announcements', notificationController.getAnnouncements);
router.post('/announcements/:id/broadcast', roleCheck('admin'), notificationController.broadcastAnnouncement);
router.delete('/announcements/:id', roleCheck('admin'), notificationController.deleteAnnouncement);

// Admin send notification route
router.post('/send', roleCheck('admin'), notificationController.sendNotification);

module.exports = router;
