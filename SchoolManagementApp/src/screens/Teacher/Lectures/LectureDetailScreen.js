// src/screens/Teacher/Lectures/LectureDetailScreen.js
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Share, Linking, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import YoutubeIframe from 'react-native-youtube-iframe';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { selectThemeData } from '../../../store/slices/themeSlice';
import { selectCurrentUser } from '../../../store/slices/authSlice';
import { useGetLectureByIdQuery, useDeleteLectureMutation } from '../../../store/lectureApi';

const { width: screenWidth } = Dimensions.get('window');

const Badge = React.memo(({ icon, text, bg }) => (
    <View style={[styles.badge, { backgroundColor: bg + '15' }]}>
        <Icon name={icon} size={12} color={bg} />
        <Text style={[styles.badgeText, { color: bg }]}>{text}</Text>
    </View>
));

const InfoRow = React.memo(({ icon, label, value, theme, color }) => (
    <View style={styles.infoRow}>
        <View style={[styles.infoIcon, { backgroundColor: (color || theme.primary) + '12' }]}>
            <Icon name={icon} size={16} color={color || theme.primary} />
        </View>
        <View style={styles.infoContent}>
            <Text style={[styles.infoLabel, { color: theme.textTertiary }]}>{label}</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{value || 'N/A'}</Text>
        </View>
    </View>
));

