// src/components/Teacher/ClassCard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ClassCard = ({ classItem, onPress, theme }) => {
    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: theme.card }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.header}>
                <View style={styles.classInfo}>
                    <Text style={[styles.className, { color: theme.text }]}>
                        {classItem.name}
                    </Text>
                    <Text style={[styles.subject, { color: theme.textSecondary }]}>
                        {classItem.subject}
                    </Text>
                </View>
                <View style={[styles.studentCount, { backgroundColor: theme.primary + '20' }]}>
                    <Icon name="account-group" size={16} color={theme.primary} />
                    <Text style={[styles.countText, { color: theme.primary }]}>
                        {classItem.totalStudents}
                    </Text>
                </View>
            </View>

            <View style={styles.footer}>
                <View style={styles.footerItem}>
                    <Icon name="calendar-check" size={16} color={theme.success} />
                    <Text style={[styles.footerText, { color: theme.textSecondary }]}>
                        95% attendance
                    </Text>
                </View>
                <View style={styles.footerItem}>
                    <Icon name="arrow-right" size={16} color={theme.primary} />
                    <Text style={[styles.footerText, { color: theme.primary }]}>
                        View Students
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    classInfo: {
        flex: 1,
    },
    className: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subject: {
        fontSize: 14,
    },
    studentCount: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
    },
    countText: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 5,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
        paddingTop: 10,
    },
    footerItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        marginLeft: 5,
    },
});

export default ClassCard;