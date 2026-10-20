export type ReminderCategory =
  | 'assignment'
  | 'exam'
  | 'fee'
  | 'event'
  | 'meeting'
  | 'project'
  | 'personal'
  | 'important';

export type Priority = 'low' | 'medium' | 'high';

export type NotificationOffset =
  | 'at_time'
  | '10_min'
  | '30_min'
  | '1_hour'
  | '1_day';

export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface Reminder {
  id: string;
  title: string;
  description: string;
  category: ReminderCategory;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  priority: Priority;
  location?: string;
  notes?: string;
  repeatType: RepeatType;
  notificationTime: NotificationOffset;
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
  soundEnabled: boolean;
  startWeekOnMonday: boolean;
  darkMode: boolean;
  defaultNotificationTime: NotificationOffset;
}

export interface StudySession {
  id: string;
  reminderId?: string;
  taskTitle: string;
  category: ReminderCategory;
  durationMinutes: number;
  completedAt: string;
}

export interface QuickNote {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  updatedAt: string;
}

export const COLLEGE_BRANCHES = [
  'Computer Science & Engineering (CSE)',
  'Information Technology (IT)',
  'AI & Machine Learning (AIML)',
  'Data Science & Analytics',
  'Electronics & Communication (ECE)',
  'Electrical & Electronics (EEE)',
  'Mechanical Engineering',
  'Civil Engineering',
  'Computer Applications (BCA / MCA)',
  'Business Administration (BBA / MBA)',
  'Biotechnology',
  'Chemical Engineering',
  'Other / Interdisciplinary',
];

export const COLLEGE_SEMESTERS = [
  '1st Semester',
  '2nd Semester',
  '3rd Semester',
  '4th Semester',
  '5th Semester',
  '6th Semester',
  '7th Semester',
  '8th Semester',
  'Postgraduate Year 1',
  'Postgraduate Year 2',
];

export interface AppNotification {
  id: string;
  reminderId?: string;
  title: string;
  body: string;
  category: ReminderCategory;
  timestamp: string;
  read: boolean;
}

export interface CategoryInfo {
  id: ReminderCategory;
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
  darkBgColor: string;
  textColor: string;
  darkTextColor: string;
  borderColor: string;
}

export const CATEGORIES: Record<ReminderCategory, CategoryInfo> = {
  assignment: {
    id: 'assignment',
    label: 'Assignment',
    emoji: '📚',
    color: '#4F46E5', // indigo-600
    bgColor: 'bg-indigo-50',
    darkBgColor: 'dark:bg-indigo-950/40',
    textColor: 'text-indigo-700',
    darkTextColor: 'dark:text-indigo-300',
    borderColor: 'border-indigo-200 dark:border-indigo-800/60',
  },
  exam: {
    id: 'exam',
    label: 'Exam',
    emoji: '📝',
    color: '#E11D48', // rose-600
    bgColor: 'bg-rose-50',
    darkBgColor: 'dark:bg-rose-950/40',
    textColor: 'text-rose-700',
    darkTextColor: 'dark:text-rose-300',
    borderColor: 'border-rose-200 dark:border-rose-800/60',
  },
  fee: {
    id: 'fee',
    label: 'Fees',
    emoji: '💰',
    color: '#059669', // emerald-600
    bgColor: 'bg-emerald-50',
    darkBgColor: 'dark:bg-emerald-950/40',
    textColor: 'text-emerald-700',
    darkTextColor: 'dark:text-emerald-300',
    borderColor: 'border-emerald-200 dark:border-emerald-800/60',
  },
  event: {
    id: 'event',
    label: 'Event',
    emoji: '🎉',
    color: '#9333EA', // purple-600
    bgColor: 'bg-purple-50',
    darkBgColor: 'dark:bg-purple-950/40',
    textColor: 'text-purple-700',
    darkTextColor: 'dark:text-purple-300',
    borderColor: 'border-purple-200 dark:border-purple-800/60',
  },
  meeting: {
    id: 'meeting',
    label: 'Meeting',
    emoji: '📅',
    color: '#0284C7', // sky-600
    bgColor: 'bg-sky-50',
    darkBgColor: 'dark:bg-sky-950/40',
    textColor: 'text-sky-700',
    darkTextColor: 'dark:text-sky-300',
    borderColor: 'border-sky-200 dark:border-sky-800/60',
  },
  project: {
    id: 'project',
    label: 'Project',
    emoji: '📋',
    color: '#0D9488', // teal-600
    bgColor: 'bg-teal-50',
    darkBgColor: 'dark:bg-teal-950/40',
    textColor: 'text-teal-700',
    darkTextColor: 'dark:text-teal-300',
    borderColor: 'border-teal-200 dark:border-teal-800/60',
  },
  personal: {
    id: 'personal',
    label: 'Personal',
    emoji: '🎯',
    color: '#D97706', // amber-600
    bgColor: 'bg-amber-50',
    darkBgColor: 'dark:bg-amber-950/40',
    textColor: 'text-amber-700',
    darkTextColor: 'dark:text-amber-300',
    borderColor: 'border-amber-200 dark:border-amber-800/60',
  },
  important: {
    id: 'important',
    label: 'Important',
    emoji: '⚠️',
    color: '#DC2626', // red-600
    bgColor: 'bg-red-50',
    darkBgColor: 'dark:bg-red-950/40',
    textColor: 'text-red-700',
    darkTextColor: 'dark:text-red-300',
    borderColor: 'border-red-200 dark:border-red-800/60',
  },
};
