import type { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';

import { PRODUCT_CATEGORIES } from '../models/index.js';
import {
  createProductData,
  deleteProductData,
  getProductById,
  getProductBySku,
  getProductList,
  updateProductData,
  type ProductPayload,
} from '../services/index.js';
import { asyncHandler, HttpError } from '../utils/index.js';

const productFields = ['sku', 'name', 'price', 'category', 'image', 'description'] as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const normalizeString = (value: unknown, fieldLabel: string): string | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== 'string') {
    throw new HttpError(400, `${fieldLabel}은 문자열이어야 합니다.`);
  }

  const trimmed = value.trim();
  if (!trimmed) {
    throw new HttpError(400, `${fieldLabel}을 입력해주세요.`);
  }

  return trimmed;
};

const normalizeOptionalString = (value: unknown, fieldLabel: string): string | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== 'string') {
    throw new HttpError(400, `${fieldLabel}은 문자열이어야 합니다.`);
  }

  const trimmed = value.trim();
  return trimmed || undefined;
};

const normalizePrice = (value: unknown): number | undefined => {
  if (value === undefined) {
    return undefined;
  }

  const price = typeof value === 'string' ? Number(value) : value;

  if (typeof price !== 'number' || !Number.isFinite(price) || price < 0) {
    throw new HttpError(400, '상품가격은 0 이상의 숫자여야 합니다.');
  }

  return price;
};

const normalizeCategory = (value: unknown): string | undefined => {
  const category = normalizeString(value, '카테고리');

  if (category && !PRODUCT_CATEGORIES.includes(category as (typeof PRODUCT_CATEGORIES)[number])) {
    throw new HttpError(400, '카테고리는 top, bottom, accessory 중 하나여야 합니다.');
  }

  return category;
};

const pickProductPayload = (body: unknown): ProductPayload => {
  if (!isRecord(body)) {
    return {};
  }

  return productFields.reduce<ProductPayload>((payload, field) => {
    const value = body[field];

    if (value === undefined) {
      return payload;
    }

    switch (field) {
      case 'sku':
        return { ...payload, sku: normalizeString(value, 'SKU') };
      case 'name':
        return { ...payload, name: normalizeString(value, '상품 이름') };
      case 'price':
        return { ...payload, price: normalizePrice(value) };
      case 'category':
        return { ...payload, category: normalizeCategory(value) };
      case 'image':
        return { ...payload, image: normalizeString(value, '이미지') };
      case 'description':
        return { ...payload, description: normalizeOptionalString(value, '설명') };
      default:
        return payload;
    }
  }, {});
};

const validateProductId = (id: string) => {
  if (!isValidObjectId(id)) {
    throw new HttpError(400, '유효하지 않은 상품 ID입니다.');
  }
};

function validateRequiredProductPayload(
  payload: ProductPayload,
): asserts payload is ProductPayload & {
  sku: string;
  name: string;
  price: number;
  category: string;
  image: string;
} {
  if (!payload.sku) {
    throw new HttpError(400, 'SKU를 입력해주세요.');
  }

  if (!payload.name) {
    throw new HttpError(400, '상품 이름을 입력해주세요.');
  }

  if (payload.price === undefined) {
    throw new HttpError(400, '상품가격을 입력해주세요.');
  }

  if (!payload.category) {
    throw new HttpError(400, '카테고리를 입력해주세요.');
  }

  if (!payload.image) {
    throw new HttpError(400, '이미지를 입력해주세요.');
  }
}

const serializeProduct = (product: {
  _id: unknown;
  sku: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description?: string | null;
}) => ({
  id: String(product._id),
  sku: product.sku,
  name: product.name,
  price: product.price,
  category: product.category,
  image: product.image,
  description: product.description,
});

export const getProducts: RequestHandler = asyncHandler(async (_req, res) => {
  const products = await getProductList();

  res.json(products.map(serializeProduct));
});

export const getProduct: RequestHandler = asyncHandler(async (req, res) => {
  validateProductId(req.params.id);

  const product = await getProductById(req.params.id);
  if (!product) {
    throw new HttpError(404, '상품을 찾을 수 없습니다.');
  }

  res.json(serializeProduct(product));
});

export const createProduct: RequestHandler = asyncHandler(async (req, res) => {
  const payload = pickProductPayload(req.body);
  validateRequiredProductPayload(payload);

  const sku = payload.sku;
  const existingProduct = await getProductBySku(sku);
  if (existingProduct) {
    throw new HttpError(409, '이미 등록된 SKU입니다.');
  }

  const product = await createProductData(payload);

  res.status(201).json(serializeProduct(product));
});

export const updateProduct: RequestHandler = asyncHandler(async (req, res) => {
  validateProductId(req.params.id);

  const payload = pickProductPayload(req.body);

  if (payload.sku) {
    const existingProduct = await getProductBySku(payload.sku);
    if (existingProduct && String(existingProduct._id) !== req.params.id) {
      throw new HttpError(409, '이미 등록된 SKU입니다.');
    }
  }

  const product = await updateProductData(req.params.id, payload);
  if (!product) {
    throw new HttpError(404, '상품을 찾을 수 없습니다.');
  }

  res.json(serializeProduct(product));
});

export const deleteProduct: RequestHandler = asyncHandler(async (req, res) => {
  validateProductId(req.params.id);

  const product = await deleteProductData(req.params.id);
  if (!product) {
    throw new HttpError(404, '상품을 찾을 수 없습니다.');
  }

  res.status(204).send();
});
