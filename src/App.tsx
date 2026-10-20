/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Reminder, ReminderCategory, StudentProfile, AppNotification } from './types';
import { StorageService } from './services/storage';
import { NotificationService } from './services/notifications';
import { AndroidFrame } from './components/AndroidFrame';
import { HeaderBar } from './components/HeaderBar';
import { BottomNav, NavTab } from './components/BottomNav';
import { AddEditModal } from './components/AddEditModal';
import { ReminderDetailsModal } from './components/ReminderDetailsModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { AndroidProjectViewer } from './components/AndroidProjectViewer';
import { OnboardingView } from './views/OnboardingView';
import { HomeDashboard } from './views/HomeDashboard';
import { TasksView, TaskTab } from './views/TasksView';
import { CalendarView } from './views/CalendarView';
import { InsightsView } from './views/InsightsView';
import { SettingsView } from './views/SettingsView';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [profile, setProfile] = useState<StudentProfile>(() => StorageService.getProfile());
  const [reminders, setReminders] = useState<Reminder[]>(() => StorageService.getReminders());
  const [notifications, setNotifications] = useState<AppNotification[]>(() => StorageService.getNotifications());

  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [tasksTabFilter, setTasksTabFilter] = useState<TaskTab>('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalCategory, setAddModalCategory] = useState<ReminderCategory | undefined>(undefined);
  const [initialEditReminder, setInitialEditReminder] = useState<Reminder | null>(null);
  const [selectedReminderForDetails, setSelectedReminderForDetails] = useState<Reminder | null>(null);

  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isAndroidCodeViewerOpen, setIsAndroidCodeViewerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Subscribe to storage changes
  const reloadData = useCallback(() => {
    setProfile(StorageService.getProfile());
    setReminders(StorageService.getReminders());
    setNotifications(StorageService.getNotifications());
  }, []);

  useEffect(() => {
    const unsubscribe = StorageService.subscribe(reloadData);
    return () => unsubscribe();
  }, [reloadData]);

  // Periodic scheduled notification checking
  useEffect(() => {
    NotificationService.checkDueReminders();
    const interval = setInterval(() => {
      NotificationService.checkDueReminders();
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 3000);
  };

  // Reminder Actions
  const handleToggleComplete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newStatus = StorageService.toggleComplete(id);
    showToast(newStatus ? 'Task marked as completed! 🎉' : 'Task marked as incomplete');
    if (selectedReminderForDetails && selectedReminderForDetails.id === id) {
      setSelectedReminderForDetails({
        ...selectedReminderForDetails,
        completed: newStatus,
      });
    }
  };

  const handleSaveReminder = (reminder: Reminder) => {
    StorageService.saveReminder(reminder);
    setIsAddModalOpen(false);
    setInitialEditReminder(null);
    showToast('Reminder saved successfully!');
  };

  const handleDeleteReminder = (id: string) => {
    StorageService.deleteReminder(id);
    setSelectedReminderForDetails(null);
    showToast('Reminder removed.');
  };

  const handleOpenAddModal = (category?: ReminderCategory, dateStr?: string) => {
    setAddModalCategory(category);
    setInitialEditReminder(
      dateStr
        ? ({
            id: '',
            title: '',
            description: '',
            category: category || 'assignment',
            date: dateStr,
            time: '10:00',
            priority: 'medium',
            notificationTime: '1_hour',
            repeatType: 'none',
            completed: false,
            createdAt: '',
            updatedAt: '',
          } as Reminder)
        : null
    );
    setIsAddModalOpen(true);
  };

  const handleEditReminder = (reminder: Reminder) => {
    setInitialEditReminder(reminder);
    setAddModalCategory(reminder.category);
    setIsAddModalOpen(true);
  };

  const handleUpdateProfile = (updated: Partial<StudentProfile>) => {
    const saved = StorageService.saveProfile(updated);
    setProfile(saved);
  };

  const handleToggleDarkMode = () => {
    handleUpdateProfile({ darkMode: !profile.darkMode });
  };

  const handleSelectReminderFromNotif = (reminderId: string) => {
    const match = reminders.find((r) => r.id === reminderId);
    if (match) {
      setSelectedReminderForDetails(match);
    }
  };

  // Header Titles
  const getHeaderTitle = () => {
    switch (currentTab) {
      case 'home':
        return 'ReminderHub';
      case 'tasks':
        return 'Tasks & Deadlines';
      case 'calendar':
        return 'Academic Calendar';
      case 'insights':
        return 'Student Insights';
      case 'settings':
        return 'Settings & Profile';
      default:
        return 'ReminderHub';
    }
  };

  const getHeaderSubtitle = () => {
    switch (currentTab) {
      case 'home':
        return 'Never miss what matters';
      case 'tasks':
        return `${reminders.filter((r) => !r.completed).length} active items`;
      case 'calendar':
        return 'Monthly schedule view';
      case 'insights':
        return 'Local productivity stats';
      case 'settings':
        return 'App preferences & backup';
      default:
        return undefined;
    }
  };

  // Unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Sync dark mode class with root html element for real system-wide dark mode
  useEffect(() => {
    if (profile.darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [profile.darkMode]);

  return (
    <AndroidFrame darkMode={profile.darkMode}>
      {/* If onboarding not completed, render Onboarding flow */}
      {!profile.onboardingCompleted ? (
        <OnboardingView onComplete={() => handleUpdateProfile({ onboardingCompleted: true })} />
      ) : isAndroidCodeViewerOpen ? (
        <AndroidProjectViewer
          onBack={() => setIsAndroidCodeViewerOpen(false)}
          onShowToast={showToast}
        />
      ) : (
        <div className="flex-1 flex flex-col h-full relative">
          {/* Top Bar */}
          <HeaderBar
            title={getHeaderTitle()}
            subtitle={getHeaderSubtitle()}
            unreadNotificationsCount={unreadCount}
            onOpenNotifications={() => {
              setIsNotificationDrawerOpen(true);
              StorageService.markNotificationsAsRead();
            }}
            onOpenSearch={() => {
              setCurrentTab('tasks');
            }}
            darkMode={profile.darkMode}
            onToggleDarkMode={handleToggleDarkMode}
          />

          {/* Main Scrollable View Area */}
          <div className="flex-1 overflow-y-auto flex flex-col">
            {currentTab === 'home' && (
              <HomeDashboard
                reminders={reminders}
                profile={profile}
                onToggleComplete={handleToggleComplete}
                onSelectReminder={(r) => setSelectedReminderForDetails(r)}
                onOpenAddModalWithCategory={(cat) => handleOpenAddModal(cat)}
                onNavigateToTab={(tab) => setCurrentTab(tab)}
                onSetTasksFilter={(f) => setTasksTabFilter(f)}
              />
            )}

            {currentTab === 'tasks' && (
              <TasksView
                reminders={reminders}
                onToggleComplete={handleToggleComplete}
                onSelectReminder={(r) => setSelectedReminderForDetails(r)}
                onOpenAddModal={() => handleOpenAddModal()}
                initialTab={tasksTabFilter}
              />
            )}

            {currentTab === 'calendar' && (
              <CalendarView
                reminders={reminders}
                onToggleComplete={handleToggleComplete}
                onSelectReminder={(r) => setSelectedReminderForDetails(r)}
                onOpenAddModalWithDate={(d) => handleOpenAddModal(undefined, d)}
                startWeekOnMonday={profile.startWeekOnMonday}
              />
            )}

            {currentTab === 'insights' && (
              <InsightsView reminders={reminders} onShowToast={showToast} />
            )}

            {currentTab === 'settings' && (
              <SettingsView
                profile={profile}
                onUpdateProfile={handleUpdateProfile}
                onOpenCodeViewer={() => setIsAndroidCodeViewerOpen(true)}
                onShowToast={showToast}
              />
            )}
          </div>

          {/* Bottom Navigation */}
          <BottomNav
            currentTab={currentTab}
            onChangeTab={(t) => setCurrentTab(t)}
            onOpenAddModal={() => handleOpenAddModal()}
          />
        </div>
      )}

      {/* Add / Edit Reminder Modal */}
      <AddEditModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setInitialEditReminder(null);
        }}
        onSave={handleSaveReminder}
        initialReminder={initialEditReminder}
        defaultCategory={addModalCategory}
      />

      {/* Reminder Details Modal */}
      <ReminderDetailsModal
        reminder={selectedReminderForDetails}
        isOpen={!!selectedReminderForDetails}
        onClose={() => setSelectedReminderForDetails(null)}
        onToggleComplete={handleToggleComplete}
        onEdit={handleEditReminder}
        onDelete={handleDeleteReminder}
      />

      {/* Notification Shade Drawer */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        notifications={notifications}
        onClear={() => StorageService.clearNotifications()}
        onSelectReminder={handleSelectReminderFromNotif}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 text-xs font-semibold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150 pointer-events-none">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </AndroidFrame>
  );
}
