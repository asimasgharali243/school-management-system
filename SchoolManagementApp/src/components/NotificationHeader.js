import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { BASE_URL } from '../config/constants';
import { selectThemeData } from '../store/slices/themeSlice';

const NotificationHeader = ({ navigation }) => {
    const [unreadCount, setUnreadCount] = useState(0);
    const token = useSelector(state => state.auth.token);
    const userId = useSelector(state => state.auth.user?.id);
    const theme = useSelector(selectThemeData);

    useEffect(() => {
        if (userId && token) {
            fetchNotificationCount();

            // Refresh count every 30 seconds when component is mounted
            const interval = setInterval(fetchNotificationCount, 30000);

            return () => clearInterval(interval);
        }
    }, [userId, token]);

    const fetchNotificationCount = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/notifications/unread-count/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                setUnreadCount(result.count || 0);
            }
        } catch (error) {
            console.error('Error fetching notification count:', error);
        }
    };

    const handleNotificationPress = () => {
        navigation.navigate('Notifications');
    };

    return (
        <TouchableOpacity
            onPress={handleNotificationPress}
            style={[styles.container, { marginRight: 16 }]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
            <Icon
                name="bell-outline"
                size={24}
                color={theme.text}
                style={styles.icon}
            />
            {unreadCount > 0 && (
                <View style={[
                    styles.badge,
                    {
                        backgroundColor: theme.notificationBadge || '#FF3B30',
                        borderColor: theme.background || '#FFFFFF'
                    }
                ]}>
                    <Text style={[
                        styles.badgeText,
                        { color: theme.notificationBadgeText || '#FFFFFF' }
                    ]}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
    },
    icon: {
        // Additional icon styling if needed
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        borderRadius: 12,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
        borderWidth: 1.5,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default NotificationHeader;