import { Router } from 'express';

import {
  createUser,
  deleteUser,
  getMe,
  getUser,
  getUsers,
  loginUser,
  updateUser,
} from '../controllers/index.js';
import { authenticate } from '../middleware/auth.middleware.js';

export const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.post('/login', loginUser);
userRouter.get('/me', authenticate, getMe);
userRouter.get('/:id', getUser);
userRouter.post('/', createUser);
userRouter.patch('/:id', updateUser);
userRouter.delete('/:id', deleteUser);
