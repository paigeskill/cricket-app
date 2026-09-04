import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import AnalyticsDashboard from './AnalyticsDashboard';

// Wrap component with Router for navigation capabilities
const renderWithRouter = (ui) => {
  return render(<Router>{ui}</Router>);
};

const testGames = [
  {
    id: '1',
    date: '2026-05-15',
    club: 'West London CC',
    opponent: 'Richmond RFC',
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
    date: '2025-06-02',
    club: 'West London CC',
    opponent: 'Ealing Cricket Club',
    location: 'Away',
    runs_scored: 80,
    batting_number: 3,
    dismissal: 'None',
    is_out: false,
    overs_bowled: 0,
    maidens_bowled: 0,
    runs_conceded: 0,
    wickets_taken: 0
  }
];

describe('AnalyticsDashboard Page', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('cricket_games', JSON.stringify(testGames));
  });

  test('renders Analytics dashboard and filters correctly', async () => {
    renderWithRouter(<AnalyticsDashboard />);

    // Wait for mock data to load (2 innings total in our seeded testGames)
    expect(await screen.findByRole('heading', { level: 4, name: '2' })).toBeInTheDocument();

    // Assert main header
    expect(screen.getByText('Performance Analytics')).toBeInTheDocument();

    // Assert Filters
    expect(screen.getAllByText('Filter Years')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Filter Clubs')[0]).toBeInTheDocument();
    expect(screen.getByText('Home / Away')).toBeInTheDocument();

    // Assert default aggregate cards
    expect(screen.getByText('Subset Innings Batted')).toBeInTheDocument();
    expect(screen.getByText('Subset Total Runs')).toBeInTheDocument();
    expect(screen.getByText('Subset Runs / Dismissal')).toBeInTheDocument();
    expect(screen.getByText('Subset Runs / Inning')).toBeInTheDocument();
  });

  test('toggles scorecard views between Table and Graph', async () => {
    renderWithRouter(<AnalyticsDashboard />);

    // Wait for mock data to load
    expect(await screen.findByRole('heading', { level: 4, name: '2' })).toBeInTheDocument();

    // Starts on Table view mode by default
    expect(screen.getAllByText('Group By')[0]).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /table view/i })).toBeInTheDocument();

    // Toggle to Graph view
    const graphToggle = screen.getByRole('button', { name: /graph view/i });
    fireEvent.click(graphToggle);

    // Grid table should hide, custom SVG charts should render
    expect(screen.getByText(/Total Runs Scored Trend/i)).toBeInTheDocument();
    expect(screen.getByText(/Averages vs Runs \/ Dismissal/i)).toBeInTheDocument();
  });

  test('switches tabs and displays dismissal breakdown scorecard', async () => {
    renderWithRouter(<AnalyticsDashboard />);

    // Wait for mock data to load
    expect(await screen.findByRole('heading', { level: 4, name: '2' })).toBeInTheDocument();

    // Click Dismissal Breakdown tab
    const dismissalTab = screen.getByRole('tab', { name: /Dismissal Breakdown/i });
    fireEvent.click(dismissalTab);

    // Verify Tab 2 matrix table headers are active
    expect(screen.getByText('Total Wickets')).toBeInTheDocument();
    expect(screen.getByText('Caught')).toBeInTheDocument();
  });

  test('switches tabs and displays comparative panel', async () => {
    renderWithRouter(<AnalyticsDashboard />);

    // Wait for mock data to load
    expect(await screen.findByRole('heading', { level: 4, name: '2' })).toBeInTheDocument();

    // Click Side-by-Side Comparison tab
    const comparativeTab = screen.getByRole('tab', { name: /Side-by-Side Comparison/i });
    fireEvent.click(comparativeTab);

    // Verify comparative side-by-side elements are rendered (under Home vs Away default grouping)
    expect(await screen.findByLabelText(/Comparison Type/i)).toBeInTheDocument();
    expect(screen.getByText(/Home Summary/i)).toBeInTheDocument();
    expect(screen.getByText(/Away Summary/i)).toBeInTheDocument();
  });

  test('handles Batting Positions multiselect comparison successfully', async () => {
    renderWithRouter(<AnalyticsDashboard />);

    // Wait for mock data to load
    expect(await screen.findByRole('heading', { level: 4, name: '2' })).toBeInTheDocument();

    // Click Side-by-Side Comparison tab
    const comparativeTab = screen.getByRole('tab', { name: /Side-by-Side Comparison/i });
    fireEvent.click(comparativeTab);

    // Open comparison type dropdown and select "Batting Positions"
    const compTypeSelect = screen.getByLabelText(/Comparison Type/i);
    fireEvent.mouseDown(compTypeSelect);
    
    const option = await screen.findByText('Batting Positions');
    fireEvent.click(option);

    // Verify batting position groups render
    expect(screen.getByLabelText(/Positions Group A/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Positions Group B/i)).toBeInTheDocument();
  });
});
