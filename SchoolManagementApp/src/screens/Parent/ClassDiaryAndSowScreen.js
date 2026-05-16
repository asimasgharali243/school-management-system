
// // screens/ClassDiaryUnifiedScreen.js
// import React, { useState, useCallback, useMemo, useEffect } from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     ScrollView,
//     TouchableOpacity,
//     ActivityIndicator,
//     RefreshControl,
//     Dimensions,
//     Alert,
//     Share,
//     Platform,
//     Linking
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import AutoHeightWebView from 'react-native-autoheight-webview';
// import { useSelector } from 'react-redux';
// import { selectThemeData } from '../../store/slices/themeSlice';
// import { 
//     useGetClassWorkQuery, 
//     useGetSchemeOfWorkQuery
// } from '../../store/diaryApi';
// import DateTimePicker from '@react-native-community/datetimepicker';

// const { width: screenWidth } = Dimensions.get('window');

// const ClassDiaryUnifiedScreen = ({ route, navigation }) => {
//     const theme = useSelector(selectThemeData);
    
//     // Get child data from route params
//     const { childId, childData } = route.params || {};
//     console.log('Received childData:', childData);
    
//     // Mode state: 'diary' or 'sow'
//     const [mode, setMode] = useState('diary');
    
//     // Student info from childData
//     const [studentInfo, setStudentInfo] = useState({
//         classId: null,
//         sectionId: null,
//         className: '',
//         sectionName: '',
//         campusName: '',
//         studentName: ''
//     });
    
//     // Date state - store as formatted string for API
//     const [selectedDate, setSelectedDate] = useState(new Date());
//     const [showDatePicker, setShowDatePicker] = useState(false);
//     const [selectedMonth, setSelectedMonth] = useState('');
//     const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    
//     const [refreshing, setRefreshing] = useState(false);
    
//     // Months list
//     const months = [
//         'January', 'February', 'March', 'April', 'May', 'June',
//         'July', 'August', 'September', 'October', 'November', 'December'
//     ];
    
//     // Years list
//     const years = useMemo(() => {
//         const currentYear = new Date().getFullYear();
//         return Array.from({ length: 6 }, (_, i) => (currentYear - 2 + i).toString());
//     }, []);
    
//     // Format date for API (MM/dd/yyyy) - SERIALIZABLE
//     const formattedDateForAPI = useMemo(() => {
//         const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
//         const day = selectedDate.getDate().toString().padStart(2, '0');
//         const year = selectedDate.getFullYear();
//         return `${month}/${day}/${year}`;
//     }, [selectedDate]);
    
//     // Format date for display (DD/MM/YYYY)
//     const formattedDateDisplay = useMemo(() => {
//         const day = selectedDate.getDate().toString().padStart(2, '0');
//         const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
//         const year = selectedDate.getFullYear();
//         return `${day}/${month}/${year}`;
//     }, [selectedDate]);
    
//     // Extract student info from childData
//     useEffect(() => {
//         if (childData) {
//             setStudentInfo({
//                 classId: childData.class_ID || childData.classId,
//                 sectionId: childData.section_ID || childData.sectionId,
//                 className: childData.className || childData.Class_Name || 'N/A',
//                 sectionName: childData.sectionName || childData.Section || 'N/A',
//                 campusName: childData.campusName || childData.CampusName || 'N/A',
//                 studentName: childData.name || childData.StudentName || 'Student'
//             });
//         }
//     }, [childData]);
    
//     // Class Work Query - using formatted string date
//     const { 
//         data: classWorkData = [], 
//         isLoading: classWorkLoading,
//         isFetching: classWorkFetching,
//         error: classWorkError,
//         refetch: refetchClassWork
//     } = useGetClassWorkQuery({
//         classId: studentInfo.classId,
//         sectionId: studentInfo.sectionId,
//         lessonDate: formattedDateForAPI, // Pass string, not Date object
//     }, {
//         skip: mode !== 'diary' || !studentInfo.classId || !studentInfo.sectionId,
//     });
//     console.log('Class Work Data:', classWorkData); 
//     // Scheme of Work Query
//     const { 
//         data: sowData = [], 
//         isLoading: sowLoading,
//         isFetching: sowFetching,
//         error: sowError,
//         refetch: refetchSOW
//     } = useGetSchemeOfWorkQuery({
//         classId: studentInfo.classId,
//         sectionId: studentInfo.sectionId,
//         month: selectedMonth,
//         year: parseInt(selectedYear),
//     }, {
//         skip: mode !== 'sow' || !studentInfo.classId || !studentInfo.sectionId || !selectedMonth,
//     });

// //     console.log('SOW Data:', sowData);
// // console.log('sowError',sowError)
//     // Log errors
//     useEffect(() => {
//         if (classWorkError) {
//             console.log('ClassWork Error:', classWorkError);
//         }
//         if (sowError) {
//             console.log('SOW Error:', sowError);
//         }
//     }, [classWorkError, sowError]);
    
//     // Group Class Work data by SubjectID
//     const groupedClassWork = useMemo(() => {
//         if (!classWorkData || !Array.isArray(classWorkData)) return {};
//         return classWorkData.reduce((acc, item) => {
//             const subjectId = item.subjectID || item.SubjectID;
//             if (!acc[subjectId]) {
//                 acc[subjectId] = [];
//             }
//             acc[subjectId].push(item);
//             return acc;
//         }, {});
//     }, [classWorkData]);
    
//     // Group SOW data by SubjectID
//     const groupedSOW = useMemo(() => {
//         if (!sowData || !Array.isArray(sowData)) return {};
//         return sowData.reduce((acc, item) => {
//             const subjectId = item.subjectID || item.SubjectID;
//             if (!acc[subjectId]) {
//                 acc[subjectId] = [];
//             }
//             acc[subjectId].push(item);
//             return acc;
//         }, {});
//     }, [sowData]);
    
//     // Get theme of month for SOW
//     const themeOfMonth = useMemo(() => {
//         const themeItem = sowData.find(item => item.themeOfMonth || item.ThemeOfMonth);
//         return themeItem?.themeOfMonth || themeItem?.ThemeOfMonth || '';
//     }, [sowData]);
    
//     // Get first item for display
//     const firstClassWorkItem = classWorkData?.[0] || {};
//     const firstSOWItem = sowData?.[0] || {};
    
//     const onRefresh = useCallback(async () => {
//         setRefreshing(true);
//         if (mode === 'diary') {
//             await refetchClassWork();
//         } else {
//             await refetchSOW();
//         }
//         setRefreshing(false);
//     }, [mode, refetchClassWork, refetchSOW]);
    
//     const isLoading = mode === 'diary' ? classWorkLoading : sowLoading;
//     const isFetching = mode === 'diary' ? classWorkFetching : sowFetching;
    
//     // Handle date change
//     const onDateChange = (event, selectedDateValue) => {
//         setShowDatePicker(Platform.OS === 'ios');
//         if (selectedDateValue) {
//             setSelectedDate(selectedDateValue);
//         }
//     };
    
//     // Handle Share
//     const handleShare = async () => {
//         try {
//             const shareMessage = mode === 'diary' 
//                 ? `📚 *What I have Learnt Today*\n\n👤 Student: ${studentInfo.studentName}\n🏫 Campus: ${studentInfo.campusName}\n📖 Class: ${studentInfo.className} - ${studentInfo.sectionName}\n📅 Date: ${formattedDateDisplay}\n\nView details in the app.`
//                 : `📋 *Scheme of Work*\n\n👤 Student: ${studentInfo.studentName}\n🏫 Campus: ${studentInfo.campusName}\n📖 Class: ${studentInfo.className} - ${studentInfo.sectionName}\n📆 Month: ${selectedMonth} ${selectedYear}\n🎯 Theme: ${themeOfMonth || 'Not defined'}\n\nView details in the app.`;
            
//             await Share.share({
//                 message: shareMessage,
//                 title: mode === 'diary' ? 'Class Diary' : 'Scheme of Work',
//             });
//         } catch (error) {
//             console.error('Share error:', error);
//         }
//     };
    
//     // Handle PDF
//     const handlePDF = async () => {
//         Alert.alert(
//             'PDF Generation',
//             'PDF download feature will be available soon.\n\nYou can share the content via the share button for now.',
//             [{ text: 'OK' }]
//         );
//     };
    
//     // Render HTML content with auto-height
//     const renderHTMLContent = (htmlContent, key) => {
//         if (!htmlContent || htmlContent === '' || htmlContent === 'null') {
//             return (
//                 <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
//                     —
//                 </Text>
//             );
//         }

//         const htmlWithStyles = `
//             <!DOCTYPE html>
//             <html>
//             <head>
//                 <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
//                 <meta charset="UTF-8">
//                 <style>
//                     * {
//                         font-family: 'Jameel Noori Nastaleeq', 'Traditional Arabic', 'Arial', 'sans-serif';
//                         margin: 0;
//                         padding: 0;
//                         box-sizing: border-box;
//                     }
//                     body {
//                         font-size: 14px;
//                         color: ${theme.text};
//                         line-height: 1.6;
//                         padding: 4px 0;
//                         margin: 0;
//                         background: transparent;
//                     }
//                     table {
//                         width: 100%;
//                         border-collapse: collapse;
//                         margin: 8px 0;
//                     }
//                     th, td {
//                         border: 1px solid #ddd;
//                         padding: 8px;
//                         text-align: left;
//                     }
//                     ul, ol {
//                         padding-left: 20px;
//                         margin: 5px 0;
//                     }
//                     li {
//                         margin: 2px 0;
//                     }
//                     p {
//                         margin: 5px 0;
//                     }
//                     a {
//                         color: #007bff;
//                         text-decoration: none;
//                     }
//                     img {
//                         max-width: 100%;
//                         height: auto;
//                     }
//                 </style>
//             </head>
//             <body>
//                 ${htmlContent}
//             </body>
//             </html>
//         `;

