import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodTypeAny } from 'zod';
import { StatusCodes } from 'http-status-codes';

export const validate = (schema: ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      }) as {
        body?: Record<string, unknown>;
        query?: Record<string, unknown>;
        params?: Record<string, unknown>;
      };

      if (parsed.body) {
        req.body = parsed.body;
      }
      if (parsed.query) {
        req.query = parsed.query as unknown as Request['query'];
      }
      if (parsed.params) {
        req.params = parsed.params as Record<string, string>;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Validation failed',
          errors: error.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
          })),
        });
        return;
      }

      next(error);
    }
  };
};
