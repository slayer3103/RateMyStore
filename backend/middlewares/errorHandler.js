const logger = require('../utils/logger');
const { sendError } = require('../utils/apiResponse');

/**
 * Custom AppError class for operational errors
 */
class AppError extends Error {
  constructor(message, statusCode = 500, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handling middleware
 */
const globalErrorHandler = (err, req, res, next) => {
  let { statusCode = 500, message, errors } = err;

  // Prisma unique constraint violation
  if (err.code === 'P2002') {
    statusCode = 409;
    const field = err.meta?.target?.[0] || 'field';
    message = `A record with this ${field} already exists.`;
    errors = null;
  }

  // Prisma record not found
  if (err.code === 'P2025') {
    statusCode = 404;
    message = err.meta?.cause || 'Record not found.';
    errors = null;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your token has expired. Please log in again.';
  }

  // Zod validation errors (should be handled before reaching here, but just in case)
  if (err.name === 'ZodError') {
    statusCode = 422;
    message = 'Validation failed.';
    errors = err.errors.map((e) => ({ field: e.path.join('.'), message: e.message }));
  }

  // Log the error
  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} - ${statusCode} - ${err.message}`, { stack: err.stack });
  } else {
    logger.warn(`${req.method} ${req.originalUrl} - ${statusCode} - ${message}`);
  }

  return sendError(res, message, statusCode, errors);
};

module.exports = { AppError, globalErrorHandler };
