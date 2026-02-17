/**
 * Password Hash Generator
 * 
 * This script generates bcrypt hashes for passwords.
 * Use these hashes to update the default user passwords in database/schema.sql
 * 
 * Usage: node generateHash.js
 */

const bcrypt = require('bcrypt');

async function generatePasswordHashes() {
  console.log('\n=== Password Hash Generator ===\n');
  
  const passwords = [
    { user: 'Admin', password: 'admin123' },
    { user: 'Organizer', password: 'organizer123' },
    { user: 'User', password: 'user123' }
  ];

  for (const item of passwords) {
    const hash = await bcrypt.hash(item.password, 10);
    console.log(`${item.user}:`);
    console.log(`  Password: ${item.password}`);
    console.log(`  Hash: ${hash}`);
    console.log('');
  }

  console.log('Copy these hashes and update the INSERT statements in database/schema.sql\n');
}

// Run the generator
generatePasswordHashes().catch(console.error);
