

// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
// import { useSelector, useDispatch } from 'react-redux';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';

// import ChildrenListScreen from '../screens/Parent/ChildrenListScreen';
// import ChildDashboardScreen from '../screens/Parent/ChildDashboardScreen';
// import ChildAttendanceScreen from '../screens/Parent/ChildAttendanceScreen';
// import ChildGradesScreen from '../screens/Parent/ChildGradesScreen';
// import ChildDiaryScreen from '../screens/Parent/ChildDiaryScreen';
// import ProfileScreen from '../screens/Profile/ProfileScreen';
// import SettingsScreen from '../screens/Settings/SettingsScreen';
// import NotificationsScreen from '../screens/Notifications/NotificationsScreen';
// import NotificationHeader from '../components/NotificationHeader';
// import { selectThemeData } from '../store/slices/themeSlice';
// import { logout } from '../store/slices/authSlice';
// import NotificationDetailScreen from '../screens/Notifications/NotificationDetailScreen';

// const Tab = createBottomTabNavigator();
// const Stack = createNativeStackNavigator();
// const Drawer = createDrawerNavigator();

// // Custom Drawer Content Component
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
//                             {user?.name?.charAt(0)?.toUpperCase() || 'U'}
//                         </Text>
//                     </View>
//                     <Text style={[styles.userName, { color: theme.text }]}>
//                         {user?.name || 'User'}
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

// // Stack Navigator for Child-related screens (accessible from ChildrenListScreen)
// const ChildStackNavigator = () => {
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
//             }}
//         >
//             <Stack.Screen
//                 name="ChildDashboard"
//                 component={ChildDashboardScreen}
//                 options={({ route }) => ({
//                     title: route.params?.childName || 'Child Dashboard',
//                 })}
//             />
//             <Stack.Screen
//                 name="ChildAttendance"
//                 component={ChildAttendanceScreen}
//                 options={({ route }) => ({
//                     title: `${route.params?.childName || 'Child'} Attendance`,
//                 })}
//             />
//             <Stack.Screen
//                 name="ChildGrades"
//                 component={ChildGradesScreen}
//                 options={({ route }) => ({
//                     title: `${route.params?.childName || 'Child'} Grades`,
//                 })}
//             />
//             <Stack.Screen
//                 name="ChildDiary"
//                 component={ChildDiaryScreen}
//                 options={({ route }) => ({
//                     title: `${route.params?.childName || 'Child'} Diary`,
//                 })}
//             />

//             <Stack.Screen 
//     name="NotificationDetail" 
//     component={NotificationDetailScreen}
//     options={{ headerShown: false }}
// />
//         </Stack.Navigator>
//     );
// };

// // Main Home Tab Navigator
// const HomeTabNavigator = () => {
//     const theme = useSelector(selectThemeData);

//     return (
//         <Tab.Navigator
//             screenOptions={({ route, navigation }) => ({
//                 tabBarIcon: ({ focused, color, size }) => {
//                     let iconName;

//                     switch (route.name) {
//                         case 'ChildrenList':
//                             iconName = focused ? 'account-group' : 'account-group-outline';
//                             break;
//                         case 'Profile':
//                             iconName = focused ? 'account' : 'account-outline';
//                             break;
//                         case 'Settings':
//                             iconName = focused ? 'cog' : 'cog-outline';
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
//                 name="ChildrenList"
//                 component={ChildrenListScreen}
//                 options={{ title: 'My Children' }}
//             />
//             <Tab.Screen
//                 name="Profile"
//                 component={ProfileScreen}
//                 options={{ title: 'Profile' }}
//             />
//             <Tab.Screen
//                 name="Settings"
//                 component={SettingsScreen}
//                 options={{ title: 'Settings' }}
//             />
//         </Tab.Navigator>
//     );
// };

