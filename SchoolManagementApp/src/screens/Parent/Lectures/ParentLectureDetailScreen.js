// // src/screens/Parent/Lectures/ParentLectureDetailScreen.js
// import React, { useState, useCallback } from 'react';
// import {
//     View, Text, StyleSheet, ScrollView, TouchableOpacity,
//     ActivityIndicator, Dimensions,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import YoutubeIframe from 'react-native-youtube-iframe';
// import { useSelector } from 'react-redux';
// import { selectThemeData } from '../../../store/slices/themeSlice';
// import { useGetLectureByIdQuery } from '../../../store/lectureApi';

// const { width: screenWidth } = Dimensions.get('window');

// const ParentLectureDetailScreen = ({ route, navigation }) => {
//     const theme = useSelector(selectThemeData);
//     const { lectureId, childName } = route.params || {};
//     const [playing, setPlaying] = useState(false);

//     const { data: lecture, isLoading } = useGetLectureByIdQuery(lectureId, {
//         skip: !lectureId,
//     });

//     const handlePlayPause = useCallback(() => {
//         setPlaying(prev => !prev);
//     }, []);

//     if (isLoading) {
//         return (
//             <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
//                 <ActivityIndicator size="large" color={theme.primary} />
//             </View>
//         );
//     }

//     if (!lecture) {
//         return (
//             <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
//                 <Icon name="video-off" size={60} color={theme.textSecondary} />
//                 <Text style={[styles.errorText, { color: theme.text, marginTop: 16, fontSize: 18 }]}>Lecture Not Found</Text>
//                 <TouchableOpacity
//                     style={[styles.backBtn, { backgroundColor: theme.primary, marginTop: 20 }]}
//                     onPress={() => navigation.goBack()}
//                 >
//                     <Text style={{ color: '#FFF', fontWeight: '600' }}>Go Back</Text>
//                 </TouchableOpacity>
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
//                     <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>
//                         {lecture.title}
//                     </Text>
//                 </View>
//                 <View style={{ width: 40 }} />
//             </View>

//             <ScrollView
//                 style={styles.flex}
//                 contentContainerStyle={styles.scrollContent}
//                 showsVerticalScrollIndicator={false}
//             >
//                 {/* Video Player */}
//                 <View style={[styles.videoCard, { backgroundColor: theme.card }]}>
//                     <View style={styles.videoContainer}>
//                         <YoutubeIframe
//                             height={220}
//                             width={screenWidth - 32}
//                             videoId={lecture.youtubeVideoId}
//                             play={playing}
//                             onChangeState={(state) => {
//                                 if (state === 'ended') setPlaying(false);
//                             }}
//                         />
//                     </View>
//                     {!playing && (
//                         <TouchableOpacity
//                             style={styles.playOverlay}
//                             onPress={handlePlayPause}
//                             activeOpacity={0.8}
//                         >
//                             <View style={styles.playButton}>
//                                 <Icon name="play" size={36} color="#FFF" />
//                             </View>
//                         </TouchableOpacity>
//                     )}
//                 </View>

//                 {/* Title & Badges */}
//                 <View style={[styles.card, { backgroundColor: theme.card }]}>
//                     <Text style={[styles.lectureTitle, { color: theme.text }]}>
//                         {lecture.title}
//                     </Text>

//                     <View style={styles.badgesRow}>
//                         {lecture.isFree && (
//                             <View style={[styles.badge, { backgroundColor: theme.success + '15' }]}>
//                                 <Icon name="lock-open-outline" size={12} color={theme.success} />
//                                 <Text style={[styles.badgeText, { color: theme.success }]}>FREE</Text>
//                             </View>
//                         )}
//                         {lecture.tags && (
//                             <View style={[styles.badge, { backgroundColor: theme.info + '15' }]}>
//                                 <Icon name="tag" size={12} color={theme.info} />
//                                 <Text style={[styles.badgeText, { color: theme.info }]}>{lecture.tags}</Text>
//                             </View>
//                         )}
//                     </View>

//                     {lecture.description ? (
//                         <Text style={[styles.description, { color: theme.textSecondary }]}>
//                             {lecture.description}
//                         </Text>
//                     ) : null}
//                 </View>

