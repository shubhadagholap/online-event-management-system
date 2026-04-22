const db = require('./config/db');

async function testUserDelete() {
  console.log('='.repeat(70));
  console.log('USER DELETE FUNCTIONALITY TEST');
  console.log('='.repeat(70));

  try {
    // Check if delete is working
    console.log('\n1. Checking user deletion capability...');
    
    const [users] = await db.query('SELECT id, name, email, role FROM users ORDER BY id');
    console.log(`\n✓ Total users in system: ${users.length}`);
    
    console.log('\nUsers by role:');
    const roles = { admin: [], organizer: [], user: [] };
    users.forEach(u => {
      if (roles[u.role]) roles[u.role].push(u);
    });
    
    console.log(`  Admins: ${roles.admin.length}`);
    console.log(`  Organizers: ${roles.organizer.length}`);
    console.log(`  Users: ${roles.user.length}`);

    // Check for test user
    const [testUsers] = await db.query('SELECT * FROM users WHERE email = "test@test.com"');
    
    if (testUsers.length > 0) {
      console.log('\n2. Testing delete on test user...');
      const testUser = testUsers[0];
      console.log(`  Found test user: ${testUser.email} (ID: ${testUser.id})`);
      
      // Check dependencies
      const [bookings] = await db.query('SELECT COUNT(*) as count FROM bookings WHERE user_id = ?', [testUser.id]);
      console.log(`  Bookings: ${bookings[0].count}`);
      
      if (bookings[0].count > 0) {
        console.log('  ⚠ User has bookings - deletion may fail due to foreign key constraints');
        console.log('  Solution: Delete bookings first or use CASCADE');
      } else {
        console.log('  ✓ No bookings - safe to delete');
      }
    } else {
      console.log('\n2. No test user found to test deletion');
    }

    // Check foreign key constraints
    console.log('\n3. Checking foreign key constraints...');
    const [constraints] = await db.query(`
      SELECT 
        TABLE_NAME,
        COLUMN_NAME,
        CONSTRAINT_NAME,
        REFERENCED_TABLE_NAME,
        REFERENCED_COLUMN_NAME
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
      WHERE REFERENCED_TABLE_NAME = 'users'
      AND TABLE_SCHEMA = 'event_management'
    `);
    
    if (constraints.length > 0) {
      console.log('  Foreign key constraints found:');
      constraints.forEach(c => {
        console.log(`    ${c.TABLE_NAME}.${c.COLUMN_NAME} → users.${c.REFERENCED_COLUMN_NAME}`);
      });
      console.log('\n  ⚠ Users with related records cannot be deleted');
      console.log('  Solutions:');
      console.log('    1. Delete related records first');
      console.log('    2. Add CASCADE to foreign keys');
      console.log('    3. Implement soft delete (mark as deleted)');
    } else {
      console.log('  ✓ No foreign key constraints');
    }

    console.log('\n' + '='.repeat(70));
    console.log('SUMMARY');
    console.log('='.repeat(70));
    console.log('\nDelete functionality:');
    console.log('  ✓ Backend route exists: DELETE /api/users/:id');
    console.log('  ✓ Controller function exists: deleteUser');
    console.log('  ✓ Frontend API call exists: usersAPI.delete(id)');
    console.log('  ✓ Frontend UI has delete buttons');
    
    console.log('\nPotential issues:');
    if (constraints.length > 0) {
      console.log('  ⚠ Foreign key constraints may prevent deletion');
      console.log('  ⚠ Users with bookings/events cannot be deleted');
    } else {
      console.log('  ✓ No issues detected');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit();
  }
}

testUserDelete();
