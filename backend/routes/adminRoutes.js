const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { adminCreateUserSchema } = require('../validators/schemas');
const {
  getDashboard, listUsers, getUser, createUser, removeUser,
} = require('../controllers/adminController');

const router = express.Router();

// All admin routes require ADMIN role
router.use(authenticate, authorize('ADMIN'));

router.get('/dashboard', getDashboard);
router.get('/users', listUsers);
router.get('/users/:id', getUser);
router.post('/users', validate(adminCreateUserSchema), createUser);
router.delete('/users/:id', removeUser);

module.exports = router;
