import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import HistoricalStatsPage from './HistoricalStatsPage';

// Mock StatsTable to isolate HistoricalStatsPage behaviors
jest.mock('../components/StatsTable', () => {
  return function MockTable({ games, onEditGame }) {
    return (
      <div data-testid="mock-stats-table">
        Scorecard hosting {games.length} games
        <button onClick={() => onEditGame({ id: '1', date: '2026-08-27', club: 'Club A', opponent: 'Club B', location: 'Home' }, 1)}>
          Edit Game
        </button>
      </div>
    );
  };
});

// Mock EditGameDialog to isolate modal Dialog trigger states
jest.mock('../components/EditGameDialog', () => {
  return function MockEditDialog({ open, onClose, game }) {
    return open ? (
      <div data-testid="mock-edit-dialog">
        Edit Modal open for {game.club}
        <button onClick={onClose}>Close Dialog</button>
      </div>
    ) : null;
  };
});

describe('HistoricalStatsPage', () => {
  const renderWithRouter = (children) => {
    return render(<Router>{children}</Router>);
  };

  test('renders page elements, action buttons, and handles edit triggers correctly', async () => {
    renderWithRouter(<HistoricalStatsPage />);

    // Verify headers exist
    expect(screen.getByText('Historical Statistics')).toBeInTheDocument();
    expect(screen.getByText(/This page displays a dashboard/i)).toBeInTheDocument();

    // Verify action header buttons exist
    expect(screen.getByRole('button', { name: /Import Data/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /View Analytics/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add New Game/i })).toBeInTheDocument();

    // Verify StatsTable mounts
    expect(screen.getByTestId('mock-stats-table')).toBeInTheDocument();

    // Trigger edit modal via simulated Edit button in mock StatsTable
    const editButton = screen.getByRole('button', { name: /Edit Game/i });
    fireEvent.click(editButton);

    // Verify Edit Game Dialog component is open and active
    expect(screen.getByTestId('mock-edit-dialog')).toBeInTheDocument();
    expect(screen.getByText(/Edit Modal open for Club A/i)).toBeInTheDocument();

    // Close Dialog
    const closeDialogButton = screen.getByRole('button', { name: /Close Dialog/i });
    fireEvent.click(closeDialogButton);

    // Verify Dialog is closed
    await waitFor(() => {
      expect(screen.queryByTestId('mock-edit-dialog')).not.toBeInTheDocument();
    });
  });

  test('allows uploading a CSV file and parsing it', async () => {
    renderWithRouter(<HistoricalStatsPage />);

    // Find the file input
    const fileInput = screen.getByTestId('csv-file-input');

    // Create a mock file
    const file = new File([
      'Club,Team,Opponent,Date,Year,Month,H / A,Overs,Maidens,Runs,Wickets,Number,Runs,Dismissal,Out?,Catches,Run Outs,Stumpings,Byes\n' +
      'NCC,3s,Pontblyddyn,5/4/2014,2014,MAY,A,4,3,7,1,8,25,CWK,1,1,0,N/A,N/A'
    ], 'stats.csv', { type: 'text/csv' });

    // Trigger the file upload
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Wait for the snackbar to appear
    await waitFor(() => {
      expect(screen.getByText(/Successfully imported 1 matches!/i)).toBeInTheDocument();
    });
  });

  test('shows error when uploading an invalid/empty file', async () => {
    renderWithRouter(<HistoricalStatsPage />);

    // Find the file input
    const fileInput = screen.getByTestId('csv-file-input');

    // Create a mock file
    const file = new File([
      ''
    ], 'empty.csv', { type: 'text/csv' });

    // Trigger the file upload
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Wait for the error snackbar to appear
    await waitFor(() => {
      expect(screen.getByText(/Error importing CSV:/i)).toBeInTheDocument();
    });
  });
});
