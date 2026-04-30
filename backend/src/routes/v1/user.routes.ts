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
 *   post:
 *     summary: Create User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password, role, fullName]
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               fullName:
 *                 type: string
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     fullName:
 *                       type: string
 *                     role:
 *                       type: string
 *                     password:
 *                       type: string
 *       400:
 *         description: Bad request
 *       401:
 *        description: Unauthorized
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

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get users details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     fullName:
 *                       type: string
 *                     role:
 *                       type: string
 *                     isActive:
 *                       type: boolean
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router;
router.get(
  '/:id',
  asyncHandler(authenticate),
  asyncHandler(authorize(UserRole.ADMIN, UserRole.USER)),
  validate(userIdParamSchema),
  asyncHandler(getUserById),
);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update user details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: [username, email, role, fullName]
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               fullName:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               role:
 *                 type: string
 *               password:
 *                type: string
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     fullName:
 *                       type: string
 *                     role:
 *                       type: string
 *                     isActive:
 *                       type: boolean
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.patch(
  '/:id',
  asyncHandler(authenticate),
  asyncHandler(authorize(UserRole.ADMIN)),
  validate(updateUserSchema),
  asyncHandler(updateUser),
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users deleted
 *         content:
 *           application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                message:
 *                  type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.delete(
  '/:id',
  asyncHandler(authenticate),
  asyncHandler(authorize(UserRole.ADMIN)),
  validate(userIdParamSchema),
  asyncHandler(deleteUser),
);

export default router;
