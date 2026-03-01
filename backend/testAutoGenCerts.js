const axios = require('axios');

(async () => {
  try {
    // login as admin (to test organizer endpoint)
    const login = await axios.post('http://localhost:5000/api/auth/login', { 
      email: 'admin@example.com', 
      password: 'admin123' 
    });
    const token = login.data.token;
    console.log('logged in as:', login.data.user.name);
      
    // trigger auto-generate for event 1 (should have confirmed bookings)
    const resp = await axios.post(
      'http://localhost:5000/api/certificates/organizer/auto-generate',
      { event_id: 1 },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('auto-generate response:', resp.data);
  } catch (err) {
    console.error('error:', err.response?.data || err.message);
  }
})();
