

// // // // // src/services/notificationService.js
// // // // import messaging from '@react-native-firebase/messaging';
// // // // import notifee, { AndroidImportance, AndroidColor } from '@notifee/react-native';
// // // // import { Platform, Alert, AppState, Linking } from 'react-native';
// // // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // // import { BASE_URL } from "../config/constants";

// // // // class FirebaseNotificationService {
// // // //     constructor() {
// // // //         if (FirebaseNotificationService.instance) {
// // // //             return FirebaseNotificationService.instance;
// // // //         }

// // // //         this.isInitialized = false;
// // // //         this.userId = null;
// // // //         this.currentToken = null;
// // // //         this.navigationRef = null;
// // // //         this.listeners = [];

// // // //         FirebaseNotificationService.instance = this;
// // // //     }

// // // //     setNavigationRef(ref) {
// // // //         this.navigationRef = ref;
// // // //     }

// // // //     async initialize() {
// // // //         if (this.isInitialized && this.currentToken) {
// // // //             console.log('🔥 Firebase already initialized, returning existing token');
// // // //             return this.currentToken;
// // // //         }

// // // //         try {
// // // //             console.log('🔥 Initializing Firebase FCM...');

// // // //             // Register device
// // // //             await messaging().registerDeviceForRemoteMessages();
// // // //             console.log('✅ Device registered for remote messages');

// // // //             // Request permission
// // // //             const hasPermission = await this.requestPermission();
// // // //             if (!hasPermission) {
// // // //                 console.warn('⚠️ Notification permissions not granted');
// // // //                 return null;
// // // //             }

// // // //             // Get FCM token
// // // //             this.currentToken = await messaging().getToken();
// // // //             if (!this.currentToken) {
// // // //                 console.warn('⚠️ Could not get FCM token');
// // // //                 return null;
// // // //             }

// // // //             console.log('✅ FCM token obtained:', this.currentToken.substring(0, 20) + '...');

// // // //             // Store token
// // // //             await AsyncStorage.setItem('fcm_token', this.currentToken);

// // // //             // Create Android channel
// // // //             if (Platform.OS === 'android') {
// // // //                 await this.createNotificationChannel();
// // // //             }

// // // //             // Setup listeners
// // // //             this.setupListeners();

// // // //             this.isInitialized = true;
// // // //             console.log('✅ Firebase FCM initialized successfully');

// // // //             return this.currentToken;
// // // //         } catch (error) {
// // // //             console.error('❌ Firebase initialization error:', error);
// // // //             return null;
// // // //         }
// // // //     }

// // // //     async requestPermission() {
// // // //         try {
// // // //             if (Platform.OS === 'ios') {
// // // //                 const authStatus = await messaging().requestPermission({
// // // //                     sound: true,
// // // //                     announcement: true,
// // // //                     alert: true,
// // // //                     badge: true,
// // // //                 });

// // // //                 const enabled =
// // // //                     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
// // // //                     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

// // // //                 if (!enabled) {
// // // //                     this.showPermissionAlert();
// // // //                     return false;
// // // //                 }
// // // //             } else {
// // // //                 const authStatus = await messaging().hasPermission();
// // // //                 if (authStatus !== messaging.AuthorizationStatus.AUTHORIZED &&
// // // //                     authStatus !== messaging.AuthorizationStatus.PROVISIONAL) {
// // // //                     const newStatus = await messaging().requestPermission();
// // // //                     const enabled =
// // // //                         newStatus === messaging.AuthorizationStatus.AUTHORIZED ||
// // // //                         newStatus === messaging.AuthorizationStatus.PROVISIONAL;

// // // //                     if (!enabled) {
// // // //                         this.showPermissionAlert();
// // // //                         return false;
// // // //                     }
// // // //                 }
// // // //             }

// // // //             console.log('✅ Notification permission granted');
// // // //             return true;
// // // //         } catch (error) {
// // // //             console.error('❌ Permission request error:', error);
// // // //             return false;
// // // //         }
// // // //     }

// // // //     async createNotificationChannel() {
// // // //         if (Platform.OS !== 'android') return;

// // // //         try {
// // // //             await notifee.createChannel({
// // // //                 id: 'default',
// // // //                 name: 'Default Channel',
// // // //                 importance: AndroidImportance.HIGH,
// // // //                 sound: 'default',
// // // //                 vibration: true,
// // // //                 vibrationPattern: [300, 500],
// // // //                 lightColor: AndroidColor.BLUE,
// // // //             });

// // // //             console.log('✅ Android notification channel created');
// // // //         } catch (error) {
// // // //             console.error('❌ Error creating channel:', error);
// // // //         }
// // // //     }

// // // //     setupListeners() {
// // // //         console.log('🎧 Setting up Firebase listeners...');

// // // //         // Clean up existing listeners
// // // //         this.cleanupListeners();

// // // //         // Foreground messages
// // // //         const foregroundListener = messaging().onMessage(async remoteMessage => {
// // // //             console.log('📱 Foreground FCM message received:', remoteMessage);
// // // //             await this.displayNotification(remoteMessage);
// // // //         });

// // // //         // Notification opened from background
// // // //         const notificationOpenedListener = messaging().onNotificationOpenedApp(remoteMessage => {
// // // //             console.log('👆 Notification opened from background');
// // // //             this.handleNotificationTap(remoteMessage);
// // // //         });

// // // //         // Token refresh
// // // //         messaging().onTokenRefresh(async (token) => {
// // // //             console.log('🔄 FCM token refreshed');
// // // //             this.currentToken = token;
// // // //             await AsyncStorage.setItem('fcm_token', token);

// // // //             // Update backend with new token
// // // //             if (this.userId) {
// // // //                 await this.updateTokenInBackend(token);
// // // //             }
// // // //         });

// // // //         // Background messages
// // // //         messaging().setBackgroundMessageHandler(async remoteMessage => {
// // // //             console.log('📱 Background FCM message received');
// // // //             await this.displayNotification(remoteMessage);
// // // //             return Promise.resolve();
// // // //         });

// // // //         // Check initial notification
// // // //         messaging().getInitialNotification().then(remoteMessage => {
// // // //             if (remoteMessage) {
// // // //                 console.log('📱 App opened via notification');
// // // //                 setTimeout(() => {
// // // //                     this.handleNotificationTap(remoteMessage);
// // // //                 }, 1000);
// // // //             }
// // // //         });

// // // //         this.listeners = [foregroundListener, notificationOpenedListener];
// // // //         console.log('✅ Firebase listeners setup complete');
// // // //     }

// // // //     async registerUser(userData) {
// // // //         if (!userData || !userData.id) {
// // // //             console.warn('⚠️ No user data provided for registration');
// // // //             return false;
// // // //         }

// // // //         if (this.userId === userData.id) {
// // // //             console.log('👤 User already registered:', userData.id);
// // // //             return true;
// // // //         }

// // // //         this.userId = userData.id;
// // // //         console.log('👤 Registering user for notifications:', userData.id);

// // // //         try {
// // // //             const token = this.currentToken || await AsyncStorage.getItem('fcm_token');
// // // //             if (!token) {
// // // //                 console.warn('⚠️ No FCM token available for registration');
// // // //                 return false;
// // // //             }

// // // //             const success = await this.registerWithBackend(userData.id, token, userData.roleName || 'PARENT');

// // // //             if (success) {
// // // //                 console.log('✅ User registered for notifications successfully');
// // // //                 return true;
// // // //             } else {
// // // //                 console.error('❌ User registration failed');
// // // //                 return false;
// // // //             }
// // // //         } catch (error) {
// // // //             console.error('❌ Error registering user:', error);
// // // //             return false;
// // // //         }
// // // //     }

// // // //     async registerWithBackend(userId, token, userType) {
// // // //         try {
// // // //             const authToken = await AsyncStorage.getItem('token');

// // // //             const deviceInfo = {
// // // //                 UserId: userId,
// // // //                 FCMToken: token,
// // // //                 UserType: userType,
// // // //                 Platform: Platform.OS.toUpperCase(),
// // // //                 DeviceModel: Platform.constants?.Model || 'Unknown',
// // // //                 AppVersion: '1.0.0',
// // // //                 OSVersion: Platform.Version?.toString() || 'Unknown',
// // // //             };

