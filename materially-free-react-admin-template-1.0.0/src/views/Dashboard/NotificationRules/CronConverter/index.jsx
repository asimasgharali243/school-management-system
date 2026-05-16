// src/components/CronConverter/index.jsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Button,
    Paper,
    Alert,
    Chip,
    Divider,
    Stack,
    IconButton,
    Tooltip,
    FormControlLabel,
    Switch,
    Collapse,
    Radio,
    RadioGroup,
    FormLabel,
    InputAdornment,
    LinearProgress,
} from '@mui/material';
import {
    AccessTime as TimeIcon,
    DateRange as DateIcon,
    Refresh as RefreshIcon,
    ContentCopy as CopyIcon,
    Check as CheckIcon,
    Info as InfoIcon,
    Schedule as ScheduleIcon,
    CalendarMonth as CalendarIcon,
    ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';
import { dateToCron, parseCronToText, isValidCron, getNextRunTime, generateSchedulePreview } from '../../utils/cronConverter';

const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
    '& .react-datepicker-wrapper': {
        width: '100%',
    },
    '& .react-datepicker__input-container': {
        width: '100%',
    },
    '& .react-datepicker__input-container input': {
        width: '100%',
        padding: '16.5px 14px',
        border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)'}`,
        borderRadius: '4px',
        fontFamily: 'inherit',
        fontSize: '1rem',
        '&:hover': {
            borderColor: theme.palette.text.primary,
        },
        '&:focus': {
            borderColor: theme.palette.primary.main,
            borderWidth: '2px',
            outline: 'none',
        },
    },
}));

