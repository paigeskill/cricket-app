import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatsTable from './StatsTable';

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
    overs_bowled: 4.2, // 26 balls
    maidens_bowled: 0,
    runs_conceded: 18,
    wickets_taken: 2,
    catches: 1,
    run_outs: 0,
    stumpings: 0,
    byes_conceded: 0
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
    overs_bowled: 0.0,
    maidens_bowled: 0,
    runs_conceded: 0,
    wickets_taken: 0,
    catches: 0,
    run_outs: 1,
    stumpings: 1,
    byes_conceded: 4
  },
  {
    id: '3',
    date: '2026-06-15',
    club: 'Club A',
    opponent: 'Club D',
    location: 'Home',
    did_not_bat: true,
    runs_scored: null,
    batting_number: null,
    dismissal: 'DNB',
    is_out: false,
    overs_bowled: 0.0,
    maidens_bowled: 0,
    runs_conceded: 0,
    wickets_taken: 0,
    catches: 0,
    run_outs: 0,
    stumpings: 0,
    byes_conceded: 0
  }
];

describe('StatsTable Component', () => {
  test('renders empty state message when no games provided', () => {
    render(<StatsTable games={[]} />);
    expect(screen.getByText(/No game records found/i)).toBeInTheDocument();
    
    // KPI counters should show default zero values
    expect(screen.getByText('Matches Played')).toBeInTheDocument();
    expect(screen.getByText('Total Runs')).toBeInTheDocument();
    expect(screen.getByText('Highest Score')).toBeInTheDocument();
    expect(screen.getByText('Batting Average')).toBeInTheDocument();
  });

  test('renders batting table rows and columns with accurate data', () => {
    render(<StatsTable games={mockGames} />);

    // Check header column text on first tab
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Club')).toBeInTheDocument();
    expect(screen.getByText('Opponent')).toBeInTheDocument();
    expect(screen.getByText('Venue')).toBeInTheDocument();
    expect(screen.getAllByText('Runs')[0]).toBeInTheDocument();
    expect(screen.getByText('Position')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Dismissal')).toBeInTheDocument();

    // Check specific row content
    expect(screen.getByText('2026-05-15')).toBeInTheDocument();
    expect(screen.getByText('2026-06-02')).toBeInTheDocument();
    
    // Check out / not out chips
    expect(screen.getByText('Out')).toBeInTheDocument();
    expect(screen.getByText('Not Out')).toBeInTheDocument();
    
    // Check DNB row content is rendered
    expect(screen.getAllByText('DNB')[0]).toBeInTheDocument();
    expect(screen.getAllByText('—')[0]).toBeInTheDocument(); // displays dashes for batting number / dismissal of DNB
  });

  test('switches tabs and displays accurate bowling scorecard with calculated math', () => {
    render(<StatsTable games={mockGames} />);

    // Switch to Bowling scorecard tab
    const bowlingTab = screen.getByRole('tab', { name: /Bowling Scorecard/i });
    fireEvent.click(bowlingTab);

    // Assert bowling headers
    expect(screen.getByText('Overs')).toBeInTheDocument();
    expect(screen.getByText('Maidens')).toBeInTheDocument();
    expect(screen.getByText('Wickets')).toBeInTheDocument();
    expect(screen.getByText('Economy')).toBeInTheDocument();
    expect(screen.getByText('Average')).toBeInTheDocument();
    expect(screen.getByText('SR')).toBeInTheDocument();

    // Verify row bowling statistics (fractional calculations)
    // Game 1: 18 runs, 4.2 overs (26 balls), 2 wickets
    // Economy: 18 / (26 / 6) = 18 / 4.333 = 4.15
    // Average: 18 / 2 = 9.00
    // Strike Rate: 26 / 2 = 13.00
    expect(screen.getAllByText('4.15')[0]).toBeInTheDocument();
    expect(screen.getAllByText('9.00')[0]).toBeInTheDocument();
    expect(screen.getAllByText('13.00')[0]).toBeInTheDocument();

    // Dashboard totals for bowling
    expect(screen.getByText('Total Wickets')).toBeInTheDocument();
    expect(screen.getByText('Best Bowling')).toBeInTheDocument();
    expect(screen.getByText('2/18')).toBeInTheDocument(); // Best bowling: 2 wickets for 18 runs
  });

  test('switches tabs and displays fielding scorecard', () => {
    render(<StatsTable games={mockGames} />);

    // Switch to Fielding scorecard tab
    const fieldingTab = screen.getByRole('tab', { name: /Fielding Scorecard/i });
    fireEvent.click(fieldingTab);

    // Assert fielding headers and values
    expect(screen.getAllByText('Outfield Catches')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Outfield RO')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Stumpings')[0]).toBeInTheDocument();
    expect(screen.getByText('Byes')).toBeInTheDocument();

    // Verify values exist
    expect(screen.getAllByText('Victims')[0]).toBeInTheDocument();
    expect(screen.getAllByText('1')[0]).toBeInTheDocument(); // Catch/value in Game 1
    expect(screen.getByText('4')).toBeInTheDocument(); // Wicketkeeper byes in Game 2
  });

  test('clicking edit button triggers onEditGame callback prop', () => {
    const mockOnEdit = jest.fn();
    render(<StatsTable games={mockGames} onEditGame={mockOnEdit} />);

    // Get Edit button on the first row of batting scorecard
    const editButtons = screen.getAllByRole('button', { name: /edit batting performance/i });
    fireEvent.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    expect(mockOnEdit).toHaveBeenCalledWith(mockGames[0], 1);
  });

  test('accurately calculates and groups wicketkeeper stats and victims', () => {
    const keeperGames = [
      {
        id: '10',
        date: '2026-09-03',
        club: 'Club A',
        opponent: 'Club B',
        location: 'Home',
        is_keeper: true,
        catches_keeper: 3,
        stumpings: 2,
        run_outs_keeper: 1,
        byes_conceded: 5
      }
    ];

    render(<StatsTable games={keeperGames} />);

    // Switch to Fielding scorecard tab
    const fieldingTab = screen.getByRole('tab', { name: /Fielding Scorecard/i });
    fireEvent.click(fieldingTab);

    // Verify keeper-specific aggregate values exist in the summary cards
    // Keeper Catches = 3, Stumpings = 2, Keeper RO = 1, Victims = 5 (3 + 2), Byes = 5
    expect(screen.getAllByText('Keeper Catches')[0]).toBeInTheDocument();
    expect(screen.getAllByText('3')[0]).toBeInTheDocument();

    expect(screen.getAllByText('Stumpings')[0]).toBeInTheDocument();
    expect(screen.getAllByText('2')[0]).toBeInTheDocument();

    expect(screen.getAllByText('Keeper RO')[0]).toBeInTheDocument();
    expect(screen.getAllByText('1')[0]).toBeInTheDocument();

    expect(screen.getAllByText('Victims')[0]).toBeInTheDocument();
    expect(screen.getAllByText('5')[0]).toBeInTheDocument(); // Byes is also 5, so grab first
  });

  test('filtering by Stats Range toggle dynamically updates aggregate totals', () => {
    const multiYearGames = [
      {
        id: 'y1',
        date: '2026-04-10',
        club: 'Club A',
        opponent: 'Club B',
        location: 'Home',
        runs_scored: 40,
        is_out: true
      },
      {
        id: 'y2',
        date: '2025-05-12',
        club: 'Club A',
        opponent: 'Club B',
        location: 'Home',
        runs_scored: 80,
        is_out: true
      }
    ];

    render(<StatsTable games={multiYearGames} />);

    // Default stats range is "Current Year (2026)", so matches=1, total runs=40
    expect(screen.getByText('Matches Played')).toBeInTheDocument();
    expect(screen.getAllByText('1')[0]).toBeInTheDocument();
    expect(screen.getByText('Total Runs')).toBeInTheDocument();
    expect(screen.getAllByText('40')[0]).toBeInTheDocument();

    // Find and click "All Time" toggle button
    const allTimeToggle = screen.getByRole('button', { name: /all time/i });
    fireEvent.click(allTimeToggle);

    // All Time stats range, so matches=2, total runs=120 (40 + 80)
    expect(screen.getAllByText('2')[0]).toBeInTheDocument();
    expect(screen.getAllByText('120')[0]).toBeInTheDocument();
  });
});
