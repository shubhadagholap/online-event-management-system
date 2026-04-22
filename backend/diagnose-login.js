const mysql = require('mysql2/promise');
const http = require('http');

async function testHTTP(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: method,
      headers: { 'Content-Type': 'application/json' }
    };
    
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
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function diagnoseLogin() {
  console.log('='.repeat(60));
  console.log('LOGIN DIAGNOSTIC TOOL');
  console.log('='.repeat(60));
  
  // 1. Check Database Connection
  console.log('\n1. Testing Database Connection...');
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'event_management'
    });
    console.log('✓ Database connected successfully');
    
    // Check users table
    const [users] = await connection.query('SELECT id, email, role FROM users LIMIT 5');
    console.log(`✓ Found ${users.length} users in database`);
    users.forEach(u => console.log(`  - ${u.email} (${u.role})`));
    
    await connection.end();
  } catch (error) {
    console.error('✗ Database Error:', error.message);
    return;
  }
  
  // 2. Check Backend Server
  console.log('\n2. Testing Backend Server...');
  try {
    const result = await testHTTP('http://localhost:5000/api/health');
    console.log('✓ Backend server is running');
    console.log('  Response:', result.data.message);
  } catch (error) {
    console.error('✗ Backend Server Error:', error.message);
    console.error('  Make sure backend is running: cd backend && node server.js');
    return;
  }
  
  // 3. Test Login Endpoint
  console.log('\n3. Testing Login Endpoint...');
  const testCredentials = [
    { email: 'admin@example.com', password: 'admin123', role: 'admin' },
    { email: 'organizer@example.com', password: 'organizer123', role: 'organizer' },
    { email: 'user@example.com', password: 'user123', role: 'user' }
  ];
  
  for (const cred of testCredentials) {
    try {
      const result = await testHTTP('http://localhost:5000/api/auth/login', 'POST', {
        email: cred.email,
        password: cred.password
      });
      
      if (result.status === 200 && result.data.token) {
        console.log(`✓ ${cred.role.toUpperCase()} login successful`);
        console.log(`  Email: ${cred.email}`);
        console.log(`  Token: ${result.data.token.substring(0, 30)}...`);
      } else {
        console.error(`✗ ${cred.role.toUpperCase()} login failed`);
        console.error(`  Status: ${result.status}`);
        console.error(`  Message: ${result.data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error(`✗ ${cred.role.toUpperCase()} login failed`);
      console.error(`  Email: ${cred.email}`);
      console.error(`  Error: ${error.message}`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('DIAGNOSIS COMPLETE');
  console.log('='.repeat(60));
  console.log('\nCommon Issues & Solutions:');
  console.log('1. Frontend not connecting to backend:');
  console.log('   - Check browser console (F12) for CORS errors');
  console.log('   - Verify API_URL in frontend/src/services/api.js');
  console.log('   - Make sure both servers are running');
  console.log('\n2. Login credentials not working:');
  console.log('   - Use: admin@example.com / admin123');
  console.log('   - Or: organizer@example.com / organizer123');
  console.log('   - Or: user@example.com / user123');
  console.log('\n3. Clear browser cache and localStorage');
  console.log('   - Press F12 > Application > Clear storage');
  console.log('\nFor more help, check: FIX_LOGIN_ERROR.md');
}

diagnoseLogin().catch(console.error);
