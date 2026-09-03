import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './Layout';

describe('Layout Component', () => {
  const renderWithRouter = (children) => {
    return render(<Router>{children}</Router>);
  };

  test('renders top toolbar title and opens responsive drawer on click', () => {
    renderWithRouter(
      <Layout>
        <div data-testid="mock-children">Layout Inner Content</div>
      </Layout>
    );

    // Verify top toolbar title exists
    expect(screen.getByText('CricketStats')).toBeInTheDocument();

    // Verify children content is nested inside the content container area
    expect(screen.getByTestId('mock-children')).toBeInTheDocument();

    // The drawer is closed by default, so nav texts should not be in the document
    expect(screen.queryByText('Navigation')).not.toBeInTheDocument();

    // Click burger menu to open drawer
    const burgerButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(burgerButton);

    // Now the drawer is open and the menu items render
    expect(screen.getByText('Navigation')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Enter New Game')).toBeInTheDocument();
    expect(screen.getByText('View Historical Stats')).toBeInTheDocument();
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
  });
});
