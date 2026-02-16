import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import NavigationBar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';
import OrganizerDashboard from './pages/OrganizerDashboard';
import ManageUsers from './pages/ManageUsers';
import ManageCategories from './pages/ManageCategories';
import OrganizerEvents from './pages/OrganizerEvents';
import Tickets from './pages/Tickets';
import ManageBookings from './pages/ManageBookings';
import Categories from './pages/Categories';
import AdminEvents from './pages/AdminEvents';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavigationBar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/categories" element={<Categories />} />
          
          {/* Profile Route (All authenticated users) */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute allowedRoles={['user', 'organizer', 'admin']}>
                <Profile />
              </ProtectedRoute>
            } 
          />

          {/* User Routes */}
          <Route 
            path="/my-bookings" 
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <MyBookings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tickets" 
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <Tickets />
              </ProtectedRoute>
            } 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageUsers />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/categories" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageCategories />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/events" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminEvents />
              </ProtectedRoute>
            } 
          />

          {/* Organizer Routes */}
          <Route 
            path="/organizer/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                <OrganizerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/organizer/events" 
            element={
              <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                <OrganizerEvents />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/organizer/bookings" 
            element={
              <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                <ManageBookings />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
