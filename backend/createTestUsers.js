const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

const testUsers = [
  {
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'admin123',
    role: 'admin',
    phone: '1234567890'
  },
  {
    name: 'Event Organizer',
    email: 'organizer@test.com',
    password: 'organizer123',
    role: 'organizer',
    phone: '0987654321'
  },
  {
    name: 'Regular User',
    email: 'user@test.com',
    password: 'user123',
    role: 'user',
    phone: '5555555555'
  }
];

async function createTestUsers() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'event_management'
    });

    console.log('Connected to database\n');
    console.log('========================================');
    console.log('Creating Test Users');
    console.log('========================================\n');

    for (const user of testUsers) {
      try {
        // Check if user already exists
        const [existing] = await connection.execute(
          'SELECT id FROM users WHERE email = ?',
          [user.email]
        );

        if (existing.length > 0) {
          console.log(`⏭️  Skipped: ${user.email} (already exists)`);
          continue;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(user.password, 10);

        // Insert user
        await connection.execute(
          'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
          [user.name, user.email, hashedPassword, user.role, user.phone]
        );

        console.log(`✅ Created: ${user.email}`);
        console.log(`   Name: ${user.name}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Password: ${user.password}`);
        console.log('');
      } catch (error) {
        console.error(`❌ Error creating ${user.email}:`, error.message);
      }
    }

    console.log('========================================');
    console.log('Test Users Summary');
    console.log('========================================\n');
    
    const [users] = await connection.execute(
      "SELECT id, name, email, role FROM users WHERE email LIKE '%@test.com'"
    );

    if (users.length > 0) {
      console.log('Available test accounts:\n');
      users.forEach(user => {
        const password = testUsers.find(u => u.email === user.email)?.password || 'N/A';
        console.log(`${user.role.toUpperCase()}:`);
        console.log(`  Email: ${user.email}`);
        console.log(`  Password: ${password}`);
        console.log('');
      });
    }

    console.log('========================================');
    console.log('You can now login with these accounts!');
    console.log('========================================\n');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the script
createTestUsers();
