// // // import React, { useState, useCallback, useRef } from 'react';
// // // import {
// // //     View,
// // //     Text,
// // //     StyleSheet,
// // //     ScrollView,
// // //     TouchableOpacity,
// // //     FlatList,
// // //     ActivityIndicator,
// // //     RefreshControl,
// // //     Alert,
// // // } from 'react-native';
// // // import { useSelector } from 'react-redux';
// // // import Icon from 'react-native-vector-icons/MaterialIcons';
// // // import { selectThemeData } from '../../store/slices/themeSlice';
// // // import { useGetTeacherDiariesQuery, useGetTeacherClassesQuery } from '../../store/diaryApi';
// // // import DiaryFilterBar from './components/DiaryFilterBar';
// // // import DiaryCard from './components/DiaryCard';

// // // const TeacherDiaryListScreen = ({ navigation }) => {
// // //     const theme = useSelector(selectThemeData);
// // //     const [refreshing, setRefreshing] = useState(false);
// // //     const [filters, setFilters] = useState({
// // //         classId: null,
// // //         sectionIds: [],
// // //         subjectId: null,
// // //         dateFrom: null,
// // //         dateTo: null,
// // //     });
// // //     const [appliedFilters, setAppliedFilters] = useState(filters);

// // //     const { data: classesData, isLoading: classesLoading } = useGetTeacherClassesQuery();
// // //     const {
// // //         data: diariesData,
// // //         isLoading,
// // //         isFetching,
// // //         error,
// // //         refetch,
// // //     } = useGetTeacherDiariesQuery(appliedFilters);

// // //     const onRefresh = useCallback(async () => {
// // //         setRefreshing(true);
// // //         await refetch();
// // //         setRefresfhing(false);
// // //     }, [refetch]);

// // //     const handleApplyFilters = useCallback((newFilters) => {
// // //         setAppliedFilters(newFilters);
// // //     }, []);

// // //     const handleResetFilters = useCallback(() => {
// // //         const resetFilters = {
// // //             classId: null,
// // //             sectionIds: [],
// // //             subjectId: null,
// // //             dateFrom: null,
// // //             dateTo: null,
// // //         };
// // //         setFilters(resetFilters);
// // //         setAppliedFilters(resetFilters);
// // //     }, []);

// // //     const handleCreateDiary = () => {
// // //         navigation.navigate('CreateDiary');
// // //     };

// // //     const handleEditDiary = (entry) => {
// // //         navigation.navigate('CreateDiary', { editEntry: entry });
// // //     };

// // //     const renderEmptyState = () => (
// // //         <View style={[styles.emptyContainer, { backgroundColor: theme.card }]}>
// // //             <Icon name="article" size={60} color={theme.textSecondary} />
// // //             <Text style={[styles.emptyTitle, { color: theme.text }]}>
// // //                 No Diary Entries
// // //             </Text>
// // //             <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
// // //                 Create your first diary entry by tapping the + button
// // //             </Text>
// // //             <TouchableOpacity
// // //                 style={[styles.emptyButton, { backgroundColor: theme.primary }]}
// // //                 onPress={handleCreateDiary}
// // //             >
// // //                 <Icon name="add" size={20} color="#FFF" />
// // //                 <Text style={styles.emptyButtonText}>Create Diary</Text>
// // //             </TouchableOpacity>
// // //         </View>
// // //     );

// // //     if (isLoading && !refreshing) {
// // //         return (
// // //             <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
// // //                 <ActivityIndicator size="large" color={theme.primary} />
// // //                 <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
// // //                     Loading diaries...
// // //                 </Text>
// // //             </View>
// // //         );
// // //     }

// // //     const diaries = diariesData?.data?.entries || [];
// // //     const totalCount = diariesData?.data?.count || 0;

// // //     return (
// // //         <View style={[styles.container, { backgroundColor: theme.background }]}>
// // //             {/* Header */}
// // //             <View style={[styles.header, { backgroundColor: theme.card }]}>
// // //                 <TouchableOpacity onPress={() => navigation.goBack()}>
// // //                     <Icon name="arrow-back" size={24} color={theme.text} />
// // //                 </TouchableOpacity>
// // //                 <Text style={[styles.headerTitle, { color: theme.text }]}>My Diaries</Text>
// // //                 <View style={{ width: 40 }} />
// // //             </View>

