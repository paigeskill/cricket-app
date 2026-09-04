import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function GroupBySelect({ value, onChange, labelId = "groupby-label" }) {
  return (
    <FormControl size="small" sx={{ minWidth: 150 }}>
      <InputLabel id={labelId}>Group By</InputLabel>
      <Select
        labelId={labelId}
        id={`${labelId}-select`}
        value={value}
        label="Group By"
        onChange={(e) => onChange(e.target.value)}
      >
        <MenuItem value="Year">Year</MenuItem>
        <MenuItem value="Month">Month</MenuItem>
        <MenuItem value="Club">Club</MenuItem>
        <MenuItem value="Venue">Home / Away</MenuItem>
        <MenuItem value="Batting Position">Batting Position</MenuItem>
      </Select>
    </FormControl>
  );
}

export default GroupBySelect;
