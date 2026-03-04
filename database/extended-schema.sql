-- Extended Event Management System Database Schema
-- Supporting comprehensive event management modules

USE event_management;

-- Event Planning and Setup Tables
CREATE TABLE event_templates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category_id INT,
    default_capacity INT DEFAULT 100,
    default_duration INT DEFAULT 120, -- minutes
    template_data JSON, -- Store template configuration
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE event_schedules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    session_title VARCHAR(200) NOT NULL,
    description TEXT,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    location VARCHAR(255),
    speaker_id INT,
    session_type ENUM('keynote', 'session', 'workshop', 'break', 'networking') DEFAULT 'session',
    max_attendees INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (speaker_id) REFERENCES users(id)
);

-- Speaker and Content Management
CREATE TABLE speakers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(200),
    bio TEXT,
    title VARCHAR(200),
    company VARCHAR(200),
    profile_image VARCHAR(500),
    social_links JSON, -- LinkedIn, Twitter, etc.
    expertise_areas JSON, -- Array of expertise topics
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_events INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE presentations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    schedule_id INT NOT NULL,
    title VARCHAR(300) NOT NULL,
    description TEXT,
    presentation_file VARCHAR(500),
    video_url VARCHAR(500),
    materials JSON, -- Additional materials/links
    status ENUM('draft', 'ready', 'presented') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (schedule_id) REFERENCES event_schedules(id) ON DELETE CASCADE
);

-- Registration and Attendee Management
CREATE TABLE registration_forms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    form_fields JSON NOT NULL, -- Dynamic form configuration
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE TABLE attendee_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    registration_data JSON, -- Custom form responses
    dietary_requirements TEXT,
    accessibility_needs TEXT,
    networking_preferences JSON,
    check_in_time TIMESTAMP NULL,
    attendance_status ENUM('registered', 'checked_in', 'attended', 'no_show') DEFAULT 'registered',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    UNIQUE KEY unique_attendee_event (user_id, event_id)
);

CREATE TABLE session_attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    schedule_id INT NOT NULL,
    user_id INT NOT NULL,
    check_in_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    feedback_rating INT CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
    feedback_comment TEXT,
    FOREIGN KEY (schedule_id) REFERENCES event_schedules(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_session_attendance (schedule_id, user_id)
);

