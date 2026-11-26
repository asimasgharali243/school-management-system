
// export default AboutScreen;
import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TouchableOpacity,
    RefreshControl,
    Dimensions,
    StatusBar,
    SafeAreaView,
    ScrollView,
    Image,
    Linking,
    Alert,
    Share,
    Platform,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useGetAboutSettingsQuery } from '../../store/aboutApi';
import { selectThemeData } from '../../store/slices/themeSlice';
import { BASE_URL } from '../../config/constants';

const { width } = Dimensions.get('window');

const HEADER_HEIGHT = 330;

const AboutScreen = ({ navigation }) => {
    const theme = useSelector(selectThemeData);

    const scrollY = useRef(new Animated.Value(0)).current;
    const [refreshing, setRefreshing] = useState(false);
const scrollViewRef = useRef(null);
    const {
        data: aboutData,
        isLoading,
        error,
        refetch,
    } = useGetAboutSettingsQuery();

    console.log('About Data:', aboutData);
    const { content = {}, socialLinks = [] } = aboutData || {};

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    }, [refetch]);


    useEffect(() => {
    // Small delay to ensure content is rendered
    const timer = setTimeout(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    }, 1000);
    
    return () => clearTimeout(timer);
}, [aboutData]);


// Re-run when data loads
    // const handleOpenLink = async (url, platform = '') => {
    //     if (!url) {
    //         Alert.alert('Not Available', `${platform} link is not available`);
    //         return;
    //     }

    //     try {
    //         // Check if URL is valid
    //         const isValidUrl = url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:') || url.startsWith('tel:');
            
    //         if (!isValidUrl && !url.startsWith('https://wa.me/')) {
    //             Alert.alert('Invalid Link', 'The link format is invalid');
    //             return;
    //         }

    //         const supported = await Linking.canOpenURL(url);

    //         if (supported) {
    //             await Linking.openURL(url);
    //         } else {
    //             Alert.alert('Error', `Cannot open ${platform} link. Please check your internet connection.`);
    //         }
    //     } catch (e) {
    //         console.error('Link opening error:', e);
    //         Alert.alert('Error', `Failed to open ${platform} link`);
    //     }
    // };



//     const handleOpenLink = async (url, platform = '') => {
//     if (!url) {
//         Alert.alert('Not Available', `${platform} link is not available`);
//         return;
//     }

//     try {
//         let finalUrl = url;
        
//         // Convert URLs to app-specific schemes
//         switch (platform) {
//             case 'Facebook':
//                 // Extract Facebook page ID or username from URL
//                 const fbMatch = url.match(/facebook\.com\/([^\/?]+)/);
//                 if (fbMatch) {
//                     finalUrl = `fb://profile/${fbMatch[1]}`;
//                 }
//                 break;
                
//             case 'Instagram':
//                 const igMatch = url.match(/instagram\.com\/([^\/?]+)/);
//                 if (igMatch) {
//                     finalUrl = `instagram://user?username=${igMatch[1]}`;
//                 }
//                 break;
                
//             case 'Twitter':
//                 const twitterMatch = url.match(/twitter\.com\/([^\/?]+)/);
//                 if (twitterMatch) {
//                     finalUrl = `twitter://user?screen_name=${twitterMatch[1]}`;
//                 }
//                 break;
                
//             case 'YouTube':
//                 const ytMatch = url.match(/youtube\.com\/(?:c\/|channel\/|user\/)?([^\/?]+)/);
//                 if (ytMatch) {
//                     finalUrl = `youtube://www.youtube.com/channel/${ytMatch[1]}`;
//                 }
//                 break;
                
//             case 'LinkedIn':
//                 const liMatch = url.match(/linkedin\.com\/(?:company|school)\/([^\/?]+)/);
//                 if (liMatch) {
//                     finalUrl = `linkedin://company/${liMatch[1]}`;
//                 }
//                 break;
                
//            case 'WhatsApp':
//     let phoneNumber = url;
    
//     // Extract number from URL
//     if (url.includes('wa.me')) {
//         phoneNumber = url.split('wa.me/')[1].split('?')[0];
//     }
    
//     // Clean number
//     phoneNumber = phoneNumber.replace(/[^0-9+]/g, '');
    
