import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { eventsAPI } from '../services/api';
import EventCard from '../components/EventCard';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

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
