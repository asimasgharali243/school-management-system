// // import React, { useState, useCallback } from 'react';
// // import {
// //     View,
// //     Text,
// //     StyleSheet,
// //     Image,
// //     Dimensions,
// //     SafeAreaView,
// //     TouchableOpacity,
// //     ActivityIndicator,
// //     Modal,
// //     FlatList,
// //     Platform,
// //     Alert,
// // } from 'react-native';
// // import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// // import LinearGradient from 'react-native-linear-gradient';
// // import { useSelector } from 'react-redux';
// // import { selectThemeData } from '../../../store/slices/themeSlice';
// // import { useGetGalleryAlbumQuery, useDeleteAlbumMutation } from '../../../store/galleryApi';
// // import { BASE_URL } from '../../../config/constants';
// // import Toast from 'react-native-toast-message';

// // const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
// // const IMAGE_GAP = 2;
// // const NUM_COLUMNS = 3;
// // const IMAGE_SIZE = (screenWidth - 32 - (IMAGE_GAP * (NUM_COLUMNS - 1))) / NUM_COLUMNS;

// // const GalleryAlbumDetailScreen = ({ route, navigation }) => {
// //     const theme = useSelector(selectThemeData);
// //     const { albumId, albumTitle } = route.params;
    
// //     const [selectedImageIndex, setSelectedImageIndex] = useState(null);

// //     const {
// //         data: album,
// //         isLoading,
// //         refetch,
// //     } = useGetGalleryAlbumQuery(albumId);
// // console.log('by id  Data:', album);
// //     const [deleteAlbum] = useDeleteAlbumMutation();

// //     const getImageUrl = useCallback((url) => {
// //         if (!url) return null;
// //         if (url.startsWith('http')) return url;
// //         return `${BASE_URL}${url}`;
// //     }, []);

// //     const formatDate = useCallback((dateString) => {
// //         if (!dateString) return '';
// //         const date = new Date(dateString);
// //         return date.toLocaleDateString('en-US', {
// //             year: 'numeric',
// //             month: 'long',
// //             day: 'numeric',
// //         });
// //     }, []);

// //     const handleImagePress = useCallback((index) => {
// //         setSelectedImageIndex(index);
// //     }, []);

// //     const handleCloseModal = useCallback(() => {
// //         setSelectedImageIndex(null);
// //     }, []);

// //     const handlePrevImage = useCallback(() => {
// //         if (album?.media && selectedImageIndex > 0) {
// //             setSelectedImageIndex(prev => prev - 1);
// //         }
// //     }, [album, selectedImageIndex]);

// //     const handleNextImage = useCallback(() => {
// //         if (album?.media && selectedImageIndex < album.media.length - 1) {
// //             setSelectedImageIndex(prev => prev + 1);
// //         }
// //     }, [album, selectedImageIndex]);

// //     const handleDeleteAlbum = useCallback(() => {
// //         Alert.alert(
// //             'Delete Album',
// //             `Are you sure you want to delete "${album?.title || albumTitle}"?`,
// //             [
// //                 { text: 'Cancel', style: 'cancel' },
// //                 {
// //                     text: 'Delete',
// //                     style: 'destructive',
// //                     onPress: async () => {
// //                         try {
// //                             await deleteAlbum(albumId).unwrap();
// //                             Toast.show({
// //                                 type: 'success',
// //                                 text1: 'Album deleted',
// //                                 position: 'top',
// //                                 visibilityTime: 2000,
// //                             });
// //                             navigation.goBack();
// //                         } catch (error) {
// //                             Toast.show({
// //                                 type: 'error',
// //                                 text1: 'Error',
// //                                 text2: error?.data?.message || 'Failed to delete album',
// //                                 position: 'top',
// //                             });
// //                         }
// //                     },
// //                 },
// //             ]
// //         );
// //     }, [deleteAlbum, albumId, album, albumTitle, navigation]);

// //     const renderGridImage = useCallback(({ item, index }) => (
// //         <TouchableOpacity
// //             style={styles.gridImageContainer}
// //             onPress={() => handleImagePress(index)}
// //             activeOpacity={0.8}
// //         >
// //             <Image
// //                 source={{ uri: getImageUrl(item.mediaUrl) }}
// //                 style={styles.gridImage}
// //                 resizeMode="cover"
// //             />
// //         </TouchableOpacity>
// //     ), [getImageUrl, handleImagePress]);

// //     const currentImageUrl = selectedImageIndex !== null && album?.media
// //         ? getImageUrl(album.media[selectedImageIndex]?.mediaUrl)
// //         : null;

// //     return (
// //         <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
// //             <LinearGradient
// //                 colors={theme.gradientPrimary || ['#6366F1', '#8B5CF6']}
// //                 style={styles.header}
// //             >
// //                 <View style={styles.headerTopRow}>
// //                     <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
// //                         <Icon name="arrow-left" size={24} color="#FFF" />
// //                     </TouchableOpacity>
// //                     <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAlbum}>
// //                         <Icon name="delete-outline" size={22} color="#FFF" />
// //                     </TouchableOpacity>
// //                 </View>
// //                 <View style={styles.headerContent}>
// //                     <Text style={styles.headerTitle} numberOfLines={1}>
// //                         {album?.title || albumTitle || 'Album'}
// //                     </Text>
// //                     <Text style={styles.headerSubtitle}>
// //                         {album?.imageCount || 0} Photos
// //                         {album?.eventDate ? ` • ${formatDate(album.eventDate)}` : ''}
// //                     </Text>
// //                     {album?.className && (
// //                         <Text style={styles.headerClassInfo}>
// //                             {album.className}{album.sectionName ? ` - ${album.sectionName}` : ''}
// //                         </Text>
// //                     )}
// //                 </View>
// //             </LinearGradient>

