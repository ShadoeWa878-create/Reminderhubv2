import React, { useMemo } from 'react';
import { Reminder, ReminderCategory, StudentProfile } from '../types';
import { ReminderCard } from '../components/ReminderCard';
import { getGreeting, STUDENT_QUOTES } from '../utils/dateUtils';
import { Clock, CheckCircle2, AlertOctagon, Calendar, Plus, Sparkles, BookOpen, Layers } from 'lucide-react';

interface HomeDashboardProps {
  reminders: Reminder[];
  profile: StudentProfile;
  onToggleComplete: (id: string, e: React.MouseEvent) => void;
  onSelectReminder: (reminder: Reminder) => void;
  onOpenAddModalWithCategory: (category?: ReminderCategory) => void;
  onNavigateToTab: (tab: 'tasks') => void;
  onSetTasksFilter: (filter: 'all' | 'today' | 'upcoming' | 'completed' | 'overdue') => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  reminders,
  profile,
  onToggleComplete,
  onSelectReminder,
  onOpenAddModalWithCategory,
  onNavigateToTab,
  onSetTasksFilter,
}) => {
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const greeting = getGreeting(profile.name);
  const formattedTodayDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Calculate statistics
  const { todayList, upcomingList, dueTodayCount, upcomingCount, completedCount, overdueCount } = useMemo(() => {
    let dueToday = 0;
    let upcoming = 0;
    let completed = 0;
    let overdue = 0;

    const todayItems: Reminder[] = [];
    const upcomingItems: Reminder[] = [];

    reminders.forEach((r) => {
      if (r.completed) {
        completed++;
      } else {
        if (r.date === todayStr) {
          dueToday++;
          todayItems.push(r);
        } else if (r.date > todayStr) {
          upcoming++;
          upcomingItems.push(r);
        } else if (r.date < todayStr) {
          overdue++;
        }
      }
    });

    // Sort upcoming next 5
    upcomingItems.sort((a, b) => {
      const comp = a.date.localeCompare(b.date);
      if (comp !== 0) return comp;
      return a.time.localeCompare(b.time);
    });

    // Sort today items
    todayItems.sort((a, b) => a.time.localeCompare(b.time));

    return {
      todayList: todayItems,
      upcomingList: upcomingItems.slice(0, 5),
      dueTodayCount: dueToday,
      upcomingCount: upcoming,
      completedCount: completed,
      overdueCount: overdue,
    };
  }, [reminders, todayStr]);

  const quickActionCategories: { category: ReminderCategory; label: string; emoji: string }[] = [
    { category: 'assignment', label: 'Assignment', emoji: '📚' },
    { category: 'exam', label: 'Exam', emoji: '📝' },
    { category: 'fee', label: 'Fee', emoji: '💰' },
    { category: 'event', label: 'Event', emoji: '🎉' },
    { category: 'personal', label: 'Task', emoji: '🎯' },
  ];

  return (
    <div className="flex-1 p-4 pb-20 space-y-5 animate-in fade-in duration-150">
      {/* Top Banner & Greeting */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 text-white shadow-lg shadow-indigo-600/20 relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -right-6 -bottom-8 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="absolute right-12 top-2 w-16 h-16 rounded-full bg-white/10 blur-md pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-indigo-200">
              {formattedTodayDate}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/15 text-white font-medium">
              {profile.semester || 'Student'}
            </span>
          </div>

          <h2 className="text-xl font-extrabold tracking-tight">
            {greeting}
          </h2>

          <p className="text-xs text-indigo-100/90 mt-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="italic">
              "{STUDENT_QUOTES[0]}"
            </span>
          </p>
        </div>
      </div>

      {/* Quick Statistics (4 cards) */}
      <div className="grid grid-cols-4 gap-2">
        {/* Due Today */}
        <button
          onClick={() => {
            onSetTasksFilter('today');
            onNavigateToTab('tasks');
          }}
          className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-left hover:border-indigo-500 transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-[10px] text-slate-400">Today</span>
          </div>
          <div className="mt-2">
            <span className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {dueTodayCount}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium truncate">
              Due Today
            </span>
          </div>
        </button>

        {/* Upcoming */}
        <button
          onClick={() => {
            onSetTasksFilter('upcoming');
            onNavigateToTab('tasks');
          }}
          className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-left hover:border-purple-500 transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-[10px] text-slate-400">Future</span>
          </div>
          <div className="mt-2">
            <span className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {upcomingCount}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium truncate">
              Upcoming
            </span>
          </div>
        </button>

        {/* Completed */}
        <button
          onClick={() => {
            onSetTasksFilter('completed');
            onNavigateToTab('tasks');
          }}
          className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-left hover:border-emerald-500 transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-[10px] text-slate-400">Done</span>
          </div>
          <div className="mt-2">
            <span className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {completedCount}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium truncate">
              Completed
            </span>
          </div>
        </button>

        {/* Overdue */}
        <button
          onClick={() => {
            onSetTasksFilter('overdue');
            onNavigateToTab('tasks');
          }}
          className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-left hover:border-rose-500 transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <AlertOctagon className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span className="text-[10px] text-slate-400">Alert</span>
          </div>
          <div className="mt-2">
            <span className="text-xl font-extrabold text-rose-600 dark:text-rose-400 tabular-nums">
              {overdueCount}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium truncate">
              Overdue
            </span>
          </div>
        </button>
      </div>

      {/* Quick Actions Strip */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Quick Actions
          </span>
          <span className="text-[11px] text-slate-400">Instant add</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {quickActionCategories.map((item) => (
            <button
              key={item.category}
              onClick={() => onOpenAddModalWithCategory(item.category)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:border-indigo-500 dark:hover:border-indigo-400 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs whitespace-nowrap shrink-0 transition active:scale-95 cursor-pointer"
            >
              <span className="text-sm">{item.emoji}</span>
              <span>+ {item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Today's Reminders Section */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Today's Reminders
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold">
              {todayList.length}
            </span>
          </div>
          <button
            onClick={() => {
              onSetTasksFilter('today');
              onNavigateToTab('tasks');
            }}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            View all
          </button>
        </div>

        {todayList.length === 0 ? (
          <div className="p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 text-center">
            <BookOpen className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              No tasks scheduled for today
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 mb-3">
              Enjoy your free schedule or prepare ahead for upcoming exams.
            </p>
            <button
              onClick={() => onOpenAddModalWithCategory()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-xs hover:bg-indigo-700 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Reminder</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {todayList.map((item) => (
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

      {/* Next 5 Upcoming Reminders */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Upcoming Deadlines
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
              Next 5
            </span>
          </div>
          <button
            onClick={() => {
              onSetTasksFilter('upcoming');
              onNavigateToTab('tasks');
            }}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            See schedule
          </button>
        </div>

        {upcomingList.length === 0 ? (
          <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
            No upcoming reminders. You're completely up to date!
          </div>
        ) : (
          <div className="space-y-2.5">
            {upcomingList.map((item) => (
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
