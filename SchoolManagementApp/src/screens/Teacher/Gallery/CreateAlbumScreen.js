// import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
// import {
//     View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
//     Image, ActivityIndicator, Platform, SafeAreaView, Dimensions, Alert,
//     Modal, FlatList,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import LinearGradient from 'react-native-linear-gradient';
// import { launchImageLibrary } from 'react-native-image-picker';
// import { launchCamera } from 'react-native-image-picker';
// import Toast from 'react-native-toast-message';
// import { useSelector } from 'react-redux';
// import { selectThemeData } from '../../../store/slices/themeSlice';
// import {
//     useGetLectureClassesQuery,
//     useGetLectureSectionsQuery,
// } from '../../../store/lectureApi';
// import { useCreateAlbumMutation } from '../../../store/galleryApi';
// import { 
//     processMediaFiles, 
//     formatFileSize, 
//     calculateTotalSize,
//     isVideoFile,
// } from '../../../utils/mediaCompression';

// const { width: screenWidth } = Dimensions.get('window');
// const MAX_FILES = 50;
// const MAX_TOTAL_SIZE = 100 * 1024 * 1024; // 100MB max total

// // ==================== CUSTOM DROPDOWN COMPONENT ====================
// const SimpleDropdown = React.memo(({ 
//     label, placeholder, items, value, onSelect, 
//     loading, disabled, theme 
// }) => {
//     const [visible, setVisible] = useState(false);
//     const [search, setSearch] = useState('');

//     const selectedItem = useMemo(() => 
//         items.find(i => i.value === value), [items, value]
//     );

//     const filteredItems = useMemo(() => {
//         if (!search.trim()) return items;
//         const q = search.toLowerCase();
//         return items.filter(i => i.label.toLowerCase().includes(q));
//     }, [items, search]);

//     const handleSelect = useCallback((item) => {
//         onSelect(item.value);
//         setVisible(false);
//         setSearch('');
//     }, [onSelect]);

//     const renderItem = useCallback(({ item }) => {
//         const isSelected = item.value === value;
//         return (
//             <TouchableOpacity
//                 style={[dropdownStyles.item, isSelected && { backgroundColor: theme.primary + '15' }]}
//                 onPress={() => handleSelect(item)}
//                 activeOpacity={0.6}
//             >
//                 <Text style={[dropdownStyles.itemText, { color: isSelected ? theme.primary : theme.text }]}>
//                     {item.label}
//                 </Text>
//                 {isSelected && <Icon name="check" size={20} color={theme.primary} />}
//             </TouchableOpacity>
//         );
//     }, [value, theme, handleSelect]);

//     return (
//         <View style={styles.inputGroup}>
//             {label && (
//                 <Text style={[styles.label, { color: theme.text }]}>
//                     {label} <Text style={{ color: theme.error }}>*</Text>
//                 </Text>
//             )}
//             <TouchableOpacity
//                 style={[dropdownStyles.button, { 
//                     backgroundColor: disabled ? theme.background : theme.background,
//                     borderColor: theme.border,
//                     opacity: disabled ? 0.6 : 1,
//                 }]}
//                 onPress={() => !disabled && setVisible(true)}
//                 activeOpacity={0.7}
//                 disabled={disabled}
//             >
//                 <Text style={[dropdownStyles.buttonText, { 
//                     color: selectedItem ? theme.text : theme.textTertiary 
//                 }]} numberOfLines={1}>
//                     {loading ? 'Loading...' : selectedItem ? selectedItem.label : placeholder}
//                 </Text>
//                 {loading ? (
//                     <ActivityIndicator size="small" color={theme.primary} />
//                 ) : (
//                     <Icon name="chevron-down" size={20} color={theme.textTertiary} />
//                 )}
//             </TouchableOpacity>

//             <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setVisible(false)}>
//                 <SafeAreaView style={[dropdownStyles.modal, { backgroundColor: theme.background }]}>
//                     <View style={[dropdownStyles.modalHeader, { borderBottomColor: theme.border }]}>
//                         <TouchableOpacity onPress={() => { setVisible(false); setSearch(''); }} style={dropdownStyles.closeBtn}>
//                             <Icon name="close" size={24} color={theme.text} />
//                         </TouchableOpacity>
//                         <Text style={[dropdownStyles.modalTitle, { color: theme.text }]}>{placeholder}</Text>
//                         <View style={{ width: 40 }} />
//                     </View>

//                     <View style={[dropdownStyles.searchBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
//                         <Icon name="magnify" size={20} color={theme.textTertiary} style={{ marginRight: 10 }} />
//                         <TextInput
//                             style={[dropdownStyles.searchInput, { color: theme.text }]}
//                             placeholder="Search..."
//                             placeholderTextColor={theme.textTertiary}
//                             value={search}
//                             onChangeText={setSearch}
//                             autoFocus
//                         />
//                         {search.length > 0 && (
//                             <TouchableOpacity onPress={() => setSearch('')}>
//                                 <Icon name="close-circle" size={20} color={theme.textTertiary} />
//                             </TouchableOpacity>
//                         )}
//                     </View>

//                     {loading ? (
//                         <View style={dropdownStyles.loading}>
//                             <ActivityIndicator size="large" color={theme.primary} />
//                         </View>
//                     ) : (
//                         <FlatList
//                             data={filteredItems}
//                             renderItem={renderItem}
//                             keyExtractor={item => String(item.value)}
//                             contentContainerStyle={dropdownStyles.list}
//                             showsVerticalScrollIndicator={false}
//                             keyboardShouldPersistTaps="handled"
//                             ListEmptyComponent={() => (
//                                 <View style={dropdownStyles.empty}>
//                                     <Icon name="alert-circle-outline" size={50} color={theme.textTertiary} />
//                                     <Text style={[dropdownStyles.emptyText, { color: theme.textTertiary }]}>
//                                         {search ? 'No matching items found' : 'No items available'}
//                                     </Text>
//                                 </View>
//                             )}
//                         />
//                     )}
//                 </SafeAreaView>
//             </Modal>
//         </View>
//     );
// });

// // ==================== MAIN CREATE ALBUM SCREEN ====================
// const CreateAlbumScreen = ({ navigation }) => {
//     const theme = useSelector(selectThemeData);

//     // Form State
//     const [title, setTitle] = useState('');
//     const [description, setDescription] = useState('');
//     const [classId, setClassId] = useState(null);
//     const [sectionId, setSectionId] = useState(null);
//     const [selectedMedia, setSelectedMedia] = useState([]);
//     const [errors, setErrors] = useState({});
//     const [isProcessing, setIsProcessing] = useState(false);
//     const [totalSize, setTotalSize] = useState(0);

//     // API Queries
//     const { data: classesData = [], isLoading: classesLoading } = useGetLectureClassesQuery();
//     const { data: sectionsData = [], isLoading: sectionsLoading } = useGetLectureSectionsQuery(classId, { skip: !classId });
//     const [createAlbum, { isLoading: isCreating }] = useCreateAlbumMutation();

