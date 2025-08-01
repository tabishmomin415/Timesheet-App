import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box
} from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import api from '../services/api';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Dashboard = () => {
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimesheets();
  }, []);

  const fetchTimesheets = async () => {
    try {
      const response = await api.get('/timesheets');
      setTimesheets(response.data);
    } catch (error) {
      console.error('Error fetching timesheets:', error);
    } finally {
      setLoading(false);
    }
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

  const getWeeklyData = () => {
    const weeklyHours = {};
    timesheets.forEach(timesheet => {
      const week = new Date(timesheet.date).toISOString().slice(0, 10);
      if (weeklyHours[week]) {
        weeklyHours[week] += parseFloat(timesheet.hours);
      } else {
        weeklyHours[week] = parseFloat(timesheet.hours);
      }
    });

    const sortedWeeks = Object.keys(weeklyHours).sort();
    
    return {
      labels: sortedWeeks,
      datasets: [
        {
          label: 'Hours',
          data: sortedWeeks.map(week => weeklyHours[week]),
          backgroundColor: '#36A2EB',
        },
      ],
    };
  };

  const totalHours = timesheets.reduce((sum, timesheet) => sum + parseFloat(timesheet.hours), 0);
  const totalProjects = new Set(timesheets.map(t => t.projectName)).size;

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Hours
              </Typography>
              <Typography variant="h4">
                {totalHours.toFixed(1)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Projects
              </Typography>
              <Typography variant="h4">
                {totalProjects}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Entries
              </Typography>
              <Typography variant="h4">
                {timesheets.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {timesheets.length > 0 && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Hours by Project
                </Typography>
                <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                  <Pie data={getProjectData()} options={{ maintainAspectRatio: false }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Daily Hours
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Bar data={getWeeklyData()} options={{ maintainAspectRatio: false }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Timesheets
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Hours</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {timesheets.slice(0, 10).map((timesheet) => (
                  <TableRow key={timesheet.id}>
                    <TableCell>{new Date(timesheet.date).toLocaleDateString()}</TableCell>
                    <TableCell>{timesheet.projectName}</TableCell>
                    <TableCell>{timesheet.hours}</TableCell>
                    <TableCell>{timesheet.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Dashboard;