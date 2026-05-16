// src/screens/Teacher/AttendanceReportScreen.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { selectThemeData } from '../../store/slices/themeSlice';
import { fetchAttendanceHistory } from '../../store/slices/teacherSlice';

const { width } = Dimensions.get('window');

const AttendanceReportScreen = ({ navigation, route }) => {
    const theme = useSelector(selectThemeData);
    const dispatch = useDispatch();
    const { classId, className, sectionId, sectionName } = route.params;

    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);

    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const years = [2024, 2025, 2026];

    useEffect(() => {
        loadAttendanceHistory();
    }, [selectedMonth, selectedYear]);

    const loadAttendanceHistory = async () => {
        setLoading(true);
        const result = await dispatch(fetchAttendanceHistory({
            classId,
            sectionId,
            month: selectedMonth,
            year: selectedYear
        }));

        if (result.payload?.success) {
            setHistory(result.payload.history || []);
        }
        setLoading(false);
    };

    const getMonthData = () => {
        const monthData = Array.from({ length: 31 }, (_, i) => {
            const day = i + 1;
            const dateStr = `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const dayData = history.find(h => h.date === dateStr);

            return {
                day,
                date: dateStr,
                present: dayData?.presentCount || 0,
                total: dayData?.totalStudents || 0,
                attendance: dayData ? true : false
            };
        });

        return monthData;
    };

    const calculateMonthlyStats = () => {
        const attendedDays = history.filter(h => h.totalStudents > 0).length;
        const totalPresent = history.reduce((sum, day) => sum + (day.presentCount || 0), 0);
        const totalAbsent = history.reduce((sum, day) => sum + (day.absentCount || 0), 0);
        const totalLeave = history.reduce((sum, day) => sum + (day.leaveCount || 0), 0);
        const totalStudents = history.length > 0 ? history[0].totalStudents : 0;

        return {
            attendedDays,
            totalPresent,
            totalAbsent,
            totalLeave,
            attendancePercentage: attendedDays > 0 ? Math.round((totalPresent / (attendedDays * totalStudents)) * 100) : 0
        };
    };

    const stats = calculateMonthlyStats();

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.card }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={24} color={theme.text} />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>
                        {className} - {sectionName}
                    </Text>
                    <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
                        Attendance Report
                    </Text>
                </View>
            </View>

            {/* Month/Year Selector */}
            <View style={[styles.selectorContainer, { backgroundColor: theme.card }]}>
                <View style={styles.selectorRow}>
                    <Text style={[styles.selectorLabel, { color: theme.text }]}>Month:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {months.map((month, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.selectorButton,
                                    selectedMonth === index + 1 && { backgroundColor: theme.primary }
                                ]}
                                onPress={() => setSelectedMonth(index + 1)}
                            >
                                <Text style={[
                                    styles.selectorButtonText,
                                    selectedMonth === index + 1 && { color: '#FFFFFF' },
                                    { color: theme.text }
                                ]}>
                                    {month}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.selectorRow}>
                    <Text style={[styles.selectorLabel, { color: theme.text }]}>Year:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {years.map((year) => (
                            <TouchableOpacity
                                key={year}
                                style={[
                                    styles.selectorButton,
                                    selectedYear === year && { backgroundColor: theme.primary }
                                ]}
                                onPress={() => setSelectedYear(year)}
                            >
                                <Text style={[
                                    styles.selectorButtonText,
                                    selectedYear === year && { color: '#FFFFFF' },
                                    { color: theme.text }
                                ]}>
                                    {year}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>

            {/* Monthly Stats */}
            <View style={styles.statsGrid}>
                <View style={[styles.statCard, { backgroundColor: theme.card }]}>
                    <Icon name="calendar-check" size={24} color={theme.primary} />
                    <Text style={[styles.statValue, { color: theme.text }]}>
                        {stats.attendedDays}
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                        Days Attended
                    </Text>
                </View>

                <View style={[styles.statCard, { backgroundColor: theme.card }]}>
                    <Icon name="chart-line" size={24} color={theme.success} />
                    <Text style={[styles.statValue, { color: theme.text }]}>
                        {stats.attendancePercentage}%
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                        Attendance Rate
                    </Text>
                </View>
            </View>

            <View style={styles.statsGrid}>
                <View style={[styles.statCard, { backgroundColor: theme.card }]}>
                    <Icon name="account-check" size={24} color={theme.success} />
                    <Text style={[styles.statValue, { color: theme.text }]}>
                        {stats.totalPresent}
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                        Total Present
                    </Text>
                </View>

                <View style={[styles.statCard, { backgroundColor: theme.card }]}>
                    <Icon name="account-cancel" size={24} color={theme.error} />
                    <Text style={[styles.statValue, { color: theme.text }]}>
                        {stats.totalAbsent}
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                        Total Absent
                    </Text>
                </View>

                <View style={[styles.statCard, { backgroundColor: theme.card }]}>
                    <Icon name="calendar-clock" size={24} color={theme.warning} />
                    <Text style={[styles.statValue, { color: theme.text }]}>
                        {stats.totalLeave}
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                        Total Leave
                    </Text>
                </View>
            </View>

            {/* Calendar View */}
            <View style={[styles.calendarContainer, { backgroundColor: theme.card }]}>
                <Text style={[styles.calendarTitle, { color: theme.text }]}>
                    Daily Attendance - {months[selectedMonth - 1]} {selectedYear}
                </Text>

                <View style={styles.weekHeader}>
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                        <Text key={index} style={[styles.weekDay, { color: theme.textSecondary }]}>
                            {day}
                        </Text>
                    ))}
                </View>

                <View style={styles.calendarGrid}>
                    {getMonthData().map((dayData, index) => {
                        const percentage = dayData.total > 0
                            ? Math.round((dayData.present / dayData.total) * 100)
                            : 0;

                        let bgColor = theme.background;
                        if (dayData.attendance) {
                            if (percentage >= 90) bgColor = theme.success + '40';
                            else if (percentage >= 75) bgColor = theme.warning + '40';
                            else bgColor = theme.error + '40';
                        }

                        return (
                            <View key={index} style={[styles.dayCell, { backgroundColor: bgColor }]}>
                                <Text style={[styles.dayNumber, { color: theme.text }]}>
                                    {dayData.day}
                                </Text>
                                {dayData.attendance && (
                                    <>
                                        <Text style={[styles.dayPresent, { color: theme.text }]}>
                                            {dayData.present}
                                        </Text>
                                        <Text style={[styles.dayTotal, { color: theme.textSecondary }]}>
                                            /{dayData.total}
                                        </Text>
                                        <Text style={[styles.dayPercentage, { color: theme.textSecondary }]}>
                                            {percentage}%
                                        </Text>
                                    </>
                                )}
                            </View>
                        );
                    })}
                </View>

                <View style={styles.legendContainer}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: theme.success + '40' }]} />
                        <Text style={[styles.legendText, { color: theme.textSecondary }]}>
                            ≥90% Attendance
                        </Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: theme.warning + '40' }]} />
                        <Text style={[styles.legendText, { color: theme.textSecondary }]}>
                            75-89% Attendance
                        </Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: theme.error + '40' }]} />
                        <Text style={[styles.legendText, { color: theme.textSecondary }]}>
                            &lt;75% Attendance
                        </Text>
                    </View>
                </View>
            </View>

            {/* Daily Details */}
            <View style={[styles.detailsContainer, { backgroundColor: theme.card }]}>
                <Text style={[styles.detailsTitle, { color: theme.text }]}>
                    Daily Attendance Details
                </Text>

                {history.length > 0 ? (
                    history.map((day, index) => (
                        <View key={index} style={styles.detailItem}>
                            <View style={styles.detailDate}>
                                <Text style={[styles.detailDateText, { color: theme.text }]}>
                                    {new Date(day.date).toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </Text>
                            </View>

                            <View style={styles.detailStats}>
                                <View style={[styles.detailStat, { backgroundColor: theme.success + '20' }]}>
                                    <Icon name="check" size={14} color={theme.success} />
                                    <Text style={[styles.detailStatText, { color: theme.text }]}>
                                        {day.presentCount}
                                    </Text>
                                </View>

                                <View style={[styles.detailStat, { backgroundColor: theme.error + '20' }]}>
                                    <Icon name="close" size={14} color={theme.error} />
                                    <Text style={[styles.detailStatText, { color: theme.text }]}>
                                        {day.absentCount}
                                    </Text>
                                </View>

                                <View style={[styles.detailStat, { backgroundColor: theme.warning + '20' }]}>
                                    <Icon name="clock" size={14} color={theme.warning} />
                                    <Text style={[styles.detailStatText, { color: theme.text }]}>
                                        {day.leaveCount}
                                    </Text>
                                </View>

                                {day.lateCount > 0 && (
                                    <View style={[styles.detailStat, { backgroundColor: theme.secondary + '20' }]}>
                                        <Icon name="clock-alert" size={14} color={theme.secondary} />
                                        <Text style={[styles.detailStatText, { color: theme.text }]}>
                                            {day.lateCount}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={styles.noDataContainer}>
                        <Icon name="calendar-remove" size={50} color={theme.textSecondary} />
                        <Text style={[styles.noDataText, { color: theme.textSecondary }]}>
                            No attendance data for {months[selectedMonth - 1]} {selectedYear}
                        </Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    headerInfo: {
        flex: 1,
        marginLeft: 15,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        fontSize: 12,
        marginTop: 2,
    },
    selectorContainer: {
        padding: 15,
        marginHorizontal: 15,
        marginBottom: 15,
        borderRadius: 10,
        elevation: 2,
    },
    selectorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    selectorLabel: {
        fontSize: 14,
        fontWeight: '600',
        width: 50,
    },
    selectorButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        marginHorizontal: 3,
    },
    selectorButtonText: {
        fontSize: 12,
        fontWeight: '500',
    },
    statsGrid: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        marginBottom: 10,
    },
    statCard: {
        flex: 1,
        marginHorizontal: 5,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 5,
    },
    statLabel: {
        fontSize: 11,
        textAlign: 'center',
    },
    calendarContainer: {
        padding: 15,
        marginHorizontal: 15,
        marginBottom: 15,
        borderRadius: 10,
        elevation: 2,
    },
    calendarTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    weekHeader: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    weekDay: {
        flex: 1,
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '600',
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayCell: {
        width: (width - 60) / 7,
        aspectRatio: 1,
        padding: 2,
        margin: 1,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayNumber: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    dayPresent: {
        fontSize: 9,
        fontWeight: 'bold',
    },
    dayTotal: {
        fontSize: 8,
    },
    dayPercentage: {
        fontSize: 8,
        marginTop: 1,
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendColor: {
        width: 12,
        height: 12,
        borderRadius: 2,
        marginRight: 5,
    },
    legendText: {
        fontSize: 9,
    },
    detailsContainer: {
        padding: 15,
        marginHorizontal: 15,
        marginBottom: 20,
        borderRadius: 10,
        elevation: 2,
    },
    detailsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    detailDate: {
        width: 80,
    },
    detailDateText: {
        fontSize: 12,
        fontWeight: '600',
    },
    detailStats: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    detailStat: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 5,
    },
    detailStatText: {
        fontSize: 11,
        fontWeight: '600',
        marginLeft: 3,
    },
    noDataContainer: {
        alignItems: 'center',
        paddingVertical: 30,
    },
    noDataText: {
        fontSize: 14,
        marginTop: 10,
        textAlign: 'center',
    },
});

export default AttendanceReportScreen;