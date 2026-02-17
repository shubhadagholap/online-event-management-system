const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Reliable placeholder image services
const getPlaceholderImage = (width = 800, height = 400, category = 'event') => {
  const services = [
    `https://via.placeholder.com/${width}x${height}/667eea/ffffff?text=${encodeURIComponent(category)}`,
    `https://placehold.co/${width}x${height}/667eea/white?text=${encodeURIComponent(category)}`,
    `https://dummyimage.com/${width}x${height}/667eea/fff&text=${encodeURIComponent(category)}`
  ];
  return services[0]; // Use first one as primary
};

const categories = [
  { name: 'Music', description: 'Concerts, festivals, and live music performances', icon: '🎵' },
  { name: 'Technology', description: 'Tech conferences, workshops, and seminars', icon: '💻' },
  { name: 'Sports', description: 'Sports events, tournaments, and fitness activities', icon: '⚽' },
  { name: 'Business', description: 'Business conferences, networking, and workshops', icon: '💼' },
  { name: 'Arts', description: 'Art exhibitions, theater, and cultural events', icon: '🎨' },
  { name: 'Food', description: 'Food festivals, cooking classes, and culinary events', icon: '🍔' },
  { name: 'Education', description: 'Educational workshops, training, and courses', icon: '📚' },
  { name: 'Entertainment', description: 'Comedy shows, movies, and entertainment events', icon: '🎭' },
  { name: 'Conference', description: 'Professional conferences and summits', icon: '🎤' },
  { name: 'Health', description: 'Health and wellness events', icon: '🏥' }
];

