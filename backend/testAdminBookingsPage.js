const axios = require('axios');

async function testAdminBookingsPage() {
  try {
    console.log('Testing admin bookings page functionality...\n');
    
    // Login as admin
    const adminLogin = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    console.log('✅ Admin logged in successfully');
    console.log('User role:', adminLogin.data.user.role);
    
    const adminToken = adminLogin.data.token;
    
    // Test the endpoint that the ManageBookings page will call
    const bookingsResponse = await axios.get('http://localhost:5000/api/bookings/all', {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Cache-Control': 'no-cache'
      }
    });
    
    console.log('\n=== ADMIN BOOKINGS PAGE DATA ===');
    console.log('Status:', bookingsResponse.status);
    console.log('Total bookings:', bookingsResponse.data.length);
    
    if (bookingsResponse.data.length > 0) {
      console.log('\n📋 Sample booking data (what the table will show):');
      const sampleBooking = bookingsResponse.data[0];
      console.log('Ticket #:', sampleBooking.ticket_number || 'N/A');
      console.log('User:', sampleBooking.user_name, `(${sampleBooking.user_email})`);
      console.log('Event:', sampleBooking.event_title);
      console.log('Organizer:', sampleBooking.organizer_name || 'N/A');
      console.log('Event Date:', sampleBooking.event_date);
      console.log('Booking Date:', sampleBooking.booking_date);
      console.log('Amount: $' + sampleBooking.total_amount);
      console.log('Status:', sampleBooking.status);
      console.log('Payment:', sampleBooking.payment_status);
      
      // Test stats calculation (what the stats cards will show)
      const stats = {
        total: bookingsResponse.data.length,
        confirmed: bookingsResponse.data.filter(b => b.status === 'confirmed').length,
        pending: bookingsResponse.data.filter(b => b.status === 'pending').length,
        cancelled: bookingsResponse.data.filter(b => b.status === 'cancelled').length,
        revenue: bookingsResponse.data
          .filter(b => b.payment_status === 'paid')
          .reduce((sum, b) => sum + parseFloat(b.total_amount), 0)
      };
      
      console.log('\n📊 Stats cards will show:');
      console.log(`Total Bookings: ${stats.total}`);
      console.log(`Confirmed: ${stats.confirmed}`);
      console.log(`Pending: ${stats.pending}`);
      console.log(`Cancelled: ${stats.cancelled}`);
      console.log(`Revenue: $${stats.revenue.toFixed(2)}`);
      
      console.log('\n✅ Admin bookings page should now work correctly!');
      console.log('\nTo test:');
      console.log('1. Login as admin@gmail.com / admin123');
      console.log('2. Visit http://localhost:3000/organizer/bookings');
      console.log('3. You should see "All Bookings" with admin view badge');
      console.log('4. Table should show all 7 bookings with organizer column');
      console.log('5. Stats cards should show the numbers above');
      
    } else {
      console.log('❌ No bookings found - something is still wrong');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testAdminBookingsPage();