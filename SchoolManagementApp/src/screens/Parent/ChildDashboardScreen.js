// import React, { useState, useEffect } from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     ScrollView,
//     TouchableOpacity,
//     Image,
//     ActivityIndicator,
//     RefreshControl,
// } from 'react-native';
// import { useSelector, useDispatch } from 'react-redux';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { selectThemeData } from '../../store/slices/themeSlice';
// import {
//     useGetChildGradesQuery,
//     useGetChildGradeStatsQuery
// } from '../../store/gradesApi';
// import {
//     useGetChildAttendanceStatsQuery,
//     useGetChildDiaryQuery
// } from '../../store/attendanceApi';

// const ChildDashboardScreen = ({ route, navigation }) => {
//     const theme = useSelector(selectThemeData);
//     const { childId, childName, childData } = route.params;
// console.log("ChildDashboardScreen - childId:", childId, "childName:", childName, "childData:", childData)
//     const [loading, setLoading] = useState(true);
//     const [refreshing, setRefreshing] = useState(false);
//     const [childInfo, setChildInfo] = useState(childData || {});
//     const [attendance, setAttendance] = useState({ present: 0, absent: 0 });
//     const [recentGrades, setRecentGrades] = useState([]);
//     const [todaysDiary, setTodaysDiary] = useState('');
//     const [averageGrade, setAverageGrade] = useState('N/A');
//     const [homeworkCompletion, setHomeworkCompletion] = useState(0);

//     // API Queries
//     const {
//         data: gradesData,
//         isLoading: gradesLoading,
//         refetch: refetchGrades
//     } = useGetChildGradesQuery({ childId });
//     console.log("gradesData", gradesData)
//     const {
//         data: gradeStats,
//         isLoading: statsLoading
//     } = useGetChildGradeStatsQuery({ childId });
//     console.log("gradeStats", gradeStats)
//     const {
//         data: attendanceStats,
//         isLoading: attendanceLoading
//     } = useGetChildAttendanceStatsQuery({ childId });
//     console.log("attendanceStats", attendanceStats)
//     const {
//         data: diaryData,
//         isLoading: diaryLoading
//     } = useGetChildDiaryQuery({
//         childId,
//         date: new Date().toISOString().split('T')[0]
//     });
//     console.log("diaryData", diaryData)
//     const dispatch = useDispatch();

//     useEffect(() => {
//         fetchChildDetails();
//     }, [gradesData, attendanceStats, diaryData, gradeStats]);

//     // const fetchChildDetails = async () => {
//     //     try {
//     //         setLoading(true);

//     //         // Process attendance data
//     //         if (attendanceStats && attendanceStats.success) {
//     //             const stats = attendanceStats.data;
//     //             setAttendance({
//     //                 present: stats.presentPercentage || 0,
//     //                 absent: 100 - (stats.presentPercentage || 0),
//     //                 total: stats.totalDays || 0,
//     //                 presentCount: stats.presentDays || 0,
//     //                 absentCount: stats.absentDays || 0
//     //             });
//     //         }

//     //         // Process grades data
//     //         if (gradesData && Array.isArray(gradesData)) {
//     //             // Get recent grades (latest 3)
//     //             const recent = gradesData
//     //                 .sort((a, b) => new Date(b.examDate) - new Date(a.examDate))
//     //                 .slice(0, 3)
//     //                 .map(grade => ({
//     //                     subject: grade.subjectName || grade.subject,
//     //                     grade: grade.grade || 'N/A',
//     //                     marks: `${grade.obtainedMarks || 0}/${grade.totalMarks || 100}`,
//     //                     examType: grade.examType
//     //                 }));
//     //             setRecentGrades(recent);

//     //             // Calculate average grade
//     //             if (gradesData.length > 0) {
//     //                 const totalMarks = gradesData.reduce((sum, g) => sum + (g.obtainedMarks || 0), 0);
//     //                 const avgPercentage = (totalMarks / (gradesData.length * 100)) * 100;

//     //                 // Convert to grade
//     //                 let avgGrade = 'N/A';
//     //                 if (avgPercentage >= 90) avgGrade = 'A+';
//     //                 else if (avgPercentage >= 80) avgGrade = 'A';
//     //                 else if (avgPercentage >= 70) avgGrade = 'B+';
//     //                 else if (avgPercentage >= 60) avgGrade = 'B';
//     //                 else if (avgPercentage >= 50) avgGrade = 'C';
//     //                 else avgGrade = 'F';

//     //                 setAverageGrade(avgGrade);
//     //             }
//     //         }

//     //         // Process grade stats
//     //         if (gradeStats && gradeStats.success) {
//     //             const stats = gradeStats.data;
//     //             if (stats.averageGrade) {
//     //                 setAverageGrade(stats.averageGrade);
//     //             }
//     //         }

//     //         // Process diary data
//     //         if (diaryData && diaryData.success) {
//     //             const diary = diaryData.data;
//     //             if (Array.isArray(diary) && diary.length > 0) {
//     //                 setTodaysDiary(diary[0].content || 'No details available');
//     //             } else {
//     //                 setTodaysDiary('No diary entry for today.');
//     //             }
//     //         }

//     //         // Set child info
//     //         setChildInfo({
//     //             ...childData,
//     //             age: calculateAge(childData.dob),
//     //             dob: childData.dob || 'N/A',
//     //             bloodGroup: childData.bloodGroup || 'N/A',
//     //             address: childData.address || 'N/A',
//     //             className: childData.className || 'N/A',
//     //             sectionName: childData.sectionName || 'N/A',
//     //             rollNo: childData.rollNo || 'N/A',
//     //             gender: childData.gender || 'N/A',
//     //             campusName: childData.campusName || 'N/A'
//     //         });

//     //         // Simulate homework completion (you'll need to replace with actual API)
//     //         setHomeworkCompletion(Math.floor(Math.random() * 40) + 60); // 60-100%

//     //     } catch (error) {
//     //         console.error('Error fetching child details:', error);
//     //     } finally {
//     //         setLoading(false);
//     //     }
//     // };

//     // In ChildDashboardScreen.js, add mock data fallback
//     const fetchChildDetails = async () => {
//         try {
//             setLoading(true);

//             console.log('🔍 Processing API Data...');
//             console.log('Grades Data:', gradesData);
//             console.log('Attendance Stats:', attendanceStats);
//             console.log('Diary Data:', diaryData);

//             // Process attendance data - FIXED for new response format
//             if (attendanceStats && attendanceStats.success === true && attendanceStats.data) {
//                 const stats = attendanceStats.data;
//                 console.log('Attendance stats:', stats);

//                 setAttendance({
//                     present: stats.presentPercentage || 0,
//                     absent: 100 - (stats.presentPercentage || 0),
//                     total: stats.totalDays || 0,
//                     presentCount: stats.presentDays || 0,
//                     absentCount: stats.absentDays || 0
//                 });
//             } else {
//                 console.log('No attendance data available');
//             }

