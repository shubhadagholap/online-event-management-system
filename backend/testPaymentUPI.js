const axios = require('axios');
(async () => {
  try {
    const login = await axios.post('http://localhost:5000/api/auth/login', { email: 'admin@example.com', password: 'admin123' });
    const token = login.data.token;
    console.log('token', token && token.slice ? token.slice(0, 20) + '...' : token);

    const payload = {
      booking_id: 1,
      event_id: 1,
      amount: 150.50,
      payment_method: 'upi',
      payer_name: 'Test Payer',
      upi_id: 'testpayer@upi'
    };

    const resp = await axios.post('http://localhost:5000/api/payments', payload, { headers: { Authorization: `Bearer ${token}` } });
    console.log('payment response', resp.data);
  } catch (err) {
    console.error('error', err.response?.data || err.message);
  }
})();
