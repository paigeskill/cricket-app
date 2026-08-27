import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import HistoryIcon from '@mui/icons-material/History';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      {/* Hero Section */}
      <Box sx={{ mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <SportsCricketIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: '800', letterSpacing: -1 }}>
          CricketStats
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 4, fontWeight: 300 }}>
          The modern platform for cricket enthusiasts to easily record, track, and analyze game statistics.
        </Typography>
      </Box>

      {/* Main Call to Actions */}
      <Grid container spacing={4} sx={{ justifyContent: 'center', alignItems: 'stretch' }}>
        {/* Card 1: Enter Game */}
        <Grid item xs={12} sm={6} md={5} sx={{ display: 'flex' }}>
          <Card 
            className="hover-card"
            sx={{ 
              width: '100%',
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              bgcolor: 'background.paper',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: 3
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <AddCircleOutlinedIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                Enter New Game
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Finished playing a game? Log your statistics right now, including runs scored, batting position, dismissal method, and more.
              </Typography>
            </CardContent>
            <CardActions sx={{ p: 3, pt: 0, justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                startIcon={<AddCircleOutlinedIcon />}
                onClick={() => navigate('/enter-game')}
                sx={{ borderRadius: 2, px: 4, py: 1.5, fontWeight: 'bold' }}
              >
                Enter New Game
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Card 2: Historical Stats */}
        <Grid item xs={12} sm={6} md={5} sx={{ display: 'flex' }}>
          <Card 
            className="hover-card"
            sx={{ 
              width: '100%',
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              bgcolor: 'background.paper',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: 3
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <HistoryIcon sx={{ fontSize: 50, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                View Historical Stats
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Access a list of all your past matches, inspect detailed statistics, and analyze your individual performances.
              </Typography>
            </CardContent>
            <CardActions sx={{ p: 3, pt: 0, justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                color="secondary" 
                size="large"
                startIcon={<HistoryIcon />}
                onClick={() => navigate('/historical-stats')}
                sx={{ borderRadius: 2, px: 4, py: 1.5, fontWeight: 'bold', color: 'background.default' }}
              >
                View Historical Stats
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default LandingPage;
