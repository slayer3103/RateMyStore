const {
  getAllUsers,
  getUserById,
  adminCreateUser,
  deleteUser,
  getDashboardStats,
} = require('../services/adminUserService');
const { sendSuccess } = require('../utils/apiResponse');

const getDashboard = async (req, res) => {
  const stats = await getDashboardStats();
  return sendSuccess(res, stats, 'Dashboard data fetched');
};

const listUsers = async (req, res) => {
  const { search, role, sortBy, sortOrder } = req.query;
  const users = await getAllUsers({ search, role, sortBy, sortOrder });
  return sendSuccess(res, users, 'Users fetched');
};

const getUser = async (req, res) => {
  const user = await getUserById(req.params.id);
  return sendSuccess(res, user, 'User fetched');
};

const createUser = async (req, res) => {
  const user = await adminCreateUser(req.body);
  return sendSuccess(res, user, 'User created', 201);
};

const removeUser = async (req, res) => {
  const result = await deleteUser(req.params.id);
  return sendSuccess(res, null, result.message);
};

module.exports = { getDashboard, listUsers, getUser, createUser, removeUser };
