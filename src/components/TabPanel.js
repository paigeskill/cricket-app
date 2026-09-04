import React from 'react';
import { Box } from '@mui/material';

/**
 * A highly reusable TabPanel component to display nested content in active tab panels consistently.
 * Deduplicates the standard MUI TabPanel boilerplate.
 * @param {string} prefix - Identifier prefix for accessibility id and aria-labelledby bindings
 */
function TabPanel(props) {
  const { children, value, index, prefix = 'tab', ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`${prefix}-panel-${index}`}
      aria-labelledby={`${prefix}-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default TabPanel;
