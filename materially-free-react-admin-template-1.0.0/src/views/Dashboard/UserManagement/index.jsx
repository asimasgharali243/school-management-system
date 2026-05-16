
// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Typography,
//   Paper,
//   Grid,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Chip,
//   Alert,
//   Snackbar,
//   Card,
//   CardContent,
//   CardHeader,
//   Divider,
//   Tooltip,
//   CircularProgress,
//   useTheme
// } from '@mui/material';
// import {
//   Add as AddIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   LockReset as LockResetIcon,
//   Visibility as VisibilityIcon,
//   VisibilityOff as VisibilityOffIcon
// } from '@mui/icons-material';

// // Import RTK Query hooks
// import {
//   useGetUsersQuery,
//   useCreateUserMutation,
//   useUpdateUserMutation,
//   useDeleteUserMutation,
//   useChangePasswordMutation,
//   useToggleUserStatusMutation,
//   useValidateUsernameQuery,
//   useResetUserPasswordMutation
// } from '../../../store/api/usersApi';

// // Import projects API hook
// import { useGetProjectsQuery } from '../../../store/api/projectsApi';

// // Validation functions
// const validateEmail = (email) => {
//   if (!email) return true;
//   const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
//   return gmailRegex.test(email);
// };

// const validatePhone = (phone) => {
//   if (!phone) return true;
//   const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
//   return phoneRegex.test(phone);
// };

// const UserManagement = () => {
//   const theme = useTheme();

//   // RTK Query hooks
//   const { data: users = [], isLoading: usersLoading, error: usersError, refetch: refetchUsers } = useGetUsersQuery();

//   // Projects query
//   const { data: projectsData = [], isLoading: projectsLoading } = useGetProjectsQuery({ 
//     limit: 100 
//   });

//   const projects = projectsData.data || projectsData || [];

//   const [createUser, { isLoading: creatingUser }] = useCreateUserMutation();
//   const [updateUser, { isLoading: updatingUser }] = useUpdateUserMutation();
//   const [deleteUser, { isLoading: deletingUser }] = useDeleteUserMutation();
//   const [changePassword, { isLoading: changingPassword }] = useChangePasswordMutation();
//   const [toggleUserStatus, { isLoading: togglingStatus }] = useToggleUserStatusMutation();
//   const [resetUserPassword, { isLoading: resettingPassword }] = useResetUserPasswordMutation();

//   // Local state
//   const [openCreateDialog, setOpenCreateDialog] = useState(false);
//   const [openResetPasswordDialog, setOpenResetPasswordDialog] = useState(false);
//   const [openEditDialog, setOpenEditDialog] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [usernameAvailable, setUsernameAvailable] = useState(true);
  
//   // Validation states
//   const [formErrors, setFormErrors] = useState({
//     create: {},
//     edit: {},
//     resetPassword: {}
//   });

//   // Form states
//   const [createForm, setCreateForm] = useState({
//     username: '',
//     password: '',
//     confirmPassword: '',
//     fullName: '',
//     email: '',
//     phone: '',
//     userType: 'User',
//     projectName: ''
//   });

//   const [editForm, setEditForm] = useState({
//     fullName: '',
//     email: '',
//     phone: '',
//     userType: 'User',
//     isActive: true,
//     projectName: ''
//   });

//   const [resetPasswordForm, setResetPasswordForm] = useState({
//     newPassword: '',
//     confirmNewPassword: ''
//   });

//   // Store original edit form to compare changes
//   const [originalEditForm, setOriginalEditForm] = useState(null);

//   // Validate username availability
//   const { data: usernameValidation } = useValidateUsernameQuery(createForm.username, { 
//     skip: !createForm.username || createForm.username.length < 3 
//   });

//   useEffect(() => {
//     if (usernameValidation) {
//       setUsernameAvailable(!usernameValidation.exists);
//     }
//   }, [usernameValidation]);

//   // Validate create form fields
//   const validateCreateForm = () => {
//     const errors = {};
    
//     if (!createForm.username.trim()) errors.username = 'Username is required';
//     if (!createForm.password) errors.password = 'Password is required';
//     if (!createForm.fullName.trim()) errors.fullName = 'Full name is required';
    