// //             {isLoading ? (
// //                 <View style={styles.loadingContainer}>
// //                     <ActivityIndicator size="large" color={theme.primary} />
// //                 </View>
// //             ) : (
// //                 <>
// //                     {album?.description ? (
// //                         <View style={[styles.descriptionCard, { backgroundColor: theme.card }]}>
// //                             <Text style={[styles.descriptionText, { color: theme.textSecondary }]}>
// //                                 {album.description}
// //                             </Text>
// //                         </View>
// //                     ) : null}

// //                     {album?.media && album.media.length > 0 ? (
// //                         <FlatList
// //                             data={album.media}
// //                             renderItem={renderGridImage}
// //                             keyExtractor={(item) => item.mediaId.toString()}
// //                             numColumns={NUM_COLUMNS}
// //                             contentContainerStyle={styles.gridContent}
// //                             showsVerticalScrollIndicator={false}
// //                             ItemSeparatorComponent={() => <View style={{ height: IMAGE_GAP }} />}
// //                         />
// //                     ) : (
// //                         <View style={styles.emptyContainer}>
// //                             <Icon name="image-off-outline" size={60} color={theme.textTertiary} />
// //                             <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
// //                                 No images in this album
// //                             </Text>
// //                         </View>
// //                     )}
// //                 </>
// //             )}

// //             {/* Full Screen Image Modal */}
// //             <Modal
// //                 visible={selectedImageIndex !== null}
// //                 transparent={true}
// //                 animationType="fade"
// //                 onRequestClose={handleCloseModal}
// //             >
// //                 <View style={styles.modalContainer}>
// //                     <TouchableOpacity
// //                         style={styles.modalCloseButton}
// //                         onPress={handleCloseModal}
// //                     >
// //                         <Icon name="close" size={28} color="#FFF" />
// //                     </TouchableOpacity>

// //                     <TouchableOpacity
// //                         style={[styles.modalNavButton, styles.prevButton]}
// //                         onPress={handlePrevImage}
// //                         disabled={selectedImageIndex === 0}
// //                     >
// //                         <Icon
// //                             name="chevron-left"
// //                             size={32}
// //                             color={selectedImageIndex === 0 ? 'rgba(255,255,255,0.3)' : '#FFF'}
// //                         />
// //                     </TouchableOpacity>

// //                     {currentImageUrl && (
// //                         <Image
// //                             source={{ uri: currentImageUrl }}
// //                             style={styles.fullScreenImage}
// //                             resizeMode="contain"
// //                         />
// //                     )}

// //                     <TouchableOpacity
// //                         style={[styles.modalNavButton, styles.nextButton]}
// //                         onPress={handleNextImage}
// //                         disabled={selectedImageIndex === (album?.media?.length || 0) - 1}
// //                     >
// //                         <Icon
// //                             name="chevron-right"
// //                             size={32}
// //                             color={selectedImageIndex === (album?.media?.length || 0) - 1 ? 'rgba(255,255,255,0.3)' : '#FFF'}
// //                         />
// //                     </TouchableOpacity>

// //                     <View style={styles.modalCounter}>
// //                         <Text style={styles.counterText}>
// //                             {selectedImageIndex + 1} / {album?.media?.length || 0}
// //                         </Text>
// //                     </View>
// //                 </View>
// //             </Modal>

// //             <Toast />
// //         </SafeAreaView>
// //     );
// // };

// // const styles = StyleSheet.create({
// //     container: { flex: 1 },
// //     header: {
// //         paddingHorizontal: 20,
// //         paddingTop: Platform.OS === 'ios' ? 10 : 15,
// //         paddingBottom: 22,
// //         borderBottomLeftRadius: 25,
// //         borderBottomRightRadius: 25,
// //     },
// //     headerTopRow: {
// //         flexDirection: 'row',
// //         justifyContent: 'space-between',
// //         alignItems: 'center',
// //         marginBottom: 12,
// //     },
// //     backButton: {
// //         width: 38,
// //         height: 38,
// //         borderRadius: 19,
// //         backgroundColor: 'rgba(255,255,255,0.2)',
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //     },
// //     deleteButton: {
// //         width: 38,
// //         height: 38,
// //         borderRadius: 19,
// //         backgroundColor: 'rgba(255,255,255,0.2)',
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //     },
// //     headerContent: { paddingLeft: 4 },
// //     headerTitle: { fontSize: 20, fontWeight: '800', color: '#FFF' },
// //     headerSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 3 },
// //     headerClassInfo: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
// //     descriptionCard: {
// //         margin: 16,
// //         marginBottom: 8,
// //         padding: 16,
// //         borderRadius: 14,
// //         elevation: 2,
// //         shadowColor: '#000',
// //         shadowOffset: { width: 0, height: 1 },
// //         shadowOpacity: 0.05,
// //         shadowRadius: 4,
// //     },
// //     descriptionText: { fontSize: 14, lineHeight: 20 },
// //     gridContent: { padding: 16, paddingTop: 8 },
// //     gridImageContainer: {
// //         width: IMAGE_SIZE,
// //         height: IMAGE_SIZE,
// //         marginHorizontal: IMAGE_GAP / 2,
// //         borderRadius: 8,
// //         overflow: 'hidden',
// //     },
// //     gridImage: { width: '100%', height: '100%' },
// //     loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
// //     emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
// //     emptyText: { fontSize: 14, marginTop: 12 },
// //     modalContainer: {
// //         flex: 1,
// //         backgroundColor: 'rgba(0,0,0,0.95)',
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //     },
// //     modalCloseButton: {
// //         position: 'absolute',
// //         top: Platform.OS === 'ios' ? 60 : 40,
// //         right: 20,
// //         zIndex: 10,
// //         width: 40,
// //         height: 40,
// //         borderRadius: 20,
// //         backgroundColor: 'rgba(255,255,255,0.1)',
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //     },
// //     modalNavButton: {
// //         position: 'absolute',
// //         top: '50%',
// //         marginTop: -25,
// //         width: 50,
// //         height: 50,
// //         borderRadius: 25,
// //         backgroundColor: 'rgba(255,255,255,0.1)',
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //         zIndex: 10,
// //     },
// //     prevButton: { left: 15 },
// //     nextButton: { right: 15 },
// //     fullScreenImage: {
// //         width: screenWidth,
// //         height: screenHeight * 0.7,
// //     },
// //     modalCounter: {
// //         position: 'absolute',
// //         bottom: 50,
// //         alignSelf: 'center',
// //         backgroundColor: 'rgba(0,0,0,0.5)',
// //         paddingHorizontal: 16,
// //         paddingVertical: 6,
// //         borderRadius: 20,
// //     },
// //     counterText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
// // });

