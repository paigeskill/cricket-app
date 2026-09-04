import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import ActionCard from './ActionCard';

describe('ActionCard Component', () => {
  const mockOnClick = jest.fn();

  test('renders titles, descriptions, buttons, and triggers onClick callback successfully', () => {
    render(
      <ActionCard
        title="Test Title"
        description="Test Description text block"
        Icon={SportsCricketIcon}
        buttonText="Action Button Text"
        onClick={mockOnClick}
        color="secondary"
        textColor="background.default"
      />
    );

    // Verify Title and Description exist
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description text block')).toBeInTheDocument();

    // Verify CTA button exists
    const button = screen.getByRole('button', { name: 'Action Button Text' });
    expect(button).toBeInTheDocument();

    // Trigger click on CTA button
    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
