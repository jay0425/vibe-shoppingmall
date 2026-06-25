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

export type ShippingAddress = {
  recipient: string;
  phone: string;
  address1: string;
  address2?: string | null;
  memo?: string | null;
};

export type Order = {
  id: string;
  orderNumber: string;
  user: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentKey: string;
  paymentAmount: number;
  paymentTransactionId?: string;
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
  payment: {
    paymentKey: string;
    amount: number;
    transactionId?: string;
  };
};

export type AdminOrdersParams = {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  userId?: string;
  orderNumber?: string;
};

export type AdminOrdersResponse = {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
};

const authHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
});

const toSearchParams = (params: AdminOrdersParams) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.set(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

export const getOrders = (accessToken: string): Promise<Order[]> =>
  httpClient<Order[]>('/api/orders', {
    headers: authHeaders(accessToken),
  });

export const getAdminOrders = (
  accessToken: string,
  params: AdminOrdersParams = {},
): Promise<AdminOrdersResponse> =>
  httpClient<AdminOrdersResponse>(`/api/admin/orders${toSearchParams(params)}`, {
    headers: authHeaders(accessToken),
  });

export const createOrder = (accessToken: string, payload: CreateOrderPayload): Promise<Order> =>
  httpClient<Order>('/api/orders', {
    method: 'POST',
    headers: authHeaders(accessToken),
    body: payload,
  });
