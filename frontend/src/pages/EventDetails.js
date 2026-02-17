import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsAPI, bookingsAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await eventsAPI.getById(id);
      setEvent(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching event:', error);
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setBookingLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await bookingsAPI.create({ event_id: id });
      setMessage({ type: 'success', text: 'Booking successful! Check your bookings.' });
      fetchEvent(); // Refresh event data
    } catch (error) {
      setMessage({ 
        type: 'danger', 
        text: error.response?.data?.message || 'Booking failed' 
      });
    } finally {
      setBookingLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get image source with fallback logic
  const getImageSrc = () => {
    if (imageError) {
      return '/images/events/default-event.jpg';
    }
    
    if (event?.image_url) {
      // If it's a full URL (http/https), use it directly
      if (event.image_url.startsWith('http')) {
        return event.image_url;
      }
      // If it's a relative path, use it from public folder
      return event.image_url;
    }
    
    // Default fallback
    return '/images/events/default-event.jpg';
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (loading) {
    return <Container className="mt-5 text-center">Loading...</Container>;
  }

  if (!event) {
    return <Container className="mt-5 text-center">Event not found</Container>;
  }

  return (
    <Container className="mt-4 mb-5">
      <Row>
        <Col lg={8}>
          <Card>
            <div className="event-detail-image-wrapper">
              <Card.Img 
                variant="top" 
                src={getImageSrc()} 
                alt={event.title || 'Event image'}
                className="event-detail-image"
                onError={handleImageError}
              />
            </div>
            <Card.Body>
              <div className="mb-3">
                {event.category_name && (
                  <Badge bg="primary" className="me-2">{event.category_name}</Badge>
                )}
                <Badge bg={event.status === 'upcoming' ? 'success' : 'secondary'}>
                  {event.status}
                </Badge>
              </div>
              <h2>{event.title}</h2>
              <p className="text-muted">
                <strong>Organized by:</strong> {event.organizer_name}
              </p>
              <hr />
              <h5>Description</h5>
              <p>{event.description}</p>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="mb-3">
            <Card.Body>
              <h5>Event Details</h5>
              <hr />
              <p><strong>Date & Time:</strong><br />{formatDate(event.date)}</p>
              <p><strong>Location:</strong><br />{event.location}</p>
              <p><strong>Price:</strong><br /><span className="h4 text-primary">${event.price}</span></p>
              <p><strong>Available Seats:</strong><br />
                {event.available_seats} / {event.capacity}
              </p>
            </Card.Body>
          </Card>

          {message.text && (
            <Alert variant={message.type} onClose={() => setMessage({ type: '', text: '' })} dismissible>
              {message.text}
            </Alert>
          )}

          {user && user.role === 'user' && event.available_seats > 0 && event.status === 'upcoming' && (
            <Button 
              variant="primary" 
              size="lg" 
              className="w-100"
              onClick={handleBooking}
              disabled={bookingLoading}
            >
              {bookingLoading ? 'Booking...' : 'Book Now'}
            </Button>
          )}

          {!user && (
            <Button 
              variant="primary" 
              size="lg" 
              className="w-100"
              onClick={() => navigate('/login')}
            >
              Login to Book
            </Button>
          )}

          {event.available_seats === 0 && (
            <Alert variant="warning">This event is fully booked</Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default EventDetails;
