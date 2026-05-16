import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TextField,
    Typography,
    Alert,
    Tooltip,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    Snackbar,
} from '@mui/material';
import {
    Search as SearchIcon,
    Refresh as RefreshIcon,
    FilterList as FilterIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Category as CategoryIcon,
    Person as PersonIcon,
    Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { usePermissions } from '../../../customHook/usePermissions';
import {
    useGetNotificationHistoryQuery,
    useDeleteNotificationMutation,
} from '../../../store/api/notificationApi';
import dayjs from 'dayjs';

const NotificationHistory = () => {
    const { isAdmin } = usePermissions();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('');
    const [viewDialog, setViewDialog] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    // Get notification history (archived notifications)
    const {
        data: apiResponse,
        isLoading,
        error,
        refetch
    } = useGetNotificationHistoryQuery({
        page: page + 1,
        pageSize: rowsPerPage,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        fromDate: dateFilter ? dayjs(dateFilter).format('YYYY-MM-DD') : undefined,
    });

    const [deleteNotification] = useDeleteNotificationMutation();

    // Debug the API response
    useEffect(() => {
        console.log('🔍 API Response:', apiResponse);
        console.log('📊 Pagination:', apiResponse?.pagination);
    }, [apiResponse]);

    // Extract data from API response - CORRECTED for history structure
    const notifications = apiResponse?.data || [];
    const pagination = apiResponse?.pagination || {};
    const totalCount = pagination.totalCount || 0;

    useEffect(() => {
        if (error) {
            console.error('API Error:', error);
            setSnackbar({
                open: true,
                message: `Error loading notification history: ${error.data?.message || error.message}`,
                severity: 'error'
            });
        }
    }, [error]);

    if (!isAdmin()) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <Alert severity="error" sx={{ maxWidth: 400 }}>
                    <Typography variant="h6">Access Denied</Typography>
                    <Typography>
                        Notification history is only available to administrators.
                    </Typography>
                </Alert>
            </Box>
        );
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleViewDetails = (notification) => {
        setViewDialog(notification);
    };

    const handleDelete = async (historyID) => {
        if (window.confirm('Are you sure you want to delete this archived notification?')) {
            try {
                await deleteNotification(historyID).unwrap();
                setSnackbar({
                    open: true,
                    message: 'Archived notification deleted successfully',
                    severity: 'success'
                });
                refetch();
            } catch (error) {
                console.error('Failed to delete notification:', error);
                setSnackbar({
                    open: true,
                    message: `Failed to delete notification: ${error.data?.message || error.message}`,
                    severity: 'error'
                });
            }
        }
    };

    const getCategoryColor = (category) => {
        switch (category?.toUpperCase()) {
            case 'ATTENDANCE': return 'primary';
            case 'FEE': return 'warning';
            case 'EXAM': return 'error';
            case 'GENERAL': return 'success';
            case 'EVENT': return 'info';
            default: return 'default';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return dayjs(dateString).format('MMM D, YYYY h:mm A');
    };

    // Local filtering for search
    const filteredNotifications = notifications.filter(notification => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (notification.title || '').toLowerCase().includes(searchLower) ||
            (notification.message || '').toLowerCase().includes(searchLower) ||
            (notification.userID?.toString() || '').includes(searchTerm) ||
            (notification.historyID?.toString() || '').includes(searchTerm) ||
            (notification.ruleID?.toString() || '').includes(searchTerm)
        );
    });

    // Extract unique categories for filter
    const categories = ['all', ...new Set(notifications.map(n => n.category).filter(Boolean))];

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setCategoryFilter('all');
        setDateFilter('');
        setPage(0);
    };

    return (
        <Box>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={snackbar.message}
                severity={snackbar.severity}
            />

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                    <Typography variant="h4" gutterBottom>
                        Archived Notifications
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        View archived notification history
                    </Typography>
                </Box>
                <Box display="flex" gap={2}>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={() => refetch()}
                        disabled={isLoading}
                    >
                        Refresh
                    </Button>
                </Box>
            </Box>

            {/* API Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    <Typography variant="body2">
                        Error loading notification history: {error.data?.message || error.message}
                    </Typography>
                </Alert>
            )}

            {/* API Info Alert */}
            {apiResponse && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                        Showing {notifications.length} of {totalCount} archived notifications
                    </Typography>
                    {pagination.page && (
                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                            Page {pagination.page} of {pagination.totalPages || 1}
                        </Typography>
                    )}
                </Alert>
            )}

            {/* Filters */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                placeholder="Search by title, message, user ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                size="small"
                                InputProps={{
                                    startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
                                }}
                                disabled={isLoading}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth size="small" disabled={isLoading}>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={categoryFilter}
                                    label="Category"
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                >
                                    <MenuItem value="all">All Categories</MenuItem>
                                    {categories.filter(c => c !== 'all').map(category => (
                                        <MenuItem key={category} value={category}>
                                            {category}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Archived After"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                size="small"
                                InputLabelProps={{ shrink: true }}
                                disabled={isLoading}
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<FilterIcon />}
                                onClick={handleClearFilters}
                                disabled={isLoading}
                            >
                                Clear Filters
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Stats */}
            <Grid container spacing={2} mb={3}>
                <Grid item xs={6} sm={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center', p: 2 }}>
                            <Typography variant="h5" color="primary.main">
                                {totalCount}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">Total Archived</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center', p: 2 }}>
                            <Typography variant="h5" color="success.main">
                                {notifications.filter(n => n.category === 'ATTENDANCE').length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">Attendance</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center', p: 2 }}>
                            <Typography variant="h5" color="warning.main">
                                {notifications.filter(n => n.category === 'FEE').length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">Fee</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center', p: 2 }}>
                            <Typography variant="h5" color="info.main">
                                {notifications.filter(n => n.category === 'GENERAL').length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">General</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Notifications Table */}
            <Card>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>User ID</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Sent Time</TableCell>
                                <TableCell>Archived Date</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7}>
                                        <Box display="flex" justifyContent="center" p={3}>
                                            <CircularProgress />
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : filteredNotifications.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            {searchTerm || dateFilter || categoryFilter !== 'all'
                                                ? 'No archived notifications match your filters'
                                                : 'No archived notifications found'}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredNotifications.map((notification) => (
                                    <TableRow
                                        key={notification.historyID}
                                        hover
                                    >
                                        <TableCell>
                                            <Typography variant="body2">
                                                #{notification.historyID}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Rule: {notification.ruleID}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="medium">
                                                {notification.title || 'Untitled Notification'}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                {(notification.message || '').substring(0, 60)}...
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <PersonIcon fontSize="small" color="action" />
                                                <Typography variant="body2">
                                                    {notification.userID || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                icon={<CategoryIcon />}
                                                label={notification.category || 'UNCATEGORIZED'}
                                                size="small"
                                                color={getCategoryColor(notification.category)}
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <ScheduleIcon fontSize="small" color="action" />
                                                <Typography variant="body2">
                                                    {formatDate(notification.sentTime)}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {formatDate(notification.archivedDate)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="View Details">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleViewDetails(notification)}
                                                >
                                                    <ViewIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete from Archive">
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDelete(notification.historyID)}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={totalCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    disabled={isLoading}
                />
            </Card>

            {/* View Details Dialog */}
            <Dialog
                open={!!viewDialog}
                onClose={() => setViewDialog(null)}
                maxWidth="md"
                fullWidth
            >
                {viewDialog && (
                    <>
                        <DialogTitle>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Typography variant="h6">Archived Notification Details</Typography>
                                <Chip
                                    icon={<CategoryIcon />}
                                    label={viewDialog.category || 'UNCATEGORIZED'}
                                    color={getCategoryColor(viewDialog.category)}
                                    size="small"
                                />
                            </Box>
                        </DialogTitle>
                        <DialogContent>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        History ID
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        #{viewDialog.historyID}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Rule ID
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {viewDialog.ruleID}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        User ID
                                    </Typography>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <PersonIcon fontSize="small" color="action" />
                                        <Typography variant="body1" gutterBottom>
                                            {viewDialog.userID}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Category
                                    </Typography>
                                    <Chip
                                        icon={<CategoryIcon />}
                                        label={viewDialog.category}
                                        color={getCategoryColor(viewDialog.category)}
                                        size="small"
                                        sx={{ mt: 0.5 }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Title
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {viewDialog.title}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Message
                                    </Typography>
                                    <Paper variant="outlined" sx={{ p: 2, mt: 1, bgcolor: 'grey.50' }}>
                                        <Typography style={{ whiteSpace: 'pre-wrap' }}>
                                            {viewDialog.message}
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Sent Time
                                    </Typography>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <ScheduleIcon fontSize="small" color="action" />
                                        <Typography variant="body1">
                                            {formatDate(viewDialog.sentTime)}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Archived Date
                                    </Typography>
                                    <Typography variant="body1">
                                        {formatDate(viewDialog.archivedDate)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setViewDialog(null)}>Close</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

export default NotificationHistory;