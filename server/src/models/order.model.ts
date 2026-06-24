import { Schema, model, type InferSchemaType } from 'mongoose';

export const ORDER_STATUSES = [
  'pending',
  'paid',
  'preparing',
  'shipping',
  'delivered',
  'cancelled',
] as const;

export const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'cancelled', 'refunded'] as const;

const orderItemSchema = new Schema(
  {
    // 주문한 상품의 원본 Product 문서 참조
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    // 주문 시점의 상품명 스냅샷
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // 주문 시점의 상품 이미지 URL 스냅샷
    image: {
      type: String,
      required: true,
      trim: true,
    },
    // 주문 시점의 상품 단가
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    // 해당 상품의 주문 수량
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    // 선택한 색상 옵션
    color: {
      type: String,
      trim: true,
    },
    // 선택한 사이즈 옵션
    size: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const shippingAddressSchema = new Schema(
  {
    // 배송 받을 사람의 이름
    recipient: {
      type: String,
      required: true,
      trim: true,
    },
    // 배송 연락처
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    // 기본 배송 주소
    address1: {
      type: String,
      required: true,
      trim: true,
    },
    // 상세 배송 주소
    address2: {
      type: String,
      trim: true,
    },
    // 배송 요청사항
    memo: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const orderSchema = new Schema(
  // 주문 기본 정보
  {
    // 고객에게 노출할 주문 번호
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // 주문한 사용자 User 문서 참조
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // 주문 상품 목록  상품 정보는 주문 시점 기준으로 저장
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items: unknown[]) => items.length > 0,
        message: '주문 상품은 1개 이상이어야 합니다.',
      },
    },
    // 배송지 정보
    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },
    // 고객이 선택한 결제 수단
    paymentMethod: {
      type: String,
      required: true,
      trim: true,
    },
    // 결제 처리 상태
    paymentStatus: {
      type: String,
      required: true,
      enum: PAYMENT_STATUSES,
      default: 'pending',
    },
    // 주문 처리 상태
    status: {
      type: String,
      required: true,
      enum: ORDER_STATUSES,
      default: 'pending',
    },
    // 배송비를 제외한 상품 금액 합계
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    // 배송비
    shippingFee: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    // 최종 결제 금액
    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });

export type Order = InferSchemaType<typeof orderSchema>;

export const OrderModel = model<Order>('Order', orderSchema);
