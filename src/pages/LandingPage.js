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
import BarChartIcon from '@mui/icons-material/BarChart';

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
        <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
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
            <CardContent sx={{ p: 4, flexGrow: 1 }}>
              <AddCircleOutlinedIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                Enter New Game
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Finished playing a game? Log your statistics right now, including runs scored, batting position, dismissal method, overs, wickets, and fielding plays.
              </Typography>
            </CardContent>
            <CardActions sx={{ p: 3, pt: 0, justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                startIcon={<AddCircleOutlinedIcon />}
                onClick={() => navigate('/enter-game')}
                sx={{ borderRadius: 2, px: 4, py: 1.5, fontWeight: 'bold', width: '100%' }}
              >
                Enter New Game
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Card 2: Historical Stats */}
        <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
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
            <CardContent sx={{ p: 4, flexGrow: 1 }}>
              <HistoryIcon sx={{ fontSize: 50, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                Historical Stats
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Access a list of all your past matches, inspect detailed batting, bowling, and fielding scorecards, and make quick edits on any game records.
              </Typography>
            </CardContent>
            <CardActions sx={{ p: 3, pt: 0, justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                color="secondary" 
                size="large"
                startIcon={<HistoryIcon />}
                onClick={() => navigate('/historical-stats')}
                sx={{ borderRadius: 2, px: 4, py: 1.5, fontWeight: 'bold', color: 'background.default', width: '100%' }}
              >
                View Historical Stats
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Card 3: Advanced Analytics */}
        <Grid item xs={12} sm={12} md={4} sx={{ display: 'flex' }}>
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
            <CardContent sx={{ p: 4, flexGrow: 1 }}>
              <BarChartIcon sx={{ fontSize: 50, color: 'info.main', mb: 2 }} />
              <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                View Analytics
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Analyze your cricket scores with interactive SVG line and bar charts, drill down into your dismissal matrix, and run side-by-side year or club comparisons.
              </Typography>
            </CardContent>
            <CardActions sx={{ p: 3, pt: 0, justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                color="info" 
                size="large"
                startIcon={<BarChartIcon />}
                onClick={() => navigate('/analytics')}
                sx={{ borderRadius: 2, px: 4, py: 1.5, fontWeight: 'bold', color: '#ffffff', width: '100%' }}
              >
                View Analytics
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default LandingPage;