// // export default GalleryAlbumDetailScreen;
// import React, { useState, useCallback, useRef } from 'react';
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
//     Alert,
//     ScrollView,
//     NativeModules,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import LinearGradient from 'react-native-linear-gradient';
// import { Video, Audio } from 'expo-av';
// import { useSelector } from 'react-redux';
// import { selectThemeData } from '../../../store/slices/themeSlice';
// import { useGetGalleryAlbumQuery, useDeleteAlbumMutation } from '../../../store/galleryApi';
// import { BASE_URL } from '../../../config/constants';
// import Toast from 'react-native-toast-message';

// const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
// const IMAGE_GAP = 2;
// const NUM_COLUMNS = 3;
// const IMAGE_SIZE = (screenWidth - 32 - (IMAGE_GAP * (NUM_COLUMNS - 1))) / NUM_COLUMNS;

// // Helper to check file type
// const getFileType = (fileName) => {
//     if (!fileName) return 'unknown';
//     const ext = fileName.toLowerCase().split('.').pop();
//     const videoExts = ['mp4', 'mov', 'avi', 'mkv', 'webm', '3gp', 'm4v'];
//     const audioExts = ['mp3', 'wav', 'aac', 'ogg', 'm4a', 'flac', 'wma'];
//     const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'heic', 'heif'];
//     if (videoExts.includes(ext)) return 'video';
//     if (audioExts.includes(ext)) return 'audio';
//     if (imageExts.includes(ext)) return 'image';
//     return 'unknown';
// };

// // ⭐ Simple Zoomable Image using ScrollView (no reanimated dependency)
// const ZoomableImage = React.memo(({ uri }) => {
//     const [zoomEnabled, setZoomEnabled] = useState(false);
//     const scaleRef = useRef(1);

//     return (
//         <View style={styles.zoomContainer}>
//             <ScrollView
//                 style={styles.zoomScrollView}
//                 contentContainerStyle={styles.zoomContentContainer}
//                 maximumZoomScale={5}
//                 minimumZoomScale={1}
//                 showsHorizontalScrollIndicator={false}
//                 showsVerticalScrollIndicator={false}
//                 bouncesZoom={true}
//                 centerContent={true}
//             >
//                 <Image
//                     source={{ uri }}
//                     style={styles.fullScreenImage}
//                     resizeMode="contain"
//                 />
//             </ScrollView>
//         </View>
//     );
// });

// const GalleryAlbumDetailScreen = ({ route, navigation }) => {
//     const theme = useSelector(selectThemeData);
//     const { albumId, albumTitle } = route.params;
    
//     const [selectedIndex, setSelectedIndex] = useState(null);
//     const [selectedType, setSelectedType] = useState(null);
//     const [isPlaying, setIsPlaying] = useState(false);
    
//     const videoRef = useRef(null);
//     const soundRef = useRef(null);

//     const {
//         data: album,
//         isLoading,
//         refetch,
//     } = useGetGalleryAlbumQuery(albumId);

//     const [deleteAlbum] = useDeleteAlbumMutation();

//     const getFullUrl = useCallback((url) => {
//         if (!url) return '';
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

//     const playAudio = useCallback(async (url) => {
//         try {
//             if (soundRef.current) {
//                 await soundRef.current.unloadAsync();
//             }
//             const { sound } = await Audio.Sound.createAsync(
//                 { uri: url },
//                 { shouldPlay: true }
//             );
//             soundRef.current = sound;
//             setIsPlaying(true);
//             sound.setOnPlaybackStatusUpdate((status) => {
//                 if (status.didJustFinish) setIsPlaying(false);
//             });
//         } catch (error) {
//             console.error('Error playing audio:', error);
//             Toast.show({
//                 type: 'error',
//                 text1: 'Playback Error',
//                 text2: 'Could not play audio file',
//                 position: 'top',
//             });
//         }
//     }, []);

//     const stopAudio = useCallback(async () => {
//         if (soundRef.current) {
//             await soundRef.current.stopAsync();
//             await soundRef.current.unloadAsync();
//             soundRef.current = null;
//             setIsPlaying(false);
//         }
//     }, []);

//     const handleCloseModal = useCallback(async () => {
//         if (soundRef.current) {
//             await soundRef.current.stopAsync();
//             await soundRef.current.unloadAsync();
//             soundRef.current = null;
//         }
//         if (videoRef.current) {
//             await videoRef.current.stopAsync();
//         }
//         setIsPlaying(false);
//         setSelectedIndex(null);
//         setSelectedType(null);
//     }, []);

//     const handleMediaPress = useCallback((index) => {
//         const mediaItem = album?.media?.[index];
//         const type = getFileType(mediaItem?.fileName || mediaItem?.mediaUrl);
//         setSelectedIndex(index);
//         setSelectedType(type);
//         setIsPlaying(false);
//     }, [album]);

//     const handlePrev = useCallback(async () => {
//         if (soundRef.current) {
//             await soundRef.current.stopAsync();
//             await soundRef.current.unloadAsync();
//             soundRef.current = null;
//         }
//         if (videoRef.current) {
//             await videoRef.current.stopAsync();
//         }
//         setIsPlaying(false);
        
