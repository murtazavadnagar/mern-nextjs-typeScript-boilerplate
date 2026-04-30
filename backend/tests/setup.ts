import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { afterAll, afterEach, beforeAll } from '@jest/globals';

let mongoServer: MongoMemoryServer;

process.env.NODE_ENV = 'test';
process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? 'test_access_secret_123456';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? 'test_refresh_secret_123456';
process.env.JWT_ACCESS_EXPIRES = '15m';
process.env.JWT_REFRESH_EXPIRES = '7d';
process.env.JWT_REFRESH_COOKIE_NAME = 'ums_refresh_token';
process.env.CLIENT_URL = 'http://localhost:3000';
process.env.RATE_LIMIT_WINDOW_MS = '900000';
process.env.RATE_LIMIT_MAX = '1000';
process.env.ENABLE_SWAGGER = 'false';
process.env.CSRF_ENABLED = 'false';

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongoServer.getUri();

  const { connectDatabase } = await import('../src/config/db');
  await connectDatabase();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;

  await Promise.all(
    Object.values(collections).map(async (collection) => {
      await collection.deleteMany({});
    }),
  );
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