//     if (createForm.password && createForm.password.length < 6) {
//       errors.password = 'Password must be at least 6 characters';
//     }
    
//     if (createForm.password !== createForm.confirmPassword) {
//       errors.confirmPassword = 'Passwords do not match';
//     }
    
//     if (createForm.email && !validateEmail(createForm.email)) {
//       errors.email = 'Please enter a valid Gmail address (e.g., example@gmail.com)';
//     }
    
//     if (createForm.phone && !validatePhone(createForm.phone)) {
//       errors.phone = 'Please enter a valid phone number';
//     }
    
//     if (createForm.username && !usernameAvailable) {
//       errors.username = 'Username is already taken';
//     }
    
//     setFormErrors(prev => ({ ...prev, create: errors }));
//     return Object.keys(errors).length === 0;
//   };

//   // Validate edit form fields
//   const validateEditForm = () => {
//     const errors = {};
    
//     if (!editForm.fullName.trim()) errors.fullName = 'Full name is required';
    
//     if (editForm.email && !validateEmail(editForm.email)) {
//       errors.email = 'Please enter a valid Gmail address (e.g., example@gmail.com)';
//     }
    
//     if (editForm.phone && !validatePhone(editForm.phone)) {
//       errors.phone = 'Please enter a valid phone number';
//     }
    
//     setFormErrors(prev => ({ ...prev, edit: errors }));
//     return Object.keys(errors).length === 0;
//   };

//   // Validate reset password form
//   const validateResetPasswordForm = () => {
//     const errors = {};
    
//     if (!resetPasswordForm.newPassword) {
//       errors.newPassword = 'New password is required';
//     } else if (resetPasswordForm.newPassword.length < 6) {
//       errors.newPassword = 'Password must be at least 6 characters';
//     }
    
//     if (!resetPasswordForm.confirmNewPassword) {
//       errors.confirmNewPassword = 'Please confirm new password';
//     } else if (resetPasswordForm.newPassword !== resetPasswordForm.confirmNewPassword) {
//       errors.confirmNewPassword = 'Passwords do not match';
//     }
    
//     setFormErrors(prev => ({ ...prev, resetPassword: errors }));
//     return Object.keys(errors).length === 0;
//   };

//   const showSnackbar = (message, severity = 'success') => {
//     setSnackbar({ open: true, message, severity });
//   };

//   // Handle create user
//   const handleCreateUser = async () => {
//     if (!validateCreateForm()) {
//       showSnackbar('Please fix form errors before submitting', 'error');
//       return;
//     }

//     try {
//       const userData = {
//         username: createForm.username.trim(),
//         password: createForm.password,
//         fullName: createForm.fullName.trim(),
//         email: createForm.email ? createForm.email.trim() : undefined,
//         phone: createForm.phone ? createForm.phone.trim() : undefined,
//         userType: createForm.userType,
//         projectName: createForm.projectName || undefined
//       };

//       await createUser(userData).unwrap();

//       setOpenCreateDialog(false);
//       resetCreateForm();
//       showSnackbar('User created successfully');
//       refetchUsers();
//     } catch (error) {
//       showSnackbar(error.data?.message || 'Error creating user', 'error');
//     }
//   };

//   // Handle edit user
//   const handleEditUser = async () => {
//     if (!selectedUser) return;
    
//     if (!validateEditForm()) {
//       showSnackbar('Please fix form errors before submitting', 'error');
//       return;
//     }

//     const hasChanges = (
//       editForm.fullName.trim() !== originalEditForm.fullName.trim() ||
//       editForm.email !== originalEditForm.email ||
//       editForm.phone !== originalEditForm.phone ||
//       editForm.userType !== originalEditForm.userType ||
//       editForm.isActive !== originalEditForm.isActive ||
//       editForm.projectName !== originalEditForm.projectName
//     );

//     if (!hasChanges) {
//       showSnackbar('No changes detected', 'info');
//       setOpenEditDialog(false);
//       setSelectedUser(null);
//       return;
//     }

//     try {
//       const userData = {
//         fullName: editForm.fullName.trim(),
//         email: editForm.email ? editForm.email.trim() : undefined,
//         phone: editForm.phone ? editForm.phone.trim() : undefined,
//         userType: editForm.userType,
//         isActive: editForm.isActive,
//         projectName: editForm.projectName || undefined
//       };

