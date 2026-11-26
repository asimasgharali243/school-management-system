// import React, { useState, useCallback } from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     Image,
//     Dimensions,
//     SafeAreaView,
//     TouchableOpacity,
//     ActivityIndicator,
//     Modal,
//     FlatList,
//     Platform,
//     StatusBar,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import LinearGradient from 'react-native-linear-gradient';
// import { useSelector } from 'react-redux';
// import { selectThemeData } from '../../../store/slices/themeSlice';
// import { useGetGalleryAlbumQuery } from '../../../store/galleryApi';
// import { BASE_URL } from '../../../config/constants';

// const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
// const IMAGE_GAP = 2;
// const NUM_COLUMNS = 3;
// const IMAGE_SIZE = (screenWidth - 32 - (IMAGE_GAP * (NUM_COLUMNS - 1))) / NUM_COLUMNS;

// const StudentGalleryDetailScreen = ({ route, navigation }) => {
//     const theme = useSelector(selectThemeData);
//     const { albumId, albumTitle, childName } = route.params;
    
//     const [selectedImageIndex, setSelectedImageIndex] = useState(null);

//     const {
//         data: album,
//         isLoading,
//     } = useGetGalleryAlbumQuery(albumId);


//     console.log('Album Data:', album);
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
//             month: 'long',
//             day: 'numeric',
//         });
//     }, []);

//     const handleImagePress = useCallback((index) => {
//         setSelectedImageIndex(index);
//     }, []);

//     const handleCloseModal = useCallback(() => {
//         setSelectedImageIndex(null);
//     }, []);

//     const handlePrevImage = useCallback(() => {
//         if (album?.media && selectedImageIndex > 0) {
//             setSelectedImageIndex(prev => prev - 1);
//         }
//     }, [album, selectedImageIndex]);

//     const handleNextImage = useCallback(() => {
//         if (album?.media && selectedImageIndex < album.media.length - 1) {
//             setSelectedImageIndex(prev => prev + 1);
//         }
//     }, [album, selectedImageIndex]);

//     const renderGridImage = useCallback(({ item, index }) => (
//         <TouchableOpacity
//             style={styles.gridImageContainer}
//             onPress={() => handleImagePress(index)}
//             activeOpacity={0.8}
//         >
//             <Image
//                 source={{ uri: getImageUrl(item.mediaUrl) }}
//                 style={styles.gridImage}
//                 resizeMode="cover"
//             />
//         </TouchableOpacity>
//     ), [getImageUrl, handleImagePress]);

//     const currentImageUrl = selectedImageIndex !== null && album?.media
//         ? getImageUrl(album.media[selectedImageIndex]?.mediaUrl)
//         : null;

//     return (
//         <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
//             <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            
//             <LinearGradient
//                 colors={theme.gradientPrimary || ['#6366F1', '#8B5CF6']}
//                 style={styles.header}
//             >
//                 <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//                     <Icon name="arrow-left" size={24} color="#FFF" />
//                 </TouchableOpacity>
//                 <View style={styles.headerContent}>
//                     <Text style={styles.headerTitle} numberOfLines={1}>
//                         {album?.title || albumTitle || 'Album'}
//                     </Text>
//                     <Text style={styles.headerSubtitle}>
//                         {album?.imageCount || 0} Photos
//                         {album?.eventDate ? ` • ${formatDate(album.eventDate)}` : ''}
//                     </Text>
//                 </View>
//             </LinearGradient>

//             {isLoading ? (
//                 <View style={styles.loadingContainer}>
//                     <ActivityIndicator size="large" color={theme.primary} />
//                 </View>
//             ) : album?.description ? (
//                 <View style={[styles.descriptionCard, { backgroundColor: theme.card }]}>
//                     <Text style={[styles.descriptionText, { color: theme.textSecondary }]}>
//                         {album.description}
//                     </Text>
//                 </View>
//             ) : null}