-- Marketing and Communication
CREATE TABLE email_campaigns (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    campaign_name VARCHAR(200) NOT NULL,
    subject VARCHAR(300) NOT NULL,
    content TEXT NOT NULL,
    template_type ENUM('invitation', 'reminder', 'follow_up', 'announcement') DEFAULT 'announcement',
    target_audience JSON, -- Criteria for targeting
    scheduled_time DATETIME,
    sent_time TIMESTAMP NULL,
    status ENUM('draft', 'scheduled', 'sent', 'cancelled') DEFAULT 'draft',
    open_rate DECIMAL(5,2) DEFAULT 0.00,
    click_rate DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE TABLE email_tracking (
    id INT PRIMARY KEY AUTO_INCREMENT,
    campaign_id INT NOT NULL,
    user_id INT NOT NULL,
    email VARCHAR(200) NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    opened_at TIMESTAMP NULL,
    clicked_at TIMESTAMP NULL,
    bounced BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (campaign_id) REFERENCES email_campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE social_media_posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    platform ENUM('facebook', 'twitter', 'linkedin', 'instagram') NOT NULL,
    content TEXT NOT NULL,
    media_urls JSON,
    scheduled_time DATETIME,
    posted_time TIMESTAMP NULL,
    status ENUM('draft', 'scheduled', 'posted', 'failed') DEFAULT 'draft',
    engagement_metrics JSON, -- likes, shares, comments
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Engagement and Networking
CREATE TABLE networking_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    session_name VARCHAR(200) NOT NULL,
    description TEXT,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    max_participants INT DEFAULT 50,
    session_type ENUM('speed_networking', 'roundtable', 'mixer', 'breakout') DEFAULT 'mixer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE TABLE networking_matches (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    user1_id INT NOT NULL,
    user2_id INT NOT NULL,
    match_score DECIMAL(3,2) DEFAULT 0.00,
    status ENUM('suggested', 'connected', 'declined') DEFAULT 'suggested',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user1_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (user2_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_match (event_id, user1_id, user2_id)
);

CREATE TABLE event_polls (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    question TEXT NOT NULL,
    options JSON NOT NULL, -- Array of poll options
    poll_type ENUM('single_choice', 'multiple_choice', 'rating', 'text') DEFAULT 'single_choice',
    is_active BOOLEAN DEFAULT TRUE,
    start_time DATETIME,
    end_time DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE TABLE poll_responses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    poll_id INT NOT NULL,
    user_id INT NOT NULL,
    response JSON NOT NULL, -- User's response(s)
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (poll_id) REFERENCES event_polls(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_poll_response (poll_id, user_id)
);

CREATE TABLE event_feedback (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    overall_rating INT CHECK (overall_rating >= 1 AND overall_rating <= 5),
    content_rating INT CHECK (content_rating >= 1 AND content_rating <= 5),
    organization_rating INT CHECK (organization_rating >= 1 AND organization_rating <= 5),
    venue_rating INT CHECK (venue_rating >= 1 AND venue_rating <= 5),
    comments TEXT,
    would_recommend BOOLEAN,
    suggestions TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_event_feedback (event_id, user_id)
);

-- Virtual and Hybrid Event Support
CREATE TABLE virtual_rooms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    room_name VARCHAR(200) NOT NULL,
    room_type ENUM('main_stage', 'breakout', 'networking', 'exhibition') DEFAULT 'main_stage',
    platform ENUM('zoom', 'teams', 'webex', 'custom') DEFAULT 'zoom',
    room_url VARCHAR(500),
    access_code VARCHAR(100),
    max_participants INT DEFAULT 100,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE TABLE virtual_attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    room_id INT NOT NULL,
    user_id INT NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP NULL,
    duration_minutes INT DEFAULT 0,
    interaction_score INT DEFAULT 0, -- Based on chat, polls, etc.
    FOREIGN KEY (room_id) REFERENCES virtual_rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE chat_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    room_id INT NOT NULL,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    message_type ENUM('text', 'emoji', 'file', 'poll') DEFAULT 'text',
    is_private BOOLEAN DEFAULT FALSE,
    recipient_id INT NULL, -- For private messages
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES virtual_rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Analytics and Reporting
CREATE TABLE event_analytics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(10,2) NOT NULL,
    metric_date DATE NOT NULL,
    additional_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    INDEX idx_event_metric_date (event_id, metric_name, metric_date)
);

CREATE TABLE user_activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    activity_type VARCHAR(100) NOT NULL, -- 'page_view', 'session_join', 'poll_vote', etc.
    activity_data JSON,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    INDEX idx_user_event_activity (user_id, event_id, activity_type)
);

-- Logistics and Resources
CREATE TABLE event_resources (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    resource_name VARCHAR(200) NOT NULL,
    resource_type ENUM('equipment', 'venue', 'catering', 'transport', 'staff', 'other') NOT NULL,
    description TEXT,
    quantity INT DEFAULT 1,
    cost DECIMAL(10,2) DEFAULT 0.00,
    supplier_info JSON,
    booking_status ENUM('requested', 'confirmed', 'delivered', 'returned') DEFAULT 'requested',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE TABLE event_tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    task_title VARCHAR(200) NOT NULL,
    description TEXT,
    assigned_to INT,
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    due_date DATETIME,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);

-- Extend existing events table with new fields
ALTER TABLE events ADD COLUMN event_type ENUM('in_person', 'virtual', 'hybrid') DEFAULT 'in_person';
ALTER TABLE events ADD COLUMN registration_deadline DATETIME NULL;
ALTER TABLE events ADD COLUMN max_attendees INT DEFAULT 100;
ALTER TABLE events ADD COLUMN min_attendees INT DEFAULT 1;
ALTER TABLE events ADD COLUMN event_tags JSON NULL;
ALTER TABLE events ADD COLUMN custom_fields JSON NULL;
ALTER TABLE events ADD COLUMN approval_status ENUM('draft', 'pending', 'approved', 'rejected') DEFAULT 'draft';
ALTER TABLE events ADD COLUMN approved_by INT NULL;
ALTER TABLE events ADD COLUMN approved_at TIMESTAMP NULL;

-- Add foreign key for approval
ALTER TABLE events ADD FOREIGN KEY (approved_by) REFERENCES users(id);

-- Extend users table for enhanced profiles
ALTER TABLE users ADD COLUMN profile_image VARCHAR(500) NULL;
ALTER TABLE users ADD COLUMN bio TEXT NULL;
ALTER TABLE users ADD COLUMN company VARCHAR(200) NULL;
ALTER TABLE users ADD COLUMN job_title VARCHAR(200) NULL;
ALTER TABLE users ADD COLUMN social_links JSON NULL;
ALTER TABLE users ADD COLUMN interests JSON NULL;
ALTER TABLE users ADD COLUMN notification_preferences JSON NULL;
ALTER TABLE users ADD COLUMN timezone VARCHAR(100) DEFAULT 'UTC';
ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN last_login TIMESTAMP NULL;

-- Create indexes for better performance
CREATE INDEX idx_events_type_status ON events(event_type, status);
CREATE INDEX idx_events_date_status ON events(date, status);
CREATE INDEX idx_attendee_profiles_event ON attendee_profiles(event_id, attendance_status);
CREATE INDEX idx_session_attendance_schedule ON session_attendance(schedule_id);
CREATE INDEX idx_email_tracking_campaign ON email_tracking(campaign_id, opened_at);
CREATE INDEX idx_analytics_event_date ON event_analytics(event_id, metric_date);
CREATE INDEX idx_activity_logs_timestamp ON user_activity_logs(timestamp);

-- Insert sample data for testing
INSERT INTO speakers (name, email, bio, title, company, expertise_areas) VALUES
('Dr. Sarah Johnson', 'sarah.johnson@techcorp.com', 'Leading AI researcher with 15+ years experience', 'Chief AI Officer', 'TechCorp Inc.', '["Artificial Intelligence", "Machine Learning", "Data Science"]'),
('Mark Thompson', 'mark.t@innovate.com', 'Digital transformation expert and keynote speaker', 'VP of Innovation', 'Innovate Solutions', '["Digital Transformation", "Leadership", "Strategy"]'),
('Lisa Chen', 'lisa.chen@startup.io', 'Successful entrepreneur and startup mentor', 'Founder & CEO', 'StartupIO', '["Entrepreneurship", "Startups", "Venture Capital"]');

INSERT INTO event_templates (name, description, category_id, default_capacity, default_duration, created_by) VALUES
('Tech Conference Template', 'Standard template for technology conferences', 1, 500, 480, 1),
('Workshop Template', 'Template for hands-on workshops', 5, 50, 180, 1),
('Networking Event Template', 'Template for networking events', 4, 100, 120, 1);

-- Sample virtual rooms
INSERT INTO virtual_rooms (event_id, room_name, room_type, platform, max_participants) VALUES
(1, 'Main Auditorium', 'main_stage', 'zoom', 500),
(1, 'Workshop Room A', 'breakout', 'zoom', 50),
(1, 'Networking Lounge', 'networking', 'zoom', 100);

-- Sample event schedules
INSERT INTO event_schedules (event_id, session_title, description, start_time, end_time, speaker_id, session_type) VALUES
(1, 'Opening Keynote: Future of AI', 'Exploring the latest trends in artificial intelligence', '2026-03-15 09:00:00', '2026-03-15 10:00:00', 1, 'keynote'),
(1, 'Workshop: Machine Learning Basics', 'Hands-on introduction to ML concepts', '2026-03-15 10:30:00', '2026-03-15 12:00:00', 1, 'workshop'),
(1, 'Panel: Digital Transformation', 'Industry leaders discuss digital transformation', '2026-03-15 14:00:00', '2026-03-15 15:30:00', 2, 'session');

COMMIT;