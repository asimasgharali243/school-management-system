// src/components/NotificationHandler.js
import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationHandler = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const hasNavigated = useRef(false);

    useEffect(() => {
        const checkAndNavigate = async () => {
            try {
                // Check for pending notification from storage
                const pendingNotification = await AsyncStorage.getItem('pending_notification');
                
                if (pendingNotification && !hasNavigated.current) {
                    hasNavigated.current = true;
                    const notification = JSON.parse(pendingNotification);
                    console.log('📱 Processing pending notification from storage:', notification);
                    
                    // Clear it immediately
                    await AsyncStorage.removeItem('pending_notification');
                    
                    // Navigate after a small delay
                    setTimeout(() => {
                        console.log('🚀 Navigating to NotificationDetail from handler');
                        navigation.replace('NotificationDetail', {
                            notificationId: notification.notificationId,
                            title: notification.title,
                            message: notification.message,
                            isHtml: notification.isHtml,
                            titleHtml: notification.titleHtml,
                            messageHtml: notification.messageHtml,
                        });
                    }, 500);
                }
            } catch (error) {
                console.error('Error checking pending notification:', error);
            }
        };

        checkAndNavigate();
    }, []);

    return null;
};

export default NotificationHandler;