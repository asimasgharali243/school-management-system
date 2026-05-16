// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
// import { useSelector, useDispatch } from 'react-redux';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';

// import { selectThemeData } from '../store/slices/themeSlice';
// import { logout } from '../store/slices/authSlice';
// import NotificationHeader from '../components/NotificationHeader';

// // ✅ Import ALL Teacher screens
// import TeacherDashboardScreen from '../screens/Teacher/TeacherDashboard';
// import ClassesScreen from '../screens/Teacher/ClassesScreen';
// import AttendanceScreen from '../screens/Teacher/AttendanceScreen';
// import ClassStudentsScreen from '../screens/Teacher/ClassStudentsScreen';
// import MarkAttendanceScreen from '../screens/Teacher/MarkAttendanceScreen';
// import AttendanceReportScreen from '../screens/Teacher/AttendanceReportScreen';
// import StudentDetailsScreen from '../screens/Teacher/StudentDetailsScreen';
// import GradesScreen from '../screens/Teacher/GradesScreen';
// import ProfileScreen from '../screens/Profile/ProfileScreen';
// import SettingsScreen from '../screens/Settings/SettingsScreen';
// import NotificationsScreen from '../screens/Notifications/NotificationsScreen';
// import NotificationDetailScreen from '../screens/Notifications/NotificationDetailScreen';
// const Tab = createBottomTabNavigator();
// const Stack = createNativeStackNavigator();
// const Drawer = createDrawerNavigator();

// // Custom Drawer Content Component (same as parent)
// const CustomDrawerContent = (props) => {
//     const theme = useSelector(selectThemeData);
//     const dispatch = useDispatch();
//     const user = useSelector(state => state.auth.user);

//     const handleLogout = () => {
//         Alert.alert(
//             'Logout',
//             'Are you sure you want to logout?',
//             [
//                 { text: 'Cancel', style: 'cancel' },
//                 {
//                     text: 'Logout',
//                     style: 'destructive',
//                     onPress: () => {
//                         dispatch(logout());
//                     }
//                 }
//             ]
//         );
//     };

//     return (
//         <SafeAreaView style={[styles.drawerContainer, { backgroundColor: theme.background }]}>
//             <DrawerContentScrollView {...props} style={{ flex: 1 }}>
//                 {/* Drawer Header with User Info */}
//                 <View style={[styles.drawerHeader, { borderBottomColor: theme.border }]}>
//                     <View style={[styles.avatarContainer, { backgroundColor: theme.primary }]}>
//                         <Text style={[styles.avatarText, { color: '#FFFFFF' }]}>
//                             {user?.name?.charAt(0)?.toUpperCase() || 'T'}
//                         </Text>
//                     </View>
//                     <Text style={[styles.userName, { color: theme.text }]}>
//                         {user?.name || 'Teacher'}
//                     </Text>
//                     <Text style={[styles.userEmail, { color: theme.textSecondary }]}>
//                         {user?.email || ''}
//                     </Text>
//                 </View>

//                 {/* Default Drawer Items */}
//                 <DrawerItemList {...props} />

//                 <DrawerItem
//                     label="Help & Support"
//                     icon={({ color, size }) => (
//                         <Icon name="help-circle-outline" color={color} size={size} />
//                     )}
//                     onPress={() => {
//                         Alert.alert('Help & Support', 'Contact support@example.com');
//                     }}
//                     labelStyle={{ color: theme.text }}
//                 />
//             </DrawerContentScrollView>

//             {/* Drawer Footer with Logout */}
//             <View style={[styles.drawerFooter, { borderTopColor: theme.border }]}>
//                 <DrawerItem
//                     label="Logout"
//                     icon={({ color, size }) => (
//                         <Icon name="logout" color={color} size={size} />
//                     )}
//                     onPress={handleLogout}
//                     labelStyle={{ color: theme.text }}
//                 />
//             </View>
//         </SafeAreaView>
//     );
// };

// // Teacher Tab Navigator (main tabs)
// const TeacherTabNavigator = () => {
//     const theme = useSelector(selectThemeData);

//     return (
//         <Tab.Navigator
//             screenOptions={({ route, navigation }) => ({
//                 tabBarIcon: ({ focused, color, size }) => {
//                     let iconName;

