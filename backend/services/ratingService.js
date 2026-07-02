const prisma = require('../config/database');
const { AppError } = require('../middlewares/errorHandler');

/**
 * Submit a new rating for a store
 */
const submitRating = async (userId, { storeId, rating }) => {
  // Ensure store exists
  const store = await prisma.store.findUnique({ where: { id: storeId } });
  if (!store) throw new AppError('Store not found.', 404);

  // Upsert: create if not exists, update if exists
  const result = await prisma.rating.upsert({
    where: { userId_storeId: { userId, storeId } },
    create: { userId, storeId, rating },
    update: { rating },
    include: {
      store: { select: { id: true, name: true } },
    },
  });

  return result;
};

/**
 * Get all ratings submitted by the current user
 */
const getUserRatings = async (userId) => {
  const ratings = await prisma.rating.findMany({
    where: { userId },
    include: {
      store: { select: { id: true, name: true, email: true, address: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  return ratings;
};

/**
 * Delete a rating (user can only delete their own)
 */
const deleteRating = async (userId, ratingId) => {
  const rating = await prisma.rating.findUnique({ where: { id: ratingId } });
  if (!rating) throw new AppError('Rating not found.', 404);
  if (rating.userId !== userId) throw new AppError('You are not authorized to delete this rating.', 403);

  await prisma.rating.delete({ where: { id: ratingId } });
  return { message: 'Rating deleted successfully.' };
};

/**
 * Get owner dashboard data: store info, avg rating, and raters list
 */
const getOwnerDashboard = async (ownerId) => {
  const store = await prisma.store.findFirst({
    where: { ownerId },
    include: {
      ratings: {
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!store) throw new AppError('No store found for this owner.', 404);

  const avgRating =
    store.ratings.length > 0
      ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length
      : null;

  return {
    store: {
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
    },
    averageRating: avgRating ? parseFloat(avgRating.toFixed(1)) : null,
    totalRatings: store.ratings.length,
    raters: store.ratings.map((r) => ({
      ratingId: r.id,
      rating: r.rating,
      ratedAt: r.createdAt,
      user: r.user,
    })),
  };
};

module.exports = { submitRating, getUserRatings, deleteRating, getOwnerDashboard };
