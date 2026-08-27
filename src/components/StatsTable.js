import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  Box,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

function StatsTable({ games }) {
  // Calculations for KPI Cards
  const totalMatches = games.length;
  const totalRuns = games.reduce((sum, g) => sum + (g.runs_scored || 0), 0);
  const highestScore = games.length > 0 ? Math.max(...games.map(g => g.runs_scored || 0)) : 0;
  
  // Batting Average = Total Runs / Times Out
  const timesOut = games.filter(g => g.is_out).length;
  const battingAverage = timesOut > 0 ? (totalRuns / timesOut).toFixed(2) : 'N/A';

  return (
    <Box sx={{ width: '100%' }}>
      {/* KPI Cards / Statistics Summary Dashboard */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Matches Played
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {totalMatches}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Total Runs
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                {totalRuns}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Highest Score
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                {highestScore}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Batting Average
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                {battingAverage}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Stats Table */}
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <Table sx={{ minWidth: 650 }} aria-label="cricket stats table">
          <TableHead sx={{ bgcolor: 'primary.dark' }}>
            <TableRow>
              <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Club</TableCell>
              <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Opponent</TableCell>
              <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Venue</TableCell>
              <TableCell align="right" sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Runs</TableCell>
              <TableCell align="right" sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Position</TableCell>
              <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>Dismissal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {games.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" color="text.secondary">
                    No game records found. Click "Enter New Game" to add one!
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              games.map((game) => (
                <TableRow
                  key={game.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' } }}
                >
                  <TableCell component="th" scope="row">
                    {game.date}
                  </TableCell>
                  <TableCell>{game.club}</TableCell>
                  <TableCell>{game.opponent}</TableCell>
                  <TableCell>
                    <Chip 
                      label={game.location} 
                      size="small" 
                      color={game.location === 'Home' ? 'primary' : 'default'}
                      variant={game.location === 'Home' ? 'filled' : 'outlined'}
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                    {game.runs_scored}
                    {!game.is_out && '*'}
                  </TableCell>
                  <TableCell align="right">{game.batting_number}</TableCell>
                  <TableCell>
                    {game.is_out ? (
                      <Chip
                        icon={<CancelOutlinedIcon />}
                        label="Out"
                        size="small"
                        color="error"
                        variant="outlined"
                      />
                    ) : (
                      <Chip
                        icon={<CheckCircleOutlinedIcon />}
                        label="Not Out"
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontStyle: game.dismissal === 'None' ? 'italic' : 'normal', color: game.dismissal === 'None' ? 'text.secondary' : 'text.primary' }}>
                      {game.dismissal}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default StatsTable;