// // //             {/* Filter Bar */}
// // //             <DiaryFilterBar
// // //                 filters={filters}
// // //                 setFilters={setFilters}
// // //                 onApply={handleApplyFilters}
// // //                 onReset={handleResetFilters}
// // //                 classesData={classesData}
// // //             />

// // //             {/* Results Count */}
// // //             {!isLoading && (
// // //                 <View style={[styles.resultsBar, { backgroundColor: theme.card }]}>
// // //                     <Text style={[styles.resultsText, { color: theme.textSecondary }]}>
// // //                         {totalCount} {totalCount === 1 ? 'entry' : 'entries'} found
// // //                     </Text>
// // //                     {(appliedFilters.classId || appliedFilters.sectionIds.length > 0 || 
// // //                       appliedFilters.subjectId || appliedFilters.dateFrom || appliedFilters.dateTo) && (
// // //                         <TouchableOpacity onPress={handleResetFilters}>
// // //                             <Text style={[styles.clearText, { color: theme.primary }]}>Clear All</Text>
// // //                         </TouchableOpacity>
// // //                     )}
// // //                 </View>
// // //             )}

// // //             {/* Diary List */}
// // //             <FlatList
// // //                 data={diaries}
// // //                 renderItem={({ item }) => (
// // //                     <DiaryCard entry={item} theme={theme} onPress={() => handleEditDiary(item)} />
// // //                 )}
// // //                 keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
// // //                 contentContainerStyle={styles.listContent}
// // //                 refreshControl={
// // //                     <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} />
// // //                 }
// // //                 ListEmptyComponent={renderEmptyState()}
// // //                 showsVerticalScrollIndicator={false}
// // //             />

// // //             {/* FAB Button */}
// // //             <TouchableOpacity
// // //                 style={[styles.fab, { backgroundColor: theme.primary }]}
// // //                 onPress={handleCreateDiary}
// // //                 activeOpacity={0.8}
// // //             >
// // //                 <Icon name="add" size={28} color="#FFF" />
// // //             </TouchableOpacity>
// // //         </View>
// // //     );
// // // };

// // // const styles = StyleSheet.create({
// // //     container: {
// // //         flex: 1,
// // //     },
// // //     loadingContainer: {
// // //         flex: 1,
// // //         justifyContent: 'center',
// // //         alignItems: 'center',
// // //     },
// // //     loadingText: {
// // //         marginTop: 12,
// // //         fontSize: 14,
// // //     },
// // //     header: {
// // //         flexDirection: 'row',
// // //         alignItems: 'center',
// // //         justifyContent: 'space-between',
// // //         paddingHorizontal: 16,
// // //         paddingVertical: 12,
// // //         elevation: 2,
// // //         shadowColor: '#000',
// // //         shadowOffset: { width: 0, height: 2 },
// // //         shadowOpacity: 0.1,
// // //         shadowRadius: 2,
// // //     },
// // //     headerTitle: {
// // //         fontSize: 20,
// // //         fontWeight: 'bold',
// // //     },
// // //     resultsBar: {
// // //         flexDirection: 'row',
// // //         justifyContent: 'space-between',
// // //         alignItems: 'center',
// // //         paddingHorizontal: 16,
// // //         paddingVertical: 10,
// // //         marginHorizontal: 16,
// // //         marginTop: 12,
// // //         marginBottom: 8,
// // //         borderRadius: 8,
// // //     },
// // //     resultsText: {
// // //         fontSize: 13,
// // //     },
// // //     clearText: {
// // //         fontSize: 13,
// // //         fontWeight: '600',
// // //     },
// // //     listContent: {
// // //         paddingHorizontal: 16,
// // //         paddingBottom: 80,
// // //     },
// // //     emptyContainer: {
// // //         alignItems: 'center',
// // //         paddingVertical: 60,
// // //         marginHorizontal: 16,
// // //         borderRadius: 16,
// // //     },
// // //     emptyTitle: {
// // //         fontSize: 18,
// // //         fontWeight: 'bold',
// // //         marginTop: 16,
// // //         marginBottom: 8,
// // //     },
// // //     emptySubtitle: {
// // //         fontSize: 14,
// // //         textAlign: 'center',
// // //         marginBottom: 20,
// // //         paddingHorizontal: 40,
// // //     },
// // //     emptyButton: {
// // //         flexDirection: 'row',
// // //         alignItems: 'center',
// // //         paddingHorizontal: 20,
// // //         paddingVertical: 10,
// // //         borderRadius: 25,
// // //         gap: 8,
// // //     },
// // //     emptyButtonText: {
// // //         color: '#FFF',
// // //         fontSize: 14,
// // //         fontWeight: '600',
// // //     },
// // //     fab: {
// // //         position: 'absolute',
// // //         bottom: 20,
// // //         right: 20,
// // //         width: 56,
// // //         height: 56,
// // //         borderRadius: 28,
// // //         justifyContent: 'center',
// // //         alignItems: 'center',
// // //         elevation: 5,
// // //         shadowColor: '#000',
// // //         shadowOffset: { width: 0, height: 2 },
// // //         shadowOpacity: 0.3,
// // //         shadowRadius: 4,
// // //     },
// // // });

