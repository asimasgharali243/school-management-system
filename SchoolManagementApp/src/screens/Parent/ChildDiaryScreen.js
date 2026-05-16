
// // // // // // // // // // // // src/screens/Parent/ChildDiaryScreen.js
// // // // // // // // // // // import React, { useState, useEffect } from 'react';
// // // // // // // // // // // import {
// // // // // // // // // // //     View,
// // // // // // // // // // //     Text,
// // // // // // // // // // //     StyleSheet,
// // // // // // // // // // //     ScrollView,
// // // // // // // // // // //     TouchableOpacity,
// // // // // // // // // // //     FlatList,
// // // // // // // // // // //     ActivityIndicator,
// // // // // // // // // // //     RefreshControl,
// // // // // // // // // // //     TextInput,
// // // // // // // // // // //     Alert,
// // // // // // // // // // // } from 'react-native';
// // // // // // // // // // // import { useSelector } from 'react-redux';
// // // // // // // // // // // import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// // // // // // // // // // // import { selectThemeData } from '../../store/slices/themeSlice';
// // // // // // // // // // // import { useGetChildDiaryQuery } from '../../store/attendanceApi';

// // // // // // // // // // // const ChildDiaryScreen = ({ route, navigation }) => {
// // // // // // // // // // //     const theme = useSelector(selectThemeData);
// // // // // // // // // // //     const { childId, childName } = route.params;

// // // // // // // // // // //     const [refreshing, setRefreshing] = useState(false);
// // // // // // // // // // //     const [diaryEntries, setDiaryEntries] = useState([]);
// // // // // // // // // // //     const [filteredEntries, setFilteredEntries] = useState([]);
// // // // // // // // // // //     const [selectedDate, setSelectedDate] = useState('');
// // // // // // // // // // //     const [selectedCategory, setSelectedCategory] = useState('All');
// // // // // // // // // // //     const [searchQuery, setSearchQuery] = useState('');
// // // // // // // // // // //     const [newEntry, setNewEntry] = useState('');

// // // // // // // // // // //     // New state for API filters
// // // // // // // // // // //     const [apiFilters, setApiFilters] = useState({
// // // // // // // // // // //         month: null,
// // // // // // // // // // //         year: null,
// // // // // // // // // // //         date: '',
// // // // // // // // // // //         subjectId: null
// // // // // // // // // // //     });

// // // // // // // // // // //     // Get current month and year for default filter
// // // // // // // // // // //     const currentDate = new Date();
// // // // // // // // // // //     const currentMonth = currentDate.getMonth() + 1; // 1-12
// // // // // // // // // // //     const currentYear = currentDate.getFullYear();

// // // // // // // // // // //     // API Query
// // // // // // // // // // //     const {
// // // // // // // // // // //         data: diaryResponse,
// // // // // // // // // // //         isLoading,
// // // // // // // // // // //         isFetching,
// // // // // // // // // // //         error,
// // // // // // // // // // //         refetch
// // // // // // // // // // //     } = useGetChildDiaryQuery({
// // // // // // // // // // //         childId,
// // // // // // // // // // //         filters: {
// // // // // // // // // // //             ...apiFilters,
// // // // // // // // // // //             month: apiFilters.month || currentMonth,
// // // // // // // // // // //             year: apiFilters.year || currentYear,
// // // // // // // // // // //             date: selectedDate || undefined
// // // // // // // // // // //         }
// // // // // // // // // // //     });

// // // // // // // // // // //     // Debug logging
// // // // // // // // // // //     useEffect(() => {
// // // // // // // // // // //         console.log('📓 Diary API State:', {
// // // // // // // // // // //             isLoading,
// // // // // // // // // // //             isFetching,
// // // // // // // // // // //             error: error ? 'Error exists' : 'No error',
// // // // // // // // // // //             hasResponse: !!diaryResponse,
// // // // // // // // // // //             responseSuccess: diaryResponse?.success,
// // // // // // // // // // //             filters: apiFilters,
// // // // // // // // // // //             selectedDate
// // // // // // // // // // //         });
// // // // // // // // // // //     }, [isLoading, isFetching, error, diaryResponse, apiFilters, selectedDate]);

// // // // // // // // // // //     // Process API response
// // // // // // // // // // //     useEffect(() => {
// // // // // // // // // // //         console.log('📓 Processing API response...');

// // // // // // // // // // //         if (diaryResponse) {
// // // // // // // // // // //             console.log('📓 API Response:', diaryResponse);

// // // // // // // // // // //             if (diaryResponse.success === true) {
// // // // // // // // // // //                 const responseData = diaryResponse.data;

// // // // // // // // // // //                 // Extract entries from response
// // // // // // // // // // //                 let entries = [];
// // // // // // // // // // //                 if (responseData && responseData.entries && Array.isArray(responseData.entries)) {
// // // // // // // // // // //                     entries = responseData.entries;
// // // // // // // // // // //                 } else if (Array.isArray(responseData)) {
// // // // // // // // // // //                     entries = responseData;
// // // // // // // // // // //                 } else if (responseData && responseData.data && Array.isArray(responseData.data)) {
// // // // // // // // // // //                     entries = responseData.data;
// // // // // // // // // // //                 }

// // // // // // // // // // //                 console.log('📓 Extracted entries:', entries.length, 'records');
// // // // // // // // // // //                 processDiaryData(entries);
// // // // // // // // // // //             } else if (diaryResponse.success === false) {
// // // // // // // // // // //                 console.error('❌ API returned error:', diaryResponse.error);
// // // // // // // // // // //                 Alert.alert('Error', diaryResponse.error || 'Failed to load diary entries');
// // // // // // // // // // //                 resetData();
// // // // // // // // // // //             } else {
// // // // // // // // // // //                 // If response doesn't have success property, try to process it directly
// // // // // // // // // // //                 console.log('⚠️ Response format different, trying to process directly');
// // // // // // // // // // //                 processDiaryData(diaryResponse);
// // // // // // // // // // //             }
// // // // // // // // // // //         } else if (error) {
// // // // // // // // // // //             console.error('❌ RTK Query error:', error);
// // // // // // // // // // //             Alert.alert('Error', 'Network error occurred. Please check your connection.');
// // // // // // // // // // //             resetData();
// // // // // // // // // // //         }
// // // // // // // // // // //     }, [diaryResponse, error]);

// // // // // // // // // // //     // Apply local filters when data or filters change
// // // // // // // // // // //     useEffect(() => {
// // // // // // // // // // //         filterEntries();
// // // // // // // // // // //     }, [searchQuery, selectedCategory, selectedDate, diaryEntries]);

// // // // // // // // // // //     const resetData = () => {
// // // // // // // // // // //         setDiaryEntries([]);
// // // // // // // // // // //         setFilteredEntries([]);
// // // // // // // // // // //     };

// // // // // // // // // // //     const processDiaryData = (rawData) => {
// // // // // // // // // // //         try {
// // // // // // // // // // //             console.log('📝 Processing raw data:', rawData);

// // // // // // // // // // //             // Handle different data structures
// // // // // // // // // // //             let entries = [];
// // // // // // // // // // //             if (Array.isArray(rawData)) {
// // // // // // // // // // //                 entries = rawData;
// // // // // // // // // // //             } else if (rawData && typeof rawData === 'object') {
// // // // // // // // // // //                 // Try common data structures
// // // // // // // // // // //                 if (Array.isArray(rawData.entries)) {
// // // // // // // // // // //                     entries = rawData.entries;
// // // // // // // // // // //                 } else if (Array.isArray(rawData.data)) {
// // // // // // // // // // //                     entries = rawData.data;
// // // // // // // // // // //                 } else if (Array.isArray(rawData.records)) {
// // // // // // // // // // //                     entries = rawData.records;
// // // // // // // // // // //                 }
// // // // // // // // // // //             }

// // // // // // // // // // //             console.log('📝 Processed entries:', entries.length, 'records');

// // // // // // // // // // //             // Transform API data to match frontend structure
// // // // // // // // // // //             const transformedEntries = entries.map(entry => {
// // // // // // // // // // //                 // Determine category based on content or subject
// // // // // // // // // // //                 let category = 'General';
// // // // // // // // // // //                 if (entry.subject && entry.subject.toLowerCase().includes('homework')) {
// // // // // // // // // // //                     category = 'Homework';
// // // // // // // // // // //                 } else if (entry.subject && (
// // // // // // // // // // //                     entry.subject.toLowerCase().includes('event') ||
// // // // // // // // // // //                     entry.content.toLowerCase().includes('event')
// // // // // // // // // // //                 )) {
// // // // // // // // // // //                     category = 'Event';
// // // // // // // // // // //                 } else if (entry.subject && (
// // // // // // // // // // //                     entry.subject.toLowerCase().includes('notice') ||
// // // // // // // // // // //                     entry.content.toLowerCase().includes('notice')
// // // // // // // // // // //                 )) {
// // // // // // // // // // //                     category = 'Notice';
// // // // // // // // // // //                 } else if (entry.subject && (
// // // // // // // // // // //                     entry.subject.toLowerCase().includes('achievement') ||
// // // // // // // // // // //                     entry.content.toLowerCase().includes('achievement') ||
// // // // // // // // // // //                     entry.content.toLowerCase().includes('won') ||
// // // // // // // // // // //                     entry.content.toLowerCase().includes('congrat')
// // // // // // // // // // //                 )) {
// // // // // // // // // // //                     category = 'Achievement';
// // // // // // // // // // //                 }

// // // // // // // // // // //                 // Determine priority based on keywords or category
// // // // // // // // // // //                 let priority = 'medium';
// // // // // // // // // // //                 if (category === 'Homework' ||
// // // // // // // // // // //                     entry.content.toLowerCase().includes('urgent') ||
// // // // // // // // // // //                     entry.content.toLowerCase().includes('due today') ||
// // // // // // // // // // //                     entry.content.toLowerCase().includes('important')) {
// // // // // // // // // // //                     priority = 'high';
// // // // // // // // // // //                 } else if (category === 'Achievement') {
// // // // // // // // // // //                     priority = 'low';
// // // // // // // // // // //                 }

// // // // // // // // // // //                 // Parse date and get day name
// // // // // // // // // // //                 const dateObj = entry.date ? new Date(entry.date) : new Date();
// // // // // // // // // // //                 const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
// // // // // // // // // // //                 const dayName = dayNames[dateObj.getDay()];

// // // // // // // // // // //                 return {
// // // // // // // // // // //                     id: entry.id || entry.DiaryID || Date.now() + Math.random(),
// // // // // // // // // // //                     date: entry.date || '',
// // // // // // // // // // //                     day: dayName,
// // // // // // // // // // //                     category: category,
// // // // // // // // // // //                     content: entry.content || entry.Details || '',
// // // // // // // // // // //                     teacher: entry.teacher || entry.EmployeeName || 'Teacher',
// // // // // // // // // // //                     subject: entry.subject || entry.SubjectName || 'General',
// // // // // // // // // // //                     priority: priority,
// // // // // // // // // // //                     // Original API data for reference
// // // // // // // // // // //                     originalData: entry
// // // // // // // // // // //                 };
// // // // // // // // // // //             });

// // // // // // // // // // //             // Sort by date (newest first)
// // // // // // // // // // //             const sortedEntries = transformedEntries.sort((a, b) => {
// // // // // // // // // // //                 return new Date(b.date) - new Date(a.date);
// // // // // // // // // // //             });

// // // // // // // // // // //             setDiaryEntries(sortedEntries);
// // // // // // // // // // //             setFilteredEntries(sortedEntries);

// // // // // // // // // // //             console.log('📊 Diary stats:', {
// // // // // // // // // // //                 totalEntries: sortedEntries.length,
// // // // // // // // // // //                 byCategory: sortedEntries.reduce((acc, entry) => {
// // // // // // // // // // //                     acc[entry.category] = (acc[entry.category] || 0) + 1;
// // // // // // // // // // //                     return acc;
// // // // // // // // // // //                 }, {})
// // // // // // // // // // //             });

// // // // // // // // // // //         } catch (error) {
// // // // // // // // // // //             console.error('❌ Error processing data:', error);
// // // // // // // // // // //             Alert.alert('Error', 'Failed to process diary data. Please try again.');
// // // // // // // // // // //             resetData();
// // // // // // // // // // //         }
// // // // // // // // // // //     };

// // // // // // // // // // //     const filterEntries = () => {
// // // // // // // // // // //         let filtered = [...diaryEntries];

// // // // // // // // // // //         // Filter by search query
// // // // // // // // // // //         if (searchQuery.trim() !== '') {
// // // // // // // // // // //             filtered = filtered.filter(entry =>
// // // // // // // // // // //                 entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
// // // // // // // // // // //                 entry.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
// // // // // // // // // // //                 entry.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
// // // // // // // // // // //                 entry.category.toLowerCase().includes(searchQuery.toLowerCase())
// // // // // // // // // // //             );
// // // // // // // // // // //         }

// // // // // // // // // // //         // Filter by category
// // // // // // // // // // //         if (selectedCategory !== 'All') {
// // // // // // // // // // //             filtered = filtered.filter(entry => entry.category === selectedCategory);
// // // // // // // // // // //         }

// // // // // // // // // // //         // Filter by date (if specific date is selected)
// // // // // // // // // // //         if (selectedDate) {
// // // // // // // // // // //             filtered = filtered.filter(entry => entry.date === selectedDate);
// // // // // // // // // // //         }

// // // // // // // // // // //         setFilteredEntries(filtered);
// // // // // // // // // // //     };

// // // // // // // // // // //     const onRefresh = async () => {
// // // // // // // // // // //         setRefreshing(true);
// // // // // // // // // // //         try {
// // // // // // // // // // //             console.log('🔄 Refreshing diary data...');
// // // // // // // // // // //             await refetch();
// // // // // // // // // // //         } catch (error) {
// // // // // // // // // // //             console.error('Refresh error:', error);
// // // // // // // // // // //         }
// // // // // // // // // // //         setRefreshing(false);
// // // // // // // // // // //     };

// // // // // // // // // // //     const getPriorityColor = (priority) => {
// // // // // // // // // // //         switch (priority) {
// // // // // // // // // // //             case 'high': return theme.error || '#F44336';
// // // // // // // // // // //             case 'medium': return theme.warning || '#FF9800';
// // // // // // // // // // //             case 'low': return theme.success || '#4CAF50';
// // // // // // // // // // //             default: return theme.textSecondary || '#9E9E9E';
// // // // // // // // // // //         }
// // // // // // // // // // //     };

// // // // // // // // // // //     const getCategoryColor = (category) => {
// // // // // // // // // // //         const colors = {
// // // // // // // // // // //             'Homework': theme.primary || '#3F51B5',
// // // // // // // // // // //             'Notice': theme.warning || '#FF9800',
// // // // // // // // // // //             'Event': theme.success || '#4CAF50',
// // // // // // // // // // //             'Achievement': '#9C27B0',
// // // // // // // // // // //             'General': theme.textSecondary || '#757575',
// // // // // // // // // // //             'Note': theme.info || '#2196F3',
// // // // // // // // // // //         };
// // // // // // // // // // //         return colors[category] || theme.primary || '#3F51B5';
// // // // // // // // // // //     };

// // // // // // // // // // //     const getCategoryIcon = (category) => {
// // // // // // // // // // //         const icons = {
// // // // // // // // // // //             'Homework': 'book-open',
// // // // // // // // // // //             'Notice': 'bell',
// // // // // // // // // // //             'Event': 'calendar',
// // // // // // // // // // //             'Achievement': 'trophy',
// // // // // // // // // // //             'General': 'information',
// // // // // // // // // // //             'Note': 'note-text',
// // // // // // // // // // //         };
// // // // // // // // // // //         return icons[category] || 'help-circle';
// // // // // // // // // // //     };

// // // // // // // // // // //     const handleAddNote = () => {
// // // // // // // // // // //         if (newEntry.trim() !== '') {
// // // // // // // // // // //             const newNote = {
// // // // // // // // // // //                 id: Date.now(),
// // // // // // // // // // //                 date: new Date().toISOString().split('T')[0],
// // // // // // // // // // //                 day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()],
// // // // // // // // // // //                 category: 'Note',
// // // // // // // // // // //                 content: newEntry,
// // // // // // // // // // //                 teacher: 'Parent',
// // // // // // // // // // //                 subject: 'Personal Note',
// // // // // // // // // // //                 priority: 'low',
// // // // // // // // // // //             };
// // // // // // // // // // //             setDiaryEntries([newNote, ...diaryEntries]);
// // // // // // // // // // //             setNewEntry('');
// // // // // // // // // // //             Alert.alert('Success', 'Note added successfully');
// // // // // // // // // // //         }
// // // // // // // // // // //     };

// // // // // // // // // // //     const handleMarkAsRead = (entryId) => {
// // // // // // // // // // //         // Mark entry as read - implement if needed
// // // // // // // // // // //         console.log('Mark as read:', entryId);
// // // // // // // // // // //         // You could add a "read" property to entries
// // // // // // // // // // //     };

// // // // // // // // // // //     const handleShareEntry = (entry) => {
// // // // // // // // // // //         // Share entry functionality
// // // // // // // // // // //         console.log('Share entry:', entry);
// // // // // // // // // // //         Alert.alert('Share', `Share "${entry.subject}" entry`);
// // // // // // // // // // //     };

// // // // // // // // // // //     const formatDateDisplay = (dateString) => {
// // // // // // // // // // //         try {
// // // // // // // // // // //             if (!dateString) return 'No date';
// // // // // // // // // // //             const date = new Date(dateString);
// // // // // // // // // // //             if (isNaN(date.getTime())) return 'Invalid Date';

// // // // // // // // // // //             return date.toLocaleDateString('en-US', {
// // // // // // // // // // //                 month: 'short',
// // // // // // // // // // //                 day: 'numeric',
// // // // // // // // // // //                 year: 'numeric'
// // // // // // // // // // //             });
// // // // // // // // // // //         } catch (error) {
// // // // // // // // // // //             return 'Invalid Date';
// // // // // // // // // // //         }
// // // // // // // // // // //     };

// // // // // // // // // // //     const handleMonthChange = (monthOffset) => {
// // // // // // // // // // //         const currentMonth = apiFilters.month || currentDate.getMonth() + 1;
// // // // // // // // // // //         const currentYear = apiFilters.year || currentDate.getFullYear();

// // // // // // // // // // //         let newMonth = currentMonth + monthOffset;
// // // // // // // // // // //         let newYear = currentYear;

// // // // // // // // // // //         if (newMonth > 12) {
// // // // // // // // // // //             newMonth = 1;
// // // // // // // // // // //             newYear += 1;
// // // // // // // // // // //         } else if (newMonth < 1) {
// // // // // // // // // // //             newMonth = 12;
// // // // // // // // // // //             newYear -= 1;
// // // // // // // // // // //         }

// // // // // // // // // // //         setApiFilters(prev => ({
// // // // // // // // // // //             ...prev,
// // // // // // // // // // //             month: newMonth,
// // // // // // // // // // //             year: newYear
// // // // // // // // // // //         }));
// // // // // // // // // // //         setSelectedDate(''); // Clear date filter when changing month
// // // // // // // // // // //     };

// // // // // // // // // // //     const handleResetFilters = () => {
// // // // // // // // // // //         setSelectedDate('');
// // // // // // // // // // //         setSelectedCategory('All');
// // // // // // // // // // //         setSearchQuery('');
// // // // // // // // // // //         setApiFilters({
// // // // // // // // // // //             month: currentMonth,
// // // // // // // // // // //             year: currentYear,
// // // // // // // // // // //             date: '',
// // // // // // // // // // //             subjectId: null
// // // // // // // // // // //         });
// // // // // // // // // // //     };

// // // // // // // // // // //     const renderDiaryEntry = ({ item }) => (
// // // // // // // // // // //         <View style={[styles.entryCard, { backgroundColor: theme.card || '#F5F5F5' }]}>
// // // // // // // // // // //             <View style={styles.entryHeader}>
// // // // // // // // // // //                 <View style={styles.categoryContainer}>
// // // // // // // // // // //                     <Icon
// // // // // // // // // // //                         name={getCategoryIcon(item.category)}
// // // // // // // // // // //                         size={20}
// // // // // // // // // // //                         color={getCategoryColor(item.category)}
// // // // // // // // // // //                         style={styles.categoryIcon}
// // // // // // // // // // //                     />
// // // // // // // // // // //                     <Text style={[styles.category, { color: getCategoryColor(item.category) }]}>
// // // // // // // // // // //                         {item.category}
// // // // // // // // // // //                     </Text>
// // // // // // // // // // //                 </View>
// // // // // // // // // // //                 <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) + '20' }]}>
// // // // // // // // // // //                     <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(item.priority) }]} />
// // // // // // // // // // //                     <Text style={[styles.priorityText, { color: getPriorityColor(item.priority) }]}>
// // // // // // // // // // //                         {item.priority}
// // // // // // // // // // //                     </Text>
// // // // // // // // // // //                 </View>
// // // // // // // // // // //             </View>

// // // // // // // // // // //             <Text style={[styles.entryContent, { color: theme.text || '#000000' }]}>
// // // // // // // // // // //                 {item.content}
// // // // // // // // // // //             </Text>

// // // // // // // // // // //             <View style={styles.entryFooter}>
// // // // // // // // // // //                 <View style={styles.footerLeft}>
// // // // // // // // // // //                     <View style={styles.subjectBadge}>
// // // // // // // // // // //                         <Text style={[styles.subjectText, { color: theme.textSecondary || '#757575' }]}>
// // // // // // // // // // //                             {item.subject}
// // // // // // // // // // //                         </Text>
// // // // // // // // // // //                     </View>
// // // // // // // // // // //                     <Text style={[styles.teacher, { color: theme.textSecondary || '#757575' }]}>
// // // // // // // // // // //                         By: {item.teacher}
// // // // // // // // // // //                     </Text>
// // // // // // // // // // //                 </View>

// // // // // // // // // // //                 <View style={styles.footerRight}>
// // // // // // // // // // //                     <Text style={[styles.date, { color: theme.textSecondary || '#757575' }]}>
// // // // // // // // // // //                         {formatDateDisplay(item.date)} • {item.day}
// // // // // // // // // // //                     </Text>
// // // // // // // // // // //                     <View style={styles.entryActions}>
// // // // // // // // // // //                         <TouchableOpacity
// // // // // // // // // // //                             style={styles.actionButton}
// // // // // // // // // // //                             onPress={() => handleMarkAsRead(item.id)}
// // // // // // // // // // //                         >
// // // // // // // // // // //                             <Icon name="check" size={16} color={theme.success || '#4CAF50'} />
// // // // // // // // // // //                         </TouchableOpacity>
// // // // // // // // // // //                         <TouchableOpacity
// // // // // // // // // // //                             style={styles.actionButton}
// // // // // // // // // // //                             onPress={() => handleShareEntry(item)}
// // // // // // // // // // //                         >
// // // // // // // // // // //                             <Icon name="share" size={16} color={theme.primary || '#3F51B5'} />
// // // // // // // // // // //                         </TouchableOpacity>
// // // // // // // // // // //                     </View>
// // // // // // // // // // //                 </View>
// // // // // // // // // // //             </View>
// // // // // // // // // // //         </View>
// // // // // // // // // // //     );

// // // // // // // // // // //     const categories = ['All', 'Homework', 'Notice', 'Event', 'Achievement', 'Note'];

// // // // // // // // // // //     // Get month name
// // // // // // // // // // //     const getMonthName = (monthNumber) => {
// // // // // // // // // // //         const months = [
// // // // // // // // // // //             'January', 'February', 'March', 'April', 'May', 'June',
// // // // // // // // // // //             'July', 'August', 'September', 'October', 'November', 'December'
// // // // // // // // // // //         ];
// // // // // // // // // // //         return months[(monthNumber - 1) % 12] || 'Month';
// // // // // // // // // // //     };

// // // // // // // // // // //     // Error state
// // // // // // // // // // //     if (error) {
// // // // // // // // // // //         return (
// // // // // // // // // // //             <View style={[styles.container, { backgroundColor: theme.background || '#FFFFFF' }]}>
// // // // // // // // // // //                 <View style={styles.errorContainer}>
// // // // // // // // // // //                     <Icon name="wifi-off" size={60} color={theme.error || '#F44336'} />
// // // // // // // // // // //                     <Text style={[styles.errorText, { color: theme.text || '#000000' }]}>
// // // // // // // // // // //                         Connection Error
// // // // // // // // // // //                     </Text>
// // // // // // // // // // //                     <Text style={[styles.errorSubtext, { color: theme.textSecondary || '#757575' }]}>
// // // // // // // // // // //                         Unable to connect to the server.{'\n'}Please check your internet connection.
// // // // // // // // // // //                     </Text>
// // // // // // // // // // //                     <TouchableOpacity
// // // // // // // // // // //                         style={[styles.retryButton, { backgroundColor: theme.primary || '#3F51B5' }]}
// // // // // // // // // // //                         onPress={() => refetch()}
// // // // // // // // // // //                     >
// // // // // // // // // // //                         <Text style={styles.retryButtonText}>Try Again</Text>
// // // // // // // // // // //                     </TouchableOpacity>
// // // // // // // // // // //                 </View>
// // // // // // // // // // //             </View>
// // // // // // // // // // //         );
// // // // // // // // // // //     }

// // // // // // // // // // //     return (
// // // // // // // // // // //         <ScrollView
// // // // // // // // // // //             style={[styles.container, { backgroundColor: theme.background || '#FFFFFF' }]}
// // // // // // // // // // //             refreshControl={
// // // // // // // // // // //                 <RefreshControl
// // // // // // // // // // //                     refreshing={refreshing}
// // // // // // // // // // //                     onRefresh={onRefresh}
// // // // // // // // // // //                     colors={[theme.primary || '#3F51B5']}
// // // // // // // // // // //                     tintColor={theme.primary || '#3F51B5'}
// // // // // // // // // // //                 />
// // // // // // // // // // //             }
// // // // // // // // // // //         >
// // // // // // // // // // //             {/* Header */}
// // // // // // // // // // //             <View style={[styles.header, { backgroundColor: theme.card || '#F5F5F5' }]}>
// // // // // // // // // // //                 <View>
// // // // // // // // // // //                     <Text style={[styles.title, { color: theme.text || '#000000' }]}>
// // // // // // // // // // //                         {childName}'s Diary
// // // // // // // // // // //                     </Text>
// // // // // // // // // // //                     <Text style={[styles.subtitle, { color: theme.textSecondary || '#757575' }]}>
// // // // // // // // // // //                         Stay updated with school activities and homework
// // // // // // // // // // //                     </Text>
// // // // // // // // // // //                 </View>
// // // // // // // // // // //                 <Icon name="notebook" size={40} color={theme.primary || '#3F51B5'} />
// // // // // // // // // // //             </View>

// // // // // // // // // // //             {/* Search Bar */}
// // // // // // // // // // //             <View style={[styles.searchContainer, { backgroundColor: theme.card || '#F5F5F5' }]}>
// // // // // // // // // // //                 <Icon name="magnify" size={20} color={theme.textSecondary || '#757575'} style={styles.searchIcon} />
// // // // // // // // // // //                 <TextInput
// // // // // // // // // // //                     style={[styles.searchInput, { color: theme.text || '#000000' }]}
// // // // // // // // // // //                     placeholder="Search diary entries..."
// // // // // // // // // // //                     placeholderTextColor={theme.textSecondary || '#757575'}
// // // // // // // // // // //                     value={searchQuery}
// // // // // // // // // // //                     onChangeText={setSearchQuery}
// // // // // // // // // // //                 />
// // // // // // // // // // //                 {searchQuery !== '' && (
// // // // // // // // // // //                     <TouchableOpacity onPress={() => setSearchQuery('')}>
// // // // // // // // // // //                         <Icon name="close-circle" size={20} color={theme.textSecondary || '#757575'} />
// // // // // // // // // // //                     </TouchableOpacity>
// // // // // // // // // // //                 )}
// // // // // // // // // // //             </View>

// // // // // // // // // // //             {/* Month Navigation */}
// // // // // // // // // // //             <View style={[styles.monthNavigation, { backgroundColor: theme.card || '#F5F5F5' }]}>
// // // // // // // // // // //                 <TouchableOpacity
// // // // // // // // // // //                     style={[styles.monthNavButton, { backgroundColor: theme.primary + '20' || '#3F51B520' }]}
// // // // // // // // // // //                     onPress={() => handleMonthChange(-1)}
// // // // // // // // // // //                 >
// // // // // // // // // // //                     <Icon name="chevron-left" size={24} color={theme.primary || '#3F51B5'} />
// // // // // // // // // // //                 </TouchableOpacity>

// // // // // // // // // // //                 <View style={styles.monthDisplay}>
// // // // // // // // // // //                     <Text style={[styles.monthText, { color: theme.text || '#000000' }]}>
// // // // // // // // // // //                         {getMonthName(apiFilters.month || currentMonth)} {apiFilters.year || currentYear}
// // // // // // // // // // //                     </Text>
// // // // // // // // // // //                     <Text style={[styles.monthSubtext, { color: theme.textSecondary || '#757575' }]}>
// // // // // // // // // // //                         {diaryEntries.length} entries
// // // // // // // // // // //                     </Text>
// // // // // // // // // // //                 </View>

// // // // // // // // // // //                 <TouchableOpacity
// // // // // // // // // // //                     style={[styles.monthNavButton, { backgroundColor: theme.primary + '20' || '#3F51B520' }]}
// // // // // // // // // // //                     onPress={() => handleMonthChange(1)}
// // // // // // // // // // //                 >
// // // // // // // // // // //                     <Icon name="chevron-right" size={24} color={theme.primary || '#3F51B5'} />
// // // // // // // // // // //                 </TouchableOpacity>
// // // // // // // // // // //             </View>

// // // // // // // // // // //             {/* Filters */}
// // // // // // // // // // //             <View style={styles.filtersContainer}>
// // // // // // // // // // //                 <ScrollView
// // // // // // // // // // //                     horizontal
// // // // // // // // // // //                     showsHorizontalScrollIndicator={false}
// // // // // // // // // // //                     contentContainerStyle={styles.filtersScroll}
// // // // // // // // // // //                 >
// // // // // // // // // // //                     {categories.map((category) => (
// // // // // // // // // // //                         <TouchableOpacity
// // // // // // // // // // //                             key={category}
// // // // // // // // // // //                             style={[
// // // // // // // // // // //                                 styles.filterButton,
// // // // // // // // // // //                                 { backgroundColor: theme.card || '#F5F5F5' },
// // // // // // // // // // //                                 selectedCategory === category && { backgroundColor: theme.primary || '#3F51B5' },
// // // // // // // // // // //                             ]}
// // // // // // // // // // //                             onPress={() => setSelectedCategory(category)}
// // // // // // // // // // //                         >
// // // // // // // // // // //                             <Text
// // // // // // // // // // //                                 style={[
// // // // // // // // // // //                                     styles.filterButtonText,
// // // // // // // // // // //                                     { color: theme.text || '#000000' },
// // // // // // // // // // //                                     selectedCategory === category && { color: '#FFFFFF' },
// // // // // // // // // // //                                 ]}
// // // // // // // // // // //                             >
// // // // // // // // // // //                                 {category}
// // // // // // // // // // //                             </Text>
// // // // // // // // // // //                         </TouchableOpacity>
// // // // // // // // // // //                     ))}
// // // // // // // // // // //                 </ScrollView>

// // // // // // // // // // //                 <TouchableOpacity
// // // // // // // // // // //                     style={[styles.dateButton, { backgroundColor: theme.card || '#F5F5F5' }]}
// // // // // // // // // // //                     onPress={() => setSelectedDate(selectedDate ? '' : new Date().toISOString().split('T')[0])}
// // // // // // // // // // //                 >
// // // // // // // // // // //                     <Icon name="calendar" size={16} color={theme.primary || '#3F51B5'} />
// // // // // // // // // // //                     <Text style={[styles.dateButtonText, { color: theme.text || '#000000' }]}>
// // // // // // // // // // //                         {selectedDate ? formatDateDisplay(selectedDate) : 'All Dates'}
// // // // // // // // // // //                     </Text>
// // // // // // // // // // //                 </TouchableOpacity>
// // // // // // // // // // //             </View>

// // // // // // // // // // //             {/* Add Note */}
// // // // // // // // // // //             <View style={[styles.addNoteContainer, { backgroundColor: theme.card || '#F5F5F5' }]}>
// // // // // // // // // // //                 <Text style={[styles.addNoteTitle, { color: theme.text || '#000000' }]}>
// // // // // // // // // // //                     Add Parent Note
// // // // // // // // // // //                 </Text>
// // // // // // // // // // //                 <View style={styles.addNoteInputContainer}>
// // // // // // // // // // //                     <TextInput
// // // // // // // // // // //                         style={[styles.addNoteInput, { color: theme.text || '#000000', backgroundColor: theme.background || '#FFFFFF' }]}
// // // // // // // // // // //                         placeholder="Type your note here..."
// // // // // // // // // // //                         placeholderTextColor={theme.textSecondary || '#757575'}
// // // // // // // // // // //                         value={newEntry}
// // // // // // // // // // //                         onChangeText={setNewEntry}
// // // // // // // // // // //                         multiline
// // // // // // // // // // //                         maxLength={500}
// // // // // // // // // // //                     />
// // // // // // // // // // //                     <TouchableOpacity
// // // // // // // // // // //                         style={[styles.addNoteButton, {
// // // // // // // // // // //                             backgroundColor: theme.primary || '#3F51B5',
// // // // // // // // // // //                             opacity: newEntry.trim() === '' ? 0.5 : 1
// // // // // // // // // // //                         }]}
// // // // // // // // // // //                         onPress={handleAddNote}
// // // // // // // // // // //                         disabled={newEntry.trim() === ''}
// // // // // // // // // // //                     >
// // // // // // // // // // //                         <Icon name="send" size={20} color="#FFFFFF" />
// // // // // // // // // // //                     </TouchableOpacity>
// // // // // // // // // // //                 </View>
// // // // // // // // // // //             </View>

// // // // // // // // // // //             {/* Diary Entries */}
// // // // // // // // // // //             <View style={styles.section}>
// // // // // // // // // // //                 <View style={styles.sectionHeader}>
// // // // // // // // // // //                     <Text style={[styles.sectionTitle, { color: theme.text || '#000000' }]}>
// // // // // // // // // // //                         Diary Entries ({filteredEntries.length})
// // // // // // // // // // //                     </Text>
// // // // // // // // // // //                     <TouchableOpacity onPress={handleResetFilters}>
// // // // // // // // // // //                         <Text style={[styles.clearFilters, { color: theme.primary || '#3F51B5' }]}>
// // // // // // // // // // //                             Clear Filters
// // // // // // // // // // //                         </Text>
// // // // // // // // // // //                     </TouchableOpacity>
// // // // // // // // // // //                 </View>

// // // // // // // // // // //                 {/* Loading indicator */}
// // // // // // // // // // //                 {(isLoading || isFetching) && !refreshing && (
// // // // // // // // // // //                     <View style={styles.loadingContainer}>
// // // // // // // // // // //                         <ActivityIndicator size="small" color={theme.primary || '#3F51B5'} />
// // // // // // // // // // //                         <Text style={[styles.loadingText, { color: theme.textSecondary || '#757575' }]}>
// // // // // // // // // // //                             Loading entries...
// // // // // // // // // // //                         </Text>
// // // // // // // // // // //                     </View>
// // // // // // // // // // //                 )}

// // // // // // // // // // //                 <FlatList
// // // // // // // // // // //                     data={filteredEntries}
// // // // // // // // // // //                     renderItem={renderDiaryEntry}
// // // // // // // // // // //                     keyExtractor={(item) => item.id.toString()}
// // // // // // // // // // //                     scrollEnabled={false}
// // // // // // // // // // //                     ListEmptyComponent={
// // // // // // // // // // //                         <View style={styles.emptyContainer}>
// // // // // // // // // // //                             <Icon name="notebook-remove" size={60} color={theme.textSecondary || '#757575'} />
// // // // // // // // // // //                             <Text style={[styles.emptyText, { color: theme.textSecondary || '#757575' }]}>
// // // // // // // // // // //                                 No diary entries found
// // // // // // // // // // //                             </Text>
// // // // // // // // // // //                             <Text style={[styles.emptySubtext, { color: theme.textSecondary || '#757575' }]}>
// // // // // // // // // // //                                 {searchQuery || selectedDate || selectedCategory !== 'All'
// // // // // // // // // // //                                     ? 'Try clearing filters'
// // // // // // // // // // //                                     : 'No entries for this month'}
// // // // // // // // // // //                             </Text>
// // // // // // // // // // //                             <TouchableOpacity
// // // // // // // // // // //                                 style={[styles.emptyButton, { backgroundColor: theme.primary || '#3F51B5' }]}
// // // // // // // // // // //                                 onPress={handleResetFilters}
// // // // // // // // // // //                             >
// // // // // // // // // // //                                 <Text style={styles.emptyButtonText}>Clear Filters</Text>
// // // // // // // // // // //                             </TouchableOpacity>
// // // // // // // // // // //                         </View>
// // // // // // // // // // //                     }
// // // // // // // // // // //                 />
// // // // // // // // // // //             </View>

// // // // // // // // // // //             {/* Summary Stats */}
// // // // // // // // // // //             <View style={[styles.summaryCard, { backgroundColor: theme.card || '#F5F5F5' }]}>
// // // // // // // // // // //                 <Text style={[styles.summaryTitle, { color: theme.text || '#000000' }]}>
// // // // // // // // // // //                     This Month's Summary
// // // // // // // // // // //                 </Text>
// // // // // // // // // // //                 <View style={styles.summaryStats}>
// // // // // // // // // // //                     <View style={styles.summaryItem}>
// // // // // // // // // // //                         <Icon name="book-open" size={24} color={theme.primary || '#3F51B5'} />
// // // // // // // // // // //                         <Text style={[styles.summaryValue, { color: theme.text || '#000000' }]}>
// // // // // // // // // // //                             {diaryEntries.filter(e => e.category === 'Homework').length}
// // // // // // // // // // //                         </Text>
// // // // // // // // // // //                         <Text style={[styles.summaryLabel, { color: theme.textSecondary || '#757575' }]}>
// // // // // // // // // // //                             Homework
// // // // // // // // // // //                         </Text>
// // // // // // // // // // //                     </View>
// // // // // // // // // // //                     <View style={styles.summaryItem}>
// // // // // // // // // // //                         <Icon name="bell" size={24} color={theme.warning || '#FF9800'} />
// // // // // // // // // // //                         <Text style={[styles.summaryValue, { color: theme.text || '#000000' }]}>
// // // // // // // // // // //                             {diaryEntries.filter(e => e.category === 'Notice').length}
// // // // // // // // // // //                         </Text>
// // // // // // // // // // //                         <Text style={[styles.summaryLabel, { color: theme.textSecondary || '#757575' }]}>
// // // // // // // // // // //                             Notices
// // // // // // // // // // //                         </Text>
// // // // // // // // // // //                     </View>
// // // // // // // // // // //                     <View style={styles.summaryItem}>
// // // // // // // // // // //                         <Icon name="calendar" size={24} color={theme.success || '#4CAF50'} />
// // // // // // // // // // //                         <Text style={[styles.summaryValue, { color: theme.text || '#000000' }]}>
// // // // // // // // // // //                             {diaryEntries.filter(e => e.category === 'Event').length}
// // // // // // // // // // //                         </Text>
// // // // // // // // // // //                         <Text style={[styles.summaryLabel, { color: theme.textSecondary || '#757575' }]}>
// // // // // // // // // // //                             Events
// // // // // // // // // // //                         </Text>
// // // // // // // // // // //                     </View>
// // // // // // // // // // //                     <View style={styles.summaryItem}>
// // // // // // // // // // //                         <Icon name="trophy" size={24} color="#9C27B0" />
// // // // // // // // // // //                         <Text style={[styles.summaryValue, { color: theme.text || '#000000' }]}>
// // // // // // // // // // //                             {diaryEntries.filter(e => e.category === 'Achievement').length}
// // // // // // // // // // //                         </Text>
// // // // // // // // // // //                         <Text style={[styles.summaryLabel, { color: theme.textSecondary || '#757575' }]}>
// // // // // // // // // // //                             Achievements
// // // // // // // // // // //                         </Text>
// // // // // // // // // // //                     </View>
// // // // // // // // // // //                 </View>
// // // // // // // // // // //             </View>
// // // // // // // // // // //         </ScrollView>
// // // // // // // // // // //     );
// // // // // // // // // // // };

// // // // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // // // //     container: {
// // // // // // // // // // //         flex: 1,
// // // // // // // // // // //     },
// // // // // // // // // // //     errorContainer: {
// // // // // // // // // // //         flex: 1,
// // // // // // // // // // //         justifyContent: 'center',
// // // // // // // // // // //         alignItems: 'center',
// // // // // // // // // // //         padding: 24,
// // // // // // // // // // //     },
// // // // // // // // // // //     errorText: {
// // // // // // // // // // //         fontSize: 18,
// // // // // // // // // // //         fontWeight: 'bold',
// // // // // // // // // // //         marginTop: 16,
// // // // // // // // // // //         marginBottom: 8,
// // // // // // // // // // //         textAlign: 'center',
// // // // // // // // // // //     },
// // // // // // // // // // //     errorSubtext: {
// // // // // // // // // // //         fontSize: 14,
// // // // // // // // // // //         textAlign: 'center',
// // // // // // // // // // //         lineHeight: 20,
// // // // // // // // // // //         marginBottom: 24,
// // // // // // // // // // //     },
// // // // // // // // // // //     retryButton: {
// // // // // // // // // // //         paddingHorizontal: 32,
// // // // // // // // // // //         paddingVertical: 12,
// // // // // // // // // // //         borderRadius: 24,
// // // // // // // // // // //     },
// // // // // // // // // // //     retryButtonText: {
// // // // // // // // // // //         color: '#FFF',
// // // // // // // // // // //         fontSize: 16,
// // // // // // // // // // //         fontWeight: '600',
// // // // // // // // // // //     },
// // // // // // // // // // //     header: {
// // // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // // //         justifyContent: 'space-between',
// // // // // // // // // // //         alignItems: 'center',
// // // // // // // // // // //         padding: 20,
// // // // // // // // // // //         marginBottom: 10,
// // // // // // // // // // //     },
// // // // // // // // // // //     title: {
// // // // // // // // // // //         fontSize: 22,
// // // // // // // // // // //         fontWeight: 'bold',
// // // // // // // // // // //     },
// // // // // // // // // // //     subtitle: {
// // // // // // // // // // //         fontSize: 14,
// // // // // // // // // // //         marginTop: 4,
// // // // // // // // // // //     },
// // // // // // // // // // //     monthNavigation: {
// // // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // // //         alignItems: 'center',
// // // // // // // // // // //         justifyContent: 'space-between',
// // // // // // // // // // //         marginHorizontal: 15,
// // // // // // // // // // //         marginBottom: 15,
// // // // // // // // // // //         padding: 15,
// // // // // // // // // // //         borderRadius: 12,
// // // // // // // // // // //         elevation: 2,
// // // // // // // // // // //         shadowColor: '#000',
// // // // // // // // // // //         shadowOffset: { width: 0, height: 1 },
// // // // // // // // // // //         shadowOpacity: 0.1,
// // // // // // // // // // //         shadowRadius: 3,
// // // // // // // // // // //     },
// // // // // // // // // // //     monthNavButton: {
// // // // // // // // // // //         width: 40,
// // // // // // // // // // //         height: 40,
// // // // // // // // // // //         borderRadius: 20,
// // // // // // // // // // //         justifyContent: 'center',
// // // // // // // // // // //         alignItems: 'center',
// // // // // // // // // // //     },
// // // // // // // // // // //     monthDisplay: {
// // // // // // // // // // //         alignItems: 'center',
// // // // // // // // // // //     },
// // // // // // // // // // //     monthText: {
// // // // // // // // // // //         fontSize: 18,
// // // // // // // // // // //         fontWeight: 'bold',
// // // // // // // // // // //     },
// // // // // // // // // // //     monthSubtext: {
// // // // // // // // // // //         fontSize: 12,
// // // // // // // // // // //         marginTop: 2,
// // // // // // // // // // //     },
// // // // // // // // // // //     searchContainer: {
// // // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // // //         alignItems: 'center',
// // // // // // // // // // //         marginHorizontal: 15,
// // // // // // // // // // //         marginBottom: 15,
// // // // // // // // // // //         paddingHorizontal: 15,
// // // // // // // // // // //         paddingVertical: 12,
// // // // // // // // // // //         borderRadius: 10,
// // // // // // // // // // //         elevation: 2,
// // // // // // // // // // //         shadowColor: '#000',
// // // // // // // // // // //         shadowOffset: { width: 0, height: 1 },
// // // // // // // // // // //         shadowOpacity: 0.1,
// // // // // // // // // // //         shadowRadius: 2,
// // // // // // // // // // //     },
// // // // // // // // // // //     searchIcon: {
// // // // // // // // // // //         marginRight: 10,
// // // // // // // // // // //     },
// // // // // // // // // // //     searchInput: {
// // // // // // // // // // //         flex: 1,
// // // // // // // // // // //         fontSize: 16,
// // // // // // // // // // //         paddingVertical: 0,
// // // // // // // // // // //     },
// // // // // // // // // // //     filtersContainer: {
// // // // // // // // // // //         marginBottom: 15,
// // // // // // // // // // //     },
// // // // // // // // // // //     filtersScroll: {
// // // // // // // // // // //         paddingHorizontal: 15,
// // // // // // // // // // //         paddingBottom: 10,
// // // // // // // // // // //     },
// // // // // // // // // // //     filterButton: {
// // // // // // // // // // //         paddingHorizontal: 15,
// // // // // // // // // // //         paddingVertical: 8,
// // // // // // // // // // //         borderRadius: 20,
// // // // // // // // // // //         marginRight: 10,
// // // // // // // // // // //         elevation: 1,
// // // // // // // // // // //         shadowColor: '#000',
// // // // // // // // // // //         shadowOffset: { width: 0, height: 1 },
// // // // // // // // // // //         shadowOpacity: 0.05,
// // // // // // // // // // //         shadowRadius: 2,
// // // // // // // // // // //     },
// // // // // // // // // // //     filterButtonText: {
// // // // // // // // // // //         fontSize: 13,
// // // // // // // // // // //         fontWeight: '500',
// // // // // // // // // // //     },
// // // // // // // // // // //     dateButton: {
// // // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // // //         alignItems: 'center',
// // // // // // // // // // //         alignSelf: 'flex-start',
// // // // // // // // // // //         marginHorizontal: 15,
// // // // // // // // // // //         marginTop: 5,
// // // // // // // // // // //         paddingHorizontal: 12,
// // // // // // // // // // //         paddingVertical: 6,
// // // // // // // // // // //         borderRadius: 15,
// // // // // // // // // // //         elevation: 1,
// // // // // // // // // // //         shadowColor: '#000',
// // // // // // // // // // //         shadowOffset: { width: 0, height: 1 },
// // // // // // // // // // //         shadowOpacity: 0.05,
// // // // // // // // // // //         shadowRadius: 2,
// // // // // // // // // // //     },
// // // // // // // // // // //     dateButtonText: {
// // // // // // // // // // //         fontSize: 12,
// // // // // // // // // // //         marginLeft: 5,
// // // // // // // // // // //     },
// // // // // // // // // // //     addNoteContainer: {
// // // // // // // // // // //         padding: 15,
// // // // // // // // // // //         marginHorizontal: 15,
// // // // // // // // // // //         marginBottom: 15,
// // // // // // // // // // //         borderRadius: 12,
// // // // // // // // // // //         elevation: 2,
// // // // // // // // // // //         shadowColor: '#000',
// // // // // // // // // // //         shadowOffset: { width: 0, height: 1 },
// // // // // // // // // // //         shadowOpacity: 0.1,
// // // // // // // // // // //         shadowRadius: 3,
// // // // // // // // // // //     },
// // // // // // // // // // //     addNoteTitle: {
// // // // // // // // // // //         fontSize: 16,
// // // // // // // // // // //         fontWeight: 'bold',
// // // // // // // // // // //         marginBottom: 10,
// // // // // // // // // // //     },
// // // // // // // // // // //     addNoteInputContainer: {
// // // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // // //         alignItems: 'flex-start',
// // // // // // // // // // //     },
// // // // // // // // // // //     addNoteInput: {
// // // // // // // // // // //         flex: 1,
// // // // // // // // // // //         minHeight: 60,
// // // // // // // // // // //         padding: 12,
// // // // // // // // // // //         borderRadius: 8,
// // // // // // // // // // //         fontSize: 14,
// // // // // // // // // // //         marginRight: 10,
// // // // // // // // // // //     },
// // // // // // // // // // //     addNoteButton: {
// // // // // // // // // // //         width: 40,
// // // // // // // // // // //         height: 40,
// // // // // // // // // // //         borderRadius: 20,
// // // // // // // // // // //         justifyContent: 'center',
// // // // // // // // // // //         alignItems: 'center',
// // // // // // // // // // //     },
// // // // // // // // // // //     section: {
// // // // // // // // // // //         paddingHorizontal: 15,
// // // // // // // // // // //         marginBottom: 15,
// // // // // // // // // // //     },
// // // // // // // // // // //     sectionHeader: {
// // // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // // //         justifyContent: 'space-between',
// // // // // // // // // // //         alignItems: 'center',
// // // // // // // // // // //         marginBottom: 15,
// // // // // // // // // // //     },
// // // // // // // // // // //     sectionTitle: {
// // // // // // // // // // //         fontSize: 18,
// // // // // // // // // // //         fontWeight: 'bold',
// // // // // // // // // // //     },
// // // // // // // // // // //     clearFilters: {
// // // // // // // // // // //         fontSize: 13,
// // // // // // // // // // //         fontWeight: '600',
// // // // // // // // // // //     },
// // // // // // // // // // //     loadingContainer: {
// // // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // // //         alignItems: 'center',
// // // // // // // // // // //         justifyContent: 'center',
// // // // // // // // // // //         padding: 20,
// // // // // // // // // // //     },
// // // // // // // // // // //     loadingText: {
// // // // // // // // // // //         fontSize: 14,
// // // // // // // // // // //         marginLeft: 10,
// // // // // // // // // // //     },
// // // // // // // // // // //     entryCard: {
// // // // // // // // // // //         padding: 15,
// // // // // // // // // // //         borderRadius: 10,
// // // // // // // // // // //         marginBottom: 10,
// // // // // // // // // // //         elevation: 1,
// // // // // // // // // // //         shadowColor: '#000',
// // // // // // // // // // //         shadowOffset: { width: 0, height: 1 },
// // // // // // // // // // //         shadowOpacity: 0.05,
// // // // // // // // // // //         shadowRadius: 2,
// // // // // // // // // // //     },
// // // // // // // // // // //     entryHeader: {
// // // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // // //         justifyContent: 'space-between',
// // // // // // // // // // //         alignItems: 'center',
// // // // // // // // // // //         marginBottom: 10,
// // // // // // // // // // //     },
// // // // // // // // // // //     categoryContainer: {
// // // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // // //         alignItems: 'center',
// // // // // // // // // // //     },
// // // // // // // // // // //     categoryIcon: {
// // // // // // // // // // //         marginRight: 5,
// // // // // // // // // // //     },
// // // // // // // // // // //     category: {
// // // // // // // // // // //         fontSize: 14,
// // // // // // // // // // //         fontWeight: '600',
// // // // // // // // // // //     },
// // // // // // // // // // //     priorityBadge: {
// // // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // // //         alignItems: 'center',
// // // // // // // // // // //         paddingHorizontal: 8,
// // // // // // // // // // //         paddingVertical: 4,
// // // // // // // // // // //         borderRadius: 12,
// // // // // // // // // // //     },
// // // // // // // // // // //     priorityDot: {
// // // // // // // // // // //         width: 6,
// // // // // // // // // // //         height: 6,
// // // // // // // // // // //         borderRadius: 3,
// // // // // // // // // // //         marginRight: 4,
// // // // // // // // // // //     },
// // // // // // // // // // //     priorityText: {
// // // // // // // // // // //         fontSize: 10,
// // // // // // // // // // //         fontWeight: '600',
// // // // // // // // // // //         textTransform: 'uppercase',
// // // // // // // // // // //     },
// // // // // // // // // // //     entryContent: {
// // // // // // // // // // //         fontSize: 14,
// // // // // // // // // // //         lineHeight: 20,
// // // // // // // // // // //         marginBottom: 15,
// // // // // // // // // // //     },
// // // // // // // // // // //     entryFooter: {
// // // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // // //         justifyContent: 'space-between',
// // // // // // // // // // //         alignItems: 'center',
// // // // // // // // // // //     },
// // // // // // // // // // //     footerLeft: {
// // // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // // //         alignItems: 'center',
// // // // // // // // // // //     },
// // // // // // // // // // //     subjectBadge: {
// // // // // // // // // // //         paddingHorizontal: 8,
// // // // // // // // // // //         paddingVertical: 4,
// // // // // // // // // // //         backgroundColor: 'rgba(0,0,0,0.05)',
// // // // // // // // // // //         borderRadius: 8,
// // // // // // // // // // //         marginRight: 10,
// // // // // // // // // // //     },
// // // // // // // // // // //     subjectText: {
// // // // // // // // // // //         fontSize: 11,
// // // // // // // // // // //         fontWeight: '500',
// // // // // // // // // // //     },
// // // // // // // // // // //     teacher: {
// // // // // // // // // // //         fontSize: 11,
// // // // // // // // // // //     },
// // // // // // // // // // //     footerRight: {
// // // // // // // // // // //         alignItems: 'flex-end',
// // // // // // // // // // //     },
// // // // // // // // // // //     date: {
// // // // // // // // // // //         fontSize: 11,
// // // // // // // // // // //         marginBottom: 5,
// // // // // // // // // // //     },
// // // // // // // // // // //     entryActions: {
// // // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // // //     },
// // // // // // // // // // //     actionButton: {
// // // // // // // // // // //         marginLeft: 10,
// // // // // // // // // // //         padding: 4,
// // // // // // // // // // //     },
// // // // // // // // // // //     emptyContainer: {
// // // // // // // // // // //         alignItems: 'center',
// // // // // // // // // // //         paddingVertical: 40,
// // // // // // // // // // //     },
// // // // // // // // // // //     emptyText: {
// // // // // // // // // // //         fontSize: 18,
// // // // // // // // // // //         fontWeight: '600',
// // // // // // // // // // //         marginTop: 15,
// // // // // // // // // // //     },
// // // // // // // // // // //     emptySubtext: {
// // // // // // // // // // //         fontSize: 14,
// // // // // // // // // // //         marginTop: 5,
// // // // // // // // // // //         textAlign: 'center',
// // // // // // // // // // //         paddingHorizontal: 40,
// // // // // // // // // // //     },
// // // // // // // // // // //     emptyButton: {
// // // // // // // // // // //         marginTop: 15,
// // // // // // // // // // //         paddingHorizontal: 24,
// // // // // // // // // // //         paddingVertical: 8,
// // // // // // // // // // //         borderRadius: 20,
// // // // // // // // // // //     },
// // // // // // // // // // //     emptyButtonText: {
// // // // // // // // // // //         color: '#FFF',
// // // // // // // // // // //         fontSize: 14,
// // // // // // // // // // //         fontWeight: '600',
// // // // // // // // // // //     },
// // // // // // // // // // //     summaryCard: {
// // // // // // // // // // //         padding: 20,
// // // // // // // // // // //         marginHorizontal: 15,
// // // // // // // // // // //         marginBottom: 20,
// // // // // // // // // // //         borderRadius: 12,
// // // // // // // // // // //         elevation: 2,
// // // // // // // // // // //         shadowColor: '#000',
// // // // // // // // // // //         shadowOffset: { width: 0, height: 1 },
// // // // // // // // // // //         shadowOpacity: 0.1,
// // // // // // // // // // //         shadowRadius: 3,
// // // // // // // // // // //     },
// // // // // // // // // // //     summaryTitle: {
// // // // // // // // // // //         fontSize: 18,
// // // // // // // // // // //         fontWeight: 'bold',
// // // // // // // // // // //         marginBottom: 15,
// // // // // // // // // // //     },
// // // // // // // // // // //     summaryStats: {
// // // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // // //         justifyContent: 'space-between',
// // // // // // // // // // //     },
// // // // // // // // // // //     summaryItem: {
// // // // // // // // // // //         alignItems: 'center',
// // // // // // // // // // //     },
// // // // // // // // // // //     summaryValue: {
// // // // // // // // // // //         fontSize: 20,
// // // // // // // // // // //         fontWeight: 'bold',
// // // // // // // // // // //         marginVertical: 5,
// // // // // // // // // // //     },
// // // // // // // // // // //     summaryLabel: {
// // // // // // // // // // //         fontSize: 12,
// // // // // // // // // // //     },
// // // // // // // // // // // });

// // // // // // // // // // // export default ChildDiaryScreen;
// // // // // // // // // // // src/screens/Parent/ChildDiaryScreen.js
// // // // // // // // // // import React, { useState, useEffect, useCallback, useRef } from 'react';
// // // // // // // // // // import {
// // // // // // // // // //     View,
// // // // // // // // // //     Text,
// // // // // // // // // //     StyleSheet,
// // // // // // // // // //     TouchableOpacity,
// // // // // // // // // //     FlatList,
// // // // // // // // // //     ActivityIndicator,
// // // // // // // // // //     RefreshControl,
// // // // // // // // // //     TextInput,
// // // // // // // // // //     Alert,
// // // // // // // // // //     Modal,
// // // // // // // // // //     Dimensions,
// // // // // // // // // //     SafeAreaView,
// // // // // // // // // //     Animated,
// // // // // // // // // //     Platform,
// // // // // // // // // //     LayoutAnimation,
// // // // // // // // // //     UIManager,
// // // // // // // // // //     Image,
// // // // // // // // // //     ScrollView,
// // // // // // // // // // } from 'react-native';
// // // // // // // // // // import { useSelector } from 'react-redux';
// // // // // // // // // // import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// // // // // // // // // // import { WebView } from 'react-native-webview';
// // // // // // // // // // import { selectThemeData } from '../../store/slices/themeSlice';
// // // // // // // // // // import { useGetChildDiaryQuery } from '../../store/attendanceApi';

// // // // // // // // // // // Enable LayoutAnimation for Android
// // // // // // // // // // if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
// // // // // // // // // //     UIManager.setLayoutAnimationEnabledExperimental(true);
// // // // // // // // // // }

// // // // // // // // // // const { width: SCREEN_WIDTH } = Dimensions.get('window');

// // // // // // // // // // // Skeleton Loader Component
// // // // // // // // // // const SkeletonLoader = ({ theme }) => (
// // // // // // // // // //     <View style={styles.skeletonContainer}>
// // // // // // // // // //         {[1, 2, 3].map((item) => (
// // // // // // // // // //             <View key={item} style={[styles.skeletonCard, { backgroundColor: theme.card }]}>
// // // // // // // // // //                 <View style={styles.skeletonHeader}>
// // // // // // // // // //                     <View style={[styles.skeletonDate, { backgroundColor: theme.border }]} />
// // // // // // // // // //                     <View style={[styles.skeletonBadge, { backgroundColor: theme.border }]} />
// // // // // // // // // //                 </View>
// // // // // // // // // //                 <View style={[styles.skeletonLine, { backgroundColor: theme.border }]} />
// // // // // // // // // //                 <View style={[styles.skeletonLine, { backgroundColor: theme.border, width: '80%' }]} />
// // // // // // // // // //                 <View style={styles.skeletonFooter}>
// // // // // // // // // //                     <View style={[styles.skeletonAvatar, { backgroundColor: theme.border }]} />
// // // // // // // // // //                     <View style={[styles.skeletonText, { backgroundColor: theme.border }]} />
// // // // // // // // // //                 </View>
// // // // // // // // // //             </View>
// // // // // // // // // //         ))}
// // // // // // // // // //     </View>
// // // // // // // // // // );

// // // // // // // // // // // HTML Content Renderer with Auto Height
// // // // // // // // // // const HTMLContentView = ({ htmlContent, theme, onLayout }) => {
// // // // // // // // // //     const [webViewHeight, setWebViewHeight] = useState(100);
// // // // // // // // // //     const webViewRef = useRef(null);

// // // // // // // // // //     const getHTML = (content) => {
// // // // // // // // // //         return `
// // // // // // // // // //             <!DOCTYPE html>
// // // // // // // // // //             <html>
// // // // // // // // // //             <head>
// // // // // // // // // //                 <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
// // // // // // // // // //                 <style>
// // // // // // // // // //                     * { margin: 0; padding: 0; box-sizing: border-box; }
// // // // // // // // // //                     body {
// // // // // // // // // //                         font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
// // // // // // // // // //                         font-size: 15px;
// // // // // // // // // //                         line-height: 1.6;
// // // // // // // // // //                         color: ${theme.isDarkMode ? '#e0e0e0' : '#2c3e50'};
// // // // // // // // // //                         padding: 0;
// // // // // // // // // //                         background: transparent;
// // // // // // // // // //                     }
// // // // // // // // // //                     h1 { font-size: 24px; font-weight: 700; margin: 16px 0 12px 0; color: ${theme.isDarkMode ? '#fff' : '#1a1a2e'}; }
// // // // // // // // // //                     h2 { font-size: 20px; font-weight: 600; margin: 14px 0 10px 0; color: ${theme.isDarkMode ? '#fff' : '#1a1a2e'}; }
// // // // // // // // // //                     h3 { font-size: 18px; font-weight: 600; margin: 12px 0 8px 0; }
// // // // // // // // // //                     p { margin-bottom: 12px; }
// // // // // // // // // //                     strong, b { font-weight: 700; color: ${theme.primary}; }
// // // // // // // // // //                     em, i { font-style: italic; }
// // // // // // // // // //                     ul, ol { margin-bottom: 12px; padding-left: 24px; }
// // // // // // // // // //                     li { margin-bottom: 6px; }
// // // // // // // // // //                     img { 
// // // // // // // // // //                         max-width: 100%; 
// // // // // // // // // //                         height: auto; 
// // // // // // // // // //                         border-radius: 16px; 
// // // // // // // // // //                         margin: 16px 0;
// // // // // // // // // //                         box-shadow: 0 4px 12px rgba(0,0,0,0.1);
// // // // // // // // // //                     }
// // // // // // // // // //                     table {
// // // // // // // // // //                         width: 100%;
// // // // // // // // // //                         border-collapse: collapse;
// // // // // // // // // //                         margin-bottom: 12px;
// // // // // // // // // //                         border-radius: 12px;
// // // // // // // // // //                         overflow: hidden;
// // // // // // // // // //                     }
// // // // // // // // // //                     th, td {
// // // // // // // // // //                         border: 1px solid ${theme.isDarkMode ? '#444' : '#e2e8f0'};
// // // // // // // // // //                         padding: 10px;
// // // // // // // // // //                         text-align: left;
// // // // // // // // // //                     }
// // // // // // // // // //                     th {
// // // // // // // // // //                         background-color: ${theme.isDarkMode ? '#2d3748' : '#f7fafc'};
// // // // // // // // // //                         font-weight: 600;
// // // // // // // // // //                     }
// // // // // // // // // //                     blockquote {
// // // // // // // // // //                         margin: 12px 0;
// // // // // // // // // //                         padding-left: 16px;
// // // // // // // // // //                         border-left: 4px solid ${theme.primary || '#4CAF50'};
// // // // // // // // // //                         color: ${theme.isDarkMode ? '#a0aec0' : '#718096'};
// // // // // // // // // //                         font-style: italic;
// // // // // // // // // //                     }
// // // // // // // // // //                     a {
// // // // // // // // // //                         color: ${theme.primary};
// // // // // // // // // //                         text-decoration: none;
// // // // // // // // // //                     }
// // // // // // // // // //                     .ql-editor { padding: 0; }
// // // // // // // // // //                 </style>
// // // // // // // // // //                 <script>
// // // // // // // // // //                     function updateHeight() {
// // // // // // // // // //                         const height = document.body.scrollHeight;
// // // // // // // // // //                         window.ReactNativeWebView.postMessage(JSON.stringify({
// // // // // // // // // //                             type: 'height',
// // // // // // // // // //                             height: height
// // // // // // // // // //                         }));
// // // // // // // // // //                     }
// // // // // // // // // //                     window.onload = updateHeight;
// // // // // // // // // //                     window.onresize = updateHeight;
// // // // // // // // // //                     setTimeout(updateHeight, 100);
// // // // // // // // // //                 </script>
// // // // // // // // // //             </head>
// // // // // // // // // //             <body>
// // // // // // // // // //                 ${content || '<p style="color: #a0aec0; text-align: center;">✨ No content available</p>'}
// // // // // // // // // //             </body>
// // // // // // // // // //             </html>
// // // // // // // // // //         `;
// // // // // // // // // //     };

// // // // // // // // // //     const handleMessage = (event) => {
// // // // // // // // // //         try {
// // // // // // // // // //             const data = JSON.parse(event.nativeEvent.data);
// // // // // // // // // //             if (data.type === 'height' && data.height) {
// // // // // // // // // //                 const newHeight = Math.max(100, data.height + 20);
// // // // // // // // // //                 setWebViewHeight(newHeight);
// // // // // // // // // //                 onLayout?.(newHeight);
// // // // // // // // // //             }
// // // // // // // // // //         } catch (error) {}
// // // // // // // // // //     };

// // // // // // // // // //     if (!htmlContent || htmlContent === '<p><br></p>' || htmlContent === '<p></p>') {
// // // // // // // // // //         return (
// // // // // // // // // //             <View style={styles.emptyContent}>
// // // // // // // // // //                 <Icon name="file-document-outline" size={32} color="#a0aec0" />
// // // // // // // // // //                 <Text style={[styles.emptyContentText, { color: theme.textSecondary }]}>
// // // // // // // // // //                     No content available
// // // // // // // // // //                 </Text>
// // // // // // // // // //             </View>
// // // // // // // // // //         );
// // // // // // // // // //     }

// // // // // // // // // //     return (
// // // // // // // // // //         <WebView
// // // // // // // // // //             ref={webViewRef}
// // // // // // // // // //             source={{ html: getHTML(htmlContent) }}
// // // // // // // // // //             onMessage={handleMessage}
// // // // // // // // // //             style={[styles.webView, { height: webViewHeight }]}
// // // // // // // // // //             scrollEnabled={false}
// // // // // // // // // //             showsVerticalScrollIndicator={false}
// // // // // // // // // //             originWhitelist={['*']}
// // // // // // // // // //             androidLayerType="software"
// // // // // // // // // //             containerStyle={{ backgroundColor: 'transparent' }}
// // // // // // // // // //         />
// // // // // // // // // //     );
// // // // // // // // // // };

// // // // // // // // // // // Diary Card Component
// // // // // // // // // // const DiaryCard = ({ item, theme, onPress }) => {
// // // // // // // // // //     const scaleAnim = useRef(new Animated.Value(1)).current;
// // // // // // // // // //     const plainTextPreview = item.content?.replace(/<[^>]*>/g, '').substring(0, 100) || 'No preview available';

// // // // // // // // // //     const handlePressIn = () => {
// // // // // // // // // //         Animated.spring(scaleAnim, {
// // // // // // // // // //             toValue: 0.98,
// // // // // // // // // //             useNativeDriver: true,
// // // // // // // // // //             speed: 50,
// // // // // // // // // //         }).start();
// // // // // // // // // //     };

// // // // // // // // // //     const handlePressOut = () => {
// // // // // // // // // //         Animated.spring(scaleAnim, {
// // // // // // // // // //             toValue: 1,
// // // // // // // // // //             useNativeDriver: true,
// // // // // // // // // //             speed: 50,
// // // // // // // // // //         }).start();
// // // // // // // // // //     };

// // // // // // // // // //     const formatDate = (dateString) => {
// // // // // // // // // //         const date = new Date(dateString);
// // // // // // // // // //         return date.toLocaleDateString('en-US', { 
// // // // // // // // // //             month: 'short', 
// // // // // // // // // //             day: 'numeric',
// // // // // // // // // //             year: 'numeric'
// // // // // // // // // //         });
// // // // // // // // // //     };

// // // // // // // // // //     return (
// // // // // // // // // //         <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
// // // // // // // // // //             <TouchableOpacity
// // // // // // // // // //                 activeOpacity={0.9}
// // // // // // // // // //                 onPressIn={handlePressIn}
// // // // // // // // // //                 onPressOut={handlePressOut}
// // // // // // // // // //                 onPress={() => onPress(item)}
// // // // // // // // // //                 style={[styles.entryCard, { backgroundColor: theme.card }]}
// // // // // // // // // //             >
// // // // // // // // // //                 <View style={styles.cardHeader}>
// // // // // // // // // //                     <View style={styles.dateSection}>
// // // // // // // // // //                         <View style={[styles.dateBadge, { backgroundColor: theme.primary + '15' }]}>
// // // // // // // // // //                             <Icon name="calendar-today" size={14} color={theme.primary} />
// // // // // // // // // //                             <Text style={[styles.dateText, { color: theme.text }]}>
// // // // // // // // // //                                 {formatDate(item.date)}
// // // // // // // // // //                             </Text>
// // // // // // // // // //                         </View>
// // // // // // // // // //                         <Text style={[styles.dayText, { color: theme.textSecondary }]}>
// // // // // // // // // //                             {item.day}
// // // // // // // // // //                         </Text>
// // // // // // // // // //                     </View>
// // // // // // // // // //                     <View style={[styles.subjectBadge, { backgroundColor: theme.primary + '15' }]}>
// // // // // // // // // //                         <Icon name="book-open-variant" size={12} color={theme.primary} />
// // // // // // // // // //                         <Text style={[styles.subjectText, { color: theme.primary }]}>
// // // // // // // // // //                             {item.subject}
// // // // // // // // // //                         </Text>
// // // // // // // // // //                     </View>
// // // // // // // // // //                 </View>

// // // // // // // // // //                 <Text style={[styles.previewText, { color: theme.text }]} numberOfLines={2}>
// // // // // // // // // //                     {plainTextPreview}
// // // // // // // // // //                 </Text>

// // // // // // // // // //                 <View style={styles.cardFooter}>
// // // // // // // // // //                     <View style={styles.teacherSection}>
// // // // // // // // // //                         <View style={[styles.teacherAvatar, { backgroundColor: theme.primary + '15' }]}>
// // // // // // // // // //                             <Icon name="account" size={14} color={theme.primary} />
// // // // // // // // // //                         </View>
// // // // // // // // // //                         <Text style={[styles.teacherText, { color: theme.textSecondary }]}>
// // // // // // // // // //                             {item.teacher}
// // // // // // // // // //                         </Text>
// // // // // // // // // //                     </View>
// // // // // // // // // //                     <View style={[
// // // // // // // // // //                         styles.statusBadge,
// // // // // // // // // //                         { backgroundColor: item.isPublished ? theme.success + '15' : theme.warning + '15' }
// // // // // // // // // //                     ]}>
// // // // // // // // // //                         <View style={[
// // // // // // // // // //                             styles.statusDot,
// // // // // // // // // //                             { backgroundColor: item.isPublished ? theme.success : theme.warning }
// // // // // // // // // //                         ]} />
// // // // // // // // // //                         <Text style={[
// // // // // // // // // //                             styles.statusText,
// // // // // // // // // //                             { color: item.isPublished ? theme.success : theme.warning }
// // // // // // // // // //                         ]}>
// // // // // // // // // //                             {item.isPublished ? 'Published' : 'Draft'}
// // // // // // // // // //                         </Text>
// // // // // // // // // //                     </View>
// // // // // // // // // //                 </View>
// // // // // // // // // //             </TouchableOpacity>
// // // // // // // // // //         </Animated.View>
// // // // // // // // // //     );
// // // // // // // // // // };

// // // // // // // // // // // Filter Chip Component
// // // // // // // // // // const FilterChip = ({ label, isActive, onPress, icon, theme }) => (
// // // // // // // // // //     <TouchableOpacity
// // // // // // // // // //         style={[
// // // // // // // // // //             styles.filterChip,
// // // // // // // // // //             { backgroundColor: isActive ? theme.primary : theme.card },
// // // // // // // // // //             isActive && styles.filterChipActive
// // // // // // // // // //         ]}
// // // // // // // // // //         onPress={onPress}
// // // // // // // // // //         activeOpacity={0.7}
// // // // // // // // // //     >
// // // // // // // // // //         {icon && <Icon name={icon} size={16} color={isActive ? '#FFF' : theme.textSecondary} />}
// // // // // // // // // //         <Text style={[
// // // // // // // // // //             styles.filterChipText,
// // // // // // // // // //             { color: isActive ? '#FFF' : theme.text }
// // // // // // // // // //         ]}>
// // // // // // // // // //             {label}
// // // // // // // // // //         </Text>
// // // // // // // // // //     </TouchableOpacity>
// // // // // // // // // // );

// // // // // // // // // // const ChildDiaryScreen = ({ route, navigation }) => {
// // // // // // // // // //     const theme = useSelector(selectThemeData);
// // // // // // // // // //     const { childId, childName, childImage } = route.params;

// // // // // // // // // //     const [refreshing, setRefreshing] = useState(false);
// // // // // // // // // //     const [diaryEntries, setDiaryEntries] = useState([]);
// // // // // // // // // //     const [filteredEntries, setFilteredEntries] = useState([]);
// // // // // // // // // //     const [selectedDate, setSelectedDate] = useState('');
// // // // // // // // // //     const [selectedSubject, setSelectedSubject] = useState('All');
// // // // // // // // // //     const [searchQuery, setSearchQuery] = useState('');
// // // // // // // // // //     const [selectedEntry, setSelectedEntry] = useState(null);
// // // // // // // // // //     const [showDetailModal, setShowDetailModal] = useState(false);
// // // // // // // // // //     const [subjects, setSubjects] = useState([]);
// // // // // // // // // //     const [availableDates, setAvailableDates] = useState([]);
// // // // // // // // // //     const [isSearchFocused, setIsSearchFocused] = useState(false);
// // // // // // // // // //     const [apiFilters, setApiFilters] = useState({
// // // // // // // // // //         month: new Date().getMonth() + 1,
// // // // // // // // // //         year: new Date().getFullYear(),
// // // // // // // // // //     });

// // // // // // // // // //     const fadeAnim = useRef(new Animated.Value(0)).current;

// // // // // // // // // //     const {
// // // // // // // // // //         data: diaryResponse,
// // // // // // // // // //         isLoading,
// // // // // // // // // //         isFetching,
// // // // // // // // // //         error,
// // // // // // // // // //         refetch,
// // // // // // // // // //     } = useGetChildDiaryQuery({
// // // // // // // // // //         childId,
// // // // // // // // // //         filters: {
// // // // // // // // // //             month: apiFilters.month,
// // // // // // // // // //             year: apiFilters.year,
// // // // // // // // // //             date: selectedDate || undefined,
// // // // // // // // // //             subjectId: selectedSubject !== 'All' ? selectedSubject : null,
// // // // // // // // // //         },
// // // // // // // // // //     });

// // // // // // // // // //     useEffect(() => {
// // // // // // // // // //         if (diaryResponse?.success === true && diaryResponse?.data?.entries) {
// // // // // // // // // //             processDiaryData(diaryResponse.data.entries);
// // // // // // // // // //             Animated.timing(fadeAnim, {
// // // // // // // // // //                 toValue: 1,
// // // // // // // // // //                 duration: 500,
// // // // // // // // // //                 useNativeDriver: true,
// // // // // // // // // //             }).start();
// // // // // // // // // //         }
// // // // // // // // // //     }, [diaryResponse]);

// // // // // // // // // //     useEffect(() => {
// // // // // // // // // //         filterEntries();
// // // // // // // // // //     }, [searchQuery, selectedSubject, selectedDate, diaryEntries]);

// // // // // // // // // //     const processDiaryData = (entries) => {
// // // // // // // // // //         const transformedEntries = entries.map(entry => {
// // // // // // // // // //             const dateObj = entry.date ? new Date(entry.date) : new Date();
// // // // // // // // // //             const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
// // // // // // // // // //             const dayName = !isNaN(dateObj.getTime()) ? dayNames[dateObj.getDay()] : '';

// // // // // // // // // //             return {
// // // // // // // // // //                 id: entry.id,
// // // // // // // // // //                 date: entry.date || '',
// // // // // // // // // //                 day: dayName,
// // // // // // // // // //                 subject: entry.subject || 'General',
// // // // // // // // // //                 subjectId: entry.subjectId,
// // // // // // // // // //                 content: entry.content || '',
// // // // // // // // // //                 teacher: entry.teacher || 'Teacher',
// // // // // // // // // //                 isPublished: entry.isPublished || false,
// // // // // // // // // //                 createdAt: entry.createdAt,
// // // // // // // // // //             };
// // // // // // // // // //         });

// // // // // // // // // //         const sortedEntries = transformedEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
        
// // // // // // // // // //         const uniqueSubjects = [...new Map(sortedEntries.map(entry => [
// // // // // // // // // //             entry.subjectId, { id: entry.subjectId, name: entry.subject }
// // // // // // // // // //         ])).values()];
// // // // // // // // // //         setSubjects(uniqueSubjects);
        
// // // // // // // // // //         const uniqueDates = [...new Set(sortedEntries.map(entry => entry.date))];
// // // // // // // // // //         setAvailableDates(uniqueDates);
        
// // // // // // // // // //         setDiaryEntries(sortedEntries);
// // // // // // // // // //         setFilteredEntries(sortedEntries);
// // // // // // // // // //     };

// // // // // // // // // //     const filterEntries = () => {
// // // // // // // // // //         let filtered = [...diaryEntries];
// // // // // // // // // //         if (searchQuery.trim()) {
// // // // // // // // // //             const query = searchQuery.toLowerCase();
// // // // // // // // // //             filtered = filtered.filter(entry =>
// // // // // // // // // //                 entry.subject.toLowerCase().includes(query) ||
// // // // // // // // // //                 entry.teacher.toLowerCase().includes(query) ||
// // // // // // // // // //                 entry.content.toLowerCase().includes(query)
// // // // // // // // // //             );
// // // // // // // // // //         }
// // // // // // // // // //         if (selectedSubject !== 'All') {
// // // // // // // // // //             filtered = filtered.filter(entry => entry.subjectId === selectedSubject);
// // // // // // // // // //         }
// // // // // // // // // //         if (selectedDate) {
// // // // // // // // // //             filtered = filtered.filter(entry => entry.date === selectedDate);
// // // // // // // // // //         }
// // // // // // // // // //         setFilteredEntries(filtered);
// // // // // // // // // //     };

// // // // // // // // // //     const onRefresh = async () => {
// // // // // // // // // //         setRefreshing(true);
// // // // // // // // // //         await refetch();
// // // // // // // // // //         setRefreshing(false);
// // // // // // // // // //     };

// // // // // // // // // //     const handleMonthChange = (offset) => {
// // // // // // // // // //         LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
// // // // // // // // // //         let newMonth = apiFilters.month + offset;
// // // // // // // // // //         let newYear = apiFilters.year;
// // // // // // // // // //         if (newMonth > 12) { newMonth = 1; newYear++; }
// // // // // // // // // //         if (newMonth < 1) { newMonth = 12; newYear--; }
// // // // // // // // // //         setApiFilters({ month: newMonth, year: newYear });
// // // // // // // // // //         setSelectedDate('');
// // // // // // // // // //     };

// // // // // // // // // //     const handleResetFilters = () => {
// // // // // // // // // //         LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
// // // // // // // // // //         setSelectedDate('');
// // // // // // // // // //         setSelectedSubject('All');
// // // // // // // // // //         setSearchQuery('');
// // // // // // // // // //     };

// // // // // // // // // //     const handleEntryPress = (entry) => {
// // // // // // // // // //         setSelectedEntry(entry);
// // // // // // // // // //         setShowDetailModal(true);
// // // // // // // // // //     };

// // // // // // // // // //     const formatFullDate = (dateString) => {
// // // // // // // // // //         const date = new Date(dateString);
// // // // // // // // // //         return date.toLocaleDateString('en-US', {
// // // // // // // // // //             weekday: 'long',
// // // // // // // // // //             year: 'numeric',
// // // // // // // // // //             month: 'long',
// // // // // // // // // //             day: 'numeric',
// // // // // // // // // //         });
// // // // // // // // // //     };

// // // // // // // // // //     const getMonthName = (month) => {
// // // // // // // // // //         return new Date(2000, month - 1, 1).toLocaleString('default', { month: 'long' });
// // // // // // // // // //     };

// // // // // // // // // //     const renderHeader = () => (
// // // // // // // // // //         <View style={[styles.headerGradient, { backgroundColor: theme.primary }]}>
// // // // // // // // // //             <SafeAreaView>
// // // // // // // // // //                 <View style={styles.header}>
// // // // // // // // // //                     <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
// // // // // // // // // //                         <Icon name="arrow-left" size={24} color="#FFF" />
// // // // // // // // // //                     </TouchableOpacity>
// // // // // // // // // //                     <View style={styles.headerContent}>
// // // // // // // // // //                         <Text style={styles.headerTitle}>{childName}'s Diary</Text>
// // // // // // // // // //                         <Text style={styles.headerSubtitle}>School activities & updates</Text>
// // // // // // // // // //                     </View>
// // // // // // // // // //                     <View style={styles.avatarContainer}>
// // // // // // // // // //                         <View style={[styles.avatarPlaceholder, { backgroundColor: '#ffffff30' }]}>
// // // // // // // // // //                             <Icon name="account-child" size={24} color="#FFF" />
// // // // // // // // // //                         </View>
// // // // // // // // // //                     </View>
// // // // // // // // // //                 </View>
// // // // // // // // // //             </SafeAreaView>
// // // // // // // // // //         </View>
// // // // // // // // // //     );

// // // // // // // // // //     const renderSearchBar = () => (
// // // // // // // // // //         <View style={[
// // // // // // // // // //             styles.searchWrapper,
// // // // // // // // // //             isSearchFocused && styles.searchWrapperFocused,
// // // // // // // // // //             { borderColor: theme.border, backgroundColor: theme.card }
// // // // // // // // // //         ]}>
// // // // // // // // // //             <Icon name="magnify" size={20} color={theme.textSecondary} />
// // // // // // // // // //             <TextInput
// // // // // // // // // //                 style={[styles.searchInput, { color: theme.text }]}
// // // // // // // // // //                 placeholder="Search by subject or teacher..."
// // // // // // // // // //                 placeholderTextColor={theme.textSecondary}
// // // // // // // // // //                 value={searchQuery}
// // // // // // // // // //                 onChangeText={setSearchQuery}
// // // // // // // // // //                 onFocus={() => setIsSearchFocused(true)}
// // // // // // // // // //                 onBlur={() => setIsSearchFocused(false)}
// // // // // // // // // //             />
// // // // // // // // // //             {searchQuery !== '' && (
// // // // // // // // // //                 <TouchableOpacity onPress={() => setSearchQuery('')}>
// // // // // // // // // //                     <Icon name="close-circle" size={20} color={theme.textSecondary} />
// // // // // // // // // //                 </TouchableOpacity>
// // // // // // // // // //             )}
// // // // // // // // // //         </View>
// // // // // // // // // //     );

// // // // // // // // // //     const renderFilters = () => (
// // // // // // // // // //         <View style={styles.filtersSection}>
// // // // // // // // // //             <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
// // // // // // // // // //                 <FilterChip
// // // // // // // // // //                     label="All"
// // // // // // // // // //                     isActive={selectedSubject === 'All'}
// // // // // // // // // //                     onPress={() => setSelectedSubject('All')}
// // // // // // // // // //                     theme={theme}
// // // // // // // // // //                 />
// // // // // // // // // //                 {subjects.map(subject => (
// // // // // // // // // //                     <FilterChip
// // // // // // // // // //                         key={subject.id}
// // // // // // // // // //                         label={subject.name}
// // // // // // // // // //                         isActive={selectedSubject === subject.id}
// // // // // // // // // //                         onPress={() => setSelectedSubject(subject.id)}
// // // // // // // // // //                         theme={theme}
// // // // // // // // // //                     />
// // // // // // // // // //                 ))}
// // // // // // // // // //                 {availableDates.length > 0 && (
// // // // // // // // // //                     <FilterChip
// // // // // // // // // //                         label={selectedDate ? formatFullDate(selectedDate).split(',')[0] : "Date"}
// // // // // // // // // //                         isActive={!!selectedDate}
// // // // // // // // // //                         onPress={() => {
// // // // // // // // // //                             Alert.alert('Filter by Date', 'Select a date', [
// // // // // // // // // //                                 { text: 'All Dates', onPress: () => setSelectedDate('') },
// // // // // // // // // //                                 ...availableDates.map(date => ({
// // // // // // // // // //                                     text: formatFullDate(date).split(',')[0],
// // // // // // // // // //                                     onPress: () => setSelectedDate(date)
// // // // // // // // // //                                 })),
// // // // // // // // // //                                 { text: 'Cancel', style: 'cancel' }
// // // // // // // // // //                             ]);
// // // // // // // // // //                         }}
// // // // // // // // // //                         icon="calendar"
// // // // // // // // // //                         theme={theme}
// // // // // // // // // //                     />
// // // // // // // // // //                 )}
// // // // // // // // // //             </ScrollView>
// // // // // // // // // //         </View>
// // // // // // // // // //     );

// // // // // // // // // //     const renderMonthNavigator = () => (
// // // // // // // // // //         <View style={[styles.monthNav, { backgroundColor: theme.card }]}>
// // // // // // // // // //             <TouchableOpacity onPress={() => handleMonthChange(-1)} style={styles.monthNavButton}>
// // // // // // // // // //                 <Icon name="chevron-left" size={24} color={theme.primary} />
// // // // // // // // // //             </TouchableOpacity>
// // // // // // // // // //             <View style={styles.monthDisplay}>
// // // // // // // // // //                 <Text style={[styles.monthText, { color: theme.text }]}>
// // // // // // // // // //                     {getMonthName(apiFilters.month)} {apiFilters.year}
// // // // // // // // // //                 </Text>
// // // // // // // // // //                 <Text style={[styles.entryCount, { color: theme.textSecondary }]}>
// // // // // // // // // //                     {filteredEntries.length} entries
// // // // // // // // // //                 </Text>
// // // // // // // // // //             </View>
// // // // // // // // // //             <TouchableOpacity onPress={() => handleMonthChange(1)} style={styles.monthNavButton}>
// // // // // // // // // //                 <Icon name="chevron-right" size={24} color={theme.primary} />
// // // // // // // // // //             </TouchableOpacity>
// // // // // // // // // //         </View>
// // // // // // // // // //     );

// // // // // // // // // //     const renderEmptyState = () => (
// // // // // // // // // //         <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
// // // // // // // // // //             <View style={[styles.emptyIconContainer, { backgroundColor: theme.primary + '10' }]}>
// // // // // // // // // //                 <Icon name="notebook-edit-outline" size={64} color={theme.primary} />
// // // // // // // // // //             </View>
// // // // // // // // // //             <Text style={[styles.emptyTitle, { color: theme.text }]}>
// // // // // // // // // //                 {searchQuery || selectedDate || selectedSubject !== 'All' 
// // // // // // // // // //                     ? 'No matching entries' 
// // // // // // // // // //                     : 'No diary entries yet'}
// // // // // // // // // //             </Text>
// // // // // // // // // //             <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
// // // // // // // // // //                 {searchQuery || selectedDate || selectedSubject !== 'All'
// // // // // // // // // //                     ? 'Try adjusting your filters to see more results'
// // // // // // // // // //                     : `No entries found for ${getMonthName(apiFilters.month)} ${apiFilters.year}`}
// // // // // // // // // //             </Text>
// // // // // // // // // //             {(searchQuery || selectedDate || selectedSubject !== 'All') && (
// // // // // // // // // //                 <TouchableOpacity style={[styles.emptyButton, { backgroundColor: theme.primary }]} onPress={handleResetFilters}>
// // // // // // // // // //                     <Text style={styles.emptyButtonText}>Clear Filters</Text>
// // // // // // // // // //                 </TouchableOpacity>
// // // // // // // // // //             )}
// // // // // // // // // //         </Animated.View>
// // // // // // // // // //     );

// // // // // // // // // //     const renderDetailModal = () => (
// // // // // // // // // //         <Modal
// // // // // // // // // //             visible={showDetailModal}
// // // // // // // // // //             animationType="slide"
// // // // // // // // // //             transparent={false}
// // // // // // // // // //             onRequestClose={() => setShowDetailModal(false)}
// // // // // // // // // //         >
// // // // // // // // // //             <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.background }]}>
// // // // // // // // // //                 <View style={[styles.modalHeader, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
// // // // // // // // // //                     <TouchableOpacity onPress={() => setShowDetailModal(false)} style={styles.modalBackButton}>
// // // // // // // // // //                         <Icon name="arrow-left" size={24} color={theme.text} />
// // // // // // // // // //                     </TouchableOpacity>
// // // // // // // // // //                     <Text style={[styles.modalTitle, { color: theme.text }]}>Diary Entry</Text>
// // // // // // // // // //                     <View style={{ width: 40 }} />
// // // // // // // // // //                 </View>
// // // // // // // // // //                 {selectedEntry && (
// // // // // // // // // //                     <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
// // // // // // // // // //                         <View style={[styles.detailCard, { backgroundColor: theme.card }]}>
// // // // // // // // // //                             <View style={styles.detailHeader}>
// // // // // // // // // //                                 <View style={styles.detailDateSection}>
// // // // // // // // // //                                     <Icon name="calendar" size={20} color={theme.primary} />
// // // // // // // // // //                                     <Text style={[styles.detailDate, { color: theme.text }]}>
// // // // // // // // // //                                         {formatFullDate(selectedEntry.date)}
// // // // // // // // // //                                     </Text>
// // // // // // // // // //                                 </View>
// // // // // // // // // //                                 <View style={styles.detailBadges}>
// // // // // // // // // //                                     <View style={[styles.detailSubjectBadge, { backgroundColor: theme.primary + '15' }]}>
// // // // // // // // // //                                         <Icon name="book-open-variant" size={14} color={theme.primary} />
// // // // // // // // // //                                         <Text style={[styles.detailSubject, { color: theme.primary }]}>
// // // // // // // // // //                                             {selectedEntry.subject}
// // // // // // // // // //                                         </Text>
// // // // // // // // // //                                     </View>
// // // // // // // // // //                                     <View style={[styles.detailStatusBadge, { 
// // // // // // // // // //                                         backgroundColor: selectedEntry.isPublished ? theme.success + '15' : theme.warning + '15' 
// // // // // // // // // //                                     }]}>
// // // // // // // // // //                                         <View style={[styles.statusDot, { 
// // // // // // // // // //                                             backgroundColor: selectedEntry.isPublished ? theme.success : theme.warning 
// // // // // // // // // //                                         }]} />
// // // // // // // // // //                                         <Text style={[styles.detailStatus, { 
// // // // // // // // // //                                             color: selectedEntry.isPublished ? theme.success : theme.warning 
// // // // // // // // // //                                         }]}>
// // // // // // // // // //                                             {selectedEntry.isPublished ? 'Published' : 'Draft'}
// // // // // // // // // //                                         </Text>
// // // // // // // // // //                                     </View>
// // // // // // // // // //                                 </View>
// // // // // // // // // //                             </View>

// // // // // // // // // //                             <View style={styles.detailTeacherSection}>
// // // // // // // // // //                                 <View style={[styles.detailTeacherAvatar, { backgroundColor: theme.primary + '15' }]}>
// // // // // // // // // //                                     <Icon name="account" size={20} color={theme.primary} />
// // // // // // // // // //                                 </View>
// // // // // // // // // //                                 <View>
// // // // // // // // // //                                     <Text style={[styles.detailTeacherLabel, { color: theme.textSecondary }]}>Teacher</Text>
// // // // // // // // // //                                     <Text style={[styles.detailTeacher, { color: theme.text }]}>{selectedEntry.teacher}</Text>
// // // // // // // // // //                                 </View>
// // // // // // // // // //                             </View>

// // // // // // // // // //                             <View style={styles.divider} />

// // // // // // // // // //                             <View style={styles.detailContentSection}>
// // // // // // // // // //                                 <Text style={[styles.detailContentTitle, { color: theme.text }]}>Content</Text>
// // // // // // // // // //                                 <HTMLContentView 
// // // // // // // // // //                                     htmlContent={selectedEntry.content} 
// // // // // // // // // //                                     theme={theme}
// // // // // // // // // //                                 />
// // // // // // // // // //                             </View>
// // // // // // // // // //                         </View>
// // // // // // // // // //                     </ScrollView>
// // // // // // // // // //                 )}
// // // // // // // // // //             </SafeAreaView>
// // // // // // // // // //         </Modal>
// // // // // // // // // //     );

// // // // // // // // // //     if (error) {
// // // // // // // // // //         return (
// // // // // // // // // //             <View style={[styles.container, { backgroundColor: theme.background }]}>
// // // // // // // // // //                 <View style={styles.errorContainer}>
// // // // // // // // // //                     <View style={[styles.errorIconContainer, { backgroundColor: theme.error + '10' }]}>
// // // // // // // // // //                         <Icon name="wifi-off" size={60} color={theme.error} />
// // // // // // // // // //                     </View>
// // // // // // // // // //                     <Text style={[styles.errorText, { color: theme.text }]}>Connection Error</Text>
// // // // // // // // // //                     <Text style={[styles.errorSubtext, { color: theme.textSecondary }]}>
// // // // // // // // // //                         Unable to connect to the server. Please check your internet connection.
// // // // // // // // // //                     </Text>
// // // // // // // // // //                     <TouchableOpacity style={[styles.retryButton, { backgroundColor: theme.primary }]} onPress={() => refetch()}>
// // // // // // // // // //                         <Text style={styles.retryButtonText}>Try Again</Text>
// // // // // // // // // //                     </TouchableOpacity>
// // // // // // // // // //                 </View>
// // // // // // // // // //             </View>
// // // // // // // // // //         );
// // // // // // // // // //     }

// // // // // // // // // //     return (
// // // // // // // // // //         <View style={[styles.container, { backgroundColor: theme.background }]}>
// // // // // // // // // //             {renderHeader()}
            
// // // // // // // // // //             <View style={styles.contentContainer}>
// // // // // // // // // //                 {renderSearchBar()}
// // // // // // // // // //                 {renderFilters()}
// // // // // // // // // //                 {renderMonthNavigator()}

// // // // // // // // // //                 {(isLoading || isFetching) && !refreshing ? (
// // // // // // // // // //                     <SkeletonLoader theme={theme} />
// // // // // // // // // //                 ) : (
// // // // // // // // // //                     <FlatList
// // // // // // // // // //                         data={filteredEntries}
// // // // // // // // // //                         renderItem={({ item }) => (
// // // // // // // // // //                             <DiaryCard
// // // // // // // // // //                                 item={item}
// // // // // // // // // //                                 theme={theme}
// // // // // // // // // //                                 onPress={handleEntryPress}
// // // // // // // // // //                             />
// // // // // // // // // //                         )}
// // // // // // // // // //                         keyExtractor={(item) => item.id?.toString()}
// // // // // // // // // //                         contentContainerStyle={styles.listContent}
// // // // // // // // // //                         refreshControl={
// // // // // // // // // //                             <RefreshControl
// // // // // // // // // //                                 refreshing={refreshing}
// // // // // // // // // //                                 onRefresh={onRefresh}
// // // // // // // // // //                                 colors={[theme.primary]}
// // // // // // // // // //                                 tintColor={theme.primary}
// // // // // // // // // //                             />
// // // // // // // // // //                         }
// // // // // // // // // //                         ListEmptyComponent={renderEmptyState()}
// // // // // // // // // //                         showsVerticalScrollIndicator={false}
// // // // // // // // // //                     />
// // // // // // // // // //                 )}
// // // // // // // // // //             </View>

// // // // // // // // // //             {renderDetailModal()}
// // // // // // // // // //         </View>
// // // // // // // // // //     );
// // // // // // // // // // };

// // // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // // //     container: {
// // // // // // // // // //         flex: 1,
// // // // // // // // // //     },
// // // // // // // // // //     headerGradient: {
// // // // // // // // // //         borderBottomLeftRadius: 24,
// // // // // // // // // //         borderBottomRightRadius: 24,
// // // // // // // // // //         paddingBottom: 20,
// // // // // // // // // //     },
// // // // // // // // // //     header: {
// // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // //         alignItems: 'center',
// // // // // // // // // //         paddingHorizontal: 20,
// // // // // // // // // //         paddingTop: Platform.OS === 'ios' ? 10 : 20,
// // // // // // // // // //     },
// // // // // // // // // //     backButton: {
// // // // // // // // // //         width: 40,
// // // // // // // // // //         height: 40,
// // // // // // // // // //         justifyContent: 'center',
// // // // // // // // // //         alignItems: 'center',
// // // // // // // // // //     },
// // // // // // // // // //     headerContent: {
// // // // // // // // // //         flex: 1,
// // // // // // // // // //         marginLeft: 12,
// // // // // // // // // //     },
// // // // // // // // // //     headerTitle: {
// // // // // // // // // //         fontSize: 20,
// // // // // // // // // //         fontWeight: '700',
// // // // // // // // // //         color: '#FFF',
// // // // // // // // // //     },
// // // // // // // // // //     headerSubtitle: {
// // // // // // // // // //         fontSize: 13,
// // // // // // // // // //         color: '#FFFFFFCC',
// // // // // // // // // //         marginTop: 2,
// // // // // // // // // //     },
// // // // // // // // // //     avatarContainer: {
// // // // // // // // // //         width: 44,
// // // // // // // // // //         height: 44,
// // // // // // // // // //     },
// // // // // // // // // //     avatarPlaceholder: {
// // // // // // // // // //         width: 44,
// // // // // // // // // //         height: 44,
// // // // // // // // // //         borderRadius: 22,
// // // // // // // // // //         justifyContent: 'center',
// // // // // // // // // //         alignItems: 'center',
// // // // // // // // // //         borderWidth: 2,
// // // // // // // // // //         borderColor: '#FFF',
// // // // // // // // // //     },
// // // // // // // // // //     contentContainer: {
// // // // // // // // // //         flex: 1,
// // // // // // // // // //         paddingTop: 16,
// // // // // // // // // //     },
// // // // // // // // // //     searchWrapper: {
// // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // //         alignItems: 'center',
// // // // // // // // // //         marginHorizontal: 16,
// // // // // // // // // //         marginBottom: 12,
// // // // // // // // // //         paddingHorizontal: 16,
// // // // // // // // // //         paddingVertical: 12,
// // // // // // // // // //         borderRadius: 16,
// // // // // // // // // //         borderWidth: 1,
// // // // // // // // // //     },
// // // // // // // // // //     searchWrapperFocused: {
// // // // // // // // // //         borderWidth: 2,
// // // // // // // // // //     },
// // // // // // // // // //     searchInput: {
// // // // // // // // // //         flex: 1,
// // // // // // // // // //         fontSize: 16,
// // // // // // // // // //         marginLeft: 12,
// // // // // // // // // //         paddingVertical: 0,
// // // // // // // // // //     },
// // // // // // // // // //     filtersSection: {
// // // // // // // // // //         marginBottom: 12,
// // // // // // // // // //     },
// // // // // // // // // //     filtersScroll: {
// // // // // // // // // //         paddingHorizontal: 16,
// // // // // // // // // //     },
// // // // // // // // // //     filterChip: {
// // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // //         alignItems: 'center',
// // // // // // // // // //         paddingHorizontal: 16,
// // // // // // // // // //         paddingVertical: 8,
// // // // // // // // // //         borderRadius: 24,
// // // // // // // // // //         marginRight: 8,
// // // // // // // // // //         gap: 6,
// // // // // // // // // //         shadowColor: '#000',
// // // // // // // // // //         shadowOffset: { width: 0, height: 2 },
// // // // // // // // // //         shadowOpacity: 0.05,
// // // // // // // // // //         shadowRadius: 4,
// // // // // // // // // //         elevation: 2,
// // // // // // // // // //     },
// // // // // // // // // //     filterChipActive: {
// // // // // // // // // //         shadowOpacity: 0.2,
// // // // // // // // // //         shadowRadius: 6,
// // // // // // // // // //     },
// // // // // // // // // //     filterChipText: {
// // // // // // // // // //         fontSize: 14,
// // // // // // // // // //         fontWeight: '500',
// // // // // // // // // //     },
// // // // // // // // // //     monthNav: {
// // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // //         justifyContent: 'space-between',
// // // // // // // // // //         alignItems: 'center',
// // // // // // // // // //         marginHorizontal: 16,
// // // // // // // // // //         marginBottom: 16,
// // // // // // // // // //         paddingHorizontal: 16,
// // // // // // // // // //         paddingVertical: 14,
// // // // // // // // // //         borderRadius: 16,
// // // // // // // // // //         shadowColor: '#000',
// // // // // // // // // //         shadowOffset: { width: 0, height: 2 },
// // // // // // // // // //         shadowOpacity: 0.05,
// // // // // // // // // //         shadowRadius: 4,
// // // // // // // // // //         elevation: 2,
// // // // // // // // // //     },
// // // // // // // // // //     monthNavButton: {
// // // // // // // // // //         width: 40,
// // // // // // // // // //         height: 40,
// // // // // // // // // //         justifyContent: 'center',
// // // // // // // // // //         alignItems: 'center',
// // // // // // // // // //         borderRadius: 20,
// // // // // // // // // //     },
// // // // // // // // // //     monthDisplay: {
// // // // // // // // // //         alignItems: 'center',
// // // // // // // // // //     },
// // // // // // // // // //     monthText: {
// // // // // // // // // //         fontSize: 16,
// // // // // // // // // //         fontWeight: '600',
// // // // // // // // // //     },
// // // // // // // // // //     entryCount: {
// // // // // // // // // //         fontSize: 12,
// // // // // // // // // //         marginTop: 2,
// // // // // // // // // //     },
// // // // // // // // // //     listContent: {
// // // // // // // // // //         paddingHorizontal: 16,
// // // // // // // // // //         paddingBottom: 20,
// // // // // // // // // //     },
// // // // // // // // // //     entryCard: {
// // // // // // // // // //         padding: 16,
// // // // // // // // // //         borderRadius: 20,
// // // // // // // // // //         marginBottom: 12,
// // // // // // // // // //         shadowColor: '#000',
// // // // // // // // // //         shadowOffset: { width: 0, height: 4 },
// // // // // // // // // //         shadowOpacity: 0.08,
// // // // // // // // // //         shadowRadius: 8,
// // // // // // // // // //         elevation: 4,
// // // // // // // // // //     },
// // // // // // // // // //     cardHeader: {
// // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // //         justifyContent: 'space-between',
// // // // // // // // // //         alignItems: 'center',
// // // // // // // // // //         marginBottom: 12,
// // // // // // // // // //     },
// // // // // // // // // //     dateSection: {
// // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // //         alignItems: 'center',
// // // // // // // // // //         gap: 8,
// // // // // // // // // //     },
// // // // // // // // // //     dateBadge: {
// // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // //         alignItems: 'center',
// // // // // // // // // //         paddingHorizontal: 10,
// // // // // // // // // //         paddingVertical: 4,
// // // // // // // // // //         borderRadius: 12,
// // // // // // // // // //         gap: 4,
// // // // // // // // // //     },
// // // // // // // // // //     dateText: {
// // // // // // // // // //         fontSize: 12,
// // // // // // // // // //         fontWeight: '500',
// // // // // // // // // //     },
// // // // // // // // // //     dayText: {
// // // // // // // // // //         fontSize: 12,
// // // // // // // // // //     },
// // // // // // // // // //     subjectBadge: {
// // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // //         alignItems: 'center',
// // // // // // // // // //         paddingHorizontal: 10,
// // // // // // // // // //         paddingVertical: 4,
// // // // // // // // // //         borderRadius: 12,
// // // // // // // // // //         gap: 4,
// // // // // // // // // //     },
// // // // // // // // // //     subjectText: {
// // // // // // // // // //         fontSize: 11,
// // // // // // // // // //         fontWeight: '600',
// // // // // // // // // //     },
// // // // // // // // // //     previewText: {
// // // // // // // // // //         fontSize: 14,
// // // // // // // // // //         lineHeight: 20,
// // // // // // // // // //         marginBottom: 12,
// // // // // // // // // //     },
// // // // // // // // // //     cardFooter: {
// // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // //         justifyContent: 'space-between',
// // // // // // // // // //         alignItems: 'center',
// // // // // // // // // //     },
// // // // // // // // // //     teacherSection: {
// // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // //         alignItems: 'center',
// // // // // // // // // //         gap: 8,
// // // // // // // // // //     },
// // // // // // // // // //     teacherAvatar: {
// // // // // // // // // //         width: 28,
// // // // // // // // // //         height: 28,
// // // // // // // // // //         borderRadius: 14,
// // // // // // // // // //         justifyContent: 'center',
// // // // // // // // // //         alignItems: 'center',
// // // // // // // // // //     },
// // // // // // // // // //     teacherText: {
// // // // // // // // // //         fontSize: 12,
// // // // // // // // // //     },
// // // // // // // // // //     statusBadge: {
// // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // //         alignItems: 'center',
// // // // // // // // // //         paddingHorizontal: 10,
// // // // // // // // // //         paddingVertical: 4,
// // // // // // // // // //         borderRadius: 12,
// // // // // // // // // //         gap: 6,
// // // // // // // // // //     },
// // // // // // // // // //     statusDot: {
// // // // // // // // // //         width: 6,
// // // // // // // // // //         height: 6,
// // // // // // // // // //         borderRadius: 3,
// // // // // // // // // //     },
// // // // // // // // // //     statusText: {
// // // // // // // // // //         fontSize: 11,
// // // // // // // // // //         fontWeight: '600',
// // // // // // // // // //     },
// // // // // // // // // //     skeletonContainer: {
// // // // // // // // // //         paddingHorizontal: 16,
// // // // // // // // // //     },
// // // // // // // // // //     skeletonCard: {
// // // // // // // // // //         padding: 16,
// // // // // // // // // //         borderRadius: 20,
// // // // // // // // // //         marginBottom: 12,
// // // // // // // // // //     },
// // // // // // // // // //     skeletonHeader: {
// // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // //         justifyContent: 'space-between',
// // // // // // // // // //         marginBottom: 12,
// // // // // // // // // //     },
// // // // // // // // // //     skeletonDate: {
// // // // // // // // // //         width: 100,
// // // // // // // // // //         height: 24,
// // // // // // // // // //         borderRadius: 12,
// // // // // // // // // //     },
// // // // // // // // // //     skeletonBadge: {
// // // // // // // // // //         width: 60,
// // // // // // // // // //         height: 24,
// // // // // // // // // //         borderRadius: 12,
// // // // // // // // // //     },
// // // // // // // // // //     skeletonLine: {
// // // // // // // // // //         height: 16,
// // // // // // // // // //         borderRadius: 8,
// // // // // // // // // //         marginBottom: 8,
// // // // // // // // // //     },
// // // // // // // // // //     skeletonFooter: {
// // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // //         alignItems: 'center',
// // // // // // // // // //         marginTop: 8,
// // // // // // // // // //         gap: 8,
// // // // // // // // // //     },
// // // // // // // // // //     skeletonAvatar: {
// // // // // // // // // //         width: 28,
// // // // // // // // // //         height: 28,
// // // // // // // // // //         borderRadius: 14,
// // // // // // // // // //     },
// // // // // // // // // //     skeletonText: {
// // // // // // // // // //         width: 100,
// // // // // // // // // //         height: 14,
// // // // // // // // // //         borderRadius: 7,
// // // // // // // // // //     },
// // // // // // // // // //     emptyContainer: {
// // // // // // // // // //         alignItems: 'center',
// // // // // // // // // //         paddingVertical: 60,
// // // // // // // // // //     },
// // // // // // // // // //     emptyIconContainer: {
// // // // // // // // // //         width: 120,
// // // // // // // // // //         height: 120,
// // // // // // // // // //         borderRadius: 60,
// // // // // // // // // //         justifyContent: 'center',
// // // // // // // // // //         alignItems: 'center',
// // // // // // // // // //         marginBottom: 24,
// // // // // // // // // //     },
// // // // // // // // // //     emptyTitle: {
// // // // // // // // // //         fontSize: 18,
// // // // // // // // // //         fontWeight: '600',
// // // // // // // // // //         marginBottom: 8,
// // // // // // // // // //     },
// // // // // // // // // //     emptySubtitle: {
// // // // // // // // // //         fontSize: 14,
// // // // // // // // // //         textAlign: 'center',
// // // // // // // // // //         paddingHorizontal: 40,
// // // // // // // // // //         marginBottom: 24,
// // // // // // // // // //     },
// // // // // // // // // //     emptyButton: {
// // // // // // // // // //         paddingHorizontal: 32,
// // // // // // // // // //         paddingVertical: 12,
// // // // // // // // // //         borderRadius: 25,
// // // // // // // // // //     },
// // // // // // // // // //     emptyButtonText: {
// // // // // // // // // //         color: '#FFF',
// // // // // // // // // //         fontSize: 14,
// // // // // // // // // //         fontWeight: '600',
// // // // // // // // // //     },
// // // // // // // // // //     errorContainer: {
// // // // // // // // // //         flex: 1,
// // // // // // // // // //         justifyContent: 'center',
// // // // // // // // // //         alignItems: 'center',
// // // // // // // // // //         padding: 24,
// // // // // // // // // //     },
// // // // // // // // // //     errorIconContainer: {
// // // // // // // // // //         width: 100,
// // // // // // // // // //         height: 100,
// // // // // // // // // //         borderRadius: 50,
// // // // // // // // // //         justifyContent: 'center',
// // // // // // // // // //         alignItems: 'center',
// // // // // // // // // //         marginBottom: 24,
// // // // // // // // // //     },
// // // // // // // // // //     errorText: {
// // // // // // // // // //         fontSize: 20,
// // // // // // // // // //         fontWeight: 'bold',
// // // // // // // // // //         marginBottom: 8,
// // // // // // // // // //     },
// // // // // // // // // //     errorSubtext: {
// // // // // // // // // //         fontSize: 14,
// // // // // // // // // //         textAlign: 'center',
// // // // // // // // // //         lineHeight: 20,
// // // // // // // // // //         marginBottom: 24,
// // // // // // // // // //     },
// // // // // // // // // //     retryButton: {
// // // // // // // // // //         paddingHorizontal: 32,
// // // // // // // // // //         paddingVertical: 12,
// // // // // // // // // //         borderRadius: 25,
// // // // // // // // // //     },
// // // // // // // // // //     retryButtonText: {
// // // // // // // // // //         color: '#FFF',
// // // // // // // // // //         fontSize: 16,
// // // // // // // // // //         fontWeight: '600',
// // // // // // // // // //     },
// // // // // // // // // //     modalContainer: {
// // // // // // // // // //         flex: 1,
// // // // // // // // // //     },
// // // // // // // // // //     modalHeader: {
// // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // //         alignItems: 'center',
// // // // // // // // // //         justifyContent: 'space-between',
// // // // // // // // // //         paddingHorizontal: 16,
// // // // // // // // // //         paddingVertical: 14,
// // // // // // // // // //         borderBottomWidth: 1,
// // // // // // // // // //     },
// // // // // // // // // //     modalBackButton: {
// // // // // // // // // //         width: 40,
// // // // // // // // // //         height: 40,
// // // // // // // // // //         justifyContent: 'center',
// // // // // // // // // //         alignItems: 'center',
// // // // // // // // // //     },
// // // // // // // // // //     modalTitle: {
// // // // // // // // // //         fontSize: 18,
// // // // // // // // // //         fontWeight: '600',
// // // // // // // // // //     },
// // // // // // // // // //     modalContent: {
// // // // // // // // // //         flex: 1,
// // // // // // // // // //         padding: 16,
// // // // // // // // // //     },
// // // // // // // // // //     detailCard: {
// // // // // // // // // //         borderRadius: 24,
// // // // // // // // // //         padding: 20,
// // // // // // // // // //         marginBottom: 16,
// // // // // // // // // //         shadowColor: '#000',
// // // // // // // // // //         shadowOffset: { width: 0, height: 4 },
// // // // // // // // // //         shadowOpacity: 0.1,
// // // // // // // // // //         shadowRadius: 12,
// // // // // // // // // //         elevation: 6,
// // // // // // // // // //     },
// // // // // // // // // //     detailHeader: {
// // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // //         justifyContent: 'space-between',
// // // // // // // // // //         alignItems: 'center',
// // // // // // // // // //         marginBottom: 20,
// // // // // // // // // //         flexWrap: 'wrap',
// // // // // // // // // //         gap: 12,
// // // // // // // // // //     },
// // // // // // // // // //     detailDateSection: {
// // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // //         alignItems: 'center',
// // // // // // // // // //         gap: 8,
// // // // // // // // // //     },
// // // // // // // // // //     detailDate: {
// // // // // // // // // //         fontSize: 14,
// // // // // // // // // //         fontWeight: '500',
// // // // // // // // // //     },
// // // // // // // // // //     detailBadges: {
// // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // //         gap: 8,
// // // // // // // // // //     },
// // // // // // // // // //     detailSubjectBadge: {
// // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // //         alignItems: 'center',
// // // // // // // // // //         paddingHorizontal: 12,
// // // // // // // // // //         paddingVertical: 6,
// // // // // // // // // //         borderRadius: 20,
// // // // // // // // // //         gap: 6,
// // // // // // // // // //     },
// // // // // // // // // //     detailSubject: {
// // // // // // // // // //         fontSize: 13,
// // // // // // // // // //         fontWeight: '600',
// // // // // // // // // //     },
// // // // // // // // // //     detailStatusBadge: {
// // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // //         alignItems: 'center',
// // // // // // // // // //         paddingHorizontal: 10,
// // // // // // // // // //         paddingVertical: 4,
// // // // // // // // // //         borderRadius: 12,
// // // // // // // // // //         gap: 6,
// // // // // // // // // //     },
// // // // // // // // // //     detailStatus: {
// // // // // // // // // //         fontSize: 11,
// // // // // // // // // //         fontWeight: '600',
// // // // // // // // // //     },
// // // // // // // // // //     detailTeacherSection: {
// // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // //         alignItems: 'center',
// // // // // // // // // //         gap: 12,
// // // // // // // // // //         marginBottom: 20,
// // // // // // // // // //     },
// // // // // // // // // //     detailTeacherAvatar: {
// // // // // // // // // //         width: 48,
// // // // // // // // // //         height: 48,
// // // // // // // // // //         borderRadius: 24,
// // // // // // // // // //         justifyContent: 'center',
// // // // // // // // // //         alignItems: 'center',
// // // // // // // // // //     },
// // // // // // // // // //     detailTeacherLabel: {
// // // // // // // // // //         fontSize: 12,
// // // // // // // // // //         marginBottom: 2,
// // // // // // // // // //     },
// // // // // // // // // //     detailTeacher: {
// // // // // // // // // //         fontSize: 16,
// // // // // // // // // //         fontWeight: '500',
// // // // // // // // // //     },
// // // // // // // // // //     divider: {
// // // // // // // // // //         height: 1,
// // // // // // // // // //         backgroundColor: '#e2e8f0',
// // // // // // // // // //         marginVertical: 16,
// // // // // // // // // //     },
// // // // // // // // // //     detailContentSection: {
// // // // // // // // // //         marginTop: 8,
// // // // // // // // // //     },
// // // // // // // // // //     detailContentTitle: {
// // // // // // // // // //         fontSize: 16,
// // // // // // // // // //         fontWeight: '600',
// // // // // // // // // //         marginBottom: 12,
// // // // // // // // // //     },
// // // // // // // // // //     webView: {
// // // // // // // // // //         backgroundColor: 'transparent',
// // // // // // // // // //     },
// // // // // // // // // //     emptyContent: {
// // // // // // // // // //         justifyContent: 'center',
// // // // // // // // // //         alignItems: 'center',
// // // // // // // // // //         padding: 40,
// // // // // // // // // //     },
// // // // // // // // // //     emptyContentText: {
// // // // // // // // // //         fontSize: 14,
// // // // // // // // // //         marginTop: 8,
// // // // // // // // // //     },
// // // // // // // // // // });

// // // // // // // // // // export default ChildDiaryScreen;
// // // // // // // // // // src/screens/Parent/ChildDiaryScreen.js
// // // // // // // // // import React, { useState, useEffect, useCallback, useRef } from 'react';
// // // // // // // // // import {
// // // // // // // // //     View,
// // // // // // // // //     Text,
// // // // // // // // //     StyleSheet,
// // // // // // // // //     TouchableOpacity,
// // // // // // // // //     FlatList,
// // // // // // // // //     ActivityIndicator,
// // // // // // // // //     RefreshControl,
// // // // // // // // //     TextInput,
// // // // // // // // //     Alert,
// // // // // // // // //     Modal,
// // // // // // // // //     Dimensions,
// // // // // // // // //     SafeAreaView,
// // // // // // // // //     Animated,
// // // // // // // // //     Platform,
// // // // // // // // //     LayoutAnimation,
// // // // // // // // //     UIManager,
// // // // // // // // //     Image,
// // // // // // // // //     ScrollView
// // // // // // // // // } from 'react-native';
// // // // // // // // // import { useSelector } from 'react-redux';
// // // // // // // // // import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// // // // // // // // // import { WebView } from 'react-native-webview';
// // // // // // // // // import DateTimePicker from '@react-native-community/datetimepicker';
// // // // // // // // // import { selectThemeData } from '../../store/slices/themeSlice';
// // // // // // // // // import { useGetChildDiaryQuery } from '../../store/attendanceApi';

// // // // // // // // // // Enable LayoutAnimation for Android
// // // // // // // // // if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
// // // // // // // // //     UIManager.setLayoutAnimationEnabledExperimental(true);
// // // // // // // // // }

// // // // // // // // // const { width: SCREEN_WIDTH } = Dimensions.get('window');

// // // // // // // // // // Skeleton Loader Component
// // // // // // // // // const SkeletonLoader = ({ theme }) => (
// // // // // // // // //     <View style={styles.skeletonContainer}>
// // // // // // // // //         {[1, 2, 3].map((item) => (
// // // // // // // // //             <View key={item} style={[styles.skeletonCard, { backgroundColor: theme.card }]}>
// // // // // // // // //                 <View style={styles.skeletonHeader}>
// // // // // // // // //                     <View style={[styles.skeletonDate, { backgroundColor: theme.border }]} />
// // // // // // // // //                     <View style={[styles.skeletonBadge, { backgroundColor: theme.border }]} />
// // // // // // // // //                 </View>
// // // // // // // // //                 <View style={[styles.skeletonLine, { backgroundColor: theme.border }]} />
// // // // // // // // //                 <View style={[styles.skeletonLine, { backgroundColor: theme.border, width: '80%' }]} />
// // // // // // // // //                 <View style={styles.skeletonFooter}>
// // // // // // // // //                     <View style={[styles.skeletonAvatar, { backgroundColor: theme.border }]} />
// // // // // // // // //                     <View style={[styles.skeletonText, { backgroundColor: theme.border }]} />
// // // // // // // // //                 </View>
// // // // // // // // //             </View>
// // // // // // // // //         ))}
// // // // // // // // //     </View>
// // // // // // // // // );

// // // // // // // // // // HTML Content Renderer with Auto Height
// // // // // // // // // const HTMLContentView = ({ htmlContent, theme, onLayout }) => {
// // // // // // // // //     const [webViewHeight, setWebViewHeight] = useState(100);
// // // // // // // // //     const webViewRef = useRef(null);

// // // // // // // // //     const getHTML = (content) => {
// // // // // // // // //         return `
// // // // // // // // //             <!DOCTYPE html>
// // // // // // // // //             <html>
// // // // // // // // //             <head>
// // // // // // // // //                 <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
// // // // // // // // //                 <style>
// // // // // // // // //                     * { margin: 0; padding: 0; box-sizing: border-box; }
// // // // // // // // //                     body {
// // // // // // // // //                         font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
// // // // // // // // //                         font-size: 15px;
// // // // // // // // //                         line-height: 1.6;
// // // // // // // // //                         color: ${theme.isDarkMode ? '#e0e0e0' : '#2c3e50'};
// // // // // // // // //                         padding: 0;
// // // // // // // // //                         background: transparent;
// // // // // // // // //                     }
// // // // // // // // //                     h1 { font-size: 24px; font-weight: 700; margin: 16px 0 12px 0; color: ${theme.isDarkMode ? '#fff' : '#1a1a2e'}; }
// // // // // // // // //                     h2 { font-size: 20px; font-weight: 600; margin: 14px 0 10px 0; color: ${theme.isDarkMode ? '#fff' : '#1a1a2e'}; }
// // // // // // // // //                     h3 { font-size: 18px; font-weight: 600; margin: 12px 0 8px 0; }
// // // // // // // // //                     p { margin-bottom: 12px; }
// // // // // // // // //                     strong, b { font-weight: 700; color: ${theme.primary}; }
// // // // // // // // //                     em, i { font-style: italic; }
// // // // // // // // //                     ul, ol { margin-bottom: 12px; padding-left: 24px; }
// // // // // // // // //                     li { margin-bottom: 6px; }
// // // // // // // // //                     img { 
// // // // // // // // //                         max-width: 100%; 
// // // // // // // // //                         height: auto; 
// // // // // // // // //                         border-radius: 16px; 
// // // // // // // // //                         margin: 16px 0;
// // // // // // // // //                         box-shadow: 0 4px 12px rgba(0,0,0,0.1);
// // // // // // // // //                     }
// // // // // // // // //                     table {
// // // // // // // // //                         width: 100%;
// // // // // // // // //                         border-collapse: collapse;
// // // // // // // // //                         margin-bottom: 12px;
// // // // // // // // //                         border-radius: 12px;
// // // // // // // // //                         overflow: hidden;
// // // // // // // // //                     }
// // // // // // // // //                     th, td {
// // // // // // // // //                         border: 1px solid ${theme.isDarkMode ? '#444' : '#e2e8f0'};
// // // // // // // // //                         padding: 10px;
// // // // // // // // //                         text-align: left;
// // // // // // // // //                     }
// // // // // // // // //                     th {
// // // // // // // // //                         background-color: ${theme.isDarkMode ? '#2d3748' : '#f7fafc'};
// // // // // // // // //                         font-weight: 600;
// // // // // // // // //                     }
// // // // // // // // //                     blockquote {
// // // // // // // // //                         margin: 12px 0;
// // // // // // // // //                         padding-left: 16px;
// // // // // // // // //                         border-left: 4px solid ${theme.primary || '#4CAF50'};
// // // // // // // // //                         color: ${theme.isDarkMode ? '#a0aec0' : '#718096'};
// // // // // // // // //                         font-style: italic;
// // // // // // // // //                     }
// // // // // // // // //                     a {
// // // // // // // // //                         color: ${theme.primary};
// // // // // // // // //                         text-decoration: none;
// // // // // // // // //                     }
// // // // // // // // //                     .ql-editor { padding: 0; }
// // // // // // // // //                 </style>
// // // // // // // // //                 <script>
// // // // // // // // //                     function updateHeight() {
// // // // // // // // //                         const height = document.body.scrollHeight;
// // // // // // // // //                         window.ReactNativeWebView.postMessage(JSON.stringify({
// // // // // // // // //                             type: 'height',
// // // // // // // // //                             height: height
// // // // // // // // //                         }));
// // // // // // // // //                     }
// // // // // // // // //                     window.onload = updateHeight;
// // // // // // // // //                     window.onresize = updateHeight;
// // // // // // // // //                     setTimeout(updateHeight, 100);
// // // // // // // // //                 </script>
// // // // // // // // //             </head>
// // // // // // // // //             <body>
// // // // // // // // //                 ${content || '<p style="color: #a0aec0; text-align: center;">✨ No content available</p>'}
// // // // // // // // //             </body>
// // // // // // // // //             </html>
// // // // // // // // //         `;
// // // // // // // // //     };

// // // // // // // // //     const handleMessage = (event) => {
// // // // // // // // //         try {
// // // // // // // // //             const data = JSON.parse(event.nativeEvent.data);
// // // // // // // // //             if (data.type === 'height' && data.height) {
// // // // // // // // //                 const newHeight = Math.max(100, data.height + 20);
// // // // // // // // //                 setWebViewHeight(newHeight);
// // // // // // // // //                 onLayout?.(newHeight);
// // // // // // // // //             }
// // // // // // // // //         } catch (error) {}
// // // // // // // // //     };

// // // // // // // // //     if (!htmlContent || htmlContent === '<p><br></p>' || htmlContent === '<p></p>') {
// // // // // // // // //         return (
// // // // // // // // //             <View style={styles.emptyContent}>
// // // // // // // // //                 <Icon name="file-document-outline" size={32} color="#a0aec0" />
// // // // // // // // //                 <Text style={[styles.emptyContentText, { color: theme.textSecondary }]}>
// // // // // // // // //                     No content available
// // // // // // // // //                 </Text>
// // // // // // // // //             </View>
// // // // // // // // //         );
// // // // // // // // //     }

// // // // // // // // //     return (
// // // // // // // // //         <WebView
// // // // // // // // //             ref={webViewRef}
// // // // // // // // //             source={{ html: getHTML(htmlContent) }}
// // // // // // // // //             onMessage={handleMessage}
// // // // // // // // //             style={[styles.webView, { height: webViewHeight }]}
// // // // // // // // //             scrollEnabled={false}
// // // // // // // // //             showsVerticalScrollIndicator={false}
// // // // // // // // //             originWhitelist={['*']}
// // // // // // // // //             androidLayerType="software"
// // // // // // // // //             containerStyle={{ backgroundColor: 'transparent' }}
// // // // // // // // //         />
// // // // // // // // //     );
// // // // // // // // // };

// // // // // // // // // // Diary Card Component
// // // // // // // // // const DiaryCard = ({ item, theme, onPress }) => {
// // // // // // // // //     const scaleAnim = useRef(new Animated.Value(1)).current;
// // // // // // // // //     const plainTextPreview = item.content?.replace(/<[^>]*>/g, '').substring(0, 100) || 'No preview available';

// // // // // // // // //     const handlePressIn = () => {
// // // // // // // // //         Animated.spring(scaleAnim, {
// // // // // // // // //             toValue: 0.98,
// // // // // // // // //             useNativeDriver: true,
// // // // // // // // //             speed: 50,
// // // // // // // // //         }).start();
// // // // // // // // //     };

// // // // // // // // //     const handlePressOut = () => {
// // // // // // // // //         Animated.spring(scaleAnim, {
// // // // // // // // //             toValue: 1,
// // // // // // // // //             useNativeDriver: true,
// // // // // // // // //             speed: 50,
// // // // // // // // //         }).start();
// // // // // // // // //     };

// // // // // // // // //     const formatDate = (dateString) => {
// // // // // // // // //         const date = new Date(dateString);
// // // // // // // // //         return date.toLocaleDateString('en-US', { 
// // // // // // // // //             month: 'short', 
// // // // // // // // //             day: 'numeric',
// // // // // // // // //             year: 'numeric'
// // // // // // // // //         });
// // // // // // // // //     };

// // // // // // // // //     return (
// // // // // // // // //         <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
// // // // // // // // //             <TouchableOpacity
// // // // // // // // //                 activeOpacity={0.9}
// // // // // // // // //                 onPressIn={handlePressIn}
// // // // // // // // //                 onPressOut={handlePressOut}
// // // // // // // // //                 onPress={() => onPress(item)}
// // // // // // // // //                 style={[styles.entryCard, { backgroundColor: theme.card }]}
// // // // // // // // //             >
// // // // // // // // //                 <View style={styles.cardHeader}>
// // // // // // // // //                     <View style={styles.dateSection}>
// // // // // // // // //                         <View style={[styles.dateBadge, { backgroundColor: theme.primary + '15' }]}>
// // // // // // // // //                             <Icon name="calendar-today" size={14} color={theme.primary} />
// // // // // // // // //                             <Text style={[styles.dateText, { color: theme.text }]}>
// // // // // // // // //                                 {formatDate(item.date)}
// // // // // // // // //                             </Text>
// // // // // // // // //                         </View>
// // // // // // // // //                         <Text style={[styles.dayText, { color: theme.textSecondary }]}>
// // // // // // // // //                             {item.day}
// // // // // // // // //                         </Text>
// // // // // // // // //                     </View>
// // // // // // // // //                     <View style={[styles.subjectBadge, { backgroundColor: theme.primary + '15' }]}>
// // // // // // // // //                         <Icon name="book-open-variant" size={12} color={theme.primary} />
// // // // // // // // //                         <Text style={[styles.subjectText, { color: theme.primary }]}>
// // // // // // // // //                             {item.subject}
// // // // // // // // //                         </Text>
// // // // // // // // //                     </View>
// // // // // // // // //                 </View>

// // // // // // // // //                 <Text style={[styles.previewText, { color: theme.text }]} numberOfLines={2}>
// // // // // // // // //                     {plainTextPreview}
// // // // // // // // //                 </Text>

// // // // // // // // //                 <View style={styles.cardFooter}>
// // // // // // // // //                     <View style={styles.teacherSection}>
// // // // // // // // //                         <View style={[styles.teacherAvatar, { backgroundColor: theme.primary + '15' }]}>
// // // // // // // // //                             <Icon name="account" size={14} color={theme.primary} />
// // // // // // // // //                         </View>
// // // // // // // // //                         <Text style={[styles.teacherText, { color: theme.textSecondary }]}>
// // // // // // // // //                             {item.teacher}
// // // // // // // // //                         </Text>
// // // // // // // // //                     </View>
// // // // // // // // //                     <View style={[
// // // // // // // // //                         styles.statusBadge,
// // // // // // // // //                         { backgroundColor: item.isPublished ? theme.success + '15' : theme.warning + '15' }
// // // // // // // // //                     ]}>
// // // // // // // // //                         <View style={[
// // // // // // // // //                             styles.statusDot,
// // // // // // // // //                             { backgroundColor: item.isPublished ? theme.success : theme.warning }
// // // // // // // // //                         ]} />
// // // // // // // // //                         <Text style={[
// // // // // // // // //                             styles.statusText,
// // // // // // // // //                             { color: item.isPublished ? theme.success : theme.warning }
// // // // // // // // //                         ]}>
// // // // // // // // //                             {item.isPublished ? 'Published' : 'Draft'}
// // // // // // // // //                         </Text>
// // // // // // // // //                     </View>
// // // // // // // // //                 </View>
// // // // // // // // //             </TouchableOpacity>
// // // // // // // // //         </Animated.View>
// // // // // // // // //     );
// // // // // // // // // };

// // // // // // // // // // Filter Chip Component
// // // // // // // // // const FilterChip = ({ label, isActive, onPress, icon, theme }) => (
// // // // // // // // //     <TouchableOpacity
// // // // // // // // //         style={[
// // // // // // // // //             styles.filterChip,
// // // // // // // // //             { backgroundColor: isActive ? theme.primary : theme.card },
// // // // // // // // //             isActive && styles.filterChipActive
// // // // // // // // //         ]}
// // // // // // // // //         onPress={onPress}
// // // // // // // // //         activeOpacity={0.7}
// // // // // // // // //     >
// // // // // // // // //         {icon && <Icon name={icon} size={16} color={isActive ? '#FFF' : theme.textSecondary} />}
// // // // // // // // //         <Text style={[
// // // // // // // // //             styles.filterChipText,
// // // // // // // // //             { color: isActive ? '#FFF' : theme.text }
// // // // // // // // //         ]}>
// // // // // // // // //             {label}
// // // // // // // // //         </Text>
// // // // // // // // //     </TouchableOpacity>
// // // // // // // // // );

// // // // // // // // // // Date Picker Modal Component
// // // // // // // // // const DatePickerModal = ({ visible, onClose, onSelectDate, selectedDate, theme }) => {
// // // // // // // // //     const [tempDate, setTempDate] = useState(selectedDate ? new Date(selectedDate) : new Date());
// // // // // // // // //     const [showPicker, setShowPicker] = useState(false);

// // // // // // // // //     useEffect(() => {
// // // // // // // // //         if (visible) {
// // // // // // // // //             setShowPicker(true);
// // // // // // // // //         }
// // // // // // // // //     }, [visible]);

// // // // // // // // //     const handleDateChange = (event, date) => {
// // // // // // // // //         if (Platform.OS === 'android') {
// // // // // // // // //             setShowPicker(false);
// // // // // // // // //         }
        
// // // // // // // // //         if (date) {
// // // // // // // // //             setTempDate(date);
// // // // // // // // //             if (Platform.OS === 'android') {
// // // // // // // // //                 const dateString = date.toISOString().split('T')[0];
// // // // // // // // //                 onSelectDate(dateString);
// // // // // // // // //                 onClose();
// // // // // // // // //             }
// // // // // // // // //         } else if (Platform.OS === 'android') {
// // // // // // // // //             onClose();
// // // // // // // // //         }
// // // // // // // // //     };

// // // // // // // // //     const handleIOSConfirm = () => {
// // // // // // // // //         const dateString = tempDate.toISOString().split('T')[0];
// // // // // // // // //         onSelectDate(dateString);
// // // // // // // // //         onClose();
// // // // // // // // //     };

// // // // // // // // //     const handleIOSCancel = () => {
// // // // // // // // //         onClose();
// // // // // // // // //     };

// // // // // // // // //     if (!showPicker) return null;

// // // // // // // // //     if (Platform.OS === 'ios') {
// // // // // // // // //         return (
// // // // // // // // //             <Modal
// // // // // // // // //                 visible={visible}
// // // // // // // // //                 transparent={true}
// // // // // // // // //                 animationType="slide"
// // // // // // // // //                 onRequestClose={onClose}
// // // // // // // // //             >
// // // // // // // // //                 <View style={styles.datePickerModalOverlay}>
// // // // // // // // //                     <View style={[styles.datePickerModalContent, { backgroundColor: theme.card }]}>
// // // // // // // // //                         <View style={[styles.datePickerModalHeader, { borderBottomColor: theme.border }]}>
// // // // // // // // //                             <TouchableOpacity onPress={handleIOSCancel}>
// // // // // // // // //                                 <Text style={[styles.datePickerModalCancel, { color: theme.error }]}>Cancel</Text>
// // // // // // // // //                             </TouchableOpacity>
// // // // // // // // //                             <Text style={[styles.datePickerModalTitle, { color: theme.text }]}>Select Date</Text>
// // // // // // // // //                             <TouchableOpacity onPress={handleIOSConfirm}>
// // // // // // // // //                                 <Text style={[styles.datePickerModalConfirm, { color: theme.primary }]}>Done</Text>
// // // // // // // // //                             </TouchableOpacity>
// // // // // // // // //                         </View>
// // // // // // // // //                         <DateTimePicker
// // // // // // // // //                             value={tempDate}
// // // // // // // // //                             mode="date"
// // // // // // // // //                             display="spinner"
// // // // // // // // //                             onChange={handleDateChange}
// // // // // // // // //                             themeVariant={theme.isDarkMode ? 'dark' : 'light'}
// // // // // // // // //                         />
// // // // // // // // //                     </View>
// // // // // // // // //                 </View>
// // // // // // // // //             </Modal>
// // // // // // // // //         );
// // // // // // // // //     }

// // // // // // // // //     return (
// // // // // // // // //         <DateTimePicker
// // // // // // // // //             value={tempDate}
// // // // // // // // //             mode="date"
// // // // // // // // //             display="default"
// // // // // // // // //             onChange={handleDateChange}
// // // // // // // // //         />
// // // // // // // // //     );
// // // // // // // // // };

// // // // // // // // // const ChildDiaryScreen = ({ route, navigation }) => {
// // // // // // // // //     const theme = useSelector(selectThemeData);
// // // // // // // // //     const { childId, childName, childImage } = route.params;

// // // // // // // // //     const [refreshing, setRefreshing] = useState(false);
// // // // // // // // //     const [diaryEntries, setDiaryEntries] = useState([]);
// // // // // // // // //     const [filteredEntries, setFilteredEntries] = useState([]);
// // // // // // // // //     const [selectedDate, setSelectedDate] = useState('');
// // // // // // // // //     const [selectedSubject, setSelectedSubject] = useState('All');
// // // // // // // // //     const [searchQuery, setSearchQuery] = useState('');
// // // // // // // // //     const [selectedEntry, setSelectedEntry] = useState(null);
// // // // // // // // //     const [showDetailModal, setShowDetailModal] = useState(false);
// // // // // // // // //     const [subjects, setSubjects] = useState([]);
// // // // // // // // //     const [availableDates, setAvailableDates] = useState([]);
// // // // // // // // //     const [isSearchFocused, setIsSearchFocused] = useState(false);
// // // // // // // // //     const [showDatePicker, setShowDatePicker] = useState(false);
// // // // // // // // //     const [apiFilters, setApiFilters] = useState({
// // // // // // // // //         month: new Date().getMonth() + 1,
// // // // // // // // //         year: new Date().getFullYear(),
// // // // // // // // //     });

// // // // // // // // //     const fadeAnim = useRef(new Animated.Value(0)).current;

// // // // // // // // //     const {
// // // // // // // // //         data: diaryResponse,
// // // // // // // // //         isLoading,
// // // // // // // // //         isFetching,
// // // // // // // // //         error,
// // // // // // // // //         refetch,
// // // // // // // // //     } = useGetChildDiaryQuery({
// // // // // // // // //         childId,
// // // // // // // // //         filters: {
// // // // // // // // //             month: apiFilters.month,
// // // // // // // // //             year: apiFilters.year,
// // // // // // // // //             date: selectedDate || undefined,
// // // // // // // // //             subjectId: selectedSubject !== 'All' ? selectedSubject : null,
// // // // // // // // //         },
// // // // // // // // //     });

// // // // // // // // //     useEffect(() => {
// // // // // // // // //         if (diaryResponse?.success === true && diaryResponse?.data?.entries) {
// // // // // // // // //             processDiaryData(diaryResponse.data.entries);
// // // // // // // // //             Animated.timing(fadeAnim, {
// // // // // // // // //                 toValue: 1,
// // // // // // // // //                 duration: 500,
// // // // // // // // //                 useNativeDriver: true,
// // // // // // // // //             }).start();
// // // // // // // // //         }
// // // // // // // // //     }, [diaryResponse]);

// // // // // // // // //     useEffect(() => {
// // // // // // // // //         filterEntries();
// // // // // // // // //     }, [searchQuery, selectedSubject, selectedDate, diaryEntries]);

// // // // // // // // //     const processDiaryData = (entries) => {
// // // // // // // // //         const transformedEntries = entries.map(entry => {
// // // // // // // // //             const dateObj = entry.date ? new Date(entry.date) : new Date();
// // // // // // // // //             const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
// // // // // // // // //             const dayName = !isNaN(dateObj.getTime()) ? dayNames[dateObj.getDay()] : '';

// // // // // // // // //             return {
// // // // // // // // //                 id: entry.id,
// // // // // // // // //                 date: entry.date || '',
// // // // // // // // //                 day: dayName,
// // // // // // // // //                 subject: entry.subject || 'General',
// // // // // // // // //                 subjectId: entry.subjectId,
// // // // // // // // //                 content: entry.content || '',
// // // // // // // // //                 teacher: entry.teacher || 'Teacher',
// // // // // // // // //                 isPublished: entry.isPublished || false,
// // // // // // // // //                 createdAt: entry.createdAt,
// // // // // // // // //             };
// // // // // // // // //         });

// // // // // // // // //         const sortedEntries = transformedEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
        
// // // // // // // // //         const uniqueSubjects = [...new Map(sortedEntries.map(entry => [
// // // // // // // // //             entry.subjectId, { id: entry.subjectId, name: entry.subject }
// // // // // // // // //         ])).values()];
// // // // // // // // //         setSubjects(uniqueSubjects);
        
// // // // // // // // //         const uniqueDates = [...new Set(sortedEntries.map(entry => entry.date))];
// // // // // // // // //         setAvailableDates(uniqueDates);
        
// // // // // // // // //         setDiaryEntries(sortedEntries);
// // // // // // // // //         setFilteredEntries(sortedEntries);
// // // // // // // // //     };

// // // // // // // // //     const filterEntries = () => {
// // // // // // // // //         let filtered = [...diaryEntries];
// // // // // // // // //         if (searchQuery.trim()) {
// // // // // // // // //             const query = searchQuery.toLowerCase();
// // // // // // // // //             filtered = filtered.filter(entry =>
// // // // // // // // //                 entry.subject.toLowerCase().includes(query) ||
// // // // // // // // //                 entry.teacher.toLowerCase().includes(query) ||
// // // // // // // // //                 entry.content.toLowerCase().includes(query)
// // // // // // // // //             );
// // // // // // // // //         }
// // // // // // // // //         if (selectedSubject !== 'All') {
// // // // // // // // //             filtered = filtered.filter(entry => entry.subjectId === selectedSubject);
// // // // // // // // //         }
// // // // // // // // //         if (selectedDate) {
// // // // // // // // //             filtered = filtered.filter(entry => entry.date === selectedDate);
// // // // // // // // //         }
// // // // // // // // //         setFilteredEntries(filtered);
// // // // // // // // //     };

// // // // // // // // //     const onRefresh = async () => {
// // // // // // // // //         setRefreshing(true);
// // // // // // // // //         await refetch();
// // // // // // // // //         setRefreshing(false);
// // // // // // // // //     };

// // // // // // // // //     const handleMonthChange = (offset) => {
// // // // // // // // //         LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
// // // // // // // // //         let newMonth = apiFilters.month + offset;
// // // // // // // // //         let newYear = apiFilters.year;
// // // // // // // // //         if (newMonth > 12) { newMonth = 1; newYear++; }
// // // // // // // // //         if (newMonth < 1) { newMonth = 12; newYear--; }
// // // // // // // // //         setApiFilters({ month: newMonth, year: newYear });
// // // // // // // // //         setSelectedDate('');
// // // // // // // // //     };

// // // // // // // // //     const handleResetFilters = () => {
// // // // // // // // //         LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
// // // // // // // // //         setSelectedDate('');
// // // // // // // // //         setSelectedSubject('All');
// // // // // // // // //         setSearchQuery('');
// // // // // // // // //     };

// // // // // // // // //     const handleEntryPress = (entry) => {
// // // // // // // // //         setSelectedEntry(entry);
// // // // // // // // //         setShowDetailModal(true);
// // // // // // // // //     };

// // // // // // // // //     const formatFullDate = (dateString) => {
// // // // // // // // //         const date = new Date(dateString);
// // // // // // // // //         return date.toLocaleDateString('en-US', {
// // // // // // // // //             weekday: 'long',
// // // // // // // // //             year: 'numeric',
// // // // // // // // //             month: 'long',
// // // // // // // // //             day: 'numeric',
// // // // // // // // //         });
// // // // // // // // //     };

// // // // // // // // //     const getMonthName = (month) => {
// // // // // // // // //         return new Date(2000, month - 1, 1).toLocaleString('default', { month: 'long' });
// // // // // // // // //     };

// // // // // // // // //     const renderHeader = () => (
// // // // // // // // //         <View style={[styles.headerGradient, { backgroundColor: theme.primary }]}>
// // // // // // // // //             <SafeAreaView>
// // // // // // // // //                 <View style={styles.header}>
// // // // // // // // //                     <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
// // // // // // // // //                         <Icon name="arrow-left" size={24} color="#FFF" />
// // // // // // // // //                     </TouchableOpacity>
// // // // // // // // //                     <View style={styles.headerContent}>
// // // // // // // // //                         <Text style={styles.headerTitle}>{childName}'s Diary</Text>
// // // // // // // // //                         <Text style={styles.headerSubtitle}>School activities & updates</Text>
// // // // // // // // //                     </View>
// // // // // // // // //                     <View style={styles.avatarContainer}>
// // // // // // // // //                         <View style={[styles.avatarPlaceholder, { backgroundColor: '#ffffff30' }]}>
// // // // // // // // //                             <Icon name="account-child" size={24} color="#FFF" />
// // // // // // // // //                         </View>
// // // // // // // // //                     </View>
// // // // // // // // //                 </View>
// // // // // // // // //             </SafeAreaView>
// // // // // // // // //         </View>
// // // // // // // // //     );

// // // // // // // // //     const renderSearchBar = () => (
// // // // // // // // //         <View style={[
// // // // // // // // //             styles.searchWrapper,
// // // // // // // // //             isSearchFocused && styles.searchWrapperFocused,
// // // // // // // // //             { borderColor: theme.border, backgroundColor: theme.card }
// // // // // // // // //         ]}>
// // // // // // // // //             <Icon name="magnify" size={20} color={theme.textSecondary} />
// // // // // // // // //             <TextInput
// // // // // // // // //                 style={[styles.searchInput, { color: theme.text }]}
// // // // // // // // //                 placeholder="Search by subject or teacher..."
// // // // // // // // //                 placeholderTextColor={theme.textSecondary}
// // // // // // // // //                 value={searchQuery}
// // // // // // // // //                 onChangeText={setSearchQuery}
// // // // // // // // //                 onFocus={() => setIsSearchFocused(true)}
// // // // // // // // //                 onBlur={() => setIsSearchFocused(false)}
// // // // // // // // //             />
// // // // // // // // //             {searchQuery !== '' && (
// // // // // // // // //                 <TouchableOpacity onPress={() => setSearchQuery('')}>
// // // // // // // // //                     <Icon name="close-circle" size={20} color={theme.textSecondary} />
// // // // // // // // //                 </TouchableOpacity>
// // // // // // // // //             )}
// // // // // // // // //         </View>
// // // // // // // // //     );

// // // // // // // // //     const renderFilters = () => (
// // // // // // // // //         <View style={styles.filtersSection}>
// // // // // // // // //             <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
// // // // // // // // //                 <FilterChip
// // // // // // // // //                     label="All"
// // // // // // // // //                     isActive={selectedSubject === 'All'}
// // // // // // // // //                     onPress={() => setSelectedSubject('All')}
// // // // // // // // //                     theme={theme}
// // // // // // // // //                 />
// // // // // // // // //                 {subjects.map(subject => (
// // // // // // // // //                     <FilterChip
// // // // // // // // //                         key={subject.id}
// // // // // // // // //                         label={subject.name}
// // // // // // // // //                         isActive={selectedSubject === subject.id}
// // // // // // // // //                         onPress={() => setSelectedSubject(subject.id)}
// // // // // // // // //                         theme={theme}
// // // // // // // // //                     />
// // // // // // // // //                 ))}
// // // // // // // // //                 <FilterChip
// // // // // // // // //                     label={selectedDate ? formatFullDate(selectedDate).split(',')[0] : "Select Date"}
// // // // // // // // //                     isActive={!!selectedDate}
// // // // // // // // //                     onPress={() => setShowDatePicker(true)}
// // // // // // // // //                     icon="calendar"
// // // // // // // // //                     theme={theme}
// // // // // // // // //                 />
// // // // // // // // //             </ScrollView>
// // // // // // // // //         </View>
// // // // // // // // //     );

// // // // // // // // //     const renderMonthNavigator = () => (
// // // // // // // // //         <View style={[styles.monthNav, { backgroundColor: theme.card }]}>
// // // // // // // // //             <TouchableOpacity onPress={() => handleMonthChange(-1)} style={styles.monthNavButton}>
// // // // // // // // //                 <Icon name="chevron-left" size={24} color={theme.primary} />
// // // // // // // // //             </TouchableOpacity>
// // // // // // // // //             <View style={styles.monthDisplay}>
// // // // // // // // //                 <Text style={[styles.monthText, { color: theme.text }]}>
// // // // // // // // //                     {getMonthName(apiFilters.month)} {apiFilters.year}
// // // // // // // // //                 </Text>
// // // // // // // // //                 <Text style={[styles.entryCount, { color: theme.textSecondary }]}>
// // // // // // // // //                     {filteredEntries.length} entries
// // // // // // // // //                 </Text>
// // // // // // // // //             </View>
// // // // // // // // //             <TouchableOpacity onPress={() => handleMonthChange(1)} style={styles.monthNavButton}>
// // // // // // // // //                 <Icon name="chevron-right" size={24} color={theme.primary} />
// // // // // // // // //             </TouchableOpacity>
// // // // // // // // //         </View>
// // // // // // // // //     );

// // // // // // // // //     const renderEmptyState = () => (
// // // // // // // // //         <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
// // // // // // // // //             <View style={[styles.emptyIconContainer, { backgroundColor: theme.primary + '10' }]}>
// // // // // // // // //                 <Icon name="notebook-edit-outline" size={64} color={theme.primary} />
// // // // // // // // //             </View>
// // // // // // // // //             <Text style={[styles.emptyTitle, { color: theme.text }]}>
// // // // // // // // //                 {searchQuery || selectedDate || selectedSubject !== 'All' 
// // // // // // // // //                     ? 'No matching entries' 
// // // // // // // // //                     : 'No diary entries yet'}
// // // // // // // // //             </Text>
// // // // // // // // //             <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
// // // // // // // // //                 {searchQuery || selectedDate || selectedSubject !== 'All'
// // // // // // // // //                     ? 'Try adjusting your filters to see more results'
// // // // // // // // //                     : `No entries found for ${getMonthName(apiFilters.month)} ${apiFilters.year}`}
// // // // // // // // //             </Text>
// // // // // // // // //             {(searchQuery || selectedDate || selectedSubject !== 'All') && (
// // // // // // // // //                 <TouchableOpacity style={[styles.emptyButton, { backgroundColor: theme.primary }]} onPress={handleResetFilters}>
// // // // // // // // //                     <Text style={styles.emptyButtonText}>Clear Filters</Text>
// // // // // // // // //                 </TouchableOpacity>
// // // // // // // // //             )}
// // // // // // // // //         </Animated.View>
// // // // // // // // //     );

// // // // // // // // //     const renderDetailModal = () => (
// // // // // // // // //         <Modal
// // // // // // // // //             visible={showDetailModal}
// // // // // // // // //             animationType="slide"
// // // // // // // // //             transparent={false}
// // // // // // // // //             onRequestClose={() => setShowDetailModal(false)}
// // // // // // // // //         >
// // // // // // // // //             <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.background }]}>
// // // // // // // // //                 <View style={[styles.modalHeader, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
// // // // // // // // //                     <TouchableOpacity onPress={() => setShowDetailModal(false)} style={styles.modalBackButton}>
// // // // // // // // //                         <Icon name="arrow-left" size={24} color={theme.text} />
// // // // // // // // //                     </TouchableOpacity>
// // // // // // // // //                     <Text style={[styles.modalTitle, { color: theme.text }]}>Diary Entry</Text>
// // // // // // // // //                     <View style={{ width: 40 }} />
// // // // // // // // //                 </View>
// // // // // // // // //                 {selectedEntry && (
// // // // // // // // //                     <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
// // // // // // // // //                         <View style={[styles.detailCard, { backgroundColor: theme.card }]}>
// // // // // // // // //                             <View style={styles.detailHeader}>
// // // // // // // // //                                 <View style={styles.detailDateSection}>
// // // // // // // // //                                     <Icon name="calendar" size={20} color={theme.primary} />
// // // // // // // // //                                     <Text style={[styles.detailDate, { color: theme.text }]}>
// // // // // // // // //                                         {formatFullDate(selectedEntry.date)}
// // // // // // // // //                                     </Text>
// // // // // // // // //                                 </View>
// // // // // // // // //                                 <View style={styles.detailBadges}>
// // // // // // // // //                                     <View style={[styles.detailSubjectBadge, { backgroundColor: theme.primary + '15' }]}>
// // // // // // // // //                                         <Icon name="book-open-variant" size={14} color={theme.primary} />
// // // // // // // // //                                         <Text style={[styles.detailSubject, { color: theme.primary }]}>
// // // // // // // // //                                             {selectedEntry.subject}
// // // // // // // // //                                         </Text>
// // // // // // // // //                                     </View>
// // // // // // // // //                                     <View style={[styles.detailStatusBadge, { 
// // // // // // // // //                                         backgroundColor: selectedEntry.isPublished ? theme.success + '15' : theme.warning + '15' 
// // // // // // // // //                                     }]}>
// // // // // // // // //                                         <View style={[styles.statusDot, { 
// // // // // // // // //                                             backgroundColor: selectedEntry.isPublished ? theme.success : theme.warning 
// // // // // // // // //                                         }]} />
// // // // // // // // //                                         <Text style={[styles.detailStatus, { 
// // // // // // // // //                                             color: selectedEntry.isPublished ? theme.success : theme.warning 
// // // // // // // // //                                         }]}>
// // // // // // // // //                                             {selectedEntry.isPublished ? 'Published' : 'Draft'}
// // // // // // // // //                                         </Text>
// // // // // // // // //                                     </View>
// // // // // // // // //                                 </View>
// // // // // // // // //                             </View>

// // // // // // // // //                             <View style={styles.detailTeacherSection}>
// // // // // // // // //                                 <View style={[styles.detailTeacherAvatar, { backgroundColor: theme.primary + '15' }]}>
// // // // // // // // //                                     <Icon name="account" size={20} color={theme.primary} />
// // // // // // // // //                                 </View>
// // // // // // // // //                                 <View>
// // // // // // // // //                                     <Text style={[styles.detailTeacherLabel, { color: theme.textSecondary }]}>Teacher</Text>
// // // // // // // // //                                     <Text style={[styles.detailTeacher, { color: theme.text }]}>{selectedEntry.teacher}</Text>
// // // // // // // // //                                 </View>
// // // // // // // // //                             </View>

// // // // // // // // //                             <View style={styles.divider} />

// // // // // // // // //                             <View style={styles.detailContentSection}>
// // // // // // // // //                                 <Text style={[styles.detailContentTitle, { color: theme.text }]}>Content</Text>
// // // // // // // // //                                 <HTMLContentView 
// // // // // // // // //                                     htmlContent={selectedEntry.content} 
// // // // // // // // //                                     theme={theme}
// // // // // // // // //                                 />
// // // // // // // // //                             </View>
// // // // // // // // //                         </View>
// // // // // // // // //                     </ScrollView>
// // // // // // // // //                 )}
// // // // // // // // //             </SafeAreaView>
// // // // // // // // //         </Modal>
// // // // // // // // //     );

// // // // // // // // //     if (error) {
// // // // // // // // //         return (
// // // // // // // // //             <View style={[styles.container, { backgroundColor: theme.background }]}>
// // // // // // // // //                 <View style={styles.errorContainer}>
// // // // // // // // //                     <View style={[styles.errorIconContainer, { backgroundColor: theme.error + '10' }]}>
// // // // // // // // //                         <Icon name="wifi-off" size={60} color={theme.error} />
// // // // // // // // //                     </View>
// // // // // // // // //                     <Text style={[styles.errorText, { color: theme.text }]}>Connection Error</Text>
// // // // // // // // //                     <Text style={[styles.errorSubtext, { color: theme.textSecondary }]}>
// // // // // // // // //                         Unable to connect to the server. Please check your internet connection.
// // // // // // // // //                     </Text>
// // // // // // // // //                     <TouchableOpacity style={[styles.retryButton, { backgroundColor: theme.primary }]} onPress={() => refetch()}>
// // // // // // // // //                         <Text style={styles.retryButtonText}>Try Again</Text>
// // // // // // // // //                     </TouchableOpacity>
// // // // // // // // //                 </View>
// // // // // // // // //             </View>
// // // // // // // // //         );
// // // // // // // // //     }

// // // // // // // // //     return (
// // // // // // // // //         <View style={[styles.container, { backgroundColor: theme.background }]}>
// // // // // // // // //             {renderHeader()}
            
// // // // // // // // //             <View style={styles.contentContainer}>
// // // // // // // // //                 {renderSearchBar()}
// // // // // // // // //                 {renderFilters()}
// // // // // // // // //                 {renderMonthNavigator()}

// // // // // // // // //                 {(isLoading || isFetching) && !refreshing ? (
// // // // // // // // //                     <SkeletonLoader theme={theme} />
// // // // // // // // //                 ) : (
// // // // // // // // //                     <FlatList
// // // // // // // // //                         data={filteredEntries}
// // // // // // // // //                         renderItem={({ item }) => (
// // // // // // // // //                             <DiaryCard
// // // // // // // // //                                 item={item}
// // // // // // // // //                                 theme={theme}
// // // // // // // // //                                 onPress={handleEntryPress}
// // // // // // // // //                             />
// // // // // // // // //                         )}
// // // // // // // // //                         keyExtractor={(item) => item.id?.toString()}
// // // // // // // // //                         contentContainerStyle={styles.listContent}
// // // // // // // // //                         refreshControl={
// // // // // // // // //                             <RefreshControl
// // // // // // // // //                                 refreshing={refreshing}
// // // // // // // // //                                 onRefresh={onRefresh}
// // // // // // // // //                                 colors={[theme.primary]}
// // // // // // // // //                                 tintColor={theme.primary}
// // // // // // // // //                             />
// // // // // // // // //                         }
// // // // // // // // //                         ListEmptyComponent={renderEmptyState()}
// // // // // // // // //                         showsVerticalScrollIndicator={false}
// // // // // // // // //                     />
// // // // // // // // //                 )}
// // // // // // // // //             </View>

// // // // // // // // //             {renderDetailModal()}
            
// // // // // // // // //             <DatePickerModal
// // // // // // // // //                 visible={showDatePicker}
// // // // // // // // //                 onClose={() => setShowDatePicker(false)}
// // // // // // // // //                 onSelectDate={(date) => setSelectedDate(date)}
// // // // // // // // //                 selectedDate={selectedDate}
// // // // // // // // //                 theme={theme}
// // // // // // // // //             />
// // // // // // // // //         </View>
// // // // // // // // //     );
// // // // // // // // // };

// // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // //     container: {
// // // // // // // // //         flex: 1,
// // // // // // // // //     },
// // // // // // // // //     headerGradient: {
// // // // // // // // //         borderBottomLeftRadius: 24,
// // // // // // // // //         borderBottomRightRadius: 24,
// // // // // // // // //         paddingBottom: 20,
// // // // // // // // //     },
// // // // // // // // //     header: {
// // // // // // // // //         flexDirection: 'row',
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //         paddingHorizontal: 20,
// // // // // // // // //         paddingTop: Platform.OS === 'ios' ? 10 : 20,
// // // // // // // // //     },
// // // // // // // // //     backButton: {
// // // // // // // // //         width: 40,
// // // // // // // // //         height: 40,
// // // // // // // // //         justifyContent: 'center',
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //     },
// // // // // // // // //     headerContent: {
// // // // // // // // //         flex: 1,
// // // // // // // // //         marginLeft: 12,
// // // // // // // // //     },
// // // // // // // // //     headerTitle: {
// // // // // // // // //         fontSize: 20,
// // // // // // // // //         fontWeight: '700',
// // // // // // // // //         color: '#FFF',
// // // // // // // // //     },
// // // // // // // // //     headerSubtitle: {
// // // // // // // // //         fontSize: 13,
// // // // // // // // //         color: '#FFFFFFCC',
// // // // // // // // //         marginTop: 2,
// // // // // // // // //     },
// // // // // // // // //     avatarContainer: {
// // // // // // // // //         width: 44,
// // // // // // // // //         height: 44,
// // // // // // // // //     },
// // // // // // // // //     avatarPlaceholder: {
// // // // // // // // //         width: 44,
// // // // // // // // //         height: 44,
// // // // // // // // //         borderRadius: 22,
// // // // // // // // //         justifyContent: 'center',
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //         borderWidth: 2,
// // // // // // // // //         borderColor: '#FFF',
// // // // // // // // //     },
// // // // // // // // //     contentContainer: {
// // // // // // // // //         flex: 1,
// // // // // // // // //         paddingTop: 16,
// // // // // // // // //     },
// // // // // // // // //     searchWrapper: {
// // // // // // // // //         flexDirection: 'row',
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //         marginHorizontal: 16,
// // // // // // // // //         marginBottom: 12,
// // // // // // // // //         paddingHorizontal: 16,
// // // // // // // // //         paddingVertical: 12,
// // // // // // // // //         borderRadius: 16,
// // // // // // // // //         borderWidth: 1,
// // // // // // // // //     },
// // // // // // // // //     searchWrapperFocused: {
// // // // // // // // //         borderWidth: 2,
// // // // // // // // //     },
// // // // // // // // //     searchInput: {
// // // // // // // // //         flex: 1,
// // // // // // // // //         fontSize: 16,
// // // // // // // // //         marginLeft: 12,
// // // // // // // // //         paddingVertical: 0,
// // // // // // // // //     },
// // // // // // // // //     filtersSection: {
// // // // // // // // //         marginBottom: 12,
// // // // // // // // //     },
// // // // // // // // //     filtersScroll: {
// // // // // // // // //         paddingHorizontal: 16,
// // // // // // // // //     },
// // // // // // // // //     filterChip: {
// // // // // // // // //         flexDirection: 'row',
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //         paddingHorizontal: 16,
// // // // // // // // //         paddingVertical: 8,
// // // // // // // // //         borderRadius: 24,
// // // // // // // // //         marginRight: 8,
// // // // // // // // //         gap: 6,
// // // // // // // // //         shadowColor: '#000',
// // // // // // // // //         shadowOffset: { width: 0, height: 2 },
// // // // // // // // //         shadowOpacity: 0.05,
// // // // // // // // //         shadowRadius: 4,
// // // // // // // // //         elevation: 2,
// // // // // // // // //     },
// // // // // // // // //     filterChipActive: {
// // // // // // // // //         shadowOpacity: 0.2,
// // // // // // // // //         shadowRadius: 6,
// // // // // // // // //     },
// // // // // // // // //     filterChipText: {
// // // // // // // // //         fontSize: 14,
// // // // // // // // //         fontWeight: '500',
// // // // // // // // //     },
// // // // // // // // //     monthNav: {
// // // // // // // // //         flexDirection: 'row',
// // // // // // // // //         justifyContent: 'space-between',
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //         marginHorizontal: 16,
// // // // // // // // //         marginBottom: 16,
// // // // // // // // //         paddingHorizontal: 16,
// // // // // // // // //         paddingVertical: 14,
// // // // // // // // //         borderRadius: 16,
// // // // // // // // //         shadowColor: '#000',
// // // // // // // // //         shadowOffset: { width: 0, height: 2 },
// // // // // // // // //         shadowOpacity: 0.05,
// // // // // // // // //         shadowRadius: 4,
// // // // // // // // //         elevation: 2,
// // // // // // // // //     },
// // // // // // // // //     monthNavButton: {
// // // // // // // // //         width: 40,
// // // // // // // // //         height: 40,
// // // // // // // // //         justifyContent: 'center',
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //         borderRadius: 20,
// // // // // // // // //     },
// // // // // // // // //     monthDisplay: {
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //     },
// // // // // // // // //     monthText: {
// // // // // // // // //         fontSize: 16,
// // // // // // // // //         fontWeight: '600',
// // // // // // // // //     },
// // // // // // // // //     entryCount: {
// // // // // // // // //         fontSize: 12,
// // // // // // // // //         marginTop: 2,
// // // // // // // // //     },
// // // // // // // // //     listContent: {
// // // // // // // // //         paddingHorizontal: 16,
// // // // // // // // //         paddingBottom: 20,
// // // // // // // // //     },
// // // // // // // // //     entryCard: {
// // // // // // // // //         padding: 16,
// // // // // // // // //         borderRadius: 20,
// // // // // // // // //         marginBottom: 12,
// // // // // // // // //         shadowColor: '#000',
// // // // // // // // //         shadowOffset: { width: 0, height: 4 },
// // // // // // // // //         shadowOpacity: 0.08,
// // // // // // // // //         shadowRadius: 8,
// // // // // // // // //         elevation: 4,
// // // // // // // // //     },
// // // // // // // // //     cardHeader: {
// // // // // // // // //         flexDirection: 'row',
// // // // // // // // //         justifyContent: 'space-between',
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //         marginBottom: 12,
// // // // // // // // //     },
// // // // // // // // //     dateSection: {
// // // // // // // // //         flexDirection: 'row',
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //         gap: 8,
// // // // // // // // //     },
// // // // // // // // //     dateBadge: {
// // // // // // // // //         flexDirection: 'row',
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //         paddingHorizontal: 10,
// // // // // // // // //         paddingVertical: 4,
// // // // // // // // //         borderRadius: 12,
// // // // // // // // //         gap: 4,
// // // // // // // // //     },
// // // // // // // // //     dateText: {
// // // // // // // // //         fontSize: 12,
// // // // // // // // //         fontWeight: '500',
// // // // // // // // //     },
// // // // // // // // //     dayText: {
// // // // // // // // //         fontSize: 12,
// // // // // // // // //     },
// // // // // // // // //     subjectBadge: {
// // // // // // // // //         flexDirection: 'row',
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //         paddingHorizontal: 10,
// // // // // // // // //         paddingVertical: 4,
// // // // // // // // //         borderRadius: 12,
// // // // // // // // //         gap: 4,
// // // // // // // // //     },
// // // // // // // // //     subjectText: {
// // // // // // // // //         fontSize: 11,
// // // // // // // // //         fontWeight: '600',
// // // // // // // // //     },
// // // // // // // // //     previewText: {
// // // // // // // // //         fontSize: 14,
// // // // // // // // //         lineHeight: 20,
// // // // // // // // //         marginBottom: 12,
// // // // // // // // //     },
// // // // // // // // //     cardFooter: {
// // // // // // // // //         flexDirection: 'row',
// // // // // // // // //         justifyContent: 'space-between',
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //     },
// // // // // // // // //     teacherSection: {
// // // // // // // // //         flexDirection: 'row',
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //         gap: 8,
// // // // // // // // //     },
// // // // // // // // //     teacherAvatar: {
// // // // // // // // //         width: 28,
// // // // // // // // //         height: 28,
// // // // // // // // //         borderRadius: 14,
// // // // // // // // //         justifyContent: 'center',
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //     },
// // // // // // // // //     teacherText: {
// // // // // // // // //         fontSize: 12,
// // // // // // // // //     },
// // // // // // // // //     statusBadge: {
// // // // // // // // //         flexDirection: 'row',
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //         paddingHorizontal: 10,
// // // // // // // // //         paddingVertical: 4,
// // // // // // // // //         borderRadius: 12,
// // // // // // // // //         gap: 6,
// // // // // // // // //     },
// // // // // // // // //     statusDot: {
// // // // // // // // //         width: 6,
// // // // // // // // //         height: 6,
// // // // // // // // //         borderRadius: 3,
// // // // // // // // //     },
// // // // // // // // //     statusText: {
// // // // // // // // //         fontSize: 11,
// // // // // // // // //         fontWeight: '600',
// // // // // // // // //     },
// // // // // // // // //     skeletonContainer: {
// // // // // // // // //         paddingHorizontal: 16,
// // // // // // // // //     },
// // // // // // // // //     skeletonCard: {
// // // // // // // // //         padding: 16,
// // // // // // // // //         borderRadius: 20,
// // // // // // // // //         marginBottom: 12,
// // // // // // // // //     },
// // // // // // // // //     skeletonHeader: {
// // // // // // // // //         flexDirection: 'row',
// // // // // // // // //         justifyContent: 'space-between',
// // // // // // // // //         marginBottom: 12,
// // // // // // // // //     },
// // // // // // // // //     skeletonDate: {
// // // // // // // // //         width: 100,
// // // // // // // // //         height: 24,
// // // // // // // // //         borderRadius: 12,
// // // // // // // // //     },
// // // // // // // // //     skeletonBadge: {
// // // // // // // // //         width: 60,
// // // // // // // // //         height: 24,
// // // // // // // // //         borderRadius: 12,
// // // // // // // // //     },
// // // // // // // // //     skeletonLine: {
// // // // // // // // //         height: 16,
// // // // // // // // //         borderRadius: 8,
// // // // // // // // //         marginBottom: 8,
// // // // // // // // //     },
// // // // // // // // //     skeletonFooter: {
// // // // // // // // //         flexDirection: 'row',
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //         marginTop: 8,
// // // // // // // // //         gap: 8,
// // // // // // // // //     },
// // // // // // // // //     skeletonAvatar: {
// // // // // // // // //         width: 28,
// // // // // // // // //         height: 28,
// // // // // // // // //         borderRadius: 14,
// // // // // // // // //     },
// // // // // // // // //     skeletonText: {
// // // // // // // // //         width: 100,
// // // // // // // // //         height: 14,
// // // // // // // // //         borderRadius: 7,
// // // // // // // // //     },
// // // // // // // // //     emptyContainer: {
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //         paddingVertical: 60,
// // // // // // // // //     },
// // // // // // // // //     emptyIconContainer: {
// // // // // // // // //         width: 120,
// // // // // // // // //         height: 120,
// // // // // // // // //         borderRadius: 60,
// // // // // // // // //         justifyContent: 'center',
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //         marginBottom: 24,
// // // // // // // // //     },
// // // // // // // // //     emptyTitle: {
// // // // // // // // //         fontSize: 18,
// // // // // // // // //         fontWeight: '600',
// // // // // // // // //         marginBottom: 8,
// // // // // // // // //     },
// // // // // // // // //     emptySubtitle: {
// // // // // // // // //         fontSize: 14,
// // // // // // // // //         textAlign: 'center',
// // // // // // // // //         paddingHorizontal: 40,
// // // // // // // // //         marginBottom: 24,
// // // // // // // // //     },
// // // // // // // // //     emptyButton: {
// // // // // // // // //         paddingHorizontal: 32,
// // // // // // // // //         paddingVertical: 12,
// // // // // // // // //         borderRadius: 25,
// // // // // // // // //     },
// // // // // // // // //     emptyButtonText: {
// // // // // // // // //         color: '#FFF',
// // // // // // // // //         fontSize: 14,
// // // // // // // // //         fontWeight: '600',
// // // // // // // // //     },
// // // // // // // // //     errorContainer: {
// // // // // // // // //         flex: 1,
// // // // // // // // //         justifyContent: 'center',
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //         padding: 24,
// // // // // // // // //     },
// // // // // // // // //     errorIconContainer: {
// // // // // // // // //         width: 100,
// // // // // // // // //         height: 100,
// // // // // // // // //         borderRadius: 50,
// // // // // // // // //         justifyContent: 'center',
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //         marginBottom: 24,
// // // // // // // // //     },
// // // // // // // // //     errorText: {
// // // // // // // // //         fontSize: 20,
// // // // // // // // //         fontWeight: 'bold',
// // // // // // // // //         marginBottom: 8,
// // // // // // // // //     },
// // // // // // // // //     errorSubtext: {
// // // // // // // // //         fontSize: 14,
// // // // // // // // //         textAlign: 'center',
// // // // // // // // //         lineHeight: 20,
// // // // // // // // //         marginBottom: 24,
// // // // // // // // //     },
// // // // // // // // //     retryButton: {
// // // // // // // // //         paddingHorizontal: 32,
// // // // // // // // //         paddingVertical: 12,
// // // // // // // // //         borderRadius: 25,
// // // // // // // // //     },
// // // // // // // // //     retryButtonText: {
// // // // // // // // //         color: '#FFF',
// // // // // // // // //         fontSize: 16,
// // // // // // // // //         fontWeight: '600',
// // // // // // // // //     },
// // // // // // // // //     modalContainer: {
// // // // // // // // //         flex: 1,
// // // // // // // // //     },
// // // // // // // // //     modalHeader: {
// // // // // // // // //         flexDirection: 'row',
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //         justifyContent: 'space-between',
// // // // // // // // //         paddingHorizontal: 16,
// // // // // // // // //         paddingVertical: 14,
// // // // // // // // //         borderBottomWidth: 1,
// // // // // // // // //     },
// // // // // // // // //     modalBackButton: {
// // // // // // // // //         width: 40,
// // // // // // // // //         height: 40,
// // // // // // // // //         justifyContent: 'center',
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //     },
// // // // // // // // //     modalTitle: {
// // // // // // // // //         fontSize: 18,
// // // // // // // // //         fontWeight: '600',
// // // // // // // // //     },
// // // // // // // // //     modalContent: {
// // // // // // // // //         flex: 1,
// // // // // // // // //         padding: 16,
// // // // // // // // //     },
// // // // // // // // //     detailCard: {
// // // // // // // // //         borderRadius: 24,
// // // // // // // // //         padding: 20,
// // // // // // // // //         marginBottom: 16,
// // // // // // // // //         shadowColor: '#000',
// // // // // // // // //         shadowOffset: { width: 0, height: 4 },
// // // // // // // // //         shadowOpacity: 0.1,
// // // // // // // // //         shadowRadius: 12,
// // // // // // // // //         elevation: 6,
// // // // // // // // //     },
// // // // // // // // //     detailHeader: {
// // // // // // // // //         flexDirection: 'row',
// // // // // // // // //         justifyContent: 'space-between',
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //         marginBottom: 20,
// // // // // // // // //         flexWrap: 'wrap',
// // // // // // // // //         gap: 12,
// // // // // // // // //     },
// // // // // // // // //     detailDateSection: {
// // // // // // // // //         flexDirection: 'row',
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //         gap: 8,
// // // // // // // // //     },
// // // // // // // // //     detailDate: {
// // // // // // // // //         fontSize: 14,
// // // // // // // // //         fontWeight: '500',
// // // // // // // // //     },
// // // // // // // // //     detailBadges: {
// // // // // // // // //         flexDirection: 'row',
// // // // // // // // //         gap: 8,
// // // // // // // // //     },
// // // // // // // // //     detailSubjectBadge: {
// // // // // // // // //         flexDirection: 'row',
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //         paddingHorizontal: 12,
// // // // // // // // //         paddingVertical: 6,
// // // // // // // // //         borderRadius: 20,
// // // // // // // // //         gap: 6,
// // // // // // // // //     },
// // // // // // // // //     detailSubject: {
// // // // // // // // //         fontSize: 13,
// // // // // // // // //         fontWeight: '600',
// // // // // // // // //     },
// // // // // // // // //     detailStatusBadge: {
// // // // // // // // //         flexDirection: 'row',
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //         paddingHorizontal: 10,
// // // // // // // // //         paddingVertical: 4,
// // // // // // // // //         borderRadius: 12,
// // // // // // // // //         gap: 6,
// // // // // // // // //     },
// // // // // // // // //     detailStatus: {
// // // // // // // // //         fontSize: 11,
// // // // // // // // //         fontWeight: '600',
// // // // // // // // //     },
// // // // // // // // //     detailTeacherSection: {
// // // // // // // // //         flexDirection: 'row',
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //         gap: 12,
// // // // // // // // //         marginBottom: 20,
// // // // // // // // //     },
// // // // // // // // //     detailTeacherAvatar: {
// // // // // // // // //         width: 48,
// // // // // // // // //         height: 48,
// // // // // // // // //         borderRadius: 24,
// // // // // // // // //         justifyContent: 'center',
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //     },
// // // // // // // // //     detailTeacherLabel: {
// // // // // // // // //         fontSize: 12,
// // // // // // // // //         marginBottom: 2,
// // // // // // // // //     },
// // // // // // // // //     detailTeacher: {
// // // // // // // // //         fontSize: 16,
// // // // // // // // //         fontWeight: '500',
// // // // // // // // //     },
// // // // // // // // //     divider: {
// // // // // // // // //         height: 1,
// // // // // // // // //         backgroundColor: '#e2e8f0',
// // // // // // // // //         marginVertical: 16,
// // // // // // // // //     },
// // // // // // // // //     detailContentSection: {
// // // // // // // // //         marginTop: 8,
// // // // // // // // //     },
// // // // // // // // //     detailContentTitle: {
// // // // // // // // //         fontSize: 16,
// // // // // // // // //         fontWeight: '600',
// // // // // // // // //         marginBottom: 12,
// // // // // // // // //     },
// // // // // // // // //     webView: {
// // // // // // // // //         backgroundColor: 'transparent',
// // // // // // // // //     },
// // // // // // // // //     emptyContent: {
// // // // // // // // //         justifyContent: 'center',
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //         padding: 40,
// // // // // // // // //     },
// // // // // // // // //     emptyContentText: {
// // // // // // // // //         fontSize: 14,
// // // // // // // // //         marginTop: 8,
// // // // // // // // //     },
// // // // // // // // //     datePickerModalOverlay: {
// // // // // // // // //         flex: 1,
// // // // // // // // //         backgroundColor: 'rgba(0,0,0,0.5)',
// // // // // // // // //         justifyContent: 'flex-end',
// // // // // // // // //     },
// // // // // // // // //     datePickerModalContent: {
// // // // // // // // //         borderTopLeftRadius: 20,
// // // // // // // // //         borderTopRightRadius: 20,
// // // // // // // // //         overflow: 'hidden',
// // // // // // // // //     },
// // // // // // // // //     datePickerModalHeader: {
// // // // // // // // //         flexDirection: 'row',
// // // // // // // // //         justifyContent: 'space-between',
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //         paddingHorizontal: 16,
// // // // // // // // //         paddingVertical: 12,
// // // // // // // // //         borderBottomWidth: 1,
// // // // // // // // //     },
// // // // // // // // //     datePickerModalCancel: {
// // // // // // // // //         fontSize: 16,
// // // // // // // // //     },
// // // // // // // // //     datePickerModalTitle: {
// // // // // // // // //         fontSize: 16,
// // // // // // // // //         fontWeight: '600',
// // // // // // // // //     },
// // // // // // // // //     datePickerModalConfirm: {
// // // // // // // // //         fontSize: 16,
// // // // // // // // //         fontWeight: '600',
// // // // // // // // //     },
// // // // // // // // // });

// // // // // // // // // export default ChildDiaryScreen;


// // // // // // // // // src/screens/Parent/ChildDiaryScreen.js
// // // // // // // // import React, { useState, useEffect, useCallback, useRef } from 'react';
// // // // // // // // import {
// // // // // // // //     View,
// // // // // // // //     Text,
// // // // // // // //     StyleSheet,
// // // // // // // //     TouchableOpacity,
// // // // // // // //     FlatList,
// // // // // // // //     ActivityIndicator,
// // // // // // // //     RefreshControl,
// // // // // // // //     TextInput,
// // // // // // // //     Alert,
// // // // // // // //     Modal,
// // // // // // // //     Dimensions,
// // // // // // // //     SafeAreaView,
// // // // // // // //     Animated,
// // // // // // // //     Platform,
// // // // // // // //     LayoutAnimation,
// // // // // // // //     UIManager,
// // // // // // // //     ScrollView,
// // // // // // // // } from 'react-native';
// // // // // // // // import { useSelector } from 'react-redux';
// // // // // // // // import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// // // // // // // // import { WebView } from 'react-native-webview';
// // // // // // // // import DateTimePicker from '@react-native-community/datetimepicker';
// // // // // // // // import { selectThemeData } from '../../store/slices/themeSlice';
// // // // // // // // import { useGetChildDiaryQuery } from '../../store/attendanceApi';

// // // // // // // // // Enable LayoutAnimation for Android
// // // // // // // // if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
// // // // // // // //     UIManager.setLayoutAnimationEnabledExperimental(true);
// // // // // // // // }

// // // // // // // // const { width: SCREEN_WIDTH } = Dimensions.get('window');

// // // // // // // // // Skeleton Loader Component
// // // // // // // // const SkeletonLoader = ({ theme }) => (
// // // // // // // //     <View style={styles.skeletonContainer}>
// // // // // // // //         {[1, 2, 3].map((item) => (
// // // // // // // //             <View key={item} style={[styles.skeletonCard, { backgroundColor: theme.card }]}>
// // // // // // // //                 <View style={styles.skeletonHeader}>
// // // // // // // //                     <View style={[styles.skeletonDate, { backgroundColor: theme.border }]} />
// // // // // // // //                     <View style={[styles.skeletonBadge, { backgroundColor: theme.border }]} />
// // // // // // // //                 </View>
// // // // // // // //                 <View style={[styles.skeletonLine, { backgroundColor: theme.border }]} />
// // // // // // // //                 <View style={[styles.skeletonLine, { backgroundColor: theme.border, width: '80%' }]} />
// // // // // // // //                 <View style={styles.skeletonFooter}>
// // // // // // // //                     <View style={[styles.skeletonAvatar, { backgroundColor: theme.border }]} />
// // // // // // // //                     <View style={[styles.skeletonText, { backgroundColor: theme.border }]} />
// // // // // // // //                 </View>
// // // // // // // //             </View>
// // // // // // // //         ))}
// // // // // // // //     </View>
// // // // // // // // );

// // // // // // // // // HTML Content Renderer with Dynamic Auto Height
// // // // // // // // const HTMLContentView = ({ htmlContent, theme }) => {
// // // // // // // //     const [webViewHeight, setWebViewHeight] = useState(100);
// // // // // // // //     const webViewRef = useRef(null);
// // // // // // // //     const [isLoading, setIsLoading] = useState(true);
// // // // // // // //     const [hasError, setHasError] = useState(false);

// // // // // // // //     const getHTML = (content) => {
// // // // // // // //         return `
// // // // // // // //             <!DOCTYPE html>
// // // // // // // //             <html>
// // // // // // // //             <head>
// // // // // // // //                 <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
// // // // // // // //                 <style>
// // // // // // // //                     * {
// // // // // // // //                         margin: 0;
// // // // // // // //                         padding: 0;
// // // // // // // //                         box-sizing: border-box;
// // // // // // // //                     }
// // // // // // // //                     body {
// // // // // // // //                         font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
// // // // // // // //                         font-size: 16px;
// // // // // // // //                         line-height: 1.6;
// // // // // // // //                         color: ${theme.isDarkMode ? '#e0e0e0' : '#2c3e50'};
// // // // // // // //                         padding: 0;
// // // // // // // //                         background: transparent;
// // // // // // // //                         overflow-x: hidden;
// // // // // // // //                     }
// // // // // // // //                     h1 { 
// // // // // // // //                         font-size: 28px; 
// // // // // // // //                         font-weight: 700; 
// // // // // // // //                         margin: 16px 0 12px 0; 
// // // // // // // //                         color: ${theme.isDarkMode ? '#fff' : '#1a1a2e'}; 
// // // // // // // //                     }
// // // // // // // //                     h2 { 
// // // // // // // //                         font-size: 24px; 
// // // // // // // //                         font-weight: 600; 
// // // // // // // //                         margin: 14px 0 10px 0; 
// // // // // // // //                         color: ${theme.isDarkMode ? '#fff' : '#1a1a2e'}; 
// // // // // // // //                     }
// // // // // // // //                     h3 { 
// // // // // // // //                         font-size: 20px; 
// // // // // // // //                         font-weight: 600; 
// // // // // // // //                         margin: 12px 0 8px 0; 
// // // // // // // //                     }
// // // // // // // //                     p { 
// // // // // // // //                         margin-bottom: 12px; 
// // // // // // // //                         line-height: 1.6;
// // // // // // // //                     }
// // // // // // // //                     strong, b { 
// // // // // // // //                         font-weight: 700; 
// // // // // // // //                         color: ${theme.primary}; 
// // // // // // // //                     }
// // // // // // // //                     em, i { 
// // // // // // // //                         font-style: italic; 
// // // // // // // //                     }
// // // // // // // //                     ul, ol { 
// // // // // // // //                         margin-bottom: 12px; 
// // // // // // // //                         padding-left: 24px; 
// // // // // // // //                     }
// // // // // // // //                     li { 
// // // // // // // //                         margin-bottom: 6px; 
// // // // // // // //                     }
// // // // // // // //                     img { 
// // // // // // // //                         max-width: 100%; 
// // // // // // // //                         height: auto; 
// // // // // // // //                         border-radius: 12px; 
// // // // // // // //                         margin: 16px 0;
// // // // // // // //                         display: block;
// // // // // // // //                     }
// // // // // // // //                     table {
// // // // // // // //                         width: 100%;
// // // // // // // //                         border-collapse: collapse;
// // // // // // // //                         margin-bottom: 12px;
// // // // // // // //                         border-radius: 8px;
// // // // // // // //                         overflow-x: auto;
// // // // // // // //                     }
// // // // // // // //                     th, td {
// // // // // // // //                         border: 1px solid ${theme.isDarkMode ? '#444' : '#e2e8f0'};
// // // // // // // //                         padding: 10px;
// // // // // // // //                         text-align: left;
// // // // // // // //                     }
// // // // // // // //                     th {
// // // // // // // //                         background-color: ${theme.isDarkMode ? '#2d3748' : '#f7fafc'};
// // // // // // // //                         font-weight: 600;
// // // // // // // //                     }
// // // // // // // //                     blockquote {
// // // // // // // //                         margin: 12px 0;
// // // // // // // //                         padding-left: 16px;
// // // // // // // //                         border-left: 4px solid ${theme.primary || '#4CAF50'};
// // // // // // // //                         color: ${theme.isDarkMode ? '#a0aec0' : '#718096'};
// // // // // // // //                         font-style: italic;
// // // // // // // //                     }
// // // // // // // //                     a {
// // // // // // // //                         color: ${theme.primary};
// // // // // // // //                         text-decoration: none;
// // // // // // // //                     }
// // // // // // // //                     .content-wrapper {
// // // // // // // //                         padding: 0;
// // // // // // // //                         width: 100%;
// // // // // // // //                         overflow-x: hidden;
// // // // // // // //                     }
// // // // // // // //                     pre {
// // // // // // // //                         background-color: ${theme.isDarkMode ? '#2d3748' : '#f7fafc'};
// // // // // // // //                         padding: 12px;
// // // // // // // //                         border-radius: 8px;
// // // // // // // //                         overflow-x: auto;
// // // // // // // //                         margin-bottom: 12px;
// // // // // // // //                     }
// // // // // // // //                     code {
// // // // // // // //                         font-family: monospace;
// // // // // // // //                         font-size: 14px;
// // // // // // // //                     }
// // // // // // // //                 </style>
// // // // // // // //                 <script>
// // // // // // // //                     function sendHeight() {
// // // // // // // //                         try {
// // // // // // // //                             var height = Math.max(
// // // // // // // //                                 document.body.scrollHeight,
// // // // // // // //                                 document.documentElement.scrollHeight,
// // // // // // // //                                 document.body.offsetHeight,
// // // // // // // //                                 document.documentElement.offsetHeight
// // // // // // // //                             );
// // // // // // // //                             window.ReactNativeWebView.postMessage(JSON.stringify({
// // // // // // // //                                 type: 'height',
// // // // // // // //                                 height: height
// // // // // // // //                             }));
// // // // // // // //                         } catch(e) {}
// // // // // // // //                     }
                    
// // // // // // // //                     function checkImages() {
// // // // // // // //                         var images = document.querySelectorAll('img');
// // // // // // // //                         var loadedCount = 0;
                        
// // // // // // // //                         function imageLoaded() {
// // // // // // // //                             loadedCount++;
// // // // // // // //                             if (loadedCount === images.length) {
// // // // // // // //                                 sendHeight();
// // // // // // // //                             }
// // // // // // // //                         }
                        
// // // // // // // //                         if (images.length === 0) {
// // // // // // // //                             sendHeight();
// // // // // // // //                         } else {
// // // // // // // //                             images.forEach(function(img) {
// // // // // // // //                                 if (img.complete) {
// // // // // // // //                                     imageLoaded();
// // // // // // // //                                 } else {
// // // // // // // //                                     img.addEventListener('load', imageLoaded);
// // // // // // // //                                     img.addEventListener('error', imageLoaded);
// // // // // // // //                                 }
// // // // // // // //                             });
// // // // // // // //                         }
// // // // // // // //                     }
                    
// // // // // // // //                     window.onload = function() {
// // // // // // // //                         sendHeight();
// // // // // // // //                         setTimeout(sendHeight, 100);
// // // // // // // //                         setTimeout(sendHeight, 300);
// // // // // // // //                         setTimeout(sendHeight, 500);
// // // // // // // //                         setTimeout(sendHeight, 1000);
// // // // // // // //                         checkImages();
// // // // // // // //                     };
                    
// // // // // // // //                     window.onresize = function() {
// // // // // // // //                         setTimeout(sendHeight, 50);
// // // // // // // //                     };
                    
// // // // // // // //                     var observer = new MutationObserver(function() {
// // // // // // // //                         sendHeight();
// // // // // // // //                     });
// // // // // // // //                     observer.observe(document.body, {
// // // // // // // //                         childList: true,
// // // // // // // //                         subtree: true,
// // // // // // // //                         attributes: true,
// // // // // // // //                         attributeFilter: ['style', 'class', 'src']
// // // // // // // //                     });
// // // // // // // //                 </script>
// // // // // // // //             </head>
// // // // // // // //             <body>
// // // // // // // //                 <div class="content-wrapper">
// // // // // // // //                     ${content || '<p style="color: #a0aec0; text-align: center;">✨ No content available</p>'}
// // // // // // // //                 </div>
// // // // // // // //             </body>
// // // // // // // //             </html>
// // // // // // // //         `;
// // // // // // // //     };

// // // // // // // //     const handleMessage = (event) => {
// // // // // // // //         try {
// // // // // // // //             const data = JSON.parse(event.nativeEvent.data);
// // // // // // // //             if (data.type === 'height' && data.height && data.height > 0) {
// // // // // // // //                 const newHeight = data.height + 20;
// // // // // // // //                 if (Math.abs(newHeight - webViewHeight) > 10) {
// // // // // // // //                     setWebViewHeight(newHeight);
// // // // // // // //                 }
// // // // // // // //                 setIsLoading(false);
// // // // // // // //             }
// // // // // // // //         } catch (error) {}
// // // // // // // //     };

// // // // // // // //     const handleLoadEnd = () => {
// // // // // // // //         setIsLoading(false);
// // // // // // // //     };

// // // // // // // //     const handleError = () => {
// // // // // // // //         setHasError(true);
// // // // // // // //         setIsLoading(false);
// // // // // // // //     };

// // // // // // // //     if (!htmlContent || htmlContent === '<p><br></p>' || htmlContent === '<p></p>' || htmlContent === ' ') {
// // // // // // // //         return (
// // // // // // // //             <View style={styles.emptyContent}>
// // // // // // // //                 <Icon name="file-document-outline" size={32} color="#a0aec0" />
// // // // // // // //                 <Text style={[styles.emptyContentText, { color: theme.textSecondary }]}>
// // // // // // // //                     No content available
// // // // // // // //                 </Text>
// // // // // // // //             </View>
// // // // // // // //         );
// // // // // // // //     }

// // // // // // // //     if (hasError) {
// // // // // // // //         return (
// // // // // // // //             <View style={styles.emptyContent}>
// // // // // // // //                 <Icon name="web-off" size={32} color={theme.error} />
// // // // // // // //                 <Text style={[styles.emptyContentText, { color: theme.textSecondary }]}>
// // // // // // // //                     Unable to load content
// // // // // // // //                 </Text>
// // // // // // // //             </View>
// // // // // // // //         );
// // // // // // // //     }

// // // // // // // //     return (
// // // // // // // //         <View style={{ minHeight: 100 }}>
// // // // // // // //             {isLoading && (
// // // // // // // //                 <View style={styles.webViewLoader}>
// // // // // // // //                     <ActivityIndicator size="small" color={theme.primary} />
// // // // // // // //                 </View>
// // // // // // // //             )}
// // // // // // // //             <WebView
// // // // // // // //                 ref={webViewRef}
// // // // // // // //                 source={{ html: getHTML(htmlContent) }}
// // // // // // // //                 onMessage={handleMessage}
// // // // // // // //                 onLoadEnd={handleLoadEnd}
// // // // // // // //                 onError={handleError}
// // // // // // // //                 style={[
// // // // // // // //                     styles.webView,
// // // // // // // //                     {
// // // // // // // //                         height: webViewHeight,
// // // // // // // //                         opacity: isLoading ? 0 : 1,
// // // // // // // //                     }
// // // // // // // //                 ]}
// // // // // // // //                 scrollEnabled={false}
// // // // // // // //                 showsVerticalScrollIndicator={false}
// // // // // // // //                 originWhitelist={['*']}
// // // // // // // //                 androidLayerType="software"
// // // // // // // //                 containerStyle={{ backgroundColor: 'transparent' }}
// // // // // // // //                 onContentProcessDidTerminate={() => {
// // // // // // // //                     webViewRef.current?.reload();
// // // // // // // //                 }}
// // // // // // // //             />
// // // // // // // //         </View>
// // // // // // // //     );
// // // // // // // // };

// // // // // // // // // Diary Card Component
// // // // // // // // const DiaryCard = ({ item, theme, onPress }) => {
// // // // // // // //     const scaleAnim = useRef(new Animated.Value(1)).current;
// // // // // // // //     const [showFullPreview, setShowFullPreview] = useState(false);
    
// // // // // // // //     // Strip HTML tags for preview
// // // // // // // //     const getPlainText = (html) => {
// // // // // // // //         if (!html) return 'No preview available';
// // // // // // // //         return html.replace(/<[^>]*>/g, '').substring(0, 120);
// // // // // // // //     };

// // // // // // // //     const plainTextPreview = getPlainText(item.content);
// // // // // // // //     const formatDate = (dateString) => {
// // // // // // // //         const date = new Date(dateString);
// // // // // // // //         return date.toLocaleDateString('en-US', { 
// // // // // // // //             month: 'short', 
// // // // // // // //             day: 'numeric',
// // // // // // // //             year: 'numeric'
// // // // // // // //         });
// // // // // // // //     };

// // // // // // // //     const handlePressIn = () => {
// // // // // // // //         Animated.spring(scaleAnim, {
// // // // // // // //             toValue: 0.98,
// // // // // // // //             useNativeDriver: true,
// // // // // // // //             speed: 50,
// // // // // // // //         }).start();
// // // // // // // //     };

// // // // // // // //     const handlePressOut = () => {
// // // // // // // //         Animated.spring(scaleAnim, {
// // // // // // // //             toValue: 1,
// // // // // // // //             useNativeDriver: true,
// // // // // // // //             speed: 50,
// // // // // // // //         }).start();
// // // // // // // //     };

// // // // // // // //     return (
// // // // // // // //         <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
// // // // // // // //             <TouchableOpacity
// // // // // // // //                 activeOpacity={0.9}
// // // // // // // //                 onPressIn={handlePressIn}
// // // // // // // //                 onPressOut={handlePressOut}
// // // // // // // //                 onPress={() => onPress(item)}
// // // // // // // //                 style={[styles.entryCard, { backgroundColor: theme.card }]}
// // // // // // // //             >
// // // // // // // //                 <View style={styles.cardHeader}>
// // // // // // // //                     <View style={styles.dateSection}>
// // // // // // // //                         <View style={[styles.dateBadge, { backgroundColor: theme.primary + '15' }]}>
// // // // // // // //                             <Icon name="calendar-today" size={14} color={theme.primary} />
// // // // // // // //                             <Text style={[styles.dateText, { color: theme.text }]}>
// // // // // // // //                                 {formatDate(item.date)}
// // // // // // // //                             </Text>
// // // // // // // //                         </View>
// // // // // // // //                         <Text style={[styles.dayText, { color: theme.textSecondary }]}>
// // // // // // // //                             {item.day}
// // // // // // // //                         </Text>
// // // // // // // //                     </View>
// // // // // // // //                     <View style={[styles.subjectBadge, { backgroundColor: theme.primary + '15' }]}>
// // // // // // // //                         <Icon name="book-open-variant" size={12} color={theme.primary} />
// // // // // // // //                         <Text style={[styles.subjectText, { color: theme.primary }]}>
// // // // // // // //                             {item.subject}
// // // // // // // //                         </Text>
// // // // // // // //                     </View>
// // // // // // // //                 </View>

// // // // // // // //                 <Text style={[styles.previewText, { color: theme.text }]} numberOfLines={2}>
// // // // // // // //                     {plainTextPreview}
// // // // // // // //                 </Text>

// // // // // // // //                 <View style={styles.cardFooter}>
// // // // // // // //                     <View style={styles.teacherSection}>
// // // // // // // //                         <View style={[styles.teacherAvatar, { backgroundColor: theme.primary + '15' }]}>
// // // // // // // //                             <Icon name="account" size={14} color={theme.primary} />
// // // // // // // //                         </View>
// // // // // // // //                         <Text style={[styles.teacherText, { color: theme.textSecondary }]}>
// // // // // // // //                             {item.teacher}
// // // // // // // //                         </Text>
// // // // // // // //                     </View>
// // // // // // // //                     <View style={[
// // // // // // // //                         styles.statusBadge,
// // // // // // // //                         { backgroundColor: item.isPublished ? theme.success + '15' : theme.warning + '15' }
// // // // // // // //                     ]}>
// // // // // // // //                         <View style={[
// // // // // // // //                             styles.statusDot,
// // // // // // // //                             { backgroundColor: item.isPublished ? theme.success : theme.warning }
// // // // // // // //                         ]} />
// // // // // // // //                         <Text style={[
// // // // // // // //                             styles.statusText,
// // // // // // // //                             { color: item.isPublished ? theme.success : theme.warning }
// // // // // // // //                         ]}>
// // // // // // // //                             {item.isPublished ? 'Published' : 'Draft'}
// // // // // // // //                         </Text>
// // // // // // // //                     </View>
// // // // // // // //                 </View>
// // // // // // // //             </TouchableOpacity>
// // // // // // // //         </Animated.View>
// // // // // // // //     );
// // // // // // // // };

// // // // // // // // // Filter Chip Component
// // // // // // // // const FilterChip = ({ label, isActive, onPress, icon, theme }) => (
// // // // // // // //     <TouchableOpacity
// // // // // // // //         style={[
// // // // // // // //             styles.filterChip,
// // // // // // // //             { backgroundColor: isActive ? theme.primary : theme.card },
// // // // // // // //             isActive && styles.filterChipActive
// // // // // // // //         ]}
// // // // // // // //         onPress={onPress}
// // // // // // // //         activeOpacity={0.7}
// // // // // // // //     >
// // // // // // // //         {icon && <Icon name={icon} size={16} color={isActive ? '#FFF' : theme.textSecondary} />}
// // // // // // // //         <Text style={[
// // // // // // // //             styles.filterChipText,
// // // // // // // //             { color: isActive ? '#FFF' : theme.text }
// // // // // // // //         ]}>
// // // // // // // //             {label}
// // // // // // // //         </Text>
// // // // // // // //     </TouchableOpacity>
// // // // // // // // );

// // // // // // // // // Date Picker Modal Component
// // // // // // // // const DatePickerModal = ({ visible, onClose, onSelectDate, selectedDate, theme }) => {
// // // // // // // //     const [tempDate, setTempDate] = useState(selectedDate ? new Date(selectedDate) : new Date());
// // // // // // // //     const [showPicker, setShowPicker] = useState(false);

// // // // // // // //     useEffect(() => {
// // // // // // // //         if (visible) {
// // // // // // // //             setShowPicker(true);
// // // // // // // //         }
// // // // // // // //     }, [visible]);

// // // // // // // //     const handleDateChange = (event, date) => {
// // // // // // // //         if (Platform.OS === 'android') {
// // // // // // // //             setShowPicker(false);
// // // // // // // //         }
        
// // // // // // // //         if (date) {
// // // // // // // //             setTempDate(date);
// // // // // // // //             if (Platform.OS === 'android') {
// // // // // // // //                 const dateString = date.toISOString().split('T')[0];
// // // // // // // //                 onSelectDate(dateString);
// // // // // // // //                 onClose();
// // // // // // // //             }
// // // // // // // //         } else if (Platform.OS === 'android') {
// // // // // // // //             onClose();
// // // // // // // //         }
// // // // // // // //     };

// // // // // // // //     const handleIOSConfirm = () => {
// // // // // // // //         const dateString = tempDate.toISOString().split('T')[0];
// // // // // // // //         onSelectDate(dateString);
// // // // // // // //         onClose();
// // // // // // // //     };

// // // // // // // //     const handleIOSCancel = () => {
// // // // // // // //         onClose();
// // // // // // // //     };

// // // // // // // //     if (!showPicker) return null;

// // // // // // // //     if (Platform.OS === 'ios') {
// // // // // // // //         return (
// // // // // // // //             <Modal
// // // // // // // //                 visible={visible}
// // // // // // // //                 transparent={true}
// // // // // // // //                 animationType="slide"
// // // // // // // //                 onRequestClose={onClose}
// // // // // // // //             >
// // // // // // // //                 <View style={styles.datePickerModalOverlay}>
// // // // // // // //                     <View style={[styles.datePickerModalContent, { backgroundColor: theme.card }]}>
// // // // // // // //                         <View style={[styles.datePickerModalHeader, { borderBottomColor: theme.border }]}>
// // // // // // // //                             <TouchableOpacity onPress={handleIOSCancel}>
// // // // // // // //                                 <Text style={[styles.datePickerModalCancel, { color: theme.error }]}>Cancel</Text>
// // // // // // // //                             </TouchableOpacity>
// // // // // // // //                             <Text style={[styles.datePickerModalTitle, { color: theme.text }]}>Select Date</Text>
// // // // // // // //                             <TouchableOpacity onPress={handleIOSConfirm}>
// // // // // // // //                                 <Text style={[styles.datePickerModalConfirm, { color: theme.primary }]}>Done</Text>
// // // // // // // //                             </TouchableOpacity>
// // // // // // // //                         </View>
// // // // // // // //                         <DateTimePicker
// // // // // // // //                             value={tempDate}
// // // // // // // //                             mode="date"
// // // // // // // //                             display="spinner"
// // // // // // // //                             onChange={handleDateChange}
// // // // // // // //                             themeVariant={theme.isDarkMode ? 'dark' : 'light'}
// // // // // // // //                         />
// // // // // // // //                     </View>
// // // // // // // //                 </View>
// // // // // // // //             </Modal>
// // // // // // // //         );
// // // // // // // //     }

// // // // // // // //     return (
// // // // // // // //         <DateTimePicker
// // // // // // // //             value={tempDate}
// // // // // // // //             mode="date"
// // // // // // // //             display="default"
// // // // // // // //             onChange={handleDateChange}
// // // // // // // //         />
// // // // // // // //     );
// // // // // // // // };

// // // // // // // // const ChildDiaryScreen = ({ route, navigation }) => {
// // // // // // // //     const theme = useSelector(selectThemeData);
// // // // // // // //     const { childId, childName } = route.params;

// // // // // // // //     const [refreshing, setRefreshing] = useState(false);
// // // // // // // //     const [diaryEntries, setDiaryEntries] = useState([]);
// // // // // // // //     const [filteredEntries, setFilteredEntries] = useState([]);
// // // // // // // //     const [selectedDate, setSelectedDate] = useState('');
// // // // // // // //     const [selectedSubject, setSelectedSubject] = useState('All');
// // // // // // // //     const [searchQuery, setSearchQuery] = useState('');
// // // // // // // //     const [selectedEntry, setSelectedEntry] = useState(null);
// // // // // // // //     const [showDetailModal, setShowDetailModal] = useState(false);
// // // // // // // //     const [subjects, setSubjects] = useState([]);
// // // // // // // //     const [availableDates, setAvailableDates] = useState([]);
// // // // // // // //     const [isSearchFocused, setIsSearchFocused] = useState(false);
// // // // // // // //     const [showDatePicker, setShowDatePicker] = useState(false);
// // // // // // // //     const [apiFilters, setApiFilters] = useState({
// // // // // // // //         month: new Date().getMonth() + 1,
// // // // // // // //         year: new Date().getFullYear(),
// // // // // // // //     });

// // // // // // // //     const fadeAnim = useRef(new Animated.Value(0)).current;

// // // // // // // //     const {
// // // // // // // //         data: diaryResponse,
// // // // // // // //         isLoading,
// // // // // // // //         isFetching,
// // // // // // // //         error,
// // // // // // // //         refetch,
// // // // // // // //     } = useGetChildDiaryQuery({
// // // // // // // //         childId,
// // // // // // // //         filters: {
// // // // // // // //             month: apiFilters.month,
// // // // // // // //             year: apiFilters.year,
// // // // // // // //             date: selectedDate || undefined,
// // // // // // // //             subjectId: selectedSubject !== 'All' ? selectedSubject : null,
// // // // // // // //         },
// // // // // // // //     });

// // // // // // // //     useEffect(() => {
// // // // // // // //         if (diaryResponse?.success === true && diaryResponse?.data?.entries) {
// // // // // // // //             processDiaryData(diaryResponse.data.entries);
// // // // // // // //             Animated.timing(fadeAnim, {
// // // // // // // //                 toValue: 1,
// // // // // // // //                 duration: 500,
// // // // // // // //                 useNativeDriver: true,
// // // // // // // //             }).start();
// // // // // // // //         }
// // // // // // // //     }, [diaryResponse]);

// // // // // // // //     useEffect(() => {
// // // // // // // //         filterEntries();
// // // // // // // //     }, [searchQuery, selectedSubject, selectedDate, diaryEntries]);

// // // // // // // //     const processDiaryData = (entries) => {
// // // // // // // //         const transformedEntries = entries.map(entry => {
// // // // // // // //             const dateObj = entry.date ? new Date(entry.date) : new Date();
// // // // // // // //             const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
// // // // // // // //             const dayName = !isNaN(dateObj.getTime()) ? dayNames[dateObj.getDay()] : '';

// // // // // // // //             return {
// // // // // // // //                 id: entry.id,
// // // // // // // //                 date: entry.date || '',
// // // // // // // //                 day: dayName,
// // // // // // // //                 subject: entry.subject || 'General',
// // // // // // // //                 subjectId: entry.subjectId,
// // // // // // // //                 content: entry.content || '',
// // // // // // // //                 teacher: entry.teacher || 'Teacher',
// // // // // // // //                 isPublished: entry.isPublished || false,
// // // // // // // //                 createdAt: entry.createdAt,
// // // // // // // //             };
// // // // // // // //         });

// // // // // // // //         const sortedEntries = transformedEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
        
// // // // // // // //         const uniqueSubjects = [...new Map(sortedEntries.map(entry => [
// // // // // // // //             entry.subjectId, { id: entry.subjectId, name: entry.subject }
// // // // // // // //         ])).values()];
// // // // // // // //         setSubjects(uniqueSubjects);
        
// // // // // // // //         const uniqueDates = [...new Set(sortedEntries.map(entry => entry.date))];
// // // // // // // //         setAvailableDates(uniqueDates);
        
// // // // // // // //         setDiaryEntries(sortedEntries);
// // // // // // // //         setFilteredEntries(sortedEntries);
// // // // // // // //     };

// // // // // // // //     const filterEntries = () => {
// // // // // // // //         let filtered = [...diaryEntries];
// // // // // // // //         if (searchQuery.trim()) {
// // // // // // // //             const query = searchQuery.toLowerCase();
// // // // // // // //             filtered = filtered.filter(entry =>
// // // // // // // //                 entry.subject.toLowerCase().includes(query) ||
// // // // // // // //                 entry.teacher.toLowerCase().includes(query) ||
// // // // // // // //                 (entry.content && entry.content.toLowerCase().includes(query))
// // // // // // // //             );
// // // // // // // //         }
// // // // // // // //         if (selectedSubject !== 'All') {
// // // // // // // //             filtered = filtered.filter(entry => entry.subjectId === selectedSubject);
// // // // // // // //         }
// // // // // // // //         if (selectedDate) {
// // // // // // // //             filtered = filtered.filter(entry => entry.date === selectedDate);
// // // // // // // //         }
// // // // // // // //         setFilteredEntries(filtered);
// // // // // // // //     };

// // // // // // // //     const onRefresh = async () => {
// // // // // // // //         setRefreshing(true);
// // // // // // // //         await refetch();
// // // // // // // //         setRefreshing(false);
// // // // // // // //     };

// // // // // // // //     const handleMonthChange = (offset) => {
// // // // // // // //         LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
// // // // // // // //         let newMonth = apiFilters.month + offset;
// // // // // // // //         let newYear = apiFilters.year;
// // // // // // // //         if (newMonth > 12) { newMonth = 1; newYear++; }
// // // // // // // //         if (newMonth < 1) { newMonth = 12; newYear--; }
// // // // // // // //         setApiFilters({ month: newMonth, year: newYear });
// // // // // // // //         setSelectedDate('');
// // // // // // // //     };

// // // // // // // //     const handleResetFilters = () => {
// // // // // // // //         LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
// // // // // // // //         setSelectedDate('');
// // // // // // // //         setSelectedSubject('All');
// // // // // // // //         setSearchQuery('');
// // // // // // // //     };

// // // // // // // //    // Update the handleEntryPress function in ChildDiaryScreen.js
// // // // // // // // const handleEntryPress = (entry) => {
// // // // // // // //     navigation.navigate('DiaryDetail', { entry });
// // // // // // // // };
// // // // // // // //     const formatFullDate = (dateString) => {
// // // // // // // //         const date = new Date(dateString);
// // // // // // // //         return date.toLocaleDateString('en-US', {
// // // // // // // //             weekday: 'long',
// // // // // // // //             year: 'numeric',
// // // // // // // //             month: 'long',
// // // // // // // //             day: 'numeric',
// // // // // // // //         });
// // // // // // // //     };

// // // // // // // //     const getMonthName = (month) => {
// // // // // // // //         return new Date(2000, month - 1, 1).toLocaleString('default', { month: 'long' });
// // // // // // // //     };

// // // // // // // //     const renderHeader = () => (
// // // // // // // //         <View style={[styles.headerGradient, { backgroundColor: theme.primary }]}>
// // // // // // // //             <SafeAreaView>
// // // // // // // //                 <View style={styles.header}>
// // // // // // // //                     <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
// // // // // // // //                         <Icon name="arrow-left" size={24} color="#FFF" />
// // // // // // // //                     </TouchableOpacity>
// // // // // // // //                     <View style={styles.headerContent}>
// // // // // // // //                         <Text style={styles.headerTitle}>{childName}'s Diary</Text>
// // // // // // // //                         <Text style={styles.headerSubtitle}>School activities & updates</Text>
// // // // // // // //                     </View>
// // // // // // // //                     <View style={styles.avatarContainer}>
// // // // // // // //                         <View style={[styles.avatarPlaceholder, { backgroundColor: '#ffffff30' }]}>
// // // // // // // //                             <Icon name="account-child" size={24} color="#FFF" />
// // // // // // // //                         </View>
// // // // // // // //                     </View>
// // // // // // // //                 </View>
// // // // // // // //             </SafeAreaView>
// // // // // // // //         </View>
// // // // // // // //     );

// // // // // // // //     const renderSearchBar = () => (
// // // // // // // //         <View style={[
// // // // // // // //             styles.searchWrapper,
// // // // // // // //             isSearchFocused && styles.searchWrapperFocused,
// // // // // // // //             { borderColor: theme.border, backgroundColor: theme.card }
// // // // // // // //         ]}>
// // // // // // // //             <Icon name="magnify" size={20} color={theme.textSecondary} />
// // // // // // // //             <TextInput
// // // // // // // //                 style={[styles.searchInput, { color: theme.text }]}
// // // // // // // //                 placeholder="Search by subject or teacher..."
// // // // // // // //                 placeholderTextColor={theme.textSecondary}
// // // // // // // //                 value={searchQuery}
// // // // // // // //                 onChangeText={setSearchQuery}
// // // // // // // //                 onFocus={() => setIsSearchFocused(true)}
// // // // // // // //                 onBlur={() => setIsSearchFocused(false)}
// // // // // // // //             />
// // // // // // // //             {searchQuery !== '' && (
// // // // // // // //                 <TouchableOpacity onPress={() => setSearchQuery('')}>
// // // // // // // //                     <Icon name="close-circle" size={20} color={theme.textSecondary} />
// // // // // // // //                 </TouchableOpacity>
// // // // // // // //             )}
// // // // // // // //         </View>
// // // // // // // //     );

// // // // // // // //     const renderFilters = () => (
// // // // // // // //         <View style={styles.filtersSection}>
// // // // // // // //             <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
// // // // // // // //                 <FilterChip
// // // // // // // //                     label="All"
// // // // // // // //                     isActive={selectedSubject === 'All'}
// // // // // // // //                     onPress={() => setSelectedSubject('All')}
// // // // // // // //                     theme={theme}
// // // // // // // //                 />
// // // // // // // //                 {subjects.map(subject => (
// // // // // // // //                     <FilterChip
// // // // // // // //                         key={subject.id}
// // // // // // // //                         label={subject.name}
// // // // // // // //                         isActive={selectedSubject === subject.id}
// // // // // // // //                         onPress={() => setSelectedSubject(subject.id)}
// // // // // // // //                         theme={theme}
// // // // // // // //                     />
// // // // // // // //                 ))}
// // // // // // // //                 <FilterChip
// // // // // // // //                     label={selectedDate ? formatFullDate(selectedDate).split(',')[0] : "Select Date"}
// // // // // // // //                     isActive={!!selectedDate}
// // // // // // // //                     onPress={() => setShowDatePicker(true)}
// // // // // // // //                     icon="calendar"
// // // // // // // //                     theme={theme}
// // // // // // // //                 />
// // // // // // // //             </ScrollView>
// // // // // // // //         </View>
// // // // // // // //     );

// // // // // // // //     const renderMonthNavigator = () => (
// // // // // // // //         <View style={[styles.monthNav, { backgroundColor: theme.card }]}>
// // // // // // // //             <TouchableOpacity onPress={() => handleMonthChange(-1)} style={styles.monthNavButton}>
// // // // // // // //                 <Icon name="chevron-left" size={24} color={theme.primary} />
// // // // // // // //             </TouchableOpacity>
// // // // // // // //             <View style={styles.monthDisplay}>
// // // // // // // //                 <Text style={[styles.monthText, { color: theme.text }]}>
// // // // // // // //                     {getMonthName(apiFilters.month)} {apiFilters.year}
// // // // // // // //                 </Text>
// // // // // // // //                 <Text style={[styles.entryCount, { color: theme.textSecondary }]}>
// // // // // // // //                     {filteredEntries.length} entries
// // // // // // // //                 </Text>
// // // // // // // //             </View>
// // // // // // // //             <TouchableOpacity onPress={() => handleMonthChange(1)} style={styles.monthNavButton}>
// // // // // // // //                 <Icon name="chevron-right" size={24} color={theme.primary} />
// // // // // // // //             </TouchableOpacity>
// // // // // // // //         </View>
// // // // // // // //     );

// // // // // // // //     const renderEmptyState = () => (
// // // // // // // //         <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
// // // // // // // //             <View style={[styles.emptyIconContainer, { backgroundColor: theme.primary + '10' }]}>
// // // // // // // //                 <Icon name="notebook-edit-outline" size={64} color={theme.primary} />
// // // // // // // //             </View>
// // // // // // // //             <Text style={[styles.emptyTitle, { color: theme.text }]}>
// // // // // // // //                 {searchQuery || selectedDate || selectedSubject !== 'All' 
// // // // // // // //                     ? 'No matching entries' 
// // // // // // // //                     : 'No diary entries yet'}
// // // // // // // //             </Text>
// // // // // // // //             <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
// // // // // // // //                 {searchQuery || selectedDate || selectedSubject !== 'All'
// // // // // // // //                     ? 'Try adjusting your filters to see more results'
// // // // // // // //                     : `No entries found for ${getMonthName(apiFilters.month)} ${apiFilters.year}`}
// // // // // // // //             </Text>
// // // // // // // //             {(searchQuery || selectedDate || selectedSubject !== 'All') && (
// // // // // // // //                 <TouchableOpacity style={[styles.emptyButton, { backgroundColor: theme.primary }]} onPress={handleResetFilters}>
// // // // // // // //                     <Text style={styles.emptyButtonText}>Clear Filters</Text>
// // // // // // // //                 </TouchableOpacity>
// // // // // // // //             )}
// // // // // // // //         </Animated.View>
// // // // // // // //     );

// // // // // // // //     const renderDetailModal = () => (
// // // // // // // //         <Modal
// // // // // // // //             visible={showDetailModal}
// // // // // // // //             animationType="slide"
// // // // // // // //             transparent={false}
// // // // // // // //             onRequestClose={() => setShowDetailModal(false)}
// // // // // // // //         >
// // // // // // // //             <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.background }]}>
// // // // // // // //                 <View style={[styles.modalHeader, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
// // // // // // // //                     <TouchableOpacity onPress={() => setShowDetailModal(false)} style={styles.modalBackButton}>
// // // // // // // //                         <Icon name="arrow-left" size={24} color={theme.text} />
// // // // // // // //                     </TouchableOpacity>
// // // // // // // //                     <Text style={[styles.modalTitle, { color: theme.text }]}>Diary Entry</Text>
// // // // // // // //                     <View style={{ width: 40 }} />
// // // // // // // //                 </View>
// // // // // // // //                 {selectedEntry && (
// // // // // // // //                     <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
// // // // // // // //                         <View style={[styles.detailCard, { backgroundColor: theme.card }]}>
// // // // // // // //                             <View style={styles.detailHeader}>
// // // // // // // //                                 <View style={styles.detailDateSection}>
// // // // // // // //                                     <Icon name="calendar" size={20} color={theme.primary} />
// // // // // // // //                                     <Text style={[styles.detailDate, { color: theme.text }]}>
// // // // // // // //                                         {formatFullDate(selectedEntry.date)}
// // // // // // // //                                     </Text>
// // // // // // // //                                 </View>
// // // // // // // //                                 <View style={styles.detailBadges}>
// // // // // // // //                                     <View style={[styles.detailSubjectBadge, { backgroundColor: theme.primary + '15' }]}>
// // // // // // // //                                         <Icon name="book-open-variant" size={14} color={theme.primary} />
// // // // // // // //                                         <Text style={[styles.detailSubject, { color: theme.primary }]}>
// // // // // // // //                                             {selectedEntry.subject}
// // // // // // // //                                         </Text>
// // // // // // // //                                     </View>
// // // // // // // //                                     <View style={[styles.detailStatusBadge, { 
// // // // // // // //                                         backgroundColor: selectedEntry.isPublished ? theme.success + '15' : theme.warning + '15' 
// // // // // // // //                                     }]}>
// // // // // // // //                                         <View style={[styles.statusDot, { 
// // // // // // // //                                             backgroundColor: selectedEntry.isPublished ? theme.success : theme.warning 
// // // // // // // //                                         }]} />
// // // // // // // //                                         <Text style={[styles.detailStatus, { 
// // // // // // // //                                             color: selectedEntry.isPublished ? theme.success : theme.warning 
// // // // // // // //                                         }]}>
// // // // // // // //                                             {selectedEntry.isPublished ? 'Published' : 'Draft'}
// // // // // // // //                                         </Text>
// // // // // // // //                                     </View>
// // // // // // // //                                 </View>
// // // // // // // //                             </View>

// // // // // // // //                             <View style={styles.detailTeacherSection}>
// // // // // // // //                                 <View style={[styles.detailTeacherAvatar, { backgroundColor: theme.primary + '15' }]}>
// // // // // // // //                                     <Icon name="account" size={20} color={theme.primary} />
// // // // // // // //                                 </View>
// // // // // // // //                                 <View>
// // // // // // // //                                     <Text style={[styles.detailTeacherLabel, { color: theme.textSecondary }]}>Teacher</Text>
// // // // // // // //                                     <Text style={[styles.detailTeacher, { color: theme.text }]}>{selectedEntry.teacher}</Text>
// // // // // // // //                                 </View>
// // // // // // // //                             </View>

// // // // // // // //                             <View style={styles.divider} />

// // // // // // // //                             <View style={styles.detailContentSection}>
// // // // // // // //                                 <Text style={[styles.detailContentTitle, { color: theme.text }]}>Content</Text>
// // // // // // // //                                 <HTMLContentView 
// // // // // // // //                                     htmlContent={selectedEntry.content} 
// // // // // // // //                                     theme={theme}
// // // // // // // //                                 />
// // // // // // // //                             </View>
// // // // // // // //                         </View>
// // // // // // // //                     </ScrollView>
// // // // // // // //                 )}
// // // // // // // //             </SafeAreaView>
// // // // // // // //         </Modal>
// // // // // // // //     );

// // // // // // // //     if (error) {
// // // // // // // //         return (
// // // // // // // //             <View style={[styles.container, { backgroundColor: theme.background }]}>
// // // // // // // //                 <View style={styles.errorContainer}>
// // // // // // // //                     <View style={[styles.errorIconContainer, { backgroundColor: theme.error + '10' }]}>
// // // // // // // //                         <Icon name="wifi-off" size={60} color={theme.error} />
// // // // // // // //                     </View>
// // // // // // // //                     <Text style={[styles.errorText, { color: theme.text }]}>Connection Error</Text>
// // // // // // // //                     <Text style={[styles.errorSubtext, { color: theme.textSecondary }]}>
// // // // // // // //                         Unable to connect to the server. Please check your internet connection.
// // // // // // // //                     </Text>
// // // // // // // //                     <TouchableOpacity style={[styles.retryButton, { backgroundColor: theme.primary }]} onPress={() => refetch()}>
// // // // // // // //                         <Text style={styles.retryButtonText}>Try Again</Text>
// // // // // // // //                     </TouchableOpacity>
// // // // // // // //                 </View>
// // // // // // // //             </View>
// // // // // // // //         );
// // // // // // // //     }

// // // // // // // //     return (
// // // // // // // //         <View style={[styles.container, { backgroundColor: theme.background }]}>
// // // // // // // //             {renderHeader()}
            
// // // // // // // //             <View style={styles.contentContainer}>
// // // // // // // //                 {renderSearchBar()}
// // // // // // // //                 {renderFilters()}
// // // // // // // //                 {renderMonthNavigator()}

// // // // // // // //                 {(isLoading || isFetching) && !refreshing ? (
// // // // // // // //                     <SkeletonLoader theme={theme} />
// // // // // // // //                 ) : (
// // // // // // // //                     <FlatList
// // // // // // // //                         data={filteredEntries}
// // // // // // // //                         renderItem={({ item }) => (
// // // // // // // //                             <DiaryCard
// // // // // // // //                                 item={item}
// // // // // // // //                                 theme={theme}
// // // // // // // //                                 onPress={handleEntryPress}
// // // // // // // //                             />
// // // // // // // //                         )}
// // // // // // // //                         keyExtractor={(item) => item.id?.toString()}
// // // // // // // //                         contentContainerStyle={styles.listContent}
// // // // // // // //                         refreshControl={
// // // // // // // //                             <RefreshControl
// // // // // // // //                                 refreshing={refreshing}
// // // // // // // //                                 onRefresh={onRefresh}
// // // // // // // //                                 colors={[theme.primary]}
// // // // // // // //                                 tintColor={theme.primary}
// // // // // // // //                             />
// // // // // // // //                         }
// // // // // // // //                         ListEmptyComponent={renderEmptyState()}
// // // // // // // //                         showsVerticalScrollIndicator={false}
// // // // // // // //                     />
// // // // // // // //                 )}
// // // // // // // //             </View>

// // // // // // // //             {renderDetailModal()}
            
// // // // // // // //             <DatePickerModal
// // // // // // // //                 visible={showDatePicker}
// // // // // // // //                 onClose={() => setShowDatePicker(false)}
// // // // // // // //                 onSelectDate={(date) => setSelectedDate(date)}
// // // // // // // //                 selectedDate={selectedDate}
// // // // // // // //                 theme={theme}
// // // // // // // //             />
// // // // // // // //         </View>
// // // // // // // //     );
// // // // // // // // };

// // // // // // // // const styles = StyleSheet.create({
// // // // // // // //     container: {
// // // // // // // //         flex: 1,
// // // // // // // //     },
// // // // // // // //     headerGradient: {
// // // // // // // //         borderBottomLeftRadius: 24,
// // // // // // // //         borderBottomRightRadius: 24,
// // // // // // // //         paddingBottom: 20,
// // // // // // // //     },
// // // // // // // //     header: {
// // // // // // // //         flexDirection: 'row',
// // // // // // // //         alignItems: 'center',
// // // // // // // //         paddingHorizontal: 20,
// // // // // // // //         paddingTop: Platform.OS === 'ios' ? 10 : 20,
// // // // // // // //     },
// // // // // // // //     backButton: {
// // // // // // // //         width: 40,
// // // // // // // //         height: 40,
// // // // // // // //         justifyContent: 'center',
// // // // // // // //         alignItems: 'center',
// // // // // // // //     },
// // // // // // // //     headerContent: {
// // // // // // // //         flex: 1,
// // // // // // // //         marginLeft: 12,
// // // // // // // //     },
// // // // // // // //     headerTitle: {
// // // // // // // //         fontSize: 20,
// // // // // // // //         fontWeight: '700',
// // // // // // // //         color: '#FFF',
// // // // // // // //     },
// // // // // // // //     headerSubtitle: {
// // // // // // // //         fontSize: 13,
// // // // // // // //         color: '#FFFFFFCC',
// // // // // // // //         marginTop: 2,
// // // // // // // //     },
// // // // // // // //     avatarContainer: {
// // // // // // // //         width: 44,
// // // // // // // //         height: 44,
// // // // // // // //     },
// // // // // // // //     avatarPlaceholder: {
// // // // // // // //         width: 44,
// // // // // // // //         height: 44,
// // // // // // // //         borderRadius: 22,
// // // // // // // //         justifyContent: 'center',
// // // // // // // //         alignItems: 'center',
// // // // // // // //         borderWidth: 2,
// // // // // // // //         borderColor: '#FFF',
// // // // // // // //     },
// // // // // // // //     contentContainer: {
// // // // // // // //         flex: 1,
// // // // // // // //         paddingTop: 16,
// // // // // // // //     },
// // // // // // // //     searchWrapper: {
// // // // // // // //         flexDirection: 'row',
// // // // // // // //         alignItems: 'center',
// // // // // // // //         marginHorizontal: 16,
// // // // // // // //         marginBottom: 12,
// // // // // // // //         paddingHorizontal: 16,
// // // // // // // //         paddingVertical: 12,
// // // // // // // //         borderRadius: 16,
// // // // // // // //         borderWidth: 1,
// // // // // // // //     },
// // // // // // // //     searchWrapperFocused: {
// // // // // // // //         borderWidth: 2,
// // // // // // // //     },
// // // // // // // //     searchInput: {
// // // // // // // //         flex: 1,
// // // // // // // //         fontSize: 16,
// // // // // // // //         marginLeft: 12,
// // // // // // // //         paddingVertical: 0,
// // // // // // // //     },
// // // // // // // //     filtersSection: {
// // // // // // // //         marginBottom: 12,
// // // // // // // //     },
// // // // // // // //     filtersScroll: {
// // // // // // // //         paddingHorizontal: 16,
// // // // // // // //     },
// // // // // // // //     filterChip: {
// // // // // // // //         flexDirection: 'row',
// // // // // // // //         alignItems: 'center',
// // // // // // // //         paddingHorizontal: 16,
// // // // // // // //         paddingVertical: 8,
// // // // // // // //         borderRadius: 24,
// // // // // // // //         marginRight: 8,
// // // // // // // //         gap: 6,
// // // // // // // //         shadowColor: '#000',
// // // // // // // //         shadowOffset: { width: 0, height: 2 },
// // // // // // // //         shadowOpacity: 0.05,
// // // // // // // //         shadowRadius: 4,
// // // // // // // //         elevation: 2,
// // // // // // // //     },
// // // // // // // //     filterChipActive: {
// // // // // // // //         shadowOpacity: 0.2,
// // // // // // // //         shadowRadius: 6,
// // // // // // // //     },
// // // // // // // //     filterChipText: {
// // // // // // // //         fontSize: 14,
// // // // // // // //         fontWeight: '500',
// // // // // // // //     },
// // // // // // // //     monthNav: {
// // // // // // // //         flexDirection: 'row',
// // // // // // // //         justifyContent: 'space-between',
// // // // // // // //         alignItems: 'center',
// // // // // // // //         marginHorizontal: 16,
// // // // // // // //         marginBottom: 16,
// // // // // // // //         paddingHorizontal: 16,
// // // // // // // //         paddingVertical: 14,
// // // // // // // //         borderRadius: 16,
// // // // // // // //         shadowColor: '#000',
// // // // // // // //         shadowOffset: { width: 0, height: 2 },
// // // // // // // //         shadowOpacity: 0.05,
// // // // // // // //         shadowRadius: 4,
// // // // // // // //         elevation: 2,
// // // // // // // //     },
// // // // // // // //     monthNavButton: {
// // // // // // // //         width: 40,
// // // // // // // //         height: 40,
// // // // // // // //         justifyContent: 'center',
// // // // // // // //         alignItems: 'center',
// // // // // // // //         borderRadius: 20,
// // // // // // // //     },
// // // // // // // //     monthDisplay: {
// // // // // // // //         alignItems: 'center',
// // // // // // // //     },
// // // // // // // //     monthText: {
// // // // // // // //         fontSize: 16,
// // // // // // // //         fontWeight: '600',
// // // // // // // //     },
// // // // // // // //     entryCount: {
// // // // // // // //         fontSize: 12,
// // // // // // // //         marginTop: 2,
// // // // // // // //     },
// // // // // // // //     listContent: {
// // // // // // // //         paddingHorizontal: 16,
// // // // // // // //         paddingBottom: 20,
// // // // // // // //     },
// // // // // // // //     entryCard: {
// // // // // // // //         padding: 16,
// // // // // // // //         borderRadius: 20,
// // // // // // // //         marginBottom: 12,
// // // // // // // //         shadowColor: '#000',
// // // // // // // //         shadowOffset: { width: 0, height: 4 },
// // // // // // // //         shadowOpacity: 0.08,
// // // // // // // //         shadowRadius: 8,
// // // // // // // //         elevation: 4,
// // // // // // // //     },
// // // // // // // //     cardHeader: {
// // // // // // // //         flexDirection: 'row',
// // // // // // // //         justifyContent: 'space-between',
// // // // // // // //         alignItems: 'center',
// // // // // // // //         marginBottom: 12,
// // // // // // // //     },
// // // // // // // //     dateSection: {
// // // // // // // //         flexDirection: 'row',
// // // // // // // //         alignItems: 'center',
// // // // // // // //         gap: 8,
// // // // // // // //     },
// // // // // // // //     dateBadge: {
// // // // // // // //         flexDirection: 'row',
// // // // // // // //         alignItems: 'center',
// // // // // // // //         paddingHorizontal: 10,
// // // // // // // //         paddingVertical: 4,
// // // // // // // //         borderRadius: 12,
// // // // // // // //         gap: 4,
// // // // // // // //     },
// // // // // // // //     dateText: {
// // // // // // // //         fontSize: 12,
// // // // // // // //         fontWeight: '500',
// // // // // // // //     },
// // // // // // // //     dayText: {
// // // // // // // //         fontSize: 12,
// // // // // // // //     },
// // // // // // // //     subjectBadge: {
// // // // // // // //         flexDirection: 'row',
// // // // // // // //         alignItems: 'center',
// // // // // // // //         paddingHorizontal: 10,
// // // // // // // //         paddingVertical: 4,
// // // // // // // //         borderRadius: 12,
// // // // // // // //         gap: 4,
// // // // // // // //     },
// // // // // // // //     subjectText: {
// // // // // // // //         fontSize: 11,
// // // // // // // //         fontWeight: '600',
// // // // // // // //     },
// // // // // // // //     previewText: {
// // // // // // // //         fontSize: 14,
// // // // // // // //         lineHeight: 20,
// // // // // // // //         marginBottom: 12,
// // // // // // // //     },
// // // // // // // //     cardFooter: {
// // // // // // // //         flexDirection: 'row',
// // // // // // // //         justifyContent: 'space-between',
// // // // // // // //         alignItems: 'center',
// // // // // // // //     },
// // // // // // // //     teacherSection: {
// // // // // // // //         flexDirection: 'row',
// // // // // // // //         alignItems: 'center',
// // // // // // // //         gap: 8,
// // // // // // // //     },
// // // // // // // //     teacherAvatar: {
// // // // // // // //         width: 28,
// // // // // // // //         height: 28,
// // // // // // // //         borderRadius: 14,
// // // // // // // //         justifyContent: 'center',
// // // // // // // //         alignItems: 'center',
// // // // // // // //     },
// // // // // // // //     teacherText: {
// // // // // // // //         fontSize: 12,
// // // // // // // //     },
// // // // // // // //     statusBadge: {
// // // // // // // //         flexDirection: 'row',
// // // // // // // //         alignItems: 'center',
// // // // // // // //         paddingHorizontal: 10,
// // // // // // // //         paddingVertical: 4,
// // // // // // // //         borderRadius: 12,
// // // // // // // //         gap: 6,
// // // // // // // //     },
// // // // // // // //     statusDot: {
// // // // // // // //         width: 6,
// // // // // // // //         height: 6,
// // // // // // // //         borderRadius: 3,
// // // // // // // //     },
// // // // // // // //     statusText: {
// // // // // // // //         fontSize: 11,
// // // // // // // //         fontWeight: '600',
// // // // // // // //     },
// // // // // // // //     skeletonContainer: {
// // // // // // // //         paddingHorizontal: 16,
// // // // // // // //     },
// // // // // // // //     skeletonCard: {
// // // // // // // //         padding: 16,
// // // // // // // //         borderRadius: 20,
// // // // // // // //         marginBottom: 12,
// // // // // // // //     },
// // // // // // // //     skeletonHeader: {
// // // // // // // //         flexDirection: 'row',
// // // // // // // //         justifyContent: 'space-between',
// // // // // // // //         marginBottom: 12,
// // // // // // // //     },
// // // // // // // //     skeletonDate: {
// // // // // // // //         width: 100,
// // // // // // // //         height: 24,
// // // // // // // //         borderRadius: 12,
// // // // // // // //     },
// // // // // // // //     skeletonBadge: {
// // // // // // // //         width: 60,
// // // // // // // //         height: 24,
// // // // // // // //         borderRadius: 12,
// // // // // // // //     },
// // // // // // // //     skeletonLine: {
// // // // // // // //         height: 16,
// // // // // // // //         borderRadius: 8,
// // // // // // // //         marginBottom: 8,
// // // // // // // //     },
// // // // // // // //     skeletonFooter: {
// // // // // // // //         flexDirection: 'row',
// // // // // // // //         alignItems: 'center',
// // // // // // // //         marginTop: 8,
// // // // // // // //         gap: 8,
// // // // // // // //     },
// // // // // // // //     skeletonAvatar: {
// // // // // // // //         width: 28,
// // // // // // // //         height: 28,
// // // // // // // //         borderRadius: 14,
// // // // // // // //     },
// // // // // // // //     skeletonText: {
// // // // // // // //         width: 100,
// // // // // // // //         height: 14,
// // // // // // // //         borderRadius: 7,
// // // // // // // //     },
// // // // // // // //     emptyContainer: {
// // // // // // // //         alignItems: 'center',
// // // // // // // //         paddingVertical: 60,
// // // // // // // //     },
// // // // // // // //     emptyIconContainer: {
// // // // // // // //         width: 120,
// // // // // // // //         height: 120,
// // // // // // // //         borderRadius: 60,
// // // // // // // //         justifyContent: 'center',
// // // // // // // //         alignItems: 'center',
// // // // // // // //         marginBottom: 24,
// // // // // // // //     },
// // // // // // // //     emptyTitle: {
// // // // // // // //         fontSize: 18,
// // // // // // // //         fontWeight: '600',
// // // // // // // //         marginBottom: 8,
// // // // // // // //     },
// // // // // // // //     emptySubtitle: {
// // // // // // // //         fontSize: 14,
// // // // // // // //         textAlign: 'center',
// // // // // // // //         paddingHorizontal: 40,
// // // // // // // //         marginBottom: 24,
// // // // // // // //     },
// // // // // // // //     emptyButton: {
// // // // // // // //         paddingHorizontal: 32,
// // // // // // // //         paddingVertical: 12,
// // // // // // // //         borderRadius: 25,
// // // // // // // //     },
// // // // // // // //     emptyButtonText: {
// // // // // // // //         color: '#FFF',
// // // // // // // //         fontSize: 14,
// // // // // // // //         fontWeight: '600',
// // // // // // // //     },
// // // // // // // //     errorContainer: {
// // // // // // // //         flex: 1,
// // // // // // // //         justifyContent: 'center',
// // // // // // // //         alignItems: 'center',
// // // // // // // //         padding: 24,
// // // // // // // //     },
// // // // // // // //     errorIconContainer: {
// // // // // // // //         width: 100,
// // // // // // // //         height: 100,
// // // // // // // //         borderRadius: 50,
// // // // // // // //         justifyContent: 'center',
// // // // // // // //         alignItems: 'center',
// // // // // // // //         marginBottom: 24,
// // // // // // // //     },
// // // // // // // //     errorText: {
// // // // // // // //         fontSize: 20,
// // // // // // // //         fontWeight: 'bold',
// // // // // // // //         marginBottom: 8,
// // // // // // // //     },
// // // // // // // //     errorSubtext: {
// // // // // // // //         fontSize: 14,
// // // // // // // //         textAlign: 'center',
// // // // // // // //         lineHeight: 20,
// // // // // // // //         marginBottom: 24,
// // // // // // // //     },
// // // // // // // //     retryButton: {
// // // // // // // //         paddingHorizontal: 32,
// // // // // // // //         paddingVertical: 12,
// // // // // // // //         borderRadius: 25,
// // // // // // // //     },
// // // // // // // //     retryButtonText: {
// // // // // // // //         color: '#FFF',
// // // // // // // //         fontSize: 16,
// // // // // // // //         fontWeight: '600',
// // // // // // // //     },
// // // // // // // //     modalContainer: {
// // // // // // // //         flex: 1,
// // // // // // // //     },
// // // // // // // //     modalHeader: {
// // // // // // // //         flexDirection: 'row',
// // // // // // // //         alignItems: 'center',
// // // // // // // //         justifyContent: 'space-between',
// // // // // // // //         paddingHorizontal: 16,
// // // // // // // //         paddingVertical: 14,
// // // // // // // //         borderBottomWidth: 1,
// // // // // // // //     },
// // // // // // // //     modalBackButton: {
// // // // // // // //         width: 40,
// // // // // // // //         height: 40,
// // // // // // // //         justifyContent: 'center',
// // // // // // // //         alignItems: 'center',
// // // // // // // //     },
// // // // // // // //     modalTitle: {
// // // // // // // //         fontSize: 18,
// // // // // // // //         fontWeight: '600',
// // // // // // // //     },
// // // // // // // //     modalContent: {
// // // // // // // //         flex: 1,
// // // // // // // //         padding: 16,
// // // // // // // //     },
// // // // // // // //     detailCard: {
// // // // // // // //         borderRadius: 24,
// // // // // // // //         padding: 20,
// // // // // // // //         marginBottom: 16,
// // // // // // // //         shadowColor: '#000',
// // // // // // // //         shadowOffset: { width: 0, height: 4 },
// // // // // // // //         shadowOpacity: 0.1,
// // // // // // // //         shadowRadius: 12,
// // // // // // // //         elevation: 6,
// // // // // // // //     },
// // // // // // // //     detailHeader: {
// // // // // // // //         flexDirection: 'row',
// // // // // // // //         justifyContent: 'space-between',
// // // // // // // //         alignItems: 'center',
// // // // // // // //         marginBottom: 20,
// // // // // // // //         flexWrap: 'wrap',
// // // // // // // //         gap: 12,
// // // // // // // //     },
// // // // // // // //     detailDateSection: {
// // // // // // // //         flexDirection: 'row',
// // // // // // // //         alignItems: 'center',
// // // // // // // //         gap: 8,
// // // // // // // //     },
// // // // // // // //     detailDate: {
// // // // // // // //         fontSize: 14,
// // // // // // // //         fontWeight: '500',
// // // // // // // //     },
// // // // // // // //     detailBadges: {
// // // // // // // //         flexDirection: 'row',
// // // // // // // //         gap: 8,
// // // // // // // //     },
// // // // // // // //     detailSubjectBadge: {
// // // // // // // //         flexDirection: 'row',
// // // // // // // //         alignItems: 'center',
// // // // // // // //         paddingHorizontal: 12,
// // // // // // // //         paddingVertical: 6,
// // // // // // // //         borderRadius: 20,
// // // // // // // //         gap: 6,
// // // // // // // //     },
// // // // // // // //     detailSubject: {
// // // // // // // //         fontSize: 13,
// // // // // // // //         fontWeight: '600',
// // // // // // // //     },
// // // // // // // //     detailStatusBadge: {
// // // // // // // //         flexDirection: 'row',
// // // // // // // //         alignItems: 'center',
// // // // // // // //         paddingHorizontal: 10,
// // // // // // // //         paddingVertical: 4,
// // // // // // // //         borderRadius: 12,
// // // // // // // //         gap: 6,
// // // // // // // //     },
// // // // // // // //     detailStatus: {
// // // // // // // //         fontSize: 11,
// // // // // // // //         fontWeight: '600',
// // // // // // // //     },
// // // // // // // //     detailTeacherSection: {
// // // // // // // //         flexDirection: 'row',
// // // // // // // //         alignItems: 'center',
// // // // // // // //         gap: 12,
// // // // // // // //         marginBottom: 20,
// // // // // // // //     },
// // // // // // // //     detailTeacherAvatar: {
// // // // // // // //         width: 48,
// // // // // // // //         height: 48,
// // // // // // // //         borderRadius: 24,
// // // // // // // //         justifyContent: 'center',
// // // // // // // //         alignItems: 'center',
// // // // // // // //     },
// // // // // // // //     detailTeacherLabel: {
// // // // // // // //         fontSize: 12,
// // // // // // // //         marginBottom: 2,
// // // // // // // //     },
// // // // // // // //     detailTeacher: {
// // // // // // // //         fontSize: 16,
// // // // // // // //         fontWeight: '500',
// // // // // // // //     },
// // // // // // // //     divider: {
// // // // // // // //         height: 1,
// // // // // // // //         backgroundColor: '#e2e8f0',
// // // // // // // //         marginVertical: 16,
// // // // // // // //     },
// // // // // // // //     detailContentSection: {
// // // // // // // //         marginTop: 8,
// // // // // // // //     },
// // // // // // // //     detailContentTitle: {
// // // // // // // //         fontSize: 16,
// // // // // // // //         fontWeight: '600',
// // // // // // // //         marginBottom: 12,
// // // // // // // //     },
// // // // // // // //     webView: {
// // // // // // // //         backgroundColor: 'transparent',
// // // // // // // //         width: '100%',
// // // // // // // //     },
// // // // // // // //     webViewLoader: {
// // // // // // // //         position: 'absolute',
// // // // // // // //         top: 0,
// // // // // // // //         left: 0,
// // // // // // // //         right: 0,
// // // // // // // //         top: 20,
// // // // // // // //         justifyContent: 'center',
// // // // // // // //         alignItems: 'center',
// // // // // // // //         zIndex: 1,
// // // // // // // //     },
// // // // // // // //     emptyContent: {
// // // // // // // //         justifyContent: 'center',
// // // // // // // //         alignItems: 'center',
// // // // // // // //         padding: 40,
// // // // // // // //     },
// // // // // // // //     emptyContentText: {
// // // // // // // //         fontSize: 14,
// // // // // // // //         marginTop: 8,
// // // // // // // //         textAlign: 'center',
// // // // // // // //     },
// // // // // // // //     datePickerModalOverlay: {
// // // // // // // //         flex: 1,
// // // // // // // //         backgroundColor: 'rgba(0,0,0,0.5)',
// // // // // // // //         justifyContent: 'flex-end',
// // // // // // // //     },
// // // // // // // //     datePickerModalContent: {
// // // // // // // //         borderTopLeftRadius: 20,
// // // // // // // //         borderTopRightRadius: 20,
// // // // // // // //         overflow: 'hidden',
// // // // // // // //     },
// // // // // // // //     datePickerModalHeader: {
// // // // // // // //         flexDirection: 'row',
// // // // // // // //         justifyContent: 'space-between',
// // // // // // // //         alignItems: 'center',
// // // // // // // //         paddingHorizontal: 16,
// // // // // // // //         paddingVertical: 12,
// // // // // // // //         borderBottomWidth: 1,
// // // // // // // //     },
// // // // // // // //     datePickerModalCancel: {
// // // // // // // //         fontSize: 16,
// // // // // // // //     },
// // // // // // // //     datePickerModalTitle: {
// // // // // // // //         fontSize: 16,
// // // // // // // //         fontWeight: '600',
// // // // // // // //     },
// // // // // // // //     datePickerModalConfirm: {
// // // // // // // //         fontSize: 16,
// // // // // // // //         fontWeight: '600',
// // // // // // // //     },
// // // // // // // // });

// // // // // // // // export default ChildDiaryScreen;


// // // // // // // // src/screens/Parent/ChildDiaryScreen.js
// // // // // // // import React, { useState, useEffect, useCallback, useRef } from 'react';
// // // // // // // import {
// // // // // // //     View,
// // // // // // //     Text,
// // // // // // //     StyleSheet,
// // // // // // //     TouchableOpacity,
// // // // // // //     FlatList,
// // // // // // //     ActivityIndicator,
// // // // // // //     RefreshControl,
// // // // // // //     TextInput,
// // // // // // //     Alert,
// // // // // // //     Modal,
// // // // // // //     Dimensions,
// // // // // // //     SafeAreaView,
// // // // // // //     Animated,
// // // // // // //     Platform,
// // // // // // //     LayoutAnimation,
// // // // // // //     UIManager,
// // // // // // //     ScrollView
// // // // // // // } from 'react-native';
// // // // // // // import { useSelector } from 'react-redux';
// // // // // // // import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// // // // // // // import DateTimePicker from '@react-native-community/datetimepicker';
// // // // // // // import { selectThemeData } from '../../store/slices/themeSlice';
// // // // // // // import { useGetChildDiaryQuery } from '../../store/attendanceApi';

// // // // // // // // Enable LayoutAnimation for Android
// // // // // // // if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
// // // // // // //     UIManager.setLayoutAnimationEnabledExperimental(true);
// // // // // // // }

// // // // // // // const { width: SCREEN_WIDTH } = Dimensions.get('window');

// // // // // // // // Skeleton Loader Component
// // // // // // // const SkeletonLoader = ({ theme }) => (
// // // // // // //     <View style={styles.skeletonContainer}>
// // // // // // //         {[1, 2, 3].map((item) => (
// // // // // // //             <View key={item} style={[styles.skeletonCard, { backgroundColor: theme.card }]}>
// // // // // // //                 <View style={styles.skeletonHeader}>
// // // // // // //                     <View style={[styles.skeletonDate, { backgroundColor: theme.border }]} />
// // // // // // //                     <View style={[styles.skeletonBadge, { backgroundColor: theme.border }]} />
// // // // // // //                 </View>
// // // // // // //                 <View style={[styles.skeletonLine, { backgroundColor: theme.border }]} />
// // // // // // //                 <View style={[styles.skeletonLine, { backgroundColor: theme.border, width: '80%' }]} />
// // // // // // //                 <View style={styles.skeletonFooter}>
// // // // // // //                     <View style={[styles.skeletonAvatar, { backgroundColor: theme.border }]} />
// // // // // // //                     <View style={[styles.skeletonText, { backgroundColor: theme.border }]} />
// // // // // // //                 </View>
// // // // // // //             </View>
// // // // // // //         ))}
// // // // // // //     </View>
// // // // // // // );

// // // // // // // // Diary Card Component
// // // // // // // const DiaryCard = ({ item, theme, onPress }) => {
// // // // // // //     const scaleAnim = useRef(new Animated.Value(1)).current;
    
// // // // // // //     // Strip HTML tags for preview
// // // // // // //     const getPlainText = (html) => {
// // // // // // //         if (!html) return 'No preview available';
// // // // // // //         return html.replace(/<[^>]*>/g, '').substring(0, 120);
// // // // // // //     };

// // // // // // //     const plainTextPreview = getPlainText(item.content);
// // // // // // //     const formatDate = (dateString) => {
// // // // // // //         const date = new Date(dateString);
// // // // // // //         return date.toLocaleDateString('en-US', { 
// // // // // // //             month: 'short', 
// // // // // // //             day: 'numeric',
// // // // // // //             year: 'numeric'
// // // // // // //         });
// // // // // // //     };

// // // // // // //     const handlePressIn = () => {
// // // // // // //         Animated.spring(scaleAnim, {
// // // // // // //             toValue: 0.98,
// // // // // // //             useNativeDriver: true,
// // // // // // //             speed: 50,
// // // // // // //         }).start();
// // // // // // //     };

// // // // // // //     const handlePressOut = () => {
// // // // // // //         Animated.spring(scaleAnim, {
// // // // // // //             toValue: 1,
// // // // // // //             useNativeDriver: true,
// // // // // // //             speed: 50,
// // // // // // //         }).start();
// // // // // // //     };

// // // // // // //     return (
// // // // // // //         <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
// // // // // // //             <TouchableOpacity
// // // // // // //                 activeOpacity={0.9}
// // // // // // //                 onPressIn={handlePressIn}
// // // // // // //                 onPressOut={handlePressOut}
// // // // // // //                 onPress={() => onPress(item)}
// // // // // // //                 style={[styles.entryCard, { backgroundColor: theme.card }]}
// // // // // // //             >
// // // // // // //                 <View style={styles.cardHeader}>
// // // // // // //                     <View style={styles.dateSection}>
// // // // // // //                         <View style={[styles.dateBadge, { backgroundColor: theme.primary + '15' }]}>
// // // // // // //                             <Icon name="calendar-today" size={14} color={theme.primary} />
// // // // // // //                             <Text style={[styles.dateText, { color: theme.text }]}>
// // // // // // //                                 {formatDate(item.date)}
// // // // // // //                             </Text>
// // // // // // //                         </View>
// // // // // // //                         <Text style={[styles.dayText, { color: theme.textSecondary }]}>
// // // // // // //                             {item.day}
// // // // // // //                         </Text>
// // // // // // //                     </View>
// // // // // // //                     <View style={[styles.subjectBadge, { backgroundColor: theme.primary + '15' }]}>
// // // // // // //                         <Icon name="book-open-variant" size={12} color={theme.primary} />
// // // // // // //                         <Text style={[styles.subjectText, { color: theme.primary }]}>
// // // // // // //                             {item.subject}
// // // // // // //                         </Text>
// // // // // // //                     </View>
// // // // // // //                 </View>

// // // // // // //                 <Text style={[styles.previewText, { color: theme.text }]} numberOfLines={2}>
// // // // // // //                     {plainTextPreview}
// // // // // // //                 </Text>

// // // // // // //                 <View style={styles.cardFooter}>
// // // // // // //                     <View style={styles.teacherSection}>
// // // // // // //                         <View style={[styles.teacherAvatar, { backgroundColor: theme.primary + '15' }]}>
// // // // // // //                             <Icon name="account" size={14} color={theme.primary} />
// // // // // // //                         </View>
// // // // // // //                         <Text style={[styles.teacherText, { color: theme.textSecondary }]}>
// // // // // // //                             {item.teacher}
// // // // // // //                         </Text>
// // // // // // //                     </View>
// // // // // // //                     <View style={[
// // // // // // //                         styles.statusBadge,
// // // // // // //                         { backgroundColor: item.isPublished ? theme.success + '15' : theme.warning + '15' }
// // // // // // //                     ]}>
// // // // // // //                         <View style={[
// // // // // // //                             styles.statusDot,
// // // // // // //                             { backgroundColor: item.isPublished ? theme.success : theme.warning }
// // // // // // //                         ]} />
// // // // // // //                         <Text style={[
// // // // // // //                             styles.statusText,
// // // // // // //                             { color: item.isPublished ? theme.success : theme.warning }
// // // // // // //                         ]}>
// // // // // // //                             {item.isPublished ? 'Published' : 'Draft'}
// // // // // // //                         </Text>
// // // // // // //                     </View>
// // // // // // //                 </View>
// // // // // // //             </TouchableOpacity>
// // // // // // //         </Animated.View>
// // // // // // //     );
// // // // // // // };

// // // // // // // // Filter Chip Component
// // // // // // // const FilterChip = ({ label, isActive, onPress, icon, theme }) => (
// // // // // // //     <TouchableOpacity
// // // // // // //         style={[
// // // // // // //             styles.filterChip,
// // // // // // //             { backgroundColor: isActive ? theme.primary : theme.card },
// // // // // // //             isActive && styles.filterChipActive
// // // // // // //         ]}
// // // // // // //         onPress={onPress}
// // // // // // //         activeOpacity={0.7}
// // // // // // //     >
// // // // // // //         {icon && <Icon name={icon} size={16} color={isActive ? '#FFF' : theme.textSecondary} />}
// // // // // // //         <Text style={[
// // // // // // //             styles.filterChipText,
// // // // // // //             { color: isActive ? '#FFF' : theme.text }
// // // // // // //         ]}>
// // // // // // //             {label}
// // // // // // //         </Text>
// // // // // // //     </TouchableOpacity>
// // // // // // // );

// // // // // // // // Date Picker Modal Component
// // // // // // // const DatePickerModal = ({ visible, onClose, onSelectDate, selectedDate, theme }) => {
// // // // // // //     const [tempDate, setTempDate] = useState(selectedDate ? new Date(selectedDate) : new Date());
// // // // // // //     const [showPicker, setShowPicker] = useState(false);

// // // // // // //     useEffect(() => {
// // // // // // //         if (visible) {
// // // // // // //             setShowPicker(true);
// // // // // // //         }
// // // // // // //     }, [visible]);

// // // // // // //     const handleDateChange = (event, date) => {
// // // // // // //         if (Platform.OS === 'android') {
// // // // // // //             setShowPicker(false);
// // // // // // //         }
        
// // // // // // //         if (date) {
// // // // // // //             setTempDate(date);
// // // // // // //             if (Platform.OS === 'android') {
// // // // // // //                 const dateString = date.toISOString().split('T')[0];
// // // // // // //                 onSelectDate(dateString);
// // // // // // //                 onClose();
// // // // // // //             }
// // // // // // //         } else if (Platform.OS === 'android') {
// // // // // // //             onClose();
// // // // // // //         }
// // // // // // //     };

// // // // // // //     const handleIOSConfirm = () => {
// // // // // // //         const dateString = tempDate.toISOString().split('T')[0];
// // // // // // //         onSelectDate(dateString);
// // // // // // //         onClose();
// // // // // // //     };

// // // // // // //     const handleIOSCancel = () => {
// // // // // // //         onClose();
// // // // // // //     };

// // // // // // //     if (!showPicker) return null;

// // // // // // //     if (Platform.OS === 'ios') {
// // // // // // //         return (
// // // // // // //             <Modal
// // // // // // //                 visible={visible}
// // // // // // //                 transparent={true}
// // // // // // //                 animationType="slide"
// // // // // // //                 onRequestClose={onClose}
// // // // // // //             >
// // // // // // //                 <View style={styles.datePickerModalOverlay}>
// // // // // // //                     <View style={[styles.datePickerModalContent, { backgroundColor: theme.card }]}>
// // // // // // //                         <View style={[styles.datePickerModalHeader, { borderBottomColor: theme.border }]}>
// // // // // // //                             <TouchableOpacity onPress={handleIOSCancel}>
// // // // // // //                                 <Text style={[styles.datePickerModalCancel, { color: theme.error }]}>Cancel</Text>
// // // // // // //                             </TouchableOpacity>
// // // // // // //                             <Text style={[styles.datePickerModalTitle, { color: theme.text }]}>Select Date</Text>
// // // // // // //                             <TouchableOpacity onPress={handleIOSConfirm}>
// // // // // // //                                 <Text style={[styles.datePickerModalConfirm, { color: theme.primary }]}>Done</Text>
// // // // // // //                             </TouchableOpacity>
// // // // // // //                         </View>
// // // // // // //                         <DateTimePicker
// // // // // // //                             value={tempDate}
// // // // // // //                             mode="date"
// // // // // // //                             display="spinner"
// // // // // // //                             onChange={handleDateChange}
// // // // // // //                             themeVariant={theme.isDarkMode ? 'dark' : 'light'}
// // // // // // //                         />
// // // // // // //                     </View>
// // // // // // //                 </View>
// // // // // // //             </Modal>
// // // // // // //         );
// // // // // // //     }

// // // // // // //     return (
// // // // // // //         <DateTimePicker
// // // // // // //             value={tempDate}
// // // // // // //             mode="date"
// // // // // // //             display="default"
// // // // // // //             onChange={handleDateChange}
// // // // // // //         />
// // // // // // //     );
// // // // // // // };

// // // // // // // const ChildDiaryScreen = ({ route, navigation }) => {
// // // // // // //     const theme = useSelector(selectThemeData);
// // // // // // //     const { childId, childName } = route.params;

// // // // // // //     const [refreshing, setRefreshing] = useState(false);
// // // // // // //     const [diaryEntries, setDiaryEntries] = useState([]);
// // // // // // //     const [filteredEntries, setFilteredEntries] = useState([]);
// // // // // // //     const [selectedDate, setSelectedDate] = useState('');
// // // // // // //     const [selectedSubject, setSelectedSubject] = useState('All');
// // // // // // //     const [searchQuery, setSearchQuery] = useState('');
// // // // // // //     const [subjects, setSubjects] = useState([]);
// // // // // // //     const [availableDates, setAvailableDates] = useState([]);
// // // // // // //     const [isSearchFocused, setIsSearchFocused] = useState(false);
// // // // // // //     const [showDatePicker, setShowDatePicker] = useState(false);
// // // // // // //     const [apiFilters, setApiFilters] = useState({
// // // // // // //         month: new Date().getMonth() + 1,
// // // // // // //         year: new Date().getFullYear(),
// // // // // // //     });

// // // // // // //     const fadeAnim = useRef(new Animated.Value(0)).current;

// // // // // // //     const {
// // // // // // //         data: diaryResponse,
// // // // // // //         isLoading,
// // // // // // //         isFetching,
// // // // // // //         error,
// // // // // // //         refetch,
// // // // // // //     } = useGetChildDiaryQuery({
// // // // // // //         childId,
// // // // // // //         filters: {
// // // // // // //             month: apiFilters.month,
// // // // // // //             year: apiFilters.year,
// // // // // // //             date: selectedDate || undefined,
// // // // // // //             subjectId: selectedSubject !== 'All' ? selectedSubject : null,
// // // // // // //         },
// // // // // // //     });

// // // // // // //     useEffect(() => {
// // // // // // //         if (diaryResponse?.success === true && diaryResponse?.data?.entries) {
// // // // // // //             processDiaryData(diaryResponse.data.entries);
// // // // // // //             Animated.timing(fadeAnim, {
// // // // // // //                 toValue: 1,
// // // // // // //                 duration: 500,
// // // // // // //                 useNativeDriver: true,
// // // // // // //             }).start();
// // // // // // //         }
// // // // // // //     }, [diaryResponse]);

// // // // // // //     useEffect(() => {
// // // // // // //         filterEntries();
// // // // // // //     }, [searchQuery, selectedSubject, selectedDate, diaryEntries]);

// // // // // // //     const processDiaryData = (entries) => {
// // // // // // //         const transformedEntries = entries.map(entry => {
// // // // // // //             const dateObj = entry.date ? new Date(entry.date) : new Date();
// // // // // // //             const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
// // // // // // //             const dayName = !isNaN(dateObj.getTime()) ? dayNames[dateObj.getDay()] : '';

// // // // // // //             return {
// // // // // // //                 id: entry.id,
// // // // // // //                 date: entry.date || '',
// // // // // // //                 day: dayName,
// // // // // // //                 subject: entry.subject || 'General',
// // // // // // //                 subjectId: entry.subjectId,
// // // // // // //                 content: entry.content || '',
// // // // // // //                 teacher: entry.teacher || 'Teacher',
// // // // // // //                 isPublished: entry.isPublished || false,
// // // // // // //                 createdAt: entry.createdAt,
// // // // // // //             };
// // // // // // //         });

// // // // // // //         const sortedEntries = transformedEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
        
// // // // // // //         const uniqueSubjects = [...new Map(sortedEntries.map(entry => [
// // // // // // //             entry.subjectId, { id: entry.subjectId, name: entry.subject }
// // // // // // //         ])).values()];
// // // // // // //         setSubjects(uniqueSubjects);
        
// // // // // // //         const uniqueDates = [...new Set(sortedEntries.map(entry => entry.date))];
// // // // // // //         setAvailableDates(uniqueDates);
        
// // // // // // //         setDiaryEntries(sortedEntries);
// // // // // // //         setFilteredEntries(sortedEntries);
// // // // // // //     };

// // // // // // //     const filterEntries = () => {
// // // // // // //         let filtered = [...diaryEntries];
// // // // // // //         if (searchQuery.trim()) {
// // // // // // //             const query = searchQuery.toLowerCase();
// // // // // // //             filtered = filtered.filter(entry =>
// // // // // // //                 entry.subject.toLowerCase().includes(query) ||
// // // // // // //                 entry.teacher.toLowerCase().includes(query) ||
// // // // // // //                 (entry.content && entry.content.toLowerCase().includes(query))
// // // // // // //             );
// // // // // // //         }
// // // // // // //         if (selectedSubject !== 'All') {
// // // // // // //             filtered = filtered.filter(entry => entry.subjectId === selectedSubject);
// // // // // // //         }
// // // // // // //         if (selectedDate) {
// // // // // // //             filtered = filtered.filter(entry => entry.date === selectedDate);
// // // // // // //         }
// // // // // // //         setFilteredEntries(filtered);
// // // // // // //     };

// // // // // // //     const onRefresh = async () => {
// // // // // // //         setRefreshing(true);
// // // // // // //         await refetch();
// // // // // // //         setRefreshing(false);
// // // // // // //     };

// // // // // // //     const handleMonthChange = (offset) => {
// // // // // // //         LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
// // // // // // //         let newMonth = apiFilters.month + offset;
// // // // // // //         let newYear = apiFilters.year;
// // // // // // //         if (newMonth > 12) { newMonth = 1; newYear++; }
// // // // // // //         if (newMonth < 1) { newMonth = 12; newYear--; }
// // // // // // //         setApiFilters({ month: newMonth, year: newYear });
// // // // // // //         setSelectedDate('');
// // // // // // //     };

// // // // // // //     const handleResetFilters = () => {
// // // // // // //         LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
// // // // // // //         setSelectedDate('');
// // // // // // //         setSelectedSubject('All');
// // // // // // //         setSearchQuery('');
// // // // // // //     };

// // // // // // //     const handleEntryPress = (entry) => {
// // // // // // //     navigation.navigate('DiaryDetail', { 
// // // // // // //         entry: entry,
// // // // // // //         childName: childName,  // Add child name here
// // // // // // //         childId: childId        // Also pass childId if needed
// // // // // // //     });
// // // // // // // };

// // // // // // //     const formatFullDate = (dateString) => {
// // // // // // //         const date = new Date(dateString);
// // // // // // //         return date.toLocaleDateString('en-US', {
// // // // // // //             weekday: 'long',
// // // // // // //             year: 'numeric',
// // // // // // //             month: 'long',
// // // // // // //             day: 'numeric',
// // // // // // //         });
// // // // // // //     };

// // // // // // //     const getMonthName = (month) => {
// // // // // // //         return new Date(2000, month - 1, 1).toLocaleString('default', { month: 'long' });
// // // // // // //     };

// // // // // // //     const renderHeader = () => (
// // // // // // //         // <View style={[styles.headerGradient, { backgroundColor: theme.primary }]}>
// // // // // // //         //     <SafeAreaView>
// // // // // // //         //         <View style={styles.header}>
// // // // // // //         //             <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
// // // // // // //         //                 <Icon name="arrow-left" size={24} color="#FFF" />
// // // // // // //         //             </TouchableOpacity>
// // // // // // //         //             <View style={styles.headerContent}>
// // // // // // //         //                 <Text style={styles.headerTitle}>{childName}'s Diary</Text>
// // // // // // //         //                 <Text style={styles.headerSubtitle}>School activities & updates</Text>
// // // // // // //         //             </View>
// // // // // // //         //             <View style={styles.avatarContainer}>
// // // // // // //         //                 <View style={[styles.avatarPlaceholder, { backgroundColor: '#ffffff30' }]}>
// // // // // // //         //                     <Icon name="account-child" size={24} color="#FFF" />
// // // // // // //         //                 </View>
// // // // // // //         //             </View>
// // // // // // //         //         </View>
// // // // // // //         //     </SafeAreaView>
// // // // // // //         // </View>
// // // // // // //         <></>
// // // // // // //     );

// // // // // // //     const renderSearchBar = () => (
// // // // // // //         <View style={[
// // // // // // //             styles.searchWrapper,
// // // // // // //             isSearchFocused && styles.searchWrapperFocused,
// // // // // // //             { borderColor: theme.border, backgroundColor: theme.card }
// // // // // // //         ]}>
// // // // // // //             <Icon name="magnify" size={20} color={theme.textSecondary} />
// // // // // // //             <TextInput
// // // // // // //                 style={[styles.searchInput, { color: theme.text }]}
// // // // // // //                 placeholder="Search by subject or teacher..."
// // // // // // //                 placeholderTextColor={theme.textSecondary}
// // // // // // //                 value={searchQuery}
// // // // // // //                 onChangeText={setSearchQuery}
// // // // // // //                 onFocus={() => setIsSearchFocused(true)}
// // // // // // //                 onBlur={() => setIsSearchFocused(false)}
// // // // // // //             />
// // // // // // //             {searchQuery !== '' && (
// // // // // // //                 <TouchableOpacity onPress={() => setSearchQuery('')}>
// // // // // // //                     <Icon name="close-circle" size={20} color={theme.textSecondary} />
// // // // // // //                 </TouchableOpacity>
// // // // // // //             )}
// // // // // // //         </View>
// // // // // // //     );

// // // // // // //     const renderFilters = () => (
// // // // // // //         <View style={styles.filtersSection}>
// // // // // // //             <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
// // // // // // //                 <FilterChip
// // // // // // //                     label="All"
// // // // // // //                     isActive={selectedSubject === 'All'}
// // // // // // //                     onPress={() => setSelectedSubject('All')}
// // // // // // //                     theme={theme}
// // // // // // //                 />
// // // // // // //                 {subjects.map(subject => (
// // // // // // //                     <FilterChip
// // // // // // //                         key={subject.id}
// // // // // // //                         label={subject.name}
// // // // // // //                         isActive={selectedSubject === subject.id}
// // // // // // //                         onPress={() => setSelectedSubject(subject.id)}
// // // // // // //                         theme={theme}
// // // // // // //                     />
// // // // // // //                 ))}
// // // // // // //                 <FilterChip
// // // // // // //                     label={selectedDate ? formatFullDate(selectedDate).split(',')[0] : "Select Date"}
// // // // // // //                     isActive={!!selectedDate}
// // // // // // //                     onPress={() => setShowDatePicker(true)}
// // // // // // //                     icon="calendar"
// // // // // // //                     theme={theme}
// // // // // // //                 />
// // // // // // //             </ScrollView>
// // // // // // //         </View>
// // // // // // //     );

// // // // // // //     const renderMonthNavigator = () => (
// // // // // // //         <View style={[styles.monthNav, { backgroundColor: theme.card }]}>
// // // // // // //             <TouchableOpacity onPress={() => handleMonthChange(-1)} style={styles.monthNavButton}>
// // // // // // //                 <Icon name="chevron-left" size={24} color={theme.primary} />
// // // // // // //             </TouchableOpacity>
// // // // // // //             <View style={styles.monthDisplay}>
// // // // // // //                 <Text style={[styles.monthText, { color: theme.text }]}>
// // // // // // //                     {getMonthName(apiFilters.month)} {apiFilters.year}
// // // // // // //                 </Text>
// // // // // // //                 <Text style={[styles.entryCount, { color: theme.textSecondary }]}>
// // // // // // //                     {filteredEntries.length} entries
// // // // // // //                 </Text>
// // // // // // //             </View>
// // // // // // //             <TouchableOpacity onPress={() => handleMonthChange(1)} style={styles.monthNavButton}>
// // // // // // //                 <Icon name="chevron-right" size={24} color={theme.primary} />
// // // // // // //             </TouchableOpacity>
// // // // // // //         </View>
// // // // // // //     );

// // // // // // //     const renderEmptyState = () => (
// // // // // // //         <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
// // // // // // //             <View style={[styles.emptyIconContainer, { backgroundColor: theme.primary + '10' }]}>
// // // // // // //                 <Icon name="notebook-edit-outline" size={64} color={theme.primary} />
// // // // // // //             </View>
// // // // // // //             <Text style={[styles.emptyTitle, { color: theme.text }]}>
// // // // // // //                 {searchQuery || selectedDate || selectedSubject !== 'All' 
// // // // // // //                     ? 'No matching entries' 
// // // // // // //                     : 'No diary entries yet'}
// // // // // // //             </Text>
// // // // // // //             <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
// // // // // // //                 {searchQuery || selectedDate || selectedSubject !== 'All'
// // // // // // //                     ? 'Try adjusting your filters to see more results'
// // // // // // //                     : `No entries found for ${getMonthName(apiFilters.month)} ${apiFilters.year}`}
// // // // // // //             </Text>
// // // // // // //             {(searchQuery || selectedDate || selectedSubject !== 'All') && (
// // // // // // //                 <TouchableOpacity style={[styles.emptyButton, { backgroundColor: theme.primary }]} onPress={handleResetFilters}>
// // // // // // //                     <Text style={styles.emptyButtonText}>Clear Filters</Text>
// // // // // // //                 </TouchableOpacity>
// // // // // // //             )}
// // // // // // //         </Animated.View>
// // // // // // //     );

// // // // // // //     if (error) {
// // // // // // //         return (
// // // // // // //             <View style={[styles.container, { backgroundColor: theme.background }]}>
// // // // // // //                 <View style={styles.errorContainer}>
// // // // // // //                     <View style={[styles.errorIconContainer, { backgroundColor: theme.error + '10' }]}>
// // // // // // //                         <Icon name="wifi-off" size={60} color={theme.error} />
// // // // // // //                     </View>
// // // // // // //                     <Text style={[styles.errorText, { color: theme.text }]}>Connection Error</Text>
// // // // // // //                     <Text style={[styles.errorSubtext, { color: theme.textSecondary }]}>
// // // // // // //                         Unable to connect to the server. Please check your internet connection.
// // // // // // //                     </Text>
// // // // // // //                     <TouchableOpacity style={[styles.retryButton, { backgroundColor: theme.primary }]} onPress={() => refetch()}>
// // // // // // //                         <Text style={styles.retryButtonText}>Try Again</Text>
// // // // // // //                     </TouchableOpacity>
// // // // // // //                 </View>
// // // // // // //             </View>
// // // // // // //         );
// // // // // // //     }

// // // // // // //     return (
// // // // // // //         <View style={[styles.container, { backgroundColor: theme.background }]}>
// // // // // // //             {renderHeader()}
            
// // // // // // //             <View style={styles.contentContainer}>
// // // // // // //                 {renderSearchBar()}
// // // // // // //                 {renderFilters()}
// // // // // // //                 {renderMonthNavigator()}

// // // // // // //                 {(isLoading || isFetching) && !refreshing ? (
// // // // // // //                     <SkeletonLoader theme={theme} />
// // // // // // //                 ) : (
// // // // // // //                     <FlatList
// // // // // // //                         data={filteredEntries}
// // // // // // //                         renderItem={({ item }) => (
// // // // // // //                             <DiaryCard
// // // // // // //                                 item={item}
// // // // // // //                                 theme={theme}
// // // // // // //                                 onPress={handleEntryPress}
// // // // // // //                             />
// // // // // // //                         )}
// // // // // // //                         keyExtractor={(item) => item.id?.toString()}
// // // // // // //                         contentContainerStyle={styles.listContent}
// // // // // // //                         refreshControl={
// // // // // // //                             <RefreshControl
// // // // // // //                                 refreshing={refreshing}
// // // // // // //                                 onRefresh={onRefresh}
// // // // // // //                                 colors={[theme.primary]}
// // // // // // //                                 tintColor={theme.primary}
// // // // // // //                             />
// // // // // // //                         }
// // // // // // //                         ListEmptyComponent={renderEmptyState()}
// // // // // // //                         showsVerticalScrollIndicator={false}
// // // // // // //                     />
// // // // // // //                 )}
// // // // // // //             </View>

// // // // // // //             <DatePickerModal
// // // // // // //                 visible={showDatePicker}
// // // // // // //                 onClose={() => setShowDatePicker(false)}
// // // // // // //                 onSelectDate={(date) => setSelectedDate(date)}
// // // // // // //                 selectedDate={selectedDate}
// // // // // // //                 theme={theme}
// // // // // // //             />
// // // // // // //         </View>
// // // // // // //     );
// // // // // // // };

// // // // // // // const styles = StyleSheet.create({
// // // // // // //     container: {
// // // // // // //         flex: 1,
// // // // // // //     },
// // // // // // //     headerGradient: {
// // // // // // //         borderBottomLeftRadius: 24,
// // // // // // //         borderBottomRightRadius: 24,
// // // // // // //         paddingBottom: 20,
// // // // // // //     },
// // // // // // //     header: {
// // // // // // //         flexDirection: 'row',
// // // // // // //         alignItems: 'center',
// // // // // // //         paddingHorizontal: 20,
// // // // // // //         paddingTop: Platform.OS === 'ios' ? 10 : 20,
// // // // // // //     },
// // // // // // //     backButton: {
// // // // // // //         width: 40,
// // // // // // //         height: 40,
// // // // // // //         justifyContent: 'center',
// // // // // // //         alignItems: 'center',
// // // // // // //     },
// // // // // // //     headerContent: {
// // // // // // //         flex: 1,
// // // // // // //         marginLeft: 12,
// // // // // // //     },
// // // // // // //     headerTitle: {
// // // // // // //         fontSize: 20,
// // // // // // //         fontWeight: '700',
// // // // // // //         color: '#FFF',
// // // // // // //     },
// // // // // // //     headerSubtitle: {
// // // // // // //         fontSize: 13,
// // // // // // //         color: '#FFFFFFCC',
// // // // // // //         marginTop: 2,
// // // // // // //     },
// // // // // // //     avatarContainer: {
// // // // // // //         width: 44,
// // // // // // //         height: 44,
// // // // // // //     },
// // // // // // //     avatarPlaceholder: {
// // // // // // //         width: 44,
// // // // // // //         height: 44,
// // // // // // //         borderRadius: 22,
// // // // // // //         justifyContent: 'center',
// // // // // // //         alignItems: 'center',
// // // // // // //         borderWidth: 2,
// // // // // // //         borderColor: '#FFF',
// // // // // // //     },
// // // // // // //     contentContainer: {
// // // // // // //         flex: 1,
// // // // // // //         paddingTop: 16,
// // // // // // //     },
// // // // // // //     searchWrapper: {
// // // // // // //         flexDirection: 'row',
// // // // // // //         alignItems: 'center',
// // // // // // //         marginHorizontal: 16,
// // // // // // //         marginBottom: 12,
// // // // // // //         paddingHorizontal: 16,
// // // // // // //         paddingVertical: 12,
// // // // // // //         borderRadius: 16,
// // // // // // //         borderWidth: 1,
// // // // // // //     },
// // // // // // //     searchWrapperFocused: {
// // // // // // //         borderWidth: 2,
// // // // // // //     },
// // // // // // //     searchInput: {
// // // // // // //         flex: 1,
// // // // // // //         fontSize: 16,
// // // // // // //         marginLeft: 12,
// // // // // // //         paddingVertical: 0,
// // // // // // //     },
// // // // // // //     filtersSection: {
// // // // // // //         marginBottom: 12,
// // // // // // //     },
// // // // // // //     filtersScroll: {
// // // // // // //         paddingHorizontal: 16,
// // // // // // //     },
// // // // // // //     filterChip: {
// // // // // // //         flexDirection: 'row',
// // // // // // //         alignItems: 'center',
// // // // // // //         paddingHorizontal: 16,
// // // // // // //         paddingVertical: 8,
// // // // // // //         borderRadius: 24,
// // // // // // //         marginRight: 8,
// // // // // // //         gap: 6,
// // // // // // //         shadowColor: '#000',
// // // // // // //         shadowOffset: { width: 0, height: 2 },
// // // // // // //         shadowOpacity: 0.05,
// // // // // // //         shadowRadius: 4,
// // // // // // //         elevation: 2,
// // // // // // //     },
// // // // // // //     filterChipActive: {
// // // // // // //         shadowOpacity: 0.2,
// // // // // // //         shadowRadius: 6,
// // // // // // //     },
// // // // // // //     filterChipText: {
// // // // // // //         fontSize: 14,
// // // // // // //         fontWeight: '500',
// // // // // // //     },
// // // // // // //     monthNav: {
// // // // // // //         flexDirection: 'row',
// // // // // // //         justifyContent: 'space-between',
// // // // // // //         alignItems: 'center',
// // // // // // //         marginHorizontal: 16,
// // // // // // //         marginBottom: 16,
// // // // // // //         paddingHorizontal: 16,
// // // // // // //         paddingVertical: 14,
// // // // // // //         borderRadius: 16,
// // // // // // //         shadowColor: '#000',
// // // // // // //         shadowOffset: { width: 0, height: 2 },
// // // // // // //         shadowOpacity: 0.05,
// // // // // // //         shadowRadius: 4,
// // // // // // //         elevation: 2,
// // // // // // //     },
// // // // // // //     monthNavButton: {
// // // // // // //         width: 40,
// // // // // // //         height: 40,
// // // // // // //         justifyContent: 'center',
// // // // // // //         alignItems: 'center',
// // // // // // //         borderRadius: 20,
// // // // // // //     },
// // // // // // //     monthDisplay: {
// // // // // // //         alignItems: 'center',
// // // // // // //     },
// // // // // // //     monthText: {
// // // // // // //         fontSize: 16,
// // // // // // //         fontWeight: '600',
// // // // // // //     },
// // // // // // //     entryCount: {
// // // // // // //         fontSize: 12,
// // // // // // //         marginTop: 2,
// // // // // // //     },
// // // // // // //     listContent: {
// // // // // // //         paddingHorizontal: 16,
// // // // // // //         paddingBottom: 20,
// // // // // // //     },
// // // // // // //     entryCard: {
// // // // // // //         padding: 16,
// // // // // // //         borderRadius: 20,
// // // // // // //         marginBottom: 12,
// // // // // // //         shadowColor: '#000',
// // // // // // //         shadowOffset: { width: 0, height: 4 },
// // // // // // //         shadowOpacity: 0.08,
// // // // // // //         shadowRadius: 8,
// // // // // // //         elevation: 4,
// // // // // // //     },
// // // // // // //     cardHeader: {
// // // // // // //         flexDirection: 'row',
// // // // // // //         justifyContent: 'space-between',
// // // // // // //         alignItems: 'center',
// // // // // // //         marginBottom: 12,
// // // // // // //     },
// // // // // // //     dateSection: {
// // // // // // //         flexDirection: 'row',
// // // // // // //         alignItems: 'center',
// // // // // // //         gap: 8,
// // // // // // //     },
// // // // // // //     dateBadge: {
// // // // // // //         flexDirection: 'row',
// // // // // // //         alignItems: 'center',
// // // // // // //         paddingHorizontal: 10,
// // // // // // //         paddingVertical: 4,
// // // // // // //         borderRadius: 12,
// // // // // // //         gap: 4,
// // // // // // //     },
// // // // // // //     dateText: {
// // // // // // //         fontSize: 12,
// // // // // // //         fontWeight: '500',
// // // // // // //     },
// // // // // // //     dayText: {
// // // // // // //         fontSize: 12,
// // // // // // //     },
// // // // // // //     subjectBadge: {
// // // // // // //         flexDirection: 'row',
// // // // // // //         alignItems: 'center',
// // // // // // //         paddingHorizontal: 10,
// // // // // // //         paddingVertical: 4,
// // // // // // //         borderRadius: 12,
// // // // // // //         gap: 4,
// // // // // // //     },
// // // // // // //     subjectText: {
// // // // // // //         fontSize: 11,
// // // // // // //         fontWeight: '600',
// // // // // // //     },
// // // // // // //     previewText: {
// // // // // // //         fontSize: 14,
// // // // // // //         lineHeight: 20,
// // // // // // //         marginBottom: 12,
// // // // // // //     },
// // // // // // //     cardFooter: {
// // // // // // //         flexDirection: 'row',
// // // // // // //         justifyContent: 'space-between',
// // // // // // //         alignItems: 'center',
// // // // // // //     },
// // // // // // //     teacherSection: {
// // // // // // //         flexDirection: 'row',
// // // // // // //         alignItems: 'center',
// // // // // // //         gap: 8,
// // // // // // //     },
// // // // // // //     teacherAvatar: {
// // // // // // //         width: 28,
// // // // // // //         height: 28,
// // // // // // //         borderRadius: 14,
// // // // // // //         justifyContent: 'center',
// // // // // // //         alignItems: 'center',
// // // // // // //     },
// // // // // // //     teacherText: {
// // // // // // //         fontSize: 12,
// // // // // // //     },
// // // // // // //     statusBadge: {
// // // // // // //         flexDirection: 'row',
// // // // // // //         alignItems: 'center',
// // // // // // //         paddingHorizontal: 10,
// // // // // // //         paddingVertical: 4,
// // // // // // //         borderRadius: 12,
// // // // // // //         gap: 6,
// // // // // // //     },
// // // // // // //     statusDot: {
// // // // // // //         width: 6,
// // // // // // //         height: 6,
// // // // // // //         borderRadius: 3,
// // // // // // //     },
// // // // // // //     statusText: {
// // // // // // //         fontSize: 11,
// // // // // // //         fontWeight: '600',
// // // // // // //     },
// // // // // // //     skeletonContainer: {
// // // // // // //         paddingHorizontal: 16,
// // // // // // //     },
// // // // // // //     skeletonCard: {
// // // // // // //         padding: 16,
// // // // // // //         borderRadius: 20,
// // // // // // //         marginBottom: 12,
// // // // // // //     },
// // // // // // //     skeletonHeader: {
// // // // // // //         flexDirection: 'row',
// // // // // // //         justifyContent: 'space-between',
// // // // // // //         marginBottom: 12,
// // // // // // //     },
// // // // // // //     skeletonDate: {
// // // // // // //         width: 100,
// // // // // // //         height: 24,
// // // // // // //         borderRadius: 12,
// // // // // // //     },
// // // // // // //     skeletonBadge: {
// // // // // // //         width: 60,
// // // // // // //         height: 24,
// // // // // // //         borderRadius: 12,
// // // // // // //     },
// // // // // // //     skeletonLine: {
// // // // // // //         height: 16,
// // // // // // //         borderRadius: 8,
// // // // // // //         marginBottom: 8,
// // // // // // //     },
// // // // // // //     skeletonFooter: {
// // // // // // //         flexDirection: 'row',
// // // // // // //         alignItems: 'center',
// // // // // // //         marginTop: 8,
// // // // // // //         gap: 8,
// // // // // // //     },
// // // // // // //     skeletonAvatar: {
// // // // // // //         width: 28,
// // // // // // //         height: 28,
// // // // // // //         borderRadius: 14,
// // // // // // //     },
// // // // // // //     skeletonText: {
// // // // // // //         width: 100,
// // // // // // //         height: 14,
// // // // // // //         borderRadius: 7,
// // // // // // //     },
// // // // // // //     emptyContainer: {
// // // // // // //         alignItems: 'center',
// // // // // // //         paddingVertical: 60,
// // // // // // //     },
// // // // // // //     emptyIconContainer: {
// // // // // // //         width: 120,
// // // // // // //         height: 120,
// // // // // // //         borderRadius: 60,
// // // // // // //         justifyContent: 'center',
// // // // // // //         alignItems: 'center',
// // // // // // //         marginBottom: 24,
// // // // // // //     },
// // // // // // //     emptyTitle: {
// // // // // // //         fontSize: 18,
// // // // // // //         fontWeight: '600',
// // // // // // //         marginBottom: 8,
// // // // // // //     },
// // // // // // //     emptySubtitle: {
// // // // // // //         fontSize: 14,
// // // // // // //         textAlign: 'center',
// // // // // // //         paddingHorizontal: 40,
// // // // // // //         marginBottom: 24,
// // // // // // //     },
// // // // // // //     emptyButton: {
// // // // // // //         paddingHorizontal: 32,
// // // // // // //         paddingVertical: 12,
// // // // // // //         borderRadius: 25,
// // // // // // //     },
// // // // // // //     emptyButtonText: {
// // // // // // //         color: '#FFF',
// // // // // // //         fontSize: 14,
// // // // // // //         fontWeight: '600',
// // // // // // //     },
// // // // // // //     errorContainer: {
// // // // // // //         flex: 1,
// // // // // // //         justifyContent: 'center',
// // // // // // //         alignItems: 'center',
// // // // // // //         padding: 24,
// // // // // // //     },
// // // // // // //     errorIconContainer: {
// // // // // // //         width: 100,
// // // // // // //         height: 100,
// // // // // // //         borderRadius: 50,
// // // // // // //         justifyContent: 'center',
// // // // // // //         alignItems: 'center',
// // // // // // //         marginBottom: 24,
// // // // // // //     },
// // // // // // //     errorText: {
// // // // // // //         fontSize: 20,
// // // // // // //         fontWeight: 'bold',
// // // // // // //         marginBottom: 8,
// // // // // // //     },
// // // // // // //     errorSubtext: {
// // // // // // //         fontSize: 14,
// // // // // // //         textAlign: 'center',
// // // // // // //         lineHeight: 20,
// // // // // // //         marginBottom: 24,
// // // // // // //     },
// // // // // // //     retryButton: {
// // // // // // //         paddingHorizontal: 32,
// // // // // // //         paddingVertical: 12,
// // // // // // //         borderRadius: 25,
// // // // // // //     },
// // // // // // //     retryButtonText: {
// // // // // // //         color: '#FFF',
// // // // // // //         fontSize: 16,
// // // // // // //         fontWeight: '600',
// // // // // // //     },
// // // // // // //     datePickerModalOverlay: {
// // // // // // //         flex: 1,
// // // // // // //         backgroundColor: 'rgba(0,0,0,0.5)',
// // // // // // //         justifyContent: 'flex-end',
// // // // // // //     },
// // // // // // //     datePickerModalContent: {
// // // // // // //         borderTopLeftRadius: 20,
// // // // // // //         borderTopRightRadius: 20,
// // // // // // //         overflow: 'hidden',
// // // // // // //     },
// // // // // // //     datePickerModalHeader: {
// // // // // // //         flexDirection: 'row',
// // // // // // //         justifyContent: 'space-between',
// // // // // // //         alignItems: 'center',
// // // // // // //         paddingHorizontal: 16,
// // // // // // //         paddingVertical: 12,
// // // // // // //         borderBottomWidth: 1,
// // // // // // //     },
// // // // // // //     datePickerModalCancel: {
// // // // // // //         fontSize: 16,
// // // // // // //     },
// // // // // // //     datePickerModalTitle: {
// // // // // // //         fontSize: 16,
// // // // // // //         fontWeight: '600',
// // // // // // //     },
// // // // // // //     datePickerModalConfirm: {
// // // // // // //         fontSize: 16,
// // // // // // //         fontWeight: '600',
// // // // // // //     },
// // // // // // // });

// // // // // // // export default ChildDiaryScreen;

// // // // // // // src/screens/Parent/ChildDiaryScreen.js
// // // // // // import React, { useState, useEffect, useCallback, useRef } from 'react';
// // // // // // import {
// // // // // //     View,
// // // // // //     Text,
// // // // // //     StyleSheet,
// // // // // //     TouchableOpacity,
// // // // // //     FlatList,
// // // // // //     ActivityIndicator,
// // // // // //     RefreshControl,
// // // // // //     TextInput,
// // // // // //     Modal,
// // // // // //     Dimensions,
// // // // // //     Animated,
// // // // // //     Platform,
// // // // // //     LayoutAnimation,
// // // // // //     UIManager,
// // // // // //     ScrollView
// // // // // // } from 'react-native';
// // // // // // import { useSelector } from 'react-redux';
// // // // // // import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// // // // // // import DateTimePicker from '@react-native-community/datetimepicker';
// // // // // // import { WebView } from 'react-native-webview';
// // // // // // import { selectThemeData } from '../../store/slices/themeSlice';
// // // // // // import { useGetChildDiaryQuery } from '../../store/attendanceApi';
// // // // // // import { format, subDays, isAfter, isBefore, startOfToday } from 'date-fns';

// // // // // // // Enable LayoutAnimation for Android
// // // // // // if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
// // // // // //     UIManager.setLayoutAnimationEnabledExperimental(true);
// // // // // // }

// // // // // // const { width: SCREEN_WIDTH } = Dimensions.get('window');

// // // // // // // Optimized WebView Component with caching and lazy loading
// // // // // // const OptimizedWebView = React.memo(({ content, theme, onHeightChange, isVisible }) => {
// // // // // //     const webViewRef = useRef(null);
// // // // // //     const [webViewHeight, setWebViewHeight] = useState(150);
// // // // // //     const [isLoading, setIsLoading] = useState(true);
    
// // // // // //     // Generate HTML with theme support
// // // // // //     const getHTMLContent = useCallback(() => {
// // // // // //         return `
// // // // // //             <!DOCTYPE html>
// // // // // //             <html>
// // // // // //             <head>
// // // // // //                 <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
// // // // // //                 <style>
// // // // // //                     * {
// // // // // //                         margin: 0;
// // // // // //                         padding: 0;
// // // // // //                         box-sizing: border-box;
// // // // // //                     }
                    
// // // // // //                     body {
// // // // // //                         font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
// // // // // //                         font-size: 15px;
// // // // // //                         line-height: 1.6;
// // // // // //                         padding: 16px;
// // // // // //                         margin: 0;
// // // // // //                         color: ${theme.isDarkMode ? '#e0e0e0' : '#2c3e50'};
// // // // // //                         background-color: ${theme.isDarkMode ? '#121212' : '#ffffff'};
// // // // // //                     }
                    
// // // // // //                     p {
// // // // // //                         margin-bottom: 12px;
// // // // // //                         line-height: 1.6;
// // // // // //                     }
                    
// // // // // //                     img {
// // // // // //                         max-width: 100%;
// // // // // //                         height: auto;
// // // // // //                         border-radius: 12px;
// // // // // //                         margin: 12px 0;
// // // // // //                         display: block;
// // // // // //                     }
                    
// // // // // //                     h1 {
// // // // // //                         font-size: 24px;
// // // // // //                         font-weight: bold;
// // // // // //                         margin: 16px 0 12px 0;
// // // // // //                         color: ${theme.isDarkMode ? '#ffffff' : '#1a1a1a'};
// // // // // //                     }
                    
// // // // // //                     h2 {
// // // // // //                         font-size: 20px;
// // // // // //                         font-weight: bold;
// // // // // //                         margin: 14px 0 10px 0;
// // // // // //                         color: ${theme.isDarkMode ? '#ffffff' : '#1a1a1a'};
// // // // // //                     }
                    
// // // // // //                     h3 {
// // // // // //                         font-size: 18px;
// // // // // //                         font-weight: bold;
// // // // // //                         margin: 12px 0 8px 0;
// // // // // //                         color: ${theme.isDarkMode ? '#ffffff' : '#1a1a1a'};
// // // // // //                     }
                    
// // // // // //                     ul, ol {
// // // // // //                         margin: 8px 0 12px 20px;
// // // // // //                     }
                    
// // // // // //                     li {
// // // // // //                         margin-bottom: 6px;
// // // // // //                         line-height: 1.5;
// // // // // //                     }
                    
// // // // // //                     a {
// // // // // //                         color: ${theme.primary};
// // // // // //                         text-decoration: none;
// // // // // //                     }
                    
// // // // // //                     a:active {
// // // // // //                         opacity: 0.7;
// // // // // //                     }
                    
// // // // // //                     blockquote {
// // // // // //                         margin: 12px 0;
// // // // // //                         padding: 8px 16px;
// // // // // //                         border-left: 4px solid ${theme.primary};
// // // // // //                         background-color: ${theme.isDarkMode ? '#1e1e1e' : '#f5f5f5'};
// // // // // //                         border-radius: 8px;
// // // // // //                     }
                    
// // // // // //                     table {
// // // // // //                         width: 100%;
// // // // // //                         border-collapse: collapse;
// // // // // //                         margin: 12px 0;
// // // // // //                     }
                    
// // // // // //                     th, td {
// // // // // //                         border: 1px solid ${theme.isDarkMode ? '#333' : '#ddd'};
// // // // // //                         padding: 8px;
// // // // // //                         text-align: left;
// // // // // //                     }
                    
// // // // // //                     th {
// // // // // //                         background-color: ${theme.isDarkMode ? '#1e1e1e' : '#f5f5f5'};
// // // // // //                         font-weight: bold;
// // // // // //                     }
                    
// // // // // //                     code {
// // // // // //                         background-color: ${theme.isDarkMode ? '#1e1e1e' : '#f5f5f5'};
// // // // // //                         padding: 2px 6px;
// // // // // //                         border-radius: 4px;
// // // // // //                         font-family: monospace;
// // // // // //                         font-size: 14px;
// // // // // //                     }
                    
// // // // // //                     pre {
// // // // // //                         background-color: ${theme.isDarkMode ? '#1e1e1e' : '#f5f5f5'};
// // // // // //                         padding: 12px;
// // // // // //                         border-radius: 8px;
// // // // // //                         overflow-x: auto;
// // // // // //                         margin: 12px 0;
// // // // // //                     }
                    
// // // // // //                     hr {
// // // // // //                         margin: 16px 0;
// // // // // //                         border: none;
// // // // // //                         height: 1px;
// // // // // //                         background-color: ${theme.isDarkMode ? '#333' : '#e0e0e0'};
// // // // // //                     }
// // // // // //                 </style>
// // // // // //                 <script>
// // // // // //                     function sendHeight() {
// // // // // //                         const height = document.body.scrollHeight;
// // // // // //                         window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'height', height: height }));
// // // // // //                     }
                    
// // // // // //                     function optimizeImages() {
// // // // // //                         const images = document.querySelectorAll('img');
// // // // // //                         images.forEach(img => {
// // // // // //                             img.onload = () => sendHeight();
// // // // // //                             if (img.complete) sendHeight();
// // // // // //                         });
// // // // // //                     }
                    
// // // // // //                     window.onload = () => {
// // // // // //                         setTimeout(() => {
// // // // // //                             sendHeight();
// // // // // //                             optimizeImages();
// // // // // //                         }, 100);
// // // // // //                     };
                    
// // // // // //                     window.addEventListener('resize', () => {
// // // // // //                         setTimeout(sendHeight, 50);
// // // // // //                     });
                    
// // // // // //                     // Observe DOM changes
// // // // // //                     const observer = new MutationObserver(() => sendHeight());
// // // // // //                     observer.observe(document.body, { 
// // // // // //                         childList: true, 
// // // // // //                         subtree: true,
// // // // // //                         attributes: true,
// // // // // //                         attributeFilter: ['style', 'class']
// // // // // //                     });
// // // // // //                 </script>
// // // // // //             </head>
// // // // // //             <body>
// // // // // //                 ${content || '<p style="text-align:center;color:#999">No content available</p>'}
// // // // // //             </body>
// // // // // //             </html>
// // // // // //         `;
// // // // // //     }, [content, theme, theme.isDarkMode, theme.primary]);
    
// // // // // //     const handleMessage = useCallback((event) => {
// // // // // //         try {
// // // // // //             const data = JSON.parse(event.nativeEvent.data);
// // // // // //             if (data.type === 'height' && data.height && onHeightChange) {
// // // // // //                 const newHeight = Math.max(data.height + 32, 100); // Add padding
// // // // // //                 setWebViewHeight(newHeight);
// // // // // //                 onHeightChange(newHeight);
// // // // // //             }
// // // // // //         } catch (error) {
// // // // // //             // Not JSON, ignore
// // // // // //         }
// // // // // //     }, [onHeightChange]);
    
// // // // // //     const handleLoadEnd = useCallback(() => {
// // // // // //         setIsLoading(false);
// // // // // //         // Inject JavaScript to send initial height
// // // // // //         webViewRef.current?.injectJavaScript(`
// // // // // //             setTimeout(() => {
// // // // // //                 const height = document.body.scrollHeight;
// // // // // //                 window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'height', height: height }));
// // // // // //             }, 100);
// // // // // //             true;
// // // // // //         `);
// // // // // //     }, []);
    
// // // // // //     // Don't render if not visible (lazy loading optimization)
// // // // // //     if (!isVisible) {
// // // // // //         return <View style={{ height: webViewHeight }} />;
// // // // // //     }
    
// // // // // //     return (
// // // // // //         <View style={{ height: webViewHeight, overflow: 'hidden', borderRadius: 12 }}>
// // // // // //             {isLoading && (
// // // // // //                 <View style={styles.webViewLoader}>
// // // // // //                     <ActivityIndicator size="small" color={theme.primary} />
// // // // // //                 </View>
// // // // // //             )}
// // // // // //             <WebView
// // // // // //                 ref={webViewRef}
// // // // // //                 source={{ html: getHTMLContent() }}
// // // // // //                 style={[
// // // // // //                     styles.webView,
// // // // // //                     isLoading && styles.webViewHidden
// // // // // //                 ]}
// // // // // //                 scrollEnabled={false}
// // // // // //                 onMessage={handleMessage}
// // // // // //                 onLoadEnd={handleLoadEnd}
// // // // // //                 originWhitelist={['*']}
// // // // // //                 javaScriptEnabled={true}
// // // // // //                 domStorageEnabled={true}
// // // // // //                 cacheEnabled={true}
// // // // // //                 cacheMode="LOAD_CACHE_ELSE_NETWORK"
// // // // // //                 androidLayerType="software"
// // // // // //                 showsVerticalScrollIndicator={false}
// // // // // //                 showsHorizontalScrollIndicator={false}
               
// // // // // //             />
// // // // // //         </View>
// // // // // //     );
// // // // // // });

// // // // // // // Skeleton Loader Component
// // // // // // const SkeletonLoader = ({ theme }) => (
// // // // // //     <View style={styles.skeletonContainer}>
// // // // // //         {[1, 2, 3].map((item) => (
// // // // // //             <View key={item} style={[styles.skeletonCard, { backgroundColor: theme.card }]}>
// // // // // //                 <View style={styles.skeletonHeader}>
// // // // // //                     <View style={[styles.skeletonDate, { backgroundColor: theme.border }]} />
// // // // // //                     <View style={[styles.skeletonBadge, { backgroundColor: theme.border }]} />
// // // // // //                 </View>
// // // // // //                 <View style={[styles.skeletonLine, { backgroundColor: theme.border }]} />
// // // // // //                 <View style={[styles.skeletonLine, { backgroundColor: theme.border, width: '80%' }]} />
// // // // // //                 <View style={styles.skeletonFooter}>
// // // // // //                     <View style={[styles.skeletonAvatar, { backgroundColor: theme.border }]} />
// // // // // //                     <View style={[styles.skeletonText, { backgroundColor: theme.border }]} />
// // // // // //                 </View>
// // // // // //             </View>
// // // // // //         ))}
// // // // // //     </View>
// // // // // // );

// // // // // // // Accordion Diary Card Component with Optimized WebView
// // // // // // const AccordionDiaryCard = ({ item, theme, isExpanded, onToggle }) => {
// // // // // //     const scaleAnim = useRef(new Animated.Value(1)).current;
// // // // // //     const [webViewHeight, setWebViewHeight] = useState(200);
    
// // // // // //     // Strip HTML tags for preview
// // // // // //     const getPlainText = (html) => {
// // // // // //         if (!html) return 'No preview available';
// // // // // //         return html.replace(/<[^>]*>/g, '').substring(0, 120);
// // // // // //     };

// // // // // //     const plainTextPreview = getPlainText(item.content);
    
// // // // // //     const formatDate = (dateString) => {
// // // // // //         const date = new Date(dateString);
// // // // // //         return format(date, 'MMM d, yyyy');
// // // // // //     };

// // // // // //     const formatFullDate = (dateString) => {
// // // // // //         const date = new Date(dateString);
// // // // // //         return format(date, 'EEEE, MMMM d, yyyy');
// // // // // //     };

// // // // // //     const handlePressIn = () => {
// // // // // //         Animated.spring(scaleAnim, {
// // // // // //             toValue: 0.98,
// // // // // //             useNativeDriver: true,
// // // // // //             speed: 50,
// // // // // //         }).start();
// // // // // //     };

// // // // // //     const handlePressOut = () => {
// // // // // //         Animated.spring(scaleAnim, {
// // // // // //             toValue: 1,
// // // // // //             useNativeDriver: true,
// // // // // //             speed: 50,
// // // // // //         }).start();
// // // // // //     };

// // // // // //     const handlePress = () => {
// // // // // //         LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
// // // // // //         onToggle();
// // // // // //     };
    
// // // // // //     const handleWebViewHeightChange = useCallback((height) => {
// // // // // //         setWebViewHeight(height);
// // // // // //     }, []);

// // // // // //     return (
// // // // // //         <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
// // // // // //             <TouchableOpacity
// // // // // //                 activeOpacity={0.9}
// // // // // //                 onPressIn={handlePressIn}
// // // // // //                 onPressOut={handlePressOut}
// // // // // //                 onPress={handlePress}
// // // // // //                 style={[
// // // // // //                     styles.entryCard, 
// // // // // //                     { backgroundColor: theme.card },
// // // // // //                     isExpanded && styles.expandedCard
// // // // // //                 ]}
// // // // // //             >
// // // // // //                 <View style={styles.cardHeader}>
// // // // // //                     <View style={styles.dateSection}>
// // // // // //                         <View style={[styles.dateBadge, { backgroundColor: theme.primary + '15' }]}>
// // // // // //                             <Icon name="calendar-today" size={14} color={theme.primary} />
// // // // // //                             <Text style={[styles.dateText, { color: theme.text }]}>
// // // // // //                                 {formatDate(item.date)}
// // // // // //                             </Text>
// // // // // //                         </View>
// // // // // //                         <Text style={[styles.dayText, { color: theme.textSecondary }]}>
// // // // // //                             {item.day}
// // // // // //                         </Text>
// // // // // //                     </View>
// // // // // //                     <View style={styles.headerRight}>
// // // // // //                         <View style={[styles.subjectBadge, { backgroundColor: theme.primary + '15' }]}>
// // // // // //                             <Icon name="book-open-variant" size={12} color={theme.primary} />
// // // // // //                             <Text style={[styles.subjectText, { color: theme.primary }]}>
// // // // // //                                 {item.subject}
// // // // // //                             </Text>
// // // // // //                         </View>
// // // // // //                         <Icon 
// // // // // //                             name={isExpanded ? "chevron-up" : "chevron-down"} 
// // // // // //                             size={20} 
// // // // // //                             color={theme.textSecondary} 
// // // // // //                         />
// // // // // //                     </View>
// // // // // //                 </View>

// // // // // //                 {/* Preview Text - Only show when collapsed */}
// // // // // //                 {!isExpanded && (
// // // // // //                     <Text style={[styles.previewText, { color: theme.text }]} numberOfLines={2}>
// // // // // //                         {plainTextPreview}
// // // // // //                     </Text>
// // // // // //                 )}

// // // // // //                 {/* Expanded Content */}
// // // // // //                 {isExpanded && (
// // // // // //                     <View style={styles.expandedContent}>
// // // // // //                         <View style={[styles.divider, { backgroundColor: theme.border }]} />
                        
// // // // // //                         {/* Full Date */}
// // // // // //                         <View style={styles.expandedDateSection}>
// // // // // //                             <Icon name="calendar-clock" size={16} color={theme.primary} />
// // // // // //                             <Text style={[styles.expandedDateText, { color: theme.textSecondary }]}>
// // // // // //                                 {formatFullDate(item.date)}
// // // // // //                             </Text>
// // // // // //                         </View>

// // // // // //                         {/* Teacher Info */}
// // // // // //                         <View style={styles.teacherSection}>
// // // // // //                             <View style={[styles.teacherAvatar, { backgroundColor: theme.primary + '15' }]}>
// // // // // //                                 <Icon name="account" size={14} color={theme.primary} />
// // // // // //                             </View>
// // // // // //                             <View style={styles.teacherInfo}>
// // // // // //                                 <Text style={[styles.teacherLabel, { color: theme.textSecondary }]}>
// // // // // //                                     Teacher
// // // // // //                                 </Text>
// // // // // //                                 <Text style={[styles.teacherName, { color: theme.text }]}>
// // // // // //                                     {item.teacher}
// // // // // //                                 </Text>
// // // // // //                             </View>
// // // // // //                         </View>

// // // // // //                         {/* Status */}
// // // // // //                         <View style={[
// // // // // //                             styles.statusBadge,
// // // // // //                             { backgroundColor: item.isPublished ? theme.success + '15' : theme.warning + '15' }
// // // // // //                         ]}>
// // // // // //                             <View style={[
// // // // // //                                 styles.statusDot,
// // // // // //                                 { backgroundColor: item.isPublished ? theme.success : theme.warning }
// // // // // //                             ]} />
// // // // // //                             <Text style={[
// // // // // //                                 styles.statusText,
// // // // // //                                 { color: item.isPublished ? theme.success : theme.warning }
// // // // // //                             ]}>
// // // // // //                                 {item.isPublished ? 'Published' : 'Draft'}
// // // // // //                             </Text>
// // // // // //                         </View>

// // // // // //                         {/* Full Content with Optimized WebView */}
// // // // // //                         <View style={styles.fullContentSection}>
// // // // // //                             <Text style={[styles.contentLabel, { color: theme.text }]}>
// // // // // //                                 📝 Content
// // // // // //                             </Text>
// // // // // //                             <OptimizedWebView
// // // // // //                                 content={item.content}
// // // // // //                                 theme={theme}
// // // // // //                                 onHeightChange={handleWebViewHeightChange}
// // // // // //                                 isVisible={isExpanded}
// // // // // //                             />
// // // // // //                         </View>
// // // // // //                     </View>
// // // // // //                 )}

// // // // // //                 {/* Footer - Only show when collapsed */}
// // // // // //                 {!isExpanded && (
// // // // // //                     <View style={styles.cardFooter}>
// // // // // //                         <View style={styles.teacherSection}>
// // // // // //                             <View style={[styles.teacherAvatar, { backgroundColor: theme.primary + '15' }]}>
// // // // // //                                 <Icon name="account" size={14} color={theme.primary} />
// // // // // //                             </View>
// // // // // //                             <Text style={[styles.teacherText, { color: theme.textSecondary }]}>
// // // // // //                                 {item.teacher}
// // // // // //                             </Text>
// // // // // //                         </View>
// // // // // //                         <View style={[
// // // // // //                             styles.statusBadge,
// // // // // //                             { backgroundColor: item.isPublished ? theme.success + '15' : theme.warning + '15' }
// // // // // //                         ]}>
// // // // // //                             <View style={[
// // // // // //                                 styles.statusDot,
// // // // // //                                 { backgroundColor: item.isPublished ? theme.success : theme.warning }
// // // // // //                             ]} />
// // // // // //                             <Text style={[
// // // // // //                                 styles.statusText,
// // // // // //                                 { color: item.isPublished ? theme.success : theme.warning }
// // // // // //                             ]}>
// // // // // //                                 {item.isPublished ? 'Published' : 'Draft'}
// // // // // //                             </Text>
// // // // // //                         </View>
// // // // // //                     </View>
// // // // // //                 )}
// // // // // //             </TouchableOpacity>
// // // // // //         </Animated.View>
// // // // // //     );
// // // // // // };

// // // // // // // Filter Chip Component
// // // // // // const FilterChip = ({ label, isActive, onPress, icon, theme }) => (
// // // // // //     <TouchableOpacity
// // // // // //         style={[
// // // // // //             styles.filterChip,
// // // // // //             { backgroundColor: isActive ? theme.primary : theme.card },
// // // // // //             isActive && styles.filterChipActive
// // // // // //         ]}
// // // // // //         onPress={onPress}
// // // // // //         activeOpacity={0.7}
// // // // // //     >
// // // // // //         {icon && <Icon name={icon} size={16} color={isActive ? '#FFF' : theme.textSecondary} />}
// // // // // //         <Text style={[
// // // // // //             styles.filterChipText,
// // // // // //             { color: isActive ? '#FFF' : theme.text }
// // // // // //         ]}>
// // // // // //             {label}
// // // // // //         </Text>
// // // // // //     </TouchableOpacity>
// // // // // // );

// // // // // // // Day Navigator Component
// // // // // // const DayNavigator = ({ currentDate, onDateChange, availableDates, theme }) => {
// // // // // //     const today = startOfToday();
// // // // // //     const sevenDaysAgo = subDays(today, 7);
    
// // // // // //     const canGoPrevious = isAfter(new Date(currentDate), sevenDaysAgo);
// // // // // //     const canGoNext = isBefore(new Date(currentDate), today);
    
// // // // // //     const handlePrevious = () => {
// // // // // //         if (canGoPrevious) {
// // // // // //             const newDate = subDays(new Date(currentDate), 1);
// // // // // //             onDateChange(format(newDate, 'yyyy-MM-dd'));
// // // // // //         }
// // // // // //     };
    
// // // // // //     const handleNext = () => {
// // // // // //         if (canGoNext) {
// // // // // //             const newDate = subDays(new Date(currentDate), -1);
// // // // // //             onDateChange(format(newDate, 'yyyy-MM-dd'));
// // // // // //         }
// // // // // //     };
    
// // // // // //     const handleToday = () => {
// // // // // //         onDateChange(format(today, 'yyyy-MM-dd'));
// // // // // //     };
    
// // // // // //     const formatDisplayDate = (dateString) => {
// // // // // //         const date = new Date(dateString);
// // // // // //         const today_date = startOfToday();
// // // // // //         const yesterday = subDays(today_date, 1);
        
// // // // // //         if (format(date, 'yyyy-MM-dd') === format(today_date, 'yyyy-MM-dd')) {
// // // // // //             return 'Today';
// // // // // //         } else if (format(date, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd')) {
// // // // // //             return 'Yesterday';
// // // // // //         } else {
// // // // // //             return format(date, 'EEEE, MMM d');
// // // // // //         }
// // // // // //     };
    
// // // // // //     return (
// // // // // //         <View style={[styles.dayNavigator, { backgroundColor: theme.card }]}>
// // // // // //             <TouchableOpacity 
// // // // // //                 onPress={handlePrevious} 
// // // // // //                 style={[
// // // // // //                     styles.navButton,
// // // // // //                     !canGoPrevious && styles.navButtonDisabled
// // // // // //                 ]}
// // // // // //                 disabled={!canGoPrevious}
// // // // // //             >
// // // // // //                 <Icon name="chevron-left" size={24} color={canGoPrevious ? theme.primary : theme.textSecondary} />
// // // // // //             </TouchableOpacity>
            
// // // // // //             <TouchableOpacity onPress={handleToday} style={styles.dateDisplay}>
// // // // // //                 <Text style={[styles.dateDisplayText, { color: theme.text }]}>
// // // // // //                     {formatDisplayDate(currentDate)}
// // // // // //                 </Text>
// // // // // //                 <Text style={[styles.dateDisplaySub, { color: theme.textSecondary }]}>
// // // // // //                     {format(new Date(currentDate), 'MMMM d, yyyy')}
// // // // // //                 </Text>
// // // // // //             </TouchableOpacity>
            
// // // // // //             <TouchableOpacity 
// // // // // //                 onPress={handleNext} 
// // // // // //                 style={[
// // // // // //                     styles.navButton,
// // // // // //                     !canGoNext && styles.navButtonDisabled
// // // // // //                 ]}
// // // // // //                 disabled={!canGoNext}
// // // // // //             >
// // // // // //                 <Icon name="chevron-right" size={24} color={canGoNext ? theme.primary : theme.textSecondary} />
// // // // // //             </TouchableOpacity>
// // // // // //         </View>
// // // // // //     );
// // // // // // };

// // // // // // const ChildDiaryScreen = ({ route, navigation }) => {
// // // // // //     const theme = useSelector(selectThemeData);
// // // // // //     const { childId, childName } = route.params;

// // // // // //     const [refreshing, setRefreshing] = useState(false);
// // // // // //     const [diaryEntries, setDiaryEntries] = useState([]);
// // // // // //     const [filteredEntries, setFilteredEntries] = useState([]);
// // // // // //     const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
// // // // // //     const [selectedSubject, setSelectedSubject] = useState('All');
// // // // // //     const [searchQuery, setSearchQuery] = useState('');
// // // // // //     const [subjects, setSubjects] = useState([]);
// // // // // //     const [isSearchFocused, setIsSearchFocused] = useState(false);
// // // // // //     const [expandedId, setExpandedId] = useState(null);

// // // // // //     const fadeAnim = useRef(new Animated.Value(0)).current;

// // // // // //     const {
// // // // // //         data: diaryResponse,
// // // // // //         isLoading,
// // // // // //         isFetching,
// // // // // //         error,
// // // // // //         refetch,
// // // // // //     } = useGetChildDiaryQuery({
// // // // // //         childId,
// // // // // //         filters: {
// // // // // //             date: selectedDate,
// // // // // //             subjectId: selectedSubject !== 'All' ? selectedSubject : null,
// // // // // //         },
// // // // // //     });

// // // // // //     useEffect(() => {
// // // // // //         if (diaryResponse?.success === true && diaryResponse?.data?.entries) {
// // // // // //             processDiaryData(diaryResponse.data.entries);
// // // // // //             Animated.timing(fadeAnim, {
// // // // // //                 toValue: 1,
// // // // // //                 duration: 500,
// // // // // //                 useNativeDriver: true,
// // // // // //             }).start();
// // // // // //         }
// // // // // //     }, [diaryResponse]);

// // // // // //     useEffect(() => {
// // // // // //         filterEntries();
// // // // // //     }, [searchQuery, selectedSubject, diaryEntries]);

// // // // // //     const processDiaryData = (entries) => {
// // // // // //         const transformedEntries = entries.map(entry => {
// // // // // //             const dateObj = entry.date ? new Date(entry.date) : new Date();
// // // // // //             const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
// // // // // //             const dayName = !isNaN(dateObj.getTime()) ? dayNames[dateObj.getDay()] : '';

// // // // // //             return {
// // // // // //                 id: entry.id,
// // // // // //                 date: entry.date || '',
// // // // // //                 day: dayName,
// // // // // //                 subject: entry.subject || 'General',
// // // // // //                 subjectId: entry.subjectId,
// // // // // //                 content: entry.content || '',
// // // // // //                 teacher: entry.teacher || 'Teacher',
// // // // // //                 isPublished: entry.isPublished || false,
// // // // // //                 createdAt: entry.createdAt,
// // // // // //             };
// // // // // //         });

// // // // // //         const sortedEntries = transformedEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
        
// // // // // //         const uniqueSubjects = [...new Map(sortedEntries.map(entry => [
// // // // // //             entry.subjectId, { id: entry.subjectId, name: entry.subject }
// // // // // //         ])).values()];
// // // // // //         setSubjects(uniqueSubjects);
        
// // // // // //         setDiaryEntries(sortedEntries);
// // // // // //         setFilteredEntries(sortedEntries);
// // // // // //     };

// // // // // //     const filterEntries = () => {
// // // // // //         let filtered = [...diaryEntries];
// // // // // //         if (searchQuery.trim()) {
// // // // // //             const query = searchQuery.toLowerCase();
// // // // // //             filtered = filtered.filter(entry =>
// // // // // //                 entry.subject.toLowerCase().includes(query) ||
// // // // // //                 entry.teacher.toLowerCase().includes(query) ||
// // // // // //                 (entry.content && entry.content.toLowerCase().includes(query))
// // // // // //             );
// // // // // //         }
// // // // // //         if (selectedSubject !== 'All') {
// // // // // //             filtered = filtered.filter(entry => entry.subjectId === selectedSubject);
// // // // // //         }
// // // // // //         setFilteredEntries(filtered);
        
// // // // // //         if (expandedId) {
// // // // // //             setExpandedId(null);
// // // // // //         }
// // // // // //     };

// // // // // //     const onRefresh = async () => {
// // // // // //         setRefreshing(true);
// // // // // //         await refetch();
// // // // // //         setRefreshing(false);
// // // // // //     };

// // // // // //     const handleDateChange = (date) => {
// // // // // //         LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
// // // // // //         setSelectedDate(date);
// // // // // //         setExpandedId(null);
// // // // // //     };

// // // // // //     const handleResetFilters = () => {
// // // // // //         LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
// // // // // //         setSelectedSubject('All');
// // // // // //         setSearchQuery('');
// // // // // //         setExpandedId(null);
// // // // // //     };

// // // // // //     const handleToggleExpand = (id) => {
// // // // // //         setExpandedId(expandedId === id ? null : id);
// // // // // //     };

// // // // // //     const renderSearchBar = () => (
// // // // // //         <View style={[
// // // // // //             styles.searchWrapper,
// // // // // //             isSearchFocused && styles.searchWrapperFocused,
// // // // // //             { borderColor: theme.border, backgroundColor: theme.card }
// // // // // //         ]}>
// // // // // //             <Icon name="magnify" size={20} color={theme.textSecondary} />
// // // // // //             <TextInput
// // // // // //                 style={[styles.searchInput, { color: theme.text }]}
// // // // // //                 placeholder="Search by subject or teacher..."
// // // // // //                 placeholderTextColor={theme.textSecondary}
// // // // // //                 value={searchQuery}
// // // // // //                 onChangeText={setSearchQuery}
// // // // // //                 onFocus={() => setIsSearchFocused(true)}
// // // // // //                 onBlur={() => setIsSearchFocused(false)}
// // // // // //             />
// // // // // //             {searchQuery !== '' && (
// // // // // //                 <TouchableOpacity onPress={() => setSearchQuery('')}>
// // // // // //                     <Icon name="close-circle" size={20} color={theme.textSecondary} />
// // // // // //                 </TouchableOpacity>
// // // // // //             )}
// // // // // //         </View>
// // // // // //     );

// // // // // //     const renderFilters = () => (
// // // // // //         <View style={styles.filtersSection}>
// // // // // //             <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
// // // // // //                 <FilterChip
// // // // // //                     label="All Subjects"
// // // // // //                     isActive={selectedSubject === 'All'}
// // // // // //                     onPress={() => setSelectedSubject('All')}
// // // // // //                     theme={theme}
// // // // // //                 />
// // // // // //                 {subjects.map(subject => (
// // // // // //                     <FilterChip
// // // // // //                         key={subject.id}
// // // // // //                         label={subject.name}
// // // // // //                         isActive={selectedSubject === subject.id}
// // // // // //                         onPress={() => setSelectedSubject(subject.id)}
// // // // // //                         theme={theme}
// // // // // //                     />
// // // // // //                 ))}
// // // // // //             </ScrollView>
// // // // // //         </View>
// // // // // //     );

// // // // // //     const renderEmptyState = () => (
// // // // // //         <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
// // // // // //             <View style={[styles.emptyIconContainer, { backgroundColor: theme.primary + '10' }]}>
// // // // // //                 <Icon name="notebook-edit-outline" size={64} color={theme.primary} />
// // // // // //             </View>
// // // // // //             <Text style={[styles.emptyTitle, { color: theme.text }]}>
// // // // // //                 {searchQuery || selectedSubject !== 'All' 
// // // // // //                     ? 'No matching entries' 
// // // // // //                     : 'No diary entries for this day'}
// // // // // //             </Text>
// // // // // //             <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
// // // // // //                 {searchQuery || selectedSubject !== 'All'
// // // // // //                     ? 'Try adjusting your filters to see more results'
// // // // // //                     : `No diary entries found for ${format(new Date(selectedDate), 'MMMM d, yyyy')}`}
// // // // // //             </Text>
// // // // // //             {(searchQuery || selectedSubject !== 'All') && (
// // // // // //                 <TouchableOpacity style={[styles.emptyButton, { backgroundColor: theme.primary }]} onPress={handleResetFilters}>
// // // // // //                     <Text style={styles.emptyButtonText}>Clear Filters</Text>
// // // // // //                 </TouchableOpacity>
// // // // // //             )}
// // // // // //         </Animated.View>
// // // // // //     );

// // // // // //     if (error) {
// // // // // //         return (
// // // // // //             <View style={[styles.container, { backgroundColor: theme.background }]}>
// // // // // //                 <View style={styles.errorContainer}>
// // // // // //                     <View style={[styles.errorIconContainer, { backgroundColor: theme.error + '10' }]}>
// // // // // //                         <Icon name="wifi-off" size={60} color={theme.error} />
// // // // // //                     </View>
// // // // // //                     <Text style={[styles.errorText, { color: theme.text }]}>Connection Error</Text>
// // // // // //                     <Text style={[styles.errorSubtext, { color: theme.textSecondary }]}>
// // // // // //                         Unable to connect to the server. Please check your internet connection.
// // // // // //                     </Text>
// // // // // //                     <TouchableOpacity style={[styles.retryButton, { backgroundColor: theme.primary }]} onPress={() => refetch()}>
// // // // // //                         <Text style={styles.retryButtonText}>Try Again</Text>
// // // // // //                     </TouchableOpacity>
// // // // // //                 </View>
// // // // // //             </View>
// // // // // //         );
// // // // // //     }

// // // // // //     return (
// // // // // //         <View style={[styles.container, { backgroundColor: theme.background }]}>
// // // // // //             <View style={styles.contentContainer}>
// // // // // //                 {renderSearchBar()}
// // // // // //                 {renderFilters()}
                
// // // // // //                 <DayNavigator 
// // // // // //                     currentDate={selectedDate}
// // // // // //                     onDateChange={handleDateChange}
// // // // // //                     availableDates={[]}
// // // // // //                     theme={theme}
// // // // // //                 />

// // // // // //                 {(isLoading || isFetching) && !refreshing ? (
// // // // // //                     <SkeletonLoader theme={theme} />
// // // // // //                 ) : (
// // // // // //                     <FlatList
// // // // // //                         data={filteredEntries}
// // // // // //                         renderItem={({ item }) => (
// // // // // //                             <AccordionDiaryCard
// // // // // //                                 item={item}
// // // // // //                                 theme={theme}
// // // // // //                                 isExpanded={expandedId === item.id}
// // // // // //                                 onToggle={() => handleToggleExpand(item.id)}
// // // // // //                             />
// // // // // //                         )}
// // // // // //                         keyExtractor={(item) => item.id?.toString()}
// // // // // //                         contentContainerStyle={styles.listContent}
// // // // // //                         refreshControl={
// // // // // //                             <RefreshControl
// // // // // //                                 refreshing={refreshing}
// // // // // //                                 onRefresh={onRefresh}
// // // // // //                                 colors={[theme.primary]}
// // // // // //                                 tintColor={theme.primary}
// // // // // //                             />
// // // // // //                         }
// // // // // //                         ListEmptyComponent={renderEmptyState()}
// // // // // //                         showsVerticalScrollIndicator={false}
// // // // // //                         windowSize={5}
// // // // // //                         maxToRenderPerBatch={3}
// // // // // //                         updateCellsBatchingPeriod={50}
// // // // // //                         initialNumToRender={3}
// // // // // //                     />
// // // // // //                 )}
// // // // // //             </View>
// // // // // //         </View>
// // // // // //     );
// // // // // // };

// // // // // // const styles = StyleSheet.create({
// // // // // //     container: {
// // // // // //         flex: 1,
// // // // // //     },
// // // // // //     contentContainer: {
// // // // // //         flex: 1,
// // // // // //         paddingTop: 16,
// // // // // //     },
// // // // // //     searchWrapper: {
// // // // // //         flexDirection: 'row',
// // // // // //         alignItems: 'center',
// // // // // //         marginHorizontal: 16,
// // // // // //         marginBottom: 12,
// // // // // //         paddingHorizontal: 16,
// // // // // //         paddingVertical: 12,
// // // // // //         borderRadius: 16,
// // // // // //         borderWidth: 1,
// // // // // //     },
// // // // // //     searchWrapperFocused: {
// // // // // //         borderWidth: 2,
// // // // // //     },
// // // // // //     searchInput: {
// // // // // //         flex: 1,
// // // // // //         fontSize: 16,
// // // // // //         marginLeft: 12,
// // // // // //         paddingVertical: 0,
// // // // // //     },
// // // // // //     filtersSection: {
// // // // // //         marginBottom: 12,
// // // // // //     },
// // // // // //     filtersScroll: {
// // // // // //         paddingHorizontal: 16,
// // // // // //     },
// // // // // //     filterChip: {
// // // // // //         flexDirection: 'row',
// // // // // //         alignItems: 'center',
// // // // // //         paddingHorizontal: 16,
// // // // // //         paddingVertical: 8,
// // // // // //         borderRadius: 24,
// // // // // //         marginRight: 8,
// // // // // //         gap: 6,
// // // // // //         shadowColor: '#000',
// // // // // //         shadowOffset: { width: 0, height: 2 },
// // // // // //         shadowOpacity: 0.05,
// // // // // //         shadowRadius: 4,
// // // // // //         elevation: 2,
// // // // // //     },
// // // // // //     filterChipActive: {
// // // // // //         shadowOpacity: 0.2,
// // // // // //         shadowRadius: 6,
// // // // // //     },
// // // // // //     filterChipText: {
// // // // // //         fontSize: 14,
// // // // // //         fontWeight: '500',
// // // // // //     },
// // // // // //     dayNavigator: {
// // // // // //         flexDirection: 'row',
// // // // // //         justifyContent: 'space-between',
// // // // // //         alignItems: 'center',
// // // // // //         marginHorizontal: 16,
// // // // // //         marginBottom: 16,
// // // // // //         paddingHorizontal: 16,
// // // // // //         paddingVertical: 14,
// // // // // //         borderRadius: 16,
// // // // // //         shadowColor: '#000',
// // // // // //         shadowOffset: { width: 0, height: 2 },
// // // // // //         shadowOpacity: 0.05,
// // // // // //         shadowRadius: 4,
// // // // // //         elevation: 2,
// // // // // //     },
// // // // // //     navButton: {
// // // // // //         width: 40,
// // // // // //         height: 40,
// // // // // //         justifyContent: 'center',
// // // // // //         alignItems: 'center',
// // // // // //         borderRadius: 20,
// // // // // //     },
// // // // // //     navButtonDisabled: {
// // // // // //         opacity: 0.5,
// // // // // //     },
// // // // // //     dateDisplay: {
// // // // // //         alignItems: 'center',
// // // // // //         flex: 1,
// // // // // //     },
// // // // // //     dateDisplayText: {
// // // // // //         fontSize: 16,
// // // // // //         fontWeight: '600',
// // // // // //     },
// // // // // //     dateDisplaySub: {
// // // // // //         fontSize: 12,
// // // // // //         marginTop: 2,
// // // // // //     },
// // // // // //     listContent: {
// // // // // //         paddingHorizontal: 16,
// // // // // //         paddingBottom: 20,
// // // // // //     },
// // // // // //     entryCard: {
// // // // // //         padding: 16,
// // // // // //         borderRadius: 20,
// // // // // //         marginBottom: 12,
// // // // // //         shadowColor: '#000',
// // // // // //         shadowOffset: { width: 0, height: 4 },
// // // // // //         shadowOpacity: 0.08,
// // // // // //         shadowRadius: 8,
// // // // // //         elevation: 4,
// // // // // //     },
// // // // // //     expandedCard: {
// // // // // //         shadowOpacity: 0.12,
// // // // // //         shadowRadius: 12,
// // // // // //     },
// // // // // //     cardHeader: {
// // // // // //         flexDirection: 'row',
// // // // // //         justifyContent: 'space-between',
// // // // // //         alignItems: 'center',
// // // // // //         marginBottom: 12,
// // // // // //     },
// // // // // //     headerRight: {
// // // // // //         flexDirection: 'row',
// // // // // //         alignItems: 'center',
// // // // // //         gap: 8,
// // // // // //     },
// // // // // //     dateSection: {
// // // // // //         flexDirection: 'row',
// // // // // //         alignItems: 'center',
// // // // // //         gap: 8,
// // // // // //     },
// // // // // //     dateBadge: {
// // // // // //         flexDirection: 'row',
// // // // // //         alignItems: 'center',
// // // // // //         paddingHorizontal: 10,
// // // // // //         paddingVertical: 4,
// // // // // //         borderRadius: 12,
// // // // // //         gap: 4,
// // // // // //     },
// // // // // //     dateText: {
// // // // // //         fontSize: 12,
// // // // // //         fontWeight: '500',
// // // // // //     },
// // // // // //     dayText: {
// // // // // //         fontSize: 12,
// // // // // //     },
// // // // // //     subjectBadge: {
// // // // // //         flexDirection: 'row',
// // // // // //         alignItems: 'center',
// // // // // //         paddingHorizontal: 10,
// // // // // //         paddingVertical: 4,
// // // // // //         borderRadius: 12,
// // // // // //         gap: 4,
// // // // // //     },
// // // // // //     subjectText: {
// // // // // //         fontSize: 11,
// // // // // //         fontWeight: '600',
// // // // // //     },
// // // // // //     previewText: {
// // // // // //         fontSize: 14,
// // // // // //         lineHeight: 20,
// // // // // //         marginBottom: 12,
// // // // // //     },
// // // // // //     cardFooter: {
// // // // // //         flexDirection: 'row',
// // // // // //         justifyContent: 'space-between',
// // // // // //         alignItems: 'center',
// // // // // //     },
// // // // // //     teacherSection: {
// // // // // //         flexDirection: 'row',
// // // // // //         alignItems: 'center',
// // // // // //         gap: 8,
// // // // // //     },
// // // // // //     teacherAvatar: {
// // // // // //         width: 28,
// // // // // //         height: 28,
// // // // // //         borderRadius: 14,
// // // // // //         justifyContent: 'center',
// // // // // //         alignItems: 'center',
// // // // // //     },
// // // // // //     teacherText: {
// // // // // //         fontSize: 12,
// // // // // //     },
// // // // // //     statusBadge: {
// // // // // //         flexDirection: 'row',
// // // // // //         alignItems: 'center',
// // // // // //         paddingHorizontal: 10,
// // // // // //         paddingVertical: 4,
// // // // // //         borderRadius: 12,
// // // // // //         gap: 6,
// // // // // //     },
// // // // // //     statusDot: {
// // // // // //         width: 6,
// // // // // //         height: 6,
// // // // // //         borderRadius: 3,
// // // // // //     },
// // // // // //     statusText: {
// // // // // //         fontSize: 11,
// // // // // //         fontWeight: '600',
// // // // // //     },
// // // // // //     expandedContent: {
// // // // // //         marginTop: 12,
// // // // // //     },
// // // // // //     divider: {
// // // // // //         height: 1,
// // // // // //         marginBottom: 16,
// // // // // //     },
// // // // // //     expandedDateSection: {
// // // // // //         flexDirection: 'row',
// // // // // //         alignItems: 'center',
// // // // // //         gap: 8,
// // // // // //         marginBottom: 16,
// // // // // //     },
// // // // // //     expandedDateText: {
// // // // // //         fontSize: 13,
// // // // // //         flex: 1,
// // // // // //     },
// // // // // //     teacherInfo: {
// // // // // //         flex: 1,
// // // // // //     },
// // // // // //     teacherLabel: {
// // // // // //         fontSize: 11,
// // // // // //         marginBottom: 2,
// // // // // //     },
// // // // // //     teacherName: {
// // // // // //         fontSize: 14,
// // // // // //         fontWeight: '500',
// // // // // //     },
// // // // // //     fullContentSection: {
// // // // // //         marginTop: 16,
// // // // // //     },
// // // // // //     contentLabel: {
// // // // // //         fontSize: 15,
// // // // // //         fontWeight: '600',
// // // // // //         marginBottom: 12,
// // // // // //     },
// // // // // //     webView: {
// // // // // //         backgroundColor: 'transparent',
// // // // // //     },
// // // // // //     webViewHidden: {
// // // // // //         opacity: 0,
// // // // // //     },
// // // // // //     webViewLoader: {
// // // // // //         position: 'absolute',
// // // // // //         top: 0,
// // // // // //         left: 0,
// // // // // //         right: 0,
// // // // // //         bottom: 0,
// // // // // //         justifyContent: 'center',
// // // // // //         alignItems: 'center',
// // // // // //         zIndex: 1,
// // // // // //     },
// // // // // //     skeletonContainer: {
// // // // // //         paddingHorizontal: 16,
// // // // // //     },
// // // // // //     skeletonCard: {
// // // // // //         padding: 16,
// // // // // //         borderRadius: 20,
// // // // // //         marginBottom: 12,
// // // // // //     },
// // // // // //     skeletonHeader: {
// // // // // //         flexDirection: 'row',
// // // // // //         justifyContent: 'space-between',
// // // // // //         marginBottom: 12,
// // // // // //     },
// // // // // //     skeletonDate: {
// // // // // //         width: 100,
// // // // // //         height: 24,
// // // // // //         borderRadius: 12,
// // // // // //     },
// // // // // //     skeletonBadge: {
// // // // // //         width: 60,
// // // // // //         height: 24,
// // // // // //         borderRadius: 12,
// // // // // //     },
// // // // // //     skeletonLine: {
// // // // // //         height: 16,
// // // // // //         borderRadius: 8,
// // // // // //         marginBottom: 8,
// // // // // //     },
// // // // // //     skeletonFooter: {
// // // // // //         flexDirection: 'row',
// // // // // //         alignItems: 'center',
// // // // // //         marginTop: 8,
// // // // // //         gap: 8,
// // // // // //     },
// // // // // //     skeletonAvatar: {
// // // // // //         width: 28,
// // // // // //         height: 28,
// // // // // //         borderRadius: 14,
// // // // // //     },
// // // // // //     skeletonText: {
// // // // // //         width: 100,
// // // // // //         height: 14,
// // // // // //         borderRadius: 7,
// // // // // //     },
// // // // // //     emptyContainer: {
// // // // // //         alignItems: 'center',
// // // // // //         paddingVertical: 60,
// // // // // //     },
// // // // // //     emptyIconContainer: {
// // // // // //         width: 120,
// // // // // //         height: 120,
// // // // // //         borderRadius: 60,
// // // // // //         justifyContent: 'center',
// // // // // //         alignItems: 'center',
// // // // // //         marginBottom: 24,
// // // // // //     },
// // // // // //     emptyTitle: {
// // // // // //         fontSize: 18,
// // // // // //         fontWeight: '600',
// // // // // //         marginBottom: 8,
// // // // // //     },
// // // // // //     emptySubtitle: {
// // // // // //         fontSize: 14,
// // // // // //         textAlign: 'center',
// // // // // //         paddingHorizontal: 40,
// // // // // //         marginBottom: 24,
// // // // // //     },
// // // // // //     emptyButton: {
// // // // // //         paddingHorizontal: 32,
// // // // // //         paddingVertical: 12,
// // // // // //         borderRadius: 25,
// // // // // //     },
// // // // // //     emptyButtonText: {
// // // // // //         color: '#FFF',
// // // // // //         fontSize: 14,
// // // // // //         fontWeight: '600',
// // // // // //     },
// // // // // //     errorContainer: {
// // // // // //         flex: 1,
// // // // // //         justifyContent: 'center',
// // // // // //         alignItems: 'center',
// // // // // //         padding: 24,
// // // // // //     },
// // // // // //     errorIconContainer: {
// // // // // //         width: 100,
// // // // // //         height: 100,
// // // // // //         borderRadius: 50,
// // // // // //         justifyContent: 'center',
// // // // // //         alignItems: 'center',
// // // // // //         marginBottom: 24,
// // // // // //     },
// // // // // //     errorText: {
// // // // // //         fontSize: 20,
// // // // // //         fontWeight: 'bold',
// // // // // //         marginBottom: 8,
// // // // // //     },
// // // // // //     errorSubtext: {
// // // // // //         fontSize: 14,
// // // // // //         textAlign: 'center',
// // // // // //         lineHeight: 20,
// // // // // //         marginBottom: 24,
// // // // // //     },
// // // // // //     retryButton: {
// // // // // //         paddingHorizontal: 32,
// // // // // //         paddingVertical: 12,
// // // // // //         borderRadius: 25,
// // // // // //     },
// // // // // //     retryButtonText: {
// // // // // //         color: '#FFF',
// // // // // //         fontSize: 16,
// // // // // //         fontWeight: '600',
// // // // // //     },
// // // // // // });

// // // // // // export default ChildDiaryScreen;


// // // // // // src/screens/Parent/ChildDiaryScreen.js
// // // // // import React, { useState, useEffect, useCallback, useRef } from 'react';
// // // // // import {
// // // // //     View,
// // // // //     Text,
// // // // //     StyleSheet,
// // // // //     TouchableOpacity,
// // // // //     FlatList,
// // // // //     ActivityIndicator,
// // // // //     RefreshControl,
// // // // //     TextInput,
// // // // //     Modal,
// // // // //     Dimensions,
// // // // //     Animated,
// // // // //     Platform,
// // // // //     LayoutAnimation,
// // // // //     UIManager,
// // // // //     ScrollView,
// // // // //     Alert
// // // // // } from 'react-native';
// // // // // import { useSelector } from 'react-redux';
// // // // // import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// // // // // import DateTimePicker from '@react-native-community/datetimepicker';
// // // // // import { WebView } from 'react-native-webview';
// // // // // import { selectThemeData } from '../../store/slices/themeSlice';
// // // // // import { useGetChildDiaryQuery } from '../../store/attendanceApi';
// // // // // import { format, subDays, isAfter, isBefore, startOfToday } from 'date-fns';
// // // // // import RNHTMLtoPDF from 'react-native-html-to-pdf';
// // // // // import Share from 'react-native-share';

// // // // // // Enable LayoutAnimation for Android
// // // // // if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
// // // // //     UIManager.setLayoutAnimationEnabledExperimental(true);
// // // // // }

// // // // // const { width: SCREEN_WIDTH } = Dimensions.get('window');

// // // // // // Optimized WebView Component with dynamic height
// // // // // const OptimizedWebView = React.memo(({ content, theme, onHeightChange, isVisible }) => {
// // // // //     const webViewRef = useRef(null);
// // // // //     const [webViewHeight, setWebViewHeight] = useState(200);
// // // // //     const [isLoading, setIsLoading] = useState(true);
    
// // // // //     const getHTMLContent = useCallback(() => {
// // // // //         return `
// // // // //             <!DOCTYPE html>
// // // // //             <html>
// // // // //             <head>
// // // // //                 <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
// // // // //                 <style>
// // // // //                     * { margin: 0; padding: 0; box-sizing: border-box; }
// // // // //                     body {
// // // // //                         font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
// // // // //                         font-size: 15px;
// // // // //                         line-height: 1.6;
// // // // //                         padding: 16px;
// // // // //                         margin: 0;
// // // // //                         color: ${theme.isDarkMode ? '#e0e0e0' : '#2c3e50'};
// // // // //                         background-color: ${theme.isDarkMode ? '#121212' : '#ffffff'};
// // // // //                     }
// // // // //                     p { margin-bottom: 12px; line-height: 1.6; }
// // // // //                     img { max-width: 100%; height: auto; border-radius: 12px; margin: 12px 0; display: block; }
// // // // //                     h1 { font-size: 24px; font-weight: bold; margin: 16px 0 12px 0; color: ${theme.isDarkMode ? '#ffffff' : '#1a1a1a'}; }
// // // // //                     h2 { font-size: 20px; font-weight: bold; margin: 14px 0 10px 0; color: ${theme.isDarkMode ? '#ffffff' : '#1a1a1a'}; }
// // // // //                     h3 { font-size: 18px; font-weight: bold; margin: 12px 0 8px 0; color: ${theme.isDarkMode ? '#ffffff' : '#1a1a1a'}; }
// // // // //                     ul, ol { margin: 8px 0 12px 20px; }
// // // // //                     li { margin-bottom: 6px; line-height: 1.5; }
// // // // //                     a { color: ${theme.primary}; text-decoration: none; }
// // // // //                     blockquote {
// // // // //                         margin: 12px 0;
// // // // //                         padding: 8px 16px;
// // // // //                         border-left: 4px solid ${theme.primary};
// // // // //                         background-color: ${theme.isDarkMode ? '#1e1e1e' : '#f5f5f5'};
// // // // //                         border-radius: 8px;
// // // // //                     }
// // // // //                     table {
// // // // //                         width: 100%;
// // // // //                         border-collapse: collapse;
// // // // //                         margin: 12px 0;
// // // // //                     }
// // // // //                     th, td {
// // // // //                         border: 1px solid ${theme.isDarkMode ? '#333' : '#ddd'};
// // // // //                         padding: 8px;
// // // // //                         text-align: left;
// // // // //                     }
// // // // //                     th {
// // // // //                         background-color: ${theme.isDarkMode ? '#1e1e1e' : '#f5f5f5'};
// // // // //                         font-weight: bold;
// // // // //                     }
// // // // //                     code {
// // // // //                         background-color: ${theme.isDarkMode ? '#1e1e1e' : '#f5f5f5'};
// // // // //                         padding: 2px 6px;
// // // // //                         border-radius: 4px;
// // // // //                         font-family: monospace;
// // // // //                     }
// // // // //                     pre {
// // // // //                         background-color: ${theme.isDarkMode ? '#1e1e1e' : '#f5f5f5'};
// // // // //                         padding: 12px;
// // // // //                         border-radius: 8px;
// // // // //                         overflow-x: auto;
// // // // //                     }
// // // // //                     hr {
// // // // //                         margin: 16px 0;
// // // // //                         border: none;
// // // // //                         height: 1px;
// // // // //                         background-color: ${theme.isDarkMode ? '#333' : '#e0e0e0'};
// // // // //                     }
// // // // //                 </style>
// // // // //                 <script>
// // // // //                     function sendHeight() {
// // // // //                         const height = Math.max(document.body.scrollHeight, 100);
// // // // //                         window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'height', height: height }));
// // // // //                     }
                    
// // // // //                     function optimizeImagesAndSendHeight() {
// // // // //                         const images = document.querySelectorAll('img');
// // // // //                         if (images.length === 0) {
// // // // //                             sendHeight();
// // // // //                             return;
// // // // //                         }
                        
// // // // //                         let loadedCount = 0;
// // // // //                         const checkAllLoaded = () => {
// // // // //                             loadedCount++;
// // // // //                             if (loadedCount === images.length) {
// // // // //                                 sendHeight();
// // // // //                                 setTimeout(sendHeight, 200);
// // // // //                                 setTimeout(sendHeight, 500);
// // // // //                             }
// // // // //                         };
                        
// // // // //                         images.forEach(img => {
// // // // //                             if (img.complete && img.naturalHeight !== 0) {
// // // // //                                 checkAllLoaded();
// // // // //                             } else {
// // // // //                                 img.onload = checkAllLoaded;
// // // // //                                 img.onerror = checkAllLoaded;
// // // // //                             }
// // // // //                         });
// // // // //                     }
                    
// // // // //                     function initializeHeightTracking() {
// // // // //                         sendHeight();
// // // // //                         setTimeout(sendHeight, 100);
// // // // //                         setTimeout(sendHeight, 300);
// // // // //                         setTimeout(sendHeight, 600);
// // // // //                         setTimeout(sendHeight, 1000);
// // // // //                         optimizeImagesAndSendHeight();
// // // // //                     }
                    
// // // // //                     if (document.readyState === 'loading') {
// // // // //                         document.addEventListener('DOMContentLoaded', initializeHeightTracking);
// // // // //                     } else {
// // // // //                         initializeHeightTracking();
// // // // //                     }
                    
// // // // //                     const observer = new MutationObserver(() => sendHeight());
// // // // //                     observer.observe(document.body, { 
// // // // //                         childList: true, 
// // // // //                         subtree: true,
// // // // //                         attributes: true,
// // // // //                         characterData: true
// // // // //                     });
                    
// // // // //                     window.addEventListener('resize', () => setTimeout(sendHeight, 50));
// // // // //                 </script>
// // // // //             </head>
// // // // //             <body>
// // // // //                 ${content || '<p style="text-align:center;color:#999">No content available</p>'}
// // // // //             </body>
// // // // //             </html>
// // // // //         `;
// // // // //     }, [content, theme, theme.isDarkMode, theme.primary]);
    
// // // // //     const handleMessage = useCallback((event) => {
// // // // //         try {
// // // // //             const data = JSON.parse(event.nativeEvent.data);
// // // // //             if (data.type === 'height' && data.height && onHeightChange) {
// // // // //                 const newHeight = Math.max(data.height + 40, 100);
// // // // //                 if (Math.abs(webViewHeight - newHeight) > 5) {
// // // // //                     setWebViewHeight(newHeight);
// // // // //                     onHeightChange(newHeight);
// // // // //                 }
// // // // //             }
// // // // //         } catch (error) {}
// // // // //     }, [onHeightChange, webViewHeight]);
    
// // // // //     const handleLoadEnd = useCallback(() => {
// // // // //         setIsLoading(false);
// // // // //         webViewRef.current?.injectJavaScript(`
// // // // //             setTimeout(() => {
// // // // //                 const height = Math.max(document.body.scrollHeight, 100);
// // // // //                 window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'height', height: height }));
// // // // //             }, 50);
// // // // //             true;
// // // // //         `);
// // // // //     }, []);
    
// // // // //     if (!isVisible) {
// // // // //         return <View style={{ height: webViewHeight }} />;
// // // // //     }
    
// // // // //     return (
// // // // //         <View style={{ minHeight: webViewHeight, overflow: 'hidden', borderRadius: 12 }}>
// // // // //             {isLoading && (
// // // // //                 <View style={styles.webViewLoader}>
// // // // //                     <ActivityIndicator size="small" color={theme.primary} />
// // // // //                 </View>
// // // // //             )}
// // // // //             <WebView
// // // // //                 ref={webViewRef}
// // // // //                 source={{ html: getHTMLContent() }}
// // // // //                 style={[styles.webView, { height: webViewHeight }, isLoading && styles.webViewHidden]}
// // // // //                 scrollEnabled={false}
// // // // //                 onMessage={handleMessage}
// // // // //                 onLoadEnd={handleLoadEnd}
// // // // //                 originWhitelist={['*']}
// // // // //                 javaScriptEnabled={true}
// // // // //                 domStorageEnabled={true}
// // // // //                 cacheEnabled={true}
// // // // //                 cacheMode="LOAD_CACHE_ELSE_NETWORK"
// // // // //                 androidLayerType="software"
// // // // //                 showsVerticalScrollIndicator={false}
// // // // //                 showsHorizontalScrollIndicator={false}
// // // // //             />
// // // // //         </View>
// // // // //     );
// // // // // });

// // // // // // Skeleton Loader Component
// // // // // const SkeletonLoader = ({ theme }) => (
// // // // //     <View style={styles.skeletonContainer}>
// // // // //         {[1, 2, 3].map((item) => (
// // // // //             <View key={item} style={[styles.skeletonCard, { backgroundColor: theme.card }]}>
// // // // //                 <View style={styles.skeletonHeader}>
// // // // //                     <View style={[styles.skeletonDate, { backgroundColor: theme.border }]} />
// // // // //                     <View style={[styles.skeletonBadge, { backgroundColor: theme.border }]} />
// // // // //                 </View>
// // // // //                 <View style={[styles.skeletonLine, { backgroundColor: theme.border }]} />
// // // // //                 <View style={[styles.skeletonLine, { backgroundColor: theme.border, width: '80%' }]} />
// // // // //                 <View style={styles.skeletonFooter}>
// // // // //                     <View style={[styles.skeletonAvatar, { backgroundColor: theme.border }]} />
// // // // //                     <View style={[styles.skeletonText, { backgroundColor: theme.border }]} />
// // // // //                 </View>
// // // // //             </View>
// // // // //         ))}
// // // // //     </View>
// // // // // );

// // // // // // Accordion Diary Card Component
// // // // // const AccordionDiaryCard = ({ item, theme, isExpanded, onToggle }) => {
// // // // //     const scaleAnim = useRef(new Animated.Value(1)).current;
// // // // //     const [webViewHeight, setWebViewHeight] = useState(200);
    
// // // // //     const getPlainText = (html) => {
// // // // //         if (!html) return 'No preview available';
// // // // //         return html.replace(/<[^>]*>/g, '').substring(0, 120);
// // // // //     };

// // // // //     const plainTextPreview = getPlainText(item.content);
    
// // // // //     const formatDate = (dateString) => {
// // // // //         const date = new Date(dateString);
// // // // //         return format(date, 'MMM d, yyyy');
// // // // //     };

// // // // //     const formatFullDate = (dateString) => {
// // // // //         const date = new Date(dateString);
// // // // //         return format(date, 'EEEE, MMMM d, yyyy');
// // // // //     };

// // // // //     const handlePressIn = () => {
// // // // //         Animated.spring(scaleAnim, {
// // // // //             toValue: 0.98,
// // // // //             useNativeDriver: true,
// // // // //             speed: 50,
// // // // //         }).start();
// // // // //     };

// // // // //     const handlePressOut = () => {
// // // // //         Animated.spring(scaleAnim, {
// // // // //             toValue: 1,
// // // // //             useNativeDriver: true,
// // // // //             speed: 50,
// // // // //         }).start();
// // // // //     };

// // // // //     const handlePress = () => {
// // // // //         LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
// // // // //         onToggle();
// // // // //     };
    
// // // // //     const handleWebViewHeightChange = useCallback((height) => {
// // // // //         setWebViewHeight(height);
// // // // //     }, []);

// // // // //     return (
// // // // //         <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
// // // // //             <TouchableOpacity
// // // // //                 activeOpacity={0.9}
// // // // //                 onPressIn={handlePressIn}
// // // // //                 onPressOut={handlePressOut}
// // // // //                 onPress={handlePress}
// // // // //                 style={[styles.entryCard, { backgroundColor: theme.card }, isExpanded && styles.expandedCard]}
// // // // //             >
// // // // //                 <View style={styles.cardHeader}>
// // // // //                     <View style={styles.dateSection}>
// // // // //                         <View style={[styles.dateBadge, { backgroundColor: theme.primary + '15' }]}>
// // // // //                             <Icon name="calendar-today" size={14} color={theme.primary} />
// // // // //                             <Text style={[styles.dateText, { color: theme.text }]}>{formatDate(item.date)}</Text>
// // // // //                         </View>
// // // // //                         <Text style={[styles.dayText, { color: theme.textSecondary }]}>{item.day}</Text>
// // // // //                     </View>
// // // // //                     <View style={styles.headerRight}>
// // // // //                         <View style={[styles.subjectBadge, { backgroundColor: theme.primary + '15' }]}>
// // // // //                             <Icon name="book-open-variant" size={12} color={theme.primary} />
// // // // //                             <Text style={[styles.subjectText, { color: theme.primary }]}>{item.subject}</Text>
// // // // //                         </View>
// // // // //                         <Icon name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color={theme.textSecondary} />
// // // // //                     </View>
// // // // //                 </View>

// // // // //                 {!isExpanded && (
// // // // //                     <Text style={[styles.previewText, { color: theme.text }]} numberOfLines={2}>
// // // // //                         {plainTextPreview}
// // // // //                     </Text>
// // // // //                 )}

// // // // //                 {isExpanded && (
// // // // //                     <View style={styles.expandedContent}>
// // // // //                         <View style={[styles.divider, { backgroundColor: theme.border }]} />
                        
// // // // //                         <View style={styles.expandedDateSection}>
// // // // //                             <Icon name="calendar-clock" size={16} color={theme.primary} />
// // // // //                             <Text style={[styles.expandedDateText, { color: theme.textSecondary }]}>{formatFullDate(item.date)}</Text>
// // // // //                         </View>

// // // // //                         <View style={styles.teacherSection}>
// // // // //                             <View style={[styles.teacherAvatar, { backgroundColor: theme.primary + '15' }]}>
// // // // //                                 <Icon name="account" size={14} color={theme.primary} />
// // // // //                             </View>
// // // // //                             <View style={styles.teacherInfo}>
// // // // //                                 <Text style={[styles.teacherLabel, { color: theme.textSecondary }]}>Teacher</Text>
// // // // //                                 <Text style={[styles.teacherName, { color: theme.text }]}>{item.teacher}</Text>
// // // // //                             </View>
// // // // //                         </View>

// // // // //                         <View style={[styles.statusBadge, { backgroundColor: item.isPublished ? theme.success + '15' : theme.warning + '15' }]}>
// // // // //                             <View style={[styles.statusDot, { backgroundColor: item.isPublished ? theme.success : theme.warning }]} />
// // // // //                             <Text style={[styles.statusText, { color: item.isPublished ? theme.success : theme.warning }]}>
// // // // //                                 {item.isPublished ? 'Published' : 'Draft'}
// // // // //                             </Text>
// // // // //                         </View>

// // // // //                         <View style={styles.fullContentSection}>
// // // // //                             <Text style={[styles.contentLabel, { color: theme.text }]}>📝 Content</Text>
// // // // //                             <OptimizedWebView
// // // // //                                 content={item.content}
// // // // //                                 theme={theme}
// // // // //                                 onHeightChange={handleWebViewHeightChange}
// // // // //                                 isVisible={isExpanded}
// // // // //                             />
// // // // //                         </View>
// // // // //                     </View>
// // // // //                 )}

// // // // //                 {!isExpanded && (
// // // // //                     <View style={styles.cardFooter}>
// // // // //                         <View style={styles.teacherSection}>
// // // // //                             <View style={[styles.teacherAvatar, { backgroundColor: theme.primary + '15' }]}>
// // // // //                                 <Icon name="account" size={14} color={theme.primary} />
// // // // //                             </View>
// // // // //                             <Text style={[styles.teacherText, { color: theme.textSecondary }]}>{item.teacher}</Text>
// // // // //                         </View>
// // // // //                         <View style={[styles.statusBadge, { backgroundColor: item.isPublished ? theme.success + '15' : theme.warning + '15' }]}>
// // // // //                             <View style={[styles.statusDot, { backgroundColor: item.isPublished ? theme.success : theme.warning }]} />
// // // // //                             <Text style={[styles.statusText, { color: item.isPublished ? theme.success : theme.warning }]}>
// // // // //                                 {item.isPublished ? 'Published' : 'Draft'}
// // // // //                             </Text>
// // // // //                         </View>
// // // // //                     </View>
// // // // //                 )}
// // // // //             </TouchableOpacity>
// // // // //         </Animated.View>
// // // // //     );
// // // // // };

// // // // // // Filter Chip Component
// // // // // const FilterChip = ({ label, isActive, onPress, icon, theme }) => (
// // // // //     <TouchableOpacity
// // // // //         style={[styles.filterChip, { backgroundColor: isActive ? theme.primary : theme.card }, isActive && styles.filterChipActive]}
// // // // //         onPress={onPress}
// // // // //         activeOpacity={0.7}
// // // // //     >
// // // // //         {icon && <Icon name={icon} size={16} color={isActive ? '#FFF' : theme.textSecondary} />}
// // // // //         <Text style={[styles.filterChipText, { color: isActive ? '#FFF' : theme.text }]}>{label}</Text>
// // // // //     </TouchableOpacity>
// // // // // );

// // // // // // Day Navigator Component
// // // // // const DayNavigator = ({ currentDate, onDateChange, theme }) => {
// // // // //     const today = startOfToday();
// // // // //     const sevenDaysAgo = subDays(today, 7);
    
// // // // //     const canGoPrevious = isAfter(new Date(currentDate), sevenDaysAgo);
// // // // //     const canGoNext = isBefore(new Date(currentDate), today);
    
// // // // //     const handlePrevious = () => {
// // // // //         if (canGoPrevious) {
// // // // //             const newDate = subDays(new Date(currentDate), 1);
// // // // //             onDateChange(format(newDate, 'yyyy-MM-dd'));
// // // // //         }
// // // // //     };
    
// // // // //     const handleNext = () => {
// // // // //         if (canGoNext) {
// // // // //             const newDate = subDays(new Date(currentDate), -1);
// // // // //             onDateChange(format(newDate, 'yyyy-MM-dd'));
// // // // //         }
// // // // //     };
    
// // // // //     const handleToday = () => {
// // // // //         onDateChange(format(today, 'yyyy-MM-dd'));
// // // // //     };
    
// // // // //     const formatDisplayDate = (dateString) => {
// // // // //         const date = new Date(dateString);
// // // // //         const today_date = startOfToday();
// // // // //         const yesterday = subDays(today_date, 1);
        
// // // // //         if (format(date, 'yyyy-MM-dd') === format(today_date, 'yyyy-MM-dd')) {
// // // // //             return 'Today';
// // // // //         } else if (format(date, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd')) {
// // // // //             return 'Yesterday';
// // // // //         } else {
// // // // //             return format(date, 'EEEE, MMM d');
// // // // //         }
// // // // //     };
    
// // // // //     return (
// // // // //         <View style={[styles.dayNavigator, { backgroundColor: theme.card }]}>
// // // // //             <TouchableOpacity onPress={handlePrevious} style={[styles.navButton, !canGoPrevious && styles.navButtonDisabled]} disabled={!canGoPrevious}>
// // // // //                 <Icon name="chevron-left" size={24} color={canGoPrevious ? theme.primary : theme.textSecondary} />
// // // // //             </TouchableOpacity>
            
// // // // //             <TouchableOpacity onPress={handleToday} style={styles.dateDisplay}>
// // // // //                 <Text style={[styles.dateDisplayText, { color: theme.text }]}>{formatDisplayDate(currentDate)}</Text>
// // // // //                 <Text style={[styles.dateDisplaySub, { color: theme.textSecondary }]}>{format(new Date(currentDate), 'MMMM d, yyyy')}</Text>
// // // // //             </TouchableOpacity>
            
// // // // //             <TouchableOpacity onPress={handleNext} style={[styles.navButton, !canGoNext && styles.navButtonDisabled]} disabled={!canGoNext}>
// // // // //                 <Icon name="chevron-right" size={24} color={canGoNext ? theme.primary : theme.textSecondary} />
// // // // //             </TouchableOpacity>
// // // // //         </View>
// // // // //     );
// // // // // };

// // // // // const ChildDiaryScreen = ({ route, navigation }) => {
// // // // //     const theme = useSelector(selectThemeData);
// // // // //     const { childId, childName } = route.params;

// // // // //     const [refreshing, setRefreshing] = useState(false);
// // // // //     const [diaryEntries, setDiaryEntries] = useState([]);
// // // // //     const [filteredEntries, setFilteredEntries] = useState([]);
// // // // //     const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
// // // // //     const [selectedSubject, setSelectedSubject] = useState('All');
// // // // //     const [searchQuery, setSearchQuery] = useState('');
// // // // //     const [subjects, setSubjects] = useState([]);
// // // // //     const [isSearchFocused, setIsSearchFocused] = useState(false);
// // // // //     const [expandedId, setExpandedId] = useState(null);
// // // // //     const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

// // // // //     const fadeAnim = useRef(new Animated.Value(0)).current;

// // // // //     const {
// // // // //         data: diaryResponse,
// // // // //         isLoading,
// // // // //         isFetching,
// // // // //         error,
// // // // //         refetch,
// // // // //     } = useGetChildDiaryQuery({
// // // // //         childId,
// // // // //         filters: {
// // // // //             date: selectedDate,
// // // // //             subjectId: selectedSubject !== 'All' ? selectedSubject : null,
// // // // //         },
// // // // //     });

// // // // //     useEffect(() => {
// // // // //         if (diaryResponse?.success === true && diaryResponse?.data?.entries) {
// // // // //             processDiaryData(diaryResponse.data.entries);
// // // // //             Animated.timing(fadeAnim, {
// // // // //                 toValue: 1,
// // // // //                 duration: 500,
// // // // //                 useNativeDriver: true,
// // // // //             }).start();
// // // // //         }
// // // // //     }, [diaryResponse]);

// // // // //     useEffect(() => {
// // // // //         filterEntries();
// // // // //     }, [searchQuery, selectedSubject, diaryEntries]);

// // // // //     const processDiaryData = (entries) => {
// // // // //         const transformedEntries = entries.map(entry => {
// // // // //             const dateObj = entry.date ? new Date(entry.date) : new Date();
// // // // //             const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
// // // // //             const dayName = !isNaN(dateObj.getTime()) ? dayNames[dateObj.getDay()] : '';

// // // // //             return {
// // // // //                 id: entry.id,
// // // // //                 date: entry.date || '',
// // // // //                 day: dayName,
// // // // //                 subject: entry.subject || 'General',
// // // // //                 subjectId: entry.subjectId,
// // // // //                 content: entry.content || '',
// // // // //                 teacher: entry.teacher || 'Teacher',
// // // // //                 isPublished: entry.isPublished || false,
// // // // //                 createdAt: entry.createdAt,
// // // // //             };
// // // // //         });

// // // // //         const sortedEntries = transformedEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
        
// // // // //         const uniqueSubjects = [...new Map(sortedEntries.map(entry => [
// // // // //             entry.subjectId, { id: entry.subjectId, name: entry.subject }
// // // // //         ])).values()];
// // // // //         setSubjects(uniqueSubjects);
        
// // // // //         setDiaryEntries(sortedEntries);
// // // // //         setFilteredEntries(sortedEntries);
// // // // //     };

// // // // //     const filterEntries = () => {
// // // // //         let filtered = [...diaryEntries];
// // // // //         if (searchQuery.trim()) {
// // // // //             const query = searchQuery.toLowerCase();
// // // // //             filtered = filtered.filter(entry =>
// // // // //                 entry.subject.toLowerCase().includes(query) ||
// // // // //                 entry.teacher.toLowerCase().includes(query) ||
// // // // //                 (entry.content && entry.content.toLowerCase().includes(query))
// // // // //             );
// // // // //         }
// // // // //         if (selectedSubject !== 'All') {
// // // // //             filtered = filtered.filter(entry => entry.subjectId === selectedSubject);
// // // // //         }
// // // // //         setFilteredEntries(filtered);
        
// // // // //         if (expandedId) {
// // // // //             setExpandedId(null);
// // // // //         }
// // // // //     };

// // // // //     const onRefresh = async () => {
// // // // //         setRefreshing(true);
// // // // //         await refetch();
// // // // //         setRefreshing(false);
// // // // //     };

// // // // //     const handleDateChange = (date) => {
// // // // //         LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
// // // // //         setSelectedDate(date);
// // // // //         setExpandedId(null);
// // // // //     };

// // // // //     const handleResetFilters = () => {
// // // // //         LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
// // // // //         setSelectedSubject('All');
// // // // //         setSearchQuery('');
// // // // //         setExpandedId(null);
// // // // //     };

// // // // //     const handleToggleExpand = (id) => {
// // // // //         setExpandedId(expandedId === id ? null : id);
// // // // //     };

// // // // //     // Generate PDF HTML for printing (clean format)
// // // // //     const generatePDFHTML = () => {
// // // // //         const entriesHTML = filteredEntries.map(entry => `
// // // // //             <div style="margin-bottom: 30px; page-break-inside: avoid; border-bottom: 1px solid #e0e0e0; padding-bottom: 20px;">
// // // // //                 <h2 style="color: #2c3e50; margin-bottom: 10px; font-size: 20px;">${entry.subject}</h2>
// // // // //                 <div style="color: #7f8c8d; margin-bottom: 15px; font-size: 13px;">
// // // // //                     <div><strong>📅 Date:</strong> ${format(new Date(entry.date), 'EEEE, MMMM d, yyyy')}</div>
// // // // //                     <div><strong>👨‍🏫 Teacher:</strong> ${entry.teacher}</div>
// // // // //                     <div><strong>📌 Status:</strong> ${entry.isPublished ? 'Published' : 'Draft'}</div>
// // // // //                 </div>
// // // // //                 <div style="margin-top: 15px; line-height: 1.6; font-size: 14px;">
// // // // //                     ${entry.content || '<p style="color: #999;">No content available</p>'}
// // // // //                 </div>
// // // // //             </div>
// // // // //         `).join('');

// // // // //         return `
// // // // //             <!DOCTYPE html>
// // // // //             <html>
// // // // //             <head>
// // // // //                 <meta charset="UTF-8">
// // // // //                 <meta name="viewport" content="width=device-width, initial-scale=1.0">
// // // // //                 <title>${childName}'s Diary - ${format(new Date(selectedDate), 'MMMM d, yyyy')}</title>
// // // // //                 <style>
// // // // //                     * { margin: 0; padding: 0; box-sizing: border-box; }
// // // // //                     body {
// // // // //                         font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
// // // // //                         padding: 40px;
// // // // //                         color: #333;
// // // // //                         line-height: 1.6;
// // // // //                         background-color: white;
// // // // //                     }
// // // // //                     .header {
// // // // //                         text-align: center;
// // // // //                         margin-bottom: 40px;
// // // // //                         padding-bottom: 20px;
// // // // //                         border-bottom: 3px solid #3498db;
// // // // //                     }
// // // // //                     .header h1 {
// // // // //                         color: #2c3e50;
// // // // //                         margin-bottom: 10px;
// // // // //                         font-size: 28px;
// // // // //                     }
// // // // //                     .header p {
// // // // //                         color: #7f8c8d;
// // // // //                         font-size: 14px;
// // // // //                     }
// // // // //                     .date-range {
// // // // //                         text-align: center;
// // // // //                         background-color: #f8f9fa;
// // // // //                         padding: 12px;
// // // // //                         border-radius: 8px;
// // // // //                         margin-bottom: 30px;
// // // // //                         font-size: 14px;
// // // // //                         border: 1px solid #e0e0e0;
// // // // //                     }
// // // // //                     img {
// // // // //                         max-width: 100%;
// // // // //                         height: auto;
// // // // //                         border-radius: 8px;
// // // // //                         margin: 10px 0;
// // // // //                     }
// // // // //                     .footer {
// // // // //                         margin-top: 50px;
// // // // //                         text-align: center;
// // // // //                         color: #95a5a6;
// // // // //                         font-size: 11px;
// // // // //                         border-top: 1px solid #e0e0e0;
// // // // //                         padding-top: 20px;
// // // // //                     }
// // // // //                     @media print {
// // // // //                         body { padding: 20px; }
// // // // //                         .no-break { page-break-inside: avoid; }
// // // // //                     }
// // // // //                 </style>
// // // // //             </head>
// // // // //             <body>
// // // // //                 <div class="header">
// // // // //                     <h1>${childName}'s Learning Diary</h1>
// // // // //                     <p>School Activities & Progress Report</p>
// // // // //                 </div>
// // // // //                 <div class="date-range">
// // // // //                     <strong>📅 Date:</strong> ${format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}
// // // // //                 </div>
// // // // //                 ${entriesHTML}
// // // // //                 <div class="footer">
// // // // //                     Generated on ${format(new Date(), 'MMMM d, yyyy h:mm a')}
// // // // //                 </div>
// // // // //             </body>
// // // // //             </html>
// // // // //         `;
// // // // //     };

// // // // //     // Generate and Share PDF
// // // // //     const shareDiaryAsPDF = async () => {
// // // // //         if (filteredEntries.length === 0) {
// // // // //             Alert.alert('No Entries', 'There are no diary entries to share for this day.');
// // // // //             return;
// // // // //         }

// // // // //         setIsGeneratingPDF(true);
        
// // // // //         try {
// // // // //             const htmlContent = generatePDFHTML();
// // // // //             const fileName = `${childName.replace(/\s/g, '_')}_Diary_${format(new Date(selectedDate), 'yyyy-MM-dd')}`;
            
// // // // //             const options = {
// // // // //                 html: htmlContent,
// // // // //                 fileName: fileName,
// // // // //                 directory: 'Documents',
// // // // //                 height: 842, // A4 height
// // // // //                 width: 595,  // A4 width
// // // // //             };
            
// // // // //             const pdfFile = await RNHTMLtoPDF.convert(options);
            
// // // // //             if (pdfFile && pdfFile.filePath) {
// // // // //                 await Share.open({
// // // // //                     url: `file://${pdfFile.filePath}`,
// // // // //                     type: 'application/pdf',
// // // // //                     title: `Share ${childName}'s Diary`,
// // // // //                     subject: `Diary Entry for ${format(new Date(selectedDate), 'MMMM d, yyyy')}`,
// // // // //                 });
// // // // //             } else {
// // // // //                 Alert.alert('Error', 'Failed to generate PDF');
// // // // //             }
// // // // //         } catch (error) {
// // // // //             console.error('PDF Error:', error);
// // // // //             Alert.alert('Error', 'Failed to generate or share PDF. Please try again.');
// // // // //         } finally {
// // // // //             setIsGeneratingPDF(false);
// // // // //         }
// // // // //     };

// // // // //     const renderSearchBar = () => (
// // // // //         <View style={[styles.searchWrapper, isSearchFocused && styles.searchWrapperFocused, { borderColor: theme.border, backgroundColor: theme.card }]}>
// // // // //             <Icon name="magnify" size={20} color={theme.textSecondary} />
// // // // //             <TextInput
// // // // //                 style={[styles.searchInput, { color: theme.text }]}
// // // // //                 placeholder="Search by subject or teacher..."
// // // // //                 placeholderTextColor={theme.textSecondary}
// // // // //                 value={searchQuery}
// // // // //                 onChangeText={setSearchQuery}
// // // // //                 onFocus={() => setIsSearchFocused(true)}
// // // // //                 onBlur={() => setIsSearchFocused(false)}
// // // // //             />
// // // // //             {searchQuery !== '' && (
// // // // //                 <TouchableOpacity onPress={() => setSearchQuery('')}>
// // // // //                     <Icon name="close-circle" size={20} color={theme.textSecondary} />
// // // // //                 </TouchableOpacity>
// // // // //             )}
// // // // //         </View>
// // // // //     );

// // // // //     const renderFilters = () => (
// // // // //         <View style={styles.filtersSection}>
// // // // //             <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
// // // // //                 <FilterChip label="All Subjects" isActive={selectedSubject === 'All'} onPress={() => setSelectedSubject('All')} theme={theme} />
// // // // //                 {subjects.map(subject => (
// // // // //                     <FilterChip key={subject.id} label={subject.name} isActive={selectedSubject === subject.id} onPress={() => setSelectedSubject(subject.id)} theme={theme} />
// // // // //                 ))}
// // // // //             </ScrollView>
// // // // //         </View>
// // // // //     );

// // // // //     const renderHeader = () => (
// // // // //         <View style={[styles.headerContainer, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
// // // // //             <View style={styles.headerTop}>
// // // // //                 <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
// // // // //                     <Icon name="arrow-left" size={24} color={theme.text} />
// // // // //                 </TouchableOpacity>
// // // // //                 <Text style={[styles.headerTitle, { color: theme.text }]}>{childName}'s Diary</Text>
// // // // //                 <TouchableOpacity onPress={shareDiaryAsPDF} style={styles.shareButton} disabled={isGeneratingPDF}>
// // // // //                     {isGeneratingPDF ? (
// // // // //                         <ActivityIndicator size="small" color={theme.primary} />
// // // // //                     ) : (
// // // // //                         <Icon name="file-pdf-box" size={24} color="#e74c3c" />
// // // // //                     )}
// // // // //                 </TouchableOpacity>
// // // // //             </View>
// // // // //         </View>
// // // // //     );

// // // // //     const renderEmptyState = () => (
// // // // //         <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
// // // // //             <View style={[styles.emptyIconContainer, { backgroundColor: theme.primary + '10' }]}>
// // // // //                 <Icon name="notebook-edit-outline" size={64} color={theme.primary} />
// // // // //             </View>
// // // // //             <Text style={[styles.emptyTitle, { color: theme.text }]}>
// // // // //                 {searchQuery || selectedSubject !== 'All' ? 'No matching entries' : 'No diary entries for this day'}
// // // // //             </Text>
// // // // //             <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
// // // // //                 {searchQuery || selectedSubject !== 'All'
// // // // //                     ? 'Try adjusting your filters to see more results'
// // // // //                     : `No diary entries found for ${format(new Date(selectedDate), 'MMMM d, yyyy')}`}
// // // // //             </Text>
// // // // //             {(searchQuery || selectedSubject !== 'All') && (
// // // // //                 <TouchableOpacity style={[styles.emptyButton, { backgroundColor: theme.primary }]} onPress={handleResetFilters}>
// // // // //                     <Text style={styles.emptyButtonText}>Clear Filters</Text>
// // // // //                 </TouchableOpacity>
// // // // //             )}
// // // // //         </Animated.View>
// // // // //     );

// // // // //     if (error) {
// // // // //         return (
// // // // //             <View style={[styles.container, { backgroundColor: theme.background }]}>
// // // // //                 {renderHeader()}
// // // // //                 <View style={styles.errorContainer}>
// // // // //                     <View style={[styles.errorIconContainer, { backgroundColor: theme.error + '10' }]}>
// // // // //                         <Icon name="wifi-off" size={60} color={theme.error} />
// // // // //                     </View>
// // // // //                     <Text style={[styles.errorText, { color: theme.text }]}>Connection Error</Text>
// // // // //                     <Text style={[styles.errorSubtext, { color: theme.textSecondary }]}>
// // // // //                         Unable to connect to the server. Please check your internet connection.
// // // // //                     </Text>
// // // // //                     <TouchableOpacity style={[styles.retryButton, { backgroundColor: theme.primary }]} onPress={() => refetch()}>
// // // // //                         <Text style={styles.retryButtonText}>Try Again</Text>
// // // // //                     </TouchableOpacity>
// // // // //                 </View>
// // // // //             </View>
// // // // //         );
// // // // //     }

// // // // //     return (
// // // // //         <View style={[styles.container, { backgroundColor: theme.background }]}>
// // // // //             {renderHeader()}
// // // // //             <View style={styles.contentContainer}>
// // // // //                 {renderSearchBar()}
// // // // //                 {renderFilters()}
                
// // // // //                 <DayNavigator currentDate={selectedDate} onDateChange={handleDateChange} theme={theme} />

// // // // //                 {(isLoading || isFetching) && !refreshing ? (
// // // // //                     <SkeletonLoader theme={theme} />
// // // // //                 ) : (
// // // // //                     <FlatList
// // // // //                         data={filteredEntries}
// // // // //                         renderItem={({ item }) => (
// // // // //                             <AccordionDiaryCard
// // // // //                                 item={item}
// // // // //                                 theme={theme}
// // // // //                                 isExpanded={expandedId === item.id}
// // // // //                                 onToggle={() => handleToggleExpand(item.id)}
// // // // //                             />
// // // // //                         )}
// // // // //                         keyExtractor={(item) => item.id?.toString()}
// // // // //                         contentContainerStyle={styles.listContent}
// // // // //                         refreshControl={
// // // // //                             <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} tintColor={theme.primary} />
// // // // //                         }
// // // // //                         ListEmptyComponent={renderEmptyState()}
// // // // //                         showsVerticalScrollIndicator={false}
// // // // //                         windowSize={5}
// // // // //                         maxToRenderPerBatch={3}
// // // // //                         updateCellsBatchingPeriod={50}
// // // // //                         initialNumToRender={3}
// // // // //                     />
// // // // //                 )}
// // // // //             </View>
// // // // //         </View>
// // // // //     );
// // // // // };

// // // // // const styles = StyleSheet.create({
// // // // //     container: { flex: 1 },
// // // // //     headerContainer: {
// // // // //         paddingTop: Platform.OS === 'ios' ? 50 : 40,
// // // // //         paddingBottom: 16,
// // // // //         borderBottomWidth: 1,
// // // // //         elevation: 2,
// // // // //         shadowColor: '#000',
// // // // //         shadowOffset: { width: 0, height: 2 },
// // // // //         shadowOpacity: 0.05,
// // // // //         shadowRadius: 4,
// // // // //     },
// // // // //     headerTop: {
// // // // //         flexDirection: 'row',
// // // // //         alignItems: 'center',
// // // // //         justifyContent: 'space-between',
// // // // //         paddingHorizontal: 16,
// // // // //     },
// // // // //     backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
// // // // //     headerTitle: { fontSize: 18, fontWeight: '600', flex: 1, textAlign: 'center' },
// // // // //     shareButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
// // // // //     contentContainer: { flex: 1, paddingTop: 16 },
// // // // //     searchWrapper: {
// // // // //         flexDirection: 'row',
// // // // //         alignItems: 'center',
// // // // //         marginHorizontal: 16,
// // // // //         marginBottom: 12,
// // // // //         paddingHorizontal: 16,
// // // // //         paddingVertical: 12,
// // // // //         borderRadius: 16,
// // // // //         borderWidth: 1,
// // // // //     },
// // // // //     searchWrapperFocused: { borderWidth: 2 },
// // // // //     searchInput: { flex: 1, fontSize: 16, marginLeft: 12, paddingVertical: 0 },
// // // // //     filtersSection: { marginBottom: 12 },
// // // // //     filtersScroll: { paddingHorizontal: 16 },
// // // // //     filterChip: {
// // // // //         flexDirection: 'row',
// // // // //         alignItems: 'center',
// // // // //         paddingHorizontal: 16,
// // // // //         paddingVertical: 8,
// // // // //         borderRadius: 24,
// // // // //         marginRight: 8,
// // // // //         gap: 6,
// // // // //         shadowColor: '#000',
// // // // //         shadowOffset: { width: 0, height: 2 },
// // // // //         shadowOpacity: 0.05,
// // // // //         shadowRadius: 4,
// // // // //         elevation: 2,
// // // // //     },
// // // // //     filterChipActive: { shadowOpacity: 0.2, shadowRadius: 6 },
// // // // //     filterChipText: { fontSize: 14, fontWeight: '500' },
// // // // //     dayNavigator: {
// // // // //         flexDirection: 'row',
// // // // //         justifyContent: 'space-between',
// // // // //         alignItems: 'center',
// // // // //         marginHorizontal: 16,
// // // // //         marginBottom: 16,
// // // // //         paddingHorizontal: 16,
// // // // //         paddingVertical: 14,
// // // // //         borderRadius: 16,
// // // // //         shadowColor: '#000',
// // // // //         shadowOffset: { width: 0, height: 2 },
// // // // //         shadowOpacity: 0.05,
// // // // //         shadowRadius: 4,
// // // // //         elevation: 2,
// // // // //     },
// // // // //     navButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20 },
// // // // //     navButtonDisabled: { opacity: 0.5 },
// // // // //     dateDisplay: { alignItems: 'center', flex: 1 },
// // // // //     dateDisplayText: { fontSize: 16, fontWeight: '600' },
// // // // //     dateDisplaySub: { fontSize: 12, marginTop: 2 },
// // // // //     listContent: { paddingHorizontal: 16, paddingBottom: 20 },
// // // // //     entryCard: { padding: 16, borderRadius: 20, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4 },
// // // // //     expandedCard: { shadowOpacity: 0.12, shadowRadius: 12 },
// // // // //     cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
// // // // //     headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
// // // // //     dateSection: { flexDirection: 'row', alignItems: 'center', gap: 8 },
// // // // //     dateBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 4 },
// // // // //     dateText: { fontSize: 12, fontWeight: '500' },
// // // // //     dayText: { fontSize: 12 },
// // // // //     subjectBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 4 },
// // // // //     subjectText: { fontSize: 11, fontWeight: '600' },
// // // // //     previewText: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
// // // // //     cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
// // // // //     teacherSection: { flexDirection: 'row', alignItems: 'center', gap: 8 },
// // // // //     teacherAvatar: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
// // // // //     teacherText: { fontSize: 12 },
// // // // //     statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 6 },
// // // // //     statusDot: { width: 6, height: 6, borderRadius: 3 },
// // // // //     statusText: { fontSize: 11, fontWeight: '600' },
// // // // //     expandedContent: { marginTop: 12 },
// // // // //     divider: { height: 1, marginBottom: 16 },
// // // // //     expandedDateSection: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
// // // // //     expandedDateText: { fontSize: 13, flex: 1 },
// // // // //     teacherInfo: { flex: 1 },
// // // // //     teacherLabel: { fontSize: 11, marginBottom: 2 },
// // // // //     teacherName: { fontSize: 14, fontWeight: '500' },
// // // // //     fullContentSection: { marginTop: 16 },
// // // // //     contentLabel: { fontSize: 15, fontWeight: '600', marginBottom: 12 },
// // // // //     webView: { backgroundColor: 'transparent' },
// // // // //     webViewHidden: { opacity: 0 },
// // // // //     webViewLoader: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: 1 },
// // // // //     skeletonContainer: { paddingHorizontal: 16 },
// // // // //     skeletonCard: { padding: 16, borderRadius: 20, marginBottom: 12 },
// // // // //     skeletonHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
// // // // //     skeletonDate: { width: 100, height: 24, borderRadius: 12 },
// // // // //     skeletonBadge: { width: 60, height: 24, borderRadius: 12 },
// // // // //     skeletonLine: { height: 16, borderRadius: 8, marginBottom: 8 },
// // // // //     skeletonFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 },
// // // // //     skeletonAvatar: { width: 28, height: 28, borderRadius: 14 },
// // // // //     skeletonText: { width: 100, height: 14, borderRadius: 7 },
// // // // //     emptyContainer: { alignItems: 'center', paddingVertical: 60 },
// // // // //     emptyIconContainer: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
// // // // //     emptyTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
// // // // //     emptySubtitle: { fontSize: 14, textAlign: 'center', paddingHorizontal: 40, marginBottom: 24 },
// // // // //     emptyButton: { paddingHorizontal: 32, paddingVertical: 12, borderRadius: 25 },
// // // // //     emptyButtonText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
// // // // //     errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
// // // // //     errorIconContainer: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
// // // // //     errorText: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
// // // // //     errorSubtext: { fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
// // // // //     retryButton: { paddingHorizontal: 32, paddingVertical: 12, borderRadius: 25 },
// // // // //     retryButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
// // // // // });

// // // // // export default ChildDiaryScreen;
// // // // // src/screens/Parent/ChildDiaryScreen.js - COMPLETE OPTIMIZED VERSION
// // // // import React, { useState, useEffect, useCallback, useRef } from 'react';
// // // // import {
// // // //     View,
// // // //     Text,
// // // //     StyleSheet,
// // // //     TouchableOpacity,
// // // //     ActivityIndicator,
// // // //     RefreshControl,
// // // //     TextInput,
// // // //     Dimensions,
// // // //     Animated,
// // // //     Platform,
// // // //     LayoutAnimation,
// // // //     UIManager,
// // // //     ScrollView,
// // // //     Alert
// // // // } from 'react-native';
// // // // import { useSelector } from 'react-redux';
// // // // import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// // // // import { WebView } from 'react-native-webview';
// // // // import { selectThemeData } from '../../store/slices/themeSlice';
// // // // import { useGetChildDiaryQuery } from '../../store/attendanceApi';
// // // // import { format, subDays, isAfter, isBefore, startOfToday } from 'date-fns';
// // // // import RNHTMLtoPDF from 'react-native-html-to-pdf';
// // // // import Share from 'react-native-share';

// // // // // Enable LayoutAnimation for Android
// // // // if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
// // // //     UIManager.setLayoutAnimationEnabledExperimental(true);
// // // // }

// // // // const { width: SCREEN_WIDTH } = Dimensions.get('window');

// // // // // ==================== FINAL OPTIMIZED WEBVIEW V2 ====================
// // // // const OptimizedWebView = React.memo(({ content, theme, onHeightChange, isVisible, itemId }) => {
// // // //     const webViewRef = useRef(null);
// // // //     const [webViewHeight, setWebViewHeight] = useState(150);
// // // //     const [isLoading, setIsLoading] = useState(true);
// // // //     const animatedHeight = useRef(new Animated.Value(150)).current;
// // // //     const lastHeightRef = useRef(150);
    
// // // //     const getHTMLContent = useCallback(() => {
// // // //         return `
// // // //             <!DOCTYPE html>
// // // //             <html>
// // // //             <head>
// // // //                 <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
// // // //                 <style>
// // // //                     * { margin: 0; padding: 0; box-sizing: border-box; }
// // // //                     body {
// // // //                         font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
// // // //                         font-size: 15px;
// // // //                         line-height: 1.6;
// // // //                         padding: 16px;
// // // //                         margin: 0;
// // // //                         color: ${theme.isDarkMode ? '#e0e0e0' : '#2c3e50'};
// // // //                         background-color: ${theme.isDarkMode ? '#121212' : '#ffffff'};
// // // //                     }
// // // //                     p { margin-bottom: 12px; line-height: 1.6; }
// // // //                     img { 
// // // //                         max-width: 100%; 
// // // //                         height: auto; 
// // // //                         border-radius: 12px; 
// // // //                         margin: 12px 0; 
// // // //                         display: block;
// // // //                     }
// // // //                     h1 { font-size: 24px; font-weight: bold; margin: 16px 0 12px 0; }
// // // //                     h2 { font-size: 20px; font-weight: bold; margin: 14px 0 10px 0; }
// // // //                     h3 { font-size: 18px; font-weight: bold; margin: 12px 0 8px 0; }
// // // //                     ul, ol { margin: 8px 0 12px 20px; }
// // // //                     li { margin-bottom: 6px; line-height: 1.5; }
// // // //                     a { color: ${theme.primary}; text-decoration: none; }
// // // //                     blockquote {
// // // //                         margin: 12px 0;
// // // //                         padding: 8px 16px;
// // // //                         border-left: 4px solid ${theme.primary};
// // // //                         background-color: ${theme.isDarkMode ? '#1e1e1e' : '#f5f5f5'};
// // // //                         border-radius: 8px;
// // // //                     }
// // // //                     table {
// // // //                         width: 100%;
// // // //                         border-collapse: collapse;
// // // //                         margin: 12px 0;
// // // //                     }
// // // //                     th, td {
// // // //                         border: 1px solid ${theme.isDarkMode ? '#333' : '#ddd'};
// // // //                         padding: 8px;
// // // //                         text-align: left;
// // // //                     }
// // // //                     .content-wrapper {
// // // //                         width: 100%;
// // // //                         overflow-wrap: break-word;
// // // //                     }
// // // //                 </style>
// // // //                 <script>
// // // //                     let lastHeight = 0;
                    
// // // //                     function sendHeight() {
// // // //                         const height = document.body.scrollHeight;
// // // //                         if (height > 0 && Math.abs(height - lastHeight) > 10) {
// // // //                             lastHeight = height;
// // // //                             window.ReactNativeWebView.postMessage(JSON.stringify({ 
// // // //                                 type: 'height', 
// // // //                                 height: height + 20 
// // // //                             }));
// // // //                         }
// // // //                     }
                    
// // // //                     function waitForStableRender() {
// // // //                         sendHeight();
// // // //                         setTimeout(sendHeight, 300);
// // // //                         setTimeout(sendHeight, 800);
// // // //                     }
                    
// // // //                     function handleImages() {
// // // //                         const images = document.querySelectorAll('img');
// // // //                         if (images.length === 0) {
// // // //                             waitForStableRender();
// // // //                             return;
// // // //                         }
                        
// // // //                         let loadedCount = 0;
// // // //                         const totalImages = images.length;
                        
// // // //                         function onImageLoad() {
// // // //                             loadedCount++;
// // // //                             if (loadedCount === totalImages) {
// // // //                                 setTimeout(sendHeight, 200);
// // // //                                 setTimeout(sendHeight, 500);
// // // //                             }
// // // //                         }
                        
// // // //                         images.forEach(img => {
// // // //                             if (img.complete && img.naturalHeight > 0) {
// // // //                                 onImageLoad();
// // // //                             } else {
// // // //                                 img.addEventListener('load', onImageLoad);
// // // //                                 img.addEventListener('error', onImageLoad);
// // // //                             }
// // // //                         });
// // // //                     }
                    
// // // //                     if (document.readyState === 'loading') {
// // // //                         document.addEventListener('DOMContentLoaded', handleImages);
// // // //                     } else {
// // // //                         handleImages();
// // // //                     }
                    
// // // //                     window.addEventListener('load', () => {
// // // //                         setTimeout(sendHeight, 400);
// // // //                         setTimeout(sendHeight, 1000);
// // // //                     });
                    
// // // //                     if (typeof ResizeObserver !== 'undefined') {
// // // //                         const observer = new ResizeObserver(() => sendHeight());
// // // //                         observer.observe(document.body);
// // // //                     }
// // // //                 </script>
// // // //             </head>
// // // //             <body>
// // // //                 <div class="content-wrapper">
// // // //                     ${content || '<p style="text-align:center;color:#999">No content available</p>'}
// // // //                 </div>
// // // //             </body>
// // // //             </html>
// // // //         `;
// // // //     }, [content, theme, theme.isDarkMode, theme.primary]);
    
// // // //     // Smooth height animation
// // // //     useEffect(() => {
// // // //         Animated.timing(animatedHeight, {
// // // //             toValue: webViewHeight,
// // // //             duration: 250,
// // // //             useNativeDriver: false,
// // // //         }).start();
// // // //     }, [webViewHeight]);
    
// // // //     const handleMessage = useCallback((event) => {
// // // //         try {
// // // //             const data = JSON.parse(event.nativeEvent.data);
// // // //             if (data.type === 'height' && data.height) {
// // // //                 const newHeight = Math.max(data.height + 20, 150);
// // // //                 // Only update if height changed significantly
// // // //                 if (Math.abs(lastHeightRef.current - newHeight) > 15) {
// // // //                     lastHeightRef.current = newHeight;
// // // //                     setWebViewHeight(newHeight);
// // // //                     if (onHeightChange) {
// // // //                         onHeightChange(newHeight);
// // // //                     }
// // // //                 }
// // // //             }
// // // //         } catch (error) {}
// // // //     }, [onHeightChange]);
    
// // // //     const handleLoadEnd = useCallback(() => {
// // // //         setIsLoading(false);
// // // //     }, []);
    
// // // //     if (!isVisible) {
// // // //         return <View style={{ height: webViewHeight }} />;
// // // //     }
    
// // // //     return (
// // // //         <View style={{ minHeight: webViewHeight, overflow: 'hidden', borderRadius: 12 }}>
// // // //             {isLoading && (
// // // //                 <View style={styles.webViewLoader}>
// // // //                     <ActivityIndicator size="small" color={theme.primary} />
// // // //                 </View>
// // // //             )}
// // // //             <Animated.View style={{ height: animatedHeight }}>
// // // //                 <WebView
// // // //                     ref={webViewRef}
// // // //                     key={`webview-${itemId}`}
// // // //                     source={{ html: getHTMLContent() }}
// // // //                     style={[styles.webView]}
// // // //                     scrollEnabled={false}
// // // //                     onMessage={handleMessage}
// // // //                     onLoadEnd={handleLoadEnd}
// // // //                     originWhitelist={['*']}
// // // //                     javaScriptEnabled={true}
// // // //                     domStorageEnabled={true}
// // // //                     cacheEnabled={true}
// // // //                     cacheMode="LOAD_CACHE_ELSE_NETWORK"
// // // //                     androidLayerType="software"
// // // //                     showsVerticalScrollIndicator={false}
// // // //                     showsHorizontalScrollIndicator={false}
// // // //                     nestedScrollEnabled={true}
// // // //                 />
// // // //             </Animated.View>
// // // //         </View>
// // // //     );
// // // // });

// // // // // ==================== SKELETON LOADER ====================
// // // // const SkeletonLoader = ({ theme }) => (
// // // //     <View style={styles.skeletonContainer}>
// // // //         {[1, 2, 3].map((item) => (
// // // //             <View key={item} style={[styles.skeletonCard, { backgroundColor: theme.card }]}>
// // // //                 <View style={styles.skeletonHeader}>
// // // //                     <View style={[styles.skeletonDate, { backgroundColor: theme.border }]} />
// // // //                     <View style={[styles.skeletonBadge, { backgroundColor: theme.border }]} />
// // // //                 </View>
// // // //                 <View style={[styles.skeletonLine, { backgroundColor: theme.border }]} />
// // // //                 <View style={[styles.skeletonLine, { backgroundColor: theme.border, width: '80%' }]} />
// // // //                 <View style={styles.skeletonFooter}>
// // // //                     <View style={[styles.skeletonAvatar, { backgroundColor: theme.border }]} />
// // // //                     <View style={[styles.skeletonText, { backgroundColor: theme.border }]} />
// // // //                 </View>
// // // //             </View>
// // // //         ))}
// // // //     </View>
// // // // );

// // // // // ==================== ACCORDION DIARY CARD ====================
// // // // const AccordionDiaryCard = ({ item, theme, isExpanded, onToggle }) => {
// // // //     const scaleAnim = useRef(new Animated.Value(1)).current;
// // // //     const [webViewHeight, setWebViewHeight] = useState(150);
// // // //     const [showWebView, setShowWebView] = useState(false);
    
// // // //     const getPlainText = (html) => {
// // // //         if (!html) return 'No preview available';
// // // //         return html.replace(/<[^>]*>/g, '').substring(0, 120);
// // // //     };

// // // //     const plainTextPreview = getPlainText(item.content);
    
// // // //     const formatDate = (dateString) => {
// // // //         const date = new Date(dateString);
// // // //         return format(date, 'MMM d, yyyy');
// // // //     };

// // // //     const formatFullDate = (dateString) => {
// // // //         const date = new Date(dateString);
// // // //         return format(date, 'EEEE, MMMM d, yyyy');
// // // //     };

// // // //     const handlePressIn = () => {
// // // //         Animated.spring(scaleAnim, {
// // // //             toValue: 0.98,
// // // //             useNativeDriver: true,
// // // //             speed: 50,
// // // //         }).start();
// // // //     };

// // // //     const handlePressOut = () => {
// // // //         Animated.spring(scaleAnim, {
// // // //             toValue: 1,
// // // //             useNativeDriver: true,
// // // //             speed: 50,
// // // //         }).start();
// // // //     };

// // // //     const handlePress = () => {
// // // //         // LayoutAnimation only for card toggle, not for WebView height
// // // //         LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
// // // //         onToggle();
// // // //     };
    
// // // //     const handleWebViewHeightChange = useCallback((height) => {
// // // //         setWebViewHeight(height);
// // // //     }, []);

// // // //     // Clean WebView mounting strategy
// // // //     useEffect(() => {
// // // //         if (isExpanded) {
// // // //             // Small delay to ensure LayoutAnimation completes
// // // //             const timer = setTimeout(() => {
// // // //                 setShowWebView(true);
// // // //             }, 150);
// // // //             return () => clearTimeout(timer);
// // // //         } else {
// // // //             setShowWebView(false);
// // // //         }
// // // //     }, [isExpanded]);

// // // //     return (
// // // //         <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
// // // //             <TouchableOpacity
// // // //                 activeOpacity={0.9}
// // // //                 onPressIn={handlePressIn}
// // // //                 onPressOut={handlePressOut}
// // // //                 onPress={handlePress}
// // // //                 style={[styles.entryCard, { backgroundColor: theme.card }, isExpanded && styles.expandedCard]}
// // // //             >
// // // //                 <View style={styles.cardHeader}>
// // // //                     <View style={styles.dateSection}>
// // // //                         <View style={[styles.dateBadge, { backgroundColor: theme.primary + '15' }]}>
// // // //                             <Icon name="calendar-today" size={14} color={theme.primary} />
// // // //                             <Text style={[styles.dateText, { color: theme.text }]}>{formatDate(item.date)}</Text>
// // // //                         </View>
// // // //                         <Text style={[styles.dayText, { color: theme.textSecondary }]}>{item.day}</Text>
// // // //                     </View>
// // // //                     <View style={styles.headerRight}>
// // // //                         <View style={[styles.subjectBadge, { backgroundColor: theme.primary + '15' }]}>
// // // //                             <Icon name="book-open-variant" size={12} color={theme.primary} />
// // // //                             <Text style={[styles.subjectText, { color: theme.primary }]}>{item.subject}</Text>
// // // //                         </View>
// // // //                         <Icon name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color={theme.textSecondary} />
// // // //                     </View>
// // // //                 </View>

// // // //                 {!isExpanded && (
// // // //                     <Text style={[styles.previewText, { color: theme.text }]} numberOfLines={2}>
// // // //                         {plainTextPreview}
// // // //                     </Text>
// // // //                 )}

// // // //                 {isExpanded && (
// // // //                     <View style={styles.expandedContent}>
// // // //                         <View style={[styles.divider, { backgroundColor: theme.border }]} />
                        
// // // //                         <View style={styles.expandedDateSection}>
// // // //                             <Icon name="calendar-clock" size={16} color={theme.primary} />
// // // //                             <Text style={[styles.expandedDateText, { color: theme.textSecondary }]}>{formatFullDate(item.date)}</Text>
// // // //                         </View>

// // // //                         <View style={styles.teacherSection}>
// // // //                             <View style={[styles.teacherAvatar, { backgroundColor: theme.primary + '15' }]}>
// // // //                                 <Icon name="account" size={14} color={theme.primary} />
// // // //                             </View>
// // // //                             <View style={styles.teacherInfo}>
// // // //                                 <Text style={[styles.teacherLabel, { color: theme.textSecondary }]}>Teacher</Text>
// // // //                                 <Text style={[styles.teacherName, { color: theme.text }]}>{item.teacher}</Text>
// // // //                             </View>
// // // //                         </View>

// // // //                         <View style={[styles.statusBadge, { backgroundColor: item.isPublished ? theme.success + '15' : theme.warning + '15' }]}>
// // // //                             <View style={[styles.statusDot, { backgroundColor: item.isPublished ? theme.success : theme.warning }]} />
// // // //                             <Text style={[styles.statusText, { color: item.isPublished ? theme.success : theme.warning }]}>
// // // //                                 {item.isPublished ? 'Published' : 'Draft'}
// // // //                             </Text>
// // // //                         </View>

// // // //                         <View style={styles.fullContentSection}>
// // // //                             <Text style={[styles.contentLabel, { color: theme.text }]}>📝 Content</Text>
// // // //                             {showWebView && (
// // // //                                 <OptimizedWebView
// // // //                                     key={`web-${item.id}`}
// // // //                                     content={item.content}
// // // //                                     theme={theme}
// // // //                                     onHeightChange={handleWebViewHeightChange}
// // // //                                     isVisible={true}
// // // //                                     itemId={item.id}
// // // //                                 />
// // // //                             )}
// // // //                         </View>
// // // //                     </View>
// // // //                 )}

// // // //                 {!isExpanded && (
// // // //                     <View style={styles.cardFooter}>
// // // //                         <View style={styles.teacherSection}>
// // // //                             <View style={[styles.teacherAvatar, { backgroundColor: theme.primary + '15' }]}>
// // // //                                 <Icon name="account" size={14} color={theme.primary} />
// // // //                             </View>
// // // //                             <Text style={[styles.teacherText, { color: theme.textSecondary }]}>{item.teacher}</Text>
// // // //                         </View>
// // // //                         <View style={[styles.statusBadge, { backgroundColor: item.isPublished ? theme.success + '15' : theme.warning + '15' }]}>
// // // //                             <View style={[styles.statusDot, { backgroundColor: item.isPublished ? theme.success : theme.warning }]} />
// // // //                             <Text style={[styles.statusText, { color: item.isPublished ? theme.success : theme.warning }]}>
// // // //                                 {item.isPublished ? 'Published' : 'Draft'}
// // // //                             </Text>
// // // //                         </View>
// // // //                     </View>
// // // //                 )}
// // // //             </TouchableOpacity>
// // // //         </Animated.View>
// // // //     );
// // // // };

// // // // // ==================== FILTER CHIP ====================
// // // // const FilterChip = ({ label, isActive, onPress, icon, theme }) => (
// // // //     <TouchableOpacity
// // // //         style={[styles.filterChip, { backgroundColor: isActive ? theme.primary : theme.card }, isActive && styles.filterChipActive]}
// // // //         onPress={onPress}
// // // //         activeOpacity={0.7}
// // // //     >
// // // //         {icon && <Icon name={icon} size={16} color={isActive ? '#FFF' : theme.textSecondary} />}
// // // //         <Text style={[styles.filterChipText, { color: isActive ? '#FFF' : theme.text }]}>{label}</Text>
// // // //     </TouchableOpacity>
// // // // );

// // // // // ==================== DAY NAVIGATOR ====================
// // // // const DayNavigator = ({ currentDate, onDateChange, theme }) => {
// // // //     const today = startOfToday();
// // // //     const sevenDaysAgo = subDays(today, 7);
    
// // // //     const canGoPrevious = isAfter(new Date(currentDate), sevenDaysAgo);
// // // //     const canGoNext = isBefore(new Date(currentDate), today);
    
// // // //     const handlePrevious = () => {
// // // //         if (canGoPrevious) {
// // // //             const newDate = subDays(new Date(currentDate), 1);
// // // //             onDateChange(format(newDate, 'yyyy-MM-dd'));
// // // //         }
// // // //     };
    
// // // //     const handleNext = () => {
// // // //         if (canGoNext) {
// // // //             const newDate = subDays(new Date(currentDate), -1);
// // // //             onDateChange(format(newDate, 'yyyy-MM-dd'));
// // // //         }
// // // //     };
    
// // // //     const handleToday = () => {
// // // //         onDateChange(format(today, 'yyyy-MM-dd'));
// // // //     };
    
// // // //     const formatDisplayDate = (dateString) => {
// // // //         const date = new Date(dateString);
// // // //         const today_date = startOfToday();
// // // //         const yesterday = subDays(today_date, 1);
        
// // // //         if (format(date, 'yyyy-MM-dd') === format(today_date, 'yyyy-MM-dd')) {
// // // //             return 'Today';
// // // //         } else if (format(date, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd')) {
// // // //             return 'Yesterday';
// // // //         } else {
// // // //             return format(date, 'EEEE, MMM d');
// // // //         }
// // // //     };
    
// // // //     return (
// // // //         <View style={[styles.dayNavigator, { backgroundColor: theme.card }]}>
// // // //             <TouchableOpacity onPress={handlePrevious} style={[styles.navButton, !canGoPrevious && styles.navButtonDisabled]} disabled={!canGoPrevious}>
// // // //                 <Icon name="chevron-left" size={24} color={canGoPrevious ? theme.primary : theme.textSecondary} />
// // // //             </TouchableOpacity>
            
// // // //             <TouchableOpacity onPress={handleToday} style={styles.dateDisplay}>
// // // //                 <Text style={[styles.dateDisplayText, { color: theme.text }]}>{formatDisplayDate(currentDate)}</Text>
// // // //                 <Text style={[styles.dateDisplaySub, { color: theme.textSecondary }]}>{format(new Date(currentDate), 'MMMM d, yyyy')}</Text>
// // // //             </TouchableOpacity>
            
// // // //             <TouchableOpacity onPress={handleNext} style={[styles.navButton, !canGoNext && styles.navButtonDisabled]} disabled={!canGoNext}>
// // // //                 <Icon name="chevron-right" size={24} color={canGoNext ? theme.primary : theme.textSecondary} />
// // // //             </TouchableOpacity>
// // // //         </View>
// // // //     );
// // // // };

// // // // // ==================== MAIN SCREEN ====================
// // // // const ChildDiaryScreen = ({ route, navigation }) => {
// // // //     const theme = useSelector(selectThemeData);
// // // //     const { childId, childName } = route.params;

// // // //     const [refreshing, setRefreshing] = useState(false);
// // // //     const [diaryEntries, setDiaryEntries] = useState([]);
// // // //     const [filteredEntries, setFilteredEntries] = useState([]);
// // // //     const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
// // // //     const [selectedSubject, setSelectedSubject] = useState('All');
// // // //     const [searchQuery, setSearchQuery] = useState('');
// // // //     const [subjects, setSubjects] = useState([]);
// // // //     const [isSearchFocused, setIsSearchFocused] = useState(false);
// // // //     const [expandedId, setExpandedId] = useState(null);
// // // //     const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

// // // //     const fadeAnim = useRef(new Animated.Value(0)).current;

// // // //     const {
// // // //         data: diaryResponse,
// // // //         isLoading,
// // // //         isFetching,
// // // //         error,
// // // //         refetch,
// // // //     } = useGetChildDiaryQuery({
// // // //         childId,
// // // //         filters: {
// // // //             date: selectedDate,
// // // //             subjectId: selectedSubject !== 'All' ? selectedSubject : null,
// // // //         },
// // // //     });

// // // //     useEffect(() => {
// // // //         if (diaryResponse?.success === true && diaryResponse?.data?.entries) {
// // // //             processDiaryData(diaryResponse.data.entries);
// // // //             Animated.timing(fadeAnim, {
// // // //                 toValue: 1,
// // // //                 duration: 500,
// // // //                 useNativeDriver: true,
// // // //             }).start();
// // // //         }
// // // //     }, [diaryResponse]);

// // // //     useEffect(() => {
// // // //         filterEntries();
// // // //     }, [searchQuery, selectedSubject, diaryEntries]);

// // // //     const processDiaryData = (entries) => {
// // // //         const transformedEntries = entries.map(entry => {
// // // //             const dateObj = entry.date ? new Date(entry.date) : new Date();
// // // //             const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
// // // //             const dayName = !isNaN(dateObj.getTime()) ? dayNames[dateObj.getDay()] : '';

// // // //             return {
// // // //                 id: entry.id,
// // // //                 date: entry.date || '',
// // // //                 day: dayName,
// // // //                 subject: entry.subject || 'General',
// // // //                 subjectId: entry.subjectId,
// // // //                 content: entry.content || '',
// // // //                 teacher: entry.teacher || 'Teacher',
// // // //                 isPublished: entry.isPublished || false,
// // // //                 createdAt: entry.createdAt,
// // // //             };
// // // //         });

// // // //         const sortedEntries = transformedEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
        
// // // //         const uniqueSubjects = [...new Map(sortedEntries.map(entry => [
// // // //             entry.subjectId, { id: entry.subjectId, name: entry.subject }
// // // //         ])).values()];
// // // //         setSubjects(uniqueSubjects);
        
// // // //         setDiaryEntries(sortedEntries);
// // // //         setFilteredEntries(sortedEntries);
// // // //     };

// // // //     const filterEntries = () => {
// // // //         let filtered = [...diaryEntries];
// // // //         if (searchQuery.trim()) {
// // // //             const query = searchQuery.toLowerCase();
// // // //             filtered = filtered.filter(entry =>
// // // //                 entry.subject.toLowerCase().includes(query) ||
// // // //                 entry.teacher.toLowerCase().includes(query) ||
// // // //                 (entry.content && entry.content.toLowerCase().includes(query))
// // // //             );
// // // //         }
// // // //         if (selectedSubject !== 'All') {
// // // //             filtered = filtered.filter(entry => entry.subjectId === selectedSubject);
// // // //         }
// // // //         setFilteredEntries(filtered);
        
// // // //         if (expandedId) {
// // // //             setExpandedId(null);
// // // //         }
// // // //     };

// // // //     const onRefresh = async () => {
// // // //         setRefreshing(true);
// // // //         await refetch();
// // // //         setRefreshing(false);
// // // //     };

// // // //     const handleDateChange = (date) => {
// // // //         LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
// // // //         setSelectedDate(date);
// // // //         setExpandedId(null);
// // // //     };

// // // //     const handleResetFilters = () => {
// // // //         LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
// // // //         setSelectedSubject('All');
// // // //         setSearchQuery('');
// // // //         setExpandedId(null);
// // // //     };

// // // //     const handleToggleExpand = (id) => {
// // // //         setExpandedId(expandedId === id ? null : id);
// // // //     };

// // // //     const generatePDFHTML = () => {
// // // //         const entriesHTML = filteredEntries.map(entry => `
// // // //             <div style="margin-bottom: 30px; page-break-inside: avoid; border-bottom: 1px solid #e0e0e0; padding-bottom: 20px;">
// // // //                 <h2 style="color: #2c3e50; margin-bottom: 10px; font-size: 20px;">${entry.subject}</h2>
// // // //                 <div style="color: #7f8c8d; margin-bottom: 15px; font-size: 13px;">
// // // //                     <div><strong>📅 Date:</strong> ${format(new Date(entry.date), 'EEEE, MMMM d, yyyy')}</div>
// // // //                     <div><strong>👨‍🏫 Teacher:</strong> ${entry.teacher}</div>
// // // //                     <div><strong>📌 Status:</strong> ${entry.isPublished ? 'Published' : 'Draft'}</div>
// // // //                 </div>
// // // //                 <div style="margin-top: 15px; line-height: 1.6; font-size: 14px;">
// // // //                     ${entry.content || '<p style="color: #999;">No content available</p>'}
// // // //                 </div>
// // // //             </div>
// // // //         `).join('');

// // // //         return `
// // // //             <!DOCTYPE html>
// // // //             <html>
// // // //             <head>
// // // //                 <meta charset="UTF-8">
// // // //                 <meta name="viewport" content="width=device-width, initial-scale=1.0">
// // // //                 <title>${childName}'s Diary - ${format(new Date(selectedDate), 'MMMM d, yyyy')}</title>
// // // //                 <style>
// // // //                     * { margin: 0; padding: 0; box-sizing: border-box; }
// // // //                     body {
// // // //                         font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
// // // //                         padding: 40px;
// // // //                         color: #333;
// // // //                         line-height: 1.6;
// // // //                         background-color: white;
// // // //                     }
// // // //                     .header {
// // // //                         text-align: center;
// // // //                         margin-bottom: 40px;
// // // //                         padding-bottom: 20px;
// // // //                         border-bottom: 3px solid #3498db;
// // // //                     }
// // // //                     .header h1 {
// // // //                         color: #2c3e50;
// // // //                         margin-bottom: 10px;
// // // //                         font-size: 28px;
// // // //                     }
// // // //                     .header p {
// // // //                         color: #7f8c8d;
// // // //                         font-size: 14px;
// // // //                     }
// // // //                     .date-range {
// // // //                         text-align: center;
// // // //                         background-color: #f8f9fa;
// // // //                         padding: 12px;
// // // //                         border-radius: 8px;
// // // //                         margin-bottom: 30px;
// // // //                         font-size: 14px;
// // // //                         border: 1px solid #e0e0e0;
// // // //                     }
// // // //                     img {
// // // //                         max-width: 100%;
// // // //                         height: auto;
// // // //                         border-radius: 8px;
// // // //                         margin: 10px 0;
// // // //                     }
// // // //                     .footer {
// // // //                         margin-top: 50px;
// // // //                         text-align: center;
// // // //                         color: #95a5a6;
// // // //                         font-size: 11px;
// // // //                         border-top: 1px solid #e0e0e0;
// // // //                         padding-top: 20px;
// // // //                     }
// // // //                     @media print {
// // // //                         body { padding: 20px; }
// // // //                     }
// // // //                 </style>
// // // //             </head>
// // // //             <body>
// // // //                 <div class="header">
// // // //                     <h1>${childName}'s Learning Diary</h1>
// // // //                     <p>School Activities & Progress Report</p>
// // // //                 </div>
// // // //                 <div class="date-range">
// // // //                     <strong>📅 Date:</strong> ${format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}
// // // //                 </div>
// // // //                 ${entriesHTML}
// // // //                 <div class="footer">
// // // //                     Generated on ${format(new Date(), 'MMMM d, yyyy h:mm a')}
// // // //                 </div>
// // // //             </body>
// // // //             </html>
// // // //         `;
// // // //     };

// // // //     const shareDiaryAsPDF = async () => {
// // // //         if (filteredEntries.length === 0) {
// // // //             Alert.alert('No Entries', 'There are no diary entries to share for this day.');
// // // //             return;
// // // //         }

// // // //         setIsGeneratingPDF(true);
        
// // // //         try {
// // // //             const htmlContent = generatePDFHTML();
// // // //             const fileName = `${childName.replace(/\s/g, '_')}_Diary_${format(new Date(selectedDate), 'yyyy-MM-dd')}`;
            
// // // //             const options = {
// // // //                 html: htmlContent,
// // // //                 fileName: fileName,
// // // //                 directory: 'Documents',
// // // //             };
            
// // // //             const pdfFile = await RNHTMLtoPDF.convert(options);
            
// // // //             if (pdfFile && pdfFile.filePath) {
// // // //                 await Share.open({
// // // //                     url: `file://${pdfFile.filePath}`,
// // // //                     type: 'application/pdf',
// // // //                     title: `Share ${childName}'s Diary`,
// // // //                 });
// // // //             } else {
// // // //                 Alert.alert('Error', 'Failed to generate PDF');
// // // //             }
// // // //         } catch (error) {
// // // //             console.error('PDF Error:', error);
// // // //             Alert.alert('Error', 'Failed to generate or share PDF. Please try again.');
// // // //         } finally {
// // // //             setIsGeneratingPDF(false);
// // // //         }
// // // //     };

// // // //     const renderSearchBar = () => (
// // // //         <View style={[styles.searchWrapper, isSearchFocused && styles.searchWrapperFocused, { borderColor: theme.border, backgroundColor: theme.card }]}>
// // // //             <Icon name="magnify" size={20} color={theme.textSecondary} />
// // // //             <TextInput
// // // //                 style={[styles.searchInput, { color: theme.text }]}
// // // //                 placeholder="Search by subject or teacher..."
// // // //                 placeholderTextColor={theme.textSecondary}
// // // //                 value={searchQuery}
// // // //                 onChangeText={setSearchQuery}
// // // //                 onFocus={() => setIsSearchFocused(true)}
// // // //                 onBlur={() => setIsSearchFocused(false)}
// // // //             />
// // // //             {searchQuery !== '' && (
// // // //                 <TouchableOpacity onPress={() => setSearchQuery('')}>
// // // //                     <Icon name="close-circle" size={20} color={theme.textSecondary} />
// // // //                 </TouchableOpacity>
// // // //             )}
// // // //         </View>
// // // //     );

// // // //     const renderFilters = () => (
// // // //         <View style={styles.filtersSection}>
// // // //             <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
// // // //                 <FilterChip label="All Subjects" isActive={selectedSubject === 'All'} onPress={() => setSelectedSubject('All')} theme={theme} />
// // // //                 {subjects.map(subject => (
// // // //                     <FilterChip key={subject.id} label={subject.name} isActive={selectedSubject === subject.id} onPress={() => setSelectedSubject(subject.id)} theme={theme} />
// // // //                 ))}
// // // //             </ScrollView>
// // // //         </View>
// // // //     );

// // // //     const renderHeader = () => (
// // // //         <View style={[styles.headerContainer, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
// // // //             <View style={styles.headerTop}>
// // // //                 <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
// // // //                     <Icon name="arrow-left" size={24} color={theme.text} />
// // // //                 </TouchableOpacity>
// // // //                 <Text style={[styles.headerTitle, { color: theme.text }]}>{childName}'s Diary</Text>
// // // //                 <TouchableOpacity onPress={shareDiaryAsPDF} style={styles.shareButton} disabled={isGeneratingPDF}>
// // // //                     {isGeneratingPDF ? (
// // // //                         <ActivityIndicator size="small" color={theme.primary} />
// // // //                     ) : (
// // // //                         <Icon name="file-pdf-box" size={24} color="#e74c3c" />
// // // //                     )}
// // // //                 </TouchableOpacity>
// // // //             </View>
// // // //         </View>
// // // //     );

// // // //     const renderContent = () => {
// // // //         if (filteredEntries.length === 0) {
// // // //             return renderEmptyState();
// // // //         }
        
// // // //         return (
// // // //             <>
// // // //                 {filteredEntries.map((item) => (
// // // //                     <AccordionDiaryCard
// // // //                         key={item.id}
// // // //                         item={item}
// // // //                         theme={theme}
// // // //                         isExpanded={expandedId === item.id}
// // // //                         onToggle={() => handleToggleExpand(item.id)}
// // // //                     />
// // // //                 ))}
// // // //             </>
// // // //         );
// // // //     };

// // // //     const renderEmptyState = () => (
// // // //         <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
// // // //             <View style={[styles.emptyIconContainer, { backgroundColor: theme.primary + '10' }]}>
// // // //                 <Icon name="notebook-edit-outline" size={64} color={theme.primary} />
// // // //             </View>
// // // //             <Text style={[styles.emptyTitle, { color: theme.text }]}>
// // // //                 {searchQuery || selectedSubject !== 'All' ? 'No matching entries' : 'No diary entries for this day'}
// // // //             </Text>
// // // //             <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
// // // //                 {searchQuery || selectedSubject !== 'All'
// // // //                     ? 'Try adjusting your filters to see more results'
// // // //                     : `No diary entries found for ${format(new Date(selectedDate), 'MMMM d, yyyy')}`}
// // // //             </Text>
// // // //             {(searchQuery || selectedSubject !== 'All') && (
// // // //                 <TouchableOpacity style={[styles.emptyButton, { backgroundColor: theme.primary }]} onPress={handleResetFilters}>
// // // //                     <Text style={styles.emptyButtonText}>Clear Filters</Text>
// // // //                 </TouchableOpacity>
// // // //             )}
// // // //         </Animated.View>
// // // //     );

// // // //     if (error) {
// // // //         return (
// // // //             <View style={[styles.container, { backgroundColor: theme.background }]}>
// // // //                 {renderHeader()}
// // // //                 <View style={styles.errorContainer}>
// // // //                     <View style={[styles.errorIconContainer, { backgroundColor: theme.error + '10' }]}>
// // // //                         <Icon name="wifi-off" size={60} color={theme.error} />
// // // //                     </View>
// // // //                     <Text style={[styles.errorText, { color: theme.text }]}>Connection Error</Text>
// // // //                     <Text style={[styles.errorSubtext, { color: theme.textSecondary }]}>
// // // //                         Unable to connect to the server. Please check your internet connection.
// // // //                     </Text>
// // // //                     <TouchableOpacity style={[styles.retryButton, { backgroundColor: theme.primary }]} onPress={() => refetch()}>
// // // //                         <Text style={styles.retryButtonText}>Try Again</Text>
// // // //                     </TouchableOpacity>
// // // //                 </View>
// // // //             </View>
// // // //         );
// // // //     }

// // // //     return (
// // // //         <View style={[styles.container, { backgroundColor: theme.background }]}>
// // // //             {renderHeader()}
            
// // // //             <ScrollView 
// // // //                 style={styles.contentContainer}
// // // //                 refreshControl={
// // // //                     <RefreshControl 
// // // //                         refreshing={refreshing} 
// // // //                         onRefresh={onRefresh} 
// // // //                         colors={[theme.primary]} 
// // // //                         tintColor={theme.primary} 
// // // //                     />
// // // //                 }
// // // //                 showsVerticalScrollIndicator={false}
// // // //             >
// // // //                 {renderSearchBar()}
// // // //                 {renderFilters()}
                
// // // //                 <DayNavigator currentDate={selectedDate} onDateChange={handleDateChange} theme={theme} />

// // // //                 {(isLoading || isFetching) && !refreshing ? (
// // // //                     <SkeletonLoader theme={theme} />
// // // //                 ) : (
// // // //                     <View style={styles.listContent}>
// // // //                         {renderContent()}
// // // //                     </View>
// // // //                 )}
// // // //             </ScrollView>
// // // //         </View>
// // // //     );
// // // // };

// // // // // ==================== STYLES ====================
// // // // const styles = StyleSheet.create({
// // // //     container: { flex: 1 },
// // // //     headerContainer: {
// // // //         paddingTop: Platform.OS === 'ios' ? 50 : 40,
// // // //         paddingBottom: 16,
// // // //         borderBottomWidth: 1,
// // // //         elevation: 2,
// // // //         shadowColor: '#000',
// // // //         shadowOffset: { width: 0, height: 2 },
// // // //         shadowOpacity: 0.05,
// // // //         shadowRadius: 4,
// // // //     },
// // // //     headerTop: {
// // // //         flexDirection: 'row',
// // // //         alignItems: 'center',
// // // //         justifyContent: 'space-between',
// // // //         paddingHorizontal: 16,
// // // //     },
// // // //     backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
// // // //     headerTitle: { fontSize: 18, fontWeight: '600', flex: 1, textAlign: 'center' },
// // // //     shareButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
// // // //     contentContainer: { flex: 1 },
// // // //     searchWrapper: {
// // // //         flexDirection: 'row',
// // // //         alignItems: 'center',
// // // //         marginHorizontal: 16,
// // // //         marginBottom: 12,
// // // //         paddingHorizontal: 16,
// // // //         paddingVertical: 12,
// // // //         borderRadius: 16,
// // // //         borderWidth: 1,
// // // //     },
// // // //     searchWrapperFocused: { borderWidth: 2 },
// // // //     searchInput: { flex: 1, fontSize: 16, marginLeft: 12, paddingVertical: 0 },
// // // //     filtersSection: { marginBottom: 12 },
// // // //     filtersScroll: { paddingHorizontal: 16 },
// // // //     filterChip: {
// // // //         flexDirection: 'row',
// // // //         alignItems: 'center',
// // // //         paddingHorizontal: 16,
// // // //         paddingVertical: 8,
// // // //         borderRadius: 24,
// // // //         marginRight: 8,
// // // //         gap: 6,
// // // //         shadowColor: '#000',
// // // //         shadowOffset: { width: 0, height: 2 },
// // // //         shadowOpacity: 0.05,
// // // //         shadowRadius: 4,
// // // //         elevation: 2,
// // // //     },
// // // //     filterChipActive: { shadowOpacity: 0.2, shadowRadius: 6 },
// // // //     filterChipText: { fontSize: 14, fontWeight: '500' },
// // // //     dayNavigator: {
// // // //         flexDirection: 'row',
// // // //         justifyContent: 'space-between',
// // // //         alignItems: 'center',
// // // //         marginHorizontal: 16,
// // // //         marginBottom: 16,
// // // //         paddingHorizontal: 16,
// // // //         paddingVertical: 14,
// // // //         borderRadius: 16,
// // // //         shadowColor: '#000',
// // // //         shadowOffset: { width: 0, height: 2 },
// // // //         shadowOpacity: 0.05,
// // // //         shadowRadius: 4,
// // // //         elevation: 2,
// // // //     },
// // // //     navButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20 },
// // // //     navButtonDisabled: { opacity: 0.5 },
// // // //     dateDisplay: { alignItems: 'center', flex: 1 },
// // // //     dateDisplayText: { fontSize: 16, fontWeight: '600' },
// // // //     dateDisplaySub: { fontSize: 12, marginTop: 2 },
// // // //     listContent: { paddingHorizontal: 16, paddingBottom: 20 },
// // // //     entryCard: { 
// // // //         padding: 16, 
// // // //         borderRadius: 20, 
// // // //         marginBottom: 12, 
// // // //         shadowColor: '#000', 
// // // //         shadowOffset: { width: 0, height: 4 }, 
// // // //         shadowOpacity: 0.08, 
// // // //         shadowRadius: 8, 
// // // //         elevation: 4 
// // // //     },
// // // //     expandedCard: { shadowOpacity: 0.12, shadowRadius: 12 },
// // // //     cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
// // // //     headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
// // // //     dateSection: { flexDirection: 'row', alignItems: 'center', gap: 8 },
// // // //     dateBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 4 },
// // // //     dateText: { fontSize: 12, fontWeight: '500' },
// // // //     dayText: { fontSize: 12 },
// // // //     subjectBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 4 },
// // // //     subjectText: { fontSize: 11, fontWeight: '600' },
// // // //     previewText: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
// // // //     cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
// // // //     teacherSection: { flexDirection: 'row', alignItems: 'center', gap: 8 },
// // // //     teacherAvatar: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
// // // //     teacherText: { fontSize: 12 },
// // // //     statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 6 },
// // // //     statusDot: { width: 6, height: 6, borderRadius: 3 },
// // // //     statusText: { fontSize: 11, fontWeight: '600' },
// // // //     expandedContent: { marginTop: 12 },
// // // //     divider: { height: 1, marginBottom: 16 },
// // // //     expandedDateSection: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
// // // //     expandedDateText: { fontSize: 13, flex: 1 },
// // // //     teacherInfo: { flex: 1 },
// // // //     teacherLabel: { fontSize: 11, marginBottom: 2 },
// // // //     teacherName: { fontSize: 14, fontWeight: '500' },
// // // //     fullContentSection: { marginTop: 16 },
// // // //     contentLabel: { fontSize: 15, fontWeight: '600', marginBottom: 12 },
// // // //     webView: { backgroundColor: 'transparent' },
// // // //     webViewLoader: { 
// // // //         position: 'absolute', 
// // // //         top: 0, 
// // // //         left: 0, 
// // // //         right: 0, 
// // // //         bottom: 0, 
// // // //         justifyContent: 'center', 
// // // //         alignItems: 'center', 
// // // //         zIndex: 1 
// // // //     },
// // // //     skeletonContainer: { paddingHorizontal: 16 },
// // // //     skeletonCard: { padding: 16, borderRadius: 20, marginBottom: 12 },
// // // //     skeletonHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
// // // //     skeletonDate: { width: 100, height: 24, borderRadius: 12 },
// // // //     skeletonBadge: { width: 60, height: 24, borderRadius: 12 },
// // // //     skeletonLine: { height: 16, borderRadius: 8, marginBottom: 8 },
// // // //     skeletonFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 },
// // // //     skeletonAvatar: { width: 28, height: 28, borderRadius: 14 },
// // // //     skeletonText: { width: 100, height: 14, borderRadius: 7 },
// // // //     emptyContainer: { alignItems: 'center', paddingVertical: 60 },
// // // //     emptyIconContainer: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
// // // //     emptyTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
// // // //     emptySubtitle: { fontSize: 14, textAlign: 'center', paddingHorizontal: 40, marginBottom: 24 },
// // // //     emptyButton: { paddingHorizontal: 32, paddingVertical: 12, borderRadius: 25 },
// // // //     emptyButtonText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
// // // //     errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
// // // //     errorIconContainer: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
// // // //     errorText: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
// // // //     errorSubtext: { fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
// // // //     retryButton: { paddingHorizontal: 32, paddingVertical: 12, borderRadius: 25 },
// // // //     retryButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
// // // // });

// // // // export default ChildDiaryScreen;


// // // // src/screens/Parent/ChildDiaryScreen.js - PRODUCTION READY WITH AUTOHEIGHT WEBVIEW
// // // import React, { useState, useEffect, useCallback, useRef } from 'react';
// // // import {
// // //     View,
// // //     Text,
// // //     StyleSheet,
// // //     TouchableOpacity,
// // //     ActivityIndicator,
// // //     RefreshControl,
// // //     TextInput,
// // //     Dimensions,
// // //     Animated,
// // //     Platform,
// // //     LayoutAnimation,
// // //     UIManager,
// // //     ScrollView,
// // //     Alert
// // // } from 'react-native';
// // // import { useSelector } from 'react-redux';
// // // import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// // // import AutoHeightWebView from 'react-native-autoheight-webview';
// // // import { selectThemeData } from '../../store/slices/themeSlice';
// // // import { useGetChildDiaryQuery } from '../../store/attendanceApi';
// // // import { format, subDays, isAfter, isBefore, startOfToday } from 'date-fns';
// // // import RNHTMLtoPDF from 'react-native-html-to-pdf';
// // // import Share from 'react-native-share';

// // // // Enable LayoutAnimation for Android
// // // if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
// // //     UIManager.setLayoutAnimationEnabledExperimental(true);
// // // }

// // // const { width: SCREEN_WIDTH } = Dimensions.get('window');

// // // // ==================== STABLE AUTOHEIGHT WEBVIEW ====================
// // // const StableWebView = React.memo(({ content, theme, isVisible }) => {
// // //     const getHTMLContent = useCallback(() => {
// // //         return `
// // //             <!DOCTYPE html>
// // //             <html>
// // //             <head>
// // //                 <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
// // //                 <style>
// // //                     * { margin: 0; padding: 0; box-sizing: border-box; }
// // //                     body {
// // //                         font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
// // //                         font-size: 15px;
// // //                         line-height: 1.6;
// // //                         padding: 16px;
// // //                         margin: 0;
// // //                         color: ${theme.isDarkMode ? '#e0e0e0' : '#2c3e50'};
// // //                         background-color: ${theme.isDarkMode ? '#121212' : '#ffffff'};
// // //                     }
// // //                     p { margin-bottom: 12px; line-height: 1.6; }
// // //                     img { 
// // //                         max-width: 100%; 
// // //                         height: auto; 
// // //                         border-radius: 12px; 
// // //                         margin: 12px 0; 
// // //                         display: block;
// // //                     }
// // //                     h1 { font-size: 24px; font-weight: bold; margin: 16px 0 12px 0; }
// // //                     h2 { font-size: 20px; font-weight: bold; margin: 14px 0 10px 0; }
// // //                     h3 { font-size: 18px; font-weight: bold; margin: 12px 0 8px 0; }
// // //                     ul, ol { margin: 8px 0 12px 20px; }
// // //                     li { margin-bottom: 6px; line-height: 1.5; }
// // //                     a { color: ${theme.primary}; text-decoration: none; }
// // //                     blockquote {
// // //                         margin: 12px 0;
// // //                         padding: 8px 16px;
// // //                         border-left: 4px solid ${theme.primary};
// // //                         background-color: ${theme.isDarkMode ? '#1e1e1e' : '#f5f5f5'};
// // //                         border-radius: 8px;
// // //                     }
// // //                     table {
// // //                         width: 100%;
// // //                         border-collapse: collapse;
// // //                         margin: 12px 0;
// // //                     }
// // //                     th, td {
// // //                         border: 1px solid ${theme.isDarkMode ? '#333' : '#ddd'};
// // //                         padding: 8px;
// // //                         text-align: left;
// // //                     }
// // //                     .content-wrapper {
// // //                         width: 100%;
// // //                         overflow-wrap: break-word;
// // //                     }
// // //                 </style>
// // //             </head>
// // //             <body>
// // //                 <div class="content-wrapper">
// // //                     ${content || '<p style="text-align:center;color:#999">No content available</p>'}
// // //                 </div>
// // //             </body>
// // //             </html>
// // //         `;
// // //     }, [content, theme, theme.isDarkMode, theme.primary]);
    
// // //     if (!isVisible) {
// // //         return <View style={{ height: 150 }} />;
// // //     }
    
// // //     return (
// // //         <AutoHeightWebView
// // //             source={{ html: getHTMLContent() }}
// // //             style={{ 
// // //                 width: SCREEN_WIDTH - 32,
// // //                 marginVertical: 0,
// // //             }}
// // //             scrollEnabled={false}
// // //             javaScriptEnabled={true}
// // //             domStorageEnabled={true}
// // //             startInLoadingState={false}
// // //             viewportContent={'width=device-width, user-scalable=no'}
// // //             customStyle={`
// // //                 body {
// // //                     font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
// // //                     font-size: 15px;
// // //                     line-height: 1.6;
// // //                     padding: 16px;
// // //                     color: ${theme.isDarkMode ? '#e0e0e0' : '#2c3e50'};
// // //                     background-color: ${theme.isDarkMode ? '#121212' : '#ffffff'};
// // //                 }
// // //                 img {
// // //                     max-width: 100%;
// // //                     height: auto;
// // //                     border-radius: 12px;
// // //                     margin: 12px 0;
// // //                 }
// // //             `}
// // //             showsVerticalScrollIndicator={false}
// // //             showsHorizontalScrollIndicator={false}
// // //         />
// // //     );
// // // });

// // // // ==================== SKELETON LOADER ====================
// // // const SkeletonLoader = ({ theme }) => (
// // //     <View style={styles.skeletonContainer}>
// // //         {[1, 2, 3].map((item) => (
// // //             <View key={item} style={[styles.skeletonCard, { backgroundColor: theme.card }]}>
// // //                 <View style={styles.skeletonHeader}>
// // //                     <View style={[styles.skeletonDate, { backgroundColor: theme.border }]} />
// // //                     <View style={[styles.skeletonBadge, { backgroundColor: theme.border }]} />
// // //                 </View>
// // //                 <View style={[styles.skeletonLine, { backgroundColor: theme.border }]} />
// // //                 <View style={[styles.skeletonLine, { backgroundColor: theme.border, width: '80%' }]} />
// // //                 <View style={styles.skeletonFooter}>
// // //                     <View style={[styles.skeletonAvatar, { backgroundColor: theme.border }]} />
// // //                     <View style={[styles.skeletonText, { backgroundColor: theme.border }]} />
// // //                 </View>
// // //             </View>
// // //         ))}
// // //     </View>
// // // );

// // // // ==================== ACCORDION DIARY CARD ====================
// // // const AccordionDiaryCard = ({ item, theme, isExpanded, onToggle }) => {
// // //     const scaleAnim = useRef(new Animated.Value(1)).current;
    
// // //     const getPlainText = (html) => {
// // //         if (!html) return 'No preview available';
// // //         return html.replace(/<[^>]*>/g, '').substring(0, 120);
// // //     };

// // //     const plainTextPreview = getPlainText(item.content);
    
// // //     const formatDate = (dateString) => {
// // //         const date = new Date(dateString);
// // //         return format(date, 'MMM d, yyyy');
// // //     };

// // //     const formatFullDate = (dateString) => {
// // //         const date = new Date(dateString);
// // //         return format(date, 'EEEE, MMMM d, yyyy');
// // //     };

// // //     const handlePressIn = () => {
// // //         Animated.spring(scaleAnim, {
// // //             toValue: 0.98,
// // //             useNativeDriver: true,
// // //             speed: 50,
// // //         }).start();
// // //     };

// // //     const handlePressOut = () => {
// // //         Animated.spring(scaleAnim, {
// // //             toValue: 1,
// // //             useNativeDriver: true,
// // //             speed: 50,
// // //         }).start();
// // //     };

// // //     const handlePress = () => {
// // //         LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
// // //         onToggle();
// // //     };

// // //     return (
// // //         <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
// // //             <TouchableOpacity
// // //                 activeOpacity={0.9}
// // //                 onPressIn={handlePressIn}
// // //                 onPressOut={handlePressOut}
// // //                 onPress={handlePress}
// // //                 style={[styles.entryCard, { backgroundColor: theme.card }, isExpanded && styles.expandedCard]}
// // //             >
// // //              <View style={styles.cardHeader}>

// // //     {/* Left spacer (for balance) */}
// // //     <View style={{ width: 20 }} />

// // //     {/* CENTER: Subject */}
// // //     <View style={styles.headerCenter}>
// // //         <View style={[styles.subjectBadge, { backgroundColor: theme.primary + '15' }]}>
// // //             <Icon name="book-open-variant" size={25} color={theme.primary} />
// // //             <Text style={[styles.subjectText, { color: theme.primary }]}>
// // //                 {item.subject}
// // //             </Text>
// // //         </View>
// // //     </View>

// // //     {/* RIGHT: Chevron */}
// // //     <TouchableOpacity style={styles.headerRight}>
// // //         <Icon
// // //             name={isExpanded ? "chevron-up" : "chevron-down"}
// // //             size={22}
// // //             color={theme.textSecondary}
// // //         />
// // //     </TouchableOpacity>

// // // </View>

// // //                 {!isExpanded && (
// // //                     <Text style={[styles.previewText, { color: theme.text }]} numberOfLines={2}>
// // //                         {plainTextPreview}
// // //                     </Text>
// // //                 )}

// // //                 {isExpanded && (
// // //                     <View style={styles.expandedContent}>
// // //                         <View style={[styles.divider, { backgroundColor: theme.border }]} />
                        
                   

                      

                      

// // //                         <View style={styles.fullContentSection}>
// // //                             <Text style={[styles.contentLabel, { color: theme.text }]}>📝 Content</Text>
// // //                             <StableWebView
// // //                                 content={item.content}
// // //                                 theme={theme}
// // //                                 isVisible={isExpanded}
// // //                             />
// // //                         </View>
// // //                     </View>
// // //                 )}

// // //                 {!isExpanded && (
// // //                     <View style={styles.cardFooter}>
// // //                         <View style={styles.teacherSection}>
                            
// // //                         </View>
                       
// // //                     </View>
// // //                 )}
// // //             </TouchableOpacity>
// // //         </Animated.View>
// // //     );
// // // };

// // // // ==================== FILTER CHIP ====================
// // // const FilterChip = ({ label, isActive, onPress, icon, theme }) => (
// // //     <TouchableOpacity
// // //         style={[styles.filterChip, { backgroundColor: isActive ? theme.primary : theme.card }, isActive && styles.filterChipActive]}
// // //         onPress={onPress}
// // //         activeOpacity={0.7}
// // //     >
// // //         {icon && <Icon name={icon} size={16} color={isActive ? '#FFF' : theme.textSecondary} />}
// // //         <Text style={[styles.filterChipText, { color: isActive ? '#FFF' : theme.text }]}>{label}</Text>
// // //     </TouchableOpacity>
// // // );

// // // // ==================== DAY NAVIGATOR ====================
// // // const DayNavigator = ({ currentDate, onDateChange, theme }) => {
// // //     const today = startOfToday();
// // //     const sevenDaysAgo = subDays(today, 7);
    
// // //     const canGoPrevious = isAfter(new Date(currentDate), sevenDaysAgo);
// // //     const canGoNext = isBefore(new Date(currentDate), today);
    
// // //     const handlePrevious = () => {
// // //         if (canGoPrevious) {
// // //             const newDate = subDays(new Date(currentDate), 1);
// // //             onDateChange(format(newDate, 'yyyy-MM-dd'));
// // //         }
// // //     };
    
// // //     const handleNext = () => {
// // //         if (canGoNext) {
// // //             const newDate = subDays(new Date(currentDate), -1);
// // //             onDateChange(format(newDate, 'yyyy-MM-dd'));
// // //         }
// // //     };
    
// // //     const handleToday = () => {
// // //         onDateChange(format(today, 'yyyy-MM-dd'));
// // //     };
    
// // //  const formatDisplayDate = (dateString) => {
// // //     const date = new Date(dateString);
// // //     return format(date, 'EEEE, d MMMM yyyy');
// // // };
    
// // //     return (
// // //         <View style={[styles.dayNavigator, { backgroundColor: theme.card }]}>
// // //             <TouchableOpacity onPress={handlePrevious} style={[styles.navButton, !canGoPrevious && styles.navButtonDisabled]} disabled={!canGoPrevious}>
// // //                 <Icon name="chevron-left" size={24} color={canGoPrevious ? theme.primary : theme.textSecondary} />
// // //             </TouchableOpacity>
            
// // //             <TouchableOpacity onPress={handleToday} style={styles.dateDisplay}>
// // //                 <Text style={[styles.dateDisplayText, { color: theme.text }]}>{formatDisplayDate(currentDate)}</Text>
// // //             </TouchableOpacity>
            
// // //             <TouchableOpacity onPress={handleNext} style={[styles.navButton, !canGoNext && styles.navButtonDisabled]} disabled={!canGoNext}>
// // //                 <Icon name="chevron-right" size={24} color={canGoNext ? theme.primary : theme.textSecondary} />
// // //             </TouchableOpacity>
// // //         </View>
// // //     );
// // // };

// // // // ==================== MAIN SCREEN ====================
// // // const ChildDiaryScreen = ({ route, navigation }) => {
// // //     const theme = useSelector(selectThemeData);
// // //     const { childId, childName } = route.params;

// // //     const [refreshing, setRefreshing] = useState(false);
// // //     const [diaryEntries, setDiaryEntries] = useState([]);
// // //     const [filteredEntries, setFilteredEntries] = useState([]);
// // //     const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
// // //     const [selectedSubject, setSelectedSubject] = useState('All');
// // //     const [searchQuery, setSearchQuery] = useState('');
// // //     const [subjects, setSubjects] = useState([]);
// // //     const [isSearchFocused, setIsSearchFocused] = useState(false);
// // //     const [expandedId, setExpandedId] = useState(null);
// // //     const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

// // //     const fadeAnim = useRef(new Animated.Value(0)).current;

// // //     const {
// // //         data: diaryResponse,
// // //         isLoading,
// // //         isFetching,
// // //         error,
// // //         refetch,
// // //     } = useGetChildDiaryQuery({
// // //         childId,
// // //         filters: {
// // //             date: selectedDate,
// // //             subjectId: selectedSubject !== 'All' ? selectedSubject : null,
// // //         },
// // //     });

// // //     useEffect(() => {
// // //         if (diaryResponse?.success === true && diaryResponse?.data?.entries) {
// // //             processDiaryData(diaryResponse.data.entries);
// // //             Animated.timing(fadeAnim, {
// // //                 toValue: 1,
// // //                 duration: 500,
// // //                 useNativeDriver: true,
// // //             }).start();
// // //         }
// // //     }, [diaryResponse]);

// // //     useEffect(() => {
// // //         filterEntries();
// // //     }, [searchQuery, selectedSubject, diaryEntries]);

// // //     const processDiaryData = (entries) => {
// // //         const transformedEntries = entries.map(entry => {
// // //             const dateObj = entry.date ? new Date(entry.date) : new Date();
// // //             const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
// // //             const dayName = !isNaN(dateObj.getTime()) ? dayNames[dateObj.getDay()] : '';

// // //             return {
// // //                 id: entry.id,
// // //                 date: entry.date || '',
// // //                 day: dayName,
// // //                 subject: entry.subject || 'General',
// // //                 subjectId: entry.subjectId,
// // //                 content: entry.content || '',
// // //                 teacher: entry.teacher || 'Teacher',
// // //                 isPublished: entry.isPublished || false,
// // //                 createdAt: entry.createdAt,
// // //             };
// // //         });

// // //         const sortedEntries = transformedEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
        
// // //         const uniqueSubjects = [...new Map(sortedEntries.map(entry => [
// // //             entry.subjectId, { id: entry.subjectId, name: entry.subject }
// // //         ])).values()];
// // //         setSubjects(uniqueSubjects);
        
// // //         setDiaryEntries(sortedEntries);
// // //         setFilteredEntries(sortedEntries);
// // //     };

// // //     const filterEntries = () => {
// // //         let filtered = [...diaryEntries];
// // //         if (searchQuery.trim()) {
// // //             const query = searchQuery.toLowerCase();
// // //             filtered = filtered.filter(entry =>
// // //                 entry.subject.toLowerCase().includes(query) ||
// // //                 entry.teacher.toLowerCase().includes(query) ||
// // //                 (entry.content && entry.content.toLowerCase().includes(query))
// // //             );
// // //         }
// // //         if (selectedSubject !== 'All') {
// // //             filtered = filtered.filter(entry => entry.subjectId === selectedSubject);
// // //         }
// // //         setFilteredEntries(filtered);
        
// // //         if (expandedId) {
// // //             setExpandedId(null);
// // //         }
// // //     };

// // //     const onRefresh = async () => {
// // //         setRefreshing(true);
// // //         await refetch();
// // //         setRefreshing(false);
// // //     };

// // //     const handleDateChange = (date) => {
// // //         LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
// // //         setSelectedDate(date);
// // //         setExpandedId(null);
// // //     };

// // //     const handleResetFilters = () => {
// // //         LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
// // //         setSelectedSubject('All');
// // //         setSearchQuery('');
// // //         setExpandedId(null);
// // //     };

// // //     const handleToggleExpand = (id) => {
// // //         setExpandedId(expandedId === id ? null : id);
// // //     };

// // //     const generatePDFHTML = () => {
// // //         const entriesHTML = filteredEntries.map(entry => `
// // //             <div style="margin-bottom: 30px; page-break-inside: avoid; border-bottom: 1px solid #e0e0e0; padding-bottom: 20px;">
// // //                 <h2 style="color: #2c3e50; margin-bottom: 10px; font-size: 20px;">${entry.subject}</h2>
// // //                 <div style="color: #7f8c8d; margin-bottom: 15px; font-size: 13px;">
// // //                     <div><strong>📅 Date:</strong> ${format(new Date(entry.date), 'EEEE, MMMM d, yyyy')}</div>
// // //                     <div><strong>👨‍🏫 Teacher:</strong> ${entry.teacher}</div>
// // //                 </div>
// // //                 <div style="margin-top: 15px; line-height: 1.6; font-size: 14px;">
// // //                     ${entry.content || '<p style="color: #999;">No content available</p>'}
// // //                 </div>
// // //             </div>
// // //         `).join('');

// // //         return `
// // //             <!DOCTYPE html>
// // //             <html>
// // //             <head>
// // //                 <meta charset="UTF-8">
// // //                 <meta name="viewport" content="width=device-width, initial-scale=1.0">
// // //                 <title>${childName}'s Diary - ${format(new Date(selectedDate), 'MMMM d, yyyy')}</title>
// // //                 <style>
// // //                     * { margin: 0; padding: 0; box-sizing: border-box; }
// // //                     body {
// // //                         font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
// // //                         padding: 40px;
// // //                         color: #333;
// // //                         line-height: 1.6;
// // //                         background-color: white;
// // //                     }
// // //                     .header {
// // //                         text-align: center;
// // //                         margin-bottom: 40px;
// // //                         padding-bottom: 20px;
// // //                         border-bottom: 3px solid #3498db;
// // //                     }
// // //                     .header h1 {
// // //                         color: #2c3e50;
// // //                         margin-bottom: 10px;
// // //                         font-size: 28px;
// // //                     }
// // //                     .header p {
// // //                         color: #7f8c8d;
// // //                         font-size: 14px;
// // //                     }
// // //                     .date-range {
// // //                         text-align: center;
// // //                         background-color: #f8f9fa;
// // //                         padding: 12px;
// // //                         border-radius: 8px;
// // //                         margin-bottom: 30px;
// // //                         font-size: 14px;
// // //                         border: 1px solid #e0e0e0;
// // //                     }
// // //                     img {
// // //                         max-width: 100%;
// // //                         height: auto;
// // //                         border-radius: 8px;
// // //                         margin: 10px 0;
// // //                     }
// // //                     .footer {
// // //                         margin-top: 50px;
// // //                         text-align: center;
// // //                         color: #95a5a6;
// // //                         font-size: 11px;
// // //                         border-top: 1px solid #e0e0e0;
// // //                         padding-top: 20px;
// // //                     }
// // //                     @media print {
// // //                         body { padding: 20px; }
// // //                     }
// // //                 </style>
// // //             </head>
// // //             <body>
// // //                 <div class="header">
// // //                     <h1>${childName}'s Learning Diary</h1>
// // //                     <p>School Activities & Progress Report</p>
// // //                 </div>
// // //                 <div class="date-range">
// // //                     <strong>📅 Date:</strong> ${format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}
// // //                 </div>
// // //                 ${entriesHTML}
// // //                 <div class="footer">
// // //                     Generated on ${format(new Date(), 'MMMM d, yyyy h:mm a')}
// // //                 </div>
// // //             </body>
// // //             </html>
// // //         `;
// // //     };

// // //     const shareDiaryAsPDF = async () => {
// // //         if (filteredEntries.length === 0) {
// // //             Alert.alert('No Entries', 'There are no diary entries to share for this day.');
// // //             return;
// // //         }

// // //         setIsGeneratingPDF(true);
        
// // //         try {
// // //             const htmlContent = generatePDFHTML();
// // //             const fileName = `${childName.replace(/\s/g, '_')}_Diary_${format(new Date(selectedDate), 'yyyy-MM-dd')}`;
            
// // //             const options = {
// // //                 html: htmlContent,
// // //                 fileName: fileName,
// // //                 directory: 'Documents',
// // //             };
            
// // //             const pdfFile = await RNHTMLtoPDF.convert(options);
            
// // //             if (pdfFile && pdfFile.filePath) {
// // //                 await Share.open({
// // //                     url: `file://${pdfFile.filePath}`,
// // //                     type: 'application/pdf',
// // //                     title: `${childName}' Diary`,
// // //                 });
// // //             } else {
// // //                 Alert.alert('Error', 'Failed to generate PDF');
// // //             }
// // //         } catch (error) {
// // //             console.error('PDF Error:', error);
// // //             Alert.alert('Error', 'Failed to generate or share PDF. Please try again.');
// // //         } finally {
// // //             setIsGeneratingPDF(false);
// // //         }
// // //     };

// // //     const renderSearchBar = () => (
// // //     <View style={styles.searchRow}>

// // //         <View
// // //             style={[
// // //                 styles.searchWrapper,
// // //                 isSearchFocused && styles.searchWrapperFocused,
// // //                 {
// // //                     flex: 1,
// // //                     marginHorizontal: 0, // ❌ remove internal push
// // //                     borderColor: theme.border,
// // //                     backgroundColor: theme.card,
// // //                 }
// // //             ]}
// // //         >
// // //             <Icon name="magnify" size={20} color={theme.textSecondary} />

// // //             <TextInput
// // //                 style={[styles.searchInput, { color: theme.text }]}
// // //                 placeholder="Search by subject or teacher..."
// // //                 placeholderTextColor={theme.textSecondary}
// // //                 value={searchQuery}
// // //                 onChangeText={setSearchQuery}
// // //                 onFocus={() => setIsSearchFocused(true)}
// // //                 onBlur={() => setIsSearchFocused(false)}
// // //             />

// // //             {searchQuery !== '' && (
// // //                 <TouchableOpacity onPress={() => setSearchQuery('')}>
// // //                     <Icon name="close-circle" size={20} color={theme.textSecondary} />
// // //                 </TouchableOpacity>
// // //             )}
// // //         </View>

// // //         <TouchableOpacity
// // //             onPress={shareDiaryAsPDF}
// // //             style={{ ...styles.shareButton , borderColor: theme.border, backgroundColor: theme.card,}}
// // //             disabled={isGeneratingPDF}
// // //         >
// // //             {isGeneratingPDF ? (
// // //                 <ActivityIndicator size="small" color={theme.primary} />
// // //             ) : (
// // //                 <Icon name="file-pdf-box" size={24} color="#e74c3c" />
// // //             )}
// // //         </TouchableOpacity>

// // //     </View>
// // // );

// // //     const renderFilters = () => (
// // //         <View style={styles.filtersSection}>
// // //             <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
// // //                 <FilterChip label="All Subjects" isActive={selectedSubject === 'All'} onPress={() => setSelectedSubject('All')} theme={theme} />
// // //                 {subjects.map(subject => (
// // //                     <FilterChip key={subject.id} label={subject.name} isActive={selectedSubject === subject.id} onPress={() => setSelectedSubject(subject.id)} theme={theme} />
// // //                 ))}
// // //             </ScrollView>
// // //         </View>
// // //     );

// // //     const renderHeader = () => (
// // //       <></>
// // //     );

// // //     const renderContent = () => {
// // //         if (filteredEntries.length === 0) {
// // //             return renderEmptyState();
// // //         }
        
// // //         return (
// // //             <>
// // //                 {filteredEntries.map((item) => (
// // //                     <AccordionDiaryCard
// // //                         key={item.id}
// // //                         item={item}
// // //                         theme={theme}
// // //                         isExpanded={expandedId === item.id}
// // //                         onToggle={() => handleToggleExpand(item.id)}
// // //                     />
// // //                 ))}
// // //             </>
// // //         );
// // //     };

// // //     const renderEmptyState = () => (
// // //         <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
// // //             <View style={[styles.emptyIconContainer, { backgroundColor: theme.primary + '10' }]}>
// // //                 <Icon name="notebook-edit-outline" size={64} color={theme.primary} />
// // //             </View>
// // //             <Text style={[styles.emptyTitle, { color: theme.text }]}>
// // //                 {searchQuery || selectedSubject !== 'All' ? 'No matching entries' : 'No diary entries for this day'}
// // //             </Text>
// // //             <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
// // //                 {searchQuery || selectedSubject !== 'All'
// // //                     ? 'Try adjusting your filters to see more results'
// // //                     : `No diary entries found for ${format(new Date(selectedDate), 'MMMM d, yyyy')}`}
// // //             </Text>
// // //             {(searchQuery || selectedSubject !== 'All') && (
// // //                 <TouchableOpacity style={[styles.emptyButton, { backgroundColor: theme.primary }]} onPress={handleResetFilters}>
// // //                     <Text style={styles.emptyButtonText}>Clear Filters</Text>
// // //                 </TouchableOpacity>
// // //             )}
// // //         </Animated.View>
// // //     );

// // //     if (error) {
// // //         return (
// // //             <View style={[styles.container, { backgroundColor: theme.background }]}>
// // //                 {renderHeader()}
// // //                 <View style={styles.errorContainer}>
// // //                     <View style={[styles.errorIconContainer, { backgroundColor: theme.error + '10' }]}>
// // //                         <Icon name="wifi-off" size={60} color={theme.error} />
// // //                     </View>
// // //                     <Text style={[styles.errorText, { color: theme.text }]}>Connection Error</Text>
// // //                     <Text style={[styles.errorSubtext, { color: theme.textSecondary }]}>
// // //                         Unable to connect to the server. Please check your internet connection.
// // //                     </Text>
// // //                     <TouchableOpacity style={[styles.retryButton, { backgroundColor: theme.primary }]} onPress={() => refetch()}>
// // //                         <Text style={styles.retryButtonText}>Try Again</Text>
// // //                     </TouchableOpacity>
// // //                 </View>
// // //             </View>
// // //         );
// // //     }

// // //     return (
// // //         <View style={[styles.container, { backgroundColor: theme.background }]}>
// // //             {renderHeader()}
            
// // //             <ScrollView 
// // //                 style={styles.contentContainer}
// // //                 refreshControl={
// // //                     <RefreshControl 
// // //                         refreshing={refreshing} 
// // //                         onRefresh={onRefresh} 
// // //                         colors={[theme.primary]} 
// // //                         tintColor={theme.primary} 
// // //                     />
// // //                 }
// // //                 showsVerticalScrollIndicator={false}
// // //             >
// // //                 {renderSearchBar()}
// // //                 {renderFilters()}
                
// // //                 <DayNavigator currentDate={selectedDate} onDateChange={handleDateChange} theme={theme} />

// // //                 {(isLoading || isFetching) && !refreshing ? (
// // //                     <SkeletonLoader theme={theme} />
// // //                 ) : (
// // //                     <View style={styles.listContent}>
// // //                         {renderContent()}
// // //                     </View>
// // //                 )}
// // //             </ScrollView>
// // //         </View>
// // //     );
// // // };

// // // // ==================== STYLES ====================
// // // const styles = StyleSheet.create({
// // //     container: { flex: 1 },
// // //     headerContainer: {
// // //         paddingTop: Platform.OS === 'ios' ? 50 : 40,
// // //         paddingBottom: 16,
// // //         borderBottomWidth: 1,
// // //         elevation: 2,
// // //         shadowColor: '#000',
// // //         shadowOffset: { width: 0, height: 2 },
// // //         shadowOpacity: 0.05,
// // //         shadowRadius: 4,
// // //     },
// // //     headerTop: {
// // //         flexDirection: 'row',
// // //         alignItems: 'center',
// // //         justifyContent: 'space-between',
// // //         paddingHorizontal: 16,
// // //     },
// // //     backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
// // //     headerTitle: { fontSize: 18, fontWeight: '600', flex: 1, textAlign: 'center' },
// // // shareButton: {
// // //     width: 46,
// // //     height: 46,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     borderRadius: 12,
// // //     borderWidth: 1,
// // // },
// // //  contentContainer: { flex: 1 },
// // // searchWrapper: {
// // //     flex: 1,
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     paddingHorizontal: 14,
// // //     paddingVertical: 10,
// // //     borderRadius: 12,
// // //     borderWidth: 1,
// // // },
// // //     searchWrapperFocused: { borderWidth: 2 },
// // //     searchInput: { flex: 1, fontSize: 16, marginLeft: 12, paddingVertical: 0 },
// // //     filtersSection: { marginBottom: 12 },
// // //     filtersScroll: { paddingHorizontal: 16 },
// // //     filterChip: {
// // //         flexDirection: 'row',
// // //         alignItems: 'center',
// // //         paddingHorizontal: 16,
// // //         paddingVertical: 8,
// // //         borderRadius: 24,
// // //         marginRight: 8,
// // //         gap: 6,
// // //         shadowColor: '#000',
// // //         shadowOffset: { width: 0, height: 2 },
// // //         shadowOpacity: 0.05,
// // //         shadowRadius: 4,
// // //         elevation: 2,
// // //     },
// // //     filterChipActive: { shadowOpacity: 0.2, shadowRadius: 6 },
// // //     filterChipText: { fontSize: 14, fontWeight: '500' },
// // //     dayNavigator: {
// // //         flexDirection: 'row',
// // //         justifyContent: 'space-between',
// // //         alignItems: 'center',
// // //         marginHorizontal: 16,
// // //         marginBottom: 16,
// // //         paddingHorizontal: 16,
// // //         paddingVertical: 14,
// // //         borderRadius: 16,
// // //         shadowColor: '#000',
// // //         shadowOffset: { width: 0, height: 2 },
// // //         shadowOpacity: 0.05,
// // //         shadowRadius: 4,
// // //         elevation: 2,
// // //     },
// // //     navButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20 },
// // //     navButtonDisabled: { opacity: 0.5 },
// // //     dateDisplay: { alignItems: 'center', flex: 1 },
// // //     dateDisplayText: { fontSize: 16, fontWeight: '600' },
// // //     dateDisplaySub: { fontSize: 12, marginTop: 2 },
// // //     listContent: { paddingHorizontal: 16, paddingBottom: 20 },
// // //     entryCard: { 
// // //         padding: 16, 
// // //         borderRadius: 20, 
// // //         marginBottom: 12, 
// // //         shadowColor: '#000', 
// // //         shadowOffset: { width: 0, height: 4 }, 
// // //         shadowOpacity: 0.08, 
// // //         shadowRadius: 8, 
// // //         elevation: 4 
// // //     },
// // //     expandedCard: { shadowOpacity: 0.12, shadowRadius: 12 },
// // //     cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
// // //     headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
// // //     dateSection: { flexDirection: 'row', alignItems: 'center', gap: 8 },
// // //     dateBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 4 },
// // //     dateText: { fontSize: 12, fontWeight: '500' },
// // //     dayText: { fontSize: 12 },
// // //     subjectBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 10 },
// // //     subjectText: { fontSize: 25, fontWeight: '600' },
// // //     previewText: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
// // //     cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
// // //     teacherSection: { flexDirection: 'row', alignItems: 'center', gap: 8 },
// // //     teacherAvatar: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
// // //     teacherText: { fontSize: 12 },
// // //     statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 6 },
// // //     statusDot: { width: 6, height: 6, borderRadius: 3 },
// // //     statusText: { fontSize: 11, fontWeight: '600' },
// // //     expandedContent: { marginTop: 12 },
// // //     divider: { height: 1, marginBottom: 16 },
// // //     expandedDateSection: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
// // //     expandedDateText: { fontSize: 13, flex: 1 },
// // //     teacherInfo: { flex: 1 },
// // //     teacherLabel: { fontSize: 11, marginBottom: 2 },
// // //     teacherName: { fontSize: 14, fontWeight: '500' },
// // //     fullContentSection: { marginTop: 16 },
// // //     contentLabel: { fontSize: 15, fontWeight: '600', marginBottom: 12 },
// // //     skeletonContainer: { paddingHorizontal: 16 },
// // //     skeletonCard: { padding: 16, borderRadius: 20, marginBottom: 12 },
// // //     skeletonHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
// // //     skeletonDate: { width: 100, height: 24, borderRadius: 12 },
// // //     skeletonBadge: { width: 60, height: 24, borderRadius: 12 },
// // //     skeletonLine: { height: 16, borderRadius: 8, marginBottom: 8 },
// // //     skeletonFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 },
// // //     skeletonAvatar: { width: 28, height: 28, borderRadius: 14 },
// // //     skeletonText: { width: 100, height: 14, borderRadius: 7 },
// // //     emptyContainer: { alignItems: 'center', paddingVertical: 60 },
// // //     emptyIconContainer: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
// // //     emptyTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
// // //     emptySubtitle: { fontSize: 14, textAlign: 'center', paddingHorizontal: 40, marginBottom: 24 },
// // //     emptyButton: { paddingHorizontal: 32, paddingVertical: 12, borderRadius: 25 },
// // //     emptyButtonText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
// // //     errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
// // //     errorIconContainer: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
// // //     errorText: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
// // //     errorSubtext: { fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
// // //     retryButton: { paddingHorizontal: 32, paddingVertical: 12, borderRadius: 25 },
// // //     retryButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
// // //     searchRow: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     paddingHorizontal: 16,
// // //     marginBottom: 16,
// // //     marginTop: 16,
// // //     gap: 10,

    
// // // },

// // // headerCenter: {
// // //     flex: 1,
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // // },

// // // headerRight: {
// // //     width: 30,
// // //     alignItems: 'flex-end',
// // //     justifyContent: 'center',
// // // },


// // // });

// // // export default ChildDiaryScreen;
// // // src/screens/Parent/ChildDiaryScreen.js - UPDATED with expand by default and full date format
// // import React, { useState, useEffect, useCallback, useRef } from 'react';
// // import {
// //     View,
// //     Text,
// //     StyleSheet,
// //     TouchableOpacity,
// //     ActivityIndicator,
// //     RefreshControl,
// //     TextInput,
// //     Dimensions,
// //     Animated,
// //     Platform,
// //     LayoutAnimation,
// //     UIManager,
// //     ScrollView,
// //     Alert
// // } from 'react-native';
// // import { useSelector } from 'react-redux';
// // import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// // import AutoHeightWebView from 'react-native-autoheight-webview';
// // import { selectThemeData } from '../../store/slices/themeSlice';
// // import { useGetChildDiaryQuery } from '../../store/attendanceApi';
// // import { format, subDays, isAfter, isBefore, startOfToday } from 'date-fns';
// // import RNHTMLtoPDF from 'react-native-html-to-pdf';
// // import Share from 'react-native-share';

// // // Enable LayoutAnimation for Android
// // if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
// //     UIManager.setLayoutAnimationEnabledExperimental(true);
// // }

// // const { width: SCREEN_WIDTH } = Dimensions.get('window');

// // // ==================== STABLE AUTOHEIGHT WEBVIEW ====================
// // const StableWebView = React.memo(({ content, theme, isVisible }) => {
// //     const getHTMLContent = useCallback(() => {
// //         return `
// //             <!DOCTYPE html>
// //             <html>
// //             <head>
// //                 <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
// //                 <style>
// //                     * { margin: 0; padding: 0; box-sizing: border-box; }
// //                     body {
// //                         font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
// //                         font-size: 15px;
// //                         line-height: 1.6;
// //                         padding: 16px;
// //                         margin: 0;
// //                         color: ${theme.isDarkMode ? '#e0e0e0' : '#2c3e50'};
// //                         background-color: ${theme.isDarkMode ? '#121212' : '#ffffff'};
// //                     }
// //                     p { margin-bottom: 12px; line-height: 1.6; }
// //                     img { 
// //                         max-width: 100%; 
// //                         height: auto; 
// //                         border-radius: 12px; 
// //                         margin: 12px 0; 
// //                         display: block;
// //                     }
// //                     h1 { font-size: 24px; font-weight: bold; margin: 16px 0 12px 0; }
// //                     h2 { font-size: 20px; font-weight: bold; margin: 14px 0 10px 0; }
// //                     h3 { font-size: 18px; font-weight: bold; margin: 12px 0 8px 0; }
// //                     ul, ol { margin: 8px 0 12px 20px; }
// //                     li { margin-bottom: 6px; line-height: 1.5; }
// //                     a { color: ${theme.primary}; text-decoration: none; }
// //                     blockquote {
// //                         margin: 12px 0;
// //                         padding: 8px 16px;
// //                         border-left: 4px solid ${theme.primary};
// //                         background-color: ${theme.isDarkMode ? '#1e1e1e' : '#f5f5f5'};
// //                         border-radius: 8px;
// //                     }
// //                     table {
// //                         width: 100%;
// //                         border-collapse: collapse;
// //                         margin: 12px 0;
// //                     }
// //                     th, td {
// //                         border: 1px solid ${theme.isDarkMode ? '#333' : '#ddd'};
// //                         padding: 8px;
// //                         text-align: left;
// //                     }
// //                     .content-wrapper {
// //                         width: 100%;
// //                         overflow-wrap: break-word;
// //                     }
// //                 </style>
// //             </head>
// //             <body>
// //                 <div class="content-wrapper">
// //                     ${content || '<p style="text-align:center;color:#999">No content available</p>'}
// //                 </div>
// //             </body>
// //             </html>
// //         `;
// //     }, [content, theme, theme.isDarkMode, theme.primary]);
    
// //     if (!isVisible) {
// //         return <View style={{ height: 150 }} />;
// //     }
    
// //     return (
// //         <AutoHeightWebView
// //             source={{ html: getHTMLContent() }}
// //             style={{ 
// //                 width: SCREEN_WIDTH - 32,
// //                 marginVertical: 0,
// //             }}
// //             scrollEnabled={false}
// //             javaScriptEnabled={true}
// //             domStorageEnabled={true}
// //             startInLoadingState={false}
// //             viewportContent={'width=device-width, user-scalable=no'}
// //             customStyle={`
// //                 body {
// //                     font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
// //                     font-size: 15px;
// //                     line-height: 1.6;
// //                     padding: 16px;
// //                     color: ${theme.isDarkMode ? '#e0e0e0' : '#2c3e50'};
// //                     background-color: ${theme.isDarkMode ? '#121212' : '#ffffff'};
// //                 }
// //                 img {
// //                     max-width: 100%;
// //                     height: auto;
// //                     border-radius: 12px;
// //                     margin: 12px 0;
// //                 }
// //             `}
// //             showsVerticalScrollIndicator={false}
// //             showsHorizontalScrollIndicator={false}
// //         />
// //     );
// // });

// // // ==================== SKELETON LOADER ====================
// // const SkeletonLoader = ({ theme }) => (
// //     <View style={styles.skeletonContainer}>
// //         {[1, 2, 3].map((item) => (
// //             <View key={item} style={[styles.skeletonCard, { backgroundColor: theme.card }]}>
// //                 <View style={styles.skeletonHeader}>
// //                     <View style={[styles.skeletonDate, { backgroundColor: theme.border }]} />
// //                     <View style={[styles.skeletonBadge, { backgroundColor: theme.border }]} />
// //                 </View>
// //                 <View style={[styles.skeletonLine, { backgroundColor: theme.border }]} />
// //                 <View style={[styles.skeletonLine, { backgroundColor: theme.border, width: '80%' }]} />
// //                 <View style={styles.skeletonFooter}>
// //                     <View style={[styles.skeletonAvatar, { backgroundColor: theme.border }]} />
// //                     <View style={[styles.skeletonText, { backgroundColor: theme.border }]} />
// //                 </View>
// //             </View>
// //         ))}
// //     </View>
// // );

// // // ==================== ACCORDION DIARY CARD ====================
// // const AccordionDiaryCard = ({ item, theme, isExpanded, onToggle }) => {
// //     const scaleAnim = useRef(new Animated.Value(1)).current;
    
// //     const getPlainText = (html) => {
// //         if (!html) return 'No preview available';
// //         return html.replace(/<[^>]*>/g, '').substring(0, 120);
// //     };

// //     const plainTextPreview = getPlainText(item.content);
    
// //     const formatDate = (dateString) => {
// //         const date = new Date(dateString);
// //         return format(date, 'MMM d, yyyy');
// //     };

// //     const formatFullDate = (dateString) => {
// //         const date = new Date(dateString);
// //         return format(date, 'EEEE, MMMM d, yyyy');
// //     };

// //     const handlePressIn = () => {
// //         Animated.spring(scaleAnim, {
// //             toValue: 0.98,
// //             useNativeDriver: true,
// //             speed: 50,
// //         }).start();
// //     };

// //     const handlePressOut = () => {
// //         Animated.spring(scaleAnim, {
// //             toValue: 1,
// //             useNativeDriver: true,
// //             speed: 50,
// //         }).start();
// //     };

// //     const handlePress = () => {
// //         LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
// //         onToggle();
// //     };

// //     return (
// //         <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
// //             <TouchableOpacity
// //                 activeOpacity={0.9}
// //                 onPressIn={handlePressIn}
// //                 onPressOut={handlePressOut}
// //                 onPress={handlePress}
// //                 style={[styles.entryCard, { backgroundColor: theme.card }, isExpanded && styles.expandedCard]}
// //             >
// //              <View style={styles.cardHeader}>

// //     {/* Left spacer (for balance) */}
// //     <View style={{ width: 20 }} />

// //     {/* CENTER: Subject */}
// //     <View style={styles.headerCenter}>
// //         <View style={[styles.subjectBadge, { backgroundColor: theme.primary + '15' }]}>
// //             <Icon name="book-open-variant" size={25} color={theme.primary} />
// //             <Text style={[styles.subjectText, { color: theme.primary }]}>
// //                 {item.subject}
// //             </Text>
// //         </View>
// //     </View>

// //     {/* RIGHT: Chevron */}
// //     <TouchableOpacity style={styles.headerRight}>
// //         <Icon
// //             name={isExpanded ? "chevron-up" : "chevron-down"}
// //             size={22}
// //             color={theme.textSecondary}
// //         />
// //     </TouchableOpacity>

// // </View>

// //                 {!isExpanded && (
// //                     <Text style={[styles.previewText, { color: theme.text }]} numberOfLines={2}>
// //                         {plainTextPreview}
// //                     </Text>
// //                 )}

// //                 {isExpanded && (
// //                     <View style={styles.expandedContent}>
// //                         <View style={[styles.divider, { backgroundColor: theme.border }]} />
                        
                   

                      

                      

// //                         <View style={styles.fullContentSection}>
// //                             <Text style={[styles.contentLabel, { color: theme.text }]}>📝 Content</Text>
// //                             <StableWebView
// //                                 content={item.content}
// //                                 theme={theme}
// //                                 isVisible={isExpanded}
// //                             />
// //                         </View>
// //                     </View>
// //                 )}

// //                 {!isExpanded && (
// //                     <View style={styles.cardFooter}>
// //                         <View style={styles.teacherSection}>
                            
// //                         </View>
                       
// //                     </View>
// //                 )}
// //             </TouchableOpacity>
// //         </Animated.View>
// //     );
// // };

// // // ==================== FILTER CHIP ====================
// // const FilterChip = ({ label, isActive, onPress, icon, theme }) => (
// //     <TouchableOpacity
// //         style={[styles.filterChip, { backgroundColor: isActive ? theme.primary : theme.card }, isActive && styles.filterChipActive]}
// //         onPress={onPress}
// //         activeOpacity={0.7}
// //     >
// //         {icon && <Icon name={icon} size={16} color={isActive ? '#FFF' : theme.textSecondary} />}
// //         <Text style={[styles.filterChipText, { color: isActive ? '#FFF' : theme.text }]}>{label}</Text>
// //     </TouchableOpacity>
// // );

// // // ==================== DAY NAVIGATOR ====================
// // const DayNavigator = ({ currentDate, onDateChange, theme }) => {
// //     const today = startOfToday();
// //     const sevenDaysAgo = subDays(today, 7);
    
// //     const canGoPrevious = isAfter(new Date(currentDate), sevenDaysAgo);
// //     const canGoNext = isBefore(new Date(currentDate), today);
    
// //     const handlePrevious = () => {
// //         if (canGoPrevious) {
// //             const newDate = subDays(new Date(currentDate), 1);
// //             onDateChange(format(newDate, 'yyyy-MM-dd'));
// //         }
// //     };
    
// //     const handleNext = () => {
// //         if (canGoNext) {
// //             const newDate = subDays(new Date(currentDate), -1);
// //             onDateChange(format(newDate, 'yyyy-MM-dd'));
// //         }
// //     };
    
// //     const handleToday = () => {
// //         onDateChange(format(today, 'yyyy-MM-dd'));
// //     };
    
// //     // CHANGED: Format date as "Sunday, 3 May 2026" instead of "Today/Yesterday"
// //     const formatDisplayDate = (dateString) => {
// //         const date = new Date(dateString);
// //         return format(date, 'EEEE, d MMMM yyyy');
// //     };
    
// //     return (
// //         <View style={[styles.dayNavigator, { backgroundColor: theme.card }]}>
// //             <TouchableOpacity onPress={handlePrevious} style={[styles.navButton, !canGoPrevious && styles.navButtonDisabled]} disabled={!canGoPrevious}>
// //                 <Icon name="chevron-left" size={24} color={canGoPrevious ? theme.primary : theme.textSecondary} />
// //             </TouchableOpacity>
            
// //             <TouchableOpacity onPress={handleToday} style={styles.dateDisplay}>
// //                 <Text style={[styles.dateDisplayText, { color: theme.text }]}>
// //                     {formatDisplayDate(currentDate)}
// //                 </Text>
// //             </TouchableOpacity>
            
// //             <TouchableOpacity onPress={handleNext} style={[styles.navButton, !canGoNext && styles.navButtonDisabled]} disabled={!canGoNext}>
// //                 <Icon name="chevron-right" size={24} color={canGoNext ? theme.primary : theme.textSecondary} />
// //             </TouchableOpacity>
// //         </View>
// //     );
// // };

// // // ==================== MAIN SCREEN ====================
// // const ChildDiaryScreen = ({ route, navigation }) => {
// //     const theme = useSelector(selectThemeData);
// //     const { childId, childName } = route.params;

// //     const [refreshing, setRefreshing] = useState(false);
// //     const [diaryEntries, setDiaryEntries] = useState([]);
// //     const [filteredEntries, setFilteredEntries] = useState([]);
// //     const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
// //     const [selectedSubject, setSelectedSubject] = useState('All');
// //     const [searchQuery, setSearchQuery] = useState('');
// //     const [subjects, setSubjects] = useState([]);
// //     const [isSearchFocused, setIsSearchFocused] = useState(false);
// //     // CHANGED: Initialize expandedId as null, will be set when data loads
// //     const [expandedId, setExpandedId] = useState(null);
// //     const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

// //     const fadeAnim = useRef(new Animated.Value(0)).current;

// //     const {
// //         data: diaryResponse,
// //         isLoading,
// //         isFetching,
// //         error,
// //         refetch,
// //     } = useGetChildDiaryQuery({
// //         childId,
// //         filters: {
// //             date: selectedDate,
// //             subjectId: selectedSubject !== 'All' ? selectedSubject : null,
// //         },
// //     });

// //     useEffect(() => {
// //         if (diaryResponse?.success === true && diaryResponse?.data?.entries) {
// //             processDiaryData(diaryResponse.data.entries);
// //             Animated.timing(fadeAnim, {
// //                 toValue: 1,
// //                 duration: 500,
// //                 useNativeDriver: true,
// //             }).start();
// //         }
// //     }, [diaryResponse]);

// //     useEffect(() => {
// //         filterEntries();
// //     }, [searchQuery, selectedSubject, diaryEntries]);

// //     const processDiaryData = (entries) => {
// //         const transformedEntries = entries.map(entry => {
// //             const dateObj = entry.date ? new Date(entry.date) : new Date();
// //             const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
// //             const dayName = !isNaN(dateObj.getTime()) ? dayNames[dateObj.getDay()] : '';

// //             return {
// //                 id: entry.id,
// //                 date: entry.date || '',
// //                 day: dayName,
// //                 subject: entry.subject || 'General',
// //                 subjectId: entry.subjectId,
// //                 content: entry.content || '',
// //                 teacher: entry.teacher || 'Teacher',
// //                 isPublished: entry.isPublished || false,
// //                 createdAt: entry.createdAt,
// //             };
// //         });

// //         const sortedEntries = transformedEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
        
// //         const uniqueSubjects = [...new Map(sortedEntries.map(entry => [
// //             entry.subjectId, { id: entry.subjectId, name: entry.subject }
// //         ])).values()];
// //         setSubjects(uniqueSubjects);
        
// //         setDiaryEntries(sortedEntries);
// //         setFilteredEntries(sortedEntries);
        
// //         // CHANGED: Auto-expand the first entry by default when data loads
// //         if (sortedEntries.length > 0 && expandedId === null) {
// //             setExpandedId(sortedEntries[0].id);
// //         }
// //     };

// //     const filterEntries = () => {
// //         let filtered = [...diaryEntries];
// //         if (searchQuery.trim()) {
// //             const query = searchQuery.toLowerCase();
// //             filtered = filtered.filter(entry =>
// //                 entry.subject.toLowerCase().includes(query) ||
// //                 entry.teacher.toLowerCase().includes(query) ||
// //                 (entry.content && entry.content.toLowerCase().includes(query))
// //             );
// //         }
// //         if (selectedSubject !== 'All') {
// //             filtered = filtered.filter(entry => entry.subjectId === selectedSubject);
// //         }
// //         setFilteredEntries(filtered);
        
// //         // CHANGED: Expand first entry after filtering if available
// //         if (filtered.length > 0) {
// //             setExpandedId(filtered[0].id);
// //         } else {
// //             setExpandedId(null);
// //         }
// //     };

// //     const onRefresh = async () => {
// //         setRefreshing(true);
// //         await refetch();
// //         setRefreshing(false);
// //     };

// //     const handleDateChange = (date) => {
// //         LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
// //         setSelectedDate(date);
// //         setExpandedId(null);
// //     };

// //     const handleResetFilters = () => {
// //         LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
// //         setSelectedSubject('All');
// //         setSearchQuery('');
// //         setExpandedId(null);
// //     };

// //     const handleToggleExpand = (id) => {
// //         setExpandedId(expandedId === id ? null : id);
// //     };

// //     const generatePDFHTML = () => {
// //         const entriesHTML = filteredEntries.map(entry => `
// //             <div style="margin-bottom: 30px; page-break-inside: avoid; border-bottom: 1px solid #e0e0e0; padding-bottom: 20px;">
// //                 <h2 style="color: #2c3e50; margin-bottom: 10px; font-size: 20px;">${entry.subject}</h2>
// //                 <div style="color: #7f8c8d; margin-bottom: 15px; font-size: 13px;">
// //                     <div><strong>📅 Date:</strong> ${format(new Date(entry.date), 'EEEE, MMMM d, yyyy')}</div>
// //                     <div><strong>👨‍🏫 Teacher:</strong> ${entry.teacher}</div>
// //                 </div>
// //                 <div style="margin-top: 15px; line-height: 1.6; font-size: 14px;">
// //                     ${entry.content || '<p style="color: #999;">No content available</p>'}
// //                 </div>
// //             </div>
// //         `).join('');

// //         return `
// //             <!DOCTYPE html>
// //             <html>
// //             <head>
// //                 <meta charset="UTF-8">
// //                 <meta name="viewport" content="width=device-width, initial-scale=1.0">
// //                 <title>${childName}'s Diary - ${format(new Date(selectedDate), 'MMMM d, yyyy')}</title>
// //                 <style>
// //                     * { margin: 0; padding: 0; box-sizing: border-box; }
// //                     body {
// //                         font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
// //                         padding: 40px;
// //                         color: #333;
// //                         line-height: 1.6;
// //                         background-color: white;
// //                     }
// //                     .header {
// //                         text-align: center;
// //                         margin-bottom: 40px;
// //                         padding-bottom: 20px;
// //                         border-bottom: 3px solid #3498db;
// //                     }
// //                     .header h1 {
// //                         color: #2c3e50;
// //                         margin-bottom: 10px;
// //                         font-size: 28px;
// //                     }
// //                     .header p {
// //                         color: #7f8c8d;
// //                         font-size: 14px;
// //                     }
// //                     .date-range {
// //                         text-align: center;
// //                         background-color: #f8f9fa;
// //                         padding: 12px;
// //                         border-radius: 8px;
// //                         margin-bottom: 30px;
// //                         font-size: 14px;
// //                         border: 1px solid #e0e0e0;
// //                     }
// //                     img {
// //                         max-width: 100%;
// //                         height: auto;
// //                         border-radius: 8px;
// //                         margin: 10px 0;
// //                     }
// //                     .footer {
// //                         margin-top: 50px;
// //                         text-align: center;
// //                         color: #95a5a6;
// //                         font-size: 11px;
// //                         border-top: 1px solid #e0e0e0;
// //                         padding-top: 20px;
// //                     }
// //                     @media print {
// //                         body { padding: 20px; }
// //                     }
// //                 </style>
// //             </head>
// //             <body>
// //                 <div class="header">
// //                     <h1>${childName}'s Learning Diary</h1>
// //                     <p>School Activities & Progress Report</p>
// //                 </div>
// //                 <div class="date-range">
// //                     <strong>📅 Date:</strong> ${format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}
// //                 </div>
// //                 ${entriesHTML}
// //                 <div class="footer">
// //                     Generated on ${format(new Date(), 'MMMM d, yyyy h:mm a')}
// //                 </div>
// //             </body>
// //             </html>
// //         `;
// //     };

// //     const shareDiaryAsPDF = async () => {
// //         if (filteredEntries.length === 0) {
// //             Alert.alert('No Entries', 'There are no diary entries to share for this day.');
// //             return;
// //         }

// //         setIsGeneratingPDF(true);
        
// //         try {
// //             const htmlContent = generatePDFHTML();
// //             const fileName = `${childName.replace(/\s/g, '_')}_Diary_${format(new Date(selectedDate), 'yyyy-MM-dd')}`;
            
// //             const options = {
// //                 html: htmlContent,
// //                 fileName: fileName,
// //                 directory: 'Documents',
// //             };
            
// //             const pdfFile = await RNHTMLtoPDF.convert(options);
            
// //             if (pdfFile && pdfFile.filePath) {
// //                 await Share.open({
// //                     url: `file://${pdfFile.filePath}`,
// //                     type: 'application/pdf',
// //                     title: `${childName}' Diary`,
// //                 });
// //             } else {
// //                 Alert.alert('Error', 'Failed to generate PDF');
// //             }
// //         } catch (error) {
// //             console.error('PDF Error:', error);
// //             Alert.alert('Error', 'Failed to generate or share PDF. Please try again.');
// //         } finally {
// //             setIsGeneratingPDF(false);
// //         }
// //     };

// //     const renderSearchBar = () => (
// //     <View style={styles.searchRow}>

// //         <View
// //             style={[
// //                 styles.searchWrapper,
// //                 isSearchFocused && styles.searchWrapperFocused,
// //                 {
// //                     flex: 1,
// //                     marginHorizontal: 0,
// //                     borderColor: theme.border,
// //                     backgroundColor: theme.card,
// //                 }
// //             ]}
// //         >
// //             <Icon name="magnify" size={20} color={theme.textSecondary} />

// //             <TextInput
// //                 style={[styles.searchInput, { color: theme.text }]}
// //                 placeholder="Search by subject or teacher..."
// //                 placeholderTextColor={theme.textSecondary}
// //                 value={searchQuery}
// //                 onChangeText={setSearchQuery}
// //                 onFocus={() => setIsSearchFocused(true)}
// //                 onBlur={() => setIsSearchFocused(false)}
// //             />

// //             {searchQuery !== '' && (
// //                 <TouchableOpacity onPress={() => setSearchQuery('')}>
// //                     <Icon name="close-circle" size={20} color={theme.textSecondary} />
// //                 </TouchableOpacity>
// //             )}
// //         </View>

// //         <TouchableOpacity
// //             onPress={shareDiaryAsPDF}
// //             style={{ ...styles.shareButton , borderColor: theme.border, backgroundColor: theme.card,}}
// //             disabled={isGeneratingPDF}
// //         >
// //             {isGeneratingPDF ? (
// //                 <ActivityIndicator size="small" color={theme.primary} />
// //             ) : (
// //                 <Icon name="file-pdf-box" size={24} color="#e74c3c" />
// //             )}
// //         </TouchableOpacity>

// //     </View>
// // );

// //     const renderFilters = () => (
// //         <View style={styles.filtersSection}>
// //             <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
// //                 <FilterChip label="All Subjects" isActive={selectedSubject === 'All'} onPress={() => setSelectedSubject('All')} theme={theme} />
// //                 {subjects.map(subject => (
// //                     <FilterChip key={subject.id} label={subject.name} isActive={selectedSubject === subject.id} onPress={() => setSelectedSubject(subject.id)} theme={theme} />
// //                 ))}
// //             </ScrollView>
// //         </View>
// //     );

// //     const renderHeader = () => (
// //       <></>
// //     );

// //     const renderContent = () => {
// //         if (filteredEntries.length === 0) {
// //             return renderEmptyState();
// //         }
        
// //         return (
// //             <>
// //                 {filteredEntries.map((item) => (
// //                     <AccordionDiaryCard
// //                         key={item.id}
// //                         item={item}
// //                         theme={theme}
// //                         isExpanded={expandedId === item.id}
// //                         onToggle={() => handleToggleExpand(item.id)}
// //                     />
// //                 ))}
// //             </>
// //         );
// //     };

// //     const renderEmptyState = () => (
// //         <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
// //             <View style={[styles.emptyIconContainer, { backgroundColor: theme.primary + '10' }]}>
// //                 <Icon name="notebook-edit-outline" size={64} color={theme.primary} />
// //             </View>
// //             <Text style={[styles.emptyTitle, { color: theme.text }]}>
// //                 {searchQuery || selectedSubject !== 'All' ? 'No matching entries' : 'No diary entries for this day'}
// //             </Text>
// //             <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
// //                 {searchQuery || selectedSubject !== 'All'
// //                     ? 'Try adjusting your filters to see more results'
// //                     : `No diary entries found for ${format(new Date(selectedDate), 'EEEE, d MMMM yyyy')}`}
// //             </Text>
// //             {(searchQuery || selectedSubject !== 'All') && (
// //                 <TouchableOpacity style={[styles.emptyButton, { backgroundColor: theme.primary }]} onPress={handleResetFilters}>
// //                     <Text style={styles.emptyButtonText}>Clear Filters</Text>
// //                 </TouchableOpacity>
// //             )}
// //         </Animated.View>
// //     );

// //     if (error) {
// //         return (
// //             <View style={[styles.container, { backgroundColor: theme.background }]}>
// //                 {renderHeader()}
// //                 <View style={styles.errorContainer}>
// //                     <View style={[styles.errorIconContainer, { backgroundColor: theme.error + '10' }]}>
// //                         <Icon name="wifi-off" size={60} color={theme.error} />
// //                     </View>
// //                     <Text style={[styles.errorText, { color: theme.text }]}>Connection Error</Text>
// //                     <Text style={[styles.errorSubtext, { color: theme.textSecondary }]}>
// //                         Unable to connect to the server. Please check your internet connection.
// //                     </Text>
// //                     <TouchableOpacity style={[styles.retryButton, { backgroundColor: theme.primary }]} onPress={() => refetch()}>
// //                         <Text style={styles.retryButtonText}>Try Again</Text>
// //                     </TouchableOpacity>
// //                 </View>
// //             </View>
// //         );
// //     }

// //     return (
// //         <View style={[styles.container, { backgroundColor: theme.background }]}>
// //             {renderHeader()}
            
// //             <ScrollView 
// //                 style={styles.contentContainer}
// //                 refreshControl={
// //                     <RefreshControl 
// //                         refreshing={refreshing} 
// //                         onRefresh={onRefresh} 
// //                         colors={[theme.primary]} 
// //                         tintColor={theme.primary} 
// //                     />
// //                 }
// //                 showsVerticalScrollIndicator={false}
// //             >
// //                 {renderSearchBar()}
// //                 {renderFilters()}
                
// //                 <DayNavigator currentDate={selectedDate} onDateChange={handleDateChange} theme={theme} />

// //                 {(isLoading || isFetching) && !refreshing ? (
// //                     <SkeletonLoader theme={theme} />
// //                 ) : (
// //                     <View style={styles.listContent}>
// //                         {renderContent()}
// //                     </View>
// //                 )}
// //             </ScrollView>
// //         </View>
// //     );
// // };

// // // ==================== STYLES ====================
// // const styles = StyleSheet.create({
// //     container: { flex: 1 },
// //     headerContainer: {
// //         paddingTop: Platform.OS === 'ios' ? 50 : 40,
// //         paddingBottom: 16,
// //         borderBottomWidth: 1,
// //         elevation: 2,
// //         shadowColor: '#000',
// //         shadowOffset: { width: 0, height: 2 },
// //         shadowOpacity: 0.05,
// //         shadowRadius: 4,
// //     },
// //     headerTop: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         justifyContent: 'space-between',
// //         paddingHorizontal: 16,
// //     },
// //     backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
// //     headerTitle: { fontSize: 18, fontWeight: '600', flex: 1, textAlign: 'center' },
// // shareButton: {
// //     width: 46,
// //     height: 46,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderRadius: 12,
// //     borderWidth: 1,
// // },
// //  contentContainer: { flex: 1 },
// // searchWrapper: {
// //     flex: 1,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingHorizontal: 14,
// //     paddingVertical: 10,
// //     borderRadius: 12,
// //     borderWidth: 1,
// // },
// //     searchWrapperFocused: { borderWidth: 2 },
// //     searchInput: { flex: 1, fontSize: 16, marginLeft: 12, paddingVertical: 0 },
// //     filtersSection: { marginBottom: 12 },
// //     filtersScroll: { paddingHorizontal: 16 },
// //     filterChip: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         paddingHorizontal: 16,
// //         paddingVertical: 8,
// //         borderRadius: 24,
// //         marginRight: 8,
// //         gap: 6,
// //         shadowColor: '#000',
// //         shadowOffset: { width: 0, height: 2 },
// //         shadowOpacity: 0.05,
// //         shadowRadius: 4,
// //         elevation: 2,
// //     },
// //     filterChipActive: { shadowOpacity: 0.2, shadowRadius: 6 },
// //     filterChipText: { fontSize: 14, fontWeight: '500' },
// //     dayNavigator: {
// //         flexDirection: 'row',
// //         justifyContent: 'space-between',
// //         alignItems: 'center',
// //         marginHorizontal: 16,
// //         marginBottom: 16,
// //         paddingHorizontal: 16,
// //         paddingVertical: 14,
// //         borderRadius: 16,
// //         shadowColor: '#000',
// //         shadowOffset: { width: 0, height: 2 },
// //         shadowOpacity: 0.05,
// //         shadowRadius: 4,
// //         elevation: 2,
// //     },
// //     navButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20 },
// //     navButtonDisabled: { opacity: 0.5 },
// //     dateDisplay: { alignItems: 'center', flex: 1 },
// //     dateDisplayText: { fontSize: 16, fontWeight: '600' },
// //     dateDisplaySub: { fontSize: 12, marginTop: 2 },
// //     listContent: { paddingHorizontal: 16, paddingBottom: 20 },
// //     entryCard: { 
// //         padding: 16, 
// //         borderRadius: 20, 
// //         marginBottom: 12, 
// //         shadowColor: '#000', 
// //         shadowOffset: { width: 0, height: 4 }, 
// //         shadowOpacity: 0.08, 
// //         shadowRadius: 8, 
// //         elevation: 4 
// //     },
// //     expandedCard: { shadowOpacity: 0.12, shadowRadius: 12 },
// //     cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
// //     headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
// //     dateSection: { flexDirection: 'row', alignItems: 'center', gap: 8 },
// //     dateBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 4 },
// //     dateText: { fontSize: 12, fontWeight: '500' },
// //     dayText: { fontSize: 12 },
// //     subjectBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 10 },
// //     subjectText: { fontSize: 25, fontWeight: '600' },
// //     previewText: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
// //     cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
// //     teacherSection: { flexDirection: 'row', alignItems: 'center', gap: 8 },
// //     teacherAvatar: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
// //     teacherText: { fontSize: 12 },
// //     statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 6 },
// //     statusDot: { width: 6, height: 6, borderRadius: 3 },
// //     statusText: { fontSize: 11, fontWeight: '600' },
// //     expandedContent: { marginTop: 12 },
// //     divider: { height: 1, marginBottom: 16 },
// //     expandedDateSection: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
// //     expandedDateText: { fontSize: 13, flex: 1 },
// //     teacherInfo: { flex: 1 },
// //     teacherLabel: { fontSize: 11, marginBottom: 2 },
// //     teacherName: { fontSize: 14, fontWeight: '500' },
// //     fullContentSection: { marginTop: 16 },
// //     contentLabel: { fontSize: 15, fontWeight: '600', marginBottom: 12 },
// //     skeletonContainer: { paddingHorizontal: 16 },
// //     skeletonCard: { padding: 16, borderRadius: 20, marginBottom: 12 },
// //     skeletonHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
// //     skeletonDate: { width: 100, height: 24, borderRadius: 12 },
// //     skeletonBadge: { width: 60, height: 24, borderRadius: 12 },
// //     skeletonLine: { height: 16, borderRadius: 8, marginBottom: 8 },
// //     skeletonFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 },
// //     skeletonAvatar: { width: 28, height: 28, borderRadius: 14 },
// //     skeletonText: { width: 100, height: 14, borderRadius: 7 },
// //     emptyContainer: { alignItems: 'center', paddingVertical: 60 },
// //     emptyIconContainer: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
// //     emptyTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
// //     emptySubtitle: { fontSize: 14, textAlign: 'center', paddingHorizontal: 40, marginBottom: 24 },
// //     emptyButton: { paddingHorizontal: 32, paddingVertical: 12, borderRadius: 25 },
// //     emptyButtonText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
// //     errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
// //     errorIconContainer: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
// //     errorText: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
// //     errorSubtext: { fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
// //     retryButton: { paddingHorizontal: 32, paddingVertical: 12, borderRadius: 25 },
// //     retryButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
// //     searchRow: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingHorizontal: 16,
// //     marginBottom: 16,
// //     marginTop: 16,
// //     gap: 10,

    
// // },

// // headerCenter: {
// //     flex: 1,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// // },

// // headerRight: {
// //     width: 30,
// //     alignItems: 'flex-end',
// //     justifyContent: 'center',
// // },


// // });

// // export default ChildDiaryScreen;

// // src/screens/Parent/ChildDiaryScreen.js - ALL ENTRIES EXPANDED BY DEFAULT
// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     TouchableOpacity,
//     ActivityIndicator,
//     RefreshControl,
//     TextInput,
//     Dimensions,
//     Animated,
//     Platform,
//     LayoutAnimation,
//     UIManager,
//     ScrollView,
//     Alert
// } from 'react-native';
// import { useSelector } from 'react-redux';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import AutoHeightWebView from 'react-native-autoheight-webview';
// import { selectThemeData } from '../../store/slices/themeSlice';
// import { useGetChildDiaryQuery } from '../../store/attendanceApi';
// import { format, subDays, isAfter, isBefore, startOfToday } from 'date-fns';
// import RNHTMLtoPDF from 'react-native-html-to-pdf';
// import Share from 'react-native-share';

// // Enable LayoutAnimation for Android
// if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
//     UIManager.setLayoutAnimationEnabledExperimental(true);
// }

// const { width: SCREEN_WIDTH } = Dimensions.get('window');

// // ==================== STABLE AUTOHEIGHT WEBVIEW ====================
// const StableWebView = React.memo(({ content, theme, isVisible }) => {
//     const getHTMLContent = useCallback(() => {
//         return `
//             <!DOCTYPE html>
//             <html>
//             <head>
//                 <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
//                 <style>
//                     * { margin: 0; padding: 0; box-sizing: border-box; }
//                     body {
//                         font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
//                         font-size: 15px;
//                         line-height: 1.6;
//                         padding: 16px;
//                         margin: 0;
//                         color: ${theme.isDarkMode ? '#e0e0e0' : '#2c3e50'};
//                         background-color: ${theme.isDarkMode ? '#121212' : '#ffffff'};
//                     }
//                     p { margin-bottom: 12px; line-height: 1.6; }
//                     img { 
//                         max-width: 100%; 
//                         height: auto; 
//                         border-radius: 12px; 
//                         margin: 12px 0; 
//                         display: block;
//                     }
//                     h1 { font-size: 24px; font-weight: bold; margin: 16px 0 12px 0; }
//                     h2 { font-size: 20px; font-weight: bold; margin: 14px 0 10px 0; }
//                     h3 { font-size: 18px; font-weight: bold; margin: 12px 0 8px 0; }
//                     ul, ol { margin: 8px 0 12px 20px; }
//                     li { margin-bottom: 6px; line-height: 1.5; }
//                     a { color: ${theme.primary}; text-decoration: none; }
//                     blockquote {
//                         margin: 12px 0;
//                         padding: 8px 16px;
//                         border-left: 4px solid ${theme.primary};
//                         background-color: ${theme.isDarkMode ? '#1e1e1e' : '#f5f5f5'};
//                         border-radius: 8px;
//                     }
//                     table {
//                         width: 100%;
//                         border-collapse: collapse;
//                         margin: 12px 0;
//                     }
//                     th, td {
//                         border: 1px solid ${theme.isDarkMode ? '#333' : '#ddd'};
//                         padding: 8px;
//                         text-align: left;
//                     }
//                     .content-wrapper {
//                         width: 100%;
//                         overflow-wrap: break-word;
//                     }
//                 </style>
//             </head>
//             <body>
//                 <div class="content-wrapper">
//                     ${content || '<p style="text-align:center;color:#999">No content available</p>'}
//                 </div>
//             </body>
//             </html>
//         `;
//     }, [content, theme, theme.isDarkMode, theme.primary]);
    
//     if (!isVisible) {
//         return <View style={{ height: 150 }} />;
//     }
    
//     return (
//         <AutoHeightWebView
//             source={{ html: getHTMLContent() }}
//             style={{ 
//                 width: SCREEN_WIDTH - 32,
//                 marginVertical: 0,
//             }}
//             scrollEnabled={false}
//             javaScriptEnabled={true}
//             domStorageEnabled={true}
//             startInLoadingState={false}
//             viewportContent={'width=device-width, user-scalable=no'}
//             customStyle={`
//                 body {
//                     font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
//                     font-size: 15px;
//                     line-height: 1.6;
//                     padding: 16px;
//                     color: ${theme.isDarkMode ? '#e0e0e0' : '#2c3e50'};
//                     background-color: ${theme.isDarkMode ? '#121212' : '#ffffff'};
//                 }
//                 img {
//                     max-width: 100%;
//                     height: auto;
//                     border-radius: 12px;
//                     margin: 12px 0;
//                 }
//             `}
//             showsVerticalScrollIndicator={false}
//             showsHorizontalScrollIndicator={false}
//         />
//     );
// });

// // ==================== SKELETON LOADER ====================
// const SkeletonLoader = ({ theme }) => (
//     <View style={styles.skeletonContainer}>
//         {[1, 2, 3].map((item) => (
//             <View key={item} style={[styles.skeletonCard, { backgroundColor: theme.card }]}>
//                 <View style={styles.skeletonHeader}>
//                     <View style={[styles.skeletonDate, { backgroundColor: theme.border }]} />
//                     <View style={[styles.skeletonBadge, { backgroundColor: theme.border }]} />
//                 </View>
//                 <View style={[styles.skeletonLine, { backgroundColor: theme.border }]} />
//                 <View style={[styles.skeletonLine, { backgroundColor: theme.border, width: '80%' }]} />
//                 <View style={styles.skeletonFooter}>
//                     <View style={[styles.skeletonAvatar, { backgroundColor: theme.border }]} />
//                     <View style={[styles.skeletonText, { backgroundColor: theme.border }]} />
//                 </View>
//             </View>
//         ))}
//     </View>
// );

// // ==================== ACCORDION DIARY CARD ====================
// const AccordionDiaryCard = ({ item, theme, isExpanded, onToggle }) => {
//     const scaleAnim = useRef(new Animated.Value(1)).current;
    
//     const getPlainText = (html) => {
//         if (!html) return 'No preview available';
//         return html.replace(/<[^>]*>/g, '').substring(0, 120);
//     };

//     const plainTextPreview = getPlainText(item.content);
    
//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         return format(date, 'MMM d, yyyy');
//     };

//     const formatFullDate = (dateString) => {
//         const date = new Date(dateString);
//         return format(date, 'EEEE, MMMM d, yyyy');
//     };

//     const handlePressIn = () => {
//         Animated.spring(scaleAnim, {
//             toValue: 0.98,
//             useNativeDriver: true,
//             speed: 50,
//         }).start();
//     };

//     const handlePressOut = () => {
//         Animated.spring(scaleAnim, {
//             toValue: 1,
//             useNativeDriver: true,
//             speed: 50,
//         }).start();
//     };

//     const handlePress = () => {
//         LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//         onToggle();
//     };

//     return (
//         <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
//             <TouchableOpacity
//                 activeOpacity={0.9}
//                 onPressIn={handlePressIn}
//                 onPressOut={handlePressOut}
//                 onPress={handlePress}
//                 style={[styles.entryCard, { backgroundColor: theme.card }, isExpanded && styles.expandedCard]}
//             >
//              <View style={{...styles.cardHeader,  backgroundColor: theme.primary }}>

//     {/* Left spacer (for balance) */}
//     <View style={{ width: 20 }} />

//     {/* CENTER: Subject */}
//     <View style={styles.headerCenter}>
//         <View style={[styles.subjectBadge, { backgroundColor: theme.primary + '15' }]}>
//             <Icon name="book-open-variant" size={25} color='#fff' />
//             <Text style={[styles.subjectText, {  color: '#fff'}]}>
//                 {item.subject}
//             </Text>
//         </View>
//     </View>

//     {/* RIGHT: Chevron */}
//     <TouchableOpacity style={styles.headerRight}>
//         <Icon
//             name={isExpanded ? "chevron-up" : "chevron-down"}
//             size={22}
//              color="#fff"
//         />
//     </TouchableOpacity>

// </View>

//                 {!isExpanded && (
//                     <Text style={[styles.previewText, { color: theme.text }]} numberOfLines={2}>
//                         {plainTextPreview}
//                     </Text>
//                 )}

//                 {isExpanded && (
//                     <View style={styles.expandedContent}>
//                         <View style={[styles.divider, { backgroundColor: theme.border }]} />
                        
                   

                      

                      

//                         <View style={styles.fullContentSection}>
//                             <Text style={[styles.contentLabel, { color: theme.text }]}>📝 Diary</Text>
//                             <StableWebView
//                                 content={item.content}
//                                 theme={theme}
//                                 isVisible={isExpanded}
//                             />
//                         </View>
//                     </View>
//                 )}

//                 {!isExpanded && (
//                     <View style={styles.cardFooter}>
//                         <View style={styles.teacherSection}>
                            
//                         </View>
                       
//                     </View>
//                 )}
//             </TouchableOpacity>
//         </Animated.View>
//     );
// };

// // ==================== FILTER CHIP ====================
// const FilterChip = ({ label, isActive, onPress, icon, theme }) => (
//     <TouchableOpacity
//         style={[styles.filterChip, { backgroundColor: isActive ? theme.primary : theme.card }, isActive && styles.filterChipActive]}
//         onPress={onPress}
//         activeOpacity={0.7}
//     >
//         {icon && <Icon name={icon} size={16} color={isActive ? '#FFF' : theme.textSecondary} />}
//         <Text style={[styles.filterChipText, { color: isActive ? '#FFF' : theme.text }]}>{label}</Text>
//     </TouchableOpacity>
// );

// // ==================== DAY NAVIGATOR ====================
// const DayNavigator = ({ currentDate, onDateChange, theme }) => {
//     const today = startOfToday();
//     const sevenDaysAgo = subDays(today, 7);
    
//     const canGoPrevious = isAfter(new Date(currentDate), sevenDaysAgo);
//     const canGoNext = isBefore(new Date(currentDate), today);
    
//     const handlePrevious = () => {
//         if (canGoPrevious) {
//             const newDate = subDays(new Date(currentDate), 1);
//             onDateChange(format(newDate, 'yyyy-MM-dd'));
//         }
//     };
    
//     const handleNext = () => {
//         if (canGoNext) {
//             const newDate = subDays(new Date(currentDate), -1);
//             onDateChange(format(newDate, 'yyyy-MM-dd'));
//         }
//     };
    
//     const handleToday = () => {
//         onDateChange(format(today, 'yyyy-MM-dd'));
//     };
    
//     // Format date as "Sunday, 3 May 2026" instead of "Today/Yesterday"
//     const formatDisplayDate = (dateString) => {
//         const date = new Date(dateString);
//         return format(date, 'EEEE, d MMMM yyyy');
//     };
    
//     return (
//         <View style={[styles.dayNavigator, { backgroundColor: theme.card }]}>
//             <TouchableOpacity onPress={handlePrevious} style={[styles.navButton, !canGoPrevious && styles.navButtonDisabled]} disabled={!canGoPrevious}>
//                 <Icon name="chevron-left" size={24} color={canGoPrevious ? theme.primary : theme.textSecondary} />
//             </TouchableOpacity>
            
//             <TouchableOpacity onPress={handleToday} style={styles.dateDisplay}>
//                 <Text style={[styles.dateDisplayText, { color: theme.text }]}>
//                     {formatDisplayDate(currentDate)}
//                 </Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity onPress={handleNext} style={[styles.navButton, !canGoNext && styles.navButtonDisabled]} disabled={!canGoNext}>
//                 <Icon name="chevron-right" size={24} color={canGoNext ? theme.primary : theme.textSecondary} />
//             </TouchableOpacity>
//         </View>
//     );
// };

// // ==================== MAIN SCREEN ====================
// const ChildDiaryScreen = ({ route, navigation }) => {
//     const theme = useSelector(selectThemeData);
//     const { childId, childName } = route.params;

//     const [refreshing, setRefreshing] = useState(false);
//     const [diaryEntries, setDiaryEntries] = useState([]);
//     const [filteredEntries, setFilteredEntries] = useState([]);
//     const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
//     const [selectedSubject, setSelectedSubject] = useState('All');
//     const [searchQuery, setSearchQuery] = useState('');
//     const [subjects, setSubjects] = useState([]);
//     const [isSearchFocused, setIsSearchFocused] = useState(false);
//     // CHANGED: Initialize expandedId as a Set to track multiple expanded items
//     const [expandedIds, setExpandedIds] = useState(new Set());
//     const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

//     const fadeAnim = useRef(new Animated.Value(0)).current;

//     const {
//         data: diaryResponse,
//         isLoading,
//         isFetching,
//         error,
//         refetch,
//     } = useGetChildDiaryQuery({
//         childId,
//         filters: {
//             date: selectedDate,
//             subjectId: selectedSubject !== 'All' ? selectedSubject : null,
//         },
//     });

//     useEffect(() => {
//         if (diaryResponse?.success === true && diaryResponse?.data?.entries) {
//             processDiaryData(diaryResponse.data.entries);
//             Animated.timing(fadeAnim, {
//                 toValue: 1,
//                 duration: 500,
//                 useNativeDriver: true,
//             }).start();
//         }
//     }, [diaryResponse]);

//     useEffect(() => {
//         filterEntries();
//     }, [searchQuery, selectedSubject, diaryEntries]);

//     const processDiaryData = (entries) => {
//         const transformedEntries = entries.map(entry => {
//             const dateObj = entry.date ? new Date(entry.date) : new Date();
//             const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//             const dayName = !isNaN(dateObj.getTime()) ? dayNames[dateObj.getDay()] : '';

//             return {
//                 id: entry.id,
//                 date: entry.date || '',
//                 day: dayName,
//                 subject: entry.subject || 'General',
//                 subjectId: entry.subjectId,
//                 content: entry.content || '',
//                 teacher: entry.teacher || 'Teacher',
//                 isPublished: entry.isPublished || false,
//                 createdAt: entry.createdAt,
//             };
//         });

//         const sortedEntries = transformedEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
        
//         const uniqueSubjects = [...new Map(sortedEntries.map(entry => [
//             entry.subjectId, { id: entry.subjectId, name: entry.subject }
//         ])).values()];
//         setSubjects(uniqueSubjects);
        
//         setDiaryEntries(sortedEntries);
//         setFilteredEntries(sortedEntries);
        
//         // CHANGED: Expand ALL entries by default - add all IDs to expandedIds Set
//         const allExpanded = new Set();
//         sortedEntries.forEach(entry => {
//             allExpanded.add(entry.id);
//         });
//         setExpandedIds(allExpanded);
//     };

//     const filterEntries = () => {
//         let filtered = [...diaryEntries];
//         if (searchQuery.trim()) {
//             const query = searchQuery.toLowerCase();
//             filtered = filtered.filter(entry =>
//                 entry.subject.toLowerCase().includes(query) ||
//                 entry.teacher.toLowerCase().includes(query) ||
//                 (entry.content && entry.content.toLowerCase().includes(query))
//             );
//         }
//         if (selectedSubject !== 'All') {
//             filtered = filtered.filter(entry => entry.subjectId === selectedSubject);
//         }
//         setFilteredEntries(filtered);
        
//         // CHANGED: Expand ALL filtered entries by default
//         const newExpanded = new Set();
//         filtered.forEach(entry => {
//             newExpanded.add(entry.id);
//         });
//         setExpandedIds(newExpanded);
//     };

//     const onRefresh = async () => {
//         setRefreshing(true);
//         await refetch();
//         setRefreshing(false);
//     };

//     const handleDateChange = (date) => {
//         LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//         setSelectedDate(date);
//         // Reset expanded IDs - will be set when data loads
//         setExpandedIds(new Set());
//     };

//     const handleResetFilters = () => {
//         LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//         setSelectedSubject('All');
//         setSearchQuery('');
//         setExpandedIds(new Set());
//     };

//     const handleToggleExpand = (id) => {
//         const newExpandedIds = new Set(expandedIds);
//         if (newExpandedIds.has(id)) {
//             newExpandedIds.delete(id);
//         } else {
//             newExpandedIds.add(id);
//         }
//         setExpandedIds(newExpandedIds);
//     };

//     const generatePDFHTML = () => {
//         const entriesHTML = filteredEntries.map(entry => `
//             <div style="margin-bottom: 30px; page-break-inside: avoid; border-bottom: 1px solid #e0e0e0; padding-bottom: 20px;">
//                 <h2 style="color: #2c3e50; margin-bottom: 10px; font-size: 20px;">${entry.subject}</h2>
//                 <div style="color: #7f8c8d; margin-bottom: 15px; font-size: 13px;">
//                     <div><strong>📅 Date:</strong> ${format(new Date(entry.date), 'EEEE, MMMM d, yyyy')}</div>
//                     <div><strong>👨‍🏫 Teacher:</strong> ${entry.teacher}</div>
//                 </div>
//                 <div style="margin-top: 15px; line-height: 1.6; font-size: 14px;">
//                     ${entry.content || '<p style="color: #999;">No content available</p>'}
//                 </div>
//             </div>
//         `).join('');

//         return `
//             <!DOCTYPE html>
//             <html>
//             <head>
//                 <meta charset="UTF-8">
//                 <meta name="viewport" content="width=device-width, initial-scale=1.0">
//                 <title>${childName}'s Diary - ${format(new Date(selectedDate), 'MMMM d, yyyy')}</title>
//                 <style>
//                     * { margin: 0; padding: 0; box-sizing: border-box; }
//                     body {
//                         font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
//                         padding: 40px;
//                         color: #333;
//                         line-height: 1.6;
//                         background-color: white;
//                     }
//                     .header {
//                         text-align: center;
//                         margin-bottom: 40px;
//                         padding-bottom: 20px;
//                         border-bottom: 3px solid #3498db;
//                     }
//                     .header h1 {
//                         color: #2c3e50;
//                         margin-bottom: 10px;
//                         font-size: 28px;
//                     }
//                     .header p {
//                         color: #7f8c8d;
//                         font-size: 14px;
//                     }
//                     .date-range {
//                         text-align: center;
//                         background-color: #f8f9fa;
//                         padding: 12px;
//                         border-radius: 8px;
//                         margin-bottom: 30px;
//                         font-size: 14px;
//                         border: 1px solid #e0e0e0;
//                     }
//                     img {
//                         max-width: 100%;
//                         height: auto;
//                         border-radius: 8px;
//                         margin: 10px 0;
//                     }
//                     .footer {
//                         margin-top: 50px;
//                         text-align: center;
//                         color: #95a5a6;
//                         font-size: 11px;
//                         border-top: 1px solid #e0e0e0;
//                         padding-top: 20px;
//                     }
//                     @media print {
//                         body { padding: 20px; }
//                     }
//                 </style>
//             </head>
//             <body>
//                 <div class="header">
//                     <h1>${childName}'s Learning Diary</h1>
//                     <p>School Activities & Progress Report</p>
//                 </div>
//                 <div class="date-range">
//                     <strong>📅 Date:</strong> ${format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}
//                 </div>
//                 ${entriesHTML}
//                 <div class="footer">
//                     Generated on ${format(new Date(), 'MMMM d, yyyy h:mm a')}
//                 </div>
//             </body>
//             </html>
//         `;
//     };

//     const shareDiaryAsPDF = async () => {
//         if (filteredEntries.length === 0) {
//             Alert.alert('No Entries', 'There are no diary entries to share for this day.');
//             return;
//         }

//         setIsGeneratingPDF(true);
        
//         try {
//             const htmlContent = generatePDFHTML();
//             const fileName = `${childName.replace(/\s/g, '_')}_Diary_${format(new Date(selectedDate), 'yyyy-MM-dd')}`;
            
//             const options = {
//                 html: htmlContent,
//                 fileName: fileName,
//                 directory: 'Documents',
//             };
            
//             const pdfFile = await RNHTMLtoPDF.convert(options);
            
//             if (pdfFile && pdfFile.filePath) {
//                 await Share.open({
//                     url: `file://${pdfFile.filePath}`,
//                     type: 'application/pdf',
//                     title: `${childName}' Diary`,
//                 });
//             } else {
//                 Alert.alert('Error', 'Failed to generate PDF');
//             }
//         } catch (error) {
//             console.error('PDF Error:', error);
//             Alert.alert('Error', 'Failed to generate or share PDF. Please try again.');
//         } finally {
//             setIsGeneratingPDF(false);
//         }
//     };

//     const renderSearchBar = () => (
//     <View style={styles.searchRow}>

//         <View
//             style={[
//                 styles.searchWrapper,
//                 isSearchFocused && styles.searchWrapperFocused,
//                 {
//                     flex: 1,
//                     marginHorizontal: 0,
//                     borderColor: theme.border,
//                     backgroundColor: theme.card,
//                 }
//             ]}
//         >
//             <Icon name="magnify" size={20} color={theme.textSecondary} />

//             <TextInput
//                 style={[styles.searchInput, { color: theme.text }]}
//                 placeholder="Search by subject or teacher..."
//                 placeholderTextColor={theme.textSecondary}
//                 value={searchQuery}
//                 onChangeText={setSearchQuery}
//                 onFocus={() => setIsSearchFocused(true)}
//                 onBlur={() => setIsSearchFocused(false)}
//             />

//             {searchQuery !== '' && (
//                 <TouchableOpacity onPress={() => setSearchQuery('')}>
//                     <Icon name="close-circle" size={20} color={theme.textSecondary} />
//                 </TouchableOpacity>
//             )}
//         </View>

//         <TouchableOpacity
//             onPress={shareDiaryAsPDF}
//             style={{ ...styles.shareButton , borderColor: theme.border, backgroundColor: theme.card,}}
//             disabled={isGeneratingPDF}
//         >
//             {isGeneratingPDF ? (
//                 <ActivityIndicator size="small" color={theme.primary} />
//             ) : (
//                 <Icon name="file-pdf-box" size={24} color="#e74c3c" />
//             )}
//         </TouchableOpacity>

//     </View>
// );

//     const renderFilters = () => (
//         <View style={styles.filtersSection}>
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
//                 <FilterChip label="All Subjects" isActive={selectedSubject === 'All'} onPress={() => setSelectedSubject('All')} theme={theme} />
//                 {subjects.map(subject => (
//                     <FilterChip key={subject.id} label={subject.name} isActive={selectedSubject === subject.id} onPress={() => setSelectedSubject(subject.id)} theme={theme} />
//                 ))}
//             </ScrollView>
//         </View>
//     );

//     const renderHeader = () => (
//       <></>
//     );

//     const renderContent = () => {
//         if (filteredEntries.length === 0) {
//             return renderEmptyState();
//         }
        
//         return (
//             <>
//                 {filteredEntries.map((item) => (
//                     <AccordionDiaryCard
//                         key={item.id}
//                         item={item}
//                         theme={theme}
//                         isExpanded={expandedIds.has(item.id)}
//                         onToggle={() => handleToggleExpand(item.id)}
//                     />
//                 ))}
//             </>
//         );
//     };

//     const renderEmptyState = () => (
//         <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
//             <View style={[styles.emptyIconContainer, { backgroundColor: theme.primary + '10' }]}>
//                 <Icon name="notebook-edit-outline" size={64} color={theme.primary} />
//             </View>
//             <Text style={[styles.emptyTitle, { color: theme.text }]}>
//                 {searchQuery || selectedSubject !== 'All' ? 'No matching entries' : 'No diary entries for this day'}
//             </Text>
//             <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
//                 {searchQuery || selectedSubject !== 'All'
//                     ? 'Try adjusting your filters to see more results'
//                     : `No diary entries found for ${format(new Date(selectedDate), 'EEEE, d MMMM yyyy')}`}
//             </Text>
//             {(searchQuery || selectedSubject !== 'All') && (
//                 <TouchableOpacity style={[styles.emptyButton, { backgroundColor: theme.primary }]} onPress={handleResetFilters}>
//                     <Text style={styles.emptyButtonText}>Clear Filters</Text>
//                 </TouchableOpacity>
//             )}
//         </Animated.View>
//     );

//     if (error) {
//         return (
//             <View style={[styles.container, { backgroundColor: theme.background }]}>
//                 {renderHeader()}
//                 <View style={styles.errorContainer}>
//                     <View style={[styles.errorIconContainer, { backgroundColor: theme.error + '10' }]}>
//                         <Icon name="wifi-off" size={60} color={theme.error} />
//                     </View>
//                     <Text style={[styles.errorText, { color: theme.text }]}>Connection Error</Text>
//                     <Text style={[styles.errorSubtext, { color: theme.textSecondary }]}>
//                         Unable to connect to the server. Please check your internet connection.
//                     </Text>
//                     <TouchableOpacity style={[styles.retryButton, { backgroundColor: theme.primary }]} onPress={() => refetch()}>
//                         <Text style={styles.retryButtonText}>Try Again</Text>
//                     </TouchableOpacity>
//                 </View>
//             </View>
//         );
//     }

//     return (
//         <View style={[styles.container, { backgroundColor: theme.background }]}>
//             {renderHeader()}
            
//             <ScrollView 
//                 style={styles.contentContainer}
//                 refreshControl={
//                     <RefreshControl 
//                         refreshing={refreshing} 
//                         onRefresh={onRefresh} 
//                         colors={[theme.primary]} 
//                         tintColor={theme.primary} 
//                     />
//                 }
//                 showsVerticalScrollIndicator={false}
//             >
//                 {renderSearchBar()}
//                 {renderFilters()}
                
//                 <DayNavigator currentDate={selectedDate} onDateChange={handleDateChange} theme={theme} />

//                 {(isLoading || isFetching) && !refreshing ? (
//                     <SkeletonLoader theme={theme} />
//                 ) : (
//                     <View style={styles.listContent}>
//                         {renderContent()}
//                     </View>
//                 )}
//             </ScrollView>
//         </View>
//     );
// };

// // ==================== STYLES ====================
// const styles = StyleSheet.create({
//     container: { flex: 1 },
//     headerContainer: {
//         paddingTop: Platform.OS === 'ios' ? 50 : 40,
//         paddingBottom: 16,
//         borderBottomWidth: 1,
//         elevation: 2,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.05,
//         shadowRadius: 4,
//     },
//     headerTop: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         paddingHorizontal: 16,
//     },
//     backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
//     headerTitle: { fontSize: 18, fontWeight: '600', flex: 1, textAlign: 'center' },
// shareButton: {
//     width: 46,
//     height: 46,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 12,
//     borderWidth: 1,
// },
//  contentContainer: { flex: 1 },
// searchWrapper: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     borderRadius: 12,
//     borderWidth: 1,
// },
//     searchWrapperFocused: { borderWidth: 2 },
//     searchInput: { flex: 1, fontSize: 16, marginLeft: 12, paddingVertical: 0 },
//     filtersSection: { marginBottom: 12 },
//     filtersScroll: { paddingHorizontal: 16 },
//     filterChip: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingHorizontal: 16,
//         paddingVertical: 8,
//         borderRadius: 24,
//         marginRight: 8,
//         gap: 6,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.05,
//         shadowRadius: 4,
//         elevation: 2,
//     },
//     filterChipActive: { shadowOpacity: 0.2, shadowRadius: 6 },
//     filterChipText: { fontSize: 14, fontWeight: '500' },
//     dayNavigator: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginHorizontal: 16,
//         marginBottom: 16,
//         paddingHorizontal: 16,
//         paddingVertical: 14,
//         borderRadius: 16,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.05,
//         shadowRadius: 4,
//         elevation: 2,
//     },
//     navButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20 },
//     navButtonDisabled: { opacity: 0.5 },
//     dateDisplay: { alignItems: 'center', flex: 1 },
//     dateDisplayText: { fontSize: 16, fontWeight: '600' },
//     dateDisplaySub: { fontSize: 12, marginTop: 2 },
//     listContent: { paddingHorizontal: 16, paddingBottom: 20 },
//     entryCard: { 
//         padding: 16, 
     
//         marginBottom: 12, 
//         shadowColor: '#000', 
//         shadowOffset: { width: 0, height: 4 }, 
//         shadowOpacity: 0.08, 
//         shadowRadius: 8, 
//         elevation: 4 
//     },
//     expandedCard: { shadowOpacity: 0.12, shadowRadius: 12 },
//     cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//     paddingVertical: 10,
//     paddingHorizontal: 12,
    
// },
//     headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//     dateSection: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//     dateBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 4 },
//     dateText: { fontSize: 12, fontWeight: '500' },
//     dayText: { fontSize: 12 },
//     subjectBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 10 },
//     subjectText: { fontSize: 25, fontWeight: '600' },
//     previewText: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
//     cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//     teacherSection: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//     teacherAvatar: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
//     teacherText: { fontSize: 12 },
//     statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 6 },
//     statusDot: { width: 6, height: 6, borderRadius: 3 },
//     statusText: { fontSize: 11, fontWeight: '600' },
//     expandedContent: { marginTop: 12 },
//     divider: { height: 1, marginBottom: 16 },
//     expandedDateSection: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
//     expandedDateText: { fontSize: 13, flex: 1 },
//     teacherInfo: { flex: 1 },
//     teacherLabel: { fontSize: 11, marginBottom: 2 },
//     teacherName: { fontSize: 14, fontWeight: '500' },
//     fullContentSection: { marginTop: 16 },
//     contentLabel: { fontSize: 15, fontWeight: '600', marginBottom: 12 },
//     skeletonContainer: { paddingHorizontal: 16 },
//     skeletonCard: { padding: 16, borderRadius: 20, marginBottom: 12 },
//     skeletonHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
//     skeletonDate: { width: 100, height: 24, borderRadius: 12 },
//     skeletonBadge: { width: 60, height: 24, borderRadius: 12 },
//     skeletonLine: { height: 16, borderRadius: 8, marginBottom: 8 },
//     skeletonFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 },
//     skeletonAvatar: { width: 28, height: 28, borderRadius: 14 },
//     skeletonText: { width: 100, height: 14, borderRadius: 7 },
//     emptyContainer: { alignItems: 'center', paddingVertical: 60 },
//     emptyIconContainer: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
//     emptyTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
//     emptySubtitle: { fontSize: 14, textAlign: 'center', paddingHorizontal: 40, marginBottom: 24 },
//     emptyButton: { paddingHorizontal: 32, paddingVertical: 12, borderRadius: 25 },
//     emptyButtonText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
//     errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
//     errorIconContainer: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
//     errorText: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
//     errorSubtext: { fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
//     retryButton: { paddingHorizontal: 32, paddingVertical: 12, borderRadius: 25 },
//     retryButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
//     searchRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     marginBottom: 16,
//     marginTop: 16,
//     gap: 10,

    
// },

// headerCenter: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
// },

// headerRight: {
//     width: 30,
//     alignItems: 'flex-end',
//     justifyContent: 'center',
// },


// });

// export default ChildDiaryScreen;

// src/screens/Parent/ChildDiaryScreen.js - WITH CROSS-TAB PDF FORMAT
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    TextInput,
    Dimensions,
    Animated,
    Platform,
    LayoutAnimation,
    UIManager,
    ScrollView,
    Alert
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AutoHeightWebView from 'react-native-autoheight-webview';
import { selectThemeData } from '../../store/slices/themeSlice';
import { useGetChildDiaryQuery, useGetChildProfileQuery } from '../../store/attendanceApi';
import { format, subDays, isAfter, isBefore, startOfToday } from 'date-fns';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ==================== STABLE AUTOHEIGHT WEBVIEW ====================
const StableWebView = React.memo(({ content, theme, isVisible }) => {
    const getHTMLContent = useCallback(() => {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                        font-size: 15px;
                        line-height: 1.6;
                        padding: 16px;
                        margin: 0;
                        color: ${theme.isDarkMode ? '#e0e0e0' : '#2c3e50'};
                        background-color: ${theme.isDarkMode ? '#121212' : '#ffffff'};
                    }
                    p { margin-bottom: 12px; line-height: 1.6; }
                    img { 
                        max-width: 100%; 
                        height: auto; 
                        border-radius: 12px; 
                        margin: 12px 0; 
                        display: block;
                    }
                    h1 { font-size: 24px; font-weight: bold; margin: 16px 0 12px 0; }
                    h2 { font-size: 20px; font-weight: bold; margin: 14px 0 10px 0; }
                    h3 { font-size: 18px; font-weight: bold; margin: 12px 0 8px 0; }
                    ul, ol { margin: 8px 0 12px 20px; }
                    li { margin-bottom: 6px; line-height: 1.5; }
                    a { color: ${theme.primary}; text-decoration: none; }
                    blockquote {
                        margin: 12px 0;
                        padding: 8px 16px;
                        border-left: 4px solid ${theme.primary};
                        background-color: ${theme.isDarkMode ? '#1e1e1e' : '#f5f5f5'};
                        border-radius: 8px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 12px 0;
                    }
                    th, td {
                        border: 1px solid ${theme.isDarkMode ? '#333' : '#ddd'};
                        padding: 8px;
                        text-align: left;
                    }
                    .content-wrapper {
                        width: 100%;
                        overflow-wrap: break-word;
                    }
                </style>
            </head>
            <body>
                <div class="content-wrapper">
                    ${content || '<p style="text-align:center;color:#999">No content available</p>'}
                </div>
            </body>
            </html>
        `;
    }, [content, theme, theme.isDarkMode, theme.primary]);
    
    if (!isVisible) {
        return <View style={{ height: 150 }} />;
    }
    
    return (
        <AutoHeightWebView
            source={{ html: getHTMLContent() }}
            style={{ 
                width: SCREEN_WIDTH - 32,
                marginVertical: 0,
            }}
            scrollEnabled={false}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={false}
            viewportContent={'width=device-width, user-scalable=no'}
            customStyle={`
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
                    font-size: 15px;
                    line-height: 1.6;
                    padding: 16px;
                    color: ${theme.isDarkMode ? '#e0e0e0' : '#2c3e50'};
                    background-color: ${theme.isDarkMode ? '#121212' : '#ffffff'};
                }
                img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 12px;
                    margin: 12px 0;
                }
            `}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
        />
    );
});

// ==================== SKELETON LOADER ====================
const SkeletonLoader = ({ theme }) => (
    <View style={styles.skeletonContainer}>
        {[1, 2, 3].map((item) => (
            <View key={item} style={[styles.skeletonCard, { backgroundColor: theme.card }]}>
                <View style={styles.skeletonHeader}>
                    <View style={[styles.skeletonDate, { backgroundColor: theme.border }]} />
                    <View style={[styles.skeletonBadge, { backgroundColor: theme.border }]} />
                </View>
                <View style={[styles.skeletonLine, { backgroundColor: theme.border }]} />
                <View style={[styles.skeletonLine, { backgroundColor: theme.border, width: '80%' }]} />
                <View style={styles.skeletonFooter}>
                    <View style={[styles.skeletonAvatar, { backgroundColor: theme.border }]} />
                    <View style={[styles.skeletonText, { backgroundColor: theme.border }]} />
                </View>
            </View>
        ))}
    </View>
);

// ==================== ACCORDION DIARY CARD ====================
const AccordionDiaryCard = ({ item, theme, isExpanded, onToggle }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    
    const getPlainText = (html) => {
        if (!html) return 'No preview available';
        return html.replace(/<[^>]*>/g, '').substring(0, 120);
    };

    const plainTextPreview = getPlainText(item.content);
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'MMM d, yyyy');
    };

    const formatFullDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'EEEE, MMMM d, yyyy');
    };

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.98,
            useNativeDriver: true,
            speed: 50,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            speed: 50,
        }).start();
    };

    const handlePress = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        onToggle();
    };

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
                activeOpacity={0.9}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={handlePress}
                style={[styles.entryCard, { backgroundColor: theme.card }, isExpanded && styles.expandedCard]}
            >
             <View style={{...styles.cardHeader,  backgroundColor: theme.primary }}>

    {/* Left spacer (for balance) */}
    <View style={{ width: 20 }} />

    {/* CENTER: Subject */}
    <View style={styles.headerCenter}>
        <View style={[styles.subjectBadge, { backgroundColor: theme.primary + '15' }]}>
            <Icon name="book-open-variant" size={25} color='#fff' />
            <Text style={[styles.subjectText, {  color: '#fff'}]}>
                {item.subject}
            </Text>
        </View>
    </View>

    {/* RIGHT: Chevron */}
    <TouchableOpacity style={styles.headerRight}>
        <Icon
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={22}
             color="#fff"
        />
    </TouchableOpacity>

</View>

                {!isExpanded && (
                    <Text style={[styles.previewText, { color: theme.text }]} numberOfLines={2}>
                        {plainTextPreview}
                    </Text>
                )}

                {isExpanded && (
                    <View style={styles.expandedContent}>
                        <View style={[styles.divider, { backgroundColor: theme.border }]} />
                        
                        <View style={styles.fullContentSection}>
                            <Text style={[styles.contentLabel, { color: theme.text }]}>📝 Diary</Text>
                            <StableWebView
                                content={item.content}
                                theme={theme}
                                isVisible={isExpanded}
                            />
                        </View>
                    </View>
                )}
            </TouchableOpacity>
        </Animated.View>
    );
};

// ==================== FILTER CHIP ====================
const FilterChip = ({ label, isActive, onPress, icon, theme }) => (
    <TouchableOpacity
        style={[styles.filterChip, { backgroundColor: isActive ? theme.primary : theme.card }, isActive && styles.filterChipActive]}
        onPress={onPress}
        activeOpacity={0.7}
    >
        {icon && <Icon name={icon} size={16} color={isActive ? '#FFF' : theme.textSecondary} />}
        <Text style={[styles.filterChipText, { color: isActive ? '#FFF' : theme.text }]}>{label}</Text>
    </TouchableOpacity>
);

// ==================== DAY NAVIGATOR ====================
const DayNavigator = ({ currentDate, onDateChange, theme }) => {
    const today = startOfToday();
    const sevenDaysAgo = subDays(today, 7);
    
    const canGoPrevious = isAfter(new Date(currentDate), sevenDaysAgo);
    const canGoNext = isBefore(new Date(currentDate), today);
    
    const handlePrevious = () => {
        if (canGoPrevious) {
            const newDate = subDays(new Date(currentDate), 1);
            onDateChange(format(newDate, 'yyyy-MM-dd'));
        }
    };
    
    const handleNext = () => {
        if (canGoNext) {
            const newDate = subDays(new Date(currentDate), -1);
            onDateChange(format(newDate, 'yyyy-MM-dd'));
        }
    };
    
    const handleToday = () => {
        onDateChange(format(today, 'yyyy-MM-dd'));
    };
    
    const formatDisplayDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'EEEE, d MMMM yyyy');
    };
    
    return (
        <View style={[styles.dayNavigator, { backgroundColor: theme.card }]}>
            <TouchableOpacity onPress={handlePrevious} style={[styles.navButton, !canGoPrevious && styles.navButtonDisabled]} disabled={!canGoPrevious}>
                <Icon name="chevron-left" size={24} color={canGoPrevious ? theme.primary : theme.textSecondary} />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleToday} style={styles.dateDisplay}>
                <Text style={[styles.dateDisplayText, { color: theme.text }]}>
                    {formatDisplayDate(currentDate)}
                </Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleNext} style={[styles.navButton, !canGoNext && styles.navButtonDisabled]} disabled={!canGoNext}>
                <Icon name="chevron-right" size={24} color={canGoNext ? theme.primary : theme.textSecondary} />
            </TouchableOpacity>
        </View>
    );
};

// ==================== MAIN SCREEN ====================
const ChildDiaryScreen = ({ route, navigation }) => {
    const theme = useSelector(selectThemeData);
    const { childId, childName, childClass, childSection } = route.params;

    const [refreshing, setRefreshing] = useState(false);
    const [diaryEntries, setDiaryEntries] = useState([]);
    const [filteredEntries, setFilteredEntries] = useState([]);
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [selectedSubject, setSelectedSubject] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [expandedIds, setExpandedIds] = useState(new Set());
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
// Add this with your other states
const [studentInfo, setStudentInfo] = useState({
    name: childName,
    className: childClass || 'N/A',
    sectionName: childSection || 'N/A'
});
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const {
        data: diaryResponse,
        isLoading,
        isFetching,
        error,
        refetch,
    } = useGetChildDiaryQuery({
        childId,
        filters: {
            date: selectedDate,
            subjectId: selectedSubject !== 'All' ? selectedSubject : null,
        },
    });
    console.log('Diary API Response:', diaryResponse?.data?.entries[0]);

  useEffect(() => {
    if (diaryResponse?.success === true && diaryResponse?.data?.entries) {
        // Add this line to update student info from API response
        if (diaryResponse.data) {
            setStudentInfo({
                name: diaryResponse.data.studentName || childName,
                className: diaryResponse.data.className || childClass || 'N/A',
                sectionName: diaryResponse.data.sectionName || childSection || 'N/A'
            });
        }
        processDiaryData(diaryResponse.data.entries);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }
}, [diaryResponse]);

    useEffect(() => {
        filterEntries();
    }, [searchQuery, selectedSubject, diaryEntries]);

    const processDiaryData = (entries) => {
        const transformedEntries = entries.map(entry => {
            const dateObj = entry.date ? new Date(entry.date) : new Date();
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const dayName = !isNaN(dateObj.getTime()) ? dayNames[dateObj.getDay()] : '';

            return {
                id: entry.id,
                date: entry.date || '',
                day: dayName,
                subject: entry.subject || 'General',
                subjectId: entry.subjectId,
                content: entry.content || '',
                teacher: entry.teacher || 'Teacher',
                isPublished: entry.isPublished || false,
                createdAt: entry.createdAt,
            };
        });

        const sortedEntries = transformedEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        const uniqueSubjects = [...new Map(sortedEntries.map(entry => [
            entry.subjectId, { id: entry.subjectId, name: entry.subject }
        ])).values()];
        setSubjects(uniqueSubjects);
        
        setDiaryEntries(sortedEntries);
        setFilteredEntries(sortedEntries);
        
        const allExpanded = new Set();
        sortedEntries.forEach(entry => {
            allExpanded.add(entry.id);
        });
        setExpandedIds(allExpanded);
    };

    const filterEntries = () => {
        let filtered = [...diaryEntries];
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(entry =>
                entry.subject.toLowerCase().includes(query) ||
                entry.teacher.toLowerCase().includes(query) ||
                (entry.content && entry.content.toLowerCase().includes(query))
            );
        }
        if (selectedSubject !== 'All') {
            filtered = filtered.filter(entry => entry.subjectId === selectedSubject);
        }
        setFilteredEntries(filtered);
        
        const newExpanded = new Set();
        filtered.forEach(entry => {
            newExpanded.add(entry.id);
        });
        setExpandedIds(newExpanded);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    const handleDateChange = (date) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setSelectedDate(date);
        setExpandedIds(new Set());
    };

    const handleResetFilters = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setSelectedSubject('All');
        setSearchQuery('');
        setExpandedIds(new Set());
    };

    const handleToggleExpand = (id) => {
        const newExpandedIds = new Set(expandedIds);
        if (newExpandedIds.has(id)) {
            newExpandedIds.delete(id);
        } else {
            newExpandedIds.add(id);
        }
        setExpandedIds(newExpandedIds);
    };

    // NEW: Generate cross-tab PDF HTML with student details and table format
    // const generateCrossTabPDFHTML = () => {
    //     // Group entries by subject and get content
    //     const subjectMap = new Map();
    //     filteredEntries.forEach(entry => {
    //         subjectMap.set(entry.subject, entry.content || 'No content available');
    //     });

    //     // Get unique subjects in order
    //     const subjectList = Array.from(subjectMap.keys());
        
    //     // Generate table rows with content below each subject
    //     let tableRows = '';
        
    //     // Header row with subjects
    //     tableRows += '<tr style="background-color: #3498db;">';
    //     subjectList.forEach(subject => {
    //         tableRows += `<th style="border: 1px solid #ddd; padding: 12px; text-align: center; font-weight: bold; color: white; font-size: 14px;">${subject}</th>`;
    //     });
    //     tableRows += '</tr>';
        
    //     // Content row
    //     tableRows += '<tr>';
    //     subjectList.forEach(subject => {
    //         const content = subjectMap.get(subject);
    //         // Strip HTML tags and truncate if needed
    //         const plainContent = content.replace(/<[^>]*>/g, '');
    //         tableRows += `<td style="border: 1px solid #ddd; padding: 12px; vertical-align: top; line-height: 1.5; font-size: 12px;">${plainContent.substring(0, 500)}${plainContent.length > 500 ? '...' : ''}</td>`;
    //     });
    //     tableRows += '</tr>';

    //     return `
    //         <!DOCTYPE html>
    //         <html>
    //         <head>
    //             <meta charset="UTF-8">
    //             <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //             <title>${childName}'s Diary - ${format(new Date(selectedDate), 'MMMM d, yyyy')}</title>
    //             <style>
    //                 * { margin: 0; padding: 0; box-sizing: border-box; }
    //                 body {
    //                     font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    //                     padding: 40px;
    //                     color: #333;
    //                     line-height: 1.6;
    //                     background-color: white;
    //                 }
    //                 .main-title {
    //                     text-align: center;
    //                     font-size: 24px;
    //                     font-weight: bold;
    //                     color: #2c3e50;
    //                     margin-bottom: 10px;
    //                 }
    //                 .subtitle {
    //                     text-align: center;
    //                     color: #7f8c8d;
    //                     font-size: 14px;
    //                     margin-bottom: 30px;
    //                     padding-bottom: 20px;
    //                     border-bottom: 2px solid #3498db;
    //                 }
    //                 .student-info {
    //                     background-color: #f8f9fa;
    //                     padding: 20px;
    //                     border-radius: 10px;
    //                     margin-bottom: 30px;
    //                     text-align: center;
    //                     border: 1px solid #e0e0e0;
    //                 }
    //                 .student-name {
    //                     font-size: 22px;
    //                     font-weight: bold;
    //                     color: #2c3e50;
    //                     margin-bottom: 15px;
    //                 }
    //                 .info-grid {
    //                     display: flex;
    //                     justify-content: center;
    //                     gap: 30px;
    //                     flex-wrap: wrap;
    //                 }
    //                 .info-item {
    //                     display: inline-block;
    //                     padding: 5px 15px;
    //                     background-color: #e8f4f8;
    //                     border-radius: 20px;
    //                 }
    //                 .info-label {
    //                     font-weight: bold;
    //                     color: #3498db;
    //                 }
    //                 .info-value {
    //                     color: #2c3e50;
    //                     margin-left: 5px;
    //                 }
    //                 .date-info {
    //                     margin-top: 15px;
    //                     padding: 8px;
    //                     background-color: #e8f4f8;
    //                     border-radius: 20px;
    //                     display: inline-block;
    //                 }
    //                 .subject-table {
    //                     width: 100%;
    //                     border-collapse: collapse;
    //                     margin-top: 20px;
    //                     border: 1px solid #ddd;
    //                 }
    //                 .footer {
    //                     margin-top: 40px;
    //                     text-align: center;
    //                     color: #95a5a6;
    //                     font-size: 11px;
    //                     border-top: 1px solid #e0e0e0;
    //                     padding-top: 20px;
    //                 }
    //                 @media print {
    //                     body { padding: 20px; }
    //                     .student-info { 
    //                         background-color: #f8f9fa;
    //                         -webkit-print-color-adjust: exact;
    //                         print-color-adjust: exact;
    //                     }
    //                     .subject-table th {
    //                         background-color: #3498db !important;
    //                         -webkit-print-color-adjust: exact;
    //                         print-color-adjust: exact;
    //                     }
    //                 }
    //             </style>
    //         </head>
    //         <body>
    //             <div class="main-title">Learning Diary Report</div>
    //             <div class="subtitle">School Activities & Progress Report</div>
                
    //             <div class="student-info">
    //                 <div class="student-name">${childName}</div>
    //                 <div class="info-grid">
    //                     <div class="info-item">
    //                         <span class="info-label">📚 Class:</span>
    //                         <span class="info-value">${childClass || 'N/A'}</span>
    //                     </div>
    //                     <div class="info-item">
    //                         <span class="info-label">📖 Section:</span>
    //                         <span class="info-value">${childSection || 'N/A'}</span>
    //                     </div>
    //                     <div class="info-item">
    //                         <span class="info-label">📅 Date:</span>
    //                         <span class="info-value">${format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}</span>
    //                     </div>
    //                 </div>
    //             </div>

    //             <table class="subject-table">
    //                 ${tableRows}
    //             </table>

    //             <div class="footer">
    //                 Generated on ${format(new Date(), 'MMMM d, yyyy h:mm a')}
    //             </div>
    //         </body>
    //         </html>
    //     `;
    // };

//   const generateCrossTabPDFHTML = () => {

//     const subjectMap = new Map();

//     filteredEntries.forEach(entry => {
//         subjectMap.set(entry.subject, entry.content || 'No content available');
//     });

//     const subjectList = Array.from(subjectMap.keys());
//     const columnCount = subjectList.length || 1;
//     const columnWidth = `${100 / columnCount}%`;

//     const studentName = studentInfo?.name || childName || 'Student';
//     const studentClass = studentInfo?.className || childClass || 'N/A';
//     const studentSection = studentInfo?.sectionName || childSection || 'N/A';

//     let tableHeader = `
//         <tr>
//             ${subjectList.map(subject => `
//                 <th style="
//                     width:${columnWidth};
//                     background:#2c3e50;
//                     color:#fff;
//                     padding:12px;
//                     font-size:14px;
//                     text-align:center;
//                     border:1px solid #ddd;
//                     text-transform:capitalize;
//                 ">
//                     ${subject}
//                 </th>
//             `).join('')}
//         </tr>
//     `;

//     let tableRow = `
//         <tr>
//             ${subjectList.map(subject => {

//                 let content = subjectMap.get(subject) || '';

//                 // clean HTML
//                 content = content.replace(/<[^>]*>/g, '');
//                 content = content.replace(/\s+/g, ' ').trim();

//                 // safer truncation
//                 if (content.length > 2000) {
//                     content = content.substring(0, 2000) + '...';
//                 }

//                 return `
//                     <td style="
//                         width:${columnWidth};
//                         vertical-align:top;
//                         padding:12px;
//                         font-size:13px;
//                         line-height:1.5;
//                         border:1px solid #e0e0e0;
//                         word-wrap:break-word;
//                         overflow-wrap:break-word;
//                         background:#fff;
//                     ">
//                         ${content || '<em style="color:#999;">No content</em>'}
//                     </td>
//                 `;
//             }).join('')}
//         </tr>
//     `;

//     return `
//     <!DOCTYPE html>
//     <html>
//     <head>
//         <meta charset="UTF-8" />
//         <style>

//             @page {
//                 size: A4 landscape;
//                 margin: 15mm;
//             }

//             body {
//                 font-family: Arial, sans-serif;
//                 background: #fff;
//                 color: #333;
//                 padding: 20px;
//             }

//             .title {
//                 text-align:center;
//                 font-size:24px;
//                 font-weight:bold;
//                 color:#2c3e50;
//                 margin-bottom:5px;
//             }

//             .subtitle {
//                 text-align:center;
//                 font-size:13px;
//                 color:#7f8c8d;
//                 margin-bottom:20px;
//                 padding-bottom:10px;
//                 border-bottom:2px solid #3498db;
//             }

//             .student-card {
//                 background: linear-gradient(135deg,#3498db,#8e44ad);
//                 color:white;
//                 padding:18px;
//                 border-radius:12px;
//                 text-align:center;
//                 margin-bottom:20px;
//             }

//             .student-name {
//                 font-size:20px;
//                 font-weight:bold;
//                 margin-bottom:8px;
//             }

//             .student-meta {
//                 font-size:13px;
//                 opacity:0.95;
//             }

//             table {
//                 width:100%;
//                 border-collapse:collapse;
//                 table-layout:fixed;
//                 margin-top:10px;
//                 page-break-inside:auto;
//             }

//             tr {
//                 page-break-inside:avoid;
//                 page-break-after:auto;
//             }

//             th, td {
//                 word-break:break-word;
//                 overflow-wrap:break-word;
//             }

//             .footer {
//                 margin-top:25px;
//                 text-align:center;
//                 font-size:11px;
//                 color:#999;
//                 border-top:1px solid #ddd;
//                 padding-top:10px;
//             }

//         </style>
//     </head>

//     <body>



//         <div class="student-card">
//             <div class="student-name">${studentName}</div>
//             <div class="student-meta">
//                 Class: ${studentClass} | Section: ${studentSection} | Date: ${format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}
//             </div>
//         </div>
//         <div class="subtitle"></div>

//         ${subjectList.length > 0 ? `
//         <table>
//             ${tableHeader}
//             ${tableRow}
//         </table>
//         ` : `
//             <p style="text-align:center;color:#999;margin-top:40px;">
//                 No diary entries available for this date.
//             </p>
//         `}

//         <div class="footer">
//             Generated on ${format(new Date(), 'dd MMM yyyy hh:mm a')}
//         </div>

//     </body>
//     </html>
//     `;
// };

// const generateCrossTabPDFHTML = () => {

//     const subjectMap = new Map();

//     filteredEntries.forEach(entry => {
//         subjectMap.set(entry.subject, entry.content || 'No content available');
//     });

//     const subjectList = Array.from(subjectMap.keys());
//     const columnCount = subjectList.length || 1;
//     const columnWidth = `${100 / columnCount}%`;

//     const studentName = studentInfo?.name || childName || 'Student';
//     const studentClass = studentInfo?.className || childClass || 'N/A';
//     const studentSection = studentInfo?.sectionName || childSection || 'N/A';

//     const tableHeader = `
//         <tr>
//             ${subjectList.map(subject => `
//                 <th style="
//                     width:${columnWidth};
//                     background:#1f2d3d;
//                     color:#fff;
//                     padding:10px;
//                     font-size:13px;
//                     text-align:center;
//                     border:1px solid #ddd;
//                     text-transform:capitalize;
//                 ">
//                     ${subject}
//                 </th>
//             `).join('')}
//         </tr>
//     `;

//     const tableRow = `
//         <tr>
//             ${subjectList.map(subject => {

//                 let content = subjectMap.get(subject) || '';

//                 content = content.replace(/<[^>]*>/g, '');
//                 content = content.replace(/\s+/g, ' ').trim();

//                 if (content.length > 1800) {
//                     content = content.substring(0, 1800) + '...';
//                 }

//                 return `
//                     <td style="
//                         width:${columnWidth};
//                         vertical-align:top;
//                         padding:10px;
//                         font-size:12px;
//                         line-height:1.4;
//                         border:1px solid #e0e0e0;
//                         word-break:break-word;
//                         background:#fff;
//                     ">
//                         ${content || '<span style="color:#999;">No content</span>'}
//                     </td>
//                 `;
//             }).join('')}
//         </tr>
//     `;

//     return `
//     <!DOCTYPE html>
//     <html>
//     <head>
//         <meta charset="UTF-8" />

//         <style>

//             @page {
//                 size: A4 landscape;
//                 margin: 12mm;
//             }

//             body {
//                 font-family: Arial, sans-serif;
//                 margin: 0;
//                 padding: 0;
//                 color: #333;
//             }

//             /* FIX 1: NO BIG SPACING BEFORE HEADER */
//             .wrapper {
//                 padding: 10px 10px 0 10px;
//             }

//             .title {
//                 text-align:center;
//                 font-size:20px;
//                 font-weight:bold;
//                 color:#2c3e50;
//                 margin: 0 0 5px 0;
//             }

//             .subtitle {
//                 text-align:center;
//                 font-size:12px;
//                 color:#7f8c8d;
//                 margin-bottom:10px;
//             }

//             /* FIX 2: Compact header */
//             .student-card {
//                 background: linear-gradient(135deg,#2c3e50,#3498db);
//                 color:white;
//                 padding:12px;
//                 border-radius:8px;
//                 text-align:center;
//                 margin-bottom:10px;
//             }

//             .student-name {
//                 font-size:25px;
//                 font-weight:bold;
//                 margin-bottom:5px;
//             }

//             .student-meta {
//                 font-size:12px;
//                 opacity:0.95;
//             }

//             /* FIX 3: REMOVE TABLE GAP */
//             table {
//                 width:100%;
//                 border-collapse:collapse;
//                 table-layout:fixed;
//                 margin-top:0;
//             }

//             tr {
//                 page-break-inside: avoid;
//             }

//             th, td {
//                 word-wrap: break-word;
//                 overflow-wrap: break-word;
//             }

//             .footer {
//                 margin-top:15px;
//                 text-align:center;
//                 font-size:10px;
//                 color:#999;
//             }

//         </style>
//     </head>

//     <body>

//     <div class="wrapper">


//         <div class="student-card">
//             <div class="student-name">${studentName}</div>
//             <div class="student-meta">
//     <p>
//         Class: ${studentClass}
//         <span style="margin-left:40px;">Section: ${studentSection}</span>
//     </p>
//     <p>Date: ${format(new Date(selectedDate), 'EEEE,d MMMM, yyyy')}</p> 
// </div>
//         </div>

//         ${subjectList.length > 0 ? `
//         <table>
//             ${tableHeader}
//             ${tableRow}
//         </table>
//         ` : `
//             <p style="text-align:center;color:#999;margin-top:30px;">
//                 No diary entries available for this date.
//             </p>
//         `}

//         <div class="footer">
//             Generated on ${format(new Date(), 'dd MMM yyyy hh:mm a')}
//         </div>

//     </div>

//     </body>
//     </html>
//     `;
// };


// const generateCrossTabPDFHTML = () => {

//     const subjectMap = new Map();

//     filteredEntries.forEach(entry => {
//         subjectMap.set(entry.subject, entry.content || 'No content available');
//     });

//     const subjectList = Array.from(subjectMap.keys());

//     const studentName = studentInfo?.name || childName || 'Student';
//     const studentClass = studentInfo?.className || childClass || 'N/A';
//     const studentSection = studentInfo?.sectionName || childSection || 'N/A';

//     // ✅ STEP 1: Chunk subjects into groups of 3
//     const chunkSize = 3;
//     const subjectChunks = [];

//     for (let i = 0; i < subjectList.length; i += chunkSize) {
//         subjectChunks.push(subjectList.slice(i, i + chunkSize));
//     }

//     // ✅ STEP 2: Generate tables per chunk
//     const tablesHTML = subjectChunks.map((chunk, index) => {

//         const columnWidth = `${100 / chunk.length}%`;

//         const header = `
//             <tr>
//                 ${chunk.map(subject => `
//                     <th style="
//                         width:${columnWidth};
//                         background:#1f2d3d;
//                         color:#fff;
//                         padding:10px;
//                         font-size:13px;
//                         text-align:center;
//                         border:1px solid #ddd;
//                     ">
//                         ${subject}
//                     </th>
//                 `).join('')}
//             </tr>
//         `;

//         const row = `
//             <tr>
//                 ${chunk.map(subject => {

//                     let content = subjectMap.get(subject) || '';

                   


//                     return `
//                         <td style="
//                             width:${columnWidth};
//                             vertical-align:top;
//                             padding:10px;
//                             font-size:12px;
//                             line-height:1.4;
//                             border:1px solid #e0e0e0;
//                             word-break:break-word;
//                         ">
//                             ${content || '<span style="color:#999;">No content</span>'}
//                         </td>
//                     `;
//                 }).join('')}
//             </tr>
//         `;

//         return `
//             <div class="table-wrapper" ${index !== subjectChunks.length - 1 ? 'style="page-break-after: always;"' : ''}>
//                 <table>
//                     ${header}
//                     ${row}
//                 </table>
//             </div>
//         `;
//     }).join('');

//     return `
//     <!DOCTYPE html>
//     <html>
//     <head>
//         <meta charset="UTF-8" />

//         <style>

//             @page {
//                 size: A4 landscape;
//                 margin: 12mm;
//             }

//             body {
//                 font-family: Arial, sans-serif;
//                 margin: 0;
//                 padding: 0;
//                 color: #333;
//             }

//             .wrapper {
//                 padding: 10px;
//             }

//             .student-card {
//                 background: linear-gradient(135deg,#2c3e50,#3498db);
//                 color:white;
//                 padding:12px;
//                 border-radius:8px;
//                 text-align:center;
//                 margin-bottom:10px;
//             }

//             .student-name {
//                 font-size:22px;
//                 font-weight:bold;
//                 margin-bottom:5px;
//             }

//             .student-meta {
//                 font-size:12px;
//             }

//             table {
//                 width:100%;
//                 border-collapse:collapse;
//                 table-layout:fixed;
//             }

//             th, td {
//                 word-break:break-word;
//             }

//             .table-wrapper {
//                 margin-top:10px;
//             }

//             .footer {
//                 margin-top:15px;
//                 text-align:center;
//                 font-size:10px;
//                 color:#999;
//             }

//         </style>
//     </head>

//     <body>

//     <div class="wrapper">

//         <div class="student-card">
//             <div class="student-name">${studentName}</div>
//             <div class="student-meta">
//                 <p>
//                     Class: ${studentClass}
//                     <span style="margin-left:40px;">Section: ${studentSection}</span>
//                 </p>
//                 <p>Date: ${format(new Date(selectedDate), 'EEEE, d MMMM yyyy')}</p>
//             </div>
//         </div>

//         ${subjectList.length > 0 ? tablesHTML : `
//             <p style="text-align:center;color:#999;margin-top:30px;">
//                 No diary entries available for this date.
//             </p>
//         `}

//         <div class="footer">
//             Generated on ${format(new Date(), 'dd MMM yyyy hh:mm a')}
//         </div>

//     </div>

//     </body>
//     </html>
//     `;
// };
const generateCrossTabPDFHTML = () => {

    const subjectMap = new Map();

    filteredEntries.forEach(entry => {
        subjectMap.set(entry.subject, entry.content || 'No content available');
    });

    const subjectList = Array.from(subjectMap.keys());

    const studentName = studentInfo?.name || childName || 'Student';
    const studentClass = studentInfo?.className || childClass || 'N/A';
    const studentSection = studentInfo?.sectionName || childSection || 'N/A';

    const tableRows = subjectList.map(subject => {
        let content = subjectMap.get(subject) || '';

        return `
            <tr>
                <td class="subject-cell">${subject}</td>
                <td class="content-cell">
                    ${content || '<span class="empty">No content</span>'}
                </td>
            </tr>
        `;
    }).join('');

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8" />

        <style>

            @page {
                size: A4 portrait;
                margin: 10mm;
            }

            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                font-size: 12px;
                color: #333;
            }

            .wrapper {
                padding: 5px;
            }

            /* 🔥 BEAUTIFUL HEADER (RESTORED) */
            .student-card {
                background: linear-gradient(135deg,#3498db,#8e44ad);
                color:white;
                padding:10px;
                border-radius:8px;
                text-align:center;
                margin-bottom:8px;
            }

            .student-name {
                font-size:18px;
                font-weight:bold;
                margin-bottom:4px;
            }

            .student-meta {
                font-size:11px;
            }

            .student-meta p {
                margin: 2px 0;
            }

            /* 🔥 TABLE */
            table {
                width:100%;
                border-collapse:collapse;
                table-layout:fixed;
            }

            th {
                background:#2c3e50;
                color:white;
                padding:8px;
                font-size:12px;
                text-align:left;
                border:1px solid #ddd;
            }

            td {
                border:1px solid #e0e0e0;
                padding:8px;
                vertical-align:top;
                font-size:11px;
                line-height:1.5;
            }

            /* 🔥 MORE SPACE TO CONTENT */
            .subject-cell {
                width:18%;
                font-weight:bold;
                background:#f4f6f8;
            }

            .content-cell {
                width:82%;
                word-break:break-word;
            }

            tr {
                page-break-inside: auto;
            }

            .empty {
                color:#999;
                font-style:italic;
            }

            .footer {
                margin-top:10px;
                text-align:center;
                font-size:10px;
                color:#999;
                border-top:1px solid #eee;
                padding-top:5px;
            }

        </style>
    </head>

    <body>

    <div class="wrapper">

        <div class="student-card">
            <div class="student-name">${"Diary For "+studentName}</div>
            <div class="student-meta">
                <p>
                    Class: ${studentClass}
                    <span style="margin-left:25px;">Section: ${studentSection}</span>
                </p>
                <p>${format(new Date(selectedDate), 'EEEE, d MMM yyyy')}</p>
            </div>
        </div>

        ${subjectList.length > 0 ? `
        <table>
            <thead>
                <tr>
                    <th style="width:18%">Subject</th>
                    <th style="width:82%">Diary Content</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>
        ` : `
            <p style="text-align:center;color:#999;margin-top:20px;">
                No diary entries available
            </p>
        `}

        <div class="footer">
            Generated on ${format(new Date(), 'dd MMM yyyy hh:mm a')}
        </div>

    </div>

    </body>
    </html>
    `;
};
    const shareDiaryAsPDF = async () => {
        if (filteredEntries.length === 0) {
            Alert.alert('No Entries', 'There are no diary entries to share for this day.');
            return;
        }

        setIsGeneratingPDF(true);
        
        try {
            // Use the new cross-tab PDF format
            const htmlContent = generateCrossTabPDFHTML();
            const fileName = `${childName.replace(/\s/g, '_')}_Diary_${format(new Date(selectedDate), 'yyyy-MM-dd')}`;
            
            const options = {
                html: htmlContent,
                fileName: fileName,
                directory: 'Documents',
            };
            
            const pdfFile = await RNHTMLtoPDF.convert(options);
            
            if (pdfFile && pdfFile.filePath) {
                await Share.open({
                    url: `file://${pdfFile.filePath}`,
                    type: 'application/pdf',
                    title: `${childName}'s Diary`,
                });
            } else {
                Alert.alert('Error', 'Failed to generate PDF');
            }
        } catch (error) {
            console.error('PDF Error:', error);
            Alert.alert('Error', 'Failed to generate or share PDF. Please try again.');
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    const renderSearchBar = () => (
        <View style={styles.searchRow}>
            <View
                style={[
                    styles.searchWrapper,
                    isSearchFocused && styles.searchWrapperFocused,
                    {
                        flex: 1,
                        marginHorizontal: 0,
                        borderColor: theme.border,
                        backgroundColor: theme.card,
                    }
                ]}
            >
                <Icon name="magnify" size={20} color={theme.textSecondary} />
                <TextInput
                    style={[styles.searchInput, { color: theme.text }]}
                    placeholder="Search by subject or teacher..."
                    placeholderTextColor={theme.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                />
                {searchQuery !== '' && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Icon name="close-circle" size={20} color={theme.textSecondary} />
                    </TouchableOpacity>
                )}
            </View>

            <TouchableOpacity
                onPress={shareDiaryAsPDF}
                style={{ ...styles.shareButton, borderColor: theme.border, backgroundColor: theme.card }}
                disabled={isGeneratingPDF}
            >
                {isGeneratingPDF ? (
                    <ActivityIndicator size="small" color={theme.primary} />
                ) : (
                    <Icon name="file-pdf-box" size={24} color="#e74c3c" />
                )}
            </TouchableOpacity>
        </View>
    );

    const renderFilters = () => (
        <View style={styles.filtersSection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
                <FilterChip label="All Subjects" isActive={selectedSubject === 'All'} onPress={() => setSelectedSubject('All')} theme={theme} />
                {subjects.map(subject => (
                    <FilterChip key={subject.id} label={subject.name} isActive={selectedSubject === subject.id} onPress={() => setSelectedSubject(subject.id)} theme={theme} />
                ))}
            </ScrollView>
        </View>
    );

    const renderHeader = () => <></>;

    const renderContent = () => {
        if (filteredEntries.length === 0) {
            return renderEmptyState();
        }
        
        return (
            <>
                {filteredEntries.map((item) => (
                    <AccordionDiaryCard
                        key={item.id}
                        item={item}
                        theme={theme}
                        isExpanded={expandedIds.has(item.id)}
                        onToggle={() => handleToggleExpand(item.id)}
                    />
                ))}
            </>
        );
    };

    const renderEmptyState = () => (
        <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
            <View style={[styles.emptyIconContainer, { backgroundColor: theme.primary + '10' }]}>
                <Icon name="notebook-edit-outline" size={64} color={theme.primary} />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
                {searchQuery || selectedSubject !== 'All' ? 'No matching entries' : 'No diary entries for this day'}
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                {searchQuery || selectedSubject !== 'All'
                    ? 'Try adjusting your filters to see more results'
                    : `No diary entries found for ${format(new Date(selectedDate), 'EEEE, d MMMM yyyy')}`}
            </Text>
            {(searchQuery || selectedSubject !== 'All') && (
                <TouchableOpacity style={[styles.emptyButton, { backgroundColor: theme.primary }]} onPress={handleResetFilters}>
                    <Text style={styles.emptyButtonText}>Clear Filters</Text>
                </TouchableOpacity>
            )}
        </Animated.View>
    );

    if (error) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                {renderHeader()}
                <View style={styles.errorContainer}>
                    <View style={[styles.errorIconContainer, { backgroundColor: theme.error + '10' }]}>
                        <Icon name="wifi-off" size={60} color={theme.error} />
                    </View>
                    <Text style={[styles.errorText, { color: theme.text }]}>Connection Error</Text>
                    <Text style={[styles.errorSubtext, { color: theme.textSecondary }]}>
                        Unable to connect to the server. Please check your internet connection.
                    </Text>
                    <TouchableOpacity style={[styles.retryButton, { backgroundColor: theme.primary }]} onPress={() => refetch()}>
                        <Text style={styles.retryButtonText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {renderHeader()}
            
            <ScrollView 
                style={styles.contentContainer}
                refreshControl={
                    <RefreshControl 
                        refreshing={refreshing} 
                        onRefresh={onRefresh} 
                        colors={[theme.primary]} 
                        tintColor={theme.primary} 
                    />
                }
                showsVerticalScrollIndicator={false}
            >
                {renderSearchBar()}
                {renderFilters()}
                
                <DayNavigator currentDate={selectedDate} onDateChange={handleDateChange} theme={theme} />

                {(isLoading || isFetching) && !refreshing ? (
                    <SkeletonLoader theme={theme} />
                ) : (
                    <View style={styles.listContent}>
                        {renderContent()}
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

// ==================== STYLES ====================
const styles = StyleSheet.create({
    container: { flex: 1 },
    contentContainer: { flex: 1 },
    shareButton: {
        width: 46,
        height: 46,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
    },
    searchWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
    },
    searchWrapperFocused: { borderWidth: 2 },
    searchInput: { flex: 1, fontSize: 16, marginLeft: 12, paddingVertical: 0 },
    filtersSection: { marginBottom: 12 },
    filtersScroll: { paddingHorizontal: 16 },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 24,
        marginRight: 8,
        gap: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    filterChipActive: { shadowOpacity: 0.2, shadowRadius: 6 },
    filterChipText: { fontSize: 14, fontWeight: '500' },
    dayNavigator: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    navButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20 },
    navButtonDisabled: { opacity: 0.5 },
    dateDisplay: { alignItems: 'center', flex: 1 },
    dateDisplayText: { fontSize: 14, fontWeight: '600' },
    listContent: { paddingHorizontal: 16, paddingBottom: 20 },
    entryCard: { 
        padding: 16, 
        marginBottom: 12, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 4 }, 
        shadowOpacity: 0.08, 
        shadowRadius: 8, 
        elevation: 4 
    },
    expandedCard: { shadowOpacity: 0.12, shadowRadius: 12 },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 12,
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerRight: {
        width: 30,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    subjectBadge: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 10, 
        paddingVertical: 4, 
        borderRadius: 12, 
        gap: 10 
    },
    subjectText: { fontSize: 18, fontWeight: '600' },
    previewText: { fontSize: 14, lineHeight: 20, marginBottom: 12, marginTop: 8 },
    expandedContent: { marginTop: 12 },
    divider: { height: 1, marginBottom: 16 },
    fullContentSection: { marginTop: 8 },
    contentLabel: { fontSize: 15, fontWeight: '600', marginBottom: 12 },
    skeletonContainer: { paddingHorizontal: 16 },
    skeletonCard: { padding: 16, borderRadius: 20, marginBottom: 12 },
    skeletonHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    skeletonDate: { width: 100, height: 24, borderRadius: 12 },
    skeletonBadge: { width: 60, height: 24, borderRadius: 12 },
    skeletonLine: { height: 16, borderRadius: 8, marginBottom: 8 },
    skeletonFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 },
    skeletonAvatar: { width: 28, height: 28, borderRadius: 14 },
    skeletonText: { width: 100, height: 14, borderRadius: 7 },
    emptyContainer: { alignItems: 'center', paddingVertical: 60 },
    emptyIconContainer: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
    emptyTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
    emptySubtitle: { fontSize: 14, textAlign: 'center', paddingHorizontal: 40, marginBottom: 24 },
    emptyButton: { paddingHorizontal: 32, paddingVertical: 12, borderRadius: 25 },
    emptyButtonText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    errorIconContainer: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
    errorText: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
    errorSubtext: { fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
    retryButton: { paddingHorizontal: 32, paddingVertical: 12, borderRadius: 25 },
    retryButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 16,
        marginTop: 16,
        gap: 10,
    },
});

export default ChildDiaryScreen;