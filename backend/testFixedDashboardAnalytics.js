const db = require('./config/db');

// Test the fixed organizer analytics
async function testOrganizerAnalytics() {
  try {
    console.log('Testing Organizer Analytics...\n');
    
    // Test organizer ID 2 (John Organizer from seed data)
    const organizer_id = 2;
    
    // Test total events with status breakdown
    console.log('1. Testing Event Counting with Status Breakdown:');
    const [myEvents] = await db.query(`
      SELECT COUNT(*) as total_events,
        SUM(CASE WHEN status = 'upcoming' OR (status IS NULL AND date > NOW()) THEN 1 ELSE 0 END) as upcoming,
        SUM(CASE WHEN status = 'ongoing' OR (status IS NULL AND DATE(date) = CURDATE()) THEN 1 ELSE 0 END) as ongoing,
        SUM(CASE WHEN status = 'completed' OR (status IS NULL AND date < NOW() AND DATE(date) != CURDATE()) THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
      FROM events WHERE organizer_id = ?
    `, [organizer_id]);
    
    console.log('Event Stats:', myEvents[0]);
    
    // Test booking breakdown
    console.log('\n2. Testing Booking Status Breakdown:');
    const [myBookings] = await db.query(`
      SELECT COUNT(*) as total_bookings,
        SUM(CASE WHEN b.status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
        SUM(CASE WHEN b.status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN b.status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      WHERE e.organizer_id = ?
    `, [organizer_id]);
    
    console.log('Booking Stats:', myBookings[0]);
    
    // Test revenue calculation
    console.log('\n3. Testing Revenue Calculation:');
    const [myRevenue] = await db.query(`
      SELECT COALESCE(SUM(p.amount), 0) as total_revenue 
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN events e ON b.event_id = e.id
      WHERE e.organizer_id = ? AND p.status = 'completed'
    `, [organizer_id]);
    
    console.log('Revenue Stats:', myRevenue[0]);
    
    // Test feedback count (using correct table)
    console.log('\n4. Testing Feedback Count (corrected table):');
    const [feedbackStats] = await db.query(`
      SELECT COUNT(*) as feedback_count, AVG(rating) as avg_rating
      FROM feedback f
      JOIN events e ON f.event_id = e.id
      WHERE e.organizer_id = ?
    `, [organizer_id]);
    
    console.log('Feedback Stats:', feedbackStats[0]);
    
    // Test event-wise analytics with all details
    console.log('\n5. Testing Event-wise Analytics:');
    const [eventAnalytics] = await db.query(`
      SELECT e.id, e.title, e.date, e.status,
        COUNT(DISTINCT b.id) as booking_count,
        SUM(CASE WHEN b.status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_bookings,
        SUM(CASE WHEN b.status = 'pending' THEN 1 ELSE 0 END) as pending_bookings,
        SUM(CASE WHEN b.status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_bookings,
        COALESCE(SUM(p.amount), 0) as revenue,
        AVG(f.rating) as average_rating,
        COUNT(DISTINCT f.id) as feedback_count
      FROM events e
      LEFT JOIN bookings b ON e.id = b.event_id
      LEFT JOIN payments p ON b.id = p.booking_id AND p.status = 'completed'
      LEFT JOIN feedback f ON e.id = f.event_id
      WHERE e.organizer_id = ?
      GROUP BY e.id, e.title, e.date, e.status
      ORDER BY e.date DESC
    `, [organizer_id]);
    
    console.log('Event Analytics:');
    eventAnalytics.forEach(event => {
      console.log(`- Event ${event.id}: ${event.title} (${event.status || 'no-status'})`);
      console.log(`  Bookings: ${event.booking_count} (${event.confirmed_bookings} confirmed, ${event.pending_bookings} pending, ${event.cancelled_bookings} cancelled)`);
      console.log(`  Revenue: $${event.revenue}, Avg Rating: ${event.average_rating || 'No ratings'}, Feedback Count: ${event.feedback_count}`);
    });
    
    // Test CSV export data structure
    console.log('\n6. Testing CSV Export with Event IDs:');
    const [exportData] = await db.query(`
      SELECT b.id as booking_id, b.event_id, b.booking_date, b.status, b.payment_status, b.total_amount,
             e.id as event_id, e.title as event_title, e.date as event_date,
             u.name as user_name, u.email as user_email
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      JOIN users u ON b.user_id = u.id
      WHERE e.organizer_id = ?
      ORDER BY b.booking_date DESC
      LIMIT 5
    `, [organizer_id]);
    
    console.log('CSV Export Sample:');
    console.log('Headers: BookingID, EventID, Date, Status, Payment, Amount, Event, EventDate, User, UserEmail');
    exportData.forEach(row => {
      console.log(`${row.booking_id}, ${row.event_id}, ${row.booking_date}, ${row.status}, ${row.payment_status}, ${row.total_amount}, ${row.event_title}, ${row.event_date}, ${row.user_name}, ${row.user_email}`);
    });
    
    console.log('\n✅ All analytics tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    process.exit(0);
  }
}

// Run the test
testOrganizerAnalytics();