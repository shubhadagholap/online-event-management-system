const axios = require('axios');

async function testCSVExports() {
  try {
    console.log('🔐 Testing CSV Export Functionality...\n');

    // Login as admin
    const adminLogin = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    const adminToken = adminLogin.data.token;
    console.log('✓ Admin login successful');

    const headers = { 'Authorization': `Bearer ${adminToken}` };

    // Test all CSV export endpoints
    const csvEndpoints = [
      { name: 'Users CSV', url: 'http://localhost:5000/api/users/export' },
      { name: 'Events CSV', url: 'http://localhost:5000/api/events/export' },
      { name: 'Bookings CSV', url: 'http://localhost:5000/api/bookings/export' },
      { name: 'Categories CSV', url: 'http://localhost:5000/api/categories/export' },
      { name: 'Payments CSV', url: 'http://localhost:5000/api/payments/export' }
    ];

    for (const endpoint of csvEndpoints) {
      try {
        console.log(`\n📊 Testing ${endpoint.name}...`);
        const response = await axios.get(endpoint.url, { headers });
        
        if (response.headers['content-type']?.includes('text/csv')) {
          console.log(`✓ ${endpoint.name} - CSV format correct`);
          console.log(`✓ Content length: ${response.data.length} characters`);
          console.log(`✓ First line: ${response.data.split('\n')[0]}`);
        } else {
          console.log(`❌ ${endpoint.name} - Not CSV format`);
        }
      } catch (error) {
        console.log(`❌ ${endpoint.name} - Error: ${error.response?.status} ${error.response?.statusText || error.message}`);
        if (error.response?.status === 404) {
          console.log(`   Route not found: ${endpoint.url}`);
        }
      }
    }

    console.log('\n🎯 CSV Export Test Complete!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testCSVExports();