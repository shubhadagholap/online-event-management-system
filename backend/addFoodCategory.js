const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'event_management'
});

console.log('Adding Food category...\n');

// Check if Food category already exists
connection.query('SELECT * FROM categories WHERE name = ?', ['Food'], (err, existing) => {
  if (err) {
    console.error('❌ Error checking existing categories:', err.message);
    connection.end();
    return;
  }
  
  if (existing.length > 0) {
    console.log('⚠️ Food category already exists!');
    console.log('Existing Food category:', existing[0]);
    connection.end();
    return;
  }
  
  // Insert Food category
  connection.query(
    'INSERT INTO categories (name, description) VALUES (?, ?)',
    ['Food', 'Food festivals, cooking workshops, and culinary events'],
    (err, result) => {
      if (err) {
        console.error('❌ Error adding Food category:', err.message);
      } else {
        console.log('✅ Food category added successfully!');
        console.log('Category ID:', result.insertId);
        console.log('Name: Food');
        console.log('Description: Food festivals, cooking workshops, and culinary events');
      }
      
      // Show all categories
      connection.query('SELECT * FROM categories ORDER BY name', (err, categories) => {
        if (err) {
          console.error('❌ Error fetching categories:', err.message);
        } else {
          console.log('\n📋 All categories:');
          categories.forEach(cat => {
            console.log(`  ${cat.id}. ${cat.name} - ${cat.description}`);
          });
        }
        connection.end();
      });
    }
  );
});