//       await updateUser({ id: selectedUser.id, ...userData }).unwrap();

//       setOpenEditDialog(false);
//       setSelectedUser(null);
//       setOriginalEditForm(null);
//       showSnackbar('User updated successfully');
//       refetchUsers();
//     } catch (error) {
//       showSnackbar(error.data?.message || 'Error updating user', 'error');
//     }
//   };

//   // Handle delete user
//   const handleDeleteUser = async (user) => {
//     if (window.confirm(`Are you sure you want to delete user "${user.username}"?`)) {
//       try {
//         await deleteUser(user.id).unwrap();
//         showSnackbar('User deleted successfully');
//         refetchUsers();
//       } catch (error) {
//         showSnackbar(error.data?.message || 'Error deleting user', 'error');
//       }
//     }
//   };

//   // Handle admin reset user password
//   const handleResetPassword = async () => {
//     if (!selectedUser) return;

//     if (!validateResetPasswordForm()) {
//       showSnackbar('Please fix form errors before submitting', 'error');
//       return;
//     }

//     try {
//       await resetUserPassword({
//         id: selectedUser.id,
//         newPassword: resetPasswordForm.newPassword
//       }).unwrap();

//       setOpenResetPasswordDialog(false);
//       resetResetPasswordForm();
//       showSnackbar(`Password reset successfully for ${selectedUser.username}`);
//     } catch (error) {
//       showSnackbar(error.data?.message || 'Error resetting password', 'error');
//     }
//   };

//   // Handle toggle user status
//   const handleToggleUserStatus = async (user) => {
//     try {
//       await toggleUserStatus({
//         id: user.id,
//         isActive: !user.isActive
//       }).unwrap();

//       showSnackbar(`User ${!user.isActive ? 'activated' : 'deactivated'} successfully`);
//       refetchUsers();
//     } catch (error) {
//       showSnackbar(error.data?.message || 'Error updating user status', 'error');
//     }
//   };

//   // Open edit dialog
//   const openEditUserDialog = (user) => {
//     setSelectedUser(user);
//     const initialForm = {
//       fullName: user.fullName,
//       email: user.email || '',
//       phone: user.phone || '',
//       userType: user.userType,
//       isActive: user.isActive,
//       projectName: user.projectName || ''
//     };
//     setEditForm(initialForm);
//     setOriginalEditForm(initialForm);
//     setOpenEditDialog(true);
//     setFormErrors(prev => ({ ...prev, edit: {} }));
//   };

//   // Open reset password dialog
//   const handleOpenResetPasswordDialog = (user) => {
//     setSelectedUser(user);
//     setOpenResetPasswordDialog(true);
//     setFormErrors(prev => ({ ...prev, resetPassword: {} }));
//   };

//   // Reset forms
//   const resetCreateForm = () => {
//     setCreateForm({
//       username: '',
//       password: '',
//       confirmPassword: '',
//       fullName: '',
//       email: '',
//       phone: '',
//       userType: 'User',
//       projectName: ''
//     });
//     setUsernameAvailable(true);
//     setShowPassword(false);
//     setShowConfirmPassword(false);
//     setFormErrors(prev => ({ ...prev, create: {} }));
//   };

//   const resetResetPasswordForm = () => {
//     setResetPasswordForm({
//       newPassword: '',
//       confirmNewPassword: ''
//     });
//     setFormErrors(prev => ({ ...prev, resetPassword: {} }));
//   };

//   // Helper functions
//   const getStatusColor = (isActive) => {
//     return isActive ? 'success' : 'error';
//   };

//   const getUserTypeColor = (userType) => {
//     const colors = {
//       Admin: 'error',
//       Manager: 'warning',
//       User: 'primary'
//     };
//     return colors[userType] || 'default';
//   };

//   const isLoading = usersLoading || creatingUser || updatingUser || deletingUser || changingPassword || togglingStatus || resettingPassword;

//   const tableHeaderStyle = {
//     backgroundColor: theme.palette.primary.main,
//     color: '#ffffff',
//     fontWeight: 600,
//     fontSize: '0.875rem'
//   };

