const express = require('express');
const router = express.Router();
const virtualController = require('../controllers/virtualController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// All routes require authentication
router.use(auth);

// Virtual Rooms
router.get('/:eventId/rooms', virtualController.getVirtualRooms);
router.post('/:eventId/rooms', roleCheck('organizer', 'admin'), virtualController.createVirtualRoom);
router.post('/rooms/:roomId/join', virtualController.joinVirtualRoom);
router.put('/attendance/:attendanceId/leave', virtualController.leaveVirtualRoom);
router.put('/rooms/:roomId/settings', roleCheck('organizer', 'admin'), virtualController.updateRoomSettings);
router.get('/rooms/:roomId/participants', virtualController.getRoomParticipants);

// Chat
router.get('/rooms/:roomId/messages', virtualController.getRoomMessages);
router.post('/rooms/:roomId/messages', virtualController.sendChatMessage);

// Analytics
router.get('/:eventId/virtual-stats', roleCheck('organizer', 'admin'), virtualController.getVirtualAttendanceStats);

module.exports = router;