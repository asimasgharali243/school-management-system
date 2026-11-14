# Mobile gallery by role

This replaces the earlier source-component inventory with **only screen components registered in the Admin, Teacher and Parent navigators**. Unused Default/Home/Classes/Attendance prototypes are excluded. Shared aliases and navigator containers are not counted twice.

**Capture limits:** these are role-specific React Native Web UI previews at phone size, not native Android/iOS captures. The preview imports the exact published role resolver, restricts screen selection to each navigator’s registered components, and supplies separate synthetic Admin/Teacher/Parent identities. Native navigation containers, query/storage/notification modules and native widgets are adapted. Actual root navigator selection and auth thunk/reducer behavior were separately checked with React test rendering and mocked API/storage—not with a live school server.

## Role selection

| Account | Landing screen |
|---|---|
| Admin / Administrator / Super Admin role name | AdminDashboard |
| Teacher role name or API role ID 3, including string IDs | TeacherDashboard |
| Parent role name or API role ID 4, including string IDs | ChildrenList |
| Missing, unsupported or conflicting role | Access not configured, with Refresh account and Sign out |

Unrecognized numeric administrative IDs are not guessed. The API response must identify an administrative role by name. Frontend routing does not replace server authorization.

## Shared sign in

<img src="images/mobile/LoginScreen.png" width="390" alt="Shared mobile sign-in source preview" />

## Admin — 5 registered screen views

A dedicated Admin navigator/landing screen was added because the original app had no Admin navigator. It supports the existing shared notification/profile/settings areas; it does not invent completed mobile administrative editors.

### Admin: AdminDashboard

Administrator landing area with account notifications, profile and settings. The supplied app has no mobile school-record editors; use the configured web portal for those workflows.

**Component:** `Admin/AdminDashboardScreen.js`

<img src="images/roles/admin-AdminDashboard.png" width="390" alt="Admin role — AdminDashboard synthetic UI preview" />

### Admin: Notifications

Review notices for the signed-in account. The empty inbox uses synthetic preview state; delivery and read-state persistence are not verified.

**Component:** `Notifications/NotificationsScreen.js`

<img src="images/roles/admin-Notifications.png" width="390" alt="Admin role — Notifications synthetic UI preview" />

### Admin: NotificationDetail

Read the selected synthetic notice and view the acknowledgement control. No acknowledgement request was submitted.

**Component:** `Notifications/NotificationDetailScreen.js`

<img src="images/roles/admin-NotificationDetail.png" width="390" alt="Admin role — NotificationDetail synthetic UI preview" />

### Admin: AdminProfile

View the administrator account profile. The displayed account is synthetic; profile updates were not submitted.

**Component:** `Profile/ProfileScreen.js`

<img src="images/roles/admin-AdminProfile.png" width="390" alt="Admin role — AdminProfile synthetic UI preview" />

### Admin: AdminSettings

View app/account preferences as an administrator. Unimplemented actions now report that they are unavailable instead of navigating to nonexistent screens.

**Component:** `Settings/SettingsScreen.js`

<img src="images/roles/admin-AdminSettings.png" width="390" alt="Admin role — AdminSettings synthetic UI preview" />

## Teacher — 14 registered screen views

### Teacher: TeacherDashboard

Teacher landing screen with the teacher’s synthetic class/subject assignment and classroom shortcuts.

**Component:** `Teacher/TeacherDashboard.js`

<img src="images/roles/teacher-TeacherDashboard.png" width="390" alt="Teacher role — TeacherDashboard synthetic UI preview" />

### Teacher: TeacherClasses

Review the teacher’s assigned classes and sections; select a class to continue to its roster.

**Component:** `Teacher/ClassesScreen.js`

<img src="images/roles/teacher-TeacherClasses.png" width="390" alt="Teacher role — TeacherClasses synthetic UI preview" />

### Teacher: TeacherAttendance

Choose a class and enter the attendance workflow. This is a synthetic UI preview, not a saved attendance transaction.

**Component:** `Teacher/AttendanceScreen.js`

<img src="images/roles/teacher-TeacherAttendance.png" width="390" alt="Teacher role — TeacherAttendance synthetic UI preview" />

### Teacher: TeacherProfile

View the teacher account profile. The screenshot uses a Teacher account, not an unassigned/default account.

**Component:** `Profile/ProfileScreen.js`

