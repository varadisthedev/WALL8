import React from "react";
import { UserButton, useUser } from "@clerk/clerk-react";

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user } = useUser();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'insights', label: 'Insights', icon: '📈' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <div className="w-64 h-screen p-5 flex flex-col bg-white/60 backdrop-blur-xl border-r border-white/50 shadow-xl">
      <div className="mb-10 px-2 mt-4 flex items-center gap-3">
        <div className="p-2 bg-orange-100 rounded-lg">
             <span className="text-2xl">🍊</span>
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            WALL8
        </h1>
      </div>

      <div className="flex-1 space-y-2">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">Menu</h2>
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`
                flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group
                ${activeTab === item.id 
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
                    : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                }
            `}
          >
            <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-6 border-t border-gray-200/50">
        <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl border border-white/60 shadow-sm">
            <UserButton afterSignOutUrl="/login" />
            <div className="overflow-hidden">
                <p className="text-sm font-semibold text-gray-800 truncate">{user?.fullName}</p>
                <p className="text-xs text-gray-500 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
        </div>
      </div>
    </div>
  );
};