//                 {/* Details */}
//                 <View style={[styles.card, { backgroundColor: theme.card }]}>
//                     <Text style={[styles.sectionTitle, { color: theme.text }]}>Details</Text>

//                     <View style={styles.detailRow}>
//                         <View style={[styles.detailIcon, { backgroundColor: theme.primary + '12' }]}>
//                             <Icon name="book-open" size={16} color={theme.primary} />
//                         </View>
//                         <View>
//                             <Text style={[styles.detailLabel, { color: theme.textTertiary }]}>Subject</Text>
//                             <Text style={[styles.detailValue, { color: theme.text }]}>
//                                 {lecture.subjectName || 'N/A'}
//                             </Text>
//                         </View>
//                     </View>

//                     <View style={styles.detailRow}>
//                         <View style={[styles.detailIcon, { backgroundColor: theme.success + '12' }]}>
//                             <Icon name="school" size={16} color={theme.success} />
//                         </View>
//                         <View>
//                             <Text style={[styles.detailLabel, { color: theme.textTertiary }]}>Class</Text>
//                             <Text style={[styles.detailValue, { color: theme.text }]}>
//                                 {lecture.className || 'N/A'}
//                             </Text>
//                         </View>
//                     </View>

//                     <View style={styles.detailRow}>
//                         <View style={[styles.detailIcon, { backgroundColor: theme.warning + '12' }]}>
//                             <Icon name="account-tie" size={16} color={theme.warning} />
//                         </View>
//                         <View>
//                             <Text style={[styles.detailLabel, { color: theme.textTertiary }]}>Teacher</Text>
//                             <Text style={[styles.detailValue, { color: theme.text }]}>
//                                 {lecture.teacherName || 'N/A'}
//                             </Text>
//                         </View>
//                     </View>

//                     <View style={styles.detailRow}>
//                         <View style={[styles.detailIcon, { backgroundColor: theme.info + '12' }]}>
//                             <Icon name="calendar" size={16} color={theme.info} />
//                         </View>
//                         <View>
//                             <Text style={[styles.detailLabel, { color: theme.textTertiary }]}>Created</Text>
//                             <Text style={[styles.detailValue, { color: theme.text }]}>
//                                 {lecture.createdAt ? new Date(lecture.createdAt).toLocaleDateString('en-US', {
//                                     year: 'numeric', month: 'short', day: 'numeric',
//                                 }) : 'N/A'}
//                             </Text>
//                         </View>
//                     </View>
//                 </View>

//                 {lecture.sections && lecture.sections.length > 0 && (
//                     <View style={[styles.card, { backgroundColor: theme.card }]}>
//                         <Text style={[styles.sectionTitle, { color: theme.text }]}>
//                             Sections ({lecture.sections.length})
//                         </Text>
//                         <View style={styles.sectionsGrid}>
//                             {lecture.sections.map((s) => (
//                                 <View
//                                     key={s.sectionId}
//                                     style={[styles.sectionChip, { backgroundColor: theme.primary + '10', borderColor: theme.primary + '20' }]}
//                                 >
//                                     <Icon name="account-group" size={14} color={theme.primary} />
//                                     <Text style={[styles.sectionChipText, { color: theme.primary }]}>
//                                         {s.sectionName}
//                                     </Text>
//                                 </View>
//                             ))}
//                         </View>
//                     </View>
//                 )}

