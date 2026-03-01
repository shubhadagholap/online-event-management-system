const axios = require('axios');

(async () => {
  try {
    const login = await axios.post('http://localhost:5000/api/auth/login', {email:'admin@example.com', password:'admin123'});
    const token = login.data.token;
    console.log('token', token.slice(0,20)+'...');
    try {
      // first try with invalid ID (should produce error), then a valid one
      try {
        const resp = await axios.post('http://localhost:5000/api/payments', {booking_id:9999,event_id:1,amount:100,payment_method:'card'}, {headers:{Authorization:`Bearer ${token}`}});
        console.log('payment response (should not happen)', resp.data);
      } catch(err) {
        console.error('expected error for invalid booking:', err.response?.data || err.message);
      }
      
      // now valid booking (make sure booking 1 exists in your DB)
      const resp2 = await axios.post('http://localhost:5000/api/payments', {booking_id:1,event_id:1,amount:100,payment_method:'card'}, {headers:{Authorization:`Bearer ${token}`}});
      console.log('payment response success', resp2.data);
    } catch(e) {
      console.error('create payment error', e.response?.data || e.message);
    }
  } catch(e) {
    console.error('login error', e.response?.data || e.message);
  }
})();
