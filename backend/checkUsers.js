const db = require('./config/db');

(async () => {
  try {
    console.log('=== Checking users in database ===');
    const [users] = await db.query('SELECT id, email, name, role FROM users LIMIT 10');
    
    users.forEach(u => {
      console.log(`  ID ${u.id}: ${u.email} (${u.role}) - "${u.name}"`);
    });

    console.log('\n=== Certificates summary ===');
    const [summary] = await db.query(
      `SELECT COUNT(*) as total, COUNT(DISTINCT user_id) as unique_users FROM certificates`
    );
    console.log(`Total certificates: ${summary[0].total}`);
    console.log(`Unique users with certs: ${summary[0].unique_users}`);

    console.log('\n=== Certificates by user ===');
    const [byUser] = await db.query(
      `SELECT c.user_id, u.email, u.name, COUNT(*) as count
       FROM certificates c
       JOIN users u ON c.user_id = u.id
       GROUP BY c.user_id`
    );
    
    byUser.forEach(row => {
      console.log(`  User ${row.user_id} (${row.email}): ${row.count} certificates`);
    });

    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
