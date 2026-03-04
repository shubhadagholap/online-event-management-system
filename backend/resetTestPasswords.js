const bcrypt = require('bcrypt');
const db = require('./config/db');

(async () => {
  try {
    // Set passwords for test users
    const users = [
      { id: 3, email: 'user@example.com', password: 'user123' },
      { id: 5, email: 'testuser@example.com', password: 'test123' },
      { id: 9, email: 'jyoti@gmail.com', password: 'jyoti123' }
    ];

    for (const user of users) {
      const hash = await bcrypt.hash(user.password, 10);
      await db.query('UPDATE users SET password = ? WHERE id = ?', [hash, user.id]);
      console.log(`✓ Updated ${user.email} password to: ${user.password}`);
    }

    // Also fix the corrupted certificate record
    const [corrupted] = await db.query(
      `SELECT id, certificate_number FROM certificates WHERE pdf_url LIKE 'data:image%' LIMIT 1`
    );
    
    if (corrupted.length > 0) {
      const certId = corrupted[0].id;
      const certNum = corrupted[0].certificate_number;
      const newUrl = `/certificates/${certNum}.pdf`;
      await db.query('UPDATE certificates SET pdf_url = ? WHERE id = ?', [newUrl, certId]);
      console.log(`✓ Fixed corrupted certificate ${certId}: ${newUrl}`);
    }

    console.log('\n=== You can now log in with ===');
    users.forEach(u => {
      console.log(`  ${u.email} / ${u.password}`);
    });

    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
