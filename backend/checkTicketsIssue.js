const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'event_management'
});

console.log('Checking tickets issue...\n');

// Check all bookings with their payment status
connection.query(`
  SELECT 
    b.id,
    b.status,
    b.payment_status,
    b.total_amount,
    e.title as event_title,
    t.ticket_number
  FROM bookings b
  JOIN events e ON b.event_id = e.id
  LEFT JOIN tickets t ON b.id = t.booking_id
  ORDER BY b.id
`, (err, results) => {
  if (err) {
    console.error('Error:', err.message);
    return;
  }
  
  console.log('=== ALL BOOKINGS WITH PAYMENT STATUS ===');
  results.forEach(booking => {
    console.log(`Booking ${booking.id}:`);
    console.log(`  Event: ${booking.event_title}`);
    console.log(`  Status: ${booking.status}`);
    console.log(`  Payment Status: ${booking.payment_status}`);
    console.log(`  Amount: ₹${booking.total_amount}`);
    console.log(`  Ticket Number: ${booking.ticket_number || 'No ticket'}`);
    console.log('');
  });
  
  // Check what the tickets page filter would return
  const paidTickets = results.filter(booking => 
    booking.status === 'confirmed' && booking.payment_status === 'paid'
  );
  
  const confirmedTickets = results.filter(booking => 
    booking.status === 'confirmed'
  );
  
  console.log('=== FILTER RESULTS ===');
  console.log(`Total bookings: ${results.length}`);
  console.log(`Confirmed bookings: ${confirmedTickets.length}`);
  console.log(`Paid bookings (what tickets page shows): ${paidTickets.length}`);
  
  if (paidTickets.length === 0 && confirmedTickets.length > 0) {
    console.log('\n🚨 ISSUE FOUND:');
    console.log('The tickets page filters for payment_status = "paid"');
    console.log('But all bookings have payment_status = "pending"');
    console.log('This is why no tickets are showing!');
  }
  
  connection.end();
});