import {
  filterGames,
  extractFilterOptions,
  groupStatistics,
  compileDismissalBreakdown
} from './analyticsHelper';

const mockGames = [
  {
    id: '1',
    date: '2026-05-15',
    club: 'Club A',
    opponent: 'Club B',
    location: 'Home',
    runs_scored: 50,
    batting_number: 3,
    dismissal: 'Caught',
    is_out: true,
    overs_bowled: 0,
    maidens_bowled: 0,
    runs_conceded: 0,
    wickets_taken: 0
  },
  {
    id: '2',
    date: '2026-06-02',
    club: 'Club A',
    opponent: 'Club C',
    location: 'Away',
    runs_scored: 100,
    batting_number: 3,
    dismissal: 'None',
    is_out: false,
    overs_bowled: 0,
    maidens_bowled: 0,
    runs_conceded: 0,
    wickets_taken: 0
  },
  {
    id: '3',
    date: '2025-06-15',
    club: 'Club B',
    opponent: 'Club D',
    location: 'Home',
    did_not_bat: true,
    runs_scored: null,
    batting_number: null,
    dismissal: 'DNB',
    is_out: false,
    overs_bowled: 0,
    maidens_bowled: 0,
    runs_conceded: 0,
    wickets_taken: 0
  }
];

describe('analyticsHelper Utility', () => {
  test('filterGames applies year, club, and venue filters correctly', () => {
    // Filter Year 2026
    const f1 = filterGames(mockGames, { selectedYears: ['2026'], selectedClubs: [], venue: 'All' });
    expect(f1).toHaveLength(2);
    expect(f1[0].id).toBe('1');

    // Filter Club B
    const f2 = filterGames(mockGames, { selectedYears: [], selectedClubs: ['Club B'], venue: 'All' });
    expect(f2).toHaveLength(1);
    expect(f2[0].id).toBe('3');

    // Filter Away Only
    const f3 = filterGames(mockGames, { selectedYears: [], selectedClubs: [], venue: 'Away Only' });
    expect(f3).toHaveLength(1);
    expect(f3[0].id).toBe('2');
  });

  test('extractFilterOptions compiles unique years and clubs sorted', () => {
    const { years, clubs } = extractFilterOptions(mockGames);
    expect(years).toEqual(['2026', '2025']);
    expect(clubs).toEqual(['Club A', 'Club B']);
  });

  test('groupStatistics groups and calculates dynamic averages accurately', () => {
    // Group by Year
    const stats = groupStatistics(mockGames, 'Year');
    expect(stats).toHaveLength(2);

    // 2026 has 2 innings, total 150 runs, 1 dismissal
    // Average = 150 / 2 = 75.00
    // Runs / Dismissal = 150 / 1 = 150.00
    const stat2026 = stats.find(s => s.key === '2026');
    expect(stat2026.totalRuns).toBe(150);
    expect(stat2026.inningsBatted).toBe(2);
    expect(stat2026.battingAverage).toBe(75.00);
    expect(stat2026.runsPerDismissal).toBe(150.00);

    // 2025 has 1 game but DNB, so innings=0, runs=0, avg=0.00, runs/srd="N/A"
    const stat2025 = stats.find(s => s.key === '2025');
    expect(stat2025.totalRuns).toBe(0);
    expect(stat2025.inningsBatted).toBe(0);
    expect(stat2025.battingAverage).toBe(0);
    expect(stat2025.runsPerDismissal).toBe('N/A');
  });

  test('compileDismissalBreakdown aggregates dismissal counts and percentages', () => {
    const breakdown = compileDismissalBreakdown(mockGames);
    expect(breakdown).toHaveLength(1); // 1 dismissal total (Caught)
    expect(breakdown[0].type).toBe('Caught');
    expect(breakdown[0].count).toBe(1);
    expect(breakdown[0].percentage).toBe(100.0);
  });
});
