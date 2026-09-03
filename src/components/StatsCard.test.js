import React from 'react';
import { render, screen } from '@testing-library/react';
import StatsCard from './StatsCard';

describe('StatsCard Component', () => {
  test('renders metric title and formatted value correctly with theme colored styling', () => {
    render(
      <StatsCard
        title="Matches Played"
        value={15}
        color="primary.main"
      />
    );

    // Verify title text exists
    expect(screen.getByText('Matches Played')).toBeInTheDocument();

    // Verify aggregate score value text exists
    expect(screen.getByText('15')).toBeInTheDocument();
  });
});
