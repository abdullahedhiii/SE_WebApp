import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CategoryIcon from '@mui/icons-material/Category';
import PieChartIcon from '@mui/icons-material/PieChart';

const mockData = {
  total: 1240.5,
  categories: 5,
  budget: 2000,
};

const cards = [
  {
    title: 'Total Expenses',
    value: `$${mockData.total.toLocaleString()}`,
    icon: <AttachMoneyIcon fontSize="large" />,
    color: 'linear-gradient(135deg, #6C63FF 0%, #5A52CC 100%)',
    lightColor: 'rgba(108, 99, 255, 0.12)',
  },
  {
    title: 'Categories',
    value: mockData.categories,
    icon: <CategoryIcon fontSize="large" />,
    color: 'linear-gradient(135deg, #00C9A7 0%, #00A589 100%)',
    lightColor: 'rgba(0, 201, 167, 0.12)',
  },
  {
    title: 'Budget',
    value: `$${mockData.budget.toLocaleString()}`,
    icon: <PieChartIcon fontSize="large" />,
    color: 'linear-gradient(135deg, #FFD93D 0%, #EFCA32 100%)',
    lightColor: 'rgba(255, 217, 61, 0.12)',
  },
];

export default function OverviewCards() {
  return (
    <Grid container spacing={3}>
      {cards.map((card) => (
        <Grid item xs={12} sm={6} md={12} lg={4} key={card.title}>
          <Card
            elevation={0}
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 2.5,
              borderRadius: 3,
              background: 'rgba(255,255,255,0.95)',
              border: '1px solid rgba(231, 231, 231, 0.7)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
              transition: 'all 0.25s ease-in-out',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
                '& .card-blob': {
                  transform: 'scale(1.1)',
                },
              },
            }}
          >
            <Box
              className="card-blob"
              sx={{
                position: 'absolute',
                right: -20,
                bottom: -20,
                width: 150,
                height: 150,
                borderRadius: '50%',
                background: card.lightColor,
                transition: 'transform 0.3s ease-in-out',
                zIndex: 0,
              }}
            />
            <Avatar
              sx={{
                mr: 3,
                width: 60,
                height: 60,
                background: card.color,
                color: '#fff',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                zIndex: 1,
              }}
            >
              {card.icon}
            </Avatar>
            <CardContent sx={{ flex: 1, zIndex: 1, p: 0 }}>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  fontWeight: 500,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  mb: 0.5
                }}
              >
                {card.title}
              </Typography>
              <Typography 
                variant="h4" 
                fontWeight={700} 
                sx={{ 
                  background: card.color,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.5px'
                }}
              >
                {card.value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
} 