import { z } from 'zod';
import { UserRole } from '../types/user';
import { objectIdSchema } from './common.validation';

export const createUserSchema = z.object({
  body: z.object({
    username: z.string().trim().toLowerCase().min(3).max(30),
    email: z.string().email().trim().toLowerCase(),
    password: z
      .string()
      .min(8)
      .max(64)
      .regex(/[A-Z]/, 'Password must contain one uppercase character')
      .regex(/[a-z]/, 'Password must contain one lowercase character')
      .regex(/\d/, 'Password must contain one number')
      .regex(/[^a-zA-Z\d]/, 'Password must contain one symbol'),
    role: z.enum(UserRole),
    fullName: z.string().trim().min(3).max(80),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z
    .object({
      email: z.string().email().trim().toLowerCase().optional(),
      role: z.enum(UserRole).optional(),
      fullName: z.string().trim().min(3).max(80).optional(),
      password: z
        .string()
        .min(8)
        .max(64)
        .regex(/[A-Z]/)
        .regex(/[a-z]/)
        .regex(/\d/)
        .regex(/[^a-zA-Z\d]/)
        .optional(),
      isActive: z.boolean().optional(),
      profileImageUrl: z.string().url().optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: 'At least one field is required',
    }),
});

export const userIdParamSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

export const listUsersSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    search: z.string().trim().optional(),
    role: z.enum(UserRole).optional(),
    isActive: z
      .enum(['true', 'false'])
      .transform((value) => value === 'true')
      .optional(),
    sortBy: z.enum(['createdAt', 'updatedAt', 'username', 'email', 'fullName']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});
