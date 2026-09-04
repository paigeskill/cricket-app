const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Filter the games array based on selected years, clubs, and venue location.
 */
export const filterGames = (games, filters) => {
  return games.filter(g => {
    const year = g.date ? g.date.substring(0, 4) : '';
    
    const yearMatch = !filters.selectedYears || filters.selectedYears.length === 0 || filters.selectedYears.includes(year);
    const clubMatch = !filters.selectedClubs || filters.selectedClubs.length === 0 || filters.selectedClubs.includes(g.club);
    
    let venueMatch = true;
    if (filters.venue === 'Home Only') {
      venueMatch = g.location === 'Home';
    } else if (filters.venue === 'Away Only') {
      venueMatch = g.location === 'Away';
    }
    
    return yearMatch && clubMatch && venueMatch;
  });
};

/**
 * Extracts unique lists of years and clubs from the matches database.
 */
export const extractFilterOptions = (games) => {
  const years = Array.from(new Set(games.map(g => g.date ? g.date.substring(0, 4) : '').filter(Boolean))).sort().reverse();
  const clubs = Array.from(new Set(games.map(g => g.club).filter(Boolean))).sort();
  return { years, clubs };
};

/**
 * Compile and group statistics by Year, Month, or Club.
 */
export const groupStatistics = (games, groupBy) => {
  const groups = {};

  games.forEach(g => {
    let key = 'Unknown';
    if (groupBy === 'Year') {
      key = g.date ? g.date.substring(0, 4) : 'Unknown';
    } else if (groupBy === 'Month') {
      const monthNum = g.date ? parseInt(g.date.substring(5, 7), 10) : 0;
      key = MONTH_NAMES[monthNum - 1] || 'Unknown';
    } else if (groupBy === 'Club') {
      key = g.club || 'Unknown';
    } else if (groupBy === 'Venue') {
      key = g.location || 'Unknown';
    } else if (groupBy === 'Batting Position') {
      key = g.batting_number ? `Position ${g.batting_number}` : 'No Position';
    }

    if (!groups[key]) {
      groups[key] = {
        key,
        totalRuns: 0,
        inningsBatted: 0,
        timesOut: 0,
        dismissals: {}
      };
    }

    const item = groups[key];

    // Batting calculations
    const didNotBat = g.did_not_bat || g.runs_scored === null;
    if (!didNotBat) {
      item.totalRuns += g.runs_scored || 0;
      item.inningsBatted += 1;
      if (g.is_out) {
        item.timesOut += 1;
      }

      // Record dismissal type
      let dismissalType = g.dismissal || 'None';
      if (!g.is_out) {
        dismissalType = 'Not Out';
      }
      if (dismissalType !== 'None' && dismissalType !== 'DNB') {
        item.dismissals[dismissalType] = (item.dismissals[dismissalType] || 0) + 1;
      }
    }
  });

  // Calculate averages per group with division by zero safety
  return Object.values(groups).map(item => {
    const battingAverage = item.inningsBatted > 0 ? (item.totalRuns / item.inningsBatted).toFixed(2) : '0.00';
    const runsPerDismissal = item.timesOut > 0 ? (item.totalRuns / item.timesOut).toFixed(2) : 'N/A (Not Out)';

    return {
      ...item,
      battingAverage: Number(battingAverage),
      runsPerDismissal: runsPerDismissal === 'N/A (Not Out)' ? 'N/A' : Number(runsPerDismissal)
    };
  }).sort((a, b) => {
    // Sort months in calendar order, others alphabetically/numerically
    if (groupBy === 'Month') {
      return MONTH_NAMES.indexOf(a.key) - MONTH_NAMES.indexOf(b.key);
    }
    if (groupBy === 'Batting Position') {
      const numA = a.key.includes('Position') ? parseInt(a.key.replace('Position ', ''), 10) : 999;
      const numB = b.key.includes('Position') ? parseInt(b.key.replace('Position ', ''), 10) : 999;
      return numA - numB;
    }
    return a.key.localeCompare(b.key);
  });
};

/**
 * Compiles a breakdown of all dismissal types for the selected subset of games.
 */
export const compileDismissalBreakdown = (games) => {
  const breakdown = {};
  let totalWickets = 0;

  games.forEach(g => {
    const didNotBat = g.did_not_bat || g.runs_scored === null;
    if (!didNotBat && g.is_out && g.dismissal && g.dismissal !== 'None' && g.dismissal !== 'DNB') {
      breakdown[g.dismissal] = (breakdown[g.dismissal] || 0) + 1;
      totalWickets += 1;
    }
  });

  return Object.entries(breakdown).map(([type, count]) => {
    const percentage = totalWickets > 0 ? ((count / totalWickets) * 100).toFixed(1) : '0.0';
    return {
      type,
      count,
      percentage: Number(percentage)
    };
  }).sort((a, b) => b.count - a.count);
};
