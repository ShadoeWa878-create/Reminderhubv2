import React, { useState } from 'react';
import { StudentProfile, COLLEGE_BRANCHES, COLLEGE_SEMESTERS } from '../types';
import { StorageService } from '../services/storage';
import { NotificationService } from '../services/notifications';
import { BookOpen, BellRing, CalendarCheck, ArrowRight, Check, Sparkles, GraduationCap } from 'lucide-react';

interface OnboardingViewProps {
  onComplete: () => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(0);
  const [name, setName] = useState('Rahul Sharma');
  const [college, setCollege] = useState('National Institute of Technology');
  const [course, setCourse] = useState('Computer Science & Engineering');
  const [semester, setSemester] = useState('5th Semester');
  const [loadDemo, setLoadDemo] = useState(true);

  const slides = [
    {
      title: 'Stay Organized',
      tagline: 'Manage assignments, exams, fees and important events in one place.',
      icon: BookOpen,
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      iconBg: 'bg-indigo-50 dark:bg-indigo-950/60 ring-8 ring-indigo-500/10',
    },
    {
      title: 'Never Miss a Deadline',
      tagline: 'Get reminders before important deadlines with proactive local notifications.',
      icon: BellRing,
      iconColor: 'text-rose-600 dark:text-rose-400',
      iconBg: 'bg-rose-50 dark:bg-rose-950/60 ring-8 ring-rose-500/10',
    },
    {
      title: 'Plan Your Student Life',
      tagline: 'Track upcoming tasks, monitor your weekly workload, and boost academic productivity.',
      icon: CalendarCheck,
      iconColor: 'text-purple-600 dark:text-purple-400',
      iconBg: 'bg-purple-50 dark:bg-purple-950/60 ring-8 ring-purple-500/10',
    },
  ];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleFinish = async () => {
    // Request notification permission if requested
    await NotificationService.requestPermission();

    // Save profile
    const updatedProfile: Partial<StudentProfile> = {
      name: name.trim() || 'Student',
      college: college.trim() || 'College',
      course: course.trim() || 'Degree',
      semester: semester.trim() || 'Semester 1',
      onboardingCompleted: true,
    };
    StorageService.saveProfile(updatedProfile);

    if (loadDemo) {
      StorageService.resetDemoData();
    } else {
      StorageService.clearAll();
    }

    onComplete();
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-b from-white via-slate-50/50 to-indigo-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/20">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
          <span className="font-bold text-xs tracking-tight text-slate-800 dark:text-slate-200">
            ReminderHub
          </span>
        </div>
        {step < 3 && (
          <button
            onClick={() => setStep(3)}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
          >
            Skip setup
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="my-auto py-4">
        {step < 3 ? (
          <div className="text-center px-4 animate-in fade-in duration-300">
            {/* Visual Icon */}
            {(() => {
              const current = slides[step];
              const Icon = current.icon;
              return (
                <div className="flex flex-col items-center">
                  <div className={`w-24 h-24 rounded-3xl ${current.iconBg} flex items-center justify-center mb-8 shadow-sm transition-transform duration-300`}>
                    <Icon className={`w-12 h-12 ${current.iconColor}`} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                    {current.title}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xs leading-relaxed">
                    {current.tagline}
                  </p>
                </div>
              );
            })()}
          </div>
        ) : (
          /* Profile & College Info Setup */
          <div className="w-full max-w-sm mx-auto animate-in fade-in duration-300 space-y-4">
            <div className="text-center mb-5">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center mx-auto mb-2 text-indigo-600 dark:text-indigo-400">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Customize Your Campus Profile
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Let ReminderHub personalize your daily academic greeting.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rahul Sharma"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  College / University
                </label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="National Institute of Technology"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Course / Branch
                  </label>
                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs cursor-pointer"
                  >
                    {COLLEGE_BRANCHES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Current Semester
                  </label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs cursor-pointer"
                  >
                    {COLLEGE_SEMESTERS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Demo Data Option */}
              <label className="flex items-center gap-2 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/30 cursor-pointer mt-2">
                <input
                  type="checkbox"
                  checked={loadDemo}
                  onChange={(e) => setLoadDemo(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span className="text-xs text-indigo-950 dark:text-indigo-200 font-medium">
                  Load realistic college demo tasks (DBMS, Java exam, Fees)
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation Indicators & Buttons */}
      <div className="w-full space-y-4">
        {step < 3 ? (
          <>
            {/* Step Dots */}
            <div className="flex items-center justify-center gap-2">
              {[0, 1, 2].map((idx) => (
                <span
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-200 ${
                    step === idx
                      ? 'w-6 bg-indigo-600'
                      : 'w-2 bg-slate-300 dark:bg-slate-700'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition active:scale-[0.98] cursor-pointer"
            >
              <span>{step === 2 ? 'Get Started' : 'Next'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button
            onClick={handleFinish}
            className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition active:scale-[0.98] cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch ReminderHub</span>
          </button>
        )}
      </div>
    </div>
  );
};
