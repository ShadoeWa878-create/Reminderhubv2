import React from 'react';
import { Reminder, CATEGORIES } from '../types';
import { getRelativeDueText, formatTimeDisplay, formatDateDisplay } from '../utils/dateUtils';
import { Check, Clock, MapPin, Bell, Repeat } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReminderCardProps {
  reminder: Reminder;
  onToggleComplete: (id: string, e: React.MouseEvent) => void;
  onClick: (reminder: Reminder) => void;
}

export const ReminderCard: React.FC<ReminderCardProps> = ({
  reminder,
  onToggleComplete,
  onClick,
}) => {
  const cat = CATEGORIES[reminder.category] || CATEGORIES.assignment;
  const relative = getRelativeDueText(reminder.date, reminder.time);

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!reminder.completed) {
      // Small celebratory burst on completion
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.7 },
        colors: ['#4F46E5', '#10B981', '#F59E0B'],
      });
    }
    onToggleComplete(reminder.id, e);
  };

  const priorityStyles = {
    high: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60',
    medium: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60',
    low: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
  };

  return (
    <div
      onClick={() => onClick(reminder)}
      className={`group relative p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer bg-white dark:bg-slate-800/90 hover:shadow-md ${
        reminder.completed
          ? 'border-slate-200 dark:border-slate-800 opacity-65 bg-slate-50/50 dark:bg-slate-900/40'
          : relative.isOverdue
          ? 'border-rose-200 dark:border-rose-900/50 hover:border-rose-300'
          : 'border-slate-200 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-700'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          type="button"
          onClick={handleCheckboxClick}
          className={`shrink-0 mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center transition-all duration-150 cursor-pointer ${
            reminder.completed
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
              : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500 bg-white dark:bg-slate-800'
          }`}
          aria-label={reminder.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {reminder.completed && <Check className="w-4 h-4 stroke-[3]" />}
        </button>

        {/* Card Body */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            {/* Category text kicker with emoji */}
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <span className="text-sm" role="img" aria-label={cat.label}>
                {cat.emoji}
              </span>
              <span className={cat.textColor}>{cat.label}</span>
              <span className="text-slate-300 dark:text-slate-600 font-normal">·</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                {formatDateDisplay(reminder.date)}
              </span>
            </div>

            {/* Priority Indicator */}
            <span
              className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border ${
                priorityStyles[reminder.priority]
              }`}
            >
              {reminder.priority}
            </span>
          </div>

          {/* Title */}
          <h3
            className={`text-sm font-semibold text-slate-900 dark:text-white leading-snug truncate ${
              reminder.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
            }`}
          >
            {reminder.title}
          </h3>

          {/* Description snippet */}
          {reminder.description && (
            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mt-0.5">
              {reminder.description}
            </p>
          )}

          {/* Metadata Footer */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            {/* Time / Countdown */}
            <div
              className={`flex items-center gap-1 font-medium ${
                relative.isOverdue && !reminder.completed
                  ? 'text-rose-600 dark:text-rose-400 font-semibold'
                  : ''
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTimeDisplay(reminder.time)}</span>
              <span className="text-slate-300 dark:text-slate-600">·</span>
              <span className="tabular-nums">{relative.text}</span>
            </div>

            {/* Location if present */}
            {reminder.location && (
              <div className="flex items-center gap-1 truncate max-w-[150px]">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span className="truncate">{reminder.location}</span>
              </div>
            )}

            {/* Notification offset indicator */}
            {reminder.notificationTime !== 'at_time' && (
              <div className="flex items-center gap-0.5 text-indigo-600 dark:text-indigo-400" title={`Reminder set for ${reminder.notificationTime}`}>
                <Bell className="w-3 h-3" />
                <span className="text-[10px]">Alert</span>
              </div>
            )}

            {/* Repeat indicator */}
            {reminder.repeatType !== 'none' && (
              <div className="flex items-center gap-0.5 text-purple-600 dark:text-purple-400" title={`Repeats ${reminder.repeatType}`}>
                <Repeat className="w-3 h-3" />
                <span className="text-[10px] capitalize">{reminder.repeatType}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
