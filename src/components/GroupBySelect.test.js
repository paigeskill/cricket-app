import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import GroupBySelect from './GroupBySelect';

describe('GroupBySelect Component', () => {
  const mockOnChange = jest.fn();

  test('renders with custom labels and triggers select onChange callbacks', async () => {
    render(
      <GroupBySelect
        value="Year"
        onChange={mockOnChange}
        labelId="test-groupby"
      />
    );

    // Verify label exists
    expect(screen.getAllByText('Group By')[0]).toBeInTheDocument();

    // Find the select element trigger
    const selectTrigger = screen.getByRole('combobox');
    expect(selectTrigger).toBeInTheDocument();

    // Trigger select dropdown via mouseDown
    fireEvent.mouseDown(selectTrigger);

    // Verify select listbox is open in a virtual presentation container
    const listbox = screen.getByRole('listbox');
    expect(listbox).toBeInTheDocument();

    // Verify standard options are rendered
    expect(within(listbox).getByRole('option', { name: 'Year' })).toBeInTheDocument();
    expect(within(listbox).getByRole('option', { name: 'Month' })).toBeInTheDocument();
    expect(within(listbox).getByRole('option', { name: 'Club' })).toBeInTheDocument();
    expect(within(listbox).getByRole('option', { name: 'Home / Away' })).toBeInTheDocument();
    expect(within(listbox).getByRole('option', { name: 'Batting Position' })).toBeInTheDocument();

    // Click Month option
    const monthOption = within(listbox).getByRole('option', { name: 'Month' });
    fireEvent.click(monthOption);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('Month');
  });
});
