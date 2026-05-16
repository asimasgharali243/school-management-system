import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Grid,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    LinearProgress,
    Chip,
    Alert,
    CircularProgress,
    Button,
    Snackbar,
    Collapse,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import {
    Refresh as RefreshIcon,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    Notifications as NotificationsIcon,
    Schedule as PendingIcon,
    CheckCircle as SuccessIcon,
    Error as ErrorIcon,
    ExpandMore as ExpandMoreIcon,
    BugReport as DebugIcon,
    Http as ApiIcon,
} from '@mui/icons-material';
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { usePermissions } from '../../../customHook/usePermissions';
import { useGetSystemStatsQuery, useGetNotificationStatsQuery } from '../../../store/api/notificationApi';
import dayjs from 'dayjs';

const NotificationAnalytics = () => {
    const { isAdmin } = usePermissions();
    const [timeRange, setTimeRange] = useState('30days');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const [debugMode, setDebugMode] = useState(false);
    const [debugLogs, setDebugLogs] = useState([]);
    const [apiParams, setApiParams] = useState(null);

    // Debug logging function
    const addDebugLog = (type, message, data = null) => {
        const timestamp = new Date().toISOString();
        const log = { timestamp, type, message, data };
        console.log(`[DEBUG ${type}]: ${message}`, data || '');
        setDebugLogs(prev => [log, ...prev.slice(0, 49)]); // Keep last 50 logs
    };

    // Function to get date from range
    const getDateFromRange = (range) => {
        const result = {
            '24hours': dayjs().subtract(1, 'day').toISOString(),
            '7days': dayjs().subtract(7, 'day').toISOString(),
            '30days': dayjs().subtract(30, 'day').toISOString(),
            '90days': dayjs().subtract(90, 'day').toISOString(),
        }[range] || dayjs().subtract(30, 'day').toISOString();

        addDebugLog('PARAMS', `Time range converted: ${range} -> ${result}`);
        return result;
    };

    // Calculate API parameters
    useEffect(() => {
        const fromDate = getDateFromRange(timeRange);
        const toDate = new Date().toISOString();
        const params = { fromDate, toDate };
        setApiParams(params);
        addDebugLog('API', 'Generated API parameters:', params);
    }, [timeRange]);

    // Get system stats
    const {
        data: systemStatsResponse,
        isLoading: systemLoading,
        error: systemError,
        refetch: refetchSystem,
        isFetching: systemFetching,
    } = useGetSystemStatsQuery(apiParams, {
        skip: !apiParams,
        refetchOnMountOrArgChange: true,
    });

    // Get notification stats
    const {
        data: notificationStatsResponse,
        isLoading: statsLoading,
        error: statsError,
        refetch: refetchStats,
        isFetching: statsFetching,
    } = useGetNotificationStatsQuery(apiParams, {
        skip: !apiParams,
        refetchOnMountOrArgChange: true,
    });

    // Extract actual data from responses
    const systemStatsData = systemStatsResponse?.data || {};
    const notificationStatsData = notificationStatsResponse?.data || {};

    // Debug effects
    useEffect(() => {
        if (systemError) {
            addDebugLog('ERROR', 'System stats API error:', {
                message: systemError.message,
                status: systemError.status,
                data: systemError.data
            });
        }
        if (systemStatsResponse) {
            addDebugLog('DATA', 'System stats API response:', systemStatsResponse);
        }
    }, [systemError, systemStatsResponse]);

    useEffect(() => {
        if (statsError) {
            addDebugLog('ERROR', 'Notification stats API error:', {
                message: statsError.message,
                status: statsError.status,
                data: statsError.data
            });
        }
        if (notificationStatsResponse) {
            addDebugLog('DATA', 'Notification stats API response:', notificationStatsResponse);
        }
    }, [statsError, notificationStatsResponse]);

    const isLoading = systemLoading || statsLoading;

    if (!isAdmin()) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <Alert severity="error" sx={{ maxWidth: 400 }}>
                    <Typography variant="h6">Access Denied</Typography>
                    <Typography>
                        Analytics are only available to administrators.
                    </Typography>
                </Alert>
            </Box>
        );
    }

    // Generate last 7 days data for charts
    const generateLast7DaysData = () => {
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const date = dayjs().subtract(i, 'day');
            // For now, simulate data until we have actual daily stats from API
            const sent = Math.floor(Math.random() * 50) + 20;
            const failed = Math.floor(Math.random() * 10) + 1;
            const read = Math.floor(Math.random() * 40) + 15;
            data.push({
                name: date.format('MMM D'),
                Sent: sent,
                Failed: failed,
                Read: read,
            });
        }
        return data;
    };

    const barChartData = generateLast7DaysData();

    // Prepare pie chart data from system stats
    const pieChartData = systemStatsData?.rules?.byCategory?.map(c => ({
        name: c.category || 'Unknown',
        value: c.count || 1,
    })) || [
            { name: 'GENERAL', value: 5 },
            { name: 'ATTENDANCE', value: 3 },
            { name: 'FEE', value: 2 },
            { name: 'EXAM', value: 4 }
        ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

    const getStatusIcon = (status) => {
        switch (status?.toUpperCase()) {
            case 'SENT': return <SuccessIcon color="success" fontSize="small" />;
            case 'FAILED': return <ErrorIcon color="error" fontSize="small" />;
            case 'PENDING': return <PendingIcon color="warning" fontSize="small" />;
            case 'DELIVERED': return <CheckCircle color="success" fontSize="small" />;
            default: return null;
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toUpperCase()) {
            case 'SENT':
            case 'DELIVERED': return 'success';
            case 'FAILED': return 'error';
            case 'PENDING': return 'warning';
            case 'READ': return 'info';
            default: return 'default';
        }
    };

    const handleRefresh = () => {
        addDebugLog('ACTION', 'Manual refresh triggered');
        refetchSystem();
        refetchStats();
        setSnackbar({
            open: true,
            message: 'Refreshing analytics data...',
            severity: 'info'
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Calculate totals safely - using new response structure
    const totalNotifications = notificationStatsData?.notifications?.total || 0;
    const successRate = notificationStatsData?.notifications?.successRate || 0;
    const failureRate = 100 - successRate;

    // Test API endpoints manually
    const testApiEndpoints = async () => {
        addDebugLog('TEST', 'Testing API endpoints...');

        if (!apiParams) {
            addDebugLog('TEST_ERROR', 'No API parameters available');
            return;
        }

        try {
            // Test system stats endpoint
            const queryString = new URLSearchParams({
                fromDate: apiParams.fromDate,
                toDate: apiParams.toDate
            }).toString();

            const systemResponse = await fetch(`/api/notification/system-stats?${queryString}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Adjust based on your auth
                }
            });
            const systemData = await systemResponse.json();
            addDebugLog('TEST', 'Direct fetch system stats:', {
                status: systemResponse.status,
                statusText: systemResponse.statusText,
                url: systemResponse.url,
                data: systemData
            });
        } catch (error) {
            addDebugLog('TEST_ERROR', 'Direct fetch failed for system stats:', error);
        }

        try {
            // Test notification stats endpoint
            const queryString = new URLSearchParams({
                fromDate: apiParams.fromDate,
                toDate: apiParams.toDate
            }).toString();

            const statsResponse = await fetch(`/api/notification/stats?${queryString}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const statsData = await statsResponse.json();
            addDebugLog('TEST', 'Direct fetch notification stats:', {
                status: statsResponse.status,
                statusText: statsResponse.statusText,
                url: statsResponse.url,
                data: statsData
            });
        } catch (error) {
            addDebugLog('TEST_ERROR', 'Direct fetch failed for notification stats:', error);
        }
    };

    // Prepare system overview data
    const systemOverview = {
        totalRules: systemStatsData?.rules?.total || 0,
        activeRules: systemStatsData?.rules?.active || 0,
        totalDevices: systemStatsData?.devices?.total || 0,
        activeDevices: systemStatsData?.devices?.active || 0,
        archivedHistory: systemStatsData?.history?.archived || 0,
    };

    return (
        <Box>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={snackbar.message}
            />

            {/* Debug Mode Toggle */}
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button
                    variant="outlined"
                    startIcon={<DebugIcon />}
                    onClick={() => setDebugMode(!debugMode)}
                    color={debugMode ? "error" : "primary"}
                    size="small"
                >
                    {debugMode ? 'Hide Debug' : 'Debug Mode'}
                </Button>
            </Box>

            {/* Debug Panel */}
            <Collapse in={debugMode}>
                <Card sx={{ mb: 3, bgcolor: '#f5f5f5' }}>
                    <CardHeader
                        title="Debug Information"
                        avatar={<DebugIcon color="error" />}
                        action={
                            <Button
                                size="small"
                                onClick={testApiEndpoints}
                                startIcon={<ApiIcon />}
                            >
                                Test APIs
                            </Button>
                        }
                    />
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography>API Status</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Box>
                                            <Typography variant="body2">
                                                <strong>System Stats:</strong>
                                                {systemLoading ? ' Loading...' :
                                                    systemError ? ' Error' :
                                                        systemStatsResponse ? ' Loaded' : ' No data'}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Notification Stats:</strong>
                                                {statsLoading ? ' Loading...' :
                                                    statsError ? ' Error' :
                                                        notificationStatsResponse ? ' Loaded' : ' No data'}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>API Parameters:</strong>
                                            </Typography>
                                            <pre style={{ fontSize: '12px', background: '#fff', padding: '8px' }}>
                                                {JSON.stringify(apiParams, null, 2)}
                                            </pre>
                                            <Typography variant="body2">
                                                <strong>Period:</strong> {systemStatsData?.period?.from ? dayjs(systemStatsData.period.from).format('MMM D, YYYY') : 'N/A'} to {systemStatsData?.period?.to ? dayjs(systemStatsData.period.to).format('MMM D, YYYY') : 'N/A'}
                                            </Typography>
                                        </Box>
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography>API Responses</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Box>
                                            <Typography variant="body2"><strong>System Stats Data:</strong></Typography>
                                            <pre style={{ fontSize: '12px', background: '#fff', padding: '8px', maxHeight: '200px', overflow: 'auto' }}>
                                                {JSON.stringify(systemStatsResponse || 'No data', null, 2)}
                                            </pre>
                                            <Typography variant="body2" sx={{ mt: 2 }}><strong>Notification Stats Data:</strong></Typography>
                                            <pre style={{ fontSize: '12px', background: '#fff', padding: '8px', maxHeight: '200px', overflow: 'auto' }}>
                                                {JSON.stringify(notificationStatsResponse || 'No data', null, 2)}
                                            </pre>
                                        </Box>
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>
                            <Grid item xs={12}>
                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography>Debug Logs ({debugLogs.length})</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Box sx={{ maxHeight: '300px', overflow: 'auto' }}>
                                            {debugLogs.length === 0 ? (
                                                <Typography variant="body2" color="text.secondary">
                                                    No debug logs yet
                                                </Typography>
                                            ) : (
                                                debugLogs.map((log, index) => (
                                                    <Box
                                                        key={index}
                                                        sx={{
                                                            p: 1,
                                                            mb: 1,
                                                            bgcolor: log.type === 'ERROR' ? '#ffebee' : '#e8f5e8',
                                                            borderLeft: `4px solid ${log.type === 'ERROR' ? '#f44336' :
                                                                    log.type === 'DATA' ? '#4caf50' :
                                                                        '#2196f3'
                                                                }`
                                                        }}
                                                    >
                                                        <Typography variant="caption" color="text.secondary">
                                                            {new Date(log.timestamp).toLocaleTimeString()}
                                                        </Typography>
                                                        <Typography variant="body2" fontWeight="medium">
                                                            [{log.type}] {log.message}
                                                        </Typography>
                                                        {log.data && (
                                                            <pre style={{ fontSize: '10px', marginTop: '4px', overflow: 'auto' }}>
                                                                {typeof log.data === 'object' ? JSON.stringify(log.data, null, 2) : String(log.data)}
                                                            </pre>
                                                        )}
                                                    </Box>
                                                ))
                                            )}
                                        </Box>
                                        <Box display="flex" justifyContent="space-between" mt={2}>
                                            <Button
                                                size="small"
                                                onClick={() => setDebugLogs([])}
                                            >
                                                Clear Logs
                                            </Button>
                                            <Button
                                                size="small"
                                                onClick={() => console.log('Debug Logs:', debugLogs)}
                                            >
                                                Log to Console
                                            </Button>
                                        </Box>
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Collapse>

            {systemError && (
                <Alert severity="error" sx={{ mb: 2 }} onClick={() => addDebugLog('ERROR', 'System error clicked', systemError)}>
                    Failed to load system stats: {systemError.message}
                    {systemError.status && ` (Status: ${systemError.status})`}
                </Alert>
            )}

            {statsError && (
                <Alert severity="error" sx={{ mb: 2 }} onClick={() => addDebugLog('ERROR', 'Stats error clicked', statsError)}>
                    Failed to load notification stats: {statsError.message}
                    {statsError.status && ` (Status: ${statsError.status})`}
                </Alert>
            )}

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                    <Typography variant="h4" gutterBottom>
                        Notification Analytics
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Monitor notification performance and delivery metrics
                    </Typography>
                    {systemStatsData?.period && (
                        <Typography variant="caption" color="text.secondary">
                            Period: {dayjs(systemStatsData.period.from).format('MMM D, YYYY')} - {dayjs(systemStatsData.period.to).format('MMM D, YYYY')}
                        </Typography>
                    )}
                </Box>
                <Box display="flex" gap={2}>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Time Range</InputLabel>
                        <Select
                            value={timeRange}
                            label="Time Range"
                            onChange={(e) => setTimeRange(e.target.value)}
                            disabled={isLoading}
                        >
                            <MenuItem value="24hours">Last 24 Hours</MenuItem>
                            <MenuItem value="7days">Last 7 Days</MenuItem>
                            <MenuItem value="30days">Last 30 Days</MenuItem>
                            <MenuItem value="90days">Last 90 Days</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={handleRefresh}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Refreshing...' : 'Refresh'}
                    </Button>
                </Box>
            </Box>

            {isLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                    <CircularProgress />
                    <Typography variant="body2" sx={{ ml: 2 }}>
                        Loading analytics data...
                    </Typography>
                </Box>
            ) : (
                <>
                    {/* Stats Cards */}
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                <CardContent>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <Box>
                                            <Typography variant="h4">{totalNotifications}</Typography>
                                            <Typography variant="body2" color="text.secondary">Total Notifications</Typography>
                                        </Box>
                                        <NotificationsIcon color="primary" />
                                    </Box>
                                    <Typography variant="caption" color="text.secondary">
                                        From API: {notificationStatsData?.notifications?.total !== undefined ? 'Yes' : 'No'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                <CardContent>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <Box>
                                            <Typography variant="h4" color="success.main">
                                                {successRate.toFixed(1)}%
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">Success Rate</Typography>
                                        </Box>
                                        <TrendingUpIcon color="success" />
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={successRate}
                                        color="success"
                                        sx={{ mt: 2 }}
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                        From API: {notificationStatsData?.notifications?.successRate !== undefined ? 'Yes' : 'No'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                <CardContent>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <Box>
                                            <Typography variant="h4" color="error.main">
                                                {failureRate.toFixed(1)}%
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">Failure Rate</Typography>
                                        </Box>
                                        <TrendingDownIcon color="error" />
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={failureRate}
                                        color="error"
                                        sx={{ mt: 2 }}
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                        Calculated: {100 - successRate}%
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                <CardContent>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <Box>
                                            <Typography variant="h4" color="info.main">
                                                {systemStatsData?.rules?.active || 0}/{systemStatsData?.rules?.total || 0}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">Active Rules</Typography>
                                        </Box>
                                        <TrendingUpIcon color="info" />
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={systemStatsData?.rules?.total > 0 ?
                                            ((systemStatsData.rules.active / systemStatsData.rules.total) * 100) : 0}
                                        sx={{ mt: 2 }}
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                        From API: {systemStatsData?.rules !== undefined ? 'Yes' : 'No'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Charts */}
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} md={8}>
                            <Card sx={{ height: 400 }}>
                                <CardHeader
                                    title="Notifications Over Time"
                                    subheader="Daily notification volume (Last 7 days)"
                                    action={
                                        <Typography variant="caption" color="text.secondary">
                                            Simulated Data
                                        </Typography>
                                    }
                                />
                                <CardContent sx={{ height: 300 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={barChartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="Sent" fill="#4CAF50" />
                                            <Bar dataKey="Failed" fill="#F44336" />
                                            <Bar dataKey="Read" fill="#2196F3" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Card sx={{ height: 400 }}>
                                <CardHeader
                                    title="Rules by Category"
                                    subheader="Notification rule distribution"
                                    action={
                                        <Typography variant="caption" color="text.secondary">
                                            {systemStatsData?.rules?.byCategory ? 'Real Data' : 'Simulated'}
                                        </Typography>
                                    }
                                />
                                <CardContent sx={{ height: 300 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieChartData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {pieChartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => [`${value} rules`, 'Count']} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Status Breakdown */}
                    <Card sx={{ mb: 4 }}>
                        <CardHeader
                            title="Notifications by Status"
                            subheader="Breakdown of notification delivery status"
                            action={
                                <Typography variant="caption" color="text.secondary">
                                    {notificationStatsData?.notifications?.byStatus ? 'Real Data' : 'Simulated'}
                                </Typography>
                            }
                        />
                        <CardContent>
                            <Grid container spacing={2}>
                                {notificationStatsData?.notifications?.byStatus?.map((status, index) => (
                                    <Grid item xs={12} sm={6} md={3} key={index}>
                                        <Paper variant="outlined" sx={{ p: 2 }}>
                                            <Box display="flex" alignItems="center" gap={2}>
                                                {getStatusIcon(status.status)}
                                                <Box>
                                                    <Typography variant="h6">{status.count}</Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {status.status}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={totalNotifications > 0 ?
                                                    (status.count / totalNotifications) * 100 : 0}
                                                color={getStatusColor(status.status)}
                                                sx={{ mt: 1 }}
                                            />
                                        </Paper>
                                    </Grid>
                                ))}
                                {(!notificationStatsData?.notifications?.byStatus || notificationStatsData.notifications.byStatus.length === 0) && (
                                    <Grid item xs={12}>
                                        <Typography variant="body2" color="text.secondary" align="center">
                                            No status data available
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* System Overview */}
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardHeader title="System Overview" />
                                <CardContent>
                                    <TableContainer>
                                        <Table size="small">
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>Total Rules</TableCell>
                                                    <TableCell align="right">
                                                        <Typography fontWeight="medium">
                                                            {systemOverview.totalRules}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Active Rules</TableCell>
                                                    <TableCell align="right">
                                                        <Chip
                                                            label={systemOverview.activeRules}
                                                            size="small"
                                                            color="success"
                                                            variant="outlined"
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Total Devices</TableCell>
                                                    <TableCell align="right">
                                                        <Typography fontWeight="medium">
                                                            {systemOverview.totalDevices}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Active Devices</TableCell>
                                                    <TableCell align="right">
                                                        <Chip
                                                            label={systemOverview.activeDevices}
                                                            size="small"
                                                            color="success"
                                                            variant="outlined"
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Archived History</TableCell>
                                                    <TableCell align="right">
                                                        <Typography fontWeight="medium">
                                                            {systemOverview.archivedHistory}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Rules by Type</TableCell>
                                                    <TableCell align="right">
                                                        {systemStatsData?.rules?.byType?.map((type, idx) => (
                                                            <Chip
                                                                key={idx}
                                                                label={`${type.type}: ${type.count}`}
                                                                size="small"
                                                                variant="outlined"
                                                                sx={{ ml: 0.5 }}
                                                            />
                                                        )) || 'N/A'}
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardHeader title="Device Platform Breakdown" />
                                <CardContent>
                                    {systemStatsData?.devices?.byPlatform?.length > 0 ? (
                                        <Box>
                                            {systemStatsData.devices.byPlatform.map((platform, index) => (
                                                <Box key={index} mb={2}>
                                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                                        <Typography variant="body2" fontWeight="medium">
                                                            {platform.platform.toUpperCase()}
                                                        </Typography>
                                                        <Box display="flex" gap={1}>
                                                            <Chip
                                                                label={`Total: ${platform.total}`}
                                                                size="small"
                                                                variant="outlined"
                                                            />
                                                            <Chip
                                                                label={`Active: ${platform.active}`}
                                                                size="small"
                                                                color="success"
                                                                variant="outlined"
                                                            />
                                                        </Box>
                                                    </Box>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={systemOverview.totalDevices > 0 ?
                                                            (platform.total / systemOverview.totalDevices) * 100 : 0}
                                                        sx={{ mt: 0.5 }}
                                                    />
                                                </Box>
                                            ))}
                                        </Box>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary" align="center">
                                            No device platform data available
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </>
            )}
        </Box>
    );
};

export default NotificationAnalytics;