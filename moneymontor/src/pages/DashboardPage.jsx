import React, { useState } from 'react';
import { Grid, Typography, Paper, Box, Avatar, Card, CardContent, Chip, Divider, LinearProgress, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import OverviewCards from '../components/dashboard/OverviewCards';
import TrendsChart from '../components/dashboard/TrendsChart';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import ArrowDownwardOutlinedIcon from '@mui/icons-material/ArrowDownwardOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import FlagIcon from '@mui/icons-material/Flag';
import GroupIcon from '@mui/icons-material/Group';
import AddIcon from '@mui/icons-material/Add';

// Mock data for recent transactions
const recentTransactions = [
  { id: 1, name: 'Grocery Store', category: 'Food', amount: -86.42, date: 'Today' },
  { id: 2, name: 'Salary Deposit', category: 'Income', amount: 3200.00, date: 'Yesterday' },
  { id: 3, name: 'Electric Bill', category: 'Utilities', amount: -94.20, date: 'Oct 15' },
  { id: 4, name: 'Restaurant', category: 'Food', amount: -32.50, date: 'Oct 12' },
];

// Mock data for savings goals
const savingsGoals = [
  { id: 1, name: 'Vacation', target: 2000, current: 1200, color: 'primary.main' },
  { id: 2, name: 'New Laptop', target: 1500, current: 800, color: 'secondary.main' },
];

export default function DashboardPage() {
  const [timeFilter, setTimeFilter] = useState('month');
  const navigate = useNavigate();

  const handleAddGoal = () => {
    navigate('/savings-goals');
  };

  const handleManageFamily = () => {
    navigate('/family-members');
  };

  return (
    <Box sx={{ minHeight: '100vh', width: '100%', p: { xs: 2, sm: 3 }, animation: 'fadeIn 1.2s' }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
      
      {/* Page Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4" fontWeight={700} color="text.primary" sx={{ fontSize: { xs: '1.5rem', md: '2rem' }}}>
            Financial Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Welcome back! Here's your financial summary
          </Typography>
        </Box>
        
        <Box sx={{ mt: { xs: 2, sm: 0 }, display: 'flex', gap: 1 }}>
          <Chip 
            label="This Month" 
            variant={timeFilter === 'month' ? 'filled' : 'outlined'} 
            color="primary" 
            onClick={() => setTimeFilter('month')} 
            sx={{ fontWeight: 600 }}
          />
          <Chip 
            label="3 Months" 
            variant={timeFilter === '3months' ? 'filled' : 'outlined'} 
            color="primary" 
            onClick={() => setTimeFilter('3months')} 
            sx={{ fontWeight: 600 }}
          />
          <Chip 
            label="Year" 
            variant={timeFilter === 'year' ? 'filled' : 'outlined'} 
            color="primary" 
            onClick={() => setTimeFilter('year')} 
            sx={{ fontWeight: 600 }}
          />
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        {/* Financial Overview Section */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ 
            p: 3, 
            borderRadius: 3, 
            background: '#fff', 
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
            mb: 3
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight={700} color="text.primary">
                Financial Overview
              </Typography>
              <Avatar sx={{ bgcolor: 'primary.main', height: 36, width: 36 }}>
                <AccountBalanceOutlinedIcon fontSize="small" />
              </Avatar>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <Card elevation={0} sx={{ bgcolor: '#f7f9fc', border: '1px solid #eef2f6', borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Monthly Income
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color="text.primary">
                      $3,450.00
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <ArrowUpwardOutlinedIcon sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                      <Typography variant="caption" color="success.main" fontWeight={600}>
                        +12.5% from last month
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Card elevation={0} sx={{ bgcolor: '#f7f9fc', border: '1px solid #eef2f6', borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Monthly Expenses
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color="text.primary">
                      $1,840.50
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <ArrowDownwardOutlinedIcon sx={{ color: 'error.main', fontSize: 16, mr: 0.5 }} />
                      <Typography variant="caption" color="error.main" fontWeight={600}>
                        -3.2% from last month
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Card elevation={0} sx={{ bgcolor: '#f7f9fc', border: '1px solid #eef2f6', borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Balance
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color="text.primary">
                      $1,609.50
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <ArrowUpwardOutlinedIcon sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                      <Typography variant="caption" color="success.main" fontWeight={600}>
                        +8.5% from last month
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 4, mb: 2 }}>
              <TrendsChart />
            </Box>
          </Paper>
          
          <Paper elevation={0} sx={{ 
            p: 3, 
            borderRadius: 3, 
            background: '#fff', 
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight={700} color="text.primary">
                Recent Transactions
              </Typography>
              <Button variant="outlined" size="small" sx={{ fontWeight: 600, borderRadius: 2 }}>
                View All
              </Button>
            </Box>
            
            {recentTransactions.map((transaction, index) => (
              <React.Fragment key={transaction.id}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  py: 1.5,
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: transaction.amount > 0 ? 'success.light' : 'error.light', 
                        height: 40, 
                        width: 40, 
                        color: transaction.amount > 0 ? 'success.main' : 'error.main'
                      }}
                    >
                      {transaction.amount > 0 ? 
                        <ArrowUpwardOutlinedIcon fontSize="small" /> : 
                        <ArrowDownwardOutlinedIcon fontSize="small" />
                      }
                    </Avatar>
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="body2" fontWeight={600} color="text.primary">
                        {transaction.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {transaction.category} • {transaction.date}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography 
                    variant="body2" 
                    fontWeight={700} 
                    color={transaction.amount > 0 ? 'success.main' : 'error.main'}
                  >
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}
                  </Typography>
                </Box>
                {index < recentTransactions.length - 1 && <Divider sx={{ my: 0.5 }} />}
              </React.Fragment>
            ))}
          </Paper>
        </Grid>
        
        {/* Right Column - Cards and Goals */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ 
            p: 3, 
            borderRadius: 3, 
            background: '#fff', 
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
            mb: 3,
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight={700} color="text.primary">
                Spending Categories
              </Typography>
              <MoreVertOutlinedIcon sx={{ color: 'text.secondary' }} />
            </Box>
            
            <OverviewCards />
          </Paper>
          
          <Paper elevation={0} sx={{ 
            p: 3, 
            borderRadius: 3, 
            background: '#fff', 
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
            mb: 3,
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight={700} color="text.primary">
                Savings Goals
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                size="small" 
                startIcon={<AddIcon />}
                onClick={handleAddGoal}
                sx={{ fontWeight: 600, borderRadius: 2 }}
              >
                Add Goal
              </Button>
            </Box>
            
            {savingsGoals.map((goal) => (
              <Box key={goal.id} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" fontWeight={600} color="text.primary">
                    {goal.name}
                  </Typography>
                  <Typography variant="body2" fontWeight={600} color="text.secondary">
                    ${goal.current} of ${goal.target}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(goal.current / goal.target) * 100} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4, 
                    bgcolor: 'background.paper',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: goal.color,
                    }
                  }} 
                />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  {Math.round((goal.current / goal.target) * 100)}% completed
                </Typography>
              </Box>
            ))}
            
            <Button 
              variant="outlined" 
              color="primary" 
              fullWidth 
              onClick={() => navigate('/savings-goals')}
              sx={{ mt: 2, fontWeight: 600, borderRadius: 2 }}
            >
              Manage All Goals
            </Button>
          </Paper>
          
          <Paper elevation={0} sx={{ 
            p: 3, 
            borderRadius: 3, 
            background: '#fff', 
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <GroupIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6" fontWeight={700} color="text.primary">
                  Family Access
                </Typography>
              </Box>
              <Button 
                variant="outlined" 
                color="primary" 
                size="small"
                onClick={handleManageFamily}
                sx={{ fontWeight: 600, borderRadius: 2 }}
              >
                Manage
              </Button>
            </Box>
            
            <Typography variant="body2" color="text.secondary" paragraph>
              Share financial information with your family members and control what they can see and edit.
            </Typography>
            
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth
              startIcon={<GroupIcon />}
              onClick={() => navigate('/family-members')}
              sx={{ fontWeight: 600, borderRadius: 2 }}
            >
              Add Family Member
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 