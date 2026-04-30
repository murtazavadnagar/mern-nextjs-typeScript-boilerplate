import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/authorize.middleware';
import { validate } from '../../middlewares/validate.middleware';
import {
  createUser,
  deleteUser,
  getUserById,
  listUsers,
  updateUser,
} from '../../controllers/user.controller';
import {
  createUserSchema,
  listUsersSchema,
  updateUserSchema,
  userIdParamSchema,
} from '../../validations/user.validation';
import { UserRole } from '../../types/user';

const router = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: List users with pagination, search and filtering
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users fetched
 */
router.get(
  '/',
  asyncHandler(authenticate),
  asyncHandler(authorize(UserRole.ADMIN, UserRole.USER)),
  validate(listUsersSchema),
  asyncHandler(listUsers),
);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Create User
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users created
 */
router.post(
  '/',
  asyncHandler(authenticate),
  asyncHandler(authorize(UserRole.ADMIN, UserRole.USER)),
  validate(createUserSchema),
  asyncHandler(createUser),
);

// router.post(
//   '/admin',
//   validate(createUserSchema),
//   asyncHandler(createUser),
// );

router.get(
  '/:id',
  asyncHandler(authenticate),
  asyncHandler(authorize(UserRole.ADMIN, UserRole.USER)),
  validate(userIdParamSchema),
  asyncHandler(getUserById),
);

router.patch(
  '/:id',
  asyncHandler(authenticate),
  asyncHandler(authorize(UserRole.ADMIN)),
  validate(updateUserSchema),
  asyncHandler(updateUser),
);

router.delete(
  '/:id',
  asyncHandler(authenticate),
  asyncHandler(authorize(UserRole.ADMIN)),
  validate(userIdParamSchema),
  asyncHandler(deleteUser),
);

export default router;
