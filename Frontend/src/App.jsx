import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ModulesPage from './pages/ModulesPage';
import ModuleDetailPage from './pages/ModuleDetailPage';
import PreventivePage from './pages/PreventivePage';
import PreventiveDetailPage from './pages/PreventiveDetailPage';
import QuizPage from './pages/QuizPage';
import AboutPage from './pages/AboutPage';
import AppLayout from './components/layout/AppLayout';
import { useAuthStore } from './store/useAuthStore';

// Admin imports
import AdminLayout from './components/admin/AdminLayout';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminUserPage from './pages/admin/AdminUserPage';
import AdminProgressPage from './pages/admin/AdminProgressPage';
import AdminQuizPage from './pages/admin/AdminQuizPage';
import { useAdminStore } from './store/useAdminStore';

// ── Protected route user ────────────────────────────────────────────────────────
// Tampilkan loading kosong saat sedang cek sesi (isChecking),
// redirect ke /login jika belum terautentikasi.
function ProtectedRoute({ children, isChecking }) {
  const { isAuthenticated } = useAuthStore();
  if (isChecking) return null; // layar kosong sebentar saat cek cookie
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

// ── Protected route admin ───────────────────────────────────────────────────────
function AdminProtectedRoute({ children, isChecking }) {
  const { isAdminAuthenticated } = useAdminStore();
  if (isChecking) return null;
  if (!isAdminAuthenticated) return <Navigate to="/admin/login" replace />;
  return children;
}

function App() {
  // isCheckingUser/Admin: true selama restoreSession berjalan
  const [isCheckingUser, setIsCheckingUser] = useState(true);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);

  const restoreSession = useAuthStore((s) => s.restoreSession);
  const restoreAdminSession = useAdminStore((s) => s.restoreAdminSession);

  useEffect(() => {
    // Coba pulihkan sesi user dari cookie refresh
    restoreSession().finally(() => setIsCheckingUser(false));
    // Coba pulihkan sesi admin dari cookie refresh (jalur berbeda — satu tab login)
    restoreAdminSession().finally(() => setIsCheckingAdmin(false));
  }, [restoreSession, restoreAdminSession]);

  return (
    <BrowserRouter>
      {/* Toast Notifikasi Global */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-primary)',
            fontSize: '13px',
          },
          success: {
            iconTheme: {
              primary: 'var(--color-success)',
              secondary: 'var(--bg-card)',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--color-danger)',
              secondary: 'var(--bg-card)',
            },
          },
        }}
      />

      <Routes>
        {/* Public auth routes (user) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* User Protected Routes */}
        <Route
          element={
            <ProtectedRoute isChecking={isCheckingUser}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/modules" element={<ModulesPage />} />
          <Route path="/module/:slug/:section" element={<ModuleDetailPage />} />
          <Route path="/module/:slug" element={<ModuleDetailPage />} />
          <Route path="/modules/:slug/:section" element={<ModuleDetailPage />} />
          <Route path="/modules/:slug" element={<ModuleDetailPage />} />
          <Route path="/preventive" element={<PreventivePage />} />
          <Route path="/preventive/:slug" element={<PreventiveDetailPage />} />
          <Route path="/preventif" element={<Navigate to="/preventive" replace />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>

        {/* Admin Panel Protected Routes */}
        <Route path="/admin" element={<Navigate to="/admin/user" replace />} />
        <Route
          element={
            <AdminProtectedRoute isChecking={isCheckingAdmin}>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route path="/admin/user" element={<AdminUserPage />} />
          <Route path="/admin/progress" element={<AdminProgressPage />} />
          <Route path="/admin/quiz" element={<AdminQuizPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
