
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Dimensions,
    Modal,
    FlatList,
    Platform,
    Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { selectThemeData } from '../../store/slices/themeSlice';
import { useGetChildAttendanceHistoryQuery } from '../../store/attendanceApi';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width } = Dimensions.get('window');

const ChildAttendanceHistoryScreen = ({ route, navigation }) => {
    const theme = useSelector(selectThemeData);
    const { childId, childName } = route.params;

    const [refreshing, setRefreshing] = useState(false);
    const [attendanceHistory, setAttendanceHistory] = useState([]);
    const [filteredHistory, setFilteredHistory] = useState([]);
    const [overallStats, setOverallStats] = useState({
        totalDays: 0,
        presentDays: 0,
        absentDays: 0,
        lateDays: 0,
        leaveDays: 0,
        presentPercentage: 0,
        currentStreak: 0,
        longestStreak: 0,
        bestMonth: 'N/A',
        worstMonth: 'N/A'
    });
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [dateFrom, setDateFrom] = useState(null);
    const [dateTo, setDateTo] = useState(null);
    const [showDateFromPicker, setShowDateFromPicker] = useState(false);
    const [showDateToPicker, setShowDateToPicker] = useState(false);

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
    const statuses = [
        { id: 'all', label: 'All Status' },
        { id: 'present', label: 'Present' },
        { id: 'absent', label: 'Absent' },
        { id: 'late', label: 'Late' },
        { id: 'leave', label: 'Leave' },
    ];

    // API Query
    const {
        data: attendanceResponse,
        isLoading,
        isFetching,
        error,
        refetch
    } = useGetChildAttendanceHistoryQuery({
        childId,
        filters: {
            month: selectedMonth + 1,
            year: selectedYear
        }
    });

    // Debug logging
    useEffect(() => {
        console.log('🔍 API State:', {
            isLoading,
            isFetching,
            error: error ? 'Error exists' : 'No error',
            hasResponse: !!attendanceResponse,
            responseSuccess: attendanceResponse?.success
        });
    }, [isLoading, isFetching, error, attendanceResponse]);

    // Process API response
    useEffect(() => {
        console.log('📊 Processing API response...');

        if (attendanceResponse) {
            console.log('📊 API Response:', attendanceResponse);

            if (attendanceResponse.success === true) {
                const responseData = attendanceResponse.data;

                // Extract history from different possible structures
                let history = [];
                if (responseData && responseData.history && Array.isArray(responseData.history)) {
                    history = responseData.history;
                } else if (Array.isArray(responseData)) {
                    history = responseData;
                } else if (responseData && responseData.data && Array.isArray(responseData.data)) {
                    history = responseData.data;
                }

                console.log('📊 Extracted history:', history.length, 'records');
                processAttendanceData(history);
            } else if (attendanceResponse.success === false) {
                console.error('❌ API returned error:', attendanceResponse.error);
                Alert.alert('Error', attendanceResponse.error || 'Failed to load attendance data');
                resetData();
            } else {
                // If response doesn't have success property, try to process it directly
                console.log('⚠️ Response format different, trying to process directly');
                processAttendanceData(attendanceResponse);
            }
        } else if (error) {
            console.error('❌ RTK Query error:', error);
            Alert.alert('Error', 'Network error occurred. Please check your connection.');
            resetData();
        }
    }, [attendanceResponse, error]);

    // Apply filters when data or filters change
    useEffect(() => {
        applyFilters();
    }, [attendanceHistory, selectedStatus, dateFrom, dateTo]);

    const resetData = () => {
        setAttendanceHistory([]);
        setFilteredHistory([]);
        setOverallStats({
            totalDays: 0,
            presentDays: 0,
            absentDays: 0,
            lateDays: 0,
            leaveDays: 0,
            presentPercentage: 0,
            currentStreak: 0,
            longestStreak: 0,
            bestMonth: 'N/A',
            worstMonth: 'N/A'
        });
    };

    const processAttendanceData = (rawData) => {
        try {
            console.log('📈 Processing raw data:', rawData);

            // Handle different data structures
            let history = [];
            if (Array.isArray(rawData)) {
                history = rawData;
            } else if (rawData && typeof rawData === 'object') {
                // Try common data structures
                if (Array.isArray(rawData.history)) {
                    history = rawData.history;
                } else if (Array.isArray(rawData.data)) {
                    history = rawData.data;
                } else if (Array.isArray(rawData.records)) {
                    history = rawData.records;
                } else if (rawData.History && Array.isArray(rawData.History)) {
                    history = rawData.History;
                }
            }

            console.log('📈 Processed history:', history.length, 'records');

            // Validate and format data
            const validatedHistory = history.map(record => ({
                ...record,
                date: record.date || '',
                status: record.status || 'unknown',
                lateStatus: record.lateStatus || '',
                remarks: record.remarks || ''
            }));

            setAttendanceHistory(validatedHistory);
            setFilteredHistory(validatedHistory);

            // Calculate statistics
            if (validatedHistory.length > 0) {
                const totalDays = validatedHistory.length;
                const presentDays = validatedHistory.filter(day => {
                    const status = (day.status || '').toLowerCase();
                    return status === 'present' || status === 'p';
                }).length;

                const absentDays = validatedHistory.filter(day => {
                    const status = (day.status || '').toLowerCase();
                    return status === 'absent' || status === 'a';
                }).length;

                const lateDays = validatedHistory.filter(day => {
                    const status = (day.status || '').toLowerCase();
                    const lateStatus = (day.lateStatus || '').toLowerCase();
                    return status === 'late' || status === 'l' || lateStatus === 'late';
                }).length;

                const leaveDays = validatedHistory.filter(day => {
                    const status = (day.status || '').toLowerCase();
                    return status === 'leave';
                }).length;

                const presentPercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

                setOverallStats({
                    totalDays,
                    presentDays,
                    absentDays,
                    lateDays,
                    leaveDays,
                    presentPercentage,
                    currentStreak: calculateCurrentStreak(validatedHistory),
                    longestStreak: calculateLongestStreak(validatedHistory),
                    bestMonth: getBestMonth(validatedHistory),
                    worstMonth: getWorstMonth(validatedHistory)
                });

                console.log('📊 Calculated stats:', {
                    totalDays,
                    presentDays,
                    absentDays,
                    presentPercentage
                });
            } else {
                console.log('📊 No attendance records found');
                resetData();
            }
        } catch (error) {
            console.error('❌ Error processing data:', error);
            Alert.alert('Error', 'Failed to process attendance data. Please try again.');
            resetData();
        }
    };

    const applyFilters = () => {
        let filtered = [...attendanceHistory];

        // Filter by status
        if (selectedStatus !== 'all') {
            filtered = filtered.filter(day => {
                const status = (day.status || '').toLowerCase();
                return status === selectedStatus;
            });
        }

        // Filter by date range
        if (dateFrom) {
            const fromDate = new Date(dateFrom);
            fromDate.setHours(0, 0, 0, 0);
            filtered = filtered.filter(day => {
                if (!day.date) return false;
                try {
                    const dayDate = new Date(day.date);
                    if (isNaN(dayDate.getTime())) return false;
                    dayDate.setHours(0, 0, 0, 0);
                    return dayDate >= fromDate;
                } catch {
                    return false;
                }
            });
        }

        if (dateTo) {
            const toDate = new Date(dateTo);
            toDate.setHours(23, 59, 59, 999);
            filtered = filtered.filter(day => {
                if (!day.date) return false;
                try {
                    const dayDate = new Date(day.date);
                    if (isNaN(dayDate.getTime())) return false;
                    dayDate.setHours(0, 0, 0, 0);
                    return dayDate <= toDate;
                } catch {
                    return false;
                }
            });
        }

        console.log('🔍 Filters applied:', {
            original: attendanceHistory.length,
            filtered: filtered.length,
            selectedStatus
        });

        setFilteredHistory(filtered);
    };

    const getBestMonth = (history) => {
        try {
            const monthStats = {};
            history.forEach(day => {
                if (day.date) {
                    try {
                        const date = new Date(day.date);
                        if (!isNaN(date.getTime())) {
                            const monthYear = `${date.getMonth()}-${date.getFullYear()}`;
                            if (!monthStats[monthYear]) {
                                monthStats[monthYear] = { present: 0, total: 0 };
                            }
                            monthStats[monthYear].total++;

                            const status = (day.status || '').toLowerCase();
                            if (status === 'present' || status === 'p') {
                                monthStats[monthYear].present++;
                            }
                        }
                    } catch (error) {
                        console.warn('Invalid date:', day.date);
                    }
                }
            });

            let bestMonth = 'N/A';
            let bestPercentage = 0;

            Object.entries(monthStats).forEach(([monthYear, stats]) => {
                const percentage = stats.total > 0 ? (stats.present / stats.total) * 100 : 0;
                if (percentage > bestPercentage) {
                    bestPercentage = percentage;
                    const [month, year] = monthYear.split('-');
                    bestMonth = `${months[parseInt(month)]} ${year}`;
                }
            });

            return bestMonth;
        } catch (error) {
            console.error('Error calculating best month:', error);
            return 'N/A';
        }
    };

    const getWorstMonth = (history) => {
        try {
            const monthStats = {};
            history.forEach(day => {
                if (day.date) {
                    try {
                        const date = new Date(day.date);
                        if (!isNaN(date.getTime())) {
                            const monthYear = `${date.getMonth()}-${date.getFullYear()}`;
                            if (!monthStats[monthYear]) {
                                monthStats[monthYear] = { present: 0, total: 0 };
                            }
                            monthStats[monthYear].total++;

                            const status = (day.status || '').toLowerCase();
                            if (status === 'present' || status === 'p') {
                                monthStats[monthYear].present++;
                            }
                        }
                    } catch (error) {
                        console.warn('Invalid date:', day.date);
                    }
                }
            });

            let worstMonth = 'N/A';
            let worstPercentage = 100;

            Object.entries(monthStats).forEach(([monthYear, stats]) => {
                const percentage = stats.total > 0 ? (stats.present / stats.total) * 100 : 0;
                if (percentage < worstPercentage) {
                    worstPercentage = percentage;
                    const [month, year] = monthYear.split('-');
                    worstMonth = `${months[parseInt(month)]} ${year}`;
                }
            });

            return worstMonth;
        } catch (error) {
            console.error('Error calculating worst month:', error);
            return 'N/A';
        }
    };

    const calculateCurrentStreak = (history) => {
        try {
            let streak = 0;
            const today = new Date();
            today.setHours(23, 59, 59, 999);

            // Get valid dates sorted in descending order
            const sortedHistory = [...history]
                .filter(day => day.date)
                .map(day => {
                    try {
                        const parsedDate = new Date(day.date);
                        return isNaN(parsedDate.getTime()) ? null : { ...day, parsedDate };
                    } catch {
                        return null;
                    }
                })
                .filter(day => day && day.parsedDate <= today)
                .sort((a, b) => b.parsedDate - a.parsedDate);

            for (const day of sortedHistory) {
                const status = (day.status || '').toLowerCase();
                if (status === 'present' || status === 'p') {
                    streak++;
                } else {
                    break;
                }
            }

            return streak;
        } catch (error) {
            console.error('Error calculating current streak:', error);
            return 0;
        }
    };

    const calculateLongestStreak = (history) => {
        try {
            let longest = 0;
            let current = 0;

            // Get valid dates sorted in ascending order
            const sortedHistory = [...history]
                .filter(day => day.date)
                .map(day => {
                    try {
                        const parsedDate = new Date(day.date);
                        return isNaN(parsedDate.getTime()) ? null : { ...day, parsedDate };
                    } catch {
                        return null;
                    }
                })
                .filter(day => day !== null)
                .sort((a, b) => a.parsedDate - b.parsedDate);

            for (const day of sortedHistory) {
                const status = (day.status || '').toLowerCase();
                if (status === 'present' || status === 'p') {
                    current++;
                    longest = Math.max(longest, current);
                } else {
                    current = 0;
                }
            }

            return longest;
        } catch (error) {
            console.error('Error calculating longest streak:', error);
            return 0;
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            console.log('🔄 Refreshing data...');
            await refetch();
        } catch (error) {
            console.error('Refresh error:', error);
        }
        setRefreshing(false);
    };

    const getStatusColor = (status) => {
        const statusLower = (status || '').toLowerCase();
        switch (statusLower) {
            case 'present':
            case 'p': return theme.success || '#4CAF50';
            case 'absent':
            case 'a': return theme.error || '#F44336';
            case 'late':
            case 'l': return theme.warning || '#FF9800';
            case 'leave': return theme.info || '#2196F3';
            default: return theme.textSecondary || '#9E9E9E';
        }
    };

    const getStatusIcon = (status) => {
        const statusLower = (status || '').toLowerCase();
        switch (statusLower) {
            case 'present':
            case 'p': return 'check-circle';
            case 'absent':
            case 'a': return 'close-circle';
            case 'late':
            case 'l': return 'clock-alert';
            case 'leave': return 'account-arrow-right';
            default: return 'help-circle';
        }
    };

    const getStatusText = (status) => {
        const statusLower = (status || '').toLowerCase();
        switch (statusLower) {
            case 'present':
            case 'p': return 'Present';
            case 'absent':
            case 'a': return 'Absent';
            case 'late':
            case 'l': return 'Late';
            case 'leave': return 'Leave';
            default: return 'Unknown';
        }
    };

    const handleDateFromChange = (event, selectedDate) => {
        setShowDateFromPicker(Platform.OS === 'ios');
        if (selectedDate) {
            setDateFrom(selectedDate);
        }
    };

    const handleDateToChange = (event, selectedDate) => {
        setShowDateToPicker(Platform.OS === 'ios');
        if (selectedDate) {
            setDateTo(selectedDate);
        }
    };

    const handleResetFilters = () => {
        setSelectedStatus('all');
        setDateFrom(null);
        setDateTo(null);
        setSelectedMonth(new Date().getMonth());
        setSelectedYear(new Date().getFullYear());
    };

    const handleApplyFilters = () => {
        applyFilters();
        setShowFilterModal(false);
    };

    const formatDate = (dateString) => {
        try {
            if (!dateString) return 'No date';
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid Date';

            return date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    const getDayName = (dateString) => {
        try {
            if (!dateString) return '';
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '';

            return date.toLocaleDateString('en-US', { weekday: 'long' });
        } catch (error) {
            return '';
        }
    };

    const renderFilterModal = () => (
        <Modal
            visible={showFilterModal}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowFilterModal(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: theme.background || '#FFFFFF' }]}>
                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, { color: theme.text || '#000000' }]}>
                            Filter Attendance
                        </Text>
                        <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                            <Icon name="close" size={24} color={theme.text || '#000000'} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.filterContent} showsVerticalScrollIndicator={false}>
                        {/* Month Selection */}
                        <View style={[styles.filterSection, { backgroundColor: theme.card || '#F5F5F5' }]}>
                            <Text style={[styles.filterSectionTitle, { color: theme.text || '#000000' }]}>
                                Select Month
                            </Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {months.map((month, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.monthButton,
                                            {
                                                backgroundColor: selectedMonth === index
                                                    ? (theme.primary || '#3F51B5')
                                                    : (theme.card || '#F5F5F5'),
                                                borderColor: selectedMonth === index
                                                    ? (theme.primary || '#3F51B5')
                                                    : (theme.border || '#E0E0E0')
                                            }
                                        ]}
                                        onPress={() => setSelectedMonth(index)}
                                    >
                                        <Text style={[
                                            styles.monthButtonText,
                                            {
                                                color: selectedMonth === index
                                                    ? '#FFFFFF'
                                                    : (theme.text || '#000000')
                                            }
                                        ]}>
                                            {month.substring(0, 3)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Year Selection */}
                        <View style={[styles.filterSection, { backgroundColor: theme.card || '#F5F5F5' }]}>
                            <Text style={[styles.filterSectionTitle, { color: theme.text || '#000000' }]}>
                                Select Year
                            </Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {years.map((year) => (
                                    <TouchableOpacity
                                        key={year}
                                        style={[
                                            styles.yearButton,
                                            {
                                                backgroundColor: selectedYear === year
                                                    ? (theme.primary || '#3F51B5')
                                                    : (theme.card || '#F5F5F5'),
                                                borderColor: selectedYear === year
                                                    ? (theme.primary || '#3F51B5')
                                                    : (theme.border || '#E0E0E0')
                                            }
                                        ]}
                                        onPress={() => setSelectedYear(year)}
                                    >
                                        <Text style={[
                                            styles.yearButtonText,
                                            {
                                                color: selectedYear === year
                                                    ? '#FFFFFF'
                                                    : (theme.text || '#000000')
                                            }
                                        ]}>
                                            {year}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Status Filter */}
                        <View style={[styles.filterSection, { backgroundColor: theme.card || '#F5F5F5' }]}>
                            <Text style={[styles.filterSectionTitle, { color: theme.text || '#000000' }]}>
                                Status
                            </Text>
                            <View style={styles.statusGrid}>
                                {statuses.map((status) => (
                                    <TouchableOpacity
                                        key={status.id}
                                        style={[
                                            styles.statusButton,
                                            {
                                                backgroundColor: selectedStatus === status.id
                                                    ? (theme.primary || '#3F51B5') + '20'
                                                    : (theme.background || '#FFFFFF'),
                                                borderColor: selectedStatus === status.id
                                                    ? (theme.primary || '#3F51B5')
                                                    : (theme.border || '#E0E0E0')
                                            }
                                        ]}
                                        onPress={() => setSelectedStatus(status.id)}
                                    >
                                        <Icon
                                            name={getStatusIcon(status.id)}
                                            size={18}
                                            color={getStatusColor(status.id === 'all' ? 'present' : status.id)}
                                        />
                                        <Text style={[
                                            styles.statusButtonText,
                                            {
                                                color: selectedStatus === status.id
                                                    ? (theme.primary || '#3F51B5')
                                                    : (theme.text || '#000000')
                                            }
                                        ]}>
                                            {status.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Date Range */}
                        <View style={[styles.filterSection, { backgroundColor: theme.card || '#F5F5F5' }]}>
                            <Text style={[styles.filterSectionTitle, { color: theme.text || '#000000' }]}>
                                Date Range
                            </Text>
                            <View style={styles.dateRangeContainer}>
                                <View style={styles.dateInput}>
                                    <Text style={[styles.dateLabel, { color: theme.textSecondary || '#757575' }]}>
                                        From Date
                                    </Text>
                                    <TouchableOpacity
                                        style={[styles.dateButton, {
                                            backgroundColor: theme.background || '#FFFFFF',
                                            borderColor: theme.border || '#E0E0E0'
                                        }]}
                                        onPress={() => setShowDateFromPicker(true)}
                                    >
                                        <Icon name="calendar" size={20} color={theme.text || '#000000'} />
                                        <Text style={[styles.dateButtonText, { color: theme.text || '#000000' }]}>
                                            {dateFrom ? dateFrom.toLocaleDateString() : 'Select date'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.dateInput}>
                                    <Text style={[styles.dateLabel, { color: theme.textSecondary || '#757575' }]}>
                                        To Date
                                    </Text>
                                    <TouchableOpacity
                                        style={[styles.dateButton, {
                                            backgroundColor: theme.background || '#FFFFFF',
                                            borderColor: theme.border || '#E0E0E0'
                                        }]}
                                        onPress={() => setShowDateToPicker(true)}
                                    >
                                        <Icon name="calendar" size={20} color={theme.text || '#000000'} />
                                        <Text style={[styles.dateButtonText, { color: theme.text || '#000000' }]}>
                                            {dateTo ? dateTo.toLocaleDateString() : 'Select date'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </ScrollView>

                    <View style={styles.modalFooter}>
                        <TouchableOpacity
                            style={[styles.filterButton, {
                                backgroundColor: theme.background || '#FFFFFF',
                                borderColor: theme.border || '#E0E0E0'
                            }]}
                            onPress={handleResetFilters}
                        >
                            <Icon name="refresh" size={20} color={theme.text || '#000000'} />
                            <Text style={[styles.filterButtonText, { color: theme.text || '#000000' }]}>
                                Reset
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.filterButton, { backgroundColor: theme.primary || '#3F51B5' }]}
                            onPress={handleApplyFilters}
                        >
                            <Icon name="check" size={20} color="#FFF" />
                            <Text style={[styles.filterButtonText, { color: '#FFFFFF' }]}>
                                Apply Filters
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    const renderAttendanceItem = ({ item, index }) => {
        const statusColor = getStatusColor(item.status);
        const statusText = getStatusText(item.status);
        const statusIcon = getStatusIcon(item.status);

        return (
            <View style={[styles.attendanceItem, { backgroundColor: theme.card || '#F5F5F5' }]}>
                <View style={styles.attendanceDate}>
                    <Text style={[styles.dateText, { color: theme.text || '#000000' }]}>
                        {formatDate(item.date)}
                    </Text>
                    <Text style={[styles.dayText, { color: theme.textSecondary || '#757575' }]}>
                        {getDayName(item.date)}
                    </Text>
                </View>
                <View style={styles.attendanceStatus}>
                    <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
                        <Icon
                            name={statusIcon}
                            size={18}
                            color={statusColor}
                            style={styles.statusIcon}
                        />
                        <Text style={[styles.statusText, { color: statusColor }]}>
                            {statusText}
                        </Text>
                    </View>
                    {item.lateStatus && (
                        <View style={[styles.lateBadge, { backgroundColor: (theme.warning || '#FF9800') + '10' }]}>
                            <Icon name="clock" size={14} color={theme.warning || '#FF9800'} />
                            <Text style={[styles.lateText, { color: theme.warning || '#FF9800' }]}>
                                {item.lateStatus}
                            </Text>
                        </View>
                    )}
                    {item.remarks && (
                        <Text style={[styles.remarksText, { color: theme.textSecondary || '#757575' }]}>
                            {item.remarks}
                        </Text>
                    )}
                </View>
            </View>
        );
    };

    const renderEmptyState = () => (
        <View style={[styles.emptyState, { backgroundColor: theme.card || '#F5F5F5' }]}>
            <Icon name="calendar-blank" size={60} color={theme.textSecondary || '#757575'} />
            <Text style={[styles.emptyStateTitle, { color: theme.text || '#000000' }]}>
                No Attendance Records
            </Text>
            <Text style={[styles.emptyStateText, { color: theme.textSecondary || '#757575' }]}>
                {attendanceHistory.length === 0
                    ? 'No attendance data available for the selected period.'
                    : 'No records match your current filters.'}
            </Text>
            <TouchableOpacity
                style={[styles.emptyStateButton, { backgroundColor: theme.primary || '#3F51B5' }]}
                onPress={handleResetFilters}
            >
                <Text style={styles.emptyStateButtonText}>Reset Filters</Text>
            </TouchableOpacity>
        </View>
    );

    // Error state
    if (error) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background || '#FFFFFF' }]}>
                <View style={styles.errorContainer}>
                    <Icon name="wifi-off" size={60} color={theme.error || '#F44336'} />
                    <Text style={[styles.errorText, { color: theme.text || '#000000' }]}>
                        Connection Error
                    </Text>
                    <Text style={[styles.errorSubtext, { color: theme.textSecondary || '#757575' }]}>
                        Unable to connect to the server.{'\n'}Please check your internet connection.
                    </Text>
                    <TouchableOpacity
                        style={[styles.retryButton, { backgroundColor: theme.primary || '#3F51B5' }]}
                        onPress={() => refetch()}
                    >
                        <Text style={styles.retryButtonText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Initial loading state
    if (isLoading && !refreshing) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background || '#FFFFFF' }]}>
                <ActivityIndicator size="large" color={theme.primary || '#3F51B5'} />
                <Text style={[styles.loadingText, { color: theme.textSecondary || '#757575' }]}>
                    Loading attendance history...
                </Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background || '#FFFFFF' }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.card || '#F5F5F5' }]}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Icon name="arrow-left" size={24} color={theme.text || '#000000'} />
                    </TouchableOpacity>
                    <View>
                        <Text style={[styles.title, { color: theme.text || '#000000' }]}>
                            {childName}'s Attendance
                        </Text>
                        <Text style={[styles.subtitle, { color: theme.textSecondary || '#757575' }]}>
                            {months[selectedMonth]} {selectedYear}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={[styles.filterButtonHeader, { backgroundColor: (theme.primary || '#3F51B5') + '10' }]}
                    onPress={() => setShowFilterModal(true)}
                >
                    <Icon name="filter-variant" size={24} color={theme.primary || '#3F51B5'} />
                    <Text style={[styles.filterButtonTextHeader, { color: theme.primary || '#3F51B5' }]}>
                        Filter
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Filter Summary */}
            {(selectedStatus !== 'all' || dateFrom || dateTo) && (
                <View style={[styles.filterSummary, { backgroundColor: theme.card || '#F5F5F5' }]}>
                    <View style={styles.filterSummaryContent}>
                        <Icon name="filter" size={16} color={theme.primary || '#3F51B5'} />
                        <Text style={[styles.filterSummaryText, { color: theme.text || '#000000' }]}>
                            Active filters:
                            {selectedStatus !== 'all' && ` ${getStatusText(selectedStatus)}`}
                            {dateFrom && ` from ${dateFrom.toLocaleDateString()}`}
                            {dateTo && ` to ${dateTo.toLocaleDateString()}`}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={handleResetFilters}>
                        <Icon name="close" size={18} color={theme.textSecondary || '#757575'} />
                    </TouchableOpacity>
                </View>
            )}

            {/* Refresh indicator */}
            {(isFetching || refreshing) && (
                <View style={styles.refreshIndicator}>
                    <ActivityIndicator size="small" color={theme.primary || '#3F51B5'} />
                </View>
            )}

            {/* Main Content */}
            <ScrollView
                style={styles.scrollContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[theme.primary || '#3F51B5']}
                        tintColor={theme.primary || '#3F51B5'}
                    />
                }
                showsVerticalScrollIndicator={false}
            >
                {/* Stats Card */}
                <View style={[styles.statsCard, { backgroundColor: theme.card || '#F5F5F5' }]}>
                    <View style={styles.statMain}>
                        <Text style={[styles.percentage, { color: theme.text || '#000000' }]}>
                            {overallStats.presentPercentage}%
                        </Text>
                        <Text style={[styles.percentageLabel, { color: theme.textSecondary || '#757575' }]}>
                            Overall Attendance Rate
                        </Text>
                        <View style={styles.attendanceBar}>
                            <View
                                style={[
                                    styles.attendanceFill,
                                    {
                                        width: `${overallStats.presentPercentage || 0}%`,
                                        backgroundColor: theme.success || '#4CAF50',
                                    },
                                ]}
                            />
                        </View>
                    </View>

                    <View style={styles.statsGrid}>
                        <View style={styles.statItem}>
                            <View style={[styles.statIconContainer, { backgroundColor: (theme.success || '#4CAF50') + '20' }]}>
                                <Icon name="check-circle" size={20} color={theme.success || '#4CAF50'} />
                            </View>
                            <Text style={[styles.statValue, { color: theme.text || '#000000' }]}>
                                {overallStats.presentDays}
                            </Text>
                            <Text style={[styles.statLabel, { color: theme.textSecondary || '#757575' }]}>
                                Present
                            </Text>
                        </View>

                        <View style={styles.statItem}>
                            <View style={[styles.statIconContainer, { backgroundColor: (theme.error || '#F44336') + '20' }]}>
                                <Icon name="close-circle" size={20} color={theme.error || '#F44336'} />
                            </View>
                            <Text style={[styles.statValue, { color: theme.text || '#000000' }]}>
                                {overallStats.absentDays}
                            </Text>
                            <Text style={[styles.statLabel, { color: theme.textSecondary || '#757575' }]}>
                                Absent
                            </Text>
                        </View>

                        <View style={styles.statItem}>
                            <View style={[styles.statIconContainer, { backgroundColor: (theme.warning || '#FF9800') + '20' }]}>
                                <Icon name="clock-alert" size={20} color={theme.warning || '#FF9800'} />
                            </View>
                            <Text style={[styles.statValue, { color: theme.text || '#000000' }]}>
                                {overallStats.lateDays}
                            </Text>
                            <Text style={[styles.statLabel, { color: theme.textSecondary || '#757575' }]}>
                                Late
                            </Text>
                        </View>

                        <View style={styles.statItem}>
                            <View style={[styles.statIconContainer, { backgroundColor: (theme.info || '#2196F3') + '20' }]}>
                                <Icon name="account-arrow-right" size={20} color={theme.info || '#2196F3'} />
                            </View>
                            <Text style={[styles.statValue, { color: theme.text || '#000000' }]}>
                                {overallStats.leaveDays}
                            </Text>
                            <Text style={[styles.statLabel, { color: theme.textSecondary || '#757575' }]}>
                                Leave
                            </Text>
                        </View>
                    </View>

                    {/* Additional Stats */}
                    <View style={styles.additionalStats}>
                        <View style={styles.additionalStatItem}>
                            <Icon name="trending-up" size={18} color={theme.success || '#4CAF50'} />
                            <Text style={[styles.additionalStatLabel, { color: theme.textSecondary || '#757575' }]}>
                                Current Streak:
                            </Text>
                            <Text style={[styles.additionalStatValue, { color: theme.text || '#000000' }]}>
                                {overallStats.currentStreak || 0} days
                            </Text>
                        </View>
                        <View style={styles.additionalStatItem}>
                            <Icon name="trophy" size={18} color={theme.warning || '#FF9800'} />
                            <Text style={[styles.additionalStatLabel, { color: theme.textSecondary || '#757575' }]}>
                                Longest Streak:
                            </Text>
                            <Text style={[styles.additionalStatValue, { color: theme.text || '#000000' }]}>
                                {overallStats.longestStreak || 0} days
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Results Summary */}
                <View style={[styles.resultsSummary, { backgroundColor: theme.card || '#F5F5F5' }]}>
                    <Text style={[styles.resultsTitle, { color: theme.text || '#000000' }]}>
                        Showing {filteredHistory.length} of {attendanceHistory.length} records
                    </Text>
                </View>

                {/* Attendance List or Empty State */}
                {filteredHistory.length > 0 ? (
                    <View style={styles.attendanceList}>
                        <Text style={[styles.listTitle, { color: theme.text || '#000000' }]}>
                            Attendance Records
                        </Text>
                        <FlatList
                            data={filteredHistory}
                            renderItem={renderAttendanceItem}
                            keyExtractor={(item, index) => `${item.date}-${index}`}
                            scrollEnabled={false}
                            contentContainerStyle={styles.listContent}
                        />
                    </View>
                ) : (
                    renderEmptyState()
                )}

                {/* Legend */}
                <View style={[styles.legendCard, { backgroundColor: theme.card || '#F5F5F5' }]}>
                    <Text style={[styles.legendTitle, { color: theme.text || '#000000' }]}>
                        Status Legend
                    </Text>
                    <View style={styles.legendItems}>
                        <View style={styles.legendItem}>
                            <Icon name="check-circle" size={16} color={theme.success || '#4CAF50'} />
                            <Text style={[styles.legendText, { color: theme.text || '#000000' }]}>
                                Present
                            </Text>
                        </View>
                        <View style={styles.legendItem}>
                            <Icon name="close-circle" size={16} color={theme.error || '#F44336'} />
                            <Text style={[styles.legendText, { color: theme.text || '#000000' }]}>
                                Absent
                            </Text>
                        </View>
                        <View style={styles.legendItem}>
                            <Icon name="clock-alert" size={16} color={theme.warning || '#FF9800'} />
                            <Text style={[styles.legendText, { color: theme.text || '#000000' }]}>
                                Late
                            </Text>
                        </View>
                        <View style={styles.legendItem}>
                            <Icon name="account-arrow-right" size={16} color={theme.info || '#2196F3'} />
                            <Text style={[styles.legendText, { color: theme.text || '#000000' }]}>
                                Leave
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Date Pickers */}
            {showDateFromPicker && (
                <DateTimePicker
                    value={dateFrom || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateFromChange}
                />
            )}
            {showDateToPicker && (
                <DateTimePicker
                    value={dateTo || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateToChange}
                />
            )}

            {/* Filter Modal */}
            {renderFilterModal()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingText: {
        marginTop: 20,
        fontSize: 16,
        textAlign: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    backButton: {
        marginRight: 12,
        padding: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 12,
        opacity: 0.7,
    },
    filterButtonHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    filterButtonTextHeader: {
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
    },
    filterSummary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginHorizontal: 12,
        marginTop: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    filterSummaryContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    filterSummaryText: {
        fontSize: 11,
        marginLeft: 6,
        flex: 1,
    },
    refreshIndicator: {
        paddingVertical: 4,
        alignItems: 'center',
    },
    scrollContainer: {
        flex: 1,
    },
    statsCard: {
        margin: 12,
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    statMain: {
        alignItems: 'center',
        marginBottom: 20,
    },
    percentage: {
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    percentageLabel: {
        fontSize: 12,
        marginBottom: 12,
    },
    attendanceBar: {
        width: '100%',
        height: 6,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    attendanceFill: {
        height: '100%',
        borderRadius: 3,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    statItem: {
        width: '48%',
        alignItems: 'center',
        marginBottom: 12,
    },
    statIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 2,
    },
    statLabel: {
        fontSize: 11,
    },
    additionalStats: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
        paddingTop: 12,
    },
    additionalStatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    additionalStatLabel: {
        fontSize: 11,
        marginLeft: 8,
        flex: 1,
    },
    additionalStatValue: {
        fontSize: 11,
        fontWeight: '600',
    },
    resultsSummary: {
        marginHorizontal: 12,
        marginBottom: 8,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    resultsTitle: {
        fontSize: 12,
        fontWeight: '600',
    },
    attendanceList: {
        marginHorizontal: 12,
        marginBottom: 16,
    },
    listTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        paddingLeft: 4,
    },
    listContent: {
        paddingBottom: 4,
    },
    attendanceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    attendanceDate: {
        flex: 1,
    },
    dateText: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 2,
    },
    dayText: {
        fontSize: 11,
        opacity: 0.7,
    },
    attendanceStatus: {
        alignItems: 'flex-end',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 4,
    },
    statusIcon: {
        marginRight: 4,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '600',
    },
    lateBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
        marginTop: 2,
    },
    lateText: {
        fontSize: 9,
        fontWeight: '600',
        marginLeft: 2,
    },
    remarksText: {
        fontSize: 10,
        marginTop: 2,
        maxWidth: 120,
        textAlign: 'right',
    },
    legendCard: {
        margin: 12,
        marginTop: 0,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    legendTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    legendItems: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendText: {
        fontSize: 10,
        marginLeft: 4,
    },
    emptyState: {
        margin: 12,
        padding: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyStateTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyStateText: {
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 18,
        marginBottom: 16,
    },
    emptyStateButton: {
        paddingHorizontal: 24,
        paddingVertical: 8,
        borderRadius: 20,
    },
    emptyStateButtonText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '600',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    errorText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    errorSubtext: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    retryButton: {
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 24,
    },
    retryButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '85%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    filterContent: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    filterSection: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    filterSectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 8,
    },
    monthButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 6,
        borderWidth: 1,
    },
    monthButtonText: {
        fontSize: 12,
        fontWeight: '600',
    },
    yearButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 6,
        borderWidth: 1,
    },
    yearButtonText: {
        fontSize: 12,
        fontWeight: '600',
    },
    statusGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -4,
    },
    statusButton: {
        width: '48%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 8,
        marginHorizontal: '1%',
        marginBottom: 8,
        borderWidth: 1,
    },
    statusButtonText: {
        fontSize: 11,
        fontWeight: '600',
        marginLeft: 6,
        flex: 1,
    },
    dateRangeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dateInput: {
        width: '48%',
    },
    dateLabel: {
        fontSize: 11,
        marginBottom: 4,
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
    },
    dateButtonText: {
        fontSize: 12,
        marginLeft: 6,
        flex: 1,
    },
    modalFooter: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
    },
    filterButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 8,
        marginHorizontal: 4,
        borderWidth: 1,
    },
    filterButtonText: {
        fontSize: 13,
        fontWeight: '600',
        marginLeft: 6,
    },
});

export default ChildAttendanceHistoryScreen;