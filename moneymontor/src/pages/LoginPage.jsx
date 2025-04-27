import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import LoginForm from '../components/auth/LoginForm';

export default function LoginPage() {
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