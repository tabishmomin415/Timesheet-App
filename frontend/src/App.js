import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import TimesheetForm from './components/TimesheetForm';
import TimesheetSummary from './components/TimesheetSummary';
import AdminDashboard from './components/AdminDashboard';
import Navbar from './components/Navbar';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  return user && user.role === 'ADMIN' ? children : <Navigate to="/login" />;
}

function EmployeeRoute({ children }) {
  const { user } = useAuth();
  return user && user.role === 'EMPLOYEE' ? children : <Navigate to="/admin" />;
}

function AppContent() {
  const { user } = useAuth();

  // Determine default route based on user role
  const getDefaultRoute = () => {
    if (!user) return '/login';
    return user.role === 'ADMIN' ? '/admin' : '/dashboard';
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Employee Routes */}
        <Route
          path="/dashboard"
          element={
            <EmployeeRoute>
              <Navbar />
              <Dashboard />
            </EmployeeRoute>
          }
        />
        <Route
          path="/timesheet/new"
          element={
            <EmployeeRoute>
              <Navbar />
              <TimesheetForm />
            </EmployeeRoute>
          }
        />
        <Route
          path="/timesheet/summary"
          element={
            <EmployeeRoute>
              <Navbar />
              <TimesheetSummary />
            </EmployeeRoute>
          }
        />
        
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Navbar />
              <AdminDashboard />
            </AdminRoute>
          }
        />
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to={getDefaultRoute()} />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;