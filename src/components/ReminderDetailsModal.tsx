import React, { useState } from 'react';
import { Reminder, CATEGORIES } from '../types';
import { formatFullDate, formatTimeDisplay, getCountdown } from '../utils/dateUtils';
import { X, Calendar, Clock, MapPin, AlignLeft, Bell, Repeat, CheckCircle, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReminderDetailsModalProps {
  reminder: Reminder | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleComplete: (id: string) => void;
  onEdit: (reminder: Reminder) => void;
  onDelete: (id: string) => void;
}

export const ReminderDetailsModal: React.FC<ReminderDetailsModalProps> = ({
  reminder,
  isOpen,
  onClose,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen || !reminder) return null;

  const cat = CATEGORIES[reminder.category] || CATEGORIES.assignment;
  const countdownText = getCountdown(reminder.date, reminder.time);

  const handleToggle = () => {
    if (!reminder.completed) {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
    onToggleComplete(reminder.id);
  };

  const notificationLabels: Record<string, string> = {
    at_time: 'At exact time',
    '10_min': '10 minutes before',
    '30_min': '30 minutes before',
    '1_hour': '1 hour before',
    '1_day': '1 day before',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{cat.emoji}</span>
            <div>
              <span className={`text-xs font-bold uppercase tracking-wider ${cat.textColor}`}>
                {cat.label}
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                Reminder Details
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-sm">
          {/* Status banner if completed */}
          {reminder.completed && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div className="text-xs">
                <span className="font-bold">Completed</span> — Great job! You finished this academic task.
              </div>
            </div>
          )}

          {/* Reminder Title */}
          <div>
            <h3
              className={`text-lg font-bold text-slate-900 dark:text-white leading-snug ${
                reminder.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
              }`}
            >
              {reminder.title}
            </h3>

            {/* Countdown Badge */}
            {!reminder.completed && (
              <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold tabular-nums">
                <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>{countdownText}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {reminder.description && (
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {reminder.description}
              </p>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Date */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-850">
              <Calendar className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Date</span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {formatFullDate(reminder.date)}
                </span>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-850">
              <Clock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Time</span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {formatTimeDisplay(reminder.time)}
                </span>
              </div>
            </div>

            {/* Priority */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-850">
              <div className="w-4 h-4 rounded-full flex items-center justify-center mt-0.5 shrink-0">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    reminder.priority === 'high'
                      ? 'bg-rose-500'
                      : reminder.priority === 'medium'
                      ? 'bg-amber-500'
                      : 'bg-slate-400'
                  }`}
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Priority</span>
                <span className="text-xs font-semibold capitalize text-slate-800 dark:text-slate-200">
                  {reminder.priority} Priority
                </span>
              </div>
            </div>

            {/* Notification alert */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-850">
              <Bell className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Alert</span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {notificationLabels[reminder.notificationTime] || reminder.notificationTime}
                </span>
              </div>
            </div>
          </div>

          {/* Repeat */}
          {reminder.repeatType !== 'none' && (
            <div className="flex items-center gap-2 text-xs text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 p-2.5 rounded-xl border border-purple-200 dark:border-purple-800/60">
              <Repeat className="w-4 h-4" />
              <span>Repeats {reminder.repeatType}</span>
            </div>
          )}

          {/* Location */}
          {reminder.location && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Location</span>
                <span className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                  {reminder.location}
                </span>
              </div>
            </div>
          )}

          {/* Notes */}
          {reminder.notes && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <AlignLeft className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Notes & Checklist</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-normal whitespace-pre-wrap mt-0.5">
                  {reminder.notes}
                </p>
              </div>
            </div>
          )}

          {/* Delete Confirmation Box */}
          {showDeleteConfirm && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-900 dark:text-rose-200 animate-in fade-in">
              <div className="flex items-center gap-2 mb-2 font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>Delete this reminder?</span>
              </div>
              <p className="text-rose-700 dark:text-rose-300 mb-3">
                This action cannot be undone. Are you sure you want to remove "{reminder.title}"?
              </p>
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onDelete(reminder.id);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
          {/* Mark Complete Button */}
          <button
            onClick={handleToggle}
            className={`flex-1 py-2.5 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
              reminder.completed
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>{reminder.completed ? 'Mark Incomplete' : 'Mark Complete'}</span>
          </button>

          {/* Edit Button */}
          <button
            onClick={() => {
              onEdit(reminder);
              onClose();
            }}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title="Edit Reminder"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          {/* Delete Button */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
            title="Delete Reminder"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
