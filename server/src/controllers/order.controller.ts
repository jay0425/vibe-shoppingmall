import type { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';

import {
  clearCartData,
  createOrderData,
  getCartByUserId,
  getOrderById,
  getOrderByPaymentKey,
  getOrderListByUserId,
  getRecentActiveOrderList,
  verifyPortonePayment,
  type ShippingAddressPayload,
} from '../services/index.js';
import { asyncHandler, HttpError } from '../utils/index.js';

const FREE_SHIPPING_THRESHOLD = 50000;
const SHIPPING_FEE = 3000;
// 동일 상품 주문을 중복으로 볼 최근 주문 조회 범위
const DUPLICATE_ORDER_WINDOW_MS = 10 * 60 * 1000;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

// paymentKey unique index 충돌을 주문 중복 응답으로 바꾸기 위한 체크
const isDuplicateKeyError = (error: unknown) => isRecord(error) && error.code === 11000;

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

const normalizeRequiredNumber = (value: unknown, fieldLabel: string) => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    throw new HttpError(400, `${fieldLabel}이 올바르지 않습니다.`);
  }

  return value;
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

const pickPayment = (value: unknown) => {
  if (!isRecord(value)) {
    throw new HttpError(400, '결제 정보를 입력해주세요.');
  }

  // 클라이언트 결제 성공 후 넘어온 최소 결제 검증 값만 추림
  return {
    paymentKey: normalizeRequiredString(value.paymentKey, '결제 키'),
    paymentAmount: normalizeRequiredNumber(value.amount, '결제 금액'),
    paymentTransactionId: normalizeOptionalString(value.transactionId, '결제 거래 ID'),
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

const createOrderFingerprint = (
  items: {
    product: unknown;
    price: number;
    quantity: number;
    color?: string | null;
    size?: string | null;
  }[],
) =>
  // 상품, 가격, 수량, 옵션이 같으면 같은 주문 구성으로 판단
  items
    .map((item) =>
      [String(item.product), item.price, item.quantity, item.color ?? '', item.size ?? ''].join(
        ':',
      ),
    )
    .sort()
    .join('|');

const serializeOrder = (order: {
  _id: unknown;
  orderNumber: string;
  user: unknown;
  items: unknown[];
  shippingAddress: unknown;
  paymentMethod: string;
  paymentKey: string;
  paymentAmount: number;
  paymentTransactionId?: string | null;
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
  paymentKey: order.paymentKey,
  paymentAmount: order.paymentAmount,
  paymentTransactionId: order.paymentTransactionId ?? undefined,
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
  const payment = pickPayment(req.body.payment);

  // 클라이언트가 보낸 결제 금액이 서버 계산 금액과 같은지 1차 확인
  if (payment.paymentAmount !== total) {
    throw new HttpError(400, '결제 금액이 주문 금액과 일치하지 않습니다.');
  }

  // 포트원 서버에서 실제 결제 상태, 상점, 통화, 금액을 다시 검증
  const verifiedPayment = await verifyPortonePayment({
    paymentKey: payment.paymentKey,
    expectedAmount: total,
  });

  // 같은 결제 키로 이미 생성된 주문이 있으면 재주문 차단
  const existingOrder = await getOrderByPaymentKey(req.user.id, payment.paymentKey);
  if (existingOrder) {
    throw new HttpError(409, '이미 처리된 결제 주문입니다.');
  }

  // 짧은 시간 안에 같은 상품 구성과 같은 금액의 주문이 있으면 중복 주문으로 판단
  const duplicateSince = new Date(Date.now() - DUPLICATE_ORDER_WINDOW_MS);
  const recentOrders = await getRecentActiveOrderList(req.user.id, duplicateSince, total);
  const orderFingerprint = createOrderFingerprint(items);
  const duplicateOrder = recentOrders.find(
    (recentOrder) => createOrderFingerprint(recentOrder.items) === orderFingerprint,
  );

  if (duplicateOrder) {
    throw new HttpError(409, '최근 동일한 주문이 이미 생성되었습니다.');
  }

  const order = await createOrderData({
    user: req.user.id,
    items,
    shippingAddress: pickShippingAddress(req.body.shippingAddress),
    paymentMethod: normalizeRequiredString(req.body.paymentMethod, '결제 수단'),
    paymentKey: verifiedPayment.paymentKey,
    paymentAmount: verifiedPayment.paymentAmount,
    paymentTransactionId: verifiedPayment.paymentTransactionId ?? payment.paymentTransactionId,
    subtotal,
    shippingFee,
    total,
  }).catch((error: unknown) => {
    // 동시 요청으로 unique index가 먼저 잡힌 경우도 중복 결제로 응답
    if (isDuplicateKeyError(error)) {
      throw new HttpError(409, '이미 처리된 결제 주문입니다.');
    }

    throw error;
  });

  await clearCartData(req.user.id);

  res.status(201).json(serializeOrder(order));
});
