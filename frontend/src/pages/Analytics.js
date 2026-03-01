import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { analyticsAPI } from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [revenueByMethod, setRevenueByMethod] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role === 'admin') {
        const res = await analyticsAPI.getAdminAnalytics();
        setStats(res.data);
      } else {
        const res = await analyticsAPI.getOrganizerAnalytics();
        setStats(res.data);
      }

      const revRes = await analyticsAPI.getMonthlyRevenue();
      setMonthlyRevenue(revRes.data || []);

      const methodRes = await analyticsAPI.getRevenueByPaymentMethod();
      setRevenueByMethod(methodRes.data || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setMessage({ type: 'danger', text: 'Failed to load analytics data' });
    }
  };

  // prepare chart data
  const lineData = {
    labels: monthlyRevenue.map(m => m.month),
    datasets: [
      {
        label: 'Revenue',
        data: monthlyRevenue.map(m => m.revenue),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        tension: 0.4
      }
    ]
  };

  const barData = {
    labels: revenueByMethod.map(r => r.payment_method.toUpperCase()),
    datasets: [
      {
        label: 'Amount',
        data: revenueByMethod.map(r => r.total_amount),
        backgroundColor: ['#007bff', '#28a745', '#ffc107']
      }
    ]
  };

  if (!stats) return <Container className="mt-5 text-center">Loading...</Container>;

  return (
    <Container className="mt-4 mb-5">
      <h2>📊 {stats ? (stats.revenue ? 'Admin' : 'Organizer') + ' Analytics' : 'Analytics'}</h2>

      {message.text && (
        <Alert variant={message.type} onClose={() => setMessage({ type: '', text: '' })} dismissible>
          {message.text}
        </Alert>
      )}

      <Row className="mt-4">
        {stats.revenue && (
          <Col md={3} className="mb-3">
            <Card className="text-center">
              <Card.Body>
                <Card.Title>Total Revenue</Card.Title>
                <h3>₹{stats.revenue.total_revenue || 0}</h3>
              </Card.Body>
            </Card>
          </Col>
        )}
        {stats.bookings && (
          <Col md={3} className="mb-3">
            <Card className="text-center">
              <Card.Body>
                <Card.Title>Total Bookings</Card.Title>
                <h3>{stats.bookings.total_bookings || 0}</h3>
              </Card.Body>
            </Card>
          </Col>
        )}
        {stats.events && (
          <Col md={3} className="mb-3">
            <Card className="text-center">
              <Card.Body>
                <Card.Title>Total Events</Card.Title>
                <h3>{stats.events.total_events || 0}</h3>
              </Card.Body>
            </Card>
          </Col>
        )}
        {stats.users && (
          <Col md={3} className="mb-3">
            <Card className="text-center">
              <Card.Body>
                <Card.Title>Total Users</Card.Title>
                <h3>{stats.users.total_users || 0}</h3>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>

      <Row className="mt-4">
        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Monthly Revenue (last 12 months)</Card.Title>
              <Line data={lineData} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Revenue by Payment Method</Card.Title>
              <Bar data={barData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Analytics;
