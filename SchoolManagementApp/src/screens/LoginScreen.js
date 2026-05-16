// src/screens/LoginScreen.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
    StatusBar,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import { loginUser, clearError, selectIsLoading, selectAuthError } from '../store/slices/authSlice';
import { selectThemeData } from '../store/slices/themeSlice';

const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const isLoading = useSelector(selectIsLoading);
    const error = useSelector(selectAuthError);
    const theme = useSelector(selectThemeData);

    // Clear error when component mounts
    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    // Handle API errors
    useEffect(() => {
        if (error) {
            Alert.alert(
                'Login Failed',
                error,
                [{ text: 'OK', onPress: () => dispatch(clearError()) }]
            );
        }
    }, [error, dispatch]);

    const validateForm = () => {
        const newErrors = {};

        if (!username.trim()) {
            newErrors.username = 'Username is required';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 3) {
            newErrors.password = 'Password must be at least 4 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // const handleLogin = async () => {
    //     if (!validateForm()) return;

    //     try {
    //         const result = await dispatch(loginUser({ username, password })).unwrap();

    //         if (result.user) {
    //             // Navigate based on user role
    //             const roleId = result.user.roleID;

    //             switch (roleId) {
    //                 case 1: // Admin
    //                     navigation.replace('AdminDashboard');
    //                     break;
    //                 case 2: // Accountant
    //                     navigation.replace('AccountantDashboard');
    //                     break;
    //                 case 3: // Teacher
    //                     navigation.replace('TeacherDashboard');
    //                     break;
    //                 case 4: // Parent
    //                     navigation.replace('ParentChildDashboard');
    //                     break;
    //                 default:
    //                     navigation.replace('MainDashboard');
    //             }
    //         }
    //     } catch (err) {
    //         // Error is already handled by the slice
    //         console.log('Login error:', err);
    //     }
    // };



    // src/screens/LoginScreen.js - Update the handleLogin function:
    const handleLogin = async () => {
        if (!validateForm()) return;

        try {
            const result = await dispatch(loginUser({ username, password })).unwrap();
            console.log("Login result:", result);
            if (result.user) {
                // Navigate based on user role
                const roleId = result.user.roleID;

                console.log("Login result:", result);
                console.log("User role ID:", roleId)
                switch (roleId) {
                    case 1: // Admin
                        navigation.replace('AdminDashboard');
                        break;
                    case 2: // Accountant
                        navigation.replace('AccountantDashboard');
                        break;
                    case 3: // Teacher
                        navigation.replace('TeacherMain'); // Changed from 'TeacherDashboard'
                        break;
                    case 4: // Parent
                        navigation.replace('ParentDrawer'); // Changed from 'ParentChildDashboard'
                        break;
                    default:
                        navigation.replace('MainDashboard');
                }
            }
        } catch (err) {
            console.log('Login error:', err);
            Alert.alert(
                'Login Failed',
                err || 'Invalid credentials',
                [{ text: 'OK' }]
            );
        }
    };

    const handleForgotPassword = () => {

        navigation.navigate('ForgotPassword');
    };

    const handleRegister = () => {
        navigation.navigate('Register');
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: theme.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar
                backgroundColor={theme.background}
                barStyle={theme.text === '#111827' ? 'dark-content' : 'light-content'}
            />

            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Animated Logo */}
                <Animatable.View
                    animation="bounceIn"
                    duration={1500}
                    style={styles.logoContainer}
                >
                    <View style={[styles.logoWrapper, { backgroundColor: theme.primary + '20' }]}>
                        <Icon name="school" size={80} color={theme.primary} />
                    </View>
                    <Text style={[styles.title, { color: theme.text }]}>
                        School Management
                    </Text>
                    <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                        Login to your account
                    </Text>
                </Animatable.View>

                {/* Login Form */}
                <Animatable.View
                    animation="fadeInUp"
                    duration={1000}
                    style={[styles.formContainer, { backgroundColor: theme.card }]}
                >
                    {/* Username Input */}
                    <View style={styles.inputContainer}>
                        <Icon name="account" size={24} color={theme.textSecondary} style={styles.inputIcon} />
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    color: theme.text,
                                    borderColor: errors.username ? theme.error : theme.border,
                                    backgroundColor: theme.background,
                                }
                            ]}
                            placeholder="Username"
                            placeholderTextColor={theme.textSecondary}
                            value={username}
                            onChangeText={(text) => {
                                setUsername(text);
                                if (errors.username) {
                                    setErrors({ ...errors, username: '' });
                                }
                            }}
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={!isLoading}
                        />
                        {errors.username && (
                            <Animatable.Text
                                animation="shake"
                                style={[styles.errorText, { color: theme.error }]}
                            >
                                {errors.username}
                            </Animatable.Text>
                        )}
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputContainer}>
                        <Icon name="lock" size={24} color={theme.textSecondary} style={styles.inputIcon} />
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    color: theme.text,
                                    borderColor: errors.password ? theme.error : theme.border,
                                    backgroundColor: theme.background,
                                }
                            ]}
                            placeholder="Password"
                            placeholderTextColor={theme.textSecondary}
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                if (errors.password) {
                                    setErrors({ ...errors, password: '' });
                                }
                            }}
                            secureTextEntry={!showPassword}
                            editable={!isLoading}
                        />
                        <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                        >
                            <Icon
                                name={showPassword ? 'eye-off' : 'eye'}
                                size={24}
                                color={theme.textSecondary}
                            />
                        </TouchableOpacity>
                        {errors.password && (
                            <Animatable.Text
                                animation="shake"
                                style={[styles.errorText, { color: theme.error }]}
                            >
                                {errors.password}
                            </Animatable.Text>
                        )}
                    </View>

                    {/* Forgot Password */}
                    <TouchableOpacity
                        style={styles.forgotPasswordContainer}
                        onPress={handleForgotPassword}
                        disabled={isLoading}
                    >
                        <Text style={[styles.forgotPasswordText, { color: theme.primary }]}>
                            Forgot Password?
                        </Text>
                    </TouchableOpacity>

                    {/* Login Button */}
                    <TouchableOpacity
                        style={[
                            styles.loginButton,
                            {
                                backgroundColor: theme.primary,
                                opacity: isLoading ? 0.7 : 1,
                            }
                        ]}
                        onPress={handleLogin}
                        disabled={isLoading}
                        activeOpacity={0.8}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                            <View style={styles.buttonContent}>
                                <Icon name="login" size={20} color="#FFFFFF" />
                                <Text style={styles.loginButtonText}>LOGIN</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* Divider */}
                    <View style={styles.dividerContainer}>
                        <View style={[styles.divider, { backgroundColor: theme.border }]} />
                        <Text style={[styles.dividerText, { color: theme.textSecondary }]}>
                            OR
                        </Text>
                        <View style={[styles.divider, { backgroundColor: theme.border }]} />
                    </View>


                </Animatable.View>

                {/* Footer */}
                <Animatable.View
                    animation="fadeIn"
                    delay={500}
                    style={styles.footer}
                >
                    <Text style={[styles.footerText, { color: theme.textSecondary }]}>
                        © 2024 School Management System
                    </Text>
                    <Text style={[styles.versionText, { color: theme.textSecondary }]}>
                        Version 1.0.0
                    </Text>
                </Animatable.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoWrapper: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
    },
    formContainer: {
        borderRadius: 20,
        padding: 25,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputIcon: {
        position: 'absolute',
        left: 15,
        top: 15,
        zIndex: 1,
    },
    input: {
        height: 55,
        borderWidth: 1.5,
        borderRadius: 12,
        paddingHorizontal: 50,
        fontSize: 16,
        fontWeight: '500',
    },
    eyeIcon: {
        position: 'absolute',
        right: 15,
        top: 15,
        zIndex: 1,
    },
    errorText: {
        fontSize: 12,
        marginTop: 5,
        marginLeft: 5,
        fontWeight: '500',
    },
    forgotPasswordContainer: {
        alignSelf: 'flex-end',
        marginBottom: 25,
    },
    forgotPasswordText: {
        fontSize: 14,
        fontWeight: '600',
    },
    loginButton: {
        height: 55,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 25,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
    },
    divider: {
        flex: 1,
        height: 1,
    },
    dividerText: {
        marginHorizontal: 15,
        fontSize: 14,
        fontWeight: '600',
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    registerText: {
        fontSize: 15,
    },
    registerLink: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    demoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        borderWidth: 1,
        borderRadius: 10,
    },
    demoText: {
        fontSize: 13,
        fontWeight: '500',
    },
    footer: {
        alignItems: 'center',
        marginTop: 30,
    },
    footerText: {
        fontSize: 12,
        marginBottom: 5,
    },
    versionText: {
        fontSize: 11,
    },
});

export default LoginScreen;