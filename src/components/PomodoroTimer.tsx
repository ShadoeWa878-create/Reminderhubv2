import React, { useState, useEffect, useRef } from 'react';
import { Reminder, CATEGORIES } from '../types';
import { StorageService } from '../services/storage';
import { playNotificationSound } from '../services/notifications';
import { Play, Pause, RotateCcw, CheckCircle, Flame, Target, BookOpen, Coffee } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PomodoroTimerProps {
  reminders: Reminder[];
  onSessionCompleted?: (taskTitle: string, durationMinutes: number) => void;
}

type TimerMode = 'pomodoro' | 'short_break' | 'long_break';

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  reminders,
  onSessionCompleted,
}) => {
  const modeDurations: Record<TimerMode, number> = {
    pomodoro: 25 * 60, // 25 mins in seconds
    short_break: 5 * 60, // 5 mins in seconds
    long_break: 15 * 60, // 15 mins in seconds
  };

  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState<number>(modeDurations.pomodoro);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedReminderId, setSelectedReminderId] = useState<string>('');
  const [completedSessionsCount, setCompletedSessionsCount] = useState<number>(0);

  const activeReminders = reminders.filter((r) => !r.completed);

  // Set default selected reminder if available
  useEffect(() => {
    if (!selectedReminderId && activeReminders.length > 0) {
      setSelectedReminderId(activeReminders[0].id);
    }
  }, [activeReminders, selectedReminderId]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle Mode Change
  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(modeDurations[newMode]);
  };

  // Timer Tick
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, selectedReminderId]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    playNotificationSound();

    if (mode === 'pomodoro') {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
      });

      const matchedReminder = reminders.find((r) => r.id === selectedReminderId);
      const taskTitle = matchedReminder ? matchedReminder.title : 'General Academic Focus';
      const category = matchedReminder ? matchedReminder.category : 'assignment';

      // Save study session to storage
      StorageService.addStudySession({
        reminderId: selectedReminderId || undefined,
        taskTitle,
        category,
        durationMinutes: 25,
      });

      setCompletedSessionsCount((c) => c + 1);
      if (onSessionCompleted) {
        onSessionCompleted(taskTitle, 25);
      }

      // Switch to short break
      setMode('short_break');
      setTimeLeft(modeDurations.short_break);
    } else {
      // Break finished, reset to Pomodoro
      setMode('pomodoro');
      setTimeLeft(modeDurations.pomodoro);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(modeDurations[mode]);
  };

  const handleEarlyComplete = () => {
    if (window.confirm('Mark this study session as completed and log your focus time?')) {
      handleTimerComplete();
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalDuration = modeDurations[mode];
  const progressPercent = Math.round(((totalDuration - timeLeft) / totalDuration) * 100);

  const selectedReminder = reminders.find((r) => r.id === selectedReminderId);
  const reminderCat = selectedReminder ? CATEGORIES[selectedReminder.category] : null;

  return (
    <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-2xs space-y-4">
      {/* Top Header & Mode Switcher */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-xs">
          <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />
          <span>Pomodoro Study Timer</span>
        </div>

        {/* Mode Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/60 p-1 rounded-xl text-[10px] font-semibold">
          <button
            onClick={() => switchMode('pomodoro')}
            className={`px-2 py-1 rounded-lg transition cursor-pointer ${
              mode === 'pomodoro'
                ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 shadow-xs'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Study (25m)
          </button>
          <button
            onClick={() => switchMode('short_break')}
            className={`px-2 py-1 rounded-lg transition cursor-pointer ${
              mode === 'short_break'
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow-xs'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Break (5m)
          </button>
          <button
            onClick={() => switchMode('long_break')}
            className={`px-2 py-1 rounded-lg transition cursor-pointer ${
              mode === 'long_break'
                ? 'bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 shadow-xs'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Long (15m)
          </button>
        </div>
      </div>

      {/* Target Academic Task Association */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
          <Target className="w-3.5 h-3.5 text-indigo-500" />
          <span>Tie Focus Session to Project / Assignment:</span>
        </label>
        <select
          value={selectedReminderId}
          onChange={(e) => setSelectedReminderId(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        >
          <option value="">General Academic Study (No specific task)</option>
          {activeReminders.map((r) => {
            const cat = CATEGORIES[r.category];
            return (
              <option key={r.id} value={r.id}>
                {cat?.emoji || '📋'} {r.title} ({cat?.label})
              </option>
            );
          })}
        </select>
      </div>

      {/* Timer Circular Display */}
      <div className="flex flex-col items-center justify-center py-2">
        <div className="relative w-44 h-44 flex items-center justify-center">
          {/* Circular SVG Ring */}
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              className="text-slate-100 dark:text-slate-700/60 stroke-current"
              strokeWidth="7"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              className={`stroke-current transition-all duration-500 ${
                mode === 'pomodoro'
                  ? 'text-indigo-600 dark:text-indigo-500'
                  : 'text-emerald-500'
              }`}
              strokeWidth="7"
              strokeDasharray={276.46}
              strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Time text centered */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums tracking-tight">
              {formattedTime}
            </span>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
              {mode === 'pomodoro' ? 'Focus Session' : 'Rest Break'}
            </span>
            {selectedReminder && (
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium max-w-[120px] truncate mt-1">
                {selectedReminder.title}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-3">
        {/* Reset */}
        <button
          onClick={handleReset}
          className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
          title="Reset Timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Play / Pause Primary CTA */}
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs text-white shadow-md transition active:scale-95 cursor-pointer ${
            isRunning
              ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
              : mode === 'pomodoro'
              ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30'
              : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 fill-white" />
              <span>Pause Focus</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>{timeLeft < totalDuration ? 'Resume Focus' : 'Start Focus'}</span>
            </>
          )}
        </button>

        {/* Complete Session Early */}
        {mode === 'pomodoro' && isRunning && (
          <button
            onClick={handleEarlyComplete}
            className="p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition cursor-pointer"
            title="Log Session Now"
          >
            <CheckCircle className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Micro Status Footnote */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-750 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <span>Completed today: <strong className="text-slate-800 dark:text-slate-200">{completedSessionsCount} sessions</strong></span>
        <span>Goal: 4 sessions / day</span>
      </div>
    </div>
  );
};
