// screens/Parent/ComplaintListScreen.js
import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Alert,
    SafeAreaView,
    Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import { selectThemeData } from '../../store/slices/themeSlice';
import { selectCurrentUser } from '../../store/slices/authSlice';
import { useGetComplaintsByStudentQuery } from '../../store/complaintApi';

const ComplaintListScreen = ({ route, navigation }) => {
    const theme = useSelector(selectThemeData);
    const currentUser = useSelector(selectCurrentUser);
    const { childId, childName, childData } = route.params || {};

    const [refreshing, setRefreshing] = useState(false);

    const {
        data: complaints = [],
        isLoading,
        isFetching,
        refetch,
    } = useGetComplaintsByStudentQuery(childId, {
        skip: !childId,
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

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high': return '#e74c3c';
            case 'medium': return '#f39c12';
            case 'low': return '#27ae60';
            default: return '#95a5a6';
        }
    };

    const renderComplaintCard = (complaint) => (
        <TouchableOpacity
            key={complaint.complainID}
            style={[styles.complaintCard, { backgroundColor: theme.card }]}
            onPress={() => navigation.navigate('ComplaintDetail', { complaintId: complaint.complainID })}
            activeOpacity={0.7}
        >
            <View style={styles.cardHeader}>
                <View style={styles.complaintNo}>
                    <Icon name="ticket" size={18} color={theme.primary} />
                    <Text style={[styles.complaintNoText, { color: theme.text }]}>
                        #{complaint.complainNo}
                    </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(complaint.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(complaint.status) }]}>
                        {complaint.status || 'Pending'}
                    </Text>
                </View>
            </View>

            <Text style={[styles.subject, { color: theme.text }]} numberOfLines={1}>
                {complaint.complaintSubject || 'No Subject'}
            </Text>

            <Text style={[styles.details, { color: theme.textSecondary }]} numberOfLines={2}>
                {complaint.complainDetails || 'No details provided'}
            </Text>

            <View style={styles.cardFooter}>
                <View style={styles.footerItem}>
                    <Icon name="calendar" size={14} color={theme.textSecondary} />
                    <Text style={[styles.footerText, { color: theme.textSecondary }]}>
                        {complaint.complainDate ? new Date(complaint.complainDate).toLocaleDateString() : 'N/A'}
                    </Text>
                </View>
                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(complaint.priority) + '20' }]}>
                    <Icon name="flag" size={12} color={getPriorityColor(complaint.priority)} />
                    <Text style={[styles.priorityText, { color: getPriorityColor(complaint.priority) }]}>
                        {complaint.priority || 'Medium'}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    if (isLoading && !refreshing) {
        return (
            <View style={[styles.loaderContainer, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={[styles.loaderText, { color: theme.text }]}>Loading complaints...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <LinearGradient colors={[theme.primary, theme.primary + 'CC']} style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Icon name="arrow-left" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>My Complaints</Text>
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('CreateComplaint', { childId, childName, childData })}
                        style={styles.addBtn}
                    >
                        <Icon name="plus" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.studentName}>{childName}'s Complaints</Text>
            </LinearGradient>

            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing || isFetching} onRefresh={onRefresh} colors={[theme.primary]} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
            >
                {complaints.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Icon name="file-document-outline" size={70} color={theme.textSecondary} />
                        <Text style={[styles.emptyTitle, { color: theme.text }]}>No Complaints</Text>
                        <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
                            You haven't filed any complaints yet.
                        </Text>
                        <TouchableOpacity
                            style={[styles.createBtn, { backgroundColor: theme.primary }]}
                            onPress={() => navigation.navigate('CreateComplaint', { childId, childName, childData })}
                        >
                            <Icon name="plus" size={20} color="#FFF" />
                            <Text style={styles.createBtnText}>File a Complaint</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    complaints.map(renderComplaintCard)
                )}
                <View style={{ height: 20 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loaderText: { marginTop: 12, fontSize: 15, fontWeight: '600' },
    header: { paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 10 : 18, paddingBottom: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    backBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)' },
    addBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)' },
    headerTitle: { color: '#FFF', fontSize: 20, fontWeight: '700' },
    studentName: { color: 'rgba(255,255,255,0.9)', fontSize: 14, marginTop: 12 },
    contentContainer: { padding: 16 },
    complaintCard: { borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    complaintNo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    complaintNoText: { fontSize: 14, fontWeight: '600' },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    statusText: { fontSize: 11, fontWeight: '600' },
    subject: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
    details: { fontSize: 13, lineHeight: 18, marginBottom: 12 },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
    footerItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    footerText: { fontSize: 12 },
    priorityBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12, gap: 4 },
    priorityText: { fontSize: 10, fontWeight: '600' },
    emptyContainer: { alignItems: 'center', paddingVertical: 60 },
    emptyTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 8 },
    emptySub: { fontSize: 14, textAlign: 'center', marginBottom: 24 },
    createBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 25, gap: 8 },
    createBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});

export default ComplaintListScreen;