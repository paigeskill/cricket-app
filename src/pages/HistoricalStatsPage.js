import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Stack,
  Snackbar,
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AnalyticsIcon from '@mui/icons-material/BarChart';
import StatsTable from '../components/StatsTable';
import EditGameDialog from '../components/EditGameDialog';
import { initialMockGames } from '../data/mockData';
import { parseCSV } from '../utils/csvParserHelper';

function HistoricalStatsPage() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [selectedGameToEdit, setSelectedGameToEdit] = useState(null);
  const [defaultFormTab, setDefaultFormTab] = useState(0);

  // Snackbar states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Load games from localStorage or fallback to default mock data
  useEffect(() => {
    const storedGames = localStorage.getItem('cricket_games');
    if (storedGames) {
      setGames(JSON.parse(storedGames));
    } else {
      setGames(initialMockGames);
      localStorage.setItem('cricket_games', JSON.stringify(initialMockGames));
    }
  }, []);

  const handleUpdateGame = (updatedGame) => {
    const updatedGames = games.map(g => g.id === updatedGame.id ? updatedGame : g);
    localStorage.setItem('cricket_games', JSON.stringify(updatedGames));
    setGames(updatedGames);
    setSelectedGameToEdit(null);
  };

  const handleDeleteGame = (gameId) => {
    const updatedGames = games.filter(g => g.id !== gameId);
    localStorage.setItem('cricket_games', JSON.stringify(updatedGames));
    setGames(updatedGames);
    setSelectedGameToEdit(null);
    setSnackbarSeverity('success');
    setSnackbarMessage('Game record successfully deleted.');
    setSnackbarOpen(true);
  };

  const handleEditClick = (game, defaultTab) => {
    setSelectedGameToEdit(game);
    setDefaultFormTab(defaultTab || 0);
  };

  const handleImportCSV = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const parsedGames = parseCSV(text);
        if (parsedGames.length === 0) {
          throw new Error('No games parsed or invalid file structure');
        }
        localStorage.setItem('cricket_games', JSON.stringify(parsedGames));
        setGames(parsedGames);
        setSnackbarSeverity('success');
        setSnackbarMessage(`Successfully imported ${parsedGames.length} matches!`);
        setSnackbarOpen(true);
      } catch (err) {
        setSnackbarSeverity('error');
        setSnackbarMessage(`Error importing CSV: ${err.message || 'Invalid column headers or file format. Please check your template.'}`);
        setSnackbarOpen(true);
      }
    };
    reader.onerror = () => {
      setSnackbarSeverity('error');
      setSnackbarMessage('Error reading file.');
      setSnackbarOpen(true);
    };
    reader.readAsText(file);
    // Reset file input value to allow uploading same file again
    event.target.value = '';
  };

  return (
    <Box>
      {/* Header action bar */}
      <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
        >
          Back to Home
        </Button>

        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 1 }}>
          <Button
            variant="outlined"
            color="info"
            component="label"
            startIcon={<CloudUploadIcon />}
            sx={{ borderRadius: 2, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
          >
            Import Data
            <input
              type="file"
              accept=".csv"
              hidden
              onChange={handleImportCSV}
              data-testid="csv-file-input"
            />
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AnalyticsIcon />}
            onClick={() => navigate('/analytics')}
            sx={{ borderRadius: 2, color: 'background.default', fontWeight: 'bold' }}
          >
            View Analytics
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutlinedIcon />}
            onClick={() => navigate('/enter-game')}
            sx={{ borderRadius: 2 }}
          >
            Add New Game
          </Button>
        </Stack>
      </Stack>

      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Historical Statistics
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        This page displays a dashboard of your historical batting performances for all matches played.
      </Typography>

      <StatsTable games={games} onEditGame={handleEditClick} />

      {/* Reusable Edit Game Modal Component */}
      <EditGameDialog
        open={!!selectedGameToEdit}
        onClose={() => setSelectedGameToEdit(null)}
        game={selectedGameToEdit}
        defaultTab={defaultFormTab}
        onSave={handleUpdateGame}
        onDelete={handleDeleteGame}
      />

      {/* Toast Feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} variant="filled" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default HistoricalStatsPage;
