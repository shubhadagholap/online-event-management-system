const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'event_management'
});

console.log('Finding which user has the bookings...\n');

connection.query(`
  SELECT b.id, b.user_id, u.name, u.email, b.status, e.title 
  FROM bookings b 
  JOIN users u ON b.user_id = u.id 
  JOIN events e ON b.event_id = e.id
`, (err, results) => {
  if (err) {
    console.error('Error:', err.message);
    return;
  }
  
  console.log('Bookings with user details:');
  results.forEach(booking => {
    console.log(`Booking ${booking.id}: User ${booking.user_id} (${booking.name} - ${booking.email}) booked "${booking.title}" [${booking.status}]`);
  });
  
  // Also check all users
  connection.query('SELECT id, name, email, role FROM users', (err, users) => {
    if (err) {
      console.error('Error getting users:', err.message);
      return;
    }
    
    console.log('\nAll users:');
    users.forEach(user => {
      console.log(`User ${user.id}: ${user.name} (${user.email}) - ${user.role}`);
    });
    
    connection.end();
  });
});