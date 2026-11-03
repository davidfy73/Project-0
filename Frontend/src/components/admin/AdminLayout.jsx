import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  Shield,
  Users,
  LineChart,
  HelpCircle,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import Footer from '../layout/Footer';

const ADMIN_NAV_ITEMS = [
  { name: 'User', path: '/admin/user', icon: Users },
  { name: 'Progress', path: '/admin/progress', icon: LineChart },
  { name: 'Quiz', path: '/admin/quiz', icon: HelpCircle },
];

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { adminUser, logoutAdmin } = useAdminStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/admin/login');
  };

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      {/* Admin Navbar */}
      <header
        className="sticky top-0 z-30 h-16 w-full flex items-center justify-between px-4 sm:px-6 border-b transition-colors"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-primary)',
        }}
      >
        {/* Left: Mobile Toggle & Brand + Admin Badge */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 rounded-lg transition-colors cursor-pointer"
            style={{ color: 'var(--text-secondary)' }}
            aria-label="Toggle admin navigation menu"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div
            onClick={() => navigate('/admin/user')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform hover:scale-105"
              style={{
                backgroundColor: 'var(--accent-deep)',
                border: '1px solid var(--accent-primary)',
                boxShadow: '0 0 15px var(--accent-glow)',
              }}
            >
              <Shield size={19} style={{ color: 'var(--accent-primary)' }} />
            </div>

            <div className="flex items-center gap-2">
              <span
                className="text-base font-bold tracking-wider hidden sm:inline-block"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}
              >
                PHISHYEARN
              </span>
              <span
                className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md"
                style={{
                  backgroundColor: 'rgba(255, 91, 100, 0.15)',
                  color: 'var(--color-danger)',
                  border: '1px solid rgba(255, 91, 100, 0.3)',
                }}
              >
                Admin
              </span>
            </div>
          </div>
        </div>

        {/* Right: Admin Username & Quick Logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-card)' }}>
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs"
              style={{
                backgroundColor: 'var(--color-danger)',
                color: '#FFFFFF',
              }}
            >
              {adminUser?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            <span className="text-xs font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
              {adminUser?.username || 'root'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Body: Admin Sidebar + Content Area */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        {/* Mobile backdrop */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          />
        )}

        {/* Sidebar Admin */}
        <aside
          className={`fixed lg:static top-16 bottom-0 left-0 z-40 w-64 h-[calc(100vh-4rem)] lg:h-full shrink-0 flex flex-col p-4 transition-transform duration-300 ease-in-out border-r ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)',
          }}
        >
          {/* Navigation Items (User, Progress, Quiz) */}
          <div className="flex-1 overflow-y-auto space-y-6">
            <div className="px-2">
              <p
                className="text-[11px] font-semibold uppercase tracking-wider mb-3 font-mono"
                style={{ color: 'var(--text-muted)' }}
              >
                Admin Panel
              </p>
              <nav className="space-y-1.5">
                {ADMIN_NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isActive ? 'shadow-sm font-semibold' : ''
                        }`
                      }
                      style={({ isActive }) => ({
                        backgroundColor: isActive ? 'var(--accent-primary)' : 'transparent',
                        color: isActive ? 'var(--text-on-accent)' : 'var(--text-secondary)',
                      })}
                    >
                      <Icon size={18} />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Bottom Section: Logout */}
          <div className="mt-auto pt-4 border-t shrink-0" style={{ borderColor: 'var(--border-primary)' }}>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer"
              style={{ color: 'var(--text-muted)' }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 91, 100, 0.1)';
                e.currentTarget.style.color = 'var(--color-danger)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--text-muted)';
              }}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
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
