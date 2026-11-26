
// src/screens/Teacher/Lectures/CreateLectureScreen.js
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
    Switch, ActivityIndicator, Platform, SafeAreaView, Dimensions, Modal, FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import YoutubeIframe from 'react-native-youtube-iframe';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { selectThemeData } from '../../../store/slices/themeSlice';
import {
    useGetLectureClassesQuery,
    useGetLectureSectionsQuery,
    useGetLectureSubjectsQuery,
    useGetLectureBooksQuery,
    useGetLectureChaptersQuery,
    useGetLectureTopicsQuery,
    useCreateLectureMutation,
} from '../../../store/lectureApi';
import { validateLectureForm, extractVideoId } from '../../../utils/lectureValidation';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// ==================== CUSTOM DROPDOWN COMPONENT ====================
const CustomDropdown = React.memo(({ 
    label, required, placeholder, items, value, onSelect, 
    loading, disabled, theme, searchPlaceholder 
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
                style={[styles.dropdownItem, isSelected && { backgroundColor: theme.primary + '12' }]}
                onPress={() => handleSelect(item)}
                activeOpacity={0.6}
            >
                <Text style={[styles.dropdownItemText, { color: isSelected ? theme.primary : theme.text }]}>
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
                    {label} {required && <Text style={{ color: theme.error }}>*</Text>}
                </Text>
            )}
            <TouchableOpacity
                style={[styles.dropdownButton, { 
                    backgroundColor: disabled ? theme.background : theme.background,
                    borderColor: theme.border,
                    opacity: disabled ? 0.5 : 1,
                }]}
                onPress={() => !disabled && setVisible(true)}
                activeOpacity={0.7}
                disabled={disabled}
            >
                <Text style={[styles.dropdownButtonText, { 
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
                <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.background }]}>
                    {/* Modal Header */}
                    <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
                        <TouchableOpacity onPress={() => { setVisible(false); setSearch(''); }} style={styles.modalCloseBtn}>
                            <Icon name="close" size={24} color={theme.text} />
                        </TouchableOpacity>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>{placeholder}</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    {/* Search Bar */}
                    <View style={[styles.searchContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <Icon name="magnify" size={20} color={theme.textTertiary} style={{ marginRight: 10 }} />
                        <TextInput
                            style={[styles.searchInput, { color: theme.text }]}
                            placeholder={searchPlaceholder || 'Search...'}
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

                    {/* List */}
                    {loading ? (
                        <View style={styles.modalLoading}>
                            <ActivityIndicator size="large" color={theme.primary} />
                        </View>
                    ) : (
                        <FlatList
                            data={filteredItems}
                            renderItem={renderItem}
                            keyExtractor={item => String(item.value)}
                            contentContainerStyle={styles.modalList}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                            ListEmptyComponent={() => (
                                <View style={styles.modalEmpty}>
                                    <Icon name="alert-circle-outline" size={50} color={theme.textTertiary} />
                                    <Text style={[styles.modalEmptyText, { color: theme.textTertiary }]}>
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

// ==================== SECTION CHIP ====================
const SectionChip = React.memo(({ label, value, isSelected, onToggle, theme }) => (
    <TouchableOpacity
        style={[styles.chip, { backgroundColor: isSelected ? theme.primary + '15' : theme.cardHover, borderColor: isSelected ? theme.primary : theme.border }]}
        onPress={() => onToggle(value)} activeOpacity={0.7}
    >
        <Icon name={isSelected ? 'check-circle' : 'circle-outline'} size={16} color={isSelected ? theme.primary : theme.textTertiary} />
        <Text style={[styles.chipText, { color: isSelected ? theme.primary : theme.textSecondary, fontWeight: isSelected ? '600' : '400' }]}>{label}</Text>
    </TouchableOpacity>
));

// ==================== MAIN SCREEN ====================
const CreateLectureScreen = ({ navigation }) => {
    const theme = useSelector(selectThemeData);

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [classId, setClassId] = useState(null);
    const [sectionIds, setSectionIds] = useState([]);
    const [subjectId, setSubjectId] = useState(null);
    const [bookId, setBookId] = useState(null);
    const [chapterId, setChapterId] = useState(null);
    const [topicId, setTopicId] = useState(null);
    const [tags, setTags] = useState('');
    const [isFree, setIsFree] = useState(true);
    const [isPublished, setIsPublished] = useState(true);
    const [showPreview, setShowPreview] = useState(false);
    const [previewVideoId, setPreviewVideoId] = useState(null);

    // API Queries
    const { data: classesData = [], isLoading: classesLoading } = useGetLectureClassesQuery();
    const { data: sectionsData = [], isLoading: sectionsLoading } = useGetLectureSectionsQuery(classId, { skip: !classId });
    const { data: subjectsData = [], isLoading: subjectsLoading } = useGetLectureSubjectsQuery(classId, { skip: !classId });
    const { data: booksData = [], isLoading: booksLoading } = useGetLectureBooksQuery({ classId, subjectId }, { skip: !classId || !subjectId });
    const { data: chaptersData = [], isLoading: chaptersLoading } = useGetLectureChaptersQuery({ classId, subjectId, bookId }, { skip: !classId || !subjectId || !bookId });
    const { data: topicsData = [], isLoading: topicsLoading } = useGetLectureTopicsQuery({ classId, subjectId, bookId, chapterId }, { skip: !classId || !subjectId || !bookId || !chapterId });
    const [createLecture, { isLoading: isCreating }] = useCreateLectureMutation();
console.log('Fetched Data:', {  topicsData });
    // Transform data
    const classItems = useMemo(() => Array.isArray(classesData) ? classesData.map(c => ({ label: c.className || 'Unknown', value: c.classId })) : [], [classesData]);
    const sectionItems = useMemo(() => Array.isArray(sectionsData) ? sectionsData.map(s => ({ label: s.sectionName || 'Unknown', value: s.sectionId })) : [], [sectionsData]);
    const subjectItems = useMemo(() => Array.isArray(subjectsData) ? subjectsData.map(s => ({ label: s.name || 'Unknown', value: s.id })) : [], [subjectsData]);
    const bookItems = useMemo(() => Array.isArray(booksData) ? booksData.map(b => ({ label: b.bookName || b.name || 'Unknown', value: b.bookId || b.id })) : [], [booksData]);
    const chapterItems = useMemo(() => Array.isArray(chaptersData) ? chaptersData.map(c => ({ label: c.chapterName || c.name || 'Unknown', value: c.chapterId || c.id })) : [], [chaptersData]);
    const topicItems = useMemo(() => Array.isArray(topicsData) ? topicsData.map(t => ({ label: t.topicName || t.name || 'Unknown', value: t.topicId || t.id })) : [], [topicsData]);

    // Auto-select all sections
    const previousClassRef = useRef(null);
    useEffect(() => {
        if (classId && classId !== previousClassRef.current && sectionItems.length > 0) {
            setSectionIds(sectionItems.map(i => i.value));
            previousClassRef.current = classId;
        }
    }, [classId, sectionItems]);

    // Handlers
    const handleClassSelect = useCallback((value) => {
        setClassId(value);
        setSubjectId(null);
        setBookId(null);
        setChapterId(null);
        setTopicId(null);
        setSectionIds([]);
    }, []);

    const handleSubjectSelect = useCallback((value) => {
        setSubjectId(value);
        setBookId(null);
        setChapterId(null);
        setTopicId(null);
    }, []);

    const handleBookSelect = useCallback((value) => {
        setBookId(value);
        setChapterId(null);
        setTopicId(null);
    }, []);

    const handleChapterSelect = useCallback((value) => {
        setChapterId(value);
        setTopicId(null);
    }, []);

    const handleUrlChange = useCallback((text) => {
        setYoutubeUrl(text);
        const videoId = extractVideoId(text);
        if (videoId) { setPreviewVideoId(videoId); setShowPreview(true); }
        else { setShowPreview(false); setPreviewVideoId(null); }
    }, []);

    const handleSectionToggle = useCallback((id) => {
        setSectionIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    }, []);

    const handleSelectAll = useCallback(() => setSectionIds(sectionItems.map(i => i.value)), [sectionItems]);
    const handleClearAll = useCallback(() => setSectionIds([]), []);
   
    const handleSubmit = useCallback(async () => {
        const formData = { title, description, youtubeUrl, classId, sectionIds, subjectId, bookId, chapterId, topicId, tags, isFree, isPublished };
        console.log('Submitting Form Data:', formData);
        const { isValid, errors: validationErrors } = validateLectureForm(formData);
        console.log('Validation Result:', { isValid, validationErrors });
        if (!isValid) { Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Please fill all required fields', position: 'top', visibilityTime: 3000 }); return; }
        try {
            const result = await createLecture(formData).unwrap();
            console.log('Lecture Created:', result);
            Toast.show({ type: 'success', text1: 'Success!', text2: result.message || 'Lecture created', position: 'top', visibilityTime: 3000 });
            setTimeout(() => navigation.goBack(), 1500);
        } catch (error) { console.log('Error Creating Lecture:', error); Toast.show({ type: 'error', text1: 'Error', text2: error?.data?.message || 'Failed', position: 'top', visibilityTime: 4000 }); }
    }, [title, description, youtubeUrl, classId, sectionIds, subjectId, bookId, chapterId, topicId, tags, isFree, isPublished, createLecture, navigation]);

    const canSubmit = useMemo(() => !!classId && sectionIds.length > 0 && !!subjectId && !!title.trim() && !!youtubeUrl.trim() && !!extractVideoId(youtubeUrl), [classId, sectionIds, subjectId, title, youtubeUrl]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <LinearGradient colors={theme.gradientPrimary || ['#6366F1', '#8B5CF6']} style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}><Icon name="arrow-left" size={24} color="#FFF" /></TouchableOpacity>
                <View style={styles.headerContent}><Text style={styles.headerTitle}>Create Video Lecture</Text><Text style={styles.headerSubtitle}>Fill all required fields to publish</Text></View>
            </LinearGradient>

            <ScrollView style={styles.flex} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" nestedScrollEnabled>
                {showPreview && previewVideoId ? <View style={[styles.previewCard, { backgroundColor: theme.card }]}><YoutubeIframe height={190} width={screenWidth - 40} videoId={previewVideoId} play={false} /></View> : null}

                {/* Classification */}
                <View style={[styles.sectionCard, { backgroundColor: theme.card }]}>
                    <View style={styles.sectionHeader}><View style={[styles.sectionIcon, { backgroundColor: theme.primary + '12' }]}><Icon name="folder-multiple-outline" size={18} color={theme.primary} /></View><Text style={[styles.sectionTitle, { color: theme.text }]}>Classification</Text></View>

                    <CustomDropdown label="Class" required placeholder="Select Class" items={classItems} value={classId} onSelect={handleClassSelect} loading={classesLoading} theme={theme} searchPlaceholder="Search class..." />
                    
                    {classId && sectionItems.length > 0 ? (
                        <View style={styles.inputGroup}>
                            <View style={styles.sectionLabelRow}>
                                <Text style={[styles.label, { color: theme.text }]}>Sections <Text style={{ color: theme.error }}>*</Text></Text>
                                <View style={styles.sectionActions}>
                                    <TouchableOpacity onPress={handleSelectAll} style={styles.sectionActionBtn}><Text style={[styles.sectionActionText, { color: theme.primary }]}>All</Text></TouchableOpacity>
                                    <TouchableOpacity onPress={handleClearAll} style={styles.sectionActionBtn}><Text style={[styles.sectionActionText, { color: theme.error }]}>Clear</Text></TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.chipsGrid}>
                                {sectionItems.map(s => <SectionChip key={s.value} label={s.label} value={s.value} isSelected={sectionIds.includes(s.value)} onToggle={handleSectionToggle} theme={theme} />)}
                            </View>
                            <Text style={[styles.selectedHint, { color: theme.textTertiary }]}>{sectionIds.length} of {sectionItems.length} selected</Text>
                        </View>
                    ) : null}

                    <CustomDropdown label="Subject" required placeholder="Select Subject" items={subjectItems} value={subjectId} onSelect={handleSubjectSelect} loading={subjectsLoading} disabled={!classId} theme={theme} searchPlaceholder="Search subject..." />
                    <CustomDropdown label="Book" placeholder="Select Book (Optional)" items={bookItems} value={bookId} onSelect={handleBookSelect} loading={booksLoading} disabled={!subjectId} theme={theme} searchPlaceholder="Search book..." />
                    <CustomDropdown label="Chapter" placeholder="Select Chapter (Optional)" items={chapterItems} value={chapterId} onSelect={handleChapterSelect} loading={chaptersLoading} disabled={!bookId} theme={theme} searchPlaceholder="Search chapter..." />
                    <CustomDropdown label="Topic" placeholder="Select Topic (Optional)" items={topicItems} value={topicId} onSelect={setTopicId} loading={topicsLoading} disabled={!chapterId} theme={theme} searchPlaceholder="Search topic..." />
                </View>

                {/* Details */}
                <View style={[styles.sectionCard, { backgroundColor: theme.card }]}>
                    <View style={styles.sectionHeader}><View style={[styles.sectionIcon, { backgroundColor: theme.success + '12' }]}><Icon name="video-plus" size={18} color={theme.success} /></View><Text style={[styles.sectionTitle, { color: theme.text }]}>Lecture Details</Text></View>
                    <View style={styles.inputGroup}><Text style={[styles.label, { color: theme.text }]}>Lecture Title <Text style={{ color: theme.error }}>*</Text></Text><TextInput style={[styles.input, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text }]} placeholder="e.g., Introduction to Algebra" placeholderTextColor={theme.textTertiary} value={title} onChangeText={setTitle} maxLength={250} /></View>
                    <View style={styles.inputGroup}><Text style={[styles.label, { color: theme.text }]}>YouTube URL <Text style={{ color: theme.error }}>*</Text></Text><View style={[styles.urlInputContainer, { backgroundColor: theme.background, borderColor: theme.border }]}><View style={styles.urlIconBox}><Icon name="youtube" size={18} color="#FF0000" /></View><TextInput style={[styles.urlInput, { color: theme.text }]} placeholder="https://youtube.com/watch?v=..." placeholderTextColor={theme.textTertiary} value={youtubeUrl} onChangeText={handleUrlChange} keyboardType="url" autoCapitalize="none" autoCorrect={false} />{youtubeUrl.length > 0 && <TouchableOpacity onPress={() => { setYoutubeUrl(''); setShowPreview(false); }} style={styles.clearBtn}><Icon name="close-circle" size={18} color={theme.textTertiary} /></TouchableOpacity>}</View>{showPreview && <Text style={[styles.validUrlText, { color: theme.success }]}>✓ Valid YouTube URL</Text>}</View>
                    <View style={styles.inputGroup}><Text style={[styles.label, { color: theme.text }]}>Description</Text><TextInput style={[styles.input, styles.textArea, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text }]} placeholder="Describe what students will learn..." placeholderTextColor={theme.textTertiary} value={description} onChangeText={setDescription} multiline numberOfLines={3} textAlignVertical="top" /></View>
                    <View style={styles.inputGroup}><Text style={[styles.label, { color: theme.text }]}>Tags</Text><View style={[styles.tagsInputContainer, { backgroundColor: theme.background, borderColor: theme.border }]}><Icon name="tag-outline" size={16} color={theme.textTertiary} style={{ marginRight: 8 }} /><TextInput style={[styles.tagsInput, { color: theme.text }]} placeholder="math, algebra, basics" placeholderTextColor={theme.textTertiary} value={tags} onChangeText={setTags} /></View></View>
                    <View style={[styles.switchRow, { borderBottomColor: theme.border + '80' }]}><View style={styles.switchInfo}><Icon name={isFree ? 'lock-open-outline' : 'lock-outline'} size={18} color={isFree ? theme.success : theme.textTertiary} /><Text style={[styles.switchLabel, { color: theme.text }]}>Free Content</Text></View><Switch value={isFree} onValueChange={setIsFree} trackColor={{ false: theme.border, true: theme.success + '60' }} thumbColor={isFree ? theme.success : '#f4f3f4'} /></View>
                    <View style={styles.switchRow}><View style={styles.switchInfo}><Icon name="earth" size={18} color={isPublished ? theme.primary : theme.textTertiary} /><Text style={[styles.switchLabel, { color: theme.text }]}>Publish Immediately</Text></View><Switch value={isPublished} onValueChange={setIsPublished} trackColor={{ false: theme.border, true: theme.primary + '60' }} thumbColor={isPublished ? theme.primary : '#f4f3f4'} /></View>
                </View>

                <TouchableOpacity style={styles.submitContainer} onPress={handleSubmit} disabled={isCreating || !canSubmit} activeOpacity={0.8}>
                    <LinearGradient colors={!canSubmit || isCreating ? ['#94A3B8', '#94A3B8'] : theme.gradientPrimary || ['#6366F1', '#8B5CF6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.submitButton, { shadowColor: canSubmit && !isCreating ? theme.primary : '#94A3B8' }]}>
                        {isCreating ? <View style={styles.submitContent}><ActivityIndicator size="small" color="#FFF" /><Text style={styles.submitText}>Creating...</Text></View> : <View style={styles.submitContent}><Icon name="video-plus" size={22} color="#FFF" /><Text style={styles.submitText}>Create Lecture</Text></View>}
                    </LinearGradient>
                </TouchableOpacity>
                <View style={{ height: 30 }} />
            </ScrollView>
            <Toast />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    flex: { flex: 1 },
    header: { paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 10 : 15, paddingBottom: 22, borderBottomLeftRadius: 25, borderBottomRightRadius: 25 },
    backButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    headerContent: { paddingLeft: 4 },
    headerTitle: { fontSize: 22, fontWeight: '800', color: '#FFF' },
    headerSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 3 },
    scrollContent: { padding: 14, paddingTop: 16 },
    previewCard: { borderRadius: 16, overflow: 'hidden', marginBottom: 16 },
    sectionCard: { borderRadius: 18, padding: 18, marginBottom: 16 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 18, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
    sectionIcon: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
    sectionTitle: { fontSize: 16, fontWeight: '700' },
    inputGroup: { marginBottom: 16 },
    label: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
    input: { borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, height: 48, fontSize: 14 },
    textArea: { minHeight: 80, paddingTop: 12 },
    urlInputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 12, paddingLeft: 10, paddingRight: 8, height: 48 },
    urlIconBox: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#FF000012', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
    urlInput: { flex: 1, fontSize: 14 },
    clearBtn: { padding: 4 },
    validUrlText: { fontSize: 11, fontWeight: '500', marginTop: 4 },
    tagsInputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, height: 48 },
    tagsInput: { flex: 1, fontSize: 14 },
    // Custom Dropdown Styles
    dropdownButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, height: 48 },
    dropdownButtonText: { flex: 1, fontSize: 14 },
    // Modal Styles
    modalContainer: { flex: 1 },
    modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1 },
    modalCloseBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    modalTitle: { fontSize: 18, fontWeight: '700' },
    searchContainer: { flexDirection: 'row', alignItems: 'center', margin: 16, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1.5, height: 48 },
    searchInput: { flex: 1, fontSize: 15 },
    modalList: { paddingHorizontal: 16, paddingBottom: 40 },
    dropdownItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, marginVertical: 2 },
    dropdownItemText: { fontSize: 15 },
    modalLoading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    modalEmpty: { alignItems: 'center', paddingVertical: 60 },
    modalEmptyText: { fontSize: 15, marginTop: 12 },
    // Section Chips
    sectionLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    sectionActions: { flexDirection: 'row', gap: 12 },
    sectionActionBtn: { paddingHorizontal: 8, paddingVertical: 2 },
    sectionActionText: { fontSize: 12, fontWeight: '600' },
    chipsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4 },
    chip: { flexDirection: 'row', alignItems: 'center', margin: 4, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, gap: 6 },
    chipText: { fontSize: 12, fontWeight: '500' },
    selectedHint: { fontSize: 11, marginTop: 6 },
    // Switches
    switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1 },
    switchInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    switchLabel: { fontSize: 14, fontWeight: '500' },
    // Submit
    submitContainer: { marginTop: 8 },
    submitButton: { height: 54, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    submitContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    submitText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});

export default CreateLectureScreen;