//     // This works for BOTH regular and Business WhatsApp
//     const whatsappUrls = [
//         `whatsapp://send?phone=${phoneNumber}`,  // Opens in installed WhatsApp (regular or business)
//         `https://wa.me/${phoneNumber}`,           // Web fallback
//     ];
    
//     for (const waUrl of whatsappUrls) {
//         const canOpen = await Linking.canOpenURL(waUrl);
//         if (canOpen) {
//             await Linking.openURL(waUrl);
//             break;
//         }
//     }
//     break;
                
//             default:
//                 finalUrl = url;
//         }
        
//         // Try to open with app-specific URL first
//         const canOpen = await Linking.canOpenURL(finalUrl);
//         console.log(`Trying to open ${platform} with URL: ${finalUrl} (canOpen: ${canOpen})`);
//         if (canOpen) {
//             await Linking.openURL(finalUrl);
//         } else {
//             // If app-specific URL fails, fall back to web URL
//             console.log(`${platform} app not installed, opening in browser...`);
//             const webSupported = await Linking.canOpenURL(url);
//             if (webSupported) {
//                 await Linking.openURL(url);
//             } else {
//                 Alert.alert('Error', `Cannot open ${platform}. Please Check Internet Connection Or   ${platform} App Install.`);
//             }
//         }
//     } catch (e) {
//         console.error('Link opening error:', e);
//         // Try web URL as fallback
//         try {
//             const webSupported = await Linking.canOpenURL(url);
//             if (webSupported) {
//                 await Linking.openURL(url);
//             } else {
//                 Alert.alert('Error', `Failed to open ${platform}`);
//             }
//         } catch (fallbackError) {
//             Alert.alert('Error', `Failed to open ${platform}`);
//         }
//     }
// };


