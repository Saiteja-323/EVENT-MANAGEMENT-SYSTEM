import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import EventDetails from './pages/EventDetails';
import CreateEvent from './pages/CreateEvent';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute'; // <-- Import the new component

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* --- PROTECTED ROUTES --- */}
            {/* Wrap the protected pages with the PrivateRoute component */}
            <Route 
              path="/" 
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/create-event" 
              element={
                <PrivateRoute>
                  <CreateEvent />
                </PrivateRoute>
              } 
            />

            {/* --- PUBLIC ROUTES --- */}
            {/* Login and Register are always accessible */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* EventDetails can remain public so links can be shared */}
            <Route path="/events/:id" element={<EventDetails />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;