import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    FlatList,
    ScrollView,
    Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import { selectThemeData } from '../../../store/slices/themeSlice';

const DiaryFilterBar = ({ filters, setFilters, onApply, onReset, classesData }) => {
    const theme = useSelector(selectThemeData);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [tempFilters, setTempFilters] = useState(filters);
    const [showDatePicker, setShowDatePicker] = useState({ from: false, to: false });

    const classes = classesData?.data || [];

    const handleApply = () => {
        setFilters(tempFilters);
        onApply(tempFilters);
        setShowFilterModal(false);
    };

    const handleReset = () => {
        const resetFilters = {
            classId: null,
            sectionIds: [],
            subjectId: null,
            dateFrom: null,
            dateTo: null,
        };
        setTempFilters(resetFilters);
        setFilters(resetFilters);
        onApply(resetFilters);
        setShowFilterModal(false);
    };

    const toggleSection = (sectionId) => {
        setTempFilters(prev => ({
            ...prev,
            sectionIds: prev.sectionIds.includes(sectionId)
                ? prev.sectionIds.filter(id => id !== sectionId)
                : [...prev.sectionIds, sectionId]
        }));
    };

    const selectedClass = classes.find(c => c.classId === tempFilters.classId);
    const sections = selectedClass?.sections || [];

    const FilterModal = () => (
        <Modal
            visible={showFilterModal}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowFilterModal(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
                    <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>Filter Diaries</Text>
                        <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                            <Icon name="close" size={24} color={theme.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                        {/* Class Filter */}
                        <View style={styles.filterGroup}>
                            <Text style={[styles.filterLabel, { color: theme.text }]}>Class</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <TouchableOpacity
                                    style={[
                                        styles.filterChip,
                                        { backgroundColor: theme.card, borderColor: theme.border },
                                        !tempFilters.classId && { backgroundColor: theme.primary }
                                    ]}
                                    onPress={() => setTempFilters(prev => ({ ...prev, classId: null, sectionIds: [] }))}
                                >
                                    <Text style={[
                                        styles.filterChipText,
                                        { color: theme.textSecondary },
                                        !tempFilters.classId && { color: '#FFF' }
                                    ]}>All Classes</Text>
                                </TouchableOpacity>
                                {classes.map((cls) => (
                                    <TouchableOpacity
                                        key={cls.classId}
                                        style={[
                                            styles.filterChip,
                                            { backgroundColor: theme.card, borderColor: theme.border },
                                            tempFilters.classId === cls.classId && { backgroundColor: theme.primary }
                                        ]}
                                        onPress={() => setTempFilters(prev => ({ ...prev, classId: cls.classId, sectionIds: [] }))}
                                    >
                                        <Text style={[
                                            styles.filterChipText,
                                            { color: theme.textSecondary },
                                            tempFilters.classId === cls.classId && { color: '#FFF' }
                                        ]}>{cls.className}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Sections Filter (Multi-select) */}
                        {tempFilters.classId && sections.length > 0 && (
                            <View style={styles.filterGroup}>
                                <Text style={[styles.filterLabel, { color: theme.text }]}>Sections</Text>
                                <View style={styles.sectionGrid}>
                                    {sections.map((section) => (
                                        <TouchableOpacity
                                            key={section.sectionId}
                                            style={[
                                                styles.sectionChip,
                                                { backgroundColor: theme.card, borderColor: theme.border },
                                                tempFilters.sectionIds.includes(section.sectionId) && { backgroundColor: theme.primary }
                                            ]}
                                            onPress={() => toggleSection(section.sectionId)}
                                        >
                                            <Text style={[
                                                styles.sectionChipText,
                                                { color: theme.text },
                                                tempFilters.sectionIds.includes(section.sectionId) && { color: '#FFF' }
                                            ]}>{section.sectionName}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}

                        {/* Date Range */}
                        <View style={styles.filterGroup}>
                            <Text style={[styles.filterLabel, { color: theme.text }]}>Date Range</Text>
                            <View style={styles.dateRow}>
                                <TouchableOpacity
                                    style={[styles.dateButton, { backgroundColor: theme.card, borderColor: theme.border }]}
                                    onPress={() => setShowDatePicker({ from: true, to: false })}
                                >
                                    <Icon name="calendar-today" size={18} color={theme.textSecondary} />
                                    <Text style={[styles.dateText, { color: theme.text }]}>
                                        {tempFilters.dateFrom ? new Date(tempFilters.dateFrom).toLocaleDateString() : 'From'}
                                    </Text>
                                </TouchableOpacity>
                                <Text style={[styles.dateSeparator, { color: theme.textSecondary }]}>to</Text>
                                <TouchableOpacity
                                    style={[styles.dateButton, { backgroundColor: theme.card, borderColor: theme.border }]}
                                    onPress={() => setShowDatePicker({ from: false, to: true })}
                                >
                                    <Icon name="calendar-today" size={18} color={theme.textSecondary} />
                                    <Text style={[styles.dateText, { color: theme.text }]}>
                                        {tempFilters.dateTo ? new Date(tempFilters.dateTo).toLocaleDateString() : 'To'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>

                    <View style={[styles.modalFooter, { borderTopColor: theme.border }]}>
                        <TouchableOpacity style={[styles.resetButton, { borderColor: theme.border }]} onPress={handleReset}>
                            <Text style={[styles.resetButtonText, { color: theme.text }]}>Reset All</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.applyButton, { backgroundColor: theme.primary }]} onPress={handleApply}>
                            <Text style={styles.applyButtonText}>Apply Filters</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    return (
        <>
            <View style={[styles.filterBar, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
                <TouchableOpacity style={styles.filterTrigger} onPress={() => setShowFilterModal(true)}>
                    <Icon name="filter-list" size={20} color={theme.primary} />
                    <Text style={[styles.filterTriggerText, { color: theme.text }]}>Filter Diaries</Text>
                </TouchableOpacity>
                {(filters.classId || filters.sectionIds.length > 0 || filters.dateFrom || filters.dateTo) && (
                    <View style={styles.activeFilters}>
                        {filters.classId && (
                            <View style={[styles.activeFilterChip, { backgroundColor: theme.primary + '20' }]}>
                                <Text style={[styles.activeFilterText, { color: theme.primary }]}>
                                    {selectedClass?.className}
                                </Text>
                            </View>
                        )}
                        {filters.sectionIds.length > 0 && (
                            <View style={[styles.activeFilterChip, { backgroundColor: theme.primary + '20' }]}>
                                <Text style={[styles.activeFilterText, { color: theme.primary }]}>
                                    {filters.sectionIds.length} section(s)
                                </Text>
                            </View>
                        )}
                    </View>
                )}
            </View>

            {showDatePicker.from && (
                <DateTimePicker
                    value={tempFilters.dateFrom ? new Date(tempFilters.dateFrom) : new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, selectedDate) => {
                        setShowDatePicker({ from: false, to: false });
                        if (selectedDate) {
                            setTempFilters(prev => ({ ...prev, dateFrom: selectedDate.toISOString().split('T')[0] }));
                        }
                    }}
                />
            )}

            {showDatePicker.to && (
                <DateTimePicker
                    value={tempFilters.dateTo ? new Date(tempFilters.dateTo) : new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, selectedDate) => {
                        setShowDatePicker({ from: false, to: false });
                        if (selectedDate) {
                            setTempFilters(prev => ({ ...prev, dateTo: selectedDate.toISOString().split('T')[0] }));
                        }
                    }}
                />
            )}

            {FilterModal()}
        </>
    );
};

const styles = StyleSheet.create({
    filterBar: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    filterTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    filterTriggerText: {
        fontSize: 14,
        fontWeight: '500',
    },
    activeFilters: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
        gap: 8,
    },
    activeFilterChip: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 16,
    },
    activeFilterText: {
        fontSize: 12,
        fontWeight: '500',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
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
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalBody: {
        padding: 20,
    },
    filterGroup: {
        marginBottom: 24,
    },
    filterLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
    },
    filterChipText: {
        fontSize: 13,
        fontWeight: '500',
    },
    sectionGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    sectionChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },
    sectionChipText: {
        fontSize: 13,
        fontWeight: '500',
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    dateButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        gap: 8,
    },
    dateText: {
        fontSize: 13,
    },
    dateSeparator: {
        fontSize: 14,
    },
    modalFooter: {
        flexDirection: 'row',
        padding: 16,
        borderTopWidth: 1,
        gap: 12,
    },
    resetButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
    },
    resetButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    applyButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    applyButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default DiaryFilterBar;