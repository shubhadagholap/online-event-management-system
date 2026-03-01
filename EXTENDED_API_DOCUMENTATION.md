# Extended Event Management System API Documentation

## Overview
This comprehensive event management system provides 7 core modules with advanced features for planning, managing, and analyzing events.

## 🚀 Quick Start

### Setup Extended Database
```bash
cd backend
node setupExtendedDatabase.js
```

### Start Server
```bash
cd backend
npm start
```

## 📋 Module Overview

### 1. Planning and Pre-Event Setup (`/api/planning`)
- Event templates and reusable configurations
- Event schedules and session management
- Task management and assignment
- Resource booking and logistics

### 2. Registration and Attendee Management (`/api/attendees`)
- Custom registration forms
- Attendee profiles and preferences
- Check-in and attendance tracking
- Session-level attendance

### 3. Marketing and Communication (`/api/marketing`)
- Email campaign management
- Social media post scheduling
- Email tracking and analytics
- Automated communications

### 4. Content and Speaker Management (`/api/speakers`)
- Speaker profiles and bios
- Presentation management
- Speaker analytics and ratings
- Availability scheduling

### 5. Engagement and Logistics (`/api/engagement`)
- Networking sessions and matching
- Live polls and Q&A
- Event feedback collection
- Interactive features

### 6. Analytics and Reporting (`/api/analytics`)
- Real-time event metrics
- Custom report generation
- Data export capabilities
- User activity tracking

### 7. Virtual & Hybrid Event Tools (`/api/virtual`)
- Virtual room management
- Live chat and messaging
- Virtual attendance tracking
- Multi-platform integration

---

## 🔗 API Endpoints

### Planning and Pre-Event Setup

#### Event Templates
```http
GET    /api/planning/templates
POST   /api/planning/templates
```

#### Event Schedules
```http
GET    /api/planning/:eventId/schedule
POST   /api/planning/:eventId/schedule
PUT    /api/planning/schedule/:sessionId
DELETE /api/planning/schedule/:sessionId
```

#### Event Tasks
```http
GET    /api/planning/:eventId/tasks
POST   /api/planning/:eventId/tasks
PUT    /api/planning/tasks/:taskId/status
```

#### Event Resources
```http
GET    /api/planning/:eventId/resources
POST   /api/planning/:eventId/resources
PUT    /api/planning/resources/:resourceId/status
```

### Registration and Attendee Management

#### Registration Forms
```http
GET    /api/attendees/:eventId/registration-form
POST   /api/attendees/:eventId/registration-form
```

#### Attendee Management
```http
GET    /api/attendees/:eventId/attendees
POST   /api/attendees/:eventId/register
PUT    /api/attendees/attendees/:attendeeId/checkin
PUT    /api/attendees/attendees/:attendeeId
```

#### Session Attendance
```http
POST   /api/attendees/sessions/:scheduleId/attend
PUT    /api/attendees/attendance/:attendanceId/feedback
```

#### Analytics
```http
GET    /api/attendees/:eventId/stats
```

### Marketing and Communication

#### Email Campaigns
```http
GET    /api/marketing/:eventId/campaigns
POST   /api/marketing/:eventId/campaigns
POST   /api/marketing/campaigns/:campaignId/send
```

#### Social Media
```http
GET    /api/marketing/:eventId/social-posts
POST   /api/marketing/:eventId/social-posts
```

### Speaker Management

#### Speaker CRUD
```http
GET    /api/speakers/
GET    /api/speakers/:speakerId
POST   /api/speakers/
PUT    /api/speakers/:speakerId
DELETE /api/speakers/:speakerId
```

#### Presentations
```http
GET    /api/speakers/:speakerId/presentations
POST   /api/speakers/presentations
PUT    /api/speakers/presentations/:presentationId/status
```

#### Analytics
```http
GET    /api/speakers/:speakerId/analytics
GET    /api/speakers/:speakerId/availability
PUT    /api/speakers/:speakerId/rating
```

### Engagement and Networking

#### Networking
```http
GET    /api/engagement/:eventId/networking
POST   /api/engagement/:eventId/networking
GET    /api/engagement/:eventId/matches
PUT    /api/engagement/matches/:matchId
```

#### Polls
```http
GET    /api/engagement/:eventId/polls
POST   /api/engagement/:eventId/polls
POST   /api/engagement/polls/:pollId/respond
GET    /api/engagement/polls/:pollId/results
```

#### Feedback
```http
POST   /api/engagement/:eventId/feedback
GET    /api/engagement/:eventId/feedback
```

### Virtual Events

#### Virtual Rooms
```http
GET    /api/virtual/:eventId/rooms
POST   /api/virtual/:eventId/rooms
POST   /api/virtual/rooms/:roomId/join
PUT    /api/virtual/attendance/:attendanceId/leave
PUT    /api/virtual/rooms/:roomId/settings
GET    /api/virtual/rooms/:roomId/participants
```

#### Chat
```http
GET    /api/virtual/rooms/:roomId/messages
POST   /api/virtual/rooms/:roomId/messages
```

#### Analytics
```http
GET    /api/virtual/:eventId/virtual-stats
```

### Analytics and Reporting

