import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Alert, Badge, Form } from 'react-bootstrap';
import { certificatesAPI, BACKEND_ORIGIN } from '../services/api';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [userRole, setUserRole] = useState('user');
  const [activeTab, setActiveTab] = useState('my-certificates');
  const [showAutoGenModal, setShowAutoGenModal] = useState(false);
  const [eventIdForGeneration, setEventIdForGeneration] = useState('');

  useEffect(() => {
    checkUserRole();
  }, []);

  useEffect(() => {
    fetchCertificates();
  }, [activeTab, userRole]);

  const checkUserRole = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user.role);
  };

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      if (userRole === 'organizer' || userRole === 'admin') {
        if (activeTab === 'my-certificates') {
          const response = await certificatesAPI.getAll();
          setCertificates(response.data);
        } else if (activeTab === 'organizer-certificates') {
          const response = await certificatesAPI.getOrganizerCertificates();
          setCertificates(response.data);
        } else if (activeTab === 'stats') {
          const response = await certificatesAPI.getStats();
          setStats(response.data);
        }
      } else {
        const response = await certificatesAPI.getAll();
        setCertificates(response.data);
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
      setMessage({ type: 'danger', text: 'Failed to load certificates' });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = async (certificateId) => {
    try {
      const cert = certificates.find(c => c.id === certificateId);
      if (cert && cert.pdf_url) {
        // Open direct PDF URL served by backend static route (use explicit backend origin)
        const url = cert.pdf_url.startsWith('/') ? `${BACKEND_ORIGIN}${cert.pdf_url}` : cert.pdf_url;
        window.open(url, '_blank');
        // mark as downloaded via API (optional)
        try { await certificatesAPI.download(certificateId); } catch (e) { /* ignore */ }
        setMessage({ type: 'success', text: 'Certificate download started' });
        fetchCertificates();
      } else {
        setMessage({ type: 'danger', text: 'Certificate file not available' });
      }
    } catch (error) {
      setMessage({ type: 'danger', text: 'Failed to download certificate' });
    }
  };

  const handleAutoGenerateCertificates = async (e) => {
    e.preventDefault();
    try {
      await certificatesAPI.autoGenerate({ event_id: eventIdForGeneration });
      setMessage({ type: 'success', text: 'Certificates generated successfully!' });
      setShowAutoGenModal(false);
      setEventIdForGeneration('');
      fetchCertificates();
    } catch (error) {
      setMessage({ type: 'danger', text: error.response?.data?.message || 'Failed to generate certificates' });
    }
  };

  if (loading) return <Container className="mt-5 text-center">Loading...</Container>;

  return (
    <Container className="mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🎖️ Certificates</h2>
        {(userRole === 'organizer' || userRole === 'admin') && (
          <Button variant="primary" onClick={() => setShowAutoGenModal(true)}>
            Generate Certificates
          </Button>
        )}
      </div>

      {message.text && (
        <Alert variant={message.type} onClose={() => setMessage({ type: '', text: '' })} dismissible>
          {message.text}
        </Alert>
      )}

      {userRole === 'organizer' || userRole === 'admin' ? (
        <div className="mb-3">
          <Button
            variant={activeTab === 'my-certificates' ? 'primary' : 'outline-primary'}
            onClick={() => setActiveTab('my-certificates')}
            className="me-2"
          >
            My Certificates
          </Button>
          <Button
            variant={activeTab === 'organizer-certificates' ? 'primary' : 'outline-primary'}
            onClick={() => setActiveTab('organizer-certificates')}
            className="me-2"
          >
            Issued Certificates
          </Button>
          <Button
            variant={activeTab === 'stats' ? 'primary' : 'outline-primary'}
            onClick={() => setActiveTab('stats')}
          >
            Statistics
          </Button>
        </div>
      ) : null}

      {activeTab === 'my-certificates' && (
        <Row>
          {certificates.length === 0 ? (
            <Col>
              <Card className="text-center p-5 border-0 bg-light">
                <p className="text-muted mb-0">No certificates earned yet</p>
              </Card>
            </Col>
          ) : (
            <>
              {certificates.map(cert => (
                <Col md={6} lg={4} key={cert.id} className="mb-3">
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body>
                      <div className="text-center mb-3">
                        <h5>🎖️</h5>
                        <h6 className="mb-2">{cert.event_title}</h6>
                      </div>
                      <p className="text-muted small mb-2">
                        <strong>Certificate #:</strong> {cert.certificate_number}
                      </p>
                      <p className="text-muted small mb-3">
                        <strong>Issued:</strong> {new Date(cert.issued_at).toLocaleDateString()}
                      </p>
                      <div className="d-flex gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          className="flex-grow-1"
                          onClick={() => handleDownloadCertificate(cert.id)}
                          disabled={cert.downloaded}
                        >
                          {cert.downloaded ? 'Downloaded ✓' : 'Download'}
                        </Button>
                        {cert.downloaded && (
                          <Badge bg="success" className="align-self-center">Verified</Badge>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </>
          )}
        </Row>
      )}

      {activeTab === 'organizer-certificates' && (
        <Row>
          {certificates.length === 0 ? (
            <Col>
              <Card className="text-center p-5 border-0 bg-light">
                <p className="text-muted mb-0">No certificates issued yet</p>
              </Card>
            </Col>
          ) : (
            <Col>
              <Table responsive striped bordered hover>
                <thead className="table-light">
                  <tr>
                    <th>Certificate #</th>
                    <th>Participant</th>
                    <th>Event</th>
                    <th>Issued</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {certificates.map(cert => (
                    <tr key={cert.id}>
                      <td><small>{cert.certificate_number}</small></td>
                      <td>{cert.user_name}</td>
                      <td>{cert.event_title}</td>
                      <td>{new Date(cert.issued_at).toLocaleDateString()}</td>
                      <td>
                        {cert.downloaded ? (
                          <Badge bg="success">Downloaded</Badge>
                        ) : (
                          <Badge bg="warning">Pending</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          )}
        </Row>
      )}

      {activeTab === 'stats' && stats && (
        <Row>
          <Col md={4} className="mb-3">
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <h6 className="text-muted mb-2">Total Issued</h6>
                <h2 className="text-primary">{stats.total_certificates}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <h6 className="text-muted mb-2">Downloaded</h6>
                <h2 className="text-success">{stats.downloaded}</h2>
                <small className="text-muted">{stats.total_certificates > 0 ? ((parseInt(stats.downloaded) / parseInt(stats.total_certificates)) * 100).toFixed(0) : 0}%</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <h6 className="text-muted mb-2">Pending</h6>
                <h2 className="text-warning">{stats.pending}</h2>
                <small className="text-muted">{stats.total_certificates > 0 ? ((parseInt(stats.pending) / parseInt(stats.total_certificates)) * 100).toFixed(0) : 0}%</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Auto Generate Modal */}
      <Modal show={showAutoGenModal} onHide={() => setShowAutoGenModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Auto-Generate Certificates</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="info">
            This will generate certificates for all confirmed bookings on the selected event that don't already have certificates.
          </Alert>
          <Form onSubmit={handleAutoGenerateCertificates}>
            <Form.Group className="mb-3">
              <Form.Label>Event ID</Form.Label>
              <Form.Control
                type="number"
                value={eventIdForGeneration}
                onChange={(e) => setEventIdForGeneration(e.target.value)}
                placeholder="Enter event ID"
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Generate Certificates
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Certificates;
