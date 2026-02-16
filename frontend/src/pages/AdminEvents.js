import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Table, Modal, Form, Alert, Badge, Card } from 'react-bootstrap';
import { eventsAPI, categoriesAPI, usersAPI } from '../services/api';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', date: '', location: '', capacity: 100,
    price: 0, category_id: '', organizer_id: '', status: 'upcoming', image_url: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [stats, setStats] = useState({ total: 0, upcoming: 0, ongoing: 0, completed: 0 });

  useEffect(() => {
    fetchEvents();
    fetchCategories();
    fetchOrganizers();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventsAPI.getAll();
      setEvents(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const calculateStats = (eventsData) => {
    setStats({
      total: eventsData.length,
      upcoming: eventsData.filter(e => e.status === 'upcoming').length,
      ongoing: eventsData.filter(e => e.status === 'ongoing').length,
      completed: eventsData.filter(e => e.status === 'completed').length
    });
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchOrganizers = async () => {
    try {
      const response = await usersAPI.getAll();
      const organizerUsers = response.data.filter(u => u.role === 'organizer' || u.role === 'admin');
      setOrganizers(organizerUsers);
    } catch (error) {
      console.error('Error fetching organizers:', error);
    }
  };

  const handleAdd = () => {
    setEditingEvent(null);
    setFormData({
      title: '', description: '', date: '', location: '', capacity: 100,
      price: 0, category_id: '', organizer_id: '', status: 'upcoming', image_url: ''
    });
    setShowModal(true);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      date: event.date.slice(0, 16),
      location: event.location,
      capacity: event.capacity,
      price: event.price,
      category_id: event.category_id || '',
      organizer_id: event.organizer_id,
      status: event.status,
      image_url: event.image_url || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await eventsAPI.delete(eventId);
      setMessage({ type: 'success', text: 'Event deleted successfully' });
      fetchEvents();
    } catch (error) {
      setMessage({ type: 'danger', text: 'Failed to delete event' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await eventsAPI.update(editingEvent.id, formData);
        setMessage({ type: 'success', text: 'Event updated successfully' });
      } else {
        await eventsAPI.create(formData);
        setMessage({ type: 'success', text: 'Event created successfully' });
      }
      setShowModal(false);
      fetchEvents();
    } catch (error) {
      setMessage({ 
        type: 'danger', 
        text: error.response?.data?.message || 'Operation failed' 
      });
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      upcoming: 'success',
      ongoing: 'warning',
      completed: 'secondary',
      cancelled: 'danger'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
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

  return (
    <Container className="mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage All Events</h2>
        <Button variant="primary" onClick={handleAdd}>
          <i className="bi bi-plus-circle me-2"></i>
          Create Event
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-primary">{stats.total}</h3>
              <p className="text-muted mb-0">Total Events</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-success">{stats.upcoming}</h3>
              <p className="text-muted mb-0">Upcoming</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-warning">{stats.ongoing}</h3>
              <p className="text-muted mb-0">Ongoing</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-secondary">{stats.completed}</h3>
              <p className="text-muted mb-0">Completed</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {message.text && (
        <Alert variant={message.type} onClose={() => setMessage({ type: '', text: '' })} dismissible>
          {message.text}
        </Alert>
      )}

      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Organizer</th>
            <th>Date</th>
            <th>Location</th>
            <th>Capacity</th>
            <th>Available</th>
            <th>Price</th>
            <th>Category</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>{event.id}</td>
              <td>{event.title}</td>
              <td>{event.organizer_name}</td>
              <td>{formatDate(event.date)}</td>
              <td>{event.location}</td>
              <td>{event.capacity}</td>
              <td>{event.available_seats}</td>
              <td>${event.price}</td>
              <td>{event.category_name || 'N/A'}</td>
              <td>{getStatusBadge(event.status)}</td>
              <td>
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="me-2" 
                  onClick={() => handleEdit(event)}
                >
                  Edit
                </Button>
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={() => handleDelete(event.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {events.length === 0 && (
        <div className="text-center text-muted py-5">
          <p>No events found. Create your first event!</p>
        </div>
      )}

      {/* Add/Edit Event Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingEvent ? 'Edit' : 'Create'} Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="Enter event title"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Organizer *</Form.Label>
                  <Form.Select
                    value={formData.organizer_id}
                    onChange={(e) => setFormData({ ...formData, organizer_id: e.target.value })}
                    required
                  >
                    <option value="">Select Organizer</option>
                    {organizers.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name} ({org.email})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter event description"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date & Time *</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Location *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                    placeholder="Enter location"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Capacity *</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    required
                    min="1"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Price ($) *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    min="0"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status *</Form.Label>
                  <Form.Select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="/images/events/your-image.jpg or https://..."
                  />
                  <Form.Text className="text-muted">
                    Local: /images/events/filename.jpg | External: https://example.com/image.jpg
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            {formData.image_url && (
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Image Preview</Form.Label>
                    <div style={{ maxWidth: '400px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                      <img 
                        src={formData.image_url.startsWith('http') ? formData.image_url : formData.image_url} 
                        alt="Event preview" 
                        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = '/images/events/default-event.jpg';
                          e.target.onerror = null;
                        }}
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            )}

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editingEvent ? 'Update Event' : 'Create Event'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminEvents;
