import { Router } from 'express';

import { createUser, deleteUser, getUser, getUsers, updateUser } from '../controllers/index.js';

export const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:id', getUser);
userRouter.post('/', createUser);
userRouter.patch('/:id', updateUser);
userRouter.delete('/:id', deleteUser);
