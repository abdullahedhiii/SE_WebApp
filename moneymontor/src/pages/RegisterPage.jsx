import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import RegisterForm from '../components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
      <Paper elevation={3} sx={{ p: 4, minWidth: 340 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Register for MoneyMontor
        </Typography>
        <RegisterForm />
      </Paper>
    </Box>
  );
} 