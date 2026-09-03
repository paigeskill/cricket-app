import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

/**
 * A highly reusable card component to display single aggregate statistics/KPI metrics consistently.
 * Deduplicates the Card, CardContent, and Typography styles across batting, bowling, and fielding scorecards.
 * @param {string} title - Label of the metric
 * @param {number|string} value - Value of the metric
 * @param {string} color - Theme color key for the value (e.g. 'primary.main', 'success.main')
 */
function StatsCard({ title, value, color }) {
  return (
    <Card sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.05)', height: '100%' }}>
      <CardContent sx={{ textAlign: 'center', px: 1 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: color || 'text.primary' }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default StatsCard;
