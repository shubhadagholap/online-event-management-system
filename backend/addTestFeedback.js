const db = require('./config/db');

async function addTestFeedback() {
  try {
    console.log('Adding test feedback data...\n');
    
    // Add feedback for different events and users
    const feedbackData = [
      { event_id: 1, user_id: 3, rating: 5, comment: 'Excellent tech summit! Very informative.' },
      { event_id: 2, user_id: 3, rating: 4, comment: 'Great music festival, enjoyed the performances.' },
      { event_id: 2, user_id: 1, rating: 5, comment: 'Amazing event organization and venue.' },
      { event_id: 1, user_id: 1, rating: 4, comment: 'Good content but could have been better organized.' }
    ];
    
    for (const feedback of feedbackData) {
      // Check if feedback already exists
      const [existing] = await db.query(
        'SELECT id FROM feedback WHERE event_id = ? AND user_id = ?',
        [feedback.event_id, feedback.user_id]
      );
      
      if (existing.length === 0) {
        await db.query(
          'INSERT INTO feedback (event_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
          [feedback.event_id, feedback.user_id, feedback.rating, feedback.comment]
        );
        console.log(`✅ Added feedback for Event ${feedback.event_id} by User ${feedback.user_id} (Rating: ${feedback.rating})`);
      } else {
        console.log(`⚠️ Feedback already exists for Event ${feedback.event_id} by User ${feedback.user_id}`);
      }
    }
    
    // Show current feedback stats
    console.log('\n📊 Current Feedback Statistics:');
    const [stats] = await db.query(`
      SELECT e.id, e.title, COUNT(f.id) as feedback_count, AVG(f.rating) as avg_rating
      FROM events e
      LEFT JOIN feedback f ON e.id = f.event_id
      WHERE e.organizer_id = 2
      GROUP BY e.id, e.title
      ORDER BY e.id
    `);
    
    stats.forEach(stat => {
      console.log(`Event ${stat.id} (${stat.title}): ${stat.feedback_count} feedback(s), Avg Rating: ${stat.avg_rating || 'N/A'}`);
    });
    
    console.log('\n✅ Test feedback data setup completed!');
    
  } catch (error) {
    console.error('❌ Error adding test feedback:', error);
  } finally {
    process.exit(0);
  }
}

addTestFeedback();