//                     switch (route.name) {
//                         case 'TeacherDashboard':
//                             iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
//                             break;
//                         case 'TeacherClasses':
//                             iconName = focused ? 'book-open' : 'book-open-outline';
//                             break;
//                         case 'TeacherAttendance':
//                             iconName = focused ? 'calendar-check' : 'calendar-check-outline';
//                             break;
//                         case 'TeacherProfile':
//                             iconName = focused ? 'account' : 'account-outline';
//                             break;
//                         default:
//                             iconName = 'help-circle';
//                     }

//                     return <Icon name={iconName} size={size} color={color} />;
//                 },
//                 tabBarActiveTintColor: theme.primary,
//                 tabBarInactiveTintColor: theme.textSecondary,
//                 tabBarStyle: {
//                     backgroundColor: theme.card,
//                     borderTopColor: theme.border,
//                 },
//                 headerStyle: {
//                     backgroundColor: theme.background,
//                     elevation: 0,
//                     shadowOpacity: 0,
//                 },
//                 headerTintColor: theme.text,
//                 headerTitleStyle: {
//                     fontWeight: '600',
//                     fontSize: 18,
//                 },
//                 headerLeft: () => (
//                     <TouchableOpacity
//                         onPress={() => navigation.toggleDrawer()}
//                         style={styles.headerButton}
//                         hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//                     >
//                         <Icon name="menu" size={24} color={theme.text} />
//                     </TouchableOpacity>
//                 ),
//                 headerRight: () => (
//                     <NotificationHeader navigation={navigation} />
//                 ),
//             })}
//         >
//             <Tab.Screen
//                 name="TeacherDashboard"
//                 component={TeacherDashboardScreen}
//                 options={{
//                     title: 'Dashboard',
//                 }}
//             />
//             <Tab.Screen
//                 name="TeacherClasses"
//                 component={ClassesScreen}
//                 options={{
//                     title: 'My Classes',
//                 }}
//             />
//             <Tab.Screen
//                 name="TeacherAttendance"
//                 component={AttendanceScreen}
//                 options={{
//                     title: 'Attendance',
//                 }}
//             />
//             <Tab.Screen
//                 name="TeacherProfile"
//                 component={ProfileScreen}
//                 options={{
//                     title: 'Profile',
//                 }}
//             />
//         </Tab.Navigator>
//     );
// };

// // Teacher Drawer Navigator
// const TeacherDrawerNavigator = () => {
//     const theme = useSelector(selectThemeData);

//     return (
//         <Drawer.Navigator
//             drawerContent={(props) => <CustomDrawerContent {...props} />}
//             screenOptions={{
//                 drawerActiveTintColor: theme.primary,
//                 drawerInactiveTintColor: theme.textSecondary,
//                 drawerStyle: {
//                     backgroundColor: theme.background,
//                     width: 280,
//                 },
//                 drawerLabelStyle: {
//                     marginLeft: -20,
//                     fontSize: 16,
//                 },
//                 headerShown: false,
//             }}
//             initialRouteName="TeacherHome"
//         >
//             <Drawer.Screen
//                 name="TeacherHome"
//                 component={TeacherTabNavigator}
//                 options={{
//                     drawerIcon: ({ color, size }) => (
//                         <Icon name="home-outline" color={color} size={size} />
//                     ),
//                     title: 'Home',
//                 }}
//             />
//             <Drawer.Screen
//                 name="Notifications"
//                 component={NotificationsScreen}
//                 options={{
//                     drawerIcon: ({ color, size }) => (
//                         <Icon name="bell-outline" color={color} size={size} />
//                     ),
//                     title: 'Notifications',
//                 }}
//             />
//             <Drawer.Screen
//                 name="TeacherSettings"
//                 component={SettingsScreen}
//                 options={{
//                     drawerIcon: ({ color, size }) => (
//                         <Icon name="cog-outline" color={color} size={size} />
//                     ),
//                     title: 'Settings',
//                 }}
//             />
//         </Drawer.Navigator>
//     );
// };

// // Main Teacher Stack Navigator
// const TeacherNavigator = () => {
//     const theme = useSelector(selectThemeData);

