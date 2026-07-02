const prisma = require('../config/database');
const { AppError } = require('../middlewares/errorHandler');

/**
 * Get all stores with optional search, sort, filter
 * Returns average rating for each store
 */
const getAllStores = async ({ search = '', sortBy = 'createdAt', sortOrder = 'desc' } = {}) => {
  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {};

  const stores = await prisma.store.findMany({
    where,
    include: {
      owner: { select: { id: true, name: true, email: true } },
      _count: { select: { ratings: true } },
      ratings: { select: { rating: true } },
    },
    orderBy: { [sortBy]: sortOrder },
  });

  // Compute average rating
  return stores.map((store) => {
    const { ratings, ...rest } = store;
    const avgRating =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : null;
    return { ...rest, averageRating: avgRating ? parseFloat(avgRating.toFixed(1)) : null };
  });
};

/**
 * Get a single store by ID with details
 */
const getStoreById = async (id) => {
  const store = await prisma.store.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      ratings: {
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!store) throw new AppError('Store not found.', 404);

  const avgRating =
    store.ratings.length > 0
      ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length
      : null;

  return {
    ...store,
    averageRating: avgRating ? parseFloat(avgRating.toFixed(1)) : null,
  };
};

/**
 * Admin: Create a new store
 */
const createStore = async (data) => {
  // Verify owner exists and has STORE_OWNER role
  const owner = await prisma.user.findUnique({ where: { id: data.ownerId } });
  if (!owner) throw new AppError('Owner user not found.', 404);
  if (owner.role !== 'STORE_OWNER') {
    throw new AppError('The specified user is not a Store Owner.', 400);
  }

  const store = await prisma.store.create({
    data,
    include: {
      owner: { select: { id: true, name: true, email: true } },
    },
  });

  return store;
};

/**
 * Admin: Update a store
 */
const updateStore = async (id, data) => {
  const store = await prisma.store.findUnique({ where: { id } });
  if (!store) throw new AppError('Store not found.', 404);

  const updated = await prisma.store.update({
    where: { id },
    data,
    include: {
      owner: { select: { id: true, name: true, email: true } },
    },
  });

  return updated;
};

/**
 * Admin: Delete a store
 */
const deleteStore = async (id) => {
  const store = await prisma.store.findUnique({ where: { id } });
  if (!store) throw new AppError('Store not found.', 404);

  await prisma.store.delete({ where: { id } });
  return { message: 'Store deleted successfully.' };
};

module.exports = { getAllStores, getStoreById, createStore, updateStore, deleteStore };
