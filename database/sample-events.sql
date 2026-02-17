-- Sample Events Data
-- Make sure you have categories and users (organizers) in your database first

-- Insert sample events
-- Note: Replace organizer_id with actual organizer user IDs from your users table
-- Replace category_id with actual category IDs from your categories table

-- Music Events
INSERT INTO events (title, description, date, location, capacity, price, category_id, organizer_id, status, image_url) VALUES
('Summer Music Festival 2026', 'Join us for the biggest music festival of the year featuring top artists from around the world. Experience live performances, food trucks, and amazing vibes!', '2026-07-15 18:00:00', 'Central Park, New York', 5000, 89.99, 1, 2, 'upcoming', 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800'),
('Jazz Night Live', 'An intimate evening of smooth jazz with renowned musicians. Enjoy cocktails and fine dining while listening to classic jazz standards.', '2026-06-20 20:00:00', 'Blue Note Jazz Club, Chicago', 200, 45.00, 1, 2, 'upcoming', 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800'),
('Rock Concert Extravaganza', 'The ultimate rock experience with legendary bands performing their greatest hits. Get ready to rock!', '2026-08-10 19:00:00', 'Madison Square Garden, New York', 3000, 125.00, 1, 2, 'upcoming', 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800');

-- Technology Events
INSERT INTO events (title, description, date, location, capacity, price, category_id, organizer_id, status, image_url) VALUES
('Tech Summit 2026', 'The premier technology conference featuring keynotes from industry leaders, workshops, and networking opportunities. Learn about AI, Cloud, and emerging technologies.', '2026-09-05 09:00:00', 'Convention Center, San Francisco', 1500, 299.00, 2, 2, 'upcoming', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'),
('AI & Machine Learning Workshop', 'Hands-on workshop covering the latest in artificial intelligence and machine learning. Bring your laptop and learn by doing!', '2026-07-25 10:00:00', 'Tech Hub, Seattle', 100, 149.00, 2, 2, 'upcoming', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800'),
('Startup Pitch Competition', 'Watch innovative startups pitch their ideas to top investors. Network with entrepreneurs and VCs. Cash prizes for winners!', '2026-08-18 14:00:00', 'Innovation Center, Austin', 300, 25.00, 2, 2, 'upcoming', 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800');

-- Sports Events
INSERT INTO events (title, description, date, location, capacity, price, category_id, organizer_id, status, image_url) VALUES
('City Marathon 2026', 'Annual city marathon open to runners of all levels. 5K, 10K, and full marathon options available. Register now!', '2026-10-12 07:00:00', 'Downtown, Boston', 10000, 50.00, 3, 2, 'upcoming', 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800'),
('Basketball Championship Finals', 'Watch the championship finals live! The best teams compete for the trophy. Don\'t miss this exciting match!', '2026-06-30 19:00:00', 'Sports Arena, Los Angeles', 8000, 75.00, 3, 2, 'upcoming', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800'),
('Yoga & Wellness Retreat', 'A weekend retreat focused on yoga, meditation, and wellness. Includes meals, accommodation, and expert instructors.', '2026-07-08 08:00:00', 'Mountain Resort, Colorado', 50, 399.00, 3, 2, 'upcoming', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800');

-- Business Events
INSERT INTO events (title, description, date, location, capacity, price, category_id, organizer_id, status, image_url) VALUES
('Leadership Summit 2026', 'Develop your leadership skills with workshops, panel discussions, and networking. Learn from successful CEOs and executives.', '2026-09-20 09:00:00', 'Business Center, New York', 500, 199.00, 4, 2, 'upcoming', 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800'),
('Entrepreneurship Bootcamp', 'Intensive 3-day bootcamp for aspiring entrepreneurs. Learn business planning, funding strategies, and growth tactics.', '2026-08-01 09:00:00', 'Startup Hub, San Francisco', 150, 499.00, 4, 2, 'upcoming', 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800'),
('Networking Mixer', 'Professional networking event for business leaders and entrepreneurs. Includes drinks, appetizers, and speed networking sessions.', '2026-06-25 18:00:00', 'Rooftop Lounge, Miami', 200, 35.00, 4, 2, 'upcoming', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800');

-- Arts & Culture Events
INSERT INTO events (title, description, date, location, capacity, price, category_id, organizer_id, status, image_url) VALUES
('Modern Art Exhibition', 'Explore contemporary art from emerging and established artists. Gallery opening with wine and cheese reception.', '2026-07-01 17:00:00', 'City Art Gallery, Chicago', 300, 20.00, 5, 2, 'upcoming', 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800'),
('Theater Performance: Shakespeare Night', 'Classic Shakespeare plays performed by award-winning theater company. A night of drama, comedy, and timeless storytelling.', '2026-08-05 19:30:00', 'Grand Theater, London', 400, 55.00, 5, 2, 'upcoming', 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800'),
('Photography Workshop', 'Learn professional photography techniques from expert photographers. Includes outdoor shooting session and editing tips.', '2026-07-18 10:00:00', 'Photo Studio, Portland', 30, 89.00, 5, 2, 'upcoming', 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800');

-- Food & Dining Events
INSERT INTO events (title, description, date, location, capacity, price, category_id, organizer_id, status, image_url) VALUES
('Food & Wine Festival', 'Taste dishes from top chefs and sample wines from around the world. Live cooking demonstrations and culinary competitions.', '2026-09-15 12:00:00', 'Waterfront Park, San Diego', 2000, 65.00, 6, 2, 'upcoming', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800'),
('Cooking Masterclass with Chef Marco', 'Learn to cook gourmet Italian cuisine with celebrity chef Marco. Hands-on class includes recipes and a full meal.', '2026-07-12 15:00:00', 'Culinary Institute, New York', 25, 125.00, 6, 2, 'upcoming', 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800'),
('Street Food Festival', 'Experience flavors from around the world at this outdoor street food festival. Over 50 food trucks and live entertainment.', '2026-08-22 11:00:00', 'Downtown Square, Austin', 5000, 15.00, 6, 2, 'upcoming', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800');

-- Education Events
INSERT INTO events (title, description, date, location, capacity, price, category_id, organizer_id, status, image_url) VALUES
('Career Development Workshop', 'Build your career with resume writing, interview skills, and personal branding workshops. Career counselors available.', '2026-06-28 09:00:00', 'Community Center, Seattle', 100, 49.00, 7, 2, 'upcoming', 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800'),
('Science Fair for Kids', 'Interactive science fair with experiments, demonstrations, and hands-on activities for children ages 6-14.', '2026-07-20 10:00:00', 'Science Museum, Boston', 500, 10.00, 7, 2, 'upcoming', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800'),
('Public Speaking Masterclass', 'Overcome your fear of public speaking and learn techniques used by professional speakers. Includes practice sessions.', '2026-08-15 14:00:00', 'Training Center, Chicago', 50, 99.00, 7, 2, 'upcoming', 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800');

-- Entertainment Events
INSERT INTO events (title, description, date, location, capacity, price, category_id, organizer_id, status, image_url) VALUES
('Comedy Night Special', 'Laugh out loud with top comedians performing stand-up comedy. Adults only, drinks available.', '2026-06-22 20:00:00', 'Comedy Club, Las Vegas', 250, 40.00, 8, 2, 'upcoming', 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800'),
('Magic Show Spectacular', 'Be amazed by world-class magicians performing incredible illusions and mind-bending tricks. Family-friendly show.', '2026-07-30 19:00:00', 'Theater Hall, Orlando', 400, 35.00, 8, 2, 'upcoming', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800'),
('Movie Night Under the Stars', 'Outdoor movie screening of classic films. Bring blankets and enjoy popcorn under the stars. Free for kids under 12.', '2026-08-28 20:30:00', 'City Park, Denver', 1000, 12.00, 8, 2, 'upcoming', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800');

-- Conference Events
INSERT INTO events (title, description, date, location, capacity, price, category_id, organizer_id, status, image_url) VALUES
('Digital Marketing Conference', 'Learn the latest digital marketing strategies from industry experts. SEO, social media, content marketing, and more.', '2026-09-10 09:00:00', 'Convention Center, Atlanta', 800, 249.00, 9, 2, 'upcoming', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'),
('Healthcare Innovation Summit', 'Discover innovations in healthcare technology, telemedicine, and patient care. CME credits available.', '2026-10-05 08:00:00', 'Medical Center, Houston', 600, 349.00, 9, 2, 'upcoming', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800'),
('Sustainability & Green Energy Forum', 'Discuss climate change solutions, renewable energy, and sustainable business practices. Networking included.', '2026-09-25 09:00:00', 'Eco Center, Portland', 400, 175.00, 9, 2, 'upcoming', 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800');

-- Note: Make sure to update the category_id and organizer_id values based on your actual database IDs
-- You can check your categories with: SELECT * FROM categories;
-- You can check your organizers with: SELECT id, name, role FROM users WHERE role = 'organizer';