//             // Process grades data - FIXED for new response format
//             if (gradesData && Array.isArray(gradesData)) {
//                 console.log('Processing grades data, count:', gradesData.length);

//                 // Get recent grades (latest 3)
//                 const recent = gradesData
//                     .sort((a, b) => new Date(b.examDate || 0) - new Date(a.examDate || 0))
//                     .slice(0, 3)
//                     .map(grade => ({
//                         subject: grade.subjectName || grade.subject || 'Unknown',
//                         grade: grade.grade || 'N/A',
//                         marks: `${grade.obtainedMarks || 0}/${grade.totalMarks || 100}`,
//                         examType: grade.examType || 'Exam'
//                     }));
//                 setRecentGrades(recent);

//                 // Calculate average grade
//                 if (gradesData.length > 0) {
//                     const validGrades = gradesData.filter(g => g.obtainedMarks != null && g.totalMarks != null);
//                     if (validGrades.length > 0) {
//                         const totalMarks = validGrades.reduce((sum, g) => sum + (g.obtainedMarks || 0), 0);
//                         const totalPossible = validGrades.reduce((sum, g) => sum + (g.totalMarks || 100), 0);
//                         const avgPercentage = totalPossible > 0 ? (totalMarks / totalPossible) * 100 : 0;

//                         // Convert to grade
//                         let avgGrade = 'N/A';
//                         if (avgPercentage >= 90) avgGrade = 'A+';
//                         else if (avgPercentage >= 80) avgGrade = 'A';
//                         else if (avgPercentage >= 70) avgGrade = 'B+';
//                         else if (avgPercentage >= 60) avgGrade = 'B';
//                         else if (avgPercentage >= 50) avgGrade = 'C';
//                         else avgGrade = 'F';

//                         setAverageGrade(avgGrade);
//                     }
//                 }
//             } else {
//                 console.log('gradesData is not array:', typeof gradesData);
//             }

//             // Process diary data - FIXED for new response format
//             if (diaryData && diaryData.success === true && diaryData.data && Array.isArray(diaryData.data)) {
//                 console.log('Processing diary data, count:', diaryData.data.length);

//                 if (diaryData.data.length > 0) {
//                     // Find today's diary
//                     const today = new Date().toISOString().split('T')[0];
//                     const todaysEntry = diaryData.data.find(d => d.date === today);

//                     if (todaysEntry) {
//                         setTodaysDiary(todaysEntry.content || 'No details available');
//                     } else {
//                         setTodaysDiary('No diary entry for today.');
//                     }
//                 } else {
//                     setTodaysDiary('No diary entry for today.');
//                 }
//             } else {
//                 setTodaysDiary('No diary entry for today.');
//             }

//             setLoading(false);
//         } catch (error) {
//             console.error('❌ Error fetching child details:', error);
//             setLoading(false);
//         }
//     };

//     const calculateAge = (dob) => {
//         if (!dob) return 'N/A';
//         const birthDate = new Date(dob);
//         const today = new Date();
//         let age = today.getFullYear() - birthDate.getFullYear();
//         const monthDiff = today.getMonth() - birthDate.getMonth();

//         if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//             age--;
//         }

//         return `${age} years`;
//     };

//     const onRefresh = async () => {
//         setRefreshing(true);
//         await Promise.all([
//             refetchGrades(),
//             // Add other refetch calls here
//         ]);
//         await fetchChildDetails();
//         setRefreshing(false);
//     };

//     const handleViewAttendance = () => {
//         navigation.navigate('ChildAttendance', {
//             childId,
//             childName,
//             childData: childInfo
//         });
//     };

//     const handleViewGrades = () => {
//         navigation.navigate('ChildGrades', {
//             childId,
//             childName,
//             childData: childInfo
//         });
//     };

//     const handleViewDiary = () => {
//         navigation.navigate('ChildDiary', {
//             childId,
//             childName,
//             childData: childInfo
//         });
//     };

//     const handleViewHomework = () => {
//         navigation.navigate('ChildHomework', {
//             childId,
//             childName,
//             childData: childInfo
//         });
//     };

//     const handleViewReports = () => {
//         navigation.navigate('ChildReports', {
//             childId,
//             childName,
//             childData: childInfo
//         });
//     };

//     if (loading || gradesLoading || attendanceLoading || diaryLoading) {
//         return (
//             <View style={[styles.container, { backgroundColor: theme.background }]}>
//                 <ActivityIndicator size="large" color={theme.primary} />
//                 <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
//                     Loading dashboard...
//                 </Text>
//             </View>
//         );
//     }

//     return (
//         <ScrollView
//             style={[styles.container, { backgroundColor: theme.background }]}
//             refreshControl={
//                 <RefreshControl
//                     refreshing={refreshing}
//                     onRefresh={onRefresh}
//                     colors={[theme.primary]}
//                     tintColor={theme.primary}
//                 />
//             }
//             showsVerticalScrollIndicator={false}
//         >
//             {/* Child Profile Header */}
//             <View style={[styles.profileHeader, { backgroundColor: theme.card }]}>
//                 <View style={styles.avatarContainer}>
//                     {childInfo.image ? (
//                         <Image source={{ uri: childInfo.image }} style={styles.avatar} />
//                     ) : (
//                         <View style={[styles.avatarPlaceholder, { backgroundColor: theme.primary }]}>
//                             <Icon
//                                 name={childInfo.gender === 'Female' ? 'face-woman' : 'face-man'}
//                                 size={40}
//                                 color="#FFFFFF"
//                             />
//                         </View>
//                     )}
//                 </View>
//                 <View style={styles.profileInfo}>
//                     <Text style={[styles.childName, { color: theme.text }]}>
//                         {childName}
//                     </Text>
//                     <Text style={[styles.classInfo, { color: theme.textSecondary }]}>
//                         {childInfo.className} - {childInfo.sectionName}
//                     </Text>
//                     <View style={styles.rollNoContainer}>
//                         <Icon name="numeric" size={14} color={theme.textSecondary} />
//                         <Text style={[styles.rollNo, { color: theme.textSecondary, marginLeft: 4 }]}>
//                             Roll No: {childInfo.rollNo}
//                         </Text>
//                     </View>
//                     <View style={styles.admissionContainer}>
//                         <Icon name="school" size={14} color={theme.textSecondary} />
//                         <Text style={[styles.admissionNo, { color: theme.textSecondary, marginLeft: 4 }]}>
//                             Admission No: {childInfo.admissionNo || 'N/A'}
//                         </Text>
//                     </View>
//                 </View>
//             </View>