// // Main Drawer Navigator
// const ParentDrawerNavigator = () => {
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
//             initialRouteName="Home"
//         >
//             <Drawer.Screen
//                 name="Home"
//                 component={HomeTabNavigator}
//                 options={{
//                     drawerIcon: ({ color, size }) => (
//                         <Icon name="home-outline" color={color} size={size} />
//                     ),
//                 }}
//             />
//             <Drawer.Screen
//                 name="Notifications"
//                 component={NotificationsScreen}
//                 options={{
//                     drawerIcon: ({ color, size }) => (
//                         <Icon name="bell-outline" color={color} size={size} />
//                     ),
//                 }}
//             />
//         </Drawer.Navigator>
//     );
// };

// // Main Stack Navigator that wraps everything
// const ParentStackNavigator = () => {
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
//             }}
//         >
//             <Stack.Screen
//                 name="ParentDrawer"
//                 component={ParentDrawerNavigator}
//                 options={{ headerShown: false }}
//             />
//             {/* Child-related screens accessible from anywhere */}
//             <Stack.Screen
//                 name="ChildDashboard"
//                 component={ChildDashboardScreen}
//                 options={({ route }) => ({
//                     title: route.params?.childName || 'Child Dashboard',
//                 })}
//             />
//             <Stack.Screen
//                 name="ChildAttendance"
//                 component={ChildAttendanceScreen}
//                 options={({ route }) => ({
//                     title: `${route.params?.childName || 'Child'} Attendance`,
//                 })}
//             />
//             <Stack.Screen
//                 name="ChildGrades"
//                 component={ChildGradesScreen}
//                 options={({ route }) => ({
//                     title: `${route.params?.childName || 'Child'} Grades`,
//                 })}
//             />
//             <Stack.Screen
//                 name="ChildDiary"
//                 component={ChildDiaryScreen}
//                 options={({ route }) => ({
//                     title: `${route.params?.childName || 'Child'} Diary`,
//                 })}
//             />
//         </Stack.Navigator>
//     );
// };

// // Main Parent Navigator
// const ParentNavigator = () => {
//     return <ParentStackNavigator />;
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

// export default ParentNavigator;

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';

import ChildrenListScreen from '../screens/Parent/ChildrenListScreen';
import ChildDashboardScreen from '../screens/Parent/ChildDashboardScreen';
import ChildAttendanceScreen from '../screens/Parent/ChildAttendanceScreen';
import ChildGradesScreen from '../screens/Parent/ChildGradesScreen';
import ChildDiaryScreen from '../screens/Parent/ChildDiaryScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import NotificationsScreen from '../screens/Notifications/NotificationsScreen';
import NotificationHeader from '../components/NotificationHeader';
import NotificationDetailScreen from '../screens/Notifications/NotificationDetailScreen';
import NotificationHandler from '../components/NotificationHandler';
import { selectThemeData } from '../store/slices/themeSlice';
import { logout } from '../store/slices/authSlice';
import DiaryDetailScreen from '../screens/Parent/DiaryDetailScreen';
import ClassDiaryUnifiedScreen from '../screens/Parent/ClassDiaryAndSowScreen';

import StudentFeeLedgerScreen from '../screens/Parent/StudentFeeLedgerScreen';
import ComplaintDetailScreen from '../screens/Parent/ComplaintDetailScreen';

import ComplaintListScreen from '../screens/Parent/ComplaintListScreen';
import CreateComplaintScreen from '../screens/Parent/CreateComplaintScreen';
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
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </Text>
                    </View>
                    <Text style={[styles.userName, { color: theme.text }]}>
                        {user?.name || 'User'}
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

// Stack Navigator for Child-related screens
const ChildStackNavigator = () => {
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
            }}
        >
            <Stack.Screen
                name="ChildDashboard"
                component={ChildDashboardScreen}
                options={({ route }) => ({
                    title: route.params?.childName || 'Child Dashboard',
                })}
            />
            <Stack.Screen
                name="ChildAttendance"
                component={ChildAttendanceScreen}
                options={({ route }) => ({
                    title: `${route.params?.childName || 'Child'} Attendance`,
                })}
            />
            <Stack.Screen
                name="ChildGrades"
                component={ChildGradesScreen}
                options={({ route }) => ({
                    title: `${route.params?.childName || 'Child'} Grades`,
                })}
            />
            <Stack.Screen
                name="ChildDiary"
                component={ChildDiaryScreen}
                options={({ route }) => ({
                    title: `${route.params?.childName || 'Child'} Diary`,
                })}
            />

