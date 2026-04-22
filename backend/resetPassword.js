const db = require('./config/db');
const bcrypt = require('bcrypt');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function resetPassword() {
  console.log('='.repeat(70));
  console.log('PASSWORD RESET TOOL');
  console.log('='.repeat(70));

  try {
    console.log('\nOptions:');
    console.log('1. Reset password by email');
    console.log('2. Reset password by user ID');
    console.log('3. Reset all passwords to defaults');
    console.log('4. View all users');
    console.log('5. Exit');
    
    const choice = await question('\nEnter your choice (1-5): ');

    switch (choice.trim()) {
      case '1':
        await resetByEmail();
        break;
      case '2':
        await resetById();
        break;
      case '3':
        await resetAllToDefaults();
        break;
      case '4':
        await viewAllUsers();
        break;
      case '5':
        console.log('\nExiting...');
        process.exit(0);
        break;
      default:
        console.log('\nInvalid choice!');
        process.exit(1);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    rl.close();
    process.exit();
  }
}

async function resetByEmail() {
  console.log('\n' + '='.repeat(70));
  console.log('RESET PASSWORD BY EMAIL');
  console.log('='.repeat(70));

  const email = await question('\nEnter email address: ');

  // Find user
  const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email.trim()]);

  if (users.length === 0) {
    console.log('\n✗ User not found with email:', email);
    return;
  }

  const user = users[0];
  console.log('\n✓ User found:');
  console.log(`  Name: ${user.name}`);
  console.log(`  Email: ${user.email}`);
  console.log(`  Role: ${user.role}`);

  const newPassword = await question('\nEnter new password: ');

  if (!newPassword || newPassword.trim().length < 6) {
    console.log('\n✗ Password must be at least 6 characters!');
    return;
  }

  // Hash and update password
  const hashedPassword = await bcrypt.hash(newPassword.trim(), 10);
  await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id]);

  console.log('\n✓ Password updated successfully!');
  console.log(`\nNew credentials:`);
  console.log(`  Email: ${user.email}`);
  console.log(`  Password: ${newPassword.trim()}`);
}

async function resetById() {
  console.log('\n' + '='.repeat(70));
  console.log('RESET PASSWORD BY USER ID');
  console.log('='.repeat(70));

  const userId = await question('\nEnter user ID: ');

  // Find user
  const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId.trim()]);

  if (users.length === 0) {
    console.log('\n✗ User not found with ID:', userId);
    return;
  }

  const user = users[0];
  console.log('\n✓ User found:');
  console.log(`  Name: ${user.name}`);
  console.log(`  Email: ${user.email}`);
  console.log(`  Role: ${user.role}`);

  const newPassword = await question('\nEnter new password: ');

  if (!newPassword || newPassword.trim().length < 6) {
    console.log('\n✗ Password must be at least 6 characters!');
    return;
  }

  // Hash and update password
  const hashedPassword = await bcrypt.hash(newPassword.trim(), 10);
  await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id]);

  console.log('\n✓ Password updated successfully!');
  console.log(`\nNew credentials:`);
  console.log(`  Email: ${user.email}`);
  console.log(`  Password: ${newPassword.trim()}`);
}

async function resetAllToDefaults() {
  console.log('\n' + '='.repeat(70));
  console.log('RESET ALL PASSWORDS TO DEFAULTS');
  console.log('='.repeat(70));

  const confirm = await question('\nThis will reset ALL passwords. Continue? (yes/no): ');

  if (confirm.toLowerCase() !== 'yes') {
    console.log('\nCancelled.');
    return;
  }

  console.log('\nResetting passwords...');

  // Reset admins
  const adminHash = await bcrypt.hash('admin123', 10);
  const [admins] = await db.query('SELECT id, email FROM users WHERE role = "admin"');
  for (const admin of admins) {
    await db.query('UPDATE users SET password = ? WHERE id = ?', [adminHash, admin.id]);
    console.log(`✓ Reset ${admin.email} → admin123`);
  }

  // Reset organizers
  const organizerHash = await bcrypt.hash('organizer123', 10);
  const [organizers] = await db.query('SELECT id, email FROM users WHERE role = "organizer"');
  for (const organizer of organizers) {
    await db.query('UPDATE users SET password = ? WHERE id = ?', [organizerHash, organizer.id]);
    console.log(`✓ Reset ${organizer.email} → organizer123`);
  }

  // Reset users
  const userHash = await bcrypt.hash('user123', 10);
  const [regularUsers] = await db.query('SELECT id, email FROM users WHERE role = "user"');
  for (const user of regularUsers) {
    await db.query('UPDATE users SET password = ? WHERE id = ?', [userHash, user.id]);
    console.log(`✓ Reset ${user.email} → user123`);
  }

  console.log('\n✓ All passwords reset to defaults!');
  console.log('\nDefault passwords:');
  console.log('  Admins: admin123');
  console.log('  Organizers: organizer123');
  console.log('  Users: user123');
}

async function viewAllUsers() {
  console.log('\n' + '='.repeat(70));
  console.log('ALL USERS');
  console.log('='.repeat(70));

  const [users] = await db.query('SELECT id, name, email, role FROM users ORDER BY role, id');

  console.log(`\nTotal: ${users.length} users\n`);

  const roles = { admin: [], organizer: [], user: [] };
  users.forEach(user => {
    if (roles[user.role]) roles[user.role].push(user);
  });

  console.log('ADMINS:');
  roles.admin.forEach(u => console.log(`  [${u.id}] ${u.email} - ${u.name}`));

  console.log('\nORGANIZERS:');
  roles.organizer.forEach(u => console.log(`  [${u.id}] ${u.email} - ${u.name}`));

  console.log('\nUSERS:');
  roles.user.forEach(u => console.log(`  [${u.id}] ${u.email} - ${u.name}`));
}

resetPassword();