const events = [
  // Music Events
  { title: 'Summer Music Festival 2026', description: 'Join us for the biggest music festival of the year featuring top artists from around the world. Experience live performances, food trucks, and amazing vibes!', date: '2026-07-15 18:00:00', location: 'Central Park, New York', capacity: 5000, price: 89.99, category: 'Music', status: 'upcoming' },
  { title: 'Jazz Night Live', description: 'An intimate evening of smooth jazz with renowned musicians. Enjoy cocktails and fine dining while listening to classic jazz standards.', date: '2026-06-20 20:00:00', location: 'Blue Note Jazz Club, Chicago', capacity: 200, price: 45.00, category: 'Music', status: 'upcoming' },
  { title: 'Rock Concert Extravaganza', description: 'The ultimate rock experience with legendary bands performing their greatest hits. Get ready to rock!', date: '2026-08-10 19:00:00', location: 'Madison Square Garden, New York', capacity: 3000, price: 125.00, category: 'Music', status: 'upcoming' },
  { title: 'Classical Symphony Night', description: 'Experience the beauty of classical music performed by world-class orchestra.', date: '2026-09-05 19:30:00', location: 'Symphony Hall, Boston', capacity: 800, price: 65.00, category: 'Music', status: 'upcoming' },
  
  // Technology Events
  { title: 'Tech Summit 2026', description: 'The premier technology conference featuring keynotes from industry leaders, workshops, and networking opportunities. Learn about AI, Cloud, and emerging technologies.', date: '2026-09-05 09:00:00', location: 'Convention Center, San Francisco', capacity: 1500, price: 299.00, category: 'Technology', status: 'upcoming' },
  { title: 'AI & Machine Learning Workshop', description: 'Hands-on workshop covering the latest in artificial intelligence and machine learning. Bring your laptop and learn by doing!', date: '2026-07-25 10:00:00', location: 'Tech Hub, Seattle', capacity: 100, price: 149.00, category: 'Technology', status: 'upcoming' },
  { title: 'Startup Pitch Competition', description: 'Watch innovative startups pitch their ideas to top investors. Network with entrepreneurs and VCs. Cash prizes for winners!', date: '2026-08-18 14:00:00', location: 'Innovation Center, Austin', capacity: 300, price: 25.00, category: 'Technology', status: 'upcoming' },
  { title: 'Cybersecurity Conference', description: 'Learn about the latest in cybersecurity threats and protection strategies.', date: '2026-10-20 09:00:00', location: 'Tech Center, Washington DC', capacity: 500, price: 199.00, category: 'Technology', status: 'upcoming' },
  
  // Sports Events
  { title: 'City Marathon 2026', description: 'Annual city marathon open to runners of all levels. 5K, 10K, and full marathon options available. Register now!', date: '2026-10-12 07:00:00', location: 'Downtown, Boston', capacity: 10000, price: 50.00, category: 'Sports', status: 'upcoming' },
  { title: 'Basketball Championship Finals', description: 'Watch the championship finals live! The best teams compete for the trophy. Don\'t miss this exciting match!', date: '2026-06-30 19:00:00', location: 'Sports Arena, Los Angeles', capacity: 8000, price: 75.00, category: 'Sports', status: 'upcoming' },
  { title: 'Yoga & Wellness Retreat', description: 'A weekend retreat focused on yoga, meditation, and wellness. Includes meals, accommodation, and expert instructors.', date: '2026-07-08 08:00:00', location: 'Mountain Resort, Colorado', capacity: 50, price: 399.00, category: 'Sports', status: 'upcoming' },
  { title: 'Tennis Tournament', description: 'Professional tennis tournament featuring top players from around the world.', date: '2026-08-25 10:00:00', location: 'Tennis Center, Miami', capacity: 2000, price: 85.00, category: 'Sports', status: 'upcoming' },
  
  // Business Events
  { title: 'Leadership Summit 2026', description: 'Develop your leadership skills with workshops, panel discussions, and networking. Learn from successful CEOs and executives.', date: '2026-09-20 09:00:00', location: 'Business Center, New York', capacity: 500, price: 199.00, category: 'Business', status: 'upcoming' },
  { title: 'Entrepreneurship Bootcamp', description: 'Intensive 3-day bootcamp for aspiring entrepreneurs. Learn business planning, funding strategies, and growth tactics.', date: '2026-08-01 09:00:00', location: 'Startup Hub, San Francisco', capacity: 150, price: 499.00, category: 'Business', status: 'upcoming' },
  { title: 'Networking Mixer', description: 'Professional networking event for business leaders and entrepreneurs. Includes drinks, appetizers, and speed networking sessions.', date: '2026-06-25 18:00:00', location: 'Rooftop Lounge, Miami', capacity: 200, price: 35.00, category: 'Business', status: 'upcoming' },
  { title: 'Startup Funding Workshop', description: 'Learn how to secure funding for your startup. Meet investors and pitch your ideas.', date: '2026-07-05 14:00:00', location: 'Innovation Hub, Austin', capacity: 150, price: 99.00, category: 'Business', status: 'upcoming' },
  { title: 'Sales & Marketing Bootcamp', description: 'Intensive training on modern sales techniques and digital marketing strategies.', date: '2026-08-20 09:00:00', location: 'Business Center, Chicago', capacity: 200, price: 299.00, category: 'Business', status: 'upcoming' },
  { title: 'Financial Planning Seminar', description: 'Expert advice on personal and business financial planning. Investment strategies included.', date: '2026-09-12 10:00:00', location: 'Finance Center, New York', capacity: 300, price: 149.00, category: 'Business', status: 'upcoming' },
  
  // Arts Events
  { title: 'Modern Art Exhibition', description: 'Explore contemporary art from emerging and established artists. Gallery opening with wine and cheese reception.', date: '2026-07-01 17:00:00', location: 'City Art Gallery, Chicago', capacity: 300, price: 20.00, category: 'Arts', status: 'upcoming' },
  { title: 'Theater Performance: Shakespeare Night', description: 'Classic Shakespeare plays performed by award-winning theater company. A night of drama, comedy, and timeless storytelling.', date: '2026-08-05 19:30:00', location: 'Grand Theater, Boston', capacity: 400, price: 55.00, category: 'Arts', status: 'upcoming' },
  { title: 'Photography Workshop', description: 'Learn professional photography techniques from expert photographers. Includes outdoor shooting session and editing tips.', date: '2026-07-18 10:00:00', location: 'Photo Studio, Portland', capacity: 30, price: 89.00, category: 'Arts', status: 'upcoming' },
  { title: 'Dance Performance', description: 'Contemporary dance performance by internationally acclaimed dance company.', date: '2026-09-15 20:00:00', location: 'Dance Theater, New York', capacity: 500, price: 70.00, category: 'Arts', status: 'upcoming' },
  
  // Food Events
  { title: 'Food & Wine Festival', description: 'Taste dishes from top chefs and sample wines from around the world. Live cooking demonstrations and culinary competitions.', date: '2026-09-15 12:00:00', location: 'Waterfront Park, San Diego', capacity: 2000, price: 65.00, category: 'Food', status: 'upcoming' },
  { title: 'Cooking Masterclass', description: 'Learn to cook gourmet Italian cuisine with celebrity chef. Hands-on class includes recipes and a full meal.', date: '2026-07-12 15:00:00', location: 'Culinary Institute, New York', capacity: 25, price: 125.00, category: 'Food', status: 'upcoming' },
  { title: 'Street Food Festival', description: 'Experience flavors from around the world at this outdoor street food festival. Over 50 food trucks and live entertainment.', date: '2026-08-22 11:00:00', location: 'Downtown Square, Austin', capacity: 5000, price: 15.00, category: 'Food', status: 'upcoming' },
  { title: 'Wine Tasting Event', description: 'Sample premium wines from local and international vineyards.', date: '2026-10-10 18:00:00', location: 'Wine Bar, Napa Valley', capacity: 100, price: 75.00, category: 'Food', status: 'upcoming' },
  
  // Education Events
  { title: 'Career Development Workshop', description: 'Build your career with resume writing, interview skills, and personal branding workshops. Career counselors available.', date: '2026-06-28 09:00:00', location: 'Community Center, Seattle', capacity: 100, price: 49.00, category: 'Education', status: 'upcoming' },
  { title: 'Science Fair for Kids', description: 'Interactive science fair with experiments, demonstrations, and hands-on activities for children ages 6-14.', date: '2026-07-20 10:00:00', location: 'Science Museum, Boston', capacity: 500, price: 10.00, category: 'Education', status: 'upcoming' },
  { title: 'Public Speaking Masterclass', description: 'Overcome your fear of public speaking and learn techniques used by professional speakers. Includes practice sessions.', date: '2026-08-15 14:00:00', location: 'Training Center, Chicago', capacity: 50, price: 99.00, category: 'Education', status: 'upcoming' },
  { title: 'Python Programming for Beginners', description: 'Learn Python from scratch. Hands-on coding exercises and real-world projects.', date: '2026-07-15 10:00:00', location: 'Tech Academy, Seattle', capacity: 80, price: 199.00, category: 'Education', status: 'upcoming' },
  { title: 'Data Science Masterclass', description: 'Advanced data analysis, machine learning, and visualization techniques.', date: '2026-08-22 09:00:00', location: 'University Campus, Boston', capacity: 100, price: 349.00, category: 'Education', status: 'upcoming' },
  { title: 'Creative Writing Workshop', description: 'Develop your writing skills with professional authors. Fiction and non-fiction techniques.', date: '2026-07-28 14:00:00', location: 'Library Hall, Portland', capacity: 50, price: 79.00, category: 'Education', status: 'upcoming' },
  
  // Entertainment Events
  { title: 'Comedy Night Special', description: 'Laugh out loud with top comedians performing stand-up comedy. Adults only, drinks available.', date: '2026-06-22 20:00:00', location: 'Comedy Club, Las Vegas', capacity: 250, price: 40.00, category: 'Entertainment', status: 'upcoming' },
  { title: 'Magic Show Spectacular', description: 'Be amazed by world-class magicians performing incredible illusions and mind-bending tricks. Family-friendly show.', date: '2026-07-30 19:00:00', location: 'Theater Hall, Orlando', capacity: 400, price: 35.00, category: 'Entertainment', status: 'upcoming' },
  { title: 'Movie Night Under the Stars', description: 'Outdoor movie screening of classic films. Bring blankets and enjoy popcorn under the stars. Free for kids under 12.', date: '2026-08-28 20:30:00', location: 'City Park, Denver', capacity: 1000, price: 12.00, category: 'Entertainment', status: 'upcoming' },
  { title: 'Trivia Night Championship', description: 'Test your knowledge in this exciting trivia competition. Prizes for winners!', date: '2026-09-18 19:00:00', location: 'Pub & Grill, Portland', capacity: 150, price: 20.00, category: 'Entertainment', status: 'upcoming' },
  
  // Conference Events
  { title: 'Digital Marketing Conference', description: 'Learn the latest digital marketing strategies from industry experts. SEO, social media, content marketing, and more.', date: '2026-09-10 09:00:00', location: 'Convention Center, Atlanta', capacity: 800, price: 249.00, category: 'Conference', status: 'upcoming' },
  { title: 'Healthcare Innovation Summit', description: 'Discover innovations in healthcare technology, telemedicine, and patient care. CME credits available.', date: '2026-10-05 08:00:00', location: 'Medical Center, Houston', capacity: 600, price: 349.00, category: 'Conference', status: 'upcoming' },
  { title: 'Sustainability & Green Energy Forum', description: 'Discuss climate change solutions, renewable energy, and sustainable business practices. Networking included.', date: '2026-09-25 09:00:00', location: 'Eco Center, Portland', capacity: 400, price: 175.00, category: 'Conference', status: 'upcoming' },
  
  // Health Events
  { title: 'Mental Health Awareness Workshop', description: 'Learn about mental health, stress management, and wellness strategies.', date: '2026-07-10 10:00:00', location: 'Wellness Center, Seattle', capacity: 100, price: 35.00, category: 'Health', status: 'upcoming' },
  { title: 'Nutrition and Fitness Expo', description: 'Discover the latest in nutrition, fitness equipment, and healthy living.', date: '2026-08-15 09:00:00', location: 'Convention Center, Los Angeles', capacity: 2000, price: 25.00, category: 'Health', status: 'upcoming' }
];