<Stack.Screen 
    name="DiaryDetail" 
    component={DiaryDetailScreen} 
    options={{ headerShown: false }} 
/>
                <Stack.Screen 
    name="StudentFeeLedger" 
    component={StudentFeeLedgerScreen}
    options={{ title: 'Fee Ledger' }}
/>


        </Stack.Navigator>
    );
};

// Main Home Tab Navigator
const HomeTabNavigator = () => {
    const theme = useSelector(selectThemeData);

    return (
        <Tab.Navigator
            screenOptions={({ route, navigation }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    switch (route.name) {
                        case 'ChildrenList':
                            iconName = focused ? 'account-group' : 'account-group-outline';
                            break;
                        case 'Profile':
                            iconName = focused ? 'account' : 'account-outline';
                            break;
                        case 'Settings':
                            iconName = focused ? 'cog' : 'cog-outline';
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
                name="ChildrenList"
                component={ChildrenListScreen}
                options={{ title: 'My Children' }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: 'Profile' }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ title: 'Settings' }}
            />
        </Tab.Navigator>
    );
};

// Main Drawer Navigator
const ParentDrawerNavigator = () => {
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
            initialRouteName="Home"
        >
            <Drawer.Screen
                name="Home"
                component={HomeTabNavigator}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Icon name="home-outline" color={color} size={size} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Notifications"
                component={NotificationsScreen}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Icon name="bell-outline" color={color} size={size} />
                    ),
                }}
            />
        </Drawer.Navigator>
    );
};

// Main Stack Navigator that wraps everything
const ParentStackNavigator = () => {
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
            }}
        >
            <Stack.Screen
                name="ParentDrawer"
                component={ParentDrawerNavigator}
                options={{ headerShown: false }}
            />
            
              {/* ✅ ADD DiaryDetail HERE - at the same level as Child screens */}
         <Stack.Screen 
                name="DiaryDetail" 
                component={DiaryDetailScreen} 
                options={({ route }) => ({
                    title: route.params?.childName ? `${route.params.childName}'s Diary` : 'Diary Entry',
                    headerShown: true,
                })}
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
            
<Stack.Screen 
    name="ClassDiaryAndSow" 
    component={ClassDiaryUnifiedScreen}
    options={{ title: 'Class Diary & SOW' }}
/>
            
            {/* Child-related screens accessible from anywhere */}
            <Stack.Screen
                name="ChildDashboard"
                component={ChildDashboardScreen}
                options={({ route }) => ({
                    title: route.params?.childName || 'Child Dashboard',
                })}
            />
            <Stack.Screen
                name="ChildAttendance"
                component={ChildAttendanceScreen}
                options={({ route }) => ({
                    title: `${route.params?.childName || 'Child'} Attendance`,
                })}
            />
            <Stack.Screen
                name="ChildGrades"
                component={ChildGradesScreen}
                options={({ route }) => ({
                    title: `${route.params?.childName || 'Child'} Grades`,
                })}
            />
            <Stack.Screen
                name="ChildDiary"
                component={ChildDiaryScreen}
                options={({ route }) => ({
                    title: `${route.params?.childName || 'Child'} Diary`,
                })}
            />

            <Stack.Screen 
    name="StudentFeeLedger" 
    component={StudentFeeLedgerScreen}
    options={{ title: 'Fee Ledger' }}
/>
     <Stack.Screen 
                name="ComplaintList" 
                component={ComplaintListScreen}
                options={{ headerShown: false }}
            />
            
            {/* Create Complaint Screen - File a new complaint */}
            <Stack.Screen 
                name="CreateComplaint" 
                component={CreateComplaintScreen}
                options={{ headerShown: false }}
            />
<Stack.Screen 
    name="ComplaintDetail" 
    component={ComplaintDetailScreen}
    options={{ headerShown: false }}
/>

        </Stack.Navigator>
    );
};

// Main Parent Navigator
const ParentNavigator = () => {
    return <ParentStackNavigator />;
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

export default ParentNavigator;