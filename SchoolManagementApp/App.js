

// // // import React, { useEffect, useState, useRef } from 'react';
// // // import { Provider, useDispatch, useSelector } from 'react-redux';
// // // import { store } from './src/store';
// // // import AppNavigator from './src/navigation/AppNavigator';
// // // import { StatusBar } from 'react-native';
// // // import { SafeAreaProvider } from 'react-native-safe-area-context';
// // // import { Platform, AppState, View, ActivityIndicator, Text } from 'react-native';
// // // import AsyncStorage from '@react-native-async-storage/async-storage';

// // // // Redux actions
// // // import { initializeAuth, selectIsInitialized, selectCurrentUser } from './src/store/slices/authSlice';

// // // // Import notification service
// // // let firebaseNotifications = null;

// // // const AppContent = () => {
// // //   const dispatch = useDispatch();
// // //   const isInitialized = useSelector(selectIsInitialized);
// // //   const currentUser = useSelector(selectCurrentUser);
// // //   const [appState, setAppState] = useState(AppState.currentState);
// // //   const [notificationsReady, setNotificationsReady] = useState(false);
// // //   const navigationRef = useRef(null);
// // //   const appStateRef = useRef(appState);

// // //   // Load notification service
// // //   useEffect(() => {
// // //     const loadNotificationService = async () => {
// // //       try {
// // //         console.log('📦 Loading notification service...');
// // //         const module = await import('./src/services/notificationService');
// // //         firebaseNotifications = module.default || module.firebaseNotifications;

// // //         if (firebaseNotifications) {
// // //           console.log('✅ Notification service loaded');
// // //           setNotificationsReady(true);
// // //         }
// // //       } catch (error) {
// // //         console.error('❌ Failed to load notification service:', error);
// // //       }
// // //     };

// // //     loadNotificationService();
// // //   }, []);

// // //   useEffect(() => {
// // //     // Initialize auth state
// // //     dispatch(initializeAuth());

// // //     // AppState listener
// // //     const subscription = AppState.addEventListener('change', handleAppStateChange);

// // //     return () => {
// // //       subscription.remove();
// // //       // Cleanup listeners only, not the whole service
// // //       if (firebaseNotifications && firebaseNotifications.cleanupListeners) {
// // //         firebaseNotifications.cleanupListeners();
// // //       }
// // //     };
// // //   }, [dispatch]);

// // //   const handleAppStateChange = async (nextAppState) => {
// // //     console.log('📱 App state changed:', appStateRef.current, '→', nextAppState);

// // //     if (appStateRef.current === 'active' && nextAppState.match(/inactive|background/)) {
// // //       // App going to background - cleanup listeners but keep service alive
// // //       console.log('⏸️ App going to background - cleaning up listeners');
// // //       if (firebaseNotifications && firebaseNotifications.cleanupListeners) {
// // //         firebaseNotifications.cleanupListeners();
// // //       }
// // //     } else if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
// // //       // App coming to foreground - reinitialize notifications
// // //       console.log('▶️ App coming to foreground - reinitializing notifications');
// // //       await initializeNotifications();
// // //     }

// // //     appStateRef.current = nextAppState;
// // //     setAppState(nextAppState);
// // //   };

// // //   // Initialize Firebase notifications when everything is ready
// // //   useEffect(() => {
// // //     const init = async () => {
// // //       if (isInitialized && currentUser && navigationRef.current && notificationsReady) {
// // //         await initializeNotifications();
// // //       }
// // //     };

// // //     init();
// // //   }, [isInitialized, currentUser, notificationsReady]);

// // //   const initializeNotifications = async () => {
// // //     try {
// // //       console.log('🔔 Initializing notifications...');

// // //       if (!firebaseNotifications) {
// // //         console.log('⚠️ Notification service not ready yet');
// // //         return;
// // //       }

// // //       // Set navigation reference
// // //       firebaseNotifications.setNavigationRef(navigationRef.current);

// // //       // Initialize Firebase
// // //       const token = await firebaseNotifications.initialize();

// // //       if (token) {
// // //         console.log('✅ Firebase initialized with token');

// // //         // Register current user
// // //         if (currentUser) {
// // //           await firebaseNotifications.registerUser(currentUser);
// // //           console.log('✅ User registered for Firebase notifications');
// // //         }

// // //         // Check for pending user registration
// // //         const pendingUserStr = await AsyncStorage.getItem('pending_notification_user');
// // //         if (pendingUserStr) {
// // //           const pendingUser = JSON.parse(pendingUserStr);
// // //           await firebaseNotifications.registerUser(pendingUser);
// // //           await AsyncStorage.removeItem('pending_notification_user');
// // //           console.log('✅ Pending user registered for notifications');
// // //         }
// // //       } else {
// // //         console.log('⚠️ Firebase initialization returned no token');
// // //       }
// // //     } catch (error) {
// // //       console.error('❌ Failed to initialize notifications:', error);
// // //     }
// // //   };