//     // Transform data for dropdowns
//     const classItems = useMemo(() => 
//         Array.isArray(classesData) 
//             ? classesData.map(c => ({ label: c.className || `Class ${c.classId}`, value: c.classId })) 
//             : [], 
//     [classesData]);
    
//     const sectionItems = useMemo(() => 
//         Array.isArray(sectionsData) 
//             ? sectionsData.map(s => ({ label: s.sectionName || `Section ${s.sectionId}`, value: s.sectionId })) 
//             : [], 
//     [sectionsData]);

//     // Reset section when class changes
//     useEffect(() => {
//         if (classId) {
//             setSectionId(null);
//             setErrors(prev => ({ ...prev, section: '' }));
//         }
//     }, [classId]);

//     // Calculate total size when media changes
//     useEffect(() => {
//         const updateTotalSize = async () => {
//             if (selectedMedia.length > 0) {
//                 const size = await calculateTotalSize(selectedMedia);
//                 setTotalSize(size);
//             } else {
//                 setTotalSize(0);
//             }
//         };
//         updateTotalSize();
//     }, [selectedMedia]);

//     // Handlers
//     const handleClassSelect = useCallback((value) => {
//         setClassId(value);
//         setErrors(prev => ({ ...prev, classId: '' }));
//     }, []);

//     const handleSectionSelect = useCallback((value) => {
//         setSectionId(value);
//         setErrors(prev => ({ ...prev, section: '' }));
//     }, []);

//     // Pick media options
//     const handlePickMedia = useCallback(() => {
//         Alert.alert(
//             'Add Media',
//             'Choose an option',
//             [
//                 { text: 'Take Photo', onPress: () => handleTakePhoto() },
//                 { text: 'Record Video', onPress: () => handleRecordVideo() },
//                 { text: 'Choose from Gallery', onPress: () => handleChooseFromGallery() },
//                 { text: 'Cancel', style: 'cancel' },
//             ]
//         );
//     }, [selectedMedia.length]);

//     const handleTakePhoto = useCallback(() => {
//         launchCamera({
//             mediaType: 'photo',
//             quality: 0.8,
//             maxWidth: 1920,
//             maxHeight: 1920,
//         }, (response) => processMediaResponse(response));
//     }, [selectedMedia.length]);

//     const handleRecordVideo = useCallback(() => {
//         launchCamera({
//             mediaType: 'video',
//             videoQuality: 'high',
//             durationLimit: 300,
//         }, (response) => processMediaResponse(response));
//     }, [selectedMedia.length]);

//     const handleChooseFromGallery = useCallback(() => {
//         launchImageLibrary({
//             mediaType: 'mixed',
//             selectionLimit: MAX_FILES - selectedMedia.length,
//             quality: 0.8,
//             maxWidth: 1920,
//             maxHeight: 1920,
//         }, (response) => processMediaResponse(response));
//     }, [selectedMedia.length]);

//     // Process selected media
//     const processMediaResponse = useCallback(async (response) => {
//         if (response.didCancel) return;
//         if (response.errorCode) {
//             Toast.show({ 
//                 type: 'error', 
//                 text1: 'Error', 
//                 text2: response.errorMessage || 'Failed to pick media',
//                 position: 'top',
//             });
//             return;
//         }

//         if (response.assets) {
//             const newMedia = response.assets.filter(asset => {
//                 if (asset.fileSize > 50 * 1024 * 1024) {
//                     Toast.show({
//                         type: 'error',
//                         text1: 'File too large',
//                         text2: `${asset.fileName} exceeds 50MB limit`,
//                         position: 'top',
//                     });
//                     return false;
//                 }
//                 return true;
//             });

//             if (selectedMedia.length + newMedia.length > MAX_FILES) {
//                 Toast.show({
//                     type: 'error',
//                     text1: 'Too many files',
//                     text2: `Maximum ${MAX_FILES} files allowed`,
//                     position: 'top',
//                 });
//                 return;
//             }

//             setIsProcessing(true);
//             Toast.show({
//                 type: 'info',
//                 text1: 'Processing',
//                 text2: 'Compressing media files...',
//                 position: 'top',
//                 autoHide: false,
//             });

//             try {
//                 const processedMedia = await processMediaFiles(newMedia, {
//                     compressImages: true,
//                     imageQuality: 0.7,
//                     maxImageWidth: 1200,
//                     maxImageHeight: 1200,
//                 });

//                 setSelectedMedia(prev => [...prev, ...processedMedia]);
                
//                 Toast.hide();
//                 Toast.show({
//                     type: 'success',
//                     text1: 'Media Added',
//                     text2: `${processedMedia.length} files processed`,
//                     position: 'top',
//                     visibilityTime: 2000,
//                 });
//             } catch (error) {
//                 Toast.hide();
//                 console.error('Media processing error:', error);
//                 setSelectedMedia(prev => [...prev, ...newMedia]);
//                 Toast.show({
//                     type: 'warning',
//                     text1: 'Processing Warning',
//                     text2: 'Some files may not be compressed',
//                     position: 'top',
//                     visibilityTime: 3000,
//                 });
//             } finally {
//                 setIsProcessing(false);
//             }
//         }
//     }, [selectedMedia.length]);

//     // Remove media
//     const handleRemoveMedia = useCallback((index) => {
//         setSelectedMedia(prev => prev.filter((_, i) => i !== index));
//     }, []);

//     // Submit
//     const handleSubmit = useCallback(async () => {
//         const validationErrors = {};
//         if (!title.trim()) validationErrors.title = 'Title is required';
//         if (!classId) validationErrors.classId = 'Please select a class';
//         if (!sectionId) validationErrors.section = 'Please select a section';
//         if (selectedMedia.length === 0) validationErrors.media = 'Please select at least one file';

//         setErrors(validationErrors);

//         if (Object.keys(validationErrors).length > 0) {
//             Toast.show({ 
//                 type: 'error', 
//                 text1: 'Validation Error', 
//                 text2: 'Please fill all required fields', 
//                 position: 'top', 
//                 visibilityTime: 3000 
//             });
//             return;
//         }

//         if (totalSize > MAX_TOTAL_SIZE) {
//             Toast.show({
//                 type: 'error',
//                 text1: 'Size Limit Exceeded',
//                 text2: `Total size: ${formatFileSize(totalSize)}. Max allowed: ${formatFileSize(MAX_TOTAL_SIZE)}`,
//                 position: 'top',
//                 visibilityTime: 4000,
//             });
//             return;
//         }

//         const formData = new FormData();
//         formData.append('Title', title.trim());
//         formData.append('Description', description.trim() || '');
//         formData.append('ClassId', classId);
//         formData.append('SectionId', sectionId);
        
//         selectedMedia.forEach((media, index) => {
//             const fileName = media.fileName || `media_${index}.${media.uri.split('.').pop() || 'jpg'}`;
//             const fileType = media.type || (isVideoFile(fileName) ? 'video/mp4' : 'image/jpeg');
            
//             formData.append('files', {
//                 uri: media.uri,
//                 type: fileType,
//                 name: fileName,
//             });
//         });

