import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { format, startOfWeek, endOfWeek } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuth();
  const [recentTimesheets, setRecentTimesheets] = useState([]);
  const [weeklyHours, setWeeklyHours] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const today = new Date();
      const weekStart = startOfWeek(today);
      const weekEnd = endOfWeek(today);
      
      const response = await api.get(`/timesheets/${user.id}`, {
        params: {
          startDate: format(weekStart, 'yyyy-MM-dd'),
          endDate: format(weekEnd, 'yyyy-MM-dd')
        }
      });
      
      setRecentTimesheets(response.data);
      const totalHours = response.data.reduce((sum, ts) => sum + ts.hours, 0);
      setWeeklyHours(totalHours);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>This Week's Hours</h3>
          <p className="stat-number">{weeklyHours}</p>
        </div>
        <div className="stat-card">
          <h3>Timesheets This Week</h3>
          <p className="stat-number">{recentTimesheets.length}</p>
        </div>
      </div>
      
      <div className="dashboard-actions">
        <Link to="/timesheet" className="action-button">
          Add New Timesheet
        </Link>
        <Link to="/summary" className="action-button">
          View Summary
        </Link>
      </div>
      
      <div className="recent-timesheets">
        <h3>Recent Timesheets</h3>
        {recentTimesheets.length > 0 ? (
          <div className="timesheet-list">
            {recentTimesheets.map((ts) => (
              <div key={ts.id} className="timesheet-item">
                <div className="timesheet-project">{ts.projectName}</div>
                <div className="timesheet-date">{format(new Date(ts.date), 'MMM dd, yyyy')}</div>
                <div className="timesheet-hours">{ts.hours}h</div>
              </div>
            ))}
          </div>
        ) : (
          <p>No timesheets for this week yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;