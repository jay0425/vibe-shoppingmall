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

const authHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
});

export const getOrders = (accessToken: string): Promise<Order[]> =>
  httpClient<Order[]>('/api/orders', {
    headers: authHeaders(accessToken),
  });