// // // export default TeacherDiaryListScreen;
// // import React, { useState, useCallback, useRef } from 'react';
// // import {
// //     View,
// //     Text,
// //     StyleSheet,
// //     ScrollView,
// //     TouchableOpacity,
// //     FlatList,
// //     ActivityIndicator,
// //     RefreshControl,
// //     Alert,
// // } from 'react-native';
// // import { useSelector } from 'react-redux';
// // import Icon from 'react-native-vector-icons/MaterialIcons';
// // import { selectThemeData } from '../../store/slices/themeSlice';
// // import { useGetTeacherDiariesQuery, useGetTeacherClassesQuery } from '../../store/diaryApi';
// // import DiaryFilterBar from './components/DiaryFilterBar';
// // import DiaryCard from './components/DiaryCard';

// // const TeacherDiaryListScreen = ({ navigation }) => {
// //     const theme = useSelector(selectThemeData);
// //     const [refreshing, setRefreshing] = useState(false);
// //     const [filters, setFilters] = useState({
// //         classId: null,
// //         sectionIds: [],
// //         subjectId: null,
// //         dateFrom: null,
// //         dateTo: null,
// //     });
// //     const [appliedFilters, setAppliedFilters] = useState(filters);

// //     const { data: classesData, isLoading: classesLoading } = useGetTeacherClassesQuery();
// //     const {
// //         data: diariesData,
// //         isLoading,
// //         isFetching,
// //         error,
// //         refetch,
// //     } = useGetTeacherDiariesQuery(appliedFilters);

// //     const onRefresh = useCallback(async () => {
// //         setRefreshing(true);
// //         await refetch();
// //         setRefreshing(false);  // ✅ FIXED TYPO
// //     }, [refetch]);

// //     const handleApplyFilters = useCallback((newFilters) => {
// //         setAppliedFilters(newFilters);
// //     }, []);

// //     const handleResetFilters = useCallback(() => {
// //         const resetFilters = {
// //             classId: null,
// //             sectionIds: [],
// //             subjectId: null,
// //             dateFrom: null,
// //             dateTo: null,
// //         };
// //         setFilters(resetFilters);
// //         setAppliedFilters(resetFilters);
// //     }, []);

// //     const handleCreateDiary = () => {
// //         navigation.navigate('CreateDiary');
// //     };

// //    const handleEditDiary = (entry) => {
// //     navigation.navigate('CreateDiary', { 
// //         editEntry: {
// //             id: entry.id,
// //             classId: entry.classId,
// //             className: entry.className,
// //             sectionIds: entry.sectionIds || [],
// //             sectionNames: entry.sectionNames || [],
// //             subjectId: entry.subjectId,
// //             subjectName: entry.subjectName,
// //             content: entry.content,
// //             isPublished: entry.isPublished,
// //             date: entry.date
// //         }
// //     });
// // };

// //     // Strip HTML tags for preview
// //     const stripHtml = (html) => {
// //         if (!html) return '';
// //         return html.replace(/<[^>]*>/g, '').substring(0, 100);
// //     };

// //     const renderEmptyState = () => (
// //         <View style={[styles.emptyContainer, { backgroundColor: theme.card }]}>
// //             <Icon name="article" size={60} color={theme.textSecondary} />
// //             <Text style={[styles.emptyTitle, { color: theme.text }]}>
// //                 No Diary Entries
// //             </Text>
// //             <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
// //                 Create your first diary entry by tapping the + button
// //             </Text>
// //             <TouchableOpacity
// //                 style={[styles.emptyButton, { backgroundColor: theme.primary }]}
// //                 onPress={handleCreateDiary}
// //             >
// //                 <Icon name="add" size={20} color="#FFF" />
// //                 <Text style={styles.emptyButtonText}>Create Diary</Text>
// //             </TouchableOpacity>
// //         </View>
// //     );

