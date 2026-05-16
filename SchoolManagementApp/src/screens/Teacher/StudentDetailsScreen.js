// src/screens/Teacher/StudentDetailsScreen.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { selectThemeData } from '../../store/slices/themeSlice';

const StudentDetailsScreen = ({ route, navigation }) => {
    const theme = useSelector(selectThemeData);
    const { studentId, studentName, studentData } = route.params;

    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [student, setStudent] = useState(studentData || {});
    const [attendanceData, setAttendanceData] = useState([]);
    const [gradesData, setGradesData] = useState([]);
    const [recentActivities, setRecentActivities] = useState([]);

    useEffect(() => {
        fetchStudentDetails();
    }, []);

    const fetchStudentDetails = async () => {
        setLoading(true);
        // Mock data - replace with API
        setTimeout(() => {
            setStudent({
                ...studentData,
                fatherName: 'John Doe Sr.',
                motherName: 'Jane Doe',
                phone: '+1 234 567 8900',
                email: 'john.doe@example.com',
                address: '123 Main St, City, Country',
                dob: '2015-08-15',
                joinedDate: '2023-01-10',
                bloodGroup: 'O+',
                allergies: 'None',
            });

            setAttendanceData([
                { month: 'Jan', present: 22, total: 25 },
                { month: 'Feb', present: 20, total: 22 },
                { month: 'Mar', present: 23, total: 24 },
                { month: 'Apr', present: 21, total: 23 },
            ]);

            setGradesData([
                { subject: 'Mathematics', grade: 'A', marks: '95/100' },
                { subject: 'Science', grade: 'A-', marks: '88/100' },
                { subject: 'English', grade: 'B+', marks: '85/100' },
                { subject: 'History', grade: 'A', marks: '92/100' },
                { subject: 'Geography', grade: 'B+', marks: '87/100' },
            ]);

            setRecentActivities([
                { id: 1, activity: 'Won Science Fair', date: '2024-03-15' },
                { id: 2, activity: 'Perfect Attendance - March', date: '2024-04-01' },
                { id: 3, activity: 'Math Quiz Winner', date: '2024-03-10' },
            ]);

            setLoading(false);
        }, 1500);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchStudentDetails();
        setRefreshing(false);
    };

    const handleTakeAttendance = () => {
        // Navigate to attendance marking screen
        console.log('Mark attendance for:', studentName);
    };

    const handleEnterGrades = () => {
        // Navigate to grade entry screen
        console.log('Enter grades for:', studentName);
    };

    const handleSendMessage = () => {
        // Navigate to messaging screen
        console.log('Message parent of:', studentName);
    };

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.background }]}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[theme.primary]}
                />
            }
        >
            {/* Profile Header */}
            <View style={[styles.profileHeader, { backgroundColor: theme.card }]}>
                <View style={styles.avatarContainer}>
                    {student.image ? (
                        <Image source={{ uri: student.image }} style={styles.avatar} />
                    ) : (
                        <View style={[styles.avatarPlaceholder, { backgroundColor: theme.primary }]}>
                            <Icon name="account" size={50} color="#FFFFFF" />
                        </View>
                    )}
                </View>
                <View style={styles.profileInfo}>
                    <Text style={[styles.studentName, { color: theme.text }]}>
                        {studentName}
                    </Text>
                    <Text style={[styles.classInfo, { color: theme.textSecondary }]}>
                        Roll No: {student.rollNo || 'N/A'} • Class: {student.className || 'N/A'}
                    </Text>
                    <View style={styles.stats}>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: theme.text }]}>95%</Text>
                            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Attendance</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: theme.text }]}>A-</Text>
                            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Avg Grade</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: theme.text }]}>4.5</Text>
                            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>GPA</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Actions</Text>
                <View style={styles.quickActions}>
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: theme.card }]}
                        onPress={handleTakeAttendance}
                    >
                        <Icon name="clipboard-check" size={24} color={theme.primary} />
                        <Text style={[styles.actionText, { color: theme.text }]}>
                            Attendance
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: theme.card }]}
                        onPress={handleEnterGrades}
                    >
                        <Icon name="pen" size={24} color={theme.success} />
                        <Text style={[styles.actionText, { color: theme.text }]}>
                            Enter Grades
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: theme.card }]}
                        onPress={handleSendMessage}
                    >
                        <Icon name="message" size={24} color={theme.warning} />
                        <Text style={[styles.actionText, { color: theme.text }]}>
                            Message Parent
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: theme.card }]}
                        onPress={() => { }}
                    >
                        <Icon name="note" size={24} color={theme.error} />
                        <Text style={[styles.actionText, { color: theme.text }]}>
                            Add Note
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Personal Information */}
            <View style={[styles.section, { backgroundColor: theme.card }]}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Personal Information
                </Text>
                <View style={styles.infoGrid}>
                    <View style={styles.infoItem}>
                        <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                            Father's Name
                        </Text>
                        <Text style={[styles.infoValue, { color: theme.text }]}>
                            {student.fatherName || 'N/A'}
                        </Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                            Mother's Name
                        </Text>
                        <Text style={[styles.infoValue, { color: theme.text }]}>
                            {student.motherName || 'N/A'}
                        </Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                            Phone
                        </Text>
                        <Text style={[styles.infoValue, { color: theme.text }]}>
                            {student.phone || 'N/A'}
                        </Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                            Email
                        </Text>
                        <Text style={[styles.infoValue, { color: theme.text }]}>
                            {student.email || 'N/A'}
                        </Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                            Date of Birth
                        </Text>
                        <Text style={[styles.infoValue, { color: theme.text }]}>
                            {student.dob || 'N/A'}
                        </Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                            Blood Group
                        </Text>
                        <Text style={[styles.infoValue, { color: theme.text }]}>
                            {student.bloodGroup || 'N/A'}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Attendance History */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Attendance History
                </Text>
                {attendanceData.map((item, index) => (
                    <View
                        key={index}
                        style={[styles.attendanceItem, { backgroundColor: theme.card }]}
                    >
                        <Text style={[styles.month, { color: theme.text }]}>{item.month}</Text>
                        <View style={styles.attendanceBar}>
                            <View
                                style={[
                                    styles.attendanceFill,
                                    {
                                        width: `${(item.present / item.total) * 100}%`,
                                        backgroundColor: theme.success,
                                    },
                                ]}
                            />
                        </View>
                        <Text style={[styles.attendanceText, { color: theme.text }]}>
                            {item.present}/{item.total} ({Math.round((item.present / item.total) * 100)}%)
                        </Text>
                    </View>
                ))}
            </View>

            {/* Recent Grades */}
            <View style={[styles.section, { backgroundColor: theme.card }]}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Recent Grades
                </Text>
                {gradesData.map((grade, index) => (
                    <View
                        key={index}
                        style={[
                            styles.gradeItem,
                            { borderLeftColor: theme.primary },
                        ]}
                    >
                        <View style={styles.gradeInfo}>
                            <Text style={[styles.subject, { color: theme.text }]}>
                                {grade.subject}
                            </Text>
                            <Text style={[styles.marks, { color: theme.textSecondary }]}>
                                {grade.marks}
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.gradeBadge,
                                { backgroundColor: theme.primary + '20' },
                            ]}
                        >
                            <Text style={[styles.gradeText, { color: theme.primary }]}>
                                {grade.grade}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>

            {/* Recent Activities */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Recent Activities
                </Text>
                {recentActivities.map((activity) => (
                    <View
                        key={activity.id}
                        style={[styles.activityItem, { backgroundColor: theme.card }]}
                    >
                        <Icon name="trophy" size={20} color={theme.warning} />
                        <View style={styles.activityInfo}>
                            <Text style={[styles.activityText, { color: theme.text }]}>
                                {activity.activity}
                            </Text>
                            <Text style={[styles.activityDate, { color: theme.textSecondary }]}>
                                {activity.date}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        marginBottom: 15,
    },
    avatarContainer: {
        marginRight: 15,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    avatarPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileInfo: {
        flex: 1,
    },
    studentName: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    classInfo: {
        fontSize: 14,
        marginBottom: 10,
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 12,
    },
    section: {
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    quickActions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    actionButton: {
        width: '48%',
        marginBottom: 10,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    actionText: {
        fontSize: 12,
        marginTop: 8,
        textAlign: 'center',
    },
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    infoItem: {
        width: '48%',
        marginBottom: 15,
    },
    infoLabel: {
        fontSize: 12,
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '600',
    },
    attendanceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    month: {
        fontSize: 14,
        fontWeight: '600',
        width: 40,
    },
    attendanceBar: {
        flex: 1,
        height: 8,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 4,
        marginHorizontal: 10,
        overflow: 'hidden',
    },
    attendanceFill: {
        height: '100%',
        borderRadius: 4,
    },
    attendanceText: {
        fontSize: 12,
        fontWeight: '600',
        width: 80,
        textAlign: 'right',
    },
    gradeItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        borderLeftWidth: 4,
    },
    gradeInfo: {
        flex: 1,
    },
    subject: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    marks: {
        fontSize: 14,
    },
    gradeBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    gradeText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    activityInfo: {
        flex: 1,
        marginLeft: 15,
    },
    activityText: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 2,
    },
    activityDate: {
        fontSize: 12,
    },
});

export default StudentDetailsScreen;