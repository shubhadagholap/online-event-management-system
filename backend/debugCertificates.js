const axios = require('axios');
const db = require('./config/db');

(async () => {
  try {
    console.log('=== Checking certificates in database ===');
    const [certs] = await db.query(
      `SELECT c.*, u.name as user_name, e.title as event_title 
       FROM certificates c 
       JOIN users u ON c.user_id = u.id 
       JOIN events e ON c.event_id = e.id
       LIMIT 5`
    );
    
    console.log('Certificates in DB:');
    certs.forEach(cert => {
      console.log(`  - Cert ID ${cert.id}: user=${cert.user_name} (uid=${cert.user_id}), event="${cert.event_title}", file=${cert.pdf_url}`);
    });

    if (certs.length === 0) {
      console.log('  No certificates found in database!');
      process.exit(0);
    }

    // Get first certificate's user ID
    const testUserId = certs[0].user_id;
    const testUserEmail = certs[0].user_id === 1 ? 'admin@example.com' : 'user@example.com';

    console.log(`\n=== Testing API as user ID ${testUserId} ===`);
    
    // Try login
    try {
      const login = await axios.post('http://localhost:5000/api/auth/login', { 
        email: testUserEmail, 
        password: 'admin123' 
      });
      const token = login.data.token;
      console.log(`Logged in as: ${login.data.user.name} (ID: ${login.data.user.id})`);
      
      // Fetch certificates via API
      const resp = await axios.get('http://localhost:5000/api/certificates', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(`API returned ${resp.data.length} certificates`);
      resp.data.slice(0, 3).forEach(cert => {
        console.log(`  - ${cert.certificate_number} for event "${cert.event_title}"`);
      });
    } catch (loginErr) {
      console.error('Login failed:', loginErr.response?.data || loginErr.message);
    }

    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
