const db = require('./config/db');

async function checkDashboardStats() {
  console.log('='.repeat(70));
  console.log('DASHBOARD STATISTICS CHECK');
  console.log('='.repeat(70));

  try {
    // Check actual counts
    console.log('\n1. Actual Database Counts:');
    
    const [totalUsers] = await db.query('SELECT COUNT(*) as count FROM users');
    console.log(`   Total Users: ${totalUsers[0].count}`);
    
    const [usersByRole] = await db.query('SELECT role, COUNT(*) as count FROM users GROUP BY role');
    console.log('\n   Users by Role:');
    usersByRole.forEach(r => console.log(`     ${r.role}: ${r.count}`));
    
    const [totalEvents] = await db.query('SELECT COUNT(*) as count FROM events');
    console.log(`\n   Total Events: ${totalEvents[0].count}`);
    
    const [totalBookings] = await db.query('SELECT COUNT(*) as count FROM bookings');
    console.log(`   Total Bookings: ${totalBookings[0].count}`);
    
    const [totalRevenue] = await db.query('SELECT SUM(total_amount) as revenue FROM bookings WHERE payment_status = "paid"');
    console.log(`   Total Revenue: $${totalRevenue[0].revenue || 0}`);

    // Check what dashboard queries return
    console.log('\n2. Dashboard Query Results:');
    
    // Event controller dashboard
    const [eventDashUsers] = await db.query('SELECT COUNT(*) as count FROM users');
    console.log(`   Event Dashboard - Total Users: ${eventDashUsers[0].count}`);
    
    // Booking controller dashboard
    const [regularUsers] = await db.query('SELECT COUNT(*) as count FROM users WHERE role = "user"');
    const [organizers] = await db.query('SELECT COUNT(*) as count FROM users WHERE role = "organizer"');
    console.log(`   Booking Dashboard - Regular Users: ${regularUsers[0].count}`);
    console.log(`   Booking Dashboard - Organizers: ${organizers[0].count}`);

    // Check for deleted users
    console.log('\n3. Recently Deleted Users:');
    const [allUsers] = await db.query('SELECT id, name, email, role FROM users ORDER BY id');
    console.log(`   Current user IDs: ${allUsers.map(u => u.id).join(', ')}`);
    
    // Check for gaps in IDs (indicates deletions)
    const ids = allUsers.map(u => u.id);
    const maxId = Math.max(...ids);
    const missingIds = [];
    for (let i = 1; i <= maxId; i++) {
      if (!ids.includes(i)) {
        missingIds.push(i);
      }
    }
    
    if (missingIds.length > 0) {
      console.log(`   Missing IDs (deleted): ${missingIds.join(', ')}`);
      console.log(`   Number deleted: ${missingIds.length}`);
    } else {
      console.log('   No users deleted (no gaps in IDs)');
    }

    console.log('\n' + '='.repeat(70));
    console.log('SUMMARY');
    console.log('='.repeat(70));
    console.log(`\nTotal Users in Database: ${totalUsers[0].count}`);
    console.log(`Expected after deleting 2: ${totalUsers[0].count} (was 14, now ${totalUsers[0].count})`);
    console.log(`\nDashboard should show: ${totalUsers[0].count} users`);
    
    if (totalUsers[0].count === 12) {
      console.log('\n✓ Count is correct (14 - 2 = 12)');
    } else if (totalUsers[0].count === 14) {
      console.log('\n⚠ No users were actually deleted');
    } else {
      console.log(`\n⚠ Unexpected count: ${totalUsers[0].count}`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit();
  }
}

checkDashboardStats();
