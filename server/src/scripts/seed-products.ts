import 'dotenv/config';

import mongoose from 'mongoose';

import { env } from '../config/env.js';
import { ProductModel } from '../models/index.js';

const sourceProducts = [
  {
    name: '코튼 러플 블라우스',
    price: 39000,
    category: 'top',
    image: '/products/blouse-cream.png',
    description: '은은한 러플 디테일로 여성스러움을 더한 데일리 블라우스',
  },
  {
    name: '소프트 니트 가디건',
    price: 46000,
    category: 'top',
    image: '/products/knit-pink.png',
    description: '포근한 감촉의 데일리 니트 가디건',
  },
  {
    name: '플로럴 미디 원피스',
    price: 58000,
    category: 'top',
    image: '/products/dress-floral.png',
    description: '잔잔한 플로럴 패턴의 사랑스러운 미디 원피스',
  },
  {
    name: '플리츠 미디 스커트',
    price: 42000,
    category: 'bottom',
    image: '/products/skirt-beige.png',
    description: '우아한 플리츠 라인의 미디 스커트',
  },
  {
    name: '테일러드 울 코트',
    price: 128000,
    category: 'top',
    image: '/products/coat-camel.png',
    description: '고급스러운 핏의 울 혼방 테일러드 코트',
  },
  {
    name: '코튼 셔츠 블라우스',
    price: 36000,
    category: 'top',
    image: '/products/blouse-white.png',
    description: '깔끔한 핏의 베이직 코튼 셔츠',
  },
  {
    name: '와이드 슬랙스 팬츠',
    price: 48000,
    category: 'bottom',
    image: '/products/pants-ivory.png',
    description: '다리 라인을 길어 보이게 하는 와이드 슬랙스',
  },
  {
    name: '린넨 서머 원피스',
    price: 54000,
    category: 'top',
    image: '/products/dress-blue.png',
    description: '시원한 린넨 소재의 여름 원피스',
  },
] as const;

const products = Array.from({ length: 23 }, (_, index) => {
  const source = sourceProducts[index % sourceProducts.length];
  const sequence = String(index + 1).padStart(3, '0');
  const createdAt = new Date(Date.now() - index * 1000);

  return {
    ...source,
    sku: `SEED-${sequence}`,
    name: `${source.name} ${sequence}`,
    createdAt,
    updatedAt: createdAt,
  };
});

async function seedProducts() {
  await mongoose.connect(env.mongoUri);

  const result = await ProductModel.bulkWrite(
    products.map((product) => ({
      updateOne: {
        filter: { sku: product.sku },
        update: { $set: product },
        upsert: true,
      },
    })),
  );

  const total = await ProductModel.countDocuments();

  console.log(
    `상품 seed 완료: inserted=${result.upsertedCount}, modified=${result.modifiedCount}, matched=${result.matchedCount}, total=${total}`,
  );

  await mongoose.connection.close();
}

seedProducts().catch((error) => {
  console.error('상품 seed 실패', error);
  void mongoose.connection.close().finally(() => {
    process.exit(1);
  });
});
