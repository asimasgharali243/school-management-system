// // // src/components/TargetFilterBuilder.jsx
// // import React, { useState, useEffect, useMemo } from 'react';
// // import {
// //     Box,
// //     FormControl,
// //     InputLabel,
// //     Select,
// //     MenuItem,
// //     Chip,
// //     TextField,
// //     Typography,
// //     Paper,
// //     Grid,
// //     CircularProgress,
// //     Alert,
// //     Autocomplete,
// //     Checkbox,
// //     ListItemText,
// //     FormControlLabel,
// //     Switch,
// //     InputAdornment,
// //     Accordion,
// //     AccordionSummary,
// //     AccordionDetails,
// // } from '@mui/material';
// // import {
// //     School as SchoolIcon,
// //     Group as GroupIcon,
// //     Person as PersonIcon,
// //     Category as CategoryIcon,
// //     Info as InfoIcon,
// //     ExpandMore as ExpandMoreIcon,
// //     ChildCare as ChildIcon,
// // } from '@mui/icons-material';

// // // Import your actual API hooks
// // import { useGetClassesQuery } from '../store/api/classApi';
// // import { useGetSectionsQuery } from '../store/api/sectionApi';
// // import { useGetCampusesQuery } from '../store/api/campusApi';
// // import { useGetUsersQuery } from '../store/api/usersApi';
// // import { useGetStudentsBySectionQuery } from '../store/api/studentApi';

// // const TargetFilterBuilder = ({ value, onChange, category = 'GENERAL', disabled = false, targetType = 'ALL' }) => {
// //     const [filterType, setFilterType] = useState('all');
// //     const [selectedClasses, setSelectedClasses] = useState([]);
// //     const [selectedSections, setSelectedSections] = useState([]);
// //     const [selectedCampuses, setSelectedCampuses] = useState([]);
// //     const [selectedUsers, setSelectedUsers] = useState([]);
// //     const [selectedStudents, setSelectedStudents] = useState([]);
// //     const [selectedClassForSections, setSelectedClassForSections] = useState(null);
// //     const [selectedSectionForStudents, setSelectedSectionForStudents] = useState(null);
// //     const [feeSettings, setFeeSettings] = useState({
// //         intervalDays: 3,
// //         minAmount: 0,
// //         maxDaysOverdue: 90,
// //         minDaysOverdue: 0,
// //         excludePartialPayments: false,
// //     });

// //     // Fetch data from your actual backend APIs
// //     const { data: classesData, isLoading: classesLoading } = useGetClassesQuery();
// //     const { data: sectionsData, isLoading: sectionsLoading } = useGetSectionsQuery();
// //     const { data: campusesData, isLoading: campusesLoading } = useGetCampusesQuery();
// //     const { data: usersData, isLoading: usersLoading } = useGetUsersQuery();
    
// //     // Fetch students based on selected section
// //     const { data: studentsData, isLoading: studentsLoading, refetch: refetchStudents, error: studentsError } = 
// //         useGetStudentsBySectionQuery(selectedSectionForStudents, { skip: !selectedSectionForStudents });

// //     // Extract data from API responses
// //     const classes = classesData?.data || classesData || [];
// //     const allSections = sectionsData?.data || sectionsData || [];
// //     const campuses = campusesData?.data || campusesData || [];
// //     const users = usersData?.data || usersData || [];
    
// //     // Handle students data correctly
// //     const students = studentsData?.data || studentsData || [];

// //     // Debug logs
// //     console.log('Students count:', students.length);
// //     if (students.length > 0) {
// //         console.log('Sample student:', students[0]);
// //         console.log('Sample student rollNo:', students[0]?.rollNo);
// //         console.log('All available fields in first student:', Object.keys(students[0]));
        
// //         // Find student with actual roll number
// //         const studentWithRollNo = students.find(s => s.rollNo > 0);
// //         if (studentWithRollNo) {
// //             console.log('Student WITH roll number:', studentWithRollNo);
// //             console.log('Roll number value:', studentWithRollNo.rollNo);
// //         }
// //     }

// //     // Create a map of class ID to class name for quick lookup
// //     const classMap = useMemo(() => {
// //         const map = new Map();
// //         classes.forEach(cls => {
// //             const id = cls.Class_ID || cls.class_ID;
// //             const name = cls.Class_Name || cls.class_Name;
// //             if (id && name) {
// //                 map.set(id, name);
// //             }
// //         });
// //         return map;
// //     }, [classes]);

// //     // Enhance sections with class name
// //     const sectionsWithClassName = useMemo(() => {
// //         return allSections.map(section => ({
// //             ...section,
// //             className: classMap.get(section.Class_ID || section.class_ID) || 'Unknown Class',
// //             displayName: `${section.Section || section.section} - ${classMap.get(section.Class_ID || section.class_ID) || 'Unknown Class'}`
// //         }));
// //     }, [allSections, classMap]);

// //     // Filter sections based on selected class
// //     const filteredSections = useMemo(() => {
// //         if (!selectedClassForSections) return [];
// //         return sectionsWithClassName.filter(s => (s.Class_ID || s.class_ID) === selectedClassForSections);
// //     }, [sectionsWithClassName, selectedClassForSections]);

// //     // Refetch students when section changes
// //     useEffect(() => {
// //         if (selectedSectionForStudents) {
// //             refetchStudents();
// //         }
// //     }, [selectedSectionForStudents, refetchStudents]);

// //     // Parse existing JSON value on load
// //     useEffect(() => {
// //         if (value && value !== '{}' && value !== 'null') {
// //             try {
// //                 const parsed = typeof value === 'string' ? JSON.parse(value) : value;
                
// //                 if (parsed.ClassID && Array.isArray(parsed.ClassID)) {
// //                     setFilterType('class');
// //                     setSelectedClasses(parsed.ClassID);
// //                 } else if (parsed.SectionID) {
// //                     setFilterType('section');
// //                     setSelectedSections(Array.isArray(parsed.SectionID) ? parsed.SectionID : [parsed.SectionID]);
// //                 } else if (parsed.StudentID && Array.isArray(parsed.StudentID)) {
// //                     setFilterType('specific_students');
// //                     setSelectedStudents(parsed.StudentID);
// //                 } else if (parsed.CampusID) {
// //                     setFilterType('campus');
// //                     setSelectedCampuses(Array.isArray(parsed.CampusID) ? parsed.CampusID : [parsed.CampusID]);
// //                 } else if (parsed.UserID && Array.isArray(parsed.UserID)) {
// //                     setFilterType('specific_users');
// //                     setSelectedUsers(parsed.UserID);
// //                 } else if (parsed.intervalDays) {
// //                     setFilterType('fee_settings');
// //                     setFeeSettings({
// //                         intervalDays: parsed.intervalDays || 3,
// //                         minAmount: parsed.minAmount || 0,
// //                         maxDaysOverdue: parsed.maxDaysOverdue || 90,
// //                         minDaysOverdue: parsed.minDaysOverdue || 0,
// //                         excludePartialPayments: parsed.excludePartialPayments || false,
// //                     });
// //                 }
// //             } catch (e) {
// //                 console.error('Error parsing target filter:', e);
// //             }
// //         }
// //     }, [value]);

// //     // Generate JSON and call onChange
// //     const updateFilter = (newFilter) => {
// //         const jsonString = JSON.stringify(newFilter);
// //         console.log('📤 Sending filter to parent:', jsonString);
// //         if (onChange) {
// //             onChange(jsonString);
// //         }
// //     };

// //     // Handle class selection
// //     const handleClassChange = (event, newValue) => {
// //         const classIds = newValue.map(item => item.Class_ID || item.class_ID);
// //         setSelectedClasses(classIds);
// //         updateFilter({ ClassID: classIds });
// //     };

// //     // Handle section selection
// //     const handleSectionChange = (event, newValue) => {
// //         const sectionIds = newValue.map(item => item.ID || item.id);
// //         setSelectedSections(sectionIds);
// //         const filterData = { SectionID: sectionIds.length === 1 ? sectionIds[0] : sectionIds };
// //         console.log('📤 Section filter data:', filterData);
// //         updateFilter(filterData);
// //     };

// //     // Handle student selection - FIXED to properly send StudentID
// //     const handleStudentChange = (event, newValue) => {
// //         const studentIds = newValue.map(item => item.Reg_Id || item.id);
// //         setSelectedStudents(studentIds);
        
// //         // Create filter object with SectionID and StudentID
// //         const filterObj = { 
// //             SectionID: selectedSections.length === 1 ? selectedSections[0] : selectedSections 
// //         };
        
// //         if (studentIds.length > 0) {
// //             filterObj.StudentID = studentIds;
// //         }
        
// //         console.log('📤 Student filter data (with StudentID):', filterObj);
// //         updateFilter(filterObj);
// //     };

// //     // Handle campus selection
// //     const handleCampusChange = (event, newValue) => {
// //         const campusIds = newValue.map(item => item.CampusID || item.id);
// //         setSelectedCampuses(campusIds);
// //         updateFilter({ CampusID: campusIds });
// //     };

// //     // Handle user selection
// //     const handleUserChange = (event, newValue) => {
// //         const userIds = newValue.map(item => item.ID || item.id);
// //         setSelectedUsers(userIds);
// //         updateFilter({ UserID: userIds });
// //     };

// //     // Handle fee settings change
// //     const handleFeeSettingChange = (field, value) => {
// //         const newSettings = { ...feeSettings, [field]: value };
// //         setFeeSettings(newSettings);
// //         updateFilter(newSettings);
// //     };

// //     // Helper function to get roll number from student object - FIXED for lowercase 'rollNo'
// //     const getStudentRollNo = (item) => {
// //         // API returns 'rollNo' (lowercase r, capital N)
// //         const rollNo = item?.rollNo || item?.RollNo || item?.roll_no || item?.Roll_No;
        
// //         // Check if rollNo exists AND is greater than 0 (since 0 means no roll number)
// //         if (rollNo && rollNo > 0 && rollNo !== null && rollNo !== undefined) {
// //             return rollNo;
// //         }
// //         return null;
// //     };

// //     // Get display names
// //     const getClassDisplay = (item) => {
// //         const id = item.Class_ID || item.class_ID;
// //         const name = item.Class_Name || item.class_Name || `Class ${id}`;
// //         return name;
// //     };

// //     const getSectionDisplay = (item) => {
// //         const id = item.ID || item.id;
// //         const name = item.Section || item.section || `Section ${id}`;
// //         const className = item.className || classMap.get(item.Class_ID || item.class_ID) || '';
// //         return className ? `${name} (${className})` : name;
// //     };

// //     // Improved student display with roll number - FIXED for lowercase 'rollNo'
// //     const getStudentDisplay = (item) => {
// //         const id = item.Reg_Id || item.id;
// //         const name = item.frist_Name || item.Frist_Name || item.name || `Student ${id || 'Unknown'}`;
// //         const rollNo = getStudentRollNo(item);
        
// //         return rollNo ? `${name} (Roll No: ${rollNo})` : name;
// //     };

// //     const getCampusDisplay = (item) => {
// //         const name = item.CampusName || item.campusName || `Campus ${item.CampusID || item.id}`;
// //         return name;
// //     };

// //     const getUserDisplay = (item) => {
// //         return item.Name || item.name || item.UserName || item.userName || `User ${item.ID || item.id}`;
// //     };

// //     // Get selected objects
// //     const getSelectedClassObjects = () => {
// //         return classes.filter(c => {
// //             const id = c.Class_ID || c.class_ID;
// //             return selectedClasses.includes(id);
// //         });
// //     };

// //     const getSelectedSectionObjects = () => {
// //         return sectionsWithClassName.filter(s => {
// //             const id = s.ID || s.id;
// //             return selectedSections.includes(id);
// //         });
// //     };

// //     const getSelectedStudentObjects = () => {
// //         return students.filter(s => {
// //             const id = s.Reg_Id || s.id;
// //             return id && selectedStudents.includes(id);
// //         });
// //     };

// //     const getSelectedCampusObjects = () => {
// //         return campuses.filter(c => {
// //             const id = c.CampusID || c.id;
// //             return selectedCampuses.includes(id);
// //         });
// //     };

// //     const getSelectedUserObjects = () => {
// //         return users.filter(u => {
// //             const id = u.ID || u.id;
// //             return selectedUsers.includes(id);
// //         });
// //     };

// //     // Simple target types
// //     if (targetType === 'ALL' || targetType === 'PARENTS' || targetType === 'TEACHERS' || targetType === 'STUDENTS') {
// //         return (
// //             <Alert severity="info" icon={<InfoIcon />}>
// //                 <Typography variant="body2">
// //                     {targetType === 'ALL' && 'Notifications will be sent to all users in the system.'}
// //                     {targetType === 'PARENTS' && 'Notifications will be sent to all parents only. The system automatically matches parents to their children via Family Code.'}
// //                     {targetType === 'TEACHERS' && 'Notifications will be sent to all teachers only.'}
// //                     {targetType === 'STUDENTS' && 'Notifications will be sent to all students only.'}
// //                 </Typography>
// //             </Alert>
// //         );
// //     }

// //     // Class selection
// //     if (targetType === 'CLASS') {
// //         return (
// //             <Box>
// //                 <Typography variant="subtitle2" gutterBottom>
// //                     <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
// //                     Select Classes
// //                 </Typography>
// //                 <Autocomplete
// //                     multiple
// //                     options={classes}
// //                     getOptionLabel={getClassDisplay}
// //                     value={getSelectedClassObjects()}
// //                     onChange={handleClassChange}
// //                     disabled={disabled || classesLoading}
// //                     loading={classesLoading}
// //                     isOptionEqualToValue={(option, value) => {
// //                         return (option.Class_ID || option.class_ID) === (value.Class_ID || value.class_ID);
// //                     }}
// //                     renderInput={(params) => (
// //                         <TextField
// //                             {...params}
// //                             placeholder="Search and select classes..."
// //                             variant="outlined"
// //                             InputProps={{
// //                                 ...params.InputProps,
// //                                 endAdornment: (
// //                                     <>
// //                                         {classesLoading ? <CircularProgress size={20} /> : null}
// //                                         {params.InputProps.endAdornment}
// //                                     </>
// //                                 ),
// //                             }}
// //                         />
// //                     )}
// //                     renderTags={(value, getTagProps) =>
// //                         value.map((option, index) => {
// //                             const optionId = option.Class_ID || option.class_ID;
// //                             const tagProps = getTagProps({ index });
// //                             const { key, ...restTagProps } = tagProps;
// //                             return (
// //                                 <Chip
// //                                     key={`selected-class-${optionId}`}
// //                                     label={getClassDisplay(option)}
// //                                     {...restTagProps}
// //                                     size="small"
// //                                     color="primary"
// //                                 />
// //                             );
// //                         })
// //                     }
// //                     renderOption={(props, option) => {
// //                         const optionId = option.Class_ID || option.class_ID;
// //                         return (
// //                             <li {...props} key={`class-option-${optionId}`}>
// //                                 <Checkbox checked={selectedClasses.includes(optionId)} />
// //                                 <ListItemText 
// //                                     primary={option.Class_Name || option.class_Name || `Class ${optionId}`}
// //                                     secondary={`ID: ${optionId}`}
// //                                 />
// //                             </li>
// //                         );
// //                     }}
// //                 />
// //                 {selectedClasses.length > 0 && (
// //                     <Alert severity="info" sx={{ mt: 2 }}>
// //                         <Typography variant="body2">
// //                             <strong>{selectedClasses.length}</strong> class(es) selected.
// //                         </Typography>
// //                     </Alert>
// //                 )}
// //             </Box>
// //         );
// //     }

// //     // Section selection with student selection
// //     if (targetType === 'SECTION') {
// //         const availableClassIds = [...new Set(allSections.map(s => s.Class_ID || s.class_ID).filter(Boolean))];
// //         const classOptions = classes.filter(c => availableClassIds.includes(c.Class_ID || c.class_ID));
// //         const selectedSectionObjects = getSelectedSectionObjects();

// //         return (
// //             <Box>
// //                 <Typography variant="subtitle2" gutterBottom>
// //                     <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
// //                     Select Class First, then Sections
// //                 </Typography>
                
// //                 <FormControl fullWidth size="small" sx={{ mb: 2 }}>
// //                     <InputLabel>Select Class</InputLabel>
// //                     <Select
// //                         value={selectedClassForSections || ''}
// //                         onChange={(e) => {
// //                             setSelectedClassForSections(e.target.value);
// //                             setSelectedSections([]);
// //                             setSelectedSectionForStudents(null);
// //                             setSelectedStudents([]);
// //                         }}
// //                         label="Select Class"
// //                         disabled={disabled}
// //                     >
// //                         <MenuItem value="">-- Select a class --</MenuItem>
// //                         {classOptions.map((cls) => {
// //                             const clsId = cls.Class_ID || cls.class_ID;
// //                             const clsName = cls.Class_Name || cls.class_Name;
// //                             return (
// //                                 <MenuItem key={clsId} value={clsId}>
// //                                     {clsName}
// //                                 </MenuItem>
// //                             );
// //                         })}
// //                     </Select>
// //                 </FormControl>

