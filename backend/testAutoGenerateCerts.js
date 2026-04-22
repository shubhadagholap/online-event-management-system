const db = require('./config/db');
const jwt = require('jsonwebtoken');
const http = require('http');

async function testAutoGenerate() {
  console.log('='.repeat(60));
  console.log('TESTING CERTIFICATE AUTO-GENERATION API');
  console.log('='.repeat(60));

  try {
    // 1. Get organizer and create token
    const [organizers] = await db.query('SELECT * FROM users WHERE email = "organizer@example.com"');
    const organizer = organizers[0];
    
    const token = jwt.sign(
      { id: organizer.id, email: organizer.email, role: organizer.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    console.log('\n✓ Generated auth token for organizer');

    // 2. Get event ID
    const [events] = await db.query('SELECT id, title FROM events WHERE organizer_id = ? LIMIT 1', [organizer.id]);
    const event = events[0];
    console.log(`✓ Testing with event: ${event.title} (ID: ${event.id})`);

    // 3. Make API request
    console.log('\n3. Calling auto-generate API...');
    
    const postData = JSON.stringify({ event_id: event.id });
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/certificates/organizer/auto-generate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const result = await new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch {
            resolve({ status: res.statusCode, data: body });
          }
        });
      });
      
      req.on('error', reject);
      req.write(postData);
      req.end();
    });

    console.log(`\nAPI Response (${result.status}):`);
    console.log(JSON.stringify(result.data, null, 2));

    if (result.status === 200) {
      console.log('\n✓ SUCCESS! Certificates generated');
      
      // Verify in database
      const [certs] = await db.query(
        'SELECT COUNT(*) as count FROM certificates WHERE event_id = ?',
        [event.id]
      );
      console.log(`✓ Total certificates in database: ${certs[0].count}`);
    } else {
      console.log('\n✗ Failed to generate certificates');
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit();
  }
}

testAutoGenerate();
