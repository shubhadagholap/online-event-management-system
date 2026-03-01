import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Form, Modal, Alert, Badge, Pagination } from 'react-bootstrap';
import { notificationsAPI } from '../services/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('notifications');
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', expires_at: '' });
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdmin();
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [isAdmin]);

  const checkAdmin = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setIsAdmin(user.role === 'admin');
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const notifsResponse = await notificationsAPI.getAll();
      setNotifications(notifsResponse.data);

      if (isAdmin) {
        const announcementsResponse = await notificationsAPI.getAnnouncements();
        setAnnouncements(announcementsResponse.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setMessage({ type: 'danger', text: 'Failed to load notifications' });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationsAPI.markAsRead(notificationId);
      setNotifications(notifications.map(n => n.id === notificationId ? { ...n, is_read: true } : n));
      setMessage({ type: 'success', text: 'Notification marked as read' });
    } catch (error) {
      setMessage({ type: 'danger', text: 'Failed to update notification' });
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await notificationsAPI.createAnnouncement(newAnnouncement);
      setMessage({ type: 'success', text: 'Announcement created successfully' });
      setShowAnnouncementModal(false);
      setNewAnnouncement({ title: '', content: '', expires_at: '' });
      fetchNotifications();
    } catch (error) {
      setMessage({ type: 'danger', text: error.response?.data?.message || 'Failed to create announcement' });
    }
  };

  const handleBroadcast = async (announcementId) => {
    try {
      await notificationsAPI.broadcastAnnouncement(announcementId);
      setMessage({ type: 'success', text: 'Announcement broadcasted to all users' });
      fetchNotifications();
    } catch (error) {
      setMessage({ type: 'danger', text: 'Failed to broadcast announcement' });
    }
  };

  if (loading) return <Container className="mt-5 text-center">Loading...</Container>;

  return (
    <Container className="mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🔔 Notifications & Announcements</h2>
        {isAdmin && (
          <Button variant="primary" onClick={() => setShowAnnouncementModal(true)}>
            New Announcement
          </Button>
        )}
      </div>

      {message.text && (
        <Alert variant={message.type} onClose={() => setMessage({ type: '', text: '' })} dismissible>
          {message.text}
        </Alert>
      )}

      <div className="mb-3">
        <Button
          variant={activeTab === 'notifications' ? 'primary' : 'outline-primary'}
          onClick={() => setActiveTab('notifications')}
          className="me-2"
        >
          My Notifications ({notifications.filter(n => !n.is_read).length})
        </Button>
        {isAdmin && (
          <Button
            variant={activeTab === 'announcements' ? 'primary' : 'outline-primary'}
            onClick={() => setActiveTab('announcements')}
          >
            Announcements
          </Button>
        )}
      </div>

      {activeTab === 'notifications' ? (
        <Row>
          {notifications.length === 0 ? (
            <Col>
              <Card className="text-center p-5 border-0 bg-light">
                <p className="text-muted mb-0">No notifications yet</p>
              </Card>
            </Col>
          ) : (
            <Col>
              <div className="notification-list">
                {notifications.map(notification => (
                  <Card key={notification.id} className={`mb-2 ${notification.is_read ? 'border-secondary' : 'border-primary bg-light'}`}>
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">{notification.subject}</h6>
                          <p className="text-muted small mb-2">{notification.message}</p>
                          <small className="text-secondary">
                            {notification.event_title && <Badge bg="info" className="me-2">{notification.event_title}</Badge>}
                            {new Date(notification.created_at).toLocaleString()}
                          </small>
                        </div>
                        {!notification.is_read && (
                          <Button variant="sm" outline size="sm" onClick={() => handleMarkAsRead(notification.id)}>
                            Mark Read
                          </Button>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </Col>
          )}
        </Row>
      ) : (
        <Row>
          <Col>
            {announcements.length === 0 ? (
              <Card className="text-center p-5 border-0 bg-light">
                <p className="text-muted mb-0">No announcements yet</p>
              </Card>
            ) : (
              announcements.map(announcement => (
                <Card key={announcement.id} className="mb-3">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5>{announcement.title}</h5>
                        <p className="text-muted">{announcement.content}</p>
                        <small className="text-secondary">
                          Created: {new Date(announcement.created_at).toLocaleString()}
                          {announcement.expires_at && ` | Expires: ${new Date(announcement.expires_at).toLocaleString()}`}
                        </small>
                      </div>
                      <div>
                        {announcement.is_active ? (
                          <Badge bg="success" className="me-2">Active</Badge>
                        ) : (
                          <Badge bg="secondary" className="me-2">Inactive</Badge>
                        )}
                        <Button variant="sm" size="sm" onClick={() => handleBroadcast(announcement.id)} className="me-2">
                          Broadcast
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))
            )}
          </Col>
        </Row>
      )}

      <Modal show={showAnnouncementModal} onHide={() => setShowAnnouncementModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create Announcement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateAnnouncement}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                placeholder="Announcement title"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={newAnnouncement.content}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                placeholder="Announcement content"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Expires At (Optional)</Form.Label>
              <Form.Control
                type="datetime-local"
                value={newAnnouncement.expires_at}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, expires_at: e.target.value })}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Create Announcement
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Notifications;
