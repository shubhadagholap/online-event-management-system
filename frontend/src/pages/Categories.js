import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { categoriesAPI, eventsAPI } from '../services/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [categoryStats, setCategoryStats] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategoriesWithStats();
  }, []);

  const fetchCategoriesWithStats = async () => {
    try {
      const [categoriesRes, eventsRes] = await Promise.all([
        categoriesAPI.getAll(),
        eventsAPI.getAll()
      ]);

      const categories = categoriesRes.data;
      const events = eventsRes.data;

      // Calculate stats for each category
      const stats = {};
      categories.forEach(cat => {
        const categoryEvents = events.filter(e => e.category_id === cat.id);
        stats[cat.id] = {
          eventCount: categoryEvents.length,
          upcomingCount: categoryEvents.filter(e => e.status === 'upcoming').length
        };
      });

      setCategories(categories);
      setCategoryStats(stats);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/events?category=${categoryId}`);
  };

  const getCategoryIcon = (categoryName) => {
    const icons = {
      'Music': '🎵',
      'Sports': '⚽',
      'Technology': '💻',
      'Business': '💼',
      'Arts': '🎨',
      'Education': '📚',
      'Food': '🍔',
      'Health': '🏥',
      'Entertainment': '🎭',
      'Conference': '🎤'
    };
    return icons[categoryName] || '📅';
  };

  if (loading) {
    return <Container className="mt-5 text-center">Loading categories...</Container>;
  }

  return (
    <Container className="mt-4 mb-5">
      <h2 className="mb-4">Browse by Category</h2>
      <p className="text-muted mb-4">Discover events across different categories</p>

      <Row>
        {categories.map((category) => {
          const stats = categoryStats[category.id] || { eventCount: 0, upcomingCount: 0 };
          return (
            <Col key={category.id} md={6} lg={4} className="mb-4">
              <Card 
                className="h-100 shadow-sm category-card" 
                style={{ cursor: 'pointer' }}
                onClick={() => handleCategoryClick(category.id)}
              >
                <Card.Body className="text-center">
                  <div style={{ fontSize: '3rem' }} className="mb-3">
                    {getCategoryIcon(category.name)}
                  </div>
                  <Card.Title>{category.name}</Card.Title>
                  <Card.Text className="text-muted">
                    {category.description || 'Explore events in this category'}
                  </Card.Text>
                  <div className="mt-3">
                    <Badge bg="primary" className="me-2">
                      {stats.eventCount} Events
                    </Badge>
                    {stats.upcomingCount > 0 && (
                      <Badge bg="success">
                        {stats.upcomingCount} Upcoming
                      </Badge>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      {categories.length === 0 && (
        <div className="text-center text-muted">
          <p>No categories available yet</p>
        </div>
      )}
    </Container>
  );
};

export default Categories;