// //     // Transform entries for DiaryCard
// //     const transformedEntries = (diariesData?.data?.entries || []).map(entry => ({
// //         id: entry.id,
// //         date: entry.date,
// //         className: entry.className,
// //         sectionNames: entry.sectionNames || [],
// //         subjectName: entry.subjectName,
// //         content: entry.content,
// //         isPublished: entry.isPublished,
// //         previewContent: stripHtml(entry.content),
// //     }));

// //     if (isLoading && !refreshing) {
// //         return (
// //             <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
// //                 <ActivityIndicator size="large" color={theme.primary} />
// //                 <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
// //                     Loading diaries...
// //                 </Text>
// //             </View>
// //         );
// //     }

// //     const totalCount = diariesData?.data?.count || 0;

// //     return (
// //         <View style={[styles.container, { backgroundColor: theme.background }]}>
// //             {/* Header */}
// //             <View style={[styles.header, { backgroundColor: theme.card }]}>
// //                 <TouchableOpacity onPress={() => navigation.goBack()}>
// //                     <Icon name="arrow-back" size={24} color={theme.text} />
// //                 </TouchableOpacity>
// //                 <Text style={[styles.headerTitle, { color: theme.text }]}>My Diaries</Text>
// //                 <View style={{ width: 40 }} />
// //             </View>

// //             {/* Filter Bar */}
// //             <DiaryFilterBar
// //                 filters={filters}
// //                 setFilters={setFilters}
// //                 onApply={handleApplyFilters}
// //                 onReset={handleResetFilters}
// //                 classesData={classesData}
// //             />

// //             {/* Results Count */}
// //             {!isLoading && (
// //                 <View style={[styles.resultsBar, { backgroundColor: theme.card }]}>
// //                     <Text style={[styles.resultsText, { color: theme.textSecondary }]}>
// //                         {totalCount} {totalCount === 1 ? 'entry' : 'entries'} found
// //                     </Text>
// //                     {(appliedFilters.classId || appliedFilters.sectionIds.length > 0 || 
// //                       appliedFilters.subjectId || appliedFilters.dateFrom || appliedFilters.dateTo) && (
// //                         <TouchableOpacity onPress={handleResetFilters}>
// //                             <Text style={[styles.clearText, { color: theme.primary }]}>Clear All</Text>
// //                         </TouchableOpacity>
// //                     )}
// //                 </View>
// //             )}

// //             {/* Diary List */}
// //             <FlatList
// //                 data={transformedEntries}
// //                 renderItem={({ item }) => (
// //                     <DiaryCard entry={item} theme={theme} onPress={() => handleEditDiary(item)} />
// //                 )}
// //                 keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
// //                 contentContainerStyle={styles.listContent}
// //                 refreshControl={
// //                     <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} />
// //                 }
// //                 ListEmptyComponent={renderEmptyState()}
// //                 showsVerticalScrollIndicator={false}
// //             />

// //             {/* FAB Button */}
// //             <TouchableOpacity
// //                 style={[styles.fab, { backgroundColor: theme.primary }]}
// //                 onPress={handleCreateDiary}
// //                 activeOpacity={0.8}
// //             >
// //                 <Icon name="add" size={28} color="#FFF" />
// //             </TouchableOpacity>
// //         </View>
// //     );
// // };

