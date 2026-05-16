

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../config/constants';

// Try to import notification service with fallback
let firebaseNotifications = null;
try {
    import('../../services/notificationService').then(module => {
        firebaseNotifications = module.default || module.firebaseNotifications;
        console.log('✅ Notification service imported successfully');
    }).catch(error => {
        console.warn('⚠️ Could not import notification service:', error.message);
    });
} catch (error) {
    console.warn('⚠️ Notification service import failed:', error.message);
}

export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ username, password }, { rejectWithValue, dispatch }) => {
        try {
            console.log('🔐 Login attempt for:', username);

            const response = await fetch(`${BASE_URL}/api/Auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    username: username.trim(),
                    password: password,
                }),
            });

            console.log('📤 Response status:', response.status);

            const data = await response.json();
            console.log('📥 Response data received:', {
                hasToken: !!data.token,
                tokenLength: data.token?.length,
                hasUser: !!data.user,
                userRole: data.user?.role,
                childrenCount: data.children?.length || 0
            });

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Store tokens and user data
            console.log('💾 Storing tokens and user data...');
            await AsyncStorage.multiSet([
                ['token', data.token],
                ['user', JSON.stringify(data.user)],
                ['children', JSON.stringify(data.children || [])],
                ['user_id', String(data.user?.id || '')],
            ]);

            // Dispatch the credentials to update Redux state immediately
            dispatch(setCredentials({
                user: data.user,
                token: data.token,
                children: data.children || []
            }));

            // Initialize notifications for the user with safety check
            if (data.user) {
                console.log('🔔 Attempting to register user for notifications...');
                setTimeout(async () => {
                    try {
                        if (firebaseNotifications && typeof firebaseNotifications.registerUser === 'function') {
                            const success = await firebaseNotifications.registerUser(data.user);
                            if (success) {
                                console.log('✅ User registered for notifications');
                            } else {
                                console.log('⚠️ User registration returned false');
                            }
                        } else {
                            console.log('⚠️ Notification service not available yet');
                            await AsyncStorage.setItem('pending_notification_user', JSON.stringify(data.user));
                        }
                    } catch (notifError) {
                        console.error('❌ Failed to register for notifications:', notifError);
                    }
                }, 1000);
            }

            return data;
        } catch (error) {
            console.error('❌ Login error:', error);
            return rejectWithValue(error.message);
        }
    }
);

export const validateToken = createAsyncThunk(
    'auth/validate',
    async (_, { rejectWithValue, getState }) => {
        try {
            console.log('🔐 Starting token validation...');

            // Get token from Redux state first
            let token = getState().auth.token;
            if (!token) {
                console.log('🔐 Token not in Redux state, checking AsyncStorage...');
                token = await AsyncStorage.getItem('token');
            }

            if (!token) {
                console.error('❌ No token found for validation');
                throw new Error('No token found');
            }

            console.log('🔐 Token found, length:', token.length);

            const response = await fetch(`${BASE_URL}/api/Auth/validate`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            console.log('🔐 Validation response:', {
                status: response.status,
                hasUser: !!data.user,
                hasChildren: !!(data.children && data.children.length > 0),
                responseData: data
            });

            // FIX: Check response.ok only, not data.success
            if (!response.ok) {
                console.error('❌ Token validation failed with status:', response.status);
                throw new Error(data.message || 'Token validation failed');
            }

            // If we get here with user data, it's successful
            if (!data.user) {
                throw new Error('Invalid response: No user data');
            }

            // Update stored user data
            await AsyncStorage.multiSet([
                ['user', JSON.stringify(data.user)],
                ['children', JSON.stringify(data.children || [])],
            ]);

            // Return the data with the EXISTING token (not from response)
            return {
                user: data.user,
                children: data.children || [],
                token: token  // Keep using the existing token
            };
        } catch (error) {
            console.error('❌ Validate token error:', error);
            return rejectWithValue(error.message);
        }
    }
);

export const initializeAuth = createAsyncThunk(
    'auth/initialize',
    async (_, { dispatch }) => {
        try {
            console.log('🔄 Initializing auth state from AsyncStorage...');

            // Load ALL auth data from AsyncStorage
            const [
                token,
                userStr,
                childrenStr,
            ] = await Promise.all([
                AsyncStorage.getItem('token'),
                AsyncStorage.getItem('user'),
                AsyncStorage.getItem('children'),
            ]);

            console.log('📥 Loaded from storage:', {
                hasToken: !!token,
                tokenLength: token?.length,
                tokenPreview: token ? `${token.substring(0, 30)}...` : 'No token',
                hasUser: !!userStr,
                hasChildren: !!childrenStr
            });

            let user = null;
            let children = [];

            try {
                user = userStr ? JSON.parse(userStr) : null;
                children = childrenStr ? JSON.parse(childrenStr) : [];
            } catch (parseError) {
                console.error('❌ Error parsing stored data:', parseError);
            }

            // Set initial state with loaded data
            if (token && user) {
                // CRITICAL: Set the token in Redux state
                dispatch(setInitialState({
                    token,
                    user,
                    children,
                    isAuthenticated: true,
                    isInitialized: true,
                    isLoading: false,
                }));

                console.log('✅ Token loaded into Redux state:', {
                    stateHasToken: !!token,
                    userLoaded: !!user,
                    childrenCount: children.length
                });

                // Then validate the token
                try {
                    const result = await dispatch(validateToken()).unwrap();
                    console.log('✅ Token validated successfully');

                    // Update with validated data
                    dispatch(setCredentials({
                        user: result.user,
                        token: token, // Keep the same token
                        children: result.children || []
                    }));

                    return {
                        isAuthenticated: true,
                        token: token
                    };
                } catch (validationError) {
                    console.error('❌ Token validation failed:', validationError);
                    // Token is invalid, clear it
                    await AsyncStorage.multiRemove(['token']);
                    dispatch(logout());
                    return { isAuthenticated: false };
                }
            } else {
                console.log('ℹ️ No valid token or user found in storage');
                dispatch(setInitialState({
                    token: null,
                    user: null,
                    children: [],
                    isAuthenticated: false,
                    isInitialized: true,
                    isLoading: false,
                }));
                return { isAuthenticated: false };
            }
        } catch (error) {
            console.error('❌ Auth initialization error:', error);
            dispatch(setInitialState({
                token: null,
                user: null,
                children: [],
                isAuthenticated: false,
                isInitialized: true,
                isLoading: false,
            }));
            return { isAuthenticated: false };
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { dispatch }) => {
        try {
            console.log('👋 Logging out user...');

            // Cleanup notifications if service is available
            if (firebaseNotifications && typeof firebaseNotifications.logoutCleanup === 'function') {
                await firebaseNotifications.logoutCleanup();
            }

            // Clear AsyncStorage
            await AsyncStorage.multiRemove([
                'token',
                'user',
                'children',
                'user_id',
                'fcm_token',
                'backend_token_registered',
                'pending_notification_user',
            ]);

            // Dispatch logout action
            dispatch(logout());

            console.log('✅ Logout completed');
            return true;
        } catch (error) {
            console.error('❌ Logout error:', error);
            throw error;
        }
    }
);

const initialState = {
    user: null,
    token: null,
    children: [],
    isAuthenticated: false,
    isLoading: false,
    isInitialized: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, token, children } = action.payload;
            console.log('🔄 Setting credentials in Redux:', {
                hasToken: !!token,
                hasUser: !!user,
                childrenCount: children?.length || 0
            });
            state.user = user;
            state.token = token; // THIS IS CRITICAL
            state.children = children || [];
            state.isAuthenticated = !!token;
            state.error = null;
        },
        setInitialState: (state, action) => {
            const { token, user, children, isAuthenticated, isInitialized, isLoading } = action.payload;
            console.log('🔄 Setting initial state in Redux:', {
                hasToken: !!token,
                tokenLength: token?.length,
                hasUser: !!user
            });
            state.token = token; // THIS IS CRITICAL
            state.user = user;
            state.children = children || [];
            state.isAuthenticated = isAuthenticated;
            state.isInitialized = isInitialized !== undefined ? isInitialized : true;
            state.isLoading = isLoading !== undefined ? isLoading : false;
            state.error = null;
        },
        logout: (state) => {
            console.log('🔄 Logging out from Redux state');
            state.user = null;
            state.token = null; // THIS IS CRITICAL
            state.children = [];
            state.isAuthenticated = false;
            state.isLoading = false;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        setChildren: (state, action) => {
            console.log('🔄 Updating children in Redux state, count:', action.payload || 0);
            state.children = action.payload;
        },
        updateUserProfile: (state, action) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
                AsyncStorage.setItem('user', JSON.stringify(state.user));
            }
        },
        setToken: (state, action) => {
            console.log('🔄 Setting token in Redux:', action.payload ? 'Token set' : 'Token cleared');
            state.token = action.payload;
            state.isAuthenticated = !!action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token; // THIS IS CRITICAL
                state.children = action.payload.children || [];
                state.isInitialized = true;
                state.error = null;
                console.log('✅ Login successful, token set in Redux');
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.token = null;
                state.error = action.payload;
                console.error('❌ Login rejected:', action.payload);
            })
            .addCase(validateToken.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(validateToken.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                // Keep the existing token - don't overwrite it
                state.children = action.payload.children || [];
                state.isInitialized = true;
                state.error = null;
                console.log('✅ Token validated, user updated');
            })
            .addCase(validateToken.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null; // Clear token on validation failure
                state.children = [];
                state.isInitialized = true;
                state.error = action.payload;
                console.log('❌ Token validation failed, cleared token');
            })
            .addCase(initializeAuth.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(initializeAuth.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isInitialized = true;
                state.isAuthenticated = action.payload.isAuthenticated;
                console.log('✅ Auth initialized:', {
                    isAuthenticated: state.isAuthenticated,
                    hasToken: !!state.token
                });
            })
            .addCase(initializeAuth.rejected, (state, action) => {
                state.isLoading = false;
                state.isInitialized = true;
                state.isAuthenticated = false;
                state.token = null;
                state.error = action.payload;
                console.log('❌ Auth initialization failed');
            })
            .addCase(logoutUser.fulfilled, (state) => {
                console.log('✅ Logout successful from async');
            });
    },
});

export const {
    setCredentials,
    setInitialState,
    logout,
    clearError,
    setChildren,
    updateUserProfile,
    setToken
} = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => {
    console.log('🔍 Selecting user from state:', {
        hasUser: !!state.auth.user,
        username: state.auth.user?.username
    });
    return state.auth.user;
};

export const selectCurrentToken = (state) => {
    console.log('🔍 Selecting token from state:', {
        hasToken: !!state.auth.token,
        tokenLength: state.auth.token?.length,
        tokenPreview: state.auth.token ? `${state.auth.token.substring(0, 20)}...` : 'No token'
    });
    return state.auth.token;
};

export const selectChildren = (state) => state.auth.children;
export const selectIsAuthenticated = (state) => {
    const isAuth = state.auth.isAuthenticated && !!state.auth.token;
    console.log('🔍 Authentication check:', {
        isAuthenticated: state.auth.isAuthenticated,
        hasToken: !!state.auth.token,
        finalResult: isAuth
    });
    return isAuth;
};
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectIsInitialized = (state) => state.auth.isInitialized;
export const selectUserId = (state) => state.auth.user?.id;

export default authSlice.reducer;