import { Schema, model, type InferSchemaType } from 'mongoose';

export const PRODUCT_CATEGORIES = ['top', 'bottom', 'accessory'] as const;

const productSchema = new Schema(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: PRODUCT_CATEGORIES,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export type Product = InferSchemaType<typeof productSchema>;

export const ProductModel = model<Product>('Product', productSchema);
