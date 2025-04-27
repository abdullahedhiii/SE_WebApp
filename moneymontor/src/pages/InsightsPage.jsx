import React from 'react';
import { Box, Typography, Paper, Avatar, Grid } from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const pieData = {
  labels: ['Food', 'Transport', 'Shopping', 'Health', 'Other'],
  datasets: [
    {
      label: 'Categories',
      data: [400, 150, 300, 100, 80],
      backgroundColor: [
        '#6C63FF', '#00C9A7', '#FFD93D', '#FF6B6B', '#BDBDBD'
      ],
      borderWidth: 2,
    },
  ],
};

const barData = {
  labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
  datasets: [
    {
      label: 'Expenses',
      data: [400, 500, 450, 600, 700, 650],
      backgroundColor: 'rgba(108,99,255,0.7)',
      borderRadius: 8,
      maxBarThickness: 36,
    },
  ],
};

const barOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: true, text: 'Monthly Expenses', color: '#6C63FF', font: { size: 18, weight: 'bold' } },
  },
  scales: {
    x: {
      grid: { color: 'rgba(108,99,255,0.07)' },
      ticks: { color: '#6C63FF', font: { weight: 'bold' } },
    },
    y: {
      grid: { color: 'rgba(108,99,255,0.07)' },
      ticks: { color: '#00C9A7', font: { weight: 'bold' } },
    },
  },
};

export default function InsightsPage() {
  return (
    <Box sx={{ minHeight: '100vh', p: { xs: 1, sm: 2, md: 4 }, animation: 'fadeIn 1.2s' }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar sx={{ bgcolor: 'warning.main', mr: 2, width: 48, height: 48, boxShadow: 2 }}>
          <InsightsIcon fontSize="large" />
        </Avatar>
        <Typography variant="h4" fontWeight={800} color="warning.main">
          Insights & Visual Summaries
        </Typography>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Paper elevation={6} sx={{ p: 3, borderRadius: 5, background: 'rgba(255,255,255,0.92)', boxShadow: '0 8px 32px 0 #FFD93D33', backdropFilter: 'blur(8px)' }}>
            <Typography variant="h6" fontWeight={700} color="primary.main" mb={2}>Category Breakdown</Typography>
            <Pie data={pieData} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={7}>
          <Paper elevation={6} sx={{ p: 3, borderRadius: 5, background: 'rgba(255,255,255,0.92)', boxShadow: '0 8px 32px 0 #6C63FF33', backdropFilter: 'blur(8px)' }}>
            <Bar data={barData} options={barOptions} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 