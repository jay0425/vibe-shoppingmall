import { Router } from 'express';

import {
  addCartItem,
  clearCart,
  deleteCartItem,
  getCart,
  updateCartItem,
} from '../controllers/index.js';
import { authenticate } from '../middleware/auth.middleware.js';

export const cartRouter = Router();

cartRouter.use(authenticate);

cartRouter.get('/:userId', getCart);
cartRouter.post('/:userId/items', addCartItem);
cartRouter.patch('/:userId/items/:productId', updateCartItem);
cartRouter.delete('/:userId/items/:productId', deleteCartItem);
cartRouter.delete('/:userId/items', clearCart);