// // const styles = StyleSheet.create({
// //     container: {
// //         flex: 1,
// //     },
// //     loadingContainer: {
// //         flex: 1,
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //     },
// //     loadingText: {
// //         marginTop: 12,
// //         fontSize: 14,
// //     },
// //     header: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         justifyContent: 'space-between',
// //         paddingHorizontal: 16,
// //         paddingVertical: 12,
// //         elevation: 2,
// //         shadowColor: '#000',
// //         shadowOffset: { width: 0, height: 2 },
// //         shadowOpacity: 0.1,
// //         shadowRadius: 2,
// //     },
// //     headerTitle: {
// //         fontSize: 20,
// //         fontWeight: 'bold',
// //     },
// //     resultsBar: {
// //         flexDirection: 'row',
// //         justifyContent: 'space-between',
// //         alignItems: 'center',
// //         paddingHorizontal: 16,
// //         paddingVertical: 10,
// //         marginHorizontal: 16,
// //         marginTop: 12,
// //         marginBottom: 8,
// //         borderRadius: 8,
// //     },
// //     resultsText: {
// //         fontSize: 13,
// //     },
// //     clearText: {
// //         fontSize: 13,
// //         fontWeight: '600',
// //     },
// //     listContent: {
// //         paddingHorizontal: 16,
// //         paddingBottom: 80,
// //     },
// //     emptyContainer: {
// //         alignItems: 'center',
// //         paddingVertical: 60,
// //         marginHorizontal: 16,
// //         borderRadius: 16,
// //     },
// //     emptyTitle: {
// //         fontSize: 18,
// //         fontWeight: 'bold',
// //         marginTop: 16,
// //         marginBottom: 8,
// //     },
// //     emptySubtitle: {
// //         fontSize: 14,
// //         textAlign: 'center',
// //         marginBottom: 20,
// //         paddingHorizontal: 40,
// //     },
// //     emptyButton: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         paddingHorizontal: 20,
// //         paddingVertical: 10,
// //         borderRadius: 25,
// //         gap: 8,
// //     },
// //     emptyButtonText: {
// //         color: '#FFF',
// //         fontSize: 14,
// //         fontWeight: '600',
// //     },
// //     fab: {
// //         position: 'absolute',
// //         bottom: 20,
// //         right: 20,
// //         width: 56,
// //         height: 56,
// //         borderRadius: 28,
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //         elevation: 5,
// //         shadowColor: '#000',
// //         shadowOffset: { width: 0, height: 2 },
// //         shadowOpacity: 0.3,
// //         shadowRadius: 4,
// //     },
// // });

// // export default TeacherDiaryListScreen;

// // TeacherDiaryListScreen.js - UPDATED with better data handling
// import React, { useState, useCallback } from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     TouchableOpacity,
//     FlatList,
//     ActivityIndicator,
//     RefreshControl,
// } from 'react-native';
// import { useSelector } from 'react-redux';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { selectThemeData } from '../../store/slices/themeSlice';
// import { useGetTeacherDiariesQuery, useGetTeacherClassesQuery } from '../../store/diaryApi';
// import DiaryFilterBar from './components/DiaryFilterBar';
// import DiaryCard from './components/DiaryCard';

// const TeacherDiaryListScreen = ({ navigation }) => {
//     const theme = useSelector(selectThemeData);
//     const [refreshing, setRefreshing] = useState(false);
//     const [filters, setFilters] = useState({
//         classId: null,
//         sectionIds: [],
//         subjectId: null,
//         dateFrom: null,
//         dateTo: null,
//     });
//     const [appliedFilters, setAppliedFilters] = useState(filters);

//     const { data: classesData, isLoading: classesLoading } = useGetTeacherClassesQuery();
//     const {
//         data: diariesData,
//         isLoading,
//         isFetching,
//         error,
//         refetch,
//     } = useGetTeacherDiariesQuery(appliedFilters);

//     // Debug: Log the diaries data structure
//     console.log('📓 Diaries Data Structure:', JSON.stringify(diariesData, null, 2));

//     const onRefresh = useCallback(async () => {
//         setRefreshing(true);
//         await refetch();
//         setRefreshing(false);
//     }, [refetch]);

//     const handleApplyFilters = useCallback((newFilters) => {
//         setAppliedFilters(newFilters);
//     }, []);

//     const handleResetFilters = useCallback(() => {
//         const resetFilters = {
//             classId: null,
//             sectionIds: [],
//             subjectId: null,
//             dateFrom: null,
//             dateTo: null,
//         };
//         setFilters(resetFilters);
//         setAppliedFilters(resetFilters);
//     }, []);

//     const handleCreateDiary = () => {
//         navigation.navigate('CreateDiary');
//     };

//     const handleEditDiary = (entry) => {
//         // Debug: Log what we're passing
//         console.log('✏️ Editing diary entry:', JSON.stringify(entry, null, 2));
        
//         // Ensure we have all required fields
//         const editData = {
//             id: entry.id,
//             classId: entry.classId,
//             className: entry.className,
//             sectionIds: Array.isArray(entry.sectionIds) ? entry.sectionIds : [],
//             sectionNames: Array.isArray(entry.sectionNames) ? entry.sectionNames : [],
//             subjectId: entry.subjectId,
//             subjectName: entry.subjectName,
//             content: entry.content || '',
//             isPublished: entry.isPublished,
//             date: entry.date
//         };
        
//         console.log('📤 Passing to edit screen:', editData);
        
