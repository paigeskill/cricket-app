import React, { useState } from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Button,
  Stack,
  FormHelperText,
  Paper,
  Box,
  Typography
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

const DISMISSAL_METHODS = [
  'None',
  'Bowled',
  'Caught',
  'LBW',
  'Run Out',
  'Stumped',
  'Hit Wicket',
  'Obstructing the Field',
  'Retired Hurt'
];

function GameForm({ onSave, initialData }) {
  const [formData, setFormData] = useState(
    initialData || {
      date: '',
      club: '',
      opponent: '',
      location: 'Home',
      runs_scored: '',
      batting_number: '',
      dismissal: 'Caught', // Default to Caught since is_out defaults to true
      is_out: true
    }
  );

  const [errors, setErrors] = useState({});

  const validate = () => {
    const tempErrors = {};
    if (!formData.date) tempErrors.date = 'Date is required';
    if (!formData.club || !formData.club.trim()) tempErrors.club = 'Club is required';
    if (!formData.opponent || !formData.opponent.trim()) tempErrors.opponent = 'Opponent is required';
    
    if (formData.runs_scored === '' || isNaN(formData.runs_scored) || Number(formData.runs_scored) < 0) {
      tempErrors.runs_scored = 'Runs scored must be a non-negative number';
    }
    
    if (formData.batting_number === '' || isNaN(formData.batting_number) || Number(formData.batting_number) < 1) {
      tempErrors.batting_number = 'Batting number must be 1 or greater';
    }

    if (formData.is_out && formData.dismissal === 'None') {
      tempErrors.dismissal = 'Please select a dismissal method if the batsman is out';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    let val = type === 'checkbox' ? checked : value;

    if (name === 'is_out' && !val) {
      // If setting is_out to false, dismissal becomes None automatically
      setFormData((prev) => ({
        ...prev,
        is_out: false,
        dismissal: 'None'
      }));
    } else if (name === 'is_out' && val) {
      // If setting is_out to true, reset dismissal from None if it was None
      setFormData((prev) => ({
        ...prev,
        is_out: true,
        dismissal: prev.dismissal === 'None' ? 'Caught' : prev.dismissal
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: val
      }));
    }

    // Clear specific error as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...formData,
        runs_scored: Number(formData.runs_scored),
        batting_number: Number(formData.batting_number)
      });
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 3, bgcolor: 'background.paper' }}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={3}>
          <TextField
            name="date"
            label="Game Date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            error={!!errors.date}
            helperText={errors.date}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
            required
          />

          <TextField
            name="club"
            label="Your Club Name"
            value={formData.club}
            onChange={handleChange}
            error={!!errors.club}
            helperText={errors.club}
            placeholder="e.g. West London CC"
            fullWidth
            required
          />

          <TextField
            name="opponent"
            label="Opponent Team"
            value={formData.opponent}
            onChange={handleChange}
            error={!!errors.opponent}
            helperText={errors.opponent}
            placeholder="e.g. Richmond RFC"
            fullWidth
            required
          />

          <FormControl fullWidth>
            <InputLabel id="location-label">Location</InputLabel>
            <Select
              labelId="location-label"
              name="location"
              value={formData.location}
              label="Location"
              onChange={handleChange}
            >
              <MenuItem value="Home">Home</MenuItem>
              <MenuItem value="Away">Away</MenuItem>
            </Select>
          </FormControl>

          <TextField
            name="runs_scored"
            label="Runs Scored"
            type="number"
            value={formData.runs_scored}
            onChange={handleChange}
            error={!!errors.runs_scored}
            helperText={errors.runs_scored}
            slotProps={{ htmlInput: { min: 0 } }}
            fullWidth
            required
          />

          <TextField
            name="batting_number"
            label="Batting Position"
            type="number"
            value={formData.batting_number}
            onChange={handleChange}
            error={!!errors.batting_number}
            helperText={errors.batting_number}
            slotProps={{ htmlInput: { min: 1 } }}
            fullWidth
            required
          />

          <Box sx={{ p: 2, border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_out}
                  onChange={handleChange}
                  name="is_out"
                  color="primary"
                />
              }
              label={
                <Typography sx={{ fontWeight: 'bold' }}>
                  Dismissed (Out)?
                </Typography>
              }
            />

            {formData.is_out && (
              <FormControl fullWidth sx={{ mt: 2 }} error={!!errors.dismissal}>
                <InputLabel id="dismissal-label">Dismissal Method</InputLabel>
                <Select
                  labelId="dismissal-label"
                  name="dismissal"
                  value={formData.dismissal}
                  label="Dismissal Method"
                  onChange={handleChange}
                >
                  {DISMISSAL_METHODS.filter(method => method !== 'None').map((method) => (
                    <MenuItem key={method} value={method}>
                      {method}
                    </MenuItem>
                  ))}
                </Select>
                {errors.dismissal && <FormHelperText>{errors.dismissal}</FormHelperText>}
              </FormControl>
            )}
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            startIcon={<SaveIcon />}
            sx={{ py: 1.5, borderRadius: 2, fontWeight: 'bold' }}
            fullWidth
          >
            Save Game Details
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}

export default GameForm;
