# Database Setup Guide - IMPORTANT!

## 🚨 Your Issue: Database Not Set Up

You're seeing:
- ❌ Login doesn't work
- ❌ Register doesn't work  
- ❌ No events showing
- ❌ Empty database

**Reason**: The database schema hasn't been imported yet!

## ✅ Complete Database Setup

### Step 1: Create Database

Open MySQL command line or MySQL Workbench:

```bash
# Option A: Command Line
mysql -u root -p
```

Then run:
```sql
CREATE DATABASE event_management;
exit;
```

### Step 2: Import Schema

```bash
# Import the schema file
mysql -u root -p event_management < database/schema.sql
```

**Or if you're in a different directory**:
```bash
mysql -u root -p event_management < "C:\Users\HRUSHIKESH G\Desktop\online event manage system\database\schema.sql"
```

### Step 3: Verify Data Was Imported

```bash
mysql -u root -p event_management
```

Then check:
```sql
-- Check users
SELECT * FROM users;

-- Check events
SELECT * FROM events;

-- Check categories
SELECT * FROM categories;

exit;
```

You should see:
- 3 users (admin, organizer, user)
- 3 events (Tech Summit, Rock Festival, Marathon)
- 5 categories (Technology, Music, Sports, Business, Education)

## 🔧 Alternative: Manual Database Setup

If the schema import fails, create tables manually:

### 1. Create Database
```sql
CREATE DATABASE event_management;
USE event_management;
```

### 2. Create Tables

```sql
-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'organizer', 'user') DEFAULT 'user',
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    date DATETIME NOT NULL,
    location VARCHAR(255),
    capacity INT DEFAULT 100,
    available_seats INT DEFAULT 100,
    price DECIMAL(10, 2) DEFAULT 0.00,
    image_url VARCHAR(255),
    organizer_id INT NOT NULL,
    category_id INT,
    status ENUM('upcoming', 'ongoing', 'completed', 'cancelled') DEFAULT 'upcoming',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Bookings table
CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
    total_amount DECIMAL(10, 2),
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Tickets table
CREATE TABLE tickets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    qr_code VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);
```

### 3. Generate Password Hashes

```bash
cd backend
node generateHash.js
```

This will show you password hashes. Copy them for the next step.

### 4. Insert Sample Data

```sql
-- Insert users (replace the password hashes with ones from generateHash.js)
INSERT INTO users (name, email, password, role, phone) VALUES
('Admin User', 'admin@example.com', '$2b$10$HASH_HERE', 'admin', '1234567890'),
('John Organizer', 'organizer@example.com', '$2b$10$HASH_HERE', 'organizer', '0987654321'),
('Jane Attendee', 'user@example.com', '$2b$10$HASH_HERE', 'user', '5555555555');

-- Insert categories
INSERT INTO categories (name, description) VALUES
('Technology', 'Tech conferences and workshops'),
('Music', 'Concerts and music festivals'),
('Sports', 'Sports events and tournaments'),
('Business', 'Business conferences and networking'),
('Education', 'Educational seminars and workshops');

-- Insert events (use organizer_id = 2 from users table)
INSERT INTO events (title, description, date, location, capacity, available_seats, price, organizer_id, category_id) VALUES
('Tech Summit 2026', 'Annual technology conference', '2026-03-15 09:00:00', 'Convention Center, NYC', 500, 500, 99.99, 2, 1),
('Rock Festival', 'Summer music festival', '2026-06-20 18:00:00', 'Central Park', 1000, 1000, 149.99, 2, 2),
('Marathon 2026', 'City marathon event', '2026-04-10 07:00:00', 'City Stadium', 300, 300, 25.00, 2, 3);
```

## 🔐 Quick Setup with Default Passwords

For testing, you can use these pre-hashed passwords (password: "password123"):

```sql
-- Users with password: password123
INSERT INTO users (name, email, password, role, phone) VALUES
('Admin User', 'admin@example.com', '$2b$10$rQZ5YJZxKjGxLZYvN5vZXOqK5vZXOqK5vZXOqK5vZXOqK5vZXOqK5', 'admin', '1234567890'),
('John Organizer', 'organizer@example.com', '$2b$10$rQZ5YJZxKjGxLZYvN5vZXOqK5vZXOqK5vZXOqK5vZXOqK5vZXOqK5', 'organizer', '0987654321'),
('Jane Attendee', 'user@example.com', '$2b$10$rQZ5YJZxKjGxLZYvN5vZXOqK5vZXOqK5vZXOqK5vZXOqK5vZXOqK5', 'user', '5555555555');
```

**Note**: These are placeholder hashes. For actual use, run `node backend/generateHash.js` to get real hashes.

## 🎯 After Database Setup

### 1. Restart Backend
```bash
cd backend
npm start
```

### 2. Test API
Open browser and check:
- http://localhost:5000/api/health
- http://localhost:5000/api/events
- http://localhost:5000/api/categories

You should see data!

### 3. Test Frontend
Open `frontend-cdn/app.html` and:
- You should see events on homepage
- Login with: admin@example.com / password123
- Register new users
- Browse events

## 🐛 Troubleshooting

### "Database doesn't exist"
```sql
CREATE DATABASE event_management;
```

### "Table doesn't exist"
- Import schema.sql again
- Or create tables manually (see above)

### "Access denied for user"
- Check MySQL username/password
- Update `backend/.env` with correct credentials

### "Cannot connect to database"
- Make sure MySQL is running
- Check `backend/.env` configuration:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=event_management
```

### "No events showing"
- Check if events were inserted:
```sql
USE event_management;
SELECT * FROM events;
```
- If empty, insert sample events (see above)

### "Login fails"
- Check if users exist:
```sql
SELECT * FROM users;
```
- If empty, insert users (see above)
- Make sure password hashes are correct

## ✅ Verification Checklist

- [ ] MySQL is running
- [ ] Database `event_management` created
- [ ] All 5 tables created (users, events, categories, bookings, tickets)
- [ ] Sample users inserted (3 users)
- [ ] Sample categories inserted (5 categories)
- [ ] Sample events inserted (3 events)
- [ ] Backend .env configured with correct DB credentials
- [ ] Backend running without errors
- [ ] Can access http://localhost:5000/api/events
- [ ] Frontend shows events
- [ ] Can login with test credentials

## 🎉 Success Indicators

When everything is set up correctly:

1. **Backend logs show**:
```
✓ MySQL Database connected successfully
✓ Server is running on port 5000
```

2. **API returns data**:
- http://localhost:5000/api/events → Shows 3 events
- http://localhost:5000/api/categories → Shows 5 categories

3. **Frontend works**:
- Homepage shows 3 upcoming events
- Can login with admin@example.com / password123
- Can register new users
- Can browse and search events

## 📞 Quick Commands Reference

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE event_management;"

# Import schema
mysql -u root -p event_management < database/schema.sql

# Check data
mysql -u root -p event_management -e "SELECT * FROM users;"
mysql -u root -p event_management -e "SELECT * FROM events;"

# Start backend
cd backend
npm start

# Open frontend
cd frontend-cdn
# Double-click app.html
```

---

**The database setup is REQUIRED for the system to work!**
