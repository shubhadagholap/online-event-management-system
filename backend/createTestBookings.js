const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'event_management'
});

console.log('Creating test bookings with different statuses...\n');

// Create some bookings with pending status
const testBookings = [
  {
    user_id: 9, // Jyoti
    event_id: 1, // Tech Summit 2026 (John Organizer)
    status: 'pending',
    payment_status: 'pending',
    total_amount: 99.99
  },
  {
    user_id: 6, // sakshi
    event_id: 2, // Rock Festival (John Organizer)
    status: 'pending',
    payment_status: 'pending',
    total_amount: 149.99
  },
  {
    user_id: 5, // Test User
    event_id: 5, // Fortune Global Forum (prerana)
    status: 'confirmed',
    payment_status: 'pending',
    total_amount: 1500.00
  }
];

let completed = 0;

testBookings.forEach((booking, index) => {
  connection.query(
    'INSERT INTO bookings (user_id, event_id, status, payment_status, total_amount) VALUES (?, ?, ?, ?, ?)',
    [booking.user_id, booking.event_id, booking.status, booking.payment_status, booking.total_amount],
    (err, result) => {
      if (err) {
        console.error(`Error creating booking ${index + 1}:`, err.message);
      } else {
        console.log(`✅ Created booking ${index + 1}: ${booking.status}/${booking.payment_status} - ₹${booking.total_amount}`);
        
        // Create ticket for the booking
        const ticketNumber = `TKT-${Date.now()}-${result.insertId}`;
        connection.query(
          'INSERT INTO tickets (booking_id, ticket_number) VALUES (?, ?)',
          [result.insertId, ticketNumber],
          (ticketErr) => {
            if (ticketErr) {
              console.error(`Error creating ticket for booking ${result.insertId}:`, ticketErr.message);
            } else {
              console.log(`  ✅ Created ticket: ${ticketNumber}`);
            }
          }
        );
      }
      
      completed++;
      if (completed === testBookings.length) {
        // Check the results
        setTimeout(() => {
          connection.query(`
            SELECT 
              b.id,
              b.status,
              b.payment_status,
              b.total_amount,
              e.title as event_title,
              u_organizer.name as organizer_name
            FROM bookings b
            JOIN events e ON b.event_id = e.id
            JOIN users u_organizer ON e.organizer_id = u_organizer.id
            ORDER BY b.id DESC
            LIMIT 10
          `, (err, results) => {
            if (err) {
              console.error('Error checking results:', err.message);
            } else {
              console.log('\n=== RECENT BOOKINGS ===');
              results.forEach(booking => {
                console.log(`Booking ${booking.id}: ${booking.event_title} (${booking.organizer_name})`);
                console.log(`  Status: ${booking.status} / Payment: ${booking.payment_status} / Amount: ₹${booking.total_amount}`);
              });
              
              // Count pending bookings
              const pendingBookings = results.filter(b => b.status === 'pending').length;
              const pendingPayments = results.filter(b => b.payment_status === 'pending').length;
              
              console.log(`\n📊 In recent bookings:`);
              console.log(`  Pending bookings (status): ${pendingBookings}`);
              console.log(`  Pending payments: ${pendingPayments}`);
            }
            
            connection.end();
          });
        }, 1000);
      }
    }
  );
});