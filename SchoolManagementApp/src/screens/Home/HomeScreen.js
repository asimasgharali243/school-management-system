import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useGetStudentsQuery } from '../../api/endpoints/userApi';
import { useAppSelector } from '../../store/hooks';
import Loading from '../../components/common/Loading';

const HomeScreen = ({ navigation }) => {
    const { data: students, isLoading, isError, refetch } = useGetStudentsQuery({
        page: 1,
        limit: 10,
    });
    const user = useAppSelector((state) => state.auth.user);

    const renderStudentItem = ({ item }) => (
        <TouchableOpacity
            style={styles.studentCard}
            onPress={() => navigation.navigate('StudentDetail', { studentId: item.id })}
        >
            <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{item.name}</Text>
                <Text style={styles.studentClass}>Class: {item.class}</Text>
                <Text style={styles.studentRoll}>Roll No: {item.rollNumber}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>
    );

    if (isLoading) {
        return <Loading />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Welcome, {user?.name || 'User'}!</Text>
                <Text style={styles.subtitle}>School Management System</Text>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Ionicons name="people" size={32} color="#007AFF" />
                    <Text style={styles.statNumber}>{students?.total || 0}</Text>
                    <Text style={styles.statLabel}>Students</Text>
                </View>
                <View style={styles.statCard}>
                    <Ionicons name="school" size={32} color="#34C759" />
                    <Text style={styles.statNumber}>12</Text>
                    <Text style={styles.statLabel}>Classes</Text>
                </View>
                <View style={styles.statCard}>
                    <Ionicons name="calendar" size={32} color="#FF9500" />
                    <Text style={styles.statNumber}>85%</Text>
                    <Text style={styles.statLabel}>Attendance</Text>
                </View>
            </View>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Students</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Students')}>
                    <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={students?.data || []}
                renderItem={renderStudentItem}
                keyExtractor={(item) => item.id.toString()}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={refetch} />
                }
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="people-outline" size={64} color="#ccc" />
                        <Text style={styles.emptyText}>No students found</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        backgroundColor: '#fff',
        marginTop: 10,
    },
    statCard: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 8,
        color: '#333',
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    seeAllText: {
        fontSize: 14,
        color: '#007AFF',
    },
    listContent: {
        padding: 20,
    },
    studentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    studentInfo: {
        flex: 1,
    },
    studentName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    studentClass: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    studentRoll: {
        fontSize: 12,
        color: '#999',
        marginTop: 2,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        marginTop: 10,
    },
});

export default HomeScreen;