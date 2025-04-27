import React from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Box, CssBaseline, Divider, Avatar, Badge, Popover } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import GroupWorkOutlinedIcon from '@mui/icons-material/GroupWorkOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import { useState } from 'react';
import { useAuth } from '../../services/AuthContext';

const drawerWidth = 220;

const navItems = [
  { text: 'Dashboard', icon: <DashboardOutlinedIcon fontSize="medium" />, path: '/' },
  { text: 'Expenses', icon: <ReceiptLongOutlinedIcon fontSize="medium" />, path: '/expenses' },
  { text: 'Clustering', icon: <GroupWorkOutlinedIcon fontSize="medium" />, path: '/clustering' },
  { text: 'Forecast', icon: <TimelineOutlinedIcon fontSize="medium" />, path: '/forecast' },
  { text: 'Insights', icon: <InsightsOutlinedIcon fontSize="medium" />, path: '/insights' },
  { text: 'Budget Alerts', icon: <WarningAmberOutlinedIcon fontSize="medium" />, path: '/budget-alerts' },
  { text: 'Savings Goals', icon: <FlagOutlinedIcon fontSize="medium" />, path: '/savings-goals' },
  { text: 'Family Members', icon: <PeopleOutlinedIcon fontSize="medium" />, path: '/family-members' },
];

const sampleAlerts = [
  { id: 1, type: 'error', message: 'You are over budget! Please review your spending.' },
  { id: 2, type: 'info', message: 'Forecast: Spending may increase next month.' },
];

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [unread, setUnread] = useState(sampleAlerts.length);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNotifClick = (event) => {
    setAnchorEl(event.currentTarget);
    setUnread(0);
  };

  const handleNotifClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#fff', color: 'primary.main', borderRight: '1px solid #E0E0E0' }}>
      <Toolbar sx={{ justifyContent: 'center', alignItems: 'center', minHeight: 80, px: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main', color: '#fff', width: 40, height: 40, fontSize: 24, mr: 1 }}>💸</Avatar>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, letterSpacing: 0.5, ml: 1, color: 'primary.main', fontSize: '1.25rem' }}>
          MoneyMontor
        </Typography>
      </Toolbar>
      <Divider sx={{ bgcolor: '#E0E0E0' }} />
      <List sx={{ flex: 1, px: 1, py: 2 }}>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            sx={{
              my: 0.5,
              borderRadius: 2,
              bgcolor: location.pathname === item.path ? 'primary.main' : 'transparent',
              color: location.pathname === item.path ? '#fff' : 'primary.main',
              fontWeight: location.pathname === item.path ? 700 : 500,
              fontSize: '1rem',
              px: 2,
              minHeight: 48,
              transition: 'all 0.18s',
              '&:hover': {
                bgcolor: location.pathname === item.path ? 'primary.main' : '#F5F5F5',
                color: location.pathname === item.path ? '#fff' : 'primary.main',
                transform: 'scale(1.03)',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '1rem', fontWeight: location.pathname === item.path ? 700 : 500 }} />
          </ListItem>
        ))}
        <ListItem button onClick={handleLogout} sx={{ mt: 2, borderRadius: 2, color: 'primary.main', px: 2, minHeight: 48, '&:hover': { bgcolor: '#F5F5F5', color: 'primary.main' } }}>
          <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}><LogoutOutlinedIcon fontSize="medium" /></ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '1rem', fontWeight: 500 }} />
        </ListItem>
      </List>
      <Box sx={{ p: 2, textAlign: 'center', fontSize: 12, color: 'secondary.main' }}>
        &copy; {new Date().getFullYear()} MoneyMontor
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <CssBaseline />
      <AppBar position="fixed" elevation={0} sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: '#fff',
        color: 'primary.main',
        boxShadow: '0 2px 8px 0 rgba(33,40,50,0.06)',
      }}>
        <Toolbar sx={{ minHeight: 64, px: 2 }}>
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon fontSize="medium" />
          </IconButton>
          <Avatar sx={{ bgcolor: 'primary.main', color: '#fff', width: 36, height: 36, fontSize: 20, mr: 1 }}>💸</Avatar>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, letterSpacing: 0.5, color: 'primary.main', fontSize: '1.15rem', flexGrow: 1 }}>
            MoneyMontor
          </Typography>
          <IconButton color="secondary" onClick={handleNotifClick} sx={{ ml: 2 }}>
            <Badge badgeContent={unread} color="warning">
              <NotificationsOutlinedIcon fontSize="medium" />
            </Badge>
          </IconButton>
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleNotifClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{ sx: { p: 2, minWidth: 280, borderRadius: 2 } }}
          >
            <Typography variant="subtitle1" fontWeight={700} mb={1} color="primary.main">Notifications</Typography>
            <List>
              {sampleAlerts.map((alert) => (
                <ListItem key={alert.id} sx={{ color: alert.type === 'error' ? 'primary.main' : 'secondary.main', fontWeight: 600, fontSize: '1rem' }}>
                  <ListItemIcon sx={{ color: alert.type === 'error' ? 'primary.main' : 'secondary.main', minWidth: 36 }}>
                    <WarningAmberOutlinedIcon fontSize="medium" />
                  </ListItemIcon>
                  <ListItemText primary={alert.message} />
                </ListItem>
              ))}
            </List>
          </Popover>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="mailbox folders">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, bgcolor: '#fff', color: 'primary.main', borderRight: '1px solid #E0E0E0' },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, bgcolor: '#fff', color: 'primary.main', borderRight: '1px solid #E0E0E0' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 1, sm: 2, md: 3 }, width: { sm: `calc(100% - ${drawerWidth}px)` }, minHeight: '100vh', animation: 'fadeIn 1.2s' }}>
        <Toolbar />
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(24px); }
            to { opacity: 1; transform: none; }
          }
        `}</style>
        <Outlet />
      </Box>
    </Box>
  );
} 