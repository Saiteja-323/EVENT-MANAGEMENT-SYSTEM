// client/src/components/Layout.jsx

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';
import { Alert } from 'react-bootstrap';

const Layout = ({ children }) => {
  const { error } = useAuth();

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      
      {error && (
        <Alert variant="danger" className="m-0 rounded-0 text-center">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}
      
      {/* This 'main' element will now correctly grow to fill space */}
      <main className="d-flex flex-column flex-grow-1 py-4 bg-light">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;