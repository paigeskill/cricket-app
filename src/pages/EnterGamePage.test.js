import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import EnterGamePage from './EnterGamePage';

// Mock GameForm to isolate EnterGamePage
jest.mock('../components/GameForm', () => {
  return function MockForm() {
    return <div data-testid="mock-game-form">Mock Game Form</div>;
  };
});

describe('EnterGamePage', () => {
  const renderWithRouter = (children) => {
    return render(<Router>{children}</Router>);
  };

  test('renders page heading and nested GameForm correctly', () => {
    renderWithRouter(<EnterGamePage />);

    // Verify page title headers render
    expect(screen.getByText('Enter Game Details')).toBeInTheDocument();
    expect(screen.getByText(/Fill in the details below/i)).toBeInTheDocument();

    // Verify back navigation trigger link exists
    expect(screen.getByRole('button', { name: /back to home/i })).toBeInTheDocument();

    // Verify GameForm is mounted
    expect(screen.getByTestId('mock-game-form')).toBeInTheDocument();
  });
});
