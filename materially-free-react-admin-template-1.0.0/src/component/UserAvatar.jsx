import React from 'react';
import { Avatar } from '@mui/material';
import { useSelector } from 'react-redux';

const UserAvatar = ({ size = 32, ...props }) => {
  const { user } = useSelector((state) => state.auth);

  const getUserInitials = () => {
    if (!user || !user.UserName) return 'U';
    return user.UserName.charAt(0).toUpperCase();
  };

  if (user?.User_Img) {
    return <Avatar src={user.User_Img} alt={user.UserName || 'User'} sx={{ width: size, height: size }} {...props} />;
  }

  return (
    <Avatar
      sx={{
        width: size,
        height: size,
        bgcolor: 'primary.main',
        fontSize: size * 0.4,
        borderRadius: '50%',
        border: '2px solid #fff'
      }}
      {...props}
    >
      {getUserInitials()}
    </Avatar>
  );
};

export default UserAvatar;
