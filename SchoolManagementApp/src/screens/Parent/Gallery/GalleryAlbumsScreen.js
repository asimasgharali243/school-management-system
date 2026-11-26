// import React, { useState, useCallback, useMemo } from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     FlatList,
//     TouchableOpacity,
//     Image,
//     ActivityIndicator,
//     Dimensions,
//     SafeAreaView,
//     RefreshControl,
//     Platform,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import LinearGradient from 'react-native-linear-gradient';
// import { useSelector } from 'react-redux';
// import { selectThemeData } from '../../../store/slices/themeSlice';
// import { useGetStudentAlbumsQuery } from '../../../store/galleryApi';
// import { BASE_URL } from '../../../config/constants';

// const { width: screenWidth } = Dimensions.get('window');
// const COLUMN_GAP = 10;
// const NUM_COLUMNS = 2;
// const CARD_WIDTH = (screenWidth - 40 - COLUMN_GAP) / NUM_COLUMNS;

// const StudentGalleryScreen = ({ route, navigation }) => {
//     const theme = useSelector(selectThemeData);
//     const { classId, sectionId, childName } = route.params;
    
//     const [refreshing, setRefreshing] = useState(false);

//     const {
//         data: albumsData,
//         isLoading,
//         isFetching,
//         refetch,
//     } = useGetStudentAlbumsQuery({
//         classId,
//         sectionId,
//         page: 1,
//         limit: 50, // Fetch all albums for this class/section
//     });

//     const albums = useMemo(() => albumsData?.albums || [], [albumsData]);
//     const totalAlbums = albumsData?.total || 0;

//     const onRefresh = useCallback(async () => {
//         setRefreshing(true);
//         await refetch();
//         setRefreshing(false);
//     }, [refetch]);

//     const handleAlbumPress = useCallback((albumId, albumTitle) => {
//         navigation.navigate('StudentGalleryDetail', {
//             albumId,
//             albumTitle,
//             childName,
//         });
//     }, [navigation, childName]);

//     const getImageUrl = useCallback((url) => {
//         if (!url) return null;
//         if (url.startsWith('http')) return url;
//         return `${BASE_URL}${url}`;
//     }, []);

//     const formatDate = useCallback((dateString) => {
//         if (!dateString) return '';
//         const date = new Date(dateString);
//         return date.toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric',
//         });
//     }, []);

//     const renderAlbumCard = useCallback(({ item }) => (
//         <TouchableOpacity
//             style={[styles.albumCard, { backgroundColor: theme.card }]}
//             onPress={() => handleAlbumPress(item.albumId, item.title)}
//             activeOpacity={0.8}
//         >
//             <View style={styles.imageContainer}>
//                 {item.coverImageUrl ? (
//                     <Image
//                         source={{ uri: getImageUrl(item.coverImageUrl) }}
//                         style={styles.albumCover}
//                         resizeMode="cover"
//                     />
//                 ) : (
//                     <View style={[styles.placeholderCover, { backgroundColor: theme.primary + '20' }]}>
//                         <Icon name="image-multiple" size={40} color={theme.primary} />
//                     </View>
//                 )}
//                 <View style={styles.imageCountBadge}>
//                     <Icon name="image" size={12} color="#FFF" />
//                     <Text style={styles.imageCountText}>{item.imageCount || 0}</Text>
//                 </View>
//             </View>
//             <View style={styles.cardContent}>
//                 <Text style={[styles.albumTitle, { color: theme.text }]} numberOfLines={2}>
//                     {item.title}
//                 </Text>
//                 {item.description ? (
//                     <Text style={[styles.albumDesc, { color: theme.textSecondary }]} numberOfLines={2}>
//                         {item.description}
//                     </Text>
//                 ) : null}
//                 <View style={styles.cardFooter}>
//                     <Icon name="calendar" size={12} color={theme.textTertiary} />
//                     <Text style={[styles.albumDate, { color: theme.textTertiary }]}>
//                         {item.eventDate ? formatDate(item.eventDate) : formatDate(item.createdDt)}
//                     </Text>
//                 </View>
//             </View>
//         </TouchableOpacity>
//     ), [theme, handleAlbumPress, getImageUrl, formatDate]);

//     const renderEmpty = useCallback(() => (
//         <View style={styles.emptyContainer}>
//             <Icon name="image-off-outline" size={80} color={theme.textTertiary} />
//             <Text style={[styles.emptyTitle, { color: theme.text }]}>No Albums Yet</Text>
//             <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
//                 No gallery albums have been created for your class yet. Check back later!
//             </Text>
//         </View>
//     ), [theme]);

//     return (
//         <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
//             <LinearGradient
//                 colors={theme.gradientPrimary || ['#6366F1', '#8B5CF6']}
//                 style={styles.header}
//             >
//                 <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//                     <Icon name="arrow-left" size={24} color="#FFF" />
//                 </TouchableOpacity>
//                 <View style={styles.headerContent}>
//                     <Text style={styles.headerTitle}>Gallery</Text>
//                     <Text style={styles.headerSubtitle}>
//                         {totalAlbums} {totalAlbums === 1 ? 'Album' : 'Albums'} • Class Photos & Events
//                     </Text>
//                 </View>
//             </LinearGradient>