//             {/* Quick Stats */}
//             <View style={styles.statsContainer}>
//                 <TouchableOpacity
//                     style={[styles.statCard, { backgroundColor: theme.card }]}
//                     onPress={handleViewAttendance}
//                     activeOpacity={0.7}
//                 >
//                     <View style={[styles.statIconContainer, { backgroundColor: theme.success + '20' }]}>
//                         <Icon name="calendar-check" size={24} color={theme.success} />
//                     </View>
//                     <Text style={[styles.statValue, { color: theme.text }]}>
//                         {attendance.present}%
//                     </Text>
//                     <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
//                         Attendance
//                     </Text>
//                     <Text style={[styles.statSubLabel, { color: theme.textSecondary }]}>
//                         {attendance.presentCount || 0}/{attendance.total || 0} days
//                     </Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                     style={[styles.statCard, { backgroundColor: theme.card }]}
//                     onPress={handleViewGrades}
//                     activeOpacity={0.7}
//                 >
//                     <View style={[styles.statIconContainer, { backgroundColor: theme.warning + '20' }]}>
//                         <Icon name="school" size={24} color={theme.warning} />
//                     </View>
//                     <Text style={[styles.statValue, { color: theme.text }]}>
//                         {averageGrade}
//                     </Text>
//                     <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
//                         Average Grade
//                     </Text>
//                     <Text style={[styles.statSubLabel, { color: theme.textSecondary }]}>
//                         {recentGrades.length} subjects
//                     </Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                     style={[styles.statCard, { backgroundColor: theme.card }]}
//                     onPress={handleViewHomework}
//                     activeOpacity={0.7}
//                 >
//                     <View style={[styles.statIconContainer, { backgroundColor: theme.primary + '20' }]}>
//                         <Icon name="clock-check" size={24} color={theme.primary} />
//                     </View>
//                     <Text style={[styles.statValue, { color: theme.text }]}>
//                         {homeworkCompletion}%
//                     </Text>
//                     <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
//                         Homework
//                     </Text>
//                     <Text style={[styles.statSubLabel, { color: theme.textSecondary }]}>
//                         Completion Rate
//                     </Text>
//                 </TouchableOpacity>
//             </View>

//             {/* Quick Actions */}
//             <View style={[styles.section, { backgroundColor: theme.card }]}>
//                 <View style={styles.sectionHeader}>
//                     <Text style={[styles.sectionTitle, { color: theme.text }]}>
//                         Quick Actions
//                     </Text>
//                 </View>
//                 <View style={styles.quickActions}>
//                     <TouchableOpacity
//                         style={[styles.actionButton, { backgroundColor: theme.background }]}
//                         onPress={handleViewAttendance}
//                         activeOpacity={0.7}
//                     >
//                         <View style={[styles.actionIconContainer, { backgroundColor: theme.primary + '20' }]}>
//                             <Icon name="calendar" size={22} color={theme.primary} />
//                         </View>
//                         <Text style={[styles.actionText, { color: theme.text }]}>
//                             Attendance
//                         </Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                         style={[styles.actionButton, { backgroundColor: theme.background }]}
//                         onPress={handleViewGrades}
//                         activeOpacity={0.7}
//                     >
//                         <View style={[styles.actionIconContainer, { backgroundColor: theme.success + '20' }]}>
//                             <Icon name="chart-line" size={22} color={theme.success} />
//                         </View>
//                         <Text style={[styles.actionText, { color: theme.text }]}>
//                             Results
//                         </Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                         style={[styles.actionButton, { backgroundColor: theme.background }]}
//                         onPress={handleViewDiary}
//                         activeOpacity={0.7}
//                     >
//                         <View style={[styles.actionIconContainer, { backgroundColor: theme.warning + '20' }]}>
//                             <Icon name="book" size={22} color={theme.warning} />
//                         </View>
//                         <Text style={[styles.actionText, { color: theme.text }]}>
//                             Diary
//                         </Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                         style={[styles.actionButton, { backgroundColor: theme.background }]}
//                         onPress={handleViewReports}
//                         activeOpacity={0.7}
//                     >
//                         <View style={[styles.actionIconContainer, { backgroundColor: theme.error + '20' }]}>
//                             <Icon name="file-document" size={22} color={theme.error} />
//                         </View>
//                         <Text style={[styles.actionText, { color: theme.text }]}>
//                             Reports
//                         </Text>
//                     </TouchableOpacity>
//                 </View>
//             </View>

//             {/* Today's Diary */}
//             {todaysDiary && todaysDiary !== 'No diary entry for today.' && (
//                 <View style={[styles.section, { backgroundColor: theme.card }]}>
//                     <View style={styles.sectionHeader}>
//                         <View style={styles.diaryHeader}>
//                             <Icon name="book-open-variant" size={20} color={theme.warning} />
//                             <Text style={[styles.sectionTitle, { color: theme.text, marginLeft: 8 }]}>
//                                 Today's Diary
//                             </Text>
//                         </View>
//                         <TouchableOpacity onPress={handleViewDiary}>
//                             <Text style={[styles.seeAll, { color: theme.primary }]}>
//                                 View All
//                             </Text>
//                         </TouchableOpacity>
//                     </View>
//                     <View style={[styles.diaryContent, { backgroundColor: theme.background, borderLeftColor: theme.warning }]}>
//                         <Icon name="format-quote-open" size={20} color={theme.textSecondary} style={styles.quoteIcon} />
//                         <Text style={[styles.diaryText, { color: theme.text }]}>
//                             {todaysDiary}
//                         </Text>
//                         <Icon name="format-quote-close" size={20} color={theme.textSecondary} style={[styles.quoteIcon, styles.quoteClose]} />
//                     </View>
//                     <Text style={[styles.diaryTime, { color: theme.textSecondary }]}>
//                         Updated today at {new Date().getHours().toString().padStart(2, '0')}:{new Date().getMinutes().toString().padStart(2, '0')}
//                     </Text>
//                 </View>
//             )}

//             {/* Recent Grades */}
//             {recentGrades.length > 0 && (
//                 <View style={[styles.section, { backgroundColor: theme.card }]}>
//                     <View style={styles.sectionHeader}>
//                         <View style={styles.gradesHeader}>
//                             <Icon name="trophy" size={20} color={theme.success} />
//                             <Text style={[styles.sectionTitle, { color: theme.text, marginLeft: 8 }]}>
//                                 Recent Results
//                             </Text>
//                         </View>
//                         <TouchableOpacity onPress={handleViewGrades}>
//                             <Text style={[styles.seeAll, { color: theme.primary }]}>
//                                 View All
//                             </Text>
//                         </TouchableOpacity>
//                     </View>
//                     {recentGrades.map((grade, index) => (
//                         <View
//                             key={index}
//                             style={[
//                                 styles.gradeItem,
//                                 { backgroundColor: theme.background, borderLeftColor: getGradeColor(grade.grade, theme) },
//                             ]}
//                         >
//                             <View style={styles.gradeInfo}>
//                                 <Text style={[styles.subject, { color: theme.text }]}>
//                                     {grade.subject}
//                                 </Text>
//                                 <Text style={[styles.examType, { color: theme.textSecondary }]}>
//                                     {grade.examType || 'Term Exam'}
//                                 </Text>
//                                 <Text style={[styles.marks, { color: theme.textSecondary }]}>
//                                     {grade.marks}
//                                 </Text>
//                             </View>
//                             <View
//                                 style={[
//                                     styles.gradeBadge,
//                                     { backgroundColor: getGradeColor(grade.grade, theme) + '20' },
//                                 ]}
//                             >
//                                 <Text style={[styles.gradeText, { color: getGradeColor(grade.grade, theme) }]}>
//                                     {grade.grade}
//                                 </Text>
//                             </View>
//                         </View>
//                     ))}
//                 </View>
//             )}

