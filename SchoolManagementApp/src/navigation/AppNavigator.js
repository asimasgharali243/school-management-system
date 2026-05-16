
// // import React, { useEffect } from 'react';
// // import { NavigationContainer } from '@react-navigation/native';
// // import { useSelector, useDispatch } from 'react-redux';
// // import AuthNavigator from './AuthNavigator';
// // import TeacherNavigator from './TeacherNavigator';
// // import ParentNavigator from './ParentNavigator';
// // import DefaultNavigator from './DefaultNavigator';
// // import { selectIsAuthenticated, selectCurrentUser, validateToken } from '../store/slices/authSlice';
// // import LoadingScreen from '../screens/LoadingScreen';

// // const AppNavigator = () => {
// //     const dispatch = useDispatch();
// //     const isAuthenticated = useSelector(selectIsAuthenticated);
// //     const user = useSelector(selectCurrentUser);
// //     const [isLoading, setIsLoading] = React.useState(true);

// //     useEffect(() => {
// //         const initializeAuth = async () => {
// //             try {
// //                 console.log('🔄 Initializing auth state...');
// //                 await dispatch(validateToken()).unwrap();
// //                 console.log('✅ Auth initialized successfully');
// //             } catch (error) {
// //                 console.log('❌ Token validation failed:', error);
// //             } finally {
// //                 setIsLoading(false);
// //             }
// //         };

// //         initializeAuth();
// //     }, [dispatch]);

// //     if (isLoading) {
// //         return <LoadingScreen />;
// //     }

// //     console.log('👤 Current user role:', user?.roleID);
// //     console.log('🔐 Is authenticated:', isAuthenticated);

// //     const getRoleBasedNavigator = () => {
// //         if (!user || !user.roleID) {
// //             console.log('⚠️ No user role found, using DefaultNavigator');
// //             return <DefaultNavigator />;
// //         }

// //         switch (user.roleID) {
// //             case 3: // Teacher
// //                 console.log('👨‍🏫 Loading TeacherNavigator');
// //                 return <TeacherNavigator />;
// //             case 4: // Parent
// //                 console.log('👪 Loading ParentNavigator');
// //                 return <ParentNavigator />;
// //             default:
// //                 console.log('⚙️ Loading DefaultNavigator for role:', user.roleID);
// //                 return <DefaultNavigator />;
// //         }
// //     };

// //     return (
// //         <NavigationContainer>
// //             {isAuthenticated ? getRoleBasedNavigator() : <AuthNavigator />}
// //         </NavigationContainer>
// //     );
// // };

// // export default AppNavigator;
// // src/navigation/AppNavigator.js
// import React, { useEffect, forwardRef } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { useSelector, useDispatch } from 'react-redux';
// import AuthNavigator from './AuthNavigator';
// import TeacherNavigator from './TeacherNavigator';
// import ParentNavigator from './ParentNavigator';
// import DefaultNavigator from './DefaultNavigator';
// import NotificationDetailScreen from '../screens/Notifications/NotificationDetailScreen';
// import { selectIsAuthenticated, selectCurrentUser, validateToken } from '../store/slices/authSlice';
// import LoadingScreen from '../screens/LoadingScreen';

// const Stack = createNativeStackNavigator();

// // Create a wrapper component that returns the correct navigator
// const MainNavigator = () => {
//     const user = useSelector(selectCurrentUser);
    
//     if (!user || !user.roleID) {
//         console.log('⚠️ No user role found, using DefaultNavigator');
//         return <DefaultNavigator />;
//     }

//     switch (user.roleID) {
//         case 3:
//             console.log('👨‍🏫 Loading TeacherNavigator');
//             return <TeacherNavigator />;
//         case 4:
//             console.log('👪 Loading ParentNavigator');
//             return <ParentNavigator />;
//         default:
//             console.log('⚙️ Loading DefaultNavigator for role:', user.roleID);
//             return <DefaultNavigator />;
//     }
// };

// const AppNavigator = forwardRef((props, ref) => {
//     const dispatch = useDispatch();
//     const isAuthenticated = useSelector(selectIsAuthenticated);
//     const [isLoading, setIsLoading] = React.useState(true);

//     useEffect(() => {
//         const initializeAuth = async () => {
//             try {
//                 console.log('🔄 Initializing auth state...');
//                 await dispatch(validateToken()).unwrap();
//                 console.log('✅ Auth initialized successfully');
//             } catch (error) {
//                 console.log('❌ Token validation failed:', error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         initializeAuth();
//     }, [dispatch]);

//     if (isLoading) {
//         return <LoadingScreen />;
//     }

//     console.log('🔐 Is authenticated:', isAuthenticated);

//     return (
//         <NavigationContainer ref={ref}>
//             <Stack.Navigator screenOptions={{ headerShown: false }}>
//                 {!isAuthenticated ? (
//                     <Stack.Screen name="Auth" component={AuthNavigator} />
//                 ) : (
//                     <>
//                         <Stack.Screen name="Main" component={MainNavigator} />
//                         <Stack.Screen 
//                             name="NotificationDetail" 
//                             component={NotificationDetailScreen}
//                             options={{ 
//                                 presentation: 'modal',
//                                 animation: 'slide_from_bottom',
//                             }}
//                         />
//                     </>
//                 )}
//             </Stack.Navigator>
//         </NavigationContainer>
//     );
// });

// export default AppNavigator;
// src/navigation/AppNavigator.js
import React, { useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
import AuthNavigator from './AuthNavigator';
import TeacherNavigator from './TeacherNavigator';
import ParentNavigator from './ParentNavigator';
import DefaultNavigator from './DefaultNavigator';
import { selectIsAuthenticated, selectCurrentUser, validateToken } from '../store/slices/authSlice';
import LoadingScreen from '../screens/LoadingScreen';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
    const user = useSelector(selectCurrentUser);
    
    if (!user || !user.roleID) {
        return <DefaultNavigator />;
    }

    switch (user.roleID) {
        case 3:
            return <TeacherNavigator />;
        case 4:
            return <ParentNavigator />;
        default:
            return <DefaultNavigator />;
    }
};

const AppNavigator = forwardRef((props, ref) => {
    const { onReady } = props;
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const [isLoading, setIsLoading] = React.useState(true);
    const navigationRef = useRef(null);

    useImperativeHandle(ref, () => ({
        navigate: (screen, params) => {
            if (navigationRef.current) {
                navigationRef.current.navigate(screen, params);
            }
        },
        current: navigationRef.current
    }));

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                await dispatch(validateToken()).unwrap();
            } catch (error) {
                console.log('❌ Token validation failed:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, [dispatch]);

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <NavigationContainer 
            ref={navigationRef}
            onReady={() => {
                console.log('Navigation container ready');
                if (onReady) {
                    onReady();
                }
            }}
        >
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!isAuthenticated ? (
                    <Stack.Screen name="Auth" component={AuthNavigator} />
                ) : (
                    <Stack.Screen name="Main" component={MainNavigator} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
});

export default AppNavigator;