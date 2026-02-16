import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Modal } from 'react-bootstrap';
import { bookingsAPI } from '../services/api';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await bookingsAPI.getMyBookings();
      // Filter only confirmed bookings as tickets
      const confirmedTickets = response.data.filter(
        booking => booking.status === 'confirmed' && booking.payment_status === 'paid'
      );
      setTickets(confirmedTickets);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setLoading(false);
    }
  };

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  const handleDownloadTicket = (ticket) => {
    // Generate a simple text ticket
    const ticketContent = `
EVENT TICKET
============================================
Ticket Number: ${ticket.ticket_number}
Event: ${ticket.event_title}
Date: ${formatDate(ticket.event_date)}
Location: ${ticket.event_location}
Amount Paid: $${ticket.total_amount}
Status: ${ticket.status.toUpperCase()}
============================================
Please present this ticket at the venue.
    `;
    
    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-${ticket.ticket_number}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
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

  const getEventStatus = (eventDate) => {
    const now = new Date();
    const event = new Date(eventDate);
    
    if (event > now) return { text: 'Upcoming', variant: 'success' };
    if (event.toDateString() === now.toDateString()) return { text: 'Today', variant: 'warning' };
    return { text: 'Past', variant: 'secondary' };
  };

  if (loading) {
    return <Container className="mt-5 text-center">Loading tickets...</Container>;
  }

  return (
    <Container className="mt-4 mb-5">
      <h2 className="mb-4">My Tickets</h2>

      {tickets.length > 0 ? (
        <Row>
          {tickets.map((ticket) => {
            const status = getEventStatus(ticket.event_date);
            return (
              <Col key={ticket.id} md={6} lg={4} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <Badge bg={status.variant}>{status.text}</Badge>
                      <Badge bg="info">{ticket.ticket_number}</Badge>
                    </div>
                    
                    <Card.Title className="mb-3">{ticket.event_title}</Card.Title>
                    
                    <Card.Text>
                      <small className="text-muted">
                        <i className="bi bi-calendar-event me-2"></i>
                        {formatDate(ticket.event_date)}
                      </small>
                    </Card.Text>
                    
                    <Card.Text>
                      <small className="text-muted">
                        <i className="bi bi-geo-alt me-2"></i>
                        {ticket.event_location}
                      </small>
                    </Card.Text>
                    
                    <Card.Text className="mb-3">
                      <strong className="text-primary">${ticket.total_amount}</strong>
                    </Card.Text>
                    
                    <div className="d-grid gap-2">
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => handleViewTicket(ticket)}
                      >
                        View Ticket
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => handleDownloadTicket(ticket)}
                      >
                        Download
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      ) : (
        <Card className="text-center p-5">
          <Card.Body>
            <h4 className="text-muted">No Tickets Yet</h4>
            <p className="text-muted">Book an event to get your tickets here</p>
            <Button variant="primary" href="/events">Browse Events</Button>
          </Card.Body>
        </Card>
      )}

      {/* Ticket Detail Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Ticket Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTicket && (
            <div className="ticket-detail">
              <div className="text-center mb-4">
                <h3>{selectedTicket.event_title}</h3>
                <Badge bg="success" className="mb-3">CONFIRMED</Badge>
              </div>
              
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Ticket Number:</strong>
                  <p className="text-primary">{selectedTicket.ticket_number}</p>
                </Col>
                <Col md={6}>
                  <strong>Booking Date:</strong>
                  <p>{formatDate(selectedTicket.booking_date)}</p>
                </Col>
              </Row>
              
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Event Date:</strong>
                  <p>{formatDate(selectedTicket.event_date)}</p>
                </Col>
                <Col md={6}>
                  <strong>Location:</strong>
                  <p>{selectedTicket.event_location}</p>
                </Col>
              </Row>
              
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Amount Paid:</strong>
                  <p className="h5 text-success">${selectedTicket.total_amount}</p>
                </Col>
                <Col md={6}>
                  <strong>Payment Status:</strong>
                  <p><Badge bg="success">{selectedTicket.payment_status}</Badge></p>
                </Col>
              </Row>
              
              <div className="text-center mt-4 p-3 bg-light rounded">
                <p className="mb-0 text-muted">
                  <small>Please present this ticket at the venue entrance</small>
                </p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={() => selectedTicket && handleDownloadTicket(selectedTicket)}
          >
            Download Ticket
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Tickets;
