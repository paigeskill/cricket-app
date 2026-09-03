import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import EnterGamePage from './pages/EnterGamePage';
import HistoricalStatsPage from './pages/HistoricalStatsPage';
import AnalyticsDashboard from './pages/AnalyticsDashboard';

// Beautiful and sleek dark theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#bb86fc', // Modern, sleek purple
      light: '#e1b0ff',
      dark: '#3700b3',
      contrastText: '#000000',
    },
    secondary: {
      main: '#03dac6', // Teal contrast
      contrastText: '#000000',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/enter-game" element={<EnterGamePage />} />
            <Route path="/historical-stats" element={<HistoricalStatsPage />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
