import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          element={
            <ProtectedRoute>
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

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
