const axios = require('axios');

async function testSingleCSVExport(endpoint) {
  try {
    console.log(`🔐 Testing ${endpoint} CSV Export...\n`);

    // Login as admin
    const adminLogin = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    const adminToken = adminLogin.data.token;
    console.log('✓ Admin login successful');

    const headers = { 'Authorization': `Bearer ${adminToken}` };

    // Test the specific CSV export endpoint
    const url = `http://localhost:5000/api/${endpoint}/export`;
    console.log(`\n📊 Testing: ${url}`);
    
    const response = await axios.get(url, { headers });
    
    if (response.headers['content-type']?.includes('text/csv')) {
      console.log(`✓ CSV format correct`);
      console.log(`✓ Content length: ${response.data.length} characters`);
      console.log(`✓ First line: ${response.data.split('\n')[0]}`);
      console.log(`✓ Total rows: ${response.data.split('\n').length - 1}`);
    } else {
      console.log(`❌ Not CSV format`);
    }

  } catch (error) {
    console.error(`❌ Error: ${error.response?.status} ${error.response?.statusText || error.message}`);
    if (error.response?.status === 404) {
      console.log(`   Route not found: ${url}`);
    }
  }
}

// Get endpoint from command line argument
const endpoint = process.argv[2];
if (!endpoint) {
  console.log('Usage: node testSingleCSVExport.js <endpoint>');
  console.log('Available endpoints: users, events, bookings, categories, payments');
  process.exit(1);
}

testSingleCSVExport(endpoint);