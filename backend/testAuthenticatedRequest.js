const axios = require('axios');

async function testAuthenticatedRequest() {
  try {
    // First login to get token
    console.log('🔐 Logging in as admin...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });

    const token = loginResponse.data.token;
    console.log('✓ Login successful, token received');

    // Test dashboard stats with token
    console.log('📊 Testing dashboard stats endpoint...');
    const statsResponse = await axios.get('http://localhost:5000/api/bookings/dashboard/stats', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✓ Dashboard stats response:', JSON.stringify(statsResponse.data, null, 2));

    // Test notifications endpoint
    console.log('🔔 Testing notifications endpoint...');
    const notificationsResponse = await axios.get('http://localhost:5000/api/notifications', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✓ Notifications response:', JSON.stringify(notificationsResponse.data, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testAuthenticatedRequest();