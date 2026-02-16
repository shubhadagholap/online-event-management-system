const mysql = require('mysql2/promise');
require('dotenv').config();

const sampleEvents = [
  {
    title: 'Summer Music Festival 2026',
    description: 'Join us for the biggest music festival of the year featuring top artists from around the world. Experience live performances, food trucks, and amazing vibes!',
    date: '2026-07-15 18:00:00',
    location: 'Central Park, New York',
    capacity: 5000,
    price: 89.99,
    categoryName: 'Music',
    status: 'upcoming',
    image_url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=400&fit=crop'
  },
  {
    title: 'Tech Summit 2026',
    description: 'The premier technology conference featuring keynotes from industry leaders, workshops, and networking opportunities.',
    date: '2026-09-05 09:00:00',
    location: 'Convention Center, San Francisco',
    capacity: 1500,
    price: 299.00,
    categoryName: 'Technology',
    status: 'upcoming',
    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop'
  },
  {
    title: 'City Marathon 2026',
    description: 'Annual city marathon open to runners of all levels. 5K, 10K, and full marathon options available.',
    date: '2026-10-12 07:00:00',
    location: 'Downtown, Boston',
    capacity: 10000,
    price: 50.00,
    categoryName: 'Sports',
    status: 'upcoming',
    image_url: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&h=400&fit=crop'
  },
  {
    title: 'Food & Wine Festival',
    description: 'Taste dishes from top chefs and sample wines from around the world. Live cooking demonstrations included.',
    date: '2026-09-15 12:00:00',
    location: 'Waterfront Park, San Diego',
    capacity: 2000,
    price: 65.00,
    categoryName: 'Food',
    status: 'upcoming',
    image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=400&fit=crop'
  },
  {
    title: 'Modern Art Exhibition',
    description: 'Explore contemporary art from emerging and established artists. Gallery opening with wine and cheese reception.',
    date: '2026-07-01 17:00:00',
    location: 'City Art Gallery, Chicago',
    capacity: 300,
    price: 20.00,
    categoryName: 'Arts',
    status: 'upcoming',
    image_url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=400&fit=crop'
  },
  {
    title: 'Leadership Summit 2026',
    description: 'Develop your leadership skills with workshops, panel discussions, and networking.',
    date: '2026-09-20 09:00:00',
    location: 'Business Center, New York',
    capacity: 500,
    price: 199.00,
    categoryName: 'Business',
    status: 'upcoming',
    image_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=400&fit=crop'
  },
  {
    title: 'Comedy Night Special',
    description: 'Laugh out loud with top comedians performing stand-up comedy. Adults only, drinks available.',
    date: '2026-06-22 20:00:00',
    location: 'Comedy Club, Las Vegas',
    capacity: 250,
    price: 40.00,
    categoryName: 'Entertainment',
    status: 'upcoming',
    image_url: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&h=400&fit=crop'
  },
  {
    title: 'Career Development Workshop',
    description: 'Build your career with resume writing, interview skills, and personal branding workshops.',
    date: '2026-06-28 09:00:00',
    location: 'Community Center, Seattle',
    capacity: 100,
    price: 49.00,
    categoryName: 'Education',
    status: 'upcoming',
    image_url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=400&fit=crop'
  },
  {
    title: 'Jazz Night Live',
    description: 'An intimate evening of smooth jazz with renowned musicians. Enjoy cocktails and fine dining.',
    date: '2026-06-20 20:00:00',
    location: 'Blue Note Jazz Club, Chicago',
    capacity: 200,
    price: 45.00,
    categoryName: 'Music',
    status: 'upcoming',
    image_url: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&h=400&fit=crop'
  },
  {
    title: 'Digital Marketing Conference',
    description: 'Learn the latest digital marketing strategies from industry experts. SEO, social media, and more.',
    date: '2026-09-10 09:00:00',
    location: 'Convention Center, Atlanta',
    capacity: 800,
    price: 249.00,
    categoryName: 'Conference',
    status: 'upcoming',
    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop'
  },
  {
    title: 'Basketball Championship Finals',
    description: 'Watch the championship finals live! The best teams compete for the trophy.',
    date: '2026-06-30 19:00:00',
    location: 'Sports Arena, Los Angeles',
    capacity: 8000,
    price: 75.00,
    categoryName: 'Sports',
    status: 'upcoming',
    image_url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=400&fit=crop'
  },
  {
    title: 'Cooking Masterclass',
    description: 'Learn to cook gourmet Italian cuisine with celebrity chef. Hands-on class includes recipes.',
    date: '2026-07-12 15:00:00',
    location: 'Culinary Institute, New York',
    capacity: 25,
    price: 125.00,
    categoryName: 'Food',
    status: 'upcoming',
    image_url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=400&fit=crop'
  },
  {
    title: 'Rock Concert Extravaganza',
    description: 'The ultimate rock experience with legendary bands performing their greatest hits.',
    date: '2026-08-10 19:00:00',
    location: 'Madison Square Garden, New York',
    capacity: 3000,
    price: 125.00,
    categoryName: 'Music',
    status: 'upcoming',
    image_url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=400&fit=crop'
  },
  {
    title: 'AI & Machine Learning Workshop',
    description: 'Hands-on workshop covering the latest in artificial intelligence and machine learning.',
    date: '2026-07-25 10:00:00',
    location: 'Tech Hub, Seattle',
    capacity: 100,
    price: 149.00,
    categoryName: 'Technology',
    status: 'upcoming',
    image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop'
  },
  {
    title: 'Theater Performance: Shakespeare Night',
    description: 'Classic Shakespeare plays performed by award-winning theater company.',
    date: '2026-08-05 19:30:00',
    location: 'Grand Theater, Boston',
    capacity: 400,
    price: 55.00,
    categoryName: 'Arts',
    status: 'upcoming',
    image_url: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&h=400&fit=crop'
  },
  // Additional Business Events
  {
    title: 'Startup Funding Workshop',
    description: 'Learn how to secure funding for your startup. Meet investors and pitch your ideas.',
    date: '2026-07-05 14:00:00',
    location: 'Innovation Hub, Austin',
    capacity: 150,
    price: 99.00,
    categoryName: 'Business',
    status: 'upcoming',
    image_url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop'
  },
  {
    title: 'Sales & Marketing Bootcamp',
    description: 'Intensive training on modern sales techniques and digital marketing strategies.',
    date: '2026-08-20 09:00:00',
    location: 'Business Center, Chicago',
    capacity: 200,
    price: 299.00,
    categoryName: 'Business',
    status: 'upcoming',
    image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop'
  },
  {
    title: 'Financial Planning Seminar',
    description: 'Expert advice on personal and business financial planning. Investment strategies included.',
    date: '2026-09-12 10:00:00',
    location: 'Finance Center, New York',
    capacity: 300,
    price: 149.00,
    categoryName: 'Business',
    status: 'upcoming',
    image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop'
  },
  {
    title: 'Women in Business Summit',
    description: 'Empowering women entrepreneurs and business leaders. Networking and mentorship opportunities.',
    date: '2026-10-08 09:00:00',
    location: 'Convention Center, San Francisco',
    capacity: 500,
    price: 179.00,
    categoryName: 'Business',
    status: 'upcoming',
    image_url: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=400&fit=crop'
  },
  {
    title: 'Real Estate Investment Conference',
    description: 'Learn about real estate investing, property management, and market trends.',
    date: '2026-09-28 08:30:00',
    location: 'Hotel Conference Hall, Miami',
    capacity: 250,
    price: 249.00,
    categoryName: 'Business',
    status: 'upcoming',
    image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop'
  },
  // Additional Education Events
  {
    title: 'Python Programming for Beginners',
    description: 'Learn Python from scratch. Hands-on coding exercises and real-world projects.',
    date: '2026-07-15 10:00:00',
    location: 'Tech Academy, Seattle',
    capacity: 80,
    price: 199.00,
    categoryName: 'Education',
    status: 'upcoming',
    image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=400&fit=crop'
  },
  {
    title: 'Data Science Masterclass',
    description: 'Advanced data analysis, machine learning, and visualization techniques.',
    date: '2026-08-22 09:00:00',
    location: 'University Campus, Boston',
    capacity: 100,
    price: 349.00,
    categoryName: 'Education',
    status: 'upcoming',
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop'
  },
  {
    title: 'Creative Writing Workshop',
    description: 'Develop your writing skills with professional authors. Fiction and non-fiction techniques.',
    date: '2026-07-28 14:00:00',
    location: 'Library Hall, Portland',
    capacity: 50,
    price: 79.00,
    categoryName: 'Education',
    status: 'upcoming',
    image_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=400&fit=crop'
  },
  {
    title: 'Language Learning Expo',
    description: 'Explore different languages and cultures. Free trial classes and resources.',
    date: '2026-09-18 11:00:00',
    location: 'Cultural Center, Los Angeles',
    capacity: 300,
    price: 25.00,
    categoryName: 'Education',
    status: 'upcoming',
    image_url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&h=400&fit=crop'
  },
  {
    title: 'STEM Education Fair',
    description: 'Science, Technology, Engineering, and Math activities for students and educators.',
    date: '2026-10-15 09:00:00',
    location: 'Science Museum, Chicago',
    capacity: 500,
    price: 15.00,
    categoryName: 'Education',
    status: 'upcoming',
    image_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=400&fit=crop'
  },
  {
    title: 'Teacher Professional Development',
    description: 'Training for educators on modern teaching methods and classroom technology.',
    date: '2026-08-30 08:00:00',
    location: 'Education Center, Denver',
    capacity: 150,
    price: 129.00,
    categoryName: 'Education',
    status: 'upcoming',
    image_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=400&fit=crop'
  }
];

