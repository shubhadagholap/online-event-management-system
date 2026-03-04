import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { eventsAPI, bookingsAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import EventCard from '../components/EventCard';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminStats, setAdminStats] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchEvents();
    if (user && user.role === 'admin') {
      fetchAdminStats();
    }
  }, [user]);

  const fetchEvents = async () => {
    try {
      const response = await eventsAPI.getAll({ status: 'upcoming' });
      setEvents(response.data.slice(0, 6)); // Show only 6 events on home
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  const fetchAdminStats = async () => {
    try {
      const response = await bookingsAPI.getDashboardStats();
      setAdminStats(response.data);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    }
  };

  return (
    <>
      <div className="hero-section text-center">
        <Container>
          <h1 className="display-4 mb-4">Welcome to Event Management</h1>
          <p className="lead mb-4">
            Discover and book amazing events happening around you
          </p>
          <Link to="/events">
            <Button variant="light" size="lg">Browse All Events</Button>
          </Link>
        </Container>
      </div>

      {/* Admin Dashboard Section */}
      {user && user.role === 'admin' && adminStats && (
        <Container className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Admin Overview</h2>
            <Link to="/admin/dashboard">
              <Button variant="primary">Full Dashboard</Button>
            </Link>
          </div>
          
          <Row className="mb-4">
            <Col md={3} className="mb-3">
              <Card className="text-center h-100 shadow-sm border-primary">
                <Card.Body>
                  <div className="text-primary mb-2" style={{ fontSize: '1.5rem' }}>📅</div>
                  <h4 className="text-primary">{adminStats.totalEvents}</h4>
                  <small className="text-muted">Total Events</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="text-center h-100 shadow-sm border-info">
                <Card.Body>
                  <div className="text-info mb-2" style={{ fontSize: '1.5rem' }}>👥</div>
                  <h4 className="text-info">{adminStats.totalUsers}</h4>
                  <small className="text-muted">Total Users</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="text-center h-100 shadow-sm border-warning">
                <Card.Body>
                  <div className="text-warning mb-2" style={{ fontSize: '1.5rem' }}>🎫</div>
                  <h4 className="text-warning">{adminStats.totalBookings}</h4>
                  <small className="text-muted">Total Bookings</small>
                  {adminStats.pendingBookings > 0 && (
                    <div className="mt-1">
                      <Badge bg="warning">{adminStats.pendingBookings} pending</Badge>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="text-center h-100 shadow-sm border-success">
                <Card.Body>
                  <div className="text-success mb-2" style={{ fontSize: '1.5rem' }}>💰</div>
                  <h4 className="text-success">${(parseFloat(adminStats.totalRevenue) || 0).toFixed(2)}</h4>
                  <small className="text-muted">Total Revenue</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Quick Admin Actions */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3} className="mb-2">
                  <Link to="/admin/events" className="text-decoration-none">
                    <Button variant="outline-primary" className="w-100" size="sm">
                      📅 Manage Events
                    </Button>
                  </Link>
                </Col>
                <Col md={3} className="mb-2">
                  <Link to="/admin/users" className="text-decoration-none">
                    <Button variant="outline-info" className="w-100" size="sm">
                      👥 Manage Users
                    </Button>
                  </Link>
                </Col>
                <Col md={3} className="mb-2">
                  <Link to="/admin/categories" className="text-decoration-none">
                    <Button variant="outline-success" className="w-100" size="sm">
                      🏷️ Categories
                    </Button>
                  </Link>
                </Col>
                <Col md={3} className="mb-2">
                  <Link to="/admin/bookings" className="text-decoration-none">
                    <Button variant="outline-warning" className="w-100" size="sm">
                      🎫 View Bookings
                    </Button>
                  </Link>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Container>
      )}

      {/* Organizer Dashboard Section */}
      {user && user.role === 'organizer' && (
        <Container className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Organizer Panel</h2>
            <Link to="/organizer/dashboard">
              <Button variant="primary">My Dashboard</Button>
            </Link>
          </div>
          
          <Card>
            <Card.Body>
              <Row>
                <Col md={4} className="mb-2">
                  <Link to="/organizer/events" className="text-decoration-none">
                    <Button variant="outline-primary" className="w-100">
                      📅 My Events
                    </Button>
                  </Link>
                </Col>
                <Col md={4} className="mb-2">
                  <Link to="/organizer/bookings" className="text-decoration-none">
                    <Button variant="outline-success" className="w-100">
                      🎫 My Bookings
                    </Button>
                  </Link>
                </Col>
                <Col md={4} className="mb-2">
                  <Link to="/organizer/events" className="text-decoration-none">
                    <Button variant="outline-info" className="w-100">
                      ➕ Create Event
                    </Button>
                  </Link>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Container>
      )}

      <Container className="mb-5">
        <h2 className="mb-4">Upcoming Events</h2>
        {loading ? (
          <div className="text-center">Loading events...</div>
        ) : events.length > 0 ? (
          <Row>
            {events.map((event) => (
              <Col key={event.id} md={6} lg={4} className="mb-4">
                <EventCard event={event} />
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center text-muted">No upcoming events found</div>
        )}
        
        {events.length > 0 && (
          <div className="text-center mt-4">
            <Link to="/events">
              <Button variant="outline-primary">View All Events</Button>
            </Link>
          </div>
        )}
      </Container>
    </>
  );
};

export default Home;
