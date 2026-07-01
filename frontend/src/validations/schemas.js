import { z } from 'zod';

// ─── Common field validators ──────────────────────────────────────────────────
export const nameValidation = z
  .string()
  .min(20, 'Name must be at least 20 characters')
  .max(60, 'Name must be at most 60 characters')
  .trim();

export const emailValidation = z
  .string()
  .email('Must be a valid email address')
  .trim()
  .toLowerCase();

export const passwordValidation = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(16, 'Password must be at most 16 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const addressValidation = z
  .string()
  .max(400, 'Address must be at most 400 characters')
  .trim();

// ─── Auth Schemas ─────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: emailValidation,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: nameValidation,
  email: emailValidation,
  password: passwordValidation,
  address: addressValidation,
});

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordValidation,
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// ─── Rating Schema ────────────────────────────────────────────────────────────
export const ratingSchema = z.object({
  rating: z
    .number({ invalid_type_error: 'Rating must be a number' })
    .int()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
});
