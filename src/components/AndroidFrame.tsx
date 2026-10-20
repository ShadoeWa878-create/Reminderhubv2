import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Smartphone, Monitor, Code2, Moon, Sun, Download } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  activeView: string;
  onOpenCodeViewer: () => void;
  onOpenApkModal: () => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  darkMode,
  onToggleDarkMode,
  onOpenCodeViewer,
  onOpenApkModal,
}) => {
  const [currentTime, setCurrentTime] = useState('');
  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(true);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }).replace(' ', '')
      );
    };
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'} flex flex-col items-center justify-start transition-colors duration-200`}>
      {/* Top Desktop Utility Control Bar (visible on md/lg screens) */}
      <div className="w-full max-w-5xl px-4 py-2 hidden md:flex items-center justify-between border-b border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
            <span>ReminderHub</span>
          </div>
          <span className="text-slate-400">|</span>
          <span className="text-slate-500 dark:text-slate-400">Student Reminder & Planner (Android 15 Edition)</span>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <button
            onClick={() => setDeviceFrameMode(!deviceFrameMode)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            title="Toggle between phone frame and wide layout"
          >
            {deviceFrameMode ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-indigo-500" />
                <span>Expanded View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-indigo-500" />
                <span>Phone Frame</span>
              </>
            )}
          </button>

          {/* Download APK (.zip) */}
          <button
            onClick={onOpenApkModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-xs cursor-pointer"
            title="Download ReminderHub APK & Installation ZIP"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download APK (.zip)</span>
          </button>

          {/* Android Kotlin Source Explorer */}
          <button
            onClick={onOpenCodeViewer}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition"
            title="Inspect Native Android Kotlin Source Code & APK Build Guide"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Native Android Code</span>
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-1.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            title="Toggle Theme"
          >
            {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className={`w-full flex-1 flex items-center justify-center ${deviceFrameMode ? 'md:py-6' : 'p-0'}`}>
        <div
          className={`w-full transition-all duration-300 ${
            deviceFrameMode
              ? 'max-w-md md:rounded-[40px] md:shadow-2xl md:ring-12 md:ring-slate-900/90 dark:md:ring-slate-800 overflow-hidden bg-white dark:bg-slate-900 border-0 md:border md:border-slate-800 flex flex-col relative h-[100dvh] md:h-[844px]'
              : 'max-w-4xl bg-white dark:bg-slate-900 md:rounded-2xl md:shadow-lg md:border md:border-slate-200 dark:md:border-slate-800 flex flex-col relative h-[100dvh] md:h-[880px]'
          }`}
        >
          {/* Android System Status Bar */}
          <div className="h-7 w-full px-5 flex items-center justify-between text-[11px] font-semibold tracking-tight text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-30 select-none shrink-0 border-b border-slate-100 dark:border-slate-800/50">
            {/* Clock */}
            <span className="font-mono font-medium">{currentTime || '9:41 AM'}</span>

            {/* Android Camera Punch Hole on frame view */}
            {deviceFrameMode && (
              <div className="hidden md:block w-3.5 h-3.5 rounded-full bg-slate-950 dark:bg-slate-900 ring-2 ring-slate-800/40" />
            )}

            {/* Status Icons */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400">5G</span>
              <Wifi className="w-3 h-3" />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px]">85%</span>
                <Battery className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Child View Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
            {children}
          </div>

          {/* Android Gesture Bar */}
          <div className="h-4 w-full flex items-center justify-center bg-white dark:bg-slate-900 shrink-0 pb-1 z-20">
            <div className="w-32 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
