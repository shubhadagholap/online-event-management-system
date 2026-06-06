const axios = require('axios');

async function testFeedbackAPI() {
  try {
    console.log('🧪 Testing Feedback API Directly...\n');
    
    const baseURL = 'http://localhost:5000/api';
    
    // Test with admin@gmail.com (the one with 19 feedback entries)
    console.log('1. Testing with admin@gmail.com (should have 19 feedback):');
    
    const loginResponse = await axios.post(`${baseURL}/auth/login`, {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    const headers = { Authorization: `Bearer ${token}` };
    const user = loginResponse.data.user;
    
    console.log(`✅ Login successful - ${user.name} (ID: ${user.id})`);
    
    // Test the exact endpoint the frontend uses
    const feedbackResponse = await axios.get(`${baseURL}/feedback/organizer/feedback`, { headers });
    console.log(`✅ Organizer Feedback API: ${feedbackResponse.data.length} entries`);
    
    if (feedbackResponse.data.length > 0) {
      console.log('Sample feedback:');
      feedbackResponse.data.slice(0, 3).forEach(fb => {
        console.log(`  - ${fb.event_title}: ${fb.rating}★ by ${fb.user_name} - "${fb.comment?.substring(0, 50)}..."`);
      });
    } else {
      console.log('❌ No feedback returned by API - this is the problem!');
    }
    
    // Also test the user's own feedback
    const myFeedbackResponse = await axios.get(`${baseURL}/feedback/my-feedback`, { headers });
    console.log(`📝 My Feedback API: ${myFeedbackResponse.data.length} entries`);
    
    // Test if the API is working but frontend is calling wrong endpoint
    console.log('\n2. Testing all possible feedback endpoints:');
    
    // Test if there are any other feedback endpoints
    try {
      const allFeedback = await axios.get(`${baseURL}/feedback/event/1`, { headers });
      console.log(`Event Feedback API: ${allFeedback.data.length} entries`);
    } catch (e) {
      console.log('Event feedback endpoint test failed (expected)');
    }
    
    console.log('\n3. Frontend should call:');
    console.log('URL: GET /api/feedback/organizer/feedback');
    console.log('Headers: Authorization: Bearer [token]');
    console.log(`Expected result: ${feedbackResponse.data.length} feedback entries`);
    
    if (feedbackResponse.data.length === 0) {
      console.log('\n🔧 ISSUE IDENTIFIED: API returns 0 entries despite database having 19 entries');
      console.log('This suggests an issue with the organizer feedback query or user matching.');
    } else {
      console.log('\n✅ API IS WORKING: Returns correct feedback entries');
      console.log('Issue is likely in frontend authentication or API call setup.');
    }
    
  } catch (error) {
    console.error('❌ API test failed:', error.response?.data || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n🚨 SOLUTION: Backend server is not running!');
      console.log('Start the backend: cd backend && node server.js');
    } else if (error.response?.status === 401) {
      console.log('\n🚨 SOLUTION: Authentication failed!');
      console.log('Check admin credentials or session expired');
    }
  }
}

testFeedbackAPI();