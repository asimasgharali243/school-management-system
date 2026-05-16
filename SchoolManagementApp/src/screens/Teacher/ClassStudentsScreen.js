import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    FlatList
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { selectThemeData } from '../../store/slices/themeSlice';
import { fetchClassStudents, selectClassStudents, selectStudentsLoading } from '../../store/slices/teacherSlice';

const ClassStudentsScreen = ({ route, navigation }) => {
    const theme = useSelector(selectThemeData);
    const dispatch = useDispatch();
    const students = useSelector(selectClassStudents);
    const loading = useSelector(selectStudentsLoading);
    const [refreshing, setRefreshing] = useState(false);

    // Get parameters from navigation
    const { classId, sectionId, className, sectionName, subjectName } = route.params;

    useEffect(() => {
        loadStudents();
    }, [classId, sectionId]);

    const loadStudents = async () => {
        await dispatch(fetchClassStudents({ classId, sectionId }));
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadStudents();
        setRefreshing(false);
    };

    const handleStudentPress = (student) => {
        navigation.navigate('StudentDetails', {
            studentId: student.id || student.studentId,
            studentName: student.name,
            className,
            sectionName
        });
    };

    const renderStudentItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.studentCard, { backgroundColor: theme.card }]}
            onPress={() => handleStudentPress(item)}
            activeOpacity={0.7}
        >
            <View style={styles.studentCardContent}>
                <View style={[styles.avatar, { backgroundColor: theme.primary + '20' }]}>
                    <Icon name="account" size={24} color={theme.primary} />
                </View>
                <View style={styles.studentInfo}>
                    <Text style={[styles.studentName, { color: theme.text }]}>
                        {item.name || `${item.firstName} ${item.lastName}`}
                    </Text>
                    <Text style={[styles.studentId, { color: theme.textSecondary }]}>
                        Roll No: {item.rollNumber || item.rollNo || 'N/A'}
                    </Text>
                    <Text style={[styles.studentEmail, { color: theme.textSecondary }]}>
                        {item.email || item.parentEmail || 'N/A'}
                    </Text>
                </View>
                <Icon name="chevron-right" size={20} color={theme.textSecondary} />
            </View>
        </TouchableOpacity>
    );

    if (loading && !refreshing) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Class Header */}
            <View style={[styles.classHeader, { backgroundColor: theme.card }]}>
                <View style={styles.classHeaderContent}>
                    <Icon name="school" size={30} color={theme.primary} />
                    <View style={styles.classInfo}>
                        <Text style={[styles.classTitle, { color: theme.text }]}>
                            {className} - {sectionName}
                        </Text>
                        <Text style={[styles.classSubject, { color: theme.textSecondary }]}>
                            {subjectName || 'Class Incharge'}
                        </Text>
                        <Text style={[styles.studentCount, { color: theme.textSecondary }]}>
                            Total Students: {students.length}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Students List */}
            <FlatList
                data={students}
                renderItem={renderStudentItem}
                keyExtractor={(item) => item.id || item.studentId || Math.random().toString()}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[theme.primary]}
                    />
                }
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Icon name="account-group-outline" size={60} color={theme.textSecondary} />
                        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                            No students found
                        </Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    classHeader: {
        padding: 20,
        margin: 15,
        marginBottom: 10,
        borderRadius: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    classHeaderContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    classInfo: {
        flex: 1,
        marginLeft: 15,
    },
    classTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    classSubject: {
        fontSize: 14,
        marginBottom: 5,
    },
    studentCount: {
        fontSize: 12,
    },
    listContainer: {
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    studentCard: {
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    studentCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    studentInfo: {
        flex: 1,
    },
    studentName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    studentId: {
        fontSize: 12,
        marginBottom: 2,
    },
    studentEmail: {
        fontSize: 12,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        marginTop: 10,
    },
});

export default ClassStudentsScreen;