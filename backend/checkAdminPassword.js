const db = require('./config/db');
const bcrypt = require('bcrypt');

async function checkAdminPassword() {
  try {
    console.log('Checking admin user in database...\n');
    
    // Get admin user
    const [adminUsers] = await db.query(
      'SELECT id, email, password, role FROM users WHERE email = ? OR role = ?',
      ['admin@example.com', 'admin']
    );
    
    if (adminUsers.length === 0) {
      console.log('❌ No admin users found!');
      return;
    }
    
    console.log('Admin users found:');
    adminUsers.forEach(user => {
      console.log(`- ID: ${user.id}, Email: ${user.email}, Role: ${user.role}`);
      console.log(`  Password hash: ${user.password.substring(0, 20)}...`);
    });
    
    // Test password verification
    const testPassword = 'admin123';
    console.log(`\nTesting password "${testPassword}" against admin users:`);
    
    for (const user of adminUsers) {
      const isValid = await bcrypt.compare(testPassword, user.password);
      console.log(`- ${user.email}: ${isValid ? '✅ Password VALID' : '❌ Password INVALID'}`);
    }
    
  } catch (error) {
    console.error('Error checking admin password:', error);
  } finally {
    process.exit(0);
  }
}

checkAdminPassword();