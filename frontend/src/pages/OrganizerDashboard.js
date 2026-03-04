import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { bookingsAPI } from '../services/api';

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
      setLoading(false);
    }
  };

  if (loading) {
    return <Container className="mt-5 text-center">Loading...</Container>;
  }

  return (
    <Container className="mt-4 mb-5">
      <h2 className="mb-4">Organizer Dashboard</h2>
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
