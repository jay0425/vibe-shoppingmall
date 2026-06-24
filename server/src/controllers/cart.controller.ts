import type { RequestHandler } from 'express';
import { isValidObjectId, Types } from 'mongoose';

import {
  addCartItemData,
  clearCartData,
  deleteCartItemData,
  getOrCreateCartByUserId,
  updateCartItemQuantityData,
} from '../services/index.js';
import { asyncHandler, HttpError } from '../utils/index.js';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const validateObjectId = (id: string, fieldLabel: string) => {
  if (!isValidObjectId(id)) {
    throw new HttpError(400, `유효하지 않은 ${fieldLabel}입니다.`);
  }
};

const validateCartAccess = (authenticatedUserId: string | undefined, targetUserId: string) => {
  if (!authenticatedUserId) {
    throw new HttpError(401, '인증이 필요합니다.');
  }

  if (authenticatedUserId !== targetUserId) {
    throw new HttpError(403, '다른 사용자의 장바구니에 접근할 수 없습니다.');
  }
};

const normalizeQuantity = (value: unknown, defaultValue = 1): number => {
  if (value === undefined) {
    return defaultValue;
  }

  const quantity = typeof value === 'string' || typeof value === 'number' ? Number(value) : Number.NaN;
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new HttpError(400, '수량은 1 이상의 정수여야 합니다.');
  }

  return quantity;
};

const normalizeOptionalString = (value: unknown, fieldLabel: string) => {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== 'string') {
    throw new HttpError(400, `${fieldLabel}은 문자열이어야 합니다.`);
  }

  const trimmed = value.trim();
  return trimmed || undefined;
};

const serializeCart = (cart: {
  _id: unknown;
  user: unknown;
  items: {
    product: unknown;
    quantity: number;
    color?: string | null;
    size?: string | null;
  }[];
}) => ({
  id: String(cart._id),
  user: String(cart.user),
  items: cart.items.map((item) => ({
    product: item.product,
    quantity: item.quantity,
    color: item.color,
    size: item.size,
  })),
});

export const getCart: RequestHandler = asyncHandler(async (req, res) => {
  validateObjectId(req.params.userId, '사용자 ID');
  validateCartAccess(req.user?.id, req.params.userId);

  const cart = await getOrCreateCartByUserId(req.params.userId);
  res.json(serializeCart(cart));
});

export const addCartItem: RequestHandler = asyncHandler(async (req, res) => {
  validateObjectId(req.params.userId, '사용자 ID');
  validateCartAccess(req.user?.id, req.params.userId);

  if (!isRecord(req.body)) {
    throw new HttpError(400, '요청 본문이 올바르지 않습니다.');
  }

  const productId = req.body.productId;
  if (typeof productId !== 'string') {
    throw new HttpError(400, '상품 ID를 입력해주세요.');
  }

  validateObjectId(productId, '상품 ID');

  const cart = await addCartItemData(req.params.userId, {
    product: new Types.ObjectId(productId),
    quantity: normalizeQuantity(req.body.quantity),
    color: normalizeOptionalString(req.body.color, '색상'),
    size: normalizeOptionalString(req.body.size, '사이즈'),
  });

  const populatedCart = await cart.populate('items.product');
  res.status(201).json(serializeCart(populatedCart));
});

export const updateCartItem: RequestHandler = asyncHandler(async (req, res) => {
  validateObjectId(req.params.userId, '사용자 ID');
  validateCartAccess(req.user?.id, req.params.userId);
  validateObjectId(req.params.productId, '상품 ID');

  if (!isRecord(req.body)) {
    throw new HttpError(400, '요청 본문이 올바르지 않습니다.');
  }

  const cart = await updateCartItemQuantityData(
    req.params.userId,
    req.params.productId,
    normalizeQuantity(req.body.quantity),
  );

  if (!cart) {
    throw new HttpError(404, '장바구니 상품을 찾을 수 없습니다.');
  }

  res.json(serializeCart(cart));
});

export const deleteCartItem: RequestHandler = asyncHandler(async (req, res) => {
  validateObjectId(req.params.userId, '사용자 ID');
  validateCartAccess(req.user?.id, req.params.userId);
  validateObjectId(req.params.productId, '상품 ID');

  const cart = await deleteCartItemData(req.params.userId, req.params.productId);
  if (!cart) {
    throw new HttpError(404, '장바구니를 찾을 수 없습니다.');
  }

  res.json(serializeCart(cart));
});

export const clearCart: RequestHandler = asyncHandler(async (req, res) => {
  validateObjectId(req.params.userId, '사용자 ID');
  validateCartAccess(req.user?.id, req.params.userId);

  const cart = await clearCartData(req.params.userId);
  if (!cart) {
    throw new HttpError(404, '장바구니를 찾을 수 없습니다.');
  }

  res.json(serializeCart(cart));
});
