const db = require('./config/db');
const bcrypt = require('bcrypt');

async function quickReset() {
  console.log('='.repeat(70));
  console.log('QUICK PASSWORD RESET');
  console.log('='.repeat(70));

  const email = process.argv[2];
  const newPassword = process.argv[3];

  if (!email || !newPassword) {
    console.log('\nUsage: node quickPasswordReset.js <email> <new-password>');
    console.log('\nExample:');
    console.log('  node quickPasswordReset.js admin@example.com mynewpassword');
    console.log('\nOr reset all to defaults:');
    console.log('  node quickPasswordReset.js --reset-all');
    process.exit(1);
  }

  try {
    if (email === '--reset-all') {
      console.log('\nResetting all passwords to defaults...\n');
      
      // Reset admins
      const adminHash = await bcrypt.hash('admin123', 10);
      await db.query('UPDATE users SET password = ? WHERE role = "admin"', [adminHash]);
      console.log('✓ All admin passwords → admin123');

      // Reset organizers
      const organizerHash = await bcrypt.hash('organizer123', 10);
      await db.query('UPDATE users SET password = ? WHERE role = "organizer"', [organizerHash]);
      console.log('✓ All organizer passwords → organizer123');

      // Reset users
      const userHash = await bcrypt.hash('user123', 10);
      await db.query('UPDATE users SET password = ? WHERE role = "user"', [userHash]);
      console.log('✓ All user passwords → user123');

      console.log('\n✓ All passwords reset successfully!');
    } else {
      // Find user
      const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

      if (users.length === 0) {
        console.log(`\n✗ User not found: ${email}`);
        console.log('\nAvailable users:');
        const [allUsers] = await db.query('SELECT email, role FROM users ORDER BY role');
        allUsers.forEach(u => console.log(`  ${u.email} (${u.role})`));
        process.exit(1);
      }

      const user = users[0];
      
      // Hash and update password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id]);

      console.log(`\n✓ Password updated for: ${user.email}`);
      console.log(`  Name: ${user.name}`);
      console.log(`  Role: ${user.role}`);
      console.log(`  New Password: ${newPassword}`);
      console.log('\n✓ You can now login with the new password!');
    }

  } catch (error) {
    console.error('\n✗ Error:', error.message);
  } finally {
    process.exit();
  }
}

quickReset();
