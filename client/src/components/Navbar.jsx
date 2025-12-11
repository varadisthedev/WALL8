import React from "react";

export const Navbar = () => {
    // We can add functionality here later, e.g., notifications or specific page titles
  return (
    <div className="w-full h-16 flex items-center justify-between px-8 z-20">
      {/* Title is now in Sidebar, checking if we need breadcrumbs or search here */}
      <div className="flex-1"></div>
      
      {/* Example: Date Display or simple welcome */}
      <div className="text-gray-500 font-medium text-sm bg-white/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/50 shadow-sm">
        {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
    </div>
  );
};
