// // // // // export default NotificationRuleForm;
// // // // import React, { useState, useEffect, useRef } from 'react';
// // // // import {
// // // //     Box,
// // // //     Button,
// // // //     Card,
// // // //     CardContent,
// // // //     CardHeader,
// // // //     FormControl,
// // // //     FormControlLabel,
// // // //     Grid,
// // // //     MenuItem,
// // // //     Switch,
// // // //     TextField,
// // // //     Typography,
// // // //     Chip,
// // // //     IconButton,
// // // //     Divider,
// // // //     Alert,
// // // //     Stepper,
// // // //     Step,
// // // //     StepLabel,
// // // //     Paper,
// // // //     InputAdornment,
// // // //     Tooltip,
// // // //     CircularProgress,
// // // //     Select,
// // // //     InputLabel,
// // // //     FormHelperText,
// // // //     Snackbar,
// // // //     LinearProgress,
// // // //     List,
// // // //     ListItem,
// // // //     ListItemText,
// // // //     Tabs,
// // // //     Tab,
// // // //     Dialog,
// // // //     DialogTitle,
// // // //     DialogContent,
// // // //     DialogActions,
// // // //     Radio,
// // // //     RadioGroup,
// // // // } from '@mui/material';
// // // // import {
// // // //     Add as AddIcon,
// // // //     Info as InfoIcon,
// // // //     CheckCircle as CheckCircleIcon,
// // // //     Error as ErrorIcon,
// // // //     Send as SendIcon,
// // // //     Save as SaveIcon,
// // // //     Cancel as CancelIcon,
// // // //     Refresh as RefreshIcon,
// // // //     PlayArrow as PlayArrowIcon,
// // // //     Schedule as ScheduleIcon,
// // // //     Payment as PaymentIcon,
// // // //     AccountBalance as AccountBalanceIcon,
// // // //     School as SchoolIcon,
// // // //     Assignment as AssignmentIcon,
// // // //     Announcement as AnnouncementIcon,
// // // //     Warning as WarningIcon,
// // // //     Event as EventIcon,
// // // //     Person as PersonIcon,
// // // //     AccessTime as AccessTimeIcon,
// // // //     Timer as TimerIcon,
// // // //     Today as TodayIcon,
// // // //     CalendarToday as CalendarTodayIcon,
// // // //     ViewWeek as ViewWeekIcon,
// // // //     EventNote as EventNoteIcon,
// // // //     FilterList as FilterListIcon,
// // // //     Settings as SettingsIcon,
// // // //     Message as MessageIcon,
// // // //     DataUsage as DataIcon
// // // // } from '@mui/icons-material';
// // // // import { useNavigate, useParams } from 'react-router-dom';
// // // // import { Formik, Form } from 'formik';
// // // // import * as Yup from 'yup';
// // // // import { usePermissions } from '../../../customHook/usePermissions';
// // // // import {
// // // //     useGetNotificationRuleByIdQuery,
// // // //     useCreateNotificationRuleMutation,
// // // //     useUpdateNotificationRuleMutation,
// // // //     useTestNotificationRuleMutation,
// // // //     useExecuteNotificationRuleMutation,
// // // // } from '../../../store/api/notificationApi';
// // // // import { useSelector } from 'react-redux';

// // // // // Validation Schema
// // // // const validationSchema = Yup.object({
// // // //     ruleName: Yup.string()
// // // //         .required('Rule name is required')
// // // //         .max(100, 'Rule name must be less than 100 characters'),
// // // //     ruleType: Yup.string().required('Rule type is required'),
// // // //     category: Yup.string().required('Category is required'),
// // // //     titleTemplate: Yup.string()
// // // //         .required('Title template is required')
// // // //         .max(200, 'Title must be less than 200 characters'),
// // // //     messageTemplate: Yup.string()
// // // //         .required('Message template is required')
// // // //         .max(1000, 'Message must be less than 1000 characters'),
// // // //     targetType: Yup.string().required('Target type is required'),
// // // //     isActive: Yup.boolean(),
// // // //     priority: Yup.number()
// // // //         .min(1, 'Priority must be between 1-3')
// // // //         .max(3, 'Priority must be between 1-3')
// // // //         .required('Priority is required'),
// // // //     isBatch: Yup.boolean(),
// // // //     timingType: Yup.string().required('Timing type is required'),
// // // //     cronExpression: Yup.string().nullable(),
// // // //     daysOffset: Yup.number().min(0, 'Days offset must be positive').nullable(),
// // // //     fixedTime: Yup.string().nullable(),
// // // //     targetFilter: Yup.string().test(
// // // //         'json',
// // // //         'Must be valid JSON',
// // // //         (value) => {
// // // //             if (!value) return true;
// // // //             try {
// // // //                 JSON.parse(value);
// // // //                 return true;
// // // //             } catch {
// // // //                 return false;
// // // //             }
// // // //         }
// // // //     )
// // // // });

// // // // // Initial values
// // // // const getInitialValues = (userData = null) => ({
// // // //     ruleName: '',
// // // //     ruleType: 'CRON',
// // // //     category: 'FEE',
// // // //     sourceTable: '',
// // // //     triggerField: '',
// // // //     triggerValue: '',
// // // //     timingType: 'DAILY',
// // // //     fixedTime: '09:00',
// // // //     daysOffset: 1,
// // // //     cronExpression: '0 9 * * *',
// // // //     titleTemplate: '',
// // // //     messageTemplate: '',
// // // //     dataTemplate: '',
// // // //     targetType: 'PARENTS',
// // // //     targetFilter: '{}',
// // // //     isActive: true,
// // // //     isBatch: true,
// // // //     priority: 2,
// // // //     createdBy: userData?.id || 1,
// // // // });

// // // // const steps = [
// // // //     { label: 'Basic Info', icon: <InfoIcon /> },
// // // //     { label: 'Schedule & Timing', icon: <ScheduleIcon /> },
// // // //     { label: 'Target & Filters', icon: <FilterListIcon /> },
// // // //     { label: 'Content', icon: <AssignmentIcon /> },
// // // //     { label: 'Advanced', icon: <SettingsIcon /> },
// // // // ];

// // // // // Categories with icons
// // // // const categories = [
// // // //     { value: 'FEE', label: 'Fee', color: 'secondary', icon: <PaymentIcon />, description: 'Fee-related notifications' },
// // // //     { value: 'ATTENDANCE', label: 'Attendance', color: 'primary', icon: <AccountBalanceIcon />, description: 'Attendance notifications' },
// // // //     { value: 'EXAM', label: 'Exam', color: 'info', icon: <SchoolIcon />, description: 'Exam notifications' },
// // // //     { value: 'HOMEWORK', label: 'Homework', color: 'success', icon: <AssignmentIcon />, description: 'Homework assignments' },
// // // //     { value: 'ANNOUNCEMENT', label: 'Announcement', color: 'warning', icon: <AnnouncementIcon />, description: 'School announcements' },
// // // //     { value: 'GENERAL', label: 'General', color: 'default', icon: <InfoIcon />, description: 'General notifications' },
// // // //     { value: 'ALERT', label: 'Alert', color: 'error', icon: <WarningIcon />, description: 'Important alerts' },
// // // //     { value: 'EVENT', label: 'Event', color: 'info', icon: <EventIcon />, description: 'School events' },
// // // // ];

// // // // const ruleTypes = [
// // // //     { value: 'EVENT', label: 'Event Trigger', description: 'Triggered by database events', icon: <EventIcon /> },
// // // //     { value: 'CRON', label: 'Scheduled (Cron)', description: 'Runs on a schedule', icon: <ScheduleIcon /> },
// // // //     { value: 'MANUAL', label: 'Manual', description: 'Manual trigger only', icon: <PlayArrowIcon /> },
// // // // ];

// // // // const timingTypes = [
// // // //     { value: 'IMMEDIATE', label: 'Immediate', icon: <AccessTimeIcon />, description: 'Run immediately when triggered' },
// // // //     { value: 'FIXED_TIME', label: 'Fixed Time', icon: <TimerIcon />, description: 'Run at specific time each day' },
// // // //     { value: 'DAYS_OFFSET', label: 'Days Offset', icon: <TodayIcon />, description: 'Run every X days' },
// // // //     { value: 'CRON', label: 'Cron Expression', icon: <CalendarTodayIcon />, description: 'Advanced scheduling' },
// // // //     { value: 'DAILY', label: 'Daily', icon: <TodayIcon />, description: 'Run once per day' },
// // // //     { value: 'WEEKLY', label: 'Weekly', icon: <ViewWeekIcon />, description: 'Run once per week' },
// // // //     { value: 'MONTHLY', label: 'Monthly', icon: <CalendarTodayIcon />, description: 'Run once per month' },
// // // // ];

// // // // const targetTypes = [
// // // //     { value: 'ALL', label: 'All Users', icon: <PersonIcon /> },
// // // //     { value: 'PARENTS', label: 'Parents Only', icon: <PersonIcon /> },
// // // //     { value: 'TEACHERS', label: 'Teachers Only', icon: <PersonIcon /> },
// // // //     { value: 'STUDENTS', label: 'Students Only', icon: <PersonIcon /> },
// // // //     { value: 'CLASS', label: 'Class Specific', icon: <SchoolIcon /> },
// // // //     { value: 'SECTION', label: 'Section Specific', icon: <SchoolIcon /> },
// // // //     { value: 'SPECIFIC_USERS', label: 'Specific Users', icon: <PersonIcon /> },
// // // // ];

// // // // const priorities = [
// // // //     { value: 1, label: 'High', color: 'error', description: 'Urgent notifications' },
// // // //     { value: 2, label: 'Medium', color: 'warning', description: 'Regular reminders' },
// // // //     { value: 3, label: 'Low', color: 'info', description: 'Informational updates' },
// // // // ];

// // // // // Sample variables
// // // // const sampleVariables = {
// // // //     COMMON: [
// // // //         { name: 'CurrentDate', description: 'Current date', sample: '25/01/2024' },
// // // //         { name: 'CurrentTime', description: 'Current time', sample: '14:30' },
// // // //         { name: 'RuleName', description: 'Rule name', sample: 'Fee Reminder' },
// // // //         { name: 'Category', description: 'Notification category', sample: 'FEE' },
// // // //     ],
// // // //     FEE: [
// // // //         { name: 'StudentName', description: 'Student name', sample: 'John Doe' },
// // // //         { name: 'ParentName', description: 'Parent name', sample: 'Mr. Smith' },
// // // //         { name: 'DueAmount', description: 'Due amount', sample: '5000' },
// // // //         { name: 'DueDate', description: 'Due date', sample: '31/01/2024' },
// // // //         { name: 'StatusText', description: 'Status description', sample: 'Due in 3 days' },
// // // //     ],
// // // //     ATTENDANCE: [
// // // //         { name: 'StudentName', description: 'Student name', sample: 'John Doe' },
// // // //         { name: 'Status', description: 'Attendance status', sample: 'Absent' },
// // // //         { name: 'AttendanceDate', description: 'Attendance date', sample: '25/01/2024' },
// // // //         { name: 'Remarks', description: 'Remarks', sample: 'Medical Leave' },
// // // //     ],
// // // //     EXAM: [
// // // //         { name: 'StudentName', description: 'Student name', sample: 'John Doe' },
// // // //         { name: 'ExamTitle', description: 'Exam title', sample: 'Mid Term Examination' },
// // // //         { name: 'ExamDate', description: 'Exam date', sample: '30/01/2024' },
// // // //         { name: 'Subject', description: 'Subject', sample: 'Mathematics' },
// // // //     ],
// // // //     HOMEWORK: [
// // // //         { name: 'StudentName', description: 'Student name', sample: 'John Doe' },
// // // //         { name: 'HomeworkTitle', description: 'Homework title', sample: 'Math Assignment' },
// // // //         { name: 'Subject', description: 'Subject', sample: 'Mathematics' },
// // // //         { name: 'DueDate', description: 'Due date', sample: '30/01/2024' },
// // // //     ],
// // // // };

// // // // // Rule templates
// // // // const ruleTemplates = [
// // // //     {
// // // //         id: 1,
// // // //         name: "Daily Fee Reminder",
// // // //         category: "FEE",
// // // //         description: "Send daily reminders for overdue fees",
// // // //         timingType: "DAILY",
// // // //         fixedTime: "09:00",
// // // //         titleTemplate: "Fee Payment Due: {StudentName}",
// // // //         messageTemplate: "Dear {ParentName},\nFee of Rs.{DueAmount} for {StudentName} is {StatusText}.\nDue date: {DueDate}",
// // // //         priority: 2
// // // //     },
// // // //     {
// // // //         id: 2,
// // // //         name: "Weekly Attendance Summary",
// // // //         category: "ATTENDANCE",
// // // //         description: "Weekly summary of student attendance",
// // // //         timingType: "WEEKLY",
// // // //         fixedTime: "17:00",
// // // //         titleTemplate: "Weekly Attendance Summary",
// // // //         messageTemplate: "Attendance Summary for {StudentName}\nStatus: {Status}\nDate: {AttendanceDate}",
// // // //         priority: 3
// // // //     },
// // // //     {
// // // //         id: 3,
// // // //         name: "Exam Reminder",
// // // //         category: "EXAM",
// // // //         description: "Remind students about exams",
// // // //         timingType: "DAYS_OFFSET",
// // // //         daysOffset: 3,
// // // //         titleTemplate: "Exam Reminder: {ExamTitle}",
// // // //         messageTemplate: "Dear Student,\n{ExamTitle} is scheduled on {ExamDate}.\nSubject: {Subject}",
// // // //         priority: 2
// // // //     },
// // // // ];

// // // // const NotificationRuleForm = () => {
// // // //     const navigate = useNavigate();
// // // //     const { id } = useParams();
// // // //     const { isAdmin, isManager, isTeacher } = usePermissions();
// // // //     const isEditMode = !!id;

// // // //     const [activeStep, setActiveStep] = useState(0);
// // // //     const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
// // // //     const [showTemplateDialog, setShowTemplateDialog] = useState(false);
// // // //     const [parsedTargetFilter, setParsedTargetFilter] = useState(null);
// // // //     const [activeTab, setActiveTab] = useState(0);
// // // //     const [selectedInsertField, setSelectedInsertField] = useState('titleTemplate');
// // // //     const [formikRef, setFormikRef] = useState(null);
// // // //     const [isSubmitting, setIsSubmitting] = useState(false);

// // // //     const titleRef = useRef();
// // // //     const messageRef = useRef();
// // // //     const dataRef = useRef();

// // // //     const authUser = useSelector((state) => state.auth.user);

// // // //     const { data: ruleData, isLoading: loadingRule, refetch } =
// // // //         useGetNotificationRuleByIdQuery(id, { skip: !isEditMode });

// // // // console.log("ruleData",ruleData)

// // // //     const [createRule, { isLoading: creating }] = useCreateNotificationRuleMutation();
// // // //     const [updateRule, { isLoading: updating }] = useUpdateNotificationRuleMutation();
// // // //     const [testRule, { isLoading: testing }] = useTestNotificationRuleMutation();
// // // //     const [executeRule, { isLoading: executing }] = useExecuteNotificationRuleMutation();

// // // //     const getCurrentUserId = () => {
// // // //         if (authUser?.id) return authUser.id;
// // // //         try {
// // // //             const storedUser = localStorage.getItem('user');
// // // //             if (storedUser) {
// // // //                 const user = JSON.parse(storedUser);
// // // //                 return user.id || user.userId || 1;
// // // //             }
// // // //         } catch (error) {
// // // //             return 1;
// // // //         }
// // // //         return 1;
// // // //     };

// // // //     const formatTimeForInput = (timeSpan) => {
// // // //         if (!timeSpan) return '09:00';
// // // //         try {
// // // //             const timeStr = typeof timeSpan === 'string' ? timeSpan : timeSpan.toString();
// // // //             const parts = timeStr.split(':');
// // // //             if (parts.length >= 2) {
// // // //                 return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
// // // //             }
// // // //             return '09:00';
// // // //         } catch (error) {
// // // //             return '09:00';
// // // //         }
// // // //     };

// // // //     const showSnackbar = (message, severity = 'success') => {
// // // //         setSnackbar({ open: true, message, severity });
// // // //     };

// // // //     const handleCloseSnackbar = () => {
// // // //         setSnackbar({ ...snackbar, open: false });
// // // //     };

// // // //     // Handle Next - prevents auto-submit
// // // //     const handleNext = (e) => {
// // // //         if (e) {
// // // //             e.preventDefault();
// // // //             e.stopPropagation();
// // // //         }
// // // //         if (activeStep < steps.length - 1) {
// // // //             setActiveStep(prev => prev + 1);
// // // //         }
// // // //     };

// // // //     // Handle Back
// // // //     const handleBack = (e) => {
// // // //         if (e) {
// // // //             e.preventDefault();
// // // //             e.stopPropagation();
// // // //         }
// // // //         if (activeStep > 0) {
// // // //             setActiveStep(prev => prev - 1);
// // // //         }
// // // //     };

// // // //     const handleTemplateSelect = (template, setValues) => {
// // // //         if (setValues) {
// // // //             setValues({
// // // //                 ...getInitialValues({ id: getCurrentUserId() }),
// // // //                 ruleName: template.name,
// // // //                 category: template.category,
// // // //                 timingType: template.timingType,
// // // //                 fixedTime: template.fixedTime || '09:00',
// // // //                 daysOffset: template.daysOffset || 1,
// // // //                 titleTemplate: template.titleTemplate || '',
// // // //                 messageTemplate: template.messageTemplate || '',
// // // //                 priority: template.priority || 2,
// // // //                 isBatch: true,
// // // //             });
// // // //         }
// // // //         setShowTemplateDialog(false);
// // // //         showSnackbar(`Template "${template.name}" applied successfully`, 'success');
// // // //     };

// // // //     const handleSubmit = async (values, { setSubmitting: formikSetSubmitting }) => {
// // // //         if (isSubmitting) return;
// // // //         if (activeStep !== steps.length - 1) {
// // // //             showSnackbar('Please complete all steps before submitting', 'warning');
// // // //             formikSetSubmitting(false);
// // // //             return;
// // // //         }

// // // //         setIsSubmitting(true);

// // // //         try {
// // // //             const currentUserId = getCurrentUserId();
            
// // // //             const isManualTrigger = values.ruleType === 'MANUAL' || 
// // // //                                    (values.ruleType === 'EVENT' && values.timingType === 'IMMEDIATE');

// // // //             let targetFilterString = '{}';
// // // //             if (values.targetFilter && values.targetFilter.trim() !== '' && values.targetFilter !== '{}') {
// // // //                 try {
// // // //                     const parsed = JSON.parse(values.targetFilter);
// // // //                     targetFilterString = JSON.stringify(parsed);
// // // //                 } catch (error) {
// // // //                     targetFilterString = '{}';
// // // //                 }
// // // //             }

// // // //             // Format fixedTime correctly (HH:mm:ss)
// // // //             let formattedFixedTime = null;
// // // //             if (values.timingType === 'FIXED_TIME' || values.timingType === 'DAILY') {
// // // //                 if (values.fixedTime) {
// // // //                     const timeParts = values.fixedTime.split(':');
// // // //                     if (timeParts.length === 2) {
// // // //                         formattedFixedTime = `${timeParts[0].padStart(2, '0')}:${timeParts[1].padStart(2, '0')}:00`;
// // // //                     } else {
// // // //                         formattedFixedTime = '09:00:00';
// // // //                     }
// // // //                 }
// // // //             }

// // // //             // Format cron expression (ensure 5 parts)
// // // //             let formattedCronExpression = null;
// // // //             if (values.timingType === 'CRON' && values.cronExpression) {
// // // //                 const cronParts = values.cronExpression.trim().split(/\s+/);
// // // //                 if (cronParts.length === 6) {
// // // //                     formattedCronExpression = cronParts.slice(1).join(' ');
// // // //                 } else if (cronParts.length === 5) {
// // // //                     formattedCronExpression = values.cronExpression.trim();
// // // //                 } else {
// // // //                     formattedCronExpression = '0 9 * * *';
// // // //                 }
// // // //             }

// // // //             const ruleDataToSend = {
// // // //                 ruleName: values.ruleName?.trim() || '',
// // // //                 ruleType: values.ruleType || 'EVENT',
// // // //                 category: values.category || 'GENERAL',
// // // //                 isManualTrigger: isManualTrigger,
// // // //                 sourceTable: values.ruleType === 'EVENT' ? (values.sourceTable?.trim() || null) : null,
// // // //                 triggerField: values.ruleType === 'EVENT' ? (values.triggerField?.trim() || null) : null,
// // // //                 triggerValue: values.ruleType === 'EVENT' ? (values.triggerValue?.trim() || null) : null,
// // // //                 timingType: values.timingType || 'IMMEDIATE',
// // // //                 daysOffset: values.timingType === 'DAYS_OFFSET' ? (values.daysOffset || 1) : null,
// // // //                 fixedTime: formattedFixedTime,
// // // //                 cronExpression: formattedCronExpression,
// // // //                 titleTemplate: values.titleTemplate?.trim() || '',
// // // //                 messageTemplate: values.messageTemplate?.trim() || '',
// // // //                 dataTemplate: values.dataTemplate?.trim() || null,
// // // //                 targetType: values.targetType || 'ALL',
// // // //                 targetFilter: targetFilterString,
// // // //                 isBatch: values.isBatch ?? true,
// // // //                 priority: parseInt(values.priority) || 2,
// // // //                 isActive: values.isActive ?? true,
// // // //                 createdBy: currentUserId
// // // //             };

// // // //             if (isEditMode) {
// // // //                 await updateRule({ id, ...ruleDataToSend }).unwrap();
// // // //                 showSnackbar('Rule updated successfully!', 'success');
// // // //                 refetch();
// // // //             } else {
// // // //                 await createRule(ruleDataToSend).unwrap();
// // // //                 showSnackbar('Rule created successfully!', 'success');
// // // //             }

// // // //             setTimeout(() => {
// // // //                 navigate('/dashboard/notification-rules');
// // // //             }, 1500);

// // // //         } catch (error) {
// // // //             let errorMessage = 'Failed to save rule. Please check your inputs.';
            
// // // //             if (error.data?.errors) {
// // // //                 const validationErrors = [];
// // // //                 Object.keys(error.data.errors).forEach(key => {
// // // //                     if (Array.isArray(error.data.errors[key])) {
// // // //                         validationErrors.push(...error.data.errors[key]);
// // // //                     }
// // // //                 });
// // // //                 errorMessage = validationErrors.join(', ');
// // // //             } else if (error.data?.message) {
// // // //                 errorMessage = error.data.message;
// // // //             } else if (error.status === 400) {
// // // //                 errorMessage = 'Bad request. Please check fixedTime format (HH:mm:ss) and other fields.';
// // // //             }
            
// // // //             showSnackbar(errorMessage, 'error');
// // // //         } finally {
// // // //             setIsSubmitting(false);
// // // //             formikSetSubmitting(false);
// // // //         }
// // // //     };

// // // //     const handleTestRule = async (ruleId) => {
// // // //         if (!ruleId) {
// // // //             showSnackbar('Please save the rule first before testing.', 'warning');
// // // //             return;
// // // //         }

// // // //         try {
// // // //             const testUserId = getCurrentUserId();
// // // //             await testRule({ id: ruleId, testData: { testUserID: testUserId } }).unwrap();
// // // //             showSnackbar('Rule test executed successfully!', 'success');
// // // //         } catch (error) {
// // // //             showSnackbar(error.data?.message || 'Test failed.', 'error');
// // // //         }
// // // //     };

// // // //     const handleExecuteRule = async (ruleId) => {
// // // //         if (!ruleId) {
// // // //             showSnackbar('Please save the rule first before executing.', 'warning');
// // // //             return;
// // // //         }

// // // //         try {
// // // //             await executeRule(ruleId).unwrap();
// // // //             showSnackbar('Rule executed successfully!', 'success');
// // // //         } catch (error) {
// // // //             showSnackbar(error.data?.message || 'Execution failed.', 'error');
// // // //         }
// // // //     };

// // // //     const insertVariableAtCursor = (variable, setFieldValue, values, fieldName, textareaRef) => {
// // // //         const variableText = `{${variable}}`;
// // // //         const currentValue = values[fieldName] || '';

// // // //         if (textareaRef && textareaRef.current) {
// // // //             const textarea = textareaRef.current;
// // // //             const startPos = textarea.selectionStart;
// // // //             const endPos = textarea.selectionEnd;

// // // //             const newValue = currentValue.substring(0, startPos) + variableText + currentValue.substring(endPos);
// // // //             setFieldValue(fieldName, newValue);

// // // //             setTimeout(() => {
// // // //                 textarea.focus();
// // // //                 textarea.setSelectionRange(startPos + variableText.length, startPos + variableText.length);
// // // //             }, 0);
// // // //         } else {
// // // //             setFieldValue(fieldName, currentValue + variableText);
// // // //         }
// // // //         showSnackbar(`Added {${variable}} to ${fieldName === 'titleTemplate' ? 'Title' : fieldName === 'messageTemplate' ? 'Message' : 'Data'}`, 'info');
// // // //     };

// // // //     const isStepValid = (values, errors, step) => {
// // // //         switch (step) {
// // // //             case 0:
// // // //                 return values.ruleName && values.ruleType && values.category;
// // // //             case 1:
// // // //                 if (!values.timingType) return false;
// // // //                 if (values.timingType === 'FIXED_TIME' && !values.fixedTime) return false;
// // // //                 if (values.timingType === 'DAYS_OFFSET' && (!values.daysOffset || values.daysOffset < 1)) return false;
// // // //                 if (values.timingType === 'CRON' && !values.cronExpression) return false;
// // // //                 return true;
// // // //             case 2:
// // // //                 return values.targetType;
// // // //             case 3:
// // // //                 return values.titleTemplate && values.messageTemplate;
// // // //             case 4:
// // // //                 return values.priority;
// // // //             default:
// // // //                 return true;
// // // //         }
// // // //     };

// // // //     const renderTimingConfiguration = (values, handleChange, setFieldValue) => {
// // // //         const timingType = values.timingType || 'IMMEDIATE';

// // // //         return (
// // // //             <Box sx={{ mt: 2 }}>
// // // //                 <Box sx={{ mb: 3 }}>
// // // //                     <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mb: 1 }}>
// // // //                         Select Timing Type
// // // //                     </Typography>
// // // //                     <FormControl fullWidth>
// // // //                         <InputLabel>Timing Type *</InputLabel>
// // // //                         <Select
// // // //                             name="timingType"
// // // //                             value={values.timingType}
// // // //                             onChange={handleChange}
// // // //                             label="Timing Type *"
// // // //                             disabled={isLoading}
// // // //                         >
// // // //                             {timingTypes.map((type) => (
// // // //                                 <MenuItem key={type.value} value={type.value}>
// // // //                                     <Box display="flex" alignItems="center" gap={1}>
// // // //                                         {type.icon}
// // // //                                         <Box>
// // // //                                             <Typography>{type.label}</Typography>
// // // //                                             <Typography variant="caption" color="text.secondary">
// // // //                                                 {type.description}
// // // //                                             </Typography>
// // // //                                         </Box>
// // // //                                     </Box>
// // // //                                 </MenuItem>
// // // //                             ))}
// // // //                         </Select>
// // // //                     </FormControl>
// // // //                 </Box>

// // // //                 {timingType === 'FIXED_TIME' && (
// // // //                     <Box sx={{ mb: 3 }}>
// // // //                         <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mb: 1 }}>
// // // //                             <TimerIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: '1rem' }} />
// // // //                             Fixed Time
// // // //                         </Typography>
// // // //                         <TextField
// // // //                             fullWidth
// // // //                             name="fixedTime"
// // // //                             label="Select Time"
// // // //                             type="time"
// // // //                             value={values.fixedTime || '09:00'}
// // // //                             onChange={handleChange}
// // // //                             InputLabelProps={{ shrink: true }}
// // // //                             helperText="Choose the time when notifications will be sent daily"
// // // //                         />
// // // //                     </Box>
// // // //                 )}

// // // //                 {timingType === 'DAYS_OFFSET' && (
// // // //                     <Box sx={{ mb: 3 }}>
// // // //                         <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mb: 1 }}>
// // // //                             <TodayIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: '1rem' }} />
// // // //                             Days Offset
// // // //                         </Typography>
// // // //                         <TextField
// // // //                             fullWidth
// // // //                             name="daysOffset"
// // // //                             label="Number of Days"
// // // //                             type="number"
// // // //                             value={values.daysOffset || 1}
// // // //                             onChange={handleChange}
// // // //                             InputProps={{
// // // //                                 endAdornment: <InputAdornment position="end">days</InputAdornment>,
// // // //                                 inputProps: { min: 1 }
// // // //                             }}
// // // //                             helperText="How many days between each notification"
// // // //                         />
// // // //                     </Box>
// // // //                 )}

// // // //                 {timingType === 'CRON' && (
// // // //                     <Box sx={{ mb: 3 }}>
// // // //                         <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mb: 1 }}>
// // // //                             <ScheduleIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: '1rem' }} />
// // // //                             Cron Expression
// // // //                         </Typography>
// // // //                         <TextField
// // // //                             fullWidth
// // // //                             name="cronExpression"
// // // //                             label="Cron Expression"
// // // //                             value={values.cronExpression || '0 9 * * *'}
// // // //                             onChange={handleChange}
// // // //                             helperText="Format: minute hour day month day-of-week (e.g., 0 9 * * * for daily at 9 AM)"
// // // //                             placeholder="0 9 * * *"
// // // //                         />
// // // //                         <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
// // // //                             Examples: "0 9 * * *" = Daily at 9 AM, "0 9 */3 * *" = Every 3 days at 9 AM
// // // //                         </Typography>
// // // //                     </Box>
// // // //                 )}

// // // //                 {(timingType === 'DAILY' || timingType === 'WEEKLY' || timingType === 'MONTHLY') && (
// // // //                     <Box sx={{ mb: 3 }}>
// // // //                         <Alert severity="info" icon={<InfoIcon />}>
// // // //                             <Typography variant="body2">
// // // //                                 This rule will run {timingType.toLowerCase()} at the scheduled time.
// // // //                             </Typography>
// // // //                         </Alert>
// // // //                     </Box>
// // // //                 )}

// // // //                 {timingType === 'IMMEDIATE' && (
// // // //                     <Box sx={{ mb: 3 }}>
// // // //                         <Alert severity="info" icon={<AccessTimeIcon />}>
// // // //                             <Typography variant="body2">
// // // //                                 Notifications will be sent immediately when the rule is triggered.
// // // //                             </Typography>
// // // //                         </Alert>
// // // //                     </Box>
// // // //                 )}
// // // //             </Box>
// // // //         );
// // // //     };

// // // //     // ✅ FIXED: Prepare initial values with proper targetFilter parsing
// // // //     const prepareInitialValues = () => {
// // // //         if (isEditMode && ruleData?.data) {
// // // //             const rule = ruleData.data;
// // // //             let targetFilterValue = '{}';
            
// // // //             if (rule.targetFilter) {
// // // //                 if (typeof rule.targetFilter === 'string') {
// // // //                     try {
// // // //                         const parsed = JSON.parse(rule.targetFilter);
// // // //                         targetFilterValue = JSON.stringify(parsed, null, 2);
// // // //                     } catch {
// // // //                         targetFilterValue = rule.targetFilter;
// // // //                     }
// // // //                 } else if (typeof rule.targetFilter === 'object') {
// // // //                     // Fix the ClassID array issue
// // // //                     if (rule.targetFilter.ClassID && Array.isArray(rule.targetFilter.ClassID)) {
// // // //                         const actualValues = [];
// // // //                         for (const item of rule.targetFilter.ClassID) {
// // // //                             if (Array.isArray(item) && item.length > 0) {
// // // //                                 actualValues.push(...item);
// // // //                             } else if (typeof item === 'number') {
// // // //                                 actualValues.push(item);
// // // //                             }
// // // //                         }
// // // //                         if (actualValues.length > 0) {
// // // //                             targetFilterValue = JSON.stringify({ ClassID: actualValues }, null, 2);
// // // //                         } else {
// // // //                             targetFilterValue = JSON.stringify(rule.targetFilter, null, 2);
// // // //                         }
// // // //                     } else {
// // // //                         targetFilterValue = JSON.stringify(rule.targetFilter, null, 2);
// // // //                     }
// // // //                 }
// // // //             }
            
// // // //             return {
// // // //                 ruleName: rule.ruleName || '',
// // // //                 ruleType: rule.ruleType || 'CRON',
// // // //                 category: rule.category || 'FEE',
// // // //                 sourceTable: rule.sourceTable || '',
// // // //                 triggerField: rule.triggerField || '',
// // // //                 triggerValue: rule.triggerValue || '',
// // // //                 timingType: rule.timingType || 'DAILY',
// // // //                 fixedTime: rule.fixedTime ? formatTimeForInput(rule.fixedTime) : '09:00',
// // // //                 daysOffset: rule.daysOffset || 1,
// // // //                 cronExpression: rule.cronExpression || '0 9 * * *',
// // // //                 titleTemplate: rule.titleTemplate || '',
// // // //                 messageTemplate: rule.messageTemplate || '',
// // // //                 dataTemplate: rule.dataTemplate || '',
// // // //                 targetType: rule.targetType || 'PARENTS',
// // // //                 targetFilter: targetFilterValue,
// // // //                 isActive: rule.isActive ?? true,
// // // //                 isBatch: rule.isBatch ?? true,
// // // //                 priority: rule.priority || 2,
// // // //                 createdBy: rule.createdBy || getCurrentUserId(),
// // // //             };
// // // //         }
// // // //         return getInitialValues({ id: getCurrentUserId() });
// // // //     };

// // // //     const isLoading = loadingRule || creating || updating || isSubmitting;

// // // //     if (!isAdmin() && !isManager() && !isTeacher()) {
// // // //         return (
// // // //             <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
// // // //                 <Alert severity="error">Access Denied - Notification rule management is only available to authorized users.</Alert>
// // // //             </Box>
// // // //         );
// // // //     }

// // // //     if (loadingRule && isEditMode) {
// // // //         return (
// // // //             <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
// // // //                 <CircularProgress size={60} />
// // // //                 <Typography sx={{ mt: 3 }}>Loading rule...</Typography>
// // // //             </Box>
// // // //         );
// // // //     }

// // // //     return (
// // // //         <Box sx={{ maxWidth: 1400, margin: '0 auto', p: { xs: 2, md: 3 } }}>
// // // //             <Box sx={{ mb: 4 }}>
// // // //                 <Typography variant="h4" gutterBottom>
// // // //                     {isEditMode ? 'Edit Notification Rule' : 'Create Notification Rule'}
// // // //                 </Typography>
// // // //                 <Typography variant="body1" color="text.secondary">
// // // //                     {isEditMode ? 'Modify your notification rule settings' : 'Define a new notification rule with complete flexibility'}
// // // //                 </Typography>
// // // //             </Box>

// // // //             <Paper sx={{ p: 3, mb: 4 }}>
// // // //                 <Stepper activeStep={activeStep} alternativeLabel>
// // // //                     {steps.map((step, index) => (
// // // //                         <Step key={step.label}>
// // // //                             <StepLabel icon={step.icon}>
// // // //                                 {step.label}
// // // //                             </StepLabel>
// // // //                         </Step>
// // // //                     ))}
// // // //                 </Stepper>
// // // //             </Paper>

// // // //             <Formik
// // // //                 initialValues={prepareInitialValues()}
// // // //                 validationSchema={validationSchema}
// // // //                 onSubmit={handleSubmit}
// // // //                 enableReinitialize={true}
// // // //                 validateOnMount={true}
// // // //                 validateOnChange={true}
// // // //                 validateOnBlur={true}
// // // //             >
// // // //                 {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isValid, setValues }) => {
// // // //                     if (!formikRef) {
// // // //                         setFormikRef(() => setValues);
// // // //                     }

// // // //                     return (
// // // //                         <Form>
// // // //                             <Grid container spacing={3}>
// // // //                                 <Grid item xs={12} lg={8}>
// // // //                                     <Card>
// // // //                                         <CardContent>
// // // //                                             {/* Step 0: Basic Info */}
// // // //                                             {activeStep === 0 && (
// // // //                                                 <Box>
// // // //                                                     <Typography variant="h6" gutterBottom>
// // // //                                                         <InfoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
// // // //                                                         Basic Information
// // // //                                                     </Typography>
// // // //                                                     <Grid container spacing={3}>
// // // //                                                         <Grid item xs={12}>
// // // //                                                             <TextField
// // // //                                                                 fullWidth
// // // //                                                                 name="ruleName"
// // // //                                                                 label="Rule Name *"
// // // //                                                                 value={values.ruleName}
// // // //                                                                 onChange={handleChange}
// // // //                                                                 onBlur={handleBlur}
// // // //                                                                 error={touched.ruleName && Boolean(errors.ruleName)}
// // // //                                                                 helperText={touched.ruleName && errors.ruleName || "Enter a descriptive name for this rule"}
// // // //                                                                 placeholder="e.g., Daily Fee Reminder"
// // // //                                                                 disabled={isLoading}
// // // //                                                             />
// // // //                                                         </Grid>
// // // //                                                         <Grid item xs={12} md={6}>
// // // //                                                             <FormControl fullWidth error={touched.ruleType && Boolean(errors.ruleType)}>
// // // //                                                                 <InputLabel>Rule Type *</InputLabel>
// // // //                                                                 <Select
// // // //                                                                     name="ruleType"
// // // //                                                                     value={values.ruleType}
// // // //                                                                     onChange={handleChange}
// // // //                                                                     onBlur={handleBlur}
// // // //                                                                     label="Rule Type *"
// // // //                                                                     disabled={isLoading}
// // // //                                                                 >
// // // //                                                                     {ruleTypes.map((type) => (
// // // //                                                                         <MenuItem key={type.value} value={type.value}>
// // // //                                                                             <Box display="flex" alignItems="center" gap={1}>
// // // //                                                                                 {type.icon}
// // // //                                                                                 <Box>
// // // //                                                                                     <Typography>{type.label}</Typography>
// // // //                                                                                     <Typography variant="caption" color="text.secondary">
// // // //                                                                                         {type.description}
// // // //                                                                                     </Typography>
// // // //                                                                                 </Box>
// // // //                                                                             </Box>
// // // //                                                                         </MenuItem>
// // // //                                                                     ))}
// // // //                                                                 </Select>
// // // //                                                                 {touched.ruleType && errors.ruleType && (
// // // //                                                                     <FormHelperText>{errors.ruleType}</FormHelperText>
// // // //                                                                 )}
// // // //                                                             </FormControl>
// // // //                                                         </Grid>
// // // //                                                         <Grid item xs={12} md={6}>
// // // //                                                             <FormControl fullWidth error={touched.category && Boolean(errors.category)}>
// // // //                                                                 <InputLabel>Category *</InputLabel>
// // // //                                                                 <Select
// // // //                                                                     name="category"
// // // //                                                                     value={values.category}
// // // //                                                                     onChange={handleChange}
// // // //                                                                     onBlur={handleBlur}
// // // //                                                                     label="Category *"
// // // //                                                                     disabled={isLoading}
// // // //                                                                 >
// // // //                                                                     {categories.map((cat) => (
// // // //                                                                         <MenuItem key={cat.value} value={cat.value}>
// // // //                                                                             <Box display="flex" alignItems="center" gap={1}>
// // // //                                                                                 <Chip
// // // //                                                                                     label={cat.label}
// // // //                                                                                     size="small"
// // // //                                                                                     color={cat.color}
// // // //                                                                                     icon={cat.icon}
// // // //                                                                                 />
// // // //                                                                                 <Box>
// // // //                                                                                     <Typography>{cat.label}</Typography>
// // // //                                                                                     <Typography variant="caption" color="text.secondary">
// // // //                                                                                         {cat.description}
// // // //                                                                                     </Typography>
// // // //                                                                                 </Box>
// // // //                                                                             </Box>
// // // //                                                                         </MenuItem>
// // // //                                                                     ))}
// // // //                                                                 </Select>
// // // //                                                                 {touched.category && errors.category && (
// // // //                                                                     <FormHelperText>{errors.category}</FormHelperText>
// // // //                                                                 )}
// // // //                                                             </FormControl>
// // // //                                                         </Grid>
// // // //                                                         <Grid item xs={12}>
// // // //                                                             <FormControlLabel
// // // //                                                                 control={
// // // //                                                                     <Switch
// // // //                                                                         name="isActive"
// // // //                                                                         checked={values.isActive}
// // // //                                                                         onChange={handleChange}
// // // //                                                                         color="success"
// // // //                                                                         disabled={isLoading}
// // // //                                                                     />
// // // //                                                                 }
// // // //                                                                 label={
// // // //                                                                     <Box display="flex" alignItems="center" gap={1}>
// // // //                                                                         {values.isActive ? (
// // // //                                                                             <CheckCircleIcon color="success" fontSize="small" />
// // // //                                                                         ) : (
// // // //                                                                             <ErrorIcon color="action" fontSize="small" />
// // // //                                                                         )}
// // // //                                                                         <Typography>
// // // //                                                                             {values.isActive ? 'Rule is active' : 'Rule is inactive'}
// // // //                                                                         </Typography>
// // // //                                                                     </Box>
// // // //                                                                 }
// // // //                                                             />
// // // //                                                         </Grid>
// // // //                                                     </Grid>
// // // //                                                 </Box>
// // // //                                             )}

// // // //                                             {/* Step 1: Schedule & Timing */}
// // // //                                             {activeStep === 1 && (
// // // //                                                 <Box>
// // // //                                                     <Typography variant="h6" gutterBottom>
// // // //                                                         <ScheduleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
// // // //                                                         Schedule & Timing Configuration
// // // //                                                     </Typography>
// // // //                                                     <Divider sx={{ mb: 3 }} />
// // // //                                                     {renderTimingConfiguration(values, handleChange, setFieldValue)}
// // // //                                                 </Box>
// // // //                                             )}

// // // //                                             {/* Step 2: Target & Filters */}
// // // //                                             {activeStep === 2 && (
// // // //                                                 <Box>
// // // //                                                     <Typography variant="h6" gutterBottom>
// // // //                                                         <FilterListIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
// // // //                                                         Target & Filter Configuration
// // // //                                                     </Typography>
// // // //                                                     <Divider sx={{ mb: 3 }} />
// // // //                                                     <Grid container spacing={3}>
// // // //                                                         <Grid item xs={12}>
// // // //                                                             <FormControl fullWidth error={touched.targetType && Boolean(errors.targetType)}>
// // // //                                                                 <InputLabel>Target Type *</InputLabel>
// // // //                                                                 <Select
// // // //                                                                     name="targetType"
// // // //                                                                     value={values.targetType}
// // // //                                                                     onChange={handleChange}
// // // //                                                                     onBlur={handleBlur}
// // // //                                                                     label="Target Type *"
// // // //                                                                     disabled={isLoading}
// // // //                                                                 >
// // // //                                                                     {targetTypes.map((type) => (
// // // //                                                                         <MenuItem key={type.value} value={type.value}>
// // // //                                                                             <Box display="flex" alignItems="center" gap={1}>
// // // //                                                                                 {type.icon}
// // // //                                                                                 <Typography>{type.label}</Typography>
// // // //                                                                             </Box>
// // // //                                                                         </MenuItem>
// // // //                                                                     ))}
// // // //                                                                 </Select>
// // // //                                                                 {touched.targetType && errors.targetType && (
// // // //                                                                     <FormHelperText>{errors.targetType}</FormHelperText>
// // // //                                                                 )}
// // // //                                                             </FormControl>
// // // //                                                         </Grid>

// // // //                                                         <Grid item xs={12}>
// // // //                                                             <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
// // // //                                                                 <Tab label="Basic Settings" />
// // // //                                                                 <Tab label="Advanced JSON" />
// // // //                                                             </Tabs>

// // // //                                                             <Box sx={{ mt: 2 }}>
// // // //                                                                 {activeTab === 0 ? (
// // // //                                                                     <Box>
// // // //                                                                         <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
// // // //                                                                             Basic configuration options will appear here based on selected category.
// // // //                                                                         </Typography>
// // // //                                                                         <TextField
// // // //                                                                             fullWidth
// // // //                                                                             label="Target Filter (JSON)"
// // // //                                                                             value={values.targetFilter}
// // // //                                                                             onChange={handleChange}
// // // //                                                                             multiline
// // // //                                                                             rows={4}
// // // //                                                                             disabled={isLoading}
// // // //                                                                             InputProps={{ style: { fontFamily: 'monospace' } }}
// // // //                                                                             placeholder='{"key": "value"}'
// // // //                                                                         />
// // // //                                                                     </Box>
// // // //                                                                 ) : (
// // // //                                                                     <TextField
// // // //                                                                         fullWidth
// // // //                                                                         name="targetFilter"
// // // //                                                                         label="Advanced Configuration (JSON)"
// // // //                                                                         value={values.targetFilter}
// // // //                                                                         onChange={(e) => {
// // // //                                                                             handleChange(e);
// // // //                                                                             try {
// // // //                                                                                 const parsed = JSON.parse(e.target.value);
// // // //                                                                                 setParsedTargetFilter(parsed);
// // // //                                                                             } catch (err) {
// // // //                                                                                 setParsedTargetFilter(null);
// // // //                                                                             }
// // // //                                                                         }}
// // // //                                                                         onBlur={handleBlur}
// // // //                                                                         error={touched.targetFilter && Boolean(errors.targetFilter)}
// // // //                                                                         helperText={touched.targetFilter && errors.targetFilter || "Advanced configuration in JSON format"}
// // // //                                                                         multiline
// // // //                                                                         rows={8}
// // // //                                                                         disabled={isLoading}
// // // //                                                                         InputProps={{
// // // //                                                                             style: { fontFamily: 'monospace', fontSize: '0.875rem' }
// // // //                                                                         }}
// // // //                                                                     />
// // // //                                                                 )}
// // // //                                                             </Box>
// // // //                                                         </Grid>

// // // //                                                         <Grid item xs={12}>
// // // //                                                             <FormControlLabel
// // // //                                                                 control={
// // // //                                                                     <Switch
// // // //                                                                         name="isBatch"
// // // //                                                                         checked={values.isBatch}
// // // //                                                                         onChange={handleChange}
// // // //                                                                         color="primary"
// // // //                                                                         disabled={isLoading}
// // // //                                                                     />
// // // //                                                                 }
// // // //                                                                 label={
// // // //                                                                     <Box display="flex" alignItems="center" gap={1}>
// // // //                                                                         <SendIcon fontSize="small" />
// // // //                                                                         <Typography>Send as batch notification</Typography>
// // // //                                                                         <Tooltip title="Batch notifications are processed together and can be tracked as a group">
// // // //                                                                             <InfoIcon fontSize="small" color="action" />
// // // //                                                                         </Tooltip>
// // // //                                                                     </Box>
// // // //                                                                 }
// // // //                                                             />
// // // //                                                         </Grid>
// // // //                                                     </Grid>
// // // //                                                 </Box>
// // // //                                             )}

// // // //                                             {/* Step 3: Content */}
// // // //                                             {activeStep === 3 && (
// // // //                                                 <Box>
// // // //                                                     <Typography variant="h6" gutterBottom>
// // // //                                                         <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
// // // //                                                         Notification Content
// // // //                                                     </Typography>
// // // //                                                     <Typography variant="body2" color="text.secondary" paragraph>
// // // //                                                         Define your notification content using variables in curly braces {'{}'}
// // // //                                                     </Typography>

// // // //                                                     <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.100' }}>
// // // //                                                         <Typography variant="subtitle2" gutterBottom>
// // // //                                                             Insert Variable Into:
// // // //                                                         </Typography>
// // // //                                                         <RadioGroup
// // // //                                                             row
// // // //                                                             value={selectedInsertField}
// // // //                                                             onChange={(e) => setSelectedInsertField(e.target.value)}
// // // //                                                         >
// // // //                                                             <FormControlLabel
// // // //                                                                 value="titleTemplate"
// // // //                                                                 control={<Radio />}
// // // //                                                                 label={
// // // //                                                                     <Box display="flex" alignItems="center" gap={0.5}>
// // // //                                                                         <AssignmentIcon fontSize="small" color="primary" />
// // // //                                                                         <Typography>Title</Typography>
// // // //                                                                     </Box>
// // // //                                                                 }
// // // //                                                             />
// // // //                                                             <FormControlLabel
// // // //                                                                 value="messageTemplate"
// // // //                                                                 control={<Radio />}
// // // //                                                                 label={
// // // //                                                                     <Box display="flex" alignItems="center" gap={0.5}>
// // // //                                                                         <MessageIcon fontSize="small" color="secondary" />
// // // //                                                                         <Typography>Message</Typography>
// // // //                                                                     </Box>
// // // //                                                                 }
// // // //                                                             />
// // // //                                                             <FormControlLabel
// // // //                                                                 value="dataTemplate"
// // // //                                                                 control={<Radio />}
// // // //                                                                 label={
// // // //                                                                     <Box display="flex" alignItems="center" gap={0.5}>
// // // //                                                                         <DataIcon fontSize="small" color="success" />
// // // //                                                                         <Typography>Data Payload</Typography>
// // // //                                                                     </Box>
// // // //                                                                 }
// // // //                                                             />
// // // //                                                         </RadioGroup>
// // // //                                                     </Paper>

// // // //                                                     <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
// // // //                                                         <Typography variant="subtitle2" gutterBottom>
// // // //                                                             Available Variables for {values.category || 'General'} Notifications
// // // //                                                         </Typography>
// // // //                                                         <Box display="flex" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
// // // //                                                             {sampleVariables.COMMON.map((variable) => (
// // // //                                                                 <Tooltip key={variable.name} title={`${variable.description} (Sample: ${variable.sample})`}>
// // // //                                                                     <Chip
// // // //                                                                         label={`{${variable.name}}`}
// // // //                                                                         size="small"
// // // //                                                                         onClick={() => insertVariableAtCursor(
// // // //                                                                             variable.name,
// // // //                                                                             setFieldValue,
// // // //                                                                             values,
// // // //                                                                             selectedInsertField,
// // // //                                                                             selectedInsertField === 'titleTemplate' ? titleRef : 
// // // //                                                                             selectedInsertField === 'messageTemplate' ? messageRef : dataRef
// // // //                                                                         )}
// // // //                                                                         variant="outlined"
// // // //                                                                         sx={{ cursor: 'pointer' }}
// // // //                                                                     />
// // // //                                                                 </Tooltip>
// // // //                                                             ))}
// // // //                                                             {sampleVariables[values.category]?.map((variable) => (
// // // //                                                                 <Tooltip key={variable.name} title={`${variable.description} (Sample: ${variable.sample})`}>
// // // //                                                                     <Chip
// // // //                                                                         label={`{${variable.name}}`}
// // // //                                                                         size="small"
// // // //                                                                         color="primary"
// // // //                                                                         onClick={() => insertVariableAtCursor(
// // // //                                                                             variable.name,
// // // //                                                                             setFieldValue,
// // // //                                                                             values,
// // // //                                                                             selectedInsertField,
// // // //                                                                             selectedInsertField === 'titleTemplate' ? titleRef : 
// // // //                                                                             selectedInsertField === 'messageTemplate' ? messageRef : dataRef
// // // //                                                                         )}
// // // //                                                                         sx={{ cursor: 'pointer' }}
// // // //                                                                     />
// // // //                                                                 </Tooltip>
// // // //                                                             ))}
// // // //                                                         </Box>
// // // //                                                     </Paper>

// // // //                                                     <Grid container spacing={3}>
// // // //                                                         <Grid item xs={12}>
// // // //                                                             <TextField
// // // //                                                                 fullWidth
// // // //                                                                 name="titleTemplate"
// // // //                                                                 label="Title Template *"
// // // //                                                                 value={values.titleTemplate}
// // // //                                                                 onChange={handleChange}
// // // //                                                                 onBlur={handleBlur}
// // // //                                                                 error={touched.titleTemplate && Boolean(errors.titleTemplate)}
// // // //                                                                 helperText={touched.titleTemplate && errors.titleTemplate || "Notification title (max 200 chars)"}
// // // //                                                                 multiline
// // // //                                                                 rows={2}
// // // //                                                                 disabled={isLoading}
// // // //                                                                 inputRef={titleRef}
// // // //                                                                 InputProps={{
// // // //                                                                     endAdornment: (
// // // //                                                                         <InputAdornment position="end">
// // // //                                                                             {values.titleTemplate.length}/200
// // // //                                                                         </InputAdornment>
// // // //                                                                     ),
// // // //                                                                     sx: {
// // // //                                                                         borderLeft: selectedInsertField === 'titleTemplate' ? '4px solid' : 'none',
// // // //                                                                         borderLeftColor: 'primary.main',
// // // //                                                                         pl: selectedInsertField === 'titleTemplate' ? 1 : 0
// // // //                                                                     }
// // // //                                                                 }}
// // // //                                                                 onClick={() => setSelectedInsertField('titleTemplate')}
// // // //                                                             />
// // // //                                                         </Grid>

// // // //                                                         <Grid item xs={12}>
// // // //                                                             <TextField
// // // //                                                                 fullWidth
// // // //                                                                 name="messageTemplate"
// // // //                                                                 label="Message Template *"
// // // //                                                                 value={values.messageTemplate}
// // // //                                                                 onChange={handleChange}
// // // //                                                                 onBlur={handleBlur}
// // // //                                                                 error={touched.messageTemplate && Boolean(errors.messageTemplate)}
// // // //                                                                 helperText={touched.messageTemplate && errors.messageTemplate || "Notification message (max 1000 chars)"}
// // // //                                                                 multiline
// // // //                                                                 rows={6}
// // // //                                                                 disabled={isLoading}
// // // //                                                                 inputRef={messageRef}
// // // //                                                                 InputProps={{
// // // //                                                                     endAdornment: (
// // // //                                                                         <InputAdornment position="end">
// // // //                                                                             {values.messageTemplate.length}/1000
// // // //                                                                         </InputAdornment>
// // // //                                                                     ),
// // // //                                                                     sx: {
// // // //                                                                         borderLeft: selectedInsertField === 'messageTemplate' ? '4px solid' : 'none',
// // // //                                                                         borderLeftColor: 'secondary.main',
// // // //                                                                         pl: selectedInsertField === 'messageTemplate' ? 1 : 0
// // // //                                                                     }
// // // //                                                                 }}
// // // //                                                                 onClick={() => setSelectedInsertField('messageTemplate')}
// // // //                                                             />
// // // //                                                         </Grid>

// // // //                                                         <Grid item xs={12}>
// // // //                                                             <TextField
// // // //                                                                 fullWidth
// // // //                                                                 name="dataTemplate"
// // // //                                                                 label="Data Template (JSON - Optional)"
// // // //                                                                 value={values.dataTemplate || ''}
// // // //                                                                 onChange={handleChange}
// // // //                                                                 onBlur={handleBlur}
// // // //                                                                 helperText="Additional data in JSON format for mobile apps"
// // // //                                                                 multiline
// // // //                                                                 rows={4}
// // // //                                                                 placeholder='{"action": "view_details", "id": "{ID}"}'
// // // //                                                                 disabled={isLoading}
// // // //                                                                 inputRef={dataRef}
// // // //                                                                 InputProps={{
// // // //                                                                     style: { fontFamily: 'monospace', fontSize: '0.875rem' },
// // // //                                                                     sx: {
// // // //                                                                         borderLeft: selectedInsertField === 'dataTemplate' ? '4px solid' : 'none',
// // // //                                                                         borderLeftColor: 'success.main',
// // // //                                                                         pl: selectedInsertField === 'dataTemplate' ? 1 : 0
// // // //                                                                     }
// // // //                                                                 }}
// // // //                                                                 onClick={() => setSelectedInsertField('dataTemplate')}
// // // //                                                             />
// // // //                                                         </Grid>
// // // //                                                     </Grid>

// // // //                                                     <Paper sx={{ p: 3, mt: 3, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
// // // //                                                         <Typography variant="subtitle2" gutterBottom color="primary">
// // // //                                                             Live Preview
// // // //                                                         </Typography>
// // // //                                                         <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1 }}>
// // // //                                                             <Typography variant="subtitle1" gutterBottom fontWeight="bold">
// // // //                                                                 {values.titleTemplate || 'Title will appear here'}
// // // //                                                             </Typography>
// // // //                                                             <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
// // // //                                                                 {values.messageTemplate || 'Message will appear here'}
// // // //                                                             </Typography>
// // // //                                                             {values.dataTemplate && (
// // // //                                                                 <Box sx={{ mt: 2, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
// // // //                                                                     <Typography variant="caption" color="text.secondary">
// // // //                                                                         Data Payload:
// // // //                                                                     </Typography>
// // // //                                                                     <pre style={{ margin: 0, fontSize: '0.75rem', overflowX: 'auto' }}>
// // // //                                                                         {values.dataTemplate}
// // // //                                                                     </pre>
// // // //                                                                 </Box>
// // // //                                                             )}
// // // //                                                         </Box>
// // // //                                                     </Paper>
// // // //                                                 </Box>
// // // //                                             )}

// // // //                                             {/* Step 4: Advanced */}
// // // //                                             {activeStep === 4 && (
// // // //                                                 <Box>
// // // //                                                     <Typography variant="h6" gutterBottom>
// // // //                                                         <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
// // // //                                                         Advanced Settings
// // // //                                                     </Typography>
// // // //                                                     <Divider sx={{ mb: 3 }} />
// // // //                                                     <Grid container spacing={3}>
// // // //                                                         <Grid item xs={12} md={6}>
// // // //                                                             <FormControl fullWidth error={touched.priority && Boolean(errors.priority)}>
// // // //                                                                 <InputLabel>Priority *</InputLabel>
// // // //                                                                 <Select
// // // //                                                                     name="priority"
// // // //                                                                     value={values.priority || 2}
// // // //                                                                     onChange={handleChange}
// // // //                                                                     onBlur={handleBlur}
// // // //                                                                     label="Priority *"
// // // //                                                                     disabled={isLoading}
// // // //                                                                 >
// // // //                                                                     {priorities.map((priority) => (
// // // //                                                                         <MenuItem key={priority.value} value={priority.value}>
// // // //                                                                             <Box display="flex" alignItems="center" gap={1}>
// // // //                                                                                 <Chip
// // // //                                                                                     label={priority.label}
// // // //                                                                                     size="small"
// // // //                                                                                     color={priority.color}
// // // //                                                                                 />
// // // //                                                                                 <Box>
// // // //                                                                                     <Typography>Priority {priority.value}</Typography>
// // // //                                                                                     <Typography variant="caption" color="text.secondary">
// // // //                                                                                         {priority.description}
// // // //                                                                                     </Typography>
// // // //                                                                                 </Box>
// // // //                                                                             </Box>
// // // //                                                                         </MenuItem>
// // // //                                                                     ))}
// // // //                                                                 </Select>
// // // //                                                                 {touched.priority && errors.priority && (
// // // //                                                                     <FormHelperText>{errors.priority}</FormHelperText>
// // // //                                                                 )}
// // // //                                                             </FormControl>
// // // //                                                         </Grid>

// // // //                                                         <Grid item xs={12} md={6}>
// // // //                                                             <TextField
// // // //                                                                 fullWidth
// // // //                                                                 name="createdBy"
// // // //                                                                 label="Created By"
// // // //                                                                 value={getCurrentUserId()}
// // // //                                                                 disabled
// // // //                                                                 helperText="Your user ID (automatically assigned)"
// // // //                                                             />
// // // //                                                         </Grid>

// // // //                                                         {values.ruleType === 'EVENT' && (
// // // //                                                             <>
// // // //                                                                 <Grid item xs={12} md={6}>
// // // //                                                                     <TextField
// // // //                                                                         fullWidth
// // // //                                                                         name="sourceTable"
// // // //                                                                         label="Source Table"
// // // //                                                                         value={values.sourceTable || ''}
// // // //                                                                         onChange={handleChange}
// // // //                                                                         onBlur={handleBlur}
// // // //                                                                         helperText="Database table to monitor for events"
// // // //                                                                         placeholder="e.g., tbl_FeePosting"
// // // //                                                                         disabled={isLoading}
// // // //                                                                     />
// // // //                                                                 </Grid>
// // // //                                                                 <Grid item xs={12} md={6}>
// // // //                                                                     <TextField
// // // //                                                                         fullWidth
// // // //                                                                         name="triggerField"
// // // //                                                                         label="Trigger Field"
// // // //                                                                         value={values.triggerField || ''}
// // // //                                                                         onChange={handleChange}
// // // //                                                                         onBlur={handleBlur}
// // // //                                                                         helperText="Field to monitor for changes"
// // // //                                                                         placeholder="e.g., Status"
// // // //                                                                         disabled={isLoading}
// // // //                                                                     />
// // // //                                                                 </Grid>
// // // //                                                                 <Grid item xs={12}>
// // // //                                                                     <TextField
// // // //                                                                         fullWidth
// // // //                                                                         name="triggerValue"
// // // //                                                                         label="Trigger Value"
// // // //                                                                         value={values.triggerValue || ''}
// // // //                                                                         onChange={handleChange}
// // // //                                                                         onBlur={handleBlur}
// // // //                                                                         helperText="Value that triggers the notification"
// // // //                                                                         placeholder="e.g., POSTED"
// // // //                                                                         disabled={isLoading}
// // // //                                                                     />
// // // //                                                                 </Grid>
// // // //                                                             </>
// // // //                                                         )}

// // // //                                                         <Grid item xs={12}>
// // // //                                                             <Alert severity="info" icon={<InfoIcon />}>
// // // //                                                                 <Typography variant="body2">
// // // //                                                                     <strong>Rule Summary:</strong> This rule will run{' '}
// // // //                                                                     {values.timingType === 'IMMEDIATE' ? 'immediately when triggered' :
// // // //                                                                      values.timingType === 'FIXED_TIME' ? `daily at ${values.fixedTime}` :
// // // //                                                                      values.timingType === 'DAYS_OFFSET' ? `every ${values.daysOffset} days` :
// // // //                                                                      values.timingType === 'CRON' ? `according to cron schedule: ${values.cronExpression}` :
// // // //                                                                      values.timingType?.toLowerCase()}.
// // // //                                                                 </Typography>
// // // //                                                                 <Typography variant="body2" sx={{ mt: 1 }}>
// // // //                                                                     <strong>Target:</strong> {targetTypes.find(t => t.value === values.targetType)?.label || 'All Users'}
// // // //                                                                     <br />
// // // //                                                                     <strong>Category:</strong> {values.category}
// // // //                                                                     <br />
// // // //                                                                     <strong>Batch Mode:</strong> {values.isBatch ? 'Enabled' : 'Disabled'}
// // // //                                                                     <br />
// // // //                                                                     <strong>Priority:</strong> {priorities.find(p => p.value === values.priority)?.label || 'Medium'} ({values.priority})
// // // //                                                                 </Typography>
// // // //                                                             </Alert>
// // // //                                                         </Grid>
// // // //                                                     </Grid>
// // // //                                                 </Box>
// // // //                                             )}

// // // //                                             {/* Navigation Buttons */}
// // // //                                             <Box display="flex" justifyContent="space-between" mt={4}>
// // // //                                                 <Button
// // // //                                                     disabled={activeStep === 0 || isLoading}
// // // //                                                     onClick={handleBack}
// // // //                                                     startIcon={<CancelIcon />}
// // // //                                                     variant="outlined"
// // // //                                                     type="button"
// // // //                                                 >
// // // //                                                     Back
// // // //                                                 </Button>
// // // //                                                 {activeStep < steps.length - 1 ? (
// // // //                                                     <Button
// // // //                                                         variant="contained"
// // // //                                                         onClick={handleNext}
// // // //                                                         disabled={isLoading || !isStepValid(values, errors, activeStep)}
// // // //                                                         type="button"
// // // //                                                     >
// // // //                                                         Next Step
// // // //                                                     </Button>
// // // //                                                 ) : (
// // // //                                                     <Button
// // // //                                                         type="submit"
// // // //                                                         variant="contained"
// // // //                                                         color="primary"
// // // //                                                         disabled={isLoading || !isValid || isSubmitting}
// // // //                                                         startIcon={isLoading || isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
// // // //                                                     >
// // // //                                                         {isLoading || isSubmitting ? 'Saving...' : (isEditMode ? 'Update Rule' : 'Create Rule')}
// // // //                                                     </Button>
// // // //                                                 )}
// // // //                                             </Box>
// // // //                                         </CardContent>
// // // //                                     </Card>
// // // //                                 </Grid>

// // // //                                 {/* Right Column - Summary */}
// // // //                                 <Grid item xs={12} lg={4}>
// // // //                                     <Box sx={{ position: 'sticky', top: 24 }}>
// // // //                                         <Card sx={{ mb: 2 }}>
// // // //                                             <CardHeader title="Rule Summary" />
// // // //                                             <CardContent>
// // // //                                                 <List disablePadding>
// // // //                                                     <ListItem sx={{ px: 0 }}>
// // // //                                                         <ListItemText primary="Rule Name" secondary={values.ruleName || 'Not set'} />
// // // //                                                     </ListItem>
// // // //                                                     <Divider sx={{ my: 1 }} />
// // // //                                                     <ListItem sx={{ px: 0 }}>
// // // //                                                         <ListItemText 
// // // //                                                             primary="Type & Category" 
// // // //                                                             secondary={
// // // //                                                                 <Box display="flex" gap={1} sx={{ mt: 0.5 }}>
// // // //                                                                     <Chip label={values.ruleType} size="small" variant="outlined" />
// // // //                                                                     <Chip 
// // // //                                                                         label={values.category} 
// // // //                                                                         size="small" 
// // // //                                                                         color={categories.find(c => c.value === values.category)?.color || 'default'}
// // // //                                                                     />
// // // //                                                                 </Box>
// // // //                                                             } 
// // // //                                                         />
// // // //                                                     </ListItem>
// // // //                                                     <Divider sx={{ my: 1 }} />
// // // //                                                     <ListItem sx={{ px: 0 }}>
// // // //                                                         <ListItemText 
// // // //                                                             primary="Schedule" 
// // // //                                                             secondary={
// // // //                                                                 <Typography variant="body2" sx={{ mt: 0.5 }}>
// // // //                                                                     {values.timingType === 'IMMEDIATE' ? 'Immediate' :
// // // //                                                                      values.timingType === 'FIXED_TIME' ? `Daily at ${values.fixedTime || '09:00'}` :
// // // //                                                                      values.timingType === 'DAYS_OFFSET' ? `Every ${values.daysOffset || 1} days` :
// // // //                                                                      values.timingType === 'CRON' ? `Cron: ${values.cronExpression || '0 9 * * *'}` :
// // // //                                                                      values.timingType?.charAt(0).toUpperCase() + values.timingType?.slice(1).toLowerCase()}
// // // //                                                                 </Typography>
// // // //                                                             } 
// // // //                                                         />
// // // //                                                     </ListItem>
// // // //                                                     <Divider sx={{ my: 1 }} />
// // // //                                                     <ListItem sx={{ px: 0 }}>
// // // //                                                         <ListItemText 
// // // //                                                             primary="Status" 
// // // //                                                             secondary={
// // // //                                                                 <Box display="flex" alignItems="center" gap={1} sx={{ mt: 0.5 }}>
// // // //                                                                     <Chip 
// // // //                                                                         label={values.isActive ? 'Active' : 'Inactive'} 
// // // //                                                                         size="small" 
// // // //                                                                         color={values.isActive ? 'success' : 'error'} 
// // // //                                                                     />
// // // //                                                                     {values.isBatch && (
// // // //                                                                         <Chip label="Batch" size="small" variant="outlined" color="primary" />
// // // //                                                                     )}
// // // //                                                                 </Box>
// // // //                                                             } 
// // // //                                                         />
// // // //                                                     </ListItem>
// // // //                                                     <Divider sx={{ my: 1 }} />
// // // //                                                     <ListItem sx={{ px: 0 }}>
// // // //                                                         <ListItemText 
// // // //                                                             primary="Priority" 
// // // //                                                             secondary={
// // // //                                                                 <Chip 
// // // //                                                                     label={`${priorities.find(p => p.value === values.priority)?.label || 'Medium'} (${values.priority})`} 
// // // //                                                                     size="small" 
// // // //                                                                     color={priorities.find(p => p.value === values.priority)?.color}
// // // //                                                                     sx={{ mt: 0.5 }}
// // // //                                                                 />
// // // //                                                             } 
// // // //                                                         />
// // // //                                                     </ListItem>
// // // //                                                     <Divider sx={{ my: 1 }} />
// // // //                                                     <ListItem sx={{ px: 0 }}>
// // // //                                                         <ListItemText 
// // // //                                                             primary="Target" 
// // // //                                                             secondary={
// // // //                                                                 <Typography variant="body2" sx={{ mt: 0.5 }}>
// // // //                                                                     {targetTypes.find(t => t.value === values.targetType)?.label || 'All Users'}
// // // //                                                                 </Typography>
// // // //                                                             } 
// // // //                                                         />
// // // //                                                     </ListItem>
// // // //                                                 </List>

// // // //                                                 {isEditMode && id && (
// // // //                                                     <Box mt={2} display="flex" flexDirection="column" gap={1}>
// // // //                                                         <Button
// // // //                                                             variant="outlined"
// // // //                                                             fullWidth
// // // //                                                             size="small"
// // // //                                                             onClick={() => handleTestRule(id)}
// // // //                                                             disabled={testing || isLoading}
// // // //                                                             startIcon={testing ? <CircularProgress size={16} /> : <SendIcon />}
// // // //                                                             color="primary"
// // // //                                                             type="button"
// // // //                                                         >
// // // //                                                             {testing ? 'Testing...' : 'Test Rule'}
// // // //                                                         </Button>
// // // //                                                         <Button
// // // //                                                             variant="outlined"
// // // //                                                             fullWidth
// // // //                                                             size="small"
// // // //                                                             onClick={() => handleExecuteRule(id)}
// // // //                                                             disabled={executing || isLoading}
// // // //                                                             startIcon={executing ? <CircularProgress size={16} /> : <PlayArrowIcon />}
// // // //                                                             color="secondary"
// // // //                                                             type="button"
// // // //                                                         >
// // // //                                                             {executing ? 'Executing...' : 'Execute Rule Now'}
// // // //                                                         </Button>
// // // //                                                         <Alert severity="warning" sx={{ mt: 0.5, py: 0 }}>
// // // //                                                             <Typography variant="caption">Executing will run the rule immediately.</Typography>
// // // //                                                         </Alert>
// // // //                                                     </Box>
// // // //                                                 )}

// // // //                                                 <Button
// // // //                                                     variant="outlined"
// // // //                                                     fullWidth
// // // //                                                     size="small"
// // // //                                                     onClick={() => navigate('/dashboard/notification-rules')}
// // // //                                                     startIcon={<CancelIcon />}
// // // //                                                     disabled={isLoading}
// // // //                                                     type="button"
// // // //                                                     sx={{ mt: 2 }}
// // // //                                                 >
// // // //                                                     Cancel
// // // //                                                 </Button>
// // // //                                             </CardContent>
// // // //                                         </Card>

// // // //                                         <Card>
// // // //                                             <CardHeader title="Quick Start" avatar={<AddIcon color="primary" />} />
// // // //                                             <CardContent>
// // // //                                                 <Button
// // // //                                                     variant="contained"
// // // //                                                     fullWidth
// // // //                                                     size="small"
// // // //                                                     startIcon={<AddIcon />}
// // // //                                                     onClick={() => setShowTemplateDialog(true)}
// // // //                                                     type="button"
// // // //                                                 >
// // // //                                                     Use Template
// // // //                                                 </Button>
// // // //                                                 <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
// // // //                                                     Start quickly with pre-configured templates.
// // // //                                                 </Typography>
// // // //                                             </CardContent>
// // // //                                         </Card>

// // // //                                         <Card sx={{ mt: 2 }}>
// // // //                                             <CardHeader title="Setup Progress" />
// // // //                                             <CardContent>
// // // //                                                 <LinearProgress
// // // //                                                     variant="determinate"
// // // //                                                     value={(activeStep + 1) / steps.length * 100}
// // // //                                                     sx={{ height: 6, borderRadius: 3, mb: 1 }}
// // // //                                                 />
// // // //                                                 <Typography variant="caption" color="text.secondary">
// // // //                                                     Step {activeStep + 1} of {steps.length}
// // // //                                                 </Typography>
// // // //                                             </CardContent>
// // // //                                         </Card>
// // // //                                     </Box>
// // // //                                 </Grid>
// // // //                             </Grid>
// // // //                         </Form>
// // // //                     );
// // // //                 }}
// // // //             </Formik>

// // // //             {/* Template Dialog */}
// // // //             <Dialog open={showTemplateDialog} onClose={() => setShowTemplateDialog(false)} maxWidth="md" fullWidth>
// // // //                 <DialogTitle>Select Rule Template</DialogTitle>
// // // //                 <DialogContent>
// // // //                     <Grid container spacing={2}>
// // // //                         {ruleTemplates.map((template) => (
// // // //                             <Grid item xs={12} key={template.id}>
// // // //                                 <Card variant="outlined" sx={{ cursor: 'pointer', '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.50' } }}>
// // // //                                     <CardContent>
// // // //                                         <Box display="flex" justifyContent="space-between" alignItems="flex-start">
// // // //                                             <Box>
// // // //                                                 <Typography variant="h6">{template.name}</Typography>
// // // //                                                 <Typography variant="body2" color="text.secondary">{template.description}</Typography>
// // // //                                                 <Box display="flex" gap={1} mt={1}>
// // // //                                                     <Chip label={template.category} size="small" variant="outlined" />
// // // //                                                     <Chip label={`Priority ${template.priority}`} size="small" variant="outlined" />
// // // //                                                 </Box>
// // // //                                             </Box>
// // // //                                             <Button 
// // // //                                                 variant="contained" 
// // // //                                                 size="small" 
// // // //                                                 onClick={() => { 
// // // //                                                     if (formikRef) handleTemplateSelect(template, formikRef); 
// // // //                                                 }} 
// // // //                                                 type="button"
// // // //                                             >
// // // //                                                 Use Template
// // // //                                             </Button>
// // // //                                         </Box>
// // // //                                         <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
// // // //                                             Schedule: {template.timingType === 'FIXED_TIME' ? `Daily at ${template.fixedTime}` :
// // // //                                                        template.timingType === 'DAYS_OFFSET' ? `Every ${template.daysOffset} days` :
// // // //                                                        template.timingType}
// // // //                                         </Typography>
// // // //                                     </CardContent>
// // // //                                 </Card>
// // // //                             </Grid>
// // // //                         ))}
// // // //                     </Grid>
// // // //                 </DialogContent>
// // // //                 <DialogActions>
// // // //                     <Button onClick={() => setShowTemplateDialog(false)} type="button">Cancel</Button>
// // // //                 </DialogActions>
// // // //             </Dialog>

// // // //             <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
// // // //                 <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>{snackbar.message}</Alert>
// // // //             </Snackbar>
// // // //         </Box>
// // // //     );
// // // // };

// // // // export default NotificationRuleForm;

// // // // // views/Dashboard/NotificationRules/NotificationRuleForm.jsx
// // // // import React, { useState, useEffect, useRef } from 'react';
// // // // import {
// // // //     Box,
// // // //     Button,
// // // //     Card,
// // // //     CardContent,
// // // //     CardHeader,
// // // //     FormControl,
// // // //     FormControlLabel,
// // // //     Grid,
// // // //     MenuItem,
// // // //     Switch,
// // // //     TextField,
// // // //     Typography,
// // // //     Chip,
// // // //     IconButton,
// // // //     Divider,
// // // //     Alert,
// // // //     Stepper,
// // // //     Step,
// // // //     StepLabel,
// // // //     Paper,
// // // //     InputAdornment,
// // // //     Tooltip,
// // // //     CircularProgress,
// // // //     Select,
// // // //     InputLabel,
// // // //     FormHelperText,
// // // //     Snackbar,
// // // //     LinearProgress,
// // // //     List,
// // // //     ListItem,
// // // //     ListItemText,
// // // //     Tabs,
// // // //     Tab,
// // // //     Dialog,
// // // //     DialogTitle,
// // // //     DialogContent,
// // // //     DialogActions,
// // // //     Radio,
// // // //     RadioGroup,
// // // // } from '@mui/material';
// // // // import {
// // // //     Add as AddIcon,
// // // //     Info as InfoIcon,
// // // //     CheckCircle as CheckCircleIcon,
// // // //     Error as ErrorIcon,
// // // //     Send as SendIcon,
// // // //     Save as SaveIcon,
// // // //     Cancel as CancelIcon,
// // // //     Refresh as RefreshIcon,
// // // //     PlayArrow as PlayArrowIcon,
// // // //     Schedule as ScheduleIcon,
// // // //     Payment as PaymentIcon,
// // // //     AccountBalance as AccountBalanceIcon,
// // // //     School as SchoolIcon,
// // // //     Assignment as AssignmentIcon,
// // // //     Announcement as AnnouncementIcon,
// // // //     Warning as WarningIcon,
// // // //     Event as EventIcon,
// // // //     Person as PersonIcon,
// // // //     AccessTime as AccessTimeIcon,
// // // //     Timer as TimerIcon,
// // // //     Today as TodayIcon,
// // // //     CalendarToday as CalendarTodayIcon,
// // // //     ViewWeek as ViewWeekIcon,
// // // //     EventNote as EventNoteIcon,
// // // //     FilterList as FilterListIcon,
// // // //     Settings as SettingsIcon,
// // // //     Message as MessageIcon,
// // // //     DataUsage as DataIcon,
// // // //     Close as CloseIcon,
// // // //     ChildCare as ChildIcon,
// // // // } from '@mui/icons-material';
// // // // import { useNavigate, useParams } from 'react-router-dom';
// // // // import { Formik, Form } from 'formik';
// // // // import * as Yup from 'yup';
// // // // import { usePermissions } from '../../../customHook/usePermissions';
// // // // import {
// // // //     useGetNotificationRuleByIdQuery,
// // // //     useCreateNotificationRuleMutation,
// // // //     useUpdateNotificationRuleMutation,
// // // //     useTestNotificationRuleMutation,
// // // //     useExecuteNotificationRuleMutation,
// // // // } from '../../../store/api/notificationApi';
// // // // import { useSelector } from 'react-redux';
// // // // import TargetFilterBuilder from '../../../component/TargetFilterBuilder';

// // // // // Validation Schema
// // // // const validationSchema = Yup.object({
// // // //     ruleName: Yup.string()
// // // //         .required('Rule name is required')
// // // //         .max(100, 'Rule name must be less than 100 characters'),
// // // //     ruleType: Yup.string().required('Rule type is required'),
// // // //     category: Yup.string().required('Category is required'),
// // // //     titleTemplate: Yup.string()
// // // //         .required('Title template is required')
// // // //         .max(200, 'Title must be less than 200 characters'),
// // // //     messageTemplate: Yup.string()
// // // //         .required('Message template is required')
// // // //         .max(1000, 'Message must be less than 1000 characters'),
// // // //     targetType: Yup.string().required('Target type is required'),
// // // //     isActive: Yup.boolean(),
// // // //     priority: Yup.number()
// // // //         .min(1, 'Priority must be between 1-3')
// // // //         .max(3, 'Priority must be between 1-3')
// // // //         .required('Priority is required'),
// // // //     isBatch: Yup.boolean(),
// // // //     timingType: Yup.string().required('Timing type is required'),
// // // //     cronExpression: Yup.string().nullable(),
// // // //     daysOffset: Yup.number().min(0, 'Days offset must be positive').nullable(),
// // // //     fixedTime: Yup.string().nullable(),
// // // //     targetFilter: Yup.string().test(
// // // //         'json',
// // // //         'Must be valid JSON',
// // // //         (value) => {
// // // //             if (!value) return true;
// // // //             try {
// // // //                 JSON.parse(value);
// // // //                 return true;
// // // //             } catch {
// // // //                 return false;
// // // //             }
// // // //         }
// // // //     )
// // // // });

// // // // // Initial values
// // // // const getInitialValues = (userData = null) => ({
// // // //     ruleName: '',
// // // //     ruleType: 'CRON',
// // // //     category: 'FEE',
// // // //     sourceTable: '',
// // // //     triggerField: '',
// // // //     triggerValue: '',
// // // //     timingType: 'DAILY',
// // // //     fixedTime: '09:00',
// // // //     daysOffset: 1,
// // // //     cronExpression: '0 9 * * *',
// // // //     titleTemplate: '',
// // // //     messageTemplate: '',
// // // //     dataTemplate: '',
// // // //     targetType: 'PARENTS',
// // // //     targetFilter: '{}',
// // // //     isActive: true,
// // // //     isBatch: true,
// // // //     priority: 2,
// // // //     createdBy: userData?.id || 1,
// // // // });

// // // // const steps = [
// // // //     { label: 'Basic Info', icon: <InfoIcon /> },
// // // //     { label: 'Schedule & Timing', icon: <ScheduleIcon /> },
// // // //     { label: 'Target & Filters', icon: <FilterListIcon /> },
// // // //     { label: 'Content', icon: <AssignmentIcon /> },
// // // //     { label: 'Advanced', icon: <SettingsIcon /> },
// // // // ];

// // // // // Categories with icons
// // // // const categories = [
// // // //     { value: 'FEE', label: 'Fee', color: 'warning', icon: <PaymentIcon />, description: 'Fee-related notifications' },
// // // //     { value: 'ATTENDANCE', label: 'Attendance', color: 'error', icon: <AccountBalanceIcon />, description: 'Attendance notifications' },
// // // //     { value: 'EXAM', label: 'Exam', color: 'info', icon: <SchoolIcon />, description: 'Exam notifications' },
// // // //     { value: 'HOMEWORK', label: 'Homework', color: 'success', icon: <AssignmentIcon />, description: 'Homework assignments' },
// // // //     { value: 'ANNOUNCEMENT', label: 'Announcement', color: 'primary', icon: <AnnouncementIcon />, description: 'School announcements' },
// // // //     { value: 'GENERAL', label: 'General', color: 'default', icon: <InfoIcon />, description: 'General notifications' },
// // // //     { value: 'ALERT', label: 'Alert', color: 'error', icon: <WarningIcon />, description: 'Important alerts' },
// // // //     { value: 'EVENT', label: 'Event', color: 'info', icon: <EventIcon />, description: 'School events' },
// // // // ];

// // // // const ruleTypes = [
// // // //     { value: 'EVENT', label: 'Event Trigger', description: 'Triggered by database events', icon: <EventIcon /> },
// // // //     { value: 'CRON', label: 'Scheduled (Cron)', description: 'Runs on a schedule', icon: <ScheduleIcon /> },
// // // //     { value: 'MANUAL', label: 'Manual', description: 'Manual trigger only', icon: <PlayArrowIcon /> },
// // // // ];

// // // // const timingTypes = [
// // // //     { value: 'IMMEDIATE', label: 'Immediate', icon: <AccessTimeIcon />, description: 'Run immediately when triggered' },
// // // //     { value: 'FIXED_TIME', label: 'Fixed Time', icon: <TimerIcon />, description: 'Run at specific time each day' },
// // // //     { value: 'DAYS_OFFSET', label: 'Days Offset', icon: <TodayIcon />, description: 'Run every X days' },
// // // //     { value: 'CRON', label: 'Cron Expression', icon: <CalendarTodayIcon />, description: 'Advanced scheduling' },
// // // //     { value: 'DAILY', label: 'Daily', icon: <TodayIcon />, description: 'Run once per day' },
// // // //     { value: 'WEEKLY', label: 'Weekly', icon: <ViewWeekIcon />, description: 'Run once per week' },
// // // //     { value: 'MONTHLY', label: 'Monthly', icon: <CalendarTodayIcon />, description: 'Run once per month' },
// // // // ];

// // // // const targetTypes = [
// // // //     { value: 'ALL', label: 'All Users', icon: <PersonIcon /> },
// // // //     { value: 'PARENTS', label: 'Parents Only', icon: <PersonIcon /> },
// // // //     { value: 'TEACHERS', label: 'Teachers Only', icon: <PersonIcon /> },
// // // //     { value: 'STUDENTS', label: 'Students Only', icon: <PersonIcon /> },
// // // //     { value: 'CLASS', label: 'Class Specific', icon: <SchoolIcon /> },
// // // //     { value: 'SECTION', label: 'Section Specific', icon: <SchoolIcon /> },
// // // //     { value: 'SPECIFIC_USERS', label: 'Specific Users', icon: <PersonIcon /> },
// // // //     { value: 'SPECIFIC_STUDENTS_DIRECT', label: 'Specific Students (Direct)', icon: <ChildIcon /> },
// // // // ];

// // // // const priorities = [
// // // //     { value: 1, label: 'High', color: 'error', description: 'Urgent notifications' },
// // // //     { value: 2, label: 'Medium', color: 'warning', description: 'Regular reminders' },
// // // //     { value: 3, label: 'Low', color: 'info', description: 'Informational updates' },
// // // // ];

// // // // // Sample variables for different categories
// // // // const sampleVariables = {
// // // //     COMMON: [
// // // //         { name: 'CurrentDate', description: 'Current date', sample: '25/01/2024' },
// // // //         { name: 'CurrentTime', description: 'Current time', sample: '14:30' },
// // // //         { name: 'RuleName', description: 'Rule name', sample: 'Fee Reminder' },
// // // //         { name: 'Category', description: 'Notification category', sample: 'FEE' },
// // // //     ],
// // // //     FEE: [
// // // //         { name: 'StudentName', description: 'Student name', sample: 'John Doe' },
// // // //         { name: 'ParentName', description: 'Parent name', sample: 'Mr. Smith' },
// // // //         { name: 'DueAmount', description: 'Due amount', sample: '5000' },
// // // //         { name: 'DueDate', description: 'Due date', sample: '31/01/2024' },
// // // //         { name: 'StatusText', description: 'Status description', sample: 'Due in 3 days' },
// // // //     ],
// // // //     ATTENDANCE: [
// // // //         { name: 'StudentName', description: 'Student name', sample: 'John Doe' },
// // // //         { name: 'Status', description: 'Attendance status', sample: 'Absent' },
// // // //         { name: 'AttendanceDate', description: 'Attendance date', sample: '25/01/2024' },
// // // //         { name: 'Remarks', description: 'Remarks', sample: 'Medical Leave' },
// // // //     ],
// // // //     EXAM: [
// // // //         { name: 'StudentName', description: 'Student name', sample: 'John Doe' },
// // // //         { name: 'ExamTitle', description: 'Exam title', sample: 'Mid Term Examination' },
// // // //         { name: 'ExamDate', description: 'Exam date', sample: '30/01/2024' },
// // // //         { name: 'Subject', description: 'Subject', sample: 'Mathematics' },
// // // //     ],
// // // //     HOMEWORK: [
// // // //         { name: 'StudentName', description: 'Student name', sample: 'John Doe' },
// // // //         { name: 'HomeworkTitle', description: 'Homework title', sample: 'Math Assignment' },
// // // //         { name: 'Subject', description: 'Subject', sample: 'Mathematics' },
// // // //         { name: 'DueDate', description: 'Due date', sample: '30/01/2024' },
// // // //     ],
// // // // };

// // // // // Rule templates
// // // // const ruleTemplates = [
// // // //     {
// // // //         id: 1,
// // // //         name: "Daily Fee Reminder",
// // // //         category: "FEE",
// // // //         description: "Send daily reminders for overdue fees",
// // // //         timingType: "DAILY",
// // // //         fixedTime: "09:00",
// // // //         titleTemplate: "Fee Payment Due: {StudentName}",
// // // //         messageTemplate: "Dear {ParentName},\nFee of Rs.{DueAmount} for {StudentName} is {StatusText}.\nDue date: {DueDate}",
// // // //         priority: 2
// // // //     },
// // // //     {
// // // //         id: 2,
// // // //         name: "Weekly Attendance Summary",
// // // //         category: "ATTENDANCE",
// // // //         description: "Weekly summary of student attendance",
// // // //         timingType: "WEEKLY",
// // // //         fixedTime: "17:00",
// // // //         titleTemplate: "Weekly Attendance Summary",
// // // //         messageTemplate: "Attendance Summary for {StudentName}\nStatus: {Status}\nDate: {AttendanceDate}",
// // // //         priority: 3
// // // //     },
// // // //     {
// // // //         id: 3,
// // // //         name: "Exam Reminder",
// // // //         category: "EXAM",
// // // //         description: "Remind students about exams",
// // // //         timingType: "DAYS_OFFSET",
// // // //         daysOffset: 3,
// // // //         titleTemplate: "Exam Reminder: {ExamTitle}",
// // // //         messageTemplate: "Dear Student,\n{ExamTitle} is scheduled on {ExamDate}.\nSubject: {Subject}",
// // // //         priority: 2
// // // //     },
// // // // ];

// // // // const NotificationRuleForm = () => {
// // // //     const navigate = useNavigate();
// // // //     const { id } = useParams();
// // // //     const { isAdmin, isManager, isTeacher } = usePermissions();
// // // //     const isEditMode = !!id;

// // // //     const [activeStep, setActiveStep] = useState(0);
// // // //     const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
// // // //     const [showTemplateDialog, setShowTemplateDialog] = useState(false);
// // // //     const [activeTab, setActiveTab] = useState(0);
// // // //     const [selectedInsertField, setSelectedInsertField] = useState('titleTemplate');
// // // //     const [isSubmitting, setIsSubmitting] = useState(false);

// // // //     const titleRef = useRef();
// // // //     const messageRef = useRef();
// // // //     const dataRef = useRef();

// // // //     const authUser = useSelector((state) => state.auth.user);

// // // //     const { data: ruleData, isLoading: loadingRule, refetch } =
// // // //         useGetNotificationRuleByIdQuery(id, { skip: !isEditMode });

// // // //     const [createRule, { isLoading: creating }] = useCreateNotificationRuleMutation();
// // // //     const [updateRule, { isLoading: updating }] = useUpdateNotificationRuleMutation();
// // // //     const [testRule, { isLoading: testing }] = useTestNotificationRuleMutation();
// // // //     const [executeRule, { isLoading: executing }] = useExecuteNotificationRuleMutation();

// // // //     const getCurrentUserId = () => {
// // // //         if (authUser?.id) return authUser.id;
// // // //         try {
// // // //             const storedUser = localStorage.getItem('user');
// // // //             if (storedUser) {
// // // //                 const user = JSON.parse(storedUser);
// // // //                 return user.id || user.userId || 1;
// // // //             }
// // // //         } catch (error) {
// // // //             return 1;
// // // //         }
// // // //         return 1;
// // // //     };

// // // //     const formatTimeForInput = (timeSpan) => {
// // // //         if (!timeSpan) return '09:00';
// // // //         try {
// // // //             const timeStr = typeof timeSpan === 'string' ? timeSpan : timeSpan.toString();
// // // //             const parts = timeStr.split(':');
// // // //             if (parts.length >= 2) {
// // // //                 return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
// // // //             }
// // // //             return '09:00';
// // // //         } catch (error) {
// // // //             return '09:00';
// // // //         }
// // // //     };

// // // //     const showSnackbar = (message, severity = 'success') => {
// // // //         setSnackbar({ open: true, message, severity });
// // // //     };

// // // //     const handleCloseSnackbar = () => {
// // // //         setSnackbar({ ...snackbar, open: false });
// // // //     };

// // // //     const handleNext = (e) => {
// // // //         if (e) {
// // // //             e.preventDefault();
// // // //             e.stopPropagation();
// // // //         }
// // // //         if (activeStep < steps.length - 1) {
// // // //             setActiveStep(prev => prev + 1);
// // // //         }
// // // //     };

// // // //     const handleBack = (e) => {
// // // //         if (e) {
// // // //             e.preventDefault();
// // // //             e.stopPropagation();
// // // //         }
// // // //         if (activeStep > 0) {
// // // //             setActiveStep(prev => prev - 1);
// // // //         }
// // // //     };

// // // //     const handleTemplateSelect = (template, setValues) => {
// // // //         if (setValues) {
// // // //             setValues({
// // // //                 ...getInitialValues({ id: getCurrentUserId() }),
// // // //                 ruleName: template.name,
// // // //                 category: template.category,
// // // //                 timingType: template.timingType,
// // // //                 fixedTime: template.fixedTime || '09:00',
// // // //                 daysOffset: template.daysOffset || 1,
// // // //                 titleTemplate: template.titleTemplate || '',
// // // //                 messageTemplate: template.messageTemplate || '',
// // // //                 priority: template.priority || 2,
// // // //                 isBatch: true,
// // // //             });
// // // //         }
// // // //         setShowTemplateDialog(false);
// // // //         showSnackbar(`Template "${template.name}" applied successfully`, 'success');
// // // //     };

// // // //     const handleSubmit = async (values, { setSubmitting: formikSetSubmitting }) => {
// // // //         if (isSubmitting) return;
// // // //         if (activeStep !== steps.length - 1) {
// // // //             showSnackbar('Please complete all steps before submitting', 'warning');
// // // //             formikSetSubmitting(false);
// // // //             return;
// // // //         }

// // // //         setIsSubmitting(true);

// // // //         try {
// // // //             const currentUserId = getCurrentUserId();
            
// // // //             const isManualTrigger = values.ruleType === 'MANUAL' || 
// // // //                                    (values.ruleType === 'EVENT' && values.timingType === 'IMMEDIATE');

// // // //             let targetFilterString = '{}';
// // // //             if (values.targetFilter && values.targetFilter.trim() !== '' && values.targetFilter !== '{}') {
// // // //                 try {
// // // //                     const parsed = JSON.parse(values.targetFilter);
// // // //                     targetFilterString = JSON.stringify(parsed);
// // // //                 } catch (error) {
// // // //                     targetFilterString = '{}';
// // // //                 }
// // // //             }
// // // // console.log('Formatted Target Filter:', targetFilterString);
// // // //             // Format fixedTime correctly (HH:mm:ss)
// // // //             let formattedFixedTime = null;
// // // //             if (values.timingType === 'FIXED_TIME' || values.timingType === 'DAILY') {
// // // //                 if (values.fixedTime) {
// // // //                     const timeParts = values.fixedTime.split(':');
// // // //                     if (timeParts.length === 2) {
// // // //                         formattedFixedTime = `${timeParts[0].padStart(2, '0')}:${timeParts[1].padStart(2, '0')}:00`;
// // // //                     } else {
// // // //                         formattedFixedTime = '09:00:00';
// // // //                     }
// // // //                 }
// // // //             }

// // // //             // Format cron expression (ensure 5 parts)
// // // //             let formattedCronExpression = null;
// // // //             if (values.timingType === 'CRON' && values.cronExpression) {
// // // //                 const cronParts = values.cronExpression.trim().split(/\s+/);
// // // //                 if (cronParts.length === 6) {
// // // //                     formattedCronExpression = cronParts.slice(1).join(' ');
// // // //                 } else if (cronParts.length === 5) {
// // // //                     formattedCronExpression = values.cronExpression.trim();
// // // //                 } else {
// // // //                     formattedCronExpression = '0 9 * * *';
// // // //                 }
// // // //             }

// // // //             const ruleDataToSend = {
// // // //                 ruleName: values.ruleName?.trim() || '',
// // // //                 ruleType: values.ruleType || 'EVENT',
// // // //                 category: values.category || 'GENERAL',
// // // //                 isManualTrigger: isManualTrigger,
// // // //                 sourceTable: values.ruleType === 'EVENT' ? (values.sourceTable?.trim() || null) : null,
// // // //                 triggerField: values.ruleType === 'EVENT' ? (values.triggerField?.trim() || null) : null,
// // // //                 triggerValue: values.ruleType === 'EVENT' ? (values.triggerValue?.trim() || null) : null,
// // // //                 timingType: values.timingType || 'IMMEDIATE',
// // // //                 daysOffset: values.timingType === 'DAYS_OFFSET' ? (values.daysOffset || 1) : null,
// // // //                 fixedTime: formattedFixedTime,
// // // //                 cronExpression: formattedCronExpression,
// // // //                 titleTemplate: values.titleTemplate?.trim() || '',
// // // //                 messageTemplate: values.messageTemplate?.trim() || '',
// // // //                 dataTemplate: values.dataTemplate?.trim() || null,
// // // //                 targetType: values.targetType || 'ALL',
// // // //                 targetFilter: targetFilterString,
// // // //                 isBatch: values.isBatch ?? true,
// // // //                 priority: parseInt(values.priority) || 2,
// // // //                 isActive: values.isActive ?? true,
// // // //                 createdBy: currentUserId
// // // //             };
// // // //             console.log('Data to send:', ruleDataToSend);

// // // //             if (isEditMode) {
// // // //                 await updateRule({ id, ...ruleDataToSend }).unwrap();
// // // //                 showSnackbar('Rule updated successfully!', 'success');
// // // //                 refetch();
// // // //             } else {
// // // //                 await createRule(ruleDataToSend).unwrap();
// // // //                 showSnackbar('Rule created successfully!', 'success');
// // // //             }

// // // //             setTimeout(() => {
// // // //                 navigate('/dashboard/notification-rules');
// // // //             }, 1500);

// // // //         } catch (error) {
// // // //             let errorMessage = 'Failed to save rule. Please check your inputs.';
            
// // // //             if (error.data?.errors) {
// // // //                 const validationErrors = [];
// // // //                 Object.keys(error.data.errors).forEach(key => {
// // // //                     if (Array.isArray(error.data.errors[key])) {
// // // //                         validationErrors.push(...error.data.errors[key]);
// // // //                     }
// // // //                 });
// // // //                 errorMessage = validationErrors.join(', ');
// // // //             } else if (error.data?.message) {
// // // //                 errorMessage = error.data.message;
// // // //             } else if (error.status === 400) {
// // // //                 errorMessage = 'Bad request. Please check fixedTime format (HH:mm:ss) and other fields.';
// // // //             }
            
// // // //             showSnackbar(errorMessage, 'error');
// // // //         } finally {
// // // //             setIsSubmitting(false);
// // // //             formikSetSubmitting(false);
// // // //         }
// // // //     };

// // // //     const handleTestRule = async (ruleId) => {
// // // //         if (!ruleId) {
// // // //             showSnackbar('Please save the rule first before testing.', 'warning');
// // // //             return;
// // // //         }

// // // //         try {
// // // //             const testUserId = getCurrentUserId();
// // // //             await testRule({ id: ruleId, testData: { testUserID: testUserId } }).unwrap();
// // // //             showSnackbar('Rule test executed successfully!', 'success');
// // // //         } catch (error) {
// // // //             showSnackbar(error.data?.message || 'Test failed.', 'error');
// // // //         }
// // // //     };

// // // //     const handleExecuteRule = async (ruleId) => {
// // // //         if (!ruleId) {
// // // //             showSnackbar('Please save the rule first before executing.', 'warning');
// // // //             return;
// // // //         }

// // // //         try {
// // // //             await executeRule(ruleId).unwrap();
// // // //             showSnackbar('Rule executed successfully!', 'success');
// // // //         } catch (error) {
// // // //             showSnackbar(error.data?.message || 'Execution failed.', 'error');
// // // //         }
// // // //     };

// // // //     const insertVariableAtCursor = (variable, setFieldValue, values, fieldName, textareaRef) => {
// // // //         const variableText = `{${variable}}`;
// // // //         const currentValue = values[fieldName] || '';

// // // //         if (textareaRef && textareaRef.current) {
// // // //             const textarea = textareaRef.current;
// // // //             const startPos = textarea.selectionStart;
// // // //             const endPos = textarea.selectionEnd;

// // // //             const newValue = currentValue.substring(0, startPos) + variableText + currentValue.substring(endPos);
// // // //             setFieldValue(fieldName, newValue);

// // // //             setTimeout(() => {
// // // //                 textarea.focus();
// // // //                 textarea.setSelectionRange(startPos + variableText.length, startPos + variableText.length);
// // // //             }, 0);
// // // //         } else {
// // // //             setFieldValue(fieldName, currentValue + variableText);
// // // //         }
// // // //         showSnackbar(`Added {${variable}} to ${fieldName === 'titleTemplate' ? 'Title' : fieldName === 'messageTemplate' ? 'Message' : 'Data'}`, 'info');
// // // //     };

// // // //     const isStepValid = (values, errors, step) => {
// // // //         switch (step) {
// // // //             case 0:
// // // //                 return values.ruleName && values.ruleType && values.category;
// // // //             case 1:
// // // //                 if (!values.timingType) return false;
// // // //                 if (values.timingType === 'FIXED_TIME' && !values.fixedTime) return false;
// // // //                 if (values.timingType === 'DAYS_OFFSET' && (!values.daysOffset || values.daysOffset < 1)) return false;
// // // //                 if (values.timingType === 'CRON' && !values.cronExpression) return false;
// // // //                 return true;
// // // //             case 2:
// // // //                 return values.targetType;
// // // //             case 3:
// // // //                 return values.titleTemplate && values.messageTemplate;
// // // //             case 4:
// // // //                 return values.priority;
// // // //             default:
// // // //                 return true;
// // // //         }
// // // //     };

// // // //     const renderTimingConfiguration = (values, handleChange, setFieldValue) => {
// // // //         const timingType = values.timingType || 'IMMEDIATE';

// // // //         return (
// // // //             <Box sx={{ mt: 2 }}>
// // // //                 <Box sx={{ mb: 3 }}>
// // // //                     <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mb: 1 }}>
// // // //                         Select Timing Type
// // // //                     </Typography>
// // // //                     <FormControl fullWidth>
// // // //                         <InputLabel>Timing Type *</InputLabel>
// // // //                         <Select
// // // //                             name="timingType"
// // // //                             value={values.timingType}
// // // //                             onChange={handleChange}
// // // //                             label="Timing Type *"
// // // //                             disabled={isLoading}
// // // //                         >
// // // //                             {timingTypes.map((type) => (
// // // //                                 <MenuItem key={type.value} value={type.value}>
// // // //                                     <Box display="flex" alignItems="center" gap={1}>
// // // //                                         {type.icon}
// // // //                                         <Box>
// // // //                                             <Typography>{type.label}</Typography>
// // // //                                             <Typography variant="caption" color="text.secondary">
// // // //                                                 {type.description}
// // // //                                             </Typography>
// // // //                                         </Box>
// // // //                                     </Box>
// // // //                                 </MenuItem>
// // // //                             ))}
// // // //                         </Select>
// // // //                     </FormControl>
// // // //                 </Box>

// // // //                 {timingType === 'FIXED_TIME' && (
// // // //                     <Box sx={{ mb: 3 }}>
// // // //                         <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mb: 1 }}>
// // // //                             <TimerIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: '1rem' }} />
// // // //                             Fixed Time
// // // //                         </Typography>
// // // //                         <TextField
// // // //                             fullWidth
// // // //                             name="fixedTime"
// // // //                             label="Select Time"
// // // //                             type="time"
// // // //                             value={values.fixedTime || '09:00'}
// // // //                             onChange={handleChange}
// // // //                             InputLabelProps={{ shrink: true }}
// // // //                             helperText="Choose the time when notifications will be sent daily"
// // // //                         />
// // // //                     </Box>
// // // //                 )}

// // // //                 {timingType === 'DAYS_OFFSET' && (
// // // //                     <Box sx={{ mb: 3 }}>
// // // //                         <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mb: 1 }}>
// // // //                             <TodayIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: '1rem' }} />
// // // //                             Days Offset
// // // //                         </Typography>
// // // //                         <TextField
// // // //                             fullWidth
// // // //                             name="daysOffset"
// // // //                             label="Number of Days"
// // // //                             type="number"
// // // //                             value={values.daysOffset || 1}
// // // //                             onChange={handleChange}
// // // //                             InputProps={{
// // // //                                 endAdornment: <InputAdornment position="end">days</InputAdornment>,
// // // //                                 inputProps: { min: 1 }
// // // //                             }}
// // // //                             helperText="How many days between each notification"
// // // //                         />
// // // //                     </Box>
// // // //                 )}

// // // //                 {timingType === 'CRON' && (
// // // //                     <Box sx={{ mb: 3 }}>
// // // //                         <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mb: 1 }}>
// // // //                             <ScheduleIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: '1rem' }} />
// // // //                             Cron Expression
// // // //                         </Typography>
// // // //                         <TextField
// // // //                             fullWidth
// // // //                             name="cronExpression"
// // // //                             label="Cron Expression"
// // // //                             value={values.cronExpression || '0 9 * * *'}
// // // //                             onChange={handleChange}
// // // //                             helperText="Format: minute hour day month day-of-week (e.g., 0 9 * * * for daily at 9 AM)"
// // // //                             placeholder="0 9 * * *"
// // // //                         />
// // // //                         <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
// // // //                             Examples: "0 9 * * *" = Daily at 9 AM, "0 9 */3 * *" = Every 3 days at 9 AM
// // // //                         </Typography>
// // // //                     </Box>
// // // //                 )}

// // // //                 {(timingType === 'DAILY' || timingType === 'WEEKLY' || timingType === 'MONTHLY') && (
// // // //                     <Box sx={{ mb: 3 }}>
// // // //                         <Alert severity="info" icon={<InfoIcon />}>
// // // //                             <Typography variant="body2">
// // // //                                 This rule will run {timingType.toLowerCase()} at the scheduled time.
// // // //                             </Typography>
// // // //                         </Alert>
// // // //                     </Box>
// // // //                 )}

// // // //                 {timingType === 'IMMEDIATE' && (
// // // //                     <Box sx={{ mb: 3 }}>
// // // //                         <Alert severity="info" icon={<AccessTimeIcon />}>
// // // //                             <Typography variant="body2">
// // // //                                 Notifications will be sent immediately when the rule is triggered.
// // // //                             </Typography>
// // // //                         </Alert>
// // // //                     </Box>
// // // //                 )}
// // // //             </Box>
// // // //         );
// // // //     };

// // // //     // Prepare initial values with proper targetFilter parsing
// // // //     const prepareInitialValues = () => {
// // // //         if (isEditMode && ruleData?.data) {
// // // //             const rule = ruleData.data;
// // // //             let targetFilterValue = '{}';
            
// // // //             if (rule.targetFilter) {
// // // //                 if (typeof rule.targetFilter === 'string') {
// // // //                     try {
// // // //                         const parsed = JSON.parse(rule.targetFilter);
// // // //                         targetFilterValue = JSON.stringify(parsed, null, 2);
// // // //                     } catch {
// // // //                         targetFilterValue = rule.targetFilter;
// // // //                     }
// // // //                 } else if (typeof rule.targetFilter === 'object') {
// // // //                     targetFilterValue = JSON.stringify(rule.targetFilter, null, 2);
// // // //                 }
// // // //             }
            
// // // //             return {
// // // //                 ruleName: rule.ruleName || '',
// // // //                 ruleType: rule.ruleType || 'CRON',
// // // //                 category: rule.category || 'FEE',
// // // //                 sourceTable: rule.sourceTable || '',
// // // //                 triggerField: rule.triggerField || '',
// // // //                 triggerValue: rule.triggerValue || '',
// // // //                 timingType: rule.timingType || 'DAILY',
// // // //                 fixedTime: rule.fixedTime ? formatTimeForInput(rule.fixedTime) : '09:00',
// // // //                 daysOffset: rule.daysOffset || 1,
// // // //                 cronExpression: rule.cronExpression || '0 9 * * *',
// // // //                 titleTemplate: rule.titleTemplate || '',
// // // //                 messageTemplate: rule.messageTemplate || '',
// // // //                 dataTemplate: rule.dataTemplate || '',
// // // //                 targetType: rule.targetType || 'PARENTS',
// // // //                 targetFilter: targetFilterValue,
// // // //                 isActive: rule.isActive ?? true,
// // // //                 isBatch: rule.isBatch ?? true,
// // // //                 priority: rule.priority || 2,
// // // //                 createdBy: rule.createdBy || getCurrentUserId(),
// // // //             };
// // // //         }
// // // //         return getInitialValues({ id: getCurrentUserId() });
// // // //     };

// // // //     const isLoading = loadingRule || creating || updating || isSubmitting;

// // // //     if (!isAdmin() && !isManager() && !isTeacher()) {
// // // //         return (
// // // //             <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
// // // //                 <Alert severity="error">Access Denied - Notification rule management is only available to authorized users.</Alert>
// // // //             </Box>
// // // //         );
// // // //     }

// // // //     if (loadingRule && isEditMode) {
// // // //         return (
// // // //             <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
// // // //                 <CircularProgress size={60} />
// // // //                 <Typography sx={{ mt: 3 }}>Loading rule...</Typography>
// // // //             </Box>
// // // //         );
// // // //     }

// // // //     return (
// // // //         <Box sx={{ maxWidth: 1400, margin: '0 auto', p: { xs: 2, md: 3 } }}>
// // // //             <Box sx={{ mb: 4 }}>
// // // //                 <Typography variant="h4" gutterBottom>
// // // //                     {isEditMode ? 'Edit Notification Rule' : 'Create Notification Rule'}
// // // //                 </Typography>
// // // //                 <Typography variant="body1" color="text.secondary">
// // // //                     {isEditMode ? 'Modify your notification rule settings' : 'Define a new notification rule with complete flexibility'}
// // // //                 </Typography>
// // // //             </Box>

// // // //             <Paper sx={{ p: 3, mb: 4 }}>
// // // //                 <Stepper activeStep={activeStep} alternativeLabel>
// // // //                     {steps.map((step, index) => (
// // // //                         <Step key={step.label}>
// // // //                             <StepLabel StepIconComponent={() => step.icon}>
// // // //                                 {step.label}
// // // //                             </StepLabel>
// // // //                         </Step>
// // // //                     ))}
// // // //                 </Stepper>
// // // //             </Paper>

// // // //             <Formik
// // // //                 initialValues={prepareInitialValues()}
// // // //                 validationSchema={validationSchema}
// // // //                 onSubmit={handleSubmit}
// // // //                 enableReinitialize={true}
// // // //                 validateOnMount={true}
// // // //                 validateOnChange={true}
// // // //                 validateOnBlur={true}
// // // //             >
// // // //                 {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isValid, setValues }) => (
// // // //                     <Form>
// // // //                         <Grid container spacing={3}>
// // // //                             <Grid item xs={12} lg={8}>
// // // //                                 <Card>
// // // //                                     <CardContent>
// // // //                                         {/* Step 0: Basic Info */}
// // // //                                         {activeStep === 0 && (
// // // //                                             <Box>
// // // //                                                 <Typography variant="h6" gutterBottom>
// // // //                                                     <InfoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
// // // //                                                     Basic Information
// // // //                                                 </Typography>
// // // //                                                 <Grid container spacing={3}>
// // // //                                                     <Grid item xs={12}>
// // // //                                                         <TextField
// // // //                                                             fullWidth
// // // //                                                             name="ruleName"
// // // //                                                             label="Rule Name *"
// // // //                                                             value={values.ruleName}
// // // //                                                             onChange={handleChange}
// // // //                                                             onBlur={handleBlur}
// // // //                                                             error={touched.ruleName && Boolean(errors.ruleName)}
// // // //                                                             helperText={touched.ruleName && errors.ruleName || "Enter a descriptive name for this rule"}
// // // //                                                             placeholder="e.g., Daily Fee Reminder"
// // // //                                                             disabled={isLoading}
// // // //                                                         />
// // // //                                                     </Grid>
// // // //                                                     <Grid item xs={12} md={6}>
// // // //                                                         <FormControl fullWidth error={touched.ruleType && Boolean(errors.ruleType)}>
// // // //                                                             <InputLabel>Rule Type *</InputLabel>
// // // //                                                             <Select
// // // //                                                                 name="ruleType"
// // // //                                                                 value={values.ruleType}
// // // //                                                                 onChange={handleChange}
// // // //                                                                 onBlur={handleBlur}
// // // //                                                                 label="Rule Type *"
// // // //                                                                 disabled={isLoading}
// // // //                                                             >
// // // //                                                                 {ruleTypes.map((type) => (
// // // //                                                                     <MenuItem key={type.value} value={type.value}>
// // // //                                                                         <Box display="flex" alignItems="center" gap={1}>
// // // //                                                                             {type.icon}
// // // //                                                                             <Box>
// // // //                                                                                 <Typography>{type.label}</Typography>
// // // //                                                                                 <Typography variant="caption" color="text.secondary">
// // // //                                                                                     {type.description}
// // // //                                                                                 </Typography>
// // // //                                                                             </Box>
// // // //                                                                         </Box>
// // // //                                                                     </MenuItem>
// // // //                                                                 ))}
// // // //                                                             </Select>
// // // //                                                             {touched.ruleType && errors.ruleType && (
// // // //                                                                 <FormHelperText>{errors.ruleType}</FormHelperText>
// // // //                                                             )}
// // // //                                                         </FormControl>
// // // //                                                     </Grid>
// // // //                                                     <Grid item xs={12} md={6}>
// // // //                                                         <FormControl fullWidth error={touched.category && Boolean(errors.category)}>
// // // //                                                             <InputLabel>Category *</InputLabel>
// // // //                                                             <Select
// // // //                                                                 name="category"
// // // //                                                                 value={values.category}
// // // //                                                                 onChange={handleChange}
// // // //                                                                 onBlur={handleBlur}
// // // //                                                                 label="Category *"
// // // //                                                                 disabled={isLoading}
// // // //                                                             >
// // // //                                                                 {categories.map((cat) => (
// // // //                                                                     <MenuItem key={cat.value} value={cat.value}>
// // // //                                                                         <Box display="flex" alignItems="center" gap={1}>
// // // //                                                                             <Chip
// // // //                                                                                 label={cat.label}
// // // //                                                                                 size="small"
// // // //                                                                                 color={cat.color}
// // // //                                                                                 icon={cat.icon}
// // // //                                                                             />
// // // //                                                                             <Box>
// // // //                                                                                 <Typography>{cat.label}</Typography>
// // // //                                                                                 <Typography variant="caption" color="text.secondary">
// // // //                                                                                     {cat.description}
// // // //                                                                                 </Typography>
// // // //                                                                             </Box>
// // // //                                                                         </Box>
// // // //                                                                     </MenuItem>
// // // //                                                                 ))}
// // // //                                                             </Select>
// // // //                                                             {touched.category && errors.category && (
// // // //                                                                 <FormHelperText>{errors.category}</FormHelperText>
// // // //                                                             )}
// // // //                                                         </FormControl>
// // // //                                                     </Grid>
// // // //                                                     <Grid item xs={12}>
// // // //                                                         <FormControlLabel
// // // //                                                             control={
// // // //                                                                 <Switch
// // // //                                                                     name="isActive"
// // // //                                                                     checked={values.isActive}
// // // //                                                                     onChange={handleChange}
// // // //                                                                     color="success"
// // // //                                                                     disabled={isLoading}
// // // //                                                                 />
// // // //                                                             }
// // // //                                                             label={
// // // //                                                                 <Box display="flex" alignItems="center" gap={1}>
// // // //                                                                     {values.isActive ? (
// // // //                                                                         <CheckCircleIcon color="success" fontSize="small" />
// // // //                                                                     ) : (
// // // //                                                                         <ErrorIcon color="action" fontSize="small" />
// // // //                                                                     )}
// // // //                                                                     <Typography>
// // // //                                                                         {values.isActive ? 'Rule is active' : 'Rule is inactive'}
// // // //                                                                     </Typography>
// // // //                                                                 </Box>
// // // //                                                             }
// // // //                                                         />
// // // //                                                     </Grid>
// // // //                                                 </Grid>
// // // //                                             </Box>
// // // //                                         )}

// // // //                                         {/* Step 1: Schedule & Timing */}
// // // //                                         {activeStep === 1 && (
// // // //                                             <Box>
// // // //                                                 <Typography variant="h6" gutterBottom>
// // // //                                                     <ScheduleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
// // // //                                                     Schedule & Timing Configuration
// // // //                                                 </Typography>
// // // //                                                 <Divider sx={{ mb: 3 }} />
// // // //                                                 {renderTimingConfiguration(values, handleChange, setFieldValue)}
// // // //                                             </Box>
// // // //                                         )}

// // // //                                         {/* Step 2: Target & Filters */}
// // // //                                         {activeStep === 2 && (
// // // //                                             <Box>
// // // //                                                 <Typography variant="h6" gutterBottom>
// // // //                                                     <FilterListIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
// // // //                                                     Target & Filter Configuration
// // // //                                                 </Typography>
// // // //                                                 <Divider sx={{ mb: 3 }} />
                                                
// // // //                                                 <Grid container spacing={3}>
// // // //                                                     <Grid item xs={12}>
// // // //                                                         <FormControl fullWidth error={touched.targetType && Boolean(errors.targetType)}>
// // // //                                                             <InputLabel>Target Type *</InputLabel>
// // // //                                                             <Select
// // // //                                                                 name="targetType"
// // // //                                                                 value={values.targetType}
// // // //                                                                 onChange={(e) => {
// // // //                                                                     handleChange(e);
// // // //                                                                     setFieldValue('targetFilter', '{}');
// // // //                                                                 }}
// // // //                                                                 onBlur={handleBlur}
// // // //                                                                 label="Target Type *"
// // // //                                                                 disabled={isLoading}
// // // //                                                             >
// // // //                                                                 {targetTypes.map((type) => (
// // // //                                                                     <MenuItem key={type.value} value={type.value}>
// // // //                                                                         <Box display="flex" alignItems="center" gap={1}>
// // // //                                                                             {type.icon}
// // // //                                                                             <Typography>{type.label}</Typography>
// // // //                                                                         </Box>
// // // //                                                                     </MenuItem>
// // // //                                                                 ))}
// // // //                                                             </Select>
// // // //                                                             {touched.targetType && errors.targetType && (
// // // //                                                                 <FormHelperText>{errors.targetType}</FormHelperText>
// // // //                                                             )}
// // // //                                                         </FormControl>
// // // //                                                     </Grid>

// // // //                                                     {/* Target Filter Builder */}
// // // //                                                     {(values.targetType === 'CLASS' || values.targetType === 'SECTION' || 
// // // //                                                       values.targetType === 'SPECIFIC_USERS') && (
// // // //                                                         <Grid item xs={12}>
// // // //                                                             <Paper sx={{ p: 3, bgcolor: '#f5f5f5', mt: 2 }}>
// // // //                                                                 <Typography variant="subtitle1" gutterBottom>
// // // //                                                                     Configure Target Filters
// // // //                                                                 </Typography>
// // // //                                                                 <TargetFilterBuilder
// // // //                                                                     value={values.targetFilter}
// // // //                                                                     onChange={(newFilter) => setFieldValue('targetFilter', newFilter)}
// // // //                                                                     category={values.category}
// // // //                                                                     targetType={values.targetType}
// // // //                                                                     disabled={isLoading}
// // // //                                                                 />
// // // //                                                             </Paper>
// // // //                                                         </Grid>
// // // //                                                     )}

// // // //                                                     {/* Fee Configuration */}
// // // //                                                     {values.category === 'FEE' && (
// // // //                                                         <Grid item xs={12}>
// // // //                                                             <Paper sx={{ p: 3, bgcolor: '#f5f5f5', mt: 2 }}>
// // // //                                                                 <Typography variant="subtitle1" gutterBottom>
// // // //                                                                     Fee Reminder Settings
// // // //                                                                 </Typography>
// // // //                                                                 <TargetFilterBuilder
// // // //                                                                     value={values.targetFilter}
// // // //                                                                     onChange={(newFilter) => setFieldValue('targetFilter', newFilter)}
// // // //                                                                     category={values.category}
// // // //                                                                     targetType={values.targetType}
// // // //                                                                     disabled={isLoading}
// // // //                                                                 />
// // // //                                                             </Paper>
// // // //                                                         </Grid>
// // // //                                                     )}

// // // //                                                     <Grid item xs={12}>
// // // //                                                         <FormControlLabel
// // // //                                                             control={
// // // //                                                                 <Switch
// // // //                                                                     name="isBatch"
// // // //                                                                     checked={values.isBatch}
// // // //                                                                     onChange={handleChange}
// // // //                                                                     color="primary"
// // // //                                                                     disabled={isLoading}
// // // //                                                                 />
// // // //                                                             }
// // // //                                                             label={
// // // //                                                                 <Box display="flex" alignItems="center" gap={1}>
// // // //                                                                     <SendIcon fontSize="small" />
// // // //                                                                     <Typography>Send as batch notification</Typography>
// // // //                                                                     <Tooltip title="Batch notifications are processed together and can be tracked as a group">
// // // //                                                                         <InfoIcon fontSize="small" color="action" />
// // // //                                                                     </Tooltip>
// // // //                                                                 </Box>
// // // //                                                             }
// // // //                                                         />
// // // //                                                     </Grid>
// // // //                                                 </Grid>
// // // //                                             </Box>
// // // //                                         )}

// // // //                                         {/* Step 3: Content */}
// // // //                                         {activeStep === 3 && (
// // // //                                             <Box>
// // // //                                                 <Typography variant="h6" gutterBottom>
// // // //                                                     <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
// // // //                                                     Notification Content
// // // //                                                 </Typography>
// // // //                                                 <Typography variant="body2" color="text.secondary" paragraph>
// // // //                                                     Define your notification content using variables in curly braces {'{}'}
// // // //                                                 </Typography>

// // // //                                                 <Paper sx={{ p: 2, mb: 3, bgcolor: '#f5f5f5' }}>
// // // //                                                     <Typography variant="subtitle2" gutterBottom>
// // // //                                                         Insert Variable Into:
// // // //                                                     </Typography>
// // // //                                                     <RadioGroup
// // // //                                                         row
// // // //                                                         value={selectedInsertField}
// // // //                                                         onChange={(e) => setSelectedInsertField(e.target.value)}
// // // //                                                     >
// // // //                                                         <FormControlLabel
// // // //                                                             value="titleTemplate"
// // // //                                                             control={<Radio />}
// // // //                                                             label={
// // // //                                                                 <Box display="flex" alignItems="center" gap={0.5}>
// // // //                                                                     <AssignmentIcon fontSize="small" color="primary" />
// // // //                                                                     <Typography>Title</Typography>
// // // //                                                                 </Box>
// // // //                                                             }
// // // //                                                         />
// // // //                                                         <FormControlLabel
// // // //                                                             value="messageTemplate"
// // // //                                                             control={<Radio />}
// // // //                                                             label={
// // // //                                                                 <Box display="flex" alignItems="center" gap={0.5}>
// // // //                                                                     <MessageIcon fontSize="small" color="secondary" />
// // // //                                                                     <Typography>Message</Typography>
// // // //                                                                 </Box>
// // // //                                                             }
// // // //                                                         />
// // // //                                                         <FormControlLabel
// // // //                                                             value="dataTemplate"
// // // //                                                             control={<Radio />}
// // // //                                                             label={
// // // //                                                                 <Box display="flex" alignItems="center" gap={0.5}>
// // // //                                                                     <DataIcon fontSize="small" color="success" />
// // // //                                                                     <Typography>Data Payload</Typography>
// // // //                                                                 </Box>
// // // //                                                             }
// // // //                                                         />
// // // //                                                     </RadioGroup>
// // // //                                                 </Paper>

// // // //                                                 <Paper sx={{ p: 2, mb: 3, bgcolor: '#f5f5f5' }}>
// // // //                                                     <Typography variant="subtitle2" gutterBottom>
// // // //                                                         Available Variables for {values.category || 'General'} Notifications
// // // //                                                     </Typography>
// // // //                                                     <Box display="flex" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
// // // //                                                         {sampleVariables.COMMON.map((variable) => (
// // // //                                                             <Tooltip key={variable.name} title={`${variable.description} (Sample: ${variable.sample})`}>
// // // //                                                                 <Chip
// // // //                                                                     label={`{${variable.name}}`}
// // // //                                                                     size="small"
// // // //                                                                     onClick={() => insertVariableAtCursor(
// // // //                                                                         variable.name,
// // // //                                                                         setFieldValue,
// // // //                                                                         values,
// // // //                                                                         selectedInsertField,
// // // //                                                                         selectedInsertField === 'titleTemplate' ? titleRef : 
// // // //                                                                         selectedInsertField === 'messageTemplate' ? messageRef : dataRef
// // // //                                                                     )}
// // // //                                                                     variant="outlined"
// // // //                                                                     sx={{ cursor: 'pointer' }}
// // // //                                                                 />
// // // //                                                             </Tooltip>
// // // //                                                         ))}
// // // //                                                         {sampleVariables[values.category]?.map((variable) => (
// // // //                                                             <Tooltip key={variable.name} title={`${variable.description} (Sample: ${variable.sample})`}>
// // // //                                                                 <Chip
// // // //                                                                     label={`{${variable.name}}`}
// // // //                                                                     size="small"
// // // //                                                                     color="primary"
// // // //                                                                     onClick={() => insertVariableAtCursor(
// // // //                                                                         variable.name,
// // // //                                                                         setFieldValue,
// // // //                                                                         values,
// // // //                                                                         selectedInsertField,
// // // //                                                                         selectedInsertField === 'titleTemplate' ? titleRef : 
// // // //                                                                         selectedInsertField === 'messageTemplate' ? messageRef : dataRef
// // // //                                                                     )}
// // // //                                                                     sx={{ cursor: 'pointer' }}
// // // //                                                                 />
// // // //                                                             </Tooltip>
// // // //                                                         ))}
// // // //                                                     </Box>
// // // //                                                 </Paper>

// // // //                                                 <Grid container spacing={3}>
// // // //                                                     <Grid item xs={12}>
// // // //                                                         <TextField
// // // //                                                             fullWidth
// // // //                                                             name="titleTemplate"
// // // //                                                             label="Title Template *"
// // // //                                                             value={values.titleTemplate}
// // // //                                                             onChange={handleChange}
// // // //                                                             onBlur={handleBlur}
// // // //                                                             error={touched.titleTemplate && Boolean(errors.titleTemplate)}
// // // //                                                             helperText={touched.titleTemplate && errors.titleTemplate || "Notification title (max 200 chars)"}
// // // //                                                             multiline
// // // //                                                             rows={2}
// // // //                                                             disabled={isLoading}
// // // //                                                             inputRef={titleRef}
// // // //                                                             InputProps={{
// // // //                                                                 endAdornment: (
// // // //                                                                     <InputAdornment position="end">
// // // //                                                                         {values.titleTemplate.length}/200
// // // //                                                                     </InputAdornment>
// // // //                                                                 ),
// // // //                                                                 sx: {
// // // //                                                                     borderLeft: selectedInsertField === 'titleTemplate' ? '4px solid' : 'none',
// // // //                                                                     borderLeftColor: 'primary.main',
// // // //                                                                     pl: selectedInsertField === 'titleTemplate' ? 1 : 0
// // // //                                                                 }
// // // //                                                             }}
// // // //                                                             onClick={() => setSelectedInsertField('titleTemplate')}
// // // //                                                         />
// // // //                                                     </Grid>

// // // //                                                     <Grid item xs={12}>
// // // //                                                         <TextField
// // // //                                                             fullWidth
// // // //                                                             name="messageTemplate"
// // // //                                                             label="Message Template *"
// // // //                                                             value={values.messageTemplate}
// // // //                                                             onChange={handleChange}
// // // //                                                             onBlur={handleBlur}
// // // //                                                             error={touched.messageTemplate && Boolean(errors.messageTemplate)}
// // // //                                                             helperText={touched.messageTemplate && errors.messageTemplate || "Notification message (max 1000 chars)"}
// // // //                                                             multiline
// // // //                                                             rows={6}
// // // //                                                             disabled={isLoading}
// // // //                                                             inputRef={messageRef}
// // // //                                                             InputProps={{
// // // //                                                                 endAdornment: (
// // // //                                                                     <InputAdornment position="end">
// // // //                                                                         {values.messageTemplate.length}/1000
// // // //                                                                     </InputAdornment>
// // // //                                                                 ),
// // // //                                                                 sx: {
// // // //                                                                     borderLeft: selectedInsertField === 'messageTemplate' ? '4px solid' : 'none',
// // // //                                                                     borderLeftColor: 'secondary.main',
// // // //                                                                     pl: selectedInsertField === 'messageTemplate' ? 1 : 0
// // // //                                                                 }
// // // //                                                             }}
// // // //                                                             onClick={() => setSelectedInsertField('messageTemplate')}
// // // //                                                         />
// // // //                                                     </Grid>

// // // //                                                     <Grid item xs={12}>
// // // //                                                         <TextField
// // // //                                                             fullWidth
// // // //                                                             name="dataTemplate"
// // // //                                                             label="Data Template (JSON - Optional)"
// // // //                                                             value={values.dataTemplate || ''}
// // // //                                                             onChange={handleChange}
// // // //                                                             onBlur={handleBlur}
// // // //                                                             helperText="Additional data in JSON format for mobile apps"
// // // //                                                             multiline
// // // //                                                             rows={4}
// // // //                                                             placeholder='{"action": "view_details", "id": "{ID}"}'
// // // //                                                             disabled={isLoading}
// // // //                                                             inputRef={dataRef}
// // // //                                                             InputProps={{
// // // //                                                                 style: { fontFamily: 'monospace', fontSize: '0.875rem' },
// // // //                                                                 sx: {
// // // //                                                                     borderLeft: selectedInsertField === 'dataTemplate' ? '4px solid' : 'none',
// // // //                                                                     borderLeftColor: 'success.main',
// // // //                                                                     pl: selectedInsertField === 'dataTemplate' ? 1 : 0
// // // //                                                                 }
// // // //                                                             }}
// // // //                                                             onClick={() => setSelectedInsertField('dataTemplate')}
// // // //                                                         />
// // // //                                                     </Grid>
// // // //                                                 </Grid>

// // // //                                                 <Paper sx={{ p: 3, mt: 3, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
// // // //                                                     <Typography variant="subtitle2" gutterBottom color="primary">
// // // //                                                         Live Preview
// // // //                                                     </Typography>
// // // //                                                     <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1 }}>
// // // //                                                         <Typography variant="subtitle1" gutterBottom fontWeight="bold">
// // // //                                                             {values.titleTemplate || 'Title will appear here'}
// // // //                                                         </Typography>
// // // //                                                         <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
// // // //                                                             {values.messageTemplate || 'Message will appear here'}
// // // //                                                         </Typography>
// // // //                                                         {values.dataTemplate && (
// // // //                                                             <Box sx={{ mt: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
// // // //                                                                 <Typography variant="caption" color="text.secondary">
// // // //                                                                     Data Payload:
// // // //                                                                 </Typography>
// // // //                                                                 <pre style={{ margin: 0, fontSize: '0.75rem', overflowX: 'auto' }}>
// // // //                                                                     {values.dataTemplate}
// // // //                                                                 </pre>
// // // //                                                             </Box>
// // // //                                                         )}
// // // //                                                     </Box>
// // // //                                                 </Paper>
// // // //                                             </Box>
// // // //                                         )}

// // // //                                         {/* Step 4: Advanced */}
// // // //                                         {activeStep === 4 && (
// // // //                                             <Box>
// // // //                                                 <Typography variant="h6" gutterBottom>
// // // //                                                     <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
// // // //                                                     Advanced Settings
// // // //                                                 </Typography>
// // // //                                                 <Divider sx={{ mb: 3 }} />
// // // //                                                 <Grid container spacing={3}>
// // // //                                                     <Grid item xs={12} md={6}>
// // // //                                                         <FormControl fullWidth error={touched.priority && Boolean(errors.priority)}>
// // // //                                                             <InputLabel>Priority *</InputLabel>
// // // //                                                             <Select
// // // //                                                                 name="priority"
// // // //                                                                 value={values.priority || 2}
// // // //                                                                 onChange={handleChange}
// // // //                                                                 onBlur={handleBlur}
// // // //                                                                 label="Priority *"
// // // //                                                                 disabled={isLoading}
// // // //                                                             >
// // // //                                                                 {priorities.map((priority) => (
// // // //                                                                     <MenuItem key={priority.value} value={priority.value}>
// // // //                                                                         <Box display="flex" alignItems="center" gap={1}>
// // // //                                                                             <Chip
// // // //                                                                                 label={priority.label}
// // // //                                                                                 size="small"
// // // //                                                                                 color={priority.color}
// // // //                                                                             />
// // // //                                                                             <Box>
// // // //                                                                                 <Typography>Priority {priority.value}</Typography>
// // // //                                                                                 <Typography variant="caption" color="text.secondary">
// // // //                                                                                     {priority.description}
// // // //                                                                                 </Typography>
// // // //                                                                             </Box>
// // // //                                                                         </Box>
// // // //                                                                     </MenuItem>
// // // //                                                                 ))}
// // // //                                                             </Select>
// // // //                                                             {touched.priority && errors.priority && (
// // // //                                                                 <FormHelperText>{errors.priority}</FormHelperText>
// // // //                                                             )}
// // // //                                                         </FormControl>
// // // //                                                     </Grid>

// // // //                                                     <Grid item xs={12} md={6}>
// // // //                                                         <TextField
// // // //                                                             fullWidth
// // // //                                                             name="createdBy"
// // // //                                                             label="Created By"
// // // //                                                             value={getCurrentUserId()}
// // // //                                                             disabled
// // // //                                                             helperText="Your user ID (automatically assigned)"
// // // //                                                         />
// // // //                                                     </Grid>

// // // //                                                     {values.ruleType === 'EVENT' && (
// // // //                                                         <>
// // // //                                                             <Grid item xs={12} md={6}>
// // // //                                                                 <TextField
// // // //                                                                     fullWidth
// // // //                                                                     name="sourceTable"
// // // //                                                                     label="Source Table"
// // // //                                                                     value={values.sourceTable || ''}
// // // //                                                                     onChange={handleChange}
// // // //                                                                     onBlur={handleBlur}
// // // //                                                                     helperText="Database table to monitor for events"
// // // //                                                                     placeholder="e.g., tbl_FeePosting"
// // // //                                                                     disabled={isLoading}
// // // //                                                                 />
// // // //                                                             </Grid>
// // // //                                                             <Grid item xs={12} md={6}>
// // // //                                                                 <TextField
// // // //                                                                     fullWidth
// // // //                                                                     name="triggerField"
// // // //                                                                     label="Trigger Field"
// // // //                                                                     value={values.triggerField || ''}
// // // //                                                                     onChange={handleChange}
// // // //                                                                     onBlur={handleBlur}
// // // //                                                                     helperText="Field to monitor for changes"
// // // //                                                                     placeholder="e.g., Status"
// // // //                                                                     disabled={isLoading}
// // // //                                                                 />
// // // //                                                             </Grid>
// // // //                                                             <Grid item xs={12}>
// // // //                                                                 <TextField
// // // //                                                                     fullWidth
// // // //                                                                     name="triggerValue"
// // // //                                                                     label="Trigger Value"
// // // //                                                                     value={values.triggerValue || ''}
// // // //                                                                     onChange={handleChange}
// // // //                                                                     onBlur={handleBlur}
// // // //                                                                     helperText="Value that triggers the notification"
// // // //                                                                     placeholder="e.g., POSTED"
// // // //                                                                     disabled={isLoading}
// // // //                                                                 />
// // // //                                                             </Grid>
// // // //                                                         </>
// // // //                                                     )}

// // // //                                                     <Grid item xs={12}>
// // // //                                                         <Alert severity="info" icon={<InfoIcon />}>
// // // //                                                             <Typography variant="body2">
// // // //                                                                 <strong>Rule Summary:</strong> This rule will run{' '}
// // // //                                                                 {values.timingType === 'IMMEDIATE' ? 'immediately when triggered' :
// // // //                                                                  values.timingType === 'FIXED_TIME' ? `daily at ${values.fixedTime}` :
// // // //                                                                  values.timingType === 'DAYS_OFFSET' ? `every ${values.daysOffset} days` :
// // // //                                                                  values.timingType === 'CRON' ? `according to cron schedule: ${values.cronExpression}` :
// // // //                                                                  values.timingType?.toLowerCase()}.
// // // //                                                             </Typography>
// // // //                                                             <Typography variant="body2" sx={{ mt: 1 }}>
// // // //                                                                 <strong>Target:</strong> {targetTypes.find(t => t.value === values.targetType)?.label || 'All Users'}
// // // //                                                                 <br />
// // // //                                                                 <strong>Category:</strong> {values.category}
// // // //                                                                 <br />
// // // //                                                                 <strong>Batch Mode:</strong> {values.isBatch ? 'Enabled' : 'Disabled'}
// // // //                                                                 <br />
// // // //                                                                 <strong>Priority:</strong> {priorities.find(p => p.value === values.priority)?.label || 'Medium'} ({values.priority})
// // // //                                                             </Typography>
// // // //                                                         </Alert>
// // // //                                                     </Grid>
// // // //                                                 </Grid>
// // // //                                             </Box>
// // // //                                         )}

// // // //                                         {/* Navigation Buttons */}
// // // //                                         <Box display="flex" justifyContent="space-between" mt={4}>
// // // //                                             <Button
// // // //                                                 disabled={activeStep === 0 || isLoading}
// // // //                                                 onClick={handleBack}
// // // //                                                 startIcon={<CancelIcon />}
// // // //                                                 variant="outlined"
// // // //                                                 type="button"
// // // //                                             >
// // // //                                                 Back
// // // //                                             </Button>
// // // //                                             {activeStep < steps.length - 1 ? (
// // // //                                                 <Button
// // // //                                                     variant="contained"
// // // //                                                     onClick={handleNext}
// // // //                                                     disabled={isLoading || !isStepValid(values, errors, activeStep)}
// // // //                                                     type="button"
// // // //                                                 >
// // // //                                                     Next Step
// // // //                                                 </Button>
// // // //                                             ) : (
// // // //                                                 <Button
// // // //                                                     type="submit"
// // // //                                                     variant="contained"
// // // //                                                     color="primary"
// // // //                                                     disabled={isLoading || !isValid || isSubmitting}
// // // //                                                     startIcon={isLoading || isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
// // // //                                                 >
// // // //                                                     {isLoading || isSubmitting ? 'Saving...' : (isEditMode ? 'Update Rule' : 'Create Rule')}
// // // //                                                 </Button>
// // // //                                             )}
// // // //                                         </Box>
// // // //                                     </CardContent>
// // // //                                 </Card>
// // // //                             </Grid>

// // // //                             {/* Right Column - Summary */}
// // // //                             <Grid item xs={12} lg={4}>
// // // //                                 <Box sx={{ position: 'sticky', top: 24 }}>
// // // //                                     <Card sx={{ mb: 2 }}>
// // // //                                         <CardHeader title="Rule Summary" />
// // // //                                         <CardContent>
// // // //                                             <List disablePadding>
// // // //                                                 <ListItem sx={{ px: 0 }}>
// // // //                                                     <ListItemText primary="Rule Name" secondary={values.ruleName || 'Not set'} />
// // // //                                                 </ListItem>
// // // //                                                 <Divider sx={{ my: 1 }} />
// // // //                                                 <ListItem sx={{ px: 0 }}>
// // // //                                                     <ListItemText 
// // // //                                                         primary="Type & Category" 
// // // //                                                         secondary={
// // // //                                                             <Box display="flex" gap={1} sx={{ mt: 0.5 }}>
// // // //                                                                 <Chip label={values.ruleType} size="small" variant="outlined" />
// // // //                                                                 <Chip 
// // // //                                                                     label={values.category} 
// // // //                                                                     size="small" 
// // // //                                                                     color={categories.find(c => c.value === values.category)?.color || 'default'}
// // // //                                                                 />
// // // //                                                             </Box>
// // // //                                                         } 
// // // //                                                     />
// // // //                                                 </ListItem>
// // // //                                                 <Divider sx={{ my: 1 }} />
// // // //                                                 <ListItem sx={{ px: 0 }}>
// // // //                                                     <ListItemText 
// // // //                                                         primary="Schedule" 
// // // //                                                         secondary={
// // // //                                                             <Typography variant="body2" sx={{ mt: 0.5 }}>
// // // //                                                                 {values.timingType === 'IMMEDIATE' ? 'Immediate' :
// // // //                                                                  values.timingType === 'FIXED_TIME' ? `Daily at ${values.fixedTime || '09:00'}` :
// // // //                                                                  values.timingType === 'DAYS_OFFSET' ? `Every ${values.daysOffset || 1} days` :
// // // //                                                                  values.timingType === 'CRON' ? `Cron: ${values.cronExpression || '0 9 * * *'}` :
// // // //                                                                  values.timingType?.charAt(0).toUpperCase() + values.timingType?.slice(1).toLowerCase()}
// // // //                                                             </Typography>
// // // //                                                         } 
// // // //                                                     />
// // // //                                                 </ListItem>
// // // //                                                 <Divider sx={{ my: 1 }} />
// // // //                                                 <ListItem sx={{ px: 0 }}>
// // // //                                                     <ListItemText 
// // // //                                                         primary="Status" 
// // // //                                                         secondary={
// // // //                                                             <Box display="flex" alignItems="center" gap={1} sx={{ mt: 0.5 }}>
// // // //                                                                 <Chip 
// // // //                                                                     label={values.isActive ? 'Active' : 'Inactive'} 
// // // //                                                                     size="small" 
// // // //                                                                     color={values.isActive ? 'success' : 'error'} 
// // // //                                                                 />
// // // //                                                                 {values.isBatch && (
// // // //                                                                     <Chip label="Batch" size="small" variant="outlined" color="primary" />
// // // //                                                                 )}
// // // //                                                             </Box>
// // // //                                                         } 
// // // //                                                     />
// // // //                                                 </ListItem>
// // // //                                                 <Divider sx={{ my: 1 }} />
// // // //                                                 <ListItem sx={{ px: 0 }}>
// // // //                                                     <ListItemText 
// // // //                                                         primary="Priority" 
// // // //                                                         secondary={
// // // //                                                             <Chip 
// // // //                                                                 label={`${priorities.find(p => p.value === values.priority)?.label || 'Medium'} (${values.priority})`} 
// // // //                                                                 size="small" 
// // // //                                                                 color={priorities.find(p => p.value === values.priority)?.color}
// // // //                                                                 sx={{ mt: 0.5 }}
// // // //                                                             />
// // // //                                                         } 
// // // //                                                     />
// // // //                                                 </ListItem>
// // // //                                                 <Divider sx={{ my: 1 }} />
// // // //                                                 <ListItem sx={{ px: 0 }}>
// // // //                                                     <ListItemText 
// // // //                                                         primary="Target" 
// // // //                                                         secondary={
// // // //                                                             <Typography variant="body2" sx={{ mt: 0.5 }}>
// // // //                                                                 {targetTypes.find(t => t.value === values.targetType)?.label || 'All Users'}
// // // //                                                             </Typography>
// // // //                                                         } 
// // // //                                                     />
// // // //                                                 </ListItem>
// // // //                                             </List>

// // // //                                             {isEditMode && id && (
// // // //                                                 <Box mt={2} display="flex" flexDirection="column" gap={1}>
// // // //                                                     <Button
// // // //                                                         variant="outlined"
// // // //                                                         fullWidth
// // // //                                                         size="small"
// // // //                                                         onClick={() => handleTestRule(id)}
// // // //                                                         disabled={testing || isLoading}
// // // //                                                         startIcon={testing ? <CircularProgress size={16} /> : <SendIcon />}
// // // //                                                         color="primary"
// // // //                                                         type="button"
// // // //                                                     >
// // // //                                                         {testing ? 'Testing...' : 'Test Rule'}
// // // //                                                     </Button>
// // // //                                                     <Button
// // // //                                                         variant="outlined"
// // // //                                                         fullWidth
// // // //                                                         size="small"
// // // //                                                         onClick={() => handleExecuteRule(id)}
// // // //                                                         disabled={executing || isLoading}
// // // //                                                         startIcon={executing ? <CircularProgress size={16} /> : <PlayArrowIcon />}
// // // //                                                         color="secondary"
// // // //                                                         type="button"
// // // //                                                     >
// // // //                                                         {executing ? 'Executing...' : 'Execute Rule Now'}
// // // //                                                     </Button>
// // // //                                                     <Alert severity="warning" sx={{ mt: 0.5, py: 0 }}>
// // // //                                                         <Typography variant="caption">Executing will run the rule immediately.</Typography>
// // // //                                                     </Alert>
// // // //                                                 </Box>
// // // //                                             )}

// // // //                                             <Button
// // // //                                                 variant="outlined"
// // // //                                                 fullWidth
// // // //                                                 size="small"
// // // //                                                 onClick={() => navigate('/dashboard/notification-rules')}
// // // //                                                 startIcon={<CancelIcon />}
// // // //                                                 disabled={isLoading}
// // // //                                                 type="button"
// // // //                                                 sx={{ mt: 2 }}
// // // //                                             >
// // // //                                                 Cancel
// // // //                                             </Button>
// // // //                                         </CardContent>
// // // //                                     </Card>

// // // //                                     <Card>
// // // //                                         <CardHeader title="Quick Start" avatar={<AddIcon color="primary" />} />
// // // //                                         <CardContent>
// // // //                                             <Button
// // // //                                                 variant="contained"
// // // //                                                 fullWidth
// // // //                                                 size="small"
// // // //                                                 startIcon={<AddIcon />}
// // // //                                                 onClick={() => setShowTemplateDialog(true)}
// // // //                                                 type="button"
// // // //                                             >
// // // //                                                 Use Template
// // // //                                             </Button>
// // // //                                             <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
// // // //                                                 Start quickly with pre-configured templates.
// // // //                                             </Typography>
// // // //                                         </CardContent>
// // // //                                     </Card>

// // // //                                     <Card sx={{ mt: 2 }}>
// // // //                                         <CardHeader title="Setup Progress" />
// // // //                                         <CardContent>
// // // //                                             <LinearProgress
// // // //                                                 variant="determinate"
// // // //                                                 value={(activeStep + 1) / steps.length * 100}
// // // //                                                 sx={{ height: 6, borderRadius: 3, mb: 1 }}
// // // //                                             />
// // // //                                             <Typography variant="caption" color="text.secondary">
// // // //                                                 Step {activeStep + 1} of {steps.length}
// // // //                                             </Typography>
// // // //                                         </CardContent>
// // // //                                     </Card>
// // // //                                 </Box>
// // // //                             </Grid>
// // // //                         </Grid>
// // // //                     </Form>
// // // //                 )}
// // // //             </Formik>

// // // //             {/* Template Dialog */}
// // // //             <Dialog open={showTemplateDialog} onClose={() => setShowTemplateDialog(false)} maxWidth="md" fullWidth>
// // // //                 <DialogTitle>Select Rule Template</DialogTitle>
// // // //                 <DialogContent>
// // // //                     <Grid container spacing={2} sx={{ mt: 1 }}>
// // // //                         {ruleTemplates.map((template) => (
// // // //                             <Grid item xs={12} key={template.id}>
// // // //                                 <Card 
// // // //                                     variant="outlined" 
// // // //                                     sx={{ 
// // // //                                         cursor: 'pointer', 
// // // //                                         '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.50' } 
// // // //                                     }}
// // // //                                     onClick={() => {
// // // //                                         if (setValues) handleTemplateSelect(template, setValues);
// // // //                                     }}
// // // //                                 >
// // // //                                     <CardContent>
// // // //                                         <Box display="flex" justifyContent="space-between" alignItems="flex-start">
// // // //                                             <Box>
// // // //                                                 <Typography variant="h6">{template.name}</Typography>
// // // //                                                 <Typography variant="body2" color="text.secondary">{template.description}</Typography>
// // // //                                                 <Box display="flex" gap={1} mt={1}>
// // // //                                                     <Chip label={template.category} size="small" variant="outlined" />
// // // //                                                     <Chip label={`Priority ${template.priority}`} size="small" variant="outlined" />
// // // //                                                 </Box>
// // // //                                             </Box>
// // // //                                             <Button variant="contained" size="small">
// // // //                                                 Use Template
// // // //                                             </Button>
// // // //                                         </Box>
// // // //                                         <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
// // // //                                             Schedule: {template.timingType === 'FIXED_TIME' ? `Daily at ${template.fixedTime}` :
// // // //                                                        template.timingType === 'DAYS_OFFSET' ? `Every ${template.daysOffset} days` :
// // // //                                                        template.timingType}
// // // //                                         </Typography>
// // // //                                     </CardContent>
// // // //                                 </Card>
// // // //                             </Grid>
// // // //                         ))}
// // // //                     </Grid>
// // // //                 </DialogContent>
// // // //                 <DialogActions>
// // // //                     <Button onClick={() => setShowTemplateDialog(false)}>Cancel</Button>
// // // //                 </DialogActions>
// // // //             </Dialog>

// // // //             {/* Snackbar for notifications */}
// // // //             <Snackbar 
// // // //                 open={snackbar.open} 
// // // //                 autoHideDuration={6000} 
// // // //                 onClose={handleCloseSnackbar} 
// // // //                 anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
// // // //             >
// // // //                 <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
// // // //                     {snackbar.message}
// // // //                 </Alert>
// // // //             </Snackbar>
// // // //         </Box>
// // // //     );
// // // // };

// // // // export default NotificationRuleForm;

// // // // views/Dashboard/NotificationRules/NotificationRuleForm.jsx
// // // import React, { useState, useEffect, useRef } from 'react';
// // // import {
// // //     Box,
// // //     Button,
// // //     Card,
// // //     CardContent,
// // //     CardHeader,
// // //     FormControl,
// // //     FormControlLabel,
// // //     Grid,
// // //     MenuItem,
// // //     Switch,
// // //     TextField,
// // //     Typography,
// // //     Chip,
// // //     IconButton,
// // //     Divider,
// // //     Alert,
// // //     Stepper,
// // //     Step,
// // //     StepLabel,
// // //     Paper,
// // //     InputAdornment,
// // //     Tooltip,
// // //     CircularProgress,
// // //     Select,
// // //     InputLabel,
// // //     FormHelperText,
// // //     Snackbar,
// // //     LinearProgress,
// // //     List,
// // //     ListItem,
// // //     ListItemText,
// // //     Tabs,
// // //     Tab,
// // //     Dialog,
// // //     DialogTitle,
// // //     DialogContent,
// // //     DialogActions,
// // //     Radio,
// // //     RadioGroup,
// // // } from '@mui/material';
// // // import {
// // //     Add as AddIcon,
// // //     Info as InfoIcon,
// // //     CheckCircle as CheckCircleIcon,
// // //     Error as ErrorIcon,
// // //     Send as SendIcon,
// // //     Save as SaveIcon,
// // //     Cancel as CancelIcon,
// // //     Refresh as RefreshIcon,
// // //     PlayArrow as PlayArrowIcon,
// // //     Schedule as ScheduleIcon,
// // //     Payment as PaymentIcon,
// // //     AccountBalance as AccountBalanceIcon,
// // //     School as SchoolIcon,
// // //     Assignment as AssignmentIcon,
// // //     Announcement as AnnouncementIcon,
// // //     Warning as WarningIcon,
// // //     Event as EventIcon,
// // //     Person as PersonIcon,
// // //     AccessTime as AccessTimeIcon,
// // //     Timer as TimerIcon,
// // //     Today as TodayIcon,
// // //     CalendarToday as CalendarTodayIcon,
// // //     ViewWeek as ViewWeekIcon,
// // //     EventNote as EventNoteIcon,
// // //     FilterList as FilterListIcon,
// // //     Settings as SettingsIcon,
// // //     Message as MessageIcon,
// // //     DataUsage as DataIcon,
// // //     Close as CloseIcon,
// // //     ChildCare as ChildIcon,
// // // } from '@mui/icons-material';
// // // import { useNavigate, useParams } from 'react-router-dom';
// // // import { Formik, Form } from 'formik';
// // // import * as Yup from 'yup';
// // // import { usePermissions } from '../../../customHook/usePermissions';
// // // import {
// // //     useGetNotificationRuleByIdQuery,
// // //     useCreateNotificationRuleMutation,
// // //     useUpdateNotificationRuleMutation,
// // //     useTestNotificationRuleMutation,
// // //     useExecuteNotificationRuleMutation,
// // // } from '../../../store/api/notificationApi';
// // // import { useSelector } from 'react-redux';
// // // import TargetFilterBuilder from '../../../component/TargetFilterBuilder';

// // // // Validation Schema
// // // const validationSchema = Yup.object({
// // //     ruleName: Yup.string()
// // //         .required('Rule name is required')
// // //         .max(100, 'Rule name must be less than 100 characters'),
// // //     ruleType: Yup.string().required('Rule type is required'),
// // //     category: Yup.string().required('Category is required'),
// // //     titleTemplate: Yup.string()
// // //         .required('Title template is required')
// // //         .max(200, 'Title must be less than 200 characters'),
// // //     messageTemplate: Yup.string()
// // //         .required('Message template is required')
// // //         .max(1000, 'Message must be less than 1000 characters'),
// // //     targetType: Yup.string().required('Target type is required'),
// // //     isActive: Yup.boolean(),
// // //     priority: Yup.number()
// // //         .min(1, 'Priority must be between 1-3')
// // //         .max(3, 'Priority must be between 1-3')
// // //         .required('Priority is required'),
// // //     isBatch: Yup.boolean(),
// // //     timingType: Yup.string().required('Timing type is required'),
// // //     cronExpression: Yup.string().nullable(),
// // //     daysOffset: Yup.number().min(0, 'Days offset must be positive').nullable(),
// // //     fixedTime: Yup.string().nullable(),
// // //     targetFilter: Yup.string().test(
// // //         'json',
// // //         'Must be valid JSON',
// // //         (value) => {
// // //             if (!value) return true;
// // //             try {
// // //                 JSON.parse(value);
// // //                 return true;
// // //             } catch {
// // //                 return false;
// // //             }
// // //         }
// // //     )
// // // });

// // // // Initial values
// // // const getInitialValues = (userData = null) => ({
// // //     ruleName: '',
// // //     ruleType: 'CRON',
// // //     category: 'FEE',
// // //     sourceTable: '',
// // //     triggerField: '',
// // //     triggerValue: '',
// // //     timingType: 'DAILY',
// // //     fixedTime: '09:00',
// // //     daysOffset: 1,
// // //     cronExpression: '0 9 * * *',
// // //     titleTemplate: '',
// // //     messageTemplate: '',
// // //     dataTemplate: '',
// // //     targetType: 'PARENTS',
// // //     targetFilter: '{}',
// // //     isActive: true,
// // //     isBatch: true,
// // //     priority: 2,
// // //     createdBy: userData?.id || 1,
// // // });

// // // const steps = [
// // //     { label: 'Basic Info', icon: <InfoIcon /> },
// // //     { label: 'Schedule & Timing', icon: <ScheduleIcon /> },
// // //     { label: 'Target & Filters', icon: <FilterListIcon /> },
// // //     { label: 'Content', icon: <AssignmentIcon /> },
// // //     { label: 'Advanced', icon: <SettingsIcon /> },
// // // ];

// // // // Categories with icons
// // // const categories = [
// // //     { value: 'FEE', label: 'Fee', color: 'warning', icon: <PaymentIcon />, description: 'Fee-related notifications' },
// // //     { value: 'ATTENDANCE', label: 'Attendance', color: 'error', icon: <AccountBalanceIcon />, description: 'Attendance notifications' },
// // //     { value: 'EXAM', label: 'Exam', color: 'info', icon: <SchoolIcon />, description: 'Exam notifications' },
// // //     { value: 'HOMEWORK', label: 'Homework', color: 'success', icon: <AssignmentIcon />, description: 'Homework assignments' },
// // //     { value: 'ANNOUNCEMENT', label: 'Announcement', color: 'primary', icon: <AnnouncementIcon />, description: 'School announcements' },
// // //     { value: 'GENERAL', label: 'General', color: 'default', icon: <InfoIcon />, description: 'General notifications' },
// // //     { value: 'ALERT', label: 'Alert', color: 'error', icon: <WarningIcon />, description: 'Important alerts' },
// // //     { value: 'EVENT', label: 'Event', color: 'info', icon: <EventIcon />, description: 'School events' },
// // // ];

// // // const ruleTypes = [
// // //     { value: 'EVENT', label: 'Event Trigger', description: 'Triggered by database events', icon: <EventIcon /> },
// // //     { value: 'CRON', label: 'Scheduled (Cron)', description: 'Runs on a schedule', icon: <ScheduleIcon /> },
// // //     { value: 'MANUAL', label: 'Manual', description: 'Manual trigger only', icon: <PlayArrowIcon /> },
// // // ];

// // // const timingTypes = [
// // //     { value: 'IMMEDIATE', label: 'Immediate', icon: <AccessTimeIcon />, description: 'Run immediately when triggered' },
// // //     { value: 'FIXED_TIME', label: 'Fixed Time', icon: <TimerIcon />, description: 'Run at specific time each day' },
// // //     { value: 'DAYS_OFFSET', label: 'Days Offset', icon: <TodayIcon />, description: 'Run every X days' },
// // //     { value: 'CRON', label: 'Cron Expression', icon: <CalendarTodayIcon />, description: 'Advanced scheduling' },
// // //     { value: 'DAILY', label: 'Daily', icon: <TodayIcon />, description: 'Run once per day' },
// // //     { value: 'WEEKLY', label: 'Weekly', icon: <ViewWeekIcon />, description: 'Run once per week' },
// // //     { value: 'MONTHLY', label: 'Monthly', icon: <CalendarTodayIcon />, description: 'Run once per month' },
// // // ];

// // // const targetTypes = [
// // //     { value: 'ALL', label: 'All Users', icon: <PersonIcon /> },
// // //     { value: 'PARENTS', label: 'Parents Only', icon: <PersonIcon /> },
// // //     { value: 'TEACHERS', label: 'Teachers Only', icon: <PersonIcon /> },
// // //     { value: 'STUDENTS', label: 'Students Only', icon: <PersonIcon /> },
// // //     { value: 'CLASS', label: 'Class Specific', icon: <SchoolIcon /> },
// // //     { value: 'SECTION', label: 'Section Specific', icon: <SchoolIcon /> },
// // //     { value: 'SPECIFIC_USERS', label: 'Specific Users', icon: <PersonIcon /> },
// // //     { value: 'SPECIFIC_STUDENTS_DIRECT', label: 'Specific Students (Direct)', icon: <ChildIcon /> },
// // // ];

// // // const priorities = [
// // //     { value: 1, label: 'High', color: 'error', description: 'Urgent notifications' },
// // //     { value: 2, label: 'Medium', color: 'warning', description: 'Regular reminders' },
// // //     { value: 3, label: 'Low', color: 'info', description: 'Informational updates' },
// // // ];

// // // // Sample variables for different categories
// // // const sampleVariables = {
// // //     COMMON: [
// // //         { name: 'CurrentDate', description: 'Current date', sample: '25/01/2024' },
// // //         { name: 'CurrentTime', description: 'Current time', sample: '14:30' },
// // //         { name: 'RuleName', description: 'Rule name', sample: 'Fee Reminder' },
// // //         { name: 'Category', description: 'Notification category', sample: 'FEE' },
// // //     ],
// // //     FEE: [
// // //         { name: 'StudentName', description: 'Student name', sample: 'John Doe' },
// // //         { name: 'ParentName', description: 'Parent name', sample: 'Mr. Smith' },
// // //         { name: 'DueAmount', description: 'Due amount', sample: '5000' },
// // //         { name: 'DueDate', description: 'Due date', sample: '31/01/2024' },
// // //         { name: 'StatusText', description: 'Status description', sample: 'Due in 3 days' },
// // //     ],
// // //     ATTENDANCE: [
// // //         { name: 'StudentName', description: 'Student name', sample: 'John Doe' },
// // //         { name: 'Status', description: 'Attendance status', sample: 'Absent' },
// // //         { name: 'AttendanceDate', description: 'Attendance date', sample: '25/01/2024' },
// // //         { name: 'Remarks', description: 'Remarks', sample: 'Medical Leave' },
// // //     ],
// // //     EXAM: [
// // //         { name: 'StudentName', description: 'Student name', sample: 'John Doe' },
// // //         { name: 'ExamTitle', description: 'Exam title', sample: 'Mid Term Examination' },
// // //         { name: 'ExamDate', description: 'Exam date', sample: '30/01/2024' },
// // //         { name: 'Subject', description: 'Subject', sample: 'Mathematics' },
// // //     ],
// // //     HOMEWORK: [
// // //         { name: 'StudentName', description: 'Student name', sample: 'John Doe' },
// // //         { name: 'HomeworkTitle', description: 'Homework title', sample: 'Math Assignment' },
// // //         { name: 'Subject', description: 'Subject', sample: 'Mathematics' },
// // //         { name: 'DueDate', description: 'Due date', sample: '30/01/2024' },
// // //     ],
// // // };

// // // // Rule templates
// // // const ruleTemplates = [
// // //     {
// // //         id: 1,
// // //         name: "Daily Fee Reminder",
// // //         category: "FEE",
// // //         description: "Send daily reminders for overdue fees",
// // //         timingType: "DAILY",
// // //         fixedTime: "09:00",
// // //         titleTemplate: "Fee Payment Due: {StudentName}",
// // //         messageTemplate: "Dear {ParentName},\nFee of Rs.{DueAmount} for {StudentName} is {StatusText}.\nDue date: {DueDate}",
// // //         priority: 2
// // //     },
// // //     {
// // //         id: 2,
// // //         name: "Weekly Attendance Summary",
// // //         category: "ATTENDANCE",
// // //         description: "Weekly summary of student attendance",
// // //         timingType: "WEEKLY",
// // //         fixedTime: "17:00",
// // //         titleTemplate: "Weekly Attendance Summary",
// // //         messageTemplate: "Attendance Summary for {StudentName}\nStatus: {Status}\nDate: {AttendanceDate}",
// // //         priority: 3
// // //     },
// // //     {
// // //         id: 3,
// // //         name: "Exam Reminder",
// // //         category: "EXAM",
// // //         description: "Remind students about exams",
// // //         timingType: "DAYS_OFFSET",
// // //         daysOffset: 3,
// // //         titleTemplate: "Exam Reminder: {ExamTitle}",
// // //         messageTemplate: "Dear Student,\n{ExamTitle} is scheduled on {ExamDate}.\nSubject: {Subject}",
// // //         priority: 2
// // //     },
// // // ];

// // // const NotificationRuleForm = () => {
// // //     const navigate = useNavigate();
// // //     const { id } = useParams();
// // //     const { isAdmin, isManager, isTeacher } = usePermissions();
// // //     const isEditMode = !!id;

// // //     const [activeStep, setActiveStep] = useState(0);
// // //     const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
// // //     const [showTemplateDialog, setShowTemplateDialog] = useState(false);
// // //     const [activeTab, setActiveTab] = useState(0);
// // //     const [selectedInsertField, setSelectedInsertField] = useState('titleTemplate');
// // //     const [isSubmitting, setIsSubmitting] = useState(false);

// // //     const titleRef = useRef();
// // //     const messageRef = useRef();
// // //     const dataRef = useRef();

// // //     const authUser = useSelector((state) => state.auth.user);

// // //     const { data: ruleData, isLoading: loadingRule, refetch } =
// // //         useGetNotificationRuleByIdQuery(id, { skip: !isEditMode });

// // //     const [createRule, { isLoading: creating }] = useCreateNotificationRuleMutation();
// // //     const [updateRule, { isLoading: updating }] = useUpdateNotificationRuleMutation();
// // //     const [testRule, { isLoading: testing }] = useTestNotificationRuleMutation();
// // //     const [executeRule, { isLoading: executing }] = useExecuteNotificationRuleMutation();

// // //     const getCurrentUserId = () => {
// // //         if (authUser?.id) return authUser.id;
// // //         try {
// // //             const storedUser = localStorage.getItem('user');
// // //             if (storedUser) {
// // //                 const user = JSON.parse(storedUser);
// // //                 return user.id || user.userId || 1;
// // //             }
// // //         } catch (error) {
// // //             return 1;
// // //         }
// // //         return 1;
// // //     };

// // //     const formatTimeForInput = (timeSpan) => {
// // //         if (!timeSpan) return '09:00';
// // //         try {
// // //             const timeStr = typeof timeSpan === 'string' ? timeSpan : timeSpan.toString();
// // //             const parts = timeStr.split(':');
// // //             if (parts.length >= 2) {
// // //                 return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
// // //             }
// // //             return '09:00';
// // //         } catch (error) {
// // //             return '09:00';
// // //         }
// // //     };

// // //     const showSnackbar = (message, severity = 'success') => {
// // //         setSnackbar({ open: true, message, severity });
// // //     };

// // //     const handleCloseSnackbar = () => {
// // //         setSnackbar({ ...snackbar, open: false });
// // //     };

// // //     const handleNext = (e) => {
// // //         if (e) {
// // //             e.preventDefault();
// // //             e.stopPropagation();
// // //         }
// // //         if (activeStep < steps.length - 1) {
// // //             setActiveStep(prev => prev + 1);
// // //         }
// // //     };

// // //     const handleBack = (e) => {
// // //         if (e) {
// // //             e.preventDefault();
// // //             e.stopPropagation();
// // //         }
// // //         if (activeStep > 0) {
// // //             setActiveStep(prev => prev - 1);
// // //         }
// // //     };

// // //     const handleTemplateSelect = (template, setValues) => {
// // //         if (setValues) {
// // //             setValues({
// // //                 ...getInitialValues({ id: getCurrentUserId() }),
// // //                 ruleName: template.name,
// // //                 category: template.category,
// // //                 timingType: template.timingType,
// // //                 fixedTime: template.fixedTime || '09:00',
// // //                 daysOffset: template.daysOffset || 1,
// // //                 titleTemplate: template.titleTemplate || '',
// // //                 messageTemplate: template.messageTemplate || '',
// // //                 priority: template.priority || 2,
// // //                 isBatch: true,
// // //             });
// // //         }
// // //         setShowTemplateDialog(false);
// // //         showSnackbar(`Template "${template.name}" applied successfully`, 'success');
// // //     };

// // //     const handleSubmit = async (values, { setSubmitting: formikSetSubmitting }) => {
// // //         if (isSubmitting) return;
// // //         if (activeStep !== steps.length - 1) {
// // //             showSnackbar('Please complete all steps before submitting', 'warning');
// // //             formikSetSubmitting(false);
// // //             return;
// // //         }

// // //         setIsSubmitting(true);

// // //         try {
// // //             const currentUserId = getCurrentUserId();
            
// // //             const isManualTrigger = values.ruleType === 'MANUAL' || 
// // //                                    (values.ruleType === 'EVENT' && values.timingType === 'IMMEDIATE');

// // //             let targetFilterString = '{}';
// // //             if (values.targetFilter && values.targetFilter.trim() !== '' && values.targetFilter !== '{}') {
// // //                 try {
// // //                     const parsed = JSON.parse(values.targetFilter);
// // //                     targetFilterString = JSON.stringify(parsed);
// // //                 } catch (error) {
// // //                     targetFilterString = '{}';
// // //                 }
// // //             }
// // // console.log('Formatted Target Filter:', targetFilterString);
// // //             // Format fixedTime correctly (HH:mm:ss)
// // //             let formattedFixedTime = null;
// // //             if (values.timingType === 'FIXED_TIME' || values.timingType === 'DAILY') {
// // //                 if (values.fixedTime) {
// // //                     const timeParts = values.fixedTime.split(':');
// // //                     if (timeParts.length === 2) {
// // //                         formattedFixedTime = `${timeParts[0].padStart(2, '0')}:${timeParts[1].padStart(2, '0')}:00`;
// // //                     } else {
// // //                         formattedFixedTime = '09:00:00';
// // //                     }
// // //                 }
// // //             }

// // //             // Format cron expression (ensure 5 parts)
// // //             let formattedCronExpression = null;
// // //             if (values.timingType === 'CRON' && values.cronExpression) {
// // //                 const cronParts = values.cronExpression.trim().split(/\s+/);
// // //                 if (cronParts.length === 6) {
// // //                     formattedCronExpression = cronParts.slice(1).join(' ');
// // //                 } else if (cronParts.length === 5) {
// // //                     formattedCronExpression = values.cronExpression.trim();
// // //                 } else {
// // //                     formattedCronExpression = '0 9 * * *';
// // //                 }
// // //             }

// // //             const ruleDataToSend = {
// // //                 ruleName: values.ruleName?.trim() || '',
// // //                 ruleType: values.ruleType || 'EVENT',
// // //                 category: values.category || 'GENERAL',
// // //                 isManualTrigger: isManualTrigger,
// // //                 sourceTable: values.ruleType === 'EVENT' ? (values.sourceTable?.trim() || null) : null,
// // //                 triggerField: values.ruleType === 'EVENT' ? (values.triggerField?.trim() || null) : null,
// // //                 triggerValue: values.ruleType === 'EVENT' ? (values.triggerValue?.trim() || null) : null,
// // //                 timingType: values.timingType || 'IMMEDIATE',
// // //                 daysOffset: values.timingType === 'DAYS_OFFSET' ? (values.daysOffset || 1) : null,
// // //                 fixedTime: formattedFixedTime,
// // //                 cronExpression: formattedCronExpression,
// // //                 titleTemplate: values.titleTemplate?.trim() || '',
// // //                 messageTemplate: values.messageTemplate?.trim() || '',
// // //                 dataTemplate: values.dataTemplate?.trim() || null,
// // //                 targetType: values.targetType || 'ALL',
// // //                 targetFilter: targetFilterString,
// // //                 isBatch: values.isBatch ?? true,
// // //                 priority: parseInt(values.priority) || 2,
// // //                 isActive: values.isActive ?? true,
// // //                 createdBy: currentUserId
// // //             };
// // //             console.log('Data to send:', ruleDataToSend);

// // //             if (isEditMode) {
// // //                 await updateRule({ id, ...ruleDataToSend }).unwrap();
// // //                 showSnackbar('Rule updated successfully!', 'success');
// // //                 refetch();
// // //             } else {
// // //                 await createRule(ruleDataToSend).unwrap();
// // //                 showSnackbar('Rule created successfully!', 'success');
// // //             }

// // //             setTimeout(() => {
// // //                 navigate('/dashboard/notification-rules');
// // //             }, 1500);

// // //         } catch (error) {
// // //             let errorMessage = 'Failed to save rule. Please check your inputs.';
            
// // //             if (error.data?.errors) {
// // //                 const validationErrors = [];
// // //                 Object.keys(error.data.errors).forEach(key => {
// // //                     if (Array.isArray(error.data.errors[key])) {
// // //                         validationErrors.push(...error.data.errors[key]);
// // //                     }
// // //                 });
// // //                 errorMessage = validationErrors.join(', ');
// // //             } else if (error.data?.message) {
// // //                 errorMessage = error.data.message;
// // //             } else if (error.status === 400) {
// // //                 errorMessage = 'Bad request. Please check fixedTime format (HH:mm:ss) and other fields.';
// // //             }
            
// // //             showSnackbar(errorMessage, 'error');
// // //         } finally {
// // //             setIsSubmitting(false);
// // //             formikSetSubmitting(false);
// // //         }
// // //     };

// // //     const handleTestRule = async (ruleId) => {
// // //         if (!ruleId) {
// // //             showSnackbar('Please save the rule first before testing.', 'warning');
// // //             return;
// // //         }

// // //         try {
// // //             const testUserId = getCurrentUserId();
// // //             await testRule({ id: ruleId, testData: { testUserID: testUserId } }).unwrap();
// // //             showSnackbar('Rule test executed successfully!', 'success');
// // //         } catch (error) {
// // //             showSnackbar(error.data?.message || 'Test failed.', 'error');
// // //         }
// // //     };

// // //     const handleExecuteRule = async (ruleId) => {
// // //         if (!ruleId) {
// // //             showSnackbar('Please save the rule first before executing.', 'warning');
// // //             return;
// // //         }

// // //         try {
// // //             await executeRule(ruleId).unwrap();
// // //             showSnackbar('Rule executed successfully!', 'success');
// // //         } catch (error) {
// // //             showSnackbar(error.data?.message || 'Execution failed.', 'error');
// // //         }
// // //     };

// // //     const insertVariableAtCursor = (variable, setFieldValue, values, fieldName, textareaRef) => {
// // //         const variableText = `{${variable}}`;
// // //         const currentValue = values[fieldName] || '';

// // //         if (textareaRef && textareaRef.current) {
// // //             const textarea = textareaRef.current;
// // //             const startPos = textarea.selectionStart;
// // //             const endPos = textarea.selectionEnd;

// // //             const newValue = currentValue.substring(0, startPos) + variableText + currentValue.substring(endPos);
// // //             setFieldValue(fieldName, newValue);

// // //             setTimeout(() => {
// // //                 textarea.focus();
// // //                 textarea.setSelectionRange(startPos + variableText.length, startPos + variableText.length);
// // //             }, 0);
// // //         } else {
// // //             setFieldValue(fieldName, currentValue + variableText);
// // //         }
// // //         showSnackbar(`Added {${variable}} to ${fieldName === 'titleTemplate' ? 'Title' : fieldName === 'messageTemplate' ? 'Message' : 'Data'}`, 'info');
// // //     };

// // //     const isStepValid = (values, errors, step) => {
// // //         switch (step) {
// // //             case 0:
// // //                 return values.ruleName && values.ruleType && values.category;
// // //             case 1:
// // //                 if (!values.timingType) return false;
// // //                 if (values.timingType === 'FIXED_TIME' && !values.fixedTime) return false;
// // //                 if (values.timingType === 'DAYS_OFFSET' && (!values.daysOffset || values.daysOffset < 1)) return false;
// // //                 if (values.timingType === 'CRON' && !values.cronExpression) return false;
// // //                 return true;
// // //             case 2:
// // //                 return values.targetType;
// // //             case 3:
// // //                 return values.titleTemplate && values.messageTemplate;
// // //             case 4:
// // //                 return values.priority;
// // //             default:
// // //                 return true;
// // //         }
// // //     };

// // //     const renderTimingConfiguration = (values, handleChange, setFieldValue) => {
// // //         const timingType = values.timingType || 'IMMEDIATE';

// // //         return (
// // //             <Box sx={{ mt: 2 }}>
// // //                 <Box sx={{ mb: 3 }}>
// // //                     <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mb: 1 }}>
// // //                         Select Timing Type
// // //                     </Typography>
// // //                     <FormControl fullWidth>
// // //                         <InputLabel>Timing Type *</InputLabel>
// // //                         <Select
// // //                             name="timingType"
// // //                             value={values.timingType}
// // //                             onChange={handleChange}
// // //                             label="Timing Type *"
// // //                             disabled={isLoading}
// // //                         >
// // //                             {timingTypes.map((type) => (
// // //                                 <MenuItem key={type.value} value={type.value}>
// // //                                     <Box display="flex" alignItems="center" gap={1}>
// // //                                         {type.icon}
// // //                                         <Box>
// // //                                             <Typography>{type.label}</Typography>
// // //                                             <Typography variant="caption" color="text.secondary">
// // //                                                 {type.description}
// // //                                             </Typography>
// // //                                         </Box>
// // //                                     </Box>
// // //                                 </MenuItem>
// // //                             ))}
// // //                         </Select>
// // //                     </FormControl>
// // //                 </Box>

// // //                 {timingType === 'FIXED_TIME' && (
// // //                     <Box sx={{ mb: 3 }}>
// // //                         <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mb: 1 }}>
// // //                             <TimerIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: '1rem' }} />
// // //                             Fixed Time
// // //                         </Typography>
// // //                         <TextField
// // //                             fullWidth
// // //                             name="fixedTime"
// // //                             label="Select Time"
// // //                             type="time"
// // //                             value={values.fixedTime || '09:00'}
// // //                             onChange={handleChange}
// // //                             InputLabelProps={{ shrink: true }}
// // //                             helperText="Choose the time when notifications will be sent daily"
// // //                         />
// // //                     </Box>
// // //                 )}

// // //                 {timingType === 'DAYS_OFFSET' && (
// // //                     <Box sx={{ mb: 3 }}>
// // //                         <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mb: 1 }}>
// // //                             <TodayIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: '1rem' }} />
// // //                             Days Offset
// // //                         </Typography>
// // //                         <TextField
// // //                             fullWidth
// // //                             name="daysOffset"
// // //                             label="Number of Days"
// // //                             type="number"
// // //                             value={values.daysOffset || 1}
// // //                             onChange={handleChange}
// // //                             InputProps={{
// // //                                 endAdornment: <InputAdornment position="end">days</InputAdornment>,
// // //                                 inputProps: { min: 1 }
// // //                             }}
// // //                             helperText="How many days between each notification"
// // //                         />
// // //                     </Box>
// // //                 )}

// // //                 {timingType === 'CRON' && (
// // //                     <Box sx={{ mb: 3 }}>
// // //                         <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mb: 1 }}>
// // //                             <ScheduleIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: '1rem' }} />
// // //                             Cron Expression
// // //                         </Typography>
// // //                         <TextField
// // //                             fullWidth
// // //                             name="cronExpression"
// // //                             label="Cron Expression"
// // //                             value={values.cronExpression || '0 9 * * *'}
// // //                             onChange={handleChange}
// // //                             helperText="Format: minute hour day month day-of-week (e.g., 0 9 * * * for daily at 9 AM)"
// // //                             placeholder="0 9 * * *"
// // //                         />
// // //                         <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
// // //                             Examples: "0 9 * * *" = Daily at 9 AM, "0 9 */3 * *" = Every 3 days at 9 AM
// // //                         </Typography>
// // //                     </Box>
// // //                 )}

// // //                 {(timingType === 'DAILY' || timingType === 'WEEKLY' || timingType === 'MONTHLY') && (
// // //                     <Box sx={{ mb: 3 }}>
// // //                         <Alert severity="info" icon={<InfoIcon />}>
// // //                             <Typography variant="body2">
// // //                                 This rule will run {timingType.toLowerCase()} at the scheduled time.
// // //                             </Typography>
// // //                         </Alert>
// // //                     </Box>
// // //                 )}

// // //                 {timingType === 'IMMEDIATE' && (
// // //                     <Box sx={{ mb: 3 }}>
// // //                         <Alert severity="info" icon={<AccessTimeIcon />}>
// // //                             <Typography variant="body2">
// // //                                 Notifications will be sent immediately when the rule is triggered.
// // //                             </Typography>
// // //                         </Alert>
// // //                     </Box>
// // //                 )}
// // //             </Box>
// // //         );
// // //     };

// // //     // Prepare initial values with proper targetFilter parsing
// // //     const prepareInitialValues = () => {
// // //         if (isEditMode && ruleData?.data) {
// // //             const rule = ruleData.data;
// // //             let targetFilterValue = '{}';
            
// // //             if (rule.targetFilter) {
// // //                 if (typeof rule.targetFilter === 'string') {
// // //                     try {
// // //                         const parsed = JSON.parse(rule.targetFilter);
// // //                         targetFilterValue = JSON.stringify(parsed, null, 2);
// // //                     } catch {
// // //                         targetFilterValue = rule.targetFilter;
// // //                     }
// // //                 } else if (typeof rule.targetFilter === 'object') {
// // //                     targetFilterValue = JSON.stringify(rule.targetFilter, null, 2);
// // //                 }
// // //             }
            
// // //             return {
// // //                 ruleName: rule.ruleName || '',
// // //                 ruleType: rule.ruleType || 'CRON',
// // //                 category: rule.category || 'FEE',
// // //                 sourceTable: rule.sourceTable || '',
// // //                 triggerField: rule.triggerField || '',
// // //                 triggerValue: rule.triggerValue || '',
// // //                 timingType: rule.timingType || 'DAILY',
// // //                 fixedTime: rule.fixedTime ? formatTimeForInput(rule.fixedTime) : '09:00',
// // //                 daysOffset: rule.daysOffset || 1,
// // //                 cronExpression: rule.cronExpression || '0 9 * * *',
// // //                 titleTemplate: rule.titleTemplate || '',
// // //                 messageTemplate: rule.messageTemplate || '',
// // //                 dataTemplate: rule.dataTemplate || '',
// // //                 targetType: rule.targetType || 'PARENTS',
// // //                 targetFilter: targetFilterValue,
// // //                 isActive: rule.isActive ?? true,
// // //                 isBatch: rule.isBatch ?? true,
// // //                 priority: rule.priority || 2,
// // //                 createdBy: rule.createdBy || getCurrentUserId(),
// // //             };
// // //         }
// // //         return getInitialValues({ id: getCurrentUserId() });
// // //     };

// // //     const isLoading = loadingRule || creating || updating || isSubmitting;

// // //     if (!isAdmin() && !isManager() && !isTeacher()) {
// // //         return (
// // //             <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
// // //                 <Alert severity="error">Access Denied - Notification rule management is only available to authorized users.</Alert>
// // //             </Box>
// // //         );
// // //     }

// // //     if (loadingRule && isEditMode) {
// // //         return (
// // //             <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
// // //                 <CircularProgress size={60} />
// // //                 <Typography sx={{ mt: 3 }}>Loading rule...</Typography>
// // //             </Box>
// // //         );
// // //     }

// // //     return (
// // //         <Box sx={{ maxWidth: 1400, margin: '0 auto', p: { xs: 2, md: 3 } }}>
// // //             <Box sx={{ mb: 4 }}>
// // //                 <Typography variant="h4" gutterBottom>
// // //                     {isEditMode ? 'Edit Notification Rule' : 'Create Notification Rule'}
// // //                 </Typography>
// // //                 <Typography variant="body1" color="text.secondary">
// // //                     {isEditMode ? 'Modify your notification rule settings' : 'Define a new notification rule with complete flexibility'}
// // //                 </Typography>
// // //             </Box>

// // //             <Paper sx={{ p: 3, mb: 4 }}>
// // //                 <Stepper activeStep={activeStep} alternativeLabel>
// // //                     {steps.map((step, index) => (
// // //                         <Step key={step.label}>
// // //                             <StepLabel StepIconComponent={() => step.icon}>
// // //                                 {step.label}
// // //                             </StepLabel>
// // //                         </Step>
// // //                     ))}
// // //                 </Stepper>
// // //             </Paper>

// // //             <Formik
// // //                 initialValues={prepareInitialValues()}
// // //                 validationSchema={validationSchema}
// // //                 onSubmit={handleSubmit}
// // //                 enableReinitialize={true}
// // //                 validateOnMount={true}
// // //                 validateOnChange={true}
// // //                 validateOnBlur={true}
// // //             >
// // //                 {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isValid, setValues }) => (
// // //                     <Form>
// // //                         <Grid container spacing={3}>
// // //                             <Grid item xs={12} lg={8}>
// // //                                 <Card>
// // //                                     <CardContent>
// // //                                         {/* Step 0: Basic Info */}
// // //                                         {activeStep === 0 && (
// // //                                             <Box>
// // //                                                 <Typography variant="h6" gutterBottom>
// // //                                                     <InfoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
// // //                                                     Basic Information
// // //                                                 </Typography>
// // //                                                 <Grid container spacing={3}>
// // //                                                     <Grid item xs={12}>
// // //                                                         <TextField
// // //                                                             fullWidth
// // //                                                             name="ruleName"
// // //                                                             label="Rule Name *"
// // //                                                             value={values.ruleName}
// // //                                                             onChange={handleChange}
// // //                                                             onBlur={handleBlur}
// // //                                                             error={touched.ruleName && Boolean(errors.ruleName)}
// // //                                                             helperText={touched.ruleName && errors.ruleName || "Enter a descriptive name for this rule"}
// // //                                                             placeholder="e.g., Daily Fee Reminder"
// // //                                                             disabled={isLoading}
// // //                                                         />
// // //                                                     </Grid>
// // //                                                     <Grid item xs={12} md={6}>
// // //                                                         <FormControl fullWidth error={touched.ruleType && Boolean(errors.ruleType)}>
// // //                                                             <InputLabel>Rule Type *</InputLabel>
// // //                                                             <Select
// // //                                                                 name="ruleType"
// // //                                                                 value={values.ruleType}
// // //                                                                 onChange={handleChange}
// // //                                                                 onBlur={handleBlur}
// // //                                                                 label="Rule Type *"
// // //                                                                 disabled={isLoading}
// // //                                                             >
// // //                                                                 {ruleTypes.map((type) => (
// // //                                                                     <MenuItem key={type.value} value={type.value}>
// // //                                                                         <Box display="flex" alignItems="center" gap={1}>
// // //                                                                             {type.icon}
// // //                                                                             <Box>
// // //                                                                                 <Typography>{type.label}</Typography>
// // //                                                                                 <Typography variant="caption" color="text.secondary">
// // //                                                                                     {type.description}
// // //                                                                                 </Typography>
// // //                                                                             </Box>
// // //                                                                         </Box>
// // //                                                                     </MenuItem>
// // //                                                                 ))}
// // //                                                             </Select>
// // //                                                             {touched.ruleType && errors.ruleType && (
// // //                                                                 <FormHelperText>{errors.ruleType}</FormHelperText>
// // //                                                             )}
// // //                                                         </FormControl>
// // //                                                     </Grid>
// // //                                                     <Grid item xs={12} md={6}>
// // //                                                         <FormControl fullWidth error={touched.category && Boolean(errors.category)}>
// // //                                                             <InputLabel>Category *</InputLabel>
// // //                                                             <Select
// // //                                                                 name="category"
// // //                                                                 value={values.category}
// // //                                                                 onChange={handleChange}
// // //                                                                 onBlur={handleBlur}
// // //                                                                 label="Category *"
// // //                                                                 disabled={isLoading}
// // //                                                             >
// // //                                                                 {categories.map((cat) => (
// // //                                                                     <MenuItem key={cat.value} value={cat.value}>
// // //                                                                         <Box display="flex" alignItems="center" gap={1}>
// // //                                                                             <Chip
// // //                                                                                 label={cat.label}
// // //                                                                                 size="small"
// // //                                                                                 color={cat.color}
// // //                                                                                 icon={cat.icon}
// // //                                                                             />
// // //                                                                             <Box>
// // //                                                                                 <Typography>{cat.label}</Typography>
// // //                                                                                 <Typography variant="caption" color="text.secondary">
// // //                                                                                     {cat.description}
// // //                                                                                 </Typography>
// // //                                                                             </Box>
// // //                                                                         </Box>
// // //                                                                     </MenuItem>
// // //                                                                 ))}
// // //                                                             </Select>
// // //                                                             {touched.category && errors.category && (
// // //                                                                 <FormHelperText>{errors.category}</FormHelperText>
// // //                                                             )}
// // //                                                         </FormControl>
// // //                                                     </Grid>
// // //                                                     <Grid item xs={12}>
// // //                                                         <FormControlLabel
// // //                                                             control={
// // //                                                                 <Switch
// // //                                                                     name="isActive"
// // //                                                                     checked={values.isActive}
// // //                                                                     onChange={handleChange}
// // //                                                                     color="success"
// // //                                                                     disabled={isLoading}
// // //                                                                 />
// // //                                                             }
// // //                                                             label={
// // //                                                                 <Box display="flex" alignItems="center" gap={1}>
// // //                                                                     {values.isActive ? (
// // //                                                                         <CheckCircleIcon color="success" fontSize="small" />
// // //                                                                     ) : (
// // //                                                                         <ErrorIcon color="action" fontSize="small" />
// // //                                                                     )}
// // //                                                                     <Typography>
// // //                                                                         {values.isActive ? 'Rule is active' : 'Rule is inactive'}
// // //                                                                     </Typography>
// // //                                                                 </Box>
// // //                                                             }
// // //                                                         />
// // //                                                     </Grid>
// // //                                                 </Grid>
// // //                                             </Box>
// // //                                         )}

// // //                                         {/* Step 1: Schedule & Timing */}
// // //                                         {activeStep === 1 && (
// // //                                             <Box>
// // //                                                 <Typography variant="h6" gutterBottom>
// // //                                                     <ScheduleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
// // //                                                     Schedule & Timing Configuration
// // //                                                 </Typography>
// // //                                                 <Divider sx={{ mb: 3 }} />
// // //                                                 {renderTimingConfiguration(values, handleChange, setFieldValue)}
// // //                                             </Box>
// // //                                         )}

// // //                                         {/* Step 2: Target & Filters */}
// // //                                         {activeStep === 2 && (
// // //                                             <Box>
// // //                                                 <Typography variant="h6" gutterBottom>
// // //                                                     <FilterListIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
// // //                                                     Target & Filter Configuration
// // //                                                 </Typography>
// // //                                                 <Divider sx={{ mb: 3 }} />
                                                
// // //                                                 <Grid container spacing={3}>
// // //                                                     <Grid item xs={12}>
// // //                                                         <FormControl fullWidth error={touched.targetType && Boolean(errors.targetType)}>
// // //                                                             <InputLabel>Target Type *</InputLabel>
// // //                                                             <Select
// // //                                                                 name="targetType"
// // //                                                                 value={values.targetType}
// // //                                                                 onChange={(e) => {
// // //                                                                     handleChange(e);
// // //                                                                     setFieldValue('targetFilter', '{}');
// // //                                                                 }}
// // //                                                                 onBlur={handleBlur}
// // //                                                                 label="Target Type *"
// // //                                                                 disabled={isLoading}
// // //                                                             >
// // //                                                                 {targetTypes.map((type) => (
// // //                                                                     <MenuItem key={type.value} value={type.value}>
// // //                                                                         <Box display="flex" alignItems="center" gap={1}>
// // //                                                                             {type.icon}
// // //                                                                             <Typography>{type.label}</Typography>
// // //                                                                         </Box>
// // //                                                                     </MenuItem>
// // //                                                                 ))}
// // //                                                             </Select>
// // //                                                             {touched.targetType && errors.targetType && (
// // //                                                                 <FormHelperText>{errors.targetType}</FormHelperText>
// // //                                                             )}
// // //                                                         </FormControl>
// // //                                                     </Grid>

// // //                                                     {/* Target Filter Builder - UPDATED to include SPECIFIC_STUDENTS_DIRECT */}
// // //                                                     {(values.targetType === 'CLASS' || 
// // //                                                       values.targetType === 'SECTION' || 
// // //                                                       values.targetType === 'SPECIFIC_USERS' ||
// // //                                                       values.targetType === 'SPECIFIC_STUDENTS_DIRECT') && (
// // //                                                         <Grid item xs={12}>
// // //                                                             <Paper sx={{ p: 3, bgcolor: '#f5f5f5', mt: 2 }}>
// // //                                                                 <Typography variant="subtitle1" gutterBottom>
// // //                                                                     Configure Target Filters
// // //                                                                 </Typography>
// // //                                                                 <TargetFilterBuilder
// // //                                                                     value={values.targetFilter}
// // //                                                                     onChange={(newFilter) => setFieldValue('targetFilter', newFilter)}
// // //                                                                     category={values.category}
// // //                                                                     targetType={values.targetType}
// // //                                                                     disabled={isLoading}
// // //                                                                 />
// // //                                                             </Paper>
// // //                                                         </Grid>
// // //                                                     )}

// // //                                                     {/* Fee Configuration */}
// // //                                                     {values.category === 'FEE' && (
// // //                                                         <Grid item xs={12}>
// // //                                                             <Paper sx={{ p: 3, bgcolor: '#f5f5f5', mt: 2 }}>
// // //                                                                 <Typography variant="subtitle1" gutterBottom>
// // //                                                                     Fee Reminder Settings
// // //                                                                 </Typography>
// // //                                                                 <TargetFilterBuilder
// // //                                                                     value={values.targetFilter}
// // //                                                                     onChange={(newFilter) => setFieldValue('targetFilter', newFilter)}
// // //                                                                     category={values.category}
// // //                                                                     targetType={values.targetType}
// // //                                                                     disabled={isLoading}
// // //                                                                 />
// // //                                                             </Paper>
// // //                                                         </Grid>
// // //                                                     )}

// // //                                                     <Grid item xs={12}>
// // //                                                         <FormControlLabel
// // //                                                             control={
// // //                                                                 <Switch
// // //                                                                     name="isBatch"
// // //                                                                     checked={values.isBatch}
// // //                                                                     onChange={handleChange}
// // //                                                                     color="primary"
// // //                                                                     disabled={isLoading}
// // //                                                                 />
// // //                                                             }
// // //                                                             label={
// // //                                                                 <Box display="flex" alignItems="center" gap={1}>
// // //                                                                     <SendIcon fontSize="small" />
// // //                                                                     <Typography>Send as batch notification</Typography>
// // //                                                                     <Tooltip title="Batch notifications are processed together and can be tracked as a group">
// // //                                                                         <InfoIcon fontSize="small" color="action" />
// // //                                                                     </Tooltip>
// // //                                                                 </Box>
// // //                                                             }
// // //                                                         />
// // //                                                     </Grid>
// // //                                                 </Grid>
// // //                                             </Box>
// // //                                         )}

// // //                                         {/* Step 3: Content */}
// // //                                         {activeStep === 3 && (
// // //                                             <Box>
// // //                                                 <Typography variant="h6" gutterBottom>
// // //                                                     <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
// // //                                                     Notification Content
// // //                                                 </Typography>
// // //                                                 <Typography variant="body2" color="text.secondary" paragraph>
// // //                                                     Define your notification content using variables in curly braces {'{}'}
// // //                                                 </Typography>

// // //                                                 <Paper sx={{ p: 2, mb: 3, bgcolor: '#f5f5f5' }}>
// // //                                                     <Typography variant="subtitle2" gutterBottom>
// // //                                                         Insert Variable Into:
// // //                                                     </Typography>
// // //                                                     <RadioGroup
// // //                                                         row
// // //                                                         value={selectedInsertField}
// // //                                                         onChange={(e) => setSelectedInsertField(e.target.value)}
// // //                                                     >
// // //                                                         <FormControlLabel
// // //                                                             value="titleTemplate"
// // //                                                             control={<Radio />}
// // //                                                             label={
// // //                                                                 <Box display="flex" alignItems="center" gap={0.5}>
// // //                                                                     <AssignmentIcon fontSize="small" color="primary" />
// // //                                                                     <Typography>Title</Typography>
// // //                                                                 </Box>
// // //                                                             }
// // //                                                         />
// // //                                                         <FormControlLabel
// // //                                                             value="messageTemplate"
// // //                                                             control={<Radio />}
// // //                                                             label={
// // //                                                                 <Box display="flex" alignItems="center" gap={0.5}>
// // //                                                                     <MessageIcon fontSize="small" color="secondary" />
// // //                                                                     <Typography>Message</Typography>
// // //                                                                 </Box>
// // //                                                             }
// // //                                                         />
// // //                                                         <FormControlLabel
// // //                                                             value="dataTemplate"
// // //                                                             control={<Radio />}
// // //                                                             label={
// // //                                                                 <Box display="flex" alignItems="center" gap={0.5}>
// // //                                                                     <DataIcon fontSize="small" color="success" />
// // //                                                                     <Typography>Data Payload</Typography>
// // //                                                                 </Box>
// // //                                                             }
// // //                                                         />
// // //                                                     </RadioGroup>
// // //                                                 </Paper>

// // //                                                 <Paper sx={{ p: 2, mb: 3, bgcolor: '#f5f5f5' }}>
// // //                                                     <Typography variant="subtitle2" gutterBottom>
// // //                                                         Available Variables for {values.category || 'General'} Notifications
// // //                                                     </Typography>
// // //                                                     <Box display="flex" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
// // //                                                         {sampleVariables.COMMON.map((variable) => (
// // //                                                             <Tooltip key={variable.name} title={`${variable.description} (Sample: ${variable.sample})`}>
// // //                                                                 <Chip
// // //                                                                     label={`{${variable.name}}`}
// // //                                                                     size="small"
// // //                                                                     onClick={() => insertVariableAtCursor(
// // //                                                                         variable.name,
// // //                                                                         setFieldValue,
// // //                                                                         values,
// // //                                                                         selectedInsertField,
// // //                                                                         selectedInsertField === 'titleTemplate' ? titleRef : 
// // //                                                                         selectedInsertField === 'messageTemplate' ? messageRef : dataRef
// // //                                                                     )}
// // //                                                                     variant="outlined"
// // //                                                                     sx={{ cursor: 'pointer' }}
// // //                                                                 />
// // //                                                             </Tooltip>
// // //                                                         ))}
// // //                                                         {sampleVariables[values.category]?.map((variable) => (
// // //                                                             <Tooltip key={variable.name} title={`${variable.description} (Sample: ${variable.sample})`}>
// // //                                                                 <Chip
// // //                                                                     label={`{${variable.name}}`}
// // //                                                                     size="small"
// // //                                                                     color="primary"
// // //                                                                     onClick={() => insertVariableAtCursor(
// // //                                                                         variable.name,
// // //                                                                         setFieldValue,
// // //                                                                         values,
// // //                                                                         selectedInsertField,
// // //                                                                         selectedInsertField === 'titleTemplate' ? titleRef : 
// // //                                                                         selectedInsertField === 'messageTemplate' ? messageRef : dataRef
// // //                                                                     )}
// // //                                                                     sx={{ cursor: 'pointer' }}
// // //                                                                 />
// // //                                                             </Tooltip>
// // //                                                         ))}
// // //                                                     </Box>
// // //                                                 </Paper>

// // //                                                 <Grid container spacing={3}>
// // //                                                     <Grid item xs={12}>
// // //                                                         <TextField
// // //                                                             fullWidth
// // //                                                             name="titleTemplate"
// // //                                                             label="Title Template *"
// // //                                                             value={values.titleTemplate}
// // //                                                             onChange={handleChange}
// // //                                                             onBlur={handleBlur}
// // //                                                             error={touched.titleTemplate && Boolean(errors.titleTemplate)}
// // //                                                             helperText={touched.titleTemplate && errors.titleTemplate || "Notification title (max 200 chars)"}
// // //                                                             multiline
// // //                                                             rows={2}
// // //                                                             disabled={isLoading}
// // //                                                             inputRef={titleRef}
// // //                                                             InputProps={{
// // //                                                                 endAdornment: (
// // //                                                                     <InputAdornment position="end">
// // //                                                                         {values.titleTemplate.length}/200
// // //                                                                     </InputAdornment>
// // //                                                                 ),
// // //                                                                 sx: {
// // //                                                                     borderLeft: selectedInsertField === 'titleTemplate' ? '4px solid' : 'none',
// // //                                                                     borderLeftColor: 'primary.main',
// // //                                                                     pl: selectedInsertField === 'titleTemplate' ? 1 : 0
// // //                                                                 }
// // //                                                             }}
// // //                                                             onClick={() => setSelectedInsertField('titleTemplate')}
// // //                                                         />
// // //                                                     </Grid>

// // //                                                     <Grid item xs={12}>
// // //                                                         <TextField
// // //                                                             fullWidth
// // //                                                             name="messageTemplate"
// // //                                                             label="Message Template *"
// // //                                                             value={values.messageTemplate}
// // //                                                             onChange={handleChange}
// // //                                                             onBlur={handleBlur}
// // //                                                             error={touched.messageTemplate && Boolean(errors.messageTemplate)}
// // //                                                             helperText={touched.messageTemplate && errors.messageTemplate || "Notification message (max 1000 chars)"}
// // //                                                             multiline
// // //                                                             rows={6}
// // //                                                             disabled={isLoading}
// // //                                                             inputRef={messageRef}
// // //                                                             InputProps={{
// // //                                                                 endAdornment: (
// // //                                                                     <InputAdornment position="end">
// // //                                                                         {values.messageTemplate.length}/1000
// // //                                                                     </InputAdornment>
// // //                                                                 ),
// // //                                                                 sx: {
// // //                                                                     borderLeft: selectedInsertField === 'messageTemplate' ? '4px solid' : 'none',
// // //                                                                     borderLeftColor: 'secondary.main',
// // //                                                                     pl: selectedInsertField === 'messageTemplate' ? 1 : 0
// // //                                                                 }
// // //                                                             }}
// // //                                                             onClick={() => setSelectedInsertField('messageTemplate')}
// // //                                                         />
// // //                                                     </Grid>

// // //                                                     <Grid item xs={12}>
// // //                                                         <TextField
// // //                                                             fullWidth
// // //                                                             name="dataTemplate"
// // //                                                             label="Data Template (JSON - Optional)"
// // //                                                             value={values.dataTemplate || ''}
// // //                                                             onChange={handleChange}
// // //                                                             onBlur={handleBlur}
// // //                                                             helperText="Additional data in JSON format for mobile apps"
// // //                                                             multiline
// // //                                                             rows={4}
// // //                                                             placeholder='{"action": "view_details", "id": "{ID}"}'
// // //                                                             disabled={isLoading}
// // //                                                             inputRef={dataRef}
// // //                                                             InputProps={{
// // //                                                                 style: { fontFamily: 'monospace', fontSize: '0.875rem' },
// // //                                                                 sx: {
// // //                                                                     borderLeft: selectedInsertField === 'dataTemplate' ? '4px solid' : 'none',
// // //                                                                     borderLeftColor: 'success.main',
// // //                                                                     pl: selectedInsertField === 'dataTemplate' ? 1 : 0
// // //                                                                 }
// // //                                                             }}
// // //                                                             onClick={() => setSelectedInsertField('dataTemplate')}
// // //                                                         />
// // //                                                     </Grid>
// // //                                                 </Grid>

// // //                                                 <Paper sx={{ p: 3, mt: 3, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
// // //                                                     <Typography variant="subtitle2" gutterBottom color="primary">
// // //                                                         Live Preview
// // //                                                     </Typography>
// // //                                                     <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1 }}>
// // //                                                         <Typography variant="subtitle1" gutterBottom fontWeight="bold">
// // //                                                             {values.titleTemplate || 'Title will appear here'}
// // //                                                         </Typography>
// // //                                                         <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
// // //                                                             {values.messageTemplate || 'Message will appear here'}
// // //                                                         </Typography>
// // //                                                         {values.dataTemplate && (
// // //                                                             <Box sx={{ mt: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
// // //                                                                 <Typography variant="caption" color="text.secondary">
// // //                                                                     Data Payload:
// // //                                                                 </Typography>
// // //                                                                 <pre style={{ margin: 0, fontSize: '0.75rem', overflowX: 'auto' }}>
// // //                                                                     {values.dataTemplate}
// // //                                                                 </pre>
// // //                                                             </Box>
// // //                                                         )}
// // //                                                     </Box>
// // //                                                 </Paper>
// // //                                             </Box>
// // //                                         )}

// // //                                         {/* Step 4: Advanced */}
// // //                                         {activeStep === 4 && (
// // //                                             <Box>
// // //                                                 <Typography variant="h6" gutterBottom>
// // //                                                     <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
// // //                                                     Advanced Settings
// // //                                                 </Typography>
// // //                                                 <Divider sx={{ mb: 3 }} />
// // //                                                 <Grid container spacing={3}>
// // //                                                     <Grid item xs={12} md={6}>
// // //                                                         <FormControl fullWidth error={touched.priority && Boolean(errors.priority)}>
// // //                                                             <InputLabel>Priority *</InputLabel>
// // //                                                             <Select
// // //                                                                 name="priority"
// // //                                                                 value={values.priority || 2}
// // //                                                                 onChange={handleChange}
// // //                                                                 onBlur={handleBlur}
// // //                                                                 label="Priority *"
// // //                                                                 disabled={isLoading}
// // //                                                             >
// // //                                                                 {priorities.map((priority) => (
// // //                                                                     <MenuItem key={priority.value} value={priority.value}>
// // //                                                                         <Box display="flex" alignItems="center" gap={1}>
// // //                                                                             <Chip
// // //                                                                                 label={priority.label}
// // //                                                                                 size="small"
// // //                                                                                 color={priority.color}
// // //                                                                             />
// // //                                                                             <Box>
// // //                                                                                 <Typography>Priority {priority.value}</Typography>
// // //                                                                                 <Typography variant="caption" color="text.secondary">
// // //                                                                                     {priority.description}
// // //                                                                                 </Typography>
// // //                                                                             </Box>
// // //                                                                         </Box>
// // //                                                                     </MenuItem>
// // //                                                                 ))}
// // //                                                             </Select>
// // //                                                             {touched.priority && errors.priority && (
// // //                                                                 <FormHelperText>{errors.priority}</FormHelperText>
// // //                                                             )}
// // //                                                         </FormControl>
// // //                                                     </Grid>

// // //                                                     <Grid item xs={12} md={6}>
// // //                                                         <TextField
// // //                                                             fullWidth
// // //                                                             name="createdBy"
// // //                                                             label="Created By"
// // //                                                             value={getCurrentUserId()}
// // //                                                             disabled
// // //                                                             helperText="Your user ID (automatically assigned)"
// // //                                                         />
// // //                                                     </Grid>

// // //                                                     {values.ruleType === 'EVENT' && (
// // //                                                         <>
// // //                                                             <Grid item xs={12} md={6}>
// // //                                                                 <TextField
// // //                                                                     fullWidth
// // //                                                                     name="sourceTable"
// // //                                                                     label="Source Table"
// // //                                                                     value={values.sourceTable || ''}
// // //                                                                     onChange={handleChange}
// // //                                                                     onBlur={handleBlur}
// // //                                                                     helperText="Database table to monitor for events"
// // //                                                                     placeholder="e.g., tbl_FeePosting"
// // //                                                                     disabled={isLoading}
// // //                                                                 />
// // //                                                             </Grid>
// // //                                                             <Grid item xs={12} md={6}>
// // //                                                                 <TextField
// // //                                                                     fullWidth
// // //                                                                     name="triggerField"
// // //                                                                     label="Trigger Field"
// // //                                                                     value={values.triggerField || ''}
// // //                                                                     onChange={handleChange}
// // //                                                                     onBlur={handleBlur}
// // //                                                                     helperText="Field to monitor for changes"
// // //                                                                     placeholder="e.g., Status"
// // //                                                                     disabled={isLoading}
// // //                                                                 />
// // //                                                             </Grid>
// // //                                                             <Grid item xs={12}>
// // //                                                                 <TextField
// // //                                                                     fullWidth
// // //                                                                     name="triggerValue"
// // //                                                                     label="Trigger Value"
// // //                                                                     value={values.triggerValue || ''}
// // //                                                                     onChange={handleChange}
// // //                                                                     onBlur={handleBlur}
// // //                                                                     helperText="Value that triggers the notification"
// // //                                                                     placeholder="e.g., POSTED"
// // //                                                                     disabled={isLoading}
// // //                                                                 />
// // //                                                             </Grid>
// // //                                                         </>
// // //                                                     )}

// // //                                                     <Grid item xs={12}>
// // //                                                         <Alert severity="info" icon={<InfoIcon />}>
// // //                                                             <Typography variant="body2">
// // //                                                                 <strong>Rule Summary:</strong> This rule will run{' '}
// // //                                                                 {values.timingType === 'IMMEDIATE' ? 'immediately when triggered' :
// // //                                                                  values.timingType === 'FIXED_TIME' ? `daily at ${values.fixedTime}` :
// // //                                                                  values.timingType === 'DAYS_OFFSET' ? `every ${values.daysOffset} days` :
// // //                                                                  values.timingType === 'CRON' ? `according to cron schedule: ${values.cronExpression}` :
// // //                                                                  values.timingType?.toLowerCase()}.
// // //                                                             </Typography>
// // //                                                             <Typography variant="body2" sx={{ mt: 1 }}>
// // //                                                                 <strong>Target:</strong> {targetTypes.find(t => t.value === values.targetType)?.label || 'All Users'}
// // //                                                                 <br />
// // //                                                                 <strong>Category:</strong> {values.category}
// // //                                                                 <br />
// // //                                                                 <strong>Batch Mode:</strong> {values.isBatch ? 'Enabled' : 'Disabled'}
// // //                                                                 <br />
// // //                                                                 <strong>Priority:</strong> {priorities.find(p => p.value === values.priority)?.label || 'Medium'} ({values.priority})
// // //                                                             </Typography>
// // //                                                         </Alert>
// // //                                                     </Grid>
// // //                                                 </Grid>
// // //                                             </Box>
// // //                                         )}

// // //                                         {/* Navigation Buttons */}
// // //                                         <Box display="flex" justifyContent="space-between" mt={4}>
// // //                                             <Button
// // //                                                 disabled={activeStep === 0 || isLoading}
// // //                                                 onClick={handleBack}
// // //                                                 startIcon={<CancelIcon />}
// // //                                                 variant="outlined"
// // //                                                 type="button"
// // //                                             >
// // //                                                 Back
// // //                                             </Button>
// // //                                             {activeStep < steps.length - 1 ? (
// // //                                                 <Button
// // //                                                     variant="contained"
// // //                                                     onClick={handleNext}
// // //                                                     disabled={isLoading || !isStepValid(values, errors, activeStep)}
// // //                                                     type="button"
// // //                                                 >
// // //                                                     Next Step
// // //                                                 </Button>
// // //                                             ) : (
// // //                                                 <Button
// // //                                                     type="submit"
// // //                                                     variant="contained"
// // //                                                     color="primary"
// // //                                                     disabled={isLoading || !isValid || isSubmitting}
// // //                                                     startIcon={isLoading || isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
// // //                                                 >
// // //                                                     {isLoading || isSubmitting ? 'Saving...' : (isEditMode ? 'Update Rule' : 'Create Rule')}
// // //                                                 </Button>
// // //                                             )}
// // //                                         </Box>
// // //                                     </CardContent>
// // //                                 </Card>
// // //                             </Grid>

// // //                             {/* Right Column - Summary */}
// // //                             <Grid item xs={12} lg={4}>
// // //                                 <Box sx={{ position: 'sticky', top: 24 }}>
// // //                                     <Card sx={{ mb: 2 }}>
// // //                                         <CardHeader title="Rule Summary" />
// // //                                         <CardContent>
// // //                                             <List disablePadding>
// // //                                                 <ListItem sx={{ px: 0 }}>
// // //                                                     <ListItemText primary="Rule Name" secondary={values.ruleName || 'Not set'} />
// // //                                                 </ListItem>
// // //                                                 <Divider sx={{ my: 1 }} />
// // //                                                 <ListItem sx={{ px: 0 }}>
// // //                                                     <ListItemText 
// // //                                                         primary="Type & Category" 
// // //                                                         secondary={
// // //                                                             <Box display="flex" gap={1} sx={{ mt: 0.5 }}>
// // //                                                                 <Chip label={values.ruleType} size="small" variant="outlined" />
// // //                                                                 <Chip 
// // //                                                                     label={values.category} 
// // //                                                                     size="small" 
// // //                                                                     color={categories.find(c => c.value === values.category)?.color || 'default'}
// // //                                                                 />
// // //                                                             </Box>
// // //                                                         } 
// // //                                                     />
// // //                                                 </ListItem>
// // //                                                 <Divider sx={{ my: 1 }} />
// // //                                                 <ListItem sx={{ px: 0 }}>
// // //                                                     <ListItemText 
// // //                                                         primary="Schedule" 
// // //                                                         secondary={
// // //                                                             <Typography variant="body2" sx={{ mt: 0.5 }}>
// // //                                                                 {values.timingType === 'IMMEDIATE' ? 'Immediate' :
// // //                                                                  values.timingType === 'FIXED_TIME' ? `Daily at ${values.fixedTime || '09:00'}` :
// // //                                                                  values.timingType === 'DAYS_OFFSET' ? `Every ${values.daysOffset || 1} days` :
// // //                                                                  values.timingType === 'CRON' ? `Cron: ${values.cronExpression || '0 9 * * *'}` :
// // //                                                                  values.timingType?.charAt(0).toUpperCase() + values.timingType?.slice(1).toLowerCase()}
// // //                                                             </Typography>
// // //                                                         } 
// // //                                                     />
// // //                                                 </ListItem>
// // //                                                 <Divider sx={{ my: 1 }} />
// // //                                                 <ListItem sx={{ px: 0 }}>
// // //                                                     <ListItemText 
// // //                                                         primary="Status" 
// // //                                                         secondary={
// // //                                                             <Box display="flex" alignItems="center" gap={1} sx={{ mt: 0.5 }}>
// // //                                                                 <Chip 
// // //                                                                     label={values.isActive ? 'Active' : 'Inactive'} 
// // //                                                                     size="small" 
// // //                                                                     color={values.isActive ? 'success' : 'error'} 
// // //                                                                 />
// // //                                                                 {values.isBatch && (
// // //                                                                     <Chip label="Batch" size="small" variant="outlined" color="primary" />
// // //                                                                 )}
// // //                                                             </Box>
// // //                                                         } 
// // //                                                     />
// // //                                                 </ListItem>
// // //                                                 <Divider sx={{ my: 1 }} />
// // //                                                 <ListItem sx={{ px: 0 }}>
// // //                                                     <ListItemText 
// // //                                                         primary="Priority" 
// // //                                                         secondary={
// // //                                                             <Chip 
// // //                                                                 label={`${priorities.find(p => p.value === values.priority)?.label || 'Medium'} (${values.priority})`} 
// // //                                                                 size="small" 
// // //                                                                 color={priorities.find(p => p.value === values.priority)?.color}
// // //                                                                 sx={{ mt: 0.5 }}
// // //                                                             />
// // //                                                         } 
// // //                                                     />
// // //                                                 </ListItem>
// // //                                                 <Divider sx={{ my: 1 }} />
// // //                                                 <ListItem sx={{ px: 0 }}>
// // //                                                     <ListItemText 
// // //                                                         primary="Target" 
// // //                                                         secondary={
// // //                                                             <Typography variant="body2" sx={{ mt: 0.5 }}>
// // //                                                                 {targetTypes.find(t => t.value === values.targetType)?.label || 'All Users'}
// // //                                                             </Typography>
// // //                                                         } 
// // //                                                     />
// // //                                                 </ListItem>
// // //                                             </List>

// // //                                             {isEditMode && id && (
// // //                                                 <Box mt={2} display="flex" flexDirection="column" gap={1}>
// // //                                                     <Button
// // //                                                         variant="outlined"
// // //                                                         fullWidth
// // //                                                         size="small"
// // //                                                         onClick={() => handleTestRule(id)}
// // //                                                         disabled={testing || isLoading}
// // //                                                         startIcon={testing ? <CircularProgress size={16} /> : <SendIcon />}
// // //                                                         color="primary"
// // //                                                         type="button"
// // //                                                     >
// // //                                                         {testing ? 'Testing...' : 'Test Rule'}
// // //                                                     </Button>
// // //                                                     <Button
// // //                                                         variant="outlined"
// // //                                                         fullWidth
// // //                                                         size="small"
// // //                                                         onClick={() => handleExecuteRule(id)}
// // //                                                         disabled={executing || isLoading}
// // //                                                         startIcon={executing ? <CircularProgress size={16} /> : <PlayArrowIcon />}
// // //                                                         color="secondary"
// // //                                                         type="button"
// // //                                                     >
// // //                                                         {executing ? 'Executing...' : 'Execute Rule Now'}
// // //                                                     </Button>
// // //                                                     <Alert severity="warning" sx={{ mt: 0.5, py: 0 }}>
// // //                                                         <Typography variant="caption">Executing will run the rule immediately.</Typography>
// // //                                                     </Alert>
// // //                                                 </Box>
// // //                                             )}

// // //                                             <Button
// // //                                                 variant="outlined"
// // //                                                 fullWidth
// // //                                                 size="small"
// // //                                                 onClick={() => navigate('/dashboard/notification-rules')}
// // //                                                 startIcon={<CancelIcon />}
// // //                                                 disabled={isLoading}
// // //                                                 type="button"
// // //                                                 sx={{ mt: 2 }}
// // //                                             >
// // //                                                 Cancel
// // //                                             </Button>
// // //                                         </CardContent>
// // //                                     </Card>

// // //                                     <Card>
// // //                                         <CardHeader title="Quick Start" avatar={<AddIcon color="primary" />} />
// // //                                         <CardContent>
// // //                                             <Button
// // //                                                 variant="contained"
// // //                                                 fullWidth
// // //                                                 size="small"
// // //                                                 startIcon={<AddIcon />}
// // //                                                 onClick={() => setShowTemplateDialog(true)}
// // //                                                 type="button"
// // //                                             >
// // //                                                 Use Template
// // //                                             </Button>
// // //                                             <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
// // //                                                 Start quickly with pre-configured templates.
// // //                                             </Typography>
// // //                                         </CardContent>
// // //                                     </Card>

// // //                                     <Card sx={{ mt: 2 }}>
// // //                                         <CardHeader title="Setup Progress" />
// // //                                         <CardContent>
// // //                                             <LinearProgress
// // //                                                 variant="determinate"
// // //                                                 value={(activeStep + 1) / steps.length * 100}
// // //                                                 sx={{ height: 6, borderRadius: 3, mb: 1 }}
// // //                                             />
// // //                                             <Typography variant="caption" color="text.secondary">
// // //                                                 Step {activeStep + 1} of {steps.length}
// // //                                             </Typography>
// // //                                         </CardContent>
// // //                                     </Card>
// // //                                 </Box>
// // //                             </Grid>
// // //                         </Grid>
// // //                     </Form>
// // //                 )}
// // //             </Formik>

// // //             {/* Template Dialog */}
// // //             <Dialog open={showTemplateDialog} onClose={() => setShowTemplateDialog(false)} maxWidth="md" fullWidth>
// // //                 <DialogTitle>Select Rule Template</DialogTitle>
// // //                 <DialogContent>
// // //                     <Grid container spacing={2} sx={{ mt: 1 }}>
// // //                         {ruleTemplates.map((template) => (
// // //                             <Grid item xs={12} key={template.id}>
// // //                                 <Card 
// // //                                     variant="outlined" 
// // //                                     sx={{ 
// // //                                         cursor: 'pointer', 
// // //                                         '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.50' } 
// // //                                     }}
// // //                                     onClick={() => {
// // //                                         if (setValues) handleTemplateSelect(template, setValues);
// // //                                     }}
// // //                                 >
// // //                                     <CardContent>
// // //                                         <Box display="flex" justifyContent="space-between" alignItems="flex-start">
// // //                                             <Box>
// // //                                                 <Typography variant="h6">{template.name}</Typography>
// // //                                                 <Typography variant="body2" color="text.secondary">{template.description}</Typography>
// // //                                                 <Box display="flex" gap={1} mt={1}>
// // //                                                     <Chip label={template.category} size="small" variant="outlined" />
// // //                                                     <Chip label={`Priority ${template.priority}`} size="small" variant="outlined" />
// // //                                                 </Box>
// // //                                             </Box>
// // //                                             <Button variant="contained" size="small">
// // //                                                 Use Template
// // //                                             </Button>
// // //                                         </Box>
// // //                                         <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
// // //                                             Schedule: {template.timingType === 'FIXED_TIME' ? `Daily at ${template.fixedTime}` :
// // //                                                        template.timingType === 'DAYS_OFFSET' ? `Every ${template.daysOffset} days` :
// // //                                                        template.timingType}
// // //                                         </Typography>
// // //                                     </CardContent>
// // //                                 </Card>
// // //                             </Grid>
// // //                         ))}
// // //                     </Grid>
// // //                 </DialogContent>
// // //                 <DialogActions>
// // //                     <Button onClick={() => setShowTemplateDialog(false)}>Cancel</Button>
// // //                 </DialogActions>
// // //             </Dialog>

// // //             {/* Snackbar for notifications */}
// // //             <Snackbar 
// // //                 open={snackbar.open} 
// // //                 autoHideDuration={6000} 
// // //                 onClose={handleCloseSnackbar} 
// // //                 anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
// // //             >
// // //                 <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
// // //                     {snackbar.message}
// // //                 </Alert>
// // //             </Snackbar>
// // //         </Box>
// // //     );
// // // };

// // // export default NotificationRuleForm;
// // import React, { useState, useEffect, useRef } from 'react';
// // import {
// //     Box,
// //     Button,
// //     Card,
// //     CardContent,
// //     CardHeader,
// //     FormControl,
// //     FormControlLabel,
// //     Grid,
// //     MenuItem,
// //     Switch,
// //     TextField,
// //     Typography,
// //     Chip,
// //     IconButton,
// //     Divider,
// //     Alert,
// //     Stepper,
// //     Step,
// //     StepLabel,
// //     Paper,
// //     InputAdornment,
// //     Tooltip,
// //     CircularProgress,
// //     Select,
// //     InputLabel,
// //     FormHelperText,
// //     Snackbar,
// //     LinearProgress,
// //     List,
// //     ListItem,
// //     ListItemText,
// //     Tabs,
// //     Tab,
// //     Dialog,
// //     DialogTitle,
// //     DialogContent,
// //     DialogActions,
// //     Radio,
// //     RadioGroup,
// // } from '@mui/material';
// // import {
// //     Add as AddIcon,
// //     Info as InfoIcon,
// //     CheckCircle as CheckCircleIcon,
// //     Error as ErrorIcon,
// //     Send as SendIcon,
// //     Save as SaveIcon,
// //     Cancel as CancelIcon,
// //     Refresh as RefreshIcon,
// //     PlayArrow as PlayArrowIcon,
// //     Schedule as ScheduleIcon,
// //     Payment as PaymentIcon,
// //     AccountBalance as AccountBalanceIcon,
// //     School as SchoolIcon,
// //     Assignment as AssignmentIcon,
// //     Announcement as AnnouncementIcon,
// //     Warning as WarningIcon,
// //     Event as EventIcon,
// //     Person as PersonIcon,
// //     AccessTime as AccessTimeIcon,
// //     Timer as TimerIcon,
// //     Today as TodayIcon,
// //     CalendarToday as CalendarTodayIcon,
// //     ViewWeek as ViewWeekIcon,
// //     EventNote as EventNoteIcon,
// //     FilterList as FilterListIcon,
// //     Settings as SettingsIcon,
// //     Message as MessageIcon,
// //     DataUsage as DataIcon,
// //     Close as CloseIcon,
// //     ChildCare as ChildIcon,
// // } from '@mui/icons-material';
// // import { useNavigate, useParams } from 'react-router-dom';
// // import { Formik, Form } from 'formik';
// // import * as Yup from 'yup';
// // import { usePermissions } from '../../../customHook/usePermissions';
// // import {
// //     useGetNotificationRuleByIdQuery,
// //     useCreateNotificationRuleMutation,
// //     useUpdateNotificationRuleMutation,
// //     useTestNotificationRuleMutation,
// //     useExecuteNotificationRuleMutation,
// // } from '../../../store/api/notificationApi';
// // import { useSelector } from 'react-redux';
// // import TargetFilterBuilder from '../../../component/TargetFilterBuilder';
// // import ReactQuill from 'react-quill';
// // import 'react-quill/dist/quill.snow.css';

// // // Validation Schema
// // const validationSchema = Yup.object({
// //     ruleName: Yup.string()
// //         .required('Rule name is required')
// //         .max(100, 'Rule name must be less than 100 characters'),
// //     ruleType: Yup.string().required('Rule type is required'),
// //     category: Yup.string().required('Category is required'),
// //     titleTemplate: Yup.string()
// //         .required('Title template is required')
// //         .max(200, 'Title must be less than 200 characters'),
// //     messageTemplate: Yup.string()
// //         .required('Message template is required')
// //         .max(1000, 'Message must be less than 1000 characters'),
// //     targetType: Yup.string().required('Target type is required'),
// //     isActive: Yup.boolean(),
// //     priority: Yup.number()
// //         .min(1, 'Priority must be between 1-3')
// //         .max(3, 'Priority must be between 1-3')
// //         .required('Priority is required'),
// //     isBatch: Yup.boolean(),
// //     timingType: Yup.string().required('Timing type is required'),
// //     cronExpression: Yup.string().nullable(),
// //     daysOffset: Yup.number().min(0, 'Days offset must be positive').nullable(),
// //     fixedTime: Yup.string().nullable(),
// //     targetFilter: Yup.string().test(
// //         'json',
// //         'Must be valid JSON',
// //         (value) => {
// //             if (!value) return true;
// //             try {
// //                 JSON.parse(value);
// //                 return true;
// //             } catch {
// //                 return false;
// //             }
// //         }
// //     )
// // });

// // // Initial values
// // const getInitialValues = (userData = null) => ({
// //     ruleName: '',
// //     ruleType: 'CRON',
// //     category: 'FEE',
// //     sourceTable: '',
// //     triggerField: '',
// //     triggerValue: '',
// //     timingType: 'DAILY',
// //     fixedTime: '09:00',
// //     daysOffset: 1,
// //     cronExpression: '0 9 * * *',
// //     titleTemplate: '',
// //     messageTemplate: '',
// //     dataTemplate: '',
// //     targetType: 'PARENTS',
// //     targetFilter: '{}',
// //     isActive: true,
// //     isBatch: true,
// //     priority: 2,
// //     createdBy: userData?.id || 1,
// // });

// // const steps = [
// //     { label: 'Basic Info', icon: <InfoIcon /> },
// //     { label: 'Schedule & Timing', icon: <ScheduleIcon /> },
// //     { label: 'Target & Filters', icon: <FilterListIcon /> },
// //     { label: 'Content', icon: <AssignmentIcon /> },
// //     { label: 'Advanced', icon: <SettingsIcon /> },
// // ];

// // // Categories with icons
// // const categories = [
// //     { value: 'FEE', label: 'Fee', color: 'warning', icon: <PaymentIcon />, description: 'Fee-related notifications' },
// //     { value: 'ATTENDANCE', label: 'Attendance', color: 'error', icon: <AccountBalanceIcon />, description: 'Attendance notifications' },
// //     { value: 'EXAM', label: 'Exam', color: 'info', icon: <SchoolIcon />, description: 'Exam notifications' },
// //     { value: 'HOMEWORK', label: 'Homework', color: 'success', icon: <AssignmentIcon />, description: 'Homework assignments' },
// //     { value: 'ANNOUNCEMENT', label: 'Announcement', color: 'primary', icon: <AnnouncementIcon />, description: 'School announcements' },
// //     { value: 'GENERAL', label: 'General', color: 'default', icon: <InfoIcon />, description: 'General notifications' },
// //     { value: 'ALERT', label: 'Alert', color: 'error', icon: <WarningIcon />, description: 'Important alerts' },
// //     { value: 'EVENT', label: 'Event', color: 'info', icon: <EventIcon />, description: 'School events' },
// // ];

// // const ruleTypes = [
// //     { value: 'EVENT', label: 'Event Trigger', description: 'Triggered by database events', icon: <EventIcon /> },
// //     { value: 'CRON', label: 'Scheduled (Cron)', description: 'Runs on a schedule', icon: <ScheduleIcon /> },
// //     { value: 'MANUAL', label: 'Manual', description: 'Manual trigger only', icon: <PlayArrowIcon /> },
// // ];

// // const timingTypes = [
// //     { value: 'IMMEDIATE', label: 'Immediate', icon: <AccessTimeIcon />, description: 'Run immediately when triggered' },
// //     { value: 'FIXED_TIME', label: 'Fixed Time', icon: <TimerIcon />, description: 'Run at specific time each day' },
// //     { value: 'DAYS_OFFSET', label: 'Days Offset', icon: <TodayIcon />, description: 'Run every X days' },
// //     { value: 'CRON', label: 'Cron Expression', icon: <CalendarTodayIcon />, description: 'Advanced scheduling' },
// //     { value: 'DAILY', label: 'Daily', icon: <TodayIcon />, description: 'Run once per day' },
// //     { value: 'WEEKLY', label: 'Weekly', icon: <ViewWeekIcon />, description: 'Run once per week' },
// //     { value: 'MONTHLY', label: 'Monthly', icon: <CalendarTodayIcon />, description: 'Run once per month' },
// // ];

// // const targetTypes = [
// //     { value: 'ALL', label: 'All Users', icon: <PersonIcon /> },
// //     { value: 'PARENTS', label: 'Parents Only', icon: <PersonIcon /> },
// //     { value: 'TEACHERS', label: 'Teachers Only', icon: <PersonIcon /> },
// //     { value: 'STUDENTS', label: 'Students Only', icon: <PersonIcon /> },
// //     { value: 'CLASS', label: 'Class Specific', icon: <SchoolIcon /> },
// //     { value: 'SECTION', label: 'Section Specific', icon: <SchoolIcon /> },
// //     { value: 'SPECIFIC_USERS', label: 'Specific Users', icon: <PersonIcon /> },
// //     { value: 'SPECIFIC_STUDENTS_DIRECT', label: 'Specific Students (Direct)', icon: <ChildIcon /> },
// // ];

// // const priorities = [
// //     { value: 1, label: 'High', color: 'error', description: 'Urgent notifications' },
// //     { value: 2, label: 'Medium', color: 'warning', description: 'Regular reminders' },
// //     { value: 3, label: 'Low', color: 'info', description: 'Informational updates' },
// // ];

// // // Sample variables for different categories
// // const sampleVariables = {
// //     COMMON: [
// //         { name: 'CurrentDate', description: 'Current date', sample: '25/01/2024' },
// //         { name: 'CurrentTime', description: 'Current time', sample: '14:30' },
// //         { name: 'RuleName', description: 'Rule name', sample: 'Fee Reminder' },
// //         { name: 'Category', description: 'Notification category', sample: 'FEE' },
// //     ],
// //     FEE: [
// //         { name: 'StudentName', description: 'Student name', sample: 'John Doe' },
// //         { name: 'ParentName', description: 'Parent name', sample: 'Mr. Smith' },
// //         { name: 'DueAmount', description: 'Due amount', sample: '5000' },
// //         { name: 'DueDate', description: 'Due date', sample: '31/01/2024' },
// //         { name: 'StatusText', description: 'Status description', sample: 'Due in 3 days' },
// //     ],
// //     ATTENDANCE: [
// //         { name: 'StudentName', description: 'Student name', sample: 'John Doe' },
// //         { name: 'Status', description: 'Attendance status', sample: 'Absent' },
// //         { name: 'AttendanceDate', description: 'Attendance date', sample: '25/01/2024' },
// //         { name: 'Remarks', description: 'Remarks', sample: 'Medical Leave' },
// //     ],
// //     EXAM: [
// //         { name: 'StudentName', description: 'Student name', sample: 'John Doe' },
// //         { name: 'ExamTitle', description: 'Exam title', sample: 'Mid Term Examination' },
// //         { name: 'ExamDate', description: 'Exam date', sample: '30/01/2024' },
// //         { name: 'Subject', description: 'Subject', sample: 'Mathematics' },
// //     ],
// //     HOMEWORK: [
// //         { name: 'StudentName', description: 'Student name', sample: 'John Doe' },
// //         { name: 'HomeworkTitle', description: 'Homework title', sample: 'Math Assignment' },
// //         { name: 'Subject', description: 'Subject', sample: 'Mathematics' },
// //         { name: 'DueDate', description: 'Due date', sample: '30/01/2024' },
// //     ],
// // };

// // // Rule templates
// // const ruleTemplates = [
// //     {
// //         id: 1,
// //         name: "Daily Fee Reminder",
// //         category: "FEE",
// //         description: "Send daily reminders for overdue fees",
// //         timingType: "DAILY",
// //         fixedTime: "09:00",
// //         titleTemplate: "Fee Payment Due: {StudentName}",
// //         messageTemplate: "Dear {ParentName},\nFee of Rs.{DueAmount} for {StudentName} is {StatusText}.\nDue date: {DueDate}",
// //         priority: 2
// //     },
// //     {
// //         id: 2,
// //         name: "Weekly Attendance Summary",
// //         category: "ATTENDANCE",
// //         description: "Weekly summary of student attendance",
// //         timingType: "WEEKLY",
// //         fixedTime: "17:00",
// //         titleTemplate: "Weekly Attendance Summary",
// //         messageTemplate: "Attendance Summary for {StudentName}\nStatus: {Status}\nDate: {AttendanceDate}",
// //         priority: 3
// //     },
// //     {
// //         id: 3,
// //         name: "Exam Reminder",
// //         category: "EXAM",
// //         description: "Remind students about exams",
// //         timingType: "DAYS_OFFSET",
// //         daysOffset: 3,
// //         titleTemplate: "Exam Reminder: {ExamTitle}",
// //         messageTemplate: "Dear Student,\n{ExamTitle} is scheduled on {ExamDate}.\nSubject: {Subject}",
// //         priority: 2
// //     },
// // ];

// // // React-Quill toolbar configuration for message template (FULL toolbar always visible)
// // const messageToolbarOptions = [
// //     [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
// //     [{ 'font': [] }],
// //     [{ 'size': ['small', false, 'large', 'huge'] }],
// //     ['bold', 'italic', 'underline', 'strike'],
// //     [{ 'color': [] }, { 'background': [] }],
// //     [{ 'script': 'sub' }, { 'script': 'super' }],
// //     [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
// //     [{ 'align': [] }],
// //     ['blockquote', 'code-block'],
// //     ['link', 'image', 'video'],
// //     ['clean'],
// //     [{ 'direction': 'rtl' }],
// // ];

// // // React-Quill formats
// // const messageFormats = [
// //     'header', 'font', 'size',
// //     'bold', 'italic', 'underline', 'strike',
// //     'color', 'background',
// //     'script',
// //     'list', 'bullet', 'indent',
// //     'align',
// //     'blockquote', 'code-block',
// //     'link', 'image', 'video',
// //     'clean',
// //     'direction'
// // ];

// // // Helper function to strip HTML tags for character count
// // const stripHtmlTags = (html) => {
// //     if (!html) return '';
// //     const temp = document.createElement('div');
// //     temp.innerHTML = html;
// //     return temp.textContent || temp.innerText || '';
// // };

// // // Get plain text length from HTML content
// // const getPlainTextLength = (html) => {
// //     return stripHtmlTags(html).length;
// // };

// // const NotificationRuleForm = () => {
// //     const navigate = useNavigate();
// //     const { id } = useParams();
// //     const { isAdmin, isManager, isTeacher } = usePermissions();
// //     const isEditMode = !!id;

// //     const [activeStep, setActiveStep] = useState(0);
// //     const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
// //     const [showTemplateDialog, setShowTemplateDialog] = useState(false);
// //     const [activeTab, setActiveTab] = useState(0);
// //     const [selectedInsertField, setSelectedInsertField] = useState('titleTemplate');
// //     const [isSubmitting, setIsSubmitting] = useState(false);
// //     const [uploadingImage, setUploadingImage] = useState(false);

// //     const titleQuillRef = useRef(null);
// //     const messageQuillRef = useRef(null);
// //     const dataRef = useRef();

// //     const authUser = useSelector((state) => state.auth.user);

// //     const { data: ruleData, isLoading: loadingRule, refetch } =
// //         useGetNotificationRuleByIdQuery(id, { skip: !isEditMode });

// //     const [createRule, { isLoading: creating }] = useCreateNotificationRuleMutation();
// //     const [updateRule, { isLoading: updating }] = useUpdateNotificationRuleMutation();
// //     const [testRule, { isLoading: testing }] = useTestNotificationRuleMutation();
// //     const [executeRule, { isLoading: executing }] = useExecuteNotificationRuleMutation();

// //     const getCurrentUserId = () => {
// //         if (authUser?.id) return authUser.id;
// //         try {
// //             const storedUser = localStorage.getItem('user');
// //             if (storedUser) {
// //                 const user = JSON.parse(storedUser);
// //                 return user.id || user.userId || 1;
// //             }
// //         } catch (error) {
// //             return 1;
// //         }
// //         return 1;
// //     };

// //     const formatTimeForInput = (timeSpan) => {
// //         if (!timeSpan) return '09:00';
// //         try {
// //             const timeStr = typeof timeSpan === 'string' ? timeSpan : timeSpan.toString();
// //             const parts = timeStr.split(':');
// //             if (parts.length >= 2) {
// //                 return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
// //             }
// //             return '09:00';
// //         } catch (error) {
// //             return '09:00';
// //         }
// //     };

// //     const showSnackbar = (message, severity = 'success') => {
// //         setSnackbar({ open: true, message, severity });
// //     };

// //     const handleCloseSnackbar = () => {
// //         setSnackbar({ ...snackbar, open: false });
// //     };

// //     const handleNext = (e) => {
// //         if (e) {
// //             e.preventDefault();
// //             e.stopPropagation();
// //         }
// //         if (activeStep < steps.length - 1) {
// //             setActiveStep(prev => prev + 1);
// //         }
// //     };

// //     const handleBack = (e) => {
// //         if (e) {
// //             e.preventDefault();
// //             e.stopPropagation();
// //         }
// //         if (activeStep > 0) {
// //             setActiveStep(prev => prev - 1);
// //         }
// //     };

// //     const handleTemplateSelect = (template, setValues) => {
// //         if (setValues) {
// //             setValues({
// //                 ...getInitialValues({ id: getCurrentUserId() }),
// //                 ruleName: template.name,
// //                 category: template.category,
// //                 timingType: template.timingType,
// //                 fixedTime: template.fixedTime || '09:00',
// //                 daysOffset: template.daysOffset || 1,
// //                 titleTemplate: template.titleTemplate || '',
// //                 messageTemplate: template.messageTemplate || '',
// //                 priority: template.priority || 2,
// //                 isBatch: true,
// //             });
// //         }
// //         setShowTemplateDialog(false);
// //         showSnackbar(`Template "${template.name}" applied successfully`, 'success');
// //     };

// //     const handleSubmit = async (values, { setSubmitting: formikSetSubmitting }) => {
// //         if (isSubmitting) return;
// //         if (activeStep !== steps.length - 1) {
// //             showSnackbar('Please complete all steps before submitting', 'warning');
// //             formikSetSubmitting(false);
// //             return;
// //         }

// //         setIsSubmitting(true);

// //         try {
// //             const currentUserId = getCurrentUserId();
            
// //             const isManualTrigger = values.ruleType === 'MANUAL' || 
// //                                    (values.ruleType === 'EVENT' && values.timingType === 'IMMEDIATE');

// //             let targetFilterString = '{}';
// //             if (values.targetFilter && values.targetFilter.trim() !== '' && values.targetFilter !== '{}') {
// //                 try {
// //                     const parsed = JSON.parse(values.targetFilter);
// //                     targetFilterString = JSON.stringify(parsed);
// //                 } catch (error) {
// //                     targetFilterString = '{}';
// //                 }
// //             }

// //             // Format fixedTime correctly (HH:mm:ss)
// //             let formattedFixedTime = null;
// //             if (values.timingType === 'FIXED_TIME' || values.timingType === 'DAILY') {
// //                 if (values.fixedTime) {
// //                     const timeParts = values.fixedTime.split(':');
// //                     if (timeParts.length === 2) {
// //                         formattedFixedTime = `${timeParts[0].padStart(2, '0')}:${timeParts[1].padStart(2, '0')}:00`;
// //                     } else {
// //                         formattedFixedTime = '09:00:00';
// //                     }
// //                 }
// //             }

// //             // Format cron expression (ensure 5 parts)
// //             let formattedCronExpression = null;
// //             if (values.timingType === 'CRON' && values.cronExpression) {
// //                 const cronParts = values.cronExpression.trim().split(/\s+/);
// //                 if (cronParts.length === 6) {
// //                     formattedCronExpression = cronParts.slice(1).join(' ');
// //                 } else if (cronParts.length === 5) {
// //                     formattedCronExpression = values.cronExpression.trim();
// //                 } else {
// //                     formattedCronExpression = '0 9 * * *';
// //                 }
// //             }

// //             const ruleDataToSend = {
// //                 ruleName: values.ruleName?.trim() || '',
// //                 ruleType: values.ruleType || 'EVENT',
// //                 category: values.category || 'GENERAL',
// //                 isManualTrigger: isManualTrigger,
// //                 sourceTable: values.ruleType === 'EVENT' ? (values.sourceTable?.trim() || null) : null,
// //                 triggerField: values.ruleType === 'EVENT' ? (values.triggerField?.trim() || null) : null,
// //                 triggerValue: values.ruleType === 'EVENT' ? (values.triggerValue?.trim() || null) : null,
// //                 timingType: values.timingType || 'IMMEDIATE',
// //                 daysOffset: values.timingType === 'DAYS_OFFSET' ? (values.daysOffset || 1) : null,
// //                 fixedTime: formattedFixedTime,
// //                 cronExpression: formattedCronExpression,
// //                 titleTemplate: values.titleTemplate?.trim() || '',
// //                 messageTemplate: values.messageTemplate?.trim() || '',
// //                 dataTemplate: values.dataTemplate?.trim() || null,
// //                 targetType: values.targetType || 'ALL',
// //                 targetFilter: targetFilterString,
// //                 isBatch: values.isBatch ?? true,
// //                 priority: parseInt(values.priority) || 2,
// //                 isActive: values.isActive ?? true,
// //                 createdBy: currentUserId
// //             };

// //             if (isEditMode) {
// //                 await updateRule({ id, ...ruleDataToSend }).unwrap();
// //                 showSnackbar('Rule updated successfully!', 'success');
// //                 refetch();
// //             } else {
// //                 await createRule(ruleDataToSend).unwrap();
// //                 showSnackbar('Rule created successfully!', 'success');
// //             }

// //             setTimeout(() => {
// //                 navigate('/dashboard/notification-rules');
// //             }, 1500);

// //         } catch (error) {
// //             let errorMessage = 'Failed to save rule. Please check your inputs.';
            
// //             if (error.data?.errors) {
// //                 const validationErrors = [];
// //                 Object.keys(error.data.errors).forEach(key => {
// //                     if (Array.isArray(error.data.errors[key])) {
// //                         validationErrors.push(...error.data.errors[key]);
// //                     }
// //                 });
// //                 errorMessage = validationErrors.join(', ');
// //             } else if (error.data?.message) {
// //                 errorMessage = error.data.message;
// //             } else if (error.status === 400) {
// //                 errorMessage = 'Bad request. Please check fixedTime format (HH:mm:ss) and other fields.';
// //             }
            
// //             showSnackbar(errorMessage, 'error');
// //         } finally {
// //             setIsSubmitting(false);
// //             formikSetSubmitting(false);
// //         }
// //     };

// //     const handleTestRule = async (ruleId) => {
// //         if (!ruleId) {
// //             showSnackbar('Please save the rule first before testing.', 'warning');
// //             return;
// //         }

// //         try {
// //             const testUserId = getCurrentUserId();
// //             await testRule({ id: ruleId, testData: { testUserID: testUserId } }).unwrap();
// //             showSnackbar('Rule test executed successfully!', 'success');
// //         } catch (error) {
// //             showSnackbar(error.data?.message || 'Test failed.', 'error');
// //         }
// //     };

// //     const handleExecuteRule = async (ruleId) => {
// //         if (!ruleId) {
// //             showSnackbar('Please save the rule first before executing.', 'warning');
// //             return;
// //         }

// //         try {
// //             await executeRule(ruleId).unwrap();
// //             showSnackbar('Rule executed successfully!', 'success');
// //         } catch (error) {
// //             showSnackbar(error.data?.message || 'Execution failed.', 'error');
// //         }
// //     };

// //     // Insert variable at cursor position in Quill editor
// //     const insertVariableAtCursor = (variable, setFieldValue, values, fieldName, quillRef) => {
// //         const variableText = `{${variable}}`;
        
// //         if (quillRef && quillRef.current) {
// //             const quill = quillRef.current.getEditor();
// //             const range = quill.getSelection();
            
// //             if (range) {
// //                 quill.insertText(range.index, variableText);
// //                 quill.setSelection(range.index + variableText.length, 0);
// //                 const newContent = quill.root.innerHTML;
// //                 setFieldValue(fieldName, newContent);
// //             } else {
// //                 const currentContent = values[fieldName] || '';
// //                 const newContent = currentContent + variableText;
// //                 setFieldValue(fieldName, newContent);
// //                 if (quill) {
// //                     quill.root.innerHTML = newContent;
// //                 }
// //             }
// //         } else {
// //             // Fallback for dataTemplate (not using Quill)
// //             const currentValue = values[fieldName] || '';
// //             setFieldValue(fieldName, currentValue + variableText);
// //         }
        
// //         showSnackbar(`Added {${variable}} to ${fieldName === 'titleTemplate' ? 'Title' : fieldName === 'messageTemplate' ? 'Message' : 'Data'}`, 'info');
// //     };

// //     const isStepValid = (values, errors, step) => {
// //         switch (step) {
// //             case 0:
// //                 return values.ruleName && values.ruleType && values.category;
// //             case 1:
// //                 if (!values.timingType) return false;
// //                 if (values.timingType === 'FIXED_TIME' && !values.fixedTime) return false;
// //                 if (values.timingType === 'DAYS_OFFSET' && (!values.daysOffset || values.daysOffset < 1)) return false;
// //                 if (values.timingType === 'CRON' && !values.cronExpression) return false;
// //                 return true;
// //             case 2:
// //                 return values.targetType;
// //             case 3:
// //                 return values.titleTemplate && values.messageTemplate;
// //             case 4:
// //                 return values.priority;
// //             default:
// //                 return true;
// //         }
// //     };

// //     const renderTimingConfiguration = (values, handleChange, setFieldValue) => {
// //         const timingType = values.timingType || 'IMMEDIATE';

// //         return (
// //             <Box sx={{ mt: 2 }}>
// //                 <Box sx={{ mb: 3 }}>
// //                     <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mb: 1 }}>
// //                         Select Timing Type
// //                     </Typography>
// //                     <FormControl fullWidth>
// //                         <InputLabel>Timing Type *</InputLabel>
// //                         <Select
// //                             name="timingType"
// //                             value={values.timingType}
// //                             onChange={handleChange}
// //                             label="Timing Type *"
// //                             disabled={isLoading}
// //                         >
// //                             {timingTypes.map((type) => (
// //                                 <MenuItem key={type.value} value={type.value}>
// //                                     <Box display="flex" alignItems="center" gap={1}>
// //                                         {type.icon}
// //                                         <Box>
// //                                             <Typography>{type.label}</Typography>
// //                                             <Typography variant="caption" color="text.secondary">
// //                                                 {type.description}
// //                                             </Typography>
// //                                         </Box>
// //                                     </Box>
// //                                 </MenuItem>
// //                             ))}
// //                         </Select>
// //                     </FormControl>
// //                 </Box>

// //                 {timingType === 'FIXED_TIME' && (
// //                     <Box sx={{ mb: 3 }}>
// //                         <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mb: 1 }}>
// //                             <TimerIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: '1rem' }} />
// //                             Fixed Time
// //                         </Typography>
// //                         <TextField
// //                             fullWidth
// //                             name="fixedTime"
// //                             label="Select Time"
// //                             type="time"
// //                             value={values.fixedTime || '09:00'}
// //                             onChange={handleChange}
// //                             InputLabelProps={{ shrink: true }}
// //                             helperText="Choose the time when notifications will be sent daily"
// //                         />
// //                     </Box>
// //                 )}

// //                 {timingType === 'DAYS_OFFSET' && (
// //                     <Box sx={{ mb: 3 }}>
// //                         <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mb: 1 }}>
// //                             <TodayIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: '1rem' }} />
// //                             Days Offset
// //                         </Typography>
// //                         <TextField
// //                             fullWidth
// //                             name="daysOffset"
// //                             label="Number of Days"
// //                             type="number"
// //                             value={values.daysOffset || 1}
// //                             onChange={handleChange}
// //                             InputProps={{
// //                                 endAdornment: <InputAdornment position="end">days</InputAdornment>,
// //                                 inputProps: { min: 1 }
// //                             }}
// //                             helperText="How many days between each notification"
// //                         />
// //                     </Box>
// //                 )}

// //                 {timingType === 'CRON' && (
// //                     <Box sx={{ mb: 3 }}>
// //                         <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mb: 1 }}>
// //                             <ScheduleIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: '1rem' }} />
// //                             Cron Expression
// //                         </Typography>
// //                         <TextField
// //                             fullWidth
// //                             name="cronExpression"
// //                             label="Cron Expression"
// //                             value={values.cronExpression || '0 9 * * *'}
// //                             onChange={handleChange}
// //                             helperText="Format: minute hour day month day-of-week (e.g., 0 9 * * * for daily at 9 AM)"
// //                             placeholder="0 9 * * *"
// //                         />
// //                         <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
// //                             Examples: "0 9 * * *" = Daily at 9 AM, "0 9 */3 * *" = Every 3 days at 9 AM
// //                         </Typography>
// //                     </Box>
// //                 )}

// //                 {(timingType === 'DAILY' || timingType === 'WEEKLY' || timingType === 'MONTHLY') && (
// //                     <Box sx={{ mb: 3 }}>
// //                         <Alert severity="info" icon={<InfoIcon />}>
// //                             <Typography variant="body2">
// //                                 This rule will run {timingType.toLowerCase()} at the scheduled time.
// //                             </Typography>
// //                         </Alert>
// //                     </Box>
// //                 )}

// //                 {timingType === 'IMMEDIATE' && (
// //                     <Box sx={{ mb: 3 }}>
// //                         <Alert severity="info" icon={<AccessTimeIcon />}>
// //                             <Typography variant="body2">
// //                                 Notifications will be sent immediately when the rule is triggered.
// //                             </Typography>
// //                         </Alert>
// //                     </Box>
// //                 )}
// //             </Box>
// //         );
// //     };

// //     // Prepare initial values with proper targetFilter parsing
// //     const prepareInitialValues = () => {
// //         if (isEditMode && ruleData?.data) {
// //             const rule = ruleData.data;
// //             let targetFilterValue = '{}';
            
// //             if (rule.targetFilter) {
// //                 if (typeof rule.targetFilter === 'string') {
// //                     try {
// //                         const parsed = JSON.parse(rule.targetFilter);
// //                         targetFilterValue = JSON.stringify(parsed, null, 2);
// //                     } catch {
// //                         targetFilterValue = rule.targetFilter;
// //                     }
// //                 } else if (typeof rule.targetFilter === 'object') {
// //                     targetFilterValue = JSON.stringify(rule.targetFilter, null, 2);
// //                 }
// //             }
            
// //             return {
// //                 ruleName: rule.ruleName || '',
// //                 ruleType: rule.ruleType || 'CRON',
// //                 category: rule.category || 'FEE',
// //                 sourceTable: rule.sourceTable || '',
// //                 triggerField: rule.triggerField || '',
// //                 triggerValue: rule.triggerValue || '',
// //                 timingType: rule.timingType || 'DAILY',
// //                 fixedTime: rule.fixedTime ? formatTimeForInput(rule.fixedTime) : '09:00',
// //                 daysOffset: rule.daysOffset || 1,
// //                 cronExpression: rule.cronExpression || '0 9 * * *',
// //                 titleTemplate: rule.titleTemplate || '',
// //                 messageTemplate: rule.messageTemplate || '',
// //                 dataTemplate: rule.dataTemplate || '',
// //                 targetType: rule.targetType || 'PARENTS',
// //                 targetFilter: targetFilterValue,
// //                 isActive: rule.isActive ?? true,
// //                 isBatch: rule.isBatch ?? true,
// //                 priority: rule.priority || 2,
// //                 createdBy: rule.createdBy || getCurrentUserId(),
// //             };
// //         }
// //         return getInitialValues({ id: getCurrentUserId() });
// //     };

// //     const isLoading = loadingRule || creating || updating || isSubmitting || uploadingImage;

// //     if (!isAdmin() && !isManager() && !isTeacher()) {
// //         return (
// //             <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
// //                 <Alert severity="error">Access Denied - Notification rule management is only available to authorized users.</Alert>
// //             </Box>
// //         );
// //     }

// //     if (loadingRule && isEditMode) {
// //         return (
// //             <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
// //                 <CircularProgress size={60} />
// //                 <Typography sx={{ mt: 3 }}>Loading rule...</Typography>
// //             </Box>
// //         );
// //     }

// //     return (
// //         <Box sx={{ maxWidth: 1400, margin: '0 auto', p: { xs: 2, md: 3 } }}>
// //             <Box sx={{ mb: 4 }}>
// //                 <Typography variant="h4" gutterBottom>
// //                     {isEditMode ? 'Edit Notification Rule' : 'Create Notification Rule'}
// //                 </Typography>
// //                 <Typography variant="body1" color="text.secondary">
// //                     {isEditMode ? 'Modify your notification rule settings' : 'Define a new notification rule with complete flexibility'}
// //                 </Typography>
// //             </Box>

// //             <Paper sx={{ p: 3, mb: 4 }}>
// //                 <Stepper activeStep={activeStep} alternativeLabel>
// //                     {steps.map((step, index) => (
// //                         <Step key={step.label}>
// //                             <StepLabel StepIconComponent={() => step.icon}>
// //                                 {step.label}
// //                             </StepLabel>
// //                         </Step>
// //                     ))}
// //                 </Stepper>
// //             </Paper>

// //             <Formik
// //                 initialValues={prepareInitialValues()}
// //                 validationSchema={validationSchema}
// //                 onSubmit={handleSubmit}
// //                 enableReinitialize={true}
// //                 validateOnMount={true}
// //                 validateOnChange={true}
// //                 validateOnBlur={true}
// //             >
// //                 {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isValid, setValues }) => (
// //                     <Form>
// //                         <Grid container spacing={3}>
// //                             <Grid item xs={12} lg={8}>
// //                                 <Card>
// //                                     <CardContent>
// //                                         {/* Step 0: Basic Info */}
// //                                         {activeStep === 0 && (
// //                                             <Box>
// //                                                 <Typography variant="h6" gutterBottom>
// //                                                     <InfoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
// //                                                     Basic Information
// //                                                 </Typography>
// //                                                 <Grid container spacing={3}>
// //                                                     <Grid item xs={12}>
// //                                                         <TextField
// //                                                             fullWidth
// //                                                             name="ruleName"
// //                                                             label="Rule Name *"
// //                                                             value={values.ruleName}
// //                                                             onChange={handleChange}
// //                                                             onBlur={handleBlur}
// //                                                             error={touched.ruleName && Boolean(errors.ruleName)}
// //                                                             helperText={touched.ruleName && errors.ruleName || "Enter a descriptive name for this rule"}
// //                                                             placeholder="e.g., Daily Fee Reminder"
// //                                                             disabled={isLoading}
// //                                                         />
// //                                                     </Grid>
// //                                                     <Grid item xs={12} md={6}>
// //                                                         <FormControl fullWidth error={touched.ruleType && Boolean(errors.ruleType)}>
// //                                                             <InputLabel>Rule Type *</InputLabel>
// //                                                             <Select
// //                                                                 name="ruleType"
// //                                                                 value={values.ruleType}
// //                                                                 onChange={handleChange}
// //                                                                 onBlur={handleBlur}
// //                                                                 label="Rule Type *"
// //                                                                 disabled={isLoading}
// //                                                             >
// //                                                                 {ruleTypes.map((type) => (
// //                                                                     <MenuItem key={type.value} value={type.value}>
// //                                                                         <Box display="flex" alignItems="center" gap={1}>
// //                                                                             {type.icon}
// //                                                                             <Box>
// //                                                                                 <Typography>{type.label}</Typography>
// //                                                                                 <Typography variant="caption" color="text.secondary">
// //                                                                                     {type.description}
// //                                                                                 </Typography>
// //                                                                             </Box>
// //                                                                         </Box>
// //                                                                     </MenuItem>
// //                                                                 ))}
// //                                                             </Select>
// //                                                             {touched.ruleType && errors.ruleType && (
// //                                                                 <FormHelperText>{errors.ruleType}</FormHelperText>
// //                                                             )}
// //                                                         </FormControl>
// //                                                     </Grid>
// //                                                     <Grid item xs={12} md={6}>
// //                                                         <FormControl fullWidth error={touched.category && Boolean(errors.category)}>
// //                                                             <InputLabel>Category *</InputLabel>
// //                                                             <Select
// //                                                                 name="category"
// //                                                                 value={values.category}
// //                                                                 onChange={handleChange}
// //                                                                 onBlur={handleBlur}
// //                                                                 label="Category *"
// //                                                                 disabled={isLoading}
// //                                                             >
// //                                                                 {categories.map((cat) => (
// //                                                                     <MenuItem key={cat.value} value={cat.value}>
// //                                                                         <Box display="flex" alignItems="center" gap={1}>
// //                                                                             <Chip
// //                                                                                 label={cat.label}
// //                                                                                 size="small"
// //                                                                                 color={cat.color}
// //                                                                                 icon={cat.icon}
// //                                                                             />
// //                                                                             <Box>
// //                                                                                 <Typography>{cat.label}</Typography>
// //                                                                                 <Typography variant="caption" color="text.secondary">
// //                                                                                     {cat.description}
// //                                                                                 </Typography>
// //                                                                             </Box>
// //                                                                         </Box>
// //                                                                     </MenuItem>
// //                                                                 ))}
// //                                                             </Select>
// //                                                             {touched.category && errors.category && (
// //                                                                 <FormHelperText>{errors.category}</FormHelperText>
// //                                                             )}
// //                                                         </FormControl>
// //                                                     </Grid>
// //                                                     <Grid item xs={12}>
// //                                                         <FormControlLabel
// //                                                             control={
// //                                                                 <Switch
// //                                                                     name="isActive"
// //                                                                     checked={values.isActive}
// //                                                                     onChange={handleChange}
// //                                                                     color="success"
// //                                                                     disabled={isLoading}
// //                                                                 />
// //                                                             }
// //                                                             label={
// //                                                                 <Box display="flex" alignItems="center" gap={1}>
// //                                                                     {values.isActive ? (
// //                                                                         <CheckCircleIcon color="success" fontSize="small" />
// //                                                                     ) : (
// //                                                                         <ErrorIcon color="action" fontSize="small" />
// //                                                                     )}
// //                                                                     <Typography>
// //                                                                         {values.isActive ? 'Rule is active' : 'Rule is inactive'}
// //                                                                     </Typography>
// //                                                                 </Box>
// //                                                             }
// //                                                         />
// //                                                     </Grid>
// //                                                 </Grid>
// //                                             </Box>
// //                                         )}

// //                                         {/* Step 1: Schedule & Timing */}
// //                                         {activeStep === 1 && (
// //                                             <Box>
// //                                                 <Typography variant="h6" gutterBottom>
// //                                                     <ScheduleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
// //                                                     Schedule & Timing Configuration
// //                                                 </Typography>
// //                                                 <Divider sx={{ mb: 3 }} />
// //                                                 {renderTimingConfiguration(values, handleChange, setFieldValue)}
// //                                             </Box>
// //                                         )}

// //                                         {/* Step 2: Target & Filters */}
// //                                         {activeStep === 2 && (
// //                                             <Box>
// //                                                 <Typography variant="h6" gutterBottom>
// //                                                     <FilterListIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
// //                                                     Target & Filter Configuration
// //                                                 </Typography>
// //                                                 <Divider sx={{ mb: 3 }} />
                                                
// //                                                 <Grid container spacing={3}>
// //                                                     <Grid item xs={12}>
// //                                                         <FormControl fullWidth error={touched.targetType && Boolean(errors.targetType)}>
// //                                                             <InputLabel>Target Type *</InputLabel>
// //                                                             <Select
// //                                                                 name="targetType"
// //                                                                 value={values.targetType}
// //                                                                 onChange={(e) => {
// //                                                                     handleChange(e);
// //                                                                     setFieldValue('targetFilter', '{}');
// //                                                                 }}
// //                                                                 onBlur={handleBlur}
// //                                                                 label="Target Type *"
// //                                                                 disabled={isLoading}
// //                                                             >
// //                                                                 {targetTypes.map((type) => (
// //                                                                     <MenuItem key={type.value} value={type.value}>
// //                                                                         <Box display="flex" alignItems="center" gap={1}>
// //                                                                             {type.icon}
// //                                                                             <Typography>{type.label}</Typography>
// //                                                                         </Box>
// //                                                                     </MenuItem>
// //                                                                 ))}
// //                                                             </Select>
// //                                                             {touched.targetType && errors.targetType && (
// //                                                                 <FormHelperText>{errors.targetType}</FormHelperText>
// //                                                             )}
// //                                                         </FormControl>
// //                                                     </Grid>

// //                                                     {/* Target Filter Builder - UPDATED to include SPECIFIC_STUDENTS_DIRECT */}
// //                                                     {(values.targetType === 'CLASS' || 
// //                                                       values.targetType === 'SECTION' || 
// //                                                       values.targetType === 'SPECIFIC_USERS' ||
// //                                                       values.targetType === 'SPECIFIC_STUDENTS_DIRECT') && (
// //                                                         <Grid item xs={12}>
// //                                                             <Paper sx={{ p: 3, bgcolor: '#f5f5f5', mt: 2 }}>
// //                                                                 <Typography variant="subtitle1" gutterBottom>
// //                                                                     Configure Target Filters
// //                                                                 </Typography>
// //                                                                 <TargetFilterBuilder
// //                                                                     value={values.targetFilter}
// //                                                                     onChange={(newFilter) => setFieldValue('targetFilter', newFilter)}
// //                                                                     category={values.category}
// //                                                                     targetType={values.targetType}
// //                                                                     disabled={isLoading}
// //                                                                 />
// //                                                             </Paper>
// //                                                         </Grid>
// //                                                     )}

// //                                                     {/* Fee Configuration */}
// //                                                     {values.category === 'FEE' && (
// //                                                         <Grid item xs={12}>
// //                                                             <Paper sx={{ p: 3, bgcolor: '#f5f5f5', mt: 2 }}>
// //                                                                 <Typography variant="subtitle1" gutterBottom>
// //                                                                     Fee Reminder Settings
// //                                                                 </Typography>
// //                                                                 <TargetFilterBuilder
// //                                                                     value={values.targetFilter}
// //                                                                     onChange={(newFilter) => setFieldValue('targetFilter', newFilter)}
// //                                                                     category={values.category}
// //                                                                     targetType={values.targetType}
// //                                                                     disabled={isLoading}
// //                                                                 />
// //                                                             </Paper>
// //                                                         </Grid>
// //                                                     )}

// //                                                     <Grid item xs={12}>
// //                                                         <FormControlLabel
// //                                                             control={
// //                                                                 <Switch
// //                                                                     name="isBatch"
// //                                                                     checked={values.isBatch}
// //                                                                     onChange={handleChange}
// //                                                                     color="primary"
// //                                                                     disabled={isLoading}
// //                                                                 />
// //                                                             }
// //                                                             label={
// //                                                                 <Box display="flex" alignItems="center" gap={1}>
// //                                                                     <SendIcon fontSize="small" />
// //                                                                     <Typography>Send as batch notification</Typography>
// //                                                                     <Tooltip title="Batch notifications are processed together and can be tracked as a group">
// //                                                                         <InfoIcon fontSize="small" color="action" />
// //                                                                     </Tooltip>
// //                                                                 </Box>
// //                                                             }
// //                                                         />
// //                                                     </Grid>
// //                                                 </Grid>
// //                                             </Box>
// //                                         )}

// //                                         {/* Step 3: Content */}
// //                                         {activeStep === 3 && (
// //                                             <Box>
// //                                                 <Typography variant="h6" gutterBottom>
// //                                                     <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
// //                                                     Notification Content
// //                                                 </Typography>
// //                                                 <Typography variant="body2" color="text.secondary" paragraph>
// //                                                     Define your notification content using variables in curly braces {'{}'}
// //                                                 </Typography>

// //                                                 <Paper sx={{ p: 2, mb: 3, bgcolor: '#f5f5f5' }}>
// //                                                     <Typography variant="subtitle2" gutterBottom>
// //                                                         Insert Variable Into:
// //                                                     </Typography>
// //                                                     <RadioGroup
// //                                                         row
// //                                                         value={selectedInsertField}
// //                                                         onChange={(e) => setSelectedInsertField(e.target.value)}
// //                                                     >
// //                                                         <FormControlLabel
// //                                                             value="titleTemplate"
// //                                                             control={<Radio />}
// //                                                             label={
// //                                                                 <Box display="flex" alignItems="center" gap={0.5}>
// //                                                                     <AssignmentIcon fontSize="small" color="primary" />
// //                                                                     <Typography>Title</Typography>
// //                                                                 </Box>
// //                                                             }
// //                                                         />
// //                                                         <FormControlLabel
// //                                                             value="messageTemplate"
// //                                                             control={<Radio />}
// //                                                             label={
// //                                                                 <Box display="flex" alignItems="center" gap={0.5}>
// //                                                                     <MessageIcon fontSize="small" color="secondary" />
// //                                                                     <Typography>Message</Typography>
// //                                                                 </Box>
// //                                                             }
// //                                                         />
// //                                                         <FormControlLabel
// //                                                             value="dataTemplate"
// //                                                             control={<Radio />}
// //                                                             label={
// //                                                                 <Box display="flex" alignItems="center" gap={0.5}>
// //                                                                     <DataIcon fontSize="small" color="success" />
// //                                                                     <Typography>Data Payload</Typography>
// //                                                                 </Box>
// //                                                             }
// //                                                         />
// //                                                     </RadioGroup>
// //                                                 </Paper>

// //                                                 <Paper sx={{ p: 2, mb: 3, bgcolor: '#f5f5f5' }}>
// //                                                     <Typography variant="subtitle2" gutterBottom>
// //                                                         Available Variables for {values.category || 'General'} Notifications
// //                                                     </Typography>
// //                                                     <Box display="flex" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
// //                                                         {sampleVariables.COMMON.map((variable) => (
// //                                                             <Tooltip key={variable.name} title={`${variable.description} (Sample: ${variable.sample})`}>
// //                                                                 <Chip
// //                                                                     label={`{${variable.name}}`}
// //                                                                     size="small"
// //                                                                     onClick={() => insertVariableAtCursor(
// //                                                                         variable.name,
// //                                                                         setFieldValue,
// //                                                                         values,
// //                                                                         selectedInsertField,
// //                                                                         selectedInsertField === 'titleTemplate' ? titleQuillRef : 
// //                                                                         selectedInsertField === 'messageTemplate' ? messageQuillRef : null
// //                                                                     )}
// //                                                                     variant="outlined"
// //                                                                     sx={{ cursor: 'pointer' }}
// //                                                                 />
// //                                                             </Tooltip>
// //                                                         ))}
// //                                                         {sampleVariables[values.category]?.map((variable) => (
// //                                                             <Tooltip key={variable.name} title={`${variable.description} (Sample: ${variable.sample})`}>
// //                                                                 <Chip
// //                                                                     label={`{${variable.name}}`}
// //                                                                     size="small"
// //                                                                     color="primary"
// //                                                                     onClick={() => insertVariableAtCursor(
// //                                                                         variable.name,
// //                                                                         setFieldValue,
// //                                                                         values,
// //                                                                         selectedInsertField,
// //                                                                         selectedInsertField === 'titleTemplate' ? titleQuillRef : 
// //                                                                         selectedInsertField === 'messageTemplate' ? messageQuillRef : null
// //                                                                     )}
// //                                                                     sx={{ cursor: 'pointer' }}
// //                                                                 />
// //                                                             </Tooltip>
// //                                                         ))}
// //                                                     </Box>
// //                                                 </Paper>

// //                                                 <Grid container spacing={3}>
                                                   



// // <Grid item xs={12}>
// //     <Box>
// //         <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
// //             <Typography variant="subtitle2">
// //                 Title Template *
// //             </Typography>
// //             <Typography variant="caption" color={getPlainTextLength(values.titleTemplate) > 200 ? "error" : "text.secondary"}>
// //                 {getPlainTextLength(values.titleTemplate)}/200 characters
// //             </Typography>
// //         </Box>
// //         <Box
// //             sx={{
// //                 borderLeft: selectedInsertField === 'titleTemplate' ? '4px solid' : 'none',
// //                 borderLeftColor: 'primary.main',
// //                 pl: selectedInsertField === 'titleTemplate' ? 1 : 0,
// //                 '& .ql-container': {
// //                     minHeight: '80px',
// //                     fontFamily: 'inherit',
// //                 },
// //                 '& .ql-editor': {
// //                     minHeight: '80px',
// //                     fontSize: '1rem',
// //                 },
// //                 '& .ql-toolbar': {
// //                     borderTopLeftRadius: '4px',
// //                     borderTopRightRadius: '4px',
// //                 }
// //             }}
// //             onClick={() => setSelectedInsertField('titleTemplate')}
// //         >
// //             <ReactQuill
// //                 ref={titleQuillRef}
// //                 theme="snow"
// //                 value={values.titleTemplate}
// //                 onChange={(content) => {
// //                     setFieldValue('titleTemplate', content);
// //                 }}
// //                 onBlur={() => handleBlur({ target: { name: 'titleTemplate' } })}
// //                 modules={{
// //                     toolbar: messageToolbarOptions,  // Changed to use full toolbar
// //                 }}
// //                 formats={messageFormats}  // Added formats to match toolbar
// //                 placeholder="Write notification title here... (Use {variables} for dynamic content)"
// //                 readOnly={isLoading}
// //             />
// //         </Box>
// //         {touched.titleTemplate && errors.titleTemplate && (
// //             <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
// //                 {errors.titleTemplate}
// //             </Typography>
// //         )}
// //     </Box>
// // </Grid>
// //                                                     {/* Message Template - React Quill with Full Toolbar */}
// //                                                     <Grid item xs={12}>
// //                                                         <Box>
// //                                                             <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
// //                                                                 <Typography variant="subtitle2">
// //                                                                     Message Template *
// //                                                                 </Typography>
// //                                                                 <Typography variant="caption" color={getPlainTextLength(values.messageTemplate) > 1000 ? "error" : "text.secondary"}>
// //                                                                     {getPlainTextLength(values.messageTemplate)}/1000 characters
// //                                                                 </Typography>
// //                                                             </Box>
// //                                                             <Box
// //                                                                 sx={{
// //                                                                     borderLeft: selectedInsertField === 'messageTemplate' ? '4px solid' : 'none',
// //                                                                     borderLeftColor: 'secondary.main',
// //                                                                     pl: selectedInsertField === 'messageTemplate' ? 1 : 0,
// //                                                                     '& .ql-container': {
// //                                                                         minHeight: '200px',
// //                                                                         fontFamily: 'inherit',
// //                                                                     },
// //                                                                     '& .ql-editor': {
// //                                                                         minHeight: '200px',
// //                                                                         fontSize: '1rem',
// //                                                                     },
// //                                                                     '& .ql-toolbar': {
// //                                                                         borderTopLeftRadius: '4px',
// //                                                                         borderTopRightRadius: '4px',
// //                                                                     },
// //                                                                     '& .ql-container': {
// //                                                                         borderBottomLeftRadius: '4px',
// //                                                                         borderBottomRightRadius: '4px',
// //                                                                     }
// //                                                                 }}
// //                                                                 onClick={() => setSelectedInsertField('messageTemplate')}
// //                                                             >
// //                                                                 <ReactQuill
// //                                                                     ref={messageQuillRef}
// //                                                                     theme="snow"
// //                                                                     value={values.messageTemplate}
// //                                                                     onChange={(content) => {
// //                                                                         setFieldValue('messageTemplate', content);
// //                                                                     }}
// //                                                                     onBlur={() => handleBlur({ target: { name: 'messageTemplate' } })}
// //                                                                     modules={{
// //                                                                         toolbar: messageToolbarOptions,
// //                                                                     }}
// //                                                                     formats={messageFormats}
// //                                                                     placeholder="Write your notification message here. Use the toolbar to format text and {variables} for dynamic content..."
// //                                                                     readOnly={isLoading}
// //                                                                 />
// //                                                             </Box>
// //                                                             {touched.messageTemplate && errors.messageTemplate && (
// //                                                                 <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
// //                                                                     {errors.messageTemplate}
// //                                                                 </Typography>
// //                                                             )}
// //                                                         </Box>
// //                                                     </Grid>

// //                                                     {/* Data Template - Plain TextField (unchanged) */}
// //                                                     <Grid item xs={12}>
// //                                                         <TextField
// //                                                             fullWidth
// //                                                             name="dataTemplate"
// //                                                             label="Data Template (JSON - Optional)"
// //                                                             value={values.dataTemplate || ''}
// //                                                             onChange={handleChange}
// //                                                             onBlur={handleBlur}
// //                                                             helperText="Additional data in JSON format for mobile apps"
// //                                                             multiline
// //                                                             rows={4}
// //                                                             placeholder='{"action": "view_details", "id": "{ID}"}'
// //                                                             disabled={isLoading}
// //                                                             inputRef={dataRef}
// //                                                             InputProps={{
// //                                                                 style: { fontFamily: 'monospace', fontSize: '0.875rem' },
// //                                                                 sx: {
// //                                                                     borderLeft: selectedInsertField === 'dataTemplate' ? '4px solid' : 'none',
// //                                                                     borderLeftColor: 'success.main',
// //                                                                     pl: selectedInsertField === 'dataTemplate' ? 1 : 0
// //                                                                 }
// //                                                             }}
// //                                                             onClick={() => setSelectedInsertField('dataTemplate')}
// //                                                         />
// //                                                     </Grid>
// //                                                 </Grid>

// //                                                 <Paper sx={{ p: 3, mt: 3, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
// //                                                     <Typography variant="subtitle2" gutterBottom color="primary">
// //                                                         Live Preview
// //                                                     </Typography>
// //                                                     <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1 }}>
// //                                                         <Typography variant="subtitle1" gutterBottom fontWeight="bold">
// //                                                             <div dangerouslySetInnerHTML={{ __html: values.titleTemplate || 'Title will appear here' }} />
// //                                                         </Typography>
// //                                                         <Box sx={{ whiteSpace: 'pre-line' }}>
// //                                                             <div dangerouslySetInnerHTML={{ __html: values.messageTemplate || 'Message will appear here' }} />
// //                                                         </Box>
// //                                                         {values.dataTemplate && (
// //                                                             <Box sx={{ mt: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
// //                                                                 <Typography variant="caption" color="text.secondary">
// //                                                                     Data Payload:
// //                                                                 </Typography>
// //                                                                 <pre style={{ margin: 0, fontSize: '0.75rem', overflowX: 'auto' }}>
// //                                                                     {values.dataTemplate}
// //                                                                 </pre>
// //                                                             </Box>
// //                                                         )}
// //                                                     </Box>
// //                                                 </Paper>
// //                                             </Box>
// //                                         )}

// //                                         {/* Step 4: Advanced */}
// //                                         {activeStep === 4 && (
// //                                             <Box>
// //                                                 <Typography variant="h6" gutterBottom>
// //                                                     <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
// //                                                     Advanced Settings
// //                                                 </Typography>
// //                                                 <Divider sx={{ mb: 3 }} />
// //                                                 <Grid container spacing={3}>
// //                                                     <Grid item xs={12} md={6}>
// //                                                         <FormControl fullWidth error={touched.priority && Boolean(errors.priority)}>
// //                                                             <InputLabel>Priority *</InputLabel>
// //                                                             <Select
// //                                                                 name="priority"
// //                                                                 value={values.priority || 2}
// //                                                                 onChange={handleChange}
// //                                                                 onBlur={handleBlur}
// //                                                                 label="Priority *"
// //                                                                 disabled={isLoading}
// //                                                             >
// //                                                                 {priorities.map((priority) => (
// //                                                                     <MenuItem key={priority.value} value={priority.value}>
// //                                                                         <Box display="flex" alignItems="center" gap={1}>
// //                                                                             <Chip
// //                                                                                 label={priority.label}
// //                                                                                 size="small"
// //                                                                                 color={priority.color}
// //                                                                             />
// //                                                                             <Box>
// //                                                                                 <Typography>Priority {priority.value}</Typography>
// //                                                                                 <Typography variant="caption" color="text.secondary">
// //                                                                                     {priority.description}
// //                                                                                 </Typography>
// //                                                                             </Box>
// //                                                                         </Box>
// //                                                                     </MenuItem>
// //                                                                 ))}
// //                                                             </Select>
// //                                                             {touched.priority && errors.priority && (
// //                                                                 <FormHelperText>{errors.priority}</FormHelperText>
// //                                                             )}
// //                                                         </FormControl>
// //                                                     </Grid>

// //                                                     <Grid item xs={12} md={6}>
// //                                                         <TextField
// //                                                             fullWidth
// //                                                             name="createdBy"
// //                                                             label="Created By"
// //                                                             value={getCurrentUserId()}
// //                                                             disabled
// //                                                             helperText="Your user ID (automatically assigned)"
// //                                                         />
// //                                                     </Grid>

// //                                                     {values.ruleType === 'EVENT' && (
// //                                                         <>
// //                                                             <Grid item xs={12} md={6}>
// //                                                                 <TextField
// //                                                                     fullWidth
// //                                                                     name="sourceTable"
// //                                                                     label="Source Table"
// //                                                                     value={values.sourceTable || ''}
// //                                                                     onChange={handleChange}
// //                                                                     onBlur={handleBlur}
// //                                                                     helperText="Database table to monitor for events"
// //                                                                     placeholder="e.g., tbl_FeePosting"
// //                                                                     disabled={isLoading}
// //                                                                 />
// //                                                             </Grid>
// //                                                             <Grid item xs={12} md={6}>
// //                                                                 <TextField
// //                                                                     fullWidth
// //                                                                     name="triggerField"
// //                                                                     label="Trigger Field"
// //                                                                     value={values.triggerField || ''}
// //                                                                     onChange={handleChange}
// //                                                                     onBlur={handleBlur}
// //                                                                     helperText="Field to monitor for changes"
// //                                                                     placeholder="e.g., Status"
// //                                                                     disabled={isLoading}
// //                                                                 />
// //                                                             </Grid>
// //                                                             <Grid item xs={12}>
// //                                                                 <TextField
// //                                                                     fullWidth
// //                                                                     name="triggerValue"
// //                                                                     label="Trigger Value"
// //                                                                     value={values.triggerValue || ''}
// //                                                                     onChange={handleChange}
// //                                                                     onBlur={handleBlur}
// //                                                                     helperText="Value that triggers the notification"
// //                                                                     placeholder="e.g., POSTED"
// //                                                                     disabled={isLoading}
// //                                                                 />
// //                                                             </Grid>
// //                                                         </>
// //                                                     )}

// //                                                     <Grid item xs={12}>
// //                                                         <Alert severity="info" icon={<InfoIcon />}>
// //                                                             <Typography variant="body2">
// //                                                                 <strong>Rule Summary:</strong> This rule will run{' '}
// //                                                                 {values.timingType === 'IMMEDIATE' ? 'immediately when triggered' :
// //                                                                  values.timingType === 'FIXED_TIME' ? `daily at ${values.fixedTime}` :
// //                                                                  values.timingType === 'DAYS_OFFSET' ? `every ${values.daysOffset} days` :
// //                                                                  values.timingType === 'CRON' ? `according to cron schedule: ${values.cronExpression}` :
// //                                                                  values.timingType?.toLowerCase()}.
// //                                                             </Typography>
// //                                                             <Typography variant="body2" sx={{ mt: 1 }}>
// //                                                                 <strong>Target:</strong> {targetTypes.find(t => t.value === values.targetType)?.label || 'All Users'}
// //                                                                 <br />
// //                                                                 <strong>Category:</strong> {values.category}
// //                                                                 <br />
// //                                                                 <strong>Batch Mode:</strong> {values.isBatch ? 'Enabled' : 'Disabled'}
// //                                                                 <br />
// //                                                                 <strong>Priority:</strong> {priorities.find(p => p.value === values.priority)?.label || 'Medium'} ({values.priority})
// //                                                             </Typography>
// //                                                         </Alert>
// //                                                     </Grid>
// //                                                 </Grid>
// //                                             </Box>
// //                                         )}

// //                                         {/* Navigation Buttons */}
// //                                         <Box display="flex" justifyContent="space-between" mt={4}>
// //                                             <Button
// //                                                 disabled={activeStep === 0 || isLoading}
// //                                                 onClick={handleBack}
// //                                                 startIcon={<CancelIcon />}
// //                                                 variant="outlined"
// //                                                 type="button"
// //                                             >
// //                                                 Back
// //                                             </Button>
// //                                             {activeStep < steps.length - 1 ? (
// //                                                 <Button
// //                                                     variant="contained"
// //                                                     onClick={handleNext}
// //                                                     disabled={isLoading || !isStepValid(values, errors, activeStep)}
// //                                                     type="button"
// //                                                 >
// //                                                     Next Step
// //                                                 </Button>
// //                                             ) : (
// //                                                 <Button
// //                                                     type="submit"
// //                                                     variant="contained"
// //                                                     color="primary"
// //                                                     disabled={isLoading || !isValid || isSubmitting}
// //                                                     startIcon={isLoading || isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
// //                                                 >
// //                                                     {isLoading || isSubmitting ? 'Saving...' : (isEditMode ? 'Update Rule' : 'Create Rule')}
// //                                                 </Button>
// //                                             )}
// //                                         </Box>
// //                                     </CardContent>
// //                                 </Card>
// //                             </Grid>

// //                             {/* Right Column - Summary */}
// //                             <Grid item xs={12} lg={4}>
// //                                 <Box sx={{ position: 'sticky', top: 24 }}>
// //                                     <Card sx={{ mb: 2 }}>
// //                                         <CardHeader title="Rule Summary" />
// //                                         <CardContent>
// //                                             <List disablePadding>
// //                                                 <ListItem sx={{ px: 0 }}>
// //                                                     <ListItemText primary="Rule Name" secondary={values.ruleName || 'Not set'} />
// //                                                 </ListItem>
// //                                                 <Divider sx={{ my: 1 }} />
// //                                                 <ListItem sx={{ px: 0 }}>
// //                                                     <ListItemText 
// //                                                         primary="Type & Category" 
// //                                                         secondary={
// //                                                             <Box display="flex" gap={1} sx={{ mt: 0.5 }}>
// //                                                                 <Chip label={values.ruleType} size="small" variant="outlined" />
// //                                                                 <Chip 
// //                                                                     label={values.category} 
// //                                                                     size="small" 
// //                                                                     color={categories.find(c => c.value === values.category)?.color || 'default'}
// //                                                                 />
// //                                                             </Box>
// //                                                         } 
// //                                                     />
// //                                                 </ListItem>
// //                                                 <Divider sx={{ my: 1 }} />
// //                                                 <ListItem sx={{ px: 0 }}>
// //                                                     <ListItemText 
// //                                                         primary="Schedule" 
// //                                                         secondary={
// //                                                             <Typography variant="body2" sx={{ mt: 0.5 }}>
// //                                                                 {values.timingType === 'IMMEDIATE' ? 'Immediate' :
// //                                                                  values.timingType === 'FIXED_TIME' ? `Daily at ${values.fixedTime || '09:00'}` :
// //                                                                  values.timingType === 'DAYS_OFFSET' ? `Every ${values.daysOffset || 1} days` :
// //                                                                  values.timingType === 'CRON' ? `Cron: ${values.cronExpression || '0 9 * * *'}` :
// //                                                                  values.timingType?.charAt(0).toUpperCase() + values.timingType?.slice(1).toLowerCase()}
// //                                                             </Typography>
// //                                                         } 
// //                                                     />
// //                                                 </ListItem>
// //                                                 <Divider sx={{ my: 1 }} />
// //                                                 <ListItem sx={{ px: 0 }}>
// //                                                     <ListItemText 
// //                                                         primary="Status" 
// //                                                         secondary={
// //                                                             <Box display="flex" alignItems="center" gap={1} sx={{ mt: 0.5 }}>
// //                                                                 <Chip 
// //                                                                     label={values.isActive ? 'Active' : 'Inactive'} 
// //                                                                     size="small" 
// //                                                                     color={values.isActive ? 'success' : 'error'} 
// //                                                                 />
// //                                                                 {values.isBatch && (
// //                                                                     <Chip label="Batch" size="small" variant="outlined" color="primary" />
// //                                                                 )}
// //                                                             </Box>
// //                                                         } 
// //                                                     />
// //                                                 </ListItem>
// //                                                 <Divider sx={{ my: 1 }} />
// //                                                 <ListItem sx={{ px: 0 }}>
// //                                                     <ListItemText 
// //                                                         primary="Priority" 
// //                                                         secondary={
// //                                                             <Chip 
// //                                                                 label={`${priorities.find(p => p.value === values.priority)?.label || 'Medium'} (${values.priority})`} 
// //                                                                 size="small" 
// //                                                                 color={priorities.find(p => p.value === values.priority)?.color}
// //                                                                 sx={{ mt: 0.5 }}
// //                                                             />
// //                                                         } 
// //                                                     />
// //                                                 </ListItem>
// //                                                 <Divider sx={{ my: 1 }} />
// //                                                 <ListItem sx={{ px: 0 }}>
// //                                                     <ListItemText 
// //                                                         primary="Target" 
// //                                                         secondary={
// //                                                             <Typography variant="body2" sx={{ mt: 0.5 }}>
// //                                                                 {targetTypes.find(t => t.value === values.targetType)?.label || 'All Users'}
// //                                                             </Typography>
// //                                                         } 
// //                                                     />
// //                                                 </ListItem>
// //                                             </List>

// //                                             {isEditMode && id && (
// //                                                 <Box mt={2} display="flex" flexDirection="column" gap={1}>
// //                                                     <Button
// //                                                         variant="outlined"
// //                                                         fullWidth
// //                                                         size="small"
// //                                                         onClick={() => handleTestRule(id)}
// //                                                         disabled={testing || isLoading}
// //                                                         startIcon={testing ? <CircularProgress size={16} /> : <SendIcon />}
// //                                                         color="primary"
// //                                                         type="button"
// //                                                     >
// //                                                         {testing ? 'Testing...' : 'Test Rule'}
// //                                                     </Button>
// //                                                     <Button
// //                                                         variant="outlined"
// //                                                         fullWidth
// //                                                         size="small"
// //                                                         onClick={() => handleExecuteRule(id)}
// //                                                         disabled={executing || isLoading}
// //                                                         startIcon={executing ? <CircularProgress size={16} /> : <PlayArrowIcon />}
// //                                                         color="secondary"
// //                                                         type="button"
// //                                                     >
// //                                                         {executing ? 'Executing...' : 'Execute Rule Now'}
// //                                                     </Button>
// //                                                     <Alert severity="warning" sx={{ mt: 0.5, py: 0 }}>
// //                                                         <Typography variant="caption">Executing will run the rule immediately.</Typography>
// //                                                     </Alert>
// //                                                 </Box>
// //                                             )}

// //                                             <Button
// //                                                 variant="outlined"
// //                                                 fullWidth
// //                                                 size="small"
// //                                                 onClick={() => navigate('/dashboard/notification-rules')}
// //                                                 startIcon={<CancelIcon />}
// //                                                 disabled={isLoading}
// //                                                 type="button"
// //                                                 sx={{ mt: 2 }}
// //                                             >
// //                                                 Cancel
// //                                             </Button>
// //                                         </CardContent>
// //                                     </Card>

// //                                     <Card>
// //                                         <CardHeader title="Quick Start" avatar={<AddIcon color="primary" />} />
// //                                         <CardContent>
// //                                             <Button
// //                                                 variant="contained"
// //                                                 fullWidth
// //                                                 size="small"
// //                                                 startIcon={<AddIcon />}
// //                                                 onClick={() => setShowTemplateDialog(true)}
// //                                                 type="button"
// //                                             >
// //                                                 Use Template
// //                                             </Button>
// //                                             <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
// //                                                 Start quickly with pre-configured templates.
// //                                             </Typography>
// //                                         </CardContent>
// //                                     </Card>

// //                                     <Card sx={{ mt: 2 }}>
// //                                         <CardHeader title="Setup Progress" />
// //                                         <CardContent>
// //                                             <LinearProgress
// //                                                 variant="determinate"
// //                                                 value={(activeStep + 1) / steps.length * 100}
// //                                                 sx={{ height: 6, borderRadius: 3, mb: 1 }}
// //                                             />
// //                                             <Typography variant="caption" color="text.secondary">
// //                                                 Step {activeStep + 1} of {steps.length}
// //                                             </Typography>
// //                                         </CardContent>
// //                                     </Card>
// //                                 </Box>
// //                             </Grid>
// //                         </Grid>
// //                     </Form>
// //                 )}
// //             </Formik>

// //             {/* Template Dialog */}
// //             <Dialog open={showTemplateDialog} onClose={() => setShowTemplateDialog(false)} maxWidth="md" fullWidth>
// //                 <DialogTitle>Select Rule Template</DialogTitle>
// //                 <DialogContent>
// //                     <Grid container spacing={2} sx={{ mt: 1 }}>
// //                         {ruleTemplates.map((template) => (
// //                             <Grid item xs={12} key={template.id}>
// //                                 <Card 
// //                                     variant="outlined" 
// //                                     sx={{ 
// //                                         cursor: 'pointer', 
// //                                         '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.50' } 
// //                                     }}
// //                                     onClick={() => {
// //                                         if (setValues) handleTemplateSelect(template, setValues);
// //                                     }}
// //                                 >
// //                                     <CardContent>
// //                                         <Box display="flex" justifyContent="space-between" alignItems="flex-start">
// //                                             <Box>
// //                                                 <Typography variant="h6">{template.name}</Typography>
// //                                                 <Typography variant="body2" color="text.secondary">{template.description}</Typography>
// //                                                 <Box display="flex" gap={1} mt={1}>
// //                                                     <Chip label={template.category} size="small" variant="outlined" />
// //                                                     <Chip label={`Priority ${template.priority}`} size="small" variant="outlined" />
// //                                                 </Box>
// //                                             </Box>
// //                                             <Button variant="contained" size="small">
// //                                                 Use Template
// //                                             </Button>
// //                                         </Box>
// //                                         <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
// //                                             Schedule: {template.timingType === 'FIXED_TIME' ? `Daily at ${template.fixedTime}` :
// //                                                        template.timingType === 'DAYS_OFFSET' ? `Every ${template.daysOffset} days` :
// //                                                        template.timingType}
// //                                         </Typography>
// //                                     </CardContent>
// //                                 </Card>
// //                             </Grid>
// //                         ))}
// //                     </Grid>
// //                 </DialogContent>
// //                 <DialogActions>
// //                     <Button onClick={() => setShowTemplateDialog(false)}>Cancel</Button>
// //                 </DialogActions>
// //             </Dialog>

// //             {/* Snackbar for notifications */}
// //             <Snackbar 
// //                 open={snackbar.open} 
// //                 autoHideDuration={6000} 
// //                 onClose={handleCloseSnackbar} 
// //                 anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
// //             >
// //                 <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
// //                     {snackbar.message}
// //                 </Alert>
// //             </Snackbar>
// //         </Box>
// //     );
// // };

// // export default NotificationRuleForm;
// import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
// import {
//     Box,
//     Button,
//     Card,
//     CardContent,
//     CardHeader,
//     FormControl,
//     FormControlLabel,
//     Grid,
//     MenuItem,
//     Switch,
//     TextField,
//     Typography,
//     Chip,
//     IconButton,
//     Divider,
//     Alert,
//     Stepper,
//     Step,
//     StepLabel,
//     Paper,
//     InputAdornment,
//     Tooltip,
//     CircularProgress,
//     Select,
//     InputLabel,
//     FormHelperText,
//     Snackbar,
//     LinearProgress,
//     List,
//     ListItem,
//     ListItemText,
//     Tabs,
//     Tab,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     Radio,
//     RadioGroup,
// } from '@mui/material';
// import {
//     Add as AddIcon,
//     Info as InfoIcon,
//     CheckCircle as CheckCircleIcon,
//     Error as ErrorIcon,
//     Send as SendIcon,
//     Save as SaveIcon,
//     Cancel as CancelIcon,
//     Refresh as RefreshIcon,
//     PlayArrow as PlayArrowIcon,
//     Schedule as ScheduleIcon,
//     Payment as PaymentIcon,
//     AccountBalance as AccountBalanceIcon,
//     School as SchoolIcon,
//     Assignment as AssignmentIcon,
//     Announcement as AnnouncementIcon,
//     Warning as WarningIcon,
//     Event as EventIcon,
//     Person as PersonIcon,
//     AccessTime as AccessTimeIcon,
//     Timer as TimerIcon,
//     Today as TodayIcon,
//     CalendarToday as CalendarTodayIcon,
//     ViewWeek as ViewWeekIcon,
//     EventNote as EventNoteIcon,
//     FilterList as FilterListIcon,
//     Settings as SettingsIcon,
//     Message as MessageIcon,
//     DataUsage as DataIcon,
//     Close as CloseIcon,
//     ChildCare as ChildIcon,
// } from '@mui/icons-material';
// import { useNavigate, useParams } from 'react-router-dom';
// import { Formik, Form } from 'formik';
// import * as Yup from 'yup';
// import { usePermissions } from '../../../customHook/usePermissions';
// import {
//     useGetNotificationRuleByIdQuery,
//     useCreateNotificationRuleMutation,
//     useUpdateNotificationRuleMutation,
//     useTestNotificationRuleMutation,
//     useExecuteNotificationRuleMutation,
// } from '../../../store/api/notificationApi';
// import { useSelector } from 'react-redux';
// import TargetFilterBuilder from '../../../component/TargetFilterBuilder';

// // Dynamically import ReactQuill to avoid SSR issues
// const ReactQuill = lazy(() => import('react-quill'));
// import 'react-quill/dist/quill.snow.css';

// // Validation Schema
// const validationSchema = Yup.object({
//     ruleName: Yup.string()
//         .required('Rule name is required')
//         .max(100, 'Rule name must be less than 100 characters'),
//     ruleType: Yup.string().required('Rule type is required'),
//     category: Yup.string().required('Category is required'),
//     titleTemplate: Yup.string()
//         .required('Title template is required')
//         .max(200, 'Title must be less than 200 characters'),
//     messageTemplate: Yup.string()
//         .required('Message template is required')
//         .max(1000, 'Message must be less than 1000 characters'),
//     targetType: Yup.string().required('Target type is required'),
//     isActive: Yup.boolean(),
//     priority: Yup.number()
//         .min(1, 'Priority must be between 1-3')
//         .max(3, 'Priority must be between 1-3')
//         .required('Priority is required'),
//     isBatch: Yup.boolean(),
//     timingType: Yup.string().required('Timing type is required'),
//     cronExpression: Yup.string().nullable(),
//     daysOffset: Yup.number().min(0, 'Days offset must be positive').nullable(),
//     fixedTime: Yup.string().nullable(),
//     targetFilter: Yup.string().test(
//         'json',
//         'Must be valid JSON',
//         (value) => {
//             if (!value) return true;
//             try {
//                 JSON.parse(value);
//                 return true;
//             } catch {
//                 return false;
//             }
//         }
//     )
// });

// // Initial values
// const getInitialValues = (userData = null) => ({
//     ruleName: '',
//     ruleType: 'CRON',
//     category: 'FEE',
//     sourceTable: '',
//     triggerField: '',
//     triggerValue: '',
//     timingType: 'DAILY',
//     fixedTime: '09:00',
//     daysOffset: 1,
//     cronExpression: '0 9 * * *',
//     titleTemplate: '',
//     messageTemplate: '',
//     dataTemplate: '',
//     targetType: 'PARENTS',
//     targetFilter: '{}',
//     isActive: true,
//     isBatch: true,
//     priority: 2,
//     createdBy: userData?.id || 1,
// });

// const steps = [
//     { label: 'Basic Info', icon: <InfoIcon /> },
//     { label: 'Schedule & Timing', icon: <ScheduleIcon /> },
//     { label: 'Target & Filters', icon: <FilterListIcon /> },
//     { label: 'Content', icon: <AssignmentIcon /> },
//     { label: 'Advanced', icon: <SettingsIcon /> },
// ];

// // Categories with icons
// const categories = [
//     { value: 'FEE', label: 'Fee', color: 'warning', icon: <PaymentIcon />, description: 'Fee-related notifications' },
//     { value: 'ATTENDANCE', label: 'Attendance', color: 'error', icon: <AccountBalanceIcon />, description: 'Attendance notifications' },
//     { value: 'EXAM', label: 'Exam', color: 'info', icon: <SchoolIcon />, description: 'Exam notifications' },
//     { value: 'HOMEWORK', label: 'Homework', color: 'success', icon: <AssignmentIcon />, description: 'Homework assignments' },
//     { value: 'ANNOUNCEMENT', label: 'Announcement', color: 'primary', icon: <AnnouncementIcon />, description: 'School announcements' },
//     { value: 'GENERAL', label: 'General', color: 'default', icon: <InfoIcon />, description: 'General notifications' },
//     { value: 'ALERT', label: 'Alert', color: 'error', icon: <WarningIcon />, description: 'Important alerts' },
//     { value: 'EVENT', label: 'Event', color: 'info', icon: <EventIcon />, description: 'School events' },
// ];

// const ruleTypes = [
//     { value: 'EVENT', label: 'Event Trigger', description: 'Triggered by database events', icon: <EventIcon /> },
//     { value: 'CRON', label: 'Scheduled (Cron)', description: 'Runs on a schedule', icon: <ScheduleIcon /> },
//     { value: 'MANUAL', label: 'Manual', description: 'Manual trigger only', icon: <PlayArrowIcon /> },
// ];

// const timingTypes = [
//     { value: 'IMMEDIATE', label: 'Immediate', icon: <AccessTimeIcon />, description: 'Run immediately when triggered' },
//     { value: 'FIXED_TIME', label: 'Fixed Time', icon: <TimerIcon />, description: 'Run at specific time each day' },
//     { value: 'DAYS_OFFSET', label: 'Days Offset', icon: <TodayIcon />, description: 'Run every X days' },
//     { value: 'CRON', label: 'Cron Expression', icon: <CalendarTodayIcon />, description: 'Advanced scheduling' },
//     { value: 'DAILY', label: 'Daily', icon: <TodayIcon />, description: 'Run once per day' },
//     { value: 'WEEKLY', label: 'Weekly', icon: <ViewWeekIcon />, description: 'Run once per week' },
//     { value: 'MONTHLY', label: 'Monthly', icon: <CalendarTodayIcon />, description: 'Run once per month' },
// ];

// const targetTypes = [
//     { value: 'ALL', label: 'All Users', icon: <PersonIcon /> },
//     { value: 'PARENTS', label: 'Parents Only', icon: <PersonIcon /> },
//     { value: 'TEACHERS', label: 'Teachers Only', icon: <PersonIcon /> },
//     { value: 'STUDENTS', label: 'Students Only', icon: <PersonIcon /> },
//     { value: 'CLASS', label: 'Class Specific', icon: <SchoolIcon /> },
//     { value: 'SECTION', label: 'Section Specific', icon: <SchoolIcon /> },
//     { value: 'SPECIFIC_USERS', label: 'Specific Users', icon: <PersonIcon /> },
//     { value: 'SPECIFIC_STUDENTS_DIRECT', label: 'Specific Students (Direct)', icon: <ChildIcon /> },
// ];

// const priorities = [
//     { value: 1, label: 'High', color: 'error', description: 'Urgent notifications' },
//     { value: 2, label: 'Medium', color: 'warning', description: 'Regular reminders' },
//     { value: 3, label: 'Low', color: 'info', description: 'Informational updates' },
// ];

// // Sample variables for different categories
// const sampleVariables = {
//     COMMON: [
//         { name: 'CurrentDate', description: 'Current date', sample: '25/01/2024' },
//         { name: 'CurrentTime', description: 'Current time', sample: '14:30' },
//         { name: 'RuleName', description: 'Rule name', sample: 'Fee Reminder' },
//         { name: 'Category', description: 'Notification category', sample: 'FEE' },
//     ],
//     FEE: [
//         { name: 'StudentName', description: 'Student name', sample: 'John Doe' },
//         { name: 'ParentName', description: 'Parent name', sample: 'Mr. Smith' },
//         { name: 'DueAmount', description: 'Due amount', sample: '5000' },
//         { name: 'DueDate', description: 'Due date', sample: '31/01/2024' },
//         { name: 'StatusText', description: 'Status description', sample: 'Due in 3 days' },
//     ],
//     ATTENDANCE: [
//         { name: 'StudentName', description: 'Student name', sample: 'John Doe' },
//         { name: 'Status', description: 'Attendance status', sample: 'Absent' },
//         { name: 'AttendanceDate', description: 'Attendance date', sample: '25/01/2024' },
//         { name: 'Remarks', description: 'Remarks', sample: 'Medical Leave' },
//     ],
//     EXAM: [
//         { name: 'StudentName', description: 'Student name', sample: 'John Doe' },
//         { name: 'ExamTitle', description: 'Exam title', sample: 'Mid Term Examination' },
//         { name: 'ExamDate', description: 'Exam date', sample: '30/01/2024' },
//         { name: 'Subject', description: 'Subject', sample: 'Mathematics' },
//     ],
//     HOMEWORK: [
//         { name: 'StudentName', description: 'Student name', sample: 'John Doe' },
//         { name: 'HomeworkTitle', description: 'Homework title', sample: 'Math Assignment' },
//         { name: 'Subject', description: 'Subject', sample: 'Mathematics' },
//         { name: 'DueDate', description: 'Due date', sample: '30/01/2024' },
//     ],
// };

// // Rule templates
// const ruleTemplates = [
//     {
//         id: 1,
//         name: "Daily Fee Reminder",
//         category: "FEE",
//         description: "Send daily reminders for overdue fees",
//         timingType: "DAILY",
//         fixedTime: "09:00",
//         titleTemplate: "Fee Payment Due: {StudentName}",
//         messageTemplate: "Dear {ParentName},\nFee of Rs.{DueAmount} for {StudentName} is {StatusText}.\nDue date: {DueDate}",
//         priority: 2
//     },
//     {
//         id: 2,
//         name: "Weekly Attendance Summary",
//         category: "ATTENDANCE",
//         description: "Weekly summary of student attendance",
//         timingType: "WEEKLY",
//         fixedTime: "17:00",
//         titleTemplate: "Weekly Attendance Summary",
//         messageTemplate: "Attendance Summary for {StudentName}\nStatus: {Status}\nDate: {AttendanceDate}",
//         priority: 3
//     },
//     {
//         id: 3,
//         name: "Exam Reminder",
//         category: "EXAM",
//         description: "Remind students about exams",
//         timingType: "DAYS_OFFSET",
//         daysOffset: 3,
//         titleTemplate: "Exam Reminder: {ExamTitle}",
//         messageTemplate: "Dear Student,\n{ExamTitle} is scheduled on {ExamDate}.\nSubject: {Subject}",
//         priority: 2
//     },
// ];

// // React-Quill toolbar configuration
// const messageToolbarOptions = [
//     [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
//     [{ 'font': [] }],
//     [{ 'size': ['small', false, 'large', 'huge'] }],
//     ['bold', 'italic', 'underline', 'strike'],
//     [{ 'color': [] }, { 'background': [] }],
//     [{ 'script': 'sub' }, { 'script': 'super' }],
//     [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
//     [{ 'align': [] }],
//     ['blockquote', 'code-block'],
//     ['link', 'image', 'video'],
//     ['clean'],
//     [{ 'direction': 'rtl' }],
// ];

// const messageFormats = [
//     'header', 'font', 'size',
//     'bold', 'italic', 'underline', 'strike',
//     'color', 'background',
//     'script',
//     'list', 'bullet', 'indent',
//     'align',
//     'blockquote', 'code-block',
//     'link', 'image', 'video',
//     'clean',
//     'direction'
// ];

// // Helper function to strip HTML tags for character count
// const stripHtmlTags = (html) => {
//     if (!html) return '';
//     if (typeof html !== 'string') return '';
//     const temp = document.createElement('div');
//     temp.innerHTML = html;
//     return temp.textContent || temp.innerText || '';
// };

// // Get plain text length from HTML content
// const getPlainTextLength = (html) => {
//     if (!html || typeof html !== 'string') return 0;
//     return stripHtmlTags(html).length;
// };

// // Quill Editor Component with Suspense
// const QuillEditor = ({ value, onChange, onBlur, placeholder, readOnly, modules, formats, sx }) => {
//     return (
//         <Suspense fallback={<Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress /></Box>}>
//             <ReactQuill
//                 theme="snow"
//                 value={value || ''}
//                 onChange={onChange}
//                 onBlur={onBlur}
//                 placeholder={placeholder}
//                 readOnly={readOnly}
//                 modules={modules}
//                 formats={formats}
//             />
//         </Suspense>
//     );
// };

// const NotificationRuleForm = () => {
//     const navigate = useNavigate();
//     const { id } = useParams();
//     const { isAdmin, isManager, isTeacher } = usePermissions();
//     const isEditMode = !!id;

//     const [activeStep, setActiveStep] = useState(0);
//     const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//     const [showTemplateDialog, setShowTemplateDialog] = useState(false);
//     const [activeTab, setActiveTab] = useState(0);
//     const [selectedInsertField, setSelectedInsertField] = useState('titleTemplate');
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [uploadingImage, setUploadingImage] = useState(false);
//     const [quillLoaded, setQuillLoaded] = useState(false);

//     const titleQuillRef = useRef(null);
//     const messageQuillRef = useRef(null);
//     const dataRef = useRef();

//     const authUser = useSelector((state) => state.auth.user);

//     const { data: ruleData, isLoading: loadingRule, refetch } =
//         useGetNotificationRuleByIdQuery(id, { skip: !isEditMode });

//     const [createRule, { isLoading: creating }] = useCreateNotificationRuleMutation();
//     const [updateRule, { isLoading: updating }] = useUpdateNotificationRuleMutation();
//     const [testRule, { isLoading: testing }] = useTestNotificationRuleMutation();
//     const [executeRule, { isLoading: executing }] = useExecuteNotificationRuleMutation();

//     // Load Quill on client side only
//     useEffect(() => {
//         setQuillLoaded(true);
//     }, []);

//     const getCurrentUserId = () => {
//         if (authUser?.id) return authUser.id;
//         try {
//             const storedUser = localStorage.getItem('user');
//             if (storedUser) {
//                 const user = JSON.parse(storedUser);
//                 return user.id || user.userId || 1;
//             }
//         } catch (error) {
//             return 1;
//         }
//         return 1;
//     };

//     const formatTimeForInput = (timeSpan) => {
//         if (!timeSpan) return '09:00';
//         try {
//             const timeStr = typeof timeSpan === 'string' ? timeSpan : timeSpan.toString();
//             const parts = timeStr.split(':');
//             if (parts.length >= 2) {
//                 return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
//             }
//             return '09:00';
//         } catch (error) {
//             return '09:00';
//         }
//     };

//     const showSnackbar = (message, severity = 'success') => {
//         setSnackbar({ open: true, message, severity });
//     };

//     const handleCloseSnackbar = () => {
//         setSnackbar({ ...snackbar, open: false });
//     };

//     const handleNext = (e) => {
//         if (e) {
//             e.preventDefault();
//             e.stopPropagation();
//         }
//         if (activeStep < steps.length - 1) {
//             setActiveStep(prev => prev + 1);
//         }
//     };

//     const handleBack = (e) => {
//         if (e) {
//             e.preventDefault();
//             e.stopPropagation();
//         }
//         if (activeStep > 0) {
//             setActiveStep(prev => prev - 1);
//         }
//     };

//     const handleTemplateSelect = (template, setValues) => {
//         if (setValues) {
//             setValues({
//                 ...getInitialValues({ id: getCurrentUserId() }),
//                 ruleName: template.name,
//                 category: template.category,
//                 timingType: template.timingType,
//                 fixedTime: template.fixedTime || '09:00',
//                 daysOffset: template.daysOffset || 1,
//                 titleTemplate: template.titleTemplate || '',
//                 messageTemplate: template.messageTemplate || '',
//                 priority: template.priority || 2,
//                 isBatch: true,
//             });
//         }
//         setShowTemplateDialog(false);
//         showSnackbar(`Template "${template.name}" applied successfully`, 'success');
//     };

//     const handleSubmit = async (values, { setSubmitting: formikSetSubmitting }) => {
//         if (isSubmitting) return;
//         if (activeStep !== steps.length - 1) {
//             showSnackbar('Please complete all steps before submitting', 'warning');
//             formikSetSubmitting(false);
//             return;
//         }

//         setIsSubmitting(true);

//         try {
//             const currentUserId = getCurrentUserId();
            
//             const isManualTrigger = values.ruleType === 'MANUAL' || 
//                                    (values.ruleType === 'EVENT' && values.timingType === 'IMMEDIATE');

//             let targetFilterString = '{}';
//             if (values.targetFilter && values.targetFilter.trim() !== '' && values.targetFilter !== '{}') {
//                 try {
//                     const parsed = JSON.parse(values.targetFilter);
//                     targetFilterString = JSON.stringify(parsed);
//                 } catch (error) {
//                     targetFilterString = '{}';
//                 }
//             }

//             let formattedFixedTime = null;
//             if (values.timingType === 'FIXED_TIME' || values.timingType === 'DAILY') {
//                 if (values.fixedTime) {
//                     const timeParts = values.fixedTime.split(':');
//                     if (timeParts.length === 2) {
//                         formattedFixedTime = `${timeParts[0].padStart(2, '0')}:${timeParts[1].padStart(2, '0')}:00`;
//                     } else {
//                         formattedFixedTime = '09:00:00';
//                     }
//                 }
//             }

//             let formattedCronExpression = null;
//             if (values.timingType === 'CRON' && values.cronExpression) {
//                 const cronParts = values.cronExpression.trim().split(/\s+/);
//                 if (cronParts.length === 6) {
//                     formattedCronExpression = cronParts.slice(1).join(' ');
//                 } else if (cronParts.length === 5) {
//                     formattedCronExpression = values.cronExpression.trim();
//                 } else {
//                     formattedCronExpression = '0 9 * * *';
//                 }
//             }

//             const ruleDataToSend = {
//                 ruleName: values.ruleName?.trim() || '',
//                 ruleType: values.ruleType || 'EVENT',
//                 category: values.category || 'GENERAL',
//                 isManualTrigger: isManualTrigger,
//                 sourceTable: values.ruleType === 'EVENT' ? (values.sourceTable?.trim() || null) : null,
//                 triggerField: values.ruleType === 'EVENT' ? (values.triggerField?.trim() || null) : null,
//                 triggerValue: values.ruleType === 'EVENT' ? (values.triggerValue?.trim() || null) : null,
//                 timingType: values.timingType || 'IMMEDIATE',
//                 daysOffset: values.timingType === 'DAYS_OFFSET' ? (values.daysOffset || 1) : null,
//                 fixedTime: formattedFixedTime,
//                 cronExpression: formattedCronExpression,
//                 titleTemplate: values.titleTemplate?.trim() || '',
//                 messageTemplate: values.messageTemplate?.trim() || '',
//                 dataTemplate: values.dataTemplate?.trim() || null,
//                 targetType: values.targetType || 'ALL',
//                 targetFilter: targetFilterString,
//                 isBatch: values.isBatch ?? true,
//                 priority: parseInt(values.priority) || 2,
//                 isActive: values.isActive ?? true,
//                 createdBy: currentUserId
//             };

//             if (isEditMode) {
//                 await updateRule({ id, ...ruleDataToSend }).unwrap();
//                 showSnackbar('Rule updated successfully!', 'success');
//                 refetch();
//             } else {
//                 await createRule(ruleDataToSend).unwrap();
//                 showSnackbar('Rule created successfully!', 'success');
//             }

//             setTimeout(() => {
//                 navigate('/dashboard/notification-rules');
//             }, 1500);

//         } catch (error) {
//             let errorMessage = 'Failed to save rule. Please check your inputs.';
            
//             if (error.data?.errors) {
//                 const validationErrors = [];
//                 Object.keys(error.data.errors).forEach(key => {
//                     if (Array.isArray(error.data.errors[key])) {
//                         validationErrors.push(...error.data.errors[key]);
//                     }
//                 });
//                 errorMessage = validationErrors.join(', ');
//             } else if (error.data?.message) {
//                 errorMessage = error.data.message;
//             } else if (error.status === 400) {
//                 errorMessage = 'Bad request. Please check fixedTime format (HH:mm:ss) and other fields.';
//             }
            
//             showSnackbar(errorMessage, 'error');
//         } finally {
//             setIsSubmitting(false);
//             formikSetSubmitting(false);
//         }
//     };

//     const handleTestRule = async (ruleId) => {
//         if (!ruleId) {
//             showSnackbar('Please save the rule first before testing.', 'warning');
//             return;
//         }

//         try {
//             const testUserId = getCurrentUserId();
//             await testRule({ id: ruleId, testData: { testUserID: testUserId } }).unwrap();
//             showSnackbar('Rule test executed successfully!', 'success');
//         } catch (error) {
//             showSnackbar(error.data?.message || 'Test failed.', 'error');
//         }
//     };

//     const handleExecuteRule = async (ruleId) => {
//         if (!ruleId) {
//             showSnackbar('Please save the rule first before executing.', 'warning');
//             return;
//         }

//         try {
//             await executeRule(ruleId).unwrap();
//             showSnackbar('Rule executed successfully!', 'success');
//         } catch (error) {
//             showSnackbar(error.data?.message || 'Execution failed.', 'error');
//         }
//     };

//     const insertVariableAtCursor = (variable, setFieldValue, values, fieldName, quillRef) => {
//         const variableText = `{${variable}}`;
        
//         if (quillRef && quillRef.current) {
//             try {
//                 const quill = quillRef.current.getEditor();
//                 const range = quill.getSelection();
                
//                 if (range) {
//                     quill.insertText(range.index, variableText);
//                     quill.setSelection(range.index + variableText.length, 0);
//                     const newContent = quill.root.innerHTML;
//                     setFieldValue(fieldName, newContent);
//                 } else {
//                     const currentContent = values[fieldName] || '';
//                     const newContent = currentContent + variableText;
//                     setFieldValue(fieldName, newContent);
//                     if (quill) {
//                         quill.root.innerHTML = newContent;
//                     }
//                 }
//             } catch (error) {
//                 const currentContent = values[fieldName] || '';
//                 setFieldValue(fieldName, currentContent + variableText);
//             }
//         } else {
//             const currentValue = values[fieldName] || '';
//             setFieldValue(fieldName, currentValue + variableText);
//         }
        
//         showSnackbar(`Added {${variable}} to ${fieldName === 'titleTemplate' ? 'Title' : fieldName === 'messageTemplate' ? 'Message' : 'Data'}`, 'info');
//     };

//     const isStepValid = (values, errors, step) => {
//         switch (step) {
//             case 0:
//                 return values.ruleName && values.ruleType && values.category;
//             case 1:
//                 if (!values.timingType) return false;
//                 if (values.timingType === 'FIXED_TIME' && !values.fixedTime) return false;
//                 if (values.timingType === 'DAYS_OFFSET' && (!values.daysOffset || values.daysOffset < 1)) return false;
//                 if (values.timingType === 'CRON' && !values.cronExpression) return false;
//                 return true;
//             case 2:
//                 return values.targetType;
//             case 3:
//                 return values.titleTemplate && values.messageTemplate;
//             case 4:
//                 return values.priority;
//             default:
//                 return true;
//         }
//     };

//     const renderTimingConfiguration = (values, handleChange, setFieldValue) => {
//         const timingType = values.timingType || 'IMMEDIATE';

//         return (
//             <Box sx={{ mt: 2 }}>
//                 <Box sx={{ mb: 3 }}>
//                     <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mb: 1 }}>
//                         Select Timing Type
//                     </Typography>
//                     <FormControl fullWidth>
//                         <InputLabel>Timing Type *</InputLabel>
//                         <Select
//                             name="timingType"
//                             value={values.timingType}
//                             onChange={handleChange}
//                             label="Timing Type *"
//                             disabled={isLoading}
//                         >
//                             {timingTypes.map((type) => (
//                                 <MenuItem key={type.value} value={type.value}>
//                                     <Box display="flex" alignItems="center" gap={1}>
//                                         {type.icon}
//                                         <Box>
//                                             <Typography>{type.label}</Typography>
//                                             <Typography variant="caption" color="text.secondary">
//                                                 {type.description}
//                                             </Typography>
//                                         </Box>
//                                     </Box>
//                                 </MenuItem>
//                             ))}
//                         </Select>
//                     </FormControl>
//                 </Box>

//                 {timingType === 'FIXED_TIME' && (
//                     <Box sx={{ mb: 3 }}>
//                         <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mb: 1 }}>
//                             <TimerIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: '1rem' }} />
//                             Fixed Time
//                         </Typography>
//                         <TextField
//                             fullWidth
//                             name="fixedTime"
//                             label="Select Time"
//                             type="time"
//                             value={values.fixedTime || '09:00'}
//                             onChange={handleChange}
//                             InputLabelProps={{ shrink: true }}
//                             helperText="Choose the time when notifications will be sent daily"
//                         />
//                     </Box>
//                 )}

//                 {timingType === 'DAYS_OFFSET' && (
//                     <Box sx={{ mb: 3 }}>
//                         <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mb: 1 }}>
//                             <TodayIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: '1rem' }} />
//                             Days Offset
//                         </Typography>
//                         <TextField
//                             fullWidth
//                             name="daysOffset"
//                             label="Number of Days"
//                             type="number"
//                             value={values.daysOffset || 1}
//                             onChange={handleChange}
//                             InputProps={{
//                                 endAdornment: <InputAdornment position="end">days</InputAdornment>,
//                                 inputProps: { min: 1 }
//                             }}
//                             helperText="How many days between each notification"
//                         />
//                     </Box>
//                 )}

//                 {timingType === 'CRON' && (
//                     <Box sx={{ mb: 3 }}>
//                         <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mb: 1 }}>
//                             <ScheduleIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: '1rem' }} />
//                             Cron Expression
//                         </Typography>
//                         <TextField
//                             fullWidth
//                             name="cronExpression"
//                             label="Cron Expression"
//                             value={values.cronExpression || '0 9 * * *'}
//                             onChange={handleChange}
//                             helperText="Format: minute hour day month day-of-week (e.g., 0 9 * * * for daily at 9 AM)"
//                             placeholder="0 9 * * *"
//                         />
//                         <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
//                             Examples: "0 9 * * *" = Daily at 9 AM, "0 9 */3 * *" = Every 3 days at 9 AM
//                         </Typography>
//                     </Box>
//                 )}

//                 {(timingType === 'DAILY' || timingType === 'WEEKLY' || timingType === 'MONTHLY') && (
//                     <Box sx={{ mb: 3 }}>
//                         <Alert severity="info" icon={<InfoIcon />}>
//                             <Typography variant="body2">
//                                 This rule will run {timingType.toLowerCase()} at the scheduled time.
//                             </Typography>
//                         </Alert>
//                     </Box>
//                 )}

//                 {timingType === 'IMMEDIATE' && (
//                     <Box sx={{ mb: 3 }}>
//                         <Alert severity="info" icon={<AccessTimeIcon />}>
//                             <Typography variant="body2">
//                                 Notifications will be sent immediately when the rule is triggered.
//                             </Typography>
//                         </Alert>
//                     </Box>
//                 )}
//             </Box>
//         );
//     };

//     const prepareInitialValues = () => {
//         if (isEditMode && ruleData?.data) {
//             const rule = ruleData.data;
//             let targetFilterValue = '{}';
            
//             if (rule.targetFilter) {
//                 if (typeof rule.targetFilter === 'string') {
//                     try {
//                         const parsed = JSON.parse(rule.targetFilter);
//                         targetFilterValue = JSON.stringify(parsed, null, 2);
//                     } catch {
//                         targetFilterValue = rule.targetFilter;
//                     }
//                 } else if (typeof rule.targetFilter === 'object') {
//                     targetFilterValue = JSON.stringify(rule.targetFilter, null, 2);
//                 }
//             }
            
//             return {
//                 ruleName: rule.ruleName || '',
//                 ruleType: rule.ruleType || 'CRON',
//                 category: rule.category || 'FEE',
//                 sourceTable: rule.sourceTable || '',
//                 triggerField: rule.triggerField || '',
//                 triggerValue: rule.triggerValue || '',
//                 timingType: rule.timingType || 'DAILY',
//                 fixedTime: rule.fixedTime ? formatTimeForInput(rule.fixedTime) : '09:00',
//                 daysOffset: rule.daysOffset || 1,
//                 cronExpression: rule.cronExpression || '0 9 * * *',
//                 titleTemplate: rule.titleTemplate || '',
//                 messageTemplate: rule.messageTemplate || '',
//                 dataTemplate: rule.dataTemplate || '',
//                 targetType: rule.targetType || 'PARENTS',
//                 targetFilter: targetFilterValue,
//                 isActive: rule.isActive ?? true,
//                 isBatch: rule.isBatch ?? true,
//                 priority: rule.priority || 2,
//                 createdBy: rule.createdBy || getCurrentUserId(),
//             };
//         }
//         return getInitialValues({ id: getCurrentUserId() });
//     };

//     const isLoading = loadingRule || creating || updating || isSubmitting || uploadingImage;

//     if (!isAdmin() && !isManager() && !isTeacher()) {
//         return (
//             <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
//                 <Alert severity="error">Access Denied - Notification rule management is only available to authorized users.</Alert>
//             </Box>
//         );
//     }

//     if (loadingRule && isEditMode) {
//         return (
//             <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
//                 <CircularProgress size={60} />
//                 <Typography sx={{ mt: 3 }}>Loading rule...</Typography>
//             </Box>
//         );
//     }

//     return (
//         <Box sx={{ maxWidth: 1400, margin: '0 auto', p: { xs: 2, md: 3 } }}>
//             <Box sx={{ mb: 4 }}>
//                 <Typography variant="h4" gutterBottom>
//                     {isEditMode ? 'Edit Notification Rule' : 'Create Notification Rule'}
//                 </Typography>
//                 <Typography variant="body1" color="text.secondary">
//                     {isEditMode ? 'Modify your notification rule settings' : 'Define a new notification rule with complete flexibility'}
//                 </Typography>
//             </Box>

//             <Paper sx={{ p: 3, mb: 4 }}>
//                 <Stepper activeStep={activeStep} alternativeLabel>
//                     {steps.map((step, index) => (
//                         <Step key={step.label}>
//                             <StepLabel StepIconComponent={() => step.icon}>
//                                 {step.label}
//                             </StepLabel>
//                         </Step>
//                     ))}
//                 </Stepper>
//             </Paper>

//             <Formik
//                 initialValues={prepareInitialValues()}
//                 validationSchema={validationSchema}
//                 onSubmit={handleSubmit}
//                 enableReinitialize={true}
//                 validateOnMount={true}
//                 validateOnChange={true}
//                 validateOnBlur={true}
//             >
//                 {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isValid, setValues }) => (
//                     <Form>
//                         <Grid container spacing={3}>
//                             <Grid item xs={12} lg={8}>
//                                 <Card>
//                                     <CardContent>
//                                         {/* Step 0: Basic Info */}
//                                         {activeStep === 0 && (
//                                             <Box>
//                                                 <Typography variant="h6" gutterBottom>
//                                                     <InfoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
//                                                     Basic Information
//                                                 </Typography>
//                                                 <Grid container spacing={3}>
//                                                     <Grid item xs={12}>
//                                                         <TextField
//                                                             fullWidth
//                                                             name="ruleName"
//                                                             label="Rule Name *"
//                                                             value={values.ruleName}
//                                                             onChange={handleChange}
//                                                             onBlur={handleBlur}
//                                                             error={touched.ruleName && Boolean(errors.ruleName)}
//                                                             helperText={touched.ruleName && errors.ruleName || "Enter a descriptive name for this rule"}
//                                                             placeholder="e.g., Daily Fee Reminder"
//                                                             disabled={isLoading}
//                                                         />
//                                                     </Grid>
//                                                     <Grid item xs={12} md={6}>
//                                                         <FormControl fullWidth error={touched.ruleType && Boolean(errors.ruleType)}>
//                                                             <InputLabel>Rule Type *</InputLabel>
//                                                             <Select
//                                                                 name="ruleType"
//                                                                 value={values.ruleType}
//                                                                 onChange={handleChange}
//                                                                 onBlur={handleBlur}
//                                                                 label="Rule Type *"
//                                                                 disabled={isLoading}
//                                                             >
//                                                                 {ruleTypes.map((type) => (
//                                                                     <MenuItem key={type.value} value={type.value}>
//                                                                         <Box display="flex" alignItems="center" gap={1}>
//                                                                             {type.icon}
//                                                                             <Box>
//                                                                                 <Typography>{type.label}</Typography>
//                                                                                 <Typography variant="caption" color="text.secondary">
//                                                                                     {type.description}
//                                                                                 </Typography>
//                                                                             </Box>
//                                                                         </Box>
//                                                                     </MenuItem>
//                                                                 ))}
//                                                             </Select>
//                                                             {touched.ruleType && errors.ruleType && (
//                                                                 <FormHelperText>{errors.ruleType}</FormHelperText>
//                                                             )}
//                                                         </FormControl>
//                                                     </Grid>
//                                                     <Grid item xs={12} md={6}>
//                                                         <FormControl fullWidth error={touched.category && Boolean(errors.category)}>
//                                                             <InputLabel>Category *</InputLabel>
//                                                             <Select
//                                                                 name="category"
//                                                                 value={values.category}
//                                                                 onChange={handleChange}
//                                                                 onBlur={handleBlur}
//                                                                 label="Category *"
//                                                                 disabled={isLoading}
//                                                             >
//                                                                 {categories.map((cat) => (
//                                                                     <MenuItem key={cat.value} value={cat.value}>
//                                                                         <Box display="flex" alignItems="center" gap={1}>
//                                                                             <Chip
//                                                                                 label={cat.label}
//                                                                                 size="small"
//                                                                                 color={cat.color}
//                                                                                 icon={cat.icon}
//                                                                             />
//                                                                             <Box>
//                                                                                 <Typography>{cat.label}</Typography>
//                                                                                 <Typography variant="caption" color="text.secondary">
//                                                                                     {cat.description}
//                                                                                 </Typography>
//                                                                             </Box>
//                                                                         </Box>
//                                                                     </MenuItem>
//                                                                 ))}
//                                                             </Select>
//                                                             {touched.category && errors.category && (
//                                                                 <FormHelperText>{errors.category}</FormHelperText>
//                                                             )}
//                                                         </FormControl>
//                                                     </Grid>
//                                                     <Grid item xs={12}>
//                                                         <FormControlLabel
//                                                             control={
//                                                                 <Switch
//                                                                     name="isActive"
//                                                                     checked={values.isActive}
//                                                                     onChange={handleChange}
//                                                                     color="success"
//                                                                     disabled={isLoading}
//                                                                 />
//                                                             }
//                                                             label={
//                                                                 <Box display="flex" alignItems="center" gap={1}>
//                                                                     {values.isActive ? (
//                                                                         <CheckCircleIcon color="success" fontSize="small" />
//                                                                     ) : (
//                                                                         <ErrorIcon color="action" fontSize="small" />
//                                                                     )}
//                                                                     <Typography>
//                                                                         {values.isActive ? 'Rule is active' : 'Rule is inactive'}
//                                                                     </Typography>
//                                                                 </Box>
//                                                             }
//                                                         />
//                                                     </Grid>
//                                                 </Grid>
//                                             </Box>
//                                         )}

//                                         {/* Step 1: Schedule & Timing */}
//                                         {activeStep === 1 && (
//                                             <Box>
//                                                 <Typography variant="h6" gutterBottom>
//                                                     <ScheduleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
//                                                     Schedule & Timing Configuration
//                                                 </Typography>
//                                                 <Divider sx={{ mb: 3 }} />
//                                                 {renderTimingConfiguration(values, handleChange, setFieldValue)}
//                                             </Box>
//                                         )}

//                                         {/* Step 2: Target & Filters */}
//                                         {activeStep === 2 && (
//                                             <Box>
//                                                 <Typography variant="h6" gutterBottom>
//                                                     <FilterListIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
//                                                     Target & Filter Configuration
//                                                 </Typography>
//                                                 <Divider sx={{ mb: 3 }} />
                                                
//                                                 <Grid container spacing={3}>
//                                                     <Grid item xs={12}>
//                                                         <FormControl fullWidth error={touched.targetType && Boolean(errors.targetType)}>
//                                                             <InputLabel>Target Type *</InputLabel>
//                                                             <Select
//                                                                 name="targetType"
//                                                                 value={values.targetType}
//                                                                 onChange={(e) => {
//                                                                     handleChange(e);
//                                                                     setFieldValue('targetFilter', '{}');
//                                                                 }}
//                                                                 onBlur={handleBlur}
//                                                                 label="Target Type *"
//                                                                 disabled={isLoading}
//                                                             >
//                                                                 {targetTypes.map((type) => (
//                                                                     <MenuItem key={type.value} value={type.value}>
//                                                                         <Box display="flex" alignItems="center" gap={1}>
//                                                                             {type.icon}
//                                                                             <Typography>{type.label}</Typography>
//                                                                         </Box>
//                                                                     </MenuItem>
//                                                                 ))}
//                                                             </Select>
//                                                             {touched.targetType && errors.targetType && (
//                                                                 <FormHelperText>{errors.targetType}</FormHelperText>
//                                                             )}
//                                                         </FormControl>
//                                                     </Grid>

//                                                     {(values.targetType === 'CLASS' || 
//                                                       values.targetType === 'SECTION' || 
//                                                       values.targetType === 'SPECIFIC_USERS' ||
//                                                       values.targetType === 'SPECIFIC_STUDENTS_DIRECT') && (
//                                                         <Grid item xs={12}>
//                                                             <Paper sx={{ p: 3, bgcolor: '#f5f5f5', mt: 2 }}>
//                                                                 <Typography variant="subtitle1" gutterBottom>
//                                                                     Configure Target Filters
//                                                                 </Typography>
//                                                                 <TargetFilterBuilder
//                                                                     value={values.targetFilter}
//                                                                     onChange={(newFilter) => setFieldValue('targetFilter', newFilter)}
//                                                                     category={values.category}
//                                                                     targetType={values.targetType}
//                                                                     disabled={isLoading}
//                                                                 />
//                                                             </Paper>
//                                                         </Grid>
//                                                     )}

//                                                     {values.category === 'FEE' && (
//                                                         <Grid item xs={12}>
//                                                             <Paper sx={{ p: 3, bgcolor: '#f5f5f5', mt: 2 }}>
//                                                                 <Typography variant="subtitle1" gutterBottom>
//                                                                     Fee Reminder Settings
//                                                                 </Typography>
//                                                                 <TargetFilterBuilder
//                                                                     value={values.targetFilter}
//                                                                     onChange={(newFilter) => setFieldValue('targetFilter', newFilter)}
//                                                                     category={values.category}
//                                                                     targetType={values.targetType}
//                                                                     disabled={isLoading}
//                                                                 />
//                                                             </Paper>
//                                                         </Grid>
//                                                     )}

//                                                     <Grid item xs={12}>
//                                                         <FormControlLabel
//                                                             control={
//                                                                 <Switch
//                                                                     name="isBatch"
//                                                                     checked={values.isBatch}
//                                                                     onChange={handleChange}
//                                                                     color="primary"
//                                                                     disabled={isLoading}
//                                                                 />
//                                                             }
//                                                             label={
//                                                                 <Box display="flex" alignItems="center" gap={1}>
//                                                                     <SendIcon fontSize="small" />
//                                                                     <Typography>Send as batch notification</Typography>
//                                                                     <Tooltip title="Batch notifications are processed together and can be tracked as a group">
//                                                                         <InfoIcon fontSize="small" color="action" />
//                                                                     </Tooltip>
//                                                                 </Box>
//                                                             }
//                                                         />
//                                                     </Grid>
//                                                 </Grid>
//                                             </Box>
//                                         )}

//                                         {/* Step 3: Content */}
//                                         {activeStep === 3 && quillLoaded && (
//                                             <Box>
//                                                 <Typography variant="h6" gutterBottom>
//                                                     <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
//                                                     Notification Content
//                                                 </Typography>
//                                                 <Typography variant="body2" color="text.secondary" paragraph>
//                                                     Define your notification content using variables in curly braces {'{}'}
//                                                 </Typography>

//                                                 <Paper sx={{ p: 2, mb: 3, bgcolor: '#f5f5f5' }}>
//                                                     <Typography variant="subtitle2" gutterBottom>
//                                                         Insert Variable Into:
//                                                     </Typography>
//                                                     <RadioGroup
//                                                         row
//                                                         value={selectedInsertField}
//                                                         onChange={(e) => setSelectedInsertField(e.target.value)}
//                                                     >
//                                                         <FormControlLabel
//                                                             value="titleTemplate"
//                                                             control={<Radio />}
//                                                             label={
//                                                                 <Box display="flex" alignItems="center" gap={0.5}>
//                                                                     <AssignmentIcon fontSize="small" color="primary" />
//                                                                     <Typography>Title</Typography>
//                                                                 </Box>
//                                                             }
//                                                         />
//                                                         <FormControlLabel
//                                                             value="messageTemplate"
//                                                             control={<Radio />}
//                                                             label={
//                                                                 <Box display="flex" alignItems="center" gap={0.5}>
//                                                                     <MessageIcon fontSize="small" color="secondary" />
//                                                                     <Typography>Message</Typography>
//                                                                 </Box>
//                                                             }
//                                                         />
//                                                         <FormControlLabel
//                                                             value="dataTemplate"
//                                                             control={<Radio />}
//                                                             label={
//                                                                 <Box display="flex" alignItems="center" gap={0.5}>
//                                                                     <DataIcon fontSize="small" color="success" />
//                                                                     <Typography>Data Payload</Typography>
//                                                                 </Box>
//                                                             }
//                                                         />
//                                                     </RadioGroup>
//                                                 </Paper>

//                                                 <Paper sx={{ p: 2, mb: 3, bgcolor: '#f5f5f5' }}>
//                                                     <Typography variant="subtitle2" gutterBottom>
//                                                         Available Variables for {values.category || 'General'} Notifications
//                                                     </Typography>
//                                                     <Box display="flex" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
//                                                         {sampleVariables.COMMON.map((variable) => (
//                                                             <Tooltip key={variable.name} title={`${variable.description} (Sample: ${variable.sample})`}>
//                                                                 <Chip
//                                                                     label={`{${variable.name}}`}
//                                                                     size="small"
//                                                                     onClick={() => insertVariableAtCursor(
//                                                                         variable.name,
//                                                                         setFieldValue,
//                                                                         values,
//                                                                         selectedInsertField,
//                                                                         selectedInsertField === 'titleTemplate' ? titleQuillRef : 
//                                                                         selectedInsertField === 'messageTemplate' ? messageQuillRef : null
//                                                                     )}
//                                                                     variant="outlined"
//                                                                     sx={{ cursor: 'pointer' }}
//                                                                 />
//                                                             </Tooltip>
//                                                         ))}
//                                                         {sampleVariables[values.category]?.map((variable) => (
//                                                             <Tooltip key={variable.name} title={`${variable.description} (Sample: ${variable.sample})`}>
//                                                                 <Chip
//                                                                     label={`{${variable.name}}`}
//                                                                     size="small"
//                                                                     color="primary"
//                                                                     onClick={() => insertVariableAtCursor(
//                                                                         variable.name,
//                                                                         setFieldValue,
//                                                                         values,
//                                                                         selectedInsertField,
//                                                                         selectedInsertField === 'titleTemplate' ? titleQuillRef : 
//                                                                         selectedInsertField === 'messageTemplate' ? messageQuillRef : null
//                                                                     )}
//                                                                     sx={{ cursor: 'pointer' }}
//                                                                 />
//                                                             </Tooltip>
//                                                         ))}
//                                                     </Box>
//                                                 </Paper>

//                                                 <Grid container spacing={3}>
//                                                     {/* Title Template */}
//                                                     <Grid item xs={12}>
//                                                         <Box>
//                                                             <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
//                                                                 <Typography variant="subtitle2">
//                                                                     Title Template *
//                                                                 </Typography>
//                                                                 <Typography variant="caption" color={getPlainTextLength(values.titleTemplate) > 200 ? "error" : "text.secondary"}>
//                                                                     {getPlainTextLength(values.titleTemplate)}/200 characters
//                                                                 </Typography>
//                                                             </Box>
//                                                             <Box
//                                                                 sx={{
//                                                                     borderLeft: selectedInsertField === 'titleTemplate' ? '4px solid' : 'none',
//                                                                     borderLeftColor: 'primary.main',
//                                                                     pl: selectedInsertField === 'titleTemplate' ? 1 : 0,
//                                                                     '& .ql-container': {
//                                                                         minHeight: '80px',
//                                                                         fontFamily: 'inherit',
//                                                                     },
//                                                                     '& .ql-editor': {
//                                                                         minHeight: '80px',
//                                                                         fontSize: '1rem',
//                                                                     },
//                                                                     '& .ql-toolbar': {
//                                                                         borderTopLeftRadius: '4px',
//                                                                         borderTopRightRadius: '4px',
//                                                                     },
//                                                                     '& .ql-container': {
//                                                                         borderBottomLeftRadius: '4px',
//                                                                         borderBottomRightRadius: '4px',
//                                                                     }
//                                                                 }}
//                                                                 onClick={() => setSelectedInsertField('titleTemplate')}
//                                                             >
//                                                                 <QuillEditor
//                                                                     ref={titleQuillRef}
//                                                                     value={values.titleTemplate}
//                                                                     onChange={(content) => setFieldValue('titleTemplate', content)}
//                                                                     onBlur={() => handleBlur({ target: { name: 'titleTemplate' } })}
//                                                                     placeholder="Write notification title here... (Use {variables} for dynamic content)"
//                                                                     readOnly={isLoading}
//                                                                     modules={{ toolbar: messageToolbarOptions }}
//                                                                     formats={messageFormats}
//                                                                 />
//                                                             </Box>
//                                                             {touched.titleTemplate && errors.titleTemplate && (
//                                                                 <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
//                                                                     {errors.titleTemplate}
//                                                                 </Typography>
//                                                             )}
//                                                         </Box>
//                                                     </Grid>

//                                                     {/* Message Template */}
//                                                     <Grid item xs={12}>
//                                                         <Box>
//                                                             <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
//                                                                 <Typography variant="subtitle2">
//                                                                     Message Template *
//                                                                 </Typography>
//                                                                 <Typography variant="caption" color={getPlainTextLength(values.messageTemplate) > 1000 ? "error" : "text.secondary"}>
//                                                                     {getPlainTextLength(values.messageTemplate)}/1000 characters
//                                                                 </Typography>
//                                                             </Box>
//                                                             <Box
//                                                                 sx={{
//                                                                     borderLeft: selectedInsertField === 'messageTemplate' ? '4px solid' : 'none',
//                                                                     borderLeftColor: 'secondary.main',
//                                                                     pl: selectedInsertField === 'messageTemplate' ? 1 : 0,
//                                                                     '& .ql-container': {
//                                                                         minHeight: '200px',
//                                                                         fontFamily: 'inherit',
//                                                                     },
//                                                                     '& .ql-editor': {
//                                                                         minHeight: '200px',
//                                                                         fontSize: '1rem',
//                                                                     },
//                                                                     '& .ql-toolbar': {
//                                                                         borderTopLeftRadius: '4px',
//                                                                         borderTopRightRadius: '4px',
//                                                                     },
//                                                                     '& .ql-container': {
//                                                                         borderBottomLeftRadius: '4px',
//                                                                         borderBottomRightRadius: '4px',
//                                                                     }
//                                                                 }}
//                                                                 onClick={() => setSelectedInsertField('messageTemplate')}
//                                                             >
//                                                                 <QuillEditor
//                                                                     ref={messageQuillRef}
//                                                                     value={values.messageTemplate}
//                                                                     onChange={(content) => setFieldValue('messageTemplate', content)}
//                                                                     onBlur={() => handleBlur({ target: { name: 'messageTemplate' } })}
//                                                                     placeholder="Write your notification message here. Use the toolbar to format text and {variables} for dynamic content..."
//                                                                     readOnly={isLoading}
//                                                                     modules={{ toolbar: messageToolbarOptions }}
//                                                                     formats={messageFormats}
//                                                                 />
//                                                             </Box>
//                                                             {touched.messageTemplate && errors.messageTemplate && (
//                                                                 <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
//                                                                     {errors.messageTemplate}
//                                                                 </Typography>
//                                                             )}
//                                                         </Box>
//                                                     </Grid>

//                                                     {/* Data Template */}
//                                                     <Grid item xs={12}>
//                                                         <TextField
//                                                             fullWidth
//                                                             name="dataTemplate"
//                                                             label="Data Template (JSON - Optional)"
//                                                             value={values.dataTemplate || ''}
//                                                             onChange={handleChange}
//                                                             onBlur={handleBlur}
//                                                             helperText="Additional data in JSON format for mobile apps"
//                                                             multiline
//                                                             rows={4}
//                                                             placeholder='{"action": "view_details", "id": "{ID}"}'
//                                                             disabled={isLoading}
//                                                             inputRef={dataRef}
//                                                             InputProps={{
//                                                                 style: { fontFamily: 'monospace', fontSize: '0.875rem' },
//                                                                 sx: {
//                                                                     borderLeft: selectedInsertField === 'dataTemplate' ? '4px solid' : 'none',
//                                                                     borderLeftColor: 'success.main',
//                                                                     pl: selectedInsertField === 'dataTemplate' ? 1 : 0
//                                                                 }
//                                                             }}
//                                                             onClick={() => setSelectedInsertField('dataTemplate')}
//                                                         />
//                                                     </Grid>
//                                                 </Grid>

//                                                 <Paper sx={{ p: 3, mt: 3, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
//                                                     <Typography variant="subtitle2" gutterBottom color="primary">
//                                                         Live Preview
//                                                     </Typography>
//                                                     <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1 }}>
//                                                         <Typography variant="subtitle1" gutterBottom fontWeight="bold">
//                                                             <div dangerouslySetInnerHTML={{ __html: values.titleTemplate || 'Title will appear here' }} />
//                                                         </Typography>
//                                                         <Box sx={{ whiteSpace: 'pre-line' }}>
//                                                             <div dangerouslySetInnerHTML={{ __html: values.messageTemplate || 'Message will appear here' }} />
//                                                         </Box>
//                                                         {values.dataTemplate && (
//                                                             <Box sx={{ mt: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
//                                                                 <Typography variant="caption" color="text.secondary">
//                                                                     Data Payload:
//                                                                 </Typography>
//                                                                 <pre style={{ margin: 0, fontSize: '0.75rem', overflowX: 'auto' }}>
//                                                                     {values.dataTemplate}
//                                                                 </pre>
//                                                             </Box>
//                                                         )}
//                                                     </Box>
//                                                 </Paper>
//                                             </Box>
//                                         )}

//                                         {/* Step 4: Advanced */}
//                                         {activeStep === 4 && (
//                                             <Box>
//                                                 <Typography variant="h6" gutterBottom>
//                                                     <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
//                                                     Advanced Settings
//                                                 </Typography>
//                                                 <Divider sx={{ mb: 3 }} />
//                                                 <Grid container spacing={3}>
//                                                     <Grid item xs={12} md={6}>
//                                                         <FormControl fullWidth error={touched.priority && Boolean(errors.priority)}>
//                                                             <InputLabel>Priority *</InputLabel>
//                                                             <Select
//                                                                 name="priority"
//                                                                 value={values.priority || 2}
//                                                                 onChange={handleChange}
//                                                                 onBlur={handleBlur}
//                                                                 label="Priority *"
//                                                                 disabled={isLoading}
//                                                             >
//                                                                 {priorities.map((priority) => (
//                                                                     <MenuItem key={priority.value} value={priority.value}>
//                                                                         <Box display="flex" alignItems="center" gap={1}>
//                                                                             <Chip
//                                                                                 label={priority.label}
//                                                                                 size="small"
//                                                                                 color={priority.color}
//                                                                             />
//                                                                             <Box>
//                                                                                 <Typography>Priority {priority.value}</Typography>
//                                                                                 <Typography variant="caption" color="text.secondary">
//                                                                                     {priority.description}
//                                                                                 </Typography>
//                                                                             </Box>
//                                                                         </Box>
//                                                                     </MenuItem>
//                                                                 ))}
//                                                             </Select>
//                                                             {touched.priority && errors.priority && (
//                                                                 <FormHelperText>{errors.priority}</FormHelperText>
//                                                             )}
//                                                         </FormControl>
//                                                     </Grid>

//                                                     <Grid item xs={12} md={6}>
//                                                         <TextField
//                                                             fullWidth
//                                                             name="createdBy"
//                                                             label="Created By"
//                                                             value={getCurrentUserId()}
//                                                             disabled
//                                                             helperText="Your user ID (automatically assigned)"
//                                                         />
//                                                     </Grid>

//                                                     {values.ruleType === 'EVENT' && (
//                                                         <>
//                                                             <Grid item xs={12} md={6}>
//                                                                 <TextField
//                                                                     fullWidth
//                                                                     name="sourceTable"
//                                                                     label="Source Table"
//                                                                     value={values.sourceTable || ''}
//                                                                     onChange={handleChange}
//                                                                     onBlur={handleBlur}
//                                                                     helperText="Database table to monitor for events"
//                                                                     placeholder="e.g., tbl_FeePosting"
//                                                                     disabled={isLoading}
//                                                                 />
//                                                             </Grid>
//                                                             <Grid item xs={12} md={6}>
//                                                                 <TextField
//                                                                     fullWidth
//                                                                     name="triggerField"
//                                                                     label="Trigger Field"
//                                                                     value={values.triggerField || ''}
//                                                                     onChange={handleChange}
//                                                                     onBlur={handleBlur}
//                                                                     helperText="Field to monitor for changes"
//                                                                     placeholder="e.g., Status"
//                                                                     disabled={isLoading}
//                                                                 />
//                                                             </Grid>
//                                                             <Grid item xs={12}>
//                                                                 <TextField
//                                                                     fullWidth
//                                                                     name="triggerValue"
//                                                                     label="Trigger Value"
//                                                                     value={values.triggerValue || ''}
//                                                                     onChange={handleChange}
//                                                                     onBlur={handleBlur}
//                                                                     helperText="Value that triggers the notification"
//                                                                     placeholder="e.g., POSTED"
//                                                                     disabled={isLoading}
//                                                                 />
//                                                             </Grid>
//                                                         </>
//                                                     )}

//                                                     <Grid item xs={12}>
//                                                         <Alert severity="info" icon={<InfoIcon />}>
//                                                             <Typography variant="body2">
//                                                                 <strong>Rule Summary:</strong> This rule will run{' '}
//                                                                 {values.timingType === 'IMMEDIATE' ? 'immediately when triggered' :
//                                                                  values.timingType === 'FIXED_TIME' ? `daily at ${values.fixedTime}` :
//                                                                  values.timingType === 'DAYS_OFFSET' ? `every ${values.daysOffset} days` :
//                                                                  values.timingType === 'CRON' ? `according to cron schedule: ${values.cronExpression}` :
//                                                                  values.timingType?.toLowerCase()}.
//                                                             </Typography>
//                                                             <Typography variant="body2" sx={{ mt: 1 }}>
//                                                                 <strong>Target:</strong> {targetTypes.find(t => t.value === values.targetType)?.label || 'All Users'}
//                                                                 <br />
//                                                                 <strong>Category:</strong> {values.category}
//                                                                 <br />
//                                                                 <strong>Batch Mode:</strong> {values.isBatch ? 'Enabled' : 'Disabled'}
//                                                                 <br />
//                                                                 <strong>Priority:</strong> {priorities.find(p => p.value === values.priority)?.label || 'Medium'} ({values.priority})
//                                                             </Typography>
//                                                         </Alert>
//                                                     </Grid>
//                                                 </Grid>
//                                             </Box>
//                                         )}

//                                         {/* Navigation Buttons */}
//                                         <Box display="flex" justifyContent="space-between" mt={4}>
//                                             <Button
//                                                 disabled={activeStep === 0 || isLoading}
//                                                 onClick={handleBack}
//                                                 startIcon={<CancelIcon />}
//                                                 variant="outlined"
//                                                 type="button"
//                                             >
//                                                 Back
//                                             </Button>
//                                             {activeStep < steps.length - 1 ? (
//                                                 <Button
//                                                     variant="contained"
//                                                     onClick={handleNext}
//                                                     disabled={isLoading || !isStepValid(values, errors, activeStep)}
//                                                     type="button"
//                                                 >
//                                                     Next Step
//                                                 </Button>
//                                             ) : (
//                                                 <Button
//                                                     type="submit"
//                                                     variant="contained"
//                                                     color="primary"
//                                                     disabled={isLoading || !isValid || isSubmitting}
//                                                     startIcon={isLoading || isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
//                                                 >
//                                                     {isLoading || isSubmitting ? 'Saving...' : (isEditMode ? 'Update Rule' : 'Create Rule')}
//                                                 </Button>
//                                             )}
//                                         </Box>
//                                     </CardContent>
//                                 </Card>
//                             </Grid>

//                             {/* Right Column - Summary */}
//                             <Grid item xs={12} lg={4}>
//                                 <Box sx={{ position: 'sticky', top: 24 }}>
//                                     <Card sx={{ mb: 2 }}>
//                                         <CardHeader title="Rule Summary" />
//                                         <CardContent>
//                                             <List disablePadding>
//                                                 <ListItem sx={{ px: 0 }}>
//                                                     <ListItemText primary="Rule Name" secondary={values.ruleName || 'Not set'} />
//                                                 </ListItem>
//                                                 <Divider sx={{ my: 1 }} />
//                                                 <ListItem sx={{ px: 0 }}>
//                                                     <ListItemText 
//                                                         primary="Type & Category" 
//                                                         secondary={
//                                                             <Box display="flex" gap={1} sx={{ mt: 0.5 }}>
//                                                                 <Chip label={values.ruleType} size="small" variant="outlined" />
//                                                                 <Chip 
//                                                                     label={values.category} 
//                                                                     size="small" 
//                                                                     color={categories.find(c => c.value === values.category)?.color || 'default'}
//                                                                 />
//                                                             </Box>
//                                                         } 
//                                                     />
//                                                 </ListItem>
//                                                 <Divider sx={{ my: 1 }} />
//                                                 <ListItem sx={{ px: 0 }}>
//                                                     <ListItemText 
//                                                         primary="Schedule" 
//                                                         secondary={
//                                                             <Typography variant="body2" sx={{ mt: 0.5 }}>
//                                                                 {values.timingType === 'IMMEDIATE' ? 'Immediate' :
//                                                                  values.timingType === 'FIXED_TIME' ? `Daily at ${values.fixedTime || '09:00'}` :
//                                                                  values.timingType === 'DAYS_OFFSET' ? `Every ${values.daysOffset || 1} days` :
//                                                                  values.timingType === 'CRON' ? `Cron: ${values.cronExpression || '0 9 * * *'}` :
//                                                                  values.timingType?.charAt(0).toUpperCase() + values.timingType?.slice(1).toLowerCase()}
//                                                             </Typography>
//                                                         } 
//                                                     />
//                                                 </ListItem>
//                                                 <Divider sx={{ my: 1 }} />
//                                                 <ListItem sx={{ px: 0 }}>
//                                                     <ListItemText 
//                                                         primary="Status" 
//                                                         secondary={
//                                                             <Box display="flex" alignItems="center" gap={1} sx={{ mt: 0.5 }}>
//                                                                 <Chip 
//                                                                     label={values.isActive ? 'Active' : 'Inactive'} 
//                                                                     size="small" 
//                                                                     color={values.isActive ? 'success' : 'error'} 
//                                                                 />
//                                                                 {values.isBatch && (
//                                                                     <Chip label="Batch" size="small" variant="outlined" color="primary" />
//                                                                 )}
//                                                             </Box>
//                                                         } 
//                                                     />
//                                                 </ListItem>
//                                                 <Divider sx={{ my: 1 }} />
//                                                 <ListItem sx={{ px: 0 }}>
//                                                     <ListItemText 
//                                                         primary="Priority" 
//                                                         secondary={
//                                                             <Chip 
//                                                                 label={`${priorities.find(p => p.value === values.priority)?.label || 'Medium'} (${values.priority})`} 
//                                                                 size="small" 
//                                                                 color={priorities.find(p => p.value === values.priority)?.color}
//                                                                 sx={{ mt: 0.5 }}
//                                                             />
//                                                         } 
//                                                     />
//                                                 </ListItem>
//                                                 <Divider sx={{ my: 1 }} />
//                                                 <ListItem sx={{ px: 0 }}>
//                                                     <ListItemText 
//                                                         primary="Target" 
//                                                         secondary={
//                                                             <Typography variant="body2" sx={{ mt: 0.5 }}>
//                                                                 {targetTypes.find(t => t.value === values.targetType)?.label || 'All Users'}
//                                                             </Typography>
//                                                         } 
//                                                     />
//                                                 </ListItem>
//                                             </List>

//                                             {isEditMode && id && (
//                                                 <Box mt={2} display="flex" flexDirection="column" gap={1}>
//                                                     <Button
//                                                         variant="outlined"
//                                                         fullWidth
//                                                         size="small"
//                                                         onClick={() => handleTestRule(id)}
//                                                         disabled={testing || isLoading}
//                                                         startIcon={testing ? <CircularProgress size={16} /> : <SendIcon />}
//                                                         color="primary"
//                                                         type="button"
//                                                     >
//                                                         {testing ? 'Testing...' : 'Test Rule'}
//                                                     </Button>
//                                                     <Button
//                                                         variant="outlined"
//                                                         fullWidth
//                                                         size="small"
//                                                         onClick={() => handleExecuteRule(id)}
//                                                         disabled={executing || isLoading}
//                                                         startIcon={executing ? <CircularProgress size={16} /> : <PlayArrowIcon />}
//                                                         color="secondary"
//                                                         type="button"
//                                                     >
//                                                         {executing ? 'Executing...' : 'Execute Rule Now'}
//                                                     </Button>
//                                                     <Alert severity="warning" sx={{ mt: 0.5, py: 0 }}>
//                                                         <Typography variant="caption">Executing will run the rule immediately.</Typography>
//                                                     </Alert>
//                                                 </Box>
//                                             )}

//                                             <Button
//                                                 variant="outlined"
//                                                 fullWidth
//                                                 size="small"
//                                                 onClick={() => navigate('/dashboard/notification-rules')}
//                                                 startIcon={<CancelIcon />}
//                                                 disabled={isLoading}
//                                                 type="button"
//                                                 sx={{ mt: 2 }}
//                                             >
//                                                 Cancel
//                                             </Button>
//                                         </CardContent>
//                                     </Card>

//                                     <Card>
//                                         <CardHeader title="Quick Start" avatar={<AddIcon color="primary" />} />
//                                         <CardContent>
//                                             <Button
//                                                 variant="contained"
//                                                 fullWidth
//                                                 size="small"
//                                                 startIcon={<AddIcon />}
//                                                 onClick={() => setShowTemplateDialog(true)}
//                                                 type="button"
//                                             >
//                                                 Use Template
//                                             </Button>
//                                             <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
//                                                 Start quickly with pre-configured templates.
//                                             </Typography>
//                                         </CardContent>
//                                     </Card>

//                                     <Card sx={{ mt: 2 }}>
//                                         <CardHeader title="Setup Progress" />
//                                         <CardContent>
//                                             <LinearProgress
//                                                 variant="determinate"
//                                                 value={(activeStep + 1) / steps.length * 100}
//                                                 sx={{ height: 6, borderRadius: 3, mb: 1 }}
//                                             />
//                                             <Typography variant="caption" color="text.secondary">
//                                                 Step {activeStep + 1} of {steps.length}
//                                             </Typography>
//                                         </CardContent>
//                                     </Card>
//                                 </Box>
//                             </Grid>
//                         </Grid>
//                     </Form>
//                 )}
//             </Formik>

//             {/* Template Dialog */}
//             <Dialog open={showTemplateDialog} onClose={() => setShowTemplateDialog(false)} maxWidth="md" fullWidth>
//                 <DialogTitle>Select Rule Template</DialogTitle>
//                 <DialogContent>
//                     <Grid container spacing={2} sx={{ mt: 1 }}>
//                         {ruleTemplates.map((template) => (
//                             <Grid item xs={12} key={template.id}>
//                                 <Card 
//                                     variant="outlined" 
//                                     sx={{ 
//                                         cursor: 'pointer', 
//                                         '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.50' } 
//                                     }}
//                                     onClick={() => {
//                                         if (setValues) handleTemplateSelect(template, setValues);
//                                     }}
//                                 >
//                                     <CardContent>
//                                         <Box display="flex" justifyContent="space-between" alignItems="flex-start">
//                                             <Box>
//                                                 <Typography variant="h6">{template.name}</Typography>
//                                                 <Typography variant="body2" color="text.secondary">{template.description}</Typography>
//                                                 <Box display="flex" gap={1} mt={1}>
//                                                     <Chip label={template.category} size="small" variant="outlined" />
//                                                     <Chip label={`Priority ${template.priority}`} size="small" variant="outlined" />
//                                                 </Box>
//                                             </Box>
//                                             <Button variant="contained" size="small">
//                                                 Use Template
//                                             </Button>
//                                         </Box>
//                                         <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
//                                             Schedule: {template.timingType === 'FIXED_TIME' ? `Daily at ${template.fixedTime}` :
//                                                        template.timingType === 'DAYS_OFFSET' ? `Every ${template.daysOffset} days` :
//                                                        template.timingType}
//                                         </Typography>
//                                     </CardContent>
//                                 </Card>
//                             </Grid>
//                         ))}
//                     </Grid>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setShowTemplateDialog(false)}>Cancel</Button>
//                 </DialogActions>
//             </Dialog>

//             {/* Snackbar for notifications */}
//             <Snackbar 
//                 open={snackbar.open} 
//                 autoHideDuration={6000} 
//                 onClose={handleCloseSnackbar} 
//                 anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//             >
//                 <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
//                     {snackbar.message}
//                 </Alert>
//             </Snackbar>
//         </Box>
//     );
// };

// export default NotificationRuleForm;
import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    FormControl,
    FormControlLabel,
    Grid,
    MenuItem,
    Switch,
    TextField,
    Typography,
    Chip,
    IconButton,
    Divider,
    Alert,
    Stepper,
    Step,
    StepLabel,
    Paper,
    InputAdornment,
    Tooltip,
    CircularProgress,
    Select,
    InputLabel,
    FormHelperText,
    Snackbar,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    Tabs,
    Tab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Radio,
    RadioGroup,
} from '@mui/material';
import {
    Add as AddIcon,
    Info as InfoIcon,
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
    Send as SendIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Refresh as RefreshIcon,
    PlayArrow as PlayArrowIcon,
    Schedule as ScheduleIcon,
    Payment as PaymentIcon,
    AccountBalance as AccountBalanceIcon,
    School as SchoolIcon,
    Assignment as AssignmentIcon,
    Announcement as AnnouncementIcon,
    Warning as WarningIcon,
    Event as EventIcon,
    Person as PersonIcon,
    AccessTime as AccessTimeIcon,
    Timer as TimerIcon,
    Today as TodayIcon,
    CalendarToday as CalendarTodayIcon,
    ViewWeek as ViewWeekIcon,
    EventNote as EventNoteIcon,
    FilterList as FilterListIcon,
    Settings as SettingsIcon,
    Message as MessageIcon,
    DataUsage as DataIcon,
    Close as CloseIcon,
    ChildCare as ChildIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { usePermissions } from '../../../customHook/usePermissions';
import {
    useGetNotificationRuleByIdQuery,
    useCreateNotificationRuleMutation,
    useUpdateNotificationRuleMutation,
    useTestNotificationRuleMutation,
    useExecuteNotificationRuleMutation,
} from '../../../store/api/notificationApi';
import { useSelector } from 'react-redux';
import TargetFilterBuilder from '../../../component/TargetFilterBuilder';

// Dynamically import ReactQuill
const ReactQuill = lazy(() => import('react-quill'));
import 'react-quill/dist/quill.snow.css';

// Validation Schema
const validationSchema = Yup.object({
    ruleName: Yup.string()
        .required('Rule name is required')
        .max(100, 'Rule name must be less than 100 characters'),
    ruleType: Yup.string().required('Rule type is required'),
    category: Yup.string().required('Category is required'),
    titleTemplate: Yup.string()
        .required('Title template is required')
        .max(200, 'Title must be less than 200 characters'),
    messageTemplate: Yup.string()
        .required('Message template is required')
        .max(1000, 'Message must be less than 1000 characters'),
    targetType: Yup.string().required('Target type is required'),
    isActive: Yup.boolean(),
    priority: Yup.number()
        .min(1, 'Priority must be between 1-3')
        .max(3, 'Priority must be between 1-3')
        .required('Priority is required'),
    isBatch: Yup.boolean(),
    timingType: Yup.string().required('Timing type is required'),
    cronExpression: Yup.string().nullable(),
    daysOffset: Yup.number().min(0, 'Days offset must be positive').nullable(),
    fixedTime: Yup.string().nullable(),
    targetFilter: Yup.string().test(
        'json',
        'Must be valid JSON',
        (value) => {
            if (!value) return true;
            try {
                JSON.parse(value);
                return true;
            } catch {
                return false;
            }
        }
    )
});

// Initial values
const getInitialValues = (userData = null) => ({
    ruleName: '',
    ruleType: 'CRON',
    category: 'FEE',
    sourceTable: '',
    triggerField: '',
    triggerValue: '',
    timingType: 'DAILY',
    fixedTime: '09:00',
    daysOffset: 1,
    cronExpression: '0 9 * * *',
    titleTemplate: '',
    messageTemplate: '',
    dataTemplate: '',
    targetType: 'PARENTS',
    targetFilter: '{}',
    isActive: true,
    isBatch: true,
    priority: 2,
    createdBy: userData?.id || 1,
});

const steps = [
    { label: 'Basic Info', icon: <InfoIcon /> },
    { label: 'Schedule & Timing', icon: <ScheduleIcon /> },
    { label: 'Target & Filters', icon: <FilterListIcon /> },
    { label: 'Content', icon: <AssignmentIcon /> },
    { label: 'Advanced', icon: <SettingsIcon /> },
];

// Categories with icons
const categories = [
    { value: 'FEE', label: 'Fee', color: 'warning', icon: <PaymentIcon />, description: 'Fee-related notifications' },
    { value: 'ATTENDANCE', label: 'Attendance', color: 'error', icon: <AccountBalanceIcon />, description: 'Attendance notifications' },
    { value: 'EXAM', label: 'Exam', color: 'info', icon: <SchoolIcon />, description: 'Exam notifications' },
    { value: 'HOMEWORK', label: 'Homework', color: 'success', icon: <AssignmentIcon />, description: 'Homework assignments' },
    { value: 'ANNOUNCEMENT', label: 'Announcement', color: 'primary', icon: <AnnouncementIcon />, description: 'School announcements' },
    { value: 'GENERAL', label: 'General', color: 'default', icon: <InfoIcon />, description: 'General notifications' },
    { value: 'ALERT', label: 'Alert', color: 'error', icon: <WarningIcon />, description: 'Important alerts' },
    { value: 'EVENT', label: 'Event', color: 'info', icon: <EventIcon />, description: 'School events' },
];

const ruleTypes = [
    { value: 'EVENT', label: 'Event Trigger', description: 'Triggered by database events', icon: <EventIcon /> },
    { value: 'CRON', label: 'Scheduled (Cron)', description: 'Runs on a schedule', icon: <ScheduleIcon /> },
    { value: 'MANUAL', label: 'Manual', description: 'Manual trigger only', icon: <PlayArrowIcon /> },
];

const timingTypes = [
    { value: 'IMMEDIATE', label: 'Immediate', icon: <AccessTimeIcon />, description: 'Run immediately when triggered' },
    { value: 'FIXED_TIME', label: 'Fixed Time', icon: <TimerIcon />, description: 'Run at specific time each day' },
    { value: 'DAYS_OFFSET', label: 'Days Offset', icon: <TodayIcon />, description: 'Run every X days' },
    { value: 'CRON', label: 'Cron Expression', icon: <CalendarTodayIcon />, description: 'Advanced scheduling' },
    { value: 'DAILY', label: 'Daily', icon: <TodayIcon />, description: 'Run once per day' },
    { value: 'WEEKLY', label: 'Weekly', icon: <ViewWeekIcon />, description: 'Run once per week' },
    { value: 'MONTHLY', label: 'Monthly', icon: <CalendarTodayIcon />, description: 'Run once per month' },
];

const targetTypes = [
    { value: 'ALL', label: 'All Users', icon: <PersonIcon /> },
    { value: 'PARENTS', label: 'Parents Only', icon: <PersonIcon /> },
    { value: 'TEACHERS', label: 'Teachers Only', icon: <PersonIcon /> },
    { value: 'STUDENTS', label: 'Students Only', icon: <PersonIcon /> },
    { value: 'CLASS', label: 'Class Specific', icon: <SchoolIcon /> },
    { value: 'SECTION', label: 'Section Specific', icon: <SchoolIcon /> },
    { value: 'SPECIFIC_USERS', label: 'Specific Users', icon: <PersonIcon /> },
    { value: 'SPECIFIC_STUDENTS_DIRECT', label: 'Specific Students (Direct)', icon: <ChildIcon /> },
];

const priorities = [
    { value: 1, label: 'High', color: 'error', description: 'Urgent notifications' },
    { value: 2, label: 'Medium', color: 'warning', description: 'Regular reminders' },
    { value: 3, label: 'Low', color: 'info', description: 'Informational updates' },
];

// Sample variables for different categories
const sampleVariables = {
    COMMON: [
        { name: 'CurrentDate', description: 'Current date', sample: '25/01/2024' },
        { name: 'CurrentTime', description: 'Current time', sample: '14:30' },
        { name: 'RuleName', description: 'Rule name', sample: 'Fee Reminder' },
        { name: 'Category', description: 'Notification category', sample: 'FEE' },
    ],
    FEE: [
        { name: 'StudentName', description: 'Student name', sample: 'John Doe' },
        { name: 'ParentName', description: 'Parent name', sample: 'Mr. Smith' },
        { name: 'DueAmount', description: 'Due amount', sample: '5000' },
        { name: 'DueDate', description: 'Due date', sample: '31/01/2024' },
        { name: 'StatusText', description: 'Status description', sample: 'Due in 3 days' },
    ],
    ATTENDANCE: [
        { name: 'StudentName', description: 'Student name', sample: 'John Doe' },
        { name: 'Status', description: 'Attendance status', sample: 'Absent' },
        { name: 'AttendanceDate', description: 'Attendance date', sample: '25/01/2024' },
        { name: 'Remarks', description: 'Remarks', sample: 'Medical Leave' },
    ],
    EXAM: [
        { name: 'StudentName', description: 'Student name', sample: 'John Doe' },
        { name: 'ExamTitle', description: 'Exam title', sample: 'Mid Term Examination' },
        { name: 'ExamDate', description: 'Exam date', sample: '30/01/2024' },
        { name: 'Subject', description: 'Subject', sample: 'Mathematics' },
    ],
    HOMEWORK: [
        { name: 'StudentName', description: 'Student name', sample: 'John Doe' },
        { name: 'HomeworkTitle', description: 'Homework title', sample: 'Math Assignment' },
        { name: 'Subject', description: 'Subject', sample: 'Mathematics' },
        { name: 'DueDate', description: 'Due date', sample: '30/01/2024' },
    ],
};

// Rule templates
const ruleTemplates = [
    {
        id: 1,
        name: "Daily Fee Reminder",
        category: "FEE",
        description: "Send daily reminders for overdue fees",
        timingType: "DAILY",
        fixedTime: "09:00",
        titleTemplate: "Fee Payment Due: {StudentName}",
        messageTemplate: "Dear {ParentName},\nFee of Rs.{DueAmount} for {StudentName} is {StatusText}.\nDue date: {DueDate}",
        priority: 2
    },
    {
        id: 2,
        name: "Weekly Attendance Summary",
        category: "ATTENDANCE",
        description: "Weekly summary of student attendance",
        timingType: "WEEKLY",
        fixedTime: "17:00",
        titleTemplate: "Weekly Attendance Summary",
        messageTemplate: "Attendance Summary for {StudentName}\nStatus: {Status}\nDate: {AttendanceDate}",
        priority: 3
    },
    {
        id: 3,
        name: "Exam Reminder",
        category: "EXAM",
        description: "Remind students about exams",
        timingType: "DAYS_OFFSET",
        daysOffset: 3,
        titleTemplate: "Exam Reminder: {ExamTitle}",
        messageTemplate: "Dear Student,\n{ExamTitle} is scheduled on {ExamDate}.\nSubject: {Subject}",
        priority: 2
    },
];

// React-Quill toolbar configuration
const messageToolbarOptions = [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'font': [] }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'script': 'sub' }, { 'script': 'super' }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'align': [] }],
    ['blockquote', 'code-block'],
    ['link', 'image', 'video'],
    ['clean'],
    [{ 'direction': 'rtl' }],
];

const messageFormats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'indent',
    'align',
    'blockquote', 'code-block',
    'link', 'image', 'video',
    'clean',
    'direction'
];

// Helper function to strip HTML tags for character count
const stripHtmlTags = (html) => {
    if (!html) return '';
    if (typeof html !== 'string') return '';
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
};

// Get plain text length from HTML content
const getPlainTextLength = (html) => {
    if (!html || typeof html !== 'string') return 0;
    return stripHtmlTags(html).length;
};

// Quill Editor Component with proper ref forwarding
const QuillEditor = React.forwardRef(({ value, onChange, onBlur, placeholder, readOnly, modules, formats }, ref) => {
    const [isClient, setIsClient] = React.useState(false);
    
    React.useEffect(() => {
        setIsClient(true);
    }, []);
    
    if (!isClient) {
        return (
            <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <CircularProgress size={30} />
            </Box>
        );
    }
    
    return (
        <Suspense fallback={
            <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <CircularProgress size={30} />
            </Box>
        }>
            <ReactQuill
                ref={ref}
                theme="snow"
                value={value || ''}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                readOnly={readOnly}
                modules={modules}
                formats={formats}
            />
        </Suspense>
    );
});

QuillEditor.displayName = 'QuillEditor';

const NotificationRuleForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { isAdmin, isManager, isTeacher } = usePermissions();
    const isEditMode = !!id;

    const [activeStep, setActiveStep] = useState(0);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [showTemplateDialog, setShowTemplateDialog] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [selectedInsertField, setSelectedInsertField] = useState('titleTemplate');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [isClient, setIsClient] = useState(false);

    const titleQuillRef = useRef(null);
    const messageQuillRef = useRef(null);
    const dataRef = useRef();

    const authUser = useSelector((state) => state.auth.user);

    const { data: ruleData, isLoading: loadingRule, refetch } =
        useGetNotificationRuleByIdQuery(id, { skip: !isEditMode });

    const [createRule, { isLoading: creating }] = useCreateNotificationRuleMutation();
    const [updateRule, { isLoading: updating }] = useUpdateNotificationRuleMutation();
    const [testRule, { isLoading: testing }] = useTestNotificationRuleMutation();
    const [executeRule, { isLoading: executing }] = useExecuteNotificationRuleMutation();

    // Set client-side flag to avoid SSR issues
    useEffect(() => {
        setIsClient(true);
    }, []);

    const getCurrentUserId = () => {
        if (authUser?.id) return authUser.id;
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                return user.id || user.userId || 1;
            }
        } catch (error) {
            return 1;
        }
        return 1;
    };

    const formatTimeForInput = (timeSpan) => {
        if (!timeSpan) return '09:00';
        try {
            const timeStr = typeof timeSpan === 'string' ? timeSpan : timeSpan.toString();
            const parts = timeStr.split(':');
            if (parts.length >= 2) {
                return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
            }
            return '09:00';
        } catch (error) {
            return '09:00';
        }
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleNext = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (activeStep < steps.length - 1) {
            setActiveStep(prev => prev + 1);
        }
    };

    const handleBack = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (activeStep > 0) {
            setActiveStep(prev => prev - 1);
        }
    };

    const handleTemplateSelect = (template, setValues) => {
        if (setValues) {
            setValues({
                ...getInitialValues({ id: getCurrentUserId() }),
                ruleName: template.name,
                category: template.category,
                timingType: template.timingType,
                fixedTime: template.fixedTime || '09:00',
                daysOffset: template.daysOffset || 1,
                titleTemplate: template.titleTemplate || '',
                messageTemplate: template.messageTemplate || '',
                priority: template.priority || 2,
                isBatch: true,
            });
        }
        setShowTemplateDialog(false);
        showSnackbar(`Template "${template.name}" applied successfully`, 'success');
    };

    const handleSubmit = async (values, { setSubmitting: formikSetSubmitting }) => {
        if (isSubmitting) return;
        if (activeStep !== steps.length - 1) {
            showSnackbar('Please complete all steps before submitting', 'warning');
            formikSetSubmitting(false);
            return;
        }

        setIsSubmitting(true);

        try {
            const currentUserId = getCurrentUserId();
            
            const isManualTrigger = values.ruleType === 'MANUAL' || 
                                   (values.ruleType === 'EVENT' && values.timingType === 'IMMEDIATE');

            let targetFilterString = '{}';
            if (values.targetFilter && values.targetFilter.trim() !== '' && values.targetFilter !== '{}') {
                try {
                    const parsed = JSON.parse(values.targetFilter);
                    targetFilterString = JSON.stringify(parsed);
                } catch (error) {
                    targetFilterString = '{}';
                }
            }

            let formattedFixedTime = null;
            if (values.timingType === 'FIXED_TIME' || values.timingType === 'DAILY') {
                if (values.fixedTime) {
                    const timeParts = values.fixedTime.split(':');
                    if (timeParts.length === 2) {
                        formattedFixedTime = `${timeParts[0].padStart(2, '0')}:${timeParts[1].padStart(2, '0')}:00`;
                    } else {
                        formattedFixedTime = '09:00:00';
                    }
                }
            }

            let formattedCronExpression = null;
            if (values.timingType === 'CRON' && values.cronExpression) {
                const cronParts = values.cronExpression.trim().split(/\s+/);
                if (cronParts.length === 6) {
                    formattedCronExpression = cronParts.slice(1).join(' ');
                } else if (cronParts.length === 5) {
                    formattedCronExpression = values.cronExpression.trim();
                } else {
                    formattedCronExpression = '0 9 * * *';
                }
            }

            const ruleDataToSend = {
                ruleName: values.ruleName?.trim() || '',
                ruleType: values.ruleType || 'EVENT',
                category: values.category || 'GENERAL',
                isManualTrigger: isManualTrigger,
                sourceTable: values.ruleType === 'EVENT' ? (values.sourceTable?.trim() || null) : null,
                triggerField: values.ruleType === 'EVENT' ? (values.triggerField?.trim() || null) : null,
                triggerValue: values.ruleType === 'EVENT' ? (values.triggerValue?.trim() || null) : null,
                timingType: values.timingType || 'IMMEDIATE',
                daysOffset: values.timingType === 'DAYS_OFFSET' ? (values.daysOffset || 1) : null,
                fixedTime: formattedFixedTime,
                cronExpression: formattedCronExpression,
                titleTemplate: values.titleTemplate?.trim() || '',
                messageTemplate: values.messageTemplate?.trim() || '',
                dataTemplate: values.dataTemplate?.trim() || null,
                targetType: values.targetType || 'ALL',
                targetFilter: targetFilterString,
                isBatch: values.isBatch ?? true,
                priority: parseInt(values.priority) || 2,
                isActive: values.isActive ?? true,
                createdBy: currentUserId
            };

            if (isEditMode) {
                await updateRule({ id, ...ruleDataToSend }).unwrap();
                showSnackbar('Rule updated successfully!', 'success');
                refetch();
            } else {
                await createRule(ruleDataToSend).unwrap();
                showSnackbar('Rule created successfully!', 'success');
            }

            setTimeout(() => {
                navigate('/dashboard/notification-rules');
            }, 1500);

        } catch (error) {
            let errorMessage = 'Failed to save rule. Please check your inputs.';
            
            if (error.data?.errors) {
                const validationErrors = [];
                Object.keys(error.data.errors).forEach(key => {
                    if (Array.isArray(error.data.errors[key])) {
                        validationErrors.push(...error.data.errors[key]);
                    }
                });
                errorMessage = validationErrors.join(', ');
            } else if (error.data?.message) {
                errorMessage = error.data.message;
            } else if (error.status === 400) {
                errorMessage = 'Bad request. Please check fixedTime format (HH:mm:ss) and other fields.';
            }
            
            showSnackbar(errorMessage, 'error');
        } finally {
            setIsSubmitting(false);
            formikSetSubmitting(false);
        }
    };

    const handleTestRule = async (ruleId) => {
        if (!ruleId) {
            showSnackbar('Please save the rule first before testing.', 'warning');
            return;
        }

        try {
            const testUserId = getCurrentUserId();
            await testRule({ id: ruleId, testData: { testUserID: testUserId } }).unwrap();
            showSnackbar('Rule test executed successfully!', 'success');
        } catch (error) {
            showSnackbar(error.data?.message || 'Test failed.', 'error');
        }
    };

    const handleExecuteRule = async (ruleId) => {
        if (!ruleId) {
            showSnackbar('Please save the rule first before executing.', 'warning');
            return;
        }

        try {
            await executeRule(ruleId).unwrap();
            showSnackbar('Rule executed successfully!', 'success');
        } catch (error) {
            showSnackbar(error.data?.message || 'Execution failed.', 'error');
        }
    };

    const insertVariableAtCursor = (variable, setFieldValue, values, fieldName, quillRef) => {
        const variableText = `{${variable}}`;
        
        if (quillRef && quillRef.current) {
            try {
                const quill = quillRef.current.getEditor();
                const range = quill.getSelection();
                
                if (range) {
                    quill.insertText(range.index, variableText);
                    quill.setSelection(range.index + variableText.length, 0);
                    const newContent = quill.root.innerHTML;
                    setFieldValue(fieldName, newContent);
                } else {
                    const currentContent = values[fieldName] || '';
                    const newContent = currentContent + variableText;
                    setFieldValue(fieldName, newContent);
                    if (quill) {
                        quill.root.innerHTML = newContent;
                    }
                }
            } catch (error) {
                const currentContent = values[fieldName] || '';
                setFieldValue(fieldName, currentContent + variableText);
            }
        } else {
            const currentValue = values[fieldName] || '';
            setFieldValue(fieldName, currentValue + variableText);
        }
        
        showSnackbar(`Added {${variable}} to ${fieldName === 'titleTemplate' ? 'Title' : fieldName === 'messageTemplate' ? 'Message' : 'Data'}`, 'info');
    };

    const isStepValid = (values, errors, step) => {
        switch (step) {
            case 0:
                return values.ruleName && values.ruleType && values.category;
            case 1:
                if (!values.timingType) return false;
                if (values.timingType === 'FIXED_TIME' && !values.fixedTime) return false;
                if (values.timingType === 'DAYS_OFFSET' && (!values.daysOffset || values.daysOffset < 1)) return false;
                if (values.timingType === 'CRON' && !values.cronExpression) return false;
                return true;
            case 2:
                return values.targetType;
            case 3:
                return values.titleTemplate && values.messageTemplate;
            case 4:
                return values.priority;
            default:
                return true;
        }
    };

    const renderTimingConfiguration = (values, handleChange, setFieldValue) => {
        const timingType = values.timingType || 'IMMEDIATE';

        return (
            <Box sx={{ mt: 2 }}>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mb: 1 }}>
                        Select Timing Type
                    </Typography>
                    <FormControl fullWidth>
                        <InputLabel>Timing Type *</InputLabel>
                        <Select
                            name="timingType"
                            value={values.timingType}
                            onChange={handleChange}
                            label="Timing Type *"
                            disabled={isLoading}
                        >
                            {timingTypes.map((type) => (
                                <MenuItem key={type.value} value={type.value}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        {type.icon}
                                        <Box>
                                            <Typography>{type.label}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {type.description}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {timingType === 'FIXED_TIME' && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mb: 1 }}>
                            <TimerIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: '1rem' }} />
                            Fixed Time
                        </Typography>
                        <TextField
                            fullWidth
                            name="fixedTime"
                            label="Select Time"
                            type="time"
                            value={values.fixedTime || '09:00'}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            helperText="Choose the time when notifications will be sent daily"
                        />
                    </Box>
                )}

                {timingType === 'DAYS_OFFSET' && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mb: 1 }}>
                            <TodayIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: '1rem' }} />
                            Days Offset
                        </Typography>
                        <TextField
                            fullWidth
                            name="daysOffset"
                            label="Number of Days"
                            type="number"
                            value={values.daysOffset || 1}
                            onChange={handleChange}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">days</InputAdornment>,
                                inputProps: { min: 1 }
                            }}
                            helperText="How many days between each notification"
                        />
                    </Box>
                )}

                {timingType === 'CRON' && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mb: 1 }}>
                            <ScheduleIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: '1rem' }} />
                            Cron Expression
                        </Typography>
                        <TextField
                            fullWidth
                            name="cronExpression"
                            label="Cron Expression"
                            value={values.cronExpression || '0 9 * * *'}
                            onChange={handleChange}
                            helperText="Format: minute hour day month day-of-week (e.g., 0 9 * * * for daily at 9 AM)"
                            placeholder="0 9 * * *"
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            Examples: "0 9 * * *" = Daily at 9 AM, "0 9 */3 * *" = Every 3 days at 9 AM
                        </Typography>
                    </Box>
                )}

                {(timingType === 'DAILY' || timingType === 'WEEKLY' || timingType === 'MONTHLY') && (
                    <Box sx={{ mb: 3 }}>
                        <Alert severity="info" icon={<InfoIcon />}>
                            <Typography variant="body2">
                                This rule will run {timingType.toLowerCase()} at the scheduled time.
                            </Typography>
                        </Alert>
                    </Box>
                )}

                {timingType === 'IMMEDIATE' && (
                    <Box sx={{ mb: 3 }}>
                        <Alert severity="info" icon={<AccessTimeIcon />}>
                            <Typography variant="body2">
                                Notifications will be sent immediately when the rule is triggered.
                            </Typography>
                        </Alert>
                    </Box>
                )}
            </Box>
        );
    };

    const prepareInitialValues = () => {
        if (isEditMode && ruleData?.data) {
            const rule = ruleData.data;
            let targetFilterValue = '{}';
            
            if (rule.targetFilter) {
                if (typeof rule.targetFilter === 'string') {
                    try {
                        const parsed = JSON.parse(rule.targetFilter);
                        targetFilterValue = JSON.stringify(parsed, null, 2);
                    } catch {
                        targetFilterValue = rule.targetFilter;
                    }
                } else if (typeof rule.targetFilter === 'object') {
                    targetFilterValue = JSON.stringify(rule.targetFilter, null, 2);
                }
            }
            
            return {
                ruleName: rule.ruleName || '',
                ruleType: rule.ruleType || 'CRON',
                category: rule.category || 'FEE',
                sourceTable: rule.sourceTable || '',
                triggerField: rule.triggerField || '',
                triggerValue: rule.triggerValue || '',
                timingType: rule.timingType || 'DAILY',
                fixedTime: rule.fixedTime ? formatTimeForInput(rule.fixedTime) : '09:00',
                daysOffset: rule.daysOffset || 1,
                cronExpression: rule.cronExpression || '0 9 * * *',
                titleTemplate: rule.titleTemplate || '',
                messageTemplate: rule.messageTemplate || '',
                dataTemplate: rule.dataTemplate || '',
                targetType: rule.targetType || 'PARENTS',
                targetFilter: targetFilterValue,
                isActive: rule.isActive ?? true,
                isBatch: rule.isBatch ?? true,
                priority: rule.priority || 2,
                createdBy: rule.createdBy || getCurrentUserId(),
            };
        }
        return getInitialValues({ id: getCurrentUserId() });
    };

    const isLoading = loadingRule || creating || updating || isSubmitting || uploadingImage;

    if (!isAdmin() && !isManager() && !isTeacher()) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <Alert severity="error">Access Denied - Notification rule management is only available to authorized users.</Alert>
            </Box>
        );
    }

    if (loadingRule && isEditMode) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress size={60} />
                <Typography sx={{ mt: 3 }}>Loading rule...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 1400, margin: '0 auto', p: { xs: 2, md: 3 } }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    {isEditMode ? 'Edit Notification Rule' : 'Create Notification Rule'}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {isEditMode ? 'Modify your notification rule settings' : 'Define a new notification rule with complete flexibility'}
                </Typography>
            </Box>

            <Paper sx={{ p: 3, mb: 4 }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((step, index) => (
                        <Step key={step.label}>
                            <StepLabel StepIconComponent={() => step.icon}>
                                {step.label}
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Paper>

            <Formik
                initialValues={prepareInitialValues()}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize={true}
                validateOnMount={true}
                validateOnChange={true}
                validateOnBlur={true}
            >
                {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isValid, setValues }) => (
                    <Form>
                        <Grid container spacing={3}>
                            <Grid item xs={12} lg={8}>
                                <Card>
                                    <CardContent>
                                        {/* Step 0: Basic Info */}
                                        {activeStep === 0 && (
                                            <Box>
                                                <Typography variant="h6" gutterBottom>
                                                    <InfoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                                    Basic Information
                                                </Typography>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12}>
                                                        <TextField
                                                            fullWidth
                                                            name="ruleName"
                                                            label="Rule Name *"
                                                            value={values.ruleName}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={touched.ruleName && Boolean(errors.ruleName)}
                                                            helperText={touched.ruleName && errors.ruleName || "Enter a descriptive name for this rule"}
                                                            placeholder="e.g., Daily Fee Reminder"
                                                            disabled={isLoading}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <FormControl fullWidth error={touched.ruleType && Boolean(errors.ruleType)}>
                                                            <InputLabel>Rule Type *</InputLabel>
                                                            <Select
                                                                name="ruleType"
                                                                value={values.ruleType}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                label="Rule Type *"
                                                                disabled={isLoading}
                                                            >
                                                                {ruleTypes.map((type) => (
                                                                    <MenuItem key={type.value} value={type.value}>
                                                                        <Box display="flex" alignItems="center" gap={1}>
                                                                            {type.icon}
                                                                            <Box>
                                                                                <Typography>{type.label}</Typography>
                                                                                <Typography variant="caption" color="text.secondary">
                                                                                    {type.description}
                                                                                </Typography>
                                                                            </Box>
                                                                        </Box>
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                            {touched.ruleType && errors.ruleType && (
                                                                <FormHelperText>{errors.ruleType}</FormHelperText>
                                                            )}
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <FormControl fullWidth error={touched.category && Boolean(errors.category)}>
                                                            <InputLabel>Category *</InputLabel>
                                                            <Select
                                                                name="category"
                                                                value={values.category}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                label="Category *"
                                                                disabled={isLoading}
                                                            >
                                                                {categories.map((cat) => (
                                                                    <MenuItem key={cat.value} value={cat.value}>
                                                                        <Box display="flex" alignItems="center" gap={1}>
                                                                            <Chip
                                                                                label={cat.label}
                                                                                size="small"
                                                                                color={cat.color}
                                                                                icon={cat.icon}
                                                                            />
                                                                            <Box>
                                                                                <Typography>{cat.label}</Typography>
                                                                                <Typography variant="caption" color="text.secondary">
                                                                                    {cat.description}
                                                                                </Typography>
                                                                            </Box>
                                                                        </Box>
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                            {touched.category && errors.category && (
                                                                <FormHelperText>{errors.category}</FormHelperText>
                                                            )}
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <FormControlLabel
                                                            control={
                                                                <Switch
                                                                    name="isActive"
                                                                    checked={values.isActive}
                                                                    onChange={handleChange}
                                                                    color="success"
                                                                    disabled={isLoading}
                                                                />
                                                            }
                                                            label={
                                                                <Box display="flex" alignItems="center" gap={1}>
                                                                    {values.isActive ? (
                                                                        <CheckCircleIcon color="success" fontSize="small" />
                                                                    ) : (
                                                                        <ErrorIcon color="action" fontSize="small" />
                                                                    )}
                                                                    <Typography>
                                                                        {values.isActive ? 'Rule is active' : 'Rule is inactive'}
                                                                    </Typography>
                                                                </Box>
                                                            }
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        )}

                                        {/* Step 1: Schedule & Timing */}
                                        {activeStep === 1 && (
                                            <Box>
                                                <Typography variant="h6" gutterBottom>
                                                    <ScheduleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                                    Schedule & Timing Configuration
                                                </Typography>
                                                <Divider sx={{ mb: 3 }} />
                                                {renderTimingConfiguration(values, handleChange, setFieldValue)}
                                            </Box>
                                        )}

                                        {/* Step 2: Target & Filters */}
                                        {activeStep === 2 && (
                                            <Box>
                                                <Typography variant="h6" gutterBottom>
                                                    <FilterListIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                                    Target & Filter Configuration
                                                </Typography>
                                                <Divider sx={{ mb: 3 }} />
                                                
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12}>
                                                        <FormControl fullWidth error={touched.targetType && Boolean(errors.targetType)}>
                                                            <InputLabel>Target Type *</InputLabel>
                                                            <Select
                                                                name="targetType"
                                                                value={values.targetType}
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                    setFieldValue('targetFilter', '{}');
                                                                }}
                                                                onBlur={handleBlur}
                                                                label="Target Type *"
                                                                disabled={isLoading}
                                                            >
                                                                {targetTypes.map((type) => (
                                                                    <MenuItem key={type.value} value={type.value}>
                                                                        <Box display="flex" alignItems="center" gap={1}>
                                                                            {type.icon}
                                                                            <Typography>{type.label}</Typography>
                                                                        </Box>
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                            {touched.targetType && errors.targetType && (
                                                                <FormHelperText>{errors.targetType}</FormHelperText>
                                                            )}
                                                        </FormControl>
                                                    </Grid>

                                                    {(values.targetType === 'CLASS' || 
                                                      values.targetType === 'SECTION' || 
                                                      values.targetType === 'SPECIFIC_USERS' ||
                                                      values.targetType === 'SPECIFIC_STUDENTS_DIRECT') && (
                                                        <Grid item xs={12}>
                                                            <Paper sx={{ p: 3, bgcolor: '#f5f5f5', mt: 2 }}>
                                                                <Typography variant="subtitle1" gutterBottom>
                                                                    Configure Target Filters
                                                                </Typography>
                                                                <TargetFilterBuilder
                                                                    value={values.targetFilter}
                                                                    onChange={(newFilter) => setFieldValue('targetFilter', newFilter)}
                                                                    category={values.category}
                                                                    targetType={values.targetType}
                                                                    disabled={isLoading}
                                                                />
                                                            </Paper>
                                                        </Grid>
                                                    )}

                                                    {values.category === 'FEE' && (
                                                        <Grid item xs={12}>
                                                            <Paper sx={{ p: 3, bgcolor: '#f5f5f5', mt: 2 }}>
                                                                <Typography variant="subtitle1" gutterBottom>
                                                                    Fee Reminder Settings
                                                                </Typography>
                                                                <TargetFilterBuilder
                                                                    value={values.targetFilter}
                                                                    onChange={(newFilter) => setFieldValue('targetFilter', newFilter)}
                                                                    category={values.category}
                                                                    targetType={values.targetType}
                                                                    disabled={isLoading}
                                                                />
                                                            </Paper>
                                                        </Grid>
                                                    )}

                                                    <Grid item xs={12}>
                                                        <FormControlLabel
                                                            control={
                                                                <Switch
                                                                    name="isBatch"
                                                                    checked={values.isBatch}
                                                                    onChange={handleChange}
                                                                    color="primary"
                                                                    disabled={isLoading}
                                                                />
                                                            }
                                                            label={
                                                                <Box display="flex" alignItems="center" gap={1}>
                                                                    <SendIcon fontSize="small" />
                                                                    <Typography>Send as batch notification</Typography>
                                                                    <Tooltip title="Batch notifications are processed together and can be tracked as a group">
                                                                        <InfoIcon fontSize="small" color="action" />
                                                                    </Tooltip>
                                                                </Box>
                                                            }
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        )}

                                        {/* Step 3: Content */}
                                        {activeStep === 3 && isClient && (
                                            <Box>
                                                <Typography variant="h6" gutterBottom>
                                                    <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                                    Notification Content
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" paragraph>
                                                    Define your notification content using variables in curly braces {'{}'}
                                                </Typography>

                                                <Paper sx={{ p: 2, mb: 3, bgcolor: '#f5f5f5' }}>
                                                    <Typography variant="subtitle2" gutterBottom>
                                                        Insert Variable Into:
                                                    </Typography>
                                                    <RadioGroup
                                                        row
                                                        value={selectedInsertField}
                                                        onChange={(e) => setSelectedInsertField(e.target.value)}
                                                    >
                                                        <FormControlLabel
                                                            value="titleTemplate"
                                                            control={<Radio />}
                                                            label={
                                                                <Box display="flex" alignItems="center" gap={0.5}>
                                                                    <AssignmentIcon fontSize="small" color="primary" />
                                                                    <Typography>Title</Typography>
                                                                </Box>
                                                            }
                                                        />
                                                        <FormControlLabel
                                                            value="messageTemplate"
                                                            control={<Radio />}
                                                            label={
                                                                <Box display="flex" alignItems="center" gap={0.5}>
                                                                    <MessageIcon fontSize="small" color="secondary" />
                                                                    <Typography>Message</Typography>
                                                                </Box>
                                                            }
                                                        />
                                                        <FormControlLabel
                                                            value="dataTemplate"
                                                            control={<Radio />}
                                                            label={
                                                                <Box display="flex" alignItems="center" gap={0.5}>
                                                                    <DataIcon fontSize="small" color="success" />
                                                                    <Typography>Data Payload</Typography>
                                                                </Box>
                                                            }
                                                        />
                                                    </RadioGroup>
                                                </Paper>

                                                <Paper sx={{ p: 2, mb: 3, bgcolor: '#f5f5f5' }}>
                                                    <Typography variant="subtitle2" gutterBottom>
                                                        Available Variables for {values.category || 'General'} Notifications
                                                    </Typography>
                                                    <Box display="flex" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
                                                        {sampleVariables.COMMON.map((variable) => (
                                                            <Tooltip key={variable.name} title={`${variable.description} (Sample: ${variable.sample})`}>
                                                                <Chip
                                                                    label={`{${variable.name}}`}
                                                                    size="small"
                                                                    onClick={() => insertVariableAtCursor(
                                                                        variable.name,
                                                                        setFieldValue,
                                                                        values,
                                                                        selectedInsertField,
                                                                        selectedInsertField === 'titleTemplate' ? titleQuillRef : 
                                                                        selectedInsertField === 'messageTemplate' ? messageQuillRef : null
                                                                    )}
                                                                    variant="outlined"
                                                                    sx={{ cursor: 'pointer' }}
                                                                />
                                                            </Tooltip>
                                                        ))}
                                                        {sampleVariables[values.category]?.map((variable) => (
                                                            <Tooltip key={variable.name} title={`${variable.description} (Sample: ${variable.sample})`}>
                                                                <Chip
                                                                    label={`{${variable.name}}`}
                                                                    size="small"
                                                                    color="primary"
                                                                    onClick={() => insertVariableAtCursor(
                                                                        variable.name,
                                                                        setFieldValue,
                                                                        values,
                                                                        selectedInsertField,
                                                                        selectedInsertField === 'titleTemplate' ? titleQuillRef : 
                                                                        selectedInsertField === 'messageTemplate' ? messageQuillRef : null
                                                                    )}
                                                                    sx={{ cursor: 'pointer' }}
                                                                />
                                                            </Tooltip>
                                                        ))}
                                                    </Box>
                                                </Paper>

                                                <Grid container spacing={3}>
                                                    {/* Title Template */}
                                                    <Grid item xs={12}>
                                                        <Box>
                                                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                                                <Typography variant="subtitle2">
                                                                    Title Template *
                                                                </Typography>
                                                                <Typography variant="caption" color={getPlainTextLength(values.titleTemplate) > 200 ? "error" : "text.secondary"}>
                                                                    {getPlainTextLength(values.titleTemplate)}/200 characters
                                                                </Typography>
                                                            </Box>
                                                            <Box
                                                                sx={{
                                                                    borderLeft: selectedInsertField === 'titleTemplate' ? '4px solid' : 'none',
                                                                    borderLeftColor: 'primary.main',
                                                                    pl: selectedInsertField === 'titleTemplate' ? 1 : 0,
                                                                    '& .ql-container': {
                                                                        minHeight: '80px',
                                                                        fontFamily: 'inherit',
                                                                    },
                                                                    '& .ql-editor': {
                                                                        minHeight: '80px',
                                                                        fontSize: '1rem',
                                                                    },
                                                                    '& .ql-toolbar': {
                                                                        borderTopLeftRadius: '4px',
                                                                        borderTopRightRadius: '4px',
                                                                    },
                                                                    '& .ql-container': {
                                                                        borderBottomLeftRadius: '4px',
                                                                        borderBottomRightRadius: '4px',
                                                                    }
                                                                }}
                                                                onClick={() => setSelectedInsertField('titleTemplate')}
                                                            >
                                                                <QuillEditor
                                                                    ref={titleQuillRef}
                                                                    value={values.titleTemplate}
                                                                    onChange={(content) => setFieldValue('titleTemplate', content)}
                                                                    onBlur={() => handleBlur({ target: { name: 'titleTemplate' } })}
                                                                    placeholder="Write notification title here... (Use {variables} for dynamic content)"
                                                                    readOnly={isLoading}
                                                                    modules={{ toolbar: messageToolbarOptions }}
                                                                    formats={messageFormats}
                                                                />
                                                            </Box>
                                                            {touched.titleTemplate && errors.titleTemplate && (
                                                                <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                                                    {errors.titleTemplate}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    </Grid>

                                                    {/* Message Template */}
                                                    <Grid item xs={12}>
                                                        <Box>
                                                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                                                <Typography variant="subtitle2">
                                                                    Message Template *
                                                                </Typography>
                                                                <Typography variant="caption" color={getPlainTextLength(values.messageTemplate) > 1000 ? "error" : "text.secondary"}>
                                                                    {getPlainTextLength(values.messageTemplate)}/1000 characters
                                                                </Typography>
                                                            </Box>
                                                            <Box
                                                                sx={{
                                                                    borderLeft: selectedInsertField === 'messageTemplate' ? '4px solid' : 'none',
                                                                    borderLeftColor: 'secondary.main',
                                                                    pl: selectedInsertField === 'messageTemplate' ? 1 : 0,
                                                                    '& .ql-container': {
                                                                        minHeight: '200px',
                                                                        fontFamily: 'inherit',
                                                                    },
                                                                    '& .ql-editor': {
                                                                        minHeight: '200px',
                                                                        fontSize: '1rem',
                                                                    },
                                                                    '& .ql-toolbar': {
                                                                        borderTopLeftRadius: '4px',
                                                                        borderTopRightRadius: '4px',
                                                                    },
                                                                    '& .ql-container': {
                                                                        borderBottomLeftRadius: '4px',
                                                                        borderBottomRightRadius: '4px',
                                                                    }
                                                                }}
                                                                onClick={() => setSelectedInsertField('messageTemplate')}
                                                            >
                                                                <QuillEditor
                                                                    ref={messageQuillRef}
                                                                    value={values.messageTemplate}
                                                                    onChange={(content) => setFieldValue('messageTemplate', content)}
                                                                    onBlur={() => handleBlur({ target: { name: 'messageTemplate' } })}
                                                                    placeholder="Write your notification message here. Use the toolbar to format text and {variables} for dynamic content..."
                                                                    readOnly={isLoading}
                                                                    modules={{ toolbar: messageToolbarOptions }}
                                                                    formats={messageFormats}
                                                                />
                                                            </Box>
                                                            {touched.messageTemplate && errors.messageTemplate && (
                                                                <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                                                    {errors.messageTemplate}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    </Grid>

                                                    {/* Data Template */}
                                                    <Grid item xs={12}>
                                                        <TextField
                                                            fullWidth
                                                            name="dataTemplate"
                                                            label="Data Template (JSON - Optional)"
                                                            value={values.dataTemplate || ''}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            helperText="Additional data in JSON format for mobile apps"
                                                            multiline
                                                            rows={4}
                                                            placeholder='{"action": "view_details", "id": "{ID}"}'
                                                            disabled={isLoading}
                                                            inputRef={dataRef}
                                                            InputProps={{
                                                                style: { fontFamily: 'monospace', fontSize: '0.875rem' },
                                                                sx: {
                                                                    borderLeft: selectedInsertField === 'dataTemplate' ? '4px solid' : 'none',
                                                                    borderLeftColor: 'success.main',
                                                                    pl: selectedInsertField === 'dataTemplate' ? 1 : 0
                                                                }
                                                            }}
                                                            onClick={() => setSelectedInsertField('dataTemplate')}
                                                        />
                                                    </Grid>
                                                </Grid>

                                                <Paper sx={{ p: 3, mt: 3, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
                                                    <Typography variant="subtitle2" gutterBottom color="primary">
                                                        Live Preview
                                                    </Typography>
                                                    <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1 }}>
                                                        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                                                            <div dangerouslySetInnerHTML={{ __html: values.titleTemplate || 'Title will appear here' }} />
                                                        </Typography>
                                                        <Box sx={{ whiteSpace: 'pre-line' }}>
                                                            <div dangerouslySetInnerHTML={{ __html: values.messageTemplate || 'Message will appear here' }} />
                                                        </Box>
                                                        {values.dataTemplate && (
                                                            <Box sx={{ mt: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Data Payload:
                                                                </Typography>
                                                                <pre style={{ margin: 0, fontSize: '0.75rem', overflowX: 'auto' }}>
                                                                    {values.dataTemplate}
                                                                </pre>
                                                            </Box>
                                                        )}
                                                    </Box>
                                                </Paper>
                                            </Box>
                                        )}

                                        {/* Step 4: Advanced */}
                                        {activeStep === 4 && (
                                            <Box>
                                                <Typography variant="h6" gutterBottom>
                                                    <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                                    Advanced Settings
                                                </Typography>
                                                <Divider sx={{ mb: 3 }} />
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12} md={6}>
                                                        <FormControl fullWidth error={touched.priority && Boolean(errors.priority)}>
                                                            <InputLabel>Priority *</InputLabel>
                                                            <Select
                                                                name="priority"
                                                                value={values.priority || 2}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                label="Priority *"
                                                                disabled={isLoading}
                                                            >
                                                                {priorities.map((priority) => (
                                                                    <MenuItem key={priority.value} value={priority.value}>
                                                                        <Box display="flex" alignItems="center" gap={1}>
                                                                            <Chip
                                                                                label={priority.label}
                                                                                size="small"
                                                                                color={priority.color}
                                                                            />
                                                                            <Box>
                                                                                <Typography>Priority {priority.value}</Typography>
                                                                                <Typography variant="caption" color="text.secondary">
                                                                                    {priority.description}
                                                                                </Typography>
                                                                            </Box>
                                                                        </Box>
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                            {touched.priority && errors.priority && (
                                                                <FormHelperText>{errors.priority}</FormHelperText>
                                                            )}
                                                        </FormControl>
                                                    </Grid>

                                                    <Grid item xs={12} md={6}>
                                                        <TextField
                                                            fullWidth
                                                            name="createdBy"
                                                            label="Created By"
                                                            value={getCurrentUserId()}
                                                            disabled
                                                            helperText="Your user ID (automatically assigned)"
                                                        />
                                                    </Grid>

                                                    {values.ruleType === 'EVENT' && (
                                                        <>
                                                            <Grid item xs={12} md={6}>
                                                                <TextField
                                                                    fullWidth
                                                                    name="sourceTable"
                                                                    label="Source Table"
                                                                    value={values.sourceTable || ''}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    helperText="Database table to monitor for events"
                                                                    placeholder="e.g., tbl_FeePosting"
                                                                    disabled={isLoading}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} md={6}>
                                                                <TextField
                                                                    fullWidth
                                                                    name="triggerField"
                                                                    label="Trigger Field"
                                                                    value={values.triggerField || ''}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    helperText="Field to monitor for changes"
                                                                    placeholder="e.g., Status"
                                                                    disabled={isLoading}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <TextField
                                                                    fullWidth
                                                                    name="triggerValue"
                                                                    label="Trigger Value"
                                                                    value={values.triggerValue || ''}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    helperText="Value that triggers the notification"
                                                                    placeholder="e.g., POSTED"
                                                                    disabled={isLoading}
                                                                />
                                                            </Grid>
                                                        </>
                                                    )}

                                                    <Grid item xs={12}>
                                                        <Alert severity="info" icon={<InfoIcon />}>
                                                            <Typography variant="body2">
                                                                <strong>Rule Summary:</strong> This rule will run{' '}
                                                                {values.timingType === 'IMMEDIATE' ? 'immediately when triggered' :
                                                                 values.timingType === 'FIXED_TIME' ? `daily at ${values.fixedTime}` :
                                                                 values.timingType === 'DAYS_OFFSET' ? `every ${values.daysOffset} days` :
                                                                 values.timingType === 'CRON' ? `according to cron schedule: ${values.cronExpression}` :
                                                                 values.timingType?.toLowerCase()}.
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ mt: 1 }}>
                                                                <strong>Target:</strong> {targetTypes.find(t => t.value === values.targetType)?.label || 'All Users'}
                                                                <br />
                                                                <strong>Category:</strong> {values.category}
                                                                <br />
                                                                <strong>Batch Mode:</strong> {values.isBatch ? 'Enabled' : 'Disabled'}
                                                                <br />
                                                                <strong>Priority:</strong> {priorities.find(p => p.value === values.priority)?.label || 'Medium'} ({values.priority})
                                                            </Typography>
                                                        </Alert>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        )}

                                        {/* Navigation Buttons */}
                                        <Box display="flex" justifyContent="space-between" mt={4}>
                                            <Button
                                                disabled={activeStep === 0 || isLoading}
                                                onClick={handleBack}
                                                startIcon={<CancelIcon />}
                                                variant="outlined"
                                                type="button"
                                            >
                                                Back
                                            </Button>
                                            {activeStep < steps.length - 1 ? (
                                                <Button
                                                    variant="contained"
                                                    onClick={handleNext}
                                                    disabled={isLoading || !isStepValid(values, errors, activeStep)}
                                                    type="button"
                                                >
                                                    Next Step
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    color="primary"
                                                    disabled={isLoading || !isValid || isSubmitting}
                                                    startIcon={isLoading || isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
                                                >
                                                    {isLoading || isSubmitting ? 'Saving...' : (isEditMode ? 'Update Rule' : 'Create Rule')}
                                                </Button>
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Right Column - Summary */}
                            <Grid item xs={12} lg={4}>
                                <Box sx={{ position: 'sticky', top: 24 }}>
                                    <Card sx={{ mb: 2 }}>
                                        <CardHeader title="Rule Summary" />
                                        <CardContent>
                                            <List disablePadding>
                                                <ListItem sx={{ px: 0 }}>
                                                    <ListItemText primary="Rule Name" secondary={values.ruleName || 'Not set'} />
                                                </ListItem>
                                                <Divider sx={{ my: 1 }} />
                                                <ListItem sx={{ px: 0 }}>
                                                    <ListItemText 
                                                        primary="Type & Category" 
                                                        secondary={
                                                            <Box display="flex" gap={1} sx={{ mt: 0.5 }}>
                                                                <Chip label={values.ruleType} size="small" variant="outlined" />
                                                                <Chip 
                                                                    label={values.category} 
                                                                    size="small" 
                                                                    color={categories.find(c => c.value === values.category)?.color || 'default'}
                                                                />
                                                            </Box>
                                                        } 
                                                    />
                                                </ListItem>
                                                <Divider sx={{ my: 1 }} />
                                                <ListItem sx={{ px: 0 }}>
                                                    <ListItemText 
                                                        primary="Schedule" 
                                                        secondary={
                                                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                                                                {values.timingType === 'IMMEDIATE' ? 'Immediate' :
                                                                 values.timingType === 'FIXED_TIME' ? `Daily at ${values.fixedTime || '09:00'}` :
                                                                 values.timingType === 'DAYS_OFFSET' ? `Every ${values.daysOffset || 1} days` :
                                                                 values.timingType === 'CRON' ? `Cron: ${values.cronExpression || '0 9 * * *'}` :
                                                                 values.timingType?.charAt(0).toUpperCase() + values.timingType?.slice(1).toLowerCase()}
                                                            </Typography>
                                                        } 
                                                    />
                                                </ListItem>
                                                <Divider sx={{ my: 1 }} />
                                                <ListItem sx={{ px: 0 }}>
                                                    <ListItemText 
                                                        primary="Status" 
                                                        secondary={
                                                            <Box display="flex" alignItems="center" gap={1} sx={{ mt: 0.5 }}>
                                                                <Chip 
                                                                    label={values.isActive ? 'Active' : 'Inactive'} 
                                                                    size="small" 
                                                                    color={values.isActive ? 'success' : 'error'} 
                                                                />
                                                                {values.isBatch && (
                                                                    <Chip label="Batch" size="small" variant="outlined" color="primary" />
                                                                )}
                                                            </Box>
                                                        } 
                                                    />
                                                </ListItem>
                                                <Divider sx={{ my: 1 }} />
                                                <ListItem sx={{ px: 0 }}>
                                                    <ListItemText 
                                                        primary="Priority" 
                                                        secondary={
                                                            <Chip 
                                                                label={`${priorities.find(p => p.value === values.priority)?.label || 'Medium'} (${values.priority})`} 
                                                                size="small" 
                                                                color={priorities.find(p => p.value === values.priority)?.color}
                                                                sx={{ mt: 0.5 }}
                                                            />
                                                        } 
                                                    />
                                                </ListItem>
                                                <Divider sx={{ my: 1 }} />
                                                <ListItem sx={{ px: 0 }}>
                                                    <ListItemText 
                                                        primary="Target" 
                                                        secondary={
                                                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                                                                {targetTypes.find(t => t.value === values.targetType)?.label || 'All Users'}
                                                            </Typography>
                                                        } 
                                                    />
                                                </ListItem>
                                            </List>

                                            {isEditMode && id && (
                                                <Box mt={2} display="flex" flexDirection="column" gap={1}>
                                                    <Button
                                                        variant="outlined"
                                                        fullWidth
                                                        size="small"
                                                        onClick={() => handleTestRule(id)}
                                                        disabled={testing || isLoading}
                                                        startIcon={testing ? <CircularProgress size={16} /> : <SendIcon />}
                                                        color="primary"
                                                        type="button"
                                                    >
                                                        {testing ? 'Testing...' : 'Test Rule'}
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        fullWidth
                                                        size="small"
                                                        onClick={() => handleExecuteRule(id)}
                                                        disabled={executing || isLoading}
                                                        startIcon={executing ? <CircularProgress size={16} /> : <PlayArrowIcon />}
                                                        color="secondary"
                                                        type="button"
                                                    >
                                                        {executing ? 'Executing...' : 'Execute Rule Now'}
                                                    </Button>
                                                    <Alert severity="warning" sx={{ mt: 0.5, py: 0 }}>
                                                        <Typography variant="caption">Executing will run the rule immediately.</Typography>
                                                    </Alert>
                                                </Box>
                                            )}

                                            <Button
                                                variant="outlined"
                                                fullWidth
                                                size="small"
                                                onClick={() => navigate('/dashboard/notification-rules')}
                                                startIcon={<CancelIcon />}
                                                disabled={isLoading}
                                                type="button"
                                                sx={{ mt: 2 }}
                                            >
                                                Cancel
                                            </Button>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader title="Quick Start" avatar={<AddIcon color="primary" />} />
                                        <CardContent>
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                size="small"
                                                startIcon={<AddIcon />}
                                                onClick={() => setShowTemplateDialog(true)}
                                                type="button"
                                            >
                                                Use Template
                                            </Button>
                                            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                                                Start quickly with pre-configured templates.
                                            </Typography>
                                        </CardContent>
                                    </Card>

                                    <Card sx={{ mt: 2 }}>
                                        <CardHeader title="Setup Progress" />
                                        <CardContent>
                                            <LinearProgress
                                                variant="determinate"
                                                value={(activeStep + 1) / steps.length * 100}
                                                sx={{ height: 6, borderRadius: 3, mb: 1 }}
                                            />
                                            <Typography variant="caption" color="text.secondary">
                                                Step {activeStep + 1} of {steps.length}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Box>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>

            {/* Template Dialog */}
            <Dialog open={showTemplateDialog} onClose={() => setShowTemplateDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Select Rule Template</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        {ruleTemplates.map((template) => (
                            <Grid item xs={12} key={template.id}>
                                <Card 
                                    variant="outlined" 
                                    sx={{ 
                                        cursor: 'pointer', 
                                        '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.50' } 
                                    }}
                                    onClick={() => {
                                        if (setValues) handleTemplateSelect(template, setValues);
                                    }}
                                >
                                    <CardContent>
                                        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                            <Box>
                                                <Typography variant="h6">{template.name}</Typography>
                                                <Typography variant="body2" color="text.secondary">{template.description}</Typography>
                                                <Box display="flex" gap={1} mt={1}>
                                                    <Chip label={template.category} size="small" variant="outlined" />
                                                    <Chip label={`Priority ${template.priority}`} size="small" variant="outlined" />
                                                </Box>
                                            </Box>
                                            <Button variant="contained" size="small">
                                                Use Template
                                            </Button>
                                        </Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                            Schedule: {template.timingType === 'FIXED_TIME' ? `Daily at ${template.fixedTime}` :
                                                       template.timingType === 'DAYS_OFFSET' ? `Every ${template.daysOffset} days` :
                                                       template.timingType}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowTemplateDialog(false)}>Cancel</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={6000} 
                onClose={handleCloseSnackbar} 
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default NotificationRuleForm;