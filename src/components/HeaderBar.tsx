import React from 'react';
import { Bell, Search, Moon, Sun } from 'lucide-react';

interface HeaderBarProps {
  title: string;
  subtitle?: string;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onOpenSearch?: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  subtitle,
  unreadNotificationsCount,
  onOpenNotifications,
  onOpenSearch,
  darkMode,
  onToggleDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
      <div>
        <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        {onOpenSearch && (
          <button
            onClick={onOpenSearch}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition"
            aria-label="Search Reminders"
          >
            <Search className="w-4 h-4" />
          </button>
        )}

        {/* Quick theme toggle */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition cursor-pointer"
          aria-label="Toggle theme"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition"
          aria-label="View notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900">
              <span className="sr-only">{unreadNotificationsCount} unread</span>
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
