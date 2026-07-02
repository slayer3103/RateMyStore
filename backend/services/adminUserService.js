const prisma = require('../config/database');
const { AppError } = require('../middlewares/errorHandler');
const { hashPassword } = require('./authService');

/**
 * Get all users with optional search, sort, filter
 */
const getAllUsers = async ({ search = '', role, sortBy = 'createdAt', sortOrder = 'desc' } = {}) => {
  const where = {
    AND: [
      search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { address: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {},
      role ? { role } : {},
    ],
  };

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
      createdAt: true,
      _count: { select: { ratings: true } },
    },
    orderBy: { [sortBy]: sortOrder },
  });

  return users;
};

/**
 * Get a single user by ID
 */
const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
      createdAt: true,
      stores: {
        select: {
          id: true,
          name: true,
          address: true,
          ratings: { select: { rating: true } }
        }
      },
      ratings: {
        select: {
          rating: true,
          store: { select: { id: true, name: true } },
        },
      },
    },
  });

  if (!user) throw new AppError('User not found.', 404);
  return user;
};

/**
 * Admin: Create a new user with any role
 */
const adminCreateUser = async (data) => {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new AppError('A user with this email already exists.', 409);

  const hashedPassword = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: { ...data, password: hashedPassword },
    select: { id: true, name: true, email: true, address: true, role: true, createdAt: true },
  });

  return user;
};

/**
 * Admin: Delete a user
 */
const deleteUser = async (id) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError('User not found.', 404);

  await prisma.user.delete({ where: { id } });
  return { message: 'User deleted successfully.' };
};

/**
 * Admin: Get dashboard stats
 */
const getDashboardStats = async () => {
  const [totalUsers, totalStores, totalRatings, usersByRole] = await Promise.all([
    prisma.user.count(),
    prisma.store.count(),
    prisma.rating.count(),
    prisma.user.groupBy({
      by: ['role'],
      _count: { role: true },
    }),
  ]);

  const roleBreakdown = usersByRole.reduce((acc, item) => {
    acc[item.role] = item._count.role;
    return acc;
  }, {});

  return {
    totalUsers,
    totalStores,
    totalRatings,
    roleBreakdown,
  };
};

module.exports = { getAllUsers, getUserById, adminCreateUser, deleteUser, getDashboardStats };
