import React from 'react';
import { Box, Typography, Paper, Avatar, Alert } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const budget = 2000;
const spent = 2150;
const forecast = [400, 500, 450, 600, 700, 650, 700, 750, 800];

const data = {
  labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Forecasted Spending',
      data: forecast,
      borderColor: '#FF6B6B',
      backgroundColor: 'rgba(255,107,107,0.10)',
      tension: 0.4,
      fill: true,
      pointRadius: 5,
      pointBackgroundColor: '#FFD93D',
      pointBorderWidth: 2,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: true, text: 'Budget Forecast', color: '#000', font: { size: 18, weight: 'bold' } },
    tooltip: {
      backgroundColor: 'rgba(0,0,0,0.9)',
      titleColor: '#888',
      bodyColor: '#fff',
      borderColor: '#888',
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(0,0,0,0.07)' },
      ticks: { color: '#000', font: { weight: 'bold' } },
    },
    y: {
      grid: { color: 'rgba(0,0,0,0.07)' },
      ticks: { color: '#000', font: { weight: 'bold' } },
    },
  },
  animation: {
    duration: 1200,
    easing: 'easeOutQuart',
  },
};

export default function BudgetAlertsPage() {
  return (
    <Box sx={{ minHeight: '100vh', p: { xs: 1, sm: 2, md: 4 }, animation: 'fadeIn 1.2s' }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar sx={{ bgcolor: 'error.main', mr: 2, width: 48, height: 48, boxShadow: 2 }}>
          <WarningAmberIcon fontSize="large" />
        </Avatar>
        <Typography variant="h4" fontWeight={800} color="error.main">
          Budget Alerts & Forecast
        </Typography>
      </Box>
      <Paper elevation={6} sx={{ p: 3, borderRadius: 5, background: 'rgba(255,255,255,0.92)', boxShadow: '0 8px 32px 0 #0002', backdropFilter: 'blur(8px)', mb: 4 }}>
        <Typography variant="h6" fontWeight={700} color="error.main" mb={2}>Budget Status</Typography>
        <Typography variant="body1" fontWeight={600} mb={1}>Budget: <span style={{ color: '#000' }}>${budget}</span></Typography>
        <Typography variant="body1" fontWeight={600} mb={2}>Spent: <span style={{ color: spent > budget ? '#000' : '#888' }}>${spent}</span></Typography>
        {spent > budget ? (
          <Alert severity="error" sx={{ fontWeight: 700, fontSize: 16, mb: 2 }}>You are <b>over budget</b>! Please review your spending.</Alert>
        ) : (
          <Alert severity="success" sx={{ fontWeight: 700, fontSize: 16, mb: 2 }}>You are within your budget. Great job!</Alert>
        )}
        <Line data={data} options={options} />
      </Paper>
    </Box>
  );
} 