//   const tableRowStyle = {
//     '&:hover': {
//       backgroundColor: theme.palette.action.hover
//     }
//   };

//   const tableCellStyle = {
//     color: theme.palette.text.primary,
//     borderBottom: `1px solid ${theme.palette.divider}`
//   };

//   const cardStyle = {
//     backgroundColor: theme.palette.background.paper,
//     boxShadow: theme.shadows[1],
//     borderRadius: '10px'
//   };

//   return (
//     <Box>
//       {/* Header */}
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//         <Typography variant="h4" gutterBottom color="textDark" fontWeight={600}>
//           User Management
//         </Typography>
//         <Button
//           variant="contained"
//           startIcon={<AddIcon />}
//           onClick={() => setOpenCreateDialog(true)}
//           sx={{
//             backgroundColor: theme.palette.primary.main,
//             '&:hover': {
//               backgroundColor: theme.palette.primary.dark
//             }
//           }}
//         >
//           Create User
//         </Button>
//       </Box>

//       {/* Error Alert */}
//       {usersError && (
//         <Alert severity="error" sx={{ mb: 2 }}>
//           Error loading users: {usersError.data?.message || 'Please try again'}
//         </Alert>
//       )}

//       {/* Users Table */}
//       <Card sx={cardStyle}>
//         <CardHeader
//           title={
//             <Typography variant="h6" component="div" color="textDark" fontWeight={600}>
//               Users List
//             </Typography>
//           }
//         />
//         <Divider />
//         <CardContent>
//           <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: 'transparent' }}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell sx={tableHeaderStyle}>Username</TableCell>
//                   <TableCell sx={tableHeaderStyle}>Full Name</TableCell>
//                   <TableCell sx={tableHeaderStyle}>Email</TableCell>
//                   <TableCell sx={tableHeaderStyle}>Phone</TableCell>
//                   <TableCell sx={tableHeaderStyle}>User Type</TableCell>
//                   <TableCell sx={tableHeaderStyle}>Project</TableCell>
//                   <TableCell sx={tableHeaderStyle}>Status</TableCell>
//                   <TableCell sx={tableHeaderStyle}>Created Date</TableCell>
//                   <TableCell align="center" sx={tableHeaderStyle}>
//                     Actions
//                   </TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {usersLoading ? (
//                   <TableRow>
//                     <TableCell colSpan={9} align="center" sx={tableCellStyle}>
//                       <CircularProgress />
//                     </TableCell>
//                   </TableRow>
//                 ) : users.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={9} align="center" sx={tableCellStyle}>
//                       <Typography color="textSecondary">No users found</Typography>
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   users.map((user) => (
//                     <TableRow key={user.id} hover sx={tableRowStyle}>
//                       <TableCell sx={tableCellStyle}>
//                         <Typography variant="subtitle2" color="textPrimary" fontWeight={500}>
//                           {user.username}
//                         </Typography>
//                       </TableCell>
//                       <TableCell sx={tableCellStyle}>
//                         <Typography color="textPrimary">{user.fullName}</Typography>
//                       </TableCell>
//                       <TableCell sx={tableCellStyle}>
//                         <Typography color="textPrimary">{user.email || '-'}</Typography>
//                       </TableCell>
//                       <TableCell sx={tableCellStyle}>
//                         <Typography color="textPrimary">{user.phone || '-'}</Typography>
//                       </TableCell>
//                       <TableCell sx={tableCellStyle}>
//                         <Chip
//                           label={user.userType}
//                           color={getUserTypeColor(user.userType)}
//                           size="small"
//                           sx={{
//                             color: '#ffffff',
//                             fontWeight: 500
//                           }}
//                         />
//                       </TableCell>
//                       <TableCell sx={tableCellStyle}>
//                         <Typography color="textPrimary">
//                           {user.projectName || '-'}
//                         </Typography>
//                       </TableCell>
//                       <TableCell sx={tableCellStyle}>
//                         <Chip
//                           label={user.isActive ? 'Active' : 'Inactive'}
//                           color={getStatusColor(user.isActive)}
//                           size="small"
//                           onClick={() => handleToggleUserStatus(user)}
//                           sx={{
//                             cursor: 'pointer',
//                             color: '#ffffff',
//                             fontWeight: 500,
//                             '&:hover': {
//                               opacity: 0.8
//                             }
//                           }}
//                           disabled={togglingStatus}
//                         />
//                       </TableCell>
//                       <TableCell sx={tableCellStyle}>
//                         <Typography color="textPrimary">{new Date(user.createdAt).toLocaleDateString()}</Typography>
//                       </TableCell>
//                       <TableCell align="center" sx={tableCellStyle}>
//                         <Box display="flex" justifyContent="center" gap={1}>
//                           <Tooltip title="Edit User">
//                             <IconButton
//                               size="small"
//                               color="primary"
//                               onClick={() => openEditUserDialog(user)}
//                               disabled={updatingUser}
//                               sx={{
//                                 color: theme.palette.primary.main,
//                                 '&:hover': {
//                                   backgroundColor: theme.palette.primary.light,
//                                   color: '#ffffff'
//                                 }
//                               }}
//                             >
//                               <EditIcon />
//                             </IconButton>
//                           </Tooltip>
//                           <Tooltip title="Reset Password">
//                             <IconButton
//                               size="small"
//                               color="secondary"
//                               onClick={() => handleOpenResetPasswordDialog(user)}
//                               disabled={resettingPassword}
//                               sx={{
//                                 color: theme.palette.secondary.main,
//                                 '&:hover': {
//                                   backgroundColor: theme.palette.secondary.light,
//                                   color: '#ffffff'
//                                 }
//                               }}
//                             >
//                               <LockResetIcon />
//                             </IconButton>
//                           </Tooltip>
//                           <Tooltip title="Delete User">
//                             <IconButton
//                               size="small"
//                               color="error"
//                               onClick={() => handleDeleteUser(user)}
//                               disabled={user.userType === 'Admin' || deletingUser}
//                               sx={{
//                                 color: theme.palette.error.main,
//                                 '&:hover': {
//                                   backgroundColor: theme.palette.error.light,
//                                   color: '#ffffff'
//                                 }
//                               }}
//                             >
//                               <DeleteIcon />
//                             </IconButton>
//                           </Tooltip>
//                         </Box>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </CardContent>
//       </Card>

//       {/* Create User Dialog */}
//       <Dialog
//         open={openCreateDialog}
//         onClose={() => {
//           setOpenCreateDialog(false);
//           resetCreateForm();
//         }}
//         maxWidth="md"
//         fullWidth
//         PaperProps={{
//           sx: {
//             borderRadius: '10px'
//           }
//         }}
//       >
//         <DialogTitle>
//           <Typography variant="h6" color="textDark" fontWeight={600}>
//             Create New User
//           </Typography>
//         </DialogTitle>
//         <DialogContent>
//           <Grid container spacing={2} sx={{ mt: 1 }}>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Username *"
//                 value={createForm.username}
//                 onChange={(e) => setCreateForm((prev) => ({ ...prev, username: e.target.value }))}
//                 error={!!formErrors.create.username}
//                 helperText={formErrors.create.username}
//                 onBlur={() => validateCreateForm()}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <InputLabel>User Type *</InputLabel>
//                 <Select
//                   value={createForm.userType}
//                   label="User Type *"
//                   onChange={(e) => setCreateForm((prev) => ({ ...prev, userType: e.target.value }))}
//                 >
//                   <MenuItem value="User">User</MenuItem>
//                   <MenuItem value="Manager">Manager</MenuItem>
//                   <MenuItem value="Admin">Admin</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Full Name *"
//                 value={createForm.fullName}
//                 onChange={(e) => setCreateForm((prev) => ({ ...prev, fullName: e.target.value }))}
//                 error={!!formErrors.create.fullName}
//                 helperText={formErrors.create.fullName}
//                 onBlur={() => validateCreateForm()}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Email"
//                 type="email"
//                 value={createForm.email}
//                 onChange={(e) => setCreateForm((prev) => ({ ...prev, email: e.target.value }))}
//                 error={!!formErrors.create.email}
//                 helperText={formErrors.create.email || 'Only Gmail addresses are allowed (optional)'}
//                 onBlur={() => validateCreateForm()}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Phone"
//                 value={createForm.phone}
//                 onChange={(e) => setCreateForm((prev) => ({ ...prev, phone: e.target.value }))}
//                 error={!!formErrors.create.phone}
//                 helperText={formErrors.create.phone || 'Optional - Enter digits only (e.g., 1234567890)'}
//                 onBlur={() => validateCreateForm()}
//               />
//             </Grid>
//             {/* Project Selection Dropdown */}
//             <Grid item xs={12}>
//               <FormControl fullWidth>
//                 <InputLabel>Assign to Project (Optional)</InputLabel>
//                 <Select
//                   value={createForm.projectName}
//                   label="Assign to Project (Optional)"
//                   onChange={(e) => setCreateForm((prev) => ({ ...prev, projectName: e.target.value }))}
//                 >
//                   <MenuItem value="">No Project</MenuItem>
//                   {projectsLoading ? (
//                     <MenuItem disabled>Loading projects...</MenuItem>
//                   ) : projects.map((project) => (
//                     <MenuItem key={project.id} value={project.name}>
//                       {project.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Password *"
//                 type={showPassword ? 'text' : 'password'}
//                 value={createForm.password}
//                 onChange={(e) => setCreateForm((prev) => ({ ...prev, password: e.target.value }))}
//                 error={!!formErrors.create.password}
//                 helperText={formErrors.create.password}
//                 InputProps={{
//                   endAdornment: (
//                     <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
//                       {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
//                     </IconButton>
//                   )
//                 }}
//                 onBlur={() => validateCreateForm()}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Confirm Password *"
//                 type={showConfirmPassword ? 'text' : 'password'}
//                 value={createForm.confirmPassword}
//                 onChange={(e) => setCreateForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
//                 error={!!formErrors.create.confirmPassword}
//                 helperText={formErrors.create.confirmPassword}
//                 InputProps={{
//                   endAdornment: (
//                     <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
//                       {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
//                     </IconButton>
//                   )
//                 }}
//                 onBlur={() => validateCreateForm()}
//               />
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => {
//             setOpenCreateDialog(false);
//             resetCreateForm();
//           }}>
//             Cancel
//           </Button>
//           <Button
//             onClick={handleCreateUser}
//             variant="contained"
//             disabled={creatingUser || isLoading || projectsLoading}
//             sx={{
//               backgroundColor: theme.palette.primary.main,
//               '&:hover': {
//                 backgroundColor: theme.palette.primary.dark
//               }
//             }}
//           >
//             {creatingUser ? <CircularProgress size={24} /> : 'Create User'}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Edit User Dialog */}
//       <Dialog
//         open={openEditDialog}
//         onClose={() => {
//           setOpenEditDialog(false);
//           setOriginalEditForm(null);
//         }}
//         maxWidth="md"
//         fullWidth
//         PaperProps={{
//           sx: {
//             borderRadius: '10px'
//           }
//         }}
//       >
//         <DialogTitle>
//           <Typography variant="h6" color="textDark" fontWeight={600}>
//             Edit User - {selectedUser?.username}
//           </Typography>
//         </DialogTitle>
//         <DialogContent>
//           <Grid container spacing={2} sx={{ mt: 1 }}>
//             <Grid item xs={12}>
//               <TextField 
//                 fullWidth 
//                 label="Username" 
//                 value={selectedUser?.username || ''} 
//                 disabled 
//                 helperText="Username cannot be changed" 
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <InputLabel>User Type</InputLabel>
//                 <Select
//                   value={editForm.userType}
//                   label="User Type"
//                   onChange={(e) => setEditForm((prev) => ({ ...prev, userType: e.target.value }))}
//                 >
//                   <MenuItem value="User">User</MenuItem>
//                   <MenuItem value="Manager">Manager</MenuItem>
//                   <MenuItem value="Admin">Admin</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <InputLabel>Status</InputLabel>
//                 <Select
//                   value={editForm.isActive}
//                   label="Status"
//                   onChange={(e) => setEditForm((prev) => ({ ...prev, isActive: e.target.value }))}
//                 >
//                   <MenuItem value={true}>Active</MenuItem>
//                   <MenuItem value={false}>Inactive</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Full Name *"
//                 value={editForm.fullName}
//                 onChange={(e) => setEditForm((prev) => ({ ...prev, fullName: e.target.value }))}
//                 error={!!formErrors.edit.fullName}
//                 helperText={formErrors.edit.fullName}
//                 onBlur={() => validateEditForm()}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Email"
//                 type="email"
//                 value={editForm.email}
//                 onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
//                 error={!!formErrors.edit.email}
//                 helperText={formErrors.edit.email || 'Only Gmail addresses are allowed (optional)'}
//                 onBlur={() => validateEditForm()}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Phone"
//                 value={editForm.phone}
//                 onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))}
//                 error={!!formErrors.edit.phone}
//                 helperText={formErrors.edit.phone || 'Optional - Enter digits only (e.g., 1234567890)'}
//                 onBlur={() => validateEditForm()}
//               />
//             </Grid>
//             {/* Project Selection Dropdown for Edit */}
//             <Grid item xs={12}>
//               <FormControl fullWidth>
//                 <InputLabel>Assign to Project (Optional)</InputLabel>
//                 <Select
//                   value={editForm.projectName}
//                   label="Assign to Project (Optional)"
//                   onChange={(e) => setEditForm((prev) => ({ ...prev, projectName: e.target.value }))}
//                 >
//                   <MenuItem value="">No Project</MenuItem>
//                   {projectsLoading ? (
//                     <MenuItem disabled>Loading projects...</MenuItem>
//                   ) : projects.map((project) => (
//                     <MenuItem key={project.id} value={project.name}>
//                       {project.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => {
//             setOpenEditDialog(false);
//             setOriginalEditForm(null);
//           }}>
//             Cancel
//           </Button>
//           <Button
//             onClick={handleEditUser}
//             variant="contained"
//             disabled={updatingUser || isLoading || projectsLoading}
//             sx={{
//               backgroundColor: theme.palette.primary.main,
//               '&:hover': {
//                 backgroundColor: theme.palette.primary.dark
//               }
//             }}
//           >
//             {updatingUser ? <CircularProgress size={24} /> : 'Update User'}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Admin Reset Password Dialog */}
//       <Dialog
//         open={openResetPasswordDialog}
//         onClose={() => {
//           setOpenResetPasswordDialog(false);
//           resetResetPasswordForm();
//         }}
//         maxWidth="sm"
//         fullWidth
//         PaperProps={{
//           sx: {
//             borderRadius: '10px'
//           }
//         }}
//       >
//         <DialogTitle>
//           <Typography variant="h6" color="textDark" fontWeight={600}>
//             Reset Password for {selectedUser?.username}
//           </Typography>
//         </DialogTitle>
//         <DialogContent>
//           <Alert severity="info" sx={{ mb: 2 }}>
//             As an administrator, you can reset this user's password without knowing their current password.
//           </Alert>
//           <Grid container spacing={2} sx={{ mt: 1 }}>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="New Password *"
//                 type="password"
//                 value={resetPasswordForm.newPassword}
//                 onChange={(e) => setResetPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
//                 error={!!formErrors.resetPassword.newPassword}
//                 helperText={formErrors.resetPassword.newPassword || 'Password must be at least 6 characters long'}
//                 onBlur={() => validateResetPasswordForm()}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Confirm New Password *"
//                 type="password"
//                 value={resetPasswordForm.confirmNewPassword}
//                 onChange={(e) => setResetPasswordForm((prev) => ({ ...prev, confirmNewPassword: e.target.value }))}
//                 error={!!formErrors.resetPassword.confirmNewPassword}
//                 helperText={formErrors.resetPassword.confirmNewPassword}
//                 onBlur={() => validateResetPasswordForm()}
//               />
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => {
//             setOpenResetPasswordDialog(false);
//             resetResetPasswordForm();
//           }}>
//             Cancel
//           </Button>
//           <Button
//             onClick={handleResetPassword}
//             variant="contained"
//             disabled={resettingPassword || isLoading}
//             sx={{
//               backgroundColor: theme.palette.primary.main,
//               '&:hover': {
//                 backgroundColor: theme.palette.primary.dark
//               }
//             }}
//           >
//             {resettingPassword ? <CircularProgress size={24} /> : 'Reset Password'}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Snackbar for notifications */}
//       <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}>
//         <Alert onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))} severity={snackbar.severity}>
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default UserManagement;
