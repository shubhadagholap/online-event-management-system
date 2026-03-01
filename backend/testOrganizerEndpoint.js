const axios = require('axios');

async function testOrganizerBookings() {
  try {
    console.log('Testing organizer bookings endpoint...\n');
    
    // Test with admin@gmail.com (who should be an admin with organizer access)
    const adminLoginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    const adminToken = adminLoginResponse.data.token;
    console.log('✓ Logged in as admin@gmail.com');
    console.log('User info:', adminLoginResponse.data.user);
    
    const adminBookingsResponse = await axios.get('http://localhost:5000/api/bookings/organizer/bookings', {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Cache-Control': 'no-cache'
      }
    });
    
    console.log('✓ Admin organizer bookings response:');
    console.log('Status:', adminBookingsResponse.status);
    console.log('Data:', JSON.stringify(adminBookingsResponse.data, null, 2));
    
    // Also test the dashboard stats endpoint
    console.log('\n--- Testing Dashboard Stats ---');
    
    const statsResponse = await axios.get('http://localhost:5000/api/bookings/dashboard/stats', {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Cache-Control': 'no-cache'
      }
    });
    
    console.log('✓ Dashboard stats response:');
    console.log('Status:', statsResponse.status);
    console.log('Data:', JSON.stringify(statsResponse.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error testing endpoint:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

testOrganizerBookings();