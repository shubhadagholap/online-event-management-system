const axios = require('axios');
const bcrypt = require('bcrypt');

async function testWithRealOrganizers() {
  try {
    console.log('Testing with organizers who actually have bookings...\n');
    
    // Test John Organizer (should have 1 booking)
    console.log('=== TESTING JOHN ORGANIZER ===');
    const johnLogin = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'organizer@example.com',
      password: 'organizer123'
    });
    
    console.log('✅ John Organizer logged in successfully');
    console.log('User info:', johnLogin.data.user);
    
    const johnToken = johnLogin.data.token;
    
    // Test organizer bookings endpoint
    const johnBookings = await axios.get('http://localhost:5000/api/bookings/organizer/bookings', {
      headers: {
        'Authorization': `Bearer ${johnToken}`,
        'Cache-Control': 'no-cache'
      }
    });
    
    console.log('John Organizer bookings:');
    console.log('Status:', johnBookings.status);
    console.log('Count:', johnBookings.data.length);
    console.log('Data:', JSON.stringify(johnBookings.data, null, 2));
    
    // Test dashboard stats
    const johnStats = await axios.get('http://localhost:5000/api/bookings/dashboard/stats', {
      headers: {
        'Authorization': `Bearer ${johnToken}`,
        'Cache-Control': 'no-cache'
      }
    });
    
    console.log('\nJohn Organizer dashboard stats:');
    console.log('Data:', JSON.stringify(johnStats.data, null, 2));
    
    // Test prerana (should have 1 booking)
    console.log('\n=== TESTING PRERANA ===');
    const preranaLogin = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'prerana343@gmail.com',
      password: 'prerana123'
    });
    
    console.log('✅ prerana logged in successfully');
    console.log('User info:', preranaLogin.data.user);
    
    const preranaToken = preranaLogin.data.token;
    
    // Test organizer bookings endpoint
    const preranaBookings = await axios.get('http://localhost:5000/api/bookings/organizer/bookings', {
      headers: {
        'Authorization': `Bearer ${preranaToken}`,
        'Cache-Control': 'no-cache'
      }
    });
    
    console.log('prerana bookings:');
    console.log('Status:', preranaBookings.status);
    console.log('Count:', preranaBookings.data.length);
    console.log('Data:', JSON.stringify(preranaBookings.data, null, 2));
    
    // Test dashboard stats
    const preranaStats = await axios.get('http://localhost:5000/api/bookings/dashboard/stats', {
      headers: {
        'Authorization': `Bearer ${preranaToken}`,
        'Cache-Control': 'no-cache'
      }
    });
    
    console.log('\nprerana dashboard stats:');
    console.log('Data:', JSON.stringify(preranaStats.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
    }
  }
}

testWithRealOrganizers();