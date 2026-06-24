import { httpClient } from '@/shared/api';

export type OrderStatus = 'pending' | 'paid' | 'preparing' | 'shipping' | 'delivered' | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded';

export type OrderItem = {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  color?: string | null;
  size?: string | null;
};

export type Order = {
  id: string;
  orderNumber: string;
  user: string;
  items: OrderItem[];
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  subtotal: number;
  shippingFee: number;
  total: number;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateOrderPayload = {
  shippingAddress: {
    recipient: string;
    phone: string;
    address1: string;
    address2?: string;
    memo?: string;
  };
  paymentMethod: string;
};

const authHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
});

export const getOrders = (accessToken: string): Promise<Order[]> =>
  httpClient<Order[]>('/api/orders', {
    headers: authHeaders(accessToken),
  });

export const createOrder = (accessToken: string, payload: CreateOrderPayload): Promise<Order> =>
  httpClient<Order>('/api/orders', {
    method: 'POST',
    headers: authHeaders(accessToken),
    body: payload,
  });
