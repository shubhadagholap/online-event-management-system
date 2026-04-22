const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test credentials
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';

async function testAllCSVExports() {
  try {
    console.log('🔐 Logging in as admin...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });

    const token = loginResponse.data.token;
    console.log('✅ Login successful\n');

    const headers = {
      'Authorization': `Bearer ${token}`
    };

    // Test 1: Users CSV Export
    console.log('📊 Testing Users CSV Export...');
    try {
      const usersResponse = await axios.get(`${BASE_URL}/users/export`, { headers });
      console.log('✅ Users CSV: SUCCESS');
      console.log(`   Status: ${usersResponse.status}`);
      console.log(`   Content-Type: ${usersResponse.headers['content-type']}`);
      console.log(`   Data length: ${usersResponse.data.length} bytes\n`);
    } catch (error) {
      console.log('❌ Users CSV: FAILED');
      console.log(`   Status: ${error.response?.status}`);
      console.log(`   Error: ${error.response?.data?.message || error.message}\n`);
    }

    // Test 2: Events CSV Export
    console.log('📊 Testing Events CSV Export...');
    try {
      const eventsResponse = await axios.get(`${BASE_URL}/events/export`, { headers });
      console.log('✅ Events CSV: SUCCESS');
      console.log(`   Status: ${eventsResponse.status}`);
      console.log(`   Content-Type: ${eventsResponse.headers['content-type']}`);
      console.log(`   Data length: ${eventsResponse.data.length} bytes\n`);
    } catch (error) {
      console.log('❌ Events CSV: FAILED');
      console.log(`   Status: ${error.response?.status}`);
      console.log(`   Error: ${error.response?.data?.message || error.message}\n`);
    }

    // Test 3: Bookings CSV Export
    console.log('📊 Testing Bookings CSV Export...');
    try {
      const bookingsResponse = await axios.get(`${BASE_URL}/bookings/export`, { headers });
      console.log('✅ Bookings CSV: SUCCESS');
      console.log(`   Status: ${bookingsResponse.status}`);
      console.log(`   Content-Type: ${bookingsResponse.headers['content-type']}`);
      console.log(`   Data length: ${bookingsResponse.data.length} bytes\n`);
    } catch (error) {
      console.log('❌ Bookings CSV: FAILED');
      console.log(`   Status: ${error.response?.status}`);
      console.log(`   Error: ${error.response?.data?.message || error.message}\n`);
    }

    // Test 4: Categories CSV Export
    console.log('📊 Testing Categories CSV Export...');
    try {
      const categoriesResponse = await axios.get(`${BASE_URL}/categories/export`, { headers });
      console.log('✅ Categories CSV: SUCCESS');
      console.log(`   Status: ${categoriesResponse.status}`);
      console.log(`   Content-Type: ${categoriesResponse.headers['content-type']}`);
      console.log(`   Data length: ${categoriesResponse.data.length} bytes\n`);
    } catch (error) {
      console.log('❌ Categories CSV: FAILED');
      console.log(`   Status: ${error.response?.status}`);
      console.log(`   Error: ${error.response?.data?.message || error.message}\n`);
    }

    console.log('═══════════════════════════════════════');
    console.log('✅ CSV Export Testing Complete!');
    console.log('═══════════════════════════════════════');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Run the test
testAllCSVExports();
