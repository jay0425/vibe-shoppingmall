import { Router } from 'express';

import { createUser, deleteUser, getUser, getUsers, loginUser, updateUser } from '../controllers/index.js';

export const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.post('/login', loginUser);
userRouter.get('/:id', getUser);
userRouter.post('/', createUser);
userRouter.patch('/:id', updateUser);
userRouter.delete('/:id', deleteUser);