const handleOpenLink = async (url, platform = '') => {
    if (!url) {
        Alert.alert('Not Available', `${platform} link is not available`);
        return;
    }

    try {
        let finalUrl = url;
        
        // Convert URLs to app-specific schemes
        switch (platform) {
            case 'Facebook':
                const fbMatch = url.match(/facebook\.com\/([^\/?]+)/);
                if (fbMatch) {
                    finalUrl = `fb://profile/${fbMatch[1]}`;
                }
                break;
                
            case 'Instagram':
                const igMatch = url.match(/instagram\.com\/([^\/?]+)/);
                if (igMatch) {
                    finalUrl = `instagram://user?username=${igMatch[1]}`;
                }
                break;
                
            case 'Twitter':
                const twitterMatch = url.match(/twitter\.com\/([^\/?]+)/);
                if (twitterMatch) {
                    finalUrl = `twitter://user?screen_name=${twitterMatch[1]}`;
                }
                break;
                
            case 'YouTube':
                const ytMatch = url.match(/youtube\.com\/(?:c\/|channel\/|user\/)?([^\/?]+)/);
                if (ytMatch) {
                    finalUrl = `youtube://www.youtube.com/channel/${ytMatch[1]}`;
                }
                break;
                
            case 'LinkedIn':
                const liMatch = url.match(/linkedin\.com\/(?:company|school)\/([^\/?]+)/);
                if (liMatch) {
                    finalUrl = `linkedin://company/${liMatch[1]}`;
                }
                break;
                
            case 'WhatsApp':
                let phoneNumber = url;
                
                // Extract number from URL
                if (url.includes('wa.me')) {
                    phoneNumber = url.split('wa.me/')[1].split('?')[0];
                } else if (url.includes('api.whatsapp.com')) {
                    const match = url.match(/phone=([^&]+)/);
                    if (match) phoneNumber = match[1];
                }
                
                // Clean number
                phoneNumber = phoneNumber.replace(/[^0-9+]/g, '');
                
                // Try multiple WhatsApp URL formats
                const whatsappUrls = [
                    `whatsapp://send?phone=${phoneNumber}`,  // Opens in WhatsApp app
                    `https://wa.me/${phoneNumber}`,           // Web fallback
                ];
                
                let opened = false;
                for (const waUrl of whatsappUrls) {
                    const canOpen = await Linking.canOpenURL(waUrl);
                    console.log(`Trying WhatsApp URL: ${waUrl} - Can open: ${canOpen}`);
                    if (canOpen) {
                        await Linking.openURL(waUrl);
                        opened = true;
                        return; // IMPORTANT: Return here to stop execution
                    }
                }
                
                if (!opened) {
                    Alert.alert('WhatsApp Not Installed', 'Please install WhatsApp to contact us directly, or use the web version.');
                }
                return; // IMPORTANT: Return here even if failed
                
            default:
                finalUrl = url;
        }
        
        // For non-WhatsApp platforms, try to open with app-specific URL first
        const canOpen = await Linking.canOpenURL(finalUrl);
        console.log(`Trying to open ${platform} with URL: ${finalUrl} (canOpen: ${canOpen})`);
        
        if (canOpen) {
            await Linking.openURL(finalUrl);
        } else {
            // If app-specific URL fails, fall back to web URL
            console.log(`${platform} app not installed, opening in browser...`);
            const webSupported = await Linking.canOpenURL(url);
            if (webSupported) {
                await Linking.openURL(url);
            } else {
                Alert.alert('Error', `Cannot open ${platform}. Please check your internet connection or install ${platform} app.`);
            }
        }
    } catch (e) {
        console.error('Link opening error:', e);
        Alert.alert('Error', `Failed to open ${platform}`);
    }
};
    const handleCall = (phone) => {
        if (!phone) {
            Alert.alert('Not Available', 'Phone number is not available');
            return;
        }
        const phoneUrl = `tel:${phone.replace(/[^0-9+]/g, '')}`;
        Linking.openURL(phoneUrl).catch(() => {
            Alert.alert('Error', 'Failed to make call');
        });
    };

    const handleEmail = (email) => {
        if (!email) {
            Alert.alert('Not Available', 'Email address is not available');
            return;
        }
        const emailUrl = `mailto:${email}`;
        Linking.openURL(emailUrl).catch(() => {
            Alert.alert('Error', 'Failed to open email app');
        });
    };

    const handleAddress = (address) => {
        if (!address) {
            Alert.alert('Not Available', 'Address is not available');
            return;
        }
        const encodedAddress = encodeURIComponent(address);
        const mapUrl = Platform.select({
            ios: `http://maps.apple.com/?q=${encodedAddress}`,
            android: `http://maps.google.com/?q=${encodedAddress}`,
        });
        Linking.openURL(mapUrl).catch(() => {
            Alert.alert('Error', 'Failed to open maps');
        });
    };

    const handleShareApp = async () => {
        try {
            await Share.share({
                title: content?.schoolName || 'School App',
                message: `Check out ${content?.schoolName || 'our school'} app. Download now to stay connected!`,
            });
        } catch (e) {
            console.log('Share error:', e);
        }
    };

    const handleFeedback = () => {
        const email = content?.email || 'info@eliteschool.edu';
        const subject = encodeURIComponent('Feedback about School App');
        const body = encodeURIComponent('Dear School Administration,\n\nI would like to share my feedback:\n\n');
        const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;
        Linking.openURL(mailtoUrl).catch(() => {
            Alert.alert('Error', 'Failed to open email app');
        });
    };

    const headerTranslate = scrollY.interpolate({
        inputRange: [0, HEADER_HEIGHT],
        outputRange: [0, -100],
        extrapolate: 'clamp',
    });

    const imageScale = scrollY.interpolate({
        inputRange: [-200, 0],
        outputRange: [1.3, 1],
        extrapolateRight: 'clamp',
    });

    if (isLoading) {
        return (
            <SafeAreaView
                style={[styles.container, { backgroundColor: theme.background }]}
            >
                <SkeletonPlaceholder
                    backgroundColor={theme.skeletonBg || '#E1E9EE'}
                    highlightColor={theme.skeletonHighlight || '#F2F8FC'}
                >
                    <View style={{ padding: 20 }}>
                        <View
                            style={{
                                width: '100%',
                                height: 320,
                                borderRadius: 30,
                            }}
                        />

                        <View
                            style={{
                                width: '70%',
                                height: 30,
                                borderRadius: 10,
                                marginTop: 20,
                            }}
                        />

                        <View
                            style={{
                                width: '100%',
                                height: 120,
                                borderRadius: 20,
                                marginTop: 20,
                            }}
                        />
                    </View>
                </SkeletonPlaceholder>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <View
                style={[
                    styles.errorContainer,
                    { backgroundColor: theme.background },
                ]}
            >
                <Icon name="wifi-off" size={80} color={theme.error} />

                <Text style={[styles.errorTitle, { color: theme.text }]}>
                    Something went wrong
                </Text>

                <Text
                    style={[
                        styles.errorSubtitle,
                        { color: theme.textSecondary },
                    ]}
                >
                    Failed to load information
                </Text>

                <TouchableOpacity
                    style={[
                        styles.retryButton,
                        { backgroundColor: theme.primary },
                    ]}
                    onPress={onRefresh}
                >
                    <Icon name="refresh" size={20} color="#FFF" />

                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: theme.background }]}
        >
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />

            <Animated.ScrollView
            ref={scrollViewRef}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[theme.primary]}
                        tintColor={theme.primary}
                    />
                }
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
            >
                {/* HERO */}
                <Animated.View
                    style={[
                        styles.heroContainer,
                        {
                            transform: [{ translateY: headerTranslate }],
                        },
                    ]}
                >
                    <Animated.Image
                        source={{
                            uri: content?.aboutImage
                                ? `${BASE_URL}${content.aboutImage}`
                                : 'https://images.unsplash.com/photo-1509062522246-3755977927d7',
                        }}
                        style={[
                            styles.heroImage,
                            {
                                transform: [{ scale: imageScale }],
                            },
                        ]}
                        resizeMode="cover"
                    />

                    <LinearGradient
                        colors={[
                            'rgba(0,0,0,0.2)',
                            'rgba(0,0,0,0.55)',
                            'rgba(0,0,0,0.9)',
                        ]}
                        style={styles.overlay}
                    >
                        {/* TOP BAR */}
                        <View style={styles.topBar}>
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => navigation.goBack()}
                            >
                                <Icon
                                    name="arrow-left"
                                    size={24}
                                    color="#FFF"
                                />
                            </TouchableOpacity>
                        </View>

                        {/* HERO CONTENT */}
                        <Animatable.View
                            animation="fadeInUp"
                            duration={1000}
                            style={styles.heroContent}
                        >
                            <View style={styles.badge}>
                                <Icon
                                    name="school-outline"
                                    size={18}
                                    color="#FFF"
                                />

                                <Text style={styles.badgeText}>
                                    School Management
                                </Text>
                            </View>

                            <Text style={styles.schoolName}>
                                {content?.schoolName || 'Our School'}
                            </Text>

                            <Text style={styles.schoolSubtitle}>
                                Excellence In Education & Character Building
                            </Text>
                        </Animatable.View>
                    </LinearGradient>
                </Animated.View>

                {/* MAIN CONTENT */}
                <View
                    style={[
                        styles.contentContainer,
                        { backgroundColor: theme.background },
                    ]}
                >
                    {/* ABOUT - Fixed ScrollView */}
                    {content?.aboutText ? (
                        <Animatable.View
                            animation="fadeInUp"
                            delay={200}
                            style={[
                                styles.card,
                                { backgroundColor: theme.card },
                            ]}
                        >
                            <View style={styles.cardHeader}>
                                <View
                                    style={[
                                        styles.iconContainer,
                                        {
                                            backgroundColor:
                                                theme.primary + '15',
                                        },
                                    ]}
                                >
                                    <Icon
                                        name="information-outline"
                                        size={24}
                                        color={theme.primary}
                                    />
                                </View>

                                <Text
                                    style={[
                                        styles.cardTitle,
                                        { color: theme.text },
                                    ]}
                                >
                                    About School
                                </Text>
                            </View>

                            <View style={styles.aboutScrollContainer}>
                                <ScrollView 
                                    nestedScrollEnabled={true}
                                    showsVerticalScrollIndicator={true}
                                    contentContainerStyle={styles.scrollContent}
                                >
                                    <Text
                                        style={[
                                            styles.cardText,
                                            { color: theme.textSecondary },
                                        ]}
                                    >
                                        {content.aboutText}
                                    </Text>
                                </ScrollView>
                            </View>
                        </Animatable.View>
                    ) : null}

                    {/* MISSION & VISION - Fixed ScrollView */}
                    <View style={styles.row}>
                        {content?.missionText ? (
                            <Animatable.View
                                animation="fadeInLeft"
                                delay={300}
                                style={[
                                    styles.smallCard,
                                    { backgroundColor: theme.card },
                                ]}
                            >
                                <LinearGradient
                                    colors={[theme.primary, '#7C4DFF']}
                                    style={styles.gradientIcon}
                                >
                                    <Icon
                                        name="target"
                                        size={28}
                                        color="#FFF"
                                    />
                                </LinearGradient>

                                <Text
                                    style={[
                                        styles.smallCardTitle,
                                        { color: theme.text },
                                    ]}
                                >
                                    Our Mission
                                </Text>

                                <View style={styles.missionVisionContainer}>
                                    <ScrollView 
                                        nestedScrollEnabled={true}
                                        showsVerticalScrollIndicator={true}
                                        contentContainerStyle={styles.scrollContent}
                                    >
                                        <Text
                                            style={[
                                                styles.smallCardText,
                                                { color: theme.textSecondary },
                                            ]}
                                        >
                                            {content.missionText}
                                        </Text>
                                    </ScrollView>
                                </View>
                            </Animatable.View>
                        ) : null}

                        {content?.visionText ? (
                            <Animatable.View
                                animation="fadeInRight"
                                delay={400}
                                style={[
                                    styles.smallCard,
                                    { backgroundColor: theme.card },
                                ]}
                            >
                                <LinearGradient
                                    colors={['#FF6B6B', '#FF8E53']}
                                    style={styles.gradientIcon}
                                >
                                    <Icon
                                        name="eye-outline"
                                        size={28}
                                        color="#FFF"
                                    />
                                </LinearGradient>

                                <Text
                                    style={[
                                        styles.smallCardTitle,
                                        { color: theme.text },
                                    ]}
                                >
                                    Our Vision
                                </Text>

                                <View style={styles.missionVisionContainer}>
                                    <ScrollView 
                                        nestedScrollEnabled={true}
                                        showsVerticalScrollIndicator={true}
                                        contentContainerStyle={styles.scrollContent}
                                    >
                                        <Text
                                            style={[
                                                styles.smallCardText,
                                                { color: theme.textSecondary },
                                            ]}
                                        >
                                            {content.visionText}
                                        </Text>
                                    </ScrollView>
                                </View>
                            </Animatable.View>
                        ) : null}
                    </View>

                    {/* CONTACT */}
                    <Animatable.View
                        animation="fadeInUp"
                        delay={500}
                        style={[
                            styles.card,
                            { backgroundColor: theme.card },
                        ]}
                    >
                        <View style={styles.cardHeader}>
                            <View
                                style={[
                                    styles.iconContainer,
                                    {
                                        backgroundColor:
                                            theme.primary + '15',
                                    },
                                ]}
                            >
                                <Icon
                                    name="phone-outline"
                                    size={24}
                                    color={theme.primary}
                                />
                            </View>

                            <Text
                                style={[
                                    styles.cardTitle,
                                    { color: theme.text },
                                ]}
                            >
                                Contact Information
                            </Text>
                        </View>

                        <ContactItem
                            theme={theme}
                            icon="map-marker-outline"
                            title="Address"
                            value={content?.address}
                            onPress={() => handleAddress(content?.address)}
                        />

                        <ContactItem
                            theme={theme}
                            icon="phone-outline"
                            title="Phone"
                            value={content?.phone}
                            onPress={() => handleCall(content?.phone)}
                        />

                        {content?.phoneSecondary && (
                            <ContactItem
                                theme={theme}
                                icon="phone-outline"
                                title="Phone (Secondary)"
                                value={content?.phoneSecondary}
                                onPress={() => handleCall(content?.phoneSecondary)}
                            />
                        )}

                        <ContactItem
                            theme={theme}
                            icon="email-outline"
                            title="Email"
                            value={content?.email}
                            onPress={() => handleEmail(content?.email)}
                        />

                        <ContactItem
                            theme={theme}
                            icon="web"
                            title="Website"
                            value={content?.website}
                            onPress={() => handleOpenLink(content?.website, 'Website')}
                        />

                        {content?.officeHours && (
                            <View style={styles.contactItem}>
                                <View
                                    style={[
                                        styles.contactIcon,
                                        {
                                            backgroundColor: theme.primary + '12',
                                        },
                                    ]}
                                >
                                    <Icon
                                        name="clock-outline"
                                        size={22}
                                        color={theme.primary}
                                    />
                                </View>

                                <View style={{ flex: 1 }}>
                                    <Text
                                        style={[
                                            styles.contactTitle,
                                            { color: theme.textSecondary },
                                        ]}
                                    >
                                        Office Hours
                                    </Text>

                                    <Text
                                        style={[
                                            styles.contactValue,
                                            { color: theme.text },
                                        ]}
                                    >
                                        {content.officeHours}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </Animatable.View>

                    {/* SOCIAL MEDIA */}
                    {socialLinks && socialLinks.length > 0 ? (
                        <Animatable.View
                            animation="fadeInUp"
                            delay={600}
                            style={[
                                styles.card,
                                { backgroundColor: theme.card },
                            ]}
                        >
                            <View style={styles.cardHeader}>
                                <View
                                    style={[
                                        styles.iconContainer,
                                        {
                                            backgroundColor:
                                                theme.primary + '15',
                                        },
                                    ]}
                                >
                                    <Icon
                                        name="share-variant-outline"
                                        size={24}
                                        color={theme.primary}
                                    />
                                </View>

                                <Text
                                    style={[
                                        styles.cardTitle,
                                        { color: theme.text },
                                    ]}
                                >
                                    Connect With Us
                                </Text>
                            </View>

                            <View style={styles.socialContainer}>
                                {socialLinks.map((social, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        activeOpacity={0.85}
                                        style={[
                                            styles.socialButton,
                                            {
                                                backgroundColor:
                                                    getSocialColor(
                                                        social.platform
                                                    ),
                                            },
                                        ]}
                                        onPress={() =>
                                            handleOpenLink(
                                                social.url,
                                                social.platform
                                            )
                                        }
                                    >
                                        <Icon
                                            name={getSocialIcon(
                                                social.platform
                                            )}
                                            size={24}
                                            color="#FFF"
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </Animatable.View>
                    ) : null}

                    {/* ACTION BUTTONS */}
                    {/* <View style={styles.actionRow}>
                        <TouchableOpacity
                            activeOpacity={0.85}
                            style={[
                                styles.actionButton,
                                { backgroundColor: theme.primary },
                            ]}
                            onPress={handleShareApp}
                        >
                            <Icon
                                name="share-variant-outline"
                                size={22}
                                color="#FFF"
                            />

                            <Text style={styles.actionText}>
                                Share App
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.85}
                            style={[
                                styles.actionButton,
                                { backgroundColor: '#22C55E' },
                            ]}
                            onPress={handleFeedback}
                        >
                            <Icon
                                name="message-text-outline"
                                size={22}
                                color="#FFF"
                            />

                            <Text style={styles.actionText}>
                                Feedback
                            </Text>
                        </TouchableOpacity>
                    </View> */}

                    {/* FOOTER */}
                    <View style={styles.footer}>
                        <Text
                            style={[
                                styles.footerText,
                                { color: theme.textSecondary },
                            ]}
                        >
                            © {new Date().getFullYear()}{' '}
                            {content?.schoolName ||
                                'School Management'}
                        </Text>

                        <Text
                            style={[
                                styles.footerSubText,
                                { color: theme.textSecondary },
                            ]}
                        >
                            Crafted with ❤️ for modern education
                        </Text>
                    </View>
                </View>
            </Animated.ScrollView>
        </SafeAreaView>
    );
};

const ContactItem = ({
    theme,
    icon,
    title,
    value,
    onPress,
}) => {
    if (!value) return null;

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={styles.contactItem}
            onPress={onPress}
        >
            <View
                style={[
                    styles.contactIcon,
                    {
                        backgroundColor: theme.primary + '12',
                    },
                ]}
            >
                <Icon
                    name={icon}
                    size={22}
                    color={theme.primary}
                />
            </View>

            <View style={{ flex: 1 }}>
                <Text
                    style={[
                        styles.contactTitle,
                        { color: theme.textSecondary },
                    ]}
                >
                    {title}
                </Text>

                <Text
                    style={[
                        styles.contactValue,
                        { color: theme.text },
                    ]}
                    numberOfLines={2}
                >
                    {value}
                </Text>
            </View>

            <Icon
                name="chevron-right"
                size={22}
                color={theme.textSecondary}
            />
        </TouchableOpacity>
    );
};

const getSocialColor = (platform) => {
    const colors = {
        Facebook: '#1877F2',
        Instagram: '#E4405F',
        Twitter: '#1DA1F2',
        YouTube: '#FF0000',
        LinkedIn: '#0077B5',
        WhatsApp: '#25D366',
    };

    return colors[platform] || '#6366F1';
};

const getSocialIcon = (platform) => {
    const icons = {
        Facebook: 'facebook',
        Instagram: 'instagram',
        Twitter: 'twitter',
        YouTube: 'youtube',
        LinkedIn: 'linkedin',
        WhatsApp: 'whatsapp',
    };

    return icons[platform] || 'web';
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    heroContainer: {
        height: HEADER_HEIGHT,
        overflow: 'hidden',
    },

    heroImage: {
        width: '100%',
        height: '100%',
    },

    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'space-between',
        paddingBottom: 35,
    },

    topBar: {
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingHorizontal: 20,
    },

    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
    },

    heroContent: {
        paddingHorizontal: 24,
    },

    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.15)',
        marginBottom: 18,
    },

    badgeText: {
        color: '#FFF',
        marginLeft: 8,
        fontWeight: '600',
    },

    schoolName: {
        color: '#FFF',
        fontSize: 34,
        fontWeight: '800',
    },

    schoolSubtitle: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 15,
        marginTop: 10,
        lineHeight: 22,
    },

    contentContainer: {
        marginTop: -30,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 22,
        paddingBottom: 40,
    },

    card: {
        marginHorizontal: 18,
        marginBottom: 18,
        borderRadius: 24,
        padding: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
    },

    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
    },

    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },

    cardTitle: {
        fontSize: 21,
        fontWeight: '800',
    },

    aboutScrollContainer: {
        height: 200,
    },

    missionVisionContainer: {
        height: 140,
    },

    scrollContent: {
        paddingBottom: 10,
    },

    cardText: {
        fontSize: 15,
        lineHeight: 28,
    },

    row: {
        flexDirection: 'row',
        paddingHorizontal: 18,
        gap: 14,
        marginBottom: 18,
    },

    smallCard: {
        flex: 1,
        borderRadius: 24,
        padding: 18,
        elevation: 4,
    },

    gradientIcon: {
        width: 58,
        height: 58,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },

    smallCardTitle: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 12,
    },

    smallCardText: {
        fontSize: 13,
        lineHeight: 22,
    },

    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
    },

    contactIcon: {
        width: 52,
        height: 52,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },

    contactTitle: {
        fontSize: 12,
        marginBottom: 4,
    },

    contactValue: {
        fontSize: 15,
        fontWeight: '600',
    },

    socialContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 14,
        marginTop: 10,
    },

    socialButton: {
        width: 58,
        height: 58,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
    },

    actionRow: {
        flexDirection: 'row',
        paddingHorizontal: 18,
        gap: 14,
        marginTop: 10,
    },

    actionButton: {
        flex: 1,
        height: 58,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
        elevation: 4,
    },

    actionText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 15,
    },

    footer: {
        alignItems: 'center',
        marginTop: 35,
        paddingHorizontal: 20,
    },

    footerText: {
        fontSize: 14,
        fontWeight: '600',
    },

    footerSubText: {
        marginTop: 8,
        fontSize: 12,
    },

    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },

    errorTitle: {
        fontSize: 24,
        fontWeight: '700',
        marginTop: 18,
    },

    errorSubtitle: {
        fontSize: 14,
        marginTop: 8,
    },

    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 16,
        marginTop: 25,
    },

    retryText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 15,
        marginLeft: 10,
    },
});

export default AboutScreen;