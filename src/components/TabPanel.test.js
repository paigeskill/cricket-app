import React from 'react';
import { render, screen } from '@testing-library/react';
import TabPanel from './TabPanel';

describe('TabPanel Component', () => {
  test('renders children content and applies accessibility attributes correctly when active', () => {
    const { container } = render(
      <TabPanel value={1} index={1} prefix="test">
        <div>Active Tab Panel Content</div>
      </TabPanel>
    );

    // Verify content is visible
    expect(screen.getByText('Active Tab Panel Content')).toBeInTheDocument();

    // Verify accessibility ID and labelledby are correct
    const divElement = container.firstChild;
    expect(divElement).toHaveAttribute('id', 'test-panel-1');
    expect(divElement).toHaveAttribute('aria-labelledby', 'test-tab-1');
    expect(divElement).not.toHaveAttribute('hidden');
  });

  test('hides content when inactive', () => {
    const { container } = render(
      <TabPanel value={0} index={1} prefix="test">
        <div>Inactive Tab Panel Content</div>
      </TabPanel>
    );

    // Verify content is not mounted/visible
    expect(screen.queryByText('Inactive Tab Panel Content')).not.toBeInTheDocument();

    // Verify the div has the hidden attribute
    const divElement = container.firstChild;
    expect(divElement).toHaveAttribute('hidden');
  });
});
