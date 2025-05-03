import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Avatar, CircularProgress, Alert, Card, CardContent, Grid } from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';
import { format } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: { display: false },
    tooltip: {
      backgroundColor: 'rgba(0,0,0,0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: '#666',
      borderWidth: 1,
      callbacks: {
        label: function(context) {
          return `$${context.parsed.y.toLocaleString()}`;
        },
        title: function(context) {
          return context[0].label;
        }
      }
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(108,99,255,0.07)' },
      ticks: { color: '#666', font: { weight: 'bold' } },
    },
    y: {
      grid: { color: 'rgba(0,201,167,0.07)' },
      ticks: { 
        color: '#00C9A7', 
        font: { weight: 'bold' },
        callback: function(value) {
          return '$' + value.toLocaleString();
        }
      },
    },
  },
  animation: {
    duration: 1200,
    easing: 'easeOutQuart',
  },
};


export default function ForecastPage() {
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchForecastData = async () => {
      try { 
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/forecasting/${user._id}`);
        if (response.data.message) {
          setError(response.data.message);
          setLoading(false);
          return;
        }
        setForecastData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message || "Failed to fetch forecast data");
        setLoading(false);
      }
    };
    fetchForecastData();
  }, [user._id]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  const getChartData = () => {
    if (!forecastData || !forecastData.forecast) return null;

    const labels = forecastData.forecast.map(item => formatDate(item.ds));
    const values = forecastData.forecast.map(item => item.yhat);

    return {
      labels,
      datasets: [
        {
          label: 'Predicted Spending',
          data: values,
          borderColor: '#6C63FF',
          backgroundColor: 'rgba(108, 99, 255, 0.2)',
          borderWidth: 3,
          pointBackgroundColor: '#6C63FF',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          fill: true,
          tension: 0.3,
        }
      ],
    };
  };

  // Calculate weekly trend percentages
  const calculateTrends = () => {
    if (!forecastData || !forecastData.forecast || forecastData.forecast.length < 2) {
      return [];
    }

    return forecastData.forecast.map((item, index) => {
      if (index === 0) return { trend: 0, increase: false };

      const prevValue = forecastData.forecast[index - 1].yhat;
      const currentValue = item.yhat;
      const percentChange = ((currentValue - prevValue) / prevValue) * 100;
      
      return {
        trend: Math.abs(percentChange).toFixed(1),
        increase: percentChange > 0
      };
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={60} thickness={4} color="secondary" />
        <Typography variant="h6" sx={{ ml: 2, color: 'text.primary' }}>Generating your spending forecast...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          There was an error generating your spending forecast. Please try again later.
        </Alert>
      </Box>
    );
  }

  if (!forecastData || !forecastData.forecast) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">
          Not enough data to generate a forecast. Add more expenses to see AI-powered predictions.
        </Alert>
      </Box>
    );
  }

  const chartData = getChartData();
  const trends = calculateTrends();

  return (
    <Box sx={{ minHeight: '100vh', p: { xs: 1, sm: 2, md: 4 }, animation: 'fadeIn 1.2s' }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: none; }
        }
        .forecast-card {
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .forecast-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.1);
        }
      `}</style>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar sx={{ bgcolor: '#6C63FF', mr: 2, width: 48, height: 48, boxShadow: 2 }}>
          <TimelineIcon fontSize="large" sx={{ color: '#fff' }} />
        </Avatar>
        <Typography variant="h4" fontWeight={800} color="#6C63FF">
          Spending Forecast (4 Weeks)
        </Typography>
      </Box>

      {forecastData.alert && (
        <Alert 
          severity="warning" 
          icon={<WarningAmberIcon fontSize="inherit" />} 
          sx={{ 
            mb: 3, 
            borderRadius: 2, 
            boxShadow: 1,
            '& .MuiAlert-icon': {
              color: '#F44336'
            }
          }}
        >
          <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#000' }}>
            {forecastData.alert}
          </Typography>
        </Alert>
      )}

      <Paper 
        elevation={4} 
        sx={{ 
          p: 3, 
          borderRadius: 4, 
          background: 'rgba(255,255,255,0.95)', 
          boxShadow: '0 8px 32px 0 #00C9A733', 
          mb: 4,
          height: 400
        }}
      >
        {chartData && <Line data={chartData} options={options} />}
      </Paper>
      
      <Typography variant="h5" fontWeight={700} color="#000" sx={{ mb: 2 }}>
        Weekly Spending Projections
      </Typography>
      
      <Grid container spacing={3}>
        {forecastData.forecast.map((week, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              className="forecast-card"
              elevation={3} 
              sx={{ 
                borderRadius: 3,
                borderTop: index > 0 && trends[index].increase 
                  ? '4px solid #F44336' 
                  : index > 0 ? '4px solid #4CAF50' : '4px solid #2196F3',
              }}
            >
              <CardContent>
                <Typography variant="subtitle2" color="#555" gutterBottom>
                  Week of
                </Typography>
                <Typography variant="h6" fontWeight={700} color="#000" gutterBottom>
                  {formatDate(week.ds)}
                </Typography>
                <Typography variant="h4" fontWeight={800} color="#6C63FF">
                  ${Math.round(week.yhat).toLocaleString()}
                </Typography>
                
                {index > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUpIcon 
                      fontSize="small" 
                      sx={{ 
                        mr: 0.5, 
                        color: trends[index].increase ? 'error.main' : 'success.main',
                        transform: trends[index].increase ? 'none' : 'rotate(180deg)'
                      }} 
                    />
                    <Typography 
                      variant="body2" 
                      fontWeight={600}
                      color={trends[index].increase ? 'error.main' : 'success.main'}
                    >
                      {trends[index].trend}% {trends[index].increase ? 'increase' : 'decrease'}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
} 