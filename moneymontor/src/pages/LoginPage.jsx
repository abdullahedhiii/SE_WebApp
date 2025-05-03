import React, { useEffect } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import LoginForm from '../components/auth/LoginForm';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const {user,details,loading } = useUser(); 
  const navigate = useNavigate();
  console.log(user,details,loading,'on login page');
  
  useEffect(() => {
    if(!loading && user && user._id && details){
      console.log('navigating to home');
      navigate('/home');
    }
  }, [user,details,loading]);
  
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
      <Paper elevation={3} sx={{ p: 4, minWidth: 340 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login to MoneyMontor
        </Typography>
        <LoginForm />
      </Paper>
    </Box>
  );
} 