// views/Dashboard/ProgressCard.js
import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress, Avatar } from '@mui/material';

const ProgressCard = ({ title, completed, total, color, icon }) => {
  const progress = total > 0 ? (completed / total) * 100 : 0;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          <Avatar
            sx={{
              backgroundColor: color,
              width: 40,
              height: 40
            }}
          >
            {icon}
          </Avatar>
        </Box>

        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="h4" component="div" fontWeight="bold">
            {completed}/{total}
          </Typography>
          <Typography variant="h6" color="textSecondary">
            {progress.toFixed(1)}%
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: `${color}20`,
            '& .MuiLinearProgress-bar': {
              backgroundColor: color
            }
          }}
        />

        <Box display="flex" justifyContent="space-between" mt={1}>
          <Typography variant="body2" color="textSecondary">
            Completed
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Total
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProgressCard;