async function addSampleEvents() {
  let connection;
  
  try {
    // Create database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'event_management'
    });

    console.log('Connected to database');

    // Get the first organizer user
    const [organizers] = await connection.execute(
      "SELECT id FROM users WHERE role = 'organizer' LIMIT 1"
    );

    if (organizers.length === 0) {
      console.error('No organizer found! Please create an organizer user first.');
      return;
    }

    const organizerId = organizers[0].id;
    console.log(`Using organizer ID: ${organizerId}`);

    // Get all categories
    const [categories] = await connection.execute('SELECT id, name FROM categories');
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat.id;
    });

    console.log('Available categories:', Object.keys(categoryMap));

    let addedCount = 0;
    let skippedCount = 0;

    // Add each event
    for (const event of sampleEvents) {
      // Check if event already exists
      const [existing] = await connection.execute(
        'SELECT id FROM events WHERE title = ?',
        [event.title]
      );

      if (existing.length > 0) {
        console.log(`⏭️  Skipped: "${event.title}" (already exists)`);
        skippedCount++;
        continue;
      }

      // Find category ID
      let categoryId = null;
      for (const [catName, catId] of Object.entries(categoryMap)) {
        if (catName.toLowerCase().includes(event.categoryName.toLowerCase()) ||
            event.categoryName.toLowerCase().includes(catName.toLowerCase())) {
          categoryId = catId;
          break;
        }
      }

      // Insert event
      await connection.execute(
        `INSERT INTO events 
        (title, description, date, location, capacity, price, category_id, organizer_id, status, image_url) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          event.title,
          event.description,
          event.date,
          event.location,
          event.capacity,
          event.price,
          categoryId,
          organizerId,
          event.status,
          event.image_url
        ]
      );

      console.log(`✅ Added: "${event.title}"`);
      addedCount++;
    }

    console.log('\n=================================');
    console.log(`✅ Successfully added ${addedCount} events`);
    console.log(`⏭️  Skipped ${skippedCount} existing events`);
    console.log('=================================\n');

  } catch (error) {
    console.error('Error adding sample events:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the script
addSampleEvents();