async function addCompleteDummyData() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'event_management'
    });

    console.log('✓ Connected to database\n');
    console.log('========================================');
    console.log('ADDING COMPLETE DUMMY DATA');
    console.log('========================================\n');

    // Step 1: Add Categories
    console.log('Step 1: Adding Categories...');
    console.log('----------------------------');
    const categoryMap = {};
    
    for (const cat of categories) {
      const [existing] = await connection.execute(
        'SELECT id FROM categories WHERE name = ?',
        [cat.name]
      );

      if (existing.length > 0) {
        categoryMap[cat.name] = existing[0].id;
        console.log(`⏭️  ${cat.icon} ${cat.name} (already exists)`);
      } else {
        const [result] = await connection.execute(
          'INSERT INTO categories (name, description) VALUES (?, ?)',
          [cat.name, cat.description]
        );
        categoryMap[cat.name] = result.insertId;
        console.log(`✅ ${cat.icon} ${cat.name}`);
      }
    }
    console.log('');

    // Step 2: Get or create organizer
    console.log('Step 2: Getting Organizer...');
    console.log('----------------------------');
    let organizerId;
    
    const [organizers] = await connection.execute(
      "SELECT id FROM users WHERE role IN ('organizer', 'admin') LIMIT 1"
    );

    if (organizers.length > 0) {
      organizerId = organizers[0].id;
      console.log(`✅ Using existing organizer (ID: ${organizerId})`);
    } else {
      const hashedPassword = await bcrypt.hash('organizer123', 10);
      const [result] = await connection.execute(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Event Organizer', 'organizer@test.com', hashedPassword, 'organizer']
      );
      organizerId = result.insertId;
      console.log(`✅ Created new organizer (ID: ${organizerId})`);
    }
    console.log('');

    // Step 3: Add Events
    console.log('Step 3: Adding Events...');
    console.log('------------------------');
    let addedCount = 0;
    let skippedCount = 0;

    for (const event of events) {
      const [existing] = await connection.execute(
        'SELECT id FROM events WHERE title = ?',
        [event.title]
      );

      if (existing.length > 0) {
        console.log(`⏭️  ${event.title}`);
        skippedCount++;
        continue;
      }

      const categoryId = categoryMap[event.category];
      const imageUrl = getPlaceholderImage(800, 400, event.category);

      await connection.execute(
        `INSERT INTO events 
        (title, description, date, location, capacity, available_seats, price, organizer_id, category_id, status, image_url) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          event.title,
          event.description,
          event.date,
          event.location,
          event.capacity,
          event.capacity,
          event.price,
          organizerId,
          categoryId,
          event.status,
          imageUrl
        ]
      );

      console.log(`✅ ${event.title}`);
      addedCount++;
    }
    console.log('');

    // Step 4: Summary
    console.log('========================================');
    console.log('SUMMARY');
    console.log('========================================');
    console.log(`✅ Categories: ${Object.keys(categoryMap).length}`);
    console.log(`✅ Events Added: ${addedCount}`);
    console.log(`⏭️  Events Skipped: ${skippedCount}`);
    console.log('');

    // Step 5: Show stats per category
    console.log('Events per Category:');
    console.log('--------------------');
    for (const [catName, catId] of Object.entries(categoryMap)) {
      const [count] = await connection.execute(
        'SELECT COUNT(*) as count FROM events WHERE category_id = ?',
        [catId]
      );
      const icon = categories.find(c => c.name === catName)?.icon || '📅';
      console.log(`${icon} ${catName}: ${count[0].count} events`);
    }
    console.log('');

    console.log('========================================');
    console.log('✅ COMPLETE! All dummy data added.');
    console.log('========================================\n');
    console.log('All images use reliable placeholder services.');
    console.log('No broken image links!');
    console.log('');
    console.log('Test your app at: http://localhost:3000');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the script
addCompleteDummyData();
