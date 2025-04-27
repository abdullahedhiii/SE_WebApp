import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#C62828', // Deep professional red
      contrastText: '#fff',
    },
    secondary: {
      main: '#FFD600', // Gold accent
      contrastText: '#212121',
    },
    background: {
      default: '#F5F5F5',
      paper: '#fff',
    },
    error: { main: '#C62828' },
    warning: { main: '#FFD600' },
    info: { main: '#1976d2' },
    success: { main: '#388e3c' },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
    divider: '#E0E0E0',
  },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
    h1: { fontWeight: 700, fontSize: '2.2rem', letterSpacing: '-1px' },
    h2: { fontWeight: 700, fontSize: '1.5rem' },
    h3: { fontWeight: 600, fontSize: '1.2rem' },
    h4: { fontWeight: 600, fontSize: '1.1rem' },
    h5: { fontWeight: 500, fontSize: '1rem' },
    h6: { fontWeight: 500, fontSize: '0.95rem' },
    body1: { fontSize: '1rem', fontWeight: 400 },
    body2: { fontSize: '0.95rem', fontWeight: 400 },
    button: { fontWeight: 600, fontSize: '1rem', textTransform: 'none', letterSpacing: '0.5px' },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          background: '#fff',
          boxShadow: '0 2px 8px 0 rgba(33,40,50,0.06)',
          borderRadius: 12,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#fff',
          boxShadow: '0 2px 8px 0 rgba(33,40,50,0.08)',
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          fontSize: '1rem',
          minHeight: 44,
          padding: '0 24px',
          boxShadow: 'none',
          textTransform: 'none',
          '&:hover': {
            background: '#B71C1C',
            color: '#fff',
            boxShadow: 'none',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          minHeight: 48,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: 40,
          height: 40,
          fontSize: '1.25rem',
        },
      },
    },
  },
});

export default theme; 