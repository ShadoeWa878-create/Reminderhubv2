import React from 'react';
import { Home, CheckSquare, Calendar, BarChart2, Settings, Plus } from 'lucide-react';

export type NavTab = 'home' | 'tasks' | 'calendar' | 'insights' | 'settings';

interface BottomNavProps {
  currentTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  onOpenAddModal: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onChangeTab,
  onOpenAddModal,
}) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'tasks' as NavTab, label: 'Tasks', icon: CheckSquare },
    { id: 'calendar' as NavTab, label: 'Calendar', icon: Calendar },
    { id: 'insights' as NavTab, label: 'Insights', icon: BarChart2 },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="relative shrink-0">
      {/* Floating Action Button (FAB) */}
      <div className="absolute -top-6 right-5 md:right-7 z-30">
        <button
          onClick={onOpenAddModal}
          className="w-13 h-13 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/30 flex items-center justify-center active:scale-95 transition-all duration-150 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 cursor-pointer"
          aria-label="Add New Reminder"
          title="Add New Reminder"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* Bottom Nav Bar */}
      <nav className="h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 grid grid-cols-5 px-1 items-center z-20">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-150 cursor-pointer min-h-[44px] ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-transform ${
                  isActive ? 'scale-110' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
