const db = require('./config/db');
const bcrypt = require('bcrypt');

async function fixAdminPassword() {
  try {
    console.log('🔐 Fixing Admin Password for admin@gmail.com...\n');
    
    // Hash the password properly
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Update the password for admin@gmail.com
    const [result] = await db.query(
      'UPDATE users SET password = ? WHERE email = ?',
      [hashedPassword, 'admin@gmail.com']
    );
    
    console.log(`✅ Updated password for admin@gmail.com (${result.affectedRows} rows affected)`);
    
    // Verify the fix
    const [adminUser] = await db.query(
      'SELECT id, email, password FROM users WHERE email = ?',
      ['admin@gmail.com']
    );
    
    if (adminUser.length > 0) {
      const isValid = await bcrypt.compare('admin123', adminUser[0].password);
      console.log(`✅ Password verification: ${isValid ? 'VALID' : 'INVALID'}`);
      
      if (isValid) {
        console.log('\n🎉 Admin password fixed successfully!');
        console.log('You can now login with:');
        console.log('Email: admin@gmail.com');
        console.log('Password: admin123');
      }
    }
    
  } catch (error) {
    console.error('❌ Error fixing admin password:', error);
  } finally {
    process.exit(0);
  }
}

fixAdminPassword();