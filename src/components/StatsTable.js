import React, { useState } from 'react';
import {
  Chip,
  Typography,
  Box,
  Tabs,
  Tab,
  TableCell,
  TableRow,
  IconButton,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import EditIcon from '@mui/icons-material/Edit';
import CricketTable from './CricketTable';
import GameRowCells from './GameRowCells';
import StatsCard from './StatsCard';

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
  const [statsRange, setStatsRange] = useState('Current Year');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Filter games specifically for aggregate summary cards calculations
  const summaryGames = statsRange === 'Current Year'
    ? games.filter(g => g.date && g.date.substring(0, 4) === '2026')
    : games;

  // --- BATTING CALCULATIONS (using filtered summaryGames) ---
  const totalMatches = summaryGames.length;
  const totalRuns = summaryGames.reduce((sum, g) => sum + (g.runs_scored || 0), 0);
  const highestScore = summaryGames.length > 0 ? Math.max(...summaryGames.map(g => g.runs_scored || 0)) : 0;
  const timesOut = summaryGames.filter(g => g.is_out).length;
  const battingAverage = timesOut > 0 ? (totalRuns / timesOut).toFixed(2) : 'N/A';
  const totalInningsBatted = summaryGames.filter(g => !g.did_not_bat && g.runs_scored !== null).length;

  // --- BOWLING CALCULATIONS (using filtered summaryGames) ---
  const bowlingGames = summaryGames.filter(g => (g.overs_bowled || 0) > 0);
  const totalWickets = summaryGames.reduce((sum, g) => sum + (g.wickets_taken || 0), 0);
  const totalRunsConceded = summaryGames.reduce((sum, g) => sum + (g.runs_conceded || 0), 0);
  const totalMaidens = summaryGames.reduce((sum, g) => sum + (g.maidens_bowled || 0), 0);
  
  // Calculate total balls bowled
  const totalBallsBowled = summaryGames.reduce((sum, g) => {
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
    
    summaryGames.forEach(g => {
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

  // --- FIELDING CALCULATIONS (using filtered summaryGames) ---
  const totalCatchesOutfield = summaryGames.reduce((sum, g) => sum + (!g.is_keeper ? (g.catches || 0) : 0), 0);
  const totalRunOuts = summaryGames.reduce((sum, g) => sum + (!g.is_keeper ? (g.run_outs || 0) : 0), 0);
  const totalCatchesKeeper = summaryGames.reduce((sum, g) => sum + (g.is_keeper ? (g.catches_keeper || 0) : 0), 0);
  const totalStumpings = summaryGames.reduce((sum, g) => sum + (g.stumpings || 0), 0);
  const totalRunOutsKeeper = summaryGames.reduce((sum, g) => sum + (g.is_keeper ? (g.run_outs_keeper || 0) : 0), 0);
  const totalByesConceded = summaryGames.reduce((sum, g) => sum + (g.byes_conceded || 0), 0);
  const totalVictims = totalCatchesKeeper + totalStumpings;

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
    { text: 'Role' },
    { text: 'Outfield Catches', align: 'right' },
    { text: 'Outfield RO', align: 'right' },
    { text: 'Keeper Catches', align: 'right' },
    { text: 'Keeper RO', align: 'right' },
    { text: 'Stumpings', align: 'right' },
    { text: 'Byes', align: 'right' },
    { text: 'Victims', align: 'right' },
    { text: 'Edit', align: 'center' }
  ];

  return (
    <Box sx={{ width: '100%' }}>
      {/* Range filter toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <ToggleButtonGroup
          color="primary"
          value={statsRange}
          exclusive
          onChange={(e, val) => val && setStatsRange(val)}
          size="small"
          aria-label="stats time range"
        >
          <ToggleButton value="Current Year" aria-label="current year stats" sx={{ textTransform: 'none', fontWeight: 'bold' }}>
            Current Year (2026)
          </ToggleButton>
          <ToggleButton value="All Time" aria-label="all time stats" sx={{ textTransform: 'none', fontWeight: 'bold' }}>
            All Time
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Dynamic aggregate summaries based on active tab */}
      {activeTab === 0 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(3, 1fr)',
              md: 'repeat(6, 1fr)'
            },
            gap: 2,
            mb: 4
          }}
        >
          <StatsCard title="Matches Played" value={totalMatches} color="primary.main" />
          <StatsCard title="Innings Batted" value={totalInningsBatted} color="success.main" />
          <StatsCard title="Total Runs" value={totalRuns} color="secondary.main" />
          <StatsCard title="Highest Score" value={highestScore} color="info.main" />
          <StatsCard title="Times Dismissed" value={timesOut} color="error.light" />
          <StatsCard title="Batting Average" value={battingAverage} color="warning.main" />
        </Box>
      )}

      {activeTab === 1 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)'
            },
            gap: 2,
            mb: 4
          }}
        >
          {/* Row 1: Key Quantity Metrics */}
          <StatsCard
            title="Overs Bowled"
            value={totalOversEquivalent > 0 ? `${Math.floor(totalOversEquivalent)}.${totalBallsBowled % 6}` : '0.0'}
            color="primary.main"
          />
          <StatsCard title="Runs Given Away" value={totalRunsConceded} color="secondary.main" />
          <StatsCard title="Total Maidens" value={totalMaidens} color="success.main" />
          <StatsCard title="Total Wickets" value={totalWickets} color="info.main" />

          {/* Row 2: Secondary Performance Aggregates */}
          <StatsCard title="Best Bowling" value={bestBowling} color="primary.light" />
          <StatsCard title="Bowling Economy" value={overallEconomy} color="warning.main" />
          <StatsCard title="Bowling Average" value={overallBowlingAverage} color="error.light" />
          <StatsCard title="Bowling SR" value={overallBowlingSR} color="error.main" />
        </Box>
      )}

      {activeTab === 2 && (
        <Box sx={{ mb: 4 }}>
          {/* Outfield section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="primary.light" sx={{ fontWeight: 'bold', mb: 1.5 }}>
              Outfield Performance
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(4, 1fr)'
                },
                gap: 2
              }}
            >
              <StatsCard title="Outfield Catches" value={totalCatchesOutfield} color="primary.main" />
              <StatsCard title="Outfield RO" value={totalRunOuts} color="secondary.main" />
            </Box>
          </Box>

          {/* Keeper section */}
          <Box>
            <Typography variant="subtitle2" color="success.light" sx={{ fontWeight: 'bold', mb: 1.5, mt: 2 }}>
              Wicketkeeping Performance
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(5, 1fr)'
                },
                gap: 2
              }}
            >
              <StatsCard title="Keeper Catches" value={totalCatchesKeeper} color="info.main" />
              <StatsCard title="Keeper RO" value={totalRunOutsKeeper} color="primary.light" />
              <StatsCard title="Stumpings" value={totalStumpings} color="warning.main" />
              <StatsCard title="Byes Conceded" value={totalByesConceded} color="error.light" />
              <StatsCard title="Victims" value={totalVictims} color="success.main" />
            </Box>
          </Box>
        </Box>
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
                  <IconButton onClick={() => onEditGame(game, 1)} size="small" color="primary" aria-label="edit batting performance">
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
                  <IconButton onClick={() => onEditGame(game, 2)} size="small" color="primary" aria-label="edit bowling performance">
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
          {games.map((game) => {
            const isKeeper = game.is_keeper || false;
            const keeperCatches = isKeeper ? (game.catches_keeper || 0) : 0;
            const stumpings = game.stumpings || 0;
            const runOutsKeeper = isKeeper ? (game.run_outs_keeper || 0) : 0;
            const victims = keeperCatches + stumpings;

            return (
              <TableRow
                key={game.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' } }}
              >
                <GameRowCells game={game} />
                <TableCell>
                  {isKeeper ? (
                    <Chip label="Keeper" size="small" color="primary" variant="filled" sx={{ fontWeight: 'bold' }} />
                  ) : (
                    <Chip label="Outfield" size="small" color="default" variant="outlined" />
                  )}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: (!isKeeper && (game.catches || 0) > 0) ? 'bold' : 'normal', color: !isKeeper && (game.catches || 0) > 0 ? 'primary.light' : 'text.primary' }}>
                  {isKeeper ? '—' : (game.catches || 0)}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: (!isKeeper && (game.run_outs || 0) > 0) ? 'bold' : 'normal', color: !isKeeper && (game.run_outs || 0) > 0 ? 'secondary.main' : 'text.primary' }}>
                  {isKeeper ? '—' : (game.run_outs || 0)}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: (isKeeper && keeperCatches > 0) ? 'bold' : 'normal', color: isKeeper && keeperCatches > 0 ? 'info.main' : 'text.primary' }}>
                  {isKeeper ? keeperCatches : '—'}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: (isKeeper && runOutsKeeper > 0) ? 'bold' : 'normal', color: isKeeper && runOutsKeeper > 0 ? 'primary.light' : 'text.primary' }}>
                  {isKeeper ? runOutsKeeper : '—'}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: (isKeeper && stumpings > 0) ? 'bold' : 'normal', color: isKeeper && stumpings > 0 ? 'warning.main' : 'text.primary' }}>
                  {isKeeper ? stumpings : '—'}
                </TableCell>
                <TableCell align="right" sx={{ color: isKeeper && (game.byes_conceded || 0) > 0 ? 'error.light' : 'text.primary' }}>
                  {isKeeper ? (game.byes_conceded || 0) : '—'}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: (isKeeper && victims > 0) ? 'bold' : 'normal', color: isKeeper && victims > 0 ? 'success.main' : 'text.primary' }}>
                  {isKeeper ? victims : '—'}
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => onEditGame(game, 3)} size="small" color="primary" aria-label="edit fielding performance">
                    <EditIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </CricketTable>
      </TabPanel>
    </Box>
  );
}

export default StatsTable;
