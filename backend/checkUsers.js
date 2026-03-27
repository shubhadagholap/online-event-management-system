const db = require('./config/db');

async function checkUsers() {
  try {
    const [users] = await db.query('SELECT id, name, email, role FROM users ORDER BY id');
    console.log('📋 Current users in database:');
    console.table(users);
    
    // Check if BGM user exists
    const [bgmUser] = await db.query('SELECT * FROM users WHERE email = ?', ['bgm@gmail.com']);
    if (bgmUser.length > 0) {
      console.log('👤 BGM user found:', bgmUser[0]);
    } else {
      console.log('❌ BGM user not found');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkUsers();