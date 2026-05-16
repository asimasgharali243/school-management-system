// // // src/screens/Parent/DiaryDetailScreen.js
// // import React, { useRef, useState } from 'react';
// // import {
// //     View,
// //     Text,
// //     StyleSheet,
// //     TouchableOpacity,
// //     SafeAreaView,
// //     ScrollView,
// //     ActivityIndicator,
// //     Platform,
// //     Share,
// // } from 'react-native';
// // import { useSelector } from 'react-redux';
// // import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// // import { WebView } from 'react-native-webview';
// // import { selectThemeData } from '../../store/slices/themeSlice';

// // const DiaryDetailScreen = ({ route, navigation }) => {
// //     const theme = useSelector(selectThemeData);
// //     const { entry,childName } = route.params;
// //     const webViewRef = useRef(null);
// //     const [isLoading, setIsLoading] = useState(true);

// //     const formatFullDate = (dateString) => {
// //         const date = new Date(dateString);
// //         return date.toLocaleDateString('en-US', {
// //             weekday: 'long',
// //             year: 'numeric',
// //             month: 'long',
// //             day: 'numeric',
// //         });
// //     };

// //     const getHTML = (content) => {
// //         return `
// //             <!DOCTYPE html>
// //             <html>
// //             <head>
// //                 <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
// //                 <style>
// //                     * {
// //                         margin: 0;
// //                         padding: 0;
// //                         box-sizing: border-box;
// //                     }
// //                     body {
// //                         font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
// //                         font-size: 17px;
// //                         line-height: 1.6;
// //                         color: ${theme.isDarkMode ? '#e0e0e0' : '#2c3e50'};
// //                         padding: 20px;
// //                         background: ${theme.isDarkMode ? '#1a1a2e' : '#ffffff'};
// //                     }
// //                     h1 { 
// //                         font-size: 28px; 
// //                         font-weight: 700; 
// //                         margin: 20px 0 12px 0; 
// //                         color: ${theme.isDarkMode ? '#fff' : '#1a1a2e'}; 
// //                     }
// //                     h2 { 
// //                         font-size: 24px; 
// //                         font-weight: 600; 
// //                         margin: 16px 0 10px 0; 
// //                         color: ${theme.isDarkMode ? '#fff' : '#1a1a2e'}; 
// //                     }
// //                     h3 { 
// //                         font-size: 20px; 
// //                         font-weight: 600; 
// //                         margin: 14px 0 8px 0; 
// //                     }
// //                     p { 
// //                         margin-bottom: 12px; 
// //                         line-height: 1.6;
// //                     }
// //                     strong, b { 
// //                         font-weight: 700; 
// //                         color: ${theme.primary}; 
// //                     }
// //                     em, i { 
// //                         font-style: italic; 
// //                     }
// //                     ul, ol { 
// //                         margin-bottom: 12px; 
// //                         padding-left: 24px; 
// //                     }
// //                     li { 
// //                         margin-bottom: 6px; 
// //                     }
// //                     img { 
// //                         max-width: 100%; 
// //                         height: auto; 
// //                         border-radius: 12px; 
// //                         margin: 16px 0;
// //                     }
// //                     table {
// //                         width: 100%;
// //                         border-collapse: collapse;
// //                         margin-bottom: 12px;
// //                         border-radius: 8px;
// //                         overflow-x: auto;
// //                     }
// //                     th, td {
// //                         border: 1px solid ${theme.isDarkMode ? '#444' : '#e2e8f0'};
// //                         padding: 10px;
// //                         text-align: left;
// //                     }
// //                     th {
// //                         background-color: ${theme.isDarkMode ? '#2d3748' : '#f7fafc'};
// //                         font-weight: 600;
// //                     }
// //                     blockquote {
// //                         margin: 12px 0;
// //                         padding-left: 16px;
// //                         border-left: 4px solid ${theme.primary || '#4CAF50'};
// //                         color: ${theme.isDarkMode ? '#a0aec0' : '#718096'};
// //                         font-style: italic;
// //                     }
// //                     a {
// //                         color: ${theme.primary};
// //                         text-decoration: none;
// //                     }
// //                     pre {
// //                         background-color: ${theme.isDarkMode ? '#2d3748' : '#f7fafc'};
// //                         padding: 12px;
// //                         border-radius: 8px;
// //                         overflow-x: auto;
// //                         margin-bottom: 12px;
// //                     }
// //                     code {
// //                         font-family: monospace;
// //                         font-size: 14px;
// //                     }
// //                     hr {
// //                         margin: 20px 0;
// //                         border: none;
// //                         border-top: 1px solid ${theme.isDarkMode ? '#444' : '#e2e8f0'};
// //                     }
// //                 </style>
// //             </head>
// //             <body>
// //                 ${content || '<p style="color: #a0aec0; text-align: center;">✨ No content available</p>'}
// //             </body>
// //             </html>
// //         `;
// //     };

