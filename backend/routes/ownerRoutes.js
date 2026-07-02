const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth');
const { ownerDashboard } = require('../controllers/ratingController');

const router = express.Router();

// All owner routes require STORE_OWNER role
router.use(authenticate, authorize('STORE_OWNER'));

router.get('/dashboard', ownerDashboard);

module.exports = router;