//                 <View style={{ height: 30 }} />
//             </ScrollView>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1 },
//     flex: { flex: 1 },
//     header: {
//         flexDirection: 'row', alignItems: 'center',
//         paddingHorizontal: 16, paddingTop: 50, paddingBottom: 15,
//         borderBottomWidth: 1,
//     },
//     headerBackBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
//     headerInfo: { flex: 1, marginLeft: 8 },
//     headerTitle: { fontSize: 18, fontWeight: '700' },
//     scrollContent: { padding: 16 },
//     videoCard: {
//         borderRadius: 16, overflow: 'hidden', marginBottom: 16,
//         shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.08, shadowRadius: 8, elevation: 4,
//     },
//     videoContainer: { borderRadius: 16, overflow: 'hidden' },
//     playOverlay: {
//         position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
//         justifyContent: 'center', alignItems: 'center',
//         backgroundColor: 'rgba(0,0,0,0.3)',
//     },
//     playButton: {
//         width: 65, height: 65, borderRadius: 33,
//         backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center',
//         borderWidth: 3, borderColor: '#FFF',
//     },
//     card: {
//         borderRadius: 16, padding: 16, marginBottom: 16,
//         shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
//     },
//     lectureTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12, lineHeight: 26 },
//     badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
//     badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, gap: 5 },
//     badgeText: { fontSize: 11, fontWeight: '600' },
//     description: { fontSize: 14, lineHeight: 22 },
//     sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 14 },
//     detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 12 },
//     detailIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
//     detailLabel: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2 },
//     detailValue: { fontSize: 14, fontWeight: '500' },
//     sectionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
//     sectionChip: {
//         flexDirection: 'row', alignItems: 'center',
//         paddingHorizontal: 12, paddingVertical: 8,
//         borderRadius: 20, borderWidth: 1, gap: 6,
//     },
//     sectionChipText: { fontSize: 12, fontWeight: '500' },
//     errorText: { textAlign: 'center' },
//     backBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 25 },
// });

// export default ParentLectureDetailScreen;
// src/screens/Parent/Lectures/ParentLectureDetailScreen.js
// src/screens/Parent/Lectures/ParentLectureDetailScreen.js
import React, { useState, useCallback, useMemo } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    ActivityIndicator, Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import YoutubeIframe from 'react-native-youtube-iframe';
import { useSelector } from 'react-redux';
import { selectThemeData } from '../../../store/slices/themeSlice';
import { useGetLectureByIdQuery } from '../../../store/lectureApi';

const { width: screenWidth } = Dimensions.get('window');

const ParentLectureDetailScreen = ({ route, navigation }) => {
    const theme = useSelector(selectThemeData);
    const { lectureId, childName } = route.params || {};
    const [playing, setPlaying] = useState(false);

    const { data: lecture, isLoading } = useGetLectureByIdQuery(lectureId, {
        skip: !lectureId,
    });

    const handlePlayPause = useCallback(() => {
        setPlaying(prev => !prev);
    }, []);

    // YouTube iframe configuration - Maximum privacy, no branding, no suggestions
    // const youtubePlayerConfig = useMemo(() => ({
    //     webViewProps: {
    //         allowsInlineMediaPlayback: true,
    //         // Block all external navigation - prevent opening YouTube app/website
    //         onShouldStartLoadWithRequest: (request) => {
    //             if (request.url && !request.url.includes('youtube.com/embed/')) {
    //                 return false;
    //             }
    //             return true;
    //         },
    //         // Prevent user interaction that could reveal YouTube
    //         javaScriptEnabled: true,
    //         domStorageEnabled: true,
    //         // Hide scroll
    //         scrollEnabled: false,
    //         // Prevent long press context menu
    //         bounces: false,
    //         overScrollMode: 'never',
    //     },
    //     // Hide YouTube logo watermark, controls, and info
    //     webViewStyle: { opacity: 0.99, backgroundColor: '#000000' },
    //     // Force video title/watermark hidden
    //     forceAndroidAutoplay: false,
    //     // Player parameters to hide everything
    //     initialPlayerParams: {
    //         modestbranding: 1,     // Hide YouTube logo
    //         controls: 1,           // Show minimal controls
    //         rel: 0,                // Do not show related videos at end
    //         showinfo: 0,           // Hide video title and info
    //         iv_load_policy: 3,     // Hide annotations
    //         cc_load_policy: 0,     // Hide closed captions by default
    //         fs: 1,                 // Allow fullscreen
    //         playsinline: 1,        // Play inline on iOS
    //         autohide: 1,           // Auto-hide controls
    //         color: 'white',        // White progress bar (less YouTube-like)
    //         hl: 'en',              // Language
    //         enablejsapi: 1,        // Enable JS API
    //         origin: '',            // Remove origin
    //         widgetid: 1,
    //         disablekb: 1,          // Disable keyboard controls
    //         loop: 0,
    //         playlist: '',
    //         // Prevent tracking
    //         host: 'https://www.youtube-nocookie.com',
    //     },
    // }), []);

    const youtubePlayerConfig = useMemo(() => ({
    // Remove webViewProps - this is not supported by the library
    // Player parameters - these are the only supported props
    modestbranding: 1,     // Hide YouTube logo
    controls: 1,           // Show minimal controls
    rel: 0,                // Do not show related videos at end
    showinfo: 0,           // Hide video title and info
    iv_load_policy: 3,     // Hide annotations
    cc_load_policy: 0,     // Hide closed captions by default
    fs: 1,                 // Allow fullscreen
    playsinline: 1,        // Play inline on iOS
    autohide: 1,           // Auto-hide controls
    color: 'white',        // White progress bar (less YouTube-like)
    hl: 'en',              // Language
    enablejsapi: 1,        // Enable JS API
    origin: '',            // Remove origin
    widgetid: 1,
    disablekb: 1,          // Disable keyboard controls
    loop: 0,
    playlist: '',
    host: 'https://www.youtube-nocookie.com',
}), []);

    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    if (!lecture) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
                <Icon name="video-off" size={60} color={theme.textSecondary} />
                <Text style={[styles.errorText, { color: theme.text, marginTop: 16, fontSize: 18 }]}>Lecture Not Found</Text>
                <TouchableOpacity
                    style={[styles.backBtn, { backgroundColor: theme.primary, marginTop: 20 }]}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={{ color: '#FFF', fontWeight: '600' }}>Go Back</Text>
                </TouchableOpacity>
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
                    <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>
                        {lecture.title}
                    </Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                style={styles.flex}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Video Player - Black background, no YouTube branding */}
                <View style={[styles.videoCard, { backgroundColor: '#000000' }]}>
                    <View style={styles.videoContainer}>
                        {/* <YoutubeIframe
                        height={220}
        width={screenWidth - 32}
        videoId={lecture.youtubeVideoId}
        play={playing}
        onChangeState={(state) => {
            if (state === 'ended') setPlaying(false);
        }}
        // Pass the props directly, not wrapped in webViewProps
        modestbranding={1}
        controls={1}
        rel={0}
        showinfo={0}
        iv_load_policy={3}
        cc_load_policy={0}
        fs={1}
        playsinline={1}
        autohide={1}
        color="white"
        hl="en"
        enablejsapi={1}
        origin=""
        widgetid={1}
        disablekb={1}
        loop={0}
        playlist=""
        host="https://www.youtube-nocookie.com"     
        
        
        /> */}