// //                 {selectedClassForSections && (
// //                     <>
// //                         <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
// //                             <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
// //                             Select Sections
// //                         </Typography>
// //                         <Autocomplete
// //                             multiple
// //                             options={filteredSections}
// //                             getOptionLabel={getSectionDisplay}
// //                             value={selectedSectionObjects}
// //                             onChange={handleSectionChange}
// //                             disabled={disabled}
// //                             isOptionEqualToValue={(option, value) => (option.ID || option.id) === (value.ID || value.id)}
// //                             renderInput={(params) => (
// //                                 <TextField
// //                                     {...params}
// //                                     placeholder="Search and select sections..."
// //                                     variant="outlined"
// //                                 />
// //                             )}
// //                             renderTags={(value, getTagProps) =>
// //                                 value.map((option, index) => {
// //                                     const optionId = option.ID || option.id;
// //                                     const tagProps = getTagProps({ index });
// //                                     const { key, ...restTagProps } = tagProps;
// //                                     return (
// //                                         <Chip
// //                                             key={`selected-section-${optionId}`}
// //                                             label={getSectionDisplay(option)}
// //                                             {...restTagProps}
// //                                             size="small"
// //                                             color="secondary"
// //                                         />
// //                                     );
// //                                 })
// //                             }
// //                             renderOption={(props, option) => {
// //                                 const optionId = option.ID || option.id;
// //                                 const className = classMap.get(option.Class_ID || option.class_ID) || 'Unknown Class';
// //                                 return (
// //                                     <li {...props} key={`section-option-${optionId}`}>
// //                                         <Checkbox checked={selectedSections.includes(optionId)} />
// //                                         <ListItemText 
// //                                             primary={`${option.Section || option.section || `Section ${optionId}`}`}
// //                                             secondary={`Class: ${className}`}
// //                                         />
// //                                     </li>
// //                                 );
// //                             }}
// //                         />

// //                         {/* Student Selection Accordion */}
// //                         {selectedSections.length > 0 && (
// //                             <Accordion sx={{ mt: 3, bgcolor: '#f9f9f9' }}>
// //                                 <AccordionSummary expandIcon={<ExpandMoreIcon />}>
// //                                     <Box display="flex" alignItems="center" gap={1}>
// //                                         <ChildIcon color="primary" />
// //                                         <Typography variant="subtitle1">
// //                                             Select Specific Students (Optional)
// //                                         </Typography>
// //                                         <Chip 
// //                                             label={`${selectedStudents.length} selected`} 
// //                                             size="small" 
// //                                             color={selectedStudents.length > 0 ? "primary" : "default"}
// //                                         />
// //                                     </Box>
// //                                 </AccordionSummary>
// //                                 <AccordionDetails>
// //                                     <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
// //                                         Select a section below, then choose specific students.
// //                                     </Typography>

// //                                     <FormControl fullWidth size="small" sx={{ mb: 3 }}>
// //                                         <InputLabel>Select Section to View Students</InputLabel>
// //                                         <Select
// //                                             value={selectedSectionForStudents || ''}
// //                                             onChange={(e) => {
// //                                                 setSelectedSectionForStudents(e.target.value);
// //                                                 setSelectedStudents([]);
// //                                             }}
// //                                             label="Select Section to View Students"
// //                                             disabled={disabled || selectedSections.length === 0}
// //                                         >
// //                                             <MenuItem value="">-- Select a section --</MenuItem>
// //                                             {selectedSectionObjects.map((sec) => {
// //                                                 const secId = sec.ID || sec.id;
// //                                                 return (
// //                                                     <MenuItem key={secId} value={secId}>
// //                                                         {getSectionDisplay(sec)}
// //                                                     </MenuItem>
// //                                                 );
// //                                             })}
// //                                         </Select>
// //                                     </FormControl>

// //                                     {selectedSectionForStudents && (
// //                                         <>
// //                                             {studentsLoading ? (
// //                                                 <Box display="flex" justifyContent="center" p={2}>
// //                                                     <CircularProgress size={30} />
// //                                                 </Box>
// //                                             ) : studentsError ? (
// //                                                 <Alert severity="error">
// //                                                     Error loading students: {studentsError.data?.message || studentsError.message}
// //                                                 </Alert>
// //                                             ) : students.length === 0 ? (
// //                                                 <Alert severity="info">
// //                                                     No students found in this section.
// //                                                 </Alert>
// //                                             ) : (
// //                                                 <Autocomplete
// //                                                     multiple
// //                                                     options={students}
// //                                                     getOptionLabel={getStudentDisplay}
// //                                                     value={getSelectedStudentObjects()}
// //                                                     onChange={handleStudentChange}
// //                                                     disabled={disabled}
// //                                                     isOptionEqualToValue={(option, value) => (option.Reg_Id || option.id) === (value.Reg_Id || value.id)}
// //                                                     renderInput={(params) => (
// //                                                         <TextField
// //                                                             {...params}
// //                                                             placeholder="Search and select students..."
// //                                                             variant="outlined"
// //                                                             helperText={`${students.length} students available`}
// //                                                         />
// //                                                     )}
// //                                                     renderTags={(value, getTagProps) =>
// //                                                         value.map((option, index) => {
// //                                                             const optionId = option.Reg_Id || option.id;
// //                                                             const tagProps = getTagProps({ index });
// //                                                             const { key, ...restTagProps } = tagProps;
// //                                                             const displayName = option.frist_Name || option.Frist_Name || option.name || `Student ${optionId}`;
// //                                                             const rollNo = getStudentRollNo(option);
// //                                                             const rollNoText = rollNo ? ` (${rollNo})` : '';
// //                                                             return (
// //                                                                 <Chip
// //                                                                     key={`selected-student-${optionId || index}`}
// //                                                                     label={`${displayName}${rollNoText}`}
// //                                                                     {...restTagProps}
// //                                                                     size="small"
// //                                                                     color="info"
// //                                                                 />
// //                                                             );
// //                                                         })
// //                                                     }
// //                                                     renderOption={(props, option) => {
// //                                                         const optionId = option.Reg_Id || option.id;
// //                                                         const name = option.frist_Name || option.Frist_Name || option.name || `Student ${optionId || 'Unknown'}`;
// //                                                         const rollNo = getStudentRollNo(option);
// //                                                         const rollNoText = (rollNo && rollNo > 0) ? `Roll No: ${rollNo}` : 'No Roll No';
// //                                                         const familyCode = option.Family_Code ? `Family: ${option.Family_Code}` : '';
// //                                                         return (
// //                                                             <li {...props} key={`student-option-${optionId || Math.random()}`}>
// //                                                                 <Checkbox checked={selectedStudents.includes(optionId)} />
// //                                                                 <ListItemText 
// //                                                                     primary={name}
// //                                                                     secondary={`${rollNoText} ${familyCode}`}
// //                                                                 />
// //                                                             </li>
// //                                                         );
// //                                                     }}
// //                                                 />
// //                                             )}
// //                                         </>
// //                                     )}

// //                                     {selectedStudents.length > 0 && (
// //                                         <Alert severity="success" sx={{ mt: 2 }}>
// //                                             <Typography variant="body2">
// //                                                 <strong>{selectedStudents.length}</strong> student(s) selected. Notifications will be sent to the parents of these specific students.
// //                                             </Typography>
// //                                         </Alert>
// //                                     )}
// //                                 </AccordionDetails>
// //                             </Accordion>
// //                         )}
// //                     </>
// //                 )}

// //                 {selectedSections.length > 0 && (
// //                     <Alert severity="info" sx={{ mt: 2 }}>
// //                         <Typography variant="body2">
// //                             <strong>{selectedSections.length}</strong> section(s) selected. 
// //                             {selectedStudents.length > 0 
// //                                 ? ` Additionally, ${selectedStudents.length} specific student(s) selected.`
// //                                 : ' You can also select specific students from the sections above.'}
// //                         </Typography>
// //                     </Alert>
// //                 )}
// //             </Box>
// //         );
// //     }

// //     // Specific users selection
// //     if (targetType === 'SPECIFIC_USERS') {
// //         return (
// //             <Box>
// //                 <Typography variant="subtitle2" gutterBottom>
// //                     <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
// //                     Select Specific Users
// //                 </Typography>
// //                 <Autocomplete
// //                     multiple
// //                     options={users}
// //                     getOptionLabel={getUserDisplay}
// //                     value={getSelectedUserObjects()}
// //                     onChange={handleUserChange}
// //                     disabled={disabled || usersLoading}
// //                     loading={usersLoading}
// //                     isOptionEqualToValue={(option, value) => (option.ID || option.id) === (value.ID || value.id)}
// //                     renderInput={(params) => (
// //                         <TextField
// //                             {...params}
// //                             placeholder="Search and select users..."
// //                             variant="outlined"
// //                         />
// //                     )}
// //                     renderTags={(value, getTagProps) =>
// //                         value.map((option, index) => {
// //                             const optionId = option.ID || option.id;
// //                             const tagProps = getTagProps({ index });
// //                             const { key, ...restTagProps } = tagProps;
// //                             return (
// //                                 <Chip
// //                                     key={`selected-user-${optionId}`}
// //                                     label={getUserDisplay(option)}
// //                                     {...restTagProps}
// //                                     size="small"
// //                                 />
// //                             );
// //                         })
// //                     }
// //                     renderOption={(props, option) => {
// //                         const optionId = option.ID || option.id;
// //                         return (
// //                             <li {...props} key={`user-option-${optionId}`}>
// //                                 <Checkbox checked={selectedUsers.includes(optionId)} />
// //                                 <ListItemText 
// //                                     primary={getUserDisplay(option)}
// //                                     secondary={option.Role?.Role || option.userType || option.Designation || 'User'}
// //                                 />
// //                             </li>
// //                         );
// //                     }}
// //                 />
// //             </Box>
// //         );
// //     }

// //     // Fee configuration
// //     if (category === 'FEE') {
// //         return (
// //             <Box>
// //                 <Typography variant="subtitle2" gutterBottom>
// //                     <CategoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
// //                     Fee Reminder Configuration
// //                 </Typography>
                
// //                 <Grid container spacing={2} sx={{ mt: 1 }}>
// //                     <Grid item xs={12} sm={6}>
// //                         <TextField
// //                             fullWidth
// //                             label="Reminder Interval (Days)"
// //                             type="number"
// //                             value={feeSettings.intervalDays}
// //                             onChange={(e) => handleFeeSettingChange('intervalDays', parseInt(e.target.value) || 3)}
// //                             helperText="How often to send reminders"
// //                             InputProps={{ 
// //                                 inputProps: { min: 1, max: 30 },
// //                                 endAdornment: <InputAdornment position="end">days</InputAdornment>
// //                             }}
// //                             disabled={disabled}
// //                             size="small"
// //                         />
// //                     </Grid>
                    
// //                     <Grid item xs={12} sm={6}>
// //                         <TextField
// //                             fullWidth
// //                             label="Minimum Due Amount"
// //                             type="number"
// //                             value={feeSettings.minAmount}
// //                             onChange={(e) => handleFeeSettingChange('minAmount', parseInt(e.target.value) || 0)}
// //                             helperText="Only remind if due amount is above this"
// //                             InputProps={{ 
// //                                 inputProps: { min: 0 },
// //                                 startAdornment: <InputAdornment position="start">Rs.</InputAdornment>
// //                             }}
// //                             disabled={disabled}
// //                             size="small"
// //                         />
// //                     </Grid>
                    
// //                     <Grid item xs={12} sm={6}>
// //                         <TextField
// //                             fullWidth
// //                             label="Minimum Days Overdue"
// //                             type="number"
// //                             value={feeSettings.minDaysOverdue}
// //                             onChange={(e) => handleFeeSettingChange('minDaysOverdue', parseInt(e.target.value) || 0)}
// //                             helperText="Remind only after this many days overdue"
// //                             InputProps={{ inputProps: { min: 0 } }}
// //                             disabled={disabled}
// //                             size="small"
// //                         />
// //                     </Grid>
                    
// //                     <Grid item xs={12} sm={6}>
// //                         <TextField
// //                             fullWidth
// //                             label="Maximum Days Overdue"
// //                             type="number"
// //                             value={feeSettings.maxDaysOverdue}
// //                             onChange={(e) => handleFeeSettingChange('maxDaysOverdue', parseInt(e.target.value) || 90)}
// //                             helperText="Stop reminding after this many days"
// //                             InputProps={{ inputProps: { min: 1, max: 365 } }}
// //                             disabled={disabled}
// //                             size="small"
// //                         />
// //                     </Grid>
                    
// //                     <Grid item xs={12}>
// //                         <FormControlLabel
// //                             control={
// //                                 <Switch
// //                                     checked={feeSettings.excludePartialPayments}
// //                                     onChange={(e) => handleFeeSettingChange('excludePartialPayments', e.target.checked)}
// //                                     disabled={disabled}
// //                                 />
// //                             }
// //                             label="Exclude Partial Payments"
// //                         />
// //                         <Typography variant="caption" color="text.secondary" display="block">
// //                             If checked, users who have made partial payments will not receive reminders
// //                         </Typography>
// //                     </Grid>
// //                 </Grid>

// //                 <Alert severity="info" sx={{ mt: 2 }}>
// //                     <Typography variant="body2">
// //                         Fee reminders will be sent every {feeSettings.intervalDays} days for dues above 
// //                         Rs.{feeSettings.minAmount.toLocaleString()} and will stop after {feeSettings.maxDaysOverdue} days overdue.
// //                     </Typography>
// //                 </Alert>
// //             </Box>
// //         );
// //     }

// //     return null;
// // };

// // export default TargetFilterBuilder;

// // // src/components/TargetFilterBuilder.jsx
// // import React, { useState, useEffect, useMemo } from 'react';
// // import {
// //     Box,
// //     FormControl,
// //     InputLabel,
// //     Select,
// //     MenuItem,
// //     Chip,
// //     TextField,
// //     Typography,
// //     Paper,
// //     Grid,
// //     CircularProgress,
// //     Alert,
// //     Autocomplete,
// //     Checkbox,
// //     ListItemText,
// //     FormControlLabel,
// //     Switch,
// //     InputAdornment,
// //     Accordion,
// //     AccordionSummary,
// //     AccordionDetails,
// // } from '@mui/material';
// // import {
// //     School as SchoolIcon,
// //     Group as GroupIcon,
// //     Person as PersonIcon,
// //     Category as CategoryIcon,
// //     Info as InfoIcon,
// //     ExpandMore as ExpandMoreIcon,
// //     ChildCare as ChildIcon,
// // } from '@mui/icons-material';

// // // Import your actual API hooks
// // import { useGetClassesQuery } from '../store/api/classApi';
// // import { useGetSectionsQuery } from '../store/api/sectionApi';
// // import { useGetCampusesQuery } from '../store/api/campusApi';
// // import { useGetUsersQuery } from '../store/api/usersApi';
// // import { useGetStudentsBySectionQuery } from '../store/api/studentApi';

// // const TargetFilterBuilder = ({ value, onChange, category = 'GENERAL', disabled = false, targetType = 'ALL' }) => {
// //     const [filterType, setFilterType] = useState('all');
// //     const [selectedClasses, setSelectedClasses] = useState([]);
// //     const [selectedSections, setSelectedSections] = useState([]);
// //     const [selectedCampuses, setSelectedCampuses] = useState([]);
// //     const [selectedUsers, setSelectedUsers] = useState([]);
// //     const [selectedStudents, setSelectedStudents] = useState([]);
// //     const [selectedClassForSections, setSelectedClassForSections] = useState(null);
// //     const [selectedSectionForStudents, setSelectedSectionForStudents] = useState(null);
// //     const [feeSettings, setFeeSettings] = useState({
// //         intervalDays: 3,
// //         minAmount: 0,
// //         maxDaysOverdue: 90,
// //         minDaysOverdue: 0,
// //         excludePartialPayments: false,
// //     });

// //     // Fetch data from your actual backend APIs
// //     const { data: classesData, isLoading: classesLoading } = useGetClassesQuery();
// //     const { data: sectionsData, isLoading: sectionsLoading } = useGetSectionsQuery();
// //     const { data: campusesData, isLoading: campusesLoading } = useGetCampusesQuery();
// //     const { data: usersData, isLoading: usersLoading } = useGetUsersQuery();
    
// //     // Fetch students based on selected section
// //     const { data: studentsData, isLoading: studentsLoading, refetch: refetchStudents, error: studentsError } = 
// //         useGetStudentsBySectionQuery(selectedSectionForStudents, { skip: !selectedSectionForStudents });

// //     // Extract data from API responses
// //     const classes = classesData?.data || classesData || [];
// //     const allSections = sectionsData?.data || sectionsData || [];
// //     const campuses = campusesData?.data || campusesData || [];
// //     const users = usersData?.data || usersData || [];
    
// //     // Handle students data correctly - FIXED: Use 'reg_Id' (lowercase r, uppercase I) from API
// //     const students = useMemo(() => {
// //         const rawStudents = studentsData?.data || studentsData || [];
// //         return rawStudents.map((student, index) => ({
// //             ...student,
// //             // Use the correct field name from API: 'reg_Id' (not 'Reg_Id')
// //             uniqueId: student?.reg_Id || student?.id || `temp_${index}`,
// //             // Also preserve the original for display
// //             studentId: student?.reg_Id || student?.id
// //         }));
// //     }, [studentsData]);

