// hooks/usePermissions.js
import { useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useSelector } from 'react-redux';

export const usePermissions = () => {
  const { token, user } = useSelector((state) => state.auth);

  // Check if user is admin based on backend role
  const isAdmin = useCallback(() => {
    if (!token || !user) {
      console.log('No token or user found');
      return false;
    }

    try {
      const decoded = jwtDecode(token);

      // Check multiple possible admin role names
      const roleName = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
        decoded.role ||
        user.RoleName;

      console.log('🔍 DEBUG - User role:', roleName);

      // Admin roles
      const adminRoles = ['Admin', 'Super Admin', 'Administrator', 'admin'];
      const isAdminUser = adminRoles.includes(roleName);

      console.log('🔍 DEBUG - Is admin:', isAdminUser);
      return isAdminUser;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }, [token, user]);

  // Check if user has specific permission (admin has all)
  const hasPermission = useCallback((permission) => {
    return isAdmin();
  }, [isAdmin]);

  // Check if user has any of the given permissions
  const hasAnyPermission = useCallback((permissions) => {
    return isAdmin();
  }, [isAdmin]);

  // Check if user has all of the given permissions
  const hasAllPermissions = useCallback((permissions) => {
    return isAdmin();
  }, [isAdmin]);

  return {
    isAdmin,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canManageNotifications: isAdmin,
    userRole: isAdmin() ? 'Admin' : 'User',
    permissions: {},
  };
};