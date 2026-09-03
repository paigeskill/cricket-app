import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import LandingPage from './LandingPage';

describe('LandingPage', () => {
  const renderWithRouter = (children) => {
    return render(<Router>{children}</Router>);
  };

  test('renders hero header and three symmetrical CTA cards successfully', () => {
    renderWithRouter(<LandingPage />);

    // Verify Main Hero heading exists
    expect(screen.getByRole('heading', { level: 1, name: 'CricketStats' })).toBeInTheDocument();
    expect(screen.getByText(/The modern platform for cricket enthusiasts/i)).toBeInTheDocument();

    // Verify Card 1: Enter New Game
    expect(screen.getByRole('heading', { level: 2, name: 'Enter New Game' })).toBeInTheDocument();
    expect(screen.getByText(/Log your statistics right now/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enter New Game' })).toBeInTheDocument();

    // Verify Card 2: Historical Stats
    expect(screen.getByRole('heading', { level: 2, name: 'Historical Stats' })).toBeInTheDocument();
    expect(screen.getByText(/Access a list of all your past matches/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'View Historical Stats' })).toBeInTheDocument();

    // Verify Card 3: View Analytics
    expect(screen.getByRole('heading', { level: 2, name: 'View Analytics' })).toBeInTheDocument();
    expect(screen.getByText(/Analyze your cricket scores with interactive SVG/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'View Analytics' })).toBeInTheDocument();
  });
});
