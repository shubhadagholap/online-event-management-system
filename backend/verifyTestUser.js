const axios = require('axios');

(async () => {
  try {
    // Test login as user 5 (testuser@example.com) who has 1 certificate
    console.log('Testing login as testuser (who has certificates)...\n');
    const login = await axios.post('http://localhost:5000/api/auth/login', { 
      email: 'testuser@example.com', 
      password: 'test123' 
    });
    const token = login.data.token;
    console.log(`✓ Logged in as: ${login.data.user.name} (ID: ${login.data.user.id})`);

    // Fetch certificates
    const resp = await axios.get('http://localhost:5000/api/certificates', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log(`✓ API returned ${resp.data.length} certificate(s)\n`);
    resp.data.forEach(cert => {
      console.log(`Certificate: ${cert.certificate_number}`);
      console.log(`  Event: ${cert.event_title}`);
      console.log(`  Issued: ${new Date(cert.issued_at).toLocaleDateString()}`);
      console.log(`  PDF URL: ${cert.pdf_url}`);
      console.log('');
    });

    process.exit(0);
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
    process.exit(1);
  }
})();
