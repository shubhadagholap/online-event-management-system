import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Form, Modal, Alert, Badge } from 'react-bootstrap';
import { paymentsAPI, qrAPI } from '../services/api';
import { downloadCSV } from '../utils/csvExport';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('user');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [newPayment, setNewPayment] = useState({
    booking_id: '',
    event_id: '',
    amount: '',
    payment_method: 'card',
    payer_name: '',
    upi_id: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [counts, setCounts] = useState({ total: 0, completed: 0, pending: 0, failed: 0, refunded: 0 });
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeData, setQrCodeData] = useState(null);
  const [generatingQR, setGeneratingQR] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user.role || 'user');
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [searchTerm, statusFilter, userRole]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        _t: Date.now() // Cache-busting timestamp
      };
      let response;
      if (userRole === 'admin') {
        response = await paymentsAPI.getAll({ params });
      } else {
        // non-admin users should only see their payments
        response = await paymentsAPI.getMyPayments();
      }
      const list = response.data;
      setPayments(list);
      
      // compute summary counts using normalized status keys
      const summary = { total: list.length, completed: 0, pending: 0, failed: 0, refunded: 0 };
      list.forEach(p => {
        let statusKey = p.status?.toString().toLowerCase().trim();
        if (statusKey === 'paid') {
          statusKey = 'completed';
        }
        if (statusKey && summary[statusKey] !== undefined) {
          summary[statusKey]++;
        }
      });
      
      setCounts(summary);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setMessage({ type: 'danger', text: 'Failed to load payments' });
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });
    try {
      await paymentsAPI.create(newPayment);
      setMessage({ type: 'success', text: 'Payment processed successfully' });
      setShowModal(false);
      setNewPayment({ booking_id: '', event_id: '', amount: '', payment_method: 'card' });
      fetchPayments();
    } catch (error) {
      console.error('Payment submission error:', error);
      const msg = error.response?.data?.message || error.message || 'Payment failed';
      setMessage({ type: 'danger', text: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const generatePaymentQR = async () => {
    if (!newPayment.amount || !newPayment.booking_id || !newPayment.event_id) {
      setMessage({ type: 'warning', text: 'Please fill in Booking ID, Event ID, and Amount to generate QR code' });
      return;
    }

    setGeneratingQR(true);
    try {
      const response = await qrAPI.generatePaymentQR({
        amount: newPayment.amount,
        bookingId: newPayment.booking_id,
        eventId: newPayment.event_id,
        payerName: newPayment.payer_name || '',
        upiId: newPayment.upi_id || ''
      });

      setQrCodeData(response.data);
      setShowQRModal(true);
    } catch (error) {
      console.error('QR generation error:', error);
      setMessage({ type: 'danger', text: 'Failed to generate QR code' });
    } finally {
      setGeneratingQR(false);
    }
  };

  const generateTransactionQR = async (transactionId) => {
    setGeneratingQR(true);
    try {
      const response = await qrAPI.getTransactionQR(transactionId);
      
      // Adapt the response format for the modal
      setQrCodeData({
        qrCode: response.data.qrCode,
        upiUrl: response.data.verificationUrl,
        paymentDetails: {
          merchant: 'Transaction Verification',
          amount: response.data.transaction.amount,
          currency: 'INR',
          description: `Transaction: ${transactionId}`
        }
      });
      setShowQRModal(true);
    } catch (error) {
      console.error('Transaction QR generation error:', error);
      setMessage({ type: 'danger', text: 'Failed to generate transaction QR code' });
    } finally {
      setGeneratingQR(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = { completed: 'success', pending: 'warning', failed: 'danger', refunded: 'secondary' };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getMethodBadge = (method) => {
    const variants = { upi: 'info', card: 'primary', netbanking: 'warning' };
    return <Badge bg={variants[method] || 'secondary'}>{method.toUpperCase()}</Badge>;
  };

  if (loading) return <Container className="mt-5 text-center">Loading...</Container>;

  return (
    <Container className="mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>💳 Payment Management</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>New Payment</Button>
      </div>
      {/* Summary counts */}
      <Row className="mb-3">
        <Col>
          <Badge bg="secondary" className="me-2">Total: {counts.total}</Badge>
          <Badge bg="success" className="me-2">Completed: {counts.completed}</Badge>
          <Badge bg="warning" className="me-2">Pending: {counts.pending}</Badge>
          <Badge bg="danger" className="me-2">Failed: {counts.failed}</Badge>
          <Badge bg="dark">Refunded: {counts.refunded}</Badge>
        </Col>
      </Row>

      {message.text && (
        <Alert variant={message.type} onClose={() => setMessage({ type: '', text: '' })} dismissible>
          {message.text}
        </Alert>
      )}

      <Row className="mb-3">
        <Col md={6} className="mb-2">
          <Form.Control
            type="text"
            placeholder="Search by user or event..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={3} className="mb-2">
          <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </Form.Select>
        </Col>
        {userRole === 'admin' && (
          <Col md={3} className="mb-2 text-end">
            <Button variant="outline-secondary" size="sm" onClick={() => {
              const params = new URLSearchParams({ search: searchTerm, status: statusFilter });
              downloadCSV(`http://localhost:5000/api/payments/export?${params.toString()}`, 'payments.csv');
            }}>
              Export CSV
            </Button>
          </Col>
        )}
      </Row>

      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Payer</th>
            <th>UPI</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Status</th>
            <th>Date</th>
            <th>Event</th>
            <th>QR</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(p => (
            <tr key={p.id}>
              <td><small>{p.transaction_id}</small></td>
              <td>{p.payer_name || p.user_name || '-'}</td>
              <td>{p.upi_id || '-'}</td>
              <td>₹{p.amount}</td>
              <td>{getMethodBadge(p.payment_method)}</td>
              <td>{getStatusBadge(p.status)}</td>
              <td>{new Date(p.payment_date).toLocaleDateString()}</td>
              <td>{p.event_title}</td>
              <td>
                <Button 
                  variant="outline-info" 
                  size="sm"
                  onClick={() => generateTransactionQR(p.transaction_id)}
                  title="Generate QR for transaction verification"
                >
                  📱
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Process Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePayment}>
            <Form.Group className="mb-3">
              <Form.Label>Booking ID</Form.Label>
              <Form.Control type="number" value={newPayment.booking_id} onChange={(e) => setNewPayment({ ...newPayment, booking_id: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Event ID</Form.Label>
              <Form.Control type="number" value={newPayment.event_id} onChange={(e) => setNewPayment({ ...newPayment, event_id: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Payer Name</Form.Label>
              <Form.Control type="text" value={newPayment.payer_name} onChange={(e) => setNewPayment({ ...newPayment, payer_name: e.target.value })} placeholder="Name of the payer (optional)" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>UPI ID</Form.Label>
              <Form.Control type="text" value={newPayment.upi_id} onChange={(e) => setNewPayment({ ...newPayment, upi_id: e.target.value })} placeholder="example@upi (optional)" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Amount (₹)</Form.Label>
              <Form.Control type="number" step="0.01" value={newPayment.amount} onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Payment Method</Form.Label>
              <Form.Select value={newPayment.payment_method} onChange={(e) => setNewPayment({ ...newPayment, payment_method: e.target.value })}>
                <option value="card">Credit/Debit Card</option>
                <option value="upi">UPI</option>
                <option value="netbanking">Net Banking</option>
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100" disabled={submitting}>
              {submitting ? 'Processing...' : 'Process Payment'}
            </Button>
            <div className="mt-3 d-grid gap-2">
              <Button 
                variant="outline-info" 
                onClick={generatePaymentQR} 
                disabled={generatingQR || !newPayment.amount || !newPayment.booking_id}
              >
                {generatingQR ? 'Generating QR...' : '📱 Generate QR Code for UPI Payment'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* QR Code Modal */}
      <Modal show={showQRModal} onHide={() => setShowQRModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>📱 UPI Payment QR Code</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {qrCodeData && (
            <>
              <div className="mb-3">
                <img 
                  src={qrCodeData.qrCode} 
                  alt="Payment QR Code" 
                  style={{ maxWidth: '300px', height: 'auto', border: '2px solid #dee2e6' }}
                  className="rounded"
                />
              </div>
              
              <Card className="mb-3">
                <Card.Body>
                  <h5 className="card-title text-primary">Payment Details</h5>
                  <Row>
                    <Col md={6}>
                      <p><strong>Merchant:</strong> {qrCodeData.paymentDetails.merchant}</p>
                      <p><strong>Amount:</strong> ₹{qrCodeData.paymentDetails.amount}</p>
                    </Col>
                    <Col md={6}>
                      <p><strong>Currency:</strong> {qrCodeData.paymentDetails.currency}</p>
                      <p><strong>Description:</strong> {qrCodeData.paymentDetails.description}</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <Alert variant="info" className="text-start">
                <h6><i className="fas fa-info-circle"></i> How to Pay:</h6>
                <ol className="mb-0">
                  <li>Open any UPI app (Google Pay, PhonePe, Paytm, etc.)</li>
                  <li>Scan this QR code using the app's scanner</li>
                  <li>Verify the payment details</li>
                  <li>Enter your UPI PIN to complete payment</li>
                </ol>
              </Alert>

              <div className="d-grid gap-2">
                <Button 
                  variant="success" 
                  onClick={() => {
                    navigator.clipboard.writeText(qrCodeData.upiUrl);
                    setMessage({ type: 'success', text: 'UPI payment link copied to clipboard!' });
                  }}
                >
                  📋 Copy UPI Payment Link
                </Button>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Payments;
