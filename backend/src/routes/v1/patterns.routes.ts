import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { asyncPatternsDemo } from '../../controllers/patterns.controller';

const router = Router();

router.get('/async', asyncHandler(asyncPatternsDemo));

export default router;
