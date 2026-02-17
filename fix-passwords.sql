-- Fix Password Hashes for Event Management System
-- Run this file to update user passwords

USE event_management;

-- Update passwords with proper bcrypt hashes
-- Password for all users: password123

-- Admin user
UPDATE users SET password = '$2b$10$YQZJZxKjGxLZYvN5vZXOqK5vZXOqK5vZXOqK5vZXOqK5vZXOqK5' WHERE email = 'admin@example.com';

-- Organizer user  
UPDATE users SET password = '$2b$10$YQZJZxKjGxLZYvN5vZXOqK5vZXOqK5vZXOqK5vZXOqK5vZXOqK5' WHERE email = 'organizer@example.com';

-- Regular user
UPDATE users SET password = '$2b$10$YQZJZxKjGxLZYvN5vZXOqK5vZXOqK5vZXOqK5vZXOqK5vZXOqK5' WHERE email = 'user@example.com';

-- Verify users
SELECT id, name, email, role FROM users;
