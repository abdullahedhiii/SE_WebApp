import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Chip, Avatar, CircularProgress, Alert, Divider, Card, CardContent, Stack, Button } from '@mui/material';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import DateRangeIcon from '@mui/icons-material/DateRange';
import PieChartIcon from '@mui/icons-material/PieChart';
import SortIcon from '@mui/icons-material/Sort';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';
import { formatDistanceToNow } from 'date-fns';

export default function ClusteringPage() {
  const [clusters, setClusters] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('default'); 
  const { user } = useUser();

  useEffect(() => {
    const fetchClusters = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/clustering/${user._id}`);
        
        if(response.data.message){
          setError(response.data.message);
          setLoading(false);
          return;
        }
        setClusters(response.data.labels);
        
        setLoading(false);
      } catch (error) {
        console.log(error);
        setError(error);
        setLoading(false);
      }
    };

    fetchClusters();
  }, [user._id]);

  const getClusterColor = (label) => {
    switch (label) {
      case 'Low Spending':
        return '#4CAF50'; 
      case 'Moderate Spending':
        return '#FF9800'; 
      case 'High Spending':
        return '#F44336'; 
      default:
        return '#2196F3'; 
    }
  };

  const getClusterIcon = (label) => {
    switch (label) {
      case 'Low Spending':
        return <MoneyOffIcon />;
      case 'Moderate Spending':
        return <AccountBalanceWalletIcon />;
      case 'High Spending':
        return <ShowChartIcon />;
      default:
        return <GroupWorkIcon />;
    }
  };

  const sortExpenses = (expenses, sortType) => {
    if (!Array.isArray(expenses)) return [];
    
    if (sortType === 'amount') {
      return [...expenses].sort((a, b) => {
        const amountA = typeof a.amount === 'number' ? a.amount : parseInt(a.amount) || 0;
        const amountB = typeof b.amount === 'number' ? b.amount : parseInt(b.amount) || 0;
        return amountB - amountA;
      });
    } else if (sortType === 'date') {
      return [...expenses].sort((a, b) => {
        if (!a.date || !b.date) return 0;
        return new Date(b.date) - new Date(a.date);
      });
    }
    return expenses;
  };

  const calculateClusterStats = (expenses) => {
    if (!expenses || !Array.isArray(expenses) || expenses.length === 0) return { total: 0, avg: 0, count: 0 };
    
    const total = expenses.reduce((sum, exp) => sum + (typeof exp.amount === 'number' ? exp.amount : parseInt(exp.amount) || 0), 0);
    return {
      total,
      avg: Math.round(total / expenses.length),
      count: expenses.length
    };
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ ml: 2 }}>Analyzing your spending patterns...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          There was an error analyzing your expenses. Please try again later.
        </Alert>
      </Box>
    );
  }

  if (!clusters) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">
          No expense data available for clustering. Add more expenses to see AI-powered insights.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', p: { xs: 1, sm: 2, md: 4 }, animation: 'fadeIn 1.2s' }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: none; }
        }
        .cluster-card {
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .cluster-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.1);
        }
        .expense-item {
          transition: all 0.2s;
        }
        .expense-item:hover {
          transform: scale(1.03);
        }
      `}</style>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 48, height: 48, boxShadow: 2 }}>
          <PieChartIcon fontSize="large" />
        </Avatar>
        <Typography variant="h4" fontWeight={800} color="primary.main">
          Expense Clustering Analysis
        </Typography>
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            borderRadius: 3, 
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
            border: '1px solid rgba(25, 118, 210, 0.12)'
          }}
        >
          <Typography variant="h6" gutterBottom>
            AI has analyzed your spending patterns and grouped them into these categories
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Understanding your spending clusters can help you optimize your budget and identify areas for potential savings.
          </Typography>
        </Paper>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button 
          startIcon={<SortIcon />} 
          variant="outlined" 
          size="small"
          onClick={() => setSortBy(sortBy === 'default' ? 'amount' : sortBy === 'amount' ? 'date' : 'default')}
        >
          Sort by: {sortBy === 'default' ? 'Default' : sortBy === 'amount' ? 'Amount' : 'Date'}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {clusters && typeof clusters === 'object' && Object.keys(clusters).length > 0 ? (
          Object.keys(clusters).map((clusterLabel) => {
            const clusterExpenses = clusters[clusterLabel];
            const stats = calculateClusterStats(clusterExpenses);
            
            return (
              <Grid item xs={12} md={6} lg={4} key={clusterLabel}>
                <Paper 
                  elevation={4} 
                  className="cluster-card"
                  sx={{ 
                    borderRadius: 4, 
                    overflow: 'hidden',
                    border: `1px solid ${getClusterColor(clusterLabel)}20`,
                  }}
                >
                  <Box 
                    sx={{ 
                      p: 2, 
                      backgroundColor: getClusterColor(clusterLabel), 
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: 'white', color: getClusterColor(clusterLabel), mr: 1 }}>
                        {getClusterIcon(clusterLabel)}
                      </Avatar>
                      <Typography variant="h6" fontWeight={700}>
                        {clusterLabel}
                      </Typography>
                    </Box>
                    <Typography variant="h6">
                      Rs.{stats.total ? stats.total.toLocaleString() : '0'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Typography variant="subtitle2" color="text.secondary">Total Spent</Typography>
                        <Typography variant="h6">Rs.{stats.total ? stats.total.toLocaleString() : 0}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="subtitle2" color="text.secondary">Avg. Expense</Typography>
                        <Typography variant="h6">Rs.{stats.avg ? stats.avg.toLocaleString() : 0}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="subtitle2" color="text.secondary">Expenses</Typography>
                        <Typography variant="h6">{stats.count || 0}</Typography>
                      </Grid>
                    </Grid>
                  </Box>

                  <Divider />
                  
                  <Box sx={{ maxHeight: '300px', overflowY: 'auto', p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Expenses in this cluster:
                    </Typography>
                    {Array.isArray(sortExpenses(clusterExpenses, sortBy)) ? 
                      sortExpenses(clusterExpenses, sortBy).map((exp, i) => (
                        <Card 
                          key={i} 
                          className="expense-item"
                          sx={{ 
                            mb: 1.5, 
                            borderLeft: `4px solid ${getClusterColor(clusterLabel)}`,
                          }}
                          variant="outlined"
                        >
                          <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle1" fontWeight={600}>
                                {exp.category}
                              </Typography>
                              <Typography variant="subtitle1" fontWeight={700}>
                                Rs.{typeof exp.amount === 'number' ? exp.amount.toLocaleString() : exp.amount}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <DateRangeIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5, fontSize: '0.9rem' }} />
                              <Typography variant="caption" color="text.secondary">
                                {formatDate(exp.date)}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      )) : <Typography color="text.secondary">No expense data available</Typography>}
                  </Box>
                </Paper>
              </Grid>
            );
          })
        ) : (
          <Grid item xs={12}>
            <Alert severity="info" sx={{ p: 2 }}>
              No clustering data available. This could be because you have too few expenses or they don't form distinct patterns yet.
            </Alert>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