// //     const handleShare = async () => {
// //         try {
// //             await Share.share({
// //                 title: `Diary Entry - ${entry.subject}`,
// //                 message: `Check out ${entry.teacher}'s diary entry for ${formatFullDate(entry.date)}`,
// //             });
// //         } catch (error) {
// //             console.log('Share error:', error);
// //         }
// //     };

// //     return (
// //         <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
// //             {/* Header */}
// //             <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
               
// //                 <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>
// //                     {childName}'s Diary Entry
// //                 </Text>
                
// //             </View>

// //             {/* Metadata Section */}
// //             <View style={[styles.metadataContainer, { backgroundColor: theme.card }]}>
// //                 <View style={styles.metadataRow}>
// //                     <View style={styles.metadataItem}>
// //                         <Icon name="calendar" size={18} color={theme.primary} />
// //                         <Text style={[styles.metadataText, { color: theme.text }]}>
// //                             {formatFullDate(entry.date)}
// //                         </Text>
// //                     </View>
// //                     <View style={styles.metadataItem}>
// //                         <Icon name="clock-outline" size={18} color={theme.primary} />
// //                         <Text style={[styles.metadataText, { color: theme.text }]}>
// //                             {entry.day}
// //                         </Text>
// //                     </View>
// //                 </View>

// //                 <View style={styles.metadataRow}>
// //                     <View style={styles.metadataItem}>
// //                         <Icon name="book-open-variant" size={18} color={theme.primary} />
// //                         <Text style={[styles.metadataText, { color: theme.text }]}>
// //                             {entry.subject}
// //                         </Text>
// //                     </View>
// //                     <View style={styles.metadataItem}>
// //                         <Icon name="account" size={18} color={theme.primary} />
// //                         <Text style={[styles.metadataText, { color: theme.text }]}>
// //                             {entry.teacher}
// //                         </Text>
// //                     </View>
// //                 </View>

// //                 <View style={styles.statusContainer}>
// //                     <View style={[
// //                         styles.statusBadge,
// //                         { backgroundColor: entry.isPublished ? theme.success + '15' : theme.warning + '15' }
// //                     ]}>
// //                         <View style={[
// //                             styles.statusDot,
// //                             { backgroundColor: entry.isPublished ? theme.success : theme.warning }
// //                         ]} />
// //                         <Text style={[
// //                             styles.statusText,
// //                             { color: entry.isPublished ? theme.success : theme.warning }
// //                         ]}>
// //                             {entry.isPublished ? 'Published' : 'Draft'}
// //                         </Text>
// //                     </View>
// //                 </View>
// //             </View>

// //             {/* Content Section - WebView with natural scrolling */}
// //             <View style={styles.webViewContainer}>
// //                 {isLoading && (
// //                     <View style={styles.loaderContainer}>
// //                         <ActivityIndicator size="large" color={theme.primary} />
// //                         <Text style={[styles.loaderText, { color: theme.textSecondary }]}>
// //                             Loading content...
// //                         </Text>
// //                     </View>
// //                 )}
// //                 <WebView
// //                     ref={webViewRef}
// //                     source={{ html: getHTML(entry.content) }}
// //                     style={[styles.webView, { backgroundColor: theme.background }]}
// //                     onLoadEnd={() => setIsLoading(false)}
// //                     originWhitelist={['*']}
// //                     startInLoadingState={true}
// //                     renderLoading={() => (
// //                         <View style={styles.loaderContainer}>
// //                             <ActivityIndicator size="large" color={theme.primary} />
// //                         </View>
// //                     )}
// //                 />
// //             </View>
// //         </SafeAreaView>
// //     );
// // };

