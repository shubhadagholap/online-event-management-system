const axios = require('axios');
const db = require('./config/db');

async function diagnoseFeedbackIssue() {
  try {
    console.log('🔍 Diagnosing Feedback Display Issue...\n');
    
    const baseURL = 'http://localhost:5000/api';
    
    // Test with different user credentials to see who the frontend is using
    const testUsers = [
      { email: 'admin@gmail.com', password: 'admin123', role: 'admin' },
      { email: 'organizer@example.com', password: 'organizer123', role: 'organizer' },
      { email: 'user@example.com', password: 'user123', role: 'user' }
    ];
    
    for (const testUser of testUsers) {
      console.log(`\n🧪 Testing with ${testUser.role}: ${testUser.email}`);
      
      try {
        // Login
        const loginResponse = await axios.post(`${baseURL}/auth/login`, {
          email: testUser.email,
          password: testUser.password
        });
        
        const token = loginResponse.data.token;
        const headers = { Authorization: `Bearer ${token}` };
        const loggedUser = loginResponse.data.user;
        
        console.log(`✅ Login successful - User ID: ${loggedUser.id}, Name: ${loggedUser.name}`);
        
        // Test feedback endpoints
        try {
          if (testUser.role === 'organizer' || testUser.role === 'admin') {
            const orgFeedbackResponse = await axios.get(`${baseURL}/feedback/organizer/feedback`, { headers });
            console.log(`📝 Organizer Feedback: ${orgFeedbackResponse.data.length} entries`);
            
            if (orgFeedbackResponse.data.length > 0) {
              console.log(`   Sample: Event "${orgFeedbackResponse.data[0].event_title}" - Rating: ${orgFeedbackResponse.data[0].rating}`);
            }
          }
          
          // Test user's own feedback
          const userFeedbackResponse = await axios.get(`${baseURL}/feedback/my-feedback`, { headers });
          console.log(`📝 My Feedback: ${userFeedbackResponse.data.length} entries`);
          
          // Test notifications
          const notificationsResponse = await axios.get(`${baseURL}/notifications`, { headers });
          console.log(`🔔 Notifications: ${notificationsResponse.data.length} entries`);
          
        } catch (apiError) {
          console.log(`❌ API Error: ${apiError.response?.data?.message || apiError.message}`);
        }
        
      } catch (loginError) {
        console.log(`❌ Login failed: ${loginError.response?.data?.message || loginError.message}`);
      }
    }
    
    // Check database directly
    console.log('\n\n📊 Direct Database Analysis:');
    console.log('=================================');
    
    // All feedback by organizer
    const [feedbackByOrganizer] = await db.query(`
      SELECT org.id as organizer_id, org.name as organizer_name, org.role,
        COUNT(f.id) as feedback_count
      FROM users org
      LEFT JOIN events e ON org.id = e.organizer_id
      LEFT JOIN feedback f ON e.id = f.event_id
      WHERE org.role IN ('admin', 'organizer')
      GROUP BY org.id, org.name, org.role
      ORDER BY feedback_count DESC
    `);
    
    console.log('Feedback count by organizer:');
    feedbackByOrganizer.forEach(org => {
      console.log(`  ${org.organizer_name} (${org.role}): ${org.feedback_count} feedback entries`);
    });
    
    // Check who has notifications
    const [notificationsByUser] = await db.query(`
      SELECT u.id, u.name, u.role, COUNT(n.id) as notification_count,
        SUM(CASE WHEN n.is_read = 0 THEN 1 ELSE 0 END) as unread_count
      FROM users u
      LEFT JOIN notifications n ON u.id = n.user_id
      GROUP BY u.id, u.name, u.role
      HAVING notification_count > 0
      ORDER BY notification_count DESC
    `);
    
    console.log('\nNotifications by user:');
    notificationsByUser.forEach(user => {
      console.log(`  ${user.name} (${user.role}): ${user.notification_count} total (${user.unread_count} unread)`);
    });
    
    // Check if specific user from frontend has feedback
    console.log('\n🎯 Checking specific users:');
    
    // Check Admin User (seems to be logged in based on screenshot)
    const [adminUserData] = await db.query(`
      SELECT u.id, u.name, u.email, u.role FROM users u 
      WHERE u.name = 'Admin User' OR u.email LIKE 'admin%'
    `);
    
    for (const admin of adminUserData) {
      console.log(`\nAdmin: ${admin.name} (${admin.email}, ID: ${admin.id})`);
      
      // Check their events
      const [adminEvents] = await db.query(`
        SELECT e.id, e.title, COUNT(f.id) as feedback_count
        FROM events e
        LEFT JOIN feedback f ON e.id = f.event_id
        WHERE e.organizer_id = ?
        GROUP BY e.id, e.title
      `, [admin.id]);
      
      console.log(`  Events: ${adminEvents.length}`);
      adminEvents.forEach(event => {
        console.log(`    - ${event.title}: ${event.feedback_count} feedback`);
      });
      
      // Check their notifications
      const [adminNotifications] = await db.query(`
        SELECT COUNT(*) as total, 
        SUM(CASE WHEN is_read = 0 THEN 1 ELSE 0 END) as unread
        FROM notifications WHERE user_id = ?
      `, [admin.id]);
      
      console.log(`  Notifications: ${adminNotifications[0].total} total (${adminNotifications[0].unread} unread)`);
    }
    
  } catch (error) {
    console.error('❌ Diagnosis failed:', error);
  } finally {
    process.exit(0);
  }
}

diagnoseFeedbackIssue();