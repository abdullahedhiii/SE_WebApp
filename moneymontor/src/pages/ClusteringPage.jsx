import React from 'react';
import { Box, Typography, Paper, Grid, Chip, Avatar } from '@mui/material';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const clusters = [
  {
    label: 'Food',
    color: '#6C63FF',
    icon: <FastfoodIcon />, 
    expenses: [
      { name: 'Pizza', amount: 20 },
      { name: 'Coffee', amount: 5 },
    ],
  },
  {
    label: 'Transport',
    color: '#00C9A7',
    icon: <DirectionsBusIcon />, 
    expenses: [
      { name: 'Bus Ticket', amount: 3 },
      { name: 'Taxi', amount: 15 },
    ],
  },
  {
    label: 'Shopping',
    color: '#FFD93D',
    icon: <ShoppingBagIcon />, 
    expenses: [
      { name: 'T-shirt', amount: 25 },
      { name: 'Shoes', amount: 60 },
    ],
  },
  {
    label: 'Health',
    color: '#FF6B6B',
    icon: <LocalHospitalIcon />, 
    expenses: [
      { name: 'Medicine', amount: 12 },
    ],
  },
];

export default function ClusteringPage() {
  return (
    <Box sx={{ minHeight: '100vh', p: { xs: 1, sm: 2, md: 4 }, animation: 'fadeIn 1.2s' }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 48, height: 48, boxShadow: 2 }}>
          <GroupWorkIcon fontSize="large" />
        </Avatar>
        <Typography variant="h4" fontWeight={800} color="primary.main">
          Expense Clustering (AI Groups)
        </Typography>
      </Box>
      <Grid container spacing={3}>
        {clusters.map((cluster) => (
          <Grid item xs={12} sm={6} md={3} key={cluster.label}>
            <Paper elevation={6} sx={{ p: 3, borderRadius: 5, background: 'rgba(255,255,255,0.92)', boxShadow: `0 8px 32px 0 ${cluster.color}33`, backdropFilter: 'blur(8px)', minHeight: 180 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: cluster.color, mr: 1 }}>{cluster.icon}</Avatar>
                <Typography variant="h6" fontWeight={700} color={cluster.color}>{cluster.label}</Typography>
              </Box>
              {cluster.expenses.map((exp, i) => (
                <Chip key={i} label={`${exp.name} ($${exp.amount})`} sx={{ m: 0.5, bgcolor: cluster.color, color: '#fff', fontWeight: 600 }} />
              ))}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
} 