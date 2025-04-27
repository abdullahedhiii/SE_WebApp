import React from 'react';
import { Box, Typography, Paper, Avatar } from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const data = {
  labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Actual',
      data: [400, 500, 450, 600, 700, 650, null, null, null],
      borderColor: '#6C63FF',
      backgroundColor: 'rgba(108,99,255,0.12)',
      tension: 0.4,
      fill: true,
      pointRadius: 5,
      pointBackgroundColor: '#6C63FF',
      pointBorderWidth: 2,
      spanGaps: true,
    },
    {
      label: 'Forecast',
      data: [null, null, null, null, null, 650, 700, 750, 800],
      borderColor: '#00C9A7',
      backgroundColor: 'rgba(0,201,167,0.10)',
      borderDash: [8, 4],
      tension: 0.4,
      fill: true,
      pointRadius: 5,
      pointBackgroundColor: '#FFD93D',
      pointBorderWidth: 2,
      spanGaps: true,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: { display: true, labels: { font: { weight: 'bold' } } },
    title: { display: true, text: 'Spending Forecast (Next 6 Months)', color: '#00C9A7', font: { size: 18, weight: 'bold' } },
    tooltip: {
      backgroundColor: 'rgba(0,201,167,0.9)',
      titleColor: '#FFD93D',
      bodyColor: '#fff',
      borderColor: '#FFD93D',
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(108,99,255,0.07)' },
      ticks: { color: '#6C63FF', font: { weight: 'bold' } },
    },
    y: {
      grid: { color: 'rgba(0,201,167,0.07)' },
      ticks: { color: '#00C9A7', font: { weight: 'bold' } },
    },
  },
  animation: {
    duration: 1200,
    easing: 'easeOutQuart',
  },
};

export default function ForecastPage() {
  return (
    <Box sx={{ minHeight: '100vh', p: { xs: 1, sm: 2, md: 4 }, animation: 'fadeIn 1.2s' }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar sx={{ bgcolor: 'secondary.main', mr: 2, width: 48, height: 48, boxShadow: 2 }}>
          <TimelineIcon fontSize="large" />
        </Avatar>
        <Typography variant="h4" fontWeight={800} color="secondary.main">
          Spending Forecast (AI)
        </Typography>
      </Box>
      <Paper elevation={6} sx={{ p: 3, borderRadius: 5, background: 'rgba(255,255,255,0.92)', boxShadow: '0 8px 32px 0 #00C9A733', backdropFilter: 'blur(8px)' }}>
        <Line data={data} options={options} />
      </Paper>
    </Box>
  );
} 