const CronConverter = ({ value, onChange, disabled = false, label = "Schedule Configuration" }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [frequency, setFrequency] = useState('daily');
    const [customInterval, setCustomInterval] = useState(1);
    const [intervalUnit, setIntervalUnit] = useState('hours');
    const [generatedCron, setGeneratedCron] = useState(value || '0 9 * * *');
    const [copied, setCopied] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [manualCron, setManualCron] = useState(value || '');
    const [validationError, setValidationError] = useState('');

    const frequencies = [
        { value: 'once', label: 'Once at specific time', description: 'Runs only once at the specified date and time' },
        { value: 'daily', label: 'Daily', description: 'Runs every day at the specified time' },
        { value: 'weekly', label: 'Weekly', description: 'Runs every week on the selected day and time' },
        { value: 'monthly', label: 'Monthly', description: 'Runs every month on the selected day and time' },
        { value: 'yearly', label: 'Yearly', description: 'Runs every year on the selected date and time' },
        { value: 'hourly', label: 'Hourly', description: 'Runs every hour at the specified minute' },
        { value: 'every_minute', label: 'Every Minute', description: 'Runs every minute' },
        { value: 'custom', label: 'Custom Interval', description: 'Custom interval (every X minutes/hours/days)' },
    ];

    const presets = [
        { label: 'Daily at 9 AM', cron: '0 9 * * *' },
        { label: 'Daily at midnight', cron: '0 0 * * *' },
        { label: 'Every Monday at 9 AM', cron: '0 9 * * 1' },
        { label: '1st of every month', cron: '0 0 1 * *' },
        { label: 'Every hour', cron: '0 * * * *' },
        { label: 'Every 30 minutes', cron: '*/30 * * * *' },
        { label: 'Every 2 hours', cron: '0 */2 * * *' },
        { label: 'Weekdays at 9 AM', cron: '0 9 * * 1-5' },
        { label: 'Weekends at 10 AM', cron: '0 10 * * 6,0' },
        { label: 'Monthly on 15th at 2 PM', cron: '0 14 15 * *' },
    ];

    // Initialize with current value
    useEffect(() => {
        if (value && isValidCron(value)) {
            setGeneratedCron(value);
            setManualCron(value);
            // Try to guess frequency from cron
            guessFrequencyFromCron(value);
        }
    }, [value]);

    const guessFrequencyFromCron = (cron) => {
        const [minute, hour, day, month, dayOfWeek] = cron.split(' ');

        if (cron === '* * * * *') {
            setFrequency('every_minute');
        } else if (minute === '0' && hour === '0' && day === '1' && month === '*') {
            setFrequency('monthly');
        } else if (minute === '0' && hour === '0' && day === '1' && month === '1') {
            setFrequency('yearly');
        } else if (dayOfWeek !== '*' && day === '*') {
            setFrequency('weekly');
        } else if (minute !== '*' && hour !== '*' && day === '*' && month === '*') {
            setFrequency('daily');
        } else if (hour.startsWith('*/') && minute === '0') {
            setFrequency('custom');
            const interval = hour.substring(2);
            setCustomInterval(parseInt(interval));
            setIntervalUnit('hours');
        } else if (minute.startsWith('*/')) {
            setFrequency('custom');
            const interval = minute.substring(2);
            setCustomInterval(parseInt(interval));
            setIntervalUnit('minutes');
        }
    };

    const generateCron = () => {
        try {
            const date = selectedDate;
            let cron;

            if (frequency === 'custom') {
                cron = dateToCron(date, 'custom', {
                    interval: customInterval,
                    unit: intervalUnit
                });
            } else {
                cron = dateToCron(date, frequency);
            }

            setGeneratedCron(cron);
            setManualCron(cron);
            setValidationError('');

            if (onChange) {
                onChange(cron);
            }
        } catch (error) {
            console.error('Error generating cron:', error);
            setValidationError('Failed to generate cron expression');
        }
    };

    const handlePresetClick = (cron) => {
        setGeneratedCron(cron);
        setManualCron(cron);
        setValidationError('');
        guessFrequencyFromCron(cron);

        if (onChange) {
            onChange(cron);
        }
    };

    const handleManualCronChange = (e) => {
        const cron = e.target.value;
        setManualCron(cron);

        if (cron && isValidCron(cron)) {
            setGeneratedCron(cron);
            setValidationError('');
            guessFrequencyFromCron(cron);

            if (onChange) {
                onChange(cron);
            }
        } else if (cron) {
            setValidationError('Invalid cron format. Must be 5 parts: minute hour day month day-of-week');
        } else {
            setValidationError('');
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedCron).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const formatDateTime = () => {
        return dayjs(selectedDate).format('dddd, MMMM D, YYYY [at] h:mm A');
    };

    const getSchedulePreviews = () => {
        if (!isValidCron(generatedCron)) return [];
        return generateSchedulePreview(generatedCron, 3);
    };

    const schedulePreviews = getSchedulePreviews();
    const nextRunTime = getNextRunTime(generatedCron);
    const humanReadable = parseCronToText(generatedCron);

    return (
        <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <ScheduleIcon color="primary" />
                    <Typography variant="h6">{label}</Typography>
                </Box>

                <Grid container spacing={3}>
                    {/* Left Column - Configuration */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2, height: '100%', bgcolor: 'grey.50' }}>
                            <Typography variant="subtitle2" gutterBottom color="text.secondary">
                                Configure Schedule
                            </Typography>

                            {/* Frequency Selection */}
                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel>Frequency</InputLabel>
                                <Select
                                    value={frequency}
                                    label="Frequency"
                                    onChange={(e) => setFrequency(e.target.value)}
                                    disabled={disabled}
                                >
                                    {frequencies.map((freq) => (
                                        <MenuItem key={freq.value} value={freq.value}>
                                            <Box>
                                                <Typography>{freq.label}</Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {freq.description}
                                                </Typography>
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Date Time Picker */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body2" gutterBottom>
                                    Select Date & Time
                                </Typography>
                                <StyledDatePicker
                                    selected={selectedDate}
                                    onChange={(date) => setSelectedDate(date)}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    dateFormat="MMMM d, yyyy h:mm aa"
                                    disabled={disabled || frequency === 'every_minute'}
                                    customInput={
                                        <TextField
                                            fullWidth
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <DateIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    }
                                />
                            </Box>

                            {/* Custom Interval Options */}
                            {frequency === 'custom' && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="body2" gutterBottom>
                                        Custom Interval
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <TextField
                                                fullWidth
                                                label="Interval"
                                                type="number"
                                                value={customInterval}
                                                onChange={(e) => setCustomInterval(e.target.value)}
                                                InputProps={{ inputProps: { min: 1, max: 59 } }}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormControl fullWidth>
                                                <InputLabel>Unit</InputLabel>
                                                <Select
                                                    value={intervalUnit}
                                                    label="Unit"
                                                    onChange={(e) => setIntervalUnit(e.target.value)}
                                                >
                                                    <MenuItem value="minutes">Minutes</MenuItem>
                                                    <MenuItem value="hours">Hours</MenuItem>
                                                    <MenuItem value="days">Days</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}

                            {/* Generate Button */}
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={generateCron}
                                disabled={disabled}
                                startIcon={<RefreshIcon />}
                                sx={{ mt: 2 }}
                            >
                                Generate Cron Expression
                            </Button>

                            {/* Quick Presets */}
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="body2" gutterBottom color="text.secondary">
                                    Quick Presets:
                                </Typography>
                                <Box display="flex" flexWrap="wrap" gap={1}>
                                    {presets.map((preset) => (
                                        <Chip
                                            key={preset.cron}
                                            label={preset.label}
                                            size="small"
                                            onClick={() => handlePresetClick(preset.cron)}
                                            variant="outlined"
                                            sx={{ cursor: 'pointer', mb: 0.5 }}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Right Column - Results */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2, height: '100%' }}>
                            <Typography variant="subtitle2" gutterBottom color="text.secondary">
                                Generated Cron Expression
                            </Typography>

                            {/* Cron Display */}
                            <Paper
                                sx={{
                                    p: 2,
                                    bgcolor: 'primary.50',
                                    mb: 2,
                                    border: '1px solid',
                                    borderColor: 'primary.100',
                                    borderRadius: 1,
                                    position: 'relative',
                                }}
                            >
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Typography
                                        variant="h6"
                                        fontFamily="monospace"
                                        color="primary.main"
                                        sx={{ wordBreak: 'break-all' }}
                                    >
                                        {generatedCron}
                                    </Typography>
                                    <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
                                        <IconButton
                                            size="small"
                                            onClick={copyToClipboard}
                                            color={copied ? "success" : "primary"}
                                        >
                                            {copied ? <CheckIcon /> : <CopyIcon />}
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Paper>

                            {/* Human Readable Description */}
                            <Alert
                                severity="info"
                                icon={<InfoIcon />}
                                sx={{ mb: 2 }}
                            >
                                <Box>
                                    <Typography variant="body2" fontWeight="medium">
                                        {humanReadable}
                                    </Typography>
                                    {frequency !== 'every_minute' && frequency !== 'once' && (
                                        <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                                            Based on: {formatDateTime()}
                                        </Typography>
                                    )}
                                </Box>
                            </Alert>

                            {/* Next Run Time */}
                            {nextRunTime && (
                                <Alert
                                    severity="success"
                                    sx={{ mb: 2 }}
                                    icon={<ArrowForwardIcon />}
                                >
                                    <Typography variant="body2">
                                        Next run: {dayjs(nextRunTime).format('dddd, MMMM D, YYYY [at] h:mm A')}
                                    </Typography>
                                </Alert>
                            )}

                            {/* Schedule Previews */}
                            {schedulePreviews.length > 0 && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                        Upcoming runs:
                                    </Typography>
                                    <Stack spacing={0.5}>
                                        {schedulePreviews.map((time, index) => (
                                            <Box
                                                key={index}
                                                display="flex"
                                                alignItems="center"
                                                gap={1}
                                                sx={{ px: 1, py: 0.5 }}
                                            >
                                                <TimeIcon fontSize="small" color="action" />
                                                <Typography variant="caption">
                                                    {dayjs(time).format('MMM D, h:mm A')}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Box>
                            )}

                            {/* Validation Status */}
                            <Box sx={{ mb: 2 }}>
                                {isValidCron(generatedCron) ? (
                                    <Alert severity="success" icon={<CheckIcon />}>
                                        Valid cron expression
                                    </Alert>
                                ) : (
                                    <Alert severity="error">
                                        Invalid cron expression
                                    </Alert>
                                )}
                            </Box>

                            {/* Advanced Manual Input */}
                            <Box>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            size="small"
                                            checked={showAdvanced}
                                            onChange={() => setShowAdvanced(!showAdvanced)}
                                        />
                                    }
                                    label="Advanced: Edit manually"
                                />

                                <Collapse in={showAdvanced}>
                                    <Box sx={{ mt: 2 }}>
                                        <TextField
                                            fullWidth
                                            label="Manual Cron Expression"
                                            value={manualCron}
                                            onChange={handleManualCronChange}
                                            placeholder="e.g., 0 9 * * *"
                                            error={!!validationError}
                                            helperText={validationError || 'Format: minute hour day-of-month month day-of-week'}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <TimeIcon sx={{ color: 'action.active' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                            Examples:
                                            <br />• Daily at 9 AM: "0 9 * * *"
                                            <br />• Every Monday at 2 PM: "0 14 * * 1"
                                            <br />• Every 30 minutes: "*/30 * * * *"
                                            <br />• 1st of every month: "0 0 1 * *"
                                        </Typography>
                                    </Box>
                                </Collapse>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Cron Explanation */}
                <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Cron Format:</strong> minute(0-59) hour(0-23) day-of-month(1-31) month(1-12) day-of-week(0-6, 0=Sunday)
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        * = any value, */n = every n units, 1-5 = range, 1,3,5 = list
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default CronConverter;