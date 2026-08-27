import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

describe('Modern Cricket Website Integration', () => {
  beforeEach(() => {
    // Reset JSDOM path back to home before each test to ensure test isolation
    window.history.pushState({}, '', '/');
  });

  test('renders landing page with correct CTA buttons', () => {
    render(<App />);
    
    // Check main title in the hero area
    expect(screen.getByRole('heading', { level: 1, name: 'CricketStats' })).toBeInTheDocument();
    
    // Check main CTA cards and buttons
    expect(screen.getAllByRole('button', { name: /Enter New Game/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /View Historical Stats/i })[0]).toBeInTheDocument();
  });

  test('navigates to Enter New Game page when clicking card CTA button', async () => {
    render(<App />);

    // Click "Enter New Game" button in the Card
    const enterGameButtons = screen.getAllByRole('button', { name: /Enter New Game/i });
    fireEvent.click(enterGameButtons[0]);

    // Check that we are on the Enter Game page
    expect(await screen.findByText('Enter Game Details')).toBeInTheDocument();
    expect(screen.getByText(/Fill in the details below/i)).toBeInTheDocument();
  });

  test('navigates to Historical Stats page when clicking card CTA button', async () => {
    render(<App />);

    // Click "View Historical Stats" button in the Card
    const viewStatsButtons = screen.getAllByRole('button', { name: /View Historical Stats/i });
    fireEvent.click(viewStatsButtons[0]);

    // Check that we are on the Historical Stats page
    expect(await screen.findByText('Historical Statistics')).toBeInTheDocument();
    expect(screen.getByText(/This page displays a dashboard of your historical batting performances/i)).toBeInTheDocument();
  });

  test('opens navigation drawer when clicking header burger menu', async () => {
    render(<App />);

    // Click on burger menu icon button
    const menuButton = screen.getByLabelText('menu');
    fireEvent.click(menuButton);

    // Sidebar should slide open showing list headers or links
    expect(await screen.findByText('Navigation')).toBeInTheDocument();
  });
});
