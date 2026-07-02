import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeContextProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Admin pages
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminStoresPage from './pages/AdminStoresPage';

// User pages
import StoresPage from './pages/StoresPage';

// Owner pages
import OwnerDashboardPage from './pages/OwnerDashboardPage';

// Shared pages
import ChangePasswordPage from './pages/ChangePasswordPage';

function App() {
  return (
    <ThemeContextProvider>
      <AuthProvider>
        <Routes>
          {/* ─── Public Routes ───────────────────────────────────────── */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ─── Admin Routes ────────────────────────────────────────── */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/stores"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminStoresPage />
              </ProtectedRoute>
            }
          />

          {/* ─── Normal User Routes ──────────────────────────────────── */}
          <Route
            path="/stores"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <StoresPage />
              </ProtectedRoute>
            }
          />

          {/* ─── Owner Routes ─────────────────────────────────────────── */}
          <Route
            path="/owner/dashboard"
            element={
              <ProtectedRoute allowedRoles={['STORE_OWNER']}>
                <OwnerDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* ─── Shared Routes (all authenticated roles) ─────────────── */}
          <Route
            path="/profile/password"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'USER', 'STORE_OWNER']}>
                <ChangePasswordPage />
              </ProtectedRoute>
            }
          />

          {/* ─── Default Redirect ─────────────────────────────────────── */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeContextProvider>
  );
}

export default App;
