// src/screens/Parent/ChildDetailsScreen.js
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { selectThemeData } from '../../store/slices/themeSlice';

const { width } = Dimensions.get('window');

const ChildDetailsScreen = ({ route, navigation }) => {
    const { childId, childName } = route.params;
    const theme = useSelector(selectThemeData);
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'overview', title: 'Overview' },
        { key: 'attendance', title: 'Attendance' },
        { key: 'grades', title: 'Grades' },
        { key: 'activities', title: 'Activities' },
    ]);

    const OverviewRoute = () => (
        <View style={[styles.tabContent, { backgroundColor: theme.background }]}>
            <View style={styles.infoCard}>
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Full Name</Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>John Doe</Text>
            </View>
            <View style={styles.infoCard}>
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Grade</Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>Grade 5</Text>
            </View>
            <View style={styles.infoCard}>
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Class Teacher</Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>Ms. Sarah Johnson</Text>
            </View>
            <View style={styles.infoCard}>
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Roll Number</Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>#2023-0512</Text>
            </View>
        </View>
    );

    const AttendanceRoute = () => (
        <View style={[styles.tabContent, { backgroundColor: theme.background }]}>
            <Text style={[styles.placeholderText, { color: theme.textSecondary }]}>
                Attendance data will appear here
            </Text>
        </View>
    );

    const GradesRoute = () => (
        <View style={[styles.tabContent, { backgroundColor: theme.background }]}>
            <Text style={[styles.placeholderText, { color: theme.textSecondary }]}>
                Grades data will appear here
            </Text>
        </View>
    );

    const ActivitiesRoute = () => (
        <View style={[styles.tabContent, { backgroundColor: theme.background }]}>
            <Text style={[styles.placeholderText, { color: theme.textSecondary }]}>
                Activities data will appear here
            </Text>
        </View>
    );

    const renderScene = SceneMap({
        overview: OverviewRoute,
        attendance: AttendanceRoute,
        grades: GradesRoute,
        activities: ActivitiesRoute,
    });

    const renderTabBar = (props) => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: theme.primary }}
            style={{ backgroundColor: theme.card }}
            labelStyle={{ color: theme.text, fontWeight: '600' }}
            activeColor={theme.primary}
            inactiveColor={theme.textSecondary}
        />
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView>
                <View style={[styles.header, { backgroundColor: theme.primary }]}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Icon name="arrow-left" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <View style={styles.headerContent}>
                        <View style={styles.avatar}>
                            <Icon name="account-school" size={60} color="#FFFFFF" />
                        </View>
                        <Text style={styles.childName}>{childName}</Text>
                        <Text style={styles.childInfo}>Grade 5 • Class A</Text>
                    </View>
                </View>

                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={{ width }}
                    renderTabBar={renderTabBar}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 60,
        paddingBottom: 30,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 1,
    },
    headerContent: {
        alignItems: 'center',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    childName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 5,
    },
    childInfo: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
    },
    tabContent: {
        flex: 1,
        minHeight: 400,
        padding: 20,
    },
    infoCard: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    infoLabel: {
        fontSize: 12,
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '600',
    },
    placeholderText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
    },
});

export default ChildDetailsScreen;