// // //   // Show loading screen until auth is initialized
// // //   if (!isInitialized) {
// // //     return (
// // //       <SafeAreaProvider>
// // //         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4A90E2' }}>
// // //           <ActivityIndicator size="large" color="#FFFFFF" />
// // //           <Text style={{ color: '#FFFFFF', marginTop: 20, fontSize: 16 }}>
// // //             Loading School Management...
// // //           </Text>
// // //         </View>
// // //       </SafeAreaProvider>
// // //     );
// // //   }

// // //   return (
// // //     <SafeAreaProvider>
// // //       <StatusBar
// // //         backgroundColor="#4A90E2"
// // //         barStyle="light-content"
// // //       />
// // //       <AppNavigator ref={navigationRef} />
// // //     </SafeAreaProvider>
// // //   );
// // // };

// // // const App = () => {
// // //   return (
// // //     <Provider store={store}>
// // //       <AppContent />
// // //     </Provider>
// // //   );
// // // };

// // // export default App;
// // // App.js

// // import React, { useEffect, useState, useRef } from 'react';
// // import { Provider, useDispatch, useSelector } from 'react-redux';
// // import { store } from './src/store';
// // import AppNavigator from './src/navigation/AppNavigator';
// // import { StatusBar, Platform, AppState, View, ActivityIndicator, Text, Alert } from 'react-native';
// // import { SafeAreaProvider } from 'react-native-safe-area-context';
// // import AsyncStorage from '@react-native-async-storage/async-storage';

// // // Redux actions
// // import { initializeAuth, selectIsInitialized, selectCurrentUser } from './src/store/slices/authSlice';

// // // Import notification service
// // let firebaseNotifications = null;

// // const AppContent = () => {
// //   const dispatch = useDispatch();
// //   const isInitialized = useSelector(selectIsInitialized);
// //   const currentUser = useSelector(selectCurrentUser);
// //   const [appState, setAppState] = useState(AppState.currentState);
// //   const [notificationsReady, setNotificationsReady] = useState(false);
// //   const navigationRef = useRef(null);
// //   const appStateRef = useRef(appState);

// //   // Load notification service
// //   useEffect(() => {
// //     const loadNotificationService = async () => {
// //       try {
// //         console.log('📦 Loading notification service...');
// //         const module = await import('./src/services/notificationService');
// //         firebaseNotifications = module.default || module.firebaseNotifications;

// //         if (firebaseNotifications) {
// //           console.log('✅ Notification service loaded');
          
// //           // Register foreground notification listener
// //           firebaseNotifications.setOnNotificationListener((remoteMessage) => {
// //             console.log('📱 Foreground notification received:', remoteMessage);
// //             // Show alert or custom toast for foreground notifications
// //             const data = remoteMessage.data;
// //             const isHtml = data?.is_html === 'true';
// //             Alert.alert(
// //               data?.title || 'New Notification',
// //               data?.body || 'You have a new notification',
// //               [
// //                 { text: 'Dismiss', style: 'cancel' },
// //                 { 
// //                   text: 'View', 
// //                   onPress: () => {
// //                     if (navigationRef.current) {
// //                       navigationRef.current.navigate('NotificationDetail', {
// //                         notificationData: data,
// //                         title: data?.title,
// //                         message: data?.message,
// //                         isHtml: isHtml,
// //                         titleHtml: data?.title_html,
// //                         messageHtml: data?.message_html,
// //                       });
// //                     }
// //                   }
// //                 }
// //               ]
// //             );
// //           });
          
// //           setNotificationsReady(true);
// //         }
// //       } catch (error) {
// //         console.error('❌ Failed to load notification service:', error);
// //       }
// //     };

// //     loadNotificationService();
// //   }, []);

// //   useEffect(() => {
// //     // Initialize auth state
// //     dispatch(initializeAuth());

// //     // AppState listener
// //     const subscription = AppState.addEventListener('change', handleAppStateChange);

// //     return () => {
// //       subscription.remove();
// //       if (firebaseNotifications && firebaseNotifications.cleanupListeners) {
// //         firebaseNotifications.cleanupListeners();
// //       }
// //     };
// //   }, [dispatch]);

// //   const handleAppStateChange = async (nextAppState) => {
// //     console.log('📱 App state changed:', appStateRef.current, '→', nextAppState);

