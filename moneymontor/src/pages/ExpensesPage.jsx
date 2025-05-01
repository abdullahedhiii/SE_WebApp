import React from 'react';
import { Grid, Typography, Paper, Box, Avatar, Container, Divider } from '@mui/material';
import ExpenseForm from '../components/expenses/ExpenseForm';
import ExpenseTable from '../components/expenses/ExpenseTable';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

export default function ExpensesPage() {
  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #f5f5f5 0%, #ececec 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative elements */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '40%',
        height: '40%',
        background: 'radial-gradient(circle at top right, rgba(255,0,0,0.08), transparent 70%)',
        zIndex: 0,
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '30%',
        height: '30%',
        background: 'radial-gradient(circle at bottom left, rgba(0,0,0,0.05), transparent 70%)',
        zIndex: 0,
      }} />

      <Container maxWidth="xl" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        {/* Page Header */}
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' }, 
            justifyContent: 'space-between',
            mb: 4,
            pb: 2,
            borderBottom: '2px solid rgba(0,0,0,0.06)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              sx={{ 
                bgcolor: '#d32f2f', 
                mr: 2, 
                width: 56, 
                height: 56, 
                boxShadow: '0 4px 20px rgba(211, 47, 47, 0.25)',
                animation: 'pulse 2s infinite'
              }}
            >
              <ReceiptLongIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography 
                variant="h4" 
                fontWeight={800} 
                color="#000" 
                sx={{ 
                  letterSpacing: '-0.5px',
                  fontSize: { xs: '1.7rem', md: '2.2rem' }
                }}
              >
                Expenses Manager
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  mt: 0.5,
                  display: { xs: 'none', sm: 'block' } 
                }}
              >
                Track, analyze and manage your financial transactions
              </Typography>
            </Box>
          </Box>
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#d32f2f', 
              fontWeight: 500,
              mt: { xs: 1, sm: 0 },
              fontStyle: 'italic',
              display: { xs: 'none', md: 'block' }
            }}
          >
            Smart spending leads to greater savings
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={5} lg={4}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 0, 
                borderRadius: 4, 
                background: '#fff', 
                overflow: 'hidden',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.07)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
              }}
            >
              <Box 
                sx={{ 
                  p: 2, 
                  background: '#d32f2f',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Typography 
                  variant="h6" 
                  fontWeight={700} 
                  color="#fff"
                  sx={{ ml: 1 }}
                >
                  Record New Expense
                </Typography>
              </Box>
              <Box sx={{ p: { xs: 2, sm: 3 } }}>
                <ExpenseForm />
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={7} lg={8}>
            <Paper 
              elevation={0} 
              sx={{ 
                borderRadius: 4,
                background: '#fff', 
                overflow: 'hidden',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.07)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box 
                sx={{ 
                  py: 1.5, 
                  px: 3, 
                  background: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography 
                  variant="h6" 
                  fontWeight={700} 
                  color="#fff"
                >
                  Expense History
                </Typography>
                <Typography 
                  variant="caption" 
                  color="rgba(255,255,255,0.7)"
                  sx={{ fontStyle: 'italic' }}
                >
                  Latest transactions shown first
                </Typography>
              </Box>
              <Box sx={{ p: { xs: 1, sm: 2 }, flexGrow: 1 }}>
                <ExpenseTable />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      
      {/* Pulse animation for the icon */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
    </Box>
  );
} 