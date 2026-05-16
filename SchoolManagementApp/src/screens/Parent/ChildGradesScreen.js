

// screens/Parent/ChildGradesScreen.js
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    FlatList,
    Dimensions,
    Modal,
    Alert,
    SafeAreaView,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { selectThemeData } from '../../store/slices/themeSlice';
import {
    useGetChildGradesQuery,
    useGetChildGradeStatsQuery,
    useGetChildSubjectsWithGradesQuery,
    useGetExamBatchesQuery,
    useGetAcademicYearsQuery,
    useDownloadGradeReportMutation,
} from '../../store/gradesApi';

const { width } = Dimensions.get('window');

const ChildGradesScreen = ({ route, navigation }) => {
    const theme = useSelector(selectThemeData);
    const { childId, childName, childClassId, childSectionId, childRollNo } = route.params;

    // State for filters
    const [filters, setFilters] = useState({
        subjectId: null,
        batchId: null,
        yearId: null,
        dateFrom: null,
        dateTo: null,
    });
    const [selectedSubject, setSelectedSubject] = useState('All');
    const [showFilters, setShowFilters] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // RTK Query hooks
    const {
        data: gradesData = [],
        isLoading: gradesLoading,
        isError: gradesError,
        error: gradesErrorDetails,
        refetch: refetchGrades,
    } = useGetChildGradesQuery({ childId, filters }, {
        skip: !childId,
    });

    console.log('Grades Data:', gradesData);
    const {
        data: statsData = {},
        isLoading: statsLoading,
        isError: statsError,
        refetch: refetchStats,
    } = useGetChildGradeStatsQuery({ childId, filters }, {
        skip: !childId,
    });

    console.log('Stats Data:', statsData);
    const {
        data: subjectsData = [],
        isLoading: subjectsLoading,
    } = useGetChildSubjectsWithGradesQuery(childId, {
        skip: !childId,
    });

    console.log('Subjects Data:', subjectsData);
    const {
        data: examBatches = [],
    } = useGetExamBatchesQuery({ classId: childClassId, sectionId: childSectionId }, {
        skip: !childClassId || !childSectionId,
    });

    console.log('Exam Batches:', examBatches);
    const {
        data: academicYears = [],
    } = useGetAcademicYearsQuery();
    console.log('Academic Years:', academicYears);
    const [downloadReport, { isLoading: downloading }] = useDownloadGradeReportMutation();

    // Check if we have any data
    const hasGrades = Array.isArray(gradesData) && gradesData.length > 0;
    const isLoading = gradesLoading || statsLoading || subjectsLoading;

    // Prepare subjects list for filter
    const subjectsList = useMemo(() => {
        const allOption = { id: null, name: 'All', colorCode: theme.primary };
        const subjectOptions = Array.isArray(subjectsData)
            ? subjectsData.map(s => ({
                id: s.id,
                name: s.name,
                colorCode: s.colorCode || getRandomColor(s.id)
            }))
            : [];
        return [allOption, ...subjectOptions];
    }, [subjectsData, theme.primary]);

    // Prepare subject performance data
    const subjectPerformance = useMemo(() => {
        if (!statsData?.subjectPerformance || !Array.isArray(statsData.subjectPerformance)) {
            return [];
        }
        return statsData.subjectPerformance.map(sp => ({
            subject: sp.subjectName || 'Unknown',
            percentage: sp.averagePercentage || 0,
            color: subjectsList.find(s => s.name === sp.subjectName)?.colorCode || theme.primary,
        }));
    }, [statsData, subjectsList, theme.primary]);

    // Prepare trend data
    const trendData = useMemo(() => {
        if (!statsData?.performanceTrend || !Array.isArray(statsData.performanceTrend)) {
            return [];
        }
        return statsData.performanceTrend;
    }, [statsData]);

    // Handle subject selection
    const handleSubjectSelect = useCallback((subject) => {
        if (subject.name === 'All') {
            setSelectedSubject('All');
            setFilters(prev => ({ ...prev, subjectId: null }));
        } else {
            setSelectedSubject(subject.name);
            setFilters(prev => ({ ...prev, subjectId: subject.id }));
        }
    }, []);

    // Apply filters
    const applyFilters = useCallback((newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setShowFilters(false);
    }, []);

    // Reset filters
    const resetFilters = useCallback(() => {
        setFilters({
            subjectId: null,
            batchId: null,
            yearId: null,
            dateFrom: null,
            dateTo: null,
        });
        setSelectedSubject('All');
        setShowFilters(false);
    }, []);

    // Handle refresh
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await Promise.all([refetchGrades(), refetchStats()]);
        setRefreshing(false);
    }, [refetchGrades, refetchStats]);

    // Handle download report
    const handleDownloadReport = useCallback(async () => {
        try {
            Alert.alert(
                'Download Report',
                'Do you want to download the grade report?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Download',
                        onPress: async () => {
                            const result = await downloadReport({ childId, filters }).unwrap();
                            Alert.alert('Success', 'Report downloaded successfully!');
                        }
                    }
                ]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to download report. Please try again.');
        }
    }, [childId, filters, downloadReport]);

    // Handle view full report
    const handleViewReport = useCallback(() => {
        navigation.navigate('GradeReportDetail', {
            childId,
            childName,
            childClassId,
            childSectionId,
            childRollNo,
            filters,
        });
    }, [childId, childName, childClassId, childSectionId, childRollNo, filters, navigation]);

    // Get grade color
    const getGradeColor = useCallback((grade) => {
        const gradeColors = {
            'A+': '#27ae60',
            'A': '#2ecc71',
            'A-': '#4CAF50',
            'B+': '#8BC34A',
            'B': '#f39c12',
            'B-': '#FF9800',
            'C+': '#f1c40f',
            'C': '#e67e22',
            'C-': '#e74c3c',
            'D': '#e74c3c',
            'F': '#c0392b',
        };
        return gradeColors[grade] || theme.primary;
    }, [theme.primary]);

    // Get status color
    const getStatusColor = useCallback((status) => {
        return status?.toLowerCase() === 'pass' ? '#27ae60' : '#e74c3c';
    }, []);

    // Render grade item
    const renderGradeItem = ({ item }) => {
        return (
            <View style={[styles.gradeCard, { backgroundColor: theme.card }]}>
                <View style={styles.gradeHeader}>
                    <View style={styles.gradeHeaderLeft}>
                        <Text style={[styles.subjectName, { color: theme.text }]}>
                            {item.subjectName}
                        </Text>
                        <Text style={[styles.examType, { color: theme.textSecondary }]}>
                            {item.examType} • {item.batchName}
                        </Text>
                        <Text style={[styles.examDate, { color: theme.textSecondary }]}>
                            {item.examDate}
                        </Text>
                        <Text style={[styles.teacherName, { color: theme.textSecondary, fontSize: 12 }]}>
                            Teacher: {item.teacherName}
                        </Text>
                    </View>
                    <View style={styles.gradeHeaderRight}>
                        <View style={[styles.gradeBadge, { backgroundColor: getGradeColor(item.grade) + '20' }]}>
                            <Text style={[styles.gradeText, { color: getGradeColor(item.grade) }]}>
                                {item.grade}
                            </Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                                {item.status}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.gradeDetails}>
                    <View style={styles.detailRow}>
                        <View style={styles.detailItem}>
                            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
                                Obtained Marks
                            </Text>
                            <Text style={[styles.detailValue, { color: theme.text }]}>
                                {item.obtainedMarks.toFixed(1)}
                            </Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
                                Total Marks
                            </Text>
                            <Text style={[styles.detailValue, { color: theme.text }]}>
                                {item.totalMarks}
                            </Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
                                Passing Marks
                            </Text>
                            <Text style={[styles.detailValue, { color: theme.text }]}>
                                {item.passingMarks}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.progressContainer}>
                        <View style={styles.progressHeader}>
                            <Text style={[styles.progressLabel, { color: theme.textSecondary }]}>
                                Percentage
                            </Text>
                            <Text style={[styles.progressValue, { color: theme.text }]}>
                                {item.percentage}%
                            </Text>
                        </View>
                        <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
                            <View
                                style={[
                                    styles.progressFill,
                                    {
                                        width: `${item.percentage}%`,
                                        backgroundColor: getGradeColor(item.grade)
                                    }
                                ]}
                            />
                        </View>
                    </View>

                    {item.remarks && (
                        <View style={[styles.remarksContainer, { backgroundColor: theme.border + '20' }]}>
                            <Icon name="comment-text-outline" size={16} color={theme.textSecondary} />
                            <Text style={[styles.remarksText, { color: theme.textSecondary }]}>
                                {item.remarks}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    // Render empty state
    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Icon name="clipboard-text-outline" size={80} color={theme.textSecondary} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
                No Grades Available
            </Text>
            <Text style={[styles.emptyMessage, { color: theme.textSecondary }]}>
                {childName} doesn't have any grade records yet.
            </Text>
            <Text style={[styles.emptyHint, { color: theme.textSecondary }]}>
                Grades will appear here once they are entered by teachers.
            </Text>
            <TouchableOpacity
                style={[styles.refreshButton, { backgroundColor: theme.primary }]}
                onPress={onRefresh}
            >
                <Icon name="refresh" size={20} color="#FFFFFF" />
                <Text style={styles.refreshButtonText}>Check Again</Text>
            </TouchableOpacity>
        </View>
    );

    // Loading state
    if (isLoading && !refreshing) {
        return (
            <View style={[styles.container, styles.centerContent, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={[styles.loadingText, { color: theme.text }]}>Loading grades...</Text>
            </View>
        );
    }

    // Error state
    if (gradesError || statsError) {
        return (
            <View style={[styles.container, styles.centerContent, { backgroundColor: theme.background }]}>
                <Icon name="alert-circle" size={60} color={theme.error} />
                <Text style={[styles.errorText, { color: theme.text }]}>
                    Failed to load grades. Please check your connection.
                </Text>
                <TouchableOpacity
                    style={[styles.retryButton, { backgroundColor: theme.primary }]}
                    onPress={onRefresh}
                >
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.card }]}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <Icon name="arrow-left" size={24} color={theme.text} />
                    </TouchableOpacity>
                    <View>
                        <Text style={[styles.title, { color: theme.text }]}>
                            {childName}'s Grades
                        </Text>
                        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                            Roll No: {childRollNo || 'N/A'}
                        </Text>
                    </View>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity
                        style={[styles.filterButton, { backgroundColor: theme.card }]}
                        onPress={() => setShowFilters(true)}
                    >
                        <Icon name="filter-variant" size={24} color={theme.primary} />
                        {Object.values(filters).some(f => f !== null) && (
                            <View style={[styles.filterBadge, { backgroundColor: theme.error }]} />
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[theme.primary]}
                        tintColor={theme.primary}
                    />
                }
                showsVerticalScrollIndicator={false}
            >
                {/* Subject Filter */}
                {subjectsList.length > 1 && (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.subjectScroll}
                        contentContainerStyle={styles.subjectContainer}
                    >
                        {subjectsList.map((subject) => (
                            <TouchableOpacity
                                key={subject.id || 'all'}
                                style={[
                                    styles.subjectChip,
                                    { backgroundColor: theme.card },
                                    selectedSubject === subject.name && {
                                        backgroundColor: subject.colorCode,
                                    },
                                ]}
                                onPress={() => handleSubjectSelect(subject)}
                            >
                                <Text
                                    style={[
                                        styles.subjectChipText,
                                        { color: theme.textSecondary },
                                        selectedSubject === subject.name && { color: '#FFFFFF' },
                                    ]}
                                >
                                    {subject.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}

                {/* Stats Summary */}
                {hasGrades && (
                    <View style={[styles.statsCard, { backgroundColor: theme.card }]}>
                        <View style={styles.statsGrid}>
                            <View style={styles.statItem}>
                                <Text style={[styles.statValue, { color: theme.text }]}>
                                    {statsData?.averagePercentage || 0}%
                                </Text>
                                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                                    Average
                                </Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={[styles.statValue, { color: theme.text }]}>
                                    {statsData?.totalExams || 0}
                                </Text>
                                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                                    Total Exams
                                </Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={[styles.statValue, { color: theme.text }]}>
                                    {statsData?.totalSubjects || 0}
                                </Text>
                                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                                    Subjects
                                </Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={[styles.statValue, { color: theme.text }]}>
                                    {statsData?.passRate || 0}%
                                </Text>
                                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                                    Pass Rate
                                </Text>
                            </View>
                        </View>

                        {statsData?.improvement && (
                            <View style={styles.improvementContainer}>
                                <Icon
                                    name={statsData.improvement.startsWith('+') ? 'trending-up' : 'trending-down'}
                                    size={16}
                                    color={statsData.improvement.startsWith('+') ? '#27ae60' : '#e74c3c'}
                                />
                                <Text style={[
                                    styles.improvementText,
                                    { color: statsData.improvement.startsWith('+') ? '#27ae60' : '#e74c3c' }
                                ]}>
                                    {statsData.improvement} overall improvement
                                </Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Subject Performance */}
                {subjectPerformance.length > 0 && (
                    <View style={[styles.section, { backgroundColor: theme.card }]}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>
                            Subject Performance
                        </Text>
                        {subjectPerformance.map((item, index) => (
                            <View key={index} style={styles.subjectProgressItem}>
                                <View style={styles.subjectProgressHeader}>
                                    <Text style={[styles.subjectProgressName, { color: theme.text }]}>
                                        {item.subject}
                                    </Text>
                                    <Text style={[styles.subjectProgressPercentage, { color: theme.text }]}>
                                        {item.percentage}%
                                    </Text>
                                </View>
                                <View style={[styles.subjectProgressBar, { backgroundColor: theme.border }]}>
                                    <View
                                        style={[
                                            styles.subjectProgressFill,
                                            {
                                                width: `${item.percentage}%`,
                                                backgroundColor: item.color
                                            }
                                        ]}
                                    />
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* Grades List */}
                <View style={styles.gradesSection}>
                    <View style={styles.gradesHeader}>
                        <Text style={[styles.gradesTitle, { color: theme.text }]}>
                            Grade History
                        </Text>
                        {hasGrades && (
                            <Text style={[styles.gradesCount, { color: theme.textSecondary }]}>
                                {gradesData.length} {gradesData.length === 1 ? 'exam' : 'exams'}
                            </Text>
                        )}
                    </View>

                    {hasGrades ? (
                        <FlatList
                            data={gradesData}
                            renderItem={renderGradeItem}
                            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                            scrollEnabled={false}
                            contentContainerStyle={styles.gradesList}
                        />
                    ) : (
                        renderEmptyState()
                    )}
                </View>

                {/* Actions */}
                {hasGrades && (
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: theme.primary }]}
                            onPress={handleViewReport}
                        >
                            <Icon name="file-document-outline" size={20} color="#FFFFFF" />
                            <Text style={styles.actionButtonText}>View Full Report</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.actionButton,
                                styles.secondaryButton,
                                { backgroundColor: theme.card, borderColor: theme.border }
                            ]}
                            onPress={handleDownloadReport}
                            disabled={downloading}
                        >
                            {downloading ? (
                                <ActivityIndicator size="small" color={theme.text} />
                            ) : (
                                <Icon name="download" size={20} color={theme.text} />
                            )}
                            <Text style={[styles.actionButtonText, { color: theme.text }]}>
                                {downloading ? 'Downloading...' : 'Download Report'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            {/* Filters Modal */}
            <Modal
                visible={showFilters}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowFilters(false)}
            >
                <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                    <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: theme.text }]}>
                                Filter Grades
                            </Text>
                            <TouchableOpacity onPress={() => setShowFilters(false)}>
                                <Icon name="close" size={24} color={theme.text} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.filterContainer}>
                            {/* Subject Filter */}
                            <View style={styles.filterGroup}>
                                <Text style={[styles.filterLabel, { color: theme.text }]}>
                                    Subject
                                </Text>
                                <View style={styles.filterOptions}>
                                    {subjectsList.map(subject => (
                                        <TouchableOpacity
                                            key={subject.id || 'all'}
                                            style={[
                                                styles.filterOptionChip,
                                                { backgroundColor: theme.card },
                                                filters.subjectId === subject.id && {
                                                    backgroundColor: subject.colorCode,
                                                }
                                            ]}
                                            onPress={() => applyFilters({ subjectId: subject.id })}
                                        >
                                            <Text style={[
                                                styles.filterOptionText,
                                                { color: theme.textSecondary },
                                                filters.subjectId === subject.id && { color: '#FFFFFF' }
                                            ]}>
                                                {subject.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Exam Batch Filter */}
                            {examBatches.length > 0 && (
                                <View style={styles.filterGroup}>
                                    <Text style={[styles.filterLabel, { color: theme.text }]}>
                                        Exam Type
                                    </Text>
                                    <View style={styles.filterOptions}>
                                        {examBatches.map(batch => (
                                            <TouchableOpacity
                                                key={batch.id}
                                                style={[
                                                    styles.filterOption,
                                                    { backgroundColor: theme.card },
                                                    filters.batchId === batch.id && {
                                                        borderLeftWidth: 3,
                                                        borderLeftColor: theme.primary
                                                    }
                                                ]}
                                                onPress={() => applyFilters({ batchId: batch.id })}
                                            >
                                                <Text style={[styles.filterOptionText, { color: theme.text }]}>
                                                    {batch.name}
                                                </Text>
                                                <Text style={[styles.filterOptionSubtext, { color: theme.textSecondary }]}>
                                                    {batch.type}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            )}

                            {/* Academic Year Filter */}
                            {academicYears.length > 0 && (
                                <View style={styles.filterGroup}>
                                    <Text style={[styles.filterLabel, { color: theme.text }]}>
                                        Academic Year
                                    </Text>
                                    <View style={styles.filterOptions}>
                                        {academicYears.map(year => (
                                            <TouchableOpacity
                                                key={year.id}
                                                style={[
                                                    styles.filterOption,
                                                    { backgroundColor: theme.card },
                                                    filters.yearId === year.id && {
                                                        borderLeftWidth: 3,
                                                        borderLeftColor: theme.primary
                                                    }
                                                ]}
                                                onPress={() => applyFilters({ yearId: year.id })}
                                            >
                                                <Text style={[styles.filterOptionText, { color: theme.text }]}>
                                                    {year.title}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            )}
                        </ScrollView>

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalButtonSecondary, { borderColor: theme.border }]}
                                onPress={resetFilters}
                            >
                                <Text style={[styles.modalButtonText, { color: theme.text }]}>
                                    Reset
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: theme.primary }]}
                                onPress={() => setShowFilters(false)}
                            >
                                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>
                                    Apply
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

// Helper function for random colors
const getRandomColor = (seed) => {
    const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e'];
    return colors[seed % colors.length];
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
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
        padding: 8,
        marginRight: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 12,
        marginTop: 2,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    filterButton: {
        padding: 8,
        borderRadius: 8,
        position: 'relative',
    },
    filterBadge: {
        position: 'absolute',
        top: 5,
        right: 5,
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    subjectScroll: {
        marginTop: 12,
    },
    subjectContainer: {
        paddingHorizontal: 16,
        paddingBottom: 8,
    },
    subjectChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
    },
    subjectChipText: {
        fontSize: 14,
        fontWeight: '500',
    },
    statsCard: {
        margin: 16,
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statItem: {
        width: '25%',
        alignItems: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    statLabel: {
        fontSize: 11,
        marginTop: 4,
    },
    improvementContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
    },
    improvementText: {
        fontSize: 12,
        marginLeft: 4,
    },
    section: {
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 16,
        borderRadius: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    subjectProgressItem: {
        marginBottom: 12,
    },
    subjectProgressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    subjectProgressName: {
        fontSize: 13,
        flex: 1,
    },
    subjectProgressPercentage: {
        fontSize: 13,
        fontWeight: '600',
    },
    subjectProgressBar: {
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
    },
    subjectProgressFill: {
        height: '100%',
        borderRadius: 3,
    },
    gradesSection: {
        flex: 1,
        marginHorizontal: 16,
        marginBottom: 16,
    },
    gradesHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    gradesTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    gradesCount: {
        fontSize: 13,
    },
    gradesList: {
        paddingBottom: 8,
    },
    gradeCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    gradeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    gradeHeaderLeft: {
        flex: 1,
    },
    gradeHeaderRight: {
        alignItems: 'flex-end',
    },
    subjectName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    examType: {
        fontSize: 12,
        marginBottom: 2,
    },
    examDate: {
        fontSize: 11,
        marginBottom: 2,
    },
    teacherName: {
        fontSize: 11,
    },
    gradeBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 4,
    },
    gradeText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '500',
    },
    gradeDetails: {
        marginTop: 8,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    detailItem: {
        alignItems: 'center',
        flex: 1,
    },
    detailLabel: {
        fontSize: 11,
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
    },
    progressContainer: {
        marginBottom: 12,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    progressLabel: {
        fontSize: 11,
    },
    progressValue: {
        fontSize: 11,
        fontWeight: '600',
    },
    progressBar: {
        height: 4,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 2,
    },
    remarksContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 8,
    },
    remarksText: {
        fontSize: 11,
        marginLeft: 6,
        flex: 1,
    },
    emptyContainer: {
        alignItems: 'center',
        padding: 40,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyMessage: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 4,
    },
    emptyHint: {
        fontSize: 12,
        textAlign: 'center',
        fontStyle: 'italic',
        marginBottom: 20,
    },
    refreshButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    refreshButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
    },
    actionsContainer: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginBottom: 24,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        marginHorizontal: 4,
    },
    secondaryButton: {
        borderWidth: 1,
    },
    actionButtonText: {
        fontSize: 13,
        fontWeight: '600',
        marginLeft: 6,
        color: '#FFFFFF',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
    },
    errorText: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 12,
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    retryButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    filterContainer: {
        padding: 16,
        maxHeight: 400,
    },
    filterGroup: {
        marginBottom: 20,
    },
    filterLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    filterOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    filterOptionChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
    },
    filterOption: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        width: '100%',
    },
    filterOptionText: {
        fontSize: 14,
        fontWeight: '500',
    },
    filterOptionSubtext: {
        fontSize: 12,
        marginTop: 2,
    },
    modalActions: {
        flexDirection: 'row',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    modalButtonSecondary: {
        borderWidth: 1,
    },
    modalButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
});

export default ChildGradesScreen;
// // screens/Parent/ChildGradesScreen.js
// import React, { useState, useMemo, useCallback, useRef } from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     ScrollView,
//     TouchableOpacity,
//     ActivityIndicator,
//     RefreshControl,
//     FlatList,
//     Modal,
//     Alert,
//     Animated,
//     Dimensions,
// } from 'react-native';
// import { useSelector } from 'react-redux';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import LinearGradient from 'react-native-linear-gradient';
// import { selectThemeData } from '../../store/slices/themeSlice';
// import {
//     useGetChildGradesQuery,
//     useGetChildGradeStatsQuery,
//     useGetChildSubjectsWithGradesQuery,
//     useDownloadGradeReportMutation,
// } from '../../store/gradesApi';

// const { width, height } = Dimensions.get('window');

// const ChildGradesScreen = ({ route, navigation }) => {
//     const theme = useSelector(selectThemeData);
//     const { childId, childName, childRollNo } = route.params;

//     const [filters, setFilters] = useState({ subjectId: null, batchId: null });
//     const [selectedSubject, setSelectedSubject] = useState('All Subjects');
//     const [showFilters, setShowFilters] = useState(false);
//     const [refreshing, setRefreshing] = useState(false);
//     const [expandedCard, setExpandedCard] = useState(null);
    
//     const scrollY = useRef(new Animated.Value(0)).current;

//     const { 
//         data: gradesResponse, 
//         isLoading: gradesLoading, 
//         refetch: refetchGrades,
//         error: gradesError 
//     } = useGetChildGradesQuery({ childId, filters }, { skip: !childId });
    
//     const { 
//         data: statsResponse, 
//         isLoading: statsLoading, 
//         refetch: refetchStats,
//         error: statsError 
//     } = useGetChildGradeStatsQuery({ childId, filters }, { skip: !childId });
    
//     const { 
//         data: subjectsResponse, 
//         isLoading: subjectsLoading 
//     } = useGetChildSubjectsWithGradesQuery(childId, { skip: !childId });
    
//     const [downloadReport, { isLoading: downloading }] = useDownloadGradeReportMutation();

//     // Safe data extraction
//     const gradesData = gradesResponse?.data || gradesResponse || [];
//     const statsData = statsResponse?.data || statsResponse || {};
//     const subjectsData = subjectsResponse?.data || subjectsResponse || [];

//     const hasGrades = Array.isArray(gradesData) && gradesData.length > 0;
//     const isLoading = gradesLoading || statsLoading || subjectsLoading;

//     // Prepare subjects list
//     const subjectsList = useMemo(() => {
//         const allOption = { id: null, name: 'All Subjects', color: theme.primary };
//         const subjectOptions = Array.isArray(subjectsData) && subjectsData.length > 0
//             ? subjectsData.map(s => ({ 
//                 id: s.id, 
//                 name: s.name || 'Unknown', 
//                 color: getSubjectColor(s.id) 
//               }))
//             : [];
//         return [allOption, ...subjectOptions];
//     }, [subjectsData, theme.primary]);

//     const getGradeColor = useCallback((grade) => {
//         const colors = { 
//             'A+': '#22C55E', 'A': '#10B981', 'A-': '#34D399',
//             'B+': '#FBBF24', 'B': '#F59E0B', 'B-': '#F97316',
//             'C+': '#F97316', 'C': '#EF4444', 'C-': '#DC2626',
//             'D': '#DC2626', 'F': '#991B1B'
//         };
//         return colors[grade] || theme.primary;
//     }, [theme.primary]);

//     const getPercentageColor = useCallback((percentage) => {
//         if (percentage >= 80) return '#22C55E';
//         if (percentage >= 60) return '#FBBF24';
//         if (percentage >= 40) return '#F97316';
//         return '#EF4444';
//     }, []);

//     const getStatusColor = useCallback((status) => {
//         return status?.toLowerCase() === 'pass' ? theme.success : theme.error;
//     }, [theme.success, theme.error]);

//     const handleSubjectSelect = useCallback((subject) => {
//         setSelectedSubject(subject.name);
//         setFilters(prev => ({ ...prev, subjectId: subject.id === null ? null : subject.id }));
//     }, []);

//     const onRefresh = useCallback(async () => {
//         setRefreshing(true);
//         await Promise.all([refetchGrades(), refetchStats()]);
//         setRefreshing(false);
//     }, [refetchGrades, refetchStats]);

//     const toggleCardExpand = useCallback((id) => {
//         setExpandedCard(expandedCard === id ? null : id);
//     }, [expandedCard]);

//     const renderPerformanceCard = () => {
//         const avgPercentage = statsData?.averagePercentage || 0;
//         const metrics = [
//             { label: 'Average', value: `${avgPercentage}%`, icon: 'chart-line', color: theme.primary },
//             { label: 'Pass Rate', value: `${statsData?.passRate || 0}%`, icon: 'check-circle', color: theme.success },
//             { label: 'Exams', value: statsData?.totalExams || 0, icon: 'file-document', color: theme.info },
//             { label: 'Subjects', value: statsData?.totalSubjects || 0, icon: 'book-open', color: theme.secondary },
//         ];

//         return (
//             <LinearGradient
//                 colors={[theme.card, theme.background]}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 style={[styles.statsCard, { shadowColor: theme.text }]}
//             >
//                 <View style={styles.statsHeader}>
//                     <View style={styles.circularProgressContainer}>
//                         <View style={[styles.circularProgress, { borderColor: theme.border }]}>
//                             <View style={[styles.circularFill, { borderColor: theme.primary }]} />
//                             <Text style={[styles.circularText, { color: theme.text }]}>{avgPercentage}%</Text>
//                         </View>
//                     </View>
//                     {statsData?.improvement && (
//                         <View style={[styles.improvementBadge, { backgroundColor: theme.success + '15' }]}>
//                             <Icon name="trending-up" size={14} color={theme.success} />
//                             <Text style={[styles.improvementText, { color: theme.success }]}>
//                                 {statsData.improvement}
//                             </Text>
//                         </View>
//                     )}
//                 </View>

//                 <View style={styles.metricsGrid}>
//                     {metrics.map((metric, index) => (
//                         <View key={index} style={styles.metricItem}>
//                             <View style={[styles.metricIcon, { backgroundColor: metric.color + '15' }]}>
//                                 <Icon name={metric.icon} size={20} color={metric.color} />
//                             </View>
//                             <Text style={[styles.metricValue, { color: theme.text }]}>{metric.value}</Text>
//                             <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>{metric.label}</Text>
//                         </View>
//                     ))}
//                 </View>
//             </LinearGradient>
//         );
//     };

//     const renderSubjectPerformance = () => {
//         const subjectPerformance = statsData?.subjectPerformance;
//         if (!subjectPerformance || !Array.isArray(subjectPerformance) || subjectPerformance.length === 0) {
//             return null;
//         }

//         return (
//             <View style={styles.subjectSection}>
//                 <Text style={[styles.sectionTitle, { color: theme.text }]}>Subject Performance</Text>
//                 {subjectPerformance.map((subject, index) => (
//                     <View key={index} style={[styles.subjectCard, { backgroundColor: theme.card }]}>
//                         <View style={styles.subjectHeader}>
//                             <Text style={[styles.subjectName, { color: theme.text }]}>{subject.subjectName || 'Unknown'}</Text>
//                             <Text style={[styles.subjectPercentage, { color: getGradeColor(subject.bestGrade) }]}>
//                                 {subject.averagePercentage || 0}%
//                             </Text>
//                         </View>
//                         <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
//                             <View 
//                                 style={[
//                                     styles.progressFill, 
//                                     { 
//                                         width: `${subject.averagePercentage || 0}%`, 
//                                         backgroundColor: getPercentageColor(subject.averagePercentage || 0)
//                                     }
//                                 ]} 
//                             />
//                         </View>
//                     </View>
//                 ))}
//             </View>
//         );
//     };

//     const renderGradeCard = ({ item }) => {
//         if (!item) return null;
        
//         const isExpanded = expandedCard === item.id;
//         const gradeColor = getGradeColor(item.grade);
//         const percentageColor = getPercentageColor(item.percentage);

//         return (
//             <View style={[styles.gradeCard, { backgroundColor: theme.card, shadowColor: theme.text }]}>
//                 <View style={[styles.cardAccent, { backgroundColor: gradeColor }]} />
                
//                 <TouchableOpacity 
//                     activeOpacity={0.95} 
//                     onPress={() => toggleCardExpand(item.id)}
//                     style={styles.cardTouchable}
//                 >
//                     <View style={styles.cardHeader}>
//                         <View style={styles.subjectInfo}>
//                             <Text style={[styles.cardSubject, { color: theme.text }]}>{item.subjectName || 'Unknown'}</Text>
//                             <View style={styles.cardMeta}>
//                                 <Icon name="calendar" size={12} color={theme.textSecondary} />
//                                 <Text style={[styles.metaText, { color: theme.textSecondary }]}>{item.examDate || 'N/A'}</Text>
//                                 <Icon name="school" size={12} color={theme.textSecondary} style={styles.metaIcon} />
//                                 <Text style={[styles.metaText, { color: theme.textSecondary }]}>{item.teacherName || 'Not Assigned'}</Text>
//                             </View>
//                         </View>
//                         <View style={styles.gradeContainer}>
//                             <View style={[styles.gradeBadge, { backgroundColor: gradeColor + '20' }]}>
//                                 <Text style={[styles.gradeText, { color: gradeColor }]}>{item.grade || 'N/A'}</Text>
//                             </View>
//                             <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
//                                 <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status || 'N/A'}</Text>
//                             </View>
//                         </View>
//                     </View>

//                     <View style={styles.marksContainer}>
//                         <View style={styles.marksRow}>
//                             <Text style={[styles.marksLabel, { color: theme.textSecondary }]}>Obtained</Text>
//                             <Text style={[styles.marksValue, { color: theme.text, fontWeight: '700' }]}>
//                                 {item.obtainedMarks || 0}
//                             </Text>
//                             <Text style={[styles.marksLabel, { color: theme.textSecondary }]}>/ {item.totalMarks || 0}</Text>
//                         </View>
//                         <View style={[styles.progressBarSmall, { backgroundColor: theme.border }]}>
//                             <View 
//                                 style={[
//                                     styles.progressFillSmall, 
//                                     { 
//                                         width: `${item.percentage || 0}%`, 
//                                         backgroundColor: percentageColor
//                                     }
//                                 ]} 
//                             />
//                         </View>
//                     </View>

//                     {isExpanded && item.remarks && (
//                         <View style={[styles.remarksContainer, { backgroundColor: theme.background }]}>
//                             <Icon name="comment-quote" size={16} color={theme.textSecondary} />
//                             <Text style={[styles.remarksText, { color: theme.textSecondary }]}>{item.remarks}</Text>
//                         </View>
//                     )}

//                     <View style={styles.expandIcon}>
//                         <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} size={20} color={theme.textSecondary} />
//                     </View>
//                 </TouchableOpacity>
//             </View>
//         );
//     };

//     const renderEmptyState = () => (
//         <View style={styles.emptyContainer}>
//             <View style={[styles.emptyIcon, { backgroundColor: theme.card }]}>
//                 <Icon name="clipboard-text-search" size={56} color={theme.textSecondary} />
//             </View>
//             <Text style={[styles.emptyTitle, { color: theme.text }]}>No Grades Yet</Text>
//             <Text style={[styles.emptyMessage, { color: theme.textSecondary }]}>
//                 {childName || 'Student'} hasn't received any grades yet.
//             </Text>
//             <TouchableOpacity 
//                 style={[styles.refreshBtn, { backgroundColor: theme.primary }]} 
//                 onPress={onRefresh}
//             >
//                 <Icon name="refresh" size={20} color="#fff" />
//                 <Text style={styles.refreshBtnText}>Refresh</Text>
//             </TouchableOpacity>
//         </View>
//     );

//     if (isLoading && !refreshing) {
//         return (
//             <View style={[styles.centerContainer, { backgroundColor: theme.background }]}>
//                 <ActivityIndicator size="large" color={theme.primary} />
//                 <Text style={[styles.loadingText, { color: theme.text }]}>Loading grades...</Text>
//             </View>
//         );
//     }

//     if (gradesError || statsError) {
//         return (
//             <View style={[styles.centerContainer, { backgroundColor: theme.background }]}>
//                 <Icon name="alert-circle" size={60} color={theme.error} />
//                 <Text style={[styles.errorText, { color: theme.text }]}>Failed to load grades</Text>
//                 <Text style={[styles.errorSubtext, { color: theme.textSecondary }]}>Please check your connection</Text>
//                 <TouchableOpacity 
//                     style={[styles.retryBtn, { backgroundColor: theme.primary }]} 
//                     onPress={onRefresh}
//                 >
//                     <Text style={styles.retryBtnText}>Try Again</Text>
//                 </TouchableOpacity>
//             </View>
//         );
//     }

//     return (
//         <View style={[styles.container, { backgroundColor: theme.background }]}>
//             <ScrollView
//                 showsVerticalScrollIndicator={false}
//                 refreshControl={
//                     <RefreshControl 
//                         refreshing={refreshing} 
//                         onRefresh={onRefresh} 
//                         colors={[theme.primary]} 
//                         tintColor={theme.primary}
//                     />
//                 }
//             >
//                 {/* Subject Chips */}
//                 {subjectsList.length > 1 && (
//                     <ScrollView 
//                         horizontal 
//                         showsHorizontalScrollIndicator={false} 
//                         style={styles.chipsContainer}
//                         contentContainerStyle={styles.chipsContent}
//                     >
//                         {subjectsList.map((subject) => (
//                             <TouchableOpacity
//                                 key={subject.id !== null ? subject.id : 'all'}
//                                 onPress={() => handleSubjectSelect(subject)}
//                                 activeOpacity={0.8}
//                                 style={[
//                                     styles.chip,
//                                     { 
//                                         backgroundColor: selectedSubject === subject.name ? theme.primary : 'transparent',
//                                         borderColor: theme.border,
//                                         borderWidth: selectedSubject === subject.name ? 0 : 1,
//                                     }
//                                 ]}
//                             >
//                                 <Text style={[
//                                     styles.chipText,
//                                     { color: selectedSubject === subject.name ? '#fff' : theme.textSecondary }
//                                 ]}>
//                                     {subject.name}
//                                 </Text>
//                             </TouchableOpacity>
//                         ))}
//                     </ScrollView>
//                 )}

//                 {/* Performance Overview */}
//                 {hasGrades && renderPerformanceCard()}

//                 {/* Subject Performance */}
//                 {hasGrades && renderSubjectPerformance()}

//                 {/* Grades List */}
//                 {hasGrades ? (
//                     <View style={styles.gradesSection}>
//                         <Text style={[styles.sectionTitle, { color: theme.text }]}>Grade History</Text>
//                         <FlatList
//                             data={gradesData}
//                             renderItem={renderGradeCard}
//                             keyExtractor={(item, index) => item?.id ? `${item.id}` : `grade-${index}`}
//                             scrollEnabled={false}
//                         />
//                     </View>
//                 ) : (
//                     renderEmptyState()
//                 )}

//                 <View style={{ height: 100 }} />
//             </ScrollView>

//             {/* Sticky Action Buttons */}
//             {hasGrades && (
//                 <View style={[styles.actionContainer, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
//                     <TouchableOpacity 
//                         style={[styles.actionBtn, styles.primaryAction, { backgroundColor: theme.primary }]} 
//                         onPress={() => navigation.navigate('GradeReportDetail', { childId, childName })}
//                     >
//                         <Icon name="file-chart" size={20} color="#fff" />
//                         <Text style={styles.actionBtnText}>Full Report</Text>
//                     </TouchableOpacity>
                    
//                     <TouchableOpacity 
//                         style={[styles.actionBtn, styles.secondaryAction, { borderColor: theme.border, backgroundColor: theme.card }]} 
//                         onPress={() => {
//                             Alert.alert(
//                                 'Download Report',
//                                 'Do you want to download the grade report?',
//                                 [
//                                     { text: 'Cancel', style: 'cancel' },
//                                     { 
//                                         text: 'Download', 
//                                         onPress: async () => {
//                                             try {
//                                                 await downloadReport({ childId, filters }).unwrap();
//                                                 Alert.alert('Success', 'Report downloaded successfully!');
//                                             } catch (error) {
//                                                 Alert.alert('Error', 'Failed to download report');
//                                             }
//                                         }
//                                     }
//                                 ]
//                             );
//                         }}
//                         disabled={downloading}
//                     >
//                         {downloading ? (
//                             <ActivityIndicator size="small" color={theme.primary} />
//                         ) : (
//                             <>
//                                 <Icon name="download" size={20} color={theme.primary} />
//                                 <Text style={[styles.actionBtnText, { color: theme.primary }]}>Export</Text>
//                             </>
//                         )}
//                     </TouchableOpacity>
//                 </View>
//             )}

//             {/* Filter Modal */}
//             <Modal visible={showFilters} animationType="slide" transparent onRequestClose={() => setShowFilters(false)}>
//                 <View style={styles.modalOverlay}>
//                     <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
//                         <View style={[styles.modalHandle, { backgroundColor: theme.border }]} />
//                         <Text style={[styles.modalTitle, { color: theme.text }]}>Filter Grades</Text>
                        
//                         <ScrollView style={styles.modalBody}>
//                             <Text style={[styles.filterLabel, { color: theme.text }]}>Subjects</Text>
//                             <View style={styles.filterChips}>
//                                 {subjectsList.map(subject => (
//                                     <TouchableOpacity
//                                         key={subject.id !== null ? subject.id : 'all'}
//                                         style={[
//                                             styles.filterChip,
//                                             { 
//                                                 backgroundColor: filters.subjectId === subject.id ? theme.primary : theme.card,
//                                                 borderColor: theme.border,
//                                             }
//                                         ]}
//                                         onPress={() => setFilters(prev => ({ ...prev, subjectId: subject.id }))}
//                                     >
//                                         <Text style={[
//                                             styles.filterChipText, 
//                                             { color: filters.subjectId === subject.id ? '#fff' : theme.text }
//                                         ]}>
//                                             {subject.name}
//                                         </Text>
//                                     </TouchableOpacity>
//                                 ))}
//                             </View>
//                         </ScrollView>

//                         <View style={[styles.modalFooter, { borderTopColor: theme.border }]}>
//                             <TouchableOpacity 
//                                 style={[styles.modalBtn, styles.resetBtn, { borderColor: theme.border }]} 
//                                 onPress={() => {
//                                     setFilters({ subjectId: null, batchId: null });
//                                     setSelectedSubject('All Subjects');
//                                 }}
//                             >
//                                 <Text style={[styles.modalBtnText, { color: theme.text }]}>Reset</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity 
//                                 style={[styles.modalBtn, styles.applyBtn, { backgroundColor: theme.primary }]} 
//                                 onPress={() => setShowFilters(false)}
//                             >
//                                 <Text style={[styles.modalBtnText, { color: '#fff' }]}>Apply</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </View>
//             </Modal>
//         </View>
//     );
// };

// const getSubjectColor = (seed) => {
//     const colors = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];
//     return colors[Math.abs(seed) % colors.length];
// };

// const styles = StyleSheet.create({
//     container: { flex: 1 },
//     centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
//     loadingText: { marginTop: 12, fontSize: 14 },
//     errorText: { fontSize: 18, fontWeight: '600', marginTop: 16, textAlign: 'center' },
//     errorSubtext: { fontSize: 14, marginTop: 8, textAlign: 'center' },
//     retryBtn: { marginTop: 24, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
//     retryBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
    
//     chipsContainer: { maxHeight: 56 },
//     chipsContent: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
//     chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
//     chipText: { fontSize: 14, fontWeight: '500' },
    
//     statsCard: { margin: 16, padding: 16, borderRadius: 16, elevation: 2, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
//     statsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
//     circularProgressContainer: { position: 'relative', width: 80, height: 80, alignItems: 'center', justifyContent: 'center' },
//     circularProgress: { width: 80, height: 80, borderRadius: 40, borderWidth: 4, alignItems: 'center', justifyContent: 'center' },
//     circularFill: { position: 'absolute', width: 72, height: 72, borderRadius: 36, borderWidth: 4, borderTopColor: 'transparent', borderRightColor: 'transparent', transform: [{ rotate: '180deg' }] },
//     circularText: { fontSize: 20, fontWeight: '700' },
//     improvementBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
//     improvementText: { fontSize: 12, fontWeight: '600' },
    
//     metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
//     metricItem: { flex: 1, alignItems: 'center', gap: 4 },
//     metricIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
//     metricValue: { fontSize: 20, fontWeight: '700' },
//     metricLabel: { fontSize: 11, fontWeight: '500' },
    
//     subjectSection: { marginHorizontal: 16, marginBottom: 20 },
//     sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
//     subjectCard: { padding: 12, borderRadius: 12, marginBottom: 8 },
//     subjectHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
//     subjectName: { fontSize: 14, fontWeight: '500' },
//     subjectPercentage: { fontSize: 14, fontWeight: '700' },
//     progressBar: { height: 4, borderRadius: 2, overflow: 'hidden' },
//     progressFill: { height: '100%', borderRadius: 2 },
    
//     gradesSection: { paddingHorizontal: 16, marginBottom: 20 },
//     gradeCard: { borderRadius: 12, marginBottom: 12, overflow: 'hidden', position: 'relative' },
//     cardTouchable: { flex: 1 },
//     cardAccent: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4 },
//     cardHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, paddingBottom: 8 },
//     subjectInfo: { flex: 1, gap: 4 },
//     cardSubject: { fontSize: 15, fontWeight: '600' },
//     cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap' },
//     metaText: { fontSize: 11 },
//     metaIcon: { marginLeft: 4 },
//     gradeContainer: { alignItems: 'flex-end', gap: 4 },
//     gradeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
//     gradeText: { fontSize: 12, fontWeight: '700' },
//     statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
//     statusText: { fontSize: 10, fontWeight: '600' },
//     marksContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingBottom: 8 },
//     marksRow: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
//     marksLabel: { fontSize: 11 },
//     marksValue: { fontSize: 15 },
//     progressBarSmall: { flex: 1, height: 3, borderRadius: 1.5, overflow: 'hidden' },
//     progressFillSmall: { height: '100%', borderRadius: 1.5 },
//     remarksContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, margin: 12, marginTop: 0, padding: 8, borderRadius: 8 },
//     remarksText: { flex: 1, fontSize: 11, fontStyle: 'italic' },
//     expandIcon: { alignItems: 'center', paddingBottom: 8 },
    
//     actionContainer: { flexDirection: 'row', gap: 12, padding: 16, borderTopWidth: 1, position: 'absolute', bottom: 0, left: 0, right: 0 },
//     actionBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
//     primaryAction: { elevation: 3, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 },
//     secondaryAction: { borderWidth: 1 },
//     actionBtnText: { fontSize: 14, fontWeight: '600', color: '#fff' },
    
//     emptyContainer: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 32 },
//     emptyIcon: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
//     emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
//     emptyMessage: { fontSize: 14, textAlign: 'center', marginBottom: 24 },
//     refreshBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
//     refreshBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
    
//     modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
//     modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: height * 0.8 },
//     modalHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
//     modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 20 },
//     modalBody: { maxHeight: height * 0.5 },
//     filterLabel: { fontSize: 15, fontWeight: '600', marginBottom: 12 },
//     filterChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
//     filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
//     filterChipText: { fontSize: 13, fontWeight: '500' },
//     modalFooter: { flexDirection: 'row', gap: 12, marginTop: 20, paddingTop: 20, borderTopWidth: 1 },
//     modalBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
//     resetBtn: { borderWidth: 1 },
//     applyBtn: { elevation: 2 },
//     modalBtnText: { fontSize: 15, fontWeight: '600' },
// });

// export default ChildGradesScreen;