//         navigation.navigate('CreateDiary', { 
//             editEntry: editData
//         });
//     };

//     // Strip HTML tags for preview
//     const stripHtml = (html) => {
//         if (!html) return '';
//         return html.replace(/<[^>]*>/g, '').substring(0, 100);
//     };

//     const renderEmptyState = () => (
//         <View style={[styles.emptyContainer, { backgroundColor: theme.card }]}>
//             <Icon name="article" size={60} color={theme.textSecondary} />
//             <Text style={[styles.emptyTitle, { color: theme.text }]}>
//                 No Diary Entries
//             </Text>
//             <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
//                 Create your first diary entry by tapping the + button
//             </Text>
//             <TouchableOpacity
//                 style={[styles.emptyButton, { backgroundColor: theme.primary }]}
//                 onPress={handleCreateDiary}
//             >
//                 <Icon name="add" size={20} color="#FFF" />
//                 <Text style={styles.emptyButtonText}>Create Diary</Text>
//             </TouchableOpacity>
//         </View>
//     );

//     // Transform entries for DiaryCard - ensure data structure is correct
//     const transformedEntries = (diariesData?.data?.entries || []).map(entry => ({
//         id: entry.id,
//         date: entry.date || '',
//         classId: entry.classId,
//         className: entry.className || '',
//         sectionIds: entry.sectionIds || [],
//         sectionNames: entry.sectionNames || [],
//         subjectId: entry.subjectId,
//         subjectName: entry.subjectName || '',
//         content: entry.content || '',
//         isPublished: entry.isPublished || false,
//         previewContent: stripHtml(entry.content),
//     }));

//     console.log('📋 Transformed entries count:', transformedEntries.length);
//     if (transformedEntries.length > 0) {
//         console.log('📋 First entry:', JSON.stringify(transformedEntries[0], null, 2));
//     }

//     if (isLoading && !refreshing) {
//         return (
//             <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
//                 <ActivityIndicator size="large" color={theme.primary} />
//                 <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
//                     Loading diaries...
//                 </Text>
//             </View>
//         );
//     }

//     const totalCount = diariesData?.data?.count || 0;

//     return (
//         <View style={[styles.container, { backgroundColor: theme.background }]}>
//             {/* Header */}
//             <View style={[styles.header, { backgroundColor: theme.card }]}>
//                 <TouchableOpacity onPress={() => navigation.goBack()}>
//                     <Icon name="arrow-back" size={24} color={theme.text} />
//                 </TouchableOpacity>
//                 <Text style={[styles.headerTitle, { color: theme.text }]}>My Diaries</Text>
//                 <View style={{ width: 40 }} />
//             </View>

//             {/* Filter Bar */}
//             <DiaryFilterBar
//                 filters={filters}
//                 setFilters={setFilters}
//                 onApply={handleApplyFilters}
//                 onReset={handleResetFilters}
//                 classesData={classesData}
//             />

//             {/* Results Count */}
//             {!isLoading && (
//                 <View style={[styles.resultsBar, { backgroundColor: theme.card }]}>
//                     <Text style={[styles.resultsText, { color: theme.textSecondary }]}>
//                         {totalCount} {totalCount === 1 ? 'entry' : 'entries'} found
//                     </Text>
//                     {(appliedFilters.classId || appliedFilters.sectionIds.length > 0 || 
//                       appliedFilters.subjectId || appliedFilters.dateFrom || appliedFilters.dateTo) && (
//                         <TouchableOpacity onPress={handleResetFilters}>
//                             <Text style={[styles.clearText, { color: theme.primary }]}>Clear All</Text>
//                         </TouchableOpacity>
//                     )}
//                 </View>
//             )}

//             {/* Diary List */}
//             <FlatList
//                 data={transformedEntries}
//                 renderItem={({ item }) => (
//                     <DiaryCard entry={item} theme={theme} onPress={() => handleEditDiary(item)} />
//                 )}
//                 keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
//                 contentContainerStyle={styles.listContent}
//                 refreshControl={
//                     <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} />
//                 }
//                 ListEmptyComponent={renderEmptyState()}
//                 showsVerticalScrollIndicator={false}
//             />

