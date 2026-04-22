import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { bookingsAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const OrganizerDashboard = () => {
  const [stats, setStats] = useState({
    myEvents: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0
  });
  const [loading, setLoading] = useState(true);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await bookingsAPI.getDashboardStats();
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      // If 401 error, redirect to login
      if (error.response?.status === 401) {
        logout();
        navigate('/login');
      }
      setLoading(false);
    }
  };

  if (loading) {
    return <Container className="mt-5 text-center">Loading...</Container>;
  }

  return (
    <Container className="mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <div className="me-3">
            <img 
              src={`https://ui-avatars.com/api/?name=${user?.name}&background=28a745&color=fff&size=50`}
              alt={user?.name}
              style={{ width: '50px', height: '50px', borderRadius: '50%' }}
            />
          </div>
          <div>
            <h2 className="mb-0">Organizer Dashboard</h2>
            <small className="text-muted">Welcome back, {user?.name}!</small>
          </div>
        </div>
        <Button variant="outline-danger" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right me-2"></i>
          Sign Out
        </Button>
      </div>
      <Row>
        <Col md={4} className="mb-4">
          <Card className="dashboard-card">
            <Card.Body>
              <h6 className="text-muted">My Events</h6>
              <h2>{stats.myEvents || 0}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="dashboard-card">
            <Card.Body>
              <h6 className="text-muted">Total Bookings</h6>
              <h2>{stats.totalBookings || 0}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="dashboard-card">
            <Card.Body>
              <h6 className="text-muted">Total Revenue</h6>
              <h2>${(parseFloat(stats.totalRevenue) || 0).toFixed(2)}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md={4} className="mb-4">
          <Card className="dashboard-card">
            <Card.Body>
              <h6 className="text-muted">Confirmed Bookings</h6>
              <h2 className="text-success">{stats.confirmedBookings || 0}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="dashboard-card">
            <Card.Body>
              <h6 className="text-muted">Pending Bookings</h6>
              <h2 className="text-warning">{stats.pendingBookings || 0}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="dashboard-card">
            <Card.Body>
              <h6 className="text-muted">Cancelled Bookings</h6>
              <h2 className="text-danger">{stats.cancelledBookings || 0}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrganizerDashboard;
