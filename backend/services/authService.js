const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const { jwtSecret, jwtExpiresIn } = require('../config/env');
const { AppError } = require('../middlewares/errorHandler');

const SALT_ROUNDS = 12;

/**
 * Hash a plain text password
 */
const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare plain text password to hashed password
 */
const comparePasswords = async (plain, hashed) => {
  return bcrypt.compare(plain, hashed);
};

/**
 * Generate a JWT token for a user
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );
};

/**
 * Register a new user
 */
const registerUser = async ({ name, email, password, address, role }) => {
  // Check for duplicate email
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError('An account with this email already exists.', 409);
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, address, role },
    select: { id: true, name: true, email: true, address: true, role: true, createdAt: true },
  });

  const token = generateToken(user);
  return { user, token };
};

/**
 * Login a user with email + password
 */
const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  const isMatch = await comparePasswords(password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid email or password.', 401);
  }

  const token = generateToken(user);

  // Return user without password
  const { password: _, ...safeUser } = user;
  return { user: safeUser, token };
};

/**
 * Update a user's password
 */
const updatePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found.', 404);

  const isMatch = await comparePasswords(currentPassword, user.password);
  if (!isMatch) throw new AppError('Current password is incorrect.', 401);

  const hashedPassword = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { message: 'Password updated successfully.' };
};

module.exports = { registerUser, loginUser, updatePassword, hashPassword };
