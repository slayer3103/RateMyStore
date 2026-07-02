const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { createRatingSchema } = require('../validators/schemas');
const { rateStore, myRatings, removeRating } = require('../controllers/ratingController');

const router = express.Router();

// All rating routes require authentication as a regular USER
router.use(authenticate, authorize('USER'));

router.post('/', validate(createRatingSchema), rateStore);
router.get('/my', myRatings);
router.delete('/:id', removeRating);

module.exports = router;
