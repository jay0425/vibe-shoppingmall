import { Router } from 'express';

import { getAdminOrder, getAdminOrders, updateAdminOrderStatus } from '../controllers/index.js';
import { authenticate } from '../middleware/auth.middleware.js';

export const adminOrderRouter = Router();

adminOrderRouter.use(authenticate);

adminOrderRouter.get('/', getAdminOrders);
adminOrderRouter.patch('/:id/status', updateAdminOrderStatus);
adminOrderRouter.get('/:id', getAdminOrder);
