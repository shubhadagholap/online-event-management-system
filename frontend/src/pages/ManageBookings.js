import React, { useState, useEffect, useContext } from 'react';
import { Container, Table, Badge, Button, Modal, Form, Alert, Row, Col, Card } from 'react-bootstrap';
import { bookingsAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    cancelled: 0,
    revenue: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      let response;
      // Admin sees all bookings, organizers see only their bookings
      if (user && user.role === 'admin') {
        const params = {
          search: searchTerm,
          status: statusFilter,
          payment: paymentFilter
        };
        response = await bookingsAPI.getAll({ params });
      } else {
        response = await bookingsAPI.getOrganizerBookings();
      }
      setBookings(response.data);
      calculateStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setMessage({ 
        type: 'danger', 
        text: 'Failed to load bookings. Please try again.' 
      });
      setLoading(false);
    }
  };

  const calculateStats = (bookingsData) => {
    const stats = {
      total: bookingsData.length,
      confirmed: bookingsData.filter(b => b.status === 'confirmed').length,
      pending: bookingsData.filter(b => b.status === 'pending').length,
      cancelled: bookingsData.filter(b => b.status === 'cancelled').length,
      revenue: bookingsData
        .filter(b => b.payment_status === 'paid')
        .reduce((sum, b) => sum + parseFloat(b.total_amount), 0)
    };
    setStats(stats);
  };

  const handleStatusChange = (booking) => {
    setSelectedBooking(booking);
    setNewStatus(booking.status);
    setShowModal(true);
  };

  const handleUpdateStatus = async () => {
    try {
      await bookingsAPI.updateStatus(selectedBooking.id, { status: newStatus });
      setMessage({ type: 'success', text: 'Booking status updated successfully' });
      setShowModal(false);
      fetchBookings();
    } catch (error) {
      setMessage({ 
        type: 'danger', 
        text: error.response?.data?.message || 'Failed to update status' 
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

  const getStatusBadge = (status) => {
    const variants = {
      confirmed: 'success',
      pending: 'warning',
      cancelled: 'danger'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getPaymentBadge = (status) => {
    const variants = {
      paid: 'success',
      pending: 'warning',
      failed: 'danger'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  if (loading) {
    return <Container className="mt-5 text-center">Loading...</Container>;
  }

  return (
    <Container className="mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          {user && user.role === 'admin' ? 'All Bookings' : 'My Bookings'}
        </h2>
        {user && user.role === 'admin' && (
          <Badge bg="info" className="fs-6">Admin View</Badge>
        )}
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-primary">{stats.total}</h3>
              <p className="text-muted mb-0">Total Bookings</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-success">{stats.confirmed}</h3>
              <p className="text-muted mb-0">Confirmed</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-warning">{stats.pending}</h3>
              <p className="text-muted mb-0">Pending</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-success">${stats.revenue.toFixed(2)}</h3>
              <p className="text-muted mb-0">Revenue</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {message.text && (
        <Alert variant={message.type} onClose={() => setMessage({ type: '', text: '' })} dismissible>
          {message.text}
        </Alert>
      )}

      {/* search + filters */}
      <Row className="mb-3 align-items-center">
        <Col md={4} className="mb-2">
          <Form.Control
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={3} className="mb-2">
          <Form.Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </Form.Select>
        </Col>
        <Col md={3} className="mb-2">
          <Form.Select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <option value="all">All Payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </Form.Select>
        </Col>
        <Col md={2} className="mb-2 text-end">
          <Button variant="outline-secondary" size="sm" onClick={() => {
            const params = new URLSearchParams({ search: searchTerm, status: statusFilter, payment: paymentFilter });
            window.location = `/api/bookings/export?${params.toString()}`;
          }}>
            Export CSV
          </Button>
        </Col>
      </Row>

      {bookings.length > 0 ? (
        <Table responsive striped bordered hover>
          <thead>
            <tr>
              <th>Ticket #</th>
              <th>User</th>
              <th>Event</th>
              {user && user.role === 'admin' && <th>Organizer</th>}
              <th>Event Date</th>
              <th>Booking Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings
            .filter(b => {
              const matchesSearch =
                b.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                b.event_title.toLowerCase().includes(searchTerm.toLowerCase());
              const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
              const matchesPayment = paymentFilter === 'all' || b.payment_status === paymentFilter;
              return matchesSearch && matchesStatus && matchesPayment;
            })
            .map((booking) => (
              <tr key={booking.id}>
                <td>{booking.ticket_number || 'N/A'}</td>
                <td>
                  <div>
                    <strong>{booking.user_name}</strong>
                    <br />
                    <small className="text-muted">{booking.user_email}</small>
                  </div>
                </td>
                <td>{booking.event_title}</td>
                {user && user.role === 'admin' && (
                  <td>
                    <small className="text-muted">
                      {booking.organizer_name || 'N/A'}
                    </small>
                  </td>
                )}
                <td>{formatDate(booking.event_date)}</td>
                <td>{formatDate(booking.booking_date)}</td>
                <td>${booking.total_amount}</td>
                <td>{getStatusBadge(booking.status)}</td>
                <td>{getPaymentBadge(booking.payment_status)}</td>
                <td>
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => handleStatusChange(booking)}
                  >
                    Update
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="text-center text-muted">No bookings found</div>
      )}

      {/* Update Status Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Booking Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking && (
            <>
              <p><strong>Ticket:</strong> {selectedBooking.ticket_number}</p>
              <p><strong>User:</strong> {selectedBooking.user_name}</p>
              <p><strong>Event:</strong> {selectedBooking.event_title}</p>
              
              <Form.Group className="mt-3">
                <Form.Label>Status</Form.Label>
                <Form.Select 
                  value={newStatus} 
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </Form.Select>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateStatus}>
            Update Status
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageBookings;