//         return (
//             <AutoHeightWebView
//                 key={key}
//                 source={{ html: htmlWithStyles }}
//                 style={[styles.webView, { width: screenWidth - 80 }]}
//                 scalesPageToFit={false}
//                 viewportContent={'width=device-width, user-scalable=yes'}
//                 scrollEnabled={false}
//                 onShouldStartLoadWithRequest={(request) => {
//                     if (request.url.startsWith('http')) {
//                         Linking.openURL(request.url);
//                         return false;
//                     }
//                     return true;
//                 }}
//             />
//         );
//     };
    
//     // Render Class Work Subject Panel
//     const renderClassWorkPanel = (subjectId, subjectItems) => {
//         const fod = subjectItems[0];
//         const subjectName = fod.subject_Name || fod.SubjectName || 'Unknown';
        
//         const books = subjectItems.map(item => item.book || item.Book).filter(Boolean);
//         const chapters = subjectItems.map(item => item.chapterName || item.ChapterName).filter(Boolean);
//         const topics = subjectItems.map(item => item.topicName || item.TopicName).filter(Boolean);
//         const cwPageNoText = subjectItems.map(item => item.cw_PageNoTextBook).filter(Boolean);
//         const cwPageNoActivity = subjectItems.map(item => item.cw_PageNoActivityBook).filter(Boolean);
//         const cwActivityBook = subjectItems.map(item => item.cw_ActivityBook).filter(Boolean);
//         const cwTextBook = subjectItems.map(item => item.cw_TextBook).filter(Boolean);
//         const cwResources = subjectItems.map(item => item.cw_Resources).filter(Boolean);
//         const hwPageNoText = subjectItems.map(item => item.hw_PageNoTextBook).filter(Boolean);
//         const hwTextBook = subjectItems.map(item => item.hw_TextBook).filter(Boolean);
//         const hwPageNoActivity = subjectItems.map(item => item.hw_PageNoActivityBook).filter(Boolean);
//         const hwActivityBook = subjectItems.map(item => item.hw_ActivityBook).filter(Boolean);
//         const hwCopyWork = subjectItems.map(item => item.hw_CopyWork).filter(Boolean);
//         const hwObservation = subjectItems.map(item => item.hw_Observation).filter(Boolean);
//         const hwExtra = subjectItems.map(item => item.hw_Extra).filter(Boolean);

//         return (
//             <View key={subjectId} style={[styles.panel, { 
//                 backgroundColor: '#f9f9f9',
//                 borderColor: '#ddd'
//             }]}>
//                 <View style={styles.panelTitle}>
//                     <Text style={styles.panelTitleText}>{subjectName}</Text>
//                 </View>
//                 <View style={styles.panelContent}>
//                     <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                         <View>
//                             <View style={styles.tableRow}>
//                                 <View style={styles.tableHeader}><Text style={styles.headerText}>Books</Text></View>
//                                 <View style={styles.tableCell}>
//                                     {books.length > 0 ? books.map((book, idx) => <Text key={idx} style={styles.cellText}>{book}</Text>) : <Text style={styles.emptyText}>—</Text>}
//                                 </View>
//                             </View>
//                             <View style={styles.tableRow}>
//                                 <View style={styles.tableHeader}><Text style={styles.headerText}>Chapter</Text></View>
//                                 <View style={styles.tableCell}>
//                                     {chapters.length > 0 ? chapters.map((chapter, idx) => <Text key={idx} style={styles.cellText}>{chapter}</Text>) : <Text style={styles.emptyText}>—</Text>}
//                                 </View>
//                             </View>
//                             <View style={styles.tableRow}>
//                                 <View style={styles.tableHeader}><Text style={styles.headerText}>Topic</Text></View>
//                                 <View style={styles.tableCell}>
//                                     {topics.length > 0 ? topics.map((topic, idx) => <Text key={idx} style={styles.cellText}>{topic}</Text>) : <Text style={styles.emptyText}>—</Text>}
//                                 </View>
//                             </View>
//                             <View style={styles.tableRow}>
//                                 <View style={styles.tableHeader}><Text style={styles.headerText}>CW Page No</Text></View>
//                                 <View style={styles.tableCell}>
//                                     {cwPageNoText.map((page, idx) => <Text key={`text-${idx}`} style={styles.cellText}>{page}</Text>)}
//                                     {cwPageNoActivity.map((page, idx) => <Text key={`activity-${idx}`} style={styles.cellText}>{page}</Text>)}
//                                     {cwPageNoText.length === 0 && cwPageNoActivity.length === 0 && <Text style={styles.emptyText}>—</Text>}
//                                 </View>
//                             </View>
//                             <View style={styles.tableRow}>
//                                 <View style={styles.tableHeader}><Text style={styles.headerText}>Class Work</Text></View>
//                                 <View style={styles.tableCell}>
//                                     {cwActivityBook.map((content, idx) => <View key={`activity-${idx}`}>{renderHTMLContent(content, `cw-activity-${subjectId}-${idx}`)}</View>)}
//                                     {cwTextBook.map((content, idx) => <View key={`text-${idx}`}>{renderHTMLContent(content, `cw-text-${subjectId}-${idx}`)}</View>)}
//                                     {cwActivityBook.length === 0 && cwTextBook.length === 0 && <Text style={styles.emptyText}>—</Text>}
//                                 </View>
//                             </View>
//                             <View style={styles.tableRow}>
//                                 <View style={styles.tableHeader}><Text style={styles.headerText}>Resources</Text></View>
//                                 <View style={styles.tableCell}>
//                                     {cwResources.map((resource, idx) => <View key={`resource-${idx}`}>{renderHTMLContent(resource, `resource-${subjectId}-${idx}`)}</View>)}
//                                     {cwResources.length === 0 && <Text style={styles.emptyText}>—</Text>}
//                                 </View>
//                             </View>
//                             <View style={styles.tableRow}>
//                                 <View style={styles.tableHeader}><Text style={styles.headerText}>HW Page No</Text></View>
//                                 <View style={styles.tableCell}>
//                                     {hwPageNoText.map((page, idx) => <Text key={idx} style={styles.cellText}>{page}</Text>)}
//                                     {hwPageNoActivity.map((page, idx) => <Text key={`activity-${idx}`} style={styles.cellText}>{page}</Text>)}
//                                     {hwPageNoText.length === 0 && hwPageNoActivity.length === 0 && <Text style={styles.emptyText}>—</Text>}
//                                 </View>
//                             </View>
//                             <View style={styles.tableRow}>
//                                 <View style={styles.tableHeader}><Text style={styles.headerText}>Matter From Text Book</Text></View>
//                                 <View style={styles.tableCell}>
//                                     {hwTextBook.map((content, idx) => <View key={idx}>{renderHTMLContent(content, `hw-text-${subjectId}-${idx}`)}</View>)}
//                                     {hwTextBook.length === 0 && <Text style={styles.emptyText}>—</Text>}
//                                 </View>
//                             </View>
//                             <View style={styles.tableRow}>
//                                 <View style={styles.tableHeader}><Text style={styles.headerText}>Matter From Activity Book</Text></View>
//                                 <View style={styles.tableCell}>
//                                     {hwActivityBook.map((content, idx) => <View key={idx}>{renderHTMLContent(content, `hw-activity-${subjectId}-${idx}`)}</View>)}
//                                     {hwActivityBook.length === 0 && <Text style={styles.emptyText}>—</Text>}
//                                 </View>
//                             </View>
//                             <View style={styles.tableRow}>
//                                 <View style={styles.tableHeader}><Text style={styles.headerText}>Copy Work</Text></View>
//                                 <View style={styles.tableCell}>
//                                     {hwCopyWork.map((content, idx) => <View key={idx}>{renderHTMLContent(content, `copywork-${subjectId}-${idx}`)}</View>)}
//                                     {hwCopyWork.length === 0 && <Text style={styles.emptyText}>—</Text>}
//                                 </View>
//                             </View>
//                             <View style={styles.tableRow}>
//                                 <View style={styles.tableHeader}><Text style={styles.headerText}>Observation</Text></View>
//                                 <View style={styles.tableCell}>
//                                     {hwObservation.map((content, idx) => <View key={idx}>{renderHTMLContent(content, `observation-${subjectId}-${idx}`)}</View>)}
//                                     {hwObservation.length === 0 && <Text style={styles.emptyText}>—</Text>}
//                                 </View>
//                             </View>
//                             <View style={styles.tableRow}>
//                                 <View style={styles.tableHeader}><Text style={styles.headerText}>Extra Links</Text></View>
//                                 <View style={styles.tableCell}>
//                                     {hwExtra.map((content, idx) => <View key={idx}>{renderHTMLContent(content, `extra-${subjectId}-${idx}`)}</View>)}
//                                     {hwExtra.length === 0 && <Text style={styles.emptyText}>—</Text>}
//                                 </View>
//                             </View>
//                         </View>
//                     </ScrollView>
//                 </View>
//             </View>
//         );
//     };
    
//     // Render SOW Subject Panel
//     const renderSOWPanel = (subjectId, subjectItems) => {
//         const fod = subjectItems[0];
//         const subjectName = fod.subject_Name || fod.SubjectName || 'Unknown';
        
