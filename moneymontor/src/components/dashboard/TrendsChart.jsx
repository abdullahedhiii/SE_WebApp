import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Box } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const options = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: {
      display: true,
      text: 'Spending Trend (Last 7 Months)',
      color: '#6C63FF',
      font: { size: 18, weight: 'bold' },
    },
    tooltip: {
      backgroundColor: 'rgba(108,99,255,0.9)',
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
      grid: { color: 'rgba(108,99,255,0.07)' },
      ticks: { color: '#00C9A7', font: { weight: 'bold' } },
    },
  },
  animation: {
    duration: 1200,
    easing: 'easeOutQuart',
  },
};

export default function TrendsChart({ last7Months }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (last7Months && last7Months.length > 0) {
      setUserData({
        labels: last7Months.map(item => item.month),
        datasets: [
          {
            label: 'Expenses',
            data: last7Months.map(item => item.amount),
            borderColor: 'rgba(108,99,255,1)',
            backgroundColor: (context) => {
              const chart = context.chart;
              const { ctx, chartArea } = chart;
              if (!chartArea) return null;
              const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
              gradient.addColorStop(0, 'rgba(108,99,255,0.25)');
              gradient.addColorStop(1, 'rgba(0,201,167,0.05)');
              return gradient;
            },
            tension: 0.4,
            fill: true,
            pointRadius: 5,
            pointBackgroundColor: '#FFD93D',
            pointBorderWidth: 2,
          },
        ],
      });
    }
  }, [last7Months]);

  return (
    <Box
      sx={{
        background: 'rgba(255,255,255,0.85)',
        borderRadius: 5,
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
        p: 2,
        animation: 'fadeIn 1.2s',
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
      {userData ? <Line data={userData} options={options} /> : <p>Loading chart...</p>}
    </Box>
  );
}
