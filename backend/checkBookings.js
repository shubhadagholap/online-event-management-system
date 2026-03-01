const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'event_management'
});

console.log('Checking booking data for dashboard...\n');

// Check total bookings
connection.query('SELECT COUNT(*) as total FROM bookings', (err, totalResult) => {
  if (err) {
    console.error('❌ Error getting total bookings:', err.message);
    return;
  }
  
  console.log(`📊 Total Bookings: ${totalResult[0].total}`);
  
  // Check bookings by status
  connection.query(`
    SELECT status, COUNT(*) as count 
    FROM bookings 
    GROUP BY status
  `, (err, statusResults) => {
    if (err) {
      console.error('❌ Error getting bookings by status:', err.message);
      return;
    }
    
    console.log('\n📈 Bookings by Status:');
    statusResults.forEach(row => {
      console.log(`  ${row.status}: ${row.count}`);
    });
    
    // Check bookings by organizer
    connection.query(`
      SELECT u.name as organizer_name, u.email, COUNT(b.id) as booking_count
      FROM users u
      LEFT JOIN events e ON u.id = e.organizer_id
      LEFT JOIN bookings b ON e.id = b.event_id
      WHERE u.role IN ('organizer', 'admin')
      GROUP BY u.id, u.name, u.email
      ORDER BY booking_count DESC
    `, (err, organizerResults) => {
      if (err) {
        console.error('❌ Error getting organizer bookings:', err.message);
        return;
      }
      
      console.log('\n👥 Bookings by Organizer:');
      organizerResults.forEach(row => {
        console.log(`  ${row.organizer_name} (${row.email}): ${row.booking_count} bookings`);
      });
      
      // Check detailed booking info
      connection.query(`
        SELECT b.id, b.status, b.payment_status, e.title, u.name as organizer_name, u2.name as user_name
        FROM bookings b
        JOIN events e ON b.event_id = e.id
        JOIN users u ON e.organizer_id = u.id
        JOIN users u2 ON b.user_id = u2.id
        ORDER BY b.id
      `, (err, detailResults) => {
        if (err) {
          console.error('❌ Error getting detailed bookings:', err.message);
          return;
        }
        
        console.log('\n📋 Detailed Bookings:');
        detailResults.forEach(row => {
          console.log(`  Booking ${row.id}: ${row.user_name} → ${row.title} (Organizer: ${row.organizer_name}) [${row.status}/${row.payment_status}]`);
        });
        
        connection.end();
      });
    });
  });
});