#### Event Analytics
```http
GET    /api/analytics/:eventId/analytics
GET    /api/analytics/:eventId/realtime
GET    /api/analytics/:eventId/export
POST   /api/analytics/:eventId/custom-report
POST   /api/analytics/:eventId/metrics
```

#### Activity Tracking
```http
POST   /api/analytics/:eventId/activity
```

---

## 📊 Database Schema

### Core Extensions

#### Event Templates
```sql
CREATE TABLE event_templates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category_id INT,
    default_capacity INT DEFAULT 100,
    default_duration INT DEFAULT 120,
    template_data JSON,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Speakers
```sql
CREATE TABLE speakers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(200),
    bio TEXT,
    title VARCHAR(200),
    company VARCHAR(200),
    profile_image VARCHAR(500),
    social_links JSON,
    expertise_areas JSON,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_events INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Virtual Rooms
```sql
CREATE TABLE virtual_rooms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    room_name VARCHAR(200) NOT NULL,
    room_type ENUM('main_stage', 'breakout', 'networking', 'exhibition'),
    platform ENUM('zoom', 'teams', 'webex', 'custom'),
    room_url VARCHAR(500),
    access_code VARCHAR(100),
    max_participants INT DEFAULT 100,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Event Analytics
```sql
CREATE TABLE event_analytics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(10,2) NOT NULL,
    metric_date DATE NOT NULL,
    additional_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔐 Authentication & Authorization

### Role-Based Access Control

#### Admin
- Full access to all features
- User management
- System-wide analytics
- Global settings

#### Organizer
- Create and manage events
- Access to event-specific features
- Attendee management
- Event analytics

#### User/Attendee
- Register for events
- Access virtual rooms
- Submit feedback
- View personal data

### Authentication Headers
```http
Authorization: Bearer <jwt_token>
```

---

## 📱 Frontend Integration Examples

### Register for Event
```javascript
const registerForEvent = async (eventId, registrationData) => {
  const response = await fetch(`/api/attendees/${eventId}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      registration_data: registrationData,
      dietary_requirements: 'Vegetarian',
      networking_preferences: ['Technology', 'Startups']
    })
  });
  return response.json();
};
```

### Join Virtual Room
```javascript
const joinVirtualRoom = async (roomId) => {
  const response = await fetch(`/api/virtual/rooms/${roomId}/join`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};
```

### Submit Poll Response
```javascript
const submitPollResponse = async (pollId, response) => {
  const result = await fetch(`/api/engagement/polls/${pollId}/respond`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ response })
  });
  return result.json();
};
```

### Get Real-time Analytics
```javascript
const getRealTimeMetrics = async (eventId) => {
  const response = await fetch(`/api/analytics/${eventId}/realtime`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};
```

---

## 🚀 Advanced Features

### 1. AI-Powered Networking
- Automatic attendee matching based on interests
- Smart networking session recommendations
- Conversation starter suggestions

### 2. Real-time Engagement
- Live polls during sessions
- Q&A management
- Interactive chat features

### 3. Comprehensive Analytics
- Attendee journey tracking
- Engagement heatmaps
- ROI calculations
- Custom dashboard creation

### 4. Multi-platform Virtual Events
- Zoom, Teams, WebEx integration
- Custom streaming solutions
- Hybrid event support
- Mobile-first design

### 5. Marketing Automation
- Automated email sequences
- Social media scheduling
- Personalized communications
- Campaign performance tracking

---

## 🔧 Configuration

### Environment Variables
```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=event_management

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=24h

# Email Service (Optional)
EMAIL_SERVICE=sendgrid
EMAIL_API_KEY=your_api_key

# Social Media APIs (Optional)
TWITTER_API_KEY=your_twitter_key
FACEBOOK_API_KEY=your_facebook_key
LINKEDIN_API_KEY=your_linkedin_key

# Virtual Event Platforms (Optional)
ZOOM_API_KEY=your_zoom_key
TEAMS_API_KEY=your_teams_key
```

---

## 📈 Performance Considerations

### Database Optimization
- Indexed frequently queried columns
- Optimized JOIN queries
- Pagination for large datasets
- Connection pooling

### Caching Strategy
- Redis for session data
- API response caching
- Static asset optimization
- CDN integration

### Scalability
- Microservices architecture ready
- Horizontal scaling support
- Load balancer compatible
- Cloud deployment ready

---

## 🧪 Testing

### Run Extended Database Setup
```bash
cd backend
node setupExtendedDatabase.js
```

### Test API Endpoints
```bash
# Test speaker creation
curl -X POST http://localhost:5000/api/speakers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"John Doe","email":"john@example.com","bio":"Expert speaker"}'

# Test virtual room creation
curl -X POST http://localhost:5000/api/virtual/1/rooms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"room_name":"Main Stage","room_type":"main_stage","platform":"zoom"}'
```

---

## 🎯 Next Steps

1. **Setup Extended Database**: Run the setup script
2. **Test Core Features**: Use the API endpoints
3. **Build Frontend Components**: Create UI for new features
4. **Configure Integrations**: Set up email, social media, and virtual platform APIs
5. **Deploy and Scale**: Deploy to production environment

This extended system transforms the basic event management into a comprehensive platform suitable for enterprise-level event management with advanced features and analytics.