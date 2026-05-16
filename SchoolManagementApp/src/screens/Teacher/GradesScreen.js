// src/screens/Teacher/GradesScreen.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    FlatList,
    TextInput,
    ActivityIndicator,
    RefreshControl,
    Modal,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { selectThemeData } from '../../store/slices/themeSlice';

const GradesScreen = ({ navigation }) => {
    const theme = useSelector(selectThemeData);

    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [showClassModal, setShowClassModal] = useState(false);
    const [showSubjectModal, setShowSubjectModal] = useState(false);
    const [gradesData, setGradesData] = useState([]);
    const [newGrade, setNewGrade] = useState({
        subject: '',
        examType: '',
        totalMarks: '',
        obtainedMarks: '',
        grade: '',
        remarks: '',
    });

    useEffect(() => {
        fetchGradesData();
    }, []);

    const fetchGradesData = async () => {
        setLoading(true);
        // Mock data - replace with API
        setTimeout(() => {
            setClasses([
                { id: 1, name: 'Class 5A', subject: 'Mathematics' },
                { id: 2, name: 'Class 6B', subject: 'Science' },
                { id: 3, name: 'Class 7C', subject: 'English' },
            ]);

            setGradesData([
                { id: 1, studentName: 'John Doe', rollNo: '101', grade: 'A', marks: '95/100' },
                { id: 2, studentName: 'Jane Smith', rollNo: '102', grade: 'A-', marks: '88/100' },
                { id: 3, studentName: 'Robert Johnson', rollNo: '103', grade: 'B+', marks: '85/100' },
                { id: 4, studentName: 'Emily Davis', rollNo: '104', grade: 'B', marks: '82/100' },
                { id: 5, studentName: 'Michael Wilson', rollNo: '105', grade: 'A', marks: '92/100' },
            ]);

            setSelectedClass({ id: 1, name: 'Class 5A', subject: 'Mathematics' });
            setSelectedSubject('Mathematics');
            setLoading(false);
        }, 1000);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchGradesData();
        setRefreshing(false);
    };

    const handleClassSelect = (classItem) => {
        setSelectedClass(classItem);
        setSelectedSubject(classItem.subject);
        setShowClassModal(false);
        // Fetch grades for selected class
    };

    const handleSubjectSelect = (subject) => {
        setSelectedSubject(subject);
        setShowSubjectModal(false);
        // Fetch grades for selected subject
    };

    const handleAddGrade = () => {
        // Navigate to add grade screen or show modal
        console.log('Add new grade');
    };

    const handleEditGrade = (student) => {
        // Navigate to edit grade screen
        console.log('Edit grade for:', student.studentName);
    };

    const handleViewReport = () => {
        // Navigate to grade report screen
        console.log('View grade report');
    };

    const renderGradeItem = ({ item }) => (
        <View style={[styles.gradeCard, { backgroundColor: theme.card }]}>
            <View style={styles.studentInfo}>
                <Text style={[styles.studentName, { color: theme.text }]}>
                    {item.studentName}
                </Text>
                <Text style={[styles.rollNo, { color: theme.textSecondary }]}>
                    Roll No: {item.rollNo}
                </Text>
            </View>

            <View style={styles.gradeInfo}>
                <View style={[styles.gradeBadge, { backgroundColor: getGradeColor(item.grade, theme) }]}>
                    <Text style={styles.gradeText}>{item.grade}</Text>
                </View>
                <Text style={[styles.marks, { color: theme.textSecondary }]}>
                    {item.marks}
                </Text>
            </View>

            <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditGrade(item)}
            >
                <Icon name="pencil" size={20} color={theme.primary} />
            </TouchableOpacity>
        </View>
    );

    const getGradeColor = (grade, theme) => {
        const gradeColors = {
            'A+': theme.success,
            'A': theme.success,
            'A-': '#4CAF50',
            'B+': '#8BC34A',
            'B': theme.warning,
            'B-': '#FF9800',
            'C+': '#FF9800',
            'C': theme.error,
            'D': '#F44336',
            'F': '#D32F2F',
        };
        return gradeColors[grade] || theme.primary;
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
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.card }]}>
                <View>
                    <Text style={[styles.title, { color: theme.text }]}>
                        Grades Management
                    </Text>
                    <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                        Enter and manage student grades
                    </Text>
                </View>
                <Icon name="school" size={40} color={theme.primary} />
            </View>

            {/* Filters */}
            <View style={styles.filtersContainer}>
                <TouchableOpacity
                    style={[styles.filterButton, { backgroundColor: theme.card }]}
                    onPress={() => setShowClassModal(true)}
                >
                    <Icon name="school" size={20} color={theme.primary} style={styles.filterIcon} />
                    <Text style={[styles.filterText, { color: theme.text }]}>
                        {selectedClass?.name || 'Select Class'}
                    </Text>
                    <Icon name="chevron-down" size={20} color={theme.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.filterButton, { backgroundColor: theme.card }]}
                    onPress={() => setShowSubjectModal(true)}
                >
                    <Icon name="book" size={20} color={theme.primary} style={styles.filterIcon} />
                    <Text style={[styles.filterText, { color: theme.text }]}>
                        {selectedSubject || 'Select Subject'}
                    </Text>
                    <Icon name="chevron-down" size={20} color={theme.textSecondary} />
                </TouchableOpacity>
            </View>

            {/* Stats */}
            <View style={[styles.statsCard, { backgroundColor: theme.card }]}>
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: theme.text }]}>
                        {gradesData.length}
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                        Students
                    </Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: theme.success }]}>
                        {gradesData.filter(g => g.grade === 'A' || g.grade === 'A+').length}
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                        A Grades
                    </Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: theme.text }]}>
                        {calculateAverageGrade(gradesData)}
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                        Avg Grade
                    </Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: theme.warning }]}>
                        85%
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                        Pass Rate
                    </Text>
                </View>
            </View>

            {/* Actions */}
            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.primary }]}
                    onPress={handleAddGrade}
                >
                    <Icon name="plus" size={20} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Add Grades</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border }]}
                    onPress={handleViewReport}
                >
                    <Icon name="chart-bar" size={20} color={theme.text} />
                    <Text style={[styles.actionButtonText, { color: theme.text }]}>
                        View Report
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Grades List */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>
                        Student Grades
                    </Text>
                    <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
                        {selectedClass?.name} • {selectedSubject}
                    </Text>
                </View>

                <FlatList
                    data={gradesData}
                    renderItem={renderGradeItem}
                    keyExtractor={(item) => item.id.toString()}
                    scrollEnabled={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Icon name="clipboard-text" size={60} color={theme.textSecondary} />
                            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                                No grades entered yet
                            </Text>
                            <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
                                Add grades using the button above
                            </Text>
                        </View>
                    }
                />
            </View>

            {/* Class Selection Modal */}
            <Modal
                visible={showClassModal}
                transparent
                animationType="slide"
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
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.modalItem,
                                        selectedClass?.id === item.id && { backgroundColor: theme.primary + '20' },
                                    ]}
                                    onPress={() => handleClassSelect(item)}
                                >
                                    <Icon name="school" size={20} color={theme.primary} />
                                    <Text style={[styles.modalItemText, { color: theme.text }]}>
                                        {item.name} - {item.subject}
                                    </Text>
                                    {selectedClass?.id === item.id && (
                                        <Icon name="check" size={20} color={theme.primary} />
                                    )}
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item) => item.id.toString()}
                        />
                    </View>
                </View>
            </Modal>

            {/* Subject Selection Modal */}
            <Modal
                visible={showSubjectModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowSubjectModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: theme.text }]}>
                                Select Subject
                            </Text>
                            <TouchableOpacity onPress={() => setShowSubjectModal(false)}>
                                <Icon name="close" size={24} color={theme.text} />
                            </TouchableOpacity>
                        </View>

                        {['Mathematics', 'Science', 'English', 'History', 'Geography', 'Physics', 'Chemistry'].map((subject) => (
                            <TouchableOpacity
                                key={subject}
                                style={[
                                    styles.modalItem,
                                    selectedSubject === subject && { backgroundColor: theme.primary + '20' },
                                ]}
                                onPress={() => handleSubjectSelect(subject)}
                            >
                                <Icon name="book" size={20} color={theme.primary} />
                                <Text style={[styles.modalItemText, { color: theme.text }]}>
                                    {subject}
                                </Text>
                                {selectedSubject === subject && (
                                    <Icon name="check" size={20} color={theme.primary} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const calculateAverageGrade = (grades) => {
    const gradeValues = {
        'A+': 4.0, 'A': 4.0, 'A-': 3.7,
        'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'D': 1.0, 'F': 0.0,
    };

    const total = grades.reduce((sum, grade) => {
        return sum + (gradeValues[grade.grade] || 0);
    }, 0);

    return (total / grades.length).toFixed(1) || '0.0';
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
    filtersContainer: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    filterButton: {
        flex: 1,
        marginHorizontal: 5,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 10,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    filterIcon: {
        marginRight: 8,
    },
    filterText: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
    },
    statsCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 15,
        marginBottom: 20,
        padding: 20,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 12,
    },
    actionsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    actionButton: {
        flex: 1,
        marginHorizontal: 5,
        paddingVertical: 12,
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
    section: {
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    sectionHeader: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    sectionSubtitle: {
        fontSize: 14,
        marginTop: 2,
    },
    gradeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    studentInfo: {
        flex: 1,
    },
    studentName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    rollNo: {
        fontSize: 12,
    },
    gradeInfo: {
        alignItems: 'center',
        marginHorizontal: 15,
    },
    gradeBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        marginBottom: 5,
    },
    gradeText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    marks: {
        fontSize: 12,
    },
    editButton: {
        padding: 5,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 15,
    },
    emptySubtext: {
        fontSize: 14,
        marginTop: 5,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '70%',
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
    modalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 10,
        marginBottom: 5,
    },
    modalItemText: {
        flex: 1,
        fontSize: 16,
        marginLeft: 10,
    },
});

export default GradesScreen;