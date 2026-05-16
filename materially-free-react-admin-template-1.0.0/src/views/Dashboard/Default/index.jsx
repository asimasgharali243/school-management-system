// views/Dashboard/Default.js
import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  Badge,
  Tabs,
  Tab
} from '@mui/material';

// Icons
import NotificationsIcon from '@mui/icons-material/Notifications';
import EmailIcon from '@mui/icons-material/Email';
import SmsIcon from '@mui/icons-material/Sms';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import HistoryIcon from '@mui/icons-material/History';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PendingIcon from '@mui/icons-material/Pending';
import ScheduleIcon from '@mui/icons-material/Schedule';
import RefreshIcon from '@mui/icons-material/Refresh';
import ViewAllIcon from '@mui/icons-material/ArrowForward';

// ApexCharts
import Chart from 'react-apexcharts';

// RTK Query hooks
import {
  useGetNotificationStatsQuery,
  useGetNotificationsQuery,
  useGetNotificationRulesQuery
} from '../../../store/api/notificationApi';
import { usePermissions } from '../../../customHook/usePermissions';

// Custom Stat Card Component
const StatCard = ({ title, value, icon, color, subtitle, trend, trendUp }) => {
  const theme = useTheme();

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h3" component="div">
              {value}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {subtitle}
            </Typography>
            {trend && (
              <Box display="flex" alignItems="center" mt={1}>
                {trendUp ? (
                  <TrendingUpIcon fontSize="small" color="success" />
                ) : (
                  <TrendingDownIcon fontSize="small" color="error" />
                )}
                <Typography
                  variant="caption"
                  color={trendUp ? 'success.main' : 'error.main'}
                  sx={{ ml: 0.5 }}
                >
                  {trend}
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}20`,
              borderRadius: '50%',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {React.cloneElement(icon, { sx: { color, fontSize: 32 } })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// Main Dashboard Component
const DashboardDefault = () => {
  const theme = useTheme();
  const { isAdmin } = usePermissions();
  const [timeRange, setTimeRange] = useState('7days');
  const [activeTab, setActiveTab] = useState(0);

  // Fetch notification data
  const {
    data: statsData,
    isLoading: statsLoading,
    refetch: refetchStats
  } = useGetNotificationStatsQuery({ range: timeRange });

  const {
    data: notificationsData,
    isLoading: notificationsLoading,
    refetch: refetchNotifications
  } = useGetNotificationsQuery({
    page: 1,
    limit: 10,
    status: 'Sent'
  });

  const {
    data: rulesData,
    isLoading: rulesLoading,
    refetch: refetchRules
  } = useGetNotificationRulesQuery();

  const stats = statsData?.data || {
    total: 0,
    sent: 0,
    failed: 0,
    pending: 0,
    deliveryRate: 0,
    byType: {},
    byStatus: {},
    byDay: [],
    topRules: []
  };

  const notifications = notificationsData?.data?.notifications || [];
  const rules = rulesData?.data || [];

  // Calculate statistics
  const calculateStats = () => {
    const totalNotifications = stats.total || 0;
    const sentNotifications = stats.sent || 0;
    const failedNotifications = stats.failed || 0;
    const pendingNotifications = stats.pending || 0;
    const deliveryRate = stats.deliveryRate || 0;

    const emailCount = stats.byType?.Email || 0;
    const smsCount = stats.byType?.SMS || 0;
    const pushCount = stats.byType?.Push || 0;

    const activeRules = rules.filter(rule => rule.status === 'Active').length;
    const inactiveRules = rules.filter(rule => rule.status === 'Inactive').length;

    return {
      total: totalNotifications,
      sent: sentNotifications,
      failed: failedNotifications,
      pending: pendingNotifications,
      deliveryRate,
      email: emailCount,
      sms: smsCount,
      push: pushCount,
      activeRules,
      inactiveRules,
      totalRules: rules.length
    };
  };

  const notificationStats = calculateStats();

  // ApexCharts Configuration
  const timelineChartOptions = {
    chart: {
      type: 'area',
      height: 300,
      toolbar: {
        show: false
      }
    },
    colors: [theme.palette.success.main, theme.palette.error.main],
    stroke: {
      curve: 'smooth',
      width: 2
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: stats.byDay?.map(d => {
        const date = new Date(d.day);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
      }) || [],
      labels: {
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      labels: {
        colors: theme.palette.text.primary
      }
    },
    grid: {
      borderColor: theme.palette.divider
    },
    tooltip: {
      theme: theme.palette.mode
    }
  };

  const timelineChartSeries = [
    {
      name: 'Sent',
      data: stats.byDay?.map(d => d.sent) || []
    },
    {
      name: 'Failed',
      data: stats.byDay?.map(d => d.failed) || []
    }
  ];

  const deliveryChartOptions = {
    chart: {
      type: 'donut',
      height: 250
    },
    colors: [
      theme.palette.success.main,
      theme.palette.error.main,
      theme.palette.warning.main
    ],
    labels: ['Delivered', 'Failed', 'Pending'],
    legend: {
      position: 'bottom',
      labels: {
        colors: theme.palette.text.primary
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              color: theme.palette.text.primary,
              formatter: function (w) {
                return notificationStats.total.toString();
              }
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: false
    }
  };

  const deliveryChartSeries = [
    notificationStats.sent,
    notificationStats.failed,
    notificationStats.pending
  ];

  const typeChartOptions = {
    chart: {
      type: 'donut',
      height: 250
    },
    colors: [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.info.main
    ],
    labels: ['Email', 'SMS', 'Push'],
    legend: {
      position: 'bottom',
      labels: {
        colors: theme.palette.text.primary
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              color: theme.palette.text.primary,
              formatter: function (w) {
                return notificationStats.total.toString();
              }
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: false
    }
  };

  const typeChartSeries = [
    notificationStats.email,
    notificationStats.sms,
    notificationStats.push
  ];

  const handleRefresh = () => {
    refetchStats();
    refetchNotifications();
    refetchRules();
  };

  if (statsLoading || notificationsLoading || rulesLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!isAdmin()) {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Alert severity="info">
            <Typography variant="h6">Notification Dashboard</Typography>
            <Typography>
              Welcome to the notification management system. You need admin privileges to view detailed statistics.
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {/* Header */}
      <Grid item xs={12}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" gutterBottom>
              Notification Dashboard
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Monitor notification performance and delivery metrics
            </Typography>
          </Box>
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              size="small"
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<ViewAllIcon />}
              href="/dashboard/notification-analytics"
              size="small"
            >
              View Analytics
            </Button>
          </Box>
        </Box>
      </Grid>

      {/* Summary Stats */}
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Notifications"
              value={notificationStats.total}
              icon={<NotificationsIcon />}
              color={theme.palette.primary.main}
              subtitle={`${notificationStats.sent} sent, ${notificationStats.failed} failed`}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Delivery Rate"
              value={`${notificationStats.deliveryRate}%`}
              icon={<CheckCircleIcon />}
              color={theme.palette.success.main}
              subtitle={`${notificationStats.sent} successful deliveries`}
              trend={`+2.5% from last week`}
              trendUp={true}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Rules"
              value={notificationStats.activeRules}
              icon={<NotificationsActiveIcon />}
              color={theme.palette.warning.main}
              subtitle={`${notificationStats.inactiveRules} inactive rules`}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Pending"
              value={notificationStats.pending}
              icon={<PendingIcon />}
              color={theme.palette.info.main}
              subtitle="Notifications in queue"
            />
          </Grid>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Notification Timeline (Last 7 Days)
            </Typography>
            <Box sx={{ height: 300 }}>
              <Chart
                options={timelineChartOptions}
                series={timelineChartSeries}
                type="area"
                height="100%"
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Grid container spacing={2} sx={{ height: '100%' }}>
          <Grid item xs={12}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Delivery Status
                </Typography>
                <Box sx={{ height: 200 }}>
                  <Chart
                    options={deliveryChartOptions}
                    series={deliveryChartSeries}
                    type="donut"
                    height="100%"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  By Channel
                </Typography>
                <Box sx={{ height: 200 }}>
                  <Chart
                    options={typeChartOptions}
                    series={typeChartSeries}
                    type="donut"
                    height="100%"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      {/* Recent Notifications */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6">Recent Notifications</Typography>
              <Button
                variant="text"
                endIcon={<ViewAllIcon />}
                href="/dashboard/notification-history"
                size="small"
              >
                View All
              </Button>
            </Box>

            {notifications.length === 0 ? (
              <Alert severity="info">
                No recent notifications found.
              </Alert>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Recipient</TableCell>
                      <TableCell>Subject</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Sent At</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {notifications.slice(0, 5).map((notification, index) => (
                      <TableRow key={notification.id || index} hover>
                        <TableCell>
                          <Chip
                            label={notification.type}
                            size="small"
                            color={
                              notification.type === 'Email' ? 'primary' :
                                notification.type === 'SMS' ? 'secondary' : 'info'
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                            {notification.recipient || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                            {notification.subject || notification.title || 'No Subject'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={notification.status}
                            size="small"
                            color={
                              notification.status === 'Sent' ? 'success' :
                                notification.status === 'Failed' ? 'error' : 'warning'
                            }
                          />
                        </TableCell>
                        <TableCell>
                          {notification.sentAt || notification.createdAt ?
                            new Date(notification.sentAt || notification.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : 'N/A'
                          }
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Active Rules */}
      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6">Active Rules</Typography>
              <Button
                variant="text"
                endIcon={<ViewAllIcon />}
                href="/dashboard/notification-rules"
                size="small"
              >
                Manage
              </Button>
            </Box>

            {notificationStats.activeRules === 0 ? (
              <Alert severity="info">
                No active notification rules.
              </Alert>
            ) : (
              <List dense>
                {rules
                  .filter(rule => rule.status === 'Active')
                  .slice(0, 5)
                  .map((rule, index) => (
                    <ListItem
                      key={rule.id || index}
                      sx={{
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        py: 1,
                        '&:last-child': { borderBottom: 'none' }
                      }}
                    >
                      <ListItemIcon>
                        <NotificationsActiveIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" fontWeight="medium">
                            {rule.name || `Rule ${index + 1}`}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="textSecondary">
                            {rule.triggerType || 'Manual'} • {(rule.channels || ['Email']).join(', ')}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
              </List>
            )}

            <Box mt={2}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6" color="success.main">
                      {notificationStats.activeRules}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Active
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6" color="textSecondary">
                      {notificationStats.inactiveRules}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Inactive
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Performance Metrics */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Performance Metrics
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="success.main">
                    {notificationStats.deliveryRate}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Delivery Success Rate
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={notificationStats.deliveryRate}
                    color="success"
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="primary.main">
                    {notificationStats.email}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Email Notifications
                  </Typography>
                  <Box display="flex" alignItems="center" justifyContent="center" mt={1}>
                    <EmailIcon color="primary" fontSize="small" />
                    <Typography variant="caption" sx={{ ml: 0.5 }}>
                      {((notificationStats.email / notificationStats.total) * 100 || 0).toFixed(1)}% of total
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="secondary.main">
                    {notificationStats.sms}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    SMS Notifications
                  </Typography>
                  <Box display="flex" alignItems="center" justifyContent="center" mt={1}>
                    <SmsIcon color="secondary" fontSize="small" />
                    <Typography variant="caption" sx={{ ml: 0.5 }}>
                      {((notificationStats.sms / notificationStats.total) * 100 || 0).toFixed(1)}% of total
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="info.main">
                    {notificationStats.push}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Push Notifications
                  </Typography>
                  <Box display="flex" alignItems="center" justifyContent="center" mt={1}>
                    <NotificationsActiveIcon color="info" fontSize="small" />
                    <Typography variant="caption" sx={{ ml: 0.5 }}>
                      {((notificationStats.push / notificationStats.total) * 100 || 0).toFixed(1)}% of total
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Quick Actions */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<NotificationsIcon />}
                  href="/dashboard/notification-rules/create"
                  sx={{ height: 60 }}
                >
                  Create New Rule
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<EmailIcon />}
                  href="/dashboard/notification-templates"
                  sx={{ height: 60 }}
                >
                  Manage Templates
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<HistoryIcon />}
                  href="/dashboard/notification-history"
                  sx={{ height: 60 }}
                >
                  View History
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<TrendingUpIcon />}
                  href="/dashboard/notification-analytics"
                  sx={{ height: 60 }}
                >
                  View Analytics
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* System Status */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              System Status
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                  <CheckCircleIcon color="success" />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Email Service
                  </Typography>
                  <Chip label="Active" size="small" color="success" sx={{ mt: 1 }} />
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                  <CheckCircleIcon color="success" />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    SMS Gateway
                  </Typography>
                  <Chip label="Active" size="small" color="success" sx={{ mt: 1 }} />
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                  <CheckCircleIcon color="success" />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Push Service
                  </Typography>
                  <Chip label="Active" size="small" color="success" sx={{ mt: 1 }} />
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                  <ScheduleIcon color="info" />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Queue Status
                  </Typography>
                  <Chip
                    label={`${notificationStats.pending} pending`}
                    size="small"
                    color={notificationStats.pending > 10 ? "warning" : "info"}
                    sx={{ mt: 1 }}
                  />
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default DashboardDefault;