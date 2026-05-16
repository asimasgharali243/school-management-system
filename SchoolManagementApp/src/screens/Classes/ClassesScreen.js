import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const ClassesScreen = () => {
    const [classes, setClasses] = useState([
        { id: '1', name: 'Mathematics 101', teacher: 'Mr. Johnson', students: 28, time: '9:00 AM' },
        { id: '2', name: 'English Literature', teacher: 'Ms. Williams', students: 24, time: '10:30 AM' },
        { id: '3', name: 'Physics', teacher: 'Dr. Smith', students: 20, time: '1:00 PM' },
        { id: '4', name: 'Computer Science', teacher: 'Prof. Davis', students: 30, time: '2:30 PM' },
        { id: '5', name: 'History', teacher: 'Mrs. Brown', students: 22, time: '11:00 AM' },
        { id: '6', name: 'Chemistry', teacher: 'Dr. Taylor', students: 18, time: '3:30 PM' },
    ]);

    const renderClassItem = ({ item }) => (
        <TouchableOpacity style={styles.classCard}>
            <View style={styles.classHeader}>
                <Text style={styles.className}>{item.name}</Text>
                <View style={styles.timeBadge}>
                    <Text style={styles.timeText}>{item.time}</Text>
                </View>
            </View>
            <Text style={styles.teacherText}>Teacher: {item.teacher}</Text>
            <View style={styles.classFooter}>
                <View style={styles.studentCount}>
                    <Text style={styles.countText}>{item.students} students</Text>
                </View>
                <TouchableOpacity style={styles.viewButton}>
                    <Text style={styles.viewButtonText}>View Details</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Classes</Text>

            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{classes.length}</Text>
                    <Text style={styles.statLabel}>Total Classes</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>
                        {classes.reduce((sum, cls) => sum + cls.students, 0)}
                    </Text>
                    <Text style={styles.statLabel}>Total Students</Text>
                </View>
            </View>

            <FlatList
                data={classes}
                renderItem={renderClassItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />

            <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Create New Class</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#2c3e50',
    },
    statsContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        marginHorizontal: 5,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    statNumber: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#3498db',
    },
    statLabel: {
        fontSize: 14,
        color: '#7f8c8d',
        marginTop: 8,
    },
    listContainer: {
        paddingBottom: 20,
    },
    classCard: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    classHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    className: {
        fontSize: 20,
        fontWeight: '600',
        color: '#2c3e50',
        flex: 1,
    },
    timeBadge: {
        backgroundColor: '#e3f2fd',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    timeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1976d2',
    },
    teacherText: {
        fontSize: 16,
        color: '#7f8c8d',
        marginBottom: 15,
    },
    classFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    studentCount: {
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    countText: {
        fontSize: 14,
        color: '#666',
    },
    viewButton: {
        backgroundColor: '#3498db',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    viewButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    addButton: {
        backgroundColor: '#3498db',
        borderRadius: 10,
        padding: 18,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ClassesScreen;