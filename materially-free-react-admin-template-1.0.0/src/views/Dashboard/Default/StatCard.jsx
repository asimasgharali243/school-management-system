// views/Dashboard/StatCard.js
import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';

const StatCard = ({ title, value, icon, color, subtitle, trend }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box>
            <Typography variant="h4" component="div" fontWeight="bold">
              {value}
            </Typography>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              {title}
            </Typography>
          </Box>
          <Avatar
            sx={{
              backgroundColor: color,
              width: 56,
              height: 56
            }}
          >
            {icon}
          </Avatar>
        </Box>

        {subtitle && (
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {subtitle}
          </Typography>
        )}

        {trend && (
          <Typography
            variant="body2"
            sx={{
              color: color,
              fontWeight: 'medium'
            }}
          >
            {trend}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