// //     // Debug log to verify student IDs
// //     useEffect(() => {
// //         if (students.length > 0) {
// //             console.log('✅ Students loaded with IDs:', students.slice(0, 5).map(s => ({
// //                 name: s.frist_Name,
// //                 reg_Id: s.reg_Id,
// //                 uniqueId: s.uniqueId
// //             })));
// //         }
// //     }, [students]);

// //     // Create a map of class ID to class name for quick lookup
// //     const classMap = useMemo(() => {
// //         const map = new Map();
// //         classes.forEach(cls => {
// //             const id = cls.Class_ID || cls.class_ID;
// //             const name = cls.Class_Name || cls.class_Name;
// //             if (id && name) {
// //                 map.set(id, name);
// //             }
// //         });
// //         return map;
// //     }, [classes]);

// //     // Enhance sections with class name
// //     const sectionsWithClassName = useMemo(() => {
// //         return allSections.map(section => ({
// //             ...section,
// //             className: classMap.get(section.Class_ID || section.class_ID) || 'Unknown Class',
// //             displayName: `${section.Section || section.section} - ${classMap.get(section.Class_ID || section.class_ID) || 'Unknown Class'}`
// //         }));
// //     }, [allSections, classMap]);

// //     // Filter sections based on selected class
// //     const filteredSections = useMemo(() => {
// //         if (!selectedClassForSections) return [];
// //         return sectionsWithClassName.filter(s => (s.Class_ID || s.class_ID) === selectedClassForSections);
// //     }, [sectionsWithClassName, selectedClassForSections]);

// //     // Refetch students when section changes
// //     useEffect(() => {
// //         if (selectedSectionForStudents) {
// //             refetchStudents();
// //         }
// //     }, [selectedSectionForStudents, refetchStudents]);

// //     // Parse existing JSON value on load
// //     useEffect(() => {
// //         if (value && value !== '{}' && value !== 'null') {
// //             try {
// //                 const parsed = typeof value === 'string' ? JSON.parse(value) : value;
                
// //                 if (parsed.ClassID && Array.isArray(parsed.ClassID)) {
// //                     setFilterType('class');
// //                     setSelectedClasses(parsed.ClassID);
// //                 } else if (parsed.SectionID) {
// //                     setFilterType('section');
// //                     setSelectedSections(Array.isArray(parsed.SectionID) ? parsed.SectionID : [parsed.SectionID]);
// //                 } else if (parsed.StudentID && Array.isArray(parsed.StudentID)) {
// //                     setFilterType('specific_students');
// //                     setSelectedStudents(parsed.StudentID);
// //                 } else if (parsed.CampusID) {
// //                     setFilterType('campus');
// //                     setSelectedCampuses(Array.isArray(parsed.CampusID) ? parsed.CampusID : [parsed.CampusID]);
// //                 } else if (parsed.UserID && Array.isArray(parsed.UserID)) {
// //                     setFilterType('specific_users');
// //                     setSelectedUsers(parsed.UserID);
// //                 } else if (parsed.intervalDays) {
// //                     setFilterType('fee_settings');
// //                     setFeeSettings({
// //                         intervalDays: parsed.intervalDays || 3,
// //                         minAmount: parsed.minAmount || 0,
// //                         maxDaysOverdue: parsed.maxDaysOverdue || 90,
// //                         minDaysOverdue: parsed.minDaysOverdue || 0,
// //                         excludePartialPayments: parsed.excludePartialPayments || false,
// //                     });
// //                 }
// //             } catch (e) {
// //                 console.error('Error parsing target filter:', e);
// //             }
// //         }
// //     }, [value]);

// //     // Generate JSON and call onChange
// //     const updateFilter = (newFilter) => {
// //         const jsonString = JSON.stringify(newFilter);
// //         console.log('📤 Sending filter to parent:', jsonString);
// //         if (onChange) {
// //             onChange(jsonString);
// //         }
// //     };

// //     // Handle class selection
// //     const handleClassChange = (event, newValue) => {
// //         const classIds = newValue.map(item => item.Class_ID || item.class_ID);
// //         setSelectedClasses(classIds);
// //         updateFilter({ ClassID: classIds });
// //     };

// //     // Handle section selection
// //     const handleSectionChange = (event, newValue) => {
// //         const sectionIds = newValue.map(item => item.ID || item.id);
// //         setSelectedSections(sectionIds);
// //         const filterData = { SectionID: sectionIds.length === 1 ? sectionIds[0] : sectionIds };
// //         console.log('📤 Section filter data:', filterData);
// //         updateFilter(filterData);
// //     };

// //     // Handle student selection - FIXED: Use 'reg_Id' from API
// //     const handleStudentChange = (event, newValue) => {
// //         const studentIds = newValue.map(item => item.reg_Id || item.id);
// //         setSelectedStudents(studentIds);
        
// //         // Create filter object with SectionID and StudentID
// //         const filterObj = { 
// //             SectionID: selectedSections.length === 1 ? selectedSections[0] : selectedSections 
// //         };
        
// //         if (studentIds.length > 0) {
// //             filterObj.StudentID = studentIds;
// //         }
        
// //         console.log('📤 Student filter data (with StudentID):', filterObj);
// //         updateFilter(filterObj);
// //     };

// //     // Handle campus selection
// //     const handleCampusChange = (event, newValue) => {
// //         const campusIds = newValue.map(item => item.CampusID || item.id);
// //         setSelectedCampuses(campusIds);
// //         updateFilter({ CampusID: campusIds });
// //     };

// //     // Handle user selection
// //     const handleUserChange = (event, newValue) => {
// //         const userIds = newValue.map(item => item.ID || item.id);
// //         setSelectedUsers(userIds);
// //         updateFilter({ UserID: userIds });
// //     };

// //     // Handle fee settings change
// //     const handleFeeSettingChange = (field, value) => {
// //         const newSettings = { ...feeSettings, [field]: value };
// //         setFeeSettings(newSettings);
// //         updateFilter(newSettings);
// //     };

// //     // Helper function to get roll number from student object
// //     const getStudentRollNo = (item) => {
// //         const rollNo = item?.rollNo || item?.RollNo || item?.roll_no || item?.Roll_No;
        
// //         if (rollNo && rollNo > 0 && rollNo !== null && rollNo !== undefined) {
// //             return rollNo;
// //         }
// //         return null;
// //     };

// //     // Get display names
// //     const getClassDisplay = (item) => {
// //         const id = item.Class_ID || item.class_ID;
// //         const name = item.Class_Name || item.class_Name || `Class ${id}`;
// //         return name;
// //     };

// //     const getSectionDisplay = (item) => {
// //         const id = item.ID || item.id;
// //         const name = item.Section || item.section || `Section ${id}`;
// //         const className = item.className || classMap.get(item.Class_ID || item.class_ID) || '';
// //         return className ? `${name} (${className})` : name;
// //     };

// //     // FIXED: Use correct field name 'frist_Name' (typo from API) and 'reg_Id'
// //     const getStudentDisplay = (item) => {
// //         const id = item.reg_Id || item.id;
// //         const name = item.frist_Name || item.Frist_Name || item.name || `Student ${id || 'Unknown'}`;
// //         const rollNo = getStudentRollNo(item);
        
// //         return rollNo ? `${name} (Roll No: ${rollNo})` : name;
// //     };

// //     const getCampusDisplay = (item) => {
// //         const name = item.CampusName || item.campusName || `Campus ${item.CampusID || item.id}`;
// //         return name;
// //     };

// //     const getUserDisplay = (item) => {
// //         return item.Name || item.name || item.UserName || item.userName || `User ${item.ID || item.id}`;
// //     };

// //     // Get selected objects - FIXED: Use 'reg_Id'
// //     const getSelectedClassObjects = () => {
// //         return classes.filter(c => {
// //             const id = c.Class_ID || c.class_ID;
// //             return selectedClasses.includes(id);
// //         });
// //     };

// //     const getSelectedSectionObjects = () => {
// //         return sectionsWithClassName.filter(s => {
// //             const id = s.ID || s.id;
// //             return selectedSections.includes(id);
// //         });
// //     };

// //     const getSelectedStudentObjects = () => {
// //         if (!students || students.length === 0) return [];
        
// //         return students.filter(s => {
// //             const id = s?.reg_Id || s?.id;
// //             return id && selectedStudents.includes(id);
// //         });
// //     };

// //     const getSelectedCampusObjects = () => {
// //         return campuses.filter(c => {
// //             const id = c.CampusID || c.id;
// //             return selectedCampuses.includes(id);
// //         });
// //     };

// //     const getSelectedUserObjects = () => {
// //         return users.filter(u => {
// //             const id = u.ID || u.id;
// //             return selectedUsers.includes(id);
// //         });
// //     };

// //     // Simple target types
// //     if (targetType === 'ALL' || targetType === 'PARENTS' || targetType === 'TEACHERS' || targetType === 'STUDENTS') {
// //         return (
// //             <Alert severity="info" icon={<InfoIcon />}>
// //                 <Typography variant="body2">
// //                     {targetType === 'ALL' && 'Notifications will be sent to all users in the system.'}
// //                     {targetType === 'PARENTS' && 'Notifications will be sent to all parents only. The system automatically matches parents to their children via Family Code.'}
// //                     {targetType === 'TEACHERS' && 'Notifications will be sent to all teachers only.'}
// //                     {targetType === 'STUDENTS' && 'Notifications will be sent to all students only.'}
// //                 </Typography>
// //             </Alert>
// //         );
// //     }

// //     // Class selection
// //     if (targetType === 'CLASS') {
// //         return (
// //             <Box>
// //                 <Typography variant="subtitle2" gutterBottom>
// //                     <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
// //                     Select Classes
// //                 </Typography>
// //                 <Autocomplete
// //                     multiple
// //                     options={classes}
// //                     getOptionLabel={getClassDisplay}
// //                     value={getSelectedClassObjects()}
// //                     onChange={handleClassChange}
// //                     disabled={disabled || classesLoading}
// //                     loading={classesLoading}
// //                     disableCloseOnSelect
// //                     isOptionEqualToValue={(option, value) => {
// //                         return (option.Class_ID || option.class_ID) === (value.Class_ID || value.class_ID);
// //                     }}
// //                     renderInput={(params) => (
// //                         <TextField
// //                             {...params}
// //                             placeholder="Search and select classes..."
// //                             variant="outlined"
// //                             InputProps={{
// //                                 ...params.InputProps,
// //                                 endAdornment: (
// //                                     <>
// //                                         {classesLoading ? <CircularProgress size={20} /> : null}
// //                                         {params.InputProps.endAdornment}
// //                                     </>
// //                                 ),
// //                             }}
// //                         />
// //                     )}
// //                     renderTags={(value, getTagProps) =>
// //                         value.map((option, index) => {
// //                             const optionId = option.Class_ID || option.class_ID;
// //                             const tagProps = getTagProps({ index });
// //                             const { key, ...restTagProps } = tagProps;
// //                             return (
// //                                 <Chip
// //                                     key={`selected-class-${optionId}`}
// //                                     label={getClassDisplay(option)}
// //                                     {...restTagProps}
// //                                     size="small"
// //                                     color="primary"
// //                                 />
// //                             );
// //                         })
// //                     }
// //                     renderOption={(props, option) => {
// //                         const optionId = option.Class_ID || option.class_ID;
// //                         return (
// //                             <li {...props} key={`class-option-${optionId}`}>
// //                                 <Checkbox checked={selectedClasses.includes(optionId)} />
// //                                 <ListItemText 
// //                                     primary={option.Class_Name || option.class_Name || `Class ${optionId}`}
// //                                     secondary={`ID: ${optionId}`}
// //                                 />
// //                             </li>
// //                         );
// //                     }}
// //                 />
// //                 {selectedClasses.length > 0 && (
// //                     <Alert severity="info" sx={{ mt: 2 }}>
// //                         <Typography variant="body2">
// //                             <strong>{selectedClasses.length}</strong> class(es) selected.
// //                         </Typography>
// //                     </Alert>
// //                 )}
// //             </Box>
// //         );
// //     }

// //     // Section selection with student selection - FIXED
// //     if (targetType === 'SECTION') {
// //         const availableClassIds = [...new Set(allSections.map(s => s.Class_ID || s.class_ID).filter(Boolean))];
// //         const classOptions = classes.filter(c => availableClassIds.includes(c.Class_ID || c.class_ID));
// //         const selectedSectionObjects = getSelectedSectionObjects();

// //         return (
// //             <Box>
// //                 <Typography variant="subtitle2" gutterBottom>
// //                     <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
// //                     Select Class First, then Sections
// //                 </Typography>
                
// //                 <FormControl fullWidth size="small" sx={{ mb: 2 }}>
// //                     <InputLabel>Select Class</InputLabel>
// //                     <Select
// //                         value={selectedClassForSections || ''}
// //                         onChange={(e) => {
// //                             setSelectedClassForSections(e.target.value);
// //                             setSelectedSections([]);
// //                             setSelectedSectionForStudents(null);
// //                             setSelectedStudents([]);
// //                         }}
// //                         label="Select Class"
// //                         disabled={disabled}
// //                     >
// //                         <MenuItem value="">-- Select a class --</MenuItem>
// //                         {classOptions.map((cls) => {
// //                             const clsId = cls.Class_ID || cls.class_ID;
// //                             const clsName = cls.Class_Name || cls.class_Name;
// //                             return (
// //                                 <MenuItem key={clsId} value={clsId}>
// //                                     {clsName}
// //                                 </MenuItem>
// //                             );
// //                         })}
// //                     </Select>
// //                 </FormControl>

// //                 {selectedClassForSections && (
// //                     <>
// //                         <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
// //                             <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
// //                             Select Sections
// //                         </Typography>
// //                         <Autocomplete
// //                             multiple
// //                             options={filteredSections}
// //                             getOptionLabel={getSectionDisplay}
// //                             value={selectedSectionObjects}
// //                             onChange={handleSectionChange}
// //                             disabled={disabled}
// //                             disableCloseOnSelect
// //                             isOptionEqualToValue={(option, value) => (option.ID || option.id) === (value.ID || value.id)}
// //                             renderInput={(params) => (
// //                                 <TextField
// //                                     {...params}
// //                                     placeholder="Search and select sections..."
// //                                     variant="outlined"
// //                                 />
// //                             )}
// //                             renderTags={(value, getTagProps) =>
// //                                 value.map((option, index) => {
// //                                     const optionId = option.ID || option.id;
// //                                     const tagProps = getTagProps({ index });
// //                                     const { key, ...restTagProps } = tagProps;
// //                                     return (
// //                                         <Chip
// //                                             key={`selected-section-${optionId}`}
// //                                             label={getSectionDisplay(option)}
// //                                             {...restTagProps}
// //                                             size="small"
// //                                             color="secondary"
// //                                         />
// //                                     );
// //                                 })
// //                             }
// //                             renderOption={(props, option) => {
// //                                 const optionId = option.ID || option.id;
// //                                 const className = classMap.get(option.Class_ID || option.class_ID) || 'Unknown Class';
// //                                 return (
// //                                     <li {...props} key={`section-option-${optionId}`}>
// //                                         <Checkbox checked={selectedSections.includes(optionId)} />
// //                                         <ListItemText 
// //                                             primary={`${option.Section || option.section || `Section ${optionId}`}`}
// //                                             secondary={`Class: ${className}`}
// //                                         />
// //                                     </li>
// //                                 );
// //                             }}
// //                         />

// //                         {/* Student Selection Accordion - FIXED */}
// //                         {selectedSections.length > 0 && (
// //                             <Accordion sx={{ mt: 3, bgcolor: '#f9f9f9' }}>
// //                                 <AccordionSummary expandIcon={<ExpandMoreIcon />}>
// //                                     <Box display="flex" alignItems="center" gap={1}>
// //                                         <ChildIcon color="primary" />
// //                                         <Typography variant="subtitle1">
// //                                             Select Specific Students (Optional)
// //                                         </Typography>
// //                                         <Chip 
// //                                             label={`${selectedStudents.length} selected`} 
// //                                             size="small" 
// //                                             color={selectedStudents.length > 0 ? "primary" : "default"}
// //                                         />
// //                                     </Box>
// //                                 </AccordionSummary>
// //                                 <AccordionDetails>
// //                                     <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
// //                                         Select a section below, then choose specific students.
// //                                     </Typography>

// //                                     <FormControl fullWidth size="small" sx={{ mb: 3 }}>
// //                                         <InputLabel>Select Section to View Students</InputLabel>
// //                                         <Select
// //                                             value={selectedSectionForStudents || ''}
// //                                             onChange={(e) => {
// //                                                 setSelectedSectionForStudents(e.target.value);
// //                                                 setSelectedStudents([]);
// //                                             }}
// //                                             label="Select Section to View Students"
// //                                             disabled={disabled || selectedSections.length === 0}
// //                                         >
// //                                             <MenuItem value="">-- Select a section --</MenuItem>
// //                                             {selectedSectionObjects.map((sec) => {
// //                                                 const secId = sec.ID || sec.id;
// //                                                 return (
// //                                                     <MenuItem key={secId} value={secId}>
// //                                                         {getSectionDisplay(sec)}
// //                                                     </MenuItem>
// //                                                 );
// //                                             })}
// //                                         </Select>
// //                                     </FormControl>

