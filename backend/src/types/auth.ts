import { UserRole } from './user';

export interface JwtPayload {
  sub: string;
  role: UserRole;
  type: 'access' | 'refresh';
  jti?: string;
}
