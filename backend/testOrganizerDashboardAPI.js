const axios = require('axios');

// Test the actual organizer dashboard API endpoints
async function testOrganizerDashboardAPI() {
  try {
    console.log('🧪 Testing Organizer Dashboard API Endpoints...\n');
    
    const baseURL = 'http://localhost:3000/api';
    
    // First login as organizer to get token
    console.log('1. Logging in as organizer...');
    const loginResponse = await axios.post(`${baseURL}/auth/login`, {
      email: 'organizer@example.com',
      password: 'organizer123'
    });
    
    const token = loginResponse.data.token;
    const headers = { Authorization: `Bearer ${token}` };
    
    console.log('✅ Login successful');
    
    // Test organizer analytics endpoint
    console.log('\n2. Testing /api/analytics/organizer endpoint...');
    const analyticsResponse = await axios.get(`${baseURL}/analytics/organizer`, { headers });
    const analytics = analyticsResponse.data;
    
    console.log('📊 Organizer Analytics Results:');
    console.log('Events:', analytics.myEvents);
    console.log('Bookings:', analytics.myBookings);
    console.log('Revenue:', analytics.myRevenue);
    console.log('Event Analytics Count:', analytics.eventAnalytics.length);
    
    // Verify the fixes
    console.log('\n3. Verifying Fixed Issues:');
    
    // Check event status breakdown
    if (analytics.myEvents.upcoming !== undefined && analytics.myEvents.completed !== undefined) {
      console.log('✅ Event status breakdown is working (upcoming, ongoing, completed, cancelled)');
      console.log(`   - Upcoming: ${analytics.myEvents.upcoming}`);
      console.log(`   - Ongoing: ${analytics.myEvents.ongoing}`);
      console.log(`   - Completed: ${analytics.myEvents.completed}`);
      console.log(`   - Cancelled: ${analytics.myEvents.cancelled}`);
    } else {
      console.log('❌ Event status breakdown is NOT working');
    }
    
    // Check feedback/rating availability
    const hasRatings = analytics.eventAnalytics.some(event => event.average_rating != null);
    if (hasRatings) {
      console.log('✅ Feedback/ratings are displaying correctly');
      analytics.eventAnalytics.forEach(event => {
        if (event.average_rating) {
          console.log(`   - Event ${event.id}: ${event.title} has ${event.feedback_count} feedback(s) with avg rating ${event.average_rating}`);
        }
      });
    } else {
      console.log('❌ Feedback/ratings are still not displaying');
    }
    
    // Check event and booking IDs presence
    const hasEventIds = analytics.eventAnalytics.every(event => event.id);
    if (hasEventIds) {
      console.log('✅ Event IDs are present in analytics');
    } else {
      console.log('❌ Event IDs are missing in analytics');
    }
    
    // Test CSV export endpoint
    console.log('\n4. Testing CSV Export with Event IDs...');
    try {
      const csvResponse = await axios.get(`${baseURL}/bookings/export-csv`, { headers });
      if (csvResponse.data.includes('EventID') && csvResponse.data.includes('BookingID')) {
        console.log('✅ CSV export includes both Event ID and Booking ID');
      } else {
        console.log('❌ CSV export is missing Event ID or Booking ID');
      }
    } catch (csvError) {
      console.log('⚠️ CSV export test failed:', csvError.response?.data?.message || csvError.message);
    }
    
    console.log('\n🎉 Dashboard testing completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testOrganizerDashboardAPI();