//         if (album?.media && selectedIndex > 0) {
//             const newIndex = selectedIndex - 1;
//             const mediaItem = album.media[newIndex];
//             setSelectedIndex(newIndex);
//             setSelectedType(getFileType(mediaItem?.fileName || mediaItem?.mediaUrl));
//         }
//     }, [album, selectedIndex]);

//     const handleNext = useCallback(async () => {
//         if (soundRef.current) {
//             await soundRef.current.stopAsync();
//             await soundRef.current.unloadAsync();
//             soundRef.current = null;
//         }
//         if (videoRef.current) {
//             await videoRef.current.stopAsync();
//         }
//         setIsPlaying(false);
        
//         if (album?.media && selectedIndex < album.media.length - 1) {
//             const newIndex = selectedIndex + 1;
//             const mediaItem = album.media[newIndex];
//             setSelectedIndex(newIndex);
//             setSelectedType(getFileType(mediaItem?.fileName || mediaItem?.mediaUrl));
//         }
//     }, [album, selectedIndex]);

//     const handleDeleteAlbum = useCallback(() => {
//         Alert.alert(
//             'Delete Album',
//             `Are you sure you want to delete "${album?.title || albumTitle}"?`,
//             [
//                 { text: 'Cancel', style: 'cancel' },
//                 {
//                     text: 'Delete',
//                     style: 'destructive',
//                     onPress: async () => {
//                         try {
//                             await deleteAlbum(albumId).unwrap();
//                             Toast.show({
//                                 type: 'success',
//                                 text1: 'Album deleted',
//                                 position: 'top',
//                                 visibilityTime: 2000,
//                             });
//                             navigation.goBack();
//                         } catch (error) {
//                             Toast.show({
//                                 type: 'error',
//                                 text1: 'Error',
//                                 text2: error?.data?.message || 'Failed to delete album',
//                                 position: 'top',
//                             });
//                         }
//                     },
//                 },
//             ]
//         );
//     }, [deleteAlbum, albumId, album, albumTitle, navigation]);

//     const renderGridItem = useCallback(({ item, index }) => {
//         const type = getFileType(item.fileName || item.mediaUrl);
//         const mediaUrl = getFullUrl(item.mediaUrl);

//         return (
//             <TouchableOpacity
//                 style={styles.gridItem}
//                 onPress={() => handleMediaPress(index)}
//                 activeOpacity={0.8}
//             >
//                 {type === 'video' ? (
//                     <View style={[styles.gridPlaceholder, { backgroundColor: theme.error + '15' }]}>
//                         <Icon name="play-circle" size={28} color={theme.error} />
//                         <Text style={[styles.typeLabel, { color: theme.error }]}>Video</Text>
//                     </View>
//                 ) : type === 'audio' ? (
//                     <View style={[styles.gridPlaceholder, { backgroundColor: theme.warning + '15' }]}>
//                         <Icon name="music-note" size={28} color={theme.warning} />
//                         <Text style={[styles.typeLabel, { color: theme.warning }]}>Audio</Text>
//                     </View>
//                 ) : mediaUrl ? (
//                     <Image
//                         source={{ uri: mediaUrl }}
//                         style={styles.gridImage}
//                         resizeMode="cover"
//                     />
//                 ) : (
//                     <View style={[styles.gridPlaceholder, { backgroundColor: theme.background }]}>
//                         <Icon name="file-question" size={28} color={theme.textTertiary} />
//                     </View>
//                 )}
//                 {(type === 'video' || type === 'audio') && (
//                     <View style={[styles.typeBadge, { backgroundColor: type === 'video' ? theme.error : theme.warning }]}>
//                         <Icon name={type === 'video' ? 'video' : 'music-note'} size={10} color="#FFF" />
//                     </View>
//                 )}
//             </TouchableOpacity>
//         );
//     }, [theme, getFullUrl, handleMediaPress]);

//     const currentMediaUrl = selectedIndex !== null && album?.media
//         ? getFullUrl(album.media[selectedIndex]?.mediaUrl)
//         : '';

//     const albumMediaCount = album?.media?.length || 0;
//     const isImage = selectedType === 'image';

//     return (
//         <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
//             <LinearGradient
//                 colors={theme.gradientPrimary || ['#6366F1', '#8B5CF6']}
//                 style={styles.header}
//             >
//                 <View style={styles.headerTopRow}>
//                     <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//                         <Icon name="arrow-left" size={24} color="#FFF" />
//                     </TouchableOpacity>
//                     <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAlbum}>
//                         <Icon name="delete-outline" size={22} color="#FFF" />
//                     </TouchableOpacity>
//                 </View>
//                 <View style={styles.headerContent}>
//                     <Text style={styles.headerTitle} numberOfLines={1}>
//                         {album?.title || albumTitle || 'Album'}
//                     </Text>
//                     <Text style={styles.headerSubtitle}>
//                         {albumMediaCount} {albumMediaCount === 1 ? 'Item' : 'Items'}
//                         {album?.eventDate ? ` • ${formatDate(album.eventDate)}` : ''}
//                     </Text>
//                     {album?.className && (
//                         <Text style={styles.headerClassInfo}>
//                             {album.className}{album.sectionName ? ` - ${album.sectionName}` : ''}
//                         </Text>
//                     )}
//                 </View>
//             </LinearGradient>

//             {isLoading ? (
//                 <View style={styles.loadingContainer}>
//                     <ActivityIndicator size="large" color={theme.primary} />
//                 </View>
//             ) : (
//                 <>
//                     {album?.description ? (
//                         <View style={[styles.descriptionCard, { backgroundColor: theme.card }]}>
//                             <Text style={[styles.descriptionText, { color: theme.textSecondary }]}>
//                                 {album.description}
//                             </Text>
//                         </View>
//                     ) : null}

