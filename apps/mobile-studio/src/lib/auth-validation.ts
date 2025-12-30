/**
 * Auth validation schemas (universal)
 *
 * Next.js compatibility: Uses Zod only, no platform APIs. Safe for SSR.
 */
import { z } from 'zod';

// Base schemas for common validation patterns
const emailSchema = z
  .email()
  .min(1, 'Email is required')
  .max(254, 'Email address is too long');

// Sign In Schema
export const signInSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, 'Password is required')
    .max(128, 'Password is too long'),
});

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// Types derived from schemas
export type SignInFormData = z.infer<typeof signInSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
