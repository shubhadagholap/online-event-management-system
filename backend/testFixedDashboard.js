const axios = require('axios');

async function testFixedDashboard() {
  try {
    console.log('Testing fixed organizer dashboard...\n');
    
    // Test with John Organizer
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'organizer@example.com',
      password: 'organizer123'
    });
    
    console.log('✅ John Organizer logged in');
    const token = loginResponse.data.token;
    
    // Test the dashboard stats endpoint
    const statsResponse = await axios.get('http://localhost:5000/api/bookings/dashboard/stats', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache'
      }
    });
    
    console.log('=== ORGANIZER DASHBOARD STATS ===');
    console.log('Status:', statsResponse.status);
    console.log('Data:', JSON.stringify(statsResponse.data, null, 2));
    
    // Check data types
    const data = statsResponse.data;
    console.log('\n=== DATA TYPE ANALYSIS ===');
    console.log(`myEvents: ${data.myEvents} (${typeof data.myEvents})`);
    console.log(`totalBookings: ${data.totalBookings} (${typeof data.totalBookings})`);
    console.log(`totalRevenue: ${data.totalRevenue} (${typeof data.totalRevenue})`);
    console.log(`confirmedBookings: ${data.confirmedBookings} (${typeof data.confirmedBookings})`);
    console.log(`pendingBookings: ${data.pendingBookings} (${typeof data.pendingBookings})`);
    console.log(`cancelledBookings: ${data.cancelledBookings} (${typeof data.cancelledBookings})`);
    
    // Test parseFloat conversion
    const revenue = parseFloat(data.totalRevenue) || 0;
    console.log(`\n💰 Revenue conversion test: $${revenue.toFixed(2)}`);
    
    // Test with admin user
    console.log('\n=== TESTING WITH ADMIN USER ===');
    const adminLogin = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    const adminToken = adminLogin.data.token;
    const adminStats = await axios.get('http://localhost:5000/api/bookings/dashboard/stats', {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Cache-Control': 'no-cache'
      }
    });
    
    console.log('Admin stats:', JSON.stringify(adminStats.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testFixedDashboard();