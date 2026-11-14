// App.js
import React, { useEffect, useState, useRef } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar, View, ActivityIndicator, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, selectIsInitialized } from './src/store/slices/authSlice';

let firebaseNotifications = null;

const AppContent = () => {
  const dispatch = useDispatch();
  const isInitialized = useSelector(selectIsInitialized);
  const [isLoading, setIsLoading] = useState(true);
  const navigationRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      console.log('🚀 App initializing...');
      
      await dispatch(initializeAuth());
      
      try {
        const module = await import('./src/services/notificationService');
        firebaseNotifications = module.default;
        
        if (firebaseNotifications) {
          console.log('✅ Notification service loaded');
        }
      } catch (error) {
        console.error('❌ Failed to load notification service:', error);
      }
      
      // Clear any stale pending notifications on app start
      await AsyncStorage.removeItem('pending_notification');
      
      setIsLoading(false);
    };
    
    init().catch(error => {
      console.warn('App initialization could not finish:', error.message);
      setIsLoading(false);
    });
  }, []);

  const onNavigatorReady = () => {
    console.log('🎯 Navigator ready!');
    
    if (firebaseNotifications && navigationRef.current) {
      firebaseNotifications.setNavigationRef(navigationRef.current);
      
      firebaseNotifications.initialize().then(async (token) => {
        if (token) {
          const userStr = await AsyncStorage.getItem('user');
          if (userStr) {
            const user = JSON.parse(userStr);
            await firebaseNotifications.registerUser(user);
          }
        }
      }).catch(error => console.warn('Notification initialization failed:', error.message));
    }
  };

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4A90E2' }}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={{ color: '#FFFFFF', marginTop: 20, fontSize: 16 }}>
            Loading School Management...
          </Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor="#4A90E2" barStyle="light-content" />
      <AppNavigator 
        ref={navigationRef}
        onReady={onNavigatorReady}
      />
    </SafeAreaProvider>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;