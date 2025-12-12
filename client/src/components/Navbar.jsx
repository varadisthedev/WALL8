import React from "react";
import { Sun, Moon } from "lucide-react";

export const Navbar = ({ isDarkMode, toggleTheme }) => {
    // We can add functionality here later, e.g., notifications or specific page titles
  return (
    <div className="w-full h-16 flex items-center justify-between px-8 z-20">
      {/* Title is now in Sidebar, checking if we need breadcrumbs or search here */}
      <div className="flex-1"></div>
      
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button 
           onClick={toggleTheme}
           className="p-2 rounded-full bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--glass-border)] text-[var(--accent-primary)] hover:scale-110 transition-transform shadow-sm cursor-pointer"
           title="Toggle Theme"
        >
          {isDarkMode ? <Moon className="w-5 h-5 text-blue-200" /> : <Sun className="w-5 h-5 text-amber-500" />}
        </button>

        {/* Date Display */}
        <div className="text-[var(--text-secondary)] font-medium text-sm bg-[var(--glass-bg)] backdrop-blur-md px-4 py-2 rounded-full border border-[var(--glass-border)] shadow-sm">
          {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
    </div>
  );
};