// //     if (appStateRef.current === 'active' && nextAppState.match(/inactive|background/)) {
// //       console.log('⏸️ App going to background');
// //       if (firebaseNotifications && firebaseNotifications.cleanupListeners) {
// //         firebaseNotifications.cleanupListeners();
// //       }
// //     } else if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
// //       console.log('▶️ App coming to foreground');
// //       await initializeNotifications();
// //     }

// //     appStateRef.current = nextAppState;
// //     setAppState(nextAppState);
// //   };

// //   const initializeNotifications = async () => {
// //     try {
// //       console.log('🔔 Initializing notifications...');

// //       if (!firebaseNotifications) {
// //         console.log('⚠️ Notification service not ready yet');
// //         return;
// //       }

// //       firebaseNotifications.setNavigationRef(navigationRef.current);

// //       const token = await firebaseNotifications.initialize();

// //       if (token) {
// //         console.log('✅ Firebase initialized with token');

// //         if (currentUser) {
// //           await firebaseNotifications.registerUser(currentUser);
// //           console.log('✅ User registered for Firebase notifications');
// //         }

// //         const pendingUserStr = await AsyncStorage.getItem('pending_notification_user');
// //         if (pendingUserStr) {
// //           const pendingUser = JSON.parse(pendingUserStr);
// //           await firebaseNotifications.registerUser(pendingUser);
// //           await AsyncStorage.removeItem('pending_notification_user');
// //           console.log('✅ Pending user registered for notifications');
// //         }
// //       } else {
// //         console.log('⚠️ Firebase initialization returned no token');
// //       }
// //     } catch (error) {
// //       console.error('❌ Failed to initialize notifications:', error);
// //     }
// //   };

// //   if (!isInitialized) {
// //     return (
// //       <SafeAreaProvider>
// //         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4A90E2' }}>
// //           <ActivityIndicator size="large" color="#FFFFFF" />
// //           <Text style={{ color: '#FFFFFF', marginTop: 20, fontSize: 16 }}>
// //             Loading School Management...
// //           </Text>
// //         </View>
// //       </SafeAreaProvider>
// //     );
// //   }

// //   return (
// //     <SafeAreaProvider>
// //       <StatusBar
// //         backgroundColor="#4A90E2"
// //         barStyle="light-content"
// //       />
// //       <AppNavigator ref={navigationRef} />
// //     </SafeAreaProvider>
// //   );
// // };

// // const App = () => {
// //   return (
// //     <Provider store={store}>
// //       <AppContent />
// //     </Provider>
// //   );
// // };

// // export default App;
// // App.js
// import React, { useEffect, useState, useRef } from 'react';
// import { Provider, useDispatch, useSelector } from 'react-redux';
// import { store } from './src/store';
// import AppNavigator from './src/navigation/AppNavigator';
// import { StatusBar, Platform, AppState, View, ActivityIndicator, Text, Alert } from 'react-native';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// import { initializeAuth, selectIsInitialized, selectCurrentUser } from './src/store/slices/authSlice';

// let firebaseNotifications = null;

// const AppContent = () => {
//   const dispatch = useDispatch();
//   const isInitialized = useSelector(selectIsInitialized);
//   const currentUser = useSelector(selectCurrentUser);
//   const [appState, setAppState] = useState(AppState.currentState);
//   const navigationRef = useRef(null);
//   const appStateRef = useRef(appState);

//   useEffect(() => {
//     const loadNotificationService = async () => {
//       try {
//         console.log('📦 Loading notification service...');
//         const module = await import('./src/services/notificationService');
//         firebaseNotifications = module.default || module.firebaseNotifications;

//         if (firebaseNotifications) {
//           console.log('✅ Notification service loaded');
          
//           firebaseNotifications.setOnNotificationListener((remoteMessage) => {
//             console.log('📱 Foreground notification received:', remoteMessage);
//             const data = remoteMessage.data;
//             const isHtml = data?.is_html === 'true';
            
//             Alert.alert(
//               data?.title || 'New Notification',
//               data?.body || 'You have a new notification',
//               [
//                 { text: 'Dismiss', style: 'cancel' },
//                 { 
//                   text: 'View', 
//                   onPress: () => {
//                     if (navigationRef.current) {
//                       navigationRef.current.navigate('NotificationDetail', {
//                         notificationId: data?.notificationId || data?.queueID,
//                         title: data?.title,
//                         message: data?.message,
//                         isHtml: isHtml,
//                         titleHtml: data?.title_html,
//                         messageHtml: data?.message_html,
//                       });
//                     }
//                   }
//                 }
//               ]
//             );
//           });
//         }
//       } catch (error) {
//         console.error('❌ Failed to load notification service:', error);
//       }
//     };

//     loadNotificationService();
//   }, []);

//   useEffect(() => {
//     dispatch(initializeAuth());

