# ReminderHub – Student Reminder & Planner

A modern, production-grade Android-styled student productivity application built to help college students stay organized, track academic deadlines (assignments, exams, fees, tech fests, projects), and build consistent study habits with smart local insights, calendar views, and local notifications.

## User Review & Critical Decisions

> [!IMPORTANT]
> The app is architected with a dual-value delivery:
> 1. **Immediate Interactive Mobile App**: A polished, mobile-first Android experience running directly in the browser/PWA with local notifications, monthly calendar, task filters, student dashboard, and smart insights.
> 2. **Complete Native Android Project Exporter**: A dedicated developer panel inside the app containing the complete, production-ready Kotlin + Jetpack Compose + Room + WorkManager Android codebase (`com.example.reminderhub`) with Gradle files, Room entities/DAOs, and a 1-click ZIP export + step-by-step APK build guide.

- **Storage**: Client-side persistent local storage with automatic demo data seeding and JSON backup/restore.
- **Theme & Aesthetic**: Modern Material 3 Indigo/Violet academic palette with dark/light mode toggle, soft rounded geometry (`rounded-2xl`), and high outdoor daylight contrast.
- **Local Intelligence**: Zero external API dependencies; deadline velocity, busiest day, and 48-hour urgent alerts are derived locally from stored tasks.

---

## 1. Overview & Core Concept

- **What It Does**: ReminderHub allows college students to organize academic commitments across 8 categories (Assignment, Exam, Fees, Event, Meeting, Project, Personal, Important), set multi-interval reminders, visualize schedules on a monthly calendar, and track deadlines via a statistics dashboard.
- **Target Persona**: Undergraduate & graduate college students balancing multiple course assignments, lab submissions, exam dates, fee deadlines, and club activities.
- **Key Value**: "Never miss what matters" – eliminates missed academic deadlines through timely notifications, deadline countdowns, and proactive local insights.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **First Launch & Onboarding**:
   - 3-step carousel: *Stay Organized* -> *Never Miss a Deadline* -> *Plan Your Student Life*.
   - Student profile setup (Name, College, Course, Semester) and notification permission opt-in.
   - Option to load realistic college demo data or start empty.
2. **Dashboard & Quick Capture**:
   - Personalized greeting, dynamic date, and motivational campus quote.
   - 4 Metric cards: *Due Today*, *Upcoming*, *Completed*, *Overdue* with instant filtering.
   - 5 Quick Action chips (+ Assignment, + Exam, + Fee, + Event, + Task) to open the Add modal with category pre-filled.
   - Today's tasks with checkbox completion animations and urgent countdowns.
3. **Task Management & Filtering**:
   - Dedicated Tasks tab with segmented controls: *All*, *Today*, *Upcoming*, *Completed*, *Overdue*.
   - Live search (title, description, category, location) and dropdown filters for category and priority.
4. **Monthly Calendar**:
   - Interactive calendar with previous/next month navigation, "Today" jump button, and colored dots indicating scheduled tasks.
   - Day selection reveals cards for that exact day.
5. **Smart Student Insights**:
   - Local analytics: Deadlines this week, busiest day calculation, 48-hour deadline warning, and praise messages for completed tasks.
6. **Settings & Native Code Hub**:
   - Profile management, dark/light theme toggle, notification preferences.
   - Backup/restore JSON and complete Android source code explorer with 1-click project zip download.

### Visual Identity & Theme Tokens

- **Aesthetic**: Material You / Material Design 3 student utility with crisp typography, soft shadows, and clean unboxed metadata.
- **Palette**:
  - Primary: Deep Indigo (`#4F46E5` / Tailwind `indigo-600`)
  - Accent / Highlights: Violet (`#7C3AED` / Tailwind `violet-600`)
  - Semantic Status: Emerald for Fees & Completed, Amber/Rose for Exams & High Priority, Sky for Meetings.
  - Surfaces: Slate-50 / Slate-900 with subtle 1px border dividers.
