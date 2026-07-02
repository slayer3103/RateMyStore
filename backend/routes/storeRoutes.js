const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { createStoreSchema, updateStoreSchema } = require('../validators/schemas');
const { listStores, getStore, addStore, editStore, removeStore } = require('../controllers/storeController');

const router = express.Router();

// Public read - available to authenticated users
router.get('/', authenticate, listStores);
router.get('/:id', authenticate, getStore);

// Admin-only mutations
router.post('/', authenticate, authorize('ADMIN'), validate(createStoreSchema), addStore);
router.patch('/:id', authenticate, authorize('ADMIN'), validate(updateStoreSchema), editStore);
router.delete('/:id', authenticate, authorize('ADMIN'), removeStore);

module.exports = router;