// // // //             console.log('📤 Registering device with backend:', deviceInfo);

// // // //             const response = await fetch(`${BASE_URL}/api/pushnotification/register-device-fcm`, {
// // // //                 method: 'POST',
// // // //                 headers: {
// // // //                     'Content-Type': 'application/json',
// // // //                     ...(authToken && { 'Authorization': `Bearer ${authToken}` })
// // // //                 },
// // // //                 body: JSON.stringify(deviceInfo),
// // // //             });

// // // //             if (!response.ok) {
// // // //                 const errorText = await response.text();
// // // //                 console.error('❌ Backend registration failed:', errorText);
// // // //                 return false;
// // // //             }

// // // //             const result = await response.json();
// // // //             console.log('📥 Backend response:', result);

// // // //             if (result.success) {
// // // //                 await AsyncStorage.setItem('backend_token_registered', 'true');
// // // //                 return true;
// // // //             } else {
// // // //                 console.error('❌ Backend registration failed:', result.message);
// // // //                 return false;
// // // //             }
// // // //         } catch (error) {
// // // //             console.error('❌ Error registering with backend:', error);
// // // //             return false;
// // // //         }
// // // //     }

// // // //     async updateTokenInBackend(newToken) {
// // // //         if (!this.userId || !newToken) return false;

// // // //         try {
// // // //             const userStr = await AsyncStorage.getItem('user');
// // // //             if (!userStr) return false;

// // // //             const user = JSON.parse(userStr);
// // // //             return await this.registerWithBackend(user.id, newToken, user.roleName || 'PARENT');
// // // //         } catch (error) {
// // // //             console.error('❌ Error updating token in backend:', error);
// // // //             return false;
// // // //         }
// // // //     }

// // // //     async displayNotification(remoteMessage) {
// // // //         try {
// // // //             const { notification, data } = remoteMessage;

// // // //             const title = notification?.title || data?.title || 'School Notification';
// // // //             const body = notification?.body || data?.body || 'You have a new notification';

// // // //             await notifee.displayNotification({
// // // //                 title: title,
// // // //                 body: body,
// // // //                 data: data || {},
// // // //                 android: {
// // // //                     channelId: 'default',
// // // //                     smallIcon: 'ic_notification',
// // // //                     color: '#4A90E2',
// // // //                     pressAction: {
// // // //                         id: 'default',
// // // //                     },
// // // //                 },
// // // //                 ios: {
// // // //                     sound: 'default',
// // // //                     badge: 1,
// // // //                 },
// // // //             });

// // // //             console.log('✅ Notification displayed:', title);

// // // //             // Fetch updated notification count
// // // //             this.fetchNotificationCount();
// // // //         } catch (error) {
// // // //             console.error('❌ Error displaying notification:', error);
// // // //         }
// // // //     }

// // // //     handleNotificationTap(remoteMessage) {
// // // //         const { data } = remoteMessage;
// // // //         console.log('👆 Notification tapped with data:', data);

// // // //         if (!this.navigationRef) {
// // // //             console.warn('⚠️ No navigation reference available');
// // // //             return;
// // // //         }

// // // //         try {
// // // //             // Navigate to notifications screen
// // // //             this.navigationRef.navigate('Notifications');

// // // //             // Clear badge count
// // // //             notifee.setBadgeCount(0);
// // // //         } catch (error) {
// // // //             console.error('❌ Error navigating from notification:', error);
// // // //         }
// // // //     }

// // // //     async fetchNotificationCount() {
// // // //         try {
// // // //             const authToken = await AsyncStorage.getItem('token');
// // // //             const userStr = await AsyncStorage.getItem('user');

// // // //             if (!authToken || !userStr) return 0;

// // // //             const user = JSON.parse(userStr);
// // // //             const response = await fetch(`${BASE_URL}/api/notifications/unread-count/${user.id}`, {
// // // //                 headers: {
// // // //                     'Authorization': `Bearer ${authToken}`
// // // //                 }
// // // //             });

// // // //             if (response.ok) {
// // // //                 const result = await response.json();
// // // //                 return result.count || 0;
// // // //             }
// // // //         } catch (error) {
// // // //             console.error('❌ Error fetching notification count:', error);
// // // //         }

// // // //         return 0;
// // // //     }

// // // //     showPermissionAlert() {
// // // //         Alert.alert(
// // // //             'Notifications Required',
// // // //             'This app needs notifications for important updates like attendance alerts, fee reminders, and announcements.',
// // // //             [
// // // //                 { text: 'Cancel', style: 'cancel' },
// // // //                 {
// // // //                     text: 'Open Settings',
// // // //                     onPress: () => {
// // // //                         if (Platform.OS === 'ios') {
// // // //                             Linking.openURL('app-settings:');
// // // //                         } else {
// // // //                             Linking.openSettings();
// // // //                         }
// // // //                     }
// // // //                 }
// // // //             ]
// // // //         );
// // // //     }

// // // //     async logoutCleanup() {
// // // //         this.userId = null;
// // // //         await AsyncStorage.removeItem('backend_token_registered');
// // // //         console.log('✅ Notification service cleaned up for logout');
// // // //     }

// // // //     cleanupListeners() {
// // // //         console.log('🧹 Cleaning up Firebase listeners...');

// // // //         this.listeners.forEach(unsubscribe => {
// // // //             try {
// // // //                 if (typeof unsubscribe === 'function') unsubscribe();
// // // //             } catch (error) {
// // // //                 console.error('❌ Error unsubscribing listener:', error);
// // // //             }
// // // //         });

// // // //         this.listeners = [];
// // // //         console.log('✅ Firebase listeners cleaned up');
// // // //     }

// // // //     fullCleanup() {
// // // //         this.cleanupListeners();
// // // //         this.isInitialized = false;
// // // //         this.currentToken = null;
// // // //         this.userId = null;
// // // //         console.log('✅ Firebase notification service fully cleaned up');
// // // //     }

// // // //     cleanup() {
// // // //         this.cleanupListeners();
// // // //         this.isInitialized = false;
// // // //         this.currentToken = null;
// // // //         console.log('✅ Firebase notification service fully cleaned up');
// // // //     }
// // // // }

// // // // // Create and export the instance
// // // // const firebaseNotifications = new FirebaseNotificationService();

// // // // // Export both as default and named export for compatibility
// // // // export default firebaseNotifications;
// // // // export { firebaseNotifications };
// // // // src/services/notificationService.js

// // // import messaging from '@react-native-firebase/messaging';
// // // import notifee, { AndroidImportance, AndroidColor } from '@notifee/react-native';
// // // import { Platform, Alert, AppState, Linking } from 'react-native';
// // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // import { BASE_URL } from "../config/constants";

// // // class FirebaseNotificationService {
// // //     constructor() {
// // //         if (FirebaseNotificationService.instance) {
// // //             return FirebaseNotificationService.instance;
// // //         }

// // //         this.isInitialized = false;
// // //         this.userId = null;
// // //         this.currentToken = null;
// // //         this.navigationRef = null;
// // //         this.listeners = [];
// // //         this.onNotificationListener = null;

// // //         FirebaseNotificationService.instance = this;
// // //     }

// // //     setNavigationRef(ref) {
// // //         this.navigationRef = ref;
// // //     }

// // //     // Register a callback for foreground notifications
// // //     setOnNotificationListener(callback) {
// // //         this.onNotificationListener = callback;
// // //     }

// // //     async initialize() {
// // //         if (this.isInitialized && this.currentToken) {
// // //             console.log('🔥 Firebase already initialized, returning existing token');
// // //             return this.currentToken;
// // //         }

// // //         try {
// // //             console.log('🔥 Initializing Firebase FCM...');

// // //             // Register device
// // //             await messaging().registerDeviceForRemoteMessages();
// // //             console.log('✅ Device registered for remote messages');

// // //             // Request permission
// // //             const hasPermission = await this.requestPermission();
// // //             if (!hasPermission) {
// // //                 console.warn('⚠️ Notification permissions not granted');
// // //                 return null;
// // //             }

// // //             // Get FCM token
// // //             this.currentToken = await messaging().getToken();
// // //             if (!this.currentToken) {
// // //                 console.warn('⚠️ Could not get FCM token');
// // //                 return null;
// // //             }

