import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  RunsTrendLineChart,
  AverageRunsBarChart,
  DismissalDonutChart,
  ComparativeBarChart
} from './CustomCharts';

describe('CustomCharts Components', () => {
  const mockTrendData = [
    { key: '2026', totalRuns: 150, battingAverage: '37.50', runsPerDismissal: '50.00' },
    { key: '2025', totalRuns: 80, battingAverage: '26.67', runsPerDismissal: '40.00' }
  ];

  const mockDismissalData = [
    { type: 'Caught', count: 3, percentage: '60.0' },
    { type: 'Bowled', count: 2, percentage: '40.0' }
  ];

  test('renders RunsTrendLineChart SVG successfully', () => {
    const { container } = render(<RunsTrendLineChart data={mockTrendData} />);
    
    // Verify an svg element exists inside the container
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
    
    // Verify scale grid markings exist
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('2026')).toBeInTheDocument();
  });

  test('renders AverageRunsBarChart SVG successfully', () => {
    const { container } = render(<AverageRunsBarChart data={mockTrendData} />);
    
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();

    // Verify axis grid marking exists
    expect(screen.getByText('2026')).toBeInTheDocument();
  });

  test('renders DismissalDonutChart polar arc paths', () => {
    const { container } = render(<DismissalDonutChart data={mockDismissalData} />);
    
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();

    // Verify dismissal legend types render
    expect(screen.getByText(/Caught/i)).toBeInTheDocument();
    expect(screen.getByText(/Bowled/i)).toBeInTheDocument();
  });

  test('renders ComparativeBarChart side-by-side comparison bars', () => {
    const itemA = { key: '2026', totalRuns: 150, inningsBatted: 4, battingAverage: '37.50', runsPerDismissal: '50.00' };
    const itemB = { key: '2025', totalRuns: 80, inningsBatted: 3, battingAverage: '26.67', runsPerDismissal: '40.00' };

    const { container } = render(<ComparativeBarChart itemA={itemA} itemB={itemB} />);
    
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();

    // Verify direct KPI titles inside chart legends exist
    expect(screen.getByText('Total Runs')).toBeInTheDocument();
    expect(screen.getByText(/Batting Average/i)).toBeInTheDocument();
  });
});
