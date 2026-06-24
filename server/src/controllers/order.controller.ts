import type { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';

import {
  clearCartData,
  createOrderData,
  getCartByUserId,
  getOrderById,
  getOrderListByUserId,
  type ShippingAddressPayload,
} from '../services/index.js';
import { asyncHandler, HttpError } from '../utils/index.js';

const FREE_SHIPPING_THRESHOLD = 50000;
const SHIPPING_FEE = 3000;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const validateObjectId = (id: string, fieldLabel: string) => {
  if (!isValidObjectId(id)) {
    throw new HttpError(400, `유효하지 않은 ${fieldLabel}입니다.`);
  }
};

const normalizeRequiredString = (value: unknown, fieldLabel: string) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new HttpError(400, `${fieldLabel}을 입력해주세요.`);
  }

  return value.trim();
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

const pickShippingAddress = (value: unknown): ShippingAddressPayload => {
  if (!isRecord(value)) {
    throw new HttpError(400, '배송지 정보를 입력해주세요.');
  }

  return {
    recipient: normalizeRequiredString(value.recipient, '받는 분'),
    phone: normalizeRequiredString(value.phone, '연락처'),
    address1: normalizeRequiredString(value.address1, '기본 주소'),
    address2: normalizeOptionalString(value.address2, '상세 주소'),
    memo: normalizeOptionalString(value.memo, '배송 요청사항'),
  };
};

const getProductSnapshot = (product: unknown) => {
  if (!isRecord(product)) {
    throw new HttpError(400, '장바구니 상품 정보가 올바르지 않습니다.');
  }

  const id = product._id;
  const name = product.name;
  const image = product.image;
  const price = product.price;

  if (!id || typeof name !== 'string' || typeof image !== 'string' || typeof price !== 'number') {
    throw new HttpError(400, '장바구니 상품 정보가 올바르지 않습니다.');
  }

  return {
    product: id,
    name,
    image,
    price,
  };
};

const serializeOrder = (order: {
  _id: unknown;
  orderNumber: string;
  user: unknown;
  items: unknown[];
  shippingAddress: unknown;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
}) => ({
  id: String(order._id),
  orderNumber: order.orderNumber,
  user: String(order.user),
  items: order.items,
  shippingAddress: order.shippingAddress,
  paymentMethod: order.paymentMethod,
  paymentStatus: order.paymentStatus,
  status: order.status,
  subtotal: order.subtotal,
  shippingFee: order.shippingFee,
  total: order.total,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
});

export const getOrders: RequestHandler = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new HttpError(401, '인증이 필요합니다.');
  }

  const orders = await getOrderListByUserId(req.user.id);
  res.json(orders.map(serializeOrder));
});

export const getOrder: RequestHandler = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new HttpError(401, '인증이 필요합니다.');
  }

  validateObjectId(req.params.id, '주문 ID');

  const order = await getOrderById(req.params.id);
  if (!order) {
    throw new HttpError(404, '주문을 찾을 수 없습니다.');
  }

  if (String(order.user) !== req.user.id) {
    throw new HttpError(403, '다른 사용자의 주문에 접근할 수 없습니다.');
  }

  res.json(serializeOrder(order));
});

export const createOrder: RequestHandler = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new HttpError(401, '인증이 필요합니다.');
  }

  if (!isRecord(req.body)) {
    throw new HttpError(400, '요청 본문이 올바르지 않습니다.');
  }

  const cart = await getCartByUserId(req.user.id);
  if (!cart || cart.items.length === 0) {
    throw new HttpError(400, '장바구니가 비어 있습니다.');
  }

  const items = cart.items.map((item) => {
    const product = getProductSnapshot(item.product);

    return {
      ...product,
      quantity: item.quantity,
      color: item.color ?? undefined,
      size: item.size ?? undefined,
    };
  });
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;
  const order = await createOrderData({
    user: req.user.id,
    items,
    shippingAddress: pickShippingAddress(req.body.shippingAddress),
    paymentMethod: normalizeRequiredString(req.body.paymentMethod, '결제 수단'),
    subtotal,
    shippingFee,
    total,
  });

  await clearCartData(req.user.id);

  res.status(201).json(serializeOrder(order));
});
