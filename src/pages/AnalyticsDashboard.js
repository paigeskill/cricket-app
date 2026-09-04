import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  TableCell,
  TableRow,
  Stack,
  Paper,
  TextField,
  Checkbox,
  ListItemText
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TableRowsIcon from '@mui/icons-material/TableRows';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import AnalyticsFilters from '../components/AnalyticsFilters';
import GroupBySelect from '../components/GroupBySelect';
import CricketTable from '../components/CricketTable';
import { initialMockGames } from '../data/mockData';
import {
  filterGames,
  extractFilterOptions,
  groupStatistics,
  compileDismissalBreakdown
} from '../utils/analyticsHelper';
import {
  RunsTrendLineChart,
  AverageRunsBarChart,
  DismissalDonutChart,
  ComparativeBarChart
} from '../components/CustomCharts';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-panel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
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

function AnalyticsDashboard() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  
  // Filters State
  const [yearsList, setYearsList] = useState([]);
  const [clubsList, setClubsList] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedClubs, setSelectedClubs] = useState([]);
  const [venue, setVenue] = useState('All');
  
  // Dashboard Settings
  const [groupBy, setGroupBy] = useState('Year');
  const [activeTab, setActiveTab] = useState(0);
  const [runsViewMode, setRunsViewMode] = useState('Table'); // 'Table' | 'Graph'
  const [dismissalViewMode, setDismissalViewMode] = useState('Table'); // 'Table' | 'Graph'

  // Dismissal Grouping State
  const [dismissalGroupBy, setDismissalGroupBy] = useState('Year');
  const [selectedDismissalGroup, setSelectedDismissalGroup] = useState('');
  const [dismissalGroupOptions, setDismissalGroupOptions] = useState([]);

  // Comparative State
  const [compType, setCompType] = useState('Home vs Away');
  const [compPosA, setCompPosA] = useState([]);
  const [compPosB, setCompPosB] = useState([]);
  const [compMonthA, setCompMonthA] = useState('06'); // June
  const [compMonthB, setCompMonthB] = useState('08'); // August
  const [periodAStart, setPeriodAStart] = useState('');
  const [periodAEnd, setPeriodAEnd] = useState('');
  const [periodBStart, setPeriodBStart] = useState('');
  const [periodBEnd, setPeriodBEnd] = useState('');

  // Dynamically initialize periods and positions based on loaded games
  useEffect(() => {
    if (games.length > 0) {
      const years = games.map(g => g.date ? g.date.substring(0, 4) : '2026');
      const maxYear = years.length > 0 ? Math.max(...years.map(Number)) : 2026;
      setPeriodAStart(`${maxYear}-06-01`);
      setPeriodAEnd(`${maxYear}-07-31`);
      setPeriodBStart(`${maxYear}-08-01`);
      setPeriodBEnd(`${maxYear}-09-30`);

      const uniquePos = [...new Set(games.map(g => g.batting_number).filter(n => n !== null))].sort((a,b) => a-b);
      if (uniquePos.length > 0) {
        setCompPosA(uniquePos.slice(0, 3).map(String));
        setCompPosB(uniquePos.slice(3, 5).map(String));
      } else {
        setCompPosA(['1', '2', '3']);
        setCompPosB(['4', '5']);
      }

      const uniqueMonths = [...new Set(games.map(g => g.date ? g.date.substring(5, 7) : null).filter(Boolean))].sort();
      if (uniqueMonths.length > 0) {
        setCompMonthA(uniqueMonths[0]);
        setCompMonthB(uniqueMonths[1] || uniqueMonths[0]);
      }
    }
  }, [games]);

  // Load matches
  useEffect(() => {
    const stored = localStorage.getItem('cricket_games');
    const matchData = stored ? JSON.parse(stored) : initialMockGames;
    setGames(matchData);
    
    // Extract filter option arrays
    const { years, clubs } = extractFilterOptions(matchData);
    setYearsList(years);
    setClubsList(clubs);
  }, []);

  const handleClearFilters = () => {
    setSelectedYears([]);
    setSelectedClubs([]);
    setVenue('All');
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Compile calculations in real-time
  const filteredGames = filterGames(games, { selectedYears, selectedClubs, venue });
  const groupedStats = groupStatistics(filteredGames, groupBy);

  const computeStatsForGames = (subsetGames, labelKey) => {
    const inningsBatted = subsetGames.filter(g => !g.did_not_bat).length;
    const totalRuns = subsetGames.reduce((sum, g) => sum + (g.runs_scored || 0), 0);
    
    const dismissalsCount = subsetGames.filter(g => !g.did_not_bat && g.is_out).length;
    const battingAverage = inningsBatted > 0 
      ? Number((totalRuns / inningsBatted).toFixed(2))
      : 0;
    
    const runsPerDismissal = dismissalsCount > 0 
      ? Number((totalRuns / dismissalsCount).toFixed(2))
      : 'N/A';

    return {
      key: labelKey,
      inningsBatted,
      totalRuns,
      battingAverage,
      runsPerDismissal
    };
  };

  let statItemA = null;
  let statItemB = null;

  if (compType === 'Home vs Away') {
    const gamesA = filteredGames.filter(g => g.location === 'Home');
    const gamesB = filteredGames.filter(g => g.location === 'Away');
    statItemA = computeStatsForGames(gamesA, 'Home');
    statItemB = computeStatsForGames(gamesB, 'Away');
  } else if (compType === 'Batting Positions') {
    const gamesA = filteredGames.filter(g => g.batting_number !== null && compPosA.includes(String(g.batting_number)));
    const gamesB = filteredGames.filter(g => g.batting_number !== null && compPosB.includes(String(g.batting_number)));
    
    const keyA = compPosA.length > 0 ? `Positions ${compPosA.sort((a,b) => Number(a) - Number(b)).join(', ')}` : 'No Positions A Selected';
    const keyB = compPosB.length > 0 ? `Positions ${compPosB.sort((a,b) => Number(a) - Number(b)).join(', ')}` : 'No Positions B Selected';
    
    statItemA = computeStatsForGames(gamesA, keyA);
    statItemB = computeStatsForGames(gamesB, keyB);
  } else if (compType === 'Months') {
    const gamesA = filteredGames.filter(g => g.date && g.date.substring(5, 7) === compMonthA);
    const gamesB = filteredGames.filter(g => g.date && g.date.substring(5, 7) === compMonthB);
    
    const MONTHS_LABEL_MAP = {
      '01': 'January', '02': 'February', '03': 'March', '04': 'April',
      '05': 'May', '06': 'June', '07': 'July', '08': 'August',
      '09': 'September', '10': 'October', '11': 'November', '12': 'December'
    };
    statItemA = computeStatsForGames(gamesA, MONTHS_LABEL_MAP[compMonthA] || `Month ${compMonthA}`);
    statItemB = computeStatsForGames(gamesB, MONTHS_LABEL_MAP[compMonthB] || `Month ${compMonthB}`);
  } else if (compType === 'Periods') {
    const gamesA = filteredGames.filter(g => g.date && g.date >= periodAStart && g.date <= periodAEnd);
    const gamesB = filteredGames.filter(g => g.date && g.date >= periodBStart && g.date <= periodBEnd);
    statItemA = computeStatsForGames(gamesA, 'Period A');
    statItemB = computeStatsForGames(gamesB, 'Period B');
  }

  // Sync Dismissal Grouping dropdown options
  useEffect(() => {
    let options = [];
    if (dismissalGroupBy === 'Year') {
      options = Array.from(new Set(filteredGames.map(g => g.date ? g.date.substring(0, 4) : '').filter(Boolean))).sort().reverse();
    } else if (dismissalGroupBy === 'Month') {
      const monthIndices = Array.from(new Set(filteredGames.map(g => g.date ? parseInt(g.date.substring(5, 7), 10) : 0).filter(Boolean))).sort();
      options = monthIndices.map(idx => MONTH_NAMES[idx - 1]);
    } else if (dismissalGroupBy === 'Club') {
      options = Array.from(new Set(filteredGames.map(g => g.club).filter(Boolean))).sort();
    } else if (dismissalGroupBy === 'Venue') {
      options = Array.from(new Set(filteredGames.map(g => g.location).filter(Boolean))).sort();
    }
    setDismissalGroupOptions(options);
    setSelectedDismissalGroup(options[0] || '');
  }, [dismissalGroupBy, games, selectedYears, selectedClubs, venue]);

  // Compile dismissal subset for the active selection (Used primarily in Graph View)
  const dismissalGames = filteredGames.filter(g => {
    if (!selectedDismissalGroup) return true;
    if (dismissalGroupBy === 'Year') {
      return (g.date ? g.date.substring(0, 4) : '') === selectedDismissalGroup;
    } else if (dismissalGroupBy === 'Month') {
      const monthNum = g.date ? parseInt(g.date.substring(5, 7), 10) : 0;
      const monthName = MONTH_NAMES[monthNum - 1] || 'Unknown';
      return monthName === selectedDismissalGroup;
    } else if (dismissalGroupBy === 'Club') {
      return g.club === selectedDismissalGroup;
    } else if (dismissalGroupBy === 'Venue') {
      return g.location === selectedDismissalGroup;
    }
    return true;
  });

  const dismissalBreakdownForChart = compileDismissalBreakdown(dismissalGames);

  // Compile dismissal grouped statistics for cross-tabulation table matrix
  const dismissalGroupedStats = groupStatistics(filteredGames, dismissalGroupBy);

  // Find all active dismissal methods in the filtered set of matches (used as column headings)
  const rawMethods = Array.from(new Set(
    filteredGames
      .filter(g => !g.did_not_bat)
      .map(g => {
        if (!g.is_out) return 'Not Out';
        return g.dismissal;
      })
      .filter(d => d && d !== 'None' && d !== 'DNB')
  ));
  const hasNotOut = rawMethods.includes('Not Out');
  const actualDismissalsSorted = rawMethods.filter(d => d !== 'Not Out').sort();
  const activeDismissalMethods = hasNotOut
    ? [...actualDismissalsSorted, 'Not Out']
    : actualDismissalsSorted;

  // Global totals for the active subset of matches
  const totalInnings = filteredGames.filter(g => !g.did_not_bat && g.runs_scored !== null).length;
  const totalRuns = filteredGames.reduce((sum, g) => sum + (g.runs_scored || 0), 0);
  const totalTimesOut = filteredGames.filter(g => !g.did_not_bat && g.is_out).length;
  const overallAvg = totalInnings > 0 ? (totalRuns / totalInnings).toFixed(2) : '—';
  const overallSRD = totalTimesOut > 0 ? (totalRuns / totalTimesOut).toFixed(2) : 'N/A';

  return (
    <Box>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{ mb: 3, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
      >
        Back to Home
      </Button>

      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Performance Analytics
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Filter and group your cricket performance metrics over years, months, and clubs to visualize your trends.
      </Typography>

      {/* Real-time Filters */}
      <AnalyticsFilters
        years={yearsList}
        clubs={clubsList}
        selectedYears={selectedYears}
        selectedClubs={selectedClubs}
        venue={venue}
        onChangeYears={setSelectedYears}
        onChangeClubs={setSelectedClubs}
        onChangeVenue={setVenue}
        onClearFilters={handleClearFilters}
      />

      {/* Quick Summary Card Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Subset Innings Batted
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {totalInnings}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Subset Total Runs
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                {totalRuns}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Subset Runs / Dismissal
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                {overallSRD}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Subset Runs / Inning
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                {overallAvg}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Tabs Container */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange} textColor="primary" indicatorColor="primary">
          <Tab label="Runs & Averages" />
          <Tab label="Dismissal Breakdown" />
          <Tab label="Side-by-Side Comparison" />
        </Tabs>
      </Box>

      {/* Tab 1: Runs & Averages */}
      <TabPanel value={activeTab} index={0}>
        <Stack sx={{ flexDirection: 'row', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 3 }}>
          {/* Grouping Select dropdown */}
          <GroupBySelect value={groupBy} onChange={setGroupBy} labelId="groupby" />

          <Box sx={{ flexGrow: 1 }} />

          {/* Table vs Graph Toggle Buttons */}
          <ToggleButtonGroup
            color="primary"
            value={runsViewMode}
            exclusive
            onChange={(e, val) => val && setRunsViewMode(val)}
            aria-label="view toggle"
            size="small"
          >
            <ToggleButton value="Table" aria-label="table view">
              <TableRowsIcon sx={{ mr: 1 }} /> Table
            </ToggleButton>
            <ToggleButton value="Graph" aria-label="graph view">
              <QueryStatsIcon sx={{ mr: 1 }} /> Graph
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        {runsViewMode === 'Table' ? (
          <CricketTable
            headerColor="primary.dark"
            headers={[
              { text: groupBy },
              { text: 'Innings', align: 'right' },
              { text: 'Total Runs', align: 'right' },
              { text: 'Runs / Dismissal', align: 'right' },
              { text: 'Runs / Inning', align: 'right' }
            ]}
            isEmpty={groupedStats.length === 0}
            emptyMessage="No matches match the selected filters."
          >
            {groupedStats.map((item) => (
              <TableRow key={item.key} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' } }}>
                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>{item.key}</TableCell>
                <TableCell align="right">{item.inningsBatted}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>{item.totalRuns}</TableCell>
                <TableCell align="right">{item.runsPerDismissal}</TableCell>
                <TableCell align="right">{item.battingAverage}</TableCell>
              </TableRow>
            ))}
          </CricketTable>
        ) : (
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.05)', bgcolor: 'background.paper' }}>
            <Grid container spacing={4}>
              <Grid xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.light', mb: 2, textAlign: 'center' }}>
                  Total Runs Scored Trend ({groupBy})
                </Typography>
                <RunsTrendLineChart data={groupedStats} />
              </Grid>
              <Grid xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'secondary.main', mb: 2, textAlign: 'center' }}>
                  Averages vs Runs / Dismissal ({groupBy})
                </Typography>
                <AverageRunsBarChart data={groupedStats} />
              </Grid>
            </Grid>
          </Paper>
        )}
      </TabPanel>

      {/* Tab 2: Dismissal Breakdown */}
      <TabPanel value={activeTab} index={1}>
        <Stack sx={{ flexDirection: 'row', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 3 }}>
          {/* Dismissal Group By Dimension */}
          <GroupBySelect value={dismissalGroupBy} onChange={setDismissalGroupBy} labelId="dismissal-groupby" />

          {/* Dismissal Specific Group Selection (Shown ONLY in Graph View where a single-group donut chart projection is needed) */}
          {dismissalViewMode === 'Graph' && dismissalGroupOptions.length > 0 && (
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel id="dismissal-selection-label">Select {dismissalGroupBy}</InputLabel>
              <Select
                labelId="dismissal-selection-label"
                value={selectedDismissalGroup}
                label={`Select ${dismissalGroupBy}`}
                onChange={(e) => setSelectedDismissalGroup(e.target.value)}
              >
                {dismissalGroupOptions.map(option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Box sx={{ flexGrow: 1 }} />
          
          <ToggleButtonGroup
            color="primary"
            value={dismissalViewMode}
            exclusive
            onChange={(e, val) => val && setDismissalViewMode(val)}
            aria-label="dismissal view toggle"
            size="small"
          >
            <ToggleButton value="Table" aria-label="table view">
              <TableRowsIcon sx={{ mr: 1 }} /> Table
            </ToggleButton>
            <ToggleButton value="Graph" aria-label="graph view">
              <QueryStatsIcon sx={{ mr: 1 }} /> Graph
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        {dismissalViewMode === 'Table' ? (
          <CricketTable
            headerColor="secondary.dark"
            headers={[
              { text: dismissalGroupBy },
              ...activeDismissalMethods.map(method => ({ text: method, align: 'right' })),
              { text: 'Total Wickets', align: 'right' }
            ]}
            isEmpty={dismissalGroupedStats.length === 0}
            emptyMessage="No matches match the selected filters."
          >
            {dismissalGroupedStats.map((item) => (
              <TableRow key={item.key} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' } }}>
                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>{item.key}</TableCell>
                {activeDismissalMethods.map(method => (
                  <TableCell key={method} align="right">
                    {item.dismissals[method] || 0}
                  </TableCell>
                ))}
                <TableCell align="right" sx={{ fontWeight: 'bold', color: 'primary.light' }}>{item.timesOut}</TableCell>
              </TableRow>
            ))}
          </CricketTable>
        ) : (
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.05)', bgcolor: 'background.paper', maxWidth: 650, mx: 'auto' }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'secondary.main', textAlign: 'center', mb: 3 }}>
              Dismissal Methods Distribution ({selectedDismissalGroup})
            </Typography>
            <DismissalDonutChart data={dismissalBreakdownForChart} />
          </Paper>
        )}
      </TabPanel>

      {/* Tab 3: Comparative Analysis */}
      <TabPanel value={activeTab} index={2}>
        {filteredGames.length < 2 ? (
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.05)', bgcolor: 'background.paper' }}>
            <Typography variant="h6" color="text.secondary">
              At least two matches are required to run comparative analysis. Add more matches or clear filters!
            </Typography>
          </Paper>
        ) : (
          <Box>
            {/* Pick Comparative Selectors */}
            <Stack direction="row" spacing={3} sx={{ mb: 4, flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel id="comparison-type-label">Comparison Type</InputLabel>
                <Select
                  labelId="comparison-type-label"
                  value={compType}
                  label="Comparison Type"
                  onChange={(e) => setCompType(e.target.value)}
                >
                  <MenuItem value="Home vs Away">Home vs Away</MenuItem>
                  <MenuItem value="Batting Positions">Batting Positions</MenuItem>
                  <MenuItem value="Months">Months</MenuItem>
                  <MenuItem value="Periods">Periods (Date Ranges)</MenuItem>
                </Select>
              </FormControl>

              {compType === 'Batting Positions' && (
                <>
                  <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel id="pos-a-label">Positions Group A</InputLabel>
                    <Select
                      labelId="pos-a-label"
                      multiple
                      value={compPosA}
                      label="Positions Group A"
                      onChange={(e) => setCompPosA(e.target.value)}
                      renderValue={(selected) => selected.sort((a,b) => Number(a) - Number(b)).join(', ')}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(pos => (
                        <MenuItem key={pos} value={String(pos)}>
                          <Checkbox checked={compPosA.includes(String(pos))} color="primary" size="small" />
                          <ListItemText primary={String(pos)} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>vs</Typography>
                  <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel id="pos-b-label">Positions Group B</InputLabel>
                    <Select
                      labelId="pos-b-label"
                      multiple
                      value={compPosB}
                      label="Positions Group B"
                      onChange={(e) => setCompPosB(e.target.value)}
                      renderValue={(selected) => selected.sort((a,b) => Number(a) - Number(b)).join(', ')}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(pos => (
                        <MenuItem key={pos} value={String(pos)}>
                          <Checkbox checked={compPosB.includes(String(pos))} color="secondary" size="small" />
                          <ListItemText primary={String(pos)} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              )}

              {compType === 'Months' && (
                <>
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel id="month-a-label">Month A</InputLabel>
                    <Select
                      labelId="month-a-label"
                      value={compMonthA}
                      label="Month A"
                      onChange={(e) => setCompMonthA(e.target.value)}
                    >
                      {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map(m => {
                        const MONTHS_LABEL_MAP = {
                          '01': 'January', '02': 'February', '03': 'March', '04': 'April',
                          '05': 'May', '06': 'June', '07': 'July', '08': 'August',
                          '09': 'September', '10': 'October', '11': 'November', '12': 'December'
                        };
                        return (
                          <MenuItem key={m} value={m} disabled={m === compMonthB}>
                            {MONTHS_LABEL_MAP[m]}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>vs</Typography>
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel id="month-b-label">Month B</InputLabel>
                    <Select
                      labelId="month-b-label"
                      value={compMonthB}
                      label="Month B"
                      onChange={(e) => setCompMonthB(e.target.value)}
                    >
                      {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map(m => {
                        const MONTHS_LABEL_MAP = {
                          '01': 'January', '02': 'February', '03': 'March', '04': 'April',
                          '05': 'May', '06': 'June', '07': 'July', '08': 'August',
                          '09': 'September', '10': 'October', '11': 'November', '12': 'December'
                        };
                        return (
                          <MenuItem key={m} value={m} disabled={m === compMonthA}>
                            {MONTHS_LABEL_MAP[m]}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </>
              )}

              {compType === 'Periods' && (
                <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                  <TextField
                    label="Period A Start"
                    type="date"
                    size="small"
                    value={periodAStart}
                    onChange={(e) => setPeriodAStart(e.target.value)}
                    slotProps={{ shrink: true }}
                    sx={{ width: 150 }}
                  />
                  <TextField
                    label="Period A End"
                    type="date"
                    size="small"
                    value={periodAEnd}
                    onChange={(e) => setPeriodAEnd(e.target.value)}
                    slotProps={{ shrink: true }}
                    sx={{ width: 150 }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>vs</Typography>
                  <TextField
                    label="Period B Start"
                    type="date"
                    size="small"
                    value={periodBStart}
                    onChange={(e) => setPeriodBStart(e.target.value)}
                    slotProps={{ shrink: true }}
                    sx={{ width: 150 }}
                  />
                  <TextField
                    label="Period B End"
                    type="date"
                    size="small"
                    value={periodBEnd}
                    onChange={(e) => setPeriodBEnd(e.target.value)}
                    slotProps={{ shrink: true }}
                    sx={{ width: 150 }}
                  />
                </Stack>
              )}
            </Stack>

            {/* Parallel KPI Cards Deck */}
            {statItemA && statItemB && (
              <Grid container spacing={4} sx={{ mb: 4 }}>
                {/* Column A */}
                <Grid xs={12} md={6}>
                  <Paper elevation={3} sx={{ p: 3, borderRadius: 3, border: '1px solid #bb86fc', bgcolor: 'rgba(187, 134, 252, 0.02)' }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5, color: 'primary.main' }}>
                      {statItemA.key} Summary
                    </Typography>
                    {compType === 'Periods' && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                        {periodAStart} to {periodAEnd}
                      </Typography>
                    )}
                    <Grid container spacing={2}>
                      <Grid xs={6}>
                        <Typography variant="caption" color="text.secondary">Total Runs</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{statItemA.totalRuns}</Typography>
                      </Grid>
                      <Grid xs={6}>
                        <Typography variant="caption" color="text.secondary">Innings</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{statItemA.inningsBatted}</Typography>
                      </Grid>
                      <Grid xs={6}>
                        <Typography variant="caption" color="text.secondary">Runs / Dismissal</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{statItemA.runsPerDismissal}</Typography>
                      </Grid>
                      <Grid xs={6}>
                        <Typography variant="caption" color="text.secondary">Runs / Inning</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{statItemA.battingAverage}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                {/* Column B */}
                <Grid xs={12} md={6}>
                  <Paper elevation={3} sx={{ p: 3, borderRadius: 3, border: '1px solid #03dac6', bgcolor: 'rgba(3, 218, 198, 0.02)' }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5, color: 'secondary.main' }}>
                      {statItemB.key} Summary
                    </Typography>
                    {compType === 'Periods' && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                        {periodBStart} to {periodBEnd}
                      </Typography>
                    )}
                    <Grid container spacing={2}>
                      <Grid xs={6}>
                        <Typography variant="caption" color="text.secondary">Total Runs</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{statItemB.totalRuns}</Typography>
                      </Grid>
                      <Grid xs={6}>
                        <Typography variant="caption" color="text.secondary">Innings</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{statItemB.inningsBatted}</Typography>
                      </Grid>
                      <Grid xs={6}>
                        <Typography variant="caption" color="text.secondary">Runs / Dismissal</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{statItemB.runsPerDismissal}</Typography>
                      </Grid>
                      <Grid xs={6}>
                        <Typography variant="caption" color="text.secondary">Runs / Inning</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{statItemB.battingAverage}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            )}

            {/* Side-by-Side Dual-Bar Chart */}
            {statItemA && statItemB && (
              <Paper elevation={3} sx={{ p: 4, borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.05)', bgcolor: 'background.paper', maxWidth: 650, mx: 'auto' }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'secondary.main', textAlign: 'center', mb: 3 }}>
                  Direct Comparison: {statItemA.key} vs {statItemB.key}
                </Typography>
                <ComparativeBarChart itemA={statItemA} itemB={statItemB} />
              </Paper>
            )}
          </Box>
        )}
      </TabPanel>
    </Box>
  );
}

export default AnalyticsDashboard;