//             {album?.media && album.media.length > 0 ? (
//                 <FlatList
//                     data={album.media}
//                     renderItem={renderGridImage}
//                     keyExtractor={(item) => item.mediaId.toString()}
//                     numColumns={NUM_COLUMNS}
//                     contentContainerStyle={styles.gridContent}
//                     showsVerticalScrollIndicator={false}
//                     ItemSeparatorComponent={() => <View style={{ height: IMAGE_GAP }} />}
//                 />
//             ) : (
//                 <View style={styles.emptyContainer}>
//                     <Icon name="image-off-outline" size={60} color={theme.textTertiary} />
//                     <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
//                         No images in this album
//                     </Text>
//                 </View>
//             )}

//             {/* Full Screen Image Modal */}
//             <Modal
//                 visible={selectedImageIndex !== null}
//                 transparent={true}
//                 animationType="fade"
//                 onRequestClose={handleCloseModal}
//             >
//                 <View style={styles.modalContainer}>
//                     <TouchableOpacity
//                         style={styles.modalCloseButton}
//                         onPress={handleCloseModal}
//                     >
//                         <Icon name="close" size={28} color="#FFF" />
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                         style={[styles.modalNavButton, styles.prevButton]}
//                         onPress={handlePrevImage}
//                         disabled={selectedImageIndex === 0}
//                     >
//                         <Icon
//                             name="chevron-left"
//                             size={32}
//                             color={selectedImageIndex === 0 ? 'rgba(255,255,255,0.3)' : '#FFF'}
//                         />
//                     </TouchableOpacity>

//                     {currentImageUrl && (
//                         <Image
//                             source={{ uri: currentImageUrl }}
//                             style={styles.fullScreenImage}
//                             resizeMode="contain"
//                         />
//                     )}

//                     <TouchableOpacity
//                         style={[styles.modalNavButton, styles.nextButton]}
//                         onPress={handleNextImage}
//                         disabled={selectedImageIndex === (album?.media?.length || 0) - 1}
//                     >
//                         <Icon
//                             name="chevron-right"
//                             size={32}
//                             color={selectedImageIndex === (album?.media?.length || 0) - 1 ? 'rgba(255,255,255,0.3)' : '#FFF'}
//                         />
//                     </TouchableOpacity>

//                     <View style={styles.modalCounter}>
//                         <Text style={styles.counterText}>
//                             {selectedImageIndex + 1} / {album?.media?.length || 0}
//                         </Text>
//                     </View>
//                 </View>
//             </Modal>
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
//     headerTitle: { fontSize: 20, fontWeight: '800', color: '#FFF' },
//     headerSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 3 },
//     descriptionCard: {
//         margin: 16,
//         marginBottom: 8,
//         padding: 16,
//         borderRadius: 14,
//         elevation: 2,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.05,
//         shadowRadius: 4,
//     },
//     descriptionText: { fontSize: 14, lineHeight: 20 },
//     gridContent: { padding: 16, paddingTop: 8 },
//     gridImageContainer: {
//         width: IMAGE_SIZE,
//         height: IMAGE_SIZE,
//         marginHorizontal: IMAGE_GAP / 2,
//         borderRadius: 8,
//         overflow: 'hidden',
//     },
//     gridImage: { width: '100%', height: '100%' },
//     loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//     emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//     emptyText: { fontSize: 14, marginTop: 12 },
//     modalContainer: {
//         flex: 1,
//         backgroundColor: 'rgba(0,0,0,0.95)',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     modalCloseButton: {
//         position: 'absolute',
//         top: Platform.OS === 'ios' ? 60 : 40,
//         right: 20,
//         zIndex: 10,
//         width: 40,
//         height: 40,
//         borderRadius: 20,
//         backgroundColor: 'rgba(255,255,255,0.1)',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     modalNavButton: {
//         position: 'absolute',
//         top: '50%',
//         marginTop: -25,
//         width: 50,
//         height: 50,
//         borderRadius: 25,
//         backgroundColor: 'rgba(255,255,255,0.1)',
//         justifyContent: 'center',
//         alignItems: 'center',
//         zIndex: 10,
//     },
//     prevButton: { left: 15 },
//     nextButton: { right: 15 },
//     fullScreenImage: {
//         width: screenWidth,
//         height: screenHeight * 0.7,
//     },
//     modalCounter: {
//         position: 'absolute',
//         bottom: 50,
//         alignSelf: 'center',
//         backgroundColor: 'rgba(0,0,0,0.5)',
//         paddingHorizontal: 16,
//         paddingVertical: 6,
//         borderRadius: 20,
//     },
//     counterText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
// });

