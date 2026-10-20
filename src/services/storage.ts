import { Reminder, StudentProfile, AppNotification, StudySession, QuickNote } from '../types';
import { getInitialDemoReminders } from '../data/demoData';

const REMINDERS_KEY = 'reminderhub_reminders_v1';
const PROFILE_KEY = 'reminderhub_profile_v1';
const NOTIFICATIONS_KEY = 'reminderhub_notifications_v1';

export const DEFAULT_PROFILE: StudentProfile = {
  name: 'Rahul Sharma',
  college: 'National Institute of Technology',
  course: 'Computer Science & Engineering',
  semester: '5th Semester',
  onboardingCompleted: false,
  notificationsEnabled: true,
  soundEnabled: true,
  startWeekOnMonday: true,
  darkMode: false,
  defaultNotificationTime: '1_hour',
};

// Dispatch storage change event to keep views reactive across components
const notifyChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('reminderhub_store_change'));
  }
};

export const StorageService = {
  getProfile(): StudentProfile {
    try {
      const data = localStorage.getItem(PROFILE_KEY);
      if (data) {
        return { ...DEFAULT_PROFILE, ...JSON.parse(data) };
      }
    } catch (err) {
      console.error('Error reading profile:', err);
    }
    return DEFAULT_PROFILE;
  },

  saveProfile(profile: Partial<StudentProfile>): StudentProfile {
    const current = this.getProfile();
    const updated = { ...current, ...profile };
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
      notifyChange();
    } catch (err) {
      console.error('Error saving profile:', err);
    }
    return updated;
  },

  getReminders(): Reminder[] {
    try {
      const data = localStorage.getItem(REMINDERS_KEY);
      if (data) {
        return JSON.parse(data);
      }
      // First run: load initial demo data
      const initial = getInitialDemoReminders();
      localStorage.setItem(REMINDERS_KEY, JSON.stringify(initial));
      return initial;
    } catch (err) {
      console.error('Error reading reminders:', err);
      return getInitialDemoReminders();
    }
  },

  saveReminder(reminder: Reminder): Reminder {
    const list = this.getReminders();
    const index = list.findIndex((r) => r.id === reminder.id);
    let updatedList: Reminder[];
    const nowIso = new Date().toISOString();

    if (index >= 0) {
      updatedList = [...list];
      updatedList[index] = { ...reminder, updatedAt: nowIso };
    } else {
      updatedList = [
        {
          ...reminder,
          id: reminder.id || `rem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          createdAt: reminder.createdAt || nowIso,
          updatedAt: nowIso,
        },
        ...list,
      ];
    }

    try {
      localStorage.setItem(REMINDERS_KEY, JSON.stringify(updatedList));
      notifyChange();
    } catch (err) {
      console.error('Error saving reminder:', err);
    }
    return reminder;
  },

  toggleComplete(id: string): boolean {
    const list = this.getReminders();
    const index = list.findIndex((r) => r.id === id);
    if (index === -1) return false;

    const currentStatus = list[index].completed;
    const newStatus = !currentStatus;
    list[index] = {
      ...list[index],
      completed: newStatus,
      updatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(REMINDERS_KEY, JSON.stringify(list));
      notifyChange();
    } catch (err) {
      console.error('Error toggling reminder status:', err);
    }
    return newStatus;
  },

  deleteReminder(id: string): boolean {
    const list = this.getReminders();
    const filtered = list.filter((r) => r.id !== id);
    try {
      localStorage.setItem(REMINDERS_KEY, JSON.stringify(filtered));
      notifyChange();
      return true;
    } catch (err) {
      console.error('Error deleting reminder:', err);
      return false;
    }
  },

  clearCompleted(): number {
    const list = this.getReminders();
    const active = list.filter((r) => !r.completed);
    const removedCount = list.length - active.length;
    try {
      localStorage.setItem(REMINDERS_KEY, JSON.stringify(active));
      notifyChange();
    } catch (err) {
      console.error('Error clearing completed:', err);
    }
    return removedCount;
  },

  clearAll(): void {
    try {
      localStorage.setItem(REMINDERS_KEY, JSON.stringify([]));
      notifyChange();
    } catch (err) {
      console.error('Error clearing all reminders:', err);
    }
  },

  resetDemoData(): void {
    const demo = getInitialDemoReminders();
    try {
      localStorage.setItem(REMINDERS_KEY, JSON.stringify(demo));
      notifyChange();
    } catch (err) {
      console.error('Error resetting demo data:', err);
    }
  },

  // In-app Notifications
  getNotifications(): AppNotification[] {
    try {
      const data = localStorage.getItem(NOTIFICATIONS_KEY);
      if (data) return JSON.parse(data);
    } catch (err) {
      console.error('Error reading notifications:', err);
    }
    return [];
  },

  addNotification(notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>): AppNotification {
    const current = this.getNotifications();
    const newItem: AppNotification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    const updated = [newItem, ...current].slice(0, 50); // Keep last 50
    try {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
      notifyChange();
    } catch (err) {
      console.error('Error saving notification:', err);
    }
    return newItem;
  },

  markNotificationsAsRead(): void {
    const current = this.getNotifications();
    const updated = current.map((n) => ({ ...n, read: true }));
    try {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
      notifyChange();
    } catch (err) {
      console.error('Error marking notifications as read:', err);
    }
  },

  clearNotifications(): void {
    try {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([]));
      notifyChange();
    } catch (err) {
      console.error('Error clearing notifications:', err);
    }
  },

  // Export / Import
  exportBackupJson(): string {
    const data = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      profile: this.getProfile(),
      reminders: this.getReminders(),
    };
    return JSON.stringify(data, null, 2);
  },

  importBackupJson(jsonString: string): { success: boolean; count?: number; error?: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.reminders || !Array.isArray(parsed.reminders)) {
        return { success: false, error: 'Invalid file format: missing reminders array.' };
      }
      localStorage.setItem(REMINDERS_KEY, JSON.stringify(parsed.reminders));
      if (parsed.profile) {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(parsed.profile));
      }
      notifyChange();
      return { success: true, count: parsed.reminders.length };
    } catch (err) {
      return { success: false, error: 'Failed to parse JSON file.' };
    }
  },

  // Study Sessions (Pomodoro)
  getStudySessions(): StudySession[] {
    try {
      const data = localStorage.getItem('reminderhub_study_sessions_v1');
      if (data) return JSON.parse(data);
      // Default demo sessions
      const demoSessions: StudySession[] = [
        {
          id: 'session-1',
          taskTitle: 'Submit DBMS Assignment 4',
          category: 'assignment',
          durationMinutes: 50,
          completedAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 'session-2',
          taskTitle: 'Java Internal Exam',
          category: 'exam',
          durationMinutes: 75,
          completedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        },
        {
          id: 'session-3',
          taskTitle: 'Capstone Project Review Phase 1',
          category: 'project',
          durationMinutes: 25,
          completedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
      ];
      localStorage.setItem('reminderhub_study_sessions_v1', JSON.stringify(demoSessions));
      return demoSessions;
    } catch (err) {
      console.error('Error reading study sessions:', err);
    }
    return [];
  },

  addStudySession(session: Omit<StudySession, 'id' | 'completedAt'>): StudySession {
    const current = this.getStudySessions();
    const newSession: StudySession = {
      ...session,
      id: `session-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      completedAt: new Date().toISOString(),
    };
    const updated = [newSession, ...current];
    try {
      localStorage.setItem('reminderhub_study_sessions_v1', JSON.stringify(updated));
      notifyChange();
    } catch (err) {
      console.error('Error saving study session:', err);
    }
    return newSession;
  },

  clearStudySessions(): void {
    try {
      localStorage.setItem('reminderhub_study_sessions_v1', JSON.stringify([]));
      notifyChange();
    } catch (err) {
      console.error('Error clearing study sessions:', err);
    }
  },

  // Quick Notes
  getQuickNotes(): QuickNote[] {
    try {
      const data = localStorage.getItem('reminderhub_quick_notes_v1');
      if (data) return JSON.parse(data);
      // Default demo notes
      const demoNotes: QuickNote[] = [
        {
          id: 'note-1',
          title: 'Prof. Sharma Office Hours',
          content: 'Wednesdays 3:00 PM – 5:00 PM in Block C, Room 104. Bring NOC form for summer internship credit sign-off.',
          pinned: true,
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 'note-2',
          title: 'DBMS Submission Portal Credentials',
          content: 'Upload PDF format with Roll No prefix: 21BCE049_Assignment4.pdf. Max file size: 15MB.',
          pinned: false,
          updatedAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem('reminderhub_quick_notes_v1', JSON.stringify(demoNotes));
      return demoNotes;
    } catch (err) {
      console.error('Error reading quick notes:', err);
    }
    return [];
  },

  saveQuickNote(note: Partial<QuickNote> & { content: string }): QuickNote {
    const list = this.getQuickNotes();
    const nowIso = new Date().toISOString();
    let updatedList: QuickNote[];
    let savedNote: QuickNote;

    if (note.id) {
      const idx = list.findIndex((n) => n.id === note.id);
      if (idx >= 0) {
        savedNote = {
          ...list[idx],
          ...note,
          updatedAt: nowIso,
        };
        updatedList = [...list];
        updatedList[idx] = savedNote;
      } else {
        savedNote = {
          id: note.id,
          title: note.title || 'Quick Note',
          content: note.content,
          pinned: note.pinned ?? false,
          updatedAt: nowIso,
        };
        updatedList = [savedNote, ...list];
      }
    } else {
      savedNote = {
        id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title: note.title || 'Quick Note',
        content: note.content,
        pinned: note.pinned ?? false,
        updatedAt: nowIso,
      };
      updatedList = [savedNote, ...list];
    }

    try {
      localStorage.setItem('reminderhub_quick_notes_v1', JSON.stringify(updatedList));
      notifyChange();
    } catch (err) {
      console.error('Error saving quick note:', err);
    }
    return savedNote;
  },

  deleteQuickNote(id: string): boolean {
    const list = this.getQuickNotes();
    const filtered = list.filter((n) => n.id !== id);
    try {
      localStorage.setItem('reminderhub_quick_notes_v1', JSON.stringify(filtered));
      notifyChange();
      return true;
    } catch (err) {
      console.error('Error deleting quick note:', err);
      return false;
    }
  },

  togglePinQuickNote(id: string): void {
    const list = this.getQuickNotes();
    const note = list.find((n) => n.id === id);
    if (note) {
      note.pinned = !note.pinned;
      note.updatedAt = new Date().toISOString();
      try {
        localStorage.setItem('reminderhub_quick_notes_v1', JSON.stringify(list));
        notifyChange();
      } catch (err) {
        console.error('Error toggling pin:', err);
      }
    }
  },

  subscribe(callback: () => void): () => void {
    if (typeof window === 'undefined') return () => {};
    window.addEventListener('reminderhub_store_change', callback);
    return () => {
      window.removeEventListener('reminderhub_store_change', callback);
    };
  },
};
