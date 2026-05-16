import React, { useState, useMemo } from 'react';
import {
    Box,
    Button,
    Card,
    Chip,
    IconButton,
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Switch,
    FormControlLabel,
    CircularProgress,
    Alert,
    Tooltip,
    InputAdornment,
    Badge,
    Avatar,
    LinearProgress,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    FilterList as FilterIcon,
    Search as SearchIcon,
    Refresh as RefreshIcon,
    PlayArrow as ExecuteIcon,
    Send as TestIcon,
    Visibility as ViewIcon,
    MoreVert as MoreIcon,
    CheckCircle as ActiveIcon,
    Cancel as InactiveIcon,
    Schedule as ScheduleIcon,
    Event as EventIcon,
    Code as CronIcon,
    Settings as ManualIcon,
    Error as ErrorIcon,
    Warning as WarningIcon,
    Info as InfoIcon,
    ArrowUpward as HighPriorityIcon,
    ArrowForward as MediumPriorityIcon,
    ArrowDownward as LowPriorityIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { usePermissions } from '../../../customHook/usePermissions';
import {
    useGetNotificationRulesQuery,
    useDeleteNotificationRuleMutation,
    useActivateNotificationRuleMutation,
    useExecuteNotificationRuleMutation,
} from '../../../store/api/notificationApi';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const NotificationRulesList = () => {
    const navigate = useNavigate();
    const { isAdmin, userRole } = usePermissions();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [deleteDialog, setDeleteDialog] = useState(null);
    const [executeDialog, setExecuteDialog] = useState(null);

    const { data, isLoading, error, refetch } = useGetNotificationRulesQuery();
    const [deleteRule] = useDeleteNotificationRuleMutation();
    const [activateRule] = useActivateNotificationRuleMutation();
    const [executeRule] = useExecuteNotificationRuleMutation();

    const rules = data?.data || [];

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDelete = async () => {
        if (deleteDialog) {
            try {
                await deleteRule(deleteDialog.ruleID).unwrap();
                refetch();
                setDeleteDialog(null);
            } catch (error) {
                console.error('Failed to delete rule:', error);
            }
        }
    };

    const handleActivate = async (ruleId, isActive) => {
        try {
            await activateRule({ id: ruleId, isActive: !isActive }).unwrap();
            refetch();
        } catch (error) {
            console.error('Failed to update rule status:', error);
        }
    };

    const handleExecute = async () => {
        if (executeDialog) {
            try {
                await executeRule(executeDialog.ruleID).unwrap();
                refetch();
                setExecuteDialog(null);
            } catch (error) {
                console.error('Failed to execute rule:', error);
            }
        }
    };

    const filteredRules = useMemo(() => {
        return rules.filter(rule => {
            const matchesSearch =
                rule.ruleName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                rule.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                rule.category?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'all' ||
                (statusFilter === 'active' && rule.isActive) ||
                (statusFilter === 'inactive' && !rule.isActive);

            const matchesType = typeFilter === 'all' || rule.ruleType === typeFilter;
            const matchesCategory = categoryFilter === 'all' || rule.category === categoryFilter;

            return matchesSearch && matchesStatus && matchesType && matchesCategory;
        });
    }, [rules, searchTerm, statusFilter, typeFilter, categoryFilter]);

    const paginatedRules = filteredRules.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const getStatusColor = (isActive) => {
        return isActive ? 'success' : 'error';
    };

    const getStatusIcon = (isActive) => {
        return isActive ? <ActiveIcon fontSize="small" /> : <InactiveIcon fontSize="small" />;
    };

    const getRuleTypeIcon = (type) => {
        switch (type) {
            case 'EVENT': return <EventIcon fontSize="small" />;
            case 'SCHEDULED': return <ScheduleIcon fontSize="small" />;
            case 'CRON': return <CronIcon fontSize="small" />;
            case 'MANUAL': return <ManualIcon fontSize="small" />;
            default: return <EventIcon fontSize="small" />;
        }
    };

    const getRuleTypeColor = (type) => {
        switch (type) {
            case 'EVENT': return 'primary';
            case 'SCHEDULED': return 'info';
            case 'CRON': return 'warning';
            case 'MANUAL': return 'secondary';
            default: return 'default';
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'ATTENDANCE': return 'error';
            case 'FEE': return 'warning';
            case 'EXAM': return 'info';
            case 'GENERAL': return 'success';
            case 'ALERT': return 'error';
            case 'ANNOUNCEMENT': return 'primary';
            default: return 'default';
        }
    };

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 1: return <HighPriorityIcon fontSize="small" />;
            case 2: return <MediumPriorityIcon fontSize="small" />;
            case 3: return <LowPriorityIcon fontSize="small" />;
            default: return <MediumPriorityIcon fontSize="small" />;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 1: return 'error';
            case 2: return 'warning';
            case 3: return 'info';
            default: return 'default';
        }
    };

    const formatLastRun = (lastRunTime) => {
        if (!lastRunTime) return 'Never';
        return dayjs(lastRunTime).fromNow();
    };

    const formatNextRun = (nextRunTime) => {
        if (!nextRunTime) return 'N/A';
        return dayjs(nextRunTime).format('MMM D, h:mm A');
    };

    if (!isAdmin()) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <Alert severity="error" sx={{ maxWidth: 400 }}>
                    <Typography variant="h6">Access Denied</Typography>
                    <Typography>
                        Notification rule management is only available to administrators.
                    </Typography>
                </Alert>
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <Alert severity="error" sx={{ maxWidth: 400 }}>
                    <Typography variant="h6">Error Loading Rules</Typography>
                    <Typography>{error.data?.message || 'Failed to load notification rules'}</Typography>
                    <Button onClick={refetch} sx={{ mt: 2 }}>Retry</Button>
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
            {/* Header */}
            <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }}
                gap={2} mb={4}>
                <Box>
                    <Typography variant="h4" gutterBottom>
                        Notification Rules
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage and configure automated notification rules
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
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/dashboard/notification-rules/create')}
                    >
                        New Rule
                    </Button>
                </Box>
            </Box>

            {/* Stats Cards */}
            <Box display="flex" gap={2} mb={3} flexWrap="wrap">
                <Card sx={{ flex: 1, minWidth: 150 }}>
                    <Box p={2}>
                        <Typography variant="body2" color="text.secondary">
                            Total Rules
                        </Typography>
                        <Typography variant="h4">
                            {rules.length}
                        </Typography>
                    </Box>
                </Card>

                <Card sx={{ flex: 1, minWidth: 150 }}>
                    <Box p={2}>
                        <Typography variant="body2" color="text.secondary">
                            Active
                        </Typography>
                        <Typography variant="h4" color="success.main">
                            {rules.filter(r => r.isActive).length}
                        </Typography>
                    </Box>
                </Card>

                <Card sx={{ flex: 1, minWidth: 150 }}>
                    <Box p={2}>
                        <Typography variant="body2" color="text.secondary">
                            Scheduled
                        </Typography>
                        <Typography variant="h4" color="info.main">
                            {rules.filter(r => r.ruleType === 'SCHEDULED' || r.ruleType === 'CRON').length}
                        </Typography>
                    </Box>
                </Card>

                <Card sx={{ flex: 1, minWidth: 150 }}>
                    <Box p={2}>
                        <Typography variant="body2" color="text.secondary">
                            Events
                        </Typography>
                        <Typography variant="h4" color="primary.main">
                            {rules.filter(r => r.ruleType === 'EVENT').length}
                        </Typography>
                    </Box>
                </Card>
            </Box>

            {/* Filters */}
            <Card sx={{ mb: 3 }}>
                <Box p={3}>
                    <Typography variant="h6" gutterBottom>
                        Filters
                    </Typography>
                    <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} flexWrap="wrap">
                        <TextField
                            placeholder="Search rules..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            size="small"
                            sx={{ minWidth: 250 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" color="action" />
                                    </InputAdornment>
                                ),
                                endAdornment: searchTerm && (
                                    <InputAdornment position="end">
                                        <IconButton size="small" onClick={() => setSearchTerm('')}>
                                            <CancelIcon fontSize="small" />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={statusFilter}
                                label="Status"
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <MenuItem value="all">All Status</MenuItem>
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="inactive">Inactive</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel>Type</InputLabel>
                            <Select
                                value={typeFilter}
                                label="Type"
                                onChange={(e) => setTypeFilter(e.target.value)}
                            >
                                <MenuItem value="all">All Types</MenuItem>
                                <MenuItem value="EVENT">Event</MenuItem>
                                <MenuItem value="SCHEDULED">Scheduled</MenuItem>
                                <MenuItem value="CRON">Cron</MenuItem>
                                <MenuItem value="MANUAL">Manual</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={categoryFilter}
                                label="Category"
                                onChange={(e) => setCategoryFilter(e.target.value)}
                            >
                                <MenuItem value="all">All Categories</MenuItem>
                                <MenuItem value="ATTENDANCE">Attendance</MenuItem>
                                <MenuItem value="FEE">Fee</MenuItem>
                                <MenuItem value="EXAM">Exam</MenuItem>
                                <MenuItem value="GENERAL">General</MenuItem>
                                <MenuItem value="ALERT">Alert</MenuItem>
                                <MenuItem value="ANNOUNCEMENT">Announcement</MenuItem>
                            </Select>
                        </FormControl>

                        <Button
                            variant="outlined"
                            startIcon={<FilterIcon />}
                            onClick={() => {
                                setSearchTerm('');
                                setStatusFilter('all');
                                setTypeFilter('all');
                                setCategoryFilter('all');
                            }}
                        >
                            Clear Filters
                        </Button>
                    </Box>
                </Box>
            </Card>

            {/* Rules Table */}
            <Card>
                {isLoading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        {!isMobile && (
                                            <>
                                                <TableCell>Type</TableCell>
                                                <TableCell>Category</TableCell>
                                                <TableCell>Priority</TableCell>
                                                <TableCell>Last Run</TableCell>
                                                <TableCell>Next Run</TableCell>
                                            </>
                                        )}
                                        <TableCell>Status</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginatedRules.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={isMobile ? 3 : 8} align="center" sx={{ py: 4 }}>
                                                <Box textAlign="center">
                                                    <Typography variant="body1" color="text.secondary" gutterBottom>
                                                        No rules found
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                                                            ? 'Try adjusting your filters'
                                                            : 'Create your first notification rule'}
                                                    </Typography>
                                                    {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
                                                        <Button
                                                            variant="outlined"
                                                            startIcon={<AddIcon />}
                                                            onClick={() => navigate('/dashboard/notification-rules/create')}
                                                            sx={{ mt: 2 }}
                                                        >
                                                            Create Rule
                                                        </Button>
                                                    )}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        paginatedRules.map((rule) => (
                                            <TableRow
                                                key={rule.ruleID}
                                                hover
                                                sx={{
                                                    '&:hover': {
                                                        bgcolor: 'action.hover'
                                                    },
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => navigate(`/dashboard/notification-rules/${rule.ruleID}`)}
                                            >
                                                <TableCell>
                                                    <Box display="flex" flexDirection="column">
                                                        <Typography fontWeight="medium">
                                                            {rule.ruleName}
                                                        </Typography>
                                                        {isMobile && (
                                                            <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
                                                                <Chip
                                                                    label={rule.ruleType}
                                                                    size="small"
                                                                    icon={getRuleTypeIcon(rule.ruleType)}
                                                                    color={getRuleTypeColor(rule.ruleType)}
                                                                />
                                                                <Chip
                                                                    label={rule.category}
                                                                    size="small"
                                                                    color={getCategoryColor(rule.category)}
                                                                />
                                                                <Chip
                                                                    label={`P${rule.priority}`}
                                                                    size="small"
                                                                    icon={getPriorityIcon(rule.priority)}
                                                                    color={getPriorityColor(rule.priority)}
                                                                />
                                                            </Box>
                                                        )}
                                                    </Box>
                                                </TableCell>

                                                {!isMobile && (
                                                    <>
                                                        <TableCell>
                                                            <Chip
                                                                label={rule.ruleType}
                                                                size="small"
                                                                icon={getRuleTypeIcon(rule.ruleType)}
                                                                color={getRuleTypeColor(rule.ruleType)}
                                                                variant="outlined"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={rule.category}
                                                                size="small"
                                                                color={getCategoryColor(rule.category)}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Tooltip title={`Priority ${rule.priority}`}>
                                                                <Chip
                                                                    label={`P${rule.priority}`}
                                                                    size="small"
                                                                    icon={getPriorityIcon(rule.priority)}
                                                                    color={getPriorityColor(rule.priority)}
                                                                />
                                                            </Tooltip>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {formatLastRun(rule.lastRunTime)}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {formatNextRun(rule.nextRunTime)}
                                                            </Typography>
                                                        </TableCell>
                                                    </>
                                                )}

                                                <TableCell>
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        <Tooltip title={rule.isActive ? 'Active' : 'Inactive'}>
                                                            <IconButton
                                                                size="small"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleActivate(rule.ruleID, rule.isActive);
                                                                }}
                                                                color={getStatusColor(rule.isActive)}
                                                            >
                                                                {getStatusIcon(rule.isActive)}
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Switch
                                                            size="small"
                                                            checked={rule.isActive}
                                                            onClick={(e) => e.stopPropagation()}
                                                            onChange={() => handleActivate(rule.ruleID, rule.isActive)}
                                                            color="success"
                                                        />
                                                    </Box>
                                                </TableCell>

                                                <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                                                    <Box display="flex" justifyContent="flex-end" gap={1}>
                                                        <Tooltip title="Edit Rule">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => navigate(`/dashboard/notification-rules/${rule.ruleID}`)}
                                                                color="primary"
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>

                                                        <Tooltip title="Execute Now">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => setExecuteDialog(rule)}
                                                                color="secondary"
                                                            >
                                                                <ExecuteIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>

                                                        <Tooltip title="Delete Rule">
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={() => setDeleteDialog(rule)}
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
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
                            count={filteredRules.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            labelRowsPerPage="Rules per page:"
                            labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
                        />
                    </>
                )}
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteDialog} onClose={() => setDeleteDialog(null)} maxWidth="xs" fullWidth>
                <DialogTitle>Delete Rule</DialogTitle>
                <DialogContent>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <DeleteIcon color="error" />
                        <Typography variant="body1">
                            Are you sure you want to delete "{deleteDialog?.ruleName}"?
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        This action cannot be undone. All related notification history will be removed.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialog(null)}>Cancel</Button>
                    <Button onClick={handleDelete} color="error" variant="contained" autoFocus>
                        Delete Rule
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Execute Confirmation Dialog */}
            <Dialog open={!!executeDialog} onClose={() => setExecuteDialog(null)} maxWidth="xs" fullWidth>
                <DialogTitle>Execute Rule</DialogTitle>
                <DialogContent>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <ExecuteIcon color="primary" />
                        <Typography variant="body1">
                            Execute "{executeDialog?.ruleName}" now?
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        This will trigger the rule immediately and send notifications to all configured recipients.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setExecuteDialog(null)}>Cancel</Button>
                    <Button onClick={handleExecute} color="primary" variant="contained" autoFocus>
                        Execute Now
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default NotificationRulesList;