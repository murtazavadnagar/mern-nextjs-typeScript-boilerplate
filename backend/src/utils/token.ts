import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { randomUUID } from 'crypto';
import { env } from '../config/env';
import { JwtPayload } from '../types/auth';
import { UserRole } from '../types/user';

const normalizeExpiresIn = (value: string): SignOptions['expiresIn'] => {
  if (/^\d+$/.test(value)) {
    return Number(value);
  }

  return value as SignOptions['expiresIn'];
};

export const generateAccessToken = (userId: string, role: UserRole): string => {
  const payload: JwtPayload = { sub: userId, role, type: 'access', jti: randomUUID() };
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: normalizeExpiresIn(env.JWT_ACCESS_EXPIRES),
  });
};

export const generateRefreshToken = (userId: string, role: UserRole): string => {
  const payload: JwtPayload = { sub: userId, role, type: 'refresh', jti: randomUUID() };
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: normalizeExpiresIn(env.JWT_REFRESH_EXPIRES),
  });
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
};

export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