// // const styles = StyleSheet.create({
// //     container: {
// //         flex: 1,
// //     },
// //     header: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         justifyContent: 'space-between',
// //         paddingHorizontal: 16,
// //         paddingVertical: 14,
// //         borderBottomWidth: 1,
// //     },
// //     backButton: {
// //         width: 40,
// //         height: 40,
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //     },
// //     shareButton: {
// //         width: 40,
// //         height: 40,
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //     },
// //     headerTitle: {
// //         fontSize: 18,
// //         fontWeight: '600',
// //         flex: 1,
// //         textAlign: 'center',
// //     },
// //     metadataContainer: {
// //         padding: 16,
// //         borderBottomWidth: 1,
// //         borderBottomColor: 'rgba(0,0,0,0.05)',
// //     },
// //     metadataRow: {
// //         flexDirection: 'row',
// //         justifyContent: 'space-between',
// //         marginBottom: 12,
// //     },
// //     metadataItem: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         gap: 8,
// //     },
// //     metadataText: {
// //         fontSize: 14,
// //     },
// //     statusContainer: {
// //         marginTop: 4,
// //         alignItems: 'flex-start',
// //     },
// //     statusBadge: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         paddingHorizontal: 10,
// //         paddingVertical: 4,
// //         borderRadius: 12,
// //         gap: 6,
// //     },
// //     statusDot: {
// //         width: 6,
// //         height: 6,
// //         borderRadius: 3,
// //     },
// //     statusText: {
// //         fontSize: 11,
// //         fontWeight: '600',
// //     },
// //     webViewContainer: {
// //         flex: 1,
// //         position: 'relative',
// //     },
// //     webView: {
// //         flex: 1,
// //     },
// //     loaderContainer: {
// //         position: 'absolute',
// //         top: 0,
// //         left: 0,
// //         right: 0,
// //         bottom: 0,
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //         zIndex: 10,
// //     },
// //     loaderText: {
// //         marginTop: 12,
// //         fontSize: 14,
// //     },
// // });

// // export default DiaryDetailScreen;


// // src/screens/Parent/DiaryDetailScreen.js
// import React, { useRef, useState } from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     SafeAreaView,
//     ActivityIndicator,
//     Share,
// } from 'react-native';
// import { useSelector } from 'react-redux';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { WebView } from 'react-native-webview';
// import { selectThemeData } from '../../store/slices/themeSlice';

// const DiaryDetailScreen = ({ route }) => {
//     const theme = useSelector(selectThemeData);
//     const { entry, childName } = route.params;

//     const webViewRef = useRef(null);
//     const [isLoading, setIsLoading] = useState(true);

//     const formatFullDate = (dateString) => {
//         const date = new Date(dateString);
//         return date.toLocaleDateString('en-US', {
//             weekday: 'long',
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric',
//         });
//     };

//     const getHTML = (content) => {
//         return `
//             <!DOCTYPE html>
//             <html>
//             <head>
//                 <meta name="viewport" content="width=device-width, initial-scale=1.0">
//                 <style>
//                     * { margin:0; padding:0; box-sizing:border-box; }
//                     body {
//                         font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
//                         font-size: 16px;
//                         line-height: 1.7;
//                         padding: 16px;
//                         color: ${theme.isDarkMode ? '#e0e0e0' : '#2c3e50'};
//                         background: ${theme.isDarkMode ? '#121212' : '#ffffff'};
//                     }
//                     p { margin-bottom: 12px; }
//                     img {
//                         max-width: 100%;
//                         border-radius: 12px;
//                         margin: 12px 0;
//                     }
//                 </style>
//             </head>
//             <body>
//                 ${content || '<p style="text-align:center;color:#aaa">No content available</p>'}
//             </body>
//             </html>
//         `;
//     };

//     return (
//         <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            

//             {/* 🔥 Metadata Card */}
//             <View style={styles.metaWrapper}>
//                 <View style={[styles.metaCard, { backgroundColor: theme.card }]}>

//                     {/* Top Row */}
//                     <View style={styles.metaTop}>
//                         <Text style={[styles.metaDate, { color: theme.text }]}>
//                             {formatFullDate(entry.date)}
//                         </Text>

//                         <View style={[
//                             styles.statusBadge,
//                             { backgroundColor: entry.isPublished ? theme.success + '20' : theme.warning + '20' }
//                         ]}>
//                             <View style={[
//                                 styles.statusDot,
//                                 { backgroundColor: entry.isPublished ? theme.success : theme.warning }
//                             ]}/>
//                             <Text style={[
//                                 styles.statusText,
//                                 { color: entry.isPublished ? theme.success : theme.warning }
//                             ]}>
//                                 {entry.isPublished ? 'Published' : 'Draft'}
//                             </Text>
//                         </View>
//                     </View>

