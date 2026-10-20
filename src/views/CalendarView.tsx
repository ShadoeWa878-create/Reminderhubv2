import React, { useState, useMemo } from 'react';
import { Reminder, CATEGORIES } from '../types';
import { ReminderCard } from '../components/ReminderCard';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, CheckCircle2 } from 'lucide-react';

interface CalendarViewProps {
  reminders: Reminder[];
  onToggleComplete: (id: string, e: React.MouseEvent) => void;
  onSelectReminder: (reminder: Reminder) => void;
  onOpenAddModalWithDate: (dateStr: string) => void;
  startWeekOnMonday: boolean;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  reminders,
  onToggleComplete,
  onSelectReminder,
  onOpenAddModalWithDate,
  startWeekOnMonday,
}) => {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth()); // 0-indexed
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleTodayJump = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDate(todayStr);
  };

  // Map reminders to dates
  const remindersByDate = useMemo(() => {
    const map = new Map<string, Reminder[]>();
    reminders.forEach((r) => {
      const list = map.get(r.date) || [];
      list.push(r);
      map.set(r.date, list);
    });
    return map;
  }, [reminders]);

  // Calendar day cells matrix
  const calendarCells = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sun
    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    let offset = startWeekOnMonday ? (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1) : firstDayOfMonth;

    const cells: { dateStr: string; dayNum: number; isCurrentMonth: boolean; isToday: boolean }[] = [];

    // Previous month padding
    for (let i = offset - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({ dateStr, dayNum: d, isCurrentMonth: false, isToday: dateStr === todayStr });
    }

    // Current month days
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({ dateStr, dayNum: d, isCurrentMonth: true, isToday: dateStr === todayStr });
    }

    // Next month padding to fill grid
    const totalSlots = cells.length > 35 ? 42 : 35;
    const remaining = totalSlots - cells.length;
    for (let d = 1; d <= remaining; d++) {
      const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({ dateStr, dayNum: d, isCurrentMonth: false, isToday: dateStr === todayStr });
    }

    return cells;
  }, [currentYear, currentMonth, startWeekOnMonday, todayStr]);

  const weekDayHeaders = startWeekOnMonday
    ? ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
    : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Reminders for selected date
  const selectedDateReminders = useMemo(() => {
    return remindersByDate.get(selectedDate) || [];
  }, [remindersByDate, selectedDate]);

  const formattedSelectedDate = useMemo(() => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, [selectedDate]);

  return (
    <div className="flex-1 p-4 pb-20 space-y-4 animate-in fade-in duration-150 flex flex-col">
      {/* Calendar Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <span className="text-[11px] text-slate-400 font-medium">
            Tap a date to inspect schedule
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleTodayJump}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition"
          >
            Today
          </button>
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition"
            aria-label="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition"
            aria-label="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Monthly Grid Card */}
      <div className="p-3 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xs">
        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 mb-2 text-center">
          {weekDayHeaders.map((dayName, idx) => (
            <span
              key={idx}
              className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-1"
            >
              {dayName}
            </span>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarCells.map((cell, idx) => {
            const isSelected = cell.dateStr === selectedDate;
            const items = remindersByDate.get(cell.dateStr) || [];
            const hasReminders = items.length > 0;

            return (
              <button
                key={idx}
                onClick={() => setSelectedDate(cell.dateStr)}
                className={`min-h-[44px] p-1 rounded-xl flex flex-col items-center justify-between transition cursor-pointer relative ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/30'
                    : cell.isToday
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800'
                    : cell.isCurrentMonth
                    ? 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                    : 'text-slate-300 dark:text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-xs font-semibold tabular-nums">
                  {cell.dayNum}
                </span>

                {/* Category colored indicators */}
                <div className="flex items-center justify-center gap-0.5 h-1.5 w-full">
                  {hasReminders &&
                    items.slice(0, 3).map((item, dotIdx) => {
                      const cat = CATEGORIES[item.category] || CATEGORIES.assignment;
                      return (
                        <span
                          key={dotIdx}
                          style={{ backgroundColor: isSelected ? '#FFFFFF' : cat.color }}
                          className="w-1.5 h-1.5 rounded-full"
                          title={item.title}
                        />
                      );
                    })}
                  {items.length > 3 && (
                    <span
                      className={`text-[8px] font-bold leading-none ${
                        isSelected ? 'text-white' : 'text-slate-400'
                      }`}
                    >
                      +
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Agenda */}
      <div className="space-y-2.5 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {formattedSelectedDate}
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
              {selectedDateReminders.length}
            </span>
          </div>

          <button
            onClick={() => onOpenAddModalWithDate(selectedDate)}
            className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>

        {selectedDateReminders.length === 0 ? (
          <div className="p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center bg-slate-50/50 dark:bg-slate-850">
            <CheckCircle2 className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-1.5" />
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              No tasks scheduled for this day
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 mb-2.5">
              Plan ahead by tapping "Add Task" above.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {selectedDateReminders.map((item) => (
              <ReminderCard
                key={item.id}
                reminder={item}
                onToggleComplete={onToggleComplete}
                onClick={onSelectReminder}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
