const axios = require('axios');

async function testSupritaIssues() {
  try {
    console.log('🔍 Testing Suprita\'s Dashboard Issues...\n');
    
    const baseURL = 'http://localhost:5000/api';
    
    // Test login for suprita
    console.log('1. Testing suprita login...');
    const loginResponse = await axios.post(`${baseURL}/auth/login`, {
      email: 'suprita@gmail.com',
      password: 'organizer123'
    });
    
    const token = loginResponse.data.token;
    const headers = { Authorization: `Bearer ${token}` };
    const user = loginResponse.data.user;
    
    console.log(`✅ Login successful - ${user.name} (ID: ${user.id}, Role: ${user.role})`);
    
    // Test the organizer bookings endpoint that's failing
    console.log('\n2. Testing /api/bookings/organizer/bookings (the failing endpoint)...');
    try {
      const bookingsResponse = await axios.get(`${baseURL}/bookings/organizer/bookings`, { headers });
      console.log(`✅ Organizer Bookings: ${bookingsResponse.data.length} bookings found`);
      
      if (bookingsResponse.data.length > 0) {
        console.log('Sample booking:');
        const booking = bookingsResponse.data[0];
        console.log({
          id: booking.id,
          event_title: booking.event_title,
          user_name: booking.user_name,
          status: booking.status,
          ticket_number: booking.ticket_number || 'No ticket'
        });
      }
    } catch (error) {
      console.log(`❌ Organizer Bookings API Error: ${error.response?.status} - ${error.response?.data?.message}`);
      console.log('Error details:', error.response?.data || error.message);
    }
    
    // Test certificates endpoint
    console.log('\n3. Testing certificates endpoint...');
    try {
      const certsResponse = await axios.get(`${baseURL}/certificates/organizer/certificates`, { headers });
      console.log(`✅ Organizer Certificates: ${certsResponse.data.length} certificates found`);
      
      if (certsResponse.data.length > 0) {
        console.log('Sample certificate:');
        const cert = certsResponse.data[0];
        console.log({
          id: cert.id,
          certificate_number: cert.certificate_number,
          participant_name: cert.participant_name,
          event_title: cert.event_title,
          status: cert.downloaded ? 'Downloaded' : 'Pending'
        });
      }
    } catch (error) {
      console.log(`❌ Certificates API Error: ${error.response?.status} - ${error.response?.data?.message}`);
    }
    
    // Test user's own bookings
    console.log('\n4. Testing /api/bookings/my-bookings...');
    try {
      const myBookingsResponse = await axios.get(`${baseURL}/bookings/my-bookings`, { headers });
      console.log(`✅ My Bookings: ${myBookingsResponse.data.length} bookings found`);
    } catch (error) {
      console.log(`❌ My Bookings API Error: ${error.response?.status} - ${error.response?.data?.message}`);
    }
    
    // Test analytics
    console.log('\n5. Testing organizer analytics...');
    try {
      const analyticsResponse = await axios.get(`${baseURL}/analytics/organizer`, { headers });
      console.log(`✅ Analytics working`);
      console.log('Stats:', {
        events: analyticsResponse.data.myEvents?.total_events,
        bookings: analyticsResponse.data.myBookings?.total_bookings,
        revenue: analyticsResponse.data.myRevenue?.total_revenue
      });
    } catch (error) {
      console.log(`❌ Analytics API Error: ${error.response?.status} - ${error.response?.data?.message}`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testSupritaIssues();