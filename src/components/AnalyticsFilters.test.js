import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AnalyticsFilters from './AnalyticsFilters';

describe('AnalyticsFilters Component', () => {
  const mockYears = ['2026', '2025'];
  const mockClubs = ['Club A', 'Club B'];
  const mockOnChangeYears = jest.fn();
  const mockOnChangeClubs = jest.fn();
  const mockOnChangeVenue = jest.fn();
  const mockOnClearFilters = jest.fn();

  test('renders dropdown filters, home/away toggles, and clear button correctly', () => {
    render(
      <AnalyticsFilters
        years={mockYears}
        clubs={mockClubs}
        selectedYears={[]}
        selectedClubs={[]}
        venue="All"
        onChangeYears={mockOnChangeYears}
        onChangeClubs={mockOnChangeClubs}
        onChangeVenue={mockOnChangeVenue}
        onClearFilters={mockOnClearFilters}
      />
    );

    // Verify filter input labels exist
    expect(screen.getAllByText('Filter Years')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Filter Clubs')[0]).toBeInTheDocument();
    
    // Verify Home/Away section exists
    expect(screen.getByText('Home / Away')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Away' })).toBeInTheDocument();

    // Verify Clear button exists
    expect(screen.getByRole('button', { name: /Clear Filters/i })).toBeInTheDocument();
  });

  test('displays selected items as deletable chips underneath', () => {
    render(
      <AnalyticsFilters
        years={mockYears}
        clubs={mockClubs}
        selectedYears={['2026']}
        selectedClubs={['Club A']}
        venue="All"
        onChangeYears={mockOnChangeYears}
        onChangeClubs={mockOnChangeClubs}
        onChangeVenue={mockOnChangeVenue}
        onClearFilters={mockOnClearFilters}
      />
    );

    // Verify active selection chips are in the document
    expect(screen.getByText('2026')).toBeInTheDocument();
    expect(screen.getByText('Club A')).toBeInTheDocument();
  });

  test('clicking clear filters fires callback prop', () => {
    render(
      <AnalyticsFilters
        years={mockYears}
        clubs={mockClubs}
        selectedYears={[]}
        selectedClubs={[]}
        venue="All"
        onChangeYears={mockOnChangeYears}
        onChangeClubs={mockOnChangeClubs}
        onChangeVenue={mockOnChangeVenue}
        onClearFilters={mockOnClearFilters}
      />
    );

    const clearButton = screen.getByRole('button', { name: /Clear Filters/i });
    fireEvent.click(clearButton);

    expect(mockOnClearFilters).toHaveBeenCalledTimes(1);
  });
});
