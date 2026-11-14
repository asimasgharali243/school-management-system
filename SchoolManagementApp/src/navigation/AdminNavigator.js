import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { TouchableOpacity, Text } from 'react-native';
import { logoutUser } from '../store/slices/authSlice';
import { selectThemeData } from '../store/slices/themeSlice';
import AdminDashboardScreen from '../screens/Admin/AdminDashboardScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import NotificationsScreen from '../screens/Notifications/NotificationsScreen';
import NotificationDetailScreen from '../screens/Notifications/NotificationDetailScreen';
import NotificationHandler from '../components/NotificationHandler';
const Stack=createNativeStackNavigator();
export default function AdminNavigator(){
  const dispatch=useDispatch();const theme=useSelector(selectThemeData);
  return <Stack.Navigator screenOptions={{headerStyle:{backgroundColor:theme.card},headerTintColor:theme.text}}>
    <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{title:'Administration',headerRight:()=> <TouchableOpacity accessibilityRole="button" onPress={()=>dispatch(logoutUser())}><Text style={{color:theme.primary}}>Sign out</Text></TouchableOpacity>}} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="NotificationDetail" component={NotificationDetailScreen} options={{title:'Notification details'}} />
    <Stack.Screen name="NotificationHandler" component={NotificationHandler} options={{headerShown:false}} />
    <Stack.Screen name="AdminProfile" component={ProfileScreen} options={{title:'Profile'}} />
    <Stack.Screen name="AdminSettings" component={SettingsScreen} options={{title:'Settings'}} />
  <Stack.Screen name="Profile" component={ProfileScreen} options={{title:"Profile"}} />
</Stack.Navigator>;
}
