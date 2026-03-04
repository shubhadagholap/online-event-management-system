const db = require('../config/db');

// Email Campaigns Management
exports.getEmailCampaigns = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const [campaigns] = await db.query(
      'SELECT * FROM email_campaigns WHERE event_id = ? ORDER BY created_at DESC',
      [eventId]
    );

    res.json(campaigns);
  } catch (error) {
    console.error('Get campaigns error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createEmailCampaign = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { campaign_name, subject, content, template_type, target_audience, scheduled_time } = req.body;

    const [result] = await db.query(
      'INSERT INTO email_campaigns (event_id, campaign_name, subject, content, template_type, target_audience, scheduled_time) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [eventId, campaign_name, subject, content, template_type, JSON.stringify(target_audience), scheduled_time]
    );

    res.status(201).json({ 
      message: 'Campaign created successfully',
      campaignId: result.insertId 
    });
  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.sendEmailCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;

    // Update campaign status to sent
    await db.query(
      'UPDATE email_campaigns SET status = "sent", sent_time = NOW() WHERE id = ?',
      [campaignId]
    );

    // Here you would integrate with email service (SendGrid, Mailgun, etc.)
    // For now, we'll just mark it as sent

    res.json({ message: 'Campaign sent successfully' });
  } catch (error) {
    console.error('Send campaign error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Social Media Posts Management
exports.getSocialMediaPosts = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const [posts] = await db.query(
      'SELECT * FROM social_media_posts WHERE event_id = ? ORDER BY created_at DESC',
      [eventId]
    );

    res.json(posts);
  } catch (error) {
    console.error('Get social posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createSocialMediaPost = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { platform, content, media_urls, scheduled_time } = req.body;

    const [result] = await db.query(
      'INSERT INTO social_media_posts (event_id, platform, content, media_urls, scheduled_time) VALUES (?, ?, ?, ?, ?)',
      [eventId, platform, content, JSON.stringify(media_urls), scheduled_time]
    );

    res.status(201).json({ 
      message: 'Social media post created successfully',
      postId: result.insertId 
    });
  } catch (error) {
    console.error('Create social post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};