//     return (
//         <Stack.Navigator
//             screenOptions={{
//                 headerStyle: {
//                     backgroundColor: theme.background,
//                     elevation: 0,
//                     shadowOpacity: 0,
//                 },
//                 headerTintColor: theme.text,
//                 headerTitleStyle: {
//                     fontWeight: '600',
//                     fontSize: 18,
//                 },
//                 headerBackTitle: 'Back',
//                 headerLeft: ({ canGoBack, onPress }) => (
//                     <TouchableOpacity
//                         onPress={onPress}
//                         style={styles.headerButton}
//                         hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//                     >
//                         <Icon name="arrow-left" size={24} color={theme.text} />
//                     </TouchableOpacity>
//                 ),
//                 headerRight: ({ navigation }) => (
//                     <NotificationHeader navigation={navigation} />
//                 ),
//             }}
//         >
//             <Stack.Screen
//                 name="TeacherDrawer"
//                 component={TeacherDrawerNavigator}
//                 options={{ headerShown: false }}
//             />

//             {/* Detail screens that should have the header with back button and notification icon */}
//             <Stack.Screen
//                 name="ClassStudents"
//                 component={ClassStudentsScreen}
//                 options={({ route }) => ({
//                     title: route.params?.className || 'Class Students',
//                 })}
//             />
//             <Stack.Screen
//                 name="StudentDetails"
//                 component={StudentDetailsScreen}
//                 options={({ route }) => ({
//                     title: route.params?.studentName || 'Student Details',
//                 })}
//             />
//             <Stack.Screen 
//     name="NotificationDetail" 
//     component={NotificationDetailScreen}
//     options={{ headerShown: false }}
// />
//             <Stack.Screen
//                 name="MarkAttendance"
//                 component={MarkAttendanceScreen}
//                 options={({ route }) => ({
//                     title: route.params?.className || 'Mark Attendance',
//                 })}
//             />
//             <Stack.Screen
//                 name="AttendanceReport"
//                 component={AttendanceReportScreen}
//                 options={({ route }) => ({
//                     title: route.params?.className || 'Attendance Report',
//                 })}
//             />
//             <Stack.Screen
//                 name="Grades"
//                 component={GradesScreen}
//                 options={({ route }) => ({
//                     title: route.params?.className || 'Grades',
//                 })}
//             />
//         </Stack.Navigator>
//     );
// };

// const styles = StyleSheet.create({
//     drawerContainer: {
//         flex: 1,
//     },
//     drawerHeader: {
//         padding: 20,
//         borderBottomWidth: 1,
//         marginBottom: 10,
//     },
//     avatarContainer: {
//         width: 60,
//         height: 60,
//         borderRadius: 30,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginBottom: 10,
//     },
//     avatarText: {
//         fontSize: 24,
//         fontWeight: 'bold',
//     },
//     userName: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginBottom: 5,
//     },
//     userEmail: {
//         fontSize: 14,
//     },
//     drawerFooter: {
//         borderTopWidth: 1,
//         paddingTop: 10,
//     },
//     headerButton: {
//         marginLeft: 16,
//         padding: 4,
//     },
// });

// export default TeacherNavigator;
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';

import { selectThemeData } from '../store/slices/themeSlice';
import { logout } from '../store/slices/authSlice';
import NotificationHeader from '../components/NotificationHeader';
import NotificationDetailScreen from '../screens/Notifications/NotificationDetailScreen';
import NotificationHandler from '../components/NotificationHandler';

// Import ALL Teacher screens
import TeacherDashboardScreen from '../screens/Teacher/TeacherDashboard';
import ClassesScreen from '../screens/Teacher/ClassesScreen';
import AttendanceScreen from '../screens/Teacher/AttendanceScreen';
import ClassStudentsScreen from '../screens/Teacher/ClassStudentsScreen';
import MarkAttendanceScreen from '../screens/Teacher/MarkAttendanceScreen';
import AttendanceReportScreen from '../screens/Teacher/AttendanceReportScreen';
import StudentDetailsScreen from '../screens/Teacher/StudentDetailsScreen';
import GradesScreen from '../screens/Teacher/GradesScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import NotificationsScreen from '../screens/Notifications/NotificationsScreen';