// // //             console.log('✅ FCM token obtained:', this.currentToken.substring(0, 20) + '...');

// // //             // Store token
// // //             await AsyncStorage.setItem('fcm_token', this.currentToken);

// // //             // Create Android channel
// // //             if (Platform.OS === 'android') {
// // //                 await this.createNotificationChannel();
// // //             }

// // //             // Setup listeners
// // //             this.setupListeners();

// // //             this.isInitialized = true;
// // //             console.log('✅ Firebase FCM initialized successfully');

// // //             return this.currentToken;
// // //         } catch (error) {
// // //             console.error('❌ Firebase initialization error:', error);
// // //             return null;
// // //         }
// // //     }

// // //     async requestPermission() {
// // //         try {
// // //             if (Platform.OS === 'ios') {
// // //                 const authStatus = await messaging().requestPermission({
// // //                     sound: true,
// // //                     announcement: true,
// // //                     alert: true,
// // //                     badge: true,
// // //                 });

// // //                 const enabled =
// // //                     authStatus === messaging().AuthorizationStatus.AUTHORIZED ||
// // //                     authStatus === messaging().AuthorizationStatus.PROVISIONAL;

// // //                 if (!enabled) {
// // //                     this.showPermissionAlert();
// // //                     return false;
// // //                 }
// // //             } else {
// // //                 const authStatus = await messaging().hasPermission();
// // //                 if (authStatus !== messaging().AuthorizationStatus.AUTHORIZED &&
// // //                     authStatus !== messaging().AuthorizationStatus.PROVISIONAL) {
// // //                     const newStatus = await messaging().requestPermission();
// // //                     const enabled =
// // //                         newStatus === messaging().AuthorizationStatus.AUTHORIZED ||
// // //                         newStatus === messaging().AuthorizationStatus.PROVISIONAL;

// // //                     if (!enabled) {
// // //                         this.showPermissionAlert();
// // //                         return false;
// // //                     }
// // //                 }
// // //             }

// // //             console.log('✅ Notification permission granted');
// // //             return true;
// // //         } catch (error) {
// // //             console.error('❌ Permission request error:', error);
// // //             return false;
// // //         }
// // //     }

// // //     async createNotificationChannel() {
// // //         if (Platform.OS !== 'android') return;

// // //         try {
// // //             await notifee.createChannel({
// // //                 id: 'default',
// // //                 name: 'Default Channel',
// // //                 importance: AndroidImportance.HIGH,
// // //                 sound: 'default',
// // //                 vibration: true,
// // //                 vibrationPattern: [300, 500],
// // //                 lightColor: AndroidColor.BLUE,
// // //             });

// // //             // Create HTML notification channel
// // //             await notifee.createChannel({
// // //                 id: 'html_notifications',
// // //                 name: 'HTML Notifications',
// // //                 importance: AndroidImportance.HIGH,
// // //                 sound: 'default',
// // //             });

// // //             console.log('✅ Android notification channels created');
// // //         } catch (error) {
// // //             console.error('❌ Error creating channel:', error);
// // //         }
// // //     }

// // //     setupListeners() {
// // //         console.log('🎧 Setting up Firebase listeners...');

// // //         // Clean up existing listeners
// // //         this.cleanupListeners();

// // //         // Foreground messages - CRITICAL for showing notifications while app is open
// // //         const foregroundListener = messaging().onMessage(async remoteMessage => {
// // //             console.log('📱 Foreground FCM message received:', remoteMessage);
            
// // //             // Show notification even in foreground
// // //             await this.displayNotification(remoteMessage);
            
// // //             // Call custom listener if registered
// // //             if (this.onNotificationListener) {
// // //                 this.onNotificationListener(remoteMessage);
// // //             }
// // //         });

// // //         // Notification opened from background/quit state
// // //         const notificationOpenedListener = messaging().onNotificationOpenedApp(remoteMessage => {
// // //             console.log('👆 Notification opened from background');
// // //             this.handleNotificationTap(remoteMessage);
// // //         });

// // //         // Token refresh
// // //         messaging().onTokenRefresh(async (token) => {
// // //             console.log('🔄 FCM token refreshed');
// // //             this.currentToken = token;
// // //             await AsyncStorage.setItem('fcm_token', token);

// // //             if (this.userId) {
// // //                 await this.updateTokenInBackend(token);
// // //             }
// // //         });

// // //         // Background messages handler
// // //         messaging().setBackgroundMessageHandler(async remoteMessage => {
// // //             console.log('📱 Background FCM message received');
// // //             await this.displayNotification(remoteMessage);
// // //             return Promise.resolve();
// // //         });

// // //         // Check initial notification (app opened from quit state)
// // //         messaging().getInitialNotification().then(remoteMessage => {
// // //             if (remoteMessage) {
// // //                 console.log('📱 App opened from quit state via notification');
// // //                 setTimeout(() => {
// // //                     this.handleNotificationTap(remoteMessage);
// // //                 }, 1000);
// // //             }
// // //         });

// // //         this.listeners = [foregroundListener, notificationOpenedListener];
// // //         console.log('✅ Firebase listeners setup complete');
// // //     }

// // //     async displayNotification(remoteMessage) {
// // //         try {
// // //             const { notification, data } = remoteMessage;
            
// // //             // Check if this is an HTML notification
// // //             const isHtml = data?.is_html === 'true' || data?.title_html || data?.message_html;
            
// // //             let title = notification?.title || data?.title || 'School Notification';
// // //             let body = notification?.body || data?.body || 'You have a new notification';
            
// // //             // For HTML notifications, use plain text for system tray
// // //             if (isHtml) {
// // //                 title = data?.title || 'School Notification';
// // //                 body = data?.body || 'Tap to view HTML content';
// // //             }
            
// // //             await notifee.displayNotification({
// // //                 title: title,
// // //                 body: body,
// // //                 data: {
// // //                     ...data,
// // //                     is_html: isHtml ? 'true' : 'false',
// // //                     title_html: data?.title_html || data?.title,
// // //                     message_html: data?.message_html || data?.message,
// // //                 },
// // //                 android: {
// // //                     channelId: isHtml ? 'html_notifications' : 'default',
// // //                     smallIcon: 'ic_notification',
// // //                     color: '#4A90E2',
// // //                     pressAction: {
// // //                         id: 'default',
// // //                     },
// // //                 },
// // //                 ios: {
// // //                     sound: 'default',
// // //                     badge: 1,
// // //                 },
// // //             });

// // //             console.log('✅ Notification displayed:', title);
            
// // //             // Fetch updated notification count
// // //             this.fetchNotificationCount();
// // //         } catch (error) {
// // //             console.error('❌ Error displaying notification:', error);
// // //         }
// // //     }

// // //     handleNotificationTap(remoteMessage) {
// // //         const { data } = remoteMessage;
// // //         console.log('👆 Notification tapped with data:', data);

// // //         if (!this.navigationRef) {
// // //             console.warn('⚠️ No navigation reference available');
// // //             return;
// // //         }

// // //         try {
// // //             // Navigate to notification detail screen with the data
// // //             this.navigationRef.navigate('NotificationDetail', {
// // //                 notificationData: data,
// // //                 title: data?.title || 'Notification',
// // //                 message: data?.message || '',
// // //                 isHtml: data?.is_html === 'true',
// // //                 titleHtml: data?.title_html,
// // //                 messageHtml: data?.message_html,
// // //             });
// // //         } catch (error) {
// // //             console.error('❌ Error navigating from notification:', error);
// // //         }
// // //     }

// // //     async fetchNotificationCount() {
// // //         try {
// // //             const authToken = await AsyncStorage.getItem('token');
// // //             const userStr = await AsyncStorage.getItem('user');

// // //             if (!authToken || !userStr) return 0;

// // //             const user = JSON.parse(userStr);
// // //             const response = await fetch(`${BASE_URL}/api/notifications/unread-count/${user.id}`, {
// // //                 headers: {
// // //                     'Authorization': `Bearer ${authToken}`
// // //                 }
// // //             });

// // //             if (response.ok) {
// // //                 const result = await response.json();
// // //                 return result.count || 0;
// // //             }
// // //         } catch (error) {
// // //             console.error('❌ Error fetching notification count:', error);
// // //         }

