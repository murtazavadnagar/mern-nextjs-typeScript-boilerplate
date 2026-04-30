import { UserRole } from '../../src/types/user';
import { describe, expect, it } from '@jest/globals';
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '../../src/utils/token';

describe('token util', () => {
  it('generates and verifies access token', () => {
    const token = generateAccessToken('507f1f77bcf86cd799439011', UserRole.ADMIN);
    const payload = verifyAccessToken(token);

    expect(payload.sub).toBe('507f1f77bcf86cd799439011');
    expect(payload.role).toBe(UserRole.ADMIN);
    expect(payload.type).toBe('access');
  });

  it('generates and verifies refresh token', () => {
    const token = generateRefreshToken('507f1f77bcf86cd799439011', UserRole.USER);
    const payload = verifyRefreshToken(token);

    expect(payload.type).toBe('refresh');
    expect(payload.role).toBe(UserRole.USER);
  });

  it('hashes token deterministically', () => {
    const rawToken = 'sample-token-value';
    expect(hashToken(rawToken)).toBe(hashToken(rawToken));
  });
});
