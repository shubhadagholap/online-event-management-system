import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Alert, Badge, ProgressBar, Table } from 'react-bootstrap';
import { feedbackAPI } from '../services/api';

const Feedback = () => {
  const [activeTab, setActiveTab] = useState('submit');
  const [eventFeedback, setEventFeedback] = useState([]);
  const [organizerFeedback, setOrganizerFeedback] = useState([]);
  const [eventRatings, setEventRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showModal, setShowModal] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const [newFeedback, setNewFeedback] = useState({
    event_id: '',
    rating: 5,
    comment: ''
  });
  const [selectedEventId, setSelectedEventId] = useState(null);

  useEffect(() => {
    checkUserRole();
    fetchFeedback();
  }, [activeTab]);

  const checkUserRole = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user.role);
  };

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      if (userRole === 'organizer' && activeTab === 'organizer') {
        const response = await feedbackAPI.getOrganizerFeedback();
        setOrganizerFeedback(response.data);
      } else if (activeTab === 'my-feedback') {
        const response = await feedbackAPI.getMyFeedback();
        setEventFeedback(response.data);
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setMessage({ type: 'danger', text: 'Failed to load feedback' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    try {
      await feedbackAPI.submit(newFeedback);
      setMessage({ type: 'success', text: 'Feedback submitted successfully!' });
      setShowModal(false);
      setNewFeedback({ event_id: '', rating: 5, comment: '' });
      fetchFeedback();
    } catch (error) {
      setMessage({ type: 'danger', text: error.response?.data?.message || 'Failed to submit feedback' });
    }
  };

  const fetchEventRating = async (eventId) => {
    try {
      const response = await feedbackAPI.getEventRating(eventId);
      setEventRatings({ ...eventRatings, [eventId]: response.data });
    } catch (error) {
      console.error('Error fetching event rating:', error);
    }
  };

  const RatingStars = ({ rating, onSelect }) => {
    return (
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            onClick={() => onSelect(star)}
            style={{ cursor: 'pointer', fontSize: '1.5rem', color: star <= rating ? '#ffc107' : '#ccc' }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const RatingDisplay = ({ rating }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= rating ? '#ffc107' : '#ccc', fontSize: '0.9rem' }}>★</span>
      );
    }
    return <span>{stars}</span>;
  };

  if (loading) return <Container className="mt-5 text-center">Loading...</Container>;

  return (
    <Container className="mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>⭐ Feedback & Ratings</h2>
        {activeTab === 'submit' && (
          <Button variant="primary" onClick={() => setShowModal(true)}>Submit Feedback</Button>
        )}
      </div>

      {message.text && (
        <Alert variant={message.type} onClose={() => setMessage({ type: '', text: '' })} dismissible>
          {message.text}
        </Alert>
      )}

      <div className="mb-3">
        <Button
          variant={activeTab === 'submit' ? 'primary' : 'outline-primary'}
          onClick={() => setActiveTab('submit')}
          className="me-2"
        >
          Submit Feedback
        </Button>
        <Button
          variant={activeTab === 'my-feedback' ? 'primary' : 'outline-primary'}
          onClick={() => setActiveTab('my-feedback')}
          className="me-2"
        >
          My Feedback
        </Button>
        {userRole === 'organizer' && (
          <Button
            variant={activeTab === 'organizer' ? 'primary' : 'outline-primary'}
            onClick={() => setActiveTab('organizer')}
          >
            Feedback on My Events
          </Button>
        )}
      </div>

      {activeTab === 'submit' && (
        <Card className="border-0 bg-light p-4">
          <p className="text-muted">Select an event from the events page to submit your feedback and rating.</p>
        </Card>
      )}

      {activeTab === 'my-feedback' && (
        <Row>
          {eventFeedback.length === 0 ? (
            <Col>
              <Card className="text-center p-5 border-0 bg-light">
                <p className="text-muted mb-0">You haven't submitted any feedback yet</p>
              </Card>
            </Col>
          ) : (
            <Col>
              {eventFeedback.map(fb => (
                <Card key={fb.id} className="mb-3">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6>{fb.event_title}</h6>
                        <p className="text-muted small mb-2">{fb.comment}</p>
                        <small className="text-secondary">
                          Submitted: {new Date(fb.created_at).toLocaleDateString()}
                        </small>
                      </div>
                      <div className="text-end">
                        <div style={{ fontSize: '1.2rem' }} className="mb-2">
                          <RatingDisplay rating={fb.rating} />
                          <span className="ms-2 badge bg-primary">{fb.rating}/5</span>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </Col>
          )}
        </Row>
      )}

      {activeTab === 'organizer' && (
        <Row>
          {organizerFeedback.length === 0 ? (
            <Col>
              <Card className="text-center p-5 border-0 bg-light">
                <p className="text-muted mb-0">No feedback received yet on your events</p>
              </Card>
            </Col>
          ) : (
            <Col>
              <Table responsive striped bordered>
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>User</th>
                    <th>Rating</th>
                    <th>Feedback</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {organizerFeedback.map(fb => (
                    <tr key={fb.id}>
                      <td>{fb.event_title}</td>
                      <td>{fb.user_name}</td>
                      <td>
                        <RatingDisplay rating={fb.rating} /> {fb.rating}/5
                      </td>
                      <td>{fb.comment || '-'}</td>
                      <td>{new Date(fb.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          )}
        </Row>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Submit Feedback & Rating</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitFeedback}>
            <Form.Group className="mb-3">
              <Form.Label>Event ID</Form.Label>
              <Form.Control
                type="number"
                value={newFeedback.event_id}
                onChange={(e) => setNewFeedback({ ...newFeedback, event_id: e.target.value })}
                placeholder="Enter the event ID"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rating</Form.Label>
              <div className="mb-2">
                <RatingStars
                  rating={newFeedback.rating}
                  onSelect={(rating) => setNewFeedback({ ...newFeedback, rating })}
                />
              </div>
              <Form.Text className="text-muted">Click on stars to rate (1-5)</Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Comments (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={newFeedback.comment}
                onChange={(e) => setNewFeedback({ ...newFeedback, comment: e.target.value })}
                placeholder="Share your thoughts about this event..."
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Submit Feedback
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Feedback;
