import type { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';

import { getAdminOrderList, getOrderById } from '../services/index.js';
import { asyncHandler, HttpError } from '../utils/index.js';
import { serializeOrder } from './order.controller.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

const requireAdmin = (user: Express.Request['user']) => {
  if (!user) {
    throw new HttpError(401, '인증이 필요합니다.');
  }

  if (user.user_type !== 'admin') {
    throw new HttpError(403, '관리자만 접근할 수 있습니다.');
  }
};

const pickQueryString = (value: unknown, fieldLabel: string) => {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== 'string') {
    throw new HttpError(400, `${fieldLabel}은 문자열이어야 합니다.`);
  }

  const trimmed = value.trim();
  return trimmed || undefined;
};

const pickPositiveInteger = (value: unknown, defaultValue: number, fieldLabel: string) => {
  if (value === undefined) {
    return defaultValue;
  }

  if (typeof value !== 'string' || !/^\d+$/.test(value)) {
    throw new HttpError(400, `${fieldLabel}은 양의 정수여야 합니다.`);
  }

  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1) {
    throw new HttpError(400, `${fieldLabel}은 양의 정수여야 합니다.`);
  }

  return parsed;
};

const pickAdminOrderListQuery = (query: Record<string, unknown>) => {
  const page = pickPositiveInteger(query.page, DEFAULT_PAGE, '페이지');
  const requestedLimit = pickPositiveInteger(query.limit, DEFAULT_LIMIT, '페이지 크기');
  const limit = Math.min(requestedLimit, MAX_LIMIT);
  const userId = pickQueryString(query.userId, '유저 ID');

  if (userId && !isValidObjectId(userId)) {
    throw new HttpError(400, '유효하지 않은 유저 ID입니다.');
  }

  return {
    status: pickQueryString(query.status, '주문 상태'),
    paymentStatus: pickQueryString(query.paymentStatus, '결제 상태'),
    userId,
    orderNumber: pickQueryString(query.orderNumber, '주문 번호'),
    page,
    limit,
  };
};

export const getAdminOrders: RequestHandler = asyncHandler(async (req, res) => {
  requireAdmin(req.user);

  const { orders, pagination } = await getAdminOrderList(pickAdminOrderListQuery(req.query));

  res.json({
    orders: orders.map(serializeOrder),
    pagination,
  });
});

export const getAdminOrder: RequestHandler = asyncHandler(async (req, res) => {
  requireAdmin(req.user);

  if (!isValidObjectId(req.params.id)) {
    throw new HttpError(400, '유효하지 않은 주문 ID입니다.');
  }

  const order = await getOrderById(req.params.id);
  if (!order) {
    throw new HttpError(404, '주문을 찾을 수 없습니다.');
  }

  res.json(serializeOrder(order));
});
