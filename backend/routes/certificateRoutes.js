const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Protected routes
router.use(auth);

// Organizer certificate routes (MUST be before generic /:id route)
router.get('/organizer/certificates', roleCheck('organizer', 'admin'), certificateController.getOrganizerCertificates);
router.post('/organizer/auto-generate', roleCheck('organizer', 'admin'), certificateController.autoGenerateCertificates);
router.get('/organizer/stats', roleCheck('organizer', 'admin'), certificateController.getCertificateStats);

// User certificate routes
router.post('/', certificateController.generateCertificate);
router.get('/', certificateController.getUserCertificates);
router.get('/:id', certificateController.getCertificate);
router.post('/:id/download', certificateController.downloadCertificate);

module.exports = router;