// // //         return 0;
// // //     }

// // //     async registerUser(userData) {
// // //         if (!userData || !userData.id) {
// // //             console.warn('⚠️ No user data provided for registration');
// // //             return false;
// // //         }

// // //         if (this.userId === userData.id) {
// // //             console.log('👤 User already registered:', userData.id);
// // //             return true;
// // //         }

// // //         this.userId = userData.id;
// // //         console.log('👤 Registering user for notifications:', userData.id);

// // //         try {
// // //             const token = this.currentToken || await AsyncStorage.getItem('fcm_token');
// // //             if (!token) {
// // //                 console.warn('⚠️ No FCM token available for registration');
// // //                 return false;
// // //             }

// // //             const success = await this.registerWithBackend(userData.id, token, userData.roleName || 'PARENT');

// // //             if (success) {
// // //                 console.log('✅ User registered for notifications successfully');
// // //                 return true;
// // //             } else {
// // //                 console.error('❌ User registration failed');
// // //                 return false;
// // //             }
// // //         } catch (error) {
// // //             console.error('❌ Error registering user:', error);
// // //             return false;
// // //         }
// // //     }

// // //     async registerWithBackend(userId, token, userType) {
// // //         try {
// // //             const authToken = await AsyncStorage.getItem('token');

// // //             const deviceInfo = {
// // //                 UserId: userId,
// // //                 FCMToken: token,
// // //                 UserType: userType,
// // //                 Platform: Platform.OS.toUpperCase(),
// // //                 DeviceModel: Platform.constants?.Model || 'Unknown',
// // //                 AppVersion: '1.0.0',
// // //                 OSVersion: Platform.Version?.toString() || 'Unknown',
// // //             };

// // //             console.log('📤 Registering device with backend:', deviceInfo);

// // //             const response = await fetch(`${BASE_URL}/api/pushnotification/register-device-fcm`, {
// // //                 method: 'POST',
// // //                 headers: {
// // //                     'Content-Type': 'application/json',
// // //                     ...(authToken && { 'Authorization': `Bearer ${authToken}` })
// // //                 },
// // //                 body: JSON.stringify(deviceInfo),
// // //             });

// // //             if (!response.ok) {
// // //                 const errorText = await response.text();
// // //                 console.error('❌ Backend registration failed:', errorText);
// // //                 return false;
// // //             }

// // //             const result = await response.json();
// // //             console.log('📥 Backend response:', result);

// // //             if (result.success) {
// // //                 await AsyncStorage.setItem('backend_token_registered', 'true');
// // //                 return true;
// // //             } else {
// // //                 console.error('❌ Backend registration failed:', result.message);
// // //                 return false;
// // //             }
// // //         } catch (error) {
// // //             console.error('❌ Error registering with backend:', error);
// // //             return false;
// // //         }
// // //     }

// // //     async updateTokenInBackend(newToken) {
// // //         if (!this.userId || !newToken) return false;

// // //         try {
// // //             const userStr = await AsyncStorage.getItem('user');
// // //             if (!userStr) return false;

// // //             const user = JSON.parse(userStr);
// // //             return await this.registerWithBackend(user.id, newToken, user.roleName || 'PARENT');
// // //         } catch (error) {
// // //             console.error('❌ Error updating token in backend:', error);
// // //             return false;
// // //         }
// // //     }

// // //     showPermissionAlert() {
// // //         Alert.alert(
// // //             'Notifications Required',
// // //             'This app needs notifications for important updates like attendance alerts, fee reminders, and announcements.',
// // //             [
// // //                 { text: 'Cancel', style: 'cancel' },
// // //                 {
// // //                     text: 'Open Settings',
// // //                     onPress: () => {
// // //                         if (Platform.OS === 'ios') {
// // //                             Linking.openURL('app-settings:');
// // //                         } else {
// // //                             Linking.openSettings();
// // //                         }
// // //                     }
// // //                 }
// // //             ]
// // //         );
// // //     }

// // //     async logoutCleanup() {
// // //         this.userId = null;
// // //         await AsyncStorage.removeItem('backend_token_registered');
// // //         console.log('✅ Notification service cleaned up for logout');
// // //     }

// // //     cleanupListeners() {
// // //         console.log('🧹 Cleaning up Firebase listeners...');

// // //         this.listeners.forEach(unsubscribe => {
// // //             try {
// // //                 if (typeof unsubscribe === 'function') unsubscribe();
// // //             } catch (error) {
// // //                 console.error('❌ Error unsubscribing listener:', error);
// // //             }
// // //         });

// // //         this.listeners = [];
// // //         console.log('✅ Firebase listeners cleaned up');
// // //     }

// // //     fullCleanup() {
// // //         this.cleanupListeners();
// // //         this.isInitialized = false;
// // //         this.currentToken = null;
// // //         this.userId = null;
// // //         console.log('✅ Firebase notification service fully cleaned up');
// // //     }

// // //     cleanup() {
// // //         this.cleanupListeners();
// // //         this.isInitialized = false;
// // //         this.currentToken = null;
// // //         console.log('✅ Firebase notification service fully cleaned up');
// // //     }
// // // }

// // // // Create and export the instance
// // // const firebaseNotifications = new FirebaseNotificationService();

// // // export default firebaseNotifications;
// // // export { firebaseNotifications };
// // // src/services/notificationService.js
// // import messaging from '@react-native-firebase/messaging';
// // import notifee, { AndroidImportance, AndroidColor } from '@notifee/react-native';
// // import { Platform, Alert, AppState, Linking } from 'react-native';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import { BASE_URL } from "../config/constants";

// // class FirebaseNotificationService {
// //     constructor() {
// //         if (FirebaseNotificationService.instance) {
// //             return FirebaseNotificationService.instance;
// //         }

// //         this.isInitialized = false;
// //         this.userId = null;
// //         this.currentToken = null;
// //         this.navigationRef = null;
// //         this.listeners = [];
// //         this.onNotificationListener = null;

// //         FirebaseNotificationService.instance = this;
// //     }

// //     setNavigationRef(ref) {
// //         this.navigationRef = ref;
// //         console.log('🔗 Navigation ref set:', !!ref);
// //     }

// //     setOnNotificationListener(callback) {
// //         this.onNotificationListener = callback;
// //     }

// //     // In notificationService.js, update the initialize method
// // async initialize() {
// //     if (this.isInitialized && this.currentToken) {
// //         console.log('🔥 Firebase already initialized, returning existing token');
// //         return this.currentToken;
// //     }

// //     try {
// //         console.log('🔥 Initializing Firebase FCM...');

// //         // For Android, we don't need to register for remote messages
// //         if (Platform.OS === 'ios') {
// //             await messaging().registerDeviceForRemoteMessages();
// //             console.log('✅ Device registered for remote messages');
// //         }

// //         // Skip permission check for Android as it's handled during install
// //         if (Platform.OS === 'ios') {
// //             const hasPermission = await this.requestPermission();
// //             if (!hasPermission) {
// //                 console.warn('⚠️ Notification permissions not granted');
// //                 return null;
// //             }
// //         }

// //         this.currentToken = await messaging().getToken();
// //         if (!this.currentToken) {
// //             console.warn('⚠️ Could not get FCM token');
// //             return null;
// //         }

// //         console.log('✅ FCM token obtained:', this.currentToken.substring(0, 20) + '...');

// //         await AsyncStorage.setItem('fcm_token', this.currentToken);

// //         if (Platform.OS === 'android') {
// //             await this.createNotificationChannel();
// //         }

// //         this.setupListeners();

// //         this.isInitialized = true;
// //         console.log('✅ Firebase FCM initialized successfully');

// //         return this.currentToken;
// //     } catch (error) {
// //         console.error('❌ Firebase initialization error:', error);
// //         // Don't fail completely for Android
// //         if (Platform.OS === 'android') {
// //             console.log('⚠️ Error on Android, but continuing...');
// //             return null;
// //         }
// //         return null;
// //     }
// // }

// //     async requestPermission() {
// //         try {
// //             if (Platform.OS === 'ios') {
// //                 const authStatus = await messaging().requestPermission({
// //                     sound: true,
// //                     announcement: true,
// //                     alert: true,
// //                     badge: true,
// //                 });

