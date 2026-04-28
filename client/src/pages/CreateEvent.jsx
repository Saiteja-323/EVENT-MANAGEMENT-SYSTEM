import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function CreateEvent() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: 'Conference',
    image: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError('');

      const res = await api.post('/api/events', formData);

      navigate(`/events/${res.data._id}`);
    } catch (err) {
      console.error(err);
      setError('Error creating event');
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Create Event</h2>

      {error && (
        <div style={errorStyle}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Event Title"
          value={formData.title}
          onChange={handleChange}
          style={inputStyle}
          required
        />

        <textarea
          name="description"
          placeholder="Event Description"
          value={formData.description}
          onChange={handleChange}
          style={inputStyle}
          required
        />

        <input
          type="datetime-local"
          name="date"
          value={formData.date}
          onChange={handleChange}
          style={inputStyle}
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Event Location"
          value={formData.location}
          onChange={handleChange}
          style={inputStyle}
          required
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="Conference">Conference</option>
          <option value="Workshop">Workshop</option>
          <option value="Social">Social</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="text"
          name="image"
          placeholder="Paste Image URL"
          value={formData.image}
          onChange={handleChange}
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>
          Create Event
        </button>
      </form>
    </div>
  );
}

const containerStyle = {
  maxWidth: '700px',
  margin: '50px auto',
  padding: '35px',
  background: '#111827',
  borderRadius: '18px',
  boxShadow: '0 0 25px rgba(0,0,0,0.35)',
  color: 'white'
};

const headingStyle = {
  textAlign: 'center',
  marginBottom: '25px'
};

const inputStyle = {
  width: '100%',
  padding: '14px',
  marginBottom: '16px',
  borderRadius: '10px',
  border: '1px solid #444',
  background: '#1f2937',
  color: 'white',
  boxSizing: 'border-box'
};

const buttonStyle = {
  width: '100%',
  padding: '14px',
  background: '#2563eb',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer'
};

const errorStyle = {
  background: '#7f1d1d',
  padding: '12px',
  borderRadius: '8px',
  marginBottom: '16px'
};

export default CreateEvent;