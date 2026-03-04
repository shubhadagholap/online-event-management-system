const axios = require('axios');
const db = require('./config/db');

(async () => {
  try {
    // Login as admin
    console.log('Logging in as admin...');
    const login = await axios.post('http://localhost:5000/api/auth/login', { 
      email: 'admin@example.com', 
      password: 'admin123' 
    });
    const token = login.data.token;
    console.log(`✓ Logged in as: ${login.data.user.name} (ID: ${login.data.user.id})\n`);

    // Check admin's certificates in DB
    const [adminCerts] = await db.query(
      `SELECT * FROM certificates WHERE user_id = 1`
    );
    console.log(`Admin has ${adminCerts.length} certificates in DB`);

    // Call API to fetch certificates
    console.log('Calling API /certificates...');
    const resp = await axios.get('http://localhost:5000/api/certificates', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✓ API returned ${resp.data.length} certificates for admin`);
    if (resp.data.length > 0) {
      resp.data.forEach(cert => {
        console.log(`  - ${cert.certificate_number} (${cert.event_title}): ${cert.pdf_url}`);
      });
    }

    // Now check if there are any non-PDF paths in the certificates table (corruption)
    console.log('\nChecking for corrupted pdf_url values...');
    const [allCerts] = await db.query('SELECT id, user_id, pdf_url FROM certificates');
    const corrupted = allCerts.filter(c => !c.pdf_url.startsWith('/certificates/'));
    if (corrupted.length > 0) {
      console.log(`⚠ Found ${corrupted.length} corrupted records:`);
      corrupted.forEach(c => {
        console.log(`  - Cert ID ${c.id} (user ${c.user_id}): "${c.pdf_url.substring(0, 50)}..."`);
      });
    } else {
      console.log('✓ All pdf_url values look valid');
    }

    process.exit(0);
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
    process.exit(1);
  }
})();
