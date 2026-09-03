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

  test('renders page elements, resets mock confirmation overlays, and opens edit dialogs correctly', async () => {
    renderWithRouter(<HistoricalStatsPage />);

    // Verify headers exist
    expect(screen.getByText('Historical Statistics')).toBeInTheDocument();
    expect(screen.getByText(/This page displays a dashboard/i)).toBeInTheDocument();

    // Verify action header buttons exist
    expect(screen.getByRole('button', { name: /Reset Mock Data/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /View Analytics/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add New Game/i })).toBeInTheDocument();

    // Verify StatsTable mounts
    expect(screen.getByTestId('mock-stats-table')).toBeInTheDocument();

    // Trigger "Reset Mock Data" dialog
    const resetButton = screen.getByRole('button', { name: /Reset Mock Data/i });
    fireEvent.click(resetButton);

    // Verify reset dialog overlay is visible
    expect(screen.getByText('Reset statistics to original mock data?')).toBeInTheDocument();

    // Cancel reset dialog
    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelButton);

    // Verify reset dialog is closed
    await waitFor(() => {
      expect(screen.queryByText('Reset statistics to original mock data?')).not.toBeInTheDocument();
    });

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
});