//         try {
//             await createAlbum(formData).unwrap();
//             Toast.show({ 
//                 type: 'success', 
//                 text1: 'Success!', 
//                 text2: 'Album created successfully', 
//                 position: 'top', 
//                 visibilityTime: 3000 
//             });
//             setTimeout(() => navigation.goBack(), 1500);
//         } catch (error) {
//             Toast.show({ 
//                 type: 'error', 
//                 text1: 'Error', 
//                 text2: error?.data?.message || 'Failed to create album', 
//                 position: 'top', 
//                 visibilityTime: 4000 
//             });
//         }
//     }, [title, description, classId, sectionId, selectedMedia, totalSize, createAlbum, navigation]);

//     // Count media types
//     const imageCount = useMemo(() => 
//         selectedMedia.filter(m => !isVideoFile(m.fileName || m.uri)).length,
//     [selectedMedia]);
    
//     const videoCount = useMemo(() => 
//         selectedMedia.filter(m => isVideoFile(m.fileName || m.uri)).length,
//     [selectedMedia]);

//     return (
//         <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
//             <LinearGradient colors={theme.gradientPrimary || ['#6366F1', '#8B5CF6']} style={styles.header}>
//                 <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//                     <Icon name="arrow-left" size={24} color="#FFF" />
//                 </TouchableOpacity>
//                 <View style={styles.headerContent}>
//                     <Text style={styles.headerTitle}>Create Gallery Album</Text>
//                     <Text style={styles.headerSubtitle}>Share moments with students and parents</Text>
//                 </View>
//             </LinearGradient>

//             <ScrollView style={styles.flex} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                
//                 {/* Album Info Card */}
//                 <View style={[styles.card, { backgroundColor: theme.card }]}>
//                     <View style={styles.cardHeader}>
//                         <View style={[styles.cardIcon, { backgroundColor: theme.primary + '15' }]}>
//                             <Icon name="information-outline" size={20} color={theme.primary} />
//                         </View>
//                         <Text style={[styles.cardTitle, { color: theme.text }]}>Album Information</Text>
//                     </View>

//                     <View style={styles.inputGroup}>
//                         <Text style={[styles.label, { color: theme.text }]}>Album Title <Text style={{ color: theme.error }}>*</Text></Text>
//                         <TextInput
//                             style={[styles.input, { backgroundColor: theme.background, borderColor: errors.title ? theme.error : theme.border, color: theme.text }]}
//                             placeholder="e.g., Annual Sports Day 2024"
//                             placeholderTextColor={theme.textTertiary}
//                             value={title} 
//                             onChangeText={(t) => { setTitle(t); setErrors(prev => ({ ...prev, title: '' })); }}
//                             maxLength={250}
//                         />
//                         {errors.title ? <Text style={[styles.errorText, { color: theme.error }]}>{errors.title}</Text> : null}
//                     </View>

//                     <View style={styles.inputGroup}>
//                         <Text style={[styles.label, { color: theme.text }]}>Description</Text>
//                         <TextInput
//                             style={[styles.input, styles.textArea, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text }]}
//                             placeholder="Describe the event or album..."
//                             placeholderTextColor={theme.textTertiary}
//                             value={description} 
//                             onChangeText={setDescription}
//                             multiline 
//                             numberOfLines={3} 
//                             textAlignVertical="top"
//                         />
//                     </View>
//                 </View>

//                 {/* Classification Card */}
//                 <View style={[styles.card, { backgroundColor: theme.card }]}>
//                     <View style={styles.cardHeader}>
//                         <View style={[styles.cardIcon, { backgroundColor: theme.success + '15' }]}>
//                             <Icon name="folder-multiple-outline" size={20} color={theme.success} />
//                         </View>
//                         <Text style={[styles.cardTitle, { color: theme.text }]}>Classification</Text>
//                     </View>

//                     <SimpleDropdown
//                         label="Class"
//                         placeholder="Select Class"
//                         items={classItems}
//                         value={classId}
//                         onSelect={handleClassSelect}
//                         loading={classesLoading}
//                         theme={theme}
//                     />
//                     {errors.classId ? <Text style={[styles.errorText, { color: theme.error }]}>{errors.classId}</Text> : null}

//                     <SimpleDropdown
//                         label="Section"
//                         placeholder="Select Section"
//                         items={sectionItems}
//                         value={sectionId}
//                         onSelect={handleSectionSelect}
//                         loading={sectionsLoading}
//                         disabled={!classId}
//                         theme={theme}
//                     />
//                     {errors.section ? <Text style={[styles.errorText, { color: theme.error }]}>{errors.section}</Text> : null}
//                 </View>

//                 {/* Media Upload Card */}
//                 <View style={[styles.card, { backgroundColor: theme.card }]}>
//                     <View style={styles.cardHeader}>
//                         <View style={[styles.cardIcon, { backgroundColor: theme.warning + '15' }]}>
//                             <Icon name="image-multiple" size={20} color={theme.warning} />
//                         </View>
//                         <Text style={[styles.cardTitle, { color: theme.text }]}>
//                             Photos & Videos <Text style={{ color: theme.error }}>*</Text>
//                         </Text>
//                     </View>

//                     {/* Media Stats */}
//                     {selectedMedia.length > 0 && (
//                         <View style={styles.mediaStats}>
//                             <View style={[styles.statBadge, { backgroundColor: theme.primary + '15' }]}>
//                                 <Icon name="image" size={14} color={theme.primary} />
//                                 <Text style={[styles.statText, { color: theme.primary }]}>{imageCount} Photos</Text>
//                             </View>
//                             {videoCount > 0 && (
//                                 <View style={[styles.statBadge, { backgroundColor: theme.error + '15' }]}>
//                                     <Icon name="video" size={14} color={theme.error} />
//                                     <Text style={[styles.statText, { color: theme.error }]}>{videoCount} Videos</Text>
//                                 </View>
//                             )}
//                             <View style={[styles.statBadge, { backgroundColor: theme.success + '15' }]}>
//                                 <Icon name="harddisk" size={14} color={theme.success} />
//                                 <Text style={[styles.statText, { color: theme.success }]}>{formatFileSize(totalSize)}</Text>
//                             </View>
//                         </View>
//                     )}

//                     {/* Processing Indicator */}
//                     {isProcessing && (
//                         <View style={styles.processingContainer}>
//                             <ActivityIndicator size="small" color={theme.primary} />
//                             <Text style={[styles.processingText, { color: theme.textSecondary }]}>
//                                 Compressing media files...
//                             </Text>
//                         </View>
//                     )}

//                     {/* Selected Media Grid */}
//                     {selectedMedia.length > 0 && (
//                         <View style={styles.mediaGrid}>
//                             {selectedMedia.map((media, index) => {
//                                 const isVideo = isVideoFile(media.fileName || media.uri);
//                                 return (
//                                     <View key={index} style={styles.mediaItem}>
//                                         {isVideo ? (
//                                             <View style={[styles.videoPreview, { backgroundColor: theme.background }]}>
//                                                 <Icon name="play-circle" size={30} color={theme.error} />
//                                             </View>
//                                         ) : (
//                                             <Image source={{ uri: media.uri }} style={styles.mediaPreview} resizeMode="cover" />
//                                         )}
//                                         <TouchableOpacity
//                                             style={styles.removeMediaBtn}
//                                             onPress={() => handleRemoveMedia(index)}
//                                         >
//                                             <Icon name="close-circle" size={22} color={theme.error} />
//                                         </TouchableOpacity>
//                                         {isVideo && (
//                                             <View style={styles.videoBadge}>
//                                                 <Icon name="video" size={10} color="#FFF" />
//                                             </View>
//                                         )}
//                                     </View>
//                                 );
//                             })}
//                         </View>
//                     )}

