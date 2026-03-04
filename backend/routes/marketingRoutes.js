const express = require('express');
const router = express.Router();
const marketingController = require('../controllers/marketing');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// All routes require authentication and organizer/admin role
router.use(auth);
router.use(roleCheck('organizer', 'admin'));

// Email Campaigns
router.get('/:eventId/campaigns', marketingController.getEmailCampaigns);
router.post('/:eventId/campaigns', marketingController.createEmailCampaign);
router.post('/campaigns/:campaignId/send', marketingController.sendEmailCampaign);

// Social Media Posts
router.get('/:eventId/social-posts', marketingController.getSocialMediaPosts);
router.post('/:eventId/social-posts', marketingController.createSocialMediaPost);

module.exports = router;