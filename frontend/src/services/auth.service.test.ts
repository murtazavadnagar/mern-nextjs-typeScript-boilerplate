import apiClient from './api/axios-client';
import { authService } from './auth.service';

jest.mock('./api/axios-client', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

describe('authService', () => {
  it('calls login endpoint and returns typed data', async () => {
    const mockedPost = apiClient.post as jest.Mock;

    mockedPost.mockResolvedValueOnce({
      data: {
        success: true,
        message: 'ok',
        data: {
          accessToken: 'token123',
          user: {
            id: 'u1',
            username: 'admin',
            email: 'admin@example.com',
            fullName: 'Admin User',
            role: 'ADMIN',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
      },
    });

    const result = await authService.login({ username: 'admin', password: 'Admin@1234' });

    expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
      username: 'admin',
      password: 'Admin@1234',
    });
    expect(result.accessToken).toBe('token123');
    expect(result.user.username).toBe('admin');
  });
});
