const axios = require('axios');

async function testFrontendConnection() {
  try {
    console.log('🔗 Testing Frontend-Backend Connection...\n');
    
    const baseURL = 'http://localhost:5000/api';
    
    // 1. Test server health
    console.log('1. Testing server health...');
    const healthResponse = await axios.get(`${baseURL}/health`);
    console.log(`✅ Server is running: ${healthResponse.data.message}`);
    
    // 2. Test login (same as frontend would do)
    console.log('\n2. Testing admin login...');
    const loginResponse = await axios.post(`${baseURL}/auth/login`, {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    const headers = { Authorization: `Bearer ${token}` };
    const user = loginResponse.data.user;
    
    console.log(`✅ Login successful - ${user.name} (Role: ${user.role}, ID: ${user.id})`);
    
    // 3. Test the exact API call that frontend makes
    console.log('\n3. Testing feedback API (exact frontend call)...');
    const feedbackResponse = await axios.get(`${baseURL}/feedback/organizer/feedback`, { headers });
    
    console.log(`✅ Feedback API Response: ${feedbackResponse.data.length} entries`);
    
    if (feedbackResponse.data.length > 0) {
      console.log('Sample feedback data structure:');
      const sample = feedbackResponse.data[0];
      console.log({
        id: sample.id,
        event_title: sample.event_title,
        user_name: sample.user_name,
        rating: sample.rating,
        comment: sample.comment?.substring(0, 30) + '...'
      });
    }
    
    // 4. Simulate the exact frontend scenario
    console.log('\n4. Frontend Scenario Simulation:');
    console.log('Frontend should:');
    console.log('- Call POST /auth/login with admin@gmail.com / admin123');
    console.log('- Store token and user info in localStorage');
    console.log('- Call GET /feedback/organizer/feedback with Authorization header');
    console.log(`- Receive ${feedbackResponse.data.length} feedback entries`);
    console.log('- Display them in the "Feedback on My Events" tab');
    
    // 5. Check CORS headers
    console.log('\n5. CORS Headers Check:');
    console.log(`Access-Control-Allow-Origin: ${feedbackResponse.headers['access-control-allow-origin'] || 'Not set'}`);
    
    console.log('\n🎉 Backend is ready for frontend connection!');
    console.log('\n📋 Troubleshooting steps for frontend:');
    console.log('1. Clear browser cache and localStorage');
    console.log('2. Login with: admin@gmail.com / admin123');
    console.log('3. Check browser Network tab for API calls');
    console.log('4. Verify Console for any JavaScript errors');
    console.log(`5. API should return ${feedbackResponse.data.length} feedback entries`);
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.response?.data || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n🚨 SOLUTION: Backend server is not running!');
      console.log('Start it with: cd backend && node server.js');
    }
  }
}

testFrontendConnection();