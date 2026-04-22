const db = require('./config/db');

async function createConfirmedBookings() {
  console.log('='.repeat(60));
  console.log('CREATING CONFIRMED BOOKINGS FOR CERTIFICATE TESTING');
  console.log('='.repeat(60));

  try {
    // Get organizer's events
    const [events] = await db.query('SELECT id, title FROM events WHERE organizer_id = 2 LIMIT 3');
    console.log(`\nFound ${events.length} events for organizer`);

    // Get regular users
    const [users] = await db.query('SELECT id, name, email FROM users WHERE role = "user" LIMIT 5');
    console.log(`Found ${users.length} users`);

    let createdCount = 0;

    for (const event of events) {
      console.log(`\n--- Event: ${event.title} ---`);
      
      // Create 2-3 confirmed bookings per event
      const numBookings = Math.min(3, users.length);
      
      for (let i = 0; i < numBookings; i++) {
        const user = users[i];
        
        // Check if booking already exists
        const [existing] = await db.query(
          'SELECT id FROM bookings WHERE user_id = ? AND event_id = ?',
          [user.id, event.id]
        );

        if (existing.length > 0) {
          // Update to confirmed if exists
          await db.query(
            'UPDATE bookings SET status = "confirmed", payment_status = "paid" WHERE id = ?',
            [existing[0].id]
          );
          console.log(`✓ Updated booking for ${user.name} to confirmed`);
        } else {
          // Create new confirmed booking
          const [result] = await db.query(
            `INSERT INTO bookings (user_id, event_id, total_amount, status, payment_status)
             VALUES (?, ?, ?, "confirmed", "paid")`,
            [user.id, event.id, 50.00]
          );
          
          // Create ticket
          const ticketNumber = `TKT-${Date.now()}-${result.insertId}`;
          await db.query(
            'INSERT INTO tickets (booking_id, ticket_number) VALUES (?, ?)',
            [result.insertId, ticketNumber]
          );
          
          console.log(`✓ Created confirmed booking for ${user.name} (Ticket: ${ticketNumber})`);
          createdCount++;
        }
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('SUMMARY');
    console.log('='.repeat(60));
    
    const [totalConfirmed] = await db.query(
      `SELECT COUNT(*) as count FROM bookings b
       JOIN events e ON b.event_id = e.id
       WHERE e.organizer_id = 2 AND b.status = "confirmed"`
    );
    
    console.log(`Total confirmed bookings for organizer: ${totalConfirmed[0].count}`);
    console.log(`New bookings created: ${createdCount}`);
    
    console.log('\n✓ Ready to generate certificates!');
    console.log('  Login as: organizer@example.com / organizer123');
    console.log('  Go to Certificates page and click "Auto-Generate"');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit();
  }
}

createConfirmedBookings();
