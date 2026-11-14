# Mobile role routing validation

Reviewed 14 November 2026.

## Fixed

- Root routing now recognizes role field casing and numeric/string Teacher (3)/Parent (4) IDs, plus Admin/Administrator/Super Admin role names. Conflicting, missing and unknown roles show an access-recovery screen.
- Added a dedicated Admin navigator with an Admin landing page and existing notification/profile/settings screens. There were no mobile Admin record editors in the supplied app; none are claimed complete.
- Normalized API/cached credential metadata and removed duplicate root token-validation initialization. The application entry owns authentication initialization.
- Profile links now resolve for all three roles. Buttons for absent features show availability messages instead of navigating to missing screens.
- Profile/drawer logout uses the async session cleanup instead of only clearing Redux memory. It no longer navigates to a nonexistent Login child route.
- Notification cleanup failure no longer prevents normal local logout cleanup. App startup catches initialization failure instead of remaining permanently on its startup loader. Notification initialization rejection is handled.
- Removed the invalid `expo prestart` lifecycle command.
- Replaced the mobile gallery with role-scoped registered screens and removed unused prototype captures from the current branch.

## Checks run

- **64 passing Node tests:** role field/type variants, role-name aliases, unknown/conflicting roles, normalization, root-role contract, registered navigation targets and logout target regression. Run `npm run test:roles` in `SchoolManagementApp/` with Node 22+.
- **34 supplementary isolated checks:** rendered the actual root navigator with mocked native navigators/selectors; exercised the actual Redux auth thunks/reducer through login, storage restore and logout for Admin, Teacher, Parent and unassigned accounts using mocked API and memory storage; parsed all changed JSX.
- **34 role-scoped UI captures:** Admin 5, Teacher 14, Parent 15. Each uses a matching synthetic role identity and a screen listed in that role’s navigator. The shared sign-in and missing-role recovery views are also documented.

These checks do not validate live authentication, SQL writes, backend permission enforcement, native drawer/tab gestures, Android/iOS builds, push notifications, PDF/share/camera integrations or data accuracy. The preview harness was not shipped in application source. Frontend role checks do not grant server permissions.

## Remaining implementation gaps

The original Teacher Grades and Student Details components still include built-in mock data. Several account/report/homework features have no screen/backend implementation; they now show a clear availability message. Settings contains other prototype preferences that need integration work. The gallery records these limits and does not describe the entire application as production-ready.
