const express = require('express');
const router = express.Router();
const planningController = require('../controllers/planningController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// All routes require authentication
router.use(auth);

// Event Templates
router.get('/templates', planningController.getEventTemplates);
router.post('/templates', roleCheck('organizer', 'admin'), planningController.createEventTemplate);

// Event Schedules
router.get('/:eventId/schedule', planningController.getEventSchedule);
router.post('/:eventId/schedule', roleCheck('organizer', 'admin'), planningController.createScheduleSession);
router.put('/schedule/:sessionId', roleCheck('organizer', 'admin'), planningController.updateScheduleSession);
router.delete('/schedule/:sessionId', roleCheck('organizer', 'admin'), planningController.deleteScheduleSession);

// Event Tasks
router.get('/:eventId/tasks', roleCheck('organizer', 'admin'), planningController.getEventTasks);
router.post('/:eventId/tasks', roleCheck('organizer', 'admin'), planningController.createEventTask);
router.put('/tasks/:taskId/status', roleCheck('organizer', 'admin'), planningController.updateTaskStatus);

// Event Resources
router.get('/:eventId/resources', roleCheck('organizer', 'admin'), planningController.getEventResources);
router.post('/:eventId/resources', roleCheck('organizer', 'admin'), planningController.createEventResource);
router.put('/resources/:resourceId/status', roleCheck('organizer', 'admin'), planningController.updateResourceStatus);

module.exports = router;