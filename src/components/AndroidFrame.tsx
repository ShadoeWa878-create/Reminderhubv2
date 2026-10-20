import React from 'react';

interface AndroidFrameProps {
  children: React.ReactNode;
  darkMode: boolean;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  darkMode,
}) => {
  return (
    <div
      className={`min-h-screen w-full flex justify-center items-stretch ${
        darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
      } transition-colors duration-200`}
    >
      {/* Mobile-sized Edge-to-Edge Container (no outer toolbars, no fake frames) */}
      <main className="w-full max-w-md min-h-screen flex flex-col bg-white dark:bg-slate-900 shadow-2xl relative overflow-x-hidden border-x border-slate-200/60 dark:border-slate-800/80">
        {children}
      </main>
    </div>
  );
};
