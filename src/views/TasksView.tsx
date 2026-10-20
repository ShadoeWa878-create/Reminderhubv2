import React, { useState, useMemo } from 'react';
import { Reminder, ReminderCategory, Priority, CATEGORIES } from '../types';
import { ReminderCard } from '../components/ReminderCard';
import { Search, Filter, ArrowUpDown, X, CheckSquare, Plus } from 'lucide-react';

export type TaskTab = 'all' | 'today' | 'upcoming' | 'completed' | 'overdue';

interface TasksViewProps {
  reminders: Reminder[];
  onToggleComplete: (id: string, e: React.MouseEvent) => void;
  onSelectReminder: (reminder: Reminder) => void;
  onOpenAddModal: () => void;
  initialTab?: TaskTab;
}

export const TasksView: React.FC<TasksViewProps> = ({
  reminders,
  onToggleComplete,
  onSelectReminder,
  onOpenAddModal,
  initialTab = 'all',
}) => {
  const [currentTab, setCurrentTab] = useState<TaskTab>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date_asc' | 'date_desc' | 'priority_high'>('date_asc');
  const [showFilters, setShowFilters] = useState(false);

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  // Tab counters
  const tabCounts = useMemo(() => {
    let today = 0;
    let upcoming = 0;
    let completed = 0;
    let overdue = 0;

    reminders.forEach((r) => {
      if (r.completed) {
        completed++;
      } else {
        if (r.date === todayStr) today++;
        else if (r.date > todayStr) upcoming++;
        else if (r.date < todayStr) overdue++;
      }
    });

    return {
      all: reminders.length,
      today,
      upcoming,
      completed,
      overdue,
    };
  }, [reminders, todayStr]);

  // Filtered and sorted tasks
  const filteredReminders = useMemo(() => {
    return reminders.filter((item) => {
      // 1. Tab condition
      if (currentTab === 'today') {
        if (item.completed || item.date !== todayStr) return false;
      } else if (currentTab === 'upcoming') {
        if (item.completed || item.date <= todayStr) return false;
      } else if (currentTab === 'completed') {
        if (!item.completed) return false;
      } else if (currentTab === 'overdue') {
        if (item.completed || item.date >= todayStr) return false;
      }

      // 2. Search query (title, description, category, location)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = (item.description || '').toLowerCase().includes(q);
        const matchesCat = item.category.toLowerCase().includes(q);
        const matchesLoc = (item.location || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesCat && !matchesLoc) {
          return false;
        }
      }

      // 3. Category Filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // 4. Priority Filter
      if (selectedPriority !== 'all' && item.priority !== selectedPriority) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'priority_high') {
        const priorityScore: Record<Priority, number> = { high: 3, medium: 2, low: 1 };
        const diff = priorityScore[b.priority] - priorityScore[a.priority];
        if (diff !== 0) return diff;
      } else if (sortBy === 'date_desc') {
        const dateComp = b.date.localeCompare(a.date);
        if (dateComp !== 0) return dateComp;
        return b.time.localeCompare(a.time);
      }
      
      // Default: date_asc
      const dateComp = a.date.localeCompare(b.date);
      if (dateComp !== 0) return dateComp;
      return a.time.localeCompare(b.time);
    });
  }, [reminders, currentTab, searchQuery, selectedCategory, selectedPriority, sortBy, todayStr]);

  const tabs: { id: TaskTab; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: tabCounts.all },
    { id: 'today', label: 'Today', count: tabCounts.today },
    { id: 'upcoming', label: 'Upcoming', count: tabCounts.upcoming },
    { id: 'completed', label: 'Completed', count: tabCounts.completed },
    { id: 'overdue', label: 'Overdue', count: tabCounts.overdue },
  ];

  return (
    <div className="flex-1 p-4 pb-20 space-y-3.5 animate-in fade-in duration-150 flex flex-col">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title, category, location..."
          className="w-full pl-9 pr-9 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums font-bold ${
                  isActive
                    ? 'bg-white/25 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition cursor-pointer ${
            showFilters || selectedCategory !== 'all' || selectedPriority !== 'all'
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold'
              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Filters</span>
          {(selectedCategory !== 'all' || selectedPriority !== 'all') && (
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
          )}
        </button>

        {/* Sort Selector */}
        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date_asc' | 'date_desc' | 'priority_high')}
            className="bg-transparent text-xs text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="date_asc" className="dark:bg-slate-800">Date: Earliest First</option>
            <option value="date_desc" className="dark:bg-slate-800">Date: Latest First</option>
            <option value="priority_high" className="dark:bg-slate-800">Priority: High to Low</option>
          </select>
        </div>
      </div>

      {/* Expanded Filter Panel */}
      {showFilters && (
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3 text-xs animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 dark:text-slate-200">Filter By</span>
            {(selectedCategory !== 'all' || selectedPriority !== 'all') && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedPriority('all');
                }}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Reset filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="all">All Categories</option>
                {Object.keys(CATEGORIES).map((catKey) => {
                  const cat = CATEGORIES[catKey as ReminderCategory];
                  return (
                    <option key={catKey} value={catKey}>
                      {cat.emoji} {cat.label}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Priority
              </label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Task Cards List */}
      <div className="flex-1 space-y-2.5 mt-1">
        {filteredReminders.length === 0 ? (
          <div className="py-16 text-center text-slate-400 dark:text-slate-500">
            <CheckSquare className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              No tasks found
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 mb-3">
              {searchQuery
                ? `No reminders matching "${searchQuery}"`
                : currentTab === 'completed'
                ? 'No completed tasks yet. Finish a reminder to see it here!'
                : 'There are no reminders under this filter.'}
            </p>
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-xs hover:bg-indigo-700 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Reminder</span>
            </button>
          </div>
        ) : (
          filteredReminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onToggleComplete={onToggleComplete}
              onClick={onSelectReminder}
            />
          ))
        )}
      </div>
    </div>
  );
};
