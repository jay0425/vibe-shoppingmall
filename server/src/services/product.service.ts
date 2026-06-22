import { ProductModel } from '../models/index.js';

export type ProductPayload = {
  sku?: string;
  name?: string;
  price?: number;
  category?: string;
  image?: string;
  description?: string;
};

export const getProductList = async () => ProductModel.find().sort({ createdAt: -1 });

export const getPaginatedProductList = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  const skip = (page - 1) * limit;
  const [products, total] = await Promise.all([
    ProductModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    ProductModel.countDocuments(),
  ]);

  return { products, total };
};

export const getProductById = async (id: string) => ProductModel.findById(id);

export const getProductBySku = async (sku: string) =>
  ProductModel.findOne({ sku: sku.trim() });

export const createProductData = async (payload: ProductPayload) =>
  ProductModel.create(payload);

export const updateProductData = async (id: string, payload: ProductPayload) =>
  ProductModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

export const deleteProductData = async (id: string) => ProductModel.findByIdAndDelete(id);
