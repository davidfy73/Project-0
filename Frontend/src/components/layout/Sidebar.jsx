import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  ShieldCheck,
  HelpCircle,
  Info,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Module', path: '/modules', icon: BookOpen },
  { name: 'Preventive', path: '/preventive', icon: ShieldCheck },
  { name: 'Quiz', path: '/quiz', icon: HelpCircle },
  { name: 'About', path: '/about', icon: Info },
];

export default function Sidebar({ isOpen, onClose }) {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:static top-16 bottom-0 left-0 z-40 w-64 flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out border-r ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-primary)',
          height: 'calc(100svh - 4rem)',
        }}
      >
        {/* Navigation list */}
        <div className="space-y-6">
          <div className="px-2">
            <p
              className="text-[11px] font-semibold uppercase tracking-wider mb-3"
              style={{ color: 'var(--text-muted)' }}
            >
              Navigation
            </p>
            <nav className="space-y-1.5">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive ? 'shadow-sm' : ''
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

        {/* Bottom section: Logout */}
        <div className="pt-4 border-t" style={{ borderColor: 'var(--border-primary)' }}>
          {/* Logout button */}
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
    </>
  );
}
