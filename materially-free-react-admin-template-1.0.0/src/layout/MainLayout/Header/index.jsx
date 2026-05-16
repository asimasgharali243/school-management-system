import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Grid, IconButton } from '@mui/material';

// project import
import SearchSection from './SearchSection';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';
import { drawerWidth } from 'config.js';

// assets
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import logo from 'assets/images/logo.svg';

// ==============================|| HEADER ||============================== //

const Header = ({ drawerToggle }) => {
  const theme = useTheme();

  return (
    <>
      <Box width={drawerWidth} sx={{ zIndex: 1201 }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Grid item>
              <Box mt={0.5}>
                {/* <img src={logo} alt="Logo" /> */}
                <h2>
                  {/* <img src={logo} alt="Logo" /> */}
                  Task Management
                </h2>
              </Box>
            </Grid>
          </Box>
          <Grid item>
            <IconButton
              edge="start"
              sx={{ mr: theme.spacing(1.25) }}
              color="inherit"
              aria-label="open drawer"
              onClick={drawerToggle}
              size="large"
            >
              <MenuTwoToneIcon sx={{ fontSize: '1.5rem' }} />
            </IconButton>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      <SearchSection theme="light" />
      {/* <NotificationSection /> */}
      <ProfileSection />
    </>
  );
};

Header.propTypes = {
  drawerToggle: PropTypes.func
};

export default Header;
// import PropTypes from 'prop-types';
// import React from 'react';

// // material-ui
// import { useTheme } from '@mui/material/styles';
// import { Box, Grid, IconButton, Typography } from '@mui/material';

// // redux
// import { useSelector } from 'react-redux';

// // project import
// import SearchSection from './SearchSection';
// import ProfileSection from './ProfileSection';
// import NotificationSection from './NotificationSection';
// import { drawerWidth } from 'config.js';

// // assets
// import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
// import logo from 'assets/images/logo.svg';

// // ==============================|| HEADER ||============================== //

// const Header = ({ drawerToggle }) => {
//   const theme = useTheme();

//   // Get user data from Redux store
//   const { user, isAuthenticated } = useSelector((state) => state.auth);

//   return (
//     <>
//       <Box width={drawerWidth} sx={{ zIndex: 1201 }}>
//         <Grid container justifyContent="space-between" alignItems="center">
//           {/* Title shown on all screen sizes before the toggle button */}
//           <Grid item>
//             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//               {/* Title - visible on all screens */}
//               <Typography
//                 variant="h4"
//                 component="h1"
//                 sx={{
//                   fontWeight: 'bold',
//                   color: 'white',
//                   fontSize: { xs: '1.1rem', sm: '1.3rem' },
//                   mr: 2
//                 }}
//               >
//                 Task management
//               </Typography>

//               {/* Toggle button */}
//               <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={drawerToggle} size="large">
//                 <MenuTwoToneIcon sx={{ fontSize: '1.5rem' }} />
//               </IconButton>
//             </Box>
//           </Grid>
//         </Grid>
//       </Box>

//       {/* These sections remain exactly the same */}
//       <Box sx={{ flexGrow: 1 }} />
//       <SearchSection theme="light" />
//       <NotificationSection />
//       <ProfileSection />
//     </>
//   );
// };

// Header.propTypes = {
//   drawerToggle: PropTypes.func
// };

// export default Header;