// //                                     {selectedSectionForStudents && (
// //                                         <>
// //                                             {studentsLoading ? (
// //                                                 <Box display="flex" justifyContent="center" p={2}>
// //                                                     <CircularProgress size={30} />
// //                                                 </Box>
// //                                             ) : studentsError ? (
// //                                                 <Alert severity="error">
// //                                                     Error loading students: {studentsError.data?.message || studentsError.message}
// //                                                 </Alert>
// //                                             ) : students.length === 0 ? (
// //                                                 <Alert severity="info">
// //                                                     No students found in this section.
// //                                                 </Alert>
// //                                             ) : (
// //                                                 <Autocomplete
// //                                                     multiple
// //                                                     options={students}
// //                                                     getOptionLabel={getStudentDisplay}
// //                                                     value={getSelectedStudentObjects()}
// //                                                     onChange={handleStudentChange}
// //                                                     disabled={disabled}
// //                                                     disableCloseOnSelect
// //                                                     // FIXED: Use 'reg_Id' for comparison
// //                                                     isOptionEqualToValue={(option, value) => {
// //                                                         const optionId = option?.reg_Id || option?.id;
// //                                                         const valueId = value?.reg_Id || value?.id;
// //                                                         return optionId === valueId;
// //                                                     }}
// //                                                     // FIXED: Use 'reg_Id' for unique key
// //                                                     getOptionKey={(option) => {
// //                                                         const optionId = option?.reg_Id || option?.id;
// //                                                         return `student-${optionId}`;
// //                                                     }}
// //                                                     renderInput={(params) => (
// //                                                         <TextField
// //                                                             {...params}
// //                                                             placeholder="Search and select students..."
// //                                                             variant="outlined"
// //                                                             helperText={`${students.length} students available`}
// //                                                         />
// //                                                     )}
// //                                                     renderTags={(value, getTagProps) =>
// //                                                         value.map((option, index) => {
// //                                                             const optionId = option?.reg_Id || option?.id;
// //                                                             const tagProps = getTagProps({ index });
// //                                                             const { key, ...restTagProps } = tagProps;
// //                                                             const displayName = option.frist_Name || option.Frist_Name || option.name || `Student ${optionId}`;
// //                                                             const rollNo = getStudentRollNo(option);
// //                                                             const rollNoText = rollNo ? ` (${rollNo})` : '';
// //                                                             return (
// //                                                                 <Chip
// //                                                                     key={`selected-student-${optionId || index}`}
// //                                                                     label={`${displayName}${rollNoText}`}
// //                                                                     {...restTagProps}
// //                                                                     size="small"
// //                                                                     color="info"
// //                                                                 />
// //                                                             );
// //                                                         })
// //                                                     }
// //                                                     renderOption={(props, option) => {
// //                                                         const optionId = option?.reg_Id || option?.id;
// //                                                         const name = option.frist_Name || option.Frist_Name || option.name || `Student ${optionId || 'Unknown'}`;
// //                                                         const rollNo = getStudentRollNo(option);
// //                                                         const rollNoText = (rollNo && rollNo > 0) ? `Roll No: ${rollNo}` : 'No Roll No';
// //                                                         const familyCode = option.Family_Code ? `Family: ${option.Family_Code}` : '';
// //                                                         const isSelected = selectedStudents.includes(optionId);
// //                                                         return (
// //                                                             <li {...props} key={`student-option-${optionId}`}>
// //                                                                 <Checkbox checked={isSelected} />
// //                                                                 <ListItemText 
// //                                                                     primary={name}
// //                                                                     secondary={`${rollNoText} ${familyCode}`}
// //                                                                 />
// //                                                             </li>
// //                                                         );
// //                                                     }}
// //                                                 />
// //                                             )}
// //                                         </>
// //                                     )}

// //                                     {selectedStudents.length > 0 && (
// //                                         <Alert severity="success" sx={{ mt: 2 }}>
// //                                             <Typography variant="body2">
// //                                                 <strong>{selectedStudents.length}</strong> student(s) selected. Notifications will be sent to the parents of these specific students.
// //                                             </Typography>
// //                                         </Alert>
// //                                     )}
// //                                 </AccordionDetails>
// //                             </Accordion>
// //                         )}
// //                     </>
// //                 )}

// //                 {selectedSections.length > 0 && (
// //                     <Alert severity="info" sx={{ mt: 2 }}>
// //                         <Typography variant="body2">
// //                             <strong>{selectedSections.length}</strong> section(s) selected. 
// //                             {selectedStudents.length > 0 
// //                                 ? ` Additionally, ${selectedStudents.length} specific student(s) selected.`
// //                                 : ' You can also select specific students from the sections above.'}
// //                         </Typography>
// //                     </Alert>
// //                 )}
// //             </Box>
// //         );
// //     }

// //     // Specific users selection
// //     if (targetType === 'SPECIFIC_USERS') {
// //         return (
// //             <Box>
// //                 <Typography variant="subtitle2" gutterBottom>
// //                     <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
// //                     Select Specific Users
// //                 </Typography>
// //                 <Autocomplete
// //                     multiple
// //                     options={users}
// //                     getOptionLabel={getUserDisplay}
// //                     value={getSelectedUserObjects()}
// //                     onChange={handleUserChange}
// //                     disabled={disabled || usersLoading}
// //                     loading={usersLoading}
// //                     disableCloseOnSelect
// //                     isOptionEqualToValue={(option, value) => (option.ID || option.id) === (value.ID || value.id)}
// //                     renderInput={(params) => (
// //                         <TextField
// //                             {...params}
// //                             placeholder="Search and select users..."
// //                             variant="outlined"
// //                         />
// //                     )}
// //                     renderTags={(value, getTagProps) =>
// //                         value.map((option, index) => {
// //                             const optionId = option.ID || option.id;
// //                             const tagProps = getTagProps({ index });
// //                             const { key, ...restTagProps } = tagProps;
// //                             return (
// //                                 <Chip
// //                                     key={`selected-user-${optionId}`}
// //                                     label={getUserDisplay(option)}
// //                                     {...restTagProps}
// //                                     size="small"
// //                                 />
// //                             );
// //                         })
// //                     }
// //                     renderOption={(props, option) => {
// //                         const optionId = option.ID || option.id;
// //                         return (
// //                             <li {...props} key={`user-option-${optionId}`}>
// //                                 <Checkbox checked={selectedUsers.includes(optionId)} />
// //                                 <ListItemText 
// //                                     primary={getUserDisplay(option)}
// //                                     secondary={option.Role?.Role || option.userType || option.Designation || 'User'}
// //                                 />
// //                             </li>
// //                         );
// //                     }}
// //                 />
// //             </Box>
// //         );
// //     }

// //     // Fee configuration
// //     if (category === 'FEE') {
// //         return (
// //             <Box>
// //                 <Typography variant="subtitle2" gutterBottom>
// //                     <CategoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
// //                     Fee Reminder Configuration
// //                 </Typography>
                
// //                 <Grid container spacing={2} sx={{ mt: 1 }}>
// //                     <Grid item xs={12} sm={6}>
// //                         <TextField
// //                             fullWidth
// //                             label="Reminder Interval (Days)"
// //                             type="number"
// //                             value={feeSettings.intervalDays}
// //                             onChange={(e) => handleFeeSettingChange('intervalDays', parseInt(e.target.value) || 3)}
// //                             helperText="How often to send reminders"
// //                             InputProps={{ 
// //                                 inputProps: { min: 1, max: 30 },
// //                                 endAdornment: <InputAdornment position="end">days</InputAdornment>
// //                             }}
// //                             disabled={disabled}
// //                             size="small"
// //                         />
// //                     </Grid>
                    
// //                     <Grid item xs={12} sm={6}>
// //                         <TextField
// //                             fullWidth
// //                             label="Minimum Due Amount"
// //                             type="number"
// //                             value={feeSettings.minAmount}
// //                             onChange={(e) => handleFeeSettingChange('minAmount', parseInt(e.target.value) || 0)}
// //                             helperText="Only remind if due amount is above this"
// //                             InputProps={{ 
// //                                 inputProps: { min: 0 },
// //                                 startAdornment: <InputAdornment position="start">Rs.</InputAdornment>
// //                             }}
// //                             disabled={disabled}
// //                             size="small"
// //                         />
// //                     </Grid>
                    
// //                     <Grid item xs={12} sm={6}>
// //                         <TextField
// //                             fullWidth
// //                             label="Minimum Days Overdue"
// //                             type="number"
// //                             value={feeSettings.minDaysOverdue}
// //                             onChange={(e) => handleFeeSettingChange('minDaysOverdue', parseInt(e.target.value) || 0)}
// //                             helperText="Remind only after this many days overdue"
// //                             InputProps={{ inputProps: { min: 0 } }}
// //                             disabled={disabled}
// //                             size="small"
// //                         />
// //                     </Grid>
                    
// //                     <Grid item xs={12} sm={6}>
// //                         <TextField
// //                             fullWidth
// //                             label="Maximum Days Overdue"
// //                             type="number"
// //                             value={feeSettings.maxDaysOverdue}
// //                             onChange={(e) => handleFeeSettingChange('maxDaysOverdue', parseInt(e.target.value) || 90)}
// //                             helperText="Stop reminding after this many days"
// //                             InputProps={{ inputProps: { min: 1, max: 365 } }}
// //                             disabled={disabled}
// //                             size="small"
// //                         />
// //                     </Grid>
                    
// //                     <Grid item xs={12}>
// //                         <FormControlLabel
// //                             control={
// //                                 <Switch
// //                                     checked={feeSettings.excludePartialPayments}
// //                                     onChange={(e) => handleFeeSettingChange('excludePartialPayments', e.target.checked)}
// //                                     disabled={disabled}
// //                                 />
// //                             }
// //                             label="Exclude Partial Payments"
// //                         />
// //                         <Typography variant="caption" color="text.secondary" display="block">
// //                             If checked, users who have made partial payments will not receive reminders
// //                         </Typography>
// //                     </Grid>
// //                 </Grid>

// //                 <Alert severity="info" sx={{ mt: 2 }}>
// //                     <Typography variant="body2">
// //                         Fee reminders will be sent every {feeSettings.intervalDays} days for dues above 
// //                         Rs.{feeSettings.minAmount.toLocaleString()} and will stop after {feeSettings.maxDaysOverdue} days overdue.
// //                     </Typography>
// //                 </Alert>
// //             </Box>
// //         );
// //     }

// //     return null;
// // };

// // export default TargetFilterBuilder;


// // src/components/TargetFilterBuilder.jsx
// import React, { useState, useEffect, useMemo } from 'react';
// import {
//     Box,
//     FormControl,
//     InputLabel,
//     Select,
//     MenuItem,
//     Chip,
//     TextField,
//     Typography,
//     Paper,
//     Grid,
//     CircularProgress,
//     Alert,
//     Autocomplete,
//     Checkbox,
//     ListItemText,
//     FormControlLabel,
//     Switch,
//     InputAdornment,
//     Accordion,
//     AccordionSummary,
//     AccordionDetails,
// } from '@mui/material';
// import {
//     School as SchoolIcon,
//     Group as GroupIcon,
//     Person as PersonIcon,
//     Category as CategoryIcon,
//     Info as InfoIcon,
//     ExpandMore as ExpandMoreIcon,
//     ChildCare as ChildIcon,
// } from '@mui/icons-material';

// // Import your actual API hooks
// import { useGetClassesQuery } from '../store/api/classApi';
// import { useGetSectionsQuery } from '../store/api/sectionApi';
// import { useGetCampusesQuery } from '../store/api/campusApi';
// import { useGetUsersQuery } from '../store/api/usersApi';
// import { useGetStudentsBySectionQuery } from '../store/api/studentApi';

// const TargetFilterBuilder = ({ value, onChange, category = 'GENERAL', disabled = false, targetType = 'ALL' }) => {
//     const [filterType, setFilterType] = useState('all');
//     const [selectedClasses, setSelectedClasses] = useState([]);
//     const [selectedSections, setSelectedSections] = useState([]);
//     const [selectedCampuses, setSelectedCampuses] = useState([]);
//     const [selectedUsers, setSelectedUsers] = useState([]);
    
//     // Store sections with their class ID and students
//     const [selectedSectionsData, setSelectedSectionsData] = useState([]);
//     const [selectedStudentsPerSection, setSelectedStudentsPerSection] = useState({});
//     const [selectedClassForSections, setSelectedClassForSections] = useState(null);
//     const [selectedSectionForStudents, setSelectedSectionForStudents] = useState(null);
//     const [feeSettings, setFeeSettings] = useState({
//         intervalDays: 3,
//         minAmount: 0,
//         maxDaysOverdue: 90,
//         minDaysOverdue: 0,
//         excludePartialPayments: false,
//     });

//     // Fetch data from your actual backend APIs
//     const { data: classesData, isLoading: classesLoading } = useGetClassesQuery();
//     const { data: sectionsData, isLoading: sectionsLoading } = useGetSectionsQuery();
//     const { data: campusesData, isLoading: campusesLoading } = useGetCampusesQuery();
//     const { data: usersData, isLoading: usersLoading } = useGetUsersQuery();
    
//     // Fetch students based on selected section
//     const { data: studentsData, isLoading: studentsLoading, refetch: refetchStudents, error: studentsError } = 
//         useGetStudentsBySectionQuery(selectedSectionForStudents, { skip: !selectedSectionForStudents });

//     // Extract data from API responses
//     const classes = classesData?.data || classesData || [];
//     const allSections = sectionsData?.data || sectionsData || [];
//     const campuses = campusesData?.data || campusesData || [];
//     const users = usersData?.data || usersData || [];
    
//     // Handle students data correctly
//     const students = useMemo(() => {
//         const rawStudents = studentsData?.data || studentsData || [];
//         return rawStudents.map((student, index) => ({
//             ...student,
//             uniqueId: student?.reg_Id || student?.id || `temp_${index}`,
//             studentId: student?.reg_Id || student?.id
//         }));
//     }, [studentsData]);

//     // Create a map of class ID to class name for quick lookup
//     const classMap = useMemo(() => {
//         const map = new Map();
//         classes.forEach(cls => {
//             const id = cls.Class_ID || cls.class_ID;
//             const name = cls.Class_Name || cls.class_Name;
//             if (id && name) {
//                 map.set(id, name);
//             }
//         });
//         return map;
//     }, [classes]);

//     // Enhance sections with class name
//     const sectionsWithClassName = useMemo(() => {
//         return allSections.map(section => ({
//             ...section,
//             className: classMap.get(section.Class_ID || section.class_ID) || 'Unknown Class',
//             displayName: `${section.Section || section.section} - ${classMap.get(section.Class_ID || section.class_ID) || 'Unknown Class'}`
//         }));
//     }, [allSections, classMap]);

//     // Filter sections based on selected class
//     const filteredSections = useMemo(() => {
//         if (!selectedClassForSections) return [];
//         return sectionsWithClassName.filter(s => (s.Class_ID || s.class_ID) === selectedClassForSections);
//     }, [sectionsWithClassName, selectedClassForSections]);

//     // Refetch students when section changes
//     useEffect(() => {
//         if (selectedSectionForStudents) {
//             refetchStudents();
//         }
//     }, [selectedSectionForStudents, refetchStudents]);

//     // Parse existing JSON value on load - Handle sections with class ID
//     useEffect(() => {
//         if (value && value !== '{}' && value !== 'null') {
//             try {
//                 const parsed = typeof value === 'string' ? JSON.parse(value) : value;
                
//                 if (parsed.ClassID && Array.isArray(parsed.ClassID)) {
//                     setFilterType('class');
//                     setSelectedClasses(parsed.ClassID);
//                 } else if (parsed.Sections && Array.isArray(parsed.Sections)) {
//                     setFilterType('section');
//                     // Handle new format with sections, class IDs, and their students
//                     const sectionsData = parsed.Sections.map(s => ({
//                         SectionID: s.SectionID,
//                         ClassID: s.ClassID
//                     }));
//                     setSelectedSectionsData(sectionsData);
//                     setSelectedSections(sectionsData.map(s => s.SectionID));
                    
//                     // Restore students per section
//                     const studentsPerSection = {};
//                     parsed.Sections.forEach(section => {
//                         if (section.StudentID && section.StudentID.length > 0) {
//                             studentsPerSection[section.SectionID] = section.StudentID;
//                         }
//                     });
//                     setSelectedStudentsPerSection(studentsPerSection);
//                 } else if (parsed.SectionID) {
//                     // Legacy format - single section
//                     setFilterType('section');
//                     const sectionIds = Array.isArray(parsed.SectionID) ? parsed.SectionID : [parsed.SectionID];
//                     setSelectedSections(sectionIds);
                    
//                     // For legacy format, we need to find the class ID for each section
//                     const sectionsData = sectionIds.map(sectionId => {
//                         const section = allSections.find(s => (s.ID || s.id) === sectionId);
//                         return {
//                             SectionID: sectionId,
//                             ClassID: section?.Class_ID || section?.class_ID || null
//                         };
//                     });
//                     setSelectedSectionsData(sectionsData);
                    