//     const subscription = AppState.addEventListener('change', handleAppStateChange);

//     return () => {
//       subscription.remove();
//       if (firebaseNotifications && firebaseNotifications.cleanupListeners) {
//         firebaseNotifications.cleanupListeners();
//       }
//     };
//   }, [dispatch]);

//   const handleAppStateChange = async (nextAppState) => {
//     console.log('📱 App state changed:', appStateRef.current, '→', nextAppState);

//     if (appStateRef.current === 'active' && nextAppState.match(/inactive|background/)) {
//       console.log('⏸️ App going to background');
//       if (firebaseNotifications && firebaseNotifications.cleanupListeners) {
//         firebaseNotifications.cleanupListeners();
//       }
//     } else if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
//       console.log('▶️ App coming to foreground');
//       await initializeNotifications();
//     }

//     appStateRef.current = nextAppState;
//     setAppState(nextAppState);
//   };

//   const initializeNotifications = async () => {
//     try {
//       console.log('🔔 Initializing notifications...');

//       if (!firebaseNotifications) {
//         console.log('⚠️ Notification service not ready yet');
//         return;
//       }

//       if (navigationRef.current) {
//         firebaseNotifications.setNavigationRef(navigationRef.current);
//       }

//       const token = await firebaseNotifications.initialize();

//       if (token) {
//         console.log('✅ Firebase initialized with token');

//         if (currentUser) {
//           await firebaseNotifications.registerUser(currentUser);
//           console.log('✅ User registered for Firebase notifications');
//         }

//         const pendingUserStr = await AsyncStorage.getItem('pending_notification_user');
//         if (pendingUserStr) {
//           const pendingUser = JSON.parse(pendingUserStr);
//           await firebaseNotifications.registerUser(pendingUser);
//           await AsyncStorage.removeItem('pending_notification_user');
//           console.log('✅ Pending user registered for notifications');
//         }
//       }
//     } catch (error) {
//       console.error('❌ Failed to initialize notifications:', error);
//     }
//   };

//   useEffect(() => {
//     if (navigationRef.current && firebaseNotifications) {
//       firebaseNotifications.setNavigationRef(navigationRef.current);
//     }
//   }, [navigationRef.current]);

//   if (!isInitialized) {
//     return (
//       <SafeAreaProvider>
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4A90E2' }}>
//           <ActivityIndicator size="large" color="#FFFFFF" />
//           <Text style={{ color: '#FFFFFF', marginTop: 20, fontSize: 16 }}>
//             Loading School Management...
//           </Text>
//         </View>
//       </SafeAreaProvider>
//     );
//   }

//   return (
//     <SafeAreaProvider>
//       <StatusBar backgroundColor="#4A90E2" barStyle="light-content" />
//       <AppNavigator ref={navigationRef} />
//     </SafeAreaProvider>
//   );
// };

// const App = () => {
//   return (
//     <Provider store={store}>
//       <AppContent />
//     </Provider>
//   );
// };

// export default App;
// App.js
import React, { useEffect, useState, useRef } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar, View, ActivityIndicator, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, selectIsInitialized } from './src/store/slices/authSlice';

let firebaseNotifications = null;

const AppContent = () => {
  const dispatch = useDispatch();
  const isInitialized = useSelector(selectIsInitialized);
  const [isLoading, setIsLoading] = useState(true);
  const navigationRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      console.log('🚀 App initializing...');
      
      await dispatch(initializeAuth());
      
      try {
        const module = await import('./src/services/notificationService');
        firebaseNotifications = module.default;
        
        if (firebaseNotifications) {
          console.log('✅ Notification service loaded');
        }
      } catch (error) {
        console.error('❌ Failed to load notification service:', error);
      }
      
      // Clear any stale pending notifications on app start
      await AsyncStorage.removeItem('pending_notification');
      
      setIsLoading(false);
    };
    
    init();
  }, []);

  const onNavigatorReady = () => {
    console.log('🎯 Navigator ready!');
    
    if (firebaseNotifications && navigationRef.current) {
      firebaseNotifications.setNavigationRef(navigationRef.current);
      
      firebaseNotifications.initialize().then(async (token) => {
        if (token) {
          const userStr = await AsyncStorage.getItem('user');
          if (userStr) {
            const user = JSON.parse(userStr);
            await firebaseNotifications.registerUser(user);
          }
        }
      });
    }
  };

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4A90E2' }}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={{ color: '#FFFFFF', marginTop: 20, fontSize: 16 }}>
            Loading School Management...
          </Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor="#4A90E2" barStyle="light-content" />
      <AppNavigator 
        ref={navigationRef}
        onReady={onNavigatorReady}
      />
    </SafeAreaProvider>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;