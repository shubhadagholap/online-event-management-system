import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { eventsAPI, usersAPI, bookingsAPI } from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Use the new dashboard stats endpoint for better performance
      const [statsRes, eventsRes] = await Promise.all([
        bookingsAPI.getDashboardStats(),
        eventsAPI.getAll()
      ]);

      const stats = statsRes.data;
      const events = eventsRes.data;

      setStats({
        totalEvents: stats.totalEvents || events.length,
        upcomingEvents: events.filter(e => e.status === 'upcoming').length,
        totalUsers: stats.totalUsers || 0,
        totalBookings: stats.totalBookings || 0,
        totalRevenue: parseFloat(stats.totalRevenue) || 0
      });

      // Get recent events (last 5)
      setRecentEvents(events.slice(0, 5));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <Container className="mt-5 text-center">Loading dashboard...</Container>;
  }

  return (
    <Container className="mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Dashboard</h2>
        <Link to="/admin/events">
          <Button variant="primary">
            <i className="bi bi-plus-circle me-2"></i>
            Create Event
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={6} lg={3} className="mb-3">
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <div className="text-primary mb-2" style={{ fontSize: '2rem' }}>
                📅
              </div>
              <h3 className="text-primary">{stats.totalEvents}</h3>
              <p className="text-muted mb-0">Total Events</p>
              <small className="text-success">{stats.upcomingEvents} upcoming</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-3">
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <div className="text-info mb-2" style={{ fontSize: '2rem' }}>
                👥
              </div>
              <h3 className="text-info">{stats.totalUsers}</h3>
              <p className="text-muted mb-0">Total Users</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-3">
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <div className="text-warning mb-2" style={{ fontSize: '2rem' }}>
                🎫
              </div>
              <h3 className="text-warning">{stats.totalBookings}</h3>
              <p className="text-muted mb-0">Total Bookings</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-3">
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <div className="text-success mb-2" style={{ fontSize: '2rem' }}>
                💰
              </div>
              <h3 className="text-success">${stats.totalRevenue.toFixed(2)}</h3>
              <p className="text-muted mb-0">Total Revenue</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="mb-4">
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header>
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3} className="mb-2">
                  <Link to="/admin/events" className="text-decoration-none">
                    <Button variant="outline-primary" className="w-100">
                      📅 Manage Events
                    </Button>
                  </Link>
                </Col>
                <Col md={3} className="mb-2">
                  <Link to="/admin/users" className="text-decoration-none">
                    <Button variant="outline-info" className="w-100">
                      👥 Manage Users
                    </Button>
                  </Link>
                </Col>
                <Col md={3} className="mb-2">
                  <Link to="/admin/categories" className="text-decoration-none">
                    <Button variant="outline-success" className="w-100">
                      🏷️ Manage Categories
                    </Button>
                  </Link>
                </Col>
                <Col md={3} className="mb-2">
                  <Link to="/events" className="text-decoration-none">
                    <Button variant="outline-secondary" className="w-100">
                      🔍 View All Events
                    </Button>
                  </Link>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Events */}
      <Row>
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Events</h5>
              <Link to="/admin/events">
                <Button variant="link" size="sm">View All</Button>
              </Link>
            </Card.Header>
            <Card.Body>
              {recentEvents.length > 0 ? (
                <ListGroup variant="flush">
                  {recentEvents.map((event) => (
                    <ListGroup.Item key={event.id} className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <img 
                          src={event.image_url || 'https://via.placeholder.com/60x60?text=Event'} 
                          alt={event.title}
                          style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                          className="me-3"
                        />
                        <div>
                          <h6 className="mb-1">{event.title}</h6>
                          <small className="text-muted">
                            {new Date(event.date).toLocaleDateString()} • {event.location}
                          </small>
                        </div>
                      </div>
                      <div className="text-end">
                        <div className="mb-1">
                          <span className={`badge bg-${event.status === 'upcoming' ? 'success' : 'secondary'}`}>
                            {event.status}
                          </span>
                        </div>
                        <small className="text-muted">{event.available_seats}/{event.capacity} seats</small>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p className="text-center text-muted mb-0">No events yet. Create your first event!</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
