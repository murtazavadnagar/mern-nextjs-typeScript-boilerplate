import request from 'supertest';
import app from '../../src/app';
import { UserModel } from '../../src/models/User';
import { hashPassword } from '../../src/utils/password';
import { UserRole } from '../../src/types/user';
import { describe, expect, it } from '@jest/globals';

describe('Auth + Users API', () => {
  const adminCredentials = {
    username: 'admin',
    password: 'Admin@1234',
    email: 'admin@example.com',
    fullName: 'System Admin',
  };

  const createAdmin = async (): Promise<void> => {
    await UserModel.create({
      username: adminCredentials.username,
      email: adminCredentials.email,
      fullName: adminCredentials.fullName,
      passwordHash: await hashPassword(adminCredentials.password),
      role: UserRole.ADMIN,
      isActive: true,
    });
  };

  const loginAdmin = async (): Promise<{ accessToken: string; cookie: string }> => {
    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        username: adminCredentials.username,
        password: adminCredentials.password,
      })
      .expect(200);

    const accessToken = loginResponse.body.data.accessToken as string;
    const cookie = (loginResponse.headers['set-cookie'] as unknown as string[])[0];

    return { accessToken, cookie };
  };

  it('logs in admin and creates/lists/updates/deletes user', async () => {
    await createAdmin();

    const { accessToken } = await loginAdmin();

    const createResponse = await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        username: 'john_doe',
        email: 'john@example.com',
        fullName: 'John Doe',
        role: UserRole.USER,
        password: 'John@1234',
      })
      .expect(201);

    expect(createResponse.body.data.username).toBe('john_doe');

    const createdUserId = createResponse.body.data.id as string;

    const listResponse = await request(app)
      .get('/api/v1/users?page=1&limit=10&search=john')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(listResponse.body.data).toHaveLength(1);

    await request(app)
      .patch(`/api/v1/users/${createdUserId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ fullName: 'John Doe Updated' })
      .expect(200);

    await request(app)
      .delete(`/api/v1/users/${createdUserId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });

  it('refreshes access token using refresh cookie', async () => {
    await createAdmin();

    const { cookie } = await loginAdmin();

    const refreshResponse = await request(app)
      .post('/api/v1/auth/refresh')
      .set('Cookie', cookie)
      .send({})
      .expect(200);

    expect(refreshResponse.body.data.accessToken).toBeDefined();
  });
});
