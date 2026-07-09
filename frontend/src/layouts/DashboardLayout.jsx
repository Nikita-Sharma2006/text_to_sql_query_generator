import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';

const DashboardLayout = () => {
  const { user } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Authentication Guard
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-default font-sans">
      {/* Sidebar navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar */}
        <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Dynamic Inner Page viewport */}
        <main className="flex-1 overflow-y-auto px-6 py-8 relative bg-bg-default">
          {/* 1280px content width container */}
          <div className="max-w-[1280px] mx-auto min-h-full flex flex-col pb-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
