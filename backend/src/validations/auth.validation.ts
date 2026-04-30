import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    username: z.string().trim().min(3).max(30),
    password: z.string().min(8).max(64),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(10).optional(),
  }),
});
