import React from "react";
import { UserButton, useUser } from "@clerk/clerk-react";
import { LayoutDashboard, TrendingUp, User } from "lucide-react";

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user } = useUser();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'insights', label: 'Insights', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="w-64 h-screen p-5 flex flex-col bg-[var(--glass-bg)] backdrop-blur-xl border-r border-[var(--glass-border)] shadow-xl transition-colors duration-300">
      <div className="mb-10 px-2 mt-4 flex items-center gap-3">
        <div className="p-2 bg-blue-500/10 rounded-lg">
             <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-md" />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            WALL8
        </h1>
      </div>

      <div className="flex-1 space-y-2">
        <h2 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4 px-2">Menu</h2>
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`
                flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group
                ${activeTab === item.id 
                    ? 'bg-[var(--accent-primary)] text-white shadow-lg shadow-blue-500/30' 
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] hover:text-[var(--accent-primary)]'
                }
            `}
          >
            <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-6 border-t border-[var(--glass-border)]">
        <div className="flex items-center gap-3 p-3 bg-[var(--glass-bg)] rounded-xl border border-[var(--glass-border)] shadow-sm">
            <UserButton afterSignOutUrl="/" />
            <div className="overflow-hidden">
                <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{user?.fullName}</p>
                <p className="text-xs text-[var(--text-secondary)] truncate">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
        </div>
      </div>
    </div>
  );
};
