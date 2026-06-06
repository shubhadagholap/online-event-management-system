const axios = require('axios');

async function testLogin() {
  try {
    const baseURL = 'http://localhost:5000/api';
    
    console.log('Testing admin login...');
    const loginResponse = await axios.post(`${baseURL}/auth/login`, {
      email: 'admin@example.com',
      password: 'admin123'
    });
    
    console.log('✅ Admin login successful!');
    console.log('Token length:', loginResponse.data.token.length);
    console.log('User:', loginResponse.data.user);
    
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    
    // Try with the working organizer credentials
    console.log('\nTrying organizer login...');
    try {
      const orgResponse = await axios.post(`${baseURL}/auth/login`, {
        email: 'organizer@example.com',
        password: 'organizer123'
      });
      
      console.log('✅ Organizer login successful!');
      console.log('User:', orgResponse.data.user);
      
    } catch (orgError) {
      console.error('❌ Organizer login also failed:', orgError.response?.data || orgError.message);
    }
  }
}

testLogin();