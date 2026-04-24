const axios = require('axios');

async function testAdminBookings() {
  try {
    console.log('Testing admin bookings endpoint...\n');
    
    // Login as admin
    const adminLogin = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    console.log('✅ Admin logged in successfully');
    const adminToken = adminLogin.data.token;
    
    // Test the admin bookings endpoint (getAll)
    const allBookingsResponse = await axios.get('http://localhost:5000/api/bookings/all', {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Cache-Control': 'no-cache'
      }
    });
    
    console.log('=== ALL BOOKINGS (ADMIN VIEW) ===');
    console.log('Status:', allBookingsResponse.status);
    console.log('Count:', allBookingsResponse.data.length);
    
    if (allBookingsResponse.data.length > 0) {
      console.log('\nFirst few bookings:');
      allBookingsResponse.data.slice(0, 3).forEach((booking, index) => {
        console.log(`${index + 1}. Booking ${booking.id}:`);
        console.log(`   User: ${booking.user_name} (${booking.user_email})`);
        console.log(`   Event: ${booking.event_title}`);
        console.log(`   Status: ${booking.status}/${booking.payment_status}`);
        console.log(`   Amount: ₹${booking.total_amount}`);
        console.log(`   Ticket: ${booking.ticket_number || 'N/A'}`);
        console.log('');
      });
      
      // Check if organizer info is included
      const hasOrganizerInfo = allBookingsResponse.data.some(booking => 
        booking.organizer_name || booking.organizer_email
      );
      
      if (!hasOrganizerInfo) {
        console.log('⚠️  WARNING: Organizer information is missing from bookings data');
        console.log('The admin view needs organizer info to show who organized each event');
      } else {
        console.log('✅ Organizer information is included in bookings data');
      }
      
      // Test stats calculation
      const stats = {
        total: allBookingsResponse.data.length,
        confirmed: allBookingsResponse.data.filter(b => b.status === 'confirmed').length,
        pending: allBookingsResponse.data.filter(b => b.status === 'pending').length,
        cancelled: allBookingsResponse.data.filter(b => b.status === 'cancelled').length,
        revenue: allBookingsResponse.data
          .filter(b => b.payment_status === 'paid')
          .reduce((sum, b) => sum + parseFloat(b.total_amount), 0)
      };
      
      console.log('=== CALCULATED STATS ===');
      console.log(`Total: ${stats.total}`);
      console.log(`Confirmed: ${stats.confirmed}`);
      console.log(`Pending: ${stats.pending}`);
      console.log(`Cancelled: ${stats.cancelled}`);
      console.log(`Revenue: ₹${stats.revenue.toFixed(2)}`);
      
    } else {
      console.log('❌ No bookings returned - this is the problem!');
    }
    
    // Compare with organizer bookings
    console.log('\n=== COMPARISON: ORGANIZER BOOKINGS ===');
    const organizerBookingsResponse = await axios.get('http://localhost:5000/api/bookings/organizer/bookings', {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Cache-Control': 'no-cache'
      }
    });
    
    console.log('Organizer bookings count:', organizerBookingsResponse.data.length);
    console.log('All bookings count:', allBookingsResponse.data.length);
    
    if (allBookingsResponse.data.length > organizerBookingsResponse.data.length) {
      console.log('✅ Admin endpoint returns more bookings than organizer endpoint');
    } else if (allBookingsResponse.data.length === organizerBookingsResponse.data.length) {
      console.log('⚠️  Admin and organizer endpoints return same count');
    } else {
      console.log('❌ Something is wrong - admin should see more bookings');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
    }
  }
}

testAdminBookings();