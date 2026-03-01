const axios = require('axios');

async function testTicketsEndpoint() {
  try {
    console.log('Testing tickets endpoint...\n');
    
    // Login as Jyoti (who has the bookings)
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'jyoti@gmail.com',
      password: 'admin123'  // We need to set this password
    });
    
    console.log('❌ Login failed, need to set password for Jyoti');
    
  } catch (error) {
    console.log('Login failed, let me set password for Jyoti first...');
    
    // Let's create a password for Jyoti
    const bcrypt = require('bcrypt');
    const mysql = require('mysql2');
    
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      database: 'event_management'
    });
    
    const hashedPassword = await bcrypt.hash('jyoti123', 10);
    
    connection.query(
      'UPDATE users SET password = ? WHERE email = ?',
      [hashedPassword, 'jyoti@gmail.com'],
      async (err, result) => {
        if (err) {
          console.error('Error updating password:', err.message);
          return;
        }
        
        console.log('✅ Set password for Jyoti: jyoti123');
        
        // Now try to login and test
        try {
          const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'jyoti@gmail.com',
            password: 'jyoti123'
          });
          
          console.log('✅ Jyoti logged in successfully');
          const token = loginResponse.data.token;
          
          // Test my-bookings endpoint (which tickets page uses)
          const bookingsResponse = await axios.get('http://localhost:5000/api/bookings/my-bookings', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Cache-Control': 'no-cache'
            }
          });
          
          console.log('\n=== MY BOOKINGS RESPONSE ===');
          console.log('Status:', bookingsResponse.status);
          console.log('Count:', bookingsResponse.data.length);
          console.log('Data:', JSON.stringify(bookingsResponse.data, null, 2));
          
          // Filter like the tickets page does
          const confirmedTickets = bookingsResponse.data.filter(
            booking => booking.status === 'confirmed'
          );
          
          console.log(`\n🎫 Tickets that will show: ${confirmedTickets.length}`);
          
        } catch (loginError) {
          console.error('❌ Login error:', loginError.response?.data || loginError.message);
        }
        
        connection.end();
      }
    );
  }
}

testTicketsEndpoint();