- **Typography**: Clean neo-grotesque hierarchy with `font-sans` for readability and `tabular-nums` for timers and counters.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full Interactive App + Native Kotlin Code Exporter**
  - *Chosen Approach*: Deliver both the live functional app in the web environment and the complete Kotlin/Compose/Room project files in an in-app viewer with 1-click project export.
  - *Why*: Satisfies both the immediate browser review requirement and the native Android APK build requirement.
- **Decision 2: Local In-Memory & LocalStorage Architecture**
  - *Chosen Approach*: Typed TypeScript repository with event subscriptions and JSON persistence.
  - *Why*: Instant offline functionality, zero setup friction, and resilient data retention across reloads.
- **Decision 3: Zero-API Local Insights Engine**
  - *Chosen Approach*: Deterministic statistical analysis of the active task array (grouping by date, priority, and completion).
  - *Why*: Guarantees 100% privacy, instantaneous calculations, and zero network dependency.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                         ReminderHub Architecture                       │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌───────────────────────┐          ┌───────────────────────────────┐  │
│  │    App Shell & UI     │          │        Data & State           │  │
│  │ ───────────────────── │          │ ───────────────────────────── │  │
│  │ • Top App Bar (Title) │          │ • ReminderStore (Persistence) │  │
│  │ • Android Frame/View  │ ◄──────► │ • LocalStorage Engine         │  │
│  │ • Bottom Nav (5 tabs) │          │ • Notification Engine         │  │
│  │ • Global FAB Modal    │          │ • Insights Calculation Engine │  │
│  └───────────────────────┘          └───────────────────────────────┘  │
│             │                                       │                  │
│             ▼                                       ▼                  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Primary Views                                                    │  │
│  │ • HomeDashboard (Stats, Today's list, Quick Actions)             │  │
│  │ • TaskList (All/Today/Upcoming/Completed/Overdue, Filters)       │  │
│  │ • CalendarView (Interactive Month Grid, Day Selection)           │  │
│  │ • InsightsView (Busiest Day, Week Deadlines, Streak, Charts)     │  │
│  │ • SettingsView (Profile, Theme, Backup, Demo Reset)              │  │
│  │ • AndroidProjectViewer (Kotlin/Compose/Room source tree & APK)   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Models

```typescript
export interface Reminder {
  id: string;
  title: string;
  description: string;
  category: 'assignment' | 'exam' | 'fee' | 'event' | 'meeting' | 'project' | 'personal' | 'important';
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  priority: 'low' | 'medium' | 'high';
  location?: string;
  notes?: string;
  repeatType: 'none' | 'daily' | 'weekly' | 'monthly';
  notificationTime: 'at_time' | '10_min' | '30_min' | '1_hour' | '1_day';
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StudentProfile {
  name: string;
  college: string;
  course: string;
  semester: string;
  onboardingCompleted: boolean;
  notificationsEnabled: boolean;
  startWeekOnMonday: boolean;
  darkMode: boolean;
}
```

---

## 5. Implementation Steps

1. **Core Types & Storage Engine**: Setup `types.ts`, `storage.ts`, and initial realistic college demo data.
2. **Notification & Sound Service**: Web Notification API integration with audio feedback and simulated Android status notifications.
3. **Components & Layout**:
   - Android Status Bar & Top App Bar
   - Bottom Navigation Bar with 5 tabs and active indicators
   - Floating Action Button (FAB) and Add/Edit Reminder Sheet
   - Reminder Card with interactive completion checkbox and countdown badge
   - Reminder Details Drawer with edit/delete confirmation
4. **Primary Screens**:
   - `Onboarding`: 3-step carousel with profile setup.
   - `HomeDashboard`: Summary metrics, quick action triggers, urgent deadlines.
   - `TasksView`: Category and priority filtering, search, sorting.
   - `CalendarView`: Month grid with task date badges.
   - `InsightsView`: Local smart student metrics.
   - `SettingsView`: Profile editor, data export/import, theme toggle.
   - `AndroidProjectViewer`: Complete Kotlin / Jetpack Compose / Room code tree with APK build guide and export button.
5. **App Entry & Verification**: Connect all navigation in `src/App.tsx`, update `metadata.json` and `index.html`, and verify compilation with `compile_applet`.
