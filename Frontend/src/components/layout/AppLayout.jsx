import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div
      className="min-h-svh flex flex-col"
      style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <Navbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
          <div className="max-w-7xl w-full mx-auto space-y-6">
            <Outlet />
          </div>
          <div className="mt-8">
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
