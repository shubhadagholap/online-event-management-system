const db = require('./config/db');
const bcrypt = require('bcrypt');

async function fixSupritaPassword() {
  try {
    console.log('🔐 Fixing Suprita\'s Password...\n');
    
    // Hash the password
    const hashedPassword = await bcrypt.hash('organizer123', 10);
    
    // Update the password for suprita
    const [result] = await db.query(
      'UPDATE users SET password = ? WHERE email = ?',
      [hashedPassword, 'suprita@gmail.com']
    );
    
    console.log(`✅ Updated password for suprita@gmail.com (${result.affectedRows} rows affected)`);
    
    // Verify the fix
    const [user] = await db.query(
      'SELECT id, email, password FROM users WHERE email = ?',
      ['suprita@gmail.com']
    );
    
    if (user.length > 0) {
      const isValid = await bcrypt.compare('organizer123', user[0].password);
      console.log(`✅ Password verification: ${isValid ? 'VALID' : 'INVALID'}`);
      
      if (isValid) {
        console.log('\n🎉 Suprita\'s password fixed successfully!');
        console.log('Login credentials:');
        console.log('Email: suprita@gmail.com');
        console.log('Password: organizer123');
      }
    }
    
  } catch (error) {
    console.error('❌ Error fixing password:', error);
  } finally {
    process.exit(0);
  }
}

fixSupritaPassword();