//             {/* Child Information */}
//             <View style={[styles.section, { backgroundColor: theme.card }]}>
//                 <View style={styles.sectionHeader}>
//                     <View style={styles.infoHeader}>
//                         <Icon name="information" size={20} color={theme.primary} />
//                         <Text style={[styles.sectionTitle, { color: theme.text, marginLeft: 8 }]}>
//                             Child Information
//                         </Text>
//                     </View>
//                 </View>
//                 <View style={styles.infoGrid}>
//                     <View style={styles.infoItem}>
//                         <View style={[styles.infoIconContainer, { backgroundColor: theme.primary + '10' }]}>
//                             <Icon name="cake" size={18} color={theme.primary} />
//                         </View>
//                         <View style={styles.infoContent}>
//                             <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
//                                 Age
//                             </Text>
//                             <Text style={[styles.infoValue, { color: theme.text }]}>
//                                 {childInfo.age}
//                             </Text>
//                         </View>
//                     </View>

//                     <View style={styles.infoItem}>
//                         <View style={[styles.infoIconContainer, { backgroundColor: theme.success + '10' }]}>
//                             <Icon
//                                 name={childInfo.gender === 'Female' ? 'gender-female' : 'gender-male'}
//                                 size={18}
//                                 color={theme.success}
//                             />
//                         </View>
//                         <View style={styles.infoContent}>
//                             <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
//                                 Gender
//                             </Text>
//                             <Text style={[styles.infoValue, { color: theme.text }]}>
//                                 {childInfo.gender}
//                             </Text>
//                         </View>
//                     </View>

//                     <View style={styles.infoItem}>
//                         <View style={[styles.infoIconContainer, { backgroundColor: theme.error + '10' }]}>
//                             <Icon name="water" size={18} color={theme.error} />
//                         </View>
//                         <View style={styles.infoContent}>
//                             <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
//                                 Blood Group
//                             </Text>
//                             <Text style={[styles.infoValue, { color: theme.text }]}>
//                                 {childInfo.bloodGroup}
//                             </Text>
//                         </View>
//                     </View>

//                     <View style={styles.infoItem}>
//                         <View style={[styles.infoIconContainer, { backgroundColor: theme.warning + '10' }]}>
//                             <Icon name="home" size={18} color={theme.warning} />
//                         </View>
//                         <View style={styles.infoContent}>
//                             <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
//                                 Campus
//                             </Text>
//                             <Text style={[styles.infoValue, { color: theme.text }]}>
//                                 {childInfo.campusName}
//                             </Text>
//                         </View>
//                     </View>

//                     <View style={styles.infoItem}>
//                         <View style={[styles.infoIconContainer, { backgroundColor: theme.info + '10' }]}>
//                             <Icon name="calendar" size={18} color={theme.info} />
//                         </View>
//                         <View style={styles.infoContent}>
//                             <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
//                                 Date of Birth
//                             </Text>
//                             <Text style={[styles.infoValue, { color: theme.text }]}>
//                                 {childInfo.dob ? new Date(childInfo.dob).toLocaleDateString() : 'N/A'}
//                             </Text>
//                         </View>
//                     </View>

//                     <View style={styles.infoItem}>
//                         <View style={[styles.infoIconContainer, { backgroundColor: theme.secondary + '10' }]}>
//                             <Icon name="map-marker" size={18} color={theme.secondary} />
//                         </View>
//                         <View style={styles.infoContent}>
//                             <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
//                                 Address
//                             </Text>
//                             <Text style={[styles.infoValue, { color: theme.text }]} numberOfLines={2}>
//                                 {childInfo.address}
//                             </Text>
//                         </View>
//                     </View>
//                 </View>
//             </View>

//             {/* Empty State Messages */}
//             {recentGrades.length === 0 && todaysDiary === 'No diary entry for today.' && (
//                 <View style={[styles.emptyState, { backgroundColor: theme.card }]}>
//                     <Icon name="book-open-page-variant" size={50} color={theme.textSecondary} />
//                     <Text style={[styles.emptyStateTitle, { color: theme.text }]}>
//                         No Recent Activities
//                     </Text>
//                     <Text style={[styles.emptyStateText, { color: theme.textSecondary }]}>
//                         Check back later for updates on grades, diary entries, and homework.
//                     </Text>
//                 </View>
//             )}
//         </ScrollView>
//     );
// };

