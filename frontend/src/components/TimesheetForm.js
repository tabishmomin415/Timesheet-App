import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { format } from 'date-fns';

const TimesheetForm = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    projectId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    hours: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await api.post(`/timesheets/${user.id}`, {
        ...formData,
        projectId: parseInt(formData.projectId),
        hours: parseFloat(formData.hours)
      });
      
      setMessage('Timesheet added successfully!');
      setFormData({
        projectId: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        hours: '',
        description: ''
      });
    } catch (error) {
      setMessage('Error adding timesheet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="timesheet-form-container">
      <h2>Add Timesheet Entry</h2>
      
      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="timesheet-form">
        <div className="form-group">
          <label htmlFor="projectId">Project:</label>
          <select
            id="projectId"
            name="projectId"
            value={formData.projectId}
            onChange={handleChange}
            required
          >
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="hours">Hours:</label>
          <input
            type="number"
            id="hours"
            name="hours"
            value={formData.hours}
            onChange={handleChange}
            step="0.25"
            min="0"
            max="24"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Describe the work done..."
          />
        </div>
        
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Adding...' : 'Add Timesheet'}
        </button>
      </form>
    </div>
  );
};

export default TimesheetForm;