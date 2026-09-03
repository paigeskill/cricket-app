import React from 'react';
import { TableCell, Chip } from '@mui/material';

/**
 * Reusable row cells to display standard match metadata: Date, Club, Opponent, Venue.
 * Eliminates the repetitive columns in batting, bowling, and fielding scorecards.
 */
function GameRowCells({ game }) {
  return (
    <>
      <TableCell component="th" scope="row">{game.date}</TableCell>
      <TableCell>{game.club}</TableCell>
      <TableCell>{game.opponent}</TableCell>
      <TableCell>
        <Chip 
          label={game.location} 
          size="small" 
          color={game.location === 'Home' ? 'primary' : 'default'}
          variant={game.location === 'Home' ? 'filled' : 'outlined'}
        />
      </TableCell>
    </>
  );
}

export default GameRowCells;
