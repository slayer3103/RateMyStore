const { z } = require('zod');

// ─── Common field validators ──────────────────────────────────────────────────
const nameSchema = z
  .string()
  .min(20, 'Name must be at least 20 characters')
  .max(60, 'Name must be at most 60 characters')
  .trim();

const emailSchema = z.string().email('Must be a valid RFC-compliant email address').toLowerCase().trim();

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(16, 'Password must be at most 16 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

const addressSchema = z
  .string()
  .max(400, 'Address must be at most 400 characters')
  .trim();

const ratingSchema = z
  .number({ invalid_type_error: 'Rating must be a number' })
  .int('Rating must be an integer')
  .min(1, 'Rating must be at least 1')
  .max(5, 'Rating must be at most 5');

// ─── Auth Schemas ─────────────────────────────────────────────────────────────
const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  address: addressSchema,
  role: z.enum(['ADMIN', 'USER', 'STORE_OWNER']).optional().default('USER'),
});

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
});

// ─── Store Schemas ────────────────────────────────────────────────────────────
const createStoreSchema = z.object({
  name: z.string().min(1, 'Store name is required').max(100, 'Store name too long').trim(),
  email: emailSchema,
  address: addressSchema,
  ownerId: z.string().uuid('Invalid owner ID'),
});

const updateStoreSchema = createStoreSchema.partial();

// ─── Rating Schemas ───────────────────────────────────────────────────────────
const createRatingSchema = z.object({
  storeId: z.string().uuid('Invalid store ID'),
  rating: ratingSchema,
});

// ─── Admin: Create User Schema ────────────────────────────────────────────────
const adminCreateUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  address: addressSchema,
  role: z.enum(['ADMIN', 'USER', 'STORE_OWNER']),
});

module.exports = {
  registerSchema,
  loginSchema,
  updatePasswordSchema,
  createStoreSchema,
  updateStoreSchema,
  createRatingSchema,
  adminCreateUserSchema,
};
