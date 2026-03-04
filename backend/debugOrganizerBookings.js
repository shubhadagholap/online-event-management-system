const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'event_management'
});

console.log('Debugging organizer bookings issue...\n');

// First, let's see all bookings with full details
connection.query(`
  SELECT 
    b.id as booking_id,
    b.user_id,
    b.event_id,
    b.status,
    b.payment_status,
    e.title as event_title,
    e.organizer_id,
    u_organizer.name as organizer_name,
    u_organizer.email as organizer_email,
    u_user.name as user_name,
    u_user.email as user_email
  FROM bookings b
  JOIN events e ON b.event_id = e.id
  JOIN users u_organizer ON e.organizer_id = u_organizer.id
  JOIN users u_user ON b.user_id = u_user.id
  ORDER BY b.id
`, (err, results) => {
  if (err) {
    console.error('Error:', err.message);
    return;
  }
  
  console.log('=== ALL BOOKINGS WITH ORGANIZER INFO ===');
  results.forEach(booking => {
    console.log(`Booking ${booking.booking_id}:`);
    console.log(`  Event: "${booking.event_title}" (ID: ${booking.event_id})`);
    console.log(`  Organizer: ${booking.organizer_name} (${booking.organizer_email}) - ID: ${booking.organizer_id}`);
    console.log(`  User: ${booking.user_name} (${booking.user_email}) - ID: ${booking.user_id}`);
    console.log(`  Status: ${booking.status}/${booking.payment_status}`);
    console.log('');
  });
  
  // Now let's test the exact query used in the organizer bookings endpoint
  console.log('=== TESTING ORGANIZER QUERIES ===');
  
  // Test for each organizer
  const organizers = [2, 4, 8, 10]; // John Organizer, prerana, Admin User, suprita
  
  let completed = 0;
  organizers.forEach(organizerId => {
    connection.query(`
      SELECT b.*, e.title as event_title, u.name as user_name, u.email as user_email
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      JOIN users u ON b.user_id = u.id
      WHERE e.organizer_id = ?
      ORDER BY b.booking_date DESC
    `, [organizerId], (err, bookings) => {
      if (err) {
        console.error(`Error for organizer ${organizerId}:`, err.message);
      } else {
        connection.query('SELECT name, email FROM users WHERE id = ?', [organizerId], (err, organizer) => {
          if (!err && organizer.length > 0) {
            console.log(`Organizer ${organizerId} (${organizer[0].name} - ${organizer[0].email}):`);
            console.log(`  Found ${bookings.length} bookings`);
            bookings.forEach(booking => {
              console.log(`    - Booking ${booking.id}: ${booking.user_name} → ${booking.event_title}`);
            });
            console.log('');
          }
          
          completed++;
          if (completed === organizers.length) {
            connection.end();
          }
        });
      }
    });
  });
});