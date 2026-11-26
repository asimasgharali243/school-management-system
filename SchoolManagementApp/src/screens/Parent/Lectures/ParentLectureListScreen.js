// // src/screens/Parent/Lectures/ParentLectureListScreen.js
// import React, { useState, useCallback } from 'react';
// import {
//     View, Text, StyleSheet, FlatList, TouchableOpacity,
//     ActivityIndicator, RefreshControl, Dimensions, Image,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { useSelector } from 'react-redux';
// import { selectThemeData } from '../../../store/slices/themeSlice';
// import { useGetStudentLecturesQuery } from '../../../store/lectureApi';

// const { width: screenWidth } = Dimensions.get('window');

// const ParentLectureListScreen = ({ route, navigation }) => {
//     const theme = useSelector(selectThemeData);
//     const { classId, sectionId, childName } = route.params || {};
//     const [page, setPage] = useState(1);
//     const [refreshing, setRefreshing] = useState(false);

//     const {
//         data: lecturesData,
//         isLoading,
//         isFetching,
//         refetch,
//     } = useGetStudentLecturesQuery(
//         { classId, sectionId, page, limit: 20 },
//         { skip: !classId || !sectionId }
//     );

//     const lectures = lecturesData?.lectures || [];
//     const totalPages = lecturesData?.totalPages || 1;

//     const onRefresh = useCallback(async () => {
//         setRefreshing(true);
//         setPage(1);
//         await refetch();
//         setRefreshing(false);
//     }, [refetch]);

//     const loadMore = useCallback(() => {
//         if (page < totalPages && !isFetching) {
//             setPage(prev => prev + 1);
//         }
//     }, [page, totalPages, isFetching]);

//     const handleLecturePress = useCallback((lectureId) => {
//         navigation.navigate('ParentLectureDetail', {
//             lectureId,
//             childName,
//         });
//     }, [navigation, childName]);

//     const renderLectureCard = useCallback(({ item }) => {
//         const thumbnailUrl = item.thumbnailUrl && item.thumbnailUrl !== ''
//             ? { uri: item.thumbnailUrl }
//             : null;

//         return (
//             <TouchableOpacity
//                 style={[styles.card, { backgroundColor: theme.card }]}
//                 onPress={() => handleLecturePress(item.lectureId)}
//                 activeOpacity={0.7}
//             >
//                 {/* Thumbnail */}
//                 <View style={styles.thumbnailContainer}>
//                     {thumbnailUrl ? (
//                         <Image
//                             source={thumbnailUrl}
//                             style={styles.thumbnail}
//                             resizeMode="cover"
//                         />
//                     ) : (
//                         <View style={[styles.thumbnailPlaceholder, { backgroundColor: theme.primary + '12' }]}>
//                             <View style={[styles.playIconBg, { backgroundColor: theme.primary + '20' }]}>
//                                 <Icon name="play-circle" size={40} color={theme.primary} />
//                             </View>
//                         </View>
//                     )}
//                     <View style={styles.youtubeBadge}>
//                         <Icon name="youtube" size={12} color="#FFF" />
//                     </View>
//                 </View>

//                 {/* Content */}
//                 <View style={styles.cardContent}>
//                     <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
//                         {item.title}
//                     </Text>

//                     <View style={styles.metaRow}>
//                         <View style={styles.metaItem}>
//                             <Icon name="book-open" size={13} color={theme.textSecondary} />
//                             <Text style={[styles.metaText, { color: theme.textSecondary }]}>
//                                 {item.subjectName || 'N/A'}
//                             </Text>
//                         </View>
//                         <View style={styles.metaItem}>
//                             <Icon name="calendar" size={13} color={theme.textSecondary} />
//                             <Text style={[styles.metaText, { color: theme.textSecondary }]}>
//                                 {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}
//                             </Text>
//                         </View>
//                     </View>

//                     {item.description ? (
//                         <Text style={[styles.description, { color: theme.textTertiary }]} numberOfLines={2}>
//                             {item.description}
//                         </Text>
//                     ) : null}

//                     {/* Badges */}
//                     <View style={styles.badgesRow}>
//                         {item.isFree && (
//                             <View style={[styles.badge, { backgroundColor: theme.success + '15' }]}>
//                                 <Icon name="lock-open-outline" size={10} color={theme.success} />
//                                 <Text style={[styles.badgeText, { color: theme.success }]}>FREE</Text>
//                             </View>
//                         )}
//                         {item.tags && (
//                             <View style={[styles.badge, { backgroundColor: theme.info + '15' }]}>
//                                 <Icon name="tag" size={10} color={theme.info} />
//                                 <Text style={[styles.badgeText, { color: theme.info }]}>{item.tags}</Text>
//                             </View>
//                         )}
//                     </View>
//                 </View>
//             </TouchableOpacity>
//         );
//     }, [theme, handleLecturePress]);

