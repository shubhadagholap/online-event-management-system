-- Event Management System Database Schema

CREATE DATABASE IF NOT EXISTS event_management;
USE event_management;

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

-- Sample seed data
-- Note: Run backend/generateHash.js to generate password hashes
-- Default passwords: admin123, organizer123, user123
-- You MUST update these hashes before using in production!
INSERT INTO users (name, email, password, role, phone) VALUES
('Admin User', 'admin@example.com', '$2b$10$rQZ5YJZxKjGxLZYvN5vZXOqK5vZXOqK5vZXOqK5vZXOqK5vZXOqK5', 'admin', '1234567890'),
('John Organizer', 'organizer@example.com', '$2b$10$rQZ5YJZxKjGxLZYvN5vZXOqK5vZXOqK5vZXOqK5vZXOqK5vZXOqK5', 'organizer', '0987654321'),
('Jane Attendee', 'user@example.com', '$2b$10$rQZ5YJZxKjGxLZYvN5vZXOqK5vZXOqK5vZXOqK5vZXOqK5vZXOqK5', 'user', '5555555555');

INSERT INTO categories (name, description) VALUES
('Technology', 'Tech conferences and workshops'),
('Music', 'Concerts and music festivals'),
('Sports', 'Sports events and tournaments'),
('Business', 'Business conferences and networking'),
('Education', 'Educational seminars and workshops');

INSERT INTO events (title, description, date, location, capacity, available_seats, price, organizer_id, category_id) VALUES
('Tech Summit 2026', 'Annual technology conference', '2026-03-15 09:00:00', 'Convention Center, NYC', 500, 500, 99.99, 2, 1),
('Rock Festival', 'Summer music festival', '2026-06-20 18:00:00', 'Central Park', 1000, 1000, 149.99, 2, 2),
('Marathon 2026', 'City marathon event', '2026-04-10 07:00:00', 'City Stadium', 300, 300, 25.00, 2, 3);
