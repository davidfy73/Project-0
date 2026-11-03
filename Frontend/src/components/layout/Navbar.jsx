import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, LogOut, Menu, X, BookOpen, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export default function Navbar({ onToggleSidebar, isSidebarOpen }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const hoverTimeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setShowProfileMenu(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setShowProfileMenu(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const modulesRead = user?.progress?.modulesRead ?? 4;
  const totalModules = user?.progress?.totalModules ?? 6;
  const preventiveRead = user?.progress?.preventiveRead ?? 5;
  const totalPreventive = user?.progress?.totalPreventive ?? 7;

  const modulePercent = Math.round((modulesRead / totalModules) * 100);
  const preventivePercent = Math.round((preventiveRead / totalPreventive) * 100);

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

      {/* Right: Profile Menu (Hover / Click) */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            type="button"
            onClick={() => setShowProfileMenu((prev) => !prev)}
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg transition-colors cursor-pointer"
            style={{
              backgroundColor: showProfileMenu ? 'var(--bg-elevated)' : 'transparent',
              border: '1px solid',
              borderColor: showProfileMenu ? 'var(--accent-primary)' : 'transparent',
            }}
            aria-expanded={showProfileMenu}
            aria-label="User profile menu"
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
                {user?.role || 'user'}
              </span>
            </div>
          </button>

          {/* Dropdown popup */}
          {showProfileMenu && (
            <div
              className="absolute right-0 top-full mt-1.5 w-64 rounded-xl p-3 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 before:content-[''] before:absolute before:-top-2 before:left-0 before:right-0 before:h-2"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-primary)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              }}
            >
              {/* Header: Nama user */}
              <div
                className="pb-3 border-b"
                style={{ borderColor: 'var(--border-primary)' }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                    style={{
                      backgroundColor: 'var(--accent-primary)',
                      color: 'var(--text-on-accent)',
                    }}
                  >
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs sm:text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                      {user?.username || 'User'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Simple progress: Module & Preventive */}
              <div
                className="py-3 border-b space-y-3"
                style={{ borderColor: 'var(--border-primary)' }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    Reading Progress
                  </span>
                  <span
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      color: 'var(--accent-light)',
                      border: '1px solid var(--border-primary)',
                    }}
                  >
                    {user?.role || 'user'}
                  </span>
                </div>

                {/* Module Progress */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-medium" style={{ color: 'var(--text-secondary)' }}>
                      <BookOpen size={13} style={{ color: 'var(--accent-primary)' }} />
                      <span>Module</span>
                    </span>
                    <span className="font-mono text-[11px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {modulesRead}/{totalModules}
                    </span>
                  </div>
                  <div
                    className="w-full h-1.5 rounded-full overflow-hidden"
                    style={{ backgroundColor: 'var(--progress-track)' }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${modulePercent}%`,
                        backgroundColor: 'var(--accent-primary)',
                      }}
                    />
                  </div>
                </div>

                {/* Preventive Progress */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-medium" style={{ color: 'var(--text-secondary)' }}>
                      <ShieldCheck size={13} style={{ color: 'var(--color-success)' }} />
                      <span>Preventive</span>
                    </span>
                    <span className="font-mono text-[11px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {preventiveRead}/{totalPreventive}
                    </span>
                  </div>
                  <div
                    className="w-full h-1.5 rounded-full overflow-hidden"
                    style={{ backgroundColor: 'var(--progress-track)' }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${preventivePercent}%`,
                        backgroundColor: 'var(--color-success)',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Logout button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer"
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
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
