const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

async function setupExtendedDatabase() {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    multipleStatements: true
  });
  
  try {
    console.log('🚀 Setting up Extended Event Management Database...\n');
    
    // Read and execute the extended schema
    const schemaPath = path.join(__dirname, '..', 'database', 'extended-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📋 Executing extended database schema...');
    
    connection.query(schema, (err, results) => {
      if (err) {
        console.error('❌ Error executing schema:', err.message);
        connection.end();
        return;
      }
      
      console.log('✅ Extended database schema executed successfully');
      
      // Verify the setup
      connection.query('USE event_management', (err) => {
        if (err) {
          console.error('❌ Error switching to database:', err.message);
          connection.end();
          return;
        }
        
        // Check if new tables were created
        connection.query('SHOW TABLES', (err, tables) => {
          if (err) {
            console.error('❌ Error checking tables:', err.message);
            connection.end();
            return;
          }
          
          const tableNames = tables.map(t => Object.values(t)[0]);
          const newTables = [
            'event_templates', 'event_schedules', 'speakers', 'presentations',
            'registration_forms', 'attendee_profiles', 'session_attendance',
            'email_campaigns', 'email_tracking', 'social_media_posts',
            'networking_sessions', 'networking_matches', 'event_polls',
            'poll_responses', 'event_feedback', 'virtual_rooms',
            'virtual_attendance', 'chat_messages', 'event_analytics',
            'user_activity_logs', 'event_resources', 'event_tasks'
          ];
          
          console.log('\n📊 Database Setup Summary:');
          console.log(`Total tables: ${tableNames.length}`);
          
          const missingTables = newTables.filter(table => !tableNames.includes(table));
          if (missingTables.length === 0) {
            console.log('✅ All extended tables created successfully');
          } else {
            console.log('⚠️  Missing tables:', missingTables.join(', '));
          }
          
          // Check sample data
          connection.query('SELECT COUNT(*) as count FROM speakers', (err, speakers) => {
            if (!err) {
              console.log(`✅ Sample speakers: ${speakers[0].count}`);
            }
            
            connection.query('SELECT COUNT(*) as count FROM event_templates', (err, templates) => {
              if (!err) {
                console.log(`✅ Sample templates: ${templates[0].count}`);
              }
              
              connection.query('SELECT COUNT(*) as count FROM virtual_rooms', (err, rooms) => {
                if (!err) {
                  console.log(`✅ Sample virtual rooms: ${rooms[0].count}`);
                }
                
                console.log('\n🎉 Extended Event Management System is ready!');
                console.log('\n📋 New Features Available:');
                console.log('1. ✅ Planning and Pre-Event Setup');
                console.log('   - Event templates and schedules');
                console.log('   - Task and resource management');
                console.log('');
                console.log('2. ✅ Registration and Attendee Management');
                console.log('   - Custom registration forms');
                console.log('   - Attendee profiles and check-in');
                console.log('   - Session attendance tracking');
                console.log('');
                console.log('3. ✅ Marketing and Communication');
                console.log('   - Email campaigns');
                console.log('   - Social media post scheduling');
                console.log('   - Email tracking and analytics');
                console.log('');
                console.log('4. ✅ Content and Speaker Management');
                console.log('   - Speaker profiles and presentations');
                console.log('   - Speaker analytics and ratings');
                console.log('   - Availability management');
                console.log('');
                console.log('5. ✅ Engagement and Logistics');
                console.log('   - Networking sessions and matches');
                console.log('   - Live polls and Q&A');
                console.log('   - Event feedback system');
                console.log('');
                console.log('6. ✅ Analytics and Reporting');
                console.log('   - Real-time event metrics');
                console.log('   - Custom reports and data export');
                console.log('   - User activity tracking');
                console.log('');
                console.log('7. ✅ Virtual & Hybrid Event Tools');
                console.log('   - Virtual rooms and chat');
                console.log('   - Virtual attendance tracking');
                console.log('   - Multi-platform support');
                console.log('');
                console.log('🔗 API Endpoints:');
                console.log('   /api/planning/* - Event planning and setup');
                console.log('   /api/attendees/* - Registration and attendee management');
                console.log('   /api/marketing/* - Marketing campaigns');
                console.log('   /api/engagement/* - Polls, feedback, networking');
                console.log('   /api/virtual/* - Virtual event features');
                console.log('   /api/analytics/* - Analytics and reporting');
                console.log('   /api/speakers/* - Speaker management');
                console.log('');
                console.log('🚀 Ready to start building advanced event management features!');
                
                connection.end();
              });
            });
          });
        });
      });
    });
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    connection.end();
  }
}

// Run the setup
setupExtendedDatabase();