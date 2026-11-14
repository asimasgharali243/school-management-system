import React, { forwardRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import AuthNavigator from './AuthNavigator';
import AdminNavigator from './AdminNavigator';
import TeacherNavigator from './TeacherNavigator';
import ParentNavigator from './ParentNavigator';
import RoleAccessScreen from '../screens/RoleAccessScreen';
import LoadingScreen from '../screens/LoadingScreen';
import { selectIsAuthenticated, selectCurrentUser, selectIsInitialized } from '../store/slices/authSlice';
import { resolveUserRole } from '../utils/roles';
const Stack = createNativeStackNavigator();
export const MainNavigator = () => {
  const user = useSelector(selectCurrentUser);
  switch (resolveUserRole(user)) {
    case 'admin': return <AdminNavigator />;
    case 'teacher': return <TeacherNavigator />;
    case 'parent': return <ParentNavigator />;
    default: return <RoleAccessScreen />;
  }
};
const AppNavigator = forwardRef(({ onReady }, ref) => {
  const authenticated = useSelector(selectIsAuthenticated);
  const initialized = useSelector(selectIsInitialized);
  const role = resolveUserRole(useSelector(selectCurrentUser));
  if (!initialized) return <LoadingScreen />;
  return <NavigationContainer ref={ref} onReady={onReady}>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {authenticated ? <Stack.Screen key={role || 'unassigned'} name="Main" component={MainNavigator} /> : <Stack.Screen name="Auth" component={AuthNavigator} />}
    </Stack.Navigator>
  </NavigationContainer>;
});
export default AppNavigator;