//                     {/* Add Media Button */}
//                     <TouchableOpacity
//                         style={[styles.addMediaBtn, { borderColor: theme.primary, backgroundColor: theme.primary + '08' }]}
//                         onPress={handlePickMedia}
//                         activeOpacity={0.7}
//                         disabled={isProcessing}
//                     >
//                         <Icon name="image-plus" size={24} color={theme.primary} />
//                         <Text style={[styles.addMediaText, { color: theme.primary }]}>
//                             {selectedMedia.length > 0 ? 'Add More' : 'Add Photos & Videos'}
//                         </Text>
//                     </TouchableOpacity>

//                     {errors.media ? <Text style={[styles.errorText, { color: theme.error, marginTop: 8 }]}>{errors.media}</Text> : null}
                    
//                     <Text style={[styles.helpText, { color: theme.textTertiary }]}>
//                         Supported: Images (JPG, PNG, HEIC) & Videos (MP4, MOV){'\n'}
//                         Max 50 files • Max 100MB total
//                     </Text>
//                 </View>

//                 {/* Submit Button */}
//                 <TouchableOpacity 
//                     style={styles.submitContainer} 
//                     onPress={handleSubmit} 
//                     disabled={isCreating || isProcessing} 
//                     activeOpacity={0.8}
//                 >
//                     <LinearGradient
//                         colors={isCreating || isProcessing ? ['#94A3B8', '#94A3B8'] : theme.gradientPrimary || ['#6366F1', '#8B5CF6']}
//                         start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
//                         style={styles.submitButton}
//                     >
//                         {isCreating || isProcessing ? (
//                             <View style={styles.submitContent}>
//                                 <ActivityIndicator size="small" color="#FFF" />
//                                 <Text style={styles.submitText}>
//                                     {isProcessing ? 'Processing...' : 'Creating Album...'}
//                                 </Text>
//                             </View>
//                         ) : (
//                             <View style={styles.submitContent}>
//                                 <Icon name="check-circle" size={22} color="#FFF" />
//                                 <Text style={styles.submitText}>Create Album</Text>
//                             </View>
//                         )}
//                     </LinearGradient>
//                 </TouchableOpacity>
//                 <View style={{ height: 30 }} />
//             </ScrollView>
//             <Toast />
//         </SafeAreaView>
//     );
// };

// // ==================== STYLES ====================
// const dropdownStyles = StyleSheet.create({
//     button: { 
//         flexDirection: 'row', 
//         alignItems: 'center', 
//         justifyContent: 'space-between', 
//         borderWidth: 1.5, 
//         borderRadius: 12, 
//         paddingHorizontal: 14, 
//         height: 48 
//     },
//     buttonText: { flex: 1, fontSize: 14 },
//     modal: { flex: 1 },
//     modalHeader: { 
//         flexDirection: 'row', 
//         alignItems: 'center', 
//         justifyContent: 'space-between', 
//         paddingHorizontal: 16, 
//         paddingVertical: 14, 
//         borderBottomWidth: 1 
//     },
//     closeBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
//     modalTitle: { fontSize: 18, fontWeight: '700' },
//     searchBox: { 
//         flexDirection: 'row', 
//         alignItems: 'center', 
//         margin: 16, 
//         paddingHorizontal: 14, 
//         borderRadius: 12, 
//         borderWidth: 1.5, 
//         height: 48 
//     },
//     searchInput: { flex: 1, fontSize: 15 },
//     list: { paddingHorizontal: 16, paddingBottom: 40 },
//     item: { 
//         flexDirection: 'row', 
//         alignItems: 'center', 
//         justifyContent: 'space-between', 
//         paddingVertical: 14, 
//         paddingHorizontal: 16, 
//         borderRadius: 12, 
//         marginVertical: 2 
//     },
//     itemText: { fontSize: 15 },
//     loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//     empty: { alignItems: 'center', paddingVertical: 60 },
//     emptyText: { fontSize: 15, marginTop: 12 },
// });

// const styles = StyleSheet.create({
//     container: { flex: 1 },
//     flex: { flex: 1 },
//     header: { 
//         paddingHorizontal: 20, 
//         paddingTop: Platform.OS === 'ios' ? 10 : 15, 
//         paddingBottom: 22, 
//         borderBottomLeftRadius: 25, 
//         borderBottomRightRadius: 25 
//     },
//     backButton: { 
//         width: 38, height: 38, borderRadius: 19, 
//         backgroundColor: 'rgba(255,255,255,0.2)', 
//         justifyContent: 'center', alignItems: 'center', 
//         marginBottom: 12 
//     },
//     headerContent: { paddingLeft: 4 },
//     headerTitle: { fontSize: 22, fontWeight: '800', color: '#FFF' },
//     headerSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 3 },
//     scrollContent: { padding: 14, paddingTop: 16 },
    
//     // Card Styles
//     card: { 
//         borderRadius: 18, padding: 18, marginBottom: 16, 
//         shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, 
//         shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 
//     },
//     cardHeader: { 
//         flexDirection: 'row', alignItems: 'center', 
//         marginBottom: 18, paddingBottom: 14, 
//         borderBottomWidth: 1, borderBottomColor: '#E2E8F0' 
//     },
//     cardIcon: { 
//         width: 34, height: 34, borderRadius: 10, 
//         justifyContent: 'center', alignItems: 'center', marginRight: 10 
//     },
//     cardTitle: { fontSize: 16, fontWeight: '700' },
    
//     // Input Styles
//     inputGroup: { marginBottom: 16 },
//     label: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
//     input: { borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, height: 48, fontSize: 14 },
//     textArea: { minHeight: 80, paddingTop: 12 },
//     errorText: { fontSize: 12, marginTop: 4, fontWeight: '500' },
    
//     // Media Styles
//     mediaStats: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
//     statBadge: { 
//         flexDirection: 'row', alignItems: 'center', 
//         paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, gap: 4 
//     },
//     statText: { fontSize: 11, fontWeight: '600' },
//     processingContainer: { 
//         flexDirection: 'row', alignItems: 'center', justifyContent: 'center', 
//         padding: 12, marginBottom: 12, borderRadius: 10, gap: 8 
//     },
//     processingText: { fontSize: 13 },
//     mediaGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -3, marginBottom: 12 },
//     mediaItem: { 
//         width: (screenWidth - 60) / 3, 
//         height: (screenWidth - 60) / 3, 
//         margin: 3, borderRadius: 10, overflow: 'hidden' 
//     },
//     mediaPreview: { width: '100%', height: '100%' },
//     videoPreview: { 
//         width: '100%', height: '100%', 
//         justifyContent: 'center', alignItems: 'center' 
//     },
//     removeMediaBtn: { 
//         position: 'absolute', top: 3, right: 3, 
//         backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 11 
//     },
//     videoBadge: { 
//         position: 'absolute', bottom: 4, left: 4, 
//         backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 8, 
//         paddingHorizontal: 5, paddingVertical: 2 
//     },
//     addMediaBtn: { 
//         flexDirection: 'row', alignItems: 'center', justifyContent: 'center', 
//         paddingVertical: 16, borderRadius: 14, borderWidth: 2, 
//         borderStyle: 'dashed', gap: 8 
//     },
//     addMediaText: { fontSize: 15, fontWeight: '600' },
//     helpText: { fontSize: 11, marginTop: 12, textAlign: 'center', lineHeight: 18 },
    
