import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid
} from '@mui/material';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import HistoryIcon from '@mui/icons-material/History';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import BarChartIcon from '@mui/icons-material/BarChart';
import ActionCard from '../components/ActionCard';

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
      <Grid container spacing={4} sx={{ justifyContent: 'center', alignItems: 'stretch', px: { xs: 2, md: 4 } }}>
        {/* Card 1: Enter Game */}
        <Grid xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
          <ActionCard
            title="Enter New Game"
            description="Finished playing a game? Log your statistics right now, including runs scored, batting position, dismissal method, overs, wickets, and fielding plays."
            Icon={AddCircleOutlinedIcon}
            buttonText="Enter New Game"
            onClick={() => navigate('/enter-game')}
            color="primary"
          />
        </Grid>

        {/* Card 2: Historical Stats */}
        <Grid xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
          <ActionCard
            title="Historical Stats"
            description="Access a list of all your past matches, inspect detailed batting, bowling, and fielding scorecards, and make quick edits on any game records."
            Icon={HistoryIcon}
            buttonText="View Historical Stats"
            onClick={() => navigate('/historical-stats')}
            color="secondary"
            textColor="background.default"
          />
        </Grid>

        {/* Card 3: Advanced Analytics */}
        <Grid xs={12} sm={12} md={4} sx={{ display: 'flex' }}>
          <ActionCard
            title="View Analytics"
            description="Analyze your cricket scores with interactive SVG line and bar charts, drill down into your dismissal matrix, and run side-by-side year or club comparisons."
            Icon={BarChartIcon}
            buttonText="View Analytics"
            onClick={() => navigate('/analytics')}
            color="info"
            textColor="background.default"
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default LandingPage;