//             {/* FAB Button */}
//             <TouchableOpacity
//                 style={[styles.fab, { backgroundColor: theme.primary }]}
//                 onPress={handleCreateDiary}
//                 activeOpacity={0.8}
//             >
//                 <Icon name="add" size={28} color="#FFF" />
//             </TouchableOpacity>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     loadingContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     loadingText: {
//         marginTop: 12,
//         fontSize: 14,
//     },
//     header: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//         elevation: 2,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 2,
//     },
//     headerTitle: {
//         fontSize: 20,
//         fontWeight: 'bold',
//     },
//     resultsBar: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingHorizontal: 16,
//         paddingVertical: 10,
//         marginHorizontal: 16,
//         marginTop: 12,
//         marginBottom: 8,
//         borderRadius: 8,
//     },
//     resultsText: {
//         fontSize: 13,
//     },
//     clearText: {
//         fontSize: 13,
//         fontWeight: '600',
//     },
//     listContent: {
//         paddingHorizontal: 16,
//         paddingBottom: 80,
//     },
//     emptyContainer: {
//         alignItems: 'center',
//         paddingVertical: 60,
//         marginHorizontal: 16,
//         borderRadius: 16,
//     },
//     emptyTitle: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginTop: 16,
//         marginBottom: 8,
//     },
//     emptySubtitle: {
//         fontSize: 14,
//         textAlign: 'center',
//         marginBottom: 20,
//         paddingHorizontal: 40,
//     },
//     emptyButton: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingHorizontal: 20,
//         paddingVertical: 10,
//         borderRadius: 25,
//         gap: 8,
//     },
//     emptyButtonText: {
//         color: '#FFF',
//         fontSize: 14,
//         fontWeight: '600',
//     },
//     fab: {
//         position: 'absolute',
//         bottom: 20,
//         right: 20,
//         width: 56,
//         height: 56,
//         borderRadius: 28,
//         justifyContent: 'center',
//         alignItems: 'center',
//         elevation: 5,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.3,
//         shadowRadius: 4,
//     },
// });

// export default TeacherDiaryListScreen;
// TeacherDiaryListScreen.js - OPTIMIZED with Today's Diaries by Default
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    Platform,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { selectThemeData } from '../../store/slices/themeSlice';
import { useGetTeacherDiariesQuery, useGetTeacherClassesQuery } from '../../store/diaryApi';
import DiaryFilterBar from './components/DiaryFilterBar';
import DiaryCard from './components/DiaryCard';
import { format, startOfToday, endOfToday } from 'date-fns';

