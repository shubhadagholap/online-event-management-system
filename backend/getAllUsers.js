const db = require('./config/db');

async function getAllUsers() {
  console.log('='.repeat(70));
  console.log('ALL USERS AND PASSWORDS');
  console.log('='.repeat(70));

  try {
    const [users] = await db.query(`
      SELECT id, name, email, role, phone, created_at 
      FROM users 
      ORDER BY role, id
    `);

    console.log(`\nTotal Users: ${users.length}\n`);

    // Group by role
    const roles = {
      admin: [],
      organizer: [],
      user: []
    };

    users.forEach(user => {
      if (roles[user.role]) {
        roles[user.role].push(user);
      }
    });

    // Display by role
    console.log('='.repeat(70));
    console.log('ADMIN ACCOUNTS');
    console.log('='.repeat(70));
    roles.admin.forEach(user => {
      console.log(`\nName:     ${user.name}`);
      console.log(`Email:    ${user.email}`);
      console.log(`Password: admin123`);
      console.log(`Role:     ${user.role}`);
      console.log(`ID:       ${user.id}`);
      if (user.phone) console.log(`Phone:    ${user.phone}`);
    });

    console.log('\n' + '='.repeat(70));
    console.log('ORGANIZER ACCOUNTS');
    console.log('='.repeat(70));
    roles.organizer.forEach(user => {
      console.log(`\nName:     ${user.name}`);
      console.log(`Email:    ${user.email}`);
      console.log(`Password: organizer123`);
      console.log(`Role:     ${user.role}`);
      console.log(`ID:       ${user.id}`);
      if (user.phone) console.log(`Phone:    ${user.phone}`);
    });

    console.log('\n' + '='.repeat(70));
    console.log('USER ACCOUNTS');
    console.log('='.repeat(70));
    roles.user.forEach(user => {
      console.log(`\nName:     ${user.name}`);
      console.log(`Email:    ${user.email}`);
      console.log(`Password: user123`);
      console.log(`Role:     ${user.role}`);
      console.log(`ID:       ${user.id}`);
      if (user.phone) console.log(`Phone:    ${user.phone}`);
    });

    console.log('\n' + '='.repeat(70));
    console.log('QUICK REFERENCE');
    console.log('='.repeat(70));
    console.log('\nADMINS:');
    roles.admin.forEach(u => console.log(`  ${u.email} / admin123`));
    
    console.log('\nORGANIZERS:');
    roles.organizer.forEach(u => console.log(`  ${u.email} / organizer123`));
    
    console.log('\nUSERS:');
    roles.user.forEach(u => console.log(`  ${u.email} / user123`));

    console.log('\n' + '='.repeat(70));
    console.log('PASSWORD PATTERNS');
    console.log('='.repeat(70));
    console.log('\nAll passwords follow this pattern:');
    console.log('  Admin accounts:     admin123');
    console.log('  Organizer accounts: organizer123');
    console.log('  User accounts:      user123');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit();
  }
}

getAllUsers();