//         const uniqueBooks = [...new Map(
//             subjectItems.filter(item => item.book || item.Book)
//                 .map(item => [item.bookID || item.BookID, { name: item.book || item.Book }])
//         ).values()];
        
//         const uniqueChapters = [...new Map(
//             subjectItems.filter(item => item.chapterName || item.ChapterName)
//                 .map(item => [item.chapterID || item.ChapterID, { name: item.chapterName || item.ChapterName }])
//         ).values()];

//         return (
//             <View key={subjectId} style={[styles.panel, { backgroundColor: '#f9f9f9', borderColor: '#ddd' }]}>
//                 <View style={styles.panelTitle}><Text style={styles.panelTitleText}>{subjectName}</Text></View>
//                 <View style={styles.panelContent}>
//                     <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                         <View>
//                             <View style={styles.tableRow}>
//                                 <View style={styles.tableHeader}><Text style={styles.headerText}>Unit No.</Text></View>
//                                 <View style={styles.tableCell}><Text style={styles.cellText}>{fod.unitNo || fod.UnitNo || '—'}</Text></View>
//                             </View>
//                             <View style={styles.tableRow}>
//                                 <View style={styles.tableHeader}><Text style={styles.headerText}>No Of Days</Text></View>
//                                 <View style={styles.tableCell}><Text style={styles.cellText}>{fod.noOfDays || fod.NoOfDays || '—'}</Text></View>
//                             </View>
//                             <View style={styles.tableRow}>
//                                 <View style={styles.tableHeader}><Text style={styles.headerText}>Books</Text></View>
//                                 <View style={styles.tableCell}>
//                                     {uniqueBooks.length > 0 ? uniqueBooks.map((book, idx) => <Text key={idx} style={styles.cellText}>• {book.name}</Text>) : <Text style={styles.emptyText}>—</Text>}
//                                 </View>
//                             </View>
//                             <View style={styles.tableRow}>
//                                 <View style={styles.tableHeader}><Text style={styles.headerText}>Chapter</Text></View>
//                                 <View style={styles.tableCell}>
//                                     {uniqueChapters.length > 0 ? uniqueChapters.map((chapter, idx) => <Text key={idx} style={styles.cellText}>• {chapter.name}</Text>) : <Text style={styles.emptyText}>—</Text>}
//                                 </View>
//                             </View>
//                             <View style={styles.tableRow}>
//                                 <View style={styles.tableHeader}><Text style={styles.headerText}>Page No</Text></View>
//                                 <View style={styles.tableCell}><Text style={styles.cellText}>{fod.pageNo || fod.PageNo || '—'}</Text></View>
//                             </View>
//                             <View style={styles.tableRow}>
//                                 <View style={styles.tableHeader}><Text style={styles.headerText}>Grammar / Composition</Text></View>
//                                 <View style={styles.tableCell}>
//                                     {(fod.grammerComposition || fod.GrammerComposition) ? renderHTMLContent(fod.grammerComposition || fod.GrammerComposition, `grammar-${subjectId}`) : <Text style={styles.emptyText}>—</Text>}
//                                 </View>
//                             </View>
//                             <View style={styles.tableRow}>
//                                 <View style={styles.tableHeader}><Text style={styles.headerText}>Topic Details</Text></View>
//                                 <View style={styles.tableCell}>
//                                     {(fod.topics || fod.Topics) ? renderHTMLContent(fod.topics || fod.Topics, `topics-${subjectId}`) : <Text style={styles.emptyText}>—</Text>}
//                                 </View>
//                             </View>
//                         </View>
//                     </ScrollView>
//                 </View>
//             </View>
//         );
//     };
    
//     // Render Mode-specific filters
//     const renderFilters = () => {
//         return (
//             <View style={[styles.filterSection, { backgroundColor: '#fff' }]}>
//                 {mode === 'diary' ? (
//                     <View style={styles.filterGroup}>
//                         <Text style={styles.filterLabel}>Select Date</Text>
//                         <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
//                             <Icon name="calendar" size={20} color="#28a745" />
//                             <Text style={styles.dateButtonText}>{formattedDateDisplay}</Text>
//                         </TouchableOpacity>
//                     </View>
//                 ) : (
//                     <>
//                         <View style={styles.filterGroup}>
//                             <Text style={styles.filterLabel}>Select Month</Text>
//                             <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsScroll}>
//                                 {months.map((month) => (
//                                     <TouchableOpacity
//                                         key={month}
//                                         style={[styles.optionChip, selectedMonth === month && styles.optionChipActive]}
//                                         onPress={() => setSelectedMonth(month)}
//                                     >
//                                         <Text style={[styles.optionChipText, selectedMonth === month && styles.optionChipTextActive]}>
//                                             {month.substring(0, 3)}
//                                         </Text>
//                                     </TouchableOpacity>
//                                 ))}
//                             </ScrollView>
//                         </View>
//                         <View style={styles.filterGroup}>
//                             <Text style={styles.filterLabel}>Select Year</Text>
//                             <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsScroll}>
//                                 {years.map((year) => (
//                                     <TouchableOpacity
//                                         key={year}
//                                         style={[styles.optionChip, selectedYear === year && styles.optionChipActive]}
//                                         onPress={() => setSelectedYear(year)}
//                                     >
//                                         <Text style={[styles.optionChipText, selectedYear === year && styles.optionChipTextActive]}>
//                                             {year}
//                                         </Text>
//                                     </TouchableOpacity>
//                                 ))}
//                             </ScrollView>
//                         </View>
//                     </>
//                 )}
//             </View>
//         );
//     };
    
//     // Render Content Section
//     const renderContent = () => {
//         if (isLoading) {
//             return (
//                 <View style={styles.loadingContainer}>
//                     <ActivityIndicator size="large" color="#28a745" />
//                     <Text style={styles.loadingText}>Loading {mode === 'diary' ? 'class diary' : 'scheme of work'}...</Text>
//                 </View>
//             );
//         }
        
//         if (mode === 'diary') {
//             const hasData = Object.keys(groupedClassWork).length > 0;
//             if (!hasData) {
//                 return (
//                     <View style={styles.emptyState}>
//                         <Icon name="book-open-page-variant" size={60} color="#999" />
//                         <Text style={styles.emptyStateTitle}>No Class Work Found</Text>
//                         <Text style={styles.emptyStateText}>No class work entries found for {formattedDateDisplay}</Text>
//                     </View>
//                 );
//             }
//             return Object.entries(groupedClassWork).map(([subjectId, items]) => renderClassWorkPanel(subjectId, items));
//         } else {
//             const hasData = Object.keys(groupedSOW).length > 0;
//             if (!hasData) {
//                 return (
//                     <View style={styles.emptyState}>
//                         <Icon name="calendar-blank" size={60} color="#999" />
//                         <Text style={styles.emptyStateTitle}>No Scheme of Work Found</Text>
//                         <Text style={styles.emptyStateText}>No scheme of work found for {selectedMonth} {selectedYear}</Text>
//                     </View>
//                 );
//             }
//             return (
//                 <>
//                     <View style={styles.themeSection}>
//                         <Text style={styles.themeLabel}>THEME FOR THE MONTH: {selectedMonth}</Text>
//                         {themeOfMonth ? <Text style={styles.themeText}>{themeOfMonth}</Text> : <Text style={styles.themeTextPlaceholder}>No theme defined for this month</Text>}
//                     </View>
//                     {Object.entries(groupedSOW).map(([subjectId, items]) => renderSOWPanel(subjectId, items))}
//                 </>
//             );
//         }
//     };
    
//     // Render Info Badges (Class and Section in one line)
//     const renderInfoBadges = () => {
//         if (!studentInfo.classId || !studentInfo.sectionId) return null;
        
//         return (
//             <View style={styles.infoBadges}>
//                 <View style={styles.infoBadge}>
//                     <Text style={styles.infoBadgeText}>{studentInfo.campusName}</Text>
//                 </View>
//                 <View style={styles.infoBadge}>
//                     <Text style={styles.infoBadgeText}>{studentInfo.className} - {studentInfo.sectionName}</Text>
//                 </View>
//                 {mode === 'diary' ? (
//                     <View style={styles.infoBadge}>
//                         <Text style={styles.infoBadgeText}>{formattedDateDisplay}</Text>
//                     </View>
//                 ) : (
//                     <View style={styles.infoBadge}>
//                         <Text style={styles.infoBadgeText}>{selectedMonth} {selectedYear}</Text>
//                     </View>
//                 )}
//             </View>
//         );
//     };
    
//     return (
//         <ScrollView
//             style={styles.container}
//             refreshControl={<RefreshControl refreshing={refreshing || isFetching} onRefresh={onRefresh} colors={['#28a745']} tintColor="#28a745" />}
//             showsVerticalScrollIndicator={false}
//         >
//             <View style={styles.headerSection}>
//                 {/* <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//                     <Icon name="arrow-left" size={24} color="#333" />
//                 </TouchableOpacity> */}
//                 {/* <Text style={styles.title}>{mode === 'diary' ? 'What I have Learnt Today' : 'Scheme of Work'}</Text> */}
//                 <View style={styles.headerButtons}>
//                     <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
//                         <Icon name="share-variant" size={20} color="#28a745" />
//                     </TouchableOpacity>
//                     <TouchableOpacity style={styles.iconButton} onPress={handlePDF}>
//                         <Icon name="file-pdf-box" size={20} color="#dc3545" />
//                     </TouchableOpacity>
//                 </View>
//             </View>
            