//     // Submit Styles
//     submitContainer: { marginTop: 8 },
//     submitButton: { 
//         height: 54, borderRadius: 14, 
//         justifyContent: 'center', alignItems: 'center' 
//     },
//     submitContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//     submitText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
// });

// export default CreateAlbumScreen;
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
    Image, ActivityIndicator, Platform, SafeAreaView, Dimensions, Alert,
    Modal, FlatList, Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { selectThemeData } from '../../../store/slices/themeSlice';
import {
    useGetLectureClassesQuery,
    useGetLectureSectionsQuery,
} from '../../../store/lectureApi';
import { useCreateAlbumMutation } from '../../../store/galleryApi';
import { 
    processMediaFiles, 
    formatFileSize, 
    calculateTotalSize,
    isVideoFile,
} from '../../../utils/mediaCompression';

const { width: screenWidth } = Dimensions.get('window');
const MAX_FILES = 50;
const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB max total

// ==================== PERMISSION HANDLERS ====================
const getCameraPermission = () => {
    return Platform.select({
        ios: PERMISSIONS.IOS.CAMERA,
        android: PERMISSIONS.ANDROID.CAMERA,
    });
};

const getGalleryPermission = () => {
    return Platform.select({
        ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
        android: Platform.Version >= 33 
            ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES 
            : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    });
};

const getVideoPermission = () => {
    return Platform.select({
        ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
        android: Platform.Version >= 33 
            ? PERMISSIONS.ANDROID.READ_MEDIA_VIDEO 
            : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    });
};

const checkAndRequestPermission = async (permission, permissionName) => {
    try {
        const result = await check(permission);
        
        if (result === RESULTS.GRANTED || result === RESULTS.LIMITED) {
            return true;
        }

        if (result === RESULTS.DENIED) {
            const requestResult = await request(permission);
            if (requestResult === RESULTS.GRANTED || requestResult === RESULTS.LIMITED) {
                return true;
            }
        }

        Alert.alert(
            `${permissionName} Permission Required`,
            `Please grant ${permissionName.toLowerCase()} permission in Settings to continue.`,
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Open Settings', 
                    onPress: () => Linking.openSettings()
                },
            ]
        );
        return false;
    } catch (error) {
        console.error(`Error checking ${permissionName} permission:`, error);
        return false;
    }
};

