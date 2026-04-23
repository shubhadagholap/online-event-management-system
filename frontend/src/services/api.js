import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
export const BACKEND_ORIGIN = new URL(API_URL).origin;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Users API
export const usersAPI = {
  getAll: (config = {}) => api.get('/users', config),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

// Categories API
export const categoriesAPI = {
  getAll: (config = {}) => api.get('/categories', config),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Events API
export const eventsAPI = {
  getAll: (params) => api.get('/events', { params }),
  getById: (id) => api.get(`/events/${id}`),
  getMyEvents: () => api.get('/events/organizer/my-events'),
  getDashboardStats: () => api.get('/events/dashboard/stats'),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
};

// Bookings API
export const bookingsAPI = {
  getAll: (config = {}) => api.get('/bookings/all', config),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  getOrganizerBookings: () => api.get('/bookings/organizer/bookings'),
  getDashboardStats: () => api.get('/bookings/dashboard/stats'),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (data) => api.post('/bookings', data),
  updateStatus: (id, data) => api.put(`/bookings/${id}/status`, data),
  cancel: (id) => api.delete(`/bookings/${id}/cancel`),
};

// Payments API
export const paymentsAPI = {
  create: (data) => api.post('/payments', data),
  getAll: (config = {}) => api.get('/payments', config),
  getMyPayments: () => api.get('/payments/my-payments'),
  getById: (id) => api.get(`/payments/${id}`),
  exportCSV: (params) => `${API_URL}/payments/export?${new URLSearchParams(params).toString()}`,
  refund: (id) => api.put(`/payments/${id}/refund`),
  delete: (id) => api.delete(`/payments/${id}`),
};

// Notifications API
export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  send: (data) => api.post('/notifications/send', data),
  getAnnouncements: () => api.get('/notifications/announcements'),
  createAnnouncement: (data) => api.post('/notifications/announcements', data),
  broadcastAnnouncement: (id) => api.post(`/notifications/announcements/${id}/broadcast`),
  deleteAnnouncement: (id) => api.delete(`/notifications/announcements/${id}`),
};

// Feedback & Ratings API
export const feedbackAPI = {
  submit: (data) => api.post('/feedback', data),
  getMyFeedback: () => api.get('/feedback/my-feedback'),
  getEventFeedback: (event_id) => api.get(`/feedback/event/${event_id}`),
  getEventRating: (event_id) => api.get(`/feedback/event/${event_id}/rating`),
  getOrganizerFeedback: () => api.get('/feedback/organizer/feedback'),
  getOrganizerRatings: () => api.get('/feedback/organizer/ratings'),
};

// Certificates API
export const certificatesAPI = {
  generate: (data) => api.post('/certificates', data),
  getAll: () => api.get('/certificates'),
  getById: (id) => api.get(`/certificates/${id}`),
  download: (id) => api.post(`/certificates/${id}/download`),
  getOrganizerCertificates: () => api.get('/certificates/organizer/certificates'),
  autoGenerate: (data) => api.post('/certificates/organizer/auto-generate', data),
  getStats: () => api.get('/certificates/organizer/stats'),
};

// Analytics API
export const analyticsAPI = {
  getAdminAnalytics: () => api.get('/analytics/admin'),
  getOrganizerAnalytics: () => api.get('/analytics/organizer'),
  generateReport: (params) => api.post('/analytics/reports', params),
  getReports: () => api.get('/analytics/reports'),
  getMonthlyRevenue: () => api.get('/analytics/revenue/monthly'),
  getRevenueByPaymentMethod: () => api.get('/analytics/revenue/by-method'),
};
