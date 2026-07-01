const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const { jwtSecret } = require('../config/env');
const { AppError } = require('./errorHandler');
const logger = require('../utils/logger');

/**
 * Middleware: Authenticate JWT token and attach user to request
 */
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Authentication required. Please log in.', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, jwtSecret);

    // Fetch fresh user from DB to ensure account still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, address: true, role: true },
    });

    if (!user) {
      logger.warn(`Auth: Token valid but user ${decoded.id} not found in DB`);
      return next(new AppError('User associated with this token no longer exists.', 401));
    }

    req.user = user;
    next();
  } catch (err) {
    logger.warn(`Auth: JWT verification failed - ${err.message}`);
    return next(err);
  }
};

/**
 * Middleware factory: Authorize based on allowed roles
 * @param {...string} roles - Allowed roles (e.g., 'ADMIN', 'USER', 'STORE_OWNER')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401));
    }
    if (!roles.includes(req.user.role)) {
      logger.warn(
        `RBAC: User ${req.user.id} (role: ${req.user.role}) attempted to access resource requiring [${roles.join(', ')}]`
      );
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    next();
  };
};

module.exports = { authenticate, authorize };