// //                 const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
// //                                authStatus === messaging.AuthorizationStatus.PROVISIONAL;

// //                 if (!enabled) {
// //                     this.showPermissionAlert();
// //                     return false;
// //                 }
// //             } else {
// //                 // Android - just return true as permission is granted during install
// //                 console.log('✅ Android notification permission assumed');
// //                 return true;
// //             }

// //             console.log('✅ Notification permission granted');
// //             return true;
// //         } catch (error) {
// //             console.error('❌ Permission request error:', error);
// //             // For Android, return true anyway
// //             if (Platform.OS === 'android') {
// //                 return true;
// //             }
// //             return false;
// //         }
// //     }

// //     async createNotificationChannel() {
// //         if (Platform.OS !== 'android') return;

// //         try {
// //             await notifee.createChannel({
// //                 id: 'default',
// //                 name: 'Default Channel',
// //                 importance: AndroidImportance.HIGH,
// //                 sound: 'default',
// //                 vibration: true,
// //                 vibrationPattern: [300, 500],
// //                 lightColor: AndroidColor.BLUE,
// //             });

// //             await notifee.createChannel({
// //                 id: 'html_notifications',
// //                 name: 'HTML Notifications',
// //                 importance: AndroidImportance.HIGH,
// //                 sound: 'default',
// //             });

// //             console.log('✅ Android notification channels created');
// //         } catch (error) {
// //             console.error('❌ Error creating channel:', error);
// //         }
// //     }

// //     setupListeners() {
// //         console.log('🎧 Setting up Firebase listeners...');

// //         this.cleanupListeners();

// //         const foregroundListener = messaging().onMessage(async remoteMessage => {
// //             console.log('📱 Foreground FCM message received:', remoteMessage);
// //             await this.displayNotification(remoteMessage);
// //             if (this.onNotificationListener) {
// //                 this.onNotificationListener(remoteMessage);
// //             }
// //         });

// //         const notificationOpenedListener = messaging().onNotificationOpenedApp(remoteMessage => {
// //             console.log('👆 Notification opened from background');
// //             this.handleNotificationTap(remoteMessage);
// //         });

// //         messaging().onTokenRefresh(async (token) => {
// //             console.log('🔄 FCM token refreshed');
// //             this.currentToken = token;
// //             await AsyncStorage.setItem('fcm_token', token);
// //             if (this.userId) {
// //                 await this.updateTokenInBackend(token);
// //             }
// //         });

// //         messaging().setBackgroundMessageHandler(async remoteMessage => {
// //             console.log('📱 Background FCM message received');
// //             await this.displayNotification(remoteMessage);
// //             return Promise.resolve();
// //         });

// //         messaging().getInitialNotification().then(remoteMessage => {
// //             if (remoteMessage) {
// //                 console.log('📱 App opened from quit state via notification');
// //                 setTimeout(() => {
// //                     this.handleNotificationTap(remoteMessage);
// //                 }, 1500);
// //             }
// //         });

// //         this.listeners = [foregroundListener, notificationOpenedListener];
// //         console.log('✅ Firebase listeners setup complete');
// //     }

// //     async displayNotification(remoteMessage) {
// //         try {
// //             const { notification, data } = remoteMessage;
            
// //             const isHtml = data?.is_html === 'true' || data?.title_html || data?.message_html;
            
// //             let title = notification?.title || data?.title || 'School Notification';
// //             let body = notification?.body || data?.body || 'You have a new notification';
            
// //             if (isHtml) {
// //                 title = data?.title || 'School Notification';
// //                 body = data?.body || 'Tap to view HTML content';
// //             }
            
// //             await notifee.displayNotification({
// //                 title: title,
// //                 body: body,
// //                 data: {
// //                     ...data,
// //                     is_html: isHtml ? 'true' : 'false',
// //                     title_html: data?.title_html || data?.title,
// //                     message_html: data?.message_html || data?.message,
// //                     notificationId: data?.notificationId || data?.queueID,
// //                 },
// //                 android: {
// //                     channelId: isHtml ? 'html_notifications' : 'default',
// //                     smallIcon: 'ic_notification',
// //                     color: '#4A90E2',
// //                     pressAction: {
// //                         id: 'default',
// //                     },
// //                 },
// //                 ios: {
// //                     sound: 'default',
// //                     badge: 1,
// //                 },
// //             });

// //             console.log('✅ Notification displayed:', title);
// //             this.fetchNotificationCount();
// //         } catch (error) {
// //             console.error('❌ Error displaying notification:', error);
// //         }
// //     }

// //     handleNotificationTap(remoteMessage) {
// //         const { data } = remoteMessage;
// //         console.log('👆 Notification tapped with data:', data);

// //         if (!this.navigationRef) {
// //             console.warn('⚠️ No navigation reference available');
// //             return;
// //         }

// //         try {
// //             const nav = this.navigationRef;
            
// //             if (nav && typeof nav.navigate === 'function') {
// //                 console.log('Navigating to NotificationDetail...');
                
// //                 nav.navigate('NotificationDetail', {
// //                     notificationId: data?.notificationId || data?.queueID,
// //                     title: data?.title || 'Notification',
// //                     message: data?.message || '',
// //                     isHtml: data?.is_html === 'true',
// //                     titleHtml: data?.title_html,
// //                     messageHtml: data?.message_html,
// //                 });
// //             } else {
// //                 console.error('Navigation ref is not properly set up');
// //             }
// //         } catch (error) {
// //             console.error('❌ Error navigating from notification:', error);
// //         }
// //     }

// //     async fetchNotificationCount() {
// //         try {
// //             const authToken = await AsyncStorage.getItem('token');
// //             const userStr = await AsyncStorage.getItem('user');

// //             if (!authToken || !userStr) return 0;

// //             const user = JSON.parse(userStr);
// //             const response = await fetch(`${BASE_URL}/api/notifications/unread-count/${user.id}`, {
// //                 headers: {
// //                     'Authorization': `Bearer ${authToken}`
// //                 }
// //             });

// //             if (response.ok) {
// //                 const result = await response.json();
// //                 return result.count || 0;
// //             }
// //         } catch (error) {
// //             console.error('❌ Error fetching notification count:', error);
// //         }

// //         return 0;
// //     }

// //     async registerUser(userData) {
// //         if (!userData || !userData.id) {
// //             console.warn('⚠️ No user data provided for registration');
// //             return false;
// //         }

// //         if (this.userId === userData.id) {
// //             console.log('👤 User already registered:', userData.id);
// //             return true;
// //         }

// //         this.userId = userData.id;
// //         console.log('👤 Registering user for notifications:', userData.id);

// //         try {
// //             const token = this.currentToken || await AsyncStorage.getItem('fcm_token');
// //             if (!token) {
// //                 console.warn('⚠️ No FCM token available for registration');
// //                 return false;
// //             }

// //             const success = await this.registerWithBackend(userData.id, token, userData.roleName || 'PARENT');

// //             if (success) {
// //                 console.log('✅ User registered for notifications successfully');
// //                 return true;
// //             } else {
// //                 console.error('❌ User registration failed');
// //                 return false;
// //             }
// //         } catch (error) {
// //             console.error('❌ Error registering user:', error);
// //             return false;
// //         }
// //     }

// //     async registerWithBackend(userId, token, userType) {
// //         try {
// //             const authToken = await AsyncStorage.getItem('token');

// //             const deviceInfo = {
// //                 UserId: userId,
// //                 FCMToken: token,
// //                 UserType: userType,
// //                 Platform: Platform.OS.toUpperCase(),
// //                 DeviceModel: Platform.constants?.Model || 'Unknown',
// //                 AppVersion: '1.0.0',
// //                 OSVersion: Platform.Version?.toString() || 'Unknown',
// //             };

// //             console.log('📤 Registering device with backend:', deviceInfo);

// //             const response = await fetch(`${BASE_URL}/api/pushnotification/register-device-fcm`, {
// //                 method: 'POST',
// //                 headers: {
// //                     'Content-Type': 'application/json',
// //                     ...(authToken && { 'Authorization': `Bearer ${authToken}` })
// //                 },
// //                 body: JSON.stringify(deviceInfo),
// //             });

