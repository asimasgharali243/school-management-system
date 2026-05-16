// src/screens/Default/DashboardScreen.js
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { selectThemeData } from '../../store/slices/themeSlice';
import { selectCurrentUser } from '../../store/slices/authSlice';

const DashboardScreen = ({ navigation }) => {
    const theme = useSelector(selectThemeData);
    const user = useSelector(selectCurrentUser);

    const quickActions = [
        { id: 1, title: 'Profile', icon: 'account', color: '#3B82F6' },
        { id: 2, title: 'Messages', icon: 'message-text', color: '#10B981' },
        { id: 3, title: 'Calendar', icon: 'calendar', color: '#8B5CF6' },
        { id: 4, title: 'Documents', icon: 'file-document', color: '#F59E0B' },
    ];

    const stats = [
        { id: 1, title: 'Unread Messages', value: '12', icon: 'email', color: '#EF4444' },
        { id: 2, title: 'Upcoming Events', value: '5', icon: 'calendar-clock', color: '#3B82F6' },
        { id: 3, title: 'Pending Tasks', value: '8', icon: 'check-circle', color: '#10B981' },
    ];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.greeting, { color: theme.textSecondary }]}>
                            Welcome back,
                        </Text>
                        <Text style={[styles.userName, { color: theme.text }]}>
                            {user?.username || 'User'}
                        </Text>
                        <Text style={[styles.userRole, { color: theme.textSecondary }]}>
                            {user?.roleID === 1 ? 'Administrator' :
                                user?.roleID === 2 ? 'Accountant' :
                                    user?.roleID === 3 ? 'Teacher' :
                                        user?.roleID === 4 ? 'Parent' : 'User'}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.notificationButton, { backgroundColor: theme.card }]}
                        onPress={() => navigation.navigate('Notifications')}
                    >
                        <Icon name="bell" size={24} color={theme.text} />
                        <View style={[styles.badge, { backgroundColor: theme.primary }]}>
                            <Text style={styles.badgeText}>3</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Stats Cards */}
                <View style={styles.statsContainer}>
                    {stats.map((stat) => (
                        <View
                            key={stat.id}
                            style={[styles.statCard, { backgroundColor: theme.card }]}
                        >
                            <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                                <Icon name={stat.icon} size={24} color={stat.color} />
                            </View>
                            <Text style={[styles.statValue, { color: theme.text }]}>
                                {stat.value}
                            </Text>
                            <Text style={[styles.statTitle, { color: theme.textSecondary }]}>
                                {stat.title}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>
                        Quick Actions
                    </Text>
                    <View style={styles.actionsGrid}>
                        {quickActions.map((action) => (
                            <TouchableOpacity
                                key={action.id}
                                style={[styles.actionCard, { backgroundColor: theme.card }]}
                                onPress={() => navigation.navigate(action.title)}
                            >
                                <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                                    <Icon name={action.icon} size={28} color={action.color} />
                                </View>
                                <Text style={[styles.actionTitle, { color: theme.text }]}>
                                    {action.title}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Recent Activity */}
                <View style={[styles.section, styles.lastSection]}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>
                        Recent Activity
                    </Text>
                    <View style={[styles.activityCard, { backgroundColor: theme.card }]}>
                        <Icon name="update" size={40} color={theme.textSecondary} />
                        <Text style={[styles.activityText, { color: theme.text }]}>
                            No recent activity
                        </Text>
                        <Text style={[styles.activitySubtext, { color: theme.textSecondary }]}>
                            Your recent activities will appear here
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
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
        paddingHorizontal: 20,
        paddingVertical: 25,
    },
    greeting: {
        fontSize: 14,
        marginBottom: 2,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    userRole: {
        fontSize: 14,
    },
    notificationButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    badge: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    statCard: {
        flex: 1,
        marginHorizontal: 5,
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    statIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    statTitle: {
        fontSize: 12,
        textAlign: 'center',
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    lastSection: {
        marginBottom: 50,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -5,
    },
    actionCard: {
        width: '48%',
        marginHorizontal: '1%',
        marginBottom: 10,
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    actionIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    actionTitle: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    activityCard: {
        alignItems: 'center',
        padding: 30,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    activityText: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 15,
        marginBottom: 5,
    },
    activitySubtext: {
        fontSize: 14,
        textAlign: 'center',
    },
});

export default DashboardScreen;