const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'event_management'
});

console.log('Updating payment status for tickets...\n');

// Update all confirmed bookings to "paid" status so tickets show up
connection.query(
  'UPDATE bookings SET payment_status = "paid" WHERE status = "confirmed"',
  (err, result) => {
    if (err) {
      console.error('Error updating payment status:', err.message);
      return;
    }
    
    console.log(`✅ Updated ${result.affectedRows} bookings to "paid" status`);
    
    // Verify the update
    connection.query(`
      SELECT 
        b.id,
        b.status,
        b.payment_status,
        e.title as event_title,
        t.ticket_number
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      LEFT JOIN tickets t ON b.id = t.booking_id
      ORDER BY b.id
    `, (err, results) => {
      if (err) {
        console.error('Error checking results:', err.message);
        return;
      }
      
      console.log('\n=== UPDATED BOOKINGS ===');
      results.forEach(booking => {
        console.log(`Booking ${booking.id}: ${booking.event_title}`);
        console.log(`  Status: ${booking.status} / Payment: ${booking.payment_status}`);
        console.log(`  Ticket: ${booking.ticket_number}`);
        console.log('');
      });
      
      const ticketsNowVisible = results.filter(booking => 
        booking.status === 'confirmed' && booking.payment_status === 'paid'
      );
      
      console.log(`🎫 Tickets now visible: ${ticketsNowVisible.length}`);
      
      connection.end();
    });
  }
);