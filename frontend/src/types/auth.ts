import { User } from './user';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthResult {
  accessToken: string;
  user: User;
}
