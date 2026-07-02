require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');

const { port, nodeEnv } = require('./config/env');
const logger = require('./utils/logger');
const requestLogger = require('./middlewares/requestLogger');
const { globalErrorHandler } = require('./middlewares/errorHandler');
const { sendSuccess } = require('./utils/apiResponse');

// ─── Route Imports ────────────────────────────────────────────────────────────
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const storeRoutes = require('./routes/storeRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const ownerRoutes = require('./routes/ownerRoutes');

const app = express();

// ─── Core Middleware ──────────────────────────────────────────────────────────
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  sendSuccess(res, { status: 'healthy', environment: nodeEnv }, 'Server is running');
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/owner', ownerRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    data: null,
    errors: null,
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(globalErrorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const startServer = async () => {
  try {
    app.listen(port, () => {
      logger.info(`🚀 Server started | ENV: ${nodeEnv} | PORT: ${port}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
