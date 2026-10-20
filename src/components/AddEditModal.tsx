import React, { useState, useEffect } from 'react';
import { Reminder, ReminderCategory, Priority, NotificationOffset, RepeatType, CATEGORIES } from '../types';
import { X, Calendar, Clock, MapPin, AlignLeft, Bell, Repeat, AlertCircle } from 'lucide-react';

interface AddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reminder: Reminder) => void;
  initialReminder?: Reminder | null;
  defaultCategory?: ReminderCategory;
}

export const AddEditModal: React.FC<AddEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialReminder,
  defaultCategory,
}) => {
  const getTodayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const getDefaultTimeStr = () => {
    const d = new Date();
    d.setHours(d.getHours() + 2);
    d.setMinutes(0);
    return `${String(d.getHours()).padStart(2, '0')}:00`;
  };

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ReminderCategory>('assignment');
  const [date, setDate] = useState(getTodayStr());
  const [time, setTime] = useState(getDefaultTimeStr());
  const [priority, setPriority] = useState<Priority>('medium');
  const [notificationTime, setNotificationTime] = useState<NotificationOffset>('1_hour');
  const [repeatType, setRepeatType] = useState<RepeatType>('none');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ title?: string; date?: string; time?: string }>({});

  useEffect(() => {
    if (initialReminder) {
      setTitle(initialReminder.title);
      setDescription(initialReminder.description || '');
      setCategory(initialReminder.category);
      setDate(initialReminder.date);
      setTime(initialReminder.time);
      setPriority(initialReminder.priority);
      setNotificationTime(initialReminder.notificationTime);
      setRepeatType(initialReminder.repeatType);
      setLocation(initialReminder.location || '');
      setNotes(initialReminder.notes || '');
    } else {
      setTitle('');
      setDescription('');
      setCategory(defaultCategory || 'assignment');
      setDate(getTodayStr());
      setTime(getDefaultTimeStr());
      setPriority('medium');
      setNotificationTime('1_hour');
      setRepeatType('none');
      setLocation('');
      setNotes('');
    }
    setErrors({});
  }, [initialReminder, defaultCategory, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: { title?: string; date?: string; time?: string } = {};
    if (!title.trim()) {
      newErrors.title = 'Reminder title is required';
    }
    if (!date) {
      newErrors.date = 'Date is required';
    }
    if (!time) {
      newErrors.time = 'Time is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const reminderToSave: Reminder = {
      id: initialReminder?.id || '',
      title: title.trim(),
      description: description.trim(),
      category,
      date,
      time,
      priority,
      notificationTime,
      repeatType,
      location: location.trim() || undefined,
      notes: notes.trim() || undefined,
      completed: initialReminder ? initialReminder.completed : false,
      createdAt: initialReminder?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(reminderToSave);
  };

  const priorityOptions: { value: Priority; label: string; activeColor: string }[] = [
    { value: 'low', label: 'Low', activeColor: 'bg-slate-600 text-white' },
    { value: 'medium', label: 'Medium', activeColor: 'bg-amber-600 text-white' },
    { value: 'high', label: 'High', activeColor: 'bg-rose-600 text-white' },
  ];

  const notificationOptions: { value: NotificationOffset; label: string }[] = [
    { value: 'at_time', label: 'At time' },
    { value: '10_min', label: '10 min before' },
    { value: '30_min', label: '30 min before' },
    { value: '1_hour', label: '1 hour before' },
    { value: '1_day', label: '1 day before' },
  ];

  const repeatOptions: { value: RepeatType; label: string }[] = [
    { value: 'none', label: 'None' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">{CATEGORIES[category].emoji}</span>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {initialReminder ? 'Edit Reminder' : 'Add New Reminder'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-sm">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Reminder Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Submit DBMS Lab Assignment"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                errors.title ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-slate-700'
              }`}
            />
            {errors.title && (
              <p className="flex items-center gap-1 text-xs text-rose-500 mt-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          {/* Category Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(Object.keys(CATEGORIES) as ReminderCategory[]).map((catKey) => {
                const cat = CATEGORIES[catKey];
                const isSelected = category === catKey;
                return (
                  <button
                    type="button"
                    key={catKey}
                    onClick={() => setCategory(catKey)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs transition cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 font-semibold text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <span className="text-base mb-0.5">{cat.emoji}</span>
                    <span className="text-[11px] truncate w-full text-center">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Date</span> <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-xs ${
                  errors.date ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Time</span> <span className="text-rose-500">*</span>
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-xs ${
                  errors.time ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Priority
            </label>
            <div className="grid grid-cols-3 gap-2">
              {priorityOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setPriority(opt.value)}
                  className={`py-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                    priority === opt.value
                      ? `${opt.activeColor} border-transparent shadow-xs`
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reminder Notification Timing */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Bell className="w-3.5 h-3.5 text-slate-400" />
              <span>Reminder Notification</span>
            </label>
            <select
              value={notificationTime}
              onChange={(e) => setNotificationTime(e.target.value as NotificationOffset)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs cursor-pointer"
            >
              {notificationOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Repeat */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Repeat className="w-3.5 h-3.5 text-slate-400" />
              <span>Repeat</span>
            </label>
            <select
              value={repeatType}
              onChange={(e) => setRepeatType(e.target.value as RepeatType)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs cursor-pointer"
            >
              {repeatOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key objectives or submission guidelines..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-xs resize-none"
            />
          </div>

          {/* Optional Location */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Location (Optional)</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Computer Lab 3 / Seminar Hall"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-xs"
            />
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <AlignLeft className="w-3.5 h-3.5 text-slate-400" />
              <span>Notes & Checklist (Optional)</span>
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Partner contact, reference roll numbers, books..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-xs resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-600/20 transition cursor-pointer text-xs"
            >
              Save Reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
