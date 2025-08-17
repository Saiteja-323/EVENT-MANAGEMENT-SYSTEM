import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // This function is called when the logout button is clicked
  const handleLogout = () => {
    logout(); // This clears the user's session
    navigate('/'); // This redirects the user to the homepage
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <i className="bi bi-calendar-event me-2"></i>
          <span className="fw-bold">Event Manager</span>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            {user && (
              <li className="nav-item">
                <Link className="nav-link" to="/create-event">Create Event</Link>
              </li>
            )}
          </ul>
          <ul className="navbar-nav">
            {/* This is the logic for the dropdown */}
            {user ? (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <div className="bg-light text-primary rounded-circle d-flex align-items-center justify-content-center me-2" style={{width: '30px', height: '30px'}}>
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="me-1">{user.username}</span>
                </a>
                {/* The dropdown menu with the logout button */}
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                </ul>
              </li>
            ) : (
              // If no user is logged in, show Login and Register buttons
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-outline-light" to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;