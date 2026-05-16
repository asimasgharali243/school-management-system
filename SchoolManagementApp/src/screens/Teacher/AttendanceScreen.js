// src/screens/Teacher/AttendanceScreen.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    Modal,
    Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { selectThemeData } from '../../store/slices/themeSlice';
import {
    fetchTeacherClasses,
    selectTeacherClasses,
    selectTeacherLoading,
    clearError,
    fetchTodayAttendance,
    markAttendance,
    updateAttendanceStatus,
    clearAttendanceData
} from '../../store/slices/teacherSlice';

const AttendanceScreen = ({ navigation, route }) => {
    const theme = useSelector(selectThemeData);
    const dispatch = useDispatch();
    const classes = useSelector(selectTeacherClasses);
    const loading = useSelector((state) => state.teacher.loading);
    const attendanceLoading = useSelector((state) => state.teacher.attendanceLoading);

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [showClassModal, setShowClassModal] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Check if class is passed from navigation
    useEffect(() => {
        if (route.params?.classId) {
            const classItem = classes.find(
                c => c.classId === route.params.classId &&
                    c.sectionId === route.params.sectionId
            );
            if (classItem) {
                setSelectedClass(classItem);
                loadAttendance(classItem);
            }
        }
    }, [route.params, classes]);

    useEffect(() => {
        loadClasses();
    }, []);

    const loadClasses = async () => {
        await dispatch(fetchTeacherClasses());
    };

    const loadAttendance = async (classItem) => {
        await dispatch(fetchTodayAttendance({
            classId: classItem.classId,
            sectionId: classItem.sectionId
        }));
    };

    const onRefresh = async () => {
        setRefreshing(true);
        if (selectedClass) {
            await loadAttendance(selectedClass);
        }
        await loadClasses();
        setRefreshing(false);
    };

    const handleClassSelect = (classItem) => {
        setSelectedClass(classItem);
        setShowClassModal(false);
        loadAttendance(classItem);
    };

    const handleTakeAttendance = () => {
        if (!selectedClass) {
            Alert.alert('Select Class', 'Please select a class first');
            return;
        }
        navigation.navigate('MarkAttendance', {
            classId: selectedClass.classId,
            className: selectedClass.className,
            sectionId: selectedClass.sectionId,
            sectionName: selectedClass.sectionName
        });
    };

    const handleViewAttendance = () => {
        if (!selectedClass) {
            Alert.alert('Select Class', 'Please select a class first');
            return;
        }
        navigation.navigate('AttendanceReport', {
            classId: selectedClass.classId,
            className: selectedClass.className,
            sectionId: selectedClass.sectionId,
            sectionName: selectedClass.sectionName
        });
    };

    const renderClassItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.classItem, { backgroundColor: theme.card }]}
            onPress={() => handleClassSelect(item)}
        >
            <View style={styles.classItemContent}>
                <View style={[styles.classIcon, { backgroundColor: theme.primary + '20' }]}>
                    <Icon name="school" size={20} color={theme.primary} />
                </View>
                <View style={styles.classItemInfo}>
                    <Text style={[styles.classItemName, { color: theme.text }]}>
                        {item.className} - {item.sectionName}
                    </Text>
                    <Text style={[styles.classItemSubject, { color: theme.textSecondary }]}>
                        {item.subjectName || 'Class Incharge'}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderClassModal = () => (
        <Modal
            visible={showClassModal}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowClassModal(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>
                            Select Class
                        </Text>
                        <TouchableOpacity onPress={() => setShowClassModal(false)}>
                            <Icon name="close" size={24} color={theme.text} />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={classes}
                        renderItem={renderClassItem}
                        keyExtractor={(item) => `${item.classId}-${item.sectionId}`}
                        style={styles.classList}
                    />
                </View>
            </View>
        </Modal>
    );

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
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.card }]}>
                <View>
                    <Text style={[styles.title, { color: theme.text }]}>
                        Attendance Management
                    </Text>
                    <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                        Track and manage student attendance
                    </Text>
                </View>
                <Icon name="calendar-check" size={40} color={theme.primary} />
            </View>

            {/* Class Selection */}
            <View style={[styles.section, { backgroundColor: theme.card }]}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Select Class
                </Text>

                <TouchableOpacity
                    style={[styles.classSelector, { backgroundColor: theme.background }]}
                    onPress={() => setShowClassModal(true)}
                >
                    {selectedClass ? (
                        <View style={styles.selectedClass}>
                            <Text style={[styles.selectedClassName, { color: theme.text }]}>
                                {selectedClass.className} - {selectedClass.sectionName}
                            </Text>
                            <Text style={[styles.selectedClassSubject, { color: theme.textSecondary }]}>
                                {selectedClass.subjectName}
                            </Text>
                        </View>
                    ) : (
                        <Text style={[styles.placeholder, { color: theme.textSecondary }]}>
                            Tap to select class
                        </Text>
                    )}
                    <Icon name="chevron-down" size={24} color={theme.textSecondary} />
                </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            {selectedClass && (
                <View style={styles.actionsContainer}>
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: theme.primary }]}
                        onPress={handleTakeAttendance}
                        disabled={attendanceLoading}
                    >
                        {attendanceLoading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <>
                                <Icon name="clipboard-check" size={20} color="#FFFFFF" />
                                <Text style={styles.actionButtonText}>Take Attendance</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: theme.secondary }]}
                        onPress={handleViewAttendance}
                    >
                        <Icon name="chart-bar" size={20} color="#FFFFFF" />
                        <Text style={styles.actionButtonText}>View Reports</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Today's Summary */}
            <View style={[styles.section, { backgroundColor: theme.card }]}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Today's Summary ({selectedDate})
                </Text>
                <Text style={[styles.summaryText, { color: theme.textSecondary }]}>
                    {selectedClass
                        ? `Select class "${selectedClass.className}" to view attendance summary`
                        : 'Select a class to view attendance summary'
                    }
                </Text>
            </View>

            {/* Classes List */}
            {!selectedClass && (
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>
                        Available Classes
                    </Text>
                    {classes.length > 0 ? (
                        classes.map((classItem) => (
                            <TouchableOpacity
                                key={`${classItem.classId}-${classItem.sectionId}`}
                                style={[styles.classCard, { backgroundColor: theme.card }]}
                                onPress={() => handleClassSelect(classItem)}
                            >
                                <View style={styles.classCardContent}>
                                    <View style={[styles.cardIcon, { backgroundColor: theme.primary + '20' }]}>
                                        <Icon name="school" size={24} color={theme.primary} />
                                    </View>
                                    <View style={styles.cardInfo}>
                                        <Text style={[styles.cardClassName, { color: theme.text }]}>
                                            {classItem.className} - {classItem.sectionName}
                                        </Text>
                                        <Text style={[styles.cardSubject, { color: theme.textSecondary }]}>
                                            {classItem.subjectName}
                                        </Text>
                                    </View>
                                    <Icon name="chevron-right" size={20} color={theme.textSecondary} />
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Icon name="school-outline" size={60} color={theme.textSecondary} />
                            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                                No classes assigned
                            </Text>
                        </View>
                    )}
                </View>
            )}

            {renderClassModal()}
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
        marginBottom: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 14,
        marginTop: 4,
    },
    section: {
        padding: 15,
        marginHorizontal: 15,
        marginBottom: 15,
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    classSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderRadius: 8,
    },
    selectedClass: {
        flex: 1,
    },
    selectedClassName: {
        fontSize: 16,
        fontWeight: '600',
    },
    selectedClassSubject: {
        fontSize: 12,
        marginTop: 2,
    },
    placeholder: {
        fontSize: 16,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    actionButton: {
        flex: 1,
        marginHorizontal: 5,
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
    },
    summaryText: {
        fontSize: 14,
        textAlign: 'center',
        paddingVertical: 10,
    },
    classCard: {
        borderRadius: 8,
        marginBottom: 10,
        padding: 12,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    classCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    cardInfo: {
        flex: 1,
    },
    cardClassName: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 2,
    },
    cardSubject: {
        fontSize: 12,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 30,
    },
    emptyText: {
        fontSize: 16,
        marginTop: 10,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    classList: {
        marginTop: 10,
    },
    classItem: {
        padding: 15,
        borderRadius: 8,
        marginBottom: 8,
    },
    classItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    classItemInfo: {
        flex: 1,
        marginLeft: 12,
    },
    classItemName: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 2,
    },
    classItemSubject: {
        fontSize: 12,
    },
});

export default AttendanceScreen;