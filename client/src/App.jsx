import "./App.css";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from "@clerk/clerk-react";
import api from "./api/axios";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { AddExpenses } from "./components/AddExpenses";
import { RecentExpenses } from "./components/RecentExpenses";
import { DashboardStats } from "./components/DashboardStats";
import { Insights } from "./components/Insights";
import { Profile } from "./components/Profile";
import { Heatmap } from "./components/Heatmap";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  
  // Theme Management
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // Auth Sync & Onboarding Check
  useEffect(() => {
    if (isLoaded && user) {
      const syncUser = async () => {
        try {
          // Sync user with backend
          const res = await api.post('/user/sync', { clerkUser: user });
          
          // Check if profile is incomplete
          if (res.data.success && !res.data.data.profileCompleted) {
             console.log("Profile incomplete, redirecting to onboarding...");
             navigate('/onboarding');
          }
        } catch (error) {
           console.error("User sync error:", error);
        }
      };
      syncUser();
    }
  }, [isLoaded, user, navigate]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleExpenseAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen font-sans text-[var(--text-primary)] transition-colors duration-300">
      <div className="flex h-screen overflow-hidden">
        <SidebarBase activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex-1 flex flex-col min-w-0 relative">
          
          <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 z-10 relative custom-scrollbar">
            <div className="max-w-7xl mx-auto space-y-8">
              
              {activeTab === 'dashboard' && (
                <>
                   <DashboardStats key={`stats-${refreshKey}`} />

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <AddExpenses onExpenseAdded={handleExpenseAdded} />
                    <RecentExpenses refreshTrigger={refreshKey} />
                  </div>

                  {/* Spending Activity Heatmap */}
                  <Heatmap />
                </>
              )}

              {activeTab === 'insights' && <Insights refreshTrigger={refreshKey} />}

              {activeTab === 'profile' && <Profile />}

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

const SidebarBase = ({ activeTab, setActiveTab }) => (
  <div className="hidden md:block h-full z-20">
    <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
  </div>
);

export default App;
