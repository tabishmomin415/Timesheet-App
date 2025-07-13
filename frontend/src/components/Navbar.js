import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Timesheet App
        </Link>
        
        {user ? (
          <div className="nav-menu">
            <Link to="/" className="nav-link">Dashboard</Link>
            <Link to="/timesheet" className="nav-link">Add Timesheet</Link>
            <Link to="/summary" className="nav-link">Summary</Link>
            <span className="nav-user">Welcome, {user.firstName}!</span>
            <button onClick={handleLogout} className="nav-logout">Logout</button>
          </div>
        ) : (
          <div className="nav-menu">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;