//                     if (parsed.StudentID && Array.isArray(parsed.StudentID)) {
//                         const studentsPerSection = {};
//                         sectionIds.forEach(sectionId => {
//                             studentsPerSection[sectionId] = parsed.StudentID;
//                         });
//                         setSelectedStudentsPerSection(studentsPerSection);
//                     }
//                 } else if (parsed.StudentID && Array.isArray(parsed.StudentID)) {
//                     setFilterType('specific_students');
//                 } else if (parsed.CampusID) {
//                     setFilterType('campus');
//                     setSelectedCampuses(Array.isArray(parsed.CampusID) ? parsed.CampusID : [parsed.CampusID]);
//                 } else if (parsed.UserID && Array.isArray(parsed.UserID)) {
//                     setFilterType('specific_users');
//                     setSelectedUsers(parsed.UserID);
//                 } else if (parsed.intervalDays) {
//                     setFilterType('fee_settings');
//                     setFeeSettings({
//                         intervalDays: parsed.intervalDays || 3,
//                         minAmount: parsed.minAmount || 0,
//                         maxDaysOverdue: parsed.maxDaysOverdue || 90,
//                         minDaysOverdue: parsed.minDaysOverdue || 0,
//                         excludePartialPayments: parsed.excludePartialPayments || false,
//                     });
//                 }
//             } catch (e) {
//                 console.error('Error parsing target filter:', e);
//             }
//         }
//     }, [value, allSections]);

//     // Generate JSON and call onChange - Save sections with class ID
//     const updateFilter = (newFilter) => {
//         const jsonString = JSON.stringify(newFilter);
//         console.log('📤 Sending filter to parent:', jsonString);
//         if (onChange) {
//             onChange(jsonString);
//         }
//     };

//     // Handle class selection
//     const handleClassChange = (event, newValue) => {
//         const classIds = newValue.map(item => item.Class_ID || item.class_ID);
//         setSelectedClasses(classIds);
//         updateFilter({ ClassID: classIds });
//     };

//     // Handle section selection - UPDATED: Track sections with their class ID
//     const handleSectionChange = (event, newValue) => {
//         const sectionsWithClass = newValue.map(item => ({
//             SectionID: item.ID || item.id,
//             ClassID: item.Class_ID || item.class_ID
//         }));
        
//         const sectionIds = sectionsWithClass.map(s => s.SectionID);
//         setSelectedSections(sectionIds);
//         setSelectedSectionsData(sectionsWithClass);
        
//         // Preserve existing students for sections that remain, remove for removed sections
//         const updatedStudentsPerSection = { ...selectedStudentsPerSection };
//         Object.keys(updatedStudentsPerSection).forEach(sectionId => {
//             if (!sectionIds.includes(parseInt(sectionId))) {
//                 delete updatedStudentsPerSection[sectionId];
//             }
//         });
//         setSelectedStudentsPerSection(updatedStudentsPerSection);
        
//         // Build the new filter structure with class ID
//         const sectionsData = sectionsWithClass.map(section => {
//             const sectionData = { 
//                 SectionID: section.SectionID,
//                 ClassID: section.ClassID
//             };
//             const sectionStudents = updatedStudentsPerSection[section.SectionID];
//             if (sectionStudents && sectionStudents.length > 0) {
//                 sectionData.StudentID = sectionStudents;
//             }
//             return sectionData;
//         });
        
//         const filterData = { Sections: sectionsData };
//         console.log('📤 Section filter data with class IDs:', filterData);
//         updateFilter(filterData);
//     };

//     // Handle student selection for a specific section
//     const handleStudentChangeForSection = (sectionId, newValue) => {
//         const studentIds = newValue.map(item => item.reg_Id || item.id).filter(id => id != null);
        
//         setSelectedStudentsPerSection(prev => ({
//             ...prev,
//             [sectionId]: studentIds
//         }));
        
//         // Build the complete filter with all sections, their class IDs, and students
//         const sectionsData = selectedSectionsData.map(section => {
//             const sectionData = { 
//                 SectionID: section.SectionID,
//                 ClassID: section.ClassID
//             };
//             const studentsForSection = section.SectionID === sectionId ? studentIds : (selectedStudentsPerSection[section.SectionID] || []);
//             if (studentsForSection && studentsForSection.length > 0) {
//                 sectionData.StudentID = studentsForSection;
//             }
//             return sectionData;
//         });
        
//         const filterObj = { Sections: sectionsData };
        
//         console.log(`📤 Student filter data for section ${sectionId}:`, filterObj);
//         updateFilter(filterObj);
//     };

//     // Handle campus selection
//     const handleCampusChange = (event, newValue) => {
//         const campusIds = newValue.map(item => item.CampusID || item.id);
//         setSelectedCampuses(campusIds);
//         updateFilter({ CampusID: campusIds });
//     };

//     // Handle user selection
//     const handleUserChange = (event, newValue) => {
//         const userIds = newValue.map(item => item.ID || item.id);
//         setSelectedUsers(userIds);
//         updateFilter({ UserID: userIds });
//     };

//     // Handle fee settings change
//     const handleFeeSettingChange = (field, value) => {
//         const newSettings = { ...feeSettings, [field]: value };
//         setFeeSettings(newSettings);
//         updateFilter(newSettings);
//     };

//     // Helper function to get roll number from student object
//     const getStudentRollNo = (item) => {
//         const rollNo = item?.rollNo || item?.RollNo || item?.roll_no || item?.Roll_No;
        
//         if (rollNo && rollNo > 0 && rollNo !== null && rollNo !== undefined) {
//             return rollNo;
//         }
//         return null;
//     };

//     // Get display names
//     const getClassDisplay = (item) => {
//         const id = item.Class_ID || item.class_ID;
//         const name = item.Class_Name || item.class_Name || `Class ${id}`;
//         return name;
//     };

//     const getSectionDisplay = (item) => {
//         const id = item.ID || item.id;
//         const name = item.Section || item.section || `Section ${id}`;
//         const className = item.className || classMap.get(item.Class_ID || item.class_ID) || '';
//         return className ? `${name} (${className})` : name;
//     };

//     const getStudentDisplay = (item) => {
//         const id = item.reg_Id || item.id;
//         const name = item.frist_Name || item.Frist_Name || item.name || `Student ${id || 'Unknown'}`;
//         const rollNo = getStudentRollNo(item);
        
//         return rollNo ? `${name} (Roll No: ${rollNo})` : name;
//     };

//     const getCampusDisplay = (item) => {
//         const name = item.CampusName || item.campusName || `Campus ${item.CampusID || item.id}`;
//         return name;
//     };

//     const getUserDisplay = (item) => {
//         return item.Name || item.name || item.UserName || item.userName || `User ${item.ID || item.id}`;
//     };

//     // Get selected objects
//     const getSelectedClassObjects = () => {
//         return classes.filter(c => {
//             const id = c.Class_ID || c.class_ID;
//             return selectedClasses.includes(id);
//         });
//     };

//     const getSelectedSectionObjects = () => {
//         return sectionsWithClassName.filter(s => {
//             const id = s.ID || s.id;
//             return selectedSections.includes(id);
//         });
//     };

//     // Get selected student objects for a specific section
//     const getSelectedStudentObjectsForSection = (sectionId) => {
//         if (!students || students.length === 0) return [];
//         const selectedStudentIds = selectedStudentsPerSection[sectionId] || [];
        
//         return students.filter(s => {
//             const id = s?.reg_Id || s?.id;
//             return id && selectedStudentIds.includes(id);
//         });
//     };

//     const getSelectedCampusObjects = () => {
//         return campuses.filter(c => {
//             const id = c.CampusID || c.id;
//             return selectedCampuses.includes(id);
//         });
//     };

//     const getSelectedUserObjects = () => {
//         return users.filter(u => {
//             const id = u.ID || u.id;
//             return selectedUsers.includes(id);
//         });
//     };

//     // Get total selected students count
//     const getTotalSelectedStudents = () => {
//         return Object.values(selectedStudentsPerSection).reduce((total, students) => total + students.length, 0);
//     };

//     // Simple target types
//     if (targetType === 'ALL' || targetType === 'PARENTS' || targetType === 'TEACHERS' || targetType === 'STUDENTS') {
//         return (
//             <Alert severity="info" icon={<InfoIcon />}>
//                 <Typography variant="body2">
//                     {targetType === 'ALL' && 'Notifications will be sent to all users in the system.'}
//                     {targetType === 'PARENTS' && 'Notifications will be sent to all parents only. The system automatically matches parents to their children via Family Code.'}
//                     {targetType === 'TEACHERS' && 'Notifications will be sent to all teachers only.'}
//                     {targetType === 'STUDENTS' && 'Notifications will be sent to all students only.'}
//                 </Typography>
//             </Alert>
//         );
//     }

//     // Class selection
//     if (targetType === 'CLASS') {
//         return (
//             <Box>
//                 <Typography variant="subtitle2" gutterBottom>
//                     <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
//                     Select Classes
//                 </Typography>
//                 <Autocomplete
//                     multiple
//                     options={classes}
//                     getOptionLabel={getClassDisplay}
//                     value={getSelectedClassObjects()}
//                     onChange={handleClassChange}
//                     disabled={disabled || classesLoading}
//                     loading={classesLoading}
//                     disableCloseOnSelect
//                     isOptionEqualToValue={(option, value) => {
//                         return (option.Class_ID || option.class_ID) === (value.Class_ID || value.class_ID);
//                     }}
//                     renderInput={(params) => (
//                         <TextField
//                             {...params}
//                             placeholder="Search and select classes..."
//                             variant="outlined"
//                             InputProps={{
//                                 ...params.InputProps,
//                                 endAdornment: (
//                                     <>
//                                         {classesLoading ? <CircularProgress size={20} /> : null}
//                                         {params.InputProps.endAdornment}
//                                     </>
//                                 ),
//                             }}
//                         />
//                     )}
//                     renderTags={(value, getTagProps) =>
//                         value.map((option, index) => {
//                             const optionId = option.Class_ID || option.class_ID;
//                             const tagProps = getTagProps({ index });
//                             const { key, ...restTagProps } = tagProps;
//                             return (
//                                 <Chip
//                                     key={`selected-class-${optionId}`}
//                                     label={getClassDisplay(option)}
//                                     {...restTagProps}
//                                     size="small"
//                                     color="primary"
//                                 />
//                             );
//                         })
//                     }
//                     renderOption={(props, option) => {
//                         const optionId = option.Class_ID || option.class_ID;
//                         return (
//                             <li {...props} key={`class-option-${optionId}`}>
//                                 <Checkbox checked={selectedClasses.includes(optionId)} />
//                                 <ListItemText 
//                                     primary={option.Class_Name || option.class_Name || `Class ${optionId}`}
//                                     secondary={`ID: ${optionId}`}
//                                 />
//                             </li>
//                         );
//                     }}
//                 />
//                 {selectedClasses.length > 0 && (
//                     <Alert severity="info" sx={{ mt: 2 }}>
//                         <Typography variant="body2">
//                             <strong>{selectedClasses.length}</strong> class(es) selected.
//                         </Typography>
//                     </Alert>
//                 )}
//             </Box>
//         );
//     }

//     // Section selection with per-section student selection - UPDATED with class ID
//     if (targetType === 'SECTION') {
//         const availableClassIds = [...new Set(allSections.map(s => s.Class_ID || s.class_ID).filter(Boolean))];
//         const classOptions = classes.filter(c => availableClassIds.includes(c.Class_ID || c.class_ID));
//         const selectedSectionObjects = getSelectedSectionObjects();

//         return (
//             <Box>
//                 <Typography variant="subtitle2" gutterBottom>
//                     <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
//                     Select Class First, then Sections
//                 </Typography>
                
//                 <FormControl fullWidth size="small" sx={{ mb: 2 }}>
//                     <InputLabel>Select Class</InputLabel>
//                     <Select
//                         value={selectedClassForSections || ''}
//                         onChange={(e) => {
//                             setSelectedClassForSections(e.target.value);
//                             setSelectedSections([]);
//                             setSelectedSectionsData([]);
//                             setSelectedStudentsPerSection({});
//                         }}
//                         label="Select Class"
//                         disabled={disabled}
//                     >
//                         <MenuItem value="">-- Select a class --</MenuItem>
//                         {classOptions.map((cls) => {
//                             const clsId = cls.Class_ID || cls.class_ID;
//                             const clsName = cls.Class_Name || cls.class_Name;
//                             return (
//                                 <MenuItem key={clsId} value={clsId}>
//                                     {clsName}
//                                 </MenuItem>
//                             );
//                         })}
//                     </Select>
//                 </FormControl>

//                 {selectedClassForSections && (
//                     <>
//                         <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
//                             <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
//                             Select Sections
//                         </Typography>
//                         <Autocomplete
//                             multiple
//                             options={filteredSections}
//                             getOptionLabel={getSectionDisplay}
//                             value={selectedSectionObjects}
//                             onChange={handleSectionChange}
//                             disabled={disabled}
//                             disableCloseOnSelect
//                             isOptionEqualToValue={(option, value) => (option.ID || option.id) === (value.ID || value.id)}
//                             renderInput={(params) => (
//                                 <TextField
//                                     {...params}
//                                     placeholder="Search and select sections..."
//                                     variant="outlined"
//                                 />
//                             )}
//                             renderTags={(value, getTagProps) =>
//                                 value.map((option, index) => {
//                                     const optionId = option.ID || option.id;
//                                     const tagProps = getTagProps({ index });
//                                     const { key, ...restTagProps } = tagProps;
//                                     return (
//                                         <Chip
//                                             key={`selected-section-${optionId}`}
//                                             label={getSectionDisplay(option)}
//                                             {...restTagProps}
//                                             size="small"
//                                             color="secondary"
//                                         />
//                                     );
//                                 })
//                             }
//                             renderOption={(props, option) => {
//                                 const optionId = option.ID || option.id;
//                                 const className = classMap.get(option.Class_ID || option.class_ID) || 'Unknown Class';
//                                 return (
//                                     <li {...props} key={`section-option-${optionId}`}>
//                                         <Checkbox checked={selectedSections.includes(optionId)} />
//                                         <ListItemText 
//                                             primary={`${option.Section || option.section || `Section ${optionId}`}`}
//                                             secondary={`Class: ${className}`}
//                                         />
//                                     </li>
//                                 );
//                             }}
//                         />

//                         {/* Student Selection Accordions for each selected section */}
//                         {selectedSections.length > 0 && (
//                             <Box sx={{ mt: 3 }}>
//                                 <Typography variant="subtitle1" gutterBottom>
//                                     <ChildIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
//                                     Select Students for Each Section
//                                 </Typography>
//                                 <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                                     Total students selected across all sections: <strong>{getTotalSelectedStudents()}</strong>
//                                 </Typography>
                                
//                                 {selectedSectionsData.map((sectionData) => {
//                                     const sectionId = sectionData.SectionID;
//                                     const section = sectionsWithClassName.find(s => (s.ID || s.id) === sectionId);
//                                     if (!section) return null;
                                    
//                                     return (
//                                         <Accordion key={`section-${sectionId}`} sx={{ mb: 2, bgcolor: '#f9f9f9' }}>
//                                             <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                                                 <Box display="flex" alignItems="center" gap={2} flex={1}>
//                                                     <SchoolIcon color="secondary" />
//                                                     <Typography variant="subtitle1">
//                                                         {getSectionDisplay(section)}
//                                                     </Typography>
//                                                     <Chip 
//                                                         label={`${(selectedStudentsPerSection[sectionId] || []).length} students selected`} 
//                                                         size="small" 
//                                                         color={(selectedStudentsPerSection[sectionId] || []).length > 0 ? "primary" : "default"}
//                                                     />
//                                                 </Box>
//                                             </AccordionSummary>
//                                             <AccordionDetails>
//                                                 <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                                                     Select specific students from this section.
//                                                 </Typography>

//                                                 <FormControl fullWidth size="small" sx={{ mb: 3 }}>
//                                                     <InputLabel>Select Section to View Students</InputLabel>
//                                                     <Select
//                                                         value={selectedSectionForStudents || ''}
//                                                         onChange={(e) => {
//                                                             setSelectedSectionForStudents(e.target.value);
//                                                         }}
//                                                         label="Select Section to View Students"
//                                                         disabled={disabled}
//                                                     >
//                                                         <MenuItem value="">-- Select a section --</MenuItem>
//                                                         <MenuItem value={sectionId}>
//                                                             {getSectionDisplay(section)}
//                                                         </MenuItem>
//                                                     </Select>
//                                                 </FormControl>

