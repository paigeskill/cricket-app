import React from 'react';
import { render, screen } from '@testing-library/react';
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
    is_out: true
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
    is_out: false
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

  test('renders table rows and columns with accurate data', () => {
    render(<StatsTable games={mockGames} />);

    // Check header column text
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
    expect(screen.getByText('Club B')).toBeInTheDocument();
    expect(screen.getByText('Club C')).toBeInTheDocument();
    
    // Check out / not out chips
    expect(screen.getByText('Out')).toBeInTheDocument();
    expect(screen.getByText('Not Out')).toBeInTheDocument();
  });

  test('calculates and displays correct statistics KPIs', () => {
    render(<StatsTable games={mockGames} />);

    // Matches Played KPI: 2
    expect(screen.getByText('2')).toBeInTheDocument();

    // Total Runs KPI: 50 + 100 = 150
    expect(screen.getByText('150')).toBeInTheDocument();

    // Highest Score KPI: 100
    expect(screen.getByText('100')).toBeInTheDocument();

    // Batting Average KPI: 150 runs / 1 dismissal = 150.00
    expect(screen.getByText('150.00')).toBeInTheDocument();
  });
});