// const getGradeColor = (grade, theme) => {
//     switch (grade) {
//         case 'A+':
//         case 'A':
//             return theme.success;
//         case 'B+':
//         case 'B':
//             return theme.warning;
//         case 'C+':
//         case 'C':
//             return theme.secondary;
//         case 'D':
//         case 'F':
//             return theme.error;
//         default:
//             return theme.textSecondary;
//     }
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     loadingText: {
//         marginTop: 20,
//         fontSize: 16,
//         textAlign: 'center',
//     },
//     profileHeader: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: 20,
//         margin: 15,
//         borderRadius: 15,
//         elevation: 3,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//     },
//     avatarContainer: {
//         marginRight: 15,
//     },
//     avatar: {
//         width: 70,
//         height: 70,
//         borderRadius: 35,
//         borderWidth: 2,
//         borderColor: '#FFF',
//     },
//     avatarPlaceholder: {
//         width: 70,
//         height: 70,
//         borderRadius: 35,
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderWidth: 2,
//         borderColor: '#FFF',
//     },
//     profileInfo: {
//         flex: 1,
//     },
//     childName: {
//         fontSize: 22,
//         fontWeight: 'bold',
//         marginBottom: 4,
//     },
//     classInfo: {
//         fontSize: 16,
//         marginBottom: 6,
//         fontWeight: '500',
//     },
//     rollNoContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 4,
//     },
//     admissionContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     rollNo: {
//         fontSize: 14,
//     },
//     admissionNo: {
//         fontSize: 14,
//     },
//     statsContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         paddingHorizontal: 15,
//         marginBottom: 20,
//     },
//     statCard: {
//         flex: 1,
//         marginHorizontal: 5,
//         padding: 15,
//         borderRadius: 12,
//         alignItems: 'center',
//         elevation: 2,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.1,
//         shadowRadius: 2,
//     },
//     statIconContainer: {
//         width: 50,
//         height: 50,
//         borderRadius: 25,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginBottom: 10,
//     },
//     statValue: {
//         fontSize: 22,
//         fontWeight: 'bold',
//         marginVertical: 4,
//     },
//     statLabel: {
//         fontSize: 12,
//         fontWeight: '600',
//         textAlign: 'center',
//     },
//     statSubLabel: {
//         fontSize: 10,
//         textAlign: 'center',
//         marginTop: 2,
//     },
//     section: {
//         marginHorizontal: 15,
//         marginBottom: 20,
//         padding: 20,
//         borderRadius: 15,
//         elevation: 2,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.1,
//         shadowRadius: 3,
//     },
//     sectionHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 15,
//     },
//     sectionTitle: {
//         fontSize: 18,
//         fontWeight: 'bold',
//     },
//     diaryHeader: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     gradesHeader: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     infoHeader: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     seeAll: {
//         fontSize: 14,
//         fontWeight: '600',
//     },
//     quickActions: {
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//         justifyContent: 'space-between',
//     },
//     actionButton: {
//         width: '48%',
//         marginBottom: 12,
//         padding: 15,
//         borderRadius: 12,
//         alignItems: 'center',
//         elevation: 1,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.05,
//         shadowRadius: 2,
//     },
//     actionIconContainer: {
//         width: 50,
//         height: 50,
//         borderRadius: 25,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginBottom: 10,
//     },
//     actionText: {
//         fontSize: 13,
//         fontWeight: '600',
//         textAlign: 'center',
//     },
//     diaryContent: {
//         padding: 15,
//         borderRadius: 8,
//         borderLeftWidth: 4,
//         marginBottom: 10,
//         position: 'relative',
//     },
//     diaryText: {
//         fontSize: 14,
//         lineHeight: 22,
//         fontStyle: 'italic',
//     },
//     quoteIcon: {
//         position: 'absolute',
//         top: 5,
//         left: 10,
//         opacity: 0.3,
//     },
//     quoteClose: {
//         top: 'auto',
//         bottom: 5,
//         right: 10,
//         left: 'auto',
//     },
//     diaryTime: {
//         fontSize: 12,
//         textAlign: 'right',
//     },
//     gradeItem: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         padding: 15,
//         borderRadius: 10,
//         marginBottom: 10,
//         borderLeftWidth: 4,
//     },
//     gradeInfo: {
//         flex: 1,
//     },
//     subject: {
//         fontSize: 16,
//         fontWeight: '600',
//         marginBottom: 2,
//     },
//     examType: {
//         fontSize: 12,
//         marginBottom: 4,
//     },
//     marks: {
//         fontSize: 14,
//         fontWeight: '500',
//     },
//     gradeBadge: {
//         paddingHorizontal: 12,
//         paddingVertical: 6,
//         borderRadius: 15,
//         minWidth: 50,
//         alignItems: 'center',
//     },
//     gradeText: {
//         fontSize: 14,
//         fontWeight: 'bold',
//     },
//     infoGrid: {
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//         justifyContent: 'space-between',
//     },
//     infoItem: {
//         width: '48%',
//         marginBottom: 15,
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     infoIconContainer: {
//         width: 40,
//         height: 40,
//         borderRadius: 20,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginRight: 12,
//     },
//     infoContent: {
//         flex: 1,
//     },
//     infoLabel: {
//         fontSize: 12,
//         marginBottom: 2,
//     },
//     infoValue: {
//         fontSize: 15,
//         fontWeight: '600',
//     },
//     emptyState: {
//         marginHorizontal: 15,
//         marginBottom: 20,
//         padding: 30,
//         borderRadius: 15,
//         alignItems: 'center',
//         elevation: 2,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.1,
//         shadowRadius: 3,
//     },
//     emptyStateTitle: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginTop: 15,
//         marginBottom: 8,
//     },
//     emptyStateText: {
//         fontSize: 14,
//         textAlign: 'center',
//         lineHeight: 20,
//     },
// });

// export default ChildDashboardScreen;

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { useSelector } from "react-redux";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { selectThemeData } from "../../store/slices/themeSlice";
import {
  useGetChildGradesQuery,
  useGetChildGradeStatsQuery,
} from "../../store/gradesApi";
import {
  useGetChildAttendanceStatsQuery,
  useGetChildDiaryQuery,
} from "../../store/attendanceApi";

const ChildDashboardScreen = ({ route, navigation }) => {
  const theme = useSelector(selectThemeData);
  const { childId, childName, childData } = route.params;

  // State declarations
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [childInfo, setChildInfo] = useState({
    name: childName,
    className: "N/A",
    sectionName: "N/A",
    rollNo: "N/A",
    campusName: "N/A",
    gender: "Male",
    age: "N/A",
    admissionNo: "N/A",
    diaryAccess: 0,
  });
  const [attendance, setAttendance] = useState({
    present: 0,
    absent: 0,
    total: 0,
    presentCount: 0,
    absentCount: 0,
  });
  const [recentGrades, setRecentGrades] = useState([]);
  const [todaysDiary, setTodaysDiary] = useState("");
  const [averageGrade, setAverageGrade] = useState("N/A");
  const [homeworkCompletion, setHomeworkCompletion] = useState(0);

  // API Queries
  const {
    data: gradesData,
    isLoading: gradesLoading,
    refetch: refetchGrades,
  } = useGetChildGradesQuery({ childId });

  const { data: gradeStats, isLoading: statsLoading } =
    useGetChildGradeStatsQuery({ childId });

  const { data: attendanceStats, isLoading: attendanceLoading } =
    useGetChildAttendanceStatsQuery({ childId });

  const {
    data: diaryData,
    isLoading: diaryLoading,
    refetch: refetchDiary,
  } = useGetChildDiaryQuery({
    childId,
    date: new Date().toISOString().split("T")[0],
  });

  // Calculate age from DOB - memoized
  const calculateAge = useCallback((dob) => {
    if (!dob || dob === "N/A") return "N/A";
    try {
      const birthDate = new Date(dob);
      if (isNaN(birthDate.getTime())) return "N/A";
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      return `${age} years`;
    } catch (error) {
      console.error("Error calculating age:", error);
      return "N/A";
    }
  }, []);

  // Safe extraction of child data - prevents read-only property error
  const extractChildInfo = useCallback(() => {
    if (!childData) {
      return {
        name: childName,
        className: "N/A",
        sectionName: "N/A",
        rollNo: "N/A",
        campusName: "N/A",
        gender: "Male",
        age: "N/A",
        admissionNo: "N/A",
        diaryAccess: 0,
        reg_Id: childId,
        image: "",
        dob: "N/A",
        bloodGroup: "N/A",
        address: "N/A",
      };
    }

    return {
      reg_Id: childData.reg_Id ?? childId,
      reg_No: childData.reg_No ?? null,
      name: childData.name ?? childName,
      image: childData.image ?? "",
      gender: childData.gender ?? "Male",
      class_ID: childData.class_ID ?? null,
      className: childData.className ?? "N/A",
      section_ID: childData.section_ID ?? null,
      sectionName: childData.sectionName ?? "N/A",
      rollNo: childData.rollNo ?? "N/A",
      family_Code: childData.family_Code ?? null,
      campusName: childData.campusName ?? "N/A",
      status: childData.status ?? "A",
      diaryAccess: childData.diaryAccess ?? 0,
      dob: childData.dob ?? "N/A",
      bloodGroup: childData.bloodGroup ?? "N/A",
      address: childData.address ?? "N/A",
      admissionNo:
        childData.admissionNo ??
        (childData.reg_No ? childData.reg_No.toString() : "N/A"),
    };
  }, [childData, childId, childName]);

  // Process attendance data - memoized
  const processAttendanceData = useCallback((stats) => {
    if (!stats || stats.success !== true || !stats.data) {
      setAttendance({
        present: 0,
        absent: 0,
        total: 0,
        presentCount: 0,
        absentCount: 0,
      });
      return;
    }

    const attendanceData = stats.data;
    setAttendance({
      present: attendanceData.presentPercentage || 0,
      absent: 100 - (attendanceData.presentPercentage || 0),
      total: attendanceData.totalDays || 0,
      presentCount: attendanceData.presentDays || 0,
      absentCount: attendanceData.absentDays || 0,
    });
  }, []);

  // Process grades data - memoized
  const processGradesData = useCallback((grades, stats) => {
    if (!grades || !Array.isArray(grades)) {
      setRecentGrades([]);
      setAverageGrade("N/A");
      return;
    }

    // Get recent grades (latest 3) - create copy to avoid mutation
    const recent = [...grades]
      .sort((a, b) => {
        const dateA = a.examDate ? new Date(a.examDate) : 0;
        const dateB = b.examDate ? new Date(b.examDate) : 0;
        return dateB - dateA;
      })
      .slice(0, 3)
      .map((grade) => ({
        subject: grade.subjectName || grade.subject || "Unknown",
        grade: grade.grade || "N/A",
        marks: `${grade.obtainedMarks || 0}/${grade.totalMarks || 100}`,
        examType: grade.examType || "Exam",
      }));

    setRecentGrades(recent);

    // Calculate average grade
    if (stats && stats.averagePercentage) {
      const avgPercentage = stats.averagePercentage;
      let avgGrade = "N/A";
      if (avgPercentage >= 90) avgGrade = "A+";
      else if (avgPercentage >= 80) avgGrade = "A";
      else if (avgPercentage >= 70) avgGrade = "B+";
      else if (avgPercentage >= 60) avgGrade = "B";
      else if (avgPercentage >= 50) avgGrade = "C";
      else avgGrade = "F";
      setAverageGrade(avgGrade);
    } else if (grades.length > 0) {
      // Fallback calculation
      const validGrades = grades.filter(
        (g) => g.obtainedMarks != null && g.totalMarks != null,
      );
      if (validGrades.length > 0) {
        const totalObtained = validGrades.reduce(
          (sum, g) => sum + (g.obtainedMarks || 0),
          0,
        );
        const totalPossible = validGrades.reduce(
          (sum, g) => sum + (g.totalMarks || 100),
          0,
        );
        const avgPercentage =
          totalPossible > 0 ? (totalObtained / totalPossible) * 100 : 0;

        let avgGrade = "N/A";
        if (avgPercentage >= 90) avgGrade = "A+";
        else if (avgPercentage >= 80) avgGrade = "A";
        else if (avgPercentage >= 70) avgGrade = "B+";
        else if (avgPercentage >= 60) avgGrade = "B";
        else if (avgPercentage >= 50) avgGrade = "C";
        else avgGrade = "F";
        setAverageGrade(avgGrade);
      }
    }
  }, []);

  // Process diary data - memoized
  const processDiaryData = useCallback((diary) => {
    let entries = [];

    if (diary && diary.success === true && diary.data) {
      if (Array.isArray(diary.data)) {
        entries = diary.data;
      } else if (diary.data.entries && Array.isArray(diary.data.entries)) {
        entries = diary.data.entries;
      }
    }

    if (entries.length > 0) {
      const today = new Date().toISOString().split("T")[0];
      const todaysEntry = entries.find((d) => d.date === today);
      if (todaysEntry) {
        setTodaysDiary(todaysEntry.content || "No details available");
      } else {
        setTodaysDiary("No diary entry for today.");
      }
    } else {
      setTodaysDiary("No diary entry for today.");
    }
  }, []);

  // Process homework completion
  const processHomeworkCompletion = useCallback((recentGradesCount) => {
    if (recentGradesCount > 0) {
      const completion = Math.min(
        100,
        Math.max(60, Math.floor(Math.random() * 40) + 60),
      );
      setHomeworkCompletion(completion);
    } else {
      setHomeworkCompletion(0);
    }
  }, []);

  // Main fetch function
  const fetchChildDetails = useCallback(async () => {
    try {
      setLoading(true);
      console.log("🔍 Processing API Data...");

      // Extract and set child info safely
      const extractedInfo = extractChildInfo();
      const infoWithAge = {
        ...extractedInfo,
        age: calculateAge(extractedInfo.dob),
      };
      setChildInfo(infoWithAge);

      // Process API data
      processAttendanceData(attendanceStats);
      processGradesData(gradesData, gradeStats);
      processDiaryData(diaryData);
    } catch (error) {
      console.error("❌ Error fetching child details:", error);
      // Set fallback values to prevent UI from breaking
      setChildInfo((prev) => ({
        ...prev,
        name: childName,
        className: "N/A",
        sectionName: "N/A",
        rollNo: "N/A",
        campusName: "N/A",
        gender: "Male",
        age: "N/A",
        admissionNo: "N/A",
      }));
    } finally {
      setLoading(false);
    }
  }, [
    childId,
    childName,
    childData,
    attendanceStats,
    gradesData,
    gradeStats,
    diaryData,
    extractChildInfo,
    calculateAge,
    processAttendanceData,
    processGradesData,
    processDiaryData,
  ]);

  // Load data when dependencies change
  useEffect(() => {
    fetchChildDetails();
  }, [fetchChildDetails]);

  // Refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchGrades(), refetchDiary()]);
      await fetchChildDetails();
    } catch (error) {
      console.error("Refresh error:", error);
    } finally {
      setRefreshing(false);
    }
  }, [refetchGrades, refetchDiary, fetchChildDetails]);

  // Navigation handlers
  const handleViewAttendance = useCallback(() => {
    navigation.navigate("ChildAttendance", {
      childId,
      childName,
      childData: childInfo,
    });
  }, [navigation, childId, childName, childInfo]);

  const handleOpenDiary = () => {
    navigation.navigate("ClassDiaryAndSow", {
      childId: childId,
      childData: childInfo,
    });
  };

  const handleViewGrades = useCallback(() => {
    navigation.navigate("ChildGrades", {
      childId,
      childName,
      childClassId: childInfo.class_ID,
      childSectionId: childInfo.section_ID,
      childRollNo: childInfo.rollNo,
      childData: childInfo,
    });
  }, [navigation, childId, childName, childInfo]);

  const handleViewDiary = useCallback(() => {
    if (childInfo.diaryAccess === 0) {
      Alert.alert(
        "Access Restricted",
        "Diary access is currently restricted. Please contact the school administration.",
        [{ text: "OK" }],
      );
      return;
    }
    navigation.navigate("ChildDiary", {
      childId,
      childName,
      childData: childInfo,
    });
  }, [navigation, childId, childName, childInfo]);

  const handleViewHomework = useCallback(() => {
    navigation.navigate("ChildHomework", {
      childId,
      childName,
      childData: childInfo,
    });
  }, [navigation, childId, childName, childInfo]);

  const handleViewFeeLedger = () => {
    navigation.navigate("StudentFeeLedger", {
      studentId: childId,
      studentName: childName,
      studentData: childInfo,
    });
  };

  const handleViewReports = useCallback(() => {
    navigation.navigate("ChildReports", {
      childId,
      childName,
      childData: childInfo,
    });
  }, [navigation, childId, childName, childInfo]);

  // Loading state
  const isLoading = useMemo(
    () =>
      loading ||
      gradesLoading ||
      attendanceLoading ||
      diaryLoading ||
      statsLoading,
    [loading, gradesLoading, attendanceLoading, diaryLoading, statsLoading],
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
          Loading dashboard...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
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
      {/* Child Profile Header */}
      <View style={[styles.profileHeader, { backgroundColor: theme.card }]}>
        <View style={styles.avatarContainer}>
          {childInfo.image ? (
            <Image source={{ uri: childInfo.image }} style={styles.avatar} />
          ) : (
            <View
              style={[
                styles.avatarPlaceholder,
                { backgroundColor: theme.primary },
              ]}
            >
              <Icon
                name={childInfo.gender === "Female" ? "face-woman" : "face-man"}
                size={40}
                color="#FFFFFF"
              />
            </View>
          )}
        </View>
        <View style={styles.profileInfo}>
          <Text
            style={[styles.childName, { color: theme.text }]}
            numberOfLines={1}
          >
            {childName}
          </Text>
          <Text style={[styles.classInfo, { color: theme.textSecondary }]}>
            {childInfo.className} - {childInfo.sectionName}
          </Text>
          <View style={styles.rollNoContainer}>
            <Icon name="numeric" size={14} color={theme.textSecondary} />
            <Text
              style={[
                styles.rollNo,
                { color: theme.textSecondary, marginLeft: 4 },
              ]}
            >
              Roll No: {childInfo.rollNo}
            </Text>
          </View>
          <View style={styles.admissionContainer}>
            <Icon name="school" size={14} color={theme.textSecondary} />
            <Text
              style={[
                styles.admissionNo,
                { color: theme.textSecondary, marginLeft: 4 },
              ]}
            >
              Admission No: {childInfo.admissionNo}
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <TouchableOpacity
          style={[styles.statCard, { backgroundColor: theme.card }]}
          onPress={handleViewAttendance}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.statIconContainer,
              { backgroundColor: theme.success + "20" },
            ]}
          >
            <Icon name="calendar-check" size={24} color={theme.success} />
          </View>
          <Text style={[styles.statValue, { color: theme.text }]}>
            {attendance.present}%
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            Attendance
          </Text>
          <Text style={[styles.statSubLabel, { color: theme.textSecondary }]}>
            {attendance.presentCount}/{attendance.total} days
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.statCard, { backgroundColor: theme.card }]}
          onPress={handleViewGrades}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.statIconContainer,
              { backgroundColor: theme.warning + "20" },
            ]}
          >
            <Icon name="school" size={24} color={theme.warning} />
          </View>
          <Text style={[styles.statValue, { color: theme.text }]}>
            {averageGrade}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            Average Grade
          </Text>
          <Text style={[styles.statSubLabel, { color: theme.textSecondary }]}>
            {recentGrades.length} subjects
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.statCard, { backgroundColor: theme.card }]}
          onPress={handleViewHomework}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.statIconContainer,
              { backgroundColor: theme.primary + "20" },
            ]}
          >
            <Icon name="clock-check" size={24} color={theme.primary} />
          </View>
          <Text style={[styles.statValue, { color: theme.text }]}>
            {homeworkCompletion}%
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            Homework
          </Text>
          <Text style={[styles.statSubLabel, { color: theme.textSecondary }]}>
            Completion Rate
          </Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Quick Actions
          </Text>
        </View>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.background }]}
            onPress={handleViewAttendance}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.actionIconContainer,
                { backgroundColor: theme.primary + "20" },
              ]}
            >
              <Icon name="calendar" size={22} color={theme.primary} />
            </View>
            <Text style={[styles.actionText, { color: theme.text }]}>
              Attendance
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.background }]}
            onPress={handleViewGrades}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.actionIconContainer,
                { backgroundColor: theme.success + "20" },
              ]}
            >
              <Icon name="chart-line" size={22} color={theme.success} />
            </View>
            <Text style={[styles.actionText, { color: theme.text }]}>
              Results
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.background }]}
            onPress={handleViewDiary}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.actionIconContainer,
                { backgroundColor: theme.warning + "20" },
              ]}
            >
              <Icon name="book" size={22} color={theme.warning} />
            </View>
            <Text style={[styles.actionText, { color: theme.text }]}>
              Diary
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.background }]}
            onPress={handleViewFeeLedger}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.actionIconContainer,
                { backgroundColor: theme.warning + "20" },
              ]}
            >
              <Icon name="account" size={22} color={theme.warning} />
            </View>
            <Text style={[styles.actionText, { color: theme.text }]}>
              Student Fee
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.background }]}
            onPress={handleOpenDiary}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.actionIconContainer,
                { backgroundColor: "#f5ad4b20" },
              ]}
            >
              <Icon name="book-open-page-variant" size={22} color="#f5ad4b" />
            </View>
            <Text style={[styles.actionText, { color: theme.text }]}>
              Class Diary
            </Text>
          </TouchableOpacity>

