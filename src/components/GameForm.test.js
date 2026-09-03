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

    // Default tab shows Game Date and info fields
    expect(screen.getByLabelText(/Game Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Your Club Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Opponent Team/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();

    // Click on Batting Tab to reveal batting fields
    const battingTab = screen.getByRole('tab', { name: /Batting/i });
    fireEvent.click(battingTab);

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

    // Fill out first tab (Game Info)
    fireEvent.change(screen.getByLabelText(/Game Date/i), { target: { value: '2026-08-27' } });
    fireEvent.change(screen.getByLabelText(/Your Club Name/i), { target: { value: 'Club A' } });
    fireEvent.change(screen.getByLabelText(/Opponent Team/i), { target: { value: 'Club B' } });

    // Switch to Batting Tab
    const battingTab = screen.getByRole('tab', { name: /Batting/i });
    fireEvent.click(battingTab);

    // Fill out Batting fields
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
      did_not_bat: false,
      runs_scored: 50,
      batting_number: 3,
      dismissal: 'Caught', // Default dismissal is Caught when is_out is true
      is_out: true,
      overs_bowled: 0,
      maidens_bowled: 0,
      runs_conceded: 0,
      wickets_taken: 0,
      is_keeper: false,
      catches: 0,
      run_outs: 0,
      catches_keeper: 0,
      stumpings: 0,
      run_outs_keeper: 0,
      byes_conceded: 0
    });
  });

  test('disables dismissal method when Out is turned off', async () => {
    render(<GameForm onSave={mockOnSave} />);

    // Switch to Batting Tab
    const battingTab = screen.getByRole('tab', { name: /Batting/i });
    fireEvent.click(battingTab);

    // Toggle "Dismissed (Out)?" off
    const outSwitch = screen.getByLabelText(/Dismissed \(Out\)\?/i);
    fireEvent.click(outSwitch);

    // Dismissal selection should not be visible
    expect(screen.queryByLabelText(/Dismissal Method/i)).not.toBeInTheDocument();

    // Switch back to Game Info Tab to fill first fields
    const infoTab = screen.getByRole('tab', { name: /Game Info/i });
    fireEvent.click(infoTab);

    // Fill other fields
    fireEvent.change(screen.getByLabelText(/Game Date/i), { target: { value: '2026-08-27' } });
    fireEvent.change(screen.getByLabelText(/Your Club Name/i), { target: { value: 'Club A' } });
    fireEvent.change(screen.getByLabelText(/Opponent Team/i), { target: { value: 'Club B' } });

    // Switch back to Batting Tab to set Runs & Position
    fireEvent.click(battingTab);
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
        did_not_bat: false,
        runs_scored: 50,
        batting_number: 3,
        dismissal: 'None',
        is_out: false,
        overs_bowled: 0,
        maidens_bowled: 0,
        runs_conceded: 0,
        wickets_taken: 0,
        is_keeper: false,
        catches: 0,
        run_outs: 0,
        catches_keeper: 0,
        stumpings: 0,
        run_outs_keeper: 0,
        byes_conceded: 0
      });
    });
  });

  test('switches tabs and validates bowling overs correctly', async () => {
    render(<GameForm onSave={mockOnSave} />);

    // Fill standard required fields on first tab BEFORE switching
    fireEvent.change(screen.getByLabelText(/Game Date/i), { target: { value: '2026-08-27' } });
    fireEvent.change(screen.getByLabelText(/Your Club Name/i), { target: { value: 'Club A' } });
    fireEvent.change(screen.getByLabelText(/Opponent Team/i), { target: { value: 'Club B' } });

    // Switch to Batting Tab to fill batting stats
    const battingTab = screen.getByRole('tab', { name: /Batting/i });
    fireEvent.click(battingTab);
    fireEvent.change(screen.getByLabelText(/Runs Scored/i), { target: { value: '50' } });
    fireEvent.change(screen.getByLabelText(/Batting Position/i), { target: { value: '3' } });

    // Switch to Bowling Tab
    const bowlingTab = screen.getByRole('tab', { name: /Bowling/i });
    fireEvent.click(bowlingTab);

    // Verify bowling inputs exist in active TabPanel
    expect(screen.getByLabelText(/Overs Bowled/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Maiden Overs/i)).toBeInTheDocument();

    // Enter invalid overs decimal part (e.g. 3.6 - cricket overs can only have .0-.5 balls)
    fireEvent.change(screen.getByLabelText(/Overs Bowled/i), { target: { value: '3.6' } });

    // Try to save
    const submitButton = screen.getByRole('button', { name: /Save Game Details/i });
    fireEvent.click(submitButton);

    // Should display validation error and focus on bowling tab
    expect(await screen.findByText(/Decimal part of overs bowled can only be between .0 and .5 balls/i)).toBeInTheDocument();
    expect(mockOnSave).not.toHaveBeenCalled();

    // Change to valid overs
    fireEvent.change(screen.getByLabelText(/Overs Bowled/i), { target: { value: '4.2' } });
    fireEvent.change(screen.getByLabelText(/Maiden Overs/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/Runs Given Away/i), { target: { value: '18' } });
    fireEvent.change(screen.getByLabelText(/Wickets Taken/i), { target: { value: '2' } });

    // Submit again
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledTimes(1);
    });

    expect(mockOnSave).toHaveBeenCalledWith({
      date: '2026-08-27',
      club: 'Club A',
      opponent: 'Club B',
      location: 'Home',
      did_not_bat: false,
      runs_scored: 50,
      batting_number: 3,
      dismissal: 'Caught',
      is_out: true,
      overs_bowled: 4.2,
      maidens_bowled: 1,
      runs_conceded: 18,
      wickets_taken: 2,
      is_keeper: false,
      catches: 0,
      run_outs: 0,
      catches_keeper: 0,
      stumpings: 0,
      run_outs_keeper: 0,
      byes_conceded: 0
    });
  });

  test('submits successfully when Did Not Bat is selected', async () => {
    render(<GameForm onSave={mockOnSave} />);

    // Switch to Batting Tab
    const battingTab = screen.getByRole('tab', { name: /Batting/i });
    fireEvent.click(battingTab);

    // Toggle DNB switch ON
    const dnbSwitch = screen.getByLabelText(/Did Not Bat \(DNB\)\?/i);
    fireEvent.click(dnbSwitch);

    // Batting inputs (like Runs Scored) should no longer render/be in document
    expect(screen.queryByLabelText(/Runs Scored/i)).not.toBeInTheDocument();

    // Switch to Game Info Tab
    const infoTab = screen.getByRole('tab', { name: /Game Info/i });
    fireEvent.click(infoTab);

    // Fill standard fields
    fireEvent.change(screen.getByLabelText(/Game Date/i), { target: { value: '2026-08-27' } });
    fireEvent.change(screen.getByLabelText(/Your Club Name/i), { target: { value: 'Club A' } });
    fireEvent.change(screen.getByLabelText(/Opponent Team/i), { target: { value: 'Club B' } });

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
      did_not_bat: true,
      runs_scored: null,
      batting_number: null,
      dismissal: 'DNB',
      is_out: false,
      overs_bowled: 0,
      maidens_bowled: 0,
      runs_conceded: 0,
      wickets_taken: 0,
      is_keeper: false,
      catches: 0,
      run_outs: 0,
      catches_keeper: 0,
      stumpings: 0,
      run_outs_keeper: 0,
      byes_conceded: 0
    });
  });

  test('toggles wicket keeper and dynamically renders keeper inputs on the Fielding tab', async () => {
    render(<GameForm onSave={mockOnSave} />);

    // Navigate to Fielding tab
    const fieldingTab = screen.getByRole('tab', { name: /Fielding/i });
    fireEvent.click(fieldingTab);

    // Default role is Outfield, so Outfield inputs exist
    expect(screen.getByLabelText(/^Catches Taken$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Run Outs$/i)).toBeInTheDocument();

    // Keeper inputs should NOT exist by default
    expect(screen.queryByLabelText(/Catches Taken \(As Keeper\)/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Keeper Run Outs/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Stumpings Taken/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Byes Conceded/i)).not.toBeInTheDocument();

    // Toggle "Wicket Keeper" switch ON
    const keeperSwitch = screen.getByLabelText(/Role: Outfield Fielder/i);
    fireEvent.click(keeperSwitch);

    // Outfield inputs should now be unmounted/hidden
    expect(screen.queryByLabelText(/^Catches Taken$/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/^Run Outs$/i)).not.toBeInTheDocument();

    // Keeper inputs should now be visible/rendered
    expect(screen.getByLabelText(/Catches Taken \(As Keeper\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Keeper Run Outs/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Stumpings Taken/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Byes Conceded/i)).toBeInTheDocument();
  });
});
