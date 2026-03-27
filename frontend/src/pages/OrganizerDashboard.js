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
    cancelledBookings: 0,
    upcomingEvents: 0,
    completedEvents: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await bookingsAPI.getDashboardStats();
      const data = response.data;
      
      // Ensure all values are properly handled
      setStats({
        myEvents: data.myEvents || 0,
        totalBookings: data.totalBookings || 0,
        totalRevenue: data.totalRevenue || 0,
        pendingBookings: data.pendingBookings || 0,
        confirmedBookings: data.confirmedBookings || 0,
        cancelledBookings: data.cancelledBookings || 0,
        upcomingEvents: data.upcomingEvents || 0,
        completedEvents: data.completedEvents || 0
      });
      
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
              <h2>{stats.myEvents}</h2>
              <small className="text-success">{stats.upcomingEvents} upcoming</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="dashboard-card">
            <Card.Body>
              <h6 className="text-muted">Total Bookings</h6>
              <h2>{stats.totalBookings}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="dashboard-card">
            <Card.Body>
              <h6 className="text-muted">Total Revenue</h6>
              <h2>${stats.totalRevenue.toFixed(2)}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md={3} className="mb-4">
          <Card className="dashboard-card">
            <Card.Body>
              <h6 className="text-muted">Confirmed Bookings</h6>
              <h2 className="text-success">{stats.confirmedBookings}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="dashboard-card">
            <Card.Body>
              <h6 className="text-muted">Pending Bookings</h6>
              <h2 className="text-warning">{stats.pendingBookings}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="dashboard-card">
            <Card.Body>
              <h6 className="text-muted">Cancelled Bookings</h6>
              <h2 className="text-danger">{stats.cancelledBookings}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="dashboard-card">
            <Card.Body>
              <h6 className="text-muted">Completed Events</h6>
              <h2 className="text-secondary">{stats.completedEvents}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrganizerDashboard;
