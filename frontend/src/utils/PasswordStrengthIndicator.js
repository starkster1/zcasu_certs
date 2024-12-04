import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

const PasswordStrengthIndicator = ({ score, feedback }) => {
  const getColor = (score) => {
    switch (score) {
      case 0:
        return 'error';
      case 1:
        return 'error';
      case 2:
        return 'warning';
      case 3:
        return 'info';
      case 4:
        return 'success';
      default:
        return 'error';
    }
  };

  const getLabel = (score) => {
    switch (score) {
      case 0:
        return 'Very Weak';
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Strong';
      case 4:
        return 'Very Strong';
      default:
        return 'Very Weak';
    }
  };

  return (
    <Box sx={{ width: '100%', mt: 1 }}>
      <LinearProgress
          variant="determinate"
          value={score * 25} // Adjusted scaling
          color={getColor(score)}
          sx={{ height: 8, borderRadius: 4 }}
        />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        <Typography variant="caption" color={`${getColor(score)}.main`}>
          {getLabel(score)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {score * 25}%
        </Typography>
      </Box>
      {feedback.length > 0 && (
        <Box sx={{ mt: 1 }}>
          {feedback.map((tip, index) => (
            <Typography key={index} variant="caption" color="text.secondary" display="block">
              • {tip}
            </Typography>
          ))}
          
        </Box>
      )}
    </Box>
  );
};

export default PasswordStrengthIndicator;