//             {/* Mode Switch - Radio Buttons */}
//             <View style={styles.modeSwitchContainer}>
//                 <TouchableOpacity style={[styles.modeOption, mode === 'diary' && styles.modeOptionActive]} onPress={() => setMode('diary')}>
//                     <Icon name="book-open-page-variant" size={18} color={mode === 'diary' ? '#fff' : '#666'} />
//                     <Text style={[styles.modeOptionText, mode === 'diary' && styles.modeOptionTextActive]}>Class Diary</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={[styles.modeOption, mode === 'sow' && styles.modeOptionActive]} onPress={() => setMode('sow')}>
//                     <Icon name="calendar-month" size={18} color={mode === 'sow' ? '#fff' : '#666'} />
//                     <Text style={[styles.modeOptionText, mode === 'sow' && styles.modeOptionTextActive]}>Scheme of Work</Text>
//                 </TouchableOpacity>
//             </View>
            
//             {/* Filters */}
//             {renderFilters()}
            
//             {/* Info Badges */}
//             {renderInfoBadges()}
            
//             {/* Content */}
//             {renderContent()}
            
//             {/* Date Picker */}
//             {showDatePicker && (
//                 <DateTimePicker 
//                     value={selectedDate} 
//                     mode="date" 
//                     display={Platform.OS === 'ios' ? 'spinner' : 'default'} 
//                     onChange={onDateChange} 
//                     maximumDate={new Date()} 
//                 />
//             )}
//         </ScrollView>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#f5f5f5' },
//     headerSection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingHorizontal: 15, paddingTop: 15, paddingBottom: 10, backgroundColor: '#fff'      ,float: 'right' },
//     backButton: { padding: 8 },
//     title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', flex: 1, color: '#28a745' },
//     headerButtons: { flexDirection: 'row',justifyContent:'end', gap: 8, float: 'right' },
//     iconButton: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' },
//     modeSwitchContainer: { flexDirection: 'row', marginHorizontal: 15, marginVertical: 10, borderRadius: 30, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', overflow: 'hidden' },
//     modeOption: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, gap: 8, backgroundColor: '#fff' },
//     modeOptionActive: { backgroundColor: '#f5ad4b' },
//     modeOptionText: { fontSize: 14, fontWeight: '600', color: '#666' },
//     modeOptionTextActive: { color: '#fff' },
//     filterSection: { marginHorizontal: 15, marginVertical: 10, padding: 15, borderRadius: 12, backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
//     filterGroup: { marginBottom: 15 },
//     filterLabel: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
//     optionsScroll: { flexDirection: 'row' },
//     optionChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8, backgroundColor: '#f0f0f0', borderWidth: 1, borderColor: '#ddd' },
//     optionChipActive: { backgroundColor: '#f5ad4b', borderColor: '#f5ad4b' },
//     optionChipText: { fontSize: 14, fontWeight: '500', color: '#333' },
//     optionChipTextActive: { color: '#fff' },
//     dateButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', alignSelf: 'flex-start', gap: 8, backgroundColor: '#fff' },
//     dateButtonText: { fontSize: 14, color: '#333' },
//     infoBadges: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingHorizontal: 15, marginBottom: 20, gap: 8 },
//     infoBadge: { backgroundColor: '#28a745', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
//     infoBadgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
//     themeSection: { marginHorizontal: 15, marginBottom: 15, padding: 15, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
//     themeLabel: { fontSize: 14, fontWeight: 'bold', color: '#28a745', marginBottom: 8 },
//     themeText: { fontSize: 14, textAlign: 'center', lineHeight: 20, color: '#333', fontStyle: 'italic' },
//     themeTextPlaceholder: { fontSize: 14, textAlign: 'center', lineHeight: 20, color: '#999', fontStyle: 'italic' },
//     panel: { marginHorizontal: 15, marginBottom: 20, borderRadius: 8, borderWidth: 1, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
//     panelTitle: { padding: 10, alignItems: 'center', backgroundColor: '#f5ad4b' },
//     panelTitleText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
//     panelContent: { padding: 10, backgroundColor: '#f9f9f9' },
//     tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ddd', minHeight: 45 },
//     tableHeader: { width: 140, padding: 8, borderRightWidth: 1, borderRightColor: '#ddd', justifyContent: 'center', backgroundColor: '#f9f9f9' },
//     headerText: { fontSize: 14, fontWeight: '800', color: '#141414' },
//     tableCell: { flex: 1, padding: 8, backgroundColor: '#f9f9f9' },
//     cellText: { fontSize: 14, marginVertical: 2, color: '#141414' },
//     webView: { backgroundColor: 'transparent' },
//     emptyText: { fontSize: 14, fontStyle: 'italic', color: '#999' },
//     loadingContainer: { minHeight: 300, justifyContent: 'center', alignItems: 'center', padding: 40 },
//     loadingText: { marginTop: 20, fontSize: 16, textAlign: 'center', color: '#666' },
//     emptyState: { marginHorizontal: 15, marginBottom: 20, padding: 40, borderRadius: 15, backgroundColor: '#fff', alignItems: 'center' },
//     emptyStateTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 15, marginBottom: 8, color: '#333' },
//     emptyStateText: { fontSize: 14, textAlign: 'center', lineHeight: 20, color: '#666' },
// });


// export default ClassDiaryUnifiedScreen;

// screens/ClassDiaryUnifiedScreen.js
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Dimensions,
    Alert,
   
    Platform,
    Linking
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AutoHeightWebView from 'react-native-autoheight-webview';
import { useSelector } from 'react-redux';
import { selectThemeData } from '../../store/slices/themeSlice';
import { 
    useGetClassWorkQuery, 
    useGetSchemeOfWorkQuery
} from '../../store/diaryApi';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
const { width: screenWidth } = Dimensions.get('window');

