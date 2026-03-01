const axios = require('axios');

async function testHomePageAdmin() {
  try {
    console.log('Testing home page admin functionality...\n');
    
    // Test admin login
    const adminLogin = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    console.log('✅ Admin logged in successfully');
    console.log('Admin user:', adminLogin.data.user);
    
    const adminToken = adminLogin.data.token;
    
    // Test dashboard stats endpoint (what the home page will call)
    const statsResponse = await axios.get('http://localhost:5000/api/bookings/dashboard/stats', {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Cache-Control': 'no-cache'
      }
    });
    
    console.log('\n=== ADMIN STATS FOR HOME PAGE ===');
    console.log('Status:', statsResponse.status);
    const stats = statsResponse.data;
    
    console.log('📊 Stats that will show on home page:');
    console.log(`  📅 Total Events: ${stats.totalEvents}`);
    console.log(`  👥 Total Users: ${stats.totalUsers}`);
    console.log(`  🎫 Total Bookings: ${stats.totalBookings}`);
    console.log(`  💰 Total Revenue: $${(parseFloat(stats.totalRevenue) || 0).toFixed(2)}`);
    
    if (stats.pendingBookings > 0) {
      console.log(`  ⚠️  Pending Bookings: ${stats.pendingBookings}`);
    }
    
    // Test events endpoint (for the events section)
    const eventsResponse = await axios.get('http://localhost:5000/api/events?status=upcoming', {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    
    console.log(`\n📅 Upcoming Events: ${eventsResponse.data.length} events`);
    console.log('First 3 events:');
    eventsResponse.data.slice(0, 3).forEach((event, index) => {
      console.log(`  ${index + 1}. ${event.title} - ${event.date}`);
    });
    
    console.log('\n✅ Home page admin functionality should work correctly!');
    console.log('\nTo test:');
    console.log('1. Login as admin@gmail.com / admin123');
    console.log('2. Visit http://localhost:3000/');
    console.log('3. You should see the admin overview section with stats and quick actions');
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testHomePageAdmin();