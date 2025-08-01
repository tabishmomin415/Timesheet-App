import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  // Check if user is admin
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Timesheet Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {isAdmin ? (
            // Admin-only navigation
            <Button
              color="inherit"
              onClick={() => navigate('/admin')}
              variant={isActive('/admin') ? 'outlined' : 'text'}
            >
              Admin Dashboard
            </Button>
          ) : (
            // Employee navigation
            <>
              <Button
                color="inherit"
                onClick={() => navigate('/dashboard')}
                variant={isActive('/dashboard') ? 'outlined' : 'text'}
              >
                Dashboard
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate('/timesheet/new')}
                variant={isActive('/timesheet/new') ? 'outlined' : 'text'}
              >
                Add Timesheet
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate('/timesheet/summary')}
                variant={isActive('/timesheet/summary') ? 'outlined' : 'text'}
              >
                Summary
              </Button>
            </>
          )}
          <Button color="inherit" onClick={handleLogout}>
            Logout ({user?.username})
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;