import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  LinearProgress, 
  IconButton, 
  Divider,
  Avatar,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import FlagIcon from '@mui/icons-material/Flag';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddGoalForm from '../components/savings/AddGoalForm';

// Initial mock data for savings goals
const initialGoals = [
  { 
    id: 1, 
    name: 'Vacation', 
    category: 'vacation',
    target: 2000, 
    current: 1200, 
    color: 'primary.main',
    deadline: '2023-12-31',
    notes: 'Trip to Hawaii',
    progress: 60
  },
  { 
    id: 2, 
    name: 'New Laptop', 
    category: 'electronics',
    target: 1500, 
    current: 800, 
    color: 'secondary.main',
    deadline: '2023-10-15',
    notes: 'MacBook Pro',
    progress: 53
  },
  { 
    id: 3, 
    name: 'Emergency Fund', 
    category: 'other',
    target: 5000, 
    current: 3500, 
    color: '#00C9A7',
    deadline: '',
    notes: '3 months of expenses',
    progress: 70
  },
];

export default function SavingsGoalsPage() {
  const [goals, setGoals] = useState(initialGoals);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const handleAddGoal = (newGoal) => {
    setGoals(prev => [...prev, newGoal]);
    showNotification('Goal added successfully!', 'success');
  };

  const handleEditGoal = (goalId) => {
    // Future functionality to edit goals
    console.log('Edit goal:', goalId);
  };

  const openDeleteConfirmation = (goalId) => {
    setGoalToDelete(goalId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteGoal = () => {
    if (goalToDelete) {
      setGoals(prev => prev.filter(goal => goal.id !== goalToDelete));
      setIsDeleteModalOpen(false);
      setGoalToDelete(null);
      showNotification('Goal deleted successfully!', 'success');
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const totalSaved = goals.reduce((sum, goal) => sum + goal.current, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);
  const overallProgress = Math.round((totalSaved / totalTarget) * 100) || 0;

  return (
    <Box sx={{ minHeight: '100vh', width: '100%', p: { xs: 2, sm: 3 }, animation: 'fadeIn 1.2s' }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
      
      {/* Notification */}
      {notification.show && (
        <Alert 
          severity={notification.type}
          sx={{ 
            position: 'fixed', 
            top: 16, 
            right: 16, 
            zIndex: 9999,
            boxShadow: 3,
            borderRadius: 2
          }}
        >
          {notification.message}
        </Alert>
      )}
      
      {/* Page Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 4, 
        flexWrap: 'wrap', 
        justifyContent: 'space-between' 
      }}>
        <Box>
          <Typography 
            variant="h4" 
            fontWeight={700} 
            color="text.primary" 
            sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}
          >
            Savings Goals
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Track and manage your financial objectives
          </Typography>
        </Box>
        
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => setIsAddModalOpen(true)}
          sx={{ 
            mt: { xs: 2, sm: 0 }, 
            borderRadius: 2, 
            py: 1.2, 
            px: 2.5, 
            fontWeight: 600 
          }}
        >
          New Goal
        </Button>
      </Box>
      
      {/* Overall Progress Card */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          borderRadius: 3, 
          background: '#fff', 
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
          mb: 4
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            <AccountBalanceIcon />
          </Avatar>
          <Typography variant="h6" fontWeight={700}>
            Overall Progress
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" fontWeight={600} color="text.secondary">
                  Total Progress
                </Typography>
                <Typography variant="body2" fontWeight={600} color="primary.main">
                  ${totalSaved.toLocaleString()} of ${totalTarget.toLocaleString()}
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={overallProgress} 
                sx={{ height: 10, borderRadius: 5 }} 
              />
            </Box>
            <Typography variant="caption" color="text.secondary">
              You're {overallProgress}% of the way toward your combined savings goals
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Saved
                </Typography>
                <Typography variant="h4" fontWeight={700} color="primary.main">
                  ${totalSaved.toLocaleString()}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Remaining
                </Typography>
                <Typography variant="h6" fontWeight={600} color="text.secondary">
                  ${(totalTarget - totalSaved).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Goals Grid */}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        Your Goals
      </Typography>
      
      <Grid container spacing={3}>
        {goals.map((goal) => (
          <Grid item xs={12} sm={6} md={4} key={goal.id}>
            <Card 
              elevation={0} 
              sx={{ 
                borderRadius: 3, 
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)', 
                border: '1px solid rgba(0,0,0,0.05)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box 
                sx={{ 
                  height: 8, 
                  background: goal.color, 
                  width: '100%', 
                  borderTopLeftRadius: 12, 
                  borderTopRightRadius: 12
                }} 
              />
              
              <CardContent sx={{ pt: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" fontWeight={700} noWrap sx={{ maxWidth: '70%' }}>
                    {goal.name}
                  </Typography>
                  
                  <Box>
                    <Tooltip title="Edit">
                      <IconButton 
                        size="small" 
                        onClick={() => handleEditGoal(goal.id)}
                        sx={{ mr: 0.5 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton 
                        size="small" 
                        onClick={() => openDeleteConfirmation(goal.id)}
                      >
                        <DeleteOutlineIcon fontSize="small" color="error" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" fontWeight={600} color="text.secondary">
                      ${goal.current.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" fontWeight={600} color="text.secondary">
                      ${goal.target.toLocaleString()}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={goal.progress} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      bgcolor: 'background.paper',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: goal.color,
                      }
                    }} 
                  />
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {goal.progress}% completed
                  </Typography>
                </Box>
                
                {goal.deadline && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
                    <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
                    <Typography variant="caption" color="text.secondary">
                      Deadline: {new Date(goal.deadline).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </Typography>
                  </Box>
                )}
                
                {goal.notes && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mt: 1, 
                      fontSize: '0.8rem', 
                      fontStyle: 'italic', 
                      opacity: 0.8 
                    }}
                  >
                    {goal.notes}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* Add Goal Modal */}
      <AddGoalForm 
        open={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={handleAddGoal} 
      />
      
      {/* Delete Confirmation Modal */}
      <Dialog
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={700}>
            Delete Goal
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this savings goal? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setIsDeleteModalOpen(false)} 
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteGoal} 
            variant="contained" 
            color="error"
            sx={{ borderRadius: 2 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 