//                     {albumMediaCount > 0 ? (
//                         <FlatList
//                             data={album.media}
//                             renderItem={renderGridItem}
//                             keyExtractor={(item) => item.mediaId.toString()}
//                             numColumns={NUM_COLUMNS}
//                             contentContainerStyle={styles.gridContent}
//                             showsVerticalScrollIndicator={false}
//                             ItemSeparatorComponent={() => <View style={{ height: IMAGE_GAP }} />}
//                         />
//                     ) : (
//                         <View style={styles.emptyContainer}>
//                             <Icon name="image-off-outline" size={60} color={theme.textTertiary} />
//                             <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
//                                 No media in this album
//                             </Text>
//                         </View>
//                     )}
//                 </>
//             )}

//             {/* Full Screen Media Modal with Zoom and Swipe */}
//             <Modal
//                 visible={selectedIndex !== null}
//                 transparent={true}
//                 animationType="fade"
//                 onRequestClose={handleCloseModal}
//             >
//                 <View style={styles.modalContainer}>
//                     {/* Close Button */}
//                     <TouchableOpacity
//                         style={styles.modalCloseButton}
//                         onPress={handleCloseModal}
//                     >
//                         <Icon name="close" size={28} color="#FFF" />
//                     </TouchableOpacity>

//                     {/* Swipe Left Area */}
//                     {selectedIndex > 0 && (
//                         <TouchableOpacity
//                             style={[styles.swipeArea, styles.swipeLeft]}
//                             onPress={handlePrev}
//                             activeOpacity={0.3}
//                         >
//                             <Icon name="chevron-left-circle" size={40} color="rgba(255,255,255,0.4)" />
//                         </TouchableOpacity>
//                     )}

//                     {/* Swipe Right Area */}
//                     {selectedIndex < albumMediaCount - 1 && (
//                         <TouchableOpacity
//                             style={[styles.swipeArea, styles.swipeRight]}
//                             onPress={handleNext}
//                             activeOpacity={0.3}
//                         >
//                             <Icon name="chevron-right-circle" size={40} color="rgba(255,255,255,0.4)" />
//                         </TouchableOpacity>
//                     )}

//                     {/* Media Content */}
//                     {selectedType === 'video' && currentMediaUrl ? (
//                         <View style={styles.videoContainer}>
//                             <Video
//                                 ref={videoRef}
//                                 source={{ uri: currentMediaUrl }}
//                                 style={styles.fullScreenVideo}
//                                 resizeMode="contain"
//                                 useNativeControls
//                                 shouldPlay={false}
//                                 isLooping={false}
//                             />
//                         </View>
//                     ) : selectedType === 'audio' && currentMediaUrl ? (
//                         <View style={styles.audioContainer}>
//                             <View style={[styles.audioPlayer, { backgroundColor: theme.card }]}>
//                                 <Icon name="music-circle" size={80} color={theme.warning} />
//                                 <Text style={[styles.audioTitle, { color: theme.text }]} numberOfLines={1}>
//                                     {album?.media?.[selectedIndex]?.fileName || 'Audio File'}
//                                 </Text>
//                                 <View style={styles.audioControls}>
//                                     {isPlaying ? (
//                                         <TouchableOpacity
//                                             style={[styles.audioButton, { backgroundColor: theme.error }]}
//                                             onPress={stopAudio}
//                                         >
//                                             <Icon name="stop" size={28} color="#FFF" />
//                                         </TouchableOpacity>
//                                     ) : (
//                                         <TouchableOpacity
//                                             style={[styles.audioButton, { backgroundColor: theme.primary }]}
//                                             onPress={() => playAudio(currentMediaUrl)}
//                                         >
//                                             <Icon name="play" size={28} color="#FFF" />
//                                         </TouchableOpacity>
//                                     )}
//                                 </View>
//                                 <Text style={[styles.audioHint, { color: theme.textTertiary }]}>
//                                     {isPlaying ? 'Playing...' : 'Tap play to listen'}
//                                 </Text>
//                             </View>
//                         </View>
//                     ) : currentMediaUrl && isImage ? (
//                         <ZoomableImage uri={currentMediaUrl} />
//                     ) : currentMediaUrl ? (
//                         <Image
//                             source={{ uri: currentMediaUrl }}
//                             style={styles.fullScreenImage}
//                             resizeMode="contain"
//                         />
//                     ) : null}

//                     {/* Previous Button */}
//                     <TouchableOpacity
//                         style={[styles.modalNavButton, styles.prevButton]}
//                         onPress={handlePrev}
//                         disabled={selectedIndex === 0}
//                     >
//                         <Icon
//                             name="chevron-left"
//                             size={32}
//                             color={selectedIndex === 0 ? 'rgba(255,255,255,0.3)' : '#FFF'}
//                         />
//                     </TouchableOpacity>

//                     {/* Next Button */}
//                     <TouchableOpacity
//                         style={[styles.modalNavButton, styles.nextButton]}
//                         onPress={handleNext}
//                         disabled={selectedIndex === albumMediaCount - 1}
//                     >
//                         <Icon
//                             name="chevron-right"
//                             size={32}
//                             color={selectedIndex === albumMediaCount - 1 ? 'rgba(255,255,255,0.3)' : '#FFF'}
//                         />
//                     </TouchableOpacity>

//                     {/* Counter */}
//                     <View style={styles.modalCounter}>
//                         <Text style={styles.counterText}>
//                             {selectedIndex + 1} / {albumMediaCount}
//                         </Text>
//                     </View>
//                 </View>
//             </Modal>

