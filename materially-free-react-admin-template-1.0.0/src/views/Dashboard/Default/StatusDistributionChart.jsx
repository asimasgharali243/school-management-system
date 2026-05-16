// views/Dashboard/StatusDistributionChart.js
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const StatusDistributionChart = ({ tasks }) => {
  // Calculate task status distribution
  const statusData = [
    { name: 'Completed', value: tasks.filter((t) => t.status === 'Completed').length, color: '#4CAF50' },
    { name: 'In Progress', value: tasks.filter((t) => t.status === 'InProgress').length, color: '#2196F3' },
    { name: 'Pending', value: tasks.filter((t) => t.status === 'Pending').length, color: '#FF9800' },
    { name: 'To Do', value: tasks.filter((t) => t.status === 'ToDo').length, color: '#9C27B0' }
  ].filter((item) => item.value > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: 'background.paper',
            p: 1,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1
          }}
        >
          <Typography variant="body2">{`${payload[0].name}: ${payload[0].value} tasks`}</Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Task Status Distribution
        </Typography>

        {statusData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center" height={200}>
            <Typography color="textSecondary">No task data available</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatusDistributionChart;