const ClassDiaryUnifiedScreen = ({ route, navigation }) => {
    const theme = useSelector(selectThemeData);
    
    // Get child data from route params
    const { childId, childData } = route.params || {};
    console.log('Received childData:', childData);
    
    // Mode state: 'diary' or 'sow'
    const [mode, setMode] = useState('diary');
    
    // Student info from childData
    const [studentInfo, setStudentInfo] = useState({
        classId: null,
        sectionId: null,
        className: '',
        sectionName: '',
        campusName: '',
        studentName: ''
    });
    
    // Date state - store as formatted string for API
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    
    // SOW state - default to current month and current year
    const getCurrentMonth = () => {
        const monthsList = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const currentMonthIndex = new Date().getMonth();
        return monthsList[currentMonthIndex];
    };
    
    const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
    const [selectedYear] = useState(new Date().getFullYear().toString()); // Fixed, no setter needed
    
    const [refreshing, setRefreshing] = useState(false);
    const [generatingPDF, setGeneratingPDF] = useState(false);
    
    // Months list
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    // Format date for API (MM/dd/yyyy) - SERIALIZABLE
    const formattedDateForAPI = useMemo(() => {
        const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
        const day = selectedDate.getDate().toString().padStart(2, '0');
        const year = selectedDate.getFullYear();
        return `${month}/${day}/${year}`;
    }, [selectedDate]);
    
    // Format date for display (DD/MM/YYYY)
    const formattedDateDisplay = useMemo(() => {
        const day = selectedDate.getDate().toString().padStart(2, '0');
        const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
        const year = selectedDate.getFullYear();
        return `${day}/${month}/${year}`;
    }, [selectedDate]);
    
    // Extract student info from childData
    useEffect(() => {
        if (childData) {
            setStudentInfo({
                classId: childData.class_ID || childData.classId,
                sectionId: childData.section_ID || childData.sectionId,
                className: childData.className || childData.Class_Name || 'N/A',
                sectionName: childData.sectionName || childData.Section || 'N/A',
                campusName: childData.campusName || childData.CampusName || 'N/A',
                studentName: childData.name || childData.StudentName || 'Student'
            });
        }
    }, [childData]);
    
    // Class Work Query - using formatted string date
    const { 
        data: classWorkData = [], 
        isLoading: classWorkLoading,
        isFetching: classWorkFetching,
        error: classWorkError,
        refetch: refetchClassWork
    } = useGetClassWorkQuery({
        classId: studentInfo.classId,
        sectionId: studentInfo.sectionId,
        lessonDate: formattedDateForAPI,
    }, {
        skip: mode !== 'diary' || !studentInfo.classId || !studentInfo.sectionId,
    });
    
    // Scheme of Work Query - using current year
    const { 
        data: sowData = [], 
        isLoading: sowLoading,
        isFetching: sowFetching,
        error: sowError,
        refetch: refetchSOW
    } = useGetSchemeOfWorkQuery({
        classId: studentInfo.classId,
        sectionId: studentInfo.sectionId,
        month: selectedMonth,
        year: parseInt(selectedYear),
    }, {
        skip: mode !== 'sow' || !studentInfo.classId || !studentInfo.sectionId || !selectedMonth,
    });

    // Log errors
    useEffect(() => {
        if (classWorkError) {
            console.log('ClassWork Error:', classWorkError);
        }
        if (sowError) {
            console.log('SOW Error:', sowError);
        }
    }, [classWorkError, sowError]);
    
    // Group Class Work data by SubjectID
    const groupedClassWork = useMemo(() => {
        if (!classWorkData || !Array.isArray(classWorkData)) return {};
        return classWorkData.reduce((acc, item) => {
            const subjectId = item.subjectID || item.SubjectID;
            if (!acc[subjectId]) {
                acc[subjectId] = [];
            }
            acc[subjectId].push(item);
            return acc;
        }, {});
    }, [classWorkData]);
    
    // Group SOW data by SubjectID
    const groupedSOW = useMemo(() => {
        if (!sowData || !Array.isArray(sowData)) return {};
        return sowData.reduce((acc, item) => {
            const subjectId = item.subjectID || item.SubjectID;
            if (!acc[subjectId]) {
                acc[subjectId] = [];
            }
            acc[subjectId].push(item);
            return acc;
        }, {});
    }, [sowData]);
    
    // Get theme of month for SOW
    const themeOfMonth = useMemo(() => {
        const themeItem = sowData.find(item => item.themeOfMonth || item.ThemeOfMonth);
        return themeItem?.themeOfMonth || themeItem?.ThemeOfMonth || '';
    }, [sowData]);
    
    // Get first item for display
    const firstClassWorkItem = classWorkData?.[0] || {};
    const firstSOWItem = sowData?.[0] || {};
    
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        if (mode === 'diary') {
            await refetchClassWork();
        } else {
            await refetchSOW();
        }
        setRefreshing(false);
    }, [mode, refetchClassWork, refetchSOW]);
    
    const isLoading = mode === 'diary' ? classWorkLoading : sowLoading;
    const isFetching = mode === 'diary' ? classWorkFetching : sowFetching;
    
    // Handle date change
    const onDateChange = (event, selectedDateValue) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDateValue) {
            setSelectedDate(selectedDateValue);
        }
    };
    
    // Generate HTML for PDF
    const generateHTMLForPDF = useCallback(() => {
        if (mode === 'diary') {
            // Class Diary HTML generation
            let subjectsHTML = '';
            Object.entries(groupedClassWork).forEach(([subjectId, items]) => {
                const fod = items[0];
                const subjectName = fod.subject_Name || fod.SubjectName || 'Unknown';
                
                const books = items.map(item => item.book || item.Book).filter(Boolean);
                const chapters = items.map(item => item.chapterName || item.ChapterName).filter(Boolean);
                const topics = items.map(item => item.topicName || item.TopicName).filter(Boolean);
                const cwPageNoText = items.map(item => item.cw_PageNoTextBook).filter(Boolean);
                const cwPageNoActivity = items.map(item => item.cw_PageNoActivityBook).filter(Boolean);
                const cwActivityBook = items.map(item => item.cw_ActivityBook).filter(Boolean);
                const cwTextBook = items.map(item => item.cw_TextBook).filter(Boolean);
                const cwResources = items.map(item => item.cw_Resources).filter(Boolean);
                const hwPageNoText = items.map(item => item.hw_PageNoTextBook).filter(Boolean);
                const hwTextBook = items.map(item => item.hw_TextBook).filter(Boolean);
                const hwPageNoActivity = items.map(item => item.hw_PageNoActivityBook).filter(Boolean);
                const hwActivityBook = items.map(item => item.hw_ActivityBook).filter(Boolean);
                const hwCopyWork = items.map(item => item.hw_CopyWork).filter(Boolean);
                const hwObservation = items.map(item => item.hw_Observation).filter(Boolean);
                const hwExtra = items.map(item => item.hw_Extra).filter(Boolean);
                
                subjectsHTML += `
                    <div class="panel">
                        <div class="panel-title">${subjectName}</div>
                        <div class="panel-content">
                            <table class="table table-bordered">
                                <tbody>
                                    <tr><th>Books</th><td>${books.join('<br/>') || '—'}</td></tr>
                                    <tr><th>Chapter</th><td>${chapters.join('<br/>') || '—'}</td></tr>
                                    <tr><th>Topic</th><td>${topics.join('<br/>') || '—'}</td></tr>
                                    <tr><th>CW Page No</th><td>${[...cwPageNoText, ...cwPageNoActivity].join('<br/>') || '—'}</td></tr>
                                    <tr><th>Class Work</th><td>${[...cwActivityBook, ...cwTextBook].join('') || '—'}</td></tr>
                                    <tr><th>Resources</th><td>${cwResources.join('') || '—'}</td></tr>
                                    <tr><th>HW Page No</th><td>${[...hwPageNoText, ...hwPageNoActivity].join('<br/>') || '—'}</td></tr>
                                    <tr><th>Matter From Text Book</th><td>${hwTextBook.join('') || '—'}</td></tr>
                                    <tr><th>Matter From Activity Book</th><td>${hwActivityBook.join('') || '—'}</td></tr>
                                    <tr><th>Copy Work</th><td>${hwCopyWork.join('') || '—'}</td></tr>
                                    <tr><th>Observation</th><td>${hwObservation.join('') || '—'}</td></tr>
                                    <tr><th>Extra Links</th><td>${hwExtra.join('') || '—'}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;
            });
            
            return `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Class Diary - ${formattedDateDisplay}</title>
                    <style>
                        * {
                            font-family: 'Jameel Noori Nastaleeq', 'Traditional Arabic', 'Arial', 'sans-serif';
                        }
                        body {
                            padding: 20px;
                            background: #fff;
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 30px;
                        }
                        .header h1 {
                            color: #28a745;
                            margin-bottom: 10px;
                        }
                        .badges {
                            display: flex;
                            justify-content: center;
                            gap: 10px;
                            margin-bottom: 20px;
                        }
                        .badge {
                            background: #28a745;
                            color: white;
                            padding: 8px 15px;
                            border-radius: 20px;
                            font-size: 12px;
                        }
                        .panel {
                            background-color: #f9f9f9;
                            border: 1px solid #ddd;
                            border-radius: 8px;
                            margin-bottom: 20px;
                            page-break-inside: avoid;
                        }
                        .panel-title {
                            font-size: 18px;
                            font-weight: bold;
                            text-align: center;
                            padding: 10px;
                            background-color: #f5ad4b;
                            color: #fff;
                            border-radius: 8px 8px 0 0;
                        }
                        .panel-content {
                            padding: 10px;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                        }
                        th, td {
                            border: 1px solid #ddd;
                            padding: 8px;
                            text-align: left;
                            vertical-align: top;
                        }
                        th {
                            font-weight: 800;
                            background-color: #f9f9f9;
                            width: 140px;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 30px;
                            font-size: 12px;
                            color: #999;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Class Diary</h1>
                        <div class="badges">
                            <span class="badge">${studentInfo.campusName}</span>
                            <span class="badge">${studentInfo.className} - ${studentInfo.sectionName}</span>
                            <span class="badge">${formattedDateDisplay}</span>
                        </div>
                    </div>
                    ${subjectsHTML}
                    <div class="footer">
                        Generated on ${new Date().toLocaleString()}
                    </div>
                </body>
                </html>
            `;
        } else {
            // Scheme of Work HTML generation
            let subjectsHTML = '';
            Object.entries(groupedSOW).forEach(([subjectId, items]) => {
                const fod = items[0];
                const subjectName = fod.subject_Name || fod.SubjectName || 'Unknown';
                
                const uniqueBooks = [...new Map(
                    items.filter(item => item.book || item.Book)
                        .map(item => [item.bookID || item.BookID, { name: item.book || item.Book }])
                ).values()];
                
                const uniqueChapters = [...new Map(
                    items.filter(item => item.chapterName || item.ChapterName)
                        .map(item => [item.chapterID || item.ChapterID, { name: item.chapterName || item.ChapterName }])
                ).values()];
                
                subjectsHTML += `
                    <div class="panel">
                        <div class="panel-title">${subjectName}</div>
                        <div class="panel-content">
                            <table class="table table-bordered">
                                <tbody>
                                    <tr><th>Unit No.</th><td>${fod.unitNo || fod.UnitNo || '—'}</td></tr>
                                    <tr><th>No Of Days</th><td>${fod.noOfDays || fod.NoOfDays || '—'}</td></tr>
                                    <tr><th>Books</th><td>${uniqueBooks.map(b => `• ${b.name}`).join('<br/>') || '—'}</td></tr>
                                    <tr><th>Chapter</th><td>${uniqueChapters.map(c => `• ${c.name}`).join('<br/>') || '—'}</td></tr>
                                    <tr><th>Page No</th><td>${fod.pageNo || fod.PageNo || '—'}</td></tr>
                                    <tr><th>Grammar / Composition</th><td>${fod.grammerComposition || fod.GrammerComposition || '—'}</td></tr>
                                    <tr><th>Topic Details</th><td>${fod.topics || fod.Topics || '—'}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;
            });
            
            return `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Scheme of Work - ${selectedMonth} ${selectedYear}</title>
                    <style>
                        * {
                            font-family: 'Jameel Noori Nastaleeq', 'Traditional Arabic', 'Arial', 'sans-serif';
                        }
                        body {
                            padding: 20px;
                            background: #fff;
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 30px;
                        }
                        .header h1 {
                            color: #28a745;
                            margin-bottom: 10px;
                        }
                        .theme {
                            text-align: center;
                            margin-bottom: 20px;
                            font-style: italic;
                            color: #28a745;
                        }
                        .badges {
                            display: flex;
                            justify-content: center;
                            gap: 10px;
                            margin-bottom: 20px;
                        }
                        .badge {
                            background: #28a745;
                            color: white;
                            padding: 8px 15px;
                            border-radius: 20px;
                            font-size: 12px;
                        }
                        .panel {
                            background-color: #f9f9f9;
                            border: 1px solid #ddd;
                            border-radius: 8px;
                            margin-bottom: 20px;
                            page-break-inside: avoid;
                        }
                        .panel-title {
                            font-size: 18px;
                            font-weight: bold;
                            text-align: center;
                            padding: 10px;
                            background-color: #f5ad4b;
                            color: #fff;
                            border-radius: 8px 8px 0 0;
                        }
                        .panel-content {
                            padding: 10px;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                        }
                        th, td {
                            border: 1px solid #ddd;
                            padding: 8px;
                            text-align: left;
                            vertical-align: top;
                        }
                        th {
                            font-weight: 800;
                            background-color: #f9f9f9;
                            width: 140px;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 30px;
                            font-size: 12px;
                            color: #999;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Scheme of Work</h1>
                        <div class="theme">
                            <strong>THEME FOR THE MONTH: ${selectedMonth}</strong><br/>
                            ${themeOfMonth || 'No theme defined for this month'}
                        </div>
                        <div class="badges">
                            <span class="badge">${studentInfo.campusName}</span>
                            <span class="badge">${studentInfo.className} - ${studentInfo.sectionName}</span>
                            <span class="badge">${selectedMonth} ${selectedYear}</span>
                        </div>
                    </div>
                    ${subjectsHTML}
                    <div class="footer">
                        Generated on ${new Date().toLocaleString()}
                    </div>
                </body>
                </html>
            `;
        }
    }, [mode, groupedClassWork, groupedSOW, studentInfo, formattedDateDisplay, selectedMonth, selectedYear, themeOfMonth]);
    
    // Handle PDF Generation
    // const handlePDF = async () => {
    //     try {
    //         setGeneratingPDF(true);
            
    //         const htmlContent = generateHTMLForPDF();
    //         const fileName = mode === 'diary' 
    //             ? `ClassDiary_${studentInfo.className}_${formattedDateDisplay}`
    //             : `SchemeOfWork_${studentInfo.className}_${selectedMonth}_${selectedYear}`;
            
    //         const options = {
    //             html: htmlContent,
    //             fileName: fileName,
    //             directory: 'Documents',
    //             width: 595, // A4 width in points
    //             height: 842, // A4 height in points
    //         };
            
    //         const pdf = await RNHTMLtoPDF.convert(options);
            
    //         if (pdf.filePath) {
    //             Alert.alert(
    //                 'PDF Generated',
    //                 `PDF saved to: ${pdf.filePath}`,
    //                 [
    //                     { text: 'OK' },
    //                     { 
    //                         text: 'Share', 
    //                         onPress: () => {
    //                             Share.share({
    //                                 title: fileName,
    //                                 url: pdf.filePath,
    //                                 message: `Check out the ${mode === 'diary' ? 'Class Diary' : 'Scheme of Work'} for ${studentInfo.className}`
    //                             });
    //                         }
    //                     }
    //                 ]
    //             );
    //         } else {
    //             Alert.alert('Error', 'Failed to generate PDF');
    //         }
    //     } catch (error) {
    //         console.error('PDF generation error:', error);
    //         Alert.alert('Error', 'Failed to generate PDF: ' + error.message);
    //     } finally {
    //         setGeneratingPDF(false);
    //     }
    // };
    
const handlePDF = async () => {
    try {
        setGeneratingPDF(true);
        
        const htmlContent = generateHTMLForPDF();
        
        const sanitizeFileName = (name) => {
            return name.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
        };
        
        const baseFileName = mode === 'diary' 
            ? `ClassDiary_${studentInfo.className}_${formattedDateDisplay}`
            : `SchemeOfWork_${studentInfo.className}_${selectedMonth}_${selectedYear}`;
        
        const fileName = sanitizeFileName(baseFileName);
        const timestamp = Date.now();
        const finalFileName = `${fileName}_${timestamp}`;
        
        const options = {
            html: htmlContent,
            fileName: finalFileName,
            directory: 'Documents',
        };
        
        const pdf = await RNHTMLtoPDF.convert(options);
        
        if (pdf && pdf.filePath) {
            // For Android - use content:// URI
            const fileUrl = Platform.OS === 'android' 
                ? `file://${pdf.filePath}` 
                : pdf.filePath;
            
            const shareOptions = {
                url: fileUrl,
                type: 'application/pdf',
                title: mode === 'diary' ? 'Class Diary' : 'Scheme of Work',
                message: `📚 ${mode === 'diary' ? 'Class Diary' : 'Scheme of Work'}\n\n👤 Student: ${studentInfo.studentName}\n🏫 Campus: ${studentInfo.campusName}\n📖 Class: ${studentInfo.className} - ${studentInfo.sectionName}\n${mode === 'diary' ? `📅 Date: ${formattedDateDisplay}` : `📆 Month: ${selectedMonth} ${selectedYear}`}`,
            };
            
            await Share.open(shareOptions);
        } else {
            Alert.alert('Error', 'Failed to generate PDF');
        }
    } catch (error) {
        if (error.message !== 'User did not share') {
            console.error('PDF generation error:', error);
            Alert.alert('Error', 'Failed to generate PDF: ' + error.message);
        }
    } finally {
        setGeneratingPDF(false);
    }
};
    // Handle Share
    const handleShare = async () => {
        try {
            const shareMessage = mode === 'diary' 
                ? `📚 *What I have Learnt Today*\n\n👤 Student: ${studentInfo.studentName}\n🏫 Campus: ${studentInfo.campusName}\n📖 Class: ${studentInfo.className} - ${studentInfo.sectionName}\n📅 Date: ${formattedDateDisplay}\n\nView details in the app.`
                : `📋 *Scheme of Work*\n\n👤 Student: ${studentInfo.studentName}\n🏫 Campus: ${studentInfo.campusName}\n📖 Class: ${studentInfo.className} - ${studentInfo.sectionName}\n📆 Month: ${selectedMonth} ${selectedYear}\n🎯 Theme: ${themeOfMonth || 'Not defined'}\n\nView details in the app.`;
            
            await Share.share({
                message: shareMessage,
                title: mode === 'diary' ? 'Class Diary' : 'Scheme of Work',
            });
        } catch (error) {
            console.error('Share error:', error);
        }
    };
    
    // Render HTML content with auto-height
    const renderHTMLContent = (htmlContent, key) => {
        if (!htmlContent || htmlContent === '' || htmlContent === 'null') {
            return (
                <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                    —
                </Text>
            );
        }

        const htmlWithStyles = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
                <meta charset="UTF-8">
                <style>
                    * {
                        font-family: 'Jameel Noori Nastaleeq', 'Traditional Arabic', 'Arial', 'sans-serif';
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    body {
                        font-size: 14px;
                        color: ${theme.text};
                        line-height: 1.6;
                        padding: 4px 0;
                        margin: 0;
                        background: transparent;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 8px 0;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                    }
                    ul, ol {
                        padding-left: 20px;
                        margin: 5px 0;
                    }
                    li {
                        margin: 2px 0;
                    }
                    p {
                        margin: 5px 0;
                    }
                    a {
                        color: #007bff;
                        text-decoration: none;
                    }
                    img {
                        max-width: 100%;
                        height: auto;
                    }
                </style>
            </head>
            <body>
                ${htmlContent}
            </body>
            </html>
        `;

        return (
            <AutoHeightWebView
                key={key}
                source={{ html: htmlWithStyles }}
                style={[styles.webView, { width: screenWidth - 80 }]}
                scalesPageToFit={false}
                viewportContent={'width=device-width, user-scalable=yes'}
                scrollEnabled={false}
                onShouldStartLoadWithRequest={(request) => {
                    if (request.url.startsWith('http')) {
                        Linking.openURL(request.url);
                        return false;
                    }
                    return true;
                }}
            />
        );
    };
    
    // Render Class Work Subject Panel
    const renderClassWorkPanel = (subjectId, subjectItems) => {
        const fod = subjectItems[0];
        const subjectName = fod.subject_Name || fod.SubjectName || 'Unknown';
        
        const books = subjectItems.map(item => item.book || item.Book).filter(Boolean);
        const chapters = subjectItems.map(item => item.chapterName || item.ChapterName).filter(Boolean);
        const topics = subjectItems.map(item => item.topicName || item.TopicName).filter(Boolean);
        const cwPageNoText = subjectItems.map(item => item.cw_PageNoTextBook).filter(Boolean);
        const cwPageNoActivity = subjectItems.map(item => item.cw_PageNoActivityBook).filter(Boolean);
        const cwActivityBook = subjectItems.map(item => item.cw_ActivityBook).filter(Boolean);
        const cwTextBook = subjectItems.map(item => item.cw_TextBook).filter(Boolean);
        const cwResources = subjectItems.map(item => item.cw_Resources).filter(Boolean);
        const hwPageNoText = subjectItems.map(item => item.hw_PageNoTextBook).filter(Boolean);
        const hwTextBook = subjectItems.map(item => item.hw_TextBook).filter(Boolean);
        const hwPageNoActivity = subjectItems.map(item => item.hw_PageNoActivityBook).filter(Boolean);
        const hwActivityBook = subjectItems.map(item => item.hw_ActivityBook).filter(Boolean);
        const hwCopyWork = subjectItems.map(item => item.hw_CopyWork).filter(Boolean);
        const hwObservation = subjectItems.map(item => item.hw_Observation).filter(Boolean);
        const hwExtra = subjectItems.map(item => item.hw_Extra).filter(Boolean);

        return (
            <View key={subjectId} style={[styles.panel, { 
                backgroundColor: '#f9f9f9',
                borderColor: '#ddd'
            }]}>
                <View style={styles.panelTitle}>
                    <Text style={styles.panelTitleText}>{subjectName}</Text>
                </View>
                <View style={styles.panelContent}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View>
                            <View style={styles.tableRow}>
                                <View style={styles.tableHeader}><Text style={styles.headerText}>Books</Text></View>
                                <View style={styles.tableCell}>
                                    {books.length > 0 ? books.map((book, idx) => <Text key={idx} style={styles.cellText}>{book}</Text>) : <Text style={styles.emptyText}>—</Text>}
                                </View>
                            </View>
                            <View style={styles.tableRow}>
                                <View style={styles.tableHeader}><Text style={styles.headerText}>Chapter</Text></View>
                                <View style={styles.tableCell}>
                                    {chapters.length > 0 ? chapters.map((chapter, idx) => <Text key={idx} style={styles.cellText}>{chapter}</Text>) : <Text style={styles.emptyText}>—</Text>}
                                </View>
                            </View>
                            <View style={styles.tableRow}>
                                <View style={styles.tableHeader}><Text style={styles.headerText}>Topic</Text></View>
                                <View style={styles.tableCell}>
                                    {topics.length > 0 ? topics.map((topic, idx) => <Text key={idx} style={styles.cellText}>{topic}</Text>) : <Text style={styles.emptyText}>—</Text>}
                                </View>
                            </View>
                            <View style={styles.tableRow}>
                                <View style={styles.tableHeader}><Text style={styles.headerText}>CW Page No</Text></View>
                                <View style={styles.tableCell}>
                                    {cwPageNoText.map((page, idx) => <Text key={`text-${idx}`} style={styles.cellText}>{page}</Text>)}
                                    {cwPageNoActivity.map((page, idx) => <Text key={`activity-${idx}`} style={styles.cellText}>{page}</Text>)}
                                    {cwPageNoText.length === 0 && cwPageNoActivity.length === 0 && <Text style={styles.emptyText}>—</Text>}
                                </View>
                            </View>
                            <View style={styles.tableRow}>
                                <View style={styles.tableHeader}><Text style={styles.headerText}>Class Work</Text></View>
                                <View style={styles.tableCell}>
                                    {cwActivityBook.map((content, idx) => <View key={`activity-${idx}`}>{renderHTMLContent(content, `cw-activity-${subjectId}-${idx}`)}</View>)}
                                    {cwTextBook.map((content, idx) => <View key={`text-${idx}`}>{renderHTMLContent(content, `cw-text-${subjectId}-${idx}`)}</View>)}
                                    {cwActivityBook.length === 0 && cwTextBook.length === 0 && <Text style={styles.emptyText}>—</Text>}
                                </View>
                            </View>
                            <View style={styles.tableRow}>
                                <View style={styles.tableHeader}><Text style={styles.headerText}>Resources</Text></View>
                                <View style={styles.tableCell}>
                                    {cwResources.map((resource, idx) => <View key={`resource-${idx}`}>{renderHTMLContent(resource, `resource-${subjectId}-${idx}`)}</View>)}
                                    {cwResources.length === 0 && <Text style={styles.emptyText}>—</Text>}
                                </View>
                            </View>
                            <View style={styles.tableRow}>
                                <View style={styles.tableHeader}><Text style={styles.headerText}>HW Page No</Text></View>
                                <View style={styles.tableCell}>
                                    {hwPageNoText.map((page, idx) => <Text key={idx} style={styles.cellText}>{page}</Text>)}
                                    {hwPageNoActivity.map((page, idx) => <Text key={`activity-${idx}`} style={styles.cellText}>{page}</Text>)}
                                    {hwPageNoText.length === 0 && hwPageNoActivity.length === 0 && <Text style={styles.emptyText}>—</Text>}
                                </View>
                            </View>
                            <View style={styles.tableRow}>
                                <View style={styles.tableHeader}><Text style={styles.headerText}>Matter From Text Book</Text></View>
                                <View style={styles.tableCell}>
                                    {hwTextBook.map((content, idx) => <View key={idx}>{renderHTMLContent(content, `hw-text-${subjectId}-${idx}`)}</View>)}
                                    {hwTextBook.length === 0 && <Text style={styles.emptyText}>—</Text>}
                                </View>
                            </View>
                            <View style={styles.tableRow}>
                                <View style={styles.tableHeader}><Text style={styles.headerText}>Matter From Activity Book</Text></View>
                                <View style={styles.tableCell}>
                                    {hwActivityBook.map((content, idx) => <View key={idx}>{renderHTMLContent(content, `hw-activity-${subjectId}-${idx}`)}</View>)}
                                    {hwActivityBook.length === 0 && <Text style={styles.emptyText}>—</Text>}
                                </View>
                            </View>
                            <View style={styles.tableRow}>
                                <View style={styles.tableHeader}><Text style={styles.headerText}>Copy Work</Text></View>
                                <View style={styles.tableCell}>
                                    {hwCopyWork.map((content, idx) => <View key={idx}>{renderHTMLContent(content, `copywork-${subjectId}-${idx}`)}</View>)}
                                    {hwCopyWork.length === 0 && <Text style={styles.emptyText}>—</Text>}
                                </View>
                            </View>
                            <View style={styles.tableRow}>
                                <View style={styles.tableHeader}><Text style={styles.headerText}>Observation</Text></View>
                                <View style={styles.tableCell}>
                                    {hwObservation.map((content, idx) => <View key={idx}>{renderHTMLContent(content, `observation-${subjectId}-${idx}`)}</View>)}
                                    {hwObservation.length === 0 && <Text style={styles.emptyText}>—</Text>}
                                </View>
                            </View>
                            <View style={styles.tableRow}>
                                <View style={styles.tableHeader}><Text style={styles.headerText}>Extra Links</Text></View>
                                <View style={styles.tableCell}>
                                    {hwExtra.map((content, idx) => <View key={idx}>{renderHTMLContent(content, `extra-${subjectId}-${idx}`)}</View>)}
                                    {hwExtra.length === 0 && <Text style={styles.emptyText}>—</Text>}
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    };
    
    // Render SOW Subject Panel
    const renderSOWPanel = (subjectId, subjectItems) => {
        const fod = subjectItems[0];
        const subjectName = fod.subject_Name || fod.SubjectName || 'Unknown';
        
        const uniqueBooks = [...new Map(
            subjectItems.filter(item => item.book || item.Book)
                .map(item => [item.bookID || item.BookID, { name: item.book || item.Book }])
        ).values()];
        
        const uniqueChapters = [...new Map(
            subjectItems.filter(item => item.chapterName || item.ChapterName)
                .map(item => [item.chapterID || item.ChapterID, { name: item.chapterName || item.ChapterName }])
        ).values()];

        return (
            <View key={subjectId} style={[styles.panel, { backgroundColor: '#f9f9f9', borderColor: '#ddd' }]}>
                <View style={styles.panelTitle}><Text style={styles.panelTitleText}>{subjectName}</Text></View>
                <View style={styles.panelContent}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View>
                            <View style={styles.tableRow}>
                                <View style={styles.tableHeader}><Text style={styles.headerText}>Unit No.</Text></View>
                                <View style={styles.tableCell}><Text style={styles.cellText}>{fod.unitNo || fod.UnitNo || '—'}</Text></View>
                            </View>
                            <View style={styles.tableRow}>
                                <View style={styles.tableHeader}><Text style={styles.headerText}>No Of Days</Text></View>
                                <View style={styles.tableCell}><Text style={styles.cellText}>{fod.noOfDays || fod.NoOfDays || '—'}</Text></View>
                            </View>
                            <View style={styles.tableRow}>
                                <View style={styles.tableHeader}><Text style={styles.headerText}>Books</Text></View>
                                <View style={styles.tableCell}>
                                    {uniqueBooks.length > 0 ? uniqueBooks.map((book, idx) => <Text key={idx} style={styles.cellText}>• {book.name}</Text>) : <Text style={styles.emptyText}>—</Text>}
                                </View>
                            </View>
                            <View style={styles.tableRow}>
                                <View style={styles.tableHeader}><Text style={styles.headerText}>Chapter</Text></View>
                                <View style={styles.tableCell}>
                                    {uniqueChapters.length > 0 ? uniqueChapters.map((chapter, idx) => <Text key={idx} style={styles.cellText}>• {chapter.name}</Text>) : <Text style={styles.emptyText}>—</Text>}
                                </View>
                            </View>
                            <View style={styles.tableRow}>
                                <View style={styles.tableHeader}><Text style={styles.headerText}>Page No</Text></View>
                                <View style={styles.tableCell}><Text style={styles.cellText}>{fod.pageNo || fod.PageNo || '—'}</Text></View>
                            </View>
                            <View style={styles.tableRow}>
                                <View style={styles.tableHeader}><Text style={styles.headerText}>Grammar / Composition</Text></View>
                                <View style={styles.tableCell}>
                                    {(fod.grammerComposition || fod.GrammerComposition) ? renderHTMLContent(fod.grammerComposition || fod.GrammerComposition, `grammar-${subjectId}`) : <Text style={styles.emptyText}>—</Text>}
                                </View>
                            </View>
                            <View style={styles.tableRow}>
                                <View style={styles.tableHeader}><Text style={styles.headerText}>Topic Details</Text></View>
                                <View style={styles.tableCell}>
                                    {(fod.topics || fod.Topics) ? renderHTMLContent(fod.topics || fod.Topics, `topics-${subjectId}`) : <Text style={styles.emptyText}>—</Text>}
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    };
    
    // Render Mode-specific filters
    const renderFilters = () => {
        return (
            <View style={[styles.filterSection, { backgroundColor: '#fff' }]}>
                {mode === 'diary' ? (
                    <View style={styles.filterGroup}>
                        <Text style={styles.filterLabel}>Select Date</Text>
                        <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                            <Icon name="calendar" size={20} color="#28a745" />
                            <Text style={styles.dateButtonText}>{formattedDateDisplay}</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <View style={styles.filterGroup}>
                            <Text style={styles.filterLabel}>Select Month</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsScroll}>
                                {months.map((month) => (
                                    <TouchableOpacity
                                        key={month}
                                        style={[styles.optionChip, selectedMonth === month && styles.optionChipActive]}
                                        onPress={() => setSelectedMonth(month)}
                                    >
                                        <Text style={[styles.optionChipText, selectedMonth === month && styles.optionChipTextActive]}>
                                            {month.substring(0, 3)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                        {/* Year selection is hidden - default is current year */}
                        {/* <View style={styles.filterGroup}>
                            <Text style={styles.filterLabel}>Select Year</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsScroll}>
                                {years.map((year) => (
                                    <TouchableOpacity
                                        key={year}
                                        style={[styles.optionChip, selectedYear === year && styles.optionChipActive]}
                                        onPress={() => setSelectedYear(year)}
                                    >
                                        <Text style={[styles.optionChipText, selectedYear === year && styles.optionChipTextActive]}>
                                            {year}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View> */}
                    </>
                )}
            </View>
        );
    };
    
    // Render Content Section
    const renderContent = () => {
        if (isLoading || generatingPDF) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#28a745" />
                    <Text style={styles.loadingText}>
                        {generatingPDF ? 'Generating PDF...' : `Loading ${mode === 'diary' ? 'class diary' : 'scheme of work'}...`}
                    </Text>
                </View>
            );
        }
        
        if (mode === 'diary') {
            const hasData = Object.keys(groupedClassWork).length > 0;
            if (!hasData) {
                return (
                    <View style={styles.emptyState}>
                        <Icon name="book-open-page-variant" size={60} color="#999" />
                        <Text style={styles.emptyStateTitle}>No Class Work Found</Text>
                        <Text style={styles.emptyStateText}>No class work entries found for {formattedDateDisplay}</Text>
                    </View>
                );
            }
            return Object.entries(groupedClassWork).map(([subjectId, items]) => renderClassWorkPanel(subjectId, items));
        } else {
            const hasData = Object.keys(groupedSOW).length > 0;
            if (!hasData) {
                return (
                    <View style={styles.emptyState}>
                        <Icon name="calendar-blank" size={60} color="#999" />
                        <Text style={styles.emptyStateTitle}>No Scheme of Work Found</Text>
                        <Text style={styles.emptyStateText}>No scheme of work found for {selectedMonth} {selectedYear}</Text>
                    </View>
                );
            }
            return (
                <>
                    <View style={styles.themeSection}>
                        <Text style={styles.themeLabel}>THEME FOR THE MONTH: {selectedMonth}</Text>
                        {themeOfMonth ? <Text style={styles.themeText}>{themeOfMonth}</Text> : <Text style={styles.themeTextPlaceholder}>No theme defined for this month</Text>}
                    </View>
                    {Object.entries(groupedSOW).map(([subjectId, items]) => renderSOWPanel(subjectId, items))}
                </>
            );
        }
    };
    
    // Render Info Badges (Class and Section in one line)
    const renderInfoBadges = () => {
        if (!studentInfo.classId || !studentInfo.sectionId) return null;
        
        return (
            <View style={styles.infoBadges}>
                <View style={styles.infoBadge}>
                    <Text style={styles.infoBadgeText}>{studentInfo.campusName}</Text>
                </View>
                <View style={styles.infoBadge}>
                    <Text style={styles.infoBadgeText}>{studentInfo.className} - {studentInfo.sectionName}</Text>
                </View>
                {mode === 'diary' ? (
                    <View style={styles.infoBadge}>
                        <Text style={styles.infoBadgeText}>{formattedDateDisplay}</Text>
                    </View>
                ) : (
                    <View style={styles.infoBadge}>
                        <Text style={styles.infoBadgeText}>{selectedMonth} {selectedYear}</Text>
                    </View>
                )}
            </View>
        );
    };
    
    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing || isFetching} onRefresh={onRefresh} colors={['#28a745']} tintColor="#28a745" />}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.headerSection}>
                {/* <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={24} color="#333" />
                </TouchableOpacity> */}
                {/* <Text style={styles.title}>{mode === 'diary' ? 'What I have Learnt Today' : 'Scheme of Work'}</Text> */}
                <View style={styles.headerButtons}>
                    <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
                        <Icon name="share-variant" size={20} color="#28a745" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={handlePDF} disabled={generatingPDF}>
                        {generatingPDF ? (
                            <ActivityIndicator size="small" color="#dc3545" />
                        ) : (
                            <Icon name="file-pdf-box" size={20} color="#dc3545" />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
            
            {/* Mode Switch - Radio Buttons */}
            <View style={styles.modeSwitchContainer}>
                <TouchableOpacity style={[styles.modeOption, mode === 'diary' && styles.modeOptionActive]} onPress={() => setMode('diary')}>
                    <Icon name="book-open-page-variant" size={18} color={mode === 'diary' ? '#fff' : '#666'} />
                    <Text style={[styles.modeOptionText, mode === 'diary' && styles.modeOptionTextActive]}>Class Diary</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modeOption, mode === 'sow' && styles.modeOptionActive]} onPress={() => setMode('sow')}>
                    <Icon name="calendar-month" size={18} color={mode === 'sow' ? '#fff' : '#666'} />
                    <Text style={[styles.modeOptionText, mode === 'sow' && styles.modeOptionTextActive]}>Scheme of Work</Text>
                </TouchableOpacity>
            </View>
            
            {/* Filters */}
            {renderFilters()}
            
            {/* Info Badges */}
            {renderInfoBadges()}
            
            {/* Content */}
            {renderContent()}
            
            {/* Date Picker */}
            {showDatePicker && (
                <DateTimePicker 
                    value={selectedDate} 
                    mode="date" 
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'} 
                    onChange={onDateChange} 
                    maximumDate={new Date()} 
                />
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    headerSection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingHorizontal: 15, paddingTop: 15, paddingBottom: 10, backgroundColor: '#fff' },
    backButton: { padding: 8 },
    title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', flex: 1, color: '#28a745' },
    headerButtons: { flexDirection: 'row', gap: 8 },
    iconButton: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' },
    modeSwitchContainer: { flexDirection: 'row', marginHorizontal: 15, marginVertical: 10, borderRadius: 30, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', overflow: 'hidden' },
    modeOption: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, gap: 8, backgroundColor: '#fff' },
    modeOptionActive: { backgroundColor: '#f5ad4b' },
    modeOptionText: { fontSize: 14, fontWeight: '600', color: '#666' },
    modeOptionTextActive: { color: '#fff' },
    filterSection: { marginHorizontal: 15, marginVertical: 10, padding: 15, borderRadius: 12, backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
    filterGroup: { marginBottom: 15 },
    filterLabel: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
    optionsScroll: { flexDirection: 'row' },
    optionChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8, backgroundColor: '#f0f0f0', borderWidth: 1, borderColor: '#ddd' },
    optionChipActive: { backgroundColor: '#f5ad4b', borderColor: '#f5ad4b' },
    optionChipText: { fontSize: 14, fontWeight: '500', color: '#333' },
    optionChipTextActive: { color: '#fff' },
    dateButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', alignSelf: 'flex-start', gap: 8, backgroundColor: '#fff' },
    dateButtonText: { fontSize: 14, color: '#333' },
    infoBadges: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingHorizontal: 15, marginBottom: 20, gap: 8 },
    infoBadge: { backgroundColor: '#28a745', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    infoBadgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
    themeSection: { marginHorizontal: 15, marginBottom: 15, padding: 15, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
    themeLabel: { fontSize: 14, fontWeight: 'bold', color: '#28a745', marginBottom: 8 },
    themeText: { fontSize: 14, textAlign: 'center', lineHeight: 20, color: '#333', fontStyle: 'italic' },
    themeTextPlaceholder: { fontSize: 14, textAlign: 'center', lineHeight: 20, color: '#999', fontStyle: 'italic' },
    panel: { marginHorizontal: 15, marginBottom: 20, borderRadius: 8, borderWidth: 1, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
    panelTitle: { padding: 10, alignItems: 'center', backgroundColor: '#f5ad4b' },
    panelTitleText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
    panelContent: { padding: 10, backgroundColor: '#f9f9f9' },
    tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ddd', minHeight: 45 },
    tableHeader: { width: 140, padding: 8, borderRightWidth: 1, borderRightColor: '#ddd', justifyContent: 'center', backgroundColor: '#f9f9f9' },
    headerText: { fontSize: 14, fontWeight: '800', color: '#141414' },
    tableCell: { flex: 1, padding: 8, backgroundColor: '#f9f9f9' },
    cellText: { fontSize: 14, marginVertical: 2, color: '#141414' },
    webView: { backgroundColor: 'transparent' },
    emptyText: { fontSize: 14, fontStyle: 'italic', color: '#999' },
    loadingContainer: { minHeight: 300, justifyContent: 'center', alignItems: 'center', padding: 40 },
    loadingText: { marginTop: 20, fontSize: 16, textAlign: 'center', color: '#666' },
    emptyState: { marginHorizontal: 15, marginBottom: 20, padding: 40, borderRadius: 15, backgroundColor: '#fff', alignItems: 'center' },
    emptyStateTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 15, marginBottom: 8, color: '#333' },
    emptyStateText: { fontSize: 14, textAlign: 'center', lineHeight: 20, color: '#666' },
});

export default ClassDiaryUnifiedScreen;