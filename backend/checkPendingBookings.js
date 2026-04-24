const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'event_management'
});

console.log('Checking pending bookings issue...\n');

// Check all bookings with their current status
connection.query(`
  SELECT 
    b.id,
    b.user_id,
    b.event_id,
    b.status,
    b.payment_status,
    b.total_amount,
    e.title as event_title,
    e.organizer_id,
    u_organizer.name as organizer_name,
    u_user.name as user_name
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
  
  console.log('=== ALL BOOKINGS WITH STATUS ===');
  results.forEach(booking => {
    console.log(`Booking ${booking.id}:`);
    console.log(`  Event: ${booking.event_title} (Organizer: ${booking.organizer_name})`);
    console.log(`  User: ${booking.user_name}`);
    console.log(`  Status: ${booking.status}`);
    console.log(`  Payment Status: ${booking.payment_status}`);
    console.log(`  Amount: ₹${booking.total_amount}`);
    console.log('');
  });
  
  // Count by status
  const statusCounts = {
    pending: results.filter(b => b.status === 'pending').length,
    confirmed: results.filter(b => b.status === 'confirmed').length,
    cancelled: results.filter(b => b.status === 'cancelled').length
  };
  
  const paymentCounts = {
    pending: results.filter(b => b.payment_status === 'pending').length,
    paid: results.filter(b => b.payment_status === 'paid').length,
    refunded: results.filter(b => b.payment_status === 'refunded').length
  };
  
  console.log('=== STATUS COUNTS ===');
  console.log('Booking Status:');
  console.log(`  Pending: ${statusCounts.pending}`);
  console.log(`  Confirmed: ${statusCounts.confirmed}`);
  console.log(`  Cancelled: ${statusCounts.cancelled}`);
  
  console.log('\nPayment Status:');
  console.log(`  Pending: ${paymentCounts.pending}`);
  console.log(`  Paid: ${paymentCounts.paid}`);
  console.log(`  Refunded: ${paymentCounts.refunded}`);
  
  // Test the exact queries used in the dashboard stats
  console.log('\n=== TESTING DASHBOARD QUERIES ===');
  
  // Test for John Organizer (ID: 2)
  const organizerId = 2;
  
  connection.query(`
    SELECT COUNT(*) as count 
    FROM bookings b 
    JOIN events e ON b.event_id = e.id 
    WHERE e.organizer_id = ? AND b.status = "pending"
  `, [organizerId], (err, pendingResult) => {
    if (err) {
      console.error('Error checking pending for organizer:', err.message);
    } else {
      console.log(`John Organizer pending bookings: ${pendingResult[0].count}`);
    }
    
    // Test confirmed bookings
    connection.query(`
      SELECT COUNT(*) as count 
      FROM bookings b 
      JOIN events e ON b.event_id = e.id 
      WHERE e.organizer_id = ? AND b.status = "confirmed"
    `, [organizerId], (err, confirmedResult) => {
      if (err) {
        console.error('Error checking confirmed for organizer:', err.message);
      } else {
        console.log(`John Organizer confirmed bookings: ${confirmedResult[0].count}`);
      }
      
      // Test total bookings
      connection.query(`
        SELECT COUNT(*) as count 
        FROM bookings b 
        JOIN events e ON b.event_id = e.id 
        WHERE e.organizer_id = ?
      `, [organizerId], (err, totalResult) => {
        if (err) {
          console.error('Error checking total for organizer:', err.message);
        } else {
          console.log(`John Organizer total bookings: ${totalResult[0].count}`);
        }
        
        connection.end();
      });
    });
  });
});