//             {isLoading ? (
//                 <View style={styles.loadingContainer}>
//                     <ActivityIndicator size="large" color={theme.primary} />
//                     <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading albums...</Text>
//                 </View>
//             ) : (
//                 <FlatList
//                     data={albums}
//                     renderItem={renderAlbumCard}
//                     keyExtractor={(item) => item.albumId.toString()}
//                     numColumns={NUM_COLUMNS}
//                     columnWrapperStyle={styles.columnWrapper}
//                     contentContainerStyle={styles.listContent}
//                     showsVerticalScrollIndicator={false}
//                     refreshControl={
//                         <RefreshControl
//                             refreshing={refreshing}
//                             onRefresh={onRefresh}
//                             colors={[theme.primary]}
//                             tintColor={theme.primary}
//                         />
//                     }
//                     ListEmptyComponent={renderEmpty}
//                 />
//             )}
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1 },
//     header: {
//         paddingHorizontal: 20,
//         paddingTop: Platform.OS === 'ios' ? 10 : 15,
//         paddingBottom: 22,
//         borderBottomLeftRadius: 25,
//         borderBottomRightRadius: 25,
//     },
//     backButton: {
//         width: 38,
//         height: 38,
//         borderRadius: 19,
//         backgroundColor: 'rgba(255,255,255,0.2)',
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginBottom: 12,
//     },
//     headerContent: { paddingLeft: 4 },
//     headerTitle: { fontSize: 22, fontWeight: '800', color: '#FFF' },
//     headerSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 3 },
//     listContent: { padding: 15, paddingTop: 16, flexGrow: 1 },
//     columnWrapper: { gap: COLUMN_GAP, marginBottom: COLUMN_GAP },
//     albumCard: {
//         width: CARD_WIDTH,
//         borderRadius: 14,
//         overflow: 'hidden',
//         elevation: 3,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.08,
//         shadowRadius: 8,
//     },
//     imageContainer: { position: 'relative' },
//     albumCover: {
//         width: '100%',
//         height: CARD_WIDTH * 0.8,
//         borderTopLeftRadius: 14,
//         borderTopRightRadius: 14,
//     },
//     placeholderCover: {
//         width: '100%',
//         height: CARD_WIDTH * 0.8,
//         borderTopLeftRadius: 14,
//         borderTopRightRadius: 14,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     imageCountBadge: {
//         position: 'absolute',
//         bottom: 8,
//         right: 8,
//         backgroundColor: 'rgba(0,0,0,0.6)',
//         borderRadius: 10,
//         paddingHorizontal: 8,
//         paddingVertical: 3,
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 4,
//     },
//     imageCountText: { color: '#FFF', fontSize: 11, fontWeight: '600' },
//     cardContent: { padding: 12 },
//     albumTitle: { fontSize: 14, fontWeight: '700', marginBottom: 4, lineHeight: 18 },
//     albumDesc: { fontSize: 12, lineHeight: 16, marginBottom: 8 },
//     cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 4 },
//     albumDate: { fontSize: 11 },
//     emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40, paddingTop: 60 },
//     emptyTitle: { fontSize: 18, fontWeight: '700', marginTop: 16, marginBottom: 8 },
//     emptyText: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
//     loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//     loadingText: { marginTop: 12, fontSize: 14 },
// });

// export default StudentGalleryScreen;
import React, { useState, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Dimensions,
    SafeAreaView,
    RefreshControl,
    Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import { selectThemeData } from '../../../store/slices/themeSlice';
import { useGetStudentAlbumsQuery } from '../../../store/galleryApi';
import { BASE_URL } from '../../../config/constants';

const { width: screenWidth } = Dimensions.get('window');
const COLUMN_GAP = 10;
const NUM_COLUMNS = 2;
const CARD_WIDTH = (screenWidth - 40 - COLUMN_GAP) / NUM_COLUMNS;

// Helper to check if file is video or image
const isVideoFile = (url) => {
    if (!url) return false;
    const ext = url.toLowerCase().split('.').pop();
    return ['mp4', 'mov', 'avi', 'mkv', 'webm', '3gp', 'm4v'].includes(ext);
};

const isImageFile = (url) => {
    if (!url) return false;
    const ext = url.toLowerCase().split('.').pop();
    return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'heic', 'heif'].includes(ext);
};

