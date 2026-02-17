import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Alert } from 'react-bootstrap';
import { bookingsAPI } from '../services/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingsAPI.getMyBookings();
      setBookings(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingsAPI.cancel(bookingId);
      setMessage({ type: 'success', text: 'Booking cancelled successfully' });
      fetchBookings();
    } catch (error) {
      setMessage({ 
        type: 'danger', 
        text: error.response?.data?.message || 'Failed to cancel booking' 
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <Container className="mt-5 text-center">Loading...</Container>;
  }

  return (
    <Container className="mt-4 mb-5">
      <h2 className="mb-4">My Bookings</h2>

      {message.text && (
        <Alert variant={message.type} onClose={() => setMessage({ type: '', text: '' })} dismissible>
          {message.text}
        </Alert>
      )}

      {bookings.length > 0 ? (
        <Table responsive striped bordered hover>
          <thead>
            <tr>
              <th>Ticket #</th>
              <th>Event</th>
              <th>Event Date</th>
              <th>Location</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.ticket_number || 'N/A'}</td>
                <td>{booking.event_title}</td>
                <td>{formatDate(booking.event_date)}</td>
                <td>{booking.event_location}</td>
                <td>${booking.total_amount}</td>
                <td>
                  <Badge bg={
                    booking.status === 'confirmed' ? 'success' : 
                    booking.status === 'pending' ? 'warning' : 'danger'
                  }>
                    {booking.status}
                  </Badge>
                </td>
                <td>
                  <Badge bg={
                    booking.payment_status === 'paid' ? 'success' : 
                    booking.payment_status === 'pending' ? 'warning' : 'secondary'
                  }>
                    {booking.payment_status}
                  </Badge>
                </td>
                <td>
                  {booking.status !== 'cancelled' && (
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => handleCancel(booking.id)}
                    >
                      Cancel
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="text-center text-muted">No bookings found</div>
      )}
    </Container>
  );
};

export default MyBookings;