//     const renderEmpty = useCallback(() => (
//         <View style={styles.emptyContainer}>
//             <View style={[styles.emptyIconBg, { backgroundColor: theme.primary + '10' }]}>
//                 <Icon name="video-off" size={50} color={theme.primary} />
//             </View>
//             <Text style={[styles.emptyTitle, { color: theme.text }]}>No Lectures Available</Text>
//             <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
//                 No video lectures have been assigned for this class yet.
//             </Text>
//         </View>
//     ), [theme]);

//     const renderFooter = useCallback(() => {
//         if (!isFetching || page === 1) return null;
//         return (
//             <View style={styles.footerLoader}>
//                 <ActivityIndicator size="small" color={theme.primary} />
//             </View>
//         );
//     }, [isFetching, page, theme.primary]);

//     if (isLoading) {
//         return (
//             <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
//                 <ActivityIndicator size="large" color={theme.primary} />
//                 <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading lectures...</Text>
//             </View>
//         );
//     }

//     return (
//         <View style={[styles.container, { backgroundColor: theme.background }]}>
//             {/* Header */}
//             <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
//                 <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBackBtn}>
//                     <Icon name="arrow-left" size={24} color={theme.text} />
//                 </TouchableOpacity>
//                 <View style={styles.headerInfo}>
//                     <Text style={[styles.headerTitle, { color: theme.text }]}>Video Lectures</Text>
//                     {childName && (
//                         <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
//                             {childName}'s Lectures
//                         </Text>
//                     )}
//                 </View>
//                 <View style={{ width: 40 }} />
//             </View>

//             <FlatList
//                 data={lectures}
//                 renderItem={renderLectureCard}
//                 keyExtractor={(item) => String(item.lectureId)}
//                 contentContainerStyle={styles.listContent}
//                 showsVerticalScrollIndicator={false}
//                 refreshControl={
//                     <RefreshControl
//                         refreshing={refreshing}
//                         onRefresh={onRefresh}
//                         colors={[theme.primary]}
//                         tintColor={theme.primary}
//                     />
//                 }
//                 onEndReached={loadMore}
//                 onEndReachedThreshold={0.3}
//                 ListEmptyComponent={renderEmpty}
//                 ListFooterComponent={renderFooter}
//             />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1 },
//     header: {
//         flexDirection: 'row', alignItems: 'center',
//         paddingHorizontal: 16, paddingTop: 50, paddingBottom: 15,
//         borderBottomWidth: 1,
//     },
//     headerBackBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
//     headerInfo: { flex: 1, marginLeft: 8 },
//     headerTitle: { fontSize: 18, fontWeight: '700' },
//     headerSubtitle: { fontSize: 12, marginTop: 2 },
//     listContent: { padding: 16, paddingBottom: 30 },
//     loadingText: { marginTop: 12, fontSize: 15 },
//     card: {
//         borderRadius: 16, overflow: 'hidden', marginBottom: 16,
//         shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
//     },
//     thumbnailContainer: { position: 'relative', width: '100%', height: 190 },
//     thumbnail: { width: '100%', height: '100%' },
//     thumbnailPlaceholder: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
//     playIconBg: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center' },
//     youtubeBadge: {
//         position: 'absolute', bottom: 10, right: 10,
//         backgroundColor: '#FF0000', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
//     },
//     cardContent: { padding: 14 },
//     title: { fontSize: 16, fontWeight: '600', marginBottom: 10, lineHeight: 22 },
//     metaRow: { flexDirection: 'row', gap: 16, marginBottom: 8 },
//     metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
//     metaText: { fontSize: 12 },
//     description: { fontSize: 13, lineHeight: 18, marginBottom: 10 },
//     badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
//     badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, gap: 4 },
//     badgeText: { fontSize: 10, fontWeight: '600' },
//     emptyContainer: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 30 },
//     emptyIconBg: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
//     emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
//     emptySubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
//     footerLoader: { paddingVertical: 20, alignItems: 'center' },
// });