<img src="images/roles/teacher-TeacherProfile.png" width="390" alt="Teacher role — TeacherProfile synthetic UI preview" />

### Teacher: Notifications

Review notices for the signed-in account. The empty inbox uses synthetic preview state; delivery and read-state persistence are not verified.

**Component:** `Notifications/NotificationsScreen.js`

<img src="images/roles/teacher-Notifications.png" width="390" alt="Teacher role — Notifications synthetic UI preview" />

### Teacher: TeacherSettings

View teacher app preferences. Missing feature routes now show an explicit availability message.

**Component:** `Settings/SettingsScreen.js`

<img src="images/roles/teacher-TeacherSettings.png" width="390" alt="Teacher role — TeacherSettings synthetic UI preview" />

### Teacher: NotificationDetail

Read the selected synthetic notice and view the acknowledgement control. No acknowledgement request was submitted.

**Component:** `Notifications/NotificationDetailScreen.js`

<img src="images/roles/teacher-NotificationDetail.png" width="390" alt="Teacher role — NotificationDetail synthetic UI preview" />

### Teacher: ClassStudents

Review two synthetic students in Grade 5 A. Student data is not from a real school database.

**Component:** `Teacher/ClassStudentsScreen.js`

<img src="images/roles/teacher-ClassStudents.png" width="390" alt="Teacher role — ClassStudents synthetic UI preview" />

### Teacher: StudentDetails

Inspect the student detail layout and quick actions. This component still contains source-defined mock academic/contact data; it is not a live student report.

**Component:** `Teacher/StudentDetailsScreen.js`

<img src="images/roles/teacher-StudentDetails.png" width="390" alt="Teacher role — StudentDetails synthetic UI preview" />

### Teacher: MarkAttendance

Choose P, A or L for a roster entry and access remarks/late controls. No attendance was saved; this screenshot does not prove backend persistence.

**Component:** `Teacher/MarkAttendanceScreen.js`

<img src="images/roles/teacher-MarkAttendance.png" width="390" alt="Teacher role — MarkAttendance synthetic UI preview" />

### Teacher: AttendanceReport

Inspect class/month attendance report controls. The preview does not supply a measured attendance history.

**Component:** `Teacher/AttendanceReportScreen.js`

<img src="images/roles/teacher-AttendanceReport.png" width="390" alt="Teacher role — AttendanceReport synthetic UI preview" />

### Teacher: Grades

Inspect grade-entry controls. The original component still uses built-in mock grades; grade persistence has not been implemented or verified by this change.

**Component:** `Teacher/GradesScreen.js`

<img src="images/roles/teacher-Grades.png" width="390" alt="Teacher role — Grades synthetic UI preview" />

### Teacher: TeacherDiaryList

Inspect the teacher’s diary list and filter controls. The screenshot shows an empty fixture list.

**Component:** `Teacher/TeacherDiaryListScreen.js`

<img src="images/roles/teacher-TeacherDiaryList.png" width="390" alt="Teacher role — TeacherDiaryList synthetic UI preview" />

### Teacher: CreateDiary

Prepare class/sections, subject and diary content. Native rich editing, camera/upload and publication are unverified; the browser uses a text-input adapter for the native editor.

**Component:** `Teacher/CreateDiaryScreen.js`

<img src="images/roles/teacher-CreateDiary.png" width="390" alt="Teacher role — CreateDiary synthetic UI preview" />

## Parent — 15 registered screen views

### Parent: ChildDashboard

Review the selected child’s dashboard and workflow entry points. Unsupported Homework/Reports destinations now show an availability message rather than dispatching a missing route.

**Component:** `Parent/ChildDashboardScreen.js`

<img src="images/roles/parent-ChildDashboard.png" width="390" alt="Parent role — ChildDashboard synthetic UI preview" />

### Parent: ChildAttendance

Inspect a child’s attendance totals/history and filters in an empty fixture state.

**Component:** `Parent/ChildAttendanceScreen.js`

<img src="images/roles/parent-ChildAttendance.png" width="390" alt="Parent role — ChildAttendance synthetic UI preview" />

### Parent: ChildGrades

Inspect child grade history and filters. The missing GradeReportDetail destination now produces an availability message; PDF generation remains unverified.

**Component:** `Parent/ChildGradesScreen.js`

<img src="images/roles/parent-ChildGrades.png" width="390" alt="Parent role — ChildGrades synthetic UI preview" />

