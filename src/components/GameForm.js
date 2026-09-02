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
  Typography,
  Tabs,
  Tab
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

const DISMISSAL_METHODS = [
  'None',
  'Bowled',
  'Caught',
  'Caught by Keeper',
  'Caught & Bowled',
  'LBW',
  'Run Out',
  'Stumped',
  'Hit Wicket',
  'Obstructing the Field',
  'Retired Hurt'
];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`cricket-form-tabpanel-${index}`}
      aria-labelledby={`cricket-form-tab-${index}`}
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

function GameForm({ onSave, initialData }) {
  const [tabIndex, setTabIndex] = useState(0);
  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        ...initialData,
        did_not_bat: initialData.did_not_bat || initialData.runs_scored === null || initialData.runs_scored === '',
        runs_scored: initialData.runs_scored === null ? '' : initialData.runs_scored,
        batting_number: initialData.batting_number === null ? '' : initialData.batting_number,
      };
    }
    return {
      date: '',
      club: '',
      opponent: '',
      location: 'Home',
      // Batting
      did_not_bat: false,
      runs_scored: '',
      batting_number: '',
      dismissal: 'Caught',
      is_out: true,
      // Bowling
      overs_bowled: '',
      maidens_bowled: '',
      runs_conceded: '',
      wickets_taken: '',
      // Fielding
      catches: '',
      run_outs: '',
      stumpings: '',
      byes_conceded: ''
    };
  });

  const [errors, setErrors] = useState({});

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const validate = () => {
    const tempErrors = {};
    
    // Game Info Validation (Tab 0)
    if (!formData.date) tempErrors.date = 'Date is required';
    if (!formData.club || !formData.club.trim()) tempErrors.club = 'Club is required';
    if (!formData.opponent || !formData.opponent.trim()) tempErrors.opponent = 'Opponent is required';
    
    // Batting Validation (Tab 1, Only if they batted)
    if (!formData.did_not_bat) {
      if (formData.runs_scored === '' || isNaN(formData.runs_scored) || Number(formData.runs_scored) < 0) {
        tempErrors.runs_scored = 'Runs scored must be a non-negative number';
      }
      if (formData.batting_number === '' || isNaN(formData.batting_number) || Number(formData.batting_number) < 1) {
        tempErrors.batting_number = 'Batting number must be 1 or greater';
      }
      if (formData.is_out && formData.dismissal === 'None') {
        tempErrors.dismissal = 'Please select a dismissal method if the batsman is out';
      }
    }

    // Bowling Validation (Tab 2)
    const oversVal = Number(formData.overs_bowled);
    if (formData.overs_bowled !== '') {
      if (isNaN(oversVal) || oversVal < 0) {
        tempErrors.overs_bowled = 'Overs bowled must be a non-negative number';
      } else {
        const ballsPart = Math.round((oversVal % 1) * 10);
        if (ballsPart > 5) {
          tempErrors.overs_bowled = 'Decimal part of overs bowled can only be between .0 and .5 balls';
        }
      }
    }

    const maidensVal = Number(formData.maidens_bowled);
    if (formData.maidens_bowled !== '') {
      if (isNaN(maidensVal) || !Number.isInteger(maidensVal) || maidensVal < 0) {
        tempErrors.maidens_bowled = 'Maidens bowled must be a non-negative integer';
      } else if (formData.overs_bowled !== '' && maidensVal > Math.floor(oversVal)) {
        tempErrors.maidens_bowled = 'Maidens cannot exceed the number of overs bowled';
      }
    }

    const runsConcededVal = Number(formData.runs_conceded);
    if (formData.runs_conceded !== '') {
      if (isNaN(runsConcededVal) || !Number.isInteger(runsConcededVal) || runsConcededVal < 0) {
        tempErrors.runs_conceded = 'Runs conceded must be a non-negative integer';
      }
    }

    const wicketsVal = Number(formData.wickets_taken);
    if (formData.wickets_taken !== '') {
      if (isNaN(wicketsVal) || !Number.isInteger(wicketsVal) || wicketsVal < 0 || wicketsVal > 10) {
        tempErrors.wickets_taken = 'Wickets taken must be an integer between 0 and 10';
      }
    }

    // Fielding Validation (Tab 3)
    const fieldingFields = [
      { name: 'catches', label: 'Catches' },
      { name: 'run_outs', label: 'Run outs' },
      { name: 'stumpings', label: 'Stumpings' },
      { name: 'byes_conceded', label: 'Byes' }
    ];

    fieldingFields.forEach(field => {
      const val = Number(formData[field.name]);
      if (formData[field.name] !== '') {
        if (isNaN(val) || !Number.isInteger(val) || val < 0) {
          tempErrors[field.name] = `${field.label} must be a non-negative integer`;
        }
      }
    });

    setErrors(tempErrors);

    // If validation fails, navigate the tab automatically to focus on the first error category
    if (Object.keys(tempErrors).length > 0) {
      if (tempErrors.date || tempErrors.club || tempErrors.opponent) {
        setTabIndex(0);
      } else if (tempErrors.runs_scored || tempErrors.batting_number || tempErrors.dismissal) {
        setTabIndex(1);
      } else if (tempErrors.overs_bowled || tempErrors.maidens_bowled || tempErrors.runs_conceded || tempErrors.wickets_taken) {
        setTabIndex(2);
      } else {
        setTabIndex(3);
      }
    }

    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    let val = type === 'checkbox' ? checked : value;

    if (name === 'is_out' && !val) {
      setFormData((prev) => ({
        ...prev,
        is_out: false,
        dismissal: 'None'
      }));
    } else if (name === 'is_out' && val) {
      setFormData((prev) => ({
        ...prev,
        is_out: true,
        dismissal: prev.dismissal === 'None' ? 'Caught' : prev.dismissal
      }));
    } else if (name === 'did_not_bat') {
      setFormData((prev) => ({
        ...prev,
        did_not_bat: val,
        runs_scored: val ? '' : prev.runs_scored,
        batting_number: val ? '' : prev.batting_number,
        is_out: val ? false : prev.is_out,
        dismissal: val ? 'DNB' : (prev.dismissal === 'DNB' ? 'Caught' : prev.dismissal)
      }));
      setErrors((prev) => ({
        ...prev,
        runs_scored: null,
        batting_number: null,
        dismissal: null
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
        runs_scored: formData.did_not_bat ? null : Number(formData.runs_scored),
        batting_number: formData.did_not_bat ? null : Number(formData.batting_number),
        is_out: formData.did_not_bat ? false : formData.is_out,
        dismissal: formData.did_not_bat ? 'DNB' : formData.dismissal,
        overs_bowled: formData.overs_bowled === '' ? 0 : Number(formData.overs_bowled),
        maidens_bowled: formData.maidens_bowled === '' ? 0 : Number(formData.maidens_bowled),
        runs_conceded: formData.runs_conceded === '' ? 0 : Number(formData.runs_conceded),
        wickets_taken: formData.wickets_taken === '' ? 0 : Number(formData.wickets_taken),
        catches: formData.catches === '' ? 0 : Number(formData.catches),
        run_outs: formData.run_outs === '' ? 0 : Number(formData.run_outs),
        stumpings: formData.stumpings === '' ? 0 : Number(formData.stumpings),
        byes_conceded: formData.byes_conceded === '' ? 0 : Number(formData.byes_conceded)
      });
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 3, bgcolor: 'background.paper' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 1 }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          aria-label="cricket stats form tabs"
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Game Info" id="cricket-form-tab-0" />
          <Tab label="Batting" id="cricket-form-tab-1" />
          <Tab label="Bowling" id="cricket-form-tab-2" />
          <Tab label="Fielding" id="cricket-form-tab-3" />
        </Tabs>
      </Box>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        {/* Category 1: Game Info */}
        <TabPanel value={tabIndex} index={0}>
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
          </Stack>
        </TabPanel>

        {/* Category 2: Batting Stats */}
        <TabPanel value={tabIndex} index={1}>
          <Stack spacing={3}>
            <Box sx={{ p: 2, border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 2, bgcolor: 'rgba(237, 108, 2, 0.05)' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.did_not_bat}
                    onChange={handleChange}
                    name="did_not_bat"
                    color="warning"
                  />
                }
                label={
                  <Typography sx={{ fontWeight: 'bold' }}>
                    Did Not Bat (DNB)?
                  </Typography>
                }
              />
            </Box>

            {!formData.did_not_bat && (
              <>
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
              </>
            )}
          </Stack>
        </TabPanel>

        {/* Category 3: Bowling Stats */}
        <TabPanel value={tabIndex} index={2}>
          <Stack spacing={3}>
            <Typography variant="subtitle1" color="text.secondary">
              Fill in bowling stats if you bowled in this match. Leave blank if you did not bowl.
            </Typography>

            <TextField
              name="overs_bowled"
              label="Overs Bowled (e.g. 4.2)"
              type="number"
              value={formData.overs_bowled}
              onChange={handleChange}
              error={!!errors.overs_bowled}
              helperText={errors.overs_bowled || 'Use cricket over notation (e.g. 4.2 means 4 overs & 2 balls)'}
              slotProps={{ htmlInput: { min: 0, step: 0.1 } }}
              fullWidth
            />

            <TextField
              name="maidens_bowled"
              label="Maiden Overs"
              type="number"
              value={formData.maidens_bowled}
              onChange={handleChange}
              error={!!errors.maidens_bowled}
              helperText={errors.maidens_bowled}
              slotProps={{ htmlInput: { min: 0 } }}
              fullWidth
            />

            <TextField
              name="runs_conceded"
              label="Runs Given Away"
              type="number"
              value={formData.runs_conceded}
              onChange={handleChange}
              error={!!errors.runs_conceded}
              helperText={errors.runs_conceded}
              slotProps={{ htmlInput: { min: 0 } }}
              fullWidth
            />

            <TextField
              name="wickets_taken"
              label="Wickets Taken"
              type="number"
              value={formData.wickets_taken}
              onChange={handleChange}
              error={!!errors.wickets_taken}
              helperText={errors.wickets_taken}
              slotProps={{ htmlInput: { min: 0, max: 10 } }}
              fullWidth
            />
          </Stack>
        </TabPanel>

        {/* Category 4: Fielding Stats */}
        <TabPanel value={tabIndex} index={3}>
          <Stack spacing={3}>
            <Typography variant="subtitle1" color="text.secondary">
              Fill in fielding stats if you caught, ran out, or kept wicket in this match.
            </Typography>

            <TextField
              name="catches"
              label="Catches Taken"
              type="number"
              value={formData.catches}
              onChange={handleChange}
              error={!!errors.catches}
              helperText={errors.catches}
              slotProps={{ htmlInput: { min: 0 } }}
              fullWidth
            />

            <TextField
              name="run_outs"
              label="Run Outs"
              type="number"
              value={formData.run_outs}
              onChange={handleChange}
              error={!!errors.run_outs}
              helperText={errors.run_outs}
              slotProps={{ htmlInput: { min: 0 } }}
              fullWidth
            />

            <TextField
              name="stumpings"
              label="Stumpings Taken (Keeper)"
              type="number"
              value={formData.stumpings}
              onChange={handleChange}
              error={!!errors.stumpings}
              helperText={errors.stumpings}
              slotProps={{ htmlInput: { min: 0 } }}
              fullWidth
            />

            <TextField
              name="byes_conceded"
              label="Byes Conceded (Keeper)"
              type="number"
              value={formData.byes_conceded}
              onChange={handleChange}
              error={!!errors.byes_conceded}
              helperText={errors.byes_conceded}
              slotProps={{ htmlInput: { min: 0 } }}
              fullWidth
            />
          </Stack>
        </TabPanel>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          startIcon={<SaveIcon />}
          sx={{ py: 1.5, borderRadius: 2, fontWeight: 'bold', mt: 4 }}
          fullWidth
        >
          Save Game Details
        </Button>
      </Box>
    </Paper>
  );
}

export default GameForm;
