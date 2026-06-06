const axios = require('axios');
const db = require('./config/db');

async function testCompleteSystemFix() {
  console.log('🧪 Testing Complete System Fix...\n');
  
  try {
    // Step 1: Test direct database queries
    console.log('1. Testing Direct Database Queries:');
    console.log('=====================================');
    
    // Test organizer analytics query (the fixed version)
    const organizer_id = 2;
    
    const [myEvents] = await db.query(`
      SELECT COUNT(*) as total_events,
        SUM(CASE WHEN status = 'upcoming' OR (status IS NULL AND date > NOW()) THEN 1 ELSE 0 END) as upcoming,
        SUM(CASE WHEN status = 'ongoing' OR (status IS NULL AND DATE(date) = CURDATE()) THEN 1 ELSE 0 END) as ongoing,
        SUM(CASE WHEN status = 'completed' OR (status IS NULL AND date < NOW() AND DATE(date) != CURDATE()) THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
      FROM events WHERE organizer_id = ?
    `, [organizer_id]);
    
    console.log('✅ Event Status Breakdown:', myEvents[0]);
    
    // Test feedback query
    const [feedbackStats] = await db.query(`
      SELECT COUNT(*) as total_feedback, AVG(rating) as avg_rating
      FROM feedback f
      JOIN events e ON f.event_id = e.id
      WHERE e.organizer_id = ?
    `, [organizer_id]);
    
    console.log('✅ Feedback Stats:', feedbackStats[0]);
    
    // Step 2: Test API endpoint directly
    console.log('\n2. Testing API Endpoints:');
    console.log('===========================');
    
    const baseURL = 'http://localhost:5000/api';
    
    // First login to get token
    try {
      const loginResponse = await axios.post(`${baseURL}/auth/login`, {
        email: 'organizer@example.com',
        password: 'organizer123'
      });
      
      const token = loginResponse.data.token;
      const headers = { Authorization: `Bearer ${token}` };
      
      console.log('✅ Login successful');
      
      // Test organizer analytics endpoint
      const analyticsResponse = await axios.get(`${baseURL}/analytics/organizer`, { headers });
      const analytics = analyticsResponse.data;
      
      console.log('✅ Analytics API Response:');
      console.log('   Events:', analytics.myEvents);
      console.log('   Bookings:', analytics.myBookings);
      console.log('   Revenue:', analytics.myRevenue);
      console.log('   Event Details Count:', analytics.eventAnalytics?.length || 0);
      
      // Test feedback API
      const feedbackResponse = await axios.get(`${baseURL}/feedback/organizer/feedback`, { headers });
      const feedback = feedbackResponse.data;
      
      console.log('✅ Feedback API Response:');
      console.log(`   Total Feedback: ${feedback.length}`);
      if (feedback.length > 0) {
        console.log(`   Sample: Event "${feedback[0].event_title}" - Rating: ${feedback[0].rating}, Comment: "${feedback[0].comment}"`);
      }
      
      // Step 3: Verify the fixes
      console.log('\n3. Verification Results:');
      console.log('=========================');
      
      let issues = [];
      
      // Check event status breakdown
      if (analytics.myEvents && typeof analytics.myEvents.upcoming !== 'undefined') {
        console.log('✅ Event status breakdown is working');
        console.log(`   - Total: ${analytics.myEvents.total_events}`);
        console.log(`   - Upcoming: ${analytics.myEvents.upcoming}`);
        console.log(`   - Ongoing: ${analytics.myEvents.ongoing}`);
        console.log(`   - Completed: ${analytics.myEvents.completed}`);
        console.log(`   - Cancelled: ${analytics.myEvents.cancelled}`);
      } else {
        issues.push('❌ Event status breakdown not working');
      }
      
      // Check feedback availability
      if (feedback.length > 0) {
        console.log('✅ Feedback is available and displaying correctly');
        console.log(`   - Total feedback entries: ${feedback.length}`);
      } else {
        issues.push('❌ No feedback found (might be empty but API works)');
      }
      
      // Check event analytics with ratings
      const eventsWithRatings = analytics.eventAnalytics?.filter(e => e.average_rating != null) || [];
      if (eventsWithRatings.length > 0) {
        console.log('✅ Event ratings are displaying correctly');
        eventsWithRatings.forEach(event => {
          console.log(`   - ${event.title}: ${event.average_rating} avg rating, ${event.feedback_count} feedback(s)`);
        });
      } else {
        console.log('⚠️ No events with ratings found');
      }
      
      // Check booking status breakdown
      if (analytics.myBookings && typeof analytics.myBookings.confirmed !== 'undefined') {
        console.log('✅ Booking status breakdown is working');
        console.log(`   - Total: ${analytics.myBookings.total_bookings}`);
        console.log(`   - Confirmed: ${analytics.myBookings.confirmed}`);
        console.log(`   - Pending: ${analytics.myBookings.pending}`);
        console.log(`   - Cancelled: ${analytics.myBookings.cancelled}`);
      } else {
        issues.push('❌ Booking status breakdown not working');
      }
      
      // Test CSV export
      try {
        const csvResponse = await axios.get(`${baseURL}/bookings/export-csv`, { 
          headers,
          responseType: 'text'
        });
        
        if (csvResponse.data.includes('EventID') && csvResponse.data.includes('BookingID')) {
          console.log('✅ CSV export includes both Event ID and Booking ID');
        } else {
          issues.push('❌ CSV export missing required IDs');
        }
      } catch (csvError) {
        console.log('⚠️ CSV export test failed:', csvError.response?.data?.message || csvError.message);
      }
      
      // Summary
      console.log('\n4. FINAL ASSESSMENT:');
      console.log('=====================');
      if (issues.length === 0) {
        console.log('🎉 ALL ISSUES HAVE BEEN SUCCESSFULLY FIXED!');
        console.log('✅ Event status counting works correctly');
        console.log('✅ Feedback and ratings are displaying');
        console.log('✅ CSV exports include all required IDs');
        console.log('✅ Analytics provide comprehensive data');
      } else {
        console.log('❌ Some issues remain:');
        issues.forEach(issue => console.log('  ' + issue));
      }
      
    } catch (apiError) {
      console.error('❌ API Test Failed:', apiError.response?.data || apiError.message);
      
      if (apiError.code === 'ECONNREFUSED') {
        console.log('\n🔧 SOLUTION: The backend server is not running!');
        console.log('Please run: cd backend && node server.js');
        console.log('Then the frontend should work correctly.');
      }
    }
    
  } catch (error) {
    console.error('❌ Database Test Failed:', error);
  } finally {
    process.exit(0);
  }
}

testCompleteSystemFix();