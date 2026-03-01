const db = require('./config/db');

async function addModulesTables() {
  try {
    console.log('Creating Payment, Notification, Feedback, Analytics & Certificate tables...');

    // 1. Payments table
    await db.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        booking_id INT NOT NULL,
        user_id INT NOT NULL,
        event_id INT NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        payment_method ENUM('upi', 'card', 'netbanking') NOT NULL,
        transaction_id VARCHAR(255) UNIQUE,
        status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
        payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        confirmation_number VARCHAR(255),
        FOREIGN KEY (booking_id) REFERENCES bookings(id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (event_id) REFERENCES events(id)
      )
    `);
    console.log('✓ Payments table created');

    // 2. Notifications table
    await db.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        event_id INT,
        type ENUM('email', 'sms', 'in-app') DEFAULT 'email',
        subject VARCHAR(255),
        message TEXT,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (event_id) REFERENCES events(id)
      )
    `);
    console.log('✓ Notifications table created');

    // 3. Announcements table
    await db.query(`
      CREATE TABLE IF NOT EXISTS announcements (
        id INT PRIMARY KEY AUTO_INCREMENT,
        admin_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME,
        FOREIGN KEY (admin_id) REFERENCES users(id)
      )
    `);
    console.log('✓ Announcements table created');

    // 4. Feedback & Ratings table
    await db.query(`
      CREATE TABLE IF NOT EXISTS feedback (
        id INT PRIMARY KEY AUTO_INCREMENT,
        event_id INT NOT NULL,
        user_id INT NOT NULL,
        rating INT CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_event_user (event_id, user_id),
        FOREIGN KEY (event_id) REFERENCES events(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    console.log('✓ Feedback table created');

    // 5. Reports table
    await db.query(`
      CREATE TABLE IF NOT EXISTS reports (
        id INT PRIMARY KEY AUTO_INCREMENT,
        report_type ENUM('revenue', 'registrations', 'attendance', 'performance') NOT NULL,
        organizer_id INT,
        start_date DATE,
        end_date DATE,
        total_revenue DECIMAL(12, 2),
        total_registrations INT,
        total_attendees INT,
        total_events INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (organizer_id) REFERENCES users(id)
      )
    `);
    console.log('✓ Reports table created');

    // 6. Certificates table
    await db.query(`
      CREATE TABLE IF NOT EXISTS certificates (
        id INT PRIMARY KEY AUTO_INCREMENT,
        booking_id INT NOT NULL,
        user_id INT NOT NULL,
        event_id INT NOT NULL,
        certificate_number VARCHAR(255) UNIQUE,
        pdf_url VARCHAR(500),
        issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        downloaded BOOLEAN DEFAULT FALSE,
        downloaded_at DATETIME,
        FOREIGN KEY (booking_id) REFERENCES bookings(id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (event_id) REFERENCES events(id)
      )
    `);
    console.log('✓ Certificates table created');

    console.log('\n✅ All module tables created successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Error creating tables:', error.message);
    process.exit(1);
  }
}

addModulesTables();
