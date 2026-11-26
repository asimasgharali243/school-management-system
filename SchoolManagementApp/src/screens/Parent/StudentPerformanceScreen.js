
// // export default StudentPerformanceScreen;
// import React, { useState, useMemo } from 'react';
// import {
//     View, Text, StyleSheet, ScrollView, TouchableOpacity,
//     ActivityIndicator, SafeAreaView, Platform,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import LinearGradient from 'react-native-linear-gradient';
// import { useSelector } from 'react-redux';
// import { selectThemeData } from '../../store/slices/themeSlice';
// import { useGetStudentPerformanceQuery,useGetStudentPerformanceSessionYearsQuery } from '../../store/performanceApi';
// import DateTimePicker from '@react-native-community/datetimepicker';

// const MONTHS = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];

// const getGradeColor = (p, theme) => {
//     if (p >= 90) return theme.success;
//     if (p >= 80) return '#10B981';
//     if (p >= 70) return theme.warning;
//     if (p >= 60) return '#F59E0B';
//     return theme.error;
// };

// const StudentPerformanceScreen = ({ route, navigation }) => {
//     const theme = useSelector(selectThemeData);
//     const { regId, childName, childData } = route.params;

//     const currentYear = new Date().getFullYear();
//     const sessionYear = new Date().getMonth() >= 2 ? currentYear : currentYear - 1;

//     const [dateFrom, setDateFrom] = useState(new Date(sessionYear, 2, 1));
//     const [dateTo, setDateTo] = useState(new Date(sessionYear + 1, 1, 28));
//     const [showFromPicker, setShowFromPicker] = useState(false);
//     const [showToPicker, setShowToPicker] = useState(false);
//     const [showFilters, setShowFilters] = useState(false);
//     const [activeTab, setActiveTab] = useState('performance'); // 'performance' | 'remarks'

//     const fmtDate = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
//     const dateFromStr = `${dateFrom.getMonth() + 1}/${dateFrom.getDate()}/${dateFrom.getFullYear()}`;
//     const dateToStr = `${dateTo.getMonth() + 1}/${dateTo.getDate()}/${dateTo.getFullYear()}`;

//     const { data, isLoading, refetch } = useGetStudentPerformanceQuery({
//         regId, sessionYear,
//         classId: childData?.class_ID || 0,
//         sectionId: childData?.section_ID || 0,
//         dateFrom: dateFromStr, dateTo: dateToStr,
//     });
//     const { data: sessionYears = [] } = useGetStudentPerformanceSessionYearsQuery();
//     console.log("sessionYears",sessionYears)

//     const gradeColor = useMemo(() => getGradeColor(data?.overallPercentage || 0, theme), [data, theme]);

//     if (isLoading) {
//         return (
//             <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
//                 <View style={styles.center}><ActivityIndicator size="large" color={theme.primary} /></View>
//             </SafeAreaView>
//         );
//     }

//     return (
//         <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
//             <LinearGradient colors={theme.gradientPrimary || ['#6366F1', '#8B5CF6']} style={styles.header}>
//                 <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
//                     <Icon name="arrow-left" size={24} color="#FFF" />
//                 </TouchableOpacity>
//                 <View style={styles.headerRow}>
//                     <View style={{ flex: 1 }}>
//                         <Text style={styles.headerTitle}>Performance Report</Text>
//                         <Text style={styles.headerSub}>{data?.studentName || childName}</Text>
//                     </View>
//                     <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilters(!showFilters)}>
//                         <Icon name="filter-variant" size={22} color="#FFF" />
//                     </TouchableOpacity>
//                 </View>
//             </LinearGradient>

//             {/* Filter Bar */}
//             {showFilters && (
//                 <View style={[styles.filterBar, { backgroundColor: theme.card }]}>
//                     <TouchableOpacity style={[styles.dateBtn, { borderColor: theme.border }]} onPress={() => setShowFromPicker(true)}>
//                         <Icon name="calendar-start" size={14} color={theme.primary} />
//                         <Text style={[styles.dateText, { color: theme.text }]}>{fmtDate(dateFrom)}</Text>
//                     </TouchableOpacity>
//                     <Icon name="arrow-right" size={18} color={theme.textTertiary} />
//                     <TouchableOpacity style={[styles.dateBtn, { borderColor: theme.border }]} onPress={() => setShowToPicker(true)}>
//                         <Icon name="calendar-end" size={14} color={theme.primary} />
//                         <Text style={[styles.dateText, { color: theme.text }]}>{fmtDate(dateTo)}</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity style={[styles.applyBtn, { backgroundColor: theme.primary }]} onPress={() => { refetch(); setShowFilters(false); }}>
//                         <Text style={styles.applyBtnText}>Apply</Text>
//                     </TouchableOpacity>
//                 </View>
//             )}

