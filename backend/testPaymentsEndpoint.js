const axios = require('axios');

async function testPaymentsEndpoint() {
  try {
    console.log('🔐 Testing Payments Endpoint...\n');

    // Login as admin
    const adminLogin = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    const adminToken = adminLogin.data.token;
    console.log('✓ Admin login successful');

    const headers = { 'Authorization': `Bearer ${adminToken}` };

    // Test payments endpoints
    try {
      console.log('\n📊 Testing GET /api/payments...');
      const paymentsResponse = await axios.get('http://localhost:5000/api/payments', { headers });
      console.log(`✓ Payments endpoint works: ${paymentsResponse.data.length} payments found`);
    } catch (error) {
      console.log(`❌ Payments endpoint error: ${error.response?.status} ${error.response?.statusText}`);
      console.log(`   Error details:`, error.response?.data);
    }

    try {
      console.log('\n📊 Testing GET /api/payments/export...');
      const exportResponse = await axios.get('http://localhost:5000/api/payments/export', { headers });
      console.log(`✓ Payments export works: ${exportResponse.data.length} characters`);
    } catch (error) {
      console.log(`❌ Payments export error: ${error.response?.status} ${error.response?.statusText}`);
      console.log(`   Error details:`, error.response?.data);
    }

    // Check if payments table exists
    console.log('\n🗄️ Checking payments table...');
    try {
      const db = require('./config/db');
      const [result] = await db.query('SELECT COUNT(*) as count FROM payments');
      console.log(`✓ Payments table exists with ${result[0].count} records`);
    } catch (error) {
      console.log(`❌ Payments table error: ${error.message}`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testPaymentsEndpoint();