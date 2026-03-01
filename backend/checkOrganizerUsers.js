const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'event_management'
});

console.log('Checking organizer users...\n');

connection.query('SELECT id, name, email, role FROM users WHERE role IN ("organizer", "admin")', (err, users) => {
  if (err) {
    console.error('Error:', err.message);
    return;
  }
  
  console.log('Organizer and Admin users:');
  users.forEach(user => {
    console.log(`${user.id}: ${user.name} (${user.email}) - ${user.role}`);
  });
  
  connection.end();
});