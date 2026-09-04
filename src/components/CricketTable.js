import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography
} from '@mui/material';

/**
 * A highly reusable table wrapper to eliminate TableContainer/Head/Body boilerplate code.
 * @param {string} headerColor - Color class for table header background (e.g. 'primary.dark')
 * @param {Array} headers - List of header objects: { text: string, align: 'left'|'right'|'center' }
 * @param {boolean} isEmpty - True if the dataset is empty
 * @param {number} colSpan - Number of columns for the empty-state cell
 * @param {string} emptyMessage - Text to display when empty
 */
function CricketTable({
  headerColor,
  headers,
  isEmpty,
  colSpan,
  emptyMessage = "No game records found. Click 'Enter New Game' to add one!",
  children
}) {
  return (
    <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.05)', mt: 1 }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ bgcolor: headerColor }}>
          <TableRow>
            {headers.map((h, i) => (
              <TableCell
                key={i}
                align={h.align || 'left'}
                sx={{ color: '#ffffff', fontWeight: 'bold' }}
              >
                {h.text}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {isEmpty ? (
            <TableRow>
              <TableCell colSpan={colSpan || headers.length} align="center" sx={{ py: 6 }}>
                <Typography variant="body1" color="text.secondary">
                  {emptyMessage}
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            children
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default CricketTable;
