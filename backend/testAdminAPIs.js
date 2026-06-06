const axios = require('axios');

async function testAdminAPIs() {
  try {
    console.log('🧪 Testing Admin APIs after fixes...\n');
    
    const baseURL = 'http://localhost:5000/api';
    
    // Login with fixed admin credentials
    const loginResponse = await axios.post(`${baseURL}/auth/login`, {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    const headers = { Authorization: `Bearer ${token}` };
    const user = loginResponse.data.user;
    
    console.log(`✅ Login successful - ${user.name} (ID: ${user.id})`);
    
    // Test feedback endpoint
    console.log('\n📝 Testing Feedback Endpoint:');
    const feedbackResponse = await axios.get(`${baseURL}/feedback/organizer/feedback`, { headers });
    const feedback = feedbackResponse.data;
    
    console.log(`✅ Feedback API: ${feedback.length} entries found`);
    if (feedback.length > 0) {
      console.log('Sample feedback:');
      feedback.slice(0, 3).forEach(fb => {
        console.log(`  - ${fb.event_title}: ${fb.rating}★ by ${fb.user_name}`);
      });
    }
    
    // Test notifications endpoint
    console.log('\n🔔 Testing Notifications Endpoint:');
    const notificationsResponse = await axios.get(`${baseURL}/notifications`, { headers });
    const notifications = notificationsResponse.data;
    
    console.log(`✅ Notifications API: ${notifications.length} entries found`);
    if (notifications.length > 0) {
      console.log('Sample notifications:');
      notifications.slice(0, 2).forEach(notif => {
        console.log(`  - ${notif.subject}: ${notif.message.substring(0, 50)}...`);
      });
    }
    
    // Test analytics endpoint
    console.log('\n📊 Testing Analytics Endpoint:');
    const analyticsResponse = await axios.get(`${baseURL}/analytics/admin`, { headers });
    const analytics = analyticsResponse.data;
    
    console.log('✅ Analytics API working');
    console.log(`  Events: ${analytics.events?.total_events || 'N/A'}`);
    console.log(`  Bookings: ${analytics.bookings?.total_bookings || 'N/A'}`);
    console.log(`  Revenue: ₹${analytics.revenue?.total_revenue || '0'}`);
    
    console.log('\n🎉 All Admin APIs are working correctly!');
    console.log('\n📋 Frontend should now show:');
    console.log(`✅ Feedback & Ratings: ${feedback.length} feedback entries`);
    console.log(`✅ Notifications: ${notifications.length} notifications`);
    console.log('✅ Dashboard: Complete analytics data');
    
  } catch (error) {
    console.error('❌ API test failed:', error.response?.data || error.message);
  }
}

testAdminAPIs();