const LectureDetailScreen = ({ route, navigation }) => {
    const theme = useSelector(selectThemeData);
    const currentUser = useSelector(selectCurrentUser);
    const { lectureId } = route.params || {};
    const [playing, setPlaying] = useState(false);

    const { data: lecture, isLoading } = useGetLectureByIdQuery(lectureId, { skip: !lectureId });
    const [deleteLecture, { isLoading: isDeleting }] = useDeleteLectureMutation();

    const handleDelete = useCallback(() => {
        Alert.alert('Delete Lecture', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: async () => {
                try {
                    await deleteLecture(lectureId).unwrap();
                    Toast.show({ type: 'success', text1: 'Deleted', position: 'top', visibilityTime: 2000 });
                    navigation.goBack();
                } catch (e) { Toast.show({ type: 'error', text1: 'Error', position: 'top' }); }
            }},
        ]);
    }, [deleteLecture, lectureId, navigation]);

    if (isLoading) return <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}><ActivityIndicator size="large" color={theme.primary} /></View>;
    if (!lecture) return <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}><Icon name="video-off" size={70} color={theme.textSecondary} /><Text style={{ fontSize: 18, marginTop: 20, color: theme.text }}>Lecture Not Found</Text></View>;

    const isOwner = lecture.teacherId === currentUser?.id;

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <LinearGradient colors={theme.gradientPrimary || ['#6366F1', '#8B5CF6']} style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}><Icon name="arrow-left" size={24} color="#FFF" /></TouchableOpacity>
                    <Text style={styles.headerTitle} numberOfLines={1}>Lecture Details</Text>
                    {isOwner ? (
                        <View style={styles.headerActions}>
                            <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.navigate('CreateLecture', { editMode: true, lectureId: lecture.lectureId, lectureData: lecture })}><Icon name="pencil" size={20} color="#FFF" /></TouchableOpacity>
                            <TouchableOpacity style={styles.headerBtn} onPress={handleDelete} disabled={isDeleting}>{isDeleting ? <ActivityIndicator size="small" color="#FFF" /> : <Icon name="delete" size={20} color="#FFF" />}</TouchableOpacity>
                        </View>
                    ) : <View style={{ width: 80 }} />}
                </View>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={[styles.videoCard, { backgroundColor: theme.card }]}>
                    <YoutubeIframe height={220} width={screenWidth - 32} videoId={lecture.youtubeVideoId} play={playing} onChangeState={(s) => { if (s === 'ended') setPlaying(false); }} />
                    {!playing ? <TouchableOpacity style={styles.playOverlay} onPress={() => setPlaying(true)}><View style={styles.playButton}><Icon name="play" size={40} color="#FFF" /></View></TouchableOpacity> : null}
                </View>

                <View style={[styles.card, { backgroundColor: theme.card }]}>
                    <Text style={[styles.title, { color: theme.text }]}>{lecture.title}</Text>
                    <View style={styles.badgesRow}>
                        {lecture.isFree ? <Badge icon="lock-open-outline" text="FREE" bg={theme.success} /> : null}
                        {lecture.isPublished ? <Badge icon="earth" text="PUBLISHED" bg={theme.primary} /> : <Badge icon="eye-off" text="DRAFT" bg={theme.warning} />}
                        {lecture.tags ? <Badge icon="tag" text={lecture.tags} bg={theme.info} /> : null}
                    </View>
                    {lecture.description ? <Text style={[styles.desc, { color: theme.textSecondary }]}>{lecture.description}</Text> : null}
                </View>

                <View style={[styles.card, { backgroundColor: theme.card }]}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Details</Text>
                    <InfoRow icon="school" label="Class" value={lecture.className} theme={theme} />
                    <InfoRow icon="book-open" label="Subject" value={lecture.subjectName} theme={theme} color={theme.success} />
                    <InfoRow icon="account-tie" label="Teacher" value={lecture.teacherName} theme={theme} color={theme.warning} />
                    <InfoRow icon="calendar" label="Created" value={new Date(lecture.createdAt).toLocaleDateString()} theme={theme} color={theme.info} />
                </View>

                {lecture.sections?.length > 0 ? (
                    <View style={[styles.card, { backgroundColor: theme.card }]}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Sections ({lecture.sections.length})</Text>
                        <View style={styles.sectionsGrid}>
                            {lecture.sections.map(s => (
                                <View key={s.sectionId} style={[styles.sectionChip, { backgroundColor: theme.primary + '10', borderColor: theme.primary + '20' }]}>
                                    <Icon name="account-group" size={14} color={theme.primary} />
                                    <Text style={[styles.sectionChipText, { color: theme.primary }]}>{s.sectionName}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                ) : null}

                {/* Action Buttons - Commented as requested */}
                {/* <View style={styles.actionsRow}>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#FF0000' }]} onPress={() => Linking.openURL(lecture.youtubeUrl)}><Icon name="youtube" size={20} color="#FFF" /><Text style={styles.actionBtnText}>YouTube</Text></TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.success }]} onPress={async () => { try { await Share.share({ message: `${lecture.title}\n\n${lecture.youtubeUrl}` }); } catch (e) {} }}><Icon name="share-variant" size={20} color="#FFF" /><Text style={styles.actionBtnText}>Share</Text></TouchableOpacity>
                </View> */}

                <View style={{ height: 30 }} />
            </ScrollView>
            <Toast />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 16, borderBottomLeftRadius: 25, borderBottomRightRadius: 25 },
    headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    headerBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
    headerTitle: { flex: 1, fontSize: 18, fontWeight: '700', color: '#FFF', textAlign: 'center', marginHorizontal: 8 },
    headerActions: { flexDirection: 'row', gap: 8 },
    scrollContent: { padding: 16 },
    videoCard: { borderRadius: 18, overflow: 'hidden', marginBottom: 18 },
    playOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
    playButton: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#FFF' },
    card: { borderRadius: 18, padding: 18, marginBottom: 18 },
    title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
    badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
    badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, gap: 5 },
    badgeText: { fontSize: 11, fontWeight: '600' },
    desc: { fontSize: 14, lineHeight: 22 },
    sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 14 },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 },
    infoIcon: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    infoContent: { flex: 1 },
    infoLabel: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2 },
    infoValue: { fontSize: 14, fontWeight: '500' },
    sectionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    sectionChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 9, borderRadius: 22, borderWidth: 1, gap: 6 },
    sectionChipText: { fontSize: 13, fontWeight: '500' },
    actionsRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
    actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 14, gap: 8 },
    actionBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
});

export default LectureDetailScreen;