# School Management System

[![ASP.NET Core](https://img.shields.io/badge/ASP.NET%20Core-8.0-blue.svg)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-18-cyan.svg)](https://react.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-Expo-black.svg)](https://expo.dev/)
[![Database](https://img.shields.io/badge/SQL%20Server-Multi--Tenant-red.svg)](https://www.microsoft.com/sql-server)
[![License](https://img.shields.io/badge/License-Proprietary-darkgray.svg)](#)

A complete enterprise educational administration and campus communication platform engineered with an **ASP.NET Core multi-tenant backend**, a **React/Vite administrative web portal**, and an **Expo/React Native cross-platform mobile app** for parents and faculty.

---

## 🌟 System Overview & Multi-Tenant Architecture

The system coordinates daily academic and administrative operations across three synchronized subsystems:

```
SchoolManagement/
├── school-management-Backend/                 # ASP.NET Core Web API, EF Core & Multi-Tenant Engine
│   ├── Controllers/                          # REST API Endpoints (Students, Attendance, Lectures, Gallery, etc.)
│   ├── Services/                             # Background workers, Expo/Firebase push notifications
│   ├── Data/                                 # MultiTenantDbContext & dynamic database resolvers
│   └── Models/                               # Domain models & multi-tenant configurations
├── materially-free-react-admin-template-1.0.0/ # React / Vite Web Admin Console
│   └── src/views/                            # Interactive administration modules & analytics
└── SchoolManagementApp/                       # Expo / React Native Mobile Application
    └── src/screens/                          # Parent & Teacher native mobile workflows
```

---

## 📸 Complete Application Pages & UI Walkthrough

Below is the comprehensive operational guide explaining every page and module across the Web Portal and Mobile App.

---

### 1. Administrative Web Portal Modules

#### 1.1 Executive Campus Analytics & Attendance Dashboard
- **Purpose**: Provides principals, directors, and head administrators with a bird's-eye view of school attendance health, fee collections, and staff presence.
- **How it Works**: Aggregates real-time campus statistics including daily student check-ins, unauthorized absences, teacher attendance, pending parent complaints, and scheduled notification broadcasts. Features interactive charts for monthly enrollment trends.

#### 1.2 Student Directory & Lifecycle Enrollment
- **Purpose**: Master registry of all enrolled learners across campuses.
- **How it Works**: Displays searchable, filterable student records: Admission Number, Full Name, Father Name, Contact Mobile, Campus, Class, and Section. Allows admissions staff to register new students, update contact details, upload profile photos, and assign guardian relationships.

#### 1.3 Faculty & Teacher Roster Management
- **Purpose**: Staff administration and academic subject distribution.
- **How it Works**: Records teacher credentials, qualification records, department assignments, and assigned class teacher responsibilities. Facilitates scheduling and proxy management.

#### 1.4 Academic Structure: Campuses, Classes & Sections
- **Purpose**: Hierarchical configuration of the institution's academic branches.
- **How it Works**: Manages multi-campus branches, academic years, grade tiers (Pre-School through Grade 12), and section divisions with capacity ceilings.

#### 1.5 Student Daily Attendance & Absence Auditing
- **Purpose**: Accurate classroom attendance recording and instant parent notification.
- **How it Works**: Teachers mark roll calls digitally. The system automatically identifies absent students and triggers automated SMS / Expo Push notifications to parents' smartphones via `BackgroundNotificationService`.

#### 1.6 Digital Academic Diary & Homework Portal
- **Purpose**: Eliminates paper school diaries by publishing daily classroom work and homework digitally.
- **How it Works**: Teachers author daily homework assignments, subject topics covered, and submission due dates. Immediately synced to parents' mobile app with push notifications.

#### 1.7 Examination Grades & Report Cards
- **Purpose**: Exam evaluation, marks calculation, and term progress card issuance.
- **How it Works**: Records scores for quizzes, midterms, and finals. Computes GPA, percentages, and class positions, generating printable progress report cards.

#### 1.8 Automated Push Notification Engine & Cron Scheduler
- **Purpose**: Rules-based campus alerts and scheduled event dispatch.
- **How it Works**: Configures cron-based notification rules (e.g., fee reminders on the 5th of every month, holiday alerts). Dispatches notifications via Expo Push and Firebase Cloud Messaging (FCM).

#### 1.9 Curated Video Lectures & YouTube Curriculum Portal
- **Purpose**: E-learning portal providing recorded video lectures for absent students or revision.
- **How it Works**: Teachers upload or link curriculum-aligned YouTube video lessons categorized by Subject, Chapter, and Topic. The mobile app renders lessons via `CustomVideoPlayer.js`.

#### 1.10 Campus Photo Gallery & Event Media Albums
- **Purpose**: Showcases sports days, science fairs, annual functions, and campus events to parents.
- **How it Works**: Organizes photo albums with compression pipelines (`mediaCompression.js`), accessible in the parent app gallery.

#### 1.11 Student Performance & Behavioral Analytics
- **Purpose**: Holistic student performance evaluation combining academics, attendance, and conduct.
- **How it Works**: Visual progress charts tracking assignment completion rates, test trends, and teacher behavioral remarks.

---

### 2. Mobile App (Parent & Teacher Workflows)

#### 2.1 Multi-Child Parent Dashboard
- **Purpose**: Single sign-on for parents with multiple children enrolled in different classes.
- **How it Works**: Allows instant child switching with individual attendance cards, diary updates, and upcoming exam schedules.

#### 2.2 Native Mobile Video Player & Lectures
- **Purpose**: Mobile-optimized revision experience.
- **How it Works**: Streams class lectures directly on smartphones with playback speed controls, chapter navigation, and offline caching.

#### 2.3 Teacher Mobile Attendance & Diary Quick-Entry
- **Purpose**: Enables faculty to mark classroom attendance and broadcast homework directly from mobile devices without requiring a PC.
- **How it Works**: Rapid tap-to-toggle attendance list with instant bulk submission to `AttendanceController`.

---

## 🛠️ Technology Stack & Prerequisites

- **Backend Framework**: .NET 8.0 Web API (C# 12)
- **Database Engine**: Microsoft SQL Server with dynamic multi-tenant connection resolution (`DatabaseResolver.cs`)
- **Web Frontend**: React 18, Vite, Material UI (MUI), Redux Toolkit
- **Mobile Client**: React Native, Expo, React Navigation, Redux Toolkit
- **Push Notification Pipeline**: Expo Server SDK & Firebase Cloud Messaging (FCM v1)
- **Media Engine**: Native YouTube Embeds & Custom Video Player

---

## 🚀 Setup & Execution Guide

### 1. Backend API
```powershell
cd school-management-Backend
dotnet restore
dotnet build -c Release
dotnet run -c Release
```

### 2. React Admin Web Portal
```powershell
cd materially-free-react-admin-template-1.0.0
npm ci
npm start
```

### 3. React Native Mobile App
```powershell
cd SchoolManagementApp
npm ci
npx expo start
```

---

## 🔒 Security & Data Privacy

- Real student records, parent contact numbers, and Firebase service-account private keys are excluded from version control.
- Ensure production SQL databases utilize encrypted connection strings with TLS certificates.