//             {showFromPicker && <DateTimePicker value={dateFrom} mode="date" onChange={(_, d) => { setShowFromPicker(false); if (d) setDateFrom(d); }} />}
//             {showToPicker && <DateTimePicker value={dateTo} mode="date" onChange={(_, d) => { setShowToPicker(false); if (d) setDateTo(d); }} />}

//             {/* Tab Bar */}
//             <View style={[styles.tabBar, { backgroundColor: theme.card }]}>
//                 <TouchableOpacity
//                     style={[styles.tab, activeTab === 'performance' && { borderBottomColor: theme.primary, borderBottomWidth: 3 }]}
//                     onPress={() => setActiveTab('performance')}
//                 >
//                     <Icon name="chart-bar" size={18} color={activeTab === 'performance' ? theme.primary : theme.textTertiary} />
//                     <Text style={[styles.tabText, { color: activeTab === 'performance' ? theme.primary : theme.textTertiary }]}>Performance</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                     style={[styles.tab, activeTab === 'remarks' && { borderBottomColor: theme.primary, borderBottomWidth: 3 }]}
//                     onPress={() => setActiveTab('remarks')}
//                 >
//                     <Icon name="comment-text" size={18} color={activeTab === 'remarks' ? theme.primary : theme.textTertiary} />
//                     <Text style={[styles.tabText, { color: activeTab === 'remarks' ? theme.primary : theme.textTertiary }]}>Remarks</Text>
//                 </TouchableOpacity>
//             </View>

//             <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
//                 {/* Student Info Card */}
//                 <View style={[styles.card, { backgroundColor: theme.card }]}>
//                     <View style={styles.studentRow}>
//                         <View style={[styles.avatar, { backgroundColor: theme.primary + '15' }]}>
//                             <Icon name="account-circle" size={40} color={theme.primary} />
//                         </View>
//                         <View style={{ flex: 1 }}>
//                             <Text style={[styles.studentName, { color: theme.text }]}>{data?.studentName || childName}</Text>
//                             <Text style={[styles.studentClass, { color: theme.textSecondary }]}>
//                                 {data?.className || 'N/A'} / {data?.section || 'N/A'} | {data?.campusName || 'N/A'}
//                             </Text>
//                         </View>
//                         <View style={[styles.gradeCircle, { backgroundColor: gradeColor + '20', borderColor: gradeColor }]}>
//                             <Text style={[styles.gradeCircleText, { color: gradeColor }]}>{data?.overallGrade || 'N/A'}</Text>
//                         </View>
//                     </View>
//                     <View style={styles.scoreStrip}>
//                         <View style={styles.scoreItem}>
//                             <Text style={[styles.scoreVal, { color: theme.text }]}>{data?.overallObtained || 0}</Text>
//                             <Text style={[styles.scoreLbl, { color: theme.textTertiary }]}>Obtained</Text>
//                         </View>
//                         <View style={styles.scoreDivider} />
//                         <View style={styles.scoreItem}>
//                             <Text style={[styles.scoreVal, { color: theme.text }]}>{data?.overallTotal || 0}</Text>
//                             <Text style={[styles.scoreLbl, { color: theme.textTertiary }]}>Total</Text>
//                         </View>
//                         <View style={styles.scoreDivider} />
//                         <View style={styles.scoreItem}>
//                             <Text style={[styles.scoreVal, { color: gradeColor }]}>{data?.overallPercentage || 0}%</Text>
//                             <Text style={[styles.scoreLbl, { color: theme.textTertiary }]}>Percentage</Text>
//                         </View>
//                     </View>
//                 </View>

//                 {activeTab === 'performance' ? (
//                     <>
//                         {/* Monthly Performance Table */}
//                         <View style={[styles.card, { backgroundColor: theme.card }]}>
//                             <Text style={[styles.sectionTitle, { color: theme.text }]}>Monthly Performance</Text>
//                             <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                                 <View>
//                                     {/* Table Header */}
//                                     <View style={[styles.tRow, styles.tHeader, { backgroundColor: '#E2E8F0' }]}>
//                                         <View style={[styles.tCell, styles.tNameCol]}><Text style={styles.tHText}>Category</Text></View>
//                                         <View style={[styles.tCell, styles.tMarksCol]}><Text style={styles.tHText}>M</Text></View>
//                                         {MONTHS.map((m, i) => (
//                                             <View key={i} style={[styles.tCell, styles.tMonthCol]}>
//                                                 <Text style={styles.tHText}>{m}</Text>
//                                             </View>
//                                         ))}
//                                     </View>

