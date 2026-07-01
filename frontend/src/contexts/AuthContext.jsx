import { createContext, useContext, useState, useCallback } from 'react';
import axiosInstance from '../services/axiosInstance';

const AuthContext = createContext(null);

// Safely parse user from localStorage
const getStoredUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      const { user: userData, token: authToken } = response.data.data;

      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setToken(authToken);
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/register', data);
      const { user: userData, token: authToken } = response.data.data;

      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setToken(authToken);
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      const errors = error.response?.data?.errors || null;
      return { success: false, message, errors };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch {
      // Ignore logout API errors - clear local state regardless
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setToken(null);
    }
  }, []);

  const updateStoredUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, []);

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'ADMIN';
  const isStoreOwner = user?.role === 'STORE_OWNER';
  const isUser = user?.role === 'USER';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        isStoreOwner,
        isUser,
        login,
        register,
        logout,
        updateStoredUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
