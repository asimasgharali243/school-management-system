// components/ProtectedRoute.jsx
import React, { useEffect, useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, CircularProgress, Typography } from '@mui/material';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, adminOnly = false, requireAuthentication = false }) => {
  const location = useLocation();
  const { isAuthenticated, token, loading, user } = useSelector((state) => state.auth);

  // Check if user is admin
  const isAdmin = useMemo(() => {
    if (!token || !user) return false;

    try {
      const decoded = jwtDecode(token);
      const roleName = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
        decoded.role ||
        user.RoleName;

      const adminRoles = ['Admin', 'Super Admin', 'Administrator', 'admin'];
      return adminRoles.includes(roleName);
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }, [token, user]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" flexDirection="column" gap={2}>
        <CircularProgress />
        <Typography variant="h6" color="textSecondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  // Check authentication
  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/application/login" state={{ from: location }} replace />;
  }

  // Check admin access for admin-only routes
  if (adminOnly && !isAdmin) {
    console.log(`Access denied: Admin required for route`);
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" flexDirection="column" gap={2}>
        <Typography variant="h4" color="error">
          Access Denied
        </Typography>
        <Typography variant="h6" color="textSecondary">
          This page is only accessible to administrators.
        </Typography>
      </Box>
    );
  }

  console.log(`Access granted for route`);
  return children;
};

export default ProtectedRoute;