// //             if (!response.ok) {
// //                 const errorText = await response.text();
// //                 console.error('❌ Backend registration failed:', errorText);
// //                 return false;
// //             }

// //             const result = await response.json();
// //             console.log('📥 Backend response:', result);

// //             if (result.success) {
// //                 await AsyncStorage.setItem('backend_token_registered', 'true');
// //                 return true;
// //             } else {
// //                 console.error('❌ Backend registration failed:', result.message);
// //                 return false;
// //             }
// //         } catch (error) {
// //             console.error('❌ Error registering with backend:', error);
// //             return false;
// //         }
// //     }

// //     async updateTokenInBackend(newToken) {
// //         if (!this.userId || !newToken) return false;

// //         try {
// //             const userStr = await AsyncStorage.getItem('user');
// //             if (!userStr) return false;

// //             const user = JSON.parse(userStr);
// //             return await this.registerWithBackend(user.id, newToken, user.roleName || 'PARENT');
// //         } catch (error) {
// //             console.error('❌ Error updating token in backend:', error);
// //             return false;
// //         }
// //     }

// //     showPermissionAlert() {
// //         Alert.alert(
// //             'Notifications Required',
// //             'This app needs notifications for important updates like attendance alerts, fee reminders, and announcements.',
// //             [
// //                 { text: 'Cancel', style: 'cancel' },
// //                 {
// //                     text: 'Open Settings',
// //                     onPress: () => {
// //                         if (Platform.OS === 'ios') {
// //                             Linking.openURL('app-settings:');
// //                         } else {
// //                             Linking.openSettings();
// //                         }
// //                     }
// //                 }
// //             ]
// //         );
// //     }

// //     async logoutCleanup() {
// //         this.userId = null;
// //         await AsyncStorage.removeItem('backend_token_registered');
// //         console.log('✅ Notification service cleaned up for logout');
// //     }

// //     cleanupListeners() {
// //         console.log('🧹 Cleaning up Firebase listeners...');

// //         this.listeners.forEach(unsubscribe => {
// //             try {
// //                 if (typeof unsubscribe === 'function') unsubscribe();
// //             } catch (error) {
// //                 console.error('❌ Error unsubscribing listener:', error);
// //             }
// //         });

// //         this.listeners = [];
// //         console.log('✅ Firebase listeners cleaned up');
// //     }

// //     fullCleanup() {
// //         this.cleanupListeners();
// //         this.isInitialized = false;
// //         this.currentToken = null;
// //         this.userId = null;
// //         console.log('✅ Firebase notification service fully cleaned up');
// //     }

// //     cleanup() {
// //         this.cleanupListeners();
// //         this.isInitialized = false;
// //         this.currentToken = null;
// //         console.log('✅ Firebase notification service fully cleaned up');
// //     }
// // }

// // const firebaseNotifications = new FirebaseNotificationService();

// // export default firebaseNotifications;
// // export { firebaseNotifications };

// // src/services/notificationService.js
// import messaging from '@react-native-firebase/messaging';
// import notifee, { AndroidImportance, AndroidColor } from '@notifee/react-native';
// import { Platform, Alert, Linking } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { BASE_URL } from "../config/constants";

// class FirebaseNotificationService {
//     constructor() {
//         if (FirebaseNotificationService.instance) {
//             return FirebaseNotificationService.instance;
//         }

//         this.isInitialized = false;
//         this.userId = null;
//         this.currentToken = null;
//         this.navigationRef = null;
//         this.listeners = [];
//         this.onNotificationListener = null;

//         FirebaseNotificationService.instance = this;
//     }

//     setNavigationRef(ref) {
//         this.navigationRef = ref;
//         console.log('🔗 Navigation ref set:', !!ref);
//     }

//     setOnNotificationListener(callback) {
//         this.onNotificationListener = callback;
//     }

//     async initialize() {
//         if (this.isInitialized && this.currentToken) {
//             console.log('🔥 Firebase already initialized, returning existing token');
//             return this.currentToken;
//         }

//         try {
//             console.log('🔥 Initializing Firebase FCM...');

//             if (Platform.OS === 'ios') {
//                 await messaging().registerDeviceForRemoteMessages();
//                 console.log('✅ Device registered for remote messages');
//             }

//             this.currentToken = await messaging().getToken();
//             if (!this.currentToken) {
//                 console.warn('⚠️ Could not get FCM token');
//                 return null;
//             }

//             console.log('✅ FCM token obtained:', this.currentToken.substring(0, 20) + '...');

//             await AsyncStorage.setItem('fcm_token', this.currentToken);

//             if (Platform.OS === 'android') {
//                 await this.createNotificationChannel();
//             }

//             this.setupListeners();

//             this.isInitialized = true;
//             console.log('✅ Firebase FCM initialized successfully');

//             return this.currentToken;
//         } catch (error) {
//             console.error('❌ Firebase initialization error:', error);
//             return null;
//         }
//     }

//     async createNotificationChannel() {
//         if (Platform.OS !== 'android') return;

//         try {
//             await notifee.createChannel({
//                 id: 'default',
//                 name: 'Default Channel',
//                 importance: AndroidImportance.HIGH,
//                 sound: 'default',
//                 vibration: true,
//                 vibrationPattern: [300, 500],
//                 lightColor: AndroidColor.BLUE,
//             });

//             await notifee.createChannel({
//                 id: 'html_notifications',
//                 name: 'HTML Notifications',
//                 importance: AndroidImportance.HIGH,
//                 sound: 'default',
//             });

//             console.log('✅ Android notification channels created');
//         } catch (error) {
//             console.error('❌ Error creating channel:', error);
//         }
//     }

//     setupListeners() {
//         console.log('🎧 Setting up Firebase listeners...');

//         this.cleanupListeners();

//         const foregroundListener = messaging().onMessage(async remoteMessage => {
//             console.log('📱 Foreground FCM message received:', remoteMessage);
//             await this.displayNotification(remoteMessage);
//             if (this.onNotificationListener) {
//                 this.onNotificationListener(remoteMessage);
//             }
//         });

//         const notificationOpenedListener = messaging().onNotificationOpenedApp(remoteMessage => {
//             console.log('👆 Notification opened from background');
//             this.handleNotificationTap(remoteMessage);
//         });

//         messaging().onTokenRefresh(async (token) => {
//             console.log('🔄 FCM token refreshed');
//             this.currentToken = token;
//             await AsyncStorage.setItem('fcm_token', token);
//             if (this.userId) {
//                 await this.updateTokenInBackend(token);
//             }
//         });

//         messaging().setBackgroundMessageHandler(async remoteMessage => {
//             console.log('📱 Background FCM message received');
//             await this.displayNotification(remoteMessage);
//             return Promise.resolve();
//         });

//         messaging().getInitialNotification().then(remoteMessage => {
//             if (remoteMessage) {
//                 console.log('📱 App opened from quit state via notification');
//                 setTimeout(() => {
//                     this.handleNotificationTap(remoteMessage);
//                 }, 1000);
//             }
//         });

//         this.listeners = [foregroundListener, notificationOpenedListener];
//         console.log('✅ Firebase listeners setup complete');
//     }

//     async displayNotification(remoteMessage) {
//         try {
//             const { notification, data } = remoteMessage;
//             console.log('Preparing to display notification with data:', notification, data);
//             const isHtml = data?.is_html === 'true' || data?.title_html || data?.message_html;
            
//             let title = notification?.title || data?.title || 'School Notification';
//             let body = notification?.body || data?.body || 'You have a new notification';
            
//             if (isHtml) {
//                 title = data?.title || 'School Notification';
//                 body = data?.body || 'Tap to view HTML content';
//             }
            
//             await notifee.displayNotification({
//                 title: title,
//                 body: body,
//                 data: {
//                     ...data,
//                     is_html: isHtml ? 'true' : 'false',
//                     title_html: data?.title_html || data?.title,
//                     message_html: data?.message_html || data?.message,
//                     notificationId: data?.notificationId || data?.queueID,
//                 },
//                 android: {
//                     channelId: isHtml ? 'html_notifications' : 'default',
//                     smallIcon: 'ic_notification',
//                     color: '#4A90E2',
//                     pressAction: {
//                         id: 'default',
//                     },
//                 },
//                 ios: {
//                     sound: 'default',
//                     badge: 1,
//                 },
//             });

