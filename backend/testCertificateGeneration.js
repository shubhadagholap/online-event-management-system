const db = require('./config/db');

async function testCertificateGeneration() {
  console.log('='.repeat(60));
  console.log('CERTIFICATE GENERATION TEST');
  console.log('='.repeat(60));

  try {
    // 1. Get organizer user
    console.log('\n1. Finding organizer...');
    const [organizers] = await db.query('SELECT id, email, name FROM users WHERE role = "organizer" LIMIT 1');
    if (organizers.length === 0) {
      console.log('✗ No organizer found');
      process.exit(1);
    }
    const organizer = organizers[0];
    console.log(`✓ Found organizer: ${organizer.email} (ID: ${organizer.id})`);

    // 2. Get organizer's events
    console.log('\n2. Finding organizer events...');
    const [events] = await db.query('SELECT id, title, date FROM events WHERE organizer_id = ? LIMIT 5', [organizer.id]);
    if (events.length === 0) {
      console.log('✗ No events found for this organizer');
      process.exit(1);
    }
    console.log(`✓ Found ${events.length} events:`);
    events.forEach(e => console.log(`  - ${e.title} (ID: ${e.id})`));

    // 3. Get confirmed bookings for first event
    const testEvent = events[0];
    console.log(`\n3. Checking confirmed bookings for: ${testEvent.title}`);
    const [bookings] = await db.query(
      `SELECT b.id, b.user_id, u.name as user_name, b.status 
       FROM bookings b 
       JOIN users u ON b.user_id = u.id 
       WHERE b.event_id = ? AND b.status = "confirmed"`,
      [testEvent.id]
    );
    console.log(`✓ Found ${bookings.length} confirmed bookings`);
    bookings.forEach(b => console.log(`  - ${b.user_name} (Booking ID: ${b.id})`));

    // 4. Check existing certificates
    console.log('\n4. Checking existing certificates...');
    const [existingCerts] = await db.query(
      'SELECT COUNT(*) as count FROM certificates WHERE event_id = ?',
      [testEvent.id]
    );
    console.log(`✓ Existing certificates for this event: ${existingCerts[0].count}`);

    // 5. Check certificates table structure
    console.log('\n5. Verifying certificates table...');
    const [tableCheck] = await db.query('SHOW TABLES LIKE "certificates"');
    if (tableCheck.length === 0) {
      console.log('✗ Certificates table does not exist!');
      console.log('  Run: node addModulesTables.js');
      process.exit(1);
    }
    console.log('✓ Certificates table exists');

    // 6. Summary
    console.log('\n' + '='.repeat(60));
    console.log('SUMMARY');
    console.log('='.repeat(60));
    console.log(`Organizer: ${organizer.email}`);
    console.log(`Test Event: ${testEvent.title} (ID: ${testEvent.id})`);
    console.log(`Confirmed Bookings: ${bookings.length}`);
    console.log(`Existing Certificates: ${existingCerts[0].count}`);
    console.log(`Can Generate: ${bookings.length - existingCerts[0].count} new certificates`);

    console.log('\n' + '='.repeat(60));
    console.log('TO GENERATE CERTIFICATES:');
    console.log('='.repeat(60));
    console.log('1. Login as organizer: organizer@example.com / organizer123');
    console.log('2. Go to Certificates page');
    console.log(`3. Click "Auto-Generate" for event: ${testEvent.title}`);
    console.log(`4. Or use API: POST /api/certificates/organizer/auto-generate`);
    console.log(`   Body: { "event_id": ${testEvent.id} }`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit();
  }
}

testCertificateGeneration();
