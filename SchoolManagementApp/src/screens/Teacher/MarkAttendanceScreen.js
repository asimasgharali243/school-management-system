// src/screens/Teacher/MarkAttendanceScreen.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator,
    Modal,
    FlatList,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { selectThemeData } from '../../store/slices/themeSlice';
import {
    fetchClassStudents,
    fetchTodayAttendance,
    markAttendance,
    updateAttendanceStatus,
    selectTeacherStudents,
    selectTeacherAttendance,
    selectTeacherTodayAttendance,
    clearAttendanceData
} from '../../store/slices/teacherSlice';

const MarkAttendanceScreen = ({ navigation, route }) => {
    const theme = useSelector(selectThemeData);
    const dispatch = useDispatch();
    const { classId, className, sectionId, sectionName } = route.params;

    const students = useSelector(selectTeacherStudents);
    const attendance = useSelector((state) => state.teacher.attendance);
    const todayAttendance = useSelector(selectTeacherTodayAttendance);
    const loading = useSelector((state) => state.teacher.loading);
    const attendanceLoading = useSelector((state) => state.teacher.attendanceLoading);

    const [remarks, setRemarks] = useState('');
    const [showRemarksModal, setShowRemarksModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [lateModal, setLateModal] = useState(false);
    const [leaveModal, setLeaveModal] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        await Promise.all([
            dispatch(fetchClassStudents({ classId, sectionId })),
            dispatch(fetchTodayAttendance({ classId, sectionId }))
        ]);
    };

    const getStudentAttendance = (studentId) => {
        const attendanceRecord = attendance.find(a => a.studentId === studentId);
        if (attendanceRecord) {
            return {
                status: attendanceRecord.status,
                lateStatus: attendanceRecord.lateStatus,
                remarks: attendanceRecord.remarks
            };
        }

        // If today's attendance already exists, use that
        if (todayAttendance?.attendanceTaken && todayAttendance?.attendanceRecords) {
            const todayRecord = todayAttendance.attendanceRecords.find(r => r.studentId === studentId);
            if (todayRecord) {
                return {
                    status: todayRecord.status,
                    lateStatus: todayRecord.lateStatus,
                    remarks: todayRecord.remarks
                };
            }
        }

        // Default to present
        return {
            status: 'P',
            lateStatus: 'OnTime',
            remarks: ''
        };
    };

    const handleStatusChange = (studentId, newStatus) => {
        const currentAttendance = getStudentAttendance(studentId);

        switch (newStatus) {
            case 'P':
                setSelectedStudent(studentId);
                setLateModal(true);
                break;
            case 'A':
                dispatch(updateAttendanceStatus({
                    studentId,
                    status: 'A',
                    lateStatus: '',
                    remarks: 'Absent'
                }));
                break;
            case 'L':
                setSelectedStudent(studentId);
                setLeaveModal(true);
                break;
        }
    };

    const handleLateSelect = (isLate) => {
        if (selectedStudent) {
            dispatch(updateAttendanceStatus({
                studentId: selectedStudent,
                status: 'P',
                lateStatus: isLate ? 'Late' : 'OnTime',
                remarks: isLate ? 'Late arrival' : ''
            }));
            setLateModal(false);
        }
    };

    const handleLeaveConfirm = (leaveRemarks) => {
        if (selectedStudent) {
            dispatch(updateAttendanceStatus({
                studentId: selectedStudent,
                status: 'L',
                lateStatus: '',
                remarks: leaveRemarks || 'Leave'
            }));
            setLeaveModal(false);
            setSelectedStudent(null);
        }
    };

    const handleSaveAttendance = async () => {
        if (students.length === 0) {
            Alert.alert('No Students', 'No students found in this class');
            return;
        }

        // Prepare attendance records
        const attendanceRecords = students.map(student => {
            const studentAttendance = getStudentAttendance(student.studentId);
            return {
                studentId: student.studentId,
                status: studentAttendance.status,
                lateStatus: studentAttendance.lateStatus,
                remarks: studentAttendance.remarks
            };
        });

        const attendanceData = {
            classId,
            sectionId,
            attendanceRecords,
            remarks
        };

        const result = await dispatch(markAttendance(attendanceData));

        if (result.payload?.success) {
            Alert.alert(
                'Success',
                `Attendance saved successfully for ${students.length} students`,
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack()
                    }
                ]
            );
        } else {
            Alert.alert('Error', result.payload?.message || 'Failed to save attendance');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'P': return theme.success;
            case 'A': return theme.error;
            case 'L': return theme.warning;
            default: return theme.textSecondary;
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'P': return 'check-circle';
            case 'A': return 'close-circle';
            case 'L': return 'calendar-clock';
            default: return 'circle-outline';
        }
    };

    const renderStudentItem = ({ item }) => {
        const attendance = getStudentAttendance(item.studentId);

        return (
            <View style={[styles.studentCard, { backgroundColor: theme.card }]}>
                <View style={styles.studentInfo}>
                    <View style={[styles.avatar, { backgroundColor: theme.primary + '20' }]}>
                        <Text style={[styles.avatarText, { color: theme.primary }]}>
                            {item.name.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                    <View style={styles.studentDetails}>
                        <Text style={[styles.studentName, { color: theme.text }]}>
                            {item.name}
                        </Text>
                        <Text style={[styles.studentRollNo, { color: theme.textSecondary }]}>
                            Roll No: {item.rollNo}
                        </Text>
                        {attendance.remarks && (
                            <Text style={[styles.remarks, { color: theme.textSecondary }]}>
                                {attendance.remarks}
                            </Text>
                        )}
                    </View>
                </View>

                <View style={styles.statusContainer}>
                    {/* Present Button */}
                    <TouchableOpacity
                        style={[
                            styles.statusButton,
                            attendance.status === 'P' && { backgroundColor: theme.success + '20' },
                            { borderColor: attendance.status === 'P' ? theme.success : theme.border }
                        ]}
                        onPress={() => handleStatusChange(item.studentId, 'P')}
                    >
                        <Icon
                            name={attendance.status === 'P' ? 'check-circle' : 'circle-outline'}
                            size={20}
                            color={attendance.status === 'P' ? theme.success : theme.textSecondary}
                        />
                        <Text style={[
                            styles.statusText,
                            { color: attendance.status === 'P' ? theme.success : theme.textSecondary }
                        ]}>
                            P
                        </Text>
                    </TouchableOpacity>

                    {/* Absent Button */}
                    <TouchableOpacity
                        style={[
                            styles.statusButton,
                            attendance.status === 'A' && { backgroundColor: theme.error + '20' },
                            { borderColor: attendance.status === 'A' ? theme.error : theme.border }
                        ]}
                        onPress={() => handleStatusChange(item.studentId, 'A')}
                    >
                        <Icon
                            name={attendance.status === 'A' ? 'close-circle' : 'circle-outline'}
                            size={20}
                            color={attendance.status === 'A' ? theme.error : theme.textSecondary}
                        />
                        <Text style={[
                            styles.statusText,
                            { color: attendance.status === 'A' ? theme.error : theme.textSecondary }
                        ]}>
                            A
                        </Text>
                    </TouchableOpacity>

                    {/* Leave Button */}
                    <TouchableOpacity
                        style={[
                            styles.statusButton,
                            attendance.status === 'L' && { backgroundColor: theme.warning + '20' },
                            { borderColor: attendance.status === 'L' ? theme.warning : theme.border }
                        ]}
                        onPress={() => handleStatusChange(item.studentId, 'L')}
                    >
                        <Icon
                            name={attendance.status === 'L' ? 'calendar-clock' : 'calendar'}
                            size={20}
                            color={attendance.status === 'L' ? theme.warning : theme.textSecondary}
                        />
                        <Text style={[
                            styles.statusText,
                            { color: attendance.status === 'L' ? theme.warning : theme.textSecondary }
                        ]}>
                            L
                        </Text>
                    </TouchableOpacity>

                    {/* Remarks Button */}
                    <TouchableOpacity
                        style={[styles.remarksButton, { borderColor: theme.border }]}
                        onPress={() => {
                            setSelectedStudent(item.studentId);
                            setShowRemarksModal(true);
                        }}
                    >
                        <Icon name="note-text" size={18} color={theme.textSecondary} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.card }]}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrow-left" size={24} color={theme.text} />
                    </TouchableOpacity>
                    <View style={styles.headerInfo}>
                        <Text style={[styles.headerTitle, { color: theme.text }]}>
                            {className} - {sectionName}
                        </Text>
                        <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
                            {students.length} students • {new Date().toLocaleDateString()}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
                <View style={[styles.statCard, { backgroundColor: theme.card }]}>
                    <Text style={[styles.statNumber, { color: theme.text }]}>
                        {students.filter(s => getStudentAttendance(s.studentId).status === 'P').length}
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Present</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: theme.card }]}>
                    <Text style={[styles.statNumber, { color: theme.text }]}>
                        {students.filter(s => getStudentAttendance(s.studentId).status === 'A').length}
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Absent</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: theme.card }]}>
                    <Text style={[styles.statNumber, { color: theme.text }]}>
                        {students.filter(s => getStudentAttendance(s.studentId).status === 'L').length}
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Leave</Text>
                </View>
            </View>

            {/* Students List */}
            <FlatList
                data={students}
                renderItem={renderStudentItem}
                keyExtractor={(item) => item.studentId.toString()}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Icon name="account-group" size={60} color={theme.textSecondary} />
                        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                            No students found
                        </Text>
                    </View>
                }
            />

            {/* Action Bar */}
            <View style={[styles.actionBar, { backgroundColor: theme.card }]}>
                <TextInput
                    style={[styles.remarksInput, {
                        backgroundColor: theme.background,
                        color: theme.text,
                        borderColor: theme.border
                    }]}
                    placeholder="General remarks..."
                    placeholderTextColor={theme.textSecondary}
                    value={remarks}
                    onChangeText={setRemarks}
                />
                <TouchableOpacity
                    style={[styles.saveButton, { backgroundColor: theme.primary }]}
                    onPress={handleSaveAttendance}
                    disabled={attendanceLoading}
                >
                    {attendanceLoading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <>
                            <Icon name="check" size={20} color="#FFFFFF" />
                            <Text style={styles.saveButtonText}>Save Attendance</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>

            {/* Late Modal */}
            <Modal
                visible={lateModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setLateModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>
                            Mark as Present
                        </Text>
                        <Text style={[styles.modalText, { color: theme.textSecondary }]}>
                            Is the student late?
                        </Text>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: theme.success }]}
                                onPress={() => handleLateSelect(false)}
                            >
                                <Icon name="clock-check" size={20} color="#FFFFFF" />
                                <Text style={styles.modalButtonText}>On Time</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: theme.warning }]}
                                onPress={() => handleLateSelect(true)}
                            >
                                <Icon name="clock-alert" size={20} color="#FFFFFF" />
                                <Text style={styles.modalButtonText}>Late</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={[styles.modalCancel, { borderColor: theme.border }]}
                            onPress={() => setLateModal(false)}
                        >
                            <Text style={[styles.modalCancelText, { color: theme.text }]}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Leave Modal */}
            <Modal
                visible={leaveModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setLeaveModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>
                            Mark as Leave
                        </Text>

                        <TextInput
                            style={[styles.leaveInput, {
                                backgroundColor: theme.background,
                                color: theme.text,
                                borderColor: theme.border
                            }]}
                            placeholder="Enter leave reason..."
                            placeholderTextColor={theme.textSecondary}
                            multiline
                            numberOfLines={3}
                            onChangeText={(text) => setSelectedStudent(prev => ({ ...prev, leaveReason: text }))}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: theme.success }]}
                                onPress={() => handleLeaveConfirm(selectedStudent?.leaveReason)}
                            >
                                <Icon name="check" size={20} color="#FFFFFF" />
                                <Text style={styles.modalButtonText}>Confirm</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalCancel, { borderColor: theme.border }]}
                                onPress={() => setLeaveModal(false)}
                            >
                                <Text style={[styles.modalCancelText, { color: theme.text }]}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
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
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    statCard: {
        flex: 1,
        marginHorizontal: 5,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 12,
    },
    listContainer: {
        padding: 15,
        paddingBottom: 80, // Space for action bar
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
    studentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    studentDetails: {
        flex: 1,
    },
    studentName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    studentRollNo: {
        fontSize: 12,
    },
    remarks: {
        fontSize: 11,
        marginTop: 2,
        fontStyle: 'italic',
    },
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusButton: {
        flex: 1,
        marginHorizontal: 2,
        paddingVertical: 8,
        borderRadius: 6,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    statusText: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
    remarksButton: {
        padding: 8,
        borderRadius: 6,
        borderWidth: 1,
        marginLeft: 5,
    },
    actionBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        padding: 15,
        borderTopWidth: 1,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    remarksInput: {
        flex: 1,
        padding: 10,
        borderRadius: 6,
        borderWidth: 1,
        marginRight: 10,
        fontSize: 14,
    },
    saveButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
        marginLeft: 5,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        marginTop: 10,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        borderRadius: 12,
        padding: 20,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalText: {
        fontSize: 14,
        marginBottom: 20,
        textAlign: 'center',
    },
    leaveInput: {
        borderWidth: 1,
        borderRadius: 6,
        padding: 10,
        marginBottom: 20,
        textAlignVertical: 'top',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        flex: 1,
        marginHorizontal: 5,
        paddingVertical: 12,
        borderRadius: 6,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        marginLeft: 5,
    },
    modalCancel: {
        flex: 1,
        marginHorizontal: 5,
        paddingVertical: 12,
        borderRadius: 6,
        borderWidth: 1,
        alignItems: 'center',
    },
    modalCancelText: {
        fontWeight: '600',
    },
});

export default MarkAttendanceScreen;