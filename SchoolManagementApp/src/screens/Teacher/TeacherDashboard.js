// src/screens/Teacher/TeacherDashboard.js
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { selectThemeData } from '../../store/slices/themeSlice';
import { selectCurrentUser } from '../../store/slices/authSlice';
import {
    fetchTeacherClasses,
    selectTeacherClasses,
    selectTeacherLoading,
    selectTeacherError
} from '../../store/slices/teacherSlice';

const TeacherDashboard = ({ navigation }) => {
    const theme = useSelector(selectThemeData);
    const user = useSelector(selectCurrentUser);
    const dispatch = useDispatch();
    const classes = useSelector(selectTeacherClasses);
    const loading = useSelector(selectTeacherLoading);
    const error = useSelector(selectTeacherError);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadClasses();
    }, []);

    const loadClasses = async () => {
        await dispatch(fetchTeacherClasses());
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadClasses();
        setRefreshing(false);
    };

    // ✅ FIXED: Navigate to ClassStudents (which exists in TeacherNavigator)
    const handleClassPress = (classItem) => {
        navigation.navigate('ClassStudents', {
            classId: classItem.classId,
            className: classItem.className,
            sectionId: classItem.sectionId,
            sectionName: classItem.sectionName
        });
    };

    // ✅ FIXED: Navigate to MarkAttendance (which exists in TeacherNavigator)
    const handleTakeAttendance = (classItem) => {
        navigation.navigate('MarkAttendance', {
            classId: classItem.classId,
            className: classItem.className,
            sectionId: classItem.sectionId,
            sectionName: classItem.sectionName,
            subjectId: classItem.subjectId,
            subjectName: classItem.subjectName
        });
    };

    if (loading && !refreshing) {
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
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.card }]}>
                <View>
                    <Text style={[styles.greeting, { color: theme.text }]}>
                        Welcome back,
                    </Text>
                    <Text style={[styles.teacherName, { color: theme.text }]}>
                        {user?.name || 'Teacher'}
                    </Text>
                    <Text style={[styles.designation, { color: theme.textSecondary }]}>
                        {user?.designation || 'Teacher'}
                    </Text>
                </View>
                <Icon name="school" size={40} color={theme.primary} />
            </View>

            {/* Stats Cards */}
            <View style={styles.statsContainer}>
                <View style={[styles.statCard, { backgroundColor: theme.card }]}>
                    <Icon name="account-group" size={24} color={theme.primary} />
                    <Text style={[styles.statNumber, { color: theme.text }]}>
                        {classes.length}
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                        Classes
                    </Text>
                </View>

                <View style={[styles.statCard, { backgroundColor: theme.card }]}>
                    <Icon name="book-open" size={24} color={theme.success} />
                    <Text style={[styles.statNumber, { color: theme.text }]}>
                        {classes.reduce((total, cls) => total + (cls.subjectName ? 1 : 0), 0)}
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                        Subjects
                    </Text>
                </View>

                <View style={[styles.statCard, { backgroundColor: theme.card }]}>
                    <Icon name="calendar-check" size={24} color={theme.warning} />
                    <Text style={[styles.statNumber, { color: theme.text }]}>
                        Today
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                        {new Date().toLocaleDateString()}
                    </Text>
                </View>
            </View>

            {/* Classes Section */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>
                        My Classes
                    </Text>
                </View>

                {classes.map((classItem) => (
                    <TouchableOpacity
                        key={`${classItem.classId}-${classItem.sectionId}`}
                        style={[styles.classCard, { backgroundColor: theme.card }]}
                        onPress={() => handleClassPress(classItem)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.classCardHeader}>
                            <View style={[styles.classIcon, { backgroundColor: theme.primary + '20' }]}>
                                <Icon name="school" size={24} color={theme.primary} />
                            </View>
                            <View style={styles.classInfo}>
                                <Text style={[styles.className, { color: theme.text }]}>
                                    {classItem.className} - {classItem.sectionName}
                                </Text>
                                <Text style={[styles.subject, { color: theme.textSecondary }]}>
                                    {classItem.subjectName || 'Class Incharge'}
                                </Text>
                            </View>
                            <Icon name="chevron-right" size={24} color={theme.textSecondary} />
                        </View>

                        <View style={styles.classCardFooter}>
                            <TouchableOpacity
                                style={styles.classAction}
                                onPress={() => handleTakeAttendance(classItem)}
                            >
                                <Icon name="clipboard-check" size={16} color={theme.primary} />
                                <Text style={[styles.actionText, { color: theme.textSecondary }]}>
                                    Take Attendance
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}

                {classes.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <Icon name="school-outline" size={60} color={theme.textSecondary} />
                        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                            No classes assigned yet
                        </Text>
                        {error && (
                            <Text style={[styles.errorText, { color: theme.error }]}>
                                {error}
                            </Text>
                        )}
                    </View>
                )}
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Quick Actions
                </Text>
                <View style={styles.quickActions}>
                    {/* ✅ FIXED: Navigate to TeacherAttendance (Tab Navigator) */}
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: theme.card }]}
                        onPress={() => navigation.navigate('TeacherAttendance')}
                    >
                        <Icon name="clipboard-check" size={24} color={theme.primary} />
                        <Text style={[styles.actionText, { color: theme.text }]}>
                            Attendance
                        </Text>
                    </TouchableOpacity>

                    {/* ✅ FIXED: Navigate to TeacherClasses (Tab Navigator) */}
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: theme.card }]}
                        onPress={() => navigation.navigate('TeacherClasses')}
                    >
                        <Icon name="book-open" size={24} color={theme.success} />
                        <Text style={[styles.actionText, { color: theme.text }]}>
                            My Classes
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
    style={[styles.actionButton, { backgroundColor: theme.card }]}
    onPress={() => navigation.navigate('TeacherDiaryList')}
>
    <Icon name="book-open-variant" size={24} color={theme.info || '#2196F3'} />
    <Text style={[styles.actionText, { color: theme.text }]}>
        Diary
    </Text>
</TouchableOpacity>
                </View>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        margin: 15,
        borderRadius: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    greeting: {
        fontSize: 14,
        opacity: 0.8,
    },
    teacherName: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 2,
    },
    designation: {
        fontSize: 14,
        marginTop: 2,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        marginBottom: 20,
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
    statNumber: {
        fontSize: 22,
        fontWeight: 'bold',
        marginVertical: 5,
    },
    statLabel: {
        fontSize: 12,
    },
    section: {
        paddingHorizontal: 15,
        marginBottom: 25,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    classCard: {
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    classCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    classIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    classInfo: {
        flex: 1,
    },
    className: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    subject: {
        fontSize: 12,
    },
    classCardFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    classAction: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionText: {
        fontSize: 12,
        marginLeft: 4,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        marginTop: 10,
    },
    errorText: {
        fontSize: 14,
        marginTop: 10,
        textAlign: 'center',
    },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
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
});

export default TeacherDashboard;