// export default ParentLectureListScreen;
// src/screens/Parent/Lectures/ParentLectureListScreen.js
import React, { useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    ActivityIndicator, RefreshControl, Dimensions, Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { selectThemeData } from '../../../store/slices/themeSlice';
import { useGetStudentLecturesQuery } from '../../../store/lectureApi';

const { width: screenWidth } = Dimensions.get('window');

const ParentLectureListScreen = ({ route, navigation }) => {
    const theme = useSelector(selectThemeData);
    const { classId, sectionId, childName } = route.params || {};
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);

    const {
        data: lecturesData,
        isLoading,
        isFetching,
        refetch,
    } = useGetStudentLecturesQuery(
        { classId, sectionId, page, limit: 20 },
        { skip: !classId || !sectionId }
    );

    const lectures = lecturesData?.lectures || [];
    const totalPages = lecturesData?.totalPages || 1;

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        setPage(1);
        await refetch();
        setRefreshing(false);
    }, [refetch]);

    const loadMore = useCallback(() => {
        if (page < totalPages && !isFetching) {
            setPage(prev => prev + 1);
        }
    }, [page, totalPages, isFetching]);

    const handleLecturePress = useCallback((lectureId) => {
        navigation.navigate('ParentLectureDetail', {
            lectureId,
            childName,
        });
    }, [navigation, childName]);

    const renderLectureCard = useCallback(({ item }) => {
        const thumbnailUrl = item.thumbnailUrl && item.thumbnailUrl !== ''
            ? { uri: item.thumbnailUrl }
            : null;

        return (
            <TouchableOpacity
                style={[styles.card, { backgroundColor: theme.card }]}
                onPress={() => handleLecturePress(item.lectureId)}
                activeOpacity={0.7}
            >
                {/* Thumbnail - No YouTube badge */}
                <View style={styles.thumbnailContainer}>
                    {thumbnailUrl ? (
                        <Image
                            source={thumbnailUrl}
                            style={styles.thumbnail}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={[styles.thumbnailPlaceholder, { backgroundColor: theme.primary + '12' }]}>
                            <View style={[styles.playIconBg, { backgroundColor: theme.primary + '20' }]}>
                                <Icon name="play-circle" size={40} color={theme.primary} />
                            </View>
                        </View>
                    )}
                    {/* YouTube badge removed */}
                </View>

                {/* Content */}
                <View style={styles.cardContent}>
                    <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
                        {item.title}
                    </Text>

                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <Icon name="book-open" size={13} color={theme.textSecondary} />
                            <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                                {item.subjectName || 'N/A'}
                            </Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Icon name="calendar" size={13} color={theme.textSecondary} />
                            <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                                {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}
                            </Text>
                        </View>
                    </View>

                    {item.description ? (
                        <Text style={[styles.description, { color: theme.textTertiary }]} numberOfLines={2}>
                            {item.description}
                        </Text>
                    ) : null}

                    {/* Badges - No YouTube reference */}
                    <View style={styles.badgesRow}>
                        {item.isFree && (
                            <View style={[styles.badge, { backgroundColor: theme.success + '15' }]}>
                                <Icon name="lock-open-outline" size={10} color={theme.success} />
                                <Text style={[styles.badgeText, { color: theme.success }]}>FREE</Text>
                            </View>
                        )}
                        {item.tags && (
                            <View style={[styles.badge, { backgroundColor: theme.info + '15' }]}>
                                <Icon name="tag" size={10} color={theme.info} />
                                <Text style={[styles.badgeText, { color: theme.info }]}>{item.tags}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }, [theme, handleLecturePress]);

    const renderEmpty = useCallback(() => (
        <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconBg, { backgroundColor: theme.primary + '10' }]}>
                <Icon name="video-off" size={50} color={theme.primary} />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>No Lectures Available</Text>
            <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                No video lectures have been assigned for this class yet.
            </Text>
        </View>
    ), [theme]);

    const renderFooter = useCallback(() => {
        if (!isFetching || page === 1) return null;
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={theme.primary} />
            </View>
        );
    }, [isFetching, page, theme.primary]);

    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading lectures...</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBackBtn}>
                    <Icon name="arrow-left" size={24} color={theme.text} />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Video Lectures</Text>
                    {childName && (
                        <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
                            {childName}'s Lectures
                        </Text>
                    )}
                </View>
                <View style={{ width: 40 }} />
            </View>

            <FlatList
                data={lectures}
                renderItem={renderLectureCard}
                keyExtractor={(item) => String(item.lectureId)}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[theme.primary]}
                        tintColor={theme.primary}
                    />
                }
                onEndReached={loadMore}
                onEndReachedThreshold={0.3}
                ListEmptyComponent={renderEmpty}
                ListFooterComponent={renderFooter}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingTop: 50, paddingBottom: 15,
        borderBottomWidth: 1,
    },
    headerBackBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    headerInfo: { flex: 1, marginLeft: 8 },
    headerTitle: { fontSize: 18, fontWeight: '700' },
    headerSubtitle: { fontSize: 12, marginTop: 2 },
    listContent: { padding: 16, paddingBottom: 30 },
    loadingText: { marginTop: 12, fontSize: 15 },
    card: {
        borderRadius: 16, overflow: 'hidden', marginBottom: 16,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
    },
    thumbnailContainer: { position: 'relative', width: '100%', height: 190 },
    thumbnail: { width: '100%', height: '100%' },
    thumbnailPlaceholder: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
    playIconBg: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center' },
    // youtubeBadge removed
    cardContent: { padding: 14 },
    title: { fontSize: 16, fontWeight: '600', marginBottom: 10, lineHeight: 22 },
    metaRow: { flexDirection: 'row', gap: 16, marginBottom: 8 },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    metaText: { fontSize: 12 },
    description: { fontSize: 13, lineHeight: 18, marginBottom: 10 },
    badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, gap: 4 },
    badgeText: { fontSize: 10, fontWeight: '600' },
    emptyContainer: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 30 },
    emptyIconBg: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
    emptySubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
    footerLoader: { paddingVertical: 20, alignItems: 'center' },
});

export default ParentLectureListScreen;