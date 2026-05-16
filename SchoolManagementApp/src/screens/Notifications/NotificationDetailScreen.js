// // // src/screens/NotificationDetailScreen.js
// // import React, { useState, useEffect, useRef } from 'react';
// // import {
// //     View,
// //     Text,
// //     StyleSheet,
// //     ScrollView,
// //     TouchableOpacity,
// //     ActivityIndicator,
// //     SafeAreaView,
// //     Platform,
// //     Share,
// // } from 'react-native';
// // import { WebView } from 'react-native-webview';
// // import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// // import { BASE_URL } from '../../config/constants';
// // import AsyncStorage from '@react-native-async-storage/async-storage';

// // const NotificationDetailScreen = ({ route, navigation }) => {
// //     const { 
// //         notificationData, 
// //         notificationId,
// //         title: initialTitle,
// //         message: initialMessage,
// //         isHtml: initialIsHtml,
// //         titleHtml: initialTitleHtml,
// //         messageHtml: initialMessageHtml,
// //     } = route.params || {};

// //     const [notification, setNotification] = useState(null);
// //     const [loading, setLoading] = useState(true);
// //     const [error, setError] = useState(null);
// //     const [webViewLoading, setWebViewLoading] = useState(true);
// //     const [isHtml, setIsHtml] = useState(false);
// //     const [titleHtml, setTitleHtml] = useState('');
// //     const [messageHtml, setMessageHtml] = useState('');
// //     const [titlePlain, setTitlePlain] = useState('');
// //     const [messagePlain, setMessagePlain] = useState('');

// //     // Fetch notification details if only ID was provided
// //     useEffect(() => {
// //         if (notificationId) {
// //             fetchNotificationDetails();
// //         } else if (notificationData) {
// //             // Direct data from push notification
// //             processNotificationData(notificationData);
// //             setLoading(false);
// //         } else {
// //             setError('No notification data available');
// //             setLoading(false);
// //         }
// //     }, [notificationId, notificationData]);