const TeacherDiaryListScreen = ({ navigation }) => {
    const theme = useSelector(selectThemeData);
    const [refreshing, setRefreshing] = useState(false);
    
    // Get today's date range
    const todayStart = useMemo(() => format(startOfToday(), 'yyyy-MM-dd'), []);
    const todayEnd = useMemo(() => format(endOfToday(), 'yyyy-MM-dd'), []);
    
    // Initialize filters with today's date range
    const [filters, setFilters] = useState({
        classId: null,
        sectionIds: [],
        subjectId: null,
        dateFrom: todayStart,
        dateTo: todayEnd,
    });
    const [appliedFilters, setAppliedFilters] = useState(filters);

    const { data: classesData, isLoading: classesLoading } = useGetTeacherClassesQuery();
    const {
        data: diariesData,
        isLoading,
        isFetching,
        error,
        refetch,
    } = useGetTeacherDiariesQuery(appliedFilters);

    // Reset to today's date when component mounts
    useEffect(() => {
        const todayFilters = {
            classId: null,
            sectionIds: [],
            subjectId: null,
            dateFrom: todayStart,
            dateTo: todayEnd,
        };
        setFilters(todayFilters);
        setAppliedFilters(todayFilters);
    }, [todayStart, todayEnd]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    }, [refetch]);

    const handleApplyFilters = useCallback((newFilters) => {
        setAppliedFilters(newFilters);
    }, []);

    const handleResetFilters = useCallback(() => {
        const resetFilters = {
            classId: null,
            sectionIds: [],
            subjectId: null,
            dateFrom: todayStart,
            dateTo: todayEnd,
        };
        setFilters(resetFilters);
        setAppliedFilters(resetFilters);
    }, [todayStart, todayEnd]);

    const handleCreateDiary = useCallback(() => {
        navigation.navigate('CreateDiary');
    }, [navigation]);

    const handleEditDiary = useCallback((entry) => {
        const editData = {
            id: entry.id,
            classId: entry.classId,
            className: entry.className,
            sectionIds: Array.isArray(entry.sectionIds) ? entry.sectionIds : [],
            sectionNames: Array.isArray(entry.sectionNames) ? entry.sectionNames : [],
            subjectId: entry.subjectId,
            subjectName: entry.subjectName,
            content: entry.content || '',
            isPublished: entry.isPublished,
            date: entry.date
        };
        
        navigation.navigate('CreateDiary', { 
            editEntry: editData
        });
    }, [navigation]);

    // Memoized strip HTML function
    const stripHtml = useCallback((html) => {
        if (!html) return '';
        return html.replace(/<[^>]*>/g, '').substring(0, 100);
    }, []);

    // Memoize transformed entries
    const transformedEntries = useMemo(() => {
        const entries = diariesData?.data?.entries || [];
        return entries.map(entry => ({
            id: entry.id,
            date: entry.date || '',
            classId: entry.classId,
            className: entry.className || '',
            sectionIds: entry.sectionIds || [],
            sectionNames: entry.sectionNames || [],
            subjectId: entry.subjectId,
            subjectName: entry.subjectName || '',
            content: entry.content || '',
            isPublished: entry.isPublished || false,
            previewContent: stripHtml(entry.content),
        }));
    }, [diariesData?.data?.entries, stripHtml]);

    // Memoize empty state component
    const renderEmptyState = useCallback(() => (
        <View style={[styles.emptyContainer, { backgroundColor: theme.card }]}>
            <Icon name="article" size={60} color={theme.textSecondary} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
                No Diary Entries
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                No diaries found for today. Create your first diary entry by tapping the + button
            </Text>
            <TouchableOpacity
                style={[styles.emptyButton, { backgroundColor: theme.primary }]}
                onPress={handleCreateDiary}
            >
                <Icon name="add" size={20} color="#FFF" />
                <Text style={styles.emptyButtonText}>Create Diary</Text>
            </TouchableOpacity>
        </View>
    ), [theme, handleCreateDiary]);

    // Memoize render item
    const renderItem = useCallback(({ item }) => (
        <DiaryCard 
            entry={item} 
            theme={theme} 
            onPress={() => handleEditDiary(item)} 
        />
    ), [theme, handleEditDiary]);

    // Memoize key extractor
    const keyExtractor = useCallback((item) => item.id?.toString() || Math.random().toString(), []);

    const totalCount = diariesData?.data?.count || 0;
    const showClearButton = appliedFilters.classId || 
                           appliedFilters.sectionIds?.length > 0 || 
                           appliedFilters.subjectId || 
                           (appliedFilters.dateFrom !== todayStart || appliedFilters.dateTo !== todayEnd);

    if (isLoading && !refreshing) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
                    Loading today's diaries...
                </Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.card }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Icon name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Today's Diaries</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Filter Bar */}
            <DiaryFilterBar
                filters={filters}
                setFilters={setFilters}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
                classesData={classesData}
            />

            {/* Results Count */}
            {!isLoading && (
                <View style={[styles.resultsBar, { backgroundColor: theme.card }]}>
                    <Text style={[styles.resultsText, { color: theme.textSecondary }]}>
                        {totalCount} {totalCount === 1 ? 'entry' : 'entries'} for today
                    </Text>
                    {showClearButton && (
                        <TouchableOpacity onPress={handleResetFilters} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <Text style={[styles.clearText, { color: theme.primary }]}>Show Today</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {/* Diary List */}
            <FlatList
                data={transformedEntries}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl 
                        refreshing={refreshing} 
                        onRefresh={onRefresh} 
                        colors={[theme.primary]} 
                        tintColor={theme.primary}
                    />
                }
                ListEmptyComponent={renderEmptyState}
                showsVerticalScrollIndicator={false}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={10}
                removeClippedSubviews={Platform.OS === 'android'}
                updateCellsBatchingPeriod={50}
            />

            {/* FAB Button */}
            <TouchableOpacity
                style={[styles.fab, { backgroundColor: theme.primary }]}
                onPress={handleCreateDiary}
                activeOpacity={0.8}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Icon name="add" size={28} color="#FFF" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    resultsBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginHorizontal: 16,
        marginTop: 12,
        marginBottom: 8,
        borderRadius: 8,
    },
    resultsText: {
        fontSize: 13,
    },
    clearText: {
        fontSize: 13,
        fontWeight: '600',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 80,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 60,
        marginHorizontal: 16,
        borderRadius: 16,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 40,
    },
    emptyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
        gap: 8,
    },
    emptyButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
});

export default TeacherDiaryListScreen;