<YoutubeIframe
  height={220}
  width={screenWidth - 32}
  videoId={lecture.youtubeVideoId}
  play={playing}
  onChangeState={(state) => {
    if (state === 'ended') setPlaying(false);
  }}
  initialPlayerParams={{
    modestbranding: 1,
    controls: 0,
    rel: 0,
    showinfo: 0,
    iv_load_policy: 3,
    cc_load_policy: 0,
    playsinline: 1,
    color: 'black',
    autohide: 1,
    disablekb: 1,
    enablejsapi: 1,
    origin: '',
    widgetid: 1,
    host: 'https://www.youtube-nocookie.com',
  }}
/>
                    </View>
                    {/* Custom play button overlay - completely hides YouTube's UI */}
                    {!playing && (
                        <TouchableOpacity
                            style={styles.playOverlay}
                            onPress={handlePlayPause}
                            activeOpacity={0.8}
                        >
                            <View style={styles.playButton}>
                                <Icon name="play" size={36} color="#FFF" />
                            </View>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Title & Badges */}
                <View style={[styles.card, { backgroundColor: theme.card }]}>
                    <Text style={[styles.lectureTitle, { color: theme.text }]}>
                        {lecture.title}
                    </Text>

                    <View style={styles.badgesRow}>
                        {lecture.isFree && (
                            <View style={[styles.badge, { backgroundColor: theme.success + '15' }]}>
                                <Icon name="lock-open-outline" size={12} color={theme.success} />
                                <Text style={[styles.badgeText, { color: theme.success }]}>FREE</Text>
                            </View>
                        )}
                        {lecture.tags && (
                            <View style={[styles.badge, { backgroundColor: theme.info + '15' }]}>
                                <Icon name="tag" size={12} color={theme.info} />
                                <Text style={[styles.badgeText, { color: theme.info }]}>{lecture.tags}</Text>
                            </View>
                        )}
                    </View>

                    {lecture.description ? (
                        <Text style={[styles.description, { color: theme.textSecondary }]}>
                            {lecture.description}
                        </Text>
                    ) : null}
                </View>

                {/* Details */}
                <View style={[styles.card, { backgroundColor: theme.card }]}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Details</Text>

                    <View style={styles.detailRow}>
                        <View style={[styles.detailIcon, { backgroundColor: theme.primary + '12' }]}>
                            <Icon name="book-open" size={16} color={theme.primary} />
                        </View>
                        <View>
                            <Text style={[styles.detailLabel, { color: theme.textTertiary }]}>Subject</Text>
                            <Text style={[styles.detailValue, { color: theme.text }]}>
                                {lecture.subjectName || 'N/A'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.detailRow}>
                        <View style={[styles.detailIcon, { backgroundColor: theme.success + '12' }]}>
                            <Icon name="school" size={16} color={theme.success} />
                        </View>
                        <View>
                            <Text style={[styles.detailLabel, { color: theme.textTertiary }]}>Class</Text>
                            <Text style={[styles.detailValue, { color: theme.text }]}>
                                {lecture.className || 'N/A'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.detailRow}>
                        <View style={[styles.detailIcon, { backgroundColor: theme.warning + '12' }]}>
                            <Icon name="account-tie" size={16} color={theme.warning} />
                        </View>
                        <View>
                            <Text style={[styles.detailLabel, { color: theme.textTertiary }]}>Teacher</Text>
                            <Text style={[styles.detailValue, { color: theme.text }]}>
                                {lecture.teacherName || 'N/A'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.detailRow}>
                        <View style={[styles.detailIcon, { backgroundColor: theme.info + '12' }]}>
                            <Icon name="calendar" size={16} color={theme.info} />
                        </View>
                        <View>
                            <Text style={[styles.detailLabel, { color: theme.textTertiary }]}>Created</Text>
                            <Text style={[styles.detailValue, { color: theme.text }]}>
                                {lecture.createdAt ? new Date(lecture.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric', month: 'short', day: 'numeric',
                                }) : 'N/A'}
                            </Text>
                        </View>
                    </View>
                </View>

                {lecture.sections && lecture.sections.length > 0 && (
                    <View style={[styles.card, { backgroundColor: theme.card }]}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>
                            Sections ({lecture.sections.length})
                        </Text>
                        <View style={styles.sectionsGrid}>
                            {lecture.sections.map((s) => (
                                <View
                                    key={s.sectionId}
                                    style={[styles.sectionChip, { backgroundColor: theme.primary + '10', borderColor: theme.primary + '20' }]}
                                >
                                    <Icon name="account-group" size={14} color={theme.primary} />
                                    <Text style={[styles.sectionChipText, { color: theme.primary }]}>
                                        {s.sectionName}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                <View style={{ height: 30 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    flex: { flex: 1 },
    header: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingTop: 50, paddingBottom: 15,
        borderBottomWidth: 1,
    },
    headerBackBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    headerInfo: { flex: 1, marginLeft: 8 },
    headerTitle: { fontSize: 18, fontWeight: '700' },
    scrollContent: { padding: 16 },
    videoCard: {
        borderRadius: 16, overflow: 'hidden', marginBottom: 16,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08, shadowRadius: 8, elevation: 4,
    },
    videoContainer: { borderRadius: 16, overflow: 'hidden' },
    playOverlay: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    playButton: {
        width: 65, height: 65, borderRadius: 33,
        backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center',
        borderWidth: 3, borderColor: '#FFF',
    },
    card: {
        borderRadius: 16, padding: 16, marginBottom: 16,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
    },
    lectureTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12, lineHeight: 26 },
    badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
    badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, gap: 5 },
    badgeText: { fontSize: 11, fontWeight: '600' },
    description: { fontSize: 14, lineHeight: 22 },
    sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 14 },
    detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 12 },
    detailIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    detailLabel: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2 },
    detailValue: { fontSize: 14, fontWeight: '500' },
    sectionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    sectionChip: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 12, paddingVertical: 8,
        borderRadius: 20, borderWidth: 1, gap: 6,
    },
    sectionChipText: { fontSize: 12, fontWeight: '500' },
    errorText: { textAlign: 'center' },
    backBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 25 },
});

export default ParentLectureDetailScreen;