<TouchableOpacity
    style={[styles.actionButton, { backgroundColor: theme.background }]}
    onPress={() => navigation.navigate('ComplaintList', {
        childId: childId,
        childName: childName,
        childData: childInfo
    })}
    activeOpacity={0.7}
>
    <View style={[styles.actionIconContainer, { backgroundColor: '#e74c3c20' }]}>
        <Icon name="file-document-outline" size={22} color="#e74c3c" />
    </View>
    <Text style={[styles.actionText, { color: theme.text }]}>
        Complaints
    </Text>
</TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.background }]}
            onPress={handleViewReports}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.actionIconContainer,
                { backgroundColor: theme.error + "20" },
              ]}
            >
              <Icon name="file-document" size={22} color={theme.error} />
            </View>
            <Text style={[styles.actionText, { color: theme.text }]}>
              Reports
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Today's Diary */}
      {todaysDiary && todaysDiary !== "No diary entry for today." && (
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <View style={styles.sectionHeader}>
            <View style={styles.diaryHeader}>
              <Icon name="book-open-variant" size={20} color={theme.warning} />
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.text, marginLeft: 8 },
                ]}
              >
                Today's Diary
              </Text>
            </View>
            <TouchableOpacity onPress={handleViewDiary}>
              <Text style={[styles.seeAll, { color: theme.primary }]}>
                View All
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.diaryContent,
              {
                backgroundColor: theme.background,
                borderLeftColor: theme.warning,
              },
            ]}
          >
            <Icon
              name="format-quote-open"
              size={20}
              color={theme.textSecondary}
              style={styles.quoteIcon}
            />
            <Text
              style={[styles.diaryText, { color: theme.text }]}
              numberOfLines={3}
            >
              {todaysDiary}
            </Text>
            <Icon
              name="format-quote-close"
              size={20}
              color={theme.textSecondary}
              style={[styles.quoteIcon, styles.quoteClose]}
            />
          </View>
          <Text style={[styles.diaryTime, { color: theme.textSecondary }]}>
            Updated today at {new Date().getHours().toString().padStart(2, "0")}
            :{new Date().getMinutes().toString().padStart(2, "0")}
          </Text>
        </View>
      )}

      {/* Recent Grades */}
      {recentGrades.length > 0 && (
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <View style={styles.sectionHeader}>
            <View style={styles.gradesHeader}>
              <Icon name="trophy" size={20} color={theme.success} />
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.text, marginLeft: 8 },
                ]}
              >
                Recent Results
              </Text>
            </View>
            <TouchableOpacity onPress={handleViewGrades}>
              <Text style={[styles.seeAll, { color: theme.primary }]}>
                View All
              </Text>
            </TouchableOpacity>
          </View>
          {recentGrades.map((grade, index) => (
            <View
              key={index}
              style={[
                styles.gradeItem,
                {
                  backgroundColor: theme.background,
                  borderLeftColor: getGradeColor(grade.grade, theme),
                },
              ]}
            >
              <View style={styles.gradeInfo}>
                <Text style={[styles.subject, { color: theme.text }]}>
                  {grade.subject}
                </Text>
                <Text style={[styles.examType, { color: theme.textSecondary }]}>
                  {grade.examType || "Term Exam"}
                </Text>
                <Text style={[styles.marks, { color: theme.textSecondary }]}>
                  {grade.marks}
                </Text>
              </View>
              <View
                style={[
                  styles.gradeBadge,
                  { backgroundColor: getGradeColor(grade.grade, theme) + "20" },
                ]}
              >
                <Text
                  style={[
                    styles.gradeText,
                    { color: getGradeColor(grade.grade, theme) },
                  ]}
                >
                  {grade.grade}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Child Information */}
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <View style={styles.sectionHeader}>
          <View style={styles.infoHeader}>
            <Icon name="information" size={20} color={theme.primary} />
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.text, marginLeft: 8 },
              ]}
            >
              Child Information
            </Text>
          </View>
        </View>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <View
              style={[
                styles.infoIconContainer,
                { backgroundColor: theme.primary + "10" },
              ]}
            >
              <Icon name="cake" size={18} color={theme.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                Age
              </Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                {childInfo.age}
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <View
              style={[
                styles.infoIconContainer,
                { backgroundColor: theme.success + "10" },
              ]}
            >
              <Icon
                name={
                  childInfo.gender === "Female"
                    ? "gender-female"
                    : "gender-male"
                }
                size={18}
                color={theme.success}
              />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                Gender
              </Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                {childInfo.gender}
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <View
              style={[
                styles.infoIconContainer,
                { backgroundColor: theme.error + "10" },
              ]}
            >
              <Icon name="water" size={18} color={theme.error} />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                Blood Group
              </Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                {childInfo.bloodGroup}
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <View
              style={[
                styles.infoIconContainer,
                { backgroundColor: theme.warning + "10" },
              ]}
            >
              <Icon name="home" size={18} color={theme.warning} />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                Campus
              </Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                {childInfo.campusName}
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <View
              style={[
                styles.infoIconContainer,
                { backgroundColor: theme.info + "10" },
              ]}
            >
              <Icon name="calendar" size={18} color={theme.info} />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                Date of Birth
              </Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                {childInfo.dob !== "N/A"
                  ? new Date(childInfo.dob).toLocaleDateString()
                  : "N/A"}
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <View
              style={[
                styles.infoIconContainer,
                { backgroundColor: theme.secondary + "10" },
              ]}
            >
              <Icon name="map-marker" size={18} color={theme.secondary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                Address
              </Text>
              <Text
                style={[styles.infoValue, { color: theme.text }]}
                numberOfLines={2}
              >
                {childInfo.address}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Empty State Messages */}
      {recentGrades.length === 0 &&
        todaysDiary === "No diary entry for today." && (
          <View style={[styles.emptyState, { backgroundColor: theme.card }]}>
            <Icon
              name="book-open-page-variant"
              size={50}
              color={theme.textSecondary}
            />
            <Text style={[styles.emptyStateTitle, { color: theme.text }]}>
              No Recent Activities
            </Text>
            <Text
              style={[styles.emptyStateText, { color: theme.textSecondary }]}
            >
              Check back later for updates on grades, diary entries, and
              homework.
            </Text>
          </View>
        )}
    </ScrollView>
  );
};