//                                     {/* Category & Subcategory Rows */}
//                                     {data?.categories?.map(cat => (
//                                         <View key={`cat-${cat.categoryId}`}>
//                                             <View style={[styles.tRow, styles.tCatRow]}>
//                                                 <View style={[styles.tCell, styles.tNameCol]}>
//                                                     <Text style={[styles.tBold, { color: theme.text }]} numberOfLines={1}>{cat.categoryName}</Text>
//                                                 </View>
//                                                 <View style={[styles.tCell, styles.tMarksCol]}>
//                                                     <Text style={[styles.tBold, { color: theme.text }]}>{cat.totalMarks}</Text>
//                                                 </View>
//                                                 {MONTHS.map((_, i) => <View key={i} style={[styles.tCell, styles.tMonthCol]} />)}
//                                             </View>
//                                             {cat.subCategories?.map(sub => (
//                                                 <View key={`sub-${sub.subCategoryId}`} style={styles.tRow}>
//                                                     <View style={[styles.tCell, styles.tNameCol]}>
//                                                         <Text style={[styles.tSubText, { color: theme.textSecondary }]} numberOfLines={1}>{sub.subCategoryName}</Text>
//                                                     </View>
//                                                     <View style={[styles.tCell, styles.tMarksCol]}>
//                                                         <Text style={[styles.tValText, { color: theme.text }]}>{sub.totalMarks}</Text>
//                                                     </View>
//                                                     {[3,4,5,6,7,8,9,10,11,12,1,2].map(m => {
//                                                         const mm = sub.monthlyMarks?.find(x => x.month === m);
//                                                         return (
//                                                             <View key={m} style={[styles.tCell, styles.tMonthCol]}>
//                                                                 <Text style={[styles.tValText, { color: theme.text }]}>{mm?.obtained ?? ''}</Text>
//                                                             </View>
//                                                         );
//                                                     })}
//                                                 </View>
//                                             ))}
//                                         </View>
//                                     ))}

//                                     {/* Summary Rows */}
//                                     <View style={[styles.tRow, styles.tSumRow]}>
//                                         <View style={[styles.tCell, styles.tNameCol]}>
//                                             <Text style={[styles.tBold, { color: theme.text }]}>Total Marks</Text>
//                                         </View>
//                                         <View style={[styles.tCell, styles.tMarksCol]} />
//                                         {[3,4,5,6,7,8,9,10,11,12,1,2].map(m => {
//                                             const mt = data?.monthlyTotals?.find(x => x.month === m);
//                                             return (
//                                                 <View key={m} style={[styles.tCell, styles.tMonthCol]}>
//                                                     <Text style={[styles.tBold, { color: theme.text }]}>{mt?.totalMarks ?? ''}</Text>
//                                                 </View>
//                                             );
//                                         })}
//                                     </View>
//                                     <View style={[styles.tRow, styles.tSumRow]}>
//                                         <View style={[styles.tCell, styles.tNameCol]}>
//                                             <Text style={[styles.tBold, { color: theme.success }]}>Obtained</Text>
//                                         </View>
//                                         <View style={[styles.tCell, styles.tMarksCol]} />
//                                         {[3,4,5,6,7,8,9,10,11,12,1,2].map(m => {
//                                             const mt = data?.monthlyTotals?.find(x => x.month === m);
//                                             return (
//                                                 <View key={m} style={[styles.tCell, styles.tMonthCol]}>
//                                                     <Text style={[styles.tBold, { color: theme.success }]}>{mt?.obtainedMarks ?? ''}</Text>
//                                                 </View>
//                                             );
//                                         })}
//                                     </View>
//                                     <View style={[styles.tRow, styles.tSumRow]}>
//                                         <View style={[styles.tCell, styles.tNameCol]}>
//                                             <Text style={[styles.tBold, { color: theme.primary }]}>Percentage</Text>
//                                         </View>
//                                         <View style={[styles.tCell, styles.tMarksCol]} />
//                                         {[3,4,5,6,7,8,9,10,11,12,1,2].map(m => {
//                                             const mt = data?.monthlyTotals?.find(x => x.month === m);
//                                             const pct = mt?.percentage || 0;
//                                             const clr = pct >= 80 ? theme.success : pct >= 60 ? theme.warning : theme.error;
//                                             return (
//                                                 <View key={m} style={[styles.tCell, styles.tMonthCol]}>
//                                                     <Text style={[styles.tBold, { color: clr }]}>{pct}%</Text>
//                                                 </View>
//                                             );
//                                         })}
//                                     </View>
//                                 </View>
//                             </ScrollView>
//                         </View>
//                     </>
//                 ) : (
//                     /* Monthly Remarks */
//                     <View style={[styles.card, { backgroundColor: theme.card }]}>
//                         <Text style={[styles.sectionTitle, { color: theme.text }]}>Monthly Remarks</Text>
//                         {data?.monthlyRemarks?.some(r => r.remarks) ? (
//                             data.monthlyRemarks.filter(r => r.remarks).map((r, idx) => (
//                                 <View key={idx} style={[styles.remarkCard, { backgroundColor: theme.background }]}>
//                                     <View style={[styles.remarkBadge, { backgroundColor: theme.primary + '15' }]}>
//                                         <Text style={[styles.remarkBadgeText, { color: theme.primary }]}>{r.monthName}</Text>
//                                     </View>
//                                     <Text style={[styles.remarkContent, { color: theme.textSecondary }]}>{r.remarks}</Text>
//                                 </View>
//                             ))
//                         ) : (
//                             <View style={styles.emptyRemarks}>
//                                 <Icon name="comment-text-outline" size={50} color={theme.textTertiary} />
//                                 <Text style={[styles.emptyText, { color: theme.textTertiary }]}>No remarks available</Text>
//                             </View>
//                         )}
//                     </View>
//                 )}

