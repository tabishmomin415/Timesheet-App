import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ButtonGroup
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import dayjs from 'dayjs';
import api from '../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TimesheetSummary = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [summaryType, setSummaryType] = useState('week');
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const endpoint = summaryType === 'week' ? 'summary/week' : 'summary/month';
      const response = await api.get(`/timesheets/${endpoint}`, {
        params: { date: selectedDate.format('YYYY-MM-DD') }
      });
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const getChartData = () => {
    if (!summary || !summary.timesheets) return null;

    const projectHours = {};
    summary.timesheets.forEach(timesheet => {
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
          label: 'Hours',
          data: Object.values(projectHours),
          backgroundColor: '#36A2EB',
          borderColor: '#36A2EB',
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Timesheet Summary
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={(newDate) => setSelectedDate(newDate)}
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={4}>
            <ButtonGroup variant="outlined" fullWidth>
              <Button
                variant={summaryType === 'week' ? 'contained' : 'outlined'}
                onClick={() => setSummaryType('week')}
              >
                Week
              </Button>
              <Button
                variant={summaryType === 'month' ? 'contained' : 'outlined'}
                onClick={() => setSummaryType('month')}
              >
                Month
              </Button>
            </ButtonGroup>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              fullWidth
              onClick={fetchSummary}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Get Summary'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {summary && (
        <>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Period
                  </Typography>
                  <Typography variant="h6">
                    {summary.period}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Hours
                  </Typography>
                  <Typography variant="h6">
                    {summary.totalHours}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Start Date
                  </Typography>
                  <Typography variant="h6">
                    {new Date(summary.startDate).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    End Date
                  </Typography>
                  <Typography variant="h6">
                    {new Date(summary.endDate).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {summary.timesheets.length > 0 && (
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Hours by Project
              </Typography>
              <Box sx={{ height: 400 }}>
                <Bar 
                  data={getChartData()} 
                  options={{ 
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }} 
                />
              </Box>
            </Paper>
          )}

          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Detailed Entries
            </Typography>
            <TableContainer>
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
                  {summary.timesheets.map((timesheet) => (
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
          </Paper>
        </>
      )}
    </Container>
  );
};

export default TimesheetSummary;