//                                                 {selectedSectionForStudents === sectionId && (
//                                                     <>
//                                                         {studentsLoading ? (
//                                                             <Box display="flex" justifyContent="center" p={2}>
//                                                                 <CircularProgress size={30} />
//                                                             </Box>
//                                                         ) : studentsError ? (
//                                                             <Alert severity="error">
//                                                                 Error loading students: {studentsError.data?.message || studentsError.message}
//                                                             </Alert>
//                                                         ) : students.length === 0 ? (
//                                                             <Alert severity="info">
//                                                                 No students found in this section.
//                                                             </Alert>
//                                                         ) : (
//                                                             <Autocomplete
//                                                                 multiple
//                                                                 options={students}
//                                                                 getOptionLabel={getStudentDisplay}
//                                                                 value={getSelectedStudentObjectsForSection(sectionId)}
//                                                                 onChange={(event, newValue) => handleStudentChangeForSection(sectionId, newValue)}
//                                                                 disabled={disabled}
//                                                                 disableCloseOnSelect
//                                                                 isOptionEqualToValue={(option, value) => {
//                                                                     const optionId = option?.reg_Id || option?.id;
//                                                                     const valueId = value?.reg_Id || value?.id;
//                                                                     return optionId === valueId;
//                                                                 }}
//                                                                 getOptionKey={(option) => {
//                                                                     const optionId = option?.reg_Id || option?.id;
//                                                                     return `student-${optionId}`;
//                                                                 }}
//                                                                 renderInput={(params) => (
//                                                                     <TextField
//                                                                         {...params}
//                                                                         placeholder="Search and select students..."
//                                                                         variant="outlined"
//                                                                         helperText={`${students.length} students available`}
//                                                                     />
//                                                                 )}
//                                                                 renderTags={(value, getTagProps) =>
//                                                                     value.map((option, index) => {
//                                                                         const optionId = option?.reg_Id || option?.id;
//                                                                         const tagProps = getTagProps({ index });
//                                                                         const { key, ...restTagProps } = tagProps;
//                                                                         const displayName = option.frist_Name || option.Frist_Name || option.name || `Student ${optionId}`;
//                                                                         const rollNo = getStudentRollNo(option);
//                                                                         const rollNoText = rollNo ? ` (${rollNo})` : '';
//                                                                         return (
//                                                                             <Chip
//                                                                                 key={`selected-student-${optionId || index}`}
//                                                                                 label={`${displayName}${rollNoText}`}
//                                                                                 {...restTagProps}
//                                                                                 size="small"
//                                                                                 color="info"
//                                                                             />
//                                                                         );
//                                                                     })
//                                                                 }
//                                                                 renderOption={(props, option) => {
//                                                                     const optionId = option?.reg_Id || option?.id;
//                                                                     const name = option.frist_Name || option.Frist_Name || option.name || `Student ${optionId || 'Unknown'}`;
//                                                                     const rollNo = getStudentRollNo(option);
//                                                                     const rollNoText = (rollNo && rollNo > 0) ? `Roll No: ${rollNo}` : 'No Roll No';
//                                                                     const familyCode = option.Family_Code ? `Family: ${option.Family_Code}` : '';
//                                                                     const isSelected = (selectedStudentsPerSection[sectionId] || []).includes(optionId);
//                                                                     return (
//                                                                         <li {...props} key={`student-option-${optionId}`}>
//                                                                             <Checkbox checked={isSelected} />
//                                                                             <ListItemText 
//                                                                                 primary={name}
//                                                                                 secondary={`${rollNoText} ${familyCode}`}
//                                                                             />
//                                                                         </li>
//                                                                     );
//                                                                 }}
//                                                             />
//                                                         )}
//                                                     </>
//                                                 )}
//                                             </AccordionDetails>
//                                         </Accordion>
//                                     );
//                                 })}
//                             </Box>
//                         )}
//                     </>
//                 )}

//                 {selectedSections.length > 0 && (
//                     <Alert severity="info" sx={{ mt: 2 }}>
//                         <Typography variant="body2">
//                             <strong>{selectedSections.length}</strong> section(s) selected. 
//                             <strong>{getTotalSelectedStudents()}</strong> total student(s) selected across all sections.
//                         </Typography>
//                     </Alert>
//                 )}
//             </Box>
//         );
//     }

//     // Specific users selection
//     if (targetType === 'SPECIFIC_USERS') {
//         return (
//             <Box>
//                 <Typography variant="subtitle2" gutterBottom>
//                     <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
//                     Select Specific Users
//                 </Typography>
//                 <Autocomplete
//                     multiple
//                     options={users}
//                     getOptionLabel={getUserDisplay}
//                     value={getSelectedUserObjects()}
//                     onChange={handleUserChange}
//                     disabled={disabled || usersLoading}
//                     loading={usersLoading}
//                     disableCloseOnSelect
//                     isOptionEqualToValue={(option, value) => (option.ID || option.id) === (value.ID || value.id)}
//                     renderInput={(params) => (
//                         <TextField
//                             {...params}
//                             placeholder="Search and select users..."
//                             variant="outlined"
//                         />
//                     )}
//                     renderTags={(value, getTagProps) =>
//                         value.map((option, index) => {
//                             const optionId = option.ID || option.id;
//                             const tagProps = getTagProps({ index });
//                             const { key, ...restTagProps } = tagProps;
//                             return (
//                                 <Chip
//                                     key={`selected-user-${optionId}`}
//                                     label={getUserDisplay(option)}
//                                     {...restTagProps}
//                                     size="small"
//                                 />
//                             );
//                         })
//                     }
//                     renderOption={(props, option) => {
//                         const optionId = option.ID || option.id;
//                         return (
//                             <li {...props} key={`user-option-${optionId}`}>
//                                 <Checkbox checked={selectedUsers.includes(optionId)} />
//                                 <ListItemText 
//                                     primary={getUserDisplay(option)}
//                                     secondary={option.Role?.Role || option.userType || option.Designation || 'User'}
//                                 />
//                             </li>
//                         );
//                     }}
//                 />
//             </Box>
//         );
//     }

//     // Fee configuration
//     if (category === 'FEE') {
//         return (
//             <Box>
//                 <Typography variant="subtitle2" gutterBottom>
//                     <CategoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
//                     Fee Reminder Configuration
//                 </Typography>
                
//                 <Grid container spacing={2} sx={{ mt: 1 }}>
//                     <Grid item xs={12} sm={6}>
//                         <TextField
//                             fullWidth
//                             label="Reminder Interval (Days)"
//                             type="number"
//                             value={feeSettings.intervalDays}
//                             onChange={(e) => handleFeeSettingChange('intervalDays', parseInt(e.target.value) || 3)}
//                             helperText="How often to send reminders"
//                             InputProps={{ 
//                                 inputProps: { min: 1, max: 30 },
//                                 endAdornment: <InputAdornment position="end">days</InputAdornment>
//                             }}
//                             disabled={disabled}
//                             size="small"
//                         />
//                     </Grid>
                    
//                     <Grid item xs={12} sm={6}>
//                         <TextField
//                             fullWidth
//                             label="Minimum Due Amount"
//                             type="number"
//                             value={feeSettings.minAmount}
//                             onChange={(e) => handleFeeSettingChange('minAmount', parseInt(e.target.value) || 0)}
//                             helperText="Only remind if due amount is above this"
//                             InputProps={{ 
//                                 inputProps: { min: 0 },
//                                 startAdornment: <InputAdornment position="start">Rs.</InputAdornment>
//                             }}
//                             disabled={disabled}
//                             size="small"
//                         />
//                     </Grid>
                    
//                     <Grid item xs={12} sm={6}>
//                         <TextField
//                             fullWidth
//                             label="Minimum Days Overdue"
//                             type="number"
//                             value={feeSettings.minDaysOverdue}
//                             onChange={(e) => handleFeeSettingChange('minDaysOverdue', parseInt(e.target.value) || 0)}
//                             helperText="Remind only after this many days overdue"
//                             InputProps={{ inputProps: { min: 0 } }}
//                             disabled={disabled}
//                             size="small"
//                         />
//                     </Grid>
                    
//                     <Grid item xs={12} sm={6}>
//                         <TextField
//                             fullWidth
//                             label="Maximum Days Overdue"
//                             type="number"
//                             value={feeSettings.maxDaysOverdue}
//                             onChange={(e) => handleFeeSettingChange('maxDaysOverdue', parseInt(e.target.value) || 90)}
//                             helperText="Stop reminding after this many days"
//                             InputProps={{ inputProps: { min: 1, max: 365 } }}
//                             disabled={disabled}
//                             size="small"
//                         />
//                     </Grid>
                    
//                     <Grid item xs={12}>
//                         <FormControlLabel
//                             control={
//                                 <Switch
//                                     checked={feeSettings.excludePartialPayments}
//                                     onChange={(e) => handleFeeSettingChange('excludePartialPayments', e.target.checked)}
//                                     disabled={disabled}
//                                 />
//                             }
//                             label="Exclude Partial Payments"
//                         />
//                         <Typography variant="caption" color="text.secondary" display="block">
//                             If checked, users who have made partial payments will not receive reminders
//                         </Typography>
//                     </Grid>
//                 </Grid>

//                 <Alert severity="info" sx={{ mt: 2 }}>
//                     <Typography variant="body2">
//                         Fee reminders will be sent every {feeSettings.intervalDays} days for dues above 
//                         Rs.{feeSettings.minAmount.toLocaleString()} and will stop after {feeSettings.maxDaysOverdue} days overdue.
//                     </Typography>
//                 </Alert>
//             </Box>
//         );
//     }

//     return null;
// };

// export default TargetFilterBuilder;
import React, { useState, useEffect, useMemo } from 'react';
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    TextField,
    Typography,
    Paper,
    Grid,
    CircularProgress,
    Alert,
    Autocomplete,
    Checkbox,
    ListItemText,
    FormControlLabel,
    Switch,
    InputAdornment,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider,
    IconButton,
    Tooltip,
    Button,
    Stack,
} from '@mui/material';
import {
    School as SchoolIcon,
    Group as GroupIcon,
    Person as PersonIcon,
    Category as CategoryIcon,
    Info as InfoIcon,
    ExpandMore as ExpandMoreIcon,
    ChildCare as ChildIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    Timer as TimerIcon,
    Warning as WarningIcon,
} from '@mui/icons-material';

// Import your actual API hooks
import { useGetClassesQuery } from '../store/api/classApi';
import { useGetSectionsQuery } from '../store/api/sectionApi';
import { useGetCampusesQuery } from '../store/api/campusApi';
import { useGetUsersQuery } from '../store/api/usersApi';
import { useGetStudentsBySectionQuery, useGetAllSectionsWithCountsQuery } from '../store/api/studentApi';
import { API_BASE_URL } from '../store/api/apiConfig';

