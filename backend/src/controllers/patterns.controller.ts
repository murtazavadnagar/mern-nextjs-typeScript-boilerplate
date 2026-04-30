import { Request, Response } from 'express';
import { AsyncPatternsService } from '../services/async-patterns.service';

const asyncPatternsService = new AsyncPatternsService();

export const asyncPatternsDemo = async (_req: Request, res: Response): Promise<void> => {
  const [callbackPreview, promisePreview, asyncPreview] = await Promise.all([
    asyncPatternsService.callbackPattern(),
    asyncPatternsService.promisePattern(),
    asyncPatternsService.asyncAwaitPattern(),
  ]);

  res.success(
    {
      callbackPattern: callbackPreview.slice(0, 120),
      promisePattern: promisePreview.slice(0, 120),
      asyncAwaitPattern: asyncPreview.slice(0, 120),
    },
    'Callback vs Promise vs Async/Await demonstration',
  );
};
