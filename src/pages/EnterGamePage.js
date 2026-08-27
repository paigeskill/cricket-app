import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Snackbar,
  Alert,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GameForm from '../components/GameForm';
import { initialMockGames } from '../data/mockData';

function EnterGamePage() {
  const navigate = useNavigate();
  const [successOpen, setSuccessOpen] = useState(false);

  const handleSaveGame = (newGame) => {
    // Get existing games from localStorage, or default to initialMockGames
    const storedGames = localStorage.getItem('cricket_games');
    const games = storedGames ? JSON.parse(storedGames) : [...initialMockGames];

    // Generate unique ID for the new game
    const gameWithId = {
      ...newGame,
      id: Date.now().toString()
    };

    // Add to games list
    const updatedGames = [gameWithId, ...games];
    localStorage.setItem('cricket_games', JSON.stringify(updatedGames));

    // Show success snackbar
    setSuccessOpen(true);

    // After a short delay, navigate to historical stats page to see the new record
    setTimeout(() => {
      navigate('/historical-stats');
    }, 1500);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessOpen(false);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      {/* Back navigation button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{ mb: 3, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
      >
        Back to Home
      </Button>

      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Enter Game Details
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Fill in the details below to record your performance. Once saved, it will be added to your historical statistics.
      </Typography>

      <GameForm onSave={handleSaveGame} />

      <Snackbar
        open={successOpen}
        autoHideDuration={1500}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" variant="filled" sx={{ width: '100%' }}>
          Game successfully recorded! Opening stats table...
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default EnterGamePage;
