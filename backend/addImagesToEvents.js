const mysql = require('mysql2/promise');
require('dotenv').config();

const imageMapping = {
  music: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=400&fit=crop',
  concert: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=400&fit=crop',
  tech: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
  technology: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop',
  sport: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&h=400&fit=crop',
  marathon: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&h=400&fit=crop',
  food: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=400&fit=crop',
  wine: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=400&fit=crop',
  art: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=400&fit=crop',
  business: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=400&fit=crop',
  comedy: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&h=400&fit=crop',
  education: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=400&fit=crop',
  workshop: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=400&fit=crop',
  conference: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
  default: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=400&fit=crop'
};

async function addImagesToEvents() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'event_management'
    });

    console.log('Connected to database\n');

    // Get all events without images
    const [events] = await connection.execute(
      "SELECT id, title, image_url FROM events WHERE image_url IS NULL OR image_url = ''"
    );

    if (events.length === 0) {
      console.log('✅ All events already have images!');
      return;
    }

    console.log(`Found ${events.length} events without images\n`);

    let updatedCount = 0;

    for (const event of events) {
      let imageUrl = imageMapping.default;
      const titleLower = event.title.toLowerCase();

      // Find matching keyword in title
      for (const [keyword, url] of Object.entries(imageMapping)) {
        if (titleLower.includes(keyword)) {
          imageUrl = url;
          break;
        }
      }

      // Update event with image
      await connection.execute(
        'UPDATE events SET image_url = ? WHERE id = ?',
        [imageUrl, event.id]
      );

      console.log(`✅ Updated: "${event.title}"`);
      updatedCount++;
    }

    console.log('\n=================================');
    console.log(`✅ Successfully added images to ${updatedCount} events`);
    console.log('=================================\n');

  } catch (error) {
    console.error('Error adding images:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the script
addImagesToEvents();
