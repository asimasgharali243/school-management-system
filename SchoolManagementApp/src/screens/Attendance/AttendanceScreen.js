import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const AttendanceScreen = () => {
    const [attendance, setAttendance] = useState([
        { id: '1', date: '2024-01-10', className: 'Mathematics 101', present: 25, absent: 3, total: 28 },
        { id: '2', date: '2024-01-10', className: 'English Literature', present: 22, absent: 2, total: 24 },
        { id: '3', date: '2024-01-09', className: 'Physics', present: 18, absent: 2, total: 20 },
        { id: '4', date: '2024-01-09', className: 'Computer Science', present: 28, absent: 2, total: 30 },
        { id: '5', date: '2024-01-08', className: 'History', present: 20, absent: 2, total: 22 },
        { id: '6', date: '2024-01-08', className: 'Chemistry', present: 16, absent: 2, total: 18 },
    ]);

    const renderAttendanceItem = ({ item }) => {
        const percentage = Math.round((item.present / item.total) * 100);

        return (
            <TouchableOpacity style={styles.attendanceCard}>
                <View style={styles.dateContainer}>
                    <Text style={styles.dateText}>{item.date}</Text>
                </View>

                <Text style={styles.className}>{item.className}</Text>

                <View style={styles.statsRow}>
                    <View style={styles.stat}>
                        <Text style={styles.statNumber}>{item.present}</Text>
                        <Text style={styles.statLabel}>Present</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={[styles.statNumber, styles.absentText]}>{item.absent}</Text>
                        <Text style={styles.statLabel}>Absent</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statNumber}>{item.total}</Text>
                        <Text style={styles.statLabel}>Total</Text>
                    </View>
                </View>

                <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: `${percentage}%`, backgroundColor: percentage >= 80 ? '#2ecc71' : percentage >= 60 ? '#f39c12' : '#e74c3c' }
                            ]}
                        />
                    </View>
                    <Text style={styles.percentageText}>{percentage}%</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Attendance</Text>

            <View style={styles.summaryContainer}>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryNumber}>
                        {attendance.reduce((sum, item) => sum + item.present, 0)}
                    </Text>
                    <Text style={styles.summaryLabel}>Total Present</Text>
                </View>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryNumber}>
                        {attendance.reduce((sum, item) => sum + item.absent, 0)}
                    </Text>
                    <Text style={styles.summaryLabel}>Total Absent</Text>
                </View>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryNumber}>
                        {Math.round(attendance.reduce((sum, item) => sum + (item.present / item.total), 0) / attendance.length * 100)}%
                    </Text>
                    <Text style={styles.summaryLabel}>Avg. Attendance</Text>
                </View>
            </View>

            <View style={styles.headerRow}>
                <Text style={styles.sectionTitle}>Recent Attendance Records</Text>
                <TouchableOpacity style={styles.filterButton}>
                    <Text style={styles.filterButtonText}>Filter</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={attendance}
                renderItem={renderAttendanceItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />

            <TouchableOpacity style={styles.markAttendanceButton}>
                <Text style={styles.markAttendanceButtonText}>📋 Mark Today's Attendance</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#2c3e50',
    },
    summaryContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    summaryCard: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginHorizontal: 5,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    summaryNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#3498db',
    },
    summaryLabel: {
        fontSize: 12,
        color: '#7f8c8d',
        marginTop: 8,
        textAlign: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2c3e50',
    },
    filterButton: {
        backgroundColor: '#e3f2fd',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 15,
    },
    filterButtonText: {
        color: '#1976d2',
        fontSize: 14,
        fontWeight: '500',
    },
    listContainer: {
        paddingBottom: 20,
    },
    attendanceCard: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    dateContainer: {
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    dateText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
    },
    className: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 15,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    stat: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2ecc71',
    },
    absentText: {
        color: '#e74c3c',
    },
    statLabel: {
        fontSize: 12,
        color: '#7f8c8d',
        marginTop: 5,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressBar: {
        flex: 1,
        height: 8,
        backgroundColor: '#ecf0f1',
        borderRadius: 4,
        overflow: 'hidden',
        marginRight: 10,
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    percentageText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2c3e50',
        minWidth: 40,
    },
    markAttendanceButton: {
        backgroundColor: '#2ecc71',
        borderRadius: 10,
        padding: 18,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    markAttendanceButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default AttendanceScreen;