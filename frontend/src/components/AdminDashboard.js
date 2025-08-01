import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Grid,
  Card,
  CardContent,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import dayjs from 'dayjs';
import api from '../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [timesheets, setTimesheets] = useState([]);
  const [projects, setProjects] = useState([]);
  const [openProjectDialog, setOpenProjectDialog] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [startDate, setStartDate] = useState(dayjs().subtract(30, 'day'));
  const [endDate, setEndDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTimesheets();
    fetchProjects();
  }, []);

  const fetchTimesheets = async () => {
    setLoading(true);
    try {
      const response = await api.get('/timesheets/admin/all', {
        params: {
          startDate: startDate.format('YYYY-MM-DD'),
          endDate: endDate.format('YYYY-MM-DD')
        }
      });
      setTimesheets(response.data);
    } catch (error) {
      console.error('Error fetching timesheets:', error);
      setError('Failed to fetch timesheets');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleCreateProject = async () => {
    try {
      setError('');
      await api.post('/projects', newProject);
      setSuccess('Project created successfully!');
      setNewProject({ name: '', description: '' });
      setOpenProjectDialog(false);
      fetchProjects();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data || 'Failed to create project');
    }
  };

  const getEmployeeData = () => {
    const employeeHours = {};
    timesheets.forEach(timesheet => {
      if (employeeHours[timesheet.userName]) {
        employeeHours[timesheet.userName] += parseFloat(timesheet.hours);
      } else {
        employeeHours[timesheet.userName] = parseFloat(timesheet.hours);
      }
    });

    return {
      labels: Object.keys(employeeHours),
      datasets: [
        {
          label: 'Total Hours',
          data: Object.values(employeeHours),
          backgroundColor: '#36A2EB',
        },
      ],
    };
  };

  const getProjectData = () => {
    const projectHours = {};
    timesheets.forEach(timesheet => {
      if (projectHours[timesheet.projectName]) {
        projectHours[timesheet.projectName] += parseFloat(timesheet.hours);
      } else {
        projectHours[timesheet.projectName] = parseFloat(timesheet.hours);
      }
    });

    return {
      labels: Object.keys(projectHours),
      datasets: [
        {
          data: Object.values(projectHours),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
          ],
        },
      ],
    };
  };

  // Group timesheets by employee
  const getEmployeeTimesheets = () => {
    const employeeGroups = {};

    timesheets.forEach(timesheet => {
      if (!employeeGroups[timesheet.userName]) {
        employeeGroups[timesheet.userName] = {
          timesheets: [],
          totalHours: 0,
          projectHours: {}
        };
      }

      employeeGroups[timesheet.userName].timesheets.push(timesheet);
      employeeGroups[timesheet.userName].totalHours += parseFloat(timesheet.hours);

      // Track hours per project for each employee
      if (employeeGroups[timesheet.userName].projectHours[timesheet.projectName]) {
        employeeGroups[timesheet.userName].projectHours[timesheet.projectName] += parseFloat(timesheet.hours);
      } else {
        employeeGroups[timesheet.userName].projectHours[timesheet.projectName] = parseFloat(timesheet.hours);
      }
    });

    return employeeGroups;
  };

  const totalHours = timesheets.reduce((sum, timesheet) => sum + parseFloat(timesheet.hours), 0);
  const uniqueEmployees = new Set(timesheets.map(t => t.userName)).size;
  const employeeTimesheets = getEmployeeTimesheets();

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Hours (Period)
              </Typography>
              <Typography variant="h4">
                {totalHours.toFixed(1)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Employees
              </Typography>
              <Typography variant="h4">
                {uniqueEmployees}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Projects
              </Typography>
              <Typography variant="h4">
                {projects.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filter Timesheets
        </Typography>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newDate) => setStartDate(newDate)}
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newDate) => setEndDate(newDate)}
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              fullWidth
              onClick={fetchTimesheets}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Filter'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {timesheets.length > 0 && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Hours by Employee
              </Typography>
              <Box sx={{ height: 300 }}>
                <Bar data={getEmployeeData()} options={{ maintainAspectRatio: false }} />
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Hours by Project
              </Typography>
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                <Pie data={getProjectData()} options={{ maintainAspectRatio: false }} />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Projects Management
          </Typography>
          <Button
            variant="contained"
            onClick={() => setOpenProjectDialog(true)}
          >
            Add New Project
          </Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.description}</TableCell>
                  <TableCell>{project.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Employee Timesheets Section - Grouped by Employee */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Employee Timesheets Summary
        </Typography>

        {Object.keys(employeeTimesheets).length === 0 ? (
          <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
            No timesheet data available for the selected period.
          </Typography>
        ) : (
          Object.entries(employeeTimesheets).map(([employeeName, data]) => (
            <Accordion key={employeeName} sx={{ mb: 2 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${employeeName}-content`}
                id={`${employeeName}-header`}
                sx={{
                  backgroundColor: '#f5f5f5',
                  '&:hover': { backgroundColor: '#e0e0e0' }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <PersonIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div">
                      {employeeName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Total Hours: {data.totalHours.toFixed(1)} | Entries: {data.timesheets.length}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
                    {Object.entries(data.projectHours).map(([projectName, hours]) => (
                      <Chip
                        key={projectName}
                        label={`${projectName}: ${hours.toFixed(1)}h`}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    ))}
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Project</TableCell>
                        <TableCell>Hours</TableCell>
                        <TableCell>Description</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.timesheets
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map((timesheet) => (
                          <TableRow key={timesheet.id}>
                            <TableCell>{new Date(timesheet.date).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Chip
                                label={timesheet.projectName}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight="bold">
                                {timesheet.hours}h
                              </Typography>
                            </TableCell>
                            <TableCell>{timesheet.description || 'No description'}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </Paper>

      {/* Add Project Dialog */}
      <Dialog open={openProjectDialog} onClose={() => setOpenProjectDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Project</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Project Name"
            fullWidth
            variant="outlined"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProjectDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateProject} variant="contained">
            Create Project
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;
        