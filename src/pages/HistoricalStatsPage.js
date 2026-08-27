import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import StatsTable from '../components/StatsTable';
import { initialMockGames } from '../data/mockData';

function HistoricalStatsPage() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

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

  const handleResetData = () => {
    localStorage.setItem('cricket_games', JSON.stringify(initialMockGames));
    setGames(initialMockGames);
    setResetDialogOpen(false);
  };

  return (
    <Box>
      {/* Header action bar */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
        >
          Back to Home
        </Button>

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            color="warning"
            startIcon={<RefreshIcon />}
            onClick={() => setResetDialogOpen(true)}
            sx={{ borderRadius: 2 }}
          >
            Reset Mock Data
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
        This page displays a dashboard of your historical batting performances for all matches played in 2026.
      </Typography>

      <StatsTable games={games} />

      {/* Reset Confirmation Dialog */}
      <Dialog
        open={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        aria-labelledby="reset-dialog-title"
        aria-describedby="reset-dialog-description"
      >
        <DialogTitle id="reset-dialog-title">
          {"Reset statistics to original mock data?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="reset-dialog-description">
            This action will clear all newly added game records and restore the default 2026 cricket matches. This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setResetDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleResetData} color="warning" variant="contained" autoFocus>
            Confirm Reset
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default HistoricalStatsPage;
