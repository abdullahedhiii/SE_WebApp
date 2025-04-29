import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#000', // Black
      contrastText: '#fff',
    },
    secondary: {
      main: '#fff', // White
      contrastText: '#000',
    },
    background: {
      default: '#fff',
      paper: '#fff',
    },
    error: { main: '#000' },
    warning: { main: '#888' },
    info: { main: '#888' },
    success: { main: '#888' },
    text: {
      primary: '#000',
      secondary: '#888',
    },
    divider: '#ccc',
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
          boxShadow: '0 2px 8px 0 rgba(0,0,0,0.06)',
          borderRadius: 12,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#fff',
          boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)',
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
          background: '#000',
          color: '#fff',
          '&:hover': {
            background: '#222',
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