//                     {/* Subject */}
//                     <View style={[styles.subjectBadge, { backgroundColor: theme.primary + '15' }]}>
//                         <Icon name="book-open-variant" size={14} color={theme.primary} />
//                         <Text style={[styles.subjectText, { color: theme.primary }]}>
//                             {entry.subject}
//                         </Text>
//                     </View>

//                     {/* Divider */}
//                     <View style={[styles.divider, { backgroundColor: theme.border }]} />

//                     {/* Teacher */}
//                     <View style={styles.teacherRow}>
//                         <View style={[styles.avatar, { backgroundColor: theme.primary + '20' }]}>
//                             <Icon name="account" size={18} color={theme.primary} />
//                         </View>
//                         <View>
//                             <Text style={[styles.teacherLabel, { color: theme.textSecondary }]}>
//                                 Teacher
//                             </Text>
//                             <Text style={[styles.teacherName, { color: theme.text }]}>
//                                 {entry.teacher}
//                             </Text>
//                         </View>
//                     </View>

//                 </View>
//             </View>

//             {/* 🔥 Content */}
//             <View style={styles.webViewContainer}>
//                 {isLoading && (
//                     <View style={styles.loader}>
//                         <ActivityIndicator size="large" color={theme.primary} />
//                         <Text style={{ color: theme.textSecondary, marginTop: 10 }}>
//                             Loading...
//                         </Text>
//                     </View>
//                 )}

//                 <WebView
//                     ref={webViewRef}
//                     source={{ html: getHTML(entry.content) }}
//                     style={styles.webView}
//                     onLoadEnd={() => setIsLoading(false)}
//                     originWhitelist={['*']}
//                 />
//             </View>
//         </SafeAreaView>
//     );
// };

// export default DiaryDetailScreen;

// const styles = StyleSheet.create({
//     container: { flex: 1 },

//     screenTitle: {
//         fontSize: 18,
//         fontWeight: '600',
//         textAlign: 'center',
//         marginVertical: 12,
//     },

//     metaWrapper: {
//         paddingHorizontal: 16,
//         marginBottom: 10,
//     },

//     metaCard: {
//         borderRadius: 16,
//         padding: 16,
//         elevation: 2,
//         shadowColor: '#000',
//         shadowOpacity: 0.05,
//         shadowRadius: 6,
//     },

//     metaTop: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 10,
//     },

//     metaDate: {
//         fontSize: 15,
//         fontWeight: '600',
//     },

//     subjectBadge: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         alignSelf: 'flex-start',
//         paddingHorizontal: 10,
//         paddingVertical: 4,
//         borderRadius: 12,
//         marginBottom: 12,
//         gap: 6,
//     },

//     subjectText: {
//         fontSize: 12,
//         fontWeight: '600',
//     },

//     divider: {
//         height: 1,
//         marginVertical: 10,
//         opacity: 0.4,
//     },

//     teacherRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 10,
//     },

//     avatar: {
//         width: 36,
//         height: 36,
//         borderRadius: 18,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },

//     teacherLabel: {
//         fontSize: 11,
//     },

//     teacherName: {
//         fontSize: 14,
//         fontWeight: '600',
//     },

//     statusBadge: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingHorizontal: 10,
//         paddingVertical: 4,
//         borderRadius: 12,
//         gap: 6,
//     },

//     statusDot: {
//         width: 6,
//         height: 6,
//         borderRadius: 3,
//     },

//     statusText: {
//         fontSize: 11,
//         fontWeight: '600',
//     },

//     webViewContainer: {
//         flex: 1,
//     },

//     webView: {
//         flex: 1,
//     },

//     loader: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         justifyContent: 'center',
//         alignItems: 'center',
//         zIndex: 10,
//     },
// });


// src/screens/Parent/DiaryDetailScreen.js
import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { WebView } from 'react-native-webview';
import { selectThemeData } from '../../store/slices/themeSlice';