const TargetFilterBuilder = ({ value, onChange, category = 'GENERAL', disabled = false, targetType = 'ALL' }) => {
    const [filterType, setFilterType] = useState('all');
    const [selectedClasses, setSelectedClasses] = useState([]);
    const [selectedSections, setSelectedSections] = useState([]);
    const [selectedCampuses, setSelectedCampuses] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    
    // Direct student selection
    const [selectedStudentsDirect, setSelectedStudentsDirect] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [loadingAllStudents, setLoadingAllStudents] = useState(false);
    const [allStudentsLoaded, setAllStudentsLoaded] = useState(false);
    
    // Store sections with their class ID and students
    const [selectedSectionsData, setSelectedSectionsData] = useState([]);
    const [selectedStudentsPerSection, setSelectedStudentsPerSection] = useState({});
    const [selectedClassForSections, setSelectedClassForSections] = useState(null);
    const [selectedSectionForStudents, setSelectedSectionForStudents] = useState(null);
    
    // Fee interval settings - Enhanced
    const [feeSettings, setFeeSettings] = useState({
        intervalDays: 3,
        minAmount: 0,
        maxDaysOverdue: 90,
        minDaysOverdue: 0,
        excludePartialPayments: false,
        intervals: {
            beforeDueDate: [7, 3, 1],
            afterDueDate: [1, 3, 7, 14, 30, 60, 90],
            maxReminders: 10,
            excludeWeekends: true,
            sendOnDueDate: true,
            customIntervals: []
        },
        reminderTimes: {
            morning: "09:00",
            evening: "17:00",
            useMultipleTimes: false
        },
        onlyWeekdays: false,
        priority: "normal"
    });

    // Fetch data from your actual backend APIs
    const { data: classesData, isLoading: classesLoading } = useGetClassesQuery();
    const { data: sectionsData, isLoading: sectionsLoading } = useGetSectionsQuery();
    const { data: campusesData, isLoading: campusesLoading } = useGetCampusesQuery();
    const { data: usersData, isLoading: usersLoading } = useGetUsersQuery();
    
    // Fetch students based on selected section
    const { data: studentsData, isLoading: studentsLoading, refetch: refetchStudents, error: studentsError } = 
        useGetStudentsBySectionQuery(selectedSectionForStudents, { skip: !selectedSectionForStudents });
    
    // Fetch all sections with counts for direct student selection
    const { data: allSectionsWithCountsData, isLoading: sectionsWithCountsLoading } = useGetAllSectionsWithCountsQuery();

    // Extract data from API responses
    const classes = classesData?.data || classesData || [];
    const allSections = sectionsData?.data || sectionsData || [];
    const campuses = campusesData?.data || campusesData || [];
    const users = usersData?.data || usersData || [];
    const allSectionsWithCounts = allSectionsWithCountsData?.data || allSectionsWithCountsData || [];
    
    // Handle students data correctly
    const students = useMemo(() => {
        const rawStudents = studentsData?.data || studentsData || [];
        return rawStudents.map((student, index) => ({
            ...student,
            uniqueId: student?.reg_Id || student?.id || `temp_${index}`,
            studentId: student?.reg_Id || student?.id,
            displayName: `${student.frist_Name || student.Frist_Name || 'Student'} (${student.reg_Id || student.id})`
        }));
    }, [studentsData]);

    // Load all students for direct selection - FIXED VERSION
    const loadAllStudents = async () => {
        if (allStudentsLoaded || loadingAllStudents) return;
        
        console.log('🔄 loadAllStudents called - TargetFilterBuilder');
        console.log('allSectionsWithCounts:', allSectionsWithCounts);
        
        setLoadingAllStudents(true);
        try {
            const sectionsWithStudents = allSectionsWithCounts || [];
            
            if (sectionsWithStudents.length === 0) {
                console.log('⚠️ No sections found with students');
                setAllStudents([]);
                setAllStudentsLoaded(true);
                return;
            }
            
            // Filter sections that have students
            const sectionsToFetch = sectionsWithStudents.filter(s => s.studentCount > 0);
            
            if (sectionsToFetch.length === 0) {
                console.log('⚠️ No sections have students');
                setAllStudents([]);
                setAllStudentsLoaded(true);
                return;
            }
            
            console.log(`📊 Fetching students from ${sectionsToFetch.length} sections...`);
            
            const token = localStorage.getItem('token');
            const baseUrl = API_BASE_URL || 'http://localhost:5027';
            
            // Fetch students from each section in parallel
            const fetchPromises = sectionsToFetch.map(async (section) => {
                try {
                    const response = await fetch(`${baseUrl}/api/Student/bysection/${section.id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    const result = await response.json();
                    const studentsData = result?.data || result || [];
                    console.log(`✅ Section ${section.id} (${section.section}): ${studentsData.length} students`);
                    return studentsData;
                } catch (err) {
                    console.error(`❌ Error fetching section ${section.id}:`, err);
                    return [];
                }
            });
            
            const results = await Promise.all(fetchPromises);
            const allStudentsData = results.flat();
            
            console.log(`📊 Total students fetched: ${allStudentsData.length}`);
            
            // Remove duplicates based on reg_Id
            const uniqueStudents = Array.from(
                new Map(allStudentsData.map(s => [s.reg_Id, s])).values()
            );
            
            console.log(`✅ Unique students: ${uniqueStudents.length}`);
            
            // Log first few students for debugging
            if (uniqueStudents.length > 0) {
                console.log('📝 Sample students:', uniqueStudents.slice(0, 3).map(s => ({
                    id: s.reg_Id,
                    name: s.frist_Name,
                    rollNo: s.RollNo
                })));
            }
            
            setAllStudents(uniqueStudents);
            setAllStudentsLoaded(true);
        } catch (error) {
            console.error('❌ Error loading all students:', error);
        } finally {
            setLoadingAllStudents(false);
        }
    };

    // Auto-load students when component mounts for SPECIFIC_STUDENTS_DIRECT
    useEffect(() => {
        if (targetType === 'SPECIFIC_STUDENTS_DIRECT' && !allStudentsLoaded && !loadingAllStudents && allSectionsWithCounts.length > 0) {
            console.log('🎯 Auto-loading students for SPECIFIC_STUDENTS_DIRECT mode');
            loadAllStudents();
        }
    }, [targetType, allSectionsWithCounts, allStudentsLoaded, loadingAllStudents]);

    // Create a map of class ID to class name for quick lookup
    const classMap = useMemo(() => {
        const map = new Map();
        classes.forEach(cls => {
            const id = cls.Class_ID || cls.class_ID;
            const name = cls.Class_Name || cls.class_Name;
            if (id && name) {
                map.set(id, name);
            }
        });
        return map;
    }, [classes]);

    // Enhance sections with class name
    const sectionsWithClassName = useMemo(() => {
        return allSections.map(section => ({
            ...section,
            className: classMap.get(section.Class_ID || section.class_ID) || 'Unknown Class',
            displayName: `${section.Section || section.section} - ${classMap.get(section.Class_ID || section.class_ID) || 'Unknown Class'}`
        }));
    }, [allSections, classMap]);

    // Filter sections based on selected class
    const filteredSections = useMemo(() => {
        if (!selectedClassForSections) return [];
        return sectionsWithClassName.filter(s => (s.Class_ID || s.class_ID) === selectedClassForSections);
    }, [sectionsWithClassName, selectedClassForSections]);

    // Refetch students when section changes
    useEffect(() => {
        if (selectedSectionForStudents) {
            refetchStudents();
        }
    }, [selectedSectionForStudents, refetchStudents]);

    // Parse existing JSON value on load
    useEffect(() => {
        if (value && value !== '{}' && value !== 'null') {
            try {
                const parsed = typeof value === 'string' ? JSON.parse(value) : value;
                
                if (parsed.ClassID && Array.isArray(parsed.ClassID)) {
                    setFilterType('class');
                    setSelectedClasses(parsed.ClassID);
                } else if (parsed.Students && Array.isArray(parsed.Students)) {
                    setFilterType('specific_students_direct');
                    setSelectedStudentsDirect(parsed.Students);
                    if (!allStudentsLoaded) {
                        loadAllStudents();
                    }
                } else if (parsed.Sections && Array.isArray(parsed.Sections)) {
                    setFilterType('section');
                    const sectionsData = parsed.Sections.map(s => ({
                        SectionID: s.SectionID,
                        ClassID: s.ClassID
                    }));
                    setSelectedSectionsData(sectionsData);
                    setSelectedSections(sectionsData.map(s => s.SectionID));
                    
                    const studentsPerSection = {};
                    parsed.Sections.forEach(section => {
                        if (section.StudentID && section.StudentID.length > 0) {
                            studentsPerSection[section.SectionID] = section.StudentID;
                        }
                    });
                    setSelectedStudentsPerSection(studentsPerSection);
                } else if (parsed.SectionID) {
                    setFilterType('section');
                    const sectionIds = Array.isArray(parsed.SectionID) ? parsed.SectionID : [parsed.SectionID];
                    setSelectedSections(sectionIds);
                    
                    const sectionsData = sectionIds.map(sectionId => {
                        const section = allSections.find(s => (s.ID || s.id) === sectionId);
                        return {
                            SectionID: sectionId,
                            ClassID: section?.Class_ID || section?.class_ID || null
                        };
                    });
                    setSelectedSectionsData(sectionsData);
                    
                    if (parsed.StudentID && Array.isArray(parsed.StudentID)) {
                        const studentsPerSection = {};
                        sectionIds.forEach(sectionId => {
                            studentsPerSection[sectionId] = parsed.StudentID;
                        });
                        setSelectedStudentsPerSection(studentsPerSection);
                    }
                } else if (parsed.StudentID && Array.isArray(parsed.StudentID)) {
                    setFilterType('specific_students');
                } else if (parsed.CampusID) {
                    setFilterType('campus');
                    setSelectedCampuses(Array.isArray(parsed.CampusID) ? parsed.CampusID : [parsed.CampusID]);
                } else if (parsed.UserID && Array.isArray(parsed.UserID)) {
                    setFilterType('specific_users');
                    setSelectedUsers(parsed.UserID);
                } else if (parsed.intervalDays !== undefined || parsed.intervals !== undefined) {
                    setFilterType('fee_settings');
                    setFeeSettings({
                        intervalDays: parsed.intervalDays || 3,
                        minAmount: parsed.minAmount || 0,
                        maxDaysOverdue: parsed.maxDaysOverdue || 90,
                        minDaysOverdue: parsed.minDaysOverdue || 0,
                        excludePartialPayments: parsed.excludePartialPayments || false,
                        intervals: parsed.intervals || {
                            beforeDueDate: [7, 3, 1],
                            afterDueDate: [1, 3, 7, 14, 30, 60, 90],
                            maxReminders: 10,
                            excludeWeekends: true,
                            sendOnDueDate: true,
                            customIntervals: []
                        },
                        reminderTimes: parsed.reminderTimes || {
                            morning: "09:00",
                            evening: "17:00",
                            useMultipleTimes: false
                        },
                        onlyWeekdays: parsed.onlyWeekdays || false,
                        priority: parsed.priority || "normal"
                    });
                }
            } catch (e) {
                console.error('Error parsing target filter:', e);
            }
        }
    }, [value, allSections, allStudentsLoaded]);

    // Generate JSON and call onChange
    const updateFilter = (newFilter) => {
        const jsonString = JSON.stringify(newFilter);
        console.log('📤 Sending filter to parent:', jsonString);
        if (onChange) {
            onChange(jsonString);
        }
    };

    // Handle class selection
    const handleClassChange = (event, newValue) => {
        const classIds = newValue.map(item => item.Class_ID || item.class_ID);
        setSelectedClasses(classIds);
        updateFilter({ ClassID: classIds });
    };

    // Handle section selection
    const handleSectionChange = (event, newValue) => {
        const sectionsWithClass = newValue.map(item => ({
            SectionID: item.ID || item.id,
            ClassID: item.Class_ID || item.class_ID
        }));
        
        const sectionIds = sectionsWithClass.map(s => s.SectionID);
        setSelectedSections(sectionIds);
        setSelectedSectionsData(sectionsWithClass);
        
        const updatedStudentsPerSection = { ...selectedStudentsPerSection };
        Object.keys(updatedStudentsPerSection).forEach(sectionId => {
            if (!sectionIds.includes(parseInt(sectionId))) {
                delete updatedStudentsPerSection[sectionId];
            }
        });
        setSelectedStudentsPerSection(updatedStudentsPerSection);
        
        const sectionsData = sectionsWithClass.map(section => {
            const sectionData = { 
                SectionID: section.SectionID,
                ClassID: section.ClassID
            };
            const sectionStudents = updatedStudentsPerSection[section.SectionID];
            if (sectionStudents && sectionStudents.length > 0) {
                sectionData.StudentID = sectionStudents;
            }
            return sectionData;
        });
        
        const filterData = { Sections: sectionsData };
        updateFilter(filterData);
    };

    // Handle direct student selection
    const handleDirectStudentChange = (event, newValue) => {
        const studentIds = newValue.map(item => item.reg_Id || item.id);
        setSelectedStudentsDirect(studentIds);
        updateFilter({ Students: studentIds });
    };

    // Handle student selection for a specific section
    const handleStudentChangeForSection = (sectionId, newValue) => {
        const studentIds = newValue.map(item => item.reg_Id || item.id).filter(id => id != null);
        
        setSelectedStudentsPerSection(prev => ({
            ...prev,
            [sectionId]: studentIds
        }));
        
        const sectionsData = selectedSectionsData.map(section => {
            const sectionData = { 
                SectionID: section.SectionID,
                ClassID: section.ClassID
            };
            const studentsForSection = section.SectionID === sectionId ? studentIds : (selectedStudentsPerSection[section.SectionID] || []);
            if (studentsForSection && studentsForSection.length > 0) {
                sectionData.StudentID = studentsForSection;
            }
            return sectionData;
        });
        
        const filterObj = { Sections: sectionsData };
        updateFilter(filterObj);
    };

    // Handle campus selection
    const handleCampusChange = (event, newValue) => {
        const campusIds = newValue.map(item => item.CampusID || item.id);
        setSelectedCampuses(campusIds);
        updateFilter({ CampusID: campusIds });
    };

    // Handle user selection
    const handleUserChange = (event, newValue) => {
        const userIds = newValue.map(item => item.ID || item.id);
        setSelectedUsers(userIds);
        updateFilter({ UserID: userIds });
    };

    // Handle fee interval changes
    const addCustomInterval = (type, value) => {
        const newIntervals = { ...feeSettings.intervals };
        if (type === 'before') {
            newIntervals.customIntervals = [...newIntervals.customIntervals, { days: parseInt(value), type: 'before' }];
        } else {
            newIntervals.customIntervals = [...newIntervals.customIntervals, { days: parseInt(value), type: 'after' }];
        }
        handleFeeSettingChange('intervals', newIntervals);
    };

    const removeCustomInterval = (index) => {
        const newIntervals = { ...feeSettings.intervals };
        newIntervals.customIntervals = newIntervals.customIntervals.filter((_, i) => i !== index);
        handleFeeSettingChange('intervals', newIntervals);
    };

    const toggleIntervalPreset = (type, value) => {
        const newIntervals = { ...feeSettings.intervals };
        if (type === 'before') {
            if (newIntervals.beforeDueDate.includes(value)) {
                newIntervals.beforeDueDate = newIntervals.beforeDueDate.filter(v => v !== value);
            } else {
                newIntervals.beforeDueDate = [...newIntervals.beforeDueDate, value].sort((a, b) => a - b);
            }
        } else {
            if (newIntervals.afterDueDate.includes(value)) {
                newIntervals.afterDueDate = newIntervals.afterDueDate.filter(v => v !== value);
            } else {
                newIntervals.afterDueDate = [...newIntervals.afterDueDate, value].sort((a, b) => a - b);
            }
        }
        handleFeeSettingChange('intervals', newIntervals);
    };

    // Handle fee settings change
    const handleFeeSettingChange = (field, value) => {
        let newSettings;
        if (field === 'intervals') {
            newSettings = { ...feeSettings, intervals: value };
        } else if (field === 'reminderTimes') {
            newSettings = { ...feeSettings, reminderTimes: value };
        } else {
            newSettings = { ...feeSettings, [field]: value };
        }
        setFeeSettings(newSettings);
        
        const filterData = { 
            intervalDays: newSettings.intervalDays,
            minAmount: newSettings.minAmount,
            maxDaysOverdue: newSettings.maxDaysOverdue,
            minDaysOverdue: newSettings.minDaysOverdue,
            excludePartialPayments: newSettings.excludePartialPayments,
            intervals: newSettings.intervals,
            reminderTimes: newSettings.reminderTimes,
            onlyWeekdays: newSettings.onlyWeekdays,
            priority: newSettings.priority
        };
        updateFilter(filterData);
    };

    // Helper function to get roll number from student object
    const getStudentRollNo = (item) => {
        const rollNo = item?.RollNo || item?.rollNo || item?.roll_no || item?.Roll_No;
        if (rollNo && rollNo > 0 && rollNo !== null && rollNo !== undefined) {
            return rollNo;
        }
        return null;
    };

    // Get display names
    const getClassDisplay = (item) => {
        const id = item.Class_ID || item.class_ID;
        const name = item.Class_Name || item.class_Name || `Class ${id}`;
        return name;
    };

    const getSectionDisplay = (item) => {
        const id = item.ID || item.id;
        const name = item.Section || item.section || `Section ${id}`;
        const className = item.className || classMap.get(item.Class_ID || item.class_ID) || '';
        return className ? `${name} (${className})` : name;
    };

    const getStudentDisplay = (item) => {
        const id = item.reg_Id || item.id;
        const name = item.frist_Name || item.Frist_Name || item.name || `Student ${id || 'Unknown'}`;
        const rollNo = getStudentRollNo(item);
        const className = classMap.get(item.Class_ID) || '';
        const sectionName = item.Section || '';
        
        let display = name;
        if (rollNo) display += ` (Roll: ${rollNo})`;
        if (className) display += ` - ${className}`;
        if (sectionName) display += ` ${sectionName}`;
        
        return display;
    };

    const getCampusDisplay = (item) => {
        const name = item.CampusName || item.campusName || `Campus ${item.CampusID || item.id}`;
        return name;
    };

    const getUserDisplay = (item) => {
        return item.Name || item.name || item.UserName || item.userName || `User ${item.ID || item.id}`;
    };

    // Get selected objects
    const getSelectedClassObjects = () => {
        return classes.filter(c => {
            const id = c.Class_ID || c.class_ID;
            return selectedClasses.includes(id);
        });
    };

    const getSelectedSectionObjects = () => {
        return sectionsWithClassName.filter(s => {
            const id = s.ID || s.id;
            return selectedSections.includes(id);
        });
    };

    const getSelectedStudentObjectsForSection = (sectionId) => {
        if (!students || students.length === 0) return [];
        const selectedStudentIds = selectedStudentsPerSection[sectionId] || [];
        
        return students.filter(s => {
            const id = s?.reg_Id || s?.id;
            return id && selectedStudentIds.includes(id);
        });
    };

    const getSelectedDirectStudentObjects = () => {
        if (allStudents.length === 0 && selectedStudentsDirect.length > 0) {
            return [];
        }
        return allStudents.filter(s => {
            const id = s?.reg_Id || s?.id;
            return id && selectedStudentsDirect.includes(id);
        });
    };

    const getSelectedCampusObjects = () => {
        return campuses.filter(c => {
            const id = c.CampusID || c.id;
            return selectedCampuses.includes(id);
        });
    };

    const getSelectedUserObjects = () => {
        return users.filter(u => {
            const id = u.ID || u.id;
            return selectedUsers.includes(id);
        });
    };

    // Get total selected students count
    const getTotalSelectedStudents = () => {
        return Object.values(selectedStudentsPerSection).reduce((total, students) => total + students.length, 0);
    };

    // Render fee interval configuration
    const renderFeeIntervals = () => {
        return (
            <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                    <TimerIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: '1rem' }} />
                    Reminder Intervals
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                        Send reminders before due date:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
                        {[7, 14, 21, 30, 45, 60].map(day => (
                            <Chip
                                key={`before-${day}`}
                                label={`${day} days before`}
                                size="small"
                                color={feeSettings.intervals.beforeDueDate.includes(day) ? "primary" : "default"}
                                onClick={() => toggleIntervalPreset('before', day)}
                                variant={feeSettings.intervals.beforeDueDate.includes(day) ? "filled" : "outlined"}
                            />
                        ))}
                    </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                        Send reminders after due date:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
                        {[1, 3, 7, 14, 30, 60, 90].map(day => (
                            <Chip
                                key={`after-${day}`}
                                label={`${day} days after`}
                                size="small"
                                color={feeSettings.intervals.afterDueDate.includes(day) ? "error" : "default"}
                                onClick={() => toggleIntervalPreset('after', day)}
                                variant={feeSettings.intervals.afterDueDate.includes(day) ? "filled" : "outlined"}
                            />
                        ))}
                    </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                        Custom intervals:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
                        {feeSettings.intervals.customIntervals.map((interval, idx) => (
                            <Chip
                                key={`custom-${idx}`}
                                label={`${interval.days} days ${interval.type === 'before' ? 'before' : 'after'}`}
                                size="small"
                                color="secondary"
                                onDelete={() => removeCustomInterval(idx)}
                            />
                        ))}
                    </Box>
                    <Box display="flex" gap={1} sx={{ mt: 1 }}>
                        <TextField
                            size="small"
                            placeholder="Days"
                            type="number"
                            inputProps={{ min: 1, style: { width: 80 } }}
                            id="customIntervalDays"
                        />
                        <Select
                            size="small"
                            defaultValue="before"
                            id="customIntervalType"
                            sx={{ width: 120 }}
                        >
                            <MenuItem value="before">Before due date</MenuItem>
                            <MenuItem value="after">After due date</MenuItem>
                        </Select>
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                                const days = document.getElementById('customIntervalDays')?.value;
                                const type = document.getElementById('customIntervalType')?.value;
                                if (days && parseInt(days) > 0) {
                                    addCustomInterval(type, days);
                                    document.getElementById('customIntervalDays').value = '';
                                }
                            }}
                        >
                            Add
                        </Button>
                    </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={feeSettings.intervals.sendOnDueDate}
                                    onChange={(e) => handleFeeSettingChange('intervals', { 
                                        ...feeSettings.intervals, 
                                        sendOnDueDate: e.target.checked 
                                    })}
                                    size="small"
                                />
                            }
                            label="Send reminder on due date"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={feeSettings.intervals.excludeWeekends}
                                    onChange={(e) => handleFeeSettingChange('intervals', { 
                                        ...feeSettings.intervals, 
                                        excludeWeekends: e.target.checked 
                                    })}
                                    size="small"
                                />
                            }
                            label="Exclude weekends"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Max Reminders"
                            type="number"
                            value={feeSettings.intervals.maxReminders}
                            onChange={(e) => handleFeeSettingChange('intervals', { 
                                ...feeSettings.intervals, 
                                maxReminders: parseInt(e.target.value) || 10 
                            })}
                            InputProps={{ inputProps: { min: 1, max: 50 } }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={feeSettings.onlyWeekdays}
                                    onChange={(e) => handleFeeSettingChange('onlyWeekdays', e.target.checked)}
                                    size="small"
                                />
                            }
                            label="Send only on weekdays"
                        />
                    </Grid>
                </Grid>
            </Box>
        );
    };

    // Simple target types
    if (targetType === 'ALL' || targetType === 'PARENTS' || targetType === 'TEACHERS' || targetType === 'STUDENTS') {
        return (
            <Alert severity="info" icon={<InfoIcon />}>
                <Typography variant="body2">
                    {targetType === 'ALL' && 'Notifications will be sent to all users in the system.'}
                    {targetType === 'PARENTS' && 'Notifications will be sent to all parents only. The system automatically matches parents to their children via Family Code.'}
                    {targetType === 'TEACHERS' && 'Notifications will be sent to all teachers only.'}
                    {targetType === 'STUDENTS' && 'Notifications will be sent to all students only.'}
                </Typography>
            </Alert>
        );
    }

    // Class selection
    if (targetType === 'CLASS') {
        return (
            <Box>
                <Typography variant="subtitle2" gutterBottom>
                    <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Select Classes
                </Typography>
                <Autocomplete
                    multiple
                    options={classes}
                    getOptionLabel={getClassDisplay}
                    value={getSelectedClassObjects()}
                    onChange={handleClassChange}
                    disabled={disabled || classesLoading}
                    loading={classesLoading}
                    disableCloseOnSelect
                    isOptionEqualToValue={(option, value) => {
                        return (option.Class_ID || option.class_ID) === (value.Class_ID || value.class_ID);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder="Search and select classes..."
                            variant="outlined"
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {classesLoading ? <CircularProgress size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </>
                                ),
                            }}
                        />
                    )}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => {
                            const optionId = option.Class_ID || option.class_ID;
                            const tagProps = getTagProps({ index });
                            const { key, ...restTagProps } = tagProps;
                            return (
                                <Chip
                                    key={`selected-class-${optionId}`}
                                    label={getClassDisplay(option)}
                                    {...restTagProps}
                                    size="small"
                                    color="primary"
                                />
                            );
                        })
                    }
                    renderOption={(props, option) => {
                        const optionId = option.Class_ID || option.class_ID;
                        return (
                            <li {...props} key={`class-option-${optionId}`}>
                                <Checkbox checked={selectedClasses.includes(optionId)} />
                                <ListItemText 
                                    primary={option.Class_Name || option.class_Name || `Class ${optionId}`}
                                    secondary={`ID: ${optionId}`}
                                />
                            </li>
                        );
                    }}
                />
                {selectedClasses.length > 0 && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                        <Typography variant="body2">
                            <strong>{selectedClasses.length}</strong> class(es) selected.
                        </Typography>
                    </Alert>
                )}
            </Box>
        );
    }

    // Direct Student Selection - FIXED VERSION
    if (targetType === 'SPECIFIC_STUDENTS_DIRECT') {
        // Debug log
        console.log('🎯 Rendering SPECIFIC_STUDENTS_DIRECT mode:', {
            allStudentsLoaded,
            loadingAllStudents,
            allStudentsCount: allStudents.length,
            sectionsWithCountsCount: allSectionsWithCounts.length,
            selectedCount: selectedStudentsDirect.length
        });

        return (
            <Box>
                <Typography variant="subtitle2" gutterBottom>
                    <ChildIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'primary' }} />
                    Select Students Directly
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                    Search and select students directly without selecting class or section first.
                </Typography>
                
                {sectionsWithCountsLoading && !allSectionsWithCounts.length ? (
                    <Box display="flex" justifyContent="center" p={3}>
                        <CircularProgress size={40} />
                        <Typography sx={{ ml: 2 }}>Loading sections...</Typography>
                    </Box>
                ) : loadingAllStudents ? (
                    <Box display="flex" justifyContent="center" p={3}>
                        <CircularProgress size={40} />
                        <Typography sx={{ ml: 2 }}>Loading students from all sections...</Typography>
                    </Box>
                ) : allStudents.length === 0 && allStudentsLoaded ? (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                        <Typography variant="body2">
                            No students found in any section. Please ensure there are students registered in the system.
                        </Typography>
                    </Alert>
                ) : (
                    <Autocomplete
                        multiple
                        options={allStudents}
                        getOptionLabel={getStudentDisplay}
                        value={getSelectedDirectStudentObjects()}
                        onChange={handleDirectStudentChange}
                        disabled={disabled}
                        loading={loadingAllStudents}
                        disableCloseOnSelect
                        isOptionEqualToValue={(option, value) => {
                            const optionId = option?.reg_Id || option?.id;
                            const valueId = value?.reg_Id || value?.id;
                            return optionId === valueId;
                        }}
                        getOptionKey={(option) => {
                            const optionId = option?.reg_Id || option?.id;
                            return `student-${optionId}`;
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Search students by name or roll number..."
                                variant="outlined"
                                helperText={`${allStudents.length} students available`}
                            />
                        )}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => {
                                const optionId = option?.reg_Id || option?.id;
                                const tagProps = getTagProps({ index });
                                const { key, ...restTagProps } = tagProps;
                                const displayName = option.frist_Name || option.Frist_Name || option.name || `Student ${optionId}`;
                                const rollNo = getStudentRollNo(option);
                                const rollNoText = rollNo ? ` (${rollNo})` : '';
                                return (
                                    <Chip
                                        key={`selected-student-${optionId || index}`}
                                        label={`${displayName}${rollNoText}`}
                                        {...restTagProps}
                                        size="small"
                                        color="primary"
                                    />
                                );
                            })
                        }
                        renderOption={(props, option) => {
                            const optionId = option?.reg_Id || option?.id;
                            const name = option.frist_Name || option.Frist_Name || option.name || `Student ${optionId || 'Unknown'}`;
                            const rollNo = getStudentRollNo(option);
                            const rollNoText = (rollNo && rollNo > 0) ? `Roll No: ${rollNo}` : 'No Roll No';
                            const className = classMap.get(option.Class_ID) || '';
                            const sectionName = option.Section || '';
                            const isSelected = selectedStudentsDirect.includes(optionId);
                            return (
                                <li {...props} key={`student-option-${optionId}`}>
                                    <Checkbox checked={isSelected} />
                                    <ListItemText 
                                        primary={name}
                                        secondary={`${rollNoText} ${className} ${sectionName}`}
                                    />
                                </li>
                            );
                        }}
                    />
                )}
                
                {selectedStudentsDirect.length > 0 && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                        <Typography variant="body2">
                            <strong>{selectedStudentsDirect.length}</strong> student(s) selected directly.
                        </Typography>
                    </Alert>
                )}
            </Box>
        );
    }

    // Section selection with per-section student selection
    if (targetType === 'SECTION') {
        const availableClassIds = [...new Set(allSections.map(s => s.Class_ID || s.class_ID).filter(Boolean))];
        const classOptions = classes.filter(c => availableClassIds.includes(c.Class_ID || c.class_ID));
        const selectedSectionObjects = getSelectedSectionObjects();

        return (
            <Box>
                <Typography variant="subtitle2" gutterBottom>
                    <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Select Class First, then Sections
                </Typography>
                
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel>Select Class</InputLabel>
                    <Select
                        value={selectedClassForSections || ''}
                        onChange={(e) => {
                            setSelectedClassForSections(e.target.value);
                            setSelectedSections([]);
                            setSelectedSectionsData([]);
                            setSelectedStudentsPerSection({});
                        }}
                        label="Select Class"
                        disabled={disabled}
                    >
                        <MenuItem value="">-- Select a class --</MenuItem>
                        {classOptions.map((cls) => {
                            const clsId = cls.Class_ID || cls.class_ID;
                            const clsName = cls.Class_Name || cls.class_Name;
                            return (
                                <MenuItem key={clsId} value={clsId}>
                                    {clsName}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>

                {selectedClassForSections && (
                    <>
                        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                            <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Select Sections
                        </Typography>
                        <Autocomplete
                            multiple
                            options={filteredSections}
                            getOptionLabel={getSectionDisplay}
                            value={selectedSectionObjects}
                            onChange={handleSectionChange}
                            disabled={disabled}
                            disableCloseOnSelect
                            isOptionEqualToValue={(option, value) => (option.ID || option.id) === (value.ID || value.id)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Search and select sections..."
                                    variant="outlined"
                                />
                            )}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => {
                                    const optionId = option.ID || option.id;
                                    const tagProps = getTagProps({ index });
                                    const { key, ...restTagProps } = tagProps;
                                    return (
                                        <Chip
                                            key={`selected-section-${optionId}`}
                                            label={getSectionDisplay(option)}
                                            {...restTagProps}
                                            size="small"
                                            color="secondary"
                                        />
                                    );
                                })
                            }
                            renderOption={(props, option) => {
                                const optionId = option.ID || option.id;
                                const className = classMap.get(option.Class_ID || option.class_ID) || 'Unknown Class';
                                return (
                                    <li {...props} key={`section-option-${optionId}`}>
                                        <Checkbox checked={selectedSections.includes(optionId)} />
                                        <ListItemText 
                                            primary={`${option.Section || option.section || `Section ${optionId}`}`}
                                            secondary={`Class: ${className}`}
                                        />
                                    </li>
                                );
                            }}
                        />

                        {selectedSections.length > 0 && (
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    <ChildIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    Select Students for Each Section
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Total students selected across all sections: <strong>{getTotalSelectedStudents()}</strong>
                                </Typography>
                                
                                {selectedSectionsData.map((sectionData) => {
                                    const sectionId = sectionData.SectionID;
                                    const section = sectionsWithClassName.find(s => (s.ID || s.id) === sectionId);
                                    if (!section) return null;
                                    
                                    return (
                                        <Accordion key={`section-${sectionId}`} sx={{ mb: 2, bgcolor: '#f9f9f9' }}>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Box display="flex" alignItems="center" gap={2} flex={1}>
                                                    <SchoolIcon color="secondary" />
                                                    <Typography variant="subtitle1">
                                                        {getSectionDisplay(section)}
                                                    </Typography>
                                                    <Chip 
                                                        label={`${(selectedStudentsPerSection[sectionId] || []).length} students selected`} 
                                                        size="small" 
                                                        color={(selectedStudentsPerSection[sectionId] || []).length > 0 ? "primary" : "default"}
                                                    />
                                                </Box>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                    Select specific students from this section.
                                                </Typography>

                                                <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                                                    <InputLabel>Select Section to View Students</InputLabel>
                                                    <Select
                                                        value={selectedSectionForStudents || ''}
                                                        onChange={(e) => {
                                                            setSelectedSectionForStudents(e.target.value);
                                                        }}
                                                        label="Select Section to View Students"
                                                        disabled={disabled}
                                                    >
                                                        <MenuItem value="">-- Select a section --</MenuItem>
                                                        <MenuItem value={sectionId}>
                                                            {getSectionDisplay(section)}
                                                        </MenuItem>
                                                    </Select>
                                                </FormControl>

                                                {selectedSectionForStudents === sectionId && (
                                                    <>
                                                        {studentsLoading ? (
                                                            <Box display="flex" justifyContent="center" p={2}>
                                                                <CircularProgress size={30} />
                                                            </Box>
                                                        ) : studentsError ? (
                                                            <Alert severity="error">
                                                                Error loading students: {studentsError.data?.message || studentsError.message}
                                                            </Alert>
                                                        ) : students.length === 0 ? (
                                                            <Alert severity="info">
                                                                No students found in this section.
                                                            </Alert>
                                                        ) : (
                                                            <Autocomplete
                                                                multiple
                                                                options={students}
                                                                getOptionLabel={getStudentDisplay}
                                                                value={getSelectedStudentObjectsForSection(sectionId)}
                                                                onChange={(event, newValue) => handleStudentChangeForSection(sectionId, newValue)}
                                                                disabled={disabled}
                                                                disableCloseOnSelect
                                                                isOptionEqualToValue={(option, value) => {
                                                                    const optionId = option?.reg_Id || option?.id;
                                                                    const valueId = value?.reg_Id || value?.id;
                                                                    return optionId === valueId;
                                                                }}
                                                                getOptionKey={(option) => {
                                                                    const optionId = option?.reg_Id || option?.id;
                                                                    return `student-${optionId}`;
                                                                }}
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        placeholder="Search and select students..."
                                                                        variant="outlined"
                                                                        helperText={`${students.length} students available`}
                                                                    />
                                                                )}
                                                                renderTags={(value, getTagProps) =>
                                                                    value.map((option, index) => {
                                                                        const optionId = option?.reg_Id || option?.id;
                                                                        const tagProps = getTagProps({ index });
                                                                        const { key, ...restTagProps } = tagProps;
                                                                        const displayName = option.frist_Name || option.Frist_Name || option.name || `Student ${optionId}`;
                                                                        const rollNo = getStudentRollNo(option);
                                                                        const rollNoText = rollNo ? ` (${rollNo})` : '';
                                                                        return (
                                                                            <Chip
                                                                                key={`selected-student-${optionId || index}`}
                                                                                label={`${displayName}${rollNoText}`}
                                                                                {...restTagProps}
                                                                                size="small"
                                                                                color="info"
                                                                            />
                                                                        );
                                                                    })
                                                                }
                                                                renderOption={(props, option) => {
                                                                    const optionId = option?.reg_Id || option?.id;
                                                                    const name = option.frist_Name || option.Frist_Name || option.name || `Student ${optionId || 'Unknown'}`;
                                                                    const rollNo = getStudentRollNo(option);
                                                                    const rollNoText = (rollNo && rollNo > 0) ? `Roll No: ${rollNo}` : 'No Roll No';
                                                                    const familyCode = option.Family_Code ? `Family: ${option.Family_Code}` : '';
                                                                    const isSelected = (selectedStudentsPerSection[sectionId] || []).includes(optionId);
                                                                    return (
                                                                        <li {...props} key={`student-option-${optionId}`}>
                                                                            <Checkbox checked={isSelected} />
                                                                            <ListItemText 
                                                                                primary={name}
                                                                                secondary={`${rollNoText} ${familyCode}`}
                                                                            />
                                                                        </li>
                                                                    );
                                                                }}
                                                            />
                                                        )}
                                                    </>
                                                )}
                                            </AccordionDetails>
                                        </Accordion>
                                    );
                                })}
                            </Box>
                        )}
                    </>
                )}

                {selectedSections.length > 0 && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                        <Typography variant="body2">
                            <strong>{selectedSections.length}</strong> section(s) selected. 
                            <strong>{getTotalSelectedStudents()}</strong> total student(s) selected across all sections.
                        </Typography>
                    </Alert>
                )}
            </Box>
        );
    }

    // Specific users selection
    if (targetType === 'SPECIFIC_USERS') {
        return (
            <Box>
                <Typography variant="subtitle2" gutterBottom>
                    <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Select Specific Users
                </Typography>
                <Autocomplete
                    multiple
                    options={users}
                    getOptionLabel={getUserDisplay}
                    value={getSelectedUserObjects()}
                    onChange={handleUserChange}
                    disabled={disabled || usersLoading}
                    loading={usersLoading}
                    disableCloseOnSelect
                    isOptionEqualToValue={(option, value) => (option.ID || option.id) === (value.ID || value.id)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder="Search and select users..."
                            variant="outlined"
                        />
                    )}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => {
                            const optionId = option.ID || option.id;
                            const tagProps = getTagProps({ index });
                            const { key, ...restTagProps } = tagProps;
                            return (
                                <Chip
                                    key={`selected-user-${optionId}`}
                                    label={getUserDisplay(option)}
                                    {...restTagProps}
                                    size="small"
                                />
                            );
                        })
                    }
                    renderOption={(props, option) => {
                        const optionId = option.ID || option.id;
                        return (
                            <li {...props} key={`user-option-${optionId}`}>
                                <Checkbox checked={selectedUsers.includes(optionId)} />
                                <ListItemText 
                                    primary={getUserDisplay(option)}
                                    secondary={option.Role?.Role || option.userType || option.Designation || 'User'}
                                />
                            </li>
                        );
                    }}
                />
            </Box>
        );
    }

    // Fee configuration
    if (category === 'FEE') {
        return (
            <Box>
                <Typography variant="subtitle2" gutterBottom>
                    <CategoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Fee Reminder Configuration
                </Typography>
                
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Reminder Interval (Days)"
                            type="number"
                            value={feeSettings.intervalDays}
                            onChange={(e) => handleFeeSettingChange('intervalDays', parseInt(e.target.value) || 3)}
                            helperText="How often to send reminders"
                            InputProps={{ 
                                inputProps: { min: 1, max: 30 },
                                endAdornment: <InputAdornment position="end">days</InputAdornment>
                            }}
                            disabled={disabled}
                            size="small"
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Minimum Due Amount"
                            type="number"
                            value={feeSettings.minAmount}
                            onChange={(e) => handleFeeSettingChange('minAmount', parseInt(e.target.value) || 0)}
                            helperText="Only remind if due amount is above this"
                            InputProps={{ 
                                inputProps: { min: 0 },
                                startAdornment: <InputAdornment position="start">Rs.</InputAdornment>
                            }}
                            disabled={disabled}
                            size="small"
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Minimum Days Overdue"
                            type="number"
                            value={feeSettings.minDaysOverdue}
                            onChange={(e) => handleFeeSettingChange('minDaysOverdue', parseInt(e.target.value) || 0)}
                            helperText="Remind only after this many days overdue"
                            InputProps={{ inputProps: { min: 0 } }}
                            disabled={disabled}
                            size="small"
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Maximum Days Overdue"
                            type="number"
                            value={feeSettings.maxDaysOverdue}
                            onChange={(e) => handleFeeSettingChange('maxDaysOverdue', parseInt(e.target.value) || 90)}
                            helperText="Stop reminding after this many days"
                            InputProps={{ inputProps: { min: 1, max: 365 } }}
                            disabled={disabled}
                            size="small"
                        />
                    </Grid>
                    
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={feeSettings.excludePartialPayments}
                                    onChange={(e) => handleFeeSettingChange('excludePartialPayments', e.target.checked)}
                                    disabled={disabled}
                                />
                            }
                            label="Exclude Partial Payments"
                        />
                        <Typography variant="caption" color="text.secondary" display="block">
                            If checked, users who have made partial payments will not receive reminders
                        </Typography>
                    </Grid>
                </Grid>

                {renderFeeIntervals()}

                <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                        Fee reminders will be sent every {feeSettings.intervalDays} days for dues above 
                        Rs.{feeSettings.minAmount.toLocaleString()} and will stop after {feeSettings.maxDaysOverdue} days overdue.
                        {feeSettings.intervals.beforeDueDate.length > 0 && 
                            ` Will also send reminders ${feeSettings.intervals.beforeDueDate.join(', ')} days before due date and 
                            ${feeSettings.intervals.afterDueDate.join(', ')} days after due date.`}
                        {feeSettings.onlyWeekdays && ' Reminders will only be sent on weekdays.'}
                        {feeSettings.intervals.excludeWeekends && ' Weekends are excluded from interval calculations.'}
                    </Typography>
                </Alert>
            </Box>
        );
    }

    return null;
};

export default TargetFilterBuilder;