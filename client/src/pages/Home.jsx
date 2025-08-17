// client/src/pages/Home.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventCard from '../components/EventCard';
import { Container, Row, Col, Spinner, Form, Button, Alert } from 'react-bootstrap';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    date: '',
    search: ''
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const params = {};
        if (filters.category) params.category = filters.category;
        if (filters.date) params.date = filters.date;
        if (filters.search) params.search = filters.search;
        
        const res = await axios.get('/api/events', { params });
        setEvents(res.data);
        setLoading(false);
      } catch (err)
      {
        console.error('Error fetching events:', err);
        setError('Failed to fetch events. Please try again later.');
        setLoading(false);
      }
    };
    fetchEvents();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({ category: '', date: '', search: '' });
  };

  if (loading) {
    return (
      <Container className="d-flex flex-column flex-grow-1 justify-content-center align-items-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading events...</p>
      </Container>
    );
  }

  return (
    <Container className="d-flex flex-column flex-grow-1">
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold mb-3">Discover Amazing Events</h1>
        <p className="lead text-muted">Find and join events that match your interests</p>
      </div>
      
      <div className="bg-white p-4 rounded-3 shadow-sm mb-5">
        <h2 className="h5 mb-4">Find Your Perfect Event</h2>
        <Row className="g-3">
          <Col md={5}><Form.Control type="text" placeholder="Search events by title or description..." name="search" value={filters.search} onChange={handleFilterChange} className="border-primary"/></Col>
          <Col md={3}>
            <Form.Select name="category" value={filters.category} onChange={handleFilterChange} className="border-primary">
              <option value="">All Categories</option>
              <option value="Conference">Conference</option>
              <option value="Workshop">Workshop</option>
              <option value="Social">Social</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Col>
          <Col md={3}><Form.Control type="date" name="date" value={filters.date} onChange={handleFilterChange} className="border-primary"/></Col>
          <Col md={1}><Button variant="outline-primary" onClick={clearFilters} className="w-100"><i className="bi bi-arrow-repeat"></i></Button></Col>
        </Row>
      </div>

      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      {events.length === 0 ? (
        <div className="d-flex flex-column flex-grow-1 justify-content-center align-items-center text-center">
          <div className="mb-3"><i className="bi bi-calendar-x display-1 text-muted"></i></div>
          <h3>No events found</h3>
          <p className="text-muted">Try adjusting your search filters or create a new event</p>
          <Button variant="primary" href="/create-event" className="mt-2">Create Event</Button>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h4 mb-0">Upcoming Events</h2>
            <small className="text-muted">{events.length} events found</small>
          </div>
          <Row xs={1} md={2} lg={3} className="g-4">
            {events.map(event => (<Col key={event._id}><EventCard event={event} /></Col>))}
          </Row>
        </>
      )}
    </Container>
  );
};

export default Home;