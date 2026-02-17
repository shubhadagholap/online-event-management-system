const mysql = require('mysql2/promise');
require('dotenv').config();

async function debugCategories() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'event_management'
    });

    console.log('Connected to database\n');
    console.log('========================================');
    console.log('CATEGORY DEBUGGING REPORT');
    console.log('========================================\n');

    // Check all categories
    console.log('1. ALL CATEGORIES:');
    console.log('-------------------');
    const [categories] = await connection.execute('SELECT * FROM categories ORDER BY id');
    
    if (categories.length === 0) {
      console.log('❌ NO CATEGORIES FOUND!');
      console.log('   Run: add-sample-events.bat to create categories\n');
    } else {
      categories.forEach(cat => {
        console.log(`✅ ID: ${cat.id} | Name: ${cat.name}`);
      });
      console.log('');
    }

    // Check events per category
    console.log('2. EVENTS PER CATEGORY:');
    console.log('------------------------');
    
    for (const cat of categories) {
      const [events] = await connection.execute(
        'SELECT COUNT(*) as count FROM events WHERE category_id = ?',
        [cat.id]
      );
      const count = events[0].count;
      
      if (count > 0) {
        console.log(`✅ ${cat.name}: ${count} events`);
      } else {
        console.log(`⚠️  ${cat.name}: 0 events (no events in this category)`);
      }
    }
    console.log('');

    // Check Business category specifically
    console.log('3. BUSINESS CATEGORY DETAILS:');
    console.log('------------------------------');
    const [businessCat] = await connection.execute(
      "SELECT * FROM categories WHERE name LIKE '%Business%'"
    );
    
    if (businessCat.length > 0) {
      const catId = businessCat[0].id;
      console.log(`✅ Business Category ID: ${catId}`);
      console.log(`   URL to use: /events?category=${catId}`);
      
      const [businessEvents] = await connection.execute(
        'SELECT id, title FROM events WHERE category_id = ?',
        [catId]
      );
      
      console.log(`   Events: ${businessEvents.length}`);
      businessEvents.forEach(e => {
        console.log(`   - ${e.title}`);
      });
    } else {
      console.log('❌ Business category not found!');
    }
    console.log('');

    // Check Education category specifically
    console.log('4. EDUCATION CATEGORY DETAILS:');
    console.log('-------------------------------');
    const [eduCat] = await connection.execute(
      "SELECT * FROM categories WHERE name LIKE '%Education%'"
    );
    
    if (eduCat.length > 0) {
      const catId = eduCat[0].id;
      console.log(`✅ Education Category ID: ${catId}`);
      console.log(`   URL to use: /events?category=${catId}`);
      
      const [eduEvents] = await connection.execute(
        'SELECT id, title FROM events WHERE category_id = ?',
        [catId]
      );
      
      console.log(`   Events: ${eduEvents.length}`);
      eduEvents.forEach(e => {
        console.log(`   - ${e.title}`);
      });
    } else {
      console.log('❌ Education category not found!');
    }
    console.log('');

    // Check events without categories
    console.log('5. EVENTS WITHOUT CATEGORY:');
    console.log('----------------------------');
    const [uncategorized] = await connection.execute(
      'SELECT COUNT(*) as count FROM events WHERE category_id IS NULL'
    );
    
    if (uncategorized[0].count > 0) {
      console.log(`⚠️  ${uncategorized[0].count} events have no category assigned`);
      const [events] = await connection.execute(
        'SELECT id, title FROM events WHERE category_id IS NULL LIMIT 5'
      );
      events.forEach(e => {
        console.log(`   - ${e.title} (ID: ${e.id})`);
      });
    } else {
      console.log('✅ All events have categories assigned');
    }
    console.log('');

    // Summary
    console.log('========================================');
    console.log('SUMMARY & RECOMMENDATIONS');
    console.log('========================================\n');

    const totalEvents = await connection.execute('SELECT COUNT(*) as count FROM events');
    const totalCats = categories.length;
    
    console.log(`Total Categories: ${totalCats}`);
    console.log(`Total Events: ${totalEvents[0][0].count}`);
    console.log('');

    if (totalCats === 0) {
      console.log('❌ ISSUE: No categories exist');
      console.log('   FIX: Run add-sample-events.bat');
    } else if (totalEvents[0][0].count === 0) {
      console.log('❌ ISSUE: No events exist');
      console.log('   FIX: Run add-sample-events.bat');
    } else {
      console.log('✅ Categories and events exist');
      console.log('');
      console.log('Test URLs:');
      if (businessCat.length > 0) {
        console.log(`   Business: http://localhost:3000/events?category=${businessCat[0].id}`);
      }
      if (eduCat.length > 0) {
        console.log(`   Education: http://localhost:3000/events?category=${eduCat[0].id}`);
      }
    }
    console.log('');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the script
debugCategories();
