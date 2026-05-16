// src/routes/MainRoutes.js
import React, { lazy } from 'react';
import MainLayout from 'layout/MainLayout';
import Loadable from 'component/Loadable';
import ProtectedRoute from './ProtectedRoute';

// Lazy load all components
const DashboardDefault = Loadable(lazy(() => import('views/Dashboard/Default')));
const UserManagement = Loadable(lazy(() => import('views/Dashboard/UserManagement')));


// Notification Management Pages
const NotificationRulesList = Loadable(lazy(() => import('views/Dashboard/NotificationRules/NotificationRulesList')));
const NotificationRuleForm = Loadable(lazy(() => import('views/Dashboard/NotificationRules/NotificationRuleForm')));
const NotificationTemplates = Loadable(lazy(() => import('views/Dashboard/NotificationTemplates/NotificationTemplates')));
const NotificationHistory = Loadable(lazy(() => import('views/Dashboard/NotificationHistory/NotificationHistory')));
const NotificationAnalytics = Loadable(lazy(() => import('views/Dashboard/NotificationAnalytics/NotificationAnalytics')));
const NotificationSettings = Loadable(lazy(() => import('views/Dashboard/NotificationSettings/NotificationSettings')));

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: (
        <ProtectedRoute requireAuthentication={true}>
          <DashboardDefault />
        </ProtectedRoute>
      )
    },
    {
      path: '/dashboard/default',
      element: (
        <ProtectedRoute requireAuthentication={true}>
          <DashboardDefault />
        </ProtectedRoute>
      )
    },
    // Admin-only pages
    {
      path: '/dashboard/user-management',
      element: (
        <ProtectedRoute adminOnly={true}>
          <UserManagement />
        </ProtectedRoute>
      )
    },
  
      // Notification Management Routes (Admin Only)
    {
      path: '/dashboard/notification-rules',
      element: (
        <ProtectedRoute adminOnly={true}>
          <NotificationRulesList />
        </ProtectedRoute>
      )
    },
    {
      path: '/dashboard/notification-rules/create',
      element: (
        <ProtectedRoute adminOnly={true}>
          <NotificationRuleForm />
        </ProtectedRoute>
      )
    },
    {
      path: '/dashboard/notification-rules/:id',
      element: (
        <ProtectedRoute adminOnly={true}>
          <NotificationRuleForm />
        </ProtectedRoute>
      )
    },
    {
      path: '/dashboard/notification-templates',
      element: (
        <ProtectedRoute adminOnly={true}>
          <NotificationTemplates />
        </ProtectedRoute>
      )
    },
    {
      path: '/dashboard/notification-history',
      element: (
        <ProtectedRoute adminOnly={true}>
          <NotificationHistory />
        </ProtectedRoute>
      )
    },
    {
      path: '/dashboard/notification-analytics',
      element: (
        <ProtectedRoute adminOnly={true}>
          <NotificationAnalytics />
        </ProtectedRoute>
      )
    },
    {
      path: '/dashboard/notification-settings',
      element: (
        <ProtectedRoute adminOnly={true}>
          <NotificationSettings />
        </ProtectedRoute>
      )
    },
  ]
};

export default MainRoutes;