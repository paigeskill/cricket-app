import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
  Grid,
  Button,
  Typography,
  OutlinedInput,
  Chip
} from '@mui/material';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  slotProps: {
    paper: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  },
};

function AnalyticsFilters({
  years,
  clubs,
  selectedYears,
  selectedClubs,
  venue,
  onChangeYears,
  onChangeClubs,
  onChangeVenue,
  onClearFilters
}) {
  const handleDeleteYear = (yearToDelete) => {
    onChangeYears(selectedYears.filter(y => y !== yearToDelete));
  };

  const handleDeleteClub = (clubToDelete) => {
    onChangeClubs(selectedClubs.filter(c => c !== clubToDelete));
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.05)', bgcolor: 'background.paper' }}>
      <Grid container spacing={3} sx={{ alignItems: 'center' }}>
        {/* Years Filter Column */}
        <Grid xs={12} sm={6} md={3}>
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, fontWeight: 'bold' }}>
              Years
            </Typography>
            <FormControl fullWidth size="small" sx={{ minWidth: 180 }}>
              <InputLabel id="analytics-years-label">Filter Years</InputLabel>
              <Select
                labelId="analytics-years-label"
                id="analytics-years-select"
                multiple
                value={selectedYears}
                onChange={(e) => onChangeYears(e.target.value)}
                input={<OutlinedInput label="Filter Years" />}
                renderValue={(selected) => selected.length === 0 ? 'All Years' : `${selected.length} Year${selected.length > 1 ? 's' : ''} Selected`}
                MenuProps={MenuProps}
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    <Checkbox checked={selectedYears.includes(year)} color="primary" />
                    <ListItemText primary={year} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Grid>

        {/* Clubs Filter Column */}
        <Grid xs={12} sm={6} md={3}>
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, fontWeight: 'bold' }}>
              Clubs
            </Typography>
            <FormControl fullWidth size="small" sx={{ minWidth: 180 }}>
              <InputLabel id="analytics-clubs-label">Filter Clubs</InputLabel>
              <Select
                labelId="analytics-clubs-label"
                id="analytics-clubs-select"
                multiple
                value={selectedClubs}
                onChange={(e) => onChangeClubs(e.target.value)}
                input={<OutlinedInput label="Filter Clubs" />}
                renderValue={(selected) => selected.length === 0 ? 'All Clubs' : `${selected.length} Club${selected.length > 1 ? 's' : ''} Selected`}
                MenuProps={MenuProps}
              >
                {clubs.map((club) => (
                  <MenuItem key={club} value={club}>
                    <Checkbox checked={selectedClubs.includes(club)} color="primary" />
                    <ListItemText primary={club} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Grid>

        {/* Home / Away Venue Filter Column */}
        <Grid xs={12} sm={8} md={3.5}>
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, fontWeight: 'bold' }}>
              Home / Away
            </Typography>
            <ToggleButtonGroup
              color="primary"
              value={venue}
              exclusive
              onChange={(e, val) => val && onChangeVenue(val)}
              aria-label="venue toggle"
              size="small"
              fullWidth
            >
              <ToggleButton value="All">All</ToggleButton>
              <ToggleButton value="Home Only">Home</ToggleButton>
              <ToggleButton value="Away Only">Away</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Grid>

        {/* Clear Filters Button Column */}
        <Grid xs={12} sm={4} md={2.5}>
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Typography variant="caption" sx={{ mb: 0.5, visibility: 'hidden' }}>
              Spacer
            </Typography>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<FilterAltOffIcon />}
              onClick={onClearFilters}
              fullWidth
              size="medium"
              sx={{ borderRadius: 2, textTransform: 'none', border: '1px solid rgba(255, 255, 255, 0.12)', py: 0.8 }}
            >
              Clear Filters
            </Button>
          </Box>
        </Grid>

        {/* Chips row display underneath select inputs */}
        {(selectedYears.length > 0 || selectedClubs.length > 0) && (
          <Grid xs={12}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, pt: 1, borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
              {selectedYears.map(year => (
                <Chip
                  key={year}
                  label={year}
                  onDelete={() => handleDeleteYear(year)}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ borderRadius: '6px' }}
                />
              ))}
              {selectedClubs.map(club => (
                <Chip
                  key={club}
                  label={club}
                  onDelete={() => handleDeleteClub(club)}
                  size="small"
                  color="secondary"
                  variant="outlined"
                  sx={{ borderRadius: '6px' }}
                />
              ))}
            </Box>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
}

export default AnalyticsFilters;
