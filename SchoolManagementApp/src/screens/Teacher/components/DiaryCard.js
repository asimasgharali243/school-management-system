import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DiaryCard = ({ entry, theme, onPress }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'No date';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    // Strip HTML tags for preview
    const stripHtml = (html) => {
        if (!html) return '';
        return html.replace(/<[^>]*>/g, '').substring(0, 100);
    };

    return (
        <TouchableOpacity style={[styles.card, { backgroundColor: theme.card }]} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.cardHeader}>
                <View style={styles.classInfo}>
                    <Icon name="school" size={18} color={theme.primary} />
                    <Text style={[styles.className, { color: theme.text }]}>{entry.className}</Text>
                    <Text style={[styles.section, { color: theme.textSecondary }]}>
                        {entry.sectionNames?.join(', ') || 'N/A'}
                    </Text>
                </View>
                <View style={[styles.dateBadge, { backgroundColor: theme.background }]}>
                    <Icon name="calendar-today" size={12} color={theme.textSecondary} />
                    <Text style={[styles.dateText, { color: theme.textSecondary }]}>{formatDate(entry.date)}</Text>
                </View>
            </View>

            <View style={styles.subjectContainer}>
                <Icon name="book" size={16} color={theme.warning} />
                <Text style={[styles.subjectText, { color: theme.textSecondary }]}>{entry.subjectName}</Text>
            </View>

            <Text style={[styles.previewText, { color: theme.text }]} numberOfLines={2}>
                {stripHtml(entry.content) || 'No content'}
            </Text>

            <View style={styles.cardFooter}>
                <View style={[styles.statusBadge, { 
                    backgroundColor: entry.isPublished ? theme.success + '20' : theme.warning + '20' 
                }]}>
                    <Text style={[styles.statusText, { 
                        color: entry.isPublished ? theme.success : theme.warning 
                    }]}>
                        {entry.isPublished ? 'Published' : 'Draft'}
                    </Text>
                </View>
                <Icon name="chevron-right" size={20} color={theme.textSecondary} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    classInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        flex: 1,
    },
    className: {
        fontSize: 14,
        fontWeight: '600',
    },
    section: {
        fontSize: 12,
        marginLeft: 4,
    },
    dateBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    dateText: {
        fontSize: 10,
    },
    subjectContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 10,
    },
    subjectText: {
        fontSize: 12,
    },
    previewText: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 12,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
    },
});

export default DiaryCard;