// export default StudentGalleryDetailScreen;
import React, { useState, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    SafeAreaView,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    FlatList,
    Platform,
    StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import ImageViewing from 'react-native-image-viewing';
import { useSelector } from 'react-redux';
import { selectThemeData } from '../../../store/slices/themeSlice';
import { useGetGalleryAlbumQuery } from '../../../store/galleryApi';
import { BASE_URL } from '../../../config/constants';

const { width: screenWidth } = Dimensions.get('window');
const IMAGE_GAP = 2;
const NUM_COLUMNS = 3;
const IMAGE_SIZE = (screenWidth - 32 - (IMAGE_GAP * (NUM_COLUMNS - 1))) / NUM_COLUMNS;

// Helper to check file type
const getFileType = (fileName) => {
    if (!fileName) return 'unknown';
    const ext = fileName.toLowerCase().split('.').pop();
    const videoExts = ['mp4', 'mov', 'avi', 'mkv', 'webm', '3gp', 'm4v'];
    const audioExts = ['mp3', 'wav', 'aac', 'ogg', 'm4a', 'flac', 'wma'];
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'heic', 'heif'];
    if (videoExts.includes(ext)) return 'video';
    if (audioExts.includes(ext)) return 'audio';
    if (imageExts.includes(ext)) return 'image';
    return 'unknown';
};