//                 <View style={{ height: 30 }} />
//             </ScrollView>
//         </SafeAreaView>
//     );
// };

// const CELL_WIDTH = 38;

// const styles = StyleSheet.create({
//     container: { flex: 1 },
//     center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//     header: { paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 10 : 15, paddingBottom: 22, borderBottomLeftRadius: 25, borderBottomRightRadius: 25 },
//     backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
//     headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
//     headerTitle: { fontSize: 22, fontWeight: '800', color: '#FFF' },
//     headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
//     filterBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
//     filterBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, marginHorizontal: 14, marginTop: 14, borderRadius: 12, elevation: 2, gap: 6 },
//     dateBtn: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 6, gap: 4 },
//     dateText: { fontSize: 11, fontWeight: '500' },
//     applyBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
//     applyBtnText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
//     scrollContent: { padding: 14, paddingTop: 8 },
    
//     // Tab Bar
//     tabBar: { flexDirection: 'row', marginHorizontal: 14, borderRadius: 12, marginBottom: 12, elevation: 1 },
//     tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, gap: 6 },
//     tabText: { fontSize: 13, fontWeight: '600' },
    
//     // Card
//     card: { padding: 14, borderRadius: 14, marginBottom: 12, elevation: 2 },
//     sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
    
//     // Student Info
//     studentRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
//     avatar: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
//     studentName: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
//     studentClass: { fontSize: 12 },
//     gradeCircle: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', borderWidth: 2 },
//     gradeCircleText: { fontSize: 16, fontWeight: '800' },
    
//     scoreStrip: { flexDirection: 'row', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#E2E8F0' },
//     scoreItem: { flex: 1, alignItems: 'center' },
//     scoreVal: { fontSize: 18, fontWeight: '700' },
//     scoreLbl: { fontSize: 10, marginTop: 2 },
//     scoreDivider: { width: 1, height: 30, backgroundColor: '#E2E8F0' },
    
//     // Table
//     tRow: { flexDirection: 'row' },
//     tHeader: {},
//     tCatRow: { backgroundColor: 'rgba(0,0,0,0.03)' },
//     tSumRow: { backgroundColor: 'rgba(0,0,0,0.06)' },
//     tCell: { paddingVertical: 5, paddingHorizontal: 3, borderWidth: 0.5, borderColor: '#D1D5DB', justifyContent: 'center' },
//     tNameCol: { width: 100, paddingLeft: 6 },
//     tMarksCol: { width: 32, alignItems: 'center' },
//     tMonthCol: { width: CELL_WIDTH, alignItems: 'center' },
//     tHText: { fontSize: 9, fontWeight: '700', textAlign: 'center', color: '#374151' },
//     tBold: { fontSize: 10, fontWeight: '700' },
//     tSubText: { fontSize: 9 },
//     tValText: { fontSize: 9 },
    
