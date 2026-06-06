const db = require('./config/db');

async function fixPendingBookings() {
  try {
    console.log('🔧 Fixing pending bookings issue...\n');
    
    // First, show current pending bookings
    console.log('Current pending bookings:');
    const [pendingBookings] = await db.query(`
      SELECT b.id, b.status, b.payment_status, e.title as event_title, 
             u.name as user_name, e.organizer_id,
             org.name as organizer_name
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      JOIN users u ON b.user_id = u.id
      JOIN users org ON e.organizer_id = org.id
      WHERE b.status = 'pending'
      ORDER BY b.id
    `);
    
    console.log('Pending bookings found:', pendingBookings.length);
    pendingBookings.forEach(booking => {
      console.log(`- Booking ${booking.id}: ${booking.event_title} (${booking.user_name}) - Organizer: ${booking.organizer_name}`);
    });
    
    if (pendingBookings.length > 0) {
      console.log('\n🔄 Converting pending bookings to confirmed...');
      
      // Update all pending bookings to confirmed
      const [result] = await db.query(`
        UPDATE bookings 
        SET status = 'confirmed' 
        WHERE status = 'pending'
      `);
      
      console.log(`✅ Updated ${result.affectedRows} bookings from pending to confirmed`);
      
      // Also update payment status if still pending
      const [paymentResult] = await db.query(`
        UPDATE bookings 
        SET payment_status = 'paid' 
        WHERE payment_status = 'pending' AND status = 'confirmed'
      `);
      
      console.log(`✅ Updated ${paymentResult.affectedRows} payment statuses to 'paid'`);
    } else {
      console.log('✅ No pending bookings to fix');
    }
    
    // Show updated counts by organizer
    console.log('\n📊 Updated booking counts by organizer:');
    const [organizerCounts] = await db.query(`
      SELECT org.name as organizer_name,
        COUNT(*) as total_bookings,
        SUM(CASE WHEN b.status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
        SUM(CASE WHEN b.status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN b.status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      JOIN users org ON e.organizer_id = org.id
      GROUP BY org.id, org.name
      ORDER BY org.name
    `);
    
    organizerCounts.forEach(org => {
      console.log(`${org.organizer_name}: Total ${org.total_bookings} (${org.confirmed} confirmed, ${org.pending} pending, ${org.cancelled} cancelled)`);
    });
    
    console.log('\n🎉 All pending bookings have been fixed!');
    console.log('The organizer dashboard should now show 0 pending bookings for all organizers.');
    
  } catch (error) {
    console.error('❌ Error fixing pending bookings:', error);
  } finally {
    process.exit(0);
  }
}

fixPendingBookings();