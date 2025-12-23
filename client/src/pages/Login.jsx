import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Form, Button, Alert, Card, Spinner } from 'react-bootstrap';
import api from '../api/axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/api/users/login', formData);
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      let errorMessage = 'Login failed. Please try again.';

      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = 'Invalid email or password';
        } else if (err.response.status === 400) {
          errorMessage = 'Missing required fields';
        } else if (err.response.data?.error) {
          errorMessage = err.response.data.error;
        }
      } else {
        errorMessage = 'No response from server. Please check your connection.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5 App">
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold">Welcome Back</h1>
        <p className="lead text-muted">Sign in to manage your events</p>
      </div>

      <div className="d-flex justify-content-center">
        <Card className="glass-container border-0 shadow-sm" style={{ width: '100%', maxWidth: '450px' }}>
          <Card.Body className="p-4">
            {error && (
              <Alert variant="danger" className="mb-4">
                <i className="bi bi-exclamation-circle me-2"></i>
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="py-2"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="py-2"
                />
                <div className="text-end mt-2">
                  <Link to="#" className="text-decoration-none small text-muted">
                    Forgot password?
                  </Link>
                </div>
              </Form.Group>

              <div className="d-grid mb-4">
                <Button
                  variant="primary"
                  size="lg"
                  type="submit"
                  disabled={loading}
                  className="py-3"
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </div>

              <div className="text-center mt-4 pt-3 border-top">
                <p className="text-muted mb-0">Don't have an account?</p>
                <Link to="/register" className="btn btn-outline-primary mt-2">
                  Create an account
                </Link>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default Login;
