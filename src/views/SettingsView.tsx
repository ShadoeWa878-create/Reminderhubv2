import React, { useState } from 'react';
import { StudentProfile, NotificationOffset, COLLEGE_BRANCHES, COLLEGE_SEMESTERS } from '../types';
import { StorageService } from '../services/storage';
import { NotificationService } from '../services/notifications';
import {
  User,
  Moon,
  Sun,
  Bell,
  Volume2,
  Calendar,
  Download,
  Upload,
  Trash2,
  RotateCcw,
  Code2,
  Info,
  Check,
  Sparkles
} from 'lucide-react';

interface SettingsViewProps {
  profile: StudentProfile;
  onUpdateProfile: (updated: Partial<StudentProfile>) => void;
  onOpenCodeViewer: () => void;
  onShowToast: (msg: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  onUpdateProfile,
  onOpenCodeViewer,
  onShowToast,
}) => {
  const [name, setName] = useState(profile.name);
  const [college, setCollege] = useState(profile.college);
  const [course, setCourse] = useState(profile.course);
  const [semester, setSemester] = useState(profile.semester);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const handleSaveProfile = () => {
    onUpdateProfile({
      name: name.trim() || 'Student',
      college: college.trim() || 'College',
      course: course.trim() || 'Course',
      semester: semester.trim() || 'Semester',
    });
    setIsEditingProfile(false);
    onShowToast('Profile updated successfully!');
  };

  const handleExportJson = () => {
    const jsonStr = StorageService.exportBackupJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ReminderHub-Backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onShowToast('Reminders exported to JSON file!');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = StorageService.importBackupJson(content);
      if (res.success) {
        onShowToast(`Successfully imported ${res.count} reminders!`);
      } else {
        alert(res.error || 'Failed to import JSON file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClearCompleted = () => {
    if (window.confirm('Clear all completed reminders from your list?')) {
      const count = StorageService.clearCompleted();
      onShowToast(`Removed ${count} completed reminders.`);
    }
  };

  const handleResetDemo = () => {
    if (window.confirm('Reset reminders back to default college demo tasks?')) {
      StorageService.resetDemoData();
      onShowToast('Default demo reminders restored!');
    }
  };

  const handleTestChime = () => {
    NotificationService.sendTestNotification();
    onShowToast('Test chime triggered!');
  };

  return (
    <div className="flex-1 p-4 pb-20 space-y-4 animate-in fade-in duration-150 text-xs">
      {/* Profile Card */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
              {profile.name.charAt(0) || 'R'}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                {profile.name}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {profile.college}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 transition"
          >
            {isEditingProfile ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {isEditingProfile ? (
          <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-750">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                College / University
              </label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Course / Branch
                </label>
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {COLLEGE_BRANCHES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Semester
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {COLLEGE_SEMESTERS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={handleSaveProfile}
              className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition flex items-center justify-center gap-1.5 mt-2"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-750 text-[11px] text-slate-600 dark:text-slate-400">
            <div>
              <span className="text-slate-400 block text-[10px]">Course</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                {profile.course}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Semester</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                {profile.semester}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Native Android Project Exporter Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/40 dark:to-violet-950/40 border border-indigo-200 dark:border-indigo-800 shadow-2xs space-y-2.5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Code2 className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              Offline Android APK & Source Package
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
              Fully offline-ready student planner. Download complete Android Studio project with build scripts or install directly onto your device.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={onOpenCodeViewer}
            className="flex-1 min-w-[140px] py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Offline APK ZIP</span>
          </button>
        </div>
      </div>

      {/* App Preferences */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-2xs space-y-3">
        <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
          Preferences
        </h3>

        {/* Dark Mode */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            {profile.darkMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">Dark Mode</span>
              <span className="text-[10px] text-slate-400">Night friendly interface</span>
            </div>
          </div>
          <button
            onClick={() => onUpdateProfile({ darkMode: !profile.darkMode })}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              profile.darkMode ? 'bg-indigo-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                profile.darkMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between py-1 border-t border-slate-100 dark:border-slate-750">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">Local Notifications</span>
              <span className="text-[10px] text-slate-400">Push deadline alerts</span>
            </div>
          </div>
          <button
            onClick={() => onUpdateProfile({ notificationsEnabled: !profile.notificationsEnabled })}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              profile.notificationsEnabled ? 'bg-indigo-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                profile.notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Sound Chime */}
        <div className="flex items-center justify-between py-1 border-t border-slate-100 dark:border-slate-750">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">Audible Chime</span>
              <span className="text-[10px] text-slate-400">Play tone on reminders</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleTestChime}
              className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
            >
              Test
            </button>
            <button
              onClick={() => onUpdateProfile({ soundEnabled: !profile.soundEnabled })}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                profile.soundEnabled ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  profile.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Default Reminder Timing */}
        <div className="flex items-center justify-between py-1 border-t border-slate-100 dark:border-slate-750">
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200 block">Default Notification</span>
            <span className="text-[10px] text-slate-400">Advance warning timing</span>
          </div>
          <select
            value={profile.defaultNotificationTime}
            onChange={(e) => onUpdateProfile({ defaultNotificationTime: e.target.value as NotificationOffset })}
            className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200"
          >
            <option value="at_time">At exact time</option>
            <option value="10_min">10 min before</option>
            <option value="30_min">30 min before</option>
            <option value="1_hour">1 hour before</option>
            <option value="1_day">1 day before</option>
          </select>
        </div>

        {/* Start Week on Monday / Sunday */}
        <div className="flex items-center justify-between py-1 border-t border-slate-100 dark:border-slate-750">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">Calendar Week Starts</span>
              <span className="text-[10px] text-slate-400">Monday vs Sunday</span>
            </div>
          </div>
          <select
            value={profile.startWeekOnMonday ? 'monday' : 'sunday'}
            onChange={(e) => onUpdateProfile({ startWeekOnMonday: e.target.value === 'monday' })}
            className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200"
          >
            <option value="monday">Monday</option>
            <option value="sunday">Sunday</option>
          </select>
        </div>
      </div>

      {/* Data Management */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-2xs space-y-2.5">
        <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
          Data & Backup
        </h3>

        <div className="grid grid-cols-2 gap-2">
          {/* Export JSON */}
          <button
            onClick={handleExportJson}
            className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer transition"
          >
            <Download className="w-3.5 h-3.5 text-indigo-500" />
            <span>Export Backup</span>
          </button>

          {/* Import JSON */}
          <label className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer transition">
            <Upload className="w-3.5 h-3.5 text-indigo-500" />
            <span>Import Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJson}
              className="hidden"
            />
          </label>
        </div>

        <div className="pt-1 flex items-center justify-between">
          <button
            onClick={handleClearCompleted}
            className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-rose-600 transition"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear completed</span>
          </button>

          <button
            onClick={handleResetDemo}
            className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restore demo data</span>
          </button>
        </div>
      </div>

      {/* About Section */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-center space-y-1">
        <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">
          ReminderHub – Student Reminder & Planner
        </h4>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          "Never miss what matters." · Version 1.0.0
        </p>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 pt-1">
          Engineered for university students to track assignments, internal exams, fee deadlines & projects.
        </p>
      </div>
    </div>
  );
};