import TeacherDiaryListScreen from '../screens/Teacher/TeacherDiaryListScreen';
import CreateDiaryScreen from '../screens/Teacher/CreateDiaryScreen';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Custom Drawer Content Component
const CustomDrawerContent = (props) => {
    const theme = useSelector(selectThemeData);
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: () => {
                        dispatch(logout());
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={[styles.drawerContainer, { backgroundColor: theme.background }]}>
            <DrawerContentScrollView {...props} style={{ flex: 1 }}>
                <View style={[styles.drawerHeader, { borderBottomColor: theme.border }]}>
                    <View style={[styles.avatarContainer, { backgroundColor: theme.primary }]}>
                        <Text style={[styles.avatarText, { color: '#FFFFFF' }]}>
                            {user?.name?.charAt(0)?.toUpperCase() || 'T'}
                        </Text>
                    </View>
                    <Text style={[styles.userName, { color: theme.text }]}>
                        {user?.name || 'Teacher'}
                    </Text>
                    <Text style={[styles.userEmail, { color: theme.textSecondary }]}>
                        {user?.email || ''}
                    </Text>
                </View>

                <DrawerItemList {...props} />

                <DrawerItem
                    label="Help & Support"
                    icon={({ color, size }) => (
                        <Icon name="help-circle-outline" color={color} size={size} />
                    )}
                    onPress={() => {
                        Alert.alert('Help & Support', 'Contact support@example.com');
                    }}
                    labelStyle={{ color: theme.text }}
                />
            </DrawerContentScrollView>

            <View style={[styles.drawerFooter, { borderTopColor: theme.border }]}>
                <DrawerItem
                    label="Logout"
                    icon={({ color, size }) => (
                        <Icon name="logout" color={color} size={size} />
                    )}
                    onPress={handleLogout}
                    labelStyle={{ color: theme.text }}
                />
            </View>
        </SafeAreaView>
    );
};

// Teacher Tab Navigator (main tabs)
const TeacherTabNavigator = () => {
    const theme = useSelector(selectThemeData);

    return (
        <Tab.Navigator
            screenOptions={({ route, navigation }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    switch (route.name) {
                        case 'TeacherDashboard':
                            iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
                            break;
                        case 'TeacherClasses':
                            iconName = focused ? 'book-open' : 'book-open-outline';
                            break;
                        case 'TeacherAttendance':
                            iconName = focused ? 'calendar-check' : 'calendar-check-outline';
                            break;
                        case 'TeacherProfile':
                            iconName = focused ? 'account' : 'account-outline';
                            break;
                        default:
                            iconName = 'help-circle';
                    }

                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: theme.primary,
                tabBarInactiveTintColor: theme.textSecondary,
                tabBarStyle: {
                    backgroundColor: theme.card,
                    borderTopColor: theme.border,
                },
                headerStyle: {
                    backgroundColor: theme.background,
                    elevation: 0,
                    shadowOpacity: 0,
                },
                headerTintColor: theme.text,
                headerTitleStyle: {
                    fontWeight: '600',
                    fontSize: 18,
                },
                headerLeft: () => (
                    <TouchableOpacity
                        onPress={() => navigation.toggleDrawer()}
                        style={styles.headerButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Icon name="menu" size={24} color={theme.text} />
                    </TouchableOpacity>
                ),
                headerRight: () => (
                    <NotificationHeader navigation={navigation} />
                ),
            })}
        >
            <Tab.Screen
                name="TeacherDashboard"
                component={TeacherDashboardScreen}
                options={{ title: 'Dashboard' }}
            />
            <Tab.Screen
                name="TeacherClasses"
                component={ClassesScreen}
                options={{ title: 'My Classes' }}
            />
            <Tab.Screen
                name="TeacherAttendance"
                component={AttendanceScreen}
                options={{ title: 'Attendance' }}
            />
            <Tab.Screen
                name="TeacherProfile"
                component={ProfileScreen}
                options={{ title: 'Profile' }}
            />
        </Tab.Navigator>
    );
};

