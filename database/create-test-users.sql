-- Create Test Users for Event Management System
-- These users have simple passwords for testing

-- Note: Passwords are hashed with bcrypt
-- Plain text passwords:
-- admin123, organizer123, user123

-- Delete existing test users (optional)
-- DELETE FROM users WHERE email IN ('admin@test.com', 'organizer@test.com', 'user@test.com');

-- Admin User
-- Email: admin@gmail.com
-- Password: admin123
INSERT INTO users (name, email, password, role, phone) VALUES 
('Admin User', 'admin@gmail.com', '$2b$10$kTX0fjGW1/wN.4BRgK1QrePSNjyCHlQxlYL1bYFagJmIYcLAwpcea', 'admin', '1234567890');

-- Admin User (alternative)
-- Email: admin@test.com
-- Password: admin123
INSERT INTO users (name, email, password, role, phone) VALUES 
('Admin User', 'admin@test.com', '$2b$10$kTX0fjGW1/wN.4BRgK1QrePSNjyCHlQxlYL1bYFagJmIYcLAwpcea', 'admin', '1234567890');

-- Organizer User  
-- Email: organizer@test.com
-- Password: organizer123
INSERT INTO users (name, email, password, role, phone) VALUES 
('Event Organizer', 'organizer@test.com', '$2b$10$hA2/ab0.jR7w7zDIyqBf1uyQcaVVYnrZZ8VSWXQdlJ4QPmU0TIHgW', 'organizer', '0987654321');

-- Regular User
-- Email: user@test.com
-- Password: user123
INSERT INTO users (name, email, password, role, phone) VALUES 
('Regular User', 'user@test.com', '$2b$10$dBxIt8ggQzQ9XC.Z.C9b1efhQX5dTh03/J4ME/IPluVNBzpCNZUdO', 'user', '5555555555');

-- Verify users were created
SELECT id, name, email, role FROM users WHERE email LIKE '%@test.com';
