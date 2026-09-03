import React, { useState } from 'react';
import {
  Chip,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  TableCell,
  TableRow,
  IconButton
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import EditIcon from '@mui/icons-material/Edit';
import CricketTable from './CricketTable';
import GameRowCells from './GameRowCells';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`cricket-stats-tabpanel-${index}`}
      aria-labelledby={`cricket-stats-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function StatsTable({ games, onEditGame }) {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // --- BATTING CALCULATIONS ---
  const totalMatches = games.length;
  const totalRuns = games.reduce((sum, g) => sum + (g.runs_scored || 0), 0);
  const highestScore = games.length > 0 ? Math.max(...games.map(g => g.runs_scored || 0)) : 0;
  const timesOut = games.filter(g => g.is_out).length;
  const battingAverage = timesOut > 0 ? (totalRuns / timesOut).toFixed(2) : 'N/A';
  const totalInningsBatted = games.filter(g => !g.did_not_bat && g.runs_scored !== null).length;

  // --- BOWLING CALCULATIONS ---
  const bowlingGames = games.filter(g => (g.overs_bowled || 0) > 0);
  const totalWickets = games.reduce((sum, g) => sum + (g.wickets_taken || 0), 0);
  const totalRunsConceded = games.reduce((sum, g) => sum + (g.runs_conceded || 0), 0);
  const totalMaidens = games.reduce((sum, g) => sum + (g.maidens_bowled || 0), 0);
  
  // Calculate total balls bowled
  const totalBallsBowled = games.reduce((sum, g) => {
    const overs = g.overs_bowled || 0;
    const balls = (Math.floor(overs) * 6) + Math.round((overs % 1) * 10);
    return sum + balls;
  }, 0);

  const totalOversEquivalent = totalBallsBowled / 6;
  const overallEconomy = totalOversEquivalent > 0 ? (totalRunsConceded / totalOversEquivalent).toFixed(2) : '—';
  const overallBowlingAverage = totalWickets > 0 ? (totalRunsConceded / totalWickets).toFixed(2) : '—';
  const overallBowlingSR = totalWickets > 0 ? (totalBallsBowled / totalWickets).toFixed(2) : '—';

  // Calculate Best Bowling Performance
  let bestBowling = '—';
  if (bowlingGames.length > 0) {
    let maxWickets = -1;
    let minRuns = Infinity;
    
    games.forEach(g => {
      const wickets = g.wickets_taken || 0;
      const runs = g.runs_conceded || 0;
      const overs = g.overs_bowled || 0;
      if (overs > 0) {
        if (wickets > maxWickets) {
          maxWickets = wickets;
          minRuns = runs;
        } else if (wickets === maxWickets && runs < minRuns) {
          minRuns = runs;
        }
      }
    });

    if (maxWickets >= 0) {
      bestBowling = `${maxWickets}/${minRuns}`;
    }
  }

  // --- FIELDING CALCULATIONS ---
  const totalCatches = games.reduce((sum, g) => sum + (g.catches || 0), 0);
  const totalRunOuts = games.reduce((sum, g) => sum + (g.run_outs || 0), 0);
  const totalStumpings = games.reduce((sum, g) => sum + (g.stumpings || 0), 0);

  // Helper to calculate statistics for a bowling row
  const getBowlingRowStats = (game) => {
    const overs = game.overs_bowled || 0;
    const runs = game.runs_conceded || 0;
    const wickets = game.wickets_taken || 0;

    if (overs === 0) {
      return { economy: '—', average: '—', strikeRate: '—' };
    }

    const balls = (Math.floor(overs) * 6) + Math.round((overs % 1) * 10);
    const oversEquivalent = balls / 6;

    const economy = oversEquivalent > 0 ? (runs / oversEquivalent).toFixed(2) : '—';
    const average = wickets > 0 ? (runs / wickets).toFixed(2) : '—';
    const strikeRate = wickets > 0 ? (balls / wickets).toFixed(2) : '—';

    return { economy, average, strikeRate };
  };

  // Header Definition Arrays
  const battingHeaders = [
    { text: 'Date' }, { text: 'Club' }, { text: 'Opponent' }, { text: 'Venue' },
    { text: 'Runs', align: 'right' }, { text: 'Position', align: 'right' },
    { text: 'Status' }, { text: 'Dismissal' }, { text: 'Edit', align: 'center' }
  ];

  const bowlingHeaders = [
    { text: 'Date' }, { text: 'Club' }, { text: 'Opponent' }, { text: 'Venue' },
    { text: 'Overs', align: 'right' }, { text: 'Maidens', align: 'right' },
    { text: 'Runs', align: 'right' }, { text: 'Wickets', align: 'right' },
    { text: 'Economy', align: 'right' }, { text: 'Average', align: 'right' },
    { text: 'SR', align: 'right' }, { text: 'Edit', align: 'center' }
  ];

  const fieldingHeaders = [
    { text: 'Date' }, { text: 'Club' }, { text: 'Opponent' }, { text: 'Venue' },
    { text: 'Catches', align: 'right' }, { text: 'Run Outs', align: 'right' },
    { text: 'Stumpings', align: 'right' }, { text: 'Byes Conceded', align: 'right' }, { text: 'Edit', align: 'center' }
  ];

  return (
    <Box sx={{ width: '100%' }}>
      {/* Dynamic aggregate summaries based on active tab */}
      {activeTab === 0 && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* 1. Matches Played */}
          <Grid item xs={12} sm={6} md={2}>
            <Card sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <CardContent sx={{ textAlign: 'center', px: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Matches Played
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {totalMatches}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* 2. Innings Batted */}
          <Grid item xs={12} sm={6} md={2}>
            <Card sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <CardContent sx={{ textAlign: 'center', px: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Innings Batted
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                  {totalInningsBatted}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* 3. Total Runs */}
          <Grid item xs={12} sm={6} md={2}>
            <Card sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <CardContent sx={{ textAlign: 'center', px: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Total Runs
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                  {totalRuns}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* 4. Highest Score */}
          <Grid item xs={12} sm={6} md={2}>
            <Card sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <CardContent sx={{ textAlign: 'center', px: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Highest Score
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                  {highestScore}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* 5. Times Dismissed */}
          <Grid item xs={12} sm={6} md={2}>
            <Card sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <CardContent sx={{ textAlign: 'center', px: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Times Dismissed
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'error.light' }}>
                  {timesOut}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* 6. Batting Average */}
          <Grid item xs={12} sm={6} md={2}>
            <Card sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <CardContent sx={{ textAlign: 'center', px: 1 }}>
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
      )}

      {activeTab === 1 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(3, 1fr)',
              md: 'repeat(7, 1fr)'
            },
            gap: 2,
            mb: 4
          }}
        >
          {/* 1. Overs */}
          <Card sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <CardContent sx={{ textAlign: 'center', px: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Overs Bowled
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {totalOversEquivalent > 0 ? `${Math.floor(totalOversEquivalent)}.${totalBallsBowled % 6}` : '0.0'}
              </Typography>
            </CardContent>
          </Card>

          {/* 2. Maidens */}
          <Card sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <CardContent sx={{ textAlign: 'center', px: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Total Maidens
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                {totalMaidens}
              </Typography>
            </CardContent>
          </Card>

          {/* 3. Wickets */}
          <Card sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <CardContent sx={{ textAlign: 'center', px: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Total Wickets
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                {totalWickets}
              </Typography>
            </CardContent>
          </Card>

          {/* 4. Best Bowling */}
          <Card sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <CardContent sx={{ textAlign: 'center', px: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Best Bowling
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                {bestBowling}
              </Typography>
            </CardContent>
          </Card>

          {/* 5. Economy */}
          <Card sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <CardContent sx={{ textAlign: 'center', px: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Bowling Economy
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                {overallEconomy}
              </Typography>
            </CardContent>
          </Card>

          {/* 6. Average */}
          <Card sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <CardContent sx={{ textAlign: 'center', px: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Bowling Average
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'error.light' }}>
                {overallBowlingAverage}
              </Typography>
            </CardContent>
          </Card>

          {/* 7. Strike Rate */}
          <Card sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <CardContent sx={{ textAlign: 'center', px: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Bowling SR
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.light' }}>
                {overallBowlingSR}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Total Catches
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {totalCatches}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Run Outs
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                  {totalRunOuts}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Stumpings
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                  {totalStumpings}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Total Fielding Acts
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                  {totalCatches + totalRunOuts + totalStumpings}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tabs selector */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 1 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="cricket stats table tabs"
          textColor="primary"
          indicatorColor="primary"
          variant="fullWidth"
        >
          <Tab label="Batting Scorecard" id="cricket-stats-tab-0" />
          <Tab label="Bowling Scorecard" id="cricket-stats-tab-1" />
          <Tab label="Fielding Scorecard" id="cricket-stats-tab-2" />
        </Tabs>
      </Box>

      {/* Batting Scorecard Tab */}
      <TabPanel value={activeTab} index={0}>
        <CricketTable
          headerColor="primary.dark"
          headers={battingHeaders}
          isEmpty={games.length === 0}
        >
          {games.map((game) => {
            const isDnb = game.did_not_bat || game.runs_scored === null;
            return (
              <TableRow
                key={game.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' } }}
              >
                <GameRowCells game={game} />
                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                  {isDnb ? 'DNB' : `${game.runs_scored}${!game.is_out ? '*' : ''}`}
                </TableCell>
                <TableCell align="right">{isDnb ? '—' : game.batting_number}</TableCell>
                <TableCell>
                  {isDnb ? (
                    <Chip label="DNB" size="small" color="default" variant="outlined" />
                  ) : game.is_out ? (
                    <Chip
                      icon={<CancelOutlinedIcon />}
                      label="Out"
                      size="small"
                      variant="filled"
                      sx={{
                        bgcolor: '#d32f2f',
                        color: '#ffffff',
                        fontWeight: 'bold',
                        '& .MuiChip-icon': { color: '#ffffff' }
                      }}
                    />
                  ) : (
                    <Chip
                      icon={<CheckCircleOutlineIcon />}
                      label="Not Out"
                      size="small"
                      variant="filled"
                      sx={{
                        bgcolor: '#2e7d32',
                        color: '#ffffff',
                        fontWeight: 'bold',
                        '& .MuiChip-icon': { color: '#ffffff' }
                      }}
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontStyle: (isDnb || game.dismissal === 'None') ? 'italic' : 'normal', color: (isDnb || game.dismissal === 'None') ? 'text.secondary' : 'text.primary' }}>
                    {isDnb ? '—' : game.dismissal}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => onEditGame(game)} size="small" color="primary" aria-label="edit batting performance">
                    <EditIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </CricketTable>
      </TabPanel>

      {/* Bowling Scorecard Tab */}
      <TabPanel value={activeTab} index={1}>
        <CricketTable
          headerColor="secondary.dark"
          headers={bowlingHeaders}
          isEmpty={games.length === 0}
        >
          {games.map((game) => {
            const stats = getBowlingRowStats(game);
            return (
              <TableRow
                key={game.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' } }}
              >
                <GameRowCells game={game} />
                <TableCell align="right">{(game.overs_bowled || 0).toFixed(1)}</TableCell>
                <TableCell align="right">{game.maidens_bowled || 0}</TableCell>
                <TableCell align="right">{game.runs_conceded || 0}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', color: 'primary.light' }}>{game.wickets_taken || 0}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>{stats.economy}</TableCell>
                <TableCell align="right">{stats.average}</TableCell>
                <TableCell align="right">{stats.strikeRate}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => onEditGame(game)} size="small" color="primary" aria-label="edit bowling performance">
                    <EditIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </CricketTable>
      </TabPanel>

      {/* Fielding Scorecard Tab */}
      <TabPanel value={activeTab} index={2}>
        <CricketTable
          headerColor="warning.dark"
          headers={fieldingHeaders}
          isEmpty={games.length === 0}
        >
          {games.map((game) => (
            <TableRow
              key={game.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' } }}
            >
              <GameRowCells game={game} />
              <TableCell align="right" sx={{ fontWeight: (game.catches || 0) > 0 ? 'bold' : 'normal' }}>{game.catches || 0}</TableCell>
              <TableCell align="right" sx={{ fontWeight: (game.run_outs || 0) > 0 ? 'bold' : 'normal' }}>{game.run_outs || 0}</TableCell>
              <TableCell align="right" sx={{ fontWeight: (game.stumpings || 0) > 0 ? 'bold' : 'normal' }}>{game.stumpings || 0}</TableCell>
              <TableCell align="right">{game.byes_conceded || 0}</TableCell>
              <TableCell align="center">
                <IconButton onClick={() => onEditGame(game)} size="small" color="primary" aria-label="edit fielding performance">
                  <EditIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </CricketTable>
      </TabPanel>
    </Box>
  );
}

export default StatsTable;
