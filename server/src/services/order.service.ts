import { OrderModel } from '../models/index.js';

type OrderItemPayload = {
  product: unknown;
  name: string;
  image: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
};

export type ShippingAddressPayload = {
  recipient: string;
  phone: string;
  address1: string;
  address2?: string;
  memo?: string;
};

export type CreateOrderPayload = {
  user: string;
  items: OrderItemPayload[];
  shippingAddress: ShippingAddressPayload;
  paymentMethod: string;
  paymentKey: string;
  paymentAmount: number;
  paymentTransactionId?: string;
  subtotal: number;
  shippingFee: number;
  total: number;
};

const createOrderNumber = () => {
  const now = new Date();
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('');
  const time = [
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
    String(now.getSeconds()).padStart(2, '0'),
  ].join('');
  const random = Math.floor(1000 + Math.random() * 9000);

  return `${date}-${time}-${random}`;
};

export const getOrderListByUserId = async (userId: string) =>
  OrderModel.find({ user: userId }).sort({ createdAt: -1 });

export const getOrderById = async (id: string) => OrderModel.findById(id);

export const getOrderByPaymentKey = async (userId: string, paymentKey: string) =>
  OrderModel.findOne({ user: userId, paymentKey });

export const getRecentActiveOrderList = async (userId: string, since: Date, total: number) =>
  OrderModel.find({
    user: userId,
    total,
    paymentStatus: { $in: ['pending', 'paid'] },
    status: { $ne: 'cancelled' },
    createdAt: { $gte: since },
  }).sort({ createdAt: -1 });

export const createOrderData = async (payload: CreateOrderPayload) =>
  OrderModel.create({
    ...payload,
    orderNumber: createOrderNumber(),
    paymentStatus: 'paid',
    status: 'paid',
  });
