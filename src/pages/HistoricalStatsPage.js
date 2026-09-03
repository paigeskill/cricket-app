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
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import AnalyticsIcon from '@mui/icons-material/BarChart';
import StatsTable from '../components/StatsTable';
import EditGameDialog from '../components/EditGameDialog';
import { initialMockGames } from '../data/mockData';

function HistoricalStatsPage() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [selectedGameToEdit, setSelectedGameToEdit] = useState(null);
  const [defaultFormTab, setDefaultFormTab] = useState(0);

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

  const handleUpdateGame = (updatedGame) => {
    const updatedGames = games.map(g => g.id === updatedGame.id ? updatedGame : g);
    localStorage.setItem('cricket_games', JSON.stringify(updatedGames));
    setGames(updatedGames);
    setSelectedGameToEdit(null);
  };

  const handleEditClick = (game, defaultTab) => {
    setSelectedGameToEdit(game);
    setDefaultFormTab(defaultTab || 0);
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
            color="warning"
            startIcon={<RefreshIcon />}
            onClick={() => setResetDialogOpen(true)}
            sx={{ borderRadius: 2 }}
          >
            Reset Mock Data
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

      {/* Reusable Edit Game Modal Component */}
      <EditGameDialog
        open={!!selectedGameToEdit}
        onClose={() => setSelectedGameToEdit(null)}
        game={selectedGameToEdit}
        defaultTab={defaultFormTab}
        onSave={handleUpdateGame}
      />
    </Box>
  );
}

export default HistoricalStatsPage;