const StudentGalleryDetailScreen = ({ route, navigation }) => {
    const theme = useSelector(selectThemeData);
    const { albumId, albumTitle, childName } = route.params;
    
    const [imageViewerVisible, setImageViewerVisible] = useState(false);
    const [imageViewerIndex, setImageViewerIndex] = useState(0);

    const {
        data: album,
        isLoading,
    } = useGetGalleryAlbumQuery(albumId);

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
            month: 'long',
            day: 'numeric',
        });
    }, []);

    // Filter only images for the viewer
    const imageOnlyMedia = useMemo(() =>
        album?.media?.filter(item => {
            const type = getFileType(item.fileName || item.mediaUrl);
            return type === 'image';
        }) || [],
    [album]);

    const imageViewerData = useMemo(() => 
        imageOnlyMedia.map(item => ({
            uri: getImageUrl(item.mediaUrl),
        })),
    [imageOnlyMedia, getImageUrl]);

    const handleMediaPress = useCallback((index) => {
        const mediaItem = album?.media?.[index];
        if (!mediaItem) return;

        const type = getFileType(mediaItem?.fileName || mediaItem?.mediaUrl);

        if (type === 'image') {
            const imageIndex = imageOnlyMedia.findIndex(
                img => img.mediaId === mediaItem.mediaId
            );
            setImageViewerIndex(imageIndex >= 0 ? imageIndex : 0);
            setImageViewerVisible(true);
        }
        // For now, students can only view images. Videos/audio can be added later.
    }, [album, imageOnlyMedia]);

    const renderGridItem = useCallback(({ item, index }) => {
        const type = getFileType(item.fileName || item.mediaUrl);
        const mediaUrl = getImageUrl(item.mediaUrl);

        return (
            <TouchableOpacity
                style={styles.gridImageContainer}
                onPress={() => handleMediaPress(index)}
                activeOpacity={0.8}
            >
                {type === 'image' && mediaUrl ? (
                    <Image
                        source={{ uri: mediaUrl }}
                        style={styles.gridImage}
                        resizeMode="cover"
                    />
                ) : type === 'video' ? (
                    <View style={[styles.gridPlaceholder, { backgroundColor: theme.error + '15' }]}>
                        <Icon name="play-circle" size={28} color={theme.error} />
                        <Text style={[styles.typeLabel, { color: theme.error }]}>Video</Text>
                    </View>
                ) : type === 'audio' ? (
                    <View style={[styles.gridPlaceholder, { backgroundColor: theme.warning + '15' }]}>
                        <Icon name="music-note" size={28} color={theme.warning} />
                        <Text style={[styles.typeLabel, { color: theme.warning }]}>Audio</Text>
                    </View>
                ) : (
                    <View style={[styles.gridPlaceholder, { backgroundColor: theme.background }]}>
                        <Icon name="file-question" size={28} color={theme.textTertiary} />
                    </View>
                )}
                {(type === 'video' || type === 'audio') && (
                    <View style={[styles.typeBadge, { backgroundColor: type === 'video' ? theme.error : theme.warning }]}>
                        <Icon name={type === 'video' ? 'video' : 'music-note'} size={10} color="#FFF" />
                    </View>
                )}
            </TouchableOpacity>
        );
    }, [theme, getImageUrl, handleMediaPress]);

    const albumMediaCount = album?.media?.length || 0;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            
            <LinearGradient
                colors={theme.gradientPrimary || ['#6366F1', '#8B5CF6']}
                style={styles.header}
            >
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={24} color="#FFF" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle} numberOfLines={1}>
                        {album?.title || albumTitle || 'Album'}
                    </Text>
                    <Text style={styles.headerSubtitle}>
                        {albumMediaCount} {albumMediaCount === 1 ? 'Item' : 'Items'}
                        {album?.eventDate ? ` • ${formatDate(album.eventDate)}` : ''}
                    </Text>
                </View>
            </LinearGradient>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.primary} />
                </View>
            ) : album?.description ? (
                <View style={[styles.descriptionCard, { backgroundColor: theme.card }]}>
                    <Text style={[styles.descriptionText, { color: theme.textSecondary }]}>
                        {album.description}
                    </Text>
                </View>
            ) : null}

            {album?.media && album.media.length > 0 ? (
                <FlatList
                    data={album.media}
                    renderItem={renderGridItem}
                    keyExtractor={(item) => item.mediaId.toString()}
                    numColumns={NUM_COLUMNS}
                    contentContainerStyle={styles.gridContent}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={{ height: IMAGE_GAP }} />}
                />
            ) : !isLoading ? (
                <View style={styles.emptyContainer}>
                    <Icon name="image-off-outline" size={60} color={theme.textTertiary} />
                    <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                        No media in this album
                    </Text>
                </View>
            ) : null}

            {/* ⭐ Image Viewer with Swipe + Zoom */}
            <ImageViewing
                images={imageViewerData}
                imageIndex={imageViewerIndex}
                visible={imageViewerVisible}
                onRequestClose={() => setImageViewerVisible(false)}
                swipeToCloseEnabled={true}
                doubleTapToZoomEnabled={true}
            />
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
    headerTitle: { fontSize: 20, fontWeight: '800', color: '#FFF' },
    headerSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 3 },
    descriptionCard: {
        margin: 16,
        marginBottom: 8,
        padding: 16,
        borderRadius: 14,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    descriptionText: { fontSize: 14, lineHeight: 20 },
    gridContent: { padding: 16, paddingTop: 8, paddingBottom: 30 },
    gridImageContainer: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        marginHorizontal: IMAGE_GAP / 2,
        borderRadius: 8,
        overflow: 'hidden',
    },
    gridImage: { width: '100%', height: '100%' },
    gridPlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    typeLabel: { fontSize: 9, fontWeight: '600', marginTop: 2 },
    typeBadge: {
        position: 'absolute',
        bottom: 4,
        left: 4,
        borderRadius: 6,
        paddingHorizontal: 5,
        paddingVertical: 2,
    },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { fontSize: 14, marginTop: 12 },
});

export default StudentGalleryDetailScreen;