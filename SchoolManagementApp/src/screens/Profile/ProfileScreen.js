// src/screens/Profile/ProfileScreen.js - WITHOUT expo-image-picker
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
    Alert,
    ActivityIndicator,
    Switch,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { selectThemeData, toggleTheme } from '../../store/slices/themeSlice';
import { selectCurrentUser, logout } from '../../store/slices/authSlice';
import { selectProfile, updateProfile, updateSettings } from '../../store/slices/userSlice';

const ProfileScreen = ({ navigation }) => {
    const theme = useSelector(selectThemeData);
    const user = useSelector(selectCurrentUser);
    const profile = useSelector(selectProfile);
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [profileImage, setProfileImage] = useState(profile?.image || '');
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        designation: user?.designation || '',
        campusName: user?.campusName || '',
    });
    const [settings, setSettings] = useState({
        notifications: true,
        biometricLogin: false,
        autoSync: true,
        darkMode: theme.mode === 'dark',
        language: 'en',
    });

    useEffect(() => {
        if (profile) {
            setProfileData({
                name: profile.name || user?.name || '',
                email: profile.email || user?.email || '',
                phone: profile.phone || user?.phone || '',
                address: profile.address || user?.address || '',
                designation: profile.designation || user?.designation || '',
                campusName: profile.campusName || user?.campusName || '',
            });
            setProfileImage(profile.image || '');
        }
    }, [profile, user]);

    // Simple image selection function without expo-image-picker
    const pickImage = async () => {
        Alert.alert(
            'Profile Picture',
            'Image upload functionality requires additional setup.\n\nPlease contact administrator to update your profile picture.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'OK',
                    style: 'default',
                }
            ]
        );
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            dispatch(updateProfile({
                ...profileData,
                image: profileImage,
            }));

            Alert.alert('Success', 'Profile updated successfully');
            setEditing(false);
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: () => {
                        dispatch(logout());
                        navigation.replace('Login');
                    }
                },
            ]
        );
    };

    const handleToggleTheme = () => {
        const newDarkMode = !settings.darkMode;
        setSettings({ ...settings, darkMode: newDarkMode });
        dispatch(toggleTheme());
        dispatch(updateSettings({ darkMode: newDarkMode }));
    };

    const handleSettingToggle = (setting) => {
        const newSettings = { ...settings, [setting]: !settings[setting] };
        setSettings(newSettings);
        dispatch(updateSettings({ [setting]: newSettings[setting] }));
    };

    const handleChangeLanguage = () => {
        Alert.alert(
            'Change Language',
            'Select your preferred language',
            [
                {
                    text: 'English', onPress: () => {
                        setSettings({ ...settings, language: 'en' });
                        dispatch(updateSettings({ language: 'en' }));
                    }
                },
                {
                    text: 'Spanish', onPress: () => {
                        setSettings({ ...settings, language: 'es' });
                        dispatch(updateSettings({ language: 'es' }));
                    }
                },
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    };

    const renderInputField = (label, value, key, placeholder, keyboardType = 'default') => (
        <View style={styles.inputField}>
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                {label}
            </Text>
            {editing ? (
                <TextInput
                    style={[styles.input, {
                        color: theme.text,
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                    }]}
                    value={profileData[key]}
                    onChangeText={(text) => setProfileData({ ...profileData, [key]: text })}
                    placeholder={placeholder}
                    placeholderTextColor={theme.textSecondary}
                    editable={editing}
                    keyboardType={keyboardType}
                />
            ) : (
                <Text style={[styles.inputValue, { color: theme.text }]}>
                    {value || 'Not specified'}
                </Text>
            )}
        </View>
    );

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.card }]}>
                <Text style={[styles.headerTitle, { color: theme.text }]}>
                    Profile Settings
                </Text>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => setEditing(!editing)}
                >
                    <Icon
                        name={editing ? 'close' : 'pencil'}
                        size={20}
                        color={theme.primary}
                    />
                    <Text style={[styles.editButtonText, { color: theme.primary }]}>
                        {editing ? 'Cancel' : 'Edit'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Profile Card */}
            <View style={[styles.profileCard, { backgroundColor: theme.card }]}>
                <TouchableOpacity
                    style={styles.avatarContainer}
                    onPress={editing ? pickImage : undefined}
                    disabled={!editing}
                >
                    {profileImage ? (
                        <Image source={{ uri: profileImage }} style={styles.avatar} />
                    ) : (
                        <View style={[styles.avatarPlaceholder, { backgroundColor: theme.primary }]}>
                            <Icon name="account" size={50} color="#FFFFFF" />
                        </View>
                    )}
                    {editing && (
                        <View style={[styles.editOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                            <Icon name="camera" size={24} color="#FFFFFF" />
                        </View>
                    )}
                </TouchableOpacity>

                <View style={styles.profileInfo}>
                    <Text style={[styles.name, { color: theme.text }]}>
                        {profileData.name}
                    </Text>
                    <Text style={[styles.designation, { color: theme.primary }]}>
                        {profileData.designation}
                    </Text>
                    <Text style={[styles.campus, { color: theme.textSecondary }]}>
                        {profileData.campusName}
                    </Text>
                </View>
            </View>

            {/* Personal Information */}
            <View style={[styles.section, { backgroundColor: theme.card }]}>
                <View style={styles.sectionHeader}>
                    <Icon name="account-details" size={24} color={theme.primary} />
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>
                        Personal Information
                    </Text>
                </View>

                {renderInputField('Full Name', profileData.name, 'name', 'Enter your full name')}
                {renderInputField('Email', profileData.email, 'email', 'Enter your email', 'email-address')}
                {renderInputField('Phone', profileData.phone, 'phone', 'Enter your phone number', 'phone-pad')}
                {renderInputField('Address', profileData.address, 'address', 'Enter your address')}

                {editing && (
                    <TouchableOpacity
                        style={[styles.saveButton, { backgroundColor: theme.primary }]}
                        onPress={handleSaveProfile}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                            <>
                                <Icon name="content-save" size={20} color="#FFFFFF" />
                                <Text style={styles.saveButtonText}>Save Changes</Text>
                            </>
                        )}
                    </TouchableOpacity>
                )}
            </View>

            {/* Account Settings */}
            <View style={[styles.section, { backgroundColor: theme.card }]}>
                <View style={styles.sectionHeader}>
                    <Icon name="cog" size={24} color={theme.primary} />
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>
                        Account Settings
                    </Text>
                </View>

                <View style={styles.settingsList}>
                    {/* Notifications */}
                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Icon name="bell" size={20} color={theme.text} />
                            <Text style={[styles.settingText, { color: theme.text }]}>
                                Push Notifications
                            </Text>
                        </View>
                        <Switch
                            value={settings.notifications}
                            onValueChange={() => handleSettingToggle('notifications')}
                            trackColor={{ false: theme.border, true: theme.primary }}
                            thumbColor="#FFFFFF"
                        />
                    </View>

                    {/* Biometric Login */}
                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Icon name="fingerprint" size={20} color={theme.text} />
                            <Text style={[styles.settingText, { color: theme.text }]}>
                                Biometric Login
                            </Text>
                        </View>
                        <Switch
                            value={settings.biometricLogin}
                            onValueChange={() => handleSettingToggle('biometricLogin')}
                            trackColor={{ false: theme.border, true: theme.primary }}
                            thumbColor="#FFFFFF"
                        />
                    </View>

                    {/* Auto Sync */}
                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Icon name="sync" size={20} color={theme.text} />
                            <Text style={[styles.settingText, { color: theme.text }]}>
                                Auto Sync Data
                            </Text>
                        </View>
                        <Switch
                            value={settings.autoSync}
                            onValueChange={() => handleSettingToggle('autoSync')}
                            trackColor={{ false: theme.border, true: theme.primary }}
                            thumbColor="#FFFFFF"
                        />
                    </View>

                    {/* Dark Mode */}
                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Icon name="theme-light-dark" size={20} color={theme.text} />
                            <Text style={[styles.settingText, { color: theme.text }]}>
                                Dark Mode
                            </Text>
                        </View>
                        <Switch
                            value={settings.darkMode}
                            onValueChange={handleToggleTheme}
                            trackColor={{ false: theme.border, true: theme.primary }}
                            thumbColor="#FFFFFF"
                        />
                    </View>

                    {/* Language */}
                    <TouchableOpacity
                        style={styles.settingItem}
                        onPress={handleChangeLanguage}
                    >
                        <View style={styles.settingInfo}>
                            <Icon name="translate" size={20} color={theme.text} />
                            <Text style={[styles.settingText, { color: theme.text }]}>
                                Language
                            </Text>
                        </View>
                        <View style={styles.settingValue}>
                            <Text style={[styles.valueText, { color: theme.textSecondary }]}>
                                {settings.language === 'en' ? 'English' : 'Spanish'}
                            </Text>
                            <Icon name="chevron-right" size={20} color={theme.textSecondary} />
                        </View>
                    </TouchableOpacity>

                    {/* Change Password */}
                    <TouchableOpacity
                        style={styles.settingItem}
                        onPress={() => navigation.navigate('ChangePassword')}
                    >
                        <View style={styles.settingInfo}>
                            <Icon name="lock-reset" size={20} color={theme.text} />
                            <Text style={[styles.settingText, { color: theme.text }]}>
                                Change Password
                            </Text>
                        </View>
                        <Icon name="chevron-right" size={20} color={theme.textSecondary} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* About */}
            <View style={[styles.section, { backgroundColor: theme.card }]}>
                <View style={styles.sectionHeader}>
                    <Icon name="information" size={24} color={theme.primary} />
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>
                        About
                    </Text>
                </View>

                <View style={styles.aboutContent}>
                    <View style={styles.aboutItem}>
                        <Text style={[styles.aboutLabel, { color: theme.textSecondary }]}>
                            App Version
                        </Text>
                        <Text style={[styles.aboutValue, { color: theme.text }]}>
                            1.0.0
                        </Text>
                    </View>
                    <View style={styles.aboutItem}>
                        <Text style={[styles.aboutLabel, { color: theme.textSecondary }]}>
                            Build Number
                        </Text>
                        <Text style={[styles.aboutValue, { color: theme.text }]}>
                            20240115.1
                        </Text>
                    </View>
                    <View style={styles.aboutItem}>
                        <Text style={[styles.aboutLabel, { color: theme.textSecondary }]}>
                            Last Updated
                        </Text>
                        <Text style={[styles.aboutValue, { color: theme.text }]}>
                            January 15, 2024
                        </Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.aboutButton}>
                    <Icon name="file-document" size={20} color={theme.primary} />
                    <Text style={[styles.aboutButtonText, { color: theme.primary }]}>
                        View Terms & Conditions
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.aboutButton}>
                    <Icon name="shield-check" size={20} color={theme.primary} />
                    <Text style={[styles.aboutButtonText, { color: theme.primary }]}>
                        Privacy Policy
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <TouchableOpacity
                style={[styles.logoutButton, { backgroundColor: theme.error }]}
                onPress={handleLogout}
            >
                <Icon name="logout" size={20} color="#FFFFFF" />
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={[styles.footerText, { color: theme.textSecondary }]}>
                    © 2024 School Management System
                </Text>
                <Text style={[styles.footerText, { color: theme.textSecondary }]}>
                    All rights reserved
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 40,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    editButtonText: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 5,
    },
    profileCard: {
        alignItems: 'center',
        padding: 20,
        marginHorizontal: 15,
        marginBottom: 15,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editOverlay: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileInfo: {
        alignItems: 'center',
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    designation: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
    },
    campus: {
        fontSize: 14,
    },
    section: {
        padding: 20,
        marginHorizontal: 15,
        marginBottom: 15,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    inputField: {
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 12,
        marginBottom: 5,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    inputValue: {
        fontSize: 16,
        fontWeight: '500',
        paddingVertical: 12,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 8,
        marginTop: 10,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    settingsList: {
        marginTop: 10,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    settingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settingText: {
        fontSize: 16,
        marginLeft: 10,
        flex: 1,
    },
    settingValue: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    valueText: {
        fontSize: 14,
        marginRight: 5,
    },
    aboutContent: {
        marginBottom: 20,
    },
    aboutItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    aboutLabel: {
        fontSize: 14,
    },
    aboutValue: {
        fontSize: 14,
        fontWeight: '500',
    },
    aboutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    aboutButtonText: {
        fontSize: 16,
        marginLeft: 10,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        marginHorizontal: 15,
        marginBottom: 15,
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    logoutButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    footer: {
        alignItems: 'center',
        padding: 20,
    },
    footerText: {
        fontSize: 12,
        marginBottom: 5,
    },
});

export default ProfileScreen;