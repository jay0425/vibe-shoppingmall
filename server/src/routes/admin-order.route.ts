import { Router } from 'express';

import { getAdminOrder, getAdminOrders } from '../controllers/index.js';
import { authenticate } from '../middleware/auth.middleware.js';

export const adminOrderRouter = Router();

adminOrderRouter.use(authenticate);

adminOrderRouter.get('/', getAdminOrders);
adminOrderRouter.get('/:id', getAdminOrder);
