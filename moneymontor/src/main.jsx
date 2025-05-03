import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import App from './App';
import theme from './theme/theme';
import { UserProvider } from './contexts/UserContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
        <UserProvider>
            <CssBaseline />
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </UserProvider>
    </ThemeProvider>
  </React.StrictMode>
);
