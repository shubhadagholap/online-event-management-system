import React, { useState } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'upcoming':
        return 'success';
      case 'ongoing':
        return 'info';
      case 'completed':
        return 'secondary';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  // Get image source with fallback logic
  const getImageSrc = () => {
    if (event.status === 'cancelled') {
      return '/images/events/refund-event.svg';
    }

    if (imageError) {
      return '/images/events/default-event.svg';
    }
    
    if (event.image_url) {
      // If it's a full URL (http/https), use it directly
      if (event.image_url.startsWith('http')) {
        return event.image_url;
      }
      // If it's a relative path, use it from public folder
      return event.image_url;
    }
    
    // Default fallback
    return '/images/events/default-event.svg';
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card className="event-card h-100">
      <div className="event-card-image-wrapper">
        <Card.Img 
          variant="top" 
          src={getImageSrc()} 
          alt={event.title || 'Event image'}
          className="event-card-image"
          onError={handleImageError}
        />
      </div>
      <Card.Body className="d-flex flex-column">
        <div className="mb-2">
          {event.category_name && (
            <Badge bg="primary" className="me-2">{event.category_name}</Badge>
          )}
          <Badge bg={getStatusVariant(event.status)}>
            {event.status}
          </Badge>
        </div>
        <Card.Title>{event.title}</Card.Title>
        <Card.Text className="text-muted small">
          <i className="bi bi-calendar"></i> {formatDate(event.date)}
        </Card.Text>
        <Card.Text className="text-muted small">
          <i className="bi bi-geo-alt"></i> {event.location}
        </Card.Text>
        <Card.Text className="flex-grow-1">
          {event.description?.substring(0, 100)}...
        </Card.Text>
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <span className="h5 mb-0 text-primary">₹{event.price}</span>
          <Link to={`/events/${event.id}`}>
            <Button variant="primary" size="sm">View Details</Button>
          </Link>
        </div>
        <div className="mt-2 text-muted small">
          Available: {event.available_seats}/{event.capacity} seats
        </div>
      </Card.Body>
    </Card>
  );
};

export default EventCard;
