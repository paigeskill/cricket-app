import React from 'react';
import { render, screen } from '@testing-library/react';
import { Table, TableBody, TableRow } from '@mui/material';
import GameRowCells from './GameRowCells';

describe('GameRowCells Component', () => {
  const mockGame = {
    date: '2026-09-03',
    club: 'West London CC',
    opponent: 'Richmond RFC',
    location: 'Home'
  };

  test('renders standard date, club, opponent, and venue location cells correctly', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <GameRowCells game={mockGame} />
          </TableRow>
        </TableBody>
      </Table>
    );

    // Verify metadata text elements exist inside cells
    expect(screen.getByRole('rowheader', { name: '2026-09-03' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'West London CC' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Richmond RFC' })).toBeInTheDocument();

    // Verify location Chip element exists
    expect(screen.getByText('Home')).toBeInTheDocument();
  });
});
