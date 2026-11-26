// src/screens/Teacher/Lectures/LectureListScreen.js
import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Image, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import { selectThemeData } from '../../../store/slices/themeSlice';
import { useGetTeacherLecturesQuery } from '../../../store/lectureApi';

const { width: screenWidth } = Dimensions.get('window');

// Memoized Lecture Card
const LectureCard = React.memo(({ item, theme, onPress }) => {
    const thumbnailSource = useMemo(() => {
        if (!item.thumbnailUrl || item.thumbnailUrl === '') return null;
        return { uri: item.thumbnailUrl };
    }, [item.thumbnailUrl]);

    return (
        <TouchableOpacity style={[styles.lectureCard, { backgroundColor: theme.card }]} onPress={() => onPress(item.lectureId)} activeOpacity={0.7}>
            <View style={styles.thumbnailContainer}>
                {thumbnailSource ? (
                    <Image source={thumbnailSource} style={styles.thumbnail} resizeMode="cover" />
                ) : (
                    <View style={[styles.placeholderThumb, { backgroundColor: theme.primary + '10' }]}>
                        <View style={[styles.placeholderIcon, { backgroundColor: theme.primary + '20' }]}>
                            <Icon name="play-circle" size={36} color={theme.primary} />
                        </View>
                    </View>
                )}
                <View style={styles.youtubeBadge}>
                    <Icon name="youtube" size={12} color="#FFF" />
                </View>
            </View>
            <View style={styles.lectureContent}>
                <Text style={[styles.lectureTitle, { color: theme.text }]} numberOfLines={2}>{item.title}</Text>
                <View style={styles.lectureMeta}>
                    <View style={styles.metaItem}><Icon name="school" size={13} color={theme.textTertiary} /><Text style={[styles.metaText, { color: theme.textSecondary }]}>{item.className || 'N/A'}</Text></View>
                    <View style={styles.metaItem}><Icon name="book-open" size={13} color={theme.textTertiary} /><Text style={[styles.metaText, { color: theme.textSecondary }]}>{item.subjectName || 'N/A'}</Text></View>
                </View>
                {item.sections?.length > 0 ? (
                    <View style={styles.sectionsRow}>
                        {item.sections.slice(0, 3).map((s) => (
                            <View key={s.sectionId} style={[styles.sectionBadge, { backgroundColor: theme.primary + '10' }]}>
                                <Text style={[styles.sectionBadgeText, { color: theme.primary }]}>{s.sectionName}</Text>
                            </View>
                        ))}
                        {item.sections.length > 3 ? (
                            <View style={[styles.sectionBadge, { backgroundColor: theme.textTertiary + '15' }]}>
                                <Text style={[styles.sectionBadgeText, { color: theme.textTertiary }]}>+{item.sections.length - 3}</Text>
                            </View>
                        ) : null}
                    </View>
                ) : null}
                <View style={styles.lectureFooter}>
                    <View style={styles.footerLeft}>
                        {item.isFree ? <View style={[styles.freeBadge, { backgroundColor: theme.success + '15' }]}><Text style={[styles.freeBadgeText, { color: theme.success }]}>FREE</Text></View> : null}
                        {!item.isPublished ? <View style={[styles.draftBadge, { backgroundColor: theme.warning + '15' }]}><Text style={[styles.draftBadgeText, { color: theme.warning }]}>DRAFT</Text></View> : null}
                    </View>
                    <Text style={[styles.dateText, { color: theme.textTertiary }]}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
});

const LectureListScreen = ({ navigation }) => {
    const theme = useSelector(selectThemeData);
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const { data: lecturesData, isLoading, isFetching, refetch } = useGetTeacherLecturesQuery({ page, limit: 20 });
    const lectures = lecturesData?.lectures || [];
    const totalPages = lecturesData?.totalPages || 1;

    const onRefresh = useCallback(async () => { setRefreshing(true); setPage(1); await refetch(); setRefreshing(false); }, [refetch]);
    const loadMore = useCallback(() => { if (page < totalPages && !isFetching) setPage(prev => prev + 1); }, [page, totalPages, isFetching]);
    const handlePress = useCallback((id) => navigation.navigate('LectureDetail', { lectureId: id }), [navigation]);
    const renderItem = useCallback(({ item }) => <LectureCard item={item} theme={theme} onPress={handlePress} />, [theme, handlePress]);
    const keyExtractor = useCallback((item) => String(item.lectureId), []);

    const renderEmpty = useCallback(() => (
        <View style={styles.emptyContainer}>
            <Icon name="video-off" size={70} color={theme.textSecondary} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>No Lectures Yet</Text>
            <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>Create your first video lecture</Text>
            <TouchableOpacity style={[styles.createButton, { backgroundColor: theme.primary }]} onPress={() => navigation.navigate('CreateLecture')}>
                <Icon name="plus" size={20} color="#FFF" /><Text style={styles.createButtonText}>Create Lecture</Text>
            </TouchableOpacity>
        </View>
    ), [theme, navigation]);

    const renderFooter = useCallback(() => {
        if (!isFetching || page === 1) return null;
        return <View style={styles.footerLoader}><ActivityIndicator size="small" color={theme.primary} /></View>;
    }, [isFetching, page, theme.primary]);

    if (isLoading && !refreshing) {
        return <View style={[styles.container, { backgroundColor: theme.background }]}><ActivityIndicator size="large" color={theme.primary} /></View>;
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <LinearGradient colors={theme.gradientPrimary || ['#6366F1', '#8B5CF6']} style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}><Icon name="arrow-left" size={24} color="#FFF" /></TouchableOpacity>
                <Text style={styles.headerTitle}>My Lectures</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CreateLecture')}><Icon name="plus" size={24} color="#FFF" /></TouchableOpacity>
            </LinearGradient>
            <FlatList
                data={lectures} renderItem={renderItem} keyExtractor={keyExtractor}
                contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} tintColor={theme.primary} />}
                onEndReached={loadMore} onEndReachedThreshold={0.3}
                ListEmptyComponent={renderEmpty} ListFooterComponent={renderFooter}
                removeClippedSubviews={true} maxToRenderPerBatch={8} windowSize={8} initialNumToRender={6}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20 },
    backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 20, fontWeight: '700', color: '#FFF' },
    addButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
    listContent: { padding: 16, paddingBottom: 30 },
    lectureCard: { borderRadius: 18, marginBottom: 18, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 4 },
    thumbnailContainer: { position: 'relative' },
    thumbnail: { width: '100%', height: 190 },
    placeholderThumb: { width: '100%', height: 190, justifyContent: 'center', alignItems: 'center' },
    placeholderIcon: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center' },
    youtubeBadge: { position: 'absolute', bottom: 12, right: 12, backgroundColor: '#FF0000', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    lectureContent: { padding: 16 },
    lectureTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10, lineHeight: 22 },
    lectureMeta: { flexDirection: 'row', gap: 16, marginBottom: 10 },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    metaText: { fontSize: 12, fontWeight: '500' },
    sectionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
    sectionBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
    sectionBadgeText: { fontSize: 11, fontWeight: '600' },
    lectureFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    footerLeft: { flexDirection: 'row', gap: 8 },
    freeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 7 },
    freeBadgeText: { fontSize: 10, fontWeight: '700' },
    draftBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 7 },
    draftBadgeText: { fontSize: 10, fontWeight: '700' },
    dateText: { fontSize: 11, fontWeight: '500' },
    emptyContainer: { alignItems: 'center', paddingVertical: 80 },
    emptyTitle: { fontSize: 20, fontWeight: '700', marginTop: 20, marginBottom: 8 },
    emptySubtitle: { fontSize: 14, textAlign: 'center', marginBottom: 24 },
    createButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 13, borderRadius: 25, gap: 8 },
    createButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
    footerLoader: { paddingVertical: 20, alignItems: 'center' },
});

export default LectureListScreen;