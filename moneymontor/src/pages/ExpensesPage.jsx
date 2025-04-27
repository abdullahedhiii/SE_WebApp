import React from 'react';
import { Grid, Typography, Paper, Box, Avatar } from '@mui/material';
import ExpenseForm from '../components/expenses/ExpenseForm';
import ExpenseTable from '../components/expenses/ExpenseTable';
import AddCircleIcon from '@mui/icons-material/AddCircle';

export default function ExpensesPage() {
  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
      p: { xs: 1, sm: 2, md: 4 },
      animation: 'fadeIn 1.2s',
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 48, height: 48, boxShadow: 2 }}>
          <AddCircleIcon fontSize="large" />
        </Avatar>
        <Typography variant="h4" fontWeight={800} color="primary.main">
          Expenses
        </Typography>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper elevation={6} sx={{ p: 3, borderRadius: 5, background: 'rgba(255,255,255,0.85)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)', backdropFilter: 'blur(8px)' }}>
            <ExpenseForm />
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <ExpenseTable />
        </Grid>
      </Grid>
    </Box>
  );
} 