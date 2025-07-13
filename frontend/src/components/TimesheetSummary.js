import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays } from 'date-fns';

const TimesheetSummary = () => {
  const { user } = useAuth();
  const [timesheets, setTimesheets] = useState([]);
  const [period, setPeriod] = useState('week');
  const [loading, setLoading] = useState(false);
  const [totalHours, setTotalHours] = useState(0);

  useEffect(() => {
    fetchTimesheets();
  }, [period]);

  const fetchTimesheets = async () => {
    setLoading(true);
    try {
      const today = new Date();
      let startDate, endDate;

      switch (period) {
        case 'week':
          startDate = startOfWeek(today);
          endDate = endOfWeek(today);
          break;
        case 'month':
          startDate = startOfMonth(today);
          endDate = endOfMonth(today);
          break;
        case 'last7days':
          startDate = subDays(today, 7);
          endDate = today;
          break;
        default:
          startDate = startOfWeek(today);
          endDate = endOfWeek(today);
      }

      const response = await api.get(`/timesheets/${user.id}`, {
        params: {
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd')
        }
      });

      setTimesheets(response.data);
      const total = response.data.reduce((sum, ts) => sum + ts.hours, 0);
      setTotalHours(total);
    } catch (error) {
      console.error('Error fetching timesheets:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupedTimesheets = timesheets.reduce((acc, ts) => {
    const key = ts.projectName;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(ts);
    return acc;
  }, {});

  return (
    <div className="summary-container">
      <h2>Timesheet Summary</h2>
      
      <div className="summary-controls">
        <label htmlFor="period">Period:</label>
        <select
          id="period"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="last7days">Last 7 Days</option>
        </select>
      </div>
      
      <div className="summary-stats">
        <div className="stat-card">
          <h3>Total Hours</h3>
          <p className="stat-number">{totalHours}</p>
        </div>
        <div className="stat-card">
          <h3>Total Entries</h3>
          <p className="stat-number">{timesheets.length}</p>
        </div>
      </div>
      
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="summary-content">
          {Object.keys(groupedTimesheets).length > 0 ? (
            Object.entries(groupedTimesheets).map(([projectName, projectTimesheets]) => (
              <div key={projectName} className="project-summary">
                <h3>{projectName}</h3>
                <p className="project-hours">
                  Total: {projectTimesheets.reduce((sum, ts) => sum + ts.hours, 0)}h
                </p>
                <div className="timesheet-details">
                  {projectTimesheets.map((ts) => (
                    <div key={ts.id} className="timesheet-detail">
                      <span className="detail-date">
                        {format(new Date(ts.date), 'MMM dd, yyyy')}
                      </span>
                      <span className="detail-hours">{ts.hours}h</span>
                      <span className="detail-description">{ts.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>No timesheets found for the selected period.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TimesheetSummary;