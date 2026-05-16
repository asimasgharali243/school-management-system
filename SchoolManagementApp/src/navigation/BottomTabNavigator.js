// src/navigation/BottomTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/Home/HomeScreen';
import StudentsScreen from '../screens/Students/StudentsScreen';
import ClassesScreen from '../screens/Classes/ClassesScreen';
import AttendanceScreen from '../screens/Attendance/AttendanceScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Students') {
                        iconName = focused ? 'people' : 'people-outline';
                    } else if (route.name === 'Classes') {
                        iconName = focused ? 'school' : 'school-outline';
                    } else if (route.name === 'Attendance') {
                        iconName = focused ? 'calendar' : 'calendar-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: 'gray',
                headerShown: true,
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Students" component={StudentsScreen} />
            <Tab.Screen name="Classes" component={ClassesScreen} />
            <Tab.Screen name="Attendance" component={AttendanceScreen} />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;