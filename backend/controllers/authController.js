const { registerUser, loginUser, updatePassword } = require('../services/authService');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * POST /api/auth/register
 */
const register = async (req, res) => {
  const result = await registerUser(req.body);
  return sendSuccess(res, result, 'Registration successful', 201);
};

/**
 * POST /api/auth/login
 */
const login = async (req, res) => {
  const result = await loginUser(req.body);
  return sendSuccess(res, result, 'Login successful');
};

/**
 * POST /api/auth/logout
 * JWT is stateless; logout is handled client-side by deleting the token.
 * This endpoint exists for logging purposes.
 */
const logout = async (req, res) => {
  return sendSuccess(res, null, 'Logout successful');
};

/**
 * GET /api/auth/me
 */
const getMe = async (req, res) => {
  return sendSuccess(res, req.user, 'User profile fetched');
};

/**
 * PATCH /api/auth/password
 */
const changePassword = async (req, res) => {
  const result = await updatePassword(req.user.id, req.body);
  return sendSuccess(res, null, result.message);
};

module.exports = { register, login, logout, getMe, changePassword };
