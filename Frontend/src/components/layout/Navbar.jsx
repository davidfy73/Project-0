import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Shield, User, LogOut, Menu, X, Bell } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export default function Navbar({ onToggleSidebar, isSidebarOpen }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/dashboard?tab=search&q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      className="sticky top-0 z-30 h-16 w-full flex items-center justify-between px-4 sm:px-6 border-b transition-colors"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-primary)',
      }}
    >
      {/* Left: Mobile hamburger & Brand */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg transition-colors cursor-pointer"
          style={{ color: 'var(--text-secondary)' }}
          aria-label="Toggle navigation menu"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div
          onClick={() => navigate('/dashboard')}
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
          <span
            className="text-base font-bold tracking-wider hidden sm:inline-block"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}
          >
            PHISHYEARN
          </span>
        </div>
      </div>

      {/* Center: Search Bar (SPEC 3: Search bar navbar diarahkan ke fitur Search di Dashboard) */}
      <form
        onSubmit={handleSearchSubmit}
        className="flex-1 max-w-md mx-3 sm:mx-6"
      >
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            placeholder="Search hash, domain, IP, or URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9.5 pl-10 pr-4 rounded-lg text-xs sm:text-sm outline-none transition-all duration-200"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-primary)',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--accent-primary)';
              e.target.style.boxShadow = '0 0 0 2px var(--accent-glow)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-primary)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
      </form>

      {/* Right: Notifications & Profile Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notification pill */}
        <div
          className="w-9 h-9 rounded-lg hidden sm:flex items-center justify-center relative cursor-pointer"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
            color: 'var(--text-secondary)',
          }}
          title="No unread alerts"
        >
          <Bell size={17} />
          <span
            className="absolute top-2 right-2 w-2 h-2 rounded-full"
            style={{ backgroundColor: 'var(--accent-primary)' }}
          />
        </div>

        {/* Profile dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg transition-colors cursor-pointer"
            style={{
              backgroundColor: showProfileMenu ? 'var(--bg-elevated)' : 'transparent',
              border: '1px solid',
              borderColor: showProfileMenu ? 'var(--accent-primary)' : 'transparent',
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: 'var(--text-on-accent)',
              }}
            >
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span
                className="text-xs font-semibold leading-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                {user?.username || 'User'}
              </span>
              <span
                className="text-[10px] leading-tight"
                style={{ color: 'var(--text-secondary)' }}
              >
                {user?.role || 'Learner'}
              </span>
            </div>
          </button>

          {/* Dropdown popup */}
          {showProfileMenu && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-primary)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              }}
            >
              <div
                className="px-3 py-2 border-b mb-1"
                style={{ borderColor: 'var(--border-primary)' }}
              >
                <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                  {user?.username || 'User'}
                </p>
                <p className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>
                  {user?.email || 'user@phishyearn.local'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/about');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer"
                style={{ color: 'var(--text-secondary)' }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <User size={15} style={{ color: 'var(--accent-primary)' }} />
                <span>Lihat Profil & Info</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer mt-1"
                style={{ color: 'var(--color-danger)' }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 91, 100, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
