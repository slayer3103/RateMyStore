import axiosInstance from './axiosInstance';

// ─── Admin ────────────────────────────────────────────────────────────────────
export const getDashboardStats = () => axiosInstance.get('/admin/dashboard');
export const getAdminUsers = (params) => axiosInstance.get('/admin/users', { params });
export const getAdminUser = (id) => axiosInstance.get(`/admin/users/${id}`);
export const adminCreateUser = (data) => axiosInstance.post('/admin/users', data);
export const adminDeleteUser = (id) => axiosInstance.delete(`/admin/users/${id}`);

// ─── Stores ───────────────────────────────────────────────────────────────────
export const getStores = (params) => axiosInstance.get('/stores', { params });
export const getStore = (id) => axiosInstance.get(`/stores/${id}`);
export const createStore = (data) => axiosInstance.post('/stores', data);
export const updateStore = (id, data) => axiosInstance.patch(`/stores/${id}`, data);
export const deleteStore = (id) => axiosInstance.delete(`/stores/${id}`);

// ─── Ratings ──────────────────────────────────────────────────────────────────
export const submitRating = (data) => axiosInstance.post('/ratings', data);
export const updateRating = (id, data) => axiosInstance.patch(`/ratings/${id}`, data);
export const getUserRatings = () => axiosInstance.get('/ratings/my');

// ─── Owner ────────────────────────────────────────────────────────────────────
export const getOwnerDashboard = () => axiosInstance.get('/owner/dashboard');

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const updatePassword = (data) => axiosInstance.patch('/auth/password', data);
