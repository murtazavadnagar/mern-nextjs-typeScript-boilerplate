import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const booleanFromEnv = (defaultValue: boolean) =>
  z
    .preprocess((value) => {
      if (typeof value === 'string') {
        return ['true', '1', 'yes', 'on'].includes(value.toLowerCase());
      }

      if (typeof value === 'boolean') {
        return value;
      }

      return defaultValue;
    }, z.boolean())
    .default(defaultValue);

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGO_URI: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_ACCESS_EXPIRES: z.string().default('15m'),
  JWT_REFRESH_EXPIRES: z.string().default('7d'),
  JWT_REFRESH_COOKIE_NAME: z.string().default('ums_refresh_token'),
  CLIENT_URL: z.string().url(),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(200),
  ENABLE_SWAGGER: booleanFromEnv(true),
  CSRF_ENABLED: booleanFromEnv(false),
  HOST: z.string().url().default('http://localhost:5000'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  throw new Error(
    `Invalid environment variables: ${JSON.stringify(parsedEnv.error.flatten().fieldErrors)}`,
  );
}

export const env = parsedEnv.data;
