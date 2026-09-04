import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button
} from '@mui/material';

/**
 * A reusable call-to-action card component for the Landing Page.
 * @param {string} title - The title of the card
 * @param {string} description - The descriptive paragraph text
 * @param {React.Component} Icon - The Material UI Icon component
 * @param {string} buttonText - The text displayed on the main CTA button
 * @param {function} onClick - Trigger callback when the CTA button is clicked
 * @param {string} color - Theme color palette key (e.g. 'primary', 'secondary', 'info')
 * @param {string} textColor - Custom text color override for the CTA button
 */
function ActionCard({ title, description, Icon, buttonText, onClick, color = 'primary', textColor }) {
  return (
    <Card 
      className="hover-card"
      sx={{ 
        width: '100%',
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        bgcolor: 'background.paper',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: 3
      }}
    >
      <CardContent sx={{ p: 4, flexGrow: 1 }}>
        <Icon sx={{ fontSize: 50, color: `${color}.main`, mb: 2 }} />
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions sx={{ p: 3, pt: 0, justifyContent: 'center' }}>
        <Button 
          variant="contained" 
          color={color} 
          size="large"
          startIcon={<Icon />}
          onClick={onClick}
          sx={{ 
            borderRadius: 2, 
            px: 4, 
            py: 1.5, 
            fontWeight: 'bold', 
            width: '100%',
            ...(textColor && { color: textColor })
          }}
        >
          {buttonText}
        </Button>
      </CardActions>
    </Card>
  );
}

export default ActionCard;
