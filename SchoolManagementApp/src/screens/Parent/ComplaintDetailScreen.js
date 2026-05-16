// screens/Parent/ComplaintDetailScreen.js
import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    SafeAreaView,
    Platform,
    Alert,
    Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import { selectThemeData } from '../../store/slices/themeSlice';
import { useGetComplaintByIdQuery } from '../../store/complaintApi';

const ComplaintDetailScreen = ({ route, navigation }) => {
    const theme = useSelector(selectThemeData);
    const { complaintId } = route.params || {};

    const [refreshing, setRefreshing] = useState(false);

    const {
        data: complaint,
        isLoading,
        isFetching,
        refetch,
        error,
    } = useGetComplaintByIdQuery(complaintId, {
        skip: !complaintId,
    });

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    }, [refetch]);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return '#f39c12';
            case 'in progress': return '#3498db';
            case 'resolved': return '#27ae60';
            case 'rejected': return '#e74c3c';
            default: return '#95a5a6';
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'clock-outline';
            case 'in progress': return 'progress-clock';
            case 'resolved': return 'check-circle-outline';
            case 'rejected': return 'close-circle-outline';
            default: return 'help-circle-outline';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high': return '#e74c3c';
            case 'medium': return '#f39c12';
            case 'low': return '#27ae60';
            default: return '#95a5a6';
        }
    };

    const getPriorityIcon = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high': return 'alert-circle';
            case 'medium': return 'alert';
            case 'low': return 'information';
            default: return 'flag';
        }
    };

    const handleCallSupport = () => {
        const phoneNumber = complaint?.complaintantNumber;
        if (phoneNumber && phoneNumber !== '-') {
            Linking.openURL(`tel:${phoneNumber}`);
        } else {
            Alert.alert('Info', 'No contact number available');
        }
    };

    if (isLoading && !refreshing) {
        return (
            <View style={[styles.loaderContainer, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={[styles.loaderText, { color: theme.text }]}>Loading complaint details...</Text>
            </View>
        );
    }

    if (error || !complaint) {
        return (
            <View style={[styles.errorContainer, { backgroundColor: theme.background }]}>
                <Icon name="alert-circle-outline" size={70} color={theme.error} />
                <Text style={[styles.errorTitle, { color: theme.text }]}>Failed to Load</Text>
                <Text style={[styles.errorSub, { color: theme.textSecondary }]}>
                    Unable to load complaint details. Please try again.
                </Text>
                <TouchableOpacity
                    style={[styles.retryBtn, { backgroundColor: theme.primary }]}
                    onPress={onRefresh}
                >
                    <Text style={styles.retryBtnText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <LinearGradient colors={[theme.primary, theme.primary + 'CC']} style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Icon name="arrow-left" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Complaint Details</Text>
                    <View style={{ width: 40 }} />
                </View>
                <View style={styles.complaintNumberContainer}>
                    <Icon name="ticket" size={20} color="#FFF" />
                    <Text style={styles.complaintNumber}>#{complaint.complainNo}</Text>
                </View>
            </LinearGradient>

            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing || isFetching} onRefresh={onRefresh} colors={[theme.primary]} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
            >
                {/* Status & Priority Cards */}
                <View style={styles.statusRow}>
                    <View style={[styles.statusCard, { backgroundColor: getStatusColor(complaint.status) + '15' }]}>
                        <Icon name={getStatusIcon(complaint.status)} size={28} color={getStatusColor(complaint.status)} />
                        <Text style={[styles.statusLabel, { color: theme.textSecondary }]}>Current Status</Text>
                        <Text style={[styles.statusValue, { color: getStatusColor(complaint.status) }]}>
                            {complaint.status || 'Pending'}
                        </Text>
                    </View>

                    <View style={[styles.statusCard, { backgroundColor: getPriorityColor(complaint.priority) + '15' }]}>
                        <Icon name={getPriorityIcon(complaint.priority)} size={28} color={getPriorityColor(complaint.priority)} />
                        <Text style={[styles.statusLabel, { color: theme.textSecondary }]}>Priority Level</Text>
                        <Text style={[styles.statusValue, { color: getPriorityColor(complaint.priority) }]}>
                            {complaint.priority || 'Medium'}
                        </Text>
                    </View>
                </View>

                {/* Complaint Information */}
                <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>
                        <Icon name="information" size={18} color={theme.primary} /> Complaint Information
                    </Text>

                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Category</Text>
                        <View style={[styles.categoryBadge, { backgroundColor: theme.primary + '15' }]}>
                            <Text style={[styles.categoryText, { color: theme.primary }]}>
                                {complaint.categoryName || 'General'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Subject</Text>
                        <Text style={[styles.infoValue, { color: theme.text }]}>{complaint.complaintSubject || 'N/A'}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Date Filed</Text>
                        <Text style={[styles.infoValue, { color: theme.text }]}>
                            {complaint.complainDate ? new Date(complaint.complainDate).toLocaleString() : 'N/A'}
                        </Text>
                    </View>
                </View>

                {/* Complaint Details */}
                <View style={[styles.detailsCard, { backgroundColor: theme.card }]}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>
                        <Icon name="file-document" size={18} color={theme.primary} /> Complaint Details
                    </Text>
                    <Text style={[styles.detailsText, { color: theme.textSecondary }]}>
                        {complaint.complainDetails || 'No details provided'}
                    </Text>
                </View>

                {/* Student Information */}
                <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>
                        <Icon name="account" size={18} color={theme.primary} /> Student Information
                    </Text>

                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Student Name</Text>
                        <Text style={[styles.infoValue, { color: theme.text }]}>{complaint.studentName || 'N/A'}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Class</Text>
                        <Text style={[styles.infoValue, { color: theme.text }]}>{complaint.studentClass || 'N/A'}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Section</Text>
                        <Text style={[styles.infoValue, { color: theme.text }]}>{complaint.studentSection || 'N/A'}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Registration ID</Text>
                        <Text style={[styles.infoValue, { color: theme.text }]}>{complaint.reg_Id || 'N/A'}</Text>
                    </View>
                </View>

                {/* Contact Information */}
                <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>
                        <Icon name="phone" size={18} color={theme.primary} /> Contact Information
                    </Text>

                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Complainant Name</Text>
                        <Text style={[styles.infoValue, { color: theme.text }]}>{complaint.complaintantName || 'N/A'}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Contact Number</Text>
                        <TouchableOpacity onPress={handleCallSupport} disabled={!complaint.complaintantNumber || complaint.complaintantNumber === '-'}>
                            <Text style={[styles.infoValue, { color: theme.primary, textDecorationLine: 'underline' }]}>
                                {complaint.complaintantNumber || 'N/A'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Timeline (if created date available) */}
                <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>
                        <Icon name="timeline" size={18} color={theme.primary} /> Timeline
                    </Text>
                    <View style={styles.timelineItem}>
                        <View style={[styles.timelineDot, { backgroundColor: theme.success }]} />
                        <View style={styles.timelineContent}>
                            <Text style={[styles.timelineTitle, { color: theme.text }]}>Complaint Filed</Text>
                            <Text style={[styles.timelineDate, { color: theme.textSecondary }]}>
                                {complaint.createdDT ? new Date(complaint.createdDT).toLocaleString() : complaint.complainDate ? new Date(complaint.complainDate).toLocaleString() : 'N/A'}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.timelineItem}>
                        <View style={[styles.timelineDot, { backgroundColor: getStatusColor(complaint.status) }]} />
                        <View style={styles.timelineContent}>
                            <Text style={[styles.timelineTitle, { color: theme.text }]}>Current Status</Text>
                            <Text style={[styles.timelineDate, { color: getStatusColor(complaint.status) }]}>
                                {complaint.status || 'Pending'}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={{ height: 30 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loaderText: { marginTop: 12, fontSize: 15, fontWeight: '600' },
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    errorTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 8 },
    errorSub: { fontSize: 14, textAlign: 'center', marginBottom: 24 },
    retryBtn: { paddingHorizontal: 32, paddingVertical: 12, borderRadius: 25 },
    retryBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
    header: { paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 10 : 18, paddingBottom: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    backBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)' },
    headerTitle: { color: '#FFF', fontSize: 20, fontWeight: '700' },
    complaintNumberContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 12, gap: 8 },
    complaintNumber: { color: '#FFF', fontSize: 16, fontWeight: '600' },
    contentContainer: { padding: 16 },
    statusRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
    statusCard: { flex: 1, borderRadius: 16, padding: 14, alignItems: 'center', gap: 6 },
    statusLabel: { fontSize: 12, marginTop: 4 },
    statusValue: { fontSize: 14, fontWeight: '700' },
    infoCard: { borderRadius: 16, padding: 16, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
    detailsCard: { borderRadius: 16, padding: 16, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
    sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 14, flexDirection: 'row', alignItems: 'center' },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#e0e0e0' },
    infoLabel: { fontSize: 13, fontWeight: '500' },
    infoValue: { fontSize: 13, fontWeight: '400', flex: 1, textAlign: 'right' },
    categoryBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
    categoryText: { fontSize: 12, fontWeight: '600' },
    detailsText: { fontSize: 14, lineHeight: 22, textAlign: 'left' },
    timelineItem: { flexDirection: 'row', marginBottom: 16 },
    timelineDot: { width: 10, height: 10, borderRadius: 5, marginTop: 4, marginRight: 12 },
    timelineContent: { flex: 1 },
    timelineTitle: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
    timelineDate: { fontSize: 12 },
});

export default ComplaintDetailScreen;