const db = require('./config/db');

async function checkCurrentUserFeedback() {
  try {
    console.log('🔍 Checking current user feedback issue...\n');
    
    // Check all feedback in database
    const [allFeedback] = await db.query(`
      SELECT f.id, f.event_id, f.user_id, f.rating, f.comment,
             e.title as event_title, e.organizer_id,
             u.name as user_name,
             org.name as organizer_name, org.email as organizer_email
      FROM feedback f
      JOIN events e ON f.event_id = e.id
      JOIN users u ON f.user_id = u.id
      JOIN users org ON e.organizer_id = org.id
      ORDER BY f.created_at DESC
    `);
    
    console.log(`📊 Total feedback entries: ${allFeedback.length}`);
    
    // Group by organizer
    const feedbackByOrganizer = {};
    allFeedback.forEach(fb => {
      const orgKey = `${fb.organizer_name} (${fb.organizer_email})`;
      if (!feedbackByOrganizer[orgKey]) {
        feedbackByOrganizer[orgKey] = [];
      }
      feedbackByOrganizer[orgKey].push(fb);
    });
    
    console.log('\n📋 Feedback by Organizer:');
    Object.keys(feedbackByOrganizer).forEach(orgName => {
      const orgFeedback = feedbackByOrganizer[orgName];
      console.log(`\n${orgName}: ${orgFeedback.length} feedback entries`);
      orgFeedback.slice(0, 3).forEach(fb => {
        console.log(`  - ${fb.event_title}: ${fb.rating}★ by ${fb.user_name}`);
      });
      if (orgFeedback.length > 3) {
        console.log(`  ... and ${orgFeedback.length - 3} more`);
      }
    });
    
    // Check what the organizer API would return for each admin user
    console.log('\n🧪 Testing Organizer Feedback API Queries:');
    
    const [adminUsers] = await db.query(`
      SELECT id, name, email FROM users WHERE role = 'admin'
    `);
    
    for (const admin of adminUsers) {
      console.log(`\n${admin.name} (${admin.email}, ID: ${admin.id}):`);
      
      // This is the exact query used by the organizer feedback API
      const [orgFeedback] = await db.query(`
        SELECT f.*, e.title as event_title, u.name as user_name 
        FROM feedback f
        JOIN events e ON f.event_id = e.id
        JOIN users u ON f.user_id = u.id
        WHERE e.organizer_id = ?
        ORDER BY f.created_at DESC
      `, [admin.id]);
      
      console.log(`  API would return: ${orgFeedback.length} feedback entries`);
      
      if (orgFeedback.length > 0) {
        console.log('  Sample feedback:');
        orgFeedback.slice(0, 2).forEach(fb => {
          console.log(`    - ${fb.event_title}: ${fb.rating}★ by ${fb.user_name}`);
        });
      }
    }
    
    // Check if there are any authentication issues by checking admin events
    console.log('\n🎯 Admin Events Analysis:');
    const [adminEvents] = await db.query(`
      SELECT u.id as admin_id, u.name, u.email,
             e.id as event_id, e.title,
             COUNT(f.id) as feedback_count
      FROM users u
      LEFT JOIN events e ON u.id = e.organizer_id  
      LEFT JOIN feedback f ON e.id = f.event_id
      WHERE u.role = 'admin'
      GROUP BY u.id, u.name, u.email, e.id, e.title
      ORDER BY u.id, feedback_count DESC
    `);
    
    adminEvents.forEach(event => {
      if (event.event_id) {
        console.log(`${event.name}: Event "${event.title}" has ${event.feedback_count} feedback`);
      } else {
        console.log(`${event.name}: No events found`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error checking feedback:', error);
  } finally {
    process.exit(0);
  }
}

checkCurrentUserFeedback();