// layout/MainLayout/Sidebar/MenuList/index.jsx
import React from 'react';
import { Typography, Box } from '@mui/material';
import NavGroup from './NavGroup';
import { useMenuItems } from 'menu-items';

const MenuList = () => {
  const menuData = useMenuItems();

  // Extract items from the menu data
  // Handle both structures: { items: [...] } or just [...]
  const items = menuData?.items || menuData || [];

  console.log('🔍 DEBUG - MenuList items:', items);
  console.log('🔍 DEBUG - Items type:', typeof items);
  console.log('🔍 DEBUG - Is array?:', Array.isArray(items));

  if (!Array.isArray(items) || items.length === 0) {
    return (
      <Box p={2}>
        <Typography variant="body2" color="textSecondary" align="center">
          No menu items available
        </Typography>
      </Box>
    );
  }

  const navItems = items.map((item) => {
    // NavGroup should handle both 'group' and 'collapse' types
    if (item.type === 'group' || item.type === 'collapse' || item.type === 'item') {
      return <NavGroup key={item.id} item={item} />;
    }

    return (
      <Typography key={item.id || 'error'} variant="body2" color="error" align="center">
        Unknown menu type: {item.type || 'undefined'}
      </Typography>
    );
  });

  return <>{navItems}</>;
};

export default MenuList;