// Teacher Drawer Navigator
const TeacherDrawerNavigator = () => {
    const theme = useSelector(selectThemeData);

    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                drawerActiveTintColor: theme.primary,
                drawerInactiveTintColor: theme.textSecondary,
                drawerStyle: {
                    backgroundColor: theme.background,
                    width: 280,
                },
                drawerLabelStyle: {
                    marginLeft: -20,
                    fontSize: 16,
                },
                headerShown: false,
            }}
            initialRouteName="TeacherHome"
        >
            <Drawer.Screen
                name="TeacherHome"
                component={TeacherTabNavigator}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Icon name="home-outline" color={color} size={size} />
                    ),
                    title: 'Home',
                }}
            />
            <Drawer.Screen
                name="Notifications"
                component={NotificationsScreen}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Icon name="bell-outline" color={color} size={size} />
                    ),
                    title: 'Notifications',
                }}
            />
            <Drawer.Screen
                name="TeacherSettings"
                component={SettingsScreen}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Icon name="cog-outline" color={color} size={size} />
                    ),
                    title: 'Settings',
                }}
            />
        </Drawer.Navigator>
    );
};

// Main Teacher Stack Navigator
const TeacherNavigator = () => {
    const theme = useSelector(selectThemeData);

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: theme.background,
                    elevation: 0,
                    shadowOpacity: 0,
                },
                headerTintColor: theme.text,
                headerTitleStyle: {
                    fontWeight: '600',
                    fontSize: 18,
                },
                headerBackTitle: 'Back',
                headerLeft: ({ canGoBack, onPress }) => (
                    <TouchableOpacity
                        onPress={onPress}
                        style={styles.headerButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Icon name="arrow-left" size={24} color={theme.text} />
                    </TouchableOpacity>
                ),
                headerRight: ({ navigation }) => (
                    <NotificationHeader navigation={navigation} />
                ),
            }}
        >
            <Stack.Screen
                name="TeacherDrawer"
                component={TeacherDrawerNavigator}
                options={{ headerShown: false }}
            />

            {/* Notification Detail Screen - Must be at this level */}
            <Stack.Screen 
                name="NotificationDetail" 
                component={NotificationDetailScreen}
                options={{ 
                    presentation: 'modal',
                    animation: 'slide_from_bottom',
                    headerShown: false,
                }}
            />
            
            {/* Notification Handler - Hidden screen to process pending notifications */}
            <Stack.Screen 
                name="NotificationHandler" 
                component={NotificationHandler}
                options={{ headerShown: false }}
            />

            {/* Detail screens */}
            <Stack.Screen
                name="ClassStudents"
                component={ClassStudentsScreen}
                options={({ route }) => ({
                    title: route.params?.className || 'Class Students',
                })}
            />
            <Stack.Screen
                name="StudentDetails"
                component={StudentDetailsScreen}
                options={({ route }) => ({
                    title: route.params?.studentName || 'Student Details',
                })}
            />
            <Stack.Screen
                name="MarkAttendance"
                component={MarkAttendanceScreen}
                options={({ route }) => ({
                    title: route.params?.className || 'Mark Attendance',
                })}
            />
            <Stack.Screen
                name="AttendanceReport"
                component={AttendanceReportScreen}
                options={({ route }) => ({
                    title: route.params?.className || 'Attendance Report',
                })}
            />
            <Stack.Screen
                name="Grades"
                component={GradesScreen}
                options={({ route }) => ({
                    title: route.params?.className || 'Grades',
                })}
            />


            <Stack.Screen 
    name="TeacherDiaryList" 
    component={TeacherDiaryListScreen} 
    options={{ headerShown: false }} 
/>
<Stack.Screen 
    name="CreateDiary" 
    component={CreateDiaryScreen} 
    options={{ headerShown: false }} 
/>
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    drawerContainer: {
        flex: 1,
    },
    drawerHeader: {
        padding: 20,
        borderBottomWidth: 1,
        marginBottom: 10,
    },
    avatarContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatarText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    userEmail: {
        fontSize: 14,
    },
    drawerFooter: {
        borderTopWidth: 1,
        paddingTop: 10,
    },
    headerButton: {
        marginLeft: 16,
        padding: 4,
    },
});

export default TeacherNavigator;