// //     const fetchNotificationDetails = async () => {
// //         try {
// //             const token = await AsyncStorage.getItem('token');
// //             const response = await fetch(`${BASE_URL}/api/notifications/${notificationId}`, {
// //                 headers: {
// //                     'Authorization': `Bearer ${token}`,
// //                 },
// //             });
// // console.log('Fetching notification details from API:', response.data);
// //             if (response.ok) {
// //                 const result = await response.json();
// //                 if (result.success && result.data) {
// //                     processNotificationData(result.data);
// //                 } else {
// //                     setError('Notification not found');
// //                 }
// //             } else {
// //                 setError('Failed to load notification');
// //             }
// //         } catch (error) {
// //             console.error('Error fetching notification:', error);
// //             setError('Network error');
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     const processNotificationData = (data) => {
// //         // Check if content contains HTML
// //         const hasHtml = data.isHtmlContent === true ||
// //             (data.title?.includes('<') && data.title?.includes('>')) ||
// //             (data.message?.includes('<') && data.message?.includes('>'));

// //         setIsHtml(hasHtml);

// //         if (hasHtml) {
// //             setTitleHtml(data.titleHtml || data.title || '');
// //             setMessageHtml(data.messageHtml || data.message || '');
// //             setTitlePlain(data.titlePlain || stripHtml(data.title || ''));
// //             setMessagePlain(data.messagePlain || stripHtml(data.message || ''));
// //         } else {
// //             setTitlePlain(data.title || '');
// //             setMessagePlain(data.message || '');
// //         }
// //     };

// //     const stripHtml = (html) => {
// //         if (!html) return '';
// //         return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
// //     };

// //     const getFullHtmlContent = () => {
// //         return `
// //             <!DOCTYPE html>
// //             <html>
// //             <head>
// //                 <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
// //                 <meta charset="UTF-8">
// //                 <style>
// //                     * {
// //                         margin: 0;
// //                         padding: 0;
// //                         box-sizing: border-box;
// //                     }
// //                     body {
// //                         font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
// //                         padding: 16px;
// //                         background-color: #f5f5f5;
// //                     }
// //                     .container {
// //                         max-width: 100%;
// //                         margin: 0 auto;
// //                     }
// //                     .card {
// //                         background-color: white;
// //                         border-radius: 12px;
// //                         overflow: hidden;
// //                         box-shadow: 0 2px 8px rgba(0,0,0,0.1);
// //                     }
// //                     .header {
// //                         padding: 16px;
// //                         border-bottom: 1px solid #e0e0e0;
// //                         background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
// //                     }
// //                     .header h1 {
// //                         color: white;
// //                         font-size: 20px;
// //                         font-weight: 600;
// //                         margin: 0;
// //                     }
// //                     .content {
// //                         padding: 20px;
// //                         line-height: 1.6;
// //                         color: #333;
// //                     }
// //                     .content h1, .content h2, .content h3 {
// //                         margin-top: 16px;
// //                         margin-bottom: 12px;
// //                         color: #333;
// //                     }
// //                     .content p {
// //                         margin-bottom: 12px;
// //                         line-height: 1.6;
// //                     }
// //                     .content ul, .content ol {
// //                         margin: 12px 0;
// //                         padding-left: 24px;
// //                     }
// //                     .content li {
// //                         margin: 8px 0;
// //                         line-height: 1.5;
// //                     }
// //                     .content strong, .content b {
// //                         font-weight: 600;
// //                         color: #000;
// //                     }
// //                     .content em, .content i {
// //                         font-style: italic;
// //                     }
// //                     .footer {
// //                         padding: 16px;
// //                         background-color: #f8f9fa;
// //                         border-top: 1px solid #e0e0e0;
// //                     }
// //                     .button {
// //                         background-color: #007AFF;
// //                         color: white;
// //                         padding: 12px 20px;
// //                         border: none;
// //                         border-radius: 8px;
// //                         font-size: 16px;
// //                         font-weight: 600;
// //                         text-align: center;
// //                         width: 100%;
// //                         cursor: pointer;
// //                     }
// //                     .button:active {
// //                         background-color: #0056b3;
// //                     }
// //                     @media (prefers-color-scheme: dark) {
// //                         body {
// //                             background-color: #1a1a1a;
// //                         }
// //                         .card {
// //                             background-color: #2c2c2c;
// //                         }
// //                         .content {
// //                             color: #e0e0e0;
// //                         }
// //                         .content h1, .content h2, .content h3 {
// //                             color: #fff;
// //                         }
// //                         .content strong, .content b {
// //                             color: #fff;
// //                         }
// //                         .footer {
// //                             background-color: #252525;
// //                             border-top-color: #3a3a3a;
// //                         }
// //                     }
// //                 </style>
// //             </head>
// //             <body>
// //                 <div class="container">
// //                     <div class="card">
// //                         ${titleHtml ? `
// //                         <div class="header">
// //                             <h1>${titleHtml}</h1>
// //                         </div>
// //                         ` : ''}
// //                         <div class="content">
// //                             ${messageHtml}
// //                         </div>
// //                         <div class="footer">
// //                             <button class="button" onclick="acknowledge()">✓ Acknowledge</button>
// //                         </div>
// //                     </div>
// //                 </div>
// //                 <script>
// //                     function acknowledge() {
// //                         window.ReactNativeWebView.postMessage('acknowledge');
// //                     }
// //                 </script>
// //             </body>
// //             </html>
// //         `;
// //     };

// //     const markAsRead = async () => {
// //         try {
// //             const token = await AsyncStorage.getItem('token');
// //             const userStr = await AsyncStorage.getItem('user');
// //             if (!token || !userStr) return;

// //             const user = JSON.parse(userStr);
// //             const notificationIdToMark = notificationId || notificationData?.queueID;

// //             if (notificationIdToMark) {
// //                 await fetch(`${BASE_URL}/api/notifications/${notificationIdToMark}/read?userId=${user.id}`, {
// //                     method: 'POST',
// //                     headers: {
// //                         'Authorization': `Bearer ${token}`,
// //                         'Content-Type': 'application/json',
// //                     },
// //                 });
// //             }
// //         } catch (error) {
// //             console.error('Error marking as read:', error);
// //         }
// //     };

// //     const handleShare = async () => {
// //         try {
// //             await Share.share({
// //                 title: titlePlain || 'Notification',
// //                 message: messagePlain,
// //             });
// //         } catch (error) {
// //             console.error('Error sharing:', error);
// //         }
// //     };

// //     const handleWebViewMessage = (event) => {
// //         if (event.nativeEvent.data === 'acknowledge') {
// //             markAsRead();
// //             navigation.goBack();
// //         }
// //     };

// //     useEffect(() => {
// //         markAsRead();
// //     }, []);

// //     if (loading) {
// //         return (
// //             <View style={styles.centered}>
// //                 <ActivityIndicator size="large" color="#4A90E2" />
// //                 <Text style={styles.loadingText}>Loading notification...</Text>
// //             </View>
// //         );
// //     }

// //     if (error) {
// //         return (
// //             <View style={styles.centered}>
// //                 <Icon name="alert-circle-outline" size={48} color="#F44336" />
// //                 <Text style={styles.errorText}>{error}</Text>
// //                 <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
// //                     <Text style={styles.backButtonText}>Go Back</Text>
// //                 </TouchableOpacity>
// //             </View>
// //         );
// //     }

// //     return (
// //         <SafeAreaView style={styles.container}>
// //             <View style={styles.header}>
// //                 <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonHeader}>
// //                     <Icon name="arrow-left" size={24} color="#333" />
// //                 </TouchableOpacity>
// //                 <Text style={styles.headerTitle}>Notification Details</Text>
// //                 <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
// //                     <Icon name="share-variant" size={22} color="#333" />
// //                 </TouchableOpacity>
// //             </View>

// //             {isHtml ? (
// //                 <View style={styles.webviewContainer}>
// //                     {webViewLoading && (
// //                         <View style={styles.webviewLoader}>
// //                             <ActivityIndicator size="large" color="#4A90E2" />
// //                             <Text style={styles.webviewLoaderText}>Loading content...</Text>
// //                         </View>
// //                     )}
// //                     <WebView
// //                         originWhitelist={['*']}
// //                         source={{ html: getFullHtmlContent() }}
// //                         onLoadEnd={() => setWebViewLoading(false)}
// //                         onMessage={handleWebViewMessage}
// //                         style={[styles.webview, webViewLoading && styles.hidden]}
// //                         javaScriptEnabled={true}
// //                         domStorageEnabled={true}
// //                     />
// //                 </View>
// //             ) : (
// //                 <ScrollView style={styles.plainContainer} showsVerticalScrollIndicator={false}>
// //                     <View style={styles.plainCard}>
// //                         <Text style={styles.plainTitle}>{titlePlain}</Text>
// //                         <Text style={styles.plainMessage}>{messagePlain}</Text>
// //                         <View style={styles.divider} />
// //                         <TouchableOpacity style={styles.acknowledgeButton} onPress={() => navigation.goBack()}>
// //                             <Text style={styles.acknowledgeButtonText}>✓ Acknowledge</Text>
// //                         </TouchableOpacity>
// //                     </View>
// //                 </ScrollView>
// //             )}
// //         </SafeAreaView>
// //     );
// // };

// // const styles = StyleSheet.create({
// //     container: {
// //         flex: 1,
// //         backgroundColor: '#F8F9FA',
// //     },
// //     centered: {
// //         flex: 1,
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //         padding: 20,
// //     },
// //     header: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         justifyContent: 'space-between',
// //         paddingHorizontal: 16,
// //         paddingVertical: 12,
// //         backgroundColor: '#FFF',
// //         borderBottomWidth: 1,
// //         borderBottomColor: '#EFEFEF',
// //     },
// //     backButtonHeader: {
// //         padding: 8,
// //     },
// //     headerTitle: {
// //         fontSize: 18,
// //         fontWeight: '600',
// //         color: '#333',
// //     },
// //     shareButton: {
// //         padding: 8,
// //     },
// //     loadingText: {
// //         marginTop: 12,
// //         color: '#666',
// //         fontSize: 14,
// //     },
// //     errorText: {
// //         marginTop: 12,
// //         color: '#F44336',
// //         fontSize: 14,
// //         textAlign: 'center',
// //     },
// //     backButton: {
// //         marginTop: 20,
// //         paddingHorizontal: 20,
// //         paddingVertical: 10,
// //         backgroundColor: '#4A90E2',
// //         borderRadius: 8,
// //     },
// //     backButtonText: {
// //         color: '#FFF',
// //         fontSize: 14,
// //         fontWeight: '500',
// //     },
// //     webviewContainer: {
// //         flex: 1,
// //         position: 'relative',
// //     },
// //     webview: {
// //         flex: 1,
// //         backgroundColor: '#f5f5f5',
// //     },
// //     webviewLoader: {
// //         position: 'absolute',
// //         top: 0,
// //         left: 0,
// //         right: 0,
// //         bottom: 0,
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //         backgroundColor: '#F8F9FA',
// //         zIndex: 1,
// //     },
// //     webviewLoaderText: {
// //         marginTop: 12,
// //         color: '#666',
// //         fontSize: 14,
// //     },
// //     hidden: {
// //         opacity: 0,
// //     },
// //     plainContainer: {
// //         flex: 1,
// //         padding: 16,
// //     },
// //     plainCard: {
// //         backgroundColor: '#FFF',
// //         borderRadius: 12,
// //         padding: 20,
// //         shadowColor: '#000',
// //         shadowOffset: { width: 0, height: 2 },
// //         shadowOpacity: 0.05,
// //         shadowRadius: 4,
// //         elevation: 2,
// //     },
// //     plainTitle: {
// //         fontSize: 20,
// //         fontWeight: '600',
// //         color: '#333',
// //         marginBottom: 12,
// //     },
// //     plainMessage: {
// //         fontSize: 16,
// //         color: '#555',
// //         lineHeight: 24,
// //     },
// //     divider: {
// //         height: 1,
// //         backgroundColor: '#E0E0E0',
// //         marginVertical: 20,
// //     },
// //     acknowledgeButton: {
// //         backgroundColor: '#4A90E2',
// //         paddingVertical: 12,
// //         borderRadius: 8,
// //         alignItems: 'center',
// //     },
// //     acknowledgeButtonText: {
// //         color: '#FFF',
// //         fontSize: 16,
// //         fontWeight: '600',
// //     },
// // });

// // export default NotificationDetailScreen;
// // src/screens/Notifications/NotificationDetailScreen.js
// import React, { useState, useEffect } from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     ScrollView,
//     TouchableOpacity,
//     ActivityIndicator,
//     SafeAreaView,
//     Share,
// } from 'react-native';
// import { WebView } from 'react-native-webview';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { BASE_URL } from '../../config/constants';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const NotificationDetailScreen = ({ route, navigation }) => {
//     const { 
//         notificationData, 
//         notificationId,
//         title: initialTitle,
//         message: initialMessage,
//         isHtml: initialIsHtml,
//         titleHtml: initialTitleHtml,
//         messageHtml: initialMessageHtml,
//     } = route.params || {};

//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [webViewLoading, setWebViewLoading] = useState(true);
//     const [notification, setNotification] = useState(null);

//     useEffect(() => {
//         console.log('NotificationDetailScreen params:', route.params);
        
//         if (notificationId) {
//             fetchNotificationDetails();
//         } else if (notificationData) {
//             processNotificationData(notificationData);
//             setLoading(false);
//         } else {
//             setError('No notification data available');
//             setLoading(false);
//         }
//     }, [notificationId, notificationData]);

//     const fetchNotificationDetails = async () => {
//         try {
//             const token = await AsyncStorage.getItem('token');
//             console.log('Fetching notification from API:', `${BASE_URL}/api/notifications/${notificationId}`);
            
//             const response = await fetch(`${BASE_URL}/api/notifications/${notificationId}`, {
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json',
//                 },
//             });
            
//             console.log('API Response status:', response.status);
            
//             if (response.ok) {
//                 const result = await response.json();
//                 console.log('API Response data:', result);
                
//                 if (result.success && result.data) {
//                     processNotificationData(result.data);
//                 } else {
//                     setError(result.message || 'Notification not found');
//                 }
//             } else {
//                 setError(`Failed to load notification: ${response.status}`);
//             }
//         } catch (error) {
//             console.error('Error fetching notification:', error);
//             setError('Network error: ' + error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const processNotificationData = (data) => {
//         const hasHtml = data.isHtmlContent === true ||
//             (data.title?.includes('<') && data.title?.includes('>')) ||
//             (data.message?.includes('<') && data.message?.includes('>'));

//         setNotification({
//             queueID: data.queueID,
//             title: data.title || '',
//             message: data.message || '',
//             titleHtml: data.titleHtml || data.title || '',
//             messageHtml: data.messageHtml || data.message || '',
//             titlePlain: data.titlePlain || stripHtml(data.title || ''),
//             messagePlain: data.messagePlain || stripHtml(data.message || ''),
//             isHtml: hasHtml,
//             status: data.status,
//             createdTime: data.createdTime,
//         });
//     };

//     const stripHtml = (html) => {
//         if (!html) return '';
//         return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
//     };

//     const getFullHtmlContent = () => {
//         const titleHtmlContent = notification?.titleHtml || '';
//         const messageHtmlContent = notification?.messageHtml || '';
        
//         return `
//             <!DOCTYPE html>
//             <html>
//             <head>
//                 <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
//                 <meta charset="UTF-8">
//                 <style>
//                     * { margin: 0; padding: 0; box-sizing: border-box; }
//                     body {
//                         font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
//                         padding: 16px;
//                         background-color: #f5f5f5;
//                     }
//                     .container { max-width: 100%; margin: 0 auto; }
//                     .card {
//                         background-color: white;
//                         border-radius: 12px;
//                         overflow: hidden;
//                         box-shadow: 0 2px 8px rgba(0,0,0,0.1);
//                     }
//                     .header {
//                         padding: 16px;
//                         border-bottom: 1px solid #e0e0e0;
//                         background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//                     }
//                     .header h1 { color: white; font-size: 20px; font-weight: 600; margin: 0; }
//                     .content { padding: 20px; line-height: 1.6; color: #333; }
//                     .content h1, .content h2, .content h3 { margin-top: 16px; margin-bottom: 12px; color: #333; }
//                     .content p { margin-bottom: 12px; line-height: 1.6; }
//                     .content ul, .content ol { margin: 12px 0; padding-left: 24px; }
//                     .content li { margin: 8px 0; line-height: 1.5; }
//                     .content strong, .content b { font-weight: 600; color: #000; }
//                     .footer { padding: 16px; background-color: #f8f9fa; border-top: 1px solid #e0e0e0; }
//                     .button {
//                         background-color: #007AFF;
//                         color: white;
//                         padding: 12px 20px;
//                         border: none;
//                         border-radius: 8px;
//                         font-size: 16px;
//                         font-weight: 600;
//                         text-align: center;
//                         width: 100%;
//                         cursor: pointer;
//                     }
//                 </style>
//             </head>
//             <body>
//                 <div class="container">
//                     <div class="card">
//                         ${titleHtmlContent ? `
//                         <div class="header">
//                             <h1>${titleHtmlContent.replace(/<[^>]*>/g, '')}</h1>
//                         </div>
//                         ` : ''}
//                         <div class="content">
//                             ${messageHtmlContent}
//                         </div>
//                         <div class="footer">
//                             <button class="button" onclick="acknowledge()">✓ Acknowledge</button>
//                         </div>
//                     </div>
//                 </div>
//                 <script>
//                     function acknowledge() {
//                         window.ReactNativeWebView.postMessage('acknowledge');
//                     }
//                 </script>
//             </body>
//             </html>
//         `;
//     };

//     const markAsRead = async () => {
//         try {
//             const token = await AsyncStorage.getItem('token');
//             const userStr = await AsyncStorage.getItem('user');
//             if (!token || !userStr) return;

//             const user = JSON.parse(userStr);
//             const idToMark = notificationId || notification?.queueID;

//             if (idToMark) {
//                 await fetch(`${BASE_URL}/api/notifications/${idToMark}/read?userId=${user.id}`, {
//                     method: 'POST',
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                         'Content-Type': 'application/json',
//                     },
//                 });
//                 console.log('Notification marked as read:', idToMark);
//             }
//         } catch (error) {
//             console.error('Error marking as read:', error);
//         }
//     };

//     const handleShare = async () => {
//         try {
//             await Share.share({
//                 title: notification?.titlePlain || 'Notification',
//                 message: notification?.messagePlain || '',
//             });
//         } catch (error) {
//             console.error('Error sharing:', error);
//         }
//     };

//     const handleWebViewMessage = (event) => {
//         if (event.nativeEvent.data === 'acknowledge') {
//             markAsRead();
//             navigation.goBack();
//         }
//     };

//     useEffect(() => {
//         markAsRead();
//     }, []);

//     if (loading) {
//         return (
//             <View style={styles.centered}>
//                 <ActivityIndicator size="large" color="#4A90E2" />
//                 <Text style={styles.loadingText}>Loading notification...</Text>
//             </View>
//         );
//     }

//     if (error) {
//         return (
//             <View style={styles.centered}>
//                 <Icon name="alert-circle-outline" size={48} color="#F44336" />
//                 <Text style={styles.errorText}>{error}</Text>
//                 <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//                     <Text style={styles.backButtonText}>Go Back</Text>
//                 </TouchableOpacity>
//             </View>
//         );
//     }

//     const isHtmlContent = notification?.isHtml || false;

//     return (
//         <SafeAreaView style={styles.container}>
//             <View style={styles.header}>
//                 <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonHeader}>
//                     <Icon name="arrow-left" size={24} color="#333" />
//                 </TouchableOpacity>
//                 <Text style={styles.headerTitle}>Notification Details</Text>
//                 <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
//                     <Icon name="share-variant" size={22} color="#333" />
//                 </TouchableOpacity>
//             </View>

//             {isHtmlContent ? (
//                 <View style={styles.webviewContainer}>
//                     {webViewLoading && (
//                         <View style={styles.webviewLoader}>
//                             <ActivityIndicator size="large" color="#4A90E2" />
//                             <Text style={styles.webviewLoaderText}>Loading content...</Text>
//                         </View>
//                     )}
//                     <WebView
//                         originWhitelist={['*']}
//                         source={{ html: getFullHtmlContent() }}
//                         onLoadEnd={() => setWebViewLoading(false)}
//                         onMessage={handleWebViewMessage}
//                         style={[styles.webview, webViewLoading && styles.hidden]}
//                         javaScriptEnabled={true}
//                         domStorageEnabled={true}
//                     />
//                 </View>
//             ) : (
//                 <ScrollView style={styles.plainContainer}>
//                     <View style={styles.plainCard}>
//                         <Text style={styles.plainTitle}>{notification?.titlePlain || notification?.title}</Text>
//                         <Text style={styles.plainMessage}>{notification?.messagePlain || notification?.message}</Text>
//                         <TouchableOpacity style={styles.acknowledgeButton} onPress={() => navigation.goBack()}>
//                             <Text style={styles.acknowledgeButtonText}>✓ Acknowledge</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </ScrollView>
//             )}
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#F8F9FA' },
//     centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
//     header: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//         backgroundColor: '#FFF',
//         borderBottomWidth: 1,
//         borderBottomColor: '#EFEFEF',
//     },
//     backButtonHeader: { padding: 8 },
//     headerTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
//     shareButton: { padding: 8 },
//     loadingText: { marginTop: 12, color: '#666', fontSize: 14 },
//     errorText: { marginTop: 12, color: '#F44336', fontSize: 14, textAlign: 'center' },
//     backButton: { marginTop: 20, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#4A90E2', borderRadius: 8 },
//     backButtonText: { color: '#FFF', fontSize: 14, fontWeight: '500' },
//     webviewContainer: { flex: 1, position: 'relative' },
//     webview: { flex: 1, backgroundColor: '#f5f5f5' },
//     webviewLoader: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#F8F9FA',
//         zIndex: 1,
//     },
//     webviewLoaderText: { marginTop: 12, color: '#666', fontSize: 14 },
//     hidden: { opacity: 0 },
//     plainContainer: { flex: 1, padding: 16 },
//     plainCard: {
//         backgroundColor: '#FFF',
//         borderRadius: 12,
//         padding: 20,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.05,
//         shadowRadius: 4,
//         elevation: 2,
//     },
//     plainTitle: { fontSize: 20, fontWeight: '600', color: '#333', marginBottom: 12 },
//     plainMessage: { fontSize: 16, color: '#555', lineHeight: 24, marginBottom: 20 },
//     acknowledgeButton: { backgroundColor: '#4A90E2', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
//     acknowledgeButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
// });

// export default NotificationDetailScreen;
// src/screens/Notifications/NotificationDetailScreen.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
    Share,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BASE_URL } from '../../config/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationDetailScreen = ({ route, navigation }) => {
    const { 
        notificationId,
        title: initialTitle,
        message: initialMessage,
        isHtml: initialIsHtml,
        titleHtml: initialTitleHtml,
        messageHtml: initialMessageHtml,
    } = route.params || {};

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [webViewLoading, setWebViewLoading] = useState(true);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        console.log('📱 NotificationDetailScreen mounted with params:', route.params);
        
        if (notificationId) {
            fetchNotificationDetails();
        } else if (initialTitle) {
            // Direct data from push notification
            processNotificationData({
                title: initialTitle,
                message: initialMessage,
                titleHtml: initialTitleHtml,
                messageHtml: initialMessageHtml,
                isHtmlContent: initialIsHtml,
            });
            setLoading(false);
        } else {
            setError('No notification data available');
            setLoading(false);
        }
    }, [notificationId]);

    const fetchNotificationDetails = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            console.log('📡 Fetching notification from API:', `${BASE_URL}/api/notifications/${notificationId}`);
            
            const response = await fetch(`${BASE_URL}/api/notifications/${notificationId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            
            console.log('📡 API Response status:', response.status);
            
            if (response.ok) {
                const result = await response.json();
                console.log('📡 API Response data received');
                
                if (result.success && result.data) {
                    processNotificationData(result.data);
                } else {
                    setError(result.message || 'Notification not found');
                }
            } else {
                setError(`Failed to load notification: ${response.status}`);
            }
        } catch (error) {
            console.error('❌ Error fetching notification:', error);
            setError('Network error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const processNotificationData = (data) => {
        const hasHtml = data.isHtmlContent === true ||
            (data.title?.includes('<') && data.title?.includes('>')) ||
            (data.message?.includes('<') && data.message?.includes('>'));

        setNotification({
            queueID: data.queueID,
            title: data.title || '',
            message: data.message || '',
            titleHtml: data.titleHtml || data.title || '',
            messageHtml: data.messageHtml || data.message || '',
            titlePlain: data.titlePlain || stripHtml(data.title || ''),
            messagePlain: data.messagePlain || stripHtml(data.message || ''),
            isHtml: hasHtml,
            status: data.status,
            createdTime: data.createdTime,
        });
    };

    const stripHtml = (html) => {
        if (!html) return '';
        return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
    };

    const getFullHtmlContent = () => {
        const titleHtmlContent = notification?.titleHtml || '';
        const messageHtmlContent = notification?.messageHtml || '';
        
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
                <meta charset="UTF-8">
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                        padding: 16px;
                        background-color: #f5f5f5;
                    }
                    .container { max-width: 100%; margin: 0 auto; }
                    .card {
                        background-color: white;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    }
                    .header {
                        padding: 16px;
                        border-bottom: 1px solid #e0e0e0;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    }
                    .header h1 { color: white; font-size: 20px; font-weight: 600; margin: 0; }
                    .content { padding: 20px; line-height: 1.6; color: #333; }
                    .content h1, .content h2, .content h3 { margin-top: 16px; margin-bottom: 12px; color: #333; }
                    .content p { margin-bottom: 12px; line-height: 1.6; }
                    .content ul, .content ol { margin: 12px 0; padding-left: 24px; }
                    .content li { margin: 8px 0; line-height: 1.5; }
                    .content strong, .content b { font-weight: 600; color: #000; }
                    .footer { padding: 16px; background-color: #f8f9fa; border-top: 1px solid #e0e0e0; }
                    .button {
                        background-color: #007AFF;
                        color: white;
                        padding: 12px 20px;
                        border: none;
                        border-radius: 8px;
                        font-size: 16px;
                        font-weight: 600;
                        text-align: center;
                        width: 100%;
                        cursor: pointer;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="card">
                        ${titleHtmlContent ? `
                        <div class="header">
                            <h1>${titleHtmlContent.replace(/<[^>]*>/g, '')}</h1>
                        </div>
                        ` : ''}
                        <div class="content">
                            ${messageHtmlContent}
                        </div>
                        <div class="footer">
                            <button class="button" onclick="acknowledge()">✓ Acknowledge</button>
                        </div>
                    </div>
                </div>
                <script>
                    function acknowledge() {
                        window.ReactNativeWebView.postMessage('acknowledge');
                    }
                </script>
            </body>
            </html>
        `;
    };

    const markAsRead = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const userStr = await AsyncStorage.getItem('user');
            if (!token || !userStr) return;

            const user = JSON.parse(userStr);
            const idToMark = notificationId || notification?.queueID;

            if (idToMark) {
                await fetch(`${BASE_URL}/api/notifications/${idToMark}/read?userId=${user.id}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                console.log('✅ Notification marked as read:', idToMark);
            }
        } catch (error) {
            console.error('❌ Error marking as read:', error);
        }
    };

    const handleShare = async () => {
        try {
            await Share.share({
                title: notification?.titlePlain || 'Notification',
                message: notification?.messagePlain || '',
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const handleWebViewMessage = (event) => {
        if (event.nativeEvent.data === 'acknowledge') {
            markAsRead();
            navigation.goBack();
        }
    };

    useEffect(() => {
        markAsRead();
        // Clear pending notification after viewing
        AsyncStorage.removeItem('pending_notification');
    }, []);

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#4A90E2" />
                <Text style={styles.loadingText}>Loading notification...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Icon name="alert-circle-outline" size={48} color="#F44336" />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const isHtmlContent = notification?.isHtml || false;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonHeader}>
                    <Icon name="arrow-left" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notification Details</Text>
                <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
                    <Icon name="share-variant" size={22} color="#333" />
                </TouchableOpacity>
            </View>

            {isHtmlContent ? (
                <View style={styles.webviewContainer}>
                    {webViewLoading && (
                        <View style={styles.webviewLoader}>
                            <ActivityIndicator size="large" color="#4A90E2" />
                            <Text style={styles.webviewLoaderText}>Loading content...</Text>
                        </View>
                    )}
                    <WebView
                        originWhitelist={['*']}
                        source={{ html: getFullHtmlContent() }}
                        onLoadEnd={() => setWebViewLoading(false)}
                        onMessage={handleWebViewMessage}
                        style={[styles.webview, webViewLoading && styles.hidden]}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                    />
                </View>
            ) : (
                <ScrollView style={styles.plainContainer}>
                    <View style={styles.plainCard}>
                        <Text style={styles.plainTitle}>{notification?.titlePlain || notification?.title}</Text>
                        <Text style={styles.plainMessage}>{notification?.messagePlain || notification?.message}</Text>
                        <TouchableOpacity style={styles.acknowledgeButton} onPress={() => navigation.goBack()}>
                            <Text style={styles.acknowledgeButtonText}>✓ Acknowledge</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    backButtonHeader: { padding: 8 },
    headerTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
    shareButton: { padding: 8 },
    loadingText: { marginTop: 12, color: '#666', fontSize: 14 },
    errorText: { marginTop: 12, color: '#F44336', fontSize: 14, textAlign: 'center' },
    backButton: { marginTop: 20, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#4A90E2', borderRadius: 8 },
    backButtonText: { color: '#FFF', fontSize: 14, fontWeight: '500' },
    webviewContainer: { flex: 1, position: 'relative' },
    webview: { flex: 1, backgroundColor: '#f5f5f5' },
    webviewLoader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        zIndex: 1,
    },
    webviewLoaderText: { marginTop: 12, color: '#666', fontSize: 14 },
    hidden: { opacity: 0 },
    plainContainer: { flex: 1, padding: 16 },
    plainCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    plainTitle: { fontSize: 20, fontWeight: '600', color: '#333', marginBottom: 12 },
    plainMessage: { fontSize: 16, color: '#555', lineHeight: 24, marginBottom: 20 },
    acknowledgeButton: { backgroundColor: '#4A90E2', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
    acknowledgeButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});

export default NotificationDetailScreen;