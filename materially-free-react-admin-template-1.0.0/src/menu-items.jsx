

import { useMemo } from 'react';
import { usePermissions } from './customHook/usePermissions';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';
import TaskIcon from '@mui/icons-material/Task';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import RuleIcon from '@mui/icons-material/Rule';
import TemplateIcon from '@mui/icons-material/DynamicForm';
import HistoryIcon from '@mui/icons-material/History';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ReportIcon from '@mui/icons-material/Report';

const icons = {
  DashboardIcon,
  PeopleIcon,
  CategoryIcon,
  TaskIcon,
  NotificationsIcon,
  SettingsIcon,
  RuleIcon,
  TemplateIcon,
  HistoryIcon,
  AnalyticsIcon,
  ReportIcon,
};

export const useMenuItems = () => {
  const { isAdmin } = usePermissions();

  const menuItems = useMemo(() => {
    const adminStatus = isAdmin(); // Call the function to get boolean

    // Return the structure that MenuList expects: { items: [...] }
    if (!adminStatus) {
      // Non-admin users only see dashboard
      return {
        items: [
          {
            id: 'dashboard',
            title: 'Dashboard',
            type: 'group',
            children: [
              {
                id: 'default',
                title: 'Default',
                type: 'item',
                icon: icons.DashboardIcon,
                url: '/dashboard/default',
              },
            ],
          },
        ],
      };
    }

    // Admin menu items
    return {
      items: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'group',
          children: [
            {
              id: 'default',
              title: 'Default',
              type: 'item',
              icon: icons.DashboardIcon,
              url: '/dashboard/default',
            },
          ],
        },
        // {
        //   id: 'management',
        //   title: 'Management',
        //   type: 'group',
        //   children: [
        //     {
        //       id: 'user-management',
        //       title: 'User Management',
        //       type: 'item',
        //       icon: icons.PeopleIcon,
        //       url: '/dashboard/user-management',
        //     },
        //     // Uncomment when ready
        //     // {
        //     //   id: 'category-management',
        //     //   title: 'Category Management',
        //     //   type: 'item',
        //     //   icon: icons.CategoryIcon,
        //     //   url: '/dashboard/category-management',
        //     // },
        //     // {
        //     //   id: 'task-management',
        //     //   title: 'Task Management',
        //     //   type: 'item',
        //     //   icon: icons.TaskIcon,
        //     //   url: '/dashboard/task-management',
        //     // },
        //   ],
        // },
        {
          id: 'notifications',
          title: 'Notifications',
          type: 'group',
          children: [
            {
              id: 'notification-rules',
              title: 'Notification Rules',
              type: 'item',
              icon: icons.RuleIcon,
              url: '/dashboard/notification-rules',
            },

            {
              id: 'notification-history',
              title: 'History',
              type: 'item',
              icon: icons.HistoryIcon,
              url: '/dashboard/notification-history',
            },
            {
              id: 'notification-analytics',
              title: 'Analytics',
              type: 'item',
              icon: icons.AnalyticsIcon,
              url: '/dashboard/notification-analytics',
            },

          ],
        },
      ],
    };
  }, [isAdmin]); // Keep isAdmin as dependency

  // Add debug logging
  console.log('🔍 DEBUG - useMenuItems returning:', menuItems);

  return menuItems;
};

export default useMenuItems;