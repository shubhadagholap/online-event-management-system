const axios = require('axios');

async function testCompleteDashboard() {
  try {
    console.log('🔐 Testing Complete Dashboard Functionality...\n');

    // Test 1: Login as admin
    console.log('1. Testing Admin Login...');
    const adminLogin = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    const adminToken = adminLogin.data.token;
    console.log('✓ Admin login successful');

    // Test 2: Admin Dashboard Stats
    console.log('\n2. Testing Admin Dashboard Stats...');
    const adminStats = await axios.get('http://localhost:5000/api/bookings/dashboard/stats', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    console.log('✓ Admin Stats:', JSON.stringify(adminStats.data, null, 2));

    // Test 3: Login as organizer
    console.log('\n3. Testing Organizer Login...');
    const organizerLogin = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'bgm@gmail.com',
      password: 'bgm123'
    });
    const organizerToken = organizerLogin.data.token;
    console.log('✓ Organizer login successful');

    // Test 4: Organizer Dashboard Stats
    console.log('\n4. Testing Organizer Dashboard Stats...');
    const organizerStats = await axios.get('http://localhost:5000/api/bookings/dashboard/stats', {
      headers: { 'Authorization': `Bearer ${organizerToken}` }
    });
    console.log('✓ Organizer Stats:', JSON.stringify(organizerStats.data, null, 2));

    // Test 5: Login as regular user
    console.log('\n5. Testing User Login...');
    const userLogin = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'jyoti@gmail.com',
      password: 'jyoti123'
    });
    const userToken = userLogin.data.token;
    console.log('✓ User login successful');

    // Test 6: User Dashboard Stats
    console.log('\n6. Testing User Dashboard Stats...');
    const userStats = await axios.get('http://localhost:5000/api/bookings/dashboard/stats', {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    console.log('✓ User Stats:', JSON.stringify(userStats.data, null, 2));

    // Test 7: Verify data consistency
    console.log('\n7. Verifying Data Consistency...');
    
    // Check if admin totals make sense
    const adminData = adminStats.data;
    const totalBookingsByStatus = adminData.pendingBookings + adminData.confirmedBookings + adminData.cancelledBookings;
    
    console.log(`Admin Total Bookings: ${adminData.totalBookings}`);
    console.log(`Sum of Status Counts: ${totalBookingsByStatus}`);
    console.log(`Match: ${adminData.totalBookings === totalBookingsByStatus ? '✓' : '❌'}`);
    
    const totalEventsByStatus = adminData.upcomingEvents + adminData.completedEvents;
    console.log(`Admin Total Events: ${adminData.totalEvents}`);
    console.log(`Upcoming + Completed: ${totalEventsByStatus}`);
    console.log(`Events consistency: ${totalEventsByStatus <= adminData.totalEvents ? '✓' : '❌'}`);

    // Test 8: Test unauthorized access
    console.log('\n8. Testing Unauthorized Access...');
    try {
      await axios.get('http://localhost:5000/api/bookings/dashboard/stats');
      console.log('❌ Unauthorized access should have failed');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✓ Unauthorized access properly blocked');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }

    console.log('\n🎉 All dashboard tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testCompleteDashboard();