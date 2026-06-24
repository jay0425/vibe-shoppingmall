import { Router } from 'express';

import { createOrder, getOrder, getOrders } from '../controllers/index.js';
import { authenticate } from '../middleware/auth.middleware.js';

export const orderRouter = Router();

orderRouter.use(authenticate);

orderRouter.get('/', getOrders);
orderRouter.get('/:id', getOrder);
orderRouter.post('/', createOrder);