const StudentGalleryScreen = ({ route, navigation }) => {
    const theme = useSelector(selectThemeData);
    const { classId, sectionId, childName } = route.params;
    
    const [refreshing, setRefreshing] = useState(false);

    const {
        data: albumsData,
        isLoading,
        isFetching,
        refetch,
    } = useGetStudentAlbumsQuery({
        classId,
        sectionId,
        page: 1,
        limit: 50,
    });

    const albums = useMemo(() => albumsData?.albums || [], [albumsData]);
    const totalAlbums = albumsData?.total || 0;

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    }, [refetch]);

    const handleAlbumPress = useCallback((albumId, albumTitle) => {
        navigation.navigate('StudentGalleryDetail', {
            albumId,
            albumTitle,
            childName,
        });
    }, [navigation, childName]);

    const getImageUrl = useCallback((url) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `${BASE_URL}${url}`;
    }, []);

    const formatDate = useCallback((dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    }, []);

    const renderAlbumCard = useCallback(({ item }) => {
        const coverUrl = item.coverImageUrl;
        const isVideo = isVideoFile(coverUrl);
        const isImage = isImageFile(coverUrl);
        const imageUrl = (isImage || isVideo) ? getImageUrl(coverUrl) : '';

        return (
            <TouchableOpacity
                style={[styles.albumCard, { backgroundColor: theme.card }]}
                onPress={() => handleAlbumPress(item.albumId, item.title)}
                activeOpacity={0.8}
            >
                <View style={styles.imageContainer}>
                    {imageUrl && isImage ? (
                        <Image
                            source={{ uri: imageUrl }}
                            style={styles.albumCover}
                            resizeMode="cover"
                        />
                    ) : isVideo ? (
                        <View style={[styles.videoCover, { backgroundColor: theme.primary + '15' }]}>
                            <Icon name="play-circle" size={40} color={theme.primary} />
                            <Text style={[styles.videoText, { color: theme.primary }]}>Video</Text>
                        </View>
                    ) : (
                        <View style={[styles.placeholderCover, { backgroundColor: theme.primary + '20' }]}>
                            <Icon name="image-multiple" size={40} color={theme.primary} />
                        </View>
                    )}
                    <View style={styles.imageCountBadge}>
                        <Icon name="image" size={12} color="#FFF" />
                        <Text style={styles.imageCountText}>{item.imageCount || 0}</Text>
                    </View>
                </View>
                <View style={styles.cardContent}>
                    <Text style={[styles.albumTitle, { color: theme.text }]} numberOfLines={2}>
                        {item.title}
                    </Text>
                    {item.description ? (
                        <Text style={[styles.albumDesc, { color: theme.textSecondary }]} numberOfLines={2}>
                            {item.description}
                        </Text>
                    ) : null}
                    <View style={styles.cardFooter}>
                        <Icon name="calendar" size={12} color={theme.textTertiary} />
                        <Text style={[styles.albumDate, { color: theme.textTertiary }]}>
                            {item.eventDate ? formatDate(item.eventDate) : formatDate(item.createdDt)}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }, [theme, handleAlbumPress, getImageUrl, formatDate]);

    const renderEmpty = useCallback(() => (
        <View style={styles.emptyContainer}>
            <Icon name="image-off-outline" size={80} color={theme.textTertiary} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>No Albums Yet</Text>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No gallery albums have been created for your class yet. Check back later!
            </Text>
        </View>
    ), [theme]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <LinearGradient
                colors={theme.gradientPrimary || ['#6366F1', '#8B5CF6']}
                style={styles.header}
            >
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={24} color="#FFF" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Gallery</Text>
                    <Text style={styles.headerSubtitle}>
                        {totalAlbums} {totalAlbums === 1 ? 'Album' : 'Albums'} • Class Photos & Events
                    </Text>
                </View>
            </LinearGradient>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.primary} />
                    <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading albums...</Text>
                </View>
            ) : (
                <FlatList
                    data={albums}
                    renderItem={renderAlbumCard}
                    keyExtractor={(item) => item.albumId.toString()}
                    numColumns={NUM_COLUMNS}
                    columnWrapperStyle={styles.columnWrapper}
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
                    ListEmptyComponent={renderEmpty}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 10 : 15,
        paddingBottom: 22,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
    },
    backButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    headerContent: { paddingLeft: 4 },
    headerTitle: { fontSize: 22, fontWeight: '800', color: '#FFF' },
    headerSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 3 },
    listContent: { padding: 15, paddingTop: 16, flexGrow: 1 },
    columnWrapper: { gap: COLUMN_GAP, marginBottom: COLUMN_GAP },
    albumCard: {
        width: CARD_WIDTH,
        borderRadius: 14,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
    },
    imageContainer: { position: 'relative' },
    albumCover: {
        width: '100%',
        height: CARD_WIDTH * 0.8,
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
    },
    videoCover: {
        width: '100%',
        height: CARD_WIDTH * 0.8,
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoText: { fontSize: 11, fontWeight: '600', marginTop: 4 },
    placeholderCover: {
        width: '100%',
        height: CARD_WIDTH * 0.8,
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageCountBadge: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 3,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    imageCountText: { color: '#FFF', fontSize: 11, fontWeight: '600' },
    cardContent: { padding: 12 },
    albumTitle: { fontSize: 14, fontWeight: '700', marginBottom: 4, lineHeight: 18 },
    albumDesc: { fontSize: 12, lineHeight: 16, marginBottom: 8 },
    cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    albumDate: { fontSize: 11 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40, paddingTop: 60 },
    emptyTitle: { fontSize: 18, fontWeight: '700', marginTop: 16, marginBottom: 8 },
    emptyText: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 12, fontSize: 14 },
});

export default StudentGalleryScreen;