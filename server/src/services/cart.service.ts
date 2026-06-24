import type { Types } from 'mongoose';

import { CartModel } from '../models/index.js';

export type CartItemPayload = {
  product: Types.ObjectId;
  quantity: number;
  color?: string;
  size?: string;
};

export const getCartByUserId = async (userId: string) =>
  CartModel.findOne({ user: userId }).populate('items.product');

export const getOrCreateCartByUserId = async (userId: string) =>
  CartModel.findOneAndUpdate(
    { user: userId },
    { $setOnInsert: { user: userId, items: [] } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  ).populate('items.product');

export const addCartItemData = async (userId: string, payload: CartItemPayload) => {
  const cart = await CartModel.findOne({ user: userId });

  if (!cart) {
    return CartModel.create({
      user: userId,
      items: [payload],
    });
  }

  const existingItem = cart.items.find(
    (item) =>
      String(item.product) === String(payload.product) &&
      item.color === payload.color &&
      item.size === payload.size,
  );

  if (existingItem) {
    existingItem.quantity += payload.quantity;
  } else {
    cart.items.push(payload);
  }

  return cart.save();
};

export const updateCartItemQuantityData = async (
  userId: string,
  productId: string,
  quantity: number,
) =>
  CartModel.findOneAndUpdate(
    { user: userId, 'items.product': productId },
    { $set: { 'items.$.quantity': quantity } },
    { new: true, runValidators: true },
  ).populate('items.product');

export const deleteCartItemData = async (userId: string, productId: string) =>
  CartModel.findOneAndUpdate(
    { user: userId },
    { $pull: { items: { product: productId } } },
    { new: true },
  ).populate('items.product');

export const clearCartData = async (userId: string) =>
  CartModel.findOneAndUpdate({ user: userId }, { $set: { items: [] } }, { new: true }).populate(
    'items.product',
  );
