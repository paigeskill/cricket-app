import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EditGameDialog from './EditGameDialog';

// Mock GameForm to isolate EditGameDialog rendering
jest.mock('./GameForm', () => {
  return function MockForm({ initialData, defaultTab, onSave }) {
    return (
      <div data-testid="mock-game-form">
        Form prefilled with {initialData.club} and active tab {defaultTab}
        <button onClick={() => onSave({ ...initialData, runs_scored: 99 })}>Save</button>
      </div>
    );
  };
});

describe('EditGameDialog Component', () => {
  const mockGame = {
    id: '1',
    date: '2026-08-27',
    club: 'West London CC',
    opponent: 'Club B',
    location: 'Home',
    runs_scored: 50,
    did_not_bat: false
  };

  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  test('does not render when open is false', () => {
    const { container } = render(
      <EditGameDialog
        open={false}
        onClose={mockOnClose}
        game={mockGame}
        defaultTab={1}
        onSave={mockOnSave}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  test('renders dialog headers and nested GameForm when open is true', () => {
    render(
      <EditGameDialog
        open={true}
        onClose={mockOnClose}
        game={mockGame}
        defaultTab={2}
        onSave={mockOnSave}
      />
    );

    // Verify Title exists
    expect(screen.getByText('Edit Game Details')).toBeInTheDocument();

    // Verify close icon button exists
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();

    // Verify Form is mounted and prefilled
    expect(screen.getByTestId('mock-game-form')).toBeInTheDocument();
    expect(screen.getByText(/prefilled with West London CC/i)).toBeInTheDocument();
    expect(screen.getByText(/active tab 2/i)).toBeInTheDocument();
  });

  test('clicking close icon button fires onClose callback prop', () => {
    render(
      <EditGameDialog
        open={true}
        onClose={mockOnClose}
        game={mockGame}
        defaultTab={1}
        onSave={mockOnSave}
      />
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('submitting nested GameForm invokes onSave callback prop', () => {
    render(
      <EditGameDialog
        open={true}
        onClose={mockOnClose}
        game={mockGame}
        defaultTab={1}
        onSave={mockOnSave}
      />
    );

    const saveButton = screen.getByRole('button', { name: /Save/i });
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledTimes(1);
    expect(mockOnSave).toHaveBeenCalledWith({ ...mockGame, runs_scored: 99 });
  });
});
