const db = require('./config/db');

(async () => {
  try {
    // Create test event for admin
    const eventRes = await db.query(
      'INSERT INTO events (title, description, date, location, organizer_id, capacity, price, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      ['Admin Summit 2026', 'Administrator organized event', '2026-04-01 10:00:00', 'New York', 1, 100, 0, '/images/event-default.jpg']
    );
    const eventId = eventRes[0].insertId;
    console.log('✓ Created event:', eventId);

    // Create bookings for this event
    const [users] = await db.query('SELECT id FROM users WHERE role = "user" LIMIT 3');
    console.log('Creating bookings for users:', users.map(u => u.id));

    for (const user of users) {
      await db.query(
        'INSERT INTO bookings (user_id, event_id, booking_date, status, total_amount) VALUES (?, ?, NOW(), ?, ?)',
        [user.id, eventId, 'confirmed', 0]
      );
    }

    console.log('✓ Created 3 confirmed bookings');
    console.log('\nNow as admin:');
    console.log('1. Go to Certificates > Issued Certificates tab');
    console.log('2. Click "Generate Certificates" button');
    console.log('3. Enter Event ID:', eventId);
    console.log('4. Click Generate');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();
