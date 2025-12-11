import "./App.css";
import React, { useState } from 'react';
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { AddExpenses } from "./components/AddExpenses";
import { RecentExpenses } from "./components/RecentExpenses";
import { DashboardStats } from "./components/DashboardStats";
import { Insights } from "./components/Insights";
import { Profile } from "./components/Profile";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleExpenseAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen font-sans bg-orange-50/50 text-gray-800">
      <div className="flex h-screen overflow-hidden">
        <SidebarBase activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex-1 flex flex-col min-w-0 relative">
          {/* Background Gradients */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-300/20 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-200/20 rounded-full blur-[100px] pointer-events-none"></div>

          <Navbar />
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 z-10 relative">
            <div className="max-w-7xl mx-auto space-y-8">
              
              {activeTab === 'dashboard' && (
                <>
                   <DashboardStats key={`stats-${refreshKey}`} />

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <AddExpenses onExpenseAdded={handleExpenseAdded} />
                    <RecentExpenses refreshTrigger={refreshKey} />
                  </div>
                </>
              )}

              {activeTab === 'insights' && <Insights />}

              {activeTab === 'profile' && <Profile />}

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

const SidebarBase = ({ activeTab, setActiveTab }) => (
  <div className="hidden md:block h-full">
    <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
  </div>
);

export default App;