### Parent: ChildDiary

Inspect diary date navigation and subject/teacher search. The query state is empty; no school diary was fetched.

**Component:** `Parent/ChildDiaryScreen.js`

<img src="images/roles/parent-ChildDiary.png" width="390" alt="Parent role — ChildDiary synthetic UI preview" />

### Parent: DiaryDetail

Read a synthetic diary entry. Browser HTML rendering substitutes for the native WebView and does not establish native parity.

**Component:** `Parent/DiaryDetailScreen.js`

<img src="images/roles/parent-DiaryDetail.png" width="390" alt="Parent role — DiaryDetail synthetic UI preview" />

### Parent: StudentFeeLedger

Inspect the child’s fee-ledger layout. Zero/empty fixtures are not verified financial records; no export or financial transaction occurred.

**Component:** `Parent/StudentFeeLedgerScreen.js`

<img src="images/roles/parent-StudentFeeLedger.png" width="390" alt="Parent role — StudentFeeLedger synthetic UI preview" />

### Parent: ChildrenList

Parent landing screen listing two synthetic linked children. Each child card exposes the child-specific workflows; live family/account linking is not tested.

**Component:** `Parent/ChildrenListScreen.js`

<img src="images/roles/parent-ChildrenList.png" width="390" alt="Parent role — ChildrenList synthetic UI preview" />

### Parent: Profile

Inspect the parent account’s profile. The screenshot now uses a Parent identity. Logout clears persisted local session keys and returns through the root authentication switch.

**Component:** `Profile/ProfileScreen.js`

<img src="images/roles/parent-Profile.png" width="390" alt="Parent role — Profile synthetic UI preview" />

### Parent: Settings

Inspect parent preferences. Unsupported features report their availability explicitly.

**Component:** `Settings/SettingsScreen.js`

<img src="images/roles/parent-Settings.png" width="390" alt="Parent role — Settings synthetic UI preview" />

### Parent: Notifications

Review notices for the signed-in account. The empty inbox uses synthetic preview state; delivery and read-state persistence are not verified.

**Component:** `Notifications/NotificationsScreen.js`

<img src="images/roles/parent-Notifications.png" width="390" alt="Parent role — Notifications synthetic UI preview" />

### Parent: NotificationDetail

Read the selected synthetic notice and view the acknowledgement control. No acknowledgement request was submitted.

**Component:** `Notifications/NotificationDetailScreen.js`

<img src="images/roles/parent-NotificationDetail.png" width="390" alt="Parent role — NotificationDetail synthetic UI preview" />

### Parent: ClassDiaryAndSow

Review class diary/scheme-of-work tabs and date controls. Native date picking, PDF/share and backend loading remain unverified.

**Component:** `Parent/ClassDiaryAndSowScreen.js`

<img src="images/roles/parent-ClassDiaryAndSow.png" width="390" alt="Parent role — ClassDiaryAndSow synthetic UI preview" />

### Parent: ComplaintList

Inspect the child’s complaint list in its empty state.

**Component:** `Parent/ComplaintListScreen.js`

<img src="images/roles/parent-ComplaintList.png" width="390" alt="Parent role — ComplaintList synthetic UI preview" />

### Parent: CreateComplaint

Prepare a complaint category, subject and details for the selected child. No complaint was submitted.

**Component:** `Parent/CreateComplaintScreen.js`

<img src="images/roles/parent-CreateComplaint.png" width="390" alt="Parent role — CreateComplaint synthetic UI preview" />

### Parent: ComplaintDetail

Inspect a synthetic complaint’s status, priority, student details and timeline.

**Component:** `Parent/ComplaintDetailScreen.js`

<img src="images/roles/parent-ComplaintDetail.png" width="390" alt="Parent role — ComplaintDetail synthetic UI preview" />

## Missing or unsupported role

The generic Default dashboard is no longer selected for these accounts. Refresh account reloads the server’s role metadata; Sign out clears the local session. Unknown roles are not promoted to Admin, Parent or Teacher.

<img src="images/roles/unassigned-access.png" width="390" alt="Unsupported role access recovery screen" />

## Checks and remaining limits

See [role-routing validation](ROLE_VALIDATION.md). No live school account, real student record, backend write, Firebase/Expo delivery, native build or device feature is certified by these screenshots. Source mock grades/student details and incomplete mobile features remain explicitly identified above.
