const { submitRating, getUserRatings, deleteRating, getOwnerDashboard } = require('../services/ratingService');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * POST /api/ratings
 * Submit or update a rating for a store (upsert).
 */
const rateStore = async (req, res) => {
  const result = await submitRating(req.user.id, req.body);
  return sendSuccess(res, result, 'Rating submitted successfully', 201);
};

/**
 * GET /api/ratings/my
 * Get all ratings submitted by the current user.
 */
const myRatings = async (req, res) => {
  const ratings = await getUserRatings(req.user.id);
  return sendSuccess(res, ratings, 'Ratings fetched');
};

/**
 * DELETE /api/ratings/:id
 * Delete the current user's rating.
 */
const removeRating = async (req, res) => {
  const result = await deleteRating(req.user.id, req.params.id);
  return sendSuccess(res, null, result.message);
};

/**
 * GET /api/owner/dashboard
 * Get the store owner's dashboard data.
 */
const ownerDashboard = async (req, res) => {
  const data = await getOwnerDashboard(req.user.id);
  return sendSuccess(res, data, 'Owner dashboard data fetched');
};

module.exports = { rateStore, myRatings, removeRating, ownerDashboard };