//             <Toast />
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
//     headerTopRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 12,
//     },
//     backButton: {
//         width: 38, height: 38, borderRadius: 19,
//         backgroundColor: 'rgba(255,255,255,0.2)',
//         justifyContent: 'center', alignItems: 'center',
//     },
//     deleteButton: {
//         width: 38, height: 38, borderRadius: 19,
//         backgroundColor: 'rgba(255,255,255,0.2)',
//         justifyContent: 'center', alignItems: 'center',
//     },
//     headerContent: { paddingLeft: 4 },
//     headerTitle: { fontSize: 20, fontWeight: '800', color: '#FFF' },
//     headerSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 3 },
//     headerClassInfo: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
//     descriptionCard: {
//         margin: 16, marginBottom: 8, padding: 16, borderRadius: 14,
//         elevation: 2, shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4,
//     },
//     descriptionText: { fontSize: 14, lineHeight: 20 },
//     gridContent: { padding: 16, paddingTop: 8 },
//     gridItem: {
//         width: IMAGE_SIZE, height: IMAGE_SIZE,
//         marginHorizontal: IMAGE_GAP / 2, borderRadius: 8, overflow: 'hidden',
//     },
//     gridImage: { width: '100%', height: '100%' },
//     gridPlaceholder: {
//         width: '100%', height: '100%',
//         justifyContent: 'center', alignItems: 'center',
//     },
//     typeLabel: { fontSize: 9, fontWeight: '600', marginTop: 2 },
//     typeBadge: {
//         position: 'absolute', bottom: 4, left: 4,
//         borderRadius: 6, paddingHorizontal: 5, paddingVertical: 2,
//     },
//     loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//     emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//     emptyText: { fontSize: 14, marginTop: 12 },
//     // Modal Styles
//     modalContainer: {
//         flex: 1, backgroundColor: 'rgba(0,0,0,0.95)',
//         justifyContent: 'center', alignItems: 'center',
//     },
//     modalCloseButton: {
//         position: 'absolute', top: Platform.OS === 'ios' ? 60 : 40, right: 20, zIndex: 10,
//         width: 40, height: 40, borderRadius: 20,
//         backgroundColor: 'rgba(255,255,255,0.1)',
//         justifyContent: 'center', alignItems: 'center',
//     },
//     modalNavButton: {
//         position: 'absolute', top: '50%', marginTop: -25,
//         width: 50, height: 50, borderRadius: 25,
//         backgroundColor: 'rgba(255,255,255,0.1)',
//         justifyContent: 'center', alignItems: 'center', zIndex: 10,
//     },
//     prevButton: { left: 15 },
//     nextButton: { right: 15 },
//     fullScreenImage: { width: screenWidth, height: screenHeight * 0.7 },
//     // Zoom Container
//     zoomContainer: {
//         width: screenWidth,
//         height: screenHeight * 0.7,
//     },
//     zoomScrollView: {
//         width: screenWidth,
//         height: screenHeight * 0.7,
//     },
//     zoomContentContainer: {
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     // Swipe Areas
//     swipeArea: {
//         position: 'absolute',
//         top: 0,
//         bottom: 0,
//         width: 60,
//         zIndex: 5,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     swipeLeft: { left: 0 },
//     swipeRight: { right: 0 },
//     // Video Styles
//     videoContainer: {
//         width: screenWidth,
//         height: screenHeight * 0.5,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     fullScreenVideo: {
//         width: screenWidth,
//         height: screenHeight * 0.5,
//     },
//     // Audio Styles
//     audioContainer: {
//         width: screenWidth * 0.85,
//         alignItems: 'center',
//     },
//     audioPlayer: {
//         width: '100%',
//         borderRadius: 20,
//         padding: 30,
//         alignItems: 'center',
//         elevation: 5,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.3,
//         shadowRadius: 8,
//     },
//     audioTitle: { fontSize: 16, fontWeight: '600', marginTop: 16, marginBottom: 8 },
//     audioControls: { marginTop: 16 },
//     audioButton: {
//         width: 60, height: 60, borderRadius: 30,
//         justifyContent: 'center', alignItems: 'center',
//     },
//     audioHint: { fontSize: 12, marginTop: 12 },
//     modalCounter: {
//         position: 'absolute', bottom: 50, alignSelf: 'center',
//         backgroundColor: 'rgba(0,0,0,0.5)',
//         paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20,
//     },
//     counterText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
// });

