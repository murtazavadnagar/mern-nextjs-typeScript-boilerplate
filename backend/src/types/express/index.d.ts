import { UserRole } from '../user';

declare global {
  namespace Express {
    interface Request {
      authUser?: {
        id: string;
        role: UserRole;
      };
      requestId?: string;
    }

    interface Response {
      success: <T>(data: T, message?: string, statusCode?: number) => void;
    }
  }
}

export {};
