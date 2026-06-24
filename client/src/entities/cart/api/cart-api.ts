import { httpClient } from '@/shared/api';

export type CartProduct = {
  _id?: string;
  id?: string;
  name?: string;
  price?: number;
  image?: string;
};

export type CartApiItem = {
  product: string | CartProduct;
  quantity: number;
  color?: string | null;
  size?: string | null;
};

export type Cart = {
  id: string;
  user: string;
  items: CartApiItem[];
};

export type AddCartItemPayload = {
  productId: string;
  quantity: number;
  color?: string;
  size?: string;
};

const authHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
});

export const getCart = (userId: string, accessToken: string): Promise<Cart> =>
  httpClient<Cart>(`/api/carts/${userId}`, {
    headers: authHeaders(accessToken),
  });

export const addCartItem = (
  userId: string,
  accessToken: string,
  payload: AddCartItemPayload,
): Promise<Cart> =>
  httpClient<Cart>(`/api/carts/${userId}/items`, {
    method: 'POST',
    headers: authHeaders(accessToken),
    body: payload,
  });

export const updateCartItem = (
  userId: string,
  productId: string,
  accessToken: string,
  quantity: number,
): Promise<Cart> =>
  httpClient<Cart>(`/api/carts/${userId}/items/${productId}`, {
    method: 'PATCH',
    headers: authHeaders(accessToken),
    body: { quantity },
  });

export const deleteCartItem = (
  userId: string,
  productId: string,
  accessToken: string,
): Promise<Cart> =>
  httpClient<Cart>(`/api/carts/${userId}/items/${productId}`, {
    method: 'DELETE',
    headers: authHeaders(accessToken),
  });

export const clearCart = (userId: string, accessToken: string): Promise<Cart> =>
  httpClient<Cart>(`/api/carts/${userId}/items`, {
    method: 'DELETE',
    headers: authHeaders(accessToken),
  });
