

// store/slices/teacherSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../utils/apiClient';

export const fetchTeacherClasses = createAsyncThunk(
    'teacher/fetchClasses',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get('/Teacher/Classes');
            console.log('Fetched classes response:', response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchClassStudents = createAsyncThunk(
    'teacher/fetchClassStudents',
    async ({ classId, sectionId }, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`/Teacher/ClassStudents/${classId}/${sectionId}`);
            console.log('Fetched class students response:', response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchTodayAttendance = createAsyncThunk(
    'teacher/fetchTodayAttendance',
    async ({ classId, sectionId }, { rejectWithValue }) => {
        try {

            const response = await apiClient.get(`/Teacher/TodayAttendance/${classId}/${sectionId}`);
            console.log('Fetched today attendance response:', response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const markAttendance = createAsyncThunk(
    'teacher/markAttendance',
    async (attendanceData, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/Teacher/MarkAttendance', attendanceData);
            console.log('Marked attendance response:', response.data);
            return response.data;

        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchAttendanceHistory = createAsyncThunk(
    'teacher/fetchAttendanceHistory',
    async ({ classId, sectionId, month, year }, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`/Teacher/AttendanceHistory/${classId}/${sectionId}/${month}/${year}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const teacherSlice = createSlice({
    name: 'teacher',
    initialState: {
        classes: [],
        currentClass: null,
        students: [],
        attendance: [],
        todayAttendance: null,
        attendanceHistory: [],
        loading: false,
        error: null,
        success: false,
        attendanceLoading: false,
        // ADD ONLY THESE - don't change existing structure
        studentsLoading: false, // NEW: Separate loading state for students
    },
    reducers: {
        setCurrentClass: (state, action) => {
            state.currentClass = action.payload;
        },
        clearAttendanceData: (state) => {
            state.todayAttendance = null;
            state.attendance = [];
        },
        updateAttendanceStatus: (state, action) => {
            const { studentId, status, lateStatus, remarks } = action.payload;
            const existingIndex = state.attendance.findIndex(a => a.studentId === studentId);

            if (existingIndex >= 0) {
                state.attendance[existingIndex] = {
                    ...state.attendance[existingIndex],
                    status,
                    lateStatus,
                    remarks
                };
            } else {
                state.attendance.push({
                    studentId,
                    status,
                    lateStatus,
                    remarks
                });
            }
        },
        clearError: (state) => {
            state.error = null;
            state.success = false;
        },
        // ADD THIS ONLY - new reducer
        clearStudents: (state) => {
            state.students = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch classes - KEEP AS IS
            .addCase(fetchTeacherClasses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTeacherClasses.fulfilled, (state, action) => {
                state.loading = false;
                state.classes = action.payload.classes || [];
                state.error = null;
            })
            .addCase(fetchTeacherClasses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch class students - MODIFY THIS SECTION ONLY
            .addCase(fetchClassStudents.pending, (state) => {
                state.studentsLoading = true; // CHANGE: Use studentsLoading instead of loading
                state.error = null;
            })
            .addCase(fetchClassStudents.fulfilled, (state, action) => {
                state.studentsLoading = false; // CHANGE: Use studentsLoading instead of loading
                state.students = action.payload.students || action.payload || []; // ADD: Handle both formats
                state.error = null;
            })
            .addCase(fetchClassStudents.rejected, (state, action) => {
                state.studentsLoading = false; // CHANGE: Use studentsLoading instead of loading
                state.error = action.payload;
            })

            // Fetch today's attendance - KEEP AS IS
            .addCase(fetchTodayAttendance.pending, (state) => {
                state.attendanceLoading = true;
                state.error = null;
            })
            .addCase(fetchTodayAttendance.fulfilled, (state, action) => {
                state.attendanceLoading = false;
                state.todayAttendance = action.payload;
                if (action.payload.attendanceTaken && action.payload.attendanceRecords) {
                    state.attendance = action.payload.attendanceRecords.map(record => ({
                        studentId: record.studentId,
                        status: record.status,
                        lateStatus: record.lateStatus,
                        remarks: record.remarks
                    }));
                }
                state.error = null;
            })
            .addCase(fetchTodayAttendance.rejected, (state, action) => {
                state.attendanceLoading = false;
                state.error = action.payload;
            })

            // Mark attendance - KEEP AS IS
            .addCase(markAttendance.pending, (state) => {
                state.attendanceLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(markAttendance.fulfilled, (state, action) => {
                state.attendanceLoading = false;
                state.success = true;
                state.todayAttendance = {
                    ...state.todayAttendance,
                    attendanceTaken: true
                };
                state.error = null;
            })
            .addCase(markAttendance.rejected, (state, action) => {
                state.attendanceLoading = false;
                state.error = action.payload;
                state.success = false;
            })

            // Fetch attendance history - KEEP AS IS
            .addCase(fetchAttendanceHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAttendanceHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.attendanceHistory = action.payload.history || [];
                state.error = null;
            })
            .addCase(fetchAttendanceHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const {
    setCurrentClass,
    clearAttendanceData,
    updateAttendanceStatus,
    clearError,
    clearStudents // ADD THIS - export the new reducer
} = teacherSlice.actions;


// Add to teacherSlice.js export section - KEEP ALL EXISTING AND ADD NEW
export const selectTeacherClasses = (state) => state.teacher.classes;
export const selectTeacherStudents = (state) => state.teacher.students;
export const selectTeacherAttendance = (state) => state.teacher.attendance;
export const selectTeacherTodayAttendance = (state) => state.teacher.todayAttendance;
export const selectTeacherAttendanceHistory = (state) => state.teacher.attendanceHistory;
export const selectTeacherLoading = (state) => state.teacher.loading;
export const selectTeacherError = (state) => state.teacher.error;
export const selectTeacherSuccess = (state) => state.teacher.success;
// ADD THESE NEW SELECTORS
export const selectStudentsLoading = (state) => state.teacher.studentsLoading;
export const selectClassStudents = (state) => state.teacher.students; // Alias for consistency


export default teacherSlice.reducer;