import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeContextProvider } from './contexts/ThemeContext';

// Pages (to be fully implemented in subsequent phases)
// Placeholders used here — will be replaced in Phase 2+
const ComingSoon = ({ title }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'Inter, sans-serif' }}>
    <h2>{title} — Coming Soon</h2>
  </div>
);

function App() {
  return (
    <ThemeContextProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<ComingSoon title="Login" />} />
          <Route path="/register" element={<ComingSoon title="Register" />} />

          {/* Admin routes */}
          <Route path="/admin/dashboard" element={<ComingSoon title="Admin Dashboard" />} />
          <Route path="/admin/users" element={<ComingSoon title="Admin Users" />} />
          <Route path="/admin/stores" element={<ComingSoon title="Admin Stores" />} />

          {/* User routes */}
          <Route path="/stores" element={<ComingSoon title="Browse Stores" />} />

          {/* Owner routes */}
          <Route path="/owner/dashboard" element={<ComingSoon title="Owner Dashboard" />} />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeContextProvider>
  );
}

export default App;
