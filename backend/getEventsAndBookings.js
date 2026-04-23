const db = require('./config/db');

async function getEventsAndBookings() {
  console.log('='.repeat(70));
  console.log('EVENTS AND BOOKINGS DATA');
  console.log('='.repeat(70));

  try {
    // Get all events
    console.log('\n1. ALL EVENTS:');
    const [events] = await db.query(`
      SELECT e.id, e.title, e.date, e.location, e.organizer_id, u.name as organizer_name
      FROM events e
      LEFT JOIN users u ON e.organizer_id = u.id
      ORDER BY e.id
    `);
    
    console.log(`\nTotal Events: ${events.length}\n`);
    events.forEach(e => {
      console.log(`Event ID: ${e.id}`);
      console.log(`  Title: ${e.title}`);
      console.log(`  Date: ${e.date}`);
      console.log(`  Location: ${e.location}`);
      console.log(`  Organizer: ${e.organizer_name} (ID: ${e.organizer_id})`);
      console.log('');
    });

    // Get all bookings
    console.log('\n2. ALL BOOKINGS:');
    const [bookings] = await db.query(`
      SELECT b.id, b.event_id, b.user_id, b.status, b.payment_status, 
             e.title as event_title, u.name as user_name
      FROM bookings b
      LEFT JOIN events e ON b.event_id = e.id
      LEFT JOIN users u ON b.user_id = u.id
      ORDER BY b.event_id, b.id
    `);
    
    console.log(`\nTotal Bookings: ${bookings.length}\n`);
    bookings.forEach(b => {
      console.log(`Booking ID: ${b.id}`);
      console.log(`  Event ID: ${b.event_id} - ${b.event_title}`);
      console.log(`  User ID: ${b.user_id} - ${b.user_name}`);
      console.log(`  Status: ${b.status}`);
      console.log(`  Payment: ${b.payment_status}`);
      console.log('');
    });

    // Group bookings by event
    console.log('\n3. BOOKINGS BY EVENT:');
    const eventBookings = {};
    bookings.forEach(b => {
      if (!eventBookings[b.event_id]) {
        eventBookings[b.event_id] = [];
      }
      eventBookings[b.event_id].push(b);
    });

    events.forEach(e => {
      const eventBookingsList = eventBookings[e.id] || [];
      console.log(`\nEvent ID ${e.id}: ${e.title}`);
      console.log(`  Total Bookings: ${eventBookingsList.length}`);
      if (eventBookingsList.length > 0) {
        console.log(`  Booking IDs: ${eventBookingsList.map(b => b.id).join(', ')}`);
        eventBookingsList.forEach(b => {
          console.log(`    - Booking ${b.id}: ${b.user_name} (${b.status}, ${b.payment_status})`);
        });
      } else {
        console.log(`    - No bookings`);
      }
    });

    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('SUMMARY');
    console.log('='.repeat(70));
    console.log(`\nTotal Events: ${events.length}`);
    console.log(`Total Bookings: ${bookings.length}`);
    console.log(`\nEvents with Bookings: ${Object.keys(eventBookings).length}`);
    console.log(`Events without Bookings: ${events.length - Object.keys(eventBookings).length}`);

    // Export to CSV format
    console.log('\n' + '='.repeat(70));
    console.log('CSV FORMAT DATA');
    console.log('='.repeat(70));
    
    console.log('\nEVENTS CSV:');
    console.log('EventID,Title,Date,Location,OrganizerID,OrganizerName');
    events.forEach(e => {
      console.log(`${e.id},"${e.title}","${e.date}","${e.location}",${e.organizer_id},"${e.organizer_name}"`);
    });

    console.log('\nBOOKINGS CSV:');
    console.log('BookingID,EventID,EventTitle,UserID,UserName,Status,Payment');
    bookings.forEach(b => {
      console.log(`${b.id},${b.event_id},"${b.event_title}",${b.user_id},"${b.user_name}","${b.status}","${b.payment_status}"`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit();
  }
}

getEventsAndBookings();
