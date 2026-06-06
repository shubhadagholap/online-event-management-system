const axios = require('axios');
const db = require('./config/db');

async function fixRevenueMismatch() {
  try {
    console.log('🔍 Diagnosing Revenue Mismatch Issue...\n');
    
    const baseURL = 'http://localhost:5000/api';
    
    // Login as suprita
    const loginResponse = await axios.post(`${baseURL}/auth/login`, {
      email: 'suprita@gmail.com',
      password: 'organizer123'
    });
    
    const token = loginResponse.data.token;
    const headers = { Authorization: `Bearer ${token}` };
    const user = loginResponse.data.user;
    
    console.log(`✅ Login successful - ${user.name} (ID: ${user.id})`);
    
    // Check direct database queries for suprita's revenue
    console.log('\n1. Direct Database Revenue Analysis:');
    
    // My Bookings revenue (user's own bookings)
    const [myBookingsRevenue] = await db.query(`
      SELECT SUM(b.total_amount) as my_bookings_revenue
      FROM bookings b
      WHERE b.user_id = ? AND b.status = 'confirmed'
    `, [user.id]);
    
    console.log(`My Bookings Revenue (as user): ₹${myBookingsRevenue[0].my_bookings_revenue || 0}`);
    
    // Organizer revenue (from events they organize)
    const [organizerRevenue] = await db.query(`
      SELECT SUM(CASE WHEN p.status = 'completed' THEN p.amount ELSE 0 END) as from_payments,
             SUM(CASE WHEN b.status = 'confirmed' THEN b.total_amount ELSE 0 END) as from_bookings
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      LEFT JOIN payments p ON b.id = p.booking_id
      WHERE e.organizer_id = ?
    `, [user.id]);
    
    console.log(`Organizer Revenue (from payments): ₹${organizerRevenue[0].from_payments || 0}`);
    console.log(`Organizer Revenue (from bookings): ₹${organizerRevenue[0].from_bookings || 0}`);
    
    // Check what the analytics API returns
    console.log('\n2. Analytics API Response:');
    const analyticsResponse = await axios.get(`${baseURL}/analytics/organizer`, { headers });
    console.log(`Analytics API Revenue: ₹${analyticsResponse.data.myRevenue?.total_revenue || 0}`);
    
    // Check individual bookings for suprita's events
    console.log('\n3. Detailed Booking Analysis:');
    const [detailedBookings] = await db.query(`
      SELECT b.id, b.total_amount, b.status, b.payment_status,
             e.title as event_title, u.name as user_name,
             p.amount as payment_amount, p.status as payment_status_real
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      JOIN users u ON b.user_id = u.id
      LEFT JOIN payments p ON b.id = p.booking_id
      WHERE e.organizer_id = ?
      ORDER BY b.id
    `, [user.id]);
    
    let totalFromBookings = 0;
    let totalFromPayments = 0;
    
    console.log(`Found ${detailedBookings.length} bookings for suprita's events:`);
    detailedBookings.forEach(booking => {
      console.log(`- Booking ${booking.id}: ${booking.event_title} by ${booking.user_name}`);
      console.log(`  Amount: ₹${booking.total_amount}, Status: ${booking.status}`);
      console.log(`  Payment: ₹${booking.payment_amount || 0}, Status: ${booking.payment_status_real || 'none'}`);
      
      if (booking.status === 'confirmed') {
        totalFromBookings += parseFloat(booking.total_amount || 0);
      }
      if (booking.payment_status_real === 'completed') {
        totalFromPayments += parseFloat(booking.payment_amount || 0);
      }
    });
    
    console.log(`\n📊 Revenue Calculation Summary:`);
    console.log(`Total from confirmed bookings: ₹${totalFromBookings}`);
    console.log(`Total from completed payments: ₹${totalFromPayments}`);
    
    // Check suprita's personal bookings (as a user)
    console.log('\n4. Suprita\'s Personal Bookings (as user):');
    const [personalBookings] = await db.query(`
      SELECT b.id, b.total_amount, b.status, e.title as event_title
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      WHERE b.user_id = ?
      ORDER BY b.id
    `, [user.id]);
    
    let personalRevenue = 0;
    console.log(`Suprita's personal bookings: ${personalBookings.length}`);
    personalBookings.forEach(booking => {
      console.log(`- Booking ${booking.id}: ${booking.event_title}, ₹${booking.total_amount}, Status: ${booking.status}`);
      if (booking.status === 'confirmed') {
        personalRevenue += parseFloat(booking.total_amount || 0);
      }
    });
    
    console.log(`\n💡 SOLUTION NEEDED:`);
    console.log(`- My Bookings should show: ₹${personalRevenue} (suprita as user)`);
    console.log(`- Organizer Dashboard should show: ₹${totalFromPayments} (suprita as organizer)`);
    console.log(`- Current mismatch indicates revenue calculation issue in analytics`);
    
  } catch (error) {
    console.error('❌ Analysis failed:', error.response?.data || error.message);
  } finally {
    process.exit(0);
  }
}

fixRevenueMismatch();