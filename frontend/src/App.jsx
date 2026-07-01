import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeContextProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Placeholder components for pages to be implemented in later phases
const ComingSoon = ({ title }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: 'Inter, sans-serif',
      flexDirection: 'column',
      gap: 8,
    }}
  >
    <h2>{title}</h2>
    <p style={{ color: '#9494B8' }}>Coming in the next phase...</p>
  </div>
);

function App() {
  return (
    <ThemeContextProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Admin routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <ComingSoon title="Admin Dashboard" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <ComingSoon title="User Management" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/stores"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <ComingSoon title="Store Management" />
                </ProtectedRoute>
              }
            />

            {/* User routes */}
            <Route
              path="/stores"
              element={
                <ProtectedRoute allowedRoles={['USER']}>
                  <ComingSoon title="Browse Stores" />
                </ProtectedRoute>
              }
            />

            {/* Owner routes */}
            <Route
              path="/owner/dashboard"
              element={
                <ProtectedRoute allowedRoles={['STORE_OWNER']}>
                  <ComingSoon title="Owner Dashboard" />
                </ProtectedRoute>
              }
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeContextProvider>
  );
}

export default App;
