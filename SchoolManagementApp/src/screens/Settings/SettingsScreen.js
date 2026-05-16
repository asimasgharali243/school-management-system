// src/screens/Settings/SettingsScreen.js
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    Alert,
    Linking,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { selectThemeData, toggleTheme } from '../../store/slices/themeSlice';
import { updateSettings } from '../../store/slices/userSlice';

const SettingsScreen = ({ navigation }) => {
    const theme = useSelector(selectThemeData);
    const dispatch = useDispatch();

    const [settings, setSettings] = useState({
        notifications: true,
        biometricLogin: false,
        autoSync: true,
        darkMode: theme.mode === 'dark',
        dataSaving: false,
        offlineMode: false,
        language: 'English',
        fontSize: 'Medium',
        vibration: true,
        sound: true,
    });

    const handleToggleSetting = (setting) => {
        const newSettings = { ...settings, [setting]: !settings[setting] };
        setSettings(newSettings);

        // Update specific settings in Redux
        if (setting === 'darkMode') {
            dispatch(toggleTheme());
        }

        dispatch(updateSettings({ [setting]: newSettings[setting] }));
    };

    const handleLanguageSelect = () => {
        Alert.alert(
            'Select Language',
            'Choose your preferred language',
            [
                { text: 'English', onPress: () => setSettings({ ...settings, language: 'English' }) },
                { text: 'Spanish', onPress: () => setSettings({ ...settings, language: 'Spanish' }) },
                { text: 'French', onPress: () => setSettings({ ...settings, language: 'French' }) },
                { text: 'Arabic', onPress: () => setSettings({ ...settings, language: 'Arabic' }) },
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    };

    const handleFontSizeSelect = () => {
        Alert.alert(
            'Select Font Size',
            'Choose your preferred font size',
            [
                { text: 'Small', onPress: () => setSettings({ ...settings, fontSize: 'Small' }) },
                { text: 'Medium', onPress: () => setSettings({ ...settings, fontSize: 'Medium' }) },
                { text: 'Large', onPress: () => setSettings({ ...settings, fontSize: 'Large' }) },
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    };

    const handleClearCache = () => {
        Alert.alert(
            'Clear Cache',
            'Are you sure you want to clear all cached data? This will not delete your account.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: () => {
                        // Implement cache clearing logic
                        Alert.alert('Success', 'Cache cleared successfully');
                    }
                },
            ]
        );
    };

    const handleContactSupport = () => {
        Linking.openURL('mailto:support@schoolapp.com');
    };

    const handleRateApp = () => {
        // Implement app rating logic
        Alert.alert('Rate App', 'Thank you for your feedback!');
    };

    const handlePrivacyPolicy = () => {
        Linking.openURL('https://schoolapp.com/privacy');
    };

    const handleTermsOfService = () => {
        Linking.openURL('https://schoolapp.com/terms');
    };

    const renderSettingItem = ({ icon, title, description, type, value, onPress, showSwitch = false }) => (
        <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: theme.card }]}
            onPress={!showSwitch ? onPress : null}
            activeOpacity={showSwitch ? 1 : 0.7}
        >
            <View style={styles.settingLeft}>
                <Icon name={icon} size={24} color={theme.primary} style={styles.settingIcon} />
                <View style={styles.settingInfo}>
                    <Text style={[styles.settingTitle, { color: theme.text }]}>
                        {title}
                    </Text>
                    {description && (
                        <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                            {description}
                        </Text>
                    )}
                </View>
            </View>

            <View style={styles.settingRight}>
                {showSwitch ? (
                    <Switch
                        value={value}
                        onValueChange={onPress}
                        trackColor={{ false: theme.border, true: theme.primary }}
                        thumbColor="#FFFFFF"
                    />
                ) : (
                    <>
                        {type === 'select' && (
                            <>
                                <Text style={[styles.settingValue, { color: theme.textSecondary }]}>
                                    {value}
                                </Text>
                                <Icon name="chevron-right" size={20} color={theme.textSecondary} />
                            </>
                        )}
                        {type === 'action' && (
                            <Icon name="chevron-right" size={20} color={theme.textSecondary} />
                        )}
                    </>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.card }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-left" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: theme.text }]}>
                    Settings
                </Text>
                <View style={styles.placeholder} />
            </View>

            {/* Account Settings */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Account Settings
                </Text>

                {renderSettingItem({
                    icon: 'account',
                    title: 'Edit Profile',
                    type: 'action',
                    onPress: () => navigation.navigate('Profile'),
                })}

                {renderSettingItem({
                    icon: 'lock-reset',
                    title: 'Change Password',
                    type: 'action',
                    onPress: () => navigation.navigate('ChangePassword'),
                })}

                {renderSettingItem({
                    icon: 'bell',
                    title: 'Notifications',
                    description: 'Receive push notifications',
                    type: 'switch',
                    showSwitch: true,
                    value: settings.notifications,
                    onPress: () => handleToggleSetting('notifications'),
                })}

                {renderSettingItem({
                    icon: 'fingerprint',
                    title: 'Biometric Login',
                    description: 'Use fingerprint or face ID to login',
                    type: 'switch',
                    showSwitch: true,
                    value: settings.biometricLogin,
                    onPress: () => handleToggleSetting('biometricLogin'),
                })}
            </View>

            {/* App Preferences */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    App Preferences
                </Text>

                {renderSettingItem({
                    icon: 'theme-light-dark',
                    title: 'Dark Mode',
                    description: 'Switch between light and dark theme',
                    type: 'switch',
                    showSwitch: true,
                    value: settings.darkMode,
                    onPress: () => handleToggleSetting('darkMode'),
                })}

                {renderSettingItem({
                    icon: 'translate',
                    title: 'Language',
                    description: 'App interface language',
                    type: 'select',
                    value: settings.language,
                    onPress: handleLanguageSelect,
                })}

                {renderSettingItem({
                    icon: 'format-size',
                    title: 'Font Size',
                    description: 'Adjust text size',
                    type: 'select',
                    value: settings.fontSize,
                    onPress: handleFontSizeSelect,
                })}

                {renderSettingItem({
                    icon: 'sync',
                    title: 'Auto Sync',
                    description: 'Automatically sync data',
                    type: 'switch',
                    showSwitch: true,
                    value: settings.autoSync,
                    onPress: () => handleToggleSetting('autoSync'),
                })}

                {renderSettingItem({
                    icon: 'download',
                    title: 'Data Saving',
                    description: 'Reduce data usage',
                    type: 'switch',
                    showSwitch: true,
                    value: settings.dataSaving,
                    onPress: () => handleToggleSetting('dataSaving'),
                })}
            </View>

            {/* Sound & Vibration */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Sound & Vibration
                </Text>

                {renderSettingItem({
                    icon: 'volume-high',
                    title: 'Sound',
                    description: 'Enable app sounds',
                    type: 'switch',
                    showSwitch: true,
                    value: settings.sound,
                    onPress: () => handleToggleSetting('sound'),
                })}

                {renderSettingItem({
                    icon: 'vibrate',
                    title: 'Vibration',
                    description: 'Enable haptic feedback',
                    type: 'switch',
                    showSwitch: true,
                    value: settings.vibration,
                    onPress: () => handleToggleSetting('vibration'),
                })}
            </View>

            {/* Data Management */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Data Management
                </Text>

                {renderSettingItem({
                    icon: 'cloud-download',
                    title: 'Download Data',
                    description: 'Download your data for backup',
                    type: 'action',
                    onPress: () => navigation.navigate('DownloadData'),
                })}

                {renderSettingItem({
                    icon: 'database-remove',
                    title: 'Clear Cache',
                    description: 'Clear temporary app data',
                    type: 'action',
                    onPress: handleClearCache,
                })}

                {renderSettingItem({
                    icon: 'database-export',
                    title: 'Export Data',
                    description: 'Export your data as PDF/Excel',
                    type: 'action',
                    onPress: () => navigation.navigate('ExportData'),
                })}
            </View>

            {/* Support & About */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Support & About
                </Text>

                {renderSettingItem({
                    icon: 'help-circle',
                    title: 'Help & Support',
                    description: 'Get help with the app',
                    type: 'action',
                    onPress: () => navigation.navigate('HelpSupport'),
                })}

                {renderSettingItem({
                    icon: 'email',
                    title: 'Contact Us',
                    description: 'Send us feedback or report issues',
                    type: 'action',
                    onPress: handleContactSupport,
                })}

                {renderSettingItem({
                    icon: 'star',
                    title: 'Rate the App',
                    description: 'Share your experience',
                    type: 'action',
                    onPress: handleRateApp,
                })}

                {renderSettingItem({
                    icon: 'shield-check',
                    title: 'Privacy Policy',
                    description: 'View our privacy policy',
                    type: 'action',
                    onPress: handlePrivacyPolicy,
                })}

                {renderSettingItem({
                    icon: 'file-document',
                    title: 'Terms of Service',
                    description: 'View terms and conditions',
                    type: 'action',
                    onPress: handleTermsOfService,
                })}
            </View>

            {/* App Info */}
            <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
                <View style={styles.appInfo}>
                    <Icon name="school" size={40} color={theme.primary} />
                    <View style={styles.appDetails}>
                        <Text style={[styles.appName, { color: theme.text }]}>
                            School Management App
                        </Text>
                        <Text style={[styles.appVersion, { color: theme.textSecondary }]}>
                            Version 1.0.0 (Build 20240115.1)
                        </Text>
                        <Text style={[styles.appCopyright, { color: theme.textSecondary }]}>
                            © 2024 School Management System
                        </Text>
                    </View>
                </View>
            </View>

            {/* Danger Zone */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.error }]}>
                    Danger Zone
                </Text>

                <TouchableOpacity
                    style={[styles.dangerButton, { backgroundColor: theme.error }]}
                    onPress={() => navigation.navigate('DeleteAccount')}
                >
                    <Icon name="delete" size={20} color="#FFFFFF" />
                    <Text style={styles.dangerButtonText}>Delete Account</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.dangerButton, { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.error }]}
                    onPress={() => navigation.navigate('LogoutAllDevices')}
                >
                    <Icon name="logout" size={20} color={theme.error} />
                    <Text style={[styles.dangerButtonText, { color: theme.error }]}>
                        Logout from All Devices
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.spacer} />
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
    backButton: {
        padding: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    placeholder: {
        width: 34,
    },
    section: {
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        paddingLeft: 5,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderRadius: 10,
        marginBottom: 8,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settingIcon: {
        marginRight: 12,
    },
    settingInfo: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 2,
    },
    settingDescription: {
        fontSize: 12,
    },
    settingRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingValue: {
        fontSize: 14,
        marginRight: 5,
    },
    infoCard: {
        padding: 20,
        marginHorizontal: 15,
        marginBottom: 20,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    appInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    appDetails: {
        flex: 1,
        marginLeft: 15,
    },
    appName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    appVersion: {
        fontSize: 12,
        marginBottom: 2,
    },
    appCopyright: {
        fontSize: 11,
    },
    dangerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    dangerButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    spacer: {
        height: 30,
    },
});

export default SettingsScreen;