const monthsMap = {
  JAN: '01', FEB: '02', MAR: '03', APR: '04', MAY: '05', JUN: '06',
  JUL: '07', AUG: '08', SEP: '09', OCT: '10', NOV: '11', DEC: '12'
};

const DISMISSAL_DICTIONARY = {
  'CWK': 'Caught by Wicketkeeper',
  'C': 'Caught',
  'B': 'Bowled',
  'ST': 'Stumped',
  'RO': 'Run Out',
  'LBW': 'Leg Before Wicket',
  'C&B': 'Caught and Bowled',
  'HW': 'Hit Wicket',
  'NO': 'Not Out'
};

export const tokenizeCSVRow = (rowText) => {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < rowText.length; i++) {
    const char = rowText[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
};

const findHeaderIndex = (headers, name) => {
  return headers.findIndex(h => h.toLowerCase() === name.toLowerCase());
};

const getCell = (row, index, defaultValue = '') => {
  if (index < 0 || index >= row.length) return defaultValue;
  const val = row[index].trim();
  return val === '' ? defaultValue : val;
};

const parseNumericCell = (val) => {
  if (!val || val === 'N/A' || val === '') return null;
  const num = Number(val);
  return isNaN(num) ? null : num;
};

const parseDate = (dateCell, yearCell, monthCell) => {
  if (!dateCell || dateCell === 'N/A') return '';
  const parts = dateCell.split('/');
  if (parts.length === 3) {
    let m = parts[0].padStart(2, '0');
    let d = parts[1].padStart(2, '0');
    let y = parts[2];
    
    // Cross-validate with Month / Year columns if present
    if (monthCell && monthCell !== 'N/A') {
      const canonicalMonth = monthCell.toUpperCase().substring(0, 3);
      if (monthsMap[canonicalMonth]) {
        const expectedMonth = monthsMap[canonicalMonth];
        // If the first part does not match the monthCell but the second part does,
        // it might be D/M/YYYY instead of M/D/YYYY. Adjust accordingly.
        if (m !== expectedMonth && d === expectedMonth) {
          const temp = m;
          m = d;
          d = temp;
        } else if (m !== expectedMonth) {
          m = expectedMonth;
        }
      }
    }
    if (yearCell && yearCell !== 'N/A' && y !== yearCell) {
      y = yearCell;
    }
    return `${y}-${m}-${d}`;
  }
  return dateCell;
};

const mapDismissal = (rawDismissal, did_not_bat) => {
  if (did_not_bat) return 'DNB';
  if (!rawDismissal || rawDismissal === 'N/A' || rawDismissal.toLowerCase() === 'none' || rawDismissal === '') {
    return 'None';
  }
  const clean = rawDismissal.toUpperCase().trim();
  return DISMISSAL_DICTIONARY[clean] || rawDismissal;
};

export const parseCSV = (fileContent) => {
  if (!fileContent || !fileContent.trim()) return [];
  
  const lines = fileContent.split(/\r?\n/);
  if (lines.length <= 1) return [];
  
  const headersRow = lines[0];
  const headers = tokenizeCSVRow(headersRow);
  
  const clubIndex = findHeaderIndex(headers, 'Club');
  const teamIndex = findHeaderIndex(headers, 'Team');
  const opponentIndex = findHeaderIndex(headers, 'Opponent');
  const dateIndex = findHeaderIndex(headers, 'Date');
  const yearIndex = findHeaderIndex(headers, 'Year');
  const monthIndex = findHeaderIndex(headers, 'Month');
  const locationIndex = findHeaderIndex(headers, 'H / A');
  const oversIndex = findHeaderIndex(headers, 'Overs');
  const maidensIndex = findHeaderIndex(headers, 'Maidens');
  
  // Find Runs indices
  let runsIndices = [];
  headers.forEach((h, idx) => {
    if (h.toLowerCase() === 'runs') {
      runsIndices.push(idx);
    }
  });
  // Standard format has bowling runs at index 9, batting runs at index 12.
  // We prioritize positional duplicate resolution.
  const bowlingRunsIndex = runsIndices.length > 0 ? runsIndices[0] : -1;
  const battingRunsIndex = runsIndices.length > 1 ? runsIndices[1] : -1;
  
  const wicketsIndex = findHeaderIndex(headers, 'Wickets');
  const numberIndex = findHeaderIndex(headers, 'Number');
  const dismissalIndex = findHeaderIndex(headers, 'Dismissal');
  const outIndex = findHeaderIndex(headers, 'Out?');
  const catchesIndex = findHeaderIndex(headers, 'Catches');
  const runOutsIndex = findHeaderIndex(headers, 'Run Outs');
  const stumpingsIndex = findHeaderIndex(headers, 'Stumpings');
  const byesIndex = findHeaderIndex(headers, 'Byes');
  
  const games = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const row = tokenizeCSVRow(line);
    if (row.length < 3) continue;
    
    const club = getCell(row, clubIndex, '');
    const team = getCell(row, teamIndex, undefined);
    const opponent = getCell(row, opponentIndex, '');
    
    const rawDate = getCell(row, dateIndex, '');
    const rawYear = getCell(row, yearIndex, '');
    const rawMonth = getCell(row, monthIndex, '');
    const date = parseDate(rawDate, rawYear, rawMonth);
    
    const rawLoc = getCell(row, locationIndex, 'H');
    const location = (rawLoc.toUpperCase() === 'H' || rawLoc.toUpperCase() === 'HOME') ? 'Home' : 'Away';
    
    const rawOvers = getCell(row, oversIndex, 'N/A');
    const rawMaidens = getCell(row, maidensIndex, 'N/A');
    const rawBowlingRuns = getCell(row, bowlingRunsIndex, 'N/A');
    const rawWickets = getCell(row, wicketsIndex, 'N/A');
    
    const overs_bowled = parseNumericCell(rawOvers);
    const maidens_bowled = parseNumericCell(rawMaidens);
    const runs_conceded = parseNumericCell(rawBowlingRuns);
    const wickets_taken = parseNumericCell(rawWickets);
    
    const rawNumber = getCell(row, numberIndex, 'N/A');
    const rawBattingRuns = getCell(row, battingRunsIndex, 'N/A');
    const runs_scored = parseNumericCell(rawBattingRuns);
    const batting_number = parseNumericCell(rawNumber);
    
    const did_not_bat = rawBattingRuns === 'N/A' || rawBattingRuns === '';
    
    const rawDismissal = getCell(row, dismissalIndex, '');
    const rawOut = getCell(row, outIndex, '0');
    
    const dismissal = mapDismissal(rawDismissal, did_not_bat);
    const is_out = !did_not_bat && (rawOut === '1' || rawOut.toUpperCase() === 'YES' || rawOut.toUpperCase() === 'TRUE');
    
    const rawCatches = getCell(row, catchesIndex, 'N/A');
    const rawRunOuts = getCell(row, runOutsIndex, 'N/A');
    const rawStumpings = getCell(row, stumpingsIndex, 'N/A');
    const rawByes = getCell(row, byesIndex, 'N/A');
    
    const catchesVal = parseNumericCell(rawCatches);
    const runOutsVal = parseNumericCell(rawRunOuts);
    const stumpingsVal = parseNumericCell(rawStumpings);
    const byesVal = parseNumericCell(rawByes);
    
    const isKeeperMatch = rawStumpings !== 'N/A' && rawStumpings !== '' && rawByes !== 'N/A' && rawByes !== '';
    
    let is_keeper = false;
    let catches = null;
    let run_outs = null;
    let catches_keeper = null;
    let run_outs_keeper = null;
    let stumpings = null;
    let byes_conceded = null;
    
    if (isKeeperMatch) {
      is_keeper = true;
      catches_keeper = catchesVal !== null ? catchesVal : 0;
      run_outs_keeper = runOutsVal !== null ? runOutsVal : 0;
      stumpings = stumpingsVal !== null ? stumpingsVal : 0;
      byes_conceded = byesVal !== null ? byesVal : 0;
      catches = 0;
      run_outs = 0;
    } else {
      is_keeper = false;
      catches = catchesVal !== null ? catchesVal : 0;
      run_outs = runOutsVal !== null ? runOutsVal : 0;
      catches_keeper = 0;
      run_outs_keeper = 0;
      stumpings = 0;
      byes_conceded = 0;
    }
    
    games.push({
      id: `imported-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
      date,
      club,
      team,
      opponent,
      location,
      did_not_bat,
      runs_scored: did_not_bat ? null : runs_scored,
      batting_number: did_not_bat ? null : batting_number,
      dismissal,
      is_out,
      overs_bowled,
      maidens_bowled,
      runs_conceded,
      wickets_taken,
      is_keeper,
      catches,
      run_outs,
      catches_keeper,
      run_outs_keeper,
      stumpings,
      byes_conceded
    });
  }
  
  return games;
};