//             console.log('✅ Notification displayed:', title);
//         } catch (error) {
//             console.error('❌ Error displaying notification:', error);
//         }
//     }

//     handleNotificationTap(remoteMessage) {
//         const { data } = remoteMessage;
//         console.log('👆 Notification tapped with data:', data);

//         const notificationParams = {
//             notificationId: data?.notificationId || data?.queueID,
//             title: data?.title || 'Notification',
//             message: data?.message || '',
//             isHtml: data?.is_html === 'true',
//             titleHtml: data?.title_html,
//             messageHtml: data?.message_html,
//         };

//         // Store in AsyncStorage for when app is ready
//         AsyncStorage.setItem('pending_notification', JSON.stringify(notificationParams))
//             .then(() => {
//                 console.log('📦 Stored pending notification in AsyncStorage');
//             })
//             .catch(err => console.error('Error storing notification:', err));

//         // Try to navigate if navigator is ready
//         if (this.navigationRef && typeof this.navigationRef.navigate === 'function') {
//             console.log('🚀 Navigator ready, navigating now...');
//             this.navigationRef.navigate('NotificationDetail', notificationParams);
//         } else {
//             console.log('⏳ Navigator not ready, notification stored for later');
//         }
//     }

//     async registerUser(userData) {
//         if (!userData || !userData.id) {
//             console.warn('⚠️ No user data provided for registration');
//             return false;
//         }

//         if (this.userId === userData.id) {
//             console.log('👤 User already registered:', userData.id);
//             return true;
//         }

//         this.userId = userData.id;
//         console.log('👤 Registering user for notifications:', userData.id);

//         try {
//             const token = this.currentToken || await AsyncStorage.getItem('fcm_token');
//             if (!token) {
//                 console.warn('⚠️ No FCM token available for registration');
//                 return false;
//             }

//             const success = await this.registerWithBackend(userData.id, token, userData.roleName || 'PARENT');

//             if (success) {
//                 console.log('✅ User registered for notifications successfully');
//                 return true;
//             } else {
//                 console.error('❌ User registration failed');
//                 return false;
//             }
//         } catch (error) {
//             console.error('❌ Error registering user:', error);
//             return false;
//         }
//     }

//     async registerWithBackend(userId, token, userType) {
//         try {
//             const authToken = await AsyncStorage.getItem('token');

//             const deviceInfo = {
//                 UserId: userId,
//                 FCMToken: token,
//                 UserType: userType,
//                 Platform: Platform.OS.toUpperCase(),
//                 DeviceModel: Platform.constants?.Model || 'Unknown',
//                 AppVersion: '1.0.0',
//                 OSVersion: Platform.Version?.toString() || 'Unknown',
//             };

//             console.log('📤 Registering device with backend:', deviceInfo);

//             const response = await fetch(`${BASE_URL}/api/pushnotification/register-device-fcm`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     ...(authToken && { 'Authorization': `Bearer ${authToken}` })
//                 },
//                 body: JSON.stringify(deviceInfo),
//             });

//             if (!response.ok) {
//                 const errorText = await response.text();
//                 console.error('❌ Backend registration failed:', errorText);
//                 return false;
//             }

//             const result = await response.json();
//             console.log('📥 Backend response:', result);

//             if (result.success) {
//                 await AsyncStorage.setItem('backend_token_registered', 'true');
//                 return true;
//             } else {
//                 console.error('❌ Backend registration failed:', result.message);
//                 return false;
//             }
//         } catch (error) {
//             console.error('❌ Error registering with backend:', error);
//             return false;
//         }
//     }

//     async updateTokenInBackend(newToken) {
//         if (!this.userId || !newToken) return false;

//         try {
//             const userStr = await AsyncStorage.getItem('user');
//             if (!userStr) return false;

//             const user = JSON.parse(userStr);
//             return await this.registerWithBackend(user.id, newToken, user.roleName || 'PARENT');
//         } catch (error) {
//             console.error('❌ Error updating token in backend:', error);
//             return false;
//         }
//     }

//     cleanupListeners() {
//         console.log('🧹 Cleaning up Firebase listeners...');

//         this.listeners.forEach(unsubscribe => {
//             try {
//                 if (typeof unsubscribe === 'function') unsubscribe();
//             } catch (error) {
//                 console.error('❌ Error unsubscribing listener:', error);
//             }
//         });

//         this.listeners = [];
//         console.log('✅ Firebase listeners cleaned up');
//     }

//     cleanup() {
//         this.cleanupListeners();
//         this.isInitialized = false;
//         this.currentToken = null;
//         console.log('✅ Firebase notification service fully cleaned up');
//     }
// }

// const firebaseNotifications = new FirebaseNotificationService();

