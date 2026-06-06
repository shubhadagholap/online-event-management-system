const axios = require('axios');

async function testCSVExport() {
  try {
    const baseURL = 'http://localhost:5000/api';
    
    // Login as admin
    const loginResponse = await axios.post(`${baseURL}/auth/login`, {
      email: 'admin@example.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    const headers = { Authorization: `Bearer ${token}` };
    
    console.log('✅ Admin login successful');
    
    // Test CSV export
    const csvResponse = await axios.get(`${baseURL}/bookings/export`, { 
      headers,
      responseType: 'text'
    });
    
    console.log('✅ CSV Export successful!');
    console.log('Response headers:', csvResponse.headers['content-type']);
    console.log('First 200 characters of CSV:');
    console.log(csvResponse.data.substring(0, 200));
    
    // Check if it has the fixed headers
    if (csvResponse.data.includes('EventID') && csvResponse.data.includes('BookingID')) {
      console.log('✅ CSV includes both Event ID and Booking ID in headers');
    } else {
      console.log('❌ CSV missing required ID headers');
    }
    
  } catch (error) {
    console.error('❌ CSV Export test failed:', error.response?.data || error.message);
  }
}

testCSVExport();