// ==================== CUSTOM DROPDOWN COMPONENT ====================
const SimpleDropdown = React.memo(({ 
    label, placeholder, items, value, onSelect, 
    loading, disabled, theme 
}) => {
    const [visible, setVisible] = useState(false);
    const [search, setSearch] = useState('');

    const selectedItem = useMemo(() => 
        items.find(i => i.value === value), [items, value]
    );

    const filteredItems = useMemo(() => {
        if (!search.trim()) return items;
        const q = search.toLowerCase();
        return items.filter(i => i.label.toLowerCase().includes(q));
    }, [items, search]);

    const handleSelect = useCallback((item) => {
        onSelect(item.value);
        setVisible(false);
        setSearch('');
    }, [onSelect]);

    const renderItem = useCallback(({ item }) => {
        const isSelected = item.value === value;
        return (
            <TouchableOpacity
                style={[dropdownStyles.item, isSelected && { backgroundColor: theme.primary + '15' }]}
                onPress={() => handleSelect(item)}
                activeOpacity={0.6}
            >
                <Text style={[dropdownStyles.itemText, { color: isSelected ? theme.primary : theme.text }]}>
                    {item.label}
                </Text>
                {isSelected && <Icon name="check" size={20} color={theme.primary} />}
            </TouchableOpacity>
        );
    }, [value, theme, handleSelect]);

    return (
        <View style={styles.inputGroup}>
            {label && (
                <Text style={[styles.label, { color: theme.text }]}>
                    {label} <Text style={{ color: theme.error }}>*</Text>
                </Text>
            )}
            <TouchableOpacity
                style={[dropdownStyles.button, { 
                    backgroundColor: disabled ? theme.background : theme.background,
                    borderColor: theme.border,
                    opacity: disabled ? 0.6 : 1,
                }]}
                onPress={() => !disabled && setVisible(true)}
                activeOpacity={0.7}
                disabled={disabled}
            >
                <Text style={[dropdownStyles.buttonText, { 
                    color: selectedItem ? theme.text : theme.textTertiary 
                }]} numberOfLines={1}>
                    {loading ? 'Loading...' : selectedItem ? selectedItem.label : placeholder}
                </Text>
                {loading ? (
                    <ActivityIndicator size="small" color={theme.primary} />
                ) : (
                    <Icon name="chevron-down" size={20} color={theme.textTertiary} />
                )}
            </TouchableOpacity>

            <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setVisible(false)}>
                <SafeAreaView style={[dropdownStyles.modal, { backgroundColor: theme.background }]}>
                    <View style={[dropdownStyles.modalHeader, { borderBottomColor: theme.border }]}>
                        <TouchableOpacity onPress={() => { setVisible(false); setSearch(''); }} style={dropdownStyles.closeBtn}>
                            <Icon name="close" size={24} color={theme.text} />
                        </TouchableOpacity>
                        <Text style={[dropdownStyles.modalTitle, { color: theme.text }]}>{placeholder}</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    <View style={[dropdownStyles.searchBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <Icon name="magnify" size={20} color={theme.textTertiary} style={{ marginRight: 10 }} />
                        <TextInput
                            style={[dropdownStyles.searchInput, { color: theme.text }]}
                            placeholder="Search..."
                            placeholderTextColor={theme.textTertiary}
                            value={search}
                            onChangeText={setSearch}
                            autoFocus
                        />
                        {search.length > 0 && (
                            <TouchableOpacity onPress={() => setSearch('')}>
                                <Icon name="close-circle" size={20} color={theme.textTertiary} />
                            </TouchableOpacity>
                        )}
                    </View>

                    {loading ? (
                        <View style={dropdownStyles.loading}>
                            <ActivityIndicator size="large" color={theme.primary} />
                        </View>
                    ) : (
                        <FlatList
                            data={filteredItems}
                            renderItem={renderItem}
                            keyExtractor={item => String(item.value)}
                            contentContainerStyle={dropdownStyles.list}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                            ListEmptyComponent={() => (
                                <View style={dropdownStyles.empty}>
                                    <Icon name="alert-circle-outline" size={50} color={theme.textTertiary} />
                                    <Text style={[dropdownStyles.emptyText, { color: theme.textTertiary }]}>
                                        {search ? 'No matching items found' : 'No items available'}
                                    </Text>
                                </View>
                            )}
                        />
                    )}
                </SafeAreaView>
            </Modal>
        </View>
    );
});

// ==================== MAIN CREATE ALBUM SCREEN ====================
const CreateAlbumScreen = ({ navigation }) => {
    const theme = useSelector(selectThemeData);

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [classId, setClassId] = useState(null);
    const [sectionId, setSectionId] = useState(null);
    const [selectedMedia, setSelectedMedia] = useState([]);
    const [errors, setErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [totalSize, setTotalSize] = useState(0);

    // API Queries
    const { data: classesData = [], isLoading: classesLoading } = useGetLectureClassesQuery();
    const { data: sectionsData = [], isLoading: sectionsLoading } = useGetLectureSectionsQuery(classId, { skip: !classId });
    const [createAlbum, { isLoading: isCreating }] = useCreateAlbumMutation();

    // Transform data for dropdowns
    const classItems = useMemo(() => 
        Array.isArray(classesData) 
            ? classesData.map(c => ({ label: c.className || `Class ${c.classId}`, value: c.classId })) 
            : [], 
    [classesData]);
    
    const sectionItems = useMemo(() => 
        Array.isArray(sectionsData) 
            ? sectionsData.map(s => ({ label: s.sectionName || `Section ${s.sectionId}`, value: s.sectionId })) 
            : [], 
    [sectionsData]);

    // Reset section when class changes
    useEffect(() => {
        if (classId) {
            setSectionId(null);
            setErrors(prev => ({ ...prev, section: '' }));
        }
    }, [classId]);

    // Calculate total size when media changes
    useEffect(() => {
        const updateTotalSize = async () => {
            if (selectedMedia.length > 0) {
                const size = await calculateTotalSize(selectedMedia);
                setTotalSize(size);
            } else {
                setTotalSize(0);
            }
        };
        updateTotalSize();
    }, [selectedMedia]);

    // Handlers
    const handleClassSelect = useCallback((value) => {
        setClassId(value);
        setErrors(prev => ({ ...prev, classId: '' }));
    }, []);

    const handleSectionSelect = useCallback((value) => {
        setSectionId(value);
        setErrors(prev => ({ ...prev, section: '' }));
    }, []);

    // Process selected media
    const processMediaResponse = useCallback(async (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
            Toast.show({ 
                type: 'error', 
                text1: 'Error', 
                text2: response.errorMessage || 'Failed to pick media',
                position: 'top',
            });
            return;
        }

        if (response.assets) {
            const newMedia = response.assets.filter(asset => {
                if (asset.fileSize > 50 * 1024 * 1024) {
                    Toast.show({
                        type: 'error',
                        text1: 'File too large',
                        text2: `${asset.fileName} exceeds 50MB limit`,
                        position: 'top',
                    });
                    return false;
                }
                return true;
            });

            if (selectedMedia.length + newMedia.length > MAX_FILES) {
                Toast.show({
                    type: 'error',
                    text1: 'Too many files',
                    text2: `Maximum ${MAX_FILES} files allowed`,
                    position: 'top',
                });
                return;
            }

            setIsProcessing(true);
            Toast.show({
                type: 'info',
                text1: 'Processing',
                text2: 'Compressing media files...',
                position: 'top',
                autoHide: false,
            });

            try {
                const processedMedia = await processMediaFiles(newMedia, {
                    compressImages: true,
                    imageQuality: 0.7,
                    maxImageWidth: 1200,
                    maxImageHeight: 1200,
                });

                setSelectedMedia(prev => [...prev, ...processedMedia]);
                
                Toast.hide();
                Toast.show({
                    type: 'success',
                    text1: 'Media Added',
                    text2: `${processedMedia.length} files processed`,
                    position: 'top',
                    visibilityTime: 2000,
                });
            } catch (error) {
                Toast.hide();
                console.error('Media processing error:', error);
                setSelectedMedia(prev => [...prev, ...newMedia]);
                Toast.show({
                    type: 'warning',
                    text1: 'Processing Warning',
                    text2: 'Some files may not be compressed',
                    position: 'top',
                    visibilityTime: 3000,
                });
            } finally {
                setIsProcessing(false);
            }
        }
    }, [selectedMedia.length]);

    // Pick media options with permission checks
    const handleTakePhoto = useCallback(async () => {
        const hasPermission = await checkAndRequestPermission(getCameraPermission(), 'Camera');
        if (!hasPermission) return;

        launchCamera({
            mediaType: 'photo',
            quality: 0.8,
            maxWidth: 1920,
            maxHeight: 1920,
        }, (response) => processMediaResponse(response));
    }, [processMediaResponse]);

    const handleRecordVideo = useCallback(async () => {
        const hasPermission = await checkAndRequestPermission(getCameraPermission(), 'Camera');
        if (!hasPermission) return;

        // Also check microphone permission for video recording
        const micPermission = Platform.select({
            ios: PERMISSIONS.IOS.MICROPHONE,
            android: PERMISSIONS.ANDROID.RECORD_AUDIO,
        });
        if (micPermission) {
            const hasMicPermission = await checkAndRequestPermission(micPermission, 'Microphone');
            if (!hasMicPermission) return;
        }

        launchCamera({
            mediaType: 'video',
            videoQuality: 'high',
            durationLimit: 300,
        }, (response) => processMediaResponse(response));
    }, [processMediaResponse]);

    const handleChooseFromGallery = useCallback(async () => {
        const galleryPermission = getGalleryPermission();
        const hasPermission = await checkAndRequestPermission(galleryPermission, 'Gallery');
        if (!hasPermission) return;

        launchImageLibrary({
            mediaType: 'mixed',
            selectionLimit: MAX_FILES - selectedMedia.length,
            quality: 0.8,
            maxWidth: 1920,
            maxHeight: 1920,
        }, (response) => processMediaResponse(response));
    }, [selectedMedia.length, processMediaResponse]);

    const handlePickMedia = useCallback(() => {
        Alert.alert(
            'Add Media',
            'Choose an option',
            [
                { text: 'Take Photo', onPress: () => handleTakePhoto() },
                { text: 'Record Video', onPress: () => handleRecordVideo() },
                { text: 'Choose from Gallery', onPress: () => handleChooseFromGallery() },
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    }, [handleTakePhoto, handleRecordVideo, handleChooseFromGallery]);

    // Remove media
    const handleRemoveMedia = useCallback((index) => {
        setSelectedMedia(prev => prev.filter((_, i) => i !== index));
    }, []);

    // Submit
    const handleSubmit = useCallback(async () => {
        const validationErrors = {};
        if (!title.trim()) validationErrors.title = 'Title is required';
        if (!classId) validationErrors.classId = 'Please select a class';
        if (!sectionId) validationErrors.section = 'Please select a section';
        if (selectedMedia.length === 0) validationErrors.media = 'Please select at least one file';

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            Toast.show({ 
                type: 'error', 
                text1: 'Validation Error', 
                text2: 'Please fill all required fields', 
                position: 'top', 
                visibilityTime: 3000 
            });
            return;
        }

        if (totalSize > MAX_TOTAL_SIZE) {
            Toast.show({
                type: 'error',
                text1: 'Size Limit Exceeded',
                text2: `Total size: ${formatFileSize(totalSize)}. Max allowed: ${formatFileSize(MAX_TOTAL_SIZE)}`,
                position: 'top',
                visibilityTime: 4000,
            });
            return;
        }

        const formData = new FormData();
        formData.append('Title', title.trim());
        formData.append('Description', description.trim() || '');
        formData.append('ClassId', classId);
        formData.append('SectionId', sectionId);
        
        selectedMedia.forEach((media, index) => {
            const fileName = media.fileName || `media_${index}.${media.uri.split('.').pop() || 'jpg'}`;
            const fileType = media.type || (isVideoFile(fileName) ? 'video/mp4' : 'image/jpeg');
            
            formData.append('files', {
                uri: media.uri,
                type: fileType,
                name: fileName,
            });
        });

        try {
            await createAlbum(formData).unwrap();
            Toast.show({ 
                type: 'success', 
                text1: 'Success!', 
                text2: 'Album created successfully', 
                position: 'top', 
                visibilityTime: 3000 
            });
            setTimeout(() => navigation.goBack(), 1500);
        } catch (error) {
            Toast.show({ 
                type: 'error', 
                text1: 'Error', 
                text2: error?.data?.message || 'Failed to create album', 
                position: 'top', 
                visibilityTime: 4000 
            });
        }
    }, [title, description, classId, sectionId, selectedMedia, totalSize, createAlbum, navigation]);

    // Count media types
    const imageCount = useMemo(() => 
        selectedMedia.filter(m => !isVideoFile(m.fileName || m.uri)).length,
    [selectedMedia]);
    
    const videoCount = useMemo(() => 
        selectedMedia.filter(m => isVideoFile(m.fileName || m.uri)).length,
    [selectedMedia]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <LinearGradient colors={theme.gradientPrimary || ['#6366F1', '#8B5CF6']} style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={24} color="#FFF" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Create Gallery Album</Text>
                    <Text style={styles.headerSubtitle}>Share moments with students and parents</Text>
                </View>
            </LinearGradient>

            <ScrollView style={styles.flex} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                
                {/* Album Info Card */}
                <View style={[styles.card, { backgroundColor: theme.card }]}>
                    <View style={styles.cardHeader}>
                        <View style={[styles.cardIcon, { backgroundColor: theme.primary + '15' }]}>
                            <Icon name="information-outline" size={20} color={theme.primary} />
                        </View>
                        <Text style={[styles.cardTitle, { color: theme.text }]}>Album Information</Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.text }]}>Album Title <Text style={{ color: theme.error }}>*</Text></Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: theme.background, borderColor: errors.title ? theme.error : theme.border, color: theme.text }]}
                            placeholder="e.g., Annual Sports Day 2024"
                            placeholderTextColor={theme.textTertiary}
                            value={title} 
                            onChangeText={(t) => { setTitle(t); setErrors(prev => ({ ...prev, title: '' })); }}
                            maxLength={250}
                        />
                        {errors.title ? <Text style={[styles.errorText, { color: theme.error }]}>{errors.title}</Text> : null}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.text }]}>Description</Text>
                        <TextInput
                            style={[styles.input, styles.textArea, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text }]}
                            placeholder="Describe the event or album..."
                            placeholderTextColor={theme.textTertiary}
                            value={description} 
                            onChangeText={setDescription}
                            multiline 
                            numberOfLines={3} 
                            textAlignVertical="top"
                        />
                    </View>
                </View>

                {/* Classification Card */}
                <View style={[styles.card, { backgroundColor: theme.card }]}>
                    <View style={styles.cardHeader}>
                        <View style={[styles.cardIcon, { backgroundColor: theme.success + '15' }]}>
                            <Icon name="folder-multiple-outline" size={20} color={theme.success} />
                        </View>
                        <Text style={[styles.cardTitle, { color: theme.text }]}>Classification</Text>
                    </View>

                    <SimpleDropdown
                        label="Class"
                        placeholder="Select Class"
                        items={classItems}
                        value={classId}
                        onSelect={handleClassSelect}
                        loading={classesLoading}
                        theme={theme}
                    />
                    {errors.classId ? <Text style={[styles.errorText, { color: theme.error }]}>{errors.classId}</Text> : null}

                    <SimpleDropdown
                        label="Section"
                        placeholder="Select Section"
                        items={sectionItems}
                        value={sectionId}
                        onSelect={handleSectionSelect}
                        loading={sectionsLoading}
                        disabled={!classId}
                        theme={theme}
                    />
                    {errors.section ? <Text style={[styles.errorText, { color: theme.error }]}>{errors.section}</Text> : null}
                </View>

                {/* Media Upload Card */}
                <View style={[styles.card, { backgroundColor: theme.card }]}>
                    <View style={styles.cardHeader}>
                        <View style={[styles.cardIcon, { backgroundColor: theme.warning + '15' }]}>
                            <Icon name="image-multiple" size={20} color={theme.warning} />
                        </View>
                        <Text style={[styles.cardTitle, { color: theme.text }]}>
                            Photos & Videos <Text style={{ color: theme.error }}>*</Text>
                        </Text>
                    </View>

                    {/* Media Stats */}
                    {selectedMedia.length > 0 && (
                        <View style={styles.mediaStats}>
                            <View style={[styles.statBadge, { backgroundColor: theme.primary + '15' }]}>
                                <Icon name="image" size={14} color={theme.primary} />
                                <Text style={[styles.statText, { color: theme.primary }]}>{imageCount} Photos</Text>
                            </View>
                            {videoCount > 0 && (
                                <View style={[styles.statBadge, { backgroundColor: theme.error + '15' }]}>
                                    <Icon name="video" size={14} color={theme.error} />
                                    <Text style={[styles.statText, { color: theme.error }]}>{videoCount} Videos</Text>
                                </View>
                            )}
                            <View style={[styles.statBadge, { backgroundColor: theme.success + '15' }]}>
                                <Icon name="harddisk" size={14} color={theme.success} />
                                <Text style={[styles.statText, { color: theme.success }]}>{formatFileSize(totalSize)}</Text>
                            </View>
                        </View>
                    )}

                    {/* Processing Indicator */}
                    {isProcessing && (
                        <View style={styles.processingContainer}>
                            <ActivityIndicator size="small" color={theme.primary} />
                            <Text style={[styles.processingText, { color: theme.textSecondary }]}>
                                Compressing media files...
                            </Text>
                        </View>
                    )}

                    {/* Selected Media Grid */}
                    {selectedMedia.length > 0 && (
                        <View style={styles.mediaGrid}>
                            {selectedMedia.map((media, index) => {
                                const isVideo = isVideoFile(media.fileName || media.uri);
                                return (
                                    <View key={index} style={styles.mediaItem}>
                                        {isVideo ? (
                                            <View style={[styles.videoPreview, { backgroundColor: theme.background }]}>
                                                <Icon name="play-circle" size={30} color={theme.error} />
                                            </View>
                                        ) : (
                                            <Image source={{ uri: media.uri }} style={styles.mediaPreview} resizeMode="cover" />
                                        )}
                                        <TouchableOpacity
                                            style={styles.removeMediaBtn}
                                            onPress={() => handleRemoveMedia(index)}
                                        >
                                            <Icon name="close-circle" size={22} color={theme.error} />
                                        </TouchableOpacity>
                                        {isVideo && (
                                            <View style={styles.videoBadge}>
                                                <Icon name="video" size={10} color="#FFF" />
                                            </View>
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                    )}

                    {/* Add Media Button */}
                    <TouchableOpacity
                        style={[styles.addMediaBtn, { borderColor: theme.primary, backgroundColor: theme.primary + '08' }]}
                        onPress={handlePickMedia}
                        activeOpacity={0.7}
                        disabled={isProcessing}
                    >
                        <Icon name="image-plus" size={24} color={theme.primary} />
                        <Text style={[styles.addMediaText, { color: theme.primary }]}>
                            {selectedMedia.length > 0 ? 'Add More' : 'Add Photos & Videos'}
                        </Text>
                    </TouchableOpacity>

                    {errors.media ? <Text style={[styles.errorText, { color: theme.error, marginTop: 8 }]}>{errors.media}</Text> : null}
                    
                    <Text style={[styles.helpText, { color: theme.textTertiary }]}>
                        Supported: Images (JPG, PNG, HEIC) & Videos (MP4, MOV){'\n'}
                        Max 50 files • Max 100MB total
                    </Text>
                </View>

                {/* Submit Button */}
                <TouchableOpacity 
                    style={styles.submitContainer} 
                    onPress={handleSubmit} 
                    disabled={isCreating || isProcessing} 
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={isCreating || isProcessing ? ['#94A3B8', '#94A3B8'] : theme.gradientPrimary || ['#6366F1', '#8B5CF6']}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        style={styles.submitButton}
                    >
                        {isCreating || isProcessing ? (
                            <View style={styles.submitContent}>
                                <ActivityIndicator size="small" color="#FFF" />
                                <Text style={styles.submitText}>
                                    {isProcessing ? 'Processing...' : 'Creating Album...'}
                                </Text>
                            </View>
                        ) : (
                            <View style={styles.submitContent}>
                                <Icon name="check-circle" size={22} color="#FFF" />
                                <Text style={styles.submitText}>Create Album</Text>
                            </View>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
                <View style={{ height: 30 }} />
            </ScrollView>
            <Toast />
        </SafeAreaView>
    );
};

// ==================== STYLES ====================
const dropdownStyles = StyleSheet.create({
    button: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        borderWidth: 1.5, 
        borderRadius: 12, 
        paddingHorizontal: 14, 
        height: 48 
    },
    buttonText: { flex: 1, fontSize: 14 },
    modal: { flex: 1 },
    modalHeader: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingHorizontal: 16, 
        paddingVertical: 14, 
        borderBottomWidth: 1 
    },
    closeBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    modalTitle: { fontSize: 18, fontWeight: '700' },
    searchBox: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        margin: 16, 
        paddingHorizontal: 14, 
        borderRadius: 12, 
        borderWidth: 1.5, 
        height: 48 
    },
    searchInput: { flex: 1, fontSize: 15 },
    list: { paddingHorizontal: 16, paddingBottom: 40 },
    item: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingVertical: 14, 
        paddingHorizontal: 16, 
        borderRadius: 12, 
        marginVertical: 2 
    },
    itemText: { fontSize: 15 },
    loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    empty: { alignItems: 'center', paddingVertical: 60 },
    emptyText: { fontSize: 15, marginTop: 12 },
});

const styles = StyleSheet.create({
    container: { flex: 1 },
    flex: { flex: 1 },
    header: { 
        paddingHorizontal: 20, 
        paddingTop: Platform.OS === 'ios' ? 10 : 15, 
        paddingBottom: 22, 
        borderBottomLeftRadius: 25, 
        borderBottomRightRadius: 25 
    },
    backButton: { 
        width: 38, height: 38, borderRadius: 19, 
        backgroundColor: 'rgba(255,255,255,0.2)', 
        justifyContent: 'center', alignItems: 'center', 
        marginBottom: 12 
    },
    headerContent: { paddingLeft: 4 },
    headerTitle: { fontSize: 22, fontWeight: '800', color: '#FFF' },
    headerSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 3 },
    scrollContent: { padding: 14, paddingTop: 16 },
    
    card: { 
        borderRadius: 18, padding: 18, marginBottom: 16, 
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 
    },
    cardHeader: { 
        flexDirection: 'row', alignItems: 'center', 
        marginBottom: 18, paddingBottom: 14, 
        borderBottomWidth: 1, borderBottomColor: '#E2E8F0' 
    },
    cardIcon: { 
        width: 34, height: 34, borderRadius: 10, 
        justifyContent: 'center', alignItems: 'center', marginRight: 10 
    },
    cardTitle: { fontSize: 16, fontWeight: '700' },
    
    inputGroup: { marginBottom: 16 },
    label: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
    input: { borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, height: 48, fontSize: 14 },
    textArea: { minHeight: 80, paddingTop: 12 },
    errorText: { fontSize: 12, marginTop: 4, fontWeight: '500' },
    
    mediaStats: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
    statBadge: { 
        flexDirection: 'row', alignItems: 'center', 
        paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, gap: 4 
    },
    statText: { fontSize: 11, fontWeight: '600' },
    processingContainer: { 
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', 
        padding: 12, marginBottom: 12, borderRadius: 10, gap: 8 
    },
    processingText: { fontSize: 13 },
    mediaGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -3, marginBottom: 12 },
    mediaItem: { 
        width: (screenWidth - 60) / 3, 
        height: (screenWidth - 60) / 3, 
        margin: 3, borderRadius: 10, overflow: 'hidden' 
    },
    mediaPreview: { width: '100%', height: '100%' },
    videoPreview: { 
        width: '100%', height: '100%', 
        justifyContent: 'center', alignItems: 'center' 
    },
    removeMediaBtn: { 
        position: 'absolute', top: 3, right: 3, 
        backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 11 
    },
    videoBadge: { 
        position: 'absolute', bottom: 4, left: 4, 
        backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 8, 
        paddingHorizontal: 5, paddingVertical: 2 
    },
    addMediaBtn: { 
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', 
        paddingVertical: 16, borderRadius: 14, borderWidth: 2, 
        borderStyle: 'dashed', gap: 8 
    },
    addMediaText: { fontSize: 15, fontWeight: '600' },
    helpText: { fontSize: 11, marginTop: 12, textAlign: 'center', lineHeight: 18 },
    
    submitContainer: { marginTop: 8 },
    submitButton: { 
        height: 54, borderRadius: 14, 
        justifyContent: 'center', alignItems: 'center' 
    },
    submitContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    submitText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});

export default CreateAlbumScreen;