// Helper function for grade colors
const getGradeColor = (grade, theme) => {
  const gradeMap = {
    "A+": theme.success,
    A: theme.success,
    "B+": theme.warning,
    B: theme.warning,
    "C+": theme.secondary,
    C: theme.secondary,
    D: theme.error,
    F: theme.error,
  };
  return gradeMap[grade] || theme.textSecondary;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    margin: 15,
    borderRadius: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  profileInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  classInfo: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: "500",
  },
  rollNoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  admissionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rollNo: {
    fontSize: 14,
  },
  admissionNo: {
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  statSubLabel: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 2,
  },
  section: {
    marginHorizontal: 15,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  diaryHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  gradesHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "600",
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionButton: {
    width: "48%",
    marginBottom: 12,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  actionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  diaryContent: {
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    marginBottom: 10,
    position: "relative",
  },
  diaryText: {
    fontSize: 14,
    lineHeight: 22,
    fontStyle: "italic",
  },
  quoteIcon: {
    position: "absolute",
    top: 5,
    left: 10,
    opacity: 0.3,
  },
  quoteClose: {
    top: "auto",
    bottom: 5,
    right: 10,
    left: "auto",
  },
  diaryTime: {
    fontSize: 12,
    textAlign: "right",
  },
  gradeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  gradeInfo: {
    flex: 1,
  },
  subject: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  examType: {
    fontSize: 12,
    marginBottom: 4,
  },
  marks: {
    fontSize: 14,
    fontWeight: "500",
  },
  gradeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    minWidth: 50,
    alignItems: "center",
  },
  gradeText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  infoItem: {
    width: "48%",
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
  },
  emptyState: {
    marginHorizontal: 15,
    marginBottom: 20,
    padding: 30,
    borderRadius: 15,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  diaryPreviewText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 15,
  },
  diaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 10,
  },
  diaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default ChildDashboardScreen;