const DiaryDetailScreen = ({ route }) => {
    const theme = useSelector(selectThemeData);
    const { entry } = route.params;

    const webViewRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);

    const formatFullDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getHTML = (content) => {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    * { margin:0; padding:0; box-sizing:border-box; }
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
                        font-size: 16px;
                        line-height: 1.7;
                        padding: 18px;
                        color: ${theme.isDarkMode ? '#e0e0e0' : '#2c3e50'};
                        background: ${theme.isDarkMode ? '#121212' : '#ffffff'};
                    }
                    p { margin-bottom: 14px; }
                    img {
                        max-width: 100%;
                        border-radius: 14px;
                        margin: 14px 0;
                    }
                </style>
            </head>
            <body>
                ${content || '<p style="text-align:center;color:#aaa">No content available</p>'}
            </body>
            </html>
        `;
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>

            {/* 🔥 Metadata Card */}
            <View style={styles.metaWrapper}>
                <View style={[
                    styles.metaCard,
                    {
                        backgroundColor: theme.card,
                        shadowColor: theme.isDarkMode ? '#000' : '#000',
                    }
                ]}>

                    {/* 📅 Date + Status */}
                    <View style={styles.metaTop}>
                        <Text style={[styles.metaDate, { color: theme.text }]}>
                            {formatFullDate(entry.date)}
                        </Text>

                        <View style={[
                            styles.statusBadge,
                            {
                                backgroundColor: entry.isPublished
                                    ? theme.success + '22'
                                    : theme.warning + '22'
                            }
                        ]}>
                            <View style={[
                                styles.statusDot,
                                {
                                    backgroundColor: entry.isPublished
                                        ? theme.success
                                        : theme.warning
                                }
                            ]}/>
                            <Text style={[
                                styles.statusText,
                                {
                                    color: entry.isPublished
                                        ? theme.success
                                        : theme.warning
                                }
                            ]}>
                                {entry.isPublished ? 'Published' : 'Draft'}
                            </Text>
                        </View>
                    </View>

                    {/* 📘 Subject */}
                    <View style={[
                        styles.subjectBadge,
                        { backgroundColor: theme.primary + '20' }
                    ]}>
                        <Icon name="book-open-variant" size={15} color={theme.primary} />
                        <Text style={[styles.subjectText, { color: theme.primary }]}>
                            {entry.subject}
                        </Text>
                    </View>

                    {/* Divider */}
                    <View style={[styles.divider, { backgroundColor: theme.border }]} />

                    {/* 👤 Teacher */}
                    <View style={styles.teacherRow}>
                        <View style={[
                            styles.avatar,
                            { backgroundColor: theme.primary + '25' }
                        ]}>
                            <Icon name="account" size={18} color={theme.primary} />
                        </View>

                        <View>
                            <Text style={[
                                styles.teacherLabel,
                                { color: theme.textSecondary }
                            ]}>
                                Teacher
                            </Text>

                            <Text style={[
                                styles.teacherName,
                                { color: theme.text }
                            ]}>
                                {entry.teacher}
                            </Text>
                        </View>
                    </View>

                </View>
            </View>

            {/* 🌐 WebView Content */}
            <View style={styles.webViewContainer}>
                {isLoading && (
                    <View style={styles.loader}>
                        <ActivityIndicator size="large" color={theme.primary} />
                        <Text style={[
                            styles.loaderText,
                            { color: theme.textSecondary }
                        ]}>
                            Loading content...
                        </Text>
                    </View>
                )}

                <WebView
                    ref={webViewRef}
                    source={{ html: getHTML(entry.content) }}
                    style={styles.webView}
                    onLoadEnd={() => setIsLoading(false)}
                    originWhitelist={['*']}
                />
            </View>

        </SafeAreaView>
    );
};

export default DiaryDetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    metaWrapper: {
        paddingHorizontal: 16,
        marginTop: 10,
        marginBottom: 12,
    },

    metaCard: {
        borderRadius: 20,
        padding: 20,

        // Shadow (iOS)
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },

        // Elevation (Android)
        elevation: 4,
    },

    metaTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },

    metaDate: {
        fontSize: 17,
        fontWeight: '700',
        flex: 1,
        paddingRight: 10,
    },

    subjectBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginBottom: 14,
        gap: 6,
    },

    subjectText: {
        fontSize: 13,
        fontWeight: '600',
    },

    divider: {
        height: 1,
        marginVertical: 14,
        opacity: 0.4,
    },

    teacherRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },

    teacherLabel: {
        fontSize: 11,
        marginBottom: 2,
    },

    teacherName: {
        fontSize: 15,
        fontWeight: '600',
    },

    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
        gap: 6,
    },

    statusDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
    },

    statusText: {
        fontSize: 11,
        fontWeight: '600',
    },

    webViewContainer: {
        flex: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
    },

    webView: {
        flex: 1,
    },

    loader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },

    loaderText: {
        marginTop: 12,
        fontSize: 14,
    },
});