//     // Remarks
//     remarkCard: { flexDirection: 'row', alignItems: 'flex-start', padding: 10, borderRadius: 10, marginBottom: 8, gap: 10 },
//     remarkBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
//     remarkBadgeText: { fontSize: 11, fontWeight: '600' },
//     remarkContent: { fontSize: 12, flex: 1, lineHeight: 18 },
//     emptyRemarks: { alignItems: 'center', paddingVertical: 30 },
//     emptyText: { fontSize: 13, marginTop: 8 },
// });

// export default StudentPerformanceScreen;
// export default StudentPerformanceScreen;
import React, { useState, useMemo, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    ActivityIndicator, SafeAreaView, Platform, Modal, FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import { selectThemeData } from '../../store/slices/themeSlice';
import { useGetStudentPerformanceQuery, useGetStudentPerformanceSessionYearsQuery } from '../../store/performanceApi';

const MONTHS = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];

const getGradeColor = (p, theme) => {
    if (p >= 90) return theme.success;
    if (p >= 80) return '#10B981';
    if (p >= 70) return theme.warning;
    if (p >= 60) return '#F59E0B';
    return theme.error;
};

const StudentPerformanceScreen = ({ route, navigation }) => {
    const theme = useSelector(selectThemeData);
    const { regId, childName, childData } = route.params;

    const [activeTab, setActiveTab] = useState('performance'); // 'performance' | 'remarks'
    const [showYearPicker, setShowYearPicker] = useState(false);

    // Get session years from API
    const { data: sessionYearsData = [], isLoading: isLoadingYears } = useGetStudentPerformanceSessionYearsQuery();
    
    // Extract unique session years
    const sessionYearsList = useMemo(() => {
        if (sessionYearsData && sessionYearsData.length > 0) {
            // Filter unique years and sort descending
            const years = [...new Set(sessionYearsData.map(item => item.name))];
            return years.sort((a, b) => b - a);
        }
        // Default to current year if no data
        const currentYear = new Date().getFullYear();
        return [currentYear];
    }, [sessionYearsData]);

    // Selected session year
    const [selectedSessionYear, setSelectedSessionYear] = useState(null);

    // Calculate dates based on session year
    const getDatesFromSessionYear = (year) => {
        const dateFrom = new Date(year, 2, 1); // March 1st
        const dateTo = new Date(year + 1, 1, 28); // Feb 28th of next year
        return { dateFrom, dateTo };
    };

    // Initialize with first available session year
    useEffect(() => {
        if (sessionYearsList.length > 0 && !selectedSessionYear) {
            const defaultYear = sessionYearsList[0];
            setSelectedSessionYear(defaultYear);
        }
    }, [sessionYearsList]);

    // Update dates when session year changes
    const { dateFrom, dateTo } = useMemo(() => {
        if (selectedSessionYear) {
            return getDatesFromSessionYear(selectedSessionYear);
        }
        const currentYear = new Date().getFullYear();
        return getDatesFromSessionYear(currentYear);
    }, [selectedSessionYear]);

    const fmtDate = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const dateFromStr = `${dateFrom.getMonth() + 1}/${dateFrom.getDate()}/${dateFrom.getFullYear()}`;
    const dateToStr = `${dateTo.getMonth() + 1}/${dateTo.getDate()}/${dateTo.getFullYear()}`;

    const { data, isLoading, refetch } = useGetStudentPerformanceQuery({
        regId,
        sessionYear: selectedSessionYear || new Date().getFullYear(),
        classId: childData?.class_ID || 0,
        sectionId: childData?.section_ID || 0,
        dateFrom: dateFromStr,
        dateTo: dateToStr,
    });

    const gradeColor = useMemo(() => getGradeColor(data?.overallPercentage || 0, theme), [data, theme]);

    // Handle session year selection
    const handleYearSelect = (year) => {
        setSelectedSessionYear(year);
        setShowYearPicker(false);
    };

    if (isLoading || isLoadingYears) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={styles.center}><ActivityIndicator size="large" color={theme.primary} /></View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <LinearGradient colors={theme.gradientPrimary || ['#6366F1', '#8B5CF6']} style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={24} color="#FFF" />
                </TouchableOpacity>
                <View style={styles.headerRow}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.headerTitle}>Performance Report</Text>
                        <Text style={styles.headerSub}>{data?.studentName || childName}</Text>
                    </View>
                    {/* Session Year Selector Button */}
                    <TouchableOpacity style={styles.yearSelectorBtn} onPress={() => setShowYearPicker(true)}>
                        <Icon name="calendar" size={18} color="#FFF" />
                        <Text style={styles.yearSelectorText}>{selectedSessionYear || 'Select Year'}</Text>
                        <Icon name="chevron-down" size={18} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {/* Session Year Picker Modal */}
            <Modal
                visible={showYearPicker}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowYearPicker(false)}
            >
                <TouchableOpacity 
                    style={styles.modalOverlay} 
                    activeOpacity={1} 
                    onPress={() => setShowYearPicker(false)}
                >
                    <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: theme.text }]}>Select Session Year</Text>
                            <TouchableOpacity onPress={() => setShowYearPicker(false)}>
                                <Icon name="close" size={24} color={theme.textSecondary} />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={sessionYearsList}
                            keyExtractor={(item) => item.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.yearOption,
                                        selectedSessionYear === item && { backgroundColor: theme.primary + '15' }
                                    ]}
                                    onPress={() => handleYearSelect(item)}
                                >
                                    <Text style={[styles.yearOptionText, { color: theme.text }]}>{item}</Text>
                                    {selectedSessionYear === item && (
                                        <Icon name="check" size={20} color={theme.primary} />
                                    )}
                                </TouchableOpacity>
                            )}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Tab Bar - Your existing tab bar */}
            <View style={[styles.tabBar, { backgroundColor: theme.card }]}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'performance' && { borderBottomColor: theme.primary, borderBottomWidth: 3 }]}
                    onPress={() => setActiveTab('performance')}
                >
                    <Icon name="chart-bar" size={18} color={activeTab === 'performance' ? theme.primary : theme.textTertiary} />
                    <Text style={[styles.tabText, { color: activeTab === 'performance' ? theme.primary : theme.textTertiary }]}>Performance</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'remarks' && { borderBottomColor: theme.primary, borderBottomWidth: 3 }]}
                    onPress={() => setActiveTab('remarks')}
                >
                    <Icon name="comment-text" size={18} color={activeTab === 'remarks' ? theme.primary : theme.textTertiary} />
                    <Text style={[styles.tabText, { color: activeTab === 'remarks' ? theme.primary : theme.textTertiary }]}>Remarks</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Student Info Card */}
                <View style={[styles.card, { backgroundColor: theme.card }]}>
                    <View style={styles.studentRow}>
                        <View style={[styles.avatar, { backgroundColor: theme.primary + '15' }]}>
                            <Icon name="account-circle" size={40} color={theme.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.studentName, { color: theme.text }]}>{data?.studentName || childName}</Text>
                            <Text style={[styles.studentClass, { color: theme.textSecondary }]}>
                                {data?.className || 'N/A'} / {data?.section || 'N/A'} | {data?.campusName || 'N/A'}
                            </Text>
                        </View>
                        <View style={[styles.gradeCircle, { backgroundColor: gradeColor + '20', borderColor: gradeColor }]}>
                            <Text style={[styles.gradeCircleText, { color: gradeColor }]}>{data?.overallGrade || 'N/A'}</Text>
                        </View>
                    </View>
                    <View style={styles.scoreStrip}>
                        <View style={styles.scoreItem}>
                            <Text style={[styles.scoreVal, { color: theme.text }]}>{data?.overallObtained || 0}</Text>
                            <Text style={[styles.scoreLbl, { color: theme.textTertiary }]}>Obtained</Text>
                        </View>
                        <View style={styles.scoreDivider} />
                        <View style={styles.scoreItem}>
                            <Text style={[styles.scoreVal, { color: theme.text }]}>{data?.overallTotal || 0}</Text>
                            <Text style={[styles.scoreLbl, { color: theme.textTertiary }]}>Total</Text>
                        </View>
                        <View style={styles.scoreDivider} />
                        <View style={styles.scoreItem}>
                            <Text style={[styles.scoreVal, { color: gradeColor }]}>{data?.overallPercentage || 0}%</Text>
                            <Text style={[styles.scoreLbl, { color: theme.textTertiary }]}>Percentage</Text>
                        </View>
                    </View>
                </View>

                {activeTab === 'performance' ? (
                    <>
                        {/* Monthly Performance Table */}
                        <View style={[styles.card, { backgroundColor: theme.card }]}>
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>Monthly Performance</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View>
                                    {/* Table Header */}
                                    <View style={[styles.tRow, styles.tHeader, { backgroundColor: '#E2E8F0' }]}>
                                        <View style={[styles.tCell, styles.tNameCol]}><Text style={styles.tHText}>Category</Text></View>
                                        <View style={[styles.tCell, styles.tMarksCol]}><Text style={styles.tHText}>M</Text></View>
                                        {MONTHS.map((m, i) => (
                                            <View key={i} style={[styles.tCell, styles.tMonthCol]}>
                                                <Text style={styles.tHText}>{m}</Text>
                                            </View>
                                        ))}
                                    </View>

                                    {/* Category & Subcategory Rows */}
                                    {data?.categories?.map(cat => (
                                        <View key={`cat-${cat.categoryId}`}>
                                            <View style={[styles.tRow, styles.tCatRow]}>
                                                <View style={[styles.tCell, styles.tNameCol]}>
                                                    <Text style={[styles.tBold, { color: theme.text }]} numberOfLines={1}>{cat.categoryName}</Text>
                                                </View>
                                                <View style={[styles.tCell, styles.tMarksCol]}>
                                                    <Text style={[styles.tBold, { color: theme.text }]}>{cat.totalMarks}</Text>
                                                </View>
                                                {MONTHS.map((_, i) => <View key={i} style={[styles.tCell, styles.tMonthCol]} />)}
                                            </View>
                                            {cat.subCategories?.map(sub => (
                                                <View key={`sub-${sub.subCategoryId}`} style={styles.tRow}>
                                                    <View style={[styles.tCell, styles.tNameCol]}>
                                                        <Text style={[styles.tSubText, { color: theme.textSecondary }]} numberOfLines={1}>{sub.subCategoryName}</Text>
                                                    </View>
                                                    <View style={[styles.tCell, styles.tMarksCol]}>
                                                        <Text style={[styles.tValText, { color: theme.text }]}>{sub.totalMarks}</Text>
                                                    </View>
                                                    {[3,4,5,6,7,8,9,10,11,12,1,2].map(m => {
                                                        const mm = sub.monthlyMarks?.find(x => x.month === m);
                                                        return (
                                                            <View key={m} style={[styles.tCell, styles.tMonthCol]}>
                                                                <Text style={[styles.tValText, { color: theme.text }]}>{mm?.obtained ?? ''}</Text>
                                                            </View>
                                                        );
                                                    })}
                                                </View>
                                            ))}
                                        </View>
                                    ))}

                                    {/* Summary Rows */}
                                    <View style={[styles.tRow, styles.tSumRow]}>
                                        <View style={[styles.tCell, styles.tNameCol]}>
                                            <Text style={[styles.tBold, { color: theme.text }]}>Total Marks</Text>
                                        </View>
                                        <View style={[styles.tCell, styles.tMarksCol]} />
                                        {[3,4,5,6,7,8,9,10,11,12,1,2].map(m => {
                                            const mt = data?.monthlyTotals?.find(x => x.month === m);
                                            return (
                                                <View key={m} style={[styles.tCell, styles.tMonthCol]}>
                                                    <Text style={[styles.tBold, { color: theme.text }]}>{mt?.totalMarks ?? ''}</Text>
                                                </View>
                                            );
                                        })}
                                    </View>
                                    <View style={[styles.tRow, styles.tSumRow]}>
                                        <View style={[styles.tCell, styles.tNameCol]}>
                                            <Text style={[styles.tBold, { color: theme.success }]}>Obtained</Text>
                                        </View>
                                        <View style={[styles.tCell, styles.tMarksCol]} />
                                        {[3,4,5,6,7,8,9,10,11,12,1,2].map(m => {
                                            const mt = data?.monthlyTotals?.find(x => x.month === m);
                                            return (
                                                <View key={m} style={[styles.tCell, styles.tMonthCol]}>
                                                    <Text style={[styles.tBold, { color: theme.success }]}>{mt?.obtainedMarks ?? ''}</Text>
                                                </View>
                                            );
                                        })}
                                    </View>
                                    <View style={[styles.tRow, styles.tSumRow]}>
                                        <View style={[styles.tCell, styles.tNameCol]}>
                                            <Text style={[styles.tBold, { color: theme.primary }]}>Percentage</Text>
                                        </View>
                                        <View style={[styles.tCell, styles.tMarksCol]} />
                                        {[3,4,5,6,7,8,9,10,11,12,1,2].map(m => {
                                            const mt = data?.monthlyTotals?.find(x => x.month === m);
                                            const pct = mt?.percentage || 0;
                                            const clr = pct >= 80 ? theme.success : pct >= 60 ? theme.warning : theme.error;
                                            return (
                                                <View key={m} style={[styles.tCell, styles.tMonthCol]}>
                                                    <Text style={[styles.tBold, { color: clr }]}>{pct}%</Text>
                                                </View>
                                            );
                                        })}
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    </>
                ) : (
                    /* Monthly Remarks */
                    <View style={[styles.card, { backgroundColor: theme.card }]}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Monthly Remarks</Text>
                        {data?.monthlyRemarks?.some(r => r.remarks) ? (
                            data.monthlyRemarks.filter(r => r.remarks).map((r, idx) => (
                                <View key={idx} style={[styles.remarkCard, { backgroundColor: theme.background }]}>
                                    <View style={[styles.remarkBadge, { backgroundColor: theme.primary + '15' }]}>
                                        <Text style={[styles.remarkBadgeText, { color: theme.primary }]}>{r.monthName}</Text>
                                    </View>
                                    <Text style={[styles.remarkContent, { color: theme.textSecondary }]}>{r.remarks}</Text>
                                </View>
                            ))
                        ) : (
                            <View style={styles.emptyRemarks}>
                                <Icon name="comment-text-outline" size={50} color={theme.textTertiary} />
                                <Text style={[styles.emptyText, { color: theme.textTertiary }]}>No remarks available</Text>
                            </View>
                        )}
                    </View>
                )}

                <View style={{ height: 30 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const CELL_WIDTH = 38;

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 10 : 15, paddingBottom: 22, borderBottomLeftRadius: 25, borderBottomRightRadius: 25 },
    backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    headerTitle: { fontSize: 22, fontWeight: '800', color: '#FFF' },
    headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
    yearSelectorBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, gap: 6 },
    yearSelectorText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
    scrollContent: { padding: 14, paddingTop: 8 },
    
    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { width: '80%', maxHeight: '70%', borderRadius: 16, padding: 16, elevation: 5 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
    modalTitle: { fontSize: 18, fontWeight: '700' },
    yearOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12, borderRadius: 10, marginBottom: 4 },
    yearOptionText: { fontSize: 16 },
    
    // Tab Bar
    tabBar: { flexDirection: 'row', marginHorizontal: 14, borderRadius: 12, marginBottom: 12, elevation: 1 },
    tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, gap: 6 },
    tabText: { fontSize: 13, fontWeight: '600' },
    
    // Card
    card: { padding: 14, borderRadius: 14, marginBottom: 12, elevation: 2 },
    sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
    
    // Student Info
    studentRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
    avatar: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    studentName: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
    studentClass: { fontSize: 12 },
    gradeCircle: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', borderWidth: 2 },
    gradeCircleText: { fontSize: 16, fontWeight: '800' },
    
    scoreStrip: { flexDirection: 'row', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#E2E8F0' },
    scoreItem: { flex: 1, alignItems: 'center' },
    scoreVal: { fontSize: 18, fontWeight: '700' },
    scoreLbl: { fontSize: 10, marginTop: 2 },
    scoreDivider: { width: 1, height: 30, backgroundColor: '#E2E8F0' },
    
    // Table
    tRow: { flexDirection: 'row' },
    tHeader: {},
    tCatRow: { backgroundColor: 'rgba(0,0,0,0.03)' },
    tSumRow: { backgroundColor: 'rgba(0,0,0,0.06)' },
    tCell: { paddingVertical: 5, paddingHorizontal: 3, borderWidth: 0.5, borderColor: '#D1D5DB', justifyContent: 'center' },
    tNameCol: { width: 100, paddingLeft: 6 },
    tMarksCol: { width: 32, alignItems: 'center' },
    tMonthCol: { width: CELL_WIDTH, alignItems: 'center' },
    tHText: { fontSize: 9, fontWeight: '700', textAlign: 'center', color: '#374151' },
    tBold: { fontSize: 10, fontWeight: '700' },
    tSubText: { fontSize: 9 },
    tValText: { fontSize: 9 },
    
    // Remarks
    remarkCard: { flexDirection: 'row', alignItems: 'flex-start', padding: 10, borderRadius: 10, marginBottom: 8, gap: 10 },
    remarkBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    remarkBadgeText: { fontSize: 11, fontWeight: '600' },
    remarkContent: { fontSize: 12, flex: 1, lineHeight: 18 },
    emptyRemarks: { alignItems: 'center', paddingVertical: 30 },
    emptyText: { fontSize: 13, marginTop: 8 },
});

export default StudentPerformanceScreen;