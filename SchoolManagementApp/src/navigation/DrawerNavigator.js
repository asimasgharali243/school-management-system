// src/navigation/DrawerNavigator.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTabNavigator from './BottomTabNavigator';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    width: '80%',
                },
            }}
        >
            <Drawer.Screen name="Main" component={BottomTabNavigator} />
            <Drawer.Screen name="Settings" component={SettingsScreen} />
            <Drawer.Screen name="Profile" component={ProfileScreen} />
            
        </Drawer.Navigator>
    );
};

export default DrawerNavigator;