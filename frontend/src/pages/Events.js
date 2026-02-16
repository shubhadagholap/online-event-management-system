import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Button, Badge, Alert } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { eventsAPI, categoriesAPI } from '../services/api';
import EventCard from '../components/EventCard';

const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ 
    search: searchParams.get('search') || '', 
    category: searchParams.get('category') || '', 
    status: searchParams.get('status') || '' 
  });
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    // Update filters from URL params
    const newFilters = {
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      status: searchParams.get('status') || ''
    };
    setFilters(newFilters);
    
    // Find active category name
    if (newFilters.category && categories.length > 0) {
      const cat = categories.find(c => c.id === parseInt(newFilters.category));
      setActiveCategory(cat?.name || null);
    } else {
      setActiveCategory(null);
    }
    
    fetchEvents(newFilters);
  }, [searchParams, categories]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchEvents = async (currentFilters = filters) => {
    try {
      setLoading(true);
      const params = {};
      if (currentFilters.search) params.search = currentFilters.search;
      if (currentFilters.category) params.category = currentFilters.category;
      if (currentFilters.status) params.status = currentFilters.status;

      const response = await eventsAPI.getAll(params);
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.status) params.set('status', newFilters.status);
    
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', status: '' });
    setSearchParams({});
    setActiveCategory(null);
  };

  const hasActiveFilters = filters.search || filters.category || filters.status;

  return (
    <Container className="mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">All Events</h2>
          {activeCategory && (
            <Badge bg="primary" className="mt-2">
              Showing: {activeCategory} Events
            </Badge>
          )}
        </div>
        {hasActiveFilters && (
          <Button variant="outline-secondary" size="sm" onClick={clearFilters}>
            Clear Filters
          </Button>
        )}
      </div>

      {/* Filter Section */}
      <Row className="mb-4">
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text>🔍</InputGroup.Text>
            <Form.Control
              type="text"
              name="search"
              placeholder="Search events..."
              value={filters.search}
              onChange={handleFilterChange}
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <Form.Select 
            name="category" 
            value={filters.category} 
            onChange={handleFilterChange}
            className={filters.category ? 'border-primary' : ''}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Results Section */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading events...</p>
        </div>
      ) : events.length > 0 ? (
        <>
          <div className="mb-3 text-muted">
            Found {events.length} event{events.length !== 1 ? 's' : ''}
            {activeCategory && ` in ${activeCategory}`}
          </div>
          <Row>
            {events.map((event) => (
              <Col key={event.id} md={6} lg={4} className="mb-4">
                <EventCard event={event} />
              </Col>
            ))}
          </Row>
        </>
      ) : (
        <Alert variant="info" className="text-center">
          <h5>No events found</h5>
          <p className="mb-0">
            {hasActiveFilters 
              ? 'Try adjusting your filters or clear them to see all events.'
              : 'No events are currently available.'}
          </p>
          {hasActiveFilters && (
            <Button variant="primary" className="mt-3" onClick={clearFilters}>
              View All Events
            </Button>
          )}
        </Alert>
      )}
    </Container>
  );
};

export default Events;
