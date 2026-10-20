import React from 'react';
import { AppNotification, CATEGORIES } from '../types';
import { X, Bell, Trash2, CheckCircle, Volume2, Sparkles } from 'lucide-react';
import { NotificationService } from '../services/notifications';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onClear: () => void;
  onSelectReminder?: (reminderId: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onClear,
  onSelectReminder,
}) => {
  if (!isOpen) return null;

  const handleTestNotification = () => {
    NotificationService.sendTestNotification();
  };

  const handleRequestPermission = async () => {
    await NotificationService.requestPermission();
  };

  const permissionStatus = NotificationService.getPermissionStatus();

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-b-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh] overflow-hidden">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50/50 dark:bg-slate-850">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Notification Shade
            </h2>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              {notifications.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Notification Status Strip */}
        <div className="px-5 py-3 bg-indigo-50/70 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200">
            <Volume2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-medium">
              Push: {permissionStatus === 'granted' ? 'Enabled ✓' : 'Click to Enable'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {permissionStatus !== 'granted' && (
              <button
                onClick={handleRequestPermission}
                className="px-2 py-1 rounded-md bg-indigo-600 text-white font-semibold text-[10px] hover:bg-indigo-700"
              >
                Allow
              </button>
            )}
            <button
              onClick={handleTestNotification}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-semibold text-[10px] hover:bg-indigo-50"
            >
              <Sparkles className="w-3 h-3" />
              <span>Test Chime</span>
            </button>
          </div>
        </div>

        {/* List of Notifications */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500">
              <CheckCircle className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                No new notifications
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                Upcoming deadline alarms and reminders will appear here.
              </p>
            </div>
          ) : (
            notifications.map((notif) => {
              const cat = CATEGORIES[notif.category] || CATEGORIES.assignment;
              return (
                <div
                  key={notif.id}
                  onClick={() => {
                    if (notif.reminderId && onSelectReminder) {
                      onSelectReminder(notif.reminderId);
                      onClose();
                    }
                  }}
                  className={`p-3 rounded-2xl border transition ${
                    notif.reminderId
                      ? 'cursor-pointer hover:border-indigo-400 bg-white dark:bg-slate-800/90'
                      : 'bg-slate-50 dark:bg-slate-850'
                  } border-slate-200 dark:border-slate-800`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="text-lg shrink-0 mt-0.5">{cat.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {notif.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {new Date(notif.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {notif.body}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end bg-slate-50/50 dark:bg-slate-850">
            <button
              onClick={onClear}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear all</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
