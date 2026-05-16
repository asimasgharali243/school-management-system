import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { selectThemeData } from '../../store/slices/themeSlice';
import { fetchTeacherClasses, selectTeacherClasses, selectTeacherLoading } from '../../store/slices/teacherSlice';

const ClassesScreen = ({ navigation }) => {
    const theme = useSelector(selectThemeData);
    const dispatch = useDispatch();
    const classes = useSelector(selectTeacherClasses);
    const loading = useSelector(selectTeacherLoading);

    useEffect(() => {
        dispatch(fetchTeacherClasses());
    }, []);

    // Function to handle class press
    const handleClassPress = (classItem) => {
        navigation.navigate('ClassStudents', {
            classId: classItem.classId,
            sectionId: classItem.sectionId,
            className: classItem.className,
            sectionName: classItem.sectionName,
            subjectName: classItem.subjectName
        });
    };

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { backgroundColor: theme.card }]}>
                <Text style={[styles.title, { color: theme.text }]}>
                    My Classes
                </Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                    Total: {classes.length} classes
                </Text>
            </View>

            <View style={styles.classesContainer}>
                {classes.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Icon name="school-outline" size={60} color={theme.textSecondary} />
                        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                            No classes assigned yet
                        </Text>
                    </View>
                ) : (
                    classes.map((classItem) => (
                        <TouchableOpacity
                            key={`${classItem.classId}-${classItem.sectionId}`}
                            style={[styles.classCard, { backgroundColor: theme.card }]}
                            onPress={() => handleClassPress(classItem)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.classCardContent}>
                                <View style={[styles.classIcon, { backgroundColor: theme.primary + '20' }]}>
                                    <Icon name="school" size={24} color={theme.primary} />
                                </View>
                                <View style={styles.classInfo}>
                                    <Text style={[styles.className, { color: theme.text }]}>
                                        {classItem.className} - {classItem.sectionName}
                                    </Text>
                                    <Text style={[styles.subject, { color: theme.textSecondary }]}>
                                        {classItem.subjectName || 'Class Incharge'}
                                    </Text>
                                </View>
                                <Icon name="chevron-right" size={20} color={theme.textSecondary} />
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
        margin: 15,
        borderRadius: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 14,
        marginTop: 4,
    },
    classesContainer: {
        paddingHorizontal: 15,
    },
    classCard: {
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    classCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    classIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    classInfo: {
        flex: 1,
    },
    className: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    subject: {
        fontSize: 12,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        marginTop: 10,
    },
});

export default ClassesScreen;