const mysql = require('mysql2');
const bcrypt = require('bcrypt');

async function fixOrganizerPasswords() {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'event_management'
  });
  
  try {
    console.log('Fixing organizer passwords...\n');
    
    // Hash passwords
    const johnPassword = await bcrypt.hash('organizer123', 10);
    const preranaPassword = await bcrypt.hash('prerana123', 10);
    
    // Update John Organizer password
    connection.query(
      'UPDATE users SET password = ? WHERE email = ?',
      [johnPassword, 'organizer@example.com'],
      (err, result) => {
        if (err) {
          console.error('Error updating John Organizer:', err.message);
        } else {
          console.log('✅ Updated John Organizer password to: organizer123');
        }
        
        // Update prerana password
        connection.query(
          'UPDATE users SET password = ? WHERE email = ?',
          [preranaPassword, 'prerana343@gmail.com'],
          (err, result) => {
            if (err) {
              console.error('Error updating prerana:', err.message);
            } else {
              console.log('✅ Updated prerana password to: prerana123');
            }
            
            console.log('\n📋 Updated credentials:');
            console.log('John Organizer: organizer@example.com / organizer123');
            console.log('prerana: prerana343@gmail.com / prerana123');
            console.log('Admin: admin@gmail.com / admin123');
            
            connection.end();
          }
        );
      }
    );
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    connection.end();
  }
}

fixOrganizerPasswords();