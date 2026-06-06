const db = require('./config/db');

async function checkNotifications() {
  try {
    console.log('🔔 Checking notifications system...\n');
    
    // Check all notifications in database
    const [allNotifications] = await db.query(`
      SELECT n.*, u.name as user_name, u.role,
             e.title as event_title
      FROM notifications n
      JOIN users u ON n.user_id = u.id
      LEFT JOIN events e ON n.event_id = e.id
      ORDER BY n.created_at DESC
    `);
    
    console.log(`Total notifications in database: ${allNotifications.length}`);
    
    if (allNotifications.length > 0) {
      console.log('\nNotifications by user:');
      const notificationsByUser = {};
      
      allNotifications.forEach(notif => {
        if (!notificationsByUser[notif.user_name]) {
          notificationsByUser[notif.user_name] = [];
        }
        notificationsByUser[notif.user_name].push(notif);
      });
      
      Object.keys(notificationsByUser).forEach(userName => {
        const userNotifications = notificationsByUser[userName];
        console.log(`\n${userName} (${userNotifications[0].role}): ${userNotifications.length} notifications`);
        userNotifications.forEach(notif => {
          console.log(`  - ${notif.subject || 'No subject'}: ${notif.message?.substring(0, 50)}... (${notif.is_read ? 'Read' : 'Unread'})`);
        });
      });
    } else {
      console.log('No notifications found in database');
      
      // Create some sample notifications
      console.log('\n📝 Creating sample notifications...');
      
      // Get all users
      const [users] = await db.query('SELECT id, name, email, role FROM users LIMIT 5');
      
      for (const user of users) {
        await db.query(`
          INSERT INTO notifications (user_id, event_id, type, subject, message, is_read)
          VALUES (?, NULL, 'in-app', ?, ?, FALSE)
        `, [
          user.id, 
          `Welcome ${user.name}!`, 
          `Welcome to the Event Management System. Your account has been set up successfully.`
        ]);
        
        if (user.role === 'organizer' || user.role === 'admin') {
          await db.query(`
            INSERT INTO notifications (user_id, event_id, type, subject, message, is_read)
            VALUES (?, NULL, 'in-app', ?, ?, FALSE)
          `, [
            user.id, 
            `System Update`, 
            `New features have been added to the organizer dashboard. Check out the enhanced analytics!`
          ]);
        }
      }
      
      console.log(`✅ Created sample notifications for ${users.length} users`);
    }
    
    // Check announcements
    const [announcements] = await db.query(`
      SELECT a.*, u.name as admin_name
      FROM announcements a
      JOIN users u ON a.admin_id = u.id
      WHERE a.is_active = TRUE
      ORDER BY a.created_at DESC
    `);
    
    console.log(`\nActive announcements: ${announcements.length}`);
    if (announcements.length === 0) {
      console.log('📢 Creating sample announcement...');
      
      // Get an admin user
      const [adminUsers] = await db.query('SELECT id FROM users WHERE role = "admin" LIMIT 1');
      if (adminUsers.length > 0) {
        await db.query(`
          INSERT INTO announcements (admin_id, title, content, is_active, expires_at)
          VALUES (?, ?, ?, TRUE, DATE_ADD(NOW(), INTERVAL 30 DAY))
        `, [
          adminUsers[0].id,
          'System Maintenance Notice',
          'We have successfully updated the dashboard with improved analytics and feedback systems. All features are now working optimally.'
        ]);
        
        console.log('✅ Created system announcement');
      }
    } else {
      announcements.forEach(announcement => {
        console.log(`  - ${announcement.title}: ${announcement.content.substring(0, 50)}...`);
      });
    }
    
    console.log('\n🎉 Notifications system checked and updated!');
    
  } catch (error) {
    console.error('❌ Error checking notifications:', error);
  } finally {
    process.exit(0);
  }
}

checkNotifications();