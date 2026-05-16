// store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../api/apiConfig';
import { jwtDecode } from 'jwt-decode';

// Login thunk with simplified error handling
export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    console.log('🔍 DEBUG - Attempting login to:', `${API_BASE_URL}/api/Auth/login`);
    console.log('🔍 DEBUG - Credentials:', {
      username: credentials.UserName,
      password: '***' // Don't log actual password
    });

    const response = await fetch(`${API_BASE_URL}/api/Auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    console.log('🔍 DEBUG - Response status:', response.status);
    console.log('🔍 DEBUG - Response ok:', response.ok);

    // Check if response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error('🔍 DEBUG - Response error text:', errorText);

      let errorMessage = `Login failed: ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If not JSON, use text
        errorMessage = errorText || errorMessage;
      }

      return rejectWithValue(errorMessage);
    }

    // Parse successful response
    const data = await response.json();
    console.log('🔍 DEBUG - Login successful:', {
      token: data.token ? 'Token received' : 'No token',
      user: data.user ? 'User data received' : 'No user data'
    });

    // Store data
    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    // Store token expiry if token exists
    if (data.token) {
      try {
        const decoded = jwtDecode(data.token);
        localStorage.setItem('tokenExpiry', decoded.exp.toString());
        console.log('🔍 DEBUG - Token expiry set:', new Date(decoded.exp * 1000));
      } catch (error) {
        console.error('🔍 DEBUG - Error decoding token:', error);
      }
    }

    return data;
  } catch (error) {
    console.error('🔍 DEBUG - Network/connection error:', error);

    // Specific error handling
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      return rejectWithValue('Cannot connect to server. Please check if backend is running on http://localhost:5027');
    }

    if (error.message.includes('CORS')) {
      return rejectWithValue('CORS error: Check backend CORS configuration');
    }

    return rejectWithValue(error.message || 'Network error occurred');
  }
});

// Validate token
export const validateToken = createAsyncThunk('auth/validate', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/Auth/validate`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Token validation failed');
    }

    return await response.json();
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Logout
export const logoutUser = createAsyncThunk('auth/logout', async () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      await fetch(`${API_BASE_URL}/api/Auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiry');
  }

  return null;
});

// Check token expiry
export const checkTokenExpiry = () => (dispatch) => {
  const token = localStorage.getItem('token');

  if (!token) {
    dispatch(forceLogout());
    return;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      dispatch(forceLogout());
    }
  } catch (error) {
    console.error('Token expiry check error:', error);
    dispatch(forceLogout());
  }
};

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    console.log('🔍 DEBUG - Attempting registration to:', `${API_BASE_URL}/api/Auth/register`);
    console.log('🔍 DEBUG - User data:', {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      username: userData.username || userData.email,
      password: '***' // Don't log actual password
    });

    const response = await fetch(`${API_BASE_URL}/api/Auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    console.log('🔍 DEBUG - Response status:', response.status);
    console.log('🔍 DEBUG - Response ok:', response.ok);

    // Check if response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error('🔍 DEBUG - Response error text:', errorText);

      let errorMessage = `Registration failed: ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.title || errorMessage;
      } catch (e) {
        // If not JSON, use text
        errorMessage = errorText || errorMessage;
      }

      return rejectWithValue(errorMessage);
    }

    // Parse successful response
    const data = await response.json();
    console.log('🔍 DEBUG - Registration successful:', {
      token: data.token ? 'Token received' : 'No token',
      user: data.user ? 'User data received' : 'No user data'
    });

    // Store data if auto-login after registration
    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    // Store token expiry if token exists
    if (data.token) {
      try {
        const decoded = jwtDecode(data.token);
        localStorage.setItem('tokenExpiry', decoded.exp.toString());
        console.log('🔍 DEBUG - Token expiry set:', new Date(decoded.exp * 1000));
      } catch (error) {
        console.error('🔍 DEBUG - Error decoding token:', error);
      }
    }

    return data;
  } catch (error) {
    console.error('🔍 DEBUG - Network/connection error during registration:', error);

    // Specific error handling
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      return rejectWithValue('Cannot connect to server. Please check if backend is running');
    }

    if (error.message.includes('CORS')) {
      return rejectWithValue('CORS error: Check backend CORS configuration');
    }

    return rejectWithValue(error.message || 'Network error occurred during registration');
  }
});


// Initial state
const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
  tokenValid: false,
};

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    forceLogout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.tokenValid = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('tokenExpiry');
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || null;
        state.token = action.payload.token || null;
        state.isAuthenticated = true;
        state.tokenValid = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.tokenValid = false;
      })
      // Validate token
      .addCase(validateToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(validateToken.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || state.user;
        state.isAuthenticated = true;
        state.tokenValid = true;
      })
      .addCase(validateToken.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.tokenValid = false;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.tokenValid = false;
        state.error = null;
      });
  },
});

export const { clearError, forceLogout, updateUser } = authSlice.actions;
export default authSlice.reducer;