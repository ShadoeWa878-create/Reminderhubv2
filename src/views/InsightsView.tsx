import React, { useState, useEffect, useMemo } from 'react';
import { Reminder, CATEGORIES, ReminderCategory, StudySession, QuickNote } from '../types';
import { StorageService } from '../services/storage';
import { PomodoroTimer } from '../components/PomodoroTimer';
import { QuickNotesCard } from '../components/QuickNotesCard';
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle, Calendar, Award, Clock, BookOpen, BarChart3 } from 'lucide-react';

interface InsightsViewProps {
  reminders: Reminder[];
  onShowToast: (msg: string) => void;
}

export const InsightsView: React.FC<InsightsViewProps> = ({ reminders, onShowToast }) => {
  const [studySessions, setStudySessions] = useState<StudySession[]>(() => StorageService.getStudySessions());
  const [quickNotes, setQuickNotes] = useState<QuickNote[]>(() => StorageService.getQuickNotes());

  useEffect(() => {
    const update = () => {
      setStudySessions(StorageService.getStudySessions());
      setQuickNotes(StorageService.getQuickNotes());
    };
    const unsubscribe = StorageService.subscribe(update);
    return () => unsubscribe();
  }, []);

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  // Pure local intelligence calculation
  const insightsData = useMemo(() => {
    let completedTotal = 0;
    let completedThisWeek = 0;
    let deadlinesThisWeek = 0;
    let dueWithin48Hours = 0;
    let highPriorityCount = 0;

    const dayCounts: Record<string, number> = {};
    const categoryCounts: Record<string, number> = {};

    // 7-day window boundary
    const nextWeekDate = new Date(now);
    nextWeekDate.setDate(now.getDate() + 7);
    const nextWeekStr = `${nextWeekDate.getFullYear()}-${String(nextWeekDate.getMonth() + 1).padStart(2, '0')}-${String(nextWeekDate.getDate()).padStart(2, '0')}`;

    // 48-hour window
    const nowTime = now.getTime();
    const fortyEightHoursMs = 48 * 60 * 60 * 1000;

    reminders.forEach((r) => {
      categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;

      if (r.completed) {
        completedTotal++;
        const updatedTime = new Date(r.updatedAt).getTime();
        if (nowTime - updatedTime <= 7 * 86400000) {
          completedThisWeek++;
        }
      } else {
        if (r.priority === 'high') {
          highPriorityCount++;
        }

        if (r.date >= todayStr && r.date <= nextWeekStr) {
          deadlinesThisWeek++;
          const [y, m, d] = r.date.split('-').map(Number);
          const dayName = new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'long' });
          dayCounts[dayName] = (dayCounts[dayName] || 0) + 1;
        }

        const [y, m, d] = r.date.split('-').map(Number);
        const [h, min] = r.time.split(':').map(Number);
        const dueTime = new Date(y, m - 1, d, h, min).getTime();
        const diffMs = dueTime - nowTime;
        if (diffMs > 0 && diffMs <= fortyEightHoursMs) {
          dueWithin48Hours++;
        }
      }
    });

    let busiestDay = 'None';
    let maxCount = 0;
    Object.entries(dayCounts).forEach(([day, count]) => {
      if (count > maxCount) {
        maxCount = count;
        busiestDay = day;
      }
    });

    const completionRate = reminders.length > 0 ? Math.round((completedTotal / reminders.length) * 100) : 0;

    return {
      completedTotal,
      completedThisWeek,
      deadlinesThisWeek,
      dueWithin48Hours,
      highPriorityCount,
      busiestDay: maxCount > 0 ? busiestDay : 'Flexible',
      busiestCount: maxCount,
      categoryCounts,
      completionRate,
    };
  }, [reminders, now, todayStr]);

  // Pomodoro Focus Session Analytics
  const studyAnalytics = useMemo(() => {
    let totalMinutes = 0;
    const taskBreakdown: Record<string, { minutes: number; category: ReminderCategory }> = {};

    studySessions.forEach((s) => {
      totalMinutes += s.durationMinutes;
      if (!taskBreakdown[s.taskTitle]) {
        taskBreakdown[s.taskTitle] = { minutes: 0, category: s.category };
      }
      taskBreakdown[s.taskTitle].minutes += s.durationMinutes;
    });

    const totalHours = (totalMinutes / 60).toFixed(1);

    return {
      totalMinutes,
      totalHours,
      totalSessions: studySessions.length,
      taskBreakdown: Object.entries(taskBreakdown).sort((a, b) => b[1].minutes - a[1].minutes),
    };
  }, [studySessions]);

  return (
    <div className="flex-1 p-4 pb-20 space-y-4 animate-in fade-in duration-150">
      {/* Top Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-700 via-violet-700 to-purple-800 text-white shadow-md">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-amber-300" />
          <h2 className="text-base font-extrabold tracking-tight">Student Productivity & Focus Hub</h2>
        </div>
        <p className="text-xs text-indigo-100/90 leading-relaxed">
          Smart Pomodoro focus timer, local assignment deadline predictions, and quick notes.
        </p>
      </div>

      {/* 1. Pomodoro Study Timer (Requested Feature) */}
      <PomodoroTimer
        reminders={reminders}
        onSessionCompleted={(taskTitle, duration) => {
          onShowToast(`Completed ${duration}m focus session on "${taskTitle}"!`);
        }}
      />

      {/* 2. Pomodoro Focus Analytics */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-xs">
            <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Study Time Analytics</span>
          </div>
          <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
            {studyAnalytics.totalHours} hrs logged
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
            <span className="text-[10px] text-indigo-700 dark:text-indigo-300 uppercase font-semibold block">
              Total Focus Time
            </span>
            <span className="text-xl font-extrabold text-indigo-950 dark:text-indigo-100 tabular-nums">
              {studyAnalytics.totalMinutes} mins
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-violet-50/70 dark:bg-violet-950/40 border border-violet-100 dark:border-violet-900/50">
            <span className="text-[10px] text-violet-700 dark:text-violet-300 uppercase font-semibold block">
              Focus Sessions
            </span>
            <span className="text-xl font-extrabold text-violet-950 dark:text-violet-100 tabular-nums">
              {studyAnalytics.totalSessions} sessions
            </span>
          </div>
        </div>

        {/* Breakdown by project/assignment */}
        {studyAnalytics.taskBreakdown.length > 0 && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-750 space-y-2">
            <h4 className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
              Focus Time by Project & Assignment:
            </h4>
            <div className="space-y-1.5">
              {studyAnalytics.taskBreakdown.map(([title, data]) => {
                const cat = CATEGORIES[data.category] || CATEGORIES.assignment;
                const percent = Math.min(100, Math.round((data.minutes / Math.max(1, studyAnalytics.totalMinutes)) * 100));
                return (
                  <div key={title} className="text-xs space-y-0.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                        {cat.emoji} {title}
                      </span>
                      <span className="font-semibold text-slate-600 dark:text-slate-400 tabular-nums">
                        {data.minutes}m ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-indigo-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. Quick Notes & Scratchpad (Requested Feature) */}
      <QuickNotesCard notes={quickNotes} onShowToast={onShowToast} />

      {/* 4. Smart Local Deadlines & Workload Metrics */}
      <div className="grid grid-cols-2 gap-3">
        {/* Deadlines This Week */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2">
            <Calendar className="w-4 h-4" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
            {insightsData.deadlinesThisWeek}
          </span>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
            Deadlines this week
          </p>
          <span className="text-[10px] text-slate-400 block mt-1">
            {insightsData.deadlinesThisWeek > 4 ? 'Heavy workload ahead' : 'Manageable schedule'}
          </span>
        </div>

        {/* Busiest Day */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="text-base font-extrabold text-slate-900 dark:text-white truncate block">
            {insightsData.busiestDay}
          </span>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
            Your busiest day
          </p>
          <span className="text-[10px] text-slate-400 block mt-1">
            {insightsData.busiestCount > 0 ? `${insightsData.busiestCount} scheduled items` : 'No peaks'}
          </span>
        </div>
      </div>

      {/* Proactive Alert Callouts */}
      <div className="space-y-2.5">
        {insightsData.dueWithin48Hours > 0 && (
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                {insightsData.dueWithin48Hours} deadline{insightsData.dueWithin48Hours > 1 ? 's are' : ' is'} due within 48 hours
              </h4>
              <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5">
                Prioritize these assignments before end-of-day submissions.
              </p>
            </div>
          </div>
        )}

        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-start gap-3">
          <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
              You completed {insightsData.completedThisWeek} task{insightsData.completedThisWeek === 1 ? '' : 's'} this week. Great job! 🎉
            </h4>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5">
              Maintaining steady daily momentum keeps exam stress away.
            </p>
          </div>
        </div>
      </div>

      {/* Overall Completion Progress */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Total Academic Completion Rate
          </span>
          <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">
            {insightsData.completionRate}%
          </span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${insightsData.completionRate}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
          <span>{insightsData.completedTotal} finished</span>
          <span>{reminders.length - insightsData.completedTotal} pending</span>
        </div>
      </div>

      {/* Category Workload Distribution */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-2xs">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3">
          Workload by Category
        </h3>
        <div className="space-y-2">
          {Object.keys(CATEGORIES).map((catKey) => {
            const cat = CATEGORIES[catKey as ReminderCategory];
            const count = insightsData.categoryCounts[catKey] || 0;
            const percentage = reminders.length > 0 ? Math.round((count / reminders.length) * 100) : 0;

            if (count === 0) return null;

            return (
              <div key={catKey} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                    <span>{cat.emoji}</span>
                    <span>{cat.label}</span>
                  </div>
                  <span className="text-slate-500 dark:text-slate-400 font-semibold tabular-nums">
                    {count} ({percentage}%)
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${percentage}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
