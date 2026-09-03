import React from 'react';
import { render, screen } from '@testing-library/react';
import { TableRow, TableCell } from '@mui/material';
import CricketTable from './CricketTable';

describe('CricketTable Component', () => {
  const mockHeaders = [
    { text: 'Header 1' },
    { text: 'Header 2', align: 'right' }
  ];

  test('renders table headers and children rows correctly', () => {
    render(
      <CricketTable
        headerColor="primary.dark"
        headers={mockHeaders}
        isEmpty={false}
      >
        <TableRow>
          <TableCell>Row 1 Cell 1</TableCell>
          <TableCell align="right">Row 1 Cell 2</TableCell>
        </TableRow>
      </CricketTable>
    );

    // Verify headers exist
    expect(screen.getByText('Header 1')).toBeInTheDocument();
    expect(screen.getByText('Header 2')).toBeInTheDocument();

    // Verify row content exists
    expect(screen.getByText('Row 1 Cell 1')).toBeInTheDocument();
    expect(screen.getByText('Row 1 Cell 2')).toBeInTheDocument();
  });

  test('renders empty state placeholder when isEmpty is true', () => {
    const customEmptyMessage = "Custom No Records Found";
    render(
      <CricketTable
        headerColor="primary.dark"
        headers={mockHeaders}
        isEmpty={true}
        emptyMessage={customEmptyMessage}
      />
    );

    // Verify headers exist
    expect(screen.getByText('Header 1')).toBeInTheDocument();

    // Verify custom empty message is displayed
    expect(screen.getByText(customEmptyMessage)).toBeInTheDocument();
  });
});
