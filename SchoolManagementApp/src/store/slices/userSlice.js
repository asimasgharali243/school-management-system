// src/store/slices/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    profile: null,
    notifications: [],
    unreadNotifications: 0,
    settings: {
        notifications: true,
        biometricLogin: false,
        autoSync: true,
        language: 'en',
    },
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setProfile: (state, action) => {
            state.profile = action.payload;
        },
        updateProfile: (state, action) => {
            if (state.profile) {
                state.profile = { ...state.profile, ...action.payload };
            }
        },
        addNotification: (state, action) => {
            state.notifications.unshift({
                ...action.payload,
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                read: false,
            });
            state.unreadNotifications += 1;
        },
        markNotificationAsRead: (state, action) => {
            const notification = state.notifications.find(n => n.id === action.payload);
            if (notification && !notification.read) {
                notification.read = true;
                state.unreadNotifications = Math.max(0, state.unreadNotifications - 1);
            }
        },
        markAllNotificationsAsRead: (state) => {
            state.notifications.forEach(notification => {
                notification.read = true;
            });
            state.unreadNotifications = 0;
        },
        clearNotifications: (state) => {
            state.notifications = [];
            state.unreadNotifications = 0;
        },
        updateSettings: (state, action) => {
            state.settings = { ...state.settings, ...action.payload };
        },
    },
});

export const {
    setProfile,
    updateProfile,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
    updateSettings,
} = userSlice.actions;

// Selectors
export const selectProfile = (state) => state.user.profile;
export const selectNotifications = (state) => state.user.notifications;
export const selectUnreadNotifications = (state) => state.user.unreadNotifications;
export const selectSettings = (state) => state.user.settings;

export default userSlice.reducer;