// export default GalleryAlbumDetailScreen;
import React, { useState, useCallback, useRef, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    SafeAreaView,
    TouchableOpacity,
    ActivityIndicator,
    FlatList,
    Platform,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { Video, Audio } from 'expo-av';
import ImageView from 'react-native-image-viewing';
import { useSelector } from 'react-redux';
import { selectThemeData } from '../../../store/slices/themeSlice';
import { useGetGalleryAlbumQuery, useDeleteAlbumMutation } from '../../../store/galleryApi';
import { BASE_URL } from '../../../config/constants';
import Toast from 'react-native-toast-message';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
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

const GalleryAlbumDetailScreen = ({ route, navigation }) => {
    const theme = useSelector(selectThemeData);
    const { albumId, albumTitle } = route.params;
    
    // Image Viewer State
    const [imageViewVisible, setImageViewVisible] = useState(false);
    const [imageViewIndex, setImageViewIndex] = useState(0);
    
    // Video/Audio State
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    
    const videoRef = useRef(null);
    const soundRef = useRef(null);

    const {
        data: album,
        isLoading,
        refetch,
    } = useGetGalleryAlbumQuery(albumId);

    const [deleteAlbum] = useDeleteAlbumMutation();

    const getFullUrl = useCallback((url) => {
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

    // ⭐ Get all image URLs for the image viewer
    const imageUrls = useMemo(() => {
        if (!album?.media) return [];
        return album.media
            .filter(item => getFileType(item.fileName || item.mediaUrl) === 'image')
            .map(item => ({ uri: getFullUrl(item.mediaUrl) }));
    }, [album, getFullUrl]);

    // ⭐ Handle image press - open image viewer
    const handleImagePress = useCallback((index) => {
        const mediaItem = album?.media?.[index];
        const type = getFileType(mediaItem?.fileName || mediaItem?.mediaUrl);
        
        if (type === 'image') {
            // Find the index in the images-only array
            const imageIndex = imageUrls.findIndex(
                img => img.uri === getFullUrl(mediaItem?.mediaUrl)
            );
            setImageViewIndex(imageIndex >= 0 ? imageIndex : 0);
            setImageViewVisible(true);
        } else if (type === 'video' || type === 'audio') {
            setSelectedMedia({
                index,
                type,
                url: getFullUrl(mediaItem?.mediaUrl),
                fileName: mediaItem?.fileName,
            });
            setIsPlaying(false);
        }
    }, [album, imageUrls, getFullUrl]);

    // Play audio
    const playAudio = useCallback(async (url) => {
        try {
            if (soundRef.current) {
                await soundRef.current.unloadAsync();
            }
            const { sound } = await Audio.Sound.createAsync(
                { uri: url },
                { shouldPlay: true }
            );
            soundRef.current = sound;
            setIsPlaying(true);
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) setIsPlaying(false);
            });
        } catch (error) {
            console.error('Error playing audio:', error);
            Toast.show({
                type: 'error',
                text1: 'Playback Error',
                text2: 'Could not play audio file',
                position: 'top',
            });
        }
    }, []);

    const stopAudio = useCallback(async () => {
        if (soundRef.current) {
            await soundRef.current.stopAsync();
            await soundRef.current.unloadAsync();
            soundRef.current = null;
            setIsPlaying(false);
        }
    }, []);

    const closeMediaModal = useCallback(async () => {
        if (soundRef.current) {
            await soundRef.current.stopAsync();
            await soundRef.current.unloadAsync();
            soundRef.current = null;
        }
        if (videoRef.current) {
            await videoRef.current.stopAsync();
        }
        setIsPlaying(false);
        setSelectedMedia(null);
    }, []);

    const handleDeleteAlbum = useCallback(() => {
        Alert.alert(
            'Delete Album',
            `Are you sure you want to delete "${album?.title || albumTitle}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteAlbum(albumId).unwrap();
                            Toast.show({
                                type: 'success',
                                text1: 'Album deleted',
                                position: 'top',
                                visibilityTime: 2000,
                            });
                            navigation.goBack();
                        } catch (error) {
                            Toast.show({
                                type: 'error',
                                text1: 'Error',
                                text2: error?.data?.message || 'Failed to delete album',
                                position: 'top',
                            });
                        }
                    },
                },
            ]
        );
    }, [deleteAlbum, albumId, album, albumTitle, navigation]);

    const renderGridItem = useCallback(({ item, index }) => {
        const type = getFileType(item.fileName || item.mediaUrl);
        const mediaUrl = getFullUrl(item.mediaUrl);

        return (
            <TouchableOpacity
                style={styles.gridItem}
                onPress={() => handleImagePress(index)}
                activeOpacity={0.8}
            >
                {type === 'video' ? (
                    <View style={[styles.gridPlaceholder, { backgroundColor: theme.error + '15' }]}>
                        <Icon name="play-circle" size={28} color={theme.error} />
                        <Text style={[styles.typeLabel, { color: theme.error }]}>Video</Text>
                    </View>
                ) : type === 'audio' ? (
                    <View style={[styles.gridPlaceholder, { backgroundColor: theme.warning + '15' }]}>
                        <Icon name="music-note" size={28} color={theme.warning} />
                        <Text style={[styles.typeLabel, { color: theme.warning }]}>Audio</Text>
                    </View>
                ) : mediaUrl ? (
                    <Image
                        source={{ uri: mediaUrl }}
                        style={styles.gridImage}
                        resizeMode="cover"
                    />
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
    }, [theme, getFullUrl, handleImagePress]);

    const albumMediaCount = album?.media?.length || 0;
    const videoCount = useMemo(() => 
        album?.media?.filter(m => getFileType(m.fileName || m.mediaUrl) === 'video').length || 0,
    [album]);
    const audioCount = useMemo(() => 
        album?.media?.filter(m => getFileType(m.fileName || m.mediaUrl) === 'audio').length || 0,
    [album]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <LinearGradient
                colors={theme.gradientPrimary || ['#6366F1', '#8B5CF6']}
                style={styles.header}
            >
                <View style={styles.headerTopRow}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Icon name="arrow-left" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAlbum}>
                        <Icon name="delete-outline" size={22} color="#FFF" />
                    </TouchableOpacity>
                </View>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle} numberOfLines={1}>
                        {album?.title || albumTitle || 'Album'}
                    </Text>
                    <Text style={styles.headerSubtitle}>
                        {albumMediaCount} {albumMediaCount === 1 ? 'Item' : 'Items'}
                        {videoCount > 0 ? ` • ${videoCount} Video${videoCount > 1 ? 's' : ''}` : ''}
                        {audioCount > 0 ? ` • ${audioCount} Audio` : ''}
                        {album?.eventDate ? ` • ${formatDate(album.eventDate)}` : ''}
                    </Text>
                    {album?.className && (
                        <Text style={styles.headerClassInfo}>
                            {album.className}{album.sectionName ? ` - ${album.sectionName}` : ''}
                        </Text>
                    )}
                </View>
            </LinearGradient>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.primary} />
                </View>
            ) : (
                <>
                    {album?.description ? (
                        <View style={[styles.descriptionCard, { backgroundColor: theme.card }]}>
                            <Text style={[styles.descriptionText, { color: theme.textSecondary }]}>
                                {album.description}
                            </Text>
                        </View>
                    ) : null}

                    {albumMediaCount > 0 ? (
                        <FlatList
                            data={album.media}
                            renderItem={renderGridItem}
                            keyExtractor={(item) => item.mediaId.toString()}
                            numColumns={NUM_COLUMNS}
                            contentContainerStyle={styles.gridContent}
                            showsVerticalScrollIndicator={false}
                            ItemSeparatorComponent={() => <View style={{ height: IMAGE_GAP }} />}
                        />
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Icon name="image-off-outline" size={60} color={theme.textTertiary} />
                            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                                No media in this album
                            </Text>
                        </View>
                    )}
                </>
            )}

            {/* ⭐ Image Viewer with Swipe + Zoom */}
            <ImageView
                images={imageUrls}
                imageIndex={imageViewIndex}
                visible={imageViewVisible}
                onRequestClose={() => setImageViewVisible(false)}
                animationType="fade"
                swipeToCloseEnabled={true}
                doubleTapToZoomEnabled={true}
                presentationStyle="fullScreen"
                FooterComponent={({ imageIndex }) => (
                    <View style={styles.imageFooter}>
                        <Text style={styles.imageFooterText}>
                            {imageIndex + 1} / {imageUrls.length}
                        </Text>
                    </View>
                )}
            />

            {/* Video/Audio Modal */}
            {selectedMedia && (
                <View style={styles.mediaModalOverlay}>
                    <SafeAreaView style={styles.mediaModalContainer}>
                        {/* Close Button */}
                        <TouchableOpacity
                            style={styles.mediaCloseButton}
                            onPress={closeMediaModal}
                        >
                            <Icon name="close" size={28} color="#FFF" />
                        </TouchableOpacity>

                        {/* Media Content */}
                        {selectedMedia.type === 'video' ? (
                            <View style={styles.videoContainer}>
                                <Video
                                    ref={videoRef}
                                    source={{ uri: selectedMedia.url }}
                                    style={styles.fullScreenVideo}
                                    resizeMode="contain"
                                    useNativeControls
                                    shouldPlay={false}
                                    isLooping={false}
                                />
                            </View>
                        ) : selectedMedia.type === 'audio' ? (
                            <View style={styles.audioContainer}>
                                <View style={[styles.audioPlayer, { backgroundColor: theme.card }]}>
                                    <Icon name="music-circle" size={80} color={theme.warning} />
                                    <Text style={[styles.audioTitle, { color: theme.text }]} numberOfLines={1}>
                                        {selectedMedia.fileName || 'Audio File'}
                                    </Text>
                                    <View style={styles.audioControls}>
                                        {isPlaying ? (
                                            <TouchableOpacity
                                                style={[styles.audioButton, { backgroundColor: theme.error }]}
                                                onPress={stopAudio}
                                            >
                                                <Icon name="stop" size={28} color="#FFF" />
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity
                                                style={[styles.audioButton, { backgroundColor: theme.primary }]}
                                                onPress={() => playAudio(selectedMedia.url)}
                                            >
                                                <Icon name="play" size={28} color="#FFF" />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                    <Text style={[styles.audioHint, { color: theme.textTertiary }]}>
                                        {isPlaying ? 'Playing...' : 'Tap play to listen'}
                                    </Text>
                                </View>
                            </View>
                        ) : null}

                        {/* File Name */}
                        <Text style={styles.mediaFileName} numberOfLines={1}>
                            {selectedMedia.fileName || 'Media File'}
                        </Text>
                    </SafeAreaView>
                </View>
            )}

            <Toast />
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
    headerTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    backButton: {
        width: 38, height: 38, borderRadius: 19,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center', alignItems: 'center',
    },
    deleteButton: {
        width: 38, height: 38, borderRadius: 19,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center', alignItems: 'center',
    },
    headerContent: { paddingLeft: 4 },
    headerTitle: { fontSize: 20, fontWeight: '800', color: '#FFF' },
    headerSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 3 },
    headerClassInfo: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
    descriptionCard: {
        margin: 16, marginBottom: 8, padding: 16, borderRadius: 14,
        elevation: 2, shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4,
    },
    descriptionText: { fontSize: 14, lineHeight: 20 },
    gridContent: { padding: 16, paddingTop: 8, paddingBottom: 30 },
    gridItem: {
        width: IMAGE_SIZE, height: IMAGE_SIZE,
        marginHorizontal: IMAGE_GAP / 2, borderRadius: 8, overflow: 'hidden',
    },
    gridImage: { width: '100%', height: '100%' },
    gridPlaceholder: {
        width: '100%', height: '100%',
        justifyContent: 'center', alignItems: 'center',
    },
    typeLabel: { fontSize: 9, fontWeight: '600', marginTop: 2 },
    typeBadge: {
        position: 'absolute', bottom: 4, left: 4,
        borderRadius: 6, paddingHorizontal: 5, paddingVertical: 2,
    },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { fontSize: 14, marginTop: 12 },
    
    // Image Footer
    imageFooter: {
        position: 'absolute',
        bottom: 50,
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
    },
    imageFooterText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
    
    // Video/Audio Modal
    mediaModalOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.95)',
        zIndex: 100,
    },
    mediaModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mediaCloseButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 60 : 40,
        right: 20,
        zIndex: 10,
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center', alignItems: 'center',
    },
    videoContainer: {
        width: screenWidth,
        height: screenHeight * 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullScreenVideo: {
        width: screenWidth,
        height: screenHeight * 0.5,
    },
    audioContainer: {
        width: screenWidth * 0.85,
        alignItems: 'center',
    },
    audioPlayer: {
        width: '100%',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    audioTitle: { fontSize: 16, fontWeight: '600', marginTop: 16, marginBottom: 8 },
    audioControls: { marginTop: 16 },
    audioButton: {
        width: 60, height: 60, borderRadius: 30,
        justifyContent: 'center', alignItems: 'center',
    },
    audioHint: { fontSize: 12, marginTop: 12 },
    mediaFileName: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        marginTop: 20,
        paddingHorizontal: 20,
    },
});

export default GalleryAlbumDetailScreen;