// export default firebaseNotifications;
// export { firebaseNotifications };
// src/services/notificationService.js
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, AndroidColor } from '@notifee/react-native';
import { Platform, Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from "../config/constants";

class FirebaseNotificationService {
    constructor() {
        if (FirebaseNotificationService.instance) {
            return FirebaseNotificationService.instance;
        }

        this.isInitialized = false;
        this.userId = null;
        this.currentToken = null;
        this.navigationRef = null;
        this.listeners = [];
        this.onNotificationListener = null;

        FirebaseNotificationService.instance = this;
    }

    setNavigationRef(ref) {
        this.navigationRef = ref;
        console.log('🔗 Navigation ref set:', !!ref);
    }

    setOnNotificationListener(callback) {
        this.onNotificationListener = callback;
    }

    async initialize() {
        if (this.isInitialized && this.currentToken) {
            console.log('🔥 Firebase already initialized, returning existing token');
            return this.currentToken;
        }

        try {
            console.log('🔥 Initializing Firebase FCM...');

            if (Platform.OS === 'ios') {
                await messaging().registerDeviceForRemoteMessages();
                console.log('✅ Device registered for remote messages');
            }

            this.currentToken = await messaging().getToken();
            if (!this.currentToken) {
                console.warn('⚠️ Could not get FCM token');
                return null;
            }

            console.log('✅ FCM token obtained:', this.currentToken.substring(0, 20) + '...');

            await AsyncStorage.setItem('fcm_token', this.currentToken);

            if (Platform.OS === 'android') {
                await this.createNotificationChannel();
            }

            this.setupListeners();

            this.isInitialized = true;
            console.log('✅ Firebase FCM initialized successfully');

            return this.currentToken;
        } catch (error) {
            console.error('❌ Firebase initialization error:', error);
            return null;
        }
    }

    async createNotificationChannel() {
        if (Platform.OS !== 'android') return;

        try {
            await notifee.createChannel({
                id: 'default',
                name: 'Default Channel',
                importance: AndroidImportance.HIGH,
                sound: 'default',
                vibration: true,
                vibrationPattern: [300, 500],
                lightColor: AndroidColor.BLUE,
            });

            await notifee.createChannel({
                id: 'html_notifications',
                name: 'HTML Notifications',
                importance: AndroidImportance.HIGH,
                sound: 'default',
            });

            console.log('✅ Android notification channels created');
        } catch (error) {
            console.error('❌ Error creating channel:', error);
        }
    }

    setupListeners() {
        console.log('🎧 Setting up Firebase listeners...');

        this.cleanupListeners();

        // Foreground messages - Fixed to handle HTML notifications properly
        const foregroundListener = messaging().onMessage(async remoteMessage => {
            console.log('📱 Foreground FCM message received:', remoteMessage);
            
            // Show in-app alert for foreground instead of system notification
            await this.showInAppAlert(remoteMessage);
            
            if (this.onNotificationListener) {
                this.onNotificationListener(remoteMessage);
            }
        });

        const notificationOpenedListener = messaging().onNotificationOpenedApp(remoteMessage => {
            console.log('👆 Notification opened from background');
            this.handleNotificationTap(remoteMessage);
        });

        messaging().onTokenRefresh(async (token) => {
            console.log('🔄 FCM token refreshed');
            this.currentToken = token;
            await AsyncStorage.setItem('fcm_token', token);
            if (this.userId) {
                await this.updateTokenInBackend(token);
            }
        });

        messaging().setBackgroundMessageHandler(async remoteMessage => {
            console.log('📱 Background FCM message received');
            await this.displayNotification(remoteMessage);
            return Promise.resolve();
        });

        messaging().getInitialNotification().then(remoteMessage => {
            if (remoteMessage) {
                console.log('📱 App opened from quit state via notification');
                setTimeout(() => {
                    this.handleNotificationTap(remoteMessage);
                }, 1000);
            }
        });

        this.listeners = [foregroundListener, notificationOpenedListener];
        console.log('✅ Firebase listeners setup complete');
    }

    // New method: Show in-app alert for foreground notifications
    async showInAppAlert(remoteMessage) {
        try {
            const { notification, data } = remoteMessage;
            
            const title = notification?.title || data?.title || 'New Notification';
            const body = notification?.body || data?.body || 'You have a new notification';
            const isHtml = data?.is_html === 'true' || data?.title_html || data?.message_html;
            
            Alert.alert(
                title,
                body,
                [
                    { text: 'Dismiss', style: 'cancel' },
                    { 
                        text: 'View', 
                        onPress: () => {
                            if (this.navigationRef && typeof this.navigationRef.navigate === 'function') {
                                this.navigationRef.navigate('NotificationDetail', {
                                    notificationId: data?.notificationId || data?.queueID,
                                    title: data?.title,
                                    message: data?.message,
                                    isHtml: isHtml,
                                    titleHtml: data?.title_html,
                                    messageHtml: data?.message_html,
                                });
                            }
                        }
                    }
                ]
            );
            
            console.log('✅ In-app alert shown for foreground notification');
        } catch (error) {
            console.error('❌ Error showing in-app alert:', error);
        }
    }

    // Display notification for background/quit state
    async displayNotification(remoteMessage) {
        try {
            const { notification, data } = remoteMessage;
            
            // Process all data values to ensure they are strings
            const processedData = {};
            if (data) {
                Object.keys(data).forEach(key => {
                    const value = data[key];
                    if (value !== null && value !== undefined) {
                        // Convert to string to avoid "expected a string value" error
                        processedData[key] = String(value);
                    }
                });
            }
            
            const isHtml = processedData?.is_html === 'true' || processedData?.title_html || processedData?.message_html;
            
            let title = notification?.title || processedData?.title || 'School Notification';
            let body = notification?.body || processedData?.body || 'You have a new notification';
            
            if (isHtml) {
                title = processedData?.title || 'School Notification';
                body = processedData?.body || 'Tap to view HTML content';
            }
            
            // Ensure HTML fields are properly set as strings
            if (processedData?.title_html) {
                processedData.title_html = String(processedData.title_html);
            }
            if (processedData?.message_html) {
                processedData.message_html = String(processedData.message_html);
            }
            if (processedData?.is_html) {
                processedData.is_html = String(processedData.is_html);
            }
            
            await notifee.displayNotification({
                title: title,
                body: body,
                data: processedData,
                android: {
                    channelId: isHtml ? 'html_notifications' : 'default',
                    smallIcon: 'ic_notification',
                    color: '#4A90E2',
                    pressAction: {
                        id: 'default',
                    },
                },
                ios: {
                    sound: 'default',
                    badge: 1,
                },
            });

            console.log('✅ Background notification displayed:', title);
            this.fetchNotificationCount();
        } catch (error) {
            console.error('❌ Error displaying background notification:', error);
            // Fallback: display without custom data
            try {
                await notifee.displayNotification({
                    title: remoteMessage.notification?.title || 'School Notification',
                    body: remoteMessage.notification?.body || 'You have a new notification',
                    android: {
                        channelId: 'default',
                        smallIcon: 'ic_notification',
                    },
                });
            } catch (fallbackError) {
                console.error('❌ Fallback notification also failed:', fallbackError);
            }
        }
    }

    handleNotificationTap(remoteMessage) {
        const { data } = remoteMessage;
        console.log('👆 Notification tapped with data:', data);

        const notificationParams = {
            notificationId: data?.notificationId || data?.queueID,
            title: data?.title || 'Notification',
            message: data?.message || '',
            isHtml: data?.is_html === 'true',
            titleHtml: data?.title_html,
            messageHtml: data?.message_html,
        };

        // Store in AsyncStorage for when app is ready
        AsyncStorage.setItem('pending_notification', JSON.stringify(notificationParams))
            .then(() => {
                console.log('📦 Stored pending notification in AsyncStorage');
            })
            .catch(err => console.error('Error storing notification:', err));

        // Try to navigate if navigator is ready
        if (this.navigationRef && typeof this.navigationRef.navigate === 'function') {
            console.log('🚀 Navigator ready, navigating now...');
            this.navigationRef.navigate('NotificationDetail', notificationParams);
        } else {
            console.log('⏳ Navigator not ready, notification stored for later');
        }
    }

    async fetchNotificationCount() {
        try {
            const authToken = await AsyncStorage.getItem('token');
            const userStr = await AsyncStorage.getItem('user');

            if (!authToken || !userStr) return 0;

            const user = JSON.parse(userStr);
            const response = await fetch(`${BASE_URL}/api/notifications/unread-count/${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                return result.count || 0;
            }
        } catch (error) {
            console.error('❌ Error fetching notification count:', error);
        }

        return 0;
    }

    async registerUser(userData) {
        if (!userData || !userData.id) {
            console.warn('⚠️ No user data provided for registration');
            return false;
        }

        if (this.userId === userData.id) {
            console.log('👤 User already registered:', userData.id);
            return true;
        }

        this.userId = userData.id;
        console.log('👤 Registering user for notifications:', userData.id);

        try {
            const token = this.currentToken || await AsyncStorage.getItem('fcm_token');
            if (!token) {
                console.warn('⚠️ No FCM token available for registration');
                return false;
            }

            const success = await this.registerWithBackend(userData.id, token, userData.roleName || 'PARENT');

            if (success) {
                console.log('✅ User registered for notifications successfully');
                return true;
            } else {
                console.error('❌ User registration failed');
                return false;
            }
        } catch (error) {
            console.error('❌ Error registering user:', error);
            return false;
        }
    }

    async registerWithBackend(userId, token, userType) {
        try {
            const authToken = await AsyncStorage.getItem('token');

            const deviceInfo = {
                UserId: userId,
                FCMToken: token,
                UserType: userType,
                Platform: Platform.OS.toUpperCase(),
                DeviceModel: Platform.constants?.Model || 'Unknown',
                AppVersion: '1.0.0',
                OSVersion: Platform.Version?.toString() || 'Unknown',
            };

            console.log('📤 Registering device with backend:', deviceInfo);

            const response = await fetch(`${BASE_URL}/api/pushnotification/register-device-fcm`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(authToken && { 'Authorization': `Bearer ${authToken}` })
                },
                body: JSON.stringify(deviceInfo),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Backend registration failed:', errorText);
                return false;
            }

            const result = await response.json();
            console.log('📥 Backend response:', result);

            if (result.success) {
                await AsyncStorage.setItem('backend_token_registered', 'true');
                return true;
            } else {
                console.error('❌ Backend registration failed:', result.message);
                return false;
            }
        } catch (error) {
            console.error('❌ Error registering with backend:', error);
            return false;
        }
    }

    async updateTokenInBackend(newToken) {
        if (!this.userId || !newToken) return false;

        try {
            const userStr = await AsyncStorage.getItem('user');
            if (!userStr) return false;

            const user = JSON.parse(userStr);
            return await this.registerWithBackend(user.id, newToken, user.roleName || 'PARENT');
        } catch (error) {
            console.error('❌ Error updating token in backend:', error);
            return false;
        }
    }

    cleanupListeners() {
        console.log('🧹 Cleaning up Firebase listeners...');

        this.listeners.forEach(unsubscribe => {
            try {
                if (typeof unsubscribe === 'function') unsubscribe();
            } catch (error) {
                console.error('❌ Error unsubscribing listener:', error);
            }
        });

        this.listeners = [];
        console.log('✅ Firebase listeners cleaned up');
    }

    cleanup() {
        this.cleanupListeners();
        this.isInitialized = false;
        this.currentToken = null;
        console.log('✅ Firebase notification service fully cleaned up');
    }
}

const firebaseNotifications = new FirebaseNotificationService();

export default firebaseNotifications;
export { firebaseNotifications };