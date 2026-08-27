import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import GameForm from './GameForm';

describe('GameForm Component', () => {
  const mockOnSave = jest.fn();

  beforeEach(() => {
    mockOnSave.mockClear();
  });

  test('renders all form fields', () => {
    render(<GameForm onSave={mockOnSave} />);

    expect(screen.getByLabelText(/Game Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Your Club Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Opponent Team/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Runs Scored/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Batting Position/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Dismissed \(Out\)\?/i)).toBeInTheDocument();
  });

  test('shows validation errors when submitting empty form', async () => {
    render(<GameForm onSave={mockOnSave} />);

    const submitButton = screen.getByRole('button', { name: /Save Game Details/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/Date is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Club is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Opponent is required/i)).toBeInTheDocument();
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  test('submits form successfully when values are valid', async () => {
    render(<GameForm onSave={mockOnSave} />);

    // Fill out form
    fireEvent.change(screen.getByLabelText(/Game Date/i), { target: { value: '2026-08-27' } });
    fireEvent.change(screen.getByLabelText(/Your Club Name/i), { target: { value: 'Club A' } });
    fireEvent.change(screen.getByLabelText(/Opponent Team/i), { target: { value: 'Club B' } });
    fireEvent.change(screen.getByLabelText(/Runs Scored/i), { target: { value: '50' } });
    fireEvent.change(screen.getByLabelText(/Batting Position/i), { target: { value: '3' } });

    // Submit
    const submitButton = screen.getByRole('button', { name: /Save Game Details/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledTimes(1);
    });

    expect(mockOnSave).toHaveBeenCalledWith({
      date: '2026-08-27',
      club: 'Club A',
      opponent: 'Club B',
      location: 'Home',
      runs_scored: 50,
      batting_number: 3,
      dismissal: 'Caught', // Default dismissal is Caught when is_out is true
      is_out: true
    });
  });

  test('disables dismissal method when Out is turned off', async () => {
    render(<GameForm onSave={mockOnSave} />);

    // Toggle "Dismissed (Out)?" off
    const outSwitch = screen.getByLabelText(/Dismissed \(Out\)\?/i);
    fireEvent.click(outSwitch);

    // Dismissal selection should not be visible
    expect(screen.queryByLabelText(/Dismissal Method/i)).not.toBeInTheDocument();

    // Fill other fields
    fireEvent.change(screen.getByLabelText(/Game Date/i), { target: { value: '2026-08-27' } });
    fireEvent.change(screen.getByLabelText(/Your Club Name/i), { target: { value: 'Club A' } });
    fireEvent.change(screen.getByLabelText(/Opponent Team/i), { target: { value: 'Club B' } });
    fireEvent.change(screen.getByLabelText(/Runs Scored/i), { target: { value: '50' } });
    fireEvent.change(screen.getByLabelText(/Batting Position/i), { target: { value: '3' } });

    // Submit
    const submitButton = screen.getByRole('button', { name: /Save Game Details/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        date: '2026-08-27',
        club: 'Club A',
        opponent: 'Club B',
        location: 'Home',
        runs_scored: 50,
        batting_number: 3,
        dismissal: 'None',
        is_out: false
      });
    });
  });
});
