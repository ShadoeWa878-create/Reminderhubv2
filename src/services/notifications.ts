import { Reminder, NotificationOffset } from '../types';
import { StorageService } from './storage';

// Synthesize pleasant Android chime using Web Audio API (100% offline, zero external files)
export const playNotificationSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    
    // Tone 1: 587.33 Hz (D5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.25);

    // Tone 2: 880 Hz (A5)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.12);
    gain2.gain.setValueAtTime(0.2, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.45);
  } catch (err) {
    console.warn('AudioContext not allowed or not supported yet:', err);
  }
};

export const NotificationService = {
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support system notifications.');
      return 'denied';
    }
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (err) {
      console.error('Error requesting notification permission:', err);
      return 'denied';
    }
  },

  getPermissionStatus(): NotificationPermission {
    if (!('Notification' in window)) return 'denied';
    return Notification.permission;
  },

  calculateTriggerTime(dateStr: string, timeStr: string, offset: NotificationOffset): Date {
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hours, minutes] = timeStr.split(':').map(Number);
    const target = new Date(year, month - 1, day, hours, minutes, 0);

    let offsetMs = 0;
    switch (offset) {
      case '10_min':
        offsetMs = 10 * 60 * 1000;
        break;
      case '30_min':
        offsetMs = 30 * 60 * 1000;
        break;
      case '1_hour':
        offsetMs = 60 * 60 * 1000;
        break;
      case '1_day':
        offsetMs = 24 * 60 * 60 * 1000;
        break;
      case 'at_time':
      default:
        offsetMs = 0;
        break;
    }

    return new Date(target.getTime() - offsetMs);
  },

  sendNotification(title: string, body: string, category: Reminder['category'], reminderId?: string) {
    const profile = StorageService.getProfile();
    
    // Play sound if enabled
    if (profile.soundEnabled) {
      playNotificationSound();
    }

    // Save to in-app notification center
    StorageService.addNotification({
      title,
      body,
      category,
      reminderId,
    });

    // Native browser push notification if permitted
    if ('Notification' in window && Notification.permission === 'granted' && profile.notificationsEnabled) {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: reminderId || 'reminderhub-general',
        });
      } catch (err) {
        console.warn('Failed to dispatch system notification:', err);
      }
    }
  },

  sendTestNotification() {
    this.sendNotification(
      '🔔 ReminderHub Notification Test',
      'Local alerts and sound are working properly on your device!',
      'important'
    );
  },

  // Check upcoming reminders for scheduled alert triggers
  checkDueReminders() {
    const reminders = StorageService.getReminders();
    const now = new Date();
    const notifiedKey = 'reminderhub_notified_cache';
    const notifiedSet = new Set<string>(JSON.parse(localStorage.getItem(notifiedKey) || '[]'));

    reminders.forEach((reminder) => {
      if (reminder.completed) return;

      const triggerTime = this.calculateTriggerTime(
        reminder.date,
        reminder.time,
        reminder.notificationTime
      );

      const diffMs = now.getTime() - triggerTime.getTime();
      const cacheId = `${reminder.id}_${reminder.updatedAt}`;

      // Trigger if within 30 seconds of schedule and not already notified
      if (diffMs >= 0 && diffMs <= 60000 && !notifiedSet.has(cacheId)) {
        notifiedSet.add(cacheId);
        let timeDesc = 'now';
        if (reminder.notificationTime === '10_min') timeDesc = 'in 10 minutes';
        if (reminder.notificationTime === '30_min') timeDesc = 'in 30 minutes';
        if (reminder.notificationTime === '1_hour') timeDesc = 'in 1 hour';
        if (reminder.notificationTime === '1_day') timeDesc = 'tomorrow';

        this.sendNotification(
          `⏰ ${reminder.title}`,
          `Due ${timeDesc} at ${reminder.time}${reminder.location ? ` (${reminder.location})` : ''}.`,
          reminder.category,
          reminder.id
        );
      }
    });

    try {
      localStorage.setItem(notifiedKey, JSON.stringify(Array.from(notifiedSet).slice(-100)));
    } catch (e) {
      // ignore
    }
  },
};
