const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
const path = require('path');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve generated certificate PDFs
app.use('/certificates', express.static(path.join(__dirname, 'public', 'certificates')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

// Extended Event Management Routes
app.use('/api/planning', require('./routes/planningRoutes'));
app.use('/api/attendees', require('./routes/attendeeRoutes'));
app.use('/api/marketing', require('./routes/marketingRoutes'));
app.use('/api/engagement', require('./routes/engagementRoutes'));
app.use('/api/virtual', require('./routes/virtualRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/speakers', require('./routes/speakerRoutes'));

// New Module Routes
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/certificates', require('./routes/certificateRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Event Management API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✓ Server is running on port ${PORT}`);
